import { formatRational, formatTimeText } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp002Parameters, TmwCp002RegistryEntry, TmwCp002Solution } from "./cp002-types";

const LETTERS = ["A", "B", "C", "D"] as const;

function pluralize(noun: string, count: number): string {
  if (count === 1) return noun;
  if (noun.endsWith("y")) return `${noun.slice(0, -1)}ies`;
  if (noun.endsWith("s")) return noun;
  return `${noun}s`;
}

function agentLabel(noun: string, index: number): string {
  return `${noun[0].toUpperCase()}${noun.slice(1)} ${LETTERS[index]}`;
}

function timeText(p: TmwCp002Parameters, value: Rational): string {
  return formatTimeText(value, p.timeUnit, `${p.timeUnit}s`);
}

function timeFact(p: TmwCp002Parameters, time: Rational, index: number): string {
  return `${agentLabel(p.context.agentNoun, index)} alone can complete ${p.context.jobPhrase} in ${timeText(p, time)}`;
}

function joinFacts(facts: string[]): string {
  if (facts.length <= 1) return facts[0] ?? "";
  if (facts.length === 2) return `${facts[0]}, while ${facts[1]}`;
  return `${facts.slice(0, -1).join("; ")}; and ${facts[facts.length - 1]}`;
}

function individualFacts(p: TmwCp002Parameters, times = p.individualTimes): string {
  const first = timeFact(p, times[0], 0);
  const remaining = times.slice(1).map((time, index) => `${agentLabel(p.context.agentNoun, index + 1)} can do so in ${timeText(p, time)}`);
  return joinFacts([first, ...remaining]);
}

function pairFacts(p: TmwCp002Parameters): string {
  const pairwise = required(p.pairwiseTimes, "pairwiseTimes");
  return `${agentLabel(p.context.agentNoun, 0)} and ${agentLabel(p.context.agentNoun, 1)} together take ${timeText(p, pairwise.ab)}, ${agentLabel(p.context.agentNoun, 1)} and ${agentLabel(p.context.agentNoun, 2)} together take ${timeText(p, pairwise.bc)}, and ${agentLabel(p.context.agentNoun, 2)} and ${agentLabel(p.context.agentNoun, 0)} together take ${timeText(p, pairwise.ca)}`;
}

function signedKnownTerms(p: TmwCp002Parameters): string {
  const terms = required(p.signedKnownRates, "signedKnownRates").map((item, index) => {
    if (item.sign === 1) return `Unit ${LETTERS[index]} contributes ${formatRational(item.rate)} ${p.context.outputNoun} per ${p.timeUnit}`;
    return `Unit ${LETTERS[index]} sends ${formatRational(item.rate)} ${p.context.outputNoun} per ${p.timeUnit} back for rework`;
  });
  return joinFacts(terms);
}

function simultaneousVerb(noun: string): string {
  return noun === "machine" ? "operate" : "work";
}

function explicitVerb(noun: string): string {
  switch (noun) {
    case "operator": return "processes";
    case "technician": return "repairs";
    case "machine": return "prints";
    case "crew": return "repairs";
    case "clerk": return "verifies";
    default: return "completes";
  }
}

export function renderTmwCp002Stem(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters): string {
  const noun = p.context.agentNoun;
  const job = p.context.jobPhrase;

  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes":
      return `${individualFacts(p)}. If they work together from the start, how long will they take to finish the assignment?`;
    case "findCombinedWorkInGivenTime": {
      const duration = required(p.duration, "duration");
      return `${individualFacts(p)}. If they work together for ${timeText(p, duration)}, what fraction of the assignment will be completed?`;
    }
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const combinedTime = required(p.combinedTime, "combinedTime");
      const knownTimes = p.individualTimes.slice(0, -1);
      return `${individualFacts(p, knownTimes)}. Together with ${agentLabel(noun, p.individualTimes.length - 1)}, the three finish the assignment in ${timeText(p, combinedTime)}. In how much time can ${agentLabel(noun, p.individualTimes.length - 1)} complete it alone?`;
    }
    case "findAllTogetherTimeFromPairwiseTimes":
      return `For ${job}, ${pairFacts(p)}. How long will all three take when working together?`;
    case "findIndividualTimeFromPairwiseTimes": {
      const targetIndex = required(p.targetAgentIndex, "targetAgentIndex");
      return `For ${job}, ${pairFacts(p)}. How long would ${agentLabel(noun, targetIndex)} take to complete the assignment alone?`;
    }
    case "findPairTimeFromAllTogetherAndThirdTime": {
      const allTime = required(p.combinedTime, "combinedTime");
      const thirdTime = required(p.thirdTime, "thirdTime");
      return `${agentLabel(noun, 0)}, ${agentLabel(noun, 1)} and ${agentLabel(noun, 2)} together complete ${job} in ${timeText(p, allTime)}. ${agentLabel(noun, 2)} alone takes ${timeText(p, thirdTime)}. How long will ${agentLabel(noun, 0)} and ${agentLabel(noun, 1)} take together?`;
    }
    case "findNetTimeWithDestructiveAgent": {
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      return `${individualFacts(p)}. A continuous rework process reverses completed work at a rate that would undo the whole assignment in ${timeText(p, destructiveTime)}. If the ${pluralize(noun, p.individualTimes.length)} work while rework continues, how long will the assignment take to finish?`;
    }
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const netTime = required(p.netTime, "netTime");
      return `${individualFacts(p)}. A continuous rework process reverses part of the completed work. With both ${pluralize(noun, p.individualTimes.length)} working while rework continues, the assignment is finished in ${timeText(p, netTime)}. At the same rate, how long would the rework process take to undo the whole assignment?`;
    }
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const knownTime = required(p.knownPositiveTimes, "knownPositiveTimes")[0];
      const destructiveTime = required(p.destructiveTime, "destructiveTime");
      const netTime = required(p.netTime, "netTime");
      return `${agentLabel(noun, 1)} alone can complete ${job} in ${timeText(p, knownTime)}. A continuous rework process would undo the whole assignment in ${timeText(p, destructiveTime)}. When ${agentLabel(noun, 0)} and ${agentLabel(noun, 1)} work while rework continues, the assignment is completed in ${timeText(p, netTime)}. How long would ${agentLabel(noun, 0)} take alone?`;
    }
    case "findIdenticalAgentCountFromSingleAndCombinedTime": {
      const singleTime = p.individualTimes[0];
      const combinedTime = required(p.combinedTime, "combinedTime");
      return `One ${noun} can complete ${job} in ${timeText(p, singleTime)}. A group of identical ${pluralize(noun, 2)} completes it in ${timeText(p, combinedTime)}. How many ${pluralize(noun, 2)} are in the group?`;
    }
    case "findCombinedTimeFromIdenticalAgentCount": {
      const singleTime = p.individualTimes[0];
      const count = required(p.identicalAgentCount, "identicalAgentCount");
      return `One ${noun} can complete ${job} in ${timeText(p, singleTime)}. How long will ${count} identical ${pluralize(noun, count)} take when working together?`;
    }
    case "findCombinedOutputFromExplicitRates": {
      const rates = required(p.explicitRates, "explicitRates");
      const duration = required(p.duration, "duration");
      const facts = joinFacts(rates.map((rate, index) => `${agentLabel(noun, index)} ${explicitVerb(noun)} ${formatRational(rate)} ${p.context.outputNoun} per ${p.timeUnit}`));
      return `${facts}. If all ${simultaneousVerb(noun)} simultaneously for ${timeText(p, duration)}, what total output will they produce?`;
    }
    case "findMissingRateFromSignedNetRate": {
      const netRate = required(p.netRate, "netRate");
      const missingSign = required(p.missingRateSign, "missingRateSign");
      const role = missingSign === 1 ? "adds productive output" : "sends completed output back for rework";
      return `In a combined operation, ${signedKnownTerms(p)}. One additional unit ${role}. The final net rate is ${formatRational(netRate)} ${p.context.outputNoun} per ${p.timeUnit}. Find the magnitude of the additional unit's rate.`;
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const aTimes = required(p.teamATimes, "teamATimes");
      const bTimes = required(p.teamBTimes, "teamBTimes");
      const aFacts = aTimes.map((time) => timeText(p, time)).join(" and ");
      const bFacts = bTimes.map((time) => timeText(p, time)).join(" and ");
      return `Team A and Team B are assigned identical copies of ${job}. Members A1 and A2 would complete the assignment alone in ${aFacts}, respectively; members B1 and B2 would do so in ${bFacts}, respectively. Each team's two members work together. What is the difference between the team completion times?`;
    }
  }
}

export function tmwCp002ExplanationOpening(entry: TmwCp002RegistryEntry): string {
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes": return "Convert each individual completion time into a one-day rate, add the rates, and then invert the total rate.";
    case "findCombinedWorkInGivenTime": return "First combine the simultaneous rates; multiplying that rate by the stated duration gives the completed fraction.";
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": return "The missing individual rate is the all-together rate after removing the known individual contributions.";
    case "findAllTogetherTimeFromPairwiseTimes": return "Adding the three pairwise rates counts every individual rate twice, so divide their sum by two.";
    case "findIndividualTimeFromPairwiseTimes": return "Use the two pair rates containing the target agent and subtract the opposite pair rate before halving.";
    case "findPairTimeFromAllTogetherAndThirdTime": return "Remove the third agent's rate from the all-together rate to isolate the required pair.";
    case "findNetTimeWithDestructiveAgent": return "Constructive rates add, while the rate that undoes work must be subtracted before finding the completion time.";
    case "findDestructiveTimeFromPositiveAndNetTimes": return "The destructive rate is the difference between the total positive rate and the observed net rate.";
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": return "Rearrange the signed-rate equation to isolate the missing constructive rate, then take its reciprocal.";
    case "findIdenticalAgentCountFromSingleAndCombinedTime": return "For identical agents, group rate is multiplied by the number of agents, so completion time is divided by that count.";
    case "findCombinedTimeFromIdenticalAgentCount": return "Identical simultaneous agents multiply the single-agent rate by their count.";
    case "findCombinedOutputFromExplicitRates": return "Add the explicit output rates and apply the common working duration.";
    case "findMissingRateFromSignedNetRate": return "Treat productive contributions as positive and rework as negative, then isolate the missing signed term.";
    case "findCompletionTimeDifferenceBetweenTeams": return "Build each team's combined rate separately, convert both rates to times, and compare the times.";
  }
}

export function tmwCp002Conclusion(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution): string {
  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes": return `Therefore, the full group completes ${p.context.jobPhrase} in ${solution.answerText}.`;
    case "findCombinedWorkInGivenTime": return `Therefore, the group completes ${solution.answerText} in the stated period.`;
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": return `Therefore, the missing ${p.context.agentNoun} alone would take ${solution.answerText}.`;
    case "findAllTogetherTimeFromPairwiseTimes": return `Therefore, all three together complete the assignment in ${solution.answerText}.`;
    case "findIndividualTimeFromPairwiseTimes": return `Therefore, the requested ${p.context.agentNoun} alone takes ${solution.answerText}.`;
    case "findPairTimeFromAllTogetherAndThirdTime": return `Therefore, the required pair completes the assignment in ${solution.answerText}.`;
    case "findNetTimeWithDestructiveAgent": return `Therefore, the net working arrangement finishes the assignment in ${solution.answerText}.`;
    case "findDestructiveTimeFromPositiveAndNetTimes": return `Therefore, the rework process alone would undo the whole assignment in ${solution.answerText}.`;
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": return `Therefore, ${agentLabel(p.context.agentNoun, 0)} alone takes ${solution.answerText}.`;
    case "findIdenticalAgentCountFromSingleAndCombinedTime": return `Therefore, the group contains ${solution.answerText}.`;
    case "findCombinedTimeFromIdenticalAgentCount": return `Therefore, the identical group completes the assignment in ${solution.answerText}.`;
    case "findCombinedOutputFromExplicitRates": return `Therefore, their combined output is ${solution.answerText}.`;
    case "findMissingRateFromSignedNetRate": return `Therefore, the magnitude of the missing rate is ${solution.answerText}.`;
    case "findCompletionTimeDifferenceBetweenTeams": return `Therefore, the team completion times differ by ${solution.answerText}.`;
  }
}
