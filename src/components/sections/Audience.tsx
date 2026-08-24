import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function Audience() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="Who this is for"
          title="Built for creative learners"
          description="A concise view of who this class is designed to support."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {masterclass.audience.map((item) => (
            <div key={item.title} className="border border-border bg-surface p-5">
              <p className="font-display text-lg font-bold uppercase tracking-tightest text-foreground">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
