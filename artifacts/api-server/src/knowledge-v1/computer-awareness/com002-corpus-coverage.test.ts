import { strict as assert } from "node:assert";
import { auditCom002CorpusCoverage } from "./com002-corpus-coverage";

const audit = auditCom002CorpusCoverage();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.status, "READY_FOR_EDITORIAL_REVIEW");
assert.equal(audit.factCount, 85);
assert.equal(audit.permanentQlCount, 13);
assert.equal(audit.coverage.length, 13);
assert.equal(audit.productionEligible, false);

for (const row of audit.coverage) {
  assert.equal(row.factCount > 0, true, `${row.qlId} has no candidate facts`);
  assert.equal(row.entityCount > 0, true, `${row.qlId} has no candidate entities`);
}

const byQl = new Map(audit.coverage.map((row) => [row.qlId, row]));
assert.equal((byQl.get("COM-002-QL-002")?.entityCount ?? 0) >= 6, true);
assert.equal((byQl.get("COM-002-QL-003")?.entityCount ?? 0) >= 10, true);
assert.equal((byQl.get("COM-002-QL-004")?.entityCount ?? 0) >= 5, true);
assert.equal((byQl.get("COM-002-QL-006")?.entityCount ?? 0) >= 5, true);
assert.equal((byQl.get("COM-002-QL-011")?.factCount ?? 0) >= 4, true);
assert.equal((byQl.get("COM-002-QL-013")?.cpIds.length ?? 0), 2);

console.log(`[com002-corpus-coverage] PASS facts=${audit.factCount} qls=${audit.permanentQlCount}`);
