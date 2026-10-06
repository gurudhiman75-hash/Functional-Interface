import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, CalendarDays, BarChart3, Bell, Brain, Calculator, Clock3, FileText, Globe2, Languages, Loader2, Target } from "lucide-react";
import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import type { ExamHubFlatTest } from "@/components/ExamAcquisitionPages";
import { getExamAcquisitionConfig, examDetailsHref, examPreparationHref, examSyllabusHref, practiceTopicHref } from "@/lib/seo-practice";
import type { StudentSeriesSummary } from "@/lib/test-series";
import { examCountdown } from "@/lib/exam-countdown";
import "@/styles/ssc-exam-workspace.css";

type Stage = "prelims" | "mains" | "pyq";
type Format = "full-length" | "sectional" | "topic-wise";
export const SSC_WORKSPACE_SLUGS = ["ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-cpo", "ibps-po", "ibps-clerk", "ibps-rrb-po", "ibps-rrb-office-assistant", "psssb-clerk", "punjab-patwari"] as const;
type SSCExamSlug = typeof SSC_WORKSPACE_SLUGS[number];
const subtitles: Record<SSCExamSlug, string> = {
  "ssc-cgl": "Combined Graduate Level Examination",
  "ssc-chsl": "Combined Higher Secondary Level Examination",
  "ssc-mts": "Multi-Tasking Staff & Havaldar Examination",
  "ssc-cpo": "Sub-Inspector in Delhi Police & Central Armed Police Forces",
  "psssb-clerk": "ਕਲਰਕ / ਜੂਨੀਅਰ ਸਹਾਇਕ ਪ੍ਰੀਖਿਆ",
  "punjab-patwari": "ਪੰਜਾਬ ਪਟਵਾਰੀ ਪ੍ਰੀਖਿਆ",
  "ibps-po": "Probationary Officer / Management Trainee Examination",
  "ibps-clerk": "Customer Service Associate Examination",
  "ibps-rrb-po": "Regional Rural Banks · Officer Scale I",
  "ibps-rrb-office-assistant": "Regional Rural Banks · Office Assistant (Multipurpose)",
};
const formats: { id: Format; label: string }[] = [{ id: "full-length", label: "Full mocks" }, { id: "sectional", label: "Sectional" }, { id: "topic-wise", label: "Topic-wise" }];
const languageNames: Record<string, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };

export default function SSCExamWorkspace({ examSlug, tests, series, examDate, icon, signedIn, loading, unavailable, onRetry }: {
  examSlug: SSCExamSlug; series: StudentSeriesSummary[]; examDate?: string;
  tests: ExamHubFlatTest[]; icon?: string | null; signedIn: boolean; loading: boolean; unavailable: boolean; onRetry: () => void;
}) {
  const config = getExamAcquisitionConfig(examSlug)!;
  const isPunjab = config.categoryHref === "/category/punjab";
  const isSingle = isPunjab || config.testHub?.mode === "single";
  const isBanking = examSlug.startsWith("ibps-");
  const familyCode = isPunjab ? "PUNJAB" : isBanking ? "BANKING" : "SSC";
  const brand = isPunjab ? "PSSSB" : isBanking ? "IBPS" : "SSC";
  const stages: { id: Stage; label: string }[] = [
    { id: "prelims", label: isSingle ? "Test Series" : config.testHub?.stage1Label || (isBanking ? "Prelims" : "Tier I") },
    ...(isSingle ? [] : [{ id: "mains" as const, label: config.testHub?.stage2Label || (isBanking ? "Mains" : "Tier II") }]),
    { id: "pyq", label: "PYQs" },
  ];
  const examShortName = isPunjab ? (examSlug === "psssb-clerk" ? "CLERK" : "PATWARI") : ({ "ibps-po": "PO", "ibps-clerk": "CSA", "ibps-rrb-po": "RRB PO", "ibps-rrb-office-assistant": "RRB OA" } as Record<string, string>)[examSlug] || config.name.replace(/^SSC\s+/, "");
  const stageSummary = isSingle ? (isPunjab ? "ਟੈਸਟ ਸੀਰੀਜ਼ · ਵਿਸ਼ੇ ਅਨੁਸਾਰ ਅਭਿਆਸ" : config.testHub?.stage1Label || "CBE") : stages.slice(0, 2).map(item => item.label).join(" & ");
  const [view, setView] = useState<"tests" | "overview">("tests");
  const [stage, setStage] = useState<Stage>("prelims");
  const [format, setFormat] = useState<Format>("full-length");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60000); return () => window.clearInterval(timer); }, []);
  const countdown = examCountdown(examDate, now);
  const featured = series.find(item => item.learnerVisibility === "live");
  const languages = Array.from(new Set(tests.flatMap(item => item.languages ?? [])));
  const loginHref = "/login/student?next=" + encodeURIComponent("/" + examSlug);
  const filtered = tests.filter(test => stage === "pyq" ? test.type === "pyq" : test.stage === stage && test.type === format);
  const stageCount = (id: Stage) => tests.filter(test => id === "pyq" ? test.type === "pyq" : test.stage === id && test.type !== "pyq").length;
  const activeLabel = stages.find(item => item.id === stage)!.label;
  const formatLabel = formats.find(item => item.id === format)!.label;


  return <div className="ssc-workspace">
    <div className="ssc-workspace-inner">
      <nav className="ssc-breadcrumb" aria-label="Breadcrumb"><Link href={config.categoryHref}>{isPunjab ? "ਪੰਜਾਬ ਦੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ" : isBanking ? "Banking exams" : "SSC exams"}</Link><span>/</span><span>{config.name}</span></nav>
      <header className={"ssc-exam-header " + (signedIn ? "is-signed-in" : "")}>
        <div className="ssc-header-content">
          <div className="ssc-header-identity">
            <ExamIdentityIcon name={config.name} familyCode={familyCode} icon={icon ?? undefined} className="ssc-header-logo" />
            <div><p className="ssc-eyebrow">{isPunjab ? "ਪੰਜਾਬ ਅਧੀਨ ਸੇਵਾਵਾਂ ਚੋਣ ਬੋਰਡ" : isBanking ? "INSTITUTE OF BANKING PERSONNEL SELECTION" : "STAFF SELECTION COMMISSION"}</p><h1>{config.name} {config.isShell ? null : <span>{config.yearLabel}</span>}</h1><p className="ssc-exam-subtitle">{subtitles[examSlug]}</p></div>
          </div>
          <div className="ssc-header-features"><span><FileText /> {stageSummary}</span>{languages.length ? <span><Languages />{languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div>
        </div>
        <aside className="ssc-date-panel" aria-label="Exam date countdown"><CalendarDays /><div><p>EXAM DATE</p><strong>{countdown?.date || "Date to be announced"}</strong><a href={config.officialUrl} target="_blank" rel="noreferrer">Official {brand} updates <ArrowRight /></a></div>{countdown ? <div className="ssc-countdown"><strong>{countdown.days > 0 ? countdown.days : countdown.days === 0 ? "Today" : "Held"}</strong><span>{countdown.days > 0 ? "Days to go" : countdown.days === 0 ? "Exam day" : "Exam date passed"}</span></div> : null}</aside>
      </header>

      <div className="ssc-main-switch" role="tablist" aria-label={config.name + " page view"}>
        <button type="button" role="tab" id="ssc-tests-tab" aria-controls="ssc-tests-panel" aria-selected={view === "tests"} onClick={() => setView("tests")}><FileText />Test Series</button>
        <button type="button" role="tab" id="ssc-overview-tab" aria-controls="ssc-overview-panel" aria-selected={view === "overview"} onClick={() => setView("overview")}><BookOpen />Overview</button>
        <a href={config.officialUrl} target="_blank" rel="noreferrer"><Globe2 />Official website <ArrowRight /></a>
      </div>

      {view === "tests" ? <section id="ssc-tests-panel" role="tabpanel" aria-labelledby="ssc-tests-tab" className="ssc-tests-panel">
        <div className="ssc-catalog-layout"><div className="ssc-catalog-main">
        <section className="ssc-featured-series" aria-label="Featured test series"><div className={"ssc-series-art" + ((examSlug.startsWith("ibps-rrb-") || isPunjab) ? " ssc-series-art-compact" : "")} aria-hidden="true"><span>{isPunjab ? "ਪੰਜਾਬ ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆਵਾਂ" : "TARGET " + config.yearLabel}</span><strong>{brand}<br /><em>{examShortName}</em></strong><div className="ssc-paper-stack"><FileText /></div><small>PRACTISE · ANALYSE · IMPROVE</small></div><div className="ssc-series-content"><span className="ssc-featured-label">{featured ? "FEATURED" : "TEST SERIES"}</span><h2>{featured?.name || config.name + " Test Series"}</h2><p>{featured?.description || "Full mocks, sectional tests and topic practice."}</p>{loading ? <p role="status">Loading catalogue…</p> : unavailable ? <p>Catalogue temporarily unavailable</p> : featured ? <p className="ssc-series-count"><FileText /> {featured.liveTestCount} published tests</p> : <p className="ssc-series-count"><FileText /> {tests.length ? tests.length + " published tests" : "Tests are being prepared"}</p>}{featured ? <Link href={"/test-series/" + encodeURIComponent(featured.id)}>Explore series <ArrowRight /></Link> : <button type="button" onClick={() => document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"})}>Explore practice <ArrowRight /></button>}</div></section>
        <div className="ssc-practice-card" id="ssc-practice">
        <div className="ssc-section-heading"><div><h2>{isPunjab ? "ਆਪਣੇ ਢੰਗ ਨਾਲ ਅਭਿਆਸ ਕਰੋ" : "Practice your way"}</h2></div>{!loading && !unavailable ? <span className="ssc-published-count">{tests.length} published {tests.length === 1 ? "test" : "tests"}</span> : null}</div>
        <div className="ssc-stage-tabs" role="tablist" aria-label={config.name + " exam stage"}>{stages.map(item => <button key={item.id} type="button" role="tab" aria-selected={stage === item.id} onClick={() => setStage(item.id)}><span>{item.label}</span>{!loading && !unavailable ? <span className="ssc-tab-count">{stageCount(item.id)}</span> : null}</button>)}</div>
        {stage !== "pyq" ? <div className="ssc-format-tabs" role="tablist" aria-label={activeLabel + " test format"}>{formats.map(item => <button key={item.id} type="button" role="tab" aria-selected={format === item.id} onClick={() => setFormat(item.id)}>{item.label}{!loading && !unavailable ? <span>{tests.filter(test => test.stage === stage && test.type === item.id).length}</span> : null}</button>)}</div> : null}
        <div className="ssc-test-list-heading"><h3>{stage === "pyq" ? "Previous year papers" : activeLabel + " · " + formatLabel}</h3>{!loading && !unavailable ? <span>{filtered.length} available</span> : null}</div>
        {loading ? <div className="ssc-empty-state" role="status"><Loader2 className="animate-spin" /><h3>Loading published tests…</h3></div> : unavailable ? <div className="ssc-empty-state" role="alert"><FileText /><h3>The test catalogue is temporarily unavailable.</h3><p>Your syllabus and preparation resources are still available.</p><button type="button" onClick={onRetry}>Try again</button></div> : filtered.length ? <div className="ssc-test-list">{filtered.map(test => <article key={test.id} className="ssc-test-row">
          <div className="ssc-test-row-main"><ExamIdentityIcon name={config.name} familyCode={familyCode} icon={test.iconUrl ?? undefined} className="ssc-test-logo" /><div><div className="ssc-test-title"><h3>{test.title}</h3>{test.access ? <span className={"ssc-access " + test.access}>{test.access === "free" ? "Free" : "Paid"}</span> : null}</div><p>{test.description}</p><div className="ssc-test-meta"><span><FileText />{test.questionCount} questions</span><span><Clock3 />{test.durationMinutes} min</span>{test.totalMarks > 0 ? <span>{test.totalMarks} marks</span> : null}{test.languages?.length ? <span><Languages />{test.languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div></div></div>
          <Link href={signedIn ? test.href : "/login/student?next=" + encodeURIComponent(test.href)} className="ssc-test-action">{signedIn ? test.access === "paid" ? "View test" : "Start test" : "Sign in to attempt"}<ArrowRight /></Link>
        </article>)}</div> : <div className="ssc-empty-state"><span className="ssc-empty-icon"><FileText /></span><p className="ssc-eyebrow">YOUR PREPARATION CAN START HERE</p><h3>{stage === "pyq" ? "No previous year papers published yet." : "No " + activeLabel + " " + formatLabel.toLowerCase() + " published yet."}</h3><p>Meanwhile, explore the syllabus, make your study plan or try topic practice.</p><div className="ssc-empty-links"><Link href={examSyllabusHref(examSlug)}>Explore syllabus <ArrowRight /></Link>{config.topics[0] ? <Link href={practiceTopicHref(config.topics[0].slug,examSlug)}>Try topic practice <ArrowRight /></Link> : null}</div></div>}
        </div></div>
        <aside className="ssc-toolkit"><section><h2>{isPunjab ? "ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Preparation Toolkit"}</h2>{[{icon:BookOpen,title:"Syllabus & pattern",text:"Subject coverage and exam structure",href:examSyllabusHref(examSlug)},{icon:FileText,title:"Previous year papers",text:"Browse published previous-year practice",href:"#ssc-practice",pyq:true},{icon:Target,title:"Preparation guide",text:"Study plan and practice resources",href:examPreparationHref(examSlug)},{icon:Bell,title:"Exam updates",text:"Official notices and important dates",href:examDetailsHref(examSlug,"updates")}].map(({icon:Icon,...item}) => item.pyq ? <button type="button" key={item.title} onClick={() => {setStage("pyq");document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"});}}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></button> : <Link key={item.title} href={item.href}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></Link>)}</section><section className="ssc-review-card"><p>MAKE EVERY ATTEMPT COUNT</p><h2>Start strong.<br /><span>Review smarter.</span></h2><p>Review mistakes and use your results to plan your next practice session.</p><BarChart3 aria-hidden="true" />{!signedIn ? <Link href={loginHref}>Sign in to save your progress <ArrowRight /></Link> : null}</section></aside>
        </div>
        <section className="ssc-subject-section"><h2>{isPunjab ? "ਤਿਆਰੀ ਦੇ ਸਰੋਤ" : "Know the exam"}</h2><div>{(isPunjab ? [{icon:BookOpen,name:"ਅਧਿਕਾਰਤ ਸਿਲੇਬਸ"},{icon:Target,name:"ਤਿਆਰੀ ਦੀ ਯੋਜਨਾ"},{icon:Bell,name:"ਪ੍ਰੀਖਿਆ ਅੱਪਡੇਟ"}] : isBanking ? [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:examSlug.startsWith("ibps-rrb-") ? "Language" : "English"},{icon:Globe2,name:"Banking & Financial Awareness"},...(examSlug.startsWith("ibps-rrb-") ? [{icon:FileText,name:"Computer Knowledge"}] : [])] : [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:"English"},{icon:Globe2,name:"General Awareness"}]).map(({icon:Icon,name}) => <Link key={name} href={isPunjab && Icon === Target ? examPreparationHref(examSlug) : isPunjab && Icon === Bell ? examDetailsHref(examSlug,"updates") : examSyllabusHref(examSlug)}><span><Icon /></span><div><h3>{name}</h3><p>{isPunjab ? "ਜਾਣਕਾਰੀ ਅਤੇ ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Syllabus and topic coverage"}</p></div><ArrowRight /></Link>)}</div></section>
      </section> : <section id="ssc-overview-panel" role="tabpanel" aria-labelledby="ssc-overview-tab" className="ssc-overview-panel">
        <div className="ssc-section-heading"><div><p className="ssc-eyebrow">KNOW YOUR EXAM</p><h2>Prepare with a clear plan.</h2><p>{isPunjab ? "ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਕਰੋ, ਗ਼ਲਤੀਆਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਆਪਣੀ ਤਿਆਰੀ ਨੂੰ ਅੱਗੇ ਵਧਾਓ।" : config.hub.preparationSummary}</p></div><Link href={examDetailsHref(examSlug)}>Full exam details <ArrowRight /></Link></div>
        <section className="ssc-overview-section"><h3>Syllabus at a glance</h3>{config.isShell ? <p>Verified syllabus and exam pattern are being prepared. Check the official PSSSB notification for current requirements.</p> : null}<div className="ssc-syllabus-grid">{config.syllabus.sections.map(item => <article key={item.title}><BookOpen /><h4>{item.title}</h4><p>{item.summary}</p></article>)}</div><Link href={examSyllabusHref(examSlug)}>Open syllabus & exam pattern <ArrowRight /></Link></section>
        <section className="ssc-overview-section"><h3>Your preparation route</h3><div className="ssc-prep-grid">{(isPunjab ? [{title:"ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ",text:"ਹਰ ਰੋਜ਼ ਇੱਕ ਛੋਟਾ ਅਭਿਆਸ ਸੈੱਟ ਹੱਲ ਕਰੋ ਅਤੇ ਔਖੇ ਸਵਾਲਾਂ ਨੂੰ ਮੁੜ ਸਮਝੋ।"},{title:"ਗ਼ਲਤੀਆਂ ਤੋਂ ਸਿੱਖੋ",text:"ਗ਼ਲਤ ਜਵਾਬਾਂ ਦਾ ਕਾਰਨ ਲਿਖੋ ਅਤੇ ਕਮਜ਼ੋਰ ਵਿਸ਼ਿਆਂ ਨੂੰ ਦੁਹਰਾਓ।"},{title:"ਸਮਾਂ ਸੰਭਾਲੋ",text:"ਸਮੇਂ ਦੀ ਸੀਮਾ ਵਿੱਚ ਅਭਿਆਸ ਕਰੋ। ਪ੍ਰੀਖਿਆ ਦਾ ਢਾਂਚਾ ਅਤੇ ਨਿਯਮ ਅਧਿਕਾਰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਤੋਂ ਵੇਖੋ।"}] : config.preparation.cards).map((item,index) => <article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h4>{item.title.replace(/^\d+\.\s*/,"")}</h4><p>{item.text}</p></article>)}</div><Link href={examPreparationHref(examSlug)}>Read preparation guide <ArrowRight /></Link></section>
        <section className="ssc-official-note"><Globe2 /><div><h3>Stay up to date</h3><p>Check {brand}’s official notices for dates, vacancies, eligibility and changes to the exam scheme.</p><a href={config.officialUrl} target="_blank" rel="noreferrer">Visit {config.officialLabel} <ArrowRight /></a></div></section>
      </section>}
    </div>
  </div>;
}
