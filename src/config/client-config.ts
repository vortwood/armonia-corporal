import type { BusinessConfig } from './business.config';

/**
 * EJEMPLO DE CONFIGURACIÓN PARA CLIENTE REAL
 * 
 * Este archivo muestra cómo configurar la aplicación para un cliente específico.
 * Para cada nuevo despliegue, copiar este archivo y modificar los valores según 
 * la información del cliente.
 */

export const CLIENT_CONFIG: BusinessConfig = {
  name: "Urban Cuts Barbería",
  shortName: "UC",
  tagline: "Estilo que Define",
  description: "Experiencia premium en corte masculino. Donde la precisión se encuentra con el estilo contemporáneo en el corazón de Montevideo.",
  established: "2020",
  businessType: "barberia",
  
  contact: {
    phone: "+598 099 123 456",
    email: "info@urbancuts.uy",
    whatsapp: "+598 099 123 456",
    instagram: "@urbancuts_uy",
  },
  
  location: {
    address: "Av. 18 de Julio 1234, Centro",
    city: "Montevideo",
    country: "Uruguay",
    coordinates: {
      lat: -34.9058,
      lng: -56.1913
    }
  },
  
  hours: {
    monday: "9:00 - 19:00",
    tuesday: "9:00 - 19:00",
    wednesday: "9:00 - 19:00",
    thursday: "9:00 - 19:00",
    friday: "9:00 - 19:00",
    saturday: "9:00 - 17:00",
    sunday: "Cerrado",
  },
  
  services: [
    {
      name: "Corte Moderno",
      price: "800",
      duration: "45 min",
      description: "Corte personalizado según tu estilo y rostro",
      category: "corte"
    },
    {
      name: "Barba Premium",
      price: "600",
      duration: "30 min",
      description: "Recorte, perfilado y cuidado profesional",
      category: "barba"
    },
    {
      name: "Cejas Masculinas",
      price: "400",
      duration: "20 min",
      description: "Perfilado y diseño de cejas masculinas",
      category: "cejas"
    },
    {
      name: "Color & Mechas",
      price: "1500",
      duration: "120 min",
      description: "Coloración y mechas profesionales",
      category: "color"
    }
  ],
  
  currency: {
    symbol: "$",
    code: "UYU",
    position: "before"
  },
  
  colors: {
    primary: "#1F2937",
    accent: "#3B82F6",
    background: "#F9FAFB"
  },
  
  seo: {
    title: "Urban Cuts | Barbería Moderna en Montevideo",
    description: "La mejor barbería de Montevideo. Cortes modernos, arreglo de barba y afeitado clásico. Agenda tu cita online en el centro de Montevideo.",
    keywords: [
      "barbería montevideo",
      "corte masculino montevideo", 
      "barba montevideo",
      "peluquería hombre montevideo",
      "barbershop uruguay",
      "cortes modernos uruguay",
      "urban cuts"
    ],
    ogImage: "/og-image-urbancurts.jpg"
  },
  
  stats: {
    yearsExperience: 4,
    clientsServed: 2000,
    rating: 4.8,
    specialties: ["Cortes modernos", "Diseño de barba", "Fade cuts", "Coloración masculina"]
  },
  
  testimonials: [
    {
      name: "Carlos Rodriguez",
      text: "Excelente atención y muy profesional. Mi lugar de confianza para cortarme el pelo en Montevideo.",
      rating: 5,
      username: "@carlos_uy"
    },
    {
      name: "Fernando Silva", 
      text: "El mejor fade cut que me han hecho. Definitivamente recomendado!",
      rating: 5,
      username: "@fersilva"
    }
  ]
};

/**
 * INSTRUCCIONES DE USO:
 * 
 * 1. Modifica todos los valores según la información del cliente
 * 2. Actualiza business.config.ts para importar esta configuración
 * 3. Reemplaza las imágenes en /public/ con las del cliente
 * 4. Prueba la aplicación localmente
 * 5. Realiza el despliegue
 */