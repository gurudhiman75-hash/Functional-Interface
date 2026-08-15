import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV9,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV9,
} from "./cp005-variable-growth-decay-runtime-v9";

export const INT_CP005_RUNTIME_VERSION_V10 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v10" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV10 = Omit<IntCp005QuestionV9, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V10;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function generateSource(qlId: IntCp005QlId, seed: string, locale: IntCp005Locale): IntCp005QuestionV9 {
  if (qlId !== "INT-QL-095") return generateIntCp005QuestionV9(qlId, seed, locale);

  for (let attempt = 0; attempt < 128; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:v10-plan-safe:${attempt}`;
    try {
      return generateIntCp005QuestionV9(qlId, effectiveSeed, locale);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isKnownExactMoneyConstructionEdge = /INT-QL-095\/V5: non-integral learner money/u.test(message)
        || /could not construct exact whole-rupee plan options/u.test(message);
      if (!isKnownExactMoneyConstructionEdge) throw error;
    }
  }
  throw new Error(`${qlId}/${seed}/${locale}: V10 could not construct a safe exact-money plan state after 128 attempts`);
}

export function generateIntCp005QuestionV10(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV10 {
  const source = generateSource(qlId, seed, locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V10,
    seed,
  });
}
