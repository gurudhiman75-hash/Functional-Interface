import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestion,
  isNumCp013QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine-cp013.ts";

assert.equal(isNumCp013QuestionStudioRequest({ packageId: "NUM-002" }), false, "CP013 must not claim package-only NUM-002");
assert.equal(isNumCp013QuestionStudioRequest({ canonicalProblemId: "NUM-CP-013" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-237" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-247" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-236" }), false);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-248" }), false);

const num002 = listQuestionStudioPackages().find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 capability missing");
for (const cp of ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011", "NUM-CP-012", "NUM-CP-013"]) {
  assert.ok(num002.cpIds.includes(cp), `${cp} capability missing or regressed`);
}
for (const ql of ["NUM-QL-166", "NUM-QL-185", "NUM-QL-197", "NUM-QL-213", "NUM-QL-226", "NUM-QL-236", "NUM-QL-237", "NUM-QL-247"]) {
  assert.ok(num002.permanentQlIds.includes(ql), `${ql} aggregate capability missing`);
}
assert.equal(num002.permanentQlCount, 82, "NUM-002 aggregate permanent QL count drift through CP013");
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-247");
assert.equal(new Set(num002.permanentQlIds).size, 82);
assert.deepEqual(num002.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(num002.releaseId, "NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1");
assert.equal(num002.questionBankWritable, false);
assert.equal(num002.testEligible, false);
assert.equal(num002.mockTestEligible, false);
assert.equal(num002.publiclyPublishable, false);
assert.equal(num002.automaticStudentPublication, false);

const english = await generateQuestion({
  canonicalProblemId: "NUM-CP-013",
  questionLanguageId: "NUM-QL-237",
  language: "en",
  seed: "cp013-shared-route-en",
  count: 2,
});
assert.equal(english.questions.length, 2);
assert.ok(english.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-013"));
assert.ok(english.questions.every((q: any) => q.questionLanguageId === "NUM-QL-237"));

const hindi = await generateQuestion({
  packageId: "NUM-002",
  canonicalProblemId: "NUM-CP-013",
  questionLanguageId: "NUM-QL-241",
  language: "hi",
  seed: "cp013-shared-route-hi",
  count: 4,
});
assert.equal(hindi.questions.length, 4);
assert.ok(hindi.questions.every((q: any) => q.language === "hi"));
assert.ok(hindi.questions.every((q: any) => q.options[q.correctIndex] === q.answer));
assert.ok(hindi.questions.every((q: any) => q.questionBankWritable === false));

const punjabi = await generateQuestion({
  patternId: "NUM-CP-013 positional bases",
  questionLanguageId: "NUM-QL-247",
  language: "pa",
  seed: "cp013-shared-route-pa",
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
  { cp: "NUM-CP-012", ql: "NUM-QL-226" },
] as const) {
  const result = await generateQuestion({
    canonicalProblemId: regression.cp,
    questionLanguageId: regression.ql,
    language: "en",
    seed: `cp013-routing-regression:${regression.cp}`,
    count: 1,
  });
  assert.equal(result.questions[0]?.canonicalProblemId, regression.cp, `CP013 dispatch stole ${regression.cp} request`);
  assert.equal(result.questions[0]?.questionLanguageId, regression.ql, `${regression.cp} QL routing regressed`);
}

const fallback = await generateQuestion({
  packageId: "NUM-002",
  language: "en",
  seed: "cp013-package-only-fallback",
  count: 1,
});
assert.notEqual(fallback.questions[0]?.canonicalProblemId, "NUM-CP-013", "Package-only NUM-002 was stolen by CP013");

const adminRouteSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-cp013.ts"), "utf8");
const routeIndexSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/index.ts"), "utf8");
const facadeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine-cp013.ts"), "utf8");

for (const marker of [
  "isNumCp013QuestionStudioRequest",
  "shared-generation-engine-cp013",
  'packageId: "NUM-002"',
  'canonicalProblemId = asString(req.body?.canonicalProblemId)',
  'questionLanguageId = asString(req.body?.questionLanguageId)',
]) {
  assert.ok(adminRouteSource.includes(marker), `CP013 admin route missing marker: ${marker}`);
}
assert.ok(routeIndexSource.includes('import adminQuestionStudioCp013Router from "./admin-question-studio-cp013";'));
const cp013Mount = 'router.use("/admin/question-studio", adminQuestionStudioCp013Router);';
const legacyNumberSystemMount = 'router.use("/admin/question-studio", adminQuestionStudioAverageRouter);';
const cp013MountIndex = routeIndexSource.indexOf(cp013Mount);
const legacyNumberSystemMountIndex = routeIndexSource.indexOf(legacyNumberSystemMount);
assert.ok(cp013MountIndex >= 0, "CP013 admin Question Studio router mount is missing");
assert.ok(legacyNumberSystemMountIndex >= 0, "Legacy Number System Question Studio router mount is missing");
assert.ok(
  cp013MountIndex < legacyNumberSystemMountIndex,
  "CP013 admin Question Studio router must be mounted before the legacy Number System router",
);

for (const marker of [
  "generateNumCp013QuestionStudioBatch",
  "isNumCp013QuestionStudioRequest",
  "listNumCp013QuestionStudioPackages",
  "CP008-CP013-MULTILINGUAL-FROZEN-V1",
  "permanentQlCount: 82",
  "if (isNumCp013QuestionStudioRequest(request))",
  "return generateNumCp013QuestionStudioBatch(request);",
]) {
  assert.ok(facadeSource.includes(marker), `CP013 shared facade missing marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_ADMIN_ROUTE_AND_SHARED_FACADE",
  num002PermanentQlCount: num002.permanentQlCount,
  cp013FirstQl: "NUM-QL-237",
  cp013LastQl: "NUM-QL-247",
  nextAvailableQl: "NUM-QL-248",
  packageOnlyFallbackPreserved: true,
  cp008ThroughCp012RoutingRegression: "PASS",
  routeMountOrderGuard: "CP013_BEFORE_LEGACY_NUMBER_SYSTEM",
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
