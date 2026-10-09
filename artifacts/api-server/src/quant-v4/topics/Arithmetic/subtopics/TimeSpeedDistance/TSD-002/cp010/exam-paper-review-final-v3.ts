import { divide, multiply, rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";
import {
  TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW,
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW,
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW,
  renderTsdCp010ExamRealStemV2,
  type TsdCp010ExamRealLanguage,
} from "./exam-real-review-final-v2";

const NAMES = Object.freeze([
  ["A", "B", "C"], ["P", "Q", "R"], ["Arun", "Bharat", "Chetan"],
  ["Ravi", "Sahil", "Vikas"], ["Karan", "Mohan", "Nitin"], ["Rohit", "Deepak", "Sumit"],
] as const);

function indexOfFamily(familyId: string) {
  const index = familyId.charCodeAt(familyId.length - 1) - 65;
  if (index < 0 || index > 5) throw new Error(`${familyId}: invalid CP010 family`);
  return index;
}
function value(r: Rational) { return toMixedString(r); }
function m(r: Rational) { return `${value(r)} m`; }
function s(r: Rational) { return `${value(r)} seconds`; }
function v(r: Rational) { return `${value(r)} m/s`; }
function ratio(a: Rational, b: Rational) { return `${value(a)}:${value(b)}`; }

function capability(aSpeed: Rational, bSpeed: Rational) {
  const distance = multiply(multiply(aSpeed, bSpeed), rational(5));
  return Object.freeze({
    distance,
    aTime: divide(distance, aSpeed),
    bTime: divide(distance, bSpeed),
  });
}

function englishPaperStem(familyId: string, input: TsdCp010ExecutableInput): string {
  const i = indexOfFamily(familyId);
  const [a, b, c] = NAMES[i]!;
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      const d = m(input.raceDistance);
      if (input.target === "PERCENT_OF_RACE") return `${a} can run ${m(cap.distance)} in ${s(cap.aTime)}, while ${b} takes ${s(cap.bTime)} for the same distance. In a ${d} race, ${a}'s winning distance is what percent of the race?`;
      return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. By what distance will ${a} beat ${b} in a ${d} race?`,
        `${a} and ${b} take ${s(cap.aTime)} and ${s(cap.bTime)}, respectively, to run ${m(cap.distance)}. In a ${d} race, how many metres does ${a} win by?`,
        `For the same ${m(cap.distance)}, ${a} takes ${s(cap.aTime)} and ${b} takes ${s(cap.bTime)}. If they race ${d}, how far behind is ${b} when ${a} finishes?`,
        `The speeds of ${a} and ${b} are in the ratio ${ratio(input.winnerSpeed, input.loserSpeed)}. In a ${d} race, by what distance does ${a} beat ${b}?`,
        `${a}:${b} in speed is ${ratio(input.winnerSpeed, input.loserSpeed)}. If both start together in a ${d} race, find ${a}'s winning margin.`,
        "",
      ][i]!;
    }
    case "finishTimeLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      const d = m(input.raceDistance);
      return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. By how much time will ${a} beat ${b} in a ${d} race?`,
        `${a} and ${b} take ${s(cap.aTime)} and ${s(cap.bTime)} to cover ${m(cap.distance)}. In a ${d} race, how many seconds before ${b} does ${a} finish?`,
        `For every ${m(cap.distance)}, ${a} takes ${s(cap.aTime)} while ${b} takes ${s(cap.bTime)}. Find the winning time in a ${d} race.`,
        `The speed ratio of ${a} and ${b} is ${ratio(input.winnerSpeed, input.loserSpeed)}. If the race is ${d}, find the difference in their finishing times.`,
        `${a}:${b} in speed is ${ratio(input.winnerSpeed, input.loserSpeed)}. Over ${d}, by how many seconds does ${a} beat ${b}?`,
        `${a} runs at ${v(input.winnerSpeed)} and ${b} at ${v(input.loserSpeed)}. In a ${d} race, what is the time gap at the finish?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const d = m(input.raceDistance), lead = m(input.distanceLead);
        return [
          `In a ${d} race, ${a} beats ${b} by ${lead}. Find the ratio of their speeds.`,
          `${a} beats ${b} by ${lead} in a ${d} race. What is ${a}:${b} in speed?`,
          `When ${a} completes ${d}, ${b} is ${lead} short of the finish. Find their speed ratio.`,
          `In a race of ${d}, ${a} wins over ${b} by ${lead}. The ratio of their speeds is:`,
          `${a} and ${b} start together in a ${d} race. ${a} finishes with ${b} ${lead} behind. Find ${a}:${b}.`,
          `${a} beats ${b} by ${lead} over ${d}. Find the ratio of ${a}'s speed to ${b}'s speed.`,
        ][i]!;
      }
      return [
        `${a} completes a race in ${s(input.winnerTime)} and beats ${b} by ${s(input.timeLead)}. Find ${a}:${b} in speed.`,
        `${a} takes ${s(input.winnerTime)} for a race and ${b} finishes ${s(input.timeLead)} later. Find their speed ratio.`,
        `${a}'s time is ${s(input.winnerTime)} and ${b} reaches the finish ${s(input.timeLead)} after ${a}. What is ${a}:${b} in speed?`,
        `${a} beats ${b} by ${s(input.timeLead)} and takes ${s(input.winnerTime)} to finish the race. Find their speed ratio.`,
        `For the same distance, ${a} takes ${s(input.winnerTime)} and beats ${b} by ${s(input.timeLead)}. Find ${a}:${b}.`,
        `${a} finishes in ${s(input.winnerTime)}; ${b} takes ${s(input.timeLead)} more. Find the ratio of their speeds.`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      if (input.mode === "DISTANCE_LEAD") return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. If ${a} beats ${b} by ${m(input.distanceLead)}, how long is the race?`,
        `${a}:${b} in speed is ${ratio(input.winnerSpeed, input.loserSpeed)}. If ${a} wins by ${m(input.distanceLead)}, find the race distance.`,
        `For ${m(cap.distance)}, ${a} takes ${s(cap.aTime)} and ${b} ${s(cap.bTime)}. In a race ${a} beats ${b} by ${m(input.distanceLead)}. Find its length.`,
        `${a} runs at ${v(input.winnerSpeed)} and ${b} at ${v(input.loserSpeed)}. ${a} wins by ${m(input.distanceLead)}. Find the race distance.`,
        `The speed ratio ${a}:${b} is ${ratio(input.winnerSpeed, input.loserSpeed)} and ${a}'s winning distance is ${m(input.distanceLead)}. Find the total distance.`,
        `${a} beats ${b} by ${m(input.distanceLead)}. Their speeds are ${v(input.winnerSpeed)} and ${v(input.loserSpeed)}. How long is the race?`,
      ][i]!;
      return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. If ${a} beats ${b} by ${s(input.timeLead)}, find the race distance.`,
        `${a} runs at ${v(input.winnerSpeed)} and ${b} at ${v(input.loserSpeed)}. ${a} finishes ${s(input.timeLead)} earlier. Find the race length.`,
        `For ${m(cap.distance)}, ${a} takes ${s(cap.aTime)} and ${b} ${s(cap.bTime)}. In a race ${a} wins by ${s(input.timeLead)}. Find its length.`,
        `The speeds of ${a} and ${b} are ${v(input.winnerSpeed)} and ${v(input.loserSpeed)}. Their finishing times differ by ${s(input.timeLead)}. Find the race distance.`,
        `${a}:${b} in speed is ${ratio(input.winnerSpeed, input.loserSpeed)}. ${a} wins by ${s(input.timeLead)}. Find the length of the race.`,
        `${a} beats ${b} by ${s(input.timeLead)}; their speeds are ${v(input.winnerSpeed)} and ${v(input.loserSpeed)}. How long is the race?`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const cap = capability(input.fasterSpeed, input.slowerSpeed);
      const d = m(input.raceDistance);
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. How many metres start can ${a} give ${b} in a ${d} race so that it ends in a dead heat?`,
        `${a} and ${b} take ${s(cap.aTime)} and ${s(cap.bTime)} to run ${m(cap.distance)}. In a ${d} race, what start should ${b} get so that both finish together?`,
        `${a}:${b} in speed is ${ratio(input.fasterSpeed, input.slowerSpeed)}. What start in metres should ${a} give ${b} in a ${d} race for a dead heat?`,
        `${a} runs at ${v(input.fasterSpeed)} and ${b} at ${v(input.slowerSpeed)}. In a ${d} race, how far ahead should ${b} start so that both finish together?`,
        `In a ${d} race, the speed ratio ${a}:${b} is ${ratio(input.fasterSpeed, input.slowerSpeed)}. Find the start to be given to ${b} for an equal finish.`,
        `${a} is faster than ${b}. Their speeds are ${v(input.fasterSpeed)} and ${v(input.slowerSpeed)}. What start should ${b} receive in a ${d} race so that neither wins?`,
      ][i]!;
      return [
        `${a} can run ${m(cap.distance)} in ${s(cap.aTime)} and ${b} in ${s(cap.bTime)}. In a ${d} race, how many seconds before ${a} should ${b} start for a dead heat?`,
        `${a} and ${b} take ${s(cap.aTime)} and ${s(cap.bTime)} for ${m(cap.distance)}. What time start should ${b} get in a ${d} race so that both finish together?`,
        `${a}:${b} in speed is ${ratio(input.fasterSpeed, input.slowerSpeed)}. In a ${d} race, by how many seconds should ${a}'s start be delayed for a dead heat?`,
        `${a} runs at ${v(input.fasterSpeed)} and ${b} at ${v(input.slowerSpeed)}. How many seconds later should ${a} start in a ${d} race so that both finish together?`,
        `In a ${d} race, ${a}:${b} in speed is ${ratio(input.fasterSpeed, input.slowerSpeed)}. Find the time advantage to be given to ${b} for an equal finish.`,
        `${b} starts first in a ${d} race. The speeds of ${a} and ${b} are ${v(input.fasterSpeed)} and ${v(input.slowerSpeed)}. How many seconds later should ${a} start so that neither wins?`,
      ][i]!;
    }
    case "leadConversionState":
      if (input.mode === "DISTANCE_TO_TIME") return [
        `${a} beats ${b} by ${m(input.distanceLead!)}. If ${b}'s speed is ${v(input.loserSpeed)}, by how much time does ${a} win?`,
        `${a}'s winning distance over ${b} is ${m(input.distanceLead!)} and ${b} runs at ${v(input.loserSpeed)}. Express the win in seconds.`,
        `When ${a} finishes, ${b} is ${m(input.distanceLead!)} short of the post and is running at ${v(input.loserSpeed)}. How much later will ${b} finish?`,
        `${a} wins over ${b} by ${m(input.distanceLead!)}. At ${v(input.loserSpeed)}, how many seconds does ${b} need to cover this distance?`,
        `${b} has ${m(input.distanceLead!)} left when ${a} wins and runs at ${v(input.loserSpeed)}. Find ${a}'s winning time.`,
        `${a} beats ${b} by ${m(input.distanceLead!)}; ${b}'s speed is ${v(input.loserSpeed)}. Find the equivalent time lead.`,
      ][i]!;
      return [
        `${a} beats ${b} by ${s(input.timeLead!)}. If ${b} runs at ${v(input.loserSpeed)}, by how many metres does ${a} win?`,
        `${a} reaches the finish ${s(input.timeLead!)} before ${b}. At ${v(input.loserSpeed)}, how far was ${b} from the finish when ${a} won?`,
        `${b} finishes ${s(input.timeLead!)} after ${a} and runs at ${v(input.loserSpeed)}. Find ${a}'s winning distance.`,
        `${a}'s winning time over ${b} is ${s(input.timeLead!)}. If ${b}'s speed is ${v(input.loserSpeed)}, express the win in metres.`,
        `${a} wins by ${s(input.timeLead!)} while ${b} runs at ${v(input.loserSpeed)}. What distance was left for ${b} at ${a}'s finish?`,
        `${b} takes ${s(input.timeLead!)} more after ${a} finishes and runs at ${v(input.loserSpeed)}. By what distance does ${a} beat ${b}?`,
      ][i]!;
    case "transitiveRaceComparison": {
      const d = m(input.raceDistance), ab = m(input.aBeatsBBy), bc = m(input.bBeatsCBy);
      return [
        `In separate ${d} races, ${a} beats ${b} by ${ab} and ${b} beats ${c} by ${bc}. By how many metres will ${a} beat ${c}?`,
        `${a} beats ${b} by ${ab} in ${d}; over the same distance ${b} beats ${c} by ${bc}. Find ${a}'s winning distance over ${c}.`,
        `In a ${d} race ${a} can give ${b} a start of ${ab}; ${b} can give ${c} a start of ${bc}. What start can ${a} give ${c}?`,
        `Two separate ${d} results are: ${a} beats ${b} by ${ab}, and ${b} beats ${c} by ${bc}. How far behind is ${c} when ${a} finishes?`,
        `${a}, ${b} and ${c} run at fixed speeds. In ${d}, ${a} beats ${b} by ${ab} and ${b} beats ${c} by ${bc}. Find ${a}'s margin over ${c}.`,
        `If ${a} beats ${b} by ${ab} and ${b} beats ${c} by ${bc} in ${d} races, by what distance does ${a} beat ${c}?`,
      ][i]!;
    }
    case "multiOutcomeRaceComparison": {
      const d1 = m(input.firstRaceDistance), l1 = m(input.firstRaceLead), d2 = m(input.secondRaceDistance), start = m(input.secondRaceHeadStartForLoser);
      return [
        `${a} beats ${b} by ${l1} in a ${d1} race. In a ${d2} race, ${b} is given a start of ${start}. By how many metres does ${a} win?`,
        `In ${d1}, ${a} beats ${b} by ${l1}. If they race ${d2} and ${b} starts ${start} ahead, find the result.`,
        `${a} can give ${b} a start of ${l1} in a ${d1} race. What happens in a ${d2} race if ${b} is given a start of ${start}?`,
        `${a} beats ${b} by ${l1} over ${d1}. In a ${d2} rematch, ${b} gets ${start} start. Find ${a}'s winning margin.`,
        `After losing by ${l1} in ${d1}, ${b} is given a start of ${start} in a ${d2} race. By what distance does ${a} win?`,
        `${a} beats ${b} by ${l1} in ${d1}. If ${b} receives ${start} start in ${d2}, how far apart are they when ${a} finishes?`,
      ][i]!;
    }
    case "changedRaceOutcomeState": {
      const d = m(input.raceDistance);
      if (input.mode === "FASTER_SPEED_CHANGE") return [
        `In a ${d} race, ${a} runs at ${v(input.fasterSpeed)} and ${b} at ${v(input.slowerSpeed)}. If ${a}'s speed becomes ${v(input.changedFasterSpeed!)}, by how many metres does ${a} win?`,
        `${a}'s speed is raised from ${v(input.fasterSpeed)} to ${v(input.changedFasterSpeed!)}; ${b} runs at ${v(input.slowerSpeed)}. Find the winning distance in ${d}.`,
        `For a ${d} race, ${a}'s speed changes to ${v(input.changedFasterSpeed!)} while ${b} continues at ${v(input.slowerSpeed)}. Find ${a}'s margin.`,
        `${a} normally runs at ${v(input.fasterSpeed)} but runs the whole ${d} at ${v(input.changedFasterSpeed!)}. ${b} runs at ${v(input.slowerSpeed)}. By what distance does ${a} win?`,
        `In ${d}, ${a} runs at ${v(input.changedFasterSpeed!)} instead of ${v(input.fasterSpeed)}; ${b} runs at ${v(input.slowerSpeed)}. Find the result.`,
        `${a}'s new speed is ${v(input.changedFasterSpeed!)} and ${b}'s is ${v(input.slowerSpeed)} in a ${d} race. How many metres does ${a} win by?`,
      ][i]!;
      if (input.mode === "SLOWER_REST") return [
        `In a ${d} race, ${a} runs at ${v(input.fasterSpeed)} and ${b} at ${v(input.slowerSpeed)}. If ${b} rests for ${s(input.slowerRestTime!)}, by how many metres does ${a} win?`,
        `${a} runs continuously at ${v(input.fasterSpeed)} in ${d}; ${b} runs at ${v(input.slowerSpeed)} but stops for ${s(input.slowerRestTime!)}. Find ${a}'s margin.`,
        `During a ${d} race, ${b} loses ${s(input.slowerRestTime!)} by stopping. The speeds while running are ${v(input.fasterSpeed)} and ${v(input.slowerSpeed)}. How far behind is ${b} when ${a} finishes?`,
        `${a} and ${b} run ${d} at ${v(input.fasterSpeed)} and ${v(input.slowerSpeed)}. ${b} takes a total rest of ${s(input.slowerRestTime!)}. Find the winning distance.`,
        `${b} runs at ${v(input.slowerSpeed)} but rests for ${s(input.slowerRestTime!)} in a ${d} race; ${a} runs at ${v(input.fasterSpeed)} without stopping. By how much does ${a} win?`,
        `${a} runs ${d} at ${v(input.fasterSpeed)}. ${b} runs at ${v(input.slowerSpeed)} and stops for ${s(input.slowerRestTime!)}. How far is ${b} from the finish when ${a} wins?`,
      ][i]!;
      return [
        `In a ${d} race, ${b} starts first at ${v(input.slowerSpeed)}. ${a}, running at ${v(input.fasterSpeed)}, starts ${s(input.fasterStartDelay!)} later and still wins. Find the winning distance.`,
        `${b} starts a ${d} race ${s(input.fasterStartDelay!)} before ${a}. Their speeds are ${v(input.slowerSpeed)} and ${v(input.fasterSpeed)}. By how many metres does ${a} win?`,
        `${a} gives ${b} a time start of ${s(input.fasterStartDelay!)} in a ${d} race. Their speeds are ${v(input.fasterSpeed)} and ${v(input.slowerSpeed)}. Find ${a}'s margin.`,
        `In ${d}, ${a} runs at ${v(input.fasterSpeed)} but starts ${s(input.fasterStartDelay!)} after ${b}, who runs at ${v(input.slowerSpeed)}. If ${a} wins, by how much?`,
        `${b} is allowed to start ${s(input.fasterStartDelay!)} before ${a} in a ${d} race. Speeds are ${v(input.slowerSpeed)} and ${v(input.fasterSpeed)}. Find the final margin.`,
        `${a} starts ${s(input.fasterStartDelay!)} late in a ${d} race but runs at ${v(input.fasterSpeed)} against ${b}'s ${v(input.slowerSpeed)}. How many metres does ${a} win by?`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const target = input.target === "FASTER_SPEED" ? a : b;
      const d1 = m(input.firstRaceDistance), lead = m(input.firstRaceDistanceLead), d2 = m(input.secondRaceDistance), gap = s(input.secondRaceTimeLead);
      return [
        `${a} beats ${b} by ${lead} in a ${d1} race and by ${gap} in a ${d2} race. Find ${target}'s speed.`,
        `In ${d1}, ${a} beats ${b} by ${lead}; in ${d2}, ${a} beats ${b} by ${gap}. If their speeds are unchanged, find ${target}'s speed.`,
        `The same two runners race twice. ${a} wins ${d1} by ${lead} and ${d2} by ${gap}. Find the speed of ${target}.`,
        `${a} and ${b} keep their respective speeds. ${a} beats ${b} by ${lead} over ${d1} and by ${gap} over ${d2}. Find ${target}'s speed.`,
        `A ${d1} race gives ${a} a ${lead} win over ${b}; a ${d2} race gives ${a} a ${gap} win. Find ${target}'s speed.`,
        `${a} beats ${b} by ${lead} in ${d1}. Over ${d2}, ${a} finishes ${gap} earlier. Their speeds do not change. Find ${target}'s speed.`,
      ][i]!;
    }
  }
}

export function renderTsdCp010ExamPaperStemV3(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  return language === "en" ? englishPaperStem(familyId, input) : renderTsdCp010ExamRealStemV2(language, familyId, input);
}

export const TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW = Object.freeze(TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW.map((q) => Object.freeze({ ...q, stem: englishPaperStem(q.familyId, q.input) })));
export const TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW = TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW;
export const TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW = TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW;
