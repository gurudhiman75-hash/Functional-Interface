import {
  absRational,
  add,
  compare,
  fromDecimalString,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "./foundation/rational";
import { formatClock, formatExamNumber } from "./cp001/runtime-support";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const MINUTES_PER_DAY = rational(1440);

function displayedMinutes(text: string): Rational {
  const suffix = " minutes";
  assert(text.endsWith(suffix), `Expected minutes option, received ${text}`);
  return fromDecimalString(text.slice(0, -suffix.length));
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review status changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");
assert(rows.every((row) => row.sourceQuestion.validation.valid), "A source question became structurally invalid");

const clockQuestions = rows
  .filter((row) => row.sourceCheckpointId === "TSD-CP-001")
  .map((row) => row.sourceQuestion as TsdCp001GeneratedQuestion)
  .filter((question) => (
    question.input.solveMode === "arrivalClockTime"
    || question.input.solveMode === "departureClockTime"
    || question.input.solveMode === "elapsedClockTime"
  ));

const arrivals = clockQuestions.filter((question) => question.input.solveMode === "arrivalClockTime");
const departures = clockQuestions.filter((question) => question.input.solveMode === "departureClockTime");
const elapsed = clockQuestions.filter((question) => question.input.solveMode === "elapsedClockTime");
assert(clockQuestions.length === 9, `Expected nine clock rows, received ${clockQuestions.length}`);
assert(arrivals.length === 3, `Expected three arrival rows, received ${arrivals.length}`);
assert(departures.length === 3, `Expected three departure rows, received ${departures.length}`);
assert(elapsed.length === 3, `Expected three elapsed rows, received ${elapsed.length}`);

let copiedClockOptions = 0;
let elapsedOffsetOptions = 0;

for (const question of [...arrivals, ...departures]) {
  assert(
    question.input.solveMode === "arrivalClockTime" || question.input.solveMode === "departureClockTime",
    `${question.questionLanguageId}: mode narrowing failed`,
  );
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);
  let rowCopies = 0;

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception mismatch for ${audit.text}`);
    assert(audit.misconceptionId !== "USE_GIVEN_DURATION_AS_ANSWER", `${question.questionLanguageId}: false duration label remains`);
    if (audit.misconceptionId !== "COPY_GIVEN_CLOCK_TIME") return;

    rowCopies += 1;
    copiedClockOptions += 1;
    if (question.input.solveMode === "arrivalClockTime") {
      const departure = formatClock(question.input.departureMinuteOfDay, 0n);
      assert(audit.text === departure, `${question.questionLanguageId}: copied option is not the departure time`);
      const required = [
        "copies the departure clock time",
        `${formatExamNumber(question.input.durationMinutes)}-minute journey`,
        `${departure} + ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}`,
      ];
      for (const fragment of required) {
        assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: copied-clock reason omits ${fragment}`);
      }
    } else {
      const arrival = formatClock(question.input.arrivalMinuteOfDay, question.input.arrivalDayOffset);
      assert(audit.text === arrival, `${question.questionLanguageId}: copied option is not the arrival time`);
      const required = [
        "copies the arrival clock time",
        `${formatExamNumber(question.input.durationMinutes)}-minute journey`,
        `${arrival} − ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}`,
      ];
      for (const fragment of required) {
        assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: copied-clock reason omits ${fragment}`);
      }
    }
  });

  assert(rowCopies === 1, `${question.questionLanguageId}: expected one copied-clock option, received ${rowCopies}`);
}

for (const question of elapsed) {
  assert(question.input.solveMode === "elapsedClockTime", `${question.questionLanguageId}: elapsed mode narrowing failed`);
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${question.questionLanguageId}: audit-analysis length mismatch`);
  const absoluteArrival = add(
    question.input.arrivalMinuteOfDay,
    multiply(rational(question.input.arrivalDayOffset), MINUTES_PER_DAY),
  );
  const exactElapsed = subtract(absoluteArrival, question.input.departureMinuteOfDay);
  const departure = formatClock(question.input.departureMinuteOfDay, 0n);
  const arrival = formatClock(question.input.arrivalMinuteOfDay, question.input.arrivalDayOffset);
  let rowOffsets = 0;

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${question.questionLanguageId}: option text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: misconception mismatch for ${audit.text}`);
    assert(audit.misconceptionId !== "MISREAD_TIME", `${question.questionLanguageId}: generic MISREAD_TIME remains`);
    if (audit.misconceptionId !== "ARITHMETIC_OFFSET") return;

    rowOffsets += 1;
    elapsedOffsetOptions += 1;
    const proposed = displayedMinutes(audit.text);
    const offset = absRational(subtract(proposed, exactElapsed));
    const direction = compare(proposed, exactElapsed) > 0 ? "above" : "below";
    const required = [
      `exact interval from ${departure} to ${arrival} is ${question.answerText}`,
      `${toMixedString(offset)} minutes ${direction}`,
    ];
    for (const fragment of required) {
      assert(analysis.reason.includes(fragment), `${question.questionLanguageId}: elapsed-offset reason omits ${fragment}`);
    }
  });

  assert(rowOffsets === 1, `${question.questionLanguageId}: expected one elapsed arithmetic offset, received ${rowOffsets}`);
}

assert(copiedClockOptions === 6, `Expected six copied-clock options, received ${copiedClockOptions}`);
assert(elapsedOffsetOptions === 3, `Expected three elapsed arithmetic offsets, received ${elapsedOffsetOptions}`);

const regressions = [
  { answer: "12:00 AM next day", option: "10:30 PM", phrase: "10:30 PM + 90 minutes" },
  { answer: "11:20 PM", option: "2:25 AM next day", phrase: "2:25 AM next day − 185 minutes" },
  { answer: "185 minutes", option: "215 minutes", phrase: "30 minutes above" },
] as const;

for (const regression of regressions) {
  const question = clockQuestions.find((candidate) => candidate.answerText === regression.answer && candidate.options.includes(regression.option));
  assert(question, `Missing regression ${regression.option} / ${regression.answer}`);
  const index = question.options.indexOf(regression.option);
  assert(index >= 0, `Missing regression option ${regression.option}`);
  const analysis = question.explanation.optionAnalysis[index];
  assert(analysis.reason.includes(regression.phrase), `${regression.option}: reason omits ${regression.phrase}`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  arrivalRows: arrivals.length,
  departureRows: departures.length,
  elapsedRows: elapsed.length,
  correctedCopiedClockOptions: copiedClockOptions,
  correctedElapsedOffsetOptions: elapsedOffsetOptions,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
