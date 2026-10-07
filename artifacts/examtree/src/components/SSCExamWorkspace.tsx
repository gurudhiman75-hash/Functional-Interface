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
import "@/styles/punjab-exam-reference.css";
import "@/styles/punjab-clerk-teal.css";
import "@/styles/railway-exam-reference.css";

type Stage = "prelims" | "mains" | "pyq";
type Format = "full-length" | "sectional" | "topic-wise";
export const SSC_WORKSPACE_SLUGS = ["rrb-ntpc", "rrb-group-d", "rrb-alp", "rrb-technician", "ssc-cgl", "ssc-chsl", "ssc-mts", "ssc-cpo", "ssc-gd", "ssc-stenographer", "ssc-selection-post", "ssc-je", "ibps-po", "ibps-clerk", "ibps-rrb-po", "ibps-rrb-office-assistant", "psssb-clerk", "punjab-patwari", "punjab-police-constable", "punjab-police-si", "punjab-pcs", "psssb-excise-taxation-inspector", "punjab-naib-tehsildar", "psssb-senior-assistant", "psssb-vdo", "punjab-jail-warder", "punjab-police-intelligence-assistant", "pspcl-alm", "pspcl-revenue-accountant"] as const;
type SSCExamSlug = typeof SSC_WORKSPACE_SLUGS[number];
const subtitles: Record<SSCExamSlug, string> = {
  "rrb-ntpc": "Non-Technical Popular Categories",
  "rrb-group-d": "Level-1 Railway Posts",
  "rrb-alp": "Assistant Loco Pilot Examination",
  "rrb-technician": "Technician Grade I Signal & Grade III",
  "ssc-cgl": "Combined Graduate Level Examination",
  "ssc-chsl": "Combined Higher Secondary Level Examination",
  "ssc-mts": "Multi-Tasking Staff & Havaldar Examination",
  "ssc-cpo": "Sub-Inspector in Delhi Police & Central Armed Police Forces",
  "ssc-gd": "Constable (GD) Examination",
  "ssc-stenographer": "Stenographer Grade C & D Examination",
  "ssc-selection-post": "Selection Post Examination",
  "ssc-je": "Junior Engineer Examination",
  "psssb-clerk": "ਪੰਜਾਬ ਕਲਰਕ ਪ੍ਰੀਖਿਆ",
  "punjab-patwari": "ਪੰਜਾਬ ਪਟਵਾਰੀ ਪ੍ਰੀਖਿਆ",
  "punjab-police-constable": "ਪੰਜਾਬ ਪੁਲਿਸ ਕਾਂਸਟੇਬਲ ਪ੍ਰੀਖਿਆ",
  "punjab-police-si": "ਪੰਜਾਬ ਪੁਲਿਸ ਸਬ-ਇੰਸਪੈਕਟਰ ਪ੍ਰੀਖਿਆ",
  "punjab-pcs": "ਪੰਜਾਬ ਰਾਜ ਸਿਵਲ ਸੇਵਾਵਾਂ ਪ੍ਰੀਖਿਆ",
  "psssb-excise-taxation-inspector": "Excise & Taxation Inspector Examination",
  "punjab-naib-tehsildar": "Naib Tehsildar Examination",
  "psssb-senior-assistant": "Senior Assistant Examination",
  "psssb-vdo": "Village Development Officer / Gram Sevak Examination",
  "punjab-jail-warder": "Jail Warder / Matron Examination",
  "punjab-police-intelligence-assistant": "Intelligence Assistant Examination",
  "pspcl-alm": "Assistant Lineman Examination",
  "pspcl-revenue-accountant": "Revenue Accountant Examination",
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
  const isRailway = examSlug.startsWith("rrb-");
  const isPunjab = config.categoryHref === "/category/punjab";
  const isSingle = (isPunjab && examSlug !== "punjab-pcs") || config.testHub?.mode === "single";
  const isPolice = examSlug.startsWith("punjab-police-");
  const authority = isPolice ? "Punjab Police" : (examSlug === "punjab-pcs" || examSlug === "punjab-naib-tehsildar") ? "PPSC" : examSlug.startsWith("pspcl-") ? "PSPCL" : examSlug === "punjab-jail-warder" ? "Punjab Government" : isPunjab ? "PSSSB" : isRailway ? "RRB" : examSlug.startsWith("ibps-") ? "IBPS" : "SSC";
  const isBanking = examSlug.startsWith("ibps-");
  const familyCode = isRailway ? "RAILWAY" : isPunjab ? "PUNJAB" : isBanking ? "BANKING" : "SSC";
  const brand = isPolice ? "POLICE" : authority;
  const stages: { id: Stage; label: string }[] = [
    { id: "prelims", label: isSingle ? (isPunjab ? "Written exam" : config.testHub?.stage1Label || "Test Series") : config.testHub?.stage1Label || (isBanking || examSlug === "punjab-pcs" ? "Prelims" : "Tier I") },
    ...(isSingle ? [] : [{ id: "mains" as const, label: config.testHub?.stage2Label || (isBanking || examSlug === "punjab-pcs" ? "Mains" : "Tier II") }]),
    { id: "pyq", label: "PYQs" },
  ];
  const examShortName = isPunjab ? ({
    "psssb-clerk": "CLERK",
    "punjab-patwari": "PATWARI",
    "punjab-police-constable": "CONSTABLE",
    "punjab-police-si": "SI",
    "punjab-pcs": "PCS",
    "psssb-excise-taxation-inspector": "EXCISE INSPECTOR",
    "punjab-naib-tehsildar": "NAIB TEHSILDAR",
    "psssb-senior-assistant": "SENIOR ASSISTANT",
    "psssb-vdo": "VDO / GRAM SEVAK",
    "punjab-jail-warder": "JAIL WARDER",
    "punjab-police-intelligence-assistant": "INTELLIGENCE ASST.",
    "pspcl-alm": "ASSISTANT LINEMAN",
    "pspcl-revenue-accountant": "REVENUE ACCOUNTANT",
  } as Record<string, string>)[examSlug] : ({ "rrb-ntpc": "NTPC", "rrb-group-d": "GROUP D", "rrb-alp": "ALP", "rrb-technician": "TECHNICIAN", "ibps-po": "PO", "ibps-clerk": "CSA", "ibps-rrb-po": "RRB PO", "ibps-rrb-office-assistant": "RRB OA" } as Record<string, string>)[examSlug] || config.name.replace(/^SSC\s+/, "");
  const stageSummary = isSingle ? (isPunjab ? "Written exam" : config.testHub?.stage1Label || "CBE") : stages.slice(0, 2).map(item => item.label).join(" & ");
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
  const usesSscReference = isSscFamily || isBanking || isRailway;
  const isPunjabClerk = examSlug === "psssb-clerk";
  const languages = testLanguages.length ? testLanguages : usesSscReference ? ["en", "hi"] : isPunjab ? ["pa", "en"] : [];
  const loginHref = "/login/student?next=" + encodeURIComponent("/" + examSlug);
  const filtered = tests.filter(test => stage === "pyq" ? test.type === "pyq" : (isSingle || test.stage === stage) && test.type === format);
  const stageCount = (id: Stage) => tests.filter(test => id === "pyq" ? test.type === "pyq" : (isSingle || test.stage === id) && test.type !== "pyq").length;
  const activeLabel = stages.find(item => item.id === stage)!.label;
  const formatLabel = formats.find(item => item.id === format)!.label;


  const viewTabs = <div className="ssc-main-switch" role="tablist" aria-label={config.name + " page view"}>
        <button type="button" role="tab" id="ssc-tests-tab" aria-controls="ssc-tests-panel" aria-selected={view === "tests"} onClick={() => setView("tests")}><FileText />Test Series</button>
        <button type="button" role="tab" id="ssc-overview-tab" aria-controls="ssc-overview-panel" aria-selected={view === "overview"} onClick={() => setView("overview")}><BookOpen />Overview</button>
        <a href={config.officialUrl} target="_blank" rel="noreferrer"><Globe2 />Official website <ArrowRight /></a>
      </div>;
  return <div className={"ssc-workspace" + (usesSscReference ? " ssc-reference" : "") + (isRailway ? " railway-reference" : "") + (isPunjab ? " punjab-reference punjab-clerk-teal punjab-teal-family punjab-clerk-page" : "")}>
    <div className="ssc-workspace-inner">
      <nav className="ssc-breadcrumb" aria-label="Breadcrumb"><Link href={config.categoryHref}>{isPunjab ? "ਪੰਜਾਬ ਦੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ" : isRailway ? "Railway exams" : isBanking ? "Banking exams" : "SSC exams"}</Link><span>/</span><span>{config.name}</span></nav>
      <header className={"ssc-exam-header " + (signedIn ? "is-signed-in" : "")}>
        <div className="ssc-header-content">
          <div className="ssc-header-identity">
            <ExamIdentityIcon name={config.name} familyCode={familyCode} icon={isPunjab ? "/category-icons/punjab-library-official.png" : isRailway ? "/category-icons/railways-library-official.png" : icon ?? undefined} className="ssc-header-logo" />
            <div><p className="ssc-eyebrow">{isPunjab ? (isPolice ? "ਪੰਜਾਬ ਪੁਲਿਸ" : examSlug === "punjab-pcs" ? "ਪੰਜਾਬ ਲੋਕ ਸੇਵਾ ਕਮਿਸ਼ਨ" : "ਪੰਜਾਬ ਅਧੀਨ ਸੇਵਾਵਾਂ ਚੋਣ ਬੋਰਡ") : isRailway ? "RAILWAY RECRUITMENT BOARDS" : isBanking ? "INSTITUTE OF BANKING PERSONNEL SELECTION" : "STAFF SELECTION COMMISSION"}</p><h1>{config.name} {config.isShell ? null : <span>{config.yearLabel}</span>}</h1><p className="ssc-exam-subtitle">{subtitles[examSlug]}</p></div>
          </div>
          <div className="ssc-header-features"><span><FileText /> {stageSummary}</span>{languages.length ? <span><Languages />{languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div>
        </div>
        <aside className="ssc-date-panel" aria-label="Exam date countdown"><CalendarDays /><div><p>EXAM DATE</p><strong>{countdown?.date || (isPunjab && !config.isShell ? "Date not verified" : "Date to be announced")}</strong><a href={config.officialUrl} target="_blank" rel="noreferrer">Official {authority} updates <ArrowRight /></a></div>{countdown ? <div className="ssc-countdown"><strong>{countdown.days > 0 ? countdown.days : countdown.days === 0 ? "Today" : "Held"}</strong><span>{countdown.days > 0 ? "Days to go" : countdown.days === 0 ? "Exam day" : "Exam date passed"}</span></div> : (usesSscReference || isPunjab) ? <div className="ssc-countdown"><strong>—</strong><span>Awaiting date</span></div> : null}</aside>
        {isPunjab ? viewTabs : null}
      </header>

      {!isPunjab ? viewTabs : null}

      {view === "tests" ? <section id="ssc-tests-panel" role="tabpanel" aria-labelledby="ssc-tests-tab" className="ssc-tests-panel">
        <div className="ssc-catalog-layout"><div className="ssc-catalog-main">
        <section className="ssc-featured-series" aria-label="Featured test series">{isPunjab ? <div className="clerk-banner-art">{isPunjabClerk ? <img src="/images/exams/punjab-clerk-teal-banner.webp" alt="Punjab Clerk test series — faded Punjab map, wheat and mock exam papers" /> : <PunjabClerkStyleBanner name={config.name} shortName={examShortName} authority={authority} />}</div> : isRailway ? <RailwayBanner shortName={examShortName} subtitle={subtitles[examSlug]} /> : <div className={"ssc-series-art" + (examSlug.startsWith("ibps-rrb-") ? " ssc-series-art-compact" : "")} aria-hidden="true"><span>{"TARGET " + config.yearLabel}</span><strong>{brand}<br /><em>{examShortName}</em></strong>{usesSscReference ? <SSCReferenceArtwork name={config.name} /> : null}<div className="ssc-series-seal"><ExamIdentityIcon name={config.name} familyCode={familyCode} icon={icon ?? undefined} /></div><small>PRACTISE · ANALYSE · IMPROVE</small></div>}<div className="ssc-series-content"><span className="ssc-featured-label">{featured ? "FEATURED" : "TEST SERIES"}</span><h2>{featured?.name || (isRailway ? config.name + " Test Series" : usesSscReference ? "Complete Test Series" : isPunjab ? config.name + " Test Series" : config.name + " Test Series")}</h2><p>{featured?.description || "Full mocks, sectional tests and topic practice."}</p><div className="ssc-series-features"><span><Clock3 />Timed practice</span><span><Target />Focused revision</span><span><BarChart3 />Review attempts</span></div>{loading ? <p role="status">Loading catalogue…</p> : unavailable ? <p>Catalogue temporarily unavailable</p> : featured ? <p className="ssc-series-count"><FileText /> {featured.liveTestCount} published tests</p> : <p className="ssc-series-count"><FileText /> {tests.length ? tests.length + " published tests" : "Tests are being prepared"}</p>}{featured ? <Link href={"/test-series/" + encodeURIComponent(featured.id)}>Explore series <ArrowRight /></Link> : <button type="button" onClick={() => document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"})}>Explore practice <ArrowRight /></button>}</div></section>
        <div className="ssc-practice-card" id="ssc-practice">
        <div className="ssc-section-heading"><div><h2>{isPunjab ? "ਆਪਣੇ ਢੰਗ ਨਾਲ ਅਭਿਆਸ ਕਰੋ" : "Practice your way"}</h2></div>{!loading && !unavailable ? <span className="ssc-published-count">{tests.length} published {tests.length === 1 ? "test" : "tests"}</span> : null}</div>
        <div className="ssc-stage-tabs" role="tablist" aria-label={config.name + " exam stage"}>{stages.map(item => <button key={item.id} type="button" role="tab" aria-selected={stage === item.id} onClick={() => setStage(item.id)}><span>{item.label}</span>{!loading && !unavailable ? <span className="ssc-tab-count">{stageCount(item.id)}</span> : null}</button>)}</div>
        {stage !== "pyq" ? <div className="ssc-format-tabs" role="tablist" aria-label={activeLabel + " test format"}>{formats.map(item => <button key={item.id} type="button" role="tab" aria-selected={format === item.id} onClick={() => setFormat(item.id)}>{item.label}{!loading && !unavailable ? <span>{tests.filter(test => (isSingle || test.stage === stage) && test.type === item.id).length}</span> : null}</button>)}</div> : null}
        <div className="ssc-test-list-heading"><h3>{stage === "pyq" ? "Previous year papers" : activeLabel + " · " + formatLabel}</h3>{!loading && !unavailable ? <span>{filtered.length} available</span> : null}</div>
        {loading ? <div className="ssc-empty-state" role="status"><Loader2 className="animate-spin" /><h3>Loading published tests…</h3></div> : unavailable ? <div className="ssc-empty-state" role="alert"><FileText /><h3>The test catalogue is temporarily unavailable.</h3><p>Your syllabus and preparation resources are still available.</p><button type="button" onClick={onRetry}>Try again</button></div> : filtered.length ? <div className="ssc-test-list">{filtered.map(test => <article key={test.id} className="ssc-test-row">
          <div className="ssc-test-row-main"><ExamIdentityIcon name={config.name} familyCode={familyCode} icon={test.iconUrl ?? undefined} className="ssc-test-logo" /><div><div className="ssc-test-title"><h3>{test.title}</h3>{test.access ? <span className={"ssc-access " + test.access}>{test.access === "free" ? "Free" : "Paid"}</span> : null}</div><p>{test.description}</p><div className="ssc-test-meta"><span className="ssc-test-format">{test.type === "pyq" ? "PYQ" : test.type === "sectional" ? "Sectional" : test.type === "topic-wise" ? "Topic practice" : "Full mock"}</span><span><FileText />{test.questionCount} questions</span><span><Clock3 />{test.durationMinutes} min</span>{test.totalMarks > 0 ? <span><Target />{test.totalMarks} marks</span> : null}{test.languages?.length ? <span><Languages />{test.languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div></div></div>
          <Link href={signedIn ? test.href : "/login/student?next=" + encodeURIComponent(test.href)} className="ssc-test-action">{signedIn ? test.access === "paid" ? "View test" : "Start test" : "Sign in to attempt"}<ArrowRight /></Link>
        </article>)}</div> : <div className="ssc-empty-state"><span className="ssc-empty-icon"><FileText /></span><p className="ssc-eyebrow">YOUR PREPARATION CAN START HERE</p><h3>{stage === "pyq" ? "No previous year papers published yet." : isRailway ? "Tests are being prepared" : "No " + activeLabel + " " + formatLabel.toLowerCase() + " published yet."}</h3><p>Meanwhile, explore the syllabus, make your study plan or try topic practice.</p><div className="ssc-empty-links"><Link href={examSyllabusHref(examSlug)}>Explore syllabus <ArrowRight /></Link>{config.topics[0] ? <Link href={practiceTopicHref(config.topics[0].slug,examSlug)}>Try topic practice <ArrowRight /></Link> : null}</div></div>}
        </div></div>
        <aside className="ssc-toolkit"><section><h2>{isPunjab ? "ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Preparation Toolkit"}</h2>{isPunjab ? <p className="punjab-toolkit-subtitle">Preparation Toolkit</p> : null}{[{icon:BookOpen,title:"Syllabus & pattern",text:"Subject coverage and exam structure",href:examSyllabusHref(examSlug)},{icon:FileText,title:"Previous year papers",text:"Browse published previous-year practice",href:"#ssc-practice",pyq:true},{icon:Target,title:"Preparation guide",text:"Study plan and practice resources",href:examPreparationHref(examSlug)},{icon:Bell,title:"Exam updates",text:"Official notices and important dates",href:examDetailsHref(examSlug,"updates")}].map(({icon:Icon,...item}) => item.pyq ? <button type="button" key={item.title} onClick={() => {setStage("pyq");document.getElementById("ssc-practice")?.scrollIntoView({behavior:"smooth",block:"start"});}}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></button> : <Link key={item.title} href={item.href}><span><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></Link>)}</section><section className="ssc-review-card"><p>MAKE EVERY ATTEMPT COUNT</p><h2>Start strong.<br /><span>Review smarter.</span></h2><p>Review mistakes and use your results to plan your next practice session.</p>{usesSscReference || isPunjab ? <SSCReferenceChart /> : <BarChart3 aria-hidden="true" />}{!signedIn ? <Link href={loginHref}>Sign in to save your progress <ArrowRight /></Link> : null}</section></aside>
        </div>
        <section className="ssc-subject-section"><h2>{isPunjab ? "ਤਿਆਰੀ ਦੇ ਸਰੋਤ" : "Know the exam"}</h2><div>{(isPunjabClerk ? [{icon:Languages,name:"ਪੰਜਾਬੀ / Punjabi"},{icon:Globe2,name:"Punjab GK"},{icon:Brain,name:"Reasoning & Numerical"},{icon:FileText,name:"Typing Practice"}] : isPunjab ? [{icon:BookOpen,name:"ਅਧਿਕਾਰਤ ਸਿਲੇਬਸ"},{icon:Target,name:"ਤਿਆਰੀ ਦੀ ਯੋਜਨਾ"},{icon:Bell,name:"ਪ੍ਰੀਖਿਆ ਅੱਪਡੇਟ"}] : isRailway ? [{icon:Calculator,name:"Mathematics"},{icon:Brain,name:"General Intelligence & Reasoning"},{icon:Globe2,name:"General Awareness"},...(examSlug === "rrb-group-d" || examSlug === "rrb-alp" ? [{icon:BookOpen,name:examSlug === "rrb-alp" ? "Science & Engineering" : "General Science"}] : examSlug === "rrb-technician" ? [{icon:BookOpen,name:"Science & Technical Basics"}] : [])] : isBanking ? [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:examSlug.startsWith("ibps-rrb-") ? "Language" : "English"},{icon:Globe2,name:"Banking & Financial Awareness"},...(examSlug.startsWith("ibps-rrb-") ? [{icon:FileText,name:"Computer Knowledge"}] : [])] : [{icon:Brain,name:"Reasoning"},{icon:Calculator,name:"Quantitative Aptitude"},{icon:Languages,name:"English"},{icon:Globe2,name:"General Awareness"}]).map(({icon:Icon,name}) => <Link key={name} href={isPunjabClerk && name === "Typing Practice" ? examPreparationHref(examSlug) : isPunjab && Icon === Target ? examPreparationHref(examSlug) : isPunjab && Icon === Bell ? examDetailsHref(examSlug,"updates") : examSyllabusHref(examSlug)}><span><Icon /></span><div><h3>{name}</h3><p>{isPunjabClerk ? (name === "Typing Practice" ? "English + Punjabi typing readiness" : "Clerk syllabus and practice coverage") : isPunjab ? "ਜਾਣਕਾਰੀ ਅਤੇ ਤਿਆਰੀ ਲਈ ਸਰੋਤ" : "Syllabus and topic coverage"}</p></div><ArrowRight /></Link>)}</div></section>
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
function PunjabClerkStyleBanner({ name, shortName, authority }: { name: string; shortName: string; authority: string }) {
  const examTitleSize = Math.min(8.8, 62 / Math.max(shortName.length, 1));
  return <div className="punjab-family-clerk-banner" role="img" aria-label={name + " test series banner"}>
    <strong className="punjab-banner-heading">PUNJAB</strong>
    <span className="punjab-banner-exam" style={{ fontSize: examTitleSize + "cqw" }}>{shortName}</span>
    <small className="punjab-banner-caption">{authority.toUpperCase()} TEST SERIES</small>
  </div>;
}

function PunjabReferenceArtwork({ name, shortName }: { name: string; shortName: string }) {
  return <svg className="ssc-reference-artwork punjab-reference-artwork" viewBox="0 0 320 280" aria-hidden="true">
    <defs>
      <linearGradient id="punjab-paper-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f9feff" /><stop offset="1" stopColor="#dff7f8" /></linearGradient>
      <linearGradient id="punjab-fold-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#00697d" /><stop offset="1" stopColor="#00c7d2" /></linearGradient>
      <filter id="punjab-paper-shadow" x="-40%" y="-40%" width="190%" height="190%"><feDropShadow dx="3" dy="7" stdDeviation="5" floodColor="#001b2a" floodOpacity=".35" /></filter>
    </defs>
    <path d="M175 0H320V280H38L120 214 66 118Z" fill="url(#punjab-fold-fill)" opacity=".74" />
    <path d="m233 0 87 60-55 46 55 102-98 72-84-56 80-70-71-77Z" fill="#56dce3" opacity=".34" />
    <g transform="translate(70 54) rotate(-16 104 96)" filter="url(#punjab-paper-shadow)">
      <rect x="-14" y="28" width="158" height="196" rx="4" fill="#00758a" />
      <rect x="7" y="14" width="158" height="196" rx="4" fill="#8ee1e5" />
      <rect x="21" y="0" width="146" height="198" rx="4" fill="url(#punjab-paper-fill)" />
      <text x="38" y="27" fontSize={name.length > 24 ? "9" : name.length > 16 ? "11" : "14"} fontWeight="800" fill="#062b42">{name}</text>
      <text x="38" y="45" fontSize="8" fontWeight="700" fill="#00758a">{shortName}</text>
      <path d="M37 58h108M37 69h98" stroke="#94cfd4" strokeWidth="3" />
      {[0,1,2,3,4].map(n=><g key={n} transform={`translate(0 ${n*22})`}><path d="M37 91h52M37 99h34" stroke="#9bcfd2" strokeWidth="3" /><circle cx="112" cy="92" r="4" fill="none" stroke="#00758a" strokeWidth="1.6" /><circle cx="136" cy="92" r="4" fill="none" stroke="#00758a" strokeWidth="1.6" /></g>)}
    </g>
  </svg>;
}

function SSCReferenceChart() {
  return <svg className="ssc-reference-chart" viewBox="0 0 180 140" aria-hidden="true"><defs><linearGradient id="ssc-chart-fill" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#7278ce" /><stop offset="1" stopColor="#b2b4f5" /></linearGradient></defs><path d="M12 124h158" stroke="#6067a9" strokeWidth="2" /><g fill="url(#ssc-chart-fill)"><rect x="20" y="112" width="21" height="12" rx="2" /><rect x="53" y="91" width="21" height="33" rx="2" /><rect x="86" y="72" width="21" height="52" rx="2" /><rect x="119" y="47" width="21" height="77" rx="2" /></g><path d="M19 72C68 68 118 43 153 14" fill="none" stroke="#a2a6ed" strokeWidth="3" /><path d="m141 15 14-4-3 14" fill="none" stroke="#a2a6ed" strokeWidth="3" /></svg>;
}

function RailwayBanner({ shortName, subtitle }: { shortName: string; subtitle: string }) {
  return <div className="railway-banner" role="img" aria-label={"Railway " + shortName + " test series — train at a station"}><strong>RAILWAY</strong><span className={"railway-banner-name" + (shortName.length > 7 ? " railway-banner-name-long" : "")}>{shortName}</span><small>{subtitle}</small></div>;
}
