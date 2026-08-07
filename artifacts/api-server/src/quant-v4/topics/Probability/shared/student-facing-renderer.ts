import type { EventExpression, GeneratedParameters, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { rational, rationalText } from "./rational";

const num = (p: GeneratedParameters, key: string, fallback = 0) => typeof p[key] === "number" ? p[key] as number : fallback;
const text = (p: GeneratedParameters, key: string, fallback = "") => typeof p[key] === "string" ? p[key] as string : fallback;
const frac = (a: number | bigint, b: number | bigint) => rationalText(rational(a, b));
const noun = (count: number, one: string, many = `${one}s`) => count === 1 ? one : many;
const tidy = (value: string) => value.replace(/\s+/g, " ").replace(/\s+([?.!,])/g, "$1").trim();
const clean = (value: string) => value.replace(/_/g, " ").replace(/\bnot \((.+)\)$/i, "not $1").toLowerCase().replace(/\s+/g, " ").trim();
const eventName = (event: EventExpression) => clean(event.label);

function propertyPhrase(p: GeneratedParameters): string {
  const property = text(p, "property");
  if (property === "EVEN") return "even";
  if (property === "PRIME") return "prime";
  if (property === "COMPOSITE") return "composite";
  if (property === "GREATER_THAN") return `greater than ${num(p, "threshold")}`;
  if (property === "LESS_THAN") return `less than ${num(p, "threshold")}`;
  if (property === "DIVISIBLE") return `divisible by ${num(p, "divisor")}`;
  return clean(property);
}

function cardCondition(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters): string {
  const rank = text(p, "rank", "king"), suit = text(p, "suit", "spades"), colour = text(p, "colour", "red");
  if (entry.solveMode === "findSuitProbability") return `a ${suit} card`;
  if (entry.solveMode === "findColourProbability") return colour;
  if (entry.solveMode === "findFaceCardProbability") return "a face card";
  if (entry.solveMode === "findUnionCardEventProbability") return `a ${rank} or a ${suit} card`;
  if (entry.solveMode === "findComplementCardProbability") return `not a ${suit} card`;
  if (entry.solveMode === "findCardPropertyIntersection") return `the ${rank} of ${suit}`;
  return `a ${rank}`;
}

function committeeStem(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters, solved: SolvedProbability): string {
  const men = num(p, "men"), women = num(p, "women"), size = num(p, "committeeSize"), required = num(p, "requiredWomen", 1);
  if (entry.solveMode === "findRestrictedSelectionProbability") return `A committee of ${size} is chosen at random from ${men} men and ${women} women. What is the probability that at least one woman is selected?`;
  if (entry.solveMode === "findReverseCountFromProbability") return `A ${size}-member committee is chosen from ${men} men and ${women} women. The probability of selecting exactly ${required} ${noun(required, "woman", "women")} is ${frac(solved.evidence.favourableOutcomeCount ?? 0n, solved.evidence.totalOutcomeCount ?? 1n)}. How many such committees are possible?`;
  return `A committee of ${size} is chosen at random from ${men} men and ${women} women. What is the probability that exactly ${required} ${noun(required, "woman", "women")} ${required === 1 ? "is" : "are"} selected?`;
}

export function renderStudentFacingStem(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters, solved: SolvedProbability, event: EventExpression, legacyStem: string): string {
  const mode = entry.solveMode;
  const red = num(p, "red"), blue = num(p, "blue"), draw = num(p, "draw", 1);
  const trials = num(p, "trials", num(p, "tosses"));

  if (entry.cpId === "PRB-CP-008" && ["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) return tidy(committeeStem(entry, p, solved));

  switch (mode) {
    case "findDirectProbability": {
      const total = num(p, "total"), favourable = num(p, "favourable"), object = text(p, "object", "tokens");
      return tidy(`A box contains ${total} ${object}. Of these, ${favourable} are marked. One is chosen at random. What is the probability of choosing a marked ${object.replace(/s$/, "")}?`);
    }
    case "findFavourableOutcomeCount":
    case "findMissingEventCountFromProbability":
      return tidy(`There are ${num(p, "total")} equally likely outcomes. The probability of selecting one of the ${text(p, "context", "favourable outcomes")} is ${frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1))}. How many ${text(p, "context", "favourable outcomes")} are there?`);
    case "findTotalOutcomeCount":
      return tidy(`A group contains ${num(p, "favourable")} ${text(p, "context", "favourable outcomes")}. If the probability of selecting one of them is ${frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1))}, how many equally likely items are there in total?`);
    case "identifyImpossibleCertainOrPossibleEvent":
      return tidy(`One integer is chosen at random from 1 to ${num(p, "n")}. What is the probability that it is ${text(p, "eventLabel", eventName(event))}?`);
    case "findProbabilityFromSimpleFrequencyTable":
      return tidy(`A box contains ${red} red, ${blue} blue and ${num(p, "green")} green tokens. One token is chosen at random. What is the probability that it is ${text(p, "target", "red")}?`);
    case "findComplementProbability":
      return tidy(`The probability that ${text(p, "eventLabel", "the event occurs")} is ${frac(num(p, "givenNumerator"), num(p, "givenDenominator", 1))}. What is the probability that it does not happen?`);
    case "findAtLeastOneUsingComplement": return `A fair coin is tossed ${trials} times. What is the probability of getting at least one head?`;
    case "findNoneProbability": return `A fair coin is tossed ${trials} times. What is the probability of getting no head?`;
    case "findExactlyOneSuccess": return `A fair coin is tossed ${trials} times. What is the probability of getting exactly one head?`;
    case "findExactlyKSuccessSmallCase": { const k = num(p, "k"); return `A fair coin is tossed ${trials} times. What is the probability of getting exactly ${k} ${noun(k, "head")}?`; }
    case "findAtMostKSuccessSmallCase": { const k = num(p, "k"); return `A fair coin is tossed ${trials} times. What is the probability of getting at most ${k} ${noun(k, "head")}?`; }
    case "findAllSuccessOrNotAll": return `A fair coin is tossed ${trials} times. What is the probability that all tosses show the same face?`;
    case "findCoinPatternProbability": return `A fair coin is tossed ${num(p, "tosses")} times. What is the probability of getting the exact sequence ${text(p, "pattern")}?`;
    case "findCoinHeadCountProbability": { const heads = num(p, "heads"); return `A fair coin is tossed ${num(p, "tosses")} times. What is the probability of getting exactly ${heads} ${noun(heads, "head")}?`; }
    case "findSingleDieEventProbability": return `A fair six-sided die is rolled once. What is the probability of getting a number that is ${propertyPhrase(p)}?`;
    case "findTwoDiceSumProbability": return `Two fair dice are rolled together. What is the probability that their sum is ${num(p, "targetSum")}?`;
    case "findTwoDiceProductOrParityProbability": {
      const kind = text(p, "eventType");
      if (kind === "PRODUCT") return `Two fair dice are rolled together. What is the probability that their product is ${num(p, "targetProduct")}?`;
      return kind === "SAME_PARITY" ? "Two fair dice are rolled together. What is the probability that both numbers have the same parity?" : "Two fair dice are rolled together. What is the probability that one number is odd and the other is even?";
    }
    case "findSpinnerEventProbability": return `A fair spinner has ${num(p, "sectors")} equal sectors, of which ${num(p, "favourableSectors")} are shaded. What is the probability of landing on a shaded sector?`;
    case "findReverseDiceOrSpinnerEventCount": return `A fair spinner has ${num(p, "sectors")} equal sectors. The probability of landing on a marked sector is ${frac(num(p, "favourableSectors"), num(p, "sectors", 1))}. How many sectors are marked?`;
    case "findNumberRangePropertyProbability": return `One integer is chosen at random from ${num(p, "lower", 1)} to ${num(p, "upper")}, inclusive. What is the probability that it is ${propertyPhrase(p)}?`;
    case "findRankProbability":
    case "findSuitProbability":
    case "findColourProbability":
    case "findFaceCardProbability":
    case "findUnionCardEventProbability":
    case "findComplementCardProbability":
    case "findCardPropertyIntersection": return `One card is drawn at random from a standard deck of 52 cards. What is the probability that it is ${cardCondition(entry, p)}?`;
    case "findMissingDeckCountOrEventCount": return `In a standard deck of 52 cards, the probability of drawing ${cardCondition(entry, p)} is ${frac(solved.evidence.favourableOutcomeCount ?? 0n, 52n)}. How many cards satisfy this condition?`;
    case "findSingleDrawColourProbability": return `A bag contains ${red} red and ${blue} blue balls. One ball is drawn at random. What is the probability that it is red?`;
    case "findMissingObjectCountFromProbability": return `A bag contains ${red + blue} balls. The probability of drawing a red ball is ${frac(red, red + blue)}. How many red balls are in the bag?`;
    case "findSimultaneousSameTypeProbability": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that all drawn balls are of the same colour?`;
    case "findSimultaneousDifferentTypeProbability": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that both colours are represented?`;
    case "findExactCompositionProbability":
    case "findSelectionProbabilityUsingCombination": { const exact = num(p, "exactRed", 1); return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that exactly ${exact} ${noun(exact, "ball")} ${exact === 1 ? "is" : "are"} red?`; }
    case "findNoObjectOfTypeProbability": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that no red ball is drawn?`;
    case "findAtLeastOneObjectOfType": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that at least one red ball is drawn?`;
    case "findSuccessiveIndependentProbability":
    case "findWithReplacementProbability": return `A bag contains ${red} red and ${blue} blue balls. A ball is drawn, replaced, and another ball is drawn. What is the probability that both balls are red?`;
    case "findSuccessiveDependentProbability":
    case "findWithoutReplacementProbability": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that both are red?`;
    case "findOrderedDrawSequenceProbability": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability of drawing a red ball first and a blue ball second?`;
    case "findSameTypeInSuccessiveDraws": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that both balls are of the same colour?`;
    case "findDifferentTypesInSuccessiveDraws": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that the balls are of different colours?`;
    case "findAtLeastOneAcrossIndependentStages": return `A bag contains ${red} red and ${blue} blue balls. Two draws are made with replacement. What is the probability of getting at least one red ball?`;
    case "findConditionalProbabilityByCounting":
    case "findConditionalFromTwoWayTable": return `${num(p, "mathTotal")} students passed Mathematics, and ${num(p, "both")} of them also passed English. One student is chosen from those who passed Mathematics. What is the probability that the student also passed English?`;
    case "findConditionalCardProbability": return "A card drawn from a standard deck is known to be a face card. What is the probability that it is a king?";
    case "findConditionalNumberProbability": return `An integer chosen from 1 to ${num(p, "upper")} is known to be divisible by ${num(p, "conditionDivisor")}. What is the probability that it is also divisible by ${num(p, "targetDivisor")}?`;
    case "findConditionalUrnProbability": return `A bag contains ${red} red and ${blue} blue balls. The first ball drawn without replacement is known to be red. What is the probability that the next ball is also red?`;
    case "findReverseConditionalCount": return `Among ${num(p, "restrictedTotal")} ${text(p, "conditionLabel", "shortlisted candidates")}, the probability of being ${text(p, "targetLabel", "certified")} is ${frac(num(p, "favourable"), num(p, "restrictedTotal", 1))}. How many are ${text(p, "targetLabel", "certified")}?`;
    case "findRandomArrangementPropertyProbability": return `${num(p, "people")} people are arranged at random in a line. What is the probability that a specified person is first?`;
    case "findTogetherOrApartProbability": return `${num(p, "people")} people are arranged at random in a line. What is the probability that two specified people are ${text(p, "relation", "TOGETHER") === "APART" ? "not adjacent" : "adjacent"}?`;
    case "findPositionRestrictionProbability": return `${num(p, "positions")} distinct posts are assigned at random from ${num(p, "men")} men and ${num(p, "women")} women. What is the probability that the first post is assigned to a woman?`;
    case "findNumberFormationProbability": return `A ${num(p, "length")}-digit number is formed without repetition using digits ${num(p, "minDigit", 1)} to ${num(p, "maxDigit")}. What is the probability that the number is even?`;
    case "findUnionProbability": return `In a group of ${num(p, "total")} people, ${num(p, "aCount")} satisfy A, ${num(p, "bCount")} satisfy B, and ${num(p, "overlap")} satisfy both. What is the probability that a randomly chosen person satisfies A or B?`;
    case "findIntersectionProbability": return `In a group of ${num(p, "total")} people, ${num(p, "overlap")} satisfy both A and B. What is the probability that a randomly chosen person satisfies both A and B?`;
    case "findExactlyOneOfTwoEvents":
    case "findMixedEventExpressionProbability": return `P(A) = ${frac(num(p, "aCount"), num(p, "total", 1))}, P(B) = ${frac(num(p, "bCount"), num(p, "total", 1))} and P(A ∩ B) = ${frac(num(p, "overlap"), num(p, "total", 1))}. What is the probability that exactly one of A and B occurs?`;
    case "findNeitherEventProbability": return `P(A) = ${frac(num(p, "aCount"), num(p, "total", 1))}, P(B) = ${frac(num(p, "bCount"), num(p, "total", 1))} and P(A ∩ B) = ${frac(num(p, "overlap"), num(p, "total", 1))}. What is the probability that neither A nor B occurs?`;
    case "findMissingIntersectionOrUnionProbability": { const total = num(p, "total", 1), union = num(p, "aCount") + num(p, "bCount") - num(p, "overlap"); return `P(A) = ${frac(num(p, "aCount"), total)}, P(B) = ${frac(num(p, "bCount"), total)} and P(A ∪ B) = ${frac(union, total)}. Find P(A ∩ B).`; }
    case "findMutuallyExclusiveUnion": return `A and B are mutually exclusive. If P(A) = ${frac(num(p, "aNumerator"), num(p, "aDenominator", 1))} and P(B) = ${frac(num(p, "bNumerator"), num(p, "bDenominator", 1))}, find P(A ∪ B).`;
    case "findIndependentIntersection": return `A and B are independent. If P(A) = ${frac(num(p, "aNumerator"), num(p, "aDenominator", 1))} and P(B) = ${frac(num(p, "bNumerator"), num(p, "bDenominator", 1))}, find P(A ∩ B).`;
  }

  return tidy(legacyStem.replace(/^In this [^,]+,?\s*/i, "").replace(/\b[A-Z]+(?:_[A-Z]+)+\b/g, clean).replace(/,?\s*using [^,.?]+ when applicable/gi, ""));
}
