"use client";

import type { FormEvent, ReactNode } from "react";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CopyButton } from "@/components/ui/copy-button";
import { masterclass, registrationFee } from "@/lib/masterclass";
import { manualMobileMoney } from "@/lib/manual-payment";
import Link from "next/link";

type PaymentDetailsFormProps = {
  paymentAccessToken: string;
  registrationReference: string;
  paymentStatus: string;
};

type FieldErrors = Partial<
  Record<
    | "senderName"
    | "senderPhone"
    | "transactionReference"
    | "paymentDate"
    | "paymentTime"
    | "form",
    string
  >
>;

const fieldClassName =
  "mt-2 w-full min-h-12 rounded-sm border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red">
      {message}
    </p>
  );
}

export function PaymentDetailsForm({
  paymentAccessToken,
  registrationReference,
  paymentStatus,
}: PaymentDetailsFormProps) {
  const router = useRouter();
  const formId = useId();
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (paymentStatus === "PAID") {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tightest">
          Payment already verified
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your payment has already been verified.
        </p>
        <ButtonLink href="/" className="mt-8 min-h-12">
          Back to home
        </ButtonLink>
      </Shell>
    );
  }

  if (paymentStatus === "PAYMENT_SUBMITTED") {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tightest">
          Already submitted
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your payment details have already been submitted and are awaiting
          verification. Watch WhatsApp for your confirmation message once DWO
          verifies the payment.
        </p>
        <ReferenceBlock reference={registrationReference} />
        <ButtonLink
          href={`/payment?token=${encodeURIComponent(paymentAccessToken)}`}
          className="mt-8 min-h-12"
        >
          View payment status
        </ButtonLink>
      </Shell>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/payments/manual/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAccessToken,
          senderName,
          senderPhone,
          transactionReference: transactionReference.trim() || null,
          paymentDate,
          paymentTime,
        }),
      });

      const payload = (await response.json()) as
        | {
            success: true;
            data: { paymentAccessToken: string };
          }
        | {
            success: false;
            error: {
              code: string;
              message: string;
              fieldErrors?: FieldErrors;
            };
          };

      if (!response.ok || payload.success === false) {
        if (payload.success === false) {
          setErrors(
            payload.error.fieldErrors ?? { form: payload.error.message },
          );
        } else {
          setErrors({
            form: "Something went wrong. Your registration has not been deleted. Please try again.",
          });
        }
        setIsSubmitting(false);
        return;
      }

      router.push(
        `/payment/submitted?token=${encodeURIComponent(payload.data.paymentAccessToken)}`,
      );
    } catch {
      setErrors({
        form: "Something went wrong. Your registration has not been deleted. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Shell>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
        Verify your payment
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-tightest text-foreground">
        Verify Your Payment
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
        Submit your payment details so our team can verify your payment and
        complete your registration.
      </p>

      <ReferenceBlock reference={registrationReference} className="mt-8" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor={`${formId}-method`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            Payment Method
          </label>
          <input
            id={`${formId}-method`}
            value={manualMobileMoney.methodLabel}
            readOnly
            className={fieldClassName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-senderName`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            Sender Name
          </label>
          <input
            id={`${formId}-senderName`}
            name="senderName"
            autoComplete="name"
            placeholder="Name used to make the payment"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
            aria-invalid={Boolean(errors.senderName)}
            aria-describedby={
              errors.senderName ? `${formId}-senderName-error` : undefined
            }
            className={fieldClassName}
            required
          />
          <FieldError
            id={`${formId}-senderName-error`}
            message={errors.senderName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-senderPhone`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            Sender Phone Number
          </label>
          <input
            id={`${formId}-senderPhone`}
            name="senderPhone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone number used to send the payment"
            value={senderPhone}
            onChange={(event) => setSenderPhone(event.target.value)}
            aria-invalid={Boolean(errors.senderPhone)}
            aria-describedby={
              errors.senderPhone ? `${formId}-senderPhone-error` : undefined
            }
            className={fieldClassName}
            required
          />
          <FieldError
            id={`${formId}-senderPhone-error`}
            message={errors.senderPhone}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-amount`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            Amount Paid
          </label>
          <input
            id={`${formId}-amount`}
            value={registrationFee.display}
            readOnly
            className={fieldClassName}
          />
          <p className="mt-2 text-sm text-muted">
            The expected amount is always {registrationFee.display}.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`${formId}-paymentDate`}
              className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
            >
              Payment Date
            </label>
            <input
              id={`${formId}-paymentDate`}
              name="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              aria-invalid={Boolean(errors.paymentDate)}
              aria-describedby={
                errors.paymentDate ? `${formId}-paymentDate-error` : undefined
              }
              className={fieldClassName}
              required
            />
            <FieldError
              id={`${formId}-paymentDate-error`}
              message={errors.paymentDate}
            />
          </div>
          <div>
            <label
              htmlFor={`${formId}-paymentTime`}
              className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
            >
              Payment Time
            </label>
            <input
              id={`${formId}-paymentTime`}
              name="paymentTime"
              type="time"
              value={paymentTime}
              onChange={(event) => setPaymentTime(event.target.value)}
              aria-invalid={Boolean(errors.paymentTime)}
              aria-describedby={
                errors.paymentTime ? `${formId}-paymentTime-error` : undefined
              }
              className={fieldClassName}
              required
            />
            <FieldError
              id={`${formId}-paymentTime-error`}
              message={errors.paymentTime}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${formId}-txn`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            Transaction / Payment Reference (Optional)
          </label>
          <input
            id={`${formId}-txn`}
            name="transactionReference"
            value={transactionReference}
            onChange={(event) => setTransactionReference(event.target.value)}
            aria-invalid={Boolean(errors.transactionReference)}
            aria-describedby={`${formId}-txn-help${
              errors.transactionReference ? ` ${formId}-txn-error` : ""
            }`}
            className={fieldClassName}
          />
          <p id={`${formId}-txn-help`} className="mt-2 text-sm text-muted">
            If your Mobile Money service provided a transaction or payment
            reference, enter it here.
          </p>
          <FieldError
            id={`${formId}-txn-error`}
            message={errors.transactionReference}
          />
        </div>

        {errors.form ? (
          <p role="alert" className="text-sm text-red">
            {errors.form}
          </p>
        ) : null}

        <p className="text-sm leading-7 text-muted">
          Your payment will be reviewed manually before your registration is
          marked as paid.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isSubmitting} className="min-h-12">
            {isSubmitting
              ? "Submitting..."
              : "Submit Payment for Verification"}
          </Button>
          <ButtonLink
            href={`/payment?token=${encodeURIComponent(paymentAccessToken)}`}
            variant="secondary"
            className="min-h-12"
          >
            Back to payment instructions
          </ButtonLink>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
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

function ReferenceBlock({
  reference,
  className,
}: {
  reference: string;
  className?: string;
}) {
  return (
    <div className={className ? `${className} border border-border bg-surface p-5` : "mt-8 border border-border bg-surface p-5"}>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
        Registration reference
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="select-all font-display text-xl font-extrabold tracking-editorial text-foreground sm:text-2xl">
          {reference}
        </p>
        <CopyButton
          value={reference}
          label="Copy reference"
          copiedLabel="Copied"
          ariaLabel={`Copy registration reference ${reference}`}
        />
      </div>
    </div>
  );
}
