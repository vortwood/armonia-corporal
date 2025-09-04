"use client";

import { useEffect } from "react";

import { createDefaultWeeklySchedule } from "@/util/dynamicScheduling";
import db from "@/util/firestore";
import type { DaySchedule, Professional, Service } from "@/util/types";
import { addDoc, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  name: string;
  email: string;
  phone: string;
  photo: string;
  services: string[];
  schedule: {
    weeklySchedule: DaySchedule[];
    defaultSlotInterval: number;
  };
}

interface HairdressersCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  formLoading: boolean;
  setFormLoading: (loading: boolean) => void;
  services: Service[];
  resetForm: () => void;
  setProfessionals: (updater: (prev: Professional[]) => Professional[]) => void;
}

export default function HairdressersCreateModal({
  open,
  onOpenChange,
  formData,
  setFormData,
  formLoading,
  setFormLoading,
  services,
  resetForm,
  setProfessionals,
}: HairdressersCreateModalProps) {
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        photo: "",
        services: [],
        schedule: {
          weeklySchedule: createDefaultWeeklySchedule(),
          defaultSlotInterval: 30,
        },
      });
    }
  }, [open, setFormData]);

  // Handler to toggle working day
  const handleWorkingDayToggle = (dayOfWeek: DaySchedule["dayOfWeek"]) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        weeklySchedule: prev.schedule.weeklySchedule.map((day) =>
          day.dayOfWeek === dayOfWeek
            ? { ...day, isWorkingDay: !day.isWorkingDay }
            : day,
        ),
      },
    }));
  };

  // Handler to add a new working period for a specific day
  const handleAddWorkingPeriod = (dayOfWeek: DaySchedule["dayOfWeek"]) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        weeklySchedule: prev.schedule.weeklySchedule.map((day) =>
          day.dayOfWeek === dayOfWeek
            ? {
                ...day,
                workingPeriods: [
                  ...day.workingPeriods,
                  { startTime: "", endTime: "" },
                ],
              }
            : day,
        ),
      },
    }));
  };

  // Handler to remove a working period for a specific day
  const handleRemoveWorkingPeriod = (
    dayOfWeek: DaySchedule["dayOfWeek"],
    periodIndex: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        weeklySchedule: prev.schedule.weeklySchedule.map((day) =>
          day.dayOfWeek === dayOfWeek
            ? {
                ...day,
                workingPeriods: day.workingPeriods.filter(
                  (_, i) => i !== periodIndex,
                ),
              }
            : day,
        ),
      },
    }));
  };

  // Handler to update a working period for a specific day
  const handleWorkingPeriodChange = (
    dayOfWeek: DaySchedule["dayOfWeek"],
    periodIndex: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        weeklySchedule: prev.schedule.weeklySchedule.map((day) =>
          day.dayOfWeek === dayOfWeek
            ? {
                ...day,
                workingPeriods: day.workingPeriods.map((period, i) =>
                  i === periodIndex ? { ...period, [field]: value } : period,
                ),
              }
            : day,
        ),
      },
    }));
  };

  const handleCreateProfessional = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    // Validate that at least one day has working periods
    const hasValidSchedule = formData.schedule.weeklySchedule.some(
      (day) =>
        day.isWorkingDay &&
        day.workingPeriods.some((period) => period.startTime && period.endTime),
    );

    if (!hasValidSchedule) {
      alert(
        "Por favor configura al menos un día de trabajo con horarios válidos",
      );
      return;
    }

    setFormLoading(true);

    try {
      // Clean up schedule data - only save working days with valid periods
      const cleanedWeeklySchedule = formData.schedule.weeklySchedule.map(
        (day) => ({
          ...day,
          workingPeriods: day.isWorkingDay
            ? day.workingPeriods.filter(
                (period) => period.startTime && period.endTime,
              )
            : [],
        }),
      );

      const newProfessional = {
        ...formData,
        schedule: {
          weeklySchedule: cleanedWeeklySchedule,
          defaultSlotInterval: formData.schedule.defaultSlotInterval,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Creando profesional con datos:", newProfessional);

      const docRef = await addDoc(
        collection(db, "professionals"),
        newProfessional,
      );

      console.log("Profesional creado con ID:", docRef.id);

      // Actualizar la lista local inmediatamente
      setProfessionals((prev) => [
        ...prev,
        { ...newProfessional, id: docRef.id },
      ]);
      
      onOpenChange(false);
      resetForm();
      
      alert("Profesional creado exitosamente!");
      
    } catch (error) {
      console.error("Error completo creando profesional:", error);
      alert(`Error al crear el profesional: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" variant="outline">
          Agregar Profesional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-white">
        <DialogHeader className="text-left">
          <DialogTitle>Crear Nuevo Profesional</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo miembro del equipo
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="juan@ejemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="099 123 456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">URL de Foto</Label>
              <Input
                id="photo"
                value={formData.photo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, photo: e.target.value }))
                }
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Servicios que ofrece</Label>
            {services.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-amber-600 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-amber-800 font-medium mb-1">No hay servicios disponibles</h4>
                <p className="text-amber-700 text-sm">
                  Primero crea algunos servicios desde la sección de Servicios para poder asignarlos a este profesional.
                </p>
              </div>
            ) : (
              <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <Label htmlFor={service.id} className="text-sm">
                      {service.name} ${service.promoPrice || service.price}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Horarios de trabajo por día</Label>

            {[
              { key: "monday", label: "Lunes" },
              { key: "tuesday", label: "Martes" },
              { key: "wednesday", label: "Miércoles" },
              { key: "thursday", label: "Jueves" },
              { key: "friday", label: "Viernes" },
              { key: "saturday", label: "Sábado" },
              { key: "sunday", label: "Domingo" },
            ].map((dayInfo) => {
              const daySchedule = formData.schedule.weeklySchedule.find(
                (d) => d.dayOfWeek === dayInfo.key,
              );
              if (!daySchedule) return null;

              return (
                <div
                  key={dayInfo.key}
                  className="space-y-3 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{dayInfo.label}</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`working-${dayInfo.key}`}
                        checked={daySchedule.isWorkingDay}
                        onCheckedChange={() =>
                          handleWorkingDayToggle(
                            dayInfo.key as DaySchedule["dayOfWeek"],
                          )
                        }
                      />
                      <Label
                        htmlFor={`working-${dayInfo.key}`}
                        className="text-sm"
                      >
                        Trabaja
                      </Label>
                    </div>
                  </div>

                  {daySchedule.isWorkingDay && (
                    <div className="space-y-2">
                      {daySchedule.workingPeriods.map((period, periodIndex) => (
                        <div
                          key={periodIndex}
                          className="flex items-center gap-2 rounded bg-gray-50 p-2"
                        >
                          <div className="grid flex-1 grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Desde</Label>
                              <Input
                                type="time"
                                value={period.startTime}
                                onChange={(e) =>
                                  handleWorkingPeriodChange(
                                    dayInfo.key as DaySchedule["dayOfWeek"],
                                    periodIndex,
                                    "startTime",
                                    e.target.value,
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Hasta</Label>
                              <Input
                                type="time"
                                value={period.endTime}
                                onChange={(e) =>
                                  handleWorkingPeriodChange(
                                    dayInfo.key as DaySchedule["dayOfWeek"],
                                    periodIndex,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>

                          {daySchedule.workingPeriods.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRemoveWorkingPeriod(
                                  dayInfo.key as DaySchedule["dayOfWeek"],
                                  periodIndex,
                                )
                              }
                              className="px-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAddWorkingPeriod(
                            dayInfo.key as DaySchedule["dayOfWeek"],
                          )
                        }
                        className="w-full text-xs"
                      >
                        + Agregar horario para {dayInfo.label}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            <p className="text-xs text-gray-500">
              Configura horarios específicos para cada día. Ejemplo: Lunes
              08:00-12:00 y 14:00-18:00
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCreateProfessional}
            disabled={
              formLoading ||
              !formData.name ||
              !formData.email ||
              (services.length > 0 && formData.services.length === 0)
            }
          >
            {formLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creando...
              </>
            ) : (
              "Crear Profesional"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
