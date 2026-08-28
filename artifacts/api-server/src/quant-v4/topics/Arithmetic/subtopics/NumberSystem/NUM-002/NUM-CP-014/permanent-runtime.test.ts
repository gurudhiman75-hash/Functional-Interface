import assert from "node:assert/strict";

import { NUM_CP014_PERMANENT_ALLOCATION, NUM_CP014_PERMANENT_QL_IDS } from "./permanent-allocation.ts";
import { generateNumCp014Permanent } from "./permanent-runtime.ts";

const globalSourceCoverage = new Set<string>();
const sourceSeedCoverage: Record<string, Set<number>> = {};
let packages = 0;
let answerBindingChecks = 0;
let ablationEvidenceChecks = 0;

for (const allocation of NUM_CP014_PERMANENT_ALLOCATION) {
  const sourceCoverage = new Set<string>();
  const correctPositions = new Set<number>();
  const sourceSemantics = new Set<string>();
  const representations = new Set<string>();
  const sourceCount = allocation.sourcePrototypes.length;
  const seedLimit = Math.max(240, sourceCount * 80);

  for (let seed = 1; seed <= seedLimit; seed += 1) {
    const q = generateNumCp014Permanent(allocation.qlId, seed);
    packages += 1;

    assert.equal(q.packageId, "NUM-002");
    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.permanentQlId, allocation.qlId);
    assert.equal(q.authorityId, allocation.authorityId);
    assert.equal(q.seed, seed);
    assert.equal(q.sourceSeed, Math.floor((seed - 1) / sourceCount) + 1, `${allocation.qlId}/${seed}: source seed coupling regression`);
    assert.ok(allocation.sourcePrototypes.includes(q.sourcePrototypeId as never));
    assert.equal(q.locale, "en-IN");
    assert.equal(q.difficulty, "HARD");
    assert.ok(q.stem.length >= 20, `${allocation.qlId}/${seed}: stem too thin`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${allocation.qlId}/${seed}: duplicate options`);
    assert.equal(q.correctIndex, (seed - 1) % 4, `${allocation.qlId}/${seed}: permanent option-position rotation drift`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true);
    assert.equal(q.canonicalAnswer, q.verifierAnswer);
    answerBindingChecks += 1;

    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 3);
    assert.ok(q.explanation.examShortcut.length >= 1);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer);
    assert.ok(q.componentEngines.length >= 2);
    if (allocation.authorityId === "NUM-CP014-AUTH-005") assert.equal(q.componentEngines.length, 3);
    assert.ok(Object.keys(q.ablation).length > 0, `${allocation.qlId}/${seed}: ablation evidence missing`);
    ablationEvidenceChecks += 1;

    assert.ok(q.mathematicalFingerprint.length > 8);
    if (q.sourcePrototypeId === "NUM-CP014-PROT-003") {
      assert.ok(q.mathematicalFingerprint.startsWith("P003V2|"), `${allocation.qlId}/${seed}: obsolete P003 leaked into permanent runtime`);
    }
    assert.deepEqual(q.prototypeAncestry, [q.sourcePrototypeId]);
    assert.ok(q.sourceAncestry.includes(q.authorityId));
    assert.ok(q.sourceAncestry.includes(q.sourcePrototypeId));

    assert.equal(q.lifecycle.maturity, "PERMANENT_AUTHORITY");
    assert.equal(q.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);

    sourceCoverage.add(q.sourcePrototypeId);
    globalSourceCoverage.add(q.sourcePrototypeId);
    sourceSeedCoverage[q.sourcePrototypeId] ??= new Set();
    sourceSeedCoverage[q.sourcePrototypeId]!.add(q.sourceSeed);
    correctPositions.add(q.correctIndex);
    sourceSemantics.add(q.sourceAnswerSemantic);
    representations.add(q.representation);
  }

  assert.deepEqual([...sourceCoverage].sort(), [...allocation.sourcePrototypes].sort(), `${allocation.qlId}: retained source coverage incomplete`);
  assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3], `${allocation.qlId}: A/B/C/D coverage incomplete`);

  if (allocation.qlId === "NUM-QL-248") {
    assert.deepEqual([...sourceSemantics].sort(), ["DIGIT", "HIDDEN_BASE", "HIDDEN_DIVISOR", "HIDDEN_EXPONENT", "HIDDEN_NUMBER"].sort());
    for (const representation of ["CONSTRAINT_TABLE", "ELIMINATION_GRID", "MINI_CASELET", "MULTI_STAGE_GRAPH"]) {
      assert.ok(representations.has(representation), `QL248 lost ${representation} representation`);
    }
  }
  if (allocation.qlId === "NUM-QL-249") assert.deepEqual([...sourceSemantics].sort(), ["GREATEST_VALUE", "LEAST_VALUE"]);
  if (allocation.qlId === "NUM-QL-250") assert.deepEqual([...sourceSemantics], ["COUNT"]);
  if (allocation.qlId === "NUM-QL-251") assert.deepEqual([...sourceSemantics], ["SOLUTION_CLASS"]);
  if (allocation.qlId === "NUM-QL-252") assert.deepEqual([...sourceSemantics], ["HIDDEN_NUMBER"]);
  if (allocation.qlId === "NUM-QL-253") {
    assert.deepEqual([...sourceSemantics], ["COMPLETE_VALID_SET"]);
    for (const representation of ["CONSTRAINT_TABLE", "ELIMINATION_GRID", "MINI_CASELET", "MULTI_STAGE_GRAPH"]) {
      assert.ok(representations.has(representation), `QL253 lost ${representation} representation`);
    }
  }
}

assert.equal(NUM_CP014_PERMANENT_QL_IDS.length, 6);
assert.equal(globalSourceCoverage.size, 20, "Permanent runtime failed to retain all 20 discovery prototypes");
for (const sourcePrototypeId of globalSourceCoverage) {
  assert.ok((sourceSeedCoverage[sourcePrototypeId]?.size ?? 0) >= 20, `${sourcePrototypeId}: permanent source-seed progression too narrow`);
}

const solutionClasses = new Set<string>();
for (let seed = 1; seed <= 80; seed += 1) solutionClasses.add(generateNumCp014Permanent("NUM-QL-251", seed).canonicalAnswer);
assert.deepEqual([...solutionClasses].sort(), ["NO_SOLUTION", "ONE_SOLUTION"], "QL251 lost a certified solution-class mode");

const p016PowerKinds = new Set<string>();
for (let seed = 1; seed <= 13 * 240; seed += 1) {
  const q = generateNumCp014Permanent("NUM-QL-248", seed);
  if (q.sourcePrototypeId === "NUM-CP014-PROT-016") p016PowerKinds.add(String(q.hiddenState.powerKind));
}
assert.deepEqual([...p016PowerKinds].sort(), ["CUBE", "SQUARE"], "QL248/P016 lost square/cube internal mode reachability");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_PERMANENT_ENGLISH_RUNTIME",
  qls: NUM_CP014_PERMANENT_QL_IDS.length,
  permanentRange: `${NUM_CP014_PERMANENT_QL_IDS[0]}..${NUM_CP014_PERMANENT_QL_IDS.at(-1)}`,
  packages,
  answerBindingChecks,
  ablationEvidenceChecks,
  sourcePrototypeCoverage: globalSourceCoverage.size,
  sourceSeedSelectionDecoupled: true,
  solutionClassModes: [...solutionClasses].sort(),
  p016PowerKinds: [...p016PowerKinds].sort(),
  nextFreeQl: "NUM-QL-254",
  downstreamGatesLocked: true,
}, null, 2));
