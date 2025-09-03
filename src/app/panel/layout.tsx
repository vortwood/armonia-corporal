"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LayoutWrapper from "@/components/LayoutWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/login?redirect=/panel");
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
        setIsAuthenticated(false);
        router.replace("/login?redirect=/panel");
      }
    };

    verifyAuthentication();
  }, [router]);

  // Loading mientras verifica autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-center text-lg font-medium text-gray-600">
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
}
