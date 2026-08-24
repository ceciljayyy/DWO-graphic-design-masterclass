import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getDashboardAnalytics } from "@/lib/admin/registrations";

export default async function AdminDashboardPage() {
  const data = await getDashboardAnalytics();
  return <AdminDashboardView data={data} />;
}
