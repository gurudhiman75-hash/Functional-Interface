import {
  divide,
  f,
  formatFraction,
  formatRatio,
  reciprocal,
  subtract,
  type Fraction,
} from "./cp002/fraction";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function percentText(value: Fraction): string {
  return `${formatFraction(value)}%`;
}

function speedText(value: Fraction): string {
  return `${formatFraction(value)} km/h`;
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 final records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Final learner-authority coverage changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-001").length === 80, "CP-001 row count changed");
assert(rows.filter((row) => row.sourceCheckpointId === "TSD-CP-002").length === 73, "CP-002 row count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review lock changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");

const cp002Rows = rows.filter((row) => row.sourceCheckpointId === "TSD-CP-002");
let correctedShareCount = 0;
let correctedRatioCount = 0;
let correctedRemainingSpeedCount = 0;

for (const record of cp002Rows) {
  const question = record.sourceQuestion as TsdCp002GeneratedQuestion;
  assert(question.optionAudit.length === question.explanation.optionAnalysis.length, `${record.questionLanguageId}: audit and analysis lengths differ`);

  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === analysis.text, `${record.questionLanguageId}: option text drift at ${index}`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${record.questionLanguageId}: misconception ID drift at ${audit.text}`);
    assert(analysis.reason.includes(audit.text), `${record.questionLanguageId}: reason does not name ${audit.text}`);

    if (
      question.input.mode === "unknownSegmentShareFromAverage"
      && question.solution.answerKind === "PERCENT"
      && !audit.isCorrect
    ) {
      const complement = percentText(subtract(f(100), question.solution.value));
      if (audit.misconceptionId === "USE_COMPLEMENT") {
        assert(audit.text === complement, `${record.questionLanguageId}: ${audit.text} is labelled complement, but complement is ${complement}`);
      }
      if (audit.misconceptionId === "UNSUPPORTED_SHARE_VALUE") {
        correctedShareCount += 1;
        assert(audit.text !== complement, `${record.questionLanguageId}: true complement was relabelled unsupported`);
        assert(analysis.reason.includes(complement), `${record.questionLanguageId}: corrected share reason omits true complement ${complement}`);
      }
    }

    if (
      question.input.mode === "segmentRatioFromAverageAndSpeeds"
      && question.solution.answerKind === "RATIO"
      && !audit.isCorrect
    ) {
      const reversed = formatRatio(reciprocal(question.solution.value));
      if (audit.misconceptionId === "REVERSE_RATIO") {
        assert(audit.text === reversed, `${record.questionLanguageId}: ${audit.text} is labelled reversed, but reverse is ${reversed}`);
      }
      if (audit.misconceptionId === "UNSUPPORTED_RATIO_VALUE") {
        correctedRatioCount += 1;
        assert(audit.text !== reversed, `${record.questionLanguageId}: true reverse ratio was relabelled unsupported`);
        assert(analysis.reason.includes(reversed), `${record.questionLanguageId}: corrected ratio reason omits true reverse ${reversed}`);
      }
    }

    if (
      question.input.mode === "requiredRemainingSpeedForTargetAverage"
      && question.solution.answerKind === "SPEED"
      && !audit.isCorrect
    ) {
      const targetAverage = speedText(question.input.targetAverageKmph);
      if (audit.misconceptionId === "COPY_TARGET_AVERAGE") {
        assert(audit.text === targetAverage, `${record.questionLanguageId}: ${audit.text} is labelled copied target average, but target is ${targetAverage}`);
      }
      if (audit.misconceptionId === "DIVIDE_REMAINING_DISTANCE_BY_COMPLETED_TIME") {
        correctedRemainingSpeedCount += 1;
        const remainingDistance = subtract(question.input.totalDistanceKm, question.input.completedDistanceKm);
        const mistakenSpeed = speedText(divide(remainingDistance, question.input.completedTimeHours));
        assert(audit.text === mistakenSpeed, `${record.questionLanguageId}: completed-time diagnosis should produce ${mistakenSpeed}, received ${audit.text}`);
        assert(analysis.reason.includes(formatFraction(remainingDistance)), `${record.questionLanguageId}: corrected remaining-speed reason omits remaining distance`);
        assert(analysis.reason.includes(formatFraction(question.input.completedTimeHours)), `${record.questionLanguageId}: corrected remaining-speed reason omits completed time`);
      }
    }
  });
}

assert(correctedShareCount >= 2, `Expected at least two corrected false-complement diagnoses, received ${correctedShareCount}`);
assert(correctedRatioCount >= 2, `Expected at least two corrected false-reverse diagnoses, received ${correctedRatioCount}`);
assert(correctedRemainingSpeedCount >= 1, `Expected at least one corrected remaining-speed diagnosis, received ${correctedRemainingSpeedCount}`);

function findOption(
  authorityKey: string,
  answerText: string,
  optionText: string,
): { readonly question: TsdCp002GeneratedQuestion; readonly optionIndex: number } {
  const record = cp002Rows.find((candidate) => (
    candidate.finalAuthorityKey === authorityKey
    && candidate.sourceQuestion.answerText === answerText
    && candidate.sourceQuestion.options.includes(optionText)
  ));
  assert(record, `Missing regression row ${authorityKey} / ${answerText} / ${optionText}`);
  const question = record.sourceQuestion as TsdCp002GeneratedQuestion;
  const optionIndex = question.options.indexOf(optionText);
  assert(optionIndex >= 0, `Missing regression option ${optionText}`);
  return { question, optionIndex };
}

const regressions = [
  ["unknownDistanceShareFromAverageSpeed", "50%", "60%", "UNSUPPORTED_SHARE_VALUE"],
  ["unknownTimeShareFromAverageSpeed", "25%", "50%", "UNSUPPORTED_SHARE_VALUE"],
  ["distanceRatioFromAverageAndSpeeds", "1:1", "2:1", "UNSUPPORTED_RATIO_VALUE"],
  ["timeRatioFromAverageAndSpeeds", "1:3", "1:2", "UNSUPPORTED_RATIO_VALUE"],
  ["requiredRemainingSpeedForTargetAverage", "60 km/h", "90 km/h", "DIVIDE_REMAINING_DISTANCE_BY_COMPLETED_TIME"],
] as const;

for (const [authorityKey, answerText, optionText, expectedId] of regressions) {
  const { question, optionIndex } = findOption(authorityKey, answerText, optionText);
  assert(question.optionAudit[optionIndex].misconceptionId === expectedId, `${authorityKey}: ${optionText} retained a false diagnosis`);
  assert(question.explanation.optionAnalysis[optionIndex].misconceptionId === expectedId, `${authorityKey}: analysis ID for ${optionText} differs from audit`);
}

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  cp001Rows: rows.filter((row) => row.sourceCheckpointId === "TSD-CP-001").length,
  cp002Rows: cp002Rows.length,
  correctedFalseComplements: correctedShareCount,
  correctedFalseReverseRatios: correctedRatioCount,
  correctedRemainingSpeedDiagnoses: correctedRemainingSpeedCount,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
