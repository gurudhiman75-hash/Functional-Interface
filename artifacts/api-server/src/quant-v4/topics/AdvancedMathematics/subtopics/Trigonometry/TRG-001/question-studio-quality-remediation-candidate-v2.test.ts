import assert from "node:assert/strict";

import {
  generateSemanticallyUniqueTrg001QuestionStudioBatch,
  semanticFingerprintForTrg001QuestionStudioPreview,
} from "./question-studio-quality-remediation-candidate-v2";
import {
  generateQualityRemediatedTrg001QuestionStudioQuestion,
} from "./question-studio-quality-remediation-candidate-v1";

const seed = "quant-v4-trg-semantic-dedup-v2";

const ql038a = generateQualityRemediatedTrg001QuestionStudioQuestion("TRG-001-QL-038", `${seed}:a`, "en");
const ql038b = generateQualityRemediatedTrg001QuestionStudioQuestion("TRG-001-QL-038", `${seed}:b`, "en");
assert.equal(
  semanticFingerprintForTrg001QuestionStudioPreview(ql038a),
  semanticFingerprintForTrg001QuestionStudioPreview(ql038b),
  "Fixed mathematical state must remain the same semantic question even when seed/option order changes.",
);

let capacityError: any = null;
try {
  generateSemanticallyUniqueTrg001QuestionStudioBatch({
    questionLanguageId: "TRG-001-QL-038",
    language: "en",
    seed: `${seed}:fixed-capacity`,
    count: 2,
  });
} catch (error) {
  capacityError = error;
}
assert.ok(capacityError, "A fixed-state QL must not silently duplicate itself to satisfy a larger count.");
assert.equal(capacityError.code, "TRG001_UNIQUE_SEMANTIC_CAPACITY_EXHAUSTED");
assert.equal(capacityError.statusCode, 409);
assert.equal(capacityError.requestedCount, 2);
assert.equal(capacityError.uniqueCount, 1);

const batch: any = generateSemanticallyUniqueTrg001QuestionStudioBatch({
  language: "en",
  seed: `${seed}:general-batch`,
  count: 10,
});
assert.equal(batch.questions.length, 10);
assert.equal(batch.questionPackages.length, 10);
assert.equal(batch.generationContext.acceptedUniqueQuestionCount, 10);
assert.equal(batch.generationContext.semanticBatchDeduplication, true);
assert.equal(batch.generationContext.activationAuthorized, false);

const fingerprints = batch.questions.map((question: any) => question.semanticFingerprint);
assert.equal(new Set(fingerprints).size, fingerprints.length, "Accepted Question Studio batch must be semantically unique.");
for (const [index, question] of batch.questions.entries()) {
  assert.equal(question.generationMetadata.questionIndex, index + 1);
  assert.equal(question.generationMetadata.questionCount, 10);
  assert.equal(question.reviewStatus, "QUALITY_REMEDIATION_CANDIDATE_V2");
  assert.equal(question.activationAuthorized, false);
  assert.equal(question.questionStudioDiscoverable, false);
  assert.ok(!String(question.explanation).includes("Shortcut:"));
  assert.ok(!String(question.explanation).includes("Common trap:"));
}

console.log(JSON.stringify({
  status: "PASS_TRG001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V2",
  semanticBatchDeduplication: true,
  capacityFailureForFixedQl: true,
  learnerExplanationPolicyInherited: "CORE_RULE_AND_WORKED_STEPS_ONLY",
  activationAuthorized: false,
}, null, 2));
