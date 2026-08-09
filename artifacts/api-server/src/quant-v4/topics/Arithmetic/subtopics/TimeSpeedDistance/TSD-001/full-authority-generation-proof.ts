import {
  generateCp001Candidate,
  TSD_CP001_LEARNER_AUTHORITIES,
} from "./cp001/runtime";
import { hasTsdCalculationEvidence } from "./cp001/exact-option-feedback";
import { TSD_CP002_LEARNER_AUTHORITIES } from "./cp002/discovery-registry";
import { generateCp002Candidate } from "./cp002/public-runtime";
import { calibratedDifficultyLabel } from "./difficulty-calibration";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutDisplayedOption(reason: string, optionText: string): string {
  return reason.replace(optionText, "").replace(/^[✅⚠️\s:.-]+/, "").trim();
}

function assertQuestion(question: ReturnType<typeof generateCp001Candidate> | ReturnType<typeof generateCp002Candidate>): number {
  assert(question.validation.valid, `${question.questionLanguageId}: ${question.validation.errors.join("; ")}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionLanguageId}: options are not unique`);
  assert(question.options[question.correctIndex] === question.answerText, `${question.questionLanguageId}: answer key differs`);
  assert(question.optionAudit.filter((option) => option.isCorrect).length === 1, `${question.questionLanguageId}: option audit has the wrong correct count`);
  assert(question.explanation.optionAnalysis.length === 4, `${question.questionLanguageId}: option analysis is incomplete`);
  assert(question.difficulty.status === "EDITORIALLY_CALIBRATED", `${question.questionLanguageId}: difficulty remains uncalibrated`);
  assert(question.difficulty.label === calibratedDifficultyLabel(question.difficulty.featureScore), `${question.questionLanguageId}: difficulty conflicts with rubric`);
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

const seedsPerAuthority = 20;
const expectedAuthorities = TSD_CP001_LEARNER_AUTHORITIES.length + TSD_CP002_LEARNER_AUTHORITIES.length;
assert(expectedAuthorities === TSD_FINAL_LEARNER_AUTHORITIES.length, `Discovery/final authority count differs: ${expectedAuthorities}`);

let cp001Questions = 0;
let cp002Questions = 0;
let wrongReasons = 0;
const fingerprints = new Set<string>();
const authorityCounts = new Map<string, number>();

for (const authority of TSD_CP001_LEARNER_AUTHORITIES) {
  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const question = generateCp001Candidate(authority.provisionalId, `full-authority:cp001:${authority.provisionalId}:${index}`);
    wrongReasons += assertQuestion(question);
    fingerprints.add(question.mathematicalFingerprint);
    authorityCounts.set(authority.provisionalId, (authorityCounts.get(authority.provisionalId) ?? 0) + 1);
    cp001Questions += 1;
  }
}

for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const question = generateCp002Candidate(authority.provisionalId, `full-authority:cp002:${authority.provisionalId}:${index}`);
    wrongReasons += assertQuestion(question);
    fingerprints.add(question.mathematicalFingerprint);
    authorityCounts.set(authority.provisionalId, (authorityCounts.get(authority.provisionalId) ?? 0) + 1);
    cp002Questions += 1;
  }
}

const questions = cp001Questions + cp002Questions;
assert(questions === expectedAuthorities * seedsPerAuthority, `Expected ${expectedAuthorities * seedsPerAuthority} questions, received ${questions}`);
assert(wrongReasons === questions * 3, `Expected ${questions * 3} wrong reasons, received ${wrongReasons}`);
assert(authorityCounts.size === expectedAuthorities, `Expected ${expectedAuthorities} authority buckets, received ${authorityCounts.size}`);
for (const [authority, count] of authorityCounts) {
  assert(count === seedsPerAuthority, `${authority}: expected ${seedsPerAuthority} questions, received ${count}`);
}
assert(fingerprints.size >= expectedAuthorities * 3, `Mathematical profile diversity is too low: ${fingerprints.size}`);

console.log(JSON.stringify({
  status: "PASS",
  learnerAuthorities: expectedAuthorities,
  seedsPerAuthority,
  cp001Questions,
  cp002Questions,
  questions,
  wrongReasons,
  mathematicalFingerprints: fingerprints.size,
  difficultyStatus: "EDITORIALLY_CALIBRATED",
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
