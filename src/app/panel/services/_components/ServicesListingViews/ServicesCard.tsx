"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { Service } from "@/util/types";

interface ServicesCardProps {
  services: Service[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditService: (service: Service) => void;
}

export default function ServicesCard({
  services,
  onToggleActive,
  onEditService,
}: ServicesCardProps) {
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
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-red-600">
            ${promoPrice}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${price}
          </span>
          <Badge variant="destructive" className="text-xs">
            Promo
          </Badge>
        </div>
      );
    }
    
    return (
      <span className="text-lg font-medium text-gray-900">
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
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="w-full">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header con nombre y foto */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100">
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
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox
                        checked={service.isActive}
                        onCheckedChange={() =>
                          onToggleActive(service.id, service.isActive)
                        }
                      />
                      <span className="text-sm text-gray-500">
                        {service.isActive ? "Activo" : "Inactivo"}
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
                      onClick={() => onEditService(service)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onEditService(service)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Descripción</p>
                  <p className="text-sm text-gray-900">{service.description || "Sin descripción"}</p>
                </div>
              </div>

              {/* Precio y duración */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Precio</p>
                    {formatPrice(service.price, service.promoPrice)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Duración</p>
                    <p className="text-sm text-gray-900">{formatDuration(service.duration)}</p>
                  </div>
                </div>
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Categoría</p>
                <Badge variant="secondary" className="text-xs">
                  {service.category || "Sin categoría"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}