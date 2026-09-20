import { ENG005_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/eng-005-human-approval-v1";
import { generateEng005Cp001QuestionV1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/CP001/eng-005-cp001-v1";
import { generateEng005Cp002QuestionV1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/CP002/eng-005-cp002-v1";
import { generateEng005Cp003QuestionV1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/CP003/eng-005-cp003-v1";
import { generateEng005Cp004QuestionV1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/CP004/eng-005-cp004-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG005_QUESTION_STUDIO_PACKAGE_ID_V1 = "english-eng005-idioms-phrases-v1" as const;
export const ENG005_CP_IDS_V1 = [
  "ENG-005-CP001",
  "ENG-005-CP002",
  "ENG-005-CP003",
  "ENG-005-CP004",
] as const;

type Eng005CpId = typeof ENG005_CP_IDS_V1[number];
type Difficulty = "easy" | "medium" | "hard";
type Mode = "idiom-to-meaning" | "meaning-to-idiom";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function hash(value: string) {
  let out = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    out ^= value.charCodeAt(index);
    out = Math.imul(out, 0x01000193) >>> 0;
  }
  return out >>> 0;
}

function language(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!value || value === "en") return "en";
  throw new Error("ENG-005 currently supports English only");
}

function count(value: number | undefined) {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error("ENG-005 review batches require count between 1 and 20");
  }
  return value;
}

function explicitCp(request: QuestionStudioGenerationRequest): Eng005CpId | undefined {
  const values = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  return values.find((value): value is Eng005CpId =>
    (ENG005_CP_IDS_V1 as readonly string[]).includes(value));
}

function explicitMode(request: QuestionStudioGenerationRequest): Mode | undefined {
  const values = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
    request.topic,
    request.subtopic,
  ].map((value) => text(value).toLowerCase());

  const direct = values.some((value) =>
    value === "idiom-to-meaning" || /idiom.*meaning|phrase.*meaning/.test(value));
  const reverse = values.some((value) =>
    value === "meaning-to-idiom" || /meaning.*idiom|meaning.*phrase/.test(value));

  if (direct && reverse) throw new Error("ENG-005 request cannot select both generation modes");
  return direct ? "idiom-to-meaning" : reverse ? "meaning-to-idiom" : undefined;
}

function difficulty(request: QuestionStudioGenerationRequest, seed: string): Difficulty {
  const value = text(request.difficulty).toLowerCase();
  if (value === "easy" || value === "medium" || value === "hard") return value;
  if (!value || value === "mixed") return (["easy", "medium", "hard"] as const)[hash(seed) % 3]!;
  throw new Error("ENG-005 difficulty must be Easy, Medium, Hard, or Mixed");
}

function generate(cp: Eng005CpId, seed: string, level: Difficulty, mode?: Mode) {
  const input = { seed, difficulty: level, mode } as any;
  switch (cp) {
    case "ENG-005-CP001": return generateEng005Cp001QuestionV1(input);
    case "ENG-005-CP002": return generateEng005Cp002QuestionV1(input);
    case "ENG-005-CP003": return generateEng005Cp003QuestionV1(input);
    case "ENG-005-CP004": return generateEng005Cp004QuestionV1(input);
  }
}

export function isEng005QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  if (text(request.packageId).toLowerCase() === ENG005_QUESTION_STUDIO_PACKAGE_ID_V1) return true;
  return Boolean(explicitCp(request));
}

export const languageV1Eng005QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [{
      engineId: "language-v1",
      packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
      subject: "English",
      topic: "Idioms & Phrases",
      subtopic: "Vocabulary",
      label: "ENG-005 Idioms & Phrases",
      enabled: true,
      cpIds: [...ENG005_CP_IDS_V1],
      supportedLanguages: ["en"],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      difficultyFilterSupported: true,
      runtimeMode: "review-only",
      supportedRuntimeModes: ["review-only"],
      lifecycleId: lifecycle.lifecycleId,
      lifecycleStage: "REVIEW_ONLY",
      reviewSurfaceRequired: true,
      manualApprovalRequired: true,
      questionBankStatus: lifecycle.questionBankStatus,
      questionBankWritable: false,
      testEligibility: lifecycle.testEligibility,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      metadata: {
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        uniqueExpressions: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.uniqueExpressions,
        cp004ContextTemplatesRuntimeAuthorized:
          ENG005_HUMAN_EDITORIAL_APPROVAL_V1.cp004ContextTemplatesRuntimeAuthorized,
      },
    }];
  },

  async generate(request): Promise<QuestionStudioGenerationResult> {
    if (!isEng005QuestionStudioRequestV1(request)) {
      throw new Error("language-v1 ENG-005 adapter requires ENG-005 package or CP selector");
    }
    if (request.runtimeMode && request.runtimeMode !== "review-only") {
      throw new Error("ENG-005 only supports review-only runtime");
    }

    const outputLanguage = language(request.language);
    const total = count(request.count);
    const baseSeed = text(request.seed) || "eng005-question-studio-approved-v1";
    const forcedCp = explicitCp(request);
    const forcedMode = explicitMode(request);
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < total; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const cp = forcedCp ??
        ENG005_CP_IDS_V1[hash(`${generationSeed}:cp`) % ENG005_CP_IDS_V1.length]!;
      const level = difficulty(request, `${generationSeed}:difficulty`);
      const question: any = generate(cp, generationSeed, level, forcedMode);
      const difficultyLabel = `${level[0]!.toUpperCase()}${level.slice(1)}`;

      questions.push({
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.metadata.mode,
        cpId: cp,
        subject: "English",
        topic: "Idioms & Phrases",
        subtopic: cp,
        language: outputLanguage,
        locale: "en-IN",
        stem: question.stem,
        text: [
          question.stem,
          ...question.options.map((option: string, optionIndex: number) =>
            `${String.fromCharCode(65 + optionIndex)}. ${option}`),
        ].join("\n"),
        options: [...question.options],
        correctIndex: question.correctOptionIndex,
        correct: question.correctOptionIndex,
        explanation: question.explanation,
        difficulty: difficultyLabel,
        difficultyLabel,
        phrase: question.metadata.phrase,
        mode: question.metadata.mode,
        entryId: question.metadata.entryId,
        category: question.metadata.category,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        humanReviewApproved: true,
        authoringReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: "SOURCE_GENERATOR_ONLY",
        productionReleased: false,
        cp004ContextTemplatesRuntimeAuthorized: false,
        generationSeed,
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "language-v1",
        packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
        cpSelection: forcedCp ?? "DETERMINISTIC_ACROSS_ENG-005-CP001..CP004",
        modeSelection: forcedMode ?? "DETERMINISTIC_PER_QUESTION",
        runtimeMode: "review-only",
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        approvedReviewArtifactId: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactId,
        approvedReviewArtifactDigest: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactDigest,
        approvedGeneratorHeadSha: ENG005_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
        cp004ContextTemplatesRuntimeAuthorized: false,
        humanReviewApproved: true,
        reviewOnly: true,
        language: outputLanguage,
        seed: baseSeed,
        count: total,
      },
    };
  },
};
