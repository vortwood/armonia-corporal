"use client";

// Imagenes optimizadas
import cliente1 from "/public/clientes/cliente1.png";
import cliente2 from "/public/clientes/cliente2.png";
import cliente3 from "/public/clientes/cliente3.png";

export function Imagenes() {
  const clientImages = [
    {
      src: cliente1,
      alt: "Corte fade moderno realizado en Baraja Studio Maldonado - Cliente satisfecho",
      title: "Corte fade moderno - Baraja Studio",
    },
    {
      src: cliente2,
      alt: "Corte degradado profesional Baraja Studio - Barbería Maldonado Uruguay",
      title: "Corte degradado profesional - Baraja Studio",
    },
    {
      src: cliente3,
      alt: "Resultado de corte masculino en Baraja Studio - Mejor barbería Maldonado",
      title: "Corte masculino profesional - Baraja Studio",
    },
  ];

  return (
    <section className="flex w-full flex-col items-center justify-between gap-5 px-5 md:flex-row md:gap-1">
      <h3 className="sr-only">
        Galería de Trabajos - Cortes Realizados en Baraja Studio
      </h3>
      {clientImages.map((image, index) => (
        <figure key={index} className="relative">
          <img
            src={image.src.src}
            alt={image.alt}
            title={image.title}
            width={360}
            height={560}
            className="h-[460px] object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <figcaption className="sr-only">{image.alt}</figcaption>
        </figure>
      ))}

      {/* Schema markup for image gallery */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Galería de Trabajos - Baraja Studio",
            description:
              "Galería de cortes y trabajos realizados en Baraja Studio, barbería profesional en Maldonado, Uruguay",
            image: clientImages.map((img) => ({
              "@type": "ImageObject",
              url: `https://www.alejandraduarte.uy${img.src.src}`,
              caption: img.alt,
              width: 360,
              height: 560,
            })),
          }),
        }}
      />
    </section>
  );
}
