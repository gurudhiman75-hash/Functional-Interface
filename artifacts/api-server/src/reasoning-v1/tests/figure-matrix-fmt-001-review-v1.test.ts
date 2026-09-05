import assert from "node:assert/strict";
import { FIGURE_MATRIX_SOURCE_EVIDENCE_V1 } from "../foundation/spatial/figure-matrix-source-evidence-v1";
import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/figure-matrix-source-saturated-discovery-v1";
import { FMT_V2_SOURCE_VARIANTS, type FigureMatrixQlIdV2 } from "../foundation/spatial/figure-matrix-review-runtime-v2";
import { generateFigureMatrixReviewQuestionV2_1 } from "../foundation/spatial/figure-matrix-review-runtime-v2-1";
import { FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12 } from "../foundation/spatial/spatial-permanent-ql-allocation-v12";

const qls: readonly FigureMatrixQlIdV2[] = ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"];
const languages = ["en", "hi", "pa"] as const;
const difficulties = new Set<string>();
const answerLabels = new Set<string>();
const matrixSizes = new Set<number>();
const familyLabels = new Set<string>();
const sourceVariantsByQl = new Map<FigureMatrixQlIdV2, Set<string>>(qls.map((qlId) => [qlId, new Set<string>()]));
let checkedQuestions = 0;
let hardQuestions = 0;
let bothAxisQuestions = 0;
let twoByTwoQuestions = 0;
let editorialQuestions = 0;

const forbiddenLearnerTokens = [
  "DOUBLE_FIRST_PLUS_SECOND",
  "ABSOLUTE_DIFFERENCE",
  "CYCLIC_SHIFT",
  "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE",
  "ROTATE_AND_MOVE",
  "ROTATE_PLUS_REFLECT",
  "REMOVE_PLUS_ROTATE",
  "UNION_OR_SUPERIMPOSITION",
  "INTERSECTION_OR_COMMON_PARTS",
  "SYMMETRIC_DIFFERENCE_OR_CANCELLATION",
  "DIRECTIONAL_SUBTRACTION_OR_DIFFERENCE",
  "{H",
  "D1",
  "D2",
  "position N",
  "position E",
  "position S",
  "position W",
] as const;

assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length, 6);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.conclusion.sixConsolidatedSemanticQlsSupported, true);
assert.equal(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.length, 6);
assert.deepEqual(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.sourceObservedSurfaces.matrixSizes, ["2x2", "3x3", "4x4"]);

for (const qlId of qls) {
  const variants = sourceVariantsByQl.get(qlId)!;
  for (let index = 1; index <= 24; index += 1) {
    const seed = `fmt-${qlId}-${index}`;
    const english = generateFigureMatrixReviewQuestionV2_1({ qlId, seed, language: "en" });
    const replay = generateFigureMatrixReviewQuestionV2_1({ qlId, seed, language: "en" });
    assert.deepEqual(replay, english, `${qlId}/${seed} must be exactly deterministic`);
    assert.equal(english.version, "SPA-FMT-001-REVIEW-QUESTION-V2.1");
    assert.equal(english.qlId, qlId);
    assert.equal(english.chapterCode, "FMT-001");
    assert.equal(english.optionSvgs.length, 4);
    assert.equal(new Set(english.solveFacts.semanticOptionKeys).size, 4, `${qlId}/${seed} must expose four semantically distinct options`);
    assert.equal(new Set(english.optionSvgs).size, 4, `${qlId}/${seed} must render four visibly distinct options`);
    assert.ok(english.correctIndex >= 0 && english.correctIndex < 4);
    assert.equal(english.answer, english.optionLabels[english.correctIndex]);
    assert.equal(english.solveFacts.distractorFailures.length, 3);
    assert.equal(english.validation.semanticCellStateIsAuthority, true);
    assert.equal(english.validation.solverRecomputedMissingCell, true);
    assert.equal(english.validation.correctOptionSatisfiesDeclaredRule, true);
    assert.equal(english.validation.allEvidentialAxesChecked, true);
    assert.equal(english.validation.everyDistractorHasSemanticFailure, true);
    assert.equal(english.validation.uniqueAnswer, true);
    assert.equal(english.validation.duplicateSemanticOptionsRejected, true);
    assert.equal(english.validation.svgIsOutputNotAuthority, true);
    assert.equal(english.validation.examStrokeWidthPx, 1.35);
    assert.equal(english.validation.editorialExplanationReviewed, true);
    assert.equal(english.validation.internalRuleTokensHiddenFromLearnerExplanation, true);
    assert.equal(english.validation.localizedExplanationLanguagePure, true);
    assert.equal(english.validation.sourceVariantTagged, true);
    assert.equal(english.validation.sourceObserved2x2Supported, true);
    assert.equal(english.validation.sourceObservedElementRemovalSupported, true);
    assert.equal(english.validation.sourceObservedReflectionSupported, true);
    assert.equal(english.validation.sourceObservedFillStatesSupported, true);
    assert.ok(english.matrixSvg.includes("?"), `${qlId}/${seed} must display the missing-cell marker`);
    assert.equal(english.solutionSvg.includes(">?</text>"), false, `${qlId}/${seed} solution illustration must fill the missing cell`);
    assert.ok(english.explanation.rule.length > 20);
    assert.ok(english.explanation.worked.length > 20);
    assert.ok(english.explanation.application.length > 20);
    assert.ok(english.explanation.verification.length > 15);
    assert.equal(english.explanation.distractorChecks.length, 3);
    assert.equal(english.lifecycle.reviewOnly, true);
    assert.equal(english.lifecycle.learnerContentFrozen, false);
    assert.equal(english.lifecycle.questionStudioDiscoverable, false);
    assert.equal(english.lifecycle.persistenceAllowed, false);
    assert.equal(english.lifecycle.questionBankWritable, false);
    assert.equal(english.lifecycle.testBuilderEligible, false);
    assert.equal(english.lifecycle.mockTestEligible, false);
    assert.equal(english.lifecycle.publicReleaseAuthorized, false);
    assert.equal(english.lifecycle.studentDeliveryAuthorized, false);
    assert.equal(english.lifecycle.automaticStudentPublication, false);

    const learnerText = [
      english.stem,
      english.explanation.rule,
      english.explanation.worked,
      english.explanation.application,
      english.explanation.verification,
      ...english.explanation.distractorChecks,
    ].join(" ");
    for (const token of forbiddenLearnerTokens) {
      assert.equal(learnerText.includes(token), false, `${qlId}/${seed} must not leak internal token ${token}`);
    }

    variants.add(english.solveFacts.sourceVariant);
    familyLabels.add(english.familyLabel);
    difficulties.add(english.difficulty);
    answerLabels.add(english.answer);
    matrixSizes.add(english.matrixSize);
    checkedQuestions += 1;
    editorialQuestions += 1;
    if (english.difficulty === "HARD") hardQuestions += 1;
    if (english.solveFacts.governingAxis === "BOTH") bothAxisQuestions += 1;
    if (english.matrixSize === 2) twoByTwoQuestions += 1;

    for (const language of languages) {
      const localized = generateFigureMatrixReviewQuestionV2_1({ qlId, seed, language });
      assert.equal(localized.geometryFingerprint, english.geometryFingerprint, `${qlId}/${seed}/${language} geometry must be language-neutral`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}/${seed}/${language} answer index must preserve parity`);
      assert.equal(localized.solveFacts.semanticAnswerKey, english.solveFacts.semanticAnswerKey);
      assert.deepEqual(localized.solveFacts.semanticOptionKeys, english.solveFacts.semanticOptionKeys);
      assert.equal(localized.solveFacts.sourceVariant, english.solveFacts.sourceVariant);
      assert.ok(localized.stem.length > 20);
      assert.ok(localized.explanation.rule.length > 15);
      assert.ok(localized.explanation.application.length > 15);

      const localizedLearnerText = [
        localized.stem,
        localized.explanation.rule,
        localized.explanation.worked,
        localized.explanation.application,
        localized.explanation.verification,
        ...localized.explanation.distractorChecks,
      ].join(" ");
      for (const token of forbiddenLearnerTokens) {
        assert.equal(localizedLearnerText.includes(token), false, `${qlId}/${seed}/${language} must not leak internal token ${token}`);
      }
      if (language !== "en") {
        for (const phrase of ["In each row", "Apply the", "This gives option", "Option A:", "Option B:", "Option C:", "Option D:"] as const) {
          assert.equal(localizedLearnerText.includes(phrase), false, `${qlId}/${seed}/${language} must not embed English explanation phrase '${phrase}'`);
        }
      }
    }
  }
}

assert.equal(checkedQuestions, 144);
assert.equal(editorialQuestions, checkedQuestions);
assert.equal(familyLabels.size, 6);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MODERATE"));
assert.ok(difficulties.has("HARD"));
assert.ok(hardQuestions >= 35, "review corpus should have a material hard slice");
assert.ok(bothAxisQuestions >= 30, "review corpus should materially exercise simultaneous row/column checking");
assert.ok(twoByTwoQuestions >= 8, "source-observed 2x2 matrices must be materially exercised");
assert.deepEqual([...matrixSizes].sort(), [2, 3, 4], "review corpus must cover source-observed 2x2, 3x3 and 4x4 surfaces");
assert.equal(answerLabels.size, 4, "deterministic option shuffling should exercise all four answer positions");

for (const qlId of qls) {
  const observed = [...sourceVariantsByQl.get(qlId)!].sort();
  const required = [...FMT_V2_SOURCE_VARIANTS[qlId]].sort();
  assert.deepEqual(observed, required, `${qlId} runtime must exercise every declared source-real variant`);
}

assert.ok(sourceVariantsByQl.get("SPA-QL-055")!.has("OUTER_ELEMENT_REMOVAL_2X2"));
assert.ok(sourceVariantsByQl.get("SPA-QL-055")!.has("SEQUENTIAL_ELEMENT_REMOVAL"));
assert.ok(sourceVariantsByQl.get("SPA-QL-055")!.has("REFLECTION_OR_INVERSION"));
assert.ok(sourceVariantsByQl.get("SPA-QL-055")!.has("SHADING_STATE_CHANGE"));
assert.ok(sourceVariantsByQl.get("SPA-QL-056")!.has("DIRECTIONAL_SUBTRACTION_OR_DIFFERENCE"));
assert.ok(sourceVariantsByQl.get("SPA-QL-058")!.has("FILL_STATE_CYCLE"));
assert.ok(sourceVariantsByQl.get("SPA-QL-060")!.has("ROTATE_PLUS_REFLECT"));
assert.ok(sourceVariantsByQl.get("SPA-QL-060")!.has("REMOVE_ELEMENT_PLUS_ORIENTATION_CHANGE"));

console.log(JSON.stringify({
  authority: "SPA-FMT-001-REVIEW-V2.1",
  qls,
  checkedQuestions,
  languages,
  difficulties: [...difficulties],
  matrixSizes: [...matrixSizes].sort(),
  answerLabels: [...answerLabels].sort(),
  hardQuestions,
  bothAxisQuestions,
  twoByTwoQuestions,
  familyLabels: [...familyLabels].sort(),
  sourceVariantsByQl: Object.fromEntries([...sourceVariantsByQl].map(([qlId, variants]) => [qlId, [...variants].sort()])),
  sourceObservedElementRemovalCovered: true,
  sourceObservedReflectionCovered: true,
  sourceObservedFillCycleCovered: true,
  sourceObservedDirectionalSubtractionCovered: true,
  internalRuleTokensHidden: true,
  localizedExplanationLanguagePure: true,
  sourceSaturatedRuntime: true,
  releaseGatesRemainClosed: true,
}, null, 2));
