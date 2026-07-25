/* Config-driven admin: one definition per resource powers the list table and the form. */

export type FieldType =
  | "text" | "textarea" | "i18n" | "i18nArea" | "number" | "boolean"
  | "image" | "specs" | "features" | "tags" | "select" | "password" | "readonly";

export interface Field {
  type: FieldType;
  name: string; // base name; i18n expands to <name>En/<name>Ru
  label: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface Column {
  key: string;
  label: string;
  type?: "image" | "bool" | "text";
}

export interface ResourceConfig {
  key: string;
  label: string;
  api: string;
  idType: "int" | "string";
  canCreate: boolean;
  columns: Column[];
  fields: Field[];
}

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "spam", label: "Spam" },
];

const seo: Field[] = [
  { type: "i18n", name: "metaTitle", label: "SEO title (optional — falls back to title)" },
  { type: "i18nArea", name: "metaDesc", label: "SEO meta description (optional)" },
];

export const RESOURCES: Record<string, ResourceConfig> = {
  products: {
    key: "products", label: "Products", api: "/api/products", idType: "int", canCreate: true,
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "titleEn", label: "Title" },
      { key: "categoryEn", label: "Category" },
      { key: "order", label: "Order" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL, e.g. mechanical-seals)" },
      { type: "i18n", name: "title", label: "Title" },
      { type: "i18n", name: "category", label: "Category" },
      { type: "i18nArea", name: "desc", label: "Description" },
      { type: "i18n", name: "spec", label: "Short spec line (card)" },
      { type: "image", name: "image", label: "Image" },
      { type: "tags", name: "chips", label: "Attribute chips" },
      { type: "specs", name: "specs", label: "Spec table (key / value)" },
      { type: "features", name: "features", label: "Feature blocks" },
      ...seo,
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  projects: {
    key: "projects", label: "Projects", api: "/api/projects", idType: "int", canCreate: true,
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "titleEn", label: "Title" },
      { key: "tagEn", label: "Sector" },
      { key: "locEn", label: "Location" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL)" },
      { type: "i18n", name: "title", label: "Title" },
      { type: "i18n", name: "tag", label: "Sector tag" },
      { type: "i18n", name: "loc", label: "Location" },
      { type: "i18nArea", name: "desc", label: "Description" },
      { type: "image", name: "image", label: "Image" },
      { type: "text", name: "stat1", label: "Stat 1 value (e.g. 3)" },
      { type: "i18n", name: "stat1Label", label: "Stat 1 label" },
      { type: "text", name: "stat2", label: "Stat 2 value (e.g. 21 days)" },
      { type: "i18n", name: "stat2Label", label: "Stat 2 label" },
      ...seo,
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  articles: {
    key: "articles", label: "News", api: "/api/articles", idType: "int", canCreate: true,
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "titleEn", label: "Title" },
      { key: "tagEn", label: "Tag" },
      { key: "dateEn", label: "Date" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL)" },
      { type: "i18n", name: "title", label: "Title" },
      { type: "i18n", name: "tag", label: "Tag" },
      { type: "i18n", name: "date", label: "Display date (e.g. Jul 2026)" },
      { type: "i18nArea", name: "excerpt", label: "Excerpt" },
      { type: "i18nArea", name: "body", label: "Body" },
      { type: "image", name: "image", label: "Image" },
      ...seo,
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  "career-roles": {
    key: "career-roles", label: "Careers", api: "/api/career-roles", idType: "int", canCreate: true,
    columns: [
      { key: "titleEn", label: "Role" },
      { key: "deptEn", label: "Department" },
      { key: "locationEn", label: "Location" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL)" },
      { type: "i18n", name: "title", label: "Role title" },
      { type: "i18n", name: "dept", label: "Department" },
      { type: "i18n", name: "location", label: "Location" },
      { type: "i18n", name: "type", label: "Type (Full-time…)" },
      { type: "i18nArea", name: "desc", label: "Description" },
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  industries: {
    key: "industries", label: "Industries", api: "/api/industries", idType: "int", canCreate: true,
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "titleEn", label: "Industry" },
      { key: "order", label: "Order" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL)" },
      { type: "i18n", name: "title", label: "Title" },
      { type: "i18nArea", name: "desc", label: "Description" },
      { type: "tags", name: "tags", label: "Tags" },
      { type: "image", name: "image", label: "Image" },
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  services: {
    key: "services", label: "Services", api: "/api/services", idType: "int", canCreate: true,
    columns: [
      { key: "numberTag", label: "#" },
      { key: "titleEn", label: "Service" },
      { key: "order", label: "Order" },
      { key: "published", label: "Live", type: "bool" },
    ],
    fields: [
      { type: "text", name: "slug", label: "Slug (URL)" },
      { type: "text", name: "numberTag", label: "Number tag (01, 02…)" },
      { type: "i18n", name: "title", label: "Title" },
      { type: "i18nArea", name: "desc", label: "Description" },
      { type: "tags", name: "items", label: "Bullet items" },
      { type: "image", name: "image", label: "Image" },
      { type: "number", name: "order", label: "Order" },
      { type: "boolean", name: "published", label: "Published" },
    ],
  },
  "contact-submissions": {
    key: "contact-submissions", label: "Contact inbox", api: "/api/contact-submissions", idType: "int", canCreate: false,
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "company", label: "Company" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Date" },
    ],
    fields: [
      { type: "readonly", name: "name", label: "Name" },
      { type: "readonly", name: "email", label: "Email" },
      { type: "readonly", name: "company", label: "Company" },
      { type: "readonly", name: "phone", label: "Phone" },
      { type: "textarea", name: "message", label: "Message" },
      { type: "select", name: "status", label: "Status", options: STATUS_OPTIONS },
    ],
  },
  users: {
    key: "users", label: "Users", api: "/api/users", idType: "string", canCreate: true,
    columns: [
      { key: "email", label: "Email" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "active", label: "Active", type: "bool" },
    ],
    fields: [
      { type: "text", name: "email", label: "Email" },
      { type: "password", name: "password", label: "Password" },
      { type: "text", name: "name", label: "Name" },
      { type: "select", name: "role", label: "Role", options: [
        { value: "admin", label: "Administrator" },
        { value: "editor", label: "Editor" },
      ] },
      { type: "boolean", name: "active", label: "Active" },
    ],
  },
};

export const RESOURCE_ORDER = [
  "products", "projects", "articles", "career-roles",
  "industries", "services", "contact-submissions", "users",
];
