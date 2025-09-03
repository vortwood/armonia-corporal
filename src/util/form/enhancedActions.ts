import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { getProfessionalById, validateAppointment } from "../dynamicScheduling";
import { sendEmail } from "../email/resend";
import db from "../firestore";
import type { SubmitResponse } from "../types";

// Rate limiting map (in production, use Redis)
const submissionAttempts = new Map<
  string,
  { count: number; lastAttempt: number }
>();
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

interface EnhancedFormData {
  name: string;
  phone: string;
  email: string;
  hora: string;
  selectedServices: string[];
  professionalId: string;
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
}

/**
 * Enhanced form submission with security validation and rate limiting
 */
export async function enhancedHandleSubmit(
  formData: EnhancedFormData,
): Promise<SubmitResponse> {
  try {
    // Input validation and sanitization
    const validation = validateInput(formData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorType: "VALIDATION_ERROR",
      };
    }

    // Rate limiting check
    const rateLimitCheck = checkRateLimit(formData.email);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: "Demasiados intentos. Intenta nuevamente en unos minutos.",
        errorType: "VALIDATION_ERROR",
      };
    }

    // Server-side appointment validation
    const selectedDate = new Date(formData.selectedDate);
    const appointmentValidation = await validateAppointment(
      formData.professionalId,
      selectedDate,
      formData.selectedTime,
      formData.selectedServices,
    );

    if (!appointmentValidation.valid) {
      recordAttempt(formData.email);
      return {
        success: false,
        error: appointmentValidation.error || "Error de validación",
        errorType: "VALIDATION_ERROR",
      };
    }

    // Final conflict check with database lock simulation
    const conflictCheck = await checkFinalConflicts(formData);
    if (!conflictCheck.success) {
      recordAttempt(formData.email);
      return conflictCheck;
    }

    // Get professional information
    const professional = await getProfessionalById(formData.professionalId);
    if (!professional) {
      recordAttempt(formData.email);
      return {
        success: false,
        error: "Profesional no encontrado",
        errorType: "VALIDATION_ERROR",
      };
    }

    // Create appointment document for modern unified collection
    const appointmentData = {
      // Client information
      name: formData.name,
      phone: formData.phone,
      mail: formData.email,

      // Appointment details
      hora: formData.hora,
      tipos: formData.selectedServices,
      persona: professional.name, // Keep for compatibility with existing code
      professionalId: formData.professionalId,

      // Additional metadata
      totalPrice: formData.totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save to unified appointments collection only
    try {
      await addDoc(collection(db, "appointments"), appointmentData);
    } catch (error) {
      console.error("Error saving appointment:", error);
      recordAttempt(formData.email);
      return {
        success: false,
        error: "Error al guardar la reserva",
        errorType: "SERVER_ERROR",
      };
    }

    // Send confirmation emails
    try {
      console.log("Attempting to send email with data:", {
        email: formData.email,
        name: formData.name,
        hora: formData.hora,
        tipos: formData.selectedServices,
        phone: formData.phone,
        persona: professional.name,
      });

      const emailResult = await sendEmail({
        to: [
          {
            email: formData.email,
            name: formData.name,
            hora: formData.hora,
            tipos: formData.selectedServices,
            phone: formData.phone,
            persona: professional.name,
          },
        ],
      });

      console.log("Email sending result:", emailResult);

      if (!emailResult.success) {
        console.error("Email failed with error:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the appointment if email fails
    }

    // Clear rate limiting for successful submission
    submissionAttempts.delete(formData.email);

    return { success: true };
  } catch (error) {
    console.error("Enhanced form submission error:", error);
    recordAttempt(formData.email);
    return {
      success: false,
      error: "Error interno del servidor",
      errorType: "SERVER_ERROR",
    };
  }
}

/**
 * Validates and sanitizes input data
 */
function validateInput(formData: EnhancedFormData): {
  valid: boolean;
  error?: string;
} {
  // Regex patterns
  const URUGUAYAN_PHONE_REGEX = /^(09\d{7})$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

  // Validate name
  if (!NAME_REGEX.test(formData.name.trim())) {
    return { valid: false, error: "Nombre inválido" };
  }

  // Validate phone
  const cleanPhone = formData.phone.replace(/\s+/g, "");
  if (!URUGUAYAN_PHONE_REGEX.test(cleanPhone)) {
    return { valid: false, error: "Teléfono inválido. Formato: 09XXXXXXX" };
  }

  // Validate email
  if (
    !EMAIL_REGEX.test(formData.email.toLowerCase()) ||
    formData.email.length > 100
  ) {
    return { valid: false, error: "Email inválido" };
  }

  // Validate services
  if (!formData.selectedServices || formData.selectedServices.length === 0) {
    return { valid: false, error: "Debe seleccionar al menos un servicio" };
  }

  // Validate required fields
  console.log("VALIDATION - hora:", formData.hora);
  console.log("VALIDATION - professionalId:", formData.professionalId);
  if (!formData.hora || !formData.professionalId) {
    console.log("VALIDATION FAILED - Missing required fields");
    return { valid: false, error: "Datos de reserva incompletos" };
  }

  // Validate date format
  try {
    const selectedDate = new Date(formData.selectedDate);
    if (isNaN(selectedDate.getTime())) {
      return { valid: false, error: "Fecha inválida" };
    }

    // Check if date is in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      return {
        valid: false,
        error: "No se pueden agendar citas en fechas pasadas",
      };
    }
  } catch {
    return { valid: false, error: "Fecha inválida" };
  }

  return { valid: true };
}

/**
 * Rate limiting implementation
 */
function checkRateLimit(identifier: string): { allowed: boolean } {
  const now = Date.now();
  const key = identifier.toLowerCase();

  const attempts = submissionAttempts.get(key);

  if (!attempts) {
    return { allowed: true };
  }

  // Clean expired attempts
  if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    submissionAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: attempts.count < MAX_ATTEMPTS };
}

/**
 * Record a failed attempt for rate limiting
 */
function recordAttempt(identifier: string): void {
  const now = Date.now();
  const key = identifier.toLowerCase();

  const attempts = submissionAttempts.get(key) || {
    count: 0,
    lastAttempt: now,
  };

  attempts.count += 1;
  attempts.lastAttempt = now;

  submissionAttempts.set(key, attempts);
}

/**
 * Final conflict check before saving to database
 */
async function checkFinalConflicts(
  formData: EnhancedFormData,
): Promise<SubmitResponse> {
  try {
    // Check unified appointments collection only
    const appointmentQuery = query(
      collection(db, "appointments"),
      where("professionalId", "==", formData.professionalId),
      where("hora", "==", formData.hora),
    );

    const appointmentSnapshot = await getDocs(appointmentQuery);
    if (!appointmentSnapshot.empty) {
      return {
        success: false,
        error: "Este horario ya fue reservado por otro cliente",
        errorType: "SCHEDULE_CONFLICT",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return {
      success: false,
      error: "Error verificando disponibilidad",
      errorType: "SERVER_ERROR",
    };
  }
}
