import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AdminLayout({ children, title }: PropsWithChildren<{ title: string }>) {
    const user = usePage().props.auth?.user as { name?: string; email?: string } | undefined;

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-900">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-6">
                        <Link href={route('admin.dashboard')} className="font-semibold tracking-wide">
                            DWO Admin
                        </Link>
                        <nav className="flex gap-4 text-sm">
                            <Link href={route('admin.dashboard')} className="hover:underline">
                                Dashboard
                            </Link>
                            <Link href={route('admin.payments.index')} className="hover:underline">
                                Payments
                            </Link>
                            <Link href={route('admin.registrations.index')} className="hover:underline">
                                Registrations
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-500">{user?.email}</span>
                        <Link href={route('logout')} method="post" as="button" className="hover:underline">
                            Logout
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
                {children}
            </main>
        </div>
    );
}
