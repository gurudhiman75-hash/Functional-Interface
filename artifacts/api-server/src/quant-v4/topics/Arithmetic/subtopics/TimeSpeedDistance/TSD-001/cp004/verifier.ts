import { absRational, add, compare, divide, equals, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp004CanonicalState, TsdCp004SolveCertificate } from "./types";

const SIXTY = rational(60);

function hours(minutes: Rational): Rational {
  return divide(minutes, SIXTY);
}

function displacement(speedKmph: Rational, minutes: Rational): Rational {
  return multiply(speedKmph, hours(minutes));
}

function assertEqual(actual: Rational, expected: Rational, message: string, errors: string[]): void {
  if (!equals(actual, expected)) errors.push(message);
}

function answerValue(solution: TsdCp004SolveCertificate, errors: string[]): Rational | null {
  if (!solution.answerValue) {
    errors.push("Expected numeric answer value");
    return null;
  }
  return solution.answerValue;
}

export interface TsdCp004Verification {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly route: "INDEPENDENT_POSITION_TIMELINE";
}

export function verifyCp004(state: TsdCp004CanonicalState, solution: TsdCp004SolveCertificate): TsdCp004Verification {
  const errors: string[] = [];
  const sum = add(state.speedAKmph, state.speedBKmph);
  const diff = absRational(subtract(state.speedAKmph, state.speedBKmph));

  switch (state.authorityId) {
    case "RELATIVE_SPEED_OPPOSITE": {
      const answer = answerValue(solution, errors);
      if (answer) assertEqual(answer, absRational(subtract(state.speedAKmph, multiply(state.speedBKmph, rational(-1)))), "Opposite-direction signed-velocity difference does not match answer", errors);
      break;
    }
    case "RELATIVE_SPEED_SAME_DIRECTION": {
      const answer = answerValue(solution, errors);
      if (answer) assertEqual(answer, diff, "Same-direction signed-velocity difference does not match answer", errors);
      break;
    }
    case "FIRST_MEETING_TIME": {
      const t = answerValue(solution, errors);
      if (!t) break;
      if (state.directionCase === "OPPOSITE_TOWARD") {
        const posA = displacement(state.speedAKmph, t);
        const posB = subtract(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Bodies do not occupy the same position at computed meeting time", errors);
      } else {
        const posA = displacement(state.speedAKmph, t);
        const posB = add(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Chaser does not catch target at computed meeting time", errors);
      }
      break;
    }
    case "INITIAL_GAP_FROM_MEETING": {
      const gap = answerValue(solution, errors);
      if (!gap) break;
      const t = state.elapsedMinutes;
      if (state.directionCase === "OPPOSITE_TOWARD") {
        assertEqual(add(displacement(state.speedAKmph, t), displacement(state.speedBKmph, t)), gap, "Reconstructed gap is not closed by both bodies at the stated time", errors);
      } else {
        assertEqual(subtract(displacement(state.speedAKmph, t), displacement(state.speedBKmph, t)), gap, "Reconstructed pursuit gap does not match position difference", errors);
      }
      break;
    }
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const unknown = answerValue(solution, errors);
      if (!unknown) break;
      const t = state.elapsedMinutes;
      if (state.directionCase === "OPPOSITE_TOWARD") {
        const posA = displacement(unknown, t);
        const posB = subtract(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Recovered opposite-direction speed does not create the stated meeting", errors);
      } else {
        const posA = displacement(unknown, t);
        const posB = add(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Recovered pursuit speed does not create the stated catch", errors);
      }
      break;
    }
    case "HEAD_START_CATCH_UP_TIME": {
      const t = answerValue(solution, errors);
      if (!t) break;
      const chaser = displacement(state.speedAKmph, t);
      const target = add(state.initialGapKm, displacement(state.speedBKmph, t));
      assertEqual(chaser, target, "Head-start catch-up positions disagree", errors);
      break;
    }
    case "HEAD_START_DISTANCE": {
      const headStart = answerValue(solution, errors);
      if (!headStart) break;
      const chaser = displacement(state.speedAKmph, state.elapsedMinutes);
      const target = add(headStart, displacement(state.speedBKmph, state.elapsedMinutes));
      assertEqual(chaser, target, "Recovered head-start distance does not yield the stated catch-up time", errors);
      break;
    }
    case "DELAYED_START_CATCH_UP_TIME": {
      const chaseTime = answerValue(solution, errors);
      if (!chaseTime) break;
      const targetLead = displacement(state.speedBKmph, state.startDelayMinutes);
      const chaserAfterStart = displacement(state.speedAKmph, chaseTime);
      const targetAfterStart = add(targetLead, displacement(state.speedBKmph, chaseTime));
      assertEqual(chaserAfterStart, targetAfterStart, "Delayed-start catch-up positions disagree", errors);
      break;
    }
    case "START_DELAY_FROM_CATCH_UP": {
      const delay = answerValue(solution, errors);
      if (!delay) break;
      const targetLead = displacement(state.speedBKmph, delay);
      const gainedDuringChase = subtract(displacement(state.speedAKmph, state.elapsedMinutes), displacement(state.speedBKmph, state.elapsedMinutes));
      assertEqual(targetLead, gainedDuringChase, "Recovered start delay does not equal the lead erased during pursuit", errors);
      break;
    }
    case "SEPARATION_AFTER_TIME": {
      const expected = answerValue(solution, errors);
      if (!expected) break;
      const t = state.elapsedMinutes;
      let posA: Rational;
      let posB: Rational;
      if (state.directionCase === "OPPOSITE_AWAY") {
        posA = displacement(state.speedAKmph, t);
        posB = subtract(multiply(state.initialGapKm, rational(-1)), displacement(state.speedBKmph, t));
      } else if (state.directionCase === "SAME_DIRECTION") {
        posA = add(state.initialGapKm, displacement(state.speedAKmph, t));
        posB = displacement(state.speedBKmph, t);
      } else {
        posA = displacement(state.speedAKmph, t);
        posB = subtract(state.initialGapKm, displacement(state.speedBKmph, t));
      }
      assertEqual(absRational(subtract(posA, posB)), expected, "Direct position simulation gives a different later separation", errors);
      break;
    }
    case "TIME_TO_SPECIFIED_SEPARATION": {
      const t = answerValue(solution, errors);
      if (!t) break;
      let separation: Rational;
      if (state.directionCase === "OPPOSITE_AWAY") {
        const posA = displacement(state.speedAKmph, t);
        const posB = subtract(multiply(state.initialGapKm, rational(-1)), displacement(state.speedBKmph, t));
        separation = absRational(subtract(posA, posB));
      } else if (state.directionCase === "SAME_DIRECTION") {
        const posA = add(state.initialGapKm, displacement(state.speedAKmph, t));
        const posB = displacement(state.speedBKmph, t);
        separation = absRational(subtract(posA, posB));
      } else {
        const posA = displacement(state.speedAKmph, t);
        const posB = subtract(state.initialGapKm, displacement(state.speedBKmph, t));
        separation = absRational(subtract(posA, posB));
      }
      assertEqual(separation, state.targetSeparationKm, "Position simulation does not reach the requested separation", errors);
      break;
    }
    case "MEETING_POINT_DISTANCE_SPLIT": {
      const point = answerValue(solution, errors);
      if (!point) break;
      const timeA = divide(point, state.speedAKmph);
      const fromB = subtract(state.routeLengthKm, point);
      const timeB = divide(fromB, state.speedBKmph);
      assertEqual(timeA, timeB, "Meeting-point distances do not imply equal travel times", errors);
      break;
    }
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      if (!solution.answerRatio) {
        errors.push("Ratio answer is missing");
        break;
      }
      const [ra, rb] = solution.answerRatio;
      const fromB = subtract(state.routeLengthKm, state.meetingFromAKm);
      const left = multiply(state.meetingFromAKm, rational(rb));
      const right = multiply(fromB, rational(ra));
      assertEqual(left, right, "Returned speed ratio is not proportional to the meeting distances", errors);
      break;
    }
    case "MEETING_POINT_FROM_SPEED_RATIO": {
      const point = answerValue(solution, errors);
      if (!point) break;
      const fromB = subtract(state.routeLengthKm, point);
      const left = multiply(point, rational(state.ratioB));
      const right = multiply(fromB, rational(state.ratioA));
      assertEqual(left, right, "Meeting point does not divide route in the declared speed ratio", errors);
      break;
    }
    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      const required = answerValue(solution, errors);
      if (!required) break;
      const t = state.deadlineMinutes;
      if (state.directionCase === "OPPOSITE_TOWARD") {
        const posA = displacement(required, t);
        const posB = subtract(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Required opposite-direction speed misses the deadline meeting", errors);
      } else {
        const posA = displacement(required, t);
        const posB = add(state.initialGapKm, displacement(state.speedBKmph, t));
        assertEqual(posA, posB, "Required pursuit speed misses the deadline catch", errors);
      }
      break;
    }
    case "MULTI_PURSUER_MEETING_ORDER": {
      const relA = subtract(state.speedAKmph, state.speedBKmph);
      const relC = subtract(state.speedCKmph, state.speedBKmph);
      if (compare(relA, rational(0)) <= 0 || compare(relC, rational(0)) <= 0) {
        errors.push("Every retained multi-pursuer state must have positive closing speed");
        break;
      }
      const timeA = divide(state.initialGapKm, relA);
      const timeC = divide(state.extraGapCKm, relC);
      const expected = compare(timeA, timeC) < 0
        ? "Pursuer A catches first"
        : compare(timeA, timeC) > 0
          ? "Pursuer C catches first"
          : "Both catch at the same time";
      if (solution.answerOrder !== expected) errors.push("Multi-pursuer order does not match independently compared catch times");
      break;
    }
  }

  if (state.directionCase === "SAME_DIRECTION" && ["FIRST_MEETING_TIME", "HEAD_START_CATCH_UP_TIME", "DELAYED_START_CATCH_UP_TIME", "START_DELAY_FROM_CATCH_UP", "REQUIRED_SPEED_FOR_MEETING_DEADLINE", "MULTI_PURSUER_MEETING_ORDER"].includes(state.authorityId)) {
    if (compare(state.speedAKmph, state.speedBKmph) <= 0 && state.authorityId !== "REQUIRED_SPEED_FOR_MEETING_DEADLINE") {
      errors.push("Same-direction catch-up state has non-positive closing speed");
    }
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), route: "INDEPENDENT_POSITION_TIMELINE" as const });
}
