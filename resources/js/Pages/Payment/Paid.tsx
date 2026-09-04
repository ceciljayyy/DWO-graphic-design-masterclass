import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: { reference: string; full_name: string };
    masterclass: { brand: string };
};

export default function Paid({ registration, masterclass }: Props) {
    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`Paid · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-6 py-16 text-center">
                <h1 className="text-3xl font-semibold">You are confirmed</h1>
                <p className="mt-4 text-zinc-300">
                    {registration.full_name}, your payment for {registration.reference} is verified. Welcome to the
                    class.
                </p>
                <Link href={route('home')} className="mt-8 inline-block text-sm text-[#e8ff47] hover:underline">
                    Back to home
                </Link>
            </div>
        </div>
    );
}
