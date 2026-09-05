const testimonials = [
    {
        quote: 'The class completely changed how I approach graphic design and content creation. I now create work with more confidence.',
        role: 'Previous Student',
    },
    {
        quote: 'I learned practical skills that immediately improved my social media content and design work.',
        role: 'Former Participant',
    },
    {
        quote: 'One of the most valuable creative learning experiences I have had.',
        role: 'Creative Entrepreneur',
    },
];

export default function Testimonials() {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
                <figure
                    key={testimonial.quote}
                    className="group relative overflow-hidden rounded-2xl border border-[color:var(--dwo-glass-border)] bg-[color:color-mix(in_srgb,var(--dwo-bg-elevated)_72%,#050505)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--dwo-danger)_55%,var(--dwo-glass-border))] sm:p-6 lg:p-7"
                >
                    <div
                        className="pointer-events-none absolute right-5 top-3 text-7xl leading-none text-[color:var(--dwo-text)] opacity-[0.035] transition duration-300 group-hover:opacity-[0.06]"
                        aria-hidden
                    >
                        &ldquo;
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] tracking-[0.22em] text-[color:var(--dwo-accent)]">★★★★★</p>
                        <span className="font-mono text-[10px] text-[color:var(--dwo-muted)]">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <blockquote className="mt-8 text-base leading-7 text-[color:var(--dwo-text)] sm:text-lg">
                        &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-8 border-t border-[color:var(--dwo-border)] pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dwo-text)]">
                            {testimonial.role}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--dwo-muted)]">Placeholder testimonial</p>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
