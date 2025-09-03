"use client";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import db from "@/util/firestore";
import type { Service } from "@/util/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormData {
  name: string;
  description: string;
  price: number;
  promoPrice: number;
  duration: number;
  category: string;
  isActive: boolean;
}

interface ServicesEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService: Service | null;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  formLoading: boolean;
  setFormLoading: (loading: boolean) => void;
  resetForm: () => void;
  setServices: (updater: (prev: Service[]) => Service[]) => void;
  setEditingService: (service: Service | null) => void;
}

const categories = [
  "Corte",
  "Color",
  "Tratamiento",
  "Peinado",
  "Barba",
  "Cejas",
  "Otros"
];

export default function ServicesEditModal({
  open,
  onOpenChange,
  editingService,
  formData,
  setFormData,
  formLoading,
  setFormLoading,
  resetForm,
  setServices,
  setEditingService,
}: ServicesEditModalProps) {
  const handleUpdateService = async () => {
    if (!editingService || !formData.name.trim()) {
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
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "services", editingService.id), updatedData);

      setServices(prev =>
        prev.map(s =>
          s.id === editingService.id ? { ...s, ...updatedData } : s
        )
      );
      
      onOpenChange(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Error al actualizar el servicio. Inténtalo de nuevo.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!editingService) return;

    if (!confirm("¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.")) {
      return;
    }

    setFormLoading(true);

    try {
      await deleteDoc(doc(db, "services", editingService.id));
      setServices(prev => prev.filter(s => s.id !== editingService.id));
      onOpenChange(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error al eliminar el servicio. Inténtalo de nuevo.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto bg-white">
        <DialogHeader className="text-left">
          <DialogTitle>Editar Servicio</DialogTitle>
          <DialogDescription>
            {editingService?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del servicio</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Corte de cabello"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe el servicio que ofreces..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio ($)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="1"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="350"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-promoPrice">Precio promo ($)</Label>
              <Input
                id="edit-promoPrice"
                type="number"
                min="0"
                step="1"
                value={formData.promoPrice || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, promoPrice: Number(e.target.value) }))}
                placeholder="280"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duración (min)</Label>
              <Input
                id="edit-duration"
                type="number"
                min="5"
                step="5"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
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
                {formData.promoPrice > 0 && formData.promoPrice < formData.price ? (
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

        <DialogFooter className="flex justify-end flex-row gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteService}
            disabled={formLoading}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {formLoading ? "Eliminando..." : "Eliminar Servicio"}
          </Button>

         
            <Button 
            variant="outline"
              onClick={handleUpdateService}
              disabled={formLoading || !formData.name || formData.price <= 0 || formData.duration <= 0}
            >
              {formLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}