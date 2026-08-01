import { type ZodType } from "zod";
import { revalidatePath } from "next/cache";
import { ok, fail, auth, handler, parse } from "./api";

// Invalidate the whole public site cache after an admin write, so content
// changes (add/edit/delete of any resource) show on every page on next visit.
// The public pages all live under (site)/[locale]/layout.tsx → the route
// pattern is "/[locale]"; type "layout" cascades to every nested page + locale.
export function revalidateSite() {
  try {
    revalidatePath("/[locale]", "layout");
  } catch {
    // never let a revalidation hiccup fail the mutation itself
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Delegate {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count?: (args?: any) => Promise<number>;
}

interface Options {
  /** require auth for write ops (POST/PUT/DELETE). default true */
  protectWrites?: boolean;
  /** allow public POST (e.g. contact form). default false */
  publicCreate?: boolean;
  /** id field type. default "int" */
  idType?: "int" | "string";
  /** default ordering */
  orderBy?: any;
}

function castId(raw: string, idType: "int" | "string") {
  return idType === "int" ? Number(raw) : raw;
}

/** Handlers for /api/<resource> (list + create). */
export function collection(delegate: Delegate, schema: ZodType, opts: Options = {}) {
  const { protectWrites = true, publicCreate = false, orderBy = [{ order: "asc" }, { id: "asc" }] } = opts;

  const GET = handler(async (req) => {
    const url = new URL(req.url);
    const where: any = {};
    if (url.searchParams.get("published") === "true") where.published = true;
    const items = await delegate.findMany({ where, orderBy });
    return ok(items);
  });

  const POST = handler(async (req) => {
    if (protectWrites && !publicCreate) await auth();
    const data = await parse(req, schema);
    const created = await delegate.create({ data: data as any });
    revalidateSite();
    return ok(created, 201);
  });

  return { GET, POST };
}

/** Handlers for /api/<resource>/[id] (read + update + delete). */
export function item(delegate: Delegate, schema: ZodType, opts: Options = {}) {
  const { protectWrites = true, idType = "int" } = opts;

  const GET = handler(async (_req, ctx) => {
    const { id } = await ctx.params;
    const found = await delegate.findUnique({ where: { id: castId(id, idType) } });
    if (!found) return fail("Not found", 404);
    return ok(found);
  });

  const PUT = handler(async (req, ctx) => {
    if (protectWrites) await auth();
    const { id } = await ctx.params;
    const anySchema = schema as any;
    const partial = typeof anySchema.partial === "function" ? anySchema.partial() : schema;
    const body = await req.json().catch(() => ({}));
    const parsed = partial.parse(body) as Record<string, unknown>;
    // Only write keys that were actually present in the request. This prevents a
    // zod `.default()` (e.g. arrays defaulting to []) from clobbering existing
    // values on a partial update that omits those fields.
    const data: Record<string, unknown> = {};
    for (const k of Object.keys(body as object)) if (k in parsed) data[k] = parsed[k];
    const updated = await delegate.update({ where: { id: castId(id, idType) }, data: data as any });
    revalidateSite();
    return ok(updated);
  });

  const DELETE = handler(async (_req, ctx) => {
    if (protectWrites) await auth();
    const { id } = await ctx.params;
    await delegate.delete({ where: { id: castId(id, idType) } });
    revalidateSite();
    return ok({ success: true });
  });

  return { GET, PUT, DELETE };
}
