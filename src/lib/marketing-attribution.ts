export const marketingSourceOptions = [
  "INSTAGRAM",
  "TIKTOK",
  "WHATSAPP",
  "FACEBOOK",
  "GOOGLE",
  "DIRECT",
  "OTHER",
] as const;

export type MarketingSource = (typeof marketingSourceOptions)[number];

export type MarketingAttributionPayload = {
  marketingSource: MarketingSource;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export type MarketingAttributionInput = {
  marketingSource?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
};

export type MarketingAttributionSignals = {
  sourceParam?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  referrer?: string | null;
};

const SOURCE_LABELS: Record<MarketingSource, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  WHATSAPP: "WhatsApp",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
  DIRECT: "Direct",
  OTHER: "Other",
};

const SOURCE_ALIASES: Record<string, MarketingSource> = {
  instagram: "INSTAGRAM",
  ig: "INSTAGRAM",
  insta: "INSTAGRAM",
  tiktok: "TIKTOK",
  tt: "TIKTOK",
  whatsapp: "WHATSAPP",
  wa: "WHATSAPP",
  whatsappstatus: "WHATSAPP",
  facebook: "FACEBOOK",
  fb: "FACEBOOK",
  meta: "FACEBOOK",
  google: "GOOGLE",
  gads: "GOOGLE",
  googleads: "GOOGLE",
  cpc: "GOOGLE",
  direct: "DIRECT",
  link: "DIRECT",
  linktree: "DIRECT",
};

const REFERRER_HOSTS: Array<{ pattern: RegExp; source: MarketingSource }> = [
  { pattern: /(^|\.)instagram\.com$/i, source: "INSTAGRAM" },
  { pattern: /(^|\.)tiktok\.com$/i, source: "TIKTOK" },
  { pattern: /(^|\.)facebook\.com$/i, source: "FACEBOOK" },
  { pattern: /(^|\.)fb\.com$/i, source: "FACEBOOK" },
  { pattern: /(^|\.)google\.[a-z.]+$/i, source: "GOOGLE" },
  { pattern: /(^|\.)googleadservices\.com$/i, source: "GOOGLE" },
];

function normalizeToken(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, "") ?? "";
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function hostFromReferrer(referrer: string | null | undefined) {
  if (!referrer) {
    return null;
  }

  try {
    return new URL(referrer).hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

function resolveFromReferrer(referrer: string | null | undefined): MarketingSource | null {
  const host = hostFromReferrer(referrer);
  if (!host) {
    return null;
  }

  for (const entry of REFERRER_HOSTS) {
    if (entry.pattern.test(host)) {
      return entry.source;
    }
  }

  return null;
}

function resolveFromToken(token: string): MarketingSource | null {
  if (!token) {
    return null;
  }

  if (SOURCE_ALIASES[token]) {
    return SOURCE_ALIASES[token];
  }

  for (const source of marketingSourceOptions) {
    if (token.includes(source.toLowerCase())) {
      return source;
    }
  }

  return null;
}

export function isMarketingSource(value: unknown): value is MarketingSource {
  return (
    typeof value === "string" &&
    marketingSourceOptions.includes(value as MarketingSource)
  );
}

export function getMarketingSourceLabel(source: MarketingSource) {
  return SOURCE_LABELS[source];
}

export function resolveMarketingSourceFromSignals(
  signals: MarketingAttributionSignals,
): MarketingSource {
  if (signals.gclid) {
    return "GOOGLE";
  }

  if (signals.fbclid) {
    return "FACEBOOK";
  }

  const tokens = [
    normalizeToken(signals.sourceParam),
    normalizeToken(signals.utmSource),
    normalizeToken(signals.utmMedium),
    normalizeToken(signals.utmCampaign),
  ].filter(Boolean);

  for (const token of tokens) {
    const resolved = resolveFromToken(token);
    if (resolved) {
      return resolved;
    }
  }

  const referrerSource = resolveFromReferrer(signals.referrer);
  if (referrerSource) {
    return referrerSource;
  }

  if (signals.referrer) {
    return "OTHER";
  }

  return "DIRECT";
}

export function buildMarketingAttributionFromSignals(
  signals: MarketingAttributionSignals,
): MarketingAttributionPayload {
  return {
    marketingSource: resolveMarketingSourceFromSignals(signals),
    utmSource: normalizeOptionalText(signals.utmSource, 120),
    utmMedium: normalizeOptionalText(signals.utmMedium, 120),
    utmCampaign: normalizeOptionalText(signals.utmCampaign, 191),
  };
}

export function normalizeMarketingAttributionInput(
  input: MarketingAttributionInput,
): MarketingAttributionPayload {
  if (isMarketingSource(input.marketingSource)) {
    return {
      marketingSource: input.marketingSource,
      utmSource: normalizeOptionalText(input.utmSource, 120),
      utmMedium: normalizeOptionalText(input.utmMedium, 120),
      utmCampaign: normalizeOptionalText(input.utmCampaign, 191),
    };
  }

  return buildMarketingAttributionFromSignals({
    sourceParam:
      typeof input.marketingSource === "string" ? input.marketingSource : null,
    utmSource:
      typeof input.utmSource === "string" ? input.utmSource : null,
    utmMedium:
      typeof input.utmMedium === "string" ? input.utmMedium : null,
    utmCampaign:
      typeof input.utmCampaign === "string" ? input.utmCampaign : null,
  });
}

export function readMarketingAttributionFromSearchParams(
  searchParams: URLSearchParams,
  referrer?: string | null,
): MarketingAttributionPayload {
  return buildMarketingAttributionFromSignals({
    sourceParam:
      searchParams.get("source") ??
      searchParams.get("ref") ??
      searchParams.get("utm_source"),
    utmSource: searchParams.get("utm_source"),
    utmMedium: searchParams.get("utm_medium"),
    utmCampaign: searchParams.get("utm_campaign"),
    gclid: searchParams.get("gclid"),
    fbclid: searchParams.get("fbclid"),
    referrer,
  });
}
