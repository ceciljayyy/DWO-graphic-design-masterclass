import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = {
    masterclass: { brand: string; fee: { display: string }; name: string };
    experienceLevels: string[];
};

export default function Register({ masterclass, experienceLevels }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
        whatsapp: '',
        location: '',
        experience_level: 'BEGINNER',
        marketing_source: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register.store'));
    };

    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white">
            <Head title={`Register · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-6 py-10">
                <Link href={route('home')} className="text-sm text-zinc-400 hover:text-white">
                    ← Back
                </Link>
                <h1 className="mt-6 text-3xl font-semibold">Register</h1>
                <p className="mt-2 text-zinc-400">
                    {masterclass.name} · {masterclass.fee.display}
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div>
                        <InputLabel htmlFor="full_name" value="Full name" className="text-zinc-300" />
                        <TextInput
                            id="full_name"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.full_name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-zinc-300" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="whatsapp" value="WhatsApp (with country code)" className="text-zinc-300" />
                        <TextInput
                            id="whatsapp"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            placeholder="+233..."
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            required
                        />
                        <InputError message={errors.whatsapp} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone (optional)" className="text-zinc-300" />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="City / location" className="text-zinc-300" />
                        <TextInput
                            id="location"
                            className="mt-1 block w-full border-zinc-700 bg-zinc-900 text-white"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            required
                        />
                        <InputError message={errors.location} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="experience_level" value="Experience level" className="text-zinc-300" />
                        <select
                            id="experience_level"
                            className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-900 text-white shadow-sm"
                            value={data.experience_level}
                            onChange={(e) => setData('experience_level', e.target.value)}
                        >
                            {experienceLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.experience_level} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-[#e8ff47] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black disabled:opacity-60"
                    >
                        Continue to payment
                    </button>
                </form>
            </div>
        </div>
    );
}
