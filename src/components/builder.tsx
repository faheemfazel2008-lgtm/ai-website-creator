import { useEffect, useRef, useState } from "react";
import {
  ACCENTS,
  type GeneratedSite,
  type LayoutChoice,
  type SiteType,
} from "@/lib/site-generator";

export const SITE_TYPES: SiteType[] = ["Business", "Portfolio", "E-commerce", "Blog"];
export const LAYOUTS: LayoutChoice[] = ["Split", "Grid", "Stack"];
export const FONTS = ["Sora", "Fraunces", "Space Grotesk"] as const;
export type FontChoice = (typeof FONTS)[number];

/* ---------------------------------- Top bar --------------------------------- */

export function TopBar({
  step,
  onExport,
  onPublish,
}: {
  step: number;
  onExport: () => void;
  onPublish: () => void;
}) {
  const steps = ["Idea", "Type", "Style", "Generate"];
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-panel px-5">
      <div className="flex items-center gap-2.5">
        <div className="grid size-7 place-items-center rounded-[7px] bg-brand">
          <span className="size-2.5 rounded-full bg-brandink/80" />
        </div>
        <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
          Buildwerk
        </span>
      </div>

      <nav className="ml-4 hidden items-center gap-1 md:flex">
        {steps.map((label, i) => {
          const active = i <= step;
          return (
            <div
              key={label}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                active ? "bg-panel2 text-ink" : "text-mutedink"
              }`}
            >
              <span
                className={`grid size-4 place-items-center rounded-full text-[10px] font-semibold ${
                  active ? "bg-brand/20 text-brand" : "bg-line text-mutedink"
                }`}
              >
                {i + 1}
              </span>
              {label}
            </div>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onExport}
          className="h-9 rounded-lg px-3 font-mono text-sm font-medium text-mutedink transition-transform hover:bg-panel2 hover:text-ink active:scale-95"
        >
          Export
        </button>
        <button
          onClick={onPublish}
          className="h-9 rounded-lg bg-brand px-4 font-display text-sm font-medium text-brandink transition-transform hover:brightness-95 active:scale-95"
        >
          Publish
        </button>
      </div>
    </header>
  );
}

/* -------------------------------- Config panel ------------------------------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-mutedink">{children}</p>
  );
}

export function ConfigPanel({
  idea,
  setIdea,
  type,
  setType,
  accent,
  setAccent,
  font,
  setFont,
  layout,
  setLayout,
  generating,
  progress,
  onGenerate,
  generated,
}: {
  idea: string;
  setIdea: (v: string) => void;
  type: SiteType;
  setType: (t: SiteType) => void;
  accent: string;
  setAccent: (a: string) => void;
  font: FontChoice;
  setFont: (f: FontChoice) => void;
  layout: LayoutChoice;
  setLayout: (l: LayoutChoice) => void;
  generating: boolean;
  progress: number;
  onGenerate: () => void;
  generated: boolean;
}) {
  const genSteps = [
    { at: 25, label: "Header, hero, sections, footer" },
    { at: 55, label: "Writing copy" },
    { at: 85, label: "Placing imagery" },
  ];
  return (
    <aside className="hidden flex-col gap-5 overflow-y-auto border-r border-line bg-panel p-5 dark-scroll lg:flex">
      <div>
        <Label>Idea</Label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={4}
          placeholder="Describe the website you want…"
          className="w-full resize-none rounded-xl border border-line bg-panel2 p-3 text-sm leading-relaxed text-ink outline-none placeholder:text-mutedink focus:border-brand/50"
        />
      </div>

      <div>
        <Label>Website type</Label>
        <div className="grid grid-cols-2 gap-2">
          {SITE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                type === t
                  ? "border-brand/40 bg-brand/10 text-brand"
                  : "border-line text-mutedink hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Accent</Label>
        <div className="flex items-center gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              title={a.label}
              onClick={() => setAccent(a.hex)}
              className={`size-8 rounded-lg transition-transform active:scale-90 ${
                accent === a.hex
                  ? "outline-2 -outline-offset-1 outline-brand"
                  : "outline-1 -outline-offset-1 outline-line hover:scale-105"
              }`}
              style={{ backgroundColor: a.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>Font</Label>
        <div className="flex items-center justify-between rounded-xl border border-line bg-panel2 p-3">
          <span className="font-display text-lg text-ink">{font}</span>
          <span className="text-sm text-mutedink">/ Inter</span>
        </div>
      </div>

      <div>
        <Label>Layout</Label>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`grid h-12 place-items-center rounded-lg border transition-colors ${
                layout === l
                  ? "border-brand/40 bg-brand/10"
                  : "border-line hover:bg-panel2"
              }`}
            >
              <span
                className={`text-[10px] font-medium ${layout === l ? "text-brand" : "text-mutedink"}`}
              >
                {l}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        {generating || !generated ? (
          <div className="rounded-xl border border-line bg-panel2 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {generating ? "Generating" : "Ready to generate"}
              </span>
              <span className="font-mono text-[11px] font-medium text-brand">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 space-y-1.5 text-[12px]">
              {genSteps.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-2 ${progress >= s.at ? "text-ink" : "text-mutedink"}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${progress >= s.at ? "bg-brand" : "bg-line"}`}
                  />
                  {s.label}
                </div>
              ))}
            </div>
            {!generating && (
              <button
                onClick={onGenerate}
                className="mt-3 h-9 w-full rounded-lg bg-brand font-display text-sm font-medium text-brandink transition-transform hover:brightness-95 active:scale-95"
              >
                Generate website
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onGenerate}
            className="h-9 w-full rounded-lg border border-line text-sm font-medium text-mutedink transition-colors hover:bg-panel2 hover:text-ink"
          >
            Regenerate
          </button>
        )}
      </div>
    </aside>
  );
}

/* ------------------------------ Generated preview ----------------------------- */

export function SitePreview({
  site,
  accent,
  dark,
  layout,
}: {
  site: GeneratedSite;
  accent: string;
  dark: boolean;
  layout: LayoutChoice;
}) {
  const bg = dark ? "#17150f" : "#f6f2ea";
  const ink = dark ? "#eceae3" : "#241d12";
  const muted = dark ? "#a89b82" : "#5a5142";
  const cardLine = dark ? "#333026" : "#e2d8c6";
  const footerMuted = dark ? "#a89b82" : "#c9c0ad";

  const heroText = (
    <div className="flex flex-col justify-center gap-4 px-6 py-8 sm:py-12">
      <span
        className="text-[11px] font-medium uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {site.heroEyebrow}
      </span>
      <h1
        className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance"
        style={{ color: ink }}
      >
        {site.heroTitle}
      </h1>
      <p className="text-sm text-pretty" style={{ color: muted }}>
        {site.heroBody}
      </p>
      <span
        className="mt-1 flex h-9 w-fit items-center justify-center rounded-lg px-4 text-[13px] font-medium"
        style={{ backgroundColor: accent, color: "#fff" }}
      >
        {site.cta}
      </span>
    </div>
  );

  const heroImg = (
    <img
      src={site.heroImage}
      alt={`${site.name} hero`}
      className="h-full w-full object-cover aspect-[4/3] sm:aspect-auto sm:min-h-[280px]"
    />
  );

  return (
    <div
      className="rise-in mx-auto max-w-3xl overflow-hidden rounded-[min(1vw,12px)] ring-1 ring-black/5"
      style={{ backgroundColor: bg, color: ink }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-display font-semibold tracking-tight">{site.name}</span>
        <div
          className="hidden items-center gap-5 text-[13px] font-medium sm:flex"
          style={{ color: muted }}
        >
          {site.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <span
          className="flex h-8 items-center rounded-lg px-3.5 text-[12px] font-medium"
          style={{ backgroundColor: ink, color: bg }}
        >
          {site.cta}
        </span>
      </div>

      {/* hero */}
      {layout === "Split" && (
        <div className="grid items-stretch gap-0 sm:grid-cols-2">
          {heroText}
          {heroImg}
        </div>
      )}
      {layout === "Grid" && (
        <div>
          <div className="relative">
            <img src={site.heroImage} alt={`${site.name} hero`} className="aspect-[16/7] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-5" style={{ background: "linear-gradient(transparent, rgba(0,0,0,.55))" }}>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "#f6f2ea" }}>
                {site.heroEyebrow}
              </span>
              <h1 className="font-display text-3xl font-semibold tracking-tight" style={{ color: "#f6f2ea" }}>
                {site.heroTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <p className="max-w-[52ch] text-sm text-pretty" style={{ color: muted }}>{site.heroBody}</p>
            <span className="flex h-9 shrink-0 items-center rounded-lg px-4 text-[13px] font-medium" style={{ backgroundColor: accent, color: "#fff" }}>{site.cta}</span>
          </div>
        </div>
      )}
      {layout === "Stack" && (
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: accent }}>
            {site.heroEyebrow}
          </span>
          <h1 className="font-display max-w-[18ch] text-4xl leading-tight font-semibold tracking-tight text-balance">
            {site.heroTitle}
          </h1>
          <p className="max-w-[52ch] text-sm text-pretty" style={{ color: muted }}>{site.heroBody}</p>
          <span className="mt-1 flex h-9 items-center rounded-lg px-5 text-[13px] font-medium" style={{ backgroundColor: accent, color: "#fff" }}>{site.cta}</span>
          <img src={site.heroImage} alt={`${site.name} hero`} className="mt-4 aspect-[16/8] w-full rounded-lg object-cover" />
        </div>
      )}

      {/* sections */}
      {site.sections.map((s, i) => (
        <div key={i} className="px-6 py-7" style={{ borderTop: `1px solid ${cardLine}` }}>
          <p
            className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: accent }}
          >
            {s.eyebrow}
          </p>
          {s.title && (
            <h2 className="font-display mb-3 text-xl font-semibold tracking-tight">{s.title}</h2>
          )}
          {!s.title && <div className="mb-3" />}
          <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            {s.items.map((item) => (
              <div key={item.name}>
                <p className="font-display font-medium">{item.name}</p>
                <p className="text-[13px] text-pretty" style={{ color: muted }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* footer */}
      <div
        className="flex items-center justify-between px-6 py-5 text-[12px]"
        style={{ backgroundColor: dark ? "#0e0d09" : "#241d12", color: footerMuted }}
      >
        <span className="font-display font-medium">{site.footerLeft}</span>
        <span>{site.footerRight}</span>
      </div>
    </div>
  );
}

export function PreviewPanel({
  site,
  accent,
  dark,
  layout,
  generating,
  progress,
}: {
  site: GeneratedSite | null;
  accent: string;
  dark: boolean;
  layout: LayoutChoice;
  generating: boolean;
  progress: number;
}) {
  return (
    <main className="flex min-h-0 flex-col border-r border-line">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line bg-panel px-5 text-sm">
        <span
          className={`size-2 rounded-full ${generating ? "animate-pulse bg-brand" : site ? "bg-brand" : "bg-line"}`}
        />
        <span className="font-medium text-ink">Live preview</span>
        <span className="font-mono text-mutedink">/</span>
        <span className="font-mono text-mutedink">
          {site ? `${site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.buildwerk.site` : "untitled"}
        </span>
        <span className="ml-auto text-[11px] uppercase tracking-[0.15em] text-mutedink">
          Desktop
        </span>
      </div>

      <div className="dark-scroll flex-1 overflow-y-auto bg-[#141418] p-4 md:p-6">
        {site && !generating ? (
          <SitePreview site={site} accent={accent} dark={dark} layout={layout} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {[64, 200, 120, 40].map((h, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-panel2"
                style={{ height: h, opacity: 1 - i * 0.18 }}
              />
            ))}
            <p className="mt-2 text-center font-mono text-[12px] text-mutedink">
              {generating
                ? `Generating your website… ${Math.round(progress)}%`
                : "Configure your idea on the left, then generate"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------- AI chat ---------------------------------- */

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  pending?: boolean;
}

export function ChatPanel({
  messages,
  onSend,
  busy,
  onExport,
  onPublish,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  busy: boolean;
  onExport: () => void;
  onPublish: () => void;
}) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v);
    setValue("");
  };

  return (
    <aside className="hidden min-h-0 flex-col bg-panel lg:flex">
      <div className="flex h-11 shrink-0 items-center border-b border-line px-5 text-sm font-medium text-ink">
        AI edit
      </div>
      <div ref={scrollRef} className="dark-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand/10 px-3.5 py-2.5 text-sm text-pretty text-ink">
            Generate a site, then ask me to change anything — “make it blue”, “go dark”, “add a
            testimonials section”.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm text-pretty ${
              m.role === "user"
                ? "ml-auto rounded-tr-md bg-panel2 text-ink"
                : "rounded-tl-md bg-brand/10 text-ink"
            }`}
          >
            {m.text}
            {m.pending && (
              <div className="mt-2 flex gap-1.5">
                <span className="size-2 animate-pulse rounded-full bg-brand" />
                <span className="size-2 animate-pulse rounded-full bg-brand [animation-delay:.15s]" />
                <span className="size-2 animate-pulse rounded-full bg-brand [animation-delay:.3s]" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-line p-4">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-panel2 py-1.5 pr-1.5 pl-3.5">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask for a change…"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mutedink"
          />
          <button
            onClick={submit}
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-brandink transition-transform active:scale-95"
            aria-label="Send"
          >
            <span className="size-2.5 rounded-full bg-brandink/70" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onExport}
            className="h-9 rounded-lg border border-line text-[13px] font-medium text-mutedink transition-transform hover:bg-panel2 hover:text-ink active:scale-95"
          >
            Export HTML
          </button>
          <button
            onClick={onPublish}
            className="h-9 rounded-lg border border-line text-[13px] font-medium text-mutedink transition-transform hover:bg-panel2 hover:text-ink active:scale-95"
          >
            Deploy
          </button>
        </div>
      </div>
    </aside>
  );
}
