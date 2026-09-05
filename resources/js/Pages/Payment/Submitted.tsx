import CopyButton from '@/Components/CopyButton';
import PublicShell from '@/Components/PublicShell';
import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: { reference: string; full_name: string; payment_status: string };
    masterclass: { brand: string };
};

export default function Submitted({ registration, masterclass }: Props) {
    return (
        <PublicShell>
            <Head title={`Payment submitted · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8ff47]">
                    Payment details submitted
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">Payment submitted</h1>
                <p className="mt-4 text-zinc-300">
                    Thanks {registration.full_name}. We&apos;ve received your payment details.
                </p>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Registration reference
                    </p>
                    <p className="mt-2 break-all font-mono text-xl font-semibold">{registration.reference}</p>
                    <div className="mt-3">
                        <CopyButton value={registration.reference} label="Copy reference" copiedLabel="Copied" />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Payment status
                    </p>
                    <p className="mt-2 text-lg font-semibold text-amber-200">Awaiting verification</p>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-zinc-400">
                    Your payment information has been received and will be reviewed shortly. Once your payment has been
                    verified, your registration will be marked as paid, and you will receive an email and WhatsApp
                    message with further details. Thank you.
                </p>

                <Link href={route('home')} className="mt-8 inline-block text-sm text-[#e8ff47] hover:underline">
                    Back to home
                </Link>
            </div>
        </PublicShell>
    );
}
