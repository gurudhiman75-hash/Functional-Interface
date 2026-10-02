import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";
import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

function normalizedSurface(candidate: Record<string, unknown>): string {
  const shared = String(candidate.sharedPrompt ?? "").trim();
  const stem = String(candidate.stem ?? "").trim();
  const clues = Array.isArray(candidate.clueTexts)
    ? candidate.clueTexts.map((value) => String(value ?? "").trim()).filter(Boolean).join(" | ")
    : "";
  const options = Array.isArray(candidate.options)
    ? candidate.options.map((value) => String(value ?? "").trim()).join(" | ")
    : "";
  return [shared, stem, clues, options].filter(Boolean).join(" || ").toLowerCase().replace(/\s+/g, " ").trim();
}

const awaitingRouteProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE",
);
assert.equal(awaitingRouteProviders.length, 5);

const providerIds = new Set<string>();
const chapterIds = new Set<string>();
const allCandidateIds = new Set<string>();
const allFingerprints = new Map<string, string>();
const allSurfaces = new Map<string, string>();

for (const provider of awaitingRouteProviders) {
  assert.ok(!providerIds.has(provider.providerId));
  providerIds.add(provider.providerId);
  assert.ok(!chapterIds.has(provider.chapterId));
  chapterIds.add(provider.chapterId);

  assert.equal(provider.questionStudioNoveltyMixActivated, false);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false);
  assert.equal(provider.humanReviewRequired, false);
  assert.equal(provider.permanentQlAllocationRequired, false);
  assert.ok(provider.parentQlIds.length > 0);

  const expectedQlPrefix = provider.chapterId.split("-")[0] + "-QL-";
  for (const parentQlId of provider.parentQlIds) {
    assert.ok(parentQlId.startsWith(expectedQlPrefix), provider.providerId + ": parent QL crosses chapter ownership: " + parentQlId);
  }

  const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
    (entry) => entry.topicDirectory === provider.topicDirectory,
  );
  assert.ok(inventory);
  assert.equal(inventory?.chapterId, provider.chapterId);
  assert.equal(inventory?.status, "CONTENT_REVIEW_APPROVED_AWAITING_QUESTION_STUDIO_ROUTE");
  assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);

  const language = provider.supportedLanguages.includes("en") ? "en" : provider.supportedLanguages[0]!;
  const batch = await generateReasoningNoveltyReviewBatchV1({
    providerId: provider.providerId,
    count: 6,
    seed: 9100,
    language,
  });

  for (const rawCandidate of batch.candidates) {
    const candidate = rawCandidate as Record<string, unknown>;
    assert.equal(candidate.noveltyReviewProviderId, provider.providerId);
    assert.equal(candidate.reviewOnly, true);
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.equal(candidate.solverVerified, true);
    assert.equal(candidate.uniqueCorrectAnswer, true);
    assert.equal(candidate.plausibleDistractors, true);
    assert.equal(candidate.examNatural, true);
    assert.equal(candidate.falseHistoricalAttribution, false);

    const candidateId = String(candidate.candidateId ?? "").trim();
    assert.ok(candidateId);
    assert.ok(!allCandidateIds.has(candidateId));
    allCandidateIds.add(candidateId);

    const fingerprint = String(
      candidate.semanticFingerprint
      ?? candidate.structuralFingerprint
      ?? candidate.contentFingerprint
      ?? JSON.stringify([candidate.sharedPrompt, candidate.stem, candidate.clueTexts, candidate.options, candidate.answer]),
    ).trim();
    assert.ok(fingerprint && fingerprint !== "[]");
    assert.equal(allFingerprints.get(fingerprint), undefined);
    allFingerprints.set(fingerprint, provider.providerId);

    const surface = normalizedSurface(candidate);
    assert.ok(surface.length > 20);
    assert.equal(allSurfaces.get(surface), undefined);
    allSurfaces.set(surface, provider.providerId);
  }
}

const reviewPack = await buildReasoningNoveltyReviewPackV1({
  samplesPerProvider: 3,
  seed: 9400,
});
for (const provider of awaitingRouteProviders) {
  assert.ok(reviewPack.includes(`## ${provider.chapterId} — ${provider.providerId}`));
}
assert.equal((reviewPack.match(/\*\*Human review:\*\*/g) ?? []).length, awaitingRouteProviders.length * 3);
assert.equal(reviewPack.includes("OPS-001-INFER-THEN-FILL"), false);
assert.equal(reviewPack.includes("CLK-001-FAULTY-TIME-ANGLE"), false);
assert.equal(reviewPack.includes("DIR-001-GRAPH-RELATIVE-PATH"), false);

const approvedProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);
assert.deepEqual(
  approvedProviders.map((provider) => provider.providerId),
  [
    "PFC-001-CONTROLLED-NOVEL",
    "OPS-001-INFER-THEN-FILL",
    "CLK-001-FAULTY-TIME-ANGLE",
    "DIR-001-GRAPH-RELATIVE-PATH",
  ],
);
assert.deepEqual(
  REASONING_V1_NOVELTY_PROVIDERS_V1
    .filter((provider) => provider.countsTowardAssemblyNoveltyNow)
    .map((provider) => provider.providerId),
  approvedProviders.map((provider) => provider.providerId),
);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_FINAL_OVERLAP_OWNERSHIP_20261002",
  awaitingRouteProviderCount: awaitingRouteProviders.length,
  reviewedCandidateCount: allCandidateIds.size,
  uniqueFingerprintCount: allFingerprints.size,
  uniqueLearnerSurfaceCount: allSurfaces.size,
  assemblyCreditedProviders: approvedProviders.map((provider) => provider.providerId),
}, null, 2));
