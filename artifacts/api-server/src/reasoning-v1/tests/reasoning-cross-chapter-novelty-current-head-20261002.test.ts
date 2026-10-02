import assert from "node:assert/strict";
import {
  REASONING_V1_NOVELTY_INVENTORY_V1,
  reasoningNoveltyInventorySummaryV1,
} from "../shared/reasoning-novelty-inventory-v1";
import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";
import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";
import {
  REASONING_V1_NOVELTY_GOVERNANCE_V1,
  auditReasoningNoveltyMixV1,
} from "../shared/reasoning-novelty-governance-v1";
import {
  REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1,
} from "../shared/reasoning-novelty-runtime-activation-v1";

const awaitingRouteProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE",
);
const approvedProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);

assert.equal(REASONING_V1_NOVELTY_INVENTORY_V1.length, 26);
assert.equal(awaitingRouteProviders.length, 1);
assert.equal(approvedProviders.length, 8);
assert.deepEqual(
  approvedProviders.map((provider) => provider.providerId),
  [
    "PFC-001-CONTROLLED-NOVEL",
    "ALP-001-TRANSFORMED-GAP",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "CAE-001-EDGE-FAMILIES",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "BLR-001-CODED-FILTERED-COUNT",
  ],
);

const inventoryTopics = new Set(REASONING_V1_NOVELTY_INVENTORY_V1.map((entry) => entry.topicDirectory));
for (const provider of REASONING_V1_NOVELTY_PROVIDERS_V1) {
  assert.ok(inventoryTopics.has(provider.topicDirectory), provider.providerId + ": provider missing from novelty inventory");
  assert.ok(provider.noveltyAxes.length > 0, provider.providerId + ": novelty axes missing");
  assert.equal(provider.permanentQlAllocationRequired, false, provider.providerId + ": novelty must not force a new QL");
}

const fingerprintsByProvider = new Map<string, Set<string>>();
const sampleSeeds = [1200, 2200, 3200, 4200];

for (const provider of awaitingRouteProviders) {
  assert.equal(provider.questionStudioNoveltyMixActivated, false);
  assert.equal(provider.humanReviewRequired, false);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false);

  const language = provider.supportedLanguages.includes("en") ? "en" as const : provider.supportedLanguages[0]!;
  const seen = new Set<string>();

  for (const seed of sampleSeeds) {
    const batch = await generateReasoningNoveltyReviewBatchV1({
      providerId: provider.providerId,
      language,
      count: 4,
      seed,
    });
    assert.equal(batch.reviewOnly, true);
    assert.equal(batch.questionStudioNoveltyMixActivated, false);
    assert.equal(batch.provider.providerId, provider.providerId);
    for (const candidate of batch.candidates as any[]) {
      assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
      assert.equal(candidate.reviewOnly, true);
      assert.equal(candidate.questionStudioNoveltyMixActivated, false);
      assert.equal(candidate.falseHistoricalAttribution, false);
      assert.equal(candidate.solverVerified, true);
      assert.equal(candidate.uniqueCorrectAnswer, true);
      assert.equal(candidate.plausibleDistractors, true);
      assert.equal(candidate.examNatural, true);
      const fp = String(candidate.semanticFingerprint ?? candidate.structuralFingerprint ?? candidate.contentFingerprint ?? "");
      assert.ok(fp.trim().length > 0);
      seen.add(fp);
    }
  }
  assert.ok(seen.size >= 8, provider.providerId + ": semantic diversity too thin across diagnostic seeds (" + seen.size + ")");
  fingerprintsByProvider.set(provider.providerId, seen);
}

for (const provider of approvedProviders) {
  assert.equal(provider.countsTowardAssemblyNoveltyNow, true);
  if (provider.providerId !== "PFC-001-CONTROLLED-NOVEL") {
    assert.equal(provider.questionStudioNoveltyMixActivated, true);
    assert.equal(provider.humanReviewRequired, false);
  }
}

const providerSummary = reasoningNoveltyProviderSummaryV1();
assert.equal(providerSummary.providerCount, 9);
assert.equal(providerSummary.approvedProviderIds.length, 8);
assert.equal(providerSummary.awaitingRouteProviderIds.length, 1);
assert.equal(providerSummary.reviewOnlyProviderIds.length, 0);
assert.equal(providerSummary.assemblyCreditedProviderIds.length, 8);

const inventorySummary = reasoningNoveltyInventorySummaryV1();
assert.equal(inventorySummary.topicCount, 26);
assert.deepEqual(
  inventorySummary.controlledNovelTargetCreditedTopics,
  ["Alphabet-Test", "Blood-Relations", "Calendar", "Cause-and-Effect", "Clocks", "Direction-Sense", "Mathematical-Operations", "Non-Verbal-Reasoning"].sort(),
);

const syntheticAssembly = [
  ...Array.from({ length: 80 }, () => "SOURCE_BACKED_CORE" as const),
  ...Array.from({ length: 20 }, () => "CONTROLLED_NOVEL" as const),
];
const mixAudit = auditReasoningNoveltyMixV1(syntheticAssembly);
assert.equal(mixAudit.controlledNovelShare, REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.controlledNovelOperatingTarget);
assert.equal(mixAudit.withinOperatingBand, true);

assert.equal(REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.liveQuestionStudioProviders.length, 7);
assert.equal(REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1.contentApprovedAwaitingQuestionStudioRoute.length, 1);

const pendingDedicated = REASONING_V1_NOVELTY_INVENTORY_V1.filter(
  (entry) => entry.status === "DEDICATED_NOVELTY_AUDIT_PENDING",
);
assert.equal(pendingDedicated.length, 0);

console.log(JSON.stringify({
  status: "PASS_REASONING_CROSS_CHAPTER_NOVELTY_CURRENT_HEAD_20261002",
  approvedRuntimeProviders: approvedProviders.map((provider) => provider.providerId),
  awaitingRouteProviders: awaitingRouteProviders.map((provider) => provider.providerId),
  providerFingerprintCounts: Object.fromEntries([...fingerprintsByProvider.entries()].map(([id, values]) => [id, values.size])),
  pendingDedicatedNoveltyAudits: 0,
}, null, 2));
