"use client";

import { useState } from "react";

import type { Professional } from "@/util/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  currentMonth?: Date;
  onMonthChange?: (month: Date) => void;
  selectedProfessional: Professional | null;
}

export default function DateSelect({
  selectedDate,
  onSelect,
  currentMonth: externalCurrentMonth,
  onMonthChange,
  selectedProfessional,
}: DateSelectProps) {
  const [internalCurrentMonth, setInternalCurrentMonth] = useState(new Date());

  // Use external currentMonth if provided, otherwise use internal state
  const currentMonth = externalCurrentMonth || internalCurrentMonth;
  const setCurrentMonth = onMonthChange || setInternalCurrentMonth;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Lunes = 0
  };

  // Helper function to convert date to day name (matches dynamicScheduling.ts logic)
  const getDayOfWeek = (date: Date): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // No fechas pasadas
    if (checkDate < today) {
      return false;
    }

    // Si no hay profesional seleccionado, usar lógica original (no domingos)
    if (!selectedProfessional) {
      return date.getDay() !== 0; // No domingos
    }

    // Si hay profesional seleccionado, verificar días de trabajo
    const dayOfWeek = getDayOfWeek(date);

    // Check if this day is a working day in the new schedule format
    if (selectedProfessional.schedule.weeklySchedule) {
      const daySchedule = selectedProfessional.schedule.weeklySchedule.find(
        (day) => day.dayOfWeek === dayOfWeek,
      );
      return daySchedule?.isWorkingDay || false;
    }

    // Legacy fallback (should not happen with new data structure)
    return false;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const isAvailable = isDateAvailable(date);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => isAvailable && onSelect(date)}
          disabled={!isAvailable}
          className={`h-12 w-full rounded-lg text-sm font-medium transition-all ${
            isSelected
              ? "bg-black text-white"
              : isAvailable
                ? "cursor-pointer bg-neutral-400 text-white hover:bg-neutral-700"
                : "cursor-not-allowed bg-neutral-400 text-neutral-600 opacity-50"
          }`}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            )
          }
          className="cursor-pointer rounded-lg bg-neutral-400 p-2 text-white hover:bg-neutral-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
            )
          }
          className="cursor-pointer rounded-lg bg-neutral-400 p-2 text-white hover:bg-neutral-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="mb-2 grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-neutral-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

      {selectedDate && (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-500/20 p-3">
          <p className="font-medium text-neutral-700">Fecha seleccionada:</p>
          <p className="text-neutral-500 capitalize">
            {formatDate(selectedDate)}
          </p>
        </div>
      )}
    </div>
  );
}
