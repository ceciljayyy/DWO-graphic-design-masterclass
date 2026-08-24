import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function AboutMasterclass() {
  return (
    <section id="about" className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Introduction"
            title={masterclass.intro.title}
            description={masterclass.intro.body}
          />

          <div className="grid gap-6 border border-border bg-surface p-6 sm:p-8">
            <p className="text-sm leading-7 text-muted">
              {masterclass.intro.bodySecondary}
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  label: "Course Period",
                  value: masterclass.coursePeriod.shortDisplay,
                },
                {
                  label: "Registration Starts",
                  value: masterclass.registrationStarts.shortDisplay,
                },
                {
                  label: "Rate",
                  value: masterclass.price.display,
                },
              ].map((item) => (
                <div key={item.label} className="border-t border-border pt-4">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
