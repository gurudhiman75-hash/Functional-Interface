import { sriPick } from "../../../../shared/surds-indices";
import { validateSriDiscoveryQuestion } from "./discovery-runtime";
import { generateSriExecutableDiscoveryCandidate } from "./saturation-registry";
import {
  getSriPermanentEnglishFreezeByQlId,
  type SriEnglishFingerprintV1,
} from "./permanent-english-freeze-v1";
import type { SriDiscoveryQuestion } from "./discovery-types";
import type {
  SriPermanentQlId,
  SriPermanentSolveModeId,
} from "./permanent-allocation-v1";

export interface SriPermanentEnglishQuestionV1 {
  readonly packageId: "SRI-001" | "SRI-002";
  /** Permanent authority owner checkpoint after solve-mode compression. */
  readonly checkpointId: SriDiscoveryQuestion["checkpointId"];
  readonly permanentQlId: SriPermanentQlId;
  readonly permanentSolveModeId: SriPermanentSolveModeId;
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly qlTitle: string;
  readonly locale: "en-IN";
  readonly externalSeed: string;
  readonly sourceCandidateId: string;
  /** Original checkpoint of the selected prototype ancestry member. */
  readonly sourceCheckpointId: SriDiscoveryQuestion["checkpointId"];
  readonly sourceSeed: string;
  readonly englishFingerprint: SriEnglishFingerprintV1;
  readonly question: SriDiscoveryQuestion;
  readonly lifecycle: Readonly<{
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "ENGLISH_FROZEN";
    localizationStatus: "PENDING";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionStudioGenerationEnabled: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

export function generateSriPermanentEnglishQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
): SriPermanentEnglishQuestionV1 {
  if (typeof externalSeed !== "string" || externalSeed.trim().length === 0) {
    throw new Error("SRI permanent runtime requires a non-empty external seed");
  }

  const freeze = getSriPermanentEnglishFreezeByQlId(qlId);
  const sourceCandidateId = sriPick(
    `SRI-PERM-V1:${qlId}:${externalSeed}:member`,
    freeze.memberCandidateIds,
  );
  const sourceSeed = `SRI-PERM-V1:${qlId}:${sourceCandidateId}:${externalSeed}`;
  const question = generateSriExecutableDiscoveryCandidate(sourceCandidateId, sourceSeed);
  const validationErrors = validateSriDiscoveryQuestion(question);
  if (validationErrors.length > 0) {
    throw new Error(`${qlId} permanent runtime produced an invalid source package: ${validationErrors.join("; ")}`);
  }
  // Retained contracts may intentionally compress prototype ancestry from more than one
  // checkpoint. Package ownership is invariant; sourceCheckpointId preserves the original
  // prototype checkpoint while checkpointId remains the permanent authority owner.
  if (question.packageId !== freeze.packageId) {
    throw new Error(
      `${qlId} permanent runtime package ownership drift: expected ${freeze.packageId}, received ${question.packageId}`,
    );
  }

  return Object.freeze({
    packageId: freeze.packageId,
    checkpointId: freeze.checkpointId,
    permanentQlId: freeze.qlId,
    permanentSolveModeId: freeze.solveModeId,
    retainedGroupId: freeze.retainedGroupId,
    qlTitle: freeze.title,
    locale: "en-IN" as const,
    externalSeed,
    sourceCandidateId,
    sourceCheckpointId: question.checkpointId,
    sourceSeed,
    englishFingerprint: freeze.englishFingerprint,
    question,
    lifecycle: Object.freeze({
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "ENGLISH_FROZEN" as const,
      localizationStatus: "PENDING" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}
