"use client";

import { useEffect, useState } from "react";

import { getActiveServices } from "@/util/dynamicScheduling";
import db from "@/util/firestore";
import type { Hairdresser, Service } from "@/util/types";
import { createDefaultWeeklySchedule } from "@/util/dynamicScheduling";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import HairdressersResponsiveContainer from "./_components/HairdressersListingViews/HairdressersResponsiveContainer";
import HairdressersCreateModal from "./_components/HairdressersModals/HairdressersCreateModal";
import HairdressersEditModal from "./_components/HairdressersModals/HairdressersEditModal";
import { HairdressersNoResults } from "./_components/HairdressersNoResults";
import { Separator } from "@/components/ui/separator";

export default function HairdressersPage() {
  const [hairdressers, setHairdressers] = useState<Hairdresser[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  // Modal state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHairdresser, setEditingHairdresser] =
    useState<Hairdresser | null>(null);
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

  // Cargar peluqueros y servicios desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load hairdressers
        const querySnapshot = await getDocs(collection(db, "hairdressers"));
        const hairdressersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Hairdresser[];

        // Load services
        const servicesData = await getActiveServices();

        setHairdressers(hairdressersData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cambiar estado activo/inactivo
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "hairdressers", id), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString(),
      });

      setHairdressers((prev) =>
        prev.map((h) => (h.id === id ? { ...h, isActive: !currentStatus } : h)),
      );
    } catch (error) {
      console.error("Error updating hairdresser status:", error);
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
  const handleEditHairdresser = (hairdresser: Hairdresser) => {
    setEditingHairdresser(hairdresser);
    
    // Handle data migration for existing hairdressers
    let schedule = hairdresser.schedule;
    
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
      name: hairdresser.name,
      email: hairdresser.email,
      phone: hairdresser.phone,
      photo: hairdresser.photo || "",
      services: hairdresser.services,
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
            <h2 className="text-2xl font-semibold text-neutral-900">Peluqueros</h2>
            <p className="text-neutral-600">Gestiona el equipo de profesionales</p>
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
            setHairdressers={setHairdressers}
          />
        </div>

        <Separator className="bg-black my-4" />

        {/* Vista responsiva de peluqueros */}
        {hairdressers.length === 0 ? (
          <HairdressersNoResults setShowCreateDialog={setShowCreateDialog} />
        ) : (
          <HairdressersResponsiveContainer
            hairdressers={hairdressers}
            onToggleActive={toggleActive}
            onEditHairdresser={handleEditHairdresser}
          />
        )}
      </section>

      {showEditDialog && (
        <HairdressersEditModal
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          editingHairdresser={editingHairdresser}
          formData={formData}
          setFormData={setFormData}
          formLoading={formLoading}
          setFormLoading={setFormLoading}
          services={services}
          resetForm={resetForm}
          setHairdressers={setHairdressers}
          setEditingHairdresser={setEditingHairdresser}
        />
      )}
    </>
  );
}
