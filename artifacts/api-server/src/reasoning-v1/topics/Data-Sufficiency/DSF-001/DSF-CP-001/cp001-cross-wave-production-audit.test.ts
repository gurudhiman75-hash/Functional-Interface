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
import { generateDsfCp001AlgebraEnglish } from "./cp001-algebra-runtime.ts";
import {
  DSF_CP001_PRE_FREEZE_DECISION,
  DSF_CP001_SOURCE_DEPENDENCIES,
} from "./cp001-source-dependencies.ts";

const seeds = Array.from({ length: 150 }, (_, seed) => seed);
const numberSystem = seeds.map(generateDsfCp001NumberSystemEnglish);
const ratio = seeds.map(generateDsfCp001RatioEnglish);
const percentage = seeds.map(generateDsfCp001PercentageEnglish);
const algebra = seeds.map(generateDsfCp001AlgebraEnglish);
const allQuestions = [...numberSystem, ...ratio, ...percentage, ...algebra];

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
assertFullFiveClassCoverage("Algebra", algebra);

assert.equal(DSF_PERMANENT_QL_REGISTRY.length, 1);
const ql001 = DSF_PERMANENT_QL_REGISTRY[0]!;
assert.equal(ql001.qlId, "DSF-QL-001");
assert.equal(ql001.taskContract, "TWO_STATEMENT_TARGET_DETERMINACY");
assert.equal(ql001.answerSemantic, "SUFFICIENCY_CLASS");
assert.equal(ql001.statementCount, 2);
assert.equal(DSF_NEXT_AVAILABLE_QL_ID, "DSF-QL-002");
assert.equal(ql001.lifecycle.englishContentStatus, "CP001_PRODUCTION_GENERATION_FROZEN");
assert.deepEqual(ql001.lifecycle.productionBackedSourceChapters, ["NUM-001", "RAP-001", "PCT-001", "ALG-002"]);
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
  new Set(["NUM-001", "RAP-001", "PCT-001", "ALG-002"]),
);

const solveModes = new Set(allQuestions.map((question) => question.solveModeId));
assert.deepEqual(solveModes, new Set([
  "DSF-SM-NUM-MISSING-DIGIT",
  "DSF-SM-NUM-DIGIT-PARITY",
  "DSF-SM-RAP-RATIO-AB",
  "DSF-SM-RAP-GREATER-QUANTITY",
  "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE",
  "DSF-SM-PCT-FINAL-DIRECTION",
  "DSF-SM-ALG-SINGLE-VARIABLE-X",
  "DSF-SM-ALG-LINEAR-SYSTEM-X",
]));

const generationIdentities = new Set(allQuestions.map((question) => `${question.sourceChapterId}:${question.generationIdentity}`));
assert.equal(generationIdentities.size, allQuestions.length);

assert.equal(DSF_CP001_SOURCE_DEPENDENCIES.length, 4);
assert(DSF_CP001_SOURCE_DEPENDENCIES.every((entry) => entry.status === "PRODUCTION_BACKED_ON_NEW_MAIN"));
assert.deepEqual(
  DSF_CP001_SOURCE_DEPENDENCIES.map((entry) => entry.sourceChapterId),
  ["NUM-001", "RAP-001", "PCT-001", "ALG-002"],
);
const algebraDependency = DSF_CP001_SOURCE_DEPENDENCIES.find((entry) => entry.sourceChapterId === "ALG-002")!;
assert.equal(algebraDependency.sourceRef?.prNumber, 867);
assert.equal(algebraDependency.sourceRef?.mergedHeadSha, "9bb081add70142a9bfb39e89ffd44904e6e67f89");
assert.equal(algebraDependency.sourceRef?.mergeCommitSha, "849017e332c75108aef37b8bd51d4886fc54c7f3");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.status, "READY_FOR_FINAL_CP001_FREEZE");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.blockingDomain, null);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.sourceDependenciesSatisfied, true);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.permanentQlId, "DSF-QL-001");
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.newQlAllocationRequired, false);
assert.equal(DSF_CP001_PRE_FREEZE_DECISION.questionStudioPublicationAllowed, false);

const waves = [
  ["Number System", numberSystem],
  ["Ratio & Proportion", ratio],
  ["Percentage", percentage],
  ["Algebra", algebra],
] as const;
const classCountsByWave = Object.fromEntries(waves.map(([label, questions]) => [
  label,
  Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
    semanticClass,
    questions.filter((question) => question.canonicalAnswer === semanticClass).length,
  ])),
]));

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_CROSS_WAVE_FROZEN_AUDIT",
  permanentQlIds: DSF_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  nextAvailableQlId: DSF_NEXT_AVAILABLE_QL_ID,
  auditedQuestions: allQuestions.length,
  productionBackedSources: DSF_CP001_SOURCE_DEPENDENCIES.map((entry) => entry.sourceChapterId),
  solveModes: [...solveModes].sort(),
  classCountsByWave,
  distinctGenerationIdentities: generationIdentities.size,
  lifecycle: ql001.lifecycle.englishContentStatus,
  sourceDependenciesSatisfied: DSF_CP001_PRE_FREEZE_DECISION.sourceDependenciesSatisfied,
}, null, 2));
