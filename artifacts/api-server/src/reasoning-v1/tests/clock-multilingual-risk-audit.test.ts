import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_MULTILINGUAL_CLUSTER_RISK,
  CLOCK_MULTILINGUAL_RISK_AUDIT,
  CLOCK_MULTILINGUAL_RISK_POLICY,
  CLOCK_SHARED_TERMINOLOGY_AUTHORITY,
  CLOCK_TASK_CATALOG,
  clockMultilingualRiskSummary,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
assert.deepEqual(new Set(Object.keys(CLOCK_MULTILINGUAL_RISK_AUDIT)), new Set(taskIds));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("fast clock"));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("shown/displayed time"));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("strike/chime"));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("mirror image"));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("inclusive"));
assert(CLOCK_SHARED_TERMINOLOGY_AUTHORITY.includes("exclusive"));

for (const taskId of taskIds) {
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
  const risk = CLOCK_MULTILINGUAL_RISK_AUDIT[taskId];
  assert.equal(risk.taskId, taskId);
  assert.equal(risk.cluster, disposition.cluster);

  if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
    assert.equal(risk.riskLevel, "INTERNAL_ONLY");
    assert.equal(risk.reviewRequired, false);
  } else if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    assert.equal(risk.riskLevel, "NOT_FOR_CORE_LOCALISATION");
    assert.equal(risk.reviewRequired, false);
  } else {
    assert.equal(risk.reviewRequired, true);
    const clusterRisk = CLOCK_MULTILINGUAL_CLUSTER_RISK[disposition.cluster as keyof typeof CLOCK_MULTILINGUAL_CLUSTER_RISK];
    assert(clusterRisk, `Missing cluster risk for ${disposition.cluster}.`);
    assert(clusterRisk.terminology.length > 0);
    assert(clusterRisk.risks.length > 0);
    assert(clusterRisk.controls.length > 0);
  }
}

assert.equal(CLOCK_MULTILINGUAL_CLUSTER_RISK.EVENT_COUNT_IN_INTERVAL.riskLevel, "HIGH");
assert.equal(CLOCK_MULTILINGUAL_CLUSTER_RISK.UNIFORM_FAULTY_CLOCK_MAPPING.riskLevel, "HIGH");
assert.equal(CLOCK_MULTILINGUAL_CLUSTER_RISK.STRIKE_GAP_MECHANICS.riskLevel, "HIGH");
assert.equal(CLOCK_MULTILINGUAL_CLUSTER_RISK.VERTICAL_MIRROR_TIME.riskLevel, "HIGH");
assert.equal(CLOCK_MULTILINGUAL_CLUSTER_RISK.HAND_INTERCHANGE.riskLevel, "HIGH");
assert(CLOCK_MULTILINGUAL_CLUSTER_RISK.EVENT_COUNT_IN_INTERVAL.controls.some((value) => value.includes("Endpoint policy")));
assert(CLOCK_MULTILINGUAL_CLUSTER_RISK.STRIKE_GAP_MECHANICS.risks.some((value) => value.includes("n versus n−1")));

// Risk audit completion must not accidentally enable non-English generation.
for (const locale of ["hi-IN", "pa-IN"] as const) {
  assert.throws(
    () => generateClockQuestion({ taskId: "SMALLER_ANGLE_AT_TIME", seed: `CLK-LOCALE-BLOCK-${locale}`, locale }),
    /localisation is blocked/i,
  );
}

const summary = clockMultilingualRiskSummary();
assert.equal(summary.totalCandidateRows, 100);
assert(summary.coreRowsRequiringReview > 0);
assert(summary.lowRiskCoreRows > 0);
assert(summary.mediumRiskCoreRows > 0);
assert(summary.highRiskCoreRows > 0);
assert(summary.advancedHeldRows > 0);
assert.equal(summary.internalRows, 1);

assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.status, "MULTILINGUAL_RISK_AUDIT_COMPLETE__LOCALISATION_BLOCKED");
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.riskAuditComplete, true);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.englishFreezeRequiredBeforeLocalisation, true);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.hindiGenerationAllowed, false);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.punjabiGenerationAllowed, false);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.humanReviewRequiredPerLocale, true);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.answerParityRequired, true);
assert.equal(CLOCK_MULTILINGUAL_RISK_POLICY.permanentQlAllocationAllowed, false);

console.log(JSON.stringify({
  status: "PASS_CLK_001_MULTILINGUAL_RISK_AUDIT",
  ...summary,
  policy: CLOCK_MULTILINGUAL_RISK_POLICY,
}, null, 2));
