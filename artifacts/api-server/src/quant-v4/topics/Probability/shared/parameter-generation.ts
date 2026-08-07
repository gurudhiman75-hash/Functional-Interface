import type { GeneratedParameters, ProbabilityTaskRegistryEntry } from "./types";
import { hashSeed, pickRandom, randomInt, seededRandom } from "./random";

function difficultyRange(entry: ProbabilityTaskRegistryEntry, easy: [number, number], medium: [number, number], hard: [number, number]): [number, number] {
  return entry.difficulty === "Easy" ? easy : entry.difficulty === "Medium" ? medium : hard;
}
function reducedFraction(random: () => number, denominatorMin = 5, denominatorMax = 12): { numerator: number; denominator: number } {
  const denominator = randomInt(random, denominatorMin, denominatorMax);
  const numerator = randomInt(random, 1, denominator - 1);
  return { numerator, denominator };
}

function generateProbabilityParametersCore(entry: ProbabilityTaskRegistryEntry, seed: string): GeneratedParameters {
  const random = seededRandom(`${seed}:${entry.qlId}:parameters`);
  const mode = entry.solveMode;
  if (mode === "findDirectProbability") {
    const [min, max] = difficultyRange(entry, [10, 24], [18, 36], [28, 48]); const total = randomInt(random, min, max);
    return { total, favourable: randomInt(random, 2, total - 2), object: pickRandom(random, ["tickets", "tokens", "counters", "cards"] as const) };
  }
  if (mode === "findFavourableOutcomeCount" || mode === "findMissingEventCountFromProbability") {
    const fraction = reducedFraction(random); const scale = randomInt(random, 2, 6);
    return { probabilityNumerator: fraction.numerator, probabilityDenominator: fraction.denominator, total: fraction.denominator * scale, favourable: fraction.numerator * scale, context: pickRandom(random, ["winning tickets", "defective bulbs", "marked counters", "qualified applicants"] as const) };
  }
  if (mode === "findTotalOutcomeCount") {
    const fraction = reducedFraction(random); const scale = randomInt(random, 2, 6);
    return { probabilityNumerator: fraction.numerator, probabilityDenominator: fraction.denominator, total: fraction.denominator * scale, favourable: fraction.numerator * scale, context: pickRandom(random, ["winning coupons", "red tokens", "selected files", "successful trials"] as const) };
  }
  if (mode === "identifyImpossibleCertainOrPossibleEvent") {
    const n = randomInt(random, 8, 30); const state = pickRandom(random, ["CERTAIN", "IMPOSSIBLE", "POSSIBLE"] as const);
    const favourable = state === "CERTAIN" ? n : state === "IMPOSSIBLE" ? 0 : Math.floor(n / 2);
    return { n, state, favourable, eventLabel: state === "CERTAIN" ? `an integer not exceeding ${n}` : state === "IMPOSSIBLE" ? `an integer greater than ${n}` : "an even integer" };
  }
  if (mode === "findProbabilityFromSimpleFrequencyTable") {
    const red = randomInt(random, 3, 12), blue = randomInt(random, 4, 14), green = randomInt(random, 2, 10);
    const target = pickRandom(random, ["red", "blue", "green"] as const); return { red, blue, green, target };
  }

  if (mode === "findComplementProbability") { const f = reducedFraction(random, 6, 14); return { givenNumerator: f.numerator, givenDenominator: f.denominator, eventLabel: pickRandom(random, ["a machine passes inspection", "a candidate qualifies", "a train arrives on time"] as const) }; }
  if (["findAtLeastOneUsingComplement", "findNoneProbability", "findExactlyOneSuccess", "findExactlyKSuccessSmallCase", "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll"].includes(mode)) {
    const [min, max] = difficultyRange(entry, [2, 3], [3, 4], [4, 5]); const trials = randomInt(random, min, max);
    const k = mode === "findExactlyKSuccessSmallCase" || mode === "findAtMostKSuccessSmallCase" ? randomInt(random, 1, Math.max(1, trials - 1)) : 1;
    return { trials, k, successLabel: "head", failureLabel: "tail", fair: true };
  }

  if (mode === "findCoinPatternProbability") { const tosses = randomInt(random, 2, entry.difficulty === "Hard" ? 5 : 4); const pattern = Array.from({ length: tosses }, () => random() < 0.5 ? "H" : "T").join(""); return { tosses, pattern }; }
  if (mode === "findCoinHeadCountProbability") { const tosses = randomInt(random, 2, entry.difficulty === "Hard" ? 5 : 4); return { tosses, heads: randomInt(random, 1, tosses - 1) }; }
  if (mode === "findSingleDieEventProbability") { return { dieSides: 6, property: pickRandom(random, ["EVEN", "PRIME", "GREATER_THAN", "LESS_THAN"] as const), threshold: randomInt(random, 2, 4) }; }
  if (mode === "findTwoDiceSumProbability") { return { dieSides: 6, targetSum: randomInt(random, 4, 10) }; }
  if (mode === "findTwoDiceProductOrParityProbability") { return { dieSides: 6, eventType: pickRandom(random, ["PRODUCT", "SAME_PARITY", "DIFFERENT_PARITY"] as const), targetProduct: pickRandom(random, [6, 8, 10, 12] as const) }; }
  if (mode === "findSpinnerEventProbability") { const sectors = pickRandom(random, [6, 8, 10, 12] as const); return { sectors, favourableSectors: randomInt(random, 2, sectors - 2), sectorLabel: "shaded" }; }
  if (mode === "findNumberRangePropertyProbability") { const upper = randomInt(random, 20, entry.difficulty === "Hard" ? 60 : 45); return { lower: 1, upper, property: pickRandom(random, ["DIVISIBLE", "PRIME", "EVEN", "COMPOSITE"] as const), divisor: pickRandom(random, [2, 3, 4, 5, 6] as const) }; }
  if (mode === "findReverseDiceOrSpinnerEventCount") { const sectors = pickRandom(random, [8, 10, 12, 16] as const); const favourableSectors = randomInt(random, 2, sectors - 2); return { sectors, favourableSectors }; }

  if (["findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability", "findUnionCardEventProbability", "findComplementCardProbability", "findCardPropertyIntersection", "findMissingDeckCountOrEventCount"].includes(mode)) {
    return { rank: pickRandom(random, ["ace", "king", "queen", "jack"] as const), suit: pickRandom(random, ["hearts", "diamonds", "clubs", "spades"] as const), colour: pickRandom(random, ["red", "black"] as const), deckSize: 52 };
  }

  if (["findSingleDrawColourProbability", "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findMissingObjectCountFromProbability"].includes(mode) || (mode === "findSelectionProbabilityUsingCombination" && entry.cpId === "PRB-CP-005")) {
    const red = randomInt(random, 4, entry.difficulty === "Hard" ? 12 : 9), blue = randomInt(random, 4, entry.difficulty === "Hard" ? 12 : 9);
    const draw = mode === "findSingleDrawColourProbability" || mode === "findMissingObjectCountFromProbability" ? 1 : entry.difficulty === "Hard" ? 3 : 2;
    return { red, blue, total: red + blue, draw, targetColour: "red", secondaryColour: "blue", exactRed: Math.max(1, draw - 1) };
  }

  if (["findSuccessiveIndependentProbability", "findSuccessiveDependentProbability", "findWithReplacementProbability", "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages"].includes(mode)) {
    const red = randomInt(random, 4, 9), blue = randomInt(random, 4, 9); return { red, blue, total: red + blue, draws: 2, firstColour: "red", secondColour: "blue" };
  }

  if (mode === "findConditionalCardProbability") return { condition: "FACE_CARD", target: "KING", conditionCount: 12, favourable: 4 };
  if (mode === "findConditionalNumberProbability") { const upper = pickRandom(random, [20, 24, 30, 36, 40] as const); return { lower: 1, upper, conditionDivisor: 2, targetDivisor: 4 }; }
  if (mode === "findConditionalUrnProbability") { const red = randomInt(random, 5, 10), blue = randomInt(random, 4, 9); return { red, blue, knownFirstColour: "red", targetColour: "red" }; }
  if (mode === "findReverseConditionalCount") { const restrictedTotal = randomInt(random, 12, 30), favourable = randomInt(random, 2, restrictedTotal - 2); return { restrictedTotal, favourable, conditionLabel: "shortlisted", targetLabel: "certified" }; }
  if (mode === "findConditionalFromTwoWayTable" || mode === "findConditionalProbabilityByCounting") {
    const mathOnly = randomInt(random, 8, 18), both = randomInt(random, 3, mathOnly - 1), englishOnly = randomInt(random, 5, 16), neither = randomInt(random, 2, 10);
    return { mathTotal: mathOnly, both, englishOnly, neither, conditionLabel: "passed Mathematics", targetLabel: "passed English" };
  }

  if (["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) {
    const men = randomInt(random, 5, 10), women = randomInt(random, 4, 9), committeeSize = entry.difficulty === "Hard" ? 4 : 3;
    return { men, women, committeeSize, requiredWomen: mode === "findCommitteeCompositionProbability" ? randomInt(random, 1, committeeSize - 1) : 1 };
  }
  if (["findRandomArrangementPropertyProbability", "findTogetherOrApartProbability"].includes(mode)) { return { people: randomInt(random, 5, entry.difficulty === "Hard" ? 8 : 7), relation: mode === "findTogetherOrApartProbability" && random() < 0.5 ? "APART" : "TOGETHER" }; }
  if (mode === "findPositionRestrictionProbability") { const men = randomInt(random, 5, 9), women = randomInt(random, 4, 8), positions = entry.difficulty === "Hard" ? 4 : 3; return { men, women, positions, fixedGroup: "women" }; }
  if (mode === "findNumberFormationProbability") { const maxDigit = randomInt(random, 5, 9), length = entry.difficulty === "Hard" ? 4 : 3; return { minDigit: 1, maxDigit, symbolCount: maxDigit, length, property: "EVEN_LAST_DIGIT" }; }

  if (mode === "findIndependentIntersection") { const a = reducedFraction(random, 5, 9), b = reducedFraction(random, 5, 9); return { aNumerator: a.numerator, aDenominator: a.denominator, bNumerator: b.numerator, bDenominator: b.denominator, independent: true }; }
  if (mode === "findMutuallyExclusiveUnion") { const denominator = 10; const a = randomInt(random, 1, 3), b = randomInt(random, 1, 3); return { aNumerator: a, aDenominator: denominator, bNumerator: b, bDenominator: denominator, intersectionNumerator: 0, intersectionDenominator: 1, mutuallyExclusive: true }; }
  if (["findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability", "findMixedEventExpressionProbability"].includes(mode)) {
    const total = randomInt(random, 50, 100), aCount = randomInt(random, 18, 38), bCount = randomInt(random, 18, 38);
    const minOverlap = Math.max(1, aCount + bCount - total), maxOverlap = Math.min(aCount, bCount, minOverlap + 10), overlap = randomInt(random, minOverlap, maxOverlap);
    return { total, aCount, bCount, overlap, independent: false, mutuallyExclusive: false };
  }
  throw new Error(`No parameter strategy for ${entry.qlId} / ${mode}`);
}

const EASY_PROBABILITY_INSTRUCTIONS = [
  "Use lowest terms.", "Give a reduced fraction.", "State simplest form.", "Use exact form.",
  "Reduce the fraction.", "Give exact probability.", "State reduced form.", "Use fractional form.",
  "Give simplest form.", "Report exact fraction.", "Avoid decimal rounding.", "Simplify your answer."
] as const;
const MEDIUM_PROBABILITY_INSTRUCTIONS = [
  "Give the probability as a reduced fraction.", "State the exact answer in lowest terms.", "Express the result in simplest fractional form.",
  "Use an exact fraction without decimal rounding.", "Report the simplified fractional probability.", "Give an exact answer in reduced form.",
  "State the probability as a simplest fraction.", "Express the answer exactly and simplify it.", "Use lowest terms for the final probability.",
  "Present the reduced fraction as your answer.", "Avoid approximation and give exact probability.", "Report the exact probability in simplest form."
] as const;
const HARD_PROBABILITY_INSTRUCTIONS = [
  "Give the final probability exactly as a fraction in lowest terms.", "State the exact reduced probability and do not use decimal rounding.",
  "Express the final result as a fully simplified exact fraction.", "Report the probability in lowest terms after completing all counting.",
  "Use exact arithmetic and present the final reduced fractional probability.", "Give an exact simplified fraction based on the relevant sample space.",
  "State the probability precisely as a reduced fraction, without approximation.", "Present the exact probability in simplest form after applying the condition.",
  "Express the answer as an exact fraction reduced to lowest terms.", "Report the final exact probability and avoid all decimal approximations.",
  "Give the simplified fractional result using the correct restricted universe.", "State the final probability exactly and reduce the fraction completely."
] as const;
const EASY_COUNT_INSTRUCTIONS = [
  "Give the exact count.", "State the required number.", "Report the exact total.", "Give a whole-number answer.",
  "State the outcome count.", "Write the required count.", "Report the outcome number.", "Give the integer result.",
  "State the exact number.", "Provide the required total.", "Give the precise count.", "Report the whole-number result."
] as const;
const MEDIUM_COUNT_INSTRUCTIONS = [
  "Give the exact required count as a whole number.", "State the precise number of favourable outcomes.", "Report the complete outcome count without approximation.",
  "Give the required total as an exact integer.", "State the exact number obtained from the probability relation.", "Report the precise count of valid outcomes.",
  "Give an exact whole-number answer for the requested count.", "State the required count and do not approximate.", "Report the exact total represented by the probability.",
  "Give the precise integer count for this event.", "State the exact outcome total after rearranging the relation.", "Report the required number as a whole number."
] as const;
const HARD_COUNT_INSTRUCTIONS = [
  "Give the final required count exactly as a whole number.", "State the precise integer count after completing the reverse calculation.",
  "Report the exact number of outcomes represented by the probability.", "Give the required total exactly and do not use approximation.",
  "State the final whole-number count using the correct restricted universe.", "Report the precise count after applying all event and sample-space conditions.",
  "Give the exact integer result obtained from the probability relationship.", "State the required outcome count precisely after completing the calculation.",
  "Report the final exact count and preserve the stated counting convention.", "Give the precise whole-number answer for the requested event count.",
  "State the exact total after using the correct conditional denominator.", "Report the required count exactly, with no decimal approximation."
] as const;

const EASY_PROBABILITY_INSTRUCTIONS_ALT = [
  "Write lowest terms.", "Provide reduced form.", "Return simplest fraction.", "Use a simplified fraction.",
  "State exact fractional form.", "Give the lowest-term fraction.", "Report reduced probability.", "Express exact probability.",
  "Present simplest form.", "Use reduced probability.", "State the exact fraction.", "Give fully reduced form."
] as const;
const MEDIUM_PROBABILITY_INSTRUCTIONS_ALT = [
  "Return the exact fraction in lowest terms.", "Give the simplified probability without rounding.", "Use the stated sample space exactly.",
  "Report the reduced fractional result.", "State the exact probability after counting.", "Give the result in simplified form.",
  "Report the fully reduced probability.", "Express the answer exactly as a fraction.", "Present the reduced fraction without approximation.",
  "Use the correct universe and simplify.", "State the final answer in lowest terms.", "Give the exact probability after applying the condition."
] as const;
const HARD_PROBABILITY_INSTRUCTIONS_ALT = [
  "Write the final probability exactly and reduce the fraction to lowest terms.", "Provide the exact simplified probability after completing the full counting argument.",
  "Return an exact reduced fraction based on the correctly restricted sample space.", "Use exact arithmetic throughout and state the final probability in simplest form.",
  "State the reduced fractional probability after respecting every ordering and replacement condition.", "Give the exact final answer using the relevant conditional universe and event count.",
  "Report the probability precisely as a fraction reduced completely to lowest terms.", "Express the result exactly after accounting for all overlap or complement conditions.",
  "Present the fully simplified probability without replacing the exact value by a decimal.", "Use the declared experiment model and give the final exact reduced fraction.",
  "State the precise fractional probability after completing the independent counting verification.", "Give the exact simplified result using consistent favourable and total outcome counts."
] as const;
const EASY_COUNT_INSTRUCTIONS_ALT = [
  "Write the exact count.", "Provide the required number.", "Return the precise total.", "Use a whole number.",
  "State the valid count.", "Give the requested integer.", "Report the precise number.", "Write the integer result.",
  "Provide the exact total.", "State the required count.", "Give the whole-number result.", "Report the exact number."
] as const;
const MEDIUM_COUNT_INSTRUCTIONS_ALT = [
  "Write the exact whole-number count.", "Provide the precise favourable-outcome count.", "Return the complete count without approximation.",
  "Use an exact integer for the total.", "State the count from the probability relation.", "Give the precise count satisfying the event.",
  "Report the exact whole-number answer.", "Write the required count without approximation.", "Provide the exact total represented here.",
  "State the precise integer event count.", "Give the exact total after rearranging.", "Return the required whole-number result."
] as const;
const HARD_COUNT_INSTRUCTIONS_ALT = [
  "Write the final required count exactly as a whole-number result.", "Provide the precise integer count after completing the reverse probability calculation.",
  "Return the exact number of outcomes represented by the stated probability.", "Use the correct restricted universe and give the required total exactly.",
  "State the final whole-number count after applying every event condition.", "Report the precise count after preserving the declared counting convention throughout.",
  "Give the exact integer result recovered from the probability relationship.", "Write the required outcome count precisely after completing the full calculation.",
  "Provide the final exact count with no decimal approximation.", "State the precise whole-number answer for the requested event count.",
  "Return the exact total after using the correct conditional denominator.", "Report the required count exactly after completing the independent check."
] as const;

function seedVariant(seed: string, entry: ProbabilityTaskRegistryEntry): number {
  const numbered = seed.match(/:(residual|studio):(\d+)$/); if (numbered) { const packageCount = entry.packageId === "PRB-001" ? 120 : 96; return Math.floor(Number(numbered[2]) / packageCount) % 24; }
  const diversity = seed.match(/:diversity:[^:]+:(\d+)$/); if (diversity) return Number(diversity[1]) % 24;
  return hashSeed(seed) % 24;
}
export function generateProbabilityParameters(entry: ProbabilityTaskRegistryEntry, seed: string): GeneratedParameters {
  const generated = generateProbabilityParametersCore(entry, seed); const wordingVariant = seedVariant(seed, entry);
  const probabilityPool = entry.difficulty === "Easy" ? EASY_PROBABILITY_INSTRUCTIONS : entry.difficulty === "Medium" ? MEDIUM_PROBABILITY_INSTRUCTIONS : HARD_PROBABILITY_INSTRUCTIONS;
  const probabilityAlt = entry.difficulty === "Easy" ? EASY_PROBABILITY_INSTRUCTIONS_ALT : entry.difficulty === "Medium" ? MEDIUM_PROBABILITY_INSTRUCTIONS_ALT : HARD_PROBABILITY_INSTRUCTIONS_ALT;
  const countPool = entry.difficulty === "Easy" ? EASY_COUNT_INSTRUCTIONS : entry.difficulty === "Medium" ? MEDIUM_COUNT_INSTRUCTIONS : HARD_COUNT_INSTRUCTIONS;
  const countAlt = entry.difficulty === "Easy" ? EASY_COUNT_INSTRUCTIONS_ALT : entry.difficulty === "Medium" ? MEDIUM_COUNT_INSTRUCTIONS_ALT : HARD_COUNT_INSTRUCTIONS_ALT;
  const selectedPool = entry.answerDimension === "COUNT" ? (wordingVariant < 12 ? countPool : countAlt) : (wordingVariant < 12 ? probabilityPool : probabilityAlt);
  return { ...generated, wordingVariant, answerInstruction: selectedPool[wordingVariant % 12]! };
}
