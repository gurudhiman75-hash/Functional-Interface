import {
  add,
  compare,
  divide,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";

function positive(value: Rational, label: string) {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

function fasterThan(faster: Rational, slower: Rational) {
  positive(faster, "faster speed");
  positive(slower, "slower speed");
  if (compare(faster, slower) <= 0) throw new Error("faster speed must exceed slower speed");
}

function finishDistanceLead(distance: Rational, faster: Rational, slower: Rational): Rational {
  positive(distance, "race distance");
  fasterThan(faster, slower);
  return subtract(distance, multiply(slower, divide(distance, faster)));
}

function finishTimeLead(distance: Rational, faster: Rational, slower: Rational): Rational {
  positive(distance, "race distance");
  fasterThan(faster, slower);
  return subtract(divide(distance, slower), divide(distance, faster));
}

export function solveTsdCp010(input: TsdCp010ExecutableInput): TsdCp010ExecutableSolution {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const lead = finishDistanceLead(input.raceDistance, input.winnerSpeed, input.loserSpeed);
      if (input.target === "PERCENT_OF_RACE") {
        return {
          authorityKey: input.authorityKey,
          answer: divide(multiply(lead, rational(100)), input.raceDistance),
          unit: "PERCENT",
          invariant: "Winning margin percent = finish-distance lead ÷ race distance × 100.",
        };
      }
      return { authorityKey: input.authorityKey, answer: lead, unit: "METRE", invariant: "When the winner finishes, loser distance = loserSpeed × winnerTime; lead = raceDistance − loserDistance." };
    }
    case "finishTimeLeadState":
      return { authorityKey: input.authorityKey, answer: finishTimeLead(input.raceDistance, input.winnerSpeed, input.loserSpeed), unit: "SECOND", invariant: "Time lead is loser finish time minus winner finish time over the same race distance." };
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        positive(input.raceDistance, "race distance"); positive(input.distanceLead, "distance lead");
        const loserCovered = subtract(input.raceDistance, input.distanceLead); positive(loserCovered, "loser covered distance");
        return { authorityKey: input.authorityKey, answer: divide(input.raceDistance, loserCovered), unit: "RATIO", invariant: "With equal elapsed time, winnerSpeed:loserSpeed = raceDistance:loserDistanceAtWinnerFinish." };
      }
      positive(input.winnerTime, "winner time"); positive(input.timeLead, "time lead");
      return { authorityKey: input.authorityKey, answer: divide(add(input.winnerTime, input.timeLead), input.winnerTime), unit: "RATIO", invariant: "For the same race distance, winnerSpeed:loserSpeed = loserTime:winnerTime." };
    }
    case "raceLengthFromLeadEvidence": {
      fasterThan(input.winnerSpeed, input.loserSpeed);
      const speedDifference = subtract(input.winnerSpeed, input.loserSpeed);
      if (input.mode === "DISTANCE_LEAD") {
        positive(input.distanceLead, "distance lead");
        return { authorityKey: input.authorityKey, answer: divide(multiply(input.distanceLead, input.winnerSpeed), speedDifference), unit: "METRE", invariant: "distanceLead/raceDistance = (winnerSpeed−loserSpeed)/winnerSpeed." };
      }
      positive(input.timeLead, "time lead");
      return { authorityKey: input.authorityKey, answer: divide(multiply(multiply(input.timeLead, input.winnerSpeed), input.loserSpeed), speedDifference), unit: "METRE", invariant: "timeLead = raceDistance × (winnerSpeed−loserSpeed)/(winnerSpeed×loserSpeed)." };
    }
    case "deadHeatHandicapState": {
      fasterThan(input.fasterSpeed, input.slowerSpeed); positive(input.raceDistance, "race distance");
      const answer = input.mode === "DISTANCE_HANDICAP" ? finishDistanceLead(input.raceDistance, input.fasterSpeed, input.slowerSpeed) : finishTimeLead(input.raceDistance, input.fasterSpeed, input.slowerSpeed);
      return { authorityKey: input.authorityKey, answer, unit: input.mode === "DISTANCE_HANDICAP" ? "METRE" : "SECOND", invariant: input.mode === "DISTANCE_HANDICAP" ? "A slower racer starting ahead by the original finish-distance lead reaches the finish with the faster racer." : "Delaying the faster racer by the original finish-time lead produces a dead heat." };
    }
    case "leadConversionState": {
      positive(input.loserSpeed, "loser speed");
      if (input.mode === "DISTANCE_TO_TIME") {
        if (!input.distanceLead) throw new Error("distance lead required"); positive(input.distanceLead, "distance lead");
        return { authorityKey: input.authorityKey, answer: divide(input.distanceLead, input.loserSpeed), unit: "SECOND", invariant: "After the winner finishes, the loser covers the remaining lead at the loser's own speed." };
      }
      if (!input.timeLead) throw new Error("time lead required"); positive(input.timeLead, "time lead");
      return { authorityKey: input.authorityKey, answer: multiply(input.timeLead, input.loserSpeed), unit: "METRE", invariant: "Distance lead equals loser speed multiplied by the loser's remaining finish time." };
    }
    case "transitiveRaceComparison": {
      positive(input.raceDistance, "race distance"); positive(input.aBeatsBBy, "A-B lead"); positive(input.bBeatsCBy, "B-C lead");
      const bAtAFinish = subtract(input.raceDistance, input.aBeatsBBy); const cAtBFinish = subtract(input.raceDistance, input.bBeatsCBy);
      positive(bAtAFinish, "B distance at A finish"); positive(cAtBFinish, "C distance at B finish");
      const cAtAFinish = divide(multiply(bAtAFinish, cAtBFinish), input.raceDistance);
      return { authorityKey: input.authorityKey, answer: subtract(input.raceDistance, cAtAFinish), unit: "METRE", invariant: "Pairwise loser-distance fractions multiply: C/A = (B/A) × (C/B)." };
    }
    case "multiOutcomeRaceComparison": {
      positive(input.firstRaceDistance, "first race distance"); positive(input.firstRaceLead, "first race lead"); positive(input.secondRaceDistance, "second race distance");
      const firstLoserCovered = subtract(input.firstRaceDistance, input.firstRaceLead); positive(firstLoserCovered, "first-race loser distance");
      const loserToWinnerSpeedRatio = divide(firstLoserCovered, input.firstRaceDistance);
      const secondLoserTravel = multiply(loserToWinnerSpeedRatio, input.secondRaceDistance);
      const lead = subtract(subtract(input.secondRaceDistance, input.secondRaceHeadStartForLoser), secondLoserTravel); positive(lead, "second-race winner lead after handicap");
      return { authorityKey: input.authorityKey, answer: lead, unit: "METRE", invariant: "The first race fixes the speed ratio; the second-race head start is added to the slower racer's position before comparing finish positions." };
    }
    case "changedRaceOutcomeState": {
      positive(input.raceDistance, "race distance"); fasterThan(input.fasterSpeed, input.slowerSpeed);
      let lead: Rational; let invariant: string;
      if (input.mode === "FASTER_SPEED_CHANGE") {
        if (!input.changedFasterSpeed) throw new Error("changed faster speed required"); fasterThan(input.changedFasterSpeed, input.slowerSpeed);
        lead = finishDistanceLead(input.raceDistance, input.changedFasterSpeed, input.slowerSpeed); invariant = "Recompute winner finish time using the changed speed, then compare the slower racer's distance at that instant.";
      } else if (input.mode === "SLOWER_REST") {
        if (!input.slowerRestTime) throw new Error("slower rest time required"); positive(input.slowerRestTime, "slower rest time");
        const winnerTime = divide(input.raceDistance, input.fasterSpeed); const movingTime = subtract(winnerTime, input.slowerRestTime); positive(movingTime, "slower moving time");
        lead = subtract(input.raceDistance, multiply(input.slowerSpeed, movingTime)); invariant = "The slower racer covers distance only during winnerTime minus the declared rest interval.";
      } else {
        if (!input.fasterStartDelay) throw new Error("faster start delay required"); positive(input.fasterStartDelay, "faster start delay");
        const fasterFinishClock = add(input.fasterStartDelay, divide(input.raceDistance, input.fasterSpeed));
        lead = subtract(input.raceDistance, multiply(input.slowerSpeed, fasterFinishClock)); positive(lead, "faster racer must still win after delay");
        invariant = "The slower racer moves during the faster racer's start delay plus the faster racer's running time.";
      }
      positive(lead, "changed-race lead"); return { authorityKey: input.authorityKey, answer: lead, unit: "METRE", invariant };
    }
    case "runnerStateFromTwoRaceOutcomes": {
      positive(input.firstRaceDistance, "first race distance"); positive(input.firstRaceDistanceLead, "first race distance lead"); positive(input.secondRaceDistance, "second race distance"); positive(input.secondRaceTimeLead, "second race time lead");
      const slowerFraction = divide(subtract(input.firstRaceDistance, input.firstRaceDistanceLead), input.firstRaceDistance); positive(slowerFraction, "slower/faster speed ratio");
      const fasterSpeed = divide(multiply(input.secondRaceDistance, subtract(rational(1), slowerFraction)), multiply(slowerFraction, input.secondRaceTimeLead));
      const slowerSpeed = multiply(slowerFraction, fasterSpeed);
      return { authorityKey: input.authorityKey, answer: input.target === "FASTER_SPEED" ? fasterSpeed : slowerSpeed, unit: "METRE_PER_SECOND", invariant: "The first outcome fixes slower/faster speed ratio; the second race's absolute time gap fixes the common speed scale." };
    }
  }
}