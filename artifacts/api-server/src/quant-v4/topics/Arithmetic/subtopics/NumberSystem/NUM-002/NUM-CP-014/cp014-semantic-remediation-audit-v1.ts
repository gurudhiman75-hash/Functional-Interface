import assert from "node:assert/strict";
import { NUM_CP014_PERMANENT_QL_IDS } from "./permanent-allocation";
import { generateNumCp014Permanent } from "./permanent-runtime";

const SEEDS_PER_QL = 64;
const perQl: any[] = [];

for (const qlId of NUM_CP014_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const explanations = new Set<string>();
  const optionSurfaces = new Set<string>();
  const prototypes = new Set<string>();
  const engineSets = new Set<string>();
  const answerPositions = new Set<number>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const q: any = generateNumCp014Permanent(qlId, seed);

    assert.equal(q.difficulty, "HARD", qlId + ": CP014 must remain HARD-only");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.verifierAnswer, q.canonicalAnswer, qlId + ": verifier drift");
    assert.ok(String(q.explanation.finalAnswer).includes(String(q.canonicalAnswer)), qlId + ": explanation answer drift");
    assert.ok(Array.isArray(q.componentEngines) && q.componentEngines.length >= 2, qlId + ": multi-engine evidence missing");
    assert.ok(q.ablation, qlId + ": ablation evidence missing");

    assert.equal(Boolean(q.lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(q.lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(q.lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(q.lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(q.lifecycle.mockTestEligible), false, qlId + ": mock-test gate opened");
    assert.equal(Boolean(q.lifecycle.publiclyPublishable), false, qlId + ": public gate opened");
    assert.equal(Boolean(q.lifecycle.automaticStudentPublication), false, qlId + ": automatic publication gate opened");

    const explanation = [
      q.explanation.coreConcept,
      q.explanation.strategy,
      ...q.explanation.steps,
      q.explanation.finalAnswer,
    ].join("\n");

    stems.add(String(q.stem));
    answers.add(String(q.canonicalAnswer));
    fingerprints.add(String(q.mathematicalFingerprint));
    explanations.add(explanation);
    optionSurfaces.add(q.options.map((o: any) => o.value).join(" | "));
    prototypes.add(String(q.sourcePrototypeId));
    engineSets.add([...q.componentEngines].sort().join("+"));
    answerPositions.add(Number(q.correctIndex));
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    stemCount: stems.size,
    answerCount: answers.size,
    answers: [...answers].sort(),
    fingerprintCount: fingerprints.size,
    explanationCount: explanations.size,
    optionSurfaceCount: optionSurfaces.size,
    prototypeCount: prototypes.size,
    engineSetCount: engineSets.size,
    answerPositionCount: answerPositions.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.stemCount >= 8, row.qlId + ": learner stem breadth below 8");
  assert.ok(row.fingerprintCount >= 16, row.qlId + ": mathematical-state breadth below 16");
  assert.ok(row.explanationCount >= 8, row.qlId + ": explanation diversity below 8");
  assert.ok(row.optionSurfaceCount >= 16, row.qlId + ": option-state breadth below 16");
  assert.equal(row.answerPositionCount, 4, row.qlId + ": all four answer positions must be exercised");
  assert.ok(row.minExplanationLength >= 700, row.qlId + ": synthesis explanation remains too thin");
}

const ql250 = perQl.find((row) => row.qlId === "NUM-QL-250");
assert.ok(ql250.prototypeCount >= 2, "NUM-QL-250: merged count authority must exercise both retained prototypes");
assert.ok(ql250.answerCount >= 4, "NUM-QL-250: exact-count authority lacks answer breadth over extended sampling");

const ql251 = perQl.find((row) => row.qlId === "NUM-QL-251");
assert.deepEqual(
  ql251.answers,
  ["NO_SOLUTION", "ONE_SOLUTION"],
  "NUM-QL-251: answer-impact class authority must remain exactly no-solution / one-solution",
);

console.log(JSON.stringify({
  version: "NUM-CP-014-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  hardOnly: true,
  semanticNotes: {
    "NUM-QL-250": "Merged exact-count authority should show broader numeric outcomes over extended sampling.",
    "NUM-QL-251": "Ablation-qualified solution-class authority intentionally retains only NO_SOLUTION and ONE_SOLUTION states.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP014_SEMANTIC_REMEDIATION_AUDIT_V1");
