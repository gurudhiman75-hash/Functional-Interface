import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_PRODUCTION_ADDITIONAL_REGISTRY,
  TRG_001_PRODUCTION_REGISTRY,
} from "./production-runtime";
import {
  candidateProductionFingerprint,
  generateAllCandidateTrg001ProductionQuestions,
  generateCandidateTrg001ProductionQuestion,
} from "./production-candidate-runtime";
import { TRG_001_MVP_REGISTRY } from "./mvp-runtime";
import {
  generateReviewedTrg001MvpQuestion,
  reviewedMvpFingerprint,
} from "./mvp-reviewed-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

assert(TRG_001_MVP_REGISTRY.length === 72, "Reviewed MVP anchor must remain 72 QLs.");
assert(TRG_001_PRODUCTION_ADDITIONAL_REGISTRY.length === 72, "Production expansion must add exactly 72 QLs.");
assert(TRG_001_PRODUCTION_REGISTRY.length === 144, "TRG-001 production registry must contain exactly 144 QLs.");
assert(new Set(TRG_001_PRODUCTION_REGISTRY.map((entry) => entry.qlId)).size === 144, "All production QL IDs must be unique.");
assert(new Set(TRG_001_PRODUCTION_REGISTRY.map((entry) => entry.solveMode)).size === 144, "All production solve modes must be distinct.");

const fullRanges: Record<string, [number, number]> = {
  "TRG-CP-001": [1, 24],
  "TRG-CP-002": [25, 48],
  "TRG-CP-003": [49, 72],
  "TRG-CP-004": [73, 96],
  "TRG-CP-005": [97, 120],
  "TRG-CP-006": [121, 144],
};
const expansionRanges: Record<string, [number, number]> = {
  "TRG-CP-001": [13, 24],
  "TRG-CP-002": [37, 48],
  "TRG-CP-003": [61, 72],
  "TRG-CP-004": [85, 96],
  "TRG-CP-005": [109, 120],
  "TRG-CP-006": [133, 144],
};

for (const [cpId, [min, max]] of Object.entries(fullRanges)) {
  const entries = TRG_001_PRODUCTION_REGISTRY.filter((entry) => entry.cpId === cpId);
  assert(entries.length === 24, `${cpId} must contain exactly 24 production QLs.`);
  for (const entry of entries) {
    const number = Number(entry.qlId.slice(-3));
    assert(number >= min && number <= max, `${entry.qlId} falls outside the locked Phase 0 range for ${cpId}.`);
  }
}

for (const [cpId, [min, max]] of Object.entries(expansionRanges)) {
  const entries = TRG_001_PRODUCTION_ADDITIONAL_REGISTRY.filter((entry) => entry.cpId === cpId);
  assert(entries.length === 12, `${cpId} must add exactly 12 production-expansion QLs.`);
  for (const entry of entries) {
    const number = Number(entry.qlId.slice(-3));
    assert(number >= min && number <= max, `${entry.qlId} falls outside the remaining production range for ${cpId}.`);
  }
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-production-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;
let preservedMvpCases = 0;

for (const entry of TRG_001_PRODUCTION_REGISTRY) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const first = generateCandidateTrg001ProductionQuestion(entry.qlId, seed);
    const second = generateCandidateTrg001ProductionQuestion(entry.qlId, seed);

    assert(candidateProductionFingerprint(first) === candidateProductionFingerprint(second), `${entry.qlId} is not deterministic for ${seed}.`);
    assert(first.validation.valid, `${entry.qlId} failed production validation.`);
    assert(first.verification.valid, `${entry.qlId} failed independent/theorem verification.`);
    assert(first.options.length === 4, `${entry.qlId} must have exactly four options.`);
    assert(first.options.filter((option: any) => option.isCorrect).length === 1, `${entry.qlId} must have exactly one correct option.`);
    assert(new Set(first.options.map((option: any) => answerKey(option.value))).size === 4, `${entry.qlId} has mathematically equivalent option duplicates.`);
    assert(new Set(first.options.map((option: any) => option.display)).size === 4, `${entry.qlId} has duplicate rendered options.`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4, `${entry.qlId} has an invalid correctIndex.`);
    assert(first.options[first.correctIndex].isCorrect, `${entry.qlId} correctIndex does not identify the correct option.`);
    assert(first.questionBankStatus === "NOT_STORED", `${entry.qlId} must remain outside the question bank.`);
    assert(first.testEligibility === "INELIGIBLE", `${entry.qlId} must remain test-ineligible.`);
    assert(!first.publiclyPublishable, `${entry.qlId} must remain non-public.`);
    assert(!first.questionStudioDiscoverable, `${entry.qlId} must remain hidden from Question Studio.`);
    assert(!/[{}]\\w+|\\{\\{/.test(first.stem), `${entry.qlId} contains an unresolved placeholder.`);
    const minimumSteps = first.difficulty === "Hard" ? 3 : first.difficulty === "Medium" ? 2 : 1;
    assert(first.explanation.steps.length >= minimumSteps, `${entry.qlId} explanation is too shallow for ${first.difficulty}.`);
    assert(first.explanation.keyRule.length >= 10, `${entry.qlId} key rule is too weak.`);

    if (entry.phase === "REVIEWED_MVP") {
      const directReviewed = generateReviewedTrg001MvpQuestion(entry.qlId, seed);
      assert(reviewedMvpFingerprint(first) === reviewedMvpFingerprint(directReviewed), `${entry.qlId} changed while being carried into production.`);
      assert(first.reviewStatus === "APPROVED", `${entry.qlId} lost its reviewed MVP status.`);
      preservedMvpCases += 1;
    } else {
      assert(first.productionOnly, `${entry.qlId} must carry the production-only marker.`);
      assert(first.reviewStatus === "UNREVIEWED", `${entry.qlId} must remain unreviewed before the production editorial pass.`);
      assert(first.aiEditorialStatus === "PENDING", `${entry.qlId} must remain AI-editorial pending.`);
      assert(first.humanReviewStatus === "PENDING", `${entry.qlId} must remain human-review pending.`);
    }

    stems.add(first.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${entry.qlId} did not produce at least two distinct stems across 12 canonical seeds.`);
}

const halfDegreeCandidate = canonicalSeeds
  .map((seed) => generateCandidateTrg001ProductionQuestion("TRG-001-QL-062", seed))
  .find((question) => Number(question.canonicalState.degrees) === 225);
assert(halfDegreeCandidate, "QL-062 canonical seeds must cover the 225° case.");
assert(
  halfDegreeCandidate.options.some((option: any) => option.value.kind === "ANGLE" && toDegrees(option.value.value).numerator === 225n && toDegrees(option.value.value).denominator === 2n),
  "QL-062 must represent the 112.5° distractor as exact 225/2 degrees.",
);

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-production-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllCandidateTrg001ProductionQuestions(seed);
  assert(questions.length === 144, `Seed ${seed} did not generate all 144 TRG-001 questions.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed sweep validation for ${seed}.`);
    assert(question.verification.valid, `${question.qlId} failed sweep verification for ${seed}.`);
    assert(question.options.length === 4, `${question.qlId} lost its four-option contract for ${seed}.`);
    assert(new Set(question.options.map((option: any) => answerKey(option.value))).size === 4, `${question.qlId} produced an equivalent option collision for ${seed}.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${question.qlId} correctIndex failed for ${seed}.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", `${question.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(
  `TRG-001 production gates passed: 144 QLs, ${canonicalCases} canonical deterministic cases, ${preservedMvpCases} reviewed-MVP preservation cases, ${sweepCases} full sweep cases.`,
);
