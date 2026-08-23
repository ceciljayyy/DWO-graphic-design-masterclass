import Link from "next/link";

import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:gap-8">
        <div>
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center border border-foreground/10 bg-background text-sm font-semibold tracking-[0.24em] text-foreground">
              DWO
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.26em] text-foreground">
              {masterclass.name}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            {masterclass.footer.description}
          </p>
          <p className="mt-4 text-sm text-muted">{masterclass.footer.contact}</p>
          <p className="mt-2 text-sm text-muted">{masterclass.footer.social}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Navigation</p>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            {masterclass.navigation.map((item) => (
              <a key={item.label} href={item.href} className="text-foreground transition-colors hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Connect</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            {masterclass.footer.social}
          </p>
          <Link href="/register" className="mt-6 inline-flex text-sm font-medium text-accent hover:underline">
            Register now
          </Link>
        </div>
      </Container>

      <Container className="border-t border-border py-4 text-xs text-muted sm:text-sm">
        Copyright © DWO Graphic Design Masterclass. All rights reserved.
      </Container>
    </footer>
  );
}
