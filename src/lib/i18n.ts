// Lightweight i18n for the FERUMS public site. Locale lives in the URL path
// (/en, /ru) for SEO; each page renders server-side in its locale.

export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

// Pick the value for a locale from a { en, ru } object.
export function pick(obj: { en?: string; ru?: string } | null | undefined, locale: Locale): string {
  if (!obj) return "";
  return (locale === "ru" ? obj.ru : obj.en) || obj.en || obj.ru || "";
}

// Pick from a Prisma record with <base>En / <base>Ru fields.
export function field<T extends Record<string, unknown>>(row: T, base: string, locale: Locale): string {
  const key = base + (locale === "ru" ? "Ru" : "En");
  const en = row[base + "En"];
  const val = row[key];
  return (val as string) || (en as string) || "";
}

// The <html lang> value + hreflang code (en/ru map directly).
export const HTML_LANG: Record<Locale, string> = { en: "en", ru: "ru" };

// Static UI strings not managed in the DB.
export const UI = {
  en: {
    menu: "Menu",
    contact: "Contact",
    company: "Company",
    readMore: "Read more",
    viewAll: "View all",
    allProducts: "All products",
    allProjects: "All projects",
    allNews: "All news",
    backTo: "Back to",
    getInTouch: "Get in touch",
    specifications: "Specifications",
    relatedProducts: "Related products",
    keyFeatures: "Key features",
    openRoles: "Open roles",
    applyNow: "Apply now",
    apply: "Apply",
    location: "Location",
    department: "Department",
    type: "Type",
    sector: "Sector",
    form: {
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      message: "Message",
      send: "Send message",
      sending: "Sending…",
      success: "Thank you — we'll be in touch shortly.",
      error: "Something went wrong. Please try again.",
    },
    notFound: "Page not found",
    goHome: "Go to homepage",
    theme: "Theme",
    language: "Language",
  },
  ru: {
    menu: "Меню",
    contact: "Контакты",
    company: "Компания",
    readMore: "Подробнее",
    viewAll: "Смотреть все",
    allProducts: "Вся продукция",
    allProjects: "Все проекты",
    allNews: "Все новости",
    backTo: "Назад к",
    getInTouch: "Связаться с нами",
    specifications: "Характеристики",
    relatedProducts: "Похожая продукция",
    keyFeatures: "Ключевые особенности",
    openRoles: "Открытые вакансии",
    applyNow: "Откликнуться",
    apply: "Откликнуться",
    location: "Локация",
    department: "Отдел",
    type: "Тип",
    sector: "Отрасль",
    form: {
      name: "Имя",
      email: "Email",
      company: "Компания",
      phone: "Телефон",
      message: "Сообщение",
      send: "Отправить",
      sending: "Отправка…",
      success: "Спасибо — мы скоро свяжемся с вами.",
      error: "Что-то пошло не так. Попробуйте ещё раз.",
    },
    notFound: "Страница не найдена",
    goHome: "На главную",
    theme: "Тема",
    language: "Язык",
  },
} as const;

export function ui(locale: Locale) {
  return UI[locale];
}
