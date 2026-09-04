import { Head, Link } from '@inertiajs/react';

type Masterclass = {
    brand: string;
    brand_full: string;
    name: string;
    description: string;
    fee: { display: string };
    course_period: { display: string };
    registration_starts: { display: string };
    skills: string[];
    contact: {
        phones: { label: string; href: string }[];
        instagram: { handle: string; href: string };
    };
    instructor: { name: string; role: string; bio: string };
    faqs: { question: string; answer: string }[];
};

export default function Home({ masterclass }: { masterclass: Masterclass }) {
    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`${masterclass.brand} · ${masterclass.name}`} />

            <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                <div className="text-xl font-semibold tracking-[0.2em]">{masterclass.brand}</div>
                <Link
                    href={route('register.create')}
                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                    Register Now
                </Link>
            </header>

            <main>
                <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20">
                    <p className="mb-4 text-sm uppercase tracking-[0.25em] text-zinc-400">
                        {masterclass.brand_full}
                    </p>
                    <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                        Graphic Design
                        <br />& Media Class
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-zinc-300">{masterclass.description}</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href={route('register.create')}
                            className="rounded-full bg-[#e8ff47] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black"
                        >
                            Register · {masterclass.fee.display}
                        </Link>
                        <a
                            href="#details"
                            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
                        >
                            Explore details
                        </a>
                    </div>
                </section>

                <section id="details" className="border-t border-white/10 bg-zinc-950 py-16">
                    <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Course period</p>
                            <p className="mt-2 text-lg font-medium">{masterclass.course_period.display}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Registration</p>
                            <p className="mt-2 text-lg font-medium">{masterclass.registration_starts.display}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Rate</p>
                            <p className="mt-2 text-lg font-medium">{masterclass.fee.display}</p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-6 py-16">
                    <h2 className="text-2xl font-semibold">Skills you will learn</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {masterclass.skills.map((skill) => (
                            <div key={skill} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                {skill}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-t border-white/10 bg-zinc-950 py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 className="text-2xl font-semibold">Instructor</h2>
                        <p className="mt-2 text-zinc-400">{masterclass.instructor.role}</p>
                        <h3 className="mt-4 text-xl font-medium">{masterclass.instructor.name}</h3>
                        <p className="mt-3 max-w-3xl text-zinc-300">{masterclass.instructor.bio}</p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-6 py-16">
                    <h2 className="text-2xl font-semibold">FAQ</h2>
                    <div className="mt-6 space-y-4">
                        {masterclass.faqs.map((faq) => (
                            <details key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <summary className="cursor-pointer font-medium">{faq.question}</summary>
                                <p className="mt-3 text-zinc-300">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <section className="border-t border-white/10 py-16 text-center">
                    <h2 className="text-3xl font-semibold">Ready to join?</h2>
                    <p className="mt-3 text-zinc-400">Secure your seat for {masterclass.fee.display}</p>
                    <Link
                        href={route('register.create')}
                        className="mt-6 inline-block rounded-full bg-[#e8ff47] px-8 py-3 text-sm font-bold uppercase tracking-wide text-black"
                    >
                        Register Now
                    </Link>
                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
                        {masterclass.contact.phones.map((phone) => (
                            <a key={phone.href} href={phone.href} className="hover:text-white">
                                {phone.label}
                            </a>
                        ))}
                        <a href={masterclass.contact.instagram.href} className="hover:text-white">
                            {masterclass.contact.instagram.handle}
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}
