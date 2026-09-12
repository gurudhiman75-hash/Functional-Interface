import { strict as assert } from "node:assert";
import {
  auditCom002EditorialReview,
  COM002_EDITORIAL_FACT_DECISIONS,
  COM002_EDITORIAL_SUPPORT_FACTS,
  COM002_EDITORIAL_TARGET_FACTS,
  COM002_EDITORIAL_VALIDATOR_FACTS,
  COM002_EDITORIALLY_APPROVED_FACTS,
  getCom002EditorialDecision,
} from "./com002-editorial-review";

const audit = auditCom002EditorialReview();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 85);
assert.equal(audit.approvedCount, 85);
assert.equal(audit.targetFactCount, 74);
assert.equal(audit.supportFactCount, 10);
assert.equal(audit.validatorFactCount, 1);
assert.equal(audit.heldCount, 0);
assert.equal(audit.rejectedCount, 0);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);
assert.equal(COM002_EDITORIAL_FACT_DECISIONS.length, 85);
assert.equal(COM002_EDITORIALLY_APPROVED_FACTS.every((fact) => fact.review.status === "APPROVED"), true);
assert.equal(COM002_EDITORIALLY_APPROVED_FACTS.every((fact) => fact.review.reviewedBy === "COM002_EDITORIAL_REVIEW_V1"), true);
assert.equal(COM002_EDITORIAL_TARGET_FACTS.some((fact) => fact.factId === "com002-rtos-time-constraints"), true);
assert.equal(COM002_EDITORIAL_TARGET_FACTS.some((fact) => fact.factId === "com002-multi-user-os-property"), true);
assert.equal(COM002_EDITORIAL_SUPPORT_FACTS.some((fact) => fact.factId === "com002-cluster-os-property"), true);
assert.equal(COM002_EDITORIAL_SUPPORT_FACTS.some((fact) => fact.factId === "com002-process-scheduler-role"), true);
assert.equal(COM002_EDITORIAL_VALIDATOR_FACTS.some((fact) => fact.factId === "com002-nonlocal-delete-caveat"), true);
assert.equal(getCom002EditorialDecision("com002-extension-jpg")?.generationNotes?.length! > 0, true);
assert.equal(getCom002EditorialDecision("com002-extension-jpeg")?.generationNotes?.length! > 0, true);

console.log(`[com002-editorial-review] PASS approved=${audit.approvedCount} target=${audit.targetFactCount} support=${audit.supportFactCount} validator=${audit.validatorFactCount}`);
