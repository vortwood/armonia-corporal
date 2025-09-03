"use client";

import type { Professional } from "@/util/types";

import { useIsMobile } from "@/hooks/use-mobile";

import HairdressersCard from "./HairdressersCard";
import HairdressersTable from "./HairdressersTable";

interface HairdressersResponsiveContainerProps {
  hairdressers: Professional[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditHairdresser: (hairdresser: Professional) => void;
  onDeleteHairdresser: (hairdresser: Professional) => void;
}

export default function HairdressersResponsiveContainer({
  hairdressers,
  onToggleActive,
  onEditHairdresser,
  onDeleteHairdresser,
}: HairdressersResponsiveContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <HairdressersCard
        professionals={hairdressers}
        onToggleActive={onToggleActive}
        onEditHairdresser={onEditHairdresser}
        onDeleteHairdresser={onDeleteHairdresser}
      />
    );
  }

  return (
    <HairdressersTable
      professionals={hairdressers}
      onToggleActive={onToggleActive}
      onEditHairdresser={onEditHairdresser}
      onDeleteHairdresser={onDeleteHairdresser}
    />
  );
}
