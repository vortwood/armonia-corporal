"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LogOutIcon } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/login", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        router.replace("/login");
      } else {
        console.error("Error during logout");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={
        className ||
        "flex items-center cursor-pointer rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 font-normal text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {isLoggingOut ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Cerrando...
        </>
      ) : (
        <>
          <LogOutIcon className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </>
      )}
    </button>
  );
}
