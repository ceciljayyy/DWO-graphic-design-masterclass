"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

import { PortfolioLightbox } from "@/components/portfolio/PortfolioLightbox";
import {
  getPortfolioDisplaySize,
  getPortfolioNeighbors,
  portfolioItems,
  type PortfolioItem,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type PortfolioGalleryProps = {
  className?: string;
};

function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

function GalleryArtwork({
  item,
  offset,
  isActive,
  onSelect,
}: {
  item: PortfolioItem;
  offset: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const distance = Math.abs(offset);
  const isEdge = distance === 2;
  const role = isActive ? "hero" : distance === 1 ? "near" : "far";
  const displaySize = getPortfolioDisplaySize(item, role);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View ${item.category}: ${item.alt}`}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group absolute left-1/2 top-1/2 origin-center transition-[transform,opacity,filter] duration-500 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive ? "z-30 cursor-default" : "z-10 cursor-pointer hover:z-20",
      )}
      style={{
        transform: `
          translate(-50%, -50%)
          translateX(${offset * 19}vw)
          translateZ(${isActive ? 120 : 40 - distance * 28}px)
          rotateY(${offset * -16}deg)
          scale(${isActive ? 1 : distance === 1 ? 0.82 : 0.66})
        `,
        opacity: isActive ? 1 : distance === 1 ? 0.78 : 0.52,
        filter: isActive
          ? "brightness(1.04)"
          : `brightness(${0.92 - distance * 0.06}) blur(${isEdge ? 0.4 : 0}px)`,
      }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(min-width: 1024px) 30rem, 90vw"
        draggable={false}
        priority={isActive}
        className={cn(
          "block select-none object-contain",
          isActive
            ? "drop-shadow-[0_28px_70px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_28px_70px_rgba(0,0,0,0.55)]"
            : "drop-shadow-[0_18px_40px_rgba(0,0,0,0.28)] dark:drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        )}
        style={{
          height: displaySize.height,
          width: displaySize.width,
        }}
      />
    </button>
  );
}

export function PortfolioGallery({ className }: PortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = portfolioItems.length;
  const activeItem = portfolioItems[activeIndex];
  const indexLabel = `${formatCount(activeIndex + 1)} / ${formatCount(total)}`;
  const heroSize = getPortfolioDisplaySize(activeItem, "hero");

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;

    if (startX === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;

    if (Math.abs(delta) > 48) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (lightboxOpen) {
        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrev();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, lightboxOpen]);

  const neighbors = getPortfolioNeighbors(activeIndex, total, 2);

  return (
    <>
      <div className={cn("relative", className)}>
        <div className="relative hidden min-h-[42rem] lg:block xl:min-h-[46rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[8%] bottom-[8%] h-32 rounded-[100%] bg-gradient-to-t from-accent/10 via-accent/5 to-transparent blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
          />

          <div
            className="relative mx-auto flex min-h-[42rem] max-w-[88rem] items-center justify-center [perspective:1400px] xl:min-h-[46rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {neighbors.map(({ itemIndex, offset }) => (
              <GalleryArtwork
                key={`${portfolioItems[itemIndex].id}-${offset}`}
                item={portfolioItems[itemIndex]}
                offset={offset}
                isActive={offset === 0}
                onSelect={() => {
                  if (offset !== 0) {
                    goTo(itemIndex);
                  }
                }}
              />
            ))}
          </div>

          <div className="relative z-40 mx-auto mt-2 max-w-xl text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent">
              {activeItem.category}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous project"
                className="inline-flex h-11 w-11 items-center justify-center border border-border bg-surface/80 text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                ←
              </button>
              <p className="font-display text-sm uppercase tracking-[0.28em] text-muted">
                {indexLabel}
              </p>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next project"
                className="inline-flex h-11 w-11 items-center justify-center border border-border bg-surface/80 text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.28em] text-foreground transition-colors hover:text-accent"
            >
              View project
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div
          className="lg:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative mx-auto flex max-w-md justify-center px-2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 -bottom-6 h-24 rounded-[100%] bg-accent/10 blur-3xl"
            />
            <Image
              key={activeItem.id}
              src={activeItem.src}
              alt={activeItem.alt}
              width={activeItem.width}
              height={activeItem.height}
              sizes="(max-width: 768px) 92vw, 420px"
              priority
              className="block select-none object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)] dark:drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
              style={{
                height: heroSize.height,
                width: heroSize.width,
                maxWidth: "100%",
              }}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent">
              {activeItem.category}
            </p>
            <div className="mt-6 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous project"
                className="inline-flex h-11 w-11 items-center justify-center border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                ←
              </button>
              <p className="font-display text-sm uppercase tracking-[0.28em] text-muted">
                {indexLabel}
              </p>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next project"
                className="inline-flex h-11 w-11 items-center justify-center border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.28em] text-foreground transition-colors hover:text-accent"
            >
              View project
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      <PortfolioLightbox
        item={activeItem}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
        indexLabel={indexLabel}
      />
    </>
  );
}
