"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CrossfadeLayer = {
  src: string;
  alt: string;
  id: number;
};

type CrossfadeImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  durationMs?: number;
} & Pick<ImageProps, "fill" | "width" | "height" | "sizes" | "priority" | "style">;

export function CrossfadeImage({
  src,
  alt,
  className,
  imageClassName,
  durationMs = 800,
  style,
  ...imageProps
}: CrossfadeImageProps) {
  const idRef = useRef(0);
  const currentLayerRef = useRef<CrossfadeLayer>({ src, alt, id: 0 });
  const [current, setCurrent] = useState<CrossfadeLayer>(currentLayerRef.current);
  const [previous, setPrevious] = useState<CrossfadeLayer | null>(null);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    if (src === currentLayerRef.current.src) {
      return;
    }

    let cancelled = false;
    let outerFrame = 0;
    let innerFrame = 0;
    let cleanupTimer = 0;
    const preload = new window.Image();
    preload.src = src;

    const begin = () => {
      if (cancelled) {
        return;
      }

      setPrevious(currentLayerRef.current);
      setShowPrevious(true);
      setShowCurrent(false);

      idRef.current += 1;
      const nextLayer = { src, alt, id: idRef.current };
      currentLayerRef.current = nextLayer;
      setCurrent(nextLayer);

      outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          setShowCurrent(true);
          setShowPrevious(false);
        });
      });

      cleanupTimer = window.setTimeout(() => {
        if (!cancelled) {
          setPrevious(null);
        }
      }, durationMs + 120);
    };

    if (preload.complete) {
      begin();
    } else {
      preload.onload = begin;
      preload.onerror = begin;
    }

    return () => {
      cancelled = true;
      preload.onload = null;
      preload.onerror = null;

      if (outerFrame) {
        cancelAnimationFrame(outerFrame);
      }

      if (innerFrame) {
        cancelAnimationFrame(innerFrame);
      }

      if (cleanupTimer) {
        window.clearTimeout(cleanupTimer);
      }
    };
  }, [alt, durationMs, src]);

  const transitionStyle = {
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  } as const;

  const imageStyle = imageProps.fill ? transitionStyle : { ...style, ...transitionStyle };

  function renderLayer(layer: CrossfadeLayer, visible: boolean, isCurrent: boolean) {
    return (
      <Image
        key={layer.id}
        src={layer.src}
        alt={isCurrent ? layer.alt : ""}
        aria-hidden={!isCurrent}
        {...imageProps}
        style={imageStyle}
        className={cn(
          imageClassName,
          imageProps.fill
            ? "absolute inset-0 object-contain object-center"
            : "absolute left-0 top-0 block h-full w-full object-contain",
          "transition-opacity ease-out",
          visible ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0",
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative",
        imageProps.fill ? "h-full w-full" : "inline-block",
        className,
      )}
      style={imageProps.fill ? undefined : style}
    >
      {previous ? renderLayer(previous, showPrevious, false) : null}
      {renderLayer(current, showCurrent, true)}
    </div>
  );
}
