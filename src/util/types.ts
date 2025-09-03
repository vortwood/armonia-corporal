import { StaticImageData } from "next/image";

export type AdminContextType = {
  admin: boolean | null;
  setAdmin: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export type CardData = {
  title: string;
  img: StaticImageData;
  id: number;
};

export type ServiceType = "haircut" | "highlights" | "color" | "";

export type FormSubmitType = {
  name: string;
  phone: string;
  mail: string;
  hora: string;
  tipos: string[]; // Cambiar de tipo a tipos (array)
  persona: string;
  collection: string;
};

export type SubmitResponse = {
  success: boolean;
  error?: string;
  errorType?: "SCHEDULE_CONFLICT" | "VALIDATION_ERROR" | "SERVER_ERROR";
};

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface WorkingHours {
  start: string;
  end: string;
  interval: number; // in minutes
}

export interface Stylist {
  id: string;
  name: string;
  collection: string;
  workingHours: WorkingHours;
}

export interface EmailRecipient {
  email: string;
  time: string;
  name: string;
  serviceType: string;
  phone: string;
  stylist: string;
}

export interface EmailParams {
  to: EmailRecipient[];
}

export interface AppointmentData {
  name: string;
  phone: string;
  email: string;
  time: string;
  serviceType: ServiceType;
  stylist: string;
}

// Working period interface for multiple time slots per day
export interface WorkingPeriod {
  startTime: string; // '09:00'
  endTime: string; // '12:00'
}

// Day-specific schedule interface
export interface DaySchedule {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isWorkingDay: boolean;
  workingPeriods: WorkingPeriod[]; // Multiple periods per day (e.g., morning and afternoon)
  slotInterval: number; // Minutes per slot (30 for now, dynamic later)
}

// New admin system types
export interface Hairdresser {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  services: string[]; // service IDs
  schedule: {
    weeklySchedule: DaySchedule[]; // 7 objects, one per day
    defaultSlotInterval: number; // Global default (30min)
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice: number;
  duration: number; // in minutes
  category: string;
  photo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentMetrics {
  hairdresserId: string;
  month: string; // 'YYYY-MM'
  totalAppointments: number;
  totalRevenue: number;
  popularServices: { serviceId: string; count: number }[];
}
