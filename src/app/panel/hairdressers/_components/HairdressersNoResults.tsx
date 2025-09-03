import { Button } from "@/components/ui/button";

export function HairdressersNoResults({
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No hay Profesionales registrados
      </h3>
      <p className="mt-2 text-gray-500">
        Comienza agregando tu primer profesional al equipo.
      </p>
      <Button
        onClick={() => setShowCreateDialog(true)}
        className="mt-4 rounded-xl"
      >
        Agregar Primer Profesional
      </Button>
    </div>
  );
}
