import assert from "node:assert/strict";
import { generateIdenticalFigureReviewQuestionV1 } from "../foundation/spatial/identical-figure-review-runtime-v1";
import { generateIdenticalFigureReviewQuestionV1_1 } from "../foundation/spatial/identical-figure-review-runtime-v1-1";

const qls = ["SPA-QL-061", "SPA-QL-062", "SPA-QL-063"] as const;
const languages = ["en", "hi", "pa"] as const;
const seeds = Array.from({ length: 96 }, (_, index) => `idf-review-${index + 1}`);
let checked = 0;
let visibleNumberLabels = 0;
let opaqueNumberBackplates = 0;
let familySpecificExplanationChecks = 0;
let explicitDistractorMismatchChecks = 0;

for (const qlId of qls) {
  for (const seed of seeds) {
    const v1English = generateIdenticalFigureReviewQuestionV1({ qlId, seed, language: "en" });
    const v11English = generateIdenticalFigureReviewQuestionV1_1({ qlId, seed, language: "en" });

    assert.equal(v11English.version, "SPA-IDF-001-REVIEW-QUESTION-V1.1");
    assert.equal(v11English.geometryFingerprint, v1English.geometryFingerprint, `${qlId}/${seed}: semantic geometry must not change`);
    assert.equal(v11English.correctIndex, v1English.correctIndex, `${qlId}/${seed}: answer index must not change`);
    assert.equal(v11English.answer, v1English.answer, `${qlId}/${seed}: answer must not change`);
    assert.deepEqual(v11English.options, v1English.options, `${qlId}/${seed}: grouping options must not change`);
    assert.deepEqual(v11English.solveFacts.correctPartition, v1English.solveFacts.correctPartition, `${qlId}/${seed}: correct grouping must not change`);
    assert.equal(v11English.explanation.solutionSvg, v1English.explanation.solutionSvg, `${qlId}/${seed}: grouped solution illustration must remain unchanged`);

    assert.ok(v11English.stimulusSvg.includes('data-idf-number-overlay="true"'), `${qlId}/${seed}: final number overlay missing`);
    const labels = v11English.stimulusSvg.match(/data-idf-number-label="[1-9]"/g) ?? [];
    assert.equal(labels.length, 9, `${qlId}/${seed}: all nine bank labels must be repainted above artwork`);
    const backplates = v11English.stimulusSvg.match(/width="14" height="14" rx="1\.5" fill="white" stroke="none"/g) ?? [];
    assert.equal(backplates.length, 9, `${qlId}/${seed}: every final bank number needs its opaque readability plate`);
    opaqueNumberBackplates += backplates.length;
    for (let number = 1; number <= 9; number += 1) {
      assert.ok(v11English.stimulusSvg.includes(`data-idf-number-label="${number}"`), `${qlId}/${seed}: label ${number} missing`);
      assert.ok(v11English.stimulusSvg.includes(`font-weight="700" fill="#111827">${number}</text>`), `${qlId}/${seed}: label ${number} text must stay dark and bold`);
    }
    assert.ok(v11English.stimulusSvg.lastIndexOf('data-idf-number-overlay="true"') > v11English.stimulusSvg.lastIndexOf('transform="translate(8 9) scale(.9)"'), `${qlId}/${seed}: number overlay must paint after figure artwork`);
    assert.equal(v11English.validation.numberLabelsPaintedAboveArtwork, true);
    assert.equal(v11English.validation.allNineNumberLabelsVisibleByConstruction, true);
    assert.equal(v11English.validation.explanationUsesLearnerFacingLanguage, true);
    assert.equal(v11English.validation.explanationNamesFamilySpecificRule, true);
    assert.equal(v11English.validation.distractorCheckNamesActualMismatch, true);
    assert.equal(v11English.lifecycle.reviewOnly, true);
    assert.equal(v11English.lifecycle.questionStudioDiscoverable, false);
    assert.equal(v11English.lifecycle.persistenceAllowed, false);
    assert.equal(v11English.lifecycle.questionBankWritable, false);
    assert.equal(v11English.lifecycle.testBuilderEligible, false);
    assert.equal(v11English.lifecycle.mockTestEligible, false);
    assert.equal(v11English.lifecycle.publicReleaseAuthorized, false);
    assert.equal(v11English.lifecycle.studentDeliveryAuthorized, false);
    assert.equal(v11English.lifecycle.automaticStudentPublication, false);

    const englishExplanation = [
      v11English.explanation.observation,
      v11English.explanation.rule,
      v11English.explanation.application,
      v11English.explanation.check,
      ...v11English.explanation.groupTable.map((row) => row.reason),
    ].join(" ");
    for (const jargon of ["semantic grouping key", "declared component", "transform policy", "complete semantic", "semantic key"]) {
      assert.ok(!englishExplanation.toLowerCase().includes(jargon), `${qlId}/${seed}: learner explanation leaked implementation jargon: ${jargon}`);
    }
    assert.ok(!englishExplanation.includes("same no internal partition"), `${qlId}/${seed}: awkward partition wording must not reach learners`);
    assert.ok(v11English.explanation.check.includes("group ("), `${qlId}/${seed}: distractor check should identify a concrete failed group`);
    assert.ok(v11English.explanation.check.includes("mixes"), `${qlId}/${seed}: distractor check should name the mismatch`);
    explicitDistractorMismatchChecks += 1;

    if (qlId === "SPA-QL-061") {
      assert.ok(/outer shape|central mark|internal division/.test(v11English.explanation.rule));
    } else if (qlId === "SPA-QL-062") {
      assert.ok(v11English.explanation.rule.includes("relationship between the two shapes"));
      assert.ok(v11English.explanation.application.includes("topology relation"));
    } else if (v11English.solveFacts.transformPolicy === "ROTATION_ONLY") {
      assert.ok(v11English.explanation.rule.includes("mirror image does not count"));
      assert.ok(v11English.explanation.application.includes("allowed transformation"));
    } else {
      assert.ok(v11English.explanation.rule.includes("mirror reflection"));
      assert.ok(v11English.explanation.application.includes("allowed transformation"));
    }
    familySpecificExplanationChecks += 1;

    for (const language of languages) {
      const v1 = generateIdenticalFigureReviewQuestionV1({ qlId, seed, language });
      const v11 = generateIdenticalFigureReviewQuestionV1_1({ qlId, seed, language });
      const repeat = generateIdenticalFigureReviewQuestionV1_1({ qlId, seed, language });
      assert.deepEqual(v11, repeat, `${qlId}/${seed}/${language}: V1.1 must be deterministic`);
      assert.equal(v11.geometryFingerprint, v1.geometryFingerprint, `${qlId}/${seed}/${language}: semantic geometry changed`);
      assert.equal(v11.answer, v1.answer, `${qlId}/${seed}/${language}: answer changed`);
      assert.deepEqual(v11.solveFacts.correctPartition, v1.solveFacts.correctPartition);
      assert.equal(v11.explanation.solutionSvg, v1.explanation.solutionSvg);
      assert.ok(v11.explanation.observation.length > 30);
      assert.ok(v11.explanation.rule.length > 30);
      assert.ok(v11.explanation.application.length > 30);
      assert.ok(v11.explanation.check.length > 30);
      assert.equal(v11.explanation.groupTable.length, 3);
      assert.ok(v11.explanation.groupTable.every((row) => row.reason.length > 12));
      checked += 1;
      visibleNumberLabels += 9;
    }
  }
}

console.log(JSON.stringify({
  authority: "SPA-IDF-001-REVIEW-V1.1",
  qls,
  seedsPerQl: seeds.length,
  languages,
  checked,
  visibleNumberLabels,
  opaqueNumberBackplates,
  familySpecificExplanationChecks,
  explicitDistractorMismatchChecks,
  semanticContractUnchangedFromV1: true,
  learnerNumberingRemediated: true,
  learnerExplanationWordingRemediated: true,
  releaseGatesRemainClosed: true,
}, null, 2));
