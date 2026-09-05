import PublicShell from '@/Components/PublicShell';
import { Head, Link } from '@inertiajs/react';

const copy: Record<number, { title: string; body: string }> = {
    403: {
        title: 'Access denied',
        body: 'You don’t have permission to view this page.',
    },
    404: {
        title: 'Page not found',
        body: 'This link may be expired, mistyped, or no longer available. If you were trying to finish payment, register again or contact us for help.',
    },
    500: {
        title: 'Something went wrong',
        body: 'We’re working on it. Please try again in a moment.',
    },
    503: {
        title: 'Temporarily unavailable',
        body: 'The site is briefly offline for maintenance. Please check back soon.',
    },
};

export default function ErrorPage({ status = 404 }: { status?: number }) {
    const content = copy[status] ?? {
        title: 'Unexpected error',
        body: 'Something went wrong. Please return home and try again.',
    };

    return (
        <PublicShell>
            <Head title={`${status} · ${content.title}`} />
            <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--dwo-muted)]">
                    Error {status}
                </p>
                <h1 className="dwo-display mt-4 text-4xl text-[color:var(--dwo-text)] sm:text-5xl">
                    {content.title}
                </h1>
                <p className="mt-4 text-[color:var(--dwo-muted)]">{content.body}</p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href={route('home')}
                        className="rounded-full bg-[#e8ff47] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black"
                    >
                        Back to home
                    </Link>
                    <Link
                        href={route('register.create')}
                        className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--dwo-text)]"
                    >
                        Register
                    </Link>
                </div>

                <p className="mt-10 text-sm text-[color:var(--dwo-muted)]">
                    Need help?{' '}
                    <a href="tel:+233599258957" className="underline hover:text-[color:var(--dwo-text)]">
                        +233 59 925 8957
                    </a>
                </p>
            </main>
        </PublicShell>
    );
}
