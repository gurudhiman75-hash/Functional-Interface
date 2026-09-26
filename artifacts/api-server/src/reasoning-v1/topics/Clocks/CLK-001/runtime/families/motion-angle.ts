import {
  CLOCK_HAND_RATE_DEG_PER_SECOND,
  addClockSecondsExact,
  addRationals,
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
  smallerSeparationExact,
  subtractRationals,
  totalSecondsToClockTimeExact,
  type ClockHand,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import {
  clockSeconds,
  formatAngle,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  localized,
  rationalAnswer,
  textAnswer,
  timeInput,
} from "../utils";

const MOTION_TASKS = new Set<ClockTaskId>([
  "HAND_HOUR_ROTATION",
  "HAND_MINUTE_ROTATION",
  "HAND_SECOND_ROTATION",
  "HAND_DURATION_FROM_ANGLE",
  "HAND_REVOLUTIONS",
  "MINUTE_SPACES_TO_ANGLE",
  "HAND_TIP_DISTANCE",
  "COMPARE_HAND_MOTION",
]);

const ANGLE_TASKS = new Set<ClockTaskId>([
  "SMALLER_ANGLE_AT_TIME",
  "REFLEX_ANGLE_AT_TIME",
  "DIRECTED_CLOCKWISE_SEPARATION",
  "ANGLE_AT_TIME_WITH_SECONDS",
  "ANGLE_AFTER_BEFORE_SHIFT",
  "CLASSIFY_HAND_RELATION",
  "COMPARE_ANGLES_AT_TWO_TIMES",
  "ANGLE_INVOLVING_SECOND_HAND",
]);

function handName(hand: ClockHand, locale: ClockFamilySolverInput["locale"]): string {
  const names = {
    HOUR: { en: "hour hand", hi: "घंटे की सुई", pa: "ਘੰਟੇ ਵਾਲੀ ਸੂਈ" },
    MINUTE: { en: "minute hand", hi: "मिनट की सुई", pa: "ਮਿੰਟ ਵਾਲੀ ਸੂਈ" },
    SECOND: { en: "second hand", hi: "सेकंड की सुई", pa: "ਸਕਿੰਟ ਵਾਲੀ ਸੂਈ" },
  } as const;
  return localized(locale, names[hand]);
}

function movementDistractors(
  correct: ExactRational,
  hand: ClockHand,
  durationSeconds: ExactRational,
) {
  const otherHands = (["HOUR", "MINUTE", "SECOND"] as const).filter((value) => value !== hand);
  return [
    {
      answer: rationalAnswer("ANGLE", handMovementDegreesExact(otherHands[0]!, durationSeconds), formatAngle(handMovementDegreesExact(otherHands[0]!, durationSeconds))),
      reasonCode: "WRONG_HAND_RATE",
      reason: "This uses another hand's angular rate for the stated duration.",
    },
    {
      answer: rationalAnswer("ANGLE", moduloRational(correct, 360), formatAngle(moduloRational(correct, 360))),
      reasonCode: "FULL_REVOLUTIONS_NOT_RETAINED",
      reason: "This keeps only the final dial position although the question asks for total rotation.",
    },
    {
      answer: rationalAnswer("ANGLE", multiplyRationals(correct, 2), formatAngle(multiplyRationals(correct, 2))),
      reasonCode: "DURATION_DOUBLED",
      reason: "This doubles the stated duration before applying the correct hand rate.",
    },
    {
      answer: rationalAnswer("ANGLE", divideRationals(correct, 2), formatAngle(divideRationals(correct, 2))),
      reasonCode: "DURATION_HALVED",
      reason: "This uses only half of the stated duration.",
    },
  ];
}

function solveMotion(input: ClockFamilySolverInput): SolvedClockPrototype {
  const { taskId, locale, rng } = input;
  const durationMinutes = rng.pick([5, 10, 12, 15, 20, 24, 30, 40, 45, 60, 90, 120] as const);
  const durationSeconds = exactRational(durationMinutes * 60);

  if (taskId === "HAND_HOUR_ROTATION" || taskId === "HAND_MINUTE_ROTATION" || taskId === "HAND_SECOND_ROTATION") {
    const hand: ClockHand = taskId === "HAND_HOUR_ROTATION"
      ? "HOUR"
      : taskId === "HAND_MINUTE_ROTATION"
        ? "MINUTE"
        : "SECOND";
    const movement = handMovementDegreesExact(hand, durationSeconds);
    const answer = rationalAnswer("ANGLE", movement, formatAngle(movement));
    return {
      taskId,
      stem: localized(locale, {
        en: `Through how many degrees does the ${handName(hand, "en-IN")} rotate in ${durationMinutes} minutes?`,
        hi: `${durationMinutes} मिनट में ${handName(hand, "hi-IN")} कितने अंश घूमती है?`,
        pa: `${durationMinutes} ਮਿੰਟਾਂ ਵਿੱਚ ${handName(hand, "pa-IN")} ਕਿੰਨੇ ਡਿਗਰੀ ਘੁੰਮਦੀ ਹੈ?`,
      }),
      scenario: { hand, durationMinutes },
      answer,
      distractors: movementDistractors(movement, hand, durationSeconds),
      explanation: {
        given: localized(locale, {
          en: `${handName(hand, "en-IN")} for ${durationMinutes} minutes.`,
          hi: `${durationMinutes} मिनट के लिए ${handName(hand, "hi-IN")}।`,
          pa: `${durationMinutes} ਮਿੰਟਾਂ ਲਈ ${handName(hand, "pa-IN")}।`,
        }),
        rule: `${hand} rate = ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} per second.`,
        working: [`Movement = rate × time = ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} × ${durationMinutes * 60} = ${formatAngle(movement)}.`],
        validityCheck: "Total rotation is retained; complete revolutions are not discarded.",
        closestTrap: "Using another hand's rate or reducing the answer modulo 360 changes total movement.",
        answer: answer.display,
      },
      canonicalTrace: [`rate=${CLOCK_HAND_RATE_DEG_PER_SECOND[hand].numerator}/${CLOCK_HAND_RATE_DEG_PER_SECOND[hand].denominator}`, `duration=${durationSeconds.numerator}`, `movement=${movement.numerator}/${movement.denominator}`],
      verifierTrace: [`revolutions=${handRevolutionsExact(hand, durationSeconds).numerator}/${handRevolutionsExact(hand, durationSeconds).denominator}`, `revolutions×360=${movement.numerator}/${movement.denominator}`],
    };
  }

  if (taskId === "HAND_DURATION_FROM_ANGLE") {
    const hand = rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const sourceDuration = exactRational(rng.pick([30, 60, 90, 120, 180, 240, 300, 600, 900] as const));
    const movement = handMovementDegreesExact(hand, sourceDuration);
    const duration = durationForHandMovementExact(hand, movement);
    const answer = rationalAnswer("DURATION", duration, formatDurationSeconds(duration));
    return {
      taskId,
      stem: localized(locale, {
        en: `How long will the ${handName(hand, "en-IN")} take to move through ${formatAngle(movement)}?`,
        hi: `${handName(hand, "hi-IN")} को ${formatAngle(movement)} घूमने में कितना समय लगेगा?`,
        pa: `${handName(hand, "pa-IN")} ਨੂੰ ${formatAngle(movement)} ਘੁੰਮਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      }),
      scenario: { hand, movementDegrees: formatAngle(movement) },
      answer,
      distractors: [
        { answer: rationalAnswer("DURATION", multiplyRationals(duration, 2), formatDurationSeconds(multiplyRationals(duration, 2))), reasonCode: "RATE_HALVED", reason: "This treats the hand as moving at half its actual angular rate." },
        { answer: rationalAnswer("DURATION", divideRationals(duration, 2), formatDurationSeconds(divideRationals(duration, 2))), reasonCode: "RATE_DOUBLED", reason: "This treats the hand as moving twice as fast." },
        { answer: rationalAnswer("DURATION", movement, formatDurationSeconds(movement)), reasonCode: "ANGLE_COPIED_AS_TIME", reason: "This copies the numerical angle as a duration without dividing by the hand rate." },
      ],
      explanation: {
        given: `${hand} hand movement = ${formatAngle(movement)}.`,
        rule: "Time = angular movement ÷ angular rate.",
        working: [`Time = ${formatAngle(movement)} ÷ ${formatAngle(CLOCK_HAND_RATE_DEG_PER_SECOND[hand])} per second = ${formatDurationSeconds(duration)}.`],
        validityCheck: `Substitution back into rate × time returns ${formatAngle(movement)}.`,
        closestTrap: "The angle value itself is not a time value.",
        answer: answer.display,
      },
      canonicalTrace: [`movement/rate=${duration.numerator}/${duration.denominator}`],
      verifierTrace: [`rate×duration=${handMovementDegreesExact(hand, duration).numerator}/${handMovementDegreesExact(hand, duration).denominator}`],
    };
  }

  if (taskId === "HAND_REVOLUTIONS") {
    const hand = rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const hours = rng.pick([1, 2, 3, 4, 6, 8, 12, 24] as const);
    const seconds = exactRational(hours * 3_600);
    const revolutions = handRevolutionsExact(hand, seconds);
    const answer = rationalAnswer("COUNT", revolutions, formatExactCount(revolutions));
    return {
      taskId,
      stem: localized(locale, {
        en: `How many revolutions does the ${handName(hand, "en-IN")} complete in ${hours} hours?`,
        hi: `${hours} घंटों में ${handName(hand, "hi-IN")} कितने चक्कर पूरे करती है?`,
        pa: `${hours} ਘੰਟਿਆਂ ਵਿੱਚ ${handName(hand, "pa-IN")} ਕਿੰਨੇ ਚੱਕਰ ਪੂਰੇ ਕਰਦੀ ਹੈ?`,
      }),
      scenario: { hand, hours },
      answer,
      distractors: [
        { answer: rationalAnswer("COUNT", multiplyRationals(revolutions, 2), formatExactCount(multiplyRationals(revolutions, 2))), reasonCode: "REVOLUTIONS_DOUBLED", reason: "This doubles the number of complete turns." },
        { answer: rationalAnswer("COUNT", divideRationals(revolutions, 2), formatExactCount(divideRationals(revolutions, 2))), reasonCode: "REVOLUTIONS_HALVED", reason: "This counts only half the completed turns." },
        { answer: rationalAnswer("COUNT", handMovementDegreesExact(hand, seconds), formatExactCount(handMovementDegreesExact(hand, seconds))), reasonCode: "DEGREES_TREATED_AS_REVOLUTIONS", reason: "This reports degrees moved as the number of revolutions." },
      ],
      explanation: {
        given: `${hand} hand, ${hours} hours.`,
        rule: "Revolutions = total angular movement ÷ 360°.",
        working: [`Total movement = ${formatAngle(handMovementDegreesExact(hand, seconds))}.`, `Revolutions = ${formatAngle(handMovementDegreesExact(hand, seconds))} ÷ 360° = ${formatExactCount(revolutions)}.`],
        validityCheck: "Multiplying the revolution count by 360° returns the total movement.",
        closestTrap: "Do not report the movement in degrees as a revolution count.",
        answer: answer.display,
      },
      canonicalTrace: [`revolutions=${revolutions.numerator}/${revolutions.denominator}`],
      verifierTrace: [`movement/360=${divideRationals(handMovementDegreesExact(hand, seconds), 360).numerator}/${divideRationals(handMovementDegreesExact(hand, seconds), 360).denominator}`],
    };
  }

  if (taskId === "MINUTE_SPACES_TO_ANGLE") {
    const spaces = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25] as const);
    const degrees = minuteSpacesToDegreesExact(spaces);
    const answer = rationalAnswer("ANGLE", degrees, formatAngle(degrees));
    return {
      taskId,
      stem: localized(locale, {
        en: `What angular separation is represented by ${spaces} minute spaces on a clock dial?`,
        hi: `घड़ी के डायल पर ${spaces} मिनट-खानों का कोणीय अंतर कितना है?`,
        pa: `ਘੜੀ ਦੇ ਡਾਇਲ ਉੱਤੇ ${spaces} ਮਿੰਟ-ਖਾਨਿਆਂ ਦਾ ਕੋਣੀ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
      }),
      scenario: { minuteSpaces: spaces },
      answer,
      distractors: [
        { answer: rationalAnswer("ANGLE", exactRational(spaces * 5), formatAngle(spaces * 5)), reasonCode: "MINUTE_SPACE_AS_FIVE_DEGREES", reason: "This confuses five minute marks per hour-space with five degrees per minute-space." },
        { answer: rationalAnswer("ANGLE", exactRational(spaces * 30), formatAngle(spaces * 30)), reasonCode: "HOUR_SPACE_RATE_USED", reason: "This treats every minute-space as a 30-degree hour-space." },
        { answer: rationalAnswer("ANGLE", exactRational(spaces), formatAngle(spaces)), reasonCode: "SPACES_COPIED_AS_DEGREES", reason: "This copies the number of spaces without converting each space to 6 degrees." },
      ],
      explanation: {
        given: `${spaces} minute spaces.`,
        rule: "One minute-space = 360° ÷ 60 = 6°.",
        working: [`${spaces} × 6° = ${formatAngle(degrees)}.`],
        validityCheck: `Converting back gives ${formatExactCount(degreesToMinuteSpacesExact(degrees))} minute spaces.`,
        closestTrap: "An hour-space is 30°, but a minute-space is 6°.",
        answer: answer.display,
      },
      canonicalTrace: [`spaces×6=${degrees.numerator}/${degrees.denominator}`],
      verifierTrace: [`degrees/6=${degreesToMinuteSpacesExact(degrees).numerator}/${degreesToMinuteSpacesExact(degrees).denominator}`],
    };
  }

  if (taskId === "HAND_TIP_DISTANCE") {
    const radius = rng.pick([4, 5, 6, 7, 8, 10, 12] as const);
    const hand = rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
    const movement = rng.pick([30, 45, 60, 90, 120, 180, 270, 360] as const);
    const coefficient = handTipDistancePiCoefficientExact(radius, movement);
    const answer = rationalAnswer("DISTANCE_PI", coefficient, `${formatExactCount(coefficient)}π cm`, "DISTANCE_PI_COEFFICIENT");
    return {
      taskId,
      stem: localized(locale, {
        en: `The ${handName(hand, "en-IN")} is ${radius} cm long. What distance does its tip travel while the hand turns through ${movement}°? Give the answer in terms of π.`,
        hi: `${handName(hand, "hi-IN")} की लंबाई ${radius} सेमी है। ${movement}° घूमने पर उसकी नोक कितनी दूरी तय करती है? उत्तर π के रूप में दीजिए।`,
        pa: `${handName(hand, "pa-IN")} ਦੀ ਲੰਬਾਈ ${radius} ਸੈਮੀ ਹੈ। ${movement}° ਘੁੰਮਣ ਉੱਤੇ ਇਸ ਦੀ ਨੋਕ ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰਦੀ ਹੈ? ਉੱਤਰ π ਦੇ ਰੂਪ ਵਿੱਚ ਦਿਓ।`,
      }),
      scenario: { hand, radiusCm: radius, movementDegrees: movement },
      answer,
      distractors: [
        { answer: rationalAnswer("DISTANCE_PI", divideRationals(coefficient, 2), `${formatExactCount(divideRationals(coefficient, 2))}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "DIAMETER_FACTOR_MISSED", reason: "This loses the factor 2 in the circumference 2πr." },
        { answer: rationalAnswer("DISTANCE_PI", multiplyRationals(coefficient, 2), `${formatExactCount(multiplyRationals(coefficient, 2))}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "DIAMETER_COUNTED_TWICE", reason: "This applies the circumference factor 2 twice." },
        { answer: rationalAnswer("DISTANCE_PI", exactRational(radius * movement), `${radius * movement}π cm`, "DISTANCE_PI_COEFFICIENT"), reasonCode: "ANGLE_NOT_DIVIDED_BY_180", reason: "This multiplies radius and angle but does not convert degrees into a fraction of a full circle." },
      ],
      explanation: {
        given: `Radius = ${radius} cm and rotation = ${movement}°.`,
        rule: "Arc length = (θ/360) × 2πr = rθπ/180.",
        working: [`Distance = ${radius} × ${movement}π ÷ 180 = ${answer.display}.`],
        validityCheck: "The result is kept as an exact coefficient of π; no decimal value of π is used as answer authority.",
        closestTrap: "Forgetting the 360° fraction or the factor 2 changes the arc length.",
        answer: answer.display,
      },
      canonicalTrace: [`coefficient=r×theta/180=${coefficient.numerator}/${coefficient.denominator}`],
      verifierTrace: [`revolutions=${exactRational(movement, 360).numerator}/${exactRational(movement, 360).denominator}`, `2r×revolutions=${coefficient.numerator}/${coefficient.denominator}`],
    };
  }

  const leftHand = rng.pick(["HOUR", "MINUTE", "SECOND"] as const);
  const rightHand = rng.pick((["HOUR", "MINUTE", "SECOND"] as const).filter((hand) => hand !== leftHand));
  const comparison = compareHandMovementsExact(leftHand, rightHand, durationSeconds);
  const difference = comparison.difference.numerator < 0n
    ? exactRational(-comparison.difference.numerator, comparison.difference.denominator)
    : comparison.difference;
  const answer = rationalAnswer("ANGLE", difference, formatAngle(difference), "MOTION_DIFFERENCE");
  return {
    taskId,
    stem: localized(locale, {
      en: `By how many degrees do the total movements of the ${handName(leftHand, "en-IN")} and ${handName(rightHand, "en-IN")} differ in ${durationMinutes} minutes?`,
      hi: `${durationMinutes} मिनट में ${handName(leftHand, "hi-IN")} और ${handName(rightHand, "hi-IN")} की कुल घूर्णन दूरी में कितने अंश का अंतर है?`,
      pa: `${durationMinutes} ਮਿੰਟਾਂ ਵਿੱਚ ${handName(leftHand, "pa-IN")} ਅਤੇ ${handName(rightHand, "pa-IN")} ਦੀ ਕੁੱਲ ਘੁੰਮਣ ਦੂਰੀ ਵਿੱਚ ਕਿੰਨੇ ਡਿਗਰੀ ਦਾ ਅੰਤਰ ਹੈ?`,
    }),
    scenario: { leftHand, rightHand, durationMinutes },
    answer,
    distractors: [
      { answer: rationalAnswer("ANGLE", addRationals(comparison.left, comparison.right), formatAngle(addRationals(comparison.left, comparison.right)), "MOTION_DIFFERENCE"), reasonCode: "MOVEMENTS_ADDED", reason: "This adds the two movements instead of taking their difference." },
      { answer: rationalAnswer("ANGLE", comparison.left, formatAngle(comparison.left), "LEFT_HAND_MOVEMENT"), reasonCode: "ONE_HAND_MOVEMENT_REPORTED", reason: "This reports only one hand's movement instead of the difference between the two movements." },
      { answer: rationalAnswer("ANGLE", moduloRational(difference, 360), formatAngle(moduloRational(difference, 360)), "MOTION_DIFFERENCE"), reasonCode: "TOTAL_MOVEMENT_REDUCED_MODULO_360", reason: "This compares final dial positions rather than total movements." },
    ],
    explanation: {
      given: `${leftHand} and ${rightHand} hands for ${durationMinutes} minutes.`,
      rule: "Compute each total movement from its own rate, then subtract.",
      working: [`${leftHand}: ${formatAngle(comparison.left)}.`, `${rightHand}: ${formatAngle(comparison.right)}.`, `Difference = ${formatAngle(difference)}.`],
      validityCheck: "The comparison uses total movement, not only final positions modulo 360°.",
      closestTrap: "Adding the movements or giving their ratio answers a different question.",
      answer: answer.display,
    },
    canonicalTrace: [`left=${comparison.left.numerator}/${comparison.left.denominator}`, `right=${comparison.right.numerator}/${comparison.right.denominator}`, `difference=${difference.numerator}/${difference.denominator}`],
    verifierTrace: [`rateDifference×time=${difference.numerator}/${difference.denominator}`],
  };
}

function formatExactCount(value: ExactRational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

function solveAngle(input: ClockFamilySolverInput): SolvedClockPrototype {
  const { taskId, locale, rng } = input;
  const hour = rng.int(1, 12);
  const minute = rng.int(1, 59);
  const second = rng.pick([0, 5, 10, 15, 20, 30, 40, 45, 50, 55] as const);
  const baseTime = timeInput(hour, minute, second);
  const baseSeconds = clockSeconds(hour, minute, second);

  if (taskId === "CLASSIFY_HAND_RELATION") {
    const selected = rng.pick([
      { timeSeconds: exactRational(0), label: "COINCIDE", display: { en: "coincide", hi: "एक-दूसरे पर होती हैं", pa: "ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਹੁੰਦੀਆਂ ਹਨ" } },
      { timeSeconds: exactRational(21_600, 11), label: "OPPOSITE", display: { en: "are opposite", hi: "विपरीत दिशा में होती हैं", pa: "ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਹੁੰਦੀਆਂ ਹਨ" } },
      { timeSeconds: exactRational(10_800, 11), label: "RIGHT_ANGLE", display: { en: "form a right angle", hi: "समकोण बनाती हैं", pa: "ਸਮਕੋਣ ਬਣਾਉਂਦੀਆਂ ਹਨ" } },
      { timeSeconds: clockSeconds(2, 20), label: "OTHER", display: { en: "form none of these special relations", hi: "इनमें से कोई विशेष स्थिति नहीं बनातीं", pa: "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵਿਸ਼ੇਸ਼ ਸਥਿਤੀ ਨਹੀਂ ਬਣਾਉਂਦੀਆਂ" } },
    ] as const);
    const timeText = formatClockTimeFromSeconds(selected.timeSeconds, { includeSeconds: true });
    const answer = textAnswer("CLASSIFICATION", selected.label, localized(locale, selected.display));
    const alternatives = [
      ["COINCIDE", { en: "coincide", hi: "एक-दूसरे पर होती हैं", pa: "ਇੱਕ-ਦੂਜੇ ਉੱਤੇ ਹੁੰਦੀਆਂ ਹਨ" }],
      ["OPPOSITE", { en: "are opposite", hi: "विपरीत दिशा में होती हैं", pa: "ਵਿਰੁੱਧ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਹੁੰਦੀਆਂ ਹਨ" }],
      ["RIGHT_ANGLE", { en: "form a right angle", hi: "समकोण बनाती हैं", pa: "ਸਮਕੋਣ ਬਣਾਉਂਦੀਆਂ ਹਨ" }],
      ["OTHER", { en: "form none of these special relations", hi: "इनमें से कोई विशेष स्थिति नहीं बनातीं", pa: "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵਿਸ਼ੇਸ਼ ਸਥਿਤੀ ਨਹੀਂ ਬਣਾਉਂਦੀਆਂ" }],
    ] as const;
    const snapshot = hourMinuteAngleSnapshotExact(totalSecondsToInput(selected.timeSeconds));
    return {
      taskId,
      stem: localized(locale, {
        en: `At ${timeText}, how are the hour and minute hands positioned?`,
        hi: `${timeText} पर घंटे और मिनट की सुइयों की स्थिति क्या है?`,
        pa: `${timeText} ਵਜੇ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?`,
      }),
      scenario: { time: timeText },
      answer,
      distractors: alternatives.filter(([key]) => key !== selected.label).map(([key, display]) => ({
        answer: textAnswer("CLASSIFICATION", key, localized(locale, display)),
        reasonCode: `MISCLASSIFIED_AS_${key}`,
        reason: `This classification does not match the exact ${formatAngle(snapshot.smallerAngleDeg)} smaller angle.`,
      })),
      explanation: {
        given: `Time = ${timeText}.`,
        rule: "Compare the exact hour-hand and minute-hand directions.",
        working: [`Smaller angle = ${formatAngle(snapshot.smallerAngleDeg)}.`],
        validityCheck: `The exact modular separation determines the relation; no diagram estimate is used.`,
        closestTrap: "A near-special-looking position is not enough; the modular angle must be exact.",
        answer: answer.display,
      },
      canonicalTrace: [`smaller=${snapshot.smallerAngleDeg.numerator}/${snapshot.smallerAngleDeg.denominator}`],
      verifierTrace: [`relativePhase=${snapshot.clockwiseMinuteFromHourDeg.numerator}/${snapshot.clockwiseMinuteFromHourDeg.denominator}`],
      solveTraceExtras: { handAngles: { hour: `${snapshot.handAngles.hourAngleDeg.numerator}/${snapshot.handAngles.hourAngleDeg.denominator}`, minute: `${snapshot.handAngles.minuteAngleDeg.numerator}/${snapshot.handAngles.minuteAngleDeg.denominator}` } },
    };
  }

  if (taskId === "COMPARE_ANGLES_AT_TWO_TIMES") {
    const secondMinute = (minute + rng.pick([5, 10, 15, 20, 25, 30] as const)) % 60;
    const secondHour = minute + 30 >= 60 ? (hour % 12) + 1 : hour;
    const first = hourMinuteAngleSnapshotExact(baseTime).smallerAngleDeg;
    const secondValue = hourMinuteAngleSnapshotExact(timeInput(secondHour, secondMinute)).smallerAngleDeg;
    const differenceRaw = subtractRationals(first, secondValue);
    const difference = differenceRaw.numerator < 0n
      ? exactRational(-differenceRaw.numerator, differenceRaw.denominator)
      : differenceRaw;
    const answer = rationalAnswer("ANGLE", difference, formatAngle(difference), "ANGLE_DIFFERENCE");
    return {
      taskId,
      stem: localized(locale, {
        en: `What is the absolute difference between the smaller angles at ${hour}:${minute.toString().padStart(2, "0")} and ${secondHour}:${secondMinute.toString().padStart(2, "0")}?`,
        hi: `${hour}:${minute.toString().padStart(2, "0")} और ${secondHour}:${secondMinute.toString().padStart(2, "0")} पर बने छोटे कोणों का परिमाणात्मक अंतर कितना है?`,
        pa: `${hour}:${minute.toString().padStart(2, "0")} ਅਤੇ ${secondHour}:${secondMinute.toString().padStart(2, "0")} ਉੱਤੇ ਬਣੇ ਛੋਟੇ ਕੋਣਾਂ ਦਾ ਪਰਮ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
      }),
      scenario: { firstTime: `${hour}:${minute}`, secondTime: `${secondHour}:${secondMinute}` },
      answer,
      distractors: [
        { answer: rationalAnswer("ANGLE", addRationals(first, secondValue), formatAngle(addRationals(first, secondValue)), "ANGLE_DIFFERENCE"), reasonCode: "ANGLES_ADDED", reason: "This adds the two angles instead of finding their absolute difference." },
        { answer: rationalAnswer("ANGLE", first, formatAngle(first), "ANGLE_DIFFERENCE"), reasonCode: "FIRST_ANGLE_ONLY", reason: "This reports only the first angle." },
        { answer: rationalAnswer("ANGLE", secondValue, formatAngle(secondValue), "ANGLE_DIFFERENCE"), reasonCode: "SECOND_ANGLE_ONLY", reason: "This reports only the second angle." },
      ],
      explanation: {
        given: `Two stated times.`,
        rule: "Find each smaller angle independently, then take the absolute difference.",
        working: [`First angle = ${formatAngle(first)}.`, `Second angle = ${formatAngle(secondValue)}.`, `Absolute difference = ${formatAngle(difference)}.`],
        validityCheck: "Both hour hands are treated as moving continuously.",
        closestTrap: "Adding the two angles or copying one angle does not answer the comparison.",
        answer: answer.display,
      },
      canonicalTrace: [`first=${first.numerator}/${first.denominator}`, `second=${secondValue.numerator}/${secondValue.denominator}`, `difference=${difference.numerator}/${difference.denominator}`],
      verifierTrace: [`recomputed from exact hand positions`],
    };
  }

  if (taskId === "ANGLE_INVOLVING_SECOND_HAND") {
    const angles = clockTimeToHandAnglesExact(baseTime);
    const pair = rng.pick(["SECOND_MINUTE", "SECOND_HOUR"] as const);
    const left = angles.secondAngleDeg;
    const right = pair === "SECOND_MINUTE" ? angles.minuteAngleDeg : angles.hourAngleDeg;
    const smaller = smallerSeparationExact(left, right);
    const answer = rationalAnswer("ANGLE", smaller, formatAngle(smaller));
    return {
      taskId,
      stem: localized(locale, {
        en: `What is the smaller angle between the second hand and the ${pair === "SECOND_MINUTE" ? "minute" : "hour"} hand at ${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}?`,
        hi: `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} पर सेकंड की सुई और ${pair === "SECOND_MINUTE" ? "मिनट" : "घंटे"} की सुई के बीच छोटा कोण कितना है?`,
        pa: `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} ਵਜੇ ਸਕਿੰਟ ਵਾਲੀ ਸੂਈ ਅਤੇ ${pair === "SECOND_MINUTE" ? "ਮਿੰਟ" : "ਘੰਟੇ"} ਵਾਲੀ ਸੂਈ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
      }),
      scenario: { time: `${hour}:${minute}:${second}`, pair },
      answer,
      distractors: [
        { answer: rationalAnswer("ANGLE", subtractRationals(360, smaller), formatAngle(subtractRationals(360, smaller))), reasonCode: "REFLEX_INSTEAD_OF_SMALLER", reason: "This selects the reflex separation instead of the requested smaller angle." },
        { answer: rationalAnswer("ANGLE", angles.secondAngleDeg, formatAngle(angles.secondAngleDeg)), reasonCode: "SECOND_HAND_POSITION_ONLY", reason: "This reports the second hand's position from 12 rather than its separation from the other hand." },
        { answer: rationalAnswer("ANGLE", right, formatAngle(right)), reasonCode: "OTHER_HAND_POSITION_ONLY", reason: "This reports the other hand's position from 12 rather than the angle between the hands." },
      ],
      explanation: {
        given: `Time = ${hour}:${minute}:${second}.`,
        rule: "Second hand = 6° per second; compare its exact direction with the requested hand.",
        working: [`Second-hand angle = ${formatAngle(angles.secondAngleDeg)}.`, `Other-hand angle = ${formatAngle(right)}.`, `Smaller separation = ${formatAngle(smaller)}.`],
        validityCheck: "The hour and minute hands include their continuous second-level movement.",
        closestTrap: "A hand's position from 12 is not automatically the angle between two hands.",
        answer: answer.display,
      },
      canonicalTrace: [`left=${left.numerator}/${left.denominator}`, `right=${right.numerator}/${right.denominator}`, `smaller=${smaller.numerator}/${smaller.denominator}`],
      verifierTrace: [`complement=${subtractRationals(360, smaller).numerator}/${subtractRationals(360, smaller).denominator}`],
      solveTraceExtras: { handAngles: { hour: `${angles.hourAngleDeg.numerator}/${angles.hourAngleDeg.denominator}`, minute: `${angles.minuteAngleDeg.numerator}/${angles.minuteAngleDeg.denominator}`, second: `${angles.secondAngleDeg.numerator}/${angles.secondAngleDeg.denominator}` } },
    };
  }

  let targetTime = baseTime;
  let targetSeconds = baseSeconds;
  let requested: "SMALLER" | "REFLEX" | "DIRECTED" = "SMALLER";
  let direction = "minute-from-hour";
  let stem: string;

  if (taskId === "ANGLE_AFTER_BEFORE_SHIFT") {
    const shiftMinutes = rng.pick([5, 10, 15, 20, 25, 30, 40, 45] as const);
    const sign = rng.pick([-1, 1] as const);
    targetTime = addClockSecondsExact(baseTime, sign * shiftMinutes * 60);
    targetSeconds = addRationals(baseSeconds, sign * shiftMinutes * 60);
    stem = localized(locale, {
      en: `What is the smaller angle between the hands ${shiftMinutes} minutes ${sign > 0 ? "after" : "before"} ${hour}:${minute.toString().padStart(2, "0")}?`,
      hi: `${hour}:${minute.toString().padStart(2, "0")} से ${shiftMinutes} मिनट ${sign > 0 ? "बाद" : "पहले"} घड़ी की सुइयों के बीच छोटा कोण कितना होगा?`,
      pa: `${hour}:${minute.toString().padStart(2, "0")} ਤੋਂ ${shiftMinutes} ਮਿੰਟ ${sign > 0 ? "ਬਾਅਦ" : "ਪਹਿਲਾਂ"} ਘੜੀ ਦੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    });
  } else if (taskId === "REFLEX_ANGLE_AT_TIME") {
    requested = "REFLEX";
    stem = localized(locale, {
      en: `What is the reflex angle between the hands of a clock at ${hour}:${minute.toString().padStart(2, "0")}?`,
      hi: `${hour}:${minute.toString().padStart(2, "0")} पर घड़ी की सुइयों के बीच प्रतिवर्ती कोण कितना है?`,
      pa: `${hour}:${minute.toString().padStart(2, "0")} ਵਜੇ ਘੜੀ ਦੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਪ੍ਰਤਿਵਰਤੀ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
    });
  } else if (taskId === "DIRECTED_CLOCKWISE_SEPARATION") {
    requested = "DIRECTED";
    direction = rng.pick(["minute-from-hour", "hour-from-minute"] as const);
    stem = localized(locale, {
      en: `At ${hour}:${minute.toString().padStart(2, "0")}, what is the clockwise angle from the ${direction === "minute-from-hour" ? "hour hand to the minute hand" : "minute hand to the hour hand"}?`,
      hi: `${hour}:${minute.toString().padStart(2, "0")} पर ${direction === "minute-from-hour" ? "घंटे की सुई से मिनट की सुई" : "मिनट की सुई से घंटे की सुई"} तक दक्षिणावर्त कोण कितना है?`,
      pa: `${hour}:${minute.toString().padStart(2, "0")} ਵਜੇ ${direction === "minute-from-hour" ? "ਘੰਟੇ ਵਾਲੀ ਸੂਈ ਤੋਂ ਮਿੰਟ ਵਾਲੀ ਸੂਈ" : "ਮਿੰਟ ਵਾਲੀ ਸੂਈ ਤੋਂ ਘੰਟੇ ਵਾਲੀ ਸੂਈ"} ਤੱਕ ਘੜੀਵਾਰ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
    });
  } else if (taskId === "ANGLE_AT_TIME_WITH_SECONDS") {
    stem = localized(locale, {
      en: `What is the smaller angle between the hour and minute hands at ${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}?`,
      hi: `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} पर घंटे और मिनट की सुइयों के बीच छोटा कोण कितना है?`,
      pa: `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} ਵਜੇ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
    });
  } else {
    targetTime = timeInput(hour, minute, 0);
    targetSeconds = clockSeconds(hour, minute);
    stem = localized(locale, {
      en: `What is the smaller angle between the hands of a clock at ${hour}:${minute.toString().padStart(2, "0")}?`,
      hi: `${hour}:${minute.toString().padStart(2, "0")} पर घड़ी की सुइयों के बीच छोटा कोण कितना है?`,
      pa: `${hour}:${minute.toString().padStart(2, "0")} ਵਜੇ ਘੜੀ ਦੀਆਂ ਸੂਈਆਂ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
    });
  }

  const snapshot = hourMinuteAngleSnapshotExact(targetTime);
  const correctValue = requested === "REFLEX"
    ? snapshot.reflexAngleDeg
    : requested === "DIRECTED"
      ? direction === "minute-from-hour"
        ? snapshot.clockwiseMinuteFromHourDeg
        : snapshot.clockwiseHourFromMinuteDeg
      : snapshot.smallerAngleDeg;
  const answer = rationalAnswer("ANGLE", correctValue, formatAngle(correctValue));
  const snappedHour = exactRational((targetTime.hour % 12) * 30);
  const snappedDifference = smallerSeparationExact(snappedHour, snapshot.handAngles.minuteAngleDeg);
  const plusTerms = moduloRational(addRationals(snapshot.handAngles.hourAngleDeg, snapshot.handAngles.minuteAngleDeg), 360);

  return {
    taskId,
    stem,
    scenario: {
      baseTime: `${hour}:${minute}:${second}`,
      targetTime: formatClockTimeFromSeconds(targetSeconds, { includeSeconds: true }),
      requested,
      direction,
    },
    answer,
    distractors: [
      { answer: rationalAnswer("ANGLE", snappedDifference, formatAngle(snappedDifference)), reasonCode: "HOUR_HAND_SNAPPED_TO_HOUR_MARK", reason: "This keeps the hour hand fixed on the hour numeral instead of moving it continuously." },
      { answer: rationalAnswer("ANGLE", subtractRationals(360, correctValue), formatAngle(subtractRationals(360, correctValue))), reasonCode: requested === "REFLEX" ? "SMALLER_INSTEAD_OF_REFLEX" : "REFLEX_OR_REVERSE_DIRECTION", reason: "This selects the complementary angle or reverses the requested direction." },
      { answer: rationalAnswer("ANGLE", plusTerms, formatAngle(plusTerms)), reasonCode: "USED_30H_PLUS_11M_OVER_2", reason: "This adds the hand positions instead of taking their directed or smaller separation." },
      { answer: rationalAnswer("ANGLE", snapshot.handAngles.minuteAngleDeg, formatAngle(snapshot.handAngles.minuteAngleDeg)), reasonCode: "USED_MINUTE_HAND_ONLY", reason: "This reports only the minute hand's position from 12." },
    ],
    explanation: {
      given: `Target time = ${formatClockTimeFromSeconds(targetSeconds, { includeSeconds: true })}.`,
      rule: "Hour angle = 30H + M/2 + S/120; minute angle = 6M + S/10.",
      working: [`Hour hand = ${formatAngle(snapshot.handAngles.hourAngleDeg)}.`, `Minute hand = ${formatAngle(snapshot.handAngles.minuteAngleDeg)}.`, `Required separation = ${formatAngle(correctValue)}.`],
      validityCheck: requested === "REFLEX"
        ? "The selected value lies in the reflex range and is the complement of the smaller angle."
        : requested === "DIRECTED"
          ? "The direction stated in the stem is preserved; the reverse direction is not substituted."
          : "The smaller of the two circular separations is selected.",
      closestTrap: "The hour hand advances continuously with minutes and seconds; snapping it to the numeral gives a false angle.",
      answer: answer.display,
    },
    canonicalTrace: [`hour=${snapshot.handAngles.hourAngleDeg.numerator}/${snapshot.handAngles.hourAngleDeg.denominator}`, `minute=${snapshot.handAngles.minuteAngleDeg.numerator}/${snapshot.handAngles.minuteAngleDeg.denominator}`, `answer=${correctValue.numerator}/${correctValue.denominator}`],
    verifierTrace: [`relative phase from elapsed seconds = ${snapshot.clockwiseMinuteFromHourDeg.numerator}/${snapshot.clockwiseMinuteFromHourDeg.denominator}`],
    solveTraceExtras: { handAngles: { hour: `${snapshot.handAngles.hourAngleDeg.numerator}/${snapshot.handAngles.hourAngleDeg.denominator}`, minute: `${snapshot.handAngles.minuteAngleDeg.numerator}/${snapshot.handAngles.minuteAngleDeg.denominator}` } },
  };
}

function totalSecondsToInput(seconds: ExactRational) {
  return totalSecondsToClockTimeExact(seconds);
}

export function solveMotionOrAnglePrototype(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (MOTION_TASKS.has(input.taskId)) {
    return solveMotion(input);
  }
  if (ANGLE_TASKS.has(input.taskId)) {
    return solveAngle(input);
  }
  return null;
}
