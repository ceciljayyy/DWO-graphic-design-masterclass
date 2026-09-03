"use client";

import {
  buildPaymentVerifiedWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

type AdminWhatsAppConfirmationProps = {
  fullName: string;
  whatsapp: string;
  registrationReference: string;
  amountDisplay: string;
};

export function AdminWhatsAppConfirmation({
  fullName,
  whatsapp,
  registrationReference,
  amountDisplay,
}: AdminWhatsAppConfirmationProps) {
  const message = buildPaymentVerifiedWhatsAppMessage({
    fullName,
    registrationReference,
    amountDisplay,
  });
  const href = buildWhatsAppLink(whatsapp, message);

  if (!href) {
    return (
      <section className="border border-red/40 bg-red/10 p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-red-strong">
          WhatsApp confirmation
        </h2>
        <p className="mt-3 text-sm leading-7 text-foreground">
          This registration has no usable WhatsApp number. Contact the
          participant manually with their registration reference{" "}
          <strong>{registrationReference}</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-2 border-accent/50 bg-accent/10 p-5">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 bg-accent"
      />
      <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-accent">
        Send WhatsApp confirmation
      </h2>
      <p className="mt-3 text-sm leading-7 text-foreground/90">
        Payment is marked paid. Open WhatsApp and send the confirmation message
        to the participant&apos;s registered number:{" "}
        <span className="font-extrabold text-foreground">{whatsapp}</span>.
      </p>
      <pre className="mt-4 max-h-56 overflow-auto whitespace-pre-wrap rounded-sm border border-border bg-background p-4 text-xs leading-6 text-muted">
        {message}
      </pre>
      <div className="mt-5">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Open WhatsApp &amp; send
        </a>
      </div>
      <p className="mt-3 text-xs leading-6 text-muted">
        Opens WhatsApp with the confirmation message pre-filled. Review, then
        tap send.
      </p>
    </section>
  );
}
