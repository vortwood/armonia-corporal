"use client";

import React from "react";
import { useState } from "react";
import HomepageModern from "@/components/Landing/barberia/HomepageModern";
import HomepageVintage from "@/components/Landing/barberia/HomepageVintage";
import HomepageIndustrial from "@/components/Landing/barberia/HomepageIndustrial";

export default function BarberiaPage() {
  const [currentStyle, setCurrentStyle] = useState("modern");

  const renderCurrentStyle = () => {
    switch (currentStyle) {
      case "modern":
        return <HomepageModern setCurrentStyle={setCurrentStyle} />;
      case "vintage":
        return <HomepageVintage setCurrentStyle={setCurrentStyle} />;
      case "industrial":
        return <HomepageIndustrial setCurrentStyle={setCurrentStyle} />;
      default:
        return <HomepageModern setCurrentStyle={setCurrentStyle} />;
    }
  };

  return <div>{renderCurrentStyle()}</div>;
}
