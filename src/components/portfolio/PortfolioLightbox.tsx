"use client";

import Image from "next/image";
import { useEffect } from "react";

import type { PortfolioItem } from "@/lib/portfolio";

type PortfolioLightboxProps = {
  item: PortfolioItem;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  indexLabel: string;
};

export function PortfolioLightbox({
  item,
  open,
  onClose,
  onPrev,
  onNext,
  indexLabel,
}: PortfolioLightboxProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrev();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, onNext, onPrev]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.category} project preview`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project preview"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center border border-border bg-surface/80 text-foreground transition-colors hover:border-accent hover:text-accent sm:right-8 sm:top-8"
      >
        ×
      </button>

      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous project"
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center border border-border bg-surface/80 px-3 py-4 text-foreground transition-colors hover:border-accent hover:text-accent sm:inline-flex"
      >
        ←
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next project"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center border border-border bg-surface/80 px-3 py-4 text-foreground transition-colors hover:border-accent hover:text-accent sm:inline-flex"
      >
        →
      </button>

      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col items-center justify-center">
        <Image
          key={item.id}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
          className="block h-auto w-auto max-h-[min(85vh,48rem)] max-w-[min(92vw,56rem)] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          style={{ width: "auto", height: "auto" }}
        />
        <div className="mt-5 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.34em] text-accent">
            {item.category}
          </p>
          <p className="mt-2 font-display text-sm uppercase tracking-[0.28em] text-muted">
            {indexLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
