import { Link } from "wouter";

import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const sections = [
  ["Account data", "We may collect name, email, login provider, exam preferences, language preferences, and account status to operate the platform."],
  ["Question interaction data", "We store attempts, selected answers, time spent, flags, and review activity to provide results, analytics, saved progress, and learning workflows."],
  ["Analytics and cookies", "We may use cookies or analytics tools to understand product usage, performance, security, and reliability. Users can manage browser-level cookie controls."],
  ["Payment handling", "Payments are processed through payment providers. ExamTree does not store full card or bank credentials."],
  ["Multilingual data", "Language choices and multilingual answer interactions may be stored to support English, Hindi, and Punjabi learning experiences."],
  ["Data safety", "We use reasonable technical and operational safeguards, but no online system can be guaranteed completely secure."],
  ["Account deletion", "Learners can request account deletion from the ExamTree mobile app or the web deletion page. Learner profile data, attempts, results, active entitlements, and other learner-owned learning history are erased as part of the canonical deletion process."],
  ["Limited retention", "Where ExamTree has a legitimate financial or security record-keeping obligation, limited order, redemption, or audit records may be retained after deletion. Retained records are attached only to an anonymized account tombstone rather than your active email/name identity."],
  ["Contact", "For privacy questions or deletion assistance, contact support@examtree.in."],
];

export default function PrivacyPolicy() {
  usePageMeta("Privacy Policy", "ExamTree privacy policy covering account data, learning interactions, payments, retention, and account deletion.");

  return (
    <PublicPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains how ExamTree handles account, usage, payment, learning interaction, retention, and deletion data."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, text]) => (
          <PublicCard key={title} title={title}>{text}</PublicCard>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
        <p className="font-semibold text-foreground">Delete your account</p>
        <p className="mt-1">
          You can start a verified deletion request at{" "}
          <Link href="/account-deletion" className="font-medium text-primary underline underline-offset-4">
            examtree.in/account-deletion
          </Link>.
        </p>
      </div>
    </PublicPage>
  );
}
