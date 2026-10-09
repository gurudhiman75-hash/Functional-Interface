import { multiply, rational, type Rational } from "../foundation/rational";
import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004GeneratedState } from "./runtime-types";

export const TSD_CP004_STEM_VARIANTS_PER_MODE = 6 as const;

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function duration(value: Rational | undefined): string {
  if (!value) return "?";
  const minutes = multiply(value, rational(60));
  if (minutes.denominator === 1n && minutes.numerator < 60n) return `${minutes.numerator} minute${minutes.numerator === 1n ? "" : "s"}`;
  return formatDurationHours(value);
}

function variant(state: TsdCp004GeneratedState): number {
  const raw = Number(state.representation.split(":").at(-1) ?? "0");
  return Number.isInteger(raw) ? ((raw % TSD_CP004_STEM_VARIANTS_PER_MODE) + TSD_CP004_STEM_VARIANTS_PER_MODE) % TSD_CP004_STEM_VARIANTS_PER_MODE : 0;
}

function pick<T>(values: readonly T[], index: number): T {
  return values[index % values.length]!;
}

function sameDirectionMeetingStems(state: TsdCp004GeneratedState): readonly string[] {
  const i = state.input;
  return [
    `A car travelling at ${n(i.speedA)} km/h is ${n(i.initialSeparation)} km behind a bus travelling at ${n(i.speedB)} km/h. If both continue in the same direction, when will the car catch the bus?`,
    `On a straight highway, a truck moving at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead of a van moving at ${n(i.speedA)} km/h. How long will the van take to draw level with the truck?`,
    `A patrol vehicle at ${n(i.speedA)} km/h follows a jeep at ${n(i.speedB)} km/h. The jeep is initially ${n(i.initialSeparation)} km ahead. Find the catch-up time.`,
    `A fast bus moving at ${n(i.speedA)} km/h is chasing a slower bus moving at ${n(i.speedB)} km/h on the same road. Their initial gap is ${n(i.initialSeparation)} km. After how much time will the faster bus overtake?`,
    `A delivery van travels at ${n(i.speedA)} km/h while a lorry ${n(i.initialSeparation)} km ahead travels at ${n(i.speedB)} km/h. Both move in the same direction. How long before the van reaches the lorry?`,
    `Two vehicles move along the same route at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, with the faster one ${n(i.initialSeparation)} km behind. Find the time required to close the entire gap.`,
  ];
}

function oppositeMeetingStems(state: TsdCp004GeneratedState): readonly string[] {
  const i = state.input;
  return [
    `Two cars start simultaneously from points ${n(i.initialSeparation)} km apart and drive towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how long will they meet?`,
    `Two buses leave opposite ends of a ${n(i.initialSeparation)} km road at the same time, travelling towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their meeting time.`,
    `A van and a truck are ${n(i.initialSeparation)} km apart and move directly towards one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How long before they cross?`,
    `From two towns ${n(i.initialSeparation)} km apart, two vehicles start at the same instant towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. In how much time will the distance between them become zero?`,
    `Two motor vehicles approach each other on a straight road. Their initial separation is ${n(i.initialSeparation)} km and their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the time to first meeting.`,
    `A car and a bus are moving towards each other from locations ${n(i.initialSeparation)} km apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h respectively. When will they meet?`,
  ];
}

export function renderCp004StemV2(state: TsdCp004GeneratedState): string {
  const i = state.input;
  const v = variant(state);

  switch (state.solveMode) {
    case "findRelativeSpeedOppositeDirections":
      return pick([
        `Two cars leave the same checkpoint in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what rate does the distance between them increase?`,
        `Two buses move towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. By how many kilometres does the gap between them shrink each hour?`,
        `A van and a truck travel in opposite directions on the same straight road at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their relative speed.`,
        `Two motor vehicles approach one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What is their combined closing speed?`,
        `From a road junction, two vehicles move away in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How fast is their separation changing?`,
        `Two vehicles travelling towards each other have speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the speed of one relative to the other.`,
      ], v);

    case "findRelativeSpeedSameDirection":
      return pick([
        `A car at ${n(i.speedA)} km/h follows a bus at ${n(i.speedB)} km/h in the same direction. At what rate is the car reducing the gap?`,
        `Two buses travel along the same highway at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres per hour does the faster bus gain on the slower one?`,
        `A courier van moving at ${n(i.speedA)} km/h is chasing a truck moving at ${n(i.speedB)} km/h. Find the closing speed.`,
        `A motorbike at ${n(i.speedA)} km/h is behind a scooter at ${n(i.speedB)} km/h, both moving in the same direction. What is their relative speed?`,
        `A patrol car travels at ${n(i.speedA)} km/h while a jeep ahead travels at ${n(i.speedB)} km/h on the same road. At what rate does the patrol car gain on the jeep?`,
        `An express bus and a local bus move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the speed of the express bus relative to the local bus.`,
      ], v);

    case "findMeetingTimeFromInitialSeparation":
      return pick(i.directionCase === "SAME" ? sameDirectionMeetingStems(state) : oppositeMeetingStems(state), v);

    case "findCatchUpTimeFromHeadStartDistance":
      return pick([
        `A bus moving at ${n(i.speedB)} km/h has a head start of ${n(i.headStartDistance)} km. A car follows at ${n(i.speedA)} km/h. How long after the car starts will it catch the bus?`,
        `A lorry at ${n(i.speedB)} km/h is ${n(i.headStartDistance)} km ahead of a van travelling at ${n(i.speedA)} km/h on the same road. Find the catch-up time.`,
        `A vehicle travelling at ${n(i.speedA)} km/h starts pursuit when another vehicle moving at ${n(i.speedB)} km/h is already ${n(i.headStartDistance)} km ahead. After how long will they be side by side?`,
        `A faster bus at ${n(i.speedA)} km/h is chasing a slower bus at ${n(i.speedB)} km/h that has a ${n(i.headStartDistance)} km lead. How much time is needed to erase the lead?`,
        `A delivery van moves at ${n(i.speedA)} km/h. A truck ahead moves at ${n(i.speedB)} km/h and has a lead of ${n(i.headStartDistance)} km. When will the van catch the truck?`,
        `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. The slower vehicle is ${n(i.headStartDistance)} km ahead. Find the time at which the faster vehicle catches it.`,
      ], v);

    case "findInitialSeparationFromMeetingTime":
      return pick(i.directionCase === "SAME" ? [
        `A car at ${n(i.speedA)} km/h catches a bus at ${n(i.speedB)} km/h after ${duration(i.meetingTime)}. What was the car's initial distance behind the bus?`,
        `A faster vehicle at ${n(i.speedA)} km/h overtakes a slower vehicle at ${n(i.speedB)} km/h after travelling for ${duration(i.meetingTime)}. Find their initial gap.`,
        `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the faster one catches the slower one in ${duration(i.meetingTime)}, how far behind did it start?`,
        `A van at ${n(i.speedA)} km/h takes ${duration(i.meetingTime)} to catch a truck moving at ${n(i.speedB)} km/h. Calculate the truck's initial lead.`,
        `A patrol car moving at ${n(i.speedA)} km/h catches a jeep travelling at ${n(i.speedB)} km/h after ${duration(i.meetingTime)}. What gap separated them at the start of pursuit?`,
        `The closing speed of two same-direction vehicles comes from speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet after ${duration(i.meetingTime)}. Find the initial separation.`,
      ] : [
        `Two vehicles approach each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${duration(i.meetingTime)}. How far apart were they initially?`,
        `Two buses start simultaneously towards each other and meet in ${duration(i.meetingTime)}. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance between their starting points.`,
        `A car and a van travel directly towards one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If they cross after ${duration(i.meetingTime)}, calculate their initial separation.`,
        `Two vehicles leave two towns at the same time towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet after ${duration(i.meetingTime)}. Find the distance between the towns.`,
        `The distance between two approaching vehicles becomes zero after ${duration(i.meetingTime)}. If their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, what was the original gap?`,
        `Two motorists travel towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their first meeting occurs after ${duration(i.meetingTime)}. Determine the initial distance between them.`,
      ], v);

    case "findHeadStartDistanceFromCatchUpTime":
      return pick([
        `A car at ${n(i.speedA)} km/h catches a bus at ${n(i.speedB)} km/h after ${duration(i.meetingTime)}. What head start, in kilometres, did the bus have?`,
        `A truck moving at ${n(i.speedB)} km/h is overtaken after ${duration(i.meetingTime)} by a van moving at ${n(i.speedA)} km/h. Find the truck's initial lead.`,
        `A faster vehicle at ${n(i.speedA)} km/h needs ${duration(i.meetingTime)} to catch a slower vehicle at ${n(i.speedB)} km/h. How far ahead was the slower vehicle when pursuit began?`,
        `A bus travels at ${n(i.speedB)} km/h and is chased by a car at ${n(i.speedA)} km/h. The catch occurs after ${duration(i.meetingTime)}. Calculate the original head-start distance.`,
        `A delivery van at ${n(i.speedA)} km/h closes on a lorry at ${n(i.speedB)} km/h in ${duration(i.meetingTime)}. Find the lorry's initial lead.`,
        `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the faster catches the slower after ${duration(i.meetingTime)}, determine the starting gap.`,
      ], v);

    case "findUnknownStartPointGap":
      return pick(i.directionCase === "SAME" ? [
        `A faster vehicle at ${n(i.speedA)} km/h catches a slower vehicle at ${n(i.speedB)} km/h after ${duration(i.meetingTime)}. Find the unknown starting gap.`,
        `A van moving at ${n(i.speedA)} km/h overtakes a truck moving at ${n(i.speedB)} km/h after ${duration(i.meetingTime)}. How far behind was the van initially?`,
        `Two vehicles travel in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They become level after ${duration(i.meetingTime)}. Determine their initial separation.`,
        `A bus at ${n(i.speedB)} km/h is caught by a car at ${n(i.speedA)} km/h in ${duration(i.meetingTime)}. Find the bus's initial lead.`,
        `A pursuing vehicle at ${n(i.speedA)} km/h closes on another at ${n(i.speedB)} km/h in ${duration(i.meetingTime)}. What gap existed at the start?`,
        `The faster of two same-direction vehicles moves at ${n(i.speedA)} km/h, the slower at ${n(i.speedB)} km/h, and catch-up occurs after ${duration(i.meetingTime)}. Find their initial gap.`,
      ] : [
        `Two vehicles moving towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h meet after ${duration(i.meetingTime)}. Find the unknown distance between their starting points.`,
        `A car and a bus approach each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and cross after ${duration(i.meetingTime)}. What was their initial gap?`,
        `Two motorists leave different points and drive towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet in ${duration(i.meetingTime)}. Determine the distance between the points.`,
        `The first meeting of two approaching vehicles occurs after ${duration(i.meetingTime)}. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the starting separation.`,
        `Two vehicles close an unknown road gap in ${duration(i.meetingTime)} while travelling towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the gap.`,
        `A van at ${n(i.speedA)} km/h and a truck at ${n(i.speedB)} km/h travel towards each other and meet after ${duration(i.meetingTime)}. How far apart were they at first?`,
      ], v);

    case "findRelativeDistanceCoveredInGivenTime":
      return pick(i.directionCase === "SAME" ? [
        `A car at ${n(i.speedA)} km/h gains on a bus at ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. By how many kilometres does the gap change?`,
        `Two vehicles travel in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. How much distance does the faster one gain?`,
        `A van at ${n(i.speedA)} km/h pursues a truck at ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. Find the relative distance covered during this period.`,
        `A faster bus moves at ${n(i.speedA)} km/h and a slower bus at ${n(i.speedB)} km/h. Over ${duration(i.elapsedTime)}, how much of their gap is closed?`,
        `A patrol car at ${n(i.speedA)} km/h follows a jeep at ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. Calculate the distance gained by the patrol car.`,
        `For ${duration(i.elapsedTime)}, two same-direction vehicles maintain speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the change in their separation.`,
      ] : [
        `Two vehicles move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. How much relative distance do they cover?`,
        `Two vehicles travel away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. By how much does their separation grow in ${duration(i.elapsedTime)}?`,
        `A car and a bus move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. Find the total increase in distance between them.`,
        `Two motorists head in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What relative distance is covered in ${duration(i.elapsedTime)}?`,
        `Two vehicles move directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Calculate how much farther apart they become after ${duration(i.elapsedTime)}.`,
        `For ${duration(i.elapsedTime)}, two vehicles move oppositely at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the change in separation.`,
      ], v);

    case "findRelativeSpeedFromMeetingTime": {
      const known = n(i.speedB);
      const common = `${n(i.initialSeparation)} km in ${duration(i.meetingTime)}`;
      return pick([
        `Two vehicles moving towards each other close a gap of ${common}. What is their relative speed?`,
        `A car catches a bus after closing an initial gap of ${common}. The bus travels at ${known} km/h. At what rate was the gap closing?`,
        `Two vehicles moving apart increase their separation by ${common}. One travels at ${known} km/h. Find the rate at which their separation increases.`,
        `A bus travels at ${known} km/h while another vehicle approaches it from the opposite direction. Together they close ${common}. Find their combined relative speed.`,
        `A slower vehicle moves at ${known} km/h. A faster vehicle behind it closes a gap of ${common}. What was the closing speed between the two vehicles?`,
        `One of two approaching vehicles travels at ${known} km/h. The distance between them falls by ${common}. Find the relative speed of the pair, not the individual speed of either vehicle.`,
      ], v);
    }

    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed":
      return pick(i.directionCase === "OPPOSITE" ? [
        `Two vehicles approach each other with relative speed ${n(i.relativeSpeed)} km/h. If one travels at ${n(i.speedB)} km/h, find the speed of the other.`,
        `The combined closing speed of two oncoming vehicles is ${n(i.relativeSpeed)} km/h. One vehicle's speed is ${n(i.speedB)} km/h. What is the other's speed?`,
        `A bus and a car move towards each other. Their relative speed is ${n(i.relativeSpeed)} km/h and the bus travels at ${n(i.speedB)} km/h. Find the car's speed.`,
        `Two vehicles travelling in opposite directions have relative speed ${n(i.relativeSpeed)} km/h. One moves at ${n(i.speedB)} km/h. Determine the second speed.`,
        `The distance between two approaching vehicles decreases at ${n(i.relativeSpeed)} km/h. If one vehicle is moving at ${n(i.speedB)} km/h, how fast is the other moving?`,
        `For two vehicles moving towards each other, the sum of speeds is ${n(i.relativeSpeed)} km/h. One speed is ${n(i.speedB)} km/h. Find the remaining speed.`,
      ] : [
        `Two vehicles move in the same direction with closing speed ${n(i.relativeSpeed)} km/h. The slower vehicle travels at ${n(i.speedB)} km/h. Find the faster vehicle's speed.`,
        `A car gains on a bus at ${n(i.relativeSpeed)} km/h. If the bus travels at ${n(i.speedB)} km/h, what is the car's speed?`,
        `The speed difference between a faster van and a slower truck is ${n(i.relativeSpeed)} km/h. The truck moves at ${n(i.speedB)} km/h. Find the van's speed.`,
        `A faster vehicle closes a same-direction gap at ${n(i.relativeSpeed)} km/h while the slower vehicle moves at ${n(i.speedB)} km/h. Determine the faster speed.`,
        `A bus moves at ${n(i.speedB)} km/h and another bus gains on it at ${n(i.relativeSpeed)} km/h. What speed is the faster bus maintaining?`,
        `Two same-direction vehicles have relative speed ${n(i.relativeSpeed)} km/h. If the slower one's speed is ${n(i.speedB)} km/h, find the faster one's speed.`,
      ], v);

    case "findFasterSpeedFromCatchUpState":
      return pick([
        `A vehicle at ${n(i.speedB)} km/h has a ${n(i.headStartDistance)} km lead. It is caught after ${duration(i.meetingTime)}. Find the pursuer's speed.`,
        `A bus travelling at ${n(i.speedB)} km/h is ${n(i.headStartDistance)} km ahead when a car begins pursuit. The car catches it in ${duration(i.meetingTime)}. What is the car's speed?`,
        `A slower vehicle moves at ${n(i.speedB)} km/h with a head start of ${n(i.headStartDistance)} km. A faster vehicle catches it after ${duration(i.meetingTime)}. Determine the faster speed.`,
        `A truck at ${n(i.speedB)} km/h has an initial lead of ${n(i.headStartDistance)} km. A van erases this lead in ${duration(i.meetingTime)}. Find the van's speed.`,
        `A vehicle moving at ${n(i.speedB)} km/h is caught after ${duration(i.meetingTime)} despite being ${n(i.headStartDistance)} km ahead. How fast was the pursuing vehicle?`,
        `The slower of two same-direction vehicles travels at ${n(i.speedB)} km/h and starts ${n(i.headStartDistance)} km ahead. Catch-up takes ${duration(i.meetingTime)}. Find the faster speed.`,
      ], v);

    case "findSlowerSpeedFromCatchUpState":
      return pick([
        `A vehicle moving at ${n(i.speedA)} km/h catches another vehicle that had a ${n(i.headStartDistance)} km lead in ${duration(i.meetingTime)}. Find the slower vehicle's speed.`,
        `A car at ${n(i.speedA)} km/h catches a bus after ${duration(i.meetingTime)}. The bus was initially ${n(i.headStartDistance)} km ahead. What was the bus's speed?`,
        `A faster vehicle travels at ${n(i.speedA)} km/h and closes a ${n(i.headStartDistance)} km lead in ${duration(i.meetingTime)}. Determine the slower vehicle's speed.`,
        `A van at ${n(i.speedA)} km/h catches a lorry with a ${n(i.headStartDistance)} km head start after ${duration(i.meetingTime)}. Find the lorry's speed.`,
        `The pursuer's speed is ${n(i.speedA)} km/h. It catches a vehicle ${n(i.headStartDistance)} km ahead in ${duration(i.meetingTime)}. How fast is the vehicle ahead moving?`,
        `A faster same-direction vehicle at ${n(i.speedA)} km/h needs ${duration(i.meetingTime)} to erase a ${n(i.headStartDistance)} km lead. Find the slower speed.`,
      ], v);

    case "findDelayedStartCatchUpTime":
      return pick([
        `A bus leaves at ${n(i.speedB)} km/h. After ${duration(i.startDelay)}, a car leaves from the same point at ${n(i.speedA)} km/h in the same direction. How long after the car starts will it catch the bus?`,
        `A truck departs first at ${n(i.speedB)} km/h. A van travelling at ${n(i.speedA)} km/h starts ${duration(i.startDelay)} later from the same place. Find the van's pursuit time until catch-up.`,
        `A slower vehicle starts at ${n(i.speedB)} km/h. The faster vehicle, travelling at ${n(i.speedA)} km/h, begins ${duration(i.startDelay)} later. How much time does the faster vehicle need after starting to catch it?`,
        `A bus at ${n(i.speedB)} km/h gets a time lead of ${duration(i.startDelay)} before a car at ${n(i.speedA)} km/h starts from the same point. When will the car overtake the bus, measured from the car's start?`,
        `A lorry travels at ${n(i.speedB)} km/h and leaves ${duration(i.startDelay)} before a van travelling at ${n(i.speedA)} km/h. Both use the same road. Find the catch-up time after the van departs.`,
        `A vehicle moving at ${n(i.speedB)} km/h starts first. Another at ${n(i.speedA)} km/h starts from the same point ${duration(i.startDelay)} later. Determine the duration of the pursuit.`,
      ], v);

    case "findStartDelayFromCatchUpState":
      return pick([
        `A bus at ${n(i.speedB)} km/h is caught by a car at ${n(i.speedA)} km/h after ${duration(i.meetingTime)} of pursuit. Both started from the same point. How much earlier did the bus leave?`,
        `A van moving at ${n(i.speedA)} km/h starts later than a truck moving at ${n(i.speedB)} km/h and catches it after ${duration(i.meetingTime)}. Find the truck's start advantage in time.`,
        `Two vehicles leave the same place at different times in the same direction. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, and the faster one catches the slower after ${duration(i.meetingTime)} of pursuit. Find the start delay.`,
        `A car at ${n(i.speedA)} km/h overtakes a bus at ${n(i.speedB)} km/h after chasing it for ${duration(i.meetingTime)}. By how much time had the bus left earlier?`,
        `A truck travels at ${n(i.speedB)} km/h. A van at ${n(i.speedA)} km/h leaves later and catches it after ${duration(i.meetingTime)}. Calculate the van's delayed start.`,
        `A faster vehicle at ${n(i.speedA)} km/h catches a slower vehicle at ${n(i.speedB)} km/h after ${duration(i.meetingTime)} of pursuit. Both use the same starting point. Find how much earlier the slower vehicle started.`,
      ], v);

    case "findSeparationAfterMovingApart":
      return pick([
        `Two vehicles are ${n(i.initialSeparation)} km apart and then move directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What will their separation be after ${duration(i.elapsedTime)}?`,
        `A car and a bus begin ${n(i.initialSeparation)} km apart and travel in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance between them after ${duration(i.elapsedTime)}.`,
        `Two vehicles, initially ${n(i.initialSeparation)} km apart, move away from one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${duration(i.elapsedTime)}. Calculate the final gap.`,
        `The initial separation between two vehicles is ${n(i.initialSeparation)} km. They then travel directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far apart are they after ${duration(i.elapsedTime)}?`,
        `Two motorists start ${n(i.initialSeparation)} km apart and head away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine their separation ${duration(i.elapsedTime)} later.`,
        `A van and a truck are ${n(i.initialSeparation)} km apart before moving in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their separation after ${duration(i.elapsedTime)}.`,
      ], v);

    case "findInitialGapFromLaterSeparation":
      return pick([
        `Two vehicles move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After ${duration(i.elapsedTime)}, they are ${n(i.specifiedSeparation)} km apart. What was their initial separation?`,
        `A car and a bus travel in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their separation after ${duration(i.elapsedTime)} is ${n(i.specifiedSeparation)} km. Find the gap at the start.`,
        `Two motorists move directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the distance between them becomes ${n(i.specifiedSeparation)} km after ${duration(i.elapsedTime)}, determine the initial distance.`,
        `After travelling away from one another for ${duration(i.elapsedTime)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, two vehicles are ${n(i.specifiedSeparation)} km apart. How far apart were they initially?`,
        `Two vehicles increase their separation while travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in opposite directions. The final gap after ${duration(i.elapsedTime)} is ${n(i.specifiedSeparation)} km. Find the original gap.`,
        `A van and a truck head away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They are ${n(i.specifiedSeparation)} km apart after ${duration(i.elapsedTime)}. Calculate their starting separation.`,
      ], v);

    case "findTimeUntilSpecifiedSeparation":
      return pick(i.directionCase === "SAME" ? [
        `A car at ${n(i.speedA)} km/h follows a bus at ${n(i.speedB)} km/h. Their gap is ${n(i.initialSeparation)} km. How long will it take for the gap to reduce to ${n(i.specifiedSeparation)} km?`,
        `A faster vehicle at ${n(i.speedA)} km/h is behind a slower vehicle at ${n(i.speedB)} km/h. The separation falls from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Find the time taken.`,
        `A van at ${n(i.speedA)} km/h pursues a truck at ${n(i.speedB)} km/h. Starting ${n(i.initialSeparation)} km behind, when will it be only ${n(i.specifiedSeparation)} km behind?`,
        `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How long is required for their gap to shrink from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km?`,
        `A bus travelling at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead of a car travelling at ${n(i.speedA)} km/h. Find the time until the lead becomes ${n(i.specifiedSeparation)} km.`,
        `A faster vehicle closes on a slower one at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. The gap must fall from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Determine the time.`,
      ] : [
        `Two vehicles are ${n(i.initialSeparation)} km apart and move directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How long before their separation reaches ${n(i.specifiedSeparation)} km?`,
        `A car and a bus move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their gap grows from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Find the time required.`,
        `Two motorists start ${n(i.initialSeparation)} km apart and travel away from one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. When will they be ${n(i.specifiedSeparation)} km apart?`,
        `The distance between two separating vehicles rises from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in opposite directions. Find the elapsed time.`,
        `Two vehicles move directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the starting gap is ${n(i.initialSeparation)} km, how long will it take to become ${n(i.specifiedSeparation)} km?`,
        `A van and a truck head away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their initial separation is ${n(i.initialSeparation)} km. Determine the time until the gap is ${n(i.specifiedSeparation)} km.`,
      ], v);

    case "findMeetingPointDistanceSplit":
      return pick([
        `Two buses start together from opposite ends of a ${n(i.routeDistance)} km road at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far from the first bus's starting point do they meet?`,
        `A car and a van leave opposite ends of a ${n(i.routeDistance)} km route simultaneously at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance travelled by the car before their first meeting.`,
        `Two vehicles approach each other from the ends of a ${n(i.routeDistance)} km highway at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what distance from the first end will they meet?`,
        `From towns A and B, ${n(i.routeDistance)} km apart, two vehicles start at the same time towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres from A is the meeting point?`,
        `Two motorists start simultaneously from opposite ends of a ${n(i.routeDistance)} km road. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance covered by the first motorist at the instant they meet.`,
        `A bus at ${n(i.speedA)} km/h and a car at ${n(i.speedB)} km/h start from opposite ends of a ${n(i.routeDistance)} km route. Where, measured from the bus's end, does their first meeting occur?`,
      ], v);

    case "findMeetingPointFromSpeedRatio":
      return pick([
        `Two vehicles start simultaneously from opposite ends of a ${n(i.routeDistance)} km road. Their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. How far from the first end do they meet?`,
        `A bus and a car leave opposite ends of a ${n(i.routeDistance)} km route at the same time. Their speed ratio is ${n(i.ratioA)}:${n(i.ratioB)}. Find the distance travelled by the first vehicle before meeting.`,
        `Two motorists start towards each other from towns ${n(i.routeDistance)} km apart. If their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}, at what distance from the first town will they meet?`,
        `The speeds of two vehicles starting simultaneously from opposite ends of a ${n(i.routeDistance)} km highway are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. Locate their first meeting point from the first end.`,
        `Two vehicles divide a ${n(i.routeDistance)} km route at their first meeting in the same ratio as their speeds, ${n(i.ratioA)}:${n(i.ratioB)}. Find the distance from the first vehicle's starting end.`,
        `From opposite ends of a ${n(i.routeDistance)} km road, two vehicles start together with speed ratio ${n(i.ratioA)}:${n(i.ratioB)}. How many kilometres does the first one cover before they meet?`,
      ], v);

    case "findSpeedRatioFromMeetingPoint":
      return pick([
        `Two vehicles start together from opposite ends of a road and meet after travelling ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. Find the ratio of their speeds.`,
        `At their first meeting, two buses starting simultaneously from opposite ends have covered ${n(i.distanceA)} km and ${n(i.distanceB)} km. What is their speed ratio, first bus to second bus?`,
        `Two motorists start at the same time from opposite ends and meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km. Determine the ratio of their speeds in the same order.`,
        `A car from one end covers ${n(i.distanceA)} km before meeting a van from the other end that covers ${n(i.distanceB)} km. They started together. Find car speed : van speed.`,
        `Two vehicles travelling towards each other for the same amount of time cover ${n(i.distanceA)} km and ${n(i.distanceB)} km before meeting. What is the ratio of their speeds?`,
        `The first meeting point divides the distances travelled by two simultaneously starting vehicles into ${n(i.distanceA)} km and ${n(i.distanceB)} km. Find the speed ratio of the first vehicle to the second.`,
      ], v);

    case "findMeetingClockTime":
      return pick([
        `Two vehicles start at ${formatClockMinute(i.departureMinute!)} from points ${n(i.initialSeparation)} km apart and move ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what time do they meet?`,
        `At ${formatClockMinute(i.departureMinute!)}, two vehicles ${i.directionCase === "SAME" ? `are ${n(i.initialSeparation)} km apart and travel in the same direction` : `start ${n(i.initialSeparation)} km apart towards one another`} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the meeting clock time.`,
        `The initial gap between two vehicles is ${n(i.initialSeparation)} km. They begin at ${formatClockMinute(i.departureMinute!)} and move ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. When will the gap become zero?`,
        `Two vehicles set off at ${formatClockMinute(i.departureMinute!)} with a separation of ${n(i.initialSeparation)} km. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, moving ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"}. Find the clock time of first meeting.`,
        `A pair of vehicles begin moving at ${formatClockMinute(i.departureMinute!)} from positions ${n(i.initialSeparation)} km apart. At ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"}, at what time will they meet?`,
        `Starting at ${formatClockMinute(i.departureMinute!)}, two vehicles close a ${n(i.initialSeparation)} km gap ${i.directionCase === "SAME" ? "while moving in the same direction" : "while approaching each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the meeting time on the clock.`,
      ], v);

    case "findDepartureClockTimeFromMeetingState":
      return pick([
        `Two vehicles ${i.directionCase === "SAME" ? "travel in the same direction" : "travel towards each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h from positions ${n(i.initialSeparation)} km apart. They meet at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`,
        `A pair of vehicles meet at ${formatClockMinute(i.meetingClockMinute!)} after closing an initial ${n(i.initialSeparation)} km gap ${i.directionCase === "SAME" ? "in the same direction" : "while approaching each other"}. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their common start time.`,
        `Two vehicles were ${n(i.initialSeparation)} km apart when they started and moved ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If they met at ${formatClockMinute(i.meetingClockMinute!)}, when did the journey begin?`,
        `The first meeting of two vehicles occurs at ${formatClockMinute(i.meetingClockMinute!)}. They began ${n(i.initialSeparation)} km apart and travelled ${i.directionCase === "SAME" ? "in the same direction" : "towards one another"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine the departure time.`,
        `A ${n(i.initialSeparation)} km gap is closed by two vehicles moving ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the meeting is at ${formatClockMinute(i.meetingClockMinute!)}, find when they started.`,
        `Two vehicles meet at ${formatClockMinute(i.meetingClockMinute!)} after travelling from positions ${n(i.initialSeparation)} km apart. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and they move ${i.directionCase === "SAME" ? "in the same direction" : "towards each other"}. Find the starting clock time.`,
      ], v);

    case "findSpeedNeededToAvoidOrCauseMeeting":
      return pick(i.directionCase === "SAME" ? [
        `A bus ahead moves at ${n(i.speedB)} km/h and is ${n(i.initialSeparation)} km away. What speed must a car behind maintain to catch it exactly after ${duration(i.targetTime)}?`,
        `A truck travelling at ${n(i.speedB)} km/h has a lead of ${n(i.initialSeparation)} km. Find the constant speed a van must maintain to catch it in exactly ${duration(i.targetTime)}.`,
        `A slower vehicle at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead. What should be the speed of a pursuer so that the catch occurs after ${duration(i.targetTime)}?`,
        `A car must erase a ${n(i.initialSeparation)} km lead held by a bus travelling at ${n(i.speedB)} km/h within ${duration(i.targetTime)}. What constant speed should the car maintain?`,
        `A lorry moves at ${n(i.speedB)} km/h with a ${n(i.initialSeparation)} km head start. Determine the speed required by a following van to draw level exactly ${duration(i.targetTime)} later.`,
        `Two vehicles travel in the same direction. The front vehicle moves at ${n(i.speedB)} km/h and is ${n(i.initialSeparation)} km ahead. Find the speed the rear vehicle needs to catch it in ${duration(i.targetTime)}.`,
      ] : [
        `Two vehicles are ${n(i.initialSeparation)} km apart. One travels towards the other at ${n(i.speedB)} km/h. What speed must the second maintain towards the first so that they meet after exactly ${duration(i.targetTime)}?`,
        `A car and a bus are ${n(i.initialSeparation)} km apart and move towards each other. The bus travels at ${n(i.speedB)} km/h. Find the car's required speed if they must meet in ${duration(i.targetTime)}.`,
        `Two vehicles must close a ${n(i.initialSeparation)} km gap in exactly ${duration(i.targetTime)} while approaching each other. If one moves at ${n(i.speedB)} km/h, what speed is required of the other?`,
        `From points ${n(i.initialSeparation)} km apart, two vehicles start towards each other. One speed is ${n(i.speedB)} km/h. Determine the other speed needed for a meeting after ${duration(i.targetTime)}.`,
        `A vehicle travelling at ${n(i.speedB)} km/h heads towards another vehicle ${n(i.initialSeparation)} km away. What constant speed should the second vehicle use towards it to meet in ${duration(i.targetTime)}?`,
        `The required meeting time for two approaching vehicles is ${duration(i.targetTime)} and their starting separation is ${n(i.initialSeparation)} km. If one travels at ${n(i.speedB)} km/h, find the necessary speed of the other.`,
      ], v);
  }
}
