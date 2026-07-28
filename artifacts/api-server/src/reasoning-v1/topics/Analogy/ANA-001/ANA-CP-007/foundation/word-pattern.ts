export interface EqualityPatternResult {
  pattern: readonly number[];
  key: string;
  distinctLetterCount: number;
  repeatedPositionCount: number;
}

export function equalityPattern(word: string): EqualityPatternResult {
  const normalized = word.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) {
    throw new Error(`Equality patterns require an A-Z word: ${word}`);
  }

  const assigned = new Map<string, number>();
  const pattern: number[] = [];
  let nextId = 1;

  for (const letter of normalized) {
    let id = assigned.get(letter);
    if (id === undefined) {
      id = nextId;
      assigned.set(letter, id);
      nextId += 1;
    }
    pattern.push(id);
  }

  return {
    pattern,
    key: pattern.join("-"),
    distinctLetterCount: assigned.size,
    repeatedPositionCount: normalized.length - assigned.size,
  };
}

export function sameEqualityPattern(left: string, right: string): boolean {
  const leftPattern = equalityPattern(left);
  const rightPattern = equalityPattern(right);
  return left.length === right.length && leftPattern.key === rightPattern.key;
}

export function firstPatternDifference(left: string, right: string): number | null {
  const leftPattern = equalityPattern(left).pattern;
  const rightPattern = equalityPattern(right).pattern;
  const maximum = Math.max(leftPattern.length, rightPattern.length);
  for (let index = 0; index < maximum; index += 1) {
    if (leftPattern[index] !== rightPattern[index]) return index;
  }
  return null;
}
