import {
  TRG_001_PROOF_CP_IDS,
  TRG_001_RUNTIME_PROOF_REGISTRY,
  generateAllTrg001RuntimeProofQuestions,
  generateTrg001RuntimeProofQuestion,
  proofQuestionFingerprint,
} from "./runtime-proof";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TRG_001_RUNTIME_PROOF_REGISTRY.length === 30, "Runtime proof must contain exactly 30 QLs.");
assert(new Set(TRG_001_RUNTIME_PROOF_REGISTRY.map((entry) => entry.qlId)).size === 30, "Proof QL IDs must be unique.");
assert(new Set(TRG_001_RUNTIME_PROOF_REGISTRY.map((entry) => entry.solveMode)).size === 30, "Each proof QL must exercise a distinct solve mode.");

for (const cpId of TRG_001_PROOF_CP_IDS) {
  const cpEntries = TRG_001_RUNTIME_PROOF_REGISTRY.filter((entry) => entry.cpId === cpId);
  assert(cpEntries.length === 5, `${cpId} must contribute exactly five runtime-proof QLs.`);
}

const expectedRanges: Record<string, [number, number]> = {
  "TRG-CP-001": [1, 5],
  "TRG-CP-002": [25, 29],
  "TRG-CP-003": [49, 53],
  "TRG-CP-004": [73, 77],
  "TRG-CP-005": [97, 101],
  "TRG-CP-006": [121, 125],
};

for (const entry of TRG_001_RUNTIME_PROOF_REGISTRY) {
  const number = Number(entry.qlId.slice(-3));
  const [min, max] = expectedRanges[entry.cpId];
  assert(number >= min && number <= max, `${entry.qlId} falls outside its Phase 0 CP allocation.`);
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-proof-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const entry of TRG_001_RUNTIME_PROOF_REGISTRY) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const first = generateTrg001RuntimeProofQuestion(entry.qlId, seed);
    const second = generateTrg001RuntimeProofQuestion(entry.qlId, seed);

    assert(proofQuestionFingerprint(first) === proofQuestionFingerprint(second), `${entry.qlId} is not deterministic for seed ${seed}.`);
    assert(first.validation.valid, `${entry.qlId} failed final validation.`);
    assert(first.verification.valid, `${entry.qlId} failed independent verification.`);
    assert(first.options.length === 4, `${entry.qlId} does not have four options.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${entry.qlId} must have one correct option.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${entry.qlId} has duplicate rendered options.`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4, `${entry.qlId} has an invalid correct index.`);
    assert(first.options[first.correctIndex].isCorrect, `${entry.qlId} correctIndex does not point to the correct option.`);
    assert(!first.publiclyPublishable, `${entry.qlId} must remain non-publishable.`);
    assert(!first.questionStudioDiscoverable, `${entry.qlId} must remain hidden from Question Studio.`);
    assert(first.testEligibility === "INELIGIBLE", `${entry.qlId} must remain test-ineligible.`);
    assert(first.questionBankStatus === "NOT_STORED", `${entry.qlId} must not enter the question bank.`);
    assert(first.reviewStatus === "UNREVIEWED", `${entry.qlId} must remain unreviewed until human review.`);
    assert(first.proofOnly, `${entry.qlId} must carry the proof-only lock.`);
    assert(!/[{}]\w+|\{\{/.test(first.stem), `${entry.qlId} contains an unresolved placeholder.`);
    assert(first.explanation.steps.length >= 1, `${entry.qlId} explanation has no reasoning steps.`);
    assert(first.explanation.keyRule.length >= 12, `${entry.qlId} explanation key rule is too weak.`);
    assert(!/\d+\.\d{4,}/.test(first.answer), `${entry.qlId} leaked an approximate decimal answer.`);

    stems.add(first.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${entry.qlId} did not vary its stem across the 12 canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-proof-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllTrg001RuntimeProofQuestions(seed);
  assert(questions.length === 30, `Seed ${seed} did not generate all 30 proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed sweep validation for ${seed}.`);
    assert(question.verification.valid, `${question.qlId} failed sweep verification for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 runtime proof passed: 30 QLs, ${canonicalCases} canonical deterministic cases, ${sweepCases} sweep cases.`);
