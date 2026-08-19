import { strict as assert } from "node:assert";

import { auditSea001DistributionRealness } from "./realness/distribution-audit.ts";
import { assessSea001MachineRealness } from "./realness/machine-realness-thresholds.ts";
import { auditSea001DynamicMultilingualTemplates } from "./realness/multilingual-template-audit.ts";
import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";
import { auditSea001StructuralClones } from "./saturation/structural-clone-audit.ts";

const corpus = buildSea001SaturationCorpus(80);
const distribution = auditSea001DistributionRealness(corpus.caselets);
const structural = auditSea001StructuralClones(corpus.caselets);
const multilingual = auditSea001DynamicMultilingualTemplates(4);
const assessment = assessSea001MachineRealness({ distribution, structural, multilingual });

const focus = Object.fromEntries(
  ["SEA-PBA-001", "SEA-PBA-011", "SEA-PBA-014"].map((blueprintId) => [
    blueprintId,
    {
      structural: structural.authorityStructureByBlueprint[blueprintId],
      uniqueShare: assessment.structural.blueprintUniqueShares[blueprintId],
    },
  ]),
);

console.log("SEA001_HARDENING_FOCUS", JSON.stringify(focus));
console.log("SEA001_HARDENING_ANSWER_POSITIONS", JSON.stringify(distribution.answerPositions));
console.log("SEA001_HARDENING_CHILD_INDEX_CONCENTRATION", JSON.stringify(distribution.answerPositionByChildIndex));
console.log("SEA001_HARDENING_CHILD_INDEX_MATRIX", JSON.stringify(distribution.answerPositionByChildIndexMatrix));
console.log("SEA001_HARDENING_HINDI_QUESTION_TEMPLATES", JSON.stringify(multilingual.Hindi.questionTemplates));
console.log("SEA001_HARDENING_PUNJABI_QUESTION_TEMPLATES", JSON.stringify(multilingual.Punjabi.questionTemplates));
console.log("SEA001_HARDENING_MACHINE_STATUS", assessment.status);
console.log("SEA001_HARDENING_BLOCKERS", JSON.stringify(assessment.blockers));

assert.equal(corpus.caselets.length, 1600);
assert.equal(distribution.childQuestionCount, 6400);
assert.equal(structural.participantExtractionFailureCount, 0);
assert.equal(assessment.status, "GREEN", `Hardening candidate remains blocked: ${assessment.blockers.join(", ")}`);
assert.deepEqual(assessment.blockers, []);

console.log("PASS_SEA_001_STRUCTURAL_REALNESS_HARDENING");
