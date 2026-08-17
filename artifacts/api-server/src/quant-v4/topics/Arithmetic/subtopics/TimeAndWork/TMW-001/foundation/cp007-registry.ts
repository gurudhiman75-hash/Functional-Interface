import { TMW_CP_007_ID, type TmwCp007RegistryEntry } from "./cp007-types";

export const TMW_CP007_REGISTRY:readonly TmwCp007RegistryEntry[] = [
  {qlId:"TMW-QL-128",cpId:TMW_CP_007_ID,solveMode:"findTwoCategoryEfficiencyRatio",answerType:"RATIO",ruleId:"TMW_CATEGORY_EQUIVALENCE",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-129",cpId:TMW_CP_007_ID,solveMode:"findThreeCategoryEfficiencyRatio",answerType:"TRIPLE_RATIO",ruleId:"TMW_CATEGORY_EQUIVALENCE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-130",cpId:TMW_CP_007_ID,solveMode:"findMixedCrewCompletionTime",answerType:"TIME",ruleId:"TMW_WEIGHTED_CREW_RATE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-131",cpId:TMW_CP_007_ID,solveMode:"findEquivalentCategoryCount",answerType:"COUNT",ruleId:"TMW_CATEGORY_EQUIVALENCE",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-132",cpId:TMW_CP_007_ID,solveMode:"findUnknownCategoryCountForTargetTime",answerType:"COUNT",ruleId:"TMW_WEIGHTED_CREW_RATE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-133",cpId:TMW_CP_007_ID,solveMode:"findCrewCompositionFromTwoOutputFacts",answerType:"COUNT_PAIR",ruleId:"TMW_HETEROGENEOUS_LINEAR_SYSTEM",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-134",cpId:TMW_CP_007_ID,solveMode:"findCategoryRateFromWeightedCrewFacts",answerType:"RATE",ruleId:"TMW_HETEROGENEOUS_LINEAR_SYSTEM",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-135",cpId:TMW_CP_007_ID,solveMode:"findHeterogeneousGroupRate",answerType:"RATE",ruleId:"TMW_WEIGHTED_CREW_RATE",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-136",cpId:TMW_CP_007_ID,solveMode:"findCompletionAfterCategoryReplacement",answerType:"TIME",ruleId:"TMW_CATEGORY_REPLACEMENT",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-137",cpId:TMW_CP_007_ID,solveMode:"findMixedCrewOutput",answerType:"WORK",ruleId:"TMW_WEIGHTED_CREW_RATE",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-138",cpId:TMW_CP_007_ID,solveMode:"findEquivalentStandardResourceTime",answerType:"RESOURCE_TIME",ruleId:"TMW_WEIGHTED_CONTRIBUTION",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-139",cpId:TMW_CP_007_ID,solveMode:"findMinimumIntegerCrewComposition",answerType:"COUNT_PAIR",ruleId:"TMW_INTEGER_CREW_SEARCH",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-140",cpId:TMW_CP_007_ID,solveMode:"findUnknownCategorySoloTime",answerType:"TIME",ruleId:"TMW_HETEROGENEOUS_LINEAR_SYSTEM",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-141",cpId:TMW_CP_007_ID,solveMode:"findCategoryContributionFraction",answerType:"FRACTION",ruleId:"TMW_WEIGHTED_CONTRIBUTION",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-142",cpId:TMW_CP_007_ID,solveMode:"compareTwoHeterogeneousCrews",answerType:"RATIO",ruleId:"TMW_WEIGHTED_CREW_RATE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-143",cpId:TMW_CP_007_ID,solveMode:"findIntegerCrewCompositionUnderConstraints",answerType:"COUNT_PAIR",ruleId:"TMW_HETEROGENEOUS_LINEAR_SYSTEM",difficulty:"Hard",publiclyPublishable:false},
] as const;

export function getTmwCp007Entry(qlId:string):TmwCp007RegistryEntry {
  const entry=TMW_CP007_REGISTRY.find(candidate=>candidate.qlId===qlId);
  if(!entry)throw new Error(`Unknown TMW-CP-007 QL: ${qlId}`);
  return entry;
}
