import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function FinalCTA() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="relative overflow-hidden border border-border bg-surface px-6 py-10 sm:px-8 sm:py-12 lg:px-10 xl:px-12 xl:py-14">
          <div
            aria-hidden
            className="absolute inset-0 bg-cta-glow"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-14">
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent sm:text-sm xl:text-base">
                Registration starts {masterclass.registrationStarts.display}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
                Register for the Graphic Design & Media Class
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base xl:text-lg 2xl:text-xl">
                Course period: {masterclass.coursePeriod.display}. Rate:{" "}
                {masterclass.price.display}.
              </p>
            </div>

            <div className="flex shrink-0 justify-start lg:justify-end">
              <ButtonLink href="/register" className="min-h-12 text-base xl:min-h-14 xl:px-8 xl:text-lg">
                REGISTER NOW
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
