import type { Avg001QuestionPackage } from "./types";

export const AVG_001_CP002_CONTEXT_SUPPORT =
  "AVG-CP-002 context-specific support reasoning v1";

const GENERIC_SUPPORT = new Set([
  "Pairing opposite terms leaves the same midpoint in every pair.",
  "Use half the number of gaps to move from the average to the requested end.",
  "Because the count is odd, the central term sits exactly at the average.",
  "Count the equal gaps from the average to the given extreme, then include both sides.",
  "Divide the half-span by the number of gaps on one side.",
]);

const SUPPORT_BY_SCENARIO: Record<string, string> = {
  consecutiveIntegersOddCount:
    "The first and last integers are equally far from the set's midpoint, so that midpoint is the average.",
  seatNumbersConsecutiveOddCount:
    "The lowest and highest seat numbers balance around the row's average seat number.",
  houseNumbersConsecutiveOddCount:
    "The first and last house numbers are equally distant from the lane's average house number.",
  consecutiveIntegersEvenCount:
    "With an even count, the two central integers have the same midpoint as the endpoints.",
  serialNumbersFixedStepEvenDifference:
    "The first and last serial numbers are equally far from the average serial number.",
  dailyIncrementTargetsEvenDifference:
    "Early and late daily targets pair to the same total, giving one average target.",
  multiplesArithmeticProgressionEvenDifference:
    "Opposite progression terms have the same sum, so every pair has the same midpoint.",
  testScoresFixedStepOddDifferenceEvenCount:
    "The lowest and highest test scores balance around the student's average score.",
  shiftTargetsFixedStepOddDifferenceEvenCount:
    "The first and last shift targets are equally distant from the average target.",
  fixedIntervalSequenceOddCount:
    "Terms equally far from the two ends share the sequence's midpoint.",
  priceTagsFixedStepEvenDifference:
    "The lowest and highest prices balance around the average price.",
  reverseDescribedApOddCount:
    "The first and last terms determine the midpoint of the arithmetic progression.",
  weeklyOutputApOddDifferenceEvenCount:
    "The first and last period outputs are equally distant from the average output.",
  negativeToPositiveConsecutiveOddCount:
    "The negative and positive endpoints balance around their midpoint, which is the set's average.",

  largestConsecutiveIntegerOddCount:
    "For an odd count, the average is the middle integer; move equal steps upward to the largest.",
  smallestConsecutiveIntegerOddCount:
    "For an odd count, the average is the middle integer; move equal steps downward to the smallest.",
  largestConsecutiveEvenOddCount:
    "The average is the middle even number; move upward by two for each remaining position.",
  smallestConsecutiveOddOddCount:
    "The average is the middle odd number; move downward by two for each remaining position.",
  largestSeatNumberFixedStep:
    "Half the equal seat-number gaps lie above the average; add their total span.",
  smallestProductionTargetFixedStep:
    "Half the production-target gaps lie below the average; subtract their total span.",
  largestApEvenCount:
    "The largest term lies half the progression's full span above the average.",
  smallestPriceApEvenCount:
    "The smallest price lies half the price progression's full span below the average.",
  largestConsecutiveIntegerEvenCount:
    "With an even count, the average lies between the central integers; move to the upper endpoint.",
  smallestConsecutiveIntegerEvenCount:
    "With an even count, the average lies between the central integers; move to the lower endpoint.",
  largestShiftTargetOddDifferenceEvenCount:
    "The largest shift target lies half the target progression's full span above the average.",
  smallestScoreOddDifferenceEvenCount:
    "The smallest score lies half the score progression's full span below the average.",

  averageConsecutiveEvenFromEndpointsOddCount:
    "The smallest and largest even numbers balance around the sequence's average.",
  averageConsecutiveOddFromEndpointsOddCount:
    "The smallest and largest odd numbers balance around the sequence's average.",
  averageConsecutiveEvenFromFirstOddCount:
    "After finding the last even number, average it with the first number.",
  averageConsecutiveOddFromFirstOddCount:
    "After finding the last odd number, average it with the first number.",
  averageEvenSeatNumbersOddCount:
    "The first and last even seat numbers balance around the block's average seat number.",
  averageConsecutiveEvenEvenCount:
    "For an even count, the two central even numbers share the same midpoint as the endpoints.",
  averageConsecutiveOddEvenCount:
    "For an even count, the two central odd numbers share the same midpoint as the endpoints.",
  averageOddHouseNumbers:
    "The first and last odd house numbers balance around the average house number.",
  averageEvenRollNumbers:
    "The first and last even roll numbers balance around the average roll number.",
  averageOddSequenceLargeCount:
    "After finding the last odd number, average it with the first number.",
  averageEvenSequenceLargeCount:
    "After finding the first even number, average it with the last number.",
  averageEvenProductionCodes:
    "The first and last production codes are equally distant from the average code.",
};

export function finalizeAvg001Cp002ContextSupport(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== "en" || pkg.canonicalProblemId !== "AVG-CP-002") return pkg;

  const replacement = SUPPORT_BY_SCENARIO[pkg.parameters.scenarioVariant];
  if (!replacement) return pkg;

  let changed = false;
  const lines = pkg.explanation.lines.map((line) => {
    if (!GENERIC_SUPPORT.has(line)) return line;
    changed = true;
    return replacement;
  });
  if (!changed) return pkg;

  return {
    ...pkg,
    explanation: { ...pkg.explanation, lines },
    traceability: {
      ...pkg.traceability,
      cp002ContextSupportFinalizer: AVG_001_CP002_CONTEXT_SUPPORT,
    },
  };
}
