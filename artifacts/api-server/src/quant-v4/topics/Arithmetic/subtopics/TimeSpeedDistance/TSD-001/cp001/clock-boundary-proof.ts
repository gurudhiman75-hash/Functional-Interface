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
let faithfulExtraHalfHourTraps = 0;

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
    assert(row.explanation.stepByStepSolution.length >= 9, `${mode}: boundary explanation is too short`);
    const visible = [
      row.stem,
      ...row.explanation.stepByStepSolution,
      row.explanation.examSpeedShortcut,
    ].join(" ");
    const boundary = absoluteMinute(row);

    if (row.solveMode === "arrivalClockTime" || row.solveMode === "departureClockTime") {
      const boundaryTrap = row.explanation.optionAnalysis.find(
        (option) => option.misconceptionId === "IGNORE_CLOCK_ROLLOVER",
      );
      assert(boundaryTrap, `${mode}: boundary rollover trap is missing`);
      assert(/AM\/PM|calendar day|wrong day|day rollover|midnight|noon/i.test(boundaryTrap.reason), `${mode}: rollover option is not explained as an AM/PM or day error`);
      faithfulBoundaryTraps += 1;
    } else {
      const extraHalfHour = row.explanation.optionAnalysis.find(
        (option) => option.misconceptionId === "MISREAD_TIME" && /extra 30 minutes/i.test(option.reason),
      );
      assert(extraHalfHour, "elapsedClockTime: extra-half-hour trap is missing");
      assert(/extra 30 minutes|do not occur anywhere/i.test(extraHalfHour.reason), "elapsedClockTime: extra-half-hour trap has a generic explanation");
      faithfulExtraHalfHourTraps += 1;
    }

    if (boundary === 720n) {
      noonRows += 1;
      assert(/12 noon|12:00 PM/i.test(visible), `${mode}: noon is not named explicitly`);
      assert(/not 12 midnight|not midnight|AM changes to PM|PM back to AM/i.test(visible), `${mode}: noon AM/PM distinction is not taught`);
    } else if (boundary === 1440n) {
      midnightRows += 1;
      assert(/12:00 AM/i.test(visible), `${mode}: exact midnight is not shown as 12:00 AM`);
      assert(/midnight/i.test(visible), `${mode}: midnight is not named explicitly`);
      assert(/next day|previous evening/i.test(visible), `${mode}: midnight day rollover is not explained`);
    } else if (boundary === 1585n) {
      laterNextDayRows += 1;
      assert(/midnight/i.test(visible), `${mode}: later next-day row does not split at midnight`);
      assert(/next day|previous evening/i.test(visible), `${mode}: later next-day rollover is not explained`);
    }
  }
}

assert(clockRows === 9, "Expected nine clock review rows");
assert(noonRows === 3, "Expected one noon row per clock authority");
assert(midnightRows === 3, "Expected one midnight row per clock authority");
assert(laterNextDayRows === 3, "Expected one later next-day row per clock authority");
assert(faithfulBoundaryTraps === 6, "Expected one faithful boundary trap for each arrival/departure row");
assert(faithfulExtraHalfHourTraps === 3, "Expected one faithful extra-half-hour trap for each elapsed row");

console.log(JSON.stringify({
  status: "PASS",
  clockModes: CLOCK_MODES.length,
  clockReviewRows: clockRows,
  exactNoonRows: noonRows,
  exactMidnightRows: midnightRows,
  laterNextDayRows,
  faithfulBoundaryTraps,
  faithfulExtraHalfHourTraps,
  permanentQlCount: 0,
}, null, 2));
