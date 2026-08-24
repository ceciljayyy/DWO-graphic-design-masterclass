import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Answers based on confirmed course information. Contact us for anything not listed here."
        />

        <div className="mt-10 divide-y divide-border border-y border-border">
          {masterclass.faqs.map((item, index) => (
            <details
              key={item.question}
              className="group py-4 sm:py-5"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-medium text-foreground focus:outline-none">
                <span>{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border font-display text-lg text-muted transition-colors group-open:border-accent group-open:text-accent">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
