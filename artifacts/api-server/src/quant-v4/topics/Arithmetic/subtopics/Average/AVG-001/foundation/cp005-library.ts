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
      `The average ${c.measure} of {count} ${c.subject} was reported as ${reported}. One entry was taken as ${wrong} instead of ${correct}. Find the correct average.`,
      `While finding the average ${c.measure} of {count} ${c.subject}, ${wrong} was entered in place of ${correct}. The reported average was ${reported}. What is the actual average?`,
      `An average of ${reported} was obtained for {count} ${c.subject}. Later, an entry of ${wrong} was found to be ${correct}. Find the corrected average.`,
    ],
    findReportedAverageBeforeCorrection: [
      `After replacing ${wrong} by ${correct}, the average ${c.measure} of {count} ${c.subject} became ${corrected}. What average had been reported earlier?`,
      `The correct average for {count} ${c.subject} is ${corrected}. The earlier calculation used ${wrong} instead of ${correct}. Find the earlier average.`,
      `A mistaken entry ${wrong} was corrected to ${correct}, giving an average of ${corrected} for {count} ${c.subject}. Find the wrong average.`,
    ],
    findCorrectValueFromAverageShift: [
      `The average ${c.measure} of {count} ${c.subject} was ${reported} because one value was entered as ${wrong}. After correction, the average became ${corrected}. Find the correct value.`,
      `For {count} ${c.subject}, changing an entry of ${wrong} made the average rise from ${reported} to ${corrected}. What should that entry have been?`,
      `An entry was recorded as ${wrong}. Correcting it changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the corrected entry.`,
    ],
    findIncorrectValueFromCorrection: [
      `The average ${c.measure} of {count} ${c.subject} changed from ${reported} to ${corrected} after one entry was corrected to ${correct}. What value had been entered wrongly?`,
      `For {count} ${c.subject}, the correct value is ${correct}. The average changed from ${reported} to ${corrected} after fixing the record. Find the incorrect entry.`,
      `One value should have been ${correct}. Its correction changed the average of {count} ${c.subject} from ${reported} to ${corrected}. Find the value used earlier.`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `Correcting one entry changed the average ${c.measure} of {count} ${c.subject} from ${reported} to ${corrected}. By how much did the wrong entry differ from the correct one?`,
      `The average for {count} ${c.subject} changed by ${change} after one value was corrected. Find the difference between the wrong and correct entries.`,
      `A single correction changed the average from ${reported} to ${corrected} for {count} ${c.subject}. Find the size of the error in that entry.`,
    ],
    findAverageChangeFromEntryCorrection: [
      `Among {count} ${c.subject}, one value was entered as ${wrong} instead of ${correct}. By how much will the average change after correction?`,
      `A record of ${wrong} is replaced by ${correct} in a set of {count} ${c.subject}. Find the change in the average.`,
      `The total increases by ${difference} when one entry is corrected for {count} ${c.subject}. How much does the average increase?`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `One entry was recorded as ${wrong} instead of ${correct}. This changed the average by ${change}. How many ${c.subject} were included?`,
      `Correcting a value from ${wrong} to ${correct} changed the average ${c.measure} by ${change}. Find the number of ${c.subject}.`,
      `The total correction is ${difference}, and the average changes by ${change}. Find how many ${c.subject} are in the set.`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `The average ${c.measure} of {count} ${c.subject} was reported as ${reported}. Two entries, ${wrong} and ${wrong2}, should have been ${correct} and ${correct2}. Find the correct average.`,
      `For {count} ${c.subject}, ${wrong} was entered instead of ${correct}, and ${wrong2} instead of ${correct2}. The reported average was ${reported}. Find the actual average.`,
      `An average of ${reported} was calculated for {count} ${c.subject}. Later, two wrong entries ${wrong} and ${wrong2} were corrected to ${correct} and ${correct2}. Find the corrected average.`,
    ],
  };
  return patterns[mode]![variant % 3]!;
}

function required(mode: Avg001SolveMode) {
  const map: Record<string, string[]> = {
    findCorrectedAverageFromMistake: ["count", "reportedAverage", "incorrectValue", "correctValue"],
    findReportedAverageBeforeCorrection: ["count", "correctedAverage", "incorrectValue", "correctValue"],
    findCorrectValueFromAverageShift: ["count", "reportedAverage", "correctedAverage", "incorrectValue"],
    findIncorrectValueFromCorrection: ["count", "reportedAverage", "correctedAverage", "correctValue"],
    findEntryDifferenceFromAverageCorrection: ["count", "reportedAverage", "correctedAverage"],
    findAverageChangeFromEntryCorrection: ["count", "incorrectValue", "correctValue"],
    findNumberOfItemsFromTotalCorrection: ["incorrectValue", "correctValue", "averageChange"],
    findCorrectedAverageFromMultipleMistakes: ["count", "reportedAverage", "incorrectValue", "correctValue", "incorrectValue2", "correctValue2"],
  };
  return map[mode]!;
}

const entries: Avg001QuestionLanguageEntry[] = [];
let id = 274;
let globalIndex = 0;
for (const family of modes) {
  for (let index = 0; index < family.count; index += 1) {
    const context = contexts[(globalIndex * 3 + index) % contexts.length]!;
    const unitKind = context.unitKind;
    entries.push({
      cpId: "AVG-CP-005",
      qlId: `AVG-QL-${String(id).padStart(3, "0")}`,
      taskKind: "errorDetectionDeltaCorrectionApplication",
      solveMode: family.mode,
      difficulty: difficulty[globalIndex]!,
      answerType: family.answerType,
      contextDomain: context.domain,
      scenarioVariant: `${context.variant}_${family.mode}_${index + 1}`,
      template: template(family.mode, context, index),
      requiredVariables: required(family.mode),
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
