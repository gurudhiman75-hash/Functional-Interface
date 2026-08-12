import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_002_RUNTIME_PROOF_IDS,
  generateTrg002RuntimeProofQuestion,
  trg002ProofFingerprint,
} from "./runtime-proof";
import {
  generateAllReviewedTrg002RuntimeProofQuestions,
  generateReviewedTrg002RuntimeProofQuestion,
} from "./runtime-proof-reviewed";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-reviewed-${String(index + 1).padStart(2, "0")}`);
let reviewedCases = 0;
for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const base = generateTrg002RuntimeProofQuestion(qlId, seed);
    const reviewed = generateReviewedTrg002RuntimeProofQuestion(qlId, seed);
    const repeated = generateReviewedTrg002RuntimeProofQuestion(qlId, seed);

    assert(trg002ProofFingerprint(reviewed) === trg002ProofFingerprint(repeated), `${qlId} reviewed output is not deterministic for ${seed}.`);
    assert(reviewed.validation.valid, `${qlId} lost base validation after editorial remediation.`);
    assert(reviewed.verification.spatial.valid && reviewed.verification.diagram.valid && reviewed.verification.answer.valid, `${qlId} lost verification after editorial remediation.`);
    assert(answerKey(reviewed.exactAnswer) === answerKey(base.exactAnswer), `${qlId} editorial remediation changed the exact answer.`);
    assert(JSON.stringify(reviewed.options.map((option) => answerKey(option.value))) === JSON.stringify(base.options.map((option) => answerKey(option.value))), `${qlId} editorial remediation changed mathematical options.`);
    assert(reviewed.correctIndex === base.correctIndex, `${qlId} editorial remediation changed the correct index.`);
    assert(reviewed.canonicalSpatialState === base.canonicalSpatialState || JSON.stringify(reviewed.canonicalSpatialState) === JSON.stringify(base.canonicalSpatialState), `${qlId} editorial remediation changed canonical geometry.`);
    assert(reviewed.diagram === base.diagram || JSON.stringify(reviewed.diagram) === JSON.stringify(base.diagram), `${qlId} editorial remediation changed the diagram projection.`);
    assert(!reviewed.publiclyPublishable && !reviewed.questionStudioDiscoverable && reviewed.testEligibility === "INELIGIBLE" && reviewed.questionBankStatus === "NOT_STORED", `${qlId} activation lock changed during editorial remediation.`);

    if (qlId === "TRG-002-QL-061") {
      assert(reviewed.stem !== base.stem, "QL-061 reviewed stem must differ from the leaky engineering stem.");
      assert(/After moving .* m straight away/.test(reviewed.stem), "QL-061 reviewed stem must retain explicit move-farther information.");
      assert(!/^From \d+(?:\.\d+)? m away/.test(reviewed.stem), "QL-061 reviewed stem must not disclose the original distance.");
      assert(reviewed.explanation.steps.length >= 3, "QL-061 reviewed explanation must use the two-observation system explicitly.");
      assert(reviewed.explanation.steps.some((step) => /x tan60°=.*tan30°/.test(step.body)), "QL-061 reviewed explanation must equate both observation equations.");
    } else {
      assert(reviewed.stem === base.stem, `${qlId} should not receive an unrecorded editorial stem change.`);
    }

    stems.add(reviewed.stem);
    reviewedCases += 1;
  }
  assert(stems.size >= 2, `${qlId} reviewed proof must retain at least two stem variants across canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-reviewed-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllReviewedTrg002RuntimeProofQuestions(seed);
  assert(questions.length === 20, `Reviewed seed ${seed} did not generate all 20 proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} reviewed validation failed in ${seed}.`);
    assert(question.verification.spatial.valid && question.verification.diagram.valid && question.verification.answer.valid, `${question.qlId} reviewed verification failed in ${seed}.`);
    assert(new Set(question.options.map((option) => answerKey(option.value))).size === 4, `${question.qlId} reviewed option collision in ${seed}.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${question.qlId} reviewed correctIndex failed in ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-002 reviewed proof gates passed: ${reviewedCases} canonical reviewed cases and ${sweepCases} reviewed sweep cases.`);
