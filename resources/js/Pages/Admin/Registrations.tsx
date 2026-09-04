import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

type Props = {
    items: {
        data: {
            id: string;
            full_name: string;
            email: string;
            payment_status: string;
            reference: string;
            location: string;
        }[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { status: string };
};

export default function Registrations({ items, filters }: Props) {
    return (
        <AdminLayout title="Registrations">
            <Head title="Registrations" />
            <div className="mb-4 flex flex-wrap gap-2">
                {['', 'PENDING', 'PAYMENT_SUBMITTED', 'PAID', 'PAYMENT_REJECTED'].map((status) => (
                    <button
                        key={status || 'all'}
                        type="button"
                        onClick={() =>
                            router.get(route('admin.registrations.index'), status ? { status } : {}, {
                                preserveState: true,
                            })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            filters.status === status ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 border'
                        }`}
                    >
                        {status || 'ALL'}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Ref</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.data.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-3">
                                    <Link
                                        href={route('admin.registrations.show', row.id)}
                                        className="font-medium hover:underline"
                                    >
                                        {row.full_name}
                                    </Link>
                                    <div className="text-zinc-500">{row.email}</div>
                                </td>
                                <td className="px-4 py-3">{row.payment_status}</td>
                                <td className="px-4 py-3">{row.location}</td>
                                <td className="px-4 py-3">{row.reference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
