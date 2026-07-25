export type MixedToken =
  | { kind: "LETTER"; letter: string }
  | { kind: "LETTER_GROUP"; letters: string }
  | { kind: "NUMBER"; number: number }
  | { kind: "LETTER_NUMBER"; letter: string; number: number }
  | { kind: "CLUSTER_NUMBER"; letters: string; number: number };

export type MixedResult = MixedToken;

const MAX_PILOT_NUMBER = 9999;

function normalizeLetters(value: string): string {
  const letters = value.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(letters)) {
    throw new Error(`Invalid mixed-token letters: ${value}`);
  }
  return letters;
}

function normalizeNumber(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_PILOT_NUMBER) {
    throw new Error(`Invalid mixed-token number: ${value}`);
  }
  return value;
}

export function letterToken(letter: string): MixedToken {
  const normalized = normalizeLetters(letter);
  if (normalized.length !== 1) throw new Error(`LETTER requires one letter: ${letter}`);
  return { kind: "LETTER", letter: normalized };
}

export function letterGroupToken(letters: string): MixedToken {
  const normalized = normalizeLetters(letters);
  if (normalized.length < 2 || normalized.length > 6) {
    throw new Error(`LETTER_GROUP requires 2..6 letters: ${letters}`);
  }
  return { kind: "LETTER_GROUP", letters: normalized };
}

export function numberToken(number: number): MixedToken {
  return { kind: "NUMBER", number: normalizeNumber(number) };
}

export function letterNumberToken(letter: string, number: number): MixedToken {
  const normalized = normalizeLetters(letter);
  if (normalized.length !== 1) throw new Error(`LETTER_NUMBER requires one letter: ${letter}`);
  return { kind: "LETTER_NUMBER", letter: normalized, number: normalizeNumber(number) };
}

export function clusterNumberToken(letters: string, number: number): MixedToken {
  const normalized = normalizeLetters(letters);
  if (normalized.length < 2 || normalized.length > 6) {
    throw new Error(`CLUSTER_NUMBER requires 2..6 letters: ${letters}`);
  }
  return { kind: "CLUSTER_NUMBER", letters: normalized, number: normalizeNumber(number) };
}

export function renderMixedToken(token: MixedToken): string {
  switch (token.kind) {
    case "LETTER":
      return token.letter;
    case "LETTER_GROUP":
      return token.letters;
    case "NUMBER":
      return String(token.number);
    case "LETTER_NUMBER":
      return `${token.letter}${token.number}`;
    case "CLUSTER_NUMBER":
      return `${token.letters}${token.number}`;
  }
}

export function mixedTokenKey(token: MixedToken): string {
  switch (token.kind) {
    case "LETTER":
      return `LETTER:${token.letter}`;
    case "LETTER_GROUP":
      return `LETTER_GROUP:${token.letters}`;
    case "NUMBER":
      return `NUMBER:${token.number}`;
    case "LETTER_NUMBER":
      return `LETTER_NUMBER:${token.letter}:${token.number}`;
    case "CLUSTER_NUMBER":
      return `CLUSTER_NUMBER:${token.letters}:${token.number}`;
  }
}

export function sameMixedToken(left: MixedToken | null, right: MixedToken | null): boolean {
  return left !== null && right !== null && mixedTokenKey(left) === mixedTokenKey(right);
}

export function parseMixedTokenForReview(value: string): MixedToken {
  const normalized = value.trim().toUpperCase();
  if (/^[A-Z]$/.test(normalized)) return letterToken(normalized);
  if (/^[A-Z]{2,6}$/.test(normalized)) return letterGroupToken(normalized);
  if (/^[1-9]\d{0,3}$/.test(normalized)) return numberToken(Number(normalized));

  const match = normalized.match(/^([A-Z]{1,6})([1-9]\d{0,3})$/);
  if (!match) throw new Error(`Cannot parse mixed review token: ${value}`);
  const letters = match[1];
  const number = Number(match[2]);
  return letters.length === 1
    ? letterNumberToken(letters, number)
    : clusterNumberToken(letters, number);
}

export function assertMixedTokenRoundTrip(token: MixedToken): void {
  const parsed = parseMixedTokenForReview(renderMixedToken(token));
  if (!sameMixedToken(parsed, token)) {
    throw new Error(`Mixed token failed round-trip: ${mixedTokenKey(token)}`);
  }
}

export function mixedTokenLetterText(token: MixedToken): string | null {
  switch (token.kind) {
    case "LETTER":
      return token.letter;
    case "LETTER_GROUP":
      return token.letters;
    case "LETTER_NUMBER":
      return token.letter;
    case "CLUSTER_NUMBER":
      return token.letters;
    case "NUMBER":
      return null;
  }
}

export function mixedTokenNumber(token: MixedToken): number | null {
  switch (token.kind) {
    case "NUMBER":
    case "LETTER_NUMBER":
    case "CLUSTER_NUMBER":
      return token.number;
    case "LETTER":
    case "LETTER_GROUP":
      return null;
  }
}
