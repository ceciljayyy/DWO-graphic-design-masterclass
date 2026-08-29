import "server-only";

import { registrationFee } from "@/lib/masterclass";
import { getPrismaClient } from "@/lib/prisma";
import {
  getAnalyticsRangeMeta,
  parseAnalyticsRange,
  type AnalyticsPoint,
  type AnalyticsRange,
  type RegistrationAnalytics,
} from "@/lib/admin/analytics";

type BucketConfig = {
  stepMs: number;
  label: (date: Date) => string;
};

const ACCRA_TZ = "Africa/Accra";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

function formatInAccra(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ACCRA_TZ,
    ...options,
  }).format(date);
}

function dayLabel(date: Date) {
  return formatInAccra(date, { day: "numeric", month: "short" });
}

function getFixedRangeStart(
  range: Exclude<AnalyticsRange, "all">,
  end: Date,
): { start: Date; config: BucketConfig } {
  switch (range) {
    case "6h":
      return {
        start: new Date(end.getTime() - 6 * HOUR_MS),
        config: {
          stepMs: HOUR_MS,
          label: (date) =>
            formatInAccra(date, {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            }),
        },
      };
    case "12h":
      return {
        start: new Date(end.getTime() - 12 * HOUR_MS),
        config: {
          stepMs: HOUR_MS,
          label: (date) =>
            formatInAccra(date, {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            }),
        },
      };
    case "24h":
      return {
        start: new Date(end.getTime() - 24 * HOUR_MS),
        config: {
          stepMs: HOUR_MS,
          label: (date) =>
            formatInAccra(date, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
        },
      };
    case "48h":
      return {
        start: new Date(end.getTime() - 48 * HOUR_MS),
        config: {
          stepMs: 3 * HOUR_MS,
          label: (date) =>
            formatInAccra(date, {
              day: "numeric",
              month: "short",
              hour: "numeric",
              hour12: true,
            }),
        },
      };
    case "7d":
      return {
        start: new Date(end.getTime() - 7 * DAY_MS),
        config: { stepMs: DAY_MS, label: dayLabel },
      };
    case "14d":
      return {
        start: new Date(end.getTime() - 14 * DAY_MS),
        config: { stepMs: DAY_MS, label: dayLabel },
      };
    case "30d":
      return {
        start: new Date(end.getTime() - 30 * DAY_MS),
        config: { stepMs: DAY_MS, label: dayLabel },
      };
    default: {
      const exhaustive: never = range;
      return exhaustive;
    }
  }
}

function getAllTimeBucketConfig(start: Date, end: Date): BucketConfig {
  const span = Math.max(end.getTime() - start.getTime(), DAY_MS);

  if (span <= 2 * DAY_MS) {
    return {
      stepMs: HOUR_MS,
      label: (date) =>
        formatInAccra(date, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
    };
  }

  if (span <= 90 * DAY_MS) {
    return { stepMs: DAY_MS, label: dayLabel };
  }

  return {
    stepMs: WEEK_MS,
    label: (date) => dayLabel(date),
  };
}

function floorToStep(date: Date, stepMs: number) {
  return new Date(Math.floor(date.getTime() / stepMs) * stepMs);
}

function inRange(date: Date, start: Date, end: Date) {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function buildEmptyBuckets(
  start: Date,
  end: Date,
  config: BucketConfig,
): AnalyticsPoint[] {
  const buckets: AnalyticsPoint[] = [];
  let cursor = floorToStep(start, config.stepMs).getTime();

  // Include the partial first bucket so early-range events are not dropped.
  if (cursor + config.stepMs <= start.getTime()) {
    cursor += config.stepMs;
  }

  for (; cursor < end.getTime(); cursor += config.stepMs) {
    const pointDate = new Date(cursor);
    buckets.push({
      key: pointDate.toISOString(),
      label: config.label(pointDate),
      registrations: 0,
      paid: 0,
      pending: 0,
      failed: 0,
      revenue: 0,
    });
  }

  return buckets;
}

function findBucketIndex(
  buckets: AnalyticsPoint[],
  eventAt: Date,
  stepMs: number,
) {
  if (buckets.length === 0) {
    return -1;
  }

  const eventTime = eventAt.getTime();
  const first = new Date(buckets[0].key).getTime();
  const last = new Date(buckets[buckets.length - 1].key).getTime();

  if (eventTime < first) {
    return 0;
  }

  if (eventTime >= last + stepMs) {
    return buckets.length - 1;
  }

  const bucketStart = floorToStep(eventAt, stepMs).getTime();

  for (let index = 0; index < buckets.length; index += 1) {
    const current = new Date(buckets[index].key).getTime();
    const next =
      index + 1 < buckets.length
        ? new Date(buckets[index + 1].key).getTime()
        : current + stepMs;

    if (bucketStart >= current && bucketStart < next) {
      return index;
    }

    if (eventTime >= current && eventTime < next) {
      return index;
    }
  }

  return -1;
}

export async function getRegistrationAnalytics(
  rangeInput: AnalyticsRange = "14d",
): Promise<RegistrationAnalytics> {
  const range = parseAnalyticsRange(rangeInput);
  const end = new Date();
  const prisma = getPrismaClient();

  let start: Date;
  let config: BucketConfig;

  if (range === "all") {
    // Placeholder until we know the earliest activity from the full dataset.
    start = new Date(end.getTime() - DAY_MS);
    config = getAllTimeBucketConfig(start, end);
  } else {
    const fixed = getFixedRangeStart(range, end);
    start = fixed.start;
    config = fixed.config;
  }

  const rows = await prisma.registration.findMany({
    where:
      range === "all"
        ? undefined
        : {
            OR: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                paidAt: {
                  gte: start,
                  lte: end,
                },
              },
            ],
          },
    select: {
      createdAt: true,
      paidAt: true,
      paymentStatus: true,
      amount: true,
    },
    orderBy: { createdAt: "asc" },
  });

  if (range === "all") {
    if (rows.length === 0) {
      start = new Date(end.getTime() - DAY_MS);
    } else {
      let earliest = rows[0].createdAt.getTime();
      for (const row of rows) {
        earliest = Math.min(earliest, row.createdAt.getTime());
        if (row.paidAt) {
          earliest = Math.min(earliest, row.paidAt.getTime());
        }
      }
      start = new Date(earliest);
    }
    config = getAllTimeBucketConfig(start, end);
  }

  const series = buildEmptyBuckets(start, end, config);

  let registrations = 0;
  let paid = 0;
  let pending = 0;
  let failed = 0;
  let revenue = 0;
  let paidAmongCreated = 0;

  for (const row of rows) {
    const createdInRange = inRange(row.createdAt, start, end);
    const paidAt = row.paidAt;
    const paidInRange =
      row.paymentStatus === "PAID" &&
      paidAt != null &&
      inRange(paidAt, start, end);
    const paidFallbackInRange =
      row.paymentStatus === "PAID" &&
      paidAt == null &&
      createdInRange;

    if (createdInRange) {
      registrations += 1;

      const createdIndex = findBucketIndex(series, row.createdAt, config.stepMs);
      if (createdIndex >= 0) {
        const point = series[createdIndex];
        point.registrations += 1;

        if (row.paymentStatus === "PENDING") {
          point.pending += 1;
          pending += 1;
        } else if (row.paymentStatus === "FAILED") {
          point.failed += 1;
          failed += 1;
        } else if (row.paymentStatus === "PAID") {
          paidAmongCreated += 1;
        }
      } else if (row.paymentStatus === "PENDING") {
        pending += 1;
      } else if (row.paymentStatus === "FAILED") {
        failed += 1;
      } else if (row.paymentStatus === "PAID") {
        paidAmongCreated += 1;
      }
    }

    if (paidInRange || paidFallbackInRange) {
      paid += 1;
      const amount = Number(row.amount);
      const paymentTime = paidAt ?? row.createdAt;
      const paidIndex = findBucketIndex(series, paymentTime, config.stepMs);

      if (paidIndex >= 0) {
        series[paidIndex].paid += 1;
        if (Number.isFinite(amount)) {
          series[paidIndex].revenue += amount;
        }
      }

      if (Number.isFinite(amount)) {
        revenue += amount;
      }
    }
  }

  const conversionRate =
    registrations === 0
      ? null
      : Math.round((paidAmongCreated / registrations) * 1000) / 10;

  return {
    range,
    rangeLabel: getAnalyticsRangeMeta(range).label,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    generatedAt: new Date().toISOString(),
    summary: {
      registrations,
      paid,
      pending,
      failed,
      revenue,
      revenueDisplay: `${registrationFee.currency} ${revenue.toLocaleString(
        "en-GH",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      )}`,
      conversionRate,
    },
    series,
  };
}
