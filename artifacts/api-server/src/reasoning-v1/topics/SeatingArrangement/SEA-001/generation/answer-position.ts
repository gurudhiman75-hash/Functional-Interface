const ANSWER_PATTERNS = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
  [3, 0, 1, 2],
  [0, 2, 0, 2],
  [1, 3, 1, 3],
  [2, 0, 2, 0],
  [3, 1, 3, 1],
] as const;

function fallbackHash(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function generationOrdinal(seed: string): number {
  const normalised = seed
    .replace(/::attempt-\d+$/, "")
    .replace(/:retry:\d+$/, "");
  const match = normalised.match(/(\d+)(?!.*\d)/);
  return match?.[1] ? Number(match[1]) : fallbackHash(normalised);
}

/**
 * Returns a deterministic correct-option index with corpus-level balance.
 * The eight schedules balance every visible Q slot across A/B/C/D while
 * deliberately allowing repeated letters inside some four-question passages.
 */
export function balancedSea001AnswerIndex(seed: string, questionOrder: number): 0 | 1 | 2 | 3 {
  if (!Number.isInteger(questionOrder) || questionOrder < 1 || questionOrder > 4) {
    throw new Error(`Invalid SEA-001 visible question order: ${questionOrder}`);
  }
  const pattern = ANSWER_PATTERNS[generationOrdinal(seed) % ANSWER_PATTERNS.length] as readonly [0 | 1 | 2 | 3, 0 | 1 | 2 | 3, 0 | 1 | 2 | 3, 0 | 1 | 2 | 3];
  return pattern[questionOrder - 1] as 0 | 1 | 2 | 3;
}
