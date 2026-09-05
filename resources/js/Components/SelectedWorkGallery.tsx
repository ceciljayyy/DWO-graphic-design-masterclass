import { useEffect, useMemo, useState } from 'react';

type PortfolioItem = {
    src: string;
    category: string;
};

type Props = {
    items: PortfolioItem[];
};

function wrapIndex(index: number, length: number): number {
    if (length === 0) {
        return 0;
    }

    return ((index % length) + length) % length;
}

export default function SelectedWorkGallery({ items }: Props) {
    const [active, setActive] = useState(0);
    const count = items.length;

    useEffect(() => {
        if (count <= 1) {
            return;
        }

        const id = window.setInterval(() => {
            setActive((current) => wrapIndex(current + 1, count));
        }, 3800);

        return () => window.clearInterval(id);
    }, [count]);

    const visible = useMemo(() => {
        if (count === 0) {
            return [];
        }

        const offsets = count >= 7 ? [-3, -2, -1, 0, 1, 2, 3] : count >= 5 ? [-2, -1, 0, 1, 2] : [-1, 0, 1];

        return offsets.map((offset) => {
            const index = wrapIndex(active + offset, count);
            return { offset, item: items[index], index };
        });
    }, [active, count, items]);

    if (count === 0) {
        return null;
    }

    const current = items[active];
    const counter = `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;

    return (
        <section className="relative overflow-hidden border-t border-[color:var(--dwo-border)] py-20 sm:py-24">
            <div className="dwo-hero-glow opacity-60" aria-hidden />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dwo-accent)]">
                        The work
                    </p>
                    <h2 className="dwo-display mt-3 text-4xl text-[color:var(--dwo-text)] sm:text-5xl">
                        Selected creative works
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-[color:var(--dwo-muted)] sm:text-base">
                        A selection of visual identities, campaigns and creative work by DWO.
                    </p>
                </div>

                <div
                    className="relative mt-12 hidden h-[460px] md:block lg:h-[540px]"
                    style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
                >
                    <div
                        className="absolute inset-x-[8%] bottom-10 h-px opacity-40"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--dwo-text) 25%, transparent), transparent)',
                        }}
                    />

                    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                        {visible.map(({ offset, item, index }) => {
                            const abs = Math.abs(offset);
                            const isHero = offset === 0;
                            const translateX = offset * 210;
                            const translateZ = isHero ? 120 : 20 - abs * 90;
                            const rotateY = offset * -18;
                            const scale = isHero ? 1 : Math.max(0.62, 0.94 - abs * 0.1);
                            const opacity = isHero ? 1 : Math.max(0.38, 0.88 - abs * 0.16);

                            return (
                                <button
                                    key={`${index}-${offset}`}
                                    type="button"
                                    onClick={() => setActive(index)}
                                    className="absolute left-1/2 top-1/2 origin-center transition-all duration-700 ease-out"
                                    style={{
                                        width: isHero ? '260px' : '180px',
                                        transform: `translate3d(calc(-50% + ${translateX}px), -52%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                                        opacity,
                                        zIndex: 30 - abs,
                                        filter: isHero
                                            ? 'drop-shadow(0 30px 45px rgba(0,0,0,0.45))'
                                            : abs >= 3
                                              ? 'blur(0.6px) drop-shadow(0 14px 22px rgba(0,0,0,0.3))'
                                              : 'drop-shadow(0 18px 28px rgba(0,0,0,0.35))',
                                    }}
                                    aria-label={`View project ${index + 1}`}
                                    aria-current={isHero}
                                >
                                    <div
                                        className={`overflow-hidden bg-[color:var(--dwo-bg-soft)] ring-1 ${
                                            isHero
                                                ? 'ring-[color:color-mix(in_srgb,var(--dwo-accent)_45%,transparent)]'
                                                : 'ring-[color:var(--dwo-border)]'
                                        }`}
                                    >
                                        <img
                                            src={item.src}
                                            alt={`DWO selected work ${index + 1}`}
                                            className="aspect-[3/4] h-auto w-full object-cover"
                                            draggable={false}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-10 md:hidden">
                    <div className="dwo-glass mx-auto max-w-sm overflow-hidden">
                        <img
                            src={current.src}
                            alt={`DWO selected work ${active + 1}`}
                            className="aspect-[3/4] w-full object-cover"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--dwo-muted)]">
                        {current.category}
                    </p>
                    <p className="font-mono text-xs text-[color:var(--dwo-muted)]">{counter}</p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setActive((currentIndex) => wrapIndex(currentIndex - 1, count))}
                            className="dwo-ghost-btn px-4 py-2 text-sm"
                            aria-label="Previous project"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={() => setActive((currentIndex) => wrapIndex(currentIndex + 1, count))}
                            className="dwo-ghost-btn px-4 py-2 text-sm"
                            aria-label="Next project"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
