"use client";

import type { Professional } from "@/util/types";

import { useIsMobile } from "@/hooks/use-mobile";

import HairdressersCard from "./HairdressersCard";
import HairdressersTable from "./HairdressersTable";

interface HairdressersResponsiveContainerProps {
  professionals: Professional[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditProfessional: (professional: Professional) => void;
  onDeleteProfessional: (professional: Professional) => void;
}

export default function HairdressersResponsiveContainer({
  professionals,
  onToggleActive,
  onEditProfessional,
  onDeleteProfessional,
}: HairdressersResponsiveContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <HairdressersCard
        professionals={professionals}
        onToggleActive={onToggleActive}
        onEditProfessional={onEditProfessional}
        onDeleteProfessional={onDeleteProfessional}
      />
    );
  }

  return (
    <HairdressersTable
      professionals={professionals}
      onToggleActive={onToggleActive}
      onEditProfessional={onEditProfessional}
      onDeleteProfessional={onDeleteProfessional}
    />
  );
}
