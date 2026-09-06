import assert from "node:assert/strict";
import { auditCom004EditorialFactReview } from "./com004-editorial-fact-review";

const audit = auditCom004EditorialFactReview();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.decisionCount, 19);
assert.equal(audit.allocatableTaskIds.length, 18);
assert.deepEqual(audit.heldTaskIds, ["COM004-PT-012"]);
assert.equal(audit.readyForPermanentQlAllocation, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionEligible, false);
assert.equal(audit.nextGate, "COM004_PERMANENT_QL_ALLOCATION");
