import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

export default function About() {
  usePageMeta(
    "About Us",
    "Learn how ExamTree supports mock tests, PYQs, AI-assisted question workflows, and multilingual exam preparation.",
  );

  return (
    <PublicPage
      eyebrow="About ExamTree"
      title="A serious mock-test platform for serious aspirants."
      description="ExamTree is built for structured exam preparation across SSC, Banking, Punjab State exams, and other competitive test pathways."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <PublicCard title="Our mission">
          Make high-quality mock tests, previous year questions, and performance diagnosis easier to discover, practise, and review.
        </PublicCard>
        <PublicCard title="What we cover">
          SSC CGL, CHSL, Banking exams, Punjab Police, PSSSB, RRB, Computer Awareness, General Knowledge, Quant, and Reasoning.
        </PublicCard>
        <PublicCard title="How we work">
          We combine structured question banks, AI-assisted content workflows, human review, and multilingual realization for reliable practice.
        </PublicCard>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-950">Platform principles</h2>
        <div className="mt-4 text-sm leading-relaxed text-slate-600">
          <CheckList
            items={[
              "Exam-first discovery instead of generic course browsing.",
              "Mock testing, PYQs, and practice analytics in one workflow.",
              "Multilingual support for English, Hindi, and Punjabi where verified content is available.",
              "Human verification before high-stakes generated or ingested content enters the bank.",
            ]}
          />
        </div>
      </div>
    </PublicPage>
  );
}

