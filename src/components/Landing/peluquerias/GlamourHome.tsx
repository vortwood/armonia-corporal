import { Crown, Diamond, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

import PeluqueriaFooter from "./PeluqueriaFooter";

interface GlamourHomeProps {
  setCurrentStyle: (style: string) => void;
}

export default function GlamourHome({ setCurrentStyle }: GlamourHomeProps) {
  const { config, formatPrice } = useBusinessConfig();
  return (
    <div
      className="from-cream min-h-screen bg-gradient-to-b to-white"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* Luxe Header with ornate design */}
      <header className="bg-gradient-gold px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="shadow-gold flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <span
                className="text-gold text-lg font-bold"
                style={{ fontFamily: "Bebas Neue" }}
              >
                {config.shortName}
              </span>
            </div>
            <span className="hidden text-xl font-bold text-white md:block">
              {config.name}
            </span>
          </div>
          <nav className="hidden gap-8 text-white md:flex">
            <a href="#" className="hover:text-cream transition-colors">
              Inicio
            </a>
            <a href="#" className="hover:text-cream transition-colors">
              Servicios
            </a>
            <a href="#" className="hover:text-cream transition-colors">
              Galería
            </a>
            <a href="#" className="hover:text-cream transition-colors">
              VIP Club
            </a>
          </nav>
          <Button
            onClick={() => console.log("nada")}
            className="text-gold hover:bg-cream shadow-gold rounded-full bg-white px-6"
          >
            <Crown className="mr-2 h-4 w-4" />
            Reservar
          </Button>
        </div>
      </header>

      {/* Opulent Hero Section */}
      <section className="relative">
        <div className="grid min-h-[600px] md:grid-cols-2">
          <div className="from-gold/20 flex items-center justify-center bg-gradient-to-br to-transparent p-12">
            <div className="text-center md:text-left">
              <div className="bg-gold/20 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
                <Sparkles className="text-gold h-4 w-4" />
                <span className="text-gold text-sm font-semibold">
                  EXPERIENCIA PREMIUM
                </span>
              </div>
              <h1
                className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl"
                style={{ fontFamily: "Bebas Neue" }}
              >
                <span className="text-gold">{config.name.split(' ')[0]}</span>
                <br />
                <span className="text-foreground">{config.name.split(' ').slice(1).join(' ') || config.tagline}</span>
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md text-xl">
                {config.tagline}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => console.log("nada")}
                  className="bg-gradient-gold hover:shadow-gold rounded-full px-8 py-6 text-lg text-white"
                >
                  <Diamond className="mr-2" />
                  Experiencia VIP
                </Button>
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold rounded-full border-2 px-8 py-6 hover:text-white"
                >
                  Ver Servicios
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={"/nails2.jpg"}
              alt="Salon de lujo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20"></div>
          </div>
        </div>
      </section>

      {/* Luxury Services Cards */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Crown className="text-gold mx-auto mb-4 h-12 w-12" />
            <h2
              className="mb-4 text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "Bebas Neue" }}
            >
              SERVICIOS EXCLUSIVOS
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Tratamientos de alta gama diseñados para la élite
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {config.services.slice(0, 4).map((service, i) => {
              const icons = ["✨", "💎", "👑", "🌟"];
              return (
                <div
                  key={i}
                  className="from-gold/10 border-gold/30 hover:shadow-gold rounded-2xl border-2 bg-gradient-to-br to-transparent p-6 transition-all hover:-translate-y-2"
                >
                  <div className="mb-4 text-4xl">{icons[i] || "✨"}</div>
                  <h3 className="mb-2 text-xl font-bold">{service.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold text-2xl font-bold">
                      {formatPrice(service.price)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-gold hover:bg-gold/90 rounded-full text-white"
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIP Experience */}
      <section className="from-gold via-accent to-gold bg-gradient-to-r px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <img
                src={"/peluqueria-work.jpg"}
                alt="Trabajo glamoroso"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="text-white">
              <Diamond className="mb-6 h-12 w-12" />
              <h2
                className="mb-6 text-4xl font-bold"
                style={{ fontFamily: "Bebas Neue" }}
              >
                CLUB VIP BELLA VIBES
              </h2>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Acceso prioritario a citas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>20% descuento en todos los servicios</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Tratamientos exclusivos VIP</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Copa de champagne en cada visita</span>
                </li>
              </ul>
              <Button
                onClick={() => console.log("nada")}
                className="text-gold hover:bg-cream rounded-full bg-white px-8 py-6 text-lg font-bold shadow-xl"
              >
                Únete al Club VIP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Style */}
      <section className="bg-cream px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-12 text-4xl font-bold"
            style={{ fontFamily: "Bebas Neue" }}
          >
            CLIENTAS FELICES
          </h2>
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-gold text-gold h-6 w-6" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 text-xl italic">
              {config.testimonials && config.testimonials[0] ? 
                config.testimonials[0].text : 
                `El mejor salón de ${config.location.city}. El ambiente es lujoso, el servicio impecable y los resultados son simplemente espectaculares.`
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-gradient-gold h-12 w-12 rounded-full"></div>
              <div>
                <p className="font-bold">
                  {config.testimonials && config.testimonials[0] ? 
                    config.testimonials[0].name : 
                    "Cliente Satisfecho"
                  }
                </p>
                <p className="text-muted-foreground text-sm">
                  {config.testimonials && config.testimonials[0] && config.testimonials[0].username ? 
                    config.testimonials[0].username : 
                    "Cliente VIP"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ornate CTA */}
      <section className="px-4 py-20">
        <div className="from-gold via-accent to-gold mx-auto max-w-4xl rounded-3xl bg-gradient-to-br p-12 text-center shadow-2xl">
          <Crown className="mx-auto mb-6 h-16 w-16 text-white" />
          <h2
            className="mb-6 text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "Bebas Neue" }}
          >
            RESERVA TU EXPERIENCIA DE LUJO
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Primera visita con 30% de descuento en cualquier servicio premium
          </p>
          <Button
            onClick={() => console.log("nada")}
            size="lg"
            className="text-gold hover:bg-cream rounded-full bg-white px-12 py-7 text-xl font-bold shadow-xl"
          >
            RESERVAR AHORA
          </Button>
        </div>
      </section>

      <PeluqueriaFooter
        currentStyle="glamour"
        setCurrentStyle={setCurrentStyle}
      />
    </div>
  );
}
