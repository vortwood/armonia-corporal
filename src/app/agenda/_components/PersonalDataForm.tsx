"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Regex patterns for validation (from EnhancedFormNormal)
const URUGUAYAN_PHONE_REGEX = /^(09\d{7})$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

interface PersonalData {
  name: string;
  phone: string;
  email: string;
}

interface ValidationState {
  validName: boolean;
  validPhone: boolean;
  validEmail: boolean;
}

interface PersonalDataFormProps {
  personalData: PersonalData;
  onChange: (personalData: PersonalData) => void;
  onValidationChange?: (validationState: ValidationState) => void;
}

export function PersonalDataForm({
  personalData,
  onChange,
  onValidationChange,
}: PersonalDataFormProps) {
  // Validation state
  const [validName, setValidName] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  // Validate name
  useEffect(() => {
    const trimmedName = personalData.name.trim();
    const isValid = NAME_REGEX.test(trimmedName);
    setValidName(isValid);
  }, [personalData.name]);

  // Validate phone
  useEffect(() => {
    const cleanPhone = personalData.phone.trim().replace(/\s+/g, "");
    const isValid = URUGUAYAN_PHONE_REGEX.test(cleanPhone);
    setValidPhone(isValid);
  }, [personalData.phone]);

  // Validate email
  useEffect(() => {
    const trimmedEmail = personalData.email.trim().toLowerCase();
    // Email is optional, so it's valid if empty or matches regex
    const isValid =
      trimmedEmail === "" ||
      (EMAIL_REGEX.test(trimmedEmail) && trimmedEmail.length <= 100);
    setValidEmail(isValid);
  }, [personalData.email]);

  // Notify parent of validation state changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange({
        validName,
        validPhone,
        validEmail,
      });
    }
  }, [validName, validPhone, validEmail, onValidationChange]);

  const handleChange = (field: keyof PersonalData, value: string) => {
    onChange({
      ...personalData,
      [field]: value,
    });
  };

  const getInputClassName = (fieldValue: string, isValid: boolean) => {
    const baseClass =
      "mt-1 border-neutral-400 border text-black placeholder-neutral-300 transition-colors";

    if (fieldValue.trim() === "") {
      return baseClass;
    }

    return cn(
      baseClass,
      isValid
        ? "border-neutral-400 focus:border-neutral-400"
        : "border-neutral-400 focus:border-neutral-400",
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-black">
          Nombre Completo *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Ingrese su nombre completo"
          value={personalData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={getInputClassName(personalData.name, validName)}
        />
        {personalData.name.trim() !== "" && !validName && (
          <p className="mt-1 text-sm text-neutral-400">
            Nombre debe tener entre 2-50 caracteres, solo letras
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="phone" className="text-black">
          Teléfono *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Ingrese su número de teléfono"
          value={personalData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={getInputClassName(personalData.phone, validPhone)}
        />
        {personalData.phone.trim() !== "" && !validPhone && (
          <p className="mt-1 text-sm text-red-400">
            Formato: 09XXXXXXX (números de Uruguay)
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="text-black">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingrese su email"
          value={personalData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={getInputClassName(personalData.email, validEmail)}
        />
        {personalData.email.trim() !== "" && !validEmail && (
          <p className="mt-1 text-sm text-red-400">
            Email debe ser válido y máximo 100 caracteres
          </p>
        )}
      </div>
    </div>
  );
}
