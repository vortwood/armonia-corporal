import type { BusinessConfig } from './business.config';

/**
 * EJEMPLO DE CONFIGURACIÓN PARA CLIENTE REAL
 * 
 * Este archivo muestra cómo configurar la aplicación para un cliente específico.
 * Para cada nuevo despliegue, copiar este archivo y modificar los valores según 
 * la información del cliente.
 */

export const CLIENT_CONFIG: BusinessConfig = {
  name: "Armonía Corporal by Alejandra Duarte",
  shortName: "AD",
  tagline: "Belleza y Bienestar Natural",
  description: "Especializada en estética facial y corporal, ofrezco tratamientos personalizados que combinan técnicas tradicionales con tecnología de vanguardia. Con años de experiencia como cosmetóloga y cosmiatra, mi enfoque se centra en realzar tu belleza natural mientras cuido tu bienestar integral.",
  established: "2015",
  businessType: "clinica_estetica",
  
  contact: {
    phone: "+598 99 425 621",
    email: "contacto@alejandraduarte.uy",
    whatsapp: "+598 99 425 621",
    instagram: "@alejandraduarte.uy",
  },
  
  location: {
    address: "Mario E. de Cola s/n, Maldonado",
    city: "Punta del Este - Maldonado",
    country: "Uruguay",
    coordinates: {
      lat: -34.9068,
      lng: -54.9376
    }
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
      name: "Limpieza Facial",
      price: "1200",
      duration: "60 min",
      description: "Limpieza profunda con extracción y hidratación para todo tipo de piel",
      category: "facial"
    },
    {
      name: "Peeling Facial",
      price: "1400",
      duration: "45 min",
      description: "Renovación celular con ácidos para mejorar textura y luminosidad",
      category: "facial"
    },
    {
      name: "Sesión de Aparatología",
      price: "1400",
      duration: "50 min",
      description: "Tratamientos con maderoterapia, HIFU, alta frecuencia, electroporación",
      category: "aparatologia"
    },
    {
      name: "Masaje Descontracturante",
      price: "1200",
      duration: "60 min",
      description: "Masaje terapéutico para aliviar tensiones y contracturas musculares",
      category: "masajes"
    },
    {
      name: "Masaje Relajante",
      price: "1100",
      duration: "60 min",
      description: "Masaje corporal con aceites esenciales para relajación total",
      category: "masajes"
    },
    {
      name: "Levantamiento de Glúteos",
      price: "1500",
      duration: "60 min",
      description: "Tratamiento especializado con aparatología para tonificar y levantar",
      category: "corporal"
    },
    {
      name: "Manicura y Pedicura",
      price: "800",
      duration: "90 min",
      description: "Cuidado completo de manos y pies con esmaltado profesional",
      category: "uñas"
    },
    {
      name: "Esmaltado Semi-permanente",
      price: "600",
      duration: "45 min",
      description: "Esmaltado de larga duración hasta 3 semanas",
      category: "uñas"
    }
  ],
  
  currency: {
    symbol: "$",
    code: "UYU",
    position: "before"
  },
  
  colors: {
    primary: "#D4A574",
    accent: "#8B5A3C",
    background: "#FDF8F3"
  },
  
  seo: {
    title: "Alejandra Duarte | Estética y Cosmetología en Punta del Este - Maldonado",
    description: "Cosmetóloga y cosmiatra especializada en tratamientos faciales, corporales, masajes y uñas en Punta del Este y Maldonado. Alejandra Duarte, años de experiencia en estética profesional.",
    keywords: [
      "esteticista punta del este",
      "cosmetologa maldonado",
      "cosmiatra punta del este",
      "tratamientos faciales maldonado",
      "limpieza facial punta del este",
      "peeling facial maldonado",
      "masajes relajantes punta del este",
      "masaje descontracturante maldonado",
      "aparatologia estetica punta del este",
      "maderoterapia maldonado",
      "hifu punta del este",
      "levantamiento gluteos maldonado",
      "salon de uñas punta del este",
      "manicura pedicura maldonado",
      "alejandra duarte esteticista",
      "belleza bienestar punta del este",
      "centro estetico maldonado",
      "tratamientos corporales punta del este"
    ],
    ogImage: "/og-image-alejandra.jpg"
  },
  
  stats: {
    yearsExperience: 9,
    clientsServed: 1500,
    rating: 4.9,
    specialties: [
      "Tratamientos faciales avanzados",
      "Aparatología estética",
      "Masajes terapéuticos y relajantes",
      "Estética corporal",
      "Cuidado integral de uñas"
    ]
  },
  
  testimonials: [
    {
      name: "María Elena",
      text: "Alejandra es una profesional excepcional. Sus tratamientos faciales son increíbles y siempre me siento renovada después de cada sesión.",
      rating: 5,
      username: "@mariaelena_uy"
    },
    {
      name: "Carolina S.", 
      text: "Los masajes descontracturantes de Ale son los mejores! Tengo años yendo y siempre quedo perfecta.",
      rating: 5,
      username: "@caro_wellness"
    },
    {
      name: "Lucía M.",
      text: "Excelente atención y resultados. La aparatología que maneja es de primera nivel. Súper recomendado!",
      rating: 5,
      username: "@lucia_beauty"
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