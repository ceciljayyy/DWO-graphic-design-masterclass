"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/settings", label: "Settings" },
];

type AdminShellProps = {
  adminName: string;
  adminEmail: string;
  children: ReactNode;
};

export function AdminShell({ adminName, adminEmail, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <aside
          className={cn(
            "border-b border-border bg-surface lg:min-h-screen lg:border-b-0 lg:border-r",
            open ? "block" : "hidden lg:block",
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.28em]">DWO</p>
              <p className="mt-1 text-xs text-muted">Admin Console</p>
            </div>
            <button
              type="button"
              className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-[0.16em] lg:hidden"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3 pb-6">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-sm px-3 py-3 text-sm transition-colors",
                    active
                      ? "bg-background text-accent"
                      : "text-muted hover:bg-background hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-[0.16em] lg:hidden"
                onClick={() => setOpen((value) => !value)}
              >
                Menu
              </button>
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Graphic Design & Media Class
                </p>
                <p className="mt-1 text-sm text-muted">
                  {adminName} · {adminEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                type="button"
                variant="secondary"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-2 text-xs"
              >
                {loggingOut ? "Signing out..." : "Logout"}
              </Button>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
