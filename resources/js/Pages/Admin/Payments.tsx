import Modal from '@/Components/Modal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Item = {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string;
    reference: string;
    amount: number;
    fee_display: string;
    submission: {
        method: string;
        sender_name: string;
        sender_phone: string;
        transaction_reference: string | null;
        payment_date_time: string | null;
    } | null;
};

type Props = {
    items: {
        data: Item[];
    };
    masterclass: { fee: { display: string }; momo: { method_label: string } };
};

function networkLabel(method: string): string {
    return (
        {
            MTN: 'MTN',
            TELECEL: 'Telecel (Vodafone)',
            AIRTELTIGO: 'AT (AirtelTigo)',
            MTN_MOBILE_MONEY: 'MTN',
        }[method] ?? method
    );
}

export default function Payments({ items, masterclass }: Props) {
    const [verifyItem, setVerifyItem] = useState<Item | null>(null);
    const [rejectItem, setRejectItem] = useState<Item | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const confirmVerify = () => {
        if (!verifyItem) {
            return;
        }
        setProcessing(true);
        router.post(
            route('admin.payments.verify', verifyItem.id),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setVerifyItem(null);
                },
            },
        );
    };

    const confirmReject = (e: FormEvent) => {
        e.preventDefault();
        if (!rejectItem) {
            return;
        }
        setProcessing(true);
        router.post(
            route('admin.payments.reject', rejectItem.id),
            { admin_note: adminNote || 'Could not confirm payment' },
            {
                onFinish: () => {
                    setProcessing(false);
                    setRejectItem(null);
                    setAdminNote('');
                },
            },
        );
    };

    return (
        <AdminLayout title="Payment approvals">
            <Head title="Payment approvals" />
            <p className="mb-6 max-w-3xl text-sm text-zinc-400">
                Verify this payment against the receiving Mobile Money account/wallet or statement before marking it as
                paid. The website does not automatically know whether money was received.
            </p>

            <div className="space-y-4">
                {items.data.length === 0 && (
                    <p className="dwo-glass p-6 text-[color:var(--dwo-muted)]">
                        No payments waiting for verification.
                    </p>
                )}
                {items.data.map((item) => (
                    <div key={item.id} className="dwo-glass p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 space-y-1 text-sm">
                                <h2 className="text-base font-semibold text-[color:var(--dwo-text)]">{item.full_name}</h2>
                                <p className="text-[color:var(--dwo-muted)]">
                                    {item.email} · {item.whatsapp}
                                </p>
                                <p>
                                    <span className="text-[color:var(--dwo-muted)]">Reference:</span>{' '}
                                    <span className="font-mono font-medium">{item.reference}</span>
                                </p>
                                <p>
                                    <span className="text-[color:var(--dwo-muted)]">Network:</span>{' '}
                                    {item.submission ? networkLabel(item.submission.method) : masterclass.momo.method_label}
                                </p>
                                <p>
                                    <span className="text-[color:var(--dwo-muted)]">Amount:</span> {item.fee_display}
                                </p>
                                {item.submission && (
                                    <div className="mt-3 space-y-1 text-[color:var(--dwo-muted)]">
                                        <p>
                                            Sender: {item.submission.sender_name} ({item.submission.sender_phone})
                                        </p>
                                        <p>Txn: {item.submission.transaction_reference || '—'}</p>
                                        <p>Paid at: {item.submission.payment_date_time || '—'}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setVerifyItem(item)}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)]"
                                >
                                    ✓ Verify payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAdminNote('');
                                        setRejectItem(item);
                                    }}
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-[color:var(--dwo-text)]"
                                >
                                    Reject payment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={verifyItem !== null} onClose={() => setVerifyItem(null)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--dwo-text)]">Confirm verification</h3>
                    <p className="mt-3 text-sm text-zinc-400">
                        Confirm that you have independently verified that {masterclass.fee.display} was received for{' '}
                        <span className="font-mono font-medium text-[color:var(--dwo-text)]">{verifyItem?.reference}</span>.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setVerifyItem(null)}
                            className="rounded-lg border border-[color:var(--dwo-border)] px-4 py-2 text-sm font-medium text-[color:var(--dwo-muted)]"
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

            <Modal show={rejectItem !== null} onClose={() => setRejectItem(null)} maxWidth="md">
                <form onSubmit={confirmReject} className="p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--dwo-text)]">Reject payment</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        Optional note for {rejectItem?.reference}. The customer may resubmit after rejection.
                    </p>
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
                            onClick={() => setRejectItem(null)}
                            className="rounded-lg border border-[color:var(--dwo-border)] px-4 py-2 text-sm font-medium text-[color:var(--dwo-muted)]"
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
