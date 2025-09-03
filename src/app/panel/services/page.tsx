"use client";

import { useEffect, useState } from "react";

import db from "@/util/firestore";
import type { Service } from "@/util/types";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { Separator } from "@/components/ui/separator";

import ServicesResponsiveContainer from "./_components/ServicesListingViews/ServicesResponsiveContainer";
import ServicesCreateModal from "./_components/ServicesModals/ServicesCreateModal";
import ServicesEditModal from "./_components/ServicesModals/ServicesEditModal";
import { ServicesNoResults } from "./_components/ServicesNoResults";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    promoPrice: 0,
    duration: 30,
    category: "",
    isActive: true,
  });

  // Cargar servicios desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load services
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];

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
      await updateDoc(doc(db, "services", id), {
        isActive: !currentStatus,
        updatedAt: new Date().toISOString(),
      });

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s)),
      );
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      promoPrice: 0,
      duration: 30,
      category: "",
      isActive: true,
    });
  };

  // Open edit dialog
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      promoPrice: service.promoPrice,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
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
            <h2 className="text-2xl font-bold text-neutral-900">Servicios</h2>
            <p className="text-neutral-600">
              Gestiona el catálogo de servicios
            </p>
          </div>

          <ServicesCreateModal
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            formData={formData}
            setFormData={setFormData}
            formLoading={formLoading}
            setFormLoading={setFormLoading}
            resetForm={resetForm}
            setServices={setServices}
          />
        </div>

        <Separator className="my-4 bg-black" />

        {/* Vista responsiva de servicios */}
        {services.length === 0 ? (
          <ServicesNoResults setShowCreateDialog={setShowCreateDialog} />
        ) : (
          <ServicesResponsiveContainer
            services={services}
            onToggleActive={toggleActive}
            onEditService={handleEditService}
          />
        )}
      </section>

      {showEditDialog && (
        <ServicesEditModal
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          editingService={editingService}
          formData={formData}
          setFormData={setFormData}
          formLoading={formLoading}
          setFormLoading={setFormLoading}
          resetForm={resetForm}
          setServices={setServices}
          setEditingService={setEditingService}
        />
      )}
    </>
  );
}
