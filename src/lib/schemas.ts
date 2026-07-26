import { z } from "zod";

const order = z.number().int().optional();
const published = z.boolean().optional();
const str = z.string().min(1);
const opt = z.string().optional().nullable();
const optStr = z.string().optional();
const slug = z.string().min(1).regex(/^[a-z0-9-]+$/, "lowercase, digits and hyphens only");

// Bilingual bullet/chip: { en, ru }
const bi = z.object({ en: z.string(), ru: z.string() });
// Spec table row: { kEn, kRu, vEn, vRu }
const specRow = z.object({ kEn: z.string(), kRu: z.string(), vEn: z.string(), vRu: z.string() });
// Product feature block
const feature = z.object({ titleEn: z.string(), titleRu: z.string(), descEn: z.string(), descRu: z.string() });

export const productSchema = z.object({
  slug,
  titleEn: str, titleRu: str,
  categoryEn: optStr, categoryRu: optStr,
  descEn: str, descRu: str,
  specEn: optStr, specRu: optStr,
  image: optStr,
  chips: z.array(bi).default([]),
  specs: z.array(specRow).default([]),
  features: z.array(feature).default([]),
  metaTitleEn: optStr, metaTitleRu: optStr,
  metaDescEn: optStr, metaDescRu: optStr,
  order, published,
});

export const projectSchema = z.object({
  slug,
  titleEn: str, titleRu: str,
  tagEn: optStr, tagRu: optStr,
  locEn: optStr, locRu: optStr,
  descEn: str, descRu: str,
  image: optStr,
  stat1: optStr, stat1LabelEn: optStr, stat1LabelRu: optStr,
  stat2: optStr, stat2LabelEn: optStr, stat2LabelRu: optStr,
  metaTitleEn: optStr, metaTitleRu: optStr,
  metaDescEn: optStr, metaDescRu: optStr,
  order, published,
});

export const articleSchema = z.object({
  slug,
  titleEn: str, titleRu: str,
  tagEn: optStr, tagRu: optStr,
  dateEn: optStr, dateRu: optStr,
  excerptEn: optStr, excerptRu: optStr,
  bodyEn: optStr, bodyRu: optStr,
  image: optStr,
  metaTitleEn: optStr, metaTitleRu: optStr,
  metaDescEn: optStr, metaDescRu: optStr,
  order, published,
});

export const careerRoleSchema = z.object({
  slug,
  titleEn: str, titleRu: str,
  deptEn: optStr, deptRu: optStr,
  locationEn: optStr, locationRu: optStr,
  typeEn: optStr, typeRu: optStr,
  descEn: optStr, descRu: optStr,
  order, published,
});

export const industrySchema = z.object({
  slug,
  titleEn: str, titleRu: str,
  descEn: str, descRu: str,
  tags: z.array(bi).default([]),
  image: optStr,
  order, published,
});

export const serviceSchema = z.object({
  slug,
  numberTag: optStr,
  titleEn: str, titleRu: str,
  descEn: str, descRu: str,
  items: z.array(bi).default([]),
  image: optStr,
  order, published,
});

export const partnerSchema = z.object({
  name: str,
  countryEn: optStr, countryRu: optStr,
  logo: optStr,
  url: optStr,
  order, published,
});

// Public contact form (publicCreate) + admin status update
export const contactSubmissionSchema = z.object({
  name: str,
  email: z.string().email(),
  company: opt,
  phone: opt,
  message: opt,
  status: z.enum(["new", "in_progress", "done", "spam"]).optional(),
});

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: opt,
  role: z.enum(["admin", "editor"]).optional(),
  active: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const settingSchema = z.object({
  key: str,
  valueJson: z.any(),
});
