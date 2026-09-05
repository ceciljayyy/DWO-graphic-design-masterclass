import SelectedWorkGallery from '@/Components/SelectedWorkGallery';
import StudentResults from '@/Components/StudentResults';
import ThemeToggle from '@/Components/ThemeToggle';
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
    instructor: { name: string; role: string; bio: string; image: string };
    faqs: { question: string; answer: string }[];
};

type Props = {
    masterclass: Masterclass;
    portfolio: { src: string; category: string }[];
    studentWork: {
        before: string[];
        after: string[];
    };
};

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#instructor', label: 'Instructor' },
    { href: '#faq', label: 'FAQ' },
];

export default function Home({ masterclass, portfolio, studentWork }: Props) {
    return (
        <div className="dwo-page">
            <Head title={`${masterclass.brand} · ${masterclass.name}`} />

            <header className="dwo-header-bar sticky top-0 z-40">
                <div className="dwo-container flex items-center justify-between gap-4 py-3 md:py-4">
                    <Link href={route('home')} className="flex min-w-0 items-baseline gap-2 sm:gap-3">
                        <span className="dwo-display text-2xl text-[color:var(--dwo-text)] sm:text-3xl">
                            {masterclass.brand}
                        </span>
                        <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--dwo-muted)] sm:inline md:text-xs">
                            Design & Media Class
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                        <nav className="hidden items-center gap-5 text-sm text-[color:var(--dwo-text)] lg:flex">
                            {navLinks.map((item) => (
                                <a key={item.href} href={item.href} className="transition hover:opacity-70">
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                        <ThemeToggle />
                        <Link
                            href={route('register.create')}
                            className="dwo-accent-btn px-3 py-2.5 text-[10px] sm:px-4 sm:text-xs"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section id="about" className="relative overflow-hidden">
                    <div className="dwo-hero-glow" aria-hidden />
                    <div className="dwo-container grid items-start gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:pb-24 lg:pt-16">
                        <div className="relative min-w-0">
                            <div className="relative">
                                <p
                                    className="dwo-display pointer-events-none absolute -left-1 -top-6 select-none text-[clamp(3.5rem,12vw,8rem)] text-[color:var(--dwo-text)] opacity-[0.06] sm:-top-10"
                                    aria-hidden
                                >
                                    Design & Media
                                </p>
                                <h1 className="dwo-display relative text-[clamp(3.25rem,11vw,7.5rem)] text-[color:var(--dwo-text)]">
                                    Graphic Design
                                    <br />
                                    & Media{' '}
                                    <span className="text-[color:var(--dwo-accent)]">Class</span>
                                </h1>
                            </div>

                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--dwo-muted)] sm:mt-8 sm:text-base">
                                {masterclass.description}
                            </p>

                            <div className="mt-8 border-y border-[color:var(--dwo-border)] sm:mt-10">
                                <div className="grid gap-5 py-5 sm:grid-cols-3 sm:gap-6 sm:py-6">
                                    <div>
                                        <p className="dwo-label">Rate</p>
                                        <p className="dwo-display mt-2 text-3xl text-[color:var(--dwo-accent)] sm:text-4xl">
                                            {masterclass.fee.display}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="dwo-label">Registration starts on</p>
                                        <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[color:var(--dwo-text)] sm:text-base">
                                            {masterclass.registration_starts.display}
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="dwo-label">Course period</p>
                                        <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[color:var(--dwo-text)] sm:text-base">
                                            {masterclass.course_period.display}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
                                <Link
                                    href={route('register.create')}
                                    className="dwo-accent-btn px-6 py-3.5 text-xs sm:text-sm"
                                >
                                    Register Now
                                </Link>
                                <a href="#details" className="dwo-ghost-btn px-6 py-3.5 text-xs sm:text-sm">
                                    Explore Details
                                </a>
                            </div>
                        </div>

                        <aside id="skills" className="relative lg:pt-4">
                            <div className="dwo-glass-panel p-6 sm:p-8">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--dwo-accent)] sm:text-xs">
                                    Skills to learn
                                </p>
                                <ul className="mt-6">
                                    {masterclass.skills.map((skill, index) => (
                                        <li
                                            key={skill}
                                            className="flex items-baseline gap-4 border-t border-[color:var(--dwo-border)] py-4 first:border-t-0 first:pt-0 last:pb-0"
                                        >
                                            <span className="shrink-0 text-xs font-semibold tabular-nums text-[color:var(--dwo-accent)]">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="dwo-display text-2xl text-[color:var(--dwo-text)] sm:text-3xl">
                                                {skill}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </section>

                <section id="details" className="border-t border-[color:var(--dwo-border)] py-12 md:py-16">
                    <div className="dwo-container">
                        <div className="dwo-glass grid gap-6 p-6 sm:grid-cols-2 sm:p-8 md:gap-8 lg:grid-cols-3">
                            <div>
                                <p className="dwo-label">Course period</p>
                                <p className="mt-2 text-base font-medium md:text-lg">{masterclass.course_period.display}</p>
                            </div>
                            <div>
                                <p className="dwo-label">Registration</p>
                                <p className="mt-2 text-base font-medium md:text-lg">
                                    {masterclass.registration_starts.display}
                                </p>
                            </div>
                            <div>
                                <p className="dwo-label">Rate</p>
                                <p className="mt-2 text-base font-medium text-[color:var(--dwo-accent)] md:text-lg">
                                    {masterclass.fee.display}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <SelectedWorkGallery items={portfolio} />

                <StudentResults studentWork={studentWork} />

                <section id="instructor" className="relative overflow-hidden border-t border-[color:var(--dwo-border)] py-16 md:py-24">
                    <div
                        className="pointer-events-none absolute left-[8%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-70 blur-3xl sm:h-[520px] sm:w-[520px]"
                        style={{
                            background:
                                'radial-gradient(circle, color-mix(in srgb, var(--dwo-accent) 18%, transparent) 0%, transparent 70%)',
                        }}
                        aria-hidden
                    />

                    <div className="dwo-container relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
                        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                            <div
                                className="pointer-events-none absolute -inset-6 rounded-[40%_20%_45%_25%] opacity-80 blur-2xl sm:-inset-10"
                                style={{
                                    background:
                                        'radial-gradient(ellipse at 40% 45%, color-mix(in srgb, var(--dwo-accent) 22%, transparent), transparent 68%)',
                                }}
                                aria-hidden
                            />
                            <div
                                className="relative overflow-hidden border border-[color:color-mix(in_srgb,var(--dwo-accent)_45%,transparent)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                                style={{
                                    borderRadius: '42% 18% 38% 22% / 36% 28% 48% 30%',
                                }}
                            >
                                <img
                                    src={masterclass.instructor.image}
                                    alt={masterclass.instructor.name}
                                    className="aspect-[4/5] w-full object-cover object-[center_18%]"
                                />
                                <div
                                    className="pointer-events-none absolute inset-0"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--dwo-bg) 55%, transparent) 100%)',
                                    }}
                                    aria-hidden
                                />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="dwo-display text-3xl tracking-[0.08em] text-[color:var(--dwo-text)] sm:text-4xl">
                                {masterclass.brand}
                            </p>
                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dwo-accent)]">
                                Instructor
                            </p>
                            <h2 className="dwo-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] text-[color:var(--dwo-text)]">
                                {masterclass.instructor.name}
                            </h2>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dwo-accent)] sm:text-sm">
                                {masterclass.instructor.role}
                            </p>
                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--dwo-text)] sm:text-base sm:leading-7">
                                {masterclass.instructor.bio}
                            </p>

                            <div className="mt-10">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--dwo-accent)] sm:text-xs">
                                    Follow the work
                                </p>
                                <a
                                    href={masterclass.contact.instagram.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-block border-b border-[color:var(--dwo-text)] pb-1 text-xl font-semibold tracking-wide text-[color:var(--dwo-text)] transition hover:opacity-80 sm:text-2xl"
                                >
                                    {masterclass.contact.instagram.handle}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="faq" className="dwo-container py-12 md:py-16">
                    <h2 className="dwo-display text-4xl sm:text-5xl">FAQ</h2>
                    <div className="mt-6 space-y-3">
                        {masterclass.faqs.map((faq) => (
                            <details key={faq.question} className="dwo-glass p-5">
                                <summary className="cursor-pointer font-medium uppercase tracking-wide">
                                    {faq.question}
                                </summary>
                                <p className="mt-3 text-[color:var(--dwo-muted)]">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <section className="dwo-container pb-4 pt-6 md:pb-6 md:pt-10">
                    <div
                        className="relative flex flex-col gap-8 overflow-hidden border border-[color:var(--dwo-glass-border)] px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-14"
                        style={{
                            background:
                                'linear-gradient(105deg, color-mix(in srgb, var(--dwo-accent) 28%, #1a0a0a) 0%, color-mix(in srgb, var(--dwo-bg) 85%, #000) 48%, #050505 100%)',
                            boxShadow:
                                '0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px rgba(0,0,0,0.28)',
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-0 backdrop-blur-[1px]"
                            style={{
                                background:
                                    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 42%, transparent 100%)',
                            }}
                            aria-hidden
                        />

                        <div className="relative min-w-0 max-w-3xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--dwo-accent)] sm:text-xs">
                                Registration starts {masterclass.registration_starts.display}
                            </p>
                            <h2 className="dwo-display mt-3 text-[clamp(2rem,5.5vw,3.75rem)] leading-[0.95] text-[color:var(--dwo-text)]">
                                Register for the Graphic Design & Media Class
                            </h2>
                            <p className="mt-4 text-sm text-[color:var(--dwo-muted)] sm:text-base">
                                Course period: {masterclass.course_period.display}. Rate:{' '}
                                {masterclass.fee.display}.
                            </p>
                        </div>

                        <div className="relative shrink-0">
                            <Link
                                href={route('register.create')}
                                className="dwo-accent-btn inline-flex px-8 py-3.5 text-sm"
                            >
                                Register Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative mt-8 overflow-hidden border-t border-[color:var(--dwo-border)]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-80"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 80% at 15% 0%, color-mix(in srgb, var(--dwo-accent) 12%, transparent), transparent 55%), linear-gradient(180deg, color-mix(in srgb, var(--dwo-bg) 40%, transparent), transparent)',
                    }}
                    aria-hidden
                />

                <div className="dwo-container relative py-14 md:py-16">
                    <div className="dwo-glass grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)] lg:gap-12 lg:p-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="dwo-display text-4xl tracking-[0.06em] text-[color:var(--dwo-text)] sm:text-5xl">
                                    {masterclass.brand}
                                </span>
                                <span className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--dwo-text)] sm:text-base">
                                    Graphic Design & Media Class
                                </span>
                            </div>
                            <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--dwo-muted)] sm:text-base">
                                Official digital landing page for the Graphic Design & Media Class by{' '}
                                {masterclass.brand}.
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--dwo-accent)]">
                                Navigation
                            </p>
                            <ul className="mt-5 space-y-3 text-sm text-[color:var(--dwo-text)] sm:text-base">
                                {navLinks.map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} className="transition hover:opacity-70">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--dwo-accent)]">
                                Contact
                            </p>
                            <ul className="mt-5 space-y-2 text-sm text-[color:var(--dwo-text)] sm:text-base">
                                {masterclass.contact.phones.map((phone) => (
                                    <li key={phone.href}>
                                        <a href={phone.href} className="transition hover:opacity-70">
                                            {phone.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--dwo-accent)]">
                                Instagram
                            </p>
                            <a
                                href={masterclass.contact.instagram.href}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block text-sm text-[color:var(--dwo-text)] transition hover:opacity-70 sm:text-base"
                            >
                                {masterclass.contact.instagram.handle}
                            </a>

                            <div className="mt-8">
                                <Link
                                    href={route('register.create')}
                                    className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--dwo-accent)] transition hover:opacity-80"
                                >
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative border-t border-[color:var(--dwo-border)]">
                    <div className="dwo-container flex items-center gap-3 py-5 text-xs text-[color:var(--dwo-muted)] sm:text-sm">
                        <span
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--dwo-border)] text-[10px] font-semibold text-[color:var(--dwo-text)]"
                            aria-hidden
                        >
                            {masterclass.brand.slice(0, 1)}
                        </span>
                        <p>
                            © {masterclass.brand} Graphic Design & Media Class. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
