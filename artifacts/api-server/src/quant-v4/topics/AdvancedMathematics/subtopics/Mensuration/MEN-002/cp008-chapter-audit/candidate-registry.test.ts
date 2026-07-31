import assert from "node:assert/strict";
import {
  auditMenCp008CandidateRegistry,
  MEN_CP_008_CANDIDATE_FAMILY_REGISTRY,
} from "./candidate-registry";

const audit = auditMenCp008CandidateRegistry();

assert.equal(audit.candidateFamilies, 52);
assert.equal(audit.mergeFamilies, 12);
assert.equal(audit.standaloneFamilies, 40);
assert.equal(audit.ancestryCount, 66);
assert.equal(audit.uniqueAncestryCount, 66);
assert.deepEqual(audit.duplicateAncestries, []);
assert.deepEqual(audit.missingAncestries, []);
assert.deepEqual(audit.foreignAncestries, []);
assert.equal(audit.uniqueCanonicalKeys, 52);
assert.equal(audit.candidateIdsContiguous, true);
assert.equal(audit.lifecycleLocked, true);
assert.ok(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.every((candidate) => candidate.permanentQlId === null));
assert.ok(MEN_CP_008_CANDIDATE_FAMILY_REGISTRY.every((candidate) => candidate.candidateId.startsWith("MEN-CP008-CAND-")));

console.log(
  `MEN-CP-008 candidate registry passed for ${audit.candidateFamilies} source-closed non-permanent families and ${audit.ancestryCount} prototype ancestries.`,
);
