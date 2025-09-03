import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Servicios - Panel Administrativo",
  description: "Panel administrativo para gestión de servicios. Acceso restringido.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}