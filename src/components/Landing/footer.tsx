import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex h-fit flex-col items-center justify-between bg-black px-5 pb-10 text-white/80 lg:px-10">
      <div className="w-full rounded-b-4xl border border-t-0 border-white">
        <div className="flex flex-col items-center justify-between md:flex-row md:gap-16 md:py-5 lg:px-22">
          <div className="flex w-full flex-col items-start justify-center gap-5 py-5">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-32 object-cover"
            ></img>

            <div className="flex flex-col gap-1 pl-8 text-lg">
              <p>(+598) 099 579 767</p>
              <p>Cuchilla de la India Muerta casi Cerro Colorado, Cerro Pelado</p>
            </div>

            <Link href="/agenda" className="pl-8">
              <button className="cursor-pointer rounded-sm border-2 border-white/80 px-6 py-2 font-normal text-white/80 transition-colors duration-200 hover:bg-white/80 hover:text-black md:text-2xl">
                Agendá tu hora
              </button>
            </Link>
          </div>

          {/* <div
  className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[300px] w-[200px] lg:h-[700px] lg:w-[400px] bg-contain bg-no-repeat opacity-20"
  style={{
    backgroundImage: "url(/bg-2.png)",
    backgroundPosition: "bottom right",
  }}
></div> */}
        </div>

        <p className="my-4 flex w-full flex-col items-start justify-between px-5 text-center text-white/50 lg:flex-row lg:items-center lg:px-30">
          <span>© {new Date().getFullYear()} Baraja Studio</span>
          <span>Todos los derechos reservados.</span>
        </p>
      </div>
    </footer>
  );
}
