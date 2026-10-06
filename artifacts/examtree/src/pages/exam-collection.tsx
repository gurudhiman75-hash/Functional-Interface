import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, FileText, Target } from "lucide-react";
import { ExamCollectionBanner } from "@/components/ExamCollectionBanner";
import { usePageMeta } from "@/components/PublicPage";
import { EXAM_COLLECTIONS, getExamCollection } from "@/lib/exam-collections";
import { catalogExamCodesForSlug, getExamAcquisitionConfig, examHubHref, examDetailsHref, examPreparationHref, examSyllabusHref } from "@/lib/seo-practice";
import { getStudentTestSeries } from "@/lib/test-series";
import "@/styles/exam-collections.css";

export default function ExamCollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const collection = getExamCollection(slug);
  const seriesQuery = useQuery({ queryKey: ["collection-test-series"], queryFn: getStudentTestSeries, staleTime: 60_000 });
  usePageMeta(collection?.title ?? "Exam Collections", collection?.description ?? "Discover exams by region, qualification and preparation goals.");
  if (!collection) return <main className="collection-page"><Link href="/" className="collection-breadcrumb"><ArrowLeft size={15} /> Home</Link><h1>Explore Exam Collections</h1><p>Choose a collection to find your next exam.</p><div className="exam-collection-banners">{EXAM_COLLECTIONS.map((item) => <ExamCollectionBanner collection={item} key={item.slug} />)}</div></main>;
  const examSlugs = Array.from(new Set(collection.groups.flatMap((group) => group.exams)));
  const codes = new Set(examSlugs.flatMap(catalogExamCodesForSlug));
  const liveSeries = (seriesQuery.data?.series ?? []).filter((series) => codes.has(series.examCode.toUpperCase()) && series.learnerVisibility === "live" && series.liveTestCount > 0).slice(0, 6);
  return <main className="collection-page" data-testid="exam-collection-page">
    <Link href="/collections" className="collection-breadcrumb"><ArrowLeft size={15} /> All collections</Link>
    <ExamCollectionBanner collection={collection} heading />
    <section className="collection-section">
      <h2>Available Test Series</h2><p>Practice prepared for the exams in this collection.</p>
      {seriesQuery.isPending ? <p role="status">Loading available series…</p> : seriesQuery.isError ? <p role="status">Test series could not be loaded. <button type="button" onClick={() => void seriesQuery.refetch()}>Try again</button></p> : liveSeries.length ? <div className="collection-test-grid">{liveSeries.map((series) => <article className="collection-test-card" key={series.id}><h3>{series.name}</h3><p>{series.examName} · {series.liveTestCount} available tests</p><Link href={`/test-series/${series.id}`}>View series <ArrowRight size={15} /></Link></article>)}</div> : <p>Explore the exam hubs below for syllabus, preparation guides and practice options.</p>}
    </section>
    <section className="collection-section" id="collection-exams">
      <h2>{collection.slug === "shared-preparation" ? "Choose your exam combination" : "Find your exam route"}</h2>
      <p>{collection.slug === "shared-preparation" ? "Use these groups to plan shared study, then practise each exam's own pattern." : "Explore the role, selection stages and preparation material for each exam."}</p>
      {collection.groups.map((group) => <div className="collection-group" key={group.title}><h3>{group.title}</h3><p>{group.description}</p><div className="collection-exam-grid">{group.exams.map((examSlug) => {
        const config = getExamAcquisitionConfig(examSlug);
        if (!config) return null;
        return <article key={examSlug} className="collection-exam-card"><h4>{config.name}</h4><p>{config.hub.preparationSummary}</p>
          <Link className="collection-exam-primary" href={examHubHref(examSlug)}>Explore exam <ArrowRight size={15} /></Link>
          <div className="collection-exam-links"><Link href={examDetailsHref(examSlug)}>Exam details</Link><Link href={examSyllabusHref(examSlug)}>Syllabus</Link><Link href={examPreparationHref(examSlug)}>Preparation</Link><a href={config.officialUrl} target="_blank" rel="noopener noreferrer">Official eligibility &amp; notice ↗</a></div>
        </article>;
      })}</div></div>)}
      <p className="collection-notice">Qualifications, age limits, subject requirements and selection stages depend on the post and recruitment cycle. Use each exam's official notice to check your eligibility and current dates.</p>
    </section>
    <section className="collection-section"><h2>Your preparation roadmap</h2><div className="collection-plan-grid">{collection.plan.map((step, index) => <article className="collection-plan-card" key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>
    <section className="collection-section"><h2>Start practising</h2><p>Use the syllabus and preparation links above for exam-specific study. These hubs offer broader practice and resources.</p><div className="collection-resource-links"><Link href="/mock-tests"><Target size={16} /> Mock tests</Link><Link href="/pyqs"><FileText size={16} /> Previous papers</Link><Link href="/resources"><BookOpen size={16} /> Study resources</Link></div></section>
    <section className="collection-section"><h2>Explore another collection</h2><div className="exam-collection-banners">{EXAM_COLLECTIONS.filter((item) => item.slug !== collection.slug).map((item) => <ExamCollectionBanner collection={item} key={item.slug} />)}</div></section>
  </main>;
}
