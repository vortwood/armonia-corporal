import { Calendar, Clock, MapPin, Scissors, Star } from "lucide-react";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

import Footer from "./Footer";
import Logo from "./Logo";

interface HomepageModernProps {
  setCurrentStyle: (style: string) => void;
}

const HomepageModern = ({ setCurrentStyle }: HomepageModernProps) => {
  const { config, formatPrice, getFullAddress, getOpeningHours } = useBusinessConfig();
  const openingHours = getOpeningHours();
  const workingDays = openingHours.filter(day => day.hours !== 'Cerrado');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 left-0 z-50 p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo theme="modern" size="md" />
          <button className="btn-modern">Reservar Turno</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-modern">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <div className="animate-slide-up">
            <h1 className="title-modern mb-6">
              {config.name.split(' ')[0]}
              <span className="block text-[hsl(var(--accent-modern))]">
                {config.name.split(' ').slice(1).join(' ') || config.tagline.split(' ')[0]}
              </span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
              {config.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="btn-modern inline-flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agendar Cita
              </button>
              <button className="rounded-lg border-2 border-[hsl(var(--primary-modern))] px-8 py-3 font-medium text-[hsl(var(--primary-modern))] transition-all duration-300 hover:bg-[hsl(var(--primary-modern))] hover:text-white">
                Ver Servicios
              </button>
            </div>
          </div>
          <div className="animate-scale-in">
            <img
              src={"/barber.jpg"}
              alt="Barbería moderna y elegante"
              className="w-full rounded-2xl shadow-[var(--shadow-modern)] transition-shadow duration-300 hover:shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[hsl(var(--primary-modern))] md:text-5xl">
              Nuestros Servicios
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Servicios premium diseñados para el hombre moderno que valora la
              calidad y el estilo
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {config.services.slice(0, 4).map((service, index) => (
              <div
                key={service.name}
                className="card-modern group hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent-modern))] transition-transform duration-300 group-hover:scale-110">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[hsl(var(--primary-modern))]">
                  {service.name}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[hsl(var(--accent-modern))]">
                    {formatPrice(service.price)}
                  </span>
                  {service.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {service.duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-[hsl(var(--primary-modern))] md:text-5xl">
                Tradición & Modernidad
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                {config.description}
              </p>
              {config.stats && (
                <div className="mb-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="mb-1 text-3xl font-bold text-[hsl(var(--accent-modern))]">
                      {config.stats.yearsExperience}+
                    </div>
                    <div className="text-gray-600">Años de experiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-3xl font-bold text-[hsl(var(--accent-modern))]">
                      {config.stats.clientsServed}+
                    </div>
                    <div className="text-gray-600">Clientes satisfechos</div>
                  </div>
                </div>
              )}
              <div className="mb-6 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[hsl(var(--accent-modern))] text-[hsl(var(--accent-modern))]"
                  />
                ))}
                <span className="ml-2 text-gray-600">{config.stats?.rating || 4.9}/5 en reseñas</span>
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="card-modern">
                <div className="mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-[hsl(var(--accent-modern))]" />
                  <span className="font-semibold">Ubicación</span>
                </div>
                <p className="mb-4 text-gray-600">
                  {getFullAddress()}
                </p>
                <div className="mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-[hsl(var(--accent-modern))]" />
                  <span className="font-semibold">Horarios</span>
                </div>
                <div className="space-y-1 text-gray-600">
                  {workingDays.slice(0, 3).map((day, index) => (
                    <p key={index}>{day.day}: {day.hours}</p>
                  ))}
                  {workingDays.length > 3 && (
                    <p className="text-sm">+ más horarios</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[hsl(var(--primary-modern))] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            ¿Listo para tu nuevo look?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Agenda tu cita online y experimenta el mejor servicio de barbería en
            Montevideo
          </p>
          <button className="inline-flex items-center gap-3 rounded-lg bg-[hsl(var(--accent-modern))] px-12 py-4 text-lg font-semibold text-[hsl(var(--accent-modern-foreground))] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[hsl(var(--primary-modern))]">
            <Calendar className="h-6 w-6" />
            Reservar Ahora
          </button>
        </div>
      </section>

      <Footer currentStyle="modern" setCurrentStyle={setCurrentStyle} />
    </div>
  );
};

export default HomepageModern;
