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

const CP007_CONDITIONAL_COUNTING_LANES: Readonly<Record<string, Readonly<{ mathTotal: number; both: number; englishOnly: number; neither: number }>>> = Object.freeze({
  "PRB-QL-601": { mathTotal: 8, both: 3, englishOnly: 7, neither: 4 },
  "PRB-QL-606": { mathTotal: 17, both: 7, englishOnly: 9, neither: 5 },
  "PRB-QL-607": { mathTotal: 10, both: 4, englishOnly: 8, neither: 3 },
  "PRB-QL-612": { mathTotal: 15, both: 13, englishOnly: 6, neither: 4 },
  "PRB-QL-613": { mathTotal: 15, both: 10, englishOnly: 11, neither: 6 },
  "PRB-QL-618": { mathTotal: 18, both: 8, englishOnly: 10, neither: 7 },
  "PRB-QL-619": { mathTotal: 12, both: 5, englishOnly: 13, neither: 2 },
});

const CP007_CONDITIONAL_NUMBER_LANES: Readonly<Record<string, number>> = Object.freeze({
  "PRB-QL-603": 20,
  "PRB-QL-609": 24,
  "PRB-QL-615": 36,
  "PRB-QL-621": 40,
});

const CP007_CONDITIONAL_URN_LANES: Readonly<Record<string, Readonly<{ red: number; blue: number }>>> = Object.freeze({
  "PRB-QL-604": { red: 7, blue: 8 },
  "PRB-QL-610": { red: 8, blue: 5 },
  "PRB-QL-616": { red: 9, blue: 4 },
  "PRB-QL-622": { red: 10, blue: 7 },
});

const CP007_REVERSE_CONDITIONAL_LANES: Readonly<Record<string, Readonly<{ restrictedTotal: number; favourable: number }>>> = Object.freeze({
  "PRB-QL-605": { restrictedTotal: 24, favourable: 3 },
  "PRB-QL-611": { restrictedTotal: 18, favourable: 6 },
  "PRB-QL-617": { restrictedTotal: 30, favourable: 5 },
});

const CP006_SUCCESSIVE_STATE_LANES: Readonly<Record<string, Readonly<{ red: number; blue: number }>>> = Object.freeze({
  "PRB-QL-501": { red: 4, blue: 5 }, "PRB-QL-509": { red: 6, blue: 7 }, "PRB-QL-517": { red: 8, blue: 9 },
  "PRB-QL-502": { red: 5, blue: 7 }, "PRB-QL-510": { red: 7, blue: 9 }, "PRB-QL-518": { red: 9, blue: 6 },
  "PRB-QL-503": { red: 6, blue: 4 }, "PRB-QL-511": { red: 8, blue: 5 }, "PRB-QL-519": { red: 9, blue: 7 },
  "PRB-QL-504": { red: 5, blue: 6 }, "PRB-QL-512": { red: 7, blue: 5 }, "PRB-QL-520": { red: 8, blue: 7 },
  "PRB-QL-505": { red: 4, blue: 7 }, "PRB-QL-513": { red: 6, blue: 9 }, "PRB-QL-521": { red: 9, blue: 5 },
  "PRB-QL-506": { red: 5, blue: 8 }, "PRB-QL-514": { red: 7, blue: 6 }, "PRB-QL-522": { red: 9, blue: 8 },
  "PRB-QL-507": { red: 4, blue: 8 }, "PRB-QL-515": { red: 6, blue: 5 }, "PRB-QL-523": { red: 8, blue: 6 },
  "PRB-QL-508": { red: 5, blue: 9 }, "PRB-QL-516": { red: 7, blue: 8 }, "PRB-QL-524": { red: 9, blue: 4 },
});

const CP005_URN_STATE_LANES: Readonly<Record<string, Readonly<{ red: number; blue: number; draw: number; exactRed?: number }>>> = Object.freeze({
  "PRB-QL-401": { red: 4, blue: 5, draw: 1 },
  "PRB-QL-402": { red: 5, blue: 7, draw: 2 },
  "PRB-QL-403": { red: 8, blue: 11, draw: 3 },
  "PRB-QL-404": { red: 6, blue: 8, draw: 2, exactRed: 1 },
  "PRB-QL-405": { red: 4, blue: 7, draw: 2 },
  "PRB-QL-406": { red: 9, blue: 10, draw: 3 },
  "PRB-QL-407": { red: 5, blue: 8, draw: 1 },
  "PRB-QL-408": { red: 6, blue: 5, draw: 2, exactRed: 1 },

  "PRB-QL-409": { red: 6, blue: 7, draw: 1 },
  "PRB-QL-410": { red: 10, blue: 7, draw: 3 },
  "PRB-QL-411": { red: 7, blue: 9, draw: 2 },
  "PRB-QL-412": { red: 5, blue: 9, draw: 2, exactRed: 1 },
  "PRB-QL-413": { red: 11, blue: 8, draw: 3 },
  "PRB-QL-414": { red: 8, blue: 6, draw: 2 },
  "PRB-QL-415": { red: 7, blue: 5, draw: 1 },
  "PRB-QL-416": { red: 8, blue: 5, draw: 2, exactRed: 1 },

  "PRB-QL-417": { red: 8, blue: 9, draw: 1 },
  "PRB-QL-418": { red: 9, blue: 6, draw: 2 },
  "PRB-QL-419": { red: 5, blue: 6, draw: 2 },
  "PRB-QL-420": { red: 12, blue: 9, draw: 3, exactRed: 2 },
  "PRB-QL-421": { red: 6, blue: 9, draw: 2 },
  "PRB-QL-422": { red: 9, blue: 5, draw: 2 },
  "PRB-QL-423": { red: 8, blue: 7, draw: 1 },
  "PRB-QL-424": { red: 10, blue: 8, draw: 3, exactRed: 2 },

  "PRB-QL-425": { red: 9, blue: 8, draw: 1 },
  "PRB-QL-426": { red: 7, blue: 10, draw: 2 },
});

const CP004_CARD_STATE_LANES: Readonly<Record<string, Readonly<{ rank: string; suit: string; colour: string }>>> = Object.freeze({
  "PRB-QL-301": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-309": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-317": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-302": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-310": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-318": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-303": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-311": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-319": { rank: "queen", suit: "diamonds", colour: "red" },

  "PRB-QL-304": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-312": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-320": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-305": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-313": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-321": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-306": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-314": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-322": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-307": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-315": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-323": { rank: "queen", suit: "spades", colour: "black" },

  "PRB-QL-308": { rank: "ace", suit: "hearts", colour: "red" },
  "PRB-QL-316": { rank: "king", suit: "clubs", colour: "black" },
  "PRB-QL-324": { rank: "queen", suit: "spades", colour: "black" },
});

const CP003_COIN_PATTERN_STATE_LANES: Readonly<Record<string, Readonly<{ tosses: number; pattern: string }>>> = Object.freeze({
  "PRB-QL-201": { tosses: 2, pattern: "HT" },
  "PRB-QL-209": { tosses: 3, pattern: "HTH" },
  "PRB-QL-217": { tosses: 4, pattern: "HHTT" },
});

const CP003_SINGLE_DIE_STATE_LANES: Readonly<Record<string, Readonly<{ property: string; threshold: number }>>> = Object.freeze({
  "PRB-QL-203": { property: "EVEN", threshold: 2 },
  "PRB-QL-211": { property: "PRIME", threshold: 2 },
  "PRB-QL-219": { property: "GREATER_THAN", threshold: 4 },
});

const CP003_DICE_SUM_STATE_LANES: Readonly<Record<string, number>> = Object.freeze({
  "PRB-QL-204": 5,
  "PRB-QL-212": 7,
  "PRB-QL-220": 9,
});

const CP003_DICE_PRODUCT_PARITY_STATE_LANES: Readonly<Record<string, Readonly<{ eventType: string; targetProduct: number }>>> = Object.freeze({
  "PRB-QL-205": { eventType: "SAME_PARITY", targetProduct: 6 },
  "PRB-QL-213": { eventType: "DIFFERENT_PARITY", targetProduct: 8 },
  "PRB-QL-221": { eventType: "PRODUCT", targetProduct: 12 },
});

const CP003_SPINNER_STATE_LANES: Readonly<Record<string, Readonly<{ sectors: number; favourableSectors: number }>>> = Object.freeze({
  "PRB-QL-206": { sectors: 6, favourableSectors: 2 },
  "PRB-QL-214": { sectors: 8, favourableSectors: 3 },
  "PRB-QL-222": { sectors: 10, favourableSectors: 4 },
});

const CP003_NUMBER_RANGE_STATE_LANES: Readonly<Record<string, Readonly<{ upper: number; property: string; divisor: number }>>> = Object.freeze({
  "PRB-QL-207": { upper: 32, property: "PRIME", divisor: 2 },
  "PRB-QL-215": { upper: 30, property: "EVEN", divisor: 2 },
  "PRB-QL-223": { upper: 36, property: "DIVISIBLE", divisor: 4 },
});

const CP003_REVERSE_SPINNER_STATE_LANES: Readonly<Record<string, Readonly<{ sectors: number; favourableSectors: number }>>> = Object.freeze({
  "PRB-QL-208": { sectors: 16, favourableSectors: 14 },
  "PRB-QL-216": { sectors: 12, favourableSectors: 5 },
  "PRB-QL-224": { sectors: 10, favourableSectors: 3 },
});

const CP003_COIN_HEAD_STATE_LANES: Readonly<Record<string, Readonly<{ tosses: number; heads: number }>>> = Object.freeze({
  "PRB-QL-202": { tosses: 3, heads: 2 },
  "PRB-QL-210": { tosses: 5, heads: 2 },
  "PRB-QL-218": { tosses: 4, heads: 3 },
});

const CP002_COIN_STATE_LANES: Readonly<Record<string, Readonly<{ trials: number; k?: number }>>> = Object.freeze({
  "PRB-QL-102": { trials: 2 }, "PRB-QL-109": { trials: 3 }, "PRB-QL-116": { trials: 4 }, "PRB-QL-123": { trials: 5 },
  "PRB-QL-103": { trials: 2 }, "PRB-QL-110": { trials: 3 }, "PRB-QL-117": { trials: 4 }, "PRB-QL-124": { trials: 5 },
  "PRB-QL-104": { trials: 2 }, "PRB-QL-111": { trials: 3 }, "PRB-QL-118": { trials: 4 },
  "PRB-QL-105": { trials: 3, k: 1 }, "PRB-QL-112": { trials: 4, k: 2 }, "PRB-QL-119": { trials: 4, k: 1 },
  "PRB-QL-106": { trials: 3, k: 1 }, "PRB-QL-113": { trials: 4, k: 2 }, "PRB-QL-120": { trials: 4, k: 3 },
  "PRB-QL-107": { trials: 2 }, "PRB-QL-114": { trials: 3 }, "PRB-QL-121": { trials: 4 },
});

function generateProbabilityParametersCore(entry: ProbabilityTaskRegistryEntry, seed: string): GeneratedParameters {
  const random = seededRandom(`${seed}:${entry.qlId}:parameters`);
  const mode = entry.solveMode;
  if (mode === "findDirectProbability") {
    const [min, max] = difficultyRange(entry, [10, 24], [18, 36], [28, 48]);
    const total = randomInt(random, min, max);
    const favourable = randomInt(random, 2, total - 2);
    const scenario = pickRandom(random, ["LOTTERY_TICKETS", "DEFECTIVE_BULBS", "RED_BALLS", "MATHEMATICS_BOOKS"] as const);
    const object = scenario === "LOTTERY_TICKETS" ? "tickets" : scenario === "DEFECTIVE_BULBS" ? "bulbs" : scenario === "RED_BALLS" ? "balls" : "books";
    return { total, favourable, scenario, object };
  }
  if (mode === "findFavourableOutcomeCount" || mode === "findMissingEventCountFromProbability") {
    const fraction = reducedFraction(random); const scale = randomInt(random, 2, 6);
    return { probabilityNumerator: fraction.numerator, probabilityDenominator: fraction.denominator, total: fraction.denominator * scale, favourable: fraction.numerator * scale, context: pickRandom(random, ["winning tickets", "defective bulbs", "qualified candidates", "female employees"] as const) };
  }
  if (mode === "findTotalOutcomeCount") {
    const fraction = reducedFraction(random); const scale = randomInt(random, 2, 6);
    return { probabilityNumerator: fraction.numerator, probabilityDenominator: fraction.denominator, total: fraction.denominator * scale, favourable: fraction.numerator * scale, context: pickRandom(random, ["winning tickets", "red balls", "approved loan applications", "successful candidates"] as const) };
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
    const lane = CP002_COIN_STATE_LANES[entry.qlId];
    if (lane) {
      return {
        trials: lane.trials,
        k: lane.k ?? 1,
        successLabel: "head",
        failureLabel: "tail",
        fair: true,
      };
    }
    const [min, max] = difficultyRange(entry, [2, 3], [3, 4], [4, 5]);
    const trials = randomInt(random, min, max);
    const k = mode === "findExactlyKSuccessSmallCase" || mode === "findAtMostKSuccessSmallCase"
      ? randomInt(random, 1, Math.max(1, trials - 1))
      : 1;
    return { trials, k, successLabel: "head", failureLabel: "tail", fair: true };
  }

  if (mode === "findCoinPatternProbability") {
    const lane = CP003_COIN_PATTERN_STATE_LANES[entry.qlId];
    if (lane) return { tosses: lane.tosses, pattern: lane.pattern };
    const tosses = randomInt(random, 2, entry.difficulty === "Hard" ? 5 : 4);
    const pattern = Array.from({ length: tosses }, () => random() < 0.5 ? "H" : "T").join("");
    return { tosses, pattern };
  }
  if (mode === "findCoinHeadCountProbability") {
    const lane = CP003_COIN_HEAD_STATE_LANES[entry.qlId];
    if (lane) return { tosses: lane.tosses, heads: lane.heads };
    const tosses = randomInt(random, 2, entry.difficulty === "Hard" ? 5 : 4);
    return { tosses, heads: randomInt(random, 1, tosses - 1) };
  }
  if (mode === "findSingleDieEventProbability") {
    const lane = CP003_SINGLE_DIE_STATE_LANES[entry.qlId];
    if (lane) return { dieSides: 6, property: lane.property, threshold: lane.threshold };
    return { dieSides: 6, property: pickRandom(random, ["EVEN", "PRIME", "GREATER_THAN", "LESS_THAN"] as const), threshold: randomInt(random, 2, 4) };
  }
  if (mode === "findTwoDiceSumProbability") {
    const targetSum = CP003_DICE_SUM_STATE_LANES[entry.qlId];
    if (targetSum) return { dieSides: 6, targetSum };
    return { dieSides: 6, targetSum: randomInt(random, 4, 10) };
  }
  if (mode === "findTwoDiceProductOrParityProbability") {
    const lane = CP003_DICE_PRODUCT_PARITY_STATE_LANES[entry.qlId];
    if (lane) return { dieSides: 6, eventType: lane.eventType, targetProduct: lane.targetProduct };
    return { dieSides: 6, eventType: pickRandom(random, ["PRODUCT", "SAME_PARITY", "DIFFERENT_PARITY"] as const), targetProduct: pickRandom(random, [6, 8, 10, 12] as const) };
  }
  if (mode === "findSpinnerEventProbability") {
    const lane = CP003_SPINNER_STATE_LANES[entry.qlId];
    if (lane) return { sectors: lane.sectors, favourableSectors: lane.favourableSectors, sectorLabel: "shaded" };
    const sectors = pickRandom(random, [6, 8, 10, 12] as const);
    return { sectors, favourableSectors: randomInt(random, 2, sectors - 2), sectorLabel: "shaded" };
  }
  if (mode === "findNumberRangePropertyProbability") {
    const lane = CP003_NUMBER_RANGE_STATE_LANES[entry.qlId];
    if (lane) return { lower: 1, upper: lane.upper, property: lane.property, divisor: lane.divisor };
    const upper = randomInt(random, 20, entry.difficulty === "Hard" ? 60 : 45);
    return { lower: 1, upper, property: pickRandom(random, ["DIVISIBLE", "PRIME", "EVEN", "COMPOSITE"] as const), divisor: pickRandom(random, [2, 3, 4, 5, 6] as const) };
  }
  if (mode === "findReverseDiceOrSpinnerEventCount") {
    const lane = CP003_REVERSE_SPINNER_STATE_LANES[entry.qlId];
    if (lane) return { sectors: lane.sectors, favourableSectors: lane.favourableSectors };
    const sectors = pickRandom(random, [8, 10, 12, 16] as const);
    const favourableSectors = randomInt(random, 2, sectors - 2);
    return { sectors, favourableSectors };
  }

  if (["findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability", "findUnionCardEventProbability", "findComplementCardProbability", "findCardPropertyIntersection", "findMissingDeckCountOrEventCount"].includes(mode)) {
    const lane = CP004_CARD_STATE_LANES[entry.qlId];
    if (lane) return { rank: lane.rank, suit: lane.suit, colour: lane.colour, deckSize: 52 };
    return { rank: pickRandom(random, ["ace", "king", "queen", "jack"] as const), suit: pickRandom(random, ["hearts", "diamonds", "clubs", "spades"] as const), colour: pickRandom(random, ["red", "black"] as const), deckSize: 52 };
  }

  if (["findSingleDrawColourProbability", "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findMissingObjectCountFromProbability"].includes(mode) || (mode === "findSelectionProbabilityUsingCombination" && entry.cpId === "PRB-CP-005")) {
    const lane = CP005_URN_STATE_LANES[entry.qlId];
    if (lane) {
      return {
        red: lane.red,
        blue: lane.blue,
        total: lane.red + lane.blue,
        draw: lane.draw,
        targetColour: "red",
        secondaryColour: "blue",
        exactRed: lane.exactRed ?? Math.max(1, lane.draw - 1),
      };
    }
    const red = randomInt(random, 4, entry.difficulty === "Hard" ? 12 : 9), blue = randomInt(random, 4, entry.difficulty === "Hard" ? 12 : 9);
    const draw = mode === "findSingleDrawColourProbability" || mode === "findMissingObjectCountFromProbability" ? 1 : entry.difficulty === "Hard" ? 3 : 2;
    return { red, blue, total: red + blue, draw, targetColour: "red", secondaryColour: "blue", exactRed: Math.max(1, draw - 1) };
  }

  if (["findSuccessiveIndependentProbability", "findSuccessiveDependentProbability", "findWithReplacementProbability", "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages"].includes(mode)) {
    const lane = CP006_SUCCESSIVE_STATE_LANES[entry.qlId];
    if (lane) return { red: lane.red, blue: lane.blue, total: lane.red + lane.blue, draws: 2, firstColour: "red", secondColour: "blue" };
    const red = randomInt(random, 4, 9), blue = randomInt(random, 4, 9);
    return { red, blue, total: red + blue, draws: 2, firstColour: "red", secondColour: "blue" };
  }

  if (mode === "findConditionalCardProbability") return { condition: "FACE_CARD", target: "KING", conditionCount: 12, favourable: 4 };
  if (mode === "findConditionalNumberProbability") {
    const upper = CP007_CONDITIONAL_NUMBER_LANES[entry.qlId] ?? pickRandom(random, [20, 24, 30, 36, 40] as const);
    return { lower: 1, upper, conditionDivisor: 2, targetDivisor: 4 };
  }
  if (mode === "findConditionalUrnProbability") {
    const lane = CP007_CONDITIONAL_URN_LANES[entry.qlId];
    const red = lane?.red ?? randomInt(random, 5, 10);
    const blue = lane?.blue ?? randomInt(random, 4, 9);
    return { red, blue, knownFirstColour: "red", targetColour: "red" };
  }
  if (mode === "findReverseConditionalCount") {
    const lane = CP007_REVERSE_CONDITIONAL_LANES[entry.qlId];
    const restrictedTotal = lane?.restrictedTotal ?? randomInt(random, 12, 30);
    const favourable = lane?.favourable ?? randomInt(random, 2, restrictedTotal - 2);
    return { restrictedTotal, favourable, conditionLabel: "shortlisted", targetLabel: "certified" };
  }
  if (mode === "findConditionalFromTwoWayTable" || mode === "findConditionalProbabilityByCounting") {
    const lane = CP007_CONDITIONAL_COUNTING_LANES[entry.qlId];
    if (lane) {
      return {
        mathTotal: lane.mathTotal,
        both: lane.both,
        englishOnly: lane.englishOnly,
        neither: lane.neither,
        conditionLabel: "passed Mathematics",
        targetLabel: "passed English",
      };
    }
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
