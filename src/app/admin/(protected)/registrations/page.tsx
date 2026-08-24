import { AdminRegistrationsView } from "@/components/admin/AdminRegistrationsView";
import {
  listRegistrations,
  parseRegistrationListQuery,
} from "@/lib/admin/registrations";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminRegistrationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = parseRegistrationListQuery(params);
  const data = await listRegistrations(query);

  return <AdminRegistrationsView query={query} data={data} />;
}
