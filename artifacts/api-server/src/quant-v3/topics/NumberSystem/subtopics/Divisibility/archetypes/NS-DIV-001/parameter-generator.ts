import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
  type Cp002Parameters,
  type Cp003Parameters,
  type Cp004Parameters,
  type Cp005Parameters,
  type Cp006Parameters,
  type Cp007Parameters,
  type NsDiv001ValidDigitSetCanonicalProblemId,
  type ValidDigitSetParameters,
} from "./types";
import { createNsDiv001FixtureInstance, generateNsDiv001StructuralInstance } from "./instance-generator";
import { getNsDiv001ApprovedDivisorCapabilities } from "./realism-library";

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
  const divisorCapabilities = getNsDiv001ApprovedDivisorCapabilities(NS_DIV_001_CANONICAL_PROBLEM_ID);

  for (let offset = 0; offset < divisorCapabilities.length * 200; offset += 1) {
    const instance = generateNsDiv001StructuralInstance({
      canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
      seed: input.seed,
      attempt: offset,
    });
    const divisorCapability = divisorCapabilities[(Math.floor(hash / Math.max(divisorCapabilities.length, 1)) + offset) % divisorCapabilities.length];
    const validCandidates = instance.candidateDomain.filter((candidate) => {
      const resolvedNumber = Number(instance.numberExpression.replace("x", String(candidate)));
      return resolvedNumber % divisorCapability.divisor === 0;
    });

    if (validCandidates.length !== 1) {
      continue;
    }

    return {
      archetypeId: NS_DIV_001_ARCHETYPE_ID,
      canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
      questionId: instance.questionId,
      patternId: instance.patternId,
      instanceId: instance.instanceId,
      reasoningPatternId: divisorCapability.reasoningPattern.id,
      sourceTrace: {
        sourceId: "NS-DIV-001-REFERENCE-SLICE",
        sourceType: "reference-vertical-slice",
        note: "Phase 6 CP-001 vertical slice.",
      },
      divisorCapabilityId: divisorCapability.id,
      numberExpression: instance.numberExpression,
      missingDigitSymbol: "x",
      knownDigits: instance.knownDigits,
      missingPosition: instance.missingPosition,
      numberLength: instance.numberLength,
      divisor: divisorCapability.divisor,
      divisorComponents: "components" in divisorCapability ? divisorCapability.components : undefined,
      candidateDomain: instance.candidateDomain,
    };
  }

  throw new Error("No approved NS-DIV-001 CP-001 divisor and number-pattern combination produced a unique missing digit.");
}

export function generateCp002Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp002Parameters {
  const hash = hashSeed(input.seed ?? "NS-DIV-001:CP-002:largest-valid-digit");
  const divisorCapabilities = input.divisor
    ? getNsDiv001ApprovedDivisorCapabilities(NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID).filter((entry) => entry.divisor === input.divisor)
    : getNsDiv001ApprovedDivisorCapabilities(NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID);

  if (divisorCapabilities.length === 0) {
    throw new Error("No approved NS-DIV-001 CP-002 divisor capability matched the requested input.");
  }

  for (let offset = 0; offset < divisorCapabilities.length * 200; offset += 1) {
    const instance = input.numberExpression
      ? createNsDiv001FixtureInstance({
          canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
          numberExpression: input.numberExpression,
        })
      : generateNsDiv001StructuralInstance({
          canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
          seed: input.seed,
          attempt: offset,
        });
    const divisorCapability = divisorCapabilities[(Math.floor(hash / Math.max(divisorCapabilities.length, 1)) + offset) % divisorCapabilities.length];
    const validCandidates = instance.candidateDomain.filter((candidate) => {
      const resolvedNumber = Number(instance.numberExpression.replace("x", String(candidate)));
      return resolvedNumber % divisorCapability.divisor === 0;
    });

    if (validCandidates.length < 1) {
      continue;
    }

    return {
      archetypeId: NS_DIV_001_ARCHETYPE_ID,
      canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
      questionId: instance.questionId,
      patternId: instance.patternId,
      instanceId: instance.instanceId,
      reasoningPatternId: divisorCapability.reasoningPattern.id,
      sourceTrace: {
        sourceId: "NS-DIV-001-CP-002",
        sourceType: "reference-vertical-slice",
        note: "CP-002 Find Largest Valid Digit implementation.",
      },
      divisorCapabilityId: divisorCapability.id,
      numberExpression: instance.numberExpression,
      missingDigitSymbol: "x",
      knownDigits: instance.knownDigits,
      missingPosition: instance.missingPosition,
      numberLength: instance.numberLength,
      divisor: divisorCapability.divisor,
      divisorComponents: "components" in divisorCapability ? divisorCapability.components : undefined,
      candidateDomain: instance.candidateDomain,
    };
  }

  throw new Error("No approved NS-DIV-001 CP-002 divisor and number-pattern combination produced a non-empty valid digit set.");
}

export function generateCp003Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp003Parameters {
  return generateValidDigitSetParameters(NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID, "smallest-valid-digit", input) as Cp003Parameters;
}

export function generateCp004Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp004Parameters {
  return generateValidDigitSetParameters(NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID, "count-valid-digits", input) as Cp004Parameters;
}

export function generateCp005Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp005Parameters {
  return generateValidDigitSetParameters(NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID, "sum-valid-digits", input) as Cp005Parameters;
}

export function generateCp006Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp006Parameters {
  return generateValidDigitSetParameters(NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID, "greatest-valid-number", input) as Cp006Parameters;
}

export function generateCp007Parameters(input: { seed?: string; numberExpression?: string; divisor?: number } = {}): Cp007Parameters {
  return generateValidDigitSetParameters(NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID, "smallest-valid-number", input) as Cp007Parameters;
}

function generateValidDigitSetParameters(
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId,
  seedLabel: string,
  input: { seed?: string; numberExpression?: string; divisor?: number },
): ValidDigitSetParameters {
  const hash = hashSeed(input.seed ?? `NS-DIV-001:${canonicalProblemId}:${seedLabel}`);
  const divisorCapabilities = input.divisor
    ? getNsDiv001ApprovedDivisorCapabilities(canonicalProblemId).filter((entry) => entry.divisor === input.divisor)
    : getNsDiv001ApprovedDivisorCapabilities(canonicalProblemId);

  if (divisorCapabilities.length === 0) {
    throw new Error(`No approved NS-DIV-001 ${canonicalProblemId} divisor capability matched the requested input.`);
  }

  for (let offset = 0; offset < divisorCapabilities.length * 200; offset += 1) {
    const instance = input.numberExpression
      ? createNsDiv001FixtureInstance({
          canonicalProblemId,
          numberExpression: input.numberExpression,
        })
      : generateNsDiv001StructuralInstance({
          canonicalProblemId,
          seed: input.seed,
          attempt: offset,
        });
    const divisorCapability = divisorCapabilities[(Math.floor(hash / Math.max(divisorCapabilities.length, 1)) + offset) % divisorCapabilities.length];
    const validCandidates = instance.candidateDomain.filter((candidate) => {
      const resolvedNumber = Number(instance.numberExpression.replace("x", String(candidate)));
      return resolvedNumber % divisorCapability.divisor === 0;
    });

    if (validCandidates.length < 1) {
      continue;
    }

    return {
      archetypeId: NS_DIV_001_ARCHETYPE_ID,
      canonicalProblemId,
      questionId: instance.questionId,
      patternId: instance.patternId,
      instanceId: instance.instanceId,
      reasoningPatternId: divisorCapability.reasoningPattern.id,
      sourceTrace: {
        sourceId: `NS-DIV-001-${canonicalProblemId}`,
        sourceType: "reference-vertical-slice",
        note: `${canonicalProblemId} valid digit set implementation.`,
      },
      divisorCapabilityId: divisorCapability.id,
      numberExpression: instance.numberExpression,
      missingDigitSymbol: "x",
      knownDigits: instance.knownDigits,
      missingPosition: instance.missingPosition,
      numberLength: instance.numberLength,
      divisor: divisorCapability.divisor,
      divisorComponents: "components" in divisorCapability ? divisorCapability.components : undefined,
      candidateDomain: instance.candidateDomain,
    };
  }

  throw new Error(`No approved NS-DIV-001 ${canonicalProblemId} divisor and number-pattern combination produced a non-empty valid digit set.`);
}
