import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          className="max-w-none xl:max-w-none"
          eyebrow="FAQ"
          title="Common questions"
          description="Answers based on confirmed course information. Contact us for anything not listed here."
        />

        <div className="mt-10 divide-y divide-border border-y border-border xl:mt-12">
          {masterclass.faqs.map((item, index) => (
            <details
              key={item.question}
              className="group py-4 sm:py-5 xl:py-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-medium text-foreground focus:outline-none sm:text-lg xl:text-xl">
                <h3 className="text-base font-medium sm:text-lg xl:text-xl">
                  {item.question}
                </h3>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border font-display text-lg text-muted transition-colors group-open:border-accent group-open:text-accent xl:h-10 xl:w-10 xl:text-xl">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base xl:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
