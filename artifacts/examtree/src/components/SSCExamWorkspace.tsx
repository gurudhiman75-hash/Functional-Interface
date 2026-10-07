import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, CalendarDays, BarChart3, Bell, Brain, Calculator, Clock3, FileText, Globe2, Languages, Loader2, Target } from "lucide-react";
import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import type { ExamHubFlatTest } from "@/components/ExamAcquisitionPages";
import { getExamAcquisitionConfig, examDetailsHref, examPreparationHref, examSyllabusHref, practiceTopicHref } from "@/lib/seo-practice";
import type { StudentSeriesSummary } from "@/lib/test-series";
import { examCountdown } from "@/lib/exam-countdown";
import "@/styles/ssc-exam-workspace.css";
import "@/styles/ssc-cgl-reference.css";
import "@/styles/punjab-clerk-reference.css";

type Stage = "prelims" | "mains" | "pyq";
type Format = "full-length" | "sectional" | "topic-wise";
export const SSC_WORKSPACE_SLUGS = ["ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-cpo", "ssc-gd", "ssc-stenographer", "ssc-selection-post", "ssc-je", "ibps-po", "ibps-clerk", "ibps-rrb-po", "ibps-rrb-office-assistant", "psssb-clerk", "punjab-patwari", "punjab-police-constable", "punjab-police-si", "punjab-pcs"] as const;
type SSCExamSlug = typeof SSC_WORKSPACE_SLUGS[number];
const subtitles: Record<SSCExamSlug, string> = {
  "ssc-cgl": "Combined Graduate Level Examination",
  "ssc-chsl": "Combined Higher Secondary Level Examination",
  "ssc-mts": "Multi-Tasking Staff & Havaldar Examination",
  "ssc-cpo": "Sub-Inspector in Delhi Police & Central Armed Police Forces",
  "ssc-gd": "Constable (GD) Examination",
  "ssc-stenographer": "Stenographer Grade C & D Examination",
  "ssc-selection-post": "Selection Post Examination",
  "ssc-je": "Junior Engineer Examination",
  "psssb-clerk": "ਕਲਰਕ ਪ੍ਰੀਖਿਆ",
  "punjab-patwari": "ਪੰਜਾਬ ਪਟਵਾਰੀ ਪ੍ਰੀਖਿਆ",
  "punjab-police-constable": "ਪੰਜਾਬ ਪੁਲਿਸ ਕਾਂਸਟੇਬਲ ਪ੍ਰੀਖਿਆ",
  "punjab-police-si": "ਪੰਜਾਬ ਪੁਲਿਸ ਸਬ-ਇੰਸਪੈਕਟਰ ਪ੍ਰੀਖਿਆ",
  "punjab-pcs": "ਪੰਜਾਬ ਰਾਜ ਸਿਵਲ ਸੇਵਾਵਾਂ ਪ੍ਰੀਖਿਆ",
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
  const isSingle = (isPunjab && examSlug !== "punjab-pcs") || config.testHub?.mode === "single";
  const isPolice = examSlug.startsWith("punjab-police-");
  const authority = isPolice ? "Punjab Police" : examSlug === "punjab-pcs" ? "PPSC" : isPunjab ? "PSSSB" : examSlug.startsWith("ibps-") ? "IBPS" : "SSC";
  const isBanking = examSlug.startsWith("ibps-");
  const familyCode = isPunjab ? "PUNJAB" : isBanking ? "BANKING" : "SSC";
  const brand = isPolice ? "POLICE" : authority;
  const stages: { id: Stage; label: string }[] = [
    { id: "prelims", label: isSingle ? "Test Series" : config.testHub?.stage1Label || (isBanking || examSlug === "punjab-pcs" ? "Prelims" : "Tier I") },
    ...(isSingle ? [] : [{ id: "mains" as const, label: config.testHub?.stage2Label || (isBanking || examSlug === "punjab-pcs" ? "Mains" : "Tier II") }]),
    { id: "pyq", label: "PYQs" },
  ];
  const examShortName = isPunjab ? ({ "psssb-clerk": "CLERK", "punjab-patwari": "PATWARI", "punjab-police-constable": "CONSTABLE", "punjab-police-si": "SI", "punjab-pcs": "PCS" } as Record<string, string>)[examSlug] : ({ "ibps-po": "PO", "ibps-clerk": "CSA", "ibps-rrb-po": "RRB PO", "ibps-rrb-office-assistant": "RRB OA" } as Record<string, string>)[examSlug] || config.name.replace(/^SSC\s+/, "");
  const stageSummary = isSingle ? (isPunjab ? "ਟੈਸਟ ਸੀਰੀਜ਼ · ਵਿਸ਼ੇ ਅਨੁਸਾਰ ਅਭਿਆਸ" : config.testHub?.stage1Label || "CBE") : stages.slice(0, 2).map(item => item.label).join(" & ");
  const [view, setView] = useState<"tests" | "overview">("tests");
  const [stage, setStage] = useState<Stage>("prelims");
  const [format, setFormat] = useState<Format>("full-length");
  useEffect(() => { setStage("prelims"); setFormat("full-length"); setView("tests"); }, [examSlug]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60000); return () => window.clearInterval(timer); }, []);
  const countdown = examCountdown(examDate, now);
  const featured = series.find(item => item.learnerVisibility === "live");
  const testLanguages = Array.from(new Set(tests.flatMap(item => item.languages ?? [])));
  const isSscFamily = examSlug.startsWith("ssc-");
  const isPunjabClerk = examSlug === "psssb-clerk";
  const languages = testLanguages.length ? testLanguages : isSscFamily ? ["en", "hi"] : isPunjabClerk ? ["pa", "en"] : [];
  const loginHref = "/login/student?next=" + encodeURIComponent("/" + examSlug);
  const filtered = tests.filter(test => stage === "pyq" ? test.type === "pyq" : (isSingle || test.stage === stage) && test.type === format);
  const stageCount = (id: Stage) => tests.filter(test => id === "pyq" ? test.type === "pyq" : (isSingle || test.stage === id) && test.type !== "pyq").length;
  const activeLabel = stages.find(item => item.id === stage)!.label;
  const formatLabel = formats.find(item => item.id === format)!.label;


  return <div className={"ssc-workspace" + (isSscFamily ? " ssc-reference" : "") + (isPunjabClerk ? " punjab-clerk-reference" : "")}>
    <div className="ssc-workspace-inner">
      <nav className="ssc-breadcrumb" aria-label="Breadcrumb"><Link href={config.categoryHref}>{isPunjab ? "ਪੰਜਾਬ ਦੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ" : isBanking ? "Banking exams" : "SSC exams"}</Link><span>/</span><span>{config.name}</span></nav>
      <header className={"ssc-exam-header " + (signedIn ? "is-signed-in" : "")}>
        <div className="ssc-header-content">
          <div className="ssc-header-identity">
            <ExamIdentityIcon name={config.name} familyCode={familyCode} icon={icon ?? undefined} className="ssc-header-logo" />
            <div><p className="ssc-eyebrow">{isPunjab ? (isPolice ? "ਪੰਜਾਬ ਪੁਲਿਸ" : examSlug === "punjab-pcs" ? "ਪੰਜਾਬ ਲੋਕ ਸੇਵਾ ਕਮਿਸ਼ਨ" : "ਪੰਜਾਬ ਅਧੀਨ ਸੇਵਾਵਾਂ ਚੋਣ ਬੋਰਡ") : isBanking ? "INSTITUTE OF BANKING PERSONNEL SELECTION" : "STAFF SELECTION COMMISSION"}</p><h1>{config.name} {config.isShell ? null : <span>{config.yearLabel}</span>}</h1><p className="ssc-exam-subtitle">{subtitles[examSlug]}</p></div>
          </div>
          <div className="ssc-header-features"><span><FileText /> {stageSummary}</span>{languages.length ? <span><Languages />{languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div>
        </div>
        <aside className="ssc-date-panel" aria-label="Exam date countdown"><CalendarDays /><div><p>EXAM DATE</p><strong>{countdown?.date || (isPunjab && !config.isShell ? "Date not verified" : "Date to be announced")}</strong><a href={config.officialUrl} target="_blank" rel="noreferrer">Official {authority} updates <ArrowRight /></a></div>{countdown ? <div className="ssc-countdown"><strong>{countdown.days > 0 ? countdown.days : countdown.days === 0 ? "Today" : "Held"}</strong><span>{countdown.days > 0 ? "Days to go" : countdown.days === 0 ? "Exam day" : "Exam date passed"}</span></div> : isSscFamily ? <div className="ssc-countdown"><strong>—</strong><span>Awaiting date</span></div> : null}</aside>
      </header>

      <div className="ssc-main-switch" role="tablist" aria-label={config.name + " page view"}>
        <button type="button" role="tab" id="ssc-tests-tab" aria-controls="ssc-tests-panel" aria-selected={view === "tests"} onClick={() => setView("tests")}><FileText />Test Series</button>
        <button type="button" role="tab" id="ssc-overview-tab" aria-controls="ssc-overview-panel" aria-selected={view === "overview"} onClick={() => setView("overview")}><BookOpen />Overview</button>
        <a href={config.officialUrl} target="_blank" rel="noreferrer"><Globe2 />Official website <ArrowRight /></a>
      </div>

      {view === "tests" ? <section id="ssc-tests-panel" role="tabpanel" aria-labelledby="ssc-tests-tab" className="ssc-tests-panel">
        <div className="ssc-catalog-layout"><div className="ssc-catalog-main">
        <section className="ssc-featured-series" aria-label="Featured test series"><div className={"ssc-series-art" + ((examSlug.startsWith("ibps-rrb-") || isPunjab) ? " ssc-series-art-compact" : "")} aria-hidden="true"><span>{isPunjab ? "ਪੰਜਾਬ ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆਵਾਂ" : "TARGET " + config.yearLabel}</span><strong>{brand}<br /><em>{examShortName}</em></strong>{isSscFamily ? <SSCReferenceArtwork name={config.name} /> : isPunjabClerk ? <PunjabClerkArtwork /> : null}<div className="ssc-series-seal"><ExamIdentityIcon name={config.name} familyCode={familyCode} icon={icon ?? undefined} /></div><small>PRACTISE · ANALYSE · IMPROVE</small></div><div className="ssc-series-content"><span className="ssc-featured-label">{featured ? "FEATURED" : "TEST SERIES"}</span><h2>{featured?.name || (isSscFamily ? "Complete Test Series" : isPunjabClerk ? "Punjab Clerk Complete Test Series" : config.name + " Test Series")}</h2><p>{featured?.description || "Full mocks, sectional tests and topic practice."}</p><div className="ssc-series-features"><span><Clock3 />Timed practice</span><span><Target />Focused revision</span><span><BarChart3 />Review attempts</span></div>{loading ? <p role="status">Loading catalogue…</p> : unavailable ? <p>Catalogue temporarily unavailable</p> : featured ? <p className="ssc-series-count"><FileText /> {featured.liveTestCount} published tests</p> : <p className="ssc-series-count"><FileText /> {tests.length ? tests.length + " published tests" : "Tests are being prepared"}</p>}{featured ? <Link href={"/test-series/" + encodeURIComponent(featured.id)}>Explore series <ArrowRight /></Link> : <button type="button" onClick={() => document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"})}>Explore practice <ArrowRight /></button>}</div></section>
        <div className="ssc-practice-card" id="ssc-practice">
        <div className="ssc-section-heading"><div><h2>{isPunjab ? "ਆਪਣੇ ਢੰਗ ਨਾਲ ਅਭਿਆਸ ਕਰੋ" : "Practice your way"}</h2></div>{!loading && !unavailable ? <span className="ssc-published-count">{tests.length} published {tests.length === 1 ? "test" : "tests"}</span> : null}</div>
        <div className="ssc-stage-tabs" role="tablist" aria-label={config.name + " exam stage"}>{stages.map(item => <button key={item.id} type="button" role="tab" aria-selected={stage === item.id} onClick={() => setStage(item.id)}><span>{item.label}</span>{!loading && !unavailable ? <span className="ssc-tab-count">{stageCount(item.id)}</span> : null}</button>)}</div>
        {stage !== "pyq" ? <div className="ssc-format-tabs" role="tablist" aria-label={activeLabel + " test format"}>{formats.map(item => <button key={item.id} type="button" role="tab" aria-selected={format === item.id} onClick={() => setFormat(item.id)}>{item.label}{!loading && !unavailable ? <span>{tests.filter(test => (isSingle || test.stage === stage) && test.type === item.id).length}</span> : null}</button>)}</div> : null}
        <div className="ssc-test-list-heading"><h3>{stage === "pyq" ? "Previous year papers" : activeLabel + " · " + formatLabel}</h3>{!loading && !unavailable ? <span>{filtered.length} available</span> : null}</div>
        {loading ? <div className="ssc-empty-state" role="status"><Loader2 className="animate-spin" /><h3>Loading published tests…</h3></div> : unavailable ? <div className="ssc-empty-state" role="alert"><FileText /><h3>The test catalogue is temporarily unavailable.</h3><p>Your syllabus and preparation resources are still available.</p><button type="button" onClick={onRetry}>Try again</button></div> : filtered.length ? <div className="ssc-test-list">{filtered.map(test => <article key={test.id} className="ssc-test-row">
          <div className="ssc-test-row-main"><ExamIdentityIcon name={config.name} familyCode={familyCode} icon={test.iconUrl ?? undefined} className="ssc-test-logo" /><div><div className="ssc-test-title"><h3>{test.title}</h3>{test.access ? <span className={"ssc-access " + test.access}>{test.access === "free" ? "Free" : "Paid"}</span> : null}</div><p>{test.description}</p><div className="ssc-test-meta"><span className="ssc-test-format">{test.type === "pyq" ? "PYQ" : test.type === "sectional" ? "Sectional" : test.type === "topic-wise" ? "Topic practice" : "Full mock"}</span><span><FileText />{test.questionCount} questions</span><span><Clock3 />{test.durationMinutes} min</span>{test.totalMarks > 0 ? <span><Target />{test.totalMarks} marks</span> : null}{test.languages?.length ? <span><Languages />{test.languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div></div></div>
          <Link href={signedIn ? test.href : "/login/student?next=" + encodeURIComponent(test.href)} className="ssc-test-action">{signedIn ? test.access === "paid" ? "View test" : "Start test" : "Sign in to attempt"}<ArrowRight /></Link>
        </article>)}</div> : <div className="ssc-empty-state"><span className="ssc-empty-icon"><FileText /></span><p className="ssc-eyebrow">YOUR PREPARATION CAN START HERE</p><h3>{stage === "pyq" ? "No previous year papers published yet." : "No " + activeLabel + " " + formatLabel.toLowerCase() + " published yet."}</h3><p>Meanwhile, explore the syllabus, make your study plan or try topic practice.</p><div className="ssc-empty-links"><Link href={examSyllabusHref(examSlug)}>Explore syllabus <ArrowRight /></Link>{config.topics[0] ? <Link href={practiceTopicHref(config.topics[0].slug,examSlug)}>Try topic practice <ArrowRight /></Link> : null}</div></div>}
        </div></div>
        <aside className="ssc-toolkit"><section><h2>{isPunjab ? "ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Preparation Toolkit"}</h2>{[{icon:BookOpen,title:"Syllabus & pattern",text:"Subject coverage and exam structure",href:examSyllabusHref(examSlug)},{icon:FileText,title:"Previous year papers",text:"Browse published previous-year practice",href:"#ssc-practice",pyq:true},{icon:Target,title:"Preparation guide",text:"Study plan and practice resources",href:examPreparationHref(examSlug)},{icon:Bell,title:"Exam updates",text:"Official notices and important dates",href:examDetailsHref(examSlug,"updates")}].map(({icon:Icon,...item}) => item.pyq ? <button type="button" key={item.title} onClick={() => {setStage("pyq");document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"});}}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></button> : <Link key={item.title} href={item.href}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></Link>)}</section><section className="ssc-review-card"><p>MAKE EVERY ATTEMPT COUNT</p><h2>Start strong.<br /><span>Review smarter.</span></h2><p>Review mistakes and use your results to plan your next practice session.</p>{isSscFamily ? <SSCReferenceChart /> : isPunjabClerk ? <PunjabClerkChart /> : <BarChart3 aria-hidden="true" />}{!signedIn ? <Link href={loginHref}>Sign in to save your progress <ArrowRight /></Link> : null}</section></aside>
        </div>
        <section className="ssc-subject-section"><h2>{isPunjab ? "ਤਿਆਰੀ ਦੇ ਸਰੋਤ" : "Know the exam"}</h2><div>{(isPunjabClerk ? [{icon:Languages,name:"ਪੰਜਾਬੀ / Punjabi"},{icon:Globe2,name:"Punjab GK"},{icon:Brain,name:"Reasoning & Numerical"},{icon:FileText,name:"Typing Practice"}] : isPunjab ? [{icon:BookOpen,name:"ਅਧਿਕਾਰਤ ਸਿਲੇਬਸ"},{icon:Target,name:"ਤਿਆਰੀ ਦੀ ਯੋਜਨਾ"},{icon:Bell,name:"ਪ੍ਰੀਖਿਆ ਅੱਪਡੇਟ"}] : isBanking ? [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:examSlug.startsWith("ibps-rrb-") ? "Language" : "English"},{icon:Globe2,name:"Banking & Financial Awareness"},...(examSlug.startsWith("ibps-rrb-") ? [{icon:FileText,name:"Computer Knowledge"}] : [])] : [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:"English"},{icon:Globe2,name:"General Awareness"}]).map(({icon:Icon,name}) => <Link key={name} href={isPunjab && Icon === Target ? examPreparationHref(examSlug) : isPunjab && Icon === Bell ? examDetailsHref(examSlug,"updates") : examSyllabusHref(examSlug)}><span><Icon /></span><div><h3>{name}</h3><p>{isPunjabClerk ? (name === "Typing Practice" ? "English + Punjabi typing readiness" : "Clerk syllabus and practice coverage") : isPunjab ? "ਜਾਣਕਾਰੀ ਅਤੇ ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Syllabus and topic coverage"}</p></div><ArrowRight /></Link>)}</div></section>
      </section> : <section id="ssc-overview-panel" role="tabpanel" aria-labelledby="ssc-overview-tab" className="ssc-overview-panel">
        <div className="ssc-section-heading"><div><p className="ssc-eyebrow">KNOW YOUR EXAM</p><h2>Prepare with a clear plan.</h2><p>{isPunjab && config.isShell ? "ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਕਰੋ, ਗ਼ਲਤੀਆਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਆਪਣੀ ਤਿਆਰੀ ਨੂੰ ਅੱਗੇ ਵਧਾਓ।" : config.hub.preparationSummary}</p></div><Link href={examDetailsHref(examSlug)}>Full exam details <ArrowRight /></Link></div>
        <section className="ssc-overview-section"><h3>Syllabus at a glance</h3>{!config.isShell && isPunjab ? <p>{config.syllabus.description}</p> : null}{config.isShell ? <p>Verified syllabus and exam pattern are being prepared. Check the official {authority} notification for current requirements.</p> : null}<div className="ssc-syllabus-grid">{config.syllabus.sections.map(item => <article key={item.title}><BookOpen /><h4>{item.title}</h4><p>{item.summary}</p></article>)}</div><Link href={examSyllabusHref(examSlug)}>Open syllabus & exam pattern <ArrowRight /></Link></section>
        <section className="ssc-overview-section"><h3>Your preparation route</h3><div className="ssc-prep-grid">{(isPunjab && !config.preparation.cards.length ? [{title:"ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ",text:"ਹਰ ਰੋਜ਼ ਇੱਕ ਛੋਟਾ ਅਭਿਆਸ ਸੈੱਟ ਹੱਲ ਕਰੋ ਅਤੇ ਔਖੇ ਸਵਾਲਾਂ ਨੂੰ ਮੁੜ ਸਮਝੋ।"},{title:"ਗ਼ਲਤੀਆਂ ਤੋਂ ਸਿੱਖੋ",text:"ਗ਼ਲਤ ਜਵਾਬਾਂ ਦਾ ਕਾਰਨ ਲਿਖੋ ਅਤੇ ਕਮਜ਼ੋਰ ਵਿਸ਼ਿਆਂ ਨੂੰ ਦੁਹਰਾਓ।"},{title:"ਸਮਾਂ ਸੰਭਾਲੋ",text:"ਸਮੇਂ ਦੀ ਸੀਮਾ ਵਿੱਚ ਅਭਿਆਸ ਕਰੋ। ਪ੍ਰੀਖਿਆ ਦਾ ਢਾਂਚਾ ਅਤੇ ਨਿਯਮ ਅਧਿਕਾਰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਤੋਂ ਵੇਖੋ।"}] : config.preparation.cards).map((item,index) => <article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h4>{item.title.replace(/^\d+\.\s*/,"")}</h4><p>{item.text}</p></article>)}</div><Link href={examPreparationHref(examSlug)}>Read preparation guide <ArrowRight /></Link></section>
        {!config.isShell && isPunjab ? <section className="ssc-overview-section"><h3>Paper structure &amp; source notes</h3><div className="ssc-prep-grid">{config.syllabus.patternCards.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div><p>{config.syllabus.verificationNote}</p><Link href={examDetailsHref(examSlug,"updates")}>Read source documents <ArrowRight /></Link></section> : null}<section className="ssc-official-note"><Globe2 /><div><h3>Stay up to date</h3><p>Check {authority}’s official notices for dates, vacancies, eligibility and changes to the exam scheme.</p><a href={config.officialUrl} target="_blank" rel="noreferrer">Visit {config.officialLabel} <ArrowRight /></a></div></section>
      </section>}
    </div>
  </div>;
}

/** Paper artwork and chart from the approved indigo storefront concept. */
function SSCReferenceArtwork({ name }: { name: string }) {
  return <svg className="ssc-reference-artwork" viewBox="0 0 300 280" aria-hidden="true">
    <defs><linearGradient id="ssc-paper-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#e9eafa" /></linearGradient><linearGradient id="ssc-fold-fill"><stop stopColor="#636abd" /><stop offset="1" stopColor="#b6bbf7" /></linearGradient><filter id="ssc-paper-shadow" x="-40%" y="-40%" width="190%" height="190%"><feDropShadow dx="3" dy="7" stdDeviation="5" floodColor="#101524" floodOpacity=".35" /></filter></defs>
    <path d="M170 0H300V280H34L118 213 62 122Z" fill="url(#ssc-fold-fill)" opacity=".8" />
    <path d="m219 0 81 61-50 44 50 100-92 75-78-56 73-69-66-76Z" fill="#9aa2ed" opacity=".56" />
    <g transform="translate(67 56) rotate(-18 104 96)" filter="url(#ssc-paper-shadow)">
      <rect x="-15" y="28" width="157" height="196" rx="3" fill="#747dcc" />
      <rect x="5" y="15" width="157" height="196" rx="3" fill="#bcc4ee" />
      <g transform="translate(62 27) rotate(-15 72 97)"><rect width="145" height="194" rx="3" fill="#edf0fc" /><path d="M17 34h104M17 46h87M17 61h107M17 79h107M17 96h95M17 114h110M17 132h103M17 150h109M17 168h92" stroke="#bcc6e6" strokeWidth="4" /></g>
      <rect x="19" y="0" width="143" height="198" rx="3" fill="url(#ssc-paper-fill)" />
      <text x="36" y="28" fontSize={name.length > 15 ? "11" : name.length > 10 ? "13" : "16"} fontWeight="800" fill="#151b30">{name}</text>
      <path d="M35 40h109M35 50h99M35 60h105" stroke="#a8afe2" strokeWidth="3" />
      {[0,1,2,3,4,5].map(n=><g key={n} transform={`translate(0 ${n*18})`}><path d="M35 80h45M35 86h26" stroke="#a8afe2" strokeWidth="2.8" /><circle cx="103" cy="81" r="3.2" fill="none" stroke="#555ac0" strokeWidth="1.5" /><circle cx="124" cy="81" r="3.2" fill="none" stroke="#555ac0" strokeWidth="1.5" /></g>)}
    </g>
  </svg>;
}
function PunjabClerkArtwork() {
  return <svg className="punjab-clerk-artwork" viewBox="0 0 360 250" aria-hidden="true">
    <defs>
      <linearGradient id="pc-paper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffdf7"/><stop offset="1" stopColor="#f1ead8"/></linearGradient>
      <linearGradient id="pc-key" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7b467"/><stop offset="1" stopColor="#f0d59c"/></linearGradient>
      <filter id="pc-shadow" x="-30%" y="-30%" width="180%" height="180%"><feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#092d28" floodOpacity=".28"/></filter>
    </defs>
    <circle cx="285" cy="45" r="80" fill="#2f6d61" opacity=".38"/>
    <path d="M245 8 350 64l-21 103-122 65-77-62 45-115Z" fill="#e6c77c" opacity=".22"/>
    <g transform="translate(44 32) rotate(-7 90 90)" filter="url(#pc-shadow)">
      <rect x="0" y="0" width="168" height="190" rx="12" fill="url(#pc-paper)"/>
      <rect x="18" y="18" width="52" height="10" rx="5" fill="#1f5f54"/>
      <text x="18" y="49" fontSize="20" fontWeight="800" fill="#163e37">PSSSB</text>
      <text x="18" y="72" fontSize="14" fontWeight="700" fill="#8d6a2d">CLERK 2026</text>
      <path d="M18 93h126M18 108h108M18 123h118M18 138h96" stroke="#c6bda6" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="31" cy="161" r="6" fill="none" stroke="#1f5f54" strokeWidth="2"/>
      <circle cx="60" cy="161" r="6" fill="none" stroke="#1f5f54" strokeWidth="2"/>
      <circle cx="89" cy="161" r="6" fill="none" stroke="#1f5f54" strokeWidth="2"/>
    </g>
    <g transform="translate(183 143)" filter="url(#pc-shadow)">
      <rect width="156" height="72" rx="12" fill="#f6f1e5"/>
      {[0,1,2,3,4].map(col => [0,1,2].map(row => <rect key={col+"-"+row} x={12+col*27} y={10+row*18} width="20" height="12" rx="3" fill={row===2&&col===4 ? "url(#pc-key)" : "#d8ddd8"}/>))}
      <rect x="39" y="46" width="74" height="12" rx="4" fill="#b7c9c2"/>
    </g>
  </svg>;
}

function PunjabClerkChart() {
  return <svg className="punjab-clerk-chart" viewBox="0 0 190 140" aria-hidden="true">
    <defs><linearGradient id="pc-chart" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#bf9345"/><stop offset="1" stopColor="#efd08a"/></linearGradient></defs>
    <path d="M12 124h164" stroke="#557b70" strokeWidth="2"/>
    <g fill="url(#pc-chart)"><rect x="22" y="104" width="22" height="20" rx="3"/><rect x="57" y="87" width="22" height="37" rx="3"/><rect x="92" y="64" width="22" height="60" rx="3"/><rect x="127" y="38" width="22" height="86" rx="3"/></g>
    <path d="M22 83C60 78 94 59 143 22" fill="none" stroke="#ead18f" strokeWidth="3"/>
    <path d="m134 23 12-4-2 12" fill="none" stroke="#ead18f" strokeWidth="3"/>
  </svg>;
}

function SSCReferenceChart() {
  return <svg className="ssc-reference-chart" viewBox="0 0 180 140" aria-hidden="true"><defs><linearGradient id="ssc-chart-fill" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#7278ce" /><stop offset="1" stopColor="#b2b4f5" /></linearGradient></defs><path d="M12 124h158" stroke="#6067a9" strokeWidth="2" /><g fill="url(#ssc-chart-fill)"><rect x="20" y="112" width="21" height="12" rx="2" /><rect x="53" y="91" width="21" height="33" rx="2" /><rect x="86" y="72" width="21" height="52" rx="2" /><rect x="119" y="47" width="21" height="77" rx="2" /></g><path d="M19 72C68 68 118 43 153 14" fill="none" stroke="#a2a6ed" strokeWidth="3" /><path d="m141 15 14-4-3 14" fill="none" stroke="#a2a6ed" strokeWidth="3" /></svg>;
}
