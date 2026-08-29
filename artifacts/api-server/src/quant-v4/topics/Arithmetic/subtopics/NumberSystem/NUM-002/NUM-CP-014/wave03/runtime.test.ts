import assert from "node:assert/strict";
import {
  NUM_CP014_WAVE03_PROTOTYPE_IDS,
  NUM_CP014_WAVE03_REPRESENTATIONS,
  generateNumCp014Wave03,
} from "./runtime.ts";

const SEEDS_PER_PROTOTYPE = 120;
let packages = 0;
let ablationChecks = 0;
let explanationChecks = 0;
let representationPayloadChecks = 0;
const representationCoverage: Record<string, Set<string>> = {};
const answerPositionCoverage: Record<string, Set<number>> = {};
const fingerprintCoverage: Record<string, Set<string>> = {};

for (const prototypeId of NUM_CP014_WAVE03_PROTOTYPE_IDS) {
  representationCoverage[prototypeId] = new Set();
  answerPositionCoverage[prototypeId] = new Set();
  fingerprintCoverage[prototypeId] = new Set();

  for (let seed = 1; seed <= SEEDS_PER_PROTOTYPE; seed += 1) {
    const q = generateNumCp014Wave03(prototypeId, seed);
    packages += 1;

    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.verifierAnswer, q.canonicalAnswer);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${prototypeId}/${seed}: duplicate option values`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${prototypeId}/${seed}: correct option binding drift`);
    assert.equal(q.options[q.correctIndex]?.misconceptionId, "CORRECT");
    answerPositionCoverage[prototypeId]!.add(q.correctIndex);
    fingerprintCoverage[prototypeId]!.add(q.mathematicalFingerprint);

    assert.ok(NUM_CP014_WAVE03_REPRESENTATIONS.includes(q.representation));
    representationCoverage[prototypeId]!.add(q.representation);
    assert.equal(q.representationPayload.length, 4, `${prototypeId}/${seed}: representation payload must contain four substantive rows/steps`);
    assert.ok(q.representationPayload.every((line) => String(line).trim().length >= 8));
    const representationText = q.representationPayload.join(" ");
    assert.ok(representationText.includes(q.canonicalAnswer), `${prototypeId}/${seed}: representation never exposes the full intersection/result`);
    representationPayloadChecks += 1;

    assert.equal(q.componentEngines.length, 2);
    assert.notEqual(q.componentEngines[0], q.componentEngines[1]);
    assert.deepEqual(q.ablation.components, q.componentEngines);
    assert.deepEqual(q.ablation.fullCandidates, [q.canonicalAnswer]);
    assert.equal(q.ablation.fullAnswer, q.canonicalAnswer);
    assert.equal(q.ablation.everyComponentChangesAnswer, true);
    for (const component of q.componentEngines) {
      const removed = q.ablation.componentRemovedCandidates[component];
      assert.ok(Array.isArray(removed) && removed.length > 1, `${prototypeId}/${seed}/${component}: removing component did not restore ambiguity`);
      assert.ok(removed.includes(q.canonicalAnswer), `${prototypeId}/${seed}/${component}: ablated candidate set lost the true answer`);
      assert.equal(q.ablation.componentRemovedAnswers[component], "MULTIPLE_SOLUTIONS");
      assert.notEqual(q.ablation.componentRemovedAnswers[component], q.canonicalAnswer);
      ablationChecks += 1;
    }

    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 6, `${prototypeId}/${seed}: derivation too shallow`);
    assert.ok(q.explanation.examShortcut.length >= 2, `${prototypeId}/${seed}: exam shortcut missing`);
    const derivation = q.explanation.fullDerivation.join(" ");
    assert.ok(derivation.includes(q.canonicalAnswer), `${prototypeId}/${seed}: derivation never reaches answer`);
    assert.ok(/Verification|verify|verification/i.test(derivation), `${prototypeId}/${seed}: explicit verification missing`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.permanentQlAllocated, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.ok(!JSON.stringify(q).includes("NUM-QL-248"), `${prototypeId}/${seed}: QL248 leaked into discovery`);
  }

  assert.deepEqual([...representationCoverage[prototypeId]!].sort(), [...NUM_CP014_WAVE03_REPRESENTATIONS].sort(), `${prototypeId}: representation saturation incomplete`);
  assert.deepEqual([...answerPositionCoverage[prototypeId]!].sort(), [0, 1, 2, 3], `${prototypeId}: A/B/C/D answer-position coverage incomplete`);
  assert.ok(fingerprintCoverage[prototypeId]!.size >= 8, `${prototypeId}: mathematical state diversity too narrow`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE03_REPRESENTATION_SATURATION",
  prototypes: NUM_CP014_WAVE03_PROTOTYPE_IDS.length,
  packages,
  ablationChecks,
  explanationChecks,
  representationPayloadChecks,
  representations: NUM_CP014_WAVE03_REPRESENTATIONS,
  ql248Allocated: false,
  downstreamGatesLocked: true,
}, null, 2));
