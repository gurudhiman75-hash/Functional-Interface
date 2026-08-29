import assert from "node:assert/strict";
import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP003_PERMANENT_GENERATOR_VERSION, BTD_CP003_QL_IDS, buildBtdPermanentQuestionV1 } from "./btd-cp003-permanent-generator-v1";

const SEEDS_PER_QL = 200;
const MIN_CP001_UNIQUE_STATES = 70;
const MIN_CP002_UNIQUE_STATES = 60;
function normalize(text: string) { return text.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
function skeleton(text: string) { return normalize(text).replace(/[0-9]+(?:[.,][0-9]+)*/gu, "#").replace(/[₹$€£]/gu, "¤").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/gu, " ").trim(); }

assert.equal(BTD_CP003_PERMANENT_GENERATOR_VERSION, "BTD-001-CP003-PERMANENT-GENERATOR-v1");
assert.equal(BTD_CP003_QL_IDS.length, 20);
assert.deepEqual(BTD_CP003_QL_IDS, BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId));

const fingerprints = new Map<string, Set<string>>();
const stemFamilies = new Map<string, Set<string>>();
const skeletons = new Map<string, Set<string>>();
const exactStems = new Map<string, Set<string>>();
const answerPositions = [0, 0, 0, 0];
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let identityChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let nativeJsonChecks = 0;
let discoveryLeakChecks = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  fingerprints.set(entry.qlId, new Set());
  stemFamilies.set(entry.qlId, new Set());
  skeletons.set(entry.qlId, new Set());
  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `BTD-CP003-V1:${entry.qlId}:${index}`;
    const first: any = buildBtdPermanentQuestionV1(entry.qlId, seed);
    const second: any = buildBtdPermanentQuestionV1(entry.qlId, seed);
    assert.deepEqual(first, second, `${entry.qlId}/${index}: deterministic replay drift`);
    deterministicReplayChecks += 1;

    assert.equal(first.chapterId, "BTD-001");
    assert.equal(first.checkpointId, "BTD-CP-003");
    assert.equal(first.productionVersion, BTD_CP003_PERMANENT_GENERATOR_VERSION);
    assert.equal(first.qlId, entry.qlId);
    assert.equal(first.semanticSignature, entry.semanticSignature);
    assert.equal(first.answerSemantic, entry.answerSemantic);
    assert.equal(first.sourceAuthorityId, entry.sourceAuthorityId);
    assert.equal(first.sourceOriginCheckpoint, entry.origin);
    assert.equal(first.seed, seed);
    assert.match(first.sourceStateFingerprint, /^[a-f0-9]{64}$/u);
    identityChecks += 9;

    for (const forbidden of ["prototypeId", "candidateId", "state", "answer", "contract", "sourceBoundary", "packagingVersion", "saturationVersion"]) {
      assert.equal(forbidden in first, false, `${entry.qlId}/${index}: leaked discovery field ${forbidden}`);
      discoveryLeakChecks += 1;
    }

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option: any) => option.text)).size, 4, `${entry.qlId}/${index}: duplicate option text`);
    assert.equal(first.options.filter((option: any) => option.isCorrect).length, 1, `${entry.qlId}/${index}: answer ownership drift`);
    assert.ok(first.correctIndex >= 0 && first.correctIndex <= 3);
    assert.equal(first.options[first.correctIndex].isCorrect, true);
    assert.equal(first.options[first.correctIndex].text, first.correctAnswer);
    answerPositions[first.correctIndex] += 1;
    optionChecks += 6;

    assert.ok(first.presentation.stem.length >= 35);
    assert.ok(first.explanation.whatGiven.length >= 20);
    assert.ok(first.explanation.whatAsked.length >= 10);
    assert.ok(first.explanation.keyIdea.length >= 20);
    assert.ok(first.explanation.steps.length >= 2);
    assert.ok(first.explanation.steps.every((step: string) => step.length >= 10));
    assert.ok(first.explanation.finalAnswer.includes(first.correctAnswer), `${entry.qlId}/${index}: final explanation does not contain answer`);
    assert.notEqual(normalize(first.explanation.whatGiven), normalize(first.presentation.stem), `${entry.qlId}/${index}: explanation repeats stem`);
    explanationChecks += 8;

    assert.equal(first.lifecycle.permanentQlAllocated, true);
    assert.equal(first.lifecycle.productionCandidate, true);
    assert.equal(first.lifecycle.contentFreezeStatus, "REVIEW_LOCKED");
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.mockTestEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 8;

    const json = JSON.stringify(first);
    assert.ok(json.length > 100);
    assert.equal(json.includes("[object Object]"), false);
    nativeJsonChecks += 2;

    fingerprints.get(entry.qlId)!.add(first.sourceStateFingerprint);
    stemFamilies.get(entry.qlId)!.add(first.presentation.stemFamilyId);
    skeletons.get(entry.qlId)!.add(skeleton(first.presentation.stem));
    const stemKey = normalize(first.presentation.stem);
    const owners = exactStems.get(stemKey) ?? new Set<string>();
    owners.add(entry.qlId);
    exactStems.set(stemKey, owners);
    generatedQuestions += 1;
  }
}

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  const minimum = entry.origin === "BTD-CP-001" ? MIN_CP001_UNIQUE_STATES : MIN_CP002_UNIQUE_STATES;
  assert.ok(fingerprints.get(entry.qlId)!.size >= minimum, `${entry.qlId}: source-state breadth too thin (${fingerprints.get(entry.qlId)!.size} < ${minimum})`);
  assert.equal(stemFamilies.get(entry.qlId)!.size, 3, `${entry.qlId}: did not exercise all 3 stem families`);
  assert.ok(skeletons.get(entry.qlId)!.size >= 3, `${entry.qlId}: stem skeleton breadth too thin`);
}

const crossQlExactStemCollisions = [...exactStems.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(crossQlExactStemCollisions, [], "exact stem collision across permanent QLs");
assert.deepEqual(answerPositions.map((count) => count > 0), [true, true, true, true], "not all answer positions exercised");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP003-PERMANENT-GENERATOR-AUDIT-v1",
  productionVersion: BTD_CP003_PERMANENT_GENERATOR_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-003",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  seedsPerQl: SEEDS_PER_QL,
  generatedQuestions,
  minimumCp001UniqueStates: MIN_CP001_UNIQUE_STATES,
  minimumCp002UniqueStates: MIN_CP002_UNIQUE_STATES,
  deterministicReplayChecks,
  identityChecks,
  discoveryLeakChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  nativeJsonChecks,
  answerPositions,
  exactCrossQlStemCollisions: crossQlExactStemCollisions.length,
  perQl: Object.fromEntries(BTD_PERMANENT_QL_REGISTRY.map((entry) => [entry.qlId, {
    origin: entry.origin,
    sourceAuthorityId: entry.sourceAuthorityId,
    semanticSignature: entry.semanticSignature,
    uniqueSourceStates: fingerprints.get(entry.qlId)!.size,
    stemFamilies: stemFamilies.get(entry.qlId)!.size,
    normalizedSkeletons: skeletons.get(entry.qlId)!.size,
  }])),
  permanentQlAllocated: true,
  contentFreezeStatus: "REVIEW_LOCKED",
  questionStudioDiscoverable: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP003_PERMANENT_GENERATOR_AUDIT_V1");
