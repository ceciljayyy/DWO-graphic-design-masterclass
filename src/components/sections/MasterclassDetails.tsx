import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function MasterclassDetails() {
  return (
    <section id="details" className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          className="max-w-none xl:max-w-none"
          eyebrow="Course details"
          title="Confirmed information"
          description="Only verified course period, registration opening date, and rate are shown here."
        />

        <div className="mt-10 grid gap-px bg-border sm:grid-cols-3 xl:mt-12">
          {masterclass.details.map((item) => (
            <article
              key={item.label}
              className="bg-surface px-5 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm xl:text-base">
                {item.label}
              </p>
              <p
                className={
                  item.label === "Rate"
                    ? "mt-3 font-display text-3xl font-extrabold tracking-tightest text-foreground xl:text-5xl 2xl:text-6xl"
                    : "mt-3 font-display text-xl font-bold uppercase tracking-editorial text-foreground sm:text-2xl xl:text-3xl 2xl:text-4xl"
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
