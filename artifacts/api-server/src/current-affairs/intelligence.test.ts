import assert from "node:assert/strict";

import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";
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

const notificationClaims = extractHeadlineFactClaims(
  "Department of Consumer Affairs Notifies Legal Metrology Indian Standard Time Rules 2026",
);
assert.ok(notificationClaims.some((claim) => claim.factKey === "acting_entity" && /Consumer Affairs/.test(claim.factValue)));
assert.ok(notificationClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "notifies"));
assert.ok(notificationClaims.some((claim) => claim.factKey === "action_subject" && /Legal Metrology/.test(claim.factValue)));

const plannedClaims = extractHeadlineFactClaims(
  "Vice President to Release Mission Rangeen Machhli 2031 Strategic Action Plan",
);
assert.ok(plannedClaims.some((claim) => claim.factKey === "acting_entity" && claim.factValue === "Vice President"));
assert.ok(plannedClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "scheduled release"));
assert.ok(plannedClaims.some((claim) => claim.factKey === "action_subject" && /Mission Rangeen/.test(claim.factValue)));

const plannedPassiveClaims = extractHeadlineFactClaims(
  "4th Indo-German Environment Forum to be held in New Delhi on September 1, 2026",
);
assert.ok(plannedPassiveClaims.some((claim) => claim.factKey === "initiative" && claim.factValue === "4th Indo-German Environment Forum"));
assert.ok(plannedPassiveClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "scheduled hold"));
assert.ok(plannedPassiveClaims.some((claim) => claim.factKey === "event_status" && claim.factValue === "to be held in New Delhi on September 1, 2026"));
assert.equal(plannedPassiveClaims.some((claim) => claim.factKey === "acting_entity"), false, "planned passive events must not invent an acting organisation from the subject");
assert.equal(plannedPassiveClaims.some((claim) => claim.factKey === "action_subject"), false, "planned passive events must not reduce the subject to a location/date tail");

const conductedClaims = extractHeadlineFactClaims(
  "NEET-PG 2026 Successfully Conducted Nationwide with Robust Security and Real-Time Monitoring",
);
assert.ok(conductedClaims.some((claim) => claim.factKey === "initiative" && claim.factValue === "NEET-PG 2026"));
assert.ok(conductedClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "conducted"));
assert.ok(conductedClaims.some((claim) => claim.factKey === "event_status" && /Nationwide/.test(claim.factValue)));

const inaugurationClaims = extractHeadlineFactClaims(
  "Vice President inaugurates Aranmula Uthrittathi Vallamkali",
);
assert.ok(inaugurationClaims.some((claim) => claim.factKey === "acting_entity" && claim.factValue === "Vice President"));
assert.ok(inaugurationClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "inaugurates"));
assert.ok(inaugurationClaims.some((claim) => claim.factKey === "action_subject" && /Vallamkali/.test(claim.factValue)));

// CP-049: exact headline structures from the 1-Sep-2026 production audit.
const scoTitle = "Prime Minister participates in the 26th SCO Summit in Bishkek, Kyrgyz Republic";
const scoClaims = extractHeadlineFactClaims(scoTitle);
assert.ok(scoClaims.some((claim) => claim.factKey === "acting_entity" && claim.factValue === "Prime Minister"));
assert.ok(scoClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "participates"));
assert.ok(scoClaims.some((claim) => claim.factKey === "action_subject" && /26th SCO Summit/i.test(claim.factValue)));
assert.equal(evaluateCurrentAffairsEditorialPriority({ title: scoTitle, category: "international" }).tier, "critical");

const shaktiTitle = "AVM SHAKTI SHARMA SCRIPTS HISTORY AS FIRST (NON-MEDICAL) WOMAN TWO-STAR OFFICER IN THE DEFENCE SERVICES";
const shaktiClaims = extractHeadlineFactClaims(shaktiTitle);
assert.ok(shaktiClaims.some((claim) => claim.factKey === "appointee" && claim.factValue === "AVM SHAKTI SHARMA"));
assert.ok(shaktiClaims.some((claim) => claim.factKey === "position" && /FIRST.*WOMAN TWO-STAR OFFICER/i.test(claim.factValue)));
assert.equal(evaluateCurrentAffairsEditorialPriority({ title: shaktiTitle, category: "defence" }).tier, "critical");

const takeoverClaims = extractHeadlineFactClaims("Air Marshal Sandeep Thareja takes over as DGAFMS");
assert.ok(takeoverClaims.some((claim) => claim.factKey === "appointee" && claim.factValue === "Air Marshal Sandeep Thareja"));
assert.ok(takeoverClaims.some((claim) => claim.factKey === "position" && claim.factValue === "DGAFMS"));

const assumedAppointmentClaims = extractHeadlineFactClaims(
  "SURGEON VICE ADMIRAL MANISH HONWAD, VSM ASSUMED THE APPOINTMENT OF DIRECTOR & COMMANDANT OF THE ARMED FORCES MEDICAL COLLEGE, PUNE",
);
assert.ok(assumedAppointmentClaims.some((claim) => claim.factKey === "appointee" && /MANISH HONWAD/i.test(claim.factValue)));
assert.ok(assumedAppointmentClaims.some((claim) => claim.factKey === "position" && /DIRECTOR & COMMANDANT/i.test(claim.factValue)));

const foodConferenceClaims = extractHeadlineFactClaims(
  "States/UTs Food Secretaries Conference reviews various issues pertaining to Department of Food and Public Distribution",
);
assert.ok(foodConferenceClaims.some((claim) => claim.factKey === "acting_entity" && claim.factValue === "States/UTs Food Secretaries Conference"));
assert.ok(foodConferenceClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "reviews"));
assert.ok(foodConferenceClaims.some((claim) => claim.factKey === "action_subject" && /various issues pertaining/i.test(claim.factValue)));
assert.equal(foodConferenceClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "issues"), false);

const ippbTitle = "India Post Payments Bank Celebrates 9th Foundation Day (IPPB Day 2026); launched DakPay Sound Box for Merchants and New Digital Platforms for Customers";
const ippbClaims = extractHeadlineFactClaims(ippbTitle);
assert.ok(ippbClaims.some((claim) => claim.factKey === "launching_entity" && claim.factValue === "India Post Payments Bank"));
assert.ok(ippbClaims.some((claim) => claim.factKey === "initiative" && /DakPay Sound Box/i.test(claim.factValue)));
assert.equal(evaluateCurrentAffairsEditorialPriority({ title: ippbTitle, category: "economy_banking" }).tier, "high");

const indiaDenmarkClaims = extractHeadlineFactClaims(
  "India–Denmark Strengthen Bilateral Cooperation in MSME Development, Innovation & Intellectual Property",
);
assert.ok(indiaDenmarkClaims.some((claim) => claim.factKey === "acting_entity" && /India–Denmark/.test(claim.factValue)));
assert.ok(indiaDenmarkClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "strengthen"));
assert.ok(indiaDenmarkClaims.some((claim) => claim.factKey === "action_subject" && /Bilateral Cooperation/i.test(claim.factValue)));

const bhashiniClaims = extractHeadlineFactClaims(
  "Digital India BHASHINI Division Organises BHASHINI SANGAM Workshop in Nepal; Strengthens India–Nepal Collaboration on Multilingual AI",
);
assert.ok(bhashiniClaims.some((claim) => claim.factKey === "acting_entity" && /Digital India BHASHINI Division/i.test(claim.factValue)));
assert.ok(bhashiniClaims.some((claim) => claim.factKey === "official_action" && claim.factValue === "organises"));
assert.ok(bhashiniClaims.some((claim) => claim.factKey === "action_subject" && /BHASHINI SANGAM Workshop/i.test(claim.factValue)));

assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Ministry of Coal holds Preparatory Meeting for Special Campaign 6.0", category: "national" }).tier,
  "routine",
);
assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Ministry of Earth Sciences launches Online National Quiz with MyGov to celebrate 20 years", category: "science_technology" }).tier,
  "routine",
);
assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Indian Railways approves ₹125 Crore Bhavnagar Para Yard Remodeling Project in Gujarat", category: "national" }).tier,
  "routine",
);
assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Indian Railways approves ₹170 Crore for Kavach 4.0 on remaining 712 Rkm of Moradabad Division", category: "national" }).tier,
  "standard",
);

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

console.log("Current Affairs CP-049 intelligence and important-headline recovery contracts passed");