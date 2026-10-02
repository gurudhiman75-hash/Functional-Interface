import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { generateReasoningNoveltyReviewBatchV1 } from "../shared/reasoning-novelty-review-runtime-v1";
import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

const providers = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.status === "CONTENT_REVIEW_APPROVED_AWAITING_ROUTE",
);
assert.equal(providers.length, 3);

const forbiddenLearnerTokens = [
  "controlled-novel",
  "controlled novel",
  "semantic fingerprint",
  "solver",
  "candidate id",
  "question studio",
  "review-only",
  "ql-",
  "cp-",
];

let reviewed = 0;

for (const provider of providers) {
  assert.equal(provider.questionStudioNoveltyMixActivated, false);
  assert.equal(provider.humanReviewRequired, false);
  assert.equal(provider.countsTowardAssemblyNoveltyNow, false);

  const language = provider.supportedLanguages.includes("en")
    ? "en"
    : provider.supportedLanguages[0]!;
  const batch = await generateReasoningNoveltyReviewBatchV1({
    providerId: provider.providerId,
    count: 6,
    seed: 11200,
    language,
  });

  for (const raw of batch.candidates) {
    const candidate = raw as Record<string, unknown>;
    const sharedPrompt = String(candidate.sharedPrompt ?? "").trim();
    const stem = String(candidate.stem ?? "").trim();
    const clues = Array.isArray(candidate.clueTexts)
      ? candidate.clueTexts.map(String).filter(Boolean).join(" ")
      : "";
    const questionSurface = [sharedPrompt, clues, stem].filter(Boolean).join(" ").trim();
    const explanation = String(candidate.explanation ?? "").trim();
    const options = Array.isArray(candidate.options)
      ? candidate.options.map((value) => String(value).trim())
      : [];
    const answer = String(candidate.answer ?? "").trim();

    assert.ok(questionSurface.length >= 35, provider.providerId + ": learner question is too thin");
    assert.equal(options.length, 4, provider.providerId + ": human-review candidate must be a four-option MCQ");
    assert.equal(new Set(options).size, 4, provider.providerId + ": duplicate visible options");
    assert.ok(answer.length > 0, provider.providerId + ": answer missing");
    assert.ok(options.includes(answer), provider.providerId + ": answer is not one of the visible options");
    assert.ok(explanation.length >= 55, provider.providerId + ": worked explanation is missing or too thin");
    assert.ok(
      explanation.toLocaleLowerCase("en-IN").includes(answer.toLocaleLowerCase("en-IN"))
        || provider.providerId === "CAE-001-EDGE-FAMILIES",
      provider.providerId + ": explanation does not resolve to the learner answer",
    );

    const learnerText = [questionSurface, explanation].join(" ").toLocaleLowerCase("en-IN");
    for (const token of forbiddenLearnerTokens) {
      assert.equal(
        learnerText.includes(token),
        false,
        provider.providerId + ": internal token leaked into learner surface: " + token,
      );
    }

    assert.equal(candidate.reviewOnly, true);
    assert.equal(candidate.questionStudioNoveltyMixActivated, false);
    assert.equal(candidate.humanReviewRequired, true);
    assert.equal(candidate.solverVerified, true);
    assert.equal(candidate.uniqueCorrectAnswer, true);
    assert.equal(candidate.plausibleDistractors, true);
    assert.equal(candidate.examNatural, true);
    reviewed += 1;
  }
}

const pack = await buildReasoningNoveltyReviewPackV1({
  samplesPerProvider: 3,
  seed: 11300,
});
assert.equal(
  (pack.match(/\*\*Explanation:\*\*/g) ?? []).length,
  providers.length * 3,
);
assert.equal(pack.includes("(No learner explanation found.)"), false);
assert.equal(
  (pack.match(/\*\*Human review:\*\*/g) ?? []).length,
  providers.length * 3,
);
assert.ok(pack.includes("Production novelty mixing: **disabled**"));

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_HUMAN_REVIEW_READINESS_20261002",
  providerCount: providers.length,
  generatedCandidatesReviewed: reviewed,
  reviewPackSamples: providers.length * 3,
  productionMixingActivatedForTheseProviders: false,
}, null, 2));
