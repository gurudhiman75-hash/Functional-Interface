import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const tierOneSubjects = [
  ["General Intelligence & Reasoning", "25 questions · 50 marks"],
  ["General Awareness", "25 questions · 50 marks"],
  ["Quantitative Aptitude", "25 questions · 50 marks"],
  ["English Comprehension", "25 questions · 50 marks"],
];

export default function SscCglSyllabus() {
  usePageMeta(
    "SSC CGL Syllabus & Tier-I Exam Pattern 2026",
    "SSC CGL 2026 Tier-I syllabus overview, subject structure, marking pattern, and preparation links based on the official SSC notice.",
  );

  return (
    <PublicPage
      eyebrow="SSC CGL syllabus"
      title="SSC CGL syllabus and Tier-I pattern 2026"
      description="A learner-friendly overview based on the SSC Combined Graduate Level Examination 2026 notice. Always verify time-sensitive changes on the official SSC website."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {tierOneSubjects.map(([title, text]) => <PublicCard key={title} title={title}>{text}</PublicCard>)}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <PublicCard title="Tier-I format">
          Tier-I is an objective computer-based examination. The 2026 notice lists 100 questions for 200 marks across the four subjects above.
        </PublicCard>
        <PublicCard title="Timing">
          The 2026 notice provides one hour for Tier-I, with sectional timing specified by SSC. Candidates eligible for a scribe receive the applicable extra time under the notice.
        </PublicCard>
        <PublicCard title="Negative marking">
          The 2026 SSC CGL notice states a deduction of 0.50 marks for each wrong answer in Tier-I.
        </PublicCard>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        Recruitment rules and schedules can change. Check the latest Combined Graduate Level notice on <a href="https://ssc.gov.in" target="_blank" rel="noreferrer" className="font-semibold underline">ssc.gov.in</a> before relying on dates, eligibility, vacancies, or detailed scheme provisions.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/ssc-cgl-preparation" className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">How to prepare</Link>
        <Link href="/ssc-cgl" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">SSC CGL hub</Link>
      </div>
    </PublicPage>
  );
}
