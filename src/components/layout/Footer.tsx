import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/container";
import { masterclass } from "@/lib/masterclass";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-8">
        <div>
          <div className="inline-flex items-center gap-4">
            <BrandLogo size="md" />
            <span className="max-w-[12rem] font-display text-sm font-semibold uppercase tracking-[0.22em] text-foreground">
              {masterclass.name}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            {masterclass.footer.description}
          </p>
        </div>

        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Navigation
          </p>
          <nav className="mt-4 flex flex-col gap-3 text-sm">
            {masterclass.navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Contact
          </p>
          <div className="mt-4 grid gap-2 text-sm leading-7 text-muted">
            {masterclass.contact.phoneNumbers.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="transition-colors hover:text-accent"
              >
                {phone.label}
              </a>
            ))}
            <a
              href={masterclass.contact.instagram.href}
              className="group mt-1 inline-flex flex-col gap-1 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
                Instagram
              </span>
              <span className="text-foreground transition-colors group-hover:text-accent">
                {masterclass.contact.instagram.handle}
              </span>
            </a>
          </div>
          <Link
            href="/register"
            className="mt-6 inline-flex font-display text-sm font-bold uppercase tracking-[0.18em] text-accent hover:underline"
          >
            Register now
          </Link>
        </div>
      </Container>

      <Container className="border-t border-border py-4 text-xs text-muted sm:text-sm">
        © DWO Graphic Design & Media Class. All rights reserved.
      </Container>
    </footer>
  );
}
