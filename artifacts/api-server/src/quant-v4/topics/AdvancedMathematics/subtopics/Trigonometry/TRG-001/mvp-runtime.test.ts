import {
  TRG_001_MVP_ADDITIONAL_REGISTRY,
  TRG_001_MVP_REGISTRY,
  generateAllTrg001MvpQuestions,
  generateTrg001MvpQuestion,
  mvpQuestionFingerprint,
} from "./mvp-runtime";
import { TRG_001_PROOF_CP_IDS, TRG_001_RUNTIME_PROOF_REGISTRY } from "./runtime-proof";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TRG_001_RUNTIME_PROOF_REGISTRY.length === 30, "The 30 proof anchors must remain unchanged.");
assert(TRG_001_MVP_ADDITIONAL_REGISTRY.length === 42, "MVP expansion must add exactly 42 QLs.");
assert(TRG_001_MVP_REGISTRY.length === 72, "TRG-001 MVP must contain exactly 72 QLs.");
assert(new Set(TRG_001_MVP_REGISTRY.map((entry) => entry.qlId)).size === 72, "MVP QL IDs must be unique.");
assert(new Set(TRG_001_MVP_REGISTRY.map((entry) => entry.solveMode)).size === 72, "MVP solve modes must be distinct.");

const expectedRanges: Record<string, [number, number]> = {
  "TRG-CP-001": [1, 12],
  "TRG-CP-002": [25, 36],
  "TRG-CP-003": [49, 60],
  "TRG-CP-004": [73, 84],
  "TRG-CP-005": [97, 108],
  "TRG-CP-006": [121, 132],
};

for (const cpId of TRG_001_PROOF_CP_IDS) {
  const cpEntries = TRG_001_MVP_REGISTRY.filter((entry) => entry.cpId === cpId);
  assert(cpEntries.length === 12, `${cpId} must contain exactly 12 MVP QLs.`);
  const [min, max] = expectedRanges[cpId];
  for (const entry of cpEntries) {
    const number = Number(entry.qlId.slice(-3));
    assert(number >= min && number <= max, `${entry.qlId} falls outside the MVP allocation for ${cpId}.`);
  }
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-mvp-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const entry of TRG_001_MVP_REGISTRY) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const first = generateTrg001MvpQuestion(entry.qlId, seed);
    const second = generateTrg001MvpQuestion(entry.qlId, seed);
    assert(mvpQuestionFingerprint(first) === mvpQuestionFingerprint(second), `${entry.qlId} is not deterministic for ${seed}.`);
    assert(first.validation.valid, `${entry.qlId} failed final validation.`);
    assert(first.verification.valid, `${entry.qlId} failed independent verification.`);
    assert(first.options.length === 4, `${entry.qlId} does not have four options.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${entry.qlId} must have exactly one correct option.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${entry.qlId} has duplicate rendered options.`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4, `${entry.qlId} has an invalid correctIndex.`);
    assert(first.options[first.correctIndex].isCorrect, `${entry.qlId} correctIndex does not point to the correct option.`);
    assert(first.reviewStatus === "UNREVIEWED", `${entry.qlId} must remain unreviewed before editorial review.`);
    assert(first.questionBankStatus === "NOT_STORED", `${entry.qlId} must remain outside the question bank.`);
    assert(first.testEligibility === "INELIGIBLE", `${entry.qlId} must remain test-ineligible.`);
    assert(!first.publiclyPublishable, `${entry.qlId} must remain non-public.`);
    assert(!first.questionStudioDiscoverable, `${entry.qlId} must remain hidden from Question Studio.`);
    assert(!/[{}]\\w+|\\{\\{/.test(first.stem), `${entry.qlId} contains an unresolved placeholder.`);
    assert(first.explanation.steps.length >= 1, `${entry.qlId} explanation has no reasoning step.`);
    assert(first.explanation.keyRule.length >= 10, `${entry.qlId} key rule is too weak.`);
    assert(!/\d+\.\d{4,}/.test(first.answer), `${entry.qlId} leaked an approximate decimal answer.`);
    if (first.proofOnly) {
      assert(entry.phase === "PROOF", `${entry.qlId} proof anchor lost its phase tag.`);
    } else {
      assert(entry.phase === "MVP_EXPANSION", `${entry.qlId} MVP expansion has the wrong phase tag.`);
      assert(first.mvpOnly, `${entry.qlId} must carry the MVP-only lock.`);
    }
    stems.add(first.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${entry.qlId} did not vary its stem across 12 canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-mvp-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllTrg001MvpQuestions(seed);
  assert(questions.length === 72, `Seed ${seed} did not generate all 72 MVP QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed sweep validation for ${seed}.`);
    assert(question.verification.valid, `${question.qlId} failed sweep verification for ${seed}.`);
    assert(new Set(question.options.map((option) => option.display)).size === 4, `${question.qlId} produced duplicate options for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 MVP gates passed: 72 QLs, ${canonicalCases} canonical deterministic cases, ${sweepCases} sweep cases.`);
