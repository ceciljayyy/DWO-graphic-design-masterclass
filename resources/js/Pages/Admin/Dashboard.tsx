import RegistrationAnalytics from '@/Components/Admin/RegistrationAnalytics';
import type { RegistrationAnalyticsData } from '@/Components/Admin/analyticsTypes';
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
    analytics: RegistrationAnalyticsData;
};

export default function Dashboard({ counts, recent, analytics }: Props) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin dashboard" />
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
                {Object.entries(counts).map(([key, value]) => (
                    <div key={key} className="dwo-glass p-4 md:p-5">
                        <p className="dwo-label">{key}</p>
                        <p className="mt-2 text-2xl font-semibold text-[color:var(--dwo-text)] md:text-3xl">{value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 md:mt-8">
                <RegistrationAnalytics initial={analytics} />
            </div>

            <div className="dwo-glass mt-6 md:mt-8">
                <div className="border-b border-[color:var(--dwo-border)] px-4 py-3 font-medium text-[color:var(--dwo-text)] md:px-5">
                    Recent registrations
                </div>
                <ul className="divide-y divide-[color:var(--dwo-border)]">
                    {recent.map((row) => (
                        <li
                            key={row.id}
                            className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between md:px-5"
                        >
                            <div className="min-w-0">
                                <Link
                                    href={route('admin.registrations.show', row.id)}
                                    className="font-medium text-[color:var(--dwo-text)] hover:underline"
                                >
                                    {row.full_name}
                                </Link>
                                <p className="truncate text-zinc-500">
                                    {row.email} · {row.registration_reference}
                                </p>
                            </div>
                            <span className="w-fit rounded-full bg-[color:var(--dwo-bg-soft)] px-3 py-1 text-xs text-zinc-200">
                                {row.payment_status}
                            </span>
                        </li>
                    ))}
                    {recent.length === 0 && (
                        <li className="px-4 py-6 text-sm text-zinc-500 md:px-5">No registrations yet.</li>
                    )}
                </ul>
            </div>
        </AdminLayout>
    );
}
