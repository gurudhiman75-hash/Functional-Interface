import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, Bookmark, CheckCircle2, Clock3, Loader2, Sparkles, Target, Trash2 } from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteCurrentAffairsSavedItem,
  getCurrentAffairsPersonalization,
  updateCurrentAffairsPersonalizationPreferences,
} from "@/lib/current-affairs-personalization";
import { getUser } from "@/lib/storage";

export default function CurrentAffairsPersonalizationPanel() {
  const user = getUser();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["current-affairs-personalization", user?.id],
    queryFn: getCurrentAffairsPersonalization,
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });
  const [targetDraft, setTargetDraft] = useState<string>("");

  const preferenceMutation = useMutation({
    mutationFn: (dailyQuestionTarget: number) => updateCurrentAffairsPersonalizationPreferences({ dailyQuestionTarget }),
    onSuccess: async () => {
      setTargetDraft("");
      await queryClient.invalidateQueries({ queryKey: ["current-affairs-personalization"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCurrentAffairsSavedItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-affairs-personalization"] });
    },
  });

  if (!user) return null;
  if (query.isLoading) return <div className="mt-6 skeleton-shimmer h-72 rounded-3xl" />;
  const data = query.data;
  if (!data) return null;
  const targetValue = targetDraft || String(data.preferences.dailyQuestionTarget);

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#e5e1f5] bg-white shadow-[0_10px_34px_rgba(38,42,68,0.04)]" data-testid="current-affairs-personalization-panel">
      <div className="border-b border-[#eeeaf8] bg-[linear-gradient(135deg,#ffffff,#faf9ff)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Personal Current Affairs</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">Your daily CA plan</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">Daily goal, saved items and next-best study actions are derived from your real quiz and revision history.</p>
          </div>
          <div className="min-w-[250px] rounded-2xl border border-[#e8e4f5] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-[#6657e8]" /><span className="text-xs font-semibold text-slate-700">Daily question goal</span></div>
              <span className="text-xs font-bold text-[#6657e8]">{data.dailyProgress.studied}/{data.dailyProgress.target}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#6657e8]" style={{ width: `${data.dailyProgress.percent}%` }} /></div>
            <div className="mt-3 flex gap-2">
              <input value={targetValue} onChange={(event) => setTargetDraft(event.target.value.replace(/\D/g, "").slice(0, 3))} inputMode="numeric" className="min-h-10 w-20 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#9a8fec]" aria-label="Daily Current Affairs question target" />
              <Button type="button" variant="outline" disabled={preferenceMutation.isPending} onClick={() => {
                const parsed = Number(targetValue);
                if (Number.isInteger(parsed) && parsed >= 5 && parsed <= 100) preferenceMutation.mutate(parsed);
              }} className="min-h-10 rounded-xl">Set goal</Button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Choose 5–100 questions per day.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Recommended next</p><h3 className="mt-1 text-base font-semibold text-slate-950">What deserves attention now</h3></div>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-4 space-y-2">
            {data.recommendations.length ? data.recommendations.slice(0, 4).map((item) => (
              <Link key={item.key} href={item.deepLink} className="block rounded-2xl border border-slate-200 bg-[#fcfbff] p-4 transition hover:border-[#d6d0f1] hover:bg-[#f9f7ff]">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p></div><Badge className="shrink-0 rounded-full bg-[#efeaff] text-[9px] text-[#6657e8] hover:bg-[#efeaff]">{item.type.replaceAll("_", " ")}</Badge></div>
              </Link>
            )) : <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 className="mr-2 inline h-4 w-4" />No urgent Current Affairs action right now.</div>}
          </div>

          {data.signals.length ? (
            <div className="mt-5 rounded-2xl border border-[#eee9f8] bg-[#faf9ff] p-4">
              <div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-[#6657e8]" /><p className="text-xs font-semibold text-slate-700">Notification-ready signals</p></div>
              <div className="mt-3 flex flex-wrap gap-2">{data.signals.slice(0, 5).map((signal) => <Badge key={signal.key} variant="outline" className={`rounded-full ${signal.urgency === "high" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-600"}`}>{signal.title} · {signal.count}</Badge>)}</div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">These are server-side readiness signals only. CP020 does not send push, email or SMS.</p>
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Saved</p><h3 className="mt-1 text-base font-semibold text-slate-950">Bookmarks & revise later</h3></div><Bookmark className="h-5 w-5 text-[#6657e8]" /></div>
          <div className="mt-4 space-y-2">
            {data.savedItems.length ? data.savedItems.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5">
                <Link href={item.deepLink} className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">{item.title}</p><p className="mt-1 text-[10px] text-slate-400">{item.saveMode === "revise_later" ? <><Clock3 className="mr-1 inline h-3 w-3" />Revise {item.reviewAfter ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(item.reviewAfter)) : "later"}</> : "Bookmarked"}</p></Link>
                <button type="button" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(item.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove saved Current Affairs item">{deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
              </div>
            )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Use <strong>Save</strong> on a Current Affairs note or after answering a quiz question. “Revise tomorrow” will surface it here when due.</p>}
          </div>
          {data.savedReviewDue > 0 ? <Button asChild variant="outline" className="mt-3 w-full rounded-xl border-[#dcd7ef] text-[#6657e8]"><Link href="/current-affairs?saved=1">{data.savedReviewDue} saved item{data.savedReviewDue === 1 ? "" : "s"} ready to revisit</Link></Button> : null}
        </div>
      </div>
    </section>
  );
}
