import { AdminWhatsAppContactsView } from "@/components/admin/AdminWhatsAppContactsView";
import { listPaidWhatsAppContacts } from "@/lib/admin/export";

export default async function AdminWhatsAppContactsPage() {
  const contacts = await listPaidWhatsAppContacts();
  return <AdminWhatsAppContactsView contacts={contacts} />;
}
