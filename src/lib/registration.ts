import { masterclass, registrationFee } from "@/lib/masterclass";
import { experienceLevelOptions, type ExperienceLevel, type RegistrationFormValues, type RegistrationValidationErrors } from "@/types/registration";

export type NormalizedRegistrationInput = {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  location: string;
  experienceLevel: ExperienceLevel;
};

export type RegistrationValidationResult =
  | { success: true; data: NormalizedRegistrationInput }
  | { success: false; errors: RegistrationValidationErrors };

export const registrationConfiguration = {
  masterclassName: masterclass.name,
  fee: registrationFee,
  experienceLevels: experienceLevelOptions,
} as const;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  return value.trim().replace(/[\s()-]+/g, "");
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateRegistrationInput(input: unknown): RegistrationValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { form: "Invalid request payload." } };
  }

  const raw = input as Partial<Record<keyof RegistrationFormValues, unknown>>;
  const errors: RegistrationValidationErrors = {};

  const fullName = typeof raw.fullName === "string" ? normalizeText(raw.fullName) : "";
  const email = typeof raw.email === "string" ? normalizeEmail(raw.email) : "";
  const phone = typeof raw.phone === "string" ? normalizePhone(raw.phone) : "";
  const whatsapp = typeof raw.whatsapp === "string" ? normalizePhone(raw.whatsapp) : "";
  const location = typeof raw.location === "string" ? normalizeText(raw.location) : "";
  const experienceLevel =
    typeof raw.experienceLevel === "string" ? raw.experienceLevel.toUpperCase() : "";

  if (!fullName) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Please enter a valid full name.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[+]?([0-9][\s-]?){7,15}[0-9]$/.test(phone.replace(/\s+/g, ""))) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (whatsapp && !/^[+]?([0-9][\s-]?){7,15}[0-9]$/.test(whatsapp.replace(/\s+/g, ""))) {
    errors.whatsapp = "Please enter a valid WhatsApp number or leave it blank.";
  }

  if (!location) {
    errors.location = "Please enter your city or town.";
  } else if (location.length < 2) {
    errors.location = "Please enter a valid city or town.";
  }

  if (!experienceLevel) {
    errors.experienceLevel = "Please select your experience level.";
  } else if (!experienceLevelOptions.includes(experienceLevel as ExperienceLevel)) {
    errors.experienceLevel = "Please select a valid experience level.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      whatsapp: whatsapp || null,
      location,
      experienceLevel: experienceLevel as ExperienceLevel,
    },
  };
}