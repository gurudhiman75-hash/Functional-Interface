import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV5,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV5,
} from "./cp005-variable-growth-decay-runtime-v5";

export const INT_CP005_RUNTIME_VERSION_V6 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v6" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV6 = Omit<IntCp005QuestionV5, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V6;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function sourceQuestion(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale,
): IntCp005QuestionV5 {
  if (qlId !== "INT-QL-095") return generateIntCp005QuestionV5(qlId, seed, locale);

  for (let attempt = 0; attempt < 64; attempt += 1) {
    const effectiveSeed = attempt === 0 ? seed : `${seed}:whole-rupee-plan:${attempt}`;
    try {
      return generateIntCp005QuestionV5(qlId, effectiveSeed, locale);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/INT-QL-095\/V5: non-integral learner money/u.test(message)) throw error;
    }
  }
  throw new Error(`${qlId}/${seed}/${locale}: could not construct exact whole-rupee plan options after 64 deterministic attempts`);
}

export function generateIntCp005QuestionV6(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV6 {
  const source = sourceQuestion(qlId, seed, locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V6,
    seed,
  });
}
