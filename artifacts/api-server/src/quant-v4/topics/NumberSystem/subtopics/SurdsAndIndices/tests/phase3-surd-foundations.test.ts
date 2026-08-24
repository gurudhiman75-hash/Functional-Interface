import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import {
  SRI_PHASE3_SURD_FOUNDATION_CANDIDATES,
  generateSriPhase3SurdFoundationCandidate,
} from "../SRI-002/phase3-surd-foundations";

const SEEDS_PER_CANDIDATE = 80;
const EXPECTED_CANDIDATES = 23;

assert.equal(SRI_PHASE3_SURD_FOUNDATION_CANDIDATES.length, EXPECTED_CANDIDATES, "Phase 3 must expose all 23 CP007-009 candidates");
assert.equal(new Set(SRI_PHASE3_SURD_FOUNDATION_CANDIDATES.map((item) => item.candidateId)).size, EXPECTED_CANDIDATES, "Phase 3 candidate IDs must be unique");
assert.equal(SRI_002_MANIFEST.provisionalCandidateCount, EXPECTED_CANDIDATES);
assert.equal(SRI_002_MANIFEST.discoveryWaves.phase3SurdFoundations, EXPECTED_CANDIDATES);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 0);
assert.equal(SRI_002_MANIFEST.frozenSolveModeCount, 0);
assert.deepEqual(SRI_002_MANIFEST.activeExecutableDiscoveryCheckpoints, ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009"]);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.questionStudio, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.questionBank, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.tests, false);
assert.equal(SRI_002_MANIFEST.downstreamEligibility.public, false);
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
for (const checkpointId of ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009"] as const) {
  assert.ok(SRI_CHAPTER_MANIFEST.executableDiscoveryCheckpoints.includes(checkpointId), `${checkpointId} must be executable discovery`);
}
assertSriReleaseLocks();

const expectedCheckpointCounts = new Map([
  ["SRI-CP-007", 6],
  ["SRI-CP-008", 8],
  ["SRI-CP-009", 9],
]);
for (const [checkpointId, expected] of expectedCheckpointCounts) {
  assert.equal(SRI_PHASE3_SURD_FOUNDATION_CANDIDATES.filter((item) => item.checkpointId === checkpointId).length, expected, `${checkpointId} candidate count mismatch`);
}

let generated = 0;
const checkpointCounts = new Map<string, number>();
const candidateStemDiversity = new Map<string, Set<string>>();
const optionPositions = new Map<string, Set<number>>();
const answerDiversity = new Map<string, Set<string>>();

for (const descriptor of SRI_PHASE3_SURD_FOUNDATION_CANDIDATES) {
  const stems = new Set<string>();
  const positions = new Set<number>();
  const answers = new Set<string>();

  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `SRI-PHASE3:${descriptor.candidateId}:${index}`;
    let question;
    let repeat;
    try {
      question = generateSriPhase3SurdFoundationCandidate(descriptor.candidateId, seed);
      repeat = generateSriPhase3SurdFoundationCandidate(descriptor.candidateId, seed);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`${descriptor.candidateId} failed generation for seed ${seed}: ${detail}`);
    }
    generated += 1;

    assert.deepEqual(repeat, question, `${descriptor.candidateId} is not deterministic for seed ${index}`);
    assert.equal(question.status, "PROVISIONAL_DISCOVERY");
    assert.equal(question.packageId, "SRI-002");
    assert.equal(question.checkpointId, descriptor.checkpointId);
    assert.equal(question.candidateId, descriptor.candidateId);
    assert.equal(question.seed, seed);
    assert.deepEqual(validateSriDiscoveryQuestion(question), [], `${descriptor.candidateId} failed discovery validation`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.canonicalKey)).size, 4, `${descriptor.candidateId} has duplicate canonical options`);
    assert.equal(question.options.filter((option) => option.canonicalKey === question.answer.canonicalKey).length, 1, `${descriptor.candidateId} does not have exactly one correct option`);
    assert.equal(question.options[question.correctIndex]?.canonicalKey, question.answer.canonicalKey);
    assert.equal(question.verification.solverVerifierAgree, true, `${descriptor.candidateId} solver/verifier mismatch`);
    assert.equal(question.verification.exactlyOneCorrectOption, true);
    assert.equal(question.verification.domainValid, true, `${descriptor.candidateId} generated an inadmissible state`);
    assert.equal(question.proofEvents.some((event) => event.kind === "INDEPENDENT_VERIFY"), true);
    assert.ok(question.stem.trim().length > 8, `${descriptor.candidateId} stem is too short`);
    assert.equal(question.stem.includes("undefined"), false);
    assert.equal(question.stem.includes("NaN"), false);
    assert.equal(question.stem.includes("\\frac}"), false, `${descriptor.candidateId} contains malformed fraction TeX`);
    assert.ok(question.explanation.given.trim().length > 0);
    assert.ok(question.explanation.asked.trim().length > 0);
    assert.ok(question.explanation.method.trim().length > 0);
    assert.ok(question.explanation.working.length > 0);
    assert.equal(question.explanation.answer, question.answer.text);
    assert.notEqual(normalize(question.explanation.given), normalize(question.stem), `${descriptor.candidateId} explanation repeats the complete stem`);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3, `${descriptor.candidateId} must expose exactly three misconception-backed distractors`);

    if (descriptor.candidateId === "C007-F") {
      const normalizedExponentKeys = question.options.map((option) => normalizeExponentKey(option.canonicalKey));
      assert.equal(new Set(normalizedExponentKeys).size, 4, "C007-F must not contain equivalent exponents under unreduced canonical keys");
    }

    stems.add(question.stem);
    positions.add(question.correctIndex);
    answers.add(question.answer.canonicalKey);
    checkpointCounts.set(question.checkpointId, (checkpointCounts.get(question.checkpointId) ?? 0) + 1);
  }

  candidateStemDiversity.set(descriptor.candidateId, stems);
  optionPositions.set(descriptor.candidateId, positions);
  answerDiversity.set(descriptor.candidateId, answers);
  assert.ok(stems.size >= 3, `${descriptor.candidateId} stem pool is too thin: ${stems.size} unique stems in ${SEEDS_PER_CANDIDATE} seeds`);
  assert.ok(positions.size >= 3, `${descriptor.candidateId} correct-option placement is too concentrated: ${[...positions].join(",")}`);
}

assert.equal(generated, EXPECTED_CANDIDATES * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-007"), 6 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-008"), 8 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-009"), 9 * SEEDS_PER_CANDIDATE);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  candidateCount: EXPECTED_CANDIDATES,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  minUniqueStems: Math.min(...[...candidateStemDiversity.values()].map((set) => set.size)),
  minCorrectOptionPositions: Math.min(...[...optionPositions.values()].map((set) => set.size)),
  minDistinctAnswers: Math.min(...[...answerDiversity.values()].map((set) => set.size)),
  permanentQlCount: SRI_002_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_002_MANIFEST.frozenSolveModeCount,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}

function normalizeExponentKey(key: string): string {
  if (!key.startsWith("E:")) return key;
  const match = /^E:(-?\d+)\/(\d+)$/.exec(key);
  if (!match) return key;
  let numerator = BigInt(match[1]!);
  let denominator = BigInt(match[2]!);
  const gcd = (a: bigint, b: bigint): bigint => {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) [x, y] = [y, x % y];
    return x === 0n ? 1n : x;
  };
  const d = gcd(numerator, denominator);
  numerator /= d;
  denominator /= d;
  return `E:${numerator}/${denominator}`;
}
