import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const [products, projects, articles, roles, industries, services, submissions, newSubmissions, users] =
    await Promise.all([
      prisma.product.count(),
      prisma.project.count(),
      prisma.article.count(),
      prisma.careerRole.count(),
      prisma.industry.count(),
      prisma.service.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: "new" } }),
      prisma.user.count(),
    ]);
  return { products, projects, articles, roles, industries, services, submissions, newSubmissions, users };
}

const cards = [
  { key: "products", label: "Products", href: "/admin/products" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "articles", label: "News", href: "/admin/articles" },
  { key: "industries", label: "Industries", href: "/admin/industries" },
  { key: "services", label: "Services", href: "/admin/services" },
  { key: "roles", label: "Careers", href: "/admin/career-roles" },
] as const;

export default async function Dashboard() {
  const stats = await getStats();
  const recent = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Site content and contact inbox</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Link href="/admin/contact-submissions" className="border border-neutral-200 bg-white p-5 transition hover:border-[#1CAFE8]">
          <div className="text-3xl font-extrabold text-[#1690C0]">{stats.submissions}</div>
          <div className="mt-1 text-sm text-neutral-600">Contact inbox
            {stats.newSubmissions > 0 && <span className="ml-2 inline-block bg-[#1CAFE8] px-1.5 py-0.5 text-xs font-bold text-white">{stats.newSubmissions} new</span>}
          </div>
        </Link>
        {cards.map((c) => (
          <Link key={c.key} href={c.href} className="border border-neutral-200 bg-white p-5 transition hover:border-[#1CAFE8]">
            <div className="text-3xl font-extrabold text-neutral-900">{stats[c.key as keyof typeof stats]}</div>
            <div className="mt-1 text-sm text-neutral-600">{c.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">Recent messages</h2>
      <div className="mt-3 overflow-x-auto border border-neutral-200 bg-white">
        <table className="text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-400">No messages yet</td></tr>
            )}
            {recent.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-neutral-600">{r.email}</td>
                <td className="px-4 py-3 text-neutral-600">{r.company || "—"}</td>
                <td className="px-4 py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
