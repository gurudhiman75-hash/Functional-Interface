export type Com004SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  authorityClass:
    | "OFFICIAL_EXAM"
    | "OFFICIAL_CURRICULUM"
    | "STANDARDS_AUTHORITY"
    | "PRODUCT_AUTHORITY"
    | "REGULATOR_AUTHORITY"
    | "PYQ_EVIDENCE";
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

/**
 * Governed source/evidence manifest for COM-004 / Internet, Web, E-mail &
 * Digital Services.
 *
 * Scope authorities prove exam/curriculum demand. Standards, product-owner
 * and regulator sources establish technical truth. PYQ mirrors establish
 * exam-real learner tasks only; they are never promoted over first-party
 * technical authority for canonical facts.
 */
export const COM004_SOURCE_AUTHORITIES: Com004SourceAuthority[] = [
  {
    sourceId: "SSC-CHSL-2024-NOTICE",
    title: "SSC Combined Higher Secondary (10+2) Level Examination 2024 notice",
    url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice%20of%20CHSLE%202024_05_04_24.pdf",
    authorityClass: "OFFICIAL_EXAM",
    supports: [
      "scope:web-browsing-searching",
      "scope:downloading-uploading",
      "scope:email-account-management",
      "scope:e-banking",
      "boundary:networking-cyber-security-separate",
    ],
    verifiedOn: "2026-09-06",
    notes: [
      "SSC explicitly lists Working with Internet and e-mails: Web Browsing & Searching, Downloading & Uploading, Managing an E-mail Account, e-Banking.",
      "Use as exam-scope authority, not as protocol/payment-system technical authority.",
    ],
  },
  {
    sourceId: "NIELIT-CCC-REV4-2023",
    title: "NIELIT Course on Computer Concepts Revision 4 syllabus",
    url: "https://www.nielit.gov.in/sites/default/files/headquarter/pdf/20231006_CCC_Revised_Syllabus.pdf",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "internet-www",
      "web-browsing",
      "search-engines",
      "email-structure",
      "email-operations",
      "email-attachments-signatures",
      "e-commerce",
      "e-governance",
      "netiquette",
      "otp-qr",
      "upi",
      "aeps",
      "ussd",
      "cards",
      "ewallet",
      "pos",
      "internet-banking",
      "neft",
      "rtgs",
      "imps",
    ],
    verifiedOn: "2026-09-06",
    notes: [
      "Primary government curriculum breadth anchor for COM-004.",
      "The syllabus writes UPI as Unified Payment Interface; product-owner NPCI authority controls the canonical expansion Unified Payments Interface.",
    ],
  },
  {
    sourceId: "NIELIT-CCC-LMS-2026",
    title: "NIELIT Virtual Academy — Course on Computer Concepts",
    url: "https://lms.nielit.gov.in/course/view.php?id=21",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "internet-www",
      "email",
      "social-networking",
      "e-commerce-e-governance",
      "digital-financial-tools",
    ],
    verifiedOn: "2026-09-06",
    notes: ["Current NIELIT learning-surface confirmation for Chapters 6, 7 and 8."],
  },
  {
    sourceId: "WHATWG-URL-STANDARD-2026",
    title: "WHATWG URL Standard",
    url: "https://url.spec.whatwg.org/",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["url", "url-scheme", "url-host", "url-path", "web-addressing"],
    verifiedOn: "2026-09-06",
    notes: [
      "Standards authority for URL structure.",
      "Generation must stay at awareness depth and must not imply a URL is only a website address.",
    ],
  },
  {
    sourceId: "IETF-HTTP-RFC9110",
    title: "RFC 9110 — HTTP Semantics",
    url: "https://www.rfc-editor.org/rfc/rfc9110",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["http", "web-protocol-purpose", "http-semantics"],
    verifiedOn: "2026-09-06",
    notes: ["Use for durable HTTP identity/purpose only; protocol-stack mechanics remain COM-005."],
  },
  {
    sourceId: "IETF-SMTP-RFC5321",
    title: "RFC 5321 — Simple Mail Transfer Protocol",
    url: "https://datatracker.ietf.org/doc/html/rfc5321",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["smtp", "email-transport", "email-sending"],
    verifiedOn: "2026-09-06",
    notes: ["SMTP is canonical authority for electronic-mail transport; COM-004 uses only awareness-level sending/transport identity."],
  },
  {
    sourceId: "IETF-MAIL-SUBMISSION-RFC6409",
    title: "RFC 6409 — Message Submission for Mail",
    url: "https://datatracker.ietf.org/doc/html/rfc6409",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["email-submission", "smtp-vs-pop-imap", "mail-access-boundary"],
    verifiedOn: "2026-09-06",
    notes: ["Explicitly distinguishes SMTP/message submission from POP3 or IMAP access to delivered messages."],
  },
  {
    sourceId: "IETF-IMAP-RFC9051",
    title: "RFC 9051 — Internet Message Access Protocol (IMAP) Version 4rev2",
    url: "https://datatracker.ietf.org/doc/html/rfc9051",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["imap", "mailbox-access", "server-mailbox-synchronisation"],
    verifiedOn: "2026-09-06",
    notes: ["Use at awareness depth: access/manipulate server mailboxes; do not author low-level protocol mechanics."],
  },
  {
    sourceId: "IETF-POP3-RFC1939",
    title: "RFC 1939 — Post Office Protocol Version 3",
    url: "https://www.rfc-editor.org/rfc/rfc1939",
    authorityClass: "STANDARDS_AUTHORITY",
    supports: ["pop3", "mail-retrieval", "email-access"],
    verifiedOn: "2026-09-06",
    notes: ["Use only for durable POP3 retrieval/access identity; avoid oversimplified delete/local-only claims."],
  },
  {
    sourceId: "NPCI-UPI-PRODUCT-2026",
    title: "NPCI — Unified Payments Interface (UPI)",
    url: "https://www.npci.org.in/product/upi",
    authorityClass: "PRODUCT_AUTHORITY",
    supports: ["upi", "unified-payments-interface", "bank-account-transfer", "merchant-payment", "upi-id", "qr-payment"],
    verifiedOn: "2026-09-06",
    notes: [
      "Product owner controls canonical UPI naming and durable purpose facts.",
      "Canonical expansion is Unified Payments Interface.",
    ],
  },
  {
    sourceId: "NPCI-IMPS-BOOKLET-2026",
    title: "NPCI — IMPS Product Booklet",
    url: "https://www.npci.org.in/PDF/npci/imps/Product-Booklet.pdf",
    authorityClass: "PRODUCT_AUTHORITY",
    supports: ["imps", "immediate-payment-service", "instant-interbank-transfer", "24x7-service"],
    verifiedOn: "2026-09-06",
    notes: ["Product-owner authority for IMPS identity and instant real-time fund-transfer purpose."],
  },
  {
    sourceId: "NPCI-AEPS-BOOKLET-2026",
    title: "NPCI — Aadhaar Enabled Payment System Product Booklet",
    url: "https://www.npci.org.in/PDF/AePS/Product-Booklet.pdf",
    authorityClass: "PRODUCT_AUTHORITY",
    supports: ["aeps", "aadhaar-enabled-payment-system", "aadhaar-authentication", "assisted-banking"],
    verifiedOn: "2026-09-06",
    notes: ["Product-owner authority for AePS identity and Aadhaar-authenticated assisted banking use."],
  },
  {
    sourceId: "NPCI-USSD-99-REFERENCE",
    title: "NPCI — *99# USSD mobile banking reference",
    url: "https://www.npci.org.in/PDF/npci/newsletter/Volume-III/NPCI_eNewsletter_March.pdf",
    authorityClass: "PRODUCT_AUTHORITY",
    supports: ["ussd", "unstructured-supplementary-service-data", "99-service", "mobile-banking-without-data"],
    verifiedOn: "2026-09-06",
    notes: ["Product-owner reference for the *99# USSD mobile-banking concept; exclude operator/bank-specific transient codes."],
  },
  {
    sourceId: "RBI-NEFT-FAQ-2024",
    title: "Reserve Bank of India — National Electronic Funds Transfer (NEFT) FAQ",
    url: "https://www.rbi.org.in/scripts/FAQView.aspx?Id=60",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: ["neft", "national-electronic-funds-transfer", "batch-settlement", "24x7"],
    verifiedOn: "2026-09-06",
    notes: [
      "Regulator authority for NEFT identity and batch-based settlement model.",
      "Avoid converting mutable timing/limit details into immutable question facts.",
    ],
  },
  {
    sourceId: "RBI-RTGS-FAQ-2022",
    title: "Reserve Bank of India — Real Time Gross Settlement System FAQ",
    url: "https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: ["rtgs", "real-time-gross-settlement", "real-time", "gross-settlement", "transaction-by-transaction"],
    verifiedOn: "2026-09-06",
    notes: ["Regulator authority for RTGS expansion and real-time/gross conceptual meaning."],
  },
  {
    sourceId: "RBI-CPS-FAQ-2021",
    title: "Reserve Bank of India — Access for Non-banks to Centralised Payment Systems FAQ",
    url: "https://www.rbi.org.in/scripts/faqview.aspx/upload/FAQView.aspx?Id=144",
    authorityClass: "REGULATOR_AUTHORITY",
    supports: ["rtgs-vs-neft", "neft-batch", "rtgs-gross", "payment-system-ownership"],
    verifiedOn: "2026-09-06",
    notes: ["Useful first-party comparison authority for RTGS and NEFT settlement models."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2022-WEB-BROWSER",
    title: "SSC CHSL Tier-I 2022 official-paper question — software used to view/navigate WWW",
    url: "https://testbook.com/question-answer/which-of-the-following-is-used-to-view-pages-and-n--642d3c2a50b3b63f656e5d52",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:web-browser-purpose", "task:browser-from-function"],
    verifiedOn: "2026-09-06",
    notes: ["Held 16 March 2023 Shift 1; correct answer Web Browser. Technical truth remains standards/curriculum sourced."],
  },
  {
    sourceId: "PYQ-SSC-JE-2020-BROWSER-CLASSIFICATION",
    title: "SSC JE 2020 official-paper question — identify item that is not a browser",
    url: "https://testbook.com/question-answer/which-of-the-following-is-not-a-browser--5ffc67bb420ad806cd4d47c1",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:browser-classification", "task:browser-vs-service"],
    verifiedOn: "2026-09-06",
    notes: ["Confirms browser classification as an exam-real learner task."],
  },
  {
    sourceId: "PYQ-SSC-JE-2020-NEFT",
    title: "SSC JE 2020 official-paper question — NEFT full form",
    url: "https://testbook.com/question-answer/with-respect-to-indian-banking-transactions-what--5ff835d008a294f762676fa1",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:neft-expansion", "task:payment-acronym-expansion"],
    verifiedOn: "2026-09-06",
    notes: ["Confirms payment-system acronym expansion as an SSC learner demand."],
  },
  {
    sourceId: "PYQ-DELHI-POLICE-2020-IMPS",
    title: "Delhi Police Constable 2020 official-paper question — IMPS full form",
    url: "https://testbook.com/question-answer/what-is-the-full-form-of-imps-in-the-context-of-e--68fc892b00837b68c9c1a37c",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:imps-expansion", "task:payment-acronym-expansion"],
    verifiedOn: "2026-09-06",
    notes: ["Confirms IMPS expansion as an exam-real e-banking task."],
  },
  {
    sourceId: "PYQ-ITBP-2017-TRANSFER-SERVICES",
    title: "ITBP Head Constable 2017 official-paper question — RTGS/NEFT/IMPS activity classification",
    url: "https://testbook.com/question-answer/rtgs-neft-and-imps-pertain-to-which-activity--636e4b11ef344bc7a4566df1",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:neft-rtgs-imps-classification", "task:service-category"],
    verifiedOn: "2026-09-06",
    notes: ["Confirms electronic-fund-transfer service classification demand."],
  },
];

export function auditCom004SourceManifest() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM004_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn)) issues.push(`INVALID_VERIFIED_DATE:${source.sourceId}`);
  }

  const pyqCount = COM004_SOURCE_AUTHORITIES.filter((source) => source.authorityClass === "PYQ_EVIDENCE").length;
  const officialScopeCount = COM004_SOURCE_AUTHORITIES.filter((source) =>
    source.authorityClass === "OFFICIAL_EXAM" || source.authorityClass === "OFFICIAL_CURRICULUM",
  ).length;
  const technicalAuthorityCount = COM004_SOURCE_AUTHORITIES.filter((source) =>
    source.authorityClass === "STANDARDS_AUTHORITY" ||
    source.authorityClass === "PRODUCT_AUTHORITY" ||
    source.authorityClass === "REGULATOR_AUTHORITY",
  ).length;

  if (officialScopeCount < 3) issues.push(`THIN_OFFICIAL_SCOPE:${officialScopeCount}`);
  if (technicalAuthorityCount < 12) issues.push(`THIN_TECHNICAL_AUTHORITY:${technicalAuthorityCount}`);
  if (pyqCount < 5) issues.push(`THIN_PYQ_EVIDENCE:${pyqCount}`);

  const requiredSupports = [
    "scope:web-browsing-searching",
    "internet-www",
    "email-structure",
    "smtp",
    "imap",
    "pop3",
    "upi",
    "aeps",
    "ussd",
    "neft",
    "rtgs",
    "imps",
  ];
  const supports = new Set(COM004_SOURCE_AUTHORITIES.flatMap((source) => source.supports));
  for (const support of requiredSupports) {
    if (!supports.has(support)) issues.push(`MISSING_REQUIRED_SUPPORT:${support}`);
  }

  return {
    valid: issues.length === 0,
    sourceCount: COM004_SOURCE_AUTHORITIES.length,
    pyqCount,
    officialScopeCount,
    technicalAuthorityCount,
    supportScopes: [...supports].sort(),
    issues,
  };
}
