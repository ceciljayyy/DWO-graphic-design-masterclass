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
  durationMs: number;
  stepMs: number;
  label: (date: Date) => string;
};

const ACCRA_TZ = "Africa/Accra";

function formatInAccra(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ACCRA_TZ,
    ...options,
  }).format(date);
}

function getRangeConfig(range: AnalyticsRange): BucketConfig {
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  switch (range) {
    case "6h":
      return {
        durationMs: 6 * hour,
        stepMs: hour,
        label: (date) =>
          formatInAccra(date, {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          }),
      };
    case "12h":
      return {
        durationMs: 12 * hour,
        stepMs: hour,
        label: (date) =>
          formatInAccra(date, {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          }),
      };
    case "24h":
      return {
        durationMs: 24 * hour,
        stepMs: hour,
        label: (date) =>
          formatInAccra(date, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      };
    case "48h":
      return {
        durationMs: 48 * hour,
        stepMs: 3 * hour,
        label: (date) =>
          formatInAccra(date, {
            day: "numeric",
            month: "short",
            hour: "numeric",
            hour12: true,
          }),
      };
    case "7d":
      return {
        durationMs: 7 * day,
        stepMs: day,
        label: (date) =>
          formatInAccra(date, { day: "numeric", month: "short" }),
      };
    case "14d":
      return {
        durationMs: 14 * day,
        stepMs: day,
        label: (date) =>
          formatInAccra(date, { day: "numeric", month: "short" }),
      };
    case "30d":
      return {
        durationMs: 30 * day,
        stepMs: day,
        label: (date) =>
          formatInAccra(date, { day: "numeric", month: "short" }),
      };
    default: {
      const exhaustive: never = range;
      return exhaustive;
    }
  }
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
  const config = getRangeConfig(range);
  const end = new Date();
  const start = new Date(end.getTime() - config.durationMs);
  const prisma = getPrismaClient();

  // Include registrations created in-range OR paid in-range.
  // Pending→paid later would otherwise vanish from short windows like 6h.
  const rows = await prisma.registration.findMany({
    where: {
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
