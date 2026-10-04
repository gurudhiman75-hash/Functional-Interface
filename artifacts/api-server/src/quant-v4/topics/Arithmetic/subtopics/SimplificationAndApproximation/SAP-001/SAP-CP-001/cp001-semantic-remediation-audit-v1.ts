import assert from "node:assert/strict";
import {
  SAP_CP001_PERMANENT_QL_IDS,
  SAP_PERMANENT_QL_BY_ID,
} from "../../SAP-PERMANENT-QL-REGISTRY";
import { generateSapCp001PermanentEnglishPackage } from "./permanent-runtime/runtime";

const SEEDS = 64;
const rows: any[] = [];

for (const qlId of SAP_CP001_PERMANENT_QL_IDS) {
  const registry = SAP_PERMANENT_QL_BY_ID[qlId];
  const prototypes = registry.prototypeAncestry;
  const stems = new Set<string>();
  const states = new Set<string>();
  const answers = new Set<string>();
  const options = new Set<string>();
  const explanations = new Set<string>();
  const positions = new Set<number>();
  const duplicateStates = new Map<string, number>();
  const difficulties = new Set<string>();

  for (let seed = 1; seed <= SEEDS; seed += 1) {
    const prototypeId = prototypes[(seed - 1) % prototypes.length] as Parameters<typeof generateSapCp001PermanentEnglishPackage>[0];
    const sourceSeed = Math.floor((seed - 1) / prototypes.length) + 1;
    const q: any = generateSapCp001PermanentEnglishPackage(prototypeId, sourceSeed);

    assert.equal(q.permanentQlId, qlId, qlId + ": permanent QL drift");
    assert.equal(q.canonicalAnswer, q.verifierAnswer, qlId + ": verifier drift");
    assert.equal(q.options.length, 4, qlId + ": option count drift");
    assert.equal(new Set(q.options.map((o: any) => o.value)).size, 4, qlId + ": duplicate options");
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, qlId + ": answer/index drift");
    assert.equal(q.lifecycle.active, false, qlId + ": permanent lifecycle unexpectedly active");
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, qlId + ": permanent lifecycle unexpectedly discoverable");
    assert.equal(q.lifecycle.questionBankWritable, false, qlId + ": permanent lifecycle unexpectedly writable");
    assert.equal(q.lifecycle.testEligible, false, qlId + ": permanent lifecycle unexpectedly test eligible");
    assert.equal(q.lifecycle.publiclyPublishable, false, qlId + ": permanent lifecycle unexpectedly public");

    const stem = String(q.stem).trim().replace(/\s+/gu, " ");
    const fingerprint = String(q.technicalDetails.mathematicalFingerprint);
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
    options.add(q.options.map((o: any) => o.value).join(" | "));
    explanations.add(explanation);
    positions.add(Number(q.correctIndex));
    difficulties.add(String(q.difficulty));
    duplicateStates.set(fingerprint, (duplicateStates.get(fingerprint) ?? 0) + 1);
  }

  const repeatedStateCount = [...duplicateStates.values()].filter((count) => count > 1).length;
  const maxStateReuse = Math.max(...duplicateStates.values());

  rows.push({
    qlId,
    title: registry.title,
    prototypeCount: prototypes.length,
    stemCount: stems.size,
    mathematicalStateCount: states.size,
    answerCount: answers.size,
    optionSurfaceCount: options.size,
    explanationCount: explanations.size,
    answerPositionCount: positions.size,
    difficultyCount: difficulties.size,
    repeatedStateCount,
    maxStateReuse,
  });
}

const ql012 = rows.find((row) => row.qlId === "SAP-QL-012");
assert.equal(ql012.answerCount, 3, "SAP-QL-012: comparison authority should retain exactly three semantic answers");

console.log(JSON.stringify({
  version: "SAP-CP001-SEMANTIC-REMEDIATION-AUDIT-V1",
  seedsPerQl: SEEDS,
  qlCount: rows.length,
  rows,
}, null, 2));
console.log("PASS_SAP_CP001_SEMANTIC_REMEDIATION_AUDIT_V1");
