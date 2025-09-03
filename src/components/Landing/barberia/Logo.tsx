// import logoImage from "/logo.png";

import { useBusinessConfig } from "@/hooks/useBusinessConfig";

interface LogoProps {
  theme: "modern" | "vintage" | "industrial";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ theme, size = "md" }: LogoProps) => {
  const { config } = useBusinessConfig();
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const getTextClasses = () => {
    const baseClasses = `font-bold ${textSizeClasses[size]} ml-3`;

    if (theme === "vintage") {
      return `${baseClasses} font-playfair text-[hsl(var(--primary-vintage))]`;
    } else if (theme === "industrial") {
      return `${baseClasses} font-oswald text-[hsl(var(--primary-industrial-foreground))] uppercase tracking-wide`;
    }
    return `${baseClasses} font-inter text-[hsl(var(--primary-modern))]`;
  };

  return (
    <div className="flex items-center">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full`}
      >
        <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600 font-bold">
          {config.shortName}
        </div>
      </div>
      <span className={getTextClasses()}>{config.name}</span>
    </div>
  );
};

export default Logo;
