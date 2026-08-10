import { TSD_CP001_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import {
  answerUnitReviewBucket,
  answerUnitReviewTargets,
} from "./answer-unit-review";
import {
  TSD_CP001_LEARNER_AUTHORITIES,
  generateCp001ReviewRows,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp001ReviewRows(3);
assert(TSD_CP001_DISCOVERY_AUTHORITIES.length === 25, "Answer-unit audit changed the authority count");
assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Answer-unit audit changed the learner-mode count");
assert(rows.length === 69, "Answer-unit audit changed the review-row boundary");
assert(rows.every((row) => row.validation.valid), "Answer-unit audit exported an invalid row");

const auditedModes = [
  "convertDistanceUnit",
  "convertTimeUnit",
  "speedFromMixedUnits",
  "speedFromPace",
  "paceFromSpeed",
  "distanceFromPaceAndTime",
] as const;

const bucketSummary: Record<string, Record<string, number>> = {};
for (const mode of auditedModes) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected three review rows`);
  const counts: Record<string, number> = {};
  for (const row of modeRows) {
    const bucket = answerUnitReviewBucket(row);
    assert(bucket, `${mode}: answer-unit bucket is missing`);
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }
  for (const target of answerUnitReviewTargets(mode, 3)) {
    assert(counts[target.bucket] === target.count, `${mode}: expected ${target.bucket}:${target.count}, received ${counts[target.bucket] ?? 0}`);
  }
  bucketSummary[mode] = counts;
}

const mixedRows = rows.filter((row) => row.solveMode === "speedFromMixedUnits");
assert(
  new Set(mixedRows.map((row) => row.input.solveMode === "speedFromMixedUnits" ? row.input.outputUnit : "")).size === 3,
  "speedFromMixedUnits: km/h, m/s and m/min are not all represented",
);

const speedFromPaceRows = rows.filter((row) => row.solveMode === "speedFromPace");
const mpsPaceRow = speedFromPaceRows.find(
  (row) => row.input.solveMode === "speedFromPace" && row.input.outputUnit === "MPS",
);
assert(mpsPaceRow, "speedFromPace: m/s answer row is missing");
assert(mpsPaceRow.input.solveMode === "speedFromPace" && mpsPaceRow.input.paceUnit === "SECOND_PER_KM", "speedFromPace: m/s row must use seconds per km");
assert(/m\/s$/.test(mpsPaceRow.answerText), "speedFromPace: m/s answer label is missing");
assert(mpsPaceRow.explanation.working.some((line) => /1000/.test(line) && /÷/.test(line)), "speedFromPace: 1000 metres ÷ seconds working is missing");
const mpsPaceReasons = mpsPaceRow.explanation.optionAnalysis.map((option) => option.reason).join(" ");
assert(/1000 metres|seconds per kilometre|distance must be divided by time/i.test(mpsPaceReasons), "speedFromPace: m/s option diagnoses do not teach the actual unit path");
assert(!/minutes per kilometre as kilometres per hour|60 ÷ speed/i.test(mpsPaceReasons), "speedFromPace: minute-based diagnosis leaked into seconds/km row");

const paceFromSpeedRows = rows.filter((row) => row.solveMode === "paceFromSpeed");
const secondsPaceRow = paceFromSpeedRows.find(
  (row) => row.input.solveMode === "paceFromSpeed" && row.input.outputUnit === "SECOND_PER_KM",
);
assert(secondsPaceRow, "paceFromSpeed: seconds/km answer row is missing");
assert(secondsPaceRow.input.solveMode === "paceFromSpeed" && secondsPaceRow.input.speedUnit === "MPS", "paceFromSpeed: seconds/km row must start from m/s");
assert(/seconds\/km$/.test(secondsPaceRow.answerText), "paceFromSpeed: seconds/km answer label is missing");
assert(secondsPaceRow.explanation.working.some((line) => /1000/.test(line) && /÷/.test(line)), "paceFromSpeed: 1000 metres ÷ m/s working is missing");
const secondsPaceReasons = secondsPaceRow.explanation.optionAnalysis.map((option) => option.reason).join(" ");
assert(/1000 metres|one-kilometre distance/i.test(secondsPaceReasons), "paceFromSpeed: seconds/km option diagnoses do not teach the one-kilometre distance");
assert(!/60 ÷ speed|minutes needed for one kilometre/i.test(secondsPaceReasons), "paceFromSpeed: minute-based diagnosis leaked into seconds/km row");

const distanceFromPaceRows = rows.filter((row) => row.solveMode === "distanceFromPaceAndTime");
const metreDistanceRow = distanceFromPaceRows.find(
  (row) => row.input.solveMode === "distanceFromPaceAndTime" && row.input.outputUnit === "M",
);
assert(metreDistanceRow, "distanceFromPaceAndTime: metre answer row is missing");
assert(/ m$/.test(metreDistanceRow.answerText), "distanceFromPaceAndTime: metre answer label is missing");
assert(metreDistanceRow.explanation.working.some((line) => /× 1000/.test(line)), "distanceFromPaceAndTime: km to metre conversion is missing");
assert(metreDistanceRow.optionAudit.some((option) => option.misconceptionId === "OMIT_UNIT_CONVERSION"), "distanceFromPaceAndTime: omitted-output-conversion trap is missing");
const omittedConversionReason = metreDistanceRow.explanation.optionAnalysis.find(
  (option) => option.misconceptionId === "OMIT_UNIT_CONVERSION",
)?.reason ?? "";
assert(/kilometre|\bkm\b/i.test(omittedConversionReason) && /1000/.test(omittedConversionReason), "distanceFromPaceAndTime: omitted km-to-m conversion is not explained precisely");
assert(!/minutes per kilometre/i.test(metreDistanceRow.explanation.optionAnalysis.map((option) => option.reason).join(" ")), "distanceFromPaceAndTime: minute-based diagnosis leaked into seconds-based metre row");

const distanceConversionRows = rows.filter((row) => row.solveMode === "convertDistanceUnit");
assert(distanceConversionRows.some((row) => row.input.solveMode === "convertDistanceUnit" && (row.input.from === "MM" || row.input.to === "MM")), "convertDistanceUnit: millimetre edge is missing");
assert(distanceConversionRows.some((row) => row.input.solveMode === "convertDistanceUnit" && (row.input.from === "KM" || row.input.to === "KM")), "convertDistanceUnit: kilometre edge is missing");

const timeConversionRows = rows.filter((row) => row.solveMode === "convertTimeUnit");
assert(timeConversionRows.some((row) => row.input.solveMode === "convertTimeUnit" && (row.input.from === "DAY" || row.input.to === "DAY")), "convertTimeUnit: day-scale edge is missing");
assert(timeConversionRows.some((row) => row.input.solveMode === "convertTimeUnit" && (row.input.from === "SECOND" || row.input.to === "SECOND")), "convertTimeUnit: second-scale edge is missing");

const directDistanceRows = rows.filter((row) => row.solveMode === "distanceFromSpeedAndTime");
const directSpeedRows = rows.filter((row) => row.solveMode === "speedFromDistanceAndTime");
const directTimeRows = rows.filter((row) => row.solveMode === "timeFromDistanceAndSpeed");
assert(directDistanceRows.every((row) => / m$/.test(row.answerText)), "Canonical direct-distance surface must remain metres");
assert(directSpeedRows.every((row) => / m\/s$/.test(row.answerText)), "Canonical direct-speed surface must remain m/s");
assert(directTimeRows.every((row) => / seconds?$/.test(row.answerText)), "Canonical direct-time surface must remain seconds");

const deadlineRows = rows.filter((row) => row.solveMode === "requiredUniformSpeedForDeadline");
assert(deadlineRows.every((row) => row.input.solveMode === "requiredUniformSpeedForDeadline" && row.input.outputUnit === "KMPH"), "Deadline questions must retain the natural km/h clock context");

const learnerText = rows.map((row) => [
  row.stem,
  row.answerText,
  ...row.options,
  row.explanation.keyRule,
  ...row.explanation.stepByStepSolution,
  row.explanation.examSpeedShortcut,
  ...row.explanation.optionAnalysis.map((option) => option.reason),
  row.explanation.conclusion,
].join(" ")).join(" ");
assert(!/km\/h kilometres|m\/s metres|seconds\/km seconds|minutes\/km minutes/i.test(learnerText), "Duplicated unit noun leaked into learner explanation");
assert(rows.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "Answer-unit audit introduced duplicate options");
assert(rows.every((row) => row.answerText === row.options[row.correctIndex]), "Answer-unit audit introduced an answer-key mismatch");

console.log(JSON.stringify({
  status: "PASS",
  decision: "NATURAL_UNIT_EDGES_WITHOUT_NEW_AUTHORITIES",
  provisionalAuthorityCount: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  learnerFacingAuthorityCount: TSD_CP001_LEARNER_AUTHORITIES.length,
  reviewRowCount: rows.length,
  bucketSummary,
  canonicalDirectUnits: {
    distance: "m",
    speed: "m/s",
    time: "seconds",
  },
  deadlineUnit: "km/h",
  unitAwarePaceDiagnoses: true,
  duplicatedUnitNounLeaks: 0,
  addedNaturalEdges: [
    "mixed speed in km/h, m/s and m/min",
    "speed from seconds/km into m/s",
    "pace from m/s into seconds/km",
    "pace-derived distance in metres",
    "day-scale time conversion",
    "millimetre-scale distance conversion",
  ],
  permanentQlCount: 0,
}, null, 2));
