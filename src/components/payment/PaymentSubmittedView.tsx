import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  HowYoullKnowConfirmed,
  WhatsAppWatchNote,
} from "@/components/payment/HowYoullKnowConfirmed";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CopyButton } from "@/components/ui/copy-button";
import { masterclass } from "@/lib/masterclass";

type PaymentSubmittedViewProps = {
  registrationReference: string;
  paymentAccessToken: string;
};

export function PaymentSubmittedView({
  registrationReference,
  paymentAccessToken,
}: PaymentSubmittedViewProps) {
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

      <Container className="mx-auto max-w-2xl pb-16 sm:pb-20">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
          Payment submitted
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-tightest text-foreground">
          Payment Submitted
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          We&apos;ve received your payment details.
        </p>

        <div className="mt-8 border border-border bg-surface p-5">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Registration reference
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="select-all font-display text-2xl font-extrabold tracking-editorial text-foreground">
              {registrationReference}
            </p>
            <CopyButton
              value={registrationReference}
              label="Copy reference"
              copiedLabel="Copied"
            />
          </div>
        </div>

        <div className="mt-4 border-2 border-accent/45 bg-accent/10 p-5">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Payment status
          </p>
          <p className="mt-2 font-display text-xl font-bold uppercase tracking-tightest text-accent">
            Awaiting verification
          </p>
        </div>

        <div className="mt-6">
          <HowYoullKnowConfirmed />
        </div>

        <div className="mt-6">
          <WhatsAppWatchNote />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`/payment?token=${encodeURIComponent(paymentAccessToken)}`}
            className="min-h-12"
          >
            View payment page
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" className="min-h-12">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
