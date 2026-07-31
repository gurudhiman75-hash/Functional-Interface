import assert from "node:assert/strict";
import {
  auditMenCp008CandidateRegistry,
  MEN_CP_008_CANDIDATE_FAMILY_REGISTRY,
} from "./candidate-registry";

const audit = auditMenCp008CandidateRegistry();

assert.equal(audit.candidateFamilies, 48);
assert.equal(audit.mergeFamilies, 12);
assert.equal(audit.standaloneFamilies, 36);
assert.equal(audit.ancestryCount, 62);
assert.equal(audit.uniqueAncestryCount, 62);
assert.deepEqual(audit.duplicateAncestries, []);
assert.deepEqual(audit.missingAncestries, []);
assert.deepEqual(audit.foreignAncestries, []);
assert.equal(audit.uniqueCanonicalKeys, 48);
assert.equal(audit.candidateIdsContiguous, true);
assert.equal(audit.lifecycleLocked, true);
assert.ok(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.every((candidate) => candidate.permanentQlId === null));
assert.ok(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.every((candidate) => candidate.candidateId.startsWith("MEN-CP008-CAND-")));

console.log(
  `MEN-CP-008 candidate registry passed for ${audit.candidateFamilies} non-permanent families and ${audit.ancestryCount} prototype ancestries.`,
);
