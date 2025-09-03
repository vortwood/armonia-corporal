"use client";

import { useEffect } from "react";

import db from "@/util/firestore";
import type { Service } from "@/util/types";
import { addDoc, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  description: string;
  price: number;
  promoPrice: number;
  duration: number;
  category: string;
  isActive: boolean;
}

interface ServicesCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  formLoading: boolean;
  setFormLoading: (loading: boolean) => void;
  resetForm: () => void;
  setServices: (updater: (prev: Service[]) => Service[]) => void;
}

const categories = [
  "Corte",
  "Color",
  "Tratamiento",
  "Peinado",
  "Barba",
  "Cejas",
  "Otros",
];

export default function ServicesCreateModal({
  open,
  onOpenChange,
  formData,
  setFormData,
  formLoading,
  setFormLoading,
  resetForm,
  setServices,
}: ServicesCreateModalProps) {
  useEffect(() => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      promoPrice: 0,
      duration: 0,
      category: "",
      isActive: true,
    });
  }, [open, setFormData]);

  const handleCreateService = async () => {
    if (!formData.name.trim()) {
      alert("Por favor completa el nombre del servicio");
      return;
    }

    if (formData.price <= 0) {
      alert("Por favor ingresa un precio válido");
      return;
    }

    if (formData.promoPrice > 0 && formData.promoPrice >= formData.price) {
      alert("El precio promocional debe ser menor al precio regular");
      return;
    }

    if (formData.duration <= 0) {
      alert("Por favor ingresa una duración válida");
      return;
    }

    setFormLoading(true);

    try {
      const newService = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "services"), newService);

      setServices((prev) => [...prev, { ...newService, id: docRef.id }]);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Error al crear el servicio. Inténtalo de nuevo.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" variant="outline">
          Agregar Servicio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-white">
        <DialogHeader className="text-left">
          <DialogTitle>Crear Nuevo Servicio</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo servicio
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del servicio</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Corte de cabello"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="resize-none"
              placeholder="Describe el servicio que ofreces..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="350"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promoPrice">Precio promo ($)</Label>
              <Input
                id="promoPrice"
                type="number"
                min="0"
                step="1"
                value={formData.promoPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    promoPrice: Number(e.target.value),
                  }))
                }
                placeholder="280"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (min)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
                placeholder="30"
              />
            </div>
          </div>

          {/* Price Preview */}
          {formData.price > 0 && (
            <div className="rounded-xl bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Vista Previa
              </h4>
              <div className="flex items-center space-x-3">
                {formData.promoPrice > 0 &&
                formData.promoPrice < formData.price ? (
                  <>
                    <span className="text-lg font-medium text-red-600">
                      ${formData.promoPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${formData.price}
                    </span>
                    <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      Promo
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-medium text-gray-900">
                    ${formData.price}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  • {formData.duration} min
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-end">
          <Button
            variant="outline"
            onClick={handleCreateService}
            disabled={
              formLoading ||
              !formData.name ||
              formData.price <= 0 ||
              formData.duration <= 0
            }
          >
            {formLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creando...
              </>
            ) : (
              "Crear Servicio"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
