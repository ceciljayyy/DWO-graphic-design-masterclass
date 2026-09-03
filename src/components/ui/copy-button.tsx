"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Icon-first compact control for mobile number copy */
  iconOnlyOnMobile?: boolean;
  ariaLabel?: string;
};

function CopyIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
    >
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M5 12.5 9.5 17 19 7.5" />
    </svg>
  );
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  iconOnlyOnMobile = false,
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable; value remains selectable in the UI.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? (copied ? copiedLabel : label)}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
        iconOnlyOnMobile && "px-3 sm:px-4",
        className,
      )}
    >
      {copied ? (
        <>
          <CheckIcon />
          <span className={iconOnlyOnMobile ? "hidden sm:inline" : undefined}>
            {copiedLabel}
          </span>
        </>
      ) : (
        <>
          {iconOnlyOnMobile ? (
            <>
              <span className="sm:hidden">
                <CopyIcon />
              </span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </>
      )}
    </button>
  );
}
