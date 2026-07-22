import type { Avg001Difficulty, Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

type UnitKind = "marks" | "currency" | "years" | "units" | "runs" | "kg" | "none";
type Context = { variant: string; domain: string; subject: string; measure: string; unitKind: UnitKind; finalContext: string };

const contexts: Context[] = [
  { variant: "examMarksCorrection", domain: "Classroom", subject: "students", measure: "marks", unitKind: "marks", finalContext: "correct average marks" },
  { variant: "salaryRegisterCorrection", domain: "Workplace", subject: "employees", measure: "monthly salary", unitKind: "currency", finalContext: "correct average monthly salary" },
  { variant: "ageRegisterCorrection", domain: "Community", subject: "people", measure: "age", unitKind: "years", finalContext: "correct average age" },
  { variant: "factoryOutputCorrection", domain: "Factory", subject: "machines", measure: "daily output", unitKind: "units", finalContext: "correct average output" },
  { variant: "shopSalesCorrection", domain: "Commerce", subject: "shops", measure: "daily sales", unitKind: "currency", finalContext: "correct average daily sales" },
  { variant: "inningsRunsCorrection", domain: "Sports", subject: "innings", measure: "runs", unitKind: "runs", finalContext: "correct batting average" },
  { variant: "parcelWeightCorrection", domain: "Logistics", subject: "parcels", measure: "weight", unitKind: "kg", finalContext: "correct average weight" },
  { variant: "recordCountCorrection", domain: "Administration", subject: "records", measure: "value", unitKind: "none", finalContext: "correct average" },
];

const modes: Array<{ mode: Avg001SolveMode; count: number; answerType: Avg001QuestionLanguageEntry["answerType"]; strategies: string[] }> = [
  { mode: "findCorrectedAverageFromMistake", count: 10, answerType: "AVERAGE", strategies: ["correct-total-then-divide", "per-record-delta", "reported-total-rebuild"] },
  { mode: "findReportedAverageBeforeCorrection", count: 6, answerType: "AVERAGE", strategies: ["reverse-average-shift", "restore-wrong-total", "correction-equation"] },
  { mode: "findCorrectValueFromAverageShift", count: 9, answerType: "MEMBER_VALUE", strategies: ["recover-correct-entry", "total-gap-equation", "average-change-scale-up"] },
  { mode: "findIncorrectValueFromCorrection", count: 9, answerType: "MEMBER_VALUE", strategies: ["recover-wrong-entry", "reverse-total-gap", "average-shift-backtrack"] },
  { mode: "findEntryDifferenceFromAverageCorrection", count: 6, answerType: "DIFFERENCE", strategies: ["scale-average-change", "compare-wrong-correct-totals", "delta-equation"] },
  { mode: "findAverageChangeFromEntryCorrection", count: 5, answerType: "DIFFERENCE", strategies: ["spread-entry-difference", "per-record-correction", "total-change-divide"] },
  { mode: "findNumberOfItemsFromTotalCorrection", count: 6, answerType: "COUNT", strategies: ["count-from-delta-ratio", "total-gap-over-average-gap", "correction-equation-count"] },
  { mode: "findCorrectedAverageFromMultipleMistakes", count: 5, answerType: "AVERAGE", strategies: ["net-two-entry-correction", "rebuild-two-entry-total", "combine-deltas-then-divide"] },
];

const difficulty: Avg001Difficulty[] = [
  ...Array(17).fill("Easy"),
  ...Array(20).fill("Medium"),
  ...Array(19).fill("Hard"),
] as Avg001Difficulty[];

function value(kind: UnitKind, token: string) {
  if (kind === "currency") return `₹${token}`;
  if (kind === "kg") return `${token} kg`;
  if (kind === "years") return `${token} years`;
  if (kind === "units") return `${token} units`;
  if (kind === "marks") return `${token} marks`;
  if (kind === "runs") return `${token} runs`;
  return token;
}

function template(mode: Avg001SolveMode, c: Context, variant: number) {
  const wrong = value(c.unitKind, "{incorrectValue}");
  const correct = value(c.unitKind, "{correctValue}");
  const reported = value(c.unitKind, "{reportedAverage}");
  const corrected = value(c.unitKind, "{correctedAverage}");
  const difference = value(c.unitKind, "{entryDifference}");
  const change = value(c.unitKind, "{averageChange}");
  const wrong2 = value(c.unitKind, "{incorrectValue2}");
  const correct2 = value(c.unitKind, "{correctValue2}");
  const patterns: Record<string, string[]> = {
    findCorrectedAverageFromMistake: [
      `The average ${c.measure} of {count} ${c.subject} was reported as ${reported}. One entry was ${wrong} instead of ${correct}. Find the correct average.`,
      `While averaging {count} ${c.subject}, ${wrong} was used in place of ${correct}. The result was ${reported}. What is the actual average?`,
      `An average of ${reported} was obtained for {count} ${c.subject}. Later, ${wrong} was corrected to ${correct}. Find the new average.`,
      `The stated average for {count} ${c.subject} is ${reported}. Replace the wrong entry ${wrong} with ${correct} and find the revised average.`,
      `A register shows an average ${c.measure} of ${reported} for {count} ${c.subject}. One recorded value ${wrong} should be ${correct}. Find the true average.`,
      `For {count} ${c.subject}, the calculated average was ${reported}. After changing ${wrong} to ${correct}, what does the average become?`,
      `The total for {count} ${c.subject} was averaged to ${reported}. It included ${wrong} where ${correct} was required. Find the corrected mean.`,
      `An error check found that ${wrong}, used in an average of ${reported} for {count} ${c.subject}, should be ${correct}. Find the accurate average.`,
      `The reported mean ${c.measure} of {count} ${c.subject} is ${reported}. Correct a single value from ${wrong} to ${correct}. What is the revised mean?`,
      `A list of {count} ${c.subject} has reported average ${reported}. Correcting ${wrong} to ${correct} changes the total. Find the final average.`,
    ],
    findReportedAverageBeforeCorrection: [
      `After replacing ${wrong} by ${correct}, the average ${c.measure} of {count} ${c.subject} became ${corrected}. What average was reported earlier?`,
      `The correct average for {count} ${c.subject} is ${corrected}. The earlier calculation used ${wrong} instead of ${correct}. Find that earlier average.`,
      `A mistaken entry ${wrong} was corrected to ${correct}, giving an average of ${corrected} for {count} ${c.subject}. Find the wrong average.`,
      `For {count} ${c.subject}, correcting ${wrong} to ${correct} produced the true average ${corrected}. What was the original reported average?`,
      `The final average ${c.measure} is ${corrected} for {count} ${c.subject}. Before ${wrong} was changed to ${correct}, what average appeared?`,
      `A correction from ${wrong} to ${correct} made the average of {count} ${c.subject} equal ${corrected}. Recover the average before correction.`,
    ],
    findCorrectValueFromAverageShift: [
      `The average ${c.measure} of {count} ${c.subject} was ${reported} because one value was entered as ${wrong}. After correction it became ${corrected}. Find the correct value.`,
      `For {count} ${c.subject}, an entry of ${wrong} gave average ${reported}. The corrected average is ${corrected}. What should the entry be?`,
      `An entry was recorded as ${wrong}. Fixing it changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the corrected entry.`,
      `The average for {count} ${c.subject} rises from ${reported} to ${corrected} when the recorded value ${wrong} is fixed. Find its true value.`,
      `A list of {count} ${c.subject} has average ${reported} with one value shown as ${wrong}. The actual average is ${corrected}. Find the replacement value.`,
      `Using ${wrong} for one record produced average ${reported} for {count} ${c.subject}. The right average is ${corrected}. Determine the correct record.`,
      `One wrong value ${wrong} caused the average of {count} ${c.subject} to be ${reported} instead of ${corrected}. What is the correct value?`,
      `For {count} ${c.subject}, the reported and true averages are ${reported} and ${corrected}. If ${wrong} was entered, find what belonged there.`,
      `The mean changes from ${reported} to ${corrected} after correcting one ${wrong} entry among {count} ${c.subject}. Find the new entry.`,
    ],
    findIncorrectValueFromCorrection: [
      `The average ${c.measure} of {count} ${c.subject} changed from ${reported} to ${corrected} after one entry was corrected to ${correct}. What value was entered wrongly?`,
      `For {count} ${c.subject}, the correct value is ${correct}. The average changed from ${reported} to ${corrected} after fixing it. Find the incorrect entry.`,
      `One value should have been ${correct}. Its correction changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the earlier value.`,
      `The mean for {count} ${c.subject} was ${reported} and became ${corrected} after a record was set to ${correct}. What had that record shown?`,
      `Correcting one entry to ${correct} moved the average of {count} ${c.subject} from ${reported} to ${corrected}. Recover the mistaken entry.`,
      `For {count} ${c.subject}, the true average is ${corrected} rather than ${reported}. One value is actually ${correct}. Find its wrong recorded value.`,
      `A correction to ${correct} changes the average from ${reported} to ${corrected} across {count} ${c.subject}. What value was replaced?`,
      `Among {count} ${c.subject}, one record should read ${correct}. Correcting it changes the mean ${reported} to ${corrected}. Find the old record.`,
      `The average of {count} ${c.subject} improves from ${reported} to ${corrected} when one entry becomes ${correct}. Find the value used before.`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `Correcting one entry changed the average ${c.measure} of {count} ${c.subject} from ${reported} to ${corrected}. By how much did the entries differ?`,
      `The average for {count} ${c.subject} changed by ${change} after one value was corrected. Find the difference between the wrong and correct entries.`,
      `A single correction changed the average from ${reported} to ${corrected} for {count} ${c.subject}. Find the size of the entry error.`,
      `For {count} ${c.subject}, the mean moved from ${reported} to ${corrected} after one correction. What was the total difference in that value?`,
      `One wrong record altered the average of {count} ${c.subject} by ${change}. Find how far the record was from its correct value.`,
      `The corrected and reported averages for {count} ${c.subject} are ${corrected} and ${reported}. Find the error in the single entry.`,
    ],
    findAverageChangeFromEntryCorrection: [
      `Among {count} ${c.subject}, one value was ${wrong} instead of ${correct}. By how much will the average change after correction?`,
      `A record of ${wrong} is replaced by ${correct} in a set of {count} ${c.subject}. Find the change in the average.`,
      `The total changes by ${difference} when one entry is corrected for {count} ${c.subject}. How much does the average change?`,
      `For {count} ${c.subject}, correcting ${wrong} to ${correct} alters the total. Find the resulting change in the mean.`,
      `One entry among {count} ${c.subject} changes from ${wrong} to ${correct}. Calculate the amount of change in the average.`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `One entry was ${wrong} instead of ${correct}. This changed the average by ${change}. How many ${c.subject} were included?`,
      `Correcting a value from ${wrong} to ${correct} changed the average ${c.measure} by ${change}. Find the number of ${c.subject}.`,
      `The total correction is ${difference}, and the average changes by ${change}. Find how many ${c.subject} are in the set.`,
      `A value changes from ${wrong} to ${correct}, shifting the average by ${change}. Determine the count of ${c.subject}.`,
      `The difference between one wrong and correct entry is ${difference}. If the average changes by ${change}, find the number of ${c.subject}.`,
      `Replacing ${wrong} with ${correct} changes the mean by ${change}. How many records were averaged?`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `For {count} ${c.subject}, the reported average is ${reported}. Entries ${wrong} and ${wrong2} should be ${correct} and ${correct2}. Find the correct average.`,
      `Among {count} ${c.subject}, ${wrong} and ${wrong2} were used instead of ${correct} and ${correct2}. The average shown is ${reported}. Find the actual average.`,
      `The average of {count} ${c.subject} was ${reported}. Correct ${wrong} to ${correct} and ${wrong2} to ${correct2}. Find the revised average.`,
      `A list of {count} ${c.subject} averages ${reported}. Two records change from ${wrong}, ${wrong2} to ${correct}, ${correct2}. Find the true mean.`,
      `The stated mean for {count} ${c.subject} is ${reported}. After two corrections—${wrong} to ${correct} and ${wrong2} to ${correct2}—find the new mean.`,
    ],
  };
  return patterns[mode]![variant]!;
}

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

const entries: Avg001QuestionLanguageEntry[] = [];
let id = 274;
let globalIndex = 0;
for (const family of modes) {
  for (let index = 0; index < family.count; index += 1) {
    const context = contexts[(globalIndex * 3 + index) % contexts.length]!;
    const unitKind = context.unitKind;
    const questionTemplate = template(family.mode, context, index);
    entries.push({
      cpId: "AVG-CP-005",
      qlId: `AVG-QL-${String(id).padStart(3, "0")}`,
      taskKind: "errorDetectionDeltaCorrectionApplication",
      solveMode: family.mode,
      difficulty: difficulty[globalIndex]!,
      answerType: family.answerType,
      contextDomain: context.domain,
      scenarioVariant: `${context.variant}_${family.mode}_${index + 1}`,
      template: questionTemplate,
      requiredVariables: placeholders(questionTemplate),
      explanationStrategyId: family.strategies[index % family.strategies.length]!,
      distractorStrategyIds: ["ignoreCorrection", "reverseCorrection", "offByOneCorrection"],
      displayPolicy: unitKind === "currency" ? "EXACT_INTEGER" : index % 5 === 4 ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
      active: true,
      finalContext: context.finalContext,
      unitKind,
    });
    id += 1;
    globalIndex += 1;
  }
}

export const cp005Entries = entries;