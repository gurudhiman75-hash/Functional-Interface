import { useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, ChevronRight,
  ExternalLink, FileText, Landmark, Languages, Search, ShieldCheck, Target, X, Zap,
} from "lucide-react";
import type { ExamCollection } from "@/lib/exam-collections";
import {
  catalogExamCodesForSlug, examDetailsHref, examHubHref, examPreparationHref,
  examSyllabusHref, getExamAcquisitionConfig,
} from "@/lib/seo-practice";
import type { getStudentTestSeries } from "@/lib/test-series";
import "@/styles/punjab-exam-collection.css";

const GROUPS = [
  { label: "Administration", Icon: Landmark, tone: "green" },
  { label: "Police", Icon: ShieldCheck, tone: "blue" },
  { label: "Office & community", Icon: BriefcaseBusiness, tone: "amber" },
  { label: "Power & technical", Icon: Zap, tone: "purple" },
] as const;

type ExamAuthority = "police" | "pspcl" | "psssb" | "ppsc";

function examAuthority(slug: string): ExamAuthority | undefined {
  if (slug.startsWith("punjab-police-")) return "police";
  if (slug.startsWith("pspcl-")) return "pspcl";
  if (slug.startsWith("psssb-") || slug === "punjab-patwari") return "psssb";
  if (slug === "punjab-pcs" || slug === "punjab-naib-tehsildar") return "ppsc";
  return undefined;
}

const AUTHORITY_LABELS: Record<ExamAuthority, string> = {
  police: "Punjab Police", pspcl: "PSPCL", psssb: "PSSSB", ppsc: "PPSC",
};

function ExamAuthorityMark({ authority }: { authority: ExamAuthority }) {
  const [imageFailed, setImageFailed] = useState(false);
  if ((authority === "police" || authority === "pspcl") && !imageFailed) {
    return <span className={`punjab-authority-mark punjab-authority-${authority}`} aria-hidden="true">
      <span className="punjab-authority-image-frame"><img
        src={`${import.meta.env.BASE_URL}images/exam-authorities/${authority === "police" ? "punjab-police-header.png" : "pspcl.png"}`}
        alt="" width={authority === "police" ? 300 : 210} height={authority === "police" ? 100 : 72}
        loading="lazy" decoding="async" onError={() => setImageFailed(true)}
      /></span>
    </span>;
  }
  const Symbol = authority === "psssb" ? BookOpen : authority === "police" ? ShieldCheck : authority === "pspcl" ? Zap : Landmark;
  return <span className={`punjab-authority-mark punjab-authority-${authority} punjab-authority-monogram`} aria-hidden="true"><Symbol size={19} strokeWidth={1.65} /><span>{authority === "police" ? "POLICE" : authority.toUpperCase()}</span></span>;
}

const PUNJABI_EXAM_NAMES: Record<string, string> = {
  "punjab-pcs": "ਪੰਜਾਬ ਸਿਵਲ ਸੇਵਾਵਾਂ",
  "punjab-naib-tehsildar": "ਨਾਇਬ ਤਹਿਸੀਲਦਾਰ",
  "punjab-patwari": "ਪੰਜਾਬ ਪਟਵਾਰੀ",
  "psssb-excise-taxation-inspector": "ਆਬਕਾਰੀ ਤੇ ਕਰ ਨਿਰੀਖਕ",
  "punjab-police-constable": "ਪੰਜਾਬ ਪੁਲਿਸ ਕਾਂਸਟੇਬਲ",
  "punjab-police-si": "ਪੰਜਾਬ ਪੁਲਿਸ ਸਬ-ਇੰਸਪੈਕਟਰ",
  "punjab-jail-warder": "ਜੇਲ੍ਹ ਵਾਰਡਰ / ਮੈਟਰਨ",
  "punjab-police-intelligence-assistant": "ਇੰਟੈਲੀਜੈਂਸ ਅਸਿਸਟੈਂਟ",
  "psssb-clerk": "ਪੀ.ਐੱਸ.ਐੱਸ.ਐੱਸ.ਬੀ. ਕਲਰਕ",
  "psssb-senior-assistant": "ਸੀਨੀਅਰ ਸਹਾਇਕ",
  "psssb-vdo": "ਗ੍ਰਾਮ ਸੇਵਕ",
  "pspcl-alm": "ਸਹਾਇਕ ਲਾਈਨਮੈਨ",
  "pspcl-revenue-accountant": "ਮਾਲ ਲੇਖਾਕਾਰ",
};

type Props = {
  collection: ExamCollection;
  seriesQuery: UseQueryResult<Awaited<ReturnType<typeof getStudentTestSeries>>, Error>;
};

export function PunjabExamCollection({ collection, seriesQuery }: Props) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const exams = collection.groups.flatMap((group, groupIndex) => group.exams.flatMap((slug) => {
    const config = getExamAcquisitionConfig(slug);
    return config ? [{ slug, config, groupIndex }] : [];
  }));
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visibleExams = exams.filter(({ slug, config, groupIndex }) => {
    const authority = examAuthority(slug);
    const text = `${config.name} ${slug.replaceAll("-", " ")} ${PUNJABI_EXAM_NAMES[slug] ?? ""} ${collection.groups[groupIndex].title} ${GROUPS[groupIndex]?.label ?? ""} ${authority ? AUTHORITY_LABELS[authority] : ""}`.toLocaleLowerCase();
    return (activeGroup === null || activeGroup === groupIndex) && terms.every((term) => text.includes(term));
  });
  const codes = new Set(exams.flatMap(({ slug }) => catalogExamCodesForSlug(slug)));
  const liveSeries = (seriesQuery.data?.series ?? []).filter((series) =>
    codes.has(series.examCode.toUpperCase()) && series.learnerVisibility === "live" && series.liveTestCount > 0,
  );
  const resetFilters = () => { setQuery(""); setActiveGroup(null); };

  return (
    <main className="punjab-directory" data-testid="exam-collection-page">
      <div className="punjab-directory-inner">
        <nav className="punjab-breadcrumb" aria-label="Breadcrumb">
          <Link href="/collections"><ArrowLeft size={14} aria-hidden="true" /> All collections</Link>
          <ChevronRight size={13} aria-hidden="true" /><span>Punjab exams</span>
        </nav>

        <section className="punjab-directory-hero" aria-labelledby="punjab-directory-title">
          <div className="punjab-hero-copy">
            <span className="punjab-eyebrow">YOUR PUNJAB EXAM HUB</span>
            <h1 id="punjab-directory-title">Punjab Government Exams</h1>
            <p className="punjab-hero-punjabi" lang="pa">ਪੰਜਾਬ ਦੀਆਂ ਪ੍ਰੀਖਿਆਵਾਂ, ਤਿਆਰੀ ਇੱਕੋ ਥਾਂ।</p>
            <p className="punjab-hero-description">Find your exam. Know the syllabus. Take the next step.</p>
            <div className="punjab-hero-actions">
              <a href="#collection-exams" className="punjab-button">Find my exam <ArrowRight size={16} aria-hidden="true" /></a>
              <span>{exams.length} exam routes <span aria-hidden="true">·</span> {collection.groups.length} career paths</span>
            </div>
          </div>
          <div className="punjab-hero-art" aria-hidden="true">
            <span className="punjab-hero-disc" />
            <img src={`${import.meta.env.BASE_URL}images/collections/punjab-bhangra.webp`} alt="" width="720" height="720" decoding="async" />
          </div>
          <span className="punjab-hero-border" aria-hidden="true" />
        </section>

        <nav className="punjab-quick-links" aria-label="Preparation shortcuts">
          <a href="#punjab-test-series"><Target size={18} aria-hidden="true" /><span>Test series</span><ArrowRight size={14} aria-hidden="true" /></a>
          <Link href="/pyqs"><FileText size={18} aria-hidden="true" /><span>Previous papers</span><ArrowRight size={14} aria-hidden="true" /></Link>
          <Link href="/resources/notes"><BookOpen size={18} aria-hidden="true" /><span>Study notes</span><ArrowRight size={14} aria-hidden="true" /></Link>
          <Link href="/current-affairs"><Landmark size={18} aria-hidden="true" /><span>Current affairs</span><ArrowRight size={14} aria-hidden="true" /></Link>
        </nav>

        <section className="punjab-exam-finder" id="collection-exams" aria-labelledby="punjab-exams-heading">
          <div className="punjab-section-heading">
            <div><span className="punjab-eyebrow">CHOOSE YOUR GOAL</span><h2 id="punjab-exams-heading">Which exam are you preparing for?</h2></div>
            <p>Syllabus, exam details and preparation in one place.</p>
          </div>
          <div className="punjab-search" role="search" aria-label="Find a Punjab exam">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="punjab-exam-search">Search Punjab exams in English or Punjabi</label>
            <input id="punjab-exam-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search PSSSB, Police, Patwari…" autoComplete="off" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear exam search"><X size={17} aria-hidden="true" /></button>}
          </div>
          <div className="punjab-filter-bar" role="group" aria-label="Filter exams by career path">
            <button type="button" aria-pressed={activeGroup === null} onClick={() => setActiveGroup(null)}>All exams <span>{exams.length}</span></button>
            {collection.groups.map((group, index) => <button key={group.title} type="button" aria-pressed={activeGroup === index} onClick={() => setActiveGroup(index)}>{GROUPS[index]?.label ?? group.title}<span>{exams.filter((exam) => exam.groupIndex === index).length}</span></button>)}
          </div>
          <p className="punjab-result-count" role="status" aria-live="polite" aria-atomic="true">Showing {visibleExams.length} of {exams.length} exams{query.trim() ? ` for “${query.trim()}”` : ""}{activeGroup !== null ? ` · ${GROUPS[activeGroup]?.label ?? collection.groups[activeGroup].title}` : ""}</p>

          {visibleExams.length ? <div className="punjab-exam-grid">
            {visibleExams.map(({ slug, config, groupIndex }) => {
              const { Icon, tone, label } = GROUPS[groupIndex] ?? GROUPS[0];
              const authority = examAuthority(slug);
              return <article className={`punjab-exam-card punjab-tone-${tone}`} key={slug} data-testid={`punjab-exam-${slug}`}>
                <div className="punjab-exam-card-top">
                  {authority ? <ExamAuthorityMark authority={authority} /> : <span className="punjab-authority-mark punjab-authority-fallback" aria-hidden="true"><Icon size={23} strokeWidth={1.7} /></span>}
                  <div className="punjab-exam-card-heading"><span className="punjab-exam-authority">{authority ? AUTHORITY_LABELS[authority] : label}</span><h3><Link href={examHubHref(slug)}>{config.name}</Link></h3></div>
                </div>
                <p className="punjab-exam-local-name" lang="pa">{PUNJABI_EXAM_NAMES[slug]}</p>
                <div className="punjab-exam-card-actions">
                  <Link className="punjab-exam-explore" href={examHubHref(slug)} aria-label={`Explore ${config.name}`}>Explore exam <ArrowRight size={15} aria-hidden="true" /></Link>
                  <Link href={examSyllabusHref(slug)} aria-label={`${config.name} syllabus`}>Syllabus</Link>
                </div>
                <details className="punjab-exam-more"><summary>Details &amp; preparation</summary><div><Link href={examDetailsHref(slug)}>Exam details</Link><Link href={examPreparationHref(slug)}>Preparation guide</Link><a href={config.officialUrl} target="_blank" rel="noopener noreferrer">Official website <ExternalLink size={12} aria-hidden="true" /></a></div></details>
              </article>;
            })}
          </div> : <div className="punjab-empty-state"><Search size={25} aria-hidden="true" /><h3>No exams match your search</h3><p>Try another exam name or choose a different career path.</p><button className="punjab-button" type="button" onClick={resetFilters}>Show all exams <ArrowRight size={15} aria-hidden="true" /></button></div>}
        </section>

        <section className="punjab-foundation" aria-labelledby="punjab-foundation-heading">
          <div className="punjab-foundation-intro"><span className="punjab-eyebrow">A STRONGER FOUNDATION</span><h2 id="punjab-foundation-heading">Made for your Punjab preparation.</h2><p lang="pa">ਪੰਜਾਬੀ ਤੇ ਪੰਜਾਬ GK ਨੂੰ ਦਿਓ ਖ਼ਾਸ ਸਮਾਂ।</p></div>
          <div className="punjab-foundation-items">
            <div><span><Landmark size={20} aria-hidden="true" /></span><h3>Punjab GK</h3><p>History, geography, culture and administration.</p></div>
            <div><span><Languages size={20} aria-hidden="true" /></span><h3>Punjabi language</h3><p>Build your language skills alongside your exam syllabus.</p></div>
          </div>
          <Link href="/resources/notes" className="punjab-foundation-link">Browse study notes <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <section className="punjab-series-section" id="punjab-test-series" aria-labelledby="punjab-series-heading">
          <div className="punjab-section-heading"><div><span className="punjab-eyebrow">PUT PREPARATION INTO PRACTICE</span><h2 id="punjab-series-heading">Available test series</h2></div><Link className="punjab-text-link" href="/mock-tests">Browse mock tests <ArrowRight size={15} aria-hidden="true" /></Link></div>
          {seriesQuery.isPending ? <div className="punjab-series-grid" role="status" aria-label="Loading Punjab test series">{[0, 1, 2].map((index) => <div className="punjab-series-skeleton" aria-hidden="true" key={index}><span /><span /><span /></div>)}</div>
            : seriesQuery.isError ? <div className="punjab-series-message" role="status"><Target size={22} aria-hidden="true" /><div><h3>Test series could not be loaded</h3><p>You can still explore every exam and its syllabus above.</p></div><button type="button" className="punjab-text-link" onClick={() => void seriesQuery.refetch()}>Try again <ArrowRight size={15} aria-hidden="true" /></button></div>
            : liveSeries.length ? <div className="punjab-series-grid">{liveSeries.slice(0, 6).map((series) => <article className="punjab-series-card" key={series.id}><span className="punjab-live-label"><span /> Available now</span><h3>{series.name}</h3><p>{series.examName} · {series.liveTestCount} available tests</p><Link href={`/test-series/${series.id}`} className="punjab-text-link">View series <ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div>
              : <div className="punjab-series-message"><Target size={24} aria-hidden="true" /><div><h3>Your exam is the best place to start.</h3><p>No Punjab test series are available right now. Explore an exam above for its syllabus and preparation guide.</p></div><a href="#collection-exams" className="punjab-text-link">Explore exams <ArrowRight size={15} aria-hidden="true" /></a></div>}
        </section>

        <aside className="punjab-official-note"><FileText size={17} aria-hidden="true" /><p>Applying for a post? Check the recruiting authority’s official notice for current dates, eligibility and selection stages. Official website links are available on every exam card.</p></aside>
        <div className="punjab-bottom-nav"><Link href="/collections"><ArrowLeft size={15} aria-hidden="true" /> Explore other exam collections</Link><a href="#punjab-directory-title">Back to top ↑</a></div>
      </div>
    </main>
  );
}
