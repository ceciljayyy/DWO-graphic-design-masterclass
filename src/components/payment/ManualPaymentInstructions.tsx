import type { ReactNode } from "react";
import Link from "next/link";

import { CopyButton } from "@/components/ui/copy-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HowYoullKnowConfirmed } from "@/components/payment/HowYoullKnowConfirmed";
import { masterclass, registrationFee } from "@/lib/masterclass";
import { manualMobileMoney } from "@/lib/manual-payment";
import type { PublicPaymentContext } from "@/lib/manual-payment-access.server";
import { toPublicPaymentSummaryLabel } from "@/lib/manual-payment-access.server";
import { cn } from "@/lib/utils";

type ManualPaymentInstructionsProps = {
  context: PublicPaymentContext;
};

export function ManualPaymentInstructions({
  context,
}: ManualPaymentInstructionsProps) {
  const submitHref = `/payment/submit?token=${encodeURIComponent(context.paymentAccessToken)}`;
  const statusLabel = toPublicPaymentSummaryLabel(context.paymentStatus);

  if (context.paymentStatus === "PAID") {
    return (
      <PaymentShell>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
          Payment already verified
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          Your payment for the {masterclass.name} has already been verified.
          Your place in the class is secured.
        </p>
        <div className="mt-6 border-2 border-accent/45 bg-accent/10 p-5">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Confirmation
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            A confirmation WhatsApp message is sent to the WhatsApp number you
            registered with. Keep that message and your registration reference
            for your records.
          </p>
        </div>
        <ReferenceCard
          reference={context.registrationReference}
          className="mt-8"
        />
        <ButtonLink href="/" className="mt-8 min-h-12">
          Back to home
        </ButtonLink>
      </PaymentShell>
    );
  }

  if (context.paymentStatus === "PAYMENT_SUBMITTED") {
    return (
      <PaymentShell>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
          Payment details submitted
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          Your payment information has been received and is awaiting manual
          review.
        </p>
        <ReferenceCard
          reference={context.registrationReference}
          className="mt-8"
        />
        <div className="mt-4 border-2 border-accent/45 bg-accent/10 p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Payment status
          </p>
          <p className="mt-2 font-display text-lg font-bold uppercase tracking-tightest text-accent">
            {statusLabel}
          </p>
        </div>

        <div className="mt-6">
          <HowYoullKnowConfirmed variant="compact" />
        </div>

        <ButtonLink href="/" variant="secondary" className="mt-8 min-h-12">
          Back to home
        </ButtonLink>
      </PaymentShell>
    );
  }

  const steps = [
    {
      title: "Copy the number",
      body: (
        <>
          Copy{" "}
          <HighlightChip tone="gold">{manualMobileMoney.number}</HighlightChip>.
        </>
      ),
    },
    {
      title: "Open Mobile Money",
      body: "Open your MTN Mobile Money app or menu.",
    },
    {
      title: "Send the payment",
      body: (
        <>
          Send{" "}
          <HighlightChip tone="gold">{registrationFee.display}</HighlightChip>{" "}
          to{" "}
          <HighlightChip tone="gold">{manualMobileMoney.number}</HighlightChip>.
        </>
      ),
    },
    {
      title: "Confirm the recipient",
      body: (
        <>
          Before completing the payment, confirm{" "}
          <HighlightChip tone="cream">
            {manualMobileMoney.accountName}
          </HighlightChip>
          .
        </>
      ),
    },
    {
      title: "Use your registration reference",
      body: (
        <>
          Where the payment interface provides a suitable field, enter{" "}
          <HighlightChip tone="red">
            {context.registrationReference}
          </HighlightChip>
          .
        </>
      ),
    },
    {
      title: "Complete the payment",
      body: "Finish the Mobile Money transaction.",
    },
    {
      title: "Return to this website",
      body: (
        <>
          After successfully sending the payment, return here and select{" "}
          <HighlightChip tone="gold">I&apos;ve Made Payment</HighlightChip>.
        </>
      ),
    },
  ];

  return (
    <PaymentShell>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
        Complete your payment
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.92] tracking-tightest text-foreground">
        Complete Your Payment
      </h1>
      <p className="mt-4 text-sm text-muted sm:text-base">
        For:{" "}
        <span className="font-semibold text-foreground">{masterclass.name}</span>
      </p>

      {/* Read-first guidance before MoMo credentials */}
      <ReferenceCard
        reference={context.registrationReference}
        className="mt-8"
        emphasize
      />

      <aside className="relative mt-6 overflow-hidden border-2 border-red/55 bg-red/15 p-5 shadow-[0_0_0_1px_rgba(161,15,22,0.25)] sm:p-6">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-red-strong"
        />
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-red-strong">
          Read this first
        </p>
        <h2 className="mt-2 font-display text-lg font-extrabold uppercase tracking-tightest text-foreground sm:text-xl">
          Important payment instruction
        </h2>
        <p className="mt-3 text-sm leading-7 text-foreground">
          Your registration reference helps us identify your payment.
        </p>
        <p className="mt-3 rounded-sm border border-red/40 bg-background/70 px-3 py-3 text-sm leading-7 text-foreground">
          <span className="font-extrabold uppercase tracking-wide text-red-strong">
            Use your exact DWO registration reference
          </span>{" "}
          when making your Mobile Money payment — where a reference,
          description, or payment-note field is available.
        </p>
        <p className="mt-4 select-all font-display text-2xl font-extrabold tracking-editorial text-accent sm:text-3xl">
          {context.registrationReference}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Do not use another customer&apos;s reference.
        </p>
      </aside>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3 border-b border-accent/30 pb-3">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-tightest text-foreground sm:text-2xl">
            How to pay
          </h2>
          <span className="hidden font-display text-[11px] font-bold uppercase tracking-[0.22em] text-accent sm:inline">
            Follow every step
          </span>
        </div>
        <ol className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3 border border-border bg-surface/80 p-4 sm:gap-4 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent font-display text-sm font-extrabold text-accent-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside className="mt-6 border border-accent/35 bg-accent/10 p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-accent/50 bg-accent/20 font-display text-sm font-extrabold text-accent"
          >
            i
          </span>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
              You&apos;ll need to leave this page briefly
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/90">
              Open your Mobile Money app or menu to complete the payment. Once
              you&apos;ve successfully paid, return to this website and continue
              with payment verification.
            </p>
          </div>
        </div>
      </aside>

      {/* Credentials after instructions so users read guidance first */}
      <div className="mt-10 border-t border-border pt-8">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Payment details — use these exact values
        </p>

        <div className="mt-5 overflow-hidden border-2 border-accent/50 bg-surface p-6 text-center shadow-[0_0_40px_rgba(244,185,66,0.12)] sm:p-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Amount to pay
          </p>
          <p className="mt-3 font-display text-5xl font-extrabold tracking-tightest text-accent sm:text-6xl">
            {registrationFee.display}
          </p>
          <p className="mt-3 text-sm font-medium text-muted">
            Send exactly this amount — no more, no less.
          </p>
        </div>

        <section className="relative mt-6 overflow-hidden border-2 border-border bg-surface p-5 sm:p-6">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5 bg-accent"
          />
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Pay to
          </p>
          <p className="mt-4 inline-flex rounded-sm border border-accent/40 bg-accent/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.22em] text-accent">
            {manualMobileMoney.methodLabel}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-background px-4 py-4">
            <p className="select-all font-display text-3xl font-extrabold tracking-tightest text-foreground sm:text-4xl">
              {manualMobileMoney.number}
            </p>
            <CopyButton
              value={manualMobileMoney.number}
              label="Copy"
              copiedLabel="Copied"
              iconOnlyOnMobile
              ariaLabel={`Copy Mobile Money number ${manualMobileMoney.number}`}
            />
          </div>
          <p className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tightest text-foreground sm:text-3xl">
            {manualMobileMoney.accountName}
          </p>
          <p className="mt-3 inline-block rounded-sm border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">
            Please confirm this name before sending your payment.
          </p>
        </section>
      </div>

      <section className="mt-8 border border-border bg-surface p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-tightest text-foreground">
          Before you continue
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-7">
          <ChecklistItem>
            Send exactly{" "}
            <span className="font-extrabold text-accent">
              {registrationFee.display}
            </span>
          </ChecklistItem>
          <ChecklistItem>
            Send to{" "}
            <span className="font-extrabold text-foreground">
              {manualMobileMoney.number}
            </span>
          </ChecklistItem>
          <ChecklistItem>
            Confirm the account name is{" "}
            <span className="font-extrabold text-foreground">
              {manualMobileMoney.accountName}
            </span>
          </ChecklistItem>
          <ChecklistItem>
            Use your exact DWO registration reference{" "}
            <span className="font-extrabold text-accent">
              {context.registrationReference}
            </span>{" "}
            where supported
          </ChecklistItem>
          <ChecklistItem>Keep your payment details available</ChecklistItem>
        </ul>
      </section>

      {context.paymentStatus === "PAYMENT_REJECTED" &&
      context.activeSubmission?.adminNote ? (
        <p
          role="alert"
          className="mt-6 border border-red/50 bg-red/15 px-4 py-3 text-sm text-red-strong"
        >
          Previous submission was rejected
          {context.activeSubmission.adminNote
            ? `: ${context.activeSubmission.adminNote}`
            : "."}{" "}
          Please submit corrected payment details after paying again if needed.
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={submitHref} className="min-h-12">
          I&apos;ve Made Payment
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" className="min-h-12">
          Back to home
        </ButtonLink>
      </div>
    </PaymentShell>
  );
}

function HighlightChip({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "gold" | "red" | "cream";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-display text-[0.95em] font-extrabold tracking-editorial",
        tone === "gold" && "border-accent/50 bg-accent/15 text-accent",
        tone === "red" && "border-red/45 bg-red/15 text-red-strong",
        tone === "cream" &&
          "border-border bg-background text-foreground",
      )}
    >
      {children}
    </span>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-muted">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-accent/20 font-display text-xs font-extrabold text-accent"
      >
        ✓
      </span>
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}

function PaymentShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-background">
      <Container className="py-8 sm:py-10">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label={`${masterclass.brand} home`}
          >
            <BrandLogo size="sm" priority />
            <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground sm:inline">
              {masterclass.shortName}
            </span>
          </Link>
        </div>
      </Container>
      <Container className="mx-auto max-w-2xl pb-16 sm:pb-20">{children}</Container>
    </main>
  );
}

function ReferenceCard({
  reference,
  className,
  emphasize,
}: {
  reference: string;
  className?: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border p-5",
        emphasize
          ? "border-2 border-accent/55 bg-accent/10 shadow-[0_0_32px_rgba(244,185,66,0.1)]"
          : "border-border bg-surface",
        className,
      )}
    >
      {emphasize ? (
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-accent"
        />
      ) : null}
      <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
        Your registration reference
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          className={cn(
            "select-all font-display font-extrabold tracking-editorial",
            emphasize
              ? "text-2xl text-accent sm:text-3xl"
              : "text-xl text-foreground",
          )}
        >
          {reference}
        </p>
        <CopyButton
          value={reference}
          label="Copy reference"
          copiedLabel="Copied"
          ariaLabel={`Copy registration reference ${reference}`}
        />
      </div>
      {emphasize ? (
        <p className="mt-4 rounded-sm border border-accent/30 bg-background/60 px-3 py-2 text-sm leading-7 text-foreground">
          <span className="font-extrabold text-accent">Keep this reference safe.</span>{" "}
          You will need it to verify your payment.
        </p>
      ) : null}
    </div>
  );
}
