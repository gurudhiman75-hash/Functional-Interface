import {
  generateSapBankingSpeedQuestion,
  listSapBankingSpeedEligibleQls,
  SAP_BANKING_SPEED_PROFILES,
  type SapBankingSpeedExamProfile,
} from "./banking-speed-profile";
import type {
  SapQuestionStudioCpId,
  SapQuestionStudioDifficulty,
  SapQuestionStudioQlDescriptor,
} from "./question-studio-adapter";

export type SapBankingQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: unknown;
  language?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
  examProfile?: string;
}>;

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeBankingProfile(value: unknown): SapBankingSpeedExamProfile | undefined {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS") return profile;
  return undefined;
}

function isSapSelector(request: SapBankingQuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);
  return (
    packageId === "sap"
    || patternId === "sap"
    || patternId.includes("sap ql")
    || (selectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && selectors.has(subtopic))
  );
}

export function isSapBankingQuestionStudioRequest(request: SapBankingQuestionStudioRequest) {
  return Boolean(normalizeBankingProfile(request.examProfile) && isSapSelector(request));
}

function normalizeDifficulty(value: unknown): SapQuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  return undefined;
}

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function deterministicOrder(
  descriptors: readonly SapQuestionStudioQlDescriptor[],
  seed: string,
) {
  return [...descriptors].sort((left, right) => {
    const leftRank = hashText(`${seed}:${left.qlId}`);
    const rightRank = hashText(`${seed}:${right.qlId}`);
    return leftRank - rightRank || left.qlId.localeCompare(right.qlId);
  });
}

function explicitCheckpoint(request: SapBankingQuestionStudioRequest): SapQuestionStudioCpId | undefined {
  const value = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return value ? value as SapQuestionStudioCpId : undefined;
}

function eligibleDescriptorsForCheckpoint(
  profile: SapBankingSpeedExamProfile,
  checkpointId: SapQuestionStudioCpId,
) {
  const profileConfig = SAP_BANKING_SPEED_PROFILES[profile];
  if (!profileConfig.eligibleCpIds.includes(checkpointId)) {
    throw new Error(`${checkpointId} is not eligible for ${profile} Banking Speed Maths.`);
  }
  const descriptors = listSapBankingSpeedEligibleQls(profile)
    .filter((descriptor) => descriptor.checkpointId === checkpointId);
  if (!descriptors.length) {
    throw new Error(`${checkpointId} has no eligible Banking Speed Maths QLs for ${profile}.`);
  }
  return descriptors;
}

function generateConstrainedQuestion(
  request: SapBankingQuestionStudioRequest,
  profile: SapBankingSpeedExamProfile,
  difficulty: SapQuestionStudioDifficulty | undefined,
  seed: string,
) {
  const checkpointId = explicitCheckpoint(request);
  const explicitQl = String(request.questionLanguageId ?? "").trim().toUpperCase() || undefined;

  if (explicitQl) {
    const descriptor = listSapBankingSpeedEligibleQls(profile)
      .find((entry) => entry.qlId === explicitQl);
    if (!descriptor) {
      throw new Error(`${explicitQl} is not eligible for ${profile} Banking Speed Maths.`);
    }
    if (checkpointId && descriptor.checkpointId !== checkpointId) {
      throw new Error(`${explicitQl} is owned by ${descriptor.checkpointId}, not ${checkpointId}.`);
    }
    return generateSapBankingSpeedQuestion({
      examProfile: profile,
      difficulty,
      questionLanguageId: descriptor.qlId,
      seed,
    });
  }

  if (!checkpointId) {
    return generateSapBankingSpeedQuestion({
      examProfile: profile,
      difficulty,
      seed,
    });
  }

  const candidates = deterministicOrder(
    eligibleDescriptorsForCheckpoint(profile, checkpointId),
    `${seed}:${difficulty ?? "profile-mix"}`,
  );
  let lastError: unknown;
  for (let index = 0; index < candidates.length; index += 1) {
    const descriptor = candidates[index]!;
    try {
      return generateSapBankingSpeedQuestion({
        examProfile: profile,
        difficulty,
        questionLanguageId: descriptor.qlId,
        seed: `${seed}:${descriptor.qlId}:${index}`,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`Unable to generate ${difficulty ?? "profile-mix"} ${checkpointId} question for ${profile}.`);
}

function explanationText(pkg: any) {
  const explanation = pkg?.explanation;
  if (Array.isArray(explanation?.lines)) return explanation.lines.map(String).join("\n\n");
  if (Array.isArray(explanation?.steps)) return explanation.steps.map(String).join("\n\n");
  if (typeof explanation === "string") return explanation;
  if (typeof pkg?.learnerExplanation === "string") return pkg.learnerExplanation;
  return "";
}

function toBankingQuestionStudioPreview(
  pkg: any,
  context: { questionIndex: number; questionCount: number; seed: string },
) {
  const traceability = pkg.traceability ?? {};
  const profile = pkg.bankingSpeedProfile ?? {};
  const approximation = profile.approximationContract === "CERTIFIED_APPROXIMATION_ONLY";
  const canonicalAnswer = {
    kind: "symbolic",
    value: pkg.answer,
    display: pkg.answer,
    rendered: pkg.answer,
    rounding: approximation ? "certified-approximation" : "exact",
  };

  return {
    text: pkg.stem,
    stem: pkg.stem,
    options: [...pkg.options],
    optionCount: pkg.optionCount,
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    answer: pkg.answer,
    canonicalAnswer,
    explanation: explanationText(pkg),
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand ?? pkg.difficulty,
    difficultyLabel: pkg.difficultyBand ?? pkg.difficulty,
    patternId: "SAP",
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-sap-banking-speed-question-studio",
    semanticMetadata: traceability,
    traceability,
    validation: pkg.validation,
    questionId: pkg.questionId,
    seed: context.seed,
    runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1",
    sourceRuntimeMode: pkg.runtimeMode,
    reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    questionBankEligible: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    reviewOnly: true,
    manualApprovalRequired: true,
    releaseFreezeStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
    packageSource: "quant-v4-sap-banking-speed-question-studio",
    packageId: "SAP",
    language: "en",
    examProfile: pkg.examProfile,
    bankingSpeedProfile: profile,
    bankingOptionAnalysis: pkg.bankingOptionAnalysis,
    canonicalProblemId: profile.sourceCheckpointId ?? pkg.canonicalProblemId,
    questionLanguageId: profile.sourceQlId ?? pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    metadata: {
      language: "en",
      packageId: "SAP",
      examProfile: pkg.examProfile,
      canonicalProblemId: profile.sourceCheckpointId ?? pkg.canonicalProblemId,
      questionLanguageId: profile.sourceQlId ?? pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1",
      sourceRuntimeMode: pkg.runtimeMode,
      reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      targetSolveSeconds: profile.targetSolveSeconds,
      approximationContract: profile.approximationContract,
      fifthOptionPolicy: profile.fifthOptionPolicy,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
  };
}

export async function generateSapBankingQuestionStudioBatch(
  request: SapBankingQuestionStudioRequest,
) {
  const profile = normalizeBankingProfile(request.examProfile);
  if (!profile) {
    throw new Error(`Unsupported SAP Banking exam profile '${String(request.examProfile ?? "")}'.`);
  }
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") {
    throw new Error(`SAP ${profile} Banking Speed Question Studio routing is English-only in this checkpoint.`);
  }

  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const checkpointId = explicitCheckpoint(request);
  const batchSeed = request.seed?.trim()
    || `quant-v4:SAP:${profile}:${checkpointId ?? "mixed"}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const questionPackages: any[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const seed = `${batchSeed}:${checkpointId ?? "mixed"}:${index}`;
    const pkg = generateConstrainedQuestion(request, profile, difficulty, seed);
    questionPackages.push(pkg);
    questions.push(toBankingQuestionStudioPreview(pkg, {
      questionIndex: index + 1,
      questionCount: count,
      seed,
    }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "SimplificationAndApproximation" as const,
      packageId: "SAP" as const,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1" as const,
      reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      optionCount: SAP_BANKING_SPEED_PROFILES[profile].optionCount,
      canonicalProblemId: checkpointId ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

export const SAP_BANKING_QUESTION_STUDIO_CAPABILITY = Object.freeze({
  supportedExamProfiles: Object.freeze(["BANKING_PRELIMS", "BANKING_MAINS"] as const),
  optionCountByExamProfile: Object.freeze({
    BANKING_PRELIMS: SAP_BANKING_SPEED_PROFILES.BANKING_PRELIMS.optionCount,
    BANKING_MAINS: SAP_BANKING_SPEED_PROFILES.BANKING_MAINS.optionCount,
  }),
  bankingSpeedProfiles: Object.freeze({
    BANKING_PRELIMS: Object.freeze({
      runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1",
      reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
    BANKING_MAINS: Object.freeze({
      runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1",
      reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
  }),
});
