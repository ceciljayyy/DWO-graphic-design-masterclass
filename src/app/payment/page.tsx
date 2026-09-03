import type { Metadata } from "next";

import { ManualPaymentInstructions } from "@/components/payment/ManualPaymentInstructions";
import { getPublicPaymentContext } from "@/lib/manual-payment-access.server";
import { masterclass } from "@/lib/masterclass";
import { isManualPaymentMode } from "@/lib/payment-mode";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: `Complete Payment | ${masterclass.brand}`,
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ManualPaymentPage({ searchParams }: PageProps) {
  if (!isManualPaymentMode()) {
    return (
      <main className="bg-background">
        <Container className="mx-auto max-w-xl py-16">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest">
            Online checkout
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Manual Mobile Money checkout is not active. Continue payment from
            your registration confirmation.
          </p>
          <ButtonLink href="/register" className="mt-8 min-h-12">
            Go to registration
          </ButtonLink>
        </Container>
      </main>
    );
  }

  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  if (!token) {
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

  const context = await getPublicPaymentContext(token);

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

  return <ManualPaymentInstructions context={context} />;
}
