import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

type Item = {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string;
    reference: string;
    amount: number;
    submission: {
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
};

export default function Payments({ items }: Props) {
    return (
        <AdminLayout title="Payment approvals">
            <Head title="Payment approvals" />
            <div className="space-y-4">
                {items.data.length === 0 && (
                    <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-500">
                        No payments waiting for verification.
                    </p>
                )}
                {items.data.map((item) => (
                    <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">{item.full_name}</h2>
                                <p className="text-sm text-zinc-500">
                                    {item.email} · {item.reference} · GHS {item.amount}
                                </p>
                                {item.submission && (
                                    <div className="mt-3 text-sm text-zinc-700">
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
                                    onClick={() => router.post(route('admin.payments.verify', item.id))}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                                >
                                    Verify
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(route('admin.payments.reject', item.id), {
                                            admin_note: 'Could not confirm payment',
                                        })
                                    }
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
