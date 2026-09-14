import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  GEO_PHY_001_CP013_SOURCE_BATCHES_V1,
} from "../../knowledge-v1/indian-geography/physiography/geo-phy-001-cp013-review-batch-v1";
import { auditGeoPhy001ChapterClosureV1 } from "../../knowledge-v1/indian-geography/physiography/geo-phy-001-chapter-closure-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "GEO-PHY-001" as const;
export const GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const GEO_PHY_001_REVISION_POLICY_V1 = "CLOSED_OWNING_POOLS_ONLY" as const;
export const GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1 = "GEO-PHY-001-CONTENT-CLOSED-V1" as const;
export const GEO_PHY_001_MASTERY_AUTHORITY_ID_V1 = "GEO-PHY-001-CP013-EXHAUSTIVE-MASTERY-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

const closure = auditGeoPhy001ChapterClosureV1();
if (!closure.valid || closure.readiness !== "EXHAUSTIVE_AND_READY_TO_CLOSE") {
  throw new Error(`GEO-PHY-001 Question Studio registration blocked: ${closure.issues.join(" | ") || closure.readiness}`);
}

function normalizeLearnerText(text: string): string {
  return text
    .replace(/Consider the following statements:/gi, "Consider these statements:")
    .replace(/Which of the statements given above is\/are correct\?/gi, "Which statement(s) are correct?")
    .replace(/Which of the statements given above are correct\?/gi, "Which statements are correct?")
    .replace(/How many of the statements given above are correct\?/gi, "How many statements are correct?")
    .replace(/Which major physiographic division of India is described as /gi, "Which major physical region of India matches this description: ")
    .replace(/Which major physical region of India is described as /gi, "Which major physical region of India matches this description: ")
    .replace(/geologically young and structurally fold(?:ed)? mountains/gi, "young fold mountains")
    .replace(/structurally fold(?:ed)? mountains/gi, "fold mountains")
    .replace(/alluvial depositional plain/gi, "river-built plain")
    .replace(/offshore island groups/gi, "island groups")
    .replace(/offshore island region/gi, "island groups in the surrounding seas")
    .replace(/arid sandy region/gi, "dry sandy region")
    .replace(/young fold-mountain region/gi, "young fold mountains")
    .replace(/old stable tableland/gi, "old stable plateau")
    .replace(/physiographic divisions/gi, "major physical regions")
    .replace(/physiographic division/gi, "major physical region")
    .replace(/physiographic/gi, "physical")
    .replace(/physical division/gi, "physical region")
    .replace(/geologically/gi, "by age and formation")
    .replace(/correctly classified/gi, "correctly matched")
    .replace(/incorrectly classified/gi, "wrongly matched")
    .replace(/structurally folded/gi, "folded")
    .replace(/depositional surface/gi, "plain surface")
    .replace(/structural continuity/gi, "continuity")
    .replace(/relief contrast/gi, "landform contrast")
    .replace(/\bmajor major\b/gi, "major")
    .replace(/\bis broadly associated with\b/gi, "is found mainly in")
    .replace(/\bare broadly associated with\b/gi, "are found mainly in")
    .replace(/The Coastal Plains are described as a coastal lowland region/gi, "The Coastal Plains form a coastal lowland region")
    .replace(/The Islands are described as an? island groups in the surrounding seas/gi, "The Islands form island groups in the surrounding seas")
    .replace(/The Islands are described as an? island region/gi, "The Islands form island groups")
    .replace(/\bis described as an?\b/gi, "is")
    .replace(/\bare described as an?\b/gi, "are")
    .replace(/\bis old stable plateau\b/gi, "is an old stable plateau")
    .replace(/\bis dry sandy region\b/gi, "is a dry sandy region")
    .replace(/\bis river-built plain\b/gi, "is a river-built plain")
    .replace(/does not apply to The /g, "does not apply to the ")
    .replace(/while The /g, "while the ")
    .replace(/This description identifies The /g, "This describes the ")
    .replace(/\boffshore\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const sourceCpIds = GEO_PHY_001_CP013_SOURCE_BATCHES_V1.map(
  (batch) => `GEO-PHY-001-${batch.checkpoint}`,
);
const cpIds = Object.freeze([...sourceCpIds]);
const authorityByCp = Object.freeze(
  Object.fromEntries(cpIds.map((cpId) => [cpId, `${cpId}-CLOSED-REVIEW-V1`])) as Record<string, string>,
);

export const GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1 = GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1;

export const GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1 = Object.freeze(
  GEO_PHY_001_CP013_SOURCE_BATCHES_V1.flatMap((batch) => {
    const cpId = `GEO-PHY-001-${batch.checkpoint}`;
    return batch.questions.map((question) => {
      const canonicalAnswer = normalizeLearnerText(question.canonicalAnswer);
      const options = question.options.map((option) => normalizeLearnerText(option));
      const stem = normalizeLearnerText(question.stem);
      const explanation = normalizeLearnerText(question.explanation);
      const qlName = normalizeLearnerText(question.qlName);

      if (options.length !== 4 || new Set(options).size !== 4) {
        throw new Error(`GEO-PHY-001 normalized options are not unique for ${question.questionId}`);
      }
      if (options[question.correctIndex] !== canonicalAnswer) {
        throw new Error(`GEO-PHY-001 normalized answer mismatch for ${question.questionId}`);
      }

      return Object.freeze({
        questionId: question.questionId,
        cpId,
        qlId: question.qlId,
        qlName,
        difficulty: question.difficulty,
        stem,
        options: Object.freeze(options),
        correctIndex: question.correctIndex,
        canonicalAnswer,
        explanation,
        sourceIds: Object.freeze([...question.sourceIds]),
        sourceFactIds: Object.freeze([...question.sourceFactIds]),
      });
    });
  }),
);

const qlIds = Object.freeze([...new Set(GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1.map((question) => question.qlId))]);

function freezeAuthorityForCp(cpId: string) {
  const authorityId = authorityByCp[cpId];
  if (!authorityId) throw new Error(`Unknown GEO-PHY-001 closed CP ${cpId}`);
  return authorityId;
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (language === "en") return language;
  throw new Error(`GEO-PHY-001 currently supports English only; ${String(language)} is not closed`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("GEO-PHY-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("GEO-PHY-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function selectors(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectors(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value));
  const unknown = values.filter(
    (value) =>
      value !== GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown GEO-PHY-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting GEO-PHY-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting GEO-PHY-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId
    ? String(GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1.find((question) => question.qlId === qlId)?.cpId ?? "")
    : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting GEO-PHY-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const GEO_PHY_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Geography",
  subtopic: "Indian Physiography & Physical Divisions",
  label: "Static GK · Indian Geography · Physiography & Physical Divisions · CP001–CP012 Closed",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1,
    registrationAuthorityIds: cpIds.map((cpId) => freezeAuthorityForCp(cpId)),
    chapterCloseAuthorityId: GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
    masteryAuthorityId: GEO_PHY_001_MASTERY_AUTHORITY_ID_V1,
    masteryPermanentQlOwner: false,
    authoringReviewApproved: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    contentAuthorityVersion: GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1,
    permanentQlIds: [...qlIds],
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1.length,
    payloadsPerPermanentQl: closure.payloadsPerPermanentQl,
    exhaustiveMasterQuestionCount: closure.exhaustiveMasterQuestionCount,
    revisionPolicy: GEO_PHY_001_REVISION_POLICY_V1,
    difficultyFilterSupported: true,
    supportedDifficulties: [...supportedDifficulties],
    learnerLanguageNormalized: true,
    productionDifficultyClaimsAuthorized: false,
    explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
  },
};

export function isGeoPhy001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectors(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("GEO-PHY-001")) ||
    (subject === "static gk" && topic === "indian geography" && subtopic === "indian physiography & physical divisions") ||
    (topic === "indian geography" && subtopic === "indian physiography & physical divisions")
  );
}

export const knowledgeV1GeoPhy001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [GEO_PHY_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 GEO-PHY-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`GEO-PHY-001 only supports ${GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "geo-phy-001-question-studio-closed-v1";

    const candidates = GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`GEO-PHY-001 selectors produced no ${difficulty} closed questions`);
    if (count > candidates.length) {
      throw new Error(`GEO-PHY-001 cannot fill ${count} questions from a ${candidates.length}-question closed pool without repeats`);
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => {
      const registrationAuthorityId = freezeAuthorityForCp(question.cpId);
      return {
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.qlId,
        qlId: question.qlId,
        cpId: question.cpId,
        subject: "Static GK",
        topic: "Indian Geography",
        subtopic: "Indian Physiography & Physical Divisions",
        language,
        locale: "en-IN",
        stem: question.stem,
        text: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        correct: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        answer: question.canonicalAnswer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        difficultyLabel: question.difficulty,
        sourceIds: [...question.sourceIds],
        sourceFactIds: [...question.sourceFactIds],
        solverAuthority: "GEO_PHY_001_CONTENT_CLOSED_V1",
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId,
        authoringReviewApproved: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: GEO_PHY_001_REVISION_POLICY_V1,
        productionReleased: false,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
          registrationAuthorityId,
          runtimeMode: GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
          authoringReviewApproved: true,
          frozenCorpusOnly: true,
          immutableCorpus: true,
          contentAuthorityVersion: registrationAuthorityId,
          revisionPolicy: GEO_PHY_001_REVISION_POLICY_V1,
          productionDifficultyClaimAuthorized: false,
          explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
        },
      };
    });

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: GEO_PHY_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: GEO_PHY_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: cpId ? freezeAuthorityForCp(cpId) : GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1,
        authoringReviewApproved: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1,
        chapterCloseAuthorityId: GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
        masteryAuthorityId: GEO_PHY_001_MASTERY_AUTHORITY_ID_V1,
        revisionPolicy: GEO_PHY_001_REVISION_POLICY_V1,
        language,
        requestedDifficulty: difficulty,
        difficultyFilterApplied: difficulty !== "Mixed",
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "DETERMINISTIC_ACROSS_CLOSED_CPS",
        permanentQlIds: [...qlIds],
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        selectionMode: "CLOSED_GEO_PHY_001_CP001_CP012_DETERMINISTIC_WITHOUT_REPLACEMENT",
        explanationVisualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
        seed,
        count,
      },
    };
  },
};
