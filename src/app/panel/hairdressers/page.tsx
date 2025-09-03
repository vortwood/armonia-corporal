"use client";

import { useEffect, useState } from "react";

import {
  createDefaultWeeklySchedule,
  getActiveServices,
} from "@/util/dynamicScheduling";
import db from "@/util/firestore";
import type { Professional, Service } from "@/util/types";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { Separator } from "@/components/ui/separator";

import HairdressersResponsiveContainer from "./_components/HairdressersListingViews/HairdressersResponsiveContainer";
import HairdressersCreateModal from "./_components/HairdressersModals/HairdressersCreateModal";
import HairdressersEditModal from "./_components/HairdressersModals/HairdressersEditModal";
import { HairdressersNoResults } from "./_components/HairdressersNoResults";

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  // Modal state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
    services: [] as string[],
    schedule: {
      weeklySchedule: createDefaultWeeklySchedule(),
      defaultSlotInterval: 30,
    },
  });

  // Cargar profesionales y servicios desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Iniciando carga de datos...");
        
        // Load professionals
        const querySnapshot = await getDocs(collection(db, "professionals"));
        console.log("Documentos obtenidos:", querySnapshot.docs.length);
        
        const professionalsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Documento profesional:", { id: doc.id, data });
          return {
            id: doc.id,
            ...data,
          };
        }) as Professional[];

        // Load services
        const servicesData = await getActiveServices();
        console.log("Servicios cargados:", servicesData.length);

        setProfessionals(professionalsData);
        setServices(servicesData);
        
        console.log("Datos cargados completamente. Profesionales:", professionalsData.length);
      } catch (error) {
        console.error("Error completo cargando datos:", error);
        alert(`Error cargando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cambiar estado activo/inactivo
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "professionals", id), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString(),
      });

      setProfessionals((prev) =>
        prev.map((h) => (h.id === id ? { ...h, isActive: !currentStatus } : h)),
      );
    } catch (error) {
      console.error("Error updating professional status:", error);
    }
  };

  // Eliminar profesional
  const handleDeleteProfessional = async (professional: Professional) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro que deseas eliminar a ${professional.name}? Esta acción no se puede deshacer.`
    );
    
    if (!confirmDelete) return;

    try {
      console.log("Eliminando profesional:", professional.id);
      
      // Eliminar de Firebase
      await deleteDoc(doc(db, "professionals", professional.id));
      
      // Actualizar la lista local
      setProfessionals((prev) => prev.filter((p) => p.id !== professional.id));
      
      alert("Profesional eliminado exitosamente");
      console.log("Profesional eliminado:", professional.id);
      
    } catch (error) {
      console.error("Error eliminando profesional:", error);
      alert(`Error al eliminar el profesional: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Reset form
  const resetForm = () => {
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
  };

  // Open edit dialog
  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional);

    // Handle data migration for existing professionals
    let schedule = professional.schedule;

    // Check if we have the new weeklySchedule format
    if (!schedule.weeklySchedule) {
      // Create default weekly schedule for migration
      schedule = {
        weeklySchedule: createDefaultWeeklySchedule(),
        defaultSlotInterval: 30,
      };
    } else if (!schedule.defaultSlotInterval) {
      // Add missing defaultSlotInterval
      schedule = {
        ...schedule,
        defaultSlotInterval: 30,
      };
    }

    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      photo: professional.photo || "",
      services: professional.services,
      schedule: schedule,
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Profesionales
            </h2>
            <p className="text-neutral-600">
              Gestiona el equipo de profesionales
            </p>
          </div>

          <HairdressersCreateModal
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            formData={formData}
            setFormData={setFormData}
            formLoading={formLoading}
            setFormLoading={setFormLoading}
            services={services}
            resetForm={resetForm}
            setProfessionals={setProfessionals}
          />
        </div>

        <Separator className="my-4 bg-black" />

        {/* Vista responsiva de Profesionales */}
        {professionals.length === 0 ? (
          <HairdressersNoResults setShowCreateDialog={setShowCreateDialog} />
        ) : (
          <HairdressersResponsiveContainer
            hairdressers={professionals}
            onToggleActive={toggleActive}
            onEditHairdresser={handleEditProfessional}
            onDeleteHairdresser={handleDeleteProfessional}
          />
        )}
      </section>

      {showEditDialog && (
        <HairdressersEditModal
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          editingProfessional={editingProfessional}
          formData={formData}
          setFormData={setFormData}
          formLoading={formLoading}
          setFormLoading={setFormLoading}
          services={services}
          resetForm={resetForm}
          setProfessionals={setProfessionals}
          setEditingProfessional={setEditingProfessional}
        />
      )}
    </>
  );
}
