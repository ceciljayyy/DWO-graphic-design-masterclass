import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function FinalCTA() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="relative overflow-hidden border border-border bg-surface px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(135deg,rgba(161,15,22,0.55),transparent_58%)]"
          />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent">
                Registration starts {masterclass.registrationStarts.display}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl lg:text-5xl">
                Register for the Graphic Design & Media Class
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Course period: {masterclass.coursePeriod.display}. Rate:{" "}
                {masterclass.price.display}.
              </p>
            </div>

            <div className="flex justify-start lg:justify-end">
              <ButtonLink href="/register">REGISTER NOW</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
