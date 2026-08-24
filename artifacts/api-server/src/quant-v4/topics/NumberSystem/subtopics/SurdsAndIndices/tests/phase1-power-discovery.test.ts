import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import {
  SRI_PHASE1_POWER_CANDIDATES,
  generateSriPhase1PowerCandidate,
} from "../SRI-001/phase1-power-discovery";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";

const SEEDS_PER_CANDIDATE = 80;
const EXPECTED_CANDIDATES = 25;

assert.equal(SRI_PHASE1_POWER_CANDIDATES.length, EXPECTED_CANDIDATES, "Phase 1 must expose all 25 provisional CP001-003 candidates");
assert.equal(new Set(SRI_PHASE1_POWER_CANDIDATES.map((item) => item.candidateId)).size, EXPECTED_CANDIDATES, "Candidate IDs must be unique");
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29, "Phase 7 must preserve the 29 allocated SRI-001 permanent identities while Phase 1 discovery remains reproducible");
assert.equal(SRI_001_MANIFEST.frozenSolveModeCount, 0, "Permanent solve modes must remain unfrozen during Phase 7 review");
assert.ok(SRI_001_MANIFEST.provisionalCandidateCount >= EXPECTED_CANDIDATES, "Later discovery waves may increase the package-wide provisional candidate count, but Phase 1 must remain represented");
assert.equal(SRI_001_MANIFEST.discoveryWaves.phase1PowerFoundations, EXPECTED_CANDIDATES);
for (const checkpointId of ["SRI-CP-001", "SRI-CP-002", "SRI-CP-003"] as const) {
  assert.ok(SRI_001_MANIFEST.activeExecutableDiscoveryCheckpoints.includes(checkpointId), `${checkpointId} must remain executable discovery`);
}
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
  ["SRI-CP-001", 8],
  ["SRI-CP-002", 11],
  ["SRI-CP-003", 6],
]);
for (const [checkpointId, expected] of expectedCheckpointCounts) {
  assert.equal(SRI_PHASE1_POWER_CANDIDATES.filter((item) => item.checkpointId === checkpointId).length, expected, `${checkpointId} candidate count mismatch`);
}

let generated = 0;
const checkpointCounts = new Map<string, number>();
const candidateStemDiversity = new Map<string, Set<string>>();
const optionPositions = new Map<string, Set<number>>();

for (const descriptor of SRI_PHASE1_POWER_CANDIDATES) {
  const stems = new Set<string>();
  const positions = new Set<number>();

  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `SRI-PHASE1:${descriptor.candidateId}:${index}`;
    const question = generateSriPhase1PowerCandidate(descriptor.candidateId, seed);
    const repeat = generateSriPhase1PowerCandidate(descriptor.candidateId, seed);
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
    assert.equal(question.verification.domainValid, true, `${descriptor.candidateId} generated an inadmissible state`);
    assert.equal(question.proofEvents.some((event) => event.kind === "INDEPENDENT_VERIFY"), true);
    assert.ok(question.stem.trim().length > 8, `${descriptor.candidateId} stem is too short`);
    assert.equal(question.stem.includes("undefined"), false);
    assert.equal(question.stem.includes("NaN"), false);
    assert.ok(question.explanation.given.trim().length > 0);
    assert.ok(question.explanation.asked.trim().length > 0);
    assert.ok(question.explanation.method.trim().length > 0);
    assert.ok(question.explanation.working.length > 0);
    assert.equal(question.explanation.answer, question.answer.text);
    assert.notEqual(question.explanation.given.trim(), question.stem.trim(), `${descriptor.candidateId} explanation repeats the complete stem`);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3, `${descriptor.candidateId} must expose exactly three misconception-backed distractors`);

    stems.add(question.stem);
    positions.add(question.correctIndex);
    checkpointCounts.set(question.checkpointId, (checkpointCounts.get(question.checkpointId) ?? 0) + 1);
  }

  candidateStemDiversity.set(descriptor.candidateId, stems);
  optionPositions.set(descriptor.candidateId, positions);
  assert.ok(stems.size >= 3, `${descriptor.candidateId} stem pool is too thin: ${stems.size} unique stems in ${SEEDS_PER_CANDIDATE} seeds`);
  assert.ok(positions.size >= 3, `${descriptor.candidateId} correct-option placement is too concentrated: ${[...positions].join(",")}`);
}

assert.equal(generated, EXPECTED_CANDIDATES * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-001"), 8 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-002"), 11 * SEEDS_PER_CANDIDATE);
assert.equal(checkpointCounts.get("SRI-CP-003"), 6 * SEEDS_PER_CANDIDATE);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  candidateCount: EXPECTED_CANDIDATES,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  minUniqueStems: Math.min(...[...candidateStemDiversity.values()].map((set) => set.size)),
  minCorrectOptionPositions: Math.min(...[...optionPositions.values()].map((set) => set.size)),
  permanentQlCount: SRI_001_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_001_MANIFEST.frozenSolveModeCount,
}, null, 2));
