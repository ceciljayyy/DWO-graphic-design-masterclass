import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export type PhoneCountryOption = {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
  label: string;
};

const regionNames =
  typeof Intl !== "undefined"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const countryAdjectives: Partial<Record<CountryCode, string>> = {
  GH: "Ghanaian",
  NG: "Nigerian",
  GB: "UK",
  US: "US",
  CA: "Canadian",
  KE: "Kenyan",
  ZA: "South African",
  CI: "Ivorian",
  TG: "Togolese",
  BJ: "Beninese",
  BF: "Burkinabe",
  LR: "Liberian",
  SL: "Sierra Leonean",
};

function toFlagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

function getCountryName(iso2: CountryCode) {
  return regionNames?.of(iso2) ?? iso2;
}

let cachedCountries: PhoneCountryOption[] | null = null;

export function getPhoneCountries(): PhoneCountryOption[] {
  if (cachedCountries) {
    return cachedCountries;
  }

  cachedCountries = getCountries()
    .map((iso2) => {
      const dialCode = `+${getCountryCallingCode(iso2)}`;
      const name = getCountryName(iso2);
      const flag = toFlagEmoji(iso2);

      return {
        iso2,
        name,
        dialCode,
        flag,
        label: `${flag} ${name} (${dialCode})`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return cachedCountries;
}

export function isSupportedCountryCode(value: string): value is CountryCode {
  return getCountries().includes(value as CountryCode);
}

export function getDefaultPhoneCountry(): CountryCode {
  return "GH";
}

export function getCountryAdjective(iso2: CountryCode) {
  return countryAdjectives[iso2] ?? getCountryName(iso2);
}

export function getPhoneCountryOption(iso2: CountryCode) {
  return getPhoneCountries().find((country) => country.iso2 === iso2) ?? null;
}

export type ValidPhone = {
  ok: true;
  e164: string;
  national: string;
  country: CountryCode;
};

export type InvalidPhone = {
  ok: false;
  error: string;
};

export type PhoneValidationResult = ValidPhone | InvalidPhone;

export function isInvalidPhone(
  result: PhoneValidationResult,
): result is InvalidPhone {
  return result.ok === false;
}

export function validatePhoneForCountry(
  value: string,
  countryCode: string,
  options?: { required?: boolean; fieldLabel?: "phone" | "whatsapp" },
): PhoneValidationResult {
  const required = options?.required ?? true;
  const fieldLabel = options?.fieldLabel ?? "phone";
  const trimmed = value.trim();

  if (!trimmed) {
    if (!required) {
      return { ok: true, e164: "", national: "", country: countryCode as CountryCode };
    }

    return {
      ok: false,
      error:
        fieldLabel === "whatsapp"
          ? "Please enter a valid WhatsApp number or leave this field empty."
          : "Please enter your phone number.",
    };
  }

  if (!isSupportedCountryCode(countryCode)) {
    return {
      ok: false,
      error: "Please select a valid country.",
    };
  }

  const parsed = parsePhoneNumberFromString(trimmed, countryCode);

  if (!parsed || !parsed.isValid()) {
    if (fieldLabel === "whatsapp") {
      return {
        ok: false,
        error: "Please enter a valid WhatsApp number or leave this field empty.",
      };
    }

    return {
      ok: false,
      error: `Please enter a valid ${getCountryAdjective(countryCode)} phone number.`,
    };
  }

  if (parsed.country && parsed.country !== countryCode && !trimmed.startsWith("+")) {
    return {
      ok: false,
      error: `Please enter a valid ${getCountryAdjective(countryCode)} phone number.`,
    };
  }

  return {
    ok: true,
    e164: parsed.format("E.164"),
    national: parsed.formatNational(),
    country: (parsed.country ?? countryCode) as CountryCode,
  };
}

export function formatNationalPhonePreview(value: string, countryCode: CountryCode) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const parsed = parsePhoneNumberFromString(trimmed, countryCode);
  if (!parsed) {
    return trimmed;
  }

  try {
    return parsed.formatNational();
  } catch {
    return trimmed;
  }
}
