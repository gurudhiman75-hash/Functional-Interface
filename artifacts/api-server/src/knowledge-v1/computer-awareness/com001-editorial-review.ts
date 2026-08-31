import type { KnowledgeFact } from "../types";
import { COM001_MEMORY_STORAGE_ALL_CANDIDATES } from "./com001-memory-storage-readiness";

export type Com001EditorialDisposition = "APPROVE" | "HOLD" | "REJECT";

export type Com001EditorialFactDecision = {
  factId: string;
  disposition: Com001EditorialDisposition;
  reason: string;
};

export const COM001_EDITORIALLY_BLOCKED_SOURCE_IDS = [
  "IBM-PRIMARY-STORAGE-2024",
] as const;

const BLOCKED_SOURCE_IDS = new Set<string>(COM001_EDITORIALLY_BLOCKED_SOURCE_IDS);
const REVIEWED_AT = "2026-08-24T08:30:00.000Z";
const REVIEWED_BY = "COM001_EDITORIAL_REVIEW_V1";

function decideFact(fact: KnowledgeFact): Com001EditorialFactDecision {
  if (fact.factId === "com001-sram-layer") {
    return {
      factId: fact.factId,
      disposition: "REJECT",
      reason:
        "Do not force SRAM into a single memory-hierarchy layer. SRAM is a RAM technology commonly used to implement processor cache, so a primary-memory-vs-cache classification question is ambiguous.",
    };
  }

  if (fact.contextGroupId === "virtual-memory-awareness") {
    return {
      factId: fact.factId,
      disposition: "HOLD",
      reason:
        "Virtual-memory awareness remains outside the allocated COM-001 learner-task set until stronger target-exam evidence closes the discovery hold.",
    };
  }

  if (BLOCKED_SOURCE_IDS.has(fact.source.sourceId)) {
    return {
      factId: fact.factId,
      disposition: "HOLD",
      reason:
        "The supporting source contains a reviewed factual inconsistency elsewhere on the page. Replace the source before approving this fact.",
    };
  }

  return {
    factId: fact.factId,
    disposition: "APPROVE",
    reason:
      "Source-backed durable fact, in allocated COM-001 scope, with no unresolved ambiguity identified in editorial review V1.",
  };
}

export const COM001_EDITORIAL_FACT_DECISIONS: Com001EditorialFactDecision[] =
  COM001_MEMORY_STORAGE_ALL_CANDIDATES.map(decideFact);

const DECISION_BY_FACT_ID = new Map(
  COM001_EDITORIAL_FACT_DECISIONS.map((entry) => [entry.factId, entry]),
);

/**
 * Review-generation authority after editorial review V1.
 *
 * Facts remain REVIEW_REQUIRED here so this pool cannot accidentally become a
 * production corpus simply by being imported into the review generator.
 */
export const COM001_EDITORIAL_REVIEWABLE_FACTS: KnowledgeFact[] =
  COM001_MEMORY_STORAGE_ALL_CANDIDATES.filter(
    (fact) => DECISION_BY_FACT_ID.get(fact.factId)?.disposition === "APPROVE",
  );

/**
 * Explicit promotion artifact for the facts that cleared editorial review.
 *
 * This export is not registered in Question Studio yet. It records permanent
 * CP ownership and review approval while downstream runtime/publication locks
 * remain closed.
 */
export const COM001_EDITORIALLY_APPROVED_FACTS: KnowledgeFact[] =
  COM001_EDITORIAL_REVIEWABLE_FACTS.map((fact) => ({
    ...fact,
    cpId: "COM-001-CP-001",
    review: {
      status: "APPROVED",
      confidence: 0.95,
      reviewedBy: REVIEWED_BY,
      reviewedAt: REVIEWED_AT,
    },
    freshness: {
      ...fact.freshness,
      lastVerifiedAt: REVIEWED_AT,
    },
  }));

export function auditCom001EditorialReview() {
  const issues: string[] = [];
  const factIds = new Set(COM001_MEMORY_STORAGE_ALL_CANDIDATES.map((fact) => fact.factId));
  const decisionIds = new Set<string>();

  for (const decision of COM001_EDITORIAL_FACT_DECISIONS) {
    if (decisionIds.has(decision.factId)) {
      issues.push(`DUPLICATE_EDITORIAL_DECISION:${decision.factId}`);
    }
    decisionIds.add(decision.factId);
    if (!factIds.has(decision.factId)) {
      issues.push(`UNKNOWN_EDITORIAL_FACT:${decision.factId}`);
    }
    if (!decision.reason.trim()) {
      issues.push(`EMPTY_EDITORIAL_REASON:${decision.factId}`);
    }
  }

  for (const factId of factIds) {
    if (!decisionIds.has(factId)) issues.push(`MISSING_EDITORIAL_DECISION:${factId}`);
  }

  for (const fact of COM001_EDITORIALLY_APPROVED_FACTS) {
    if (BLOCKED_SOURCE_IDS.has(fact.source.sourceId)) {
      issues.push(`APPROVED_BLOCKED_SOURCE:${fact.factId}:${fact.source.sourceId}`);
    }
    if (fact.contextGroupId === "virtual-memory-awareness") {
      issues.push(`APPROVED_HELD_VIRTUAL_MEMORY:${fact.factId}`);
    }
    if (fact.factId === "com001-sram-layer") {
      issues.push("APPROVED_AMBIGUOUS_SRAM_LAYER");
    }
    if (fact.cpId !== "COM-001-CP-001") {
      issues.push(`APPROVED_CP_MISMATCH:${fact.factId}`);
    }
    if (fact.review.status !== "APPROVED") {
      issues.push(`APPROVED_FACT_NOT_APPROVED:${fact.factId}`);
    }
    if (fact.review.reviewedBy !== REVIEWED_BY || fact.review.reviewedAt !== REVIEWED_AT) {
      issues.push(`APPROVED_REVIEW_PROVENANCE_MISMATCH:${fact.factId}`);
    }
  }

  const count = (disposition: Com001EditorialDisposition) =>
    COM001_EDITORIAL_FACT_DECISIONS.filter(
      (entry) => entry.disposition === disposition,
    ).length;

  return {
    valid: issues.length === 0,
    totalFactCount: COM001_MEMORY_STORAGE_ALL_CANDIDATES.length,
    approvedFactCount: count("APPROVE"),
    heldFactCount: count("HOLD"),
    rejectedFactCount: count("REJECT"),
    promotedFactCount: COM001_EDITORIALLY_APPROVED_FACTS.length,
    blockedSourceIds: [...COM001_EDITORIALLY_BLOCKED_SOURCE_IDS],
    decisions: COM001_EDITORIAL_FACT_DECISIONS,
    issues,
  };
}
