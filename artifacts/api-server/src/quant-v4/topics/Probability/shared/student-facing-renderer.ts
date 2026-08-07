import type { EventExpression, GeneratedParameters, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { rational, rationalText } from "./rational";

function numberValue(parameters: GeneratedParameters, key: string, fallback = 0): number {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
}
function stringValue(parameters: GeneratedParameters, key: string, fallback = ""): string {
  const value = parameters[key];
  return typeof value === "string" ? value : fallback;
}
function probabilityFrom(parameters: GeneratedParameters, numeratorKey: string, denominatorKey: string): string {
  return rationalText(rational(numberValue(parameters, numeratorKey), numberValue(parameters, denominatorKey, 1)));
}
function noun(count: number, singular: string, plural = `${singular}s`): string { return count === 1 ? singular : plural; }
function cleanLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bnot \((.+)\)$/i, "not $1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
function propertyPhrase(property: string, threshold: number, divisor: number): string {
  if (property === "EVEN") return "even";
  if (property === "PRIME") return "prime";
  if (property === "COMPOSITE") return "composite";
  if (property === "GREATER_THAN") return `greater than ${threshold}`;
  if (property === "LESS_THAN") return `less than ${threshold}`;
  if (property === "DIVISIBLE") return `divisible by ${divisor}`;
  return cleanLabel(property);
}
function cardProperty(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters): string {
  const rank = stringValue(p, "rank", "king");
  const suit = stringValue(p, "suit", "spades");
  const colour = stringValue(p, "colour", "red");
  switch (entry.solveMode) {
    case "findRankProbability": return `a ${rank}`;
    case "findSuitProbability": return `a ${suit} card`;
    case "findColourProbability": return `${colour}`;
    case "findFaceCardProbability": return "a face card";
    case "findUnionCardEventProbability": return `a ${rank} or a ${suit} card`;
    case "findComplementCardProbability": return `not a ${suit} card`;
    case "findCardPropertyIntersection": return `the ${rank} of ${suit}`;
    default: return `a ${rank}`;
  }
}
function eventLabel(event: EventExpression): string { return cleanLabel(event.label); }
function finish(text: string): string { return text.replace(/\s+/g, " ").replace(/\s+([?.!,])/g, "$1").trim(); }

export function renderStudentFacingStem(
  entry: ProbabilityTaskRegistryEntry,
  p: GeneratedParameters,
  solved: SolvedProbability,
  event: EventExpression,
  legacyStem: string,
): string {
  const mode = entry.solveMode;
  const red = numberValue(p, "red"), blue = numberValue(p, "blue");
  const draw = numberValue(p, "draw", 1);
  const trials = numberValue(p, "trials", numberValue(p, "tosses", 0));

  switch (mode) {
    case "findDirectProbability": {
      const total = numberValue(p, "total"), favourable = numberValue(p, "favourable"), object = stringValue(p, "object", "tokens");
      return finish(`A box contains ${total} ${object}. Of these, ${favourable} are marked. One is chosen at random. What is the probability of choosing a marked ${object.replace(/s$/, "")}?`);
    }
    case "findFavourableOutcomeCount":
    case "findMissingEventCountFromProbability": {
      const total = numberValue(p, "total"), context = stringValue(p, "context", "favourable outcomes");
      return finish(`There are ${total} equally likely outcomes. The probability of selecting one of the ${context} is ${probabilityFrom(p, "probabilityNumerator", "probabilityDenominator")}. How many ${context} are there?`);
    }
    case "findTotalOutcomeCount": {
      const favourable = numberValue(p, "favourable"), context = stringValue(p, "context", "favourable outcomes");
      return finish(`${favourable} outcomes are ${context}. If their probability is ${probabilityFrom(p, "probabilityNumerator", "probabilityDenominator")}, how many equally likely outcomes are there in total?`);
    }
    case "identifyImpossibleCertainOrPossibleEvent": {
      const n = numberValue(p, "n"), label = stringValue(p, "eventLabel", eventLabel(event));
      return finish(`One integer is chosen at random from 1 to ${n}. What is the probability that it is ${label}?`);
    }
    case "findProbabilityFromSimpleFrequencyTable": {
      const target = stringValue(p, "target", "red");
      return finish(`A box contains ${red} red, ${blue} blue and ${numberValue(p, "green")} green tokens. One token is chosen at random. What is the probability that it is ${target}?`);
    }
    case "findComplementProbability": {
      const label = stringValue(p, "eventLabel", "the event occurs");
      return finish(`The probability that ${label} is ${probabilityFrom(p, "givenNumerator", "givenDenominator")}. What is the probability that it does not happen?`);
    }
    case "findAtLeastOneUsingComplement":
      return finish(`A fair coin is tossed ${trials} times. What is the probability of getting at least one head?`);
    case "findNoneProbability":
      return finish(`A fair coin is tossed ${trials} times. What is the probability of getting no head?`);
    case "findExactlyOneSuccess":
      return finish(`A fair coin is tossed ${trials} times. What is the probability of getting exactly one head?`);
    case "findExactlyKSuccessSmallCase": {
      const k = numberValue(p, "k");
      return finish(`A fair coin is tossed ${trials} times. What is the probability of getting exactly ${k} ${noun(k, "head")}?`);
    }
    case "findAtMostKSuccessSmallCase": {
      const k = numberValue(p, "k");
      return finish(`A fair coin is tossed ${trials} times. What is the probability of getting at most ${k} ${noun(k, "head")}?`);
    }
    case "findAllSuccessOrNotAll":
      return finish(`A fair coin is tossed ${trials} times. What is the probability that all tosses show the same face?`);
    case "findCoinPatternProbability":
      return finish(`A fair coin is tossed ${numberValue(p, "tosses")} times. What is the probability of getting the exact sequence ${stringValue(p, "pattern")}?`);
    case "findCoinHeadCountProbability": {
      const heads = numberValue(p, "heads");
      return finish(`A fair coin is tossed ${numberValue(p, "tosses")} times. What is the probability of getting exactly ${heads} ${noun(heads, "head")}?`);
    }
    case "findSingleDieEventProbability": {
      const phrase = propertyPhrase(stringValue(p, "property"), numberValue(p, "threshold"), numberValue(p, "divisor"));
      return finish(`A fair six-sided die is rolled once. What is the probability of getting a number that is ${phrase}?`);
    }
    case "findTwoDiceSumProbability":
      return finish(`Two fair dice are rolled together. What is the probability that their sum is ${numberValue(p, "targetSum")}?`);
    case "findTwoDiceProductOrParityProbability": {
      const type = stringValue(p, "eventType");
      if (type === "PRODUCT") return finish(`Two fair dice are rolled together. What is the probability that their product is ${numberValue(p, "targetProduct")}?`);
      if (type === "SAME_PARITY") return "Two fair dice are rolled together. What is the probability that both numbers have the same parity?";
      return "Two fair dice are rolled together. What is the probability that one number is odd and the other is even?";
    }
    case "findSpinnerEventProbability":
      return finish(`A fair spinner has ${numberValue(p, "sectors")} equal sectors, of which ${numberValue(p, "favourableSectors")} are shaded. What is the probability of landing on a shaded sector?`);
    case "findReverseDiceOrSpinnerEventCount":
      return finish(`A fair spinner has ${numberValue(p, "sectors")} equal sectors. The probability of landing on a marked sector is ${rationalText(rational(numberValue(p, "favourableSectors"), numberValue(p, "sectors", 1)))}. How many sectors are marked?`);
    case "findNumberRangePropertyProbability": {
      const phrase = propertyPhrase(stringValue(p, "property"), numberValue(p, "threshold"), numberValue(p, "divisor"));
      return finish(`One integer is chosen at random from ${numberValue(p, "lower", 1)} to ${numberValue(p, "upper")}, inclusive. What is the probability that it is ${phrase}?`);
    }
    case "findRankProbability":
    case "findSuitProbability":
    case "findColourProbability":
    case "findFaceCardProbability":
    case "findUnionCardEventProbability":
    case "findComplementCardProbability":
    case "findCardPropertyIntersection":
      return finish(`One card is drawn at random from a standard deck of 52 cards. What is the probability that it is ${cardProperty(entry, p)}?`);
    case "findMissingDeckCountOrEventCount":
      return finish(`In a standard deck of 52 cards, the probability of drawing ${cardProperty(entry, p)} is ${rationalText(rational(BigInt(solved.evidence.favourableOutcomeCount ?? 0n), 52n))}. How many cards satisfy this condition?`);
    case "findSingleDrawColourProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. One ball is drawn at random. What is the probability that it is red?`);
    case "findMissingObjectCountFromProbability":
      return finish(`A bag contains ${red + blue} balls. The probability of drawing a red ball is ${rationalText(rational(red, red + blue))}. How many red balls are in the bag?`);
    case "findSimultaneousSameTypeProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that all drawn balls are of the same colour?`);
    case "findSimultaneousDifferentTypeProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that both colours are represented?`);
    case "findExactCompositionProbability":
    case "findSelectionProbabilityUsingCombination": {
      const exactRed = numberValue(p, "exactRed", numberValue(p, "requiredWomen", 1));
      if (entry.cpId === "PRB-CP-005") return finish(`A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that exactly ${exactRed} ${noun(exactRed, "ball")} ${exactRed === 1 ? "is" : "are"} red?`);
      break;
    }
    case "findNoObjectOfTypeProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that no red ball is drawn?`);
    case "findAtLeastOneObjectOfType":
      return finish(`A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that at least one red ball is drawn?`);
    case "findSuccessiveIndependentProbability":
    case "findWithReplacementProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. A ball is drawn, replaced, and another ball is drawn. What is the probability that both balls are red?`);
    case "findSuccessiveDependentProbability":
    case "findWithoutReplacementProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that both are red?`);
    case "findOrderedDrawSequenceProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability of drawing a red ball first and a blue ball second?`);
    case "findSameTypeInSuccessiveDraws":
      return finish(`A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that both balls are of the same colour?`);
    case "findDifferentTypesInSuccessiveDraws":
      return finish(`A bag contains ${red} red and ${blue} blue balls. Two balls are drawn one after another without replacement. What is the probability that the balls are of different colours?`);
    case "findAtLeastOneAcrossIndependentStages":
      return finish(`A bag contains ${red} red and ${blue} blue balls. Two draws are made with replacement. What is the probability of getting at least one red ball?`);
    case "findConditionalProbabilityByCounting":
    case "findConditionalFromTwoWayTable":
      return finish(`${numberValue(p, "mathTotal")} students passed Mathematics, and ${numberValue(p, "both")} of them also passed English. One student is chosen from those who passed Mathematics. What is the probability that the student also passed English?`);
    case "findConditionalCardProbability":
      return "A card drawn from a standard deck is known to be a face card. What is the probability that it is a king?";
    case "findConditionalNumberProbability":
      return finish(`An integer chosen from 1 to ${numberValue(p, "upper")} is known to be divisible by ${numberValue(p, "conditionDivisor")}. What is the probability that it is also divisible by ${numberValue(p, "targetDivisor")}?`);
    case "findConditionalUrnProbability":
      return finish(`A bag contains ${red} red and ${blue} blue balls. The first ball drawn without replacement is known to be red. What is the probability that the next ball is also red?`);
    case "findReverseConditionalCount":
      return finish(`Among ${numberValue(p, "restrictedTotal")} ${stringValue(p, "conditionLabel", "shortlisted candidates")}, the probability of being ${stringValue(p, "targetLabel", "certified")} is ${rationalText(rational(numberValue(p, "favourable"), numberValue(p, "restrictedTotal", 1)))}. How many are ${stringValue(p, "targetLabel", "certified")}?`);
    case "findSelectionProbabilityUsingCombination":
    case "findCommitteeCompositionProbability": {
      const men = numberValue(p, "men"), women = numberValue(p, "women"), size = numberValue(p, "committeeSize"), required = numberValue(p, "requiredWomen", 1);
      return finish(`A committee of ${size} is chosen at random from ${men} men and ${women} women. What is the probability that exactly ${required} ${noun(required, "woman", "women")} ${required === 1 ? "is" : "are"} selected?`);
    }
    case "findRestrictedSelectionProbability": {
      const men = numberValue(p, "men"), women = numberValue(p, "women"), size = numberValue(p, "committeeSize");
      return finish(`A committee of ${size} is chosen at random from ${men} men and ${women} women. What is the probability that at least one woman is selected?`);
    }
    case "findReverseCountFromProbability": {
      const men = numberValue(p, "men"), women = numberValue(p, "women"), size = numberValue(p, "committeeSize"), required = numberValue(p, "requiredWomen", 1);
      return finish(`A ${size}-member committee is chosen from ${men} men and ${women} women. The probability of selecting exactly ${required} ${noun(required, "woman", "women")} is ${rationalText(rational(BigInt(solved.evidence.favourableOutcomeCount ?? 0n), BigInt(solved.evidence.totalOutcomeCount ?? 1n)))}. How many such committees are possible?`);
    }
    case "findRandomArrangementPropertyProbability":
      return finish(`${numberValue(p, "people")} people are arranged at random in a line. What is the probability that a specified person is first?`);
    case "findTogetherOrApartProbability": {
      const relation = stringValue(p, "relation", "TOGETHER");
      return finish(`${numberValue(p, "people")} people are arranged at random in a line. What is the probability that two specified people are ${relation === "APART" ? "not adjacent" : "adjacent"}?`);
    }
    case "findPositionRestrictionProbability":
      return finish(`${numberValue(p, "positions")} distinct posts are assigned at random from ${numberValue(p, "men")} men and ${numberValue(p, "women")} women. What is the probability that the first post is assigned to a woman?`);
    case "findNumberFormationProbability":
      return finish(`A ${numberValue(p, "length")}-digit number is formed without repetition using digits ${numberValue(p, "minDigit", 1)} to ${numberValue(p, "maxDigit")}. What is the probability that the number is even?`);
    case "findUnionProbability":
      return finish(`In a group of ${numberValue(p, "total")} people, ${numberValue(p, "aCount")} satisfy A, ${numberValue(p, "bCount")} satisfy B, and ${numberValue(p, "overlap")} satisfy both. What is the probability that a randomly chosen person satisfies A or B?`);
    case "findIntersectionProbability":
      return finish(`In a group of ${numberValue(p, "total")} people, ${numberValue(p, "overlap")} satisfy both A and B. What is the probability that a randomly chosen person satisfies both A and B?`);
    case "findExactlyOneOfTwoEvents":
    case "findMixedEventExpressionProbability":
      return finish(`P(A) = ${rationalText(rational(numberValue(p, "aCount"), numberValue(p, "total", 1)))}, P(B) = ${rationalText(rational(numberValue(p, "bCount"), numberValue(p, "total", 1)))} and P(A ∩ B) = ${rationalText(rational(numberValue(p, "overlap"), numberValue(p, "total", 1)))}. What is the probability that exactly one of A and B occurs?`);
    case "findNeitherEventProbability":
      return finish(`P(A) = ${rationalText(rational(numberValue(p, "aCount"), numberValue(p, "total", 1)))}, P(B) = ${rationalText(rational(numberValue(p, "bCount"), numberValue(p, "total", 1)))} and P(A ∩ B) = ${rationalText(rational(numberValue(p, "overlap"), numberValue(p, "total", 1)))}. What is the probability that neither A nor B occurs?`);
    case "findMissingIntersectionOrUnionProbability": {
      const total = numberValue(p, "total", 1), union = numberValue(p, "aCount") + numberValue(p, "bCount") - numberValue(p, "overlap");
      return finish(`P(A) = ${rationalText(rational(numberValue(p, "aCount"), total))}, P(B) = ${rationalText(rational(numberValue(p, "bCount"), total)))} and P(A ∪ B) = ${rationalText(rational(union, total))}. Find P(A ∩ B).`);
    }
    case "findMutuallyExclusiveUnion":
      return finish(`A and B are mutually exclusive. If P(A) = ${probabilityFrom(p, "aNumerator", "aDenominator")} and P(B) = ${probabilityFrom(p, "bNumerator", "bDenominator")}, find P(A ∪ B).`);
    case "findIndependentIntersection":
      return finish(`A and B are independent. If P(A) = ${probabilityFrom(p, "aNumerator", "aDenominator")} and P(B) = ${probabilityFrom(p, "bNumerator", "bDenominator")}, find P(A ∩ B).`);
  }

  return finish(
    legacyStem
      .replace(/^In this [^,]+,?\s*/i, "")
      .replace(/\b[A-Z]+(?:_[A-Z]+)+\b/g, (value) => cleanLabel(value))
      .replace(/,?\s*using [^,.?]+ when applicable/gi, "")
      .replace(/\bexactly 1 (tosses|balls|women|men|cards|draws)\b/gi, (_, word: string) => `exactly one ${word.replace(/s$/, "")}`),
  );
}
