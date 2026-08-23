import { strict as assert } from "node:assert";

import { COM001_MEMORY_STORAGE_DISCOVERY } from "./com001-memory-storage-discovery";
import {
  COM001_MERGE_SPLIT_DECISIONS,
  auditCom001MergeSplit,
} from "./com001-memory-storage-merge-split-audit";
import { auditCom001PyqEvidence } from "./com001-pyq-evidence";

const pyqAudit = auditCom001PyqEvidence();
assert.equal(pyqAudit.valid, true, pyqAudit.issues.join("\n"));
assert.equal(pyqAudit.evidenceCount >= 12, true);
assert.equal(pyqAudit.exams.some((exam) => /SSC CGL/.test(exam)), true);
assert.equal(pyqAudit.exams.some((exam) => /Punjab Patwari/.test(exam)), true);

const audit = auditCom001MergeSplit();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, COM001_MEMORY_STORAGE_DISCOVERY.length);
assert.equal(audit.decisionCount, 15);
assert.equal(audit.provisionalLearnerTaskCount, 9);
assert.equal(audit.holdCount, 4);
assert.equal(audit.realizerOnlyCount, 1);
assert.equal(audit.splitCount, 1);

const volatilityMerge = COM001_MERGE_SPLIT_DECISIONS.find(
  (entry) => entry.decisionId === "MS-001",
)!;
assert.equal(volatilityMerge.decision, "MERGE");
assert.deepEqual(volatilityMerge.candidates, ["MEM-DISC-001", "MEM-DISC-002"]);

const functionMerge = COM001_MERGE_SPLIT_DECISIONS.find(
  (entry) => entry.decisionId === "MS-003",
)!;
assert.equal(functionMerge.evidenceIds.length >= 2, true);

const statementRealizer = COM001_MERGE_SPLIT_DECISIONS.find(
  (entry) => entry.decisionId === "MS-011",
)!;
assert.equal(statementRealizer.decision, "REALIZER_ONLY");

const multiFact = COM001_MERGE_SPLIT_DECISIONS.find(
  (entry) => entry.decisionId === "MS-012",
)!;
assert.equal(multiFact.decision, "KEEP_PROVISIONAL");
assert.equal(multiFact.evidenceIds.length > 0, true);

const comparisonSplit = COM001_MERGE_SPLIT_DECISIONS.find(
  (entry) => entry.decisionId === "MS-007",
)!;
assert.equal(comparisonSplit.decision, "SPLIT");
assert.equal(comparisonSplit.splitProducts?.length, 2);
assert.equal(
  comparisonSplit.splitProducts?.some(
    (entry) => entry.disposition === "MERGE_WITH_OTHER" && entry.target === "MS-006",
  ),
  true,
);

// Permanent QLs must still not exist at this checkpoint.
for (const decision of COM001_MERGE_SPLIT_DECISIONS) {
  assert.equal(/QL-\d+/i.test(decision.decisionId), false);
  assert.equal(
    decision.provisionalLearnerTask ? /COM-QL/i.test(decision.provisionalLearnerTask) : false,
    false,
  );
}
