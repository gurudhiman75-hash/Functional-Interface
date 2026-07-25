export type MixedToken =
  | { kind: "LETTER"; letter: string }
  | { kind: "LETTER_GROUP"; letters: string }
  | { kind: "NUMBER"; number: number }
  | { kind: "LETTER_NUMBER"; letter: string; number: number }
  | { kind: "NUMBER_LETTER"; number: number; letter: string }
  | { kind: "CLUSTER_NUMBER"; letters: string; number: number };

export type MixedResult = MixedToken;

const MAX_PILOT_ABSOLUTE_NUMBER = 9999;

function normalizeLetters(value: string): string {
  const letters = value.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(letters)) throw new Error(`Invalid mixed-token letters: ${value}`);
  return letters;
}

function normalizeNumber(value: number): number {
  if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_PILOT_ABSOLUTE_NUMBER) {
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
  if (normalized.length < 2 || normalized.length > 6) throw new Error(`LETTER_GROUP requires 2..6 letters: ${letters}`);
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

export function numberLetterToken(number: number, letter: string): MixedToken {
  const normalized = normalizeLetters(letter);
  if (normalized.length !== 1) throw new Error(`NUMBER_LETTER requires one letter: ${letter}`);
  return { kind: "NUMBER_LETTER", number: normalizeNumber(number), letter: normalized };
}

export function clusterNumberToken(letters: string, number: number): MixedToken {
  const normalized = normalizeLetters(letters);
  if (normalized.length < 2 || normalized.length > 6) throw new Error(`CLUSTER_NUMBER requires 2..6 letters: ${letters}`);
  return { kind: "CLUSTER_NUMBER", letters: normalized, number: normalizeNumber(number) };
}

export function renderMixedToken(token: MixedToken): string {
  switch (token.kind) {
    case "LETTER": return token.letter;
    case "LETTER_GROUP": return token.letters;
    case "NUMBER": return String(token.number);
    case "LETTER_NUMBER": return `${token.letter}${token.number}`;
    case "NUMBER_LETTER": return `${token.number}${token.letter}`;
    case "CLUSTER_NUMBER": return `${token.letters}${token.number}`;
  }
}

export function mixedTokenKey(token: MixedToken): string {
  switch (token.kind) {
    case "LETTER": return `LETTER:${token.letter}`;
    case "LETTER_GROUP": return `LETTER_GROUP:${token.letters}`;
    case "NUMBER": return `NUMBER:${token.number}`;
    case "LETTER_NUMBER": return `LETTER_NUMBER:${token.letter}:${token.number}`;
    case "NUMBER_LETTER": return `NUMBER_LETTER:${token.number}:${token.letter}`;
    case "CLUSTER_NUMBER": return `CLUSTER_NUMBER:${token.letters}:${token.number}`;
  }
}

export function sameMixedToken(left: MixedToken | null, right: MixedToken | null): boolean {
  return left !== null && right !== null && mixedTokenKey(left) === mixedTokenKey(right);
}

const SIGNED_INTEGER_PATTERN = "-?(?:0|[1-9]\\d{0,3})";

export function parseMixedTokenForReview(value: string): MixedToken {
  const normalized = value.trim().toUpperCase();
  if (/^[A-Z]$/.test(normalized)) return letterToken(normalized);
  if (/^[A-Z]{2,6}$/.test(normalized)) return letterGroupToken(normalized);
  if (new RegExp(`^${SIGNED_INTEGER_PATTERN}$`).test(normalized)) return numberToken(Number(normalized));

  const numberFirst = normalized.match(new RegExp(`^(${SIGNED_INTEGER_PATTERN})([A-Z])$`));
  if (numberFirst) return numberLetterToken(Number(numberFirst[1]), numberFirst[2]);

  const letterFirst = normalized.match(new RegExp(`^([A-Z]{1,6})(${SIGNED_INTEGER_PATTERN})$`));
  if (!letterFirst) throw new Error(`Cannot parse mixed review token: ${value}`);
  const letters = letterFirst[1];
  const number = Number(letterFirst[2]);
  return letters.length === 1 ? letterNumberToken(letters, number) : clusterNumberToken(letters, number);
}

export function assertMixedTokenRoundTrip(token: MixedToken): void {
  const parsed = parseMixedTokenForReview(renderMixedToken(token));
  if (!sameMixedToken(parsed, token)) throw new Error(`Mixed token failed round-trip: ${mixedTokenKey(token)}`);
}

export function mixedTokenLetterText(token: MixedToken): string | null {
  switch (token.kind) {
    case "LETTER": return token.letter;
    case "LETTER_GROUP": return token.letters;
    case "LETTER_NUMBER":
    case "NUMBER_LETTER": return token.letter;
    case "CLUSTER_NUMBER": return token.letters;
    case "NUMBER": return null;
  }
}

export function mixedTokenNumber(token: MixedToken): number | null {
  switch (token.kind) {
    case "NUMBER":
    case "LETTER_NUMBER":
    case "NUMBER_LETTER":
    case "CLUSTER_NUMBER": return token.number;
    case "LETTER":
    case "LETTER_GROUP": return null;
  }
}
