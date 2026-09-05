const testimonials = [
    {
        quote: 'Before this class, I did not know where to start. Now I design with confidence and understand what makes creative work feel professional.',
        name: 'NK-Cil',
        role: '1st Edition Participant',
        image: '/students/nk-cil.png',
    },
    {
        quote: 'The practical lessons improved my social media designs immediately. I now create content with stronger layout, hierarchy and purpose.',
        name: 'Micheal Ofori',
        role: 'Mentee',
        image: '/students/micheal.jpg',
    },
    {
        quote: 'One of the most valuable creative learning experiences I have had. The process helped me build sharper work and a better eye for design.',
        name: 'Mirabel Ghansah',
        role: 'Content Creator',
        image: '/students/mirabel.png',
    },
];

export default function Testimonials() {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
                <figure
                    key={testimonial.quote}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-5 transition duration-300 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--dwo-danger)_58%,white_10%)] sm:p-6 lg:p-7"
                >
                    <div
                        className="pointer-events-none absolute right-5 top-16 text-7xl leading-none text-[color:var(--dwo-danger)] opacity-25 transition duration-300 group-hover:opacity-40"
                        aria-hidden
                    >
                        &ldquo;
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="h-14 w-14 rounded-full border border-[color:var(--dwo-danger)] object-cover"
                            loading="lazy"
                        />
                        <p className="text-[11px] tracking-[0.18em] text-[color:var(--dwo-accent)]">★★★★★</p>
                        <span className="font-mono text-[10px] text-zinc-500">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <blockquote className="mt-7 text-base leading-7 text-white sm:text-lg">
                        &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-8 border-t border-white/10 pt-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                            {testimonial.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">{testimonial.role}</p>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
