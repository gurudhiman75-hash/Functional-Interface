import { generateMalCp001Prototype } from "./pipeline";
import { generateMalCp001GapRuntimePrototype } from "./cp001-gap-runtime";
import { isMalCp001GapPrototypeId } from "./cp001-gap-registry";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item
  );
}

/**
 * Unified discovery wrapper. Every external seed is deterministic; derived
 * retry seeds are used only when an exact hidden state is unsuitable for
 * learner-facing integral answers or four-option construction.
 */
export function generateMalCp001DiscoveryPrototype(
  prototypeId: MalCp001DiscoveryPrototypeId,
  seed: string,
) {
  if (!isMalCp001GapPrototypeId(prototypeId)) {
    return generateMalCp001Prototype(prototypeId, seed);
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}@review-${attempt}`;
    try {
      const generated = generateMalCp001GapRuntimePrototype(
        prototypeId,
        candidateSeed,
      );
      return {
        ...generated,
        seed,
        parameters: {
          ...generated.parameters,
          seed,
        },
      };
    } catch (error) {
      lastError = error;
    }
  }

  const reason = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `Could not generate a review-safe discovery prototype for ${prototypeId}/${seed}: ${reason}`,
  );
}

export function stableMalCp001DiscoveryPrototype(value: unknown): string {
  return stable(value);
}
