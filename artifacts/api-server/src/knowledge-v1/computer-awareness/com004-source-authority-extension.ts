import type { Com004SourceAuthority } from "./com004-source-manifest";

/**
 * First-party technical/safety authorities added after discovery R1.
 *
 * These sources do not broaden COM-004 scope. They provide canonical truth for
 * candidate facts that the syllabus identifies but does not define precisely.
 */
export const COM004_SOURCE_AUTHORITY_EXTENSION: readonly Com004SourceAuthority[] = [
  {
    sourceId: "RBI-FAME-2024",
    title: "Reserve Bank of India — Financial Awareness Messages (FAME)",
    url: "https://www.rbi.org.in/commonperson/images/FAME202426022024.pdf",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: [
      "credential-secrecy",
      "otp-never-share",
      "pin-never-share",
      "card-details-never-share",
      "cvv-never-share",
      "safe-digital-banking",
    ],
    verifiedOn: "2026-09-06",
    notes: [
      "RBI consumer-awareness authority explicitly instructs users not to share card details, CVV, PIN or OTP.",
      "Use only for durable safe-action facts; fraud/threat taxonomy remains COM-006.",
    ],
  },
  {
    sourceId: "RBI-BEAWARE-2022",
    title: "Reserve Bank of India — BE(A)WARE: Be Aware and Beware",
    url: "https://cms.rbi.org.in/cms/assets/Documents/BEAWARE07032022.pdf",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: [
      "safe-digital-banking",
      "credential-secrecy",
      "suspicious-contact-response",
      "unauthorised-transaction-response",
    ],
    verifiedOn: "2026-09-06",
    notes: [
      "RBI Ombudsman consumer-awareness booklet gives durable precautions for digital-banking fraud scenarios.",
      "COM-004 consumes the safe user action only, not vishing/phishing taxonomy as a learner target.",
    ],
  },
  {
    sourceId: "RBI-PPI-FAQ-2022",
    title: "Reserve Bank of India — Prepaid Payment Instruments (PPIs) FAQ",
    url: "https://www.rbi.org.in/Commonman/English/Scripts/FAQs.aspx?Id=2812",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: [
      "prepaid-payment-instrument",
      "stored-value-payment",
      "wallet-payment-concept",
    ],
    verifiedOn: "2026-09-06",
    notes: [
      "RBI defines PPIs as instruments enabling purchases/financial services/remittance against value stored in the instrument.",
      "Use for durable e-wallet/prepaid-value semantics, not mutable limits or KYC thresholds.",
    ],
  },
] as const;
