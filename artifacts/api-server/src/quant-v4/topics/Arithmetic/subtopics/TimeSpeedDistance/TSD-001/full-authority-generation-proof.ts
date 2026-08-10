import {
  generateCp001Candidate,
  TSD_CP001_LEARNER_AUTHORITIES,
} from "./cp001/runtime";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import { TSD_CP002_LEARNER_AUTHORITIES } from "./cp002/discovery-registry";
import { generateCp002Candidate } from "./cp002/public-runtime";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { examDifficultyLabel } from "./difficulty-calibration";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function cp001FinalAuthorityKey(question: TsdCp001GeneratedQuestion): string {
  if (question.solveMode === "distanceByProportion") return "referenceTripDistanceAtChangedConditions";
  if (question.solveMode === "timeByProportion") return "referenceTripTimeAtChangedConditions";
  return question.solveMode;
}

function cp002FinalAuthorityKey(question: TsdCp002GeneratedQuestion): string {
  switch (question.solveMode) {
    case "totalDistanceFromAverageAndTime": return "distanceFromSpeedAndTime";
    case "unknownSegmentShareFromAverage":
      return question.authoritySubmode === "DISTANCE_SHARE"
        ? "unknownDistanceShareFromAverageSpeed"
        : "unknownTimeShareFromAverageSpeed";
    case "segmentRatioFromAverageAndSpeeds":
      return question.authoritySubmode === "DISTANCE_RATIO"
        ? "distanceRatioFromAverageAndSpeeds"
        : "timeRatioFromAverageAndSpeeds";
    case "roundTripTimeFromOneWayDistance": return "roundTripLegTimeSum";
    default: return question.solveMode;
  }
}

function assertQuestion(question: TsdCp001GeneratedQuestion | TsdCp002GeneratedQuestion): number {
  assert(question.validation.valid, `${question.questionLanguageId}: ${question.validation.errors.join("; ")}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionLanguageId}: options are not unique`);
  assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: answer key differs`);
  assert(question.optionAudit.filter((option) => option.isCorrect).length === 1, `${question.questionLanguageId}: option audit has the wrong correct count`);
  assert(question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: option analysis is incomplete`);
  assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains uncalibrated`);
  assert(question.difficulty.label === examDifficultyLabel(question.solveMode, question.input), `${question.questionLanguageId}: difficulty conflicts with exam-family rubric`);
  assert(question.lifecycle.englishFreezeStatus === "UNFROZEN", `${question.questionLanguageId}: English was frozen`);
  assert(question.lifecycle.questionBankStatus === "NOT_STORED", `${question.questionLanguageId}: Question Bank storage was enabled`);
  assert(question.lifecycle.testEligibility === "INELIGIBLE", `${question.questionLanguageId}: test delivery was enabled`);
  assert(question.lifecycle.publiclyPublishable === false && question.publiclyPublishable === false, `${question.questionLanguageId}: publication was enabled`);

  let wrong = 0;
  question.optionAudit.forEach((audit, index) => {
    const analysis = question.explanation.optionAnalysis[index];
    assert(audit.text === question.options[index], `${question.questionLanguageId}: option-audit text mismatch`);
    assert(audit.text === analysis.text, `${question.questionLanguageId}: audit-analysis text mismatch`);
    assert(audit.misconceptionId === analysis.misconceptionId, `${question.questionLanguageId}: audit-analysis ID mismatch`);
    assert(audit.isCorrect === analysis.isCorrect, `${question.questionLanguageId}: audit-analysis correctness mismatch`);
    assert(analysis.reason.includes(audit.text), `${question.questionLanguageId}: reason omits ${audit.text}`);
    assert(hasTsdCalculationEvidence(withoutDisplayedOption(analysis.reason, audit.text)), `${question.questionLanguageId}: ${audit.text} lacks calculation evidence`);
    if (!audit.isCorrect) wrong += 1;
  });
  return wrong;
}

const seedsPerDiscoveryAuthority = 20;
const discoveryAuthorities = TSD_CP001_LEARNER_AUTHORITIES.length + TSD_CP002_LEARNER_AUTHORITIES.length;
assert(discoveryAuthorities === 37, `Expected 37 discovery authorities, received ${discoveryAuthorities}`);
assert(TSD_FINAL_LEARNER_AUTHORITIES.length === 38, `Expected 38 final learner authorities, received ${TSD_FINAL_LEARNER_AUTHORITIES.length}`);

let cp001Questions = 0;
let cp002Questions = 0;
let wrongReasons = 0;
const fingerprints = new Set<string>();
const discoveryAuthorityCounts = new Map<string, number>();
const generatedFinalAuthorityKeys = new Set<string>();

for (const authority of TSD_CP001_LEARNER_AUTHORITIES) {
  for (let index = 0; index < seedsPerDiscoveryAuthority; index += 1) {
    const question = generateCp001Candidate(authority.provisionalId, `full-authority:cp001:${authority.provisionalId}:${index}`);
    wrongReasons += assertQuestion(question);
    fingerprints.add(question.mathematicalFingerprint);
    discoveryAuthorityCounts.set(authority.provisionalId, (discoveryAuthorityCounts.get(authority.provisionalId) ?? 0) + 1);
    generatedFinalAuthorityKeys.add(cp001FinalAuthorityKey(question));
    cp001Questions += 1;
  }
}

for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  for (let index = 0; index < seedsPerDiscoveryAuthority; index += 1) {
    const question = generateCp002Candidate(authority.provisionalId, `full-authority:cp002:${authority.provisionalId}:${index}`);
    wrongReasons += assertQuestion(question);
    fingerprints.add(question.mathematicalFingerprint);
    discoveryAuthorityCounts.set(authority.provisionalId, (discoveryAuthorityCounts.get(authority.provisionalId) ?? 0) + 1);
    generatedFinalAuthorityKeys.add(cp002FinalAuthorityKey(question));
    cp002Questions += 1;
  }
}

const questions = cp001Questions + cp002Questions;
assert(questions === discoveryAuthorities * seedsPerDiscoveryAuthority, `Expected ${discoveryAuthorities * seedsPerDiscoveryAuthority} questions, received ${questions}`);
assert(wrongReasons === questions * 3, `Expected ${questions * 3} wrong reasons, received ${wrongReasons}`);
assert(discoveryAuthorityCounts.size === discoveryAuthorities, `Expected ${discoveryAuthorities} discovery buckets, received ${discoveryAuthorityCounts.size}`);
for (const [authority, count] of discoveryAuthorityCounts) {
  assert(count === seedsPerDiscoveryAuthority, `${authority}: expected ${seedsPerDiscoveryAuthority} questions, received ${count}`);
}
assert(fingerprints.size >= discoveryAuthorities * 3, `Mathematical profile diversity is too low: ${fingerprints.size}`);

const expectedFinalAuthorityKeys = new Set(TSD_FINAL_LEARNER_AUTHORITIES.map((authority) => authority.authorityKey));
assert(generatedFinalAuthorityKeys.size === expectedFinalAuthorityKeys.size, `Generated final-authority coverage is ${generatedFinalAuthorityKeys.size}, expected ${expectedFinalAuthorityKeys.size}`);
for (const authorityKey of expectedFinalAuthorityKeys) {
  assert(generatedFinalAuthorityKeys.has(authorityKey), `Public generation did not exercise final authority ${authorityKey}`);
}

console.log(JSON.stringify({
  status: "PASS",
  discoveryAuthorities,
  finalLearnerAuthorities: generatedFinalAuthorityKeys.size,
  seedsPerDiscoveryAuthority,
  cp001Questions,
  cp002Questions,
  questions,
  wrongReasons,
  mathematicalFingerprints: fingerprints.size,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
