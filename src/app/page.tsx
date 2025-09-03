import { unifrakturMaguntia } from "@/util/fonts";

import { Imagenes } from "@/components/ui/Imagenes";
import { About } from "@/components/Landing/About";
import { Hero } from "@/components/Landing/Hero";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function Home() {
  return (
    <LayoutWrapper>
      <Hero />
      <About />

      <div className="flex w-full flex-col items-center justify-center gap-10 bg-black px-5 pt-0 text-white lg:px-10">
        <div className="flex w-full flex-col items-start justify-center gap-5 border-x border-white py-10 lg:gap-10 lg:p-22">
          <h2
            className={`${unifrakturMaguntia.className} px-5 pt-5 text-3xl font-semibold md:text-6xl lg:px-0`}
          >
            Nuestros clientes
          </h2>
          <Imagenes />
        </div>
      </div>

      <div
        className="pointer-events-none absolute top-1/4 bottom-0 left-1/3 z-1 h-[300px] w-[200px] rotate-[20deg] bg-contain bg-no-repeat opacity-20 lg:top-1/2 lg:left-1/8 lg:h-[700px] lg:w-[400px] lg:rotate-[140deg]"
        style={{
          backgroundImage: "url(/bg-1.png)",
          backgroundPosition: "bottom left",
        }}
      ></div>
    </LayoutWrapper>
  );
}
