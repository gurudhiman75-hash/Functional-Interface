import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  PGK_001_MATCH_FOLLOWING_CONCEPTS_V1,
  generatePgkMatchFollowingReviewV1,
  type PgkMatchingLocaleV1,
} from "../../knowledge-v1/punjab-gk/localization-v1/pgk-match-following-extension-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1 = "PGK-001-MTF-V1" as const;
export const PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1 = "review-only" as const;
export const PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1 =
  "PGK-001-MATCH-FOLLOWING-EXTENSION-V1-APPROVED-2026-09-26" as const;
export const PGK_001_MATCH_FOLLOWING_REVISION_POLICY_V1 =
  "APPROVED_EXTENSION_SOURCE_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Medium", "Hard"] as const;
const conceptIds = PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.map((concept) => concept.id);
const cpIds = [...new Set(PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.map((concept) => concept.cpId))].sort();

if (PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.length !== 24) {
  throw new Error(
    `PGK-001 matching Question Studio registration requires 24 approved concepts; found ${PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.length}`,
  );
}
if (cpIds.length !== 12) {
  throw new Error(
    `PGK-001 matching Question Studio registration requires 12 selected CPs; found ${cpIds.length}`,
  );
}
if (new Set(conceptIds).size !== conceptIds.length) {
  throw new Error("PGK-001 matching extension contains duplicate concept IDs");
}

function normalizeLanguage(
  language: QuestionStudioGenerationRequest["language"],
): PgkMatchingLocaleV1 {
  if (!language || language === "en") return "en";
  if (language === "hi" || language === "pa") return language;
  throw new Error(`PGK-001 matching extension does not support language ${String(language)}`);
}

function localeFor(language: PgkMatchingLocaleV1) {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 24) {
    throw new Error("PGK-001 matching review batches require count between 1 and 24");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("PGK-001 matching extension supports Medium, Hard, or Mixed difficulty");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^PGK-001-CP(\d{3})$/);
  return compactCp ? `PGK-001-CP-${compactCp[1]}` : raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const conceptMatches = values.filter((value) => conceptIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value));
  const questionLanguageMatches = values
    .map((value) => value.match(/^(PGK-001-MTF-\d{3})-(EN|HI|PA)$/)?.[1])
    .filter((value): value is string => Boolean(value));

  const allConceptMatches = [...conceptMatches, ...questionLanguageMatches];
  const unknown = values.filter(
    (value) =>
      value !== PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1 &&
      !conceptIds.includes(value) &&
      !cpIds.includes(value) &&
      !/^PGK-001-MTF-\d{3}-(EN|HI|PA)$/.test(value),
  );

  if (unknown.length) {
    throw new Error(`Unknown PGK-001 matching selector ${unknown[0]}`);
  }
  if (new Set(allConceptMatches).size > 1) {
    throw new Error(
      `Conflicting PGK-001 matching concept selectors ${allConceptMatches.join(", ")}`,
    );
  }
  if (new Set(cpMatches).size > 1) {
    throw new Error(`Conflicting PGK-001 matching CP selectors ${cpMatches.join(", ")}`);
  }

  const conceptId = allConceptMatches[0];
  const explicitCpId = cpMatches[0];
  const conceptCpId = conceptId
    ? PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.find((concept) => concept.id === conceptId)?.cpId
    : undefined;

  if (explicitCpId && conceptCpId && explicitCpId !== conceptCpId) {
    throw new Error(
      `Conflicting PGK-001 matching CP/concept selectors ${explicitCpId} and ${conceptId}`,
    );
  }

  return { conceptId, cpId: explicitCpId ?? conceptCpId };
}

export const PGK_001_MATCH_FOLLOWING_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Punjab GK",
  subtopic: "Match the Following",
  label: "Static GK · Punjab GK · Match the Following · Approved V1",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1,
  supportedRuntimeModes: [PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle,
    registrationAuthorityId: PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    formatReviewApproved: true,
    reviewOnly: true,
    additiveExtension: true,
    frozenCoreQuestionCount: 1092,
    frozenCoreModified: false,
    questionType: "Match the Following",
    matchingConceptCount: conceptIds.length,
    reviewSurfaceCount: conceptIds.length * supportedLanguages.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    conceptIds: [...conceptIds],
    supportedLanguages: [...supportedLanguages],
    supportedDifficulties: [...supportedDifficulties],
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: PGK_001_MATCH_FOLLOWING_REVISION_POLICY_V1,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isPgk001MatchFollowingQuestionStudioRequestV1(
  request: QuestionStudioGenerationRequest,
) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1;

  const values = selectorValues(request);
  return values.some(
    (value) =>
      conceptIds.includes(value) ||
      /^PGK-001-MTF-\d{3}-(EN|HI|PA)$/.test(value),
  );
}

export const knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1:
  QuestionStudioEngineAdapter = {
    engineId: "knowledge-v1",

    listPackages() {
      return [PGK_001_MATCH_FOLLOWING_REVIEW_ONLY_PACKAGE_V1];
    },

    async generate(
      request: QuestionStudioGenerationRequest,
    ): Promise<QuestionStudioGenerationResult> {
      const packageId = String(request.packageId ?? "").trim().toUpperCase();
      if (packageId && packageId !== PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1) {
        throw new Error(
          `PGK-001 matching adapter cannot generate package ${String(request.packageId)}`,
        );
      }
      if (
        request.runtimeMode &&
        request.runtimeMode !== PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1
      ) {
        throw new Error(
          `PGK-001 matching extension only supports ${PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1} runtime`,
        );
      }

      const language = normalizeLanguage(request.language);
      const count = normalizeCount(request.count);
      const difficulty = normalizeDifficulty(request.difficulty);
      const { conceptId, cpId } = normalizeSelectors(request);
      const seed = request.seed?.trim() || "pgk-001-match-following-question-studio-v1";

      const candidates = generatePgkMatchFollowingReviewV1(language).filter(
        (question) =>
          (!cpId || question.cpId === cpId) &&
          (!conceptId || question.questionId.startsWith(`${conceptId}-`)) &&
          (difficulty === "Mixed" || question.difficulty === difficulty),
      );

      if (!candidates.length) {
        throw new Error(
          `PGK-001 matching selectors produced no ${difficulty} approved questions`,
        );
      }
      if (count > candidates.length) {
        throw new Error(
          `PGK-001 matching extension cannot fill ${count} questions from a ${candidates.length}-question approved pool without repeats`,
        );
      }

      const selected = deterministicShuffle(
        candidates,
        `${seed}:${language}:${cpId ?? "ALL_CPS"}:${conceptId ?? "ALL_CONCEPTS"}:${difficulty}`,
      ).slice(0, count);

      const questions = selected.map((question) => {
        const canonicalProblemId = question.questionId.replace(/-(EN|HI|PA)$/, "");
        return {
          ...lifecycle,
          id: question.questionId,
          questionId: question.questionId,
          questionLanguageId: question.questionId,
          packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
          canonicalProblemId,
          patternId: canonicalProblemId,
          cpId: question.cpId,
          sourceQlIds: [...question.sourceQlIds],
          subject: "Static GK",
          topic: "Punjab GK",
          subtopic: "Match the Following",
          questionType: "Match the Following",
          language,
          locale: localeFor(language),
          stem: question.stem,
          text: question.stem,
          listI: [...question.listI],
          listII: [...question.listII],
          options: [...question.options],
          correctIndex: question.correctIndex,
          correct: question.correctIndex,
          canonicalAnswer: question.canonicalAnswer,
          answer: question.canonicalAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          difficultyLabel: question.difficulty,
          renderer: {
            kind: "MATCH_LISTS",
            listI: [...question.listI],
            listII: [...question.listII],
            answerCodeOptions: [...question.options],
            textFallbackAvailable: true,
          },
          registrationStatus: "REGISTERED_REVIEW_ONLY",
          registrationAuthorityId: PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
          authoringReviewApproved: true,
          formatReviewApproved: true,
          questionStudioDiscoverable: true,
          questionStudioGenerationEnabled: true,
          reviewOnly: true,
          runtimeRegistered: true,
          readOnly: true,
          additiveExtension: true,
          frozenCoreQuestionCount: 1092,
          frozenCoreModified: false,
          revisionPolicy: PGK_001_MATCH_FOLLOWING_REVISION_POLICY_V1,
          productionReleased: false,
        };
      });

      return {
        questions,
        generationContext: {
          ...lifecycle,
          engineId: "knowledge-v1",
          packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
          runtimeMode: PGK_001_MATCH_FOLLOWING_RUNTIME_MODE_V1,
          registrationStatus: "REGISTERED_REVIEW_ONLY",
          registrationAuthorityId: PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
          authoringReviewApproved: true,
          formatReviewApproved: true,
          reviewOnly: true,
          additiveExtension: true,
          frozenCoreQuestionCount: 1092,
          frozenCoreModified: false,
          questionType: "Match the Following",
          deterministicSelection: true,
          selectionWithoutReplacement: true,
          revisionPolicy: PGK_001_MATCH_FOLLOWING_REVISION_POLICY_V1,
          language,
          difficulty,
          cpId: cpId ?? null,
          conceptId: conceptId ?? null,
          seed,
          requestedCount: count,
          candidateCount: candidates.length,
          matchingConceptCount: conceptIds.length,
          cpCount: cpIds.length,
        },
      };
    },
  };
