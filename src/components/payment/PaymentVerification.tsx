"use client";

import { useEffect, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type {
  PaymentApiError,
  PaymentSummaryData,
  PaymentVerifySuccess,
} from "@/types/payment";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function formatPaymentStatus(status: string) {
  if (status === "PENDING") return "Pending";
  if (status === "PAID") return "Paid";
  if (status === "FAILED") return "Failed";
  return status;
}

async function initializePayment(registrationReference: string) {
  const response = await fetch("/api/payments/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationReference }),
  });

  const payload = (await response.json()) as
    | {
        success: true;
        data: { authorizationUrl: string };
      }
    | PaymentApiError;

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.success === false
        ? payload.error.message
        : "We could not prepare payment right now.",
    );
  }

  window.location.assign(payload.data.authorizationUrl);
}

type PaymentVerificationProps = {
  reference: string | null;
};

export function PaymentVerification({ reference }: PaymentVerificationProps) {
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "error">(
    "loading",
  );
  const [summary, setSummary] = useState<PaymentSummaryData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!reference) {
        setStatus("error");
        setErrorMessage("Missing payment reference.");
        return;
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const payload = (await response.json()) as
          | PaymentVerifySuccess
          | PaymentApiError;

        if (cancelled) {
          return;
        }

        if (!response.ok || payload.success === false) {
          setStatus("error");
          setErrorMessage(
            payload.success === false
              ? payload.error.message
              : "We could not verify this payment.",
          );
          return;
        }

        setSummary(payload.data.summary);

        if (
          payload.data.outcome === "paid" ||
          payload.data.outcome === "already_paid"
        ) {
          setStatus("success");
          return;
        }

        setStatus("failed");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            "We could not verify this payment right now. Please try again.",
          );
        }
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  async function handleRetry() {
    if (!summary?.registrationReference || isRetrying) {
      return;
    }

    setIsRetrying(true);
    setErrorMessage(null);

    try {
      await initializePayment(summary.registrationReference);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not restart payment right now.",
      );
      setIsRetrying(false);
    }
  }

  return (
    <main className="bg-background">
      <Container className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-2xl border border-border bg-surface p-6 sm:p-8">
          {status === "loading" ? (
            <div aria-live="polite" className="space-y-4">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Payment verification
              </p>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
                Verifying payment...
              </h1>
              <p className="text-sm leading-7 text-muted">
                Please wait while we securely confirm your Paystack transaction.
              </p>
            </div>
          ) : null}

          {status === "success" && summary ? (
            <div aria-live="polite" className="space-y-6">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Payment successful
                </p>
                <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
                  Registration confirmed
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                  Your payment for the {summary.courseName} has been confirmed.
                  {summary.confirmationEmailSent
                    ? " A confirmation email has been sent to you."
                    : " Keep your registration reference below for your records."}
                </p>
              </div>

              <div className="grid gap-4 border-t border-border pt-6">
                <div className="border border-border bg-background p-4">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Participant
                  </p>
                  <p className="mt-2 text-base font-medium text-foreground">
                    {summary.fullName}
                  </p>
                </div>

                <div className="border border-border bg-background p-4">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Course
                  </p>
                  <p className="mt-2 font-display text-lg font-bold uppercase tracking-tightest text-foreground">
                    {summary.courseName}
                  </p>
                </div>

                <div className="border border-border bg-background p-4">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Registration Reference
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-xl font-extrabold tracking-editorial text-foreground">
                      {summary.registrationReference}
                    </p>
                    <CopyButton value={summary.registrationReference} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border border-border bg-background p-4">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                      Amount Paid
                    </p>
                    <p className="mt-2 font-display text-xl font-extrabold text-foreground">
                      {summary.amountDisplay}
                    </p>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                      Payment Status
                    </p>
                    <p className="mt-2 text-base font-medium text-foreground">
                      {formatPaymentStatus(summary.paymentStatus)}
                    </p>
                  </div>
                </div>

                <div className="border border-border bg-background p-4">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Confirmation Email
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {summary.confirmationEmailSent
                      ? "Sent to the email address used during registration."
                      : "Not sent yet. Your registration is still confirmed — check spam later or contact DWO if you need a copy."}
                  </p>
                </div>
              </div>

              <ButtonLink href="/" className="min-h-12 w-full sm:w-auto">
                Back to Home
              </ButtonLink>
            </div>
          ) : null}

          {(status === "failed" || status === "error") && (
            <div aria-live="polite" className="space-y-6">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Payment not completed
                </p>
                <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
                  Your registration is saved
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                  {errorMessage ||
                    "Your registration has been saved, but your payment has not been confirmed."}
                </p>
              </div>

              {summary ? (
                <div className="grid gap-4 border-t border-border pt-6">
                  <div className="border border-border bg-background p-4">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                      Registration Reference
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-xl font-extrabold tracking-editorial text-foreground">
                        {summary.registrationReference}
                      </p>
                      <CopyButton value={summary.registrationReference} />
                    </div>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                      Status
                    </p>
                    <p className="mt-2 text-base font-medium text-foreground">
                      {formatPaymentStatus(summary.paymentStatus)}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                {summary?.registrationReference ? (
                  <Button
                    type="button"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="min-h-12"
                  >
                    {isRetrying ? "PREPARING PAYMENT..." : "TRY PAYMENT AGAIN"}
                  </Button>
                ) : null}
                <ButtonLink href="/register" variant="secondary" className="min-h-12">
                  Back to Registration
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
