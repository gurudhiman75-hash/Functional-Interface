import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

export default function RefundPolicy() {
  usePageMeta("Refund Policy", "ExamTree refund policy for mock purchases, premium plans, and future subscriptions.");

  return (
    <PublicPage
      eyebrow="Legal"
      title="Refund Policy"
      description="A clear refund structure for mock purchases, premium plans, and future subscriptions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <PublicCard title="Digital access">
          Once a mock test or package is accessed, refunds may be limited because the digital product has been delivered.
        </PublicCard>
        <PublicCard title="Duplicate payments">
          Verified duplicate payments or failed-access payments can be reviewed for refund or access correction.
        </PublicCard>
        <PublicCard title="How to request">
          Contact support with payment ID, account email, purchase date, and issue details within the stated review window.
        </PublicCard>
      </div>
    </PublicPage>
  );
}

