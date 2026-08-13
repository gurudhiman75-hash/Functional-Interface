import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { SeededRng, formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import { TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES, TSD_CP004_CLOCK_REPRESENTATION_EXTENSIONS } from "./final-ownership-candidate";
import { cp004PermanentQlForAuthority } from "./ql-allocation";
import type { TsdCp004CoreInput, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004GeneratedState } from "./runtime-types";

const contexts = Object.freeze([
  "two towns",
  "a highway",
  "a straight cycling route",
  "a running track segment",
  "a canal-side road",
  "an intercity road",
  "a village road",
  "a straight service lane",
]);

function trailingIndex(seed: string): number {
  const match = seed.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function q(value: number, denominator = 1): Rational {
  return rational(value, denominator);
}

function speedPair(rng: SeededRng, sameDirection: boolean): readonly [Rational, Rational] {
  const slower = rng.pick([24, 30, 36, 40, 45, 48, 50, 54]);
  const gap = rng.pick([6, 10, 12, 15, 18, 20, 24, 30]);
  if (sameDirection) return [q(slower + gap), q(slower)];
  return [q(rng.pick([30, 36, 40, 45, 48, 50, 54, 60])), q(rng.pick([24, 30, 32, 36, 40, 42, 45, 48]))];
}

function directionFor(seed: string): "OPPOSITE" | "SAME" {
  return trailingIndex(seed) % 2 === 0 ? "OPPOSITE" : "SAME";
}

function modeVariants(authorityKey: string): readonly TsdCp004CoreSolveMode[] {
  const authority = TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`Unknown CP004 authority ${authorityKey}`);
  const modes = [...authority.underlyingSolveModes] as TsdCp004CoreSolveMode[];
  if (authorityKey === "firstMeetingOrCatchUpTimeFromGap") {
    modes.push(...TSD_CP004_CLOCK_REPRESENTATION_EXTENSIONS.map((entry) => entry.solveMode as TsdCp004CoreSolveMode));
  }
  return Object.freeze(modes);
}

function generateInput(mode: TsdCp004CoreSolveMode, seed: string): TsdCp004CoreInput {
  const rng = new SeededRng(`cp004:${mode}:${seed}`);
  const directionCase = directionFor(seed);
  const same = directionCase === "SAME";
  const [speedA, speedB] = speedPair(rng, same);
  const duration = q(rng.pick([1, 2, 3, 4, 5, 6]), rng.pick([1, 1, 1, 2]));
  const relative = same ? subtract(speedA, speedB) : add(speedA, speedB);
  const gap = multiply(relative, duration);

  switch (mode) {
    case "findRelativeSpeedOppositeDirections": return { speedA, speedB };
    case "findRelativeSpeedSameDirection": return { speedA, speedB };
    case "findMeetingTimeFromInitialSeparation": return { speedA, speedB, initialSeparation: gap, directionCase };
    case "findInitialSeparationFromMeetingTime": return { speedA, speedB, meetingTime: duration, directionCase };
    case "findRelativeSpeedFromMeetingTime": return { initialSeparation: gap, meetingTime: duration };
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": return { relativeSpeed: relative, speedB, unknownBody: "A", directionCase };
    case "findCatchUpTimeFromHeadStartDistance": return { speedA, speedB, headStartDistance: multiply(subtract(speedA, speedB), duration) };
    case "findHeadStartDistanceFromCatchUpTime": return { speedA, speedB, meetingTime: duration };
    case "findDelayedStartCatchUpTime": {
      const pursuitTime = q(rng.pick([1, 2, 3, 4]));
      const startDelayDistance = multiply(subtract(speedA, speedB), pursuitTime);
      return { speedA, speedB, startDelay: divide(startDelayDistance, speedB) };
    }
    case "findStartDelayFromCatchUpState": return { speedA, speedB, meetingTime: duration };
    case "findFasterSpeedFromCatchUpState": return { speedB, headStartDistance: multiply(subtract(speedA, speedB), duration), meetingTime: duration };
    case "findSlowerSpeedFromCatchUpState": return { speedA, headStartDistance: multiply(subtract(speedA, speedB), duration), meetingTime: duration };
    case "findSeparationAfterMovingApart": return { speedA, speedB, initialSeparation: q(rng.pick([20, 30, 40, 50, 60])), elapsedTime: duration };
    case "findInitialGapFromLaterSeparation": {
      const initial = q(rng.pick([20, 30, 40, 50, 60]));
      const later = add(initial, multiply(add(speedA, speedB), duration));
      return { speedA, speedB, specifiedSeparation: later, elapsedTime: duration };
    }
    case "findMeetingPointDistanceSplit": {
      const routeDistance = multiply(add(speedA, speedB), q(rng.pick([2, 3, 4, 5])));
      return { speedA, speedB, routeDistance };
    }
    case "findSpeedRatioFromMeetingPoint": {
      const a = rng.pick([2, 3, 4, 5, 6]);
      const b = rng.pick([1, 2, 3, 4]);
      const scale = rng.pick([20, 30, 40, 50]);
      return { distanceA: q(a * scale), distanceB: q(b * scale) };
    }
    case "findMeetingPointFromSpeedRatio": {
      const ratioA = q(rng.pick([2, 3, 4, 5, 6]));
      const ratioB = q(rng.pick([1, 2, 3, 4]));
      const routeDistance = multiply(add(ratioA, ratioB), q(rng.pick([20, 30, 40, 50])));
      return { ratioA, ratioB, routeDistance };
    }
    case "findUnknownStartPointGap": return { speedA, speedB, meetingTime: duration, directionCase };
    case "findMeetingClockTime": {
      const departureMinute = q(rng.pick([390, 450, 510, 570, 630, 780, 840, 900]));
      return { speedA, speedB, initialSeparation: gap, departureMinute, directionCase };
    }
    case "findDepartureClockTimeFromMeetingState": {
      const departureMinute = q(rng.pick([390, 450, 510, 570, 630, 780, 840, 900]));
      const meetingClockMinute = add(departureMinute, multiply(duration, q(60)));
      return { speedA, speedB, initialSeparation: gap, meetingClockMinute, directionCase };
    }
    case "findRelativeDistanceCoveredInGivenTime": return { speedA, speedB, elapsedTime: duration, directionCase };
    case "findTimeUntilSpecifiedSeparation": {
      if (same) {
        const target = q(rng.pick([10, 15, 20, 25]));
        const initial = add(target, multiply(subtract(speedA, speedB), duration));
        return { speedA, speedB, initialSeparation: initial, specifiedSeparation: target, directionCase };
      }
      const initial = q(rng.pick([10, 20, 30, 40]));
      const target = add(initial, multiply(add(speedA, speedB), duration));
      return { speedA, speedB, initialSeparation: initial, specifiedSeparation: target, directionCase };
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const targetTime = q(rng.pick([1, 2, 3, 4]));
      const other = q(rng.pick([24, 30, 36, 40, 45]));
      const required = q(rng.pick([48, 54, 60, 66, 72, 80]));
      const relativeNeeded = directionCase === "OPPOSITE" ? add(required, other) : subtract(required, other);
      if (relativeNeeded.numerator <= 0n) return generateInput(mode, `${seed}:retry`);
      return { speedB: other, initialSeparation: multiply(relativeNeeded, targetTime), targetTime, directionCase };
    }
  }
}

function contextFor(authorityKey: string, seed: string): string {
  const rng = new SeededRng(`context:${authorityKey}:${seed}`);
  return rng.pick(contexts);
}

export function generateCp004State(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const modes = modeVariants(authorityKey);
  const mode = modes[trailingIndex(seed) % modes.length];
  const allocation = cp004PermanentQlForAuthority(authorityKey);
  return Object.freeze({
    authorityKey,
    permanentQlId: allocation.permanentQlId,
    solveMode: mode,
    representation: `${mode}:${trailingIndex(seed) % 3}`,
    context: contextFor(authorityKey, seed),
    input: Object.freeze(generateInput(mode, seed)),
    seed,
  });
}

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function h(value: Rational | undefined): string {
  return value ? formatDurationHours(value) : "?";
}

function directionPhrase(input: TsdCp004CoreInput): string {
  return input.directionCase === "SAME" ? "in the same direction" : "towards each other";
}

export function renderCp004Stem(state: TsdCp004GeneratedState): string {
  const i = state.input;
  const place = state.context;
  switch (state.solveMode) {
    case "findRelativeSpeedOppositeDirections":
      return `Two vehicles travel on ${place} in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What is their relative speed?`;
    case "findRelativeSpeedSameDirection":
      return `A faster rider moves along ${place} at ${n(i.speedA)} km/h while another rider ahead moves in the same direction at ${n(i.speedB)} km/h. What is the closing speed?`;
    case "findMeetingTimeFromInitialSeparation":
      return i.directionCase === "SAME"
        ? `A car moving at ${n(i.speedA)} km/h is ${n(i.initialSeparation)} km behind a bus moving at ${n(i.speedB)} km/h on ${place}. If both continue in the same direction, after how long will the car catch the bus?`
        : `Two vehicles are ${n(i.initialSeparation)} km apart on ${place}. They start at the same time towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how long will they meet?`;
    case "findCatchUpTimeFromHeadStartDistance":
      return `A cyclist moving at ${n(i.speedB)} km/h has a head start of ${n(i.headStartDistance)} km. Another cyclist follows on the same road at ${n(i.speedA)} km/h. How long will the faster cyclist take to catch up?`;
    case "findInitialSeparationFromMeetingTime":
      return `Two travellers move ${directionPhrase(i)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${h(i.meetingTime)}. What was the initial distance between them?`;
    case "findHeadStartDistanceFromCatchUpTime":
      return `A motorbike at ${n(i.speedA)} km/h catches a scooter travelling at ${n(i.speedB)} km/h after ${h(i.meetingTime)}. Both move in the same direction. What head-start distance did the scooter have?`;
    case "findUnknownStartPointGap":
      return `Two runners move ${directionPhrase(i)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${h(i.meetingTime)}. Find the unknown starting gap between them.`;
    case "findRelativeDistanceCoveredInGivenTime":
      return `Two runners move ${i.directionCase === "SAME" ? "in the same direction" : "in opposite directions"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${h(i.elapsedTime)}. How much relative distance is covered in that time?`;
    case "findRelativeSpeedFromMeetingTime":
      return `Two travellers close a gap of ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. What relative speed is implied by this meeting state?`;
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed":
      return i.directionCase === "SAME"
        ? `Two vehicles move in the same direction. Their closing speed is ${n(i.relativeSpeed)} km/h and the slower vehicle moves at ${n(i.speedB)} km/h. Find the speed of the faster vehicle.`
        : `Two vehicles move towards each other. Their relative speed is ${n(i.relativeSpeed)} km/h and one vehicle moves at ${n(i.speedB)} km/h. Find the speed of the other vehicle.`;
    case "findFasterSpeedFromCatchUpState":
      return `A slower rider at ${n(i.speedB)} km/h has a head start of ${n(i.headStartDistance)} km. A faster rider catches up in ${h(i.meetingTime)}. Find the faster rider's speed.`;
    case "findSlowerSpeedFromCatchUpState":
      return `A rider moving at ${n(i.speedA)} km/h catches another rider who had a ${n(i.headStartDistance)} km head start in ${h(i.meetingTime)}. Find the slower rider's speed.`;
    case "findDelayedStartCatchUpTime":
      return `A bus leaves first at ${n(i.speedB)} km/h. After ${h(i.startDelay)}, a car leaves from the same point in the same direction at ${n(i.speedA)} km/h. How long after the car starts will it catch the bus?`;
    case "findStartDelayFromCatchUpState":
      return `A bus travels at ${n(i.speedB)} km/h. A car travelling at ${n(i.speedA)} km/h starts later from the same point and catches the bus after ${h(i.meetingTime)} of pursuit. How much later did the car start?`;
    case "findSeparationAfterMovingApart":
      return `Two vehicles are initially ${n(i.initialSeparation)} km apart and then move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${h(i.elapsedTime)}. What is their separation then?`;
    case "findInitialGapFromLaterSeparation":
      return `Two vehicles move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After ${h(i.elapsedTime)}, they are ${n(i.specifiedSeparation)} km apart. What was their initial separation?`;
    case "findTimeUntilSpecifiedSeparation":
      return i.directionCase === "SAME"
        ? `A faster car at ${n(i.speedA)} km/h follows a bus at ${n(i.speedB)} km/h. The gap is ${n(i.initialSeparation)} km. After how long will the gap reduce to ${n(i.specifiedSeparation)} km?`
        : `Two vehicles are ${n(i.initialSeparation)} km apart and move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how long will they be ${n(i.specifiedSeparation)} km apart?`;
    case "findMeetingPointDistanceSplit":
      return `Two travellers start simultaneously from opposite ends of a ${n(i.routeDistance)} km route at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far from the first traveller's starting point will they meet?`;
    case "findMeetingPointFromSpeedRatio":
      return `Two travellers start simultaneously from opposite ends of a ${n(i.routeDistance)} km route. Their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. How far from the first traveller's end will they meet?`;
    case "findSpeedRatioFromMeetingPoint":
      return `Two travellers start at the same time from opposite ends of a road and meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. What is the ratio of their speeds?`;
    case "findMeetingClockTime":
      return `Two vehicles are ${n(i.initialSeparation)} km apart and start at ${formatClockMinute(i.departureMinute!)} ${directionPhrase(i)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what clock time will they meet?`;
    case "findDepartureClockTimeFromMeetingState":
      return `Two vehicles ${directionPhrase(i)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h from points ${n(i.initialSeparation)} km apart. They meet at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`;
    case "findSpeedNeededToAvoidOrCauseMeeting":
      return i.directionCase === "SAME"
        ? `A vehicle ahead moves at ${n(i.speedB)} km/h and is ${n(i.initialSeparation)} km away. What speed must a pursuing vehicle maintain to catch it exactly after ${h(i.targetTime)}?`
        : `Two vehicles are ${n(i.initialSeparation)} km apart. One moves towards the other at ${n(i.speedB)} km/h. What speed must the second vehicle maintain towards the first so that they meet exactly after ${h(i.targetTime)}?`;
  }
}

export const TSD_CP004_REVIEW_AUTHORITIES = Object.freeze(TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey));
