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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "Total Registrations",
            value: String(data.totals.totalRegistrations),
          },
          {
            label: "Paid Registrations",
            value: String(data.totals.paidRegistrations),
          },
          {
            label: "Pending Payments",
            value: String(data.totals.pendingRegistrations),
          },
          {
            label: "Failed Payments",
            value: String(data.totals.failedRegistrations),
          },
          { label: "Total Revenue", value: data.totals.revenueDisplay },
        ].map((card) => (
          <article key={card.label} className="border border-border bg-surface p-5">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              {card.label}
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-tightest text-foreground">
              {card.value}
            </p>
          </article>
        ))}
      </div>

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
                          : item.status === "FAILED"
                            ? "bg-red"
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
