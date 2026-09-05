export type AnalyticsRange = '6h' | '12h' | '24h' | '48h' | '7d' | '14d' | '30d';

export type AnalyticsRangeOption = {
    value: AnalyticsRange;
    label: string;
    short: string;
};

export type AnalyticsSummary = {
    registrations: number;
    paid: number;
    pending: number;
    failed: number;
    revenue: number;
    conversionRate: number | null;
};

export type AnalyticsPoint = {
    key: string;
    label: string;
    fullLabel: string;
    registrations: number;
    paid: number;
    pending: number;
    failed: number;
    revenue: number;
};

export type RegistrationAnalyticsData = {
    range: AnalyticsRange;
    startDate: string;
    endDate: string;
    timezone: string;
    summary: AnalyticsSummary;
    series: AnalyticsPoint[];
    ranges: AnalyticsRangeOption[];
    generatedAt: string;
};

export const CHART_COLORS = {
    registrations: '#d4d4d8',
    paid: '#e8ff47',
    pending: '#a8a29e',
    failed: '#f87171',
} as const;
