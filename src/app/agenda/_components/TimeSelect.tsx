import { useCallback, useEffect, useState } from "react";

import { getAvailableTimeSlots } from "@/util/dynamicScheduling";
import type { Professional, TimeSlot } from "@/util/types";

import { Card, CardContent } from "@/components/ui/Card";

// Extended interface to include if the time has passed
interface ExtendedTimeSlot extends TimeSlot {
  hasPassed?: boolean;
}

interface TimeSelectProps {
  selectedTime: string;
  onSelect: (time: string) => void;
  selectedProfessional: Professional | null;
  selectedDate: Date | null;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
}

export default function TimeSelect({
  selectedTime,
  onSelect,
  selectedProfessional,
  selectedDate,
  onError,
  onLoading,
}: TimeSelectProps) {
  const [timeSlots, setTimeSlots] = useState<ExtendedTimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check if a time has passed for today
  const hasTimePassed = useCallback(
    (timeString: string, date: Date): boolean => {
      const today = new Date();
      const selectedDateString = date.toDateString();
      const todayString = today.toDateString();

      // If the selected date is not today, time hasn't passed
      if (selectedDateString !== todayString) {
        return false;
      }

      // Parse the time string (format: "HH:MM")
      const [hours, minutes] = timeString.split(":").map(Number);
      const timeToCheck = new Date();
      timeToCheck.setHours(hours, minutes, 0, 0);

      // Add 15-minute buffer to prevent last-minute bookings
      const currentTimeWithBuffer = new Date(today.getTime() + 15 * 60 * 1000);

      // Compare with current time plus buffer
      return timeToCheck <= currentTimeWithBuffer;
    },
    [],
  );

  // Fetch available time slots when date or professionals changes
  const fetchTimeSlots = useCallback(async () => {
    if (!selectedProfessional || !selectedDate) {
      setTimeSlots([]);
      return;
    }

    setLoading(true);
    setError(null);
    onLoading?.(true);

    try {
      const availableSlots = await getAvailableTimeSlots(
        selectedProfessional.id,
        selectedDate,
      );

      // Add hasPassed flag to each slot
      const slotsWithStatus = availableSlots.map((slot) => ({
        ...slot,
        hasPassed: hasTimePassed(slot.time, selectedDate),
        available: slot.available && !hasTimePassed(slot.time, selectedDate),
      }));

      setTimeSlots(slotsWithStatus);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      const errorMessage = "Error al cargar los horarios disponibles";
      setError(errorMessage);
      onError?.(errorMessage);
      setTimeSlots([]);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [selectedProfessional, selectedDate, hasTimePassed, onError, onLoading]);

  // Fetch time slots when dependencies change
  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Get card styling based on availability and time status
  const getCardClassName = (slot: ExtendedTimeSlot) => {
    const baseClasses = "cursor-pointer transition-all border-2";

    if (selectedTime === slot.time) {
      return `${baseClasses} border-white bg-neutral-100/20`;
    }

    if (slot.hasPassed) {
      return `${baseClasses} cursor-not-allowed border-neutral-600 bg-neutral-700 opacity-50`;
    }

    if (slot.available) {
      return `${baseClasses} border-neutral-700 bg-neutral-800 hover:border-neutral-600`;
    }

    // Already booked
    return `${baseClasses} cursor-not-allowed border-neutral-700 bg-neutral-900/20 opacity-60`;
  };

  // Get text styling based on availability and time status
  const getTextClassName = (slot: ExtendedTimeSlot) => {
    if (slot.hasPassed) {
      return "font-medium text-neutral-500";
    }

    if (!slot.available) {
      return "font-medium text-neutral-400";
    }

    return "font-medium text-white";
  };

  // Handle time selection
  const handleTimeSelect = (slot: ExtendedTimeSlot) => {
    if (!slot.available || slot.hasPassed) return;
    onSelect(slot.time);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchTimeSlots}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (timeSlots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="font-medium text-gray-600">
            No hay horarios disponibles para esta fecha
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Selecciona otra fecha o contacta al establecimiento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {timeSlots.map((slot, index) => (
          <Card
            key={index}
            className={getCardClassName(slot)}
            onClick={() => handleTimeSelect(slot)}
            title={
              slot.hasPassed
                ? "Hora ya pasada"
                : !slot.available
                  ? "Horario ocupado"
                  : "Horario disponible"
            }
          >
            <CardContent className="p-3 text-center">
              <p className={getTextClassName(slot)}>{slot.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
