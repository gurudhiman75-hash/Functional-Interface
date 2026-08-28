import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateNumCp014QuestionStudioBatch,
  isNumCp014QuestionStudioRequest,
  listNumCp014QuestionStudioPackages,
} from "./question-studio-integration.ts";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../../../question-studio/shared-generation-engine-cp014.ts";

assert.equal(isNumCp014QuestionStudioRequest({ packageId: "NUM-002" }), false, "CP014 must not claim package-only NUM-002");
assert.equal(isNumCp014QuestionStudioRequest({ canonicalProblemId: "NUM-CP-014" }), true);
assert.equal(isNumCp014QuestionStudioRequest({ questionLanguageId: "NUM-QL-248" }), true);
assert.equal(isNumCp014QuestionStudioRequest({ questionLanguageId: "NUM-QL-253" }), true);
assert.equal(isNumCp014QuestionStudioRequest({ questionLanguageId: "NUM-QL-247" }), false);
assert.equal(isNumCp014QuestionStudioRequest({ questionLanguageId: "NUM-QL-254" }), false);

const cp014 = listNumCp014QuestionStudioPackages()[0]!;
assert.equal(cp014.permanentQlCount, 6);
assert.deepEqual(cp014.permanentQlIds, ["NUM-QL-248", "NUM-QL-249", "NUM-QL-250", "NUM-QL-251", "NUM-QL-252", "NUM-QL-253"]);
assert.deepEqual(cp014.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(cp014.supportedDifficulties, ["Hard"]);
assert.equal(cp014.questionBankWritable, false);
assert.equal(cp014.testEligible, false);
assert.equal(cp014.mockTestEligible, false);
assert.equal(cp014.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of cp014.permanentQlIds) {
    const result = await generateNumCp014QuestionStudioBatch({
      canonicalProblemId: "NUM-CP-014",
      questionLanguageId: qlId,
      language,
      difficulty: "Hard",
      seed: `cp014-direct:${language}:${qlId}`,
      count: 3,
    });
    assert.equal(result.questions.length, 3);
    for (const q of result.questions as any[]) {
      assert.equal(q.canonicalProblemId, "NUM-CP-014");
      assert.equal(q.questionLanguageId, qlId);
      assert.equal(q.language, language);
      assert.equal(q.options[q.correctIndex], q.answer);
      assert.equal(q.packageExplanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
      assert.ok(q.packageExplanation.fullDerivation.length >= 3);
      assert.ok(q.packageExplanation.examShortcut.length >= 1);
      assert.ok(q.componentEngines.length >= 2);
      assert.ok(q.ablation);
      assert.equal(q.questionStudioDiscoverable, true);
      assert.equal(q.questionBankWritable, false);
      assert.equal(q.testEligible, false);
      assert.equal(q.mockTestEligible, false);
      assert.equal(q.publiclyPublishable, false);
      assert.equal(q.automaticStudentPublication, false);
    }
  }
}

await assert.rejects(
  () => generateNumCp014QuestionStudioBatch({ canonicalProblemId: "NUM-CP-014", difficulty: "Easy", count: 1 }),
  /Hard difficulty only/u,
);

const allPackages = listQuestionStudioPackages() as any[];
const num002 = allPackages.find((pkg: any) => String(pkg.packageId) === "NUM-002") as any;
assert.ok(num002, "NUM-002 aggregate capability missing");
assert.equal(num002.permanentQlCount, 88);
assert.equal(num002.permanentQlIds[0], "NUM-QL-166");
assert.equal(num002.permanentQlIds.at(-1), "NUM-QL-253");
assert.equal(new Set(num002.permanentQlIds).size, 88);
for (const qlId of ["NUM-QL-166", "NUM-QL-226", "NUM-QL-237", "NUM-QL-247", "NUM-QL-248", "NUM-QL-253"]) {
  assert.ok(num002.permanentQlIds.includes(qlId), `${qlId}: aggregate capability missing`);
}
for (const cpId of ["NUM-CP-008", "NUM-CP-009", "NUM-CP-010", "NUM-CP-011", "NUM-CP-012", "NUM-CP-013", "NUM-CP-014"]) {
  assert.ok(num002.cpIds.includes(cpId), `${cpId}: aggregate CP capability missing`);
}
assert.equal(num002.releaseId, "NUM-002-QS-CP008-CP014-MULTILINGUAL-FROZEN-V1");
assert.ok(allPackages.some((pkg: any) => String(pkg.packageId) === "TRG-001"), "CP014 aggregate lost TRG-001 capability");
assert.ok(allPackages.some((pkg: any) => String(pkg.packageId) === "TRG-002"), "CP014 aggregate lost TRG-002 capability");

const sharedCp014 = await generateQuestion({ canonicalProblemId: "NUM-CP-014", questionLanguageId: "NUM-QL-248", language: "hi", difficulty: "Hard", seed: "cp014-shared-hi", count: 2 });
assert.ok(sharedCp014.questions.every((q: any) => q.canonicalProblemId === "NUM-CP-014"));
assert.ok(sharedCp014.questions.every((q: any) => q.questionLanguageId === "NUM-QL-248"));
assert.ok(sharedCp014.questions.every((q: any) => q.language === "hi"));

const cp013Regression = await generateQuestion({ canonicalProblemId: "NUM-CP-013", questionLanguageId: "NUM-QL-247", language: "en", seed: "cp014-cp013-regression", count: 1 });
assert.equal(cp013Regression.questions[0]?.canonicalProblemId, "NUM-CP-013", "CP014 dispatch stole CP013 request");
assert.equal(cp013Regression.questions[0]?.questionLanguageId, "NUM-QL-247");

const cp012Regression = await generateQuestion({ canonicalProblemId: "NUM-CP-012", questionLanguageId: "NUM-QL-226", language: "en", seed: "cp014-cp012-regression", count: 1 });
assert.equal(cp012Regression.questions[0]?.canonicalProblemId, "NUM-CP-012", "CP014 dispatch stole CP012 request");

const fallback = await generateQuestion({ packageId: "NUM-002", language: "en", seed: "cp014-package-only-fallback", count: 1 });
assert.notEqual(fallback.questions[0]?.canonicalProblemId, "NUM-CP-014", "Package-only NUM-002 was stolen by CP014");

const registrySource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"), "utf8");
const cp014RouteSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-cp014.ts"), "utf8");
const facadeSource = readFileSync(resolve(process.cwd(), "artifacts/api-server/src/question-studio/shared-generation-engine-cp014.ts"), "utf8");

const cp014Mount = "router.use(adminQuestionStudioCp014Router);";
const trigMount = "router.use(adminQuestionStudioTrigonometryRouter);";
const cp013Mount = "router.use(adminQuestionStudioCp013Router);";
assert.ok(registrySource.includes('import adminQuestionStudioCp014Router from "./admin-question-studio-cp014";'));
assert.ok(registrySource.includes('import adminQuestionStudioTrigonometryRouter from "./admin-question-studio-trigonometry";'));
const cp014MountIndex = registrySource.indexOf(cp014Mount);
const trigMountIndex = registrySource.indexOf(trigMount);
const cp013MountIndex = registrySource.indexOf(cp013Mount);
assert.ok(cp014MountIndex >= 0 && trigMountIndex >= 0 && cp013MountIndex >= 0);
assert.ok(cp014MountIndex < trigMountIndex, "CP014 aggregate router must precede Trigonometry capability router");
assert.ok(trigMountIndex < cp013MountIndex, "Trigonometry router must remain before CP013");
for (const marker of ["isNumCp014QuestionStudioRequest", "shared-generation-engine-cp014", 'canonicalProblemId = asString(req.body?.canonicalProblemId)', 'questionLanguageId = asString(req.body?.questionLanguageId)', "quant-v4-num-cp014"]) {
  assert.ok(cp014RouteSource.includes(marker), `CP014 admin route missing marker: ${marker}`);
}
for (const marker of ["shared-generation-engine-trigonometry", "generateNumCp014QuestionStudioBatch", "isNumCp014QuestionStudioRequest", "CP008-CP014-MULTILINGUAL-FROZEN-V1", "permanentQlCount: 88", "return generatePreviousQuestion(request)"]) {
  assert.ok(facadeSource.includes(marker), `CP014 shared facade missing marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_QUESTION_STUDIO_INTEGRATION",
  cp014PermanentQlCount: 6,
  num002AggregateQlCount: num002.permanentQlCount,
  permanentRange: "NUM-QL-248..NUM-QL-253",
  nextFreeQl: "NUM-QL-254",
  packageOnlyFallbackPreserved: true,
  cp012Cp013RoutingRegression: "PASS",
  trigonometryCapabilitiesPreserved: true,
  registryMountOrder: "CP014_BEFORE_TRIGONOMETRY_BEFORE_CP013",
  supportedLanguages: ["en", "hi", "pa"],
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
