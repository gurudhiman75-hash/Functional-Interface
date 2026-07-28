import assert from "node:assert/strict";

import {
  COD_CP009_PERMANENT_CONTRACTS,
  type Cp009QlId,
} from "./cp009-permanent-contracts";
import { generateCp009Question } from "./cp009-runtime";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "text", "label"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  for (const key of ["members", "tokens", "words"] as const) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return stableStringify([...candidate].sort());
  }
  return stableStringify(record);
}

const expectedQlIds = Array.from({ length: 24 }, (_, index) => `COD-QL-${175 + index}`);
assert.deepEqual(COD_CP009_PERMANENT_CONTRACTS.map((contract) => contract.qlId), expectedQlIds);
assert.equal(COD_CP009_PERMANENT_CONTRACTS.length, 24);
assert.equal(new Set(COD_CP009_PERMANENT_CONTRACTS.map((contract) => contract.solveContractId)).size, 24);
assert.equal(new Set(COD_CP009_PERMANENT_CONTRACTS.map((contract) => contract.prototypeId)).size, 16);
assert.ok(COD_CP009_PERMANENT_CONTRACTS.every((contract) => !contract.publiclyPublishable));
assert.ok(COD_CP009_PERMANENT_CONTRACTS.every((contract) => !contract.questionStudioVisible));

const expectedTopologies = [
  "DIRECT_SINGLE_INTERSECTION",
  "CHAINED_SINGLETON_PROPAGATION",
  "SET_DIFFERENCE_ELIMINATION",
  "FORKED_EVIDENCE_JOIN",
  "GLOBAL_BIJECTION_DEDUCTION",
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
  "PHRASE_SET_COMPOSITION",
  "MISSING_MEMBER_COMPLETION",
  "RESOLVED_COMPONENT_COMPOSITION",
].sort();

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const topologies = new Set<string>();
const renderers = new Set<string>();
const questionFingerprintsByQl = new Map<Cp009QlId, Set<string>>();
const topologyReachByQl = new Map<Cp009QlId, Set<string>>();
let generatedCount = 0;

for (const contract of COD_CP009_PERMANENT_CONTRACTS) {
  const questionFingerprints = new Set<string>();
  const qlTopologies = new Set<string>();
  questionFingerprintsByQl.set(contract.qlId, questionFingerprints);
  topologyReachByQl.set(contract.qlId, qlTopologies);

  for (let seed = 1; seed <= 24; seed += 1) {
    const first = generateCp009Question(contract.qlId, seed);
    const repeat = generateCp009Question(contract.qlId, seed);
    assert.deepEqual(repeat, first, `${contract.qlId}/${seed} must be deterministic`);

    assert.equal(first.qlId, contract.qlId);
    assert.equal(first.permanentQlId, contract.qlId);
    assert.equal(first.checkpointId, "COD-CP-009");
    assert.equal(first.prototypeOnly, false);
    assert.equal(first.reviewOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioVisible, false);
    assert.equal(first.locale, "en-IN");
    assert.equal(first.renderer, "STATEMENT_CODE_GRID");
    assert.equal(first.metadata.runtimeVersion, "cod-cp009-runtime-v1");
    assert.equal(first.metadata.sourcePrototypeId, contract.prototypeId);
    assert.equal(first.metadata.sourceTopologyKind, first.topologyKind);
    assert.equal(first.metadata.solveContractId, contract.solveContractId);
    assert.ok(contract.topologyKinds.includes(first.topologyKind));
    assert.ok(!("prototypeId" in first), `${contract.qlId} must not expose prototype identity at top level`);

    assert.ok(first.stem.trim().length > 0);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map(optionSemanticValue)).size, 4, `${contract.qlId}/${seed} has duplicate options`);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    const correctness = first.options.map((option) => Boolean((option as Record<string, unknown>).isCorrect));
    assert.equal(correctness.filter(Boolean).length, 1);
    assert.equal(correctness[first.correctIndex], true);
    assert.ok(stableStringify(first.explanation).length > 20);
    assert.ok(Number(first.metadata.solutionCount) >= 1);

    answerPositions[first.correctIndex] += 1;
    difficulties.add(first.difficulty);
    topologies.add(first.topologyKind);
    renderers.add(first.renderer);
    qlTopologies.add(first.topologyKind);
    questionFingerprints.add(stableStringify({
      stem: first.stem,
      structuredPrompt: first.structuredPrompt,
      options: first.options.map(optionSemanticValue),
    }));
    generatedCount += 1;
  }

  assert.equal(questionFingerprints.size, 24, `${contract.qlId} must generate 24 distinct reviewed questions`);
  assert.deepEqual([...qlTopologies].sort(), [...contract.topologyKinds].sort(), `${contract.qlId} topology reach drifted`);
}

assert.equal(generatedCount, 576);
assert.ok(answerPositions.every((count) => count > 100), `Answer positions are imbalanced: ${answerPositions.join(", ")}`);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...topologies].sort(), expectedTopologies);
assert.deepEqual([...renderers], ["STATEMENT_CODE_GRID"]);

console.log("COD-CP-009 permanent English runtime audit passed.", {
  qlRange: "COD-QL-175..198",
  qlCount: COD_CP009_PERMANENT_CONTRACTS.length,
  generatedCount,
  prototypeTaskContracts: new Set(COD_CP009_PERMANENT_CONTRACTS.map((contract) => contract.prototypeId)).size,
  solveContracts: new Set(COD_CP009_PERMANENT_CONTRACTS.map((contract) => contract.solveContractId)).size,
  answerPositions,
  difficulties: [...difficulties],
  topologies: [...topologies],
});
