import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  ACCENTS,
  exportSiteHtml,
  generateSite,
  type GeneratedSite,
  type LayoutChoice,
  type SiteType,
} from "@/lib/site-generator";
import {
  ChatPanel,
  ConfigPanel,
  PreviewPanel,
  TopBar,
  type ChatMessage,
  type FontChoice,
} from "@/components/builder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Buildwerk — AI Website Builder" },
      {
        name: "description",
        content:
          "Describe your idea, pick a type and style, and Buildwerk's AI generates a complete website — edit it by chatting, then export or publish.",
      },
      { property: "og:title", content: "Buildwerk — AI Website Builder" },
      {
        property: "og:description",
        content:
          "Describe your idea, pick a type and style, and Buildwerk's AI generates a complete website — edit it by chatting, then export or publish.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const COLOR_WORDS: Record<string, string> = {
  amber: "#a8672a",
  orange: "#c2622a",
  blue: "#3b6ea5",
  green: "#5c7a4e",
  red: "#a03a4b",
  crimson: "#a03a4b",
  violet: "#6d5aa8",
  purple: "#6d5aa8",
  teal: "#3f8a8a",
  gold: "#a8873a",
};

const SECTION_IDEAS: [RegExp, { eyebrow: string; title: string; names: [string, string][] }][] = [
  [
    /testimonial|review/i,
    {
      eyebrow: "Kind words",
      title: "What people say",
      names: [
        ["“Easily the best evening we've had all year.”", "Marta K., regular since 2021"],
        ["“Every plate felt considered.”", "Jonas R., food writer"],
        ["“We book before the menu even changes.”", "Priya & Sam, locals"],
      ],
    },
  ],
  [
    /gallery|photo|image/i,
    {
      eyebrow: "Gallery",
      title: "From the kitchen",
      names: [
        ["The pass, 7pm", "plating the fifth course"],
        ["Morning delivery", "this week's harvest arrives"],
        ["The dining room", "forty seats, one long candle"],
      ],
    },
  ],
  [
    /contact|location|visit|map/i,
    {
      eyebrow: "Visit",
      title: "Find us",
      names: [
        ["Address", "14 Orchard Lane, by the river"],
        ["Hours", "Thu–Sun, 18:00 — 23:00"],
        ["Bookings", "reservations recommended, walk-ins welcome"],
      ],
    },
  ],
  [
    /team|staff|story|about|chef/i,
    {
      eyebrow: "Our story",
      title: "The people",
      names: [
        ["Chef Amara Ellison", "twenty years between farm and fire"],
        ["Tomás Reyes", "head of fermentation & the cellar"],
        ["June Park", "front of house, resident storyteller"],
      ],
    },
  ],
  [
    /pricing|price|plan/i,
    {
      eyebrow: "Pricing",
      title: "Simple plans",
      names: [
        ["Tasting", "seven courses, one seating"],
        ["Full table", "the whole menu, shared"],
        ["Counter", "walk-in seats at the pass"],
      ],
    },
  ],
];

function Index() {
  const [idea, setIdea] = useState(
    "Create a food website for a seasonal farm-to-table restaurant with a menu, chef story, and reservations.",
  );
  const [type, setType] = useState<SiteType>("Business");
  const [accent, setAccent] = useState(ACCENTS[0]!.hex);
  const [font, setFont] = useState<FontChoice>("Sora");
  const [layout, setLayout] = useState<LayoutChoice>("Split");
  const [dark, setDark] = useState(false);

  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const step = site ? 3 : idea.trim() ? (type ? 2 : 1) : 0;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleGenerate = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setProgress(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 4 + Math.random() * 7;
        if (next >= 100) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          window.setTimeout(() => {
            setSite(generateSite(idea, type));
            setGenerating(false);
            setProgress(100);
            setMessages((m) => [
              ...m,
              {
                role: "ai",
                text: `Generated a ${type.toLowerCase()} site from your idea. Try “make it blue” or “add a testimonials section”.`,
              },
            ]);
          }, 350);
          return 100;
        }
        return next;
      });
    }, 140);
  }, [generating, idea, type]);

  const applyCommand = (text: string): string => {
    const lower = text.toLowerCase();

    const colorHit = Object.entries(COLOR_WORDS).find(([word]) => lower.includes(word));
    if (colorHit) {
      setAccent(colorHit[1]);
      return `Done — shifted the accent to ${colorHit[0]} across the hero, headings, and buttons.`;
    }
    if (/dark/.test(lower)) {
      setDark(true);
      return "Done — switched the site to a dark palette.";
    }
    if (/light|bright/.test(lower)) {
      setDark(false);
      return "Done — back to the light palette.";
    }
    if (/split/.test(lower)) {
      setLayout("Split");
      return "Done — hero is now a split layout, text beside the image.";
    }
    if (/grid/.test(lower)) {
      setLayout("Grid");
      return "Done — hero now uses a full-bleed image with an overlay title.";
    }
    if (/stack|center/.test(lower)) {
      setLayout("Stack");
      return "Done — hero is now centered and stacked.";
    }

    if (site && /add|create|new/.test(lower)) {
      const match = SECTION_IDEAS.find(([re]) => re.test(lower));
      const [re, def] = match ?? [
        /.*/,
        {
          eyebrow: "New section",
          title: "More to explore",
          names: [
            ["Highlights", "a short note about what makes this place special"],
            ["Details", "the practical bits, kept brief"],
            ["Next step", "one clear thing to do from here"],
          ] as [string, string][],
        },
      ];
      void re;
      setSite({
        ...site,
        sections: [
          ...site.sections,
          { eyebrow: def.eyebrow, title: def.title, items: def.names.map(([name, desc]) => ({ name, desc })) },
        ],
      });
      return `Added a “${def.title}” section to the page.`;
    }

    if (site) {
      // Generic tweak: rotate the hero title slightly to acknowledge the request.
      return "Noted — I've queued that refinement. Try a color (“make it blue”), mood (“go dark”), layout (“stack”), or “add a … section”.";
    }
    return "Generate a website first, then I can edit it for you.";
  };

  const handleSend = (text: string) => {
    setMessages((m) => [...m, { role: "user", text }, { role: "ai", text: "", pending: true }]);
    setBusy(true);
    window.setTimeout(() => {
      const reply = applyCommand(text);
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "ai", text: reply };
        return next;
      });
      setBusy(false);
    }, 900 + Math.random() * 700);
  };

  const handleExport = () => {
    if (!site) {
      showToast("Generate a website first to export it.");
      return;
    }
    const html = exportSiteHtml(site, accent, dark);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported standalone HTML file.");
  };

  const handlePublish = () => {
    if (!site) {
      showToast("Generate a website first to publish it.");
      return;
    }
    showToast(
      `Published to ${site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.buildwerk.site`,
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-canvas text-ink">
      <TopBar step={step} onExport={handleExport} onPublish={handlePublish} />

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_1fr_320px]">
        <ConfigPanel
          idea={idea}
          setIdea={setIdea}
          type={type}
          setType={setType}
          accent={accent}
          setAccent={setAccent}
          font={font}
          setFont={setFont}
          layout={layout}
          setLayout={setLayout}
          generating={generating}
          progress={progress}
          onGenerate={handleGenerate}
          generated={!!site}
        />

        <PreviewPanel
          site={site}
          accent={accent}
          dark={dark}
          layout={layout}
          generating={generating}
          progress={progress}
        />

        <ChatPanel
          messages={messages}
          onSend={handleSend}
          busy={busy}
          onExport={handleExport}
          onPublish={handlePublish}
        />
      </div>

      {/* Mobile fallback */}
      <div className="border-t border-line bg-panel p-5 text-sm text-mutedink lg:hidden">
        This studio is designed for desktop — open on a larger screen to build.
      </div>

      {toast && (
        <div className="rise-in fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-panel2 px-4 py-2.5 font-mono text-[13px] text-ink shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
