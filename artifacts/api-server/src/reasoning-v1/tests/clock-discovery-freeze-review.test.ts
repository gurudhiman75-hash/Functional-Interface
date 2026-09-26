import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  CLOCK_TASK_CATALOG,
  buildClockAuthorityAnchorReview,
  buildClockEndToEndReview,
  clockEffectiveDiscoveryAuditSummary,
  renderClockReviewHtml,
} from "../topics/Clocks/CLK-001/runtime";

const outputDir = resolve(process.cwd(), "dist/reasoning-v1/clock-v2");
mkdirSync(outputDir, { recursive: true });

const sourceDispositionReview = buildClockEndToEndReview({
  seedPrefix: "CLK-DISCOVERY-SOURCE-SIGNOFF",
  questionsPerTaskPerLocale: 1,
});
const authorityDifficultyReview = buildClockAuthorityAnchorReview({
  seedPrefix: "CLK-DISCOVERY-DIFFICULTY-SIGNOFF",
  questionsPerAnchorPerLocale: 3,
});

const anchorTaskIds = CLOCK_TASK_CATALOG
  .map(([taskId]) => taskId)
  .filter((taskId) => CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId].disposition === "PROVISIONAL_AUTHORITY_ANCHOR");

assert.equal(sourceDispositionReview.questionCount, 100);
assert.equal(sourceDispositionReview.selectedCandidateCount, 100);
assert.equal(authorityDifficultyReview.selectedCandidateCount, anchorTaskIds.length);
assert.equal(anchorTaskIds.length, 23);
assert.equal(authorityDifficultyReview.questionCount, 69);
assert.equal(sourceDispositionReview.localeCounts["hi-IN"], 0);
assert.equal(sourceDispositionReview.localeCounts["pa-IN"], 0);

for (const question of sourceDispositionReview.questions) {
  assert.equal(question.discoveryAudit.declaredSourceRegistrySaturationComplete, true);
  assert.equal(question.discoveryAudit.sourceSaturationComplete, false);
  assert.equal(question.discoveryAudit.authorityFrozen, false);
  assert.equal(question.discoveryAudit.permanentQlEligible, false);
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert(CLOCK_EFFECTIVE_SOURCE_AUDIT[question.taskId].evidenceRefs.length > 0);
}

for (const question of authorityDifficultyReview.questions) {
  assert.equal(question.discoveryAudit.candidateDisposition, "PROVISIONAL_AUTHORITY_ANCHOR");
  assert.equal(question.discoveryAudit.difficultyModel, "ITEM_LEVEL_V1");
  assert.equal(question.discoveryAudit.difficultyHumanCalibrationRequired, true);
  assert(question.discoveryAudit.difficultyFactors.length > 0);
}

const discoverySummary = clockEffectiveDiscoveryAuditSummary();
assert.deepEqual(discoverySummary.blockingGates, ["SOURCE_SATURATION_SIGN_OFF", "ITEM_LEVEL_DIFFICULTY_HUMAN_CALIBRATION"]);
assert.equal(discoverySummary.discoveryFreezeEligible, false);
assert.equal(discoverySummary.discoveryFrozen, false);

const decisionManifest = {
  schemaVersion: "CLK_DISCOVERY_FREEZE_REVIEW_V1",
  authority: "CLK-001-CLOCKS-MASTER-END-TO-END-DESIGN-V2.md",
  generatedAtPolicy: "DETERMINISTIC_NO_RUNTIME_TIMESTAMP",
  sourceCandidateRows: 100,
  provisionalAuthorityAnchors: anchorTaskIds.length,
  sourceSignoffQuestions: sourceDispositionReview.questionCount,
  difficultyCalibrationQuestions: authorityDifficultyReview.questionCount,
  blockingGates: discoverySummary.blockingGates,
  decisions: {
    sourceSaturationSignoff: "PENDING_HUMAN_REVIEW",
    itemLevelDifficultyCalibration: "PENDING_HUMAN_REVIEW",
    discoveryFreeze: "BLOCKED",
    authorityCountFreeze: "BLOCKED",
    permanentQlAllocation: "BLOCKED",
    englishEditorialFreeze: "BLOCKED",
    hindiPunjabiGeneration: "BLOCKED",
    questionStudioDiscovery: "BLOCKED",
    questionBankWrites: "BLOCKED",
    mockTestEligibility: "BLOCKED",
    publicPublication: "BLOCKED",
  },
  reviewerChecklist: [
    "Approve or reject source evidence and disposition for every candidate row.",
    "Confirm that no source-backed family is missing or incorrectly merged.",
    "Review three seeded examples for every provisional authority anchor.",
    "Approve item-level Foundation/Standard/Advanced calibration or record corrections.",
    "Confirm exam-natural stems, plausible options and question-specific explanations.",
    "Do not allocate permanent QLs until both blocking gates are explicitly approved.",
  ],
  discoveryPolicy: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY,
} as const;

const sourceHtmlPath = resolve(outputDir, "clk-001-source-saturation-human-review.html");
const difficultyHtmlPath = resolve(outputDir, "clk-001-item-difficulty-human-review.html");
const manifestPath = resolve(outputDir, "clk-001-discovery-freeze-review-manifest.json");
writeFileSync(sourceHtmlPath, renderClockReviewHtml(sourceDispositionReview), "utf8");
writeFileSync(difficultyHtmlPath, renderClockReviewHtml(authorityDifficultyReview), "utf8");
writeFileSync(manifestPath, `${JSON.stringify(decisionManifest, null, 2)}\n`, "utf8");

for (const path of [sourceHtmlPath, difficultyHtmlPath, manifestPath]) {
  assert(dirname(path) === outputDir);
}

console.log(JSON.stringify({
  status: "PASS_CLK_001_DISCOVERY_FREEZE_REVIEW_PACKET",
  sourceHtmlPath,
  difficultyHtmlPath,
  manifestPath,
  sourceSignoffQuestions: sourceDispositionReview.questionCount,
  difficultyCalibrationQuestions: authorityDifficultyReview.questionCount,
  blockingGates: discoverySummary.blockingGates,
}, null, 2));
