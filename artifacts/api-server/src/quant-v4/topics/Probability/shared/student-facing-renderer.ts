import type { EventExpression, GeneratedParameters, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { rational, rationalText } from "./rational";

const num = (p: GeneratedParameters, key: string, fallback = 0) => typeof p[key] === "number" ? p[key] as number : fallback;
const text = (p: GeneratedParameters, key: string, fallback = "") => typeof p[key] === "string" ? p[key] as string : fallback;
const frac = (a: number | bigint, b: number | bigint) => rationalText(rational(a, b));
const noun = (count: number, one: string, many = `${one}s`) => count === 1 ? one : many;
const article = (word: string) => /^[aeiou]/i.test(word) ? "an" : "a";
const tidy = (value: string) => value.replace(/\s+/g, " ").replace(/\s+([?.!,])/g, "$1").trim();
const clean = (value: string) => value.replace(/_/g, " ").replace(/\bnot \((.+)\)$/i, "not $1").toLowerCase().replace(/\s+/g, " ").trim();
const eventName = (event: EventExpression) => clean(event.label);

function singularObject(value: string): string {
  if (value === "cards") return "card";
  if (value === "counters") return "counter";
  if (value === "tickets") return "ticket";
  if (value === "tokens") return "token";
  return value.replace(/s$/, "");
}

function containerFor(object: string): string {
  if (object === "cards") return "A pack";
  if (object === "counters") return "A bag";
  return "A box";
}

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

function suitSingular(suit: string): string {
  return suit.replace(/s$/i, "");
}

function cardCondition(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters): string {
  const rank = text(p, "rank", "king");
  const suit = suitSingular(text(p, "suit", "spades"));
  const colour = text(p, "colour", "red");
  if (entry.solveMode === "findSuitProbability") return `${article(suit)} ${suit}`;
  if (entry.solveMode === "findColourProbability") return `${article(colour)} ${colour} card`;
  if (entry.solveMode === "findFaceCardProbability") return "a face card";
  if (entry.solveMode === "findUnionCardEventProbability") return `${article(rank)} ${rank} or ${article(suit)} ${suit}`;
  if (entry.solveMode === "findComplementCardProbability") return `not ${article(suit)} ${suit}`;
  if (entry.solveMode === "findCardPropertyIntersection") return `the ${rank} of ${suit}s`;
  return `${article(rank)} ${rank}`;
}

function oppositeEvent(eventLabel: string): string {
  const label = eventLabel.trim();
  if (/^a candidate qualifies$/i.test(label)) return "the candidate does not qualify";
  if (/^a train arrives on time$/i.test(label)) return "the train does not arrive on time";
  if (/^a machine passes inspection$/i.test(label)) return "the machine fails the inspection";
  if (/^an? /i.test(label)) return `not ${label}`;
  return "the event does not occur";
}

function directProbabilityStem(p: GeneratedParameters): string {
  const total = num(p, "total"), favourable = num(p, "favourable");
  const scenario = text(p, "scenario", "LOTTERY_TICKETS");
  if (scenario === "DEFECTIVE_BULBS") return `A batch contains ${total} bulbs, of which ${favourable} are defective. One bulb is selected at random. What is the probability that it is defective?`;
  if (scenario === "RED_BALLS") return `A bag contains ${total} balls, of which ${favourable} are red. One ball is drawn at random. What is the probability that it is red?`;
  if (scenario === "MATHEMATICS_BOOKS") return `A shelf contains ${total} books, of which ${favourable} are Mathematics books. One book is selected at random. What is the probability that it is a Mathematics book?`;
  return `A box contains ${total} lottery tickets, of which ${favourable} are prize-winning. One ticket is drawn at random. What is the probability that it is prize-winning?`;
}

function reverseFavourableStem(p: GeneratedParameters): string {
  const total = num(p, "total");
  const probability = frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1));
  const context = text(p, "context", "winning tickets");
  if (/winning tickets?/i.test(context)) return `A box contains ${total} lottery tickets. The probability of drawing a prize-winning ticket is ${probability}. How many prize-winning tickets are in the box?`;
  if (/defective bulbs?/i.test(context)) return `A batch contains ${total} bulbs. If one bulb is selected at random, the probability that it is defective is ${probability}. How many bulbs are defective?`;
  if (/qualified candidates?/i.test(context)) return `One candidate is selected at random from ${total} candidates. The probability that the candidate has qualified is ${probability}. How many candidates have qualified?`;
  if (/female employees?/i.test(context)) return `A company has ${total} employees. If one employee is selected at random, the probability that the employee is a woman is ${probability}. How many women work in the company?`;
  return `A group has ${total} people. The probability that a randomly selected person satisfies the stated condition is ${probability}. How many people satisfy it?`;
}
function reverseTotalStem(p: GeneratedParameters): string {
  const favourable = num(p, "favourable");
  const probability = frac(num(p, "probabilityNumerator"), num(p, "probabilityDenominator", 1));
  const context = text(p, "context", "winning tickets");
  if (/winning tickets?/i.test(context)) return `A box contains ${favourable} prize-winning lottery tickets. If the probability of drawing a prize-winning ticket is ${probability}, how many lottery tickets are in the box altogether?`;
  if (/red balls?/i.test(context)) return `A bag contains ${favourable} red balls. If a ball drawn at random is red with probability ${probability}, how many balls are in the bag?`;
  if (/approved loan applications?/i.test(context)) return `A bank approved ${favourable} loan applications. If a randomly selected application was approved with probability ${probability}, how many loan applications were received?`;
  if (/successful candidates?/i.test(context)) return `${favourable} candidates passed an examination. If a randomly selected candidate passed with probability ${probability}, how many candidates appeared in the examination?`;
  return `${favourable} people satisfy a condition. If a randomly selected person satisfies it with probability ${probability}, how many people are in the group?`;
}
function committeeStem(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters, solved: SolvedProbability): string {
  const men = num(p, "men"), women = num(p, "women"), size = num(p, "committeeSize"), required = num(p, "requiredWomen", 1);
  if (entry.solveMode === "findRestrictedSelectionProbability") return `A ${size}-member committee is chosen at random from ${men} men and ${women} women. What is the probability that the committee includes at least one woman?`;
  if (entry.solveMode === "findReverseCountFromProbability") return `A ${size}-member committee is chosen from ${men} men and ${women} women. The probability that it contains exactly ${required} ${noun(required, "woman", "women")} is ${frac(solved.evidence.favourableOutcomeCount ?? 0n, solved.evidence.totalOutcomeCount ?? 1n)}. How many such committees can be formed?`;
  return `A ${size}-member committee is chosen at random from ${men} men and ${women} women. What is the probability that it contains exactly ${required} ${noun(required, "woman", "women")}?`;
}

function eventGroupStem(mode: string, p: GeneratedParameters): string {
  const total = num(p, "total"), maths = num(p, "aCount"), english = num(p, "bCount"), both = num(p, "overlap");
  if (mode === "findUnionProbability") return `In a group of ${total} students, ${maths} passed Mathematics, ${english} passed English and ${both} passed both subjects. What is the probability that a randomly selected student passed at least one subject?`;
  if (mode === "findIntersectionProbability") return `In a group of ${total} students, ${both} passed both Mathematics and English. What is the probability that a randomly selected student passed both subjects?`;
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) return `In a group of ${total} students, ${maths} passed Mathematics, ${english} passed English and ${both} passed both. What is the probability that a randomly selected student passed exactly one subject?`;
  if (mode === "findNeitherEventProbability") return `In a group of ${total} students, ${maths} passed Mathematics, ${english} passed English and ${both} passed both. What is the probability that a randomly selected student passed neither subject?`;
  const union = maths + english - both;
  return `For a group of ${total} students, P(Mathematics) = ${frac(maths, total)}, P(English) = ${frac(english, total)} and P(Mathematics or English) = ${frac(union, total)}. Find P(Mathematics and English).`;
}

export function renderStudentFacingStem(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters, solved: SolvedProbability, event: EventExpression, legacyStem: string): string {
  const mode = entry.solveMode;
  const red = num(p, "red"), blue = num(p, "blue"), draw = num(p, "draw", 1);
  const trials = num(p, "trials", num(p, "tosses"));

  if (entry.cpId === "PRB-CP-008" && ["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) return tidy(committeeStem(entry, p, solved));

  switch (mode) {
    case "findDirectProbability":
      return tidy(directProbabilityStem(p));
    case "findFavourableOutcomeCount":
    case "findMissingEventCountFromProbability":
      return tidy(reverseFavourableStem(p));
    case "findTotalOutcomeCount":
      return tidy(reverseTotalStem(p));
    case "identifyImpossibleCertainOrPossibleEvent":
      return tidy(`An integer is selected at random from 1 to ${num(p, "n")}. What is the probability that it is ${text(p, "eventLabel", eventName(event))}?`);
    case "findProbabilityFromSimpleFrequencyTable":
      return tidy(`A bag contains ${red} red, ${blue} blue and ${num(p, "green")} green balls. One ball is drawn at random. What is the probability of drawing a ${text(p, "target", "red")} ball?`);
    case "findComplementProbability": {
      const label = text(p, "eventLabel", "the event occurs");
      return tidy(`The probability that ${label} is ${frac(num(p, "givenNumerator"), num(p, "givenDenominator", 1))}. What is the probability that ${oppositeEvent(label)}?`);
    }
    case "findAtLeastOneUsingComplement": return `A fair coin is tossed ${trials} times. What is the probability of getting at least one head?`;
    case "findNoneProbability": return `A fair coin is tossed ${trials} times. What is the probability of getting no heads?`;
    case "findExactlyOneSuccess": return `A fair coin is tossed ${trials} times. What is the probability of getting exactly one head?`;
    case "findExactlyKSuccessSmallCase": { const k = num(p, "k"), count = k === 1 ? "one" : String(k); return `A fair coin is tossed ${trials} times. What is the probability of getting exactly ${count} ${noun(k, "head")}?`; }
    case "findAtMostKSuccessSmallCase": { const k = num(p, "k"), count = k === 1 ? "one" : String(k); return `A fair coin is tossed ${trials} times. What is the probability of getting at most ${count} ${noun(k, "head")}?`; }
    case "findAllSuccessOrNotAll": return `A fair coin is tossed ${trials} times. What is the probability that all tosses show the same face?`;
    case "findCoinPatternProbability": return `A fair coin is tossed ${num(p, "tosses")} times. What is the probability of obtaining the sequence ${text(p, "pattern")}?`;
    case "findCoinHeadCountProbability": { const heads = num(p, "heads"), count = heads === 1 ? "one" : String(heads); return `A fair coin is tossed ${num(p, "tosses")} times. What is the probability of getting exactly ${count} ${noun(heads, "head")}?`; }
    case "findSingleDieEventProbability": return `A fair die is rolled once. What is the probability of rolling a number that is ${propertyPhrase(p)}?`;
    case "findTwoDiceSumProbability": return `Two fair dice are rolled. What is the probability that the sum of the numbers obtained is ${num(p, "targetSum")}?`;
    case "findTwoDiceProductOrParityProbability": {
      const kind = text(p, "eventType");
      if (kind === "PRODUCT") return `Two fair dice are rolled. What is the probability that the product of the numbers obtained is ${num(p, "targetProduct")}?`;
      return kind === "SAME_PARITY" ? "Two fair dice are rolled. What is the probability that both numbers are even or both are odd?" : "Two fair dice are rolled. What is the probability that one number is odd and the other is even?";
    }
    case "findSpinnerEventProbability": return `A spinner has ${num(p, "sectors")} equal sectors, of which ${num(p, "favourableSectors")} are shaded. If it is spun once, what is the probability that it stops on a shaded sector?`;
    case "findReverseDiceOrSpinnerEventCount": return `A spinner has ${num(p, "sectors")} equal sectors. The probability that it stops on a marked sector is ${frac(num(p, "favourableSectors"), num(p, "sectors", 1))}. How many sectors are marked?`;
    case "findNumberRangePropertyProbability": return `An integer is selected at random from ${num(p, "lower", 1)} to ${num(p, "upper")}. What is the probability that it is ${propertyPhrase(p)}?`;
    case "findRankProbability":
    case "findSuitProbability":
    case "findColourProbability":
    case "findFaceCardProbability":
    case "findUnionCardEventProbability":
    case "findComplementCardProbability":
    case "findCardPropertyIntersection": return `One card is drawn at random from a standard deck of 52 cards. What is the probability of drawing ${cardCondition(entry, p)}?`;
    case "findMissingDeckCountOrEventCount": return `In a standard deck, the probability of drawing ${cardCondition(entry, p)} is ${frac(solved.evidence.favourableOutcomeCount ?? 0n, 52n)}. How many cards satisfy this condition?`;
    case "findSingleDrawColourProbability": return `A bag contains ${red} red and ${blue} blue balls. One ball is drawn at random. What is the probability that it is red?`;
    case "findMissingObjectCountFromProbability": return `A bag contains ${red + blue} balls. The probability of drawing a red ball is ${frac(red, red + blue)}. How many red balls are in the bag?`;
    case "findSimultaneousSameTypeProbability": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that all the drawn balls are of the same colour?`;
    case "findSimultaneousDifferentTypeProbability": return draw === 2
      ? `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn together without replacement. What is the probability of drawing one red and one blue ball?`
      : `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that at least one ball of each colour is drawn?`;
    case "findExactCompositionProbability":
    case "findSelectionProbabilityUsingCombination": { const exact = num(p, "exactRed", 1), count = exact === 1 ? "one" : String(exact); return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that exactly ${count} of the drawn ${noun(draw, "ball")} ${exact === 1 ? "is" : "are"} red?`; }
    case "findNoObjectOfTypeProbability": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that all the drawn balls are blue?`;
    case "findAtLeastOneObjectOfType": return `A bag contains ${red} red and ${blue} blue balls. ${draw} balls are drawn together without replacement. What is the probability that at least one red ball is drawn?`;
    case "findSuccessiveIndependentProbability":
    case "findWithReplacementProbability": return `A bag contains ${red} red and ${blue} blue balls. One ball is drawn and replaced before a second ball is drawn. What is the probability that both balls are red?`;
    case "findSuccessiveDependentProbability":
    case "findWithoutReplacementProbability": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn successively without replacement. What is the probability that both balls are red?`;
    case "findOrderedDrawSequenceProbability": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn successively without replacement. What is the probability of drawing a red ball followed by a blue ball?`;
    case "findSameTypeInSuccessiveDraws": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn successively without replacement. What is the probability that both balls have the same colour?`;
    case "findDifferentTypesInSuccessiveDraws": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn successively without replacement. What is the probability that the two balls have different colours?`;
    case "findAtLeastOneAcrossIndependentStages": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn with replacement. What is the probability of drawing at least one red ball?`;
    case "findConditionalProbabilityByCounting":
    case "findConditionalFromTwoWayTable": return `Of the ${num(p, "mathTotal")} students who passed Mathematics, ${num(p, "both")} also passed English. One of the Mathematics-pass students is selected at random. What is the probability that the selected student also passed English?`;
    case "findConditionalCardProbability": return "A card is drawn from a standard deck and is known to be a face card. What is the probability that it is a king?";
    case "findConditionalNumberProbability": return `An integer selected from 1 to ${num(p, "upper")} is known to be divisible by ${num(p, "conditionDivisor")}. What is the probability that it is also divisible by ${num(p, "targetDivisor")}?`;
    case "findConditionalUrnProbability": return `A bag contains ${red} red and ${blue} blue balls. Two balls are drawn without replacement. Given that the first ball is red, what is the probability that the second ball is also red?`;
    case "findReverseConditionalCount": return `Among ${num(p, "restrictedTotal")} shortlisted candidates, the probability that a randomly selected candidate is ${text(p, "targetLabel", "certified")} is ${frac(num(p, "favourable"), num(p, "restrictedTotal", 1))}. How many candidates are ${text(p, "targetLabel", "certified")}?`;
    case "findRandomArrangementPropertyProbability": return `${num(p, "people")} people stand in a random order. What is the probability that a particular person is first?`;
    case "findTogetherOrApartProbability": return `${num(p, "people")} people stand in a random order. What is the probability that two particular people are ${text(p, "relation", "TOGETHER") === "APART" ? "not next to each other" : "next to each other"}?`;
    case "findPositionRestrictionProbability": return `${num(p, "positions")} distinct posts are assigned at random among ${num(p, "men")} men and ${num(p, "women")} women. What is the probability that the first post is assigned to a woman?`;
    case "findNumberFormationProbability": return `A ${num(p, "length")}-digit number is formed without repetition using the digits ${num(p, "minDigit", 1)} to ${num(p, "maxDigit")}. What is the probability that the number is even?`;
    case "findUnionProbability":
    case "findIntersectionProbability":
    case "findExactlyOneOfTwoEvents":
    case "findMixedEventExpressionProbability":
    case "findNeitherEventProbability":
    case "findMissingIntersectionOrUnionProbability": return eventGroupStem(mode, p);
    case "findMutuallyExclusiveUnion": return `A candidate may receive Award A or Award B, but cannot receive both. If P(A) = ${frac(num(p, "aNumerator"), num(p, "aDenominator", 1))} and P(B) = ${frac(num(p, "bNumerator"), num(p, "bDenominator", 1))}, what is the probability of receiving either award?`;
    case "findIndependentIntersection": return `The probabilities that a candidate clears Section A and Section B are ${frac(num(p, "aNumerator"), num(p, "aDenominator", 1))} and ${frac(num(p, "bNumerator"), num(p, "bDenominator", 1))}, respectively. The results are independent. What is the probability that the candidate clears both sections?`;
  }

  return tidy(legacyStem.replace(/^In this [^,]+,?\s*/i, "").replace(/\b[A-Z]+(?:_[A-Z]+)+\b/g, clean).replace(/,?\s*using [^,.?]+ when applicable/gi, ""));
}
