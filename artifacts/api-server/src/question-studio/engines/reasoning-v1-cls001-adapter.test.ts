import assert from "node:assert/strict";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
  resolveQuestionStudioEngine,
} from "../engine-registry";
import {
  CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  CLS001_QUESTION_STUDIO_QL_IDS_V1,
} from "./reasoning-v1-cls001-adapter";

const packages = listQuestionStudioPackages();
const clsPackage = packages.find((pkg) => pkg.packageId === CLS001_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(clsPackage, "CLS-001 must be listed in Question Studio packages");
assert.equal(clsPackage.engineId, "reasoning-v1");
assert.equal(clsPackage.runtimeMode, "review-only");
assert.deepEqual(clsPackage.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(clsPackage.difficultyFilterSupported, false);
assert.equal(clsPackage.lifecycleStage, "REVIEW_ONLY");
assert.equal(clsPackage.questionBankWritable, false);
assert.equal(clsPackage.testEligible, false);
assert.equal(clsPackage.mockTestEligible, false);
assert.equal(clsPackage.publiclyPublishable, false);
assert.equal(clsPackage.automaticStudentPublication, false);
assert.equal(clsPackage.productionReleaseAuthorized, false);
assert.ok(packages.some((pkg) => pkg.packageId === "OPS-001"), "existing OPS-001 reasoning package must remain registered");

const resolved = resolveQuestionStudioEngine({ packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1 });
assert.equal(resolved.engineId, "reasoning-v1");

for (const language of ["en", "hi", "pa"] as const) {
  const result = await generateQuestionStudioQuestions({
    packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    language,
    count: 13,
    seed: `cls001-studio-gate-${language}`,
    runtimeMode: "review-only",
  });

  assert.equal(result.engineId, "reasoning-v1");
  assert.equal(result.questions.length, 13);
  const seen = new Set(result.questions.map((question) => question.qlId));
  assert.deepEqual([...seen].sort(), [...CLS001_QUESTION_STUDIO_QL_IDS_V1].sort());

  for (const question of result.questions) {
    assert.equal(question.packageId, CLS001_QUESTION_STUDIO_PACKAGE_ID_V1);
    assert.equal(question.language, language);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionStudioGenerationEnabled, true);
    assert.equal(question.runtimeRegistered, true);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.readOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.productionReleased, false);
    assert.ok(typeof question.stem === "string" && question.stem.length > 0);
    assert.ok(Array.isArray(question.options) && question.options.length >= 4);
    assert.ok(typeof question.correctIndex === "number");
    assert.ok(
      question.correctIndex >= 0 && question.correctIndex < question.options.length,
      `${String(question.qlId)} has invalid correctIndex`,
    );
    assert.ok(typeof question.explanation === "string" && question.explanation.length > 0);

    if (question.cpId === "CLS-CP-004") {
      const learnerText = `${String(question.stem)}\n${String(question.explanation)}`;
      if (language === "hi") {
        assert.ok(!learnerText.includes("विषम संख्या चुनिए"), "CP004 Hindi Studio surface must keep approved अलग संख्या wording");
      }
      if (language === "pa") {
        assert.ok(!learnerText.includes("ਜੁੜੀ ਸੰਖਿਆ"), "CP004 Punjabi Studio surface must not regress to old parity wording");
        assert.ok(!learnerText.includes("ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ"), "CP004 Punjabi Studio surface must use ਜਿਸਤ / ਟਾਂਕ wording");
      }
    }
  }
}

for (const qlId of CLS001_QUESTION_STUDIO_QL_IDS_V1) {
  const result = await generateQuestionStudioQuestions({
    packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: qlId,
    language: "en",
    count: 2,
    seed: `cls001-selector-${qlId}`,
  });
  assert.equal(result.questions.length, 2);
  assert.ok(result.questions.every((question) => question.qlId === qlId));
}

await assert.rejects(
  generateQuestionStudioQuestions({
    packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    language: "en",
    difficulty: "Hard",
    count: 1,
  }),
  /difficulty filtering is intentionally disabled/u,
);

await assert.rejects(
  generateQuestionStudioQuestions({
    packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: "CLS-QL-999",
    language: "en",
    count: 1,
  }),
  /Unknown CLS-001 selector/u,
);

console.log("CLS-001 Question Studio review-only integration gate passed");
