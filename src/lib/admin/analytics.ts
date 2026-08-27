export const ANALYTICS_RANGES = [
  { value: "6h", label: "6 hours", shortLabel: "6H" },
  { value: "12h", label: "12 hours", shortLabel: "12H" },
  { value: "24h", label: "24 hours", shortLabel: "24H" },
  { value: "48h", label: "48 hours", shortLabel: "48H" },
  { value: "7d", label: "1 week", shortLabel: "1W" },
  { value: "14d", label: "14 days", shortLabel: "14D" },
  { value: "30d", label: "1 month", shortLabel: "1M" },
] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]["value"];

export const DEFAULT_ANALYTICS_RANGE: AnalyticsRange = "14d";

export type AnalyticsSummary = {
  registrations: number;
  paid: number;
  pending: number;
  failed: number;
  revenue: number;
  revenueDisplay: string;
  conversionRate: number | null;
};

export type AnalyticsPoint = {
  key: string;
  label: string;
  registrations: number;
  paid: number;
  pending: number;
  failed: number;
  revenue: number;
};

export type RegistrationAnalytics = {
  range: AnalyticsRange;
  rangeLabel: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  summary: AnalyticsSummary;
  series: AnalyticsPoint[];
};

export function isAnalyticsRange(value: unknown): value is AnalyticsRange {
  return (
    typeof value === "string" &&
    ANALYTICS_RANGES.some((item) => item.value === value)
  );
}

export function parseAnalyticsRange(value: unknown): AnalyticsRange {
  return isAnalyticsRange(value) ? value : DEFAULT_ANALYTICS_RANGE;
}

export function getAnalyticsRangeMeta(range: AnalyticsRange) {
  return (
    ANALYTICS_RANGES.find((item) => item.value === range) ??
    ANALYTICS_RANGES.find((item) => item.value === DEFAULT_ANALYTICS_RANGE)!
  );
}
