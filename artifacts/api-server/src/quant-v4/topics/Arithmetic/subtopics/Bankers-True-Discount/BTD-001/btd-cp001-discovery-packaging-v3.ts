import {
  BTD_001_PROTOTYPE_IDS,
  buildBtdDiscoveryQuestionV2,
  type BtdPrototypeId,
} from "./btd-cp001-discovery-packaging-v2";

export const BTD_001_DISCOVERY_PACKAGING_V3 = "BTD-001-CP001-DISCOVERY-PACKAGING-v3-option-safe" as const;
export { BTD_001_PROTOTYPE_IDS };
export type { BtdPrototypeId };

const REMEDIABLE_OPTION_ERROR = "v2 could not build three distinct exam-safe distractors";

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function buildBtdDiscoveryQuestionV3(prototypeId: BtdPrototypeId, requestedSeed: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const effectiveSeed = attempt === 0 ? requestedSeed : `${requestedSeed}:option-safe:${attempt}`;
    try {
      const base = buildBtdDiscoveryQuestionV2(prototypeId, effectiveSeed) as any;
      return deepFreeze({
        ...base,
        packagingVersion: BTD_001_DISCOVERY_PACKAGING_V3,
        requestedSeed,
        effectiveSeed,
        packagingResolutionAttempts: attempt + 1,
        packagingRemediation: attempt === 0
          ? "NONE_REQUIRED"
          : "DETERMINISTIC_OPTION_SAFE_STATE_RESELECTION_WITHIN_SAME_PROTOTYPE_AUTHORITY",
      });
    } catch (error) {
      lastError = error;
      if (!(error instanceof Error) || !error.message.includes(REMEDIABLE_OPTION_ERROR)) throw error;
    }
  }
  throw new Error(`${prototypeId}/${requestedSeed}: unable to resolve an option-safe discovery state after 64 attempts; last=${String(lastError)}`);
}
