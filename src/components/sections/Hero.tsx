import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-muted sm:text-sm">
              {masterclass.hero.eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-medium tracking-editorial text-foreground sm:text-6xl lg:text-7xl">
              {masterclass.hero.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              {masterclass.hero.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Date</p>
                <p className="mt-2 text-sm font-medium text-foreground">{masterclass.hero.date}</p>
              </div>
              <div className="border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Location</p>
                <p className="mt-2 text-sm font-medium text-foreground">{masterclass.hero.location}</p>
              </div>
              <div className="border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Price</p>
                <p className="mt-2 text-sm font-medium text-foreground">{masterclass.hero.price}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">REGISTER NOW</ButtonLink>
              <ButtonLink href="#about" variant="secondary">
                {masterclass.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted">Editorial preview</p>
              <span className="rounded-full border border-accent px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                Preview
              </span>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="aspect-[4/5] border border-border bg-background p-4">
                <div className="flex h-full flex-col justify-between border border-dashed border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">DWO</p>
                  <div>
                    <p className="max-w-[10ch] text-4xl font-medium leading-none tracking-editorial text-foreground sm:text-5xl">
                      Design
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-muted">
                      Placeholder visual panel
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted">
                Use this right-hand panel for future photography, poster art, or a refined campaign image once final assets are supplied.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
