import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";
import {
  SRI_PHASE2_POWER_RELATION_CANDIDATES,
  generateSriPhase2PowerRelationCandidate,
} from "../SRI-001/phase2-power-relations";

const SEEDS_PER_CANDIDATE = 80;
const EXPECTED_PHASE2_CANDIDATES = 23;
const EXPECTED_TOTAL_SRI001_CANDIDATES = 48;

assert.equal(SRI_PHASE2_POWER_RELATION_CANDIDATES.length, EXPECTED_PHASE2_CANDIDATES, "Phase 2 must expose all 23 CP004-006 candidates");
assert.equal(new Set(SRI_PHASE2_POWER_RELATION_CANDIDATES.map((item) => item.candidateId)).size, EXPECTED_PHASE2_CANDIDATES, "Phase 2 candidate IDs must be unique");
assert.equal(SRI_001_MANIFEST.provisionalCandidateCount, EXPECTED_TOTAL_SRI001_CANDIDATES);
assert.equal(SRI_001_MANIFEST.discoveryWaves.phase1PowerFoundations, 25);
assert.equal(SRI_001_MANIFEST.discoveryWaves.phase2PowerRelations, 23);
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_001_MANIFEST.frozenSolveModeCount, 0);
assert.deepEqual(SRI_001_MANIFEST.activeExecutableDiscoveryCheckpoints, ["SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006"]);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.questionStudio, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.questionBank, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.tests, false);
assert.equal(SRI_001_MANIFEST.downstreamEligibility.public, false);
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
  ["SRI-CP-004", 7],
  ["SRI-CP-005", 9],
  ["SRI-CP-006", 7],
]);
for (const [checkpointId, expected] of expectedCheckpointCounts) {
  assert.equal(SRI_PHASE2_POWER_RELATION_CANDIDATES.filter((item) => item.checkpointId === checkpointId).length, expected, `${checkpointId} candidate count mismatch`);
}

let generated = 0;
const checkpointCounts = new Map<string, number>();
const candidateStemDiversity = new Map<string, Set<string>>();
const optionPositions = new Map<string, Set<number>>();
const answerDiversity = new Map<string, Set<string>>();

for (const descriptor of SRI_PHASE2_POWER_RELATION_CANDIDATES) {
  const stems = new Set<string>();
  const positions = new Set<number>();
  const answers = new Set<string>();

  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `SRI-PHASE2:${descriptor.candidateId}:${index}`;
    let question;
    let repeat;
    try {
      question = generateSriPhase2PowerRelationCandidate(descriptor.candidateId, seed);
      repeat = generateSriPhase2PowerRelationCandidate(descriptor.candidateId, seed);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`${descriptor.candidateId} failed generation for seed ${seed}: ${detail}`);
    }
    generated += 1;

    assert.deepEqual(repeat, question, `${descriptor.candidateId} is not deterministic for seed ${index}`);
    assert.equal(question.status, "PROVISIONAL_DISCOVERY");
    assert.equal(question.packageId, "SRI-001");
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
    assert.equal(question.verification.deterministic, true);
    assert.equal(question.proofEvents.some((event) => event.kind === "INDEPENDENT_VERIFY"), true);
    assert.ok(question.stem.trim().length > 8, `${descriptor.candidateId} stem is too short`);
    assert.equal(question.stem.includes("undefined"), false);
    assert.equal(question.stem.includes("NaN"), false);
    assert.ok(question.explanation.given.trim().length > 0);
    assert.ok(question.explanation.asked.trim().length > 0);
    assert.ok(question.explanation.method.trim().length > 0);
    assert.ok(question.explanation.working.length > 0);
    assert.equal(question.explanation.answer, question.answer.text);
    assert.notEqual(normalize(question.explanation.given), normalize(question.stem), `${descriptor.candidateId} explanation repeats the complete stem`);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3, `${descriptor.candidateId} must expose exactly three misconception-backed distractors`);

    if (descriptor.candidateId === "C005-F") {
      assert.ok(typeof question.state.companionRoot === "string", "C005-F must record its deliberately non-power companion root");
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

assert.equal(generated, EXPECTED_PHASE2_CANDIDATES * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-004"), 7 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-005"), 9 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-006"), 7 * SEEDS_PER_CANDIDATE);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  candidateCount: EXPECTED_PHASE2_CANDIDATES,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  minUniqueStems: Math.min(...[...candidateStemDiversity.values()].map((set) => set.size)),
  minCorrectOptionPositions: Math.min(...[...optionPositions.values()].map((set) => set.size)),
  minDistinctAnswers: Math.min(...[...answerDiversity.values()].map((set) => set.size)),
  sri001ProvisionalCandidateCount: SRI_001_MANIFEST.provisionalCandidateCount,
  permanentQlCount: SRI_001_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_001_MANIFEST.frozenSolveModeCount,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}
