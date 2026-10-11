import { add, compare, divide, equals, multiply, subtract } from "../foundation/rational";
import { deriveStrongCp004WrongWorkingsV7 } from "./distractor-engine-v7";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";
import type { TsdCp004WrongWorking } from "./runtime-types";

export function deriveStrongCp004WrongWorkingsV8(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
): readonly TsdCp004WrongWorking[] {
  const selected = [...deriveStrongCp004WrongWorkingsV7(mode, input, solution)];
  if (mode !== "findMeetingPointDistanceSplit" && mode !== "findMeetingPointFromSpeedRatio") return Object.freeze(selected);

  const route = input.routeDistance!;
  const first = mode === "findMeetingPointDistanceSplit" ? input.speedA! : input.ratioA!;
  const second = mode === "findMeetingPointDistanceSplit" ? input.speedB! : input.ratioB!;
  const total = add(first, second);
  const difference = compare(first, second) >= 0 ? subtract(first, second) : subtract(second, first);
  const cleanValue = divide(multiply(route, difference), total);

  const weakIndex = selected.findIndex((entry) =>
    entry.misconceptionId === "USE_ROUTE_DIFFERENCE" &&
    /count the first traveller's speed or ratio part twice/i.test(entry.calculation),
  );

  if (
    weakIndex >= 0 &&
    cleanValue.numerator > 0n &&
    compare(cleanValue, route) < 0 &&
    !equals(cleanValue, solution.answer) &&
    !selected.some((entry, index) => index !== weakIndex && equals(entry.value, cleanValue))
  ) {
    selected[weakIndex] = Object.freeze({
      misconceptionId: "USE_ROUTE_DIFFERENCE" as const,
      value: cleanValue,
      calculation: "use the speed or ratio difference as the first traveller's route share",
      diagnosis: "The learner mistakes the advantage between the two speed parts for the fraction of the route travelled from the first endpoint.",
    });
  }

  return Object.freeze(selected);
}
