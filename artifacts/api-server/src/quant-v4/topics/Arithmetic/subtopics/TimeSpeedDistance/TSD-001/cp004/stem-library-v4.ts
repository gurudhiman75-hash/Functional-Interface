import { multiply, rational, type Rational } from "../foundation/rational";
import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004GeneratedState } from "./runtime-types";

const STRUCTURES = Object.freeze(["DIRECT", "OBSERVATION", "CHECKPOINT", "RECONSTRUCTION"] as const);
type Structure = (typeof STRUCTURES)[number];

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function dur(value: Rational | undefined): string {
  if (!value) return "?";
  const minutes = multiply(value, rational(60));
  if (minutes.denominator === 1n && minutes.numerator < 60n) {
    return `${minutes.numerator} minute${minutes.numerator === 1n ? "" : "s"}`;
  }
  return formatDurationHours(value);
}

function clock(value: Rational | undefined): string {
  return value ? formatClockMinute(value) : "?";
}

function rawVariant(state: TsdCp004GeneratedState): number {
  const parsed = Number(state.representation.split(":").at(-1) ?? "0");
  return Number.isInteger(parsed) ? ((parsed % 6) + 6) % 6 : 0;
}

function structureIndex(state: TsdCp004GeneratedState): number {
  return [0, 1, 2, 3, 0, 1][rawVariant(state)]!;
}

function choose(state: TsdCp004GeneratedState, rows: readonly [string, string, string, string]): string {
  return rows[structureIndex(state)]!;
}

function directionText(state: TsdCp004GeneratedState): string {
  return state.input.directionCase === "SAME" ? "in the same direction" : "towards each other";
}

export function cp004StemStructureSignature(state: TsdCp004GeneratedState): string {
  const direction = state.input.directionCase ? `:${state.input.directionCase}` : "";
  return `${state.solveMode}:${STRUCTURES[structureIndex(state)]}${direction}`;
}

export function renderCp004StemV4(state: TsdCp004GeneratedState): string {
  const i = state.input;

  switch (state.solveMode) {
    case "findRelativeSpeedOppositeDirections":
      return choose(state, [
        `A bus and a car pass the same toll plaza and continue in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what rate does the distance between them increase?`,
        `A road-control display shows two vehicles moving in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres per hour does their separation change?`,
        `Two vehicles approach the same kilometre marker from opposite sides at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their closing speed before they reach the marker.`,
        `An observer in a vehicle moving at ${n(i.speedA)} km/h sees another vehicle travelling in the opposite direction at ${n(i.speedB)} km/h. What is the second vehicle's speed relative to the observer?`,
      ]);

    case "findRelativeSpeedSameDirection":
      return choose(state, [
        `A car travelling at ${n(i.speedA)} km/h follows a bus travelling at ${n(i.speedB)} km/h in the same direction. At what rate is the car reducing the gap?`,
        `A tracking log records two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How much distance does the faster vehicle gain in one hour?`,
        `At a highway checkpoint, a faster van at ${n(i.speedA)} km/h is behind a truck at ${n(i.speedB)} km/h. Find the rate at which the gap closes after the van passes the checkpoint.`,
        `From the slower driver's frame of reference, another vehicle behind is travelling at ${n(i.speedA)} km/h while the slower vehicle itself moves at ${n(i.speedB)} km/h. What relative speed does the driver observe?`,
      ]);

    case "findMeetingTimeFromInitialSeparation":
      return i.directionCase === "SAME"
        ? choose(state, [
            `A car at ${n(i.speedA)} km/h is ${n(i.initialSeparation)} km behind a bus at ${n(i.speedB)} km/h. If both continue in the same direction, how long will the car take to catch the bus?`,
            `A traffic monitor records a ${n(i.initialSeparation)} km gap between two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how much time will the gap become zero?`,
            `When a fast van passes a checkpoint, a truck is already ${n(i.initialSeparation)} km ahead. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h respectively. Find the catch-up time from that instant.`,
            `A slower vehicle moving at ${n(i.speedB)} km/h has a lead of ${n(i.initialSeparation)} km over a faster vehicle moving at ${n(i.speedA)} km/h. Determine the time needed for the faster vehicle to erase the lead.`,
          ])
        : choose(state, [
            `Two vehicles are ${n(i.initialSeparation)} km apart and start towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how long will they meet?`,
            `A control room observes two approaching vehicles ${n(i.initialSeparation)} km apart. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How much time remains until their first meeting?`,
            `Two vehicles leave checkpoints A and B, which are ${n(i.initialSeparation)} km apart, at the same time towards each other. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the meeting time.`,
            `A road gap of ${n(i.initialSeparation)} km is being closed simultaneously from both ends at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. In how much time will the gap be completely closed?`,
          ]);

    case "findCatchUpTimeFromHeadStartDistance":
      return choose(state, [
        `A truck moving at ${n(i.speedB)} km/h has a head start of ${n(i.headStartDistance)} km. A van follows at ${n(i.speedA)} km/h. How long after the van starts will it catch the truck?`,
        `At the start of a pursuit, the lead is ${n(i.headStartDistance)} km. The leading and pursuing vehicles move at ${n(i.speedB)} km/h and ${n(i.speedA)} km/h. Find the pursuit time.`,
        `When a car passes a toll point at ${n(i.speedA)} km/h, a bus travelling at ${n(i.speedB)} km/h is already ${n(i.headStartDistance)} km farther along the same road. When will the car draw level with the bus?`,
        `A faster vehicle must recover a ${n(i.headStartDistance)} km lead held by a slower vehicle. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Calculate the time required to eliminate the lead.`,
      ]);

    case "findInitialSeparationFromMeetingTime":
      return i.directionCase === "SAME"
        ? choose(state, [
            `A car at ${n(i.speedA)} km/h catches a bus at ${n(i.speedB)} km/h after ${dur(i.meetingTime)}. What was the bus's initial lead?`,
            `Two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h become level after ${dur(i.meetingTime)}. Reconstruct the gap between them when the faster vehicle began the chase.`,
            `A van passes a checkpoint and catches a truck ${dur(i.meetingTime)} later. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far ahead of the checkpoint was the truck when the van passed it?`,
            `The faster of two vehicles gains on the slower for ${dur(i.meetingTime)} at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h until they meet. Find the distance that had to be gained.`,
          ])
        : choose(state, [
            `Two vehicles travelling towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h meet after ${dur(i.meetingTime)}. How far apart were they initially?`,
            `A meeting is observed ${dur(i.meetingTime)} after two approaching vehicles begin moving. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Reconstruct their original separation.`,
            `Vehicles leave checkpoints A and B simultaneously towards each other and meet after ${dur(i.meetingTime)}. If their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, find AB.`,
            `For ${dur(i.meetingTime)}, two vehicles close the road gap between them at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h until the gap becomes zero. What was the gap at the start?`,
          ]);

    case "findHeadStartDistanceFromCatchUpTime":
      return choose(state, [
        `A faster vehicle at ${n(i.speedA)} km/h catches a slower vehicle at ${n(i.speedB)} km/h after ${dur(i.meetingTime)}. Find the slower vehicle's initial head start.`,
        `A pursuit lasts ${dur(i.meetingTime)} before two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h become level. How much lead was erased?`,
        `A car passes a checkpoint and catches a bus ${dur(i.meetingTime)} later. The car and bus travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far ahead was the bus at the checkpoint instant?`,
        `The speed advantage of a pursuer is created by speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If the chase takes ${dur(i.meetingTime)}, determine the maximum initial lead that can be closed in that time.`,
      ]);

    case "findUnknownStartPointGap":
      return i.directionCase === "SAME"
        ? choose(state, [
            `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and become level after ${dur(i.meetingTime)}. Find their unknown initial gap.`,
            `A tracking system starts with an unknown separation between two same-direction vehicles. They move at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and the gap becomes zero after ${dur(i.meetingTime)}. Determine the starting gap.`,
            `When a faster vehicle crosses marker P, a slower vehicle is some distance ahead. They travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet ${dur(i.meetingTime)} later. How far ahead was the slower vehicle?`,
            `A same-direction lead is completely erased in ${dur(i.meetingTime)} by vehicles travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Reconstruct the lead.`,
          ])
        : choose(state, [
            `Two vehicles travel towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${dur(i.meetingTime)}. Find the unknown starting distance between them.`,
            `An unknown gap between two approaching vehicles disappears after ${dur(i.meetingTime)}. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine the original gap.`,
            `Vehicles leave two unknown-distance checkpoints simultaneously towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet after ${dur(i.meetingTime)}. Find the distance between the checkpoints.`,
            `Two vehicles jointly close an unknown road interval in ${dur(i.meetingTime)} while moving towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What was the interval?`,
          ]);

    case "findRelativeDistanceCoveredInGivenTime":
      return i.directionCase === "SAME"
        ? choose(state, [
            `Two vehicles travel in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${dur(i.elapsedTime)}. How much distance does the faster one gain?`,
            `A gap monitor follows two same-direction vehicles for ${dur(i.elapsedTime)} while they travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. By how many kilometres does the gap change?`,
            `From the moment a van crosses a checkpoint, it pursues a truck for ${dur(i.elapsedTime)} at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance gained by the van during this interval.`,
            `For ${dur(i.elapsedTime)}, a faster vehicle has a speed advantage created by ${n(i.speedA)} km/h versus ${n(i.speedB)} km/h. How much lead can that advantage erase?`,
          ])
        : choose(state, [
            `Two vehicles move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${dur(i.elapsedTime)}. Find the relative distance covered in that time.`,
            `The separation of two oppositely moving vehicles changes for ${dur(i.elapsedTime)} while their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. By how many kilometres does the separation change?`,
            `Two vehicles pass the same checkpoint and continue in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far apart are their travelled positions after ${dur(i.elapsedTime)}?`,
            `For ${dur(i.elapsedTime)}, two vehicles contribute simultaneously to opening a gap at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the total increase in separation.`,
          ]);

    case "findRelativeSpeedFromMeetingTime":
      return choose(state, [
        `A gap of ${n(i.initialSeparation)} km is closed in ${dur(i.meetingTime)}. What relative speed is required?`,
        `A tracking record shows that the separation between two vehicles changes by ${n(i.initialSeparation)} km in ${dur(i.meetingTime)}. Find the rate of change of the gap.`,
        `From one checkpoint reading to the meeting point, two vehicles eliminate ${n(i.initialSeparation)} km of relative distance in ${dur(i.meetingTime)}. Determine their relative speed.`,
        `The relative-motion equation for two vehicles has distance change ${n(i.initialSeparation)} km and elapsed time ${dur(i.meetingTime)}. Reconstruct the relative speed.`,
      ]);

    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed":
      return i.directionCase === "SAME"
        ? choose(state, [
            `Two vehicles move in the same direction. Their closing speed is ${n(i.relativeSpeed)} km/h and the slower vehicle travels at ${n(i.speedB)} km/h. Find the faster vehicle's speed.`,
            `A tracking display reports a relative speed of ${n(i.relativeSpeed)} km/h between two same-direction vehicles. If one vehicle moves at ${n(i.speedB)} km/h and is the slower one, determine the other speed.`,
            `At a checkpoint, a bus at ${n(i.speedB)} km/h is being gained on at ${n(i.relativeSpeed)} km/h by a vehicle behind. What is the speed of the pursuing vehicle?`,
            `A faster vehicle must exceed a ${n(i.speedB)} km/h vehicle by ${n(i.relativeSpeed)} km/h. Reconstruct the faster vehicle's speed.`,
          ])
        : choose(state, [
            `Two vehicles move towards each other with relative speed ${n(i.relativeSpeed)} km/h. One travels at ${n(i.speedB)} km/h. Find the speed of the other.`,
            `A closing-speed display reads ${n(i.relativeSpeed)} km/h for two approaching vehicles. If one contributes ${n(i.speedB)} km/h, determine the other vehicle's speed.`,
            `At a road checkpoint, two vehicles approach one another. Their combined closing speed is ${n(i.relativeSpeed)} km/h and one vehicle travels at ${n(i.speedB)} km/h. Find the second speed.`,
            `The sum of two opposing vehicle speeds is ${n(i.relativeSpeed)} km/h. If one speed is ${n(i.speedB)} km/h, reconstruct the other speed.`,
          ]);

    case "findFasterSpeedFromCatchUpState":
      return choose(state, [
        `A slower vehicle travels at ${n(i.speedB)} km/h and has a ${n(i.headStartDistance)} km lead. A faster vehicle catches it in ${dur(i.meetingTime)}. Find the faster vehicle's speed.`,
        `A pursuit record shows a ${n(i.headStartDistance)} km lead erased in ${dur(i.meetingTime)} while the leading vehicle moves at ${n(i.speedB)} km/h. Determine the pursuer's speed.`,
        `When a pursuer crosses a checkpoint, a vehicle moving at ${n(i.speedB)} km/h is ${n(i.headStartDistance)} km ahead. They become level after ${dur(i.meetingTime)}. What was the pursuer's speed?`,
        `A vehicle must gain ${n(i.headStartDistance)} km in ${dur(i.meetingTime)} on another vehicle moving at ${n(i.speedB)} km/h. Find the speed required of the faster vehicle.`,
      ]);

    case "findSlowerSpeedFromCatchUpState":
      return choose(state, [
        `A vehicle travelling at ${n(i.speedA)} km/h catches another vehicle that had a ${n(i.headStartDistance)} km lead in ${dur(i.meetingTime)}. Find the slower vehicle's speed.`,
        `A pursuit lasts ${dur(i.meetingTime)} and erases a ${n(i.headStartDistance)} km lead. If the faster vehicle travels at ${n(i.speedA)} km/h, determine the speed of the vehicle ahead.`,
        `At a checkpoint instant, a slower vehicle is ${n(i.headStartDistance)} km ahead of a pursuer moving at ${n(i.speedA)} km/h. The pursuer catches it after ${dur(i.meetingTime)}. Find the slower speed.`,
        `A ${n(i.speedA)} km/h vehicle gains exactly ${n(i.headStartDistance)} km on another vehicle during ${dur(i.meetingTime)}. Reconstruct the other vehicle's speed.`,
      ]);

    case "findDelayedStartCatchUpTime":
      return choose(state, [
        `A bus leaves at ${n(i.speedB)} km/h. After ${dur(i.startDelay)}, a car leaves the same point in the same direction at ${n(i.speedA)} km/h. How long after the car starts will it catch the bus?`,
        `The slower vehicle gets a time advantage of ${dur(i.startDelay)} at ${n(i.speedB)} km/h before a ${n(i.speedA)} km/h pursuer starts. Find the duration of the chase after the pursuer starts.`,
        `A bus passes a checkpoint at ${n(i.speedB)} km/h. A car passes the same checkpoint ${dur(i.startDelay)} later at ${n(i.speedA)} km/h. How long after the car passes the checkpoint will it catch the bus?`,
        `A delayed pursuer starts ${dur(i.startDelay)} after a vehicle moving at ${n(i.speedB)} km/h and then travels at ${n(i.speedA)} km/h. Determine the pursuer's catch-up time, measured from its own start.`,
      ]);

    case "findStartDelayFromCatchUpState":
      return choose(state, [
        `A bus at ${n(i.speedB)} km/h starts first. A car at ${n(i.speedA)} km/h starts later and catches it after ${dur(i.meetingTime)} of pursuit. How much later did the car start?`,
        `The chase portion lasts ${dur(i.meetingTime)} between vehicles travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Reconstruct the leading vehicle's time advantage before the chase began.`,
        `A bus passes a checkpoint first at ${n(i.speedB)} km/h. A car later passes the same checkpoint at ${n(i.speedA)} km/h and catches the bus ${dur(i.meetingTime)} afterward. Find the time gap between their checkpoint crossings.`,
        `A faster vehicle needs ${dur(i.meetingTime)} after its own start to erase the lead created by a slower ${n(i.speedB)} km/h vehicle. If the faster speed is ${n(i.speedA)} km/h, determine the original start delay.`,
      ]);

    case "findSeparationAfterMovingApart":
      return choose(state, [
        `Two vehicles are initially ${n(i.initialSeparation)} km apart and then move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${dur(i.elapsedTime)}. What is their separation then?`,
        `A tracking system records an initial separation of ${n(i.initialSeparation)} km. The vehicles then travel directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${dur(i.elapsedTime)}. Find the later separation.`,
        `Vehicles start ${n(i.initialSeparation)} km apart on opposite sides of a checkpoint and continue away from one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far apart are they ${dur(i.elapsedTime)} later?`,
        `Starting from a ${n(i.initialSeparation)} km gap, two vehicles add separation for ${dur(i.elapsedTime)} at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in opposite directions. Calculate the final gap.`,
      ]);

    case "findInitialGapFromLaterSeparation":
      return choose(state, [
        `Two vehicles move away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After ${dur(i.elapsedTime)}, they are ${n(i.specifiedSeparation)} km apart. What was their initial separation?`,
        `A tracking record shows a later separation of ${n(i.specifiedSeparation)} km after ${dur(i.elapsedTime)} of opposite movement at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Reconstruct the starting gap.`,
        `Two vehicles leave an unknown-distance pair of checkpoints and move directly apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their separation after ${dur(i.elapsedTime)} is ${n(i.specifiedSeparation)} km. Find the checkpoint distance.`,
        `The final gap is ${n(i.specifiedSeparation)} km after two vehicles have spent ${dur(i.elapsedTime)} increasing their separation at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Remove the added separation to find the original gap.`,
      ]);

    case "findTimeUntilSpecifiedSeparation":
      return i.directionCase === "SAME"
        ? choose(state, [
            `A car at ${n(i.speedA)} km/h follows a bus at ${n(i.speedB)} km/h. Their gap is ${n(i.initialSeparation)} km. After how long will it reduce to ${n(i.specifiedSeparation)} km?`,
            `A gap monitor shows ${n(i.initialSeparation)} km between two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How long until the display reads ${n(i.specifiedSeparation)} km?`,
            `At a checkpoint instant the lead is ${n(i.initialSeparation)} km. The faster and slower vehicles travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the time needed for the lead to become ${n(i.specifiedSeparation)} km.`,
            `Two same-direction vehicles must reduce their separation from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km while maintaining ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine the required time.`,
          ])
        : choose(state, [
            `Two vehicles are ${n(i.initialSeparation)} km apart and move directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After how long will their separation be ${n(i.specifiedSeparation)} km?`,
            `A separation monitor rises from ${n(i.initialSeparation)} km to a target of ${n(i.specifiedSeparation)} km while two vehicles move apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the elapsed time.`,
            `From an initial checkpoint separation of ${n(i.initialSeparation)} km, two vehicles drive away from one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. When will the gap reach ${n(i.specifiedSeparation)} km?`,
            `A road gap must increase from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km under opposite movement at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Calculate the time needed.`,
          ]);

    case "findMeetingPointDistanceSplit":
      return choose(state, [
        `Two vehicles start simultaneously from opposite ends of a ${n(i.routeDistance)} km road at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far from the first end do they meet?`,
        `A first-meeting record on a ${n(i.routeDistance)} km route involves vehicles travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h from opposite ends. Determine the meeting-point distance measured from the first vehicle's end.`,
        `Vehicles leave checkpoints A and B, ${n(i.routeDistance)} km apart, simultaneously towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find AM, where M is their first meeting point.`,
        `A ${n(i.routeDistance)} km road is divided by the first meeting of two simultaneously-started vehicles whose speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Calculate the portion travelled by the first vehicle.`,
      ]);

    case "findMeetingPointFromSpeedRatio":
      return choose(state, [
        `Two vehicles leave opposite ends of a ${n(i.routeDistance)} km road simultaneously. Their speed ratio is ${n(i.ratioA)}:${n(i.ratioB)}. How far from the first end do they meet?`,
        `A ${n(i.routeDistance)} km route is shared until first meeting by two vehicles whose speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. Find the first vehicle's share of the route.`,
        `Checkpoints A and B are ${n(i.routeDistance)} km apart. Vehicles start together from A and B towards each other with speed ratio ${n(i.ratioA)}:${n(i.ratioB)}. Find AM at their first meeting M.`,
        `The first meeting divides a ${n(i.routeDistance)} km road in the same proportion as speeds ${n(i.ratioA)}:${n(i.ratioB)}. Determine the distance from the first end to the meeting point.`,
      ]);

    case "findSpeedRatioFromMeetingPoint":
      return choose(state, [
        `Two vehicles start simultaneously from opposite ends and meet after travelling ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. Find the ratio of their speeds in the same order.`,
        `At first meeting, a road log shows that the first vehicle has covered ${n(i.distanceA)} km while the second has covered ${n(i.distanceB)} km. What speed ratio does this imply?`,
        `Vehicles from checkpoints A and B start together and meet at M, with AM = ${n(i.distanceA)} km and BM = ${n(i.distanceB)} km. Determine speed from A : speed from B.`,
        `Two vehicles travel for exactly the same time before first meeting, covering ${n(i.distanceA)} km and ${n(i.distanceB)} km. Reconstruct the ratio of their speeds and reduce it to lowest terms.`,
      ]);

    case "findMeetingClockTime":
      return choose(state, [
        `Two vehicles start at ${clock(i.departureMinute)} with an initial separation of ${n(i.initialSeparation)} km and travel ${directionText(state)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what clock time will they meet?`,
        `A dispatch log records departure at ${clock(i.departureMinute)}. The vehicles are ${n(i.initialSeparation)} km apart and move ${directionText(state)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the logged meeting time.`,
        `At ${clock(i.departureMinute)}, two vehicles begin the relative-motion phase from a ${n(i.initialSeparation)} km gap. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${directionText(state)}. When will the gap become zero?`,
        `Starting from ${clock(i.departureMinute)}, add the travel time needed for a ${n(i.initialSeparation)} km relative gap to close under speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${directionText(state)}. What is the resulting meeting clock time?`,
      ]);

    case "findDepartureClockTimeFromMeetingState":
      return choose(state, [
        `Two vehicles meet at ${clock(i.meetingClockMinute)} after closing an initial gap of ${n(i.initialSeparation)} km while travelling ${directionText(state)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what time did they start?`,
        `A dispatch record shows the meeting at ${clock(i.meetingClockMinute)}. The initial separation was ${n(i.initialSeparation)} km and the speeds were ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${directionText(state)}. Reconstruct the departure time.`,
        `The relative-motion phase ends at ${clock(i.meetingClockMinute)} when a ${n(i.initialSeparation)} km gap becomes zero. With speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${directionText(state)}, when did that phase begin?`,
        `Work backwards from a meeting at ${clock(i.meetingClockMinute)}. The vehicles had to close ${n(i.initialSeparation)} km at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h ${directionText(state)}. Find the starting clock time.`,
      ]);

    case "findSpeedNeededToAvoidOrCauseMeeting":
      return i.directionCase === "SAME"
        ? choose(state, [
            `A bus moving at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead. What constant speed must a pursuing car maintain to catch it exactly after ${dur(i.targetTime)}?`,
            `A pursuit target requires a ${n(i.initialSeparation)} km lead to become zero in ${dur(i.targetTime)} while the leading vehicle continues at ${n(i.speedB)} km/h. Find the required pursuer speed.`,
            `When a car crosses a checkpoint, a bus travelling at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead. What car speed will produce a catch exactly ${dur(i.targetTime)} later?`,
            `A faster vehicle has ${dur(i.targetTime)} to erase a ${n(i.initialSeparation)} km same-direction lead over a vehicle moving at ${n(i.speedB)} km/h. Determine the speed the faster vehicle must maintain.`,
          ])
        : choose(state, [
            `Two vehicles are ${n(i.initialSeparation)} km apart. One approaches at ${n(i.speedB)} km/h. What speed must the other maintain towards it so that they meet exactly after ${dur(i.targetTime)}?`,
            `A meeting target requires a ${n(i.initialSeparation)} km gap to close in ${dur(i.targetTime)}. If one approaching vehicle contributes ${n(i.speedB)} km/h, find the speed required from the other.`,
            `From two checkpoints ${n(i.initialSeparation)} km apart, one vehicle travels towards the other at ${n(i.speedB)} km/h. What speed must the second use to make the meeting occur after ${dur(i.targetTime)}?`,
            `Two approaching vehicles must jointly close ${n(i.initialSeparation)} km in ${dur(i.targetTime)}. One speed is ${n(i.speedB)} km/h. Reconstruct the required speed of the other vehicle.`,
          ]);
  }
}
