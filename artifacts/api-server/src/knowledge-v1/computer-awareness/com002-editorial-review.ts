import type { KnowledgeFact } from "../types";
import { COM002_ALL_CANDIDATE_FACTS } from "./com002-corpus-coverage";

export type Com002EditorialDisposition = "APPROVE" | "HOLD" | "REJECT";
export type Com002EditorialUsage =
  | "TARGET_AND_DISTRACTOR"
  | "DISTRACTOR_SUPPORT"
  | "VALIDATOR_ONLY"
  | "HELD";

export type Com002EditorialDecision = {
  factId: string;
  disposition: Com002EditorialDisposition;
  usage: Com002EditorialUsage;
  rationale: string;
  generationNotes?: readonly string[];
};

const SUPPORT_ONLY_FACTS = new Map<string, string>([
  ["com002-embedded-os-property", "Technically valid OS-type knowledge; retain as semantic/distractor support until stronger recurring target-exam evidence justifies learner-facing targeting."],
  ["com002-distributed-os-property", "Useful neighboring OS type, but learner-facing targeting is held below the stronger SSC/Banking core type set."],
  ["com002-network-os-property", "Useful neighboring OS type for semantic discrimination; not a priority target in the current exam-backed core."],
  ["com002-cluster-os-property", "Valid but comparatively niche awareness knowledge; use to strengthen the type ontology, not as a default target."],
  ["com002-shell-interface-role", "Useful OS-component distractor/support fact; the permanent QL targets kernel identity/function rather than shell trivia."],
  ["com002-process-scheduler-role", "Supports kernel/component discrimination without broadening the permanent QL into process-scheduling theory."],
  ["com002-memory-manager-role", "Supports kernel/component discrimination without creating a separate memory-management learner task."],
  ["com002-file-system-manager-role", "Supports kernel/component discrimination without turning QL-004 into a generic OS-internals taxonomy."],
  ["com002-sleep-power-state", "Useful neighboring Windows power-state distinction; QL-006 learner-facing core remains boot/restart/shutdown."],
  ["com002-hibernate-power-state", "Useful neighboring Windows power-state distinction; QL-006 learner-facing core remains boot/restart/shutdown."],
]);

const VALIDATOR_ONLY_FACTS = new Map<string, string>([
  ["com002-nonlocal-delete-caveat", "Critical guard against universal Recycle Bin claims. Use to validate context wording, not as a default learner-facing target."],
]);

const SPECIAL_NOTES = new Map<string, readonly string[]>([
  ["com002-extension-jpg", ["JPEG has more than one common extension. Do not place .jpg and .jpeg as competing answers to a reverse file-type-to-extension question."]],
  ["com002-extension-jpeg", ["JPEG has more than one common extension. Do not place .jpg and .jpeg as competing answers to a reverse file-type-to-extension question."]],
  ["com002-android-open-source", ["Use the competitive-exam convention supported by reviewed SSC evidence; avoid claims about every vendor-specific Android distribution or bundled component."]],
  ["com002-linux-classification", ["Use Linux as an operating-system answer in competitive-exam convention; do not turn this into a kernel-vs-distribution terminology trap."]],
  ["com002-local-delete-recycle-bin", ["Stem must specify ordinary local Windows deletion when necessary; validator-only non-local caveat prevents overgeneralization."]],
]);

export const COM002_EDITORIAL_FACT_DECISIONS: readonly Com002EditorialDecision[] =
  COM002_ALL_CANDIDATE_FACTS.map((fact) => {
    const validatorRationale = VALIDATOR_ONLY_FACTS.get(fact.factId);
    if (validatorRationale) {
      return {
        factId: fact.factId,
        disposition: "APPROVE",
        usage: "VALIDATOR_ONLY",
        rationale: validatorRationale,
        generationNotes: SPECIAL_NOTES.get(fact.factId),
      } as const;
    }
    const supportRationale = SUPPORT_ONLY_FACTS.get(fact.factId);
    if (supportRationale) {
      return {
        factId: fact.factId,
        disposition: "APPROVE",
        usage: "DISTRACTOR_SUPPORT",
        rationale: supportRationale,
        generationNotes: SPECIAL_NOTES.get(fact.factId),
      } as const;
    }
    return {
      factId: fact.factId,
      disposition: "APPROVE",
      usage: "TARGET_AND_DISTRACTOR",
      rationale: "Source-backed, within the permanent COM-002 learner-task boundary, and suitable for competitive-exam review synthesis.",
      generationNotes: SPECIAL_NOTES.get(fact.factId),
    } as const;
  });

const decisionByFactId = new Map(COM002_EDITORIAL_FACT_DECISIONS.map((decision) => [decision.factId, decision]));

function promoteFact(fact: KnowledgeFact, usage: Com002EditorialUsage): KnowledgeFact {
  return {
    ...fact,
    review: {
      status: "APPROVED",
      confidence: usage === "TARGET_AND_DISTRACTOR" ? 0.95 : 0.92,
      reviewedBy: "COM002_EDITORIAL_REVIEW_V1",
      reviewedAt: "2026-08-26T01:45:00.000Z",
    },
  };
}

export const COM002_EDITORIALLY_APPROVED_FACTS: readonly KnowledgeFact[] =
  COM002_ALL_CANDIDATE_FACTS
    .filter((fact) => decisionByFactId.get(fact.factId)?.disposition === "APPROVE")
    .map((fact) => promoteFact(fact, decisionByFactId.get(fact.factId)!.usage));

export const COM002_EDITORIAL_TARGET_FACTS: readonly KnowledgeFact[] =
  COM002_EDITORIALLY_APPROVED_FACTS.filter(
    (fact) => decisionByFactId.get(fact.factId)?.usage === "TARGET_AND_DISTRACTOR",
  );

export const COM002_EDITORIAL_SUPPORT_FACTS: readonly KnowledgeFact[] =
  COM002_EDITORIALLY_APPROVED_FACTS.filter(
    (fact) => decisionByFactId.get(fact.factId)?.usage === "DISTRACTOR_SUPPORT",
  );

export const COM002_EDITORIAL_VALIDATOR_FACTS: readonly KnowledgeFact[] =
  COM002_EDITORIALLY_APPROVED_FACTS.filter(
    (fact) => decisionByFactId.get(fact.factId)?.usage === "VALIDATOR_ONLY",
  );

export function getCom002EditorialDecision(factId: string) {
  return decisionByFactId.get(factId) ?? null;
}

export function auditCom002EditorialReview() {
  const issues: string[] = [];
  const candidateIds = new Set(COM002_ALL_CANDIDATE_FACTS.map((fact) => fact.factId));
  const decisionIds = new Set<string>();

  for (const decision of COM002_EDITORIAL_FACT_DECISIONS) {
    if (decisionIds.has(decision.factId)) issues.push(`DUPLICATE_DECISION:${decision.factId}`);
    decisionIds.add(decision.factId);
    if (!candidateIds.has(decision.factId)) issues.push(`DECISION_FOR_UNKNOWN_FACT:${decision.factId}`);
    if (decision.disposition === "APPROVE" && decision.usage === "HELD") {
      issues.push(`APPROVED_FACT_MARKED_HELD:${decision.factId}`);
    }
  }
  for (const factId of candidateIds) {
    if (!decisionIds.has(factId)) issues.push(`MISSING_EDITORIAL_DECISION:${factId}`);
  }

  const targetIds = new Set(COM002_EDITORIAL_TARGET_FACTS.map((fact) => fact.factId));
  for (const factId of SUPPORT_ONLY_FACTS.keys()) {
    if (targetIds.has(factId)) issues.push(`SUPPORT_FACT_LEAKED_TO_TARGETS:${factId}`);
  }
  for (const factId of VALIDATOR_ONLY_FACTS.keys()) {
    if (targetIds.has(factId)) issues.push(`VALIDATOR_FACT_LEAKED_TO_TARGETS:${factId}`);
  }

  const jpegNotes = ["com002-extension-jpg", "com002-extension-jpeg"].map((factId) =>
    decisionByFactId.get(factId)?.generationNotes?.join(" ") ?? "",
  );
  if (jpegNotes.some((note) => !/competing answers/i.test(note))) {
    issues.push("JPEG_ALIAS_GUARD_MISSING");
  }

  return {
    valid: issues.length === 0,
    candidateCount: COM002_ALL_CANDIDATE_FACTS.length,
    approvedCount: COM002_EDITORIALLY_APPROVED_FACTS.length,
    targetFactCount: COM002_EDITORIAL_TARGET_FACTS.length,
    supportFactCount: COM002_EDITORIAL_SUPPORT_FACTS.length,
    validatorFactCount: COM002_EDITORIAL_VALIDATOR_FACTS.length,
    heldCount: COM002_EDITORIAL_FACT_DECISIONS.filter((decision) => decision.disposition === "HOLD").length,
    rejectedCount: COM002_EDITORIAL_FACT_DECISIONS.filter((decision) => decision.disposition === "REJECT").length,
    runtimeRegistered: false,
    productionReleased: false,
    issues,
  };
}
