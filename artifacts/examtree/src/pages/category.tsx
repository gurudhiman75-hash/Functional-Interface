import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, ExternalLink, FileText, Search, ShieldCheck, Sparkles, Target } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { usePageMeta } from "@/components/PublicPage";
import { getAttempts } from "@/lib/storage";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { examHubHrefForCatalogExam, getExamAcquisitionConfig, examPreparationHref, examSyllabusHref } from "@/lib/seo-practice";
import { getStudentTestSeries } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import "@/styles/category-page.css";

const normalize = (value: string | undefined) => String(value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
const count = (value: number) => new Intl.NumberFormat("en-IN").format(Math.max(0, value || 0));

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const catalog = useExamCatalog();
  const { categories, subcategories, tests } = catalog;
  const category = categories.find((item) => normalize(item.id) === normalize(id));
  const [examQuery, setExamQuery] = useState("");
  const seriesQuery = useQuery({ queryKey: ["student-test-series"], queryFn: getStudentTestSeries, staleTime: 30_000 });
  usePageMeta(category ? `${category.name} Exams, Test Series & Preparation` : "Exam Category", category ? `Explore ${category.name} exams, available test series, syllabus and preparation guides on Examtree.` : "Find your exam and preparation resources on Examtree.");

  const exams = useMemo(() => category ? getRuntimeExamGroups(category.id, categories, tests, subcategories) : [], [category, categories, tests, subcategories]);
  const query = examQuery.trim().toLowerCase();
  const visibleExams = exams.filter((exam) => !query || `${exam.name} ${exam.description}`.toLowerCase().includes(query));
  const categoryTests = tests.filter((test) => test.categoryId === category?.id);
  const attemptedIds = useMemo(() => new Set(getAttempts().map((attempt) => attempt.testId)), []);
  const freeCount = categoryTests.filter((test) => (test.access ?? "free") === "free").length;
  const attemptedCount = categoryTests.filter((test) => attemptedIds.has(test.id)).length;
  const guides = exams.flatMap((exam) => {
    const href = examHubHrefForCatalogExam(exam.id) ?? examHubHrefForCatalogExam(exam.name);
    const config = getExamAcquisitionConfig(href?.slice(1));
    return config ? [{ exam, config }] : [];
  });
  const officialSources = Array.from(new Map(guides.map(({ config }) => [config.officialUrl, { href: config.officialUrl, label: config.officialLabel }])).values());
  const examCodes = new Set(exams.flatMap((exam) => [normalize(exam.id), normalize(exam.name)]));
  const featuredSeries = (seriesQuery.data?.series ?? []).filter((series) =>
    series.learnerVisibility === "live" && series.liveTestCount > 0 &&
    (normalize(series.examFamilyCode) === normalize(category?.id) || examCodes.has(normalize(series.examCode))),
  ).sort((left, right) => right.attemptCount - left.attemptCount || right.liveTestCount - left.liveTestCount).slice(0, 6);

  if (catalog.error) return <div className="category-redesign"><div className="category-state"><h1>Could not load this category</h1><p>The exam catalogue is temporarily unavailable.</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div></div>;
  if (catalog.isLoading) return <div className="category-redesign"><div className="category-container" role="status"><div className="category-skeleton hero" /><div className="category-exam-grid">{Array.from({ length: 8 }, (_, index) => <div className="category-skeleton" key={index} />)}</div><span className="sr-only">Loading category exams…</span></div></div>;
  if (!category) return <div className="category-redesign"><div className="category-state"><h1>Category not found</h1><p>This category is not available right now.</p><Link href="/exams">Browse all exams <ArrowRight size={16} /></Link></div></div>;

  const examHref = (exam: typeof exams[number]) => examHubHrefForCatalogExam(exam.id) ?? examHubHrefForCatalogExam(exam.name) ?? `/subcategory/${encodeURIComponent(exam.id)}`;

  return <div className="category-redesign" data-testid="category-redesign">
    <div className="category-container">
      <nav className="category-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={13} /><Link href="/exams">All exams</Link><ChevronRight size={13} /><span>{category.name}</span></nav>
      <section className="category-hero" aria-labelledby="category-heading">
        <div className="category-hero-copy">
          <span className="category-eyebrow"><Sparkles size={14} /> YOUR NEXT CHAPTER</span>
          <div className="category-hero-title"><span className="category-hero-logo"><CategoryIcon icon={category.icon} className="h-10 w-10" /></span><h1 id="category-heading">{category.name} Exams</h1></div>
          <p>{category.description || `Find your ${category.name} exam, explore its syllabus and build your preparation plan.`}</p>
          <div className="category-hero-actions"><a href="#category-exams" className="category-primary">Explore exams <ArrowRight size={16} /></a><a href="#category-preparation" className="category-text-link">Plan your preparation <ChevronRight size={15} /></a></div>
        </div>
        <div className="category-hero-panel">
          <span className="category-eyebrow">FIND YOUR STARTING POINT</span>
          <label htmlFor="category-exam-search">Which exam are you preparing for?</label>
          <div className="category-search"><Search size={18} /><input id="category-exam-search" type="search" value={examQuery} onChange={(event) => setExamQuery(event.target.value)} placeholder={`Search ${category.name} exams`} data-testid="category-exam-search" /></div>
          <div className="category-hero-stats"><span><strong>{count(exams.length)}</strong> exams</span><span><strong>{count(categoryTests.length)}</strong> tests</span><span><strong>{count(freeCount)}</strong> free tests</span></div>
        </div>
      </section>
      <nav className="category-switcher" aria-label="Exam categories">{categories.map((item) => <Link key={item.id} href={`/category/${encodeURIComponent(item.id)}`} aria-current={item.id === category.id ? "page" : undefined}><CategoryIcon icon={item.icon} className="h-4 w-4" />{item.name}</Link>)}</nav>

      <section className="category-section" aria-labelledby="category-featured-heading" data-testid="category-featured-series">
        <div className="category-section-head"><div><span className="category-eyebrow">PRACTISE WITH A PURPOSE</span><h2 id="category-featured-heading">Featured Test Series</h2><p>Available practice for {category.name} exams.</p></div><span className="category-quiet-label"><ShieldCheck size={15} /> Published series</span></div>
        {seriesQuery.isPending ? <div className="category-series-row" role="status">{[0, 1, 2].map((index) => <div key={index} className="category-skeleton" />)}<span className="sr-only">Loading test series…</span></div> : seriesQuery.isError ? <div className="category-inline-state"><p>Test series could not be loaded.</p><button type="button" onClick={() => void seriesQuery.refetch()}>Try again</button></div> : featuredSeries.length ? <div className="category-series-row">{featuredSeries.map((series) => <article className="category-series-card" key={series.id}>
          <div className="category-series-top"><span className="category-series-logo"><CategoryIcon icon={series.iconUrl || category.icon} className="h-8 w-8" /></span><span className="category-live-badge">Live</span></div>
          <span className="category-series-exam">{series.examName}</span><h3>{series.name}</h3><p>{count(series.liveTestCount)} available tests{series.questionCount > 0 ? ` · ${count(series.questionCount)} questions` : ""}</p>
          <Link href={`/test-series/${encodeURIComponent(series.id)}`}>View test series <ArrowRight size={16} /></Link>
        </article>)}</div> : <div className="category-inline-state"><BookOpen size={24} /><div><h3>Start with your exam guide</h3><p>Live series will appear here as they become available. Explore syllabus and preparation routes below.</p></div><a href="#category-exams">Explore exams <ArrowRight size={15} /></a></div>}
      </section>

      <section className="category-section" id="category-exams" aria-labelledby="category-exams-heading">
        <div className="category-section-head"><div><span className="category-eyebrow">CHOOSE YOUR EXAM</span><h2 id="category-exams-heading">All {category.name} exams</h2><p>Find the exam that fits your goal.</p></div><span className="category-quiet-label">{visibleExams.length} {query ? "matching" : "available"} exams{attemptedCount > 0 ? ` · ${attemptedCount} tests attempted` : ""}</span></div>
        {visibleExams.length ? <div className="category-exam-grid">{visibleExams.map((exam) => {
          const examTests = categoryTests.filter((test) => exam.id.startsWith("general-") ? !test.subcategoryId : test.subcategoryId === exam.id);
          const free = examTests.filter((test) => (test.access ?? "free") === "free").length;
          return <Link className="category-exam-card" key={exam.id} href={examHref(exam)} data-testid={`btn-open-exam-${exam.id}`}>
            <span className="category-exam-logo"><CategoryIcon icon={exam.icon || category.icon} className="h-8 w-8" /></span>
            <h3>{exam.name}</h3><p>{exam.totalTests > 0 ? `${count(exam.totalTests)} tests${free > 0 ? ` · ${count(free)} free` : ""}` : "Syllabus & preparation"}</p><span className="category-exam-action">Explore exam <ArrowRight size={15} /></span>
          </Link>;
        })}</div> : <div className="category-inline-state"><Search size={24} /><div><h3>{query ? "No matching exams" : "Exams are being added"}</h3><p>{query ? "Try a shorter exam name or clear your search." : "Check back for exams in this category."}</p></div>{query ? <button type="button" onClick={() => setExamQuery("")}>Clear search</button> : null}</div>}
      </section>

      <section className="category-section category-preparation" id="category-preparation" aria-labelledby="category-preparation-heading">
        <div className="category-preparation-intro"><span className="category-eyebrow">A LITTLE STRUCTURE. BETTER PREPARATION.</span><h2 id="category-preparation-heading">Build your plan.<br />Then build your confidence.</h2><p>Choose your exam first. Use its syllabus to decide what to study, then practise and review regularly.</p><Link href="/resources">Explore free resources <ArrowRight size={16} /></Link></div>
        <div className="category-plan-grid">{[
          { icon: FileText, title: "Know the syllabus", text: "Check your target exam’s subjects, stages and requirements before choosing a study plan." },
          { icon: Target, title: "Practise with focus", text: "Use topic practice, previous papers and available mocks to strengthen weak areas." },
          { icon: CheckCircle2, title: "Review and improve", text: "Revisit mistakes after each attempt and adjust your next practice session." },
        ].map(({ icon: Icon, title, text }, index) => <article key={title}><span className="category-plan-number">0{index + 1}</span><Icon size={21} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      {guides.length > 0 ? <section className="category-section" aria-labelledby="category-guides-heading"><div className="category-section-head"><div><h2 id="category-guides-heading">Syllabus & preparation guides</h2><p>Go deeper into your chosen exam.</p></div></div><div className="category-guide-grid">{guides.map(({ exam, config }) => <article key={exam.id}><h3>{exam.name}</h3><div><Link href={examSyllabusHref(config.slug)}>Syllabus <ArrowRight size={14} /></Link><Link href={examPreparationHref(config.slug)}>Preparation <ArrowRight size={14} /></Link></div></article>)}</div></section> : null}
      {officialSources.length > 0 ? <section className="category-official" aria-labelledby="category-official-heading"><div><span className="category-eyebrow">STAY INFORMED</span><h2 id="category-official-heading">Official notices & updates</h2><p>Check the official recruitment websites for current notifications, eligibility and dates.</p></div><div>{officialSources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <ExternalLink size={15} /></a>)}</div></section> : null}
      <Link href="/exams" className="category-back"><ArrowLeft size={15} /> Browse all exam categories</Link>
    </div>
  </div>;
}
