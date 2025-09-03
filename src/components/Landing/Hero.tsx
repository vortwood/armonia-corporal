import Link from "next/link";

import { unifrakturMaguntia } from "@/util/fonts";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

export function Hero() {
  const { config, getFullAddress, getOpeningHours } = useBusinessConfig();
  const openingHours = getOpeningHours();
  const workingDays = openingHours.filter(day => day.hours !== 'Cerrado');
  
  // Split business name for stylized display
  const nameWords = config.name.split(' ');
  const firstWord = nameWords[0] || config.name;
  const secondWord = nameWords.slice(1).join(' ') || config.tagline;
  
  return (
    <section className="z-10 flex h-[500px] w-full flex-col items-center justify-center bg-black px-5 lg:px-10 pt-10 lg:h-screen">
      <div className="relative h-full w-full overflow-hidden rounded-t-4xl border border-b-0 border-white bg-black">
        <header
          className={`${unifrakturMaguntia.className} absolute top-1/3 left-[50%] flex translate-x-[-50%] translate-y-[-70%] flex-col text-white lg:top-[50%]`}
        >
          <h1 className="text-[85px] lg:text-[300px]">{firstWord}</h1>
          <h2 className="absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[50%] text-[50px] lg:top-[55%] lg:text-9xl">
            {secondWord}
          </h2>
        </header>
        
        {/* SEO Hidden Content */}
        <div className="sr-only">
          <h3>{config.businessType === 'barberia' ? 'Barbería' : config.businessType === 'peluqueria' ? 'Peluquería' : 'Clínica Estética'} Profesional en {config.location.city}, {config.location.country}</h3>
          <p>
            {config.description} 
            Reserva tu turno online. Teléfono: {config.contact.phone}.
          </p>
          <p>
            Servicios: {config.services.map(service => service.name).join(', ')}.
          </p>
          <p>
            Ubicación: {getFullAddress()}. 
            Horario: {workingDays.map(day => `${day.day}: ${day.hours}`).join(', ')}. 
            {config.contact.instagram && `Instagram: ${config.contact.instagram}`}
          </p>
        </div>
        
        <div className="absolute top-2/3 left-[50%] flex w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center px-5 lg:top-[75%] lg:px-0">
          <Link href="/agenda" aria-label={`Reservar turno en ${config.name} ${config.location.city}`}>
            <button className="cursor-pointer rounded-sm border-2 border-white px-6 py-2 text-lg font-medium text-white transition-colors duration-200 hover:bg-white hover:text-black md:text-2xl">
              Agendá tu hora
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
