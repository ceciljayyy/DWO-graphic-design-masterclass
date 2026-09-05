import CopyButton from '@/Components/CopyButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { AirtelTigoLogo, MtnLogo, TelecelLogo } from '@/Components/NetworkLogos';
import TextInput from '@/Components/TextInput';
import PublicShell from '@/Components/PublicShell';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

type NetworkOption = {
    value: 'MTN' | 'TELECEL' | 'AIRTELTIGO';
    label: string;
};

type Props = {
    registration: { token: string; reference: string; full_name: string };
    masterclass: { brand: string; fee: { display: string }; name: string };
    momo: {
        method_label: string;
        networks: NetworkOption[];
    };
};

const networkLogos: Record<NetworkOption['value'], ReactNode> = {
    MTN: <MtnLogo className="h-11 w-11" />,
    TELECEL: <TelecelLogo className="h-11 w-11" />,
    AIRTELTIGO: <AirtelTigoLogo className="h-11 w-11" />,
};

export default function Submit({ registration, masterclass, momo }: Props) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 5);
    const networks = momo.networks?.length
        ? momo.networks
        : [
              { value: 'MTN' as const, label: 'MTN' },
              { value: 'TELECEL' as const, label: 'Telecel (Vodafone)' },
              { value: 'AIRTELTIGO' as const, label: 'AT (AirtelTigo)' },
          ];

    const { data, setData, post, processing, errors } = useForm({
        network: 'MTN',
        sender_name: registration.full_name,
        sender_phone: '',
        transaction_reference: registration.reference,
        payment_date: today,
        payment_time: now,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('payment.submit.store', registration.token));
    };

    return (
        <PublicShell>
            <Head title={`Verify payment · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-5 py-10 sm:px-6">
                <Link
                    href={route('payment.show', registration.token)}
                    className="text-sm text-zinc-400 hover:text-white focus:outline-none focus-visible:underline"
                >
                    ← Back to payment instructions
                </Link>

                <h1 className="mt-6 text-3xl font-semibold tracking-tight">Verify your payment</h1>
                <p className="mt-2 text-zinc-400">
                    Confirm the details of the Mobile Money payment you sent using your registration ID as the
                    reference.
                </p>

                <div className="mt-6 rounded-2xl border-2 border-[#e8ff47]/40 bg-[#e8ff47]/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8ff47]">
                        Registration ID / payment reference
                    </p>
                    <p className="mt-2 break-all font-mono text-xl font-semibold">{registration.reference}</p>
                    <div className="mt-3">
                        <CopyButton value={registration.reference} label="Copy reference" copiedLabel="Copied" />
                    </div>
                    <p className="mt-3 text-sm text-zinc-200">
                        This must match the reference you entered on Mobile Money. It is required for DWO to verify
                        your payment and send your confirmation email and WhatsApp message.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <fieldset>
                        <legend className="text-sm font-medium text-zinc-300">Choose network</legend>
                        <div className="mt-3 grid gap-3" role="radiogroup" aria-label="Choose network">
                            {networks.map((network) => {
                                const selected = data.network === network.value;
                                return (
                                    <label
                                        key={network.value}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                                            selected
                                                ? 'border-[#e8ff47] bg-[#e8ff47]/10'
                                                : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="network"
                                            value={network.value}
                                            checked={selected}
                                            onChange={() => setData('network', network.value)}
                                            className="sr-only"
                                        />
                                        <span className="shrink-0">{networkLogos[network.value]}</span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-white">
                                                {network.label}
                                            </span>
                                            <span className="block text-xs text-zinc-400">Mobile Money</span>
                                        </span>
                                        <span
                                            className={`ml-auto h-4 w-4 rounded-full border ${
                                                selected
                                                    ? 'border-[#e8ff47] bg-[#e8ff47]'
                                                    : 'border-zinc-500 bg-transparent'
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <InputError message={errors.network} className="mt-1" />
                    </fieldset>

                    <div>
                        <InputLabel
                            htmlFor="sender_name"
                            value="Name used to make the payment"
                            className="text-zinc-300"
                        />
                        <TextInput
                            id="sender_name"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.sender_name}
                            onChange={(e) => setData('sender_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.sender_name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="sender_phone"
                            value="Phone number used to send the payment"
                            className="text-zinc-300"
                        />
                        <TextInput
                            id="sender_phone"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.sender_phone}
                            onChange={(e) => setData('sender_phone', e.target.value)}
                            required
                        />
                        <InputError message={errors.sender_phone} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="amount_paid" value="Amount paid" className="text-zinc-300" />
                        <TextInput
                            id="amount_paid"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={masterclass.fee.display}
                            readOnly
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="transaction_reference"
                            value="Payment reference (registration ID) — required"
                            className="text-zinc-300"
                        />
                        <TextInput
                            id="transaction_reference"
                            className="mt-1 block w-full border-[#e8ff47]/40 bg-zinc-900 font-mono text-white"
                            value={data.transaction_reference}
                            onChange={(e) => setData('transaction_reference', e.target.value.toUpperCase())}
                            required
                        />
                        <p className="mt-1 text-xs text-zinc-400">
                            Must be exactly <span className="font-mono text-[#e8ff47]">{registration.reference}</span>
                            — the same ID you used as the Mobile Money reference.
                        </p>
                        <InputError message={errors.transaction_reference} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="payment_date" value="Payment date" className="text-zinc-300" />
                            <TextInput
                                id="payment_date"
                                type="date"
                                className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.payment_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="payment_time" value="Payment time" className="text-zinc-300" />
                            <TextInput
                                id="payment_time"
                                type="time"
                                className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                                value={data.payment_time}
                                onChange={(e) => setData('payment_time', e.target.value)}
                                required
                            />
                            <InputError message={errors.payment_time} className="mt-1" />
                        </div>
                    </div>

                    <p className="text-sm text-zinc-400">
                        Your payment will be reviewed manually. Once verified, you will receive a confirmation email
                        and WhatsApp message.
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-[#e8ff47] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47]"
                    >
                        Submit payment for verification
                    </button>
                </form>
            </div>
        </PublicShell>
    );
}
