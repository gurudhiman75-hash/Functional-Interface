import type { Eng001Question, ValidationIssue, ValidationResult } from "../../../../core/types";
import { VOICE_NARRATION_RULE_BY_ID, type VoiceNarrationRuleId } from "../../../../grammar/voice-narration";
import { CP012_SCENES_V1 } from "./cp012-catalog-v1";

const plainWordBan = /\b(?:aforementioned|thereof|wherein|hitherto|pursuant|therewith|hereinafter)\b/i;
const awkwardExplanationBan = /\b(?:trap|shortcut|eliminate options|test-taker|distractor logic)\b/i;
const issue = (code: ValidationIssue["code"], message: string): ValidationIssue => ({ code, message });
const sceneIdFromCandidateId = (candidateId: string): string => candidateId.replace(/^VNR-V1:/, "");

export function validateEng001Cp012QuestionV1(question: Eng001Question): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { metadata } = question;
  const cpId = String(metadata.cpId);
  const ruleId = String(metadata.ruleId) as VoiceNarrationRuleId;
  const mutationId = String(metadata.mutationId);

  if (cpId !== "ENG-001-CP012") issues.push(issue("RULE_MUTATION_MISMATCH", `Expected CP012 metadata, got ${cpId}.`));
  if (!ruleId.startsWith("GR-VNR-")) issues.push(issue("RULE_MUTATION_MISMATCH", `CP012 must use a GR-VNR rule, got ${ruleId}.`));

  const rule = VOICE_NARRATION_RULE_BY_ID[ruleId];
  if (!rule) issues.push(issue("RULE_MUTATION_MISMATCH", `Unknown CP012 rule ${ruleId}.`));
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

  const scene = CP012_SCENES_V1.find((entry) => entry.id === sceneIdFromCandidateId(metadata.candidateId));
  if (!scene) issues.push(issue("ERROR_INDEX", `Unknown CP012 candidate ${metadata.candidateId}.`));
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
    if (ruleId === "GR-VNR-003" && /\b(?:were arrived|was occurred|were disappeared|were remained|are belonged|is consisted)\b/i.test(correctText)) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-VNR-003 correct surfaces must not retain an impossible intransitive passive."));
    }
    if (ruleId === "GR-VNR-009" && /\basked\s+(?:did|had|whether\s+(?:could|would|did|had)|where\s+was|what\s+time\s+would|why\s+had)\b/i.test(correctText)) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-VNR-009 correct surfaces must use a reported-question linker and statement word order."));
    }
    if (ruleId === "GR-VNR-012" && /\b(?:said\s+me\s+that|told\s+that|explained\s+us\s+that|informed\s+to\s+us\s+that)\b/i.test(correctText)) {
      issues.push(issue("RULE_MUTATION_MISMATCH", "GR-VNR-012 correct surfaces contain a forbidden reporting-verb complement pattern."));
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

export function assertValidEng001Cp012QuestionV1(question: Eng001Question): void {
  const result = validateEng001Cp012QuestionV1(question);
  if (!result.ok) throw new Error(result.issues.map((entry) => `${entry.code}: ${entry.message}`).join("\n"));
}
