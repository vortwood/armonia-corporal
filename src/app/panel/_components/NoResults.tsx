"use client";

import { Hairdresser } from "@/util/types";

interface NoResultsProps {
  hairdresserSelected: string;
  hairdressers: Hairdresser[];
}

export function NoResults({ hairdresserSelected, hairdressers }: NoResultsProps) {
  return (
    <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
      <svg
        className="mx-auto h-20 w-20 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 className="mt-4 text-2xl font-semibold text-gray-800">
        No hay citas programadas
      </h3>
      <p className="mt-2 text-lg text-gray-500">
        {hairdresserSelected
          ? `No hay citas programadas para ${hairdressers.find((h) => h.id === hairdresserSelected)?.name}`
          : "No hay citas programadas para los próximos días"}
      </p>
    </div>
  );
}