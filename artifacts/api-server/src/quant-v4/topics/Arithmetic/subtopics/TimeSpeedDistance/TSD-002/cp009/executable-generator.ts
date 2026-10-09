import { add, divide, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { solveTsdCp009 } from "./executable-solver";
import type { TsdCp009AuthorityKey, TsdCp009Direction, TsdCp009ExecutableInput, TsdCp009GeneratedCase } from "./executable-types";

export const TSD_CP009_EXECUTABLE_AUTHORITIES: readonly TsdCp009AuthorityKey[] = Object.freeze([
  "mediumAdjustedGroundSpeed",
  "mediumComponentsFromAssistedOpposedSpeeds",
  "mediumLegTravelState",
  "pairedEqualDistanceMediumState",
  "roundTripMediumState",
  "mixedUnequalLegMediumState",
  "equalTimeMediumDistanceSpread",
  "mediumShiftedMeetingPoint",
  "passiveFloatingObjectState",
  "floatingObjectRecoveryState",
  "changingMediumState",
]);

const BODY = [12, 15, 18, 20, 22, 24, 16, 21, 25, 28, 30, 32] as const;
const MEDIUM = [2, 3, 4, 5, 6, 4, 3, 5, 7, 6, 8, 10] as const;
const DISTANCE = [140, 180, 220, 300, 360, 420, 240, 390, 480, 510, 660, 770] as const;
const TIME = [10, 12, 15, 18, 20, 24, 16, 14, 21, 25, 30, 35] as const;
const SECOND_BODY = [10, 12, 14, 16, 18, 20, 13, 17, 19, 22, 24, 26] as const;
const SECOND_MEDIUM = [3, 4, 5, 6, 7, 5, 4, 6, 8, 7, 9, 11] as const;

function direction(index: number): TsdCp009Direction {
  return index % 2 === 0 ? "ASSISTED" : "OPPOSED";
}

function inputFor(authorityKey: TsdCp009AuthorityKey, index: number): TsdCp009ExecutableInput {
  const u = rational(BODY[index]!);
  const c = rational(MEDIUM[index]!);
  const d = rational(DISTANCE[index]!);
  const t = rational(TIME[index]!);
  const dir = direction(index);
  const assisted = add(u, c);
  const opposed = subtract(u, c);

  switch (authorityKey) {
    case "mediumAdjustedGroundSpeed":
      return Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, direction: dir });

    case "mediumComponentsFromAssistedOpposedSpeeds":
      return Object.freeze({ authorityKey, assistedGroundSpeed: assisted, opposedGroundSpeed: opposed, target: index % 2 === 0 ? "BODY_SPEED" : "MEDIUM_SPEED" });

    case "mediumLegTravelState":
      return index % 2 === 0
        ? Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, direction: dir, target: "TIME" as const, distance: multiply(dir === "ASSISTED" ? assisted : opposed, t) })
        : Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, direction: dir, target: "DISTANCE" as const, time: t });

    case "pairedEqualDistanceMediumState": {
      const mode = index % 4;
      if (mode === 0) {
        const equalDistance = multiply(multiply(assisted, opposed), rational(2 + (index % 3)));
        return Object.freeze({
          authorityKey,
          mode: "COMPONENT_FROM_DISTANCE_AND_TIMES" as const,
          equalDistance,
          assistedTime: divide(equalDistance, assisted),
          opposedTime: divide(equalDistance, opposed),
          target: "BODY_SPEED" as const,
        });
      }
      if (mode === 1) {
        const equalDistance = multiply(multiply(assisted, opposed), rational(2 + (index % 4)));
        const difference = subtract(divide(equalDistance, opposed), divide(equalDistance, assisted));
        return Object.freeze({ authorityKey, mode: "DISTANCE_FROM_TIME_DIFFERENCE" as const, bodyRelativeSpeed: u, mediumSpeed: c, opposedMinusAssistedTime: difference, target: "DISTANCE" as const });
      }
      const ratio = divide(assisted, opposed);
      if (mode === 2) return Object.freeze({ authorityKey, mode: "BODY_SPEED_FROM_TIME_RATIO" as const, mediumSpeed: c, opposedToAssistedTimeRatio: ratio, target: "BODY_SPEED" as const });
      return Object.freeze({ authorityKey, mode: "MEDIUM_SPEED_FROM_TIME_RATIO" as const, bodyRelativeSpeed: u, opposedToAssistedTimeRatio: ratio, target: "MEDIUM_SPEED" as const });
    }

    case "roundTripMediumState":
      return Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, oneWayDistance: d, target: index % 2 === 0 ? "TOTAL_TIME" : "AVERAGE_SPEED" });

    case "mixedUnequalLegMediumState": {
      const assistedDistance = multiply(assisted, rational(5 + (index % 4)));
      const opposedDistance = multiply(opposed, rational(7 + (index % 5)));
      const totalTime = add(divide(assistedDistance, assisted), divide(opposedDistance, opposed));
      const mode = index % 3;
      if (mode === 0) return Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, totalTime, opposedDistance, target: "ASSISTED_DISTANCE" as const });
      if (mode === 1) return Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, totalTime, assistedDistance, target: "OPPOSED_DISTANCE" as const });
      return Object.freeze({ authorityKey, mediumSpeed: c, totalTime, assistedDistance, opposedDistance, target: "BODY_SPEED" as const });
    }

    case "equalTimeMediumDistanceSpread":
      return Object.freeze({ authorityKey, mediumSpeed: c, equalTime: t });

    case "mediumShiftedMeetingPoint": {
      const other = rational(SECOND_BODY[index]!);
      const routeDistance = multiply(add(u, other), t);
      return Object.freeze({ authorityKey, routeDistance, fromUpstreamBodySpeed: u, fromDownstreamBodySpeed: other, mediumSpeed: c });
    }

    case "passiveFloatingObjectState":
      return index % 2 === 0
        ? Object.freeze({ authorityKey, mediumSpeed: c, target: "FLOAT_SPEED" as const })
        : Object.freeze({ authorityKey, mediumSpeed: c, target: "TRAVEL_TIME" as const, distance: multiply(c, t) });

    case "floatingObjectRecoveryState":
      return Object.freeze({ authorityKey, bodyRelativeSpeed: u, mediumSpeed: c, separationTimeBeforeTurn: t, target: index % 2 === 0 ? "RECOVERY_TIME_AFTER_TURN" : "RECOVERY_DISTANCE_FROM_DROP" });

    case "changingMediumState": {
      const c2 = rational(SECOND_MEDIUM[index]!);
      const tripDistance = multiply(multiply(add(u, c2), subtract(u, c2)), rational(2 + (index % 3)));
      const firstGround = dir === "ASSISTED" ? add(u, c) : subtract(u, c);
      const secondGround = dir === "ASSISTED" ? add(u, c2) : subtract(u, c2);
      return Object.freeze({
        authorityKey,
        bodyRelativeSpeed: u,
        distance: tripDistance,
        direction: dir,
        firstTripTime: divide(tripDistance, firstGround),
        secondTripTime: divide(tripDistance, secondGround),
        target: index % 2 === 0 ? "NEW_MEDIUM_SPEED" : "MEDIUM_SPEED_CHANGE",
      });
    }
  }
}

export function generateTsdCp009Case(authorityKey: TsdCp009AuthorityKey, caseIndex: number): TsdCp009GeneratedCase {
  if (!Number.isInteger(caseIndex) || caseIndex < 1 || caseIndex > 12) throw new Error(`CP009 caseIndex must be 1..12; received ${caseIndex}`);
  const input = inputFor(authorityKey, caseIndex - 1);
  const solution = solveTsdCp009(input);
  return Object.freeze({
    seed: `cp009:${authorityKey}:${caseIndex}`,
    caseIndex,
    authorityKey,
    input,
    solution,
  });
}
