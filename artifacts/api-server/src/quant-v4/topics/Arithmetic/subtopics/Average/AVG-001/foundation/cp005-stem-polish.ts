import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-278": "A register shows a reported average daily sale of ₹{reportedAverage} for {count} shops. One value of ₹{incorrectValue} should be ₹{correctValue}. Find the correct average.",
  "AVG-QL-280": "The average weight of {count} parcels was reported as {reportedAverage} kg. One parcel was recorded as {incorrectValue} kg instead of {correctValue} kg. Find the correct average weight.",
  "AVG-QL-281": "The average of {count} records was reported as {reportedAverage}. One value was entered as {incorrectValue} instead of {correctValue}. Find the correct average.",
  "AVG-QL-282": "The average marks of {count} students were reported as {reportedAverage}. One score was entered as {incorrectValue} marks instead of {correctValue} marks. Find the revised average.",
  "AVG-QL-283": "The average monthly salary of {count} employees was reported as ₹{reportedAverage}. One salary was entered as ₹{incorrectValue} instead of ₹{correctValue}. Find the correct average salary.",
  "AVG-QL-288": "The correct average weight of {count} parcels is {correctedAverage} kg. Before {incorrectValue} kg was corrected to {correctValue} kg, what average had been reported?",
  "AVG-QL-289": "Changing {incorrectValue} to {correctValue} makes the average of {count} records equal to {correctedAverage}. Find the average before the correction.",
  "AVG-QL-292": "One age was recorded as {incorrectValue} years. Correcting it changed the average age of {count} people from {reportedAverage} years to {correctedAverage} years. Find the correct age.",
  "AVG-QL-293": "The average output of {count} machines changes from {reportedAverage} units to {correctedAverage} units when the recorded value {incorrectValue} units is corrected. Find the actual value.",
  "AVG-QL-294": "The reported average daily sale of {count} shops is ₹{reportedAverage}, with one value entered as ₹{incorrectValue}. The correct average is ₹{correctedAverage}. Find the correct entry.",
  "AVG-QL-295": "Using {incorrectValue} runs for one innings gives an average of {reportedAverage} runs over {count} innings. The correct average is {correctedAverage} runs. Find the correct score.",
  "AVG-QL-297": "For {count} records, the reported average is {reportedAverage} and the correct average is {correctedAverage}. If {incorrectValue} was entered, find the correct value.",
  "AVG-QL-298": "Correcting one entry of {incorrectValue} marks changes the average of {count} students from {reportedAverage} marks to {correctedAverage} marks. Find the corrected score.",
  "AVG-QL-300": "For {count} people, one age was corrected to {correctValue} years, changing the average from {reportedAverage} years to {correctedAverage} years. Find the wrong age.",
  "AVG-QL-302": "The average daily sale of {count} shops was ₹{reportedAverage} and became ₹{correctedAverage} after one entry was corrected to ₹{correctValue}. Find the wrong entry.",
  "AVG-QL-303": "Correcting one score to {correctValue} runs changed the average over {count} innings from {reportedAverage} runs to {correctedAverage} runs. Find the incorrect score.",
  "AVG-QL-307": "The average monthly salary of {count} employees changes from ₹{reportedAverage} to ₹{correctedAverage} after one entry is corrected to ₹{correctValue}. Find the value used before correction.",
  "AVG-QL-310": "A single correction changed the average daily sale of {count} shops from ₹{reportedAverage} to ₹{correctedAverage}. Find the difference between the wrong and correct entries.",
  "AVG-QL-311": "For {count} innings, one correction changed the average from {reportedAverage} runs to {correctedAverage} runs. By how many runs did the wrong and correct scores differ?",
  "AVG-QL-329": "The reported average of {count} records is {reportedAverage}. After correcting {incorrectValue} to {correctValue} and {incorrectValue2} to {correctValue2}, find the new average.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp005StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-005") return entry;
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
