"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnalyticsPoint } from "@/lib/admin/analytics";

const SERIES = [
  {
    key: "registrations",
    label: "Registrations",
    color: "var(--foreground)",
    fillOpacity: 0.08,
  },
  {
    key: "paid",
    label: "Paid",
    color: "var(--accent)",
    fillOpacity: 0.16,
  },
  {
    key: "pending",
    label: "Pending",
    color: "var(--muted)",
    fillOpacity: 0.1,
  },
  {
    key: "failed",
    label: "Failed",
    color: "var(--red)",
    fillOpacity: 0.12,
  },
] as const;

type ChartTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    dataKey?: string | number;
    name?: string;
    value?: number;
    color?: string;
    payload?: AnalyticsPoint;
  }>;
};

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="min-w-[11rem] border border-border bg-surface px-3 py-3 shadow-subtle">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        {label}
      </p>
      <dl className="mt-3 space-y-1.5 text-sm">
        {SERIES.map((series) => {
          const value = point
            ? Number(point[series.key as keyof AnalyticsPoint] ?? 0)
            : 0;

          return (
            <div key={series.key} className="flex items-center justify-between gap-6">
              <dt className="flex items-center gap-2 text-muted">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </dt>
              <dd className="font-medium text-foreground">{value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

type RegistrationAnalyticsChartProps = {
  series: AnalyticsPoint[];
};

export function RegistrationAnalyticsChart({
  series,
}: RegistrationAnalyticsChartProps) {
  return (
    <div className="h-[280px] w-full sm:h-[320px] lg:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={series}
          margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: 12,
              color: "var(--muted)",
              paddingTop: 8,
            }}
          />
          {SERIES.map((seriesItem) => (
            <Area
              key={seriesItem.key}
              type="monotone"
              dataKey={seriesItem.key}
              name={seriesItem.label}
              stroke={seriesItem.color}
              fill={seriesItem.color}
              fillOpacity={seriesItem.fillOpacity}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive
              animationDuration={450}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
