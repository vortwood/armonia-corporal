import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import db from "./firestore";
import type { DaySchedule, Professional, Service, TimeSlot } from "./types";

// Cache to avoid repeated database calls
let professionalsCache: Professional[] | null = null;
let servicesCache: Service[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Gets all active professionals from database with caching
 */
export const getActiveProfessionals = async (): Promise<Professional[]> => {
  const now = Date.now();

  // Return cached data if still valid
  if (professionalsCache && now - cacheTimestamp < CACHE_DURATION) {
    return professionalsCache.filter((h) => h.isActive);
  }

  try {
    const professionalsQuery = query(
      collection(db, "professionals"),
      where("isActive", "==", true),
    );

    const querySnapshot = await getDocs(professionalsQuery);
    const professionals = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Professional[];

    // Update cache
    professionalsCache = professionals;
    cacheTimestamp = now;

    return professionals;
  } catch (error) {
    console.error("Error fetching professionals:", error);
    // Throw error for UI handling instead of returning empty array
    throw new Error(
      "No se pudieron cargar los profesionales. Verifica tu conexión e inténtalo nuevamente.",
    );
  }
};

/**
 * Gets all active services from database with caching
 */
export const getActiveServices = async (): Promise<Service[]> => {
  const now = Date.now();

  // Return cached data if still valid
  if (servicesCache && now - cacheTimestamp < CACHE_DURATION) {
    return servicesCache.filter((s) => s.isActive);
  }

  try {
    const servicesQuery = query(
      collection(db, "services"),
      where("isActive", "==", true),
    );

    const querySnapshot = await getDocs(servicesQuery);
    const services = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];

    // Update cache
    servicesCache = services;
    if (!professionalsCache) cacheTimestamp = now; // Only update if not already set

    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

/**
 * Gets a specific professional by ID
 */
export const getProfessionalById = async (
  id: string,
): Promise<Professional | null> => {
  try {
    const docRef = doc(db, "professionals", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Professional;
    }

    return null;
  } catch (error) {
    console.error("Error fetching professional:", error);
    return null;
  }
};

/**
 * Gets services offered by a specific professional
 */
export const getProfessionalServices = async (
  professionalId: string,
): Promise<Service[]> => {
  try {
    const professional = await getProfessionalById(professionalId);

    if (!professional) {
      return [];
    }

    const allServices = await getActiveServices();

    // Filter services that this professional offers
    const filteredServices = allServices.filter(
      (service) =>
        professional.services.includes(service.id) ||
        professional.services.includes(service.name), // Backward compatibility
    );

    return filteredServices;
  } catch (error) {
    console.error("Error fetching professional services:", error);
    return [];
  }
};

/**
 * Generates time slots for a professional based on their day-specific schedule
 */
export const generateProfessionalTimeSlots = (
  professional: Professional,
  selectedDate: Date,
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayOfWeek = getDayOfWeek(selectedDate);

  // Find the specific day's schedule
  const daySchedule = professional.schedule.weeklySchedule?.find(
    (day) => day.dayOfWeek === dayOfWeek,
  );

  if (!daySchedule?.isWorkingDay) {
    return slots; // No work on this day
  }

  // Use day-specific slot interval or default
  const interval =
    daySchedule.slotInterval || professional.schedule.defaultSlotInterval || 30;

  // Generate slots for each working period of this specific day
  const sortedPeriods = [...daySchedule.workingPeriods].sort(
    (a, b) => parseTime(a.startTime) - parseTime(b.startTime),
  );

  for (const period of sortedPeriods) {
    const startTime = parseTime(period.startTime);
    const endTime = parseTime(period.endTime);

    let currentTime = startTime;
    while (currentTime < endTime) {
      slots.push({
        time: formatTime(currentTime),
        available: true,
      });
      currentTime += interval;
    }
  }

  return slots;
};

/**
 * Gets available time slots for a professional on a specific date
 */
export const getAvailableTimeSlots = async (
  professionalId: string,
  selectedDate: Date,
): Promise<TimeSlot[]> => {
  try {
    const professional = await getProfessionalById(professionalId);
    if (!professional) return [];

    // Generate all possible time slots for this professional
    const allSlots = generateProfessionalTimeSlots(professional, selectedDate);

    // Get existing appointments for this professional on this date
    const bookedTimes = await getBookedTimes(professionalId, selectedDate);

    // Mark slots as unavailable if they're booked
    const result = allSlots.map((slot) => ({
      ...slot,
      available: !bookedTimes.includes(slot.time),
    }));

    return result;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return [];
  }
};

/**
 * Gets booked times for a professional on a specific date
 */
export const getBookedTimes = async (
  professionalId: string,
  selectedDate: Date,
): Promise<string[]> => {
  try {
    const professional = await getProfessionalById(professionalId);
    if (!professional) return [];

    // Format date for comparison (DD/MM/YYYY format used in existing system)
    const dateString = formatDateForFirebase(selectedDate);

    // Check unified appointments collection only
    const bookedTimes: string[] = [];

    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("professionalId", "==", professionalId),
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      appointmentsSnapshot.docs.forEach((doc) => {
        const appointment = doc.data();
        if (appointment.hora) {
          // Extract date and time from "DD/MM/YYYY - HH:MM" format
          const [appointmentDatePart, timePart] = appointment.hora.split(" - ");
          if (appointmentDatePart === dateString && timePart) {
            bookedTimes.push(timePart);
          }
        }
      });
    } catch (error) {
      console.error("Error checking appointments collection:", error);
      throw error;
    }

    const uniqueBookedTimes = [...new Set(bookedTimes)];
    return uniqueBookedTimes;
  } catch (error) {
    console.error("Error getting booked times:", error);
    return [];
  }
};

/**
 * Validates if an appointment can be booked
 */
export const validateAppointment = async (
  professionalId: string,
  selectedDate: Date,
  selectedTime: string,
  selectedServices: string[],
): Promise<{ valid: boolean; error?: string }> => {
  try {
    // Check if professional exists and is active
    const professional = await getProfessionalById(professionalId);
    if (!professional) {
      return { valid: false, error: "profesional no encontrado" };
    }

    if (!professional.isActive) {
      return { valid: false, error: "profesional no disponible" };
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

    // Check if professional works on this day using new schedule format
    const dayOfWeek = getDayOfWeek(selectedDate);
    const daySchedule = professional.schedule.weeklySchedule?.find(
      (day) => day.dayOfWeek === dayOfWeek,
    );

    if (!daySchedule?.isWorkingDay) {
      return { valid: false, error: "profesional no trabaja este día" };
    }

    // Check if time is within working hours for this specific day
    const selectedTimeMinutes = parseTime(selectedTime);
    let isWithinWorkingHours = false;

    for (const period of daySchedule.workingPeriods) {
      const startTime = parseTime(period.startTime);
      const endTime = parseTime(period.endTime);

      if (selectedTimeMinutes >= startTime && selectedTimeMinutes < endTime) {
        isWithinWorkingHours = true;
        break;
      }
    }

    if (!isWithinWorkingHours) {
      return { valid: false, error: "Hora fuera del horario de trabajo" };
    }

    // Check if time slot is available
    const bookedTimes = await getBookedTimes(professionalId, selectedDate);
    if (bookedTimes.includes(selectedTime)) {
      return { valid: false, error: "Horario ya ocupado" };
    }

    // Check if professional offers the selected services
    const professionalServices = await getProfessionalServices(professionalId);
    const serviceIds = professionalServices.map((s) => s.id);
    const serviceNames = professionalServices.map((s) => s.name);

    for (const service of selectedServices) {
      if (!serviceIds.includes(service) && !serviceNames.includes(service)) {
        return {
          valid: false,
          error: `Servicio "${service}" no disponible con este profesional`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Error validating appointment:", error);
    return { valid: false, error: "Error interno del servidor" };
  }
};

/**
 * Helper Functions
 */

/**
 * Parses a time string (HH:MM) into minutes since midnight
 */
const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Formats minutes since midnight back to HH:MM format
 */
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

/**
 * Gets day of week in lowercase English format
 */
const getDayOfWeek = (date: Date): string => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
};

/**
 * Formats date for Firebase storage (DD/MM/YYYY format)
 */
const formatDateForFirebase = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Creates a default weekly schedule for a new professional
 */
export const createDefaultWeeklySchedule = (): DaySchedule[] => {
  const days: DaySchedule["dayOfWeek"][] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return days.map((day) => ({
    dayOfWeek: day,
    isWorkingDay: day !== "sunday", // Work Monday-Saturday by default
    workingPeriods:
      day !== "sunday" ? [{ startTime: "09:00", endTime: "18:00" }] : [],
    slotInterval: 30, // TODO update to dynamic by service later, for not Default 30-minute slots
  }));
};

/**
 * Clears the cache (useful for admin operations)
 */
export const clearSchedulingCache = () => {
  professionalsCache = null;
  servicesCache = null;
  cacheTimestamp = 0;
};
