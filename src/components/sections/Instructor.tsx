import Image from "next/image";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

const instructorFramePath =
  "M0.08 0.03 C0.34 -0.01 0.7 0.01 0.9 0.07 L1 0.18 L0.96 0.78 C0.93 0.9 0.78 0.98 0.58 1 L0.12 0.96 C0.04 0.94 0 0.86 0 0.76 L0.03 0.22 C0.04 0.12 0.05 0.05 0.08 0.03 Z";

export function Instructor() {
  return (
    <section id="instructor" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <svg width={0} height={0} className="absolute" aria-hidden>
              <defs>
                <clipPath
                  id="instructor-portrait-frame"
                  clipPathUnits="objectBoundingBox"
                >
                  <path d={instructorFramePath} />
                </clipPath>
              </defs>
            </svg>

            <div
              aria-hidden
              className="absolute inset-[6%] translate-x-3 translate-y-4 bg-accent/35 sm:translate-x-4 sm:translate-y-5"
              style={{ clipPath: "url(#instructor-portrait-frame)" }}
            />
            <div
              aria-hidden
              className="absolute inset-[3%] -translate-x-2 translate-y-2 bg-red/45 sm:-translate-x-3"
              style={{ clipPath: "url(#instructor-portrait-frame)" }}
            />

            <div
              className="relative aspect-[4/5] overflow-hidden bg-background"
              style={{ clipPath: "url(#instructor-portrait-frame)" }}
            >
              <Image
                src={masterclass.instructor.imageSrc}
                alt={masterclass.instructor.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-[center_12%]"
                priority={false}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent"
              />
            </div>
          </div>

          <div>
            <BrandLogo size="md" className="mb-8" />

            <SectionHeading
              eyebrow={masterclass.instructor.sectionLabel}
              title={masterclass.instructor.name}
            />

            <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.26em] text-accent">
              {masterclass.instructor.role}
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted sm:text-base">
              {masterclass.instructor.bio}
            </p>

            <a
              href={masterclass.contact.instagram.href}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex max-w-full flex-col gap-2 border-t border-border pt-6 transition-colors"
            >
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.32em] text-muted transition-colors group-hover:text-accent">
                {masterclass.contact.instagram.label}
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tightest text-foreground transition-colors group-hover:text-accent sm:text-3xl">
                {masterclass.contact.instagram.handle}
              </span>
              <span
                aria-hidden
                className="h-px w-16 bg-accent transition-all duration-300 group-hover:w-28"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
