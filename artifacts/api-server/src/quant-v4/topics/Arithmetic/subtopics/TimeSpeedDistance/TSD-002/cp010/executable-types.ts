import type { Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010AuthorityKey } from "./source-saturation";

export type TsdCp010Unit = "METRE" | "SECOND" | "METRE_PER_SECOND" | "RATIO" | "PERCENT";

export type TsdCp010ExecutableInput =
  | Readonly<{ authorityKey: "finishDistanceLeadState"; target: "DISTANCE_LEAD" | "PERCENT_OF_RACE"; raceDistance: Rational; winnerSpeed: Rational; loserSpeed: Rational }>
  | Readonly<{ authorityKey: "finishTimeLeadState"; raceDistance: Rational; winnerSpeed: Rational; loserSpeed: Rational }>
  | Readonly<{ authorityKey: "raceSpeedRatioState"; mode: "DISTANCE_LEAD"; raceDistance: Rational; distanceLead: Rational }>
  | Readonly<{ authorityKey: "raceSpeedRatioState"; mode: "TIME_LEAD"; winnerTime: Rational; timeLead: Rational }>
  | Readonly<{ authorityKey: "raceLengthFromLeadEvidence"; mode: "DISTANCE_LEAD"; winnerSpeed: Rational; loserSpeed: Rational; distanceLead: Rational }>
  | Readonly<{ authorityKey: "raceLengthFromLeadEvidence"; mode: "TIME_LEAD"; winnerSpeed: Rational; loserSpeed: Rational; timeLead: Rational }>
  | Readonly<{ authorityKey: "deadHeatHandicapState"; mode: "DISTANCE_HANDICAP" | "TIME_DELAY"; raceDistance: Rational; fasterSpeed: Rational; slowerSpeed: Rational }>
  | Readonly<{ authorityKey: "leadConversionState"; mode: "DISTANCE_TO_TIME" | "TIME_TO_DISTANCE"; loserSpeed: Rational; distanceLead?: Rational; timeLead?: Rational }>
  | Readonly<{ authorityKey: "transitiveRaceComparison"; raceDistance: Rational; aBeatsBBy: Rational; bBeatsCBy: Rational }>
  | Readonly<{ authorityKey: "multiOutcomeRaceComparison"; firstRaceDistance: Rational; firstRaceLead: Rational; secondRaceDistance: Rational; secondRaceHeadStartForLoser: Rational }>
  | Readonly<{ authorityKey: "changedRaceOutcomeState"; mode: "FASTER_SPEED_CHANGE" | "SLOWER_REST" | "FASTER_START_DELAY"; raceDistance: Rational; fasterSpeed: Rational; slowerSpeed: Rational; changedFasterSpeed?: Rational; slowerRestTime?: Rational; fasterStartDelay?: Rational }>
  | Readonly<{ authorityKey: "runnerStateFromTwoRaceOutcomes"; firstRaceDistance: Rational; firstRaceDistanceLead: Rational; secondRaceDistance: Rational; secondRaceTimeLead: Rational; target: "FASTER_SPEED" | "SLOWER_SPEED" }>;

export type TsdCp010ExecutableSolution = Readonly<{
  authorityKey: TsdCp010AuthorityKey;
  answer: Rational;
  unit: TsdCp010Unit;
  invariant: string;
}>;

export type TsdCp010ExecutableCase = Readonly<{
  caseId: string;
  authorityKey: TsdCp010AuthorityKey;
  input: TsdCp010ExecutableInput;
  expected: TsdCp010ExecutableSolution;
}>;