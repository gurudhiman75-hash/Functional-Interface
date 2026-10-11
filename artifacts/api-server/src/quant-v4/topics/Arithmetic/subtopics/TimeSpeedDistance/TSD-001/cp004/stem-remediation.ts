import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import { multiply, rational, type Rational } from "../foundation/rational";
import type { TsdCp004GeneratedState } from "./runtime-types";

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function h(value: Rational | undefined): string {
  return value ? formatDurationHours(value) : "?";
}

function friendlyDuration(value: Rational | undefined): string {
  if (!value) return "?";
  if (value.numerator >= value.denominator) return formatDurationHours(value);
  const minutes = multiply(value, rational(60));
  if (minutes.denominator === 1n) return `${minutes.numerator} minute${minutes.numerator === 1n ? "" : "s"}`;
  const seconds = multiply(minutes, rational(60));
  const wholeSeconds = seconds.numerator / seconds.denominator;
  const wholeMinutes = wholeSeconds / 60n;
  const remainingSeconds = wholeSeconds % 60n;
  return wholeMinutes > 0n
    ? `${wholeMinutes} minute${wholeMinutes === 1n ? "" : "s"} ${remainingSeconds} seconds`
    : `${remainingSeconds} seconds`;
}

function variant(state: TsdCp004GeneratedState): number {
  return Number(state.representation.split(":").at(-1) ?? "0") % 3;
}

export function remediateCp004Stem(state: TsdCp004GeneratedState, rawStem: string): string {
  const i = state.input;
  const v = variant(state);

  switch (state.solveMode) {
    case "findRelativeSpeedOppositeDirections":
      return [
        `A bus and a car cross the same toll point and continue in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what rate does the distance between them increase?`,
        `Two delivery vans leave a warehouse at the same instant in opposite directions. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their relative speed.`,
        `On a straight highway, two vehicles move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres farther apart do they become each hour?`,
      ][v];

    case "findRelativeSpeedSameDirection":
      return [
        `A car at ${n(i.speedA)} km/h is chasing a van moving ahead at ${n(i.speedB)} km/h. At what rate is the gap closing?`,
        `A patrol vehicle moving at ${n(i.speedA)} km/h follows a jeep travelling in the same direction at ${n(i.speedB)} km/h. Find the relative speed of approach.`,
        `Two vehicles travel along the same road in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How much distance does the faster vehicle gain on the slower one each hour?`,
      ][v];

    case "findMeetingTimeFromInitialSeparation":
      if (i.directionCase === "SAME") {
        return [
          `A car is ${n(i.initialSeparation)} km behind a bus. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h respectively. If both continue in the same direction, when will the car catch the bus?`,
          `A van moving at ${n(i.speedB)} km/h passes a checkpoint ${n(i.initialSeparation)} km before a faster car travelling at ${n(i.speedA)} km/h reaches the same point. How long after the car reaches the checkpoint will it catch the van?`,
          `The gap between a faster vehicle and a slower vehicle ahead is ${n(i.initialSeparation)} km. They move at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in the same direction. Find the catch-up time.`,
        ][v];
      }
      return [
        `Two towns are ${n(i.initialSeparation)} km apart. A car leaves one town at ${n(i.speedA)} km/h while a bus leaves the other at ${n(i.speedB)} km/h towards the car. After how long will they meet?`,
        `Two vehicles start simultaneously from opposite ends of a ${n(i.initialSeparation)} km road and move towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the time of first meeting.`,
        `A bus and a car are ${n(i.initialSeparation)} km apart and approach each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How much time remains before they meet?`,
      ][v];

    case "findCatchUpTimeFromHeadStartDistance":
      return [
        `A bus travelling at ${n(i.speedB)} km/h is already ${n(i.headStartDistance)} km ahead when a car starts after it at ${n(i.speedA)} km/h. How long will the car take to catch the bus?`,
        `A delivery van has a ${n(i.headStartDistance)} km lead and moves at ${n(i.speedB)} km/h. A faster vehicle follows at ${n(i.speedA)} km/h. Find the catch-up time.`,
        `When a car begins pursuit at ${n(i.speedA)} km/h, a slower vehicle moving at ${n(i.speedB)} km/h is ${n(i.headStartDistance)} km ahead. After how long will the gap become zero?`,
      ][v];

    case "findInitialSeparationFromMeetingTime":
      if (i.directionCase === "SAME") {
        return [
          `A car at ${n(i.speedA)} km/h catches a bus moving at ${n(i.speedB)} km/h after ${h(i.meetingTime)}. What was the initial gap between them?`,
          `Two vehicles move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. The faster one catches the slower after ${h(i.meetingTime)}. Find the slower vehicle's initial lead.`,
          `A faster vehicle gains on a slower one for ${h(i.meetingTime)} before catching it. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far ahead was the slower vehicle initially?`,
        ][v];
      }
      return [
        `A car and a bus start from two towns towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${h(i.meetingTime)}. Find the distance between the towns.`,
        `Two vehicles approach one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet ${h(i.meetingTime)} after starting. How far apart were they initially?`,
        `Starting simultaneously from opposite ends, two vehicles travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h meet in ${h(i.meetingTime)}. Determine the length of the route.`,
      ][v];

    case "findHeadStartDistanceFromCatchUpTime":
      return [
        `A car at ${n(i.speedA)} km/h catches a bus moving at ${n(i.speedB)} km/h after ${h(i.meetingTime)}. How many kilometres ahead was the bus when the car started?`,
        `A slower vehicle has a lead over a faster vehicle. They move at ${n(i.speedB)} km/h and ${n(i.speedA)} km/h, and the faster vehicle catches it in ${h(i.meetingTime)}. Find the original lead.`,
        `A pursuer travelling at ${n(i.speedA)} km/h closes on a vehicle travelling at ${n(i.speedB)} km/h and catches it after ${h(i.meetingTime)}. What head start did the slower vehicle have?`,
      ][v];

    case "findUnknownStartPointGap":
      if (i.directionCase === "SAME") {
        return [
          `Two vehicles moving in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h meet after ${h(i.meetingTime)}. Find the initial gap between them.`,
          `A faster car closes an unknown lead held by a slower vehicle in ${h(i.meetingTime)}. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine that lead.`,
          `The faster of two same-direction vehicles travels at ${n(i.speedA)} km/h and the slower at ${n(i.speedB)} km/h. If the catch occurs after ${h(i.meetingTime)}, what was their starting separation?`,
        ][v];
      }
      return [
        `Two vehicles start towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and meet after ${h(i.meetingTime)}. What was their starting separation?`,
        `A car and a bus approach from opposite ends and meet after ${h(i.meetingTime)} while travelling at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the original gap.`,
        `Two vehicles close an unknown distance in ${h(i.meetingTime)} at speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Determine the distance they were apart at the start.`,
      ][v];

    case "findRelativeDistanceCoveredInGivenTime":
      if (i.directionCase === "SAME") {
        return [
          `Two vehicles travel in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${h(i.elapsedTime)}. By how much does the faster vehicle change the gap relative to the slower one?`,
          `A faster car and a slower van move in the same direction for ${h(i.elapsedTime)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres does the car gain?`,
          `For ${h(i.elapsedTime)}, two vehicles maintain speeds of ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in the same direction. Find the relative distance covered.`,
        ][v];
      }
      return [
        `Two vehicles leave the same point in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far apart will their motions carry them in ${h(i.elapsedTime)}?`,
        `Two vehicles move in opposite directions for ${h(i.elapsedTime)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the relative distance covered.`,
        `A car and a bus travel directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${h(i.elapsedTime)}. By how much does their separation increase?`,
      ][v];

    case "findRelativeSpeedFromMeetingTime":
      return [
        `Two vehicles close a distance of ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. What relative speed does this imply?`,
        `A faster vehicle eliminates a ${n(i.initialSeparation)} km gap in ${h(i.meetingTime)}. Find the closing speed.`,
        `The distance between two moving vehicles changes by ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. Find the corresponding relative speed.`,
      ][v];

    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed":
      if (i.directionCase === "SAME") {
        return [
          `A van moves at ${n(i.speedB)} km/h and a car gains on it at ${n(i.relativeSpeed)} km/h. Find the car's speed.`,
          `Two vehicles move in the same direction. The slower one travels at ${n(i.speedB)} km/h and the closing speed is ${n(i.relativeSpeed)} km/h. What is the faster vehicle's speed?`,
          `A faster vehicle is gaining ${n(i.relativeSpeed)} km every hour on a vehicle travelling at ${n(i.speedB)} km/h. Find the faster vehicle's speed.`,
        ][v];
      }
      return [
        `Two vehicles approach each other with relative speed ${n(i.relativeSpeed)} km/h. If one travels at ${n(i.speedB)} km/h, find the other's speed.`,
        `The combined approach speed of two vehicles is ${n(i.relativeSpeed)} km/h. One vehicle moves at ${n(i.speedB)} km/h. What is the speed of the second?`,
        `A car and a bus travel towards each other. Their relative speed is ${n(i.relativeSpeed)} km/h and the bus speed is ${n(i.speedB)} km/h. Find the car speed.`,
      ][v];

    case "findFasterSpeedFromCatchUpState":
      return [
        `A vehicle moving at ${n(i.speedB)} km/h has a ${n(i.headStartDistance)} km lead. It is caught after ${h(i.meetingTime)}. Find the pursuer's speed.`,
        `A slower vehicle travels at ${n(i.speedB)} km/h. A faster vehicle starts ${n(i.headStartDistance)} km behind and catches it in ${h(i.meetingTime)}. What is the faster speed?`,
        `A ${n(i.headStartDistance)} km gap is closed in ${h(i.meetingTime)} while the vehicle ahead travels at ${n(i.speedB)} km/h. Find the speed of the vehicle behind.`,
      ][v];

    case "findSlowerSpeedFromCatchUpState":
      return [
        `A car travelling at ${n(i.speedA)} km/h catches a vehicle that had a ${n(i.headStartDistance)} km lead in ${h(i.meetingTime)}. Find the slower vehicle's speed.`,
        `A faster vehicle at ${n(i.speedA)} km/h closes a ${n(i.headStartDistance)} km gap in ${h(i.meetingTime)}. What speed was the vehicle ahead maintaining?`,
        `The pursuer travels at ${n(i.speedA)} km/h and catches a vehicle ${n(i.headStartDistance)} km ahead after ${h(i.meetingTime)}. Find the speed of the vehicle being pursued.`,
      ][v];

    case "findDelayedStartCatchUpTime":
      return [
        `A bus leaves a stop at ${n(i.speedB)} km/h. After ${friendlyDuration(i.startDelay)}, a car leaves the same stop at ${n(i.speedA)} km/h in the same direction. How long after the car starts will it catch the bus?`,
        `A van starts first at ${n(i.speedB)} km/h. A faster vehicle begins from the same point ${friendlyDuration(i.startDelay)} later at ${n(i.speedA)} km/h. Find the pursuit time needed to catch the van.`,
        `A slower vehicle gets a ${friendlyDuration(i.startDelay)} time lead at ${n(i.speedB)} km/h before a faster vehicle starts at ${n(i.speedA)} km/h. How long will the faster vehicle take to catch it?`,
      ][v];

    case "findStartDelayFromCatchUpState":
      return [
        `A bus at ${n(i.speedB)} km/h is caught by a car travelling at ${n(i.speedA)} km/h after the car has driven for ${h(i.meetingTime)}. Both started from the same point. How much earlier did the bus leave?`,
        `A slower vehicle leaves first at ${n(i.speedB)} km/h. A faster vehicle later starts from the same point at ${n(i.speedA)} km/h and catches it after ${h(i.meetingTime)} of pursuit. Find the start delay.`,
        `A car at ${n(i.speedA)} km/h needs ${h(i.meetingTime)} to catch a vehicle moving at ${n(i.speedB)} km/h that left from the same point earlier. By how much time did the slower vehicle start first?`,
      ][v];

    case "findSeparationAfterMovingApart":
      return [
        `Two vehicles are already ${n(i.initialSeparation)} km apart when they begin moving directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What will their separation be after ${h(i.elapsedTime)}?`,
        `From two points ${n(i.initialSeparation)} km apart, two vehicles travel in opposite outward directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h for ${h(i.elapsedTime)}. How far apart are they then?`,
        `The initial gap between two vehicles is ${n(i.initialSeparation)} km. They move farther apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the gap after ${h(i.elapsedTime)}.`,
      ][v];

    case "findInitialGapFromLaterSeparation":
      return [
        `Two vehicles move directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. After ${h(i.elapsedTime)}, their separation is ${n(i.specifiedSeparation)} km. What was the original gap?`,
        `After travelling outward for ${h(i.elapsedTime)} at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, two vehicles are ${n(i.specifiedSeparation)} km apart. Find their initial separation.`,
        `Two vehicles started from different points and moved farther apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Their gap after ${h(i.elapsedTime)} is ${n(i.specifiedSeparation)} km. Determine the starting gap.`,
      ][v];

    case "findTimeUntilSpecifiedSeparation":
      if (i.directionCase === "SAME") {
        return [
          `A car at ${n(i.speedA)} km/h follows a bus at ${n(i.speedB)} km/h. Their gap is ${n(i.initialSeparation)} km. How long will it take for the gap to fall to ${n(i.specifiedSeparation)} km?`,
          `The distance between a faster vehicle and a slower one ahead must reduce from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the required time.`,
          `A faster car gains on a bus moving at ${n(i.speedB)} km/h while travelling at ${n(i.speedA)} km/h. Starting ${n(i.initialSeparation)} km behind, when will it be only ${n(i.specifiedSeparation)} km behind?`,
        ][v];
      }
      return [
        `Two vehicles are ${n(i.initialSeparation)} km apart and move directly away from each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. When will their separation reach ${n(i.specifiedSeparation)} km?`,
        `The gap between two outward-moving vehicles increases from ${n(i.initialSeparation)} km to ${n(i.specifiedSeparation)} km. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the time taken.`,
        `Two vehicles move apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. If they begin ${n(i.initialSeparation)} km apart, after how long will they be ${n(i.specifiedSeparation)} km apart?`,
      ][v];

    case "findMeetingPointDistanceSplit":
      return [
        `A car and a bus start simultaneously from opposite ends of a ${n(i.routeDistance)} km road at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How far from the car's starting end do they meet?`,
        `Two vehicles leave towns A and B, ${n(i.routeDistance)} km apart, towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the distance from A to their first meeting point.`,
        `On a ${n(i.routeDistance)} km route, two vehicles start together from opposite ends at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what distance from the first end will they meet?`,
      ][v];

    case "findMeetingPointFromSpeedRatio":
      return [
        `Two vehicles start simultaneously from opposite ends of a ${n(i.routeDistance)} km road. Their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. How far from the first vehicle's starting end is the meeting point?`,
        `Towns A and B are ${n(i.routeDistance)} km apart. Two vehicles leave them at the same time towards each other with speed ratio ${n(i.ratioA)}:${n(i.ratioB)}. Find the distance from A to the meeting point.`,
        `A ${n(i.routeDistance)} km route is covered from opposite ends by two vehicles whose speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. If they start together, where will they first meet measured from the first end?`,
      ][v];

    case "findSpeedRatioFromMeetingPoint":
      return [
        `Two vehicles leave opposite ends of a road at the same time and meet after the first has covered ${n(i.distanceA)} km and the second ${n(i.distanceB)} km. Find their speed ratio.`,
        `At their first meeting, a car from town A has travelled ${n(i.distanceA)} km while a bus from town B has travelled ${n(i.distanceB)} km. Both started together. What is the ratio of their speeds?`,
        `Two vehicles starting simultaneously from opposite ends meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. Determine speed of first : speed of second.`,
      ][v];

    case "findMeetingClockTime":
      return [
        `Two vehicles start at ${formatClockMinute(i.departureMinute!)} from points ${n(i.initialSeparation)} km apart and move towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what time will they meet?`,
        `At ${formatClockMinute(i.departureMinute!)}, a car and a bus begin moving towards each other from locations ${n(i.initialSeparation)} km apart. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the meeting time on the clock.`,
        `Two vehicles ${n(i.initialSeparation)} km apart set off simultaneously at ${formatClockMinute(i.departureMinute!)} towards one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. When do they meet?`,
      ][v];

    case "findDepartureClockTimeFromMeetingState":
      if (i.directionCase === "SAME") {
        return [
          `A car started ${n(i.initialSeparation)} km behind a bus. They travelled in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and the car caught the bus at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`,
          `Two vehicles began at the same time with a ${n(i.initialSeparation)} km gap, moving in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They met at ${formatClockMinute(i.meetingClockMinute!)}. Find their starting time.`,
          `A faster vehicle at ${n(i.speedA)} km/h chased a slower one at ${n(i.speedB)} km/h from ${n(i.initialSeparation)} km behind and caught it at ${formatClockMinute(i.meetingClockMinute!)}. When did the chase begin?`,
        ][v];
      }
      return [
        `Two vehicles started together from points ${n(i.initialSeparation)} km apart, moving towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They met at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`,
        `A car and a bus approached each other from locations ${n(i.initialSeparation)} km apart at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h and met at ${formatClockMinute(i.meetingClockMinute!)}. Find their departure time.`,
        `Two vehicles travelling towards one another at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h closed a ${n(i.initialSeparation)} km gap and met at ${formatClockMinute(i.meetingClockMinute!)}. When had they set out?`,
      ][v];

    case "findSpeedNeededToAvoidOrCauseMeeting":
      if (i.directionCase === "SAME") {
        return [
          `A bus ahead travels at ${n(i.speedB)} km/h and has a lead of ${n(i.initialSeparation)} km. What speed must a car maintain to catch it exactly in ${h(i.targetTime)}?`,
          `A pursuing vehicle is ${n(i.initialSeparation)} km behind a vehicle moving at ${n(i.speedB)} km/h. Find the pursuer's required speed if the catch must occur after ${h(i.targetTime)}.`,
          `A slower vehicle moving at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead. What constant speed should the faster vehicle use so that the gap becomes zero in ${h(i.targetTime)}?`,
        ][v];
      }
      return [
        `Two vehicles are ${n(i.initialSeparation)} km apart. One approaches at ${n(i.speedB)} km/h. What speed must the other maintain towards it so that they meet in exactly ${h(i.targetTime)}?`,
        `A car and another vehicle are ${n(i.initialSeparation)} km apart and head towards each other. If one moves at ${n(i.speedB)} km/h, find the second vehicle's required speed for a meeting after ${h(i.targetTime)}.`,
        `A ${n(i.initialSeparation)} km gap must be closed in ${h(i.targetTime)} by two approaching vehicles. One travels at ${n(i.speedB)} km/h. What speed is required of the other?`,
      ][v];
  }

  return rawStem.replaceAll("a straight cycling route", "a straight road");
}
