import { AdminPaymentsReviewView } from "@/components/admin/AdminPaymentsReviewView";
import { listPaymentApprovals } from "@/lib/admin/registrations";

export default async function AdminPaymentsPage() {
  const data = await listPaymentApprovals();
  return <AdminPaymentsReviewView data={data} />;
}
