type WorkItem = {
    src: string;
    label: string;
};

const workItems: WorkItem[] = [
    { src: '/work/after/Church Flyer Designs.jpg', label: 'Event flyer' },
    { src: '/work/after/Creative Birthday Designs.jpg', label: 'Social design' },
    { src: '/work/after/Design Challenge 2.jpg', label: 'Poster study' },
    { src: '/work/after/Second Chances.jpg', label: 'Campaign art' },
    { src: '/work/after/Creative new month August design 2026.jpg', label: 'Reels thumbnail' },
];

export default function StudentWork() {
    const [hero, ...grid] = workItems;

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-5">
            <a
                href={hero.src}
                className="group relative block min-h-[320px] overflow-hidden rounded-2xl border border-[color:var(--dwo-glass-border)] bg-black sm:min-h-[460px]"
            >
                <img
                    src={hero.src}
                    alt="Student event flyer work"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent"
                    aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--dwo-accent)]">
                        Large hero work
                    </p>
                    <h3 className="dwo-display mt-2 text-4xl text-white sm:text-5xl">Student Portfolio Piece</h3>
                </div>
            </a>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {grid.map((item) => (
                    <a
                        key={item.src}
                        href={item.src}
                        className="group relative overflow-hidden rounded-2xl border border-[color:var(--dwo-glass-border)] bg-black"
                    >
                        <img
                            src={item.src}
                            alt={`Student ${item.label.toLowerCase()} work`}
                            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                        <p className="absolute bottom-3 left-3 right-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                            {item.label}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}
