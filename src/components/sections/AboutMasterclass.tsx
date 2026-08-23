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

          <div className="grid gap-4 border border-border bg-surface p-6 sm:p-8">
            <p className="text-sm leading-7 text-muted">{masterclass.intro.bodySecondary}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Brand-ready structure",
                "Mobile-first conversion flow",
                "Future registration ready",
              ].map((item) => (
                <div key={item} className="border-t border-border pt-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
