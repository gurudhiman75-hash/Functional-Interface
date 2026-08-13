import { randomUUID } from "node:crypto";

import {
  previewMenCp009QuestionStudioReview,
  type MenCp009QuestionStudioDifficulty,
  type MenCp009QuestionStudioLanguage,
} from "./question-studio-review-adapter";

export const MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "MEN-002" as const;
export const MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID = "MEN-CP-009" as const;

export const MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Mensuration",
  name: "MEN-002 Mensuration — Spheres & Hemispheres",
  label: "Mensuration — Spheres & Hemispheres",
  generationDomain: "quant-v4",
  cpIds: [MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID],
  canonicalProblems: [
    {
      id: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      label: "Spheres & Hemispheres",
    },
  ],
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: ["en", "hi", "pa"],
  enabled: true,
} as const);

export type MenCp009StandardQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: string | number;
  language?: MenCp009QuestionStudioLanguage;
  seed?: string;
  count?: number;
}>;

function normalizeDifficulty(
  value: MenCp009StandardQuestionStudioRequest["difficulty"],
): MenCp009QuestionStudioDifficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "easy") return "Easy";
    if (normalized === "medium" || normalized === "moderate") return "Medium";
    if (normalized === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function selectedPackageId(request: MenCp009StandardQuestionStudioRequest) {
  return String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
}

export function isMenCp009StandardQuestionStudioRequest(
  request: MenCp009StandardQuestionStudioRequest,
) {
  const packageId = selectedPackageId(request);
  const patternId = String(request.patternId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();

  return (
    packageId === MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID ||
    patternId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID ||
    cpId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID
  );
}

function toStandardQuestion(
  question: ReturnType<typeof previewMenCp009QuestionStudioReview>["questions"][number],
) {
  return {
    text: question.stem,
    stem: question.stem,
    options: [...question.options],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [...question.explanation.steps].join("\n"),
    richExplanation: question.explanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    renderer: question.renderer,
    traceability: question.traceability,
    validation: question.validation,
  };
}

export function generateMenCp009StandardQuestionStudioBatch(
  request: MenCp009StandardQuestionStudioRequest = {},
) {
  const language = request.language ?? "en";
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const batchSeed =
    request.seed?.trim() ||
    [
      MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      language,
      difficulty ?? "mixed",
      Date.now(),
      randomUUID(),
    ].join(":");

  const generated = previewMenCp009QuestionStudioReview({
    language,
    difficulty,
    count,
    seed: batchSeed,
  });
  const questions = generated.questions.map(toStandardQuestion);

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      sourceAuthority: generated.generationContext.integrationAuthority,
    }),
    questionPackages: questions,
    questions,
  });
}
