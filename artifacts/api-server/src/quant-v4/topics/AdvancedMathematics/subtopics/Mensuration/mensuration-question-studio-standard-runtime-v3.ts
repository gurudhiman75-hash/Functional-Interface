import {
  MENSURATION_LOCALIZED_PACKAGE_V1,
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedBatchV1,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioExamProfile,
  type MensurationStudioLanguage,
} from "./localization/mensuration-localization-runtime-v1";

export const MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "MENSURATION" as const;

export const MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  packageId: MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Mensuration",
  name: "Mensuration — Full Chapter",
  label: MENSURATION_LOCALIZED_PACKAGE_V1.label,
  generationDomain: "quant-v4",
  cpIds: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => row.cpId),
  canonicalProblems: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => ({
    id: row.cpId,
    label: row.title,
  })),
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: ["en", "hi", "pa"],
  supportedExamProfiles: ["SSC_CORE", "SSC_ADVANCED", "BANKING", "PUNJAB_STATE"],
  enabled: true,
  runtimeMode: "FULL_CHAPTER_REALISM_V2",
  reviewStatus: "QUESTION_STUDIO_CONNECTED_REALISM_REMEDIATED",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
  reviewOnly: true,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
} as const);

export type MensurationStandardQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: string | number;
  language?: MensurationStudioLanguage;
  seed?: string;
  count?: number;
  examProfile?: string;
}>;

function normalizeDifficulty(value: MensurationStandardQuestionStudioRequest["difficulty"]): MensurationQuestionStudioDifficulty | undefined {
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

function normalizeExamProfile(value: unknown): MensurationQuestionStudioExamProfile {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile === "SSC_ADVANCED" || profile === "SSC_CGL_JSO" || profile === "SSC_CGL_TIER_II") return "SSC_ADVANCED";
  if (profile === "BANKING" || profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS") return "BANKING";
  if (profile === "PUNJAB_STATE" || profile === "PSSSB" || profile === "PPSC" || profile === "PUNJAB_POLICE") return "PUNJAB_STATE";
  return "SSC_CORE";
}

export function isMensurationStandardQuestionStudioRequest(request: MensurationStandardQuestionStudioRequest) {
  const packageId = String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
  return packageId === MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID;
}

function toStandardQuestion(question: ReturnType<typeof generateMensurationLocalizedBatchV1>["questions"][number]) {
  return {
    ...question,
    text: question.stem,
    canonicalProblemId: question.cpId,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    packageId: MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankEligible: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    releaseFreezeStatus: "QUESTION_STUDIO_REVIEW_ONLY" as const,
  };
}

export function generateMensurationStandardQuestionStudioBatch(
  request: MensurationStandardQuestionStudioRequest = {},
) {
  const language = request.language ?? "en";
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim() || undefined;
  const result = generateMensurationLocalizedBatchV1({
    cpId: cpId as any,
    patternId: request.patternId,
    difficulty: normalizeDifficulty(request.difficulty),
    examProfile: normalizeExamProfile(request.examProfile),
    language,
    seed: request.seed,
    count: request.count,
  });

  const questions = result.questions.map(toStandardQuestion);
  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      seed: result.seed,
      timestamp: Date.now(),
      language,
      examProfile: normalizeExamProfile(request.examProfile),
      runtimeMode: "FULL_CHAPTER_REALISM_V2" as const,
      reviewStatus: "QUESTION_STUDIO_CONNECTED_REALISM_REMEDIATED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      reviewOnly: true as const,
      automaticStudentPublication: false as const,
    }),
    questionPackages: questions,
    questions,
  });
}
