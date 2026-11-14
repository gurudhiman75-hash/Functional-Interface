import { Link } from "wouter";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";

export default function BillingHelp() {
  usePageMeta("Payment & Billing Help", "Help with ExamTree payments, access, duplicate charges, refunds, coupons, receipts, and billing support.");

  return (
    <PublicPage
      eyebrow="Help"
      title="Payment & Billing Help"
      description="What to do when a payment, purchase, refund, coupon, or access status does not look right."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PublicCard title="Payment succeeded but access is missing">
          First sign in with the same account used for the purchase and check My Purchases. If access is still missing, contact support with your payment ID, purchase date, amount, and account email or phone.
        </PublicCard>
        <PublicCard title="Payment failed or is pending">
          Do not repeatedly retry a payment while your bank or payment provider still shows it as pending. If money was debited but the purchase is not confirmed, share the provider payment reference with support.
        </PublicCard>
        <PublicCard title="Duplicate charge">
          If the same purchase was charged more than once, send the payment references for each charge. Verified duplicate payments can be reviewed for correction or refund under the applicable policy.
        </PublicCard>
        <PublicCard title="Coupon or price issue">
          Coupons can have eligibility, expiry, product, account, or usage restrictions. The final payable amount shown before payment is the amount that should be authorized.
        </PublicCard>
        <PublicCard title="Refund status">
          Refund timing can depend on the payment provider and the original payment method. After ExamTree marks an eligible refund as processed, banks and payment providers may take additional time to reflect it.
        </PublicCard>
        <PublicCard title="Need help?">
          <p>Use the structured support form and include enough information to identify the transaction without sharing card numbers, UPI PINs, passwords, or OTPs.</p>
          <Link href="/contact" className="mt-3 inline-flex font-semibold text-indigo-700 hover:underline">Contact support</Link>
        </PublicCard>
      </div>
    </PublicPage>
  );
}
