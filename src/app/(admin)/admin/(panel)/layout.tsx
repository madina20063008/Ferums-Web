import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminChrome } from "@/components/admin/AdminChrome";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminChrome user={{ email: session.email, name: session.name, role: session.role }}>
      {children}
    </AdminChrome>
  );
}
