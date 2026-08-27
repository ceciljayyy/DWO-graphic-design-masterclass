"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { RegistrationAnalyticsChart } from "@/components/admin/RegistrationAnalyticsChart";
import {
  ANALYTICS_RANGES,
  parseAnalyticsRange,
  type AnalyticsRange,
  type RegistrationAnalytics,
} from "@/lib/admin/analytics";
import { cn } from "@/lib/utils";

type RegistrationAnalyticsProps = {
  initialData: RegistrationAnalytics;
};

function formatUpdatedAt(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Accra",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function RegistrationAnalyticsPanel({
  initialData,
}: RegistrationAnalyticsProps) {
  const [range, setRange] = useState<AnalyticsRange>(
    parseAnalyticsRange(initialData.range),
  );
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const skipNextFetch = useRef(true);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    let cancelled = false;

    async function load() {
      setIsFetching(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/admin/analytics?range=${encodeURIComponent(range)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as
          | { success: true; data: RegistrationAnalytics }
          | { success: false; error?: { message?: string } };

        if (cancelled) {
          return;
        }

        if (!response.ok || payload.success === false) {
          setError(
            payload.success === false
              ? payload.error?.message || "Unable to load analytics."
              : "Unable to load analytics.",
          );
          return;
        }

        startTransition(() => {
          setData(payload.data);
        });
      } catch {
        if (!cancelled) {
          setError("Unable to load analytics. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [range]);

  const loading = isFetching || isPending;
  const hasActivity =
    data.summary.registrations > 0 ||
    data.summary.paid > 0 ||
    data.summary.pending > 0 ||
    data.summary.failed > 0;

  async function handleRetry() {
    setError(null);
    setIsFetching(true);

    try {
      const response = await fetch(
        `/api/admin/analytics?range=${encodeURIComponent(range)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as
        | { success: true; data: RegistrationAnalytics }
        | { success: false; error?: { message?: string } };

      if (!response.ok || payload.success === false) {
        setError(
          payload.success === false
            ? payload.error?.message || "Unable to load analytics."
            : "Unable to load analytics.",
        );
        return;
      }

      setData(payload.data);
    } catch {
      setError("Unable to load analytics. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <section className="border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Registration activity
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            New registrations and completed payments over the selected period (
            {data.rangeLabel}).
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <label className="sr-only" htmlFor="analytics-range">
            Analytics period
          </label>
          <select
            id="analytics-range"
            value={range}
            onChange={(event) =>
              setRange(parseAnalyticsRange(event.target.value))
            }
            className="min-h-11 w-full rounded-sm border border-border bg-background px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground outline-none focus:border-accent lg:hidden"
          >
            {ANALYTICS_RANGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div
            role="group"
            aria-label="Analytics period"
            className="hidden flex-wrap gap-1.5 lg:flex"
          >
            {ANALYTICS_RANGES.map((item) => {
              const active = item.value === range;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRange(item.value)}
                  className={cn(
                    "min-h-10 rounded-sm border px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background text-muted hover:border-accent hover:text-accent",
                  )}
                >
                  {item.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          {
            label: "Registrations",
            value: String(data.summary.registrations),
          },
          { label: "Paid", value: String(data.summary.paid) },
          { label: "Pending", value: String(data.summary.pending) },
          { label: "Failed", value: String(data.summary.failed) },
          {
            label: "Conversion",
            value:
              data.summary.conversionRate === null
                ? "—"
                : `${data.summary.conversionRate}%`,
          },
          { label: "Revenue", value: data.summary.revenueDisplay },
        ].map((item) => (
          <article
            key={item.label}
            className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4"
          >
            <p className="font-display text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-muted sm:text-[11px] sm:tracking-[0.14em]">
              {item.label}
            </p>
            <p className="mt-2 break-words font-display text-xl font-extrabold tracking-tightest text-foreground">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      <div className="relative mt-6">
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/70">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Updating analytics…
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-border bg-background px-4 text-center sm:min-h-[320px]">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Unable to load analytics
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground hover:border-accent hover:text-accent"
            >
              Try again
            </button>
          </div>
        ) : !hasActivity ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center border border-border bg-background px-4 text-center sm:min-h-[320px]">
            <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
              No activity
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              There were no registrations or payments during this period.
            </p>
          </div>
        ) : (
          <RegistrationAnalyticsChart series={data.series} />
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Updated {formatUpdatedAt(data.generatedAt)} · Africa/Accra
      </p>
    </section>
  );
}

export { RegistrationAnalyticsPanel as RegistrationAnalytics };
