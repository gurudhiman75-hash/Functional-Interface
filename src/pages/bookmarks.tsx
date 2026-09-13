import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Flag,
  Search,
  StickyNote,
  Target,
  XCircle,
} from "lucide-react";

import { QuestionRichText } from "@/components/QuestionRichText";
import { Button } from "@/components/ui/button";
import { getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser, Storage } from "@/lib/storage";

type ReviewItem = NonNullable<TestAttempt["questionReview"]>[number];
type ReviewState = "correct" | "wrong" | "unanswered";
type ReviewFilter = "all" | ReviewState;

type BookmarkEntry = {
  attempt: TestAttempt;
  item: ReviewItem;
  state: ReviewState;
};

type BookmarkNotes = Record<string, string>;

function reviewState(item: ReviewItem): ReviewState {
  if (item.selected == null) return "unanswered";
  return item.selected === item.correct ? "correct" : "wrong";
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Saved attempt";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved attempt";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function noteKey(entry: BookmarkEntry) {
  return `${entry.attempt.id}:${entry.item.questionId}`;
}

function notesStorageKey(userId: string) {
  return `bookmark_notes:${userId}`;
}

export default function BookmarksPage() {
  const user = getUser();
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<BookmarkNotes>(() => {
    if (!user?.id) return {};
    return Storage.get<BookmarkNotes>(notesStorageKey(user.id)) ?? {};
  });

  const attemptsQuery = useQuery({
    queryKey: ["bookmarked-review-questions", user?.id],
    queryFn: () => getUserAttempts(),
    enabled: Boolean(user?.id),
    retry: false,
    staleTime: 60_000,
  });

  const entries = useMemo<BookmarkEntry[]>(() => {
    const rows: BookmarkEntry[] = [];
    for (const attempt of attemptsQuery.data ?? []) {
      for (const item of attempt.questionReview ?? []) {
        if (!item.flagged) continue;
        rows.push({ attempt, item, state: reviewState(item) });
      }
    }
    return rows;
  }, [attemptsQuery.data]);

  const counts = useMemo(() => ({
    all: entries.length,
    correct: entries.filter((entry) => entry.state === "correct").length,
    wrong: entries.filter((entry) => entry.state === "wrong").length,
    unanswered: entries.filter((entry) => entry.state === "unanswered").length,
  }), [entries]);

  const testsRepresented = useMemo(() => new Set(entries.map((entry) => entry.attempt.testId)).size, [entries]);
  const visibleEntries = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filter !== "all" && entry.state !== filter) return false;
      if (!needle) return true;
      return `${entry.attempt.testName} ${entry.attempt.category} ${entry.item.section} ${entry.item.text}`.toLowerCase().includes(needle);
    });
  }, [entries, filter, search]);

  const updateNote = (entry: BookmarkEntry, value: string) => {
    if (!user?.id) return;
    const key = noteKey(entry);
    const next = { ...notes, [key]: value };
    if (!value.trim()) delete next[key];
    setNotes(next);
    Storage.set(notesStorageKey(user.id), next);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-background" data-testid="bookmarks-page">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[30px] border border-[#e2def5] bg-[radial-gradient(circle_at_90%_12%,rgba(102,87,232,0.14),transparent_24rem),linear-gradient(135deg,#ffffff_0%,#f5f2ff_62%,#faf9ff_100%)] shadow-[0_18px_52px_rgba(44,42,76,0.055)] dark:border-border dark:bg-none dark:bg-card">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ddd7fb] bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">
                <Bookmark className="h-3.5 w-3.5" /> Saved review list
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl">Questions you marked to revisit, in one place.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-muted-foreground">
                This list is built from the questions you marked for review in committed test attempts. It follows your saved ExamTree attempts rather than inventing a separate question history.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-muted-foreground">
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e5e1f4] bg-white/80 px-3 dark:border-border dark:bg-muted/40"><Flag className="h-4 w-4 text-[#6657e8]" /> Marked during tests</span>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e5e1f4] bg-white/80 px-3 dark:border-border dark:bg-muted/40"><StickyNote className="h-4 w-4 text-[#6657e8]" /> Personal notes stay on this device</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-[24px] border border-white/90 bg-white/88 p-4 shadow-[0_12px_34px_rgba(73,62,139,0.08)] backdrop-blur dark:border-border dark:bg-muted/40">
              <div className="rounded-2xl bg-[#f8f7fc] p-3 text-center dark:bg-background/40"><p className="text-2xl font-black text-slate-950 dark:text-foreground">{attemptsQuery.isLoading ? "—" : counts.all}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-muted-foreground">Saved</p></div>
              <div className="rounded-2xl bg-[#fff7ed] p-3 text-center dark:bg-amber-950/20"><p className="text-2xl font-black text-amber-700 dark:text-amber-300">{attemptsQuery.isLoading ? "—" : counts.wrong}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600/70 dark:text-amber-300/70">Revisit</p></div>
              <div className="rounded-2xl bg-[#f3f0ff] p-3 text-center dark:bg-violet-950/30"><p className="text-2xl font-black text-[#6657e8] dark:text-violet-300">{attemptsQuery.isLoading ? "—" : testsRepresented}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6657e8]/70 dark:text-violet-300/70">Tests</p></div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-[#e6e3f0] bg-white p-4 shadow-[0_10px_34px_rgba(37,42,68,0.035)] dark:border-border dark:bg-card sm:p-5" aria-label="Bookmark filters">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block lg:w-[340px]">
              <span className="sr-only">Search saved questions</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search question, test or section"
                className="min-h-11 w-full rounded-xl border border-[#e2dfed] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9c91ef] focus:ring-2 focus:ring-[#6657e8]/10 dark:border-border dark:bg-background dark:text-foreground"
                data-testid="bookmarks-search"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {(["all", "wrong", "correct", "unanswered"] as ReviewFilter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={`et-interactive min-h-11 rounded-xl border px-3.5 text-sm font-bold transition ${filter === item ? "border-[#6657e8] bg-[#6657e8] text-white" : "border-[#e2dfed] bg-white text-slate-600 hover:border-[#c9c2f3] hover:text-[#6657e8] dark:border-border dark:bg-background dark:text-muted-foreground"}`}
                >
                  {item === "all" ? "All" : item[0]!.toUpperCase() + item.slice(1)} ({counts[item]})
                </button>
              ))}
            </div>
          </div>
        </section>

        {attemptsQuery.isLoading ? (
          <div className="mt-5 space-y-4" role="status" aria-label="Loading saved questions">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-72 rounded-[24px]" />)}
          </div>
        ) : attemptsQuery.isError ? (
          <section className="mt-5 rounded-[26px] border border-rose-200 bg-white p-8 text-center dark:border-rose-900 dark:bg-card">
            <FileQuestion className="mx-auto h-7 w-7 text-rose-500" />
            <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-foreground">Saved questions could not be loaded</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">Your canonical attempts are temporarily unavailable. ExamTree is not substituting browser-local attempt data for this list.</p>
            <Button variant="outline" className="mt-5 min-h-11 rounded-xl" onClick={() => attemptsQuery.refetch()}>Try again</Button>
          </section>
        ) : entries.length === 0 ? (
          <section className="mt-5 rounded-[26px] border border-dashed border-[#dcd8eb] bg-white px-6 py-12 text-center dark:border-border dark:bg-card">
            <Bookmark className="mx-auto h-8 w-8 text-[#6657e8]" />
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-foreground">No marked questions yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">Use the existing “mark for review” control while taking a test. After the attempt is submitted and saved, those questions will appear here automatically.</p>
            <Link href="/exams" className="et-interactive mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-5 text-sm font-bold text-white hover:bg-[#594bd9]">Find a test <ArrowRight className="h-4 w-4" /></Link>
          </section>
        ) : visibleEntries.length === 0 ? (
          <section className="mt-5 rounded-[26px] border border-dashed border-[#dcd8eb] bg-white px-6 py-10 text-center dark:border-border dark:bg-card">
            <Search className="mx-auto h-7 w-7 text-slate-400" />
            <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-foreground">No saved questions match these filters</h2>
            <button type="button" className="et-interactive mt-3 min-h-11 rounded-xl px-4 text-sm font-bold text-[#6657e8] hover:bg-[#f3f0ff] dark:text-violet-300 dark:hover:bg-violet-950/30" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>
          </section>
        ) : (
          <div className="mt-5 space-y-4" data-testid="bookmarks-list">
            {visibleEntries.map((entry, index) => {
              const selectedLabel = entry.item.selected == null ? null : entry.item.options[entry.item.selected] ?? null;
              const correctLabel = entry.item.options[entry.item.correct] ?? null;
              const key = noteKey(entry);
              return (
                <article key={key} className="overflow-hidden rounded-[24px] border border-[#e8e5f1] bg-white shadow-[0_10px_32px_rgba(37,42,68,0.035)] dark:border-border dark:bg-card" data-testid={`bookmark-card-${entry.item.questionId}`}>
                  <div className="flex flex-col gap-3 border-b border-[#efedf5] bg-[#fbfaff] px-4 py-4 dark:border-border dark:bg-muted/25 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8] dark:text-violet-300">Saved question {index + 1}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-muted-foreground">{entry.attempt.testName} · {entry.item.section} · {formatDate(entry.attempt.createdAt)}</p>
                    </div>
                    <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${entry.state === "correct" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300" : entry.state === "wrong" ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"}`}>
                      {entry.state === "correct" ? <CheckCircle2 className="h-3.5 w-3.5" /> : entry.state === "wrong" ? <XCircle className="h-3.5 w-3.5" /> : <FileQuestion className="h-3.5 w-3.5" />}
                      {entry.state === "correct" ? "Correct" : entry.state === "wrong" ? "Wrong" : "Unanswered"}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="font-semibold leading-7 text-slate-950 dark:text-foreground"><QuestionRichText content={entry.item.text} lang="en" /></div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className={`rounded-2xl border p-4 ${entry.state === "wrong" ? "border-rose-100 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20" : "border-[#e8e5f1] bg-[#faf9fd] dark:border-border dark:bg-muted/25"}`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Your answer</p>
                        <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-foreground">{selectedLabel ? <QuestionRichText content={selectedLabel} lang="en" /> : "Not answered"}</div>
                      </div>
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">Correct answer</p>
                        <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-foreground">{correctLabel ? <QuestionRichText content={correctLabel} lang="en" /> : `Option ${entry.item.correct + 1}`}</div>
                      </div>
                    </div>

                    {entry.item.explanation ? (
                      <details className="mt-4 rounded-2xl border border-[#e4e0f5] bg-[#f8f6ff] dark:border-violet-900/60 dark:bg-violet-950/20">
                        <summary className="et-interactive flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 text-sm font-bold text-[#6657e8] dark:text-violet-300">Review explanation <BookOpen className="h-4 w-4" /></summary>
                        <div className="border-t border-[#e4e0f5] px-4 py-4 text-sm leading-6 text-slate-700 dark:border-violet-900/60 dark:text-foreground"><QuestionRichText content={entry.item.explanation} lang="en" /></div>
                      </details>
                    ) : null}

                    <div className="mt-4 rounded-2xl border border-[#e9e6f1] bg-[#fcfbff] p-4 dark:border-border dark:bg-muted/20">
                      <label htmlFor={`bookmark-note-${key}`} className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-foreground"><StickyNote className="h-4 w-4 text-[#6657e8]" /> Personal note <span className="font-medium text-slate-400 dark:text-muted-foreground">(this device)</span></label>
                      <textarea
                        id={`bookmark-note-${key}`}
                        value={notes[key] ?? ""}
                        onChange={(event) => updateNote(entry, event.target.value)}
                        rows={2}
                        maxLength={600}
                        placeholder="Add why you want to revisit this question…"
                        className="mt-2 min-h-[72px] w-full resize-y rounded-xl border border-[#e1deeb] bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#9c91ef] focus:ring-2 focus:ring-[#6657e8]/10 dark:border-border dark:bg-background dark:text-foreground"
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300"><Flag className="h-3.5 w-3.5" /> Marked for review in the submitted attempt</p>
                      <Link href={`/result?attemptId=${encodeURIComponent(entry.attempt.id)}&testId=${encodeURIComponent(entry.attempt.testId)}`} className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded9f4] bg-white px-4 text-sm font-bold text-[#6657e8] hover:bg-[#f7f5ff] dark:border-border dark:bg-background dark:text-violet-300 dark:hover:bg-violet-950/20">Open full result <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="mt-6 grid gap-3 pb-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e6e3f0] bg-white p-5 dark:border-border dark:bg-card"><Target className="h-5 w-5 text-[#6657e8]" /><h2 className="mt-3 text-sm font-black text-slate-950 dark:text-foreground">Use marks intentionally</h2><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Mark difficult or uncertain questions during a test. Submitted marks become this cross-device review list through your canonical attempt history.</p></div>
          <div className="rounded-2xl border border-[#e6e3f0] bg-white p-5 dark:border-border dark:bg-card"><BookOpen className="h-5 w-5 text-[#6657e8]" /><h2 className="mt-3 text-sm font-black text-slate-950 dark:text-foreground">Keep the solution authoritative</h2><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Questions, selected answers and explanations come from the committed attempt snapshot. Only your optional note is stored locally on this device.</p></div>
        </section>
      </div>
    </div>
  );
}
