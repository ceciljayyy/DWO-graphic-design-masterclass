import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: { reference: string; full_name: string; payment_status: string };
    masterclass: { brand: string };
};

export default function Submitted({ registration, masterclass }: Props) {
    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`Submitted · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-6 py-16 text-center">
                <h1 className="text-3xl font-semibold">Payment submitted</h1>
                <p className="mt-4 text-zinc-300">
                    Thanks {registration.full_name}. We received your payment details for{' '}
                    <span className="font-medium text-white">{registration.reference}</span>.
                </p>
                <p className="mt-3 text-zinc-400">
                    An admin will verify your MTN MoMo payment shortly. You will get confirmation once approved.
                </p>
                <Link href={route('home')} className="mt-8 inline-block text-sm text-[#e8ff47] hover:underline">
                    Back to home
                </Link>
            </div>
        </div>
    );
}
