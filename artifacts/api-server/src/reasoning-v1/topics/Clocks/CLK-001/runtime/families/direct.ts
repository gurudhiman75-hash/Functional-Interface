import {
  CLOCK_HAND_RATE_DEG_PER_SECOND,
  absoluteRational,
  addClockSecondsExact,
  addRationals,
  clockTimeToHandAnglesByCycleExact,
  clockTimeToHandAnglesExact,
  compareHandMovementsExact,
  compareRationals,
  degreesToMinuteSpacesExact,
  divideRationals,
  durationForHandMovementExact,
  exactRational,
  handMovementDegreesExact,
  handRevolutionsExact,
  handTipDistancePiCoefficientExact,
  hourMinuteAngleSnapshotExact,
  minuteSpacesToDegreesExact,
  moduloRational,
  multiplyRationals,
  reflexSeparationExact,
  smallerSeparationExact,
  subtractRationals,
  type ClockHand,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type {
  ClockContractEvidence,
  ClockFamilySolverInput,
  SolvedClockPrototype,
} from "../solver-types";
import type { ClockAnswerKind } from "../types";
import {
  clockSeconds,
  formatAngle,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  rationalAnswer,
  textAnswer,
  timeInput,
} from "../utils";

const CP001_TASKS = new Set<ClockTaskId>([
  "HAND_HOUR_ROTATION",
  "HAND_MINUTE_ROTATION",
  "HAND_SECOND_ROTATION",
  "HAND_DURATION_FROM_ANGLE",
  "HAND_REVOLUTIONS",
  "MINUTE_SPACES_TO_ANGLE",
  "HAND_TIP_DISTANCE",
  "COMPARE_HAND_MOTION",
]);

const CP002_TASKS = new Set<ClockTaskId>([
  "SMALLER_ANGLE_AT_TIME",
  "REFLEX_ANGLE_AT_TIME",
  "DIRECTED_CLOCKWISE_SEPARATION",
  "ANGLE_AT_TIME_WITH_SECONDS",
  "ANGLE_AFTER_BEFORE_SHIFT",
  "CLASSIFY_HAND_RELATION",
  "COMPARE_ANGLES_AT_TWO_TIMES",
  "ANGLE_INVOLVING_SECOND_HAND",
]);

function exactKey(value: ExactRational): string {
  return `${value.numerator}/${value.denominator}`;
}

function handName(hand: ClockHand): string {
  return hand === "HOUR" ? "hour hand" : hand === "MINUTE" ? "minute hand" : "second hand";
}

function exactCount(value: ExactRational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

function contract(
  expectedAnswerKind: ClockAnswerKind,
  oracleName: string,
  visibleStemTokens: readonly string[],
): ClockContractEvidence {
  return { expectedAnswerKind, oracleName, visibleStemTokens };
}

function angleDistractors(correct: ExactRational): SolvedClockPrototype["distractors"] {
  const reflex = compareRationals(correct, 0) === 0
    ? exactRational(180)
    : subtractRationals(360, correct);
  return [
    {
      answer: rationalAnswer("ANGLE", reflex, formatAngle(reflex)),
      reasonCode: "COMPLEMENTARY_ANGLE_SELECTED",
      reason: "This selects the complementary circular angle rather than the angle requested in the stem.",
    },
    {
      answer: rationalAnswer("ANGLE", addRationals(correct, 30), formatAngle(addRationals(correct, 30))),
      reasonCode: "ONE_HOUR_SPACE_ADDED",
      reason: "This adds one 30-degree hour space without mathematical support.",
    },
    {
      answer: rationalAnswer("ANGLE", divideRationals(correct, 2), formatAngle(divideRationals(correct, 2))),
      reasonCode: "ANGLE_HALVED",
      reason: "This halves the exact hand separation although no bisection is required.",
    },
  ];
}

function solveCp001(input: ClockFamilySolverInput): SolvedClockPrototype {
  const durationMinutes = input.rng.pick([5, 10, 12, 15, 20, 24, 30, 40, 45, 60, 90, 120] as const);
  const durationSeconds = exactRational(durationMinutes * 60);

  if (
    input.taskId === "HAND_HOUR_ROTATION" ||
    input.taskId === "HAND_MINUTE_ROTATION" ||
    input.taskId === "HAND_SECOND_ROTATION"
  ) {
    const hand: ClockHand = input.taskId === "HAND_HOUR_ROTATION"
      ? "HOUR"
      : input.taskId === "HAND_MINUTE_ROTATION"
        ? "MINUTE"
        : "SECOND";
    const canonical = handMovementDegreesExact(hand, durationSeconds);
    const verifier = multiplyRationals(CLOCK_HAND_RATE_DEG_PER_SECOND[hand], durationSeconds);
    const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
    const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
    const otherHands = (["HOUR", "MINUTE", "SECOND"] as const).filter((candidate) => candidate !== hand);
    return {
      taskId: input.taskId,
      stem: `Through how many degrees does the ${handName(hand)} rotate in ${durationMinutes} minutes?`,
      scenario: { hand, durationMinutes, totalRotationRequired: true },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: rationalAnswer("ANGLE", handMovementDegreesExact(otherHands[0]!, durationSeconds), formatAngle(handMovementDegreesExact(otherHands[0]!, durationSeconds))),
          reasonCode: "WRONG_HAND_RATE_USED",
          reason: "This uses another clock hand's angular rate for the stated duration.",
        },
        {
          answer: rationalAnswer("ANGLE", moduloRational(canonical, 360), formatAngle(moduloRational(canonical, 360))),
          reasonCode: "TOTAL_ROTATION_REDUCED_MODULO_360",
          reason: "This keeps only the final dial position although the question asks for total rotation.",
        },
        {
          answer: rationalAnswer("ANGLE", divideRationals(canonical, 2), formatAngle(divideRationals(canonical, 2))),
          reasonCode: "DURATION_HALVED",
          reason: "This calculates movement for only half of the stated duration.",
        },
      ],
      explanation: {
        given: `${handName(hand)} moving for ${durationMinutes} minutes.`,
        rule: `Movement = angular rate × time. The ${handName(hand)} moves ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} per second.`,
        working: [`Time = ${durationMinutes * 60} seconds.`, `Movement = ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} × ${durationMinutes * 60} = ${answer.display}.`],
        validityCheck: "Dividing the total movement by 360° gives the same exact revolution count as the independent cycle calculation.",
        closestTrap: "Do not discard complete revolutions when total movement is requested.",
        answer: answer.display,
      },
      canonicalTrace: [`handMovement=${exactKey(canonical)}`],
      verifierTrace: [`rate×seconds=${exactKey(verifier)}`],
      contractEvidence: contract("ANGLE", "CP001_HAND_RATE_MOVEMENT_ORACLE", [handName(hand), `${durationMinutes} minutes`]),
    };
  }

  if (input.taskId === "HAND_DURATION_FROM_ANGLE") {
    const hand = input.rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const sourceDuration = exactRational(input.rng.pick([30, 60, 90, 120, 180, 240, 300, 600, 900] as const));
    const movement = handMovementDegreesExact(hand, sourceDuration);
    const canonical = durationForHandMovementExact(hand, movement);
    const verifier = divideRationals(movement, CLOCK_HAND_RATE_DEG_PER_SECOND[hand]);
    const answer = rationalAnswer("DURATION", canonical, formatDurationSeconds(canonical));
    const verifierAnswer = rationalAnswer("DURATION", verifier, formatDurationSeconds(verifier));
    return {
      taskId: input.taskId,
      stem: `How long will the ${handName(hand)} take to move through ${formatAngle(movement)}?`,
      scenario: { hand, movementDegrees: formatAngle(movement) },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("DURATION", multiplyRationals(canonical, 2), formatDurationSeconds(multiplyRationals(canonical, 2))), reasonCode: "HAND_RATE_HALVED", reason: "This treats the stated hand as moving at half its actual rate." },
        { answer: rationalAnswer("DURATION", divideRationals(canonical, 2), formatDurationSeconds(divideRationals(canonical, 2))), reasonCode: "HAND_RATE_DOUBLED", reason: "This treats the hand as moving twice as fast as it actually does." },
        { answer: rationalAnswer("DURATION", movement, formatDurationSeconds(movement)), reasonCode: "ANGLE_COPIED_AS_TIME", reason: "This copies the numerical angle as a duration without dividing by angular rate." },
      ],
      explanation: {
        given: `${handName(hand)} movement ${formatAngle(movement)}.`,
        rule: "Time = angular movement ÷ angular rate.",
        working: [`Time = ${formatAngle(movement)} ÷ ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} per second = ${answer.display}.`],
        validityCheck: "Substituting the answer into rate × time returns the stated angular movement exactly.",
        closestTrap: "Degrees and seconds are different units; the angle itself is not the time.",
        answer: answer.display,
      },
      canonicalTrace: [`durationForMovement=${exactKey(canonical)}`],
      verifierTrace: [`movement/rate=${exactKey(verifier)}`],
      contractEvidence: contract("DURATION", "CP001_INVERSE_HAND_MOVEMENT_ORACLE", [handName(hand), formatAngle(movement)]),
    };
  }

  if (input.taskId === "HAND_REVOLUTIONS") {
    const hand = input.rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const hours = input.rng.pick([1, 2, 3, 4, 6, 8, 12, 24] as const);
    const seconds = exactRational(hours * 3_600);
    const canonical = handRevolutionsExact(hand, seconds);
    const verifier = divideRationals(handMovementDegreesExact(hand, seconds), 360);
    const answer = rationalAnswer("COUNT", canonical, exactCount(canonical));
    const verifierAnswer = rationalAnswer("COUNT", verifier, exactCount(verifier));
    return {
      taskId: input.taskId,
      stem: `How many revolutions does the ${handName(hand)} make in ${hours} hours?`,
      scenario: { hand, hours, output: "REVOLUTIONS" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("COUNT", multiplyRationals(canonical, 2), exactCount(multiplyRationals(canonical, 2))), reasonCode: "REVOLUTIONS_DOUBLED", reason: "This doubles the exact revolution count." },
        { answer: rationalAnswer("COUNT", divideRationals(canonical, 2), exactCount(divideRationals(canonical, 2))), reasonCode: "REVOLUTIONS_HALVED", reason: "This uses only half of the exact revolution count." },
        { answer: rationalAnswer("COUNT", handMovementDegreesExact(hand, seconds), exactCount(handMovementDegreesExact(hand, seconds))), reasonCode: "DEGREES_REPORTED_AS_REVOLUTIONS", reason: "This reports total degrees moved as the number of revolutions." },
      ],
      explanation: {
        given: `${handName(hand)}, ${hours} hours.`,
        rule: "Revolutions = total angular movement ÷ 360°.",
        working: [`Total movement = ${formatAngle(handMovementDegreesExact(hand, seconds))}.`, `Revolutions = ${answer.display}.`],
        validityCheck: "Multiplying the answer by 360° restores the exact total movement.",
        closestTrap: "The total number of degrees is not itself a revolution count.",
        answer: answer.display,
      },
      canonicalTrace: [`revolutions=${exactKey(canonical)}`],
      verifierTrace: [`movement/360=${exactKey(verifier)}`],
      contractEvidence: contract("COUNT", "CP001_REVOLUTION_COUNT_ORACLE", [handName(hand), `${hours} hours`]),
    };
  }

  if (input.taskId === "MINUTE_SPACES_TO_ANGLE") {
    const spaces = input.rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25] as const);
    const canonical = minuteSpacesToDegreesExact(spaces);
    const verifier = exactRational(spaces * 360, 60);
    const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
    const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
    return {
      taskId: input.taskId,
      stem: `What angular separation is represented by ${spaces} minute spaces on a clock dial?`,
      scenario: { minuteSpaces: spaces },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("ANGLE", exactRational(spaces * 5), formatAngle(spaces * 5)), reasonCode: "FIVE_DEGREES_PER_MINUTE_SPACE", reason: "This confuses five minute marks in an hour space with five degrees per minute space." },
        { answer: rationalAnswer("ANGLE", exactRational(spaces * 30), formatAngle(spaces * 30)), reasonCode: "HOUR_SPACE_RATE_USED", reason: "This treats every minute space as a 30-degree hour space." },
        { answer: rationalAnswer("ANGLE", exactRational(spaces), formatAngle(spaces)), reasonCode: "SPACES_COPIED_AS_DEGREES", reason: "This copies the number of spaces without converting each space to 6 degrees." },
      ],
      explanation: {
        given: `${spaces} minute spaces.`,
        rule: "One minute space = 360° ÷ 60 = 6°.",
        working: [`${spaces} × 6° = ${answer.display}.`],
        validityCheck: `Dividing ${answer.display} by 6° returns ${exactCount(degreesToMinuteSpacesExact(canonical))} minute spaces.`,
        closestTrap: "An hour space is 30°, but a minute space is 6°.",
        answer: answer.display,
      },
      canonicalTrace: [`spaces×6=${exactKey(canonical)}`],
      verifierTrace: [`spaces×360/60=${exactKey(verifier)}`],
      contractEvidence: contract("ANGLE", "CP001_MINUTE_SPACE_CONVERSION_ORACLE", [`${spaces} minute spaces`]),
    };
  }

  if (input.taskId === "HAND_TIP_DISTANCE") {
    const radius = input.rng.pick([4, 5, 6, 7, 8, 10, 12] as const);
    const hand = input.rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const movement = input.rng.pick([30, 45, 60, 90, 120, 180, 270, 360] as const);
    const canonical = handTipDistancePiCoefficientExact(radius, movement);
    const verifier = multiplyRationals(exactRational(movement, 360), 2 * radius);
    const answer = rationalAnswer("DISTANCE_PI", canonical, `${exactCount(canonical)}π cm`, "DISTANCE_PI_COEFFICIENT");
    const verifierAnswer = rationalAnswer("DISTANCE_PI", verifier, `${exactCount(verifier)}π cm`, "DISTANCE_PI_COEFFICIENT");
    return {
      taskId: input.taskId,
      stem: `The ${handName(hand)} is ${radius} cm long. What distance does its tip travel while the hand turns through ${movement}°? Give the answer in terms of π.`,
      scenario: { hand, radiusCm: radius, movementDegrees: movement },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("DISTANCE_PI", divideRationals(canonical, 2), `${exactCount(divideRationals(canonical, 2))}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "CIRCUMFERENCE_FACTOR_MISSED", reason: "This loses the factor 2 in the circumference 2πr." },
        { answer: rationalAnswer("DISTANCE_PI", multiplyRationals(canonical, 2), `${exactCount(multiplyRationals(canonical, 2))}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "CIRCUMFERENCE_FACTOR_DOUBLED", reason: "This applies the factor 2 twice." },
        { answer: rationalAnswer("DISTANCE_PI", exactRational(radius * movement), `${radius * movement}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "ANGLE_NOT_CONVERTED_TO_CIRCLE_FRACTION", reason: "This multiplies radius and angle without converting degrees into a fraction of a full circle." },
      ],
      explanation: {
        given: `Hand length ${radius} cm; rotation ${movement}°.` ,
        rule: "Arc length = (rotation/360°) × 2πr.",
        working: [`Distance = (${movement}/360) × 2π × ${radius} = ${answer.display}.`],
        validityCheck: "The independent circumference-fraction calculation gives the same exact coefficient of π.",
        closestTrap: "Do not use the angle in degrees as a direct multiplier without dividing by 360.",
        answer: answer.display,
      },
      canonicalTrace: [`rθ/180=${exactKey(canonical)}`],
      verifierTrace: [`θ/360×2r=${exactKey(verifier)}`],
      contractEvidence: contract("DISTANCE_PI", "CP001_HAND_TIP_ARC_ORACLE", [handName(hand), `${radius} cm`, `${movement}°`]),
    };
  }

  const left = input.rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
  const right = input.rng.pick((["HOUR", "MINUTE", "SECOND"] as const).filter((hand) => hand !== left));
  const comparison = compareHandMovementsExact(left, right, durationSeconds);
  const canonical = absoluteRational(comparison.difference);
  const rateDifference = absoluteRational(subtractRationals(CLOCK_HAND_RATE_DEG_PER_SECOND[left], CLOCK_HAND_RATE_DEG_PER_SECOND[right]));
  const verifier = multiplyRationals(rateDifference, durationSeconds);
  const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical), "MOTION_DIFFERENCE");
  const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier), "MOTION_DIFFERENCE");
  return {
    taskId: input.taskId,
    stem: `By how many degrees do the total movements of the ${handName(left)} and ${handName(right)} differ in ${durationMinutes} minutes?`,
    scenario: { leftHand: left, rightHand: right, durationMinutes },
    answer,
    verifierAnswer,
    distractors: [
      { answer: rationalAnswer("ANGLE", addRationals(comparison.left, comparison.right), formatAngle(addRationals(comparison.left, comparison.right)), "MOTION_DIFFERENCE"), reasonCode: "HAND_MOVEMENTS_ADDED", reason: "This adds the two movements instead of finding their difference." },
      { answer: rationalAnswer("ANGLE", comparison.left, formatAngle(comparison.left), "MOTION_DIFFERENCE"), reasonCode: "FIRST_HAND_MOVEMENT_ONLY", reason: "This reports only the first hand's total movement." },
      { answer: rationalAnswer("ANGLE", moduloRational(canonical, 360), formatAngle(moduloRational(canonical, 360)), "MOTION_DIFFERENCE"), reasonCode: "TOTAL_DIFFERENCE_REDUCED_MODULO_360", reason: "This compares final dial positions instead of total movements." },
    ],
    explanation: {
      given: `${handName(left)} and ${handName(right)} moving for ${durationMinutes} minutes.`,
      rule: "Find each total movement from its own rate, then take the absolute difference.",
      working: [`${handName(left)} movement = ${formatAngle(comparison.left)}.`, `${handName(right)} movement = ${formatAngle(comparison.right)}.`, `Difference = ${answer.display}.`],
      validityCheck: "Rate difference × common time gives the same result independently.",
      closestTrap: "Adding the movements answers a different question.",
      answer: answer.display,
    },
    canonicalTrace: [`|left-right|=${exactKey(canonical)}`],
    verifierTrace: [`|rateDifference|×time=${exactKey(verifier)}`],
    contractEvidence: contract("ANGLE", "CP001_COMPARE_HAND_MOVEMENT_ORACLE", [handName(left), handName(right), `${durationMinutes} minutes`]),
  };
}

function angleFromCycle(
  time: { hour: number; minute: number; second?: ExactRational | number },
  requested: "SMALLER" | "REFLEX" | "HOUR_TO_MINUTE" | "MINUTE_TO_HOUR",
): ExactRational {
  const angles = clockTimeToHandAnglesByCycleExact(time);
  if (requested === "SMALLER") return smallerSeparationExact(angles.hourAngleDeg, angles.minuteAngleDeg);
  if (requested === "REFLEX") return reflexSeparationExact(angles.hourAngleDeg, angles.minuteAngleDeg);
  if (requested === "HOUR_TO_MINUTE") return moduloRational(subtractRationals(angles.minuteAngleDeg, angles.hourAngleDeg), 360);
  return moduloRational(subtractRationals(angles.hourAngleDeg, angles.minuteAngleDeg), 360);
}

function solveCp002(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "CLASSIFY_HAND_RELATION") {
    const selected = input.rng.pick([
      { timeSeconds: exactRational(0), label: "COINCIDE" },
      { timeSeconds: exactRational(21_600, 11), label: "OPPOSITE" },
      { timeSeconds: exactRational(10_800, 11), label: "RIGHT_ANGLE" },
      { timeSeconds: clockSeconds(2, 20), label: "OTHER" },
    ] as const);
    const time = formatClockTimeFromSeconds(selected.timeSeconds, { includeSeconds: true });
    const timeInputValue = (() => {
      const total = selected.timeSeconds;
      const hourIndex = Number(total.numerator / (total.denominator * 3_600n));
      const afterHour = subtractRationals(total, hourIndex * 3_600);
      const minute = Number(afterHour.numerator / (afterHour.denominator * 60n));
      const second = subtractRationals(afterHour, minute * 60);
      return { hour: hourIndex === 0 ? 12 : hourIndex, minute, second };
    })();
    const snapshot = hourMinuteAngleSnapshotExact(timeInputValue);
    const independentAngle = angleFromCycle(timeInputValue, "SMALLER");
    const classify = (angle: ExactRational) => compareRationals(angle, 0) === 0
      ? "COINCIDE"
      : compareRationals(angle, 90) === 0
        ? "RIGHT_ANGLE"
        : compareRationals(angle, 180) === 0
          ? "OPPOSITE"
          : "OTHER";
    const canonicalClass = classify(snapshot.smallerAngleDeg);
    const verifierClass = classify(independentAngle);
    const answer = textAnswer("CLASSIFICATION", canonicalClass, canonicalClass.toLowerCase().replaceAll("_", " "));
    const verifierAnswer = textAnswer("CLASSIFICATION", verifierClass, verifierClass.toLowerCase().replaceAll("_", " "));
    return {
      taskId: input.taskId,
      stem: `At ${time}, how are the hour and minute hands positioned: coincident, opposite, at a right angle, or in none of these relations?`,
      scenario: { time, expectedRelation: selected.label },
      answer,
      verifierAnswer,
      distractors: (["COINCIDE", "OPPOSITE", "RIGHT_ANGLE", "OTHER"] as const)
        .filter((value) => value !== canonicalClass)
        .map((value) => ({
          answer: textAnswer("CLASSIFICATION", value, value.toLowerCase().replaceAll("_", " ")),
          reasonCode: `MISCLASSIFIED_AS_${value}`,
          reason: "This relation does not match the exact smaller angle at the stated time.",
        })),
      explanation: {
        given: `Time ${time}.`,
        rule: "Compute the exact smaller angle: 0° means coincident, 90° right angle and 180° opposite.",
        working: [`Smaller angle = ${formatAngle(snapshot.smallerAngleDeg)}.`, `Relation = ${answer.display}.`],
        validityCheck: "A separate cycle-fraction hand-position calculation gives the same classification.",
        closestTrap: "A position that looks nearly special is not exact.",
        answer: answer.display,
      },
      canonicalTrace: [`smaller=${exactKey(snapshot.smallerAngleDeg)}`],
      verifierTrace: [`cycleSmaller=${exactKey(independentAngle)}`],
      contractEvidence: contract("CLASSIFICATION", "CP002_EXACT_RELATION_CLASSIFICATION_ORACLE", [time, "coincident", "opposite", "right angle"]),
    };
  }

  const hour = input.rng.int(1, 12);
  const minute = input.rng.int(1, 59);
  const second = input.rng.pick([0, 5, 10, 15, 20, 30, 40, 45, 50, 55] as const);

  if (input.taskId === "COMPARE_ANGLES_AT_TWO_TIMES") {
    const first = { hour, minute, second: 0 };
    const shiftMinutes = input.rng.pick([5, 10, 15, 20, 25, 30] as const);
    const secondTime = addClockSecondsExact(first, shiftMinutes * 60);
    const firstCanonical = hourMinuteAngleSnapshotExact(first).smallerAngleDeg;
    const secondCanonical = hourMinuteAngleSnapshotExact(secondTime).smallerAngleDeg;
    const canonical = absoluteRational(subtractRationals(firstCanonical, secondCanonical));
    const firstIndependent = angleFromCycle(first, "SMALLER");
    const secondIndependent = angleFromCycle(secondTime, "SMALLER");
    const verifier = absoluteRational(subtractRationals(firstIndependent, secondIndependent));
    const firstText = `${hour}:${minute.toString().padStart(2, "0")}`;
    const secondText = formatClockTimeFromSeconds(addRationals(clockSeconds(hour, minute), shiftMinutes * 60));
    const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical), "ANGLE_DIFFERENCE");
    const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier), "ANGLE_DIFFERENCE");
    return {
      taskId: input.taskId,
      stem: `What is the absolute difference between the smaller angles at ${firstText} and ${secondText}?`,
      scenario: { firstTime: firstText, secondTime: secondText, shiftMinutes },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("ANGLE", addRationals(firstCanonical, secondCanonical), formatAngle(addRationals(firstCanonical, secondCanonical)), "ANGLE_DIFFERENCE"), reasonCode: "ANGLES_ADDED", reason: "This adds the two angles instead of taking their absolute difference." },
        { answer: rationalAnswer("ANGLE", firstCanonical, formatAngle(firstCanonical), "ANGLE_DIFFERENCE"), reasonCode: "FIRST_ANGLE_ONLY", reason: "This reports only the first angle." },
        { answer: rationalAnswer("ANGLE", secondCanonical, formatAngle(secondCanonical), "ANGLE_DIFFERENCE"), reasonCode: "SECOND_ANGLE_ONLY", reason: "This reports only the second angle." },
      ],
      explanation: {
        given: `Times ${firstText} and ${secondText}.`,
        rule: "Find each smaller angle independently, then take the absolute difference.",
        working: [`First angle = ${formatAngle(firstCanonical)}.`, `Second angle = ${formatAngle(secondCanonical)}.`, `Difference = ${answer.display}.`],
        validityCheck: "Independent cycle-derived hand positions give the same two angles and difference.",
        closestTrap: "Adding the two angles does not answer a difference question.",
        answer: answer.display,
      },
      canonicalTrace: [`first=${exactKey(firstCanonical)}`, `second=${exactKey(secondCanonical)}`, `difference=${exactKey(canonical)}`],
      verifierTrace: [`cycleFirst=${exactKey(firstIndependent)}`, `cycleSecond=${exactKey(secondIndependent)}`, `difference=${exactKey(verifier)}`],
      contractEvidence: contract("ANGLE", "CP002_TWO_TIME_ANGLE_DIFFERENCE_ORACLE", [firstText, secondText, "absolute difference"]),
    };
  }

  if (input.taskId === "ANGLE_INVOLVING_SECOND_HAND") {
    const time = { hour, minute, second };
    const canonicalAngles = clockTimeToHandAnglesExact(time);
    const independentAngles = clockTimeToHandAnglesByCycleExact(time);
    const pair = input.rng.pick(["SECOND_MINUTE", "SECOND_HOUR"] as const);
    const canonicalOther = pair === "SECOND_MINUTE" ? canonicalAngles.minuteAngleDeg : canonicalAngles.hourAngleDeg;
    const independentOther = pair === "SECOND_MINUTE" ? independentAngles.minuteAngleDeg : independentAngles.hourAngleDeg;
    const canonical = smallerSeparationExact(canonicalAngles.secondAngleDeg, canonicalOther);
    const verifier = smallerSeparationExact(independentAngles.secondAngleDeg, independentOther);
    const timeText = `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
    const otherName = pair === "SECOND_MINUTE" ? "minute hand" : "hour hand";
    const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
    const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
    return {
      taskId: input.taskId,
      stem: `What is the smaller angle between the second hand and the ${otherName} at ${timeText}?`,
      scenario: { time: timeText, handPair: pair },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("ANGLE", subtractRationals(360, canonical), formatAngle(subtractRationals(360, canonical))), reasonCode: "REFLEX_INSTEAD_OF_SMALLER", reason: "This selects the reflex separation instead of the smaller angle." },
        { answer: rationalAnswer("ANGLE", canonicalAngles.secondAngleDeg, formatAngle(canonicalAngles.secondAngleDeg)), reasonCode: "SECOND_HAND_POSITION_ONLY", reason: "This gives the second hand's direction from 12 rather than its separation from the other hand." },
        { answer: rationalAnswer("ANGLE", canonicalOther, formatAngle(canonicalOther)), reasonCode: "OTHER_HAND_POSITION_ONLY", reason: "This gives the other hand's direction from 12 rather than the angle between the hands." },
      ],
      explanation: {
        given: `Time ${timeText}; compare the second hand with the ${otherName}.`,
        rule: "Find both exact hand directions at second-level precision, then take the smaller circular separation.",
        working: [`Second hand = ${formatAngle(canonicalAngles.secondAngleDeg)}.`, `${otherName} = ${formatAngle(canonicalOther)}.`, `Smaller angle = ${answer.display}.`],
        validityCheck: "Independent cycle fractions for both hands give the same separation.",
        closestTrap: "A hand's position from 12 is not automatically the angle between two hands.",
        answer: answer.display,
      },
      canonicalTrace: [`second=${exactKey(canonicalAngles.secondAngleDeg)}`, `other=${exactKey(canonicalOther)}`, `smaller=${exactKey(canonical)}`],
      verifierTrace: [`cycleSecond=${exactKey(independentAngles.secondAngleDeg)}`, `cycleOther=${exactKey(independentOther)}`, `smaller=${exactKey(verifier)}`],
      contractEvidence: contract("ANGLE", "CP002_SECOND_HAND_ANGLE_ORACLE", [timeText, "second hand", otherName]),
    };
  }

  let target: { hour: number; minute: number; second?: ExactRational | number } = { hour, minute, second: 0 };
  let timeText = `${hour}:${minute.toString().padStart(2, "0")}`;
  let requested: "SMALLER" | "REFLEX" | "HOUR_TO_MINUTE" | "MINUTE_TO_HOUR" = "SMALLER";
  let stem: string;
  let visibleTokens: string[];

  if (input.taskId === "ANGLE_AT_TIME_WITH_SECONDS") {
    target = { hour, minute, second };
    timeText = `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
    stem = `What is the smaller angle between the hour and minute hands at ${timeText}?`;
    visibleTokens = [timeText, "smaller angle"];
  } else if (input.taskId === "ANGLE_AFTER_BEFORE_SHIFT") {
    const shiftMinutes = input.rng.pick([5, 10, 15, 20, 25, 30, 40, 45] as const);
    const sign = input.rng.pick([-1, 1] as const);
    const base = { hour, minute, second: 0 };
    target = addClockSecondsExact(base, sign * shiftMinutes * 60);
    const baseText = `${hour}:${minute.toString().padStart(2, "0")}`;
    timeText = formatClockTimeFromSeconds(addRationals(clockSeconds(hour, minute), sign * shiftMinutes * 60));
    stem = `What is the smaller angle between the hands ${shiftMinutes} minutes ${sign > 0 ? "after" : "before"} ${baseText}?`;
    visibleTokens = [`${shiftMinutes} minutes`, sign > 0 ? "after" : "before", baseText];
  } else if (input.taskId === "REFLEX_ANGLE_AT_TIME") {
    requested = "REFLEX";
    stem = `What is the reflex angle between the hands of a clock at ${timeText}?`;
    visibleTokens = [timeText, "reflex angle"];
  } else if (input.taskId === "DIRECTED_CLOCKWISE_SEPARATION") {
    const hourToMinute = input.rng.pick([true, false] as const);
    requested = hourToMinute ? "HOUR_TO_MINUTE" : "MINUTE_TO_HOUR";
    const directionText = hourToMinute ? "hour hand to the minute hand" : "minute hand to the hour hand";
    stem = `At ${timeText}, what is the clockwise angle from the ${directionText}?`;
    visibleTokens = [timeText, "clockwise angle", directionText];
  } else {
    stem = `What is the smaller angle between the hands of a clock at ${timeText}?`;
    visibleTokens = [timeText, "smaller angle"];
  }

  const snapshot = hourMinuteAngleSnapshotExact(target);
  const canonical = requested === "REFLEX"
    ? snapshot.reflexAngleDeg
    : requested === "HOUR_TO_MINUTE"
      ? snapshot.clockwiseMinuteFromHourDeg
      : requested === "MINUTE_TO_HOUR"
        ? snapshot.clockwiseHourFromMinuteDeg
        : snapshot.smallerAngleDeg;
  const verifier = angleFromCycle(target, requested);
  const answer = rationalAnswer("ANGLE", canonical, formatAngle(canonical));
  const verifierAnswer = rationalAnswer("ANGLE", verifier, formatAngle(verifier));
  const snappedHour = exactRational((target.hour % 12) * 30);
  const snappedDifference = smallerSeparationExact(snappedHour, snapshot.handAngles.minuteAngleDeg);
  const complement = compareRationals(canonical, 0) === 0 ? exactRational(180) : subtractRationals(360, canonical);
  return {
    taskId: input.taskId,
    stem,
    scenario: {
      renderedTime: timeText,
      exactTime: `${target.hour}:${target.minute}:${exactKey(typeof target.second === "number" ? exactRational(target.second) : target.second)}`,
      requested,
    },
    answer,
    verifierAnswer,
    distractors: [
      { answer: rationalAnswer("ANGLE", snappedDifference, formatAngle(snappedDifference)), reasonCode: "HOUR_HAND_SNAPPED_TO_HOUR_MARK", reason: "This keeps the hour hand fixed on the hour numeral instead of moving continuously." },
      { answer: rationalAnswer("ANGLE", complement, formatAngle(complement)), reasonCode: requested === "REFLEX" ? "SMALLER_INSTEAD_OF_REFLEX" : "COMPLEMENT_OR_REVERSE_DIRECTION", reason: "This selects the complementary angle or reverses the requested direction." },
      { answer: rationalAnswer("ANGLE", snapshot.handAngles.minuteAngleDeg, formatAngle(snapshot.handAngles.minuteAngleDeg)), reasonCode: "MINUTE_HAND_POSITION_USED_AS_SEPARATION", reason: "This reports the minute hand's direction from 12 rather than the angle between the hands." },
    ],
    explanation: {
      given: `Required clock time ${timeText}.`,
      rule: "Find exact continuous hand directions, then apply the requested smaller, reflex or directed-angle contract.",
      working: [`Hour hand = ${formatAngle(snapshot.handAngles.hourAngleDeg)}.`, `Minute hand = ${formatAngle(snapshot.handAngles.minuteAngleDeg)}.`, `Required angle = ${answer.display}.`],
      validityCheck: "An independent elapsed-cycle calculation gives the same hand directions and answer.",
      closestTrap: "The hour hand moves continuously with minutes and seconds; it is not fixed on the hour numeral.",
      answer: answer.display,
    },
    canonicalTrace: [`hour=${exactKey(snapshot.handAngles.hourAngleDeg)}`, `minute=${exactKey(snapshot.handAngles.minuteAngleDeg)}`, `answer=${exactKey(canonical)}`],
    verifierTrace: [`cycleAnswer=${exactKey(verifier)}`],
    solveTraceExtras: { handAngles: { hour: exactKey(snapshot.handAngles.hourAngleDeg), minute: exactKey(snapshot.handAngles.minuteAngleDeg) } },
    contractEvidence: contract("ANGLE", `CP002_${requested}_ANGLE_ORACLE`, visibleTokens),
  };
}

export function solveDirectClockFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (CP001_TASKS.has(input.taskId)) return solveCp001(input);
  if (CP002_TASKS.has(input.taskId)) return solveCp002(input);
  return null;
}
