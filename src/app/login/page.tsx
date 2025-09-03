"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL de redirección después del login exitoso
  const redirectUrl = searchParams.get("redirect") || "/panel";

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // Ya está autenticado, redirigir
          router.replace(redirectUrl);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    // Validación del lado del cliente
    if (!password) {
      setError("La contraseña es requerida");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para cookies
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login exitoso - redirigir
        router.replace(redirectUrl);
      } else {
        // Mostrar error específico
        switch (response.status) {
          case 429:
            setError(
              "Demasiados intentos de login. Intenta de nuevo en 15 minutos.",
            );
            break;
          case 401:
            setError("Credenciales incorrectas");
            break;
          case 400:
            setError("Datos inválidos");
            break;
          default:
            setError(data.message || "Error de autenticación");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (isCheckingAuth) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-10 bg-black">
      <section>
        <div className="relative mx-auto w-full max-w-7xl items-center bg-black px-5 py-12 md:px-12 lg:px-20">
          <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            <div className="flex flex-col">
              <div>
                <h2 className="pb-10 text-center text-3xl text-white">
                  Entrar al panel
                </h2>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mt-4 space-y-6">
                {/* Mostrar errores */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-center text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="col-span-full">
                  <label className="mb-2 block text-sm font-normal text-white">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    disabled={isLoading}
                    minLength={8}
                    required
                    className="flex h-full w-full appearance-none rounded-lg border border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-black focus:ring-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  />
                </div>

                <div className="col-span-full">
                  <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-white px-6 py-2.5 text-center text-sm text-white duration-200 hover:border-neutral-200 hover:bg-neutral-100 hover:text-black focus:outline-none focus-visible:ring-black focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        VERIFICANDO...
                      </>
                    ) : (
                      "E N T R A R"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
