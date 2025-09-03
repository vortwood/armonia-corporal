import db from "@/util/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { cache } from "./cache";

// Types for appointment data
export interface Appointment {
  id: string;
  name: string;
  phone: string;
  mail: string;
  hora: string; // Format: "DD/MM/YYYY - HH:MM"
  tipos: string[];
  hairdresserId: string; // Modern field (replaces 'persona')
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentInput {
  name: string;
  phone: string;
  mail: string;
  hora: string;
  tipos: string[];
  hairdresserId: string;
}

// Cache keys for different query types
const CACHE_KEYS = {
  barberAppointments: (barberId: string) => `appointments:barber:${barberId}`,
  dateAppointments: (date: string) => `appointments:date:${date}`,
  allAppointments: "appointments:all",
  barberStats: (barberId: string) => `stats:barber:${barberId}`,
  monthlyStats: (month: string) => `stats:monthly:${month}`,
};

// Cache durations (in seconds)
const CACHE_DURATION = {
  appointments: 300, // 5 minutes
  stats: 600, // 10 minutes
  schedules: 3600, // 1 hour
};

/**
 * Convert Firestore document to Appointment object
 */
function documentToAppointment(doc: DocumentSnapshot): Appointment {
  const data = doc.data();
  if (!data) throw new Error("Document has no data");

  return {
    id: doc.id,
    name: data.name,
    phone: data.phone,
    mail: data.mail,
    hora: data.hora,
    tipos: data.tipos || [],
    hairdresserId: data.hairdresserId || data.persona, // Handle legacy 'persona' field
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
}

/**
 * Get appointments for a specific barber with caching
 */
export async function getBarberAppointments(
  barberId: string,
  useCache: boolean = true,
): Promise<Appointment[]> {
  const cacheKey = CACHE_KEYS.barberAppointments(barberId);

  // Check cache first
  if (useCache) {
    const cached = await cache.get<Appointment[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const appointmentsRef = collection(db, "appointments");

    // Query for specific barber with optimized ordering
    const q = query(
      appointmentsRef,
      where("hairdresserId", "==", barberId),
      orderBy("hora", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      appointments.push(documentToAppointment(doc));
    });

    // Cache the results
    if (useCache) {
      await cache.set(cacheKey, appointments, CACHE_DURATION.appointments);
    }

    return appointments;
  } catch (error) {
    console.error(`Error fetching appointments for barber ${barberId}:`, error);
    throw new Error("Failed to fetch barber appointments");
  }
}

/**
 * Get appointments for a specific date across all barbers
 */
export async function getAppointmentsByDate(
  date: string,
  useCache: boolean = true,
): Promise<Appointment[]> {
  const cacheKey = CACHE_KEYS.dateAppointments(date);

  if (useCache) {
    const cached = await cache.get<Appointment[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const appointmentsRef = collection(db, "appointments");

    // Query for specific date from unified collection
    const q = query(
      appointmentsRef,
      where("hora", ">=", `${date} - 00:00`),
      where("hora", "<=", `${date} - 23:59`),
      orderBy("hora", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      appointments.push(documentToAppointment(doc));
    });

    // Cache results
    if (useCache) {
      await cache.set(cacheKey, appointments, CACHE_DURATION.appointments);
    }

    return appointments;
  } catch (error) {
    console.error(`Error fetching appointments for date ${date}:`, error);
    throw new Error("Failed to fetch appointments by date");
  }
}

/**
 * Get all appointments with pagination
 */
export async function getAllAppointments(
  limit: number = 100,
  useCache: boolean = true,
): Promise<Appointment[]> {
  const cacheKey = `${CACHE_KEYS.allAppointments}:${limit}`;

  if (useCache) {
    const cached = await cache.get<Appointment[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const appointmentsRef = collection(db, "appointments");

    // Query from unified collection with limit and ordering
    const q = query(appointmentsRef, orderBy("hora", "desc"));

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      appointments.push(documentToAppointment(doc));
    });

    // Apply limit
    const limitedAppointments = appointments.slice(0, limit);

    // Cache results
    if (useCache) {
      await cache.set(
        cacheKey,
        limitedAppointments,
        CACHE_DURATION.appointments,
      );
    }

    return limitedAppointments;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw new Error("Failed to fetch all appointments");
  }
}

/**
 * Create new appointment with conflict checking
 */
export async function createAppointment(
  appointment: AppointmentInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Check for conflicts first
    const conflictCheck = await checkAppointmentConflict(
      appointment.hairdresserId,
      appointment.hora,
    );

    if (conflictCheck.hasConflict) {
      return {
        success: false,
        error: "SCHEDULE_CONFLICT",
      };
    }

    // Add timestamps and ensure modern schema
    const appointmentData = {
      ...appointment,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const appointmentsRef = collection(db, "appointments");

    const docRef = await addDoc(appointmentsRef, appointmentData);

    // Invalidate related caches
    await invalidateAppointmentCaches(
      appointment.hairdresserId,
      appointment.hora,
    );

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}

/**
 * Delete appointment by ID
 */
export async function deleteAppointment(
  appointmentId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);

    await deleteDoc(appointmentRef);

    // Invalidate caches
    await invalidateAppointmentCaches();

    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      error: "DELETE_ERROR",
    };
  }
}

/**
 * Check for appointment conflicts
 */
export async function checkAppointmentConflict(
  barberId: string,
  hora: string,
): Promise<{ hasConflict: boolean; conflictId?: string }> {
  try {
    const appointmentsRef = collection(db, "appointments");

    const q = query(
      appointmentsRef,
      where("hairdresserId", "==", barberId),
      where("hora", "==", hora),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const conflictDoc = querySnapshot.docs[0];
      return {
        hasConflict: true,
        conflictId: conflictDoc.id,
      };
    }

    return { hasConflict: false };
  } catch (error) {
    console.error("Error checking appointment conflict:", error);
    return { hasConflict: false }; // Fail safe
  }
}

/**
 * Get monthly statistics for barbers
 */
export async function getMonthlyStats(
  month: string,
  useCache: boolean = true,
): Promise<{ [barberId: string]: number }> {
  const cacheKey = CACHE_KEYS.monthlyStats(month);

  if (useCache) {
    const cached = await cache.get<{ [barberId: string]: number }>(cacheKey);
    if (cached) return cached;
  }

  try {
    const stats: { [barberId: string]: number } = {};

    // Get all appointments from unified collection
    const appointmentsRef = collection(db, "appointments");
    const querySnapshot = await getDocs(appointmentsRef);

    querySnapshot.forEach((doc) => {
      const appointment = doc.data();
      const barberId = appointment.hairdresserId || appointment.persona; // Handle legacy

      if (appointment.hora && barberId) {
        // Filter by month (assuming hora format: "DD/MM/YYYY - HH:MM")
        const appointmentMonth = appointment.hora.substring(3, 10); // Extract "MM/YYYY"
        if (appointmentMonth === month) {
          stats[barberId] = (stats[barberId] || 0) + 1;
        }
      }
    });

    // Cache results
    if (useCache) {
      await cache.set(cacheKey, stats, CACHE_DURATION.stats);
    }

    return stats;
  } catch (error) {
    console.error("Error getting monthly stats:", error);
    return {};
  }
}

/**
 * Invalidate appointment-related caches
 */
async function invalidateAppointmentCaches(
  barberId?: string,
  hora?: string,
): Promise<void> {
  try {
    const keysToInvalidate = [CACHE_KEYS.allAppointments];

    if (barberId) {
      keysToInvalidate.push(CACHE_KEYS.barberAppointments(barberId));
    }

    if (hora) {
      const date = hora.split(" - ")[0]; // Extract date part
      keysToInvalidate.push(CACHE_KEYS.dateAppointments(date));
    }

    // Invalidate all related cache keys
    const promises = keysToInvalidate.map((key) => cache.delete(key));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error invalidating caches:", error);
  }
}
