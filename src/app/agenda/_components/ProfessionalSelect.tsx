"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import type { Hairdresser } from "@/util/types";
import { getActiveHairdressers } from "@/util/dynamicScheduling";

interface ProfessionalSelectProps {
  selectedProfessional: Hairdresser | null;
  onSelect: (professional: Hairdresser) => void;
  onSelectionReset?: () => void;
}

export function ProfessionalSelect({
  selectedProfessional,
  onSelect,
  onSelectionReset,
}: ProfessionalSelectProps) {
  const [professionals, setProfessionals] = useState<Hairdresser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHairdressers = async () => {
      try {
        setLoading(true);
        setError(null);
        const hairdressers = await getActiveHairdressers();
        setProfessionals(hairdressers);
      } catch (err) {
        console.error("Error fetching hairdressers:", err);
        setError("Error al cargar los profesionales");
      } finally {
        setLoading(false);
      }
    };

    fetchHairdressers();
  }, []);

  const handleSelect = (professional: Hairdresser) => {
    if (selectedProfessional?.id !== professional.id && onSelectionReset) {
      onSelectionReset();
    }
    onSelect(professional);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-gray-400 text-center py-4">
          Cargando profesionales...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-400 text-center py-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {professionals.map((professional) => (
        <Card
          key={professional.id}
          className={`cursor-pointer transition-all border-2 ${
            selectedProfessional?.id === professional.id
              ? "border-white bg-neutral-100/20"
              : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
          }`}
          onClick={() => handleSelect(professional)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {professional.photo ? (
                <img
                  src={professional.photo}
                  alt={professional.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center text-white font-semibold text-lg">
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white text-lg">{professional.name}</h3>
                <p className="text-neutral-400">
                  {professional.services?.length > 0 
                    ? `${professional.services.length} servicios disponibles`
                    : "Peluquero profesional"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}