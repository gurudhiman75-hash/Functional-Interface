export type Com004SaturationDisposition =
  | "KEEP_DISTINCT_CANDIDATE"
  | "MERGE_WITH_EXISTING"
  | "DELEGATE_COM005"
  | "DELEGATE_COM006"
  | "DELEGATE_BANKING_AWARENESS"
  | "NEEDS_MORE_EVIDENCE"
  | "REJECT_SOURCE_THIN";

export type Com004SaturationSource = {
  sourceId: string;
  authorityClass: "OFFICIAL_EXAM" | "OFFICIAL_CURRICULUM" | "STANDARDS" | "REGULATOR" | "EXAM_CORPUS" | "PYQ_EVIDENCE";
  examFamilies: ("SSC" | "BANKING" | "PUNJAB" | "GENERAL_GOVT")[];
  label: string;
  evidenceUse: string;
};

export type Com004SourcePattern = {
  patternId: string;
  learnerDemand: string;
  sourceIds: string[];
  examFamilies: ("SSC" | "BANKING" | "PUNJAB" | "GENERAL_GOVT")[];
  candidateLink?: string;
  provisionalDisposition: Com004SaturationDisposition;
  dispositionReason: string;
  ownershipNotes?: string[];
};

export const COM004_SATURATION_SOURCES_V1: Com004SaturationSource[] = [
  {
    sourceId: "SAT-SRC-SSC-CGL-2026",
    authorityClass: "OFFICIAL_EXAM",
    examFamilies: ["SSC"],
    label: "SSC CGL 2026 official notice",
    evidenceUse: "Explicitly names Web Browsing & Searching, Downloading & Uploading, Managing an E-mail Account and e-Banking.",
  },
  {
    sourceId: "SAT-SRC-PSEB-8-2026",
    authorityClass: "OFFICIAL_CURRICULUM",
    examFamilies: ["PUNJAB"],
    label: "PSEB Class 8 Computer Science syllabus 2026-27 — Internet Fundamentals",
    evidenceUse: "Names Internet definition/history, facilities/services, web browsing/searching, e-mail, online shopping, banking operations, chatting, video conferencing, ISP and Internet connections.",
  },
  {
    sourceId: "SAT-SRC-PUNJAB-PAPER-2026",
    authorityClass: "PYQ_EVIDENCE",
    examFamilies: ["PUNJAB"],
    label: "Punjab computer paper evidence — Internet/e-mail operational wording",
    evidenceUse: "Directly tests e-mail, downloading direction and Internet-service concepts; used only as pattern evidence pending official-paper provenance where needed.",
  },
  {
    sourceId: "SAT-SRC-OLIVE-INTERNET-2026",
    authorityClass: "EXAM_CORPUS",
    examFamilies: ["BANKING", "SSC"],
    label: "Oliveboard Internet & Web bank-exam corpus 2026",
    evidenceUse: "Broad recurring pattern evidence for Internet/WWW, browser/search, URL/DNS, HTTP/HTTPS, protocols, e-mail and network-adjacent concepts.",
  },
  {
    sourceId: "SAT-SRC-TESTBOOK-INTERNET-2026",
    authorityClass: "EXAM_CORPUS",
    examFamilies: ["SSC", "BANKING", "GENERAL_GOVT"],
    label: "Testbook Basics of Internet / Internet MCQ corpus 2026",
    evidenceUse: "Current exam-style evidence for Bcc, attachments, Internet services, VoIP, browser/search, Internet history and e-mail history.",
  },
  {
    sourceId: "SAT-SRC-TESTBOOK-EBANKING-2026",
    authorityClass: "EXAM_CORPUS",
    examFamilies: ["BANKING", "SSC"],
    label: "Testbook Internet banking MCQ corpus 2026",
    evidenceUse: "Recurring e-banking capability patterns such as statements, balance inquiry and fund transfer.",
  },
  {
    sourceId: "SAT-SRC-MDN-WEB",
    authorityClass: "STANDARDS",
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    label: "MDN Web/URL/HTTP references",
    evidenceUse: "Canonical semantics for Internet-vs-Web framing, URL structure and HTTP/HTTPS without relying on coaching-source wording.",
  },
  {
    sourceId: "SAT-SRC-IETF-MAIL",
    authorityClass: "STANDARDS",
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    label: "IETF/RFC Editor SMTP, IMAP and POP3 specifications",
    evidenceUse: "Canonical protocol-role truth for e-mail transport/access; detailed ports remain outside COM-004 ownership.",
  },
  {
    sourceId: "SAT-SRC-RBI-SAFETY",
    authorityClass: "REGULATOR",
    examFamilies: ["BANKING", "SSC", "PUNJAB"],
    label: "RBI safeguards for digital banking",
    evidenceUse: "Canonical safe-use guidance for verified secure sites, credential/OTP/PIN secrecy and avoiding public/open networks.",
  },
];

export const COM004_SOURCE_PATTERNS_V1: Com004SourcePattern[] = [
  {
    patternId: "COM004-SAT-PAT-001",
    learnerDemand: "Internet as a network of networks",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-TESTBOOK-INTERNET-2026", "SAT-SRC-PSEB-8-2026"],
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-001",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Direct, durable and cross-exam core concept.",
  },
  {
    patternId: "COM004-SAT-PAT-002",
    learnerDemand: "Internet versus World Wide Web",
    sourceIds: ["SAT-SRC-MDN-WEB", "SAT-SRC-OLIVE-INTERNET-2026"],
    examFamilies: ["SSC", "BANKING"],
    candidateLink: "WEB-DISC-002",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Material misconception boundary; not merely alternate wording of Internet definition.",
  },
  {
    patternId: "COM004-SAT-PAT-003",
    learnerDemand: "Browser versus search engine",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-PSEB-8-2026", "SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-006",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Repeated user-facing classification error across sources.",
  },
  {
    patternId: "COM004-SAT-PAT-004",
    learnerDemand: "Specific browser product identity",
    sourceIds: ["SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-TESTBOOK-INTERNET-2026", "SAT-SRC-PSEB-8-2026"],
    examFamilies: ["BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-007",
    provisionalDisposition: "MERGE_WITH_EXISTING",
    dispositionReason: "Likely a surface/object-pool variant of browser-vs-search-engine classification rather than a separate learner task.",
  },
  {
    patternId: "COM004-SAT-PAT-005",
    learnerDemand: "Specific search-engine product identity",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-PSEB-8-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["SSC", "PUNJAB"],
    candidateLink: "WEB-DISC-008",
    provisionalDisposition: "MERGE_WITH_EXISTING",
    dispositionReason: "Likely same classification authority as browser-vs-search-engine unless PYQs prove separate demand.",
  },
  {
    patternId: "COM004-SAT-PAT-006",
    learnerDemand: "Downloading versus uploading by transfer direction",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-PSEB-8-2026", "SAT-SRC-PUNJAB-PAPER-2026"],
    examFamilies: ["SSC", "PUNJAB"],
    candidateLink: "WEB-DISC-011",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Explicit official SSC scope and direct Punjab operational question pattern.",
  },
  {
    patternId: "COM004-SAT-PAT-007",
    learnerDemand: "URL as web/resource address",
    sourceIds: ["SAT-SRC-MDN-WEB", "SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["SSC", "BANKING", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-013",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Durable high-frequency awareness concept with strong standards truth source.",
  },
  {
    patternId: "COM004-SAT-PAT-008",
    learnerDemand: "URL scheme/domain/path component recognition",
    sourceIds: ["SAT-SRC-MDN-WEB", "SAT-SRC-OLIVE-INTERNET-2026"],
    examFamilies: ["SSC", "BANKING"],
    candidateLink: "WEB-DISC-014",
    provisionalDisposition: "NEEDS_MORE_EVIDENCE",
    dispositionReason: "Technically valid but needs stronger PYQ/source frequency before separate permanent authority.",
  },
  {
    patternId: "COM004-SAT-PAT-009",
    learnerDemand: "HTTP versus HTTPS user-facing role/security distinction",
    sourceIds: ["SAT-SRC-MDN-WEB", "SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-RBI-SAFETY"],
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-017",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Strong Web-use and digital-safety relevance; preserve secure-site nuance.",
    ownershipNotes: ["Ports, OSI/TCP-IP placement and transport mechanics delegate to COM-005."],
  },
  {
    patternId: "COM004-SAT-PAT-010",
    learnerDemand: "E-mail address structure and @ separator",
    sourceIds: ["SAT-SRC-TESTBOOK-INTERNET-2026", "SAT-SRC-PSEB-8-2026"],
    examFamilies: ["GENERAL_GOVT", "PUNJAB"],
    candidateLink: "WEB-DISC-020",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Stable and recurrent basic e-mail mechanics.",
  },
  {
    patternId: "COM004-SAT-PAT-011",
    learnerDemand: "To/Cc/Bcc recipient-field semantics",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["SSC", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-021",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Direct e-mail-account-management demand and recurring exam question form.",
  },
  {
    patternId: "COM004-SAT-PAT-012",
    learnerDemand: "Attachment identity/use",
    sourceIds: ["SAT-SRC-PSEB-8-2026", "SAT-SRC-PUNJAB-PAPER-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["PUNJAB", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-024",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Repeated concrete e-mail-management operation with Punjab evidence.",
  },
  {
    patternId: "COM004-SAT-PAT-013",
    learnerDemand: "Inbox/Sent/Drafts/Spam/Trash folder roles",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["SSC", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-025",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Fits explicit managing-an-e-mail-account scope; provider-label aliases need normalization.",
  },
  {
    patternId: "COM004-SAT-PAT-014",
    learnerDemand: "SMTP versus POP3 versus IMAP by broad e-mail role",
    sourceIds: ["SAT-SRC-IETF-MAIL", "SAT-SRC-OLIVE-INTERNET-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["BANKING", "SSC", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-030",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Frequent protocol-role learner demand; likely merge three atomic candidate surfaces under one protocol-role authority.",
    ownershipNotes: ["Port numbers and stack-layer detail delegate to COM-005."],
  },
  {
    patternId: "COM004-SAT-PAT-015",
    learnerDemand: "E-banking definition and online-banking channel identity",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-TESTBOOK-EBANKING-2026", "SAT-SRC-RBI-SAFETY", "SAT-SRC-PSEB-8-2026"],
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-031",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Explicit SSC scope and Punjab curriculum facility; durable channel concept.",
  },
  {
    patternId: "COM004-SAT-PAT-016",
    learnerDemand: "Online-banking functions: balance inquiry, statements, fund transfer",
    sourceIds: ["SAT-SRC-SSC-CGL-2026", "SAT-SRC-TESTBOOK-EBANKING-2026", "SAT-SRC-PSEB-8-2026"],
    examFamilies: ["SSC", "BANKING", "PUNJAB"],
    candidateLink: "WEB-DISC-032",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Stable service-capability classification without importing mutable payment-system rules.",
    ownershipNotes: ["NEFT/RTGS/IMPS/UPI limits, timings and changing rules delegate to Banking Awareness/current affairs."],
  },
  {
    patternId: "COM004-SAT-PAT-017",
    learnerDemand: "Digital-banking safe-use behavior",
    sourceIds: ["SAT-SRC-RBI-SAFETY", "SAT-SRC-SSC-CGL-2026"],
    examFamilies: ["BANKING", "SSC", "PUNJAB"],
    candidateLink: "WEB-DISC-033",
    provisionalDisposition: "KEEP_DISTINCT_CANDIDATE",
    dispositionReason: "Regulator-backed and directly tied to e-banking use; must not drift into attack taxonomy.",
    ownershipNotes: ["Phishing/social-engineering and security-control taxonomy delegate to COM-006."],
  },
  {
    patternId: "COM004-SAT-PAT-018",
    learnerDemand: "Chatting, video conferencing, social networking, e-commerce and VoIP as Internet services",
    sourceIds: ["SAT-SRC-PSEB-8-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["PUNJAB", "GENERAL_GOVT"],
    candidateLink: "WEB-DISC-005",
    provisionalDisposition: "MERGE_WITH_EXISTING",
    dispositionReason: "Strong Punjab breadth, but these are object-pool members of Internet-service classification rather than separate learner tasks.",
  },
  {
    patternId: "COM004-SAT-PAT-019",
    learnerDemand: "Internet Service Provider (ISP) role in providing Internet access",
    sourceIds: ["SAT-SRC-PSEB-8-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["PUNJAB", "GENERAL_GOVT"],
    provisionalDisposition: "NEEDS_MORE_EVIDENCE",
    dispositionReason: "PSEB explicitly includes ISP, but competitive-exam recurrence and COM-005 boundary need more evidence.",
    ownershipNotes: ["Connection media, modem/device mechanics and network architecture remain COM-005."],
  },
  {
    patternId: "COM004-SAT-PAT-020",
    learnerDemand: "Internet connection type comparison: dial-up, DSL, fiber, satellite",
    sourceIds: ["SAT-SRC-PSEB-8-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["PUNJAB", "GENERAL_GOVT"],
    provisionalDisposition: "DELEGATE_COM005",
    dispositionReason: "Source-backed, but connection/media technology is network-access architecture rather than Web/e-mail service use.",
  },
  {
    patternId: "COM004-SAT-PAT-021",
    learnerDemand: "ARPANET as Internet precursor / Internet-history fact",
    sourceIds: ["SAT-SRC-PSEB-8-2026", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["PUNJAB", "GENERAL_GOVT"],
    provisionalDisposition: "NEEDS_MORE_EVIDENCE",
    dispositionReason: "Clearly present in curriculum/exam corpora, but historical-trivia weight should be proven before permanent authority.",
  },
  {
    patternId: "COM004-SAT-PAT-022",
    learnerDemand: "Tim Berners-Lee associated with the World Wide Web",
    sourceIds: ["SAT-SRC-MDN-WEB", "SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["GENERAL_GOVT", "SSC"],
    provisionalDisposition: "NEEDS_MORE_EVIDENCE",
    dispositionReason: "Fact is durable and source-backed; keep provisional until PYQ frequency/ownership against general computer-history facts is audited.",
  },
  {
    patternId: "COM004-SAT-PAT-023",
    learnerDemand: "Ray Tomlinson associated with first network e-mail / e-mail invention questions",
    sourceIds: ["SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["GENERAL_GOVT", "SSC"],
    provisionalDisposition: "NEEDS_MORE_EVIDENCE",
    dispositionReason: "Confirmed in government-exam PYQ corpora, but historical-personality facts need a dedicated ownership decision before QL allocation.",
  },
  {
    patternId: "COM004-SAT-PAT-024",
    learnerDemand: "CAPTCHA and Web-security challenge recognition",
    sourceIds: ["SAT-SRC-PSEB-8-2026"],
    examFamilies: ["PUNJAB"],
    provisionalDisposition: "DELEGATE_COM006",
    dispositionReason: "Security/authentication mechanism taxonomy is better owned by COM-006; COM-004 should only consume it when needed for safe-use context.",
  },
  {
    patternId: "COM004-SAT-PAT-025",
    learnerDemand: "Current provider-specific attachment limits, market share or default-product facts",
    sourceIds: ["SAT-SRC-TESTBOOK-INTERNET-2026"],
    examFamilies: ["GENERAL_GOVT"],
    provisionalDisposition: "REJECT_SOURCE_THIN",
    dispositionReason: "Mutable product trivia violates the chapter preference for durable conceptual truth unless a target official exam explicitly requires it.",
  },
];

export const COM004_TEMPORARY_PROTOTYPES_V1 = [
  { prototypeId: "COM004-PROT-001", demand: "Internet vs WWW", sourcePatternIds: ["COM004-SAT-PAT-001", "COM004-SAT-PAT-002"] },
  { prototypeId: "COM004-PROT-002", demand: "Browser/search-engine classification", sourcePatternIds: ["COM004-SAT-PAT-003", "COM004-SAT-PAT-004", "COM004-SAT-PAT-005"] },
  { prototypeId: "COM004-PROT-003", demand: "Download/upload direction", sourcePatternIds: ["COM004-SAT-PAT-006"] },
  { prototypeId: "COM004-PROT-004", demand: "URL/HTTP user-facing web concepts", sourcePatternIds: ["COM004-SAT-PAT-007", "COM004-SAT-PAT-008", "COM004-SAT-PAT-009"] },
  { prototypeId: "COM004-PROT-005", demand: "E-mail fields/actions/attachments/folders", sourcePatternIds: ["COM004-SAT-PAT-010", "COM004-SAT-PAT-011", "COM004-SAT-PAT-012", "COM004-SAT-PAT-013"] },
  { prototypeId: "COM004-PROT-006", demand: "SMTP/POP3/IMAP role discrimination", sourcePatternIds: ["COM004-SAT-PAT-014"] },
  { prototypeId: "COM004-PROT-007", demand: "E-banking identity and capabilities", sourcePatternIds: ["COM004-SAT-PAT-015", "COM004-SAT-PAT-016"] },
  { prototypeId: "COM004-PROT-008", demand: "Regulator-backed e-banking safety", sourcePatternIds: ["COM004-SAT-PAT-017"] },
  { prototypeId: "COM004-PROT-009", demand: "Internet-service classification breadth", sourcePatternIds: ["COM004-SAT-PAT-018"] },
] as const;

export function auditCom004SourceSaturationV1() {
  const issues: string[] = [];
  const sourceIds = new Set(COM004_SATURATION_SOURCES_V1.map((source) => source.sourceId));
  const patternIds = new Set<string>();

  for (const pattern of COM004_SOURCE_PATTERNS_V1) {
    if (!/^COM004-SAT-PAT-\d{3}$/.test(pattern.patternId)) issues.push(`Bad pattern id: ${pattern.patternId}`);
    if (patternIds.has(pattern.patternId)) issues.push(`Duplicate pattern id: ${pattern.patternId}`);
    patternIds.add(pattern.patternId);
    if (pattern.sourceIds.length === 0) issues.push(`${pattern.patternId}: missing sources`);
    for (const sourceId of pattern.sourceIds) {
      if (!sourceIds.has(sourceId)) issues.push(`${pattern.patternId}: unknown source ${sourceId}`);
    }
  }

  const punjabPatternIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.examFamilies.includes("PUNJAB")).map((pattern) => pattern.patternId);
  const bankingPatternIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.examFamilies.includes("BANKING")).map((pattern) => pattern.patternId);
  const keepIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "KEEP_DISTINCT_CANDIDATE").map((pattern) => pattern.patternId);
  const mergeIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "MERGE_WITH_EXISTING").map((pattern) => pattern.patternId);
  const com005Delegations = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "DELEGATE_COM005").map((pattern) => pattern.patternId);
  const com006Delegations = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "DELEGATE_COM006").map((pattern) => pattern.patternId);
  const needsMoreEvidenceIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "NEEDS_MORE_EVIDENCE").map((pattern) => pattern.patternId);
  const rejectedIds = COM004_SOURCE_PATTERNS_V1.filter((pattern) => pattern.provisionalDisposition === "REJECT_SOURCE_THIN").map((pattern) => pattern.patternId);

  if (!COM004_SATURATION_SOURCES_V1.some((source) => source.sourceId === "SAT-SRC-PSEB-8-2026" && source.authorityClass === "OFFICIAL_CURRICULUM")) {
    issues.push("Missing official Punjab curriculum source");
  }
  if (COM004_SATURATION_SOURCES_V1.length < 8) issues.push("Source breadth below saturation-wave minimum");
  if (COM004_SOURCE_PATTERNS_V1.length < 20) issues.push("Pattern breadth below saturation-wave minimum");
  if (punjabPatternIds.length < 8) issues.push("Punjab-specific source-pattern coverage is too thin");
  if (bankingPatternIds.length < 6) issues.push("Banking source-pattern coverage is too thin");
  if (COM004_TEMPORARY_PROTOTYPES_V1.length < 8) issues.push("Temporary prototype breadth is too thin");
  if (com005Delegations.length < 1) issues.push("COM-005 delegation proof missing");
  if (com006Delegations.length < 1) issues.push("COM-006 delegation proof missing");
  if (rejectedIds.length < 1) issues.push("Source-thin rejection proof missing");

  return {
    valid: issues.length === 0,
    issues,
    sourceCount: COM004_SATURATION_SOURCES_V1.length,
    patternCount: COM004_SOURCE_PATTERNS_V1.length,
    temporaryPrototypeCount: COM004_TEMPORARY_PROTOTYPES_V1.length,
    punjabPatternIds,
    bankingPatternIds,
    keepIds,
    mergeIds,
    com005Delegations,
    com006Delegations,
    needsMoreEvidenceIds,
    rejectedIds,
    permanentQlCount: 0,
    sourceSaturationClosed: false,
    mergeSplitClosed: false,
    productionReady: false,
    nextGate: "COM004_SOURCE_SATURATION_V2_GAP_EXPANSION",
  } as const;
}
