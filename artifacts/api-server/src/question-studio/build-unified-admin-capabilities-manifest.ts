// Build-time only: produce a complete, auth-protected UI discovery manifest
// for the isolated Cloud Run QS admin staging pilot. The live API does not
// import the four content engines at request time.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { listQuestionStudioEngines, listQuestionStudioPackages } from "./engine-registry";

const output = process.env.QUESTION_STUDIO_UNIFIED_CAPABILITIES_MANIFEST_OUT;
if (!output) throw new Error("QUESTION_STUDIO_UNIFIED_CAPABILITIES_MANIFEST_OUT_REQUIRED");

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function packageSubject(pkg: ReturnType<typeof listQuestionStudioPackages>[number]) {
  return asText(pkg.subject) || ({
    "quant-v4": "Quantitative Aptitude",
    "reasoning-v1": "Reasoning Ability",
    "language-v1": "English",
    "knowledge-v1": "Static GK",
  } as Record<string, string>)[pkg.engineId] || "Other";
}
function packageChapter(pkg: ReturnType<typeof listQuestionStudioPackages>[number]) {
  if (pkg.engineId === "quant-v4") return asText(pkg.subtopic) || asText(pkg.topic) || pkg.label;
  return asText(pkg.topic) || asText(pkg.subtopic) || pkg.label;
}
const engines = listQuestionStudioEngines();
const packages = listQuestionStudioPackages().map((pkg) => {
  const cpIds = [...new Set([...pkg.cpIds, ...(pkg.dynamicCandidateCpIds ?? [])])];
  const rawLabels = pkg.metadata?.cpTitles;
  const cpLabels: Record<string, string> = {};
  if (rawLabels && typeof rawLabels === "object" && !Array.isArray(rawLabels)) {
    for (const cpId of cpIds) {
      const title = asText((rawLabels as Record<string, unknown>)[cpId]);
      if (title) cpLabels[cpId] = title;
    }
  }
  if (cpIds.length === 1 && !cpLabels[cpIds[0]!]) {
    const subtopic = asText(pkg.subtopic);
    if (subtopic && subtopic !== asText(pkg.topic) && !/^(complete chapter|mixed|approved|review|question studio)$/i.test(subtopic)) {
      cpLabels[cpIds[0]!] = subtopic;
    }
  }
  return {
    engineId: pkg.engineId,
    packageId: pkg.packageId,
    subject: packageSubject(pkg),
    chapter: packageChapter(pkg),
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    label: pkg.label,
    enabled: pkg.enabled,
    cpIds: pkg.cpIds,
    cpLabels,
    supportedLanguages: pkg.supportedLanguages,
    supportedDifficulties: pkg.supportedDifficulties ?? [],
    difficultyFilterSupported: pkg.difficultyFilterSupported ?? true,
    runtimeMode: pkg.runtimeMode,
    supportedRuntimeModes: pkg.supportedRuntimeModes ?? [],
    dynamicCandidateCpIds: pkg.dynamicCandidateCpIds ?? [],
    lifecycleId: pkg.lifecycleId,
    lifecycleStage: pkg.lifecycleStage,
    reviewSurfaceRequired: pkg.reviewSurfaceRequired,
    manualApprovalRequired: pkg.manualApprovalRequired,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    questionBankAcceptanceMode: pkg.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: pkg.questionBankAcceptanceAuthority,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    mockTestEligible: pkg.mockTestEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    automaticStudentPublication: pkg.automaticStudentPublication,
    productionReleaseAuthorized: pkg.productionReleaseAuthorized,
  };
});
for (const [packageId, engineId] of Object.entries({
  "TRG-002": "quant-v4",
  "OPS-001": "reasoning-v1",
  "ENG-001": "language-v1",
  "COM-001": "knowledge-v1",
})) {
  if (!packages.some((p) => p.packageId === packageId && p.enabled && p.engineId === engineId)) {
    throw new Error(`QUESTION_STUDIO_UNIFIED_PACKAGE_NOT_READY: ${packageId}/${engineId}`);
  }
}
const manifest = {
  source: "canonical-four-engine-registry",
  schemaVersion: 1,
  generationSystem: "quant-v4",
  defaultGenerationSystem: "quant-v4",
  generationSystems: engines,
  packages,
  difficulties: ["Easy", "Medium", "Hard"],
  languages: ["en", "hi", "pa"],
  maxBatchSize: 50,
  generatedAt: new Date().toISOString(),
};
await writeFile(path.resolve(output), JSON.stringify(manifest), "utf8");
console.log(`QUESTION_STUDIO_UNIFIED_CAPABILITIES_READY ${packages.length}`);
