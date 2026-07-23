import type { Avg001QuestionLanguageEntry } from "./types";

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

function context(entry: Avg001QuestionLanguageEntry) {
  const value = entry.scenarioVariant;
  if (/examMarksCorrection/i.test(value)) return { subject: "students", label: "average score" };
  if (/salaryRegisterCorrection/i.test(value)) return { subject: "employees", label: "average monthly salary" };
  if (/ageRegisterCorrection/i.test(value)) return { subject: "people", label: "average age" };
  if (/factoryOutputCorrection/i.test(value)) return { subject: "machines", label: "average output" };
  if (/shopSalesCorrection/i.test(value)) return { subject: "shops", label: "average daily sales" };
  if (/inningsRunsCorrection/i.test(value)) return { subject: "innings", label: "batting average" };
  if (/parcelWeightCorrection/i.test(value)) return { subject: "parcels", label: "average weight" };
  return { subject: "records", label: "average" };
}

function shown(entry: Avg001QuestionLanguageEntry, token: string) {
  if (entry.unitKind === "currency") return `₹${token}`;
  if (entry.unitKind === "kg") return `${token} kg`;
  if (entry.unitKind === "years") return `${token} years`;
  if (entry.unitKind === "units") return `${token} units`;
  if (entry.unitKind === "marks") return `${token} marks`;
  if (entry.unitKind === "runs") return `${token} runs`;
  return token;
}

const starts: Record<string, number> = {
  findCorrectedAverageFromMistake: 274,
  findReportedAverageBeforeCorrection: 284,
  findCorrectValueFromAverageShift: 290,
  findIncorrectValueFromCorrection: 299,
  findEntryDifferenceFromAverageCorrection: 308,
  findAverageChangeFromEntryCorrection: 314,
  findNumberOfItemsFromTotalCorrection: 319,
  findCorrectedAverageFromMultipleMistakes: 325,
};

export function applyAvg001Cp005StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-005") return entry;

  const c = context(entry);
  const count = "{count}";
  const wrong = shown(entry, "{incorrectValue}");
  const correct = shown(entry, "{correctValue}");
  const reported = shown(entry, "{reportedAverage}");
  const corrected = shown(entry, "{correctedAverage}");
  const difference = shown(entry, "{entryDifference}");
  const change = shown(entry, "{averageChange}");
  const wrong2 = shown(entry, "{incorrectValue2}");
  const correct2 = shown(entry, "{correctValue2}");

  const patterns: Record<string, string[]> = {
    findCorrectedAverageFromMistake: [
      `The ${c.label} for ${count} ${c.subject} was reported as ${reported}. One entry was ${wrong} instead of ${correct}. Find the correct average.`,
      `While finding the ${c.label} for ${count} ${c.subject}, ${wrong} was used instead of ${correct}. The reported average was ${reported}. Find the correct average.`,
      `For ${count} ${c.subject}, the reported ${c.label} was ${reported}. After ${wrong} is corrected to ${correct}, find the new average.`,
      `The ${c.label} of ${count} ${c.subject} was calculated as ${reported}. One value should be ${correct}, not ${wrong}. Find the revised average.`,
      `A register shows a ${c.label} of ${reported} for ${count} ${c.subject}. One entry of ${wrong} should be ${correct}. Find the correct average.`,
      `For ${count} ${c.subject}, the calculated average was ${reported}. If ${wrong} is replaced by ${correct}, what is the new average?`,
      `The ${c.label} for ${count} ${c.subject} was reported as ${reported}. One value was recorded as ${wrong} instead of ${correct}. Find the correct average.`,
      `An entry of ${wrong} was used for ${count} ${c.subject}; it should have been ${correct}. The reported average was ${reported}. Find the correct average.`,
      `The reported ${c.label} for ${count} ${c.subject} is ${reported}. One value changes from ${wrong} to ${correct}. Find the revised average.`,
      `A list of ${count} ${c.subject} has a reported average of ${reported}. Correct ${wrong} to ${correct} and find the actual average.`,
    ],
    findReportedAverageBeforeCorrection: [
      `After ${wrong} was corrected to ${correct}, the ${c.label} for ${count} ${c.subject} became ${corrected}. What average had been reported earlier?`,
      `The correct ${c.label} for ${count} ${c.subject} is ${corrected}. The earlier calculation used ${wrong} instead of ${correct}. Find the reported average.`,
      `A wrong entry of ${wrong} was corrected to ${correct}, giving an average of ${corrected} for ${count} ${c.subject}. Find the average before correction.`,
      `For ${count} ${c.subject}, replacing ${wrong} with ${correct} gives the correct average ${corrected}. What average was reported earlier?`,
      `The correct ${c.label} for ${count} ${c.subject} is ${corrected}. Before ${wrong} was changed to ${correct}, what was the reported average?`,
      `Changing ${wrong} to ${correct} makes the average of ${count} ${c.subject} equal to ${corrected}. Find the original reported average.`,
    ],
    findCorrectValueFromAverageShift: [
      `The ${c.label} of ${count} ${c.subject} was ${reported} because one value was entered as ${wrong}. After correction, it became ${corrected}. Find the correct value.`,
      `For ${count} ${c.subject}, an entry of ${wrong} gave an average of ${reported}. The correct average is ${corrected}. What should the entry be?`,
      `One value was recorded as ${wrong}. Correcting it changed the average of ${count} ${c.subject} from ${reported} to ${corrected}. Find the correct value.`,
      `The average of ${count} ${c.subject} changes from ${reported} to ${corrected} when ${wrong} is corrected. Find the actual value.`,
      `A list of ${count} ${c.subject} has a reported average of ${reported}, with one value entered as ${wrong}. The correct average is ${corrected}. Find the correct entry.`,
      `Using ${wrong} for one entry gives an average of ${reported} for ${count} ${c.subject}. The correct average is ${corrected}. Find the correct entry.`,
      `One wrong value of ${wrong} made the average of ${count} ${c.subject} equal to ${reported} instead of ${corrected}. What is the correct value?`,
      `For ${count} ${c.subject}, the reported and correct averages are ${reported} and ${corrected}. If ${wrong} was entered, find the correct value.`,
      `Correcting one entry of ${wrong} changes the average of ${count} ${c.subject} from ${reported} to ${corrected}. Find the corrected entry.`,
    ],
    findIncorrectValueFromCorrection: [
      `The ${c.label} of ${count} ${c.subject} changed from ${reported} to ${corrected} after one entry was corrected to ${correct}. What value had been entered wrongly?`,
      `For ${count} ${c.subject}, one entry was corrected to ${correct}, changing the average from ${reported} to ${corrected}. Find the wrong entry.`,
      `One value should have been ${correct}. Correcting it changed the average of ${count} ${c.subject} from ${reported} to ${corrected}. Find the value used earlier.`,
      `The average for ${count} ${c.subject} was ${reported} and became ${corrected} after one entry was corrected to ${correct}. What was the wrong entry?`,
      `Correcting one entry to ${correct} changed the average of ${count} ${c.subject} from ${reported} to ${corrected}. Find the incorrect value.`,
      `For ${count} ${c.subject}, the correct average is ${corrected} rather than ${reported}. One entry should be ${correct}. Find the value recorded wrongly.`,
      `Correcting one value to ${correct} changes the average of ${count} ${c.subject} from ${reported} to ${corrected}. What value was replaced?`,
      `Among ${count} ${c.subject}, one entry should be ${correct}. Correcting it changes the average from ${reported} to ${corrected}. Find the old entry.`,
      `The average of ${count} ${c.subject} changes from ${reported} to ${corrected} when one entry is corrected to ${correct}. Find the value used before correction.`,
    ],
    findEntryDifferenceFromAverageCorrection: [
      `Correcting one entry changed the ${c.label} of ${count} ${c.subject} from ${reported} to ${corrected}. By how much do the wrong and correct entries differ?`,
      `The average of ${count} ${c.subject} changed by ${change} after one value was corrected. Find the difference between the wrong and correct entries.`,
      `A single correction changed the average from ${reported} to ${corrected} for ${count} ${c.subject}. Find the difference between the two entries.`,
      `For ${count} ${c.subject}, one correction changed the average from ${reported} to ${corrected}. By how much did the corrected value differ from the wrong value?`,
      `One wrong entry changed the average of ${count} ${c.subject} by ${change}. Find the difference between the wrong and correct values.`,
      `The reported and corrected averages for ${count} ${c.subject} are ${reported} and ${corrected}. Find the error in the single entry.`,
    ],
    findAverageChangeFromEntryCorrection: [
      `Among ${count} ${c.subject}, one value was ${wrong} instead of ${correct}. By how much does the average change after correction?`,
      `A value of ${wrong} is replaced by ${correct} in a set of ${count} ${c.subject}. Find the change in the average.`,
      `Correcting one entry changes the total by ${difference} for ${count} ${c.subject}. How much does the average change?`,
      `For ${count} ${c.subject}, ${wrong} is corrected to ${correct}. Find the resulting change in the average.`,
      `One entry among ${count} ${c.subject} changes from ${wrong} to ${correct}. Find the change in the average.`,
    ],
    findNumberOfItemsFromTotalCorrection: [
      `One entry was ${wrong} instead of ${correct}, changing the average by ${change}. How many ${c.subject} were included?`,
      `Correcting ${wrong} to ${correct} changed the ${c.label} by ${change}. Find the number of ${c.subject}.`,
      `The correction changes the total by ${difference} and the average by ${change}. How many ${c.subject} are in the group?`,
      `A value changes from ${wrong} to ${correct}, shifting the average by ${change}. Find the number of ${c.subject}.`,
      `The wrong and correct entries differ by ${difference}. If the average changes by ${change}, find the number of ${c.subject}.`,
      `Replacing ${wrong} with ${correct} changes the average by ${change}. How many records were included?`,
    ],
    findCorrectedAverageFromMultipleMistakes: [
      `For ${count} ${c.subject}, the reported ${c.label} is {reportedAverage}. Entries {incorrectValue} and {incorrectValue2} should be {correctValue} and {correctValue2}. Find the correct average.`,
      `Among ${count} ${c.subject}, ${wrong} and ${wrong2} were used instead of ${correct} and ${correct2}. The reported average is ${reported}. Find the correct average.`,
      `The average of ${count} ${c.subject} was reported as ${reported}. Correct ${wrong} to ${correct} and ${wrong2} to ${correct2}. Find the revised average.`,
      `A list of ${count} ${c.subject} averages ${reported}. Correct ${wrong} to ${correct} and ${wrong2} to ${correct2}. Find the correct average.`,
      `For ${count} ${c.subject}, the reported average is ${reported}. After correcting ${wrong} to ${correct} and ${wrong2} to ${correct2}, find the new average.`,
    ],
  };

  const start = starts[entry.solveMode];
  if (start === undefined) return entry;
  const index = Number(entry.qlId.split("-").at(-1)) - start;
  const template = patterns[entry.solveMode]![index]!;
  return { ...entry, template, requiredVariables: placeholders(template) };
}
