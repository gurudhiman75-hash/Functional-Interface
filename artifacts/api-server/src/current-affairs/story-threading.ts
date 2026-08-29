export type StoryFact = {
  key: string;
  value: string;
};

export type StoryEventSignal = {
  id: string;
  title: string;
  category: string;
  eventDate: string;
  facts: StoryFact[];
};

export type StoryThreadDecision = {
  allowed: boolean;
  score: number;
  reason: string;
  sharedTitleTokens: string[];
};

const STOPWORDS = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "in", "into", "is", "of", "on", "or", "the", "to", "with",
  "current", "affairs", "update", "updates", "latest", "news", "key", "facts", "fact", "india", "government",
  "announces", "announced", "approves", "approved", "launches", "launched", "signs", "signed", "new",
]);

function normalize(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleTokens(value: string): string[] {
  return Array.from(new Set(
    normalize(value)
      .split(/\s+/)
      .map((token) => token.replace(/^-+|-+$/g, ""))
      .filter((token) => token.length >= 3 && !STOPWORDS.has(token)),
  ));
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

function overlapCoefficient(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((item) => right.has(item)).length;
  return intersection / Math.min(left.size, right.size);
}

function factMap(facts: StoryFact[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const fact of facts) {
    const key = normalize(fact.key).replace(/\s+/g, "_");
    const value = normalize(fact.value);
    if (!key || !value) continue;
    const values = map.get(key) ?? new Set<string>();
    values.add(value);
    map.set(key, values);
  }
  return map;
}

function daysApart(left: string, right: string): number {
  const a = new Date(`${left}T00:00:00Z`).getTime();
  const b = new Date(`${right}T00:00:00Z`).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Number.POSITIVE_INFINITY;
  return Math.abs(a - b) / 86_400_000;
}

function conflictingIdentity(left: Map<string, Set<string>>, right: Map<string, Set<string>>): string | null {
  const identityKeys = ["appointee", "winner", "chairperson", "governor", "president"];
  for (const key of identityKeys) {
    const a = left.get(key);
    const b = right.get(key);
    if (!a?.size || !b?.size) continue;
    const shared = [...a].some((value) => b.has(value));
    if (!shared) return key;
  }
  return null;
}

function factValueSimilarity(left: Map<string, Set<string>>, right: Map<string, Set<string>>): number {
  const leftPairs = new Set<string>();
  const rightPairs = new Set<string>();
  for (const [key, values] of left) for (const value of values) leftPairs.add(`${key}|${value}`);
  for (const [key, values] of right) for (const value of values) rightPairs.add(`${key}|${value}`);
  return jaccard(leftPairs, rightPairs);
}

export function storyThreadSimilarity(
  left: StoryEventSignal,
  right: StoryEventSignal,
  maxGapDays = 45,
): StoryThreadDecision {
  if (left.category !== right.category) {
    return { allowed: false, score: 0, reason: "Categories differ", sharedTitleTokens: [] };
  }
  const gap = daysApart(left.eventDate, right.eventDate);
  if (gap > maxGapDays) {
    return { allowed: false, score: 0, reason: "Events are outside the story-thread time window", sharedTitleTokens: [] };
  }

  const leftTokens = new Set(titleTokens(left.title));
  const rightTokens = new Set(titleTokens(right.title));
  const sharedTitleTokens = [...leftTokens].filter((token) => rightTokens.has(token)).sort();
  const leftFacts = factMap(left.facts);
  const rightFacts = factMap(right.facts);
  const conflict = conflictingIdentity(leftFacts, rightFacts);
  if (conflict) {
    return {
      allowed: false,
      score: 0,
      reason: `Conflicting identity fact blocks threading: ${conflict}`,
      sharedTitleTokens,
    };
  }

  const titleJaccard = jaccard(leftTokens, rightTokens);
  const titleContainment = overlapCoefficient(leftTokens, rightTokens);
  const factSimilarity = factValueSimilarity(leftFacts, rightFacts);
  const distinctiveAnchorStrength = Math.min(1, sharedTitleTokens.length / 4);
  const score = Math.min(
    1,
    distinctiveAnchorStrength * 0.50
      + titleContainment * 0.20
      + titleJaccard * 0.20
      + factSimilarity * 0.10,
  );
  const hasStrongAnchor = sharedTitleTokens.length >= 2 || (sharedTitleTokens.length >= 1 && factSimilarity >= 0.25);
  const allowed = hasStrongAnchor && score >= 0.72;

  return {
    allowed,
    score: Number(score.toFixed(5)),
    reason: allowed
      ? "Strong same-category distinctive-title/fact continuity"
      : "Similarity is below conservative automatic story-thread threshold",
    sharedTitleTokens,
  };
}
