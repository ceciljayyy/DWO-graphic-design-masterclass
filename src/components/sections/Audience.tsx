import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function Audience() {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          className="max-w-none xl:max-w-none"
          eyebrow="Who this is for"
          title="Built for creative learners"
          description="A concise view of who this class is designed to support."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:mt-12">
          {masterclass.audience.map((item) => (
            <div
              key={item.title}
              className="border border-border bg-surface p-5 xl:p-6"
            >
              <p className="font-display text-lg font-bold uppercase tracking-tightest text-foreground xl:text-xl 2xl:text-2xl">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted sm:text-base xl:text-lg">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
