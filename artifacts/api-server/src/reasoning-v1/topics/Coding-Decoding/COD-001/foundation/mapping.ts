import type { CodTokenKind, MappingEvidence } from "./types";
import { joinCode, splitCode } from "./code-values";

export type DirectMap = Readonly<Record<string, string>>;

export function assertInjectiveMapping(mapping: DirectMap): void {
  const values = Object.values(mapping);
  if (new Set(values).size !== values.length) {
    throw new Error("Direct mapping must be injective");
  }
}

export function encodeWithMapping(source: string, mapping: DirectMap, separator: string): string {
  return joinCode([...source].map((letter) => {
    const token = mapping[letter];
    if (token === undefined) throw new Error(`Missing mapping for '${letter}'`);
    return token;
  }), separator);
}

export function invertMapping(mapping: DirectMap): DirectMap {
  assertInjectiveMapping(mapping);
  return Object.fromEntries(Object.entries(mapping).map(([source, target]) => [target, source]));
}

export function decodeWithMapping(code: string, mapping: DirectMap, separator: string): string {
  const inverse = invertMapping(mapping);
  return splitCode(code, separator).map((token) => {
    const source = inverse[token];
    if (source === undefined) throw new Error(`Missing inverse mapping for '${token}'`);
    return source;
  }).join("");
}

export function mappingFromEvidence(evidence: readonly MappingEvidence[], separator: string): DirectMap {
  const mapping: Record<string, string> = {};
  for (const pair of evidence) {
    const source = [...pair.source];
    const code = splitCode(pair.code, separator);
    if (source.length !== code.length) throw new Error("Evidence length mismatch");
    for (let index = 0; index < source.length; index += 1) {
      const letter = source[index]!;
      const token = code[index]!;
      if (mapping[letter] !== undefined && mapping[letter] !== token) {
        throw new Error(`Inconsistent mapping for '${letter}'`);
      }
      mapping[letter] = token;
    }
  }
  assertInjectiveMapping(mapping);
  return mapping;
}

export function evidenceCoversWord(evidence: readonly MappingEvidence[], word: string): boolean {
  const covered = new Set(evidence.flatMap((pair) => [...pair.source]));
  return [...new Set([...word])].every((letter) => covered.has(letter));
}

export function outputKindForToken(token: string): CodTokenKind {
  if (/^[A-Z]$/.test(token)) return "LETTER";
  if (/^[0-9]$/.test(token)) return "DIGIT";
  return "SYMBOL";
}
