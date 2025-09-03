"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import type { Professional } from "@/util/types";
import { getActiveProfessionals } from "@/util/dynamicScheduling";

interface ProfessionalSelectProps {
  selectedProfessional: Professional | null;
  onSelect: (professional: Professional) => void;
  onSelectionReset?: () => void;
}

export function ProfessionalSelect({
  selectedProfessional,
  onSelect,
  onSelectionReset,
}: ProfessionalSelectProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        const professionals = await getActiveProfessionals();
        setProfessionals(professionals);
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("Error al cargar los profesionales");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const handleSelect = (professional: Professional) => {
    if (selectedProfessional?.id !== professional.id && onSelectionReset) {
      onSelectionReset();
    }
    onSelect(professional);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Error al cargar profesionales</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            const fetchProfessionals = async () => {
              try {
                setLoading(true);
                setError(null);
                const professionals = await getActiveProfessionals();
                setProfessionals(professionals);
              } catch (err) {
                console.error("Error fetching professionals:", err);
                setError("Error al cargar los profesionales");
              } finally {
                setLoading(false);
              }
            };
            fetchProfessionals();
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-amber-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-amber-800 font-medium mb-2">No hay profesionales disponibles</h3>
          <p className="text-amber-700 text-sm mb-4">
            Actualmente no tenemos profesionales registrados para agendar citas.
          </p>
          <p className="text-amber-600 text-xs">
            Por favor, contacta directamente al establecimiento para más información.
          </p>
        </div>
        <button
          onClick={() => {
            const fetchProfessionals = async () => {
              try {
                setLoading(true);
                setError(null);
                const professionals = await getActiveProfessionals();
                setProfessionals(professionals);
              } catch (err) {
                console.error("Error fetching professionals:", err);
                setError("Error al cargar los profesionales");
              } finally {
                setLoading(false);
              }
            };
            fetchProfessionals();
          }}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Actualizar
        </button>
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
              ? "border-gray-400 bg-white shadow-md"
              : "border-gray-300 bg-white/50 hover:border-gray-400 hover:shadow-sm"
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
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg">
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{professional.name}</h3>
                <p className="text-gray-600">
                  {professional.services?.length > 0 
                    ? `${professional.services.length} servicios disponibles`
                    : "Terapeuta profesional"
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