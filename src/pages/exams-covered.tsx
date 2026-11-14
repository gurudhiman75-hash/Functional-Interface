import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Search, X, BookOpen } from "lucide-react";
import { usePageMeta } from "@/components/PublicPage";
import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";

type ExamGroup = "punjab" | "ssc" | "banking";
const groups: { key: ExamGroup; label: string; description: string; accent: string }[] = [
  { key: "punjab", label: "Punjab state exams", description: "Your next opportunity, closer to home.", accent: "bg-teal-500" },
  { key: "ssc", label: "SSC exams", description: "Explore Staff Selection Commission exams.", accent: "bg-blue-500" },
  { key: "banking", label: "Banking & regulatory exams", description: "Explore banking and financial institution exams.", accent: "bg-violet-500" },
];
const exams: { label: string; href: string; group: ExamGroup; detail: string }[] = [
  { label: "SSC CGL", href: "/ssc-cgl", group: "ssc", detail: "Combined Graduate Level" },
  { label: "SSC CHSL", href: "/ssc-chsl", group: "ssc", detail: "Combined Higher Secondary Level" },
  { label: "SSC MTS", href: "/ssc-mts", group: "ssc", detail: "Multi Tasking Staff" },
  { label: "SSC CPO", href: "/ssc-cpo", group: "ssc", detail: "Central Police Organisation" },
  { label: "SSC GD Constable", href: "/ssc-gd", group: "ssc", detail: "General Duty Constable" },
  { label: "SSC Stenographer Grade C & D", href: "/ssc-stenographer", group: "ssc", detail: "Stenographer Grade C & D" },
  { label: "SSC Selection Post", href: "/ssc-selection-post", group: "ssc", detail: "Selection Post" },
  { label: "SSC JE", href: "/ssc-je", group: "ssc", detail: "Junior Engineer" },
  { label: "IBPS PO", href: "/ibps-po", group: "banking", detail: "Probationary Officer" },
  { label: "IBPS Clerk / CSA", href: "/ibps-clerk", group: "banking", detail: "Clerical cadre" },
  { label: "IBPS RRB Officer Scale I", href: "/ibps-rrb-po", group: "banking", detail: "Regional Rural Banks · Officer" },
  { label: "IBPS RRB Office Assistant", href: "/ibps-rrb-office-assistant", group: "banking", detail: "Regional Rural Banks · Assistant" },
  { label: "SBI PO", href: "/sbi-po", group: "banking", detail: "Probationary Officer" },
  { label: "SBI Clerk / Junior Associate", href: "/sbi-clerk", group: "banking", detail: "Clerical cadre" },
  { label: "RBI Assistant", href: "/rbi-assistant", group: "banking", detail: "Assistant recruitment" },
  { label: "RBI Grade B", href: "/rbi-grade-b", group: "banking", detail: "Officer Grade B" },
  { label: "NABARD Grade A", href: "/nabard-grade-a", group: "banking", detail: "Rural development banking" },
  { label: "SEBI Grade A", href: "/sebi-grade-a", group: "banking", detail: "Securities market regulator" },
  { label: "Punjab Police Constable", href: "/punjab-police-constable", group: "punjab", detail: "Constable recruitment" },
  { label: "Punjab Police Sub-Inspector", href: "/punjab-police-si", group: "punjab", detail: "Sub-Inspector recruitment" },
  { label: "PSSSB Clerk / Junior Assistant", href: "/psssb-clerk", group: "punjab", detail: "Clerk & Junior Assistant" },
  { label: "Punjab Patwari", href: "/punjab-patwari", group: "punjab", detail: "Revenue administration" },
  { label: "PSSSB Excise & Taxation Inspector", href: "/psssb-excise-taxation-inspector", group: "punjab", detail: "Excise & Taxation Inspector" },
  { label: "Punjab Naib Tehsildar", href: "/punjab-naib-tehsildar", group: "punjab", detail: "Revenue administration" },
  { label: "PPSC Punjab State Civil Services", href: "/punjab-pcs", group: "punjab", detail: "Punjab Civil Services" },
  { label: "PSSSB Senior Assistant", href: "/psssb-senior-assistant", group: "punjab", detail: "Senior Assistant recruitment" },
  { label: "PSSSB VDO / Gram Sevak", href: "/psssb-vdo", group: "punjab", detail: "Village Development Officer" },
  { label: "Punjab Jail Warder / Matron", href: "/punjab-jail-warder", group: "punjab", detail: "Jail Warder & Matron" },
  { label: "Punjab Police Intelligence Assistant", href: "/punjab-police-intelligence-assistant", group: "punjab", detail: "Intelligence Assistant" },
  { label: "PSPCL Assistant Lineman", href: "/pspcl-alm", group: "punjab", detail: "Assistant Lineman" },
  { label: "PSPCL Revenue Accountant", href: "/pspcl-revenue-accountant", group: "punjab", detail: "Revenue Accountant" },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const searchAliases: Record<string, string> = {
  "/ibps-rrb-po": "IBPS RRB PO",
  "/ibps-rrb-office-assistant": "IBPS RRB Clerk",
  "/punjab-police-si": "Punjab Police SI",
  "/punjab-pcs": "Punjab PCS PPSC PCS",
  "/pspcl-alm": "PSPCL ALM",
  "/ssc-gd": "SSC GD",
};

export default function ExamsCovered() {
  usePageMeta("Exams Covered", "Find your exam and explore ExamTree preparation across Punjab, SSC, Banking and regulatory exams.");
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<ExamGroup | "all">("all");
  const terms = normalize(query).split(" ").filter(Boolean);
  const matchingExams = exams.filter((exam) => {
    const family = groups.find((group) => group.key === exam.group);
    const text = normalize([exam.label, exam.detail, family?.label, searchAliases[exam.href] ?? ""].join(" "));
    return terms.every((term) => text.includes(term));
  });
  const visibleExams = matchingExams.filter((exam) => activeGroup === "all" || exam.group === activeGroup);
  const resetFilters = () => { setQuery(""); setActiveGroup("all"); };

  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-slate-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Exams covered</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Find your exam</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Explore mock tests and preparation for your next exam.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{exams.length} exam pages · {groups.length} categories</span>
        </div>
      </header>

      <div className="mb-7 space-y-4">
        <div className="relative">
          <label htmlFor="exam-search" className="sr-only">Search exams</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="exam-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your exam, e.g. PSSSB Clerk, SSC CGL, SBI PO"
            className="h-13 min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-base text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2" />
          {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><X aria-hidden="true" className="h-4 w-4" /></button>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by exam category">
          {[{ key: "all" as const, label: "All exams" }, ...groups.map((group) => ({ key: group.key, label: group.key === "punjab" ? "Punjab" : group.key === "ssc" ? "SSC" : "Banking" }))].map((group) => (
            <button key={group.key} type="button" aria-pressed={activeGroup === group.key} onClick={() => setActiveGroup(group.key)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${activeGroup === group.key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"}`}>
              {group.label}<span className={`rounded-full px-1.5 py-0.5 text-[11px] ${activeGroup === group.key ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"}`}>{matchingExams.filter((exam) => group.key === "all" || exam.group === group.key).length}</span>
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-slate-500">
          {visibleExams.length} {visibleExams.length === 1 ? "exam" : "exams"}{query.trim() ? ` matching “${query.trim()}”` : " to explore"}
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => {
          const items = visibleExams.filter((exam) => exam.group === group.key);
          if (!items.length) return null;
          return (
            <section key={group.key} aria-labelledby={`exam-group-${group.key}`}>
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden="true" className={`h-9 w-1 rounded-full ${group.accent}`} />
                <div>
                  <h2 id={`exam-group-${group.key}`} className="text-lg font-bold text-slate-900">{group.label} <span className="ml-1 text-sm font-medium text-slate-400">{items.length}</span></h2>
                  <p className="mt-0.5 text-xs text-slate-500">{group.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {items.map((exam) => (
                  <Link key={exam.href} href={exam.href} className="group flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="flex min-w-0 items-center gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1"><ExamIdentityIcon name={exam.label} familyCode={exam.group.toUpperCase()} /></span><h3 className="min-w-0 break-words text-[13px] font-semibold leading-[1.35] text-slate-900">{exam.label}</h3></div>
                    <span className="mt-auto flex items-center justify-between gap-2 pt-2.5 text-[11px] font-semibold text-teal-700">Explore exam<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 motion-reduce:transform-none" /></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
        {visibleExams.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <BookOpen aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">No exams found</h2>
            <p className="mt-2 text-sm text-slate-500">Try a shorter exam name or choose another category.</p>
            <button type="button" onClick={resetFilters} className="mt-5 min-h-11 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Show all exams</button>
          </div>
        )}
      </div>
      <p className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Open an exam page to see its preparation options and available tests.</p>
    </div>
  );
}
