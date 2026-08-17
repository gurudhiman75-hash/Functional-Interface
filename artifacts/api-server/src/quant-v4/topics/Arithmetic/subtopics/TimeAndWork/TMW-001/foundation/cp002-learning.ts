import { add, divide, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import { signedKnownTotal, sumTmwRates } from "./cp002-solver";
import type { Rational } from "./types";
import type { TmwCp002MisconceptionId, TmwCp002Option, TmwCp002Parameters, TmwCp002RegistryEntry, TmwCp002Solution } from "./cp002-types";

export interface TmwCp002LearningShortcut {
  title: string;
  steps: string[];
}

export interface TmwCp002CommonTrap {
  optionLabel: string;
  optionText: string;
  misconceptionId: Exclude<TmwCp002MisconceptionId, "CORRECT">;
  explanation: string;
}

function rateSumLatex(times: Rational[]): string {
  return times.map((time) => `\\frac{1}{${toLatex(time)}}`).join("+");
}

function setupLatex(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters): string {
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes":
      return `\\text{Individual times: }${p.individualTimes.map((time, index) => `T_${index + 1}=${toLatex(time)}`).join(",\\quad ")}`;
    case "findCombinedWorkInGivenTime":
      return `\\text{Individual times: }${p.individualTimes.map((time, index) => `T_${index + 1}=${toLatex(time)}`).join(",\\quad ")},\\quad t=${toLatex(required(p.duration, "duration"))}`;
    case "findMissingIndividualTimeFromCombinedAndKnownTimes":
      return `T_{all}=${toLatex(required(p.combinedTime, "combinedTime"))},\\quad \\text{known times: }${p.individualTimes.slice(0, -1).map(toLatex).join(",")}`;
    case "findAllTogetherTimeFromPairwiseTimes": {
      const pair = required(p.pairwiseTimes, "pairwiseTimes");
      return `T_{AB}=${toLatex(pair.ab)},\\quad T_{BC}=${toLatex(pair.bc)},\\quad T_{CA}=${toLatex(pair.ca)}`;
    }
    case "findIndividualTimeFromPairwiseTimes": {
      const pair = required(p.pairwiseTimes, "pairwiseTimes");
      return `T_{AB}=${toLatex(pair.ab)},\\quad T_{BC}=${toLatex(pair.bc)},\\quad T_{CA}=${toLatex(pair.ca)},\\quad \\text{target agent}=${required(p.targetAgentIndex, "targetAgentIndex") + 1}`;
    }
    case "findPairTimeFromAllTogetherAndThirdTime":
      return `T_{ABC}=${toLatex(required(p.combinedTime, "combinedTime"))},\\quad T_C=${toLatex(required(p.thirdTime, "thirdTime"))}`;
    case "findNetTimeWithDestructiveAgent":
      return `\\text{Positive times: }${p.individualTimes.map(toLatex).join(",")},\\quad T_{rework}=${toLatex(required(p.destructiveTime, "destructiveTime"))}`;
    case "findDestructiveTimeFromPositiveAndNetTimes":
      return `\\text{Positive times: }${p.individualTimes.map(toLatex).join(",")},\\quad T_{net}=${toLatex(required(p.netTime, "netTime"))}`;
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes":
      return `\\text{Known positive times: }${required(p.knownPositiveTimes, "knownPositiveTimes").map(toLatex).join(",")},\\quad T_{rework}=${toLatex(required(p.destructiveTime, "destructiveTime"))},\\quad T_{net}=${toLatex(required(p.netTime, "netTime"))}`;
    case "findIdenticalAgentCountFromSingleAndCombinedTime":
      return `T_{single}=${toLatex(p.individualTimes[0])},\\quad T_{group}=${toLatex(required(p.combinedTime, "combinedTime"))}`;
    case "findCombinedTimeFromIdenticalAgentCount":
      return `T_{single}=${toLatex(p.individualTimes[0])},\\quad n=${required(p.identicalAgentCount, "identicalAgentCount")}`;
    case "findCombinedOutputFromExplicitRates":
      return `\\text{Rates: }${required(p.explicitRates, "explicitRates").map(toLatex).join(",")},\\quad t=${toLatex(required(p.duration, "duration"))}`;
    case "findMissingRateFromSignedNetRate":
      return `r_{known}=${toLatex(signedKnownTotal(p))},\\quad r_{net}=${toLatex(required(p.netRate, "netRate"))},\\quad \\text{missing sign}=${required(p.missingRateSign, "missingRateSign") === 1 ? "+" : "-"}`;
    case "findCompletionTimeDifferenceBetweenTeams":
      return `\\text{Team A times: }${required(p.teamATimes, "teamATimes").map(toLatex).join(",")},\\quad \\text{Team B times: }${required(p.teamBTimes, "teamBTimes").map(toLatex).join(",")}`;
  }
}

function checkLatex(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution): string {
  const x = solution.answer;
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes":
      return `\\text{Check: }\\frac{1}{${toLatex(x)}}=${rateSumLatex(p.individualTimes)}`;
    case "findCombinedWorkInGivenTime":
      return `\\text{Check: }${toLatex(x)}=\\left(${rateSumLatex(p.individualTimes)}\\right)${toLatex(required(p.duration, "duration"))}`;
    case "findMissingIndividualTimeFromCombinedAndKnownTimes":
      return `\\text{Check: }\\frac{1}{${toLatex(x)}}+${rateSumLatex(p.individualTimes.slice(0, -1))}=\\frac{1}{${toLatex(required(p.combinedTime, "combinedTime"))}}`;
    case "findAllTogetherTimeFromPairwiseTimes": {
      const pair = required(p.pairwiseTimes, "pairwiseTimes");
      return `\\text{Check: }\\frac{2}{${toLatex(x)}}=\\frac{1}{${toLatex(pair.ab)}}+\\frac{1}{${toLatex(pair.bc)}}+\\frac{1}{${toLatex(pair.ca)}}`;
    }
    case "findIndividualTimeFromPairwiseTimes": {
      const pair = required(p.pairwiseTimes, "pairwiseTimes");
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      const expression = target === 0
        ? `\\frac{1}{${toLatex(pair.ab)}}+\\frac{1}{${toLatex(pair.ca)}}-\\frac{1}{${toLatex(pair.bc)}}`
        : target === 1
          ? `\\frac{1}{${toLatex(pair.ab)}}+\\frac{1}{${toLatex(pair.bc)}}-\\frac{1}{${toLatex(pair.ca)}}`
          : `\\frac{1}{${toLatex(pair.bc)}}+\\frac{1}{${toLatex(pair.ca)}}-\\frac{1}{${toLatex(pair.ab)}}`;
      return `\\text{Check: }\\frac{2}{${toLatex(x)}}=${expression}`;
    }
    case "findPairTimeFromAllTogetherAndThirdTime":
      return `\\text{Check: }\\frac{1}{${toLatex(x)}}+\\frac{1}{${toLatex(required(p.thirdTime, "thirdTime"))}}=\\frac{1}{${toLatex(required(p.combinedTime, "combinedTime"))}}`;
    case "findNetTimeWithDestructiveAgent":
      return `\\text{Check: }\\frac{1}{${toLatex(x)}}=${rateSumLatex(p.individualTimes)}-\\frac{1}{${toLatex(required(p.destructiveTime, "destructiveTime"))}}`;
    case "findDestructiveTimeFromPositiveAndNetTimes":
      return `\\text{Check: }${rateSumLatex(p.individualTimes)}-\\frac{1}{${toLatex(x)}}=\\frac{1}{${toLatex(required(p.netTime, "netTime"))}}`;
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes":
      return `\\text{Check: }\\frac{1}{${toLatex(x)}}+${rateSumLatex(required(p.knownPositiveTimes, "knownPositiveTimes"))}-\\frac{1}{${toLatex(required(p.destructiveTime, "destructiveTime"))}}=\\frac{1}{${toLatex(required(p.netTime, "netTime"))}}`;
    case "findIdenticalAgentCountFromSingleAndCombinedTime":
      return `\\text{Check: }${toLatex(x)}\\times${toLatex(required(p.combinedTime, "combinedTime"))}=${toLatex(p.individualTimes[0])}`;
    case "findCombinedTimeFromIdenticalAgentCount":
      return `\\text{Check: }${toLatex(x)}\\times${required(p.identicalAgentCount, "identicalAgentCount")}=${toLatex(p.individualTimes[0])}`;
    case "findCombinedOutputFromExplicitRates":
      return `\\text{Check: }\\frac{${toLatex(x)}}{${toLatex(required(p.duration, "duration"))}}=${required(p.explicitRates, "explicitRates").map(toLatex).join("+")}`;
    case "findMissingRateFromSignedNetRate": {
      const sign = required(p.missingRateSign, "missingRateSign");
      return `\\text{Check: }${toLatex(signedKnownTotal(p))}${sign === 1 ? "+" : "-"}${toLatex(x)}=${toLatex(required(p.netRate, "netRate"))}`;
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const timeA = reciprocal(sumTmwRates(required(p.teamATimes, "teamATimes").map(reciprocal)));
      const timeB = reciprocal(sumTmwRates(required(p.teamBTimes, "teamBTimes").map(reciprocal)));
      return `\\text{Check: }${toLatex(x)}=\\left|${toLatex(timeA)}-${toLatex(timeB)}\\right|`;
    }
  }
}

export function buildTmwCp002WorkingLatex(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution): string[] {
  return [setupLatex(entry, p), ...solution.workedLatex, checkLatex(entry, p, solution)];
}

export function buildTmwCp002Shortcut(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution): TmwCp002LearningShortcut {
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes": return { title: "10-Second Add Rates", steps: [`Add the reciprocal completion times, then invert once; the group time is ${solution.answerText}.`] };
    case "findCombinedWorkInGivenTime": return { title: "10-Second Rate × Duration", steps: [`Add the individual rates and multiply by the shared duration to obtain ${solution.answerText}.`] };
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": return { title: "10-Second Missing Rate", steps: [`Subtract all known rates from the all-together rate, then invert the remainder to get ${solution.answerText}.`] };
    case "findAllTogetherTimeFromPairwiseTimes": return { title: "10-Second Pairwise Half-Sum", steps: [`Add the three pair rates, halve because each agent appears twice, then invert to get ${solution.answerText}.`] };
    case "findIndividualTimeFromPairwiseTimes": return { title: "10-Second Two Plus One Minus", steps: [`Add the two pair rates containing the target, subtract the opposite pair rate, halve, and invert; the answer is ${solution.answerText}.`] };
    case "findPairTimeFromAllTogetherAndThirdTime": return { title: "10-Second Remove Third Rate", steps: [`Subtract the third agent's rate from the all-together rate and invert; the pair takes ${solution.answerText}.`] };
    case "findNetTimeWithDestructiveAgent": return { title: "10-Second Signed Rate", steps: [`Add productive rates, subtract the rework rate, and invert the positive net rate to obtain ${solution.answerText}.`] };
    case "findDestructiveTimeFromPositiveAndNetTimes": return { title: "10-Second Rework Isolation", steps: [`Subtract the observed net rate from the total productive rate, then invert; rework alone takes ${solution.answerText}.`] };
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": return { title: "10-Second Missing Constructive Rate", steps: [`Start from the net rate, remove known productive rates, restore the subtracted rework rate, and invert to get ${solution.answerText}.`] };
    case "findIdenticalAgentCountFromSingleAndCombinedTime": return { title: "10-Second Identical Count", steps: [`Divide the single-agent time by the group time; the group contains ${solution.answerText}.`] };
    case "findCombinedTimeFromIdenticalAgentCount": return { title: "10-Second Identical Group Time", steps: [`Divide the single-agent time by the identical-agent count; the group takes ${solution.answerText}.`] };
    case "findCombinedOutputFromExplicitRates": return { title: "10-Second Output Total", steps: [`Add the explicit rates and multiply by the common duration; total output is ${solution.answerText}.`] };
    case "findMissingRateFromSignedNetRate": return { title: "10-Second Signed-Term Isolation", steps: [`Keep productive terms positive and rework terms negative, then isolate the missing magnitude: ${solution.answerText}.`] };
    case "findCompletionTimeDifferenceBetweenTeams": return { title: "10-Second Team Comparison", steps: [`Find each team's rate and time separately, then take the absolute time difference: ${solution.answerText}.`] };
  }
}

const preferredTrap: Partial<Record<TmwCp002RegistryEntry["solveMode"], TmwCp002MisconceptionId[]>> = {
  findCombinedTimeFromIndividualTimes: ["ADD_TIMES_INSTEAD_OF_RATES", "AVERAGE_TIMES"],
  findCombinedWorkInGivenTime: ["DURATION_OMITTED", "OMIT_ONE_AGENT"],
  findMissingIndividualTimeFromCombinedAndKnownTimes: ["KNOWN_RATE_WRONG_SIGN", "RECIPROCAL_NOT_TAKEN"],
  findAllTogetherTimeFromPairwiseTimes: ["PAIRWISE_FACTOR_TWO_MISSED", "AVERAGE_TIMES"],
  findIndividualTimeFromPairwiseTimes: ["PAIRWISE_WRONG_SIGN", "PAIRWISE_FACTOR_TWO_MISSED"],
  findPairTimeFromAllTogetherAndThirdTime: ["KNOWN_RATE_WRONG_SIGN", "OMIT_ONE_AGENT"],
  findNetTimeWithDestructiveAgent: ["DESTRUCTIVE_RATE_ADDED", "DESTRUCTIVE_RATE_OMITTED"],
  findDestructiveTimeFromPositiveAndNetTimes: ["DESTRUCTIVE_RATE_ADDED", "DESTRUCTIVE_RATE_OMITTED"],
  findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes: ["DESTRUCTIVE_RATE_OMITTED", "DESTRUCTIVE_RATE_ADDED"],
  findIdenticalAgentCountFromSingleAndCombinedTime: ["IDENTICAL_COUNT_MULTIPLIED", "IDENTICAL_COUNT_IGNORED"],
  findCombinedTimeFromIdenticalAgentCount: ["IDENTICAL_COUNT_IGNORED", "OMIT_ONE_AGENT"],
  findCombinedOutputFromExplicitRates: ["DURATION_OMITTED", "ONE_RATE_OMITTED"],
  findMissingRateFromSignedNetRate: ["KNOWN_RATE_WRONG_SIGN", "DESTRUCTIVE_RATE_OMITTED"],
  findCompletionTimeDifferenceBetweenTeams: ["TEAM_TIMES_ADDED", "FASTER_TEAM_TIME_REPORTED"],
};

function trapReason(id: Exclude<TmwCp002MisconceptionId, "CORRECT">): string {
  switch (id) {
    case "ADD_TIMES_INSTEAD_OF_RATES": return "adds completion times even though simultaneous work requires adding rates";
    case "AVERAGE_TIMES": return "averages completion times, which does not represent the combined rate";
    case "OMIT_ONE_AGENT": return "leaves one active contribution out of the group calculation";
    case "RECIPROCAL_NOT_TAKEN": return "uses a rate as a time, or a time as a rate, without taking the reciprocal";
    case "PAIRWISE_FACTOR_TWO_MISSED": return "forgets that the three pair rates count every individual rate twice";
    case "PAIRWISE_WRONG_SIGN": return "uses the wrong plus/minus arrangement while isolating one agent from pair rates";
    case "DESTRUCTIVE_RATE_ADDED": return "adds a rework rate even though it reduces completed work";
    case "DESTRUCTIVE_RATE_OMITTED": return "ignores the continuing loss caused by rework";
    case "KNOWN_RATE_WRONG_SIGN": return "moves a known rate across the equation with the wrong sign";
    case "INVERT_BEFORE_ISOLATING": return "takes a reciprocal before the missing rate has been isolated";
    case "IDENTICAL_COUNT_MULTIPLIED": return "scales the identical-agent time in the wrong direction";
    case "IDENTICAL_COUNT_IGNORED": return "keeps the single-agent time although several identical agents work together";
    case "DURATION_OMITTED": return "reports the combined rate without applying the stated working duration";
    case "ONE_RATE_OMITTED": return "uses only part of the explicit-rate total";
    case "TEAM_TIMES_ADDED": return "adds the two team completion times although the question asks for their difference";
    case "FASTER_TEAM_TIME_REPORTED": return "reports one team's completion time instead of the gap between the teams";
    case "SLOWER_TEAM_TIME_REPORTED": return "reports the other team's completion time instead of the requested difference";
  }
}

export function buildTmwCp002CommonTrap(entry: TmwCp002RegistryEntry, options: TmwCp002Option[]): TmwCp002CommonTrap {
  const preferred = preferredTrap[entry.solveMode] ?? [];
  let selectedIndex = -1;
  for (const id of preferred) {
    const index = options.findIndex((option) => option.misconceptionId === id);
    if (index >= 0) { selectedIndex = index; break; }
  }
  if (selectedIndex < 0) selectedIndex = options.findIndex((option) => option.misconceptionId !== "CORRECT");
  if (selectedIndex < 0) throw new Error("CP-002 option set has no distractor for the common-trap explanation");
  const selected = options[selectedIndex];
  if (selected.misconceptionId === "CORRECT") throw new Error("CP-002 common trap selected the correct option");
  const optionLabel = `Option ${"ABCD"[selectedIndex] ?? selectedIndex + 1}`;
  return {
    optionLabel,
    optionText: selected.text,
    misconceptionId: selected.misconceptionId,
    explanation: `${optionLabel} (${selected.text}) ${trapReason(selected.misconceptionId)}; use the signed rate equation shown above instead.`,
  };
}
