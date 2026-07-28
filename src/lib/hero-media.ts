// Hero background videos per page, ported from the original design.
// Each hero renders <video autoplay muted loop> with a poster fallback and a
// dark scrim so the overlaid text stays readable. Source order matches the
// design (webm first where present, then mp4); the browser picks the first it
// can play, otherwise the poster image shows.

export interface HeroMedia {
  poster: string;
  sources: { src: string; type?: string }[];
  /** Shown instead of the video in the light theme (see .hero-lightswap in globals.css). */
  lightImage?: string;
}

export const HERO_MEDIA: Record<string, HeroMedia> = {
  home: {
    lightImage: "/hero-refinery-wide.png",
    // No poster: the video autoplays over the dark hero background, so no still
    // image flashes before it when navigating in from another page.
    poster: "",
    sources: [
      { src: "https://www.shutterstock.com/shutterstock/videos/4054533701/preview/stock-footage-aerial-view-of-large-scale-chemical-plant-and-oil-refinery-infrastructure-in-industrial-zone.webm", type: "video/webm" },
      { src: "https://static.videezy.com/system/resources/previews/000/049/766/original/refinery07.mp4", type: "video/mp4" },
    ],
  },
  industries: {
    poster: "https://videocdn.cdnpk.net/videos/28ff0df5-1794-4f03-98fd-dca14b7913e7/horizontal/thumbnails/large.jpg",
    sources: [
      { src: "https://videocdn.cdnpk.net/videos/28ff0df5-1794-4f03-98fd-dca14b7913e7/horizontal/previews/clear/large.mp4?token=exp=1784819551~hmac=7be9489e85f3574ec497ff51836770de15327b1807fc526722f9b17ee4971d82", type: "video/mp4" },
    ],
  },
  products: {
    poster: "https://images.pexels.com/videos/18692266/industrial-building-night-lights-petrol-station-venezuela-18692266.jpeg?auto=compress&w=1600",
    sources: [
      { src: "https://videos.pexels.com/video-files/18692266/18692266-hd_1920_1080_24fps.mp4", type: "video/mp4" },
    ],
  },
  careers: {
    poster: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=70",
    sources: [
      { src: "https://www.pexels.com/download/video/30283099/", type: "video/mp4" },
    ],
  },
  about: {
    poster: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=70",
    sources: [
      { src: "https://www.pexels.com/download/video/8102892/", type: "video/mp4" },
    ],
  },
  sustainability: {
    // Day/night still images (no video): green globe in dark theme, eco city in light.
    poster: "/hero-sustainability-dark.jpg",
    sources: [],
    lightImage: "/hero-sustainability-light.jpg",
  },
  partners: {
    poster: "/hero-partners-dark.jpg",
    sources: [],
    lightImage: "/hero-partners-light.jpg",
  },
  services: {
    poster: "/hero-services-dark.png",
    sources: [],
    lightImage: "/hero-services-light.png",
  },
  news: {
    poster: "/hero-news-dark.jpg",
    sources: [],
    lightImage: "/hero-news-light.jpg",
  },
  projects: {
    poster: "/hero-projects-dark.jpg",
    sources: [],
    lightImage: "/hero-projects-light.jpg",
  },
  ferumsDigital: {
    poster: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=70",
    sources: [
      { src: "https://www.shutterstock.com/shutterstock/videos/4070799231/preview/stock-footage-glowing-digital-globe-and-security-padlocks-overlaid-on-a-massive-industrial-petrochemical-plant-at.webm", type: "video/webm" },
    ],
  },
};
