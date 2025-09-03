import { useRouter } from "next/navigation";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

interface FooterProps {
  currentStyle: string;
  setCurrentStyle: (style: string) => void;
}

const Footer = ({ currentStyle, setCurrentStyle }: FooterProps) => {
  const router = useRouter();
  const { config } = useBusinessConfig();

  const styles = [
    {
      path: "modern",
      name: "Moderno",
      description: "Estilo minimalista y contemporáneo"
    },
    {
      path: "vintage",
      name: "Clásico", 
      description: "Tradición y elegancia atemporal"
    },
    {
      path: "industrial",
      name: "Industrial",
      description: "Urbano y vanguardista"
    }
  ];

  const getFooterClasses = () => {
    if (currentStyle === "vintage") {
      return "bg-[hsl(var(--primary-vintage))] text-[hsl(var(--primary-vintage-foreground))]";
    } else if (currentStyle === "industrial") {
      return "bg-[hsl(var(--bg-industrial))] text-[hsl(var(--primary-industrial-foreground))]";
    }
    return "bg-[hsl(var(--primary-modern))] text-[hsl(var(--primary-modern-foreground))]";
  };

  const getLinkClasses = (path: string) => {
    const isActive = currentStyle === path;
    const baseClasses = "block p-4 md:p-6 rounded-lg transition-all duration-300 text-center cursor-pointer";
    
    if (currentStyle === "vintage") {
      return `${baseClasses} ${isActive 
        ? 'bg-[hsl(var(--accent-vintage))] text-[hsl(var(--accent-vintage-foreground))] font-semibold' 
        : 'bg-[hsl(var(--surface-vintage))] text-[hsl(var(--primary-vintage))] hover:bg-[hsl(var(--accent-vintage))] hover:text-[hsl(var(--accent-vintage-foreground))]'
      }`;
    } else if (currentStyle === "industrial") {
      return `${baseClasses} ${isActive 
        ? 'bg-[hsl(var(--accent-industrial))] text-[hsl(var(--accent-industrial-foreground))] font-bold' 
        : 'bg-[hsl(var(--surface-industrial))] text-[hsl(var(--primary-industrial-foreground))] hover:bg-[hsl(var(--accent-industrial))] hover:text-[hsl(var(--accent-industrial-foreground))]'
      }`;
    }
    return `${baseClasses} ${isActive 
      ? 'bg-[hsl(var(--accent-modern))] text-[hsl(var(--accent-modern-foreground))] font-semibold' 
      : 'bg-white text-[hsl(var(--primary-modern))] hover:bg-[hsl(var(--accent-modern))] hover:text-[hsl(var(--accent-modern-foreground))]'
    }`;
  };

  return (
    <footer className={`${getFooterClasses()} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Explora Nuestros Estilos</h3>
          <p className="opacity-80">Descubre diferentes experiencias de {config.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {styles.map((style) => (
            <div 
              key={style.path}
              onClick={() => setCurrentStyle(style.path)}
              className={getLinkClasses(style.path)}
            >
              <div className="font-bold text-lg mb-1">{style.name}</div>
              <div className="text-sm opacity-75">{style.description}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <button 
            onClick={() => router.push('/peluqueria')}
            className="px-6 py-3 border-2 border-current rounded hover:bg-current hover:text-black transition-all"
          >
            Ver Estilos de Peluquería
          </button>
        </div>
        
        <div className="text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} {config.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;