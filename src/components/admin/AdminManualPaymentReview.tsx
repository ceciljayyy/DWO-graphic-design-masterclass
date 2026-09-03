"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatAdminDate } from "@/lib/admin/format";
import { formatManualPaymentMethod } from "@/lib/manual-payment";

type ActiveSubmission = {
  id: string;
  method: string;
  methodLabel: string;
  amountDisplay: string;
  senderName: string;
  senderPhone: string;
  transactionReference: string | null;
  paymentDateTime: string;
  submittedAt: string;
  reviewedAt: string | null;
  adminNote: string | null;
};

type AdminManualPaymentReviewProps = {
  registrationId: string;
  registrationReference: string;
  participantName: string;
  paymentStatus: string;
  submission: ActiveSubmission | null;
};

export function AdminManualPaymentReview({
  registrationId,
  registrationReference,
  participantName,
  paymentStatus,
  submission,
}: AdminManualPaymentReviewProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (paymentStatus !== "PAYMENT_SUBMITTED" || !submission) {
    if (!submission) {
      return null;
    }

    return (
      <section className="border border-border bg-surface p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
          Manual payment submission
        </h2>
        <SubmissionDetails
          registrationReference={registrationReference}
          participantName={participantName}
          submission={submission}
        />
      </section>
    );
  }

  async function verifyPayment() {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/payments/${registrationId}/verify`,
        { method: "POST" },
      );
      const payload = (await response.json()) as {
        success: boolean;
        error?: { message: string };
      };

      if (!response.ok || !payload.success) {
        setError(payload.error?.message ?? "Verification failed.");
        setBusy(false);
        return;
      }

      setConfirming(false);
      router.refresh();
    } catch {
      setError("Verification failed. Please try again.");
      setBusy(false);
    }
  }

  async function rejectPayment() {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/payments/${registrationId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNote }),
        },
      );
      const payload = (await response.json()) as {
        success: boolean;
        error?: { message: string };
      };

      if (!response.ok || !payload.success) {
        setError(payload.error?.message ?? "Rejection failed.");
        setBusy(false);
        return;
      }

      setRejecting(false);
      router.refresh();
    } catch {
      setError("Rejection failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section className="border border-accent/40 bg-surface p-5">
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
        Manual payment review
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        <strong className="text-foreground">
          Verify this payment against the receiving Mobile Money account/wallet
          or statement before marking it as paid.
        </strong>
      </p>

      <SubmissionDetails
        registrationReference={registrationReference}
        participantName={participantName}
        submission={submission}
      />

      {error ? (
        <p role="alert" className="mt-4 text-sm text-red">
          {error}
        </p>
      ) : null}

      {!confirming && !rejecting ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={busy}
            className="min-h-11"
          >
            ✓ Verify payment
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setRejecting(true)}
            disabled={busy}
            className="min-h-11"
          >
            Reject payment
          </Button>
        </div>
      ) : null}

      {confirming ? (
        <div className="mt-6 border border-border bg-background p-4">
          <p className="text-sm leading-7 text-foreground">
            Confirm that you have independently verified that{" "}
            {submission.amountDisplay} was received for this registration.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={verifyPayment}
              disabled={busy}
              className="min-h-11"
            >
              {busy ? "Confirming..." : "Confirm & mark paid"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="min-h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {rejecting ? (
        <div className="mt-6 border border-border bg-background p-4">
          <label
            htmlFor="admin-reject-note"
            className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted"
          >
            Admin note (optional)
          </label>
          <textarea
            id="admin-reject-note"
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            placeholder="Payment could not be matched to the receiving account."
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={rejectPayment}
              disabled={busy}
              className="min-h-11"
            >
              {busy ? "Rejecting..." : "Confirm rejection"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejecting(false)}
              disabled={busy}
              className="min-h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SubmissionDetails({
  registrationReference,
  participantName,
  submission,
}: {
  registrationReference: string;
  participantName: string;
  submission: ActiveSubmission;
}) {
  return (
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Registration
        </dt>
        <dd className="mt-1 text-foreground">{registrationReference}</dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Participant
        </dt>
        <dd className="mt-1 text-foreground">{participantName}</dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Payment method
        </dt>
        <dd className="mt-1 text-foreground">
          {formatManualPaymentMethod(submission.method)}
        </dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Amount
        </dt>
        <dd className="mt-1 text-foreground">{submission.amountDisplay}</dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Sender name
        </dt>
        <dd className="mt-1 text-foreground">{submission.senderName}</dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Sender phone
        </dt>
        <dd className="mt-1 text-foreground">{submission.senderPhone}</dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Payment date/time
        </dt>
        <dd className="mt-1 text-foreground">
          {formatAdminDate(submission.paymentDateTime)}
        </dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Transaction reference
        </dt>
        <dd className="mt-1 text-foreground">
          {submission.transactionReference || "—"}
        </dd>
      </div>
      <div>
        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
          Submitted at
        </dt>
        <dd className="mt-1 text-foreground">
          {formatAdminDate(submission.submittedAt)}
        </dd>
      </div>
      {submission.adminNote ? (
        <div className="sm:col-span-2">
          <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-muted">
            Admin note
          </dt>
          <dd className="mt-1 text-foreground">{submission.adminNote}</dd>
        </div>
      ) : null}
    </dl>
  );
}
