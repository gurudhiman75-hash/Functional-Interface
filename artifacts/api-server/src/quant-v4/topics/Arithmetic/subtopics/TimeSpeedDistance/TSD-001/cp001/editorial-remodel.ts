import type { TsdCp001SolveInput } from "./canonical-solver";
import { trailingSeedOrdinal } from "./runtime-support";

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

export function remodelCp001Stem(input: TsdCp001SolveInput, stem: string, seed: string): string {
  let output = stem;

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
