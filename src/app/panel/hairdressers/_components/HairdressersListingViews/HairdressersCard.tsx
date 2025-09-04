"use client";

import type { Professional } from "@/util/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HairdressersCardProps {
  professionals: Professional[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditProfessional: (professional: Professional) => void;
  onDeleteProfessional: (professional: Professional) => void;
}

export default function HairdressersCard({
  professionals,
  onToggleActive,
  onEditProfessional,
  onDeleteProfessional,
}: HairdressersCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {professionals && professionals.length > 0 ? professionals.map((professional) => (
        <Card key={professional.id} className="w-full py-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header con nombre y foto */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {professional.photo ? (
                      <img
                        src={professional.photo}
                        alt={professional.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-gray-600">
                        {getInitials(professional.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {professional.name}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <Checkbox
                        checked={professional.isActive}
                        onCheckedChange={() =>
                          onToggleActive(professional.id, professional.isActive)
                        }
                      />
                      <span className="text-sm text-gray-500">
                        {professional.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white" align="end">
                    <DropdownMenuItem
                      onClick={() => onEditProfessional(professional)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteProfessional(professional)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Informaci�n de contacto */}
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Contacto</p>
                  <p className="text-sm text-gray-900">{professional.email}</p>
                  <p className="text-sm text-gray-500">{professional.phone}</p>
                </div>
              </div>

              {/* Horario */}
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Horario</p>
                  {professional.schedule.weeklySchedule ? (
                    <div className="space-y-1">
                      {professional.schedule.weeklySchedule
                        .filter((day) => day.isWorkingDay)
                        .map((day) => (
                          <div
                            key={day.dayOfWeek}
                            className="text-xs text-gray-600"
                          >
                            <span className="capitalize">
                              {day.dayOfWeek.slice(0, 3)}
                            </span>
                            :
                            {day.workingPeriods && day.workingPeriods.length > 0
                              ? day.workingPeriods
                                  .map(
                                    (period) =>
                                      ` ${period.startTime}-${period.endTime}`,
                                  )
                                  .join(", ")
                              : " Sin horario"}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Sin horario configurado
                    </p>
                  )}
                </div>
              </div>

              {/* Servicios */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Servicios</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-sm">
                    {professional.services?.length || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay profesionales disponibles</p>
        </div>
      )}
    </div>
  );
}
