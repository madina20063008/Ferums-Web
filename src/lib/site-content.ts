// Shared types for FERUMS seed content. `seed-data.ts` implements these and both
// the seeder (src/lib/seed-core.ts) and the public pages consume them.

export type Bi = { en: string; ru: string };
export type NavLink = { en: string; ru: string; href: string };

// ---- List collections (map 1:1 to Prisma models) ----
export interface ProductSeed {
  slug: string;
  titleEn: string; titleRu: string;
  categoryEn: string; categoryRu: string;
  descEn: string; descRu: string;
  specEn: string; specRu: string;
  image: string;
  chips: Bi[];
  specs: { kEn: string; kRu: string; vEn: string; vRu: string }[];
  features: { titleEn: string; titleRu: string; descEn: string; descRu: string }[];
}

export interface ProjectSeed {
  slug: string;
  titleEn: string; titleRu: string;
  tagEn: string; tagRu: string;
  locEn: string; locRu: string;
  descEn: string; descRu: string;
  image: string;
  stat1: string; stat1LabelEn: string; stat1LabelRu: string;
  stat2: string; stat2LabelEn: string; stat2LabelRu: string;
}

export interface ArticleSeed {
  slug: string;
  titleEn: string; titleRu: string;
  tagEn: string; tagRu: string;
  dateEn: string; dateRu: string;
  excerptEn: string; excerptRu: string;
  bodyEn: string; bodyRu: string;
  image: string;
}

export interface CareerRoleSeed {
  slug: string;
  titleEn: string; titleRu: string;
  deptEn: string; deptRu: string;
  locationEn: string; locationRu: string;
  typeEn: string; typeRu: string;
  descEn: string; descRu: string;
}

export interface IndustrySeed {
  slug: string;
  titleEn: string; titleRu: string;
  descEn: string; descRu: string;
  tags: Bi[];
  image: string;
}

export interface ServiceSeed {
  slug: string;
  numberTag: string;
  titleEn: string; titleRu: string;
  descEn: string; descRu: string;
  items: Bi[];
  image: string;
}

export interface PartnerSeed {
  name: string;
  countryEn: string; countryRu: string;
  logo: string;
  url: string;
}

// ---- Static page copy (stored in the `site` Setting as JSON) ----
export interface SiteContent {
  seo: {
    siteName: string;
    defaultTitle: Bi;
    defaultDescription: Bi;
    keywords: Bi;
    organization: { name: string; legalName: string; url: string; logo: string; sameAs: string[] };
  };
  nav: {
    main: NavLink[];        // Industries, Services, Products, Projects, FerumsDigital
    company: NavLink[];     // About, Sustainability, News, Careers
    companyLabel: Bi;
    contactCta: Bi;
  };
  footer: {
    blurb: Bi;
    productLinks: NavLink[];
    industryLinks: NavLink[];
    companyLinks: NavLink[];
    copyright: Bi;
  };
  home: {
    heroTitle: Bi;          // may contain \n for line breaks
    heroSubtitle: Bi;
    heroPrimaryCta: Bi;
    heroSecondaryCta: Bi;
    whoEyebrow: Bi;
    whoTitle: Bi;
    whoBody: Bi;
    stats: { value: string; label: Bi }[];
    lifecycleTitle: Bi;
    lifecycle: { step: string; label: Bi }[];
    whyTitle: Bi;
    why: Bi[];
    certificationsTitle: Bi;
    certifications: string[];
    globalTitle: Bi;
    offices: { city: Bi; note: Bi }[];
    partnersTitle: Bi;
    partners: string[];
    ctaTitle: Bi;
    ctaBody: Bi;
    ctaButton: Bi;
  };
  sectionIntros: {
    industries: { title: Bi; subtitle: Bi };
    services: { title: Bi; subtitle: Bi };
    products: { title: Bi; subtitle: Bi };
    projects: { title: Bi; subtitle: Bi };
    news: { title: Bi; subtitle: Bi };
    careers: { title: Bi; subtitle: Bi };
  };
  about: {
    title: Bi; lead: Bi; body: Bi;
    values: { title: Bi; desc: Bi }[];
    team: { name: string; role: Bi; image: string }[];
    timeline: { year: string; label: Bi }[];
  };
  sustainability: {
    title: Bi; lead: Bi;
    pillars: { title: Bi; desc: Bi }[];
    commitments: Bi[];
  };
  careers: {
    intro: Bi;
    benefits: { title: Bi; desc: Bi }[];
  };
  ferumsDigital: {
    title: Bi; lead: Bi;
    aiApps: Bi[];
    platforms: Bi[];
    equipmentAi: Bi[];
    engineeringAreas: Bi[];
    customDev: string[];
  };
  contact: {
    title: Bi; lead: Bi;
    offices: { city: Bi; address: Bi; phone: string; email: string }[];
  };
}
