import { classifyEnglishDifficulty, structuralDifficultyScore } from "../../../../core/difficulty";
import type { Eng001Question, Eng001SentenceCandidate, TenseRuleId } from "../../../../core/types";
import { TENSE_SEQUENCE_RULE_BY_ID } from "../../../../grammar/tenses-sequence";
import {
  buildEng001Cp002CandidateV1,
  ENG001_CP002_V1_NO_ERROR_RULE_IDS,
  semanticDomainOfCp002V1,
} from "./cp002-patterns-v1";

export interface Eng001Cp002V1Issue {
  code: "STRUCTURE" | "MUTATION" | "DIFFICULTY" | "NATURALNESS" | "AMBIGUITY" | "SEMANTIC_DOMAIN" | "QL_CONTRACT" | "EXPLANATION";
  message: string;
}

export interface Eng001Cp002V1Validation {
  ok: boolean;
  issues: readonly Eng001Cp002V1Issue[];
}

const issue = (code: Eng001Cp002V1Issue["code"], message: string): Eng001Cp002V1Issue => ({ code, message });
const ERROR_STEM = "Identify the part of the sentence that contains an error.";
const NO_ERROR_STEM = "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.";
const PAST_MARKER = /\b(?:yesterday|last Friday|two days ago|in 2024)\b/i;
const HABIT_MARKER = /\b(?:every morning|every day|each week|regularly)\b/i;
const NOW_MARKER = /\b(?:right now|at the moment|currently)\b/i;
const HEAVY_TERMS = ["commencement", "subsequently", "aforementioned", "procurement", "reconciliation", "notwithstanding"] as const;
const EXPLANATION_JARGON = ["temporal deixis", "aspectual", "telic", "atelic", "anteriority", "morphosyntactic"] as const;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validateEng001Cp002CandidateV1(candidate: Eng001SentenceCandidate): Eng001Cp002V1Validation {
  const issues: Eng001Cp002V1Issue[] = [];
  if (candidate.correctSegments.length !== 4 || candidate.errorSegments.length !== 4) {
    issues.push(issue("STRUCTURE", `${candidate.candidateId} must have four canonical source segments.`));
  }

  const differences = candidate.correctSegments
    .map((segment, index) => segment === candidate.errorSegments[index] ? -1 : index)
    .filter((index) => index >= 0);
  if (differences.length !== 1 || differences[0] !== candidate.errorIndex) {
    issues.push(issue("MUTATION", `${candidate.candidateId} must change exactly one registered tense segment.`));
  }
  if (candidate.errorIndex === null || !candidate.errorSpan || !candidate.correction) {
    issues.push(issue("MUTATION", `${candidate.candidateId} lacks deterministic correction metadata.`));
  } else if (
    !candidate.errorSegments[candidate.errorIndex]?.includes(candidate.errorSpan)
    || !candidate.correctSegments[candidate.errorIndex]?.includes(candidate.correction)
  ) {
    issues.push(issue("MUTATION", `${candidate.candidateId} errorSpan/correction does not map to the changed segment.`));
  }

  const ruleId = candidate.ruleId as TenseRuleId;
  const rule = TENSE_SEQUENCE_RULE_BY_ID[ruleId];
  if (!rule || rule.mutationId !== candidate.mutationId) {
    issues.push(issue("MUTATION", `${candidate.candidateId} mutation does not match ${candidate.ruleId}.`));
  }

  const derived = classifyEnglishDifficulty(candidate.dimensions);
  if (derived !== candidate.difficulty) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} is labelled ${candidate.difficulty} but derives ${derived}.`));
  }
  if (candidate.difficulty === "hard" && structuralDifficultyScore(candidate.dimensions) < 15) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} does not reach the Hard structural threshold.`));
  }
  if (candidate.difficulty === "hard" && candidate.dimensions.lexicalLoad > 2) {
    issues.push(issue("DIFFICULTY", `${candidate.candidateId} makes Hard dependent on vocabulary.`));
  }

  const sentence = candidate.correctSegments.join(" ").replace(/\s+/g, " ").trim();
  const words = wordCount(sentence);
  const bounds = candidate.difficulty === "easy" ? [5, 20] : candidate.difficulty === "medium" ? [6, 28] : [9, 34];
  if (words < bounds[0]! || words > bounds[1]!) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} word count ${words} is outside ${bounds[0]}-${bounds[1]}.`));
  }
  if (!/^[A-Z]/.test(candidate.correctSegments[0] ?? "")) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} does not begin with a capital letter.`));
  }
  if (/\b(\w+)\s+\1\b/i.test(sentence)) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} contains an adjacent repeated word.`));
  }
  for (const term of HEAVY_TERMS) {
    if (new RegExp(`\\b${term}\\b`, "i").test(sentence)) {
      issues.push(issue("NATURALNESS", `${candidate.candidateId} contains avoidable heavy vocabulary “${term}”.`));
    }
  }
  if (!semanticDomainOfCp002V1(candidate)) {
    issues.push(issue("SEMANTIC_DOMAIN", `${candidate.candidateId} lacks a semantic-domain tag.`));
  }

  if ((ruleId === "GR-TNS-001" || ruleId === "GR-TNS-009") && !PAST_MARKER.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks a definite finished-past marker.`));
  }
  if (ruleId === "GR-TNS-002" && !/\bhas been \w+ing\b/i.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks the intended continuing-action perfect-continuous form.`));
  }
  if (ruleId === "GR-TNS-003" && !HABIT_MARKER.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks an explicit routine marker.`));
  }
  if (ruleId === "GR-TNS-004" && !NOW_MARKER.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks an explicit current-action marker.`));
  }
  if (ruleId === "GR-TNS-006" && !/\bdid not [a-z]+\b/i.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks the did-not + base construction.`));
  }
  if (ruleId === "GR-TNS-007" && (!/^By the time\b/.test(candidate.correctSegments[0] ?? "") || !/\bhad (?:already )?[a-z]+ed\b|\bhad (?:already )?(?:known|done|gone|seen|made|taken|written|broken|driven)\b/i.test(sentence))) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks the explicit earlier/later past sequence.`));
  }
  if (ruleId === "GR-TNS-008" && !/\bwas \w+ing\b.*\bwhen\b/i.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks the in-progress past action and interruption cue.`));
  }
  if (ruleId === "GR-TNS-010" && !/\bhas (?:known|owned|understood)\b/i.test(sentence)) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} lacks the intended continuing stative present-perfect form.`));
  }

  return { ok: issues.length === 0, issues };
}

export function validateEng001Cp002QuestionV1(question: Eng001Question): Eng001Cp002V1Validation {
  const issues: Eng001Cp002V1Issue[] = [];
  const includeNoError = question.metadata.qlId !== "ENG-001-QL001";

  if (question.metadata.cpId !== "ENG-001-CP002") {
    issues.push(issue("QL_CONTRACT", `${question.questionId} has the wrong CP id.`));
  }
  if (question.segments.some((segment) => segment.trim().length === 0)) {
    issues.push(issue("STRUCTURE", `${question.questionId} contains an empty visible segment.`));
  }
  if (question.options.length !== question.segments.length + (includeNoError ? 1 : 0)) {
    issues.push(issue("QL_CONTRACT", `${question.questionId} has the wrong option count.`));
  }
  if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) {
    issues.push(issue("QL_CONTRACT", `${question.questionId} answer index is out of range.`));
  }
  const expectedStem = question.metadata.qlId === "ENG-001-QL001" ? ERROR_STEM : NO_ERROR_STEM;
  if (question.stem !== expectedStem) {
    issues.push(issue("QL_CONTRACT", `${question.questionId} must use the standard exam instruction.`));
  }

  const source = buildEng001Cp002CandidateV1({
    ruleId: question.metadata.ruleId as TenseRuleId,
    difficulty: question.metadata.difficulty,
    seed: `${question.metadata.seed}:${question.metadata.ruleId}`,
  });

  if (question.metadata.qlId === "ENG-001-QL002") {
    if (question.segments.length !== 3 || question.metadata.hasNoError) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} violates the three-part error contract.`));
    }
    const expectedErrorSegment = source.errorSegments[source.errorIndex!];
    if (question.segments[question.correctOptionIndex] !== expectedErrorSegment) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} merged the intended tense error with another segment.`));
    }
  }

  if (question.metadata.hasNoError) {
    if (question.metadata.qlId !== "ENG-001-QL007" || question.options[question.correctOptionIndex] !== "No error") {
      issues.push(issue("QL_CONTRACT", `${question.questionId} violates the No-error contract.`));
    }
    if (!ENG001_CP002_V1_NO_ERROR_RULE_IDS.includes(question.metadata.ruleId as TenseRuleId)) {
      issues.push(issue("AMBIGUITY", `${question.questionId} uses a non-calibrated No-error rule.`));
    }
    if (!question.explanation.startsWith("There is no error.")) {
      issues.push(issue("EXPLANATION", `${question.questionId} has an inconsistent No-error explanation.`));
    }
  } else if (!question.explanation.startsWith(`Part ${question.metadata.answerSegment} contains the error.`)) {
    issues.push(issue("EXPLANATION", `${question.questionId} does not identify the keyed part.`));
  }

  const correction = source.correction ?? "";
  if (!question.explanation.includes(`“${correction}”`)) {
    issues.push(issue("EXPLANATION", `${question.questionId} does not state the visible correction.`));
  }
  if (!question.metadata.hasNoError && !question.explanation.includes(`Use “${correction}”.`)) {
    issues.push(issue("EXPLANATION", `${question.questionId} must state the correction directly.`));
  }
  if (!question.explanation.includes(question.correctedSentence)) {
    issues.push(issue("EXPLANATION", `${question.questionId} omits the corrected sentence.`));
  }
  if (/\bReplace\b/.test(question.explanation)) {
    issues.push(issue("EXPLANATION", `${question.questionId} contains redundant replacement wording.`));
  }
  for (const jargon of EXPLANATION_JARGON) {
    if (question.explanation.toLowerCase().includes(jargon)) {
      issues.push(issue("EXPLANATION", `${question.questionId} contains explanation jargon “${jargon}”.`));
    }
  }
  const beforeCorrectSentence = question.explanation.split("Correct sentence:")[0] ?? question.explanation;
  if (wordCount(beforeCorrectSentence) > 32) {
    issues.push(issue("EXPLANATION", `${question.questionId} explanation before the corrected sentence is too long.`));
  }

  const visibleText = `${question.segments.join(" ")} ${question.correctedSentence} ${question.explanation}`;
  if (/\.\./.test(visibleText)) {
    issues.push(issue("NATURALNESS", `${question.questionId} contains doubled terminal punctuation.`));
  }
  if (/\bcurrently\./i.test(`${question.segments.join(" ")} ${question.correctedSentence}`)) {
    issues.push(issue("NATURALNESS", `${question.questionId} uses the weaker sentence-final “currently” surface instead of a natural present-time cue.`));
  }
  if (/\s{2,}/.test(question.correctedSentence)) {
    issues.push(issue("NATURALNESS", `${question.questionId} contains doubled whitespace.`));
  }

  return { ok: issues.length === 0, issues };
}
