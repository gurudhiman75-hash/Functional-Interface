import { numberSystemEnginePackages, generateNumberSystemEngineBatch } from "../quant-number-system";
import { interestAlgebraEnginePackages, generateInterestAlgebraEngineBatch } from "../quant-interest-algebra";
import {pncSourceReviewPackage, generatePncSourceReviewBatch} from "../quant-pnc-source-review";
import {pncReviewPackages, generatePncReviewBatch} from "../quant-pnc-review";
import { sriEnginePackages, generateSriEngineBatch } from "../quant-surds-indices";
import { tsdAuditReviewEnginePackage, generateTsdAuditReviewBatch } from "../quant-tsd-audit-review";
import {
  generateQuestion as generateQuantV4Question,
  listQuantV4Packages,
  QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
} from "../../quant-v4/generation-engine";
import {
  generateQuestion as generateQuantV4QuestionStudioQuestion,
  listQuantV4Packages as listQuantV4QuestionStudioPackages,
} from "../../quant-v4/question-studio-generation-engine";
import {
  AVG_001_QUESTION_STUDIO_CP_IDS,
  AVG_001_QUESTION_STUDIO_LANGUAGES,
} from "../../quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import {
  di001QuestionStudioPackageCard,
  generateDi001QuestionStudioBatch,
  isDi001QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-001/question-studio-adapter";
import {
  di002QuestionStudioPackageCard,
  generateDi002QuestionStudioBatch,
  isDi002QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-002/question-studio-adapter";
import {
  di003QuestionStudioPackageCard,
  generateDi003QuestionStudioBatch,
  isDi003QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-003/question-studio-adapter";
import {
  di004QuestionStudioPackageCard,
  generateDi004QuestionStudioBatch,
  isDi004QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-004/question-studio-adapter";
import {
  di005QuestionStudioPackageCard,
  generateDi005QuestionStudioBatch,
  isDi005QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-005/question-studio-adapter";
import {
  di006QuestionStudioPackageCard,
  generateDi006QuestionStudioBatch,
  isDi006QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-006/question-studio-adapter";
import {
  di007QuestionStudioPackageCard,
  generateDi007QuestionStudioBatch,
  isDi007QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-007/question-studio-adapter";
import {
  di008QuestionStudioPackageCard,
  generateDi008QuestionStudioBatch,
  isDi008QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-008/question-studio-adapter";
import {
  di009QuestionStudioPackageCard,
  generateDi009QuestionStudioBatch,
  isDi009QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-009/question-studio-adapter";
import {
  di010QuestionStudioPackageCard,
  generateDi010QuestionStudioBatch,
  isDi010QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-010/question-studio-adapter";
import {
  di011QuestionStudioPackageCard,
  generateDi011QuestionStudioBatch,
  isDi011QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-011/question-studio-adapter";
import {
  di012QuestionStudioPackageCard,
  generateDi012QuestionStudioBatch,
  isDi012QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-012/question-studio-adapter";
import {
  di013QuestionStudioPackageCard,
  generateDi013QuestionStudioBatch,
  isDi013QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-013/question-studio-adapter";
import {
  di014QuestionStudioPackageCard,
  generateDi014QuestionStudioBatch,
  isDi014QuestionStudioRequest,
} from "../../quant-v4/topics/DataInterpretation/DI-014/question-studio-adapter";
import {
  diDeliveryNoveltyMixPackageCard,
  generateDiDeliveryNoveltyMix,
  isDiDeliveryNoveltyMixRequest,
} from "../../quant-v4/topics/DataInterpretation/di-delivery-novelty-mix-v1";
import {
  generateStat001QuestionStudioBatch,
  isStat001QuestionStudioRequest,
  stat001QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-001/question-studio-adapter";
import {
  generateStat002QuestionStudioBatch,
  isStat002QuestionStudioRequest,
  stat002QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-002/question-studio-adapter";
import {
  generateStat003QuestionStudioBatch,
  isStat003QuestionStudioRequest,
  stat003QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-003/question-studio-adapter";
import {
  generateStat004QuestionStudioBatch,
  isStat004QuestionStudioRequest,
  stat004QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-004/question-studio-adapter";
import {
  generateStat005QuestionStudioBatchForAdapter,
  isStat005QuestionStudioRequest,
  stat005QuestionStudioCard,
} from "../../quant-v4/topics/Statistics/STAT-005/question-studio-adapter";
import {
  generateStat006QuestionStudioBatchForAdapter,
  isStat006QuestionStudioRequest,
  stat006QuestionStudioCard,
} from "../../quant-v4/topics/Statistics/STAT-006/question-studio-adapter";
import {
  generateStat007QuestionStudioBatchForAdapter,
  isStat007QuestionStudioRequest,
  stat007QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-007/question-studio-adapter";
import {
  generateStat008QuestionStudioBatchForAdapter,
  isStat008QuestionStudioRequest,
  stat008QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-008/question-studio-adapter";
import {
  generateStat009QuestionStudioBatchForAdapter,
  isStat009QuestionStudioRequest,
  stat009QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-009/question-studio-adapter";
import {
  generateStat010QuestionStudioBatchForAdapter,
  isStat010QuestionStudioRequest,
  stat010QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-010/question-studio-adapter";
import {
  generateStat014QuestionStudioBatchForAdapter,
  isStat014QuestionStudioRequest,
  stat014QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-014/question-studio-adapter";
import {
  generateStat013QuestionStudioBatchForAdapter,
  isStat013QuestionStudioRequest,
  stat013QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-013/question-studio-adapter";
import {
  generateStat012QuestionStudioBatchForAdapter,
  isStat012QuestionStudioRequest,
  stat012QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-012/question-studio-adapter";
import {
  generateStat011QuestionStudioBatchForAdapter,
  isStat011QuestionStudioRequest,
  stat011QuestionStudioPackageCard,
} from "../../quant-v4/topics/Statistics/STAT-011/question-studio-adapter";
import { listProbabilityNativeReviewCatalog, previewProbabilityNativeReview, PROBABILITY_NATIVE_REVIEW_PACKAGE } from "../../quant-v4/topics/Probability/native-review-adapter";
import { previewMenCp009QuestionStudioReview, MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE } from "../../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/MEN-CP-009/question-studio-review-adapter";
import { deriveQuestionStudioCpTitles } from "../package-metadata";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import {
  generateTrigonometryEngineBatch,
  trg001EnginePackage,
  trg002EnginePackage,
} from "../quant-trigonometry";
import {
  generateTmw001EngineBatch,
  tmw001EnginePackage,
} from "../quant-time-work";
import {
  generateTsdEngineBatch,
  tsd001EnginePackage,
  tsd002EnginePackage,
} from "../quant-time-speed-distance";
import {
  generateSapBankingEngineBatch,
} from "../quant-sap-banking";
import {
  num001EnginePackageCard,
} from "../quant-number-system-num001";
import type {
  QuestionStudioDifficulty,
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function asLanguageArray(value: unknown): QuestionStudioLanguage[] {
  const raw = Array.isArray(value) ? value.map(String) : ["en"];
  return raw.filter((entry): entry is QuestionStudioLanguage => entry === "en" || entry === "hi" || entry === "pa");
}

function asDifficultyArray(value: unknown): QuestionStudioDifficulty[] {
  const raw = Array.isArray(value) ? value.map(String) : [];
  const normalized = raw.map((entry) => {
    const lower = entry.trim().toLowerCase();
    if (lower === "easy") return "Easy";
    if (lower === "medium" || lower === "moderate") return "Medium";
    if (lower === "hard") return "Hard";
    return undefined;
  });
  return normalized.filter((entry): entry is QuestionStudioDifficulty => Boolean(entry));
}

function toSharedPackage(pkg: Record<string, unknown>): QuestionStudioPackageDefinition {
  const sourceMetadata = typeof pkg.metadata === "object" && pkg.metadata !== null
    ? pkg.metadata as Record<string, unknown>
    : undefined;
  const cpTitles = deriveQuestionStudioCpTitles(pkg);
  const metadata = Object.keys(cpTitles).length > 0
    ? { ...(sourceMetadata ?? {}), cpTitles }
    : sourceMetadata;

  return {
    engineId: "quant-v4",
    packageId: asString(pkg.packageId),
    subject: asString(pkg.subject) || undefined,
    topic: asString(pkg.topic),
    subtopic: asString(pkg.subtopic),
    label: asString(pkg.label) || asString(pkg.packageId),
    enabled: Boolean(pkg.enabled),
    cpIds: Array.isArray(pkg.cpIds)
      ? asStringArray(pkg.cpIds)
      : Array.isArray(pkg.canonicalProblems)
        ? pkg.canonicalProblems.map((entry) => asString((entry as Record<string, unknown>).id)).filter(Boolean)
        : [],
    supportedLanguages: asLanguageArray(pkg.supportedLanguages),
    supportedDifficulties: asDifficultyArray(pkg.supportedDifficulties),
    difficultyFilterSupported:
      typeof pkg.difficultyFilterSupported === "boolean"
        ? pkg.difficultyFilterSupported
        : undefined,
    runtimeMode: asString(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: asStringArray(pkg.supportedRuntimeModes),
    dynamicCandidateCpIds: asStringArray(pkg.dynamicCandidateCpIds),
    lifecycleId: asString(pkg.lifecycleId) || undefined,
    lifecycleStage:
      pkg.lifecycleStage === "REVIEW_ONLY" || pkg.lifecycleStage === "BANK_ONLY"
        ? pkg.lifecycleStage
        : pkg.lifecycleStage === undefined
          && pkg.questionBankWritable === false
          && pkg.testEligible === false
          && pkg.publiclyPublishable === false
          && pkg.productionReleaseAuthorized === false
          ? "REVIEW_ONLY"
          : undefined,
    reviewSurfaceRequired:
      typeof pkg.reviewSurfaceRequired === "boolean"
        ? pkg.reviewSurfaceRequired
        : undefined,
    questionBankStatus: asString(pkg.questionBankStatus) || undefined,
    questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
    questionBankAcceptanceMode:
      pkg.questionBankAcceptanceMode === "BANK_ONLY" || pkg.questionBankAcceptanceMode === "FULL_RELEASE"
        ? pkg.questionBankAcceptanceMode
        : undefined,
    questionBankAcceptanceAuthority:
      typeof pkg.questionBankAcceptanceAuthority === "string" || pkg.questionBankAcceptanceAuthority === null
        ? pkg.questionBankAcceptanceAuthority
        : undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
    mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
    publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
    automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean" ? pkg.automaticStudentPublication : undefined,
    productionReleaseAuthorized: typeof pkg.productionReleaseAuthorized === "boolean" ? pkg.productionReleaseAuthorized : undefined,
    manualApprovalRequired: typeof pkg.manualApprovalRequired === "boolean" ? pkg.manualApprovalRequired : undefined,
    metadata,
  };
}

function normalizeStatExamProfile(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (!normalized) return undefined;
  if (normalized.includes("jso") || normalized.includes("statistics")) return "SSC_CGL_JSO";
  if (normalized.includes("ssc") && normalized.includes("cgl")) return "SSC_CGL_TIER_II";
  return undefined;
}

function toStatRequest(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: normalizeStatExamProfile(request.exam),
  };
}

function toDi001Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi002Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi003Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi004Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi005Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi006Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi007Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi008Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi009Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi010Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    questionLanguageId: request.questionLanguageId,
    examProfile: request.exam,
  };
}

function toDi011Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    examProfile: request.exam,
  };
}

function toDi012Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    examProfile: request.exam,
  };
}

function toDi013Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    examProfile: request.exam,
  };
}

function toDi014Request(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    examProfile: request.exam,
  };
}

function toDiMixRequest(request: QuestionStudioGenerationRequest) {
  return {
    packageId: request.packageId,
    patternId: request.patternId,
    topic: request.topic,
    subtopic: request.subtopic,
    difficulty: request.difficulty,
    language: request.language,
    seed: request.seed,
    count: request.count,
    canonicalProblemId: request.canonicalProblemId,
    examProfile: request.exam,
  };
}

function normalizeAverageSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAverageEngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = normalizeAverageSelector(request.packageId);
  const patternId = normalizeAverageSelector(request.patternId);
  const topic = normalizeAverageSelector(request.topic);
  const subtopic = normalizeAverageSelector(request.subtopic);
  return (
    packageId === "avg 001"
    || patternId.includes("avg 001")
    || (topic === "average" && !subtopic)
    || (topic === "arithmetic" && subtopic === "average")
  );
}

export const quantV4QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "quant-v4",

  listPackages() {
    const packages = listQuantV4Packages()
      // Source modules used by the legacy Quant dispatcher may belong to
      // Reasoning. Only quant-native packages can be owned by quant-v4.
      .filter((pkg) => {
        const source = pkg as unknown as Record<string, unknown>;
        return pkg.packageId !== QUANT_V4_PERCENTAGE_ALL_PATTERN_ID
          && source.type !== "reasoning-v1"
          && source.section !== "Reasoning"
          && source.domain !== "reasoning";
      })
      .map((pkg) => toSharedPackage(pkg as unknown as Record<string, unknown>));

    const replaceOrPush = (packageId: string, card: Record<string, unknown>) => {
      const shared = toSharedPackage(card);
      const index = packages.findIndex((pkg) => pkg.packageId === packageId);
      if (index >= 0) packages[index] = shared;
      else packages.push(shared);
    };

    // The legacy Quant runtime already executes these canonical CP packages,
    // but its filesystem discovery omits the Question Studio review lifecycle.
    // Preserve source language restrictions (RAP stays English-only) and never
    // grant Question Bank writes or student publication via this adapter.
    const standardQuantReviewIds = new Set([
      "PCT-001", "PCT-002", "PCT-003", "PCT-004",
      "PCT-005", "PCT-006", "PCT-007",
      "RAP-001", "RAP-002", "RAP-003", "PRT-001",
    ]);
    for (const pkg of packages) {
      if (!standardQuantReviewIds.has(pkg.packageId) || !pkg.enabled || !pkg.cpIds.length) continue;
      Object.assign(pkg, {
        lifecycleId: "QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1",
        lifecycleStage: "REVIEW_ONLY",
        reviewSurfaceRequired: true,
        manualApprovalRequired: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        productionReleaseAuthorized: false,
        supportedDifficulties: ["Easy", "Medium", "Hard"],
      });
    }

    // Separate executable dynamic-candidate review package. Never modify the
    // canonical PNL-001 Question Bank / publication admission contract.
    const pnlCanonical = packages.find((pkg) => pkg.packageId === "PNL-001");
    if (pnlCanonical?.enabled && pnlCanonical.dynamicCandidateCpIds?.length) {
      replaceOrPush("PNL-001-REVIEW", {
        packageId: "PNL-001-REVIEW",
        topic: pnlCanonical.topic,
        subtopic: pnlCanonical.subtopic,
        label: "Profit & Loss — Dynamic Candidate Review",
        enabled: true,
        cpIds: [...pnlCanonical.dynamicCandidateCpIds],
        supportedLanguages: [...pnlCanonical.supportedLanguages],
        supportedDifficulties: ["Easy", "Medium", "Hard"],
        runtimeMode: "DYNAMIC_CANDIDATE",
        supportedRuntimeModes: ["DYNAMIC_CANDIDATE"],
        lifecycleId: "QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1",
        lifecycleStage: "REVIEW_ONLY",
        reviewSurfaceRequired: true,
        manualApprovalRequired: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        productionReleaseAuthorized: false,
        metadata: { sourcePackageId: "PNL-001", sourceRuntimeMode: "DYNAMIC_CANDIDATE" },
      });
    }

    // The native parity review is independent of the canonical PRB-001/002
    // item-acceptance contracts. Only Hindi/Punjabi drafts are admitted here.
    replaceOrPush("PRB-NATIVE-REVIEW", {
      ...PROBABILITY_NATIVE_REVIEW_PACKAGE,
      packageId: "PRB-NATIVE-REVIEW",
      cpIds: [...new Set(listProbabilityNativeReviewCatalog().map((entry) => entry.cpId))],
      supportedLanguages: ["hi", "pa"],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      productionReleaseAuthorized: false,
      automaticStudentPublication: false,
    });

    replaceOrPush("MEN-002-REVIEW", {
      ...MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
      packageId: "MEN-002-REVIEW",
      cpIds: ["MEN-CP-009"],
      supportedDifficulties: ["Easy", "Medium", "Hard"],
      supportedLanguages: ["en", "hi", "pa"],
      reviewSurfaceRequired: true,
      manualApprovalRequired: true,
      productionReleaseAuthorized: false,
      automaticStudentPublication: false,
    });

    for (const pkg of sriEnginePackages()) replaceOrPush(pkg.packageId, pkg);

    const avgPackage = listQuantV4QuestionStudioPackages()
      .find((pkg: any) => pkg.packageId === "AVG-001");
    if (avgPackage) {
      replaceOrPush("AVG-001", {
        ...(avgPackage as Record<string, unknown>),
        cpIds: [...AVG_001_QUESTION_STUDIO_CP_IDS],
        canonicalProblems: AVG_001_QUESTION_STUDIO_CP_IDS.map((cpId) => ({
          id: cpId,
          label: cpId,
        })),
        supportedLanguages: [...AVG_001_QUESTION_STUDIO_LANGUAGES],
        supportedDifficulties: ["Easy", "Medium", "Hard"],
        enabled: true,
        lifecycleId: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.lifecycleId,
        lifecycleStage: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.stage,
        reviewSurfaceRequired: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.reviewSurfaceRequired,
        manualApprovalRequired: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.manualApprovalRequired,
        questionBankStatus: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankStatus,
        questionBankWritable: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankWritable,
        questionBankAcceptanceMode: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankAcceptanceMode,
        questionBankAcceptanceAuthority: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.questionBankAcceptanceAuthority,
        testEligibility: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.testEligibility,
        testEligible: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.testEligible,
        mockTestEligible: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.mockTestEligible,
        publiclyPublishable: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.publiclyPublishable,
        automaticStudentPublication: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.automaticStudentPublication,
        productionReleaseAuthorized: QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1.productionReleaseAuthorized,
      });
    }

    const sapPackage = listQuantV4QuestionStudioPackages()
      .find((pkg: any) => pkg.packageId === "SAP");
    if (sapPackage) {
      replaceOrPush("SAP", sapPackage as unknown as Record<string, unknown>);
    }

    replaceOrPush("DI-001", di001QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-002", di002QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-003", di003QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-004", di004QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-005", di005QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-006", di006QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-007", di007QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-008", di008QuestionStudioPackageCard() as unknown as Record<string, unknown>);

    // Filesystem-discovered Quant cards can precede specialized DI/Statistics
    // adapters. Never retain a generic card just because its packageId exists:
    // its CP, supported-language, lifecycle, and review-only gates may be stale.
    // The dedicated executable adapter is the source of truth for each package.
    replaceOrPush("DI-009", di009QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-010", di010QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-011", di011QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-012", di012QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-013", di013QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-014", di014QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("DI-MIX-001", diDeliveryNoveltyMixPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-001", stat001QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-002", stat002QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-003", stat003QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-004", stat004QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-005", stat005QuestionStudioCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-006", stat006QuestionStudioCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-007", stat007QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-008", stat008QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-009", stat009QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-010", stat010QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-011", stat011QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-012", stat012QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-013", stat013QuestionStudioPackageCard() as unknown as Record<string, unknown>);
    replaceOrPush("STAT-014", stat014QuestionStudioPackageCard() as unknown as Record<string, unknown>);

    for (const specializedPackage of [
      trg001EnginePackage(),
      trg002EnginePackage(),
      tmw001EnginePackage(),
      tsd001EnginePackage(),
      tsd002EnginePackage(),
      tsdAuditReviewEnginePackage(),
      ...pncReviewPackages(),
      pncSourceReviewPackage(),
      toSharedPackage(num001EnginePackageCard()),
    ]) {
      const index = packages.findIndex((pkg) => pkg.packageId === specializedPackage.packageId);
      if (index >= 0) packages[index] = specializedPackage;
      else packages.push(specializedPackage);
    }

    for (const pkg of [...numberSystemEnginePackages(), ...interestAlgebraEnginePackages()]) replaceOrPush(pkg.packageId, pkg);

    return packages.sort((left, right) => left.packageId.localeCompare(right.packageId));
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const sri = await generateSriEngineBatch(request);
    if (sri) return sri;
    if (isAverageEngineRequest(request)) {
      return generateQuantV4QuestionStudioQuestion({
        packageId: "AVG-001",
        examProfile: request.examProfile as never,
        patternId: request.patternId,
        topic: request.topic,
        subtopic: request.subtopic,
        difficulty: request.difficulty as never,
        language: request.language,
        seed: request.seed,
        count: request.count,
        runtimeMode: request.runtimeMode as never,
        canonicalProblemId: request.canonicalProblemId,
        questionLanguageId: request.questionLanguageId,
      } as any) as unknown as QuestionStudioGenerationResult;
    }

    const trigonometry = await generateTrigonometryEngineBatch(request);
    if (trigonometry) return trigonometry;

    const timeAndWork = await generateTmw001EngineBatch(request);
    if (timeAndWork) return timeAndWork;

    const pncSource = generatePncSourceReviewBatch(request);
    if (pncSource) return pncSource;
    const pnc = generatePncReviewBatch(request);
    if (pnc) return pnc;
    const auditedTsd = generateTsdAuditReviewBatch(request);
    if (auditedTsd) return auditedTsd;
    const timeSpeedDistance = await generateTsdEngineBatch(request);
    if (timeSpeedDistance) return timeSpeedDistance;

    const sapBanking = await generateSapBankingEngineBatch(request);
    if (sapBanking) return sapBanking;

    const integratedChapter = await generateInterestAlgebraEngineBatch(request);
    if (integratedChapter) return integratedChapter;

    const numberSystem = await generateNumberSystemEngineBatch(request);
    if (numberSystem) return numberSystem;

    const diMixRequest = toDiMixRequest(request);
    if (isDiDeliveryNoveltyMixRequest(diMixRequest)) {
      return generateDiDeliveryNoveltyMix(diMixRequest) as unknown as QuestionStudioGenerationResult;
    }

    const di001Request = toDi001Request(request);
    if (isDi001QuestionStudioRequest(di001Request)) {
      return generateDi001QuestionStudioBatch(di001Request) as unknown as QuestionStudioGenerationResult;
    }

    const di002Request = toDi002Request(request);
    if (isDi002QuestionStudioRequest(di002Request)) {
      return generateDi002QuestionStudioBatch(di002Request) as unknown as QuestionStudioGenerationResult;
    }

    const di003Request = toDi003Request(request);
    if (isDi003QuestionStudioRequest(di003Request)) {
      return generateDi003QuestionStudioBatch(di003Request) as unknown as QuestionStudioGenerationResult;
    }

    const di004Request = toDi004Request(request);
    if (isDi004QuestionStudioRequest(di004Request)) {
      return generateDi004QuestionStudioBatch(di004Request) as unknown as QuestionStudioGenerationResult;
    }

    const di005Request = toDi005Request(request);
    if (isDi005QuestionStudioRequest(di005Request)) {
      return generateDi005QuestionStudioBatch(di005Request) as unknown as QuestionStudioGenerationResult;
    }

    const di006Request = toDi006Request(request);
    if (isDi006QuestionStudioRequest(di006Request)) {
      return generateDi006QuestionStudioBatch(di006Request) as unknown as QuestionStudioGenerationResult;
    }

    const di007Request = toDi007Request(request);
    if (isDi007QuestionStudioRequest(di007Request)) {
      return generateDi007QuestionStudioBatch(di007Request) as unknown as QuestionStudioGenerationResult;
    }

    const di008Request = toDi008Request(request);
    if (isDi008QuestionStudioRequest(di008Request)) {
      return generateDi008QuestionStudioBatch(di008Request) as unknown as QuestionStudioGenerationResult;
    }

    const di010Request = toDi010Request(request);
    if (isDi010QuestionStudioRequest(di010Request)) {
      return generateDi010QuestionStudioBatch(di010Request) as unknown as QuestionStudioGenerationResult;
    }

    const di009Request = toDi009Request(request);
    if (isDi009QuestionStudioRequest(di009Request)) {
      return generateDi009QuestionStudioBatch(di009Request) as unknown as QuestionStudioGenerationResult;
    }

    const di011Request = toDi011Request(request);
    if (isDi011QuestionStudioRequest(di011Request)) {
      return generateDi011QuestionStudioBatch(di011Request) as unknown as QuestionStudioGenerationResult;
    }

    const di012Request = toDi012Request(request);
    if (isDi012QuestionStudioRequest(di012Request)) {
      return generateDi012QuestionStudioBatch(di012Request) as unknown as QuestionStudioGenerationResult;
    }

    const di013Request = toDi013Request(request);
    if (isDi013QuestionStudioRequest(di013Request)) {
      return generateDi013QuestionStudioBatch(di013Request) as unknown as QuestionStudioGenerationResult;
    }

    const di014Request = toDi014Request(request);
    if (isDi014QuestionStudioRequest(di014Request)) {
      return generateDi014QuestionStudioBatch(di014Request) as unknown as QuestionStudioGenerationResult;
    }

    const statRequest = toStatRequest(request);
    if (isStat014QuestionStudioRequest(statRequest)) {
      return generateStat014QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat013QuestionStudioRequest(statRequest)) {
      return generateStat013QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat012QuestionStudioRequest(statRequest)) {
      return generateStat012QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat011QuestionStudioRequest(statRequest)) {
      return generateStat011QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat010QuestionStudioRequest(statRequest)) {
      return generateStat010QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat009QuestionStudioRequest(statRequest)) {
      return generateStat009QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat008QuestionStudioRequest(statRequest)) {
      return generateStat008QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat007QuestionStudioRequest(statRequest)) {
      return generateStat007QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat006QuestionStudioRequest(statRequest)) {
      return generateStat006QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat005QuestionStudioRequest(statRequest)) {
      return generateStat005QuestionStudioBatchForAdapter(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat004QuestionStudioRequest(statRequest)) {
      return generateStat004QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat003QuestionStudioRequest(statRequest)) {
      return generateStat003QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat002QuestionStudioRequest(statRequest)) {
      return generateStat002QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }
    if (isStat001QuestionStudioRequest(statRequest)) {
      return generateStat001QuestionStudioBatch(statRequest) as unknown as QuestionStudioGenerationResult;
    }

    if (request.packageId === "MEN-002-REVIEW") {
      if (request.canonicalProblemId && request.canonicalProblemId !== "MEN-CP-009") {
        throw new Error("Unknown MEN-002 review checkpoint.");
      }
      const preview = previewMenCp009QuestionStudioReview({
        language: request.language ?? "en",
        count: request.count,
        seed: request.seed,
      });
      return {
        questions: preview.questions.map((q) => ({
          ...q,
          packageId: "MEN-002-REVIEW",
          text: q.stem,
          correct: q.correctIndex,
          explanation: q.explanation.steps.join("\n"),
        })),
        generationContext: {
          ...preview.generationContext,
          packageId: "MEN-002-REVIEW",
          reviewSurfaceRequired: true,
          manualApprovalRequired: true,
          questionBankWritable: false,
          productionReleaseAuthorized: false,
          automaticStudentPublication: false,
        },
      } as QuestionStudioGenerationResult;
    }

    if (request.packageId === "PRB-NATIVE-REVIEW") {
      if (request.language !== "hi" && request.language !== "pa") {
        throw new Error("Native Probability parity review supports only hi/pa.");
      }
      const catalog = listProbabilityNativeReviewCatalog();
      const selected = request.canonicalProblemId;
      const candidates = selected ? catalog.filter((entry) => entry.cpId === selected) : catalog;
      if (!candidates.length) throw new Error("Unknown Probability native-review CP.");
      const preview = previewProbabilityNativeReview({
        language: request.language,
        packageId: candidates[0].packageId,
        qlId: candidates[0].qlId,
        count: request.count,
        seed: request.seed,
      });
      return {
        questions: preview.questions.map((q) => ({
          ...q,
          packageId: "PRB-NATIVE-REVIEW",
          text: q.stem,
          correct: q.correctIndex,
          explanation: q.explanation.steps.join("\n"),
        })),
        generationContext: {
          ...preview.generationContext,
          packageId: "PRB-NATIVE-REVIEW",
          reviewSurfaceRequired: true,
          manualApprovalRequired: true,
          productionReleaseAuthorized: false,
          automaticStudentPublication: false,
        },
      } as QuestionStudioGenerationResult;
    }

    if (request.packageId === "PNL-001-REVIEW") {
      const result = await generateQuantV4Question({
        ...request,
        packageId: "PNL-001",
        runtimeMode: "DYNAMIC_CANDIDATE",
      } as any);
      return {
        ...result,
        generationContext: {
          ...(result.generationContext ?? {}),
          packageId: "PNL-001-REVIEW",
          lifecycleStage: "REVIEW_ONLY",
          reviewSurfaceRequired: true,
          manualApprovalRequired: true,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
          productionReleaseAuthorized: false,
        },
      } as QuestionStudioGenerationResult;
    }

    const result = await generateQuantV4Question({
      packageId: request.packageId as never,
      examProfile: request.examProfile as never,
      patternId: request.patternId,
      topic: request.topic,
      subtopic: request.subtopic,
      difficulty: request.difficulty as never,
      language: request.language,
      seed: request.seed,
      count: request.count,
      runtimeMode: request.runtimeMode as never,
      canonicalProblemId: request.canonicalProblemId,
      questionLanguageId: request.questionLanguageId,
    });

    return result as unknown as QuestionStudioGenerationResult;
  },
};
