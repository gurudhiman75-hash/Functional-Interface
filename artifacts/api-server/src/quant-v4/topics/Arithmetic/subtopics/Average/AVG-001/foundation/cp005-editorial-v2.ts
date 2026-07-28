import { getAvg001QuestionEntry } from "./library";
import { toNumber } from "./math";
import { formatIndianNumber } from "./presentation-quality-v2";
import type {
  Avg001QuestionPackage,
  Avg001ValidationCheck,
  Rational,
} from "./types";

export const AVG_001_CP005_EDITORIAL_V2 =
  "AVG-CP-005 exam-ready correction stems, misconception options and four-tier explanations v2";

const MODE_TAGS = {
  findCorrectedAverageFromMistake: [
    "IGNORE_CORRECTION",
    "CORRECTION_SIGN_REVERSED",
    "COUNT_PLUS_ONE_DIVISOR",
  ],
  findReportedAverageBeforeCorrection: [
    "FINAL_AVERAGE_REPORTED",
    "CORRECTION_DIRECTION_NOT_REVERSED",
    "COUNT_PLUS_ONE_DIVISOR",
  ],
  findCorrectValueFromAverageShift: [
    "WRONG_VALUE_REUSED",
    "TOTAL_CORRECTION_SIGN_REVERSED",
    "AVERAGE_CHANGE_NOT_SCALED",
  ],
  findIncorrectValueFromCorrection: [
    "CORRECT_VALUE_REUSED",
    "TOTAL_CORRECTION_DIRECTION_REVERSED",
    "AVERAGE_CHANGE_NOT_SCALED",
  ],
  findEntryDifferenceFromAverageCorrection: [
    "AVERAGE_CHANGE_NOT_SCALED",
    "COUNT_MINUS_ONE_USED",
    "COUNT_PLUS_ONE_USED",
  ],
  findAverageChangeFromEntryCorrection: [
    "TOTAL_DIFFERENCE_NOT_DIVIDED",
    "COUNT_MINUS_ONE_DIVISOR",
    "COUNT_PLUS_ONE_DIVISOR",
  ],
  findNumberOfItemsFromTotalCorrection: [
    "COUNT_MINUS_ONE",
    "COUNT_PLUS_ONE",
    "DOUBLE_COUNT_ERROR",
  ],
  findCorrectedAverageFromMultipleMistakes: [
    "ALL_CORRECTIONS_IGNORED",
    "ONLY_FIRST_CORRECTION_APPLIED",
    "NET_CORRECTION_SIGN_REVERSED",
  ],
} as const;

type OptionSpec = { value: number; tag: string };
type Context = {
  setting: string;
  subjects: string;
  singular: string;
  record: string;
  measure: string;
  averageTarget: string;
  countTarget: string;
};

const CONTEXTS: Record<string, Context> = {
  examMarksCorrection: {
    setting: "During the tabulation of examination marks",
    subjects: "students",
    singular: "student",
    record: "a student's marks",
    measure: "marks",
    averageTarget: "average marks",
    countTarget: "students",
  },
  salaryRegisterCorrection: {
    setting: "During verification of a payroll register",
    subjects: "employees",
    singular: "employee",
    record: "an employee's monthly salary",
    measure: "monthly salary",
    averageTarget: "average monthly salary",
    countTarget: "employees",
  },
  ageRegisterCorrection: {
    setting: "During verification of a survey register",
    subjects: "people",
    singular: "person",
    record: "one person's age",
    measure: "age",
    averageTarget: "average age",
    countTarget: "people",
  },
  factoryOutputCorrection: {
    setting: "During an audit of a factory production log",
    subjects: "machines",
    singular: "machine",
    record: "one machine's daily output",
    measure: "daily output",
    averageTarget: "average daily output per machine",
    countTarget: "machines",
  },
  shopSalesCorrection: {
    setting: "During verification of a sales register",
    subjects: "shops",
    singular: "shop",
    record: "one shop's daily sales",
    measure: "daily sales",
    averageTarget: "average daily sales per shop",
    countTarget: "shops",
  },
  inningsRunsCorrection: {
    setting: "During verification of a batter's score record",
    subjects: "innings",
    singular: "inning",
    record: "the score in one innings",
    measure: "runs",
    averageTarget: "batting average",
    countTarget: "innings",
  },
  parcelWeightCorrection: {
    setting: "During verification of a consignment register",
    subjects: "parcels",
    singular: "parcel",
    record: "one parcel's weight",
    measure: "weight",
    averageTarget: "average parcel weight",
    countTarget: "parcels",
  },
  recordCountCorrection: {
    setting: "During verification of a numerical data set",
    subjects: "records",
    singular: "record",
    record: "one recorded value",
    measure: "value",
    averageTarget: "average value",
    countTarget: "records",
  },
};

function scenarioKey(pkg: Avg001QuestionPackage) {
  const variant = String(pkg.parameters.scenarioVariant);
  return Object.keys(CONTEXTS).find((key) => variant.startsWith(key)) ?? "recordCountCorrection";
}

function context(pkg: Avg001QuestionPackage) {
  return CONTEXTS[scenarioKey(pkg)]!;
}

function rationalNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "numerator" in value) {
    return toNumber(value as Rational);
  }
  return undefined;
}

function shownNumber(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") {
    const parsed = Number(String(rendered).replace(/[₹,\s]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return rationalNumber(pkg.parameters.values[key as keyof typeof pkg.parameters.values]);
}

function displayRaw(pkg: Avg001QuestionPackage, value: number) {
  const policy = pkg.parameters.displayPolicy;
  if (policy === "EXACT_DECIMAL_1") return value.toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return value.toFixed(2);
  if (policy === "EXACT_INTEGER") return String(Math.round(value));
  return String(Number(value.toFixed(3)));
}

function countLabel(pkg: Avg001QuestionPackage) {
  return context(pkg).countTarget;
}

function qualify(pkg: Avg001QuestionPackage, value: number) {
  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  const raw = displayRaw(pkg, value);
  const grouped = formatIndianNumber(raw);
  if (pkg.parameters.answerType === "COUNT") return `${Math.max(1, Math.round(value))} ${countLabel(pkg)}`;
  switch (entry.unitKind) {
    case "currency": return `₹${grouped}`;
    case "marks": return `${grouped} marks`;
    case "years": return `${grouped} years`;
    case "units": return `${grouped} units`;
    case "runs": return `${grouped} runs`;
    case "kg": return `${grouped} kg`;
    default: return grouped;
  }
}

function metric(pkg: Avg001QuestionPackage, key: string) {
  const value = shownNumber(pkg, key);
  return value === undefined ? "" : qualify(pkg, value);
}

function stem(pkg: Avg001QuestionPackage) {
  const c = context(pkg);
  const count = shownNumber(pkg, "count");
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
      return `${c.setting}, correcting a single recorded value changed the ${c.averageTarget} of ${count} ${c.subjects} from ${reported} to ${corrected}. By how much did the incorrect and correct values differ?`;
    case "findAverageChangeFromEntryCorrection":
      return `${c.setting}, ${c.record} among ${count} ${c.subjects} was recorded as ${wrong} instead of ${correct}. By how much does correcting this value change the ${c.averageTarget}?`;
    case "findNumberOfItemsFromTotalCorrection":
      return `${c.setting}, ${c.record} was corrected from ${wrong} to ${correct}, causing the ${c.averageTarget} to change by ${change}. How many ${c.countTarget} were included in the calculation?`;
    case "findCorrectedAverageFromMultipleMistakes":
      return `${c.setting}, the ${c.averageTarget} of ${count} ${c.subjects} was reported as ${reported}. Two values had been recorded as ${wrong} and ${wrong2} instead of ${correct} and ${correct2}, respectively. What is the correct ${c.averageTarget}?`;
    default:
      return pkg.stem;
  }
}

function answerNumber(pkg: Avg001QuestionPackage) {
  return toNumber(pkg.solver.exactAnswer);
}

function optionSpecs(pkg: Avg001QuestionPackage): OptionSpec[] {
  const answer = answerNumber(pkg);
  const count = shownNumber(pkg, "count") ?? 1;
  const reported = shownNumber(pkg, "reportedAverage") ?? answer;
  const corrected = shownNumber(pkg, "correctedAverage") ?? answer;
  const wrong = shownNumber(pkg, "incorrectValue") ?? answer;
  const correct = shownNumber(pkg, "correctValue") ?? answer;
  const wrong2 = shownNumber(pkg, "incorrectValue2") ?? wrong;
  const correct2 = shownNumber(pkg, "correctValue2") ?? correct;
  const averageChange = shownNumber(pkg, "averageChange") ?? Math.abs(corrected - reported);
  const entryDifference = shownNumber(pkg, "entryDifference") ?? Math.abs(correct - wrong);
  const signedDelta = correct - wrong;
  const firstDelta = correct - wrong;
  const secondDelta = correct2 - wrong2;

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return [
        { value: reported, tag: "IGNORE_CORRECTION" },
        { value: reported - signedDelta / count, tag: "CORRECTION_SIGN_REVERSED" },
        { value: reported + signedDelta / (count + 1), tag: "COUNT_PLUS_ONE_DIVISOR" },
      ];
    case "findReportedAverageBeforeCorrection":
      return [
        { value: corrected, tag: "FINAL_AVERAGE_REPORTED" },
        { value: corrected + signedDelta / count, tag: "CORRECTION_DIRECTION_NOT_REVERSED" },
        { value: corrected - signedDelta / (count + 1), tag: "COUNT_PLUS_ONE_DIVISOR" },
      ];
    case "findCorrectValueFromAverageShift": {
      const totalShift = (corrected - reported) * count;
      return [
        { value: wrong, tag: "WRONG_VALUE_REUSED" },
        { value: wrong - totalShift, tag: "TOTAL_CORRECTION_SIGN_REVERSED" },
        { value: wrong + (corrected - reported), tag: "AVERAGE_CHANGE_NOT_SCALED" },
      ];
    }
    case "findIncorrectValueFromCorrection": {
      const totalShift = (corrected - reported) * count;
      return [
        { value: correct, tag: "CORRECT_VALUE_REUSED" },
        { value: correct + totalShift, tag: "TOTAL_CORRECTION_DIRECTION_REVERSED" },
        { value: correct - (corrected - reported), tag: "AVERAGE_CHANGE_NOT_SCALED" },
      ];
    }
    case "findEntryDifferenceFromAverageCorrection":
      return [
        { value: averageChange, tag: "AVERAGE_CHANGE_NOT_SCALED" },
        { value: averageChange * Math.max(1, count - 1), tag: "COUNT_MINUS_ONE_USED" },
        { value: averageChange * (count + 1), tag: "COUNT_PLUS_ONE_USED" },
      ];
    case "findAverageChangeFromEntryCorrection":
      return [
        { value: entryDifference, tag: "TOTAL_DIFFERENCE_NOT_DIVIDED" },
        { value: entryDifference / Math.max(1, count - 1), tag: "COUNT_MINUS_ONE_DIVISOR" },
        { value: entryDifference / (count + 1), tag: "COUNT_PLUS_ONE_DIVISOR" },
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
        { value: reported + firstDelta / count, tag: "ONLY_FIRST_CORRECTION_APPLIED" },
        { value: reported - (firstDelta + secondDelta) / count, tag: "NET_CORRECTION_SIGN_REVERSED" },
      ];
    default:
      return MODE_TAGS[pkg.solveMode as keyof typeof MODE_TAGS]?.map((tag, index) => ({ value: answer + index + 1, tag })) ?? [];
  }
}

function minimumValue(pkg: Avg001QuestionPackage) {
  if (pkg.parameters.answerType === "COUNT") return 1;
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind;
  if (unit === "currency") return 1000;
  if (unit === "years" || unit === "kg" || unit === "units") return 1;
  return 0;
}

function candidateOptions(pkg: Avg001QuestionPackage) {
  const correct = qualify(pkg, answerNumber(pkg));
  const minimum = minimumValue(pkg);
  const selected: Array<{ text: string; tag: string }> = [];

  for (const spec of optionSpecs(pkg)) {
    if (!Number.isFinite(spec.value)) continue;
    const value = Math.max(minimum, spec.value);
    const text = qualify(pkg, value);
    if (text === correct || selected.some((item) => item.text === text)) continue;
    selected.push({ text, tag: spec.tag });
    if (selected.length === 3) break;
  }

  const step = pkg.parameters.answerType === "COUNT"
    ? 1
    : getAvg001QuestionEntry(pkg.questionLanguageId).unitKind === "currency"
      ? 1000
      : pkg.parameters.displayPolicy === "EXACT_DECIMAL_1"
        ? 0.1
        : 1;
  let fallbackIndex = 0;
  while (selected.length < 3) {
    fallbackIndex += 1;
    const direction = fallbackIndex % 2 === 0 ? -1 : 1;
    const value = Math.max(minimum, answerNumber(pkg) + direction * step * Math.ceil(fallbackIndex / 2));
    const text = qualify(pkg, value);
    if (text !== correct && !selected.some((item) => item.text === text)) {
      selected.push({ text, tag: direction > 0 ? "ARITHMETIC_OVERESTIMATE" : "ARITHMETIC_UNDERESTIMATE" });
    }
    if (fallbackIndex > 20) throw new Error(`Unable to build CP-005 v2 options for ${pkg.questionLanguageId}`);
  }

  const correctIndex = pkg.correctIndex;
  const options = selected.map((item) => item.text);
  const tags = selected.map((item) => item.tag);
  options.splice(correctIndex, 0, correct);
  tags.splice(correctIndex, 0, "CORRECT");
  return { options, correctIndex, answer: correct, tags };
}

function working(pkg: Avg001QuestionPackage) {
  const count = shownNumber(pkg, "count") ?? 1;
  const reported = shownNumber(pkg, "reportedAverage") ?? 0;
  const corrected = shownNumber(pkg, "correctedAverage") ?? 0;
  const wrong = shownNumber(pkg, "incorrectValue") ?? 0;
  const correct = shownNumber(pkg, "correctValue") ?? 0;
  const wrong2 = shownNumber(pkg, "incorrectValue2") ?? 0;
  const correct2 = shownNumber(pkg, "correctValue2") ?? 0;
  const change = shownNumber(pkg, "averageChange") ?? Math.abs(corrected - reported);

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return `$$A_{correct}= ${displayRaw(pkg, reported)} + [(${displayRaw(pkg, correct)}-${displayRaw(pkg, wrong)})\\div${count}] = ${pkg.answer}$$`;
    case "findReportedAverageBeforeCorrection":
      return `$$A_{reported}= ${displayRaw(pkg, corrected)} - [(${displayRaw(pkg, correct)}-${displayRaw(pkg, wrong)})\\div${count}] = ${pkg.answer}$$`;
    case "findCorrectValueFromAverageShift":
      return `$$V_{correct}= ${displayRaw(pkg, wrong)} + (${displayRaw(pkg, corrected)}-${displayRaw(pkg, reported)})\\times${count} = ${pkg.answer}$$`;
    case "findIncorrectValueFromCorrection":
      return `$$V_{wrong}= ${displayRaw(pkg, correct)} - (${displayRaw(pkg, corrected)}-${displayRaw(pkg, reported)})\\times${count} = ${pkg.answer}$$`;
    case "findEntryDifferenceFromAverageCorrection":
      return `$$|V_{correct}-V_{wrong}|=|${displayRaw(pkg, corrected)}-${displayRaw(pkg, reported)}|\\times${count}=${pkg.answer}$$`;
    case "findAverageChangeFromEntryCorrection":
      return `$$\\Delta A=|${displayRaw(pkg, correct)}-${displayRaw(pkg, wrong)}|\\div${count}=${pkg.answer}$$`;
    case "findNumberOfItemsFromTotalCorrection":
      return `$$N=|${displayRaw(pkg, correct)}-${displayRaw(pkg, wrong)}|\\div${displayRaw(pkg, change)}=${pkg.answer}$$`;
    case "findCorrectedAverageFromMultipleMistakes":
      return `$$A_{correct}= ${displayRaw(pkg, reported)} + [(${displayRaw(pkg, correct)}-${displayRaw(pkg, wrong)})+(${displayRaw(pkg, correct2)}-${displayRaw(pkg, wrong2)})]\\div${count}=${pkg.answer}$$`;
    default:
      return pkg.solver.equation;
  }
}

function rule(pkg: Avg001QuestionPackage) {
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake": return "A single correction changes the total by correct value minus recorded value; divide that signed change by the number of observations.";
    case "findReportedAverageBeforeCorrection": return "To recover the earlier average, reverse the per-observation effect of the correction from the final correct average.";
    case "findCorrectValueFromAverageShift": return "The full correction to one value equals the change in average multiplied by the number of observations.";
    case "findIncorrectValueFromCorrection": return "Work backwards from the correct value by removing the total effect of the average change.";
    case "findEntryDifferenceFromAverageCorrection": return "The difference between the correct and incorrect values equals the absolute change in average multiplied by the count.";
    case "findAverageChangeFromEntryCorrection": return "The change in average equals the absolute correction to the value divided by the full count.";
    case "findNumberOfItemsFromTotalCorrection": return "The number of observations equals the total correction divided by the resulting change in average.";
    case "findCorrectedAverageFromMultipleMistakes": return "Add all signed value corrections first, divide the net correction by the count and apply it to the reported average.";
    default: return "Use the signed-total correction identity.";
  }
}

function shortcut(pkg: Avg001QuestionPackage) {
  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake": return "Do not rebuild the full total: apply (correct − recorded) ÷ count directly to the reported average.";
    case "findReportedAverageBeforeCorrection": return "Compute the correction per observation once, then move in the opposite direction from the correct average.";
    case "findCorrectValueFromAverageShift": return "Average shift × count gives the exact amount to add to or subtract from the recorded value.";
    case "findIncorrectValueFromCorrection": return "Average shift × count is the total correction; reverse it from the correct value.";
    case "findEntryDifferenceFromAverageCorrection": return "Ignore the direction when only the size of the recording error is requested.";
    case "findAverageChangeFromEntryCorrection": return "Use the full count—there is no joining or leaving member, so do not use count ± 1.";
    case "findNumberOfItemsFromTotalCorrection": return "Count is error ÷ average shift, not their product.";
    case "findCorrectedAverageFromMultipleMistakes": return "Combine positive and negative corrections before dividing; opposite errors may cancel.";
    default: return "Track the sign of every correction before dividing by the count.";
  }
}

function explanation(pkg: Avg001QuestionPackage, tags: string[]) {
  const analyses = pkg.options
    .map((option, index) => ({ option, index, tag: tags[index] }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) [${tag}]`)
    .join("; ");
  return {
    lines: [
      `📌 Key rule: ${rule(pkg)}`,
      `📝 Step-by-step solution: ${working(pkg)}`,
      `⚡ Exam speed shortcut: ${shortcut(pkg)}`,
      `⚠️ Common traps and distractors: ${analyses}. Therefore, the required answer is ${pkg.answer}.`,
    ],
  };
}

function consistentOptions(pkg: Avg001QuestionPackage) {
  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  if (pkg.parameters.answerType === "COUNT") {
    const label = countLabel(pkg);
    return pkg.options.every((option) => new RegExp(`^\\d+ ${label}$`).test(option));
  }
  const patterns: Record<string, RegExp> = {
    currency: /^₹(?:\d{1,3}|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d+)?$/,
    marks: /^\d+(?:\.\d+)? marks$/,
    years: /^\d+(?:\.\d+)? years$/,
    units: /^\d+(?:\.\d+)? units$/,
    runs: /^\d+(?:\.\d+)? runs$/,
    kg: /^\d+(?:\.\d+)? kg$/,
    none: /^\d+(?:\.\d+)?$/,
  };
  return pkg.options.every((option) => (patterns[entry.unitKind ?? "none"] ?? patterns.none!).test(option));
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const replaced = new Set([
    "resolved-stem", "four-options", "unique-options", "correct-index", "answer-once",
    "explanation-depth", "explanation-arithmetic", "explanation-answer",
    "cp005-editorial-v2", "cp005-v2-stem", "cp005-v2-options", "cp005-v2-explanation",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  const optionTags = pkg.traceability.cp005OptionTags;
  checks.push(
    { name: "cp005-editorial-v2", passed: pkg.traceability.cp005EditorialV2 === AVG_001_CP005_EDITORIAL_V2, message: "CP-005 carries the v2 editorial candidate trace" },
    { name: "cp005-v2-stem", passed: pkg.stem.length >= 100 && !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem) && !/\bentry\b/i.test(pkg.stem), message: "Stem is explicit, contextual and free from mechanical entry language" },
    { name: "cp005-v2-options", passed: pkg.options.length === 4 && new Set(pkg.options).size === 4 && pkg.options[pkg.correctIndex] === pkg.answer && consistentOptions(pkg) && pkg.options.every((option) => !/^-|₹-/.test(option)), message: "Options are unique, positive, semantically qualified and consistently formatted" },
    { name: "cp005-v2-option-tags", passed: Array.isArray(optionTags) && optionTags.length === 4 && optionTags[pkg.correctIndex] === "CORRECT" && optionTags.filter((tag) => tag !== "CORRECT").length === 3, message: "Each wrong option carries one explicit misconception tag" },
    { name: "cp005-v2-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines[0]?.startsWith("📌 Key rule:") === true && pkg.explanation.lines[1]?.startsWith("📝 Step-by-step solution:") === true && pkg.explanation.lines[2]?.startsWith("⚡ Exam speed shortcut:") === true && pkg.explanation.lines[3]?.startsWith("⚠️ Common traps and distractors:") === true && pkg.explanation.lines[3]?.includes(pkg.answer) === true, message: "Explanation follows the exact four-tier schema with answer evidence" },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp005EditorialV2Candidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005" || pkg.language !== "en") return pkg;
  const fingerprint = pkg.mathematicalFingerprint;
  const built = candidateOptions(pkg);
  const withOptions: Avg001QuestionPackage = {
    ...pkg,
    stem: stem(pkg),
    options: built.options,
    correctIndex: built.correctIndex,
    answer: built.answer,
    solver: { ...pkg.solver, answer: built.answer },
    independentVerification: { ...pkg.independentVerification, displayAnswer: built.answer },
    traceability: {
      ...pkg.traceability,
      cp005EditorialV2: AVG_001_CP005_EDITORIAL_V2,
      cp005OptionTags: built.tags,
      releaseCandidate: "AVG-001-EN-v2",
      preservedMathematicalFingerprint: fingerprint,
    },
  };
  const revised: Avg001QuestionPackage = {
    ...withOptions,
    explanation: explanation(withOptions, built.tags),
  };
  return { ...revised, validation: refreshValidation(revised) };
}
