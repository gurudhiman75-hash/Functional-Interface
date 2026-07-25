import type { DirectMap } from "../foundation/mapping";
import type { CodTokenKind, MappingEvidence } from "../foundation/types";
import { evidenceCoversWord } from "../foundation/mapping";

function alphabetRank(letter: string): number {
  return letter.charCodeAt(0) - 65;
}

function isUniformShift(mapping: DirectMap): boolean {
  const entries = Object.entries(mapping).filter(([, value]) => /^[A-Z]$/.test(value));
  if (entries.length < 2 || entries.length !== Object.keys(mapping).length) return false;
  const deltas = entries.map(([source, target]) => (alphabetRank(target) - alphabetRank(source) + 26) % 26);
  return new Set(deltas).size === 1;
}

function isOppositeAlphabet(mapping: DirectMap): boolean {
  const entries = Object.entries(mapping);
  return entries.length >= 2 && entries.every(([source, target]) => /^[A-Z]$/.test(target) && alphabetRank(source) + alphabetRank(target) === 25);
}

function hasOverlap(evidence: readonly MappingEvidence[]): boolean {
  for (let left = 0; left < evidence.length; left += 1) {
    const leftLetters = new Set([...evidence[left]!.source]);
    for (let right = left + 1; right < evidence.length; right += 1) {
      if ([...evidence[right]!.source].some((letter) => leftLetters.has(letter))) return true;
    }
  }
  return false;
}

export interface AmbiguityAudit {
  accepted: boolean;
  reasons: readonly string[];
}

export function auditDirectMapping(input: {
  mapping: DirectMap;
  evidence: readonly MappingEvidence[];
  target: string;
  outputKind: CodTokenKind;
  requireOverlap: boolean;
}): AmbiguityAudit {
  const reasons: string[] = [];
  if (!evidenceCoversWord(input.evidence, input.target)) reasons.push("target letters are not fully evidenced");
  if (input.requireOverlap && !hasOverlap(input.evidence)) reasons.push("examples do not overlap");
  if (input.outputKind === "LETTER" && isUniformShift(input.mapping)) reasons.push("evidence collapses to a uniform alphabet shift");
  if (input.outputKind === "LETTER" && isOppositeAlphabet(input.mapping)) reasons.push("evidence collapses to opposite-alphabet coding");
  if (Object.entries(input.mapping).some(([source, target]) => source === target)) reasons.push("identity mapping is present");
  return { accepted: reasons.length === 0, reasons };
}
