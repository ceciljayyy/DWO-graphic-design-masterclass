import { getDefaultPhoneCountry, isSupportedCountryCode } from "@/lib/phone";
import {
  experienceLevelOptions,
  type ExperienceLevel,
  type RegistrationFormValues,
} from "@/types/registration";

const STORAGE_KEY = "dwo-registration-draft";
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredRegistrationDraft = {
  version: number;
  savedAt: number;
  values: RegistrationFormValues;
};

function isExperienceLevel(value: unknown): value is ExperienceLevel {
  return (
    typeof value === "string" &&
    experienceLevelOptions.includes(value as ExperienceLevel)
  );
}

function normalizeDraftValues(raw: unknown): RegistrationFormValues | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const values = raw as Partial<RegistrationFormValues>;
  const countryCode =
    typeof values.countryCode === "string" && values.countryCode.trim()
      ? values.countryCode.trim().toUpperCase()
      : getDefaultPhoneCountry();

  if (!isSupportedCountryCode(countryCode)) {
    return null;
  }

  return {
    fullName: typeof values.fullName === "string" ? values.fullName : "",
    email: typeof values.email === "string" ? values.email : "",
    countryCode,
    phone: typeof values.phone === "string" ? values.phone : "",
    whatsapp: typeof values.whatsapp === "string" ? values.whatsapp : "",
    location: typeof values.location === "string" ? values.location : "",
    experienceLevel: isExperienceLevel(values.experienceLevel)
      ? values.experienceLevel
      : "",
  };
}

export function isRegistrationDraftEmpty(values: RegistrationFormValues) {
  return (
    !values.fullName.trim() &&
    !values.email.trim() &&
    !(values.phone ?? "").trim() &&
    !values.whatsapp.trim() &&
    !values.location.trim() &&
    !values.experienceLevel
  );
}

export function loadRegistrationDraft(): RegistrationFormValues | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredRegistrationDraft;
    if (
      parsed.version !== DRAFT_VERSION ||
      typeof parsed.savedAt !== "number" ||
      Date.now() - parsed.savedAt > DRAFT_TTL_MS
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const values = normalizeDraftValues(parsed.values);
    if (!values || isRegistrationDraftEmpty(values)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return values;
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors in restricted environments.
    }
    return null;
  }
}

export function saveRegistrationDraft(values: RegistrationFormValues) {
  if (typeof window === "undefined") {
    return;
  }

  if (isRegistrationDraftEmpty(values)) {
    clearRegistrationDraft();
    return;
  }

  const payload: StoredRegistrationDraft = {
    version: DRAFT_VERSION,
    savedAt: Date.now(),
    values,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota or privacy-mode storage errors.
  }
}

export function clearRegistrationDraft() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in restricted environments.
  }
}
