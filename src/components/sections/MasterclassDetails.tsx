import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function MasterclassDetails() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="Masterclass details"
          title="A clean information block with clearly marked placeholders"
          description="Nothing here should be treated as final event information until the DWO details are supplied."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {masterclass.details.map((item) => (
            <article key={item.label} className="border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-medium text-foreground">{item.value}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
