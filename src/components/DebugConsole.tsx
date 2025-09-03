"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    eruda?: {
      init: () => void;
    };
  }
}

export function DebugConsole() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//cdn.jsdelivr.net/npm/eruda";
    script.async = true;
    script.onload = () => {
      if (typeof window !== "undefined" && window.eruda) {
        window.eruda.init();
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}