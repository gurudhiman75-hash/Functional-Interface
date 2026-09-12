import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";
import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";

export const INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION =
  "INT-001-WAVE04-DIRECT-CALCULATION-PRESENTATION-v2" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

export function generateInt001Wave04DirectCalculationCandidate(
  qlId: Int001Wave03QlId,
  seed: string | number,
) {
  const source = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
  const steps = Object.freeze(
    (source.explanation.steps as readonly string[])
      .filter((step) => !/^This\s+₹/u.test(step))
      .map(String),
  );
  if (steps.length < 3 || steps.length > 6) {
    throw new Error(`${qlId}/${String(seed)}: direct-calculation presentation must contain 3–6 worked lines.`);
  }

  return deepFreeze({
    ...source,
    explanation: {
      whatAsked: "",
      keyIdea: "",
      steps,
      shortcut: "",
      commonTrap: "",
      finalAnswer: source.explanation.finalAnswer,
    },
    explanationStyle: "DIRECT_CALCULATION" as const,
    explanationPresentationVersion: INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION,
  });
}
