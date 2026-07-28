const A_CODE = "A".charCodeAt(0);
export const ALPHABET_SIZE = 26;
export const ALPHABET = Object.freeze(Array.from({ length: ALPHABET_SIZE }, (_, index) => String.fromCharCode(A_CODE + index)));
export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function normalizeLetter(letter: string): string {
  const normalized = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) throw new Error(`Expected one English letter, received: ${letter}`);
  return normalized;
}

export function leftRank(letter: string): number {
  return normalizeLetter(letter).charCodeAt(0) - A_CODE + 1;
}

export function rightRank(letter: string): number {
  return ALPHABET_SIZE + 1 - leftRank(letter);
}

export function letterAtLeftRank(rank: number): string {
  if (!Number.isInteger(rank) || rank < 1 || rank > ALPHABET_SIZE) {
    throw new Error(`Alphabet rank must be an integer from 1 to 26: ${rank}`);
  }
  return ALPHABET[rank - 1]!;
}

export function letterAtRightRank(rank: number): string {
  return letterAtLeftRank(ALPHABET_SIZE + 1 - rank);
}

export function oppositeLetter(letter: string): string {
  return letterAtLeftRank(ALPHABET_SIZE + 1 - leftRank(letter));
}

export function boundedShift(letter: string, offset: number): string | null {
  const target = leftRank(letter) + offset;
  return target >= 1 && target <= ALPHABET_SIZE ? letterAtLeftRank(target) : null;
}

export function cyclicShift(letter: string, offset: number): string {
  const target = ((leftRank(letter) - 1 + offset) % ALPHABET_SIZE + ALPHABET_SIZE) % ALPHABET_SIZE;
  return ALPHABET[target]!;
}

export function exclusiveGap(first: string, second: string): number {
  return Math.max(0, Math.abs(leftRank(first) - leftRank(second)) - 1);
}

export function inclusiveSpan(first: string, second: string): number {
  return Math.abs(leftRank(first) - leftRank(second)) + 1;
}

export function positionDistance(first: string, second: string): number {
  return Math.abs(leftRank(first) - leftRank(second));
}

export function midpointLetters(first: string, second: string): readonly string[] {
  const low = Math.min(leftRank(first), leftRank(second));
  const high = Math.max(leftRank(first), leftRank(second));
  const sum = low + high;
  if (sum % 2 === 0) return [letterAtLeftRank(sum / 2)];
  return [letterAtLeftRank(Math.floor(sum / 2)), letterAtLeftRank(Math.ceil(sum / 2))];
}

export function positionTrack(sequence: readonly string[]) {
  return sequence.map((token, index) => ({ token, position: index + 1, reversePosition: sequence.length - index }));
}
