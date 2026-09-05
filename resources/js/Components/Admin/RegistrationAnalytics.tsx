import RegistrationAnalyticsChart from '@/Components/Admin/RegistrationAnalyticsChart';
import type {
    AnalyticsRange,
    RegistrationAnalyticsData,
} from '@/Components/Admin/analyticsTypes';
import { useEffect, useState } from 'react';

type Props = {
    initial: RegistrationAnalyticsData;
};

function formatRevenue(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        maximumFractionDigits: 0,
    }).format(amount);
}

function Metric({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: string;
}) {
    return (
        <div className="min-w-0">
            <p className={`text-xl font-semibold tabular-nums tracking-tight md:text-2xl ${accent ?? 'text-[color:var(--dwo-text)]'}`}>
                {value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-[color:var(--dwo-muted)]">{label}</p>
        </div>
    );
}

export default function RegistrationAnalytics({ initial }: Props) {
    const [data, setData] = useState(initial);
    const [range, setRange] = useState<AnalyticsRange>(initial.range);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setData(initial);
        setRange(initial.range);
    }, [initial]);

    const loadRange = async (nextRange: AnalyticsRange) => {
        if (nextRange === range && !error) {
            return;
        }

        setRange(nextRange);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(route('admin.analytics', { range: nextRange }), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Unable to load analytics.');
            }

            const payload = (await response.json()) as RegistrationAnalyticsData;
            setData(payload);

            const url = new URL(window.location.href);
            url.searchParams.set('range', nextRange);
            window.history.replaceState({}, '', url.toString());
        } catch {
            setError('Unable to load analytics.');
        } finally {
            setLoading(false);
        }
    };

    const empty = data.summary.registrations === 0;

    return (
        <section className="dwo-glass">
            <div className="flex flex-col gap-4 border-b border-[color:var(--dwo-border)] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--dwo-muted)]">
                        Registration activity
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[color:var(--dwo-text)]">
                        Registrations · {data.ranges.find((item) => item.value === data.range)?.label ?? data.range}
                    </h2>
                    <p className="mt-1 max-w-xl text-sm text-[color:var(--dwo-muted)]">
                        Registration and payment activity over the selected period (Africa/Accra).
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    <label htmlFor="analytics-range" className="sr-only">
                        Analytics period
                    </label>
                    <div className="hidden gap-1 rounded-lg border border-[color:var(--dwo-border)] bg-[color:var(--dwo-bg-soft)] p-1 lg:flex">
                        {data.ranges.map((option) => {
                            const selected = option.value === range;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => void loadRange(option.value)}
                                    disabled={loading}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                                        selected
                                            ? 'bg-[color:var(--dwo-accent)] text-[color:var(--dwo-accent-contrast)]'
                                            : 'text-[color:var(--dwo-muted)] hover:bg-[color:color-mix(in_srgb,var(--dwo-text)_5%,transparent)] hover:text-[color:var(--dwo-text)]'
                                    } disabled:opacity-60`}
                                    aria-pressed={selected}
                                >
                                    {option.short}
                                </button>
                            );
                        })}
                    </div>
                    <select
                        id="analytics-range"
                        className="dwo-input w-full text-sm lg:hidden"
                        value={range}
                        disabled={loading}
                        onChange={(event) => void loadRange(event.target.value as AnalyticsRange)}
                    >
                        {data.ranges.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="relative px-4 py-5 sm:px-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                    <Metric label="Registrations" value={String(data.summary.registrations)} />
                    <Metric label="Paid" value={String(data.summary.paid)} accent="text-amber-300" />
                    <Metric label="Pending" value={String(data.summary.pending)} accent="text-stone-300" />
                    <Metric label="Failed" value={String(data.summary.failed)} accent="text-red-400" />
                    <Metric
                        label="Conversion"
                        value={data.summary.conversionRate === null ? '—' : `${data.summary.conversionRate}%`}
                    />
                    <Metric label="Revenue" value={formatRevenue(data.summary.revenue)} />
                </div>

                <div className="relative mt-6">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[color:var(--dwo-bg-elevated)]/75 backdrop-blur-[1px]">
                            <p className="text-sm font-medium text-[color:var(--dwo-muted)]">Updating analytics…</p>
                        </div>
                    )}

                    {error ? (
                        <div className="flex h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-[color:var(--dwo-border)] bg-black/20 text-center sm:h-[320px] xl:h-[360px]">
                            <p className="font-medium text-[color:var(--dwo-text)]">Unable to load analytics.</p>
                            <p className="mt-1 text-sm text-[color:var(--dwo-muted)]">Try again.</p>
                            <button
                                type="button"
                                onClick={() => void loadRange(range)}
                                className="mt-4 rounded-lg bg-[color:var(--dwo-accent)] px-4 py-2 text-sm font-medium text-[color:var(--dwo-accent-contrast)]"
                            >
                                Retry
                            </button>
                        </div>
                    ) : empty ? (
                        <div className="flex h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-[color:var(--dwo-border)] bg-black/20 text-center sm:h-[320px] xl:h-[360px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--dwo-muted)]">
                                No registrations
                            </p>
                            <p className="mt-2 max-w-sm text-sm text-zinc-400">
                                There were no registrations during this period.
                            </p>
                        </div>
                    ) : (
                        <RegistrationAnalyticsChart series={data.series} />
                    )}
                </div>

                <p className="mt-4 text-xs text-[color:var(--dwo-muted)]">
                    Updated {new Date(data.generatedAt).toLocaleString('en-GB', { timeZone: data.timezone })}
                </p>
            </div>
        </section>
    );
}
