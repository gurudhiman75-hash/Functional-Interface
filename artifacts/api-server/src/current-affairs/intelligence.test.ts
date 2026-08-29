import assert from "node:assert/strict";

import {
  buildCandidateClusters,
  extractHeadlineFactClaims,
  reconcileFactClaims,
  sameEventSimilarity,
  shouldClusterTogether,
  type ClaimEvidence,
  type IntelligenceCandidate,
} from "./intelligence";

const rbiA: IntelligenceCandidate = {
  id: "a",
  title: "RBI launches digital payments initiative for small merchants",
  sourceKey: "rbi",
  sourceId: "source-rbi",
  sourceUrl: "https://www.rbi.org.in/a",
  publishedAt: "2026-08-29T03:00:00Z",
  categoryGuess: "economy_banking",
  keywords: ["rbi", "digital", "payments", "merchants"],
  trustScore: 0.98,
  isPrimarySource: true,
};

const rbiB: IntelligenceCandidate = {
  id: "b",
  title: "Reserve Bank launches digital payment initiative aimed at small merchants",
  sourceKey: "newswire",
  sourceUrl: "https://example.com/b",
  publishedAt: "2026-08-29T04:00:00Z",
  categoryGuess: "economy_banking",
  keywords: ["reserve", "bank", "digital", "payment", "merchants"],
  trustScore: 0.8,
  isPrimarySource: false,
};

const sports: IntelligenceCandidate = {
  id: "c",
  title: "India wins international hockey tournament",
  sourceKey: "sportswire",
  publishedAt: "2026-08-29T05:00:00Z",
  categoryGuess: "sports",
  keywords: ["hockey", "tournament"],
  trustScore: 0.72,
};

assert.ok(sameEventSimilarity(rbiA, rbiB) >= 0.52);
assert.equal(shouldClusterTogether(rbiA, rbiB).sameEvent, true);
assert.equal(shouldClusterTogether(rbiA, sports).sameEvent, false);

const clusters = buildCandidateClusters([rbiA, sports, rbiB]);
assert.equal(clusters.length, 2);
const bankingCluster = clusters.find((cluster) => cluster.categoryGuess === "economy_banking");
assert.ok(bankingCluster);
assert.equal(bankingCluster.members.length, 2);
assert.equal(bankingCluster.representative.sourceKey, "rbi", "primary trusted source should become representative");

const appointmentClaims = extractHeadlineFactClaims(
  "Asha Verma appointed as Chairperson of National Payments Council",
);
assert.ok(appointmentClaims.some((claim) => claim.factKey === "appointee" && claim.factValue === "Asha Verma"));
assert.ok(appointmentClaims.some((claim) => claim.factKey === "position"));

const numericClaims = extractHeadlineFactClaims(
  "Government launches ₹250 crore scheme with 12.5% subsidy",
);
assert.ok(numericClaims.some((claim) => claim.factKey === "amount"));
assert.ok(numericClaims.some((claim) => claim.factKey === "percentage" && claim.factValue === "12.5%"));

const corroborated: ClaimEvidence[] = [
  {
    factKey: "percentage",
    factValue: "6.5%",
    normalizedValue: "6 5",
    factType: "percentage",
    confidence: 0.9,
    extractionMethod: "rule",
    candidateId: "one",
    sourceKey: "wire1",
    trustScore: 0.8,
    isPrimaryEvidence: false,
  },
  {
    factKey: "percentage",
    factValue: "6.5%",
    normalizedValue: "6 5",
    factType: "percentage",
    confidence: 0.88,
    extractionMethod: "rule",
    candidateId: "two",
    sourceKey: "wire2",
    trustScore: 0.82,
    isPrimaryEvidence: false,
  },
];
const corroboratedResult = reconcileFactClaims(corroborated);
assert.equal(corroboratedResult.conflicts.length, 0);
assert.equal(corroboratedResult.facts[0]?.reconciliationStatus, "corroborated");
assert.equal(corroboratedResult.facts[0]?.supportCount, 2);

const conflict: ClaimEvidence[] = [
  {
    factKey: "amount",
    factValue: "₹7,400 crore",
    normalizedValue: "7400 crore",
    factType: "money",
    confidence: 0.9,
    extractionMethod: "manual",
    candidateId: "primary",
    sourceKey: "ministry",
    trustScore: 0.98,
    isPrimaryEvidence: true,
  },
  {
    factKey: "amount",
    factValue: "₹7,500 crore",
    normalizedValue: "7500 crore",
    factType: "money",
    confidence: 0.65,
    extractionMethod: "manual",
    candidateId: "secondary",
    sourceKey: "paper",
    trustScore: 0.65,
    isPrimaryEvidence: false,
  },
];
const conflictResult = reconcileFactClaims(conflict);
assert.equal(conflictResult.conflicts.length, 1);
assert.equal(conflictResult.facts[0]?.factValue, "₹7,400 crore");
assert.equal(conflictResult.facts[0]?.reconciliationStatus, "primary_backed");
assert.ok(conflictResult.conflicts[0]?.autoResolution);

const unresolvedConflict: ClaimEvidence[] = [
  { ...conflict[0]!, isPrimaryEvidence: false, sourceKey: "wireA", trustScore: 0.8 },
  { ...conflict[1]!, isPrimaryEvidence: false, sourceKey: "wireB", trustScore: 0.8, confidence: 0.9 },
];
const unresolved = reconcileFactClaims(unresolvedConflict);
assert.equal(unresolved.conflicts.length, 1);
assert.equal(unresolved.conflicts[0]?.autoResolution, undefined);
assert.equal(unresolved.facts.length, 0, "unresolved contradictions must not materialize a canonical fact");

console.log("Current Affairs Studio CP003 intelligence contracts passed");
