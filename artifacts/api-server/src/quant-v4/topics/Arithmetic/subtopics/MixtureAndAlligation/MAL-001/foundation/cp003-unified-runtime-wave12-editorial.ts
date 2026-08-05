import {
  generateMalCp003Wave12UnifiedQuestion as generateBaseQuestion,
  malCp003Wave12UnifiedStable as stableBaseQuestion,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12";

export {
  MAL_CP003_WAVE12_CONTRACT_IDS,
  MAL_CP003_WAVE12_READINESS,
  MAL_CP003_WAVE12_RUNTIME_ID,
} from "./cp003-unified-runtime-wave12";
export type {
  MalCp003Wave12ContractId,
  MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12";

const REMOVAL_INVERSE_OPENERS = [
  "",
  "During an equal-replacement process, ",
  "For a repeated-replacement calculation, ",
  "In a competitive-exam vessel problem, ",
  "A student records the following operation: ",
  "Consider this repeated remove-and-refill process: ",
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

function varyRemovalStem(baseStem: string, seed: string): string {
  const opener =
    REMOVAL_INVERSE_OPENERS[
      hash(`${seed}:wave12-removal-opener`) % REMOVAL_INVERSE_OPENERS.length
    ]!;
  if (!opener) return baseStem;
  return `${opener}${lowerFirst(baseStem)}`;
}

export function generateMalCp003Wave12EditorialQuestion(
  contractId: MalCp003Wave12ContractId,
  seed = `mal-cp003-wave12-editorial:${contractId}:default`,
): MalCp003Wave12UnifiedQuestion {
  const base = generateBaseQuestion(contractId, seed);
  if (contractId !== "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL") {
    return base;
  }
  const stem = varyRemovalStem(base.stem, seed);
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

export function malCp003Wave12EditorialStable(
  question: MalCp003Wave12UnifiedQuestion,
): string {
  return stableBaseQuestion(question);
}
