import {
  Calendar,
  Clock,
  Crown,
  Scissors,
  Shield,
  Star,
} from "lucide-react";

import Footer from "./Footer";
import Logo from "./Logo";

interface HomepageVintageProps {
  setCurrentStyle: (style: string) => void;
}

const HomepageVintage = ({ setCurrentStyle }: HomepageVintageProps) => {
  const services = [
    {
      name: "Corte Clásico",
      price: "$25.000",
      duration: "45 min",
      description: "Cortes tradicionales con técnicas artesanales",
      icon: Scissors,
    },
    {
      name: "Afeitado Tradicional",
      price: "$20.000",
      duration: "40 min",
      description: "Navaja tradicional con toallas calientes",
      icon: Shield,
    },
    {
      name: "Cejas & Bigote",
      price: "$15.000",
      duration: "25 min",
      description: "Perfilado clásico y cuidado detallado",
      icon: Crown,
    },
    {
      name: "Tratamiento Premium",
      price: "$55.000",
      duration: "90 min",
      description: "Experiencia completa con masajes y tratamientos",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-vintage))]">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 left-0 z-50 p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo theme="vintage" size="md" />
          <button className="btn-vintage">Reservar Cita</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-vintage">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
          <div className="animate-slide-up order-2 lg:order-1">
            <div className="mb-6">
              <div className="mb-4 inline-block rounded-none border-2 border-[hsl(var(--accent-vintage))] px-4 py-2">
                <span className="font-playfair font-medium text-[hsl(var(--primary-vintage))]">
                  Desde 1985
                </span>
              </div>
            </div>
            <h1 className="title-vintage mb-8">
              Elegancia
              <span className="block text-[hsl(var(--accent-vintage))] italic">
                Atemporal
              </span>
            </h1>
            <p className="font-playfair mb-10 text-lg leading-relaxed text-[hsl(var(--primary-vintage))] md:text-xl">
              Donde la tradición barbera se mantiene viva. Técnicas artesanales
              transmitidas de generación en generación.
            </p>
            <div className="flex flex-col gap-6 sm:flex-row">
              <button className="btn-vintage inline-flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                Agendar Turno
              </button>
              <button className="font-playfair border-2 border-[hsl(var(--primary-vintage))] px-10 py-4 font-semibold text-[hsl(var(--primary-vintage))] transition-all duration-500 hover:bg-[hsl(var(--primary-vintage))] hover:text-[hsl(var(--primary-vintage-foreground))]">
                Nuestra Historia
              </button>
            </div>
          </div>
          <div className="animate-scale-in order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 border-4 border-[hsl(var(--accent-vintage))]"></div>
              <img
                src={"/barber.jpg"}
                alt="Barbería clásica y elegante"
                className="relative z-10 w-full shadow-[var(--shadow-vintage)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[hsl(var(--primary-vintage-foreground))] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="h-px max-w-24 flex-1 bg-[hsl(var(--accent-vintage))]"></div>
              <div className="mx-6">
                <Crown className="h-8 w-8 text-[hsl(var(--accent-vintage))]" />
              </div>
              <div className="h-px max-w-24 flex-1 bg-[hsl(var(--accent-vintage))]"></div>
            </div>
            <h2 className="font-playfair mb-6 text-5xl font-bold text-[hsl(var(--primary-vintage))] md:text-6xl">
              Servicios de Distinción
            </h2>
            <p className="font-playfair mx-auto max-w-3xl text-xl text-[hsl(var(--primary-vintage))] italic">
              Cada servicio es una obra de arte, ejecutado con la precisión y el
              cuidado que solo la experiencia puede brindar
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.name}
                className="card-vintage group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 items-center justify-center border-4 border-[hsl(var(--accent-vintage))] bg-[hsl(var(--accent-vintage))] text-[hsl(var(--accent-vintage-foreground))] transition-all duration-500 group-hover:bg-transparent group-hover:text-[hsl(var(--accent-vintage))]">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-playfair mb-3 text-2xl font-semibold text-[hsl(var(--primary-vintage))]">
                      {service.name}
                    </h3>
                    <p className="mb-4 leading-relaxed text-[hsl(var(--primary-vintage))]">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-playfair text-3xl font-bold text-[hsl(var(--accent-vintage))]">
                        {service.price}
                      </span>
                      <div className="flex items-center text-[hsl(var(--primary-vintage))] opacity-75">
                        <Clock className="mr-2 h-4 w-4" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="bg-[hsl(var(--surface-vintage))] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="animate-fade-in">
              <div className="card-vintage text-center">
                <Crown className="mx-auto mb-6 h-12 w-12 text-[hsl(var(--accent-vintage))]" />
                <h3 className="font-playfair mb-4 text-2xl font-semibold text-[hsl(var(--primary-vintage))]">
                  Maestros Barberos
                </h3>
                <p className="mb-6 leading-relaxed text-[hsl(var(--primary-vintage))]">
                  Nuestros maestros barberos han perfeccionado su arte durante
                  décadas, manteniendo vivas las tradiciones que hacen única
                  cada experiencia.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="font-playfair mb-2 text-4xl font-bold text-[hsl(var(--accent-vintage))]">
                      40+
                    </div>
                    <div className="text-[hsl(var(--primary-vintage))]">
                      Años de tradición
                    </div>
                  </div>
                  <div>
                    <div className="font-playfair mb-2 text-4xl font-bold text-[hsl(var(--accent-vintage))]">
                      3
                    </div>
                    <div className="text-[hsl(var(--primary-vintage))]">
                      Generaciones
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-playfair mb-8 text-5xl font-bold text-[hsl(var(--primary-vintage))] md:text-6xl">
                Herencia & Tradición
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-[hsl(var(--primary-vintage))]">
                Desde 1985, Barbería Maldonado ha sido el refugio de caballeros
                que aprecian la calidad, el detalle y la experiencia auténtica
                de una barbería tradicional.
              </p>
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-[hsl(var(--accent-vintage))]">
                    <Star className="h-4 w-4 text-[hsl(var(--accent-vintage))]" />
                  </div>
                  <span className="font-playfair text-[hsl(var(--primary-vintage))]">
                    Técnicas artesanales auténticas
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-[hsl(var(--accent-vintage))]">
                    <Shield className="h-4 w-4 text-[hsl(var(--accent-vintage))]" />
                  </div>
                  <span className="font-playfair text-[hsl(var(--primary-vintage))]">
                    Productos premium tradicionales
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-[hsl(var(--accent-vintage))]">
                    <Crown className="h-4 w-4 text-[hsl(var(--accent-vintage))]" />
                  </div>
                  <span className="font-playfair text-[hsl(var(--primary-vintage))]">
                    Atención personalizada de lujo
                  </span>
                </div>
              </div>
              <div className="mb-6 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-[hsl(var(--accent-vintage))] text-[hsl(var(--accent-vintage))]"
                  />
                ))}
                <span className="font-playfair ml-3 text-[hsl(var(--primary-vintage))]">
                  Excelencia garantizada
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[hsl(var(--primary-vintage))] px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Crown className="mx-auto mb-6 h-16 w-16 text-[hsl(var(--accent-vintage))]" />
          </div>
          <h2 className="font-playfair mb-8 text-5xl font-bold text-[hsl(var(--primary-vintage-foreground))] md:text-6xl">
            Una Experiencia Distinguida
          </h2>
          <p className="font-playfair mx-auto mb-12 max-w-2xl text-xl text-[hsl(var(--primary-vintage-foreground))] italic opacity-90">
            Permítenos ser parte de tu rutina de cuidado personal. Experimenta
            la diferencia de la verdadera barbería tradicional.
          </p>
          <button className="font-playfair inline-flex items-center gap-4 border-2 border-[hsl(var(--accent-vintage))] bg-[hsl(var(--accent-vintage))] px-16 py-5 text-xl font-semibold text-[hsl(var(--accent-vintage-foreground))] transition-all duration-500 hover:border-[hsl(var(--primary-vintage-foreground))] hover:bg-[hsl(var(--primary-vintage-foreground))] hover:text-[hsl(var(--primary-vintage))]">
            <Calendar className="h-6 w-6" />
            Reservar Cita de Distinción
          </button>
        </div>
      </section>

      <Footer currentStyle="vintage" setCurrentStyle={setCurrentStyle} />
    </div>
  );
};

export default HomepageVintage;
