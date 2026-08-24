import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex items-center justify-between gap-3 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label={`${masterclass.brand} home`}
          >
            <BrandLogo size="sm" priority />
            <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.22em] text-foreground sm:inline-flex">
              {masterclass.shortName}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-6 lg:flex">
            <nav
              aria-label="Primary"
              className="flex items-center gap-6 text-sm text-muted"
            >
              {masterclass.navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <ButtonLink href="/register">REGISTER NOW</ButtonLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <ButtonLink
              href="/register"
              className="px-3 py-2 text-xs sm:px-4 sm:py-2.5"
            >
              REGISTER
            </ButtonLink>

            <details className="group relative">
              <summary className="list-none cursor-pointer rounded-sm border border-border bg-surface px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition-colors hover:border-accent hover:text-accent sm:px-4 sm:py-2.5">
                Menu
              </summary>
              <div className="absolute right-0 mt-3 w-[min(18rem,calc(100vw-2rem))] border border-border bg-surface p-4 shadow-subtle">
                <nav
                  aria-label="Mobile primary"
                  className="flex flex-col gap-3 text-sm"
                >
                  {masterclass.navigation.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="border-b border-border pb-3 text-foreground last:border-b-0 last:pb-0"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-4">
                  <ButtonLink href="/register" className="w-full">
                    REGISTER NOW
                  </ButtonLink>
                </div>
              </div>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}
