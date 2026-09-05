import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function AdminLayout({ children, title }: PropsWithChildren<{ title: string }>) {
    const user = usePage().props.auth?.user as { name?: string; email?: string } | undefined;
    const [menuOpen, setMenuOpen] = useState(false);

    const nav = [
        { href: route('admin.dashboard'), label: 'Dashboard' },
        { href: route('admin.payments.index'), label: 'Payments' },
        { href: route('admin.registrations.index'), label: 'Registrations' },
    ];

    return (
        <div className="dwo-page">
            <header className="dwo-header-bar sticky top-0 z-40">
                <div className="dwo-container flex items-center justify-between gap-4 py-3 md:py-4">
                    <div className="flex min-w-0 items-center gap-4 md:gap-8">
                        <Link
                            href={route('admin.dashboard')}
                            className="dwo-display text-2xl tracking-[0.06em] text-[color:var(--dwo-text)]"
                        >
                            DWO <span className="text-sm tracking-[0.18em] text-[color:var(--dwo-muted)]">Admin</span>
                        </Link>
                        <nav className="hidden items-center gap-5 text-sm text-[color:var(--dwo-muted)] md:flex">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="hover:text-[color:var(--dwo-text)]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 text-sm sm:gap-3">
                        <ThemeToggle />
                        <span className="hidden max-w-[14rem] truncate text-[color:var(--dwo-muted)] sm:inline">
                            {user?.email}
                        </span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="dwo-ghost-btn px-3 py-2 text-[10px]"
                        >
                            Logout
                        </Link>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center border border-[color:var(--dwo-border)] text-[color:var(--dwo-text)] md:hidden"
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav className="border-t border-[color:var(--dwo-border)] px-4 py-3 md:hidden">
                        <div className="flex flex-col gap-2 text-sm">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 text-[color:var(--dwo-text)] hover:bg-[color:var(--dwo-bg-soft)]"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <p className="px-3 pt-2 text-xs text-[color:var(--dwo-muted)] sm:hidden">{user?.email}</p>
                        </div>
                    </nav>
                )}
            </header>

            <main className="dwo-container py-6 md:py-8 xl:py-10">
                <h1 className="dwo-display mb-5 text-3xl tracking-wide text-[color:var(--dwo-text)] md:mb-6 md:text-4xl">
                    {title}
                </h1>
                {children}
            </main>
        </div>
    );
}
