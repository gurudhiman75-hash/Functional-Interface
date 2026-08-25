import { multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { solveTsdCp010 } from "./executable-solver";
import type { TsdCp010ExecutableCase, TsdCp010ExecutableInput } from "./executable-types";
import { TSD_CP010_AUTHORITY_KEYS, type TsdCp010AuthorityKey } from "./source-saturation";

const SPEED_PAIRS = [
  [6, 5], [7, 6], [8, 6], [5, 4], [6, 4], [5, 3],
  [8, 7], [7, 5], [6, 3], [7, 4], [8, 5], [8, 4],
] as const;
const SPEED_TRIPLES = [
  [8, 6, 4], [6, 4, 3], [5, 4, 3], [8, 6, 3], [6, 5, 4], [8, 4, 2],
  [7, 5, 3], [8, 6, 5], [6, 4, 2], [5, 3, 2], [8, 5, 4], [6, 3, 2],
] as const;
const TRANSITIVE_RACE_DISTANCES = [600, 600, 400, 600, 600, 400, 700, 600, 600, 300, 800, 600] as const;

function buildInput(authorityKey: TsdCp010AuthorityKey, index: number): TsdCp010ExecutableInput {
  const [aN, bN] = SPEED_PAIRS[index]!;
  const a = rational(aN);
  const b = rational(bN);
  const fifty = rational(50);
  const baseDistance = multiply(a, fifty);
  const baseLead = multiply(subtract(a, b), fifty);
  const absoluteRaceDistance = rational(aN * bN * 10);
  const absoluteTimeLead = rational((aN - bN) * 10);

  switch (authorityKey) {
    case "finishDistanceLeadState": return {
      authorityKey,
      target: index === 5 || index === 11 ? "PERCENT_OF_RACE" : "DISTANCE_LEAD",
      raceDistance: baseDistance,
      winnerSpeed: a,
      loserSpeed: b,
    };
    case "finishTimeLeadState": return { authorityKey, raceDistance: absoluteRaceDistance, winnerSpeed: a, loserSpeed: b };
    case "raceSpeedRatioState":
      return index % 2 === 0
        ? { authorityKey, mode: "DISTANCE_LEAD", raceDistance: baseDistance, distanceLead: baseLead }
        : { authorityKey, mode: "TIME_LEAD", winnerTime: rational(bN * 10), timeLead: absoluteTimeLead };
    case "raceLengthFromLeadEvidence":
      return index % 2 === 0
        ? { authorityKey, mode: "DISTANCE_LEAD", winnerSpeed: a, loserSpeed: b, distanceLead: baseLead }
        : { authorityKey, mode: "TIME_LEAD", winnerSpeed: a, loserSpeed: b, timeLead: absoluteTimeLead };
    case "deadHeatHandicapState":
      return index % 2 === 0
        ? { authorityKey, mode: "DISTANCE_HANDICAP", raceDistance: baseDistance, fasterSpeed: a, slowerSpeed: b }
        : { authorityKey, mode: "TIME_DELAY", raceDistance: absoluteRaceDistance, fasterSpeed: a, slowerSpeed: b };
    case "leadConversionState": {
      const timeLead = rational(5 + index);
      const distanceLead = multiply(b, timeLead);
      return index % 2 === 0
        ? { authorityKey, mode: "DISTANCE_TO_TIME", loserSpeed: b, distanceLead }
        : { authorityKey, mode: "TIME_TO_DISTANCE", loserSpeed: b, timeLead };
    }
    case "transitiveRaceComparison": {
      const [xN, yN, zN] = SPEED_TRIPLES[index]!;
      const raceDistance = rational(TRANSITIVE_RACE_DISTANCES[index]!);
      const aBeatsBBy = multiply(raceDistance, { numerator: BigInt(xN - yN), denominator: BigInt(xN) });
      const bBeatsCBy = multiply(raceDistance, { numerator: BigInt(yN - zN), denominator: BigInt(yN) });
      return { authorityKey, raceDistance, aBeatsBBy, bBeatsCBy };
    }
    case "multiOutcomeRaceComparison": {
      const firstRaceDistance = baseDistance;
      const firstRaceLead = baseLead;
      const secondRaceDistance = multiply(a, rational(60));
      const secondRaceHeadStartForLoser = multiply(subtract(a, b), rational(20));
      return { authorityKey, firstRaceDistance, firstRaceLead, secondRaceDistance, secondRaceHeadStartForLoser };
    }
    case "changedRaceOutcomeState": {
      const mode = index % 3;
      if (mode === 0) {
        const changedFasterSpeed = rational(aN + 1);
        return { authorityKey, mode: "FASTER_SPEED_CHANGE", raceDistance: multiply(changedFasterSpeed, fifty), fasterSpeed: a, slowerSpeed: b, changedFasterSpeed };
      }
      if (mode === 1) return { authorityKey, mode: "SLOWER_REST", raceDistance: baseDistance, fasterSpeed: a, slowerSpeed: b, slowerRestTime: rational(5 + (index % 4) * 5) };
      return { authorityKey, mode: "FASTER_START_DELAY", raceDistance: baseDistance, fasterSpeed: a, slowerSpeed: b, fasterStartDelay: rational(1 + (index % 3)) };
    }
    case "runnerStateFromTwoRaceOutcomes":
      return { authorityKey, firstRaceDistance: baseDistance, firstRaceDistanceLead: baseLead, secondRaceDistance: absoluteRaceDistance, secondRaceTimeLead: absoluteTimeLead, target: index % 2 === 0 ? "FASTER_SPEED" : "SLOWER_SPEED" };
  }
}

export function generateTsdCp010ExecutableCases(): readonly TsdCp010ExecutableCase[] {
  const out: TsdCp010ExecutableCase[] = [];
  for (const authorityKey of TSD_CP010_AUTHORITY_KEYS) {
    for (let index = 0; index < 12; index += 1) {
      const input = buildInput(authorityKey, index);
      out.push(Object.freeze({ caseId: `TSD-CP010-${authorityKey}-${String(index + 1).padStart(2, "0")}`, authorityKey, input, expected: solveTsdCp010(input) }));
    }
  }
  return Object.freeze(out);
}
