import assert from "node:assert/strict";
import { NUM_CP014_AUTHORITY_PROPOSAL } from "../wave04/merge-split-proposal.ts";
import { resolveNumCp014AuthorityCandidate } from "./freeze-readiness-projection.ts";

const sourceCoverage: Record<string, Set<string>> = {};
const sourceSeedCoverage: Record<string, Set<number>> = {};
const answerPositionCoverage: Record<string, Set<number>> = {};
const semanticCoverage: Record<string, Set<string>> = {};
const representationCoverage: Record<string, Set<string>> = {};
let projections = 0;

for (const authority of NUM_CP014_AUTHORITY_PROPOSAL) {
  sourceCoverage[authority.authorityId] = new Set();
  answerPositionCoverage[authority.authorityId] = new Set();
  semanticCoverage[authority.authorityId] = new Set();
  representationCoverage[authority.authorityId] = new Set();

  const sourceCount = authority.sourcePrototypeIds.length;
  const seedLimit = Math.max(160, sourceCount * 80);
  for (let authoritySeed = 1; authoritySeed <= seedLimit; authoritySeed += 1) {
    const projection = resolveNumCp014AuthorityCandidate(authority.authorityId, authoritySeed);
    const q = projection.sourcePackage as any;
    projections += 1;

    assert.equal(projection.sourceIndex, (authoritySeed - 1) % sourceCount);
    assert.equal(projection.sourceSeed, Math.floor((authoritySeed - 1) / sourceCount) + 1);
    assert.equal(projection.sourcePrototypeId, authority.sourcePrototypeIds[projection.sourceIndex]);
    assert.equal(q.temporaryPrototypeId, projection.sourcePrototypeId);
    assert.equal(q.checkpointId, "NUM-CP-014");
    assert.equal(q.lifecycle.permanentQlAllocated, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.notEqual(projection.answerSemantic, "undefined");

    sourceCoverage[authority.authorityId]!.add(projection.sourcePrototypeId);
    sourceSeedCoverage[projection.sourcePrototypeId] ??= new Set();
    sourceSeedCoverage[projection.sourcePrototypeId]!.add(projection.sourceSeed);
    answerPositionCoverage[authority.authorityId]!.add(Number(q.correctIndex));
    semanticCoverage[authority.authorityId]!.add(projection.answerSemantic);
    if (q.representation) representationCoverage[authority.authorityId]!.add(String(q.representation));

    assert.ok(!JSON.stringify(projection).includes("NUM-QL-248"), `${authority.authorityId}/${authoritySeed}: QL248 leaked before allocation`);
    assert.ok(!JSON.stringify(projection).includes("NUM-QL-253"), `${authority.authorityId}/${authoritySeed}: proposed QL leaked before allocation`);
  }

  assert.deepEqual(
    [...sourceCoverage[authority.authorityId]!].sort(),
    [...authority.sourcePrototypeIds].sort(),
    `${authority.authorityId}: source-prototype reachability incomplete`,
  );
  assert.deepEqual([...answerPositionCoverage[authority.authorityId]!].sort(), [0, 1, 2, 3], `${authority.authorityId}: answer-position reachability incomplete`);
  for (const sourcePrototypeId of authority.sourcePrototypeIds) {
    assert.ok((sourceSeedCoverage[sourcePrototypeId]?.size ?? 0) >= 20, `${authority.authorityId}/${sourcePrototypeId}: source-seed progression too narrow`);
  }
}

assert.deepEqual(
  [...semanticCoverage["NUM-CP014-AUTH-001"]!].sort(),
  ["DIGIT", "HIDDEN_BASE", "HIDDEN_DIVISOR", "HIDDEN_EXPONENT", "HIDDEN_NUMBER"].sort(),
  "AUTH-001 dynamic hidden-scalar answer semantics are not all reachable",
);
assert.deepEqual([...semanticCoverage["NUM-CP014-AUTH-002"]!].sort(), ["GREATEST_VALUE", "LEAST_VALUE"].sort());
assert.deepEqual([...semanticCoverage["NUM-CP014-AUTH-003"]!], ["COUNT"]);
assert.deepEqual([...semanticCoverage["NUM-CP014-AUTH-004"]!], ["SOLUTION_CLASS"]);
assert.deepEqual([...semanticCoverage["NUM-CP014-AUTH-005"]!], ["HIDDEN_NUMBER"]);
assert.deepEqual([...semanticCoverage["NUM-CP014-AUTH-006"]!], ["COMPLETE_VALID_SET"]);

const solutionClasses = new Set<string>();
for (let seed = 1; seed <= 80; seed += 1) {
  const q = resolveNumCp014AuthorityCandidate("NUM-CP014-AUTH-004", seed).sourcePackage as any;
  solutionClasses.add(String(q.canonicalAnswer));
}
assert.deepEqual([...solutionClasses].sort(), ["NO_SOLUTION", "ONE_SOLUTION"], "AUTH-004 lost one of its admitted solution-class modes");

const p016PowerKinds = new Set<string>();
for (let authoritySeed = 1; authoritySeed <= 13 * 240; authoritySeed += 1) {
  const projection = resolveNumCp014AuthorityCandidate("NUM-CP014-AUTH-001", authoritySeed);
  if (projection.sourcePrototypeId !== "NUM-CP014-PROT-016") continue;
  p016PowerKinds.add(String((projection.sourcePackage as any).hiddenState.powerKind));
}
assert.deepEqual([...p016PowerKinds].sort(), ["CUBE", "SQUARE"], "P016 square/cube internal modes are not both reachable through AUTH-001 projection");

for (const authorityId of ["NUM-CP014-AUTH-001", "NUM-CP014-AUTH-006"] as const) {
  assert.deepEqual(
    [...representationCoverage[authorityId]!].sort(),
    ["CONSTRAINT_TABLE", "ELIMINATION_GRID", "MINI_CASELET", "MULTI_STAGE_GRAPH"].sort(),
    `${authorityId}: executable representation coverage incomplete`,
  );
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_FREEZE_READINESS_PROJECTION",
  proposedAuthorities: NUM_CP014_AUTHORITY_PROPOSAL.length,
  projections,
  sourceSeedSelectionDecoupled: true,
  canonicalWave01RuntimeEnforced: true,
  normalizedLegacyAnswerSemantics: true,
  allSourcePrototypesReachable: true,
  dynamicHiddenScalarSemanticsReachable: true,
  solutionClassModesReachable: [...solutionClasses].sort(),
  p016PowerKindsReachable: [...p016PowerKinds].sort(),
  ql248Allocated: false,
}, null, 2));
