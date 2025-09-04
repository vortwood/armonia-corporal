"use client";

import type { Professional } from "@/util/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HairdressersTableProps {
  professionals: Professional[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditProfessional: (professional: Professional) => void;
  onDeleteProfessional: (professional: Professional) => void;
}

export default function HairdressersTable({
  professionals,
  onToggleActive,
  onEditProfessional,
  onDeleteProfessional,
}: HairdressersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Table>
      <TableHeader className="bg-gray-200">
        <TableRow>
          <TableHead>Profesional</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Servicios</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {professionals && professionals.length > 0 ? (
          professionals.map((professional) => (
            <TableRow key={professional.id} className="py-2">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                    {professional.photo ? (
                      <img
                        src={professional.photo}
                        alt={professional.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm font-medium text-neutral-600">
                        {getInitials(professional.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {professional.name}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-900">
                    {professional.email}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {professional.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {professional.schedule.weeklySchedule ? (
                    <div className="space-y-1">
                      {professional.schedule.weeklySchedule
                        .filter((day) => day.isWorkingDay)
                        .map((day) => (
                          <div key={day.dayOfWeek} className="text-xs">
                            <span className="font-medium capitalize">
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
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-sm">
                    {professional.services?.length || 0}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={professional.isActive}
                    onCheckedChange={() =>
                      onToggleActive(professional.id, professional.isActive)
                    }
                    className="cursor-pointer data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                  />
                  <span className="text-sm text-neutral-500">
                    {professional.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
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
                  <DropdownMenuContent className="rounded-xl bg-white shadow-lg">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onEditProfessional(professional)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() => onDeleteProfessional(professional)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="py-4 text-center">
              No hay profesionales disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
