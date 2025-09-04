import { User, Calendar, Clock, CheckCircle, Scissors, DollarSign } from "lucide-react"
import type { Service } from "@/util/types"

interface Professional {
  id: number
  name: string
  specialty: string
  avatar?: string
}

interface PersonalData {
  name: string
  phone: string
  email: string
}

interface BookingData {
  professional: Professional | null
  date: Date | null
  time: string
  personalData: PersonalData
}

interface ConfirmationSummaryProps {
  bookingData: BookingData
  selectedServices?: Service[]
  totalPrice?: number
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
  }).format(price)
}


export default function ConfirmationSummary({ bookingData, selectedServices, totalPrice }: ConfirmationSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-neutral-800 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Resumen de tu turno</h3>

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-white" />
          <div>
            <p className="text-white font-medium">{bookingData.professional?.name}</p>
            <p className="text-neutral-400 text-sm">
              {selectedServices && selectedServices.length > 0 
                ? `${selectedServices.length} servicio${selectedServices.length > 1 ? 's' : ''} seleccionado${selectedServices.length > 1 ? 's' : ''}`
                : bookingData.professional?.specialty
              }
            </p>
          </div>
        </div>

        {selectedServices && selectedServices.length > 0 && (
          <div className="flex items-start gap-3">
            <Scissors className="mt-0.5 w-5 h-5 text-white" />
            <div className="space-y-1">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <span className="text-white text-sm">{service.name}</span>
                  <span className="ml-4 text-sm text-neutral-300">
                    {service.promoPrice && service.promoPrice !== service.price ? (
                      <>
                        <span className="mr-2 text-sm line-through text-neutral-500">
                          {formatPrice(service.price || 0)}
                        </span>
                        {formatPrice(service.promoPrice)}
                      </>
                    ) : (
                      formatPrice(service.price || 0)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-white" />
          <p className="text-white capitalize">{bookingData.date && formatDate(bookingData.date)}</p>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-white" />
          <p className="text-white">{bookingData.time}</p>
        </div>

        <div className="border-t border-neutral-700 pt-4">
          <p className="text-white font-medium">{bookingData.personalData.name}</p>
          <p className="text-neutral-400">{bookingData.personalData.phone}</p>
          {bookingData.personalData.email && (
            <p className="text-neutral-400">{bookingData.personalData.email}</p>
          )}
        </div>

        {totalPrice !== undefined && totalPrice > 0 && (
          <div className="border-t border-neutral-700 pt-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-white" />
              <div className="flex justify-between items-center w-full">
                <p className="text-white font-medium">Total</p>
                <p className="text-white font-bold text-lg">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-950 border border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400 font-medium">¡Turno confirmado!</p>
        </div>
      </div>
    </div>
  )
}