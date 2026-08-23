import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCTA() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="border border-foreground bg-foreground px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/70">
                Ready to take your design skills further?
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-editorial sm:text-4xl lg:text-5xl">
                Register for the masterclass when the full registration flow is ready.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                This section is positioned as a strong conversion moment while keeping the Phase 2 build focused on the public landing experience.
              </p>
            </div>

            <div className="flex justify-start lg:justify-end">
              <ButtonLink href="/register">REGISTER FOR THE MASTERCLASS</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
