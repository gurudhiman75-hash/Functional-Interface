import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  NUM_CP012_ALLOCATION_STATUS,
  NUM_CP012_PERMANENT_ALLOCATION,
  NUM_CP012_PERMANENT_QL_IDS,
  type NumCp012PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp012Permanent } from "./permanent-runtime.ts";
import { generateNumCp012Localized } from "./localization/runtime.ts";
import {
  NUM_CP012_QUESTION_STUDIO_QL_IDS,
  generateNumCp012QuestionStudioBatch,
} from "./question-studio-integration.ts";
import { listQuestionStudioPackages } from "../../../../../../../question-studio/shared-generation-engine.ts";

assert.equal(NUM_CP012_PERMANENT_ALLOCATION.length, 11, "CP012 authority count drift");
assert.deepEqual(
  NUM_CP012_PERMANENT_QL_IDS,
  Array.from({ length: 11 }, (_, index) => `NUM-QL-${226 + index}`),
  "CP012 permanent range drift",
);
assert.deepEqual(NUM_CP012_QUESTION_STUDIO_QL_IDS, NUM_CP012_PERMANENT_QL_IDS, "CP012 Studio QL range drift");
assert.equal(NUM_CP012_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-237", "CP012 next-free QL drift");

let englishChecks = 0;
let localizedChecks = 0;
let studioChecks = 0;
const sourcePrototypeCoverage = new Set<string>();

for (const qlId of NUM_CP012_PERMANENT_QL_IDS) {
  const ql = qlId as NumCp012PermanentQlId;
  const allocation = NUM_CP012_PERMANENT_ALLOCATION.find((item) => item.qlId === ql)!;

  for (let seed = 1; seed <= Math.max(2, allocation.sourcePrototypes.length); seed += 1) {
    const english = generateNumCp012Permanent(ql, seed);
    assert.equal(english.canonicalAnswer, english.verifierAnswer, `${qlId}/${seed}: English verifier drift`);
    assert.equal(english.options[english.correctIndex]?.value, english.canonicalAnswer, `${qlId}/${seed}: English binding drift`);
    assert.equal(english.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    assert.equal(english.lifecycle.questionStudioDiscoverable, false);
    assert.equal(english.lifecycle.questionBankWritable, false);
    assert.equal(english.lifecycle.testEligible, false);
    assert.equal(english.lifecycle.publiclyPublishable, false);
    sourcePrototypeCoverage.add(english.temporaryPrototypeId);
    englishChecks += 1;
  }

  for (const language of ["hi", "pa"] as const) {
    const localized = generateNumCp012Localized(ql, 211, language);
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
    const result = await generateNumCp012QuestionStudioBatch({
      canonicalProblemId: "NUM-CP-012",
      questionLanguageId: ql,
      language,
      seed: `cp012-cumulative:${qlId}:${language}`,
      count: 1,
    });
    const pkg = result.questionPackages[0]!;
    assert.equal(pkg.questionLanguageId, qlId, `${qlId}/${language}: Studio QL drift`);
    assert.equal(pkg.canonicalProblemId, "NUM-CP-012", `${qlId}/${language}: Studio CP drift`);
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

assert.equal(sourcePrototypeCoverage.size, 14, "Cumulative permanent mapping did not reach all 14 discovery prototypes");
assert.equal(localizedChecks, 22);
assert.equal(studioChecks, 33);

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 shared capability missing");
assert.deepEqual(
  num002.cpIds.slice(-5),
  ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011", "NUM-CP-012"],
  "NUM-002 checkpoint aggregate drift",
);
assert.equal(num002.permanentQlCount, 71, "NUM-002 aggregate permanent QL count drift");
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-236");
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

const cumulativeRecord = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/NUM-CP-012-CUMULATIVE-LANDING.md"), "utf8");
const saturationRecord = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/NUM-CP-012-WAVE04-SATURATION-MERGE-SPLIT.md"), "utf8");
const routeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-average.ts"), "utf8");
const sharedSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine.ts"), "utf8");

for (const marker of [
  "NUM-QL-226..NUM-QL-236",
  "NUM-QL-237",
  "71 permanent QLs",
  "Question Studio review generation only",
  "Package-only `NUM-002` retains the existing fallback behavior",
]) {
  assert.ok(cumulativeRecord.includes(marker), `Cumulative landing record missing marker: ${marker}`);
}
for (const marker of [
  "11 retained permanent solve authorities",
  "No unresolved source-backed gap requires another CP012 solve engine",
]) {
  assert.ok(saturationRecord.includes(marker), `Saturation authority record missing marker: ${marker}`);
}
for (const marker of [
  'if (number >= 226 && number <= 236) return "NUM-CP-012";',
  'requestedNumberSystemCp === "NUM-CP-012"',
  'requestedNumberSystemQlCp === "NUM-CP-012"',
  'targetCp !== "NUM-CP-012"',
]) {
  assert.ok(routeSource.includes(marker), `Admin route marker missing: ${marker}`);
}
for (const marker of [
  "listNumCp012QuestionStudioPackages",
  "generateNumCp012QuestionStudioBatch",
  "CP008-CP012-MULTILINGUAL-FROZEN-V1",
  "if (isNumCp012QuestionStudioRequest(request))",
]) {
  assert.ok(sharedSource.includes(marker), `Shared engine marker missing: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_CUMULATIVE_LANDING",
  discoveryPrototypes: sourcePrototypeCoverage.size,
  permanentAuthorities: NUM_CP012_PERMANENT_ALLOCATION.length,
  permanentRange: "NUM-QL-226..236",
  nextAvailableQl: NUM_CP012_ALLOCATION_STATUS.nextAvailableQl,
  englishChecks,
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
