import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

export default function RefundPolicy() {
  usePageMeta(
    "Cancellation & Refund Policy",
    "ExamTree cancellation and refund policy for digital mock tests, test series, packages, subscriptions, duplicate payments, and failed access.",
    { canonicalPath: "/cancellation-refund-policy" },
  );

  return (
    <PublicPage
      eyebrow="Legal"
      title="Cancellation & Refund Policy"
      description="How cancellations, duplicate charges, failed access, and eligible refunds are handled for ExamTree digital products."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PublicCard title="Before digital access begins">
          Where a purchase has not yet been delivered or activated, a cancellation request may be reviewed according to the product state, payment status, and applicable consumer requirements.
        </PublicCard>
        <PublicCard title="After access is delivered">
          Once a mock test, test series, package, subscription benefit, or other digital content has been accessed or substantially delivered, cancellation or refund may be limited except where required by law or where ExamTree confirms a qualifying service failure.
        </PublicCard>
        <PublicCard title="Duplicate or incorrect charge">
          Verified duplicate payments, incorrect duplicate captures, or a successful payment with no corresponding entitlement can be reviewed for access correction or refund.
        </PublicCard>
        <PublicCard title="Failed or pending payment">
          A failed or pending payment is not treated as a completed purchase until the payment provider confirms capture. If money was debited without a confirmed purchase, contact support with the provider reference.
        </PublicCard>
        <PublicCard title="Refund processing">
          Approved refunds are sent through the supported payment workflow. The time for the amount to appear can vary by bank, card network, UPI provider, wallet, or other original payment method.
        </PublicCard>
        <PublicCard title="How to request review">
          <p>Contact support with the account identifier, payment ID, purchase date, amount, affected product, and a concise description of the issue. Do not send card numbers, CVV codes, OTPs, UPI PINs, or passwords.</p>
          <Link href="/billing-help" className="mt-3 inline-flex font-semibold text-indigo-700 hover:underline">See Payment & Billing Help</Link>
        </PublicCard>
      </div>
    </PublicPage>
  );
}
