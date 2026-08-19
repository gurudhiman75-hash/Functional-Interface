import assert from "node:assert/strict";
import {
  DS_STANDARD_5_EN,
  DSF_NEXT_AVAILABLE_QL_ID,
  DSF_PERMANENT_QL_REGISTRY,
  SUFFICIENCY_CLASSES,
} from "../foundation/index.ts";
import { generateDsfCp001NumberSystemEnglish } from "./cp001-editorial-runtime.ts";
import { generateDsfCp001RatioEnglish } from "./cp001-ratio-editorial-runtime.ts";
import { generateDsfCp001PercentageEnglish } from "./cp001-percentage-editorial-runtime.ts";
import {
  DSF_CP001_PRE_FREEZE_DECISION,
  DSF_CP001_SOURCE_DEPENDENCIES,
} from "./cp001-source-dependencies.ts";

const seeds = Array.from({ length: 150 }, (_, seed) => seed);
const numberSystem = seeds.map(generateDsfCp001NumberSystemEnglish);
const ratio = seeds.map(generateDsfCp001RatioEnglish);
const percentage = seeds.map(generateDsfCp001PercentageEnglish);
const allQuestions = [...numberSystem, ...ratio, ...percentage];

function classSet(questions: readonly { readonly canonicalAnswer: string }[]): Set<string> {
  return new Set(questions.map((question) => question.canonicalAnswer));
}

function assertFullFiveClassCoverage(
  label: string,
  questions: readonly { readonly canonicalAnswer: string }[],
): void {
  assert.deepEqual(
    classSet(questions),
    new Set(SUFFICIENCY_CLASSES),
    `${label} does not cover all five canonical sufficiency classes`,
  );
}

assertFullFiveClassCoverage("Number System", numberSystem);
assertFullFiveClassCoverage("Ratio & Proportion", ratio);
assertFullFiveClassCoverage("Percentage", percentage);

assert.equal(DSF_PERMANENT_QL_REGISTRY.length, 1);
const ql001 = DSF_PERMANENT_QL_REGISTRY[0]!;
assert.equal(ql001.qlId, "DSF-QL-001");
assert.equal(ql001.taskContract, "TWO_STATEMENT_TARGET_DETERMINACY");
assert.equal(ql001.answerSemantic, "SUFFICIENCY_CLASS");
assert.equal(ql001.statementCount, 2);
assert.equal(DSF_NEXT_AVAILABLE_QL_ID, "DSF-QL-002");
assert.equal(
  ql001.lifecycle.englishContentStatus,
  "PARTIAL_PRODUCTION_GENERATION_REVIEW_CANDIDATE",
);
assert.deepEqual(ql001.lifecycle.productionBackedSourceChapters, ["NUM-001", "RAP-001", "PCT-001"]);
assert.equal(ql001.lifecycle.questionStudioDiscoverable, false);
assert.equal(ql001.lifecycle.questionBankWritable, false);
assert.equal(ql001.lifecycle.testEligible, false);
assert.equal(ql001.lifecycle.publiclyPublishable, false);

const expectedOptionContract = DS_STANDARD_5_EN.options.map((option) => ({
  key: option.key,
  semanticClass: option.semanticClass,
  value: option.text,
}));

for (const question of allQuestions) {
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.checkpointId, "DSF-CP-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.deepEqual(
    question.options.map((option) => ({
      key: option.key,
      semanticClass: option.semanticClass,
      value: option.value,
    })),
    expectedOptionContract,
  );
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

assert.deepEqual(
  new Set(allQuestions.map((question) => question.sourceChapterId)),
  new Set(["NUM-001", "RAP-001", "PCT-001"]),
);

const solveModes = new Set(allQuestions.map((question) => question.solveModeId));
assert.deepEqual(solveModes, new Set([
  "DSF-SM-NUM-MISSING-DIGIT",
  "DSF-SM-NUM-DIGIT-PARITY",
  "DSF-SM-RAP-RATIO-AB",
  "DSF-SM-RAP-GREATER-QUANTITY",
  "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE",
  "DSF-SM-PCT-FINAL-DIRECTION",
]));

const generationIdentities = new Set(allQuestions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, allQuestions.length);

assert.equal(DSF_CP001_SOURCE_DEPENDENCIES.length, 4);
const mergedSources = DSF_CP001_SOURCE_DEPENDENCIES.filter(
  (entry) => entry.status === "PRODUCTION_BACKED_ON_NEW_MAIN",
);
const algebra = DSF_CP001_SOURCE_DEPENDENCIES.find(
  (entry) => entry.sourceChapterId === "ALG-001/ALG-002",
)!;
assert.deepEqual(mergedSources.map((entry) => entry.sourceChapterId), ["NUM-001", "RAP-001", "PCT-001"]);
assert.equal(algebra.status, "SOURCE_RUNTIME_READY_OFF_BASE_BLOCKS_CP001_FREEZE");
assert.equal(algebra.sourceRef?.prNumber, 867);
assert.equal(algebra.sourceRef?.branch, "feature/alg-001-phase0-foundation");
assert.equal(algebra.sourceRef?.draft, true);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.status, "NOT_FREEZABLE_SOURCE_DEPENDENCY_PENDING");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.blockingDomain, "Algebra");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.permanentQlId, "DSF-QL-001");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.newQlAllocationRequired, false);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.questionStudioPublicationAllowed, false);

const classCountsByWave = Object.fromEntries([
  ["Number System", Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
    semanticClass,
    numberSystem.filter((question) => question.canonicalAnswer === semanticClass).length,
  ]))],
  ["Ratio & Proportion", Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
    semanticClass,
    ratio.filter((question) => question.canonicalAnswer === semanticClass).length,
  ]))],
  ["Percentage", Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
    semanticClass,
    percentage.filter((question) => question.canonicalAnswer === semanticClass).length,
  ]))],
]);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_CROSS_WAVE_PRE_FREEZE_AUDIT",
  permanentQlIds: DSF_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  nextAvailableQlId: DSF_NEXT_AVAILABLE_QL_ID,
  auditedQuestions: allQuestions.length,
  productionBackedSources: mergedSources.map((entry) => entry.sourceChapterId),
  solveModes: [...solveModes].sort(),
  classCountsByWave,
  distinctGenerationIdentities: generationIdentities.size,
  lifecycle: ql001.lifecycle.englishContentStatus,
  freezeDecision: DSF_CP001_PRE_FREEZE_DECISION.status,
  blocker: {
    domain: DSF_CP001_PRE_FREEZE_DECISION.blockingDomain,
    sourcePr: algebra.sourceRef?.prNumber,
    sourceBranch: algebra.sourceRef?.branch,
    sourceHeadAtAudit: algebra.sourceRef?.headShaAtAudit,
  },
}, null, 2));
