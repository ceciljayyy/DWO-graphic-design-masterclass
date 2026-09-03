import Link from "next/link";

import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import {
  formatAdminDate,
  formatAmountDisplay,
  formatExperienceLevel,
  formatMarketingSource,
} from "@/lib/admin/format";
import type { RegistrationListQuery } from "@/lib/admin/registrations";

type ListResult = Awaited<
  ReturnType<typeof import("@/lib/admin/registrations").listRegistrations>
>;

function buildQueryString(
  query: RegistrationListQuery,
  overrides: Partial<RegistrationListQuery> = {},
) {
  const next = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.paymentStatus && next.paymentStatus !== "ALL") {
    params.set("paymentStatus", next.paymentStatus);
  }
  if (next.experienceLevel && next.experienceLevel !== "ALL") {
    params.set("experienceLevel", next.experienceLevel);
  }
  if (next.dateRange && next.dateRange !== "ALL") {
    params.set("dateRange", next.dateRange);
  }
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  if (next.page && next.page > 1) params.set("page", String(next.page));
  if (next.pageSize && next.pageSize !== 25) {
    params.set("pageSize", String(next.pageSize));
  }

  const value = params.toString();
  return value ? `?${value}` : "";
}

export function AdminRegistrationsView({
  query,
  data,
}: {
  query: RegistrationListQuery;
  data: ListResult;
}) {
  const from = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const to = Math.min(data.page * data.pageSize, data.total);
  const exportHref = `/api/admin/export${buildQueryString(query, { page: 1 })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Registrations
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest">
            Participants
          </h1>
        </div>
        <a
          href={exportHref}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-background"
        >
          Export CSV
        </a>
      </div>

      <form className="grid gap-3 border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          name="q"
          defaultValue={query.q ?? ""}
          placeholder="Search name, email, WhatsApp, phone, ref"
          className="min-h-11 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent lg:col-span-2"
        />
        <select
          name="paymentStatus"
          defaultValue={query.paymentStatus ?? "ALL"}
          className="min-h-11 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent"
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAYMENT_SUBMITTED">Payment Submitted</option>
          <option value="PAID">Paid</option>
          <option value="PAYMENT_REJECTED">Rejected</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          name="experienceLevel"
          defaultValue={query.experienceLevel ?? "ALL"}
          className="min-h-11 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent"
        >
          <option value="ALL">All levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select
          name="dateRange"
          defaultValue={query.dateRange ?? "ALL"}
          className="min-h-11 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent"
        >
          <option value="ALL">All dates</option>
          <option value="TODAY">Today</option>
          <option value="LAST_7_DAYS">Last 7 days</option>
          <option value="LAST_30_DAYS">Last 30 days</option>
        </select>
        <select
          name="sort"
          defaultValue={query.sort ?? "newest"}
          className="min-h-11 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_desc">Highest amount</option>
          <option value="amount_asc">Lowest amount</option>
        </select>
        <button
          type="submit"
          className="min-h-11 rounded-sm border border-accent px-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-accent"
        >
          Apply
        </button>
      </form>

      <p className="text-sm text-muted">
        Showing {from}–{to} of {data.total} registrations
      </p>

      {data.items.length === 0 ? (
        <div className="border border-border bg-surface p-8 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
            No registrations yet
          </p>
          <p className="mt-3 text-sm text-muted">
            When participants register, they will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden border border-border bg-surface lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-background text-xs uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Registered</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/registrations/${item.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {item.registrationReference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{item.fullName}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.whatsapp || item.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {formatExperienceLevel(item.experienceLevel)}
                    </td>
                    <td className="px-4 py-3">
                      {formatMarketingSource(item.marketingSource)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={item.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">{formatAmountDisplay(item.amount)}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatAdminDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {data.items.map((item) => (
              <Link
                key={item.id}
                href={`/admin/registrations/${item.id}`}
                className="border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{item.fullName}</p>
                    <p className="mt-1 text-xs text-accent">{item.registrationReference}</p>
                  </div>
                  <PaymentStatusBadge status={item.paymentStatus} />
                </div>
                <p className="mt-3 text-sm text-muted">{item.email}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.whatsapp || item.phone || "—"}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                  {formatMarketingSource(item.marketingSource)}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{formatAmountDisplay(item.amount)}</span>
                  <span className="text-muted">{formatAdminDate(item.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/registrations${buildQueryString(query, {
            page: Math.max(1, data.page - 1),
          })}`}
          aria-disabled={data.page <= 1}
          className={`rounded-sm border border-border px-4 py-2 text-sm ${
            data.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-accent"
          }`}
        >
          Previous
        </Link>
        <p className="text-sm text-muted">
          Page {data.page} of {data.totalPages}
        </p>
        <Link
          href={`/admin/registrations${buildQueryString(query, {
            page: Math.min(data.totalPages, data.page + 1),
          })}`}
          aria-disabled={data.page >= data.totalPages}
          className={`rounded-sm border border-border px-4 py-2 text-sm ${
            data.page >= data.totalPages
              ? "pointer-events-none opacity-40"
              : "hover:border-accent"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
