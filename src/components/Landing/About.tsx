import { inter, unifrakturMaguntia } from "@/util/fonts";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

export function About() {
  const { config, getOpeningHours } = useBusinessConfig();
  const openingHours = getOpeningHours();
  const workingDays = openingHours.filter(day => day.hours !== 'Cerrado');
  return (
    <section className="flex w-full flex-col items-center justify-center gap-10 bg-black px-5 pt-0 text-white lg:px-10">
      <article className="flex w-full flex-col items-end justify-center gap-10 border-x border-white px-5 lg:flex-row lg:p-22">
        <div className="flex w-full flex-col items-start justify-center gap-3 lg:gap-10">
          <h2
            className={`${unifrakturMaguntia.className} pt-5 text-3xl font-semibold md:text-6xl`}
          >
            Nosotros
          </h2>
          <div
            className={`${inter.className} max-w-2xl text-white/80 lg:text-lg space-y-4`}
          >
            <p className="sr-only">
              <strong>{config.name}</strong> es {config.businessType === 'spa' ? 'el spa' : config.businessType === 'centro_bienestar' ? 'el centro de bienestar' : 'la clínica estética'} de confianza en {config.location.city}, {config.location.country}. 
              Ubicados en <strong>{config.location.address}</strong>, 
              somos especialistas en <strong>{config.services.map(s => s.name.toLowerCase()).join(', ')}</strong>.
            </p>
            <p>
              Nuestro equipo de profesionales está comprometido con brindar 
              el mejor servicio y la atención personalizada que te mereces. 
              Atendemos <strong>{workingDays.map(day => `${day.day}: ${day.hours}`).join(', ')}</strong>.
            </p>
            <p>
              En {config.name}, cada cliente es único. Por eso ofrecemos un {' '}
              <strong>sistema de reservas online</strong> para que puedas agendar 
              tu turno cuando sea conveniente para ti. También puedes contactarnos 
              al <strong>{config.contact.phone}</strong>
              {config.contact.instagram && (
                <> o seguirnos en Instagram {' '}
                <strong>{config.contact.instagram}</strong></>
              )}
            </p>
          </div>
        </div>

        <figure className="w-full">
          <img
            src="/about-interior.jpg"
            alt={`Interior de ${config.name} - ${config.businessType === 'spa' ? 'Spa' : config.businessType === 'centro_bienestar' ? 'Centro de bienestar' : 'Clínica estética'} profesional en ${config.location.city}`}
            className="h-[300px] w-full object-cover"
            loading="lazy"
            width="600"
            height="300"
          />
          <figcaption className="sr-only">
            Interior moderno de {config.name}, {config.businessType === 'spa' ? 'spa' : config.businessType === 'centro_bienestar' ? 'centro de bienestar' : 'clínica estética'} profesional ubicada en {config.location.city}
          </figcaption>
        </figure>
      </article>
    </section>
  );
}
