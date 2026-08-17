import {
  INT_CP005_RUNTIME_VERSION_V16,
  INT_CP005_V16_QL_IDS,
  INT_CP005_V16_SCOPE_DECISION,
  generateIntCp005QuestionV16,
  type IntCp005QuestionV16,
} from "./cp005-variable-growth-decay-runtime-v16";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_RUNTIME_VERSION_V16, INT_CP005_V16_QL_IDS, INT_CP005_V16_SCOPE_DECISION };
export type { IntCp005QuestionV16 };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function ql095IsGenuineComparison(question: IntCp005QuestionV16): boolean {
  if (question.mathematicalState.qlId !== "INT-QL-095") return true;
  const state = question.mathematicalState;
  const normalizedA = [...state.planARates]
    .map((rate) => `${rate.numerator}/${rate.denominator}`)
    .sort()
    .join("|");
  const normalizedB = [...state.planBRates]
    .map((rate) => `${rate.numerator}/${rate.denominator}`)
    .sort()
    .join("|");
  return normalizedA !== normalizedB && question.solution.numerator > 0n;
}

export function generateIntCp005QuestionV16Final(
  qlId: IntCp005QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16 {
  if (qlId !== "INT-QL-095") return generateIntCp005QuestionV16(qlId, seed, locale);

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const internalSeed = attempt === 0 ? seed : `${seed}:ql095-genuine-${attempt}`;
    try {
      const candidate = generateIntCp005QuestionV16(qlId, internalSeed, locale);
      if (!ql095IsGenuineComparison(candidate)) continue;
      return deepFreeze({
        ...candidate,
        seed,
        mathematicalFingerprint: `${candidate.mathematicalFingerprint}|V16_QL095_GENUINE_PROFILE_${attempt}`,
      });
    } catch (error) {
      if (attempt === 31) throw error;
    }
  }
  throw new Error(`${qlId}/${seed}: unable to select a genuine exam-friendly plan comparison`);
}
