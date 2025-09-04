import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Cosmetología, aparatología, tratamientos faciales y corporales en maldonado y punta del este uruguay- Alejandra Duarte",
  description:
    "Reserva tu turno online en para Cosmetología, aparatología, tratamientos faciales y corporales en maldonado y punta del este uruguay- Alejandra Duarte.",
  keywords: [
    "reservar turno barbería Maldonado",
    "agenda online barbería",
    "turno barbería Maldonado",
    "reserva corte cabello Uruguay",
    "barbería online Maldonado",
    "cita barbería Cerro Pelado",
    "booking barbería Uruguay",
  ],
  openGraph: {
    title: "Reservar Turno | Baraja Studio Maldonado",
    description:
      "Reserva tu turno fácil y rápido en la mejor barbería de Maldonado. Sistema online disponible 24/7.",
    url: "https://www.alejandraduarte.uy/agenda",
  },
  alternates: {
    canonical: "https://www.alejandraduarte.uy/agenda",
  },
};

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
