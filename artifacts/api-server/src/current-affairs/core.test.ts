import assert from "node:assert/strict";

import {
  canAutoVerify,
  currentAffairsFingerprint,
  renderEventMarkdown,
  scoreExamRelevance,
  sourceCandidateDedupeKey,
  validateEventCandidate,
  type EventCandidateInput,
} from "./core";

const baseCandidate: EventCandidateInput = {
  title: "Reserve Bank announces a new digital payments initiative",
  summary: "A verified policy-oriented current-affairs event.",
  importanceReason: "Relevant to banking and general awareness examinations.",
  eventDate: "2026-08-28",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceUrl: "https://www.rbi.org.in/example",
  sourceTrustScore: 0.98,
  isPrimarySource: true,
  facts: [
    { key: "Organisation", value: "Reserve Bank of India", type: "entity", confidence: 0.98 },
    { key: "Date", value: "28 August 2026", type: "date", confidence: 0.98 },
  ],
};

const normalized = validateEventCandidate(baseCandidate);
assert.equal(normalized.sourceKey, "rbi");
assert.equal(normalized.sourceTrustScore, 0.98);
assert.equal(normalized.facts?.length, 2);

const fingerprintA = currentAffairsFingerprint(baseCandidate);
const fingerprintB = currentAffairsFingerprint({
  ...baseCandidate,
  title: "Reserve Bank announces a new digital-payments initiative!",
});
assert.equal(fingerprintA, fingerprintB, "punctuation should not change an event fingerprint");
assert.notEqual(
  fingerprintA,
  currentAffairsFingerprint({ ...baseCandidate, eventDate: "2026-08-29" }),
  "event date must participate in fingerprinting",
);

assert.equal(
  sourceCandidateDedupeKey("rbi", "https://www.rbi.org.in/example", "A source headline").length,
  64,
);

const scores = scoreExamRelevance(baseCandidate);
const banking = scores.find((score) => score.examFamily === "banking");
const general = scores.find((score) => score.examFamily === "general");
const punjabForBankingStory = scores.find((score) => score.examFamily === "punjab");
assert.ok(banking);
assert.ok(general);
assert.ok(punjabForBankingStory);
assert.ok(banking.score > general.score, "banking events should receive a banking-specific relevance lift");
assert.equal(banking.includeRecommended, true);
assert.equal(punjabForBankingStory.includeRecommended, false, "strong official evidence must not make every banking story Punjab-relevant");

const environmentScores = scoreExamRelevance({
  ...baseCandidate,
  title: "National biodiversity forum announces a new conservation initiative",
  category: "environment",
});
assert.equal(environmentScores.find((score) => score.examFamily === "ssc")?.includeRecommended, true);
assert.equal(environmentScores.find((score) => score.examFamily === "banking")?.includeRecommended, false);
assert.equal(environmentScores.find((score) => score.examFamily === "punjab")?.includeRecommended, false);

const punjabScores = scoreExamRelevance({
  ...baseCandidate,
  title: "Punjab government announces a state examination initiative",
  category: "punjab",
});
assert.equal(punjabScores.find((score) => score.examFamily === "punjab")?.includeRecommended, true);
assert.equal(punjabScores.find((score) => score.examFamily === "banking")?.includeRecommended, false);
assert.equal(punjabScores.find((score) => score.examFamily === "ssc")?.includeRecommended, false);

const primaryDecision = canAutoVerify({
  evidence: [{ isPrimaryEvidence: true, trustScore: 0.95 }],
  factConfidences: [0.95, 0.94],
});
assert.equal(primaryDecision.allowed, true);
assert.ok(primaryDecision.confidence >= 0.78);

const weakDecision = canAutoVerify({
  evidence: [{ isPrimaryEvidence: false, trustScore: 0.55 }],
  factConfidences: [0.55],
});
assert.equal(weakDecision.allowed, false);

const markdown = renderEventMarkdown({
  title: "Example event",
  summary: "Example summary.",
  importanceReason: "Exam relevance.",
  facts: [{ key: "Organisation", value: "Example Authority" }],
});
assert.match(markdown, /## What happened/);
assert.match(markdown, /## Key facts/);
assert.match(markdown, /\*\*Organisation:\*\* Example Authority/);
assert.match(markdown, /## Why it matters for exams/);

console.log("Current Affairs Studio core + CP-043 relevance contracts passed");
