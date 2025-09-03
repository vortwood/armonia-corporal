import {
  Calendar,
  Clock,
  Gauge,
  Scissors,
  Star,
  Target,
  Zap,
} from "lucide-react";

import Footer from "./Footer";
import Logo from "./Logo";

interface HomepageIndustrialProps {
  setCurrentStyle: (style: string) => void;
}

const HomepageIndustrial = ({ setCurrentStyle }: HomepageIndustrialProps) => {
  const services = [
    {
      name: "FADE CUTS",
      price: "$28.000",
      duration: "40min",
      description: "Cortes degradados precisos y modernos",
      icon: Scissors,
    },
    {
      name: "BEARD SCULPT",
      price: "$22.000",
      duration: "35min",
      description: "Esculpido y diseño de barba urbana",
      icon: Target,
    },
    {
      name: "BROW DESIGN",
      price: "$15.000",
      duration: "20min",
      description: "Diseño geométrico de cejas masculinas",
      icon: Zap,
    },
    {
      name: "COLOR TECH",
      price: "$50.000",
      duration: "100min",
      description: "Coloración avanzada y técnicas urbanas",
      icon: Gauge,
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-industrial))]">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 left-0 z-50 p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo theme="industrial" size="md" />
          <button className="btn-industrial">BOOK NOW</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-industrial relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rotate-45 border border-[hsl(var(--accent-industrial))]"></div>
          <div className="absolute right-1/4 bottom-1/4 h-32 w-32 rotate-12 bg-[hsl(var(--accent-industrial))]"></div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <div className="animate-slide-up">
            <div className="mb-6">
              <div className="font-oswald inline-flex items-center gap-2 bg-[hsl(var(--accent-industrial))] px-6 py-2 font-bold tracking-wider text-[hsl(var(--accent-industrial-foreground))] uppercase">
                <Zap className="h-4 w-4" />
                EST. 2024
              </div>
            </div>
            <h1 className="title-industrial mb-8">
              URBAN
              <span className="block text-[hsl(var(--accent-industrial))]">
                EDGE
              </span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-[hsl(var(--primary-industrial-foreground))] opacity-90 md:text-xl">
              Donde el estilo urbano se encuentra con la precisión técnica.
              Definimos el futuro del grooming masculino.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="btn-industrial inline-flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                BOOK SLOT
              </button>
              <button className="font-oswald border-2 border-[hsl(var(--primary-industrial-foreground))] px-12 py-4 font-bold tracking-wider text-[hsl(var(--primary-industrial-foreground))] uppercase transition-all duration-300 hover:bg-[hsl(var(--primary-industrial-foreground))] hover:text-[hsl(var(--bg-industrial))]">
                SERVICES
              </button>
            </div>
          </div>
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-full w-full border-t-4 border-l-4 border-[hsl(var(--accent-industrial))]"></div>
              <div className="absolute -right-4 -bottom-4 h-full w-full border-r-4 border-b-4 border-[hsl(var(--accent-industrial))]"></div>
              <img
                src={"/barber.jpg"}
                alt="Barbería industrial moderna"
                className="relative z-10 w-full shadow-[var(--shadow-industrial)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[hsl(var(--surface-industrial))] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="h-px max-w-32 flex-1 bg-[hsl(var(--accent-industrial))]"></div>
              <div className="mx-6 bg-[hsl(var(--accent-industrial))] p-3">
                <Zap className="h-6 w-6 text-[hsl(var(--accent-industrial-foreground))]" />
              </div>
              <div className="h-px max-w-32 flex-1 bg-[hsl(var(--accent-industrial))]"></div>
            </div>
            <h2 className="font-oswald mb-6 text-5xl font-bold text-[hsl(var(--primary-industrial-foreground))] uppercase md:text-6xl">
              PRECISION SERVICES
            </h2>
            <p className="font-oswald mx-auto max-w-3xl text-xl tracking-wide text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
              TÉCNICAS AVANZADAS / RESULTADOS GARANTIZADOS / ESTILO URBANO
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.name}
                className="card-industrial group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex items-center gap-6">
                  <div className="flex h-12 w-12 items-center justify-center bg-[hsl(var(--accent-industrial))] text-[hsl(var(--accent-industrial-foreground))] transition-transform duration-300 group-hover:scale-110">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-oswald text-xl font-bold tracking-wide text-[hsl(var(--primary-industrial-foreground))] uppercase">
                      {service.name}
                    </h3>
                    <div className="font-oswald flex items-center text-sm text-[hsl(var(--accent-industrial))] uppercase">
                      <Clock className="mr-1 h-4 w-4" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed text-[hsl(var(--primary-industrial-foreground))] opacity-80">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-oswald text-3xl font-bold text-[hsl(var(--accent-industrial))]">
                    {service.price}
                  </span>
                  <button className="font-oswald bg-[hsl(var(--accent-industrial))] px-4 py-2 text-sm font-bold text-[hsl(var(--accent-industrial-foreground))] uppercase transition-colors duration-300 hover:bg-[hsl(var(--primary-industrial-foreground))] hover:text-[hsl(var(--bg-industrial))]">
                    BOOK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="bg-[hsl(var(--bg-industrial))] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-oswald mb-8 text-5xl leading-none font-bold text-[hsl(var(--primary-industrial-foreground))] uppercase md:text-6xl">
                NEXT LEVEL
                <span className="block text-[hsl(var(--accent-industrial))]">
                  GROOMING
                </span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-[hsl(var(--primary-industrial-foreground))] opacity-90">
                Utilizamos las últimas tecnologías y técnicas de vanguardia para
                crear looks que definen tendencias. En Barbería Maldonado, el
                futuro del estilo masculino es hoy.
              </p>
              <div className="mb-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center bg-[hsl(var(--accent-industrial))]">
                    <Target className="h-5 w-5 text-[hsl(var(--accent-industrial-foreground))]" />
                  </div>
                  <span className="font-oswald tracking-wide text-[hsl(var(--primary-industrial-foreground))] uppercase">
                    Precisión milimétrica
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center bg-[hsl(var(--accent-industrial))]">
                    <Zap className="h-5 w-5 text-[hsl(var(--accent-industrial-foreground))]" />
                  </div>
                  <span className="font-oswald tracking-wide text-[hsl(var(--primary-industrial-foreground))] uppercase">
                    Técnicas de vanguardia
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center bg-[hsl(var(--accent-industrial))]">
                    <Gauge className="h-5 w-5 text-[hsl(var(--accent-industrial-foreground))]" />
                  </div>
                  <span className="font-oswald tracking-wide text-[hsl(var(--primary-industrial-foreground))] uppercase">
                    Resultados garantizados
                  </span>
                </div>
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="card-industrial text-center">
                <div className="mb-8 grid grid-cols-3 gap-8">
                  <div>
                    <div className="font-oswald mb-2 text-4xl font-bold text-[hsl(var(--accent-industrial))]">
                      500+
                    </div>
                    <div className="font-oswald text-sm text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
                      Cuts/Month
                    </div>
                  </div>
                  <div>
                    <div className="font-oswald mb-2 text-4xl font-bold text-[hsl(var(--accent-industrial))]">
                      24/7
                    </div>
                    <div className="font-oswald text-sm text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
                      Booking
                    </div>
                  </div>
                  <div>
                    <div className="font-oswald mb-2 text-4xl font-bold text-[hsl(var(--accent-industrial))]">
                      98%
                    </div>
                    <div className="font-oswald text-sm text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
                      Satisfaction
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[hsl(var(--accent-industrial))] text-[hsl(var(--accent-industrial))]"
                    />
                  ))}
                </div>
                <p className="font-oswald text-sm text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
                  TOP RATED URBAN BARBERSHOP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[hsl(var(--surface-industrial))] to-[hsl(var(--bg-industrial))] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-[hsl(var(--accent-industrial))]">
              <Zap className="h-10 w-10 text-[hsl(var(--accent-industrial-foreground))]" />
            </div>
          </div>
          <h2 className="font-oswald mb-8 text-5xl leading-none font-bold text-[hsl(var(--primary-industrial-foreground))] uppercase md:text-6xl">
            READY TO
            <span className="block text-[hsl(var(--accent-industrial))]">
              LEVEL UP?
            </span>
          </h2>
          <p className="font-oswald mx-auto mb-12 max-w-2xl text-xl tracking-wider text-[hsl(var(--primary-industrial-foreground))] uppercase opacity-80">
            EXPERIMENTA EL SIGUIENTE NIVEL DEL GROOMING URBANO / RESERVA AHORA
          </p>
          <button className="font-oswald inline-flex items-center gap-4 bg-[hsl(var(--accent-industrial))] px-16 py-5 text-xl font-bold tracking-wider text-[hsl(var(--accent-industrial-foreground))] uppercase transition-all duration-300 hover:scale-105 hover:bg-[hsl(var(--primary-industrial-foreground))] hover:text-[hsl(var(--bg-industrial))]">
            <Calendar className="h-6 w-6" />
            BOOK YOUR SLOT
          </button>
        </div>
      </section>

      <Footer currentStyle="industrial" setCurrentStyle={setCurrentStyle} />
    </div>
  );
};

export default HomepageIndustrial;
