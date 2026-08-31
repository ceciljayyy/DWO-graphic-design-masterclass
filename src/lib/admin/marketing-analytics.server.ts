import "server-only";

import {
  getMarketingSourceLabel,
  marketingSourceOptions,
  type MarketingSource,
} from "@/lib/marketing-attribution";
import { getPrismaClient } from "@/lib/prisma";

export type MarketingSourceStat = {
  source: MarketingSource;
  label: string;
  registrations: number;
  paid: number;
  conversionRate: number | null;
};

export async function getMarketingSourceAnalytics(): Promise<MarketingSourceStat[]> {
  const prisma = getPrismaClient();

  const grouped = await prisma.registration.groupBy({
    by: ["marketingSource"],
    _count: { _all: true },
  });

  const paidGrouped = await prisma.registration.groupBy({
    by: ["marketingSource"],
    where: { paymentStatus: "PAID" },
    _count: { _all: true },
  });

  const paidBySource = new Map(
    paidGrouped.map((row) => [row.marketingSource, row._count._all]),
  );

  const stats = new Map<MarketingSource, MarketingSourceStat>();

  for (const source of marketingSourceOptions) {
    stats.set(source, {
      source,
      label: getMarketingSourceLabel(source),
      registrations: 0,
      paid: 0,
      conversionRate: null,
    });
  }

  let unattributedRegistrations = 0;
  let unattributedPaid = 0;

  for (const row of grouped) {
    const registrations = row._count._all;
    const paid = paidBySource.get(row.marketingSource) ?? 0;

    if (row.marketingSource && stats.has(row.marketingSource)) {
      const entry = stats.get(row.marketingSource)!;
      entry.registrations += registrations;
      entry.paid += paid;
      continue;
    }

    unattributedRegistrations += registrations;
    unattributedPaid += paid;
  }

  if (unattributedRegistrations > 0) {
    const direct = stats.get("DIRECT")!;
    direct.registrations += unattributedRegistrations;
    direct.paid += unattributedPaid;
  }

  const primarySources: MarketingSource[] = [
    "INSTAGRAM",
    "TIKTOK",
    "WHATSAPP",
    "FACEBOOK",
    "GOOGLE",
    "DIRECT",
  ];

  const orderedSources = [...primarySources];
  const other = stats.get("OTHER")!;

  if (other.registrations > 0 || other.paid > 0) {
    orderedSources.push("OTHER");
  }

  return orderedSources
    .map((source) => {
      const entry = stats.get(source)!;
      return {
        ...entry,
        conversionRate:
          entry.registrations === 0
            ? null
            : Math.round((entry.paid / entry.registrations) * 1000) / 10,
      };
    })
    .sort((left, right) => {
      if (right.paid !== left.paid) {
        return right.paid - left.paid;
      }

      return right.registrations - left.registrations;
    });
}
