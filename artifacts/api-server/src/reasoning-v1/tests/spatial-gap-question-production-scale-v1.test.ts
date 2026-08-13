import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  synthesizeSpatialGapQuestionProductionScaleV1,
  type SpatialGapQuestionProductionScaleAcceptedV1,
} from "../foundation/spatial/gap-question-production-scale-engine-v1";
import { SPATIAL_GAP_IDS_V1 } from "../foundation/spatial/gap-types-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function svgStrip(svgs: readonly string[], prefix: string): string {
  return `<div class="strip">${svgs.map((svg, index) => `<div class="figure"><div class="cap">${escapeHtml(prefix)} ${index + 1}</div>${svg}</div>`).join("")}</div>`;
}

const REQUESTED_PER_GAP = 200;
const SEED_PREFIX = "SPA-FND-001-GAP-QUESTION-PRODUCTION-SCALE-V1";
const result = synthesizeSpatialGapQuestionProductionScaleV1({
  seedPrefix: SEED_PREFIX,
  requestedPerGap: REQUESTED_PER_GAP,
});

assert(SPATIAL_GAP_IDS_V1.length === 19, `Expected 19 gap families, got ${SPATIAL_GAP_IDS_V1.length}.`);
assert(result.totalAccepted === 3800, `Expected 3800 accepted learner questions, got ${result.totalAccepted}.`);
assert(result.chapterCounts["FAN-001"] === 1000, `Expected FAN 1000, got ${result.chapterCounts["FAN-001"]}.`);
assert(result.chapterCounts["FCL-001"] === 1200, `Expected FCL 1200, got ${result.chapterCounts["FCL-001"]}.`);
assert(result.chapterCounts["FSR-001"] === 1600, `Expected FSR 1600, got ${result.chapterCounts["FSR-001"]}.`);
assert(result.correctSlotCounts.every((count) => count === 950), `Global slots are not A950/B950/C950/D950: ${result.correctSlotCounts.join("/")}.`);
assert(result.totalProfileRejects === 0, `Material profile identity collisions occurred: ${result.totalProfileRejects}.`);
assert(new Set(result.accepted.map((entry) => entry.question.contentFingerprint)).size === 3800, "Production-scale learner content is not globally unique.");
assert(new Set(result.accepted.map((entry) => entry.question.deliveryFingerprint)).size === 3800, "Production-scale learner delivery is not globally unique.");

for (const gapId of SPATIAL_GAP_IDS_V1) {
  assert(result.gapCounts[gapId] === REQUESTED_PER_GAP, `${gapId}: expected 200 accepted, got ${result.gapCounts[gapId]}.`);
  assert(result.materialProfileCountsByGap[gapId] === REQUESTED_PER_GAP, `${gapId}: expected 200 material profiles, got ${result.materialProfileCountsByGap[gapId]}.`);
  assert(result.correctSlotCountsByGap[gapId].every((count) => count === 50), `${gapId}: slots are not A50/B50/C50/D50: ${result.correctSlotCountsByGap[gapId].join("/")}.`);
  assert(result.attemptsByGap[gapId] <= result.materialProfileCapacityByGap[gapId], `${gapId}: attempts exceed declared material profile capacity.`);
  const entries = result.accepted.filter((entry) => entry.gapId === gapId);
  assert(new Set(entries.map((entry) => entry.materialProfile.id)).size === REQUESTED_PER_GAP, `${gapId}: material profile IDs are not unique.`);
}

for (const entry of result.accepted) {
  const question = entry.question;
  assert(question.options.length === 4, `${question.prototypeId}: expected four options.`);
  assert(question.options[question.correctOptionIndex]?.sceneFingerprint === question.solverEvidence.expectedCorrectSceneFingerprint, `${question.prototypeId}: correct solver fingerprint mismatch.`);
  assert(question.lifecycle.permanentQlId === null, `${question.prototypeId}: permanent QL leaked.`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `${question.prototypeId}: Question Studio discovery leaked.`);
  assert(question.lifecycle.questionBankWritable === false, `${question.prototypeId}: Question Bank write leaked.`);
  assert(question.lifecycle.testEligible === false, `${question.prototypeId}: test eligibility leaked.`);
  assert(question.lifecycle.publiclyPublishable === false, `${question.prototypeId}: publication leaked.`);
  assert(question.reviewMetadata.mobileReviewStatus === "ARTIFACT_READY_HUMAN_REVIEW_PENDING", `${question.prototypeId}: mobile review was falsely promoted.`);
  assert(question.reviewMetadata.englishFreezeStatus === "HUMAN_REVIEW_PENDING", `${question.prototypeId}: English freeze was falsely promoted.`);

  for (const scene of [...question.stimulusScenes, ...question.options.map((option) => option.scene)]) {
    const validation = validateSpatialScene(scene);
    assert(validation.ok, `${question.prototypeId}/${entry.materialProfile.id}: invalid scene.`);
  }
  const uniqueness = validateSpatialOptionUniqueness(question.options.map((option) => option.scene));
  assert(uniqueness.ok, `${question.prototypeId}/${entry.materialProfile.id}: options collapsed after material profiling.`);
}

const replay = synthesizeSpatialGapQuestionProductionScaleV1({
  seedPrefix: SEED_PREFIX,
  requestedPerGap: REQUESTED_PER_GAP,
});
assert(
  JSON.stringify(result.accepted.map((entry) => `${entry.materialProfile.id}::${entry.question.deliveryFingerprint}`)) ===
    JSON.stringify(replay.accepted.map((entry) => `${entry.materialProfile.id}::${entry.question.deliveryFingerprint}`)),
  "Production-scale material learner synthesis is not deterministic.",
);

const alternate = synthesizeSpatialGapQuestionProductionScaleV1({
  seedPrefix: `${SEED_PREFIX}-ALT`,
  requestedPerGap: 8,
});
for (const gapId of SPATIAL_GAP_IDS_V1) {
  const first = result.accepted.filter((entry) => entry.gapId === gapId).slice(0, 8).map((entry) => entry.question.contentFingerprint);
  const second = alternate.accepted.filter((entry) => entry.gapId === gapId).map((entry) => entry.question.contentFingerprint);
  assert(JSON.stringify(first) !== JSON.stringify(second), `${gapId}: alternate seed did not alter production learner content.`);
}

const reviewSamples: SpatialGapQuestionProductionScaleAcceptedV1[] = [];
for (const gapId of SPATIAL_GAP_IDS_V1) {
  const entries = result.accepted.filter((entry) => entry.gapId === gapId);
  reviewSamples.push(entries[0]!, entries[entries.length - 1]!);
}

const reviewJson = {
  version: "SPA-FND-001-GAP-QUESTION-PRODUCTION-SCALE-REVIEW-V1",
  seedPrefix: result.seedPrefix,
  requestedPerGap: result.requestedPerGap,
  totalAccepted: result.totalAccepted,
  totalAttempts: result.totalAttempts,
  totalDuplicateRejects: result.totalDuplicateRejects,
  attemptsByGap: result.attemptsByGap,
  duplicateRejectsByGap: result.duplicateRejectsByGap,
  materialProfileCapacityByGap: result.materialProfileCapacityByGap,
  samples: reviewSamples.map((entry) => ({
    gapId: entry.gapId,
    profileId: entry.materialProfile.id,
    profileMode: entry.materialProfile.mode,
    prototypeId: entry.question.prototypeId,
    correctOption: optionLetter(entry.question.correctOptionIndex),
    decisiveProperty: entry.question.solverEvidence.decisiveProperty,
    stemText: entry.question.stemText,
    explanation: entry.question.learnerExplanation,
    stimulusSvgs: entry.question.stimulusScenes.map((scene) => renderSpatialSceneToSvg(scene)),
    optionSvgs: entry.question.options.map((option) => renderSpatialSceneToSvg(option.scene)),
  })),
  reviewStatus: "EXPANDED_SCALE_ARTIFACT_READY_HUMAN_REVIEW_PENDING",
  englishFreezeStatus: "HUMAN_REVIEW_PENDING",
  lifecycle: result.lifecycle,
};

const cards = reviewJson.samples.map((sample, index) => `<article class="card"><h2>${index + 1}. ${escapeHtml(sample.gapId)} — ${escapeHtml(sample.profileId)}</h2><div class="meta">Correct: <strong>${sample.correctOption}</strong> · ${escapeHtml(sample.prototypeId)} · ${escapeHtml(sample.profileMode)}</div><p><strong>Stem:</strong> ${escapeHtml(sample.stemText)}</p><p><strong>Rule:</strong> ${escapeHtml(sample.decisiveProperty)}</p>${sample.stimulusSvgs.length ? `<h3>Stimulus</h3>${svgStrip(sample.stimulusSvgs, "Figure")}` : ""}<h3>Options</h3>${svgStrip(sample.optionSvgs, "Option")}<div class="explanation"><p><strong>Observe:</strong> ${escapeHtml(sample.explanation.observation)}</p><p><strong>Rule:</strong> ${escapeHtml(sample.explanation.rule)}</p><p><strong>Apply:</strong> ${escapeHtml(sample.explanation.application)}</p><p><strong>Check:</strong> ${escapeHtml(sample.explanation.check)}</p></div></article>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPA Gap Question Production Scale V1</title><style>body{font-family:Arial,sans-serif;margin:0;background:#f3f4f6;color:#181818}main{max-width:1180px;margin:auto;padding:24px}.summary,.card{background:#fff;border:1px solid #d8d8d8;border-radius:10px;padding:16px;margin:0 0 18px}.meta{font-size:12px;color:#5a5a5a}.strip{display:flex;flex-wrap:wrap;gap:10px}.figure{width:116px;border:1px solid #ddd;border-radius:8px;padding:5px;text-align:center}.figure svg{display:block;width:100%;height:auto}.cap{font-size:11px;color:#666}.explanation{background:#fafafa;border-left:3px solid #bbb;padding:8px 12px;margin-top:10px}.explanation p{margin:6px 0}@media(max-width:520px){main{padding:10px}.card{padding:10px}.figure{width:78px}.explanation{font-size:13px}}</style></head><body><main><div class="summary"><h1>SPA-FND-001 Gap Question Production Scale V1</h1><p>${result.totalAccepted} materially-profiled learner questions · ${result.requestedPerGap}/gap · A/B/C/D ${result.correctSlotCounts.join(" / ")}</p><p>Attempts ${result.totalAttempts} · canonical rejects ${result.totalDuplicateRejects} · 2 review samples per gap. Human English/mobile freeze remains pending.</p></div>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V1",
  scale: {
    auditedGaps: SPATIAL_GAP_IDS_V1.length,
    requestedPerGap: REQUESTED_PER_GAP,
    totalAccepted: result.totalAccepted,
    totalAttempts: result.totalAttempts,
    totalDuplicateRejects: result.totalDuplicateRejects,
    totalProfileRejects: result.totalProfileRejects,
    chapterCounts: result.chapterCounts,
    correctSlotCounts: result.correctSlotCounts,
    attemptsByGap: result.attemptsByGap,
    duplicateRejectsByGap: result.duplicateRejectsByGap,
    materialProfileCountsByGap: result.materialProfileCountsByGap,
    materialProfileCapacityByGap: result.materialProfileCapacityByGap,
  },
  checks: {
    exactNineteenGapCoverage: true,
    twoHundredMaterialProfilesPerGap: true,
    threeThousandEightHundredAccepted: true,
    fourUniqueOptionsEveryQuestion: true,
    allScenesValidate: true,
    globalContentUniqueness: true,
    deterministicReplay: true,
    alternateSeedDivergence: true,
    balancedSlotsPerGap: true,
    noPermanentQls: true,
    noQuestionStudioActivation: true,
    noQuestionBankWrites: true,
    noMockEligibility: true,
    noPublication: true,
    humanEnglishFreezeStillPending: true,
    humanMobileReviewStillPending: true,
  },
  review: {
    samples: reviewSamples.length,
    status: reviewJson.reviewStatus,
  },
  lifecycle: result.lifecycle,
  nextGate: "SPATIAL_ARCHETYPE_CONSOLIDATION_AND_PERMANENT_QL_PROPOSAL_V1",
};

const outputDir = join(process.cwd(), "dist", "reasoning-v1", "spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "spa-gap-question-production-scale-v1-evidence.json"), JSON.stringify(evidence, null, 2));
writeFileSync(join(outputDir, "spa-gap-question-production-scale-v1-review.json"), JSON.stringify(reviewJson, null, 2));
writeFileSync(join(outputDir, "spa-gap-question-production-scale-v1-review.html"), html);
console.log(JSON.stringify(evidence, null, 2));
