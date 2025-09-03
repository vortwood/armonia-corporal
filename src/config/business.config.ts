// Import client configuration
import { CLIENT_CONFIG } from "./client-config";

// Business Configuration Template System
// This file contains all customizable business information

export interface BusinessConfig {
  // Basic Business Information
  name: string;
  shortName: string; // For logos and small spaces
  tagline: string;
  description: string;
  established?: string;

  // Business Type
  businessType: "clinica_estetica" | "spa" | "centro_bienestar";

  // Contact Information
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };

  // Location Information
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Business Hours
  hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };

  // Services Configuration
  services: {
    name: string;
    price: string;
    duration?: string;
    description: string;
    category?: string;
  }[];

  // Pricing Configuration
  currency: {
    symbol: string;
    code: string;
    position: "before" | "after"; // €25 vs 25€
  };

  // Brand Colors (will override CSS variables)
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };

  // SEO Configuration
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };

  // Team/Staff Information (optional)
  team?: {
    name: string;
    role: string;
    experience?: string;
    photo?: string;
  }[];

  // Statistics/Achievements (optional)
  stats?: {
    yearsExperience?: number;
    clientsServed?: number;
    rating?: number;
    specialties?: string[];
  };

  // Testimonials
  testimonials?: {
    name: string;
    text: string;
    rating: number;
    avatar?: string;
    username?: string; // For social media style testimonials
  }[];
}

// Default template - serves as example and fallback
export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  name: "Armonía Corporal by Alejandra Duarte",
  shortName: "AC",
  tagline: "Estética para tu bienestar",
  description:
    "Mi estilo de trabajo se caracteriza por la atención meticulosa a los detalles y un ambiente relajante que permite a mis clientes desconectar del estrés diario. Ya sea que busques un tratamiento facial rejuvenecedor o un masaje terapéutico, mi objetivo es que te sientas renovado y en equilibrio después de cada sesión.",
  established: "2023",
  businessType: "clinica_estetica",

  contact: {
    phone: "+59899425621",
    email: "contacto@alejandraduarte.uy",
    whatsapp: "+59899425621",
    instagram: "@tunegocio",
  },

  location: {
    address: "Mario E. de Cola s/n, Maldonado.",
    city: "Maldonado",
    country: "Uruguay",
  },

  hours: {
    monday: "9:00 - 18:00",
    tuesday: "9:00 - 18:00",
    wednesday: "9:00 - 18:00",
    thursday: "9:00 - 18:00",
    friday: "9:00 - 18:00",
    saturday: "9:00 - 15:00",
    sunday: "Cerrado",
  },

  services: [
    {
      name: "Limpieza Facial Profunda",
      price: "1800",
      duration: "75 min",
      description: "Limpieza facial completa con extracción y mascarilla hidratante",
      category: "Tratamientos faciales",
    },
    {
      name: "Peeling Químico",
      price: "2200",
      duration: "60 min",
      description: "Renovación celular profunda con ácidos para rejuvenecer la piel",
      category: "Tratamientos faciales",
    },
    {
      name: "Hydrafacial",
      price: "2800",
      duration: "90 min",
      description: "Tratamiento de hidratación y nutrición facial con aparatología de última generación",
      category: "Aparatología",
    },
    {
      name: "Masaje Relajante",
      price: "1600",
      duration: "60 min",
      description: "Masaje corporal relajante con aceites esenciales y técnicas de relajación",
      category: "Tratamientos corporales",
    },
    {
      name: "Masaje Descontracturante",
      price: "1800",
      duration: "60 min",
      description: "Masaje terapéutico para aliviar tensiones y contracturas musculares",
      category: "Tratamientos corporales",
    },
    {
      name: "Radiofrecuencia Facial",
      price: "2500",
      duration: "50 min",
      description: "Tratamiento antiedad con radiofrecuencia para tensar y rejuvenecer",
      category: "Aparatología",
    },
    {
      name: "Drenaje Linfático",
      price: "1900",
      duration: "75 min",
      description: "Masaje especializado para reducir retención de líquidos y mejorar circulación",
      category: "Tratamientos corporales",
    },
    {
      name: "Tratamiento Anticelulítico",
      price: "2300",
      duration: "90 min",
      description: "Combinación de aparatología y masaje para reducir celulitis y modelar figura",
      category: "Aparatología",
    }
  ],

  currency: {
    symbol: "$",
    code: "UYU",
    position: "before",
  },

  seo: {
    title: "Armonía Corporal by Alejandra Duarte | Clínica Estética Maldonado",
    description:
      "Clínica estética especializada en tratamientos faciales, corporales y aparatología en Maldonado, Uruguay. Alejandra Duarte, esteticista y cosmiátra profesional con más de 5 años de experiencia.",
    keywords: [
      "clínica estética maldonado",
      "esteticista maldonado",
      "cosmiátra maldonado", 
      "tratamientos faciales maldonado",
      "masajes maldonado",
      "aparatología estética",
      "peeling químico",
      "hydrafacial",
      "radiofrecuencia facial",
      "drenaje linfático",
      "tratamientos anticelulíticos",
      "masaje descontracturante",
      "alejandra duarte esteticista",
      "belleza y bienestar maldonado",
      "cuidado de la piel uruguay",
      "estética profesional"
    ],
  },

  stats: {
    yearsExperience: 5,
    clientsServed: 800,
    rating: 4.9,
    specialties: [
      "Tratamientos faciales",
      "Aparatología estética", 
      "Masajes terapéuticos",
      "Cuidado corporal",
      "Rejuvenecimiento"
    ],
  },

  testimonials: [
    {
      name: "Lucía",
      text: "Excelente servicio y profesionalidad. Muy recomendado.",
      rating: 5,
      username: "@Lu.nails",
    },
  ],
};

// Business configuration selector based on environment or deployment
export const getBusinessConfig = (): BusinessConfig => {
  // In a real deployment, this could read from:
  // - Environment variables: process.env.BUSINESS_CONFIG
  // - Database: dynamic config loading
  // - External config service: API calls
  // - Build-time configuration: different imports per build

  // For demo purposes, return the client config
  // In production, you might do: return process.env.NODE_ENV === 'development' ? DEFAULT_BUSINESS_CONFIG : CLIENT_CONFIG;
  return CLIENT_CONFIG;
};

// Utility functions for config values
export const formatPrice = (price: string, config: BusinessConfig): string => {
  const { symbol, position } = config.currency;
  return position === "before" ? `${symbol}${price}` : `${price}${symbol}`;
};

export const getBusinessTypeLabel = (
  type: BusinessConfig["businessType"],
): string => {
  const labels = {
    clinica_estetica: "Clínica Estética",
    spa: "Spa & Wellness",
    centro_bienestar: "Centro de Bienestar",
  };
  return labels[type];
};

export const getFormattedHours = (
  day: keyof BusinessConfig["hours"],
  config: BusinessConfig,
): string => {
  return config.hours[day] || "Cerrado";
};
