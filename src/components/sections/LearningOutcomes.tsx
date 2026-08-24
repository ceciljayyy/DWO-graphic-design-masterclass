import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function LearningOutcomes() {
  return (
    <section id="learn" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="Skills to learn"
          title="Four confirmed creative areas"
          description="Official course skills from the Graphic Design & Media Class flyer."
        />

        <div className="mt-10 divide-y divide-border border-y border-border">
          {masterclass.skills.map((item, index) => (
            <article
              key={item.title}
              className="grid gap-2 py-5 transition-colors hover:text-accent sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-6"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                0{index + 1} —
              </p>
              <h3 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tightest text-foreground sm:text-3xl lg:text-4xl">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
