"use client";

import type { Hairdresser } from "@/util/types";

import { useIsMobile } from "@/hooks/use-mobile";

import HairdressersCard from "./HairdressersCard";
import HairdressersTable from "./HairdressersTable";

interface HairdressersResponsiveContainerProps {
  hairdressers: Hairdresser[];
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onEditHairdresser: (hairdresser: Hairdresser) => void;
}

export default function HairdressersResponsiveContainer({
  hairdressers,
  onToggleActive,
  onEditHairdresser,
}: HairdressersResponsiveContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <HairdressersCard
        hairdressers={hairdressers}
        onToggleActive={onToggleActive}
        onEditHairdresser={onEditHairdresser}
      />
    );
  }

  return (
    <HairdressersTable
      hairdressers={hairdressers}
      onToggleActive={onToggleActive}
      onEditHairdresser={onEditHairdresser}
    />
  );
}
