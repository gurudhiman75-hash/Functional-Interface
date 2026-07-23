import type { Avg001Difficulty, Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

type UnitKind = "marks" | "currency" | "years" | "units" | "runs" | "none";
type Context = { domain: string; variant: string; lower: string; upper: string; measure: string; unitKind: UnitKind; finalContext: string };

const contexts: Context[] = [
  { domain: "Classroom", variant: "schoolSections", lower: "sections", upper: "school", measure: "marks", unitKind: "marks", finalContext: "overall average marks" },
  { domain: "Workplace", variant: "companyDepartments", lower: "departments", upper: "company", measure: "monthly salary", unitKind: "currency", finalContext: "overall average salary" },
  { domain: "Commerce", variant: "regionalBranches", lower: "branches", upper: "region", measure: "daily sales", unitKind: "currency", finalContext: "regional average sales" },
  { domain: "Factory", variant: "factoryUnits", lower: "production units", upper: "factory", measure: "daily output", unitKind: "units", finalContext: "factory average output" },
  { domain: "Sports", variant: "tournamentTeams", lower: "teams", upper: "tournament", measure: "runs", unitKind: "runs", finalContext: "tournament batting average" },
  { domain: "Community", variant: "villageGroups", lower: "groups", upper: "village", measure: "age", unitKind: "years", finalContext: "overall average age" },
];

const families: Array<{ mode: Avg001SolveMode; count: number; answerType: Avg001QuestionLanguageEntry["answerType"]; strategies: string[] }> = [
  { mode: "findClassAverageFromSectionAverages", count: 8, answerType: "AVERAGE", strategies: ["add-section-totals", "weighted-average-direct", "compare-with-base-average"] },
  { mode: "findSuperGroupAverageFromSubgroups", count: 6, answerType: "AVERAGE", strategies: ["add-group-totals", "weighted-average-direct", "two-level-total"] },
  { mode: "findMissingSectionAverage", count: 6, answerType: "AVERAGE", strategies: ["overall-total-minus-known", "balance-to-target-average", "missing-total-divide"] },
  { mode: "findSectionCountFromOverallAverage", count: 5, answerType: "COUNT", strategies: ["form-total-equation", "average-gap-ratio", "known-total-balance"] },
  { mode: "findMissingSubgroupCount", count: 5, answerType: "COUNT", strategies: ["form-total-equation", "average-gap-ratio", "known-total-balance"] },
  { mode: "findSubgroupTotalFromAverageAndCount", count: 5, answerType: "ABSOLUTE", strategies: ["average-times-count", "group-total-direct", "expand-group-average"] },
  { mode: "findOverallTotalFromHierarchy", count: 5, answerType: "ABSOLUTE", strategies: ["add-all-group-totals", "upper-average-times-count", "two-level-total"] },
  { mode: "findMissingLowerLevelAverage", count: 4, answerType: "AVERAGE", strategies: ["parent-total-minus-known", "balance-to-parent-average", "missing-total-divide"] },
];

const difficulties: Avg001Difficulty[] = [
  ...Array(14).fill("Easy"),
  ...Array(15).fill("Medium"),
  ...Array(15).fill("Hard"),
] as Avg001Difficulty[];

function shown(kind: UnitKind, token: string) {
  if (kind === "currency") return `₹${token}`;
  if (kind === "marks") return `${token} marks`;
  if (kind === "years") return `${token} years`;
  if (kind === "units") return `${token} units`;
  if (kind === "runs") return `${token} runs`;
  return token;
}

function stem(mode: Avg001SolveMode, c: Context, variant: number) {
  const a1 = shown(c.unitKind, "{subgroupAverage1}");
  const a2 = shown(c.unitKind, "{subgroupAverage2}");
  const a3 = shown(c.unitKind, "{subgroupAverage3}");
  const overall = shown(c.unitKind, "{overallAverage}");
  const parent = shown(c.unitKind, "{parentAverage}");
  const total = shown(c.unitKind, "{overallTotal}");
  const patterns: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [
      `Three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} members with average ${c.measure} ${a1}, ${a2} and ${a3}. Find the average for the whole ${c.upper}.`,
      `In a ${c.upper}, the three ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} members. Their averages are ${a1}, ${a2} and ${a3}. Find the combined average.`,
      `The averages of three ${c.lower} are ${a1}, ${a2} and ${a3}, and their sizes are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}. What is the overall average?`,
    ],
    findSuperGroupAverageFromSubgroups: [
      `A ${c.upper} contains three ${c.lower}. Their member counts are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}, with averages ${a1}, ${a2} and ${a3}. Find the ${c.upper}'s average.`,
      `Three ${c.lower} together form one ${c.upper}. Given counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages ${a1}, ${a2}, ${a3}, find the final average.`,
      `Find the average ${c.measure} for the complete ${c.upper} when its three ${c.lower} have sizes {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages ${a1}, ${a2}, ${a3}.`,
    ],
    findMissingSectionAverage: [
      `A ${c.upper} has three ${c.lower} with {subgroupCount1}, {subgroupCount2} and {subgroupCount3} members. The first two averages are ${a1} and ${a2}; the overall average is ${overall}. Find the third average.`,
      `The combined average of three ${c.lower} is ${overall}. Their sizes are {subgroupCount1}, {subgroupCount2}, {subgroupCount3}; two averages are ${a1} and ${a2}. Find the missing average.`,
      `In a ${c.upper}, three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3}. If the full average is ${overall} and two averages are ${a1}, ${a2}, find the remaining average.`,
    ],
    findSectionCountFromOverallAverage: [
      `Two ${c.lower} have {subgroupCount1} members at average ${a1} and an unknown number at average ${a2}. Their combined average is ${overall}. Find the unknown count.`,
      `A ${c.upper} combines one ${c.lower} of {subgroupCount1} members averaging ${a1} with another averaging ${a2}. If the final average is ${overall}, how many members are in the second ${c.lower}?`,
      `The first ${c.lower} has {subgroupCount1} members with average ${a1}. The second has average ${a2}. Together they average ${overall}. Find the second count.`,
    ],
    findMissingSubgroupCount: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2} and an unknown count. Their averages are ${a1}, ${a2} and ${a3}; the overall average is ${overall}. Find the missing count.`,
      `A ${c.upper} contains three ${c.lower}. Two counts are {subgroupCount1} and {subgroupCount2}; all three averages are ${a1}, ${a2}, ${a3}. If the combined average is ${overall}, find the third count.`,
      `The complete ${c.upper} averages ${overall}. Its ${c.lower} have averages ${a1}, ${a2}, ${a3}; the first two sizes are {subgroupCount1}, {subgroupCount2}. Find the remaining size.`,
    ],
    findSubgroupTotalFromAverageAndCount: [
      `One ${c.lower.slice(0, -1)} has {subgroupCount1} members with average ${c.measure} ${a1}. Find its total ${c.measure}.`,
      `The average ${c.measure} of {subgroupCount1} members in one ${c.lower.slice(0, -1)} is ${a1}. What is their combined total?`,
      `A ${c.lower.slice(0, -1)} contains {subgroupCount1} members and has average ${a1}. Find the total represented by that average.`,
    ],
    findOverallTotalFromHierarchy: [
      `Three ${c.lower} have member counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages ${a1}, ${a2}, ${a3}. Find the total ${c.measure} for the whole ${c.upper}.`,
      `For a complete ${c.upper}, the three ${c.lower} have sizes {subgroupCount1}, {subgroupCount2}, {subgroupCount3} with averages ${a1}, ${a2}, ${a3}. Find the combined total.`,
      `Add the totals represented by three ${c.lower}: counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages ${a1}, ${a2}, ${a3}. What is the ${c.upper}'s total?`,
    ],
    findMissingLowerLevelAverage: [
      `A parent group has {parentCount} members with average ${parent}. Two lower groups contain {subgroupCount1} and {subgroupCount2} members at averages ${a1} and ${a2}. The remaining {subgroupCount3} members form a third group. Find its average.`,
      `The parent average is ${parent} for {parentCount} members. Two known groups have counts {subgroupCount1}, {subgroupCount2} and averages ${a1}, ${a2}. Find the average of the remaining {subgroupCount3} members.`,
      `A total of {parentCount} members average ${parent}. Of them, {subgroupCount1} average ${a1} and {subgroupCount2} average ${a2}. Find the average of the last {subgroupCount3} members.`,
    ],
  };
  const choices = patterns[mode]!;
  return choices[variant % choices.length]!;
}

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

const entries: Avg001QuestionLanguageEntry[] = [];
let ql = 330;
let globalIndex = 0;
for (const family of families) {
  for (let index = 0; index < family.count; index += 1) {
    const context = contexts[globalIndex % contexts.length]!;
    const question = stem(family.mode, context, index);
    entries.push({
      cpId: "AVG-CP-006",
      qlId: `AVG-QL-${String(ql).padStart(3, "0")}`,
      taskKind: "multiStageHierarchicalSystemsApplication",
      solveMode: family.mode,
      difficulty: difficulties[globalIndex]!,
      answerType: family.answerType,
      contextDomain: context.domain,
      scenarioVariant: `${context.variant}_${family.mode}_${index + 1}`,
      template: question,
      requiredVariables: placeholders(question),
      explanationStrategyId: family.strategies[index % family.strategies.length]!,
      distractorStrategyIds: ["simpleMeanInsteadOfWeighted", "omitOneGroup", "swapCountAndAverage"],
      displayPolicy: context.unitKind === "currency" ? "EXACT_INTEGER" : "EXACT_INTEGER",
      active: true,
      finalContext: context.finalContext,
      unitKind: context.unitKind,
    });
    ql += 1;
    globalIndex += 1;
  }
}

export const cp006Entries = entries;
