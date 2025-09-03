"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getHairdresserServices,
  validateAppointment,
} from "@/util/dynamicScheduling";
import type { Hairdresser, Service } from "@/util/types";
import { ArrowLeft, Calendar, CheckCircle, Clock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
// Import dialog for success/error modals
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ConfirmationSummary from "./_components/ConfirmationSummary";
import DateSelect from "./_components/DateSelect";
import { PersonalDataForm } from "./_components/PersonalDataForm";
// Import step components
import { ProfessionalSelect } from "./_components/ProfessionalSelect";
import TimeSelect from "./_components/TimeSelect";

type Step = "professional" | "date" | "time" | "personal" | "confirmation";

interface BookingData {
  professional: Hairdresser | null;
  date: Date | null;
  time: string;
  personalData: {
    name: string;
    phone: string;
    email: string;
  };
  selectedServices: string[];
}

interface ValidationState {
  validName: boolean;
  validPhone: boolean;
  validEmail: boolean;
}

export default function AgendaPage() {
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>("professional");

  // Booking data state
  const [bookingData, setBookingData] = useState<BookingData>({
    professional: null,
    date: null,
    time: "",
    personalData: { name: "", phone: "", email: "" },
    selectedServices: [],
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Services state
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Validation state
  const [personalDataValidation, setPersonalDataValidation] =
    useState<ValidationState>({
      validName: false,
      validPhone: false,
      validEmail: false,
    });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load services when professional is selected
  useEffect(() => {
    const loadServices = async () => {
      if (!bookingData.professional) {
        setAvailableServices([]);
        return;
      }

      setServicesLoading(true);
      try {
        const services = await getHairdresserServices(
          bookingData.professional.id,
        );
        setAvailableServices(services);
      } catch (error) {
        console.error("Error loading services:", error);
        setAvailableServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, [bookingData.professional]);

  // Step navigation
  const nextStep = () => {
    const steps: Step[] = [
      "professional",
      "date",
      "time",
      "personal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = [
      "professional",
      "date",
      "time",
      "personal",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "professional":
        return "Elegí tu Peluquero";
      case "date":
        return "Elegí el Día";
      case "time":
        return "Elegí la Hora";
      case "personal":
        return "Tus Datos";
      case "confirmation":
        return "¡Listo!";
    }
  };

  const getStepNumber = () => {
    const steps: Step[] = [
      "professional",
      "date",
      "time",
      "personal",
      "confirmation",
    ];
    return steps.indexOf(currentStep) + 1;
  };

  // Handle professional selection
  const handleProfessionalSelect = (professional: Hairdresser) => {
    // Reset subsequent selections when changing professional
    setBookingData((prev) => ({
      ...prev,
      professional,
      date: null,
      time: "",
      selectedServices: [],
    }));
    setCurrentMonth(new Date()); // Reset calendar
  };

  // Reset selections when professional changes
  const handleSelectionReset = () => {
    setBookingData((prev) => ({
      ...prev,
      date: null,
      time: "",
      selectedServices: [],
    }));
    setCurrentMonth(new Date());
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setBookingData((prev) => ({
      ...prev,
      date,
      time: "", // Reset time when date changes
    }));
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setBookingData((prev) => ({
      ...prev,
      time,
    }));
  };

  // Handle personal data changes
  const handlePersonalDataChange = (
    personalData: typeof bookingData.personalData,
  ) => {
    setBookingData((prev) => ({
      ...prev,
      personalData,
    }));
  };

  // Handle service selection
  const handleServiceToggle = (serviceId: string) => {
    setBookingData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return availableServices
      .filter((service) => bookingData.selectedServices.includes(service.id))
      .reduce((total, service) => {
        const price =
          service.promoPrice && service.promoPrice < (service.price || 0)
            ? service.promoPrice
            : service.price || 0;
        return total + price;
      }, 0);
  };

  // Check if step can proceed
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case "professional":
        return !!bookingData.professional;
      case "date":
        return !!bookingData.date;
      case "time":
        return !!bookingData.time;
      case "personal":
        return (
          personalDataValidation.validName &&
          personalDataValidation.validPhone &&
          personalDataValidation.validEmail &&
          bookingData.selectedServices.length > 0
        );
      default:
        return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!canProceedToNextStep() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Final validation before submission
      if (!bookingData.date || !bookingData.time || !bookingData.professional) {
        setErrorMessage("⚠️ Datos de reserva incompletos");
        setShowErrorModal(true);
        return;
      }

      // Check availability one more time before submitting
      const validation = await validateAppointment(
        bookingData.professional.id,
        bookingData.date,
        bookingData.time,
        bookingData.selectedServices,
      );

      if (!validation.valid) {
        let userFriendlyError = validation.error || "Error de validación";

        // Make error messages more user-friendly
        if (
          userFriendlyError.includes("ocupado") ||
          userFriendlyError.includes("already")
        ) {
          userFriendlyError =
            "⏰ Lo sentimos, este horario ya fue reservado por otro cliente. Por favor, selecciona otro horario disponible.";
        } else if (
          userFriendlyError.includes("trabajo") ||
          userFriendlyError.includes("work")
        ) {
          userFriendlyError =
            "❌ El peluquero no trabaja en este horario. Por favor, selecciona un horario durante el horario de trabajo.";
        } else if (
          userFriendlyError.includes("pasadas") ||
          userFriendlyError.includes("past")
        ) {
          userFriendlyError =
            "📅 No se pueden agendar citas en fechas pasadas. Por favor, selecciona una fecha futura.";
        }

        setErrorMessage(userFriendlyError);
        setShowErrorModal(true);
        return;
      }

      // Prepare form data
      console.log("DEBUG - bookingData.date:", bookingData.date);
      console.log("DEBUG - bookingData.time:", bookingData.time);
      const formattedDate = `${bookingData.date.getDate().toString().padStart(2, "0")}/${(bookingData.date.getMonth() + 1).toString().padStart(2, "0")}/${bookingData.date.getFullYear()}`;
      const formattedHora = `${formattedDate} - ${bookingData.time}`;
      console.log("DEBUG - formattedHora:", formattedHora);

      const formData = {
        name: bookingData.personalData.name.trim(),
        phone: bookingData.personalData.phone.trim().replace(/\s+/g, ""),
        email: bookingData.personalData.email.trim().toLowerCase(),
        hora: formattedHora,
        selectedServices: bookingData.selectedServices,
        hairdresserId: bookingData.professional.id,
        selectedDate: bookingData.date.toISOString(),
        selectedTime: bookingData.time,
        totalPrice: calculateTotalPrice(),
      };

      // Submit the form via API
      const response = await fetch("/api/appointments/enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          "Server returned non-JSON response:",
          await response.text(),
        );
        throw new Error(
          "🚨 Error del servidor. Por favor, intenta nuevamente más tarde.",
        );
      }

      const result = await response.json();

      if (result.success) {
        nextStep(); // Go to confirmation step
        setShowSuccessModal(true);
      } else {
        let errorMsg = result.error || "Error al enviar la reserva";

        // Make API error messages more user-friendly
        if (result.errorType === "SCHEDULE_CONFLICT") {
          errorMsg =
            "⏰ Este horario ya fue reservado por otro cliente. Por favor, selecciona otro horario disponible.";
        } else if (result.errorType === "VALIDATION_ERROR") {
          errorMsg = "❌ " + errorMsg;
        } else if (result.errorType === "SERVER_ERROR") {
          errorMsg =
            "🚨 Error interno del servidor. Por favor, intenta nuevamente más tarde.";
        }

        setErrorMessage(errorMsg);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      let errorMsg = "Error inesperado";

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMsg =
            "🌐 Error de conexión. Verifica tu conexión a internet e intenta nuevamente.";
        } else if (error.message.includes("JSON")) {
          errorMsg =
            "🚨 Error del servidor. Por favor, intenta nuevamente más tarde.";
        } else {
          errorMsg = error.message;
        }
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black p-4 py-22 text-white">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Reservar Turno</h1>
            <p className="text-gray-400">
              Paso {getStepNumber()} de 5: {getStepTitle()}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step <= getStepNumber()
                      ? "bg-white text-black"
                      : "bg-neutral-500 text-neutral-200"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-500">
              <div
                className="h-2 rounded-full bg-white transition-all duration-300"
                style={{ width: `${(getStepNumber() / 5) * 100}%` }}
              />
            </div>
          </div>

          <Card
            className="border-neutral-800 bg-neutral-900"
            key={`step-${currentStep}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-normal text-white">
                {currentStep === "professional" && <User className="h-5 w-5" />}
                {currentStep === "date" && <Calendar className="h-5 w-5" />}
                {currentStep === "time" && <Clock className="h-5 w-5" />}
                {currentStep === "personal" && <User className="h-5 w-5" />}
                {currentStep === "confirmation" && (
                  <CheckCircle className="h-5 w-5" />
                )}
                {getStepTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div key={`content-${currentStep}`}>
                {/* Step 1: Select Professional */}
                {currentStep === "professional" && (
                  <div key="professional-step">
                    <ProfessionalSelect
                      selectedProfessional={bookingData.professional}
                      onSelect={handleProfessionalSelect}
                      onSelectionReset={handleSelectionReset}
                    />
                  </div>
                )}

                {/* Step 2: Select Date */}
                {currentStep === "date" && (
                  <div key="date-step">
                    <DateSelect
                      selectedDate={bookingData.date}
                      onSelect={handleDateSelect}
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      selectedHairdresser={bookingData.professional}
                    />
                  </div>
                )}

                {/* Step 3: Select Time */}
                {currentStep === "time" && (
                  <div key="time-step">
                    <TimeSelect
                      selectedTime={bookingData.time}
                      onSelect={handleTimeSelect}
                      selectedHairdresser={bookingData.professional}
                      selectedDate={bookingData.date}
                    />
                  </div>
                )}

                {/* Step 4: Personal Data + Services */}
                {currentStep === "personal" && (
                  <div key="personal-step">
                    <div className="space-y-6">
                      <PersonalDataForm
                        personalData={bookingData.personalData}
                        onChange={handlePersonalDataChange}
                        onValidationChange={setPersonalDataValidation}
                      />

                      {/* Services Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">
                          Servicios disponibles *
                        </h3>

                        {servicesLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600"></div>
                          </div>
                        ) : availableServices.length === 0 ? (
                          <p className="text-gray-400">
                            No hay servicios disponibles
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {availableServices.map((service) => (
                              <div
                                key={service.id}
                                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                  bookingData.selectedServices.includes(
                                    service.id,
                                  )
                                    ? "border-white bg-neutral-100/20"
                                    : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                                }`}
                                onClick={() => handleServiceToggle(service.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white">
                                      {service.name}
                                    </h4>
                                    {service.description && (
                                      <p className="mt-1 text-sm text-neutral-400">
                                        {service.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-3 text-right">
                                    {service.promoPrice &&
                                    service.price &&
                                    service.promoPrice < service.price ? (
                                      <div>
                                        <span className="text-lg font-bold text-green-400">
                                          ${service.promoPrice}
                                        </span>
                                        <span className="ml-1 text-sm text-neutral-500 line-through">
                                          ${service.price}
                                        </span>
                                        <div className="text-xs text-green-400">
                                          ¡Promo!
                                        </div>
                                      </div>
                                    ) : service.price ? (
                                      <span className="text-lg font-bold text-white">
                                        ${service.price}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-gray-500">
                                        Consultar precio
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {bookingData.selectedServices.length === 0 &&
                          availableServices.length > 0 && (
                            <p className="text-sm text-red-400">
                              Selecciona al menos un servicio
                            </p>
                          )}
                      </div>

                      {/* Total Price */}
                      {bookingData.selectedServices.length > 0 && (
                        <div className="rounded-xl bg-neutral-800 p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">
                              Total:
                            </span>
                            <span className="text-xl font-bold text-green-400">
                              ${calculateTotalPrice()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === "confirmation" && (
                  <div key="confirmation-step">
                    <ConfirmationSummary
                      bookingData={{
                        professional: bookingData.professional
                          ? {
                              id: parseInt(bookingData.professional.id),
                              name: bookingData.professional.name,
                              specialty:
                                bookingData.professional.services?.length > 0
                                  ? `${bookingData.professional.services.length} servicios disponibles`
                                  : "Peluquero profesional",
                            }
                          : null,
                        date: bookingData.date,
                        time: bookingData.time,
                        personalData: bookingData.personalData,
                      }}
                      selectedServices={availableServices.filter((service) =>
                        bookingData.selectedServices.includes(service.id),
                      )}
                      totalPrice={calculateTotalPrice()}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep !== "professional" &&
                  currentStep !== "confirmation" && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                  )}

                {currentStep !== "confirmation" && (
                  <Button
                    onClick={
                      currentStep === "personal" ? handleSubmit : nextStep
                    }
                    disabled={!canProceedToNextStep() || isSubmitting}
                    className="ml-auto bg-white text-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                        Enviando...
                      </div>
                    ) : currentStep === "personal" ? (
                      "Confirmar Turno"
                    ) : (
                      "Siguiente"
                    )}
                  </Button>
                )}

                {currentStep === "confirmation" && (
                  <Link href="/" className="ml-auto">
                    <Button
                      onClick={() => {
                        handleSelectionReset();
                        setBookingData({
                          professional: null,
                          date: null,
                          time: "",
                          personalData: { name: "", phone: "", email: "" },
                          selectedServices: [],
                        });
                        setCurrentMonth(new Date());
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Volver
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="border-neutral-700 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              ¡Reserva Confirmada!
            </DialogTitle>
            <DialogDescription className="text-neutral-300">
              Tu reserva ha sido registrada exitosamente. Recibirás un email de
              confirmación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Volver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="border-red-700 bg-neutral-500 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Error en la Reserva
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href="/agenda">
              <Button
                onClick={() => setShowErrorModal(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Intentar nuevamente
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
