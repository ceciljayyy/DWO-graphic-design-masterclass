import { Container } from "@/components/ui/container";
import { AnimatedStatsRow } from "@/components/social-proof/AnimatedStatsRow";
import { TransformationShowcase } from "@/components/social-proof/TransformationShowcase";
import {
  highlightQuoteText,
  socialProof,
  type SocialProofTransformationImage,
} from "@/lib/social-proof";
import { cn } from "@/lib/utils";

function StarRating() {
  return (
    <div
      aria-label="5 out of 5 stars"
      className="flex items-center gap-0.5 text-accent"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden className="text-sm leading-none">
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof socialProof.testimonials)[number];
}) {
  const parts = highlightQuoteText(testimonial.quote, [...testimonial.highlights]);

  return (
    <article className="flex h-full flex-col border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background font-display text-sm font-bold uppercase tracking-[0.12em] text-accent"
        >
          {testimonial.initials}
        </div>
        <StarRating />
      </div>

      <blockquote className="mt-5 flex-1 text-sm leading-7 text-muted sm:text-base">
        <span aria-hidden className="mr-1 font-display text-2xl leading-none text-red">
          “
        </span>
        {parts.map((part, index) => (
          <span
            key={`${part.text}-${index}`}
            className={cn(part.highlighted && "font-medium text-accent")}
          >
            {part.text}
          </span>
        ))}
      </blockquote>

      <footer className="mt-6 border-t border-border pt-4">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground">
          {testimonial.name}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted sm:text-sm">
          {testimonial.role}
        </p>
      </footer>
    </article>
  );
}

export function StudentSuccess() {
  const { featuredQuote, classPhotos } = socialProof;

  return (
    <section id="success" className="border-t border-border bg-background">
      <Container className="py-14 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-4xl text-center xl:max-w-5xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent sm:text-sm xl:text-base">
            {socialProof.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[4.25rem]">
            {socialProof.titleLead}{" "}
            <span className="text-red">{socialProof.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base xl:text-lg 2xl:text-xl">
            {socialProof.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:mt-14 xl:grid-cols-4 xl:gap-5">
          {socialProof.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <AnimatedStatsRow />

        <TransformationShowcase />

        {classPhotos.images.length > 0 ? (
          <div className="mt-10 sm:mt-12 xl:mt-14">
            <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent sm:text-sm">
              {classPhotos.title}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-muted">
              {classPhotos.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classPhotos.images.map((image: SocialProofTransformationImage) => (
                <div
                  key={image.src}
                  className="overflow-hidden border border-border bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <figure className="mt-10 border border-border bg-surface p-6 sm:mt-12 sm:p-8 xl:mt-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <blockquote className="text-base leading-8 text-muted sm:text-lg xl:text-xl">
              <span aria-hidden className="mr-2 font-display text-4xl leading-none text-accent">
                “
              </span>
              {featuredQuote.quote}
            </blockquote>
            <figcaption className="border-border lg:border-l lg:pl-8">
              <p className="font-display text-lg font-bold uppercase tracking-[0.16em] text-foreground">
                {featuredQuote.name}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted">
                {featuredQuote.role}
              </p>
            </figcaption>
          </div>
        </figure>
      </Container>
    </section>
  );
}
