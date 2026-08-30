import { BrandLogo } from "@/components/brand/BrandLogo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-overlay"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red/80 to-transparent"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:gap-12 2xl:gap-14">
          <div className="animate-fade-up min-w-0">
            <BrandLogo size="lg" priority />

            <h1 className="mt-6 font-display text-[clamp(2.75rem,5vw,6rem)] font-extrabold uppercase leading-[0.88] tracking-tightest text-foreground 2xl:text-[clamp(3.5rem,4vw,6.5rem)]">
              {masterclass.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-1 block text-accent">
                {masterclass.hero.titleAccent}
              </span>
            </h1>

            <p className="mt-6 text-base leading-7 text-muted sm:text-lg xl:text-xl 2xl:text-2xl">
              {masterclass.hero.description}
            </p>

            <div className="mt-8 space-y-5 border-y border-border py-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:text-sm xl:text-base">
                    Rate
                  </p>
                  <p className="mt-2 font-display text-4xl font-extrabold tracking-tightest text-accent sm:text-5xl xl:text-6xl">
                    {masterclass.price.display}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:text-sm xl:text-base">
                    Course Period
                  </p>
                  <p className="mt-2 font-display text-xl font-bold uppercase tracking-editorial text-foreground sm:text-2xl xl:text-3xl 2xl:text-4xl">
                    {masterclass.coursePeriod.shortDisplay}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm xl:text-base">
                  Registration Starts On
                </p>
                <p className="mt-2 font-display text-lg font-bold uppercase tracking-editorial text-foreground sm:text-xl xl:text-2xl">
                  {masterclass.registrationStarts.shortDisplay}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" className="min-h-12 text-base xl:min-h-14 xl:px-8 xl:text-lg">
                REGISTER NOW
              </ButtonLink>
              <ButtonLink href="#about" variant="secondary" className="min-h-12 text-base xl:min-h-14 xl:px-8 xl:text-lg">
                {masterclass.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <aside className="animate-fade-up relative w-full border border-border bg-surface/80 p-5 shadow-subtle [animation-delay:120ms] sm:p-6 lg:p-7 xl:p-8">
            <div
              aria-hidden
              className="absolute inset-0 bg-panel-glow"
            />
            <div className="relative">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent xl:text-base">
                Skills to learn
              </p>
              <ul className="mt-5 divide-y divide-border/80 xl:mt-6">
                {masterclass.skills.map((skill, index) => (
                  <li
                    key={skill.title}
                    className="py-4 first:pt-0 last:pb-0 xl:py-5"
                  >
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted xl:text-sm">
                      0{index + 1}
                    </p>
                    <p className="mt-1.5 font-display text-2xl font-extrabold uppercase leading-none tracking-tightest text-foreground sm:text-3xl xl:text-4xl 2xl:text-[2.75rem]">
                      {skill.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
