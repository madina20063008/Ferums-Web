"use client";

import { useEffect, useState } from "react";
import { SocialIcon, SOCIAL_PLATFORMS } from "@/components/site/SocialIcons";
import type { SocialLink } from "@/lib/site-content";

// Accept both the new array shape and the legacy { instagram, linkedin } object.
function normalize(data: unknown): SocialLink[] {
  if (Array.isArray(data)) {
    return data
      .filter((x): x is { platform?: unknown; url?: unknown } => !!x && typeof x === "object")
      .map((x) => ({ platform: String(x.platform || "website"), url: String(x.url || "") }));
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, string>;
    const out: SocialLink[] = [];
    if (o.instagram) out.push({ platform: "instagram", url: o.instagram });
    if (o.linkedin) out.push({ platform: "linkedin", url: o.linkedin });
    return out;
  }
  return [];
}

export function SocialEditor() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings?key=social", { cache: "no-store" });
      const data = res.ok ? await res.json() : null;
      setItems(normalize(data));
      setLoading(false);
    })();
  }, []);

  const update = (i: number, patch: Partial<SocialLink>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setItems((arr) => [...arr, { platform: "instagram", url: "" }]);

  async function save() {
    setMsg(""); setError(""); setSaving(true);
    const clean = items
      .map((it) => ({ platform: it.platform, url: it.url.trim() }))
      .filter((it) => it.url);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "social", valueJson: clean }),
    });
    setSaving(false);
    if (res.ok) { setMsg("Saved ✓"); setItems(clean); }
    else setError("Failed to save");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Social media</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Links shown as icons in the site footer. Add any platform, reorder by removing/re-adding,
        and delete the ones you don’t need. Empty links are ignored.
      </p>

      {loading ? (
        <div className="mt-6 text-neutral-400">Loading…</div>
      ) : (
        <div className="mt-6">
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="rounded border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-400">
                No links yet. Click “+ Add link”.
              </div>
            )}
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-10 w-10 flex-none items-center justify-center border border-neutral-300 text-neutral-600">
                  <SocialIcon platform={it.platform} size={18} />
                </span>
                <select
                  value={it.platform}
                  onChange={(e) => update(i, { platform: e.target.value })}
                  className="h-10 flex-none border border-neutral-300 bg-white px-2 text-sm outline-none focus:border-[#1CAFE8]"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={it.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                  placeholder="https://…"
                  spellCheck={false}
                  className="h-10 min-w-0 flex-1 border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#1CAFE8]"
                />
                <button
                  onClick={() => remove(i)}
                  aria-label="Remove"
                  className="h-10 w-10 flex-none border border-neutral-300 text-neutral-500 transition hover:border-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={add}
            className="mt-4 border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-[#1CAFE8] hover:text-[#1690C0]"
          >
            + Add link
          </button>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="bg-[#1CAFE8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1690C0] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {msg && <span className="text-sm text-green-600">{msg}</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
