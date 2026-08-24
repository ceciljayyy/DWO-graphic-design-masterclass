import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { masterclass } from "@/lib/masterclass";

export default function RegisterPage() {
  return (
    <main className="bg-background">
      <Container className="py-8 sm:py-10">
        <div className="flex items-center justify-between border-b border-border pb-6 text-sm text-muted">
          <span className="font-display font-semibold uppercase tracking-[0.18em] text-foreground">
            {masterclass.name}
          </span>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </Container>

      <Container className="pb-14 sm:pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
              Secure registration
            </p>
            <h1 className="max-w-xl font-display text-4xl font-bold uppercase tracking-tightest text-foreground sm:text-5xl lg:text-6xl">
              Save your place for the Graphic Design & Media Class
            </h1>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              Enter your details to create a pending registration record.
              Payment processing is intentionally not connected yet and will be
              introduced in Phase 4.
            </p>
            <div className="grid gap-3 border border-border bg-surface p-5 sm:grid-cols-2">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                  Rate
                </p>
                <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  {masterclass.price.display}
                </p>
              </div>
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                  Course Period
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {masterclass.coursePeriod.display}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                  Registration Starts
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
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
