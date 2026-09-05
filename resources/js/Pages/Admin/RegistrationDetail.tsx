import Modal from '@/Components/Modal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Props = {
    registration: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        whatsapp: string;
        location: string;
        experience_level: string;
        schedule: string | null;
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
    masterclass?: { fee: { display: string } };
};

export default function RegistrationDetail({ registration, whatsappUrl, masterclass }: Props) {
    const [showVerify, setShowVerify] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const feeDisplay = masterclass?.fee.display ?? `GHS ${registration.amount}`;

    const confirmVerify = () => {
        setProcessing(true);
        router.post(
            route('admin.payments.verify', registration.id),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setShowVerify(false);
                },
            },
        );
    };

    const confirmReject = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(
            route('admin.payments.reject', registration.id),
            { admin_note: adminNote || null },
            {
                onFinish: () => {
                    setProcessing(false);
                    setShowReject(false);
                    setAdminNote('');
                },
            },
        );
    };

    return (
        <AdminLayout title={registration.full_name}>
            <Head title={registration.full_name} />
            <Link href={route('admin.registrations.index')} className="text-sm text-[color:var(--dwo-muted)] hover:underline">
                ← All registrations
            </Link>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="dwo-glass p-5">
                    <h2 className="font-medium">Details</h2>
                    <dl className="mt-4 space-y-2 text-sm">
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Email</dt>
                            <dd>{registration.email}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">WhatsApp</dt>
                            <dd>{registration.whatsapp}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Phone</dt>
                            <dd>{registration.phone || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Location</dt>
                            <dd>{registration.location}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Experience</dt>
                            <dd>{registration.experience_level}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Schedule</dt>
                            <dd>
                                {registration.schedule === 'WEEKDAYS'
                                    ? 'Weekdays (Monday – Friday)'
                                    : registration.schedule === 'WEEKENDS'
                                      ? 'Weekends (Saturday & Sunday)'
                                      : registration.schedule || '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Status</dt>
                            <dd>{registration.payment_status}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Reference</dt>
                            <dd className="font-mono">{registration.reference}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--dwo-muted)]">Amount</dt>
                            <dd>{feeDisplay}</dd>
                        </div>
                    </dl>

                    {registration.payment_status === 'PAYMENT_SUBMITTED' && (
                        <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                            Verify this payment against the receiving Mobile Money account/wallet or statement before
                            marking it as paid.
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                        {registration.payment_status === 'PAYMENT_SUBMITTED' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowVerify(true)}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)]"
                                >
                                    ✓ Verify payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReject(true)}
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)]"
                                >
                                    Reject payment
                                </button>
                            </>
                        )}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-[color:var(--dwo-bg-soft)] px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)]"
                        >
                            Open WhatsApp
                        </a>
                    </div>
                </div>

                <div className="dwo-glass p-5">
                    <h2 className="font-medium">Payment submissions</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        {registration.submissions.map((s) => (
                            <li key={s.id} className="rounded-lg border border-[color:var(--dwo-border)] p-3">
                                <p>
                                    {s.sender_name} · {s.sender_phone}
                                </p>
                                <p className="text-[color:var(--dwo-muted)]">Txn: {s.transaction_reference || '—'}</p>
                                <p className="text-[color:var(--dwo-muted)]">{s.payment_date_time}</p>
                                {s.admin_note && <p className="text-rose-600">Note: {s.admin_note}</p>}
                                <p className="text-xs text-zinc-400">{s.is_active ? 'Active' : 'Inactive'}</p>
                            </li>
                        ))}
                        {registration.submissions.length === 0 && (
                            <li className="text-[color:var(--dwo-muted)]">No submissions yet.</li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal show={showVerify} onClose={() => setShowVerify(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--dwo-text)]">Confirm verification</h3>
                    <p className="mt-3 text-sm text-zinc-400">
                        Confirm that you have independently verified that {feeDisplay} was received for{' '}
                        <span className="font-mono font-medium">{registration.reference}</span>.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowVerify(false)}
                            className="rounded-lg border border-[color:var(--dwo-border)] px-4 py-2 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={confirmVerify}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)] disabled:opacity-60"
                        >
                            Confirm & mark paid
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={showReject} onClose={() => setShowReject(false)} maxWidth="md">
                <form onSubmit={confirmReject} className="p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--dwo-text)]">Reject payment</h3>
                    <textarea
                        className="mt-4 w-full rounded-lg border-zinc-700 bg-zinc-900 text-sm text-[color:var(--dwo-text)]"
                        rows={4}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Payment could not be matched to the receiving account."
                    />
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowReject(false)}
                            className="rounded-lg border border-[color:var(--dwo-border)] px-4 py-2 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)] disabled:opacity-60"
                        >
                            Reject payment
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
