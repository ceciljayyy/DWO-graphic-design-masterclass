import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { masterclass } from "@/lib/masterclass";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md border border-border bg-surface p-6 sm:p-8">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          DWO Admin
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest text-foreground">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Private console for the {masterclass.name}.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
