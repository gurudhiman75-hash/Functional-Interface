const A_CODE = "A".charCodeAt(0);
const ALPHABET_SIZE = 26;

export function normalizeLetter(letter: string): string {
  const normalized = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) {
    throw new Error(`Expected one English letter, received: ${letter}`);
  }
  return normalized;
}

export function letterPosition(letter: string): number {
  return normalizeLetter(letter).charCodeAt(0) - A_CODE + 1;
}

export function letterFromPosition(position: number): string {
  if (!Number.isInteger(position)) {
    throw new Error(`Alphabet position must be an integer: ${position}`);
  }
  const wrapped = ((position - 1) % ALPHABET_SIZE + ALPHABET_SIZE) % ALPHABET_SIZE;
  return String.fromCharCode(A_CODE + wrapped);
}

export function shiftLetter(letter: string, shift: number): string {
  return letterFromPosition(letterPosition(letter) + shift);
}

export function oppositeLetter(letter: string): string {
  return letterFromPosition(ALPHABET_SIZE + 1 - letterPosition(letter));
}

export function reversePosition(letter: string): number {
  return ALPHABET_SIZE + 1 - letterPosition(letter);
}

export function shiftCluster(cluster: string, shifts: readonly number[]): string {
  const normalized = cluster.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized) || normalized.length !== shifts.length) {
    throw new Error("Cluster must contain A-Z letters and have one shift per position.");
  }
  return [...normalized].map((letter, index) => shiftLetter(letter, shifts[index])).join("");
}

export function rotateCluster(cluster: string, distance: number): string {
  const normalized = cluster.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) throw new Error("Cluster must contain A-Z letters only.");
  const rotation = ((distance % normalized.length) + normalized.length) % normalized.length;
  return normalized.slice(rotation) + normalized.slice(0, rotation);
}
