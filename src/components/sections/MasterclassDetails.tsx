import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function MasterclassDetails() {
  return (
    <section id="details" className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="Course details"
          title="Confirmed information"
          description="Only verified course period, registration opening date, and rate are shown here."
        />

        <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
          {masterclass.details.map((item) => (
            <article
              key={item.label}
              className="bg-surface px-5 py-6 sm:px-6 sm:py-8"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                {item.label}
              </p>
              <p
                className={
                  item.label === "Rate"
                    ? "mt-3 font-display text-3xl font-extrabold tracking-tightest text-foreground"
                    : "mt-3 font-display text-xl font-bold uppercase tracking-editorial text-foreground sm:text-2xl"
                }
              >
                {item.value}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
