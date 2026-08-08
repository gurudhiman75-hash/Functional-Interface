import {
  moduloRational,
  multiplyRationals,
  rationalsEqual,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";
import {
  CLOCK_CYCLE_SECONDS,
  totalSecondsToClockTimeExact,
  type ExactClockTime12,
} from "./clock-time";
import { clockTimeToHandAnglesExact } from "./clock-kinematics";

export interface HandInterchangeResult {
  originalSeconds: ExactRational;
  candidateSeconds: ExactRational;
  originalTime: ExactClockTime12;
  candidateTime: ExactClockTime12;
  possible: boolean;
}

/**
 * The target hour hand must equal the original minute hand. That equation fixes
 * the only candidate dial time: t2 ≡ 12t1 (mod 12 hours). The second equality is
 * then checked independently and exactly.
 */
export function solveHandInterchangeExact(
  originalSeconds: ExactRationalInput,
): HandInterchangeResult {
  const original = moduloRational(originalSeconds, CLOCK_CYCLE_SECONDS);
  const candidate = moduloRational(
    multiplyRationals(original, 12),
    CLOCK_CYCLE_SECONDS,
  );
  const originalTime = totalSecondsToClockTimeExact(original);
  const candidateTime = totalSecondsToClockTimeExact(candidate);
  const originalAngles = clockTimeToHandAnglesExact(originalTime);
  const candidateAngles = clockTimeToHandAnglesExact(candidateTime);
  const possible =
    rationalsEqual(candidateAngles.hourAngleDeg, originalAngles.minuteAngleDeg) &&
    rationalsEqual(candidateAngles.minuteAngleDeg, originalAngles.hourAngleDeg);
  return {
    originalSeconds: original,
    candidateSeconds: candidate,
    originalTime,
    candidateTime,
    possible,
  };
}

export function validateProposedHandInterchangeExact(input: {
  originalSeconds: ExactRationalInput;
  proposedSeconds: ExactRationalInput;
}): boolean {
  const solved = solveHandInterchangeExact(input.originalSeconds);
  return solved.possible && rationalsEqual(
    solved.candidateSeconds,
    moduloRational(input.proposedSeconds, CLOCK_CYCLE_SECONDS),
  );
}

export function findHandInterchangePairsExact(input: {
  includeTrivialCoincidence?: boolean;
} = {}): HandInterchangeResult[] {
  const includeTrivial = input.includeTrivialCoincidence ?? false;
  const pairs: HandInterchangeResult[] = [];
  const seen = new Set<string>();

  // Combining the two swap equations gives 143t ≡ 0 (mod 43,200).
  // Therefore every exact candidate is t = 43,200n/143, n = 0..142.
  for (let index = 0; index < 143; index += 1) {
    const original = { numerator: 43_200n * BigInt(index), denominator: 143n };
    const solved = solveHandInterchangeExact(original);
    if (!solved.possible) {
      throw new Error("Exact hand-interchange authority produced an invalid pair.");
    }
    if (!includeTrivial && rationalsEqual(solved.originalSeconds, solved.candidateSeconds)) {
      continue;
    }
    const left = `${solved.originalSeconds.numerator}/${solved.originalSeconds.denominator}`;
    const right = `${solved.candidateSeconds.numerator}/${solved.candidateSeconds.denominator}`;
    const key = left < right ? `${left}|${right}` : `${right}|${left}`;
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push(solved);
    }
  }
  return pairs;
}
