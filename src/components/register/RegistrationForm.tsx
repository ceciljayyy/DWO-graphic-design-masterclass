"use client";

import type { FormEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CountryCode } from "libphonenumber-js";

import { CityCombobox, CountryPhoneInput } from "@/components/forms";
import { Button, ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { masterclass } from "@/lib/masterclass";
import {
  getDefaultPhoneCountry,
  isInvalidPhone,
  validatePhoneForCountry,
} from "@/lib/phone";
import {
  registrationConfiguration,
  validateEmailAddress,
  validateFullName,
  validateRegistrationInput,
} from "@/lib/registration";
import { isCityInCountry } from "@/lib/locations";
import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  saveRegistrationDraft,
} from "@/lib/registration-draft";
import { getStoredMarketingAttribution } from "@/lib/marketing-attribution.client";
import type {
  RegistrationApiError,
  RegistrationCreateResponseData,
  RegistrationFormValues,
  RegistrationValidationErrors,
} from "@/types/registration";

const initialFormValues: RegistrationFormValues = {
  fullName: "",
  email: "",
  countryCode: getDefaultPhoneCountry(),
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

function formatPaymentStatus(status: string) {
  if (status === "PENDING") {
    return "Pending";
  }

  if (status === "PAYMENT_SUBMITTED") {
    return "Awaiting verification";
  }

  if (status === "PAID") {
    return "Paid";
  }

  if (status === "FAILED") {
    return "Failed";
  }

  if (status === "PAYMENT_REJECTED") {
    return "Rejected";
  }

  return status;
}

function RegistrationSuccess({
  successData,
}: {
  successData: RegistrationCreateResponseData;
}) {
  const router = useRouter();
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const isManual = successData.paymentMode !== "PAYSTACK";

  async function handleContinueToPayment() {
    if (isPreparingPayment) {
      return;
    }

    if (isManual) {
      router.push(
        `/payment?token=${encodeURIComponent(successData.paymentAccessToken)}`,
      );
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
        Registration successful
      </p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tightest text-foreground sm:text-3xl">
        You&apos;re officially registered for the {masterclass.name}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
        {isManual
          ? `Your details have been saved. Continue to payment instructions to send your ${registrationConfiguration.fee.display} Mobile Money payment.`
          : `Your details have been saved. Continue to Paystack to complete your ${registrationConfiguration.fee.display} registration fee.`}
      </p>

      <div className="mt-6 grid gap-4 border-t border-border pt-6">
        <div className="border border-border bg-background p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Your registration reference
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="select-all font-display text-2xl font-extrabold tracking-editorial text-foreground sm:text-3xl">
              {successData.registrationReference}
            </p>
            <CopyButton
              value={successData.registrationReference}
              label="Copy reference"
              copiedLabel="Copied"
              ariaLabel={`Copy registration reference ${successData.registrationReference}`}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            <strong className="text-foreground">
              Keep this reference safe. You will need it to verify your payment.
            </strong>
          </p>
          {isManual ? (
            <p className="mt-2 text-sm leading-7 text-muted">
              <strong className="text-foreground">
                IMPORTANT: Use this exact registration reference when making
                your Mobile Money payment
              </strong>{" "}
              where a reference, description, or payment-note field is
              available.
            </p>
          ) : null}
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
            {isPreparingPayment
              ? "Preparing payment..."
              : "Continue to payment →"}
          </Button>
          <ButtonLink href="/" variant="secondary" className="min-h-12">
            Back to Home
          </ButtonLink>
        </div>

        <p className="text-sm leading-7 text-muted">
          {isManual
            ? "You will receive Mobile Money payment instructions next. Your registration stays pending until payment is verified by DWO."
            : "You will be redirected to Paystack to complete payment securely. Your registration stays pending until payment is verified."}
        </p>
      </div>
    </section>
  );
}

function validateField(
  name: FieldName,
  values: RegistrationFormValues,
): string | undefined {
  if (name === "fullName") {
    const result = validateFullName(values.fullName);
    return result.success ? undefined : result.error;
  }

  if (name === "email") {
    const result = validateEmailAddress(values.email);
    return result.success ? undefined : result.error;
  }

  if (name === "phone") {
    const result = validatePhoneForCountry(values.phone ?? "", values.countryCode, {
      required: false,
      fieldLabel: "phone",
    });
    return isInvalidPhone(result) ? result.error : undefined;
  }

  if (name === "whatsapp") {
    const result = validatePhoneForCountry(
      values.whatsapp,
      values.countryCode,
      {
        required: true,
        fieldLabel: "whatsapp",
      },
    );
    return isInvalidPhone(result) ? result.error : undefined;
  }

  if (name === "location") {
    if (!values.location.trim()) {
      return "Please select your city or town.";
    }
    if (!isCityInCountry(values.location, values.countryCode)) {
      return "Please select your city or town.";
    }
    return undefined;
  }

  if (name === "experienceLevel") {
    if (!values.experienceLevel) {
      return "Please select your experience level.";
    }
    return undefined;
  }

  return undefined;
}

export function RegistrationForm() {
  const formId = useId();
  const [formValues, setFormValues] =
    useState<RegistrationFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<RegistrationValidationErrors>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [successData, setSuccessData] =
    useState<RegistrationCreateResponseData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const draftReady = useRef(false);

  useEffect(() => {
    const draft = loadRegistrationDraft();
    if (draft) {
      setFormValues(draft);
      setDraftRestored(true);
    }
    draftReady.current = true;
  }, []);

  useEffect(() => {
    if (!draftReady.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      saveRegistrationDraft(formValues);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [formValues]);

  function updateField(name: FieldName, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  }

  function handleCountryChange(nextCountry: CountryCode) {
    setFormValues((current) => ({
      ...current,
      countryCode: nextCountry,
      location: "",
    }));
    setFieldErrors((current) => ({
      ...current,
      countryCode: undefined,
      location: undefined,
      phone: undefined,
      whatsapp: undefined,
    }));
    setFormError(null);
  }

  function handleBlur(name: FieldName) {
    setFormValues((current) => {
      const message = validateField(name, current);
      setFieldErrors((errors) => ({ ...errors, [name]: message }));
      return current;
    });
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
      const attribution = getStoredMarketingAttribution();

      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: validation.data.fullName,
          email: validation.data.email,
          countryCode: validation.data.countryCode,
          phone: validation.data.phone,
          whatsapp: validation.data.whatsapp,
          location: validation.data.location,
          experienceLevel: validation.data.experienceLevel,
          marketingSource: attribution?.marketingSource,
          utmSource: attribution?.utmSource,
          utmMedium: attribution?.utmMedium,
          utmCampaign: attribution?.utmCampaign,
        }),
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

      clearRegistrationDraft();
      setDraftRestored(false);
      setSuccessData(payload.data);
    } catch {
      setFormError(
        "Something went wrong while submitting the form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successData) {
    return <RegistrationSuccess successData={successData} />;
  }

  return (
    <section className="border border-border bg-surface p-6 sm:p-8 xl:p-10">
      <div className="mb-8 border-b border-border pb-5">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent xl:text-sm">
          Registration
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl xl:text-5xl">
          Complete your details
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base xl:text-lg">
          Submit the form to create your pending registration. Payment is not
          collected in this step. Your progress is saved on this device if you
          refresh or return later.
        </p>
      </div>

      {draftRestored ? (
        <div className="mb-5 flex flex-col gap-3 border border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            We restored your previous entries from this device.
          </p>
          <button
            type="button"
            onClick={() => {
              clearRegistrationDraft();
              setFormValues(initialFormValues);
              setFieldErrors({});
              setFormError(null);
              setDraftRestored(false);
            }}
            className="self-start rounded-sm border border-border px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent sm:self-auto"
          >
            Clear saved details
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <div>
          <label
            htmlFor={`${formId}-fullName`}
            className="text-sm font-medium text-foreground"
          >
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id={`${formId}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={
              fieldErrors.fullName ? `${formId}-fullName-error` : undefined
            }
            value={formValues.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            onBlur={() => handleBlur("fullName")}
            className={fieldClassName}
            placeholder="John Mensah"
          />
          <FieldError
            id={`${formId}-fullName-error`}
            message={fieldErrors.fullName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="text-sm font-medium text-foreground"
          >
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
            aria-describedby={
              fieldErrors.email ? `${formId}-email-error` : undefined
            }
            value={formValues.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            className={fieldClassName}
            placeholder="you@example.com"
          />
          <FieldError
            id={`${formId}-email-error`}
            message={fieldErrors.email}
          />
        </div>

        <div
          id={`${formId}-whatsapp-note`}
          role="note"
          className="border border-accent/35 bg-background px-4 py-4"
        >
          <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Important
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            Enter the{" "}
            <span className="font-medium text-accent">
              correct WhatsApp number
            </span>{" "}
            you actively use. After your payment is verified, DWO will send your
            official confirmation message to this WhatsApp number. It is also
            used to add you to the course WhatsApp group.
          </p>
        </div>

        <CountryPhoneInput
          id={`${formId}-whatsapp`}
          label="WhatsApp Number"
          required
          descriptionId={`${formId}-whatsapp-note`}
          countryCode={formValues.countryCode}
          value={formValues.whatsapp}
          error={fieldErrors.whatsapp}
          onCountryChange={handleCountryChange}
          onChange={(value) => updateField("whatsapp", value)}
          onBlur={() => handleBlur("whatsapp")}
        />

        <CountryPhoneInput
          id={`${formId}-phone`}
          label="Phone Number"
          optionalHint
          countryCode={formValues.countryCode}
          value={formValues.phone ?? ""}
          error={fieldErrors.phone}
          onCountryChange={handleCountryChange}
          onChange={(value) => updateField("phone", value)}
          onBlur={() => handleBlur("phone")}
        />

        <CityCombobox
          id={`${formId}-location`}
          label="City / Town"
          required
          countryCode={formValues.countryCode}
          value={formValues.location}
          error={fieldErrors.location}
          onChange={(value) => updateField("location", value)}
          onBlur={() => handleBlur("location")}
        />

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
              fieldErrors.experienceLevel
                ? `${formId}-experienceLevel-error`
                : undefined
            }
            value={formValues.experienceLevel}
            onChange={(event) =>
              updateField("experienceLevel", event.target.value)
            }
            onBlur={() => handleBlur("experienceLevel")}
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
