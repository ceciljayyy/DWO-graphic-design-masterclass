"use client";

import { useEffect, useRef, useState } from "react";

import { socialProof, type SocialProofStat } from "@/lib/social-proof";

function StatIcon({ type }: { type: SocialProofStat["icon"] }) {
  const className = "h-5 w-5 text-red";

  switch (type) {
    case "students":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      );
    case "satisfaction":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M10 2h4a2 2 0 012 2v2h4a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2zm2 2v2h4V4h-4zM4 8v11h16V8H4z" />
        </svg>
      );
    case "career":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M3 17h2v4h14v-4h2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm16-8V3H5v6H3v2h18v-2h-2zm-2 0H7V5h10v4z" />
        </svg>
      );
  }
}

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    setValue(0);

    let frame = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [active, duration, target]);

  return value;
}

function AnimatedStat({ stat, active }: { stat: SocialProofStat; active: boolean }) {
  const value = useCountUp(stat.target, active);

  return (
    <div className="text-center sm:text-left">
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <StatIcon type={stat.icon} />
        <p
          aria-live="polite"
          className="font-display text-3xl font-extrabold tracking-tightest text-foreground sm:text-4xl xl:text-5xl"
        >
          {active ? value : 0}
          {stat.suffix}
        </p>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted sm:text-sm">
        {stat.label}
      </p>
    </div>
  );
}

function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewHeight * 0.9 && rect.bottom > viewHeight * 0.1;
}

export function AnimatedStatsRow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || active) {
      return;
    }

    const activate = () => {
      setActive(true);
    };

    if (isInViewport(node)) {
      activate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-8 sm:mt-12 sm:grid-cols-4 sm:gap-8 sm:py-10 xl:mt-14"
    >
      {socialProof.stats.map((stat) => (
        <AnimatedStat key={stat.id} stat={stat} active={active} />
      ))}
    </div>
  );
}
