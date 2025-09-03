import { useRouter } from "next/navigation";
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

interface PeluqueriaFooterProps {
  currentStyle: string;
  setCurrentStyle: (style: string) => void;
}

const PeluqueriaFooter = ({ currentStyle, setCurrentStyle }: PeluqueriaFooterProps) => {
  const router = useRouter();
  const { config } = useBusinessConfig();

  const styles = [
    {
      path: "modern",
      name: "Moderno",
      description: "Estilo vanguardista y trendy"
    },
    {
      path: "elegant",
      name: "Elegante", 
      description: "Sofisticación y minimalismo"
    },
    {
      path: "glamour",
      name: "Glamour",
      description: "Lujo y extravagancia"
    }
  ];

  const getFooterClasses = () => {
    if (currentStyle === "elegant") {
      return "bg-gradient-soft text-gray-800";
    } else if (currentStyle === "glamour") {
      return "bg-gradient-to-r from-yellow-500 to-pink-500 text-white";
    }
    return "bg-black text-white";
  };

  const getLinkClasses = (path: string) => {
    const isActive = currentStyle === path;
    const baseClasses = "block p-4 md:p-6 rounded-lg transition-all duration-300 text-center cursor-pointer";
    
    if (currentStyle === "elegant") {
      return `${baseClasses} ${isActive 
        ? 'bg-gray-800 text-white font-semibold' 
        : 'bg-white text-gray-800 hover:bg-gray-100'
      }`;
    } else if (currentStyle === "glamour") {
      return `${baseClasses} ${isActive 
        ? 'bg-white text-pink-600 font-bold' 
        : 'bg-white/20 text-white hover:bg-white/30'
      }`;
    }
    return `${baseClasses} ${isActive 
      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold' 
      : 'bg-gray-900 text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500'
    }`;
  };

  const handleNavigation = () => {
    router.push('/barberia');
  };

  return (
    <footer className={`${getFooterClasses()} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Explora Nuestros Estilos de {config.businessType === 'peluqueria' ? 'Peluquería' : 'Barbería'}</h3>
          <p className="opacity-80">Descubre diferentes experiencias en {config.name}</p>
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
            onClick={handleNavigation}
            className="px-6 py-3 border-2 border-current rounded hover:bg-current hover:text-black transition-all"
          >
            Ver Estilos de {config.businessType === 'peluqueria' ? 'Barbería' : 'Peluquería'}
          </button>
        </div>
        
        <div className="text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} {config.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default PeluqueriaFooter;