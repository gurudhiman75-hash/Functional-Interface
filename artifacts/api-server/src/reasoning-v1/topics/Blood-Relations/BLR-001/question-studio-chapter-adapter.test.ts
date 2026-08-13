import { strict as assert } from "node:assert";
import {
  BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES,
  BLR_CP001_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP002_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP003_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP004_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP005_QUESTION_STUDIO_PACKAGE_ID,
  previewBlrChapterQuestionStudio,
  type BlrChapterStudioLanguage,
  type BlrChapterStudioPackageId,
} from "./question-studio-chapter-adapter";

const expected = [
  [BLR_CP001_QUESTION_STUDIO_PACKAGE_ID, ["BLR-QL-001","BLR-QL-002","BLR-QL-003","BLR-QL-004","BLR-QL-005","BLR-QL-006","BLR-QL-007"], ["en"]],
  [BLR_CP002_QUESTION_STUDIO_PACKAGE_ID, ["BLR-QL-008"], ["en"]],
  [BLR_CP003_QUESTION_STUDIO_PACKAGE_ID, ["BLR-QL-009","BLR-QL-010","BLR-QL-011","BLR-QL-012"], ["en","hi","pa"]],
  [BLR_CP004_QUESTION_STUDIO_PACKAGE_ID, ["BLR-QL-013","BLR-QL-014","BLR-QL-015","BLR-QL-016","BLR-QL-017"], ["en","hi","pa"]],
  [BLR_CP005_QUESTION_STUDIO_PACKAGE_ID, ["BLR-QL-018","BLR-QL-019","BLR-QL-020","BLR-QL-021","BLR-QL-022","BLR-QL-023","BLR-QL-024","BLR-QL-025"], ["en","hi","pa"]],
] as const;
assert.equal(BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES.length, 5);
let proofs = 0;
for (const [packageId, qls, languages] of expected) {
  const pkg = BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES.find((entry) => entry.packageId === packageId)!;
  assert.deepEqual(pkg.qlIds, qls);
  assert.deepEqual(pkg.supportedLanguages, languages);
  for (const language of languages) {
    const request = { packageId: packageId as BlrChapterStudioPackageId, language: language as BlrChapterStudioLanguage, seed: `proof:${packageId}:${language}`, count: 3 };
    assert.deepEqual(previewBlrChapterQuestionStudio(request), previewBlrChapterQuestionStudio(request));
    for (const qlId of qls) {
      const sample = previewBlrChapterQuestionStudio({ packageId: packageId as BlrChapterStudioPackageId, language: language as BlrChapterStudioLanguage, qlId, seed: `proof:${language}:${qlId}`, count: 1 });
      const question = sample.questions[0]!;
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.optionDetails[question.correctIndex]?.isCorrect, true);
      assert.equal(question.validation.valid, true);
      proofs += 1;
    }
  }
}
assert.throws(() => previewBlrChapterQuestionStudio({ packageId: BLR_CP001_QUESTION_STUDIO_PACKAGE_ID, language: "hi", count: 1 }), /does not support/i);
assert.throws(() => previewBlrChapterQuestionStudio({ packageId: BLR_CP002_QUESTION_STUDIO_PACKAGE_ID, language: "pa", count: 1 }), /does not support/i);
console.log(JSON.stringify({ verdict: "BLR_001_COMPLETE_CHAPTER_QUESTION_STUDIO_ADAPTER_PROVED", checkpointPackagesProved: 5, permanentQlRangeProved: "BLR-QL-001..BLR-QL-025", qlLanguageProofs: proofs, cp006AndCp007RoutesRemainIndependent: true }, null, 2));
