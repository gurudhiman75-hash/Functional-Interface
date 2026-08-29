import assert from "node:assert/strict";
import { NUM_CP014_WAVE03_REPRESENTATIONS } from "./runtime.ts";
import { generateNumCp014Wave03V2 } from "./runtime-v2.ts";

const ids = ["NUM-CP014-PROT-019", "NUM-CP014-PROT-020"] as const;
const representationCoverage: Record<string, Set<string>> = {};
const answerPositionCoverage: Record<string, Set<number>> = {};
let packages = 0;
let ablationChecks = 0;

for (const prototypeId of ids) {
  representationCoverage[prototypeId] = new Set();
  answerPositionCoverage[prototypeId] = new Set();
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp014Wave03V2(prototypeId, seed);
    packages += 1;
    representationCoverage[prototypeId]!.add(q.representation);
    answerPositionCoverage[prototypeId]!.add(q.correctIndex);

    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.verifierAnswer, q.canonicalAnswer);
    assert.equal(q.representationPayload.length, 4);
    assert.ok(q.representationPayload.join(" ").includes(q.canonicalAnswer));
    assert.equal(q.ablation.everyComponentChangesAnswer, true);
    assert.equal(q.ablation.fullAnswer, q.canonicalAnswer);
    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 6);
    assert.ok(q.explanation.examShortcut.length >= 2);
    assert.ok(/verification/i.test(q.explanation.fullDerivation.join(" ")));

    for (const component of q.componentEngines) {
      const removed = q.ablation.componentRemovedCandidates[component];
      assert.ok(Array.isArray(removed) && removed.length > 1);
      assert.notEqual(q.ablation.componentRemovedAnswers[component], q.canonicalAnswer);
      ablationChecks += 1;
    }

    if (prototypeId === "NUM-CP014-PROT-019") {
      assert.equal(q.answerSemantic, "HIDDEN_DIVISOR");
      assert.deepEqual(q.ablation.fullCandidates, [q.canonicalAnswer]);
      assert.equal(q.ablation.componentRemovedAnswers.DIVISOR_FUNCTION, "MULTIPLE_SOLUTIONS");
      assert.equal(q.ablation.componentRemovedAnswers.HCF_LCM, "MULTIPLE_SOLUTIONS");
    } else {
      assert.equal(q.answerSemantic, "COMPLETE_VALID_SET");
      assert.ok(q.ablation.fullCandidates.length >= 2 && q.ablation.fullCandidates.length <= 4);
      assert.ok(q.canonicalAnswer.startsWith("{") && q.canonicalAnswer.endsWith("}"));
      assert.ok(q.ablation.componentRemovedCandidates.PERFECT_POWER.length > q.ablation.fullCandidates.length);
      assert.ok(q.ablation.componentRemovedCandidates.REMAINDER.length > q.ablation.fullCandidates.length);
    }

    assert.equal(q.lifecycle.permanentQlAllocated, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.ok(!JSON.stringify(q).includes("NUM-QL-248"));
  }

  assert.deepEqual([...representationCoverage[prototypeId]!].sort(), [...NUM_CP014_WAVE03_REPRESENTATIONS].sort());
  assert.deepEqual([...answerPositionCoverage[prototypeId]!].sort(), [0, 1, 2, 3]);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE03_V2_ANSWER_SEMANTIC_CLOSURE",
  addedPrototypes: ids,
  packages,
  ablationChecks,
  hiddenDivisorCovered: true,
  completeValidSetCovered: true,
  ql248Allocated: false,
}, null, 2));
