import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_002_RUNTIME_PROOF_IDS,
  TRG_002_RUNTIME_PROOF_REGISTRY,
  generateAllTrg002RuntimeProofQuestions,
  generateTrg002RuntimeProofQuestion,
  trg002ProofFingerprint,
} from "./runtime-proof";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

const expectedIds = [
  "TRG-002-QL-001","TRG-002-QL-007","TRG-002-QL-012","TRG-002-QL-015","TRG-002-QL-023",
  "TRG-002-QL-025","TRG-002-QL-030","TRG-002-QL-033","TRG-002-QL-036","TRG-002-QL-045",
  "TRG-002-QL-049","TRG-002-QL-056","TRG-002-QL-061","TRG-002-QL-065","TRG-002-QL-068",
  "TRG-002-QL-073","TRG-002-QL-078","TRG-002-QL-083","TRG-002-QL-088","TRG-002-QL-092",
];

assert(TRG_002_RUNTIME_PROOF_IDS.length === 20, "TRG-002 proof must contain exactly 20 permanent QLs.");
assert(TRG_002_RUNTIME_PROOF_REGISTRY.length === 20, "TRG-002 proof registry must contain exactly 20 rows.");
assert(new Set(TRG_002_RUNTIME_PROOF_IDS).size === 20, "TRG-002 proof QL IDs must be unique.");
assert(JSON.stringify([...TRG_002_RUNTIME_PROOF_IDS]) === JSON.stringify(expectedIds), "TRG-002 proof permanent-ID sample changed unexpectedly.");
assert(new Set(TRG_002_RUNTIME_PROOF_REGISTRY.map((entry) => entry.solveMode)).size === 20, "All 20 proof QLs must have distinct solve modes.");
assert(new Set(TRG_002_RUNTIME_PROOF_REGISTRY.map((entry) => entry.lockedFamily)).size === 20, "The proof must sample 20 distinct locked families.");

for (const cpId of ["TRG-CP-007","TRG-CP-008","TRG-CP-009","TRG-CP-010"]) {
  assert(TRG_002_RUNTIME_PROOF_REGISTRY.filter((entry) => entry.cpId === cpId).length === 5, `${cpId} must contribute exactly five distributed proof QLs.`);
}

const familyRangeChecks: Array<[string, number, number]> = [
  ["TRG-CP-007",1,24], ["TRG-CP-008",25,48], ["TRG-CP-009",49,72], ["TRG-CP-010",73,96],
];
for (const entry of TRG_002_RUNTIME_PROOF_REGISTRY) {
  const n = Number(entry.qlId.slice(-3));
  const expected = familyRangeChecks.find(([cpId]) => cpId === entry.cpId)!;
  assert(n >= expected[1] && n <= expected[2], `${entry.qlId} falls outside ${entry.cpId}'s permanent range.`);
}

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-proof-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;
for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const first = generateTrg002RuntimeProofQuestion(qlId, seed);
    const second = generateTrg002RuntimeProofQuestion(qlId, seed);

    assert(trg002ProofFingerprint(first) === trg002ProofFingerprint(second), `${qlId} is not deterministic for ${seed}.`);
    assert(first.qlId === qlId, `${qlId} lost its permanent ID.`);
    assert(first.validation.valid, `${qlId} failed runtime-proof validation.`);
    assert(first.verification.spatial.valid, `${qlId} failed independent spatial verification.`);
    assert(first.verification.diagram.valid, `${qlId} failed diagram verification.`);
    assert(first.verification.answer.valid, `${qlId} failed answer reconstruction.`);
    assert(first.options.length === 4, `${qlId} must have exactly four options.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${qlId} must have exactly one correct option.`);
    assert(new Set(first.options.map((option) => answerKey(option.value))).size === 4, `${qlId} has mathematically equivalent options.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${qlId} has duplicate rendered options.`);
    assert(first.options[first.correctIndex]?.isCorrect === true, `${qlId} correctIndex does not point to the correct option.`);
    assert(first.diagram.strategy === first.canonicalSpatialState.diagramStrategy, `${qlId} diagram strategy diverges from canonical spatial state.`);
    assert(first.diagram.angles.length === first.canonicalSpatialState.observations.length, `${qlId} diagram must expose one angle marker per canonical observation.`);
    assert(first.reviewStatus === "UNREVIEWED" && first.aiEditorialStatus === "PENDING" && first.humanReviewStatus === "PENDING", `${qlId} review state must remain pending.`);
    assert(first.questionBankStatus === "NOT_STORED" && first.testEligibility === "INELIGIBLE", `${qlId} storage/test lock failed.`);
    assert(!first.publiclyPublishable && !first.questionStudioDiscoverable, `${qlId} publication/Question Studio lock failed.`);
    assert(first.proofOnly === true, `${qlId} must remain proof-only.`);
    assert(!/[{}]\\w+|\\{\\{/.test(first.stem), `${qlId} contains an unresolved placeholder.`);
    assert(first.answer === first.options[first.correctIndex].display, `${qlId} rendered answer diverges from correct option.`);

    const minSteps = first.difficulty === "Hard" ? 3 : first.difficulty === "Medium" ? 2 : 1;
    assert(first.explanation.steps.length >= minSteps, `${qlId} explanation is too shallow for ${first.difficulty}.`);
    assert(first.explanation.keyRule.length >= 10, `${qlId} key rule is too weak.`);

    stems.add(first.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${qlId} must generate at least two distinct stems across canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-proof-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllTrg002RuntimeProofQuestions(seed);
  assert(questions.length === 20, `Seed ${seed} did not generate all 20 TRG-002 proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed validation in sweep ${seed}.`);
    assert(question.verification.spatial.valid, `${question.qlId} spatial verification failed in ${seed}.`);
    assert(question.verification.diagram.valid, `${question.qlId} diagram verification failed in ${seed}.`);
    assert(question.verification.answer.valid, `${question.qlId} answer verification failed in ${seed}.`);
    assert(new Set(question.options.map((option) => answerKey(option.value))).size === 4, `${question.qlId} produced an option collision in ${seed}.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${question.qlId} correctIndex failed in ${seed}.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", `${question.qlId} activation lock failed in ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-002 runtime proof gates passed: 20 distributed QLs, ${canonicalCases} canonical deterministic cases and ${sweepCases} sweep cases.`);
