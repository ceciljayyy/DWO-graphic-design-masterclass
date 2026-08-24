"use client";

import type { FormEvent } from "react";
import { useId, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { masterclass } from "@/lib/masterclass";
import { registrationConfiguration, validateRegistrationInput } from "@/lib/registration";
import type {
  RegistrationApiError,
  RegistrationCreateResponseData,
  RegistrationFormValues,
  RegistrationValidationErrors,
} from "@/types/registration";

const initialFormValues: RegistrationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  location: "",
  experienceLevel: "",
};

type FieldName = keyof RegistrationFormValues;

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
  if (status === "PENDING") {
    return "Pending";
  }

  if (status === "PAID") {
    return "Paid";
  }

  if (status === "FAILED") {
    return "Failed";
  }

  return status;
}

function RegistrationSuccess({
  successData,
}: {
  successData: RegistrationCreateResponseData;
}) {
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  async function handleContinueToPayment() {
    if (isPreparingPayment) {
      return;
    }

    setIsPreparingPayment(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationReference: successData.registrationReference,
        }),
      });

      const payload = (await response.json()) as
        | {
            success: true;
            data: { authorizationUrl: string };
          }
        | RegistrationApiError;

      if (!response.ok || payload.success === false) {
        setPaymentError(
          payload.success === false
            ? payload.error.message
            : "We could not prepare payment right now.",
        );
        setIsPreparingPayment(false);
        return;
      }

      window.location.assign(payload.data.authorizationUrl);
    } catch {
      setPaymentError(
        "Something went wrong while preparing payment. Please try again.",
      );
      setIsPreparingPayment(false);
    }
  }

  return (
    <section
      aria-live="polite"
      className="border border-border bg-surface p-6 sm:p-8"
    >
      <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Registration created
      </p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tightest text-foreground sm:text-3xl">
        Your place is reserved pending payment
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
        Your details for the {masterclass.name} have been saved. Continue to
        Paystack to complete your {registrationConfiguration.fee.display}{" "}
        registration fee.
      </p>

      <div className="mt-6 grid gap-4 border-t border-border pt-6">
        <div className="border border-border bg-background p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Course
          </p>
          <p className="mt-2 font-display text-lg font-bold uppercase tracking-tightest text-foreground">
            {masterclass.name}
          </p>
        </div>

        <div className="border border-border bg-background p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Registration Reference
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-xl font-extrabold tracking-editorial text-foreground">
              {successData.registrationReference}
            </p>
            <CopyButton value={successData.registrationReference} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-border bg-background p-4">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Amount
            </p>
            <p className="mt-2 font-display text-xl font-extrabold text-foreground">
              {registrationConfiguration.fee.display}
            </p>
          </div>
          <div className="border border-border bg-background p-4">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Payment Status
            </p>
            <p className="mt-2 text-base font-medium text-foreground">
              {formatPaymentStatus(successData.paymentStatus)}
            </p>
          </div>
        </div>

        {paymentError ? (
          <p role="alert" className="text-sm text-red">
            {paymentError}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={handleContinueToPayment}
            disabled={isPreparingPayment}
            className="min-h-12 sm:w-auto"
          >
            {isPreparingPayment ? "PREPARING PAYMENT..." : "CONTINUE TO PAYMENT"}
          </Button>
          <ButtonLink href="/" variant="secondary" className="min-h-12">
            Back to Home
          </ButtonLink>
        </div>

        <p className="text-sm leading-7 text-muted">
          You will be redirected to Paystack to complete payment securely. Your
          registration stays pending until payment is verified.
        </p>
      </div>
    </section>
  );
}

export function RegistrationForm() {
  const formId = useId();
  const [formValues, setFormValues] = useState<RegistrationFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<RegistrationValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationCreateResponseData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: FieldName, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRegistrationInput(formValues);
    if (validation.success === false) {
      setFieldErrors(validation.errors);
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const payload = (await response.json()) as
        | { success: true; data: RegistrationCreateResponseData }
        | RegistrationApiError;

      if (!response.ok || payload.success === false) {
        if (payload.success === false) {
          if (payload.error.fieldErrors) {
            setFieldErrors(payload.error.fieldErrors);
          }

          setFormError(payload.error.message);
        } else {
          setFormError("We could not complete the registration right now.");
        }
        return;
      }

      setSuccessData(payload.data);
    } catch {
      setFormError("Something went wrong while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successData) {
    return (
      <RegistrationSuccess
        successData={successData}
      />
    );
  }

  return (
    <section className="border border-border bg-surface p-6 sm:p-8">
      <div className="mb-8 border-b border-border pb-5">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Registration
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl">
          Complete your details
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Submit the form to create your pending registration. Payment is not
          collected in this step.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <div>
          <label htmlFor={`${formId}-fullName`} className="text-sm font-medium text-foreground">
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id={`${formId}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? `${formId}-fullName-error` : undefined}
            value={formValues.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className={fieldClassName}
            placeholder="Enter your full name"
          />
          <FieldError id={`${formId}-fullName-error`} message={fieldErrors.fullName} />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
            value={formValues.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClassName}
            placeholder="you@example.com"
          />
          <FieldError id={`${formId}-email-error`} message={fieldErrors.email} />
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-foreground">
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? `${formId}-phone-error` : undefined}
            value={formValues.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClassName}
            placeholder="+233 59 000 0000"
          />
          <FieldError id={`${formId}-phone-error`} message={fieldErrors.phone} />
        </div>

        <div>
          <label htmlFor={`${formId}-whatsapp`} className="text-sm font-medium text-foreground">
            WhatsApp Number <span className="text-muted">(optional)</span>
          </label>
          <input
            id={`${formId}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.whatsapp)}
            aria-describedby={fieldErrors.whatsapp ? `${formId}-whatsapp-error` : undefined}
            value={formValues.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            className={fieldClassName}
            placeholder="+233 53 000 0000"
          />
          <FieldError id={`${formId}-whatsapp-error`} message={fieldErrors.whatsapp} />
        </div>

        <div>
          <label htmlFor={`${formId}-location`} className="text-sm font-medium text-foreground">
            City / Town <span className="text-accent">*</span>
          </label>
          <input
            id={`${formId}-location`}
            name="location"
            type="text"
            autoComplete="address-level2"
            required
            aria-invalid={Boolean(fieldErrors.location)}
            aria-describedby={fieldErrors.location ? `${formId}-location-error` : undefined}
            value={formValues.location}
            onChange={(event) => updateField("location", event.target.value)}
            className={fieldClassName}
            placeholder="Accra"
          />
          <FieldError id={`${formId}-location-error`} message={fieldErrors.location} />
        </div>

        <div>
          <label
            htmlFor={`${formId}-experienceLevel`}
            className="text-sm font-medium text-foreground"
          >
            Experience Level <span className="text-accent">*</span>
          </label>
          <select
            id={`${formId}-experienceLevel`}
            name="experienceLevel"
            required
            aria-invalid={Boolean(fieldErrors.experienceLevel)}
            aria-describedby={
              fieldErrors.experienceLevel ? `${formId}-experienceLevel-error` : undefined
            }
            value={formValues.experienceLevel}
            onChange={(event) => updateField("experienceLevel", event.target.value)}
            className={fieldClassName}
          >
            <option value="" disabled>
              Select experience level
            </option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <FieldError
            id={`${formId}-experienceLevel-error`}
            message={fieldErrors.experienceLevel}
          />
        </div>

        <div className="rounded-sm border border-border bg-background p-4 text-sm leading-7 text-muted">
          Registration fee:{" "}
          <span className="font-display text-base font-extrabold text-accent">
            {registrationConfiguration.fee.display}
          </span>
        </div>

        {formError ? (
          <p role="alert" className="text-sm text-red">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full py-4 text-base"
        >
          {isSubmitting ? "CREATING REGISTRATION..." : "CONTINUE"}
        </Button>
      </form>
    </section>
  );
}
