import CopyButton from '@/Components/CopyButton';
import PublicShell from '@/Components/PublicShell';
import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: {
        reference: string;
        full_name: string;
        amount: number;
        currency: string;
        token: string;
    };
    masterclass: { brand: string; name: string; fee: { display: string } };
    momo: { method_label: string; number: string; account_name: string };
};

export default function Instructions({ registration, masterclass, momo }: Props) {
    return (
        <PublicShell>
            <Head title={`Complete payment · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-5 py-10 sm:px-6 sm:py-12">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Complete your payment
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pay for your place</h1>
                <p className="mt-2 text-zinc-400">
                    For <span className="text-white">{masterclass.name}</span>
                </p>

                <div className="mt-6 rounded-2xl border-2 border-[#e8ff47]/50 bg-[#e8ff47]/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8ff47]">
                        Required payment reference
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                        Use your registration ID as the Mobile Money reference
                    </p>
                    <p className="mt-3 break-all font-mono text-2xl font-semibold tracking-wide text-white sm:text-3xl">
                        {registration.reference}
                    </p>
                    <div className="mt-4">
                        <CopyButton value={registration.reference} label="Copy payment reference" copiedLabel="Copied" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-100">
                        When you leave this website to pay on MTN Mobile Money, paste this exact ID into the
                        reference / description / payment-note field.
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#e8ff47]">
                        This is how DWO verifies your payment. After verification you get a confirmation email and
                        WhatsApp message.
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                        {masterclass.fee.display}
                    </p>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Pay to</p>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-300">
                        {momo.method_label}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="break-all text-3xl font-semibold tracking-wide">{momo.number}</p>
                        <div className="shrink-0 md:hidden">
                            <CopyButton value={momo.number} variant="icon" />
                        </div>
                        <div className="hidden shrink-0 md:block">
                            <CopyButton value={momo.number} label="Copy" copiedLabel="Copied" />
                        </div>
                    </div>
                    <p className="mt-5 text-xl font-bold tracking-wide text-white sm:text-2xl">
                        {momo.account_name}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                        Please confirm this name before sending your payment.
                    </p>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-amber-200">
                        Before you leave this site
                    </h2>
                    <p className="mt-3 text-sm text-amber-50">
                        Copy your registration ID first. On Mobile Money, enter it as the payment reference so we can
                        match your transfer and confirm you.
                    </p>
                    <p className="mt-3 break-all rounded-lg border border-amber-400/30 bg-black/30 px-3 py-2 font-mono text-base font-semibold text-[#e8ff47]">
                        {registration.reference}
                    </p>
                    <p className="mt-3 text-sm text-amber-50/90">
                        Do not invent a different reference. Do not use another customer&apos;s ID. Without{' '}
                        {registration.reference}, we cannot verify your payment or send confirmation.
                    </p>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-300">
                        You&apos;ll leave this page briefly
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Open MTN Mobile Money, send the payment with your registration ID as the reference, then return
                        here and select “I&apos;ve made payment”.
                    </p>
                </div>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">How to pay</h2>
                    <ol className="mt-4 space-y-4">
                        {[
                            [
                                '01',
                                'Copy your registration ID',
                                `Copy ${registration.reference} — this is your required payment reference.`,
                            ],
                            ['02', 'Copy the MoMo number', momo.number],
                            ['03', 'Open Mobile Money', 'Open your MTN Mobile Money app or menu.'],
                            ['04', 'Send the payment', `Send ${masterclass.fee.display} to ${momo.number}.`],
                            ['05', 'Confirm the recipient', `Confirm the name is ${momo.account_name}.`],
                            [
                                '06',
                                'Paste your registration ID as the reference',
                                `Enter ${registration.reference} in the reference / description / payment-note field.`,
                            ],
                            ['07', 'Complete the payment', 'Finish the Mobile Money transaction.'],
                            [
                                '08',
                                'Return to this website',
                                'Come back here and select “I’ve made payment”. You will confirm the same registration ID on the next form.',
                            ],
                        ].map(([step, title, body]) => (
                            <li key={step} className="flex gap-4">
                                <span className="mt-0.5 font-mono text-xs font-bold text-[#e8ff47]">{step}</span>
                                <div className="min-w-0">
                                    <p className="font-medium text-white">{title}</p>
                                    <p className="mt-1 break-words text-sm text-zinc-400">{body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-300">Before you continue</h2>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                        <li>✓ Send exactly {masterclass.fee.display}</li>
                        <li>✓ Send to {momo.number}</li>
                        <li>✓ Confirm the account name is {momo.account_name}</li>
                        <li>
                            ✓ Used <span className="font-mono text-[#e8ff47]">{registration.reference}</span> as
                            the MoMo payment reference
                        </li>
                        <li>✓ Ready to confirm that same registration ID on the next page</li>
                    </ul>
                </section>

                <Link
                    href={route('payment.submit', registration.token)}
                    className="mt-8 flex w-full items-center justify-center rounded-full bg-[#e8ff47] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c]"
                >
                    I&apos;ve made payment
                </Link>
            </div>
        </PublicShell>
    );
}
