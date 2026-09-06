import { COM004_CANDIDATE_FACTS } from "./com004-candidate-fact-corpus";
import { auditCom004CorpusSaturation } from "./com004-corpus-saturation-audit";
import { auditCom004DistractorReadiness } from "./com004-distractor-readiness";
import { COM004_PROVISIONAL_LEARNER_TASKS } from "./com004-merge-split-audit";

export type Com004EditorialDecision = {
  taskId: string;
  decision: "ALLOCATE" | "HOLD";
  rationale: string[];
};

/**
 * Editorial gate between source/distractor readiness and permanent QL allocation.
 * A task can remain well sourced at discovery level yet still be held if the
 * resulting exam question would be subjective, low-yield or too version-sensitive.
 */
export const COM004_EDITORIAL_TASK_DECISIONS: readonly Com004EditorialDecision[] = [
  { taskId: "COM004-PT-001", decision: "ALLOCATE", rationale: ["Internet/WWW/Web-resource distinctions are durable, objective and syllabus-owned."] },
  { taskId: "COM004-PT-002", decision: "ALLOCATE", rationale: ["Browser/search-engine classification is exam-real and has controlled same-neighborhood distractors."] },
  { taskId: "COM004-PT-003", decision: "ALLOCATE", rationale: ["Upload/download direction is an objective binary learner demand explicitly inside SSC scope."] },
  { taskId: "COM004-PT-004", decision: "ALLOCATE", rationale: ["Refresh/back/forward/bookmark semantics are durable when UI placement and branding are excluded."] },
  { taskId: "COM004-PT-005", decision: "ALLOCATE", rationale: ["URL identity and basic scheme/host/path roles are standards-backed at awareness depth."] },
  { taskId: "COM004-PT-006", decision: "ALLOCATE", rationale: ["HTTP/HTTPS awareness is useful and technically guarded against the false 'HTTPS means trustworthy site' shortcut."] },
  { taskId: "COM004-PT-007", decision: "ALLOCATE", rationale: ["E-mail address and To/CC/BCC/Subject tasks are objective when recipient visibility is explicit."] },
  { taskId: "COM004-PT-008", decision: "ALLOCATE", rationale: ["Mailbox folder/state mapping has a six-item durable fact neighborhood and clear Outbox/Sent guard."] },
  { taskId: "COM004-PT-009", decision: "ALLOCATE", rationale: ["Reply/Reply All/Forward/Attachment/Signature are distinct user-operation semantics."] },
  { taskId: "COM004-PT-010", decision: "ALLOCATE", rationale: ["SMTP/POP3/IMAP roles are standards-backed and guarded against common POP3 oversimplifications."] },
  { taskId: "COM004-PT-011", decision: "ALLOCATE", rationale: ["E-commerce versus e-governance is a durable syllabus-owned commercial/public-service distinction."] },
  { taskId: "COM004-PT-012", decision: "HOLD", rationale: ["Netiquette is present in curriculum breadth but current source/PYQ evidence is not specific enough to guarantee objective scenario answerability.", "Hold rather than manufacturing a permanent QL from subjective good-behaviour wording; revisit if target-exam evidence supplies stable patterns."] },
  { taskId: "COM004-PT-013", decision: "ALLOCATE", rationale: ["OTP/QR identity and purpose facts are durable when safety guarantees are explicitly excluded."] },
  { taskId: "COM004-PT-014", decision: "ALLOCATE", rationale: ["UPI canonical naming and durable purpose are product-owner backed; capability facts remain version-scoped."] },
  { taskId: "COM004-PT-015", decision: "ALLOCATE", rationale: ["AePS and USSD have authoritative product semantics and a viable controlled contrast."] },
  { taskId: "COM004-PT-016", decision: "ALLOCATE", rationale: ["Cards/PPI/e-wallet/PoS concepts are curriculum/regulator backed; mutable limits and charges remain excluded."] },
  { taskId: "COM004-PT-017", decision: "ALLOCATE", rationale: ["Internet banking/e-banking is explicit SSC/NIELIT scope and can be tested without bank-specific product trivia."] },
  { taskId: "COM004-PT-018", decision: "ALLOCATE", rationale: ["NEFT/RTGS/IMPS expansions and durable settlement models are regulator/product-owner backed with mutable detail excluded."] },
  { taskId: "COM004-PT-019", decision: "ALLOCATE", rationale: ["Safe-action selection is regulator backed and remains separate from COM-006 threat taxonomy."] },
] as const;

function factValue(factId: string): string {
  const fact = COM004_CANDIDATE_FACTS.find((entry) => entry.factId === factId);
  if (!fact || fact.value.kind !== "text") throw new Error(`Missing text fact ${factId}`);
  return fact.value.text.en;
}

export function auditCom004EditorialFactReview() {
  const issues: string[] = [];
  const saturation = auditCom004CorpusSaturation();
  const distractors = auditCom004DistractorReadiness();
  if (!saturation.valid) issues.push(...saturation.issues.map((issue) => `SATURATION:${issue}`));
  if (!distractors.valid) issues.push(...distractors.issues.map((issue) => `DISTRACTOR:${issue}`));

  const provisionalTaskIds = COM004_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId)
    .sort();
  const decisionTaskIds = COM004_EDITORIAL_TASK_DECISIONS.map((entry) => entry.taskId).sort();
  if (JSON.stringify(provisionalTaskIds) !== JSON.stringify(decisionTaskIds)) {
    issues.push("EDITORIAL_DECISIONS_DO_NOT_COVER_PROVISIONAL_TASKS_EXACTLY");
  }

  const seen = new Set<string>();
  for (const decision of COM004_EDITORIAL_TASK_DECISIONS) {
    if (seen.has(decision.taskId)) issues.push(`DUPLICATE_EDITORIAL_DECISION:${decision.taskId}`);
    seen.add(decision.taskId);
    if (!decision.rationale.length) issues.push(`EDITORIAL_DECISION_WITHOUT_RATIONALE:${decision.taskId}`);
  }

  const upiExpansion = factValue("com004-upi-expansion");
  if (upiExpansion !== "Unified Payments Interface") issues.push(`NON_CANONICAL_UPI_EXPANSION:${upiExpansion}`);

  const httpsGuard = factValue("com004-https-trust-guard").toLowerCase();
  if (!httpsGuard.includes("does not by itself prove")) issues.push("HTTPS_TRUST_GUARD_MISSING");

  const pop3Role = factValue("com004-pop3-role").toLowerCase();
  if (/always|universally|delete|single-device|local-only/.test(pop3Role)) issues.push("POP3_OVERSIMPLIFICATION_PRESENT");

  const paymentFacts = COM004_CANDIDATE_FACTS.filter((fact) => fact.tags.includes("provisional-task:COM004-PT-018"));
  for (const fact of paymentFacts) {
    if (fact.value.kind !== "text") continue;
    const value = fact.value.text.en;
    if (/₹|\brs\.?\s*\d|\bcharge(?:s)?\b|\bfee(?:s)?\b|\bminimum amount\b|\bmaximum amount\b/i.test(value)) {
      issues.push(`MUTABLE_PAYMENT_TRIVIA:${fact.factId}`);
    }
  }

  const unsafeClaims = COM004_CANDIDATE_FACTS.filter((fact) => {
    if (fact.value.kind !== "text") return false;
    const value = fact.value.text.en.toLowerCase();
    return /https (?:guarantees|proves) (?:a )?(?:safe|legitimate|trustworthy)/.test(value)
      || /otp (?:guarantees|ensures) safety/.test(value)
      || /qr (?:code )?(?:is|means) (?:always )?(?:safe|fraudulent)/.test(value);
  });
  if (unsafeClaims.length) issues.push(...unsafeClaims.map((fact) => `UNSAFE_ABSOLUTE_CLAIM:${fact.factId}`));

  const held = COM004_EDITORIAL_TASK_DECISIONS.filter((entry) => entry.decision === "HOLD");
  const allocatable = COM004_EDITORIAL_TASK_DECISIONS.filter((entry) => entry.decision === "ALLOCATE");
  if (held.length !== 1 || held[0]?.taskId !== "COM004-PT-012") issues.push("UNEXPECTED_EDITORIAL_HOLD_SET");
  if (allocatable.length !== 18) issues.push(`UNEXPECTED_ALLOCATABLE_TASK_COUNT:${allocatable.length}`);

  return {
    valid: issues.length === 0,
    decisionCount: COM004_EDITORIAL_TASK_DECISIONS.length,
    allocatableTaskIds: allocatable.map((entry) => entry.taskId),
    heldTaskIds: held.map((entry) => entry.taskId),
    readyForPermanentQlAllocation: issues.length === 0,
    permanentQlCount: 0,
    productionEligible: false,
    nextGate: issues.length === 0 ? "COM004_PERMANENT_QL_ALLOCATION" as const : "BLOCKED" as const,
    issues,
  };
}
