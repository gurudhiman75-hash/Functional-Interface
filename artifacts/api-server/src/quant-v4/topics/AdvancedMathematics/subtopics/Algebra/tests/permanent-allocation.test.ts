import {
  ALG_PERMANENT_ALLOCATION,
  ALG_PERMANENT_QL_IDS,
  ALG_RETAINED_CONTRACTS,
  auditAlgPermanentAllocation,
  getAlgPermanentAllocation,
  getAlgPermanentAllocationForFreezeKey,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const audit = auditAlgPermanentAllocation();
assert(audit.permanentQlCount === 43, "Algebra must allocate exactly 43 permanent QL identities");
assert(audit.firstQlId === "ALG-QL-001", "Algebra permanent range must start at ALG-QL-001");
assert(audit.lastQlId === "ALG-QL-043", "Algebra permanent range must end at ALG-QL-043");
assert(audit.uniqueQlCount === 43, "Algebra permanent QL IDs must be unique");
assert(audit.uniqueFreezeKeyCount === 43, "Every retained freeze key must map exactly once");
assert(audit.alg001Count === 19, "ALG-001 must own 19 retained contracts");
assert(audit.alg002Count === 24, "ALG-002 must own 24 retained contracts");
assert(audit.cp015Count === 0, "ALG-CP-015 must remain composition-only with zero permanent QLs");
assert(audit.contiguousIdRange, "Algebra permanent IDs must be contiguous ALG-QL-001..043");
assert(audit.lifecycleLocked, "Permanent identity allocation must not unlock later lifecycle gates");
assert(ALG_RETAINED_CONTRACTS.length === ALG_PERMANENT_QL_IDS.length, "Contract/ID count mismatch");

for (let index = 0; index < ALG_PERMANENT_ALLOCATION.length; index += 1) {
  const row = ALG_PERMANENT_ALLOCATION[index]!;
  const expectedQl = `ALG-QL-${String(index + 1).padStart(3, "0")}`;
  const expectedFreeze = `F-C${String(index + 1).padStart(3, "0")}`;
  assert(row.qlId === expectedQl, `Unexpected permanent QL at index ${index}`);
  assert(row.freezeKey === expectedFreeze, `Unexpected freeze-key order at index ${index}`);
  assert(getAlgPermanentAllocation(row.qlId) === row, `QL lookup mismatch for ${row.qlId}`);
  assert(getAlgPermanentAllocationForFreezeKey(row.freezeKey) === row, `Freeze-key lookup mismatch for ${row.freezeKey}`);
  assert(row.permanentIdentityFrozen, `${row.qlId} identity must be frozen`);
  assert(row.semanticContractFrozen, `${row.qlId} semantic contract must be frozen`);
  assert(!row.englishImplementationFrozen, `${row.qlId} must not falsely claim English freeze`);
  assert(!row.multilingualImplementationFrozen, `${row.qlId} must not falsely claim multilingual freeze`);
  assert(!row.active && !row.questionStudioDiscoverable && row.questionBankStatus === "NOT_STORED" && row.testEligibility === "INELIGIBLE" && !row.publiclyPublishable, `${row.qlId} leaked into a downstream lifecycle`);
}

for (let index = 0; index < 40; index += 1) {
  assert(ALG_PERMANENT_ALLOCATION[index]!.qlId === `ALG-QL-${String(index + 1).padStart(3, "0")}`, `V2 changed a V1 permanent identity at index ${index}`);
}

console.log("Algebra permanent allocation V2 passed: 43 unique inactive identities, ALG-QL-001..043, V1 IDs preserved");