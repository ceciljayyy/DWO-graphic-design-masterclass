import { City, Country } from "country-state-city";

import { isSupportedCountryCode } from "@/lib/phone";

export type CityOption = {
  id: string;
  name: string;
  stateCode?: string;
  countryCode: string;
  label: string;
};

const cityCache = new Map<string, CityOption[]>();

function uniqueCities(cities: CityOption[]) {
  const seen = new Set<string>();
  const unique: CityOption[] = [];

  for (const city of cities) {
    const key = city.name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(city);
  }

  return unique.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountryDisplayName(countryCode: string) {
  return Country.getCountryByCode(countryCode)?.name ?? countryCode;
}

export function getCitiesForCountry(countryCode: string): CityOption[] {
  if (!isSupportedCountryCode(countryCode)) {
    return [];
  }

  const cached = cityCache.get(countryCode);
  if (cached) {
    return cached;
  }

  const cities = City.getCitiesOfCountry(countryCode) ?? [];
  const mapped = uniqueCities(
    cities.map((city) => ({
      id: `${city.countryCode}-${city.stateCode ?? "NA"}-${city.name}`,
      name: city.name,
      stateCode: city.stateCode,
      countryCode: city.countryCode,
      label: city.stateCode ? `${city.name}, ${city.stateCode}` : city.name,
    })),
  );

  cityCache.set(countryCode, mapped);
  return mapped;
}

export function searchCitiesForCountry(
  countryCode: string,
  query: string,
  limit = 80,
): CityOption[] {
  const cities = getCitiesForCountry(countryCode);
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return cities.slice(0, limit);
  }

  const startsWith: CityOption[] = [];
  const includes: CityOption[] = [];

  for (const city of cities) {
    const name = city.name.toLowerCase();
    if (name.startsWith(normalized)) {
      startsWith.push(city);
    } else if (name.includes(normalized)) {
      includes.push(city);
    }

    if (startsWith.length + includes.length >= limit) {
      break;
    }
  }

  return [...startsWith, ...includes].slice(0, limit);
}

export function isCityInCountry(cityName: string, countryCode: string) {
  const normalized = cityName.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return getCitiesForCountry(countryCode).some(
    (city) => city.name.toLowerCase() === normalized,
  );
}
