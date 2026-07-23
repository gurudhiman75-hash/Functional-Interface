from pathlib import Path
import re

ROOT = Path('artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001')


def replace_once(path: Path, pattern: str, replacement: str) -> None:
    text = path.read_text(encoding='utf-8')
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'Expected one replacement in {path}, found {count}')
    path.write_text(updated, encoding='utf-8')


cp005_block = r'''  const patterns: Record<string, string[]> = {
    findCorrectedAverageFromMistake: [
      `The average ${c.measure} of {count} ${c.subject} was reported as ${reported}. One entry was ${wrong} instead of ${correct}. Find the correct average.`,
      `While calculating the average for {count} ${c.subject}, ${wrong} was used in place of ${correct}. The reported average was ${reported}. Find the correct average.`,
      `The reported average for {count} ${c.subject} is ${reported}. After ${wrong} is corrected to ${correct}, what is the new average?`,
      `The average ${c.measure} of {count} ${c.subject} was calculated as ${reported}. One value should be ${correct}, not ${wrong}. Find the revised average.`,
      `A register shows an average ${c.measure} of ${reported} for {count} ${c.subject}. One entry of ${wrong} should be ${correct}. Find the correct average.`,
      `For {count} ${c.subject}, the average was found to be ${reported}. If ${wrong} is replaced by ${correct}, what does the average become?`,
      `The average ${c.measure} of {count} ${c.subject} was reported as ${reported}. One value was recorded as ${wrong} instead of ${correct}. Find the correct average.`,
      `An entry of ${wrong} was used while finding the average of {count} ${c.subject}; it should have been ${correct}. The reported average was ${reported}. Find the correct average.`,
      `The reported average ${c.measure} of {count} ${c.subject} is ${reported}. One value changes from ${wrong} to ${correct}. Find the revised average.`,
      `A list of {count} ${c.subject} has a reported average of ${reported}. Correct ${wrong} to ${correct} and find the actual average.`,
    ],
    findReportedAverageBeforeCorrection: [
      `After ${wrong} was replaced by ${correct}, the average ${c.measure} of {count} ${c.subject} became ${corrected}. What was the reported average before the correction?`,
      `The correct average for {count} ${c.subject} is ${corrected}. The earlier calculation used ${wrong} instead of ${correct}. Find the earlier average.`,
      `A wrong entry of ${wrong} was corrected to ${correct}, giving an average of ${corrected} for {count} ${c.subject}. Find the average before correction.`,
      `For {count} ${c.subject}, replacing ${wrong} with ${correct} gives the correct average ${corrected}. What average had been reported earlier?`,
      `The correct average ${c.measure} of {count} ${c.subject} is ${corrected}. Before ${wrong} was changed to ${correct}, what was the reported average?`,
      `Changing ${wrong} to ${correct} makes the average of {count} ${c.subject} equal to ${corrected}. Find the original reported average.`,
    ],
    findCorrectValueFromAverageShift: [
      `The average ${c.measure} of {count} ${c.subject} was ${reported} because one value was entered as ${wrong}. After correction, the average became ${corrected}. Find the correct value.`,
      `For {count} ${c.subject}, an entry of ${wrong} gave an average of ${reported}. The correct average is ${corrected}. What should that entry be?`,
      `One value was recorded as ${wrong}. Correcting it changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the correct value.`,
      `The average of {count} ${c.subject} changes from ${reported} to ${corrected} when the recorded value ${wrong} is corrected. Find the actual value.`,
      `A list of {count} ${c.subject} has a reported average of ${reported}, with one value entered as ${wrong}. The correct average is ${corrected}. Find the correct entry.`,
      `Using ${wrong} for one entry gives an average of ${reported} for {count} ${c.subject}. The correct average is ${corrected}. Find the correct entry.`,
      `One wrong value of ${wrong} made the average of {count} ${c.subject} equal to ${reported} instead of ${corrected}. What is the correct value?`,
      `For {count} ${c.subject}, the reported and correct averages are ${reported} and ${corrected}. If ${wrong} was entered, find the correct value.`,
      `Correcting one entry of ${wrong} changes the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the corrected entry.`,
    ],
    findIncorrectValueFromCorrection: [
      `The average ${c.measure} of {count} ${c.subject} changed from ${reported} to ${corrected} after one entry was corrected to ${correct}. What value had been entered wrongly?`,
      `For {count} ${c.subject}, one entry was corrected to ${correct}, changing the average from ${reported} to ${corrected}. Find the wrong entry.`,
      `One value should have been ${correct}. Correcting it changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the value used earlier.`,
      `The average for {count} ${c.subject} was ${reported} and became ${corrected} after one entry was corrected to ${correct}. What was the wrong entry?`,
      `Correcting one entry to ${correct} changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the incorrect value.`,
      `For {count} ${c.subject}, the correct average is ${corrected} rather than ${reported}. One entry should be ${correct}. Find the value that was recorded wrongly.`,
      `Correcting one value to ${correct} changes the average of {count} ${c.subject} from ${reported} to ${corrected}. What value was replaced?`,
      `Among {count} ${c.subject}, one entry should be ${correct}. Correcting it changes the average from ${reported} to ${corrected}. Find the old entry.`,
      `The average of {count} ${c.subject} changes from ${reported} to ${corrected} when one entry is corrected to ${correct}. Find the value used before correction.`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `Correcting one entry changed the average ${c.measure} of {count} ${c.subject} from ${reported} to ${corrected}. By how much do the wrong and correct entries differ?`,
      `The average of {count} ${c.subject} changed by ${change} after one value was corrected. Find the difference between the wrong and correct entries.`,
      `A single correction changed the average from ${reported} to ${corrected} for {count} ${c.subject}. Find the difference between the two entries.`,
      `For {count} ${c.subject}, one correction changed the average from ${reported} to ${corrected}. By how much did the corrected value differ from the wrong value?`,
      `One wrong entry changed the average of {count} ${c.subject} by ${change}. Find the difference between the wrong and correct values.`,
      `The reported and corrected averages for {count} ${c.subject} are ${reported} and ${corrected}. Find the error in the single entry.`,
    ],
    findAverageChangeFromEntryCorrection: [
      `Among {count} ${c.subject}, one value was ${wrong} instead of ${correct}. By how much does the average change after correction?`,
      `A value of ${wrong} is replaced by ${correct} in a set of {count} ${c.subject}. Find the change in the average.`,
      `Correcting one entry changes the total by ${difference} for {count} ${c.subject}. How much does the average change?`,
      `For {count} ${c.subject}, ${wrong} is corrected to ${correct}. Find the resulting change in the average.`,
      `One entry among {count} ${c.subject} changes from ${wrong} to ${correct}. Find the change in the average.`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `One entry was ${wrong} instead of ${correct}, changing the average by ${change}. How many ${c.subject} were included?`,
      `Correcting ${wrong} to ${correct} changed the average ${c.measure} by ${change}. Find the number of ${c.subject}.`,
      `The correction changes the total by ${difference} and the average by ${change}. How many ${c.subject} are in the group?`,
      `A value changes from ${wrong} to ${correct}, shifting the average by ${change}. Find the number of ${c.subject}.`,
      `The wrong and correct entries differ by ${difference}. If the average changes by ${change}, find the number of ${c.subject}.`,
      `Replacing ${wrong} with ${correct} changes the average by ${change}. How many records were included?`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `For {count} ${c.subject}, the reported average is ${reported}. Entries ${wrong} and ${wrong2} should be ${correct} and ${correct2}. Find the correct average.`,
      `Among {count} ${c.subject}, ${wrong} and ${wrong2} were used instead of ${correct} and ${correct2}. The reported average is ${reported}. Find the correct average.`,
      `The average of {count} ${c.subject} was reported as ${reported}. Correct ${wrong} to ${correct} and ${wrong2} to ${correct2}. Find the revised average.`,
      `A list of {count} ${c.subject} has a reported average of ${reported}. Two entries change from ${wrong} and ${wrong2} to ${correct} and ${correct2}. Find the correct average.`,
      `For {count} ${c.subject}, the reported average is ${reported}. After correcting ${wrong} to ${correct} and ${wrong2} to ${correct2}, find the new average.`,
    ],
  };
  return patterns[mode]![variant]!;'''

replace_once(
    ROOT / 'foundation/cp005-library.ts',
    r'  const patterns: Record<string, string\[]> = \{.*?\n  \};\n  return patterns\[mode\]!\[variant\]!;',
    cp005_block,
)


gap_block = r'''const memberScenarios = [
  { lead: "A class", member: "student", plural: "students", verb: "scoring", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A cricket squad", member: "player", plural: "players", verb: "scoring", domain: "Sports", unit: "runs", unitKind: "runs" },
  { lead: "A work team", member: "worker", plural: "workers", verb: "producing", domain: "Workforce", unit: "units", unitKind: "units" },
  { lead: "A production unit", member: "machine", plural: "machines", verb: "producing", domain: "Production", unit: "units", unitKind: "units" },
  { lead: "A training batch", member: "trainee", plural: "trainees", verb: "scoring", domain: "Education", unit: "marks", unitKind: "marks" },
  { lead: "A batting group", member: "batter", plural: "batters", verb: "scoring", domain: "Sports", unit: "runs", unitKind: "runs" },
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
  "An arithmetic progression", "An equally spaced score series", "A set of equally spaced readings",
  "An equally spaced number series", "A sequence of consecutive values", "A set of equally spaced values",
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

function variables'''

replace_once(
    ROOT / 'foundation/gap-expansion-library.ts',
    r'const memberScenarios = \[.*?\nfunction variables',
    gap_block,
)


cp006_stem_polish = r'''import type { Avg001QuestionLanguageEntry } from "./types";

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

function context(entry: Avg001QuestionLanguageEntry) {
  const value = entry.scenarioVariant;
  if (/schoolSections/i.test(value)) return { lower: "sections", singular: "section", upper: "school", members: "students", measure: "marks", prefix: "", suffix: " marks" };
  if (/companyDepartments/i.test(value)) return { lower: "departments", singular: "department", upper: "company", members: "employees", measure: "monthly salary", prefix: "₹", suffix: "" };
  if (/regionalBranches/i.test(value)) return { lower: "branches", singular: "branch", upper: "region", members: "employees", measure: "sales", prefix: "₹", suffix: "" };
  if (/factoryUnits/i.test(value)) return { lower: "units", singular: "unit", upper: "factory", members: "workers", measure: "output", prefix: "", suffix: " units" };
  if (/tournamentTeams/i.test(value)) return { lower: "teams", singular: "team", upper: "tournament", members: "players", measure: "runs", prefix: "", suffix: " runs" };
  return { lower: "groups", singular: "group", upper: "village", members: "people", measure: "age", prefix: "", suffix: " years" };
}

export function applyAvg001Cp006StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-006") return entry;
  const c = context(entry);
  const index = Number(entry.qlId.split("-").at(-1)) - 330;
  const variant = index % 4;
  const v = (name: string) => `${c.prefix}{${name}}${c.suffix}`;
  const templates: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [
      `Three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, with average ${c.measure} of ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}, respectively. Find the combined average ${c.measure}.`,
      `The first, second and third ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their average ${c.measure} values are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the overall average.`,
      `In a ${c.upper}, three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their respective averages are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the combined average.`,
      `A ${c.upper} has three ${c.lower}. Their sizes are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}, and their average ${c.measure} values are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the overall average.`,
    ],
    findSuperGroupAverageFromSubgroups: [
      `Three ${c.lower} form one ${c.upper}. They contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, with averages ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the combined average.`,
      `A ${c.upper} is formed by three ${c.lower} of {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their averages are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the overall average.`,
      `The three ${c.lower} have averages ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}, and sizes {subgroupCount1}, {subgroupCount2} and {subgroupCount3}. Find their combined average.`,
      `Three ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their average ${c.measure} values are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the ${c.upper}'s overall average.`,
    ],
    findMissingSectionAverage: [
      `Three ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. The first two averages are ${v("subgroupAverage1")} and ${v("subgroupAverage2")}, while the overall average is ${v("overallAverage")}. Find the average of the third ${c.singular}.`,
      `The combined average ${c.measure} of three ${c.lower} is ${v("overallAverage")}. Their sizes are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}, and the first two averages are ${v("subgroupAverage1")} and ${v("subgroupAverage2")}. Find the third average.`,
      `In a ${c.upper}, three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their overall average is ${v("overallAverage")}; the first two averages are ${v("subgroupAverage1")} and ${v("subgroupAverage2")}. Find the average of the remaining ${c.singular}.`,
      `The sizes of three ${c.lower} are {subgroupCount1}, {subgroupCount2} and {subgroupCount3}. Their combined average is ${v("overallAverage")}, and two averages are ${v("subgroupAverage1")} and ${v("subgroupAverage2")}. Find the missing average.`,
    ],
    findSectionCountFromOverallAverage: [
      `One ${c.singular} has {subgroupCount1} ${c.members} with an average of ${v("subgroupAverage1")}. Another ${c.singular} averages ${v("subgroupAverage3")}. If their combined average is ${v("overallAverage")}, find the number of ${c.members} in the second ${c.singular}.`,
      `A group of {subgroupCount1} ${c.members} averages ${v("subgroupAverage1")}. A second group averages ${v("subgroupAverage3")}, and together they average ${v("overallAverage")}. Find the size of the second group.`,
      `The first ${c.singular} has {subgroupCount1} ${c.members} and an average of ${v("subgroupAverage1")}. The second averages ${v("subgroupAverage3")}. Their combined average is ${v("overallAverage")}. Find the size of the second ${c.singular}.`,
      `Two groups average ${v("subgroupAverage1")} and ${v("subgroupAverage3")}. The first contains {subgroupCount1} ${c.members}, and the combined average is ${v("overallAverage")}. How many ${c.members} are in the second group?`,
    ],
    findMissingSubgroupCount: [
      `Three ${c.lower} have averages ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. The first two contain {subgroupCount1} and {subgroupCount2} ${c.members}, and the overall average is ${v("overallAverage")}. Find the size of the third ${c.singular}.`,
      `The combined average of three ${c.lower} is ${v("overallAverage")}. The first two contain {subgroupCount1} and {subgroupCount2} ${c.members}; their three averages are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the missing count.`,
      `Three groups average ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. The first two groups have {subgroupCount1} and {subgroupCount2} members, and the combined average is ${v("overallAverage")}. Find the number of members in the third group.`,
      `A ${c.upper} combines three ${c.lower}. The first two sizes are {subgroupCount1} and {subgroupCount2}, the averages are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}, and the overall average is ${v("overallAverage")}. Find the size of the remaining ${c.singular}.`,
    ],
    findSubgroupTotalFromAverageAndCount: [
      `A ${c.singular} has {subgroupCount1} ${c.members} with an average ${c.measure} of ${v("subgroupAverage1")}. Find the total ${c.measure}.`,
      `The average ${c.measure} of {subgroupCount1} ${c.members} is ${v("subgroupAverage1")}. Find their total ${c.measure}.`,
      `One ${c.singular} contains {subgroupCount1} ${c.members} and has an average of ${v("subgroupAverage1")}. Find the corresponding total.`,
      `For {subgroupCount1} ${c.members}, the average ${c.measure} is ${v("subgroupAverage1")}. Find the group total.`,
    ],
    findOverallTotalFromHierarchy: [
      `Three ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, with averages ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the total ${c.measure} for the ${c.upper}.`,
      `The first, second and third ${c.lower} contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}. Their averages are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the combined total.`,
      `A ${c.upper} has three ${c.lower} with sizes {subgroupCount1}, {subgroupCount2} and {subgroupCount3}. Their average ${c.measure} values are ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find the overall total.`,
      `Three ${c.lower} have {subgroupCount1}, {subgroupCount2} and {subgroupCount3} ${c.members}, averaging ${v("subgroupAverage1")}, ${v("subgroupAverage2")} and ${v("subgroupAverage3")}. Find their combined total ${c.measure}.`,
    ],
    findMissingLowerLevelAverage: [
      `A total of {parentCount} ${c.members} have an average ${c.measure} of ${v("parentAverage")}. Of these, {subgroupCount1} average ${v("subgroupAverage1")} and {subgroupCount2} average ${v("subgroupAverage2")}. Find the average of the remaining {subgroupCount3} ${c.members}.`,
      `The overall group contains {parentCount} ${c.members} and averages ${v("parentAverage")}. Two subgroups of {subgroupCount1} and {subgroupCount2} average ${v("subgroupAverage1")} and ${v("subgroupAverage2")}. Find the average of the remaining {subgroupCount3}.`,
      `{parentCount} ${c.members} have an average of ${v("parentAverage")}. Among them, {subgroupCount1} average ${v("subgroupAverage1")} and {subgroupCount2} average ${v("subgroupAverage2")}. Find the average of the remaining {subgroupCount3} ${c.members}.`,
      `The combined average of {parentCount} ${c.members} is ${v("parentAverage")}. Two groups contain {subgroupCount1} and {subgroupCount2} ${c.members}, with averages ${v("subgroupAverage1")} and ${v("subgroupAverage2")}. Find the average of the remaining {subgroupCount3} ${c.members}.`,
    ],
  };
  const template = templates[entry.solveMode]![variant]!;
  return { ...entry, template, requiredVariables: placeholders(template) };
}
'''
(ROOT / 'foundation/cp006-stem-polish.ts').write_text(cp006_stem_polish, encoding='utf-8')


cp006_overrides = r'''import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-349": "Three groups have average values of {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3}. The first two groups contain {subgroupCount1} and {subgroupCount2} members, and the combined average is {overallAverage}. Find the number of members in the third group.",
  "AVG-QL-357": "Three branches have average values of {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3}. The first two branches contain {subgroupCount1} and {subgroupCount2} members, and the regional average is {overallAverage}. Find the number of members in the third branch.",
  "AVG-QL-370": "A total of {parentCount} players average {parentAverage} runs. Of these, {subgroupCount1} players average {subgroupAverage1} runs and {subgroupCount2} players average {subgroupAverage2} runs. Find the average of the remaining {subgroupCount3} players.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp006FinalStemOverride(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
'''
(ROOT / 'foundation/cp006-final-stem-overrides.ts').write_text(cp006_overrides, encoding='utf-8')


replace_once(
    ROOT / 'foundation/cp006-exact-runtime.ts',
    r'function finalLine\(mode: string, answer: string\) \{.*?\n\}',
    r'''function finalLine(mode: string, answer: string) {
  switch (mode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return `So the combined average is ${answer}.`;
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": return `So the missing average is ${answer}.`;
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": return `So the required count is ${answer}.`;
    case "findSubgroupTotalFromAverageAndCount": return `So the group total is ${answer}.`;
    case "findOverallTotalFromHierarchy": return `So the combined total is ${answer}.`;
    default: return `So the answer is ${answer}.`;
  }
}''',
)


audit = r'''import { strict as assert } from "node:assert";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const banned: Array<[RegExp, string]> = [
  [/\bbranche\b/i, "misspelling of branch"],
  [/\bwas averaged to\b/i, "unnatural passive average wording"],
  [/\bfind the accurate average\b/i, "unnatural accurate-average wording"],
  [/\bhas reported average\b/i, "missing article before reported average"],
  [/\brecover the average\b/i, "technical recover wording"],
  [/\bwhat average appeared\b/i, "unnatural appeared wording"],
  [/\bwhat belonged there\b/i, "informal placeholder wording"],
  [/\bproduced average\b/i, "missing article before average"],
  [/\bmoved the average\b/i, "unnatural moved-average wording"],
  [/\bwhat had that record shown\b/i, "unnatural record wording"],
  [/\bwhat total does this represent\b/i, "abstract total wording"],
  [/\bparent average\b/i, "internal hierarchy terminology"],
  [/\blower groups\b/i, "internal hierarchy terminology"],
  [/\bfind the final average\b/i, "vague final-average wording"],
  [/\bfind the last(?:\s|\.)/i, "vague last-item wording"],
  [/\(\s*\d[^)]*,\s*\d[^)]*\)/, "tuple notation in a question stem"],
  [/\b1 hours\b/i, "singular/plural mismatch"],
  [/\bnew member with value\b/i, "generic member-value wording"],
  [/\baverage scores? of \{?group/i, "generic score wording for mixed contexts"],
];

const failures: string[] = [];
let checked = 0;
for (const qlId of getAvg001QuestionLanguageIds()) {
  const question = runAvg001Pipeline({ questionLanguageId: qlId, seed: `natural-language:${qlId}` });
  for (const [pattern, reason] of banned) {
    if (pattern.test(question.stem)) failures.push(`${qlId}: ${reason}: ${question.stem}`);
  }
  if (question.stem.split(/\s+/).length > 55) failures.push(`${qlId}: stem exceeds 55 words`);
  if (question.canonicalProblemId === "AVG-CP-006" && question.answer !== undefined) {
    const ending = question.explanation.at(-1) ?? "";
    if (question.answerType !== "COUNT" && /missing count/i.test(ending)) failures.push(`${qlId}: explanation labels a non-count answer as a count`);
  }
  checked += 1;
}

assert.equal(checked, 425);
assert.equal(failures.length, 0, failures.join("\n"));
console.log(JSON.stringify({ checked, failures, status: "PASS" }, null, 2));
'''
(ROOT / 'avg-001-natural-exam-language-audit.ts').write_text(audit, encoding='utf-8')

workflow = Path('.github/workflows/avg-001-runtime-proof.yml')
text = workflow.read_text(encoding='utf-8')
needle = '          run_case avg-001-editorial-stems src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-editorial-stem-audit.ts\n'
addition = needle + '          run_case avg-001-natural-exam-language src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-natural-exam-language-audit.ts\n'
if 'run_case avg-001-natural-exam-language ' not in text:
    if needle not in text:
        raise SystemExit('Could not find AVG workflow insertion point')
    workflow.write_text(text.replace(needle, addition, 1), encoding='utf-8')

print('Applied AVG-001 natural exam-language editorial pass.')
