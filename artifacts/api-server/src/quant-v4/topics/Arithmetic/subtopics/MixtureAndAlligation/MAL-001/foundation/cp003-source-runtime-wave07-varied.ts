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

const RETAINED_FRACTION_BANK = [
  "2/3",
  "9/10",
  "4/5",
  "3/4",
  "5/6",
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function sampleOrdinal(seed: string): number {
  const diversity = seed.match(/diversity-set:(\d+)/u);
  if (diversity) return Math.floor(Number(diversity[1]) / 9);
  const beforeCandidate = seed.match(/:(\d+):candidate-\d+$/u);
  if (beforeCandidate) return Number(beforeCandidate[1]);
  const trailing = seed.match(/(\d+)(?!.*\d)/u);
  return trailing ? Number(trailing[1]) : hash(seed);
}

function retainedFraction(question: MalCp003SourceRuntimeQuestion): string {
  const diagram = question.diagram as any;
  const firstStage = Array.isArray(diagram?.stages) ? diagram.stages[0] : undefined;
  const raw = firstStage?.retainedOriginalFractionAfterStage;
  if (raw) return String(raw).replace(/\s+/gu, "");
  const match = `${question.explanation.formula}\n${question.explanation.steps.join("\n")}`
    .match(/(\d+)\s*\/\s*(\d+)/u);
  if (!match) throw new Error(`Cannot read retained fraction for ${question.seed}.`);
  return `${match[1]}/${match[2]}`;
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
  const targetFraction = RETAINED_FRACTION_BANK[
    sampleOrdinal(seed) % RETAINED_FRACTION_BANK.length
  ]!;
  let base: MalCp003SourceRuntimeQuestion | undefined;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = generateMalCp003SourceRuntimeQuestion(
      candidateId,
      `${seed}:fraction-${targetFraction}:attempt-${attempt}`,
    );
    if (retainedFraction(candidate) === targetFraction) {
      base = candidate;
      break;
    }
  }
  if (!base) {
    throw new Error(
      `${candidateId}/${seed}: no source-backed case found for retained fraction ${targetFraction}.`,
    );
  }
  const stem = variedStem(base.stem, seed);
  const errors = base.validation.errors.filter(
    (error) => error !== "Stem is not interrogative.",
  );
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  return {
    ...base,
    seed,
    stem,
    validation: { ok: errors.length === 0, errors },
  };
}

export function malCp003VariedSourceRuntimeStable(
  question: MalCp003SourceRuntimeQuestion,
): string {
  return malCp003SourceRuntimeStable(question);
}
