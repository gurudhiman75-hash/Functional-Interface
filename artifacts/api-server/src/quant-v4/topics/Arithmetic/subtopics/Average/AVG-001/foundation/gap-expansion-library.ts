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
  { lead: "A class", member: "student", plural: "students", verb: "scoring", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A cricket squad", member: "player", plural: "players", verb: "scoring", domain: "Sports", unit: "runs", unitKind: "runs" },
  { lead: "A work team", member: "worker", plural: "workers", verb: "producing", domain: "Workforce", unit: "units", unitKind: "units" },
  { lead: "A production unit", member: "machine", plural: "machines", verb: "producing", domain: "Production", unit: "units", unitKind: "units" },
  { lead: "A training batch", member: "trainee", plural: "trainees", verb: "scoring", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A batting group", member: "batter", plural: "batters", verb: "scoring", domain: "Sports", unit: "runs", unitKind: "runs" },
] as const;

const transformationContexts = [
  { domain: "Education", unit: "marks", unitKind: "marks" },
  { domain: "Statistics", unit: "values", unitKind: "none" },
  { domain: "Measurement", unit: "readings", unitKind: "none" },
  { domain: "Statistics", unit: "values", unitKind: "none" },
  { domain: "Statistics", unit: "observations", unitKind: "none" },
  { domain: "Education", unit: "marks", unitKind: "marks" },
  { domain: "Administration", unit: "values", unitKind: "none" },
  { domain: "Measurement", unit: "measurements", unitKind: "none" },
] as const;

const ratioContexts = [
  { domain: "Education", unit: "marks", unitKind: "marks" },
  { domain: "Workforce", unit: "units", unitKind: "units" },
  { domain: "Sports", unit: "runs", unitKind: "runs" },
  { domain: "Demography", unit: "years", unitKind: "years" },
  { domain: "Production", unit: "units", unitKind: "units" },
  { domain: "Geography", unit: "rainfall", unitKind: "none" },
  { domain: "Education", unit: "marks", unitKind: "marks" },
  { domain: "Finance", unit: "rupees", unitKind: "currency" },
] as const;

const transformationTemplates = [
  "The average of {count} test scores is {oldAverage}. If {change} marks are added to every score, find the new average.",
  "The average of {count} observations is {oldAverage}. If every observation is multiplied by {factor}, what is the new average?",
  "The average of {count} readings is {oldAverage}. Each reading is multiplied by {factor} and then increased by {change}. Find the new average.",
  "The average of {count} selected values is {oldAverage}. If {change} is added to each value, find the new average.",
  "The average of {count} observations is {oldAverage}. If each observation is multiplied by {factor}, find the new average.",
  "The average of {count} scores is {oldAverage}. Each score is multiplied by {factor} and then increased by {change}. Find the new average.",
  "The average of {count} recorded values is {oldAverage}. If every value is increased by {change}, find the new average.",
  "The average of {count} measurements is {oldAverage}. If each measurement is multiplied by {factor}, what is the new average?",
] as const;

const seriesLeads = [
  "An arithmetic progression",
  "An equally spaced score series",
  "A set of equally spaced readings",
  "An equally spaced number series",
  "A sequence of consecutive values",
  "A set of equally spaced values",
] as const;

const ratioTemplates = [
  "Two classes have average marks of {groupAverage1} and {groupAverage2}. Their combined average is {combinedAverage}. Find the ratio of the numbers of students in the two classes.",
  "Two departments have average outputs of {groupAverage1} units and {groupAverage2} units. Their combined average output is {combinedAverage} units. Find the ratio of their staff strengths.",
  "Two teams average {groupAverage1} runs and {groupAverage2} runs. Their combined average is {combinedAverage} runs. Find the ratio of the numbers of players in the teams.",
  "Two employee groups have average ages of {groupAverage1} years and {groupAverage2} years. Their combined average age is {combinedAverage} years. Find the ratio of their sizes.",
  "Two production units have average outputs of {groupAverage1} units and {groupAverage2} units. Their combined average output is {combinedAverage} units. Find the ratio of their numbers of machines.",
  "Two districts record average rainfall of {groupAverage1} cm and {groupAverage2} cm. Their combined average rainfall is {combinedAverage} cm. Find the ratio of the numbers of observations.",
  "Two training batches have average marks of {groupAverage1} and {groupAverage2}. Their combined average is {combinedAverage}. Find the ratio of the numbers of trainees.",
  "Two groups of accounts have average balances of ₹{groupAverage1} thousand and ₹{groupAverage2} thousand. Their combined average balance is ₹{combinedAverage} thousand. Find the ratio of the numbers of accounts.",
] as const;

const travelLeads = ["A bus", "A delivery van", "A train", "A car", "A service vehicle", "An inspection vehicle"] as const;

function template(mode: Avg001SolveMode, index: number) {
  if (mode === "findAverageAfterUniformTransformation") return transformationTemplates[index]!;
  if (mode === "findTermCountFromAverageAndExtreme") {
    return `${seriesLeads[index]} has an average of {average}, a {extremeLabel} term of {extremeValue}, and a common difference of {commonDifference}. How many terms does it contain?`;
  }
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") {
    return `${seriesLeads[index]} contains {count} terms and has an average of {average}. Its {extremeLabel} term is {extremeValue}. Find the common difference.`;
  }
  if (mode === "findOriginalCountFromJoiningMemberShift") {
    const scenario = memberScenarios[index]!;
    return `${scenario.lead} has an average of {oldAverage} {unit}. A new ${scenario.member} ${scenario.verb} {memberValue} {unit} joins, raising the average by {averageChange} {unit}. How many ${scenario.plural} were there originally?`;
  }
  if (mode === "findOriginalCountFromLeavingMemberShift") {
    const scenario = memberScenarios[index]!;
    return `${scenario.lead} has an average of {oldAverage} {unit}. A ${scenario.member} ${scenario.verb} {memberValue} {unit} leaves, and the average becomes {newAverage} {unit}. How many ${scenario.plural} were there originally?`;
  }
  if (mode === "findGroupCountRatioFromCombinedAverage") return ratioTemplates[index]!;
  if (mode === "findAverageSpeedForUnequalDistances") {
    return `${travelLeads[index]} travels {distance1} km at {speed1} km/h and then {distance2} km at {speed2} km/h. Find the average speed for the whole journey.`;
  }
  return `${travelLeads[index]} travels at {speed1} km/h for {time1} h and at {speed2} km/h for {time2} h. Find the average speed for the whole journey.`;
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
      : allocation.mode === "findAverageAfterUniformTransformation"
        ? transformationContexts[localIndex]!
        : allocation.mode === "findGroupCountRatioFromCombinedAverage"
          ? ratioContexts[localIndex]!
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
