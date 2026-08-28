import assert from "node:assert/strict";
import { NUM_CP014_WAVE02_PROTOTYPE_IDS, generateNumCp014Wave02 } from "./runtime.ts";

const SEEDS = 100;
let packages = 0;
let answerImpactChecks = 0;
const positions: Record<string, Set<number>> = {};
const fingerprints: Record<string, Set<string>> = {};
const topologyClasses = new Set<string>();

for (const prototypeId of NUM_CP014_WAVE02_PROTOTYPE_IDS) {
  positions[prototypeId] = new Set<number>();
  fingerprints[prototypeId] = new Set<string>();

  for (let seed = 1; seed <= SEEDS; seed += 1) {
    const q = generateNumCp014Wave02(prototypeId, seed);
    packages += 1;
    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.seed, seed, `${prototypeId}/${seed}: seed identity drift`);
    assert.equal(q.verifierAnswer, q.canonicalAnswer);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${prototypeId}/${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.options[q.correctIndex]?.misconceptionId, "CORRECT");
    positions[prototypeId]!.add(q.correctIndex);
    fingerprints[prototypeId]!.add(q.mathematicalFingerprint);

    assert.ok(q.ablation.components.length >= 2);
    assert.equal(new Set(q.ablation.components).size, q.ablation.components.length, `${prototypeId}/${seed}: duplicate component engine`);
    assert.equal(q.ablation.fullAnswer, q.canonicalAnswer);
    assert.equal(q.ablation.everyComponentChangesAnswer, true);
    for (const component of q.ablation.components) {
      assert.ok(q.ablation.componentRemovedCandidates[component], `${prototypeId}/${seed}: missing candidate ablation for ${component}`);
      assert.ok(q.ablation.componentRemovedAnswers[component], `${prototypeId}/${seed}: missing answer ablation for ${component}`);
      assert.notEqual(q.ablation.componentRemovedAnswers[component], q.canonicalAnswer, `${prototypeId}/${seed}: ${component} does not change requested answer`);
      answerImpactChecks += 1;
    }

    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 4);
    assert.ok(q.explanation.examShortcut.length >= 2);
    assert.ok(q.explanation.fullDerivation.join(" ").includes(q.canonicalAnswer));

    if (q.answerSemantic === "COUNT") {
      assert.ok(q.options.every((option) => !/^-/.test(option.value)), `${prototypeId}/${seed}: negative count option`);
    }
    if (prototypeId === "NUM-CP014-PROT-010") topologyClasses.add(q.canonicalAnswer);
    if (prototypeId === "NUM-CP014-PROT-011") assert.equal(q.ablation.components.length, 3, "P011 must remain a true three-engine synthesis");

    assert.equal(q.lifecycle.permanentQlAllocated, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.ok(!JSON.stringify(q).includes("NUM-QL-248"), `${prototypeId}/${seed}: QL248 leaked into discovery`);
  }

  assert.deepEqual([...positions[prototypeId]!].sort(), [0, 1, 2, 3], `${prototypeId}: answer-position coverage incomplete`);
  assert.ok(fingerprints[prototypeId]!.size >= 3, `${prototypeId}: state diversity too narrow`);
}

assert.deepEqual([...topologyClasses].sort(), ["NO_SOLUTION", "ONE_SOLUTION"], "P010 must cover both admissible answer-impact solution classes");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE02_ANSWER_IMPACT",
  prototypes: NUM_CP014_WAVE02_PROTOTYPE_IDS.length,
  packages,
  answerImpactChecks,
  topologyClasses: [...topologyClasses].sort(),
  threeEnginePrototype: "NUM-CP014-PROT-011",
  ql248Allocated: false,
  downstreamGatesLocked: true,
}, null, 2));
