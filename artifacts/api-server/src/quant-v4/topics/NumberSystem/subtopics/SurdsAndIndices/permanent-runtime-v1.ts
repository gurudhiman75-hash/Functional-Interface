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
  readonly checkpointId: SriDiscoveryQuestion["checkpointId"];
  readonly permanentQlId: SriPermanentQlId;
  readonly permanentSolveModeId: SriPermanentSolveModeId;
  readonly retainedGroupId: `SRI-RG-${string}`;
  readonly qlTitle: string;
  readonly locale: "en-IN";
  readonly externalSeed: string;
  readonly sourceCandidateId: string;
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
  if (question.packageId !== freeze.packageId || question.checkpointId !== freeze.checkpointId) {
    throw new Error(
      `${qlId} permanent runtime ownership drift: ${question.packageId}/${question.checkpointId}`,
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
