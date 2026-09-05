import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PublicShell from '@/Components/PublicShell';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

type Props = {
    masterclass: { brand: string; fee: { display: string }; name: string };
    experienceLevels: string[];
    schedules: { value: string; label: string }[];
};

type RegisterForm = {
    full_name: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    experience_level: string;
    schedule: string;
    marketing_source: string;
};

const DRAFT_KEY = 'dwo.register.draft';

const emptyForm = (): RegisterForm => ({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    experience_level: 'BEGINNER',
    schedule: 'WEEKDAYS',
    marketing_source: '',
});

function readDraft(): RegisterForm | null {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<RegisterForm>;
        const draft = emptyForm();

        (Object.keys(draft) as (keyof RegisterForm)[]).forEach((key) => {
            if (typeof parsed[key] === 'string') {
                draft[key] = parsed[key] as string;
            }
        });

        return draft;
    } catch {
        return null;
    }
}

function formHasContent(form: RegisterForm): boolean {
    const blank = emptyForm();

    return (Object.keys(form) as (keyof RegisterForm)[]).some((key) => form[key] !== blank[key]);
}

export default function Register({ masterclass, experienceLevels, schedules }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>(emptyForm());
    const [hydrated, setHydrated] = useState(false);
    const [draftRestored, setDraftRestored] = useState(false);

    useEffect(() => {
        const draft = readDraft();
        if (draft && formHasContent(draft)) {
            setData(draft);
            setDraftRestored(true);
        }
        setHydrated(true);
        // Restore once on mount only.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        if (formHasContent(data)) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(DRAFT_KEY);
            setDraftRestored(false);
        }
    }, [data, hydrated]);

    const clearSavedInfo = () => {
        localStorage.removeItem(DRAFT_KEY);
        reset();
        setDraftRestored(false);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register.store'), {
            onSuccess: () => {
                localStorage.removeItem(DRAFT_KEY);
                setDraftRestored(false);
            },
        });
    };

    const showClearOption = draftRestored || formHasContent(data);

    return (
        <PublicShell backHref={route('home')}>
            <Head title={`Register · ${masterclass.brand}`} />
            <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
                <h1 className="text-3xl font-semibold text-[color:var(--dwo-text)]">Register</h1>
                <p className="mt-2 text-[color:var(--dwo-muted)]">
                    {masterclass.name} · {masterclass.fee.display}
                </p>

                {showClearOption && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 dwo-glass px-4 py-3 text-sm">
                        <p className="text-[color:var(--dwo-muted)]">
                            {draftRestored
                                ? 'Your previous answers were restored after refresh.'
                                : 'Your answers are saved on this device while you fill the form.'}
                        </p>
                        <button
                            type="button"
                            onClick={clearSavedInfo}
                            className="shrink-0 text-[color:var(--dwo-accent)] hover:underline"
                        >
                            Clear form
                        </button>
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div>
                        <InputLabel htmlFor="full_name" value="Full name" />
                        <TextInput
                            id="full_name"
                            className="mt-1 block w-full"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.full_name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="whatsapp" value="WhatsApp (with country code)" />
                        <TextInput
                            id="whatsapp"
                            className="mt-1 block w-full"
                            placeholder="+233..."
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            required
                        />
                        <InputError message={errors.whatsapp} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone (optional)" />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="City / location" />
                        <TextInput
                            id="location"
                            className="mt-1 block w-full"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            required
                        />
                        <InputError message={errors.location} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="experience_level" value="Experience level" />
                        <select
                            id="experience_level"
                            className="dwo-input mt-1 block w-full"
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

                    <div>
                        <InputLabel htmlFor="schedule" value="Preferred schedule" />
                        <select
                            id="schedule"
                            className="dwo-input mt-1 block w-full"
                            value={data.schedule}
                            onChange={(e) => setData('schedule', e.target.value)}
                            required
                        >
                            {schedules.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.schedule} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="dwo-accent-btn w-full rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide disabled:opacity-60"
                    >
                        Continue to payment
                    </button>
                </form>
            </div>
        </PublicShell>
    );
}
