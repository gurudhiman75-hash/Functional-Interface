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

let records = 0;
let ql008Records = 0;
let ql008EitherOrRecords = 0;
let ql008NonEitherOrRecords = 0;
let ql009Records = 0;
let modelRecords = 0;
let enabledDiagrams = 0;
let omittedDiagrams = 0;
let omittedComplex = 0;
let omittedUnstable = 0;
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
      const premiseTerms = new Set(question.structuredPrompt.premises.flatMap((premise) => [
        premise.subject,
        premise.predicate,
      ]));
      records += 1;

      assert.equal(presentation.authority, "SYL_001_EXAM_READINESS_REMEDIATION_V5");
      assert.equal(presentation.schemaVersion, "syl-learner-v5");
      assert.ok(presentation.preTestDirection.trim().length > 20);
      assert.equal(presentation.lifecycle.reviewStatus, "REVISE");
      assert.equal(presentation.lifecycle.public, false);
      assert.equal(presentation.lifecycle.questionStudioEnabled, false);
      assert.equal(presentation.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(presentation.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(presentation.remediationEvidence.nativeEnglishEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.nativeHindiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.nativePunjabiEditorialStatus, "APPROVED_BY_PRODUCT_OWNER");
      assert.equal(presentation.remediationEvidence.humanViewportStatus, "APPROVED");

      if (presentation.diagram.enabled) {
        enabledDiagrams += 1;
        assert.equal(explanation.showDiagram, true);
        assert.equal(presentation.diagram.diagramCount, 1);
        assert.equal(presentation.diagram.omissionReason, null);
        assert.ok(premiseTerms.size <= 3, `${definition.qlId}/${seed}/${locale}: forced complex diagram`);
        assert.match(diagramSvg, /data-learner-safe-venn="true"/u);
        assert.match(diagramSvg, /viewBox="0 0 340 210"/u);
        assert.match(diagramSvg, /<(?:circle|ellipse)\b/u);
        assert.doesNotMatch(diagramSvg, /relation map|relation-map|node-link|arrow map|separation-mark|×[1-9]/iu);
        assert.equal(presentation.diagram.mobileViewBoxWidth, 340);
      } else {
        omittedDiagrams += 1;
        assert.equal(explanation.showDiagram, false);
        assert.equal(presentation.diagram.diagramCount, 0);
        assert.equal(presentation.diagram.mode, "OMITTED_NOT_USEFUL");
        assert.equal(presentation.diagram.svg, null);
        if (presentation.diagram.omissionReason === "MORE_THAN_THREE_TERMS") {
          omittedComplex += 1;
          assert.ok(premiseTerms.size > 3);
        } else if (presentation.diagram.omissionReason === "NO_STABLE_SIMPLE_VENN") {
          omittedUnstable += 1;
        } else {
          assert.fail(`${definition.qlId}/${seed}/${locale}: unexpected diagram omission`);
        }
      }

      assert.equal(
        explanation.conclusionResults.length,
        question.reviewLogic.conclusionEvaluations.length,
      );
      for (const result of explanation.conclusionResults) {
        if (!result.shortReason.trim()) unexplainedConclusions += 1;
        assert.ok(result.shortReason.trim());
      }

      if (MASK_OR_PAIR_TASKS.has(question.metadata.taskKind)) {
        const conclusionMatchesAnswer = normalize(explanation.conclusion).includes(normalize(answerText));
        if (!conclusionMatchesAnswer) answerModeContradictions += 1;
        assert.ok(conclusionMatchesAnswer);
      }

      if (definition.qlId === "SYL-QL-008") {
        ql008Records += 1;
        const isEitherOr = genuineEitherOr(question.metadata.pairStatus);
        if (isEitherOr) ql008EitherOrRecords += 1;
        else ql008NonEitherOrRecords += 1;
        const explanationIsEitherOr = explanation.mode === "EITHER_OR";
        if (explanationIsEitherOr !== isEitherOr) answerModeContradictions += 1;
        assert.equal(explanationIsEitherOr, isEitherOr);
        const diagramIsEitherOr = presentation.diagram.enabled
          && presentation.diagram.mode === "VENN_EITHER_OR";
        if (diagramIsEitherOr && !isEitherOr) diagramModeContradictions += 1;
        assert.ok(!diagramIsEitherOr || isEitherOr);
      }

      if (definition.qlId === "SYL-QL-009") {
        ql009Records += 1;
        assert.equal(explanation.mode, "PAIR_CLASSIFICATION");
        assert.ok(explanation.conclusionResults.length >= 2);
        assert.ok(explanation.conclusionResults.every((result) => result.shortReason.trim().length > 0));
      }

      if (requiresConcreteModelsV5(explanation.mode)) {
        modelRecords += 1;
        assert.equal(presentation.modelEvidence.required, true);
        const expectedModels = explanation.mode === "DUAL_MODEL" || explanation.mode === "POSSIBLE_NOT_DEFINITE"
          ? 2
          : 1;
        assert.ok(presentation.modelEvidence.canonicalModelCount >= expectedModels);
        assert.ok(explanation.shortReasoning.length >= expectedModels);
      }

      const v3Options = question.structuredProofV3.visibleOptionAnalysis;
      assert.equal(presentation.optionAnalysis.length, v3Options.length);
      for (const option of presentation.optionAnalysis) {
        const v3 = v3Options.find((entry) => entry.displayIndex === option.displayIndex);
        assert.ok(v3);
        assert.equal(option.logicalStatus, v3.semanticStatus);
        assert.equal(option.taskDisposition, v3.taskStatus);
        const expectedLabel = expectedLogicalLabelV5(locale, v3.semanticStatus);
        if (option.verdictLabel !== expectedLabel) optionStatusLabelMismatches += 1;
        assert.equal(option.verdictLabel, expectedLabel);
      }

      deadInconsistentOptionOccurrences += question.options.filter((option) =>
        option.semanticValue === "PREMISES_INCONSISTENT" && !option.isCorrect).length;
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.equal(ql008Records, 80 * 3);
assert.ok(ql008EitherOrRecords > 0);
assert.ok(ql008NonEitherOrRecords > 0);
assert.equal(ql009Records, 80 * 3);
assert.equal(answerModeContradictions, 0);
assert.equal(diagramModeContradictions, 0);
assert.equal(unexplainedConclusions, 0);
assert.equal(optionStatusLabelMismatches, 0);
assert.equal(deadInconsistentOptionOccurrences, 0);
assert.ok(modelRecords > 0);
assert.ok(enabledDiagrams > 0);
assert.ok(omittedDiagrams > 0);
assert.ok(omittedComplex > 0);

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
    enabled: enabledDiagrams,
    omitted: omittedDiagrams,
    omittedComplex,
    omittedUnstable,
    forcedComplexDiagrams: 0,
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
    diagramPolicy: "VERIFIED_SIMPLE_VENN_OR_OMIT",
    humanViewportReview: "APPROVED_BY_PRODUCT_OWNER",
  },
  retainedReleaseBlockers: {
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
