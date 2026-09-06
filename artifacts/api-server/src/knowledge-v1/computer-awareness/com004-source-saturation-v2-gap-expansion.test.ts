import { strict as assert } from "node:assert";

import {
  COM004_GAP_DECISIONS_V2,
  COM004_GAP_EVIDENCE_V2,
  COM004_V2_RESOLVED_V1_PROVISIONALS,
  auditCom004SourceSaturationV2GapExpansion,
} from "./com004-source-saturation-v2-gap-expansion";

const audit = auditCom004SourceSaturationV2GapExpansion();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.evidenceCount, 10);
assert.equal(audit.decisionCount, 12);
assert.equal(audit.punjabEvidenceIds.length >= 4, true);
assert.equal(audit.bankingEvidenceIds.length >= 3, true);
assert.equal(audit.promotedDecisionIds.length >= 4, true);
assert.equal(audit.provisionalDecisionIds.length >= 3, true);
assert.equal(audit.delegatedDecisionIds.length >= 3, true);
assert.equal(audit.negativeFormDecisionIds.length >= 5, true);
assert.equal(audit.statementSetDecisionIds.length >= 3, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.sourceSaturationClosed, false);
assert.equal(audit.mergeSplitClosed, false);
assert.equal(audit.productionReady, false);
assert.equal(audit.nextGate, "COM004_SOURCE_SATURATION_V2_EVIDENCE_CLOSURE_AND_MERGE_SPLIT");

for (const evidenceId of [
  "COM004-GAP-EV-001",
  "COM004-GAP-EV-003",
  "COM004-GAP-EV-004",
  "COM004-GAP-EV-005",
  "COM004-GAP-EV-008",
  "COM004-GAP-EV-009",
]) {
  assert.equal(COM004_GAP_EVIDENCE_V2.some((evidence) => evidence.evidenceId === evidenceId), true, `Missing ${evidenceId}`);
}

const browserDecision = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-001");
assert.ok(browserDecision);
assert.equal(browserDecision.disposition, "PROMOTE_KEEP");
assert.equal(browserDecision.linkedDiscoveryIds?.includes("WEB-DISC-006"), true);
assert.equal(browserDecision.queryForms.includes("NOT"), true);

const accessTech = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-007");
assert.ok(accessTech);
assert.equal(accessTech.disposition, "DELEGATE_COM005");

const bankingRules = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-008");
assert.ok(bankingRules);
assert.equal(bankingRules.disposition, "DELEGATE_BANKING_AWARENESS");

const security = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-009");
assert.ok(security);
assert.equal(security.disposition, "DELEGATE_COM006");

const mutableTrivia = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-011");
assert.ok(mutableTrivia);
assert.equal(mutableTrivia.disposition, "REJECT_MUTABLE_OR_SOURCE_THIN");

const queryVariant = COM004_GAP_DECISIONS_V2.find((decision) => decision.decisionId === "COM004-GAP-DEC-012");
assert.ok(queryVariant);
assert.equal(queryVariant.disposition, "MERGE_QUERY_VARIANT");
assert.deepEqual(new Set(queryVariant.queryForms), new Set(["NOT", "STATEMENT_SET"]));

assert.equal(Object.keys(COM004_V2_RESOLVED_V1_PROVISIONALS).length, 6);

console.log("[COM004-SOURCE-SATURATION-V2-GAP-EXPANSION]", audit);
