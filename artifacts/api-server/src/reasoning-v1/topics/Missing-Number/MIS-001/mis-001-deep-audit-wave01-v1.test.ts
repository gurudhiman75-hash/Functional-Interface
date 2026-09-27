import assert from "node:assert/strict";

import { MIS_CP004_RULES } from "./MIS-CP-004/rule-definitions";
import { MIS_CP008_RULES } from "./MIS-CP-008/rule-definitions";
import { MIS_CP009_RULES } from "./MIS-CP-009/rule-definitions";
import { MIS_CP012_PROFILES } from "./MIS-CP-012/rule-definitions";
import { MIS_001_QUESTION_STUDIO_PACKAGE } from "./question-studio-integration";
import { MIS_001_DEEP_AUDIT_WAVE01_V1 as audit } from "./mis-001-deep-audit-wave01-v1";

const metadata = MIS_001_QUESTION_STUDIO_PACKAGE.metadata as Record<string, any>;

assert.equal(audit.status, "CURRENT_RUNTIME_RECONCILED__SOURCE_SATURATION_OPEN");
assert.equal(audit.implementedCheckpoints.length, 12);
assert.equal(metadata.runtimePatternCount, audit.runtimePatternCount);
assert.equal(metadata.semanticAuthorityCount, audit.distinctSemanticAuthorityCount);
assert.equal(metadata.reusedSemanticVariantCount, audit.reuseOnlyVariantCount);
assert.equal(metadata.permanentQlCount, audit.permanentQlCount);

const actualReuse = new Map<string, string>();
for (const rule of MIS_CP008_RULES) {
  if (!rule.createsNewSemanticAuthority) actualReuse.set(rule.candidateId, rule.semanticAuthorityCandidateId);
}
for (const rule of MIS_CP009_RULES) {
  if (!rule.createsNewSemanticAuthority) actualReuse.set(rule.candidateId, rule.semanticAuthorityCandidateId);
}
for (const profile of MIS_CP012_PROFILES) {
  actualReuse.set(profile.candidateId, profile.semanticAuthorityCandidateId);
}

assert.equal(actualReuse.size, audit.reuseOnlyVariantCount);
assert.deepEqual(
  Object.fromEntries([...actualReuse.entries()].sort(([a],[b]) => a.localeCompare(b))),
  Object.fromEntries(Object.entries(audit.reuseOnlyVariants).sort(([a],[b]) => a.localeCompare(b))),
);

const sourceThin = MIS_CP004_RULES.filter((rule) => rule.sourceThin).map((rule) => rule.candidateId);
assert.deepEqual(sourceThin, ["MIS-CAND-034"]);

assert.equal(metadata.sourceSaturationComplete, false);
assert.equal(metadata.mergeSplitAuditComplete, false);
assert.equal(metadata.permanentQlAllocation, false);
assert.equal(metadata.englishEditorialFreezeComplete, false);
assert.equal(metadata.localizationStarted, false);

assert.equal(audit.lifecycle.sourceSaturationComplete, false);
assert.equal(audit.lifecycle.mergeSplitAuditComplete, false);
assert.equal(audit.lifecycle.permanentQlAllocation, false);
assert.equal(audit.lifecycle.englishEditorialFreezeComplete, false);
assert.equal(audit.lifecycle.localizationStarted, false);
assert.equal(audit.lifecycle.runtimeMode, "review-only");
assert.equal(audit.lifecycle.questionBankWritable, false);
assert.equal(audit.lifecycle.testEligible, false);
assert.equal(audit.lifecycle.mockTestEligible, false);
assert.equal(audit.lifecycle.publiclyPublishable, false);
assert.equal(audit.lifecycle.productionReleaseAuthorized, false);

assert.equal(audit.nextWave, "SOURCE_SATURATION_AND_AUTHORITY_OWNERSHIP");

console.log(JSON.stringify({
  verdict: "PASS_MIS_001_DEEP_AUDIT_WAVE01",
  runtimePatterns: audit.runtimePatternCount,
  semanticAuthorities: audit.distinctSemanticAuthorityCount,
  reuseOnlyVariants: audit.reuseOnlyVariantCount,
  sourceThin,
  permanentQlCount: audit.permanentQlCount,
  nextWave: audit.nextWave,
}, null, 2));
