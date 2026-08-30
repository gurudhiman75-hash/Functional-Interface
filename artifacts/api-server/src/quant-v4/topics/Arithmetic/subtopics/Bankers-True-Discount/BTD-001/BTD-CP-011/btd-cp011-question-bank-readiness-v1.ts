import { createHash } from "node:crypto";

import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP010_QUESTION_STUDIO_VERSION,
  buildBtdCp010QuestionStudioPreview,
  type BtdCp010Language,
} from "../BTD-CP-010/btd-cp010-multilingual-question-studio-v1";

export const BTD_CP011_QUESTION_BANK_READINESS_VERSION = "BTD-001-CP011-QUESTION-BANK-READINESS-v1" as const;

export const BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY = Object.freeze({
  status: "READY_FOR_EXPLICIT_QUESTION_BANK_ADMISSION_APPROVAL" as const,
  admissionContractValidated: true as const,
  questionBankAdmissionApproved: false as const,
  requiresManualStudioReview: true as const,
  requiredGenerationItemStatus: "approved" as const,
  questionBankWritable: false as const,
  questionBankWriteRouteEnabled: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

type AnyRecord = Record<string, any>;

function jsonNative<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function sha256(value: unknown): string {
  return createHash("sha256").update(typeof value === "string" ? value : canonicalJson(jsonNative(value))).digest("hex");
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function btdCp011BankLearnerPayload(preview: AnyRecord) {
  return jsonNative({
    packageId: preview.packageId,
    qlId: preview.qlId,
    cpId: preview.cpId,
    language: preview.language,
    locale: preview.locale,
    semanticSignature: preview.semanticSignature,
    answerSemantic: preview.answerSemantic,
    stem: preview.stem,
    options: preview.options,
    correctIndex: preview.correctIndex,
    answer: preview.answer,
    packageExplanation: preview.packageExplanation,
    difficulty: preview.difficulty,
    frozenContentFingerprint: preview.frozenContentFingerprint,
    frozenChapterFingerprint: preview.frozenChapterFingerprint,
    freezeVersion: preview.freezeVersion,
  });
}

export function buildBtdCp011QuestionBankReadinessCandidateV1(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp010Language,
) {
  const preview = buildBtdCp010QuestionStudioPreview(qlId, seed, language) as AnyRecord;
  const learnerPayload = btdCp011BankLearnerPayload(preview);
  const learnerPayloadFingerprint = sha256(learnerPayload);
  const admissionKey = `BTD-QB-${sha256(`${preview.packageId}:${preview.qlId}:${preview.language}:${preview.frozenContentFingerprint}`).slice(0, 32)}`;
  const bankPayload = {
    schemaVersion: "BTD-QUESTION-BANK-CANDIDATE-v1" as const,
    packageId: preview.packageId,
    chapterId: "BTD-001" as const,
    qlId: preview.qlId,
    cpId: preview.cpId,
    language: preview.language,
    locale: preview.locale,
    difficulty: preview.difficulty,
    stem: preview.stem,
    options: preview.options,
    correctIndex: preview.correctIndex,
    correctAnswer: preview.answer,
    explanation: preview.packageExplanation,
    semanticSignature: preview.semanticSignature,
    answerSemantic: preview.answerSemantic,
    frozenContentFingerprint: preview.frozenContentFingerprint,
    frozenChapterFingerprint: preview.frozenChapterFingerprint,
    freezeVersion: preview.freezeVersion,
  };
  const admissionPayloadFingerprint = sha256(bankPayload);

  return deepFreeze({
    checkpointId: "BTD-CP-011" as const,
    readinessVersion: BTD_CP011_QUESTION_BANK_READINESS_VERSION,
    sourceStudioVersion: BTD_CP010_QUESTION_STUDIO_VERSION,
    sourceStudioQuestionId: preview.questionId,
    sourceStudioSeed: seed,
    admissionKey,
    learnerPayloadFingerprint,
    admissionPayloadFingerprint,
    bankPayload,
    reviewGate: Object.freeze({
      required: true as const,
      requiredStatus: "approved" as const,
      automaticAdmissionAllowed: false as const,
    }),
    lifecycle: BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY,
  });
}
