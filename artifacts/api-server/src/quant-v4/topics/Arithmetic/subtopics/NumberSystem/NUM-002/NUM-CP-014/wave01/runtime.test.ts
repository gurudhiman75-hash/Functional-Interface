import assert from "node:assert/strict";
import {
  NUM_CP014_WAVE01_PROTOTYPE_IDS,
  generateNumCp014Wave01,
} from "./runtime.ts";

const SEEDS_PER_PROTOTYPE = 120;
let packages = 0;
let ablationChecks = 0;
let explanationChecks = 0;
const answerPositions: Record<string, Set<number>> = {};
const fingerprints: Record<string, Set<string>> = {};

for (const prototypeId of NUM_CP014_WAVE01_PROTOTYPE_IDS) {
  answerPositions[prototypeId] = new Set<number>();
  fingerprints[prototypeId] = new Set<string>();

  for (let seed = 1; seed <= SEEDS_PER_PROTOTYPE; seed += 1) {
    const q = generateNumCp014Wave01(prototypeId, seed);
    packages += 1;

    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.verifierAnswer, q.canonicalAnswer);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${prototypeId}/${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${prototypeId}/${seed}: answer binding drift`);
    assert.equal(q.options[q.correctIndex]?.misconceptionId, "CORRECT");
    answerPositions[prototypeId]!.add(q.correctIndex);
    fingerprints[prototypeId]!.add(q.mathematicalFingerprint);

    assert.equal(q.componentEngines.length, 2);
    assert.notEqual(q.componentEngines[0], q.componentEngines[1], `${prototypeId}/${seed}: synthesis uses the same engine twice`);
    assert.deepEqual(q.ablation.componentA, q.componentEngines[0]);
    assert.deepEqual(q.ablation.componentB, q.componentEngines[1]);
    assert.deepEqual(q.ablation.fullCandidates, [q.canonicalAnswer], `${prototypeId}/${seed}: full solution must be unique`);
    assert.ok(q.ablation.withoutA.length > 1, `${prototypeId}/${seed}: component A is decorative`);
    assert.ok(q.ablation.withoutB.length > 1, `${prototypeId}/${seed}: component B is decorative`);
    assert.ok(q.ablation.withoutA.includes(q.canonicalAnswer));
    assert.ok(q.ablation.withoutB.includes(q.canonicalAnswer));
    assert.equal(q.ablation.componentANecessary, true);
    assert.equal(q.ablation.componentBNecessary, true);
    ablationChecks += 2;

    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 4, `${prototypeId}/${seed}: full derivation too short`);
    assert.ok(q.explanation.examShortcut.length >= 2, `${prototypeId}/${seed}: exam shortcut missing`);
    const fullText = q.explanation.fullDerivation.join(" ");
    assert.ok(fullText.includes(q.canonicalAnswer), `${prototypeId}/${seed}: derivation never reaches answer`);
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

  assert.deepEqual([...answerPositions[prototypeId]!].sort(), [0, 1, 2, 3], `${prototypeId}: A/B/C/D answer-position coverage incomplete`);
  assert.ok(fingerprints[prototypeId]!.size >= 3, `${prototypeId}: mathematical state diversity too narrow`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE01_SYNTHESIS_FOUNDATION",
  prototypes: NUM_CP014_WAVE01_PROTOTYPE_IDS.length,
  packages,
  ablationChecks,
  explanationChecks,
  ql248Allocated: false,
  necessityRule: "REMOVE_EITHER_COMPONENT_MUST_RESTORE_AMBIGUITY",
  explanationStandard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
  downstreamGatesLocked: true,
}, null, 2));
