import { Prisma, type ExperienceLevel, type PaymentStatus } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";
import { registrationFee } from "@/lib/masterclass";
import { formatMarketingSource as formatMarketingSourceLabel } from "@/lib/admin/format";

export type RegistrationSort = "newest" | "oldest" | "amount_desc" | "amount_asc";

export type RegistrationListQuery = {
  q?: string;
  paymentStatus?: PaymentStatus | "ALL";
  experienceLevel?: ExperienceLevel | "ALL";
  dateRange?: "ALL" | "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS";
  sort?: RegistrationSort;
  page?: number;
  pageSize?: number;
};

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function buildWhere(query: RegistrationListQuery): Prisma.RegistrationWhereInput {
  const where: Prisma.RegistrationWhereInput = {};

  if (query.paymentStatus && query.paymentStatus !== "ALL") {
    where.paymentStatus = query.paymentStatus;
  }

  if (query.experienceLevel && query.experienceLevel !== "ALL") {
    where.experienceLevel = query.experienceLevel;
  }

  const search = query.q?.trim();
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { whatsapp: { contains: search } },
      { registrationReference: { contains: search } },
    ];
  }

  if (query.dateRange && query.dateRange !== "ALL") {
    const now = new Date();
    let from = startOfUtcDay(now);

    if (query.dateRange === "LAST_7_DAYS") {
      from = new Date(from.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else if (query.dateRange === "LAST_30_DAYS") {
      from = new Date(from.getTime() - 29 * 24 * 60 * 60 * 1000);
    }

    where.createdAt = { gte: from };
  }

  return where;
}

function buildOrderBy(
  sort: RegistrationSort = "newest",
): Prisma.RegistrationOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "amount_desc":
      return { amount: "desc" };
    case "amount_asc":
      return { amount: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export function parseRegistrationListQuery(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): RegistrationListQuery {
  const get = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }

    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const paymentStatus = get("paymentStatus");
  const experienceLevel = get("experienceLevel");
  const dateRange = get("dateRange");
  const sort = get("sort");
  const page = Number(get("page") ?? "1");
  const pageSize = Number(get("pageSize") ?? "25");

  return {
    q: get("q")?.trim() || undefined,
    paymentStatus:
      paymentStatus === "PAID" ||
      paymentStatus === "PENDING" ||
      paymentStatus === "FAILED" ||
      paymentStatus === "PAYMENT_SUBMITTED" ||
      paymentStatus === "PAYMENT_REJECTED"
        ? paymentStatus
        : "ALL",
    experienceLevel:
      experienceLevel === "BEGINNER" ||
      experienceLevel === "INTERMEDIATE" ||
      experienceLevel === "ADVANCED"
        ? experienceLevel
        : "ALL",
    dateRange:
      dateRange === "TODAY" ||
      dateRange === "LAST_7_DAYS" ||
      dateRange === "LAST_30_DAYS"
        ? dateRange
        : "ALL",
    sort:
      sort === "oldest" ||
      sort === "amount_desc" ||
      sort === "amount_asc" ||
      sort === "newest"
        ? sort
        : "newest",
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    pageSize:
      pageSize === 20 || pageSize === 25 || pageSize === 50 ? pageSize : 25,
  };
}

export async function listRegistrations(query: RegistrationListQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 25;
  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);
  const prisma = getPrismaClient();

  const [total, items] = await Promise.all([
    prisma.registration.count({ where }),
    prisma.registration.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        registrationReference: true,
        fullName: true,
        email: true,
        phone: true,
        whatsapp: true,
        experienceLevel: true,
        paymentStatus: true,
        amount: true,
        marketingSource: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      amount: item.amount.toString(),
      marketingSourceLabel: formatMarketingSourceLabel(item.marketingSource),
      createdAt: item.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listPaymentApprovals() {
  const prisma = getPrismaClient();

  const [awaitingReview, recentlyPaid] = await Promise.all([
    prisma.registration.findMany({
      where: { paymentStatus: "PAYMENT_SUBMITTED" },
      orderBy: { updatedAt: "asc" },
      include: {
        manualPaymentSubmissions: {
          where: { isActive: true },
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.registration.findMany({
      where: {
        paymentStatus: "PAID",
        paidAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { paidAt: "desc" },
      take: 40,
      select: {
        id: true,
        registrationReference: true,
        fullName: true,
        whatsapp: true,
        amount: true,
        paidAt: true,
      },
    }),
  ]);

  return {
    awaitingReview: awaitingReview.map((registration) => {
      const submission = registration.manualPaymentSubmissions[0] ?? null;
      return {
        id: registration.id,
        registrationReference: registration.registrationReference,
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        whatsapp: registration.whatsapp,
        paymentStatus: registration.paymentStatus,
        amountDisplay: `${registrationFee.currency} ${Number(registration.amount).toFixed(2)}`,
        createdAt: registration.createdAt.toISOString(),
        updatedAt: registration.updatedAt.toISOString(),
        submission: submission
          ? {
              id: submission.id,
              method: submission.method,
              methodLabel:
                submission.method === "MTN_MOBILE_MONEY"
                  ? "MTN Mobile Money"
                  : submission.method,
              amountDisplay: `${submission.currency} ${Number(submission.amount).toFixed(2)}`,
              senderName: submission.senderName,
              senderPhone: submission.senderPhone,
              transactionReference: submission.transactionReference,
              paymentDateTime: submission.paymentDateTime.toISOString(),
              submittedAt: submission.submittedAt.toISOString(),
              reviewedAt: submission.reviewedAt?.toISOString() ?? null,
              adminNote: submission.adminNote,
            }
          : null,
      };
    }),
    recentlyPaid: recentlyPaid.map((item) => ({
      id: item.id,
      registrationReference: item.registrationReference,
      fullName: item.fullName,
      whatsapp: item.whatsapp,
      amountDisplay: `${registrationFee.currency} ${Number(item.amount).toFixed(2)}`,
      paidAt: item.paidAt?.toISOString() ?? null,
    })),
  };
}

export async function getRegistrationById(id: string) {
  const registration = await getPrismaClient().registration.findUnique({
    where: { id },
    include: {
      manualPaymentSubmissions: {
        where: { isActive: true },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!registration) {
    return null;
  }

  const activeSubmission = registration.manualPaymentSubmissions[0] ?? null;

  return {
    id: registration.id,
    registrationReference: registration.registrationReference,
    fullName: registration.fullName,
    email: registration.email,
    phone: registration.phone,
    whatsapp: registration.whatsapp,
    location: registration.location,
    experienceLevel: registration.experienceLevel,
    paymentStatus: registration.paymentStatus,
    amount: registration.amount.toString(),
    amountDisplay: `${registrationFee.currency} ${Number(registration.amount).toFixed(2)}`,
    paystackReference: registration.paystackReference,
    paidAt: registration.paidAt?.toISOString() ?? null,
    confirmationEmailSentAt:
      registration.confirmationEmailSentAt?.toISOString() ?? null,
    welcomeEmailSentAt: registration.welcomeEmailSentAt?.toISOString() ?? null,
    paymentReminderEmailSentAt:
      registration.paymentReminderEmailSentAt?.toISOString() ?? null,
    marketingSource: registration.marketingSource,
    marketingSourceLabel: formatMarketingSourceLabel(registration.marketingSource),
    utmSource: registration.utmSource,
    utmMedium: registration.utmMedium,
    utmCampaign: registration.utmCampaign,
    createdAt: registration.createdAt.toISOString(),
    updatedAt: registration.updatedAt.toISOString(),
    activeManualPayment: activeSubmission
      ? {
          id: activeSubmission.id,
          method: activeSubmission.method,
          methodLabel:
            activeSubmission.method === "MTN_MOBILE_MONEY"
              ? "MTN Mobile Money"
              : activeSubmission.method,
          amountDisplay: `${activeSubmission.currency} ${Number(activeSubmission.amount).toFixed(2)}`,
          senderName: activeSubmission.senderName,
          senderPhone: activeSubmission.senderPhone,
          transactionReference: activeSubmission.transactionReference,
          paymentDateTime: activeSubmission.paymentDateTime.toISOString(),
          submittedAt: activeSubmission.submittedAt.toISOString(),
          reviewedAt: activeSubmission.reviewedAt?.toISOString() ?? null,
          adminNote: activeSubmission.adminNote,
        }
      : null,
  };
}

export async function getDashboardAnalytics() {
  const prisma = getPrismaClient();

  const [
    totalRegistrations,
    paidRegistrations,
    pendingRegistrations,
    submittedRegistrations,
    failedRegistrations,
    rejectedRegistrations,
    revenueAggregate,
    latestRegistrations,
    recentPaid,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { paymentStatus: "PAID" } }),
    prisma.registration.count({ where: { paymentStatus: "PENDING" } }),
    prisma.registration.count({ where: { paymentStatus: "PAYMENT_SUBMITTED" } }),
    prisma.registration.count({ where: { paymentStatus: "FAILED" } }),
    prisma.registration.count({ where: { paymentStatus: "PAYMENT_REJECTED" } }),
    prisma.registration.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true },
    }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        registrationReference: true,
        fullName: true,
        paymentStatus: true,
        amount: true,
        createdAt: true,
      },
    }),
    prisma.registration.findMany({
      where: { paymentStatus: "PAID" },
      orderBy: { paidAt: "desc" },
      take: 5,
      select: {
        id: true,
        registrationReference: true,
        fullName: true,
        amount: true,
        paidAt: true,
      },
    }),
  ]);

  const revenue = Number(revenueAggregate._sum.amount ?? 0);

  return {
    totals: {
      totalRegistrations,
      paidRegistrations,
      pendingRegistrations,
      submittedRegistrations,
      failedRegistrations,
      rejectedRegistrations,
      revenue,
      revenueDisplay: `${registrationFee.currency} ${revenue.toFixed(2)}`,
    },
    paymentBreakdown: [
      { status: "PAID" as const, count: paidRegistrations },
      { status: "PENDING" as const, count: pendingRegistrations },
      { status: "PAYMENT_SUBMITTED" as const, count: submittedRegistrations },
      { status: "FAILED" as const, count: failedRegistrations },
      { status: "PAYMENT_REJECTED" as const, count: rejectedRegistrations },
    ],
    latestRegistrations: latestRegistrations.map((item) => ({
      ...item,
      amount: item.amount.toString(),
      createdAt: item.createdAt.toISOString(),
    })),
    recentPaid: recentPaid.map((item) => ({
      ...item,
      amount: item.amount.toString(),
      paidAt: item.paidAt?.toISOString() ?? null,
    })),
  };
}

export function buildRegistrationWhereForExport(query: RegistrationListQuery) {
  return buildWhere(query);
}
