import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { inter } from "@/util/fonts";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

export function ContactInfo() {
  const { config, getOpeningHours, getInstagramLink } = useBusinessConfig();
  const openingHours = getOpeningHours();
  const workingDays = openingHours.filter(day => day.hours !== 'Cerrado');
  const instagramLink = getInstagramLink();
  return (
    <section className="bg-black text-white py-16 px-5 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Visitanos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Ubicación */}
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Ubicación</h3>
            <p className={`${inter.className} text-sm text-white/80 leading-relaxed`}>
              {config.location.address.split(',').map((line, index) => (
                <span key={index}>
                  {line.trim()}
                  {index < config.location.address.split(',').length - 1 && <br />}
                </span>
              ))}<br />
              {config.location.city}
            </p>
          </div>

          {/* Teléfono */}
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Teléfono</h3>
            <a 
              href={`tel:${config.contact.phone.replace(/\s/g, '')}`} 
              className={`${inter.className} text-white/80 hover:text-white transition-colors`}
              aria-label={`Llamar a ${config.name}`}
            >
              {config.contact.phone}
            </a>
          </div>

          {/* Horarios */}
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Horarios</h3>
            <div className={`${inter.className} text-sm text-white/80 space-y-1`}>
              {workingDays.length === 7 ? (
                <p>
                  Todos los días<br />
                  <strong>{workingDays[0].hours}</strong>
                </p>
              ) : (
                workingDays.slice(0, 3).map((day, index) => (
                  <p key={index}>
                    {day.day}: <strong>{day.hours}</strong>
                  </p>
                ))
              )}
              {workingDays.length > 3 && (
                <p className="text-xs">+ más horarios</p>
              )}
            </div>
          </div>

          {/* Instagram */}
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Instagram className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Instagram</h3>
            {config.contact.instagram ? (
              <a 
                href={instagramLink || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${inter.className} text-white/80 hover:text-white transition-colors`}
                aria-label={`Seguir a ${config.name} en Instagram`}
              >
                {config.contact.instagram}
              </a>
            ) : (
              <p className={`${inter.className} text-white/60 text-sm`}>
                Síguenos en nuestras redes
              </p>
            )}
          </div>
        </div>

        {/* Schema markup para información de contacto */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPoint",
              "telephone": config.contact.phone,
              "contactType": "customer service",
              "areaServed": `${config.location.city}, ${config.location.country}`,
              "availableLanguage": config.location.country === "España" ? "Spanish" : config.location.country === "Uruguay" ? "Spanish" : "Spanish"
            })
          }}
        />
      </div>
    </section>
  );
}