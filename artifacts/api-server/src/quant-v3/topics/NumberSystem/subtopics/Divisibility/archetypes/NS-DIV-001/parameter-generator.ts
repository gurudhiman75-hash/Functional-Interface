import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
} from "./types";
import {
  assertNsDiv001NumberPatternAllowed,
  getNsDiv001AllowedStructures,
  getNsDiv001ApprovedDivisorCapabilities,
  getNsDiv001MissingPosition,
} from "./realism-library";

const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const NON_ZERO_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function generateCp001Parameters(input: { seed?: string } = {}): Cp001Parameters {
  const hash = hashSeed(input.seed ?? "NS-DIV-001:CP-001:reference-slice");
  const allowedStructures = getNsDiv001AllowedStructures();
  const divisorCapabilities = getNsDiv001ApprovedDivisorCapabilities(NS_DIV_001_CANONICAL_PROBLEM_ID);

  for (let offset = 0; offset < allowedStructures.length * divisorCapabilities.length; offset += 1) {
    const numberExpression = allowedStructures[(hash + offset) % allowedStructures.length];
    const divisorCapability = divisorCapabilities[(Math.floor(hash / allowedStructures.length) + offset) % divisorCapabilities.length];
    assertNsDiv001NumberPatternAllowed(numberExpression);
    const missingPosition = getNsDiv001MissingPosition(numberExpression);
    const candidateDomain = missingPosition === 1 ? NON_ZERO_DIGITS : ALL_DIGITS;
    const validCandidates = candidateDomain.filter((candidate) => {
      const resolvedNumber = Number(numberExpression.replace("x", String(candidate)));
      return resolvedNumber % divisorCapability.divisor === 0;
    });

    if (validCandidates.length !== 1) {
      continue;
    }

    const knownDigits = [...numberExpression].filter((char) => char !== "x").map((char) => Number(char));

    return {
      archetypeId: NS_DIV_001_ARCHETYPE_ID,
      canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
      reasoningPatternId: divisorCapability.reasoningPattern.id,
      sourceTrace: {
        sourceId: "NS-DIV-001-REFERENCE-SLICE",
        sourceType: "reference-vertical-slice",
        note: "Phase 6 CP-001 vertical slice.",
      },
      divisorCapabilityId: divisorCapability.id,
      numberExpression,
      missingDigitSymbol: "x",
      knownDigits,
      missingPosition,
      numberLength: numberExpression.length,
      divisor: divisorCapability.divisor,
      divisorComponents: "components" in divisorCapability ? divisorCapability.components : undefined,
      candidateDomain,
    };
  }

  throw new Error("No approved NS-DIV-001 CP-001 divisor and number-pattern combination produced a unique missing digit.");
}
