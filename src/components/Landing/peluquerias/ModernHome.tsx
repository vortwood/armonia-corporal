import { Heart, Instagram, Music, TrendingUp, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

import PeluqueriaFooter from "./PeluqueriaFooter";

interface ModernHomeProps {
  setCurrentStyle: (style: string) => void;
}

export default function ModernHome({ setCurrentStyle }: ModernHomeProps) {
  const { config, formatPrice } = useBusinessConfig();
  return (
    <div
      className="min-h-screen overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {/* Neon Hero with Diagonal Split */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src={"/nails2.jpg"}
            alt="Salon moderno"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black"></div>
        </div>

        {/* Floating nav */}
        <nav className="absolute top-0 right-0 left-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 rotate-45 items-center justify-center border-2 border-white">
                <span
                  className="-rotate-45 text-xl font-black text-white"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {config.shortName}
                </span>
              </div>
            </div>
            <div className="flex gap-6">
              {config.contact.instagram && (
                <Instagram className="h-6 w-6 cursor-pointer text-white transition-colors hover:text-pink-500" />
              )}
              <Music className="h-6 w-6 cursor-pointer text-white transition-colors hover:text-purple-500" />
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex h-screen items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <div className="mb-6 inline-block">
                <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-bold text-white">
                  🔥 NUEVO ESTILO 2024
                </span>
              </div>

              <h1
                className="mb-6 text-6xl leading-none font-black md:text-8xl lg:text-9xl"
                style={{ fontFamily: "Montserrat" }}
              >
                <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {config.name.split(' ')[0]}
                </span>
                <span className="block text-white">{config.name.split(' ').slice(1).join(' ') || config.tagline}</span>
              </h1>

              <p className="mb-8 text-xl font-light text-gray-300 md:text-2xl">
                {config.tagline}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => console.log("nada")}
                  className="transform rounded-none bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-6 text-lg font-bold text-white transition-all hover:scale-105 hover:opacity-90"
                >
                  <Zap className="mr-2" />
                  RESERVA YA
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none border-2 border-white px-8 py-6 text-lg font-bold text-white hover:bg-white hover:text-black"
                >
                  VER LOOKS
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated gradient line */}
        <div className="animate-shimmer absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
      </section>

      {/* Services Grid - Brutalist Style */}
      <section className="bg-white px-6 py-20 text-black">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2
              className="mb-4 text-5xl font-black md:text-6xl"
              style={{ fontFamily: "Montserrat" }}
            >
              SERVICIOS
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {config.businessType === 'peluqueria' ? 'TRENDING' : 'PREMIUM'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {config.services.slice(0, 4).map((service, index) => (
              <div
                key={index}
                className={`group cursor-pointer border-4 border-black p-8 transition-all hover:bg-black hover:text-white ${
                  index === 1 || index === 3 ? 'md:border-l-4' : ''
                } ${index >= 2 ? 'border-t-0' : ''}`}
              >
                <div className={`mb-4 text-6xl font-black transition-colors ${
                  index % 2 === 0 ? 'group-hover:text-pink-500' : 'group-hover:text-purple-500'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-2 text-2xl font-bold">{service.name.toUpperCase()}</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  {service.description}
                </p>
                <p className="mt-4 text-3xl font-black">{formatPrice(service.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Gallery - Masonry Style */}
      <section className="bg-black px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-pink-500" />
            <h2
              className="text-4xl font-black text-white md:text-5xl"
              style={{ fontFamily: "Montserrat" }}
            >
              HOT RIGHT NOW
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="col-span-2 row-span-2">
              <img
                src={"/peluqueria-work-1.jpg"}
                alt="Trabajo moderno"
                className="h-full w-full object-cover"
              />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-pink-500 to-purple-500 opacity-80 transition-opacity hover:opacity-100"
              ></div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              "#WolfCut",
              "#MoneyPiece",
              "#ButterflyLayers",
              "#FantasyHair",
              "#Y2KVibes",
              "#ColorMelt",
            ].map((tag) => (
              <span
                key={tag}
                className="cursor-pointer border-2 border-pink-500 px-4 py-2 font-bold text-pink-500 transition-all hover:bg-pink-500 hover:text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Gen Z Style */}
      <section className="bg-white px-6 py-20 text-black">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-4 text-5xl font-black"
              style={{ fontFamily: "Montserrat" }}
            >
              LA COMUNIDAD
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {config.name.toUpperCase()}
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rotate-1 bg-gradient-to-br from-pink-100 to-purple-100 p-6 transition-transform hover:rotate-0">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                <div>
                  <p className="font-bold">@sofia_style</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className="h-4 w-4 fill-pink-500 text-pink-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm">
                OBSESSED con mi nuevo color!! El equipo es INCREÍBLE 💕
              </p>
            </div>

            <div className="-rotate-1 bg-gradient-to-br from-purple-100 to-pink-100 p-6 transition-transform hover:rotate-0">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div>
                  <p className="font-bold">@luna_vibes</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className="h-4 w-4 fill-purple-500 text-purple-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm">
                Mi wolf cut está PERFECTO! Ya tengo mi lugar favorito 🔥
              </p>
            </div>

            <div className="rotate-1 bg-gradient-to-br from-pink-100 to-purple-100 p-6 transition-transform hover:rotate-0">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                <div>
                  <p className="font-bold">@vale_trendy</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className="h-4 w-4 fill-pink-500 text-pink-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm">
                El mejor salón de {config.location.city} sin duda! Vibe check: PASSED ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold and Direct */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-6 text-5xl font-black text-white md:text-7xl"
            style={{ fontFamily: "Montserrat" }}
          >
            ¿LISTA PARA
            <br />
            TU GLOW UP?
          </h2>
          <p className="mb-8 text-2xl text-white/90">
            Primera visita -20% OFF 🔥
          </p>
          <Button
            onClick={() => console.log("nada")}
            size="lg"
            className="transform rounded-none bg-white px-12 py-8 text-2xl font-black text-black transition-all hover:scale-110 hover:bg-gray-100"
          >
            BOOK NOW
          </Button>
        </div>
      </section>

      <PeluqueriaFooter
        currentStyle="modern"
        setCurrentStyle={setCurrentStyle}
      />
    </div>
  );
}
