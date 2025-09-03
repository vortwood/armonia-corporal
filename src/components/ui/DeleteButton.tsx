import { useState } from "react";
import db from "@/util/firestore";
import { deleteDoc, doc } from "firebase/firestore";

export default function DeleteItem({
  id,
  reRender,
  setReRender,
  collection = "appointments",
  appointmentInfo,
  status,
}: {
  id: string;
  reRender: boolean;
  setReRender: React.Dispatch<React.SetStateAction<boolean>>;
  collection?: string;
  appointmentInfo?: {
    name: string;
    time: string;
    stylist: string;
  };
  status?: string;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsDeleting(true);
    const itemRef = doc(db, collection, id);
    
    try {
      await deleteDoc(itemRef);
      setReRender(!reRender);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Error al cancelar la cita. Por favor, intenta nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Don't show delete button for completed appointments
  if (status === 'completed') {
    return null;
  }

  if (showConfirmation) {
    return (
      <div className="mt-4 space-y-3 rounded-lg bg-red-50 p-4 border border-red-200">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h4 className="font-medium text-red-800">Confirmar Cancelación</h4>
        </div>
        <p className="text-sm text-red-700">
          ¿Estás seguro de que quieres cancelar esta cita?
          {appointmentInfo && (
            <span className="block mt-1 font-medium">
              {appointmentInfo.name} - {appointmentInfo.time}
            </span>
          )}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Cancelando...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Sí, Cancelar</span>
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, Mantener
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="mt-3 flex items-center space-x-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Cancelar Cita</span>
    </button>
  );
}
