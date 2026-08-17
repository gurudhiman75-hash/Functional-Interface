import { hash } from "./cp003-exam-model";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005QuestionV3,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV3,
} from "./cp005-variable-growth-decay-runtime-v3";

export const INT_CP005_RUNTIME_VERSION_V4 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v4" as const;
export { INT_CP005_QL_IDS, INT_CP005_REGISTRY_V2, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV4 = Omit<IntCp005QuestionV3, "runtimeVersion"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V4;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function mixedWord(seed: string, label: string): string {
  let x = hash(`${seed}:${label}`) >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  x ^= x >>> 16;
  return (x >>> 0).toString(16).padStart(8, "0");
}

function sourceSeedFor(qlId: IntCp005QlId, seed: string): string {
  // The V1 threshold sampler selects several power-of-two pools from low FNV bits.
  // Sequential production seeds therefore alias heavily. A deterministic avalanche
  // salt breaks that selection correlation without changing any mathematical rule.
  if (qlId !== "INT-QL-093") return seed;
  return `${seed}:threshold-spread:${mixedWord(seed, "a")}:${mixedWord(seed, "b")}:${mixedWord(seed, "c")}`;
}

export function generateIntCp005QuestionV4(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV4 {
  const source = generateIntCp005QuestionV3(qlId, sourceSeedFor(qlId, seed), locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V4,
    seed,
  });
}
