import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function AboutMasterclass() {
  return (
    <section id="about" className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12 2xl:gap-14">
          <SectionHeading
            className="max-w-none xl:max-w-none"
            eyebrow="Introduction"
            title={masterclass.intro.title}
            description={masterclass.intro.body}
          />

          <div className="grid gap-6 border border-border bg-surface p-6 sm:p-8 xl:p-10">
            <p className="text-sm leading-7 text-muted sm:text-base xl:text-lg 2xl:text-xl">
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
                <div key={item.label} className="border-t border-border pt-4 xl:pt-5">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent xl:text-sm">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground sm:text-base xl:text-lg 2xl:text-xl">
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
