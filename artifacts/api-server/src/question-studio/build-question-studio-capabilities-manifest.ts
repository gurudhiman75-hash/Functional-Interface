import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  listQuestionStudioEngines,
  listQuestionStudioPackages,
} from "./engine-registry";
import {
  ARG_CP015_REAL_PAPER_PROFILES,
  ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  ARG_CP015_QUESTION_STUDIO_PACKAGE,
} from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-perceived-diversity-expansion";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function packageSubject(pkg: any): string {
  const explicit = text(pkg.subject);
  if (explicit) return explicit;

  const engineId = text(pkg.engineId);
  if (engineId === "quant-v4") return "Quantitative Aptitude";
  if (engineId === "reasoning-v1") return "Reasoning Ability";
  if (engineId === "language-v1") return "English";
  if (engineId === "knowledge-v1") return "Static GK";

  const packageId = text(pkg.packageId).toUpperCase();
  const haystack = [packageId, text(pkg.topic), text(pkg.subtopic), text(pkg.label)]
    .join(" ")
    .toLowerCase();
  if (
    /\b(arg|blr|cal|cnd|dsf|inp|io|ser|spa|wfm|ranking|reasoning)\b/i.test(packageId)
    || /(reasoning|blood relation|calendar|cube|dice|data sufficiency|series|statement|argument|assumption|input output|spatial)/i.test(haystack)
  ) return "Reasoning Ability";
  if (
    /\b(eng|rc|grammar|vocab)\b/i.test(packageId)
    || /(english|grammar|vocabulary|reading comprehension|cloze|para jumble|sentence)/i.test(haystack)
  ) return "English";
  if (
    /\b(com|gk|pol|geo|his|sci|env|punjab)\b/i.test(packageId)
    || /(static gk|polity|geography|history|science|environment|computer awareness|punjab gk)/i.test(haystack)
  ) return "Static GK";
  if (
    /(quant|number|percentage|average|ratio|profit|loss|interest|algebra|mensuration|probability|simplification|arithmetic|time work|time speed|data interpretation)/i.test(haystack)
  ) return "Quantitative Aptitude";
  return "Other";
}

function packageChapter(pkg: any): string {
  const explicit = text(pkg.chapter);
  if (explicit) return explicit;
  const topic = text(pkg.topic);
  const subtopic = text(pkg.subtopic);
  const label = text(pkg.label);
  const subject = packageSubject(pkg);
  if (subject === "Quantitative Aptitude") return subtopic || topic || label || "Quantitative Aptitude";
  return topic || subtopic || label || "Other";
}

function currentPackage(pkg: any) {
  const base = {
    engineId: text(pkg.engineId) || undefined,
    packageId: String(pkg.packageId),
    subject: packageSubject(pkg),
    chapter: packageChapter(pkg),
    topic: text(pkg.topic),
    subtopic: text(pkg.subtopic),
    label: text(pkg.label) || String(pkg.packageId),
    enabled: Boolean(pkg.enabled),
    cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
    canonicalProblems: Array.isArray(pkg.canonicalProblems) ? pkg.canonicalProblems : [],
    permanentQlCount: Number(pkg.permanentQlCount ?? 0),
    permanentQlIds: Array.isArray(pkg.permanentQlIds) ? pkg.permanentQlIds.map(String) : [],
    supportedLanguages: Array.isArray(pkg.supportedLanguages) ? pkg.supportedLanguages.map(String) : ["en"],
    supportedDifficulties: Array.isArray(pkg.supportedDifficulties) ? pkg.supportedDifficulties.map(String) : [],
    difficultyFilterSupported: pkg.difficultyFilterSupported !== false,
    runtimeMode: text(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: Array.isArray(pkg.supportedRuntimeModes) ? pkg.supportedRuntimeModes.map(String) : [],
    dynamicCandidateCpIds: Array.isArray(pkg.dynamicCandidateCpIds) ? pkg.dynamicCandidateCpIds.map(String) : [],
    cpLabels: (() => {
      if (pkg.cpLabels && typeof pkg.cpLabels === "object" && !Array.isArray(pkg.cpLabels)) {
        return pkg.cpLabels;
      }
      const metadataTitles = pkg.metadata?.cpTitles;
      if (metadataTitles && typeof metadataTitles === "object" && !Array.isArray(metadataTitles)) {
        return metadataTitles;
      }
      return {};
    })(),
    lifecycleId: text(pkg.lifecycleId) || undefined,
    lifecycleStage: text(pkg.lifecycleStage) || undefined,
    reviewSurfaceRequired: pkg.reviewSurfaceRequired,
    manualApprovalRequired: pkg.manualApprovalRequired,
    questionBankStatus: text(pkg.questionBankStatus) || undefined,
    questionBankWritable: pkg.questionBankWritable,
    questionBankAcceptanceMode: text(pkg.questionBankAcceptanceMode) || undefined,
    questionBankAcceptanceAuthority: pkg.questionBankAcceptanceAuthority ?? undefined,
    testEligibility: text(pkg.testEligibility) || undefined,
    testEligible: pkg.testEligible,
    mockTestEligible: pkg.mockTestEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    automaticStudentPublication: pkg.automaticStudentPublication,
    productionReleaseAuthorized: pkg.productionReleaseAuthorized,
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

const packages = listQuestionStudioPackages().map(currentPackage);

const mensuration = packages.find((pkg) => pkg.packageId === "MENSURATION");
const expectedMensurationCpIds = Array.from(
  { length: 13 },
  (_, index) => `MEN-CP-${String(index + 1).padStart(3, "0")}`,
);
if (!mensuration) {
  throw new Error("Question Studio capability manifest is missing the MENSURATION package.");
}
const actualMensurationCpIds = [...new Set(mensuration.cpIds)].sort();
if (
  actualMensurationCpIds.length !== expectedMensurationCpIds.length
  || expectedMensurationCpIds.some((cpId) => !actualMensurationCpIds.includes(cpId))
) {
  throw new Error(
    `Question Studio MENSURATION capability drift: expected MEN-CP-001..MEN-CP-013, received ${actualMensurationCpIds.join(", ")}`,
  );
}

const generationSystems = listQuestionStudioEngines();
const manifest = {
  generationSystem: "quant-v4",
  defaultGenerationSystem: "quant-v4",
  generationSystems,
  packages,
  difficulties: ["Easy", "Medium", "Hard"],
  languages: ["en", "hi", "pa"],
  realPaperProfiles: ARG_CP015_REAL_PAPER_PROFILES,
  maxBatchSize: 50,
  arg001CurrentAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  generatedAt: new Date().toISOString(),
};

await writeFile(path.resolve(outputPath), JSON.stringify(manifest), "utf8");
console.log(`QUESTION_STUDIO_CAPABILITIES_MANIFEST_WRITTEN ${manifest.packages.length}`);
