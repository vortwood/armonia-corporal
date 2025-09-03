"use client";

import { useEffect, useState } from "react";

import {
  getActiveProfessionals,
  getActiveServices,
} from "@/util/dynamicScheduling";
import db from "@/util/firestore";
import { Professional, Service } from "@/util/types";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { AppointmentCards } from "./_components/AppointmentCards";
import { AppointmentFilters } from "./_components/AppointmentFilters";
import { NoResults } from "./_components/NoResults";

// Interfaces para el modal y estadísticas
interface PersonStats {
  name: string;
  count: number;
  appointments: DocumentData[];
  monthlyHistory: Record<string, number>; // Agregar historial mensual
}

interface ModalData {
  isOpen: boolean;
  person: PersonStats | null;
}

export default function AppointmentsPage() {
  const [items, setItems] = useState<DocumentData[]>([]);
  const [reRender, setReRender] = useState(false);
  const [professionalSelected, setProfessionalSelected] = useState<string>("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showTodayOnly, setShowTodayOnly] = useState<boolean>(true);

  // Estados para el modal y estadísticas
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    person: null,
  });

  useEffect(() => {
    const loadProfessionalsAndServices = async () => {
      const [activeProfessionals, activeServices] = await Promise.all([
        getActiveProfessionals(),
        getActiveServices(),
      ]);
      setProfessionals(activeProfessionals);
      setServices(activeServices);
    };

    // Don't set default date range - let it show all future appointments by default
    // Date range will only be applied when user explicitly sets it

    loadProfessionalsAndServices();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let allItems: DocumentData[] = [];

        if (professionalSelected === "" || professionalSelected === "all") {
          // Load appointments based on current filter mode for performance
          let appointmentsQuery;

          if (showTodayOnly) {
            // Only load today's appointments for performance
            console.log("Loading only today's appointments...");
            const todayStart = `${todayUI} - 00:00`;
            const todayEnd = `${todayUI} - 23:59`;

            appointmentsQuery = query(
              collection(db, "appointments"),
              where("hora", ">=", todayStart),
              where("hora", "<=", todayEnd),
            );
          } else if (dateFrom || dateTo) {
            // Load all appointments for date range filtering in memory
            // Firebase string comparison doesn't work correctly for DD/MM/YYYY format across months
            console.log("Loading all appointments for date range filtering:", {
              dateFrom,
              dateTo,
            });

            appointmentsQuery = query(collection(db, "appointments"));
          } else {
            // Default: load next 7 days to avoid performance issues
            console.log("Loading next 7 days of appointments...");
            const todayStart = `${todayUI} - 00:00`;
            const next7Days = new Date();
            next7Days.setDate(next7Days.getDate() + 7);
            const next7DaysEnd = `${next7Days.getDate().toString().padStart(2, "0")}/${(next7Days.getMonth() + 1).toString().padStart(2, "0")}/${next7Days.getFullYear()} - 23:59`;

            appointmentsQuery = query(
              collection(db, "appointments"),
              where("hora", ">=", todayStart),
              where("hora", "<=", next7DaysEnd),
            );
          }

          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          console.log("Documents found:", appointmentsSnapshot.docs.length);

          allItems = appointmentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            // Find professional name by ID
            const professional = professionals.find(
              (h) => h.id === data.professionalId,
            );
            return {
              ...data,
              id: doc.id,
              stylist: professional?.name || data.professionalName || "Unknown",
              collection: "appointments",
            };
          });
        } else {
          // Load appointments for specific professional
          console.log(
            `Loading appointments for professional: ${professionalSelected}`,
          );
          const professionalInfo = professionals.find(
            (h) => h.id === professionalSelected,
          );

          if (professionalInfo) {
            let appointmentsQuery;

            if (showTodayOnly) {
              // Hairdresser + today only
              const todayStart = `${todayUI} - 00:00`;
              const todayEnd = `${todayUI} - 23:59`;
              appointmentsQuery = query(
                collection(db, "appointments"),
                where("professionalId", "==", professionalSelected),
                where("hora", ">=", todayStart),
                where("hora", "<=", todayEnd),
              );
            } else if (dateFrom || dateTo) {
              // Hairdresser + date range - load all appointments for this professional
              // Firebase string comparison doesn't work correctly for DD/MM/YYYY format across months
              console.log(
                "Loading all appointments for professional date range filtering:",
                { professionalSelected, dateFrom, dateTo },
              );

              appointmentsQuery = query(
                collection(db, "appointments"),
                where("professionalId", "==", professionalSelected),
              );
            } else {
              // Hairdresser + next 7 days
              const todayStart = `${todayUI} - 00:00`;
              const next7Days = new Date();
              next7Days.setDate(next7Days.getDate() + 7);
              const next7DaysEnd = `${next7Days.getDate().toString().padStart(2, "0")}/${(next7Days.getMonth() + 1).toString().padStart(2, "0")}/${next7Days.getFullYear()} - 23:59`;
              appointmentsQuery = query(
                collection(db, "appointments"),
                where("professionalId", "==", professionalSelected),
                where("hora", ">=", todayStart),
                where("hora", "<=", next7DaysEnd),
              );
            }

            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            console.log(
              "Found appointments for professional:",
              appointmentsSnapshot.docs.length,
            );

            allItems = appointmentsSnapshot.docs.map((doc) => {
              const data = doc.data();
              console.log("Found filtered appointment:", {
                id: doc.id,
                professionalId: data.professionalId,
                hora: data.hora,
                stylist: professionalInfo.name,
              });
              return {
                ...data,
                id: doc.id,
                stylist: professionalInfo.name,
                collection: "appointments",
              };
            });
          }
        }

        // Clean up incorrectly formatted appointments and filter valid ones
        const validItems = allItems.filter((item) => {
          const timeString = item.hora || item.time;
          if (!timeString || typeof timeString !== "string") {
            console.warn("Filtering out appointment with no time data:", {
              id: item.id,
              hora: item.hora,
              time: item.time,
            });
            return false;
          }

          // Check if it's already in correct format (DD/MM/YYYY - HH:MM)
          if (timeString.includes(" - ")) {
            return true;
          }

          // Check if it's legacy format (just time like "09:00")
          const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (timePattern.test(timeString) && item.createdAt) {
            // Try to reconstruct the date from createdAt
            try {
              const createdDate = new Date(item.createdAt);
              const formattedDate = `${createdDate.getDate().toString().padStart(2, "0")}/${(createdDate.getMonth() + 1).toString().padStart(2, "0")}/${createdDate.getFullYear()}`;
              item.hora = `${formattedDate} - ${timeString}`;
              console.log("Fixed legacy time format:", {
                id: item.id,
                original: timeString,
                fixed: item.hora,
              });
              return true;
            } catch (error) {
              console.warn("Could not fix legacy time format:", {
                id: item.id,
                hora: timeString,
                createdAt: item.createdAt,
                error,
              });
            }
          }

          console.warn("Filtering out appointment with invalid time format:", {
            id: item.id,
            hora: item.hora,
            time: item.time,
          });
          return false;
        });

        const sortedItems = [...validItems].sort((a, b) => {
          try {
            const dateA = convertToDate(a.hora || a.time);
            const dateB = convertToDate(b.hora || b.time);
            return dateA.getTime() - dateB.getTime();
          } catch (error) {
            console.error("Error sorting appointments:", {
              itemA: { id: a.id, hora: a.hora },
              itemB: { id: b.id, hora: b.hora },
              error,
            });
            return 0; // Keep original order if sorting fails
          }
        });

        setItems(sortedItems);
      } catch (e) {
        console.error("Error al obtener los items:", e);
      }
    };

    fetchItems();
  }, [
    reRender,
    professionalSelected,
    professionals,
    dateFrom,
    dateTo,
    showTodayOnly,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const convertToDate = (timeString: string) => {
    if (!timeString || typeof timeString !== "string") {
      throw new Error("Invalid timeString provided");
    }

    const parts = timeString.split(" - ");
    if (parts.length !== 2) {
      throw new Error(
        'Invalid timeString format. Expected "DD/MM/YYYY - HH:MM"',
      );
    }

    const [datePart, timePart] = parts;
    const dateComponents = datePart.split("/").map(Number);
    const timeComponents = timePart.split(":").map(Number);

    if (dateComponents.length !== 3 || timeComponents.length !== 2) {
      throw new Error("Invalid date or time format");
    }

    const [day, month, year] = dateComponents;
    const [hours, minutes] = timeComponents;

    // Validate date components
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      throw new Error("Invalid date values");
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time values");
    }

    return new Date(year, month - 1, day, hours, minutes);
  };

  const groupByDate = (items: DocumentData[]) => {
    return items.reduce((groups: Record<string, DocumentData[]>, item) => {
      const timeString = item.hora || item.time;
      if (!timeString || typeof timeString !== "string") {
        console.warn("Invalid time string for item:", item.id);
        return groups;
      }

      const parts = timeString.split(" - ");
      if (parts.length !== 2) {
        console.warn("Invalid time format for item:", item.id, timeString);
        return groups;
      }

      const datePart = parts[0];
      if (!groups[datePart]) {
        groups[datePart] = [];
      }
      groups[datePart].push(item);
      return groups;
    }, {});
  };

  // Función para generar un color único para cada profesional
  const getHairdresserColor = (professionalName: string) => {
    // Generate consistent colors based on professional name
    const colors = [
      {
        border: "border-l-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        accent: "bg-blue-500",
      },
      {
        border: "border-l-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        accent: "bg-green-500",
      },
      {
        border: "border-l-purple-500",
        bg: "bg-purple-50",
        text: "text-purple-700",
        accent: "bg-purple-500",
      },
      {
        border: "border-l-red-500",
        bg: "bg-red-50",
        text: "text-red-700",
        accent: "bg-red-500",
      },
      {
        border: "border-l-yellow-500",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        accent: "bg-yellow-500",
      },
      {
        border: "border-l-indigo-500",
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        accent: "bg-indigo-500",
      },
    ];

    // Use hash of name to get consistent color
    const hash = professionalName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Función para obtener el historial mensual formateado de una persona
  const getFormattedMonthlyHistory = (
    monthlyHistory: Record<string, number>,
  ) => {
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

    const sortedEntries = Object.entries(monthlyHistory).sort((a, b) => {
      const [yearA, monthA] = a[0].split("-").map(Number);
      const [yearB, monthB] = b[0].split("-").map(Number);

      if (yearA !== yearB) return yearB - yearA; // Año más reciente primero
      return monthB - monthA; // Mes más reciente primero
    });

    return sortedEntries.map(([monthYear, count]) => {
      const [year, month] = monthYear.split("-").map(Number);
      return {
        month: monthNames[month],
        year,
        count,
        monthYear,
      };
    });
  };

  const closeModal = () => {
    setModalData({
      isOpen: false,
      person: null,
    });
  };

  // Handle appointment status changes
  const handleStatusChange = async (
    appointmentId: string,
    collection: string,
    newStatus: string,
  ) => {
    try {
      const appointmentRef = doc(db, collection, appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Trigger re-render to show updated status
      setReRender(!reRender);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Error al actualizar el estado de la cita");
    }
  };

  // Helper function to check if appointment is in the future
  const isAppointmentInFuture = (timeString: string) => {
    try {
      if (!timeString || typeof timeString !== "string") return false;

      const parts = timeString.split(" - ");
      if (parts.length !== 2) return false;

      const [datePart, timePart] = parts;
      if (!datePart || !timePart) return false;

      const dateComponents = datePart.split("/").map(Number);
      const timeComponents = timePart.split(":").map(Number);

      if (dateComponents.length !== 3 || timeComponents.length !== 2)
        return false;

      const [day, month, year] = dateComponents;
      const [hours, minutes] = timeComponents;

      const appointmentDate = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();

      return appointmentDate > now;
    } catch {
      return false;
    }
  };

  // Apply date filtering based on current mode with validation
  let filteredItems = items;

  console.log("Applying filters:", {
    showTodayOnly,
    dateFrom,
    dateTo,
    totalItems: items.length,
  });

  if (showTodayOnly) {
    // Show only today's appointments
    const today = new Date();
    const todayString = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;

    console.log("Filtering for today only:", todayString);

    filteredItems = items.filter((item) => {
      const appointmentTime = item.hora || item.time;
      if (!appointmentTime || typeof appointmentTime !== "string") return false;

      const parts = appointmentTime.split(" - ");
      if (parts.length !== 2) return false;

      const datePart = parts[0];
      const isToday = datePart === todayString;

      if (!isToday) {
        console.log("Filtered out (not today):", {
          id: item.id,
          date: datePart,
          expected: todayString,
        });
      }

      return isToday;
    });
  } else if (dateFrom || dateTo) {
    // Apply date range filter
    console.log("Applying date range filter:", { dateFrom, dateTo });

    filteredItems = items.filter((item) => {
      const appointmentTime = item.hora || item.time;
      if (!appointmentTime || typeof appointmentTime !== "string") {
        console.log("Filtered out (invalid time):", {
          id: item.id,
          hora: appointmentTime,
        });
        return false;
      }

      const parts = appointmentTime.split(" - ");
      if (parts.length !== 2) {
        console.log("Filtered out (invalid format):", {
          id: item.id,
          hora: appointmentTime,
        });
        return false;
      }

      const datePart = parts[0];
      const dateComponents = datePart.split("/").map(Number);
      if (dateComponents.length !== 3) {
        console.log("Filtered out (invalid date components):", {
          id: item.id,
          datePart,
        });
        return false;
      }

      const [day, month, year] = dateComponents;
      if (!day || !month || !year) {
        console.log("Filtered out (invalid date values):", {
          id: item.id,
          day,
          month,
          year,
        });
        return false;
      }

      // Create appointment date at midnight for accurate comparison
      const appointmentDate = new Date(year, month - 1, day);

      let includeItem = true;

      if (dateFrom) {
        const fromDate = new Date(dateFrom + "T00:00:00"); // Parse as local date
        const isAfterFromDate = appointmentDate >= fromDate;
        if (!isAfterFromDate) {
          console.log("Filtered out (before dateFrom):", {
            id: item.id,
            appointmentDate: appointmentDate.toDateString(),
            fromDate: fromDate.toDateString(),
          });
        }
        includeItem = includeItem && isAfterFromDate;
      }

      if (dateTo) {
        const toDate = new Date(dateTo + "T23:59:59"); // Parse as local date, end of day
        const isBeforeToDate = appointmentDate <= toDate;
        if (!isBeforeToDate) {
          console.log("Filtered out (after dateTo):", {
            id: item.id,
            appointmentDate: appointmentDate.toDateString(),
            toDate: toDate.toDateString(),
          });
        }
        includeItem = includeItem && isBeforeToDate;
      }
      return includeItem;
    });
  } else {
    // Show all future appointments (including today) when no specific filter is applied
    console.log("Showing all future appointments (no date filter)");

    const today = new Date();
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    console.log("Today normalized:", normalizedToday.toDateString());

    filteredItems = items.filter((item) => {
      const appointmentTime = item.hora || item.time;
      if (!appointmentTime || typeof appointmentTime !== "string") {
        console.log("Filtered out (invalid time in future filter):", {
          id: item.id,
          hora: appointmentTime,
        });
        return false;
      }

      const parts = appointmentTime.split(" - ");
      if (parts.length !== 2) {
        console.log("Filtered out (invalid format in future filter):", {
          id: item.id,
          hora: appointmentTime,
        });
        return false;
      }

      const datePart = parts[0];
      const dateComponents = datePart.split("/").map(Number);
      if (dateComponents.length !== 3) {
        console.log(
          "Filtered out (invalid date components in future filter):",
          { id: item.id, datePart },
        );
        return false;
      }

      const [day, month, year] = dateComponents;
      const parsedDate = new Date(year, month - 1, day);
      const normalizedDate = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
      );

      const isFuture = normalizedDate >= normalizedToday;

      if (!isFuture) {
        console.log("Filtered out (past appointment):", {
          id: item.id,
          appointmentDate: normalizedDate.toDateString(),
          today: normalizedToday.toDateString(),
        });
      }

      return isFuture;
    });
  }

  console.log("Filtered results:", {
    originalCount: items.length,
    filteredCount: filteredItems.length,
  });

  const groupedItems = groupByDate(filteredItems);

  console.log("Grouped items for display:", {
    groupCount: Object.keys(groupedItems).length,
    groups: Object.keys(groupedItems),
    totalAppointments: Object.values(groupedItems).reduce(
      (sum, group) => sum + group.length,
      0,
    ),
  });

  // Format dates as DD/MM/YYYY for comparison with appointment dates
  const today = new Date();
  const todayUI = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = `${tomorrowDate.getDate().toString().padStart(2, "0")}/${(tomorrowDate.getMonth() + 1).toString().padStart(2, "0")}/${tomorrowDate.getFullYear()}`;

  return (
    <section>
      <AppointmentFilters
        showTodayOnly={showTodayOnly}
        setShowTodayOnly={setShowTodayOnly}
        professionalSelected={professionalSelected}
        setProfessionalSelected={setProfessionalSelected}
        professionals={professionals}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {/* Lista de citas */}
      <div className="space-y-8">
        {/* Modal mejorado */}
        {modalData.isOpen && modalData.person && (
          <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 flex items-center justify-between bg-linear-to-r from-gray-800 to-gray-700 p-6 text-white">
                <div>
                  <h3 className="text-2xl font-bold">
                    {modalData.person.name}
                  </h3>
                  <p className="mt-1 text-gray-200">Historial Mensual</p>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-opacity-20 rounded-full bg-white p-2"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="mb-8 rounded-xl bg-linear-to-r from-blue-50 to-blue-100 p-6 text-center">
                  <p className="text-lg text-gray-700">Reservas este mes</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {modalData.person.count}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-800">
                    Historial por meses
                  </h4>

                  <div className="space-y-3">
                    {getFormattedMonthlyHistory(
                      modalData.person.monthlyHistory,
                    ).map((monthData) => {
                      const colors = getHairdresserColor(
                        modalData.person!.name,
                      );
                      return (
                        <div
                          key={monthData.monthYear}
                          className={`flex items-center justify-between rounded-xl ${colors.bg} border-l-4 ${colors.border} p-4 shadow-sm`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`h-4 w-4 rounded-full ${colors.accent}`}
                            ></div>
                            <span className="text-lg font-medium text-gray-800">
                              {monthData.month} {monthData.year}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`text-2xl font-bold ${colors.text}`}
                            >
                              {monthData.count}
                            </span>
                            <span className="text-sm text-gray-500">
                              {monthData.count === 1 ? "reserva" : "reservas"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {getFormattedMonthlyHistory(modalData.person.monthlyHistory)
                    .length === 0 && (
                    <div className="py-12 text-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-4 text-lg text-gray-500">
                        No hay historial de reservas para mostrar
                      </p>
                    </div>
                  )}

                  {getFormattedMonthlyHistory(modalData.person.monthlyHistory)
                    .length > 0 && (
                    <div className="mt-8 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-green-500 p-2">
                            <svg
                              className="h-5 w-5 text-white"
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
                          <span className="text-lg font-semibold text-gray-800">
                            Total histórico
                          </span>
                        </div>
                        <span className="text-3xl font-bold text-green-600">
                          {getFormattedMonthlyHistory(
                            modalData.person.monthlyHistory,
                          ).reduce((total, month) => total + month.count, 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {Object.entries(groupedItems).length > 0 ? (
          <AppointmentCards
            groupedItems={groupedItems}
            todayUI={todayUI}
            tomorrow={tomorrow}
            services={services}
            getHairdresserColor={getHairdresserColor}
            handleStatusChange={handleStatusChange}
            isAppointmentInFuture={isAppointmentInFuture}
            reRender={reRender}
            setReRender={setReRender}
          />
        ) : (
          <NoResults
            professionalSelected={professionalSelected}
            professionals={professionals}
          />
        )}
      </div>
    </section>
  );
}
