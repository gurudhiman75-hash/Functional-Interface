import { add, divide, equals, fromDecimalString, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { generateCp001Candidate, generateCp001ReviewRows } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function scalarOption(text: string): Rational {
  const match = text.match(/^(-?\d+(?:\.\d+)?|-?\d+\/\d+)/);
  if (!match) throw new Error(`Cannot parse scalar option: ${text}`);
  if (match[1].includes("/")) {
    const [numerator, denominator] = match[1].split("/");
    return rational(BigInt(numerator), BigInt(denominator));
  }
  return fromDecimalString(match[1]);
}

const rows = generateCp001ReviewRows(3);
assert(rows.length === 69, "Expected 69 learner review rows");

const directModes = new Set([
  "distanceFromSpeedAndTime",
  "speedFromDistanceAndTime",
  "timeFromDistanceAndSpeed",
]);
const realisticDirectIds = new Set([
  "MIX_UNCONVERTED_UNITS",
  "TREAT_SECONDS_AS_MINUTES",
  "REVERSE_UNIT_CONVERSION",
]);
const forbiddenArtificialDirectIds = new Set([
  "MISREAD_SPEED",
  "MISREAD_TIME",
  "MISREAD_DISTANCE",
  "ADD_GIVENS_BEFORE_DIVIDING",
  "SUBTRACT_GIVENS_BEFORE_DIVIDING",
  "ARITHMETIC_OFFSET",
]);
const proportionModes = new Set([
  "distanceByProportion",
  "timeByProportion",
  "speedByProportion",
]);

let mathJaxStemCount = 0;
let fourTierCount = 0;
let fullOptionAnalysisCount = 0;
let variedDirectStemCount = 0;
let deadlineSemanticChecks = 0;
let nonTrivialDistanceRows = 0;
let conciseProportionRows = 0;

for (const row of rows) {
  const visible = [
    row.stemMathJax,
    row.explanation.keyRule,
    ...row.explanation.stepByStepSolution,
    row.explanation.examSpeedShortcut,
    ...row.explanation.optionAnalysis.map((option) => `${option.text} ${option.reason}`),
  ].join(" ");

  assert(!visible.includes("\\text{time}s"), `${row.solveMode}: LaTeX \\times token was corrupted`);
  assert(!visible.includes("\\text{\\text{"), `${row.solveMode}: nested LaTeX text command leaked`);
  assert(!/\b(\d+(?:\.\d+)? hours)\s*=\s*\1\b/i.test(visible), `${row.solveMode}: repeated hour conversion leaked`);
  assert(!/[A-Z]{2,}(?:_[A-Z]{2,})+/.test(row.explanation.optionAnalysis.map((option) => option.reason).join(" ")), `${row.solveMode}: internal misconception ID leaked`);
  assert((row.stemMathJax.match(/\\\(/g) ?? []).length === (row.stemMathJax.match(/\\\)/g) ?? []).length, `${row.solveMode}: unbalanced stem MathJax delimiters`);
  assert(row.explanation.stepByStepSolution.every((line) => (line.match(/\\\(/g) ?? []).length === (line.match(/\\\)/g) ?? []).length), `${row.solveMode}: unbalanced solution MathJax delimiters`);
  assert(row.explanation.stepByStepSolution.length >= 6, `${row.solveMode}: explanation remains too compressed`);

  if (row.stemMathJax.includes("\\(")) mathJaxStemCount += 1;
  if (row.explanation.keyRule.startsWith("📌 Main Rule:") && row.explanation.examSpeedShortcut.startsWith("⚡ Exam Speed Trick:")) fourTierCount += 1;
  if (row.explanation.optionAnalysis.length === 4 && row.explanation.optionAnalysis.filter((option) => option.isCorrect).length === 1) fullOptionAnalysisCount += 1;

  if (directModes.has(row.solveMode)) {
    const wrong = row.explanation.optionAnalysis.filter((option) => !option.isCorrect);
    assert(wrong.length === 3, `${row.solveMode}: expected three wrong direct options`);
    assert(wrong.every((option) => realisticDirectIds.has(option.misconceptionId)), `${row.solveMode}: non-realistic direct misconception remains`);
    assert(new Set(wrong.map((option) => option.misconceptionId)).size === 3, `${row.solveMode}: direct distractors do not teach three distinct mistakes`);
    assert(wrong.every((option) => !forbiddenArtificialDirectIds.has(option.misconceptionId)), `${row.solveMode}: artificial direct distractor remains`);
    assert(wrong.every((option) => option.reason.includes(option.text)), `${row.solveMode}: direct-option reason does not name the selected value`);
    assert(wrong.every((option) => /=/.test(option.reason)), `${row.solveMode}: direct-option reason lacks a numerical check`);
    assert(wrong.every((option) => /convert|unit|seconds|minutes|km\/h|m\/s/i.test(option.reason)), `${row.solveMode}: direct-option reason does not explain the actual unit/conversion mistake`);
    assert(wrong.every((option) => !/nearby value|misread/i.test(option.reason)), `${row.solveMode}: artificial misread wording survived`);
    variedDirectStemCount += 1;
  }

  if (row.input.solveMode === "distanceFromSpeedAndTime") {
    assert(/km\/h/i.test(row.stem), "A trivial matching-unit distance question leaked into the learner review");
    const workingLines = row.explanation.working;
    const conversionIndex = workingLines.findIndex((line) => /convert|matching units|5\/18|m\/s|seconds/i.test(line) && /=/.test(line));
    const multiplicationIndex = workingLines.findIndex((line) => /distance.*(?:×|\\times)|speed.*(?:×|\\times).*time/i.test(line) && /=/.test(line));
    assert(conversionIndex >= 0, "Distance question does not show the required unit-conversion calculation");
    assert(multiplicationIndex > conversionIndex, "Distance calculation multiplies before converting units");
    assert(workingLines.length >= 4, "Distance question has no visible conversion before multiplication");
    nonTrivialDistanceRows += 1;
  }

  if (row.input.solveMode === "distanceByProportion") {
    assert(equals(scalarOption(row.answerText), multiply(row.input.targetSpeed, row.input.targetTime)), "distanceByProportion answer does not equal target speed × target time");
    assert(/distance|speed|time/i.test(row.explanation.keyRule), "distanceByProportion key rule omits the governing quantities");
    assert(row.explanation.stepByStepSolution.length <= 7, "distanceByProportion explanation is no longer clutter-free");
    assert(row.explanation.optionAnalysis.filter((option) => !option.isCorrect).every((option) => /=/.test(option.reason) && /distance|speed|time/i.test(option.reason)), "distanceByProportion wrong-option feedback lacks a concrete calculation or governing quantity");
    conciseProportionRows += 1;
  }

  if (row.input.solveMode === "timeByProportion") {
    assert(equals(scalarOption(row.answerText), divide(row.input.targetDistance, row.input.targetSpeed)), "timeByProportion answer does not equal target distance ÷ target speed");
    assert(/time|distance|speed/i.test(row.explanation.keyRule), "timeByProportion key rule omits the governing quantities");
    assert(row.explanation.stepByStepSolution.length <= 7, "timeByProportion explanation is no longer clutter-free");
    assert(row.explanation.optionAnalysis.filter((option) => !option.isCorrect).every((option) => /=/.test(option.reason) && /distance|speed|time/i.test(option.reason)), "timeByProportion wrong-option feedback lacks a concrete calculation or governing quantity");
    conciseProportionRows += 1;
  }

  if (row.input.solveMode === "speedByProportion") {
    assert(equals(scalarOption(row.answerText), divide(row.input.targetDistance, row.input.targetTime)), "speedByProportion answer does not equal distance ÷ new time");
    assert(/distance|speed|time/i.test(row.explanation.keyRule), "speedByProportion key rule omits the governing quantities");
    assert(row.explanation.stepByStepSolution.length <= 7, "speedByProportion explanation is no longer clutter-free");
    assert(row.explanation.optionAnalysis.filter((option) => !option.isCorrect).every((option) => /=/.test(option.reason) && /distance|speed|time|hour/i.test(option.reason)), "speedByProportion wrong-option feedback lacks a concrete calculation or governing quantity");
    conciseProportionRows += 1;
  }

  if (row.input.solveMode === "requiredUniformSpeedForDeadline") {
    assert(/available time/i.test(row.explanation.keyRule), "Deadline rule does not explain the available-time step");
    assert(!row.explanation.stepByStepSolution.some((line) => /\b(\d+(?:\.\d+)? hours)\s*=\s*\1\b/i.test(line)), "Deadline solution repeats an unchanged hour value");
    assert(row.options.every((option) => !/^\s*\d+\/\d+\s/.test(option)), "Deadline options contain an awkward numeric fraction");

    const absoluteDeadline = add(
      row.input.deadlineMinuteOfDay,
      multiply(rational(row.input.deadlineDayOffset), rational(1440)),
    );
    const availableHours = divide(
      subtract(absoluteDeadline, row.input.departureMinuteOfDay),
      rational(60),
    );
    const addHour = row.explanation.optionAnalysis.find((option) => option.misconceptionId === "ADD_ONE_HOUR_TO_INTERVAL");
    const dropHour = row.explanation.optionAnalysis.find((option) => option.misconceptionId === "DROP_ONE_HOUR_FROM_INTERVAL");
    assert(addHour, "Deadline row is missing the add-one-hour trap");
    assert(dropHour, "Deadline row is missing the drop-one-hour trap");
    assert(
      equals(scalarOption(addHour.text), divide(row.input.distance, add(availableHours, rational(1)))),
      "Deadline add-one-hour option does not equal distance divided by one extra hour",
    );
    assert(
      equals(scalarOption(dropHour.text), divide(row.input.distance, subtract(availableHours, rational(1)))),
      "Deadline drop-one-hour option does not equal distance divided by one fewer hour",
    );
    deadlineSemanticChecks += 2;
  }
}

assert(mathJaxStemCount === rows.length, "Not every learner stem contains MathJax quantities");
assert(fourTierCount === rows.length, "Not every row has the four-tier headers");
assert(fullOptionAnalysisCount === rows.length, "Not every row analyses all four options");
assert(variedDirectStemCount === 9, "Expected three review stems for each of the three direct modes");
assert(nonTrivialDistanceRows === 3, "Expected three non-trivial distance review rows");
assert(conciseProportionRows === 9, "Expected three concise rows for each proportionality authority");
assert(deadlineSemanticChecks === 6, "Expected two semantic deadline checks for each of three review rows");

for (const mode of directModes) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const stems = modeRows.map((row) => row.stem);
  assert(stems.length === 3, `${mode}: expected three review stems`);
  assert(new Set(stems.map((stem) => stem.split(" ").slice(0, 4).join(" "))).size >= 2, `${mode}: stem openings remain monotone`);
  assert(new Set(modeRows.map((row) => row.explanation.stepByStepSolution[0])).size === 3, `${mode}: teaching openings are not unique`);
}

for (const mode of proportionModes) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected three review rows`);
  assert(new Set(modeRows.map((row) => row.explanation.stepByStepSolution[0])).size === 3, `${mode}: explanations reuse the same teaching opening`);
}

for (const authorityId of new Set(rows.map((row) => row.provisionalAuthorityId))) {
  const authorityRows = rows.filter((row) => row.provisionalAuthorityId === authorityId);
  assert(new Set(authorityRows.map((row) => row.explanation.stepByStepSolution[0])).size === 3, `${authorityId}: review rows do not have three distinct teaching voices`);
}

const requestedDisc019 = generateCp001Candidate(
  "TSD-CP001-DISC-019",
  "review:TSD-CP001-DISC-019:6",
);
assert(equals(scalarOption(requestedDisc019.answerText), divide(requestedDisc019.input.targetDistance, requestedDisc019.input.targetTime)), "DISC-019:6 answer is not distance ÷ new time");
assert(requestedDisc019.explanation.stepByStepSolution.length <= 7, "DISC-019:6 learner explanation is not clutter-free");
assert(requestedDisc019.explanation.optionAnalysis.filter((option) => !option.isCorrect).every((option) => /=/.test(option.reason)), "DISC-019:6 wrong-option feedback lacks numerical checks");

console.log(JSON.stringify({
  status: "PASS",
  reviewRows: rows.length,
  mathJaxStemCount,
  fourTierCount,
  fullOptionAnalysisCount,
  directRowsWithRealisticOptionReasons: variedDirectStemCount,
  artificialDirectDistractors: 0,
  nonTrivialDistanceRows,
  conciseProportionRows,
  maximumProportionSteps: 7,
  uniqueTeachingVoicesPerAuthority: 3,
  requestedDisc019SeedVerified: true,
  deadlineSemanticChecks,
  internalCodeLeaks: 0,
  corruptedMathJaxTokens: 0,
  repeatedHourConversions: 0,
  awkwardDeadlineFractions: 0,
  permanentQlCount: 0,
}, null, 2));