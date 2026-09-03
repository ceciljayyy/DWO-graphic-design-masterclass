import type { Metadata } from "next";

import { PaymentSubmittedView } from "@/components/payment/PaymentSubmittedView";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getPublicPaymentContext } from "@/lib/manual-payment-access.server";
import { masterclass } from "@/lib/masterclass";

export const metadata: Metadata = {
  title: `Payment Submitted | ${masterclass.brand}`,
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function PaymentSubmittedPage({ searchParams }: PageProps) {
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
          <ButtonLink href="/register" className="mt-8 min-h-12">
            Register again
          </ButtonLink>
        </Container>
      </main>
    );
  }

  return (
    <PaymentSubmittedView
      registrationReference={context.registrationReference}
      paymentAccessToken={context.paymentAccessToken}
    />
  );
}
