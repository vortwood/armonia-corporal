import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Peluqueros - Panel Administrativo",
  description: "Panel administrativo para gestión de peluqueros. Acceso restringido.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default function HairdressersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}