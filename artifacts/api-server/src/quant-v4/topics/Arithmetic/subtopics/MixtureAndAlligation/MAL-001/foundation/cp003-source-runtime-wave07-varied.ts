import {
  generateMalCp003SourceRuntimeQuestion,
  malCp003SourceRuntimeStable,
  type MalCp003SourceRuntimeQuestion,
} from "./cp003-source-runtime-wave07";
import type { MalCp003Wave04SourceCandidateId } from "./cp003-source-contract-wave04";

const STEM_OPENERS = [
  "",
  "During an equal-replacement process, ",
  "For a repeated-replacement calculation, ",
  "In a competitive-exam mixture problem, ",
  "A storekeeper records this repeated operation: ",
  "A technician performs the same replacement repeatedly. ",
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function lowerFirst(value: string): string {
  return value.length === 0 ? value : `${value[0]!.toLowerCase()}${value.slice(1)}`;
}

function variedStem(baseStem: string, seed: string): string {
  const opener = STEM_OPENERS[hash(`${seed}:stem-opener`) % STEM_OPENERS.length]!;
  if (!opener) return baseStem;
  if (opener.endsWith(": ")) return `${opener}${lowerFirst(baseStem)}`;
  if (opener.endsWith(". ")) return `${opener}${baseStem}`;
  return `${opener}${lowerFirst(baseStem)}`;
}

export function generateMalCp003VariedSourceRuntimeQuestion(
  candidateId: MalCp003Wave04SourceCandidateId,
  seed = `mal-cp003-source-runtime-varied:${candidateId}:default`,
): MalCp003SourceRuntimeQuestion {
  const base = generateMalCp003SourceRuntimeQuestion(candidateId, seed);
  const stem = variedStem(base.stem, seed);
  const errors = base.validation.errors.filter(
    (error) => error !== "Stem is not interrogative.",
  );
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  return {
    ...base,
    stem,
    validation: { ok: errors.length === 0, errors },
  };
}

export function malCp003VariedSourceRuntimeStable(
  question: MalCp003SourceRuntimeQuestion,
): string {
  return malCp003SourceRuntimeStable(question);
}
