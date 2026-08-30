import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Languages, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";

import CurrentAffairsMarkdown from "@/components/CurrentAffairsMarkdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentAffairsResource } from "@/lib/current-affairs";

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function CurrentAffairsNotePage() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";
  const query = useQuery({
    queryKey: ["current-affairs-note", code],
    queryFn: () => getCurrentAffairsResource(code),
    enabled: Boolean(code),
    staleTime: 5 * 60_000,
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-4xl pb-12">
        <div className="skeleton-shimmer h-40 rounded-3xl" />
        <div className="mt-5 skeleton-shimmer h-[34rem] rounded-3xl" />
      </div>
    );
  }

  const resource = query.data;
  if (!resource) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Current Affairs note is unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">It may have been corrected, revoked or removed from the active release.</p>
        <Button asChild className="mt-5 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/current-affairs">Back to Current Affairs</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-12" data-testid="current-affairs-note-reader">
      <div className="mb-4">
        <Button asChild variant="ghost" className="rounded-xl px-2 text-slate-500 hover:bg-[#f5f3ff] hover:text-[#6657e8]">
          <Link href="/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs</Link>
        </Button>
      </div>

      <header className="rounded-3xl border border-[#e3dff5] bg-[radial-gradient(circle_at_90%_5%,rgba(102,87,232,0.12),transparent_22rem),linear-gradient(135deg,#ffffff,#faf9ff)] p-6 shadow-[0_10px_34px_rgba(37,42,68,0.045)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-[#efeaff] text-[#6657e8] hover:bg-[#efeaff]">Verified Current Affairs</Badge>
          <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500"><Languages className="mr-1 h-3 w-3" />{LANGUAGE_LABEL[resource.languageCode] ?? resource.languageCode.toUpperCase()}</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{resource.title}</h1>
        {resource.summary ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-[15px]">{resource.summary}</p> : null}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(resource.contentDate)}</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" />Editorially released</span>
        </div>
      </header>

      <main className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_28px_rgba(37,42,68,0.035)] sm:p-8 lg:p-10">
        {resource.bodyMarkdown ? (
          <CurrentAffairsMarkdown markdown={resource.bodyMarkdown} />
        ) : resource.contentUrl ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-600">This resource is available as an external document.</p>
            <Button asChild className="mt-4 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><a href={resource.contentUrl} target="_blank" rel="noreferrer">Open resource</a></Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No readable content is attached to this active resource.</p>
        )}
      </main>
    </div>
  );
}
