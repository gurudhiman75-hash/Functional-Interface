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
  { domain: "Education", unit: "marks", unitKind: "marks" },
  { domain: "Workforce", unit: "units", unitKind: "units" },
  { domain: "Sports", unit: "runs", unitKind: "runs" },
  { domain: "Demography", unit: "years", unitKind: "years" },
  { domain: "Finance", unit: "rupees", unitKind: "currency" },
  { domain: "Production", unit: "units", unitKind: "units" },
] as const;

const memberScenarios = [
  { lead: "A class", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A cricket squad", domain: "Sports", unit: "runs", unitKind: "runs" },
  { lead: "A work team", domain: "Workforce", unit: "units", unitKind: "units" },
  { lead: "A production unit", domain: "Production", unit: "units", unitKind: "units" },
  { lead: "A training batch", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A batting group", domain: "Sports", unit: "runs", unitKind: "runs" },
] as const;

const leads = [
  "A data set", "A performance record", "A monthly report", "A selection list",
  "A production summary", "A score sheet", "A departmental record", "A survey table",
] as const;
const seriesLeads = ["A number series", "An equally spaced score series", "A set of equally spaced readings", "A fixed-interval series", "A row of consecutive values", "A set of equally spaced values"] as const;
const ratioLeads = ["Two classes", "Two departments", "Two teams", "Two employee groups", "Two production units", "Two districts", "Two training batches", "Two account groups"] as const;
const travelLeads = ["A bus journey", "A delivery trip", "A train route", "A highway journey", "A service vehicle trip", "A field inspection tour"] as const;

function template(mode: Avg001SolveMode, index: number) {
  if (mode === "findAverageAfterUniformTransformation") {
    const lead = leads[index]!;
    if (index % 3 === 0) return `${lead} contains {count} values with average {oldAverage}. Each value is increased by {change}. Find the new average.`;
    if (index % 3 === 1) return `${lead} has {count} entries averaging {oldAverage}. Every entry is multiplied by {factor}. What is the resulting average?`;
    return `${lead} has {count} observations with average {oldAverage}. Each observation is multiplied by {factor} and then increased by {change}. Find the final average.`;
  }
  if (mode === "findTermCountFromAverageAndExtreme") return `${seriesLeads[index]} has average {average}, {extremeLabel} term {extremeValue}, and common difference {commonDifference}. Find the number of terms.`;
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return `${seriesLeads[index]} contains {count} terms with average {average}. Its {extremeLabel} term is {extremeValue}. Find the common difference.`;
  if (mode === "findOriginalCountFromJoiningMemberShift") return `${memberScenarios[index]!.lead} has average {oldAverage} {unit}. A new member with value {memberValue} {unit} joins and raises the average by {averageChange} {unit}. Find the original group size.`;
  if (mode === "findOriginalCountFromLeavingMemberShift") return `${memberScenarios[index]!.lead} has average {oldAverage} {unit}. A member with value {memberValue} {unit} leaves, after which the average becomes {newAverage} {unit}. Find the original group size.`;
  if (mode === "findGroupCountRatioFromCombinedAverage") return `${ratioLeads[index]} have average scores of {groupAverage1} and {groupAverage2}; their combined average score is {combinedAverage}. Find the ratio of their sizes.`;
  if (mode === "findAverageSpeedForUnequalDistances") return `${travelLeads[index]} covers {distance1} km at {speed1} km/h and another {distance2} km at {speed2} km/h. Find the average speed for the entire route.`;
  return `${travelLeads[index]} continues at {speed1} km/h for {time1} hours and then at {speed2} km/h for {time2} hours. Find the average speed.`;
}

function variables(mode: Avg001SolveMode, index: number) {
  if (mode === "findAverageAfterUniformTransformation") {
    if (index % 3 === 0) return ["count", "oldAverage", "change"];
    if (index % 3 === 1) return ["count", "oldAverage", "factor"];
    return ["count", "oldAverage", "factor", "change"];
  }
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
    const context = allocation.cpId === "AVG-CP-003"
      ? memberScenarios[localIndex]!
      : contexts[(nextId - 374) % contexts.length]!;
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
      requiredVariables: variables(allocation.mode, localIndex),
      explanationStrategyId: `gap:${allocation.mode}`,
      distractorStrategyIds: ["nearby-value", "inverse-operation", "unweighted-shortcut"],
      displayPolicy: "EXACT_INTEGER",
      active: true,
      finalContext: allocation.answerType === "COUNT" ? "members" : allocation.answerType === "RATIO" ? "group-size ratio" : allocation.mode.includes("Speed") ? "km/h" : context.unit,
      unitKind: allocation.mode.includes("Speed") ? "none" : context.unitKind,
    } satisfies Avg001QuestionLanguageEntry;
  }),
);
