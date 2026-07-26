import { getTmwCp001QuestionEntry } from "../library";
import { DeterministicRandom, hashSeed } from "./prng";
import { formatImproperFraction, multiply, rational, reciprocal } from "./rational";
import {
  TMW_001_PACKAGE_ID,
  TMW_CP_001_ID,
  type Rational,
  type TmwCp001Parameters,
} from "../types";

interface GeneratedState {
  quantities: Record<string, Rational>;
  renderVariables: Record<string, string | number>;
}

function q(value: number, denominator = 1): Rational {
  return rational(value, denominator);
}

function integer(value: Rational): number {
  if (value.denominator !== 1) throw new Error(`Expected an integer but received ${formatImproperFraction(value)}.`);
  return value.numerator;
}

function generateState(solveMode: TmwCp001Parameters["solveMode"], random: DeterministicRandom): GeneratedState {
  switch (solveMode) {
    case "findWorkFromRateAndTime": {
      const rate = random.pick([18, 24, 30, 36, 42, 48]);
      const time = random.pick([4, 5, 6, 7, 8]);
      return { quantities: { rate: q(rate), time: q(time), work: q(rate * time) }, renderVariables: { rate, time } };
    }
    case "findRateFromWorkAndTime": {
      const rate = random.pick([16, 20, 24, 28, 32, 36]);
      const time = random.pick([5, 6, 8, 9, 10, 12]);
      return { quantities: { rate: q(rate), time: q(time), work: q(rate * time) }, renderVariables: { work: rate * time, time } };
    }
    case "findTimeFromWorkAndRate": {
      const rate = random.pick([18, 20, 24, 30, 36, 40]);
      const time = random.pick([5, 6, 8, 9, 10, 12]);
      return { quantities: { rate: q(rate), time: q(time), work: q(rate * time) }, renderVariables: { work: rate * time, rate } };
    }
    case "findOneUnitWorkFromCompletionTime": {
      const completionTime = random.pick([8, 10, 12, 15, 16, 18, 20, 24]);
      const unitWork = reciprocal(q(completionTime));
      return { quantities: { completionTime: q(completionTime), unitWork }, renderVariables: { completionTime } };
    }
    case "findCompletionTimeFromOneUnitWork": {
      const completionTime = random.pick([8, 10, 12, 15, 16, 18, 20, 24]);
      const unitWork = reciprocal(q(completionTime));
      return {
        quantities: { completionTime: q(completionTime), unitWork },
        renderVariables: { unitWork: formatImproperFraction(unitWork) },
      };
    }
    case "findFractionCompletedInGivenTime": {
      const [completionTime, elapsedTime] = random.pick([
        [12, 5], [15, 4], [16, 7], [18, 5], [20, 7], [24, 11],
      ] as const);
      return {
        quantities: {
          completionTime: q(completionTime),
          elapsedTime: q(elapsedTime),
          completedFraction: rational(elapsedTime, completionTime),
        },
        renderVariables: { completionTime, elapsedTime },
      };
    }
    case "findPercentCompletedInGivenTime": {
      const [completionTime, elapsedTime] = random.pick([
        [20, 7], [25, 8], [16, 6], [10, 3], [40, 14], [50, 18],
      ] as const);
      return {
        quantities: {
          completionTime: q(completionTime),
          elapsedTime: q(elapsedTime),
          completedFraction: rational(elapsedTime, completionTime),
          completedPercent: rational(elapsedTime * 100, completionTime),
        },
        renderVariables: { completionTime, elapsedTime },
      };
    }
    case "findTimeForGivenFraction": {
      const [completionTime, numerator, denominator] = random.pick([
        [12, 1, 2], [18, 2, 3], [20, 3, 4], [25, 2, 5], [24, 5, 6], [30, 3, 5],
      ] as const);
      const fraction = rational(numerator, denominator);
      const elapsedTime = multiply(q(completionTime), fraction);
      return {
        quantities: { completionTime: q(completionTime), completedFraction: fraction, elapsedTime },
        renderVariables: { completionTime, fraction: formatImproperFraction(fraction) },
      };
    }
    case "findTimeForGivenPercent": {
      const [completionTime, percent] = random.pick([
        [20, 35], [25, 40], [16, 75], [30, 60], [24, 25], [40, 45],
      ] as const);
      const elapsedTime = rational(completionTime * percent, 100);
      return {
        quantities: { completionTime: q(completionTime), percent: q(percent), elapsedTime },
        renderVariables: { completionTime, percent },
      };
    }
    case "findRemainingFractionAfterTime": {
      const [completionTime, elapsedTime] = random.pick([
        [12, 5], [15, 4], [16, 7], [18, 5], [20, 7], [24, 11],
      ] as const);
      return {
        quantities: {
          completionTime: q(completionTime),
          elapsedTime: q(elapsedTime),
          completedFraction: rational(elapsedTime, completionTime),
          remainingFraction: rational(completionTime - elapsedTime, completionTime),
        },
        renderVariables: { completionTime, elapsedTime },
      };
    }
    case "findRemainingPercentAfterTime": {
      const [completionTime, elapsedTime] = random.pick([
        [20, 7], [25, 8], [16, 6], [10, 3], [40, 14], [50, 18],
      ] as const);
      return {
        quantities: {
          completionTime: q(completionTime),
          elapsedTime: q(elapsedTime),
          remainingPercent: rational((completionTime - elapsedTime) * 100, completionTime),
        },
        renderVariables: { completionTime, elapsedTime },
      };
    }
    case "findOutputFromUnitRateAndTime": {
      const rate = random.pick([24, 30, 36, 42, 48, 54]);
      const time = random.pick([5, 6, 7, 8, 9, 10]);
      return { quantities: { rate: q(rate), time: q(time), output: q(rate * time) }, renderVariables: { rate, time } };
    }
    case "findUnitRateFromOutputAndTime": {
      const rate = random.pick([18, 20, 24, 25, 30, 32]);
      const time = random.pick([6, 8, 9, 10, 12, 15]);
      return { quantities: { rate: q(rate), time: q(time), output: q(rate * time) }, renderVariables: { output: rate * time, time } };
    }
    case "findTimeFromOutputAndUnitRate": {
      const rate = random.pick([15, 18, 20, 24, 30, 36]);
      const time = random.pick([5, 6, 8, 9, 10, 12]);
      return { quantities: { rate: q(rate), time: q(time), output: q(rate * time) }, renderVariables: { output: rate * time, rate } };
    }
    case "recoverWholeWorkFromCompletedPart": {
      const [totalWork, numerator, denominator] = random.pick([
        [300, 3, 5], [420, 4, 7], [480, 5, 8], [540, 2, 3], [630, 5, 7], [720, 3, 4],
      ] as const);
      const fraction = rational(numerator, denominator);
      const partWork = multiply(q(totalWork), fraction);
      return {
        quantities: { totalWork: q(totalWork), partWork, completedFraction: fraction },
        renderVariables: { partWork: integer(partWork), fraction: formatImproperFraction(fraction) },
      };
    }
    case "recoverWholeTimeFromPartCompletion": {
      const [wholeTime, numerator, denominator] = random.pick([
        [12, 1, 2], [18, 2, 3], [20, 3, 4], [25, 2, 5], [24, 5, 6], [30, 3, 5],
      ] as const);
      const fraction = rational(numerator, denominator);
      const elapsedTime = multiply(q(wholeTime), fraction);
      return {
        quantities: { wholeTime: q(wholeTime), elapsedTime, completedFraction: fraction },
        renderVariables: { fraction: formatImproperFraction(fraction), elapsedTime: integer(elapsedTime) },
      };
    }
    case "convertRateAcrossTimeUnits": {
      const hourlyRate = random.pick([120, 180, 240, 300, 360, 420]);
      return {
        quantities: { hourlyRate: q(hourlyRate), minuteRate: rational(hourlyRate, 60), minutesPerHour: q(60) },
        renderVariables: { hourlyRate },
      };
    }
    case "compareWorkCompletedAtEqualTime": {
      const rateB = random.pick([18, 20, 24, 25, 30]);
      const gap = random.pick([4, 6, 8, 10, 12]);
      const rateA = rateB + gap;
      const time = random.pick([5, 6, 8, 9, 10]);
      return {
        quantities: { rateA: q(rateA), rateB: q(rateB), time: q(time), difference: q(gap * time) },
        renderVariables: { rateA, rateB, time },
      };
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const rate = random.pick([15, 18, 20, 24, 30]);
      const timeA = random.pick([6, 8, 9, 10, 12]);
      const extraTime = random.pick([2, 3, 4, 5]);
      const timeB = timeA + extraTime;
      return {
        quantities: {
          rate: q(rate),
          workA: q(rate * timeA),
          workB: q(rate * timeB),
          timeA: q(timeA),
          timeB: q(timeB),
          difference: q(extraTime),
        },
        renderVariables: { rate, workA: rate * timeA, workB: rate * timeB },
      };
    }
    case "findRequiredRateForTargetCompletion": {
      const requiredRate = random.pick([36, 40, 45, 48, 50, 60]);
      const time = random.pick([6, 8, 9, 10, 12]);
      return {
        quantities: { requiredRate: q(requiredRate), time: q(time), work: q(requiredRate * time) },
        renderVariables: { work: requiredRate * time, time },
      };
    }
    case "findDelayFromReducedUniformRate": {
      const [originalTime, percent, newTime, delay] = random.pick([
        [16, 20, 20, 4], [18, 25, 24, 6], [15, 25, 20, 5], [20, 20, 25, 5],
        [12, 25, 16, 4], [21, 30, 30, 9], [24, 20, 30, 6],
      ] as const);
      return {
        quantities: {
          originalTime: q(originalTime), percent: q(percent), originalRate: q(100),
          changedRate: q(100 - percent), newTime: q(newTime), difference: q(delay),
          workIndex: q(originalTime * 100),
        },
        renderVariables: { originalTime, percent },
      };
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const [originalTime, percent, newTime, saving] = random.pick([
        [12, 20, 10, 2], [15, 25, 12, 3], [20, 25, 16, 4], [18, 20, 15, 3],
        [24, 20, 20, 4], [30, 25, 24, 6], [16, 60, 10, 6],
      ] as const);
      return {
        quantities: {
          originalTime: q(originalTime), percent: q(percent), originalRate: q(100),
          changedRate: q(100 + percent), newTime: q(newTime), difference: q(saving),
          workIndex: q(originalTime * 100),
        },
        renderVariables: { originalTime, percent },
      };
    }
  }
}

export function generateTmwCp001Parameters(qlId: string, seed: string): TmwCp001Parameters {
  const entry = getTmwCp001QuestionEntry(qlId);
  const random = new DeterministicRandom(`${TMW_001_PACKAGE_ID}|${qlId}|${seed}`);
  const state = generateState(entry.solveMode, random);
  const suffix = hashSeed(`${qlId}|${seed}`).toString(16).padStart(8, "0");
  return {
    packageId: TMW_001_PACKAGE_ID,
    canonicalProblemId: TMW_CP_001_ID,
    qlId,
    questionId: `TMW-Q-${suffix}`,
    seed,
    language: "en",
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    answerUnit: entry.answerUnitPolicy,
    quantities: state.quantities,
    renderVariables: state.renderVariables,
    scenarioFamily: entry.scenarioFamily,
    formulaStrategyId: entry.formulaStrategyId,
    explanationStrategyId: entry.explanationStrategyId,
    distractorStrategyIds: [...entry.distractorStrategyIds],
  };
}
