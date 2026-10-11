import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";

function finishDistanceLead(distance: Rational, faster: Rational, slower: Rational) {
  return subtract(distance, multiply(slower, divide(distance, faster)));
}
function finishTimeLead(distance: Rational, faster: Rational, slower: Rational) {
  return subtract(divide(distance, slower), divide(distance, faster));
}
function expectedAnswer(input: TsdCp010ExecutableInput): { answer: Rational; unit: TsdCp010ExecutableSolution["unit"] } {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const lead = finishDistanceLead(input.raceDistance, input.winnerSpeed, input.loserSpeed);
      return input.target === "PERCENT_OF_RACE"
        ? { answer: divide(multiply(lead, rational(100)), input.raceDistance), unit: "PERCENT" }
        : { answer: lead, unit: "METRE" };
    }
    case "finishTimeLeadState": return { answer: finishTimeLead(input.raceDistance, input.winnerSpeed, input.loserSpeed), unit: "SECOND" };
    case "raceSpeedRatioState":
      return input.mode === "DISTANCE_LEAD"
        ? { answer: divide(input.raceDistance, subtract(input.raceDistance, input.distanceLead)), unit: "RATIO" }
        : { answer: divide(add(input.winnerTime, input.timeLead), input.winnerTime), unit: "RATIO" };
    case "raceLengthFromLeadEvidence": {
      const diff = subtract(input.winnerSpeed, input.loserSpeed);
      return input.mode === "DISTANCE_LEAD"
        ? { answer: divide(multiply(input.distanceLead, input.winnerSpeed), diff), unit: "METRE" }
        : { answer: divide(multiply(multiply(input.timeLead, input.winnerSpeed), input.loserSpeed), diff), unit: "METRE" };
    }
    case "deadHeatHandicapState":
      return input.mode === "DISTANCE_HANDICAP"
        ? { answer: finishDistanceLead(input.raceDistance, input.fasterSpeed, input.slowerSpeed), unit: "METRE" }
        : { answer: finishTimeLead(input.raceDistance, input.fasterSpeed, input.slowerSpeed), unit: "SECOND" };
    case "leadConversionState":
      return input.mode === "DISTANCE_TO_TIME"
        ? { answer: divide(input.distanceLead!, input.loserSpeed), unit: "SECOND" }
        : { answer: multiply(input.timeLead!, input.loserSpeed), unit: "METRE" };
    case "transitiveRaceComparison": {
      const cAtAFinish = divide(multiply(subtract(input.raceDistance, input.aBeatsBBy), subtract(input.raceDistance, input.bBeatsCBy)), input.raceDistance);
      return { answer: subtract(input.raceDistance, cAtAFinish), unit: "METRE" };
    }
    case "multiOutcomeRaceComparison": {
      const ratio = divide(subtract(input.firstRaceDistance, input.firstRaceLead), input.firstRaceDistance);
      return { answer: subtract(subtract(input.secondRaceDistance, input.secondRaceHeadStartForLoser), multiply(ratio, input.secondRaceDistance)), unit: "METRE" };
    }
    case "changedRaceOutcomeState": {
      if (input.mode === "FASTER_SPEED_CHANGE") return { answer: finishDistanceLead(input.raceDistance, input.changedFasterSpeed!, input.slowerSpeed), unit: "METRE" };
      if (input.mode === "SLOWER_REST") {
        const movingTime = subtract(divide(input.raceDistance, input.fasterSpeed), input.slowerRestTime!);
        return { answer: subtract(input.raceDistance, multiply(input.slowerSpeed, movingTime)), unit: "METRE" };
      }
      const finishClock = add(input.fasterStartDelay!, divide(input.raceDistance, input.fasterSpeed));
      return { answer: subtract(input.raceDistance, multiply(input.slowerSpeed, finishClock)), unit: "METRE" };
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const ratio = divide(subtract(input.firstRaceDistance, input.firstRaceDistanceLead), input.firstRaceDistance);
      const faster = divide(multiply(input.secondRaceDistance, subtract(rational(1), ratio)), multiply(ratio, input.secondRaceTimeLead));
      return { answer: input.target === "FASTER_SPEED" ? faster : multiply(ratio, faster), unit: "METRE_PER_SECOND" };
    }
  }
}

export function verifyTsdCp010(input: TsdCp010ExecutableInput, solution: TsdCp010ExecutableSolution) {
  const expected = expectedAnswer(input);
  return Object.freeze({ accepted: solution.authorityKey === input.authorityKey && solution.unit === expected.unit && equals(solution.answer, expected.answer), expectedAnswer: expected.answer, expectedUnit: expected.unit, invariant: `Independent race-state reconstruction for ${input.authorityKey}` });
}