import { Button } from "@/components/ui/button";

export function ServicesNoResults({
  setShowCreateDialog,
}: {
  setShowCreateDialog: (show: boolean) => void;
}) {
  return (
    <div className="p-12 text-center">
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No hay servicios registrados
      </h3>
      <p className="mt-2 text-gray-500">
        Comienza agregando servicios que ofreces.
      </p>
      <Button
        onClick={() => setShowCreateDialog(true)}
        className="mt-4 rounded-xl"
      >
        Agregar Primer Servicio
      </Button>
    </div>
  );
}
