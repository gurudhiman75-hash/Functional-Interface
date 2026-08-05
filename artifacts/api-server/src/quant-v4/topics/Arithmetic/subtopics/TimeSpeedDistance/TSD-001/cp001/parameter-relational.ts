import { divide, equals, multiply, rational, toMixedString } from "../foundation/rational";
import type { GeneratedState } from "./runtime-types";
import { SeededRng, r, ratioText } from "./runtime-support";

export function comparisonState(mode: "compareDistancesAtEqualTime" | "compareTimesAtEqualDistance" | "compareSpeedsAtEqualTime", rng: SeededRng): GeneratedState {
  const first = r(rng.pick([3, 4, 5, 6, 8, 9, 11, 14]));
  const secondPool = [2, 5, 7, 10, 12, 15, 17, 20] as const;
  let secondValue = rng.pick(secondPool);
  if (BigInt(secondValue) === first.numerator && first.denominator === 1n) {
    secondValue = secondPool[(secondPool.indexOf(secondValue) + 1) % secondPool.length];
  }
  const second = r(secondValue);
  const labels: readonly [string, string] = ["A", "B"];
  if (mode === "compareDistancesAtEqualTime") {
    return {
      input: { solveMode: mode, firstSpeed: first, secondSpeed: second },
      stem: `Two cars A and B move at ${toMixedString(first)} m/s and ${toMixedString(second)} m/s respectively for the same time. Find the ratio of distances covered by A and B.`,
      display: {
        ratioLabels: labels,
        formula: "For the same time, distance ratio = speed ratio",
        givens: [`Speed of A = ${toMixedString(first)} m/s`, `Speed of B = ${toMixedString(second)} m/s`],
        shortcut: "When time is the same, use the speed ratio directly.",
      },
    };
  }
  if (mode === "compareTimesAtEqualDistance") {
    return {
      input: { solveMode: mode, firstSpeed: first, secondSpeed: second },
      stem: `Two cars A and B cover the same distance at ${toMixedString(first)} m/s and ${toMixedString(second)} m/s respectively. Find the ratio of time taken by A and B.`,
      display: {
        ratioLabels: labels,
        formula: "For the same distance, time ratio is inverse of speed ratio",
        givens: [`Speed of A = ${toMixedString(first)} m/s`, `Speed of B = ${toMixedString(second)} m/s`],
        shortcut: "Reverse the speed ratio.",
      },
    };
  }
  return {
    input: { solveMode: mode, firstDistance: first, secondDistance: second },
    stem: `Two riders A and B travel for the same time and cover ${toMixedString(first)} km and ${toMixedString(second)} km respectively. Find the ratio of their speeds.`,
    display: {
      ratioLabels: labels,
      formula: "For the same time, speed ratio = distance ratio",
      givens: [`Distance covered by A = ${toMixedString(first)} km`, `Distance covered by B = ${toMixedString(second)} km`],
      shortcut: "Use the distance ratio directly.",
    },
  };
}

export function ratioState(mode: "distanceRatioFromSpeedAndTimeRatios" | "speedRatioFromDistanceAndTimeRatios" | "timeRatioFromDistanceAndSpeedRatios", rng: SeededRng): GeneratedState {
  const ratioPool = [
    rational(2, 3),
    rational(3, 5),
    rational(4, 7),
    rational(5, 8),
    rational(7, 9),
    rational(5, 4),
    rational(8, 5),
    rational(9, 7),
  ] as const;
  let firstRatio = rng.pick(ratioPool);
  let secondRatio = rng.pick(ratioPool);
  for (let attempt = 0; attempt < ratioPool.length && (equals(firstRatio, secondRatio) || (mode === "distanceRatioFromSpeedAndTimeRatios" && equals(multiply(firstRatio, secondRatio), rational(1)))); attempt += 1) {
    secondRatio = ratioPool[(ratioPool.indexOf(secondRatio) + 1) % ratioPool.length];
  }
  if (mode === "distanceRatioFromSpeedAndTimeRatios") {
    return {
      input: { solveMode: mode, speedRatio: firstRatio, timeRatio: secondRatio },
      stem: `The speeds of A and B are in the ratio ${ratioText(firstRatio)} and the times taken are in the ratio ${ratioText(secondRatio)}. Find the ratio of distances covered by them.`,
      display: {
        ratioLabels: ["A", "B"],
        formula: "Distance ratio = Speed ratio × Time ratio",
        givens: [`Speed ratio = ${ratioText(firstRatio)}`, `Time ratio = ${ratioText(secondRatio)}`],
        shortcut: "Multiply the corresponding ratio terms and simplify.",
      },
    };
  }
  if (mode === "speedRatioFromDistanceAndTimeRatios") {
    return {
      input: { solveMode: mode, distanceRatio: firstRatio, timeRatio: secondRatio },
      stem: `The distances covered by A and B are in the ratio ${ratioText(firstRatio)} and the times taken are in the ratio ${ratioText(secondRatio)}. Find the ratio of their speeds.`,
      display: {
        ratioLabels: ["A", "B"],
        formula: "Speed ratio = Distance ratio ÷ Time ratio",
        givens: [`Distance ratio = ${ratioText(firstRatio)}`, `Time ratio = ${ratioText(secondRatio)}`],
        shortcut: "Multiply the distance ratio by the inverse of the time ratio.",
      },
    };
  }
  return {
    input: { solveMode: mode, distanceRatio: firstRatio, speedRatio: secondRatio },
    stem: `The distances covered by A and B are in the ratio ${ratioText(firstRatio)} and their speeds are in the ratio ${ratioText(secondRatio)}. Find the ratio of time taken by them.`,
    display: {
      ratioLabels: ["A", "B"],
      formula: "Time ratio = Distance ratio ÷ Speed ratio",
      givens: [`Distance ratio = ${ratioText(firstRatio)}`, `Speed ratio = ${ratioText(secondRatio)}`],
      shortcut: "Multiply the distance ratio by the inverse of the speed ratio.",
    },
  };
}

export function proportionState(mode: "distanceByProportion" | "timeByProportion" | "speedByProportion", rng: SeededRng): GeneratedState {
  const sameSpeedCases = [
    [120, 2, 5],
    [180, 3, 5],
    [240, 4, 3],
    [150, 3, 6],
    [200, 4, 6],
    [270, 6, 4],
  ] as const;

  if (mode === "distanceByProportion" || mode === "timeByProportion") {
    const [knownDistanceValue, knownTimeValue, targetTimeValue] = rng.pick(sameSpeedCases);
    const knownDistance = r(knownDistanceValue);
    const knownTime = r(knownTimeValue);
    const targetTime = r(targetTimeValue);
    const knownSpeed = divide(knownDistance, knownTime);
    const targetSpeed = knownSpeed;
    const targetDistance = multiply(targetSpeed, targetTime);

    if (mode === "distanceByProportion") {
      return {
        input: { solveMode: mode, knownDistance, knownSpeed, knownTime, targetSpeed, targetTime },
        stem: `A bus covers ${knownDistanceValue} km in ${knownTimeValue} hours. How far will it travel in ${targetTimeValue} hours at the same speed?`,
        display: {
          unit: "km",
          formula: "At the same speed, distance is directly proportional to time",
          givens: [`${knownDistanceValue} km is covered in ${knownTimeValue} hours`, `Required time = ${targetTimeValue} hours`],
          shortcut: "Multiply the known distance by new time ÷ old time.",
        },
      };
    }

    return {
      input: { solveMode: mode, knownDistance, knownSpeed, knownTime, targetDistance, targetSpeed },
      stem: `A car covers ${knownDistanceValue} km in ${knownTimeValue} hours. How much time will it take to cover ${toMixedString(targetDistance)} km at the same speed?`,
      display: {
        unit: "hours",
        formula: "At the same speed, time is directly proportional to distance",
        givens: [`${knownDistanceValue} km is covered in ${knownTimeValue} hours`, `Required distance = ${toMixedString(targetDistance)} km`],
        shortcut: "Multiply the known time by new distance ÷ old distance.",
      },
    };
  }

  const sameDistanceCases = [
    [40, 6, 4],
    [56, 5, 4],
    [72, 4, 6],
    [63, 4, 3],
    [66, 6, 4],
    [54, 5, 3],
  ] as const;
  const [knownSpeedValue, knownTimeValue, targetTimeValue] = rng.pick(sameDistanceCases);
  const knownSpeed = r(knownSpeedValue);
  const knownTime = r(knownTimeValue);
  const targetTime = r(targetTimeValue);
  const knownDistance = multiply(knownSpeed, knownTime);
  const targetDistance = knownDistance;

  return {
    input: { solveMode: mode, knownDistance, knownSpeed, knownTime, targetDistance, targetTime },
    stem: `A car covers a fixed distance in ${knownTimeValue} hours at ${knownSpeedValue} km/h. At what speed should it travel to cover the same distance in ${targetTimeValue} hours?`,
    display: {
      unit: "km/h",
      formula: "For the same distance, speed is inversely proportional to time",
      givens: [`Original speed = ${knownSpeedValue} km/h`, `Original time = ${knownTimeValue} hours`, `New time = ${targetTimeValue} hours`],
      shortcut: "New speed = old speed × old time ÷ new time.",
    },
  };
}