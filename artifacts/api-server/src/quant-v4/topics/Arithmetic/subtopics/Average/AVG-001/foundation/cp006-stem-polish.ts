import type { Avg001QuestionLanguageEntry } from "./types";

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

function context(entry: Avg001QuestionLanguageEntry) {
  const value = entry.scenarioVariant;
  if (/schoolSections/i.test(value)) return { lower: "sections", upper: "school", measure: "marks" };
  if (/companyDepartments/i.test(value)) return { lower: "departments", upper: "company", measure: "salary" };
  if (/regionalBranches/i.test(value)) return { lower: "branches", upper: "region", measure: "sales" };
  if (/factoryUnits/i.test(value)) return { lower: "units", upper: "factory", measure: "output" };
  if (/tournamentTeams/i.test(value)) return { lower: "teams", upper: "tournament", measure: "runs" };
  return { lower: "groups", upper: "village", measure: "age" };
}

export function applyAvg001Cp006StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-006") return entry;
  const c = context(entry);
  const index = Number(entry.qlId.split("-").at(-1)) - 330;
  const variant = index % 4;
  const templates: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and average ${c.measure} {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the ${c.upper} average.`,
      `Find the combined average of three ${c.lower}: {subgroupCount1} at {subgroupAverage1}, {subgroupCount2} at {subgroupAverage2}, and {subgroupCount3} at {subgroupAverage3}.`,
      `The ${c.lower} contain {subgroupCount1}, {subgroupCount2}, {subgroupCount3} members with averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the overall average.`,
      `A ${c.upper} has three ${c.lower}: ({subgroupCount1}, {subgroupAverage1}), ({subgroupCount2}, {subgroupAverage2}), ({subgroupCount3}, {subgroupAverage3}). Find its average.`,
    ],
    findSuperGroupAverageFromSubgroups: [
      `Three ${c.lower} form one ${c.upper}. Their counts are {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the final average.`,
      `Find the ${c.upper} average from ${c.lower} of {subgroupCount1}, {subgroupCount2}, {subgroupCount3} members averaging {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}.`,
      `The three ${c.lower} average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3} for counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3}. Find the combined average.`,
      `Combine these ${c.lower}: {subgroupCount1} at {subgroupAverage1}, {subgroupCount2} at {subgroupAverage2}, {subgroupCount3} at {subgroupAverage3}. Find the ${c.upper} average.`,
    ],
    findMissingSectionAverage: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3}. Two averages are {subgroupAverage1}, {subgroupAverage2}; overall average is {overallAverage}. Find the third average.`,
      `The combined average is {overallAverage}. Counts are {subgroupCount1}, {subgroupCount2}, {subgroupCount3}; two averages are {subgroupAverage1}, {subgroupAverage2}. Find the missing average.`,
      `In a ${c.upper}, three ${c.lower} have sizes {subgroupCount1}, {subgroupCount2}, {subgroupCount3}. Overall average is {overallAverage}; two averages are {subgroupAverage1}, {subgroupAverage2}. Find the last.`,
      `For counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3}, the overall average is {overallAverage}. If two group averages are {subgroupAverage1}, {subgroupAverage2}, find the third.`,
    ],
    findSectionCountFromOverallAverage: [
      `One ${c.lower.slice(0, -1)} has {subgroupCount1} members averaging {subgroupAverage1}. Another averages {subgroupAverage3}. Combined average is {overallAverage}. Find its count.`,
      `A group of {subgroupCount1} averages {subgroupAverage1}. A second group averages {subgroupAverage3}; together they average {overallAverage}. Find the second count.`,
      `The first ${c.lower.slice(0, -1)} has {subgroupCount1} members at {subgroupAverage1}. The other has average {subgroupAverage3}. Overall average is {overallAverage}. Find its size.`,
      `Two groups average {subgroupAverage1} and {subgroupAverage3}. The first count is {subgroupCount1}; combined average is {overallAverage}. Find the second count.`,
    ],
    findMissingSubgroupCount: [
      `Three ${c.lower} average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Two counts are {subgroupCount1}, {subgroupCount2}; overall average is {overallAverage}. Find the third count.`,
      `The overall average is {overallAverage}. Two ${c.lower} have counts {subgroupCount1}, {subgroupCount2}; all averages are {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the missing count.`,
      `Counts {subgroupCount1}, {subgroupCount2}, and n have averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. If the combined average is {overallAverage}, find n.`,
      `A ${c.upper} combines three ${c.lower}. Two sizes are {subgroupCount1}, {subgroupCount2}; averages are {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Overall average is {overallAverage}. Find the last size.`,
    ],
    findSubgroupTotalFromAverageAndCount: [
      `A ${c.lower.slice(0, -1)} has {subgroupCount1} members with average ${c.measure} {subgroupAverage1}. Find its total ${c.measure}.`,
      `The average ${c.measure} of {subgroupCount1} members is {subgroupAverage1}. Find their total.`,
      `One ${c.lower.slice(0, -1)} contains {subgroupCount1} members and averages {subgroupAverage1}. What total does this represent?`,
      `For {subgroupCount1} members, the average is {subgroupAverage1}. Find the group total.`,
    ],
    findOverallTotalFromHierarchy: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the ${c.upper} total.`,
      `Find the total for three ${c.lower}: {subgroupCount1} at {subgroupAverage1}, {subgroupCount2} at {subgroupAverage2}, {subgroupCount3} at {subgroupAverage3}.`,
      `The ${c.lower} contain {subgroupCount1}, {subgroupCount2}, {subgroupCount3} members with averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the combined total.`,
      `A ${c.upper} has groups ({subgroupCount1}, {subgroupAverage1}), ({subgroupCount2}, {subgroupAverage2}), ({subgroupCount3}, {subgroupAverage3}). Find the overall total.`,
    ],
    findMissingLowerLevelAverage: [
      `A parent group of {parentCount} averages {parentAverage}. Two groups have counts {subgroupCount1}, {subgroupCount2} and averages {subgroupAverage1}, {subgroupAverage2}. Find the average of the remaining {subgroupCount3}.`,
      `Overall count is {parentCount} and average is {parentAverage}. Known groups are {subgroupCount1} at {subgroupAverage1} and {subgroupCount2} at {subgroupAverage2}. Find the last {subgroupCount3} average.`,
      `{parentCount} members average {parentAverage}. Of them, {subgroupCount1} average {subgroupAverage1} and {subgroupCount2} average {subgroupAverage2}. Find the average of the remaining {subgroupCount3}.`,
      `The parent average is {parentAverage} for {parentCount}. Two lower groups are ({subgroupCount1}, {subgroupAverage1}) and ({subgroupCount2}, {subgroupAverage2}). Find the average of the final {subgroupCount3}.`,
    ],
  };
  const template = templates[entry.solveMode]![variant]!;
  return { ...entry, template, requiredVariables: placeholders(template) };
}
