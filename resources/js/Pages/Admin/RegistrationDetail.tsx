import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

type Props = {
    registration: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        whatsapp: string;
        location: string;
        experience_level: string;
        payment_status: string;
        reference: string;
        amount: number;
        paid_at: string | null;
        created_at: string | null;
        submissions: {
            id: string;
            sender_name: string;
            sender_phone: string;
            transaction_reference: string | null;
            payment_date_time: string | null;
            is_active: boolean;
            admin_note: string | null;
        }[];
    };
    whatsappUrl: string;
};

export default function RegistrationDetail({ registration, whatsappUrl }: Props) {
    return (
        <AdminLayout title={registration.full_name}>
            <Head title={registration.full_name} />
            <Link href={route('admin.registrations.index')} className="text-sm text-zinc-500 hover:underline">
                ← All registrations
            </Link>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <h2 className="font-medium">Details</h2>
                    <dl className="mt-4 space-y-2 text-sm">
                        <div>
                            <dt className="text-zinc-500">Email</dt>
                            <dd>{registration.email}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">WhatsApp</dt>
                            <dd>{registration.whatsapp}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Phone</dt>
                            <dd>{registration.phone || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Location</dt>
                            <dd>{registration.location}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Experience</dt>
                            <dd>{registration.experience_level}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Status</dt>
                            <dd>{registration.payment_status}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Reference</dt>
                            <dd>{registration.reference}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Amount</dt>
                            <dd>GHS {registration.amount}</dd>
                        </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {registration.payment_status === 'PAYMENT_SUBMITTED' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => router.post(route('admin.payments.verify', registration.id))}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                                >
                                    Verify payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.post(route('admin.payments.reject', registration.id))}
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white"
                                >
                                    Reject
                                </button>
                            </>
                        )}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                        >
                            Open WhatsApp
                        </a>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <h2 className="font-medium">Payment submissions</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        {registration.submissions.map((s) => (
                            <li key={s.id} className="rounded-lg border border-zinc-100 p-3">
                                <p>
                                    {s.sender_name} · {s.sender_phone}
                                </p>
                                <p className="text-zinc-500">Txn: {s.transaction_reference || '—'}</p>
                                <p className="text-zinc-500">{s.payment_date_time}</p>
                                {s.admin_note && <p className="text-rose-600">Note: {s.admin_note}</p>}
                                <p className="text-xs text-zinc-400">{s.is_active ? 'Active' : 'Inactive'}</p>
                            </li>
                        ))}
                        {registration.submissions.length === 0 && (
                            <li className="text-zinc-500">No submissions yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
