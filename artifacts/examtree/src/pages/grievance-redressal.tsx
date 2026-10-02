import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

const SUPPORT_EMAIL = "support@examtree.in";

export default function GrievanceRedressal() {
  usePageMeta("Grievance Redressal", "How to raise and escalate an ExamTree account, payment, privacy, content, or service grievance.");

  return (
    <PublicPage
      eyebrow="Support"
      title="Grievance Redressal"
      description="A clear path for raising account, payment, privacy, content, or service concerns."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PublicCard title="How to raise a grievance">
          Email <a className="font-semibold text-indigo-700 hover:underline" href={"mailto:" + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a> with your account identifier, issue category, relevant order or question ID, dates, and a concise description of the problem.
        </PublicCard>
        <PublicCard title="What not to send">
          Never send passwords, OTPs, UPI PINs, complete card numbers, CVV codes, or other authentication secrets. Screenshots should be cropped or redacted where they contain sensitive information.
        </PublicCard>
        <PublicCard title="Review and response">
          ExamTree will review the information available for the request and may ask for additional non-sensitive details where necessary to verify the account, transaction, content item, or affected feature.
        </PublicCard>
        <PublicCard title="Privacy concerns">
          For privacy, data access, correction, or account deletion matters, use the same support address and refer to the Privacy Policy and Account Deletion pages for the relevant process.
        </PublicCard>
        <PublicCard title="Payment concerns">
          Include the provider payment ID, date, amount, and affected purchase. Eligibility for cancellation or refund is governed by the Cancellation & Refund Policy.
        </PublicCard>
        <PublicCard title="Start a support request">
          <p>The Contact page prepares a structured email so the request reaches support with the information needed for review.</p>
          <Link href="/contact" className="mt-3 inline-flex font-semibold text-indigo-700 hover:underline">Open Contact Us</Link>
        </PublicCard>
      </div>
    </PublicPage>
  );
}
