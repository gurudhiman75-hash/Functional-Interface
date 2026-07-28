import { getAvg001QuestionEntry } from "./library";
import { toNumber } from "./math";
import { formatIndianNumber } from "./presentation-quality-v2";
import { applyAvg001Cp005EditorialV2Candidate } from "./cp005-editorial-v2";
import type { Avg001QuestionPackage, Avg001ValidationCheck, Rational } from "./types";

export const AVG_001_CP005_EDITORIAL_V2_FINAL =
  "AVG-CP-005 editorial v2 final context, unit and distractor polish v1";

type Context = {
  setting: string;
  subjects: string;
  record: string;
  recordsPlural: string;
  averageTarget: string;
  countTarget: string;
};

type Spec = { value: number; tag: string };

const CONTEXTS: Record<string, Context> = {
  examMarksCorrection: {
    setting: "During the tabulation of examination marks",
    subjects: "students",
    record: "one student's score",
    recordsPlural: "student scores",
    averageTarget: "average score",
    countTarget: "students",
  },
  salaryRegisterCorrection: {
    setting: "During verification of a payroll register",
    subjects: "employees",
    record: "one employee's monthly salary",
    recordsPlural: "monthly salaries",
    averageTarget: "average monthly salary",
    countTarget: "employees",
  },
  ageRegisterCorrection: {
    setting: "During verification of a survey register",
    subjects: "people",
    record: "one person's age",
    recordsPlural: "ages",
    averageTarget: "average age",
    countTarget: "people",
  },
  factoryOutputCorrection: {
    setting: "During an audit of a factory production log",
    subjects: "machines",
    record: "one machine's daily output",
    recordsPlural: "daily output figures",
    averageTarget: "average daily output",
    countTarget: "machines",
  },
  shopSalesCorrection: {
    setting: "During verification of a sales register",
    subjects: "shops",
    record: "one shop's daily sales figure",
    recordsPlural: "daily sales figures",
    averageTarget: "average daily sales",
    countTarget: "shops",
  },
  inningsRunsCorrection: {
    setting: "During verification of a batter's score record",
    subjects: "innings",
    record: "the score in one innings",
    recordsPlural: "innings scores",
    averageTarget: "batting average",
    countTarget: "innings",
  },
  parcelWeightCorrection: {
    setting: "During verification of a consignment register",
    subjects: "parcels",
    record: "one parcel's weight",
    recordsPlural: "parcel weights",
    averageTarget: "average weight",
    countTarget: "parcels",
  },
  recordCountCorrection: {
    setting: "During verification of a numerical data set",
    subjects: "recorded values",
    record: "one value",
    recordsPlural: "values",
    averageTarget: "average",
    countTarget: "values",
  },
};

function key(pkg: Avg001QuestionPackage) {
  const variant = String(pkg.parameters.scenarioVariant);
  return Object.keys(CONTEXTS).find((item) => variant.startsWith(item)) ?? "recordCountCorrection";
}

function context(pkg: Avg001QuestionPackage) {
  return CONTEXTS[key(pkg)]!;
}

function numberFrom(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "numerator" in value) return toNumber(value as Rational);
  return undefined;
}

function shown(pkg: Avg001QuestionPackage, name: string) {
  const rendered = pkg.parameters.renderVariables[name];
  if (rendered !== undefined && rendered !== "") {
    const parsed = Number(String(rendered).replace(/[₹,\s]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return numberFrom(pkg.parameters.values[name as keyof typeof pkg.parameters.values]);
}

function raw(pkg: Avg001QuestionPackage, value: number) {
  if (pkg.parameters.displayPolicy === "EXACT_DECIMAL_1") return value.toFixed(1);
  if (pkg.parameters.displayPolicy === "EXACT_DECIMAL_2") return value.toFixed(2);
  if (pkg.parameters.displayPolicy === "EXACT_INTEGER") return String(Math.round(value));
  return String(Number(value.toFixed(3)));
}

function measurement(pkg: Avg001QuestionPackage, value: number) {
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind ?? "none";
  const rendered = formatIndianNumber(raw(pkg, value));
  const singular = Math.abs(value) === 1;
  if (unit === "currency") return `₹${rendered}`;
  if (unit === "marks") return `${rendered} ${singular ? "mark" : "marks"}`;
  if (unit === "years") return `${rendered} ${singular ? "year" : "years"}`;
  if (unit === "units") return `${rendered} ${singular ? "unit" : "units"}`;
  if (unit === "runs") return `${rendered} ${singular ? "run" : "runs"}`;
  if (unit === "kg") return `${rendered} kg`;
  return rendered;
}

function answerText(pkg: Avg001QuestionPackage, value: number) {
  if (pkg.parameters.answerType === "COUNT") {
    return `${Math.max(1, Math.round(value))} ${context(pkg).countTarget}`;
  }
  return measurement(pkg, value);
}

function metric(pkg: Avg001QuestionPackage, name: string) {
  const value = shown(pkg, name);
  return value === undefined ? "" : measurement(pkg, value);
}

function renderStem(pkg: Avg001QuestionPackage) {
  const c = context(pkg);
  const count = shown(pkg, "count") ?? 0;
  const reported = metric(pkg, "reportedAverage");
  const corrected = metric(pkg, "correctedAverage");
  const wrong = metric(pkg, "incorrectValue");
  const correct = metric(pkg, "correctValue");
  const wrong2 = metric(pkg, "incorrectValue2");
  const correct2 = metric(pkg, "correctValue2");
  const change = metric(pkg, "averageChange");

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return `${c.setting}, the ${c.averageTarget} of ${count} ${c.subjects} was reported as ${reported}. It was later found that ${c.record} had been recorded as ${wrong} instead of ${correct}. What is the correct ${c.averageTarget}?`;
    case "findReportedAverageBeforeCorrection":
      return `${c.setting}, ${c.record} was corrected from ${wrong} to ${correct}. After this correction, the ${c.averageTarget} of ${count} ${c.subjects} became ${corrected}. What average had been reported before the correction?`;
    case "findCorrectValueFromAverageShift":
      return `${c.setting}, the ${c.averageTarget} of ${count} ${c.subjects} was reported as ${reported} because ${c.record} had been entered as ${wrong}. After correction, the average became ${corrected}. What should the recorded value have been?`;
    case "findIncorrectValueFromCorrection":
      return `${c.setting}, the ${c.averageTarget} of ${count} ${c.subjects} changed from ${reported} to ${corrected} after ${c.record} was corrected to ${correct}. What value had been recorded incorrectly?`;
    case "findEntryDifferenceFromAverageCorrection":
      return `${c.setting}, correcting ${c.record} changed the ${c.averageTarget} of ${count} ${c.subjects} from ${reported} to ${corrected}. By how much did the incorrect and correct values differ?`;
    case "findAverageChangeFromEntryCorrection":
      return `${c.setting}, for ${count} ${c.subjects}, ${c.record} was recorded as ${wrong} instead of ${correct}. By how much does correcting this value change the ${c.averageTarget}?`;
    case "findNumberOfItemsFromTotalCorrection":
      return `${c.setting}, ${c.record} was corrected from ${wrong} to ${correct}, causing the ${c.averageTarget} to change by ${change}. How many ${c.countTarget} were included in the calculation?`;
    case "findCorrectedAverageFromMultipleMistakes":
      return `${c.setting}, the ${c.averageTarget} of ${count} ${c.subjects} was reported as ${reported}. Two ${c.recordsPlural} had been recorded as ${wrong} and ${wrong2} instead of ${correct} and ${correct2}, respectively. What is the correct ${c.averageTarget}?`;
    default:
      return pkg.stem;
  }
}

function specs(pkg: Avg001QuestionPackage): Spec[] {
  const count = shown(pkg, "count") ?? 1;
  const reported = shown(pkg, "reportedAverage") ?? 0;
  const corrected = shown(pkg, "correctedAverage") ?? 0;
  const wrong = shown(pkg, "incorrectValue") ?? 0;
  const correct = shown(pkg, "correctValue") ?? 0;
  const wrong2 = shown(pkg, "incorrectValue2") ?? 0;
  const correct2 = shown(pkg, "correctValue2") ?? 0;
  const averageChange = shown(pkg, "averageChange") ?? Math.abs(corrected - reported);
  const difference = shown(pkg, "entryDifference") ?? Math.abs(correct - wrong);
  const signedAverageShift = corrected - reported;
  const totalShift = signedAverageShift * count;
  const net = (correct - wrong) + (correct2 - wrong2);

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return [
        { value: reported, tag: "IGNORE_CORRECTION" },
        { value: reported - signedAverageShift, tag: "CORRECTION_SIGN_REVERSED" },
        { value: reported + 2 * signedAverageShift, tag: "CORRECTION_APPLIED_TWICE" },
      ];
    case "findReportedAverageBeforeCorrection":
      return [
        { value: corrected, tag: "FINAL_AVERAGE_REPORTED" },
        { value: corrected + signedAverageShift, tag: "CORRECTION_DIRECTION_NOT_REVERSED" },
        { value: corrected - 2 * signedAverageShift, tag: "CORRECTION_REVERSED_TWICE" },
      ];
    case "findCorrectValueFromAverageShift":
      return [
        { value: wrong, tag: "WRONG_VALUE_REUSED" },
        { value: wrong - totalShift, tag: "TOTAL_CORRECTION_SIGN_REVERSED" },
        { value: wrong + signedAverageShift, tag: "AVERAGE_CHANGE_NOT_SCALED" },
      ];
    case "findIncorrectValueFromCorrection":
      return [
        { value: correct, tag: "CORRECT_VALUE_REUSED" },
        { value: correct + totalShift, tag: "TOTAL_CORRECTION_DIRECTION_REVERSED" },
        { value: correct - signedAverageShift, tag: "AVERAGE_CHANGE_NOT_SCALED" },
      ];
    case "findEntryDifferenceFromAverageCorrection":
      return [
        { value: averageChange, tag: "AVERAGE_CHANGE_NOT_SCALED" },
        { value: averageChange * Math.max(1, count - 1), tag: "COUNT_MINUS_ONE_USED" },
        { value: averageChange * (count + 1), tag: "COUNT_PLUS_ONE_USED" },
      ];
    case "findAverageChangeFromEntryCorrection":
      return [
        { value: difference, tag: "TOTAL_DIFFERENCE_NOT_DIVIDED" },
        { value: averageChange * 2, tag: "HALF_COUNT_USED" },
        { value: averageChange * 3, tag: "ONE_THIRD_COUNT_USED" },
      ];
    case "findNumberOfItemsFromTotalCorrection":
      return [
        { value: Math.max(1, count - 1), tag: "COUNT_MINUS_ONE" },
        { value: count + 1, tag: "COUNT_PLUS_ONE" },
        { value: count * 2, tag: "DOUBLE_COUNT_ERROR" },
      ];
    case "findCorrectedAverageFromMultipleMistakes":
      return [
        { value: reported, tag: "ALL_CORRECTIONS_IGNORED" },
        { value: reported - net / count, tag: "NET_CORRECTION_SIGN_REVERSED" },
        { value: reported + 2 * net / count, tag: "NET_CORRECTION_APPLIED_TWICE" },
      ];
    default:
      return [];
  }
}

function minimum(pkg: Avg001QuestionPackage) {
  if (pkg.parameters.answerType === "COUNT") return 1;
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind;
  if (unit === "currency") return 1000;
  if (unit === "years" || unit === "units" || unit === "kg") return 1;
  return 0;
}

function buildOptions(pkg: Avg001QuestionPackage) {
  const answerValue = toNumber(pkg.solver.exactAnswer);
  const correct = answerText(pkg, answerValue);
  const selected: Array<{ text: string; tag: string }> = [];
  const floor = minimum(pkg);

  for (const spec of specs(pkg)) {
    const value = Math.max(floor, spec.value);
    const text = answerText(pkg, value);
    if (text === correct || selected.some((item) => item.text === text)) continue;
    selected.push({ text, tag: spec.tag });
  }

  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind;
  const step = pkg.parameters.answerType === "COUNT" ? 1 : unit === "currency" ? 1000 : pkg.parameters.displayPolicy === "EXACT_DECIMAL_1" ? 0.1 : 1;
  let attempt = 0;
  while (selected.length < 3) {
    attempt += 1;
    const direction = attempt % 2 ? 1 : -1;
    const value = Math.max(floor, answerValue + direction * step * Math.ceil(attempt / 2));
    const text = answerText(pkg, value);
    if (text !== correct && !selected.some((item) => item.text === text)) {
      selected.push({ text, tag: direction > 0 ? "ARITHMETIC_OVERESTIMATE" : "ARITHMETIC_UNDERESTIMATE" });
    }
    if (attempt > 24) throw new Error(`Unable to construct final CP-005 options for ${pkg.questionLanguageId}`);
  }

  const options = selected.slice(0, 3).map((item) => item.text);
  const tags = selected.slice(0, 3).map((item) => item.tag);
  options.splice(pkg.correctIndex, 0, correct);
  tags.splice(pkg.correctIndex, 0, "CORRECT");
  return { options, tags, answer: correct };
}

function finalExplanation(pkg: Avg001QuestionPackage, oldAnswer: string, tags: string[]) {
  const lines = pkg.explanation.lines.map((line) => line.replaceAll(oldAnswer, pkg.answer));
  const analysis = pkg.options
    .map((option, index) => ({ option, index, tag: tags[index] }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) [${tag}]`)
    .join("; ");
  lines[3] = `⚠️ Common traps and distractors: ${analysis}. Therefore, the required answer is ${pkg.answer}.`;
  return { lines };
}

function consistent(pkg: Avg001QuestionPackage) {
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind ?? "none";
  if (pkg.parameters.answerType === "COUNT") {
    const label = context(pkg).countTarget;
    return pkg.options.every((option) => new RegExp(`^\\d+ ${label}$`).test(option));
  }
  const patterns: Record<string, RegExp> = {
    currency: /^₹(?:\d{1,3}|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d+)?$/,
    marks: /^\d+(?:\.\d+)? (?:mark|marks)$/,
    years: /^\d+(?:\.\d+)? (?:year|years)$/,
    units: /^\d+(?:\.\d+)? (?:unit|units)$/,
    runs: /^\d+(?:\.\d+)? (?:run|runs)$/,
    kg: /^\d+(?:\.\d+)? kg$/,
    none: /^\d+(?:\.\d+)?$/,
  };
  return pkg.options.every((option) => (patterns[unit] ?? patterns.none!).test(option));
}

function validate(pkg: Avg001QuestionPackage) {
  const removed = new Set(["cp005-v2-stem", "cp005-v2-options", "cp005-v2-option-tags", "cp005-v2-explanation"]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !removed.has(check.name));
  const tags = pkg.traceability.cp005OptionTags;
  checks.push(
    { name: "cp005-v2-stem", passed: pkg.stem.length >= 100 && !/[{}]|undefined|NaN|Infinity|null|\bentry\b/i.test(pkg.stem), message: "Final CP-005 stem is resolved, contextual and natural" },
    { name: "cp005-v2-options", passed: pkg.options.length === 4 && new Set(pkg.options).size === 4 && pkg.options[pkg.correctIndex] === pkg.answer && consistent(pkg) && pkg.options.every((option) => !/^-|₹-/.test(option)), message: "Final CP-005 options are unique, positive and consistently qualified" },
    { name: "cp005-v2-option-tags", passed: Array.isArray(tags) && tags.length === 4 && tags[pkg.correctIndex] === "CORRECT" && tags.filter((tag) => tag !== "CORRECT").length === 3, message: "Final CP-005 distractors retain one misconception tag each" },
    { name: "cp005-v2-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines[3]?.includes(pkg.answer) === true && pkg.options.filter((_, index) => index !== pkg.correctIndex).every((option) => pkg.explanation.lines[3]?.includes(`(${option})`)), message: "Final CP-005 explanation analyses every wrong option and states the answer" },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp005EditorialV2FinalCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp005EditorialV2Candidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-005" || candidate.language !== "en") return candidate;
  const oldAnswer = candidate.answer;
  const built = buildOptions(candidate);
  const revised: Avg001QuestionPackage = {
    ...candidate,
    stem: renderStem(candidate),
    options: built.options,
    answer: built.answer,
    solver: { ...candidate.solver, answer: built.answer },
    independentVerification: { ...candidate.independentVerification, displayAnswer: built.answer },
    traceability: {
      ...candidate.traceability,
      cp005OptionTags: built.tags,
      cp005EditorialV2Final: AVG_001_CP005_EDITORIAL_V2_FINAL,
    },
  };
  const explained = { ...revised, explanation: finalExplanation(revised, oldAnswer, built.tags) };
  return { ...explained, validation: validate(explained) };
}
