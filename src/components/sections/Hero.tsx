import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(161,15,22,0.42),transparent_36%),linear-gradient(180deg,rgba(8,8,8,0.15),rgba(8,8,8,0.92)_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red/80 to-transparent"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-14">
          <div className="animate-fade-up max-w-3xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent sm:text-sm">
              {masterclass.hero.eyebrow}
            </p>

            <h1 className="mt-5 font-display text-[clamp(2.75rem,12vw,6.5rem)] font-extrabold uppercase leading-[0.88] tracking-tightest text-foreground">
              {masterclass.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-1 block text-accent">
                {masterclass.hero.titleAccent}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              {masterclass.hero.description}
            </p>

            <div className="mt-8 space-y-4 border-y border-border py-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    Rate
                  </p>
                  <p className="mt-1 font-display text-4xl font-extrabold tracking-tightest text-accent sm:text-5xl">
                    {masterclass.price.display}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    Course Period
                  </p>
                  <p className="mt-1 font-display text-lg font-bold uppercase tracking-editorial text-foreground sm:text-xl">
                    {masterclass.coursePeriod.shortDisplay}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                  Registration Starts On
                </p>
                <p className="mt-1 font-display text-base font-bold uppercase tracking-editorial text-foreground sm:text-lg">
                  {masterclass.registrationStarts.shortDisplay}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">REGISTER NOW</ButtonLink>
              <ButtonLink href="#about" variant="secondary">
                {masterclass.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <aside className="animate-fade-up relative border border-border bg-surface/80 p-5 shadow-subtle [animation-delay:120ms] sm:p-6">
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(155deg,rgba(161,15,22,0.38),transparent_55%)]"
            />
            <div className="relative">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Skills to learn
              </p>
              <ul className="mt-6 space-y-0">
                {masterclass.skills.map((skill, index) => (
                  <li
                    key={skill.title}
                    className="border-t border-border/80 py-3 first:border-t-0 first:pt-0"
                  >
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
                      0{index + 1}
                    </p>
                    <p className="mt-1 font-display text-2xl font-extrabold uppercase leading-none tracking-tightest text-foreground sm:text-3xl">
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
