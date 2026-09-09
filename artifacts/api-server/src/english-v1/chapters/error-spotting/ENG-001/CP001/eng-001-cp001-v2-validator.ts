import { classifyEnglishDifficulty, structuralDifficultyScore } from "../../../../core/difficulty";
import type { Eng001Question, Eng001SentenceCandidate } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import {
  buildEng001Cp001CandidateV2,
  ENG001_CP001_NO_ERROR_RULE_IDS,
} from "./cp001-patterns-v2";

export interface Eng001Cp001V2Issue {
  code:
    | "STRUCTURE"
    | "MUTATION"
    | "DIFFICULTY"
    | "NATURALNESS"
    | "AMBIGUITY"
    | "QL_CONTRACT"
    | "EXPLANATION";
  message: string;
}

export interface Eng001Cp001V2Validation {
  ok: boolean;
  issues: readonly Eng001Cp001V2Issue[];
}

const issue = (
  code: Eng001Cp001V2Issue["code"],
  message: string,
): Eng001Cp001V2Issue => ({ code, message });

function sentenceWordCount(segments: readonly string[]): number {
  return segments.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function validateEng001Cp001CandidateV2(
  candidate: Eng001SentenceCandidate,
): Eng001Cp001V2Validation {
  const issues: Eng001Cp001V2Issue[] = [];

  if (candidate.correctSegments.length !== 4 || candidate.errorSegments.length !== 4) {
    issues.push(issue("STRUCTURE", `${candidate.candidateId} must have four source segments.`));
  }

  const differences = candidate.correctSegments
    .map((segment, index) => segment === candidate.errorSegments[index] ? -1 : index)
    .filter((index) => index >= 0);
  if (differences.length !== 1 || differences[0] !== candidate.errorIndex) {
    issues.push(issue("MUTATION", `${candidate.candidateId} must change exactly the registered error segment.`));
  }

  if (candidate.errorIndex === null || !candidate.errorSpan || !candidate.correction) {
    issues.push(issue("MUTATION", `${candidate.candidateId} lacks deterministic correction metadata.`));
  } else if (
    !candidate.errorSegments[candidate.errorIndex]?.includes(candidate.errorSpan)
    || !candidate.correctSegments[candidate.errorIndex]?.includes(candidate.correction)
  ) {
    issues.push(issue("MUTATION", `${candidate.candidateId} errorSpan/correction does not map to the mutated segment.`));
  }

  const rule = SUBJECT_VERB_AGREEMENT_RULE_BY_ID[candidate.ruleId];
  if (rule.mutationId !== candidate.mutationId) {
    issues.push(issue("MUTATION", `${candidate.candidateId} mutation does not match ${candidate.ruleId}.`));
  }

  const derived = classifyEnglishDifficulty(candidate.dimensions);
  if (derived !== candidate.difficulty) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} is labelled ${candidate.difficulty} but structural dimensions derive ${derived}.`));
  }
  if (candidate.difficulty === "hard" && candidate.dimensions.lexicalLoad > 2) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} makes Hard dependent on lexical load.`));
  }
  if (candidate.difficulty === "hard" && structuralDifficultyScore(candidate.dimensions) < 15) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} does not reach the Hard structural threshold.`));
  }

  const words = sentenceWordCount(candidate.correctSegments);
  const [min, max] = candidate.difficulty === "easy"
    ? [6, 20]
    : candidate.difficulty === "medium"
      ? [8, 28]
      : [10, 34];
  if (words < min || words > max) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} word count ${words} is outside ${candidate.difficulty} review bounds ${min}-${max}.`));
  }

  const joined = candidate.correctSegments.join(" ");
  if (/\b(\w+)\s+\1\b/i.test(joined)) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} contains an adjacent repeated word.`));
  }
  if (!/^[A-Z]/.test(candidate.correctSegments[0] ?? "")) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} does not begin with a capital letter.`));
  }
  if (/\bMany a [aeiou]/i.test(joined) || /\bMany an [^aeiou\s]/i.test(joined)) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} has an incorrect a/an form after “Many”.`));
  }

  if (
    candidate.ruleId === "GR-SVA-007"
    && !candidate.tags.includes("ambiguity:context-guarded")
  ) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} collective-noun item lacks an explicit contextual guard.`));
  }

  return { ok: issues.length === 0, issues };
}

export function validateEng001Cp001QuestionV2(
  question: Eng001Question,
): Eng001Cp001V2Validation {
  const issues: Eng001Cp001V2Issue[] = [];
  const includeNoError = question.metadata.qlId !== "ENG-001-QL001";

  if (question.options.length !== question.segments.length + (includeNoError ? 1 : 0)) {
    issues.push(issue("QL_CONTRACT", `${question.questionId} has the wrong option count.`));
  }
  if (
    question.correctOptionIndex < 0
    || question.correctOptionIndex >= question.options.length
  ) {
    issues.push(issue("QL_CONTRACT", `${question.questionId} answer index is out of range.`));
  }

  if (question.metadata.qlId === "ENG-001-QL002") {
    if (question.segments.length !== 3 || question.metadata.hasNoError) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} violates the three-segment error contract.`));
    }
    const candidate = buildEng001Cp001CandidateV2({
      ruleId: question.metadata.ruleId,
      difficulty: question.metadata.difficulty,
      seed: `${question.metadata.seed}:${question.metadata.ruleId}`,
    });
    const errorSegment = candidate.errorSegments[candidate.errorIndex!];
    if (question.segments[question.correctOptionIndex] !== errorSegment) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} merged the intended error with another source segment.`));
    }
  }

  if (question.metadata.hasNoError) {
    if (
      question.metadata.qlId !== "ENG-001-QL007"
      || question.options[question.correctOptionIndex] !== "No error"
    ) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} violates the calibrated No-error contract.`));
    }
    if (!ENG001_CP001_NO_ERROR_RULE_IDS.includes(question.metadata.ruleId)) {
      issues.push(issue("AMBIGUITY", `${question.questionId} uses a non-calibrated rule in the No-error pool.`));
    }
    if (!question.explanation.startsWith("There is no error.")) {
      issues.push(issue("EXPLANATION", `${question.questionId} has an inconsistent No-error explanation.`));
    }
  } else if (!question.explanation.includes(`segment ${question.metadata.answerSegment}`)) {
    issues.push(issue("EXPLANATION", `${question.questionId} does not identify the keyed segment.`));
  }

  if (!question.explanation.includes(question.correctedSentence)) {
    issues.push(issue("EXPLANATION", `${question.questionId} omits the corrected sentence.`));
  }

  return { ok: issues.length === 0, issues };
}
