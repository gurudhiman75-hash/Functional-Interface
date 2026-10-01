import assert from "node:assert/strict";
import {
  VEN_001_QUESTION_STUDIO_PACKAGE,
  generateVen001QuestionStudioBatch,
} from "./question-studio-integration.ts";
import { VEN_001_PERMANENT_QLS, VEN_001_PERMANENT_QL_AUTHORITY } from "./ql-registry.ts";
import { VEN_001_SCENARIO_AUTHORITIES } from "./ven-001-scenario-authorities.ts";
import { generateVen001NextCheckpointBatch } from "./ven-001-next-checkpoints.ts";
import { generateVen001NumericalBatch, NUMERICAL_CONTEXTS, NUMERICAL_CP_IDS } from "./ven-001-numerical.ts";
import { generateVen001ShapeRegionBatch, LAYOUTS, VEN_001_SHAPE_REGION_CP_ID } from "./ven-001-shape-regions.ts";

const expectedCps = [
  "VEN-CP001","VEN-CP002","VEN-CP003","VEN-CP004","VEN-CP005","VEN-CP006",
  "VEN-CP007","VEN-CP008","VEN-CP009","VEN-CP010","VEN-CP011",
] as const;

assert.equal(VEN_001_PERMANENT_QLS.length, 10);
assert.equal(VEN_001_PERMANENT_QL_AUTHORITY.nextPermanentQlId, "VEN-QL-011");
assert.deepEqual(
  [...new Set(VEN_001_PERMANENT_QLS.flatMap((entry) => entry.checkpoints))].sort(),
  [...expectedCps].sort(),
);
assert.deepEqual(VEN_001_QUESTION_STUDIO_PACKAGE.supportedLanguages, ["en","hi","pa"]);
assert.deepEqual(VEN_001_QUESTION_STUDIO_PACKAGE.supportedDifficulties, ["Easy","Medium","Hard"]);
assert.equal(VEN_001_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(VEN_001_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(VEN_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(VEN_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal((VEN_001_QUESTION_STUDIO_PACKAGE.metadata as any).permanentQlCount, 10);
assert.equal((VEN_001_QUESTION_STUDIO_PACKAGE.metadata as any).permanentQlAuthorityId, "VEN_001_PERMANENT_QL_REGISTRY_V1");

assert.equal(VEN_001_SCENARIO_AUTHORITIES.length, 34);
assert.equal(NUMERICAL_CONTEXTS.length, 20);
assert.equal(LAYOUTS.length, 9);

let generated = 0;
const observedCps = new Set<string>();
const observedQls = new Set<string>();

function verifyQuestion(question: any, language: "en"|"hi"|"pa") {
  assert.equal(question.language, language);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.ok(/^VEN-QL-\d{3}$/.test(String(question.qlId)), `missing permanent qlId: ${question.qlId}`);
  assert.equal(question.permanentQlId, question.qlId);
  assert.equal(Array.isArray(question.options), true);
  assert.equal(question.options.length, 4);
  assert.ok(String(question.stem).trim().length > 20);
  assert.ok(String(question.explanation).trim().length > 20);
  observedCps.add(String(question.cpId ?? question.checkpointId));
  observedQls.add(String(question.qlId));
  generated += 1;
}

for (const language of ["en","hi","pa"] as const) {
  for (const [cp, count] of [["VEN-CP001",12],["VEN-CP002",20],["VEN-CP004",21]] as const) {
    const result = generateVen001NextCheckpointBatch({
      packageId:"VEN-001", patternId:cp, language, count,
      seed:`ven-final-closure:${language}:${cp}`,
    });
    assert.equal(result.questions.length, count);
    result.questions.forEach((question) => verifyQuestion(question, language));
  }

  const cp003 = generateVen001QuestionStudioBatch({
    packageId:"VEN-001", patternId:"VEN-CP003-DIRECT", language, count:34,
    seed:`ven-final-closure:${language}:VEN-CP003`,
  });
  assert.equal(cp003.questions.length, 34);
  cp003.questions.forEach((question) => verifyQuestion(question, language));

  const cp003Reverse = generateVen001QuestionStudioBatch({
    packageId:"VEN-001", patternId:"VEN-CP003-REVERSE", language, count:4,
    seed:`ven-final-closure:${language}:VEN-CP003-REVERSE`,
  });
  cp003Reverse.questions.forEach((question) => verifyQuestion(question, language));

  for (const cp of NUMERICAL_CP_IDS) {
    const result = generateVen001NumericalBatch({
      packageId:"VEN-001", patternId:cp, language, count:4,
      seed:`ven-final-closure:${language}:${cp}`,
    });
    result.questions.forEach((question) => verifyQuestion(question, language));
  }

  const cp011 = generateVen001ShapeRegionBatch({
    packageId:"VEN-001", patternId:VEN_001_SHAPE_REGION_CP_ID, language, count:8,
    seed:`ven-final-closure:${language}:VEN-CP011`,
  });
  cp011.questions.forEach((question) => verifyQuestion(question, language));
}

const hard = generateVen001NumericalBatch({
  packageId:"VEN-001",
  patternId:"VEN-CP010",
  language:"en",
  difficulty:"Hard",
  count:3,
  seed:"ven-final-closure-hard-proof",
});
assert.equal(hard.questions.length, 3);
assert.ok(hard.questions.every((question:any) => question.difficulty === "Hard"));

assert.deepEqual([...observedCps].sort(), [...expectedCps].sort());
assert.deepEqual([...observedQls].sort(), VEN_001_PERMANENT_QLS.map((entry) => entry.qlId).sort());

console.log(JSON.stringify({
  status:"PASS_VEN_001_FINAL_CONTENT_DEEP_AUDIT_CLOSURE_V1",
  permanentQlCount:VEN_001_PERMANENT_QLS.length,
  checkpointCount:expectedCps.length,
  scenarioAuthorities:VEN_001_SCENARIO_AUTHORITIES.length,
  numericalContexts:NUMERICAL_CONTEXTS.length,
  geometricLayouts:LAYOUTS.length,
  generatedClosureSample:generated,
  languages:["en","hi","pa"],
  difficultyBands:["Easy","Medium","Hard"],
  sourceSaturationClaimed:false,
  reviewOnly:true,
  publicReleaseLocked:true,
},null,2));
