"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RESOURCES, type Column } from "@/lib/admin/resources";

function Cell({ col, row }: { col: Column; row: Record<string, unknown> }) {
  const v = row[col.key];
  if (col.type === "image") {
    return v ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={String(v)} alt="" className="h-10 w-14 object-cover" />
    ) : (
      <span className="text-neutral-300">—</span>
    );
  }
  if (col.type === "bool") {
    return v ? (
      <span className="bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Yes</span>
    ) : (
      <span className="bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-500">No</span>
    );
  }
  if (col.key === "createdAt" && v) return <span className="text-neutral-600">{new Date(String(v)).toLocaleDateString("ru-RU")}</span>;
  if (col.key === "status") {
    const map: Record<string, string> = { new: "bg-blue-100 text-blue-700", in_progress: "bg-amber-100 text-amber-700", done: "bg-green-100 text-green-700", spam: "bg-neutral-200 text-neutral-600" };
    return <span className={`px-2 py-0.5 text-xs font-semibold ${map[String(v)] || "bg-neutral-100"}`}>{String(v)}</span>;
  }
  return <span>{v == null || v === "" ? <span className="text-neutral-300">—</span> : String(v)}</span>;
}

export function ResourceList({ resourceKey }: { resourceKey: string }) {
  const cfg = RESOURCES[resourceKey];
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(cfg.api, { cache: "no-store" });
    setRows(res.ok ? await res.json() : []);
    setLoading(false);
  }, [cfg.api]);

  // Fetch the list on mount / when the resource changes. Data-fetching effects
  // legitimately call setState; the heuristic rule doesn't model that.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  async function remove(id: string | number) {
    if (!confirm("Delete this record?")) return;
    await fetch(`${cfg.api}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{cfg.label}</h1>
          <p className="mt-1 text-sm text-neutral-500">{rows.length} records</p>
        </div>
        {cfg.canCreate && (
          <Link href={`/admin/${resourceKey}/new`} className="bg-[#1CAFE8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1690C0]">
            + Add new
          </Link>
        )}
      </div>

      <div className="mt-5 overflow-x-auto border border-neutral-200 bg-white">
        <table className="text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              {cfg.columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={cfg.columns.length + 1} className="px-4 py-8 text-center text-neutral-400">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={cfg.columns.length + 1} className="px-4 py-8 text-center text-neutral-400">No records</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                {cfg.columns.map((c) => <td key={c.key} className="px-4 py-3">{<Cell col={c} row={row} />}</td>)}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/${resourceKey}/${row.id}`} className="border border-neutral-300 px-2.5 py-1 text-xs font-medium transition hover:border-[#1CAFE8] hover:text-[#1690C0]">Edit</Link>
                    <button onClick={() => remove(row.id as string | number)} className="border border-neutral-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
