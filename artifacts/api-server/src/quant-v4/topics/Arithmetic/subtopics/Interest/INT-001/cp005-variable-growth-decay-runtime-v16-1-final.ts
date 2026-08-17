import {
  INT_CP005_RUNTIME_VERSION_V16_1,
  INT_CP005_V16_1_DECISION,
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1,
  intCp005V16_1TopologyKey,
  type IntCp005QuestionV16_1,
} from "./cp005-variable-growth-decay-runtime-v16-1-hardening";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export { INT_CP005_RUNTIME_VERSION_V16_1, INT_CP005_V16_1_DECISION, INT_CP005_V16_1_QL_IDS, intCp005V16_1TopologyKey };
export type { IntCp005QuestionV16_1 };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateIntCp005QuestionV16_1Final(
  qlId: IntCp005QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp005QuestionV16_1 {
  if (qlId === "INT-QL-094") throw new Error("INT-QL-094 remains outside CP005 V16.1 learner authority.");
  let lastError: unknown;
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const internalSeed = attempt === 0 ? seed : `${seed}:v16.1-exact-${attempt}`;
    try {
      const candidate = generateIntCp005QuestionV16_1(qlId, internalSeed, locale);
      return deepFreeze({
        ...candidate,
        seed,
        mathematicalFingerprint: `${candidate.mathematicalFingerprint}|V16_1_CONSTRUCTION_ATTEMPT_${attempt}`,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${qlId}/${seed}: unable to construct V16.1 exact learner item after 48 attempts; last=${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
