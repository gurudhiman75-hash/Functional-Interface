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
let unsafeWitnessDiagramsOmitted = 0;
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
      records += 1;

      assert.equal(presentation.authority, "SYL_001_EXAM_READINESS_REMEDIATION_V5");
      assert.equal(presentation.schemaVersion, "syl-learner-v5");
      assert.ok(presentation.preTestDirection.trim().length > 20, `${definition.qlId}/${seed}/${locale}: missing pre-test existence direction`);
      assert.equal(presentation.lifecycle.reviewStatus, "REVISE");
      assert.equal(presentation.lifecycle.public, false);
      assert.equal(presentation.lifecycle.questionStudioEnabled, false);
      assert.equal(presentation.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(presentation.lifecycle.testEligibility, "INELIGIBLE");

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

        const diagramIsEitherOr = presentation.diagram.enabled
          && presentation.diagram.mode === "VENN_EITHER_OR";
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
        unsafeWitnessDiagramsOmitted += 1;
        assert.equal(presentation.diagram.enabled, false);
        assert.equal(presentation.diagram.omissionReason, "UNKNOWN_RELATION_NOT_DRAWN");
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
assert.ok(modelRecords > 0);
assert.ok(unsafeWitnessDiagramsOmitted > 0);

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
  unsafeWitnessDiagramsOmitted,
  gates: {
    explanationAnswerContradictions: answerModeContradictions,
    diagramAnswerContradictions: diagramModeContradictions,
    unexplainedDisplayedConclusions: unexplainedConclusions,
    optionStatusLabelMismatches,
  },
  retainedReleaseBlockers: {
    deadInconsistentOptionOccurrences,
    deadOptionDecision: "PENDING_SEPARATE_SOURCE_DECISION",
    nativeEditorialReview: "PENDING",
    humanViewportReview: "PENDING",
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
