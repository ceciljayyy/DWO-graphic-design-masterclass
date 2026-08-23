import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function LearningOutcomes() {
  return (
    <section id="learn" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="What you'll learn"
          title="A clear outline of the creative areas the masterclass can cover"
          description="These are editable placeholders. Keep the structure, then replace the content with the final approved DWO curriculum."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {masterclass.learningOutcomes.map((item, index) => (
            <article
              key={item.title}
              className="group border-b border-border pb-5 pt-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-lg font-medium text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
