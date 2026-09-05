const classMoments = [
    { src: '/work/a01.jpg', label: 'Workshop session' },
    { src: '/work/a10.jpg', label: 'Teaching moment' },
    { src: '/work/a14.jpg', label: 'Student interaction' },
    { src: '/work/a20.jpg', label: 'Live demonstration' },
];

export default function ClassGallery() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classMoments.map((moment, index) => (
                <figure
                    key={moment.src}
                    className={`group overflow-hidden rounded-2xl border border-[color:var(--dwo-glass-border)] bg-black ${
                        index % 2 === 0 ? 'lg:mt-8' : ''
                    }`}
                >
                    <div className="relative">
                        <img
                            src={moment.src}
                            alt={moment.label}
                            className="aspect-[4/5] w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-100"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-transparent" />
                    </div>
                    <figcaption className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                            {moment.label}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dwo-danger)]" aria-hidden />
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
