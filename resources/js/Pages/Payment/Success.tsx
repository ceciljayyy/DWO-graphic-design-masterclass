import CopyButton from '@/Components/CopyButton';
import PublicShell from '@/Components/PublicShell';
import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: {
        reference: string;
        full_name: string;
        token: string;
    };
    masterclass: { brand: string; name: string };
};

export default function Success({ registration, masterclass }: Props) {
    return (
        <PublicShell>
            <Head title={`Registration successful · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-5 py-12 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8ff47]">
                    Registration successful
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    You&apos;re officially registered
                </h1>
                <p className="mt-3 text-zinc-400">
                    Hi {registration.full_name}. You&apos;re registered for the {masterclass.name}.
                </p>

                <div className="mt-8 rounded-2xl border-2 border-[#e8ff47]/40 bg-[#e8ff47]/10 p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8ff47]">
                        Your payment reference (registration ID)
                    </p>
                    <p className="mt-3 break-all font-mono text-2xl font-semibold tracking-wide text-white sm:text-3xl">
                        {registration.reference}
                    </p>
                    <div className="mt-4">
                        <CopyButton value={registration.reference} label="Copy reference" copiedLabel="Copied" />
                    </div>
                    <p className="mt-5 text-sm font-semibold text-white">
                        This registration ID is your Mobile Money payment reference.
                    </p>
                    <p className="mt-2 text-sm text-zinc-200">
                        When you leave this site to pay, enter{' '}
                        <span className="font-mono font-semibold text-[#e8ff47]">{registration.reference}</span> as
                        the reference / description / payment note so the DWO team can find and verify your payment.
                    </p>
                    <p className="mt-3 text-sm text-zinc-300">
                        After verification, you will receive a confirmation email and WhatsApp message. Without this
                        reference, we cannot confirm your payment.
                    </p>
                </div>

                <Link
                    href={route('payment.show', registration.token)}
                    className="mt-8 flex w-full items-center justify-center rounded-full bg-[#e8ff47] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c]"
                >
                    Continue to payment →
                </Link>
            </div>
        </PublicShell>
    );
}
