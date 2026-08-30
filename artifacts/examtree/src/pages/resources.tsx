import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  Bookmark,
  CalendarDays,
  FileQuestion,
  Flame,
  Languages,
  Newspaper,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

const RESOURCE_TYPES = [
  {
    id: "current-affairs",
    label: "Current Affairs",
    short: "Daily news & analysis",
    icon: Newspaper,
    accent: "bg-violet-100 text-violet-700 dark:bg-violet-950/45 dark:text-violet-300",
  },
  {
    id: "notes",
    label: "Study Notes",
    short: "Exam-ready concepts",
    icon: BookOpen,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-300",
  },
  {
    id: "papers",
    label: "Previous Papers",
    short: "Real exam questions",
    icon: FileQuestion,
    accent: "bg-orange-100 text-orange-700 dark:bg-orange-950/45 dark:text-orange-300",
  },
  {
    id: "quizzes",
    label: "Daily Quizzes",
    short: "Quick practice",
    icon: Target,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-950/45 dark:text-sky-300",
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    short: "Words that score",
    icon: Languages,
    accent: "bg-rose-100 text-rose-700 dark:bg-rose-950/45 dark:text-rose-300",
  },
  {
    id: "updates",
    label: "Exam Updates",
    short: "Dates & notifications",
    icon: CalendarDays,
    accent: "bg-teal-100 text-teal-700 dark:bg-teal-950/45 dark:text-teal-300",
  },
] as const;

type ResourceTypeId = (typeof RESOURCE_TYPES)[number]["id"];

function routeType(location: string): ResourceTypeId | "all" {
  const match = RESOURCE_TYPES.find((item) => location === `/resources/${item.id}`);
  return match?.id ?? "all";
}

function resourceTitle(type: ResourceTypeId | "all") {
  if (type === "current-affairs") return "Current affairs, without the noise.";
  if (type === "notes") return "Revision notes built for exam day.";
  if (type === "papers") return "Previous papers, organised properly.";
  if (type === "quizzes") return "Short practice. Daily momentum.";
  if (type === "vocabulary") return "Build the vocabulary that actually scores.";
  if (type === "updates") return "Important exam updates in one place.";
  return "Learn something useful. Every single day.";
}

function resourceSubtitle(type: ResourceTypeId | "all") {
  if (type === "current-affairs") return "Daily exam-focused current affairs, explainers and revision-ready briefs will appear here as soon as they are published.";
  if (type === "notes") return "Concept notes, formula sheets and focused revision material—organised by exam and subject.";
  if (type === "papers") return "Previous-year papers and question sets, grouped so you can move from discovery straight into practice.";
  if (type === "quizzes") return "Fast daily quizzes designed for consistency, revision and quick confidence checks.";
  if (type === "vocabulary") return "Exam-relevant words, meanings, usage and revision sets in a clean daily workflow.";
  if (type === "updates") return "Notifications, schedules and important exam changes—presented only when verified and published.";
  return "Current affairs, exam notes, previous papers, daily quizzes and updates—carefully organised in one free learning space.";
}

export default function ResourcesPage() {
  const [location] = useLocation();
  const [query, setQuery] = useState("");
  const activeType = routeType(location);
  const activeDefinition = useMemo(
    () => RESOURCE_TYPES.find((item) => item.id === activeType),
    [activeType],
  );

  const quickLink = activeType === "all" ? "/resources/current-affairs" : `/resources/${activeType}`;

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-slate-950 dark:bg-background dark:text-foreground" data-testid="resources-page">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="pt-2 lg:pt-4">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 dark:text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[#6657e8]" aria-hidden="true" />
              100% free · organised for exam prep
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.055em] text-slate-950 dark:text-foreground sm:text-5xl lg:text-[56px]">
              {activeType === "all" ? (
                <>Learn something useful. <span className="text-[#6657e8]">Every single day.</span></>
              ) : (
                resourceTitle(activeType)
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-muted-foreground sm:text-[15px]">
              {resourceSubtitle(activeType)}
            </p>

            <form
              className="mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-[#dcdfea] bg-white p-2 shadow-[0_12px_34px_rgba(37,40,75,0.07)] dark:border-border dark:bg-card sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
              role="search"
            >
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search resources</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search current affairs, notes, papers..."
                  className="min-h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-sm outline-none placeholder:text-slate-400"
                  data-testid="resources-search"
                />
              </label>
              <button
                type="submit"
                className="et-interactive min-h-11 rounded-xl bg-[#6657e8] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#594bd9]"
              >
                Find resources
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500 dark:text-muted-foreground">
              <span className="font-black text-slate-700 dark:text-foreground">Popular:</span>
              <Link href="/resources/current-affairs" className="font-semibold text-[#6657e8] hover:underline">Current Affairs</Link>
              <Link href="/resources/notes" className="font-semibold text-[#6657e8] hover:underline">Study Notes</Link>
              <Link href="/resources/papers" className="font-semibold text-[#6657e8] hover:underline">Previous Papers</Link>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_90%_0%,rgba(111,87,232,0.28),transparent_15rem),linear-gradient(145deg,#17192a,#111422)] p-6 text-white shadow-[0_24px_55px_rgba(21,23,43,0.16)] sm:p-7" aria-label="Daily resource brief">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-violet-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Daily brief
              </span>
              <Flame className="h-5 w-5 text-orange-400" aria-hidden="true" />
            </div>
            <h2 className="mt-8 text-2xl font-black tracking-[-0.04em]">Your exam-focused roundup.</h2>
            <p className="mt-2 text-xs leading-5 text-white/65">Fresh learning appears here when reviewed resources are published. No placeholder counts or invented updates.</p>

            <div className="mt-7 grid grid-cols-3 gap-0 border-y border-white/10 py-5">
              <div className="pr-3"><p className="text-lg font-black">News</p><p className="mt-1 text-[10px] text-white/45">Current affairs</p></div>
              <div className="border-x border-white/10 px-4"><p className="text-lg font-black">Quiz</p><p className="mt-1 text-[10px] text-white/45">Quick revision</p></div>
              <div className="pl-4"><p className="text-lg font-black">Words</p><p className="mt-1 text-[10px] text-white/45">Vocabulary</p></div>
            </div>

            <Link href={quickLink} className="et-interactive mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#6657e8] transition hover:bg-violet-50">
              {activeType === "all" ? "Open current affairs" : `Explore ${activeDefinition?.label ?? "resources"}`}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <div className="mt-5 flex items-center gap-3 text-[10px] text-white/60">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-amber-300"><Flame className="h-4 w-4" /></span>
              <div><p className="font-bold text-white/85">Build a daily learning habit</p><p className="mt-0.5">Come back when new material is published.</p></div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Resource categories">
          {RESOURCE_TYPES.map((item) => {
            const Icon = item.icon;
            const active = activeType === item.id;
            return (
              <Link
                key={item.id}
                href={`/resources/${item.id}`}
                aria-current={active ? "page" : undefined}
                className={`et-interactive group flex min-h-[92px] items-center gap-4 rounded-2xl border bg-white p-4 shadow-[0_8px_24px_rgba(42,45,80,0.035)] transition hover:-translate-y-0.5 hover:border-[#cfc9f4] hover:shadow-[0_14px_30px_rgba(42,45,80,0.07)] dark:bg-card ${active ? "border-[#bdb4f3] ring-2 ring-[#6657e8]/10 dark:border-violet-700" : "border-[#dfe2ec] dark:border-border"}`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1"><h2 className="text-sm font-black tracking-[-0.02em] text-slate-950 dark:text-foreground">{item.label}</h2><p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">{item.short}</p></div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#6657e8]" aria-hidden="true" />
              </Link>
            );
          })}
        </section>

        <section className="mt-16" aria-labelledby="resource-library-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Explore resources</p>
              <h2 id="resource-library-heading" className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-foreground">Fresh, focused and exam-ready.</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-muted-foreground">Published learning material will appear here in the same clean card system.</p>
            </div>

            <nav className="flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-[#eceef6] p-1.5 dark:bg-muted" aria-label="Resource filters">
              <Link href="/resources" className={`et-interactive shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${activeType === "all" ? "bg-white text-[#6657e8] shadow-sm dark:bg-card" : "text-slate-600 hover:bg-white/70 dark:text-muted-foreground"}`}>All</Link>
              {RESOURCE_TYPES.map((item) => (
                <Link key={item.id} href={`/resources/${item.id}`} className={`et-interactive shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${activeType === item.id ? "bg-white text-[#6657e8] shadow-sm dark:bg-card" : "text-slate-600 hover:bg-white/70 dark:text-muted-foreground"}`}>{item.label.replace("Study ", "").replace("Daily ", "")}</Link>
              ))}
              <button type="button" disabled className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-slate-400" title="Saved resources will be enabled with canonical resource data"><Bookmark className="mr-1 inline h-3.5 w-3.5" /> Saved</button>
            </nav>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="resource-library-empty-grid">
            {[0, 1, 2].map((index) => (
              <div key={index} className="overflow-hidden rounded-[22px] border border-[#dfe2ec] bg-white shadow-[0_8px_24px_rgba(42,45,80,0.035)] dark:border-border dark:bg-card">
                <div className={`h-40 ${index === 0 ? "bg-[linear-gradient(135deg,#ede9fe,#ddd6fe)]" : index === 1 ? "bg-[linear-gradient(135deg,#dcfce7,#d1fae5)]" : "bg-[linear-gradient(135deg,#ffedd5,#fed7aa)]"}`} />
                <div className="p-5">
                  <div className="h-3 w-24 rounded-full bg-slate-100 dark:bg-muted" />
                  <div className="mt-4 h-5 w-4/5 rounded-full bg-slate-100 dark:bg-muted" />
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-100 dark:bg-muted" />
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-100 dark:bg-muted" />
                  <div className="mt-5 h-4 w-28 rounded-full bg-[#ece9ff] dark:bg-violet-950/40" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-[#d4d7e4] bg-white/70 px-5 py-5 text-center dark:border-border dark:bg-card/60">
            <p className="text-sm font-bold text-slate-800 dark:text-foreground">Resource publishing data is not connected to this student surface yet.</p>
            <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-muted-foreground">The page is production-ready visually, but it intentionally does not invent article titles, dates, read counts, question counts or downloads. Those cards should populate from the canonical resource API once available.</p>
          </div>
        </section>

        <section className="mt-12 grid gap-3 md:grid-cols-3" aria-label="Resource promises">
          {[
            [BellRing, "Verified updates", "Exam updates should appear only when they have a published source and review state."],
            [BookOpen, "Focused revision", "Notes and briefs use the same compact, exam-first reading experience across subjects."],
            [FileQuestion, "Practice connected", "Previous papers and quizzes can route directly into the existing practice flow when canonical IDs exist."],
          ].map(([Icon, title, copy]) => {
            const ItemIcon = Icon as typeof BellRing;
            return (
              <div key={String(title)} className="rounded-2xl border border-[#e0e3ec] bg-white p-5 dark:border-border dark:bg-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0edff] text-[#6657e8] dark:bg-violet-950/45 dark:text-violet-300"><ItemIcon className="h-4 w-4" /></span>
                <h3 className="mt-4 text-sm font-black text-slate-950 dark:text-foreground">{String(title)}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{String(copy)}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
