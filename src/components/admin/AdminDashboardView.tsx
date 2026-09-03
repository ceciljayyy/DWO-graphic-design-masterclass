import Link from "next/link";

import { MarketingSourceBreakdown } from "@/components/admin/MarketingSourceBreakdown";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { RegistrationAnalytics } from "@/components/admin/RegistrationAnalytics";
import { formatAdminDate, formatAmountDisplay } from "@/lib/admin/format";
import type { RegistrationAnalytics as RegistrationAnalyticsData } from "@/lib/admin/analytics";
import type { MarketingSourceStat } from "@/lib/admin/marketing-analytics.server";
import { masterclass } from "@/lib/masterclass";
import { cn } from "@/lib/utils";

type DashboardData = Awaited<
  ReturnType<typeof import("@/lib/admin/registrations").getDashboardAnalytics>
>;

export function AdminDashboardView({
  data,
  analytics,
  marketingSources,
}: {
  data: DashboardData;
  analytics: RegistrationAnalyticsData;
  marketingSources: MarketingSourceStat[];
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest">
            Registration overview
          </h1>
        </div>
        <Link
          href="/admin"
          className="rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-muted hover:border-accent hover:text-accent"
        >
          Refresh
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {[
          {
            label: "Total Registrations",
            value: String(data.totals.totalRegistrations),
            href: "/admin/registrations",
          },
          {
            label: "Paid Registrations",
            value: String(data.totals.paidRegistrations),
            href: "/admin/registrations?paymentStatus=PAID",
          },
          {
            label: "Pending Payments",
            value: String(data.totals.pendingRegistrations),
            href: "/admin/registrations?paymentStatus=PENDING",
          },
          {
            label: "Awaiting Approval",
            value: String(data.totals.submittedRegistrations),
            href: "/admin/payments",
            highlight: data.totals.submittedRegistrations > 0,
          },
          {
            label: "Rejected / Failed",
            value: String(
              data.totals.failedRegistrations + data.totals.rejectedRegistrations,
            ),
            href: "/admin/registrations?paymentStatus=PAYMENT_REJECTED",
          },
          {
            label: "Total Revenue",
            value: data.totals.revenueDisplay,
            href: "/admin/payments",
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={cn(
              "border bg-surface p-5 transition-colors hover:border-accent",
              "highlight" in card && card.highlight
                ? "border-accent/50 shadow-[0_0_24px_rgba(244,185,66,0.08)]"
                : "border-border",
            )}
          >
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              {card.label}
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-tightest text-foreground">
              {card.value}
            </p>
            {"highlight" in card && card.highlight ? (
              <p className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                Review now →
              </p>
            ) : null}
          </Link>
        ))}
      </div>

      {data.totals.submittedRegistrations > 0 ? (
        <aside className="relative overflow-hidden border-2 border-accent/45 bg-accent/10 p-5">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5 bg-accent"
          />
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.22em] text-accent">
            Action needed
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            <strong>{data.totals.submittedRegistrations}</strong> payment
            {data.totals.submittedRegistrations === 1 ? "" : "s"} waiting for
            manual verification.
          </p>
          <Link
            href="/admin/payments"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Open payment approvals
          </Link>
          <Link
            href="/admin/whatsapp-contacts"
            className="mt-3 ml-0 inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-accent hover:text-accent sm:ml-3"
          >
            Paid WhatsApp contacts
          </Link>
        </aside>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <RegistrationAnalytics initialData={analytics} />

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Payment breakdown
          </h2>
          <div className="mt-5 space-y-3">
            {data.paymentBreakdown.map((item) => {
              const total = Math.max(1, data.totals.totalRegistrations);
              const width = (item.count / total) * 100;

              return (
                <div key={item.status}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <PaymentStatusBadge status={item.status} />
                    <span className="text-sm text-muted">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-sm bg-background">
                    <div
                      className={cn(
                        "h-2 rounded-sm",
                        item.status === "PAID"
                          ? "bg-accent"
                          : item.status === "FAILED" ||
                              item.status === "PAYMENT_REJECTED"
                            ? "bg-red"
                            : item.status === "PAYMENT_SUBMITTED"
                              ? "bg-accent/50"
                              : "bg-muted",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Course
            </p>
            <p className="mt-2 font-display text-lg font-bold uppercase tracking-tightest">
              {masterclass.name}
            </p>
            <p className="mt-2 text-sm text-muted">{masterclass.price.display}</p>
            <p className="mt-1 text-sm text-muted">
              {masterclass.coursePeriod.display}
            </p>
          </div>
        </section>
      </div>

      <MarketingSourceBreakdown stats={marketingSources} />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
              Latest registrations
            </h2>
            <Link
              href="/admin/registrations"
              className="text-xs text-muted hover:text-accent"
            >
              View all
            </Link>
          </div>
          {data.latestRegistrations.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No registrations yet.</p>
          ) : (
            <ul className="mt-5 divide-y divide-border">
              {data.latestRegistrations.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/registrations/${item.id}`}
                      className="truncate font-medium text-foreground hover:text-accent"
                    >
                      {item.fullName}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {item.registrationReference} ·{" "}
                      {formatAdminDate(item.createdAt)}
                    </p>
                  </div>
                  <PaymentStatusBadge status={item.paymentStatus} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Recent paid
          </h2>
          {data.recentPaid.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No paid registrations yet.</p>
          ) : (
            <ul className="mt-5 divide-y divide-border">
              {data.recentPaid.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/registrations/${item.id}`}
                      className="truncate font-medium text-foreground hover:text-accent"
                    >
                      {item.fullName}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {item.registrationReference} ·{" "}
                      {formatAdminDate(item.paidAt)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-accent">
                    {formatAmountDisplay(item.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
