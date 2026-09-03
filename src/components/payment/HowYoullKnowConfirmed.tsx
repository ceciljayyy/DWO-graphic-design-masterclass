import type { ReactNode } from "react";

type HowYoullKnowConfirmedProps = {
  variant?: "submitted" | "compact";
};

export function HowYoullKnowConfirmed({
  variant = "submitted",
}: HowYoullKnowConfirmedProps) {
  return (
    <aside className="relative overflow-hidden border-2 border-accent/40 bg-surface p-5">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 bg-accent"
      />
      <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
        How you&apos;ll know you&apos;re confirmed
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground/90">
        <li>
          <span className="font-extrabold text-accent">
            1. WhatsApp confirmation message
          </span>
          <br />
          After DWO verifies your Mobile Money payment, we&apos;ll send a
          confirmation WhatsApp message to the{" "}
          <span className="font-semibold text-foreground">
            WhatsApp number you registered with
          </span>
          . That message is your official confirmation — no login required.
        </li>
        {variant === "submitted" ? (
          <li>
            <span className="font-extrabold text-accent">2. This page</span>
            <br />
            Bookmark or save this payment link. When you reopen it later, the
            status will change from{" "}
            <span className="font-semibold">Awaiting verification</span> to{" "}
            <span className="font-semibold text-accent">
              Payment already verified
            </span>
            .
          </li>
        ) : (
          <li>
            <span className="font-extrabold text-accent">2. This payment link</span>
            {" — "}
            save it and reopen later. Status will update to{" "}
            <span className="font-semibold text-accent">
              Payment already verified
            </span>{" "}
            after approval.
          </li>
        )}
      </ul>
      {variant === "submitted" ? (
        <p className="mt-4 rounded-sm border border-border bg-background/70 px-3 py-2 text-sm leading-7 text-muted">
          Your registration is{" "}
          <span className="font-semibold text-foreground">not paid yet</span>{" "}
          until that verification happens. Submitting details only starts the
          review.
        </p>
      ) : null}
    </aside>
  );
}

export function WhatsAppWatchNote({ children }: { children?: ReactNode }) {
  return (
    <p className="text-sm leading-7 text-muted">
      {children ?? (
        <>
          Keep your phone nearby and watch WhatsApp for a message from DWO. If
          you don&apos;t receive it within a reasonable time after paying,
          contact DWO with your registration reference and confirm the WhatsApp
          number you registered with.
        </>
      )}
    </p>
  );
}
