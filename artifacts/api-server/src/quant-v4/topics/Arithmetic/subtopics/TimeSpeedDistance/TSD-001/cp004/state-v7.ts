import { divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { generateCp004StateV6 } from "./state-v6";
import type { TsdCp004GeneratedState } from "./runtime-types";

const CLEAN_PURSUIT_DURATIONS = Object.freeze([
  rational(1, 2), rational(3, 4), rational(1), rational(5, 4),
  rational(3, 2), rational(2), rational(5, 2), rational(3),
  rational(7, 2), rational(4), rational(9, 2), rational(5),
]);

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

function wholeMinute(value: Rational): boolean {
  return multiply(value, rational(60)).denominator === 1n;
}

function cleanPursuitTime(seed: string, faster: Rational, slower: Rational): Rational {
  const closing = subtract(faster, slower);
  const start = ordinal(seed) % CLEAN_PURSUIT_DURATIONS.length;
  for (let offset = 0; offset < CLEAN_PURSUIT_DURATIONS.length; offset += 1) {
    const candidate = CLEAN_PURSUIT_DURATIONS[(start + offset) % CLEAN_PURSUIT_DURATIONS.length]!;
    const impliedDelay = divide(multiply(closing, candidate), slower);
    if (wholeMinute(impliedDelay)) return candidate;
  }
  // Every current same-direction speed pair has at least one clean candidate;
  // keep an explicit failure so a future pool change cannot silently reintroduce raw fractional times.
  throw new Error(`No clean delayed-start duration for speeds ${faster.numerator}/${faster.denominator} and ${slower.numerator}/${slower.denominator}`);
}

export function generateCp004StateV7(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004StateV6(authorityKey, seed);
  if (base.solveMode !== "findDelayedStartCatchUpTime" && base.solveMode !== "findStartDelayFromCatchUpState") return base;

  const faster = base.input.speedA!;
  const slower = base.input.speedB!;
  const pursuitTime = cleanPursuitTime(seed, faster, slower);
  const closing = subtract(faster, slower);
  const startDelay = divide(multiply(closing, pursuitTime), slower);

  return Object.freeze({
    ...base,
    input: base.solveMode === "findDelayedStartCatchUpTime"
      ? Object.freeze({ ...base.input, startDelay })
      : Object.freeze({ ...base.input, meetingTime: pursuitTime }),
  });
}
