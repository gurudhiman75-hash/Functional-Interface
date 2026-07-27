import assert from "node:assert/strict";

import { COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS } from "./complete-candidate-set-contracts";
import { generateCompleteCandidateSetPrototypeQuestion } from "./complete-candidate-set-generator";
import { EXACT_SET_MISSING_PROTOTYPE_CONTRACTS } from "./exact-set-missing-contracts";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import {
  CP009_ENGLISH_DISCOVERY_FREEZE_VERSION,
  CP009_EXCLUDED_FORMAL_EXPANSIONS,
  CP009_FREEZE_SEQUENCE_LOCK,
  CP009_FROZEN_EXACT_ATOMIC_TOPOLOGIES,
  CP009_FROZEN_INVERSE_PAIRS,
  CP009_FROZEN_TASK_CONTRACT_IDS,
  CP009_FROZEN_TOPOLOGY_FAMILIES,
  CP009_OWNERSHIP_DISPOSITIONS,
  CP009_SOURCE_EVIDENCE_LEDGER,
} from "./cp009-final-discovery-freeze";
import { POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS } from "./possible-impossible-contracts";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";
import { POSSIBLE_SET_PROTOTYPE_CONTRACTS } from "./possible-set-contracts";
import { generatePossibleSetPrototypeQuestion } from "./possible-set-generator";
import { EXACT_ATOMIC_PROTOTYPE_CONTRACTS } from "./prototype-contracts";
import { RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS } from "./resolved-composition-contracts";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";

interface QuestionLike {
  checkpointId: string;
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: boolean;
  publiclyPublishable: boolean;
  renderer: string;
  answerType: string;
  topologyKind: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "text", "label"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  for (const key of ["members", "tokens", "words"] as const) {
    const value = record[key];
    if (Array.isArray(value)) return stableStringify([...value].sort());
  }
  return stableStringify(record);
}

function numberMetadata(question: QuestionLike, key: string): number {
  const value = question.metadata[key];
  assert.equal(typeof value, "number", `${question.prototypeId} must expose numeric metadata '${key}'`);
  return value;
}

const combinedRegistry = [
  ...EXACT_ATOMIC_PROTOTYPE_CONTRACTS,
  ...EXACT_SET_MISSING_PROTOTYPE_CONTRACTS,
  ...POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS,
  ...POSSIBLE_SET_PROTOTYPE_CONTRACTS,
  ...RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS,
  ...COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS,
];

const registeredIds = combinedRegistry.map((contract) => contract.prototypeId);
assert.equal(CP009_ENGLISH_DISCOVERY_FREEZE_VERSION, "COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1");
assert.equal(combinedRegistry.length, 16, "Final CP-009 freeze must contain sixteen task contracts");
assert.equal(new Set(registeredIds).size, 16, "Frozen prototype IDs must be unique");
assert.deepEqual(
  [...registeredIds].sort(),
  [...CP009_FROZEN_TASK_CONTRACT_IDS].sort(),
  "Runtime registries differ from the frozen sixteen-contract inventory",
);

for (const contract of combinedRegistry) {
  assert.equal(contract.status, "PROTOTYPE", `${contract.prototypeId} must remain prototype-only before allocation`);
}

for (const [forwardId, inverseId] of CP009_FROZEN_INVERSE_PAIRS) {
  assert.ok(registeredIds.includes(forwardId), `Missing frozen forward contract ${forwardId}`);
  assert.ok(registeredIds.includes(inverseId), `Missing frozen inverse contract ${inverseId}`);
}
assert.equal(CP009_FROZEN_INVERSE_PAIRS.length, 8, "Freeze must retain eight forward/inverse pairs");

for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  assert.deepEqual(
    [...contract.supportedTopologies].sort(),
    [...CP009_FROZEN_EXACT_ATOMIC_TOPOLOGIES].sort(),
    `${contract.prototypeId} exact topology inventory drifted`,
  );
}

const solveModeFingerprints = new Set<string>();
for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  for (const topology of contract.supportedTopologies) solveModeFingerprints.add(`${contract.prototypeId}:${topology}`);
}
for (const contract of combinedRegistry) {
  if (!EXACT_ATOMIC_PROTOTYPE_CONTRACTS.some((entry) => entry.prototypeId === contract.prototypeId)) {
    solveModeFingerprints.add(contract.prototypeId);
  }
}
assert.equal(solveModeFingerprints.size, 24, "Final merge/split freeze must retain twenty-four solve contracts");
assert.equal(new Set(CP009_FROZEN_TOPOLOGY_FAMILIES).size, 10, "Freeze must contain ten topology families");

assert.ok(CP009_SOURCE_EVIDENCE_LEDGER.length >= 7, "Source ledger must record direct, corroborating and executable evidence");
assert.ok(
  CP009_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.strength === "INDEPENDENT_CORROBORATION"),
  "Possible-message coverage must have independent uploaded-source corroboration",
);
assert.ok(
  CP009_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.supports.includes("COMPLETE_CANDIDATE_DOMAIN")),
  "Either/or complete-candidate evidence is required",
);
assert.ok(
  CP009_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.supports.includes("RESOLVED_COMPONENT_COMPOSITION")),
  "Composed-message evidence is required",
);

const includedOwnership = CP009_OWNERSHIP_DISPOSITIONS.filter((entry) => entry.disposition === "INCLUDE");
assert.deepEqual(includedOwnership, [
  { format: "sentence/artificial-language word-token constraints", owner: "COD-CP-009", disposition: "INCLUDE" },
]);
for (const requiredOwner of ["COD-CP-001", "COD-CP-007", "COD-CP-008", "COD-CP-010", "OPS-001", "Data Sufficiency", "Puzzle", "Input-Output"]) {
  assert.ok(CP009_OWNERSHIP_DISPOSITIONS.some((entry) => entry.owner === requiredOwner), `Missing ownership disposition for ${requiredOwner}`);
}
assert.ok(CP009_EXCLUDED_FORMAL_EXPANSIONS.includes("IMPOSSIBLE_PHRASE_OR_SET_WITHOUT_DIRECT_SOURCE_EVIDENCE"));
assert.ok(CP009_EXCLUDED_FORMAL_EXPANSIONS.includes("DATA_SUFFICIENCY_WRAPPER"));

assert.equal(CP009_FREEZE_SEQUENCE_LOCK.permanentQlIdsAllocated, 0);
assert.equal(CP009_FREEZE_SEQUENCE_LOCK.currentChapterLastPermanentQlId, "COD-QL-168");
assert.deepEqual(CP009_FREEZE_SEQUENCE_LOCK.predecessorsRequiredBeforeAllocation, ["COD-CP-007", "COD-CP-008"]);
assert.equal(CP009_FREEZE_SEQUENCE_LOCK.localisationAllowed, false);
assert.equal(CP009_FREEZE_SEQUENCE_LOCK.questionStudioAllowed, false);
assert.equal(CP009_FREEZE_SEQUENCE_LOCK.publicPublicationAllowed, false);

const generated: QuestionLike[] = [];
for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  for (const topology of contract.supportedTopologies) {
    generated.push(generateExactAtomicPrototypeQuestion(contract.prototypeId, 17, topology) as QuestionLike);
  }
}
for (const contract of EXACT_SET_MISSING_PROTOTYPE_CONTRACTS) {
  generated.push(generateExactSetMissingPrototypeQuestion(contract.prototypeId, 19) as QuestionLike);
}
for (const contract of POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS) {
  for (const topology of contract.supportedTopologies) {
    generated.push(generatePossibleImpossiblePrototypeQuestion(contract.prototypeId, 23, topology) as QuestionLike);
  }
}
for (const contract of POSSIBLE_SET_PROTOTYPE_CONTRACTS) {
  for (const topology of contract.supportedTopologies) {
    generated.push(generatePossibleSetPrototypeQuestion(contract.prototypeId, 29, topology) as QuestionLike);
  }
}
for (const contract of RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS) {
  generated.push(generateResolvedCompositionPrototypeQuestion(contract.prototypeId, 31) as QuestionLike);
}
for (const contract of COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS) {
  for (const topology of contract.supportedTopologies) {
    generated.push(generateCompleteCandidateSetPrototypeQuestion(contract.prototypeId, 37, topology) as QuestionLike);
  }
}

assert.equal(generated.length, 30, "Final edge matrix must exercise every contract/topology pairing");
assert.deepEqual(
  [...new Set(generated.map((question) => question.topologyKind))].sort(),
  [...CP009_FROZEN_TOPOLOGY_FAMILIES].sort(),
  "Generated final edge matrix does not reach all frozen topologies",
);

for (const question of generated) {
  assert.equal(question.checkpointId, "COD-CP-009");
  assert.ok(CP009_FROZEN_TASK_CONTRACT_IDS.includes(question.prototypeId as never));
  assert.equal(question.permanentQlId, null);
  assert.equal(question.prototypeOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.renderer, "STATEMENT_CODE_GRID");
  assert.ok(question.stem.trim().length > 0);
  assert.equal(question.options.length, 4);
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  assert.equal(new Set(question.options.map(optionSemanticValue)).size, 4, `${question.prototypeId} has semantically duplicated options`);
  assert.ok(stableStringify(question.explanation).length > 20, `${question.prototypeId} has an incomplete explanation`);
  assert.ok(numberMetadata(question, "solutionCount") >= 1, `${question.prototypeId} must expose at least one valid mapping`);

  const optionCorrectness = question.options.map((option) => Boolean((option as Record<string, unknown>).isCorrect));
  assert.equal(optionCorrectness.filter(Boolean).length, 1, `${question.prototypeId} must mark exactly one correct option`);
  assert.equal(optionCorrectness[question.correctIndex], true, `${question.prototypeId} correctIndex does not match option truth`);

  const promptText = stableStringify(question.structuredPrompt).toLowerCase();
  assert.ok(!promptText.includes("datasufficiency"), `${question.prototypeId} leaked a Data Sufficiency wrapper`);
  assert.ok(!promptText.includes("lookupcondition"), `${question.prototypeId} leaked CP-010 conditional-table ownership`);
  assert.ok(!promptText.includes("renamingchain"), `${question.prototypeId} leaked CP-008 renaming ownership`);
  assert.ok(!promptText.includes("operatormapping"), `${question.prototypeId} leaked OPS ownership`);

  if (question.prototypeId.includes("EXACT-WORD-TO-TOKEN") || question.prototypeId.includes("EXACT-TOKEN-TO-WORD")) {
    assert.equal(numberMetadata(question, "targetCandidateCount"), 1);
  }

  if (question.prototypeId === "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS" || question.prototypeId === "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE") {
    assert.equal(question.metadata.individualPairAmbiguity, true);
    assert.equal(numberMetadata(question, "solutionCount"), 2);
  }

  if (question.prototypeId === "COD-CP009-PROT-MISSING-TOKEN" || question.prototypeId === "COD-CP009-PROT-MISSING-WORD") {
    assert.equal(numberMetadata(question, "exactResultCount"), 1);
    assert.match(promptText, /_____|\?/u, `${question.prototypeId} must visibly expose one missing member`);
  }

  if (question.prototypeId.includes("PROT-POSSIBLE-")) {
    const witnesses = numberMetadata(question, "correctWitnessCount");
    const solutions = numberMetadata(question, "solutionCount");
    assert.ok(witnesses > 0 && witnesses < solutions, `${question.prototypeId} must be genuinely possible but not definite`);
  }

  if (question.prototypeId.includes("IMPOSSIBLE-")) {
    assert.equal(numberMetadata(question, "correctWitnessCount"), 0, `${question.prototypeId} answer must have zero witnesses`);
  }

  if (question.prototypeId.includes("EXACT-RESOLVED-")) {
    assert.equal(numberMetadata(question, "solutionCount"), 1);
    assert.equal(question.metadata.bothBranchesRequired, true);
  }

  if (question.prototypeId.includes("COMPLETE-CODE-CANDIDATE-SET") || question.prototypeId.includes("COMPLETE-WORD-CANDIDATE-SET")) {
    const candidateCount = numberMetadata(question, "candidateCount");
    assert.ok(candidateCount === 2 || candidateCount === 3);
    const witnessCounts = question.metadata.candidateWitnessCounts as Record<string, number>;
    assert.ok(Object.keys(witnessCounts).length === candidateCount);
    assert.ok(Object.values(witnessCounts).every((count) => count > 0));
  }
}

console.log(JSON.stringify({
  freezeVersion: CP009_ENGLISH_DISCOVERY_FREEZE_VERSION,
  taskContracts: combinedRegistry.length,
  inversePairs: CP009_FROZEN_INVERSE_PAIRS.length,
  topologyFamilies: CP009_FROZEN_TOPOLOGY_FAMILIES.length,
  provisionalSolveContracts: solveModeFingerprints.size,
  finalEdgePairings: generated.length,
  permanentQlIdsAllocated: CP009_FREEZE_SEQUENCE_LOCK.permanentQlIdsAllocated,
  verdict: "CP-009 ENGLISH DISCOVERY AND OWNERSHIP FROZEN; PERMANENT ALLOCATION BLOCKED BY CP-007/CP-008",
}, null, 2));
