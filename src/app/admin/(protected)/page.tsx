import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { DEFAULT_ANALYTICS_RANGE } from "@/lib/admin/analytics";
import { getRegistrationAnalytics } from "@/lib/admin/analytics.server";
import { getDashboardAnalytics } from "@/lib/admin/registrations";

export default async function AdminDashboardPage() {
  const [data, analytics] = await Promise.all([
    getDashboardAnalytics(),
    getRegistrationAnalytics(DEFAULT_ANALYTICS_RANGE),
  ]);

  return <AdminDashboardView data={data} analytics={analytics} />;
}
