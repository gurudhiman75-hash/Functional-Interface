import type { Eng001Question, ValidationIssue, ValidationResult } from "../../../../core/types";
import { IDIOMATIC_USAGE_RULE_BY_ID, type IdiomaticUsageRuleId } from "../../../../grammar/idiomatic-usage";
import { CP013_SCENES_V1 } from "./cp013-catalog-v1";

const plainWordBan = /\b(?:aforementioned|thereof|wherein|hitherto|pursuant|therewith|hereinafter)\b/i;
const awkwardExplanationBan = /\b(?:trap|shortcut|eliminate options|test-taker|distractor logic)\b/i;
const issue = (code: ValidationIssue["code"], message: string): ValidationIssue => ({ code, message });
const sceneIdFromCandidateId = (candidateId: string): string => candidateId.replace(/^USG-V1:/, "");

export function validateEng001Cp013QuestionV1(question: Eng001Question): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { metadata } = question;
  const cpId = String(metadata.cpId);
  const ruleId = String(metadata.ruleId) as IdiomaticUsageRuleId;
  const mutationId = String(metadata.mutationId);

  if (cpId !== "ENG-001-CP013") issues.push(issue("RULE_MUTATION_MISMATCH", `Expected CP013 metadata, got ${cpId}.`));
  if (!ruleId.startsWith("GR-USG-")) issues.push(issue("RULE_MUTATION_MISMATCH", `CP013 must use a GR-USG rule, got ${ruleId}.`));

  const rule = IDIOMATIC_USAGE_RULE_BY_ID[ruleId];
  if (!rule) issues.push(issue("RULE_MUTATION_MISMATCH", `Unknown CP013 rule ${ruleId}.`));
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

  const scene = CP013_SCENES_V1.find((entry) => entry.id === sceneIdFromCandidateId(metadata.candidateId));
  if (!scene) issues.push(issue("ERROR_INDEX", `Unknown CP013 candidate ${metadata.candidateId}.`));
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
    const errorText = scene.errorSegments.join(" ");
    if (ruleId === "GR-USG-001" && (!/\bprefer(?:s|red)?\b[\s\S]*\bto\b/i.test(correctText) || !/\bprefer(?:s|red)?\b[\s\S]*\bthan\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-001 must keep a direct prefer X to Y comparison and mutate its comparison marker."));
    }
    if (ruleId === "GR-USG-002" && (!/\b(?:senior|junior)\s+to\b/i.test(correctText) || !/\b(?:senior|junior)\s+than\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-002 must test senior/junior to for rank comparison."));
    }
    if (ruleId === "GR-USG-003") {
      if (!/\bdifferent\s+from\b/i.test(correctText) || !/\bdifferent\s+with\b/i.test(errorText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-003 must use from in the correct surface and the unambiguous with-mutation in the error surface."));
      if (/\bdifferent\s+(?:to|than)\b/i.test(errorText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-003 must not mark standard regional different to/than variants as errors."));
    }
    if (ruleId === "GR-USG-004" && (!/\bcapable\s+of\b/i.test(correctText) || !/\bcapable\s+to\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-004 must test capable of against an excluded capable to construction."));
    }
    if (ruleId === "GR-USG-005" && (!/\binsist(?:s|ed)?\s+on\b/i.test(correctText) || !/\binsist(?:s|ed)?\s+for\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-005 must keep the noun/-ing insist on construction and mutate only its preposition."));
    }
    if (ruleId === "GR-USG-006" && (!/\bprevent(?:s|ed)?\b[\s\S]*\bfrom\s+\w+ing\b/i.test(correctText) || !/\bprevent(?:s|ed)?\b[\s\S]*\bto\s+\w+\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-006 must use explicit prevent + object + from + -ing and an excluded to-infinitive mutation."));
    }
    if (ruleId === "GR-USG-007") {
      if (/\bdespite\s+of\b/i.test(correctText) || /\bin\s+spite\s+(?!of\b)/i.test(correctText)) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-007 correct surface contains an invalid despite/in spite form."));
      if (!(/\bdespite\s+of\b/i.test(errorText) || /\bin\s+spite\s+(?!of\b)/i.test(errorText))) issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-007 error surface must contain the controlled despite/in spite mutation."));
    }
    if (ruleId === "GR-USG-008" && (!/\bno\s+sooner\b[\s\S]*\bthan\b/i.test(correctText) || !/\bno\s+sooner\b[\s\S]*\bwhen\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-008 must pair no sooner with than and mutate the pair to when."));
    }
    if (ruleId === "GR-USG-009" && (!/\b(?:hardly|scarcely)\b[\s\S]*\bwhen\b/i.test(correctText) || !/\b(?:hardly|scarcely)\b[\s\S]*\bthan\b/i.test(errorText))) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-USG-009 must pair hardly/scarcely with when and mutate the pair to than."));
    }
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

export function assertValidEng001Cp013QuestionV1(question: Eng001Question): void {
  const result = validateEng001Cp013QuestionV1(question);
  if (!result.ok) throw new Error(result.issues.map((entry) => `${entry.code}: ${entry.message}`).join("\n"));
}
