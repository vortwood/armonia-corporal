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
  businessType: 'peluqueria' | 'barberia' | 'clinica_estetica';
  
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
    position: 'before' | 'after'; // €25 vs 25€
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
  name: "Tu Negocio",
  shortName: "TN",
  tagline: "Tu eslogan aquí",
  description: "Descripción de tu negocio de belleza profesional",
  established: "2024",
  businessType: "peluqueria",
  
  contact: {
    phone: "+1 234 567 8900",
    email: "info@tunegocio.com",
    whatsapp: "+1 234 567 8900",
    instagram: "@tunegocio",
  },
  
  location: {
    address: "Dirección de tu negocio 123",
    city: "Tu Ciudad",
    country: "Tu País",
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
      name: "Corte de Pelo",
      price: "25",
      duration: "45 min",
      description: "Corte personalizado según tu estilo",
      category: "corte"
    },
    {
      name: "Coloración",
      price: "45", 
      duration: "120 min",
      description: "Coloración profesional completa",
      category: "color"
    },
    {
      name: "Mechas",
      price: "60",
      duration: "150 min", 
      description: "Mechas y highlights profesionales",
      category: "color"
    },
    {
      name: "Tratamiento",
      price: "35",
      duration: "60 min",
      description: "Tratamiento capilar nutritivo",
      category: "tratamiento"
    }
  ],
  
  currency: {
    symbol: "$",
    code: "USD",
    position: "before"
  },
  
  seo: {
    title: "Tu Negocio | Servicios de Belleza Profesional",
    description: "Los mejores servicios de belleza en tu ciudad. Profesionales expertos y productos de calidad.",
    keywords: ["peluqueria", "belleza", "corte", "color", "tratamiento"]
  },
  
  stats: {
    yearsExperience: 5,
    clientsServed: 1000,
    rating: 4.9,
    specialties: ["Cortes modernos", "Coloración", "Tratamientos"]
  },
  
  testimonials: [
    {
      name: "Cliente Satisfecho",
      text: "Excelente servicio y profesionalidad. Muy recomendado.",
      rating: 5,
      username: "@cliente_feliz"
    }
  ]
};

// Import client configuration
import { CLIENT_CONFIG } from './client-config';

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
  return position === 'before' ? `${symbol}${price}` : `${price}${symbol}`;
};

export const getBusinessTypeLabel = (type: BusinessConfig['businessType']): string => {
  const labels = {
    peluqueria: 'Peluquería',
    barberia: 'Barbería', 
    clinica_estetica: 'Clínica Estética'
  };
  return labels[type];
};

export const getFormattedHours = (day: keyof BusinessConfig['hours'], config: BusinessConfig): string => {
  return config.hours[day] || 'Cerrado';
};