import { verifyKnowledgeComposition } from "../composition-verifier";
import { auditCom001MergeSplit, COM001_MERGE_SPLIT_DECISIONS } from "./com001-memory-storage-merge-split-audit";
import { auditCom001MemoryStorageReadiness, COM001_MEMORY_STORAGE_ALL_CANDIDATES } from "./com001-memory-storage-readiness";
import { auditCom001StorageProfiles } from "./com001-storage-device-profiles";
import { auditCom001AdditionalSources } from "./com001-source-authority-extension";

const REQUIRED_SIMPLE_FAMILIES = [
  "volatility",
  "memory-layer-classification",
  "function-purpose",
  "subtype-membership",
  "storage-medium",
  "memory-hierarchy-order",
  "capacity-unit-relationship",
] as const;

const EXPECTED_PROVISIONAL_DECISIONS = [
  "MS-001",
  "MS-002",
  "MS-003",
  "MS-004",
  "MS-005",
  "MS-006",
  "MS-009",
  "MS-012",
  "MS-015",
] as const;

function fact(factId: string) {
  const match = COM001_MEMORY_STORAGE_ALL_CANDIDATES.find(
    (entry) => entry.factId === factId,
  );
  if (!match) throw new Error(`COM-001 allocation proof fact ${factId} is missing.`);
  return match;
}

function auditCompositionProof() {
  const ram = fact("com001-ram-volatility");
  const rom = fact("com001-rom-volatility");
  const byte = fact("com001-byte-bits");

  const result = verifyKnowledgeComposition(
    [ram, rom, byte],
    [
      {
        statementId: "I",
        factId: ram.factId,
        claimedValue: ram.value,
      },
      {
        statementId: "II",
        factId: rom.factId,
        claimedValue: { kind: "text", text: { en: "volatile" } },
      },
      {
        statementId: "III",
        factId: byte.factId,
        claimedValue: byte.value,
      },
    ],
    [
      { optionId: "A", trueStatementIds: ["I"] },
      { optionId: "B", trueStatementIds: ["I", "III"] },
      { optionId: "C", trueStatementIds: ["II", "III"] },
      { optionId: "D", trueStatementIds: ["I", "II", "III"] },
    ],
  );

  return {
    valid:
      result.correctOptionId === "B" &&
      result.trueStatementIds.join(",") === "I,III",
    correctOptionId: result.correctOptionId,
    trueStatementIds: result.trueStatementIds,
  };
}

export function auditCom001QlAllocationReadiness() {
  const issues: string[] = [];
  const mergeSplit = auditCom001MergeSplit();
  const corpus = auditCom001MemoryStorageReadiness("2026-08-23");
  const profiles = auditCom001StorageProfiles();
  const sources = auditCom001AdditionalSources();
  const composition = auditCompositionProof();

  if (!mergeSplit.valid) issues.push(...mergeSplit.issues.map((issue) => `MERGE_SPLIT:${issue}`));
  if (!sources.valid) issues.push(...sources.issues.map((issue) => `SOURCE:${issue}`));
  if (!profiles.valid) issues.push(...profiles.issues.map((issue) => `PROFILE:${issue}`));
  if (!composition.valid) issues.push("COMPOSITION_PROOF_FAILED");

  const provisionalDecisionIds = COM001_MERGE_SPLIT_DECISIONS
    .filter((entry) => entry.decision === "MERGE" || entry.decision === "KEEP_PROVISIONAL")
    .map((entry) => entry.decisionId)
    .sort();
  const expectedIds = [...EXPECTED_PROVISIONAL_DECISIONS].sort();
  if (provisionalDecisionIds.join("|") !== expectedIds.join("|")) {
    issues.push(
      `PROVISIONAL_TASK_SET_MISMATCH:${provisionalDecisionIds.join(",")}`,
    );
  }

  for (const decisionId of EXPECTED_PROVISIONAL_DECISIONS) {
    const decision = COM001_MERGE_SPLIT_DECISIONS.find(
      (entry) => entry.decisionId === decisionId,
    );
    if (!decision?.provisionalLearnerTask?.trim()) {
      issues.push(`MISSING_PROVISIONAL_TASK:${decisionId}`);
    }
    if (!decision?.evidenceIds.length) {
      issues.push(`MISSING_PYQ_EVIDENCE:${decisionId}`);
    }
  }

  for (const family of REQUIRED_SIMPLE_FAMILIES) {
    if (!corpus.passingFamilies.includes(family)) {
      issues.push(`CORPUS_FAMILY_NOT_READY:${family}`);
    }
  }

  // These remain outside permanent allocation until independent evidence is
  // strong enough. Their corpus gaps therefore do not block the nine QLs.
  const allowedHeldGaps = new Set(["access-method", "virtual-memory-concept"]);
  for (const failure of corpus.failingFamilies) {
    if (
      failure.relationFamily !== "backup-storage-role" &&
      !allowedHeldGaps.has(failure.relationFamily)
    ) {
      issues.push(`UNEXPECTED_CORPUS_GAP:${failure.relationFamily}`);
    }
  }

  const backupTask = COM001_MERGE_SPLIT_DECISIONS.find(
    (entry) => entry.decisionId === "MS-009",
  );
  if (!backupTask || backupTask.decision !== "KEEP_PROVISIONAL") {
    issues.push("BACKUP_TASK_NOT_PROVISIONAL");
  }
  if (!profiles.valid || profiles.canonicalTapeSolveCount !== 1) {
    issues.push("BACKUP_COMPOSITE_SOLVER_NOT_READY");
  }

  const multiStatementTask = COM001_MERGE_SPLIT_DECISIONS.find(
    (entry) => entry.decisionId === "MS-012",
  );
  if (!multiStatementTask || multiStatementTask.decision !== "KEEP_PROVISIONAL") {
    issues.push("MULTI_STATEMENT_TASK_NOT_PROVISIONAL");
  }

  return {
    ready: issues.length === 0,
    permanentQlCountCandidate: EXPECTED_PROVISIONAL_DECISIONS.length,
    requiredSimpleFamilies: [...REQUIRED_SIMPLE_FAMILIES],
    provisionalDecisionIds,
    heldOutDecisionIds: COM001_MERGE_SPLIT_DECISIONS
      .filter(
        (entry) =>
          entry.decision === "HOLD_FOR_EVIDENCE" ||
          entry.decision === "REALIZER_ONLY" ||
          entry.decision === "SPLIT",
      )
      .map((entry) => entry.decisionId),
    corpusPassingFamilies: corpus.passingFamilies,
    profileCount: profiles.profileCount,
    compositionProof: composition,
    issues,
  };
}
