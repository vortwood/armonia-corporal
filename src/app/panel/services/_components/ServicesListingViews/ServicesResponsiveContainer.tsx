"use client";

import type { Service } from "@/util/types";

import { useIsMobile } from "@/hooks/use-mobile";

import ServicesCard from "./ServicesCard";
import ServicesTable from "./ServicesTable";

interface ServicesResponsiveContainerProps {
  services: Service[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditService: (service: Service) => void;
}

export default function ServicesResponsiveContainer({
  services,
  onToggleActive,
  onEditService,
}: ServicesResponsiveContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ServicesCard
        services={services}
        onToggleActive={onToggleActive}
        onEditService={onEditService}
      />
    );
  }

  return (
    <ServicesTable
      services={services}
      onToggleActive={onToggleActive}
      onEditService={onEditService}
    />
  );
}