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
  return [shared, stem, clues, options]
    .filter(Boolean)
    .join(" || ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const reviewProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "DISCOVERY_REVIEW_ONLY",
);
assert.equal(reviewProviders.length, 8);

const providerIds = new Set<string>();
const chapterIds = new Set<string>();
const allCandidateIds = new Set<string>();
const allFingerprints = new Map<string, string>();
const allSurfaces = new Map<string, string>();

for (const provider of reviewProviders) {
  assert.ok(!providerIds.has(provider.providerId), "Duplicate novelty provider id: " + provider.providerId);
  providerIds.add(provider.providerId);

  assert.ok(!chapterIds.has(provider.chapterId), "More than one active review provider currently owns chapter " + provider.chapterId);
  chapterIds.add(provider.chapterId);

  assert.equal(provider.questionStudioNoveltyMixActivated, false);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false);
  assert.equal(provider.humanReviewRequired, true);
  assert.equal(provider.permanentQlAllocationRequired, false);
  assert.ok(provider.parentQlIds.length > 0, provider.providerId + ": review provider must bind to existing parent QLs");
  assert.ok(provider.noveltyAxes.length > 0, provider.providerId + ": provider novelty axes missing");

  const expectedQlPrefix = provider.chapterId.split("-")[0] + "-QL-";
  for (const parentQlId of provider.parentQlIds) {
    assert.ok(
      parentQlId.startsWith(expectedQlPrefix),
      provider.providerId + ": parent QL crosses chapter ownership: " + parentQlId,
    );
  }

  const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
    (entry) => entry.topicDirectory === provider.topicDirectory,
  );
  assert.ok(inventory, provider.providerId + ": missing novelty inventory entry");
  assert.equal(inventory?.chapterId, provider.chapterId);
  assert.equal(inventory?.status, "CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW");
  assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);

  const language = provider.supportedLanguages.includes("en")
    ? "en"
    : provider.supportedLanguages[0]!;
  const batch = await generateReasoningNoveltyReviewBatchV1({
    providerId: provider.providerId,
    count: 6,
    seed: 9100,
    language,
  });

  assert.equal(batch.reviewOnly, true);
  assert.equal(batch.questionStudioNoveltyMixActivated, false);
  assert.equal(batch.candidates.length, 6);

  for (const rawCandidate of batch.candidates) {
    const candidate = rawCandidate as Record<string, unknown>;

    assert.equal(candidate.noveltyReviewProviderId, provider.providerId);
    assert.equal(candidate.reviewOnly, true);
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.provenance, "CONTROLLED_NOVEL");
    assert.equal(candidate.solverVerified, true);
    assert.equal(candidate.uniqueCorrectAnswer, true);
    assert.equal(candidate.plausibleDistractors, true);
    assert.equal(candidate.examNatural, true);
    assert.equal(candidate.falseHistoricalAttribution, false);

    const candidateAxes = Array.isArray(candidate.noveltyAxes)
      ? candidate.noveltyAxes.map(String)
      : [];
    assert.ok(candidateAxes.length > 0, provider.providerId + ": candidate novelty axes missing");
    for (const axis of candidateAxes) {
      assert.ok(
        (provider.noveltyAxes as readonly string[]).includes(axis),
        provider.providerId + ": candidate axis not declared by provider: " + axis,
      );
    }

    const candidateParents = Array.isArray(candidate.parentQlIds)
      ? candidate.parentQlIds.map(String)
      : [];
    for (const qlId of candidateParents) {
      assert.ok(
        provider.parentQlIds.includes(qlId),
        provider.providerId + ": candidate escaped provider parent-Ql authority: " + qlId,
      );
    }

    const candidateId = String(candidate.candidateId ?? "").trim();
    assert.ok(candidateId, provider.providerId + ": candidate id missing");
    assert.ok(!allCandidateIds.has(candidateId), "Cross-provider candidate-id collision: " + candidateId);
    allCandidateIds.add(candidateId);

    const fingerprint = String(
      candidate.semanticFingerprint
      ?? candidate.structuralFingerprint
      ?? candidate.contentFingerprint
      ?? "",
    ).trim();
    assert.ok(fingerprint, provider.providerId + ": semantic/structural fingerprint missing");
    const priorFingerprintOwner = allFingerprints.get(fingerprint);
    assert.equal(
      priorFingerprintOwner,
      undefined,
      provider.providerId + ": semantic fingerprint collides with " + priorFingerprintOwner,
    );
    allFingerprints.set(fingerprint, provider.providerId);

    const surface = normalizedSurface(candidate);
    assert.ok(surface.length > 20, provider.providerId + ": learner surface unexpectedly empty");
    const priorSurfaceOwner = allSurfaces.get(surface);
    assert.equal(
      priorSurfaceOwner,
      undefined,
      provider.providerId + ": exact normalized learner surface collides with " + priorSurfaceOwner,
    );
    allSurfaces.set(surface, provider.providerId);
  }
}

const reviewPack = await buildReasoningNoveltyReviewPackV1({
  samplesPerProvider: 3,
  seed: 9400,
});
for (const provider of reviewProviders) {
  assert.ok(reviewPack.includes(`## ${provider.chapterId} — ${provider.providerId}`));
}
assert.equal(
  (reviewPack.match(/\*\*Human review:\*\*/g) ?? []).length,
  reviewProviders.length * 3,
);
assert.equal(reviewPack.includes("PFC-001-CONTROLLED-NOVEL"), false);
assert.ok(reviewPack.includes("Production novelty mixing: **disabled**"));

const approvedProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "APPROVED_RUNTIME",
);
assert.deepEqual(
  approvedProviders.map((provider) => provider.providerId),
  ["PFC-001-CONTROLLED-NOVEL"],
);
assert.deepEqual(
  REASONING_V1_NOVELTY_PROVIDERS_V1
    .filter((provider) => provider.countsTowardAssemblyNoveltyNow)
    .map((provider) => provider.providerId),
  ["PFC-001-CONTROLLED-NOVEL"],
);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_FINAL_OVERLAP_OWNERSHIP_20261002",
  reviewProviderCount: reviewProviders.length,
  reviewedCandidateCount: allCandidateIds.size,
  uniqueFingerprintCount: allFingerprints.size,
  uniqueLearnerSurfaceCount: allSurfaces.size,
  reviewPackSampleCount: reviewProviders.length * 3,
  assemblyCreditedProviders: ["PFC-001-CONTROLLED-NOVEL"],
}, null, 2));
