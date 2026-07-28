import { HERO_MEDIA } from "@/lib/hero-media";

// Full-bleed background for a hero section. Renders a looping video when the
// media has sources, otherwise a static image (some heroes use a still in the
// original design). Place as the FIRST child of a `position:relative` hero; the
// hero's content must sit in a wrapper with a higher z-index.
export function HeroVideo({ media }: { media: keyof typeof HERO_MEDIA }) {
  const m = HERO_MEDIA[media];
  if (!m) return null;
  return (
    <div className="hero-video" aria-hidden="true">
      {m.sources.length > 0 ? (
        <video autoPlay muted loop playsInline preload="auto" poster={m.poster || undefined}>
          {m.sources.map((s, i) => (
            <source key={i} src={s.src} type={s.type} />
          ))}
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.poster} alt="" />
      )}
      {m.lightImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hero-light-img" src={m.lightImage} alt="" />
      ) : null}
      <div className="hero-video-scrim" />
    </div>
  );
}
