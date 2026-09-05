import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
    backHref?: string;
    backLabel?: string;
    showHome?: boolean;
}>;

export default function PublicShell({
    children,
    backHref,
    backLabel = '← Back',
    showHome = true,
}: Props) {
    return (
        <div className="dwo-page">
            <header className="dwo-header-bar">
                <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="min-w-0">
                        {backHref ? (
                            <Link
                                href={backHref}
                                className="text-sm text-[color:var(--dwo-muted)] hover:text-[color:var(--dwo-text)]"
                            >
                                {backLabel}
                            </Link>
                        ) : showHome ? (
                            <Link
                                href={route('home')}
                                className="dwo-display text-2xl tracking-[0.06em] text-[color:var(--dwo-text)]"
                            >
                                DWO
                            </Link>
                        ) : (
                            <span className="dwo-display text-2xl tracking-[0.06em]">DWO</span>
                        )}
                    </div>
                    <ThemeToggle />
                </div>
            </header>
            {children}
        </div>
    );
}
