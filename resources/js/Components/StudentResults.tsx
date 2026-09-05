import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ClassGallery from './ClassGallery';
import StudentWork from './StudentWork';
import Testimonials from './Testimonials';

type Props = {
    studentWork: {
        before: string[];
        after: string[];
    };
};

const metrics = [
    { value: 200, suffix: '+', label: 'Students Trained' },
    { value: 95, suffix: '%', label: 'Positive Feedback' },
    { value: 50, suffix: '+', label: 'Creative Projects' },
    { value: 4.9, suffix: '/5', label: 'Student Rating', decimals: 1 },
];

function useCountUp(target: number, active: boolean, decimals = 0): string {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) {
            return;
        }

        let frame = 0;
        const totalFrames = 52;
        const id = window.setInterval(() => {
            frame += 1;
            const progress = Math.min(frame / totalFrames, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(target * eased);

            if (progress === 1) {
                window.clearInterval(id);
            }
        }, 20);

        return () => window.clearInterval(id);
    }, [active, target]);

    return value.toFixed(decimals);
}

function Metric({ metric, active }: { metric: (typeof metrics)[number]; active: boolean }) {
    const value = useCountUp(metric.value, active, metric.decimals ?? 0);

    return (
        <div className="border-t border-[color:var(--dwo-border)] py-5 sm:border-l sm:border-t-0 sm:px-5 sm:py-0 first:sm:border-l-0">
            <p className="dwo-display text-5xl text-[color:var(--dwo-text)] sm:text-6xl">
                {value}
                <span className="text-[color:var(--dwo-accent)]">{metric.suffix}</span>
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--dwo-muted)]">
                {metric.label}
            </p>
        </div>
    );
}

export default function StudentResults({ studentWork }: Props) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    const before = studentWork.before[0] ?? '/work/before/01.jpg';
    const after = studentWork.after[0] ?? '/work/after/1a.jpg';

    return (
        <section
            ref={sectionRef}
            id="student-results"
            className="relative overflow-hidden border-t border-[color:var(--dwo-border)] bg-[#050505] py-16 text-white sm:py-20 lg:py-24"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 55% at 80% 0%, color-mix(in srgb, var(--dwo-accent) 14%, transparent), transparent 58%), radial-gradient(ellipse 60% 45% at 0% 35%, color-mix(in srgb, var(--dwo-danger) 16%, transparent), transparent 58%), linear-gradient(180deg, #050505 0%, #101011 48%, #050505 100%)',
                }}
                aria-hidden
            />

            <div className="dwo-container relative">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--dwo-danger)]">
                            Social proof
                        </p>
                        <h2 className="dwo-display mt-4 text-[clamp(3.1rem,10vw,7.4rem)] text-white">
                            Student Results
                        </h2>
                    </div>
                    <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                        See how previous students transformed their skills, built stronger portfolios, and improved
                        their creative confidence.
                    </p>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur sm:mt-12 sm:p-7">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                        {metrics.map((metric) => (
                            <Metric key={metric.label} metric={metric} active={visible} />
                        ))}
                    </div>
                </div>

                <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
                    <div>
                        <p className="dwo-label text-[color:var(--dwo-accent)]">Testimonials</p>
                        <div className="mt-5">
                            <Testimonials />
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <p className="dwo-label text-[color:var(--dwo-accent)]">Student work showcase</p>
                                <h3 className="dwo-display mt-2 text-4xl text-white sm:text-5xl">
                                    Portfolio-ready outcomes
                                </h3>
                            </div>
                            <p className="max-w-md text-sm leading-6 text-zinc-400">
                                Posters, social media designs, branding projects, reels thumbnails and event flyers.
                            </p>
                        </div>
                        <div className="mt-6">
                            <StudentWork />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#111112] p-4 sm:p-5 lg:p-6">
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                            <div className="relative overflow-hidden rounded-xl bg-black">
                                <img src={before} alt="Basic student design before class" className="aspect-[4/3] w-full object-cover opacity-80" loading="lazy" />
                                <div className="absolute left-4 top-4 bg-[color:var(--dwo-danger)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                                    Before
                                </div>
                                <p className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">Basic Designs</p>
                            </div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[color:var(--dwo-accent)]">
                                →
                            </div>
                            <div className="relative overflow-hidden rounded-xl bg-black">
                                <img src={after} alt="Professional student creative work after class" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                                <div className="absolute left-4 top-4 bg-[color:var(--dwo-accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--dwo-accent-contrast)]">
                                    After
                                </div>
                                <p className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">
                                    Professional Creative Work
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="dwo-label text-[color:var(--dwo-accent)]">Class moments</p>
                        <div className="mt-6">
                            <ClassGallery />
                        </div>
                    </div>
                </div>

                <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-8 text-center sm:mt-16 sm:px-8 sm:py-10">
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                        Trusted by aspiring designers, content creators and entrepreneurs.
                    </p>
                    <p className="dwo-display mt-5 text-4xl text-white sm:text-6xl">
                        Ready to become the next success story?
                    </p>
                    <Link href={route('register.create')} className="dwo-accent-btn mt-7 px-7 py-3.5 text-xs sm:text-sm">
                        Reserve Your Spot
                    </Link>
                </div>
            </div>
        </section>
    );
}
