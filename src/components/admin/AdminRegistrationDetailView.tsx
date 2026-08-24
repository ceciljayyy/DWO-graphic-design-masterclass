import Link from "next/link";
import type { ReactNode } from "react";

import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import {
  formatAdminDate,
  formatExperienceLevel,
} from "@/lib/admin/format";

type Detail = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/admin/registrations").getRegistrationById>>
>;

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-t border-border py-3 first:border-t-0 first:pt-0">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <div className="mt-2 text-sm text-foreground">{value || "—"}</div>
    </div>
  );
}

export function AdminRegistrationDetailView({
  registration,
}: {
  registration: Detail;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/registrations"
            className="text-sm text-muted hover:text-accent"
          >
            ← Back to registrations
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest">
            {registration.fullName}
          </h1>
          <p className="mt-2 text-sm text-accent">{registration.registrationReference}</p>
        </div>
        <PaymentStatusBadge status={registration.paymentStatus} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Participant information
          </h2>
          <div className="mt-4">
            <DetailRow label="Full Name" value={registration.fullName} />
            <DetailRow label="Email" value={registration.email} />
            <DetailRow label="Phone" value={registration.phone} />
            <DetailRow label="WhatsApp" value={registration.whatsapp} />
            <DetailRow label="Location" value={registration.location} />
            <DetailRow
              label="Experience Level"
              value={formatExperienceLevel(registration.experienceLevel)}
            />
          </div>
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Registration information
          </h2>
          <div className="mt-4">
            <DetailRow
              label="Registration Reference"
              value={registration.registrationReference}
            />
            <DetailRow label="Created At" value={formatAdminDate(registration.createdAt)} />
            <DetailRow label="Updated At" value={formatAdminDate(registration.updatedAt)} />
          </div>
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Payment information
          </h2>
          <div className="mt-4">
            <DetailRow
              label="Payment Status"
              value={<PaymentStatusBadge status={registration.paymentStatus} />}
            />
            <DetailRow label="Amount" value={registration.amountDisplay} />
            <DetailRow
              label="Paystack Reference"
              value={registration.paystackReference}
            />
            <DetailRow label="Paid At" value={formatAdminDate(registration.paidAt)} />
          </div>
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Notification information
          </h2>
          <div className="mt-4">
            <DetailRow
              label="Confirmation Email Sent"
              value={
                registration.confirmationEmailSentAt
                  ? formatAdminDate(registration.confirmationEmailSentAt)
                  : "Not sent"
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
