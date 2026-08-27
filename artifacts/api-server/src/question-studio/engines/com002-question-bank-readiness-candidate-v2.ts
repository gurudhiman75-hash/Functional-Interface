import { getGeneratedQuestionBankEligibilityIssue } from "../../lib/admin-question-conversion";
import type { QuestionStudioGeneratedQuestion } from "../engine-types";
import { generateCom002CandidateBatchForAuditV2 } from "./knowledge-v1-com002-candidate-adapter-v2";

export const COM002_REQUIRED_PREBANK_PROVENANCE_FIELDS_V2 = [
  "sourceIds",
  "sourceFactIds",
  "solverAuthority",
  "contentCandidateVersion",
  "englishGeneratorVersion",
  "localizationVersion",
  "difficultyClassifierVersion",
  "difficultyTopology",
  "difficultyRationale",
  "activationGateAuthorityId",
  "activationGateStatus",
] as const;

export type Com002QuestionBankReadinessCandidateV2 = {
  status: "PREBANK_PROVENANCE_READY_BUT_V4_V3_ACTIVATION_BLOCKED" | "BLOCKED_METADATA_PROVENANCE";
  auditedQuestionCount: number;
  qlCount: number;
  languages: readonly ["en", "hi", "pa"];
  allCandidatesRejectedByBankGate: boolean;
  downstreamLifecycleLocked: boolean;
  candidateProvenanceComplete: boolean;
  missingCandidateProvenanceFields: string[];
  contentCandidateVersion: "ENGLISH_V4_LOCALIZATION_V3";
  questionBankWritable: false;
  productionReleaseAuthorized: false;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function present(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

function bankEligibilityPayload(
  question: QuestionStudioGeneratedQuestion,
  generationContext: Record<string, unknown>,
) {
  return {
    ...question,
    generationContext,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    questionBankAcceptanceMode: "BANK_ONLY",
    testEligibility: "BLOCKED_PENDING_V4_V3_AUTHORITY_CHAIN",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  };
}

export async function auditCom002QuestionBankReadinessCandidateV2(): Promise<Com002QuestionBankReadinessCandidateV2> {
  const qlIds = Array.from(
    { length: 13 },
    (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
  );
  const languages = ["en", "hi", "pa"] as const;
  const missing = new Set<string>();
  let auditedQuestionCount = 0;
  let allCandidatesRejectedByBankGate = true;
  let downstreamLifecycleLocked = true;

  for (const qlId of qlIds) {
    for (const language of languages) {
      const generated = await generateCom002CandidateBatchForAuditV2({
        engineId: "knowledge-v1",
        packageId: "COM-002",
        patternId: qlId,
        language,
        runtimeMode: "review-only-candidate",
        difficulty: "Mixed",
        count: 10,
        seed: `com002-prebank-readiness-v2:${qlId}:${language}`,
      });
      const generationContext = asRecord(generated.generationContext);

      for (const question of generated.questions) {
        auditedQuestionCount += 1;
        const candidate = asRecord(question.questionStudioCandidate);
        const eligibilityIssue = getGeneratedQuestionBankEligibilityIssue(
          bankEligibilityPayload(question, generationContext),
        );

        allCandidatesRejectedByBankGate &&=
          eligibilityIssue === "questionBankStatus is NOT_STORED" ||
          eligibilityIssue === "questionBankWritable is false";

        downstreamLifecycleLocked &&=
          candidate.reviewRunPersistenceAllowed === false &&
          candidate.canonicalQuestionPersistenceAllowed === false &&
          candidate.questionBankWritable === false &&
          candidate.testEligible === false &&
          candidate.mockTestEligible === false &&
          candidate.publiclyPublishable === false &&
          candidate.automaticStudentPublication === false &&
          candidate.productionReleaseAuthorized === false &&
          generationContext.reviewRunPersistenceAllowed === false &&
          generationContext.canonicalQuestionPersistenceAllowed === false &&
          generationContext.questionBankWritable === false &&
          generationContext.testEligible === false &&
          generationContext.mockTestEligible === false &&
          generationContext.publiclyPublishable === false &&
          generationContext.automaticStudentPublication === false &&
          generationContext.productionReleaseAuthorized === false;

        const expectedProvenance: Record<string, unknown> = {
          sourceIds: question.sourceIds,
          sourceFactIds: question.sourceFactIds,
          solverAuthority: question.solverAuthority,
          contentCandidateVersion:
            candidate.contentCandidateVersion ?? generationContext.contentCandidateVersion,
          englishGeneratorVersion:
            candidate.englishGeneratorVersion ?? generationContext.englishGeneratorVersion,
          localizationVersion:
            candidate.localizationVersion ?? generationContext.localizationVersion,
          difficultyClassifierVersion:
            candidate.difficultyClassifierVersion ?? generationContext.difficultyClassifierVersion,
          difficultyTopology: candidate.difficultyTopology,
          difficultyRationale: candidate.difficultyRationale,
          activationGateAuthorityId:
            candidate.activationGateAuthorityId ?? generationContext.activationGateAuthorityId,
          activationGateStatus:
            candidate.activationGateStatus ?? generationContext.activationGateStatus,
        };

        for (const field of COM002_REQUIRED_PREBANK_PROVENANCE_FIELDS_V2) {
          if (!present(expectedProvenance[field])) missing.add(field);
        }
      }
    }
  }

  const missingCandidateProvenanceFields = [...missing].sort();
  const candidateProvenanceComplete = missingCandidateProvenanceFields.length === 0;

  return {
    status:
      candidateProvenanceComplete &&
      allCandidatesRejectedByBankGate &&
      downstreamLifecycleLocked
        ? "PREBANK_PROVENANCE_READY_BUT_V4_V3_ACTIVATION_BLOCKED"
        : "BLOCKED_METADATA_PROVENANCE",
    auditedQuestionCount,
    qlCount: qlIds.length,
    languages,
    allCandidatesRejectedByBankGate,
    downstreamLifecycleLocked,
    candidateProvenanceComplete,
    missingCandidateProvenanceFields,
    contentCandidateVersion: "ENGLISH_V4_LOCALIZATION_V3",
    questionBankWritable: false,
    productionReleaseAuthorized: false,
  };
}
