// Shared social-media icon set — used by the public footer (server) and the
// admin Social-media editor (client). Add a new platform here (option + icon)
// and it becomes available everywhere automatically.
import type { ReactNode } from "react";

export const SOCIAL_PLATFORMS: { value: string; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website / Other" },
];

export const SOCIAL_PLATFORM_LABEL: Record<string, string> = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.value, p.label]),
);

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" />
    </>
  ),
  facebook: <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v3H9v9h3v-9h2.5l.5-3H12V6.5a.5.5 0 0 1 .5-.5H15z" />,
  x: <path d="M4 4l7.5 9.5L4.5 20M20 4l-7.4 8.9L20 20" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" />
      <path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  telegram: <path d="M21 4L3 11l5 2 2 6 3-4 5 4z" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
      <path d="M9 9c0 4 2 6 6 6M9 9c0-1 1-1.5 1.5-1l.8 1.4c.2.4 0 .8-.3 1M15 15c1 0 1.5-1 1-1.5l-1.4-.8c-.4-.2-.8 0-1 .3" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.5 2.5 2 4 4.5 4.2" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.5 6-3.5 9S9.5 18.5 12 21" />
    </>
  ),
};

export function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const inner = ICONS[platform] ?? ICONS.website;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} aria-hidden="true">
      {inner}
    </svg>
  );
}
