import PublicShell from '@/Components/PublicShell';
import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: { reference: string; full_name: string };
    masterclass: { brand: string; name: string };
};

export default function Paid({ registration, masterclass }: Props) {
    return (
        <PublicShell>
            <Head title={`Payment verified · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8ff47]">Payment verified</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">You are confirmed</h1>
                <p className="mt-4 text-zinc-300">
                    {registration.full_name}, your payment for{' '}
                    <span className="font-mono text-white">{registration.reference}</span> is verified. Welcome to the{' '}
                    {masterclass.name}.
                </p>
                <Link href={route('home')} className="mt-8 inline-block text-sm text-[#e8ff47] hover:underline">
                    Back to home
                </Link>
            </div>
        </PublicShell>
    );
}
