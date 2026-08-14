import { add, divide, multiply, rational } from "../foundation/rational";
import { generateCp004StateV4 } from "./state-v4";
import type { TsdCp004GeneratedState } from "./runtime-types";

export function generateCp004StateV5(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004StateV4(authorityKey, seed);
  if (base.solveMode !== "findTimeUntilSpecifiedSeparation") return base;

  const speedA = base.input.speedA!;
  const speedB = base.input.speedB!;
  const correctTime = base.solutionHintTime ?? base.input.elapsedTime;

  // state-v3 encoded the answer through gap change; recover the intended duration
  // from the existing initial/target pair and relative speed without changing authority.
  const relativeSpeed = base.input.directionCase === "SAME"
    ? { numerator: speedA.numerator * speedB.denominator - speedB.numerator * speedA.denominator, denominator: speedA.denominator * speedB.denominator }
    : { numerator: speedA.numerator * speedB.denominator + speedB.numerator * speedA.denominator, denominator: speedA.denominator * speedB.denominator };

  const initial = base.input.initialSeparation!;
  const target = base.input.specifiedSeparation!;
  const change = base.input.directionCase === "SAME"
    ? { numerator: initial.numerator * target.denominator - target.numerator * initial.denominator, denominator: initial.denominator * target.denominator }
    : { numerator: target.numerator * initial.denominator - initial.numerator * target.denominator, denominator: target.denominator * initial.denominator };

  const time = divide(change, relativeSpeed);
  const balancedBaseGap = divide(multiply(relativeSpeed, time), rational(2));
  const balancedChange = multiply(relativeSpeed, time);

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
