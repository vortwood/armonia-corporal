import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso Administrativo - Baraja Studio",
  description: "Acceso restringido para personal autorizado de Baraja Studio.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
      {children}
    </>
  );
}