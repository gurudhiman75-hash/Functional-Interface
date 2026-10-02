import assert from "node:assert/strict";
import {
  REASONING_V1_NOVELTY_INVENTORY_V1,
  reasoningNoveltyInventorySummaryV1,
} from "../shared/reasoning-novelty-inventory-v1";
import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
  reasoningNoveltyProviderSummaryV1,
} from "../shared/reasoning-novelty-provider-registry-v1";
import {
  generateReasoningNoveltyReviewBatchV1,
} from "../shared/reasoning-novelty-review-runtime-v1";
import {
  REASONING_V1_NOVELTY_GOVERNANCE_V1,
  auditReasoningNoveltyMixV1,
} from "../shared/reasoning-novelty-governance-v1";

const reviewProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "DISCOVERY_REVIEW_ONLY",
);
const approvedProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);

assert.equal(REASONING_V1_NOVELTY_INVENTORY_V1.length, 26);
assert.equal(reviewProviders.length, 7);
assert.equal(approvedProviders.length, 1);
assert.equal(approvedProviders[0]?.providerId, "PFC-001-CONTROLLED-NOVEL");
assert.equal(approvedProviders[0]?.countsTowardAssemblyNoveltyNow, true);

const inventoryTopics = new Set(REASONING_V1_NOVELTY_INVENTORY_V1.map((entry) => entry.topicDirectory));
for (const provider of REASONING_V1_NOVELTY_PROVIDERS_V1) {
  assert.ok(inventoryTopics.has(provider.topicDirectory), provider.providerId + ": provider missing from novelty inventory");
  assert.ok(provider.noveltyAxes.length > 0, provider.providerId + ": novelty axes missing");
  assert.equal(provider.permanentQlAllocationRequired, false, provider.providerId + ": novelty must not force a new QL");
}

const fingerprintsByProvider = new Map<string, Set<string>>();
const candidateIds = new Set<string>();
const sampleSeeds = [1200, 2200, 3200, 4200];

for (const provider of reviewProviders) {
  assert.equal(provider.questionStudioNoveltyMixActivated, false, provider.providerId + ": review provider mixing must stay disabled");
  assert.equal(provider.humanReviewRequired, true, provider.providerId + ": review provider must require human review");
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false, provider.providerId + ": unapproved provider cannot count toward assembly target");

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
    assert.equal(batch.candidates.length, 4);

    for (const candidate of batch.candidates as any[]) {
      assert.equal(candidate.provenance, "CONTROLLED_NOVEL", provider.providerId + ": wrong provenance");
      assert.equal(candidate.humanReviewRequired, true, provider.providerId + ": candidate review boundary opened");
      assert.equal(candidate.reviewOnly, true, provider.providerId + ": candidate not review-only");
      assert.equal(candidate.questionStudioNoveltyMixActivated, false, provider.providerId + ": candidate mixing activated");
      assert.equal(candidate.noveltyReviewProviderId, provider.providerId);
      assert.equal(candidate.falseHistoricalAttribution, false, provider.providerId + ": false PYQ/source attribution");
      assert.equal(candidate.solverVerified, true, provider.providerId + ": solver verification missing");
      assert.equal(candidate.uniqueCorrectAnswer, true, provider.providerId + ": answer not unique");
      assert.equal(candidate.plausibleDistractors, true, provider.providerId + ": distractor quality gate failed");
      assert.equal(candidate.examNatural, true, provider.providerId + ": exam-natural gate failed");
      assert.ok(Array.isArray(candidate.noveltyAxes) && candidate.noveltyAxes.length > 0, provider.providerId + ": substantive novelty axis missing");

      const id = String(candidate.candidateId ?? "");
      assert.ok(id.length > 0, provider.providerId + ": candidate id missing");
      candidateIds.add(provider.providerId + ":" + id);

      const fp = String(
        candidate.semanticFingerprint
        ?? candidate.structuralFingerprint
        ?? candidate.contentFingerprint
        ?? JSON.stringify([
          candidate.stem,
          candidate.sharedPrompt,
          candidate.clueTexts,
          candidate.options,
          candidate.answer,
          candidate.uniqueSolution,
        ]),
      );
      assert.ok(fp.length > 8, provider.providerId + ": fingerprint too thin");
      seen.add(fp);
    }
  }

  assert.ok(seen.size >= 8, provider.providerId + ": semantic diversity too thin across current-head review seeds (" + seen.size + ")");
  fingerprintsByProvider.set(provider.providerId, seen);
}

const providerSummary = reasoningNoveltyProviderSummaryV1();
assert.equal(providerSummary.providerCount, 8);
assert.deepEqual(providerSummary.approvedProviderIds, ["PFC-001-CONTROLLED-NOVEL"]);
assert.equal(providerSummary.reviewOnlyProviderIds.length, 7);
assert.deepEqual(providerSummary.assemblyCreditedProviderIds, ["PFC-001-CONTROLLED-NOVEL"]);

const inventorySummary = reasoningNoveltyInventorySummaryV1();
assert.equal(inventorySummary.topicCount, 26);
assert.deepEqual(inventorySummary.controlledNovelTargetCreditedTopics, ["Non-Verbal-Reasoning"]);

const syntheticAssembly = [
  ...Array.from({ length: 80 }, () => "SOURCE_BACKED_CORE" as const),
  ...Array.from({ length: 20 }, () => "CONTROLLED_NOVEL" as const),
];
const mixAudit = auditReasoningNoveltyMixV1(syntheticAssembly);
assert.equal(mixAudit.controlledNovelShare, REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.controlledNovelOperatingTarget);
assert.equal(mixAudit.withinOperatingBand, true);

const pendingDedicated = REASONING_V1_NOVELTY_INVENTORY_V1.filter(
  (entry) => entry.status === "DEDICATED_NOVELTY_AUDIT_PENDING",
);
assert.ok(pendingDedicated.length > 0, "Current inventory unexpectedly claims all chapters have completed novelty audit.");

console.log(JSON.stringify({
  status: "PASS_REASONING_CROSS_CHAPTER_NOVELTY_CURRENT_HEAD_20261002",
  inventoryTopicCount: REASONING_V1_NOVELTY_INVENTORY_V1.length,
  approvedRuntimeProviders: approvedProviders.map((provider) => provider.providerId),
  discoveryReviewProviders: reviewProviders.map((provider) => provider.providerId),
  reviewedCandidateCount: reviewProviders.length * sampleSeeds.length * 4,
  providerFingerprintCounts: Object.fromEntries(
    [...fingerprintsByProvider.entries()].map(([providerId, values]) => [providerId, values.size]),
  ),
  pendingDedicatedNoveltyAudits: pendingDedicated.map((entry) => entry.topicDirectory),
  currentAssemblyCreditedTopics: inventorySummary.controlledNovelTargetCreditedTopics,
}, null, 2));
