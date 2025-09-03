"use client";

import React from "react";
import { useState } from "react";
import ModernHome from "@/components/Landing/peluquerias/ModernHome";
import ElegantHome from "@/components/Landing/peluquerias/ElegantHome";
import GlamourHome from "@/components/Landing/peluquerias/GlamourHome";

export default function PeluqueriaPage() {
  const [currentStyle, setCurrentStyle] = useState("modern");

  const renderCurrentStyle = () => {
    switch (currentStyle) {
      case "modern":
        return <ModernHome setCurrentStyle={setCurrentStyle} />;
      case "elegant":
        return <ElegantHome setCurrentStyle={setCurrentStyle} />;
      case "glamour":
        return <GlamourHome setCurrentStyle={setCurrentStyle} />;
      default:
        return <ModernHome setCurrentStyle={setCurrentStyle} />;
    }
  };

  return <div>{renderCurrentStyle()}</div>;
}