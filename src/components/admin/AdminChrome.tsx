"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RESOURCES, RESOURCE_ORDER } from "@/lib/admin/resources";

interface Props {
  user: { email: string; name?: string | null; role: string };
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  ...RESOURCE_ORDER.map((k) => ({ href: `/admin/${k}`, label: RESOURCES[k].label, exact: false })),
  { href: "/admin/settings", label: "Site settings", exact: true },
];

export function AdminChrome({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-neutral-200 bg-[#0B0C0E] text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center border-[1.5px] border-[#1CAFE8]">
            <div className="h-3 w-3 bg-[#1CAFE8]" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-extrabold tracking-[0.14em]">FERUMS</div>
            <div className="text-[8px] font-semibold tracking-[0.3em] text-white/55">ADMIN</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 text-sm transition ${
                isActive(item.href, item.exact)
                  ? "bg-[#1CAFE8] font-semibold text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-5">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <span className="block text-2xl leading-none">☰</span>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link href="/en" target="_blank" className="text-sm text-neutral-500 hover:text-neutral-900">View site ↗</Link>
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold">{user.name || user.email}</div>
              <div className="text-xs text-neutral-500">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-[#1CAFE8] hover:text-[#1690C0]"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
