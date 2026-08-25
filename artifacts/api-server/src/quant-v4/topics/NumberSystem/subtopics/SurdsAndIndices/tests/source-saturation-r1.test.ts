import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import { SRI_001_MANIFEST } from "../SRI-001/manifest";
import { SRI_002_MANIFEST } from "../SRI-002/manifest";
import {
  SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES,
  generateSriExecutableDiscoveryCandidate,
} from "../saturation-registry";

const SEEDS_PER_CANDIDATE = 24;
const EXPECTED_TOTAL = 93;
const EXPECTED_CHECKPOINT_COUNTS = new Map([
  ["SRI-CP-001", 8], ["SRI-CP-002", 11], ["SRI-CP-003", 6],
  ["SRI-CP-004", 7], ["SRI-CP-005", 9], ["SRI-CP-006", 7],
  ["SRI-CP-007", 6], ["SRI-CP-008", 9], ["SRI-CP-009", 9],
  ["SRI-CP-010", 6], ["SRI-CP-011", 10], ["SRI-CP-012", 5],
]);
const ALLOWED_DISPOSITIONS = new Set(["KEEP", "EXPAND", "NEW", "SOURCE_GATED"]);

// Some mathematically sound contracts intentionally have one invariant answer semantic
// across every valid state. Saturation must demand state/stem/option-position diversity
// for them, not fabricate answer diversity that would make the mathematics wrong.
const FIXED_SEMANTIC_ANSWER_CANDIDATES = new Set([
  "C001-E", // a^0 = 1 for every non-zero base
  "C002-I", // 0^0 and zero to a negative exponent are undefined
  "C002-K", // generated negative-base even-denominator forms are non-real
  "C008-I", // sqrt(x)+sqrt(y)=sqrt(x+y), x,y>=0 => xy=0
  "C012-C", // deliberately asks whether two exact representations are equal
]);

assert.equal(SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.length, EXPECTED_TOTAL, "SRI saturation registry must expose all 93 current provisional families");
assert.equal(new Set(SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.map((item) => item.candidateId)).size, EXPECTED_TOTAL, "candidate IDs must be globally unique");
assert.equal(new Set(SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.map((item) => item.title)).size, EXPECTED_TOTAL, "candidate titles must be globally unique");
assert.equal(SRI_001_MANIFEST.provisionalCandidateCount, 48);
assert.equal(SRI_002_MANIFEST.provisionalCandidateCount, 45);
assert.equal(SRI_001_MANIFEST.provisionalCandidateCount + SRI_002_MANIFEST.provisionalCandidateCount, EXPECTED_TOTAL);
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_001_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_002_MANIFEST.permanentQlCount, 29);
assert.equal(SRI_001_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_002_MANIFEST.frozenSolveModeCount, 0);
assertSriReleaseLocks();

for (const checkpoint of SRI_CHAPTER_MANIFEST.canonicalCheckpoints) {
  assert.ok(SRI_CHAPTER_MANIFEST.executableDiscoveryCheckpoints.includes(checkpoint), `${checkpoint} must remain executable as saturation evidence after permanent allocation`);
}
for (const [checkpoint, expected] of EXPECTED_CHECKPOINT_COUNTS) {
  const actual = SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.filter((item) => item.checkpointId === checkpoint).length;
  assert.equal(actual, expected, `${checkpoint} provisional family count mismatch`);
}
for (const descriptor of SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES) {
  assert.ok(ALLOWED_DISPOSITIONS.has(descriptor.sourceDisposition), `${descriptor.candidateId} has unsupported saturation disposition`);
}

let generated = 0;
const globalStemOwners = new Map<string, string>();
const checkpointGeneratedCounts = new Map<string, number>();
const sourceGatedIds = new Set<string>();

for (const descriptor of SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES) {
  const stems = new Set<string>();
  const states = new Set<string>();
  const answers = new Set<string>();
  const correctPositions = new Set<number>();
  if (descriptor.sourceDisposition === "SOURCE_GATED") sourceGatedIds.add(descriptor.candidateId);

  for (let index = 0; index < SEEDS_PER_CANDIDATE; index += 1) {
    const seed = `SRI-SAT-R1:${descriptor.candidateId}:${index}`;
    let question;
    let repeat;
    try {
      question = generateSriExecutableDiscoveryCandidate(descriptor.candidateId, seed);
      repeat = generateSriExecutableDiscoveryCandidate(descriptor.candidateId, seed);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`${descriptor.candidateId} failed saturation generation for seed ${seed}: ${detail}`);
    }

    generated += 1;
    assert.deepEqual(repeat, question, `${descriptor.candidateId} is not deterministic for ${seed}`);
    assert.equal(question.seed, seed, `${descriptor.candidateId} mutated its public seed`);
    assert.equal(question.candidateId, descriptor.candidateId);
    assert.equal(question.checkpointId, descriptor.checkpointId);
    assert.equal(question.status, "PROVISIONAL_DISCOVERY");
    assert.deepEqual(validateSriDiscoveryQuestion(question), [], `${descriptor.candidateId} failed discovery validation`);
    assert.equal(question.verification.solverVerifierAgree, true, `${descriptor.candidateId} solver/verifier mismatch`);
    assert.equal(question.verification.domainValid, true, `${descriptor.candidateId} generated an inadmissible state`);
    assert.equal(question.verification.exactlyOneCorrectOption, true, `${descriptor.candidateId} does not have one correct option`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.canonicalKey)).size, 4, `${descriptor.candidateId} has duplicate canonical options`);
    assert.equal(question.options.filter((option) => option.canonicalKey === question.answer.canonicalKey).length, 1, `${descriptor.candidateId} has an ambiguous correct answer`);
    assert.equal(question.options[question.correctIndex]?.canonicalKey, question.answer.canonicalKey);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3, `${descriptor.candidateId} must expose three misconception-backed distractors`);
    assert.ok(question.stem.trim().length > 8);
    assert.equal(question.stem.includes("undefined"), false);
    assert.equal(question.stem.includes("NaN"), false);
    assert.equal(question.stem.includes("\\frac}"), false, `${descriptor.candidateId} has malformed fraction TeX`);
    assert.ok(question.explanation.given.trim().length > 0);
    assert.ok(question.explanation.asked.trim().length > 0);
    assert.ok(question.explanation.method.trim().length > 0);
    assert.ok(question.explanation.working.length > 0);
    assert.equal(question.explanation.answer, question.answer.text);
    assert.notEqual(normalize(question.explanation.given), normalize(question.stem), `${descriptor.candidateId} explanation repeats the complete stem`);

    const normalizedStem = normalize(question.stem);
    const previousOwner = globalStemOwners.get(normalizedStem);
    if (previousOwner && previousOwner !== descriptor.candidateId) {
      throw new Error(`cross-candidate exact stem collision: ${previousOwner} and ${descriptor.candidateId}: ${question.stem}`);
    }
    globalStemOwners.set(normalizedStem, descriptor.candidateId);

    stems.add(normalizedStem);
    states.add(stableState(question.state));
    answers.add(question.answer.canonicalKey);
    correctPositions.add(question.correctIndex);
    checkpointGeneratedCounts.set(question.checkpointId, (checkpointGeneratedCounts.get(question.checkpointId) ?? 0) + 1);
  }

  assert.ok(stems.size >= 3, `${descriptor.candidateId} stem diversity is too thin: ${stems.size}`);
  assert.ok(states.size >= 2, `${descriptor.candidateId} state/object diversity is too thin: ${states.size}`);
  assert.ok(correctPositions.size >= 3, `${descriptor.candidateId} correct-option positions are too concentrated: ${[...correctPositions].join(",")}`);
  if (FIXED_SEMANTIC_ANSWER_CANDIDATES.has(descriptor.candidateId)) {
    assert.equal(answers.size, 1, `${descriptor.candidateId} is a fixed-semantic contract but generated ${answers.size} answer semantics`);
  } else {
    assert.ok(answers.size >= 2, `${descriptor.candidateId} answer diversity is too thin: ${answers.size}`);
  }
}

assert.equal(generated, EXPECTED_TOTAL * SEEDS_PER_CANDIDATE);
for (const [checkpoint, familyCount] of EXPECTED_CHECKPOINT_COUNTS) {
  assert.equal(checkpointGeneratedCounts.get(checkpoint), familyCount * SEEDS_PER_CANDIDATE, `${checkpoint} generated package count mismatch`);
}
assert.ok(sourceGatedIds.has("C010-F"), "repeating infinite radical must preserve its discovery-time source-gated provenance");
assert.ok(sourceGatedIds.has("C008-I"), "root-sum condition identity must remain source-gated in R1 provenance");

console.log(JSON.stringify({
  status: "PASS",
  provisionalFamilies: EXPECTED_TOTAL,
  packageCounts: { "SRI-001": 48, "SRI-002": 45 },
  generated,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  checkpointFamilyCounts: Object.fromEntries(EXPECTED_CHECKPOINT_COUNTS),
  sourceGated: [...sourceGatedIds].sort(),
  fixedSemanticAnswerCandidates: [...FIXED_SEMANTIC_ANSWER_CANDIDATES].sort(),
  permanentQlCount: SRI_CHAPTER_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}

function stableState(state: Readonly<Record<string, string | number | boolean>>): string {
  return JSON.stringify(Object.entries(state).sort(([left], [right]) => left.localeCompare(right)));
}
