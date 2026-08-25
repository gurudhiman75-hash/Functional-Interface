import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  NUM_CP011_ALLOCATION_STATUS,
  NUM_CP011_PERMANENT_ALLOCATION,
  NUM_CP011_PERMANENT_QL_IDS,
  type NumCp011PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp011Permanent } from "./permanent-runtime.ts";
import { generateNumCp011LocalizedFinal } from "./localization/runtime-final.ts";
import {
  NUM_CP011_QUESTION_STUDIO_QL_IDS,
  generateNumCp011QuestionStudioBatch,
} from "./question-studio-integration.ts";
import { listQuestionStudioPackages } from "../../../../../../../question-studio/shared-generation-engine.ts";

assert.equal(NUM_CP011_PERMANENT_ALLOCATION.length, 13);
assert.deepEqual(
  NUM_CP011_PERMANENT_QL_IDS,
  Array.from({ length: 13 }, (_, index) => `NUM-QL-${213 + index}`),
  "Permanent range drift",
);
assert.deepEqual(NUM_CP011_QUESTION_STUDIO_QL_IDS, NUM_CP011_PERMANENT_QL_IDS, "Question Studio QL range drift");
assert.equal(NUM_CP011_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-226");

let permanentChecks = 0;
let localizedChecks = 0;
let studioChecks = 0;
for (const qlId of NUM_CP011_PERMANENT_QL_IDS) {
  const ql = qlId as NumCp011PermanentQlId;
  const english = generateNumCp011Permanent(ql, 211);
  assert.equal(english.canonicalAnswer, english.verifierAnswer, `${qlId}: permanent verifier drift`);
  assert.equal(english.options[english.correctIndex]?.value, english.canonicalAnswer, `${qlId}: permanent answer binding drift`);
  assert.equal(english.lifecycle.reviewStatus, "ENGLISH_FROZEN");
  assert.equal(english.lifecycle.questionStudioDiscoverable, false);
  assert.equal(english.lifecycle.questionBankWritable, false);
  assert.equal(english.lifecycle.testEligible, false);
  assert.equal(english.lifecycle.publiclyPublishable, false);
  permanentChecks += 1;

  for (const language of ["hi", "pa"] as const) {
    const localized = generateNumCp011LocalizedFinal(ql, 211, language);
    assert.equal(localized.canonicalAnswer, localized.verifierAnswer, `${qlId}/${language}: localized verifier drift`);
    assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer, `${qlId}/${language}: localized binding drift`);
    assert.equal(localized.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN");
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    localizedChecks += 1;
  }

  for (const language of ["en", "hi", "pa"] as const) {
    const result = await generateNumCp011QuestionStudioBatch({
      canonicalProblemId: "NUM-CP-011",
      questionLanguageId: ql,
      language,
      seed: `cp011-cumulative:${qlId}:${language}`,
      count: 1,
    });
    const pkg = result.questionPackages[0]!;
    assert.equal(pkg.questionLanguageId, qlId, `${qlId}/${language}: Studio QL drift`);
    assert.equal(pkg.canonicalProblemId, "NUM-CP-011", `${qlId}/${language}: Studio CP drift`);
    assert.equal(pkg.answer, pkg.verifierAnswer, `${qlId}/${language}: Studio verifier drift`);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer, `${qlId}/${language}: Studio answer binding drift`);
    assert.equal(pkg.questionStudioDiscoverable, true, `${qlId}/${language}: Studio source gate closed`);
    assert.equal(pkg.questionBankWritable, false, `${qlId}/${language}: bank write opened`);
    assert.equal(pkg.testEligible, false, `${qlId}/${language}: test gate opened`);
    assert.equal(pkg.mockTestEligible, false, `${qlId}/${language}: mock gate opened`);
    assert.equal(pkg.publiclyPublishable, false, `${qlId}/${language}: public gate opened`);
    assert.equal(pkg.automaticStudentPublication, false, `${qlId}/${language}: automatic publication opened`);
    studioChecks += 1;
  }
}

assert.equal(permanentChecks, 13);
assert.equal(localizedChecks, 26);
assert.equal(studioChecks, 39);

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 shared capability missing");
assert.deepEqual(num002.cpIds.slice(-4), ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011"], "NUM-002 checkpoint aggregate drift");
assert.equal(num002.permanentQlCount, 60, "NUM-002 aggregate QL count drift");
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-225");
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.publiclyPublishable, false);

const routeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-average.ts"), "utf8");
const sharedSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine.ts"), "utf8");
const saturationRecord = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-011/NUM-CP-011-WAVE04-SATURATION-MERGE-SPLIT.md"), "utf8");

for (const marker of [
  'patternId.includes("num cp 011")',
  'checkpointId === "NUM-CP-011"',
  'if (number >= 213 && number <= 225) return "NUM-CP-011";',
  'requestedNumberSystemCp === "NUM-CP-011"',
  'requestedNumberSystemQlCp === "NUM-CP-011"',
  'targetCp !== "NUM-CP-011"',
]) {
  assert.ok(routeSource.includes(marker), `Cumulative route marker missing: ${marker}`);
}
for (const marker of [
  "listNumCp011QuestionStudioPackages",
  "generateNumCp011QuestionStudioBatch",
  "CP008-CP011-MULTILINGUAL-FROZEN-V1",
]) {
  assert.ok(sharedSource.includes(marker), `Cumulative shared-engine marker missing: ${marker}`);
}
for (const marker of [
  "13 retained solve authorities",
  "NUM-QL-213 .. NUM-QL-225",
  "Data sufficiency is a cross-topic reasoning/composition layer",
]) {
  assert.ok(saturationRecord.includes(marker), `Cumulative saturation marker missing: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_CUMULATIVE_LANDING",
  permanentAuthorities: 13,
  permanentRange: "NUM-QL-213..225",
  nextAvailableQl: "NUM-QL-226",
  permanentChecks,
  localizedChecks,
  studioChecks,
  num002PermanentQlCount: num002.permanentQlCount,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
