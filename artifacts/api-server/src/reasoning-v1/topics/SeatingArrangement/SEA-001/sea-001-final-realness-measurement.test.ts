import { strict as assert } from "node:assert";

import { summarizeSeaExamRealnessEvidence } from "./realness/exam-evidence.ts";
import { auditSea001DistributionRealness } from "./realness/distribution-audit.ts";
import { auditSea001DynamicMultilingualTemplates } from "./realness/multilingual-template-audit.ts";
import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";
import { auditSea001StructuralClones } from "./saturation/structural-clone-audit.ts";

const corpus = buildSea001SaturationCorpus(80);
const distribution = auditSea001DistributionRealness(corpus.caselets);
const structural = auditSea001StructuralClones(corpus.caselets);
const multilingual = auditSea001DynamicMultilingualTemplates(4);
const evidence = summarizeSeaExamRealnessEvidence();

assert.equal(corpus.caselets.length, 1600);
assert.equal(distribution.childQuestionCount, 6400);
assert.equal(structural.caseletCount, 1600);
assert.equal(structural.participantExtractionFailureCount, 0);
assert.equal(multilingual.Hindi.qlCoverage, 20);
assert.equal(multilingual.Punjabi.qlCoverage, 20);
assert.equal(multilingual.Hindi.latinResidueCount, 0);
assert.equal(multilingual.Punjabi.latinResidueCount, 0);

const report = {
  corpus: {
    caselets: corpus.caselets.length,
    childQuestions: distribution.childQuestionCount,
  },
  distribution: {
    queryContracts: distribution.queryContracts,
    answerPositions: distribution.answerPositions,
    answerPositionByChildIndex: distribution.answerPositionByChildIndex,
    seatCountCells: distribution.seatCountCells,
    checkpointDistribution: distribution.checkpointDistribution,
    answerPositionDistribution: distribution.answerPositionDistribution,
    childIndexAnswerPositionSpread: distribution.childIndexAnswerPositionSpread,
    seatCountDistribution: distribution.seatCountDistribution,
    queryContractsByCheckpoint: distribution.queryContractsByCheckpoint,
  },
  structural: {
    participantExtractionFailureCount: structural.participantExtractionFailureCount,
    authorityStructure: structural.authorityStructure,
    familyStructure: structural.familyStructure,
    nearStructure: structural.nearStructure,
    lexicalTemplate: structural.lexicalTemplate,
    structuralQueryCombination: structural.structuralQueryCombination,
    authorityStructureByBlueprint: structural.authorityStructureByBlueprint,
  },
  multilingual,
  evidence,
};

console.log("PASS_SEA_001_FINAL_REALNESS_MEASUREMENT");
console.log("SEA001_FINAL_REALNESS_REPORT", JSON.stringify(report));
