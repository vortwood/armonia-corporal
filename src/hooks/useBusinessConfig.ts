import { useMemo } from 'react';
import { getBusinessConfig, formatPrice } from '@/config/business.config';

/**
 * Hook for accessing business configuration throughout the app
 */
export const useBusinessConfig = () => {
  const config = useMemo(() => getBusinessConfig(), []);
  
  // Utility functions that use the config
  const utilities = useMemo(() => ({
    formatPrice: (price: string) => formatPrice(price, config),
    
    getFullAddress: () => {
      return `${config.location.address}, ${config.location.city}, ${config.location.country}`;
    },
    
    getBusinessTypeServices: () => {
      // Filter services based on business type if needed
      return config.services;
    },
    
    getContactWhatsAppLink: () => {
      if (!config.contact.whatsapp) return null;
      const phone = config.contact.whatsapp.replace(/[^\d+]/g, '');
      return `https://wa.me/${phone}`;
    },
    
    getInstagramLink: () => {
      if (!config.contact.instagram) return null;
      const username = config.contact.instagram.replace('@', '');
      return `https://instagram.com/${username}`;
    },
    
    getFacebookLink: () => {
      if (!config.contact.facebook) return null;
      return config.contact.facebook.startsWith('http') 
        ? config.contact.facebook 
        : `https://facebook.com/${config.contact.facebook}`;
    },
    
    getOpeningHours: () => {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      
      return days.map((day, index) => ({
        day: dayNames[index],
        hours: config.hours[day as keyof typeof config.hours] || 'Cerrado'
      }));
    },
    
    getAverageRating: () => {
      if (!config.testimonials || config.testimonials.length === 0) {
        return config.stats?.rating || 5;
      }
      
      const total = config.testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
      return Math.round((total / config.testimonials.length) * 10) / 10;
    },
    
    getMetaTags: () => ({
      title: config.seo.title,
      description: config.seo.description,
      keywords: config.seo.keywords.join(', '),
      ogTitle: config.seo.title,
      ogDescription: config.seo.description,
      ogImage: config.seo.ogImage,
    }),
    
    getStructuredData: () => ({
      "@context": "https://schema.org",
      "@type": config.businessType === 'clinica_estetica' ? "MedicalClinic" : config.businessType === 'spa' ? "HealthAndBeautyBusiness" : "BeautySalon",
      "name": config.name,
      "description": config.description,
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "telephone": config.contact.phone,
      "email": config.contact.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.location.address,
        "addressLocality": config.location.city,
        "addressCountry": config.location.country
      },
      "openingHours": Object.entries(config.hours)
        .filter(([, hours]) => hours && hours !== 'Cerrado')
        .map(([day, hours]) => {
          const dayAbbr = day.substring(0, 2).toUpperCase();
          return `${dayAbbr} ${hours}`;
        }),
      "aggregateRating": config.stats?.rating ? {
        "@type": "AggregateRating",
        "ratingValue": config.stats.rating,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined,
      "priceRange": "$",
      "image": config.seo.ogImage,
      "sameAs": [
        config.contact.instagram ? `https://instagram.com/${config.contact.instagram.replace('@', '')}` : null,
        config.contact.facebook ? (config.contact.facebook.startsWith('http') ? config.contact.facebook : `https://facebook.com/${config.contact.facebook}`) : null,
      ].filter(Boolean)
    })
  }), [config]);
  
  return {
    config,
    ...utilities
  };
};