import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estadísticas - Panel Administrativo",
  description: "Panel administrativo para visualización de estadísticas. Acceso restringido.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}