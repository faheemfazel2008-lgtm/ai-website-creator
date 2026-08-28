import heroFood from "@/assets/hero-food.jpg";
import heroPortfolio from "@/assets/hero-portfolio.jpg";
import heroEcommerce from "@/assets/hero-ecommerce.jpg";
import heroBlog from "@/assets/hero-blog.jpg";

export type SiteType = "Business" | "Portfolio" | "E-commerce" | "Blog";
export type LayoutChoice = "Split" | "Grid" | "Stack";

export interface Accent {
  id: string;
  label: string;
  /** accent color used inside the generated site */
  hex: string;
}

export const ACCENTS: Accent[] = [
  { id: "amber", label: "Amber", hex: "#a8672a" },
  { id: "blue", label: "Blue", hex: "#3b6ea5" },
  { id: "green", label: "Green", hex: "#5c7a4e" },
  { id: "crimson", label: "Crimson", hex: "#a03a4b" },
  { id: "violet", label: "Violet", hex: "#6d5aa8" },
];

export interface SiteSection {
  eyebrow: string;
  title?: string;
  items: { name: string; desc: string }[];
}

export interface GeneratedSite {
  name: string;
  nav: string[];
  cta: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroImage: string;
  sections: SiteSection[];
  footerLeft: string;
  footerRight: string;
}

interface TypeTemplate {
  defaultName: string;
  nav: string[];
  cta: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroImage: string;
  sections: SiteSection[];
  footerRight: string;
}

const TEMPLATES: Record<SiteType, TypeTemplate> = {
  Business: {
    defaultName: "Ember & Ash",
    nav: ["Menu", "Our Story", "Visit"],
    cta: "Reserve a table",
    heroEyebrow: "Seasonal · Farm to table",
    heroTitle: "Dinner that follows the harvest",
    heroBody:
      "A twelve-course tasting built each week from what the valley gives up. No freezer, no shortcuts.",
    heroImage: heroFood,
    sections: [
      {
        eyebrow: "This week",
        items: [
          { name: "Charred leeks", desc: "smoked cream, hazelnut, chive oil" },
          { name: "Roasted beet tart", desc: "goat curd, pistachio, aged balsamic" },
          { name: "Cider-poached pear", desc: "brown butter, toasted oat crumble" },
        ],
      },
    ],
    footerRight: "14 Orchard Lane · Open Thu–Sun",
  },
  Portfolio: {
    defaultName: "Studio Meridian",
    nav: ["Work", "About", "Contact"],
    cta: "Start a project",
    heroEyebrow: "Design practice · Est. 2019",
    heroTitle: "Quiet work, carefully made",
    heroBody:
      "A small studio shaping identities, spaces, and objects for people who notice the details.",
    heroImage: heroPortfolio,
    sections: [
      {
        eyebrow: "Selected work",
        items: [
          { name: "Halden House", desc: "identity & wayfinding for a fjord-side retreat" },
          { name: "Paper Museum", desc: "exhibition design, print system, signage" },
          { name: "Arc Objects", desc: "art direction for a ceramics collective" },
        ],
      },
    ],
    footerRight: "Oslo · Lisbon · By appointment",
  },
  "E-commerce": {
    defaultName: "Aurelle Skin",
    nav: ["Shop", "Rituals", "Journal"],
    cta: "Shop the set",
    heroEyebrow: "Small-batch · Cold-pressed",
    heroTitle: "Skincare, slowed down",
    heroBody:
      "Five formulas, three ingredients each, blended weekly. Nothing your skin doesn't need.",
    heroImage: heroEcommerce,
    sections: [
      {
        eyebrow: "Bestsellers",
        items: [
          { name: "Night Serum No. 3", desc: "rosehip, squalane, sea buckthorn — $48" },
          { name: "Clay Renewal Mask", desc: "kaolin, honey, chamomile — $32" },
          { name: "Daily Oil Cleanser", desc: "jojoba, calendula, vitamin E — $36" },
        ],
      },
    ],
    footerRight: "Free shipping over $60 · Ships worldwide",
  },
  Blog: {
    defaultName: "The Slow Draft",
    nav: ["Essays", "Notes", "About"],
    cta: "Subscribe",
    heroEyebrow: "A newsletter on craft",
    heroTitle: "Writing about the work",
    heroBody:
      "Weekly essays on making things slowly — tools, process, and the discipline of finishing.",
    heroImage: heroBlog,
    sections: [
      {
        eyebrow: "Latest essays",
        items: [
          { name: "The case for boring tools", desc: "why mastery beats novelty, every time" },
          { name: "Finishing is a skill", desc: "on the last 10% and why it takes 90% of the time" },
          { name: "Notes on morning pages", desc: "three years of writing before sunrise" },
        ],
      },
    ],
    footerRight: "New essays every Sunday",
  },
};

function titleCase(str: string) {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

/** Derive a plausible brand name from the user's idea. */
export function deriveName(idea: string, type: SiteType): string {
  const clean = idea.replace(/[^a-zA-Z\s'&-]/g, " ").trim();
  const stop = new Set([
    "create", "a", "an", "the", "website", "site", "for", "with", "and", "of",
    "build", "make", "me", "my", "about", "page", "web", "please",
  ]);
  const words = clean.split(/\s+/).filter((w) => w.length > 2 && !stop.has(w.toLowerCase()));
  if (words.length >= 2) return titleCase(`${words[0]!} ${words[1]!}`);
  if (words.length === 1) return titleCase(words[0]!);
  return TEMPLATES[type].defaultName;
}

export function generateSite(idea: string, type: SiteType): GeneratedSite {
  const t = TEMPLATES[type];
  const name = deriveName(idea, type);
  const ideaLower = idea.toLowerCase();

  // Adapt copy to the idea when it clearly points at a domain.
  let heroEyebrow = t.heroEyebrow;
  let heroTitle = t.heroTitle;
  let heroBody = t.heroBody;
  if (/food|restaurant|bistro|cafe|coffee|menu|chef/i.test(ideaLower)) {
    heroEyebrow = "Seasonal · Farm to table";
    heroTitle = "Dinner that follows the harvest";
    heroBody =
      "A tasting menu built each week from what the valley gives up. No freezer, no shortcuts.";
  }

  return {
    name,
    nav: t.nav,
    cta: t.cta,
    heroEyebrow,
    heroTitle,
    heroBody,
    heroImage: t.heroImage,
    sections: t.sections.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })),
    footerLeft: name,
    footerRight: t.footerRight,
  };
}

/** Build a standalone HTML export of the generated site. */
export function exportSiteHtml(site: GeneratedSite, accentHex: string, dark: boolean): string {
  const bg = dark ? "#17150f" : "#f6f2ea";
  const ink = dark ? "#eceae3" : "#241d12";
  const muted = dark ? "#a89b82" : "#5a5142";
  const cardLine = dark ? "#333026" : "#e2d8c6";
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const sections = site.sections
    .map(
      (s) => `
    <section style="padding:28px 24px;border-top:1px solid ${cardLine}">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${accentHex};margin:0 0 16px">${esc(s.eyebrow)}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px 24px">
        ${s.items
          .map(
            (i) => `<div>
          <p style="font-weight:600;margin:0 0 4px">${esc(i.name)}</p>
          <p style="font-size:13px;color:${muted};margin:0">${esc(i.desc)}</p>
        </div>`,
          )
          .join("")}
      </div>
    </section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(site.name)}</title>
<meta name="description" content="${esc(site.heroBody)}" />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;background:${bg};color:${ink};font-family:Inter,system-ui,sans-serif">
  <header style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px">
    <strong style="font-family:Sora,sans-serif;letter-spacing:-0.02em">${esc(site.name)}</strong>
    <nav style="display:flex;gap:20px;font-size:13px;color:${muted}">
      ${site.nav.map((n) => `<span>${esc(n)}</span>`).join("")}
    </nav>
    <a href="#" style="background:${ink};color:${bg};padding:8px 14px;border-radius:8px;font-size:12px;text-decoration:none">${esc(site.cta)}</a>
  </header>
  <main>
    <section style="display:grid;grid-template-columns:1fr 1fr;align-items:stretch">
      <div style="display:flex;flex-direction:column;justify-content:center;gap:16px;padding:48px 24px">
        <span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${accentHex}">${esc(site.heroEyebrow)}</span>
        <h1 style="font-family:Sora,sans-serif;font-size:32px;line-height:1.15;margin:0;letter-spacing:-0.02em">${esc(site.heroTitle)}</h1>
        <p style="font-size:14px;color:${muted};margin:0;max-width:42ch">${esc(site.heroBody)}</p>
        <a href="#" style="align-self:flex-start;background:${accentHex};color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;text-decoration:none">${esc(site.cta)}</a>
      </div>
      <img src="${site.heroImage}" alt="${esc(site.name)} hero" style="width:100%;height:100%;min-height:280px;object-fit:cover" />
    </section>
    ${sections}
  </main>
  <footer style="display:flex;justify-content:space-between;padding:20px 24px;background:${ink};color:${dark ? "#a89b82" : "#c9c0ad"};font-size:12px">
    <span style="font-family:Sora,sans-serif">${esc(site.footerLeft)}</span>
    <span>${esc(site.footerRight)}</span>
  </footer>
</body>
</html>`;
}
