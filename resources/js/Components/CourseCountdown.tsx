import { useEffect, useMemo, useState } from 'react';

type Countdown = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasStarted: boolean;
};

type Props = {
    courseStartsAt: string;
    serverNow: string;
    timezone: string;
};

const units = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'seconds', label: 'Seconds' },
] as const;

function calculateCountdown(courseStartsAt: number, serverOffset: number): Countdown {
    const currentTime = Date.now() + serverOffset;
    const remaining = Math.max(courseStartsAt - currentTime, 0);

    return {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
        hasStarted: remaining === 0,
    };
}

function formatUnit(value: number): string {
    return String(value).padStart(2, '0');
}

export default function CourseCountdown({ courseStartsAt, serverNow, timezone }: Props) {
    const courseStartMs = useMemo(() => new Date(courseStartsAt).getTime(), [courseStartsAt]);
    const serverOffset = useMemo(() => new Date(serverNow).getTime() - Date.now(), [serverNow]);
    const [countdown, setCountdown] = useState(() => calculateCountdown(courseStartMs, serverOffset));

    useEffect(() => {
        function updateCountdown() {
            const nextCountdown = calculateCountdown(courseStartMs, serverOffset);

            setCountdown(nextCountdown);

            return nextCountdown.hasStarted;
        }

        if (updateCountdown()) {
            return;
        }

        const intervalId = window.setInterval(() => {
            if (updateCountdown()) {
                window.clearInterval(intervalId);
            }
        }, 1000);

        function handleVisibilityChange() {
            if (document.visibilityState === 'visible' && updateCountdown()) {
                window.clearInterval(intervalId);
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [courseStartMs, serverOffset]);

    const unitValues = {
        days: countdown.days,
        hours: countdown.hours,
        minutes: countdown.minutes,
        seconds: countdown.seconds,
    };

    return (
        <section className="border-t border-[color:var(--dwo-border)] py-12 md:py-16">
            <div className="dwo-container">
                <div
                    className="relative overflow-hidden rounded-2xl border border-[color:var(--dwo-glass-border)] px-4 py-8 sm:px-6 sm:py-10 lg:px-10"
                    style={{
                        background:
                            'linear-gradient(135deg, color-mix(in srgb, var(--dwo-bg-elevated) 82%, #050505) 0%, color-mix(in srgb, var(--dwo-bg) 88%, #000) 58%, #050505 100%)',
                    }}
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-80"
                        style={{
                            background:
                                'radial-gradient(ellipse 70% 70% at 80% 0%, color-mix(in srgb, var(--dwo-accent) 16%, transparent), transparent 58%), radial-gradient(ellipse 50% 45% at 5% 100%, color-mix(in srgb, var(--dwo-danger) 18%, transparent), transparent 60%)',
                        }}
                        aria-hidden
                    />

                    <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--dwo-accent)]">
                                Course starts soon
                            </p>
                            <h2 className="dwo-display mt-3 text-[clamp(2.7rem,8vw,5.4rem)] text-[color:var(--dwo-text)]">
                                {countdown.hasStarted ? 'Course Is Now Live' : 'Countdown To Class'}
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-6 text-[color:var(--dwo-muted)] sm:text-base">
                                Registration is open. The official course start is 21 September 2026, based on the
                                application timezone: {timezone}.
                            </p>
                        </div>

                        <div
                            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
                            aria-label={
                                countdown.hasStarted
                                    ? 'Course has started'
                                    : `${countdown.days} days ${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds until the course starts`
                            }
                        >
                            {units.map((unit) => (
                                <div
                                    key={unit.key}
                                    className="rounded-xl border border-white/10 bg-black/35 p-3 text-center backdrop-blur sm:p-4"
                                >
                                    <p className="dwo-display min-w-0 text-[clamp(2.4rem,12vw,4.6rem)] leading-none text-white tabular-nums">
                                        {formatUnit(unitValues[unit.key])}
                                    </p>
                                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-[11px]">
                                        {unit.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
