"use client";

import type { Service } from "@/util/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

interface ServicesTableProps {
  services: Service[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditService: (service: Service) => void;
}

export default function ServicesTable({
  services,
  onToggleActive,
  onEditService,
}: ServicesTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatPrice = (price: number, promoPrice: number) => {
    if (promoPrice && promoPrice < price) {
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-red-600 font-medium">
              ${promoPrice}
            </span>
            <Badge variant="destructive" className="text-xs">
              Promo
            </Badge>
          </div>
          <span className="text-sm text-gray-500 line-through">
            ${price}
          </span>
        </div>
      );
    }

    return (
      <span className="font-medium text-gray-900">
        ${price}
      </span>
    );
  };

  const formatDuration = (duration: number) => {
    if (duration === 0 || duration === undefined) {
      return "Sin duración";
    }
    return `${duration} min`;
  };

  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead>Servicio</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id} className="py-2">
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  {service.photo ? (
                    <img
                      src={service.photo}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-gray-600">
                      {getInitials(service.name)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {service.name}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="text-sm text-gray-600 max-w-xs truncate">
                {service.description || "Sin descripción"}
              </p>
            </TableCell>
            <TableCell>
              {formatPrice(service.price, service.promoPrice)}
            </TableCell>
            <TableCell>
              <p className="text-sm text-gray-900">
                {formatDuration(service.duration)}
              </p>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">
                {service.category || "Sin categoría"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  className="cursor-pointer"
                  checked={service.isActive}
                  onCheckedChange={() =>
                    onToggleActive(service.id, service.isActive)
                  }
                />
                <span className="text-sm text-gray-500">
                  {service.isActive ? "Activo" : "Inactivo"}
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
                    onClick={() => onEditService(service)}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => onEditService(service)}
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}