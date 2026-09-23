import { ENG006_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/eng-006-human-approval-v1";
import { generateEng006Cp001QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP001/eng-006-cp001-v1";
import { generateEng006Cp002QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP002/eng-006-cp002-v1";
import { generateEng006Cp003QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP003/eng-006-cp003-v1";
import { generateEng006Cp004QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP004/eng-006-cp004-v1";
import { generateEng006Cp005QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP005/eng-006-cp005-v1";
import { generateEng006Cp006QuestionV1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/CP006/eng-006-cp006-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG006_QUESTION_STUDIO_PACKAGE_ID_V1 = "english-eng006-one-word-substitution-v1" as const;
export const ENG006_CP_IDS_V1 = [
  "ENG-006-CP001",
  "ENG-006-CP002",
  "ENG-006-CP003",
  "ENG-006-CP004",
  "ENG-006-CP005",
  "ENG-006-CP006",
] as const;

type Eng006CpId = typeof ENG006_CP_IDS_V1[number];
type Difficulty = "easy" | "medium" | "hard";

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
  throw new Error("ENG-006 currently supports English only");
}

function count(value: number | undefined) {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error("ENG-006 review batches require count between 1 and 20");
  }
  return value;
}

function explicitCp(request: QuestionStudioGenerationRequest): Eng006CpId | undefined {
  const values = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  return values.find((value): value is Eng006CpId =>
    (ENG006_CP_IDS_V1 as readonly string[]).includes(value));
}

function difficulty(request: QuestionStudioGenerationRequest, seed: string): Difficulty {
  const value = text(request.difficulty).toLowerCase();
  if (value === "easy" || value === "medium" || value === "hard") return value;
  if (!value || value === "mixed") return (["easy", "medium", "hard"] as const)[hash(seed) % 3]!;
  throw new Error("ENG-006 difficulty must be Easy, Medium, Hard, or Mixed");
}

function generate(cp: Eng006CpId, seed: string, level: Difficulty) {
  const input = { seed, difficulty: level } as any;
  switch (cp) {
    case "ENG-006-CP001": return generateEng006Cp001QuestionV1(input);
    case "ENG-006-CP002": return generateEng006Cp002QuestionV1(input);
    case "ENG-006-CP003": return generateEng006Cp003QuestionV1(input);
    case "ENG-006-CP004": return generateEng006Cp004QuestionV1(input);
    case "ENG-006-CP005": return generateEng006Cp005QuestionV1(input);
    case "ENG-006-CP006": return generateEng006Cp006QuestionV1(input);
  }
}

export function isEng006QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  if (text(request.packageId).toLowerCase() === ENG006_QUESTION_STUDIO_PACKAGE_ID_V1) return true;
  return Boolean(explicitCp(request));
}

export const languageV1Eng006QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [{
      engineId: "language-v1",
      packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
      subject: "English",
      topic: "One-word Substitution",
      subtopic: "Vocabulary",
      label: "ENG-006 One-word Substitution",
      enabled: true,
      cpIds: [...ENG006_CP_IDS_V1],
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
        registrationAuthorityId: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        uniqueSubstitutions: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.uniqueSubstitutions,
        easySubstitutions: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.easySubstitutions,
        mediumSubstitutions: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.mediumSubstitutions,
        hardSubstitutions: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.hardSubstitutions,
      },
    }];
  },

  async generate(request): Promise<QuestionStudioGenerationResult> {
    if (!isEng006QuestionStudioRequestV1(request)) {
      throw new Error("language-v1 ENG-006 adapter requires ENG-006 package or CP selector");
    }
    if (request.runtimeMode && request.runtimeMode !== "review-only") {
      throw new Error("ENG-006 only supports review-only runtime");
    }

    const outputLanguage = language(request.language);
    const total = count(request.count);
    const baseSeed = text(request.seed) || "eng006-question-studio-approved-v1";
    const forcedCp = explicitCp(request);
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < total; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const cp = forcedCp ??
        ENG006_CP_IDS_V1[hash(`${generationSeed}:cp`) % ENG006_CP_IDS_V1.length]!;
      const level = difficulty(request, `${generationSeed}:difficulty`);
      const question: any = generate(cp, generationSeed, level);
      const difficultyLabel = `${level[0]!.toUpperCase()}${level.slice(1)}`;

      questions.push({
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: cp,
        cpId: cp,
        subject: "English",
        topic: "One-word Substitution",
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
        answer: question.metadata.answer,
        entryId: question.metadata.entryId,
        category: question.metadata.category,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        humanReviewApproved: true,
        authoringReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: "SOURCE_GENERATOR_ONLY",
        productionReleased: false,
        generationSeed,
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "language-v1",
        packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
        cpSelection: forcedCp ?? "DETERMINISTIC_ACROSS_ENG-006-CP001..CP006",
        runtimeMode: "review-only",
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        approvedReviewArtifactId: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactId,
        approvedReviewArtifactDigest: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewArtifactDigest,
        approvedGeneratorHeadSha: ENG006_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
        humanReviewApproved: true,
        reviewOnly: true,
        language: outputLanguage,
        seed: baseSeed,
        count: total,
      },
    };
  },
};
