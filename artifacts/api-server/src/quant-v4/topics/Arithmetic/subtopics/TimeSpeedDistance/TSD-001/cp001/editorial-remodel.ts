import { toMixedString } from "../foundation/rational";
import type { TsdCp001SolveInput } from "./canonical-solver";
import { ratioText, trailingSeedOrdinal } from "./runtime-support";

function rationalNumber(value: { readonly numerator: bigint; readonly denominator: bigint }): number {
  return Number(value.numerator) / Number(value.denominator);
}

function replaceActor(stem: string, replacement: string): string {
  return stem
    .replace(/\bA (runner|rider|cyclist)\b/, `A ${replacement}`)
    .replace(/\ba (runner|rider|cyclist)\b/, `a ${replacement}`);
}

function possessiveSpeedQuestion(stem: string): string {
  const actor = stem.match(/^A\s+(runner|rider|cyclist|walker)\b/i)?.[1]?.toLowerCase();
  if (!actor) return stem;
  return stem.replace(/What is its speed in m\/s\?/i, `What is the ${actor}'s speed in m/s?`);
}

function variant(seed: string): 0 | 1 | 2 {
  return (trailingSeedOrdinal(seed) % 3) as 0 | 1 | 2;
}

function relationalStem(input: TsdCp001SolveInput, seed: string): string | null {
  const stemVariant = variant(seed);

  switch (input.solveMode) {
    case "compareDistancesAtEqualTime": {
      const first = toMixedString(input.firstSpeed);
      const second = toMixedString(input.secondSpeed);
      return [
        `Cars A and B travel for the same duration at ${first} m/s and ${second} m/s. What is the ratio of the distances covered by A and B?`,
        `During an equal-time trial, vehicle A moves at ${first} m/s while vehicle B moves at ${second} m/s. Find their distance ratio A:B.`,
        `Two couriers A and B remain in motion for an identical time. Their speeds are ${first} m/s and ${second} m/s respectively. In what ratio do they cover distance?`,
      ][stemVariant];
    }

    case "compareTimesAtEqualDistance": {
      const first = toMixedString(input.firstSpeed);
      const second = toMixedString(input.secondSpeed);
      return [
        `Cars A and B cover the same route at ${first} m/s and ${second} m/s. What is the ratio of their travel times A:B?`,
        `For an identical distance, vehicle A moves at ${first} m/s and vehicle B at ${second} m/s. Find the time ratio A:B.`,
        `Riders A and B must each cover the same distance. Their speeds are ${first} m/s and ${second} m/s respectively. In what ratio will they take time?`,
      ][stemVariant];
    }

    case "compareSpeedsAtEqualTime": {
      const first = toMixedString(input.firstDistance);
      const second = toMixedString(input.secondDistance);
      return [
        `Riders A and B travel for equal durations and cover ${first} km and ${second} km respectively. What is the ratio of their speeds A:B?`,
        `During the same time interval, vehicle A covers ${first} km while vehicle B covers ${second} km. Find their speed ratio A:B.`,
        `Two couriers A and B remain on the road for an identical time. They cover ${first} km and ${second} km respectively. In what ratio are their speeds?`,
      ][stemVariant];
    }

    case "distanceRatioFromSpeedAndTimeRatios": {
      const speed = ratioText(input.speedRatio);
      const time = ratioText(input.timeRatio);
      return [
        `The speed ratio of A to B is ${speed}, and their travelling-time ratio is ${time}. What is the ratio of the distances covered by A and B?`,
        `Vehicles A and B move with speeds in the ratio ${speed}. The times for which they travel are in the ratio ${time}. Find their distance ratio A:B.`,
        `Two couriers A and B have speed ratio ${speed} and time ratio ${time}. In what ratio do they cover distance?`,
      ][stemVariant];
    }

    case "speedRatioFromDistanceAndTimeRatios": {
      const distance = ratioText(input.distanceRatio);
      const time = ratioText(input.timeRatio);
      return [
        `The distance ratio of A to B is ${distance}, while their travelling-time ratio is ${time}. What is their speed ratio A:B?`,
        `Vehicles A and B cover distances in the ratio ${distance} and take times in the ratio ${time}. Find the ratio of their speeds.`,
        `For two journeys A and B, distance ratio A:B = ${distance} and time ratio A:B = ${time}. Determine the speed ratio A:B.`,
      ][stemVariant];
    }

    case "timeRatioFromDistanceAndSpeedRatios": {
      const distance = ratioText(input.distanceRatio);
      const speed = ratioText(input.speedRatio);
      return [
        `The distance ratio of A to B is ${distance}, and their speed ratio is ${speed}. What is the ratio of their travel times A:B?`,
        `Vehicles A and B cover distances in the ratio ${distance} with speeds in the ratio ${speed}. Find the time ratio A:B.`,
        `For journeys A and B, distance ratio A:B = ${distance} and speed ratio A:B = ${speed}. Determine the ratio of the times taken.`,
      ][stemVariant];
    }

    case "speedByProportion": {
      const knownDistance = toMixedString(input.knownDistance);
      const knownSpeed = toMixedString(input.knownSpeed);
      const knownTime = toMixedString(input.knownTime);
      const targetTime = toMixedString(input.targetTime);
      return [
        `At ${knownSpeed} km/h, a car completes a journey in ${knownTime} hours. What speed is required to complete the same journey in ${targetTime} hours?`,
        `A delivery van covers ${knownDistance} km in ${knownTime} hours. To cover the identical distance in ${targetTime} hours, what speed must it maintain?`,
        `A bus needs ${knownTime} hours to finish a fixed route at ${knownSpeed} km/h. If the route must be completed in ${targetTime} hours, find the required speed.`,
      ][stemVariant];
    }

    default:
      return null;
  }
}

export function remodelCp001Stem(input: TsdCp001SolveInput, stem: string, seed: string): string {
  let output = relationalStem(input, seed) ?? stem;

  if (input.solveMode === "distanceFromSpeedAndTime" && rationalNumber(input.speedMps) >= 12.5) {
    const vehicles = ["car", "bus", "train"] as const;
    output = replaceActor(output, vehicles[trailingSeedOrdinal(seed) % vehicles.length]);
  }

  if (input.solveMode === "speedFromDistanceAndTime") {
    output = output.replace(/^During a timed run,/i, "During a timed journey,");
    output = possessiveSpeedQuestion(output);
  }

  return output;
}