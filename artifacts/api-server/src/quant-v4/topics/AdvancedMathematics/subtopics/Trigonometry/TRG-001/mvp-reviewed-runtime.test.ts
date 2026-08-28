import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_MVP_REGISTRY,
  generateTrg001MvpQuestion,
} from "./mvp-runtime";
import {
  generateAllReviewedTrg001MvpQuestions,
  generateReviewedTrg001MvpQuestion,
  reviewedMvpFingerprint,
} from "./mvp-reviewed-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `NUMBER:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `ANGLE:${degrees.numerator}/${degrees.denominator}`;
}

const INTENTIONAL_MATH_REPLACEMENTS = new Set([
  "TRG-001-QL-034",
  "TRG-001-QL-073",
  "TRG-001-QL-080",
  "TRG-001-QL-102",
  "TRG-001-QL-129",
]);

assert(TRG_001_MVP_REGISTRY.length === 72, "Reviewed MVP must retain exactly 72 QLs.");
assert(new Set(TRG_001_MVP_REGISTRY.map((entry) => entry.qlId)).size === 72, "Reviewed MVP QL IDs must remain unique.");

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-reviewed-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const entry of TRG_001_MVP_REGISTRY) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const reviewed = generateReviewedTrg001MvpQuestion(entry.qlId, seed);
    const repeated = generateReviewedTrg001MvpQuestion(entry.qlId, seed);
    const engineering = generateTrg001MvpQuestion(entry.qlId, seed) as any;

    assert(reviewedMvpFingerprint(reviewed) === reviewedMvpFingerprint(repeated), `${entry.qlId}: reviewed generation is not deterministic for ${seed}.`);
    assert(reviewed.editorialReview.status === "APPROVED", `${entry.qlId}: AI editorial status is not approved.`);
    assert(reviewed.validation.valid, `${entry.qlId}: reviewed validation failed.`);
    assert(reviewed.verification.valid, `${entry.qlId}: reviewed independent verification failed.`);
    assert(reviewed.options.length === 4, `${entry.qlId}: reviewed question does not have four options.`);
    assert(reviewed.options.filter((option: any) => option.isCorrect).length === 1, `${entry.qlId}: reviewed question must have exactly one correct option.`);
    assert(new Set(reviewed.options.map((option: any) => answerKey(option.value))).size === 4, `${entry.qlId}: reviewed question has mathematically equivalent options.`);
    assert(reviewed.correctIndex >= 0 && reviewed.correctIndex < 4, `${entry.qlId}: invalid reviewed correctIndex.`);
    assert(reviewed.options[reviewed.correctIndex].isCorrect, `${entry.qlId}: reviewed correctIndex is misaligned.`);
    assert(!reviewed.publiclyPublishable, `${entry.qlId}: public publication lock opened during editorial review.`);
    assert(!reviewed.questionStudioDiscoverable, `${entry.qlId}: Question Studio lock opened during editorial review.`);
    assert(reviewed.testEligibility === "INELIGIBLE", `${entry.qlId}: Test Builder eligibility opened during editorial review.`);
    assert(reviewed.questionBankStatus === "NOT_STORED", `${entry.qlId}: reviewed question entered the question bank.`);
    assert(!/\b(opposite|adjacent)\s*=/.test(reviewed.stem), `${entry.qlId}: stem still exposes internal assignment prose.`);
    assert(!/\busing\s+(2\s*sin|cos²)/i.test(reviewed.stem), `${entry.qlId}: stem still prescribes the intended method.`);
    assert(reviewed.stem.length <= 240, `${entry.qlId}: symbolic stem is too long after editorial review.`);

    const minSteps = reviewed.difficulty === "Hard" ? 3 : reviewed.difficulty === "Medium" ? 2 : 1;
    assert(reviewed.explanation.steps.length >= minSteps, `${entry.qlId}: explanation depth is too low for ${reviewed.difficulty}.`);
    assert(reviewed.explanation.keyRule.length >= 8, `${entry.qlId}: explanation key rule is too weak.`);
    assert(reviewed.explanation.traps.length >= 1, `${entry.qlId}: explanation needs at least one useful trap.`);

    if (!INTENTIONAL_MATH_REPLACEMENTS.has(entry.qlId)) {
      assert(answerKey(reviewed.exactAnswer) === answerKey(engineering.exactAnswer), `${entry.qlId}: non-replacement exact answer changed during editorial review.`);
      const reviewedOptionSet = [...reviewed.options.map((option: any) => answerKey(option.value))].sort().join("|");
      const engineeringOptionSet = [...engineering.options.map((option: any) => answerKey(option.value))].sort().join("|");
      assert(reviewedOptionSet === engineeringOptionSet, `${entry.qlId}: non-replacement option mathematics changed during editorial review.`);
    }

    stems.add(reviewed.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2 || entry.qlId === "TRG-001-QL-075" || entry.qlId === "TRG-001-QL-076", `${entry.qlId}: reviewed surface lacks expected seed diversity.`);
}

for (const qlId of ["TRG-001-QL-103", "TRG-001-QL-104", "TRG-001-QL-107", "TRG-001-QL-108"]) {
  for (const seed of canonicalSeeds) {
    const question = generateReviewedTrg001MvpQuestion(qlId, seed);
    assert(!/θ\s*=/.test(question.stem), `${qlId}: conjugate stem still leaks the standard angle.`);
  }
}

for (const seed of canonicalSeeds) {
  assert(/sin²\d+° \+ cos²\d+°/.test(generateReviewedTrg001MvpQuestion("TRG-001-QL-034", seed).stem), "QL-034 reviewed replacement missing.");
  assert(/cos²θ/.test(generateReviewedTrg001MvpQuestion("TRG-001-QL-073", seed).stem), "QL-073 reviewed identity target missing.");
  assert(/tan²θ/.test(generateReviewedTrg001MvpQuestion("TRG-001-QL-080", seed).stem), "QL-080 reviewed reverse identity target missing.");
  assert(/sin θ \+ cos θ/.test(generateReviewedTrg001MvpQuestion("TRG-001-QL-102", seed).stem), "QL-102 reviewed derived-sum target missing.");
  assert(/find sin 2θ/i.test(generateReviewedTrg001MvpQuestion("TRG-001-QL-129", seed).stem), "QL-129 reviewed ratio-based double-angle target missing.");
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-reviewed-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllReviewedTrg001MvpQuestions(seed);
  assert(questions.length === 72, `${seed}: reviewed MVP did not generate all 72 QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId}: reviewed sweep validation failed for ${seed}.`);
    assert(question.verification.valid, `${question.qlId}: reviewed sweep verification failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 reviewed MVP gates passed: 72 QLs, ${canonicalCases} canonical cases, ${sweepCases} sweep cases, 5 semantic replacements.`);
