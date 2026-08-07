import type { GeneratedParameters, ProbabilityQuestionLanguageEntry, ProbabilityTaskRegistryEntry, ProbabilityVisual, SolvedProbability, VerificationResult } from "./types";
import { rational, rationalText } from "./rational";

function wordCount(lines: string[]): number { return lines.join(" ").trim().split(/\s+/).filter(Boolean).length; }
function n(parameters: GeneratedParameters, key: string, fallback = 0): number { const value = parameters[key]; return typeof value === "number" ? value : fallback; }
function fraction(numerator: number | bigint, denominator: number | bigint): string { return rationalText(rational(numerator, denominator)); }
function probabilityLine(solved: SolvedProbability): string {
  const total = solved.evidence.totalOutcomeCount;
  const favourable = solved.evidence.favourableOutcomeCount;
  if (total !== undefined && favourable !== undefined) return `Probability = ${favourable}/${total} = ${solved.exactDisplay}.`;
  return `Answer = ${solved.exactDisplay}.`;
}

export function renderProbabilityExplanation(
  entry: ProbabilityTaskRegistryEntry,
  _language: ProbabilityQuestionLanguageEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
  _verification: VerificationResult,
  _visuals: ProbabilityVisual[],
): string[] {
  const mode = entry.solveMode;
  const total = solved.evidence.totalOutcomeCount;
  const favourable = solved.evidence.favourableOutcomeCount;

  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability"].includes(mode)) {
    return [`Favourable outcomes = total outcomes × probability.`, `${n(parameters, "total")} × ${fraction(n(parameters, "probabilityNumerator"), n(parameters, "probabilityDenominator", 1))} = ${solved.exactDisplay}.`];
  }
  if (mode === "findTotalOutcomeCount") {
    return [`Total outcomes = favourable outcomes ÷ probability.`, `${n(parameters, "favourable")} ÷ ${fraction(n(parameters, "probabilityNumerator"), n(parameters, "probabilityDenominator", 1))} = ${solved.exactDisplay}.`];
  }
  if (mode === "findComplementProbability") {
    return [`The event and its opposite add up to 1.`, `Required probability = 1 - ${fraction(n(parameters, "givenNumerator"), n(parameters, "givenDenominator", 1))} = ${solved.exactDisplay}.`];
  }
  if (mode === "findAtLeastOneUsingComplement") {
    const trials = n(parameters, "trials"), allTails = fraction(1, 2 ** trials);
    return [`It is easier to subtract the case of no head.`, `P(at least one head) = 1 - ${allTails} = ${solved.exactDisplay}.`];
  }
  if (mode === "findNoneProbability") {
    const trials = n(parameters, "trials");
    return [`Only one sequence has no head: all tails.`, `Probability = 1/${2 ** trials} = ${solved.exactDisplay}.`];
  }
  if (["findExactlyOneSuccess", "findExactlyKSuccessSmallCase", "findAtMostKSuccessSmallCase", "findAllSuccessOrNotAll", "findCoinPatternProbability", "findCoinHeadCountProbability"].includes(mode)) {
    const tosses = n(parameters, "trials", n(parameters, "tosses"));
    return [`Total coin-toss sequences = 2^${tosses} = ${2 ** tosses}.`, favourable !== undefined ? `Required sequences = ${favourable}.` : "Count the required sequences.", probabilityLine(solved)];
  }
  if (["findSingleDieEventProbability", "findTwoDiceSumProbability", "findTwoDiceProductOrParityProbability", "findSpinnerEventProbability", "findNumberRangePropertyProbability"].includes(mode)) {
    return [total !== undefined ? `Total possible outcomes = ${total}.` : "List all possible outcomes.", favourable !== undefined ? `Favourable outcomes = ${favourable}.` : "Count the favourable outcomes.", probabilityLine(solved)];
  }
  if (mode === "findReverseDiceOrSpinnerEventCount") {
    return [`Marked sectors = total sectors × probability.`, `${n(parameters, "sectors")} × ${fraction(n(parameters, "favourableSectors"), n(parameters, "sectors", 1))} = ${solved.exactDisplay}.`];
  }
  if (["findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability", "findCardPropertyIntersection"].includes(mode)) {
    return [`A standard deck has 52 cards.`, favourable !== undefined ? `Cards satisfying the condition = ${favourable}.` : "Count the required cards.", probabilityLine(solved)];
  }
  if (mode === "findUnionCardEventProbability") {
    return [`Add the rank cards and suit cards, then subtract the one card counted twice.`, favourable !== undefined ? `Favourable cards = ${favourable}.` : "Count the favourable cards.", probabilityLine(solved)];
  }
  if (mode === "findComplementCardProbability") {
    return [`Cards not in the named suit = 52 - 13 = 39.`, `Probability = 39/52 = ${solved.exactDisplay}.`];
  }
  if (mode === "findMissingDeckCountOrEventCount") {
    return [`Required cards = 52 × given probability.`, `Required cards = ${solved.exactDisplay}.`];
  }
  if (mode === "findSingleDrawColourProbability") {
    const red = n(parameters, "red"), blue = n(parameters, "blue");
    return [`Total balls = ${red} + ${blue} = ${red + blue}.`, `Probability of red = ${red}/${red + blue} = ${solved.exactDisplay}.`];
  }
  if (mode === "findMissingObjectCountFromProbability") {
    return [`Red balls = total balls × probability.`, `Red balls = ${solved.exactDisplay}.`];
  }
  if (["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findSelectionProbabilityUsingCombination"].includes(mode) && entry.cpId === "PRB-CP-005") {
    return [total !== undefined ? `Total selections = ${total}.` : "Count all selections using combinations.", favourable !== undefined ? `Required selections = ${favourable}.` : "Count the required selections.", probabilityLine(solved)];
  }
  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    const red = n(parameters, "red"), totalBalls = red + n(parameters, "blue");
    return [`With replacement, the bag is unchanged after the first draw.`, `Probability = ${red}/${totalBalls} × ${red}/${totalBalls} = ${solved.exactDisplay}.`];
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    const red = n(parameters, "red"), totalBalls = red + n(parameters, "blue");
    return [`After one red ball is drawn, ${red - 1} red balls remain out of ${totalBalls - 1}.`, `Probability = ${red}/${totalBalls} × ${red - 1}/${totalBalls - 1} = ${solved.exactDisplay}.`];
  }
  if (mode === "findOrderedDrawSequenceProbability") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), totalBalls = red + blue;
    return [`First draw red, then draw blue from the remaining balls.`, `Probability = ${red}/${totalBalls} × ${blue}/${totalBalls - 1} = ${solved.exactDisplay}.`];
  }
  if (["findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws"].includes(mode)) {
    return [`Add the valid colour orders.`, favourable !== undefined && total !== undefined ? `Probability = ${favourable}/${total} = ${solved.exactDisplay}.` : `Probability = ${solved.exactDisplay}.`];
  }
  if (mode === "findAtLeastOneAcrossIndependentStages") {
    const blue = n(parameters, "blue"), totalBalls = n(parameters, "red") + blue;
    return [`Subtract the chance of getting blue both times.`, `P(at least one red) = 1 - (${blue}/${totalBalls} × ${blue}/${totalBalls}) = ${solved.exactDisplay}.`];
  }
  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalCardProbability", "findConditionalNumberProbability", "findConditionalUrnProbability"].includes(mode)) {
    return [total !== undefined ? `The given condition leaves ${total} possible cases.` : "First restrict the sample space using the condition.", favourable !== undefined ? `${favourable} of them satisfy the required event.` : "Count the required cases in this smaller group.", probabilityLine(solved)];
  }
  if (mode === "findReverseConditionalCount") {
    return [`Required count = restricted total × conditional probability.`, `${n(parameters, "restrictedTotal")} × ${fraction(n(parameters, "favourable"), n(parameters, "restrictedTotal", 1))} = ${solved.exactDisplay}.`];
  }
  if (["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability", "findRandomArrangementPropertyProbability", "findTogetherOrApartProbability", "findPositionRestrictionProbability", "findNumberFormationProbability"].includes(mode)) {
    if (solved.answer.kind === "COUNT") return [total !== undefined ? `Total possible selections = ${total}.` : "Count all possible selections.", `Required selections = ${solved.exactDisplay}.`];
    return [total !== undefined ? `Total possible arrangements or selections = ${total}.` : "Count all possible arrangements or selections.", favourable !== undefined ? `Required cases = ${favourable}.` : "Count the required cases.", probabilityLine(solved)];
  }
  if (mode === "findMutuallyExclusiveUnion") {
    return [`Mutually exclusive events cannot happen together.`, `P(A ∪ B) = P(A) + P(B) = ${solved.exactDisplay}.`];
  }
  if (mode === "findIndependentIntersection") {
    return [`For independent events, multiply the probabilities.`, `P(A ∩ B) = P(A) × P(B) = ${solved.exactDisplay}.`];
  }
  if (mode === "findUnionProbability") {
    return [`Use P(A ∪ B) = P(A) + P(B) - P(A ∩ B).`, favourable !== undefined && total !== undefined ? `Probability = ${favourable}/${total} = ${solved.exactDisplay}.` : `Answer = ${solved.exactDisplay}.`];
  }
  if (mode === "findIntersectionProbability") return [favourable !== undefined && total !== undefined ? `Both A and B occur in ${favourable} out of ${total} cases.` : "Use the given overlap.", probabilityLine(solved)];
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) {
    return [`Exactly one event = A only + B only.`, `P(exactly one) = P(A) + P(B) - 2P(A ∩ B) = ${solved.exactDisplay}.`];
  }
  if (mode === "findNeitherEventProbability") {
    return [`First find P(A ∪ B).`, `P(neither) = 1 - P(A ∪ B) = ${solved.exactDisplay}.`];
  }
  if (mode === "findMissingIntersectionOrUnionProbability") {
    return [`Use P(A ∪ B) = P(A) + P(B) - P(A ∩ B).`, `P(A ∩ B) = P(A) + P(B) - P(A ∪ B) = ${solved.exactDisplay}.`];
  }

  if (total !== undefined && favourable !== undefined) return [`Favourable outcomes = ${favourable}. Total outcomes = ${total}.`, probabilityLine(solved)];
  return [`Use the stated probability relation.`, `Answer = ${solved.exactDisplay}.`];
}

export function explanationWordCount(lines: string[]): number { return wordCount(lines); }
