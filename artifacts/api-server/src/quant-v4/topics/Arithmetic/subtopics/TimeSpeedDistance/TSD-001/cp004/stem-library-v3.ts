import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { Rational } from "../foundation/rational";
import type { TsdCp004GeneratedState } from "./runtime-types";
import { renderCp004StemV2 } from "./stem-library-v2";

function n(value: Rational | undefined): string { return value ? formatExamNumber(value) : "?"; }
function h(value: Rational | undefined): string { return value ? formatDurationHours(value) : "?"; }
function v(state: TsdCp004GeneratedState): number { return Number(state.representation.split(":").at(-1) ?? "0") % 6; }
function pick(values: readonly string[], index: number): string { return values[index % values.length]!; }

export function renderCp004StemV3(state: TsdCp004GeneratedState): string {
  const i = state.input;
  const variant = v(state);

  if (state.solveMode === "findRelativeSpeedOppositeDirections") {
    return pick([
      `A bus leaves a toll plaza eastward at ${n(i.speedA)} km/h while a car leaves the same plaza westward at ${n(i.speedB)} km/h. How fast is the distance between them increasing?`,
      `Two vehicles approach a road marker from opposite sides at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what rate are they closing the distance between them?`,
      `A highway patrol car passes a truck travelling in the opposite direction. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the speed of one relative to the other.`,
      `Two buses move away from the same junction in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres are added to their separation each hour?`,
      `A car and a van are travelling directly towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find their combined approach speed.`,
      `Two vehicles moving on the same straight road in opposite directions have speeds ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. What relative speed would an observer in either vehicle measure?`,
    ], variant);
  }

  if (state.solveMode === "findRelativeSpeedSameDirection") {
    return pick([
      `A car at ${n(i.speedA)} km/h is ${n(i.speedB)} km/h faster than a bus ahead only through their speed difference. At what rate does the car gain distance on the bus?`,
      `A delivery van travels at ${n(i.speedA)} km/h behind a truck moving at ${n(i.speedB)} km/h. How much of the gap can the van erase in one hour?`,
      `Two buses move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the faster bus's speed relative to the slower bus.`,
      `A patrol car follows a jeep on the same road. The patrol car travels at ${n(i.speedA)} km/h and the jeep at ${n(i.speedB)} km/h. At what rate is the patrol car gaining?`,
      `A faster vehicle and a slower vehicle move along one lane at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How many kilometres does the faster one gain every hour?`,
      `From the slower driver's point of view, a car behind is approaching at what speed if the two vehicles travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h in the same direction?`,
    ], variant);
  }

  if (state.solveMode === "findRelativeSpeedFromMeetingTime") {
    return pick([
      `Two vehicles reduce the distance between them by ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. What was their relative speed during this interval?`,
      `A pursuing vehicle wipes out a lead of ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. Find the closing speed.`,
      `The separation between two vehicles increases by ${n(i.initialSeparation)} km over ${h(i.meetingTime)}. At what relative speed are they moving apart?`,
      `A dashboard records that the gap to another vehicle changes by ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. Determine the rate of change of the gap.`,
      `Two vehicles moving on one straight line change their mutual separation by ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. What relative speed is implied by these observations?`,
      `A road-control log shows a closing distance of ${n(i.initialSeparation)} km completed in ${h(i.meetingTime)}. Find the combined closing rate of the two vehicles.`,
    ], variant);
  }

  if (state.solveMode === "findSpeedRatioFromMeetingPoint") {
    return pick([
      `A car from town A and a bus from town B start at the same time towards each other. By the first meeting, they have covered ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. Find car speed : bus speed.`,
      `Two vehicles start simultaneously from opposite ends of a road and meet at a milestone. Their travelled distances are ${n(i.distanceA)} km and ${n(i.distanceB)} km. What is the ratio of their speeds?`,
      `At the first meeting of two buses that started together from opposite ends, one has travelled ${n(i.distanceA)} km and the other ${n(i.distanceB)} km. Determine their speed ratio in the same order.`,
      `Two motorists leave different towns simultaneously and meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km. Without finding the meeting time, find the ratio of their speeds.`,
      `A meeting point divides the journeys of two simultaneously-started vehicles into ${n(i.distanceA)} km and ${n(i.distanceB)} km. What speed ratio must have produced this division?`,
      `Two vehicles that started together from opposite ends reach each other after travelling ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. Express first vehicle speed : second vehicle speed in lowest terms.`,
    ], variant);
  }

  if (state.solveMode === "findMeetingPointDistanceSplit") {
    return pick([
      `A car leaves town A at ${n(i.speedA)} km/h while a bus leaves town B at ${n(i.speedB)} km/h at the same instant. A and B are ${n(i.routeDistance)} km apart. How far from A is their first meeting?`,
      `Two vehicles start simultaneously from opposite ends of a ${n(i.routeDistance)} km highway at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At which kilometre from the first end do they meet?`,
      `A road of ${n(i.routeDistance)} km connects two towns. Vehicles starting together from the towns travel towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the first vehicle's distance travelled by the meeting.`,
      `Two motorists approach from opposite ends of a ${n(i.routeDistance)} km route at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Where is the meeting point measured from the first motorist's end?`,
      `Vehicles from A and B start together and meet before either reaches the other town. If AB = ${n(i.routeDistance)} km and their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h, find AM, where M is the meeting point.`,
      `A ${n(i.routeDistance)} km road is shared by two approaching vehicles starting simultaneously from opposite ends. Their speeds are ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. How much of the road is covered by the first vehicle before meeting?`,
    ], variant);
  }

  if (state.solveMode === "findMeetingPointFromSpeedRatio") {
    return pick([
      `Two vehicles leave opposite ends of a ${n(i.routeDistance)} km road simultaneously. Their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. Find the distance from the first end to the meeting point.`,
      `Towns A and B are ${n(i.routeDistance)} km apart. Vehicles from A and B start together towards each other with speed ratio ${n(i.ratioA)}:${n(i.ratioB)}. How far from A do they meet?`,
      `A first meeting divides a ${n(i.routeDistance)} km route in the same ratio as the travellers' speeds, ${n(i.ratioA)}:${n(i.ratioB)}. Find the portion measured from the first traveller's end.`,
      `Two motorists start simultaneously from the ends of a ${n(i.routeDistance)} km highway. If their speeds are proportional to ${n(i.ratioA)} and ${n(i.ratioB)}, locate their meeting point from the first end.`,
      `On a ${n(i.routeDistance)} km road, vehicle A and vehicle B start towards each other together. Their speed ratio A:B is ${n(i.ratioA)}:${n(i.ratioB)}. Find the distance travelled by A before meeting.`,
      `A road between two depots is ${n(i.routeDistance)} km long. Two vehicles start at the same time from opposite depots with speeds in ratio ${n(i.ratioA)}:${n(i.ratioB)}. How many kilometres from the first depot do they meet?`,
    ], variant);
  }

  if (state.solveMode === "findSpeedNeededToAvoidOrCauseMeeting") {
    if (i.directionCase === "SAME") {
      return pick([
        `A bus moving at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km ahead of a car. What constant speed must the car maintain to catch the bus exactly after ${h(i.targetTime)}?`,
        `A patrol vehicle must catch a van ${n(i.initialSeparation)} km ahead in ${h(i.targetTime)}. If the van continues at ${n(i.speedB)} km/h, what speed must the patrol vehicle maintain?`,
        `A slower vehicle travelling at ${n(i.speedB)} km/h has a lead of ${n(i.initialSeparation)} km. Find the pursuer's speed if the gap must become zero in ${h(i.targetTime)}.`,
        `A car starts ${n(i.initialSeparation)} km behind a truck moving at ${n(i.speedB)} km/h. What speed should the car hold so that it draws level exactly ${h(i.targetTime)} later?`,
        `A delivery van ahead moves at ${n(i.speedB)} km/h. A faster vehicle is ${n(i.initialSeparation)} km behind and has ${h(i.targetTime)} to catch it. Find the required speed of the faster vehicle.`,
        `To erase a ${n(i.initialSeparation)} km same-direction lead in ${h(i.targetTime)}, what speed is required of the pursuing vehicle if the vehicle ahead moves at ${n(i.speedB)} km/h?`,
      ], variant);
    }
    return pick([
      `Two vehicles are ${n(i.initialSeparation)} km apart. One moves towards the other at ${n(i.speedB)} km/h. What speed must the second maintain so that they meet exactly after ${h(i.targetTime)}?`,
      `A car must meet an approaching bus in ${h(i.targetTime)}. Their current separation is ${n(i.initialSeparation)} km and the bus speed is ${n(i.speedB)} km/h. Find the car's required speed towards the bus.`,
      `Two motorists head towards each other from points ${n(i.initialSeparation)} km apart. One travels at ${n(i.speedB)} km/h. How fast must the other travel for a meeting after ${h(i.targetTime)}?`,
      `A ${n(i.initialSeparation)} km gap must be closed in ${h(i.targetTime)} by two approaching vehicles. If one contributes ${n(i.speedB)} km/h, determine the required speed of the other.`,
      `A vehicle approaching at ${n(i.speedB)} km/h is ${n(i.initialSeparation)} km away. What speed should the second vehicle maintain towards it to meet after exactly ${h(i.targetTime)}?`,
      `Two vehicles moving towards each other must meet in ${h(i.targetTime)} from a present separation of ${n(i.initialSeparation)} km. One travels at ${n(i.speedB)} km/h. Find the speed needed from the other.`,
    ], variant);
  }

  return renderCp004StemV2(state);
}
