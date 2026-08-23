import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { masterclass } from "@/lib/masterclass";

export function Instructor() {
  return (
    <section id="instructor" className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden border border-border bg-background">
            <div className="relative aspect-[4/5]">
              <Image
                src="/instructor-placeholder.svg"
                alt={masterclass.instructor.imageAlt}
                fill
                priority={false}
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={masterclass.instructor.sectionLabel}
              title={masterclass.instructor.name}
              description={masterclass.instructor.bio}
            />

            <p className="mt-6 text-sm uppercase tracking-[0.26em] text-muted">
              {masterclass.instructor.role}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {masterclass.instructor.details.map((detail) => (
                <div key={detail} className="border-t border-border pt-4 text-sm text-foreground">
                  {detail}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
