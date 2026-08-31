"use client";

import { useEffect, useState } from "react";

import {
  formatCountdownUnit,
  getCountdownSnapshot,
  type CountdownSnapshot,
} from "@/lib/countdown";
import { cn } from "@/lib/utils";

type RegistrationCountdownProps = {
  className?: string;
  compact?: boolean;
};

function CountdownUnit({
  value,
  label,
  compact,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "border border-border bg-background text-center",
        compact ? "px-3 py-3" : "px-3 py-4 sm:px-4 sm:py-5 xl:px-5 xl:py-6",
      )}
    >
      <p
        suppressHydrationWarning
        className={cn(
          "font-display font-extrabold tracking-tightest text-foreground",
          compact
            ? "text-2xl sm:text-3xl"
            : "text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 font-display font-semibold uppercase tracking-[0.24em] text-muted",
          compact ? "text-[10px]" : "text-[11px] sm:text-xs xl:text-sm",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function CountdownSkeleton({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const labels = ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <section
      className={cn(
        "border border-border bg-surface/80 shadow-subtle",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6 xl:p-8",
        className,
      )}
    >
      <p
        className={cn(
          "font-display font-semibold uppercase tracking-[0.28em] text-accent",
          compact ? "text-xs" : "text-xs sm:text-sm xl:text-base",
        )}
      >
        Registration opens in
      </p>
      <div
        className={cn(
          "mt-4 grid grid-cols-4 gap-3",
          compact ? "sm:gap-3" : "sm:mt-5 sm:gap-4",
        )}
      >
        {labels.map((label) => (
          <CountdownUnit key={label} value="--" label={label} compact={compact} />
        ))}
      </div>
    </section>
  );
}

export function RegistrationCountdown({
  className,
  compact = false,
}: RegistrationCountdownProps) {
  const [snapshot, setSnapshot] = useState<CountdownSnapshot | null>(null);

  useEffect(() => {
    function tick() {
      setSnapshot(getCountdownSnapshot());
    }

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (snapshot === null) {
    return <CountdownSkeleton className={className} compact={compact} />;
  }

  if (!snapshot.isVisible) {
    return null;
  }

  const units = [
    { value: formatCountdownUnit(snapshot.days), label: "Days" },
    { value: formatCountdownUnit(snapshot.hours), label: "Hours" },
    { value: formatCountdownUnit(snapshot.minutes), label: "Minutes" },
    { value: formatCountdownUnit(snapshot.seconds), label: "Seconds" },
  ];

  return (
    <section
      aria-live="polite"
      className={cn(
        "border border-border bg-surface/80 shadow-subtle",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6 xl:p-8",
        className,
      )}
    >
      <p
        className={cn(
          "font-display font-semibold uppercase tracking-[0.28em] text-accent",
          compact ? "text-xs" : "text-xs sm:text-sm xl:text-base",
        )}
      >
        {snapshot.heading}
      </p>

      <div
        className={cn(
          "mt-4 grid grid-cols-4 gap-3",
          compact ? "sm:gap-3" : "sm:mt-5 sm:gap-4",
        )}
      >
        {units.map((unit) => (
          <CountdownUnit
            key={unit.label}
            value={unit.value}
            label={unit.label}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
