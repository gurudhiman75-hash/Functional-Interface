import { generateMalCp001Prototype } from "./pipeline";
import { generateMalCp001GapPrototype } from "./cp001-gap-pipeline";
import { isMalCp001GapPrototypeId } from "./cp001-gap-registry";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item
  );
}

/**
 * Discovery wrapper. Gap prototypes may reject an otherwise exact hidden state
 * when its displayed answer or distractors are unsuitable for learner review.
 * Retrying deterministic derived seeds is equivalent to valid-state-first
 * rejection sampling and preserves reproducibility for the external seed.
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
      const generated = generateMalCp001GapPrototype(prototypeId, candidateSeed);
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
