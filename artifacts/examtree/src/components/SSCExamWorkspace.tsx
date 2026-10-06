import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, FileText, Globe2, Languages, Loader2, Target } from "lucide-react";
import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import type { ExamHubFlatTest } from "@/components/ExamAcquisitionPages";
import { getExamAcquisitionConfig, examDetailsHref, examPreparationHref, examSyllabusHref, practiceTopicHref } from "@/lib/seo-practice";
import { signInWithGoogle } from "@/lib/auth";
import "@/styles/ssc-exam-workspace.css";

type Stage = "prelims" | "mains" | "pyq";
type Format = "full-length" | "sectional" | "topic-wise";
const stages: { id: Stage; label: string }[] = [{ id: "prelims", label: "Tier I" }, { id: "mains", label: "Tier II" }, { id: "pyq", label: "PYQs" }];
const formats: { id: Format; label: string }[] = [{ id: "full-length", label: "Full mocks" }, { id: "sectional", label: "Sectional" }, { id: "topic-wise", label: "Topic-wise" }];
const languageNames: Record<string, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };

export default function SSCExamWorkspace({ tests, icon, signedIn, loading, unavailable, onRetry }: {
  tests: ExamHubFlatTest[]; icon?: string | null; signedIn: boolean; loading: boolean; unavailable: boolean; onRetry: () => void;
}) {
  const config = getExamAcquisitionConfig("ssc-cgl")!;
  const [view, setView] = useState<"tests" | "overview">("tests");
  const [stage, setStage] = useState<Stage>("prelims");
  const [format, setFormat] = useState<Format>("full-length");
  const [googlePending, setGooglePending] = useState(false);
  const loginHref = "/login/student?next=" + encodeURIComponent("/ssc-cgl");
  const filtered = tests.filter(test => stage === "pyq" ? test.type === "pyq" : test.stage === stage && test.type === format);
  const stageCount = (id: Stage) => tests.filter(test => id === "pyq" ? test.type === "pyq" : test.stage === id && test.type !== "pyq").length;
  const activeLabel = stages.find(item => item.id === stage)!.label;
  const formatLabel = formats.find(item => item.id === format)!.label;
  const guidance = [
    { icon: BookOpen, title: "Syllabus & pattern", text: "Know what to cover before you start practising.", href: examSyllabusHref("ssc-cgl") },
    { icon: Target, title: "Preparation guide", text: "Build your study plan around practice and review.", href: examPreparationHref("ssc-cgl") },
    { icon: FileText, title: "Exam details", text: "Read the overview, eligibility and exam updates.", href: examDetailsHref("ssc-cgl") },
  ];

  return <div className="ssc-workspace">
    <main className="ssc-workspace-inner">
      <nav className="ssc-breadcrumb" aria-label="Breadcrumb"><Link href="/category/ssc">SSC exams</Link><span>/</span><span>SSC CGL</span></nav>
      <header className={"ssc-exam-header " + (signedIn ? "is-signed-in" : "")}>
        <div className="ssc-header-content">
          <div className="ssc-header-identity">
            <ExamIdentityIcon name="SSC CGL" familyCode="SSC" icon={icon ?? undefined} className="ssc-header-logo" />
            <div><p className="ssc-eyebrow">STAFF SELECTION COMMISSION</p><h1>SSC CGL <span>{config.yearLabel}</span></h1><p className="ssc-exam-subtitle">Combined Graduate Level Examination</p></div>
          </div>
          {!signedIn ? <p className="ssc-header-description">Your next step starts here. Practise by tier, strengthen individual subjects and keep your exam preparation in one place.</p> : <p className="ssc-header-description">Choose your tier and practice format to continue preparing.</p>}
          <div className="ssc-header-features"><span><CheckCircle2 /> Tier I & Tier II</span><span><Target /> Focused practice</span><span><BookOpen /> Clear explanations</span></div>
        </div>
        {!signedIn ? <aside className="ssc-login-panel">
          <p className="ssc-eyebrow">MAKE EVERY ATTEMPT COUNT</p><h2>Keep your progress together.</h2><p>Sign in to take tests and save your results.</p>
          <button type="button" disabled={googlePending} onClick={() => { setGooglePending(true); void signInWithGoogle().then(() => window.location.assign("/ssc-cgl")).catch(() => window.location.assign(loginHref)).finally(() => setGooglePending(false)); }}>
            <span className="ssc-google-letter" aria-hidden="true">G</span>{googlePending ? "Connecting…" : "Continue with Google"}
          </button><Link href={loginHref}>Other sign-in options <ArrowRight /></Link>
        </aside> : null}
      </header>

      <div className="ssc-main-switch" role="tablist" aria-label="SSC CGL page view">
        <button type="button" role="tab" id="ssc-tests-tab" aria-controls="ssc-tests-panel" aria-selected={view === "tests"} onClick={() => setView("tests")}><FileText />Test Series</button>
        <button type="button" role="tab" id="ssc-overview-tab" aria-controls="ssc-overview-panel" aria-selected={view === "overview"} onClick={() => setView("overview")}><BookOpen />Overview</button>
        <a href={config.officialUrl} target="_blank" rel="noreferrer"><Globe2 />Official website <ArrowRight /></a>
      </div>

      {view === "tests" ? <section id="ssc-tests-panel" role="tabpanel" aria-labelledby="ssc-tests-tab" className="ssc-tests-panel">
        <div className="ssc-section-heading"><div><p className="ssc-eyebrow">PRACTISE WITH PURPOSE</p><h2>Choose your next test.</h2><p>Start with full mocks, or focus on a section or topic.</p></div>{!loading && !unavailable ? <span className="ssc-published-count">{tests.length} published {tests.length === 1 ? "test" : "tests"}</span> : null}</div>
        <div className="ssc-stage-tabs" role="tablist" aria-label="SSC CGL exam stage">{stages.map(item => <button key={item.id} type="button" role="tab" aria-selected={stage === item.id} onClick={() => setStage(item.id)}><span>{item.label}</span>{!loading && !unavailable ? <span className="ssc-tab-count">{stageCount(item.id)}</span> : null}</button>)}</div>
        {stage !== "pyq" ? <div className="ssc-format-tabs" role="tablist" aria-label={activeLabel + " test format"}>{formats.map(item => <button key={item.id} type="button" role="tab" aria-selected={format === item.id} onClick={() => setFormat(item.id)}>{item.label}{!loading && !unavailable ? <span>{tests.filter(test => test.stage === stage && test.type === item.id).length}</span> : null}</button>)}</div> : null}
        <div className="ssc-test-list-heading"><h3>{stage === "pyq" ? "Previous year papers" : activeLabel + " · " + formatLabel}</h3>{!loading && !unavailable ? <span>{filtered.length} available</span> : null}</div>
        {loading ? <div className="ssc-empty-state" role="status"><Loader2 className="animate-spin" /><h3>Loading published tests…</h3></div> : unavailable ? <div className="ssc-empty-state" role="alert"><FileText /><h3>The test catalogue is temporarily unavailable.</h3><p>Your syllabus and preparation resources are still available.</p><button type="button" onClick={onRetry}>Try again</button></div> : filtered.length ? <div className="ssc-test-list">{filtered.map(test => <article key={test.id} className="ssc-test-row">
          <div className="ssc-test-row-main"><ExamIdentityIcon name="SSC CGL" familyCode="SSC" icon={test.iconUrl ?? undefined} className="ssc-test-logo" /><div><div className="ssc-test-title"><h3>{test.title}</h3>{test.access ? <span className={"ssc-access " + test.access}>{test.access === "free" ? "Free" : "Paid"}</span> : null}</div><p>{test.description}</p><div className="ssc-test-meta"><span><FileText />{test.questionCount} questions</span><span><Clock3 />{test.durationMinutes} min</span>{test.totalMarks > 0 ? <span>{test.totalMarks} marks</span> : null}{test.languages?.length ? <span><Languages />{test.languages.map(code => languageNames[code] || code).join(" / ")}</span> : null}</div></div></div>
          <Link href={signedIn ? test.href : "/login/student?next=" + encodeURIComponent(test.href)} className="ssc-test-action">{signedIn ? test.access === "paid" ? "View test" : "Start test" : "Sign in to attempt"}<ArrowRight /></Link>
        </article>)}</div> : <div className="ssc-empty-state"><span className="ssc-empty-icon"><FileText /></span><p className="ssc-eyebrow">YOUR PREPARATION CAN START HERE</p><h3>{stage === "pyq" ? "No previous year papers published yet." : "No " + activeLabel + " " + formatLabel.toLowerCase() + " published yet."}</h3><p>Meanwhile, explore the syllabus, make your study plan or try topic practice.</p><div className="ssc-empty-links"><Link href={examSyllabusHref("ssc-cgl")}>Explore syllabus <ArrowRight /></Link>{config.topics[0] ? <Link href={practiceTopicHref(config.topics[0].slug,"ssc-cgl")}>Try topic practice <ArrowRight /></Link> : null}</div></div>}
        <div className="ssc-resource-grid">{guidance.map(({icon: Icon,...item}) => <Link key={item.title} href={item.href}><span className="ssc-resource-icon"><Icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight /></Link>)}</div>
      </section> : <section id="ssc-overview-panel" role="tabpanel" aria-labelledby="ssc-overview-tab" className="ssc-overview-panel">
        <div className="ssc-section-heading"><div><p className="ssc-eyebrow">KNOW YOUR EXAM</p><h2>Prepare with a clear plan.</h2><p>{config.hub.preparationSummary}</p></div><Link href={examDetailsHref("ssc-cgl")}>Full exam details <ArrowRight /></Link></div>
        <section className="ssc-overview-section"><h3>Syllabus at a glance</h3><div className="ssc-syllabus-grid">{config.syllabus.sections.map(item => <article key={item.title}><BookOpen /><h4>{item.title}</h4><p>{item.summary}</p></article>)}</div><Link href={examSyllabusHref("ssc-cgl")}>Open syllabus & exam pattern <ArrowRight /></Link></section>
        <section className="ssc-overview-section"><h3>Your preparation route</h3><div className="ssc-prep-grid">{config.preparation.cards.map((item,index) => <article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h4>{item.title.replace(/^\d+\.\s*/,"")}</h4><p>{item.text}</p></article>)}</div><Link href={examPreparationHref("ssc-cgl")}>Read preparation guide <ArrowRight /></Link></section>
        <section className="ssc-official-note"><Globe2 /><div><h3>Stay up to date</h3><p>Check SSC’s official notices for dates, vacancies, eligibility and changes to the exam scheme.</p><a href={config.officialUrl} target="_blank" rel="noreferrer">Visit {config.officialLabel} <ArrowRight /></a></div></section>
      </section>}
    </main>
  </div>;
}
