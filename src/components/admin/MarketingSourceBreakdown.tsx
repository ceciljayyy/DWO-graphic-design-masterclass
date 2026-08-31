import { cn } from "@/lib/utils";
import type { MarketingSourceStat } from "@/lib/admin/marketing-analytics.server";

export function MarketingSourceBreakdown({
  stats,
  className,
}: {
  stats: MarketingSourceStat[];
  className?: string;
}) {
  const totalRegistrations = stats.reduce(
    (sum, item) => sum + item.registrations,
    0,
  );
  const totalPaid = stats.reduce((sum, item) => sum + item.paid, 0);

  return (
    <section className={cn("border border-border bg-surface p-5", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Marketing sources
          </h2>
          <p className="mt-2 text-sm text-muted">
            Where registrations and paid conversions come from.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Totals
          </p>
          <p className="mt-1 text-sm text-foreground">
            {totalRegistrations} registrations · {totalPaid} paid
          </p>
        </div>
      </div>

      {stats.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Marketing attribution will appear here after the first tracked
          registration.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                <th className="py-3 pr-4">Source</th>
                <th className="py-3 pr-4 text-right">Registrations</th>
                <th className="py-3 pr-4 text-right">Paid</th>
                <th className="py-3 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item) => {
                const registrationWidth =
                  totalRegistrations === 0
                    ? 0
                    : (item.registrations / totalRegistrations) * 100;
                const paidWidth =
                  totalRegistrations === 0
                    ? 0
                    : (item.paid / totalRegistrations) * 100;

                return (
                  <tr key={item.source} className="border-b border-border/70">
                    <td className="py-4 pr-4">
                      <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                        {item.label}
                      </p>
                      <div className="mt-2 h-1.5 max-w-[12rem] rounded-sm bg-background">
                        <div
                          className="h-1.5 rounded-sm bg-accent/35"
                          style={{ width: `${registrationWidth}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right font-medium text-foreground">
                      {item.registrations}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="font-medium text-accent">{item.paid}</span>
                      <div className="mt-2 h-1.5 rounded-sm bg-background">
                        <div
                          className="ml-auto h-1.5 rounded-sm bg-accent"
                          style={{ width: `${paidWidth}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 text-right text-muted">
                      {item.conversionRate == null
                        ? "—"
                        : `${item.conversionRate}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted">
        Use campaign links such as{" "}
        <code className="text-accent">yoursite.com/register?source=instagram</code>,{" "}
        <code className="text-accent">?source=tiktok</code>,{" "}
        <code className="text-accent">?source=whatsapp</code>, or standard UTM
        parameters. Google Ads and Meta clicks are detected automatically via{" "}
        <code className="text-accent">gclid</code> and{" "}
        <code className="text-accent">fbclid</code>.
      </p>
    </section>
  );
}
