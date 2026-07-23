import type { Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

const allocations: Array<{ cpId: Avg001QuestionLanguageEntry["cpId"]; mode: Avg001SolveMode; count: number; answerType: Avg001QuestionLanguageEntry["answerType"] }> = [
  { cpId: "AVG-CP-001", mode: "findAverageAfterUniformTransformation", count: 8, answerType: "AVERAGE" },
  { cpId: "AVG-CP-002", mode: "findTermCountFromAverageAndExtreme", count: 6, answerType: "COUNT" },
  { cpId: "AVG-CP-002", mode: "findCommonDifferenceFromAverageCountAndExtreme", count: 6, answerType: "DIFFERENCE" },
  { cpId: "AVG-CP-003", mode: "findOriginalCountFromJoiningMemberShift", count: 6, answerType: "COUNT" },
  { cpId: "AVG-CP-003", mode: "findOriginalCountFromLeavingMemberShift", count: 6, answerType: "COUNT" },
  { cpId: "AVG-CP-004", mode: "findGroupCountRatioFromCombinedAverage", count: 8, answerType: "RATIO" },
  { cpId: "AVG-CP-004", mode: "findAverageSpeedForUnequalDistances", count: 6, answerType: "AVERAGE" },
  { cpId: "AVG-CP-004", mode: "findAverageSpeedForUnequalTimes", count: 6, answerType: "AVERAGE" },
];

const contexts = [
  { domain: "Education", noun: "students", unit: "marks", unitKind: "marks" },
  { domain: "Workforce", noun: "employees", unit: "units", unitKind: "units" },
  { domain: "Sports", noun: "players", unit: "runs", unitKind: "runs" },
  { domain: "Demography", noun: "residents", unit: "years", unitKind: "years" },
  { domain: "Finance", noun: "accounts", unit: "rupees", unitKind: "currency" },
  { domain: "Production", noun: "machines", unit: "units", unitKind: "units" },
] as const;

function template(mode: Avg001SolveMode, index: number) {
  const prefix = index % 2 === 0 ? "In a survey" : "During an assessment";
  if (mode === "findAverageAfterUniformTransformation") return index % 3 === 0
    ? `${prefix}, the average of {count} values is {oldAverage}. Each value is increased by {change}. Find the new average.`
    : index % 3 === 1
      ? `${prefix}, the average of {count} values is {oldAverage}. Every value is multiplied by {factor}. What is the new average?`
      : `${prefix}, the average of {count} values is {oldAverage}. Each value is first multiplied by {factor} and then increased by {change}. Find the resulting average.`;
  if (mode === "findTermCountFromAverageAndExtreme") return `The average of an equally spaced series is {average}, its {extremeLabel} term is {extremeValue}, and the common difference is {commonDifference}. Find the number of terms.`;
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return `An equally spaced series has {count} terms and average {average}. Its {extremeLabel} term is {extremeValue}. Find the common difference.`;
  if (mode === "findOriginalCountFromJoiningMemberShift") return `The average of a group is {oldAverage} {unit}. A new member with value {memberValue} {unit} joins, raising the average by {averageChange} {unit}. Find the original group size.`;
  if (mode === "findOriginalCountFromLeavingMemberShift") return `The average of a group is {oldAverage} {unit}. A member with value {memberValue} {unit} leaves, changing the average to {newAverage} {unit}. Find the original group size.`;
  if (mode === "findGroupCountRatioFromCombinedAverage") return `Two groups have averages {groupAverage1} and {groupAverage2}. Their combined average is {combinedAverage}. Find the ratio of their sizes.`;
  if (mode === "findAverageSpeedForUnequalDistances") return `A vehicle covers {distance1} km at {speed1} km/h and {distance2} km at {speed2} km/h. Find its average speed for the whole journey.`;
  return `A vehicle travels at {speed1} km/h for {time1} hours and at {speed2} km/h for {time2} hours. Find its average speed.`;
}

function variables(mode: Avg001SolveMode) {
  if (mode === "findAverageAfterUniformTransformation") return ["count", "oldAverage", "factor", "change"];
  if (mode === "findTermCountFromAverageAndExtreme") return ["average", "extremeLabel", "extremeValue", "commonDifference"];
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return ["count", "average", "extremeLabel", "extremeValue"];
  if (mode === "findOriginalCountFromJoiningMemberShift") return ["oldAverage", "memberValue", "averageChange", "unit"];
  if (mode === "findOriginalCountFromLeavingMemberShift") return ["oldAverage", "memberValue", "newAverage", "unit"];
  if (mode === "findGroupCountRatioFromCombinedAverage") return ["groupAverage1", "groupAverage2", "combinedAverage"];
  if (mode === "findAverageSpeedForUnequalDistances") return ["distance1", "speed1", "distance2", "speed2"];
  return ["speed1", "time1", "speed2", "time2"];
}

let nextId = 374;
export const gapExpansionEntries: Avg001QuestionLanguageEntry[] = allocations.flatMap((allocation) =>
  Array.from({ length: allocation.count }, (_, localIndex) => {
    const context = contexts[(nextId + localIndex) % contexts.length]!;
    const qlId = `AVG-QL-${String(nextId++).padStart(3, "0")}`;
    return {
      cpId: allocation.cpId,
      qlId,
      taskKind: allocation.cpId === "AVG-CP-001" ? "sumCountMappingApplication" : allocation.cpId === "AVG-CP-002" ? "symmetricApPropertiesApplication" : allocation.cpId === "AVG-CP-003" ? "incrementDecrementReplacementApplication" : "weightedCombinedAggregationApplication",
      solveMode: allocation.mode,
      difficulty: localIndex < Math.ceil(allocation.count / 3) ? "Easy" : localIndex < Math.ceil((2 * allocation.count) / 3) ? "Medium" : "Hard",
      answerType: allocation.answerType,
      contextDomain: allocation.mode.includes("Speed") ? "Travel" : context.domain,
      scenarioVariant: `${allocation.mode}:${localIndex + 1}`,
      template: template(allocation.mode, localIndex),
      requiredVariables: variables(allocation.mode),
      explanationStrategyId: `gap:${allocation.mode}`,
      distractorStrategyIds: ["nearby-value", "inverse-operation", "unweighted-shortcut"],
      displayPolicy: "EXACT_INTEGER",
      active: true,
      finalContext: allocation.answerType === "COUNT" ? "members" : allocation.answerType === "RATIO" ? "group-size ratio" : allocation.mode.includes("Speed") ? "km/h" : context.unit,
      unitKind: allocation.mode.includes("Speed") ? "none" : context.unitKind,
    } satisfies Avg001QuestionLanguageEntry;
  }),
);
