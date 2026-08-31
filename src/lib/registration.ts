import { isCityInCountry } from "@/lib/locations";
import { masterclass, registrationFee } from "@/lib/masterclass";
import {
  normalizeMarketingAttributionInput,
  type MarketingAttributionPayload,
} from "@/lib/marketing-attribution";
import {
  getDefaultPhoneCountry,
  isInvalidPhone,
  isSupportedCountryCode,
  validatePhoneForCountry,
} from "@/lib/phone";
import {
  experienceLevelOptions,
  type ExperienceLevel,
  type RegistrationFormValues,
  type RegistrationValidationErrors,
} from "@/types/registration";

export type NormalizedRegistrationInput = {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string | null;
  whatsapp: string;
  location: string;
  experienceLevel: ExperienceLevel;
  marketing: MarketingAttributionPayload;
};

export type RegistrationValidationResult =
  | { success: true; data: NormalizedRegistrationInput }
  | { success: false; errors: RegistrationValidationErrors };

export const registrationConfiguration = {
  masterclassName: masterclass.name,
  fee: registrationFee,
  experienceLevels: experienceLevelOptions,
  defaultCountryCode: getDefaultPhoneCountry(),
} as const;

const FULL_NAME_PATTERN =
  /^[\p{L}][\p{L}\p{M}'’.\-]*(?: [\p{L}][\p{L}\p{M}'’.\-]*)+$/u;

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeFullName(value: string) {
  return normalizeText(value);
}

export function validateFullName(value: string) {
  const fullName = normalizeFullName(value);

  if (!fullName || fullName.length < 2) {
    return { success: false as const, error: "Please enter your full name." };
  }

  // Require at least first + last name style token, letters only with allowed separators.
  if (!FULL_NAME_PATTERN.test(fullName) || /\d/.test(fullName)) {
    return { success: false as const, error: "Please enter your full name." };
  }

  return { success: true as const, value: fullName };
}

export function validateEmailAddress(value: string) {
  const email = normalizeEmail(value);

  if (!email) {
    return {
      success: false as const,
      error: "Please enter a valid email address.",
    };
  }

  if (!EMAIL_PATTERN.test(email) || email.includes("..")) {
    return {
      success: false as const,
      error: "Please enter a valid email address.",
    };
  }

  return { success: true as const, value: email };
}

export function validateRegistrationInput(
  input: unknown,
): RegistrationValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { form: "Invalid request payload." } };
  }

  const raw = input as Partial<
    Record<
      keyof RegistrationFormValues | keyof import("@/types/registration").RegistrationAttributionValues,
      unknown
    >
  >;
  const errors: RegistrationValidationErrors = {};

  const fullNameResult = validateFullName(
    typeof raw.fullName === "string" ? raw.fullName : "",
  );
  const emailResult = validateEmailAddress(
    typeof raw.email === "string" ? raw.email : "",
  );

  const countryCode =
    typeof raw.countryCode === "string" && raw.countryCode.trim()
      ? raw.countryCode.trim().toUpperCase()
      : getDefaultPhoneCountry();

  const phoneRaw = typeof raw.phone === "string" ? raw.phone : "";
  const whatsappRaw = typeof raw.whatsapp === "string" ? raw.whatsapp : "";
  const location =
    typeof raw.location === "string" ? normalizeText(raw.location) : "";
  const experienceLevel =
    typeof raw.experienceLevel === "string"
      ? raw.experienceLevel.toUpperCase()
      : "";

  if (!fullNameResult.success) {
    errors.fullName = fullNameResult.error;
  }

  if (!emailResult.success) {
    errors.email = emailResult.error;
  }

  if (!isSupportedCountryCode(countryCode)) {
    errors.countryCode = "Please select a valid country.";
  }

  const phoneResult = validatePhoneForCountry(phoneRaw, countryCode, {
    required: false,
    fieldLabel: "phone",
  });
  if (isInvalidPhone(phoneResult)) {
    errors.phone = phoneResult.error;
  }

  const whatsappResult = validatePhoneForCountry(whatsappRaw, countryCode, {
    required: true,
    fieldLabel: "whatsapp",
  });
  if (isInvalidPhone(whatsappResult)) {
    errors.whatsapp = whatsappResult.error;
  }

  if (!location) {
    errors.location = "Please select your city or town.";
  } else if (
    isSupportedCountryCode(countryCode) &&
    !isCityInCountry(location, countryCode)
  ) {
    errors.location = "Please select your city or town.";
  }

  if (!experienceLevel) {
    errors.experienceLevel = "Please select your experience level.";
  } else if (
    !experienceLevelOptions.includes(experienceLevel as ExperienceLevel)
  ) {
    errors.experienceLevel = "Please select a valid experience level.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const marketing = normalizeMarketingAttributionInput({
    marketingSource: raw.marketingSource,
    utmSource: raw.utmSource,
    utmMedium: raw.utmMedium,
    utmCampaign: raw.utmCampaign,
  });

  return {
    success: true,
    data: {
      fullName: fullNameResult.success ? fullNameResult.value : "",
      email: emailResult.success ? emailResult.value : "",
      countryCode,
      phone:
        phoneResult.ok && phoneResult.e164 ? phoneResult.e164 : null,
      whatsapp: whatsappResult.ok ? whatsappResult.e164 : "",
      location,
      experienceLevel: experienceLevel as ExperienceLevel,
      marketing,
    },
  };
}
