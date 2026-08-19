import { SEA001_REVIEW_NAME_PACK } from "../localization/name-pack.ts";
import { SEA001_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import {
  generateSea001QuestionStudioBatch,
  type Sea001QuestionStudioLanguage,
} from "../question-studio/seating-question-studio-runtime.ts";

export interface Sea001TemplateConcentration {
  readonly total: number;
  readonly unique: number;
  readonly duplicateItems: number;
  readonly largestCluster: number;
  readonly largestClusterShare: number;
}

export interface Sea001LocaleTemplateAudit {
  readonly language: "hi" | "pa";
  readonly questionCount: number;
  readonly qlCoverage: number;
  readonly caseletCoverage: number;
  readonly setupTemplates: Sea001TemplateConcentration;
  readonly questionTemplates: Sea001TemplateConcentration;
  readonly clueTemplates: Sea001TemplateConcentration;
  readonly explanationStepTemplates: Sea001TemplateConcentration;
  readonly explanationOpeningFrames: Sea001TemplateConcentration;
  readonly optionRationaleTemplates: Sea001TemplateConcentration;
  readonly latinResidueCount: number;
  readonly exactRepeatedFullQuestionCount: number;
}

export interface Sea001MultilingualTemplateAudit {
  readonly Hindi: Sea001LocaleTemplateAudit;
  readonly Punjabi: Sea001LocaleTemplateAudit;
  readonly methodology: "DYNAMIC_STUDIO_TEMPLATE_MASKING_V1";
  readonly thresholdStatus: "UNSET_PENDING_MEASUREMENT_AND_HUMAN_SPOT_REVIEW";
}

const LOCALIZED_NAMES = Object.values(SEA001_REVIEW_NAME_PACK).flatMap(([hi, pa]) => [hi, pa]);

function normalizeTemplate(source: string): string {
  let text = source.normalize("NFC");
  for (const name of [...LOCALIZED_NAMES].sort((left, right) => right.length - left.length)) {
    text = text.split(name).join("PERSON");
  }
  return text
    .replace(/[0-9०-९੦-੯]+/gu, "#")
    .replace(/\b[A-D]\b/g, "OPTION")
    .replace(/\s+/gu, " ")
    .trim();
}

function openingFrame(source: string): string {
  const normalized = normalizeTemplate(source);
  const sentence = normalized.split(/[.!?।॥]+/u)[0] ?? normalized;
  return sentence.split(/\s+/u).slice(0, 10).join(" ");
}

function concentration(values: readonly string[]): Sea001TemplateConcentration {
  const counts = new Map<string, number>();
  for (const value of values.map(normalizeTemplate).filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const sizes = [...counts.values()];
  const total = sizes.reduce((sum, value) => sum + value, 0);
  const largest = sizes.length ? Math.max(...sizes) : 0;
  return {
    total,
    unique: counts.size,
    duplicateItems: sizes.reduce((sum, value) => sum + Math.max(0, value - 1), 0),
    largestCluster: largest,
    largestClusterShare: total ? Number((largest / total).toFixed(4)) : 0,
  };
}

function auditLocale(language: "hi" | "pa", questionsPerQl: number): Sea001LocaleTemplateAudit {
  const questions = SEA001_PERMANENT_QL_IDS.flatMap((qlId) =>
    generateSea001QuestionStudioBatch({
      language,
      qlId,
      count: questionsPerQl,
      seed: `sea001-realness-language:${language}:${qlId}`,
    }).questions,
  );

  const setups: string[] = [];
  const questionTemplates: string[] = [];
  const clues: string[] = [];
  const explanationSteps: string[] = [];
  const explanationOpeningFrames: string[] = [];
  const optionRationales: string[] = [];
  let latinResidueCount = 0;
  const fullQuestions = new Map<string, number>();

  for (const question of questions) {
    const promptLines = question.sharedPrompt.split(/\n+/u).map((line) => line.trim()).filter(Boolean);
    const setup = promptLines[0] ?? "";
    const clueLines = promptLines.slice(1).map((line) => line.replace(/^\d+[.)]\s*/u, ""));
    setups.push(setup);
    questionTemplates.push(question.stem);
    clues.push(...clueLines);
    explanationSteps.push(...question.explanation.steps);
    explanationOpeningFrames.push(...question.explanation.steps.map(openingFrame));
    optionRationales.push(...question.optionDetails.map((option) => option.studentExplanation));

    const learnerSurface = [
      question.sharedPrompt,
      question.stem,
      ...question.options,
      ...question.explanation.steps,
      question.explanation.conclusion,
      ...question.optionDetails.map((option) => option.studentExplanation),
    ].join("\n");
    if (/[A-Za-z]/u.test(learnerSurface)) latinResidueCount += 1;
    const fullFingerprintSurface = normalizeTemplate([
      question.sharedPrompt,
      question.stem,
      ...question.options,
      question.explanation.conclusion,
    ].join("\n"));
    fullQuestions.set(fullFingerprintSurface, (fullQuestions.get(fullFingerprintSurface) ?? 0) + 1);
  }

  return {
    language,
    questionCount: questions.length,
    qlCoverage: new Set(questions.map((question) => question.qlId)).size,
    caseletCoverage: new Set(questions.map((question) => question.caseletId)).size,
    setupTemplates: concentration(setups),
    questionTemplates: concentration(questionTemplates),
    clueTemplates: concentration(clues),
    explanationStepTemplates: concentration(explanationSteps),
    explanationOpeningFrames: concentration(explanationOpeningFrames),
    optionRationaleTemplates: concentration(optionRationales),
    latinResidueCount,
    exactRepeatedFullQuestionCount: [...fullQuestions.values()].reduce((sum, value) => sum + Math.max(0, value - 1), 0),
  };
}

export function auditSea001DynamicMultilingualTemplates(questionsPerQl = 4): Sea001MultilingualTemplateAudit {
  return {
    Hindi: auditLocale("hi", questionsPerQl),
    Punjabi: auditLocale("pa", questionsPerQl),
    methodology: "DYNAMIC_STUDIO_TEMPLATE_MASKING_V1",
    thresholdStatus: "UNSET_PENDING_MEASUREMENT_AND_HUMAN_SPOT_REVIEW",
  };
}
