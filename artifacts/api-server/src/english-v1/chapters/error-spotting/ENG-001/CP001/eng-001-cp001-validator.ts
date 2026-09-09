import type { Eng001Question, Eng001SentenceCandidate, ValidationIssue, ValidationResult } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";

function issue(code: ValidationIssue["code"], message: string): ValidationIssue {
  return { code, message };
}

export function validateEng001Cp001Candidate(candidate: Eng001SentenceCandidate): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (candidate.correctSegments.length !== 4 || candidate.errorSegments.length !== 4) issues.push(issue("SEGMENT_COUNT", `${candidate.candidateId} must contain four source segments.`));
  if (candidate.correctSegments.some((segment) => segment.trim().length === 0) || candidate.errorSegments.some((segment) => segment.trim().length === 0)) issues.push(issue("EMPTY_SEGMENT", `${candidate.candidateId} contains an empty segment.`));
  const differences = candidate.correctSegments.map((segment, index) => segment === candidate.errorSegments[index] ? -1 : index).filter((index) => index >= 0);
  if (differences.length !== 1) issues.push(issue("ERROR_COUNT", `${candidate.candidateId} must mutate exactly one segment; found ${differences.length}.`));
  if (candidate.errorIndex === null || differences[0] !== candidate.errorIndex) issues.push(issue("ERROR_INDEX", `${candidate.candidateId} errorIndex does not match the mutated segment.`));
  if (!candidate.errorSpan || !candidate.correction) {
    issues.push(issue("CORRECTION_MISSING", `${candidate.candidateId} must record both errorSpan and correction.`));
  } else if (!candidate.errorSegments[candidate.errorIndex ?? 0]?.includes(candidate.errorSpan) || !candidate.correctSegments[candidate.errorIndex ?? 0]?.includes(candidate.correction)) {
    issues.push(issue("CORRECTION_MISSING", `${candidate.candidateId} errorSpan/correction is not present in the expected source segment.`));
  }
  const registeredRule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[candidate.ruleId];
  if (registeredRule.mutationId !== candidate.mutationId) issues.push(issue("RULE_MUTATION_MISMATCH", `${candidate.candidateId} mutation ${candidate.mutationId} does not match ${candidate.ruleId}.`));
  return { ok: issues.length === 0, issues };
}

export function validateEng001Cp001Question(question: Eng001Question): ValidationResult {
  const issues: ValidationIssue[] = [];
  const includeNoError = question.metadata.qlId !== "ENG-001-QL001";
  const expectedOptions = question.segments.length + (includeNoError ? 1 : 0);
  if (question.options.length !== expectedOptions) issues.push(issue("SEGMENT_COUNT", `${question.questionId} option count does not match its QL contract.`));
  if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) issues.push(issue("ANSWER_RANGE", `${question.questionId} has an out-of-range answer index.`));
  if (question.metadata.hasNoError) {
    if (question.metadata.qlId !== "ENG-001-QL007" || question.options[question.correctOptionIndex] !== "No error") issues.push(issue("NO_ERROR_CONTRACT", `${question.questionId} violates the no-error QL contract.`));
    if (!question.explanation.startsWith("There is no error.")) issues.push(issue("EXPLANATION_MISMATCH", `${question.questionId} no-error explanation is inconsistent.`));
  } else if (!question.explanation.includes(`segment ${question.metadata.answerSegment}`)) {
    issues.push(issue("EXPLANATION_MISMATCH", `${question.questionId} explanation does not identify the keyed segment.`));
  }
  if (!question.explanation.includes(question.correctedSentence)) issues.push(issue("EXPLANATION_MISMATCH", `${question.questionId} explanation does not include the corrected sentence.`));
  return { ok: issues.length === 0, issues };
}
