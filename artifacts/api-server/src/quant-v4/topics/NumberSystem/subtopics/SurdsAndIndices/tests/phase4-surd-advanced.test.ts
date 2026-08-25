import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import {
  SRI_PHASE4_SURD_ADVANCED_CANDIDATES,
  generateSriPhase4SurdAdvancedCandidate,
} from "../SRI-002/phase4-surd-advanced";

const SEEDS_PER_CANDIDATE = 80;
const EXPECTED_CANDIDATES = 20;
const PHASE4_BASELINE_SRI002_TOTAL = 43;

assert.equal(SRI_PHASE4_SURD_ADVANCED_CANDIDATES.length, EXPECTED_CANDIDATES, "Phase 4 must expose all 20 CP010-012 candidates");
assert.equal(new Set(SRI_PHASE4_SURD_ADVANCED_CANDIDATES.map((item) => item.candidateId)).size, EXPECTED_CANDIDATES, "Phase 4 candidate IDs must be unique");
assert.ok(SRI_002_MANIFEST.provisionalCandidateCount >= PHASE4_BASELINE_SRI002_TOTAL, "later saturation waves may grow SRI-002 but cannot remove the Phase-4 baseline");
assert.equal(SRI_002_MANIFEST.discoveryWaves.phase3SurdFoundations, 23);
assert.equal(SRI_002_MANIFEST.discoveryWaves.phase4SurdAdvanced, 20);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_002_MANIFEST.frozenSolveModeCount, 0);
assert.deepEqual(SRI_002_MANIFEST.activeExecutableDiscoveryCheckpoints, ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012"]);
assert.equal(SRI_CHAPTER_MANIFEST.executableDiscoveryCheckpoints.length, 12, "All SRI checkpoints must remain executable discovery evidence during Phase 7");
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.discoveryOpen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioGenerationEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled, false);
assertSriReleaseLocks();

const expectedCheckpointCounts = new Map([
  ["SRI-CP-010", 6],
  ["SRI-CP-011", 9],
  ["SRI-CP-012", 5],
]);
for (const [checkpointId, expected] of expectedCheckpointCounts) {
  assert.equal(SRI_PHASE4_SURD_ADVANCED_CANDIDATES.filter((item) => item.checkpointId === checkpointId).length, expected, `${checkpointId} candidate count mismatch`);
}

let generated = 0;
const checkpointCounts = new Map<string, number>();
const candidateStemDiversity = new Map<string, Set<string>>();
const optionPositions = new Map<string, Set<number>>();
const answerDiversity = new Map<string, Set<string>>();

for (const descriptor of SRI_PHASE4_SURD_ADVANCED_CANDIDATES) {
  const stems = new Set<string>();
  const positions = new Set<number>();
  const answers = new Set<string>();

  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `SRI-PHASE4:${descriptor.candidateId}:${index}`;
    let question;
    let repeat;
    try {
      question = generateSriPhase4SurdAdvancedCandidate(descriptor.candidateId, seed);
      repeat = generateSriPhase4SurdAdvancedCandidate(descriptor.candidateId, seed);
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
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3, `${descriptor.candidateId} must expose exactly three misconception-backed distractors`);
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

    if (descriptor.candidateId === "C010-C") {
      assert.ok(typeof question.state.discriminant === "string", "C010-C must carry the exact denesting discriminant");
    }
    if (descriptor.candidateId === "C010-F") {
      assert.equal(descriptor.sourceDisposition, "SOURCE_GATED", "Infinite-radical candidate must preserve its discovery-time source-gated provenance");
    }
    if (descriptor.candidateId === "C011-H") {
      assert.ok(typeof question.state.extraneous === "number" && typeof question.state.valid === "number", "C011-H must retain both squared-equation candidates");
      assert.notEqual(question.state.extraneous, question.state.valid);
      assert.equal(question.answer.text, String(question.state.extraneous));
    }
    if (descriptor.candidateId === "C012-C") {
      assert.equal(question.answer.canonicalKey, "T:EQUAL", "C012-C is an exact representation-equivalence contract");
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
assert.equal(checkpointCounts.get("SRI-CP-010"), 6 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-011"), 9 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-012"), 5 * SEEDS_PER_CANDIDATE);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  candidateCount: EXPECTED_CANDIDATES,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  minUniqueStems: Math.min(...[...candidateStemDiversity.values()].map((set) => set.size)),
  minCorrectOptionPositions: Math.min(...[...optionPositions.values()].map((set) => set.size)),
  minDistinctAnswers: Math.min(...[...answerDiversity.values()].map((set) => set.size)),
  sri002ProvisionalCandidateCount: SRI_002_MANIFEST.provisionalCandidateCount,
  permanentQlCount: SRI_002_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_002_MANIFEST.frozenSolveModeCount,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}
