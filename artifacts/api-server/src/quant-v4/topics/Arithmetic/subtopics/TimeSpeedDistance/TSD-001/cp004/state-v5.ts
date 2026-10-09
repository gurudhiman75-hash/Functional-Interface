import { add, divide, multiply, rational, subtract } from "../foundation/rational";
import { generateCp004StateV4 } from "./state-v4";
import type { TsdCp004GeneratedState } from "./runtime-types";

export function generateCp004StateV5(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004StateV4(authorityKey, seed);
  if (base.solveMode !== "findTimeUntilSpecifiedSeparation") return base;

  const speedA = base.input.speedA!;
  const speedB = base.input.speedB!;
  const relativeSpeed = base.input.directionCase === "SAME"
    ? subtract(speedA, speedB)
    : add(speedA, speedB);

  const initial = base.input.initialSeparation!;
  const target = base.input.specifiedSeparation!;
  const change = base.input.directionCase === "SAME"
    ? subtract(initial, target)
    : subtract(target, initial);
  const time = divide(change, relativeSpeed);

  // Choose the non-changing portion of the gap as half the required change.
  // This keeps authentic "use initial gap", "use final gap" and "add the gaps"
  // errors numerically competitive without altering the correct time.
  const balancedChange = multiply(relativeSpeed, time);
  const balancedBaseGap = divide(balancedChange, rational(2));

  return Object.freeze({
    ...base,
    input: base.input.directionCase === "SAME"
      ? Object.freeze({
          ...base.input,
          initialSeparation: add(balancedBaseGap, balancedChange),
          specifiedSeparation: balancedBaseGap,
        })
      : Object.freeze({
          ...base.input,
          initialSeparation: balancedBaseGap,
          specifiedSeparation: add(balancedBaseGap, balancedChange),
        }),
  });
}
