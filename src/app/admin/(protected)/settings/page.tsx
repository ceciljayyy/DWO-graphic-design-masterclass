import { getCurrentAdmin } from "@/lib/auth/admin";
import { masterclass } from "@/lib/masterclass";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Settings
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest">
          Account & course
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Admin account
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="mt-1 text-foreground">{admin?.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1 text-foreground">{admin?.email}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-7 text-muted">
            Admin accounts are provisioned through a controlled server-side setup
            process. Public signup is disabled.
          </p>
        </section>

        <section className="border border-border bg-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Course configuration
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Course</dt>
              <dd className="mt-1 text-foreground">{masterclass.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Rate</dt>
              <dd className="mt-1 text-foreground">{masterclass.price.display}</dd>
            </div>
            <div>
              <dt className="text-muted">Period</dt>
              <dd className="mt-1 text-foreground">{masterclass.coursePeriod.display}</dd>
            </div>
            <div>
              <dt className="text-muted">Skills</dt>
              <dd className="mt-1 text-foreground">
                {masterclass.skills.map((skill) => skill.title).join(" · ")}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-7 text-muted">
            Course pricing and schedule remain code-controlled in{" "}
            <code>src/lib/masterclass.ts</code> to keep website, Paystack, and
            analytics aligned.
          </p>
        </section>
      </div>
    </div>
  );
}
