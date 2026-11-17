import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Search, Sparkles } from "lucide-react";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

const topics = ["All topics", "Quantitative aptitude", "Reasoning", "General awareness", "English"];

export default function Blog() {
  const [, setLocation] = useLocation();
  const { tests, isLoading } = useExamCatalog();
  const [activeTopic, setActiveTopic] = useState("All topics");
  const [search, setSearch] = useState("");
  usePageMeta("Free Exam Practice & Study Guides", "Practice free questions and explore exam preparation guides for Punjab Police, PSSSB, SSC and banking exams.", { canonicalPath: "/blog" });

  const practiceTests = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return tests.filter((test) => {
      const text = `${test.name} ${test.category} ${test.subcategoryName ?? ""}`.toLocaleLowerCase();
      const matchesSearch = !query || text.includes(query);
      const matchesTopic = activeTopic === "All topics" || text.includes(activeTopic.split(" ")[0].toLocaleLowerCase());
      return matchesSearch && matchesTopic;
    }).slice(0, 6);
  }, [activeTopic, search, tests]);

  return (
    <div className="student-catalog">
      <PublicPage eyebrow="Free practice and study guides" title="Learn the topic. Practise with real questions." description="Short, focused preparation guides and free practice from Examtree’s published test catalogue. Choose an exam, try questions, and review your answers.">
        <section className="mb-8 rounded-3xl bg-[#103e31] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-lime-200"><Sparkles className="h-4 w-4"/>Your preparation starts here</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Small steps today.<br/>A stronger score tomorrow.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">Find practice for the exams you care about. Questions open in Examtree’s practice player, where you can answer and review solutions.</p>
              <label className="mt-6 flex max-w-xl items-center gap-3 rounded-xl bg-white p-2 pl-4 text-slate-600 shadow-lg">
                <Search className="h-5 w-5 shrink-0"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exams or practice tests" className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-slate-900 outline-none"/><button type="button" onClick={() => document.getElementById("practice-tests")?.scrollIntoView({ behavior: "smooth" })} className="rounded-lg bg-lime-200 px-4 py-3 text-sm font-bold text-emerald-950">Search</button>
              </label>
              <p className="mt-3 text-xs text-emerald-50/70">Popular: Punjab Police · PSSSB · SSC · Banking</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white p-5 text-slate-900 shadow-xl">
              <div className="flex items-center justify-between"><span className="rounded-full bg-lime-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Practice tip</span><BookOpen className="h-5 w-5 text-emerald-700"/></div>
              <h3 className="mt-5 text-lg font-bold">Study, then test yourself</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Try a short set, check every explanation, then revisit the questions you missed. Consistent practice helps you spot the topics that need more attention.</p>
              <button type="button" onClick={() => document.getElementById("practice-tests")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Find a practice set <ArrowRight className="h-4 w-4"/></button>
            </div>
          </div>
        </section>

        <section id="practice-tests" className="scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-emerald-700">Start practising</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">Choose a practice set</h2></div><p className="text-sm text-slate-500">Questions are served from Examtree’s published tests.</p></div>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{topics.map((topic) => <button key={topic} type="button" onClick={() => setActiveTopic(topic)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${activeTopic === topic ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{topic}</button>)}</div>
          {isLoading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading practice sets">{[1,2,3].map((item) => <div key={item} className="skeleton-shimmer h-40 rounded-2xl"/> )}</div> : practiceTests.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{practiceTests.map((test) => <button key={test.id} type="button" onClick={() => setLocation(`/test/${test.id}`)} className="flex min-h-44 flex-col rounded-2xl border border-slate-200 border-t-4 border-t-emerald-700 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-950">{test.name}</h3><p className="mt-1 text-xs text-slate-500">{test.category}{test.subcategoryName ? ` · ${test.subcategoryName}` : ""}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">{(test.access ?? "free") === "free" ? "Free" : "Premium"}</span></div><div className="mt-auto flex flex-wrap items-center gap-3 pt-5 text-xs text-slate-600"><span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5"/>{test.totalQuestions} questions</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{test.duration} min</span><span className="ml-auto inline-flex items-center gap-1 font-bold text-emerald-800">Practise <ArrowRight className="h-3.5 w-3.5"/></span></div></button>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-slate-400"/><h3 className="mt-3 font-bold text-slate-900">No matching practice sets</h3><p className="mt-1 text-sm text-slate-600">Try another exam name or clear the topic filter.</p><button type="button" onClick={() => { setSearch(""); setActiveTopic("All topics"); }} className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white">Show all sets</button></div>}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[{title:"Build your maths fundamentals",text:"Work through percentages, ratio, averages and other high value aptitude topics.",tag:"Quantitative aptitude"},{title:"Get sharper at reasoning",text:"Practise patterns, series, coding and other common reasoning question types.",tag:"Reasoning"},{title:"Revise with purpose",text:"Use focused question sets to revise general awareness and English for your exam.",tag:"Revision"}].map((guide) => <article key={guide.title} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-emerald-700">{guide.tag}</p><h3 className="mt-3 font-bold text-slate-950">{guide.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{guide.text}</p><button type="button" onClick={() => document.getElementById("practice-tests")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Explore practice <ArrowRight className="h-4 w-4"/></button></article>)}
        </section>
      </PublicPage>
    </div>
  );
}
