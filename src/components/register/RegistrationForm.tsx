"use client";

import type { FormEvent } from "react";
import { useState } from "react";

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
  experienceLevel: "BEGINNER",
};

type FieldName = keyof RegistrationFormValues;

const fieldClassName =
  "mt-2 w-full rounded-none border border-border bg-surface px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-foreground focus:ring-1 focus:ring-foreground sm:text-sm";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-accent">{message}</p>;
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
      className="inline-flex items-center justify-center rounded-sm border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "Copied" : "Copy reference"}
    </button>
  );
}

export function RegistrationForm() {
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
      const { errors } = validation;

      setFieldErrors(errors);
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
      <section className="border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Registration created</p>
        <h2 className="mt-4 text-2xl font-medium tracking-editorial text-foreground sm:text-3xl">
          Your registration has been received.
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
          Your details have been saved with a pending payment status. The Paystack payment step will be connected in Phase 4.
        </p>

        <div className="mt-6 grid gap-4 border-t border-border pt-6">
          <div className="border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-muted">Registration Reference</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-lg font-medium text-foreground">{successData.registrationReference}</p>
              <CopyButton value={successData.registrationReference} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-[0.26em] text-muted">Payment Status</p>
              <p className="mt-2 text-base font-medium text-foreground">{successData.paymentStatus}</p>
            </div>
            <div className="border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-[0.26em] text-muted">Amount</p>
              <p className="mt-2 text-base font-medium text-foreground">{registrationConfiguration.fee.display}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" disabled className="sm:w-auto">
              Continue to Payment
            </Button>
            <ButtonLink href="/" variant="secondary">
              Back to Home
            </ButtonLink>
          </div>
          <p className="text-sm leading-7 text-muted">
            Payment integration will be enabled in the next phase. This screen only confirms that your registration record was created.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-border bg-surface p-6 sm:p-8">
      <div className="mb-8 border-b border-border pb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Registration</p>
        <h1 className="mt-3 text-3xl font-medium tracking-editorial text-foreground sm:text-4xl">
          Register for the {masterclass.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Complete the form below to save your registration. Payment remains pending until Phase 4 connects Paystack.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={formValues.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className={fieldClassName}
            placeholder="Enter your full name"
          />
          <FieldError message={fieldErrors.fullName} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={formValues.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClassName}
            placeholder="you@example.com"
          />
          <FieldError message={fieldErrors.email} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formValues.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClassName}
            placeholder="+233 000 000 000"
          />
          <FieldError message={fieldErrors.phone} />
        </div>

        <div>
          <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
            WhatsApp Number <span className="text-muted">(optional)</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formValues.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            className={fieldClassName}
            placeholder="WhatsApp number"
          />
          <FieldError message={fieldErrors.whatsapp} />
        </div>

        <div>
          <label htmlFor="location" className="text-sm font-medium text-foreground">
            Location <span className="text-muted">(optional)</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            autoComplete="address-level2"
            value={formValues.location}
            onChange={(event) => updateField("location", event.target.value)}
            className={fieldClassName}
            placeholder="City or town"
          />
          <FieldError message={fieldErrors.location} />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="text-sm font-medium text-foreground">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formValues.experienceLevel}
            onChange={(event) => updateField("experienceLevel", event.target.value)}
            className={fieldClassName}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <FieldError message={fieldErrors.experienceLevel} />
        </div>

        <div className="rounded-none border border-border bg-background p-4 text-sm leading-7 text-muted">
          Registration fee: <span className="font-medium text-foreground">{registrationConfiguration.fee.display}</span>
        </div>

        {formError ? <p className="text-sm text-accent">{formError}</p> : null}

        <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-base">
          {isSubmitting ? "Processing..." : "Register"}
        </Button>
      </form>
    </section>
  );
}