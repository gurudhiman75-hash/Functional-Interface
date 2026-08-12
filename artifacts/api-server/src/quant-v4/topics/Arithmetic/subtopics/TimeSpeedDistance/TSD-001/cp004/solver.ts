import { absRational, add, compare, divide, gcdBigInt, multiply, rational, subtract, toCanonicalString, type Rational } from "../foundation/rational";
import type { TsdCp004CanonicalState, TsdCp004SolveCertificate } from "./types";

const SIXTY = rational(60);

function minutesFromHours(hours: Rational): Rational {
  return multiply(hours, SIXTY);
}

function hoursFromMinutes(minutes: Rational): Rational {
  return divide(minutes, SIXTY);
}

function formatNumber(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const scaled10 = value.numerator * 10n;
  if (scaled10 % value.denominator === 0n) {
    return (Number(scaled10 / value.denominator) / 10).toString();
  }
  const scaled100 = value.numerator * 100n;
  if (scaled100 % value.denominator === 0n) {
    return (Number(scaled100 / value.denominator) / 100).toString();
  }
  const sign = value.numerator < 0n ? "-" : "";
  const n = value.numerator < 0n ? -value.numerator : value.numerator;
  const whole = n / value.denominator;
  const remainder = n % value.denominator;
  if (whole === 0n) return `${sign}${remainder}/${value.denominator}`;
  return `${sign}${whole} ${remainder}/${value.denominator}`;
}

export function formatCp004Value(kind: "SPEED" | "TIME" | "DISTANCE", value: Rational): string {
  const formatted = formatNumber(value);
  if (kind === "SPEED") return `${formatted} km/h`;
  if (kind === "DISTANCE") return `${formatted} km`;
  return `${formatted} minutes`;
}

function ratioReduced(a: bigint, b: bigint): readonly [bigint, bigint] {
  const g = gcdBigInt(a, b);
  return Object.freeze([a / g, b / g] as const);
}

function fingerprint(state: TsdCp004CanonicalState, answer: string): string {
  return [
    state.authorityId,
    state.directionCase,
    toCanonicalString(state.speedAKmph),
    toCanonicalString(state.speedBKmph),
    toCanonicalString(state.speedCKmph),
    toCanonicalString(state.initialGapKm),
    toCanonicalString(state.elapsedMinutes),
    toCanonicalString(state.startDelayMinutes),
    toCanonicalString(state.targetSeparationKm),
    toCanonicalString(state.routeLengthKm),
    toCanonicalString(state.deadlineMinutes),
    String(state.ratioA),
    String(state.ratioB),
    toCanonicalString(state.extraGapCKm),
    answer,
  ].join("|");
}

export function solveCp004(state: TsdCp004CanonicalState): TsdCp004SolveCertificate {
  const sumSpeed = add(state.speedAKmph, state.speedBKmph);
  const diffSpeed = absRational(subtract(state.speedAKmph, state.speedBKmph));
  let answerKind: TsdCp004SolveCertificate["answerKind"];
  let answerValue: Rational | null = null;
  let answerRatio: readonly [bigint, bigint] | null = null;
  let answerOrder: string | null = null;
  let decisiveEquation = "";
  let eventTimeMinutes: Rational | null = null;
  let eventPositionFromAKm: Rational | null = null;

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
      answerKind = "SPEED";
      answerValue = sumSpeed;
      decisiveEquation = "opposite relative speed = speed A + speed B";
      break;
    case "RELATIVE_SPEED_SAME_DIRECTION":
      answerKind = "SPEED";
      answerValue = diffSpeed;
      decisiveEquation = "same-direction relative speed = faster speed - slower speed";
      break;
    case "FIRST_MEETING_TIME": {
      answerKind = "TIME";
      const closing = state.directionCase === "OPPOSITE_TOWARD" ? sumSpeed : diffSpeed;
      answerValue = minutesFromHours(divide(state.initialGapKm, closing));
      eventTimeMinutes = answerValue;
      decisiveEquation = "meeting time = initial gap / positive closing speed";
      break;
    }
    case "INITIAL_GAP_FROM_MEETING": {
      answerKind = "DISTANCE";
      const closing = state.directionCase === "OPPOSITE_TOWARD" ? sumSpeed : diffSpeed;
      answerValue = multiply(closing, hoursFromMinutes(state.elapsedMinutes));
      decisiveEquation = "initial gap = closing speed × meeting time";
      break;
    }
    case "UNKNOWN_SPEED_FROM_MEETING": {
      answerKind = "SPEED";
      const closing = divide(state.initialGapKm, hoursFromMinutes(state.elapsedMinutes));
      answerValue = state.directionCase === "OPPOSITE_TOWARD"
        ? subtract(closing, state.speedBKmph)
        : add(closing, state.speedBKmph);
      decisiveEquation = state.directionCase === "OPPOSITE_TOWARD"
        ? "unknown speed = recovered closing speed - other speed"
        : "unknown faster speed = recovered closing speed + slower speed";
      break;
    }
    case "HEAD_START_CATCH_UP_TIME":
      answerKind = "TIME";
      answerValue = minutesFromHours(divide(state.initialGapKm, diffSpeed));
      eventTimeMinutes = answerValue;
      decisiveEquation = "catch-up time = distance head start / speed difference";
      break;
    case "HEAD_START_DISTANCE":
      answerKind = "DISTANCE";
      answerValue = multiply(diffSpeed, hoursFromMinutes(state.elapsedMinutes));
      decisiveEquation = "head-start distance = speed difference × catch-up time";
      break;
    case "DELAYED_START_CATCH_UP_TIME": {
      answerKind = "TIME";
      const lead = multiply(state.speedBKmph, hoursFromMinutes(state.startDelayMinutes));
      answerValue = minutesFromHours(divide(lead, diffSpeed));
      eventTimeMinutes = answerValue;
      decisiveEquation = "lead at chaser start = slower speed × delay; chase time = lead / speed difference";
      break;
    }
    case "START_DELAY_FROM_CATCH_UP": {
      answerKind = "TIME";
      const lead = multiply(diffSpeed, hoursFromMinutes(state.elapsedMinutes));
      answerValue = minutesFromHours(divide(lead, state.speedBKmph));
      decisiveEquation = "slower speed × start delay = speed difference × chase time";
      break;
    }
    case "SEPARATION_AFTER_TIME": {
      answerKind = "DISTANCE";
      const elapsedHours = hoursFromMinutes(state.elapsedMinutes);
      if (state.directionCase === "OPPOSITE_AWAY") {
        answerValue = add(state.initialGapKm, multiply(sumSpeed, elapsedHours));
        decisiveEquation = "later separation = initial gap + (speed A + speed B) × time";
      } else if (state.directionCase === "SAME_DIRECTION") {
        answerValue = add(state.initialGapKm, multiply(diffSpeed, elapsedHours));
        decisiveEquation = "later separation = initial gap + speed difference × time";
      } else {
        answerValue = subtract(state.initialGapKm, multiply(sumSpeed, elapsedHours));
        decisiveEquation = "remaining separation = initial gap - closing speed × time";
      }
      break;
    }
    case "TIME_TO_SPECIFIED_SEPARATION": {
      answerKind = "TIME";
      let distanceChange: Rational;
      let relative: Rational;
      if (state.directionCase === "OPPOSITE_AWAY") {
        distanceChange = subtract(state.targetSeparationKm, state.initialGapKm);
        relative = sumSpeed;
      } else if (state.directionCase === "SAME_DIRECTION") {
        distanceChange = subtract(state.targetSeparationKm, state.initialGapKm);
        relative = diffSpeed;
      } else {
        distanceChange = subtract(state.initialGapKm, state.targetSeparationKm);
        relative = sumSpeed;
      }
      answerValue = minutesFromHours(divide(distanceChange, relative));
      eventTimeMinutes = answerValue;
      decisiveEquation = "time = required change in separation / relative speed";
      break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT":
      answerKind = "DISTANCE";
      answerValue = multiply(state.routeLengthKm, divide(state.speedAKmph, sumSpeed));
      eventPositionFromAKm = answerValue;
      decisiveEquation = "meeting distance from A = route length × speed A / (speed A + speed B)";
      break;
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      answerKind = "RATIO";
      const fromB = subtract(state.routeLengthKm, state.meetingFromAKm);
      const left = state.meetingFromAKm.numerator * fromB.denominator;
      const right = fromB.numerator * state.meetingFromAKm.denominator;
      answerRatio = ratioReduced(left, right);
      decisiveEquation = "speed A : speed B = distance travelled by A : distance travelled by B";
      break;
    }
    case "MEETING_POINT_FROM_SPEED_RATIO": {
      answerKind = "DISTANCE";
      const totalParts = rational(state.ratioA + state.ratioB);
      answerValue = multiply(state.routeLengthKm, divide(rational(state.ratioA), totalParts));
      eventPositionFromAKm = answerValue;
      decisiveEquation = "meeting distance from A = route length × A-ratio-part / total ratio parts";
      break;
    }
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      answerKind = "SPEED";
      const requiredClosing = divide(state.initialGapKm, hoursFromMinutes(state.deadlineMinutes));
      answerValue = state.directionCase === "OPPOSITE_TOWARD"
        ? subtract(requiredClosing, state.speedBKmph)
        : add(requiredClosing, state.speedBKmph);
      decisiveEquation = state.directionCase === "OPPOSITE_TOWARD"
        ? "required speed A = required closing speed - speed B"
        : "required chaser speed = required closing speed + target speed";
      break;
    }
    case "MULTI_PURSUER_MEETING_ORDER": {
      answerKind = "ORDER";
      const timeA = minutesFromHours(divide(state.initialGapKm, subtract(state.speedAKmph, state.speedBKmph)));
      const timeC = minutesFromHours(divide(state.extraGapCKm, subtract(state.speedCKmph, state.speedBKmph)));
      eventTimeMinutes = compare(timeA, timeC) <= 0 ? timeA : timeC;
      if (compare(timeA, timeC) < 0) answerOrder = "Pursuer A catches first";
      else if (compare(timeA, timeC) > 0) answerOrder = "Pursuer C catches first";
      else answerOrder = "Both catch at the same time";
      decisiveEquation = "compare each pursuer's head-start distance / closing speed";
      break;
    }
    default: {
      const neverState: never = state.authorityId;
      throw new Error(`Unsupported CP004 authority: ${neverState}`);
    }
  }

  let answerText: string;
  if (answerKind === "RATIO") {
    if (!answerRatio) throw new Error("Ratio answer missing");
    answerText = `${answerRatio[0]}:${answerRatio[1]}`;
  } else if (answerKind === "ORDER") {
    if (!answerOrder) throw new Error("Order answer missing");
    answerText = answerOrder;
  } else {
    if (!answerValue) throw new Error("Numeric answer missing");
    answerText = formatCp004Value(answerKind, answerValue);
  }

  return Object.freeze({
    authorityId: state.authorityId,
    answerKind,
    answerValue,
    answerRatio,
    answerOrder,
    answerText,
    decisiveEquation,
    eventTimeMinutes,
    eventPositionFromAKm,
    mathematicalFingerprint: fingerprint(state, answerText),
  });
}
