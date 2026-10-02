import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { SSC_CGL_PRACTICE_TOPICS, practiceTopicHref } from "@/lib/seo-practice";

export default function SscCglHub() {
  usePageMeta(
    "SSC CGL Preparation, Syllabus, Mock Tests & Free Questions",
    "Prepare for SSC CGL with exam guidance, syllabus overview, mock tests, and free topic-wise practice questions on ExamTree.",
  );

  return (
    <PublicPage
      eyebrow="SSC CGL"
      title="SSC CGL preparation hub"
      description="Use one place for preparation strategy, syllabus guidance, mock tests, and free topic-wise questions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <PublicCard title="Preparation guide">
          Build a practical study order across Quantitative Aptitude, Reasoning, General Awareness, and English.
          <Link href="/ssc-cgl-preparation" className="mt-3 block font-semibold text-indigo-700 hover:underline">How to prepare for SSC CGL</Link>
        </PublicCard>
        <PublicCard title="Syllabus & pattern">
          Review the current Tier-I structure and major preparation areas before planning your practice.
          <Link href="/ssc-cgl-syllabus" className="mt-3 block font-semibold text-indigo-700 hover:underline">SSC CGL syllabus</Link>
        </PublicCard>
        <PublicCard title="Mock tests">
          Move from topic practice to timed exam-style attempts using the published ExamTree catalogue.
          <Link href="/category/ssc" className="mt-3 block font-semibold text-indigo-700 hover:underline">Browse SSC mock tests</Link>
        </PublicCard>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Free SSC CGL practice questions</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Open a topic, solve the visible questions without starting a full mock, then reveal the answer and explanation when you are ready.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SSC_CGL_PRACTICE_TOPICS.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">{topic.subject}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{topic.name} Questions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
