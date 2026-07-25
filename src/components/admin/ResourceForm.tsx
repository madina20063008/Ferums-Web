"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RESOURCES, type Field } from "@/lib/admin/resources";

const LANGS = [["En", "EN"], ["Ru", "RU"]] as const;
const inputCls = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#1CAFE8]";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-neutral-500";

type State = Record<string, unknown>;

async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) return null;
  const data = await res.json();
  return data.url as string;
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="URL or upload" className={inputCls} />
        <label className="shrink-0 cursor-pointer border border-neutral-300 px-3 py-2 text-sm font-medium transition hover:border-[#1CAFE8]">
          {busy ? "…" : "Upload"}
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            const url = await uploadFile(f);
            setBusy(false);
            if (url) onChange(url);
          }} />
        </label>
      </div>
      {value && /\.(jpe?g|png|webp|gif|svg)$/i.test(value) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 w-auto border border-neutral-200 object-cover" />
      )}
    </div>
  );
}

type SpecRow = { kEn: string; kRu: string; vEn: string; vRu: string };
function SpecsEditor({ value, onChange }: { value: SpecRow[]; onChange: (v: unknown[]) => void }) {
  const rows = value || [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const add = () => onChange([...rows, { kEn: "", kRu: "", vEn: "", vRu: "" }]);
  const del = (i: number) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={i} className="border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">#{i + 1}</span>
            <button type="button" onClick={() => del(i)} className="text-xs text-red-600">Remove</button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LANGS.map(([s, lbl]) => (
              <div key={s} className="grid grid-cols-2 gap-2">
                <input value={r[`k${s}` as keyof SpecRow]} onChange={(e) => set(i, `k${s}`, e.target.value)} placeholder={`Key ${lbl}`} className={inputCls} />
                <input value={r[`v${s}` as keyof SpecRow]} onChange={(e) => set(i, `v${s}`, e.target.value)} placeholder={`Value ${lbl}`} className={inputCls} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start border border-dashed border-neutral-400 px-3 py-1.5 text-sm">+ Add row</button>
    </div>
  );
}

type FeatureRow = { titleEn: string; titleRu: string; descEn: string; descRu: string };
function FeaturesEditor({ value, onChange }: { value: FeatureRow[]; onChange: (v: unknown[]) => void }) {
  const rows = value || [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const add = () => onChange([...rows, { titleEn: "", titleRu: "", descEn: "", descRu: "" }]);
  const del = (i: number) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={i} className="border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">#{i + 1}</span>
            <button type="button" onClick={() => del(i)} className="text-xs text-red-600">Remove</button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input value={r.titleEn} onChange={(e) => set(i, "titleEn", e.target.value)} placeholder="Title EN" className={inputCls} />
            <input value={r.titleRu} onChange={(e) => set(i, "titleRu", e.target.value)} placeholder="Title RU" className={inputCls} />
            <textarea rows={2} value={r.descEn} onChange={(e) => set(i, "descEn", e.target.value)} placeholder="Description EN" className={inputCls} />
            <textarea rows={2} value={r.descRu} onChange={(e) => set(i, "descRu", e.target.value)} placeholder="Description RU" className={inputCls} />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start border border-dashed border-neutral-400 px-3 py-1.5 text-sm">+ Add feature</button>
    </div>
  );
}

type Tag = { en: string; ru: string };
function TagsEditor({ value, onChange }: { value: Tag[]; onChange: (v: unknown[]) => void }) {
  const rows = value || [];
  const set = (i: number, key: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const add = () => onChange([...rows, { en: "", ru: "" }]);
  const del = (i: number) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={r.en} onChange={(e) => set(i, "en", e.target.value)} placeholder="EN" className={inputCls} />
          <input value={r.ru} onChange={(e) => set(i, "ru", e.target.value)} placeholder="RU" className={inputCls} />
          <button type="button" onClick={() => del(i)} className="shrink-0 text-xs text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start border border-dashed border-neutral-400 px-3 py-1.5 text-sm">+ Tag</button>
    </div>
  );
}

export function ResourceForm({ resourceKey, id }: { resourceKey: string; id: string }) {
  const cfg = RESOURCES[resourceKey];
  const router = useRouter();
  const isNew = id === "new";
  const [state, setState] = useState<State>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = useCallback((name: string, value: unknown) => setState((s) => ({ ...s, [name]: value })), []);

  // Initialize the form: blank defaults for new records, fetched values for
  // existing ones. Initialization/data-fetching effects legitimately call
  // setState; the heuristic rule doesn't model that.
  useEffect(() => {
    if (isNew) {
      const init: State = {};
      cfg.fields.forEach((f) => {
        if (f.type === "i18n" || f.type === "i18nArea") LANGS.forEach(([s]) => (init[`${f.name}${s}`] = ""));
        else if (f.type === "boolean") init[f.name] = true;
        else if (f.type === "number") init[f.name] = 0;
        else if (f.type === "specs" || f.type === "tags" || f.type === "features") init[f.name] = [];
        else if (f.type === "select") init[f.name] = f.options?.[0]?.value ?? "";
        else init[f.name] = "";
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(init);
      return;
    }
    (async () => {
      const res = await fetch(`${cfg.api}/${id}`, { cache: "no-store" });
      if (res.ok) setState(await res.json());
      setLoading(false);
    })();
  }, [cfg, id, isNew]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // build payload from configured fields only
      const payload: State = {};
      cfg.fields.forEach((f) => {
        if (f.type === "readonly") return;
        if (f.type === "i18n" || f.type === "i18nArea") {
          LANGS.forEach(([s]) => (payload[`${f.name}${s}`] = state[`${f.name}${s}`] ?? ""));
        } else if (f.type === "number") {
          payload[f.name] = Number(state[f.name] ?? 0);
        } else if (f.type === "password") {
          if (state[f.name]) payload[f.name] = state[f.name]; // only send if set
        } else if (f.type === "specs" || f.type === "tags" || f.type === "features") {
          payload[f.name] = state[f.name] ?? [];
        } else {
          payload[f.name] = state[f.name] ?? (f.type === "boolean" ? false : "");
        }
      });

      const res = await fetch(isNew ? cfg.api : `${cfg.api}/${id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to save");
        return;
      }
      router.push(`/admin/${resourceKey}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-neutral-400">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.push(`/admin/${resourceKey}`)} className="text-sm text-neutral-500 hover:text-neutral-900">← {cfg.label}</button>
      </div>
      <h1 className="text-2xl font-bold">{isNew ? "New record" : "Edit"}</h1>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
        {cfg.fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <span className={labelCls}>{f.label}</span>
            {renderField(f, state, setField)}
          </div>
        ))}

        {error && <div className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-[#1CAFE8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1690C0] disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={() => router.push(`/admin/${resourceKey}`)} className="border border-neutral-300 px-6 py-2.5 text-sm font-medium">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function renderField(f: Field, state: State, setField: (n: string, v: unknown) => void) {
  const val = (k: string) => (state[k] ?? "") as string;
  switch (f.type) {
    case "i18n":
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LANGS.map(([s, lbl]) => (
            <label key={s} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-400">{lbl}</span>
              <input value={val(`${f.name}${s}`)} onChange={(e) => setField(`${f.name}${s}`, e.target.value)} className={inputCls} />
            </label>
          ))}
        </div>
      );
    case "i18nArea":
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LANGS.map(([s, lbl]) => (
            <label key={s} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-400">{lbl}</span>
              <textarea rows={4} value={val(`${f.name}${s}`)} onChange={(e) => setField(`${f.name}${s}`, e.target.value)} className={inputCls} />
            </label>
          ))}
        </div>
      );
    case "textarea":
      return <textarea rows={4} value={val(f.name)} onChange={(e) => setField(f.name, e.target.value)} className={inputCls} />;
    case "number":
      return <input type="number" value={val(f.name)} onChange={(e) => setField(f.name, e.target.value)} className={`${inputCls} max-w-[140px]`} />;
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={!!state[f.name]} onChange={(e) => setField(f.name, e.target.checked)} className="h-4 w-4" />
          <span className="text-sm text-neutral-600">{state[f.name] ? "Yes" : "No"}</span>
        </label>
      );
    case "select":
      return (
        <select value={val(f.name)} onChange={(e) => setField(f.name, e.target.value)} className={`${inputCls} max-w-sm`}>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "password":
      return <input type="password" value={val(f.name)} onChange={(e) => setField(f.name, e.target.value)} placeholder="Leave blank to keep unchanged" className={`${inputCls} max-w-sm`} />;
    case "image":
      return <ImageField value={val(f.name)} onChange={(v) => setField(f.name, v)} />;
    case "specs":
      return <SpecsEditor value={(state[f.name] as never) || []} onChange={(v) => setField(f.name, v)} />;
    case "features":
      return <FeaturesEditor value={(state[f.name] as never) || []} onChange={(v) => setField(f.name, v)} />;
    case "tags":
      return <TagsEditor value={(state[f.name] as never) || []} onChange={(v) => setField(f.name, v)} />;
    case "readonly":
      return <div className="border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{val(f.name) || "—"}</div>;
    default:
      return <input value={val(f.name)} onChange={(e) => setField(f.name, e.target.value)} className={inputCls} />;
  }
}
