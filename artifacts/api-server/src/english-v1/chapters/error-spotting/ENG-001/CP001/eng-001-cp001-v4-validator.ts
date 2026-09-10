import { classifyEnglishDifficulty, structuralDifficultyScore } from "../../../../core/difficulty";
import type { Eng001Question, Eng001SentenceCandidate } from "../../../../core/types";
import { SUBJECT_VERB_AGREEMENT_RULE_BY_ID } from "../../../../grammar/subject-verb-agreement";
import {
  buildEng001Cp001CandidateV4,
  ENG001_CP001_V4_NO_ERROR_RULE_IDS,
  semanticDomainOfV4,
} from "./cp001-patterns-v4";

export interface Eng001Cp001V4Issue {
  code:
    | "STRUCTURE"
    | "MUTATION"
    | "DIFFICULTY"
    | "NATURALNESS"
    | "AMBIGUITY"
    | "SEMANTIC_DOMAIN"
    | "QL_CONTRACT"
    | "EXPLANATION";
  message: string;
}

export interface Eng001Cp001V4Validation {
  ok: boolean;
  issues: readonly Eng001Cp001V4Issue[];
}

const issue = (code: Eng001Cp001V4Issue["code"], message: string): Eng001Cp001V4Issue => ({ code, message });

const HEAVY_SURFACE_TERMS = [
  "assessment",
  "clinical",
  "commissioning",
  "conservation",
  "curriculum",
  "deployment",
  "diagnostic",
  "editorial",
  "firmware",
  "irrigation",
  "laboratory",
  "maintenance",
  "occupancy",
  "outpatient",
  "preliminary",
  "protocol",
  "qualifying",
  "rehabilitation",
  "reservoir",
  "resurfacing",
  "settlement",
  "structural",
  "transaction",
  "verification",
  "wholesale",
] as const;

const EXPLANATION_JARGON = [
  "finite verb",
  "head subject",
  "subject head",
  "controls agreement",
  "plural noun phrase",
  "intervening material",
  "dependency",
] as const;

const ERROR_STEM = "Identify the part of the sentence that contains an error.";
const NO_ERROR_STEM = "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.";

function sentenceWordCount(segments: readonly string[]): number {
  return segments.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function textWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function repeatedContinuousPredicate(question: Eng001Question): string | null {
  const candidate = buildEng001Cp001CandidateV4({
    ruleId: question.metadata.ruleId,
    difficulty: question.metadata.difficulty,
    seed: `${question.metadata.seed}:${question.metadata.ruleId}`,
  });
  const cue = (candidate.distractorCue ?? "").trim().toLowerCase();
  const cueParticiple = cue.match(/^([a-z]+ing)\b/)?.[1];
  if (!cueParticiple) return null;

  const lower = question.correctedSentence.toLowerCase();
  const continuous = new RegExp(`\\b(?:am|is|are|was|were|be|been|being)\\s+${cueParticiple}\\b`);
  if (!continuous.test(lower)) return null;
  const occurrences = lower.match(new RegExp(`\\b${cueParticiple}\\b`, "g"))?.length ?? 0;
  return occurrences > 1 ? cueParticiple : null;
}

export function validateEng001Cp001CandidateV4(candidate: Eng001SentenceCandidate): Eng001Cp001V4Validation {
  const issues: Eng001Cp001V4Issue[] = [];

  if (candidate.correctSegments.length !== 4 || candidate.errorSegments.length !== 4) {
    issues.push(issue("STRUCTURE", `${candidate.candidateId} must have four canonical source segments.`));
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
    ? [5, 24]
    : candidate.difficulty === "medium"
      ? [7, 34]
      : [9, 42];
  if (words < min || words > max) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} word count ${words} is outside ${candidate.difficulty} review bounds ${min}-${max}.`));
  }

  const joined = candidate.correctSegments.join(" ").replace(/\s+/g, " ").trim();
  if (/\b(\w+)\s+\1\b/i.test(joined)) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} contains an adjacent repeated word.`));
  }
  if (!/^[A-Z]/.test(candidate.correctSegments[0] ?? "")) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} does not begin with a capital letter.`));
  }
  if (/\bMany a [aeiou]/i.test(joined) || /\bMany an [^aeiou\s]/i.test(joined)) {
    issues.push(issue("NATURALNESS", `${candidate.candidateId} has an incorrect a/an form after “Many”.`));
  }

  if (!semanticDomainOfV4(candidate)) {
    issues.push(issue("SEMANTIC_DOMAIN", `${candidate.candidateId} lacks a valid V4 semantic-domain tag.`));
  }

  if (candidate.ruleId === "GR-SVA-007" && !candidate.tags.includes("ambiguity:context-guarded")) {
    issues.push(issue("AMBIGUITY", `${candidate.candidateId} collective-noun item lacks an explicit contextual guard.`));
  }

  return { ok: issues.length === 0, issues };
}

export function validateEng001Cp001QuestionV4(question: Eng001Question): Eng001Cp001V4Validation {
  const issues: Eng001Cp001V4Issue[] = [];
  const includeNoError = question.metadata.qlId !== "ENG-001-QL001";

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
    issues.push(issue("QL_CONTRACT", `${question.questionId} must use the simple exam-style instruction stem.`));
  }

  if (question.metadata.qlId === "ENG-001-QL002") {
    if (question.segments.length !== 3 || question.metadata.hasNoError) {
      issues.push(issue("QL_CONTRACT", `${question.questionId} violates the three-segment error contract.`));
    }
    const candidate = buildEng001Cp001CandidateV4({
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
    if (!ENG001_CP001_V4_NO_ERROR_RULE_IDS.includes(question.metadata.ruleId)) {
      issues.push(issue("AMBIGUITY", `${question.questionId} uses a non-calibrated rule in the No-error pool.`));
    }
    if (!question.explanation.startsWith("There is no error.")) {
      issues.push(issue("EXPLANATION", `${question.questionId} has an inconsistent No-error explanation.`));
    }
  } else if (!question.explanation.startsWith(`Part ${question.metadata.answerSegment} contains the error.`)) {
    issues.push(issue("EXPLANATION", `${question.questionId} does not identify the keyed part in plain language.`));
  }

  if (!question.explanation.includes(question.correctedSentence)) {
    issues.push(issue("EXPLANATION", `${question.questionId} omits the corrected sentence.`));
  }
  if (/\s{2,}/.test(question.correctedSentence)) {
    issues.push(issue("NATURALNESS", `${question.questionId} corrected sentence contains doubled whitespace.`));
  }

  const realizedWords = textWordCount(question.correctedSentence);
  const realizedMax = question.metadata.difficulty === "easy" ? 30 : question.metadata.difficulty === "medium" ? 42 : 50;
  if (realizedWords > realizedMax) {
    issues.push(issue("NATURALNESS", `${question.questionId} realized sentence has ${realizedWords} words, above the ${question.metadata.difficulty} editorial ceiling of ${realizedMax}.`));
  }

  const lowerSentence = question.correctedSentence.toLowerCase();
  for (const term of HEAVY_SURFACE_TERMS) {
    if (lowerSentence.includes(term)) {
      issues.push(issue("NATURALNESS", `${question.questionId} contains avoidable heavy vocabulary: “${term}”.`));
    }
  }

  const explanationBeforeCorrection = question.explanation.split("Correct sentence:")[0] ?? question.explanation;
  if (textWordCount(explanationBeforeCorrection) > 38) {
    issues.push(issue("EXPLANATION", `${question.questionId} explanation is too wordy before the corrected sentence.`));
  }
  const lowerExplanation = explanationBeforeCorrection.toLowerCase();
  for (const phrase of EXPLANATION_JARGON) {
    if (lowerExplanation.includes(phrase)) {
      issues.push(issue("EXPLANATION", `${question.questionId} explanation contains avoidable grammar jargon: “${phrase}”.`));
    }
  }

  const repeatedPredicate = repeatedContinuousPredicate(question);
  if (repeatedPredicate) {
    issues.push(issue("NATURALNESS", `${question.questionId} repeats the continuous predicate “${repeatedPredicate}”, producing a machine-like surface.`));
  }

  return { ok: issues.length === 0, issues };
}
