import { classifyEnglishDifficulty, structuralDifficultyScore } from "../../../../core/difficulty";
import type { ArticleRuleId, Eng001Question, Eng001SentenceCandidate } from "../../../../core/types";
import { ARTICLE_DETERMINER_RULE_BY_ID } from "../../../../grammar/articles-determiners";
import { cp003ScenePoolV1 } from "./eng-001-cp003-v1";

export interface Cp003Issue { code: "STRUCTURE" | "MUTATION" | "DIFFICULTY" | "QL" | "EXPLANATION" | "NATURALNESS" | "RULE"; message: string }
export interface Cp003Validation { ok: boolean; issues: readonly Cp003Issue[] }
const issue = (code: Cp003Issue["code"], message: string): Cp003Issue => ({ code, message });
const STEM1 = "Identify the part of the sentence that contains an error.";
const STEM2 = "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.";

function correctionCue(correction: string): string {
  const withoutDeterminer = correction.replace(/^(?:a few|a little|the|a|an|many|much|few|little|each|every|several)\s+/i, "").trim();
  return withoutDeterminer.split(/\s+/)[0]?.replace(/[^\p{L}\p{N}-]/gu, "") ?? correction;
}

function firstIndexOfAny(text: string, needles: readonly string[]): number {
  const positions = needles.map((needle) => text.indexOf(needle)).filter((at) => at >= 0);
  return positions.length ? Math.min(...positions) : -1;
}

export function validateEng001Cp003CandidateV1(candidate: Eng001SentenceCandidate): Cp003Validation {
  const issues: Cp003Issue[] = [];
  if (candidate.correctSegments.length !== 4 || candidate.errorSegments.length !== 4) issues.push(issue("STRUCTURE", "Canonical CP003 candidates must have four segments."));
  const diffs = candidate.correctSegments.map((x, i) => x === candidate.errorSegments[i] ? -1 : i).filter((i) => i >= 0);
  if (diffs.length !== 1 || diffs[0] !== candidate.errorIndex) issues.push(issue("MUTATION", `${candidate.candidateId} must contain exactly one article/determiner mutation.`));
  if (candidate.errorIndex === null || !candidate.errorSpan || !candidate.correction) issues.push(issue("MUTATION", `${candidate.candidateId} lacks correction metadata.`));
  const rule = ARTICLE_DETERMINER_RULE_BY_ID[candidate.ruleId as ArticleRuleId];
  if (!rule || rule.mutationId !== candidate.mutationId) issues.push(issue("RULE", `${candidate.candidateId} does not match its registered rule mutation.`));
  const derived = classifyEnglishDifficulty(candidate.dimensions);
  if (derived !== candidate.difficulty) issues.push(issue("DIFFICULTY", `${candidate.candidateId} derives ${derived}, not ${candidate.difficulty}.`));
  if (candidate.difficulty === "hard" && structuralDifficultyScore(candidate.dimensions) < 15) issues.push(issue("DIFFICULTY", `${candidate.candidateId} is not structurally hard enough.`));
  if (candidate.difficulty === "hard" && candidate.dimensions.lexicalLoad > 2) issues.push(issue("DIFFICULTY", `${candidate.candidateId} relies on lexical difficulty.`));
  const text = candidate.correctSegments.join(" ");
  if (/\s{2,}/.test(text)) issues.push(issue("NATURALNESS", `${candidate.candidateId} contains doubled whitespace.`));
  if (!candidate.tags.some((t) => t.startsWith("domain:"))) issues.push(issue("STRUCTURE", `${candidate.candidateId} lacks a domain tag.`));
  return { ok: issues.length === 0, issues };
}

export function validateEng001Cp003QuestionV1(question: Eng001Question): Cp003Validation {
  const issues: Cp003Issue[] = [];
  if (question.metadata.cpId !== "ENG-001-CP003") issues.push(issue("QL", "Wrong CP id."));
  const includeNoError = question.metadata.qlId !== "ENG-001-QL001";
  if (question.options.length !== question.segments.length + (includeNoError ? 1 : 0)) issues.push(issue("QL", "Option count does not match QL contract."));
  if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) issues.push(issue("QL", "Answer index is out of range."));
  if (question.segments.some((s) => !s.trim())) issues.push(issue("STRUCTURE", "Visible segment is empty."));
  const expectedStem = question.metadata.qlId === "ENG-001-QL001" ? STEM1 : STEM2;
  if (question.stem !== expectedStem) issues.push(issue("QL", "Question does not use the standard instruction."));
  if (question.metadata.qlId === "ENG-001-QL002" && question.segments.length !== 3) issues.push(issue("QL", "QL002 must have three visible sentence parts plus No error."));

  if (question.metadata.hasNoError) {
    if (question.metadata.qlId !== "ENG-001-QL007" || question.options[question.correctOptionIndex] !== "No error") issues.push(issue("QL", "No-error question violates QL007 contract."));
    if (!/^(?:There is no error\.|The sentence is correct as it is\.|No part of the sentence has an error\.|The given sentence is correct\.)/.test(question.explanation)) {
      issues.push(issue("EXPLANATION", "No-error explanation does not clearly state that the sentence is correct."));
    }
  } else {
    const label = question.metadata.answerSegment;
    const keyedOpening = new RegExp(`^(?:Part ${label} contains the error\\.|The error is in Part ${label}\\.|Part ${label} is incorrect\\.|The mistake is in Part ${label}\\.|Part ${label} needs correction\\.)`);
    if (!keyedOpening.test(question.explanation)) issues.push(issue("EXPLANATION", "Explanation does not identify the keyed part."));
  }

  const sceneId = question.metadata.candidateId.replace(/^ART-V1:/, "");
  const sourceScene = cp003ScenePoolV1(question.metadata.difficulty).find((scene) => scene.id === sceneId);
  if (!sourceScene) {
    issues.push(issue("STRUCTURE", `Selected source scene ${sceneId} is missing.`));
  } else {
    const correction = sourceScene.correction;
    if (!question.explanation.includes(`“${correction}”`)) issues.push(issue("EXPLANATION", "Explanation omits the correction."));

    const errorCorrectionPhrases = [
      `Use “${correction}”.`,
      `It should be “${correction}”.`,
      `The correct form is “${correction}”.`,
      `Write “${correction}” instead.`,
      `Here, we need “${correction}”.`,
    ] as const;
    const noErrorConfirmationPhrases = [
      `“${correction}” is correct here.`,
      `So “${correction}” is correct.`,
      `That is why “${correction}” is correct.`,
      `Therefore, “${correction}” is correct.`,
    ] as const;

    const markerIndex = question.metadata.hasNoError
      ? firstIndexOfAny(question.explanation, noErrorConfirmationPhrases)
      : firstIndexOfAny(question.explanation, errorCorrectionPhrases);
    if (markerIndex < 0) {
      issues.push(issue("EXPLANATION", question.metadata.hasNoError
        ? "No-error explanation does not confirm the keyed form directly."
        : "Error explanation does not state the correction directly."));
    }

    const reasonText = markerIndex >= 0 ? question.explanation.slice(0, markerIndex) : question.explanation;
    const cue = correctionCue(correction);
    if (cue && !reasonText.toLocaleLowerCase().includes(cue.toLocaleLowerCase())) {
      issues.push(issue("EXPLANATION", `Explanation rule is not connected to the sentence cue “${cue}”.`));
    }
  }

  if (!question.explanation.includes(question.correctedSentence)) issues.push(issue("EXPLANATION", "Explanation omits the corrected sentence."));
  if (!/(?:Correct sentence:|The corrected sentence is:|So the sentence should read:|Correct form:)/.test(question.explanation)) {
    issues.push(issue("EXPLANATION", "Explanation does not present the corrected sentence clearly."));
  }
  if (/\b(?:phonological realization|determiner phrase|DP structure|referential specificity)\b/i.test(question.explanation)) issues.push(issue("EXPLANATION", "Explanation contains unnecessary grammar jargon."));
  if (/\s{2,}/.test(question.correctedSentence)) issues.push(issue("NATURALNESS", "Corrected sentence contains doubled whitespace."));
  return { ok: issues.length === 0, issues };
}
