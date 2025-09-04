"use client";

import { Dispatch, SetStateAction } from "react";

import { Service } from "@/util/types";
import { DocumentData } from "firebase/firestore";
import { User2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardComponent } from "@/components/ui/DashboardComponent";
import DeleteItem from "@/components/ui/DeleteButton";
import { Separator } from "@/components/ui/separator";

interface AppointmentCardsProps {
  groupedItems: Record<string, DocumentData[]>;
  todayUI: string;
  tomorrow: string;
  services: Service[];
  getHairdresserColor: (name: string) => {
    border: string;
    bg: string;
    text: string;
    accent: string;
  };
  handleStatusChange: (
    appointmentId: string,
    collection: string,
    newStatus: string,
  ) => void;
  isAppointmentInFuture: (timeString: string) => boolean;
  reRender: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export function AppointmentCards({
  groupedItems,
  todayUI,
  tomorrow,
  services,
  getHairdresserColor,
  handleStatusChange,
  isAppointmentInFuture,
  reRender,
  setReRender,
}: AppointmentCardsProps) {
  // Hardcoded service mapping for common services used in the app
  const serviceNameMapping: Record<string, string> = {
    Corte: "Corte de cabello",
    Barba: "Arreglo de barba",
    Cejas: "Depilado de cejas",
    Mechas: "Mechas",
    Color: "Coloración",
    Membresía: "Membresía",
  };

  const formatServices = (item: DocumentData) => {
    if (Array.isArray(item.tipos)) {
      return item.tipos
        .map((serviceId) => {
          // First try to find in services array from database
          const service = services.find(
            (s) => s.id === serviceId || s.name === serviceId,
          );
          if (service) {
            return service.name;
          }

          // Fallback to hardcoded mapping
          if (serviceNameMapping[serviceId]) {
            return serviceNameMapping[serviceId];
          }

          // If it's already a readable name, return as-is
          if (typeof serviceId === "string" && serviceId.length > 2) {
            return serviceId;
          }

          return "Servicio no especificado";
        })
        .join(", ");
    }

    // Para servicios individuales, también buscar en el array de services
    const serviceId = item.tipo || item.serviceType;
    if (serviceId) {
      // First try to find in services array from database
      const service = services.find(
        (s) => s.id === serviceId || s.name === serviceId,
      );
      if (service) {
        return service.name;
      }

      // Fallback to hardcoded mapping
      if (serviceNameMapping[serviceId]) {
        return serviceNameMapping[serviceId];
      }

      // If it's already a readable name, return as-is
      if (typeof serviceId === "string" && serviceId.length > 2) {
        return serviceId;
      }

      return serviceId;
    }

    return "No especificado";
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date}>
          {date !== todayUI && <Separator className="my-4 bg-black" />}

          <div>
            <div className="sticky top-0 z-10 mb-4">
              <h3 className="mt-4 text-xl font-bold text-neutral-900 sm:text-2xl">
                {date === todayUI
                  ? "Hoy"
                  : date === tomorrow
                    ? "Mañana"
                    : `${date}`}
              </h3>
              <p className="mt-1 text-neutral-600">
                {items.length}{" "}
                {items.length === 1 ? "cita programada" : "citas programadas"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const colors = getHairdresserColor(
                  item.stylist || item.persona,
                );
                return (
                  <div
                    key={item.id}
                    className={`group overflow-hidden rounded-xl border border-l-4 border-gray-200 ${colors.border} bg-white p-4 shadow-lg`}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <div className={`rounded-full ${colors.accent} p-2`}>
                        <User2Icon className="h-4 w-4 text-white" />
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 font-medium ${colors.text}`}
                      >
                        {item.stylist || item.persona}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <DashboardComponent text={item.name} title="Nombre" />
                      <DashboardComponent text={item.phone} title="Teléfono" />
                      <DashboardComponent
                        text={item.mail || item.email}
                        title="Email"
                      />
                      <DashboardComponent
                        text={formatServices(item)}
                        title="Servicios"
                      />
                      <DashboardComponent
                        text={item.hora || "No especificado"}
                        title="Hora"
                      />

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Estado:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : item.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : item.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status === "confirmed"
                              ? "Confirmada"
                              : item.status === "cancelled"
                                ? "Cancelada"
                                : item.status === "completed"
                                  ? "Completada"
                                  : "Pendiente"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <DeleteItem
                        id={item.id}
                        reRender={reRender}
                        setReRender={setReRender}
                        collection={item.collection}
                        status={item.status}
                        appointmentInfo={{
                          name: item.name,
                          time: item.hora || "No especificado",
                          stylist: item.stylist || "No asignado",
                        }}
                      />

                      {item.status !== "completed" &&
                        item.status !== "cancelled" &&
                        item.hora &&
                        !isAppointmentInFuture(item.hora) && (
                          <Button
                            onClick={() =>
                              handleStatusChange(
                                item.id,
                                item.collection,
                                "completed",
                              )
                            }
                            className="bg-blue-100 text-xs text-blue-600 hover:text-blue-800"
                          >
                            Marcar completada
                          </Button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
