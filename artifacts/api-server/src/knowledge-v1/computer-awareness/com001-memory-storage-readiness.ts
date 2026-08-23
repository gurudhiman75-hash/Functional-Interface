import type { KnowledgeFact } from "../types";
import { COM001_MEMORY_STORAGE_CANDIDATE_FACTS } from "./com001-memory-storage-candidate-corpus";
import { COM001_ROM_ABBREVIATION_CANDIDATES } from "./com001-rom-abbreviation-candidates";
import { COM001_VOLATILITY_CANDIDATES } from "./com001-volatility-candidates";
import { COM001_LAYER_CANDIDATES } from "./com001-layer-candidates";
import { COM001_FUNCTION_CANDIDATES } from "./com001-function-candidates";
import { COM001_SUBTYPE_CANDIDATES } from "./com001-subtype-candidates";
import { COM001_HIERARCHY_CANDIDATES } from "./com001-hierarchy-candidates";
import { COM001_STORAGE_MEDIUM_EXPANSION } from "./com001-storage-medium-expansion";
import { COM001_CAPACITY_CANDIDATES } from "./com001-capacity-candidates";
import { auditCom001Corpus } from "./com001-memory-storage-corpus-requirements";

export const COM001_MEMORY_STORAGE_ALL_CANDIDATES: KnowledgeFact[] = [
  ...COM001_MEMORY_STORAGE_CANDIDATE_FACTS,
  ...COM001_ROM_ABBREVIATION_CANDIDATES,
  ...COM001_VOLATILITY_CANDIDATES,
  ...COM001_LAYER_CANDIDATES,
  ...COM001_FUNCTION_CANDIDATES,
  ...COM001_SUBTYPE_CANDIDATES,
  ...COM001_HIERARCHY_CANDIDATES,
  ...COM001_STORAGE_MEDIUM_EXPANSION,
  ...COM001_CAPACITY_CANDIDATES,
];

export function asHypotheticallyApproved(
  facts: readonly KnowledgeFact[],
  reviewedAt = "2026-08-23T14:30:00.000Z",
): KnowledgeFact[] {
  return facts.map((fact) => ({
    ...fact,
    review: {
      status: "APPROVED",
      confidence: 0.95,
      reviewedBy: "COM001_READINESS_AUDIT_ONLY",
      reviewedAt,
    },
  }));
}

export function auditCom001MemoryStorageReadiness(asOf = "2026-08-23") {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const fact of COM001_MEMORY_STORAGE_ALL_CANDIDATES) {
    if (ids.has(fact.factId)) issues.push(`DUPLICATE_FACT_ID:${fact.factId}`);
    ids.add(fact.factId);
    if (fact.review.status !== "REVIEW_REQUIRED") {
      issues.push(`LIVE_CANDIDATE_NOT_REVIEW_LOCKED:${fact.factId}`);
    }
  }

  const hypotheticalFacts = asHypotheticallyApproved(
    COM001_MEMORY_STORAGE_ALL_CANDIDATES,
  );
  const corpusAudit = auditCom001Corpus(hypotheticalFacts, asOf);
  const passingFamilies = corpusAudit.results
    .filter((result) => result.ready)
    .map((result) => result.relationFamily);
  const failingFamilies = corpusAudit.results
    .filter((result) => !result.ready)
    .map((result) => ({
      requirementId: result.requirementId,
      relationFamily: result.relationFamily,
      issues: result.issues,
      missingEntityHints: result.missingEntityHints,
    }));

  return {
    structurallyValid: issues.length === 0,
    candidateFactCount: COM001_MEMORY_STORAGE_ALL_CANDIDATES.length,
    productionEligibleFactCount: 0,
    hypotheticalCorpusReady: corpusAudit.ready,
    hypotheticalPassedRequirements: corpusAudit.passed,
    hypotheticalTotalRequirements: corpusAudit.total,
    passingFamilies,
    failingFamilies,
    issues,
  };
}
