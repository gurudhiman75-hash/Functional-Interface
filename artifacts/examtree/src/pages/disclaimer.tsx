import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const notices = [
  ["Independent preparation platform", "ExamTree is an independent exam-preparation platform. It is not a government body and is not affiliated with, endorsed by, or an official website of SSC, IBPS, SBI, RRB, PSSSB, the Punjab Government, or other recruiting and examining authorities unless explicitly stated."],
  ["Official information", "Exam dates, vacancies, eligibility rules, syllabi, cut-offs, answer keys, notices, and recruitment conditions can change. Students should verify time-sensitive or consequential information from the relevant official authority before relying on it."],
  ["Practice content", "Mock tests, practice sets, explanations, rankings, analytics, and predicted difficulty are preparation aids. They do not guarantee selection, marks, rank, or any official examination outcome."],
  ["Question quality", "ExamTree uses editorial, structured-generation, localization, and review workflows. Errors or ambiguities can still occur. Students can report a question so it can be reviewed and corrected."],
  ["Third-party names", "Exam names, authority names, logos, trademarks, and other identifiers belong to their respective owners. Their use on ExamTree is for identification, preparation, and informational purposes."],
  ["External services", "Payment providers, authentication providers, and external links may operate under their own terms and privacy practices. ExamTree does not control third-party services outside the platform."],
];

export default function Disclaimer() {
  usePageMeta("Disclaimer", "Important ExamTree disclaimers about official exam information, practice content, third-party names, and independent platform status.");

  return (
    <PublicPage
      eyebrow="Legal"
      title="Disclaimer"
      description="Important boundaries for official information, practice material, exam names, and third-party services."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {notices.map(([title, text]) => (
          <PublicCard key={title} title={title}>{text}</PublicCard>
        ))}
      </div>
    </PublicPage>
  );
}
