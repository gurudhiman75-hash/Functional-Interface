import { COM004_SOURCE_PATTERNS_V1 } from "./com004-source-saturation-v1";

export type Com004GapDisposition =
  | "PROMOTE_KEEP"
  | "MERGE_OBJECT_POOL"
  | "MERGE_QUERY_VARIANT"
  | "KEEP_PROVISIONAL"
  | "DELEGATE_COM005"
  | "DELEGATE_COM006"
  | "DELEGATE_BANKING_AWARENESS"
  | "REJECT_MUTABLE_OR_SOURCE_THIN";

export type Com004GapEvidence = {
  evidenceId: string;
  sourceClass: "PUNJAB_COMPETITIVE" | "BANKING_RECENT_EXAM" | "BANKING_EXAM_ANALYSIS" | "EXAM_CORPUS" | "OFFICIAL_CURRICULUM";
  examFamily: "PUNJAB" | "BANKING" | "SSC" | "CROSS_EXAM";
  observation: string;
  authorityUse: string;
};

export type Com004GapDecision = {
  decisionId: string;
  demand: string;
  evidenceIds: string[];
  linkedDiscoveryIds?: string[];
  disposition: Com004GapDisposition;
  reason: string;
  queryForms: ("DIRECT" | "INVERSE" | "NOT" | "STATEMENT_SET" | "MATCHING")[];
  ownershipNotes?: string[];
};

/**
 * Deliberate gap-expansion evidence collected after Source Saturation V1.
 * Coaching/exam-analysis sources prove recurrence and wording families only;
 * canonical facts must still resolve to official/standards/regulator authority.
 */
export const COM004_GAP_EVIDENCE_V2: Com004GapEvidence[] = [
  {
    evidenceId: "COM004-GAP-EV-001",
    sourceClass: "PUNJAB_COMPETITIVE",
    examFamily: "PUNJAB",
    observation: "Current PSSSB Clerk computer corpus asks a statement-set question classifying e-mail, chat rooms and mailing lists as Internet services.",
    authorityUse: "Supports Punjab competitive recurrence of Internet-service classification and statement-set presentation.",
  },
  {
    evidenceId: "COM004-GAP-EV-002",
    sourceClass: "PUNJAB_COMPETITIVE",
    examFamily: "PUNJAB",
    observation: "Current PSSSB Clerk computer corpus asks what content can be sent using e-mail and discusses attachments plus e-mail-address structure.",
    authorityUse: "Supports e-mail capability/address/attachment demand, not provider-specific attachment-size trivia.",
  },
  {
    evidenceId: "COM004-GAP-EV-003",
    sourceClass: "PUNJAB_COMPETITIVE",
    examFamily: "PUNJAB",
    observation: "PSSSB Senior Assistant ICT corpus asks which option is NOT a web search engine, contrasting Safari with Bing/Baidu/Google.",
    authorityUse: "Strong competitive-exam evidence for browser-versus-search-engine classification using NOT form.",
  },
  {
    evidenceId: "COM004-GAP-EV-004",
    sourceClass: "PUNJAB_COMPETITIVE",
    examFamily: "PUNJAB",
    observation: "PSSSB JE ICT corpus asks which option is not browser software, contrasting DuckDuckGo with Chromium/Edge/Brave.",
    authorityUse: "Independent Punjab role evidence for the same browser-versus-search-engine learner task; product names stay object-pool members.",
  },
  {
    evidenceId: "COM004-GAP-EV-005",
    sourceClass: "BANKING_RECENT_EXAM",
    examFamily: "BANKING",
    observation: "IBPS RRB PO Mains 2025 computer questions included direct Internet terms such as browser and URL among otherwise basic one-line computer-awareness questions.",
    authorityUse: "Supports direct awareness depth for browser/URL in banking; argues against manufacturing deep protocol complexity.",
  },
  {
    evidenceId: "COM004-GAP-EV-006",
    sourceClass: "BANKING_EXAM_ANALYSIS",
    examFamily: "BANKING",
    observation: "IBPS RRB Clerk Mains analysis reports a 40-question Computer Knowledge section and says Internet basics recur alongside Networking, Hardware, MS Office and Operating Systems.",
    authorityUse: "Supports banking relevance of core Internet concepts while preserving Networking as a separate ownership area.",
  },
  {
    evidenceId: "COM004-GAP-EV-007",
    sourceClass: "EXAM_CORPUS",
    examFamily: "BANKING",
    observation: "IBPS RRB computer practice corpus repeatedly uses URL, bookmarks, download, hyperlink and browser-control questions.",
    authorityUse: "Supports these as recurring awareness forms, but practice material alone does not prove each deserves a permanent QL.",
  },
  {
    evidenceId: "COM004-GAP-EV-008",
    sourceClass: "EXAM_CORPUS",
    examFamily: "BANKING",
    observation: "IBPS Clerk computer corpus tests satellite/DSL/ISDN/dial-up Internet access technologies.",
    authorityUse: "Confirms the pattern exists in banking, but it is network-access/media architecture and should delegate to COM-005.",
  },
  {
    evidenceId: "COM004-GAP-EV-009",
    sourceClass: "OFFICIAL_CURRICULUM",
    examFamily: "PUNJAB",
    observation: "Punjab curriculum breadth includes ISP, Internet connections, chatting, video conferencing, social networking, e-commerce and web searching.",
    authorityUse: "Useful gap source; service examples expand object pools while connection mechanics remain COM-005.",
  },
  {
    evidenceId: "COM004-GAP-EV-010",
    sourceClass: "EXAM_CORPUS",
    examFamily: "CROSS_EXAM",
    observation: "Internet-history facts such as ARPANET, early browsers and named inventors recur in preparation corpora but are not central to the official COM-004 service-use scope.",
    authorityUse: "Keep provisional until PYQ density and chapter-history ownership are proven; do not let trivia dominate production.",
  },
];

export const COM004_GAP_DECISIONS_V2: Com004GapDecision[] = [
  {
    decisionId: "COM004-GAP-DEC-001",
    demand: "Browser versus search engine classification",
    evidenceIds: ["COM004-GAP-EV-003", "COM004-GAP-EV-004", "COM004-GAP-EV-005"],
    linkedDiscoveryIds: ["WEB-DISC-006", "WEB-DISC-007", "WEB-DISC-008"],
    disposition: "PROMOTE_KEEP",
    reason: "Now independently recurrent in Punjab competitive and recent banking evidence. Product-identity candidates are object-pool variants, not separate learner tasks.",
    queryForms: ["DIRECT", "INVERSE", "NOT"],
  },
  {
    decisionId: "COM004-GAP-DEC-002",
    demand: "Internet-service classification including e-mail, chat rooms, mailing lists, video conferencing, social networking and e-commerce",
    evidenceIds: ["COM004-GAP-EV-001", "COM004-GAP-EV-009"],
    linkedDiscoveryIds: ["WEB-DISC-005"],
    disposition: "PROMOTE_KEEP",
    reason: "Punjab competitive evidence confirms the statement-set form while official curriculum supplies wider service objects.",
    queryForms: ["DIRECT", "NOT", "STATEMENT_SET", "MATCHING"],
  },
  {
    decisionId: "COM004-GAP-DEC-003",
    demand: "E-mail attachment identity and content capability",
    evidenceIds: ["COM004-GAP-EV-002"],
    linkedDiscoveryIds: ["WEB-DISC-024"],
    disposition: "PROMOTE_KEEP",
    reason: "Concrete Punjab competitive demand; provider-specific size limits remain excluded as mutable trivia.",
    queryForms: ["DIRECT", "INVERSE", "NOT"],
  },
  {
    decisionId: "COM004-GAP-DEC-004",
    demand: "URL identity and basic Web-address recognition",
    evidenceIds: ["COM004-GAP-EV-005", "COM004-GAP-EV-007"],
    linkedDiscoveryIds: ["WEB-DISC-013", "WEB-DISC-014"],
    disposition: "PROMOTE_KEEP",
    reason: "Recent banking evidence supports URL as a direct awareness concept; detailed component parsing stays provisional until stronger PYQ evidence.",
    queryForms: ["DIRECT", "INVERSE", "MATCHING"],
  },
  {
    decisionId: "COM004-GAP-DEC-005",
    demand: "Bookmarks/favorites as saved Web references",
    evidenceIds: ["COM004-GAP-EV-007"],
    linkedDiscoveryIds: ["WEB-DISC-010"],
    disposition: "KEEP_PROVISIONAL",
    reason: "Recurring practice pattern, but still insufficient evidence to split bookmarks/history/cache into a permanent standalone authority.",
    queryForms: ["DIRECT", "INVERSE"],
  },
  {
    decisionId: "COM004-GAP-DEC-006",
    demand: "Browser navigation controls and close/reload operations",
    evidenceIds: ["COM004-GAP-EV-007"],
    linkedDiscoveryIds: ["WEB-DISC-009"],
    disposition: "KEEP_PROVISIONAL",
    reason: "Exam-corpus recurrence exists, but browser-specific shortcut/UI details can be platform-sensitive and need PYQ calibration.",
    queryForms: ["DIRECT", "INVERSE"],
  },
  {
    decisionId: "COM004-GAP-DEC-007",
    demand: "Internet connection/access technologies such as satellite, DSL, ISDN and dial-up",
    evidenceIds: ["COM004-GAP-EV-008", "COM004-GAP-EV-009"],
    disposition: "DELEGATE_COM005",
    reason: "Real banking/Punjab pattern, but learner demand is network-access/media architecture rather than Web/e-mail service use.",
    queryForms: ["DIRECT", "NOT", "MATCHING"],
    ownershipNotes: ["COM-004 may reference connectivity only as context; canonical ownership is COM-005 Networking."],
  },
  {
    decisionId: "COM004-GAP-DEC-008",
    demand: "Mutable digital-payment limits, settlement timings and current operational rules",
    evidenceIds: ["COM004-GAP-EV-006"],
    disposition: "DELEGATE_BANKING_AWARENESS",
    reason: "Banking exams test current financial/payment-system facts, but those are not durable Computer Awareness truths.",
    queryForms: ["DIRECT", "STATEMENT_SET"],
    ownershipNotes: ["NEFT/RTGS/IMPS/UPI current limits/timings/rules belong to Banking Awareness/current affairs."],
  },
  {
    decisionId: "COM004-GAP-DEC-009",
    demand: "Phishing, malware, CAPTCHA and attack/control taxonomy",
    evidenceIds: ["COM004-GAP-EV-009"],
    disposition: "DELEGATE_COM006",
    reason: "Security concepts may occur near Internet-service questions but their canonical taxonomy belongs to Cyber Security.",
    queryForms: ["DIRECT", "NOT", "STATEMENT_SET", "MATCHING"],
    ownershipNotes: ["COM-004 retains only safe-use behavior tied directly to Web/e-mail/e-banking."],
  },
  {
    decisionId: "COM004-GAP-DEC-010",
    demand: "ARPANET, first browsers and named Internet/e-mail inventors",
    evidenceIds: ["COM004-GAP-EV-010"],
    disposition: "KEEP_PROVISIONAL",
    reason: "Durable facts recur in preparation material, but official scope is service-oriented; require attributable PYQ density before allocating learner-task authority.",
    queryForms: ["DIRECT", "INVERSE", "MATCHING"],
  },
  {
    decisionId: "COM004-GAP-DEC-011",
    demand: "Provider-specific attachment limits, current product popularity/defaults and similar mutable trivia",
    evidenceIds: ["COM004-GAP-EV-002", "COM004-GAP-EV-003"],
    disposition: "REJECT_MUTABLE_OR_SOURCE_THIN",
    reason: "These facts age quickly or are irrelevant to the durable learner task; they must not enter the canonical COM-004 corpus by incidental source presence.",
    queryForms: ["DIRECT", "NOT"],
  },
  {
    decisionId: "COM004-GAP-DEC-012",
    demand: "NOT/incorrect-statement and statement-set presentation forms over already-owned Internet/e-mail facts",
    evidenceIds: ["COM004-GAP-EV-001", "COM004-GAP-EV-003", "COM004-GAP-EV-004"],
    linkedDiscoveryIds: ["WEB-DISC-005", "WEB-DISC-006", "WEB-DISC-036"],
    disposition: "MERGE_QUERY_VARIANT",
    reason: "Negative and statement-set wording changes the presentation/verification contract but does not by itself create a new factual learner task.",
    queryForms: ["NOT", "STATEMENT_SET"],
  },
];

export const COM004_V2_RESOLVED_V1_PROVISIONALS = {
  "COM004-SAT-PAT-004": "MERGE browser products into browser-vs-search-engine object pool",
  "COM004-SAT-PAT-005": "MERGE search-engine products into browser-vs-search-engine object pool",
  "COM004-SAT-PAT-018": "MERGE Internet-service examples into service-classification object pool",
  "COM004-SAT-PAT-020": "DELEGATE connection/access technologies to COM-005",
  "COM004-SAT-PAT-024": "DELEGATE CAPTCHA/security taxonomy to COM-006",
  "COM004-SAT-PAT-025": "REJECT mutable/provider-specific trivia",
} as const;

export function auditCom004SourceSaturationV2GapExpansion() {
  const issues: string[] = [];
  const evidenceIds = new Set<string>();
  const decisionIds = new Set<string>();
  const knownV1Patterns = new Set(COM004_SOURCE_PATTERNS_V1.map((pattern) => pattern.patternId));

  for (const evidence of COM004_GAP_EVIDENCE_V2) {
    if (!/^COM004-GAP-EV-\d{3}$/.test(evidence.evidenceId)) issues.push(`Bad evidence id: ${evidence.evidenceId}`);
    if (evidenceIds.has(evidence.evidenceId)) issues.push(`Duplicate evidence id: ${evidence.evidenceId}`);
    evidenceIds.add(evidence.evidenceId);
  }

  for (const decision of COM004_GAP_DECISIONS_V2) {
    if (!/^COM004-GAP-DEC-\d{3}$/.test(decision.decisionId)) issues.push(`Bad decision id: ${decision.decisionId}`);
    if (decisionIds.has(decision.decisionId)) issues.push(`Duplicate decision id: ${decision.decisionId}`);
    decisionIds.add(decision.decisionId);
    if (decision.evidenceIds.length === 0) issues.push(`${decision.decisionId}: missing evidence`);
    for (const evidenceId of decision.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) issues.push(`${decision.decisionId}: unknown evidence ${evidenceId}`);
    }
    if (decision.queryForms.length === 0) issues.push(`${decision.decisionId}: missing query forms`);
  }

  for (const resolvedPatternId of Object.keys(COM004_V2_RESOLVED_V1_PROVISIONALS)) {
    if (!knownV1Patterns.has(resolvedPatternId)) issues.push(`Resolved unknown V1 pattern ${resolvedPatternId}`);
  }

  const punjabEvidenceIds = COM004_GAP_EVIDENCE_V2.filter((evidence) => evidence.examFamily === "PUNJAB").map((evidence) => evidence.evidenceId);
  const bankingEvidenceIds = COM004_GAP_EVIDENCE_V2.filter((evidence) => evidence.examFamily === "BANKING").map((evidence) => evidence.evidenceId);
  const promotedDecisionIds = COM004_GAP_DECISIONS_V2.filter((decision) => decision.disposition === "PROMOTE_KEEP").map((decision) => decision.decisionId);
  const provisionalDecisionIds = COM004_GAP_DECISIONS_V2.filter((decision) => decision.disposition === "KEEP_PROVISIONAL").map((decision) => decision.decisionId);
  const delegatedDecisionIds = COM004_GAP_DECISIONS_V2.filter((decision) => decision.disposition.startsWith("DELEGATE_")).map((decision) => decision.decisionId);
  const negativeFormDecisionIds = COM004_GAP_DECISIONS_V2.filter((decision) => decision.queryForms.includes("NOT")).map((decision) => decision.decisionId);
  const statementSetDecisionIds = COM004_GAP_DECISIONS_V2.filter((decision) => decision.queryForms.includes("STATEMENT_SET")).map((decision) => decision.decisionId);

  if (COM004_GAP_EVIDENCE_V2.length < 10) issues.push("V2 gap evidence breadth too small");
  if (COM004_GAP_DECISIONS_V2.length < 12) issues.push("V2 decision breadth too small");
  if (punjabEvidenceIds.length < 4) issues.push("Punjab competitive gap evidence too small");
  if (bankingEvidenceIds.length < 3) issues.push("Banking gap evidence too small");
  if (promotedDecisionIds.length < 4) issues.push("Too few evidence-backed promotions");
  if (provisionalDecisionIds.length < 3) issues.push("V2 is overconfident: insufficient provisional holds");
  if (delegatedDecisionIds.length < 3) issues.push("Ownership delegation breadth too small");
  if (negativeFormDecisionIds.length < 5) issues.push("NOT/incorrect-form gap expansion too small");
  if (statementSetDecisionIds.length < 3) issues.push("Statement-set gap expansion too small");

  return {
    valid: issues.length === 0,
    issues,
    evidenceCount: COM004_GAP_EVIDENCE_V2.length,
    decisionCount: COM004_GAP_DECISIONS_V2.length,
    punjabEvidenceIds,
    bankingEvidenceIds,
    promotedDecisionIds,
    provisionalDecisionIds,
    delegatedDecisionIds,
    negativeFormDecisionIds,
    statementSetDecisionIds,
    permanentQlCount: 0,
    sourceSaturationClosed: false,
    mergeSplitClosed: false,
    productionReady: false,
    nextGate: "COM004_SOURCE_SATURATION_V2_EVIDENCE_CLOSURE_AND_MERGE_SPLIT",
  } as const;
}
