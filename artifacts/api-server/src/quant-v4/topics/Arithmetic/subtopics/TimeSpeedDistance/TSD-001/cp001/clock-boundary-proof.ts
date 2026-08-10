import { add, multiply, rational, type Rational } from "../foundation/rational";
import type { TsdCp001GeneratedQuestion } from "./runtime-types";
import { generateCp001ReviewRows } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const CLOCK_MODES = ["arrivalClockTime", "departureClockTime", "elapsedClockTime"] as const;

function absoluteArrival(row: TsdCp001GeneratedQuestion): Rational {
  switch (row.input.solveMode) {
    case "arrivalClockTime":
      return add(row.input.departureMinuteOfDay, row.input.durationMinutes);
    case "departureClockTime":
    case "elapsedClockTime":
      return add(
        row.input.arrivalMinuteOfDay,
        multiply(rational(row.input.arrivalDayOffset), rational(1440)),
      );
    default:
      throw new Error(`${row.solveMode}: expected a clock row`);
  }
}

function absoluteMinute(row: TsdCp001GeneratedQuestion): bigint {
  const value = absoluteArrival(row);
  assert(value.denominator === 1n, `${row.solveMode}: clock boundary is not a whole minute`);
  return value.numerator;
}

const rows = generateCp001ReviewRows(3);
let noonRows = 0;
let midnightRows = 0;
let laterNextDayRows = 0;
let clockRows = 0;
let faithfulBoundaryTraps = 0;
let elapsedMistakeChecks = 0;

for (const mode of CLOCK_MODES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected exactly three review rows`);
  const boundaries = new Set(modeRows.map(absoluteMinute));
  assert(boundaries.size === 3, `${mode}: duplicate clock-boundary states survived`);
  assert(boundaries.has(720n), `${mode}: exact 12 noon state is missing`);
  assert(boundaries.has(1440n), `${mode}: exact 12 midnight state is missing`);
  assert(boundaries.has(1585n), `${mode}: later next-day state is missing`);

  for (const row of modeRows) {
    clockRows += 1;
    assert(row.validation.valid, `${mode}: invalid generated row: ${row.validation.errors.join("; ")}`);
    assert(row.explanation.stepByStepSolution.length >= 6, `${mode}: boundary explanation is too short`);
    assert(row.explanation.stepByStepSolution.length <= 7, `${mode}: boundary explanation is no longer clutter-free`);
    assert(row.explanation.optionAnalysis.length === 4, `${mode}: incomplete option analysis`);
    assert(row.explanation.optionAnalysis.every((option) => option.reason.includes(option.text)), `${mode}: option feedback does not name the selected value`);
    assert(row.explanation.optionAnalysis.filter((option) => !option.isCorrect).every((option) => /=/.test(option.reason)), `${mode}: a clock distractor has no numerical check`);

    const visible = [
      row.stem,
      row.explanation.keyRule,
      ...row.explanation.stepByStepSolution,
      row.explanation.examSpeedShortcut,
    ].join(" ");
    const boundary = absoluteMinute(row);

    if (row.solveMode === "arrivalClockTime" || row.solveMode === "departureClockTime") {
      const boundaryTrap = row.explanation.optionAnalysis.find(
        (option) => option.misconceptionId === "IGNORE_CLOCK_ROLLOVER",
      );
      assert(boundaryTrap, `${mode}: boundary rollover trap is missing`);
      assert(/AM\/PM|calendar day|wrong day|day rollover|midnight|noon|clock/i.test(boundaryTrap.reason), `${mode}: rollover option is not explained as a clock/day error`);
      assert(/=/.test(boundaryTrap.reason), `${mode}: rollover option has no numerical check`);
      faithfulBoundaryTraps += 1;
    } else {
      const wrong = row.explanation.optionAnalysis.filter((option) => !option.isCorrect);
      assert(wrong.length === 3, "elapsedClockTime: expected three wrong options");
      assert(wrong.every((option) => /=/.test(option.reason)), "elapsedClockTime: a wrong option has no numerical check");
      assert(wrong.some((option) => /30 minutes|half[- ]hour|clock|time/i.test(option.reason)), "elapsedClockTime: no realistic clock/time mistake is explained");
      elapsedMistakeChecks += 1;
    }

    if (boundary === 720n) {
      noonRows += 1;
      assert(/12 noon|12:00 PM|\bnoon\b/i.test(visible), `${mode}: noon is not named explicitly`);
    } else if (boundary === 1440n) {
      midnightRows += 1;
      assert(/12:00 AM|\bmidnight\b/i.test(visible), `${mode}: exact midnight is not identified`);
      assert(/next day|previous evening|midnight/i.test(visible), `${mode}: midnight rollover context is missing`);
    } else if (boundary === 1585n) {
      laterNextDayRows += 1;
      assert(/next day|midnight/i.test(visible), `${mode}: later next-day rollover is not explained`);
    }
  }
}

assert(clockRows === 9, "Expected nine clock review rows");
assert(noonRows === 3, "Expected one noon row per clock authority");
assert(midnightRows === 3, "Expected one midnight row per clock authority");
assert(laterNextDayRows === 3, "Expected one later next-day row per clock authority");
assert(faithfulBoundaryTraps === 6, "Expected one faithful boundary trap for each arrival/departure row");
assert(elapsedMistakeChecks === 3, "Expected realistic elapsed-time mistake feedback for each elapsed row");

console.log(JSON.stringify({
  status: "PASS",
  clockModes: CLOCK_MODES.length,
  clockReviewRows: clockRows,
  exactNoonRows: noonRows,
  exactMidnightRows: midnightRows,
  laterNextDayRows,
  faithfulBoundaryTraps,
  elapsedMistakeChecks,
  maximumLearnerSteps: 7,
  permanentQlCount: 0,
}, null, 2));
