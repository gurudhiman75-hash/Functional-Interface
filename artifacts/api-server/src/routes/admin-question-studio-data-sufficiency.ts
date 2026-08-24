import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  DSF_CP002_DIFFICULTIES,
  DSF_CP002_DOMAINS,
  DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  type DsfStudioDifficulty,
  type DsfStudioDomainId,
  type DsfStudioSolveMode,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1";
import {
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
  generateDsfExamProfileBatch,
  type DsfExamAnswerProfileId,
  type DsfExamProfileQuestion,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-003/exam-answer-profiles-v1";
import {
  DSF_CP004_CHECKPOINT_ID,
  DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  DSF_CP004_QUESTION_BANK_PROFILE_IDS,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-004/question-bank-acceptance-v1";
import {
  DSF_CP005_CHECKPOINT_ID,
  DSF_CP005_TEST_RELEASE_AUTHORITY,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-005/test-release-v1";
import {
  DSF_CP006_CHECKPOINT_ID,
  DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
  DSF_CP006_QUESTION_STUDIO_PACKAGE,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-006/mock-test-release-v1";
import {
  DSF_CP008_CHECKPOINT_ID,
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_SUPPORTED_LANGUAGES,
  type DsfLocalizedExamProfileQuestion,
  type DsfLocalizedLanguage,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-008/localization-review-v1";
import {
  DSF_CP009_CHECKPOINT_ID,
  DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
  generateDsfApprovedLocalizedExamProfileBatch,
  type DsfApprovedLocalizedExamProfileQuestion,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-009/localization-approval-release-v1";
import { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/foundation";

const router = Router();
const DOMAIN_IDS = new Set<string>(DSF_CP002_DOMAINS.map((domain) => domain.id));
const SOLVE_MODES = new Set<string>(DSF_CP002_DOMAINS.flatMap((domain) => [...domain.solveModes]));
const DIFFICULTIES = new Set<string>(DSF_CP002_DIFFICULTIES);
const SEMANTIC_CLASSES = new Set<string>(SUFFICIENCY_CLASSES);
const LANGUAGES = new Set<string>(DSF_CP008_SUPPORTED_LANGUAGES);
const ANSWER_PROFILES = new Set<string>(DSF_CP004_QUESTION_BANK_PROFILE_IDS);

type DsfRequestLanguage = "en" | DsfLocalizedLanguage;
type DsfRequestFilters = {
  readonly language: DsfRequestLanguage;
  readonly answerProfile: DsfExamAnswerProfileId;
  readonly domain?: DsfStudioDomainId;
  readonly solveMode?: DsfStudioSolveMode;
  readonly semanticClass?: SufficiencyClass;
  readonly difficulty?: DsfStudioDifficulty;
};
type DsfReviewQuestion = DsfExamProfileQuestion | DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `DSF-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>): DsfRequestFilters {
  const language = asString(source.language) || "en";
  const answerProfile = asString(source.answerProfile) || "GENERIC_DS_STANDARD_5_EN";
  const domain = asString(source.domain);
  const solveMode = asString(source.solveMode);
  const semanticClass = asString(source.semanticClass);
  const difficulty = asString(source.difficulty);

  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Data Sufficiency language '${language}'.`);
  if (!ANSWER_PROFILES.has(answerProfile)) throw new Error(`Unsupported Data Sufficiency answer profile '${answerProfile}'.`);
  if (domain && !DOMAIN_IDS.has(domain)) throw new Error(`Unsupported Data Sufficiency domain '${domain}'.`);
  if (solveMode && !SOLVE_MODES.has(solveMode)) throw new Error(`Unsupported Data Sufficiency solve mode '${solveMode}'.`);
  if (semanticClass && !SEMANTIC_CLASSES.has(semanticClass)) throw new Error(`Unsupported sufficiency class '${semanticClass}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported Data Sufficiency difficulty '${difficulty}'.`);

  if (domain && solveMode) {
    const domainEntry = DSF_CP002_DOMAINS.find((entry) => entry.id === domain)!;
    if (!domainEntry.solveModes.includes(solveMode as never)) throw new Error(`${solveMode} does not belong to ${domain}.`);
  }

  return {
    language: language as DsfRequestLanguage,
    answerProfile: answerProfile as DsfExamAnswerProfileId,
    domain: domain ? domain as DsfStudioDomainId : undefined,
    solveMode: solveMode ? solveMode as DsfStudioSolveMode : undefined,
    semanticClass: semanticClass ? semanticClass as SufficiencyClass : undefined,
    difficulty: difficulty ? difficulty as DsfStudioDifficulty : undefined,
  };
}

function isLocalizedQuestion(question: DsfReviewQuestion): question is DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion {
  return "localizationAuthority" in question;
}

function isApprovedLocalizedQuestion(question: DsfReviewQuestion): question is DsfApprovedLocalizedExamProfileQuestion {
  return "localizationApprovalAuthority" in question;
}

function generateReviewBatch(filters: DsfRequestFilters, seed: string, count: number) {
  const shared = {
    seed,
    count,
    answerProfile: filters.answerProfile,
    domain: filters.domain,
    solveMode: filters.solveMode,
    semanticClass: filters.semanticClass,
    difficulty: filters.difficulty,
  };
  return filters.language === "en"
    ? generateDsfExamProfileBatch({ ...shared, language: "en" })
    : generateDsfApprovedLocalizedExamProfileBatch({ ...shared, language: filters.language });
}

export function dsfCp004ReviewPayload(question: DsfExamProfileQuestion) {
  if (!DSF_CP004_QUESTION_BANK_PROFILE_IDS.includes(question.answerProfile as never)) {
    throw new Error(`Answer profile ${question.answerProfile} is not approved for DSF Question Bank acceptance.`);
  }
  const correctOption = question.options[question.correctIndex]!;
  const text = `${question.stem}\nI. ${question.statements[0].text}\nII. ${question.statements[1].text}`;
  return {
    text,
    stem: question.stem,
    questionPrompt: question.questionPrompt,
    statements: question.statements,
    options: question.options.map((option) => option.value),
    optionDetails: question.options.map((option) => ({
      label: option.key,
      text: option.value,
      isCorrect: option.isCorrect,
      semanticClass: option.semanticClass,
    })),
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: correctOption.value,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    qlId: question.qlId,
    packageId: question.packageId,
    sourceCheckpointId: question.sourceCheckpointId,
    integrationCheckpointId: question.integrationCheckpointId,
    profileCheckpointId: question.profileCheckpointId,
    questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
    questionId: question.questionId,
    sourceQuestionId: question.sourceQuestionId,
    sourceGenerationIdentity: question.sourceGenerationIdentity,
    sourceChapterId: question.sourceChapterId,
    solveMode: question.solveModeId,
    targetKind: question.targetKind,
    domain: question.domain,
    domainLabel: question.domainLabel,
    topic: "Data Sufficiency",
    subtopic: question.domainLabel,
    subject: "Reasoning",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    answerProfile: question.answerProfile,
    examFamily: question.examFamily,
    profileEvidenceLevel: question.profileEvidenceLevel,
    profileSourcePatternIds: question.profileSourcePatternIds,
    profileRepresentedSemanticClasses: question.profileRepresentedSemanticClasses,
    profileOmittedSemanticClasses: question.profileOmittedSemanticClasses,
    renderer: "TEXT_MATH" as const,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: question.integrationAuthority,
    deliveryProfileAuthority: question.deliveryProfileAuthority,
    sourceFreezeAuthority: question.sourceFreezeAuthority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      chapter: "Data Sufficiency" as const,
      packageId: question.packageId,
      qlId: question.qlId,
      sourceChapterId: question.sourceChapterId,
      domain: question.domain,
      solveMode: question.solveModeId,
      semanticClass: question.canonicalAnswer,
      difficulty: question.difficulty,
      language: question.language,
      locale: question.locale,
      answerProfile: question.answerProfile,
      examFamily: question.examFamily,
      integrationAuthority: question.integrationAuthority,
      deliveryProfileAuthority: question.deliveryProfileAuthority,
      sourceFreezeAuthority: question.sourceFreezeAuthority,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      reviewOnly: false as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "BANK_ONLY" as const,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  };
}

export function dsfCp005ReviewPayload(question: DsfExamProfileQuestion) {
  const payload = dsfCp004ReviewPayload(question);
  return {
    ...payload,
    testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
    testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: false as const,
    automaticStudentPublication: false as const,
    generationContext: {
      ...payload.generationContext,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      questionBankAcceptanceMode: "FULL_RELEASE" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      publiclyPublishable: true as const,
      mockTestEligible: false as const,
      automaticStudentPublication: false as const,
    },
  };
}

export function dsfCp006ReviewPayload(question: DsfExamProfileQuestion) {
  const payload = dsfCp005ReviewPayload(question);
  return {
    ...payload,
    mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
    mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
    generationContext: {
      ...payload.generationContext,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      mockTestEligible: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

export function dsfCp008LocalizedReviewPayload(question: DsfLocalizedExamProfileQuestion | DsfApprovedLocalizedExamProfileQuestion) {
  const correctOption = question.options[question.correctIndex]!;
  return {
    text: `${question.stem}\nI. ${question.statements[0].text}\nII. ${question.statements[1].text}`,
    stem: question.stem,
    questionPrompt: question.questionPrompt,
    statements: question.statements,
    options: question.options.map((option) => option.value),
    optionDetails: question.options.map((option) => ({
      label: option.key,
      text: option.value,
      isCorrect: option.isCorrect,
      semanticClass: option.semanticClass,
    })),
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: correctOption.value,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    qlId: question.qlId,
    packageId: question.packageId,
    sourceCheckpointId: question.sourceCheckpointId,
    integrationCheckpointId: question.integrationCheckpointId,
    profileCheckpointId: question.profileCheckpointId,
    localizationCheckpointId: question.localizationCheckpointId,
    localizationAuthority: question.localizationAuthority,
    localization: question.localization,
    canonicalEnglishProfileQuestionId: question.canonicalEnglishProfileQuestionId,
    questionId: question.questionId,
    sourceQuestionId: question.sourceQuestionId,
    sourceGenerationIdentity: question.sourceGenerationIdentity,
    sourceChapterId: question.sourceChapterId,
    solveMode: question.solveModeId,
    targetKind: question.targetKind,
    domain: question.domain,
    domainLabel: question.domainLabel,
    topic: "Data Sufficiency",
    subtopic: question.domainLabel,
    subject: "Reasoning",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    answerProfile: question.answerProfile,
    examFamily: question.examFamily,
    profileEvidenceLevel: question.profileEvidenceLevel,
    profileSourcePatternIds: question.profileSourcePatternIds,
    profileRepresentedSemanticClasses: question.profileRepresentedSemanticClasses,
    profileOmittedSemanticClasses: question.profileOmittedSemanticClasses,
    renderer: "TEXT_MATH" as const,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "LOCALIZATION_REVIEW_QUEUE" as const,
    reviewOnly: true as const,
    humanLanguageReviewRequired: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: question.integrationAuthority,
    deliveryProfileAuthority: question.deliveryProfileAuthority,
    sourceFreezeAuthority: question.sourceFreezeAuthority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      chapter: "Data Sufficiency" as const,
      packageId: question.packageId,
      qlId: question.qlId,
      sourceChapterId: question.sourceChapterId,
      domain: question.domain,
      solveMode: question.solveModeId,
      semanticClass: question.canonicalAnswer,
      difficulty: question.difficulty,
      language: question.language,
      locale: question.locale,
      answerProfile: question.answerProfile,
      examFamily: question.examFamily,
      integrationAuthority: question.integrationAuthority,
      deliveryProfileAuthority: question.deliveryProfileAuthority,
      localizationCheckpointId: question.localizationCheckpointId,
      localizationAuthority: question.localizationAuthority,
      canonicalEnglishProfileQuestionId: question.canonicalEnglishProfileQuestionId,
      sourceFreezeAuthority: question.sourceFreezeAuthority,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      humanLanguageReviewRequired: true as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  };
}

export function dsfCp009LocalizedReleasePayload(question: DsfApprovedLocalizedExamProfileQuestion) {
  const payload = dsfCp008LocalizedReviewPayload(question);
  return {
    ...payload,
    localizationApprovalCheckpointId: question.localizationApprovalCheckpointId,
    localizationApprovalAuthority: question.localizationApprovalAuthority,
    localizationApproval: question.localizationApproval,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    reviewOnly: false as const,
    humanLanguageReviewRequired: false as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
    questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
    testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
    mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
    mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
    generationContext: {
      ...payload.generationContext,
      localizationApprovalCheckpointId: question.localizationApprovalCheckpointId,
      localizationApprovalAuthority: question.localizationApprovalAuthority,
      reviewOnly: false as const,
      humanLanguageReviewRequired: false as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "FULL_RELEASE" as const,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      manualQuestionPublicationRequired: true as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      publiclyPublishable: true as const,
      mockTestEligible: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

async function persistRun(
  questions: readonly DsfReviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Data Sufficiency questions matched the request.");
  const runId = randomUUID();
  const publicCode = publicRunCode();
  const timestamp = new Date().toISOString();
  const localized = isLocalizedQuestion(questions[0]!);
  const approvedLocalized = isApprovedLocalizedQuestion(questions[0]!);

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', ${approvedLocalized ? "reasoning-v1-dsf-cp009-hi-pa-localization-release-v1" : localized ? "reasoning-v1-dsf-cp008-localization-review-v1" : "reasoning-v1-dsf-cp006-mock-test-release-v1"},
        0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      if (isLocalizedQuestion(question) !== localized) {
        throw new Error("DSF review run cannot mix English production and localized review payloads.");
      }
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = isApprovedLocalizedQuestion(question)
        ? dsfCp009LocalizedReleasePayload(question)
        : isLocalizedQuestion(question)
          ? dsfCp008LocalizedReviewPayload(question)
          : dsfCp006ReviewPayload(question);
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb,
          ${question.questionId}, ${timestamp}
        )
      `;
    }

    const auditReason = localized
      ? "DSF-CP-009 Hindi/Punjabi localization is product-owner approved; items require manual generation approval, explicit Question Bank publication and canonical test/test-series QA while automatic student publication remains locked"
      : "DSF-CP-006 items require manual approval, manual Question Bank publication and normal test QA; mock-test eligibility is enabled while automatic student publication remains locked";
    const auditSummary = localized
      ? `Created ${questions.length} Data Sufficiency approved localized production-review items in ${publicCode}`
      : `Created ${questions.length} Data Sufficiency mock-eligible review items in ${publicCode}`;

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.data_sufficiency_run.created', 'generation_run', ${runId}::uuid,
        ${auditReason}, ${auditSummary},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
          deliveryProfileAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
          questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
          testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
          mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
          ...(localized ? {
            localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
            localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
            localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
            localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
          } : {}),
          humanLanguageReviewRequired: false,
          questionBankWritable: true,
          questionBankAcceptanceMode: "FULL_RELEASE",
          testEligible: true,
          publiclyPublishable: true,
          mockTestEligible: true,
          sourceFreezeAuthority: DSF_CP006_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
          permanentQlIds: DSF_CP006_QUESTION_STUDIO_PACKAGE.permanentQlIds,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

function lifecycleForLanguage(_language: DsfRequestLanguage) {
  return {
    humanLanguageReviewRequired: false as const,
    questionBankAcceptanceEnabled: true as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
  };
}

router.use(authenticate);

router.get("/reasoning/data-sufficiency/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "reasoning-v1",
    activationMode: "MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED",
    localizationReviewMode: "HI_PA_PRODUCT_OWNER_APPROVED",
    localizationReleaseMode: "HI_PA_PRODUCT_OWNER_APPROVED",
    package: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
    maxBatchSize: 50,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    manualReviewRequired: true,
    manualQuestionPublicationRequired: true,
    questionBankAcceptanceEnabled: true,
    questionBankWriteEnabled: true,
    questionBankAcceptanceMode: "FULL_RELEASE",
    questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
    questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
    testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
    mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
    mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
    localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
    localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
    localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
    localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
    localizedHumanReviewRequired: false,
    localizedQuestionBankWritable: true,
    localizedTestEligible: true,
    localizedMockTestEligible: true,
    localizedPubliclyPublishable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: true,
    automaticStudentPublication: false,
  });
});

router.get("/reasoning/data-sufficiency/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateReviewBatch(
      filters,
      asString(req.query.seed) || "dsf-question-studio-preview",
      asCount(req.query.count, 1, 20),
    );
    const lifecycle = lifecycleForLanguage(filters.language);
    res.json({
      ...result,
      productionEligible: false,
      manualReviewRequired: true,
      manualQuestionPublicationRequired: true,
      localizationCheckpointId: filters.language === "en" ? undefined : DSF_CP008_CHECKPOINT_ID,
      localizationAuthority: filters.language === "en" ? undefined : DSF_CP008_LOCALIZATION_AUTHORITY,
      localizationApprovalCheckpointId: filters.language === "en" ? undefined : DSF_CP009_CHECKPOINT_ID,
      localizationApprovalAuthority: filters.language === "en" ? undefined : DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
      ...lifecycle,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Data Sufficiency questions." });
  }
});

router.post("/reasoning/data-sufficiency/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }

  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `dsf-run:${Date.now()}`;
    const result = generateReviewBatch(filters, seed, count);
    const lifecycle = lifecycleForLanguage(filters.language);
    const persisted = await persistRun(result.questions, {
      chapter: "Data Sufficiency",
      domain: filters.domain ?? null,
      solveMode: filters.solveMode ?? null,
      semanticClass: filters.semanticClass ?? null,
      difficulty: filters.difficulty ?? null,
      language: filters.language,
      answerProfile: filters.answerProfile,
      count,
      seed,
      integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
      deliveryProfileAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      ...(filters.language === "en" ? {} : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
        localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
        localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
        humanLanguageReviewRequired: false,
      }),
      sourceFreezeAuthority: DSF_CP006_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      manualApprovalRequired: true,
      manualQuestionPublicationRequired: true,
      questionBankStatus: "READY_FOR_STORAGE",
      ...lifecycle,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);

    res.status(201).json({
      ...persisted,
      generationSystem: "reasoning-v1",
      chapter: "Data Sufficiency",
      language: filters.language,
      answerProfile: filters.answerProfile,
      deliveryProfileAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      ...(filters.language === "en" ? {} : {
        localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
        localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
        localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
        localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
      }),
      manualReviewRequired: true,
      manualQuestionPublicationRequired: true,
      ...lifecycle,
    });
  } catch (error) {
    console.error("Data Sufficiency Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Data Sufficiency review run." });
  }
});

router.get("/reasoning/data-sufficiency/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount",
        count(*) FILTER (WHERE v.payload ->> 'questionBankAcceptanceAuthority' = ${DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY})::int AS "cp004GenerationItemCount",
        count(*) FILTER (WHERE v.payload ->> 'testReleaseAuthority' = ${DSF_CP005_TEST_RELEASE_AUTHORITY})::int AS "cp005GenerationItemCount",
        count(*) FILTER (WHERE v.payload ->> 'mockTestReleaseAuthority' = ${DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY})::int AS "cp006GenerationItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationAuthority' = ${DSF_CP008_LOCALIZATION_AUTHORITY})::int AS "cp008GenerationItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationApprovalAuthority' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY})::int AS "cp009GenerationItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationAuthority' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> 'language' = 'hi' AND v.payload ->> 'localizationApprovalAuthority' IS NULL)::int AS "hindiReviewItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationApprovalAuthority' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY} AND v.payload ->> 'language' = 'hi')::int AS "hindiReleaseItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationAuthority' = ${DSF_CP008_LOCALIZATION_AUTHORITY} AND v.payload ->> 'language' = 'pa' AND v.payload ->> 'localizationApprovalAuthority' IS NULL)::int AS "punjabiReviewItemCount",
        count(*) FILTER (WHERE v.payload ->> 'localizationApprovalAuthority' = ${DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY} AND v.payload ->> 'language' = 'pa')::int AS "punjabiReleaseItemCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'integrationAuthority' = ${DSF_CP002_QUESTION_STUDIO_AUTHORITY}
    `;

    res.json({
      chapter: "Data Sufficiency",
      permanentQlCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.permanentQlIds.length,
      domainCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.domains.length,
      solveModeCount: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.solveModeCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      cp004GenerationItemCount: Number(rows[0]?.cp004GenerationItemCount ?? 0),
      cp005GenerationItemCount: Number(rows[0]?.cp005GenerationItemCount ?? 0),
      cp006GenerationItemCount: Number(rows[0]?.cp006GenerationItemCount ?? 0),
      cp008GenerationItemCount: Number(rows[0]?.cp008GenerationItemCount ?? 0),
      cp009GenerationItemCount: Number(rows[0]?.cp009GenerationItemCount ?? 0),
      hindiReviewItemCount: Number(rows[0]?.hindiReviewItemCount ?? 0),
      hindiReleaseItemCount: Number(rows[0]?.hindiReleaseItemCount ?? 0),
      punjabiReviewItemCount: Number(rows[0]?.punjabiReviewItemCount ?? 0),
      punjabiReleaseItemCount: Number(rows[0]?.punjabiReleaseItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
      deliveryProfileAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
      questionBankAcceptanceCheckpointId: DSF_CP004_CHECKPOINT_ID,
      questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
      testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
      mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID,
      mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
      localizationCheckpointId: DSF_CP008_CHECKPOINT_ID,
      localizationAuthority: DSF_CP008_LOCALIZATION_AUTHORITY,
      localizationStatus: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationStatus,
      localizationApprovalCheckpointId: DSF_CP009_CHECKPOINT_ID,
      localizationApprovalAuthority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
      localizedHumanReviewRequired: false,
      sourceFreezeAuthority: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.sourceFreezeAuthority,
      supportedLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedLanguages,
      productionLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages,
      localizationReviewLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationReviewLanguages,
      perLanguageLifecycle: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle,
      supportedAnswerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedAnswerProfiles,
      answerProfiles: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.answerProfiles,
      supportedExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.supportedExamFamilies,
      disabledExamFamilies: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.disabledExamFamilies,
      examSpecificAnswerProfilesImplemented: true,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      manualReviewRequired: true,
      manualQuestionPublicationRequired: true,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankAcceptanceEnabled: true,
      questionBankWritable: true,
      questionBankAcceptanceMode: "FULL_RELEASE",
      testEligibility: "ELIGIBLE",
      testEligible: true,
      mockTestEligible: true,
      publiclyPublishable: true,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("Data Sufficiency Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Data Sufficiency Question Studio status." });
  }
});

export default router;
