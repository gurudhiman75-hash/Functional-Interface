import { validateKnowledgeFactEligibility } from "../eligibility";
import type { KnowledgeFact } from "../types";
import { COM003_CANDIDATE_FACTS } from "./com003-candidate-fact-corpus";

export type Com003EditorialDisposition = "APPROVE" | "HOLD" | "REJECT";
export type Com003EditorialUsage =
  | "TARGET_AND_DISTRACTOR"
  | "DISTRACTOR_SUPPORT"
  | "VALIDATOR_ONLY"
  | "HELD";

export type Com003EditorialDecision = {
  factId: string;
  disposition: Com003EditorialDisposition;
  usage: Com003EditorialUsage;
  rationale: string;
  generationNotes?: readonly string[];
};

const SUPPORT_ONLY_FACTS = new Map<string, string>([
  [
    "com003-command-redo",
    "Redo wording varies slightly by Office application/state; retain the canonical command concept as support while learner-facing shortcut/command targets use cleaner actions.",
  ],
  [
    "com003-shortcut-ctrl-y",
    "Ctrl+Y can be described as redo or repeat depending on Office application and current state. Keep as controlled distractor/support unless a stem explicitly defines the application/state.",
  ],
  [
    "com003-excel-autosum-detect-range",
    "Useful to validate AutoSum explanations, but detected-range behavior depends on neighboring data. Keep as support instead of an unconditional learner-facing target.",
  ],
  [
    "com003-excel-filter-not-sort",
    "Misconception guard proving that filtering is a visibility/criteria operation rather than sorting. Keep as support so negative wording does not dominate generated stems.",
  ],
]);

const VALIDATOR_ONLY_FACTS = new Map<string, string>([
  [
    "com003-powerpoint-web-insert-picture-tab",
    "Technically sourced for PowerPoint for the web and useful to validate version-scoped Ribbon questions, but must not be generalized to all desktop versions. Hold out of ordinary learner-facing targeting.",
  ],
]);

const SPECIAL_NOTES = new Map<string, readonly string[]>([
  [
    "com003-format-ppsx",
    ["Do not imply PPSX is the only PowerPoint slide-show-capable format; ask specifically about the show file format/open-in-slide-show behavior."],
  ],
  [
    "com003-excel-function-count",
    ["COUNT targets numeric entries in the basic awareness context. Do not blur COUNT with COUNTA, COUNTIF or other COUNT-family functions."],
  ],
  [
    "com003-excel-relative-reference",
    ["Use ordinary copied/filled-formula context; mixed references remain distractor/support notation, not a COM-003 target in this checkpoint."],
  ],
  [
    "com003-excel-absolute-reference",
    ["Use ordinary copied/filled-formula context; distinguish full absolute reference from mixed references."],
  ],
  [
    "com003-excel-absolute-reference-notation",
    ["$A$1 means both column and row are absolute. Do not accept $A1 or A$1 as fully absolute references."],
  ],
  [
    "com003-excel-line-chart",
    ["Phrase as a common/canonical use for showing trends over ordered intervals; avoid absolute 'best chart' claims without context."],
  ],
  [
    "com003-excel-pie-chart",
    ["Use a one-series parts-of-a-whole context. Avoid claiming pie charts are universally best for percentage data."],
  ],
  [
    "com003-excel-bar-chart",
    ["Phrase as a common use for comparing categories/items rather than a universal best-chart rule."],
  ],
  [
    "com003-excel-shortcut-alt-h-o-w",
    ["Stem must explicitly state Windows desktop Excel/Ribbon access-key context; never present the sequence as platform-independent."],
  ],
  [
    "com003-word-find-purpose",
    ["Find locates text/content; do not imply it changes the located text."],
  ],
  [
    "com003-word-replace-purpose",
    ["Replace must be described as substitution of located content, not mere search."],
  ],
  [
    "com003-powerpoint-transition-definition",
    ["Transition applies to slide-to-slide change; do not use transition and object animation interchangeably."],
  ],
  [
    "com003-powerpoint-animation-definition",
    ["Animation applies to slide objects/text; do not describe it as the slide-to-slide effect."],
  ],
  [
    "com003-powerpoint-transition-duration",
    ["Duration describes how long the transition effect takes, not how long the slide remains visible before automatic advance."],
  ],
  [
    "com003-powerpoint-auto-advance-time",
    ["Automatic advance time describes when the next slide is triggered, not the speed/duration of the transition effect itself."],
  ],
]);

function genericVersionNote(fact: KnowledgeFact): readonly string[] {
  if (!fact.tags.includes("version-scoped")) return [];
  return [
    "Version/platform-scoped fact: learner-facing stem must state the supported Windows desktop or web context encoded by the source; freshness verification must remain current.",
  ];
}

export const COM003_EDITORIAL_FACT_DECISIONS: readonly Com003EditorialDecision[] =
  COM003_CANDIDATE_FACTS.map((fact) => {
    const special = SPECIAL_NOTES.get(fact.factId) ?? [];
    const versionNotes = genericVersionNote(fact);
    const validatorRationale = VALIDATOR_ONLY_FACTS.get(fact.factId);
    if (validatorRationale) {
      return {
        factId: fact.factId,
        disposition: "APPROVE",
        usage: "VALIDATOR_ONLY",
        rationale: validatorRationale,
        generationNotes: [...special, ...versionNotes],
      } as const;
    }
    const supportRationale = SUPPORT_ONLY_FACTS.get(fact.factId);
    if (supportRationale) {
      return {
        factId: fact.factId,
        disposition: "APPROVE",
        usage: "DISTRACTOR_SUPPORT",
        rationale: supportRationale,
        generationNotes: [...special, ...versionNotes],
      } as const;
    }
    return {
      factId: fact.factId,
      disposition: "APPROVE",
      usage: "TARGET_AND_DISTRACTOR",
      rationale: "First-party source-backed, within an exam-supported COM-003 provisional learner-task boundary, and editorially suitable for review-only competitive-exam synthesis.",
      generationNotes: [...special, ...versionNotes],
    } as const;
  });

const decisionByFactId = new Map(COM003_EDITORIAL_FACT_DECISIONS.map((decision) => [decision.factId, decision]));

function promoteFact(fact: KnowledgeFact, usage: Com003EditorialUsage): KnowledgeFact {
  return {
    ...fact,
    review: {
      status: "APPROVED",
      confidence: usage === "TARGET_AND_DISTRACTOR" ? 0.95 : 0.92,
      reviewedBy: "COM003_EDITORIAL_FACT_REVIEW_V1",
      reviewedAt: "2026-08-31T08:05:00.000Z",
    },
  };
}

export const COM003_EDITORIALLY_APPROVED_FACTS: readonly KnowledgeFact[] = COM003_CANDIDATE_FACTS
  .filter((fact) => decisionByFactId.get(fact.factId)?.disposition === "APPROVE")
  .map((fact) => promoteFact(fact, decisionByFactId.get(fact.factId)!.usage));

export const COM003_EDITORIAL_TARGET_FACTS: readonly KnowledgeFact[] = COM003_EDITORIALLY_APPROVED_FACTS.filter(
  (fact) => decisionByFactId.get(fact.factId)?.usage === "TARGET_AND_DISTRACTOR",
);

export const COM003_EDITORIAL_SUPPORT_FACTS: readonly KnowledgeFact[] = COM003_EDITORIALLY_APPROVED_FACTS.filter(
  (fact) => decisionByFactId.get(fact.factId)?.usage === "DISTRACTOR_SUPPORT",
);

export const COM003_EDITORIAL_VALIDATOR_FACTS: readonly KnowledgeFact[] = COM003_EDITORIALLY_APPROVED_FACTS.filter(
  (fact) => decisionByFactId.get(fact.factId)?.usage === "VALIDATOR_ONLY",
);

export function getCom003EditorialDecision(factId: string) {
  return decisionByFactId.get(factId) ?? null;
}

export function auditCom003EditorialFactReview() {
  const issues: string[] = [];
  const candidateIds = new Set(COM003_CANDIDATE_FACTS.map((fact) => fact.factId));
  const decisionIds = new Set<string>();

  for (const decision of COM003_EDITORIAL_FACT_DECISIONS) {
    if (decisionIds.has(decision.factId)) issues.push(`DUPLICATE_DECISION:${decision.factId}`);
    decisionIds.add(decision.factId);
    if (!candidateIds.has(decision.factId)) issues.push(`DECISION_FOR_UNKNOWN_FACT:${decision.factId}`);
    if (decision.disposition === "APPROVE" && decision.usage === "HELD") issues.push(`APPROVED_FACT_MARKED_HELD:${decision.factId}`);
    if (decision.disposition !== "APPROVE" && decision.usage !== "HELD") issues.push(`NON_APPROVED_FACT_HAS_GENERATION_USAGE:${decision.factId}`);
  }
  for (const factId of candidateIds) {
    if (!decisionIds.has(factId)) issues.push(`MISSING_EDITORIAL_DECISION:${factId}`);
  }

  const targetIds = new Set(COM003_EDITORIAL_TARGET_FACTS.map((fact) => fact.factId));
  for (const factId of SUPPORT_ONLY_FACTS.keys()) {
    if (targetIds.has(factId)) issues.push(`SUPPORT_FACT_LEAKED_TO_TARGETS:${factId}`);
  }
  for (const factId of VALIDATOR_ONLY_FACTS.keys()) {
    if (targetIds.has(factId)) issues.push(`VALIDATOR_FACT_LEAKED_TO_TARGETS:${factId}`);
  }

  for (const fact of COM003_EDITORIALLY_APPROVED_FACTS) {
    const eligibility = validateKnowledgeFactEligibility(fact, {
      asOf: "2026-08-31T08:05:00.000Z",
      minimumConfidence: 0.9,
    });
    if (!eligibility.eligible) {
      issues.push(`APPROVED_FACT_NOT_KNOWLEDGE_ELIGIBLE:${fact.factId}:${eligibility.issues.map((issue) => issue.code).join("+")}`);
    }
    if (fact.tags.includes("version-scoped")) {
      const notes = decisionByFactId.get(fact.factId)?.generationNotes?.join(" ") ?? "";
      if (!/version|platform|windows desktop|web/i.test(notes)) issues.push(`VERSION_SCOPED_FACT_MISSING_GENERATION_GUARD:${fact.factId}`);
      if (fact.freshness.class === "IMMUTABLE") issues.push(`VERSION_SCOPED_FACT_IMMUTABLE_AFTER_REVIEW:${fact.factId}`);
    }
  }

  const targetTaskIds = new Set(
    COM003_EDITORIAL_TARGET_FACTS.flatMap((fact) =>
      fact.tags.filter((tag) => tag.startsWith("provisional-task:")).map((tag) => tag.replace("provisional-task:", "")),
    ),
  );
  for (let n = 1; n <= 19; n += 1) {
    const taskId = `COM003-PT-${String(n).padStart(3, "0")}`;
    if (!targetTaskIds.has(taskId)) issues.push(`PROVISIONAL_TASK_WITHOUT_TARGET_FACT:${taskId}`);
  }

  const approvedCount = COM003_EDITORIALLY_APPROVED_FACTS.length;
  const targetFactCount = COM003_EDITORIAL_TARGET_FACTS.length;
  const supportFactCount = COM003_EDITORIAL_SUPPORT_FACTS.length;
  const validatorFactCount = COM003_EDITORIAL_VALIDATOR_FACTS.length;
  const heldCount = COM003_EDITORIAL_FACT_DECISIONS.filter((decision) => decision.disposition === "HOLD").length;
  const rejectedCount = COM003_EDITORIAL_FACT_DECISIONS.filter((decision) => decision.disposition === "REJECT").length;

  if (approvedCount !== 119) issues.push(`UNEXPECTED_APPROVED_COUNT:${approvedCount}`);
  if (targetFactCount !== 114) issues.push(`UNEXPECTED_TARGET_COUNT:${targetFactCount}`);
  if (supportFactCount !== 4) issues.push(`UNEXPECTED_SUPPORT_COUNT:${supportFactCount}`);
  if (validatorFactCount !== 1) issues.push(`UNEXPECTED_VALIDATOR_COUNT:${validatorFactCount}`);
  if (heldCount !== 0 || rejectedCount !== 0) issues.push(`UNEXPECTED_HOLD_REJECT_COUNT:${heldCount}:${rejectedCount}`);

  return {
    valid: issues.length === 0,
    candidateCount: COM003_CANDIDATE_FACTS.length,
    approvedCount,
    targetFactCount,
    supportFactCount,
    validatorFactCount,
    heldCount,
    rejectedCount,
    targetTaskCount: targetTaskIds.size,
    permanentQlCount: 0,
    allocationReady: false,
    runtimeRegistered: false,
    productionReleased: false,
    issues,
  };
}
