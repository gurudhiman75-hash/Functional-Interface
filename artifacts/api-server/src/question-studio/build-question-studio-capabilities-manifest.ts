import { writeFile } from "node:fs/promises";
import path from "node:path";

import { listQuestionStudioPackages } from "../question-studio/shared-generation-engine-arg";
import {
  ARG_CP015_REAL_PAPER_PROFILES,
  ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  ARG_CP015_QUESTION_STUDIO_PACKAGE,
} from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-perceived-diversity-expansion";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function currentPackage(pkg: any) {
  const base = {
    packageId: String(pkg.packageId),
    topic: String(pkg.topic),
    subtopic: String(pkg.subtopic),
    subject: text(pkg.subject) || undefined,
    label: String(pkg.label),
    enabled: Boolean(pkg.enabled),
    cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
    canonicalProblems: Array.isArray(pkg.canonicalProblems) ? pkg.canonicalProblems : [],
    permanentQlCount: Number(pkg.permanentQlCount ?? 0),
    permanentQlIds: Array.isArray(pkg.permanentQlIds) ? pkg.permanentQlIds.map(String) : [],
    supportedLanguages: Array.isArray(pkg.supportedLanguages) ? pkg.supportedLanguages.map(String) : ["en"],
    supportedDifficulties: Array.isArray(pkg.supportedDifficulties) ? pkg.supportedDifficulties.map(String) : [],
  };
  if (String(pkg.packageId) !== "ARG-001") return base;
  return Object.freeze({
    ...base,
    cpIds: Object.freeze([...new Set([...base.cpIds, ...ARG_CP015_QUESTION_STUDIO_PACKAGE.cpIds, "ARG-CP-007"])]),
    currentCoreCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentCoreCheckpointId,
    currentRealPaperCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId,
    currentReleaseCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentReleaseCheckpointId,
    currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentQuestionStudioAuthority,
    sourceQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.sourceQuestionStudioAuthority,
    approvalAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.approvalAuthority,
    diversityAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.diversityAuthority,
    runtimeMode: ARG_CP015_QUESTION_STUDIO_PACKAGE.runtimeMode,
    reviewStatus: ARG_CP015_QUESTION_STUDIO_PACKAGE.reviewStatus,
    noRepeatWithinBatch: true,
    twoArgumentProfilesUseApprovedCoreSurface: true,
    learnerRelease: ARG_CP015_QUESTION_STUDIO_PACKAGE.learnerRelease,
    manualApprovalRequired: false,
    persistenceAllowed: true,
    questionBankStatus: "WRITABLE",
    questionBankWritable: true,
    testEligibility: "ELIGIBLE",
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  });
}

const outputPath = process.env.QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT;
if (!outputPath) {
  throw new Error("QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT is required.");
}

const manifest = {
  generationSystem: "question-studio",
  packages: listQuestionStudioPackages().map(currentPackage),
  difficulties: ["Easy", "Medium", "Hard"],
  languages: ["en", "hi", "pa"],
  realPaperProfiles: ARG_CP015_REAL_PAPER_PROFILES,
  maxBatchSize: 50,
  arg001CurrentAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  generatedAt: new Date().toISOString(),
};

await writeFile(path.resolve(outputPath), JSON.stringify(manifest), "utf8");
console.log(`QUESTION_STUDIO_CAPABILITIES_MANIFEST_WRITTEN ${manifest.packages.length}`);
