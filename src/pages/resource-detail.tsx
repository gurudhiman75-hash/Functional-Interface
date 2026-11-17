import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, FileText, Globe2, Languages, Newspaper } from "lucide-react";
import { Link, useParams } from "wouter";

import { LearningResourceMarkdown } from "@/components/LearningResourceMarkdown";
import { Button } from "@/components/ui/button";
import {
  formatLearningResourceDate,
  getLearningResource,
  learningResourceCategoryLabel,
} from "@/lib/learning-resources";

function safeExternalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const identifier = decodeURIComponent(params.id ?? "");
  const resourceQuery = useQuery({
    queryKey: ["learning-resource", identifier],
    queryFn: () => getLearningResource(identifier),
    enabled: Boolean(identifier),
    retry: 1,
    staleTime: 60_000,
  });

  if (resourceQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6fb] px-4 py-8 dark:bg-background sm:px-6" data-testid="resource-detail-loading">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="skeleton-shimmer h-11 w-40 rounded-xl" />
          <div className="skeleton-shimmer h-64 rounded-[28px]" />
          <div className="skeleton-shimmer h-96 rounded-[28px]" />
        </div>
      </div>
    );
  }

  if (resourceQuery.isError || !resourceQuery.data) {
    return (
      <div className="min-h-screen bg-[#f5f6fb] px-4 py-10 dark:bg-background sm:px-6">
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-border dark:bg-card">
          <FileText className="mx-auto h-7 w-7 text-[#6657e8]" />
          <h1 className="mt-4 text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-foreground">This resource is not available</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">It may not be published yet, may have expired, or could no longer be available to learners.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" className="min-h-11 rounded-xl" onClick={() => resourceQuery.refetch()}>Try again</Button>
            <Button asChild className="min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]"><Link href="/resources">Browse resources</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const resource = resourceQuery.data;
  const externalUrl = safeExternalUrl(resource.contentUrl);
  const categoryLabel = learningResourceCategoryLabel(resource.category);
  const Icon = resource.category === "current_affairs" ? Newspaper : BookOpen;

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-slate-950 dark:bg-background dark:text-foreground" data-testid="resource-detail-page">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-9">
        <Link href={resource.category === "current_affairs" ? "/resources/current-affairs" : "/resources/notes"} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-bold text-slate-600 hover:text-[#6657e8] dark:text-muted-foreground dark:hover:text-violet-300">
          <ArrowLeft className="h-4 w-4" /> Back to {categoryLabel}
        </Link>

        <header className="mt-4 overflow-hidden rounded-[30px] border border-[#e0ddef] bg-[radial-gradient(circle_at_92%_8%,rgba(102,87,232,0.13),transparent_22rem),linear-gradient(135deg,#ffffff_0%,#f5f2ff_100%)] p-6 shadow-[0_18px_52px_rgba(44,42,76,0.055)] dark:border-border dark:bg-none dark:bg-card sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[#eeeaff] px-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8] dark:bg-violet-950/45 dark:text-violet-300"><Icon className="h-3.5 w-3.5" /> {categoryLabel}</span>
            <span className="inline-flex min-h-8 items-center rounded-full border border-[#e1ddf0] bg-white/80 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:border-border dark:bg-muted/40 dark:text-muted-foreground">{resource.format}</span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#e1ddf0] bg-white/80 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:border-border dark:bg-muted/40 dark:text-muted-foreground"><Languages className="h-3.5 w-3.5" /> {resource.languageCode}</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-3xl font-black leading-[1.08] tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl lg:text-5xl">{resource.title}</h1>
          {resource.summary ? <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-muted-foreground sm:text-[15px]">{resource.summary}</p> : null}

          <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-muted-foreground">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[#e5e1f1] bg-white/75 px-3 dark:border-border dark:bg-muted/40"><CalendarDays className="h-4 w-4 text-[#6657e8]" /> {formatLearningResourceDate(resource)}</span>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[#e5e1f1] bg-white/75 px-3 dark:border-border dark:bg-muted/40"><Globe2 className="h-4 w-4 text-[#6657e8]" /> {resource.isGeneral ? "General preparation" : `${resource.exams.length} targeted ${resource.exams.length === 1 ? "exam" : "exams"}`}</span>
          </div>

          {resource.exams.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Target exams">
              {resource.exams.map((exam) => <span key={exam.id} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-muted dark:text-muted-foreground dark:ring-border">{exam.name}</span>)}
            </div>
          ) : null}
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article className="min-w-0 rounded-[28px] border border-[#e0e2ec] bg-white p-6 shadow-[0_10px_32px_rgba(42,45,80,0.04)] dark:border-border dark:bg-card sm:p-8 lg:p-10" data-testid="resource-body">
            {resource.bodyMarkdown?.trim() ? (
              <LearningResourceMarkdown markdown={resource.bodyMarkdown} />
            ) : externalUrl ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-7 w-7 text-[#6657e8]" />
                <h2 className="mt-4 text-xl font-black tracking-[-0.03em]">This resource is published as an external document.</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">Open the publisher-provided document to read the complete resource.</p>
                <Button asChild className="mt-5 min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]"><a href={externalUrl} target="_blank" rel="noopener noreferrer">Open resource <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-7 w-7 text-slate-400" />
                <h2 className="mt-4 text-lg font-black">No readable body is attached to this published resource.</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">The catalog metadata is available, but there is no inline content or document URL to open.</p>
              </div>
            )}
          </article>

          <aside className="rounded-[24px] border border-[#e0e2ec] bg-white p-5 dark:border-border dark:bg-card" aria-label="Resource information">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6657e8]">Resource information</p>
            <dl className="mt-4 space-y-4 text-xs">
              <div><dt className="font-bold text-slate-400 dark:text-muted-foreground">Public code</dt><dd className="mt-1 break-all font-black text-slate-800 dark:text-foreground">{resource.publicCode}</dd></div>
              <div><dt className="font-bold text-slate-400 dark:text-muted-foreground">Published</dt><dd className="mt-1 font-black text-slate-800 dark:text-foreground">{formatLearningResourceDate(resource)}</dd></div>
              <div><dt className="font-bold text-slate-400 dark:text-muted-foreground">Language</dt><dd className="mt-1 font-black uppercase text-slate-800 dark:text-foreground">{resource.languageCode}</dd></div>
            </dl>
            {externalUrl && resource.bodyMarkdown?.trim() ? <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="et-interactive mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ded9f3] bg-[#f8f6ff] px-3 text-sm font-bold text-[#6657e8] hover:bg-[#f1edff] dark:border-violet-900 dark:bg-violet-950/25 dark:text-violet-300">Open attached document <ArrowUpRight className="h-4 w-4" /></a> : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
