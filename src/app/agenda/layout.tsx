import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservar Turno Online | Barbería Baraja Studio Maldonado",
  description:
    "Reserva tu turno online en Baraja Studio, la mejor barbería de Maldonado. Sistema de reservas fácil y rápido. Cortes modernos, arreglo de barba y más.",
  keywords: [
    "reservar turno barbería Maldonado",
    "agenda online barbería",
    "turno barbería Maldonado",
    "reserva corte cabello Uruguay",
    "barbería online Maldonado",
    "cita barbería Cerro Pelado",
    "booking barbería Uruguay"
  ],
  openGraph: {
    title: "Reservar Turno | Baraja Studio Maldonado",
    description: "Reserva tu turno fácil y rápido en la mejor barbería de Maldonado. Sistema online disponible 24/7.",
    url: "https://www.barajastudio.uy/agenda",
  },
  alternates: {
    canonical: "https://www.barajastudio.uy/agenda",
  },
};

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}