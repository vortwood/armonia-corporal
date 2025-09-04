"use client";

import { useEffect, useState } from "react";

import db from "@/util/firestore";
import type { Professional, Service } from "@/util/types";
import { collection, getDocs } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface AppointmentData {
  id: string;
  name: string;
  phone: string;
  mail: string;
  hora: string;
  tipos: string[];
  professionalId: string;
  stylist: string;
  collection: string;
}

interface ProfessionalMetrics {
  id: string;
  name: string;
  totalAppointments: number;
  thisMonthAppointments: number;
  popularServices: { service: string; count: number }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [metrics, setMetrics] = useState<ProfessionalMetrics[]>([]);

  // Cargar todos los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Profesionales
        const professionalsSnapshot = await getDocs(
          collection(db, "professionals"),
        );
        const professionalsData = professionalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Professional[];

        // Cargar servicios
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];

        // Load appointments from unified collection only
        let allAppointments: AppointmentData[] = [];

        try {
          const appointmentsSnapshot = await getDocs(
            collection(db, "appointments"),
          );
          allAppointments = appointmentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            // Find professional name by ID
            const professional = professionalsData.find(
              (p) => p.id === data.professionalId,
            );
            return {
              id: doc.id,
              ...data,
              stylist: professional?.name || "Unknown",
              collection: "appointments",
            };
          }) as AppointmentData[];
        } catch (error) {
          console.error("Error loading appointments:", error);
        }

        setProfessionals(professionalsData);
        setServices(servicesData);
        setAppointments(allAppointments);

        // Calcular métricas
        calculateMetrics(allAppointments, professionalsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular métricas por profesional
  const calculateMetrics = (
    appointmentsData: AppointmentData[],
    professionalsData: Professional[],
  ) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const stylistMetrics: Record<string, ProfessionalMetrics> = {};

    // Inicializar métricas para Profesionales registrados
    professionalsData.forEach((p) => {
      stylistMetrics[p.name] = {
        id: p.id,
        name: p.name,
        totalAppointments: 0,
        thisMonthAppointments: 0,
        popularServices: [],
      };
    });

    // Initialize metrics for all active professionals
    professionalsData.forEach((p) => {
      if (!stylistMetrics[p.name]) {
        stylistMetrics[p.name] = {
          id: p.id,
          name: p.name,
          totalAppointments: 0,
          thisMonthAppointments: 0,
          popularServices: [],
        };
      }
    });

    const serviceCount: Record<string, Record<string, number>> = {};

    appointmentsData.forEach((appointment) => {
      const stylistName = appointment.stylist;
      if (!stylistName) return;

      if (!stylistMetrics[stylistName]) {
        stylistMetrics[stylistName] = {
          id: stylistName,
          name: stylistName,
          totalAppointments: 0,
          thisMonthAppointments: 0,
          popularServices: [],
        };
      }

      // Contar cita total
      stylistMetrics[stylistName].totalAppointments++;

      // Verificar si es del mes actual
      try {
        const [datePart] = appointment.hora.split(" - ");
        const [day, month, year] = datePart.split("/").map(Number);
        const appointmentDate = new Date(year, month - 1, day);

        if (
          appointmentDate.getMonth() === currentMonth &&
          appointmentDate.getFullYear() === currentYear
        ) {
          stylistMetrics[stylistName].thisMonthAppointments++;
        }
      } catch {
        console.error("Error parsing date:", appointment.hora);
      }

      // Contar servicios
      if (!serviceCount[stylistName]) {
        serviceCount[stylistName] = {};
      }

      if (Array.isArray(appointment.tipos)) {
        appointment.tipos.forEach((service) => {
          serviceCount[stylistName][service] =
            (serviceCount[stylistName][service] || 0) + 1;
        });
      }
    });

    // Calcular servicios populares por profesional
    Object.keys(stylistMetrics).forEach((stylistName) => {
      if (serviceCount[stylistName]) {
        const services = Object.entries(serviceCount[stylistName])
          .map(([service, count]) => ({ service, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        stylistMetrics[stylistName].popularServices = services;
      }
    });

    setMetrics(Object.values(stylistMetrics));
  };

  // Obtener estadísticas generales
  const totalAppointments = appointments.length;
  const thisMonthAppointments = appointments.filter((appointment) => {
    try {
      const currentDate = new Date();
      const [datePart] = appointment.hora.split(" - ");
      const [day, month, year] = datePart.split("/").map(Number);
      const appointmentDate = new Date(year, month - 1, day);

      return (
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear()
      );
    } catch {
      return false;
    }
  }).length;

  const activeProfessionals = professionals.filter((p) => p.isActive).length;
  const activeServices = services.filter((s) => s.isActive).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">
          Estadísticas del Negocio
        </h2>
        <p className="text-neutral-600">
          Resumen del rendimiento y métricas clave
        </p>
      </div>

      <Separator className="my-4 bg-black" />

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Citas</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalAppointments}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
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
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Este Mes</p>
              <p className="text-3xl font-bold text-green-600">
                {thisMonthAppointments}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profesionales Activos</p>
              <p className="text-3xl font-bold text-purple-600">
                {activeProfessionals}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Servicios Activos</p>
              <p className="text-3xl font-bold text-orange-600">
                {activeServices}
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <Separator className="my-4 bg-black" />

      {/* Métricas por profesional */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-900">
          Rendimiento por profesional
        </h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {metrics
            .filter((m) => m.totalAppointments > 0)
            .sort((a, b) => b.thisMonthAppointments - a.thisMonthAppointments)
            .map((metric) => (
              <Card key={metric.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      {metric.name}
                    </h4>
                    <Badge variant="outline">
                      {metric.thisMonthAppointments} este mes
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Citas totales</span>
                      <span className="font-medium">
                        {metric.totalAppointments}
                      </span>
                    </div>
                    <Progress
                      value={
                        (metric.thisMonthAppointments /
                          Math.max(metric.totalAppointments, 1)) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  {metric.popularServices.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-900">
                        Servicios populares
                      </p>
                      <div className="space-y-1">
                        {metric.popularServices.map((service, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {services.find(
                                (s) =>
                                  s.id === service.service ||
                                  s.name === service.service,
                              )?.name || "No especificado"}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {service.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>

        {metrics.filter((m) => m.totalAppointments > 0).length === 0 && (
          <Card className="p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No hay datos suficientes
            </h3>
            <p className="mt-2 text-gray-500">
              Una vez que tengas algunas citas programadas, verás las
              estadísticas aquí.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
