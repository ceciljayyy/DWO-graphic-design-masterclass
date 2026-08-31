"use client";

import {
  readMarketingAttributionFromSearchParams,
  type MarketingAttributionPayload,
} from "@/lib/marketing-attribution";

const STORAGE_KEY = "dwo-marketing-attribution";
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredMarketingAttribution = MarketingAttributionPayload & {
  savedAt: number;
};

function readStoredAttribution(): StoredMarketingAttribution | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredMarketingAttribution;
    if (
      typeof parsed.savedAt !== "number" ||
      Date.now() - parsed.savedAt > ATTRIBUTION_TTL_MS ||
      typeof parsed.marketingSource !== "string"
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors in restricted environments.
    }
    return null;
  }
}

function writeStoredAttribution(payload: MarketingAttributionPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const stored: StoredMarketingAttribution = {
    ...payload,
    savedAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Ignore quota or privacy-mode storage errors.
  }
}

export function captureMarketingAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readStoredAttribution();
  const params = new URLSearchParams(window.location.search);
  const hasTrackingParams =
    params.has("source") ||
    params.has("ref") ||
    params.has("utm_source") ||
    params.has("utm_medium") ||
    params.has("utm_campaign") ||
    params.has("gclid") ||
    params.has("fbclid");

  if (existing && !hasTrackingParams) {
    return;
  }

  const attribution = readMarketingAttributionFromSearchParams(
    params,
    document.referrer || null,
  );

  writeStoredAttribution(attribution);
}

export function getStoredMarketingAttribution(): MarketingAttributionPayload | null {
  const stored = readStoredAttribution();
  if (!stored) {
    return null;
  }

  return {
    marketingSource: stored.marketingSource,
    utmSource: stored.utmSource,
    utmMedium: stored.utmMedium,
    utmCampaign: stored.utmCampaign,
  };
}

export function clearStoredMarketingAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in restricted environments.
  }
}
