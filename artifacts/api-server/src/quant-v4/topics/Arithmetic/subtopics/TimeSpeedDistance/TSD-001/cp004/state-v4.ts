import { add, multiply } from "../foundation/rational";
import { generateCp004StateV3 } from "./state-v3";
import type { TsdCp004GeneratedState } from "./runtime-types";

export function generateCp004StateV4(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004StateV3(authorityKey, seed);
  if (base.solveMode !== "findInitialGapFromLaterSeparation") return base;

  const speedA = base.input.speedA!;
  const speedB = base.input.speedB!;
  const elapsedTime = base.input.elapsedTime!;
  const openingDistance = multiply(add(speedA, speedB), elapsedTime);

  // Keep the starting gap of the same order as the subsequently added separation.
  // Then authentic errors such as subtracting only one vehicle's travelled distance
  // remain plausible options instead of becoming trivially enormous.
  const initialGap = openingDistance;
  const specifiedSeparation = add(initialGap, openingDistance);

  return Object.freeze({
    ...base,
    input: Object.freeze({
      ...base.input,
      initialSeparation: initialGap,
      specifiedSeparation,
    }),
  });
}
