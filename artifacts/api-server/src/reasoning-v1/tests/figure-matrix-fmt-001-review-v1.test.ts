import assert from "node:assert/strict";
import { FIGURE_MATRIX_SOURCE_EVIDENCE_V1 } from "../foundation/spatial/figure-matrix-source-evidence-v1";
import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/figure-matrix-source-saturated-discovery-v1";
import { generateFigureMatrixReviewQuestionV1_1 } from "../foundation/spatial/figure-matrix-review-runtime-v1-1";
import type { FigureMatrixQlIdV1 } from "../foundation/spatial/figure-matrix-review-runtime-v1";
import { FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12 } from "../foundation/spatial/spatial-permanent-ql-allocation-v12";

const qls: readonly FigureMatrixQlIdV1[] = ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"];
const languages = ["en", "hi", "pa"] as const;
const difficulties = new Set<string>();
const answerLabels = new Set<string>();
const matrixSizes = new Set<number>();
const operationsByQl = new Map<string, Set<string>>();
const familyLabels = new Set<string>();
let checkedQuestions = 0;
let hardQuestions = 0;
let bothAxisQuestions = 0;
let editorialQuestions = 0;

const forbiddenLearnerTokens = [
  "DOUBLE_FIRST_PLUS_SECOND",
  "ABSOLUTE_DIFFERENCE",
  "CYCLIC_SHIFT",
  "ROW_ATTRIBUTE_PLUS_COLUMN_ATTRIBUTE",
  "ROTATE_AND_MOVE",
  "Rule (",
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

for (const qlId of qls) {
  const operations = new Set<string>();
  operationsByQl.set(qlId, operations);
  for (let index = 1; index <= 18; index += 1) {
    const seed = `fmt-${qlId}-${index}`;
    const english = generateFigureMatrixReviewQuestionV1_1({ qlId, seed, language: "en" });
    const replay = generateFigureMatrixReviewQuestionV1_1({ qlId, seed, language: "en" });
    assert.deepEqual(replay, english, `${qlId}/${seed} must be exactly deterministic`);
    assert.equal(english.version, "SPA-FMT-001-REVIEW-QUESTION-V1.1");
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
    assert.ok(english.matrixSvg.includes("?"));
    assert.ok(!english.solutionSvg.includes(">?</text>"));
    assert.ok(english.explanation.rule.length > 20);
    assert.ok(english.explanation.worked.length > 30);
    assert.ok(english.explanation.application.length > 25);
    assert.ok(english.explanation.verification.length > 25);
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

    operations.add(english.solveFacts.operation);
    familyLabels.add(english.familyLabel);
    difficulties.add(english.difficulty);
    answerLabels.add(english.answer);
    matrixSizes.add(english.matrixSize);
    checkedQuestions += 1;
    editorialQuestions += 1;
    if (english.difficulty === "HARD") hardQuestions += 1;
    if (english.solveFacts.governingAxis === "BOTH") bothAxisQuestions += 1;

    for (const language of languages) {
      const localized = generateFigureMatrixReviewQuestionV1_1({ qlId, seed, language });
      assert.equal(localized.geometryFingerprint, english.geometryFingerprint, `${qlId}/${seed}/${language} geometry must be language-neutral`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}/${seed}/${language} answer index must preserve parity`);
      assert.equal(localized.solveFacts.semanticAnswerKey, english.solveFacts.semanticAnswerKey);
      assert.deepEqual(localized.solveFacts.semanticOptionKeys, english.solveFacts.semanticOptionKeys);
      assert.ok(localized.stem.length > 20);
      assert.ok(localized.explanation.rule.length > 20);
      assert.ok(localized.explanation.application.length > 20);
      assert.ok(localized.explanation.verification.length > 20);

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
        for (const phrase of ["In each row", "Applying the same", "Option A:", "Option B:", "Option C:", "Option D:", "Therefore option"] as const) {
          assert.equal(localizedLearnerText.includes(phrase), false, `${qlId}/${seed}/${language} must not embed English explanation phrase '${phrase}'`);
        }
      }
    }
  }
}

assert.equal(checkedQuestions, 108);
assert.equal(editorialQuestions, checkedQuestions, "every semantic review item must pass through editorial V1.1");
assert.equal(familyLabels.size, 6, "every permanent FMT family should have a human review label");
assert.ok(difficulties.has("EASY"), "review corpus must expose Easy questions");
assert.ok(difficulties.has("MODERATE"), "review corpus must expose Moderate questions");
assert.ok(difficulties.has("HARD"), "review corpus must expose Hard questions");
assert.ok(hardQuestions >= 30, "review corpus should have a material hard slice");
assert.ok(bothAxisQuestions >= 25, "review corpus should materially exercise simultaneous row/column checking");
assert.ok(matrixSizes.has(3), "3x3 must remain the primary exam surface");
assert.ok(matrixSizes.has(4), "review corpus should exercise 4x4 cyclic matrices from source variety");
assert.ok(answerLabels.size >= 3, "answer placement should not collapse to one/two fixed positions");
assert.ok((operationsByQl.get("SPA-QL-055")?.size ?? 0) >= 1);
assert.ok((operationsByQl.get("SPA-QL-056")?.size ?? 0) >= 3, "composition QL should exercise union, XOR and intersection");
assert.ok((operationsByQl.get("SPA-QL-057")?.size ?? 0) >= 3, "count QL should exercise multiple count rules");
assert.ok((operationsByQl.get("SPA-QL-058")?.size ?? 0) >= 1);
assert.ok((operationsByQl.get("SPA-QL-059")?.size ?? 0) >= 1);
assert.ok((operationsByQl.get("SPA-QL-060")?.size ?? 0) >= 1);

console.log(JSON.stringify({
  authority: "SPA-FMT-001-REVIEW-V1.1",
  qls,
  checkedQuestions,
  editorialQuestions,
  familyLabels: [...familyLabels].sort(),
  languages,
  difficulties: [...difficulties],
  matrixSizes: [...matrixSizes].sort(),
  answerLabels: [...answerLabels].sort(),
  hardQuestions,
  bothAxisQuestions,
  operationsByQl: Object.fromEntries([...operationsByQl].map(([ql, operations]) => [ql, [...operations]])),
  internalRuleTokensHidden: true,
  localizedExplanationLanguagePure: true,
  sourceSaturated: true,
  releaseGatesRemainClosed: true,
}, null, 2));
