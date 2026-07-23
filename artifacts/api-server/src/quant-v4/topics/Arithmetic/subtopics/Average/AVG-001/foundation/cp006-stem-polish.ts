import type { Avg001QuestionLanguageEntry } from "./types";

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

function context(entry: Avg001QuestionLanguageEntry) {
  const value = entry.scenarioVariant;
  if (/schoolSections/i.test(value)) return { lower: "sections", singular: "section", upper: "school", members: "students" };
  if (/companyDepartments/i.test(value)) return { lower: "departments", singular: "department", upper: "company", members: "employees" };
  if (/regionalBranches/i.test(value)) return { lower: "branches", singular: "branch", upper: "region", members: "employees" };
  if (/factoryUnits/i.test(value)) return { lower: "production units", singular: "production unit", upper: "factory", members: "machines" };
  if (/tournamentTeams/i.test(value)) return { lower: "teams", singular: "team", upper: "tournament", members: "players" };
  return { lower: "groups", singular: "group", upper: "village", members: "residents" };
}

export function applyAvg001Cp006StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-006") return entry;
  const c = context(entry);
  const index = Number(entry.qlId.split("-").at(-1)) - 330;
  const variant = index % 4;

  const templates: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [
      `Three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, with averages {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3}. Find the combined average.`,
      `For three ${c.lower}, the counts are {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and the averages are {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the overall average.`,
      `Three ${c.lower} average {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3}; their sizes are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}. Find the combined average.`,
      `A ${c.upper} has three ${c.lower} of {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, averaging {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3}. Find its average.`,
    ],
    findSuperGroupAverageFromSubgroups: [
      `Three ${c.lower} form one ${c.upper}. Their counts are {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the combined average.`,
      `A ${c.upper} consists of three ${c.lower} with sizes {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the overall average.`,
      `The three ${c.lower} have {subgroupCount1}, {subgroupCount2}, {subgroupCount3} ${c.members} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the ${c.upper} average.`,
      `Combine three ${c.lower}: {subgroupCount1} at {subgroupAverage1}, {subgroupCount2} at {subgroupAverage2}, and {subgroupCount3} at {subgroupAverage3}. Find the overall average.`,
    ],
    findMissingSectionAverage: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and combined average {overallAverage}. Two averages are {subgroupAverage1} and {subgroupAverage2}. Find the third.`,
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3}. Overall average is {overallAverage}; two averages are {subgroupAverage1}, {subgroupAverage2}. Find the missing average.`,
      `Three ${c.lower} of sizes {subgroupCount1}, {subgroupCount2}, {subgroupCount3} average {overallAverage} overall. Two averages are {subgroupAverage1}, {subgroupAverage2}. Find the third average.`,
      `For three ${c.lower}, sizes are {subgroupCount1}, {subgroupCount2}, {subgroupCount3}; overall average is {overallAverage}. If two averages are {subgroupAverage1}, {subgroupAverage2}, find the third.`,
    ],
    findSectionCountFromOverallAverage: [
      `One ${c.singular} has {subgroupCount1} ${c.members} averaging {subgroupAverage1}. Another averages {subgroupAverage3}. Their combined average is {overallAverage}. Find the second count.`,
      `A group of {subgroupCount1} ${c.members} averages {subgroupAverage1}. A second group averages {subgroupAverage3}; together they average {overallAverage}. Find the second group size.`,
      `The first ${c.singular} has {subgroupCount1} ${c.members} at an average of {subgroupAverage1}. The second averages {subgroupAverage3}. If the overall average is {overallAverage}, find its size.`,
      `Two groups average {subgroupAverage1} and {subgroupAverage3}. The first has {subgroupCount1} ${c.members}; the combined average is {overallAverage}. How many are in the second group?`,
    ],
    findMissingSubgroupCount: [
      `Three ${c.lower} average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. The first two counts are {subgroupCount1}, {subgroupCount2}; overall average is {overallAverage}. Find the third count.`,
      `The combined average is {overallAverage}. Three ${c.lower} average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}; the first two counts are {subgroupCount1}, {subgroupCount2}. Find the missing count.`,
      `Groups of {subgroupCount1}, {subgroupCount2} and an unknown number average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. If the overall average is {overallAverage}, find the unknown count.`,
      `A ${c.upper} has three ${c.lower} averaging {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Two counts are {subgroupCount1}, {subgroupCount2}; overall average is {overallAverage}. Find the third count.`,
    ],
    findSubgroupTotalFromAverageAndCount: [
      `A ${c.singular} has {subgroupCount1} ${c.members} with an average of {subgroupAverage1}. Find the group total.`,
      `The average for {subgroupCount1} ${c.members} in one ${c.singular} is {subgroupAverage1}. Find their total.`,
      `One ${c.singular} contains {subgroupCount1} ${c.members} and has an average of {subgroupAverage1}. Find the corresponding total.`,
      `For {subgroupCount1} ${c.members}, the average is {subgroupAverage1}. Find the total for the group.`,
    ],
    findOverallTotalFromHierarchy: [
      `Three ${c.lower} have counts {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the combined total.`,
      `For three ${c.lower}, the sizes are {subgroupCount1}, {subgroupCount2}, {subgroupCount3} and the averages are {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the overall total.`,
      `A ${c.upper} has three ${c.lower} of {subgroupCount1}, {subgroupCount2}, {subgroupCount3} ${c.members}, averaging {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the total for the ${c.upper}.`,
      `Three ${c.lower} contain {subgroupCount1}, {subgroupCount2}, {subgroupCount3} ${c.members} with averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find their combined total.`,
    ],
    findMissingLowerLevelAverage: [
      `{parentCount} ${c.members} average {parentAverage}. Of them, {subgroupCount1} average {subgroupAverage1} and {subgroupCount2} average {subgroupAverage2}. Find the average of the remaining {subgroupCount3}.`,
      `{parentCount} ${c.members} average {parentAverage}. Two groups of {subgroupCount1} and {subgroupCount2} average {subgroupAverage1} and {subgroupAverage2}. Find the average of the remaining {subgroupCount3}.`,
      `Overall, {parentCount} ${c.members} average {parentAverage}. Groups of {subgroupCount1} and {subgroupCount2} average {subgroupAverage1} and {subgroupAverage2}. Find the average for the other {subgroupCount3}.`,
      `{parentCount} ${c.members} have average {parentAverage}. Of these, {subgroupCount1} average {subgroupAverage1} and {subgroupCount2} average {subgroupAverage2}. Find the average of the remaining {subgroupCount3}.`,
    ],
  };

  const template = templates[entry.solveMode]![variant]!;
  return { ...entry, template, requiredVariables: placeholders(template) };
}
