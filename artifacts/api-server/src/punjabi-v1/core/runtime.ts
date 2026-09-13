import { assertPunjabiDisplayText, normalizePunjabiText } from "../foundation/unicode/gurmukhi";

export type PunjabiDifficulty = "easy" | "medium" | "hard";

export interface PunjabiQuestionMetadata {
  engine: "punjabi-v1";
  packageId: "PUN-001";
  cpId: string;
  familyId: string;
  subtype: string;
  difficulty: PunjabiDifficulty;
  seed: number;
  authorityIds: string[];
  generatorRevision: string;
  semanticFingerprint: string;
  lifecycle: "REVIEW_ONLY";
}

export interface PunjabiGeneratedQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: PunjabiDifficulty;
  metadata: PunjabiQuestionMetadata;
}

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (const char of input.normalize("NFC")) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function semanticFingerprint(parts: readonly string[]): string {
  const canonical = parts.map((part) => part.normalize("NFC").trim()).join("\u241F");
  return `PUN-${hash32(canonical).toString(16).padStart(8, "0")}`;
}

export interface DeterministicRng {
  next(): number;
  pickOne<T>(items: readonly T[]): T;
  pickDistinct<T>(items: readonly T[], count: number): T[];
  shuffle<T>(items: readonly T[]): T[];
}

export function createDeterministicRng(seed: number, salt: string): DeterministicRng {
  let state = (seed ^ hash32(salt)) >>> 0;
  if (state === 0) state = 0x9e3779b9;

  const next = (): number => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapWith = Math.floor(next() * (index + 1));
      [output[index], output[swapWith]] = [output[swapWith]!, output[index]!];
    }
    return output;
  };

  return {
    next,
    pickOne<T>(items: readonly T[]): T {
      if (!items.length) throw new Error("Cannot choose from an empty authority pool.");
      return items[Math.floor(next() * items.length)]!;
    },
    pickDistinct<T>(items: readonly T[], count: number): T[] {
      if (count < 0 || count > items.length) {
        throw new Error(`Cannot choose ${count} distinct values from ${items.length}.`);
      }
      return shuffle(items).slice(0, count);
    },
    shuffle,
  };
}

/** Structural gate only. Linguistic truth belongs to CP authority tests. */
export function assertStructuralPunjabiQuestion(question: PunjabiGeneratedQuestion): void {
  assertPunjabiDisplayText(question.stem);
  assertPunjabiDisplayText(question.explanation);

  if (question.options.length !== 4) throw new Error("Punjabi MCQ must have exactly four options.");
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    throw new Error("Punjabi MCQ correctIndex is out of range.");
  }

  const normalized = question.options.map((option) => assertPunjabiDisplayText(option).normalized);
  const unique = new Set(normalized.map((value) => normalizePunjabiText(value)));
  if (unique.size !== 4) throw new Error("Punjabi MCQ options must be unique after NFC normalization.");

  if (!question.metadata.authorityIds.length) throw new Error("Punjabi question must retain authority lineage.");
  if (!question.metadata.semanticFingerprint.startsWith("PUN-")) {
    throw new Error("Punjabi question requires a semantic content fingerprint.");
  }
}
