"use client";

import { useEffect, useState } from "react";

import { CrossfadeImage } from "@/components/ui/crossfade-image";
import {
  getTransformationSlideCount,
  studentTransformationSlides,
  type TransformationSlide,
} from "@/lib/student-transformation";
import { socialProof } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

function TransformationPanel({
  label,
  labelClassName,
  slides,
  activeIndex,
  priority,
}: {
  label: string;
  labelClassName: string;
  slides: TransformationSlide[];
  activeIndex: number;
  priority?: boolean;
}) {
  const slideIndex = activeIndex % slides.length;
  const slide = slides[slideIndex];

  return (
    <div className="flex min-w-0 flex-col">
      <span
        className={cn(
          "inline-flex w-fit px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-xs",
          labelClassName,
        )}
      >
        {label}
      </span>

      <div className="relative mt-5 aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
        <CrossfadeImage
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 1024px) 88vw, 28rem"
          priority={priority && slideIndex === 0}
          durationMs={900}
        />
      </div>

      <p className="mt-4 text-center font-display text-[11px] uppercase tracking-[0.24em] text-muted transition-opacity duration-500 sm:text-xs lg:text-left">
        {formatCount(slideIndex + 1)} / {formatCount(slides.length)}
      </p>
    </div>
  );
}

export function TransformationShowcase() {
  const { transformation } = socialProof;
  const slideCount = getTransformationSlideCount();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const nextIndex = (activeIndex + 1) % slideCount;
    const beforeSlide = studentTransformationSlides.before[nextIndex % studentTransformationSlides.before.length];
    const afterSlide = studentTransformationSlides.after[nextIndex % studentTransformationSlides.after.length];

    [beforeSlide.src, afterSlide.src].forEach((slideSrc) => {
      const img = new window.Image();
      img.src = slideSrc;
    });
  }, [activeIndex, ready, slideCount]);

  useEffect(() => {
    if (!ready || paused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, studentTransformationSlides.intervalMs);

    return () => window.clearInterval(interval);
  }, [paused, ready, slideCount]);

  return (
    <div
      className="mt-10 border border-border bg-surface/60 p-5 sm:mt-12 sm:p-8 xl:mt-14 xl:p-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent sm:text-sm">
        {transformation.title}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-6">
        <TransformationPanel
          label={transformation.beforeLabel}
          labelClassName="border border-red/40 bg-red/10 text-red"
          slides={[...studentTransformationSlides.before]}
          activeIndex={activeIndex}
          priority
        />

        <div className="flex flex-col items-center justify-center gap-4 lg:pt-16">
          <div
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-display text-xl text-accent"
          >
            →
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show transformation slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full border transition-all duration-500",
                  index === activeIndex
                    ? "scale-110 border-accent bg-accent"
                    : "border-border bg-background hover:border-accent/60",
                )}
              />
            ))}
          </div>
        </div>

        <TransformationPanel
          label={transformation.afterLabel}
          labelClassName="border border-accent/40 bg-accent/10 text-accent"
          slides={[...studentTransformationSlides.after]}
          activeIndex={activeIndex}
        />
      </div>

      <div className="mt-8 grid gap-4 border-t border-border pt-6 lg:grid-cols-2 lg:gap-8">
        <p className="text-center text-sm leading-7 text-muted lg:text-left">
          {transformation.beforeSummary}
        </p>
        <p className="text-center text-sm leading-7 text-muted lg:text-left">
          {transformation.afterSummary}
        </p>
      </div>
    </div>
  );
}
