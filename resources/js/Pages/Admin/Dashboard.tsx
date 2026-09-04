import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

type Props = {
    counts: Record<string, number>;
    recent: {
        id: string;
        full_name: string;
        email: string;
        payment_status: string;
        registration_reference: string;
    }[];
};

export default function Dashboard({ counts, recent }: Props) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin dashboard" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {Object.entries(counts).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-zinc-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-zinc-500">{key}</p>
                        <p className="mt-2 text-2xl font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-xl border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-4 py-3 font-medium">Recent registrations</div>
                <ul className="divide-y divide-zinc-100">
                    {recent.map((row) => (
                        <li key={row.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <div>
                                <Link
                                    href={route('admin.registrations.show', row.id)}
                                    className="font-medium hover:underline"
                                >
                                    {row.full_name}
                                </Link>
                                <p className="text-zinc-500">
                                    {row.email} · {row.registration_reference}
                                </p>
                            </div>
                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">{row.payment_status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminLayout>
    );
}
