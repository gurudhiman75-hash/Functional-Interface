import { auditCom004EditorialFactReview, COM004_EDITORIAL_TASK_DECISIONS } from "./com004-editorial-fact-review";
import { COM004_DISTRACTOR_READINESS, type Com004DistractorStrategy } from "./com004-distractor-readiness";

export type Com004PermanentQl = {
  qlId: string;
  cpId: string;
  title: string;
  learnerTask: string;
  sourceProvisionalTaskId: string;
  supportedSolveModes: readonly string[];
  distractorStrategy: Com004DistractorStrategy;
  versionScoped: boolean;
  ownershipBoundaries: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

export type Com004PermanentCp = {
  cpId: string;
  title: string;
  qlIds: readonly string[];
  status: "ALLOCATED_NOT_CONTENT_FROZEN";
};

function strategy(taskId: string) {
  const entry = COM004_DISTRACTOR_READINESS.find((item) => item.taskId === taskId);
  if (!entry) throw new Error(`Missing COM-004 distractor strategy for ${taskId}`);
  return entry;
}

function ql(input: Omit<Com004PermanentQl, "distractorStrategy" | "versionScoped" | "status">): Com004PermanentQl {
  const distractor = strategy(input.sourceProvisionalTaskId);
  return { ...input, distractorStrategy: distractor.strategy, versionScoped: distractor.versionScoped, status: "ALLOCATED_NOT_CONTENT_FROZEN" };
}

export const COM004_PERMANENT_QLS: readonly Com004PermanentQl[] = [
  ql({ qlId: "COM-004-QL-001", cpId: "COM-004-CP-001", title: "Internet, WWW & Core Web Resource Concepts", learnerTask: "Distinguish Internet from the World Wide Web and identify website, webpage, homepage and hyperlink from durable roles.", sourceProvisionalTaskId: "COM004-PT-001", supportedSolveModes: ["CONCEPT_FROM_DEFINITION", "DEFINITION_FROM_CONCEPT", "INTERNET_VS_WWW", "WEB_RESOURCE_CLASSIFICATION"], ownershipBoundaries: ["Network architecture/topology remains COM-005; Web resource concepts remain at user-awareness depth."] }),
  ql({ qlId: "COM-004-QL-002", cpId: "COM-004-CP-002", title: "Web Browser, Search Engine & Service Classification", learnerTask: "Identify browsers and search engines from purpose and distinguish client browser software from search services.", sourceProvisionalTaskId: "COM004-PT-002", supportedSolveModes: ["BROWSER_FROM_PURPOSE", "SEARCH_ENGINE_FROM_PURPOSE", "BROWSER_VS_SEARCH_ENGINE", "CLASSIFICATION"], ownershipBoundaries: ["Avoid current market-share/default-browser trivia; software taxonomy beyond this Web-use distinction belongs to COM-007."] }),
  ql({ qlId: "COM-004-QL-003", cpId: "COM-004-CP-002", title: "Upload & Download Direction", learnerTask: "Distinguish upload from download by data-transfer direction relative to the user's local device.", sourceProvisionalTaskId: "COM004-PT-003", supportedSolveModes: ["DIRECTION_TO_TERM", "TERM_TO_DIRECTION", "CONTEXT_SELECTION"], ownershipBoundaries: ["Network transport mechanics and protocols are not part of this QL."] }),
  ql({ qlId: "COM-004-QL-004", cpId: "COM-004-CP-002", title: "Durable Browser Actions", learnerTask: "Map refresh/reload, back, forward and bookmark/favourite to stable browser-use effects.", sourceProvisionalTaskId: "COM004-PT-004", supportedSolveModes: ["ACTION_FROM_EFFECT", "EFFECT_FROM_ACTION", "BROWSER_USE_CONTEXT"], ownershipBoundaries: ["Do not test version-specific icons, menu positions or branded UI paths."] }),
  ql({ qlId: "COM-004-QL-005", cpId: "COM-004-CP-003", title: "URL Identity & Basic Components", learnerTask: "Identify URL by canonical expansion/purpose and distinguish scheme, host/domain and path at awareness depth.", sourceProvisionalTaskId: "COM004-PT-005", supportedSolveModes: ["ACRONYM_EXPANSION", "PURPOSE_FROM_TERM", "COMPONENT_FROM_ROLE", "ROLE_FROM_COMPONENT"], ownershipBoundaries: ["DNS resolution and IP/network addressing mechanics remain COM-005; URL is not defined as only a website address."] }),
  ql({ qlId: "COM-004-QL-006", cpId: "COM-004-CP-003", title: "HTTP vs HTTPS Awareness", learnerTask: "Distinguish HTTP from HTTPS at Web-use depth while recognizing that protected transport alone does not prove site legitimacy.", sourceProvisionalTaskId: "COM004-PT-006", supportedSolveModes: ["ACRONYM_EXPANSION", "HTTP_HTTPS_COMPARISON", "CORRECT_STATEMENT", "SAFETY_GUARD_SELECTION"], ownershipBoundaries: ["TLS mechanics, port numbers and protocol-stack depth remain COM-005/COM-006; never equate HTTPS with a trustworthy operator."] }),
  ql({ qlId: "COM-004-QL-007", cpId: "COM-004-CP-004", title: "E-mail Address, Recipient Fields & Subject", learnerTask: "Interpret basic e-mail address structure and select To, CC, BCC or Subject from recipient/visibility/topic requirements.", sourceProvisionalTaskId: "COM004-PT-007", supportedSolveModes: ["ADDRESS_COMPONENT", "FIELD_FROM_REQUIREMENT", "REQUIREMENT_FROM_FIELD", "CC_BCC_VISIBILITY"], ownershipBoundaries: ["Recipient visibility must be explicit; do not ask ambiguous social conventions about who 'should' receive a copy."] }),
  ql({ qlId: "COM-004-QL-008", cpId: "COM-004-CP-004", title: "E-mail Mailbox Folder & Message State", learnerTask: "Map Inbox, Outbox, Sent, Draft, Spam/Junk and Trash/Deleted Items to stable message-state meanings.", sourceProvisionalTaskId: "COM004-PT-008", supportedSolveModes: ["FOLDER_FROM_STATE", "STATE_FROM_FOLDER", "FOLDER_CLASSIFICATION"], ownershipBoundaries: ["Do not conflate Outbox with Sent or depend on client-specific retention behavior."] }),
  ql({ qlId: "COM-004-QL-009", cpId: "COM-004-CP-004", title: "E-mail Response Actions, Attachments & Signatures", learnerTask: "Distinguish Reply, Reply All and Forward and identify attachment/signature roles in message use.", sourceProvisionalTaskId: "COM004-PT-009", supportedSolveModes: ["ACTION_FROM_RECIPIENT_INTENT", "ROLE_FROM_FEATURE", "FEATURE_FROM_ROLE", "REPLY_FORWARD_COMPARISON"], ownershipBoundaries: ["Mail transport protocols belong to QL-010; this QL owns user-facing message operations."] }),
  ql({ qlId: "COM-004-QL-010", cpId: "COM-004-CP-005", title: "E-mail Protocol Roles — SMTP, POP3 & IMAP", learnerTask: "Identify SMTP, POP3 and IMAP by canonical expansion and durable sending/mailbox-access role.", sourceProvisionalTaskId: "COM004-PT-010", supportedSolveModes: ["ACRONYM_EXPANSION", "PROTOCOL_FROM_ROLE", "ROLE_FROM_PROTOCOL", "SENDING_VS_ACCESS"], ownershipBoundaries: ["Port numbers and transport-stack details remain COM-005; do not claim POP3 universally deletes server mail or only supports one device."] }),
  ql({ qlId: "COM-004-QL-011", cpId: "COM-004-CP-006", title: "E-commerce & E-governance Concepts", learnerTask: "Distinguish electronic commercial activity from digital government/public-service delivery at awareness depth.", sourceProvisionalTaskId: "COM004-PT-011", supportedSolveModes: ["CONCEPT_FROM_CONTEXT", "CONTEXT_FROM_CONCEPT", "ECOMMERCE_VS_EGOVERNANCE"], ownershipBoundaries: ["Named apps/services and mutable government product features are excluded unless separately validity-scoped."] }),
  ql({ qlId: "COM-004-QL-012", cpId: "COM-004-CP-007", title: "OTP & QR Identity/Purpose", learnerTask: "Identify OTP and QR by canonical expansion and durable authentication/encoded-information purpose without treating either as a safety guarantee.", sourceProvisionalTaskId: "COM004-PT-013", supportedSolveModes: ["ACRONYM_EXPANSION", "TOOL_FROM_PURPOSE", "PURPOSE_FROM_TOOL", "CORRECT_STATEMENT"], ownershipBoundaries: ["Fraud/threat taxonomy remains COM-006; QR/OTP are not inherently proof of safety or fraud."] }),
  ql({ qlId: "COM-004-QL-013", cpId: "COM-004-CP-007", title: "UPI Identity, Canonical Expansion & Durable Purpose", learnerTask: "Identify UPI as Unified Payments Interface and map it to durable bank-account payment/fund-transfer purposes.", sourceProvisionalTaskId: "COM004-PT-014", supportedSolveModes: ["ACRONYM_EXPANSION", "SYSTEM_FROM_PURPOSE", "PURPOSE_FROM_SYSTEM", "CANONICAL_NAME_SELECTION"], ownershipBoundaries: ["Use NPCI canonical plural 'Payments'; changing product limits/features require freshness scope."] }),
  ql({ qlId: "COM-004-QL-014", cpId: "COM-004-CP-007", title: "AePS & USSD Financial-Access Channels", learnerTask: "Identify AePS and USSD/*99# from canonical expansion and durable authentication/access-channel properties.", sourceProvisionalTaskId: "COM004-PT-015", supportedSolveModes: ["ACRONYM_EXPANSION", "SYSTEM_FROM_PURPOSE", "PURPOSE_FROM_SYSTEM", "AEPS_USSD_COMPARISON"], ownershipBoundaries: ["Operator/bank-specific menus, charges and transient codes are excluded; current service details require freshness scope."] }),
  ql({ qlId: "COM-004-QL-015", cpId: "COM-004-CP-007", title: "Cards, E-wallet/PPI & Point-of-Sale Concepts", learnerTask: "Distinguish basic debit/credit card funding concepts, prepaid stored-value instruments/e-wallets and Point-of-Sale payment context.", sourceProvisionalTaskId: "COM004-PT-016", supportedSolveModes: ["PAYMENT_TOOL_FROM_DESCRIPTION", "DESCRIPTION_FROM_TOOL", "DEBIT_CREDIT_COMPARISON", "PPI_WALLET_POS_CLASSIFICATION"], ownershipBoundaries: ["Fees, current limits, KYC thresholds and acceptance rules are mutable and excluded from immutable question authority."] }),
  ql({ qlId: "COM-004-QL-016", cpId: "COM-004-CP-008", title: "Internet Banking / E-banking Concept", learnerTask: "Identify Internet banking/e-banking from online delivery and use of banking services and common electronic fund-transfer context.", sourceProvisionalTaskId: "COM004-PT-017", supportedSolveModes: ["CONCEPT_FROM_CONTEXT", "CONTEXT_FROM_CONCEPT", "SERVICE_CLASSIFICATION"], ownershipBoundaries: ["Individual NEFT/RTGS/IMPS settlement models belong to QL-017; bank-specific app features are excluded."] }),
  ql({ qlId: "COM-004-QL-017", cpId: "COM-004-CP-008", title: "NEFT, RTGS & IMPS Identity and Durable Settlement Models", learnerTask: "Identify NEFT, RTGS and IMPS by expansion and distinguish batch, real-time gross and instant-transfer models using durable authority-backed properties.", sourceProvisionalTaskId: "COM004-PT-018", supportedSolveModes: ["ACRONYM_EXPANSION", "SERVICE_FROM_MODEL", "MODEL_FROM_SERVICE", "SERVICE_COMPARISON", "CORRECT_PAIR"], ownershipBoundaries: ["Do not use mutable monetary thresholds, charges, exact batch counts or availability trivia as frozen discriminators."] }),
  ql({ qlId: "COM-004-QL-018", cpId: "COM-004-CP-009", title: "Digital-Service Safe-Action Selection", learnerTask: "Choose regulator-backed safe actions for credential secrecy, suspicious links/channels and unauthorised transaction response.", sourceProvisionalTaskId: "COM004-PT-019", supportedSolveModes: ["SAFE_ACTION_FROM_SCENARIO", "UNSAFE_ACTION_IDENTIFICATION", "CREDENTIAL_SECRECY", "RESPONSE_SELECTION"], ownershipBoundaries: ["Threat labels such as phishing/vishing/malware remain COM-006 unless incidental; multiple safe actions must never be used as mutually exclusive distractors."] }),
] as const;

export const COM004_PERMANENT_CPS: readonly Com004PermanentCp[] = [
  ["COM-004-CP-001", "Internet & WWW Fundamentals"],
  ["COM-004-CP-002", "Browsers, Search & Web Use"],
  ["COM-004-CP-003", "URL, HTTP & HTTPS Awareness"],
  ["COM-004-CP-004", "E-mail Structure & Operations"],
  ["COM-004-CP-005", "E-mail Service Protocols"],
  ["COM-004-CP-006", "Digital Public & Commercial Services"],
  ["COM-004-CP-007", "Digital Financial Tools"],
  ["COM-004-CP-008", "Internet Banking & Electronic Fund Transfer"],
  ["COM-004-CP-009", "Digital-Service Safety Basics"],
].map(([cpId, title]) => ({ cpId, title, qlIds: COM004_PERMANENT_QLS.filter((item) => item.cpId === cpId).map((item) => item.qlId), status: "ALLOCATED_NOT_CONTENT_FROZEN" as const }));

export const COM004_HELD_DISCOVERY_CANDIDATES = [
  { candidateId: "WEB-DISC-025", reason: "Netiquette remains editorially held until objective target-exam evidence supports a dedicated scenario QL." },
  { candidateId: "WEB-DISC-041", reason: "Multi-statement composition is a surface format and may consume only independently approved atomic facts after content freeze." },
  { candidateId: "WEB-DISC-042", reason: "Multi-pair matching is a composition surface and may consume only independently approved relation pairs after content freeze." },
] as const;

export function auditCom004PermanentQlAllocation() {
  const issues: string[] = [];
  const editorial = auditCom004EditorialFactReview();
  if (!editorial.valid) issues.push(...editorial.issues.map((issue) => `EDITORIAL:${issue}`));

  const allocatableTaskIds = COM004_EDITORIAL_TASK_DECISIONS.filter((entry) => entry.decision === "ALLOCATE").map((entry) => entry.taskId).sort();
  const allocatedTaskIds = COM004_PERMANENT_QLS.map((entry) => entry.sourceProvisionalTaskId).sort();
  if (JSON.stringify(allocatableTaskIds) !== JSON.stringify(allocatedTaskIds)) issues.push("ALLOCATED_QLS_DO_NOT_MATCH_EDITORIAL_ALLOCATE_SET");

  const qlIds = COM004_PERMANENT_QLS.map((entry) => entry.qlId);
  const expectedQlIds = Array.from({ length: 18 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) issues.push("NON_SEQUENTIAL_OR_MISSING_QL_IDS");
  if (new Set(allocatedTaskIds).size !== allocatedTaskIds.length) issues.push("DUPLICATE_SOURCE_TASK_ALLOCATION");
  if (COM004_PERMANENT_CPS.length !== 9) issues.push(`UNEXPECTED_CP_COUNT:${COM004_PERMANENT_CPS.length}`);
  for (const cp of COM004_PERMANENT_CPS) {
    if (!cp.qlIds.length) issues.push(`EMPTY_PERMANENT_CP:${cp.cpId}`);
  }
  for (const qlEntry of COM004_PERMANENT_QLS) {
    if (!qlEntry.supportedSolveModes.length) issues.push(`QL_WITHOUT_SOLVE_MODES:${qlEntry.qlId}`);
    if (!qlEntry.ownershipBoundaries.length) issues.push(`QL_WITHOUT_BOUNDARY:${qlEntry.qlId}`);
    if (qlEntry.status !== "ALLOCATED_NOT_CONTENT_FROZEN") issues.push(`PREMATURE_QL_STATUS:${qlEntry.qlId}`);
  }

  const heldIds = COM004_HELD_DISCOVERY_CANDIDATES.map((entry) => entry.candidateId).sort();
  if (JSON.stringify(heldIds) !== JSON.stringify(["WEB-DISC-025", "WEB-DISC-041", "WEB-DISC-042"])) issues.push("UNEXPECTED_HELD_CANDIDATE_SET");

  return {
    valid: issues.length === 0,
    cpCount: COM004_PERMANENT_CPS.length,
    qlCount: COM004_PERMANENT_QLS.length,
    allocatedTaskCount: allocatedTaskIds.length,
    heldCandidateIds: heldIds,
    contentFrozen: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publicPublicationAuthorized: false,
    productionEligible: false,
    nextGate: issues.length === 0 ? "COM004_ENGLISH_REVIEW_CORPUS_V1" as const : "BLOCKED" as const,
    issues,
  };
}
