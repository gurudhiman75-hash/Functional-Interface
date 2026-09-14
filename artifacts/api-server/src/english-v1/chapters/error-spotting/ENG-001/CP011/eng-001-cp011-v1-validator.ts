import type { Eng001Question, ValidationIssue, ValidationResult } from "../../../../core/types";
import { CONDITIONAL_RULE_BY_ID, type ConditionalRuleId } from "../../../../grammar/conditionals";
import { CP011_SCENES_V1 } from "./cp011-catalog-v1";

const plainWordBan = /\b(?:aforementioned|thereof|wherein|hitherto|pursuant|therewith|hereinafter)\b/i;
const awkwardExplanationBan = /\b(?:trap|shortcut|eliminate options|test-taker|distractor logic)\b/i;
const issue = (code: ValidationIssue["code"], message: string): ValidationIssue => ({ code, message });
const sceneIdFromCandidateId = (candidateId: string): string => candidateId.replace(/^CND-V1:/, "");

export function validateEng001Cp011QuestionV1(question: Eng001Question): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { metadata } = question;
  const cpId = String(metadata.cpId);
  const ruleId = String(metadata.ruleId) as ConditionalRuleId;
  const mutationId = String(metadata.mutationId);

  if (cpId !== "ENG-001-CP011") issues.push(issue("RULE_MUTATION_MISMATCH", `Expected CP011 metadata, got ${cpId}.`));
  if (!ruleId.startsWith("GR-CND-")) issues.push(issue("RULE_MUTATION_MISMATCH", `CP011 must use a GR-CND rule, got ${ruleId}.`));

  const rule = CONDITIONAL_RULE_BY_ID[ruleId];
  if (!rule) issues.push(issue("RULE_MUTATION_MISMATCH", `Unknown CP011 rule ${ruleId}.`));
  else {
    if (rule.mutationId !== mutationId) issues.push(issue("RULE_MUTATION_MISMATCH", `${ruleId} must map to ${rule.mutationId}.`));
    if (!rule.allowedDifficulties.includes(metadata.difficulty)) issues.push(issue("RULE_MUTATION_MISMATCH", `${ruleId} is not approved for ${metadata.difficulty} difficulty.`));
  }

  if (question.segments.length !== (metadata.qlId === "ENG-001-QL002" ? 3 : 4)) issues.push(issue("SEGMENT_COUNT", `${metadata.qlId} has ${question.segments.length} learner-visible segments.`));
  if (question.segments.some((segment) => !segment.trim())) issues.push(issue("EMPTY_SEGMENT", "Question contains an empty segment."));
  if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) issues.push(issue("ANSWER_RANGE", "Correct option index is outside the options array."));

  const noErrorIndex = question.options.indexOf("No error");
  if (metadata.qlId === "ENG-001-QL001" && noErrorIndex >= 0) issues.push(issue("NO_ERROR_CONTRACT", "QL001 must not expose No error."));
  if (metadata.qlId !== "ENG-001-QL001" && noErrorIndex < 0) issues.push(issue("NO_ERROR_CONTRACT", `${metadata.qlId} must expose No error.`));
  if (metadata.qlId === "ENG-001-QL007") {
    if (!metadata.hasNoError || question.correctOptionIndex !== noErrorIndex) issues.push(issue("NO_ERROR_CONTRACT", "QL007 must key No error."));
  } else if (metadata.hasNoError) issues.push(issue("NO_ERROR_CONTRACT", `${metadata.qlId} must contain a keyed error.`));

  const scene = CP011_SCENES_V1.find((entry) => entry.id === sceneIdFromCandidateId(metadata.candidateId));
  if (!scene) issues.push(issue("ERROR_INDEX", `Unknown CP011 candidate ${metadata.candidateId}.`));
  else {
    if (scene.ruleId !== ruleId) issues.push(issue("RULE_MUTATION_MISMATCH", `Scene ${scene.id} belongs to ${scene.ruleId}.`));
    if (scene.difficulty !== metadata.difficulty) issues.push(issue("RULE_MUTATION_MISMATCH", `Scene ${scene.id} difficulty mismatch.`));
    const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => { if (segment !== scene.errorSegments[index]) out.push(index); return out; }, []);
    if (changed.length !== 1) issues.push(issue("ERROR_COUNT", `Scene ${scene.id} changes ${changed.length} canonical segments.`));
    if (changed[0] !== scene.errorIndex) issues.push(issue("ERROR_INDEX", `Scene ${scene.id} errorIndex mismatch.`));
    const expectedSentence = scene.correctSegments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
    if (question.correctedSentence !== expectedSentence) issues.push(issue("CORRECTION_MISSING", `Corrected sentence drifted from ${scene.id}.`));
    if (!question.explanation.includes(scene.reason)) issues.push(issue("EXPLANATION_MISMATCH", `Explanation lost the sentence-specific reason for ${scene.id}.`));

    const correctText = scene.correctSegments.join(" ");
    if (ruleId === "GR-CND-003" && /\bif\b[^,;.?!]*\bwill\b/i.test(correctText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-CND-003 correct surfaces must not use neutral future 'will' inside the if-clause."));
    if (ruleId === "GR-CND-008" && /\bunless\b[^.?!;]*\b(?:not|never|no)\b/i.test(correctText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-CND-008 correct surfaces must not contain a second negative inside the unless-condition."));
    if (ruleId === "GR-CND-010" && /\bif\s+(?:should|were)\b/i.test(correctText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-CND-010 correct inversion must not retain 'if'."));
  }

  const visible = `${question.segments.join(" ")} ${question.correctedSentence}`;
  if (/\s{2,}/.test(visible)) issues.push(issue("EMPTY_SEGMENT", "Visible question contains doubled whitespace."));
  if (plainWordBan.test(visible)) issues.push(issue("EXPLANATION_MISMATCH", "Question uses unnecessarily heavy vocabulary."));
  if (awkwardExplanationBan.test(question.explanation)) issues.push(issue("EXPLANATION_MISMATCH", "Explanation contains test-taking jargon."));
  if (!/Correct sentence:/i.test(question.explanation)) issues.push(issue("EXPLANATION_MISMATCH", "Explanation must show the full correct sentence."));

  const structuralScore = metadata.dimensions.ruleComplexity + metadata.dimensions.dependencyDistance + metadata.dimensions.distractorSimilarity + metadata.dimensions.sentenceLength + metadata.dimensions.ruleInteraction;
  if (metadata.difficulty === "easy" && structuralScore > 8) issues.push(issue("RULE_MUTATION_MISMATCH", `Easy structural score is ${structuralScore}.`));
  if (metadata.difficulty === "medium" && (structuralScore < 9 || structuralScore > 14)) issues.push(issue("RULE_MUTATION_MISMATCH", `Medium structural score is ${structuralScore}.`));
  if (metadata.difficulty === "hard" && structuralScore < 15) issues.push(issue("RULE_MUTATION_MISMATCH", `Hard structural score is ${structuralScore}.`));

  return { ok: issues.length === 0, issues };
}

export function assertValidEng001Cp011QuestionV1(question: Eng001Question): void {
  const result = validateEng001Cp011QuestionV1(question);
  if (!result.ok) throw new Error(result.issues.map((entry) => `${entry.code}: ${entry.message}`).join("\n"));
}
