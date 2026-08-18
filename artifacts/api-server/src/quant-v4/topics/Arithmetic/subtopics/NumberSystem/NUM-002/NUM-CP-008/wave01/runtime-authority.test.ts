import { NUM_CP008_WAVE01_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave01 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const positionReach = new Map<string, Set<number>>();
const difficultyReach = new Map<string, Set<string>>();
const fingerprintReach = new Map<string, Set<string>>();

let packages = 0;
let replays = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let negativeRawResidues = 0;
let zeroResidues = 0;
let exponentZeroStates = 0;
let uniqueLinearStates = 0;
let multipleLinearStates = 0;
let noSolutionLinearStates = 0;
let compatibleCoprimeSystems = 0;
let compatibleNonCoprimeSystems = 0;
let incompatibleSystems = 0;

for (const prototypeId of NUM_CP008_WAVE01_PROTOTYPE_IDS) {
  positionReach.set(prototypeId, new Set());
  difficultyReach.set(prototypeId, new Set());
  fingerprintReach.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const question = generateNumCp008Wave01(prototypeId, seed);
    const replay = generateNumCp008Wave01(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(JSON.stringify(question) === JSON.stringify(replay), `${label}: deterministic replay failed`);
    replays += 1;

    assert(question.packageId === "NUM-002", `${label}: wrong package`);
    assert(question.checkpointId === "NUM-CP-008", `${label}: wrong checkpoint`);
    assert(question.temporaryPrototypeId === prototypeId, `${label}: prototype drift`);
    assert(question.permanentQlId === null, `${label}: permanent QL allocated during discovery`);
    assert(question.locale === "en-IN", `${label}: unexpected locale`);
    assert(question.canonicalAnswer === question.verifierAnswer, `${label}: canonical/verifier mismatch (${question.canonicalAnswer} vs ${question.verifierAnswer})`);
    verifierChecks += 1;

    assert(question.options.length === 4, `${label}: expected four options`);
    assert(new Set(question.options.map((option) => option.value)).size === 4, `${label}: duplicate option values`);
    assert(question.options.filter((option) => option.isCorrect).length === 1, `${label}: expected exactly one correct option`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correct index`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${label}: correct-index binding failed`);
    assert(question.options[question.correctIndex]?.value === question.canonicalAnswer, `${label}: answer/correct-option mismatch`);
    optionChecks += 1;

    assert(question.sourceAncestry.length >= 2, `${label}: missing source ancestry`);
    assert(question.prototypeAncestry.length >= 1, `${label}: missing prototype ancestry`);
    assert(question.mathematicalFingerprint.startsWith(`${prototypeId}:`), `${label}: malformed fingerprint`);
    assert(question.explanation.coreConcept.length >= 20, `${label}: core concept too short`);
    assert(question.explanation.strategy.length >= 20, `${label}: strategy too short`);
    assert(question.explanation.steps.length >= 2, `${label}: insufficient working`);
    assert(question.explanation.finalAnswer === question.canonicalAnswer, `${label}: explanation final answer drift`);

    const lifecycle = question.lifecycle;
    assert(lifecycle.permanentQlId === null, `${label}: lifecycle permanent QL allocated`);
    assert(lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${label}: wrong maturity`);
    assert(lifecycle.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${label}: wrong review status`);
    assert(lifecycle.questionBankStatus === "NOT_STORED", `${label}: Question Bank opened`);
    assert(lifecycle.testEligibility === "INELIGIBLE", `${label}: test eligibility opened`);
    assert(!lifecycle.active, `${label}: active during discovery`);
    assert(!lifecycle.questionStudioDiscoverable, `${label}: Question Studio exposed during discovery`);
    assert(!lifecycle.questionBankWritable, `${label}: Question Bank writable during discovery`);
    assert(!lifecycle.testEligible, `${label}: test eligible during discovery`);
    assert(!lifecycle.publiclyPublishable, `${label}: publicly publishable during discovery`);
    lifecycleChecks += 1;

    positionReach.get(prototypeId)!.add(question.correctIndex);
    difficultyReach.get(prototypeId)!.add(question.difficulty);
    fingerprintReach.get(prototypeId)!.add(question.mathematicalFingerprint);

    const state = question.hiddenState as Readonly<Record<string, unknown>>;
    const mode = String(state.mode ?? "");
    if (mode === "SIGNED_RESIDUE_NORMALISATION") {
      if (Number(state.raw) < 0) negativeRawResidues += 1;
      if (Number(state.residue) === 0) zeroResidues += 1;
    } else if (mode === "POWER_REMAINDER") {
      if (Number(state.exponent) === 0) exponentZeroStates += 1;
      if (Number(state.residue) === 0) zeroResidues += 1;
    } else if (mode === "LINEAR_CONGRUENCE_UNIQUE") {
      uniqueLinearStates += 1;
    } else if (mode === "LINEAR_CONGRUENCE_MULTIPLE_CLASSES") {
      multipleLinearStates += 1;
      assert(Array.isArray(state.solutions) && (state.solutions as unknown[]).length > 1, `${label}: multiple-class state has <=1 solution`);
    } else if (mode === "LINEAR_CONGRUENCE_NO_SOLUTION") {
      noSolutionLinearStates += 1;
    } else if (mode === "TWO_CONGRUENCE_COMPATIBLE") {
      if (Number(state.gcd) === 1) compatibleCoprimeSystems += 1;
      else compatibleNonCoprimeSystems += 1;
    } else if (mode === "TWO_CONGRUENCE_INCOMPATIBLE") {
      incompatibleSystems += 1;
      assert(Number(state.gcd) > 1, `${label}: incompatible system unexpectedly coprime`);
    }

    packages += 1;
  }
}

for (const prototypeId of NUM_CP008_WAVE01_PROTOTYPE_IDS) {
  const positions = positionReach.get(prototypeId)!;
  const difficulties = difficultyReach.get(prototypeId)!;
  const fingerprints = fingerprintReach.get(prototypeId)!;
  assert(positions.size === 4, `${prototypeId}: did not reach all four answer positions (${[...positions].join(",")})`);
  assert(difficulties.size >= 2, `${prototypeId}: insufficient difficulty breadth (${[...difficulties].join(",")})`);
  assert(fingerprints.size >= 24, `${prototypeId}: insufficient mathematical-state breadth (${fingerprints.size})`);
}

assert(packages === 960, `Expected 960 packages, got ${packages}`);
assert(negativeRawResidues > 0, "Negative residue normalization was never exercised");
assert(zeroResidues > 0, "Zero residue edge was never exercised");
assert(exponentZeroStates > 0, "Exponent-zero edge was never exercised");
assert(uniqueLinearStates === 120, `Unique linear-congruence states ${uniqueLinearStates}`);
assert(multipleLinearStates === 120, `Multiple linear-congruence states ${multipleLinearStates}`);
assert(noSolutionLinearStates === 120, `No-solution linear-congruence states ${noSolutionLinearStates}`);
assert(compatibleCoprimeSystems > 0, "Compatible coprime CRT states missing");
assert(compatibleNonCoprimeSystems > 0, "Compatible non-coprime CRT states missing");
assert(incompatibleSystems === 120, `Incompatible systems ${incompatibleSystems}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE01_RUNTIME_AUTHORITY",
  prototypes: NUM_CP008_WAVE01_PROTOTYPE_IDS.length,
  packages,
  replays,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  positionReach: Object.fromEntries([...positionReach].map(([key, value]) => [key, [...value].sort()])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprintReach].map(([key, value]) => [key, value.size])),
  edges: {
    negativeRawResidues,
    zeroResidues,
    exponentZeroStates,
    uniqueLinearStates,
    multipleLinearStates,
    noSolutionLinearStates,
    compatibleCoprimeSystems,
    compatibleNonCoprimeSystems,
    incompatibleSystems,
  },
  permanentQlCount: 0,
  questionStudioExposed: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
