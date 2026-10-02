import { Link } from "wouter";
import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { SSC_CGL_PRACTICE_TOPICS, practiceTopicHref } from "@/lib/seo-practice";

export default function SscCglPreparation() {
  usePageMeta(
    "How to Prepare for SSC CGL 2026",
    "A practical SSC CGL 2026 preparation guide covering study order, topic practice, revision, mocks, and error analysis.",
  );

  return (
    <PublicPage
      eyebrow="SSC CGL preparation"
      title="How to prepare for SSC CGL 2026"
      description="A practical preparation workflow built around concept coverage, repeated question practice, timed mocks, and review."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <PublicCard title="1. Build the base">
          Start with the recurring core topics in Quant and Reasoning while keeping English and General Awareness in daily rotation.
        </PublicCard>
        <PublicCard title="2. Practise by topic">
          After learning a concept, solve a small focused set immediately. Accuracy should become stable before you chase speed.
        </PublicCard>
        <PublicCard title="3. Convert practice into mocks">
          Add sectional and full-length timed attempts, then maintain an error log for concepts, calculation mistakes, guesses, and time traps.
        </PublicCard>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-950">A workable weekly cycle</h2>
        <div className="mt-4 text-sm leading-7 text-slate-600">
          <CheckList items={[
            "Learn or revise one focused concept block.",
            "Solve 10-20 targeted questions from that topic.",
            "Rework every incorrect or guessed question without looking at the answer.",
            "Take timed sectional practice during the week.",
            "Take a full mock at regular intervals and review it more carefully than you attempted it.",
            "Revisit weak topics using fresh questions instead of repeatedly reading notes.",
          ]} />
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-950">Start with free topic practice</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SSC_CGL_PRACTICE_TOPICS.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:border-indigo-300 hover:bg-white">
              {topic.name} questions
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/ssc-cgl-syllabus" className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">View SSC CGL syllabus</Link>
        <Link href="/category/ssc" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Browse SSC mock tests</Link>
      </div>
    </PublicPage>
  );
}
