import { HERO_MEDIA } from "@/lib/hero-media";

// Full-bleed background video for a hero section. Place as the FIRST child of a
// `position:relative` hero; the hero's content must sit in a wrapper with a
// higher z-index. Autoplays muted/looping; the poster shows until it plays or
// if the video can't load.
export function HeroVideo({ media }: { media: keyof typeof HERO_MEDIA }) {
  const m = HERO_MEDIA[media];
  if (!m) return null;
  return (
    <div className="hero-video" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata" poster={m.poster}>
        {m.sources.map((s, i) => (
          <source key={i} src={s.src} type={s.type} />
        ))}
      </video>
      <div className="hero-video-scrim" />
    </div>
  );
}
