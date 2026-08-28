import assert from "node:assert/strict";
import {
  INT_CP004_QL_IDS,
  verifyCp004Answer,
} from "./cp004-frequency-math";
import { selectIntCp004ExamFriendlyFrozenSourceV9 } from "./cp004-exam-friendly-source-v9";
import {
  INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11,
  generateIntCp004EnglishExamFriendlyReviewV11,
} from "./cp004-english-exam-friendly-review-v11";

function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

const DECIMAL_TOKEN = /\d+\.\d+/gu;
const BLOCKED_WORDING = /two\s+decimal\s+places|rounded?\s+to|approximately|illustrative\s+compound|complete\s+periods?|reference\s+principal|a\/p\s+ratio|ci\/p\s+ratio/iu;
const INTERNAL_ID = /INT-CP|INT-QL|authority|prototype|review candidate|freeze id/iu;
const SAMPLES_PER_QL = 100;

let packages = 0;
let deterministicChecks = 0;
let verifierChecks = 0;
let mathematicalParityChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let learnerSurfaceChecks = 0;
let lifecycleChecks = 0;
const answerPositions = [0, 0, 0, 0];
const stemFamilies = new Map<string, Set<string>>();
const uniqueStates = new Map<string, Set<string>>();

assert.equal(INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11.approved, false);
assert.equal(INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11.permanentIdentityChanges, false);
assert.equal(INT_CP004_ENGLISH_EXAM_FRIENDLY_REVIEW_V11.questionStudioActivationAuthorized, false);

for (const qlId of INT_CP004_QL_IDS) {
  stemFamilies.set(qlId, new Set());
  uniqueStates.set(qlId, new Set());
  for (let index = 0; index < SAMPLES_PER_QL; index += 1) {
    const seed = `int-cp004-english-parity-v11:${qlId}:${index}`;
    const first = generateIntCp004EnglishExamFriendlyReviewV11(qlId, seed);
    const replay = generateIntCp004EnglishExamFriendlyReviewV11(qlId, seed);
    const v9 = selectIntCp004ExamFriendlyFrozenSourceV9(qlId, seed);
    packages += 1;

    assert.equal(stable(first), stable(replay), `${qlId}/${index}: deterministic replay drift`);
    deterministicChecks += 1;

    assert.equal(verifyCp004Answer(first.mathematicalState, first.solution), true, `${qlId}/${index}: independent verifier rejected solution`);
    assert.equal(first.solution.denominator, 1n, `${qlId}/${index}: verified answer is not integer-clean`);
    verifierChecks += 2;

    assert.equal(stable(first.mathematicalState), stable(v9.mathematicalState), `${qlId}/${index}: V9 mathematical-state parity drift`);
    assert.equal(first.v11Remediation.mathematicalStateChanged, false);
    mathematicalParityChecks += 2;

    assert.equal(first.options.length, 4, `${qlId}/${index}: expected four options`);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1, `${qlId}/${index}: expected one correct option`);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true, `${qlId}/${index}: correct-index ownership drift`);
    assert.equal(first.options[first.correctIndex]?.text, first.correctAnswer, `${qlId}/${index}: correct-answer text drift`);
    assert.equal(new Set(first.options.map((option) => option.text)).size, 4, `${qlId}/${index}: duplicate displayed options`);
    assert.ok(first.options.every((option) => option.feedback === ""), `${qlId}/${index}: learner option feedback leaked`);
    optionChecks += 6;
    answerPositions[first.correctIndex] += 1;

    assert.ok((first.explanation.steps[0] ?? "").startsWith("Formula:"), `${qlId}/${index}: explanation is not formula-first`);
    assert.ok(first.explanation.steps.length >= 3, `${qlId}/${index}: explanation too thin`);
    assert.ok(first.explanation.steps.slice(1).some((step) => /[=×÷+−^/]/u.test(step)), `${qlId}/${index}: explanation lacks explicit calculation`);
    assert.equal(first.explanation.finalAnswer, first.correctAnswer, `${qlId}/${index}: final answer drift`);
    assert.ok(first.explanation.commonMistake.length >= 35, `${qlId}/${index}: common-mistake guidance too thin`);
    explanationChecks += 5;

    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.text),
      first.correctAnswer,
      first.explanation.whatAsked,
      ...first.explanation.steps,
      first.explanation.finalAnswer,
      first.explanation.commonMistake,
    ].join("\n");
    const decimalMatches = [...learnerText.matchAll(DECIMAL_TOKEN)].map((match) => match[0]);
    assert.equal(decimalMatches.length, 0, `${qlId}/${index}: decimal token(s) leaked: ${decimalMatches.join(", ")}\n${learnerText}`);
    assert.equal(BLOCKED_WORDING.test(learnerText), false, `${qlId}/${index}: blocked legacy wording remains`);
    assert.equal(INTERNAL_ID.test(learnerText), false, `${qlId}/${index}: internal identifier leaked`);
    assert.ok(first.stem.length >= 35, `${qlId}/${index}: stem too thin`);
    learnerSurfaceChecks += 4;

    assert.equal(first.reviewAuthorityStatus, "ENGLISH_REMEDIATED_REVIEW_CANDIDATE");
    assert.equal(first.learnerContentFrozen, false);
    assert.equal(first.manualApprovalRequired, true);
    assert.equal(first.enabled, false);
    assert.equal(first.stagingStatus, "NOT_STAGED");
    assert.equal(first.registrationStatus, "NOT_REGISTERED");
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.v11Remediation.approvalGranted, false);
    lifecycleChecks += 11;

    stemFamilies.get(qlId)!.add(first.stemFamilyId);
    uniqueStates.get(qlId)!.add(stable(first.mathematicalState));
  }
}

for (const qlId of INT_CP004_QL_IDS) {
  assert.ok(stemFamilies.get(qlId)!.size >= 3, `${qlId}: fewer than three stem families reached`);
  assert.ok(uniqueStates.get(qlId)!.size >= 20, `${qlId}: mathematical-state diversity too thin`);
}
assert.ok(answerPositions.every((count) => count >= 350), `answer-position imbalance: ${answerPositions.join(" / ")}`);

console.log("PASS_INT_CP004_ENGLISH_PARITY_V11_AUDIT");
console.log(JSON.stringify({
  qlCount: INT_CP004_QL_IDS.length,
  samplesPerQl: SAMPLES_PER_QL,
  packages,
  deterministicChecks,
  verifierChecks,
  mathematicalParityChecks,
  optionChecks,
  explanationChecks,
  learnerSurfaceChecks,
  lifecycleChecks,
  answerPositions,
  approvalStatus: "NOT_APPROVED",
  questionStudioActivationAuthorized: false,
}, null, 2));
