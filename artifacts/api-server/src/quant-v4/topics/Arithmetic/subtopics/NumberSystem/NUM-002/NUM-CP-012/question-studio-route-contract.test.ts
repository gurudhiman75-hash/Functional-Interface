import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestion,
  isNumCp012QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine.ts";

assert.equal(isNumCp012QuestionStudioRequest({ packageId: "NUM-002" }), false, "CP012 must not claim package-only NUM-002");
assert.equal(isNumCp012QuestionStudioRequest({ canonicalProblemId: "NUM-CP-012" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-226" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-236" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-225" }), false);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-237" }), false);

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 capability missing");
for (const cp of ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011", "NUM-CP-012"]) {
  assert.ok(num002.cpIds.includes(cp), `${cp} capability missing or regressed`);
}
for (const ql of ["NUM-QL-166", "NUM-QL-185", "NUM-QL-197", "NUM-QL-213", "NUM-QL-226", "NUM-QL-236"]) {
  assert.ok(num002.permanentQlIds.includes(ql), `${ql} aggregate capability missing`);
}
assert.equal(num002.permanentQlCount, 71, "NUM-002 aggregate permanent QL count drift through CP012");
assert.deepEqual(num002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

const english = await generateQuestion({
  canonicalProblemId: "NUM-CP-012",
  questionLanguageId: "NUM-QL-226",
  language: "en",
  seed: "cp012-shared-route-en",
  count: 2,
});
assert.equal(english.questions.length, 2);
assert.ok(english.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-012"));
assert.ok(english.questions.every((q: any) => q.questionLanguageId === "NUM-QL-226"));

const hindi = await generateQuestion({
  packageId: "NUM-002",
  canonicalProblemId: "NUM-CP-012",
  questionLanguageId: "NUM-QL-230",
  language: "hi",
  seed: "cp012-shared-route-hi",
  count: 4,
});
assert.equal(hindi.questions.length, 4);
assert.ok(hindi.questions.every((q: any) => q.language === "hi"));
assert.ok(hindi.questions.every((q: any) => q.options[q.correctIndex] === q.answer));
assert.ok(hindi.questions.every((q: any) => q.questionBankWritable === false));

const punjabi = await generateQuestion({
  patternId: "NUM-CP-012 perfect powers",
  questionLanguageId: "NUM-QL-236",
  language: "pa",
  seed: "cp012-shared-route-pa",
  count: 3,
});
assert.equal(punjabi.questions.length, 3);
assert.ok(punjabi.questions.every((q: any) => q.language === "pa"));
assert.ok(punjabi.questions.every((q: any) => q.options[q.correctIndex] === q.answer));

for (const regression of [
  { cp: "NUM-CP-008", ql: "NUM-QL-166" },
  { cp: "NUM-CP-009", ql: "NUM-QL-185" },
  { cp: "NUM-CP-010", ql: "NUM-QL-197" },
  { cp: "NUM-CP-011", ql: "NUM-QL-213" },
] as const) {
  const result = await generateQuestion({
    canonicalProblemId: regression.cp,
    questionLanguageId: regression.ql,
    language: "en",
    seed: `cp012-routing-regression:${regression.cp}`,
    count: 1,
  });
  assert.equal(result.questions[0]?.canonicalProblemId, regression.cp, `CP012 dispatch stole ${regression.cp} request`);
  assert.equal(result.questions[0]?.questionLanguageId, regression.ql, `${regression.cp} QL routing regressed`);
}

const routeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-average.ts"), "utf8");
const sharedSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine.ts"), "utf8");

const requiredRouteMarkers = [
  'patternId.includes("num cp 012")',
  'checkpointId === "NUM-CP-012"',
  'inferredQlCp === "NUM-CP-012"',
  'if (number >= 226 && number <= 236) return "NUM-CP-012";',
  'requestedNumberSystemCp === "NUM-CP-012"',
  'requestedNumberSystemQlCp === "NUM-CP-012"',
  'targetCp !== "NUM-CP-012"',
  'NUM-CP-001 and NUM-CP-008 through NUM-CP-012',
];
for (const marker of requiredRouteMarkers) {
  assert.ok(routeSource.includes(marker), `Admin Question Studio route missing CP012 marker: ${marker}`);
}

const requiredSharedMarkers = [
  "generateNumCp012QuestionStudioBatch",
  "isNumCp012QuestionStudioRequest",
  "listNumCp012QuestionStudioPackages",
  "const cp012 = listNumCp012QuestionStudioPackages()[0]!;",
  "...cp012.cpIds",
  "...cp012.permanentQlIds",
  "CP008-CP012-MULTILINGUAL-FROZEN-V1",
  "if (isNumCp012QuestionStudioRequest(request))",
  "return generateNumCp012QuestionStudioBatch(request);",
];
for (const marker of requiredSharedMarkers) {
  assert.ok(sharedSource.includes(marker), `Shared Question Studio engine missing CP012 marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_ADMIN_ROUTE_AND_SHARED_ENGINE",
  num002PermanentQlCount: num002.permanentQlCount,
  cp012FirstQl: "NUM-QL-226",
  cp012LastQl: "NUM-QL-236",
  nextAvailableQl: "NUM-QL-237",
  englishQuestions: english.questions.length,
  hindiQuestions: hindi.questions.length,
  punjabiQuestions: punjabi.questions.length,
  cp008ThroughCp011RoutingRegression: "PASS",
  packageOnlyNum002ClaimedByCp012: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
