import { divide, multiply, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP010_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";

function value(r: Rational) { return toMixedString(r); }
function metres(r: Rational) { return `${value(r)} m`; }
function seconds(r: Rational) { return `${value(r)} seconds`; }
function speed(r: Rational) { return `${value(r)} m/s`; }
function ratio(r: Rational) { return `${r.numerator}:${r.denominator}`; }
function answerText(solution: TsdCp010ExecutableSolution) {
  if (solution.unit === "METRE") return metres(solution.answer);
  if (solution.unit === "SECOND") return seconds(solution.answer);
  if (solution.unit === "METRE_PER_SECOND") return speed(solution.answer);
  if (solution.unit === "PERCENT") return `${value(solution.answer)}%`;
  return ratio(solution.answer);
}

function variables(input: TsdCp010ExecutableInput, objects: { first: string; second: string; third?: string; scene: string }) {
  const base: Record<string, string> = { first: objects.first, second: objects.second, third: objects.third ?? "C", scene: objects.scene };
  switch (input.authorityKey) {
    case "finishDistanceLeadState":
    case "finishTimeLeadState":
      return { ...base, raceDistance: metres(input.raceDistance), winnerSpeed: speed(input.winnerSpeed), loserSpeed: speed(input.loserSpeed) };
    case "raceSpeedRatioState":
      return input.mode === "DISTANCE_LEAD"
        ? { ...base, raceDistance: metres(input.raceDistance), distanceLead: metres(input.distanceLead) }
        : { ...base, winnerTime: seconds(input.winnerTime), timeLead: seconds(input.timeLead) };
    case "raceLengthFromLeadEvidence":
      return input.mode === "DISTANCE_LEAD"
        ? { ...base, winnerSpeed: speed(input.winnerSpeed), loserSpeed: speed(input.loserSpeed), distanceLead: metres(input.distanceLead) }
        : { ...base, winnerSpeed: speed(input.winnerSpeed), loserSpeed: speed(input.loserSpeed), timeLead: seconds(input.timeLead) };
    case "deadHeatHandicapState":
      return { ...base, raceDistance: metres(input.raceDistance), fasterSpeed: speed(input.fasterSpeed), slowerSpeed: speed(input.slowerSpeed) };
    case "leadConversionState":
      return { ...base, loserSpeed: speed(input.loserSpeed), distanceLead: input.distanceLead ? metres(input.distanceLead) : "", timeLead: input.timeLead ? seconds(input.timeLead) : "" };
    case "transitiveRaceComparison":
      return { ...base, raceDistance: metres(input.raceDistance), aBeatsBBy: metres(input.aBeatsBBy), bBeatsCBy: metres(input.bBeatsCBy) };
    case "multiOutcomeRaceComparison":
      return { ...base, firstRaceDistance: metres(input.firstRaceDistance), firstRaceLead: metres(input.firstRaceLead), secondRaceDistance: metres(input.secondRaceDistance), secondRaceHeadStart: metres(input.secondRaceHeadStartForLoser) };
    case "changedRaceOutcomeState":
      return { ...base, raceDistance: metres(input.raceDistance), fasterSpeed: speed(input.fasterSpeed), slowerSpeed: speed(input.slowerSpeed), speedIncrease: input.changedFasterSpeed ? speed(subtract(input.changedFasterSpeed, input.fasterSpeed)) : "", restTime: input.slowerRestTime ? seconds(input.slowerRestTime) : "", startDelay: input.fasterStartDelay ? seconds(input.fasterStartDelay) : "" };
    case "runnerStateFromTwoRaceOutcomes":
      return { ...base, firstRaceDistance: metres(input.firstRaceDistance), firstRaceLead: metres(input.firstRaceDistanceLead), secondRaceDistance: metres(input.secondRaceDistance), secondRaceTimeLead: seconds(input.secondRaceTimeLead), targetRunner: input.target === "FASTER_SPEED" ? objects.first : objects.second };
  }
}

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{([A-Za-z0-9]+)\}/g, (_whole, key: string) => vars[key] ?? `{${key}}`);
}

function explanation(input: TsdCp010ExecutableInput, solution: TsdCp010ExecutableSolution): readonly string[] {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const time = divide(input.raceDistance, input.winnerSpeed);
      const lead = subtract(input.raceDistance, multiply(input.loserSpeed, time));
      return input.target === "PERCENT_OF_RACE"
        ? [`Winner's time = ${metres(input.raceDistance)} ÷ ${speed(input.winnerSpeed)} = ${seconds(time)}; the ordinary winning distance is ${metres(lead)}.`, `Winning margin as a percentage of race length = lead ÷ race distance × 100 = ${answerText(solution)}.`]
        : [`Winner's time = ${metres(input.raceDistance)} ÷ ${speed(input.winnerSpeed)} = ${seconds(time)}.`, `The slower racer covers ${metres(multiply(input.loserSpeed, time))}; remaining distance = ${answerText(solution)}.`];
    }
    case "finishTimeLeadState":
      return [`Winner time = ${seconds(divide(input.raceDistance, input.winnerSpeed))}; slower-racer time = ${seconds(divide(input.raceDistance, input.loserSpeed))}.`, `Finish-time difference = ${answerText(solution)}.`];
    case "raceSpeedRatioState":
      return input.mode === "DISTANCE_LEAD"
        ? [`At the winner's finish, the loser has covered ${metres(subtract(input.raceDistance, input.distanceLead))} while the winner has covered ${metres(input.raceDistance)}.`, `Equal elapsed time makes speed ratio equal distance ratio, so the answer is ${answerText(solution)}.`]
        : [`Winner time = ${seconds(input.winnerTime)}; loser time = ${seconds({ numerator: input.winnerTime.numerator * input.timeLead.denominator + input.timeLead.numerator * input.winnerTime.denominator, denominator: input.winnerTime.denominator * input.timeLead.denominator })}.`, `For equal distance, speed ratio is the inverse time ratio, giving ${answerText(solution)}.`];
    case "raceLengthFromLeadEvidence":
      return input.mode === "DISTANCE_LEAD"
        ? [`The lead is the fraction (winner speed − loser speed)/winner speed of the whole race.`, `Substituting ${speed(input.winnerSpeed)}, ${speed(input.loserSpeed)} and ${metres(input.distanceLead)} gives race length ${answerText(solution)}.`]
        : [`Let race length be D. Then time lead = D/${value(input.loserSpeed)} − D/${value(input.winnerSpeed)}.`, `Set this equal to ${seconds(input.timeLead)} and solve; D = ${answerText(solution)}.`];
    case "deadHeatHandicapState":
      return [input.mode === "DISTANCE_HANDICAP" ? `The fair head start equals the slower racer's ordinary unfinished distance when the faster racer finishes.` : `The fair delay equals slower full-race time minus faster full-race time.`, `Required handicap = ${answerText(solution)}.`];
    case "leadConversionState":
      return [input.mode === "DISTANCE_TO_TIME" ? `The slower racer needs remaining distance ÷ speed to finish.` : `The slower racer's remaining distance is speed × remaining time.`, `Equivalent finish margin = ${answerText(solution)}.`];
    case "transitiveRaceComparison":
      return [`Convert each pairwise lead into the fraction of the race covered by the loser when the winner finishes.`, `Multiply the two fractions to infer the third racer's position; remaining distance = ${answerText(solution)}.`];
    case "multiOutcomeRaceComparison":
      return [`Race one fixes the slower/faster speed ratio as (race distance − lead)/race distance.`, `Apply that ratio in race two and include the head start once; final margin = ${answerText(solution)}.`];
    case "changedRaceOutcomeState":
      return [`Use the declared speed/rest/start change to determine the slower racer's actual distance before the faster finish.`, `Subtract that distance from the race length; winning margin = ${answerText(solution)}.`];
    case "runnerStateFromTwoRaceOutcomes":
      return [`The first race converts the distance lead into a slower/faster speed ratio.`, `Use that ratio in the second race's finish-time difference; requested speed = ${answerText(solution)}.`];
  }
}

export const TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW = Object.freeze(TSD_CP010_ENGLISH_REVIEW_CASES.map((reviewCase, index) => {
  const ql = TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.find((x) => x.qlId === reviewCase.qlId);
  if (!ql) throw new Error(`${reviewCase.qlId}: final authoring QL missing`);
  const family = ql.families.find((x) => x.familyId === reviewCase.familyId);
  if (!family) throw new Error(`${reviewCase.familyId}: final authoring family missing`);
  const objects = ql.objectPool[index % ql.objectPool.length]!;
  const stem = fill(family.stem, variables(reviewCase.input, objects));
  const steps = explanation(reviewCase.input, reviewCase.solution);
  return Object.freeze({ qlId: reviewCase.qlId, familyId: reviewCase.familyId, difficulty: family.difficulty, representation: family.representation, stem, answer: answerText(reviewCase.solution), explanation: Object.freeze({ steps, conclusion: `Answer: ${answerText(reviewCase.solution)}.` }), input: reviewCase.input, solution: reviewCase.solution });
}));