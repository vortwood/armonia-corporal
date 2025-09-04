"use client";

import { useRouter } from "next/navigation";

import { Star } from "lucide-react";

import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import { Button } from "@/components/ui/button";

import Footer from "./Footer";

export default function ElegantHome() {
  const { config, formatPrice } = useBusinessConfig();
  const router = useRouter();

  const handleBookingClick = () => {
    router.push("/agenda");
  };

  return (
    <div
      className="bg-gradient-soft min-h-screen"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      {/* Hero - Minimal con imagen de fondo */}
      <section className="relative h-screen">
        <img
          src={"/nails2.jpg"}
          alt="Salon elegante"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            <span className="text-4xl font-bold text-white">
              {config.shortName}
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-light tracking-wide text-white md:text-7xl lg:text-8xl">
            {config.name}
          </h1>
          <p className="mb-8 text-xl font-light text-white/90 italic">
            {config.tagline}
          </p>
          <Button
            onClick={handleBookingClick}
            className="text-foreground rounded-none bg-white px-12 py-6 text-lg font-light tracking-wider hover:bg-white/90"
          >
            RESERVAR CITA
          </Button>
        </div>
      </section>

      {/* About - Texto centrado minimalista */}
      <section className="px-4 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-foreground mb-8 text-4xl font-light md:text-5xl">
            Nuestra Filosofía
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            {config.description}
          </p>
        </div>
      </section>

      {/* Services - Lista minimalista */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-foreground mb-16 text-center text-4xl font-light">
            Servicios
          </h2>
          <div className="space-y-8">
            {config.services.slice(0, 4).map((service, index) => (
              <div
                key={index}
                className="border-border flex items-center justify-between border-b py-4"
              >
                <span className="text-foreground text-xl font-light">
                  {service.name}
                </span>
                <span className="text-muted-foreground text-xl">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Single Feature Image */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-foreground mb-6 text-3xl font-light">
                Experiencia y dedicación profesional
              </h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Con más de 5 años de experiencia como esteticista y cosmiátra,
                me especializo en tratamientos personalizados que realzan tu
                belleza natural. Utilizo productos de primera calidad y las
                técnicas más avanzadas en aparatología estética para cuidar tu
                piel y bienestar.
              </p>
              <Button
                onClick={handleBookingClick}
                className="bg-primary text-primary-foreground mt-8 rounded-none px-8 py-4"
              >
                Reservar cita
              </Button>
            </div>
            <div>
              <img
                src={"/peluqueria-work.jpg"}
                alt="Trabajo elegante"
                className="h-[500px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Simple quotes */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-12 text-center">
            <div>
              <div className="mb-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-gold text-gold h-5 w-5" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-xl font-light italic">
                Una experiencia transformadora. El equipo es increíblemente
                profesional y el resultado superó todas mis expectativas.
              </p>
              <p className="text-foreground">— María González</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Clean and simple */}
      <section className="px-4 py-32">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-foreground mb-8 text-3xl font-light">
            Visítanos
          </h2>
          <div className="text-muted-foreground space-y-4">
            <p>Mario E. de Cola s/n, Maldonado</p>
            <p>Lun - Vie: 9:00 - 18:00</p>
            <p>Sábado: 9:00 - 15:00</p>
            <p>Domingo: Cerrado</p>
            <p className="text-lg">+598 99 425 621</p>
          </div>
          <Button
            onClick={handleBookingClick}
            className="bg-primary text-primary-foreground mt-12 rounded-none px-12 py-6"
          >
            RESERVAR AHORA
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
