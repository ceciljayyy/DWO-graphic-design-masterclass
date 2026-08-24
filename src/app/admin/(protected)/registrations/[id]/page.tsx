import { notFound } from "next/navigation";

import { AdminRegistrationDetailView } from "@/components/admin/AdminRegistrationDetailView";
import { getRegistrationById } from "@/lib/admin/registrations";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const registration = await getRegistrationById(id);

  if (!registration) {
    notFound();
  }

  return <AdminRegistrationDetailView registration={registration} />;
}
