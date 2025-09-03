import type { ServiceType } from "./types";

// Service type buttons (legacy - consider removing in favor of dynamic services)
export const SERVICE_TYPE_BUTTONS = [
  {
    title: "Haircut",
    type: "haircut" as ServiceType,
  },
  {
    title: "Highlights",
    type: "highlights" as ServiceType,
  },
  {
    title: "Color",
    type: "color" as ServiceType,
  },
] as const;

import { getBusinessConfig } from "@/config/business.config";

// Email configuration - now uses business config
export const getEmailConfig = () => {
  const config = getBusinessConfig();
  return {
    sender: {
      name: config.name,
      email: config.contact.email,
    },
    owner: {
      email: config.contact.email,
      name: config.name,
    },
    phone: config.contact.phone,
    logo: "/logo.png", // Generic logo path
  };
};

// Legacy export for backward compatibility - will be removed in future versions
export const EMAIL_CONFIG = getEmailConfig();
