"use client";

import { useState } from "react";
import { Hairdresser } from "@/util/types";

// Componente ProfileSelect personalizado
export function ProfileSelect({
  value,
  onChange,
  personas,
}: {
  value: string;
  onChange: (value: string) => void;
  personas: Hairdresser[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPerson = personas.find((person) => person.id === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-md flex w-full items-center justify-between rounded-xl border bg-white p-3 px-4 shadow-lg outline-none transition-colors"
      >
        {selectedPerson ? (
          <div className="flex items-center">
            <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full bg-white">
              <img
                src={`/peluqueros/${selectedPerson.id}.png`}
                alt={selectedPerson.name}
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".initials")) {
                    const initials = document.createElement("div");
                    initials.className =
                      "initials absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-200";
                    initials.textContent = selectedPerson.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                    parent.appendChild(initials);
                  }
                }}
              />
            </div>
            <span className="text-lg font-medium">{selectedPerson.name}</span>
          </div>
        ) : (
          <span className="bg-white">Seleccionar peluquero...</span>
        )}
        <svg
          className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-70 w-full overflow-auto rounded-xl border bg-white shadow-lg">
          <div className="p-2">
            {personas.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => {
                  onChange(person.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg p-2 text-left transition-colors hover:bg-gray-100 ${
                  value === person.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={`/peluqueros/${person.id}.png`}
                    alt={person.name}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".initials")) {
                        const initials = document.createElement("div");
                        initials.className =
                          "initials absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-200";
                        initials.textContent = person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();
                        parent.appendChild(initials);
                      }
                    }}
                  />
                </div>
                <span className="text-lg font-medium">{person.name}</span>
                {value === person.id && (
                  <svg
                    className="ml-auto h-4 w-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
