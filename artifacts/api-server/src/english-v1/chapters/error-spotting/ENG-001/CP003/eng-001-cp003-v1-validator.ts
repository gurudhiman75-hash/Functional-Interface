import { classifyEnglishDifficulty, structuralDifficultyScore } from "../../../../core/difficulty";
import type { ArticleRuleId, Eng001Question, Eng001SentenceCandidate } from "../../../../core/types";
import { ARTICLE_DETERMINER_RULE_BY_ID } from "../../../../grammar/articles-determiners";
import { cp003ScenePoolV1 } from "./eng-001-cp003-v1";

export interface Cp003Issue { code: "STRUCTURE" | "MUTATION" | "DIFFICULTY" | "QL" | "EXPLANATION" | "NATURALNESS" | "RULE"; message: string }
export interface Cp003Validation { ok: boolean; issues: readonly Cp003Issue[] }
const issue = (code: Cp003Issue["code"], message: string): Cp003Issue => ({ code, message });
const STEM1 = "Identify the part of the sentence that contains an error.";
const STEM2 = "Identify the part of the sentence that contains an error. If there is no error, select 'No error'.";

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
    if (!question.explanation.startsWith("There is no error.")) issues.push(issue("EXPLANATION", "No-error explanation is inconsistent."));
  } else if (!question.explanation.startsWith(`Part ${question.metadata.answerSegment} contains the error.`)) {
    issues.push(issue("EXPLANATION", "Explanation does not identify the keyed part."));
  }

  const sceneId = question.metadata.candidateId.replace(/^ART-V1:/, "");
  const sourceScene = cp003ScenePoolV1(question.metadata.difficulty).find((scene) => scene.id === sceneId);
  if (!sourceScene) {
    issues.push(issue("STRUCTURE", `Selected source scene ${sceneId} is missing.`));
  } else {
    const correction = sourceScene.correction;
    if (!question.explanation.includes(`“${correction}”`)) issues.push(issue("EXPLANATION", "Explanation omits the correction."));
    if (!question.metadata.hasNoError && !question.explanation.includes(`Use “${correction}”.`)) issues.push(issue("EXPLANATION", "Error explanation must state the correction directly."));
  }
  if (!question.explanation.includes(question.correctedSentence)) issues.push(issue("EXPLANATION", "Explanation omits the corrected sentence."));
  if (/\b(?:phonological realization|determiner phrase|DP structure|referential specificity)\b/i.test(question.explanation)) issues.push(issue("EXPLANATION", "Explanation contains unnecessary grammar jargon."));
  if (/\s{2,}/.test(question.correctedSentence)) issues.push(issue("NATURALNESS", "Corrected sentence contains doubled whitespace."));
  return { ok: issues.length === 0, issues };
}
