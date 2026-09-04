import { Head, Link } from '@inertiajs/react';

type Props = {
    registration: {
        reference: string;
        full_name: string;
        amount: number;
        currency: string;
        token: string;
    };
    masterclass: { brand: string; fee: { display: string } };
    momo: { method_label: string; number: string; account_name: string };
};

export default function Instructions({ registration, masterclass, momo }: Props) {
    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`Pay · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-6 py-10">
                <h1 className="text-3xl font-semibold">Complete payment</h1>
                <p className="mt-2 text-zinc-400">
                    Hi {registration.full_name}. Ref: {registration.reference}
                </p>

                <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">Method</p>
                        <p className="mt-1 font-medium">{momo.method_label}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">MoMo number</p>
                        <p className="mt-1 text-2xl font-semibold tracking-wide">{momo.number}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">Account name</p>
                        <p className="mt-1 font-medium">{momo.account_name}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">Amount</p>
                        <p className="mt-1 text-xl font-semibold">{masterclass.fee.display}</p>
                    </div>
                </div>

                <ol className="mt-6 list-decimal space-y-2 pl-5 text-zinc-300">
                    <li>Open your MTN Mobile Money app or menu.</li>
                    <li>Send {masterclass.fee.display} to {momo.number}.</li>
                    <li>Confirm the name matches {momo.account_name}.</li>
                    <li>Return here and submit your payment details.</li>
                </ol>

                <Link
                    href={route('payment.submit', registration.token)}
                    className="mt-8 block w-full rounded-full bg-[#e8ff47] px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-black"
                >
                    I have paid — submit details
                </Link>
            </div>
        </div>
    );
}
