import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { ok, fail, auth, handler } from "@/lib/api";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function slugify(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot) : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base}-${rand}${ext.toLowerCase()}`;
}

export const POST = handler(async (req) => {
  await auth();
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return fail("No file provided", 400);
  if (!ALLOWED.includes(file.type)) return fail(`Unsupported type: ${file.type}`, 415);
  if (file.size > MAX_SIZE) return fail("File too large (max 10MB)", 413);

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = slugify(file.name || "file");
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const url = `/uploads/${filename}`;
  const asset = await prisma.mediaAsset.create({
    data: { url, filename, mime: file.type, size: file.size },
  });
  return ok({ url, id: asset.id }, 201);
});
