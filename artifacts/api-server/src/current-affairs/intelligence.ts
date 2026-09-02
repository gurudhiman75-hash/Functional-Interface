import { createHash, randomUUID } from "node:crypto";

import {
  normalizeCurrentAffairsText,
  type CurrentAffairsCategory,
} from "./core";

export type IntelligenceCandidate = {
  id: string;
  title: string;
  sourceKey: string;
  sourceId?: string;
  sourceUrl?: string | null;
  publishedAt?: string | null;
  categoryGuess?: CurrentAffairsCategory | null;
  keywords?: string[];
  trustScore?: number;
  isPrimarySource?: boolean;
};

export type ClusterDraft = {
  id: string;
  representative: IntelligenceCandidate;
  members: Array<{ candidate: IntelligenceCandidate; similarity: number }>;
  categoryGuess: CurrentAffairsCategory;
  eventDateGuess: string;
  confidence: number;
  fingerprint: string;
};

export type FactClaim = {
  factKey: string;
  factValue: string;
  normalizedValue: string;
  factType: "string" | "number" | "date" | "money" | "percentage" | "entity" | "boolean";
  confidence: number;
  extractionMethod: "rule" | "structured_feed" | "model" | "manual";
};

export type ClaimEvidence = FactClaim & {
  candidateId?: string;
  sourceKey?: string;
  sourceId?: string;
  trustScore?: number;
  isPrimaryEvidence?: boolean;
};

export type ReconciledFact = {
  factKey: string;
  factValue: string;
  factType: FactClaim["factType"];
  confidence: number;
  supportCount: number;
  primarySupportCount: number;
  reconciliationStatus: "corroborated" | "primary_backed" | "manual";
  provenance: Array<{
    candidateId?: string;
    sourceKey?: string;
    confidence: number;
    primary: boolean;
  }>;
};

export type FactConflict = {
  factKey: string;
  values: Array<{
    value: string;
    normalizedValue: string;
    supportCount: number;
    primarySupportCount: number;
    weightedSupport: number;
  }>;
  autoResolution?: ReconciledFact;
  resolutionReason?: string;
};

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "into", "after", "before",
  "over", "under", "about", "india", "indian", "new", "says", "said", "amid", "as",
  "at", "by", "in", "of", "on", "to", "a", "an", "is", "are", "was", "were",
]);

function bounded(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function titleTokens(value: string): Set<string> {
  return new Set(
    normalizeCurrentAffairsText(value)
      .split(" ")
      .filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
  );
}

function intersectionSize<T>(a: Set<T>, b: Set<T>) {
  let count = 0;
  for (const value of a) if (b.has(value)) count += 1;
  return count;
}

function jaccard(a: Set<string>, b: Set<string>) {
  if (a.size === 0 || b.size === 0) return 0;
  const intersection = intersectionSize(a, b);
  return intersection / (a.size + b.size - intersection);
}

function candidateDate(candidate: IntelligenceCandidate): Date | null {
  if (!candidate.publishedAt) return null;
  const parsed = new Date(candidate.publishedAt);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateDistanceDays(a: IntelligenceCandidate, b: IntelligenceCandidate) {
  const dateA = candidateDate(a);
  const dateB = candidateDate(b);
  if (!dateA || !dateB) return null;
  return Math.abs(dateA.getTime() - dateB.getTime()) / 86_400_000;
}

function numberTokens(value: string) {
  return new Set(normalizeCurrentAffairsText(value).match(/\b\d+(?:\.\d+)?\b/g) ?? []);
}

function keywordSet(candidate: IntelligenceCandidate) {
  return new Set((candidate.keywords ?? []).map(normalizeCurrentAffairsText).filter(Boolean));
}

export function sameEventSimilarity(a: IntelligenceCandidate, b: IntelligenceCandidate): number {
  if (a.id === b.id) return 1;
  const dayDistance = dateDistanceDays(a, b);
  if (dayDistance !== null && dayDistance > 7) return 0;

  const titleScore = jaccard(titleTokens(a.title), titleTokens(b.title));
  const keywordScore = jaccard(keywordSet(a), keywordSet(b));
  const numbersA = numberTokens(a.title);
  const numbersB = numberTokens(b.title);
  const numberScore = numbersA.size === 0 && numbersB.size === 0
    ? 0.5
    : jaccard(numbersA, numbersB);
  const categoryScore = a.categoryGuess && b.categoryGuess && a.categoryGuess === b.categoryGuess ? 1 : 0;
  const dateScore = dayDistance === null
    ? 0.5
    : dayDistance <= 1
      ? 1
      : dayDistance <= 3
        ? 0.75
        : 0.35;

  const score =
    titleScore * 0.56 +
    keywordScore * 0.16 +
    categoryScore * 0.10 +
    dateScore * 0.12 +
    numberScore * 0.06;
  return Number(bounded(score).toFixed(4));
}

export function shouldClusterTogether(
  a: IntelligenceCandidate,
  b: IntelligenceCandidate,
  threshold = 0.52,
) {
  const similarity = sameEventSimilarity(a, b);
  return { sameEvent: similarity >= threshold, similarity };
}

function guessDate(candidate: IntelligenceCandidate) {
  const parsed = candidateDate(candidate);
  return (parsed ?? new Date()).toISOString().slice(0, 10);
}

function chooseRepresentative(members: IntelligenceCandidate[]) {
  return [...members].sort((a, b) => {
    const primaryDelta = Number(Boolean(b.isPrimarySource)) - Number(Boolean(a.isPrimarySource));
    if (primaryDelta) return primaryDelta;
    const trustDelta = Number(b.trustScore ?? 0.5) - Number(a.trustScore ?? 0.5);
    if (Math.abs(trustDelta) > 0.0001) return trustDelta;
    return a.title.length - b.title.length;
  })[0]!;
}

export function clusterFingerprint(members: IntelligenceCandidate[]) {
  const stable = members
    .map((candidate) => candidate.id)
    .sort()
    .join("|");
  return createHash("sha256").update(stable).digest("hex");
}

export function publicClusterCode(date: string) {
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `CAC-${date.replaceAll("-", "")}-${suffix}`;
}

export function buildCandidateClusters(
  candidates: IntelligenceCandidate[],
  threshold = 0.52,
): ClusterDraft[] {
  const remaining = [...candidates].sort((a, b) => {
    const aDate = candidateDate(a)?.getTime() ?? 0;
    const bDate = candidateDate(b)?.getTime() ?? 0;
    return bDate - aDate || a.id.localeCompare(b.id);
  });
  const clusters: ClusterDraft[] = [];

  while (remaining.length > 0) {
    const seed = remaining.shift()!;
    const members: Array<{ candidate: IntelligenceCandidate; similarity: number }> = [
      { candidate: seed, similarity: 1 },
    ];

    for (let index = remaining.length - 1; index >= 0; index -= 1) {
      const candidate = remaining[index]!;
      const comparisons = members.map((member) => sameEventSimilarity(member.candidate, candidate));
      const maxSimilarity = Math.max(...comparisons);
      const averageSimilarity = comparisons.reduce((sum, value) => sum + value, 0) / comparisons.length;
      if (maxSimilarity >= threshold && averageSimilarity >= threshold - 0.08) {
        members.push({ candidate, similarity: Number(maxSimilarity.toFixed(4)) });
        remaining.splice(index, 1);
      }
    }

    const representative = chooseRepresentative(members.map((member) => member.candidate));
    const categoryGuess = representative.categoryGuess ?? "other";
    const eventDateGuess = guessDate(representative);
    const confidence = members.length === 1
      ? Math.min(0.72, Number(representative.trustScore ?? 0.5))
      : Number((members.reduce((sum, member) => sum + member.similarity, 0) / members.length).toFixed(4));
    const fingerprint = clusterFingerprint(members.map((member) => member.candidate));
    clusters.push({
      id: randomUUID(),
      representative,
      members,
      categoryGuess,
      eventDateGuess,
      confidence,
      fingerprint,
    });
  }

  return clusters;
}

function normalizeFactValue(value: string) {
  return normalizeCurrentAffairsText(value)
    .replace(/\brs\b/g, "rupees")
    .replace(/\s+/g, " ")
    .trim();
}

function pushClaim(claims: FactClaim[], claim: Omit<FactClaim, "normalizedValue">) {
  const normalizedValue = normalizeFactValue(claim.factValue);
  if (!normalizedValue) return;
  const duplicate = claims.some(
    (item) => item.factKey === claim.factKey && item.normalizedValue === normalizedValue,
  );
  if (!duplicate) claims.push({ ...claim, normalizedValue });
}

function plannedPassiveBaseVerb(participle: string) {
  const normalized = participle.toLowerCase();
  if (normalized === "held") return "hold";
  if (normalized === "conducted") return "conduct";
  if (normalized === "inaugurated") return "inaugurate";
  if (normalized === "launched") return "launch";
  if (normalized === "opened") return "open";
  return normalized;
}

export function extractHeadlineFactClaims(title: string): FactClaim[] {
  const claims: FactClaim[] = [];
  const cleaned = title.replace(/\s+/g, " ").trim();

  for (const match of cleaned.matchAll(/(?:₹|Rs\.?\s*)(\d+(?:\.\d+)?)\s*(crore|lakh|million|billion|trillion)?/gi)) {
    pushClaim(claims, {
      factKey: "amount",
      factValue: match[0].trim(),
      factType: "money",
      confidence: 0.66,
      extractionMethod: "rule",
    });
  }

  for (const match of cleaned.matchAll(/\b(\d+(?:\.\d+)?)\s*%/g)) {
    pushClaim(claims, {
      factKey: "percentage",
      factValue: `${match[1]}%`,
      factType: "percentage",
      confidence: 0.68,
      extractionMethod: "rule",
    });
  }

  // CP-045: planned passive headlines must be recognized before the completed-
  // event passive rule. Otherwise "Forum to be held in New Delhi" is misread as
  // an organisation named "Forum to be" with a completed action "held".
  const plannedPassive = cleaned.match(/^(.{3,140}?)\s+to be\s+(held|conducted|inaugurated|launched|opened)\b\s*(.{0,160})$/i);
  if (plannedPassive?.[1] && plannedPassive[2]) {
    const initiative = plannedPassive[1].trim();
    const participle = plannedPassive[2].toLowerCase();
    const tail = plannedPassive[3]?.trim() ?? "";
    pushClaim(claims, {
      factKey: "initiative",
      factValue: initiative,
      factType: "entity",
      confidence: 0.72,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: `scheduled ${plannedPassiveBaseVerb(participle)}`,
      factType: "string",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "event_status",
      factValue: `to be ${participle}${tail ? ` ${tail}` : ""}`,
      factType: "string",
      confidence: 0.66,
      extractionMethod: "rule",
    });
    return claims;
  }

  // CP-049: important official headlines frequently describe office-taking,
  // historic firsts, summit participation, reviews and bilateral cooperation
  // without using the older launch/approve verbs. Extract these semantics before
  // generic rules so they can promote and verify from primary evidence.
  const officeAssumption = cleaned.match(/^(.{2,140}?)\s+(?:takes? over|took over|assumes? charge|assumed charge|assumes? the appointment|assumed the appointment)\s+(?:as|of)\s+(.{3,200})$/i);
  if (officeAssumption?.[1] && officeAssumption[2]) {
    pushClaim(claims, {
      factKey: "appointee",
      factValue: officeAssumption[1].trim(),
      factType: "entity",
      confidence: 0.76,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "position",
      factValue: officeAssumption[2].trim(),
      factType: "string",
      confidence: 0.72,
      extractionMethod: "rule",
    });
    return claims;
  }

  const historicFirst = cleaned.match(/^(.{2,140}?)\s+(?:scripts?|makes?)\s+history\s+as\s+(.{3,220})$/i);
  if (historicFirst?.[1] && historicFirst[2]) {
    pushClaim(claims, {
      factKey: "appointee",
      factValue: historicFirst[1].trim(),
      factType: "entity",
      confidence: 0.78,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "position",
      factValue: historicFirst[2].trim(),
      factType: "string",
      confidence: 0.74,
      extractionMethod: "rule",
    });
    return claims;
  }

  const participation = cleaned.match(/^(.{2,140}?)\s+(participates?|participated|addresses?|addressed)\s+(?:in|at)\s+(.{3,220})$/i);
  if (participation?.[1] && participation[2] && participation[3]) {
    pushClaim(claims, {
      factKey: "acting_entity",
      factValue: participation[1].trim(),
      factType: "entity",
      confidence: 0.76,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: participation[2].toLowerCase(),
      factType: "string",
      confidence: 0.72,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "action_subject",
      factValue: participation[3].trim(),
      factType: "string",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    return claims;
  }

  const reviewAction = cleaned.match(/^(.{2,140}?)\s+(reviews?|reviewed)\s+(.{3,240})$/i);
  if (reviewAction?.[1] && reviewAction[2] && reviewAction[3]) {
    pushClaim(claims, {
      factKey: "acting_entity",
      factValue: reviewAction[1].trim(),
      factType: "entity",
      confidence: 0.74,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: reviewAction[2].toLowerCase(),
      factType: "string",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "action_subject",
      factValue: reviewAction[3].trim(),
      factType: "string",
      confidence: 0.68,
      extractionMethod: "rule",
    });
    return claims;
  }

  const celebratoryLaunch = cleaned.match(/^(.{2,140}?)\s+(?:celebrates?|marks?|observes?)\b[^;]{0,180};\s*(?:launches|launched)\s+(.{3,220})$/i);
  if (celebratoryLaunch?.[1] && celebratoryLaunch[2]) {
    pushClaim(claims, {
      factKey: "launching_entity",
      factValue: celebratoryLaunch[1].trim(),
      factType: "entity",
      confidence: 0.76,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "initiative",
      factValue: celebratoryLaunch[2].trim(),
      factType: "string",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    return claims;
  }

  const bilateralStrengthen = cleaned.match(/^(.{3,140}?)\s+(strengthens?|strengthened)\s+(.{3,220})$/i);
  if (bilateralStrengthen?.[1] && bilateralStrengthen[2] && bilateralStrengthen[3]) {
    pushClaim(claims, {
      factKey: "acting_entity",
      factValue: bilateralStrengthen[1].trim(),
      factType: "entity",
      confidence: 0.74,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: bilateralStrengthen[2].toLowerCase(),
      factType: "string",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "action_subject",
      factValue: bilateralStrengthen[3].trim(),
      factType: "string",
      confidence: 0.68,
      extractionMethod: "rule",
    });
    return claims;
  }

  const appointment = cleaned.match(/^(.{2,100}?)\s+(?:is\s+)?appointed\s+(?:as\s+)?(.{3,140}?)(?:\s+(?:of|at)\s+.+)?$/i);
  if (appointment?.[1] && appointment[2]) {
    pushClaim(claims, {
      factKey: "appointee",
      factValue: appointment[1].trim(),
      factType: "entity",
      confidence: 0.72,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "position",
      factValue: appointment[2].trim(),
      factType: "string",
      confidence: 0.64,
      extractionMethod: "rule",
    });
  }

  const winner = cleaned.match(/^(.{2,100}?)\s+(?:wins|won)\s+(.{3,160})$/i);
  if (winner?.[1] && winner[2]) {
    pushClaim(claims, {
      factKey: "winner",
      factValue: winner[1].trim(),
      factType: "entity",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "award_or_title",
      factValue: winner[2].trim(),
      factType: "string",
      confidence: 0.62,
      extractionMethod: "rule",
    });
  }

  const launch = cleaned.match(/^(.{2,100}?)\s+(?:launches|launched|unveils|unveiled)\s+(.{3,180})$/i);
  if (launch?.[1] && launch[2]) {
    pushClaim(claims, {
      factKey: "launching_entity",
      factValue: launch[1].trim(),
      factType: "entity",
      confidence: 0.66,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "initiative",
      factValue: launch[2].trim(),
      factType: "string",
      confidence: 0.60,
      extractionMethod: "rule",
    });
  }

  const passiveConducted = cleaned.match(/^(.{3,120}?)\s+(?:successfully\s+)?(?:is\s+|was\s+|has been\s+)?(conducted|held)\b\s*(.{0,160})$/i);
  if (passiveConducted?.[1] && passiveConducted[2]) {
    pushClaim(claims, {
      factKey: "initiative",
      factValue: passiveConducted[1].trim(),
      factType: "entity",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: passiveConducted[2].toLowerCase(),
      factType: "string",
      confidence: 0.68,
      extractionMethod: "rule",
    });
    if (passiveConducted[3]?.trim()) {
      pushClaim(claims, {
        factKey: "event_status",
        factValue: `${passiveConducted[2].toLowerCase()} ${passiveConducted[3].trim()}`,
        factType: "string",
        confidence: 0.60,
        extractionMethod: "rule",
      });
    }
  }

  const plannedAction = cleaned.match(/^(.{2,120}?)\s+to\s+(release|launch|inaugurate|grace|hold|conduct|open|unveil)\s+(.{3,180})$/i);
  if (plannedAction?.[1] && plannedAction[2] && plannedAction[3]) {
    pushClaim(claims, {
      factKey: "acting_entity",
      factValue: plannedAction[1].trim(),
      factType: "entity",
      confidence: 0.70,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: `scheduled ${plannedAction[2].toLowerCase()}`,
      factType: "string",
      confidence: 0.66,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "action_subject",
      factValue: plannedAction[3].trim(),
      factType: "string",
      confidence: 0.62,
      extractionMethod: "rule",
    });
  }

  const formalAction = cleaned.match(/^(.{2,120}?)\s+(notifies|notified|issues|issued|approves|approved|adopts|adopted|releases|released|inaugurates|inaugurated|conducts|conducted|holds|held|leads|led|performs|performed|opens|opened|organises|organised|organizes|organized)\s+(.{3,220})$/i);
  if (formalAction?.[1] && formalAction[2] && formalAction[3] && !formalAction[1].includes(";")) {
    pushClaim(claims, {
      factKey: "acting_entity",
      factValue: formalAction[1].trim(),
      factType: "entity",
      confidence: 0.72,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "official_action",
      factValue: formalAction[2].toLowerCase(),
      factType: "string",
      confidence: 0.68,
      extractionMethod: "rule",
    });
    pushClaim(claims, {
      factKey: "action_subject",
      factValue: formalAction[3].trim(),
      factType: "string",
      confidence: 0.64,
      extractionMethod: "rule",
    });
  }

  const rank = cleaned.match(/\b(?:ranks?|ranked)\s+(\d{1,3})(?:st|nd|rd|th)?\b/i);
  if (rank?.[1]) {
    pushClaim(claims, {
      factKey: "rank",
      factValue: rank[1],
      factType: "number",
      confidence: 0.72,
      extractionMethod: "rule",
    });
  }

  return claims;
}

function weightedSupport(claims: ClaimEvidence[]) {
  return claims.reduce((sum, claim) => {
    const confidence = bounded(Number(claim.confidence ?? 0.5));
    const trust = bounded(Number(claim.trustScore ?? 0.5));
    const primaryBoost = claim.isPrimaryEvidence ? 1.3 : 1;
    return sum + confidence * trust * primaryBoost;
  }, 0);
}

function toReconciledFact(factKey: string, claims: ClaimEvidence[], status: ReconciledFact["reconciliationStatus"]): ReconciledFact {
  const exemplar = [...claims].sort((a, b) => b.confidence - a.confidence)[0]!;
  const primarySupportCount = claims.filter((claim) => claim.isPrimaryEvidence).length;
  const confidence = bounded(
    weightedSupport(claims) / Math.max(1, claims.length) + Math.min(0.12, (claims.length - 1) * 0.04),
  );
  return {
    factKey,
    factValue: exemplar.factValue,
    factType: exemplar.factType,
    confidence: Number(confidence.toFixed(4)),
    supportCount: claims.length,
    primarySupportCount,
    reconciliationStatus: status,
    provenance: claims.map((claim) => ({
      candidateId: claim.candidateId,
      sourceKey: claim.sourceKey,
      confidence: claim.confidence,
      primary: Boolean(claim.isPrimaryEvidence),
    })),
  };
}

export function reconcileFactClaims(claims: ClaimEvidence[]): {
  facts: ReconciledFact[];
  conflicts: FactConflict[];
} {
  const byKey = new Map<string, ClaimEvidence[]>();
  for (const claim of claims) {
    const bucket = byKey.get(claim.factKey) ?? [];
    bucket.push(claim);
    byKey.set(claim.factKey, bucket);
  }

  const facts: ReconciledFact[] = [];
  const conflicts: FactConflict[] = [];

  for (const [factKey, keyClaims] of byKey) {
    const byValue = new Map<string, ClaimEvidence[]>();
    for (const claim of keyClaims) {
      const bucket = byValue.get(claim.normalizedValue) ?? [];
      bucket.push(claim);
      byValue.set(claim.normalizedValue, bucket);
    }

    const variants = [...byValue.entries()].map(([normalizedValue, variantClaims]) => ({
      normalizedValue,
      claims: variantClaims,
      supportCount: variantClaims.length,
      primarySupportCount: variantClaims.filter((claim) => claim.isPrimaryEvidence).length,
      weightedSupport: weightedSupport(variantClaims),
    })).sort((a, b) => b.weightedSupport - a.weightedSupport);

    if (variants.length === 1) {
      const only = variants[0]!;
      if (only.primarySupportCount > 0) {
        facts.push(toReconciledFact(factKey, only.claims, "primary_backed"));
      } else if (only.supportCount >= 2) {
        facts.push(toReconciledFact(factKey, only.claims, "corroborated"));
      }
      continue;
    }

    const top = variants[0]!;
    const runnerUp = variants[1]!;
    const primaryWins = top.primarySupportCount > 0 && runnerUp.primarySupportCount === 0;
    const clearWeightLead = top.weightedSupport >= Math.max(0.75, runnerUp.weightedSupport * 1.65);
    const autoResolution = primaryWins && clearWeightLead
      ? toReconciledFact(factKey, top.claims, "primary_backed")
      : undefined;

    if (autoResolution) facts.push(autoResolution);
    conflicts.push({
      factKey,
      values: variants.map((variant) => ({
        value: variant.claims[0]!.factValue,
        normalizedValue: variant.normalizedValue,
        supportCount: variant.supportCount,
        primarySupportCount: variant.primarySupportCount,
        weightedSupport: Number(variant.weightedSupport.toFixed(4)),
      })),
      autoResolution,
      resolutionReason: autoResolution
        ? "Primary-source-backed value has a decisive weighted-evidence lead"
        : undefined,
    });
  }

  return { facts, conflicts };
}