import { divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { generateCp004StateV6 } from "./state-v6";
import type { TsdCp004GeneratedState } from "./runtime-types";

// Every 15-minute duration from 30 minutes through 6 hours.
// This preserves broad state variety while ensuring derived start delays can be stated naturally.
const CLEAN_PURSUIT_DURATIONS = Object.freeze(
  Array.from({ length: 23 }, (_, index) => rational(index + 2, 4)),
);

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
