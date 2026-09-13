import { hashSeed } from "../shared/exact";
import type { Sta001Question, Sta001State } from "./types";
import type { Stat001PermanentQlId } from "./permanent-ql-registry";

function list(values: readonly number[]) {
  return values.join(", ");
}

function surfaceIndex(seed: string, qlId: Stat001PermanentQlId) {
  return hashSeed(`${seed}:${qlId}:english-editorial-surface`) % 6;
}

function assertState<TKind extends Sta001State["kind"]>(
  state: Sta001State,
  kind: TKind,
): Extract<Sta001State, { kind: TKind }> {
  if (state.kind !== kind) {
    throw new Error(`STAT-001 editorial surface expected ${kind}, received ${state.kind}.`);
  }
  return state as Extract<Sta001State, { kind: TKind }>;
}

function simpleMean(state: Sta001State) {
  const data = assertState(state, "SIMPLE_MEAN_RAW");
  const values = list(data.values);
  const count = data.values.length;
  return [
    `Find the arithmetic mean of ${values}.`,
    `The marks obtained by ${count} students are ${values}. What is their average mark?`,
    `The observations ${values} were recorded in a survey. Find their mean.`,
    `What is the average of the following ${count} values: ${values}?`,
    `A set consists of the values ${values}. Calculate its arithmetic mean.`,
    `The daily counts for ${count} consecutive days are ${values}. Find the average daily count.`,
  ] as const;
}

function missingObservation(state: Sta001State) {
  const data = assertState(state, "MISSING_OBSERVATION");
  const known = list(data.knownValues);
  return [
    `The mean of ${data.observationCount} observations is ${data.mean}. If ${known} are the known observations, find the missing observation.`,
    `The average of ${data.observationCount} numbers is ${data.mean}. One number is missing; the remaining numbers are ${known}. Find the missing number.`,
    `${data.observationCount} observations have a mean of ${data.mean}. All except one are ${known}. What is the omitted value?`,
    `The average mark of ${data.observationCount} students is ${data.mean}. The marks of ${data.observationCount - 1} students are ${known}. Find the mark of the remaining student.`,
    `A data set of ${data.observationCount} values has arithmetic mean ${data.mean}. Given ${known}, determine the value not shown.`,
    `The mean of a group of ${data.observationCount} readings is ${data.mean}. If the available readings are ${known}, what must the remaining reading be?`,
  ] as const;
}

function correctedMean(state: Sta001State) {
  const data = assertState(state, "CORRECTED_MEAN");
  return [
    `The mean of ${data.observationCount} observations was calculated as ${data.reportedMean}. Later, ${data.wrongValue} was found to have been recorded instead of ${data.correctValue}. Find the correct mean.`,
    `The average of ${data.observationCount} values is reported as ${data.reportedMean}. If one value was entered as ${data.wrongValue} in place of ${data.correctValue}, what is the corrected average?`,
    `While finding the mean of ${data.observationCount} observations, ${data.wrongValue} was used instead of ${data.correctValue}, giving a mean of ${data.reportedMean}. Determine the actual mean.`,
    `An average of ${data.reportedMean} was obtained for ${data.observationCount} entries. One entry should be ${data.correctValue} but was taken as ${data.wrongValue}. Find the revised average.`,
    `The recorded mean of ${data.observationCount} numbers is ${data.reportedMean}. Correcting one number from ${data.wrongValue} to ${data.correctValue}, what does the mean become?`,
    `For ${data.observationCount} observations, the calculated mean is ${data.reportedMean}. A checking error shows that ${data.wrongValue} should have been ${data.correctValue}. Calculate the corrected mean.`,
  ] as const;
}

function combinedMean(state: Sta001State) {
  const data = assertState(state, "COMBINED_MEAN");
  return [
    `A group of ${data.group1Count} students has an average of ${data.group1Mean}, and another group of ${data.group2Count} students has an average of ${data.group2Mean}. Find the average of all the students together.`,
    `The mean of ${data.group1Count} observations is ${data.group1Mean}, while the mean of another ${data.group2Count} observations is ${data.group2Mean}. What is the combined mean?`,
    `Section A has ${data.group1Count} students with average marks ${data.group1Mean}; Section B has ${data.group2Count} students with average marks ${data.group2Mean}. Find the overall average mark.`,
    `Two groups contain ${data.group1Count} and ${data.group2Count} members, with averages ${data.group1Mean} and ${data.group2Mean} respectively. Calculate their combined average.`,
    `The average score of ${data.group1Count} candidates is ${data.group1Mean} and that of ${data.group2Count} candidates is ${data.group2Mean}. What is the average score of all ${data.group1Count + data.group2Count} candidates?`,
    `One batch has ${data.group1Count} observations averaging ${data.group1Mean}; a second batch has ${data.group2Count} observations averaging ${data.group2Mean}. Find the mean after the batches are combined.`,
  ] as const;
}

function medianRaw(state: Sta001State) {
  const data = assertState(state, "MEDIAN_RAW");
  const values = list(data.values);
  return [
    `Find the median of the observations ${values}.`,
    `What is the median of the following data: ${values}?`,
    `The observations are ${values}. Arrange them in ascending order and find the median.`,
    `Determine the middle value of the ordered data set ${values}.`,
    `For the raw data ${values}, calculate the median.`,
    `The recorded values are ${values}. What is their median after arranging the values in order?`,
  ] as const;
}

function modeRaw(state: Sta001State) {
  const data = assertState(state, "MODE_RAW");
  const values = list(data.values);
  return [
    `Find the mode of the observations ${values}.`,
    `Which value occurs most frequently in the data ${values}?`,
    `Determine the mode of the following raw data: ${values}.`,
    `The observations are ${values}. Identify the modal value.`,
    `For the data set ${values}, which observation has the greatest frequency?`,
    `The recorded values are ${values}. Find the value that represents the mode.`,
  ] as const;
}

export function renderStat001EnglishReviewStem(
  question: Pick<Sta001Question, "seed" | "state">,
  qlId: Stat001PermanentQlId,
) {
  const variants = (() => {
    switch (qlId) {
      case "STAT-QL-001": return simpleMean(question.state);
      case "STAT-QL-002": return missingObservation(question.state);
      case "STAT-QL-003": return correctedMean(question.state);
      case "STAT-QL-004": return combinedMean(question.state);
      case "STAT-QL-005": return medianRaw(question.state);
      case "STAT-QL-006": return modeRaw(question.state);
    }
  })();
  return variants[surfaceIndex(question.seed, qlId)]!;
}

export const STAT001_ENGLISH_EDITORIAL_SURFACE_COUNT = 6 as const;
