import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import {
  expectedLogicalLabelV5,
  requiresConcreteModelsV5,
} from "./learner-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const MASK_OR_PAIR_TASKS = new Set([
  "TWO_CONCLUSION_FOLLOW_MASK",
  "THREE_CONCLUSION_FOLLOW_MASK",
  "ONLY_TWO_CONCLUSION_MASK",
  "FEW_TWO_CONCLUSION_MASK",
  "MIXED_TWO_CONCLUSION_MASK",
  "MIXED_THREE_CONCLUSION_MASK",
  "TWO_CONCLUSION_EITHER_OR",
  "CLASSIFY_CONCLUSION_PAIR",
]);

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[“”"'’.!?।,:;—–-]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function genuineEitherOr(pairStatus: string | null): boolean {
  return pairStatus === "EITHER_OR_FOLLOWS" || pairStatus === "EITHER_OR";
}

function hasUnknownPremisePair(
  premises: readonly { subject: string; predicate: string }[],
): boolean {
  const terms = [...new Set(premises.flatMap((premise) => [premise.subject, premise.predicate]))];
  const pairs = new Set(premises.map((premise) =>
    [premise.subject, premise.predicate].sort().join("::")));
  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      if (!pairs.has([terms[left], terms[right]].sort().join("::"))) return true;
    }
  }
  return false;
}

let records = 0;
let ql008Records = 0;
let ql008EitherOrRecords = 0;
let ql008NonEitherOrRecords = 0;
let ql009Records = 0;
let modelRecords = 0;
let unsafeWitnessDiagramsReplaced = 0;
let focusedVennFallbacks = 0;
let nonVennVisuals = 0;
let answerModeContradictions = 0;
let diagramModeContradictions = 0;
let unexplainedConclusions = 0;
let optionStatusLabelMismatches = 0;
let deadInconsistentOptionOccurrences = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      const explanation = presentation.learnerExplanation;
      const answerText = question.options[question.correctIndex]?.text ?? presentation.answer.text;
      const diagramSvg = presentation.diagram.svg ?? "";
      records += 1;

      assert.equal(presentation.authority, "SYL_001_EXAM_READINESS_REMEDIATION_V5");
      assert.equal(presentation.schemaVersion, "syl-learner-v5");
      assert.ok(presentation.preTestDirection.trim().length > 20, `${definition.qlId}/${seed}/${locale}: missing pre-test existence direction`);
      assert.equal(presentation.lifecycle.reviewStatus, "REVISE");
      assert.equal(presentation.lifecycle.public, false);
      assert.equal(presentation.lifecycle.questionStudioEnabled, false);
      assert.equal(presentation.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(presentation.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(presentation.remediationEvidence.nativeEnglishEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.nativeHindiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.nativePunjabiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.humanViewportStatus, "EVIDENCE_READY_PENDING_APPROVAL");

      assert.equal(explanation.showDiagram, true, `${definition.qlId}/${seed}/${locale}: learner explanation hides its Venn diagram`);
      assert.equal(presentation.diagram.enabled, true, `${definition.qlId}/${seed}/${locale}: missing compulsory Venn diagram`);
      assert.equal(presentation.diagram.diagramCount, 1, `${definition.qlId}/${seed}/${locale}: expected exactly one Venn diagram`);
      assert.ok(diagramSvg, `${definition.qlId}/${seed}/${locale}: diagram SVG is empty`);
      assert.match(diagramSvg, /<svg\b/u);
      assert.match(diagramSvg, /<(?:circle|ellipse)\b/u, `${definition.qlId}/${seed}/${locale}: visual is not circle-based Venn geometry`);
      assert.match(presentation.diagram.mode, /^VENN_/u, `${definition.qlId}/${seed}/${locale}: non-Venn diagram mode remains`);
      assert.doesNotMatch(diagramSvg, /relation map|relation-map|node-link|arrow map/iu);
      assert.equal(presentation.diagram.omissionReason, null);
      if (presentation.diagram.semanticSignature.startsWith("syl-v5:focused-venn:")) {
        focusedVennFallbacks += 1;
        assert.match(diagramSvg, /class="examtree-venn-svg"/u);
      }
      if (!/<(?:circle|ellipse)\b/u.test(diagramSvg) || !/^VENN_/u.test(presentation.diagram.mode)) {
        nonVennVisuals += 1;
      }

      assert.equal(
        explanation.conclusionResults.length,
        question.reviewLogic.conclusionEvaluations.length,
        `${definition.qlId}/${seed}/${locale}: conclusion-result count mismatch`,
      );
      for (const result of explanation.conclusionResults) {
        if (!result.shortReason.trim()) unexplainedConclusions += 1;
        assert.ok(result.shortReason.trim(), `${definition.qlId}/${seed}/${locale}: conclusion ${result.displayIndex} has no reason`);
      }

      if (MASK_OR_PAIR_TASKS.has(question.metadata.taskKind)) {
        const conclusionMatchesAnswer = normalize(explanation.conclusion).includes(normalize(answerText));
        if (!conclusionMatchesAnswer) answerModeContradictions += 1;
        assert.ok(
          conclusionMatchesAnswer,
          `${definition.qlId}/${seed}/${locale}: final explanation does not match marked answer`,
        );
      }

      if (definition.qlId === "SYL-QL-008") {
        ql008Records += 1;
        const isEitherOr = genuineEitherOr(question.metadata.pairStatus);
        if (isEitherOr) ql008EitherOrRecords += 1;
        else ql008NonEitherOrRecords += 1;

        const explanationIsEitherOr = explanation.mode === "EITHER_OR";
        if (explanationIsEitherOr !== isEitherOr) answerModeContradictions += 1;
        assert.equal(
          explanationIsEitherOr,
          isEitherOr,
          `${definition.qlId}/${seed}/${locale}: either-or explanation selected from task identity instead of answer semantics`,
        );

        const diagramIsEitherOr = presentation.diagram.mode === "VENN_EITHER_OR";
        if (diagramIsEitherOr && !isEitherOr) diagramModeContradictions += 1;
        assert.ok(
          !diagramIsEitherOr || isEitherOr,
          `${definition.qlId}/${seed}/${locale}: either-or diagram used for a non-either-or answer`,
        );
        if (!isEitherOr) {
          assert.notEqual(
            presentation.diagram.mode,
            "VENN_EITHER_OR",
            `${definition.qlId}/${seed}/${locale}: stale either-or diagram mode remains`,
          );
        }
      }

      if (definition.qlId === "SYL-QL-009") {
        ql009Records += 1;
        assert.equal(explanation.mode, "PAIR_CLASSIFICATION");
        assert.ok(explanation.conclusionResults.length >= 2);
        assert.ok(explanation.conclusionResults.every((result) => result.shortReason.trim().length > 0));
        if (seed === 3 || seed === 4) {
          assert.ok(
            explanation.shortReasoning.length >= 2,
            `${definition.qlId}/${seed}/${locale}: reviewed pair-classification regression remains incomplete`,
          );
        }
      }

      if (requiresConcreteModelsV5(explanation.mode)) {
        modelRecords += 1;
        assert.equal(presentation.modelEvidence.required, true);
        const expectedModels = explanation.mode === "DUAL_MODEL" || explanation.mode === "POSSIBLE_NOT_DEFINITE"
          ? 2
          : 1;
        assert.ok(
          presentation.modelEvidence.canonicalModelCount >= expectedModels,
          `${definition.qlId}/${seed}/${locale}: ${explanation.mode} lacks concrete canonical model evidence`,
        );
        assert.ok(
          explanation.shortReasoning.length >= expectedModels,
          `${definition.qlId}/${seed}/${locale}: ${explanation.mode} does not narrate every required model`,
        );
      }

      const v3Options = question.structuredProofV3.visibleOptionAnalysis;
      assert.equal(presentation.optionAnalysis.length, v3Options.length);
      for (const option of presentation.optionAnalysis) {
        const v3 = v3Options.find((entry) => entry.displayIndex === option.displayIndex);
        assert.ok(v3, `${definition.qlId}/${seed}/${locale}: missing V3 option evidence`);
        assert.equal(option.logicalStatus, v3.semanticStatus);
        assert.equal(option.taskDisposition, v3.taskStatus);
        const expectedLabel = expectedLogicalLabelV5(locale, v3.semanticStatus);
        if (option.verdictLabel !== expectedLabel) optionStatusLabelMismatches += 1;
        assert.equal(option.verdictLabel, expectedLabel);
        if (locale === "en-IN" && v3.semanticStatus === "ENTAILED") {
          assert.ok(!/not proved|not asked/iu.test(option.verdictLabel));
        }
      }

      const hasUnsafeWitnessGeometry = question.learnerPresentationV4.diagram.mode === "VENN_WITNESS_TRANSFER"
        && hasUnknownPremisePair(question.structuredPrompt.premises);
      if (hasUnsafeWitnessGeometry) {
        unsafeWitnessDiagramsReplaced += 1;
        assert.ok(presentation.diagram.semanticSignature.startsWith("syl-v5:focused-venn:"));
        assert.match(presentation.diagram.mode, /^VENN_/u);
        assert.match(diagramSvg, /<(?:circle|ellipse)\b/u);
      }

      deadInconsistentOptionOccurrences += question.options.filter((option) =>
        option.semanticValue === "PREMISES_INCONSISTENT" && !option.isCorrect).length;
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.equal(ql008Records, 80 * 3);
assert.ok(ql008EitherOrRecords > 0, "QL-008 does not generate any genuine either-or case");
assert.ok(ql008NonEitherOrRecords > 0, "QL-008 does not exercise non-either-or answer masks");
assert.equal(ql009Records, 80 * 3);
assert.equal(answerModeContradictions, 0);
assert.equal(diagramModeContradictions, 0);
assert.equal(unexplainedConclusions, 0);
assert.equal(optionStatusLabelMismatches, 0);
assert.equal(deadInconsistentOptionOccurrences, 0);
assert.equal(nonVennVisuals, 0);
assert.ok(modelRecords > 0);
assert.ok(unsafeWitnessDiagramsReplaced > 0);
assert.ok(focusedVennFallbacks > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_EXAM_READINESS_REMEDIATION",
  authority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
  records,
  ql008: {
    records: ql008Records,
    genuineEitherOr: ql008EitherOrRecords,
    answerSpecificMasks: ql008NonEitherOrRecords,
  },
  ql009Records,
  modelRecords,
  diagramCoverage: {
    required: records,
    enabled: records,
    focusedVennFallbacks,
    nonVennVisuals,
    unsafeWitnessDiagramsReplaced,
  },
  gates: {
    explanationAnswerContradictions: answerModeContradictions,
    diagramAnswerContradictions: diagramModeContradictions,
    unexplainedDisplayedConclusions: unexplainedConclusions,
    optionStatusLabelMismatches,
  },
  resolvedReviewItems: {
    deadInconsistentOptionOccurrences,
    questionExplanationEditorialReview: "APPROVED_BY_PRODUCT_OWNER",
    viewportEvidence: "READY_AT_360_412_768",
    diagramCoverage: "ALL_RECORDS_HAVE_VENN_DIAGRAM",
  },
  retainedReleaseBlockers: {
    humanViewportReview: "EVIDENCE_READY_PENDING_APPROVAL",
    mockWeightCalibration: "PENDING_SEPARATE_SOURCE_DECISION",
  },
  lifecycle: {
    reviewStatus: "REVISE",
    questionStudioEnabled: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    public: false,
  },
}, null, 2));
