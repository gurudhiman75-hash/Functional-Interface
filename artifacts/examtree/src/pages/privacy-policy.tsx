import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const sections = [
  ["Account data", "We may collect name, email, login provider, exam preferences, language preferences, and account status to operate the platform."],
  ["Question interaction data", "We store attempts, selected answers, time spent, flags, and review activity to provide analytics and improve learning workflows."],
  ["Analytics and cookies", "We may use cookies or analytics tools to understand product usage, performance, and reliability. Users can manage browser-level cookie controls."],
  ["Payment handling", "Payments are processed through payment providers. ExamTree does not store full card or bank credentials."],
  ["Multilingual data", "Language choices and multilingual answer interactions may be stored to improve English, Hindi, and Punjabi learning experiences."],
  ["Data safety", "We use reasonable technical and operational safeguards, but no online system can be guaranteed completely secure."],
];

export default function PrivacyPolicy() {
  usePageMeta("Privacy Policy", "ExamTree privacy policy covering account data, analytics, payments, and question interaction data.");

  return (
    <PublicPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains how ExamTree handles account, usage, payment, and learning interaction data."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, text]) => (
          <PublicCard key={title} title={title}>{text}</PublicCard>
        ))}
      </div>
    </PublicPage>
  );
}

