import type { Metadata } from "next";

import { PaymentDetailsForm } from "@/components/payment/PaymentDetailsForm";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getPublicPaymentContext } from "@/lib/manual-payment-access.server";
import { masterclass } from "@/lib/masterclass";
import { isManualPaymentMode } from "@/lib/payment-mode";

export const metadata: Metadata = {
  title: `Verify Payment | ${masterclass.brand}`,
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function PaymentSubmitPage({ searchParams }: PageProps) {
  if (!isManualPaymentMode()) {
    return (
      <main className="bg-background">
        <Container className="mx-auto max-w-xl py-16">
          <h1 className="font-display text-3xl font-bold uppercase">
            Not available
          </h1>
          <ButtonLink href="/register" className="mt-8 min-h-12">
            Go to registration
          </ButtonLink>
        </Container>
      </main>
    );
  }

  const params = await searchParams;
  const token = params.token?.trim() ?? "";
  const context = token ? await getPublicPaymentContext(token) : null;

  if (!context) {
    return (
      <main className="bg-background">
        <Container className="mx-auto max-w-xl py-16">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest">
            Registration not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            We couldn&apos;t find this registration. Please restart the
            registration process or contact DWO support.
          </p>
          <ButtonLink href="/register" className="mt-8 min-h-12">
            Register again
          </ButtonLink>
        </Container>
      </main>
    );
  }

  return (
    <PaymentDetailsForm
      paymentAccessToken={context.paymentAccessToken}
      registrationReference={context.registrationReference}
      paymentStatus={context.paymentStatus}
    />
  );
}
