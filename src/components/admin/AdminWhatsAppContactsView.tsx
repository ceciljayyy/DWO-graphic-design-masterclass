"use client";

import { useMemo, useState } from "react";

import { formatAdminDate } from "@/lib/admin/format";
import type { PaidWhatsAppContact } from "@/lib/admin/export";

export function AdminWhatsAppContactsView({
  contacts,
}: {
  contacts: PaidWhatsAppContact[];
}) {
  const [copied, setCopied] = useState<"numbers" | "csv" | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return (
        contact.fullName.toLowerCase().includes(needle) ||
        contact.whatsapp.toLowerCase().includes(needle) ||
        contact.whatsappDigits.includes(needle) ||
        contact.registrationReference.toLowerCase().includes(needle)
      );
    });
  }, [contacts, query]);

  const numbersText = filtered.map((contact) => contact.whatsapp).join("\n");

  async function copyNumbers() {
    try {
      await navigator.clipboard.writeText(numbersText);
      setCopied("numbers");
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard may be unavailable.
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            WhatsApp group
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest">
            Paid WhatsApp contacts
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Export WhatsApp numbers for all paid participants so you can create
            the course group and add them. Duplicates are removed automatically.
          </p>
        </div>
        <div className="rounded-sm border border-accent/40 bg-accent/10 px-4 py-3 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Unique contacts
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
            {contacts.length}
          </p>
        </div>
      </div>

      <aside className="relative overflow-hidden border-2 border-accent/40 bg-surface p-5">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-accent"
        />
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
          How to use this
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-foreground/90">
          <li>Download CSV or copy all WhatsApp numbers.</li>
          <li>Create your DWO course WhatsApp group.</li>
          <li>Add participants using the exported numbers.</li>
        </ol>
      </aside>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={copyNumbers}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/90"
        >
          {copied === "numbers" ? "Copied numbers" : "Copy all numbers"}
        </button>
        <a
          href="/api/admin/export/whatsapp?format=csv"
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Download CSV
        </a>
        <a
          href="/api/admin/export/whatsapp?format=txt"
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Download numbers (.txt)
        </a>
      </div>

      <div className="border border-border bg-surface p-4">
        <label
          htmlFor="whatsapp-contact-search"
          className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted"
        >
          Search contacts
        </label>
        <input
          id="whatsapp-contact-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, WhatsApp, or reference"
          className="mt-2 min-h-11 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border bg-surface p-6 text-sm text-muted">
          {contacts.length === 0
            ? "No paid WhatsApp contacts yet. Contacts appear here after payments are verified."
            : "No contacts match your search."}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface font-display text-[11px] uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr
                    key={contact.whatsappDigits}
                    className="border-t border-border"
                  >
                    <td className="px-4 py-3 text-foreground">
                      {contact.fullName}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {contact.whatsapp}
                    </td>
                    <td className="px-4 py-3 text-accent">
                      {contact.registrationReference}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatAdminDate(contact.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="border border-border bg-surface p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
              Numbers list ({filtered.length})
            </h2>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-sm border border-border bg-background p-4 text-xs leading-6 text-muted">
              {numbersText || "—"}
            </pre>
          </section>
        </>
      )}
    </div>
  );
}
