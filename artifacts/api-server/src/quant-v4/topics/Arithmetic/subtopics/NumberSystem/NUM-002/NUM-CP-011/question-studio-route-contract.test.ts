import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestion,
  isNumCp011QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine.ts";

assert.equal(isNumCp011QuestionStudioRequest({ canonicalProblemId: "NUM-CP-011" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-213" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-225" }), true);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-212" }), false);
assert.equal(isNumCp011QuestionStudioRequest({ questionLanguageId: "NUM-QL-226" }), false, "CP011 must not claim CP012 QLs");

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 capability missing");
assert.ok(num002.cpIds.includes("NUM-CP-008"), "CP008 capability regressed");
assert.ok(num002.cpIds.includes("NUM-CP-009"), "CP009 capability regressed");
assert.ok(num002.cpIds.includes("NUM-CP-010"), "CP010 capability regressed");
assert.ok(num002.cpIds.includes("NUM-CP-011"), "CP011 capability missing");
assert.ok(num002.cpIds.includes("NUM-CP-012"), "CP012 aggregate extension missing");
assert.ok(num002.permanentQlIds.includes("NUM-QL-213"), "QL213 capability missing");
assert.ok(num002.permanentQlIds.includes("NUM-QL-225"), "QL225 capability missing");
assert.ok(num002.permanentQlIds.includes("NUM-QL-226"), "QL226 CP012 extension missing");
assert.ok(num002.permanentQlIds.includes("NUM-QL-236"), "QL236 CP012 extension missing");
assert.equal(num002.permanentQlCount, 71, "NUM-002 permanent QL aggregate drift through CP012");
assert.deepEqual(num002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.publiclyPublishable, false);

const english = await generateQuestion({
  canonicalProblemId: "NUM-CP-011",
  questionLanguageId: "NUM-QL-213",
  language: "en",
  seed: "cp011-shared-route-en",
  count: 2,
});
assert.equal(english.questions.length, 2);
assert.ok(english.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-011"));
assert.ok(english.questions.every((q: any) => q.questionLanguageId === "NUM-QL-213"));

const hindi = await generateQuestion({
  packageId: "NUM-002",
  canonicalProblemId: "NUM-CP-011",
  questionLanguageId: "NUM-QL-220",
  language: "hi",
  seed: "cp011-shared-route-hi",
  count: 4,
});
assert.equal(hindi.questions.length, 4);
assert.ok(hindi.questions.every((q: any) => q.language === "hi"));
assert.ok(hindi.questions.every((q: any) => q.options[q.correctIndex] === q.answer));
assert.ok(hindi.questions.every((q: any) => q.questionBankWritable === false));

const punjabi = await generateQuestion({
  patternId: "NUM-CP-011 trailing zeroes",
  questionLanguageId: "NUM-QL-225",
  language: "pa",
  seed: "cp011-shared-route-pa",
  count: 3,
});
assert.equal(punjabi.questions.length, 3);
assert.ok(punjabi.questions.every((q: any) => q.language === "pa"));
assert.ok(punjabi.questions.every((q: any) => q.options[q.correctIndex] === q.answer));

const cp010Regression = await generateQuestion({
  canonicalProblemId: "NUM-CP-010",
  questionLanguageId: "NUM-QL-197",
  language: "en",
  seed: "cp010-routing-regression-from-cp011",
  count: 1,
});
assert.equal(cp010Regression.questions[0]?.canonicalProblemId, "NUM-CP-010", "CP011 dispatch stole CP010 request");
assert.equal(cp010Regression.questions[0]?.questionLanguageId, "NUM-QL-197", "CP010 QL routing regressed");

const cp012Boundary = await generateQuestion({
  canonicalProblemId: "NUM-CP-012",
  questionLanguageId: "NUM-QL-226",
  language: "en",
  seed: "cp012-boundary-from-cp011-regression",
  count: 1,
});
assert.equal(cp012Boundary.questions[0]?.canonicalProblemId, "NUM-CP-012", "CP011 dispatch stole CP012 request");
assert.equal(cp012Boundary.questions[0]?.questionLanguageId, "NUM-QL-226", "CP012 boundary routing missing");

const routeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-average.ts"), "utf8");
const sharedSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine.ts"), "utf8");

const requiredRouteMarkers = [
  'patternId.includes("num cp 011")',
  'checkpointId === "NUM-CP-011"',
  'inferredQlCp === "NUM-CP-011"',
  'if (number >= 213 && number <= 225) return "NUM-CP-011";',
  'requestedNumberSystemCp === "NUM-CP-011"',
  'requestedNumberSystemQlCp === "NUM-CP-011"',
  'targetCp !== "NUM-CP-011"',
  'targetCp !== "NUM-CP-012"',
];
for (const marker of requiredRouteMarkers) {
  assert.ok(routeSource.includes(marker), `Admin Question Studio route missing CP011 marker: ${marker}`);
}

const requiredSharedMarkers = [
  "generateNumCp011QuestionStudioBatch",
  "isNumCp011QuestionStudioRequest",
  "listNumCp011QuestionStudioPackages",
  "const cp011 = listNumCp011QuestionStudioPackages()[0]!;",
  "...cp011.cpIds",
  "...cp011.permanentQlIds",
  "CP008-CP012-MULTILINGUAL-FROZEN-V1",
  "if (isNumCp011QuestionStudioRequest(request))",
  "return generateNumCp011QuestionStudioBatch(request);",
];
for (const marker of requiredSharedMarkers) {
  assert.ok(sharedSource.includes(marker), `Shared Question Studio engine missing CP011 marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_ADMIN_ROUTE_AND_SHARED_ENGINE",
  num002PermanentQlCount: num002.permanentQlCount,
  cp011FirstQl: "NUM-QL-213",
  cp011LastQl: "NUM-QL-225",
  cp012BoundaryQl: "NUM-QL-226",
  englishQuestions: english.questions.length,
  hindiQuestions: hindi.questions.length,
  punjabiQuestions: punjabi.questions.length,
  cp010RoutingRegression: "PASS",
  cp012BoundaryRouting: "PASS",
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
