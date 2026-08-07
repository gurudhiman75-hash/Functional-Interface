import type { GeneratedParameters, ProbabilityQuestionLanguageEntry, ProbabilityTaskRegistryEntry, ProbabilityVisual, SolvedProbability, VerificationResult } from "./types";
import { rational, rationalText } from "./rational";

function wordCount(lines: string[]): number {
  return lines.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function n(parameters: GeneratedParameters, key: string, fallback = 0): number {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
}

function s(parameters: GeneratedParameters, key: string, fallback = ""): string {
  const value = parameters[key];
  return typeof value === "string" ? value : fallback;
}

function fraction(numerator: number | bigint, denominator: number | bigint): string {
  return rationalText(rational(numerator, denominator));
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return count === 1 ? singular : pluralForm;
}

function choose(total: number, selected: number): number {
  if (selected < 0 || selected > total) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(selected, total - selected); i += 1) {
    result = (result * (total - i + 1)) / i;
  }
  return Math.round(result);
}

function factorial(value: number): number {
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

function coinSequences(tosses: number): string[] {
  let sequences = [""];
  for (let toss = 0; toss < tosses; toss += 1) sequences = sequences.flatMap((prefix) => [`${prefix}H`, `${prefix}T`]);
  return sequences;
}

function headCount(sequence: string): number {
  return [...sequence].filter((face) => face === "H").length;
}

function sequenceList(sequences: string[]): string {
  return sequences.join(", ");
}

function integerRangeMatches(parameters: GeneratedParameters): number[] {
  const lower = n(parameters, "lower", 1), upper = n(parameters, "upper");
  const property = s(parameters, "property");
  const divisor = n(parameters, "divisor", 1);
  const isPrime = (value: number) => value > 1 && Array.from({ length: Math.max(0, Math.floor(Math.sqrt(value)) - 1) }, (_, index) => index + 2).every((factor) => value % factor !== 0);
  return Array.from({ length: upper - lower + 1 }, (_, index) => lower + index).filter((value) => {
    if (property === "DIVISIBLE") return value % divisor === 0;
    if (property === "EVEN") return value % 2 === 0;
    if (property === "PRIME") return isPrime(value);
    if (property === "COMPOSITE") return value > 1 && !isPrime(value);
    if (property === "GREATER_THAN") return value > n(parameters, "threshold");
    if (property === "LESS_THAN") return value < n(parameters, "threshold");
    return false;
  });
}

function probabilityCalculation(favourable: number | bigint, total: number | bigint, answer: string): string {
  const raw = `${favourable}/${total}`;
  return raw === answer ? `So the probability is ${answer}.` : `So the probability is ${raw} = ${answer}.`;
}

function contextNoun(context: string): string {
  if (/tickets?/i.test(context)) return "tickets";
  if (/bulbs?/i.test(context)) return "bulbs";
  if (/candidates?/i.test(context)) return "candidates";
  if (/employees?/i.test(context)) return "employees";
  if (/applications?/i.test(context)) return "applications";
  if (/balls?/i.test(context)) return "balls";
  return "people";
}

function contextDescription(context: string): string {
  if (/winning|prize-winning/i.test(context)) return "prize-winning";
  if (/defective/i.test(context)) return "defective";
  if (/qualified/i.test(context)) return "qualified";
  if (/female/i.test(context)) return "female";
  if (/red/i.test(context)) return "red";
  if (/approved/i.test(context)) return "approved";
  if (/successful/i.test(context)) return "successful";
  return context.trim();
}
function colourCount(parameters: GeneratedParameters, colour: string): number {
  return n(parameters, colour.toLowerCase());
}

function singleDieFaces(parameters: GeneratedParameters): number[] {
  const property = s(parameters, "property");
  const threshold = n(parameters, "threshold");
  return [1, 2, 3, 4, 5, 6].filter((face) => {
    if (property === "EVEN") return face % 2 === 0;
    if (property === "PRIME") return [2, 3, 5].includes(face);
    if (property === "COMPOSITE") return [4, 6].includes(face);
    if (property === "GREATER_THAN") return face > threshold;
    if (property === "LESS_THAN") return face < threshold;
    if (property === "DIVISIBLE") return face % n(parameters, "divisor", 1) === 0;
    return false;
  });
}

function dicePairsForSum(target: number): string {
  const pairs: string[] = [];
  for (let first = 1; first <= 6; first += 1) {
    const second = target - first;
    if (second >= 1 && second <= 6) pairs.push(`(${first},${second})`);
  }
  return pairs.join(", ");
}

function diceProductPairs(target: number): string[] {
  const pairs: string[] = [];
  for (let first = 1; first <= 6; first += 1) {
    for (let second = 1; second <= 6; second += 1) {
      if (first * second === target) pairs.push(`(${first},${second})`);
    }
  }
  return pairs;
}

function suitSingular(suit: string): string {
  return suit.replace(/s$/i, "");
}

function renderDirectExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const total = n(parameters, "total"), favourable = n(parameters, "favourable");
  const scenario = s(parameters, "scenario", "LOTTERY_TICKETS");
  let reason = `There are ${total} lottery tickets in all, and ${favourable} are prize-winning.`;
  if (scenario === "DEFECTIVE_BULBS") reason = `The batch has ${total} bulbs, of which ${favourable} are defective.`;
  if (scenario === "RED_BALLS") reason = `The bag has ${total} balls, of which ${favourable} are red.`;
  if (scenario === "MATHEMATICS_BOOKS") reason = `The shelf has ${total} books, of which ${favourable} are Mathematics books.`;
  return [reason, probabilityCalculation(favourable, total, solved.exactDisplay)];
}
function renderReverseFavourable(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const total = n(parameters, "total");
  const probability = fraction(n(parameters, "probabilityNumerator"), n(parameters, "probabilityDenominator", 1));
  const context = s(parameters, "context", "required items");
  const itemNoun = contextNoun(context);
  const description = contextDescription(context);
  return [
    `${description[0]?.toUpperCase()}${description.slice(1)} ${itemNoun} make up ${probability} of all ${total} ${itemNoun}.`,
    `Required number = ${total} × ${probability} = ${solved.exactDisplay}.`,
  ];
}

function renderReverseTotal(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const favourable = n(parameters, "favourable");
  const probability = fraction(n(parameters, "probabilityNumerator"), n(parameters, "probabilityDenominator", 1));
  const context = s(parameters, "context", "required items");
  const itemNoun = contextNoun(context);
  const description = contextDescription(context);
  return [
    `${favourable} ${description} ${itemNoun} represent ${probability} of the full group.`,
    `Total ${itemNoun} = ${favourable} ÷ ${probability} = ${solved.exactDisplay}.`,
  ];
}

function renderCertainPossibleExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const total = n(parameters, "n");
  const state = s(parameters, "state");
  const favourable = n(parameters, "favourable");
  if (state === "CERTAIN") {
    return [`Every integer from 1 to ${total} satisfies the condition.`, probabilityCalculation(total, total, solved.exactDisplay)];
  }
  if (state === "IMPOSSIBLE") {
    return [`No integer from 1 to ${total} satisfies the condition.`, `So the probability is 0/${total} = ${solved.exactDisplay}.`];
  }
  return [`The required integers are the ${favourable} even numbers in the range.`, probabilityCalculation(favourable, total, solved.exactDisplay)];
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

  if (mode === "findDirectProbability") return renderDirectExplanation(parameters, solved);
  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability"].includes(mode)) return renderReverseFavourable(parameters, solved);
  if (mode === "findTotalOutcomeCount") return renderReverseTotal(parameters, solved);
  if (mode === "identifyImpossibleCertainOrPossibleEvent") return renderCertainPossibleExplanation(parameters, solved);

  if (mode === "findProbabilityFromSimpleFrequencyTable") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), green = n(parameters, "green");
    const target = s(parameters, "target", "red");
    const targetCount = colourCount(parameters, target);
    const all = red + blue + green;
    return [
      `The bag has ${all} balls altogether. ${targetCount} of them are ${target}.`,
      probabilityCalculation(targetCount, all, solved.exactDisplay),
    ];
  }

  if (mode === "findComplementProbability") {
    const given = fraction(n(parameters, "givenNumerator"), n(parameters, "givenDenominator", 1));
    return [
      `An event and its opposite have total probability 1.`,
      `Required probability = 1 - ${given} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findAtLeastOneUsingComplement") {
    const trials = n(parameters, "trials");
    const allTails = "T".repeat(trials);
    const noHeads = fraction(1, 2 ** trials);
    return [
      `The only sequence with no head is ${allTails}.`,
      `So P(at least one head) = 1 - P(${allTails}) = 1 - ${noHeads} = ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findNoneProbability") {
    const trials = n(parameters, "trials");
    return [
      `No heads means every toss must be a tail. Only T${"T".repeat(Math.max(0, trials - 1))} works.`,
      `Out of ${2 ** trials} sequences, 1 works. So the probability is ${solved.exactDisplay}.`,
    ];
  }

  if (["findExactlyOneSuccess", "findExactlyKSuccessSmallCase", "findCoinHeadCountProbability"].includes(mode)) {
    const tosses = n(parameters, "trials", n(parameters, "tosses"));
    const heads = mode === "findExactlyOneSuccess" ? 1 : n(parameters, mode === "findCoinHeadCountProbability" ? "heads" : "k", 1);
    const matches = coinSequences(tosses).filter((sequence) => headCount(sequence) === heads);
    return [
      `For exactly ${heads === 1 ? "one head" : `${heads} heads`}, the favourable sequences are ${sequenceList(matches)}.`,
      `${matches.length} of the ${2 ** tosses} H/T sequences work. ${probabilityCalculation(matches.length, 2 ** tosses, solved.exactDisplay)}`,
    ];
  }
  if (mode === "findAtMostKSuccessSmallCase") {
    const tosses = n(parameters, "trials"), k = n(parameters, "k");
    const allSequences = coinSequences(tosses);
    const matches = allSequences.filter((sequence) => headCount(sequence) <= k);
    const excluded = allSequences.filter((sequence) => headCount(sequence) > k);
    const detail = matches.length <= 16
      ? `The favourable sequences are ${sequenceList(matches)}.`
      : `It is shorter to exclude ${sequenceList(excluded)}; every other sequence has at most ${k} heads.`;
    return [detail, `${matches.length} of the ${allSequences.length} H/T sequences work. ${probabilityCalculation(matches.length, allSequences.length, solved.exactDisplay)}`];
  }
  if (mode === "findAllSuccessOrNotAll") {
    const tosses = n(parameters, "trials");
    const allHeads = "H".repeat(tosses), allTails = "T".repeat(tosses);
    return [
      `All tosses show the same face only in ${allHeads} and ${allTails}.`,
      probabilityCalculation(2, 2 ** tosses, solved.exactDisplay),
    ];
  }
  if (mode === "findCoinPatternProbability") {
    const tosses = n(parameters, "tosses"), pattern = s(parameters, "pattern");
    const outcomes = coinSequences(tosses);
    const universe = outcomes.length <= 8
      ? `The possible sequences are ${sequenceList(outcomes)}.`
      : `There are 2^${tosses} = ${outcomes.length} possible H/T sequences.`;
    return [universe, `${pattern} is one of these sequences. ${probabilityCalculation(1, outcomes.length, solved.exactDisplay)}`];
  }
  if (mode === "findSingleDieEventProbability") {
    const faces = singleDieFaces(parameters);
    return [
      `The favourable faces are ${faces.join(", ")}; there are ${faces.length}.`,
      probabilityCalculation(faces.length, 6, solved.exactDisplay),
    ];
  }

  if (mode === "findTwoDiceSumProbability") {
    const target = n(parameters, "targetSum");
    const pairs = dicePairsForSum(target);
    return [
      `Two dice have 6 × 6 = 36 ordered outcomes. The pairs with sum ${target} are ${pairs}.`,
      probabilityCalculation(favourable ?? 0n, 36, solved.exactDisplay),
    ];
  }

  if (mode === "findTwoDiceProductOrParityProbability") {
    const kind = s(parameters, "eventType");
    if (kind === "PRODUCT") {
      const target = n(parameters, "targetProduct");
      const pairs = diceProductPairs(target);
      return [
        `Two dice have 36 ordered outcomes. Product ${target} occurs for ${pairs.join(", ")}.`,
        probabilityCalculation(pairs.length, 36, solved.exactDisplay),
      ];
    }
    if (kind === "SAME_PARITY") {
      return [
        `Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Same parity means odd-odd or even-even.`,
        `Required ordered pairs = 3 × 3 + 3 × 3 = 18. ${probabilityCalculation(18, 36, solved.exactDisplay)}`,
      ];
    }
    return [
      `Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Different parity means odd-even or even-odd.`,
      `Required ordered pairs = 3 × 3 + 3 × 3 = 18. ${probabilityCalculation(18, 36, solved.exactDisplay)}`,
    ];
  }
  if (mode === "findSpinnerEventProbability") {
    const sectors = n(parameters, "sectors"), marked = n(parameters, "favourableSectors");
    return [`${marked} of the ${sectors} equal sectors are shaded.`, probabilityCalculation(marked, sectors, solved.exactDisplay)];
  }

  if (mode === "findReverseDiceOrSpinnerEventCount") {
    const sectors = n(parameters, "sectors");
    const probability = fraction(n(parameters, "favourableSectors"), sectors);
    return [
      `The marked part is ${probability} of all ${sectors} sectors.`,
      `Marked sectors = ${sectors} × ${probability} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findNumberRangePropertyProbability") {
    const lower = n(parameters, "lower", 1), upper = n(parameters, "upper");
    const matches = integerRangeMatches(parameters);
    const rangeSize = upper - lower + 1;
    const shown = matches.length <= 15
      ? `The required integers are ${matches.join(", ")}.`
      : `The first required integers are ${matches.slice(0, 10).join(", ")}; there are ${matches.length} in all.`;
    return [shown, probabilityCalculation(matches.length, rangeSize, solved.exactDisplay)];
  }
  if (["findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability", "findCardPropertyIntersection"].includes(mode)) {
    const rank = s(parameters, "rank", "king");
    const suit = suitSingular(s(parameters, "suit", "spades"));
    const colour = s(parameters, "colour", "red");
    let reason = `There are ${favourable ?? 0n} required cards in a 52-card deck.`;
    if (mode === "findRankProbability") reason = `There are 4 ${rank}s, one in each suit.`;
    if (mode === "findSuitProbability") reason = `There are 13 ${suit}s in a standard deck.`;
    if (mode === "findColourProbability") reason = `The deck has 26 ${colour} cards.`;
    if (mode === "findFaceCardProbability") reason = `Each suit has a jack, queen and king, so there are 3 × 4 = 12 face cards.`;
    if (mode === "findCardPropertyIntersection") reason = `Only one card is both the ${rank} and a ${suit}: the ${rank} of ${suit}s.`;
    return [reason, probabilityCalculation(favourable ?? 0n, 52, solved.exactDisplay)];
  }

  if (mode === "findUnionCardEventProbability") {
    const rank = s(parameters, "rank", "king");
    const suit = suitSingular(s(parameters, "suit", "spades"));
    return [
      `There are 4 ${rank}s and 13 ${suit}s. The ${rank} of ${suit}s is counted twice, so subtract 1.`,
      `Required cards = 4 + 13 - 1 = ${favourable ?? 16n}. ${probabilityCalculation(favourable ?? 16n, 52, solved.exactDisplay)}`,
    ];
  }

  if (mode === "findComplementCardProbability") {
    const suit = suitSingular(s(parameters, "suit", "spades"));
    return [
      `A deck has 13 ${suit}s, so cards that are not ${suit}s = 52 - 13 = 39.`,
      probabilityCalculation(39, 52, solved.exactDisplay),
    ];
  }

  if (mode === "findMissingDeckCountOrEventCount") {
    const probability = fraction(solved.evidence.favourableOutcomeCount ?? 0n, 52n);
    return [
      `The required cards form ${probability} of the 52-card deck.`,
      `Required cards = 52 × ${probability} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findSingleDrawColourProbability") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), all = red + blue;
    return [`The bag has ${all} balls, of which ${red} are red.`, probabilityCalculation(red, all, solved.exactDisplay)];
  }

  if (mode === "findMissingObjectCountFromProbability") {
    const all = n(parameters, "red") + n(parameters, "blue");
    const probability = fraction(n(parameters, "red"), all);
    return [`Red balls form ${probability} of all ${all} balls.`, `Red balls = ${all} × ${probability} = ${solved.exactDisplay}.`];
  }

  if (["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findSelectionProbabilityUsingCombination"].includes(mode) && entry.cpId === "PRB-CP-005") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), draw = n(parameters, "draw"), all = red + blue;
    const totalSelections = choose(all, draw);
    const totalReason = `Total selections = C(${all},${draw}) = ${totalSelections}.`;
    let requiredReason = `The stated condition is met by ${favourable ?? 0n} selections.`;
    if (mode === "findSimultaneousSameTypeProbability") {
      requiredReason = `All one colour: C(${red},${draw}) + C(${blue},${draw}) = ${favourable ?? 0n}.`;
    } else if (mode === "findSimultaneousDifferentTypeProbability") {
      requiredReason = `Use all selections minus all-red and all-blue selections: ${totalSelections} - C(${red},${draw}) - C(${blue},${draw}) = ${favourable ?? 0n}.`;
    } else if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
      const exactRed = n(parameters, "exactRed", 1);
      requiredReason = `Choose ${exactRed} red and ${draw - exactRed} blue: C(${red},${exactRed}) × C(${blue},${draw - exactRed}) = ${favourable ?? 0n}.`;
    } else if (mode === "findNoObjectOfTypeProbability") {
      requiredReason = `No red means all ${draw} balls are blue: C(${blue},${draw}) = ${favourable ?? 0n}.`;
    } else if (mode === "findAtLeastOneObjectOfType") {
      requiredReason = `Subtract the all-blue selections: ${totalSelections} - C(${blue},${draw}) = ${favourable ?? 0n}.`;
    }
    return [totalReason, requiredReason, probabilityCalculation(favourable ?? 0n, total ?? BigInt(totalSelections), solved.exactDisplay)];
  }

  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    const red = n(parameters, "red"), all = red + n(parameters, "blue");
    return [
      `Because the first ball is replaced, the chance of red stays ${red}/${all} on both draws.`,
      `P(both red) = ${red}/${all} × ${red}/${all} = ${solved.exactDisplay}.`,
    ];
  }

  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    const red = n(parameters, "red"), all = red + n(parameters, "blue");
    return [
      `After drawing one red ball, ${red - 1} red balls remain among ${all - 1} balls.`,
      `P(both red) = ${red}/${all} × ${red - 1}/${all - 1} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findOrderedDrawSequenceProbability") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), all = red + blue;
    return [
      `The first draw must be red; then ${blue} blue balls remain among ${all - 1} balls.`,
      `P(red then blue) = ${red}/${all} × ${blue}/${all - 1} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findSameTypeInSuccessiveDraws") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), all = red + blue;
    return [
      `Same colour means red-red or blue-blue.`,
      `P = ${red}/${all} × ${red - 1}/${all - 1} + ${blue}/${all} × ${blue - 1}/${all - 1} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findDifferentTypesInSuccessiveDraws") {
    const red = n(parameters, "red"), blue = n(parameters, "blue"), all = red + blue;
    return [
      `Different colours means red-blue or blue-red.`,
      `P = ${red}/${all} × ${blue}/${all - 1} + ${blue}/${all} × ${red}/${all - 1} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findAtLeastOneAcrossIndependentStages") {
    const blue = n(parameters, "blue"), all = n(parameters, "red") + blue;
    return [
      `The only unwanted case is blue on both draws. Replacement keeps the chance of blue at ${blue}/${all}.`,
      `P(at least one red) = 1 - (${blue}/${all} × ${blue}/${all}) = ${solved.exactDisplay}.`,
    ];
  }

  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable"].includes(mode)) {
    const mathTotal = n(parameters, "mathTotal"), both = n(parameters, "both");
    return [
      `The student is chosen only from the ${mathTotal} students who passed Mathematics.`,
      `${both} of them also passed English. ${probabilityCalculation(both, mathTotal, solved.exactDisplay)}`,
    ];
  }

  if (mode === "findConditionalCardProbability") {
    return [
      `The condition limits the deck to the 12 face cards. Four of these are kings.`,
      probabilityCalculation(4, 12, solved.exactDisplay),
    ];
  }

  if (mode === "findConditionalNumberProbability") {
    const upper = n(parameters, "upper"), conditionDivisor = n(parameters, "conditionDivisor"), targetDivisor = n(parameters, "targetDivisor");
    const restricted = Array.from({ length: Math.floor(upper / conditionDivisor) }, (_, index) => (index + 1) * conditionDivisor);
    const required = restricted.filter((value) => value % targetDivisor === 0);
    return [
      `The restricted numbers are ${restricted.join(", ")}.`,
      `Among them, ${required.join(", ")} are divisible by ${targetDivisor}. ${probabilityCalculation(required.length, restricted.length, solved.exactDisplay)}`,
    ];
  }
  if (mode === "findConditionalUrnProbability") {
    const red = n(parameters, "red"), all = red + n(parameters, "blue");
    return [
      `The first ball was red, so ${red - 1} red balls remain among ${all - 1} balls.`,
      probabilityCalculation(red - 1, all - 1, solved.exactDisplay),
    ];
  }

  if (mode === "findReverseConditionalCount") {
    const restrictedTotal = n(parameters, "restrictedTotal");
    const probability = fraction(n(parameters, "favourable"), restrictedTotal);
    return [
      `Certified candidates form ${probability} of the ${restrictedTotal} shortlisted candidates.`,
      `Certified candidates = ${restrictedTotal} × ${probability} = ${solved.exactDisplay}.`,
    ];
  }

  if (["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) {
    const men = n(parameters, "men"), women = n(parameters, "women"), size = n(parameters, "committeeSize"), requiredWomen = n(parameters, "requiredWomen", 1);
    const allPeople = men + women;
    const totalCommittees = choose(allPeople, size);
    if (mode === "findRestrictedSelectionProbability") {
      const allMen = choose(men, size);
      return [
        `Total committees = C(${allPeople},${size}) = ${totalCommittees}. Committees with no woman = C(${men},${size}) = ${allMen}.`,
        `Committees with at least one woman = ${totalCommittees} - ${allMen} = ${favourable ?? 0n}. ${probabilityCalculation(favourable ?? 0n, total ?? BigInt(totalCommittees), solved.exactDisplay)}`,
      ];
    }
    const requiredCommittees = choose(women, requiredWomen) * choose(men, size - requiredWomen);
    if (mode === "findReverseCountFromProbability") {
      return [
        `Choose ${requiredWomen} ${plural(requiredWomen, "woman", "women")} and ${size - requiredWomen} ${plural(size - requiredWomen, "man", "men")}.`,
        `Required committees = C(${women},${requiredWomen}) × C(${men},${size - requiredWomen}) = ${solved.exactDisplay}.`,
      ];
    }
    return [
      `Total committees = C(${allPeople},${size}) = ${totalCommittees}.`,
      `Required committees = C(${women},${requiredWomen}) × C(${men},${size - requiredWomen}) = ${requiredCommittees}. ${probabilityCalculation(requiredCommittees, totalCommittees, solved.exactDisplay)}`,
    ];
  }

  if (mode === "findRandomArrangementPropertyProbability") {
    const people = n(parameters, "people");
    return [
      `Each of the ${people} people is equally likely to occupy the first position.`,
      `So the probability for the specified person is 1/${people} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findTogetherOrApartProbability") {
    const people = n(parameters, "people"), relation = s(parameters, "relation", "TOGETHER");
    const totalArrangements = factorial(people);
    const together = 2 * factorial(people - 1);
    if (relation === "APART") {
      return [
        `Total arrangements = ${people}! = ${totalArrangements}. Adjacent arrangements = 2 × ${people - 1}! = ${together}.`,
        `Non-adjacent arrangements = ${totalArrangements} - ${together}. ${probabilityCalculation(totalArrangements - together, totalArrangements, solved.exactDisplay)}`,
      ];
    }
    return [
      `Treat the two specified people as one block; they can swap places in 2 ways.`,
      `Adjacent arrangements = 2 × ${people - 1}! = ${together}, out of ${people}! = ${totalArrangements}. Probability = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findPositionRestrictionProbability") {
    const men = n(parameters, "men"), women = n(parameters, "women"), all = men + women;
    return [
      `Any one of the ${all} people can receive the first post, and ${women} of them are women.`,
      probabilityCalculation(women, all, solved.exactDisplay),
    ];
  }

  if (mode === "findNumberFormationProbability") {
    const minDigit = n(parameters, "minDigit", 1), maxDigit = n(parameters, "maxDigit"), length = n(parameters, "length");
    const digits = maxDigit - minDigit + 1;
    const evenDigits = Array.from({ length: digits }, (_, index) => minDigit + index).filter((digit) => digit % 2 === 0).length;
    const totalNumbers = Array.from({ length }, (_, index) => digits - index).reduce((product, value) => product * value, 1);
    const remainingWays = Array.from({ length: length - 1 }, (_, index) => digits - 1 - index).reduce((product, value) => product * value, 1);
    const evenNumbers = evenDigits * remainingWays;
    return [
      `Total numbers = ${digits}P${length} = ${totalNumbers}. For an even number, the last digit has ${evenDigits} choices.`,
      `The other places can be filled in ${remainingWays} ways, so required numbers = ${evenDigits} × ${remainingWays} = ${evenNumbers}. Probability = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findMutuallyExclusiveUnion") {
    const a = fraction(n(parameters, "aNumerator"), n(parameters, "aDenominator", 1));
    const b = fraction(n(parameters, "bNumerator"), n(parameters, "bDenominator", 1));
    return [
      `The two events cannot occur together, so there is no overlap to subtract.`,
      `P(A or B) = ${a} + ${b} = ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findIndependentIntersection") {
    const a = fraction(n(parameters, "aNumerator"), n(parameters, "aDenominator", 1));
    const b = fraction(n(parameters, "bNumerator"), n(parameters, "bDenominator", 1));
    return [
      `The events are independent, so one result does not change the other.`,
      `P(both) = ${a} × ${b} = ${solved.exactDisplay}.`,
    ];
  }

  if (["findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability", "findMixedEventExpressionProbability"].includes(mode)) {
    const groupTotal = n(parameters, "total"), aCount = n(parameters, "aCount"), bCount = n(parameters, "bCount"), overlap = n(parameters, "overlap");
    const union = aCount + bCount - overlap;
    if (mode === "findUnionProbability") {
      return [
        `Add both groups and subtract the ${overlap} people counted twice: ${aCount} + ${bCount} - ${overlap} = ${union}.`,
        probabilityCalculation(union, groupTotal, solved.exactDisplay),
      ];
    }
    if (mode === "findIntersectionProbability") {
      return [`The overlap contains ${overlap} people out of ${groupTotal}.`, probabilityCalculation(overlap, groupTotal, solved.exactDisplay)];
    }
    if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) {
      const exactlyOne = aCount + bCount - 2 * overlap;
      return [
        `Remove the overlap from both groups: ${aCount} + ${bCount} - 2 × ${overlap} = ${exactlyOne}.`,
        probabilityCalculation(exactlyOne, groupTotal, solved.exactDisplay),
      ];
    }
    if (mode === "findNeitherEventProbability") {
      const neither = groupTotal - union;
      return [
        `At least one event occurs for ${union} people, so neither occurs for ${groupTotal} - ${union} = ${neither}.`,
        probabilityCalculation(neither, groupTotal, solved.exactDisplay),
      ];
    }
    return [
      `Use A + B - both = A or B.`,
      `Both = ${aCount} + ${bCount} - ${union} = ${overlap}. ${probabilityCalculation(overlap, groupTotal, solved.exactDisplay)}`,
    ];
  }

  if (total !== undefined && favourable !== undefined) {
    return [
      `${favourable} of the ${total} possible cases satisfy the stated condition.`,
      probabilityCalculation(favourable, total, solved.exactDisplay),
    ];
  }

  return [`Apply the probability relation given in the question.`, `The required answer is ${solved.exactDisplay}.`];
}

export function explanationWordCount(lines: string[]): number {
  return wordCount(lines);
}
