import { useEffect, useRef, useState } from 'react';
import Testimonials from './Testimonials';

const metrics = [
    { value: 70, suffix: '+', label: 'Students Trained' },
    { value: 97, suffix: '%', label: 'Satisfaction Rate' },
    { value: 84, suffix: '+', label: 'Projects Completed' },
    { value: 87, suffix: '%', label: 'Career Improvement' },
];

function useCountUp(target: number, active: boolean): string {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) {
            return;
        }

        let frame = 0;
        const totalFrames = 48;
        const id = window.setInterval(() => {
            frame += 1;
            const progress = Math.min(frame / totalFrames, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));

            if (progress === 1) {
                window.clearInterval(id);
            }
        }, 20);

        return () => window.clearInterval(id);
    }, [active, target]);

    return String(value);
}

function Metric({ metric, active }: { metric: (typeof metrics)[number]; active: boolean }) {
    const value = useCountUp(metric.value, active);

    return (
        <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 border-t border-white/10 py-5 sm:block sm:border-l sm:border-t-0 sm:px-5 sm:py-0 first:sm:border-l-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--dwo-danger)]/12 text-[color:var(--dwo-danger)] ring-1 ring-[color:var(--dwo-danger)]/30">
                <span className="h-3 w-3 rounded-full bg-[color:var(--dwo-danger)]" />
            </div>
            <div className="min-w-0 sm:mt-4">
                <p className="dwo-display text-5xl leading-none text-white sm:text-6xl">
                    {value}
                    <span className="text-[color:var(--dwo-accent)]">{metric.suffix}</span>
                </p>
                <p className="mt-2 text-[11px] font-medium tracking-wide text-zinc-400">{metric.label}</p>
            </div>
        </div>
    );
}

export default function StudentResults() {
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
            { threshold: 0.22 },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

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
                        'radial-gradient(ellipse 70% 55% at 12% 0%, color-mix(in srgb, var(--dwo-accent) 12%, transparent), transparent 58%), radial-gradient(ellipse 60% 45% at 94% 82%, color-mix(in srgb, var(--dwo-danger) 18%, transparent), transparent 62%), linear-gradient(180deg, #050505 0%, #0d0d0e 50%, #050505 100%)',
                }}
                aria-hidden
            />

            <div className="dwo-container relative">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--dwo-accent)]">
                        Student Success
                    </p>
                    <h2 className="dwo-display mt-5 text-[clamp(3rem,9vw,6.8rem)] text-white">
                        Real Students.{' '}
                        <span className="text-[color:var(--dwo-danger)]">Real Transformation.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                        Our students do not just learn design. They evolve. Here is what some of them have to say.
                    </p>
                </div>

                <div className="mt-10 sm:mt-12">
                    <Testimonials />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur sm:mt-6 sm:p-7">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                        {metrics.map((metric) => (
                            <Metric key={metric.label} metric={metric} active={visible} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
