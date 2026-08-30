import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { portfolioSection } from "@/lib/portfolio";

export function SelectedWork() {
  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-border bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,var(--body-glow),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(161,15,22,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_18%,rgba(244,185,66,0.08),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(161,15,22,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
      />

      <Container className="relative py-14 sm:py-16 lg:py-20 xl:py-24">
        <SectionHeading
          align="center"
          className="mx-auto max-w-3xl xl:max-w-4xl"
          eyebrow={portfolioSection.eyebrow}
          title={portfolioSection.title}
          description={portfolioSection.description}
        />

        <PortfolioGallery className="mt-10 sm:mt-12 lg:mt-14" />
      </Container>
    </section>
  );
}
