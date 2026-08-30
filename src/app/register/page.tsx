import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { RegistrationCountdown } from "@/components/marketing/RegistrationCountdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { masterclass } from "@/lib/masterclass";
import { createRegisterMetadata } from "@/lib/seo";

export const metadata: Metadata = createRegisterMetadata();

export default function RegisterPage() {
  return (
    <main className="bg-background">
      <Container className="py-8 sm:py-10">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6 text-sm text-muted">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label={`${masterclass.brand} home`}
          >
            <BrandLogo size="sm" priority />
            <span className="hidden font-display font-semibold uppercase tracking-[0.18em] text-foreground sm:inline">
              {masterclass.name}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <ButtonLink href="/" variant="secondary">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Container className="pb-14 sm:pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12 2xl:gap-14">
          <div className="space-y-5 lg:sticky lg:top-24">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
              Secure registration
            </p>
            <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tightest text-foreground 2xl:text-[clamp(2.75rem,3.5vw,5rem)]">
              {masterclass.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-1 block text-accent">
                {masterclass.hero.titleAccent}
              </span>
            </h1>
            <p className="text-sm leading-7 text-muted sm:text-base xl:text-lg">
              Enter your details to create a pending registration record, then
              continue to Paystack to pay the course fee securely.
            </p>
            <RegistrationCountdown compact />
            <div className="grid gap-4 border border-border bg-surface p-5 xl:p-6">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent xl:text-sm">
                  Rate
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-foreground xl:text-4xl">
                  {masterclass.price.display}
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent xl:text-sm">
                  Course Period
                </p>
                <p className="mt-2 font-display text-lg font-bold uppercase tracking-editorial text-foreground xl:text-2xl">
                  {masterclass.coursePeriod.shortDisplay}
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent xl:text-sm">
                  Registration Starts
                </p>
                <p className="mt-2 text-sm font-medium text-foreground xl:text-lg">
                  {masterclass.registrationStarts.display}
                </p>
              </div>
            </div>
          </div>

          <RegistrationForm />
        </div>
      </Container>
    </main>
  );
}
