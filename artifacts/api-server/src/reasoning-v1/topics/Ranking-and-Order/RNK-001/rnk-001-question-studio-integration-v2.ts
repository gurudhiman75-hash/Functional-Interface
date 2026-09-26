import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";
import { declutterRnkExplanation } from "./rnk-001-explanation-declutter-v1";
import {
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  listRnk001QuestionStudioQlIds,
  previewRnk001QuestionStudioReview,
  type RnkQuestionStudioDifficulty,
  type RnkQuestionStudioExamProfileId,
} from "./question-studio-multilingual-review-v1";

export const RNK001_QUESTION_STUDIO_PACKAGE_ID_V2 = "RNK-001" as const;
export const RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2 = "review-only" as const;
export const RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2 =
  "RNK-001-FINAL-AUDIT-RECOVERY-QUESTION-STUDIO-V2" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = listRnk001QuestionStudioQlIds();
const cpIds = Object.keys(RNK_001_CHAPTER_AUTHORITY.checkpointRanges);
const qlCpIds = cpIds.filter((cpId) => cpId !== "RNK-CP-008");

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("RNK-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`RNK-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: unknown): RnkQuestionStudioDifficulty | "Mixed" | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return "Mixed";
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`RNK-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function resolveExamProfile(value: unknown): RnkQuestionStudioExamProfileId {
  const normalized = text(value).toLowerCase();
  if (!normalized) return "CHAPTER_COVERAGE";
  if (/\bcgl\b/u.test(normalized)) return "SSC_CGL_T1";
  if (/\bchsl\b/u.test(normalized)) return "SSC_CHSL_T1";
  if (/\bmts\b/u.test(normalized)) return "SSC_MTS";
  if (/\bibps\b.*\bpo\b|\bsbi\b.*\bpo\b|\bbank\b.*\bpo\b/u.test(normalized)) return "IBPS_PO_PRE";
  if (/\bibps\b.*\bclerk\b|\bsbi\b.*\bclerk\b|\bbank\b.*\bclerk\b/u.test(normalized)) return "IBPS_CLERK_PRE";
  if (/\bexcise\b/u.test(normalized)) return "PUNJAB_EXCISE_INSP";
  if (/\bpunjab\b.*\bpolice\b/u.test(normalized)) return "PUNJAB_POLICE";
  if (/\bpsssb\b|\bpunjab\b.*\bclerk\b/u.test(normalized)) return "PUNJAB_PSSSB_CLERK";
  if (/\bssc\b/u.test(normalized)) return "SSC_CGL_T1";
  if (/\bbank\b|\bibps\b|\bsbi\b/u.test(normalized)) return "IBPS_CLERK_PRE";
  if (/\bpunjab\b/u.test(normalized)) return "PUNJAB_PSSSB_CLERK";
  return "CHAPTER_COVERAGE";
}

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid RNK QL id '${qlId}'.`);
  return Number(match[1]);
}

function checkpointForQl(qlId: string): string {
  const value = qlNumber(qlId);
  if (value <= 9) return "RNK-CP-001";
  if (value <= 17) return "RNK-CP-002";
  if (value <= 26) return "RNK-CP-003";
  if (value <= 35) return "RNK-CP-004";
  if (value <= 38) return "RNK-CP-005";
  if (value <= 41) return "RNK-CP-006";
  return "RNK-CP-007";
}

function qlsForCheckpoint(cpId: string): string[] {
  if (!qlCpIds.includes(cpId)) {
    if (cpId === "RNK-CP-008") {
      throw new Error("RNK-CP-008 is derivation/caselet infrastructure and owns no permanent QL.");
    }
    throw new Error(`Unknown RNK-001 checkpoint ${cpId}`);
  }
  return qlIds.filter((qlId) => checkpointForQl(qlId) === cpId);
}

function selectors(request: QuestionStudioGenerationRequest): string[] {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
}

function resolveSelection(request: QuestionStudioGenerationRequest):
  | { kind: "ql"; qlId: string }
  | { kind: "cp"; cpId: string }
  | { kind: "chapter" } {
  const values = selectors(request);
  const known = new Set<string>([RNK001_QUESTION_STUDIO_PACKAGE_ID_V2, ...qlIds, ...cpIds]);
  const unknown = values.find((value) => value.startsWith("RNK-") && !known.has(value));
  if (unknown) throw new Error(`Unknown RNK-001 selector ${unknown}`);

  const selectedQls = [...new Set(values.filter((value) => qlIds.includes(value)))];
  const selectedCps = [...new Set(values.filter((value) => cpIds.includes(value)))];
  if (selectedQls.length > 1) throw new Error(`Conflicting RNK-001 QL selectors ${selectedQls.join(", ")}`);
  if (selectedCps.length > 1) throw new Error(`Conflicting RNK-001 checkpoint selectors ${selectedCps.join(", ")}`);

  if (selectedQls[0] && selectedCps[0]) {
    const owner = checkpointForQl(selectedQls[0]);
    if (owner !== selectedCps[0]) throw new Error(`${selectedQls[0]} is owned by ${owner}, not ${selectedCps[0]}`);
  }
  if (selectedQls[0]) return { kind: "ql", qlId: selectedQls[0] };
  if (selectedCps[0]) return { kind: "cp", cpId: selectedCps[0] };
  return { kind: "chapter" };
}

export function isRnk001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === RNK001_QUESTION_STUDIO_PACKAGE_ID_V2;

  if (selectors(request).some((selector) => selector.startsWith("RNK-QL-") || selector.startsWith("RNK-CP-"))) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "ranking"
    || topic === "ranking and order"
    || topic === "ranking & order"
    || subtopic === "ranking"
    || subtopic === "ranking and order"
    || subtopic === "ranking & order";
}

export const RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V2: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: RNK001_QUESTION_STUDIO_PACKAGE_ID_V2,
  subject: "Reasoning",
  topic: "Ranking & Order",
  subtopic: "Ranking & Order",
  label: "Reasoning · Ranking & Order · RNK-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2,
  supportedRuntimeModes: [RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2],
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
    registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2,
    permanentQlCount: RNK_001_CHAPTER_AUTHORITY.permanentQlCount,
    permanentQlRange: RNK_001_CHAPTER_AUTHORITY.permanentQlRange,
    ql043Allocated: false,
    checkpointCount: cpIds.length,
    qlOwningCheckpointCount: qlCpIds.length,
    deterministicGeneration: true,
    multilingualContentFrozen: true,
    nativeApprovalRecorded: true,
    supportedExamProfiles: [...RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedExamProfiles],
    examProfileDeliveryValidated: true,
    bankingFiveOptionDeliveryValidated: true,
    percentagePresentationValidated: true,
    reviewOnly: true,
  },
};

function learnerStem(question: Record<string, any>): string {
  const number = qlNumber(String(question.qlId));
  if (number < 36 || number > 41) return String(question.stem ?? "");

  const source = (question.source ?? {}) as Record<string, any>;
  const instruction = number <= 38 && typeof source.instruction === "string"
    ? source.instruction.trim()
    : "";
  const clues = Array.isArray(source.clues)
    ? source.clues.map(String).map((clue) => clue.trim()).filter(Boolean)
    : [];
  const query = String(question.stem ?? "").trim();

  if (clues.length === 0) {
    throw new Error(`${question.qlId} learner surface is missing its solve-relevant comparison statements`);
  }

  return [
    instruction,
    clues.map((clue, index) => `${index + 1}. ${clue}`).join("\n"),
    query,
  ].filter(Boolean).join("\n\n");
}

function learnerExplanation(question: Record<string, any>): string {
  const number = qlNumber(String(question.qlId));
  if (number < 36 || number > 41) return String(question.explanation ?? "");
  const source = (question.source ?? {}) as Record<string, any>;
  return declutterRnkExplanation({
    explanation: source.explanation ?? question.explanation,
    qlId: String(question.qlId),
    locale: String(question.locale ?? "en-IN"),
    answer: String(question.answer ?? ""),
  });
}

function toQuestionPayload(question: Record<string, any>) {
  const visibleStem = learnerStem(question);
  const visibleExplanation = learnerExplanation(question);
  return {
    ...lifecycle,
    lifecycleStage: lifecycle.stage,
    id: question.questionId,
    questionId: question.questionId,
    packageId: "RNK-001",
    patternId: question.qlId,
    qlId: question.qlId,
    cpId: question.checkpointId,
    checkpointId: question.checkpointId,
    subject: "Reasoning",
    topic: "Ranking & Order",
    subtopic: "Ranking & Order",
    language: question.language,
    locale: question.locale,
    stem: visibleStem,
    text: visibleStem,
    options: [...question.options],
    optionDetails: question.optionDetails,
    correctIndex: question.correctIndex,
    correct: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: visibleExplanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    examProfile: question.examProfileId,
    examProfileApplied: question.examProfileId !== "CHAPTER_COVERAGE",
    realismTier: question.realismTier,
    optionCount: question.optionCount,
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    runtimeRegistered: true,
    reviewOnly: true,
    readOnly: true,
    productionReleased: false,
    generationSeed: question.seed,
    validation: question.validation,
    source: question.source,
    traceability: {
      packageId: "RNK-001",
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      permanentQlId: question.permanentQlId,
      realismTier: question.realismTier,
      multilingualFreeze: RNK_001_CHAPTER_AUTHORITY.multilingualContentFrozen,
    },
  };
}

export async function generateRnk001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2) {
    throw new Error(`RNK-001 only supports ${RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2} runtime during final audit`);
  }

  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const examProfileId = resolveExamProfile(request.exam);
  const count = normalizeCount(request.count);
  const seed = text(request.seed) || "rnk001-final-audit-recovery-v2";
  const selection = resolveSelection(request);

  const questions: Record<string, any>[] = [];

  if (selection.kind === "chapter") {
    const preview = previewRnk001QuestionStudioReview({
      language,
      difficulty,
      examProfileId,
      seed,
      count,
    });
    questions.push(...preview.questions as readonly Record<string, any>[]);
  } else if (selection.kind === "ql") {
    const preview = previewRnk001QuestionStudioReview({
      language,
      qlId: selection.qlId,
      difficulty,
      examProfileId,
      seed,
      count,
    });
    questions.push(...preview.questions as readonly Record<string, any>[]);
  } else {
    const pool = qlsForCheckpoint(selection.cpId);
    for (let index = 0; index < count; index += 1) {
      const qlId = pool[index % pool.length]!;
      const preview = previewRnk001QuestionStudioReview({
        language,
        qlId,
        difficulty,
        examProfileId,
        seed: `${seed}:${selection.cpId}:${index}`,
        count: 1,
      });
      questions.push(preview.questions[0] as Record<string, any>);
    }
  }

  return {
    questions: questions.map(toQuestionPayload),
    generationContext: {
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      engineId: "reasoning-v1",
      packageId: "RNK-001",
      runtimeMode: RNK001_QUESTION_STUDIO_RUNTIME_MODE_V2,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V2,
      permanentQlCount: RNK_001_CHAPTER_AUTHORITY.permanentQlCount,
      permanentQlIds: [...RNK_001_CHAPTER_AUTHORITY.permanentQlIds],
      cpIds: [...cpIds],
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      difficultyFilterApplied: difficulty !== "Mixed",
      examProfileId,
      examProfileApplied: examProfileId !== "CHAPTER_COVERAGE",
      multilingualContentFrozen: RNK_001_CHAPTER_AUTHORITY.multilingualContentFrozen,
      ql043Allocated: false,
      seed,
      count,
    },
  };
}
