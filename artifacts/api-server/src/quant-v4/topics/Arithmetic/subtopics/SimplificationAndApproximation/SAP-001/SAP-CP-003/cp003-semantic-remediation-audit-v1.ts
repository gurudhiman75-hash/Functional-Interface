import assert from "node:assert/strict";
import {
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  generateSapCp003PermanentPackage,
} from "./permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./types";

const SEEDS = 64;
const prototypeForQl = new Map(
  Object.entries(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL).map(([prototypeId, qlId]) => [qlId, prototypeId]),
);

const rows: any[] = [];

for (const qlId of SAP_CP003_PERMANENT_QL_IDS) {
  const prototypeId = prototypeForQl.get(qlId) as Parameters<typeof generateSapCp003PermanentPackage>[0];
  assert.ok(prototypeId, qlId + ": missing prototype mapping");

  const stems = new Set<string>();
  const payloads = new Set<string>();
  const answers = new Set<string>();
  const optionSurfaces = new Set<string>();
  const explanations = new Set<string>();
  const positions = new Set<number>();
  const difficulties = new Set<string>();

  for (let seed = 1; seed <= SEEDS; seed += 1) {
    const q: any = generateSapCp003PermanentPackage(prototypeId, seed);
    assert.equal(q.permanentQlId, qlId, qlId + ": permanent QL drift");
    assert.equal(q.canonicalAnswer, q.verifierAnswer, qlId + ": verifier drift");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");

    stems.add(String(q.stem).trim().replace(/\s+/gu, " "));
    payloads.add(String(q.canonicalPayloadKey));
    answers.add(String(q.canonicalAnswer));
    optionSurfaces.add(q.options.map((o: any) => o.value).join(" | "));
    explanations.add([
      q.explanation.coreConcept,
      ...q.explanation.steps,
      q.explanation.finalAnswer,
    ].join("\n"));
    positions.add(Number(q.correctIndex));
    difficulties.add(String(q.difficulty));
  }

  rows.push({
    qlId,
    prototypeId,
    stemCount: stems.size,
    payloadCount: payloads.size,
    answerCount: answers.size,
    answers: [...answers].sort(),
    optionSurfaceCount: optionSurfaces.size,
    explanationCount: explanations.size,
    answerPositionCount: positions.size,
    difficultyCount: difficulties.size,
  });
}

const ql050 = rows.find((row) => row.qlId === "SAP-QL-050");
assert.deepEqual(
  ql050.answers,
  ["A < B", "A = B", "A > B", "Cannot be determined"].sort(),
  "SAP-QL-050: comparison authority must retain its four exact semantic outcomes",
);
assert.equal(ql050.answerPositionCount, 4, "SAP-QL-050: comparison authority must exercise all answer positions");

const ql052 = rows.find((row) => row.qlId === "SAP-QL-052");
assert.deepEqual(
  ql052.answers,
  ["Step 1", "Step 2", "Step 3", "No error"].sort(),
  "SAP-QL-052: diagnostic authority must retain Step 1/2/3 and No error",
);
assert.equal(ql052.answerPositionCount, 4, "SAP-QL-052: diagnostic authority must exercise all answer positions");

for (const row of rows) {
  assert.ok(row.stemCount >= 16, row.qlId + ": stem breadth below 16 over 64 seeds");
  assert.ok(row.payloadCount >= 24, row.qlId + ": canonical payload breadth below 24");
  assert.equal(row.answerPositionCount, 4, row.qlId + ": all four answer positions must be exercised");
  if (row.qlId !== "SAP-QL-050" && row.qlId !== "SAP-QL-052") {
    assert.ok(row.optionSurfaceCount >= 12, row.qlId + ": option-surface breadth below 12");
  }
}

assert.equal(SAP_CP003_PROTOTYPE_IDS.length, 19);
assert.equal(rows.length, 19);

console.log(JSON.stringify({
  version: "SAP-CP003-SEMANTIC-REMEDIATION-AUDIT-V1",
  seedsPerQl: SEEDS,
  qlCount: rows.length,
  rows,
}, null, 2));
console.log("PASS_SAP_CP003_SEMANTIC_REMEDIATION_AUDIT_V1");
