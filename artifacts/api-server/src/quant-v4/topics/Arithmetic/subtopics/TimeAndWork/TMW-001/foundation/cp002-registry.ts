import type { TmwCp002RegistryEntry } from "./cp002-types";

const entries: Array<Omit<TmwCp002RegistryEntry, "qlId">> = [
  { cpId: "TMW-CP-002", solveMode: "findCombinedTimeFromIndividualTimes", answerType: "TIME", ruleId: "TMW_RATE_COMBINE_POSITIVE", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findCombinedWorkInGivenTime", answerType: "FRACTION", ruleId: "TMW_RATE_COMBINE_POSITIVE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findMissingIndividualTimeFromCombinedAndKnownTimes", answerType: "TIME", ruleId: "TMW_RATE_COMPONENT_EXTRACT", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findAllTogetherTimeFromPairwiseTimes", answerType: "TIME", ruleId: "TMW_PAIRWISE_RATE_SYSTEM", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findIndividualTimeFromPairwiseTimes", answerType: "TIME", ruleId: "TMW_PAIRWISE_RATE_SYSTEM", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findPairTimeFromAllTogetherAndThirdTime", answerType: "TIME", ruleId: "TMW_RATE_COMPONENT_EXTRACT", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findNetTimeWithDestructiveAgent", answerType: "TIME", ruleId: "TMW_RATE_COMBINE_SIGNED", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findDestructiveTimeFromPositiveAndNetTimes", answerType: "TIME", ruleId: "TMW_RATE_COMBINE_SIGNED", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes", answerType: "TIME", ruleId: "TMW_RATE_COMBINE_SIGNED", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findIdenticalAgentCountFromSingleAndCombinedTime", answerType: "COUNT", ruleId: "TMW_IDENTICAL_AGENT_SCALING", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findCombinedTimeFromIdenticalAgentCount", answerType: "TIME", ruleId: "TMW_IDENTICAL_AGENT_SCALING", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findCombinedOutputFromExplicitRates", answerType: "OUTPUT", ruleId: "TMW_EXPLICIT_RATE_AGGREGATION", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findMissingRateFromSignedNetRate", answerType: "RATE", ruleId: "TMW_RATE_COMBINE_SIGNED", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-002", solveMode: "findCompletionTimeDifferenceBetweenTeams", answerType: "TIME", ruleId: "TMW_TEAM_RATE_COMPARISON", difficulty: "Hard", publiclyPublishable: false },
];

export const TMW_CP002_REGISTRY: TmwCp002RegistryEntry[] = entries.map((entry, index) => ({
  ...entry,
  qlId: `TMW-QL-${String(index + 21).padStart(3, "0")}`,
}));

export function getTmwCp002Entry(qlId: string): TmwCp002RegistryEntry {
  const entry = TMW_CP002_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-CP-002 question language: ${qlId}`);
  return entry;
}
