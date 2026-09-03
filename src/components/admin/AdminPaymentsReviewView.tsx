"use client";

import Link from "next/link";

import { AdminManualPaymentReview } from "@/components/admin/AdminManualPaymentReview";
import { AdminWhatsAppConfirmation } from "@/components/admin/AdminWhatsAppConfirmation";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { formatAdminDate } from "@/lib/admin/format";

type PaymentApprovalsData = Awaited<
  ReturnType<typeof import("@/lib/admin/registrations").listPaymentApprovals>
>;

export function AdminPaymentsReviewView({
  data,
}: {
  data: PaymentApprovalsData;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Payment approvals
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest">
            Review Mobile Money payments
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Verify submitted payments against your MTN wallet/statement, mark
            them paid, then send the WhatsApp confirmation to the student.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/admin/whatsapp-contacts"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-accent/40 bg-accent/10 px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
          >
            Export paid WhatsApp contacts
          </Link>
          <Link
            href="/admin/payments"
            className="rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-muted hover:border-accent hover:text-accent"
          >
            Refresh
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold uppercase tracking-tightest text-foreground">
            Awaiting verification
          </h2>
          <span className="rounded-sm border border-accent/40 bg-accent/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {data.awaitingReview.length} pending
          </span>
        </div>

        {data.awaitingReview.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-sm text-muted">
            No payment submissions are waiting for review right now.
          </div>
        ) : (
          <div className="space-y-5">
            {data.awaitingReview.map((item) => (
              <article
                key={item.id}
                className="border-2 border-accent/35 bg-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-extrabold uppercase tracking-tightest text-foreground">
                      {item.fullName}
                    </p>
                    <p className="mt-1 text-sm text-accent">
                      {item.registrationReference}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      WhatsApp:{" "}
                      <span className="text-foreground">{item.whatsapp}</span>
                      {" · "}
                      Submitted{" "}
                      {item.submission
                        ? formatAdminDate(item.submission.submittedAt)
                        : formatAdminDate(item.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PaymentStatusBadge status={item.paymentStatus} />
                    <Link
                      href={`/admin/registrations/${item.id}`}
                      className="rounded-sm border border-border px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:border-accent hover:text-accent"
                    >
                      Full record
                    </Link>
                  </div>
                </div>

                <div className="mt-5">
                  <AdminManualPaymentReview
                    registrationId={item.id}
                    registrationReference={item.registrationReference}
                    participantName={item.fullName}
                    paymentStatus={item.paymentStatus}
                    submission={item.submission}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-tightest text-foreground">
              Recently paid — send WhatsApp
            </h2>
            <p className="mt-2 text-sm text-muted">
              After you approve a payment, send the confirmation WhatsApp
              message from here.
            </p>
          </div>
          <span className="rounded-sm border border-border px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Last 14 days
          </span>
        </div>

        {data.recentlyPaid.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-sm text-muted">
            No recently paid registrations yet.
          </div>
        ) : (
          <div className="space-y-5">
            {data.recentlyPaid.map((item) => (
              <article key={item.id} className="border border-border bg-surface p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-extrabold uppercase tracking-tightest">
                      {item.fullName}
                    </p>
                    <p className="mt-1 text-sm text-accent">
                      {item.registrationReference}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Paid {formatAdminDate(item.paidAt)} · {item.amountDisplay}
                    </p>
                  </div>
                  <PaymentStatusBadge status="PAID" />
                </div>
                <AdminWhatsAppConfirmation
                  fullName={item.fullName}
                  whatsapp={item.whatsapp}
                  registrationReference={item.registrationReference}
                  amountDisplay={item.amountDisplay}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
