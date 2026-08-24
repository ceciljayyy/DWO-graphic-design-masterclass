import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/auth/admin";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdminPage();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      {children}
    </AdminShell>
  );
}
