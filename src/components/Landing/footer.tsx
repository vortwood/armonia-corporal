import { useBusinessConfig } from "@/hooks/useBusinessConfig";

const Footer = () => {
  const { config } = useBusinessConfig();

  const getFooterClasses = () => {
    return "bg-gradient-soft text-gray-800";
  };

  return (
    <footer className={`${getFooterClasses()} px-4 py-12`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-2xl font-bold">
            Explora Nuestros Estilos de{" "}
            {config.businessType === "spa"
              ? "Spa"
              : config.businessType === "centro_bienestar"
                ? "Centro de Bienestar"
                : "Clínica Estética"}
          </h3>
          <p className="opacity-80">
            Descubre diferentes experiencias en {config.name}
          </p>
        </div>

        <div className="text-center text-sm opacity-60">
          <p>
            &copy; {new Date().getFullYear()} {config.name}. Todos los derechos
            reservados.
          </p>
          <br />
          <p>
            Diseñado y desarrollado por{" "}
            <a
              href="https://www.vortwood.com"
              referrerPolicy="no-referrer"
              about="_blank"
              className="font-semibold underline"
            >
              Vortwood Software
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
