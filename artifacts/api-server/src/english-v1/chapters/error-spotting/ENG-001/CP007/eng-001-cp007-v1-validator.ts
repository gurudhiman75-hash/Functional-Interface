import type { ConjunctionRuleId, Eng001Question, ValidationIssue, ValidationResult } from "../../../../core/types";
import { CONJUNCTION_RULE_BY_ID } from "../../../../grammar/conjunctions-parallelism";
import { CP007_SCENES_V2 } from "./cp007-catalog-v2";

const plainWordBan = /\b(?:aforementioned|thereof|wherein|hitherto|pursuant|therewith|hereinafter)\b/i;
const awkwardExplanationBan = /\b(?:trap|shortcut|eliminate options|test-taker|distractor logic)\b/i;
const issue = (code: ValidationIssue["code"], message: string): ValidationIssue => ({ code, message });
const sceneIdFromCandidateId = (candidateId: string): string => candidateId.replace(/^CON-V1:/, "");

export function validateEng001Cp007QuestionV1(question: Eng001Question): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { metadata } = question;
  if (metadata.cpId !== "ENG-001-CP007") issues.push(issue("RULE_MUTATION_MISMATCH", `Expected CP007 metadata, got ${metadata.cpId}.`));
  if (!String(metadata.ruleId).startsWith("GR-CON-")) issues.push(issue("RULE_MUTATION_MISMATCH", `CP007 must use a GR-CON rule, got ${metadata.ruleId}.`));
  const rule = CONJUNCTION_RULE_BY_ID[metadata.ruleId as ConjunctionRuleId];
  if (!rule) issues.push(issue("RULE_MUTATION_MISMATCH", `Unknown CP007 rule ${metadata.ruleId}.`));
  else if (rule.mutationId !== metadata.mutationId) issues.push(issue("RULE_MUTATION_MISMATCH", `${metadata.ruleId} must map to ${rule.mutationId}.`));

  if (question.segments.length !== (metadata.qlId === "ENG-001-QL002" ? 3 : 4)) issues.push(issue("SEGMENT_COUNT", `${metadata.qlId} has ${question.segments.length} learner-visible segments.`));
  if (question.segments.some((segment) => !segment.trim())) issues.push(issue("EMPTY_SEGMENT", "Question contains an empty segment."));
  if (question.correctOptionIndex < 0 || question.correctOptionIndex >= question.options.length) issues.push(issue("ANSWER_RANGE", "Correct option index is outside the options array."));

  const noErrorIndex = question.options.indexOf("No error");
  if (metadata.qlId === "ENG-001-QL001" && noErrorIndex >= 0) issues.push(issue("NO_ERROR_CONTRACT", "QL001 must not expose a No error option."));
  if (metadata.qlId !== "ENG-001-QL001" && noErrorIndex < 0) issues.push(issue("NO_ERROR_CONTRACT", `${metadata.qlId} must expose a No error option.`));
  if (metadata.qlId === "ENG-001-QL007") {
    if (!metadata.hasNoError || question.correctOptionIndex !== noErrorIndex) issues.push(issue("NO_ERROR_CONTRACT", "QL007 must key No error."));
  } else if (metadata.hasNoError) issues.push(issue("NO_ERROR_CONTRACT", `${metadata.qlId} must contain a keyed error.`));

  const scene = CP007_SCENES_V2.find((entry) => entry.id === sceneIdFromCandidateId(metadata.candidateId));
  if (!scene) issues.push(issue("ERROR_INDEX", `Unknown CP007 candidate ${metadata.candidateId}.`));
  else {
    if (scene.ruleId !== metadata.ruleId) issues.push(issue("RULE_MUTATION_MISMATCH", `Scene ${scene.id} belongs to ${scene.ruleId}, not ${metadata.ruleId}.`));
    if (scene.difficulty !== metadata.difficulty) issues.push(issue("RULE_MUTATION_MISMATCH", `Scene ${scene.id} difficulty mismatch.`));
    const changed = scene.correctSegments.reduce<number[]>((out, segment, index) => {
      if (segment !== scene.errorSegments[index]) out.push(index);
      return out;
    }, []);
    if (changed.length !== 1) issues.push(issue("ERROR_COUNT", `Scene ${scene.id} changes ${changed.length} canonical segments.`));
    if (changed[0] !== scene.errorIndex) issues.push(issue("ERROR_INDEX", `Scene ${scene.id} errorIndex does not match its changed segment.`));
    if (!scene.correction.trim()) issues.push(issue("CORRECTION_MISSING", `Scene ${scene.id} has no correction.`));
    const expectedSentence = scene.correctSegments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
    if (question.correctedSentence !== expectedSentence) issues.push(issue("CORRECTION_MISSING", `Corrected sentence drifted from scene ${scene.id}.`));
    if (!question.explanation.includes(scene.reason)) issues.push(issue("EXPLANATION_MISMATCH", `Explanation lost the sentence-connected rule for ${scene.id}.`));
  }

  const visible = `${question.segments.join(" ")} ${question.correctedSentence}`;
  if (/\s{2,}/.test(visible)) issues.push(issue("EMPTY_SEGMENT", "Visible question contains doubled whitespace."));
  if (/\.\./.test(visible)) issues.push(issue("EMPTY_SEGMENT", "Visible question contains doubled punctuation."));
  if (plainWordBan.test(visible)) issues.push(issue("EXPLANATION_MISMATCH", "Question uses unnecessarily heavy vocabulary."));
  if (awkwardExplanationBan.test(question.explanation)) issues.push(issue("EXPLANATION_MISMATCH", "Explanation contains test-taking jargon instead of a simple grammar reason."));
  if (!/(Correct sentence:|corrected sentence is:|sentence should read:|sentence is correct:|No change is needed:)/i.test(question.explanation)) issues.push(issue("EXPLANATION_MISMATCH", "Explanation must show the full correct sentence."));

  const structuralScore = metadata.dimensions.ruleComplexity + metadata.dimensions.dependencyDistance + metadata.dimensions.distractorSimilarity + metadata.dimensions.sentenceLength + metadata.dimensions.ruleInteraction;
  if (metadata.difficulty === "easy" && structuralScore > 8) issues.push(issue("RULE_MUTATION_MISMATCH", `Easy structural score is ${structuralScore}.`));
  if (metadata.difficulty === "medium" && (structuralScore < 9 || structuralScore > 14)) issues.push(issue("RULE_MUTATION_MISMATCH", `Medium structural score is ${structuralScore}.`));
  if (metadata.difficulty === "hard" && structuralScore < 15) issues.push(issue("RULE_MUTATION_MISMATCH", `Hard structural score is ${structuralScore}.`));
  if (metadata.difficulty === "hard" && metadata.dimensions.lexicalLoad > 2) issues.push(issue("RULE_MUTATION_MISMATCH", "Hard lexical load must remain at or below 2."));
  if (rule && !rule.allowedDifficulties.includes(metadata.difficulty)) issues.push(issue("RULE_MUTATION_MISMATCH", `${metadata.ruleId} is not approved for ${metadata.difficulty}.`));
  return { ok: issues.length === 0, issues };
}

export function assertValidEng001Cp007QuestionV1(question: Eng001Question): void {
  const result = validateEng001Cp007QuestionV1(question);
  if (!result.ok) throw new Error(result.issues.map((entry) => `${entry.code}: ${entry.message}`).join("\n"));
}
