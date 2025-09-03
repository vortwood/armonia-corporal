import type { BusinessConfig } from "./business.config";

/**
 * Example business configurations for different types of beauty businesses
 * These serve as templates that can be customized for new deployments
 */

// ELEGANT PELUQUERÍA EXAMPLE
export const ELEGANT_SALON_CONFIG: BusinessConfig = {
  name: "Bella Vista",
  shortName: "BV",
  tagline: "Elegancia y sofisticación",
  description:
    "En Bella Vista creemos que la belleza es un arte. Cada corte, cada color, es una expresión única de tu personalidad. Nuestro equipo de estilistas expertos trabaja con dedicación para realzar tu belleza natural.",
  established: "2018",
  businessType: "peluqueria",

  contact: {
    phone: "+34 911 234 567",
    email: "reservas@bellavista.es",
    whatsapp: "+34 911 234 567",
    instagram: "@bellavista_salon",
  },

  location: {
    address: "Calle Serrano 123",
    city: "Madrid",
    country: "España",
  },

  hours: {
    monday: "10:00 - 20:00",
    tuesday: "10:00 - 20:00",
    wednesday: "10:00 - 20:00",
    thursday: "10:00 - 20:00",
    friday: "10:00 - 20:00",
    saturday: "10:00 - 15:00",
    sunday: "Cerrado",
  },

  services: [
    {
      name: "Corte de Pelo",
      price: "25",
      duration: "45 min",
      description: "Corte personalizado según tu estilo y rostro",
    },
    {
      name: "Coloración",
      price: "45",
      duration: "120 min",
      description: "Coloración completa con productos premium",
    },
    {
      name: "Mechas",
      price: "60",
      duration: "150 min",
      description: "Técnicas avanzadas de iluminación",
    },
    {
      name: "Brushing",
      price: "20",
      duration: "30 min",
      description: "Peinado profesional para ocasiones especiales",
    },
  ],

  currency: {
    symbol: "€",
    code: "EUR",
    position: "after",
  },

  colors: {
    primary: "#8B4513",
    accent: "#D4AF37",
    background: "#FFF8F0",
  },

  seo: {
    title: "Bella Vista | Peluquería Elegante en Madrid",
    description:
      "Peluquería de lujo en Madrid. Cortes, coloración y tratamientos con los mejores profesionales. Reserva tu cita online.",
    keywords: [
      "peluquería madrid",
      "corte elegante",
      "coloración madrid",
      "tratamiento capilar",
      "salón de belleza",
    ],
  },

  stats: {
    yearsExperience: 6,
    clientsServed: 2500,
    rating: 4.9,
    specialties: [
      "Coloración avanzada",
      "Cortes de tendencia",
      "Tratamientos de lujo",
    ],
  },

  testimonials: [
    {
      name: "María González",
      text: "Una experiencia transformadora. El equipo es increíblemente profesional y el resultado superó todas mis expectativas.",
      rating: 5,
    },
  ],
};

// MODERN BARBERÍA EXAMPLE
export const MODERN_BARBERSHOP_CONFIG: BusinessConfig = {
  name: "Urban Cuts",
  shortName: "UC",
  tagline: "Estilo que Define",
  description:
    "Experiencia premium en corte masculino. Donde la precisión se encuentra con el estilo contemporáneo.",
  established: "2020",
  businessType: "barberia",

  contact: {
    phone: "+598 099 123 456",
    email: "info@urbancuts.uy",
    whatsapp: "+598 099 123 456",
    instagram: "@urbancuts_uy",
  },

  location: {
    address: "Av. Principal 1234, Centro",
    city: "Montevideo",
    country: "Uruguay",
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
      name: "Corte de Pelo",
      price: "25000",
      duration: "45 min",
      description: "Corte personalizado según tu estilo y rostro",
    },
    {
      name: "Barba",
      price: "18000",
      duration: "30 min",
      description: "Recorte, perfilado y cuidado profesional",
    },
    {
      name: "Cejas",
      price: "12000",
      duration: "20 min",
      description: "Perfilado y diseño de cejas masculinas",
    },
    {
      name: "Mechas",
      price: "45000",
      duration: "120 min",
      description: "Coloración y mechas profesionales",
    },
  ],

  currency: {
    symbol: "$",
    code: "UYU",
    position: "before",
  },

  colors: {
    primary: "#1F2937",
    accent: "#3B82F6",
    background: "#F9FAFB",
  },

  seo: {
    title: "Urban Cuts | Barbería Moderna en Montevideo",
    description:
      "La mejor barbería de Montevideo. Cortes modernos, arreglo de barba y afeitado clásico. Agenda tu cita online.",
    keywords: [
      "barbería montevideo",
      "corte masculino",
      "barba montevideo",
      "peluquería hombre",
      "barbershop",
    ],
  },

  stats: {
    yearsExperience: 4,
    clientsServed: 2000,
    rating: 4.9,
    specialties: ["Cortes modernos", "Diseño de barba", "Fade cuts"],
  },
};

// VINTAGE BARBERÍA EXAMPLE
export const VINTAGE_BARBERSHOP_CONFIG: BusinessConfig = {
  name: "Barbería Clásica",
  shortName: "BC",
  tagline: "Elegancia Atemporal",
  description:
    "Donde la tradición barbera se mantiene viva. Técnicas artesanales transmitidas de generación en generación.",
  established: "1985",
  businessType: "barberia",

  contact: {
    phone: "+598 099 654 321",
    email: "contacto@barberiaclasica.uy",
    whatsapp: "+598 099 654 321",
    instagram: "@barberia_clasica",
  },

  location: {
    address: "Ciudad Vieja 567",
    city: "Maldonado",
    country: "Uruguay",
  },

  hours: {
    monday: "8:00 - 18:00",
    tuesday: "8:00 - 18:00",
    wednesday: "8:00 - 18:00",
    thursday: "8:00 - 18:00",
    friday: "8:00 - 18:00",
    saturday: "8:00 - 15:00",
    sunday: "Cerrado",
  },

  services: [
    {
      name: "Corte Clásico",
      price: "25000",
      duration: "45 min",
      description: "Cortes tradicionales con técnicas artesanales",
    },
    {
      name: "Afeitado Tradicional",
      price: "20000",
      duration: "40 min",
      description: "Navaja tradicional con toallas calientes",
    },
    {
      name: "Cejas & Bigote",
      price: "15000",
      duration: "25 min",
      description: "Perfilado clásico y cuidado detallado",
    },
    {
      name: "Tratamiento Premium",
      price: "55000",
      duration: "90 min",
      description: "Experiencia completa con masajes y tratamientos",
    },
  ],

  currency: {
    symbol: "$",
    code: "UYU",
    position: "before",
  },

  colors: {
    primary: "#8B4513",
    accent: "#CD853F",
    background: "#F5E6D3",
  },

  seo: {
    title: "Barbería Clásica | Tradición y Elegancia en Maldonado",
    description:
      "Barbería tradicional en Maldonado desde 1985. Cortes clásicos, afeitado con navaja y la mejor atención personalizada.",
    keywords: [
      "barbería maldonado",
      "afeitado tradicional",
      "barbería clásica",
      "corte tradicional",
      "navaja",
    ],
  },

  stats: {
    yearsExperience: 40,
    clientsServed: 15000,
    rating: 4.8,
    specialties: [
      "Afeitado con navaja",
      "Cortes tradicionales",
      "Experiencia vintage",
    ],
  },
};

// GLAMOUR SALON EXAMPLE
export const GLAMOUR_SALON_CONFIG: BusinessConfig = {
  name: "Glamour Studio",
  shortName: "GS",
  tagline: "Donde el lujo se encuentra con la belleza",
  description:
    "Tu destino para transformaciones exclusivas. Servicios premium que realzan tu belleza natural con los más altos estándares de calidad.",
  established: "2019",
  businessType: "peluqueria",

  contact: {
    phone: "+34 911 987 654",
    email: "vip@glamourstudio.es",
    whatsapp: "+34 911 987 654",
    instagram: "@glamour_studio_madrid",
  },

  location: {
    address: "Gran Vía 88",
    city: "Madrid",
    country: "España",
  },

  hours: {
    monday: "10:00 - 21:00",
    tuesday: "10:00 - 21:00",
    wednesday: "10:00 - 21:00",
    thursday: "10:00 - 21:00",
    friday: "10:00 - 21:00",
    saturday: "10:00 - 19:00",
    sunday: "11:00 - 17:00",
  },

  services: [
    {
      name: "Color Deluxe",
      price: "65",
      duration: "150 min",
      description: "Coloración premium con tratamiento",
    },
    {
      name: "Mechas Balayage",
      price: "85",
      duration: "180 min",
      description: "Técnica francesa exclusiva",
    },
    {
      name: "Corte Diseñador",
      price: "45",
      duration: "60 min",
      description: "Estilo personalizado VIP",
    },
    {
      name: "Tratamiento Oro",
      price: "55",
      duration: "90 min",
      description: "Rejuvenecimiento con oro 24k",
    },
  ],

  currency: {
    symbol: "€",
    code: "EUR",
    position: "after",
  },

  colors: {
    primary: "#B8860B",
    accent: "#FFD700",
    background: "#FFFBF0",
  },

  seo: {
    title: "Glamour Studio | Salón de Belleza VIP en Madrid",
    description:
      "Salón de belleza exclusivo en Madrid. Servicios premium, tratamientos de lujo y atención VIP. Reserva tu experiencia única.",
    keywords: [
      "salón lujo madrid",
      "tratamientos VIP",
      "peluquería premium",
      "belleza exclusiva",
      "glamour madrid",
    ],
  },

  stats: {
    yearsExperience: 5,
    clientsServed: 1200,
    rating: 5.0,
    specialties: [
      "Tratamientos VIP",
      "Coloración premium",
      "Experiencias de lujo",
    ],
  },

  testimonials: [
    {
      name: "Isabella Martínez",
      text: "El mejor salón de Madrid. El ambiente es lujoso, el servicio impecable y los resultados son simplemente espectaculares. ¡Me siento como una celebridad!",
      rating: 5,
      username: "Cliente VIP",
    },
  ],
};
