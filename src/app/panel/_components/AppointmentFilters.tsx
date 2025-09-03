"use client";

import { useEffect, useState } from "react";

import { Professional } from "@/util/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface AppointmentFiltersProps {
  showTodayOnly: boolean;
  setShowTodayOnly: (show: boolean) => void;
  professionalSelected: string;
  setProfessionalSelected: (id: string) => void;
  professionals: Professional[];
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

export function AppointmentFilters({
  showTodayOnly,
  setShowTodayOnly,
  professionalSelected,
  setProfessionalSelected,
  professionals,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: AppointmentFiltersProps) {
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dateFrom ? new Date(dateFrom + "T00:00:00") : undefined,
    to: dateTo ? new Date(dateTo + "T00:00:00") : undefined,
  });

  useEffect(() => {
    const newRange = {
      from: dateFrom ? new Date(dateFrom + "T00:00:00") : undefined,
      to: dateTo ? new Date(dateTo + "T00:00:00") : undefined,
    };
    setDateRange(newRange);
    setUseCustomRange(!!(dateFrom || dateTo));
  }, [dateFrom, dateTo]);
  return (
    <section>
      <div className="text-start">
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Gestión de Citas
        </h2>
        <p className="mt-2 text-neutral-600">
          {showTodayOnly
            ? "Mostrando citas de hoy"
            : dateFrom || dateTo
              ? `Mostrando citas ${dateFrom ? `desde ${dateFrom}` : ""} ${dateTo ? `hasta ${dateTo}` : ""}`
              : "Mostrando próximos 7 días"}
        </p>
      </div>

      <Separator className="my-4 bg-black" />

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Today Only Toggle */}

        <div className="flex gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Vista rápida
            </label>
            <button
              onClick={() => {
                const newShowTodayOnly = !showTodayOnly;
                setShowTodayOnly(newShowTodayOnly);
                if (newShowTodayOnly) {
                  setDateFrom("");
                  setDateTo("");
                  setProfessionalSelected("");
                } else {
                  setDateFrom("");
                  setDateTo("");
                  setProfessionalSelected("");
                }
              }}
              className={`flex w-fit cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                showTodayOnly
                  ? "bg-black text-white"
                  : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              Hoy
            </button>
          </div>

          {/* Professional Filter */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                showTodayOnly ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Filtrar por profesional
            </label>
            <Select
              value={showTodayOnly ? "all" : professionalSelected}
              onValueChange={(value) => setProfessionalSelected(value)}
              disabled={showTodayOnly}
            >
              <SelectTrigger
                className={`w-full cursor-pointer rounded-lg border-2 px-4 py-5 text-sm transition-all duration-200 ${
                  showTodayOnly
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
                }`}
              >
                {showTodayOnly
                  ? "No disponible en vista diaria"
                  : "Todos los profesionales"}
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos los profesionales</SelectItem>
                {!showTodayOnly &&
                  professionals.map((professional) => (
                    <SelectItem
                      key={professional.id}
                      value={professional.id}
                      className="cursor-pointer"
                    >
                      {professional.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              showTodayOnly ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Período
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={showTodayOnly}
                className={`flex h-auto w-full items-center justify-start gap-2 rounded-lg border-2 px-4 py-2.5 text-sm transition-all duration-200 ${
                  showTodayOnly
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
                }`}
                onClick={() => {
                  setShowTodayOnly(false);
                  setUseCustomRange(true);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                {!showTodayOnly &&
                useCustomRange &&
                dateRange?.from &&
                dateRange?.to
                  ? `${format(dateRange.from, "dd/MM", { locale: es })} - ${format(dateRange.to, "dd/MM", { locale: es })}`
                  : !showTodayOnly && useCustomRange && dateRange?.from
                    ? format(dateRange.from, "dd/MM/yyyy", { locale: es })
                    : showTodayOnly
                      ? "No disponible en vista diaria"
                      : "Seleccionar período"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range || { from: undefined, to: undefined });
                  setShowTodayOnly(false);
                  setUseCustomRange(true);
                  if (range?.from) {
                    setDateFrom(format(range.from, "yyyy-MM-dd"));
                  } else {
                    setDateFrom("");
                  }
                  if (range?.to) {
                    setDateTo(format(range.to, "yyyy-MM-dd"));
                  } else {
                    setDateTo("");
                  }
                }}
                defaultMonth={dateRange?.from || new Date()}
                numberOfMonths={1}
                classNames={{
                  range_start: "bg-black text-white rounded-l-md",
                  range_end: "bg-black text-white rounded-r-md",
                  range_middle: "bg-neutral-200 text-black rounded-none",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
}
