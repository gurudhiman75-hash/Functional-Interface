import {
  COM004_INTERNET_WEB_EMAIL_DISCOVERY,
  auditCom004InternetWebEmailDiscovery,
} from "./com004-internet-web-email-discovery";
import { auditCom004SourceManifest } from "./com004-source-manifest";

export type Com004ProvisionalLearnerTask = {
  provisionalTaskId: string;
  title: string;
  candidateIds: string[];
  relationFamilies: string[];
  disposition: "PROVISIONAL_TASK" | "HOLD";
  rationale: string[];
  splitConditions?: string[];
};

/**
 * Merge/split ownership pass for COM-004.
 *
 * This is deliberately NOT permanent QL allocation. It compresses discovery
 * surfaces into solver/fact boundaries and proves every discovery candidate
 * has exactly one owner before atomic fact-corpus construction.
 */
export const COM004_PROVISIONAL_LEARNER_TASKS: Com004ProvisionalLearnerTask[] = [
  {
    provisionalTaskId: "COM004-PT-001",
    title: "Internet, WWW & Core Web Resource Concepts",
    candidateIds: ["WEB-DISC-001", "WEB-DISC-002", "WEB-DISC-003", "WEB-DISC-004"],
    relationFamilies: ["internet-concept", "internet-www-distinction", "web-resource-concepts", "hyperlink-purpose"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Internet/WWW distinction and website/webpage/homepage/hyperlink recognition share one elementary Web concept graph.",
      "The learner demand is conceptual identity rather than network architecture, which remains outside COM-004.",
    ],
    splitConditions: ["split Internet-vs-WWW if target-exam error analysis shows a materially distinct misconception profile"],
  },
  {
    provisionalTaskId: "COM004-PT-002",
    title: "Web Browser, Search Engine & Service Classification",
    candidateIds: ["WEB-DISC-005", "WEB-DISC-006", "WEB-DISC-007"],
    relationFamilies: ["browser-purpose", "browser-search-service-distinction", "search-engine-purpose"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Browser-from-purpose, search-engine-from-purpose and browser-vs-service classification are inverse surfaces over one software/service-role model.",
      "SSC official-paper evidence directly confirms browser purpose and browser classification demand.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-003",
    title: "Upload & Download Direction",
    candidateIds: ["WEB-DISC-008"],
    relationFamilies: ["upload-download-direction"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC explicitly owns downloading and uploading.",
      "Direction relative to the learner's device is a clean binary conceptual solver and should not be diluted by generic browser-command trivia.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-004",
    title: "Durable Browser Actions",
    candidateIds: ["WEB-DISC-009"],
    relationFamilies: ["browser-common-action"],
    disposition: "PROVISIONAL_TASK",
    rationale: ["Refresh/back/forward/bookmark semantics share a common browser-action-to-purpose graph while UI placement remains excluded."],
    splitConditions: ["hold any action whose semantics cannot be made browser/version neutral"],
  },
  {
    provisionalTaskId: "COM004-PT-005",
    title: "URL Identity & Basic Components",
    candidateIds: ["WEB-DISC-010", "WEB-DISC-011"],
    relationFamilies: ["url-identity-purpose", "url-component-role"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "URL expansion/purpose and scheme-host-path recognition share one awareness-level addressing model.",
      "DNS resolution and network addressing mechanics remain explicitly owned by COM-005.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-006",
    title: "HTTP vs HTTPS Awareness",
    candidateIds: ["WEB-DISC-012"],
    relationFamilies: ["http-https-awareness"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "HTTPS confusion is safety-relevant and technically sensitive enough to remain a distinct learner task.",
      "The solver must test protected HTTP transport awareness, never the false claim that HTTPS guarantees a trustworthy site.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-007",
    title: "E-mail Address, Recipient Fields & Subject",
    candidateIds: ["WEB-DISC-013", "WEB-DISC-014", "WEB-DISC-015"],
    relationFamilies: ["email-address-structure", "email-recipient-field-semantics", "email-subject-role"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Address structure and message-header field selection operate on the same message-addressing/header model.",
      "CC/BCC eligibility requires explicit recipient-visibility wording to preserve answer uniqueness.",
    ],
    splitConditions: ["split CC/BCC visibility if PYQ density supports a dedicated misconception-driven QL"],
  },
  {
    provisionalTaskId: "COM004-PT-008",
    title: "E-mail Mailbox Folder & Message State",
    candidateIds: ["WEB-DISC-016"],
    relationFamilies: ["email-mailbox-folder-state"],
    disposition: "PROVISIONAL_TASK",
    rationale: ["Inbox/Outbox/Sent/Draft/Spam/Trash require state-to-folder reasoning and are distinct from recipient/action semantics."],
  },
  {
    provisionalTaskId: "COM004-PT-009",
    title: "E-mail Response Actions, Attachments & Signatures",
    candidateIds: ["WEB-DISC-017", "WEB-DISC-018"],
    relationFamilies: ["email-response-action", "email-message-feature"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Reply/reply-all/forward and attachment/signature questions are user-operation tasks over an already composed/received message.",
      "Surface wording should be contextual rather than mechanical command-name recall when possible.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-010",
    title: "E-mail Protocol Roles — SMTP, POP3 & IMAP",
    candidateIds: ["WEB-DISC-019", "WEB-DISC-020", "WEB-DISC-021", "WEB-DISC-022"],
    relationFamilies: ["email-protocol-role", "email-protocol-role-comparison"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Protocol expansions, individual roles and sending-vs-access comparison share one source-backed protocol-role graph.",
      "Port numbers and transport-stack mechanics remain outside COM-004.",
    ],
    splitConditions: ["split acronym expansion from role discrimination only if exam evidence shows independent demand and enough fact/distractor capacity"],
  },
  {
    provisionalTaskId: "COM004-PT-011",
    title: "E-commerce & E-governance Concepts",
    candidateIds: ["WEB-DISC-023", "WEB-DISC-024"],
    relationFamilies: ["digital-service-concept"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Both are digital-service classification tasks with strong same-neighborhood distractors.",
      "Named government apps/services remain excluded unless validity-scoped because product surfaces can change.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-012",
    title: "Netiquette & Responsible Online Conduct",
    candidateIds: ["WEB-DISC-025"],
    relationFamilies: ["netiquette-action"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT explicitly includes netiquette, but permanent allocation remains conditional on target-exam evidence and objective answerability.",
      "Attack/security taxonomy remains COM-006.",
    ],
    splitConditions: ["hold at allocation if target-exam evidence is too thin or scenarios become subjective"],
  },
  {
    provisionalTaskId: "COM004-PT-013",
    title: "OTP & QR Identity/Purpose",
    candidateIds: ["WEB-DISC-026", "WEB-DISC-027"],
    relationFamilies: ["digital-financial-tool-purpose"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "NIELIT explicitly groups OTP and QR under digital financial tools.",
      "Safety claims are constrained: OTP is an authentication factor and QR is an information carrier, not an inherent guarantee of safety.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-014",
    title: "UPI Identity, Canonical Expansion & Purpose",
    candidateIds: ["WEB-DISC-028"],
    relationFamilies: ["digital-payment-system-purpose"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "UPI has high exam relevance and an authoritative product-owner semantic model.",
      "NPCI canonical naming overrides the singular 'Payment' wording found in the NIELIT syllabus table.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-015",
    title: "AePS & USSD Financial-Inclusion Channels",
    candidateIds: ["WEB-DISC-029", "WEB-DISC-030"],
    relationFamilies: ["digital-payment-system-purpose"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "AePS and USSD are distinct tools but share an access-channel/financial-inclusion learner neighborhood and strong mutual distractor value.",
      "Mutable operator/bank menu details are excluded from the fact model.",
    ],
    splitConditions: ["split AePS and USSD if object-pool growth supports independent high-capacity QLs"],
  },
  {
    provisionalTaskId: "COM004-PT-016",
    title: "Cards, E-wallet & Point-of-Sale Concepts",
    candidateIds: ["WEB-DISC-031", "WEB-DISC-032", "WEB-DISC-033"],
    relationFamilies: ["payment-tool-classification"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "These are awareness-level payment-tool classification tasks in the NIELIT digital-financial-tools family.",
      "Product-specific fees, limits and current acceptance rules are excluded.",
    ],
    splitConditions: ["split debit-vs-credit cards if banking-exam evidence proves deeper independent demand"],
  },
  {
    provisionalTaskId: "COM004-PT-017",
    title: "Internet Banking / E-banking Concept",
    candidateIds: ["WEB-DISC-034"],
    relationFamilies: ["internet-banking-concept"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "SSC explicitly owns e-banking and PYQ evidence classifies NEFT/RTGS/IMPS under online banking.",
      "This task tests the service concept, not the settlement mechanics of individual payment systems.",
    ],
  },
  {
    provisionalTaskId: "COM004-PT-018",
    title: "NEFT, RTGS & IMPS Identity and Durable Settlement Models",
    candidateIds: ["WEB-DISC-035", "WEB-DISC-036", "WEB-DISC-037", "WEB-DISC-038"],
    relationFamilies: ["fund-transfer-service-model", "fund-transfer-service-comparison"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "Expansions and settlement/purpose distinctions share one electronic-fund-transfer relation graph.",
      "RBI/NPCI authorities support durable batch-vs-real-time-gross-vs-instant distinctions.",
      "Mutable limits, charges, exact batch counts and availability trivia are barred from immutable generation.",
    ],
    splitConditions: ["split individual systems only after fact-pool capacity and target-exam density justify independent QLs"],
  },
  {
    provisionalTaskId: "COM004-PT-019",
    title: "Digital-Service Safe-Action Selection",
    candidateIds: ["WEB-DISC-039", "WEB-DISC-040"],
    relationFamilies: ["digital-service-safe-action"],
    disposition: "PROVISIONAL_TASK",
    rationale: [
      "COM-004 owns only concrete user-action safety tied directly to digital-service use.",
      "Threat names, malware taxonomy and security-control classification remain COM-006.",
    ],
    splitConditions: ["hold scenarios that cannot be made objectively answerable from regulator/product-owner safety guidance"],
  },
  {
    provisionalTaskId: "COM004-HOLD-001",
    title: "COM-004 Multi-Statement Composition",
    candidateIds: ["WEB-DISC-041"],
    relationFamilies: ["com004-multi-statement"],
    disposition: "HOLD",
    rationale: [
      "Statement-set composition is a surface format, not a new fact authority.",
      "It may activate only after independent atomic facts have source authority, distractor safety and exam evidence.",
    ],
  },
  {
    provisionalTaskId: "COM004-HOLD-002",
    title: "COM-004 Multi-Pair Matching",
    candidateIds: ["WEB-DISC-042"],
    relationFamilies: ["com004-multi-pair-matching"],
    disposition: "HOLD",
    rationale: [
      "Matching is a composition surface and may only consume previously approved relation pairs.",
      "Holding it prevents artificial QL multiplication from format variants.",
    ],
  },
];

export function auditCom004MergeSplitOwnership() {
  const issues: string[] = [];
  const discoveryIds = new Set(COM004_INTERNET_WEB_EMAIL_DISCOVERY.map((entry) => entry.candidateId));
  const ownedCounts = new Map<string, number>();

  for (const task of COM004_PROVISIONAL_LEARNER_TASKS) {
    if (!task.candidateIds.length) issues.push(`EMPTY_TASK:${task.provisionalTaskId}`);
    if (!task.relationFamilies.length) issues.push(`EMPTY_RELATION_FAMILY_SET:${task.provisionalTaskId}`);
    for (const candidateId of task.candidateIds) {
      if (!discoveryIds.has(candidateId)) issues.push(`UNKNOWN_CANDIDATE:${task.provisionalTaskId}:${candidateId}`);
      ownedCounts.set(candidateId, (ownedCounts.get(candidateId) ?? 0) + 1);
    }
  }

  for (const candidateId of discoveryIds) {
    const count = ownedCounts.get(candidateId) ?? 0;
    if (count === 0) issues.push(`UNOWNED_DISCOVERY_CANDIDATE:${candidateId}`);
    if (count > 1) issues.push(`MULTI_OWNED_DISCOVERY_CANDIDATE:${candidateId}:${count}`);
  }

  const discoveryAudit = auditCom004InternetWebEmailDiscovery();
  if (!discoveryAudit.valid) issues.push(...discoveryAudit.issues.map((issue) => `DISCOVERY:${issue}`));

  const sourceAudit = auditCom004SourceManifest();
  if (!sourceAudit.valid) issues.push(...sourceAudit.issues.map((issue) => `SOURCE_MANIFEST:${issue}`));

  const provisionalTasks = COM004_PROVISIONAL_LEARNER_TASKS.filter((entry) => entry.disposition === "PROVISIONAL_TASK");
  const heldTasks = COM004_PROVISIONAL_LEARNER_TASKS.filter((entry) => entry.disposition === "HOLD");

  if (provisionalTasks.length < 18) issues.push(`THIN_PROVISIONAL_TASK_SET:${provisionalTasks.length}`);
  if (heldTasks.length < 2) issues.push(`MISSING_DISCOVERY_HOLDS:${heldTasks.length}`);

  const compositionCandidates = new Set(["WEB-DISC-041", "WEB-DISC-042"]);
  for (const heldTask of heldTasks) {
    for (const candidateId of heldTask.candidateIds) {
      if (!compositionCandidates.has(candidateId)) issues.push(`UNEXPECTED_HELD_CANDIDATE:${candidateId}`);
    }
  }

  return {
    valid: issues.length === 0,
    discoveryCandidateCount: discoveryIds.size,
    provisionalTaskCount: provisionalTasks.length,
    heldTaskCount: heldTasks.length,
    provisionalTaskIds: provisionalTasks.map((entry) => entry.provisionalTaskId),
    heldCandidateIds: heldTasks.flatMap((entry) => entry.candidateIds),
    permanentQlCount: 0,
    mergeSplitReady: issues.length === 0,
    allocationReady: false,
    nextGate: "COM004_SOURCE_BACKED_ATOMIC_FACT_CORPUS_AND_DISTRACTOR_CAPACITY",
    issues,
  };
}
