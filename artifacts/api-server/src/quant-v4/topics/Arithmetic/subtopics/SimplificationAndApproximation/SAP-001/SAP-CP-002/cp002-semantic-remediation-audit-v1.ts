import assert from "node:assert/strict";
import {
  SAP_CP002_PERMANENT_QL_IDS,
  SAP_PERMANENT_QL_BY_ID,
} from "../../SAP-PERMANENT-QL-REGISTRY";
import { generateSapCp002PermanentEnglishPackage } from "./permanent-runtime/runtime";

const SEEDS = 64;
const rows: any[] = [];

for (const qlId of SAP_CP002_PERMANENT_QL_IDS) {
  const registry = SAP_PERMANENT_QL_BY_ID[qlId];
  const prototypes = registry.prototypeAncestry;
  const stems = new Set<string>();
  const states = new Set<string>();
  const answers = new Set<string>();
  const optionSurfaces = new Set<string>();
  const explanations = new Set<string>();
  const positions = new Set<number>();
  const difficulties = new Set<string>();

  for (let seed = 1; seed <= SEEDS; seed += 1) {
    const prototypeId = prototypes[(seed - 1) % prototypes.length] as Parameters<typeof generateSapCp002PermanentEnglishPackage>[0];
    const sourceSeed = Math.floor((seed - 1) / prototypes.length) + 1;
    const q: any = generateSapCp002PermanentEnglishPackage(prototypeId, sourceSeed);

    assert.equal(q.permanentQlId, qlId, qlId + ": permanent QL drift");
    assert.equal(q.canonicalAnswer, q.verifierAnswer, qlId + ": verifier drift");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");

    const stem = String(q.stem).trim().replace(/\s+/gu, " ");
    const fingerprint = String(q.mathematicalFingerprint);
    const explanation = [
      q.explanation.coreConcept,
      q.explanation.givenDataAndStrategy,
      ...q.explanation.stepByStep,
      q.explanation.examSpeedMethod,
      q.explanation.finalAnswer,
    ].join("\n");

    stems.add(stem);
    states.add(fingerprint);
    answers.add(String(q.canonicalAnswer));
    optionSurfaces.add(q.options.map((o: any) => o.value).join(" | "));
    explanations.add(explanation);
    positions.add(Number(q.correctIndex));
    difficulties.add(String(q.difficulty));
  }

  rows.push({
    qlId,
    title: registry.title,
    prototypeCount: prototypes.length,
    stemCount: stems.size,
    mathematicalStateCount: states.size,
    answerCount: answers.size,
    answers: [...answers].sort(),
    optionSurfaceCount: optionSurfaces.size,
    explanationCount: explanations.size,
    answerPositionCount: positions.size,
    difficultyCount: difficulties.size,
  });
}

const ql031 = rows.find((row) => row.qlId === "SAP-QL-031");
assert.deepEqual(
  ql031.answers,
  ["<", "=", ">"].sort(),
  "SAP-QL-031: fraction comparison must retain exactly <, = and >",
);
assert.equal(ql031.answerPositionCount, 4, "SAP-QL-031: comparison answers must rotate across all four positions");
assert.equal(
  ql031.optionSurfaceCount,
  4,
  "SAP-QL-031: fixed comparison choices should produce exactly four meaningful option-order surfaces",
);

const ql033 = rows.find((row) => row.qlId === "SAP-QL-033");
assert.ok(ql033.answerCount >= 3, "SAP-QL-033: first-incorrect-step answer space collapsed below three");
assert.ok(ql033.mathematicalStateCount >= 24, "SAP-QL-033: diagnostic state breadth below 24");

for (const row of rows) {
  assert.ok(row.stemCount >= 16, row.qlId + ": stem breadth below 16 over 64 seeds");
  assert.ok(row.mathematicalStateCount >= 24, row.qlId + ": mathematical-state breadth below 24");
  if (row.qlId !== "SAP-QL-031") {
    assert.ok(row.optionSurfaceCount >= 12, row.qlId + ": option-surface breadth below 12");
  }
  assert.equal(row.answerPositionCount, 4, row.qlId + ": all four answer positions must be exercised");
}

console.log(JSON.stringify({
  version: "SAP-CP002-SEMANTIC-REMEDIATION-AUDIT-V1",
  seedsPerQl: SEEDS,
  qlCount: rows.length,
  rows,
}, null, 2));
console.log("PASS_SAP_CP002_SEMANTIC_REMEDIATION_AUDIT_V1");
