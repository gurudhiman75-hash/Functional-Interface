import assert from "node:assert/strict";

import { COD_CP010_PROTOTYPE_CONTRACTS } from "./cp010-prototype-contracts";
import { generateCp010PrototypeQuestion } from "./cp010-prototype-runtime";
import {
  CP010_ENGLISH_DISCOVERY_FREEZE_VERSION,
  CP010_EXCLUDED_EXPANSIONS,
  CP010_FREEZE_SEQUENCE_LOCK,
  CP010_FROZEN_ACTION_KINDS,
  CP010_FROZEN_DOMAINS,
  CP010_FROZEN_ENDPOINT_SIGNATURES,
  CP010_FROZEN_PROTOTYPE_IDS,
  CP010_FROZEN_SOLVE_CONTRACT_IDS,
  CP010_OWNERSHIP_DISPOSITIONS,
  CP010_SOURCE_EVIDENCE_LEDGER,
} from "./cp010-final-discovery-freeze";

assert.equal(CP010_ENGLISH_DISCOVERY_FREEZE_VERSION, "COD_CP010_ENGLISH_DISCOVERY_FREEZE_V1");
assert.deepEqual(
  COD_CP010_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  [...CP010_FROZEN_PROTOTYPE_IDS],
);
assert.deepEqual(
  COD_CP010_PROTOTYPE_CONTRACTS.map((contract) => contract.solveContractId),
  [...CP010_FROZEN_SOLVE_CONTRACT_IDS],
);
assert.deepEqual(COD_CP010_PROTOTYPE_CONTRACTS[0]?.supportedDomains, CP010_FROZEN_DOMAINS);
assert.equal(COD_CP010_PROTOTYPE_CONTRACTS.length, 1);
assert.equal(new Set(CP010_FROZEN_SOLVE_CONTRACT_IDS).size, 1);
assert.equal(new Set(CP010_FROZEN_ENDPOINT_SIGNATURES).size, 8);
assert.equal(new Set(CP010_FROZEN_ACTION_KINDS).size, 5);

assert.ok(CP010_SOURCE_EVIDENCE_LEDGER.length >= 4);
assert.ok(CP010_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.strength === "DIRECT_RECURRING"));
assert.ok(CP010_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.supports.includes("CLASS_WIDE_OVERRIDE")));
assert.ok(CP010_SOURCE_EVIDENCE_LEDGER.some((entry) => entry.supports.includes("ONE_SOLVE_CONTRACT")));

assert.deepEqual(
  CP010_OWNERSHIP_DISPOSITIONS.filter((entry) => entry.disposition === "INCLUDE"),
  [{ format: "explicit mutually exclusive conditional lookup table", owner: "COD-CP-010", disposition: "INCLUDE" }],
);
for (const owner of ["COD-CP-001", "COD-CP-007", "COD-CP-009", "OPS-001"]) {
  assert.ok(CP010_OWNERSHIP_DISPOSITIONS.some((entry) => entry.owner === owner));
}

for (const requiredExclusion of [
  "INVERSE_DECODE_WITH_NON_INJECTIVE_OVERRIDES",
  "MISSING_TOKEN_WITHOUT_RECURRING_SOURCE_EVIDENCE",
  "HIDDEN_CONDITION_INFERENCE",
  "OVERLAPPING_CONDITION_PRECEDENCE_WITHOUT_SOURCE_EVIDENCE",
  "DOMAIN_OR_ACTION_AS_SEPARATE_QL",
]) {
  assert.ok(CP010_EXCLUDED_EXPANSIONS.includes(requiredExclusion as never));
}

assert.deepEqual(CP010_FREEZE_SEQUENCE_LOCK, {
  permanentQlIdsAllocated: 0,
  currentChapterLastPermanentQlId: "COD-QL-198",
  nextAvailableQlId: "COD-QL-199",
  predecessorRequiredBeforeAllocation: "COD-CP-009",
  localisationAllowed: false,
  questionStudioAllowed: false,
  publicPublicationAllowed: false,
});

const reachedDomains = new Set<string>();
const reachedEndpointSignatures = new Set<string>();
const reachedActions = new Set<string>();
const reachedDifficulties = new Set<string>();
for (let seed = 0; seed < 80; seed += 1) {
  const question = generateCp010PrototypeQuestion(seed);
  reachedDomains.add(question.metadata.domain);
  reachedEndpointSignatures.add(`${question.metadata.domain}:${question.metadata.endpointSignature}`);
  reachedActions.add(question.metadata.actionKind);
  reachedDifficulties.add(question.difficulty);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.prototypeOnly, true);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.metadata.solverAgreement, true);
  assert.equal(question.metadata.mutuallyExclusiveConditions, true);
  assert.equal(question.metadata.precedenceRequired, false);
}

assert.deepEqual([...reachedDomains].sort(), [...CP010_FROZEN_DOMAINS].sort());
assert.deepEqual([...reachedEndpointSignatures].sort(), [...CP010_FROZEN_ENDPOINT_SIGNATURES].sort());
assert.deepEqual([...reachedActions].sort(), [...CP010_FROZEN_ACTION_KINDS].sort());
assert.deepEqual([...reachedDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log(JSON.stringify({
  freezeVersion: CP010_ENGLISH_DISCOVERY_FREEZE_VERSION,
  taskContracts: COD_CP010_PROTOTYPE_CONTRACTS.length,
  solveContracts: CP010_FROZEN_SOLVE_CONTRACT_IDS.length,
  domains: CP010_FROZEN_DOMAINS.length,
  endpointSignatures: CP010_FROZEN_ENDPOINT_SIGNATURES.length,
  actionKinds: CP010_FROZEN_ACTION_KINDS.length,
  permanentQlIdsAllocated: CP010_FREEZE_SEQUENCE_LOCK.permanentQlIdsAllocated,
  nextAvailableQlId: CP010_FREEZE_SEQUENCE_LOCK.nextAvailableQlId,
  verdict: "CP-010 ENGLISH DISCOVERY FROZEN; ONE PERMANENT QL MAY BE ALLOCATED AFTER MERGE",
}, null, 2));
