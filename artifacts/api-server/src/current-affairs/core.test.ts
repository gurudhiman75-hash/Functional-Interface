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

function familyRecommended(title: string, category: EventCandidateInput["category"], family: "ssc" | "banking" | "punjab") {
  const result = scoreExamRelevance({
    ...baseCandidate,
    title,
    category,
    sourceKey: category === "economy_banking" ? "rbi" : "pib",
    sourceUrl: category === "economy_banking" ? "https://www.rbi.org.in/example" : "https://www.pib.gov.in/example",
  });
  return result.find((score) => score.examFamily === family)?.includeRecommended ?? false;
}

// CP-045 regression set from the real 31-Aug-2026 master-pack audit.
const greenForge = "Union Minister inaugurates first of its kind Green Forge Complex at National Agri-food & Biomanufacturing Institute Mohali";
assert.equal(familyRecommended(greenForge, "national", "ssc"), true);
assert.equal(familyRecommended(greenForge, "national", "punjab"), true, "Mohali must create explicit Punjab fit");
assert.equal(familyRecommended(greenForge, "national", "banking"), false, "official national stories must not inherit Banking relevance");

const fisheries = "Union Minister to launch fisheries infrastructure projects worth Rs 36.49 Crore";
assert.equal(familyRecommended(fisheries, "national", "ssc"), true);
assert.equal(familyRecommended(fisheries, "national", "banking"), false);
assert.equal(familyRecommended(fisheries, "national", "punjab"), false);

const cenjowsLecture = "Raksha Rajya Mantri to inaugurate second Annual Trident Lecture of CENJOWS";
assert.equal(familyRecommended(cenjowsLecture, "defence", "ssc"), false, "routine lecture notices should not consume the daily pack");
assert.equal(familyRecommended(cenjowsLecture, "defence", "banking"), false);
assert.equal(familyRecommended(cenjowsLecture, "defence", "punjab"), false);

const cpgrams = "51st Monthly Report on CPGRAMS for Central Ministries Departments performance for July 2026";
assert.equal(familyRecommended(cpgrams, "reports_indices", "ssc"), false, "recurring administrative monthly reports require a substantive result signal");
assert.equal(familyRecommended(cpgrams, "reports_indices", "banking"), false);
assert.equal(familyRecommended(cpgrams, "reports_indices", "punjab"), false);

const vrrr = "7-day Variable Rate Reverse Repo (VRRR) auction under LAF on September 01, 2026";
assert.equal(familyRecommended(vrrr, "economy_banking", "banking"), false, "recurring liquidity-operation notices should not crowd the learner pack");
assert.equal(familyRecommended(vrrr, "economy_banking", "ssc"), false);

const gdp = "Quarterly Estimates of Gross Domestic Product for the First Quarter of 2026-27 record 7.8% growth";
assert.equal(familyRecommended(gdp, "economy_banking", "banking"), true);
assert.equal(familyRecommended(gdp, "economy_banking", "ssc"), true);

const upi = "NIPL agreement expands UPI merchant acceptance in Uzbekistan";
assert.equal(familyRecommended(upi, "economy_banking", "banking"), true);
assert.equal(familyRecommended(upi, "economy_banking", "ssc"), true);

const insNipun = "INS Nipun commissioned into the Indian Navy as the second Nistar-class Diving Support Vessel";
assert.equal(familyRecommended(insNipun, "defence", "ssc"), true);
assert.equal(familyRecommended(insNipun, "defence", "banking"), false);

const census2027 = "First phase of Census 2027 completed in Tamil Nadu";
assert.equal(familyRecommended(census2027, "national", "ssc"), true);
assert.equal(familyRecommended(census2027, "national", "banking"), false);

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

console.log("Current Affairs Studio core + CP-045 editorial-priority relevance contracts passed");