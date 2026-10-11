import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const terms = [
  ["Usage rules", "Use ExamTree for lawful exam preparation only. Do not misuse accounts, disrupt systems, or scrape protected content."],
  ["Content ownership", "Platform design, question workflows, generated content, explanations, and analytics remain owned or licensed by ExamTree unless stated otherwise."],
  ["Mock test usage", "Mock tests are intended for practice and preparation. Performance does not guarantee official exam outcomes."],
  ["Account policies", "We may restrict accounts that violate usage rules, attempt fraud, or abuse support/reporting systems."],
  ["Prohibited behavior", "Do not share paid access, upload harmful files, attack the service, or misrepresent ExamTree content as official government material."],
  ["Generated content disclaimer", "AI-assisted or procedurally generated content is reviewed through platform workflows, but users should report suspected errors for correction."],
];

export default function TermsAndConditions() {
  usePageMeta("Terms & Conditions", "ExamTree terms for mock tests, content usage, account behavior, and generated content disclaimers.");

  return (
    <PublicPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="These terms define acceptable use, content boundaries, account policies, and mock-test disclaimers."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {terms.map(([title, text]) => (
          <PublicCard key={title} title={title}>{text}</PublicCard>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">Business &amp; contact information</h2>
        <p className="mt-2">Website and service: ExamTree. For questions about these terms, accounts, payments, or other support requests, email{" "}
          <a href="mailto:support@examtree.in" className="font-semibold text-indigo-700 underline underline-offset-4">support@examtree.in</a>.
          You can also visit our{" "}
          <Link href="/contact" className="font-semibold text-indigo-700 underline underline-offset-4">Contact Us</Link> page.
        </p>
      </div>
    </PublicPage>
  );
}

