import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = {
    registration: { token: string; reference: string; full_name: string };
    masterclass: { brand: string; fee: { display: string } };
};

export default function Submit({ registration, masterclass }: Props) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 5);

    const { data, setData, post, processing, errors } = useForm({
        sender_name: registration.full_name,
        sender_phone: '',
        transaction_reference: '',
        payment_date: today,
        payment_time: now,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('payment.submit.store', registration.token));
    };

    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`Submit payment · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-6 py-10">
                <Link
                    href={route('payment.show', registration.token)}
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    ← Back to instructions
                </Link>
                <h1 className="mt-6 text-3xl font-semibold">Submit payment details</h1>
                <p className="mt-2 text-zinc-400">
                    Ref {registration.reference} · {masterclass.fee.display}
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div>
                        <InputLabel htmlFor="sender_name" value="Sender name" className="text-zinc-300" />
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
                        <InputLabel htmlFor="sender_phone" value="Sender MoMo number" className="text-zinc-300" />
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
                        <InputLabel
                            htmlFor="transaction_reference"
                            value="Transaction ID (optional)"
                            className="text-zinc-300"
                        />
                        <TextInput
                            id="transaction_reference"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.transaction_reference}
                            onChange={(e) => setData('transaction_reference', e.target.value)}
                        />
                        <InputError message={errors.transaction_reference} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-[#e8ff47] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black disabled:opacity-60"
                    >
                        Submit for verification
                    </button>
                </form>
            </div>
        </div>
    );
}
