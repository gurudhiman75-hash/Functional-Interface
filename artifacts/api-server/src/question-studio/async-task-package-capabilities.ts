// Runtime-only package authority for the isolated task receiver.
// The immutable JSON is generated in a separate build-time Node process.
// NEVER import engine-registry/universal-executor into this API process.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { UniversalStudioComputeInput } from "./universal-executor";

export type AsyncPackageDefinition = Record<string, unknown> & {
  packageId: string; engineId: string; enabled: boolean;
  cpIds: string[]; dynamicCandidateCpIds?: string[];
  supportedLanguages: string[]; supportedDifficulties?: string[];
  supportedRuntimeModes?: string[]; difficultyFilterSupported?: boolean;
};

let cached: AsyncPackageDefinition[] | undefined;
export function listAsyncTaskPackages(): AsyncPackageDefinition[] {
  if (cached) return cached;
  const candidates = [
    path.join(process.cwd(), "artifacts/api-server/dist/question-studio-chapter-review-capabilities.json"),
    path.join(process.cwd(), "dist/question-studio-chapter-review-capabilities.json"),
    path.join(process.cwd(), "artifacts/api-server/dist/question-studio-capabilities.json"),
    path.join(process.cwd(), "dist/question-studio-capabilities.json"),
  ];
  const location = candidates.find(p=>existsSync(p));
  if (!location) throw new Error("TASK_CAPABILITIES_MANIFEST_MISSING");
  const parsed = JSON.parse(readFileSync(location, "utf8")) as {packages?: unknown};
  if (!Array.isArray(parsed.packages) || !parsed.packages.length) {
    throw new Error("TASK_CAPABILITIES_MANIFEST_INVALID");
  }
  cached = parsed.packages as AsyncPackageDefinition[];
  return cached;
}

export function validateAsyncTaskComputeInput(input: UniversalStudioComputeInput): AsyncPackageDefinition {
  function fail(code: string): never {
    throw Object.assign(new Error(code), {statusCode:400,code});
  }
  if (!input || typeof input !== "object" || !input.request ||
      typeof input.request !== "object" ||
      !Number.isInteger(input.count) || input.count < 1 || input.count > 50 ||
      input.request.count !== input.count) fail("INVALID_UNIVERSAL_GENERATION_COUNT");
  const pkg = listAsyncTaskPackages().find(p=>p.enabled && p.packageId===input.request.packageId);
  if (!pkg) fail("UNREGISTERED_UNIVERSAL_PACKAGE");
  if (pkg.engineId !== input.request.engineId) fail("UNIVERSAL_ENGINE_PACKAGE_MISMATCH");
  if (!pkg.supportedLanguages?.includes(input.request.language)) fail("UNSUPPORTED_UNIVERSAL_LANGUAGE");
  const selected=input.selectedCpIds;
  if (!Array.isArray(selected) || selected.length>input.count || selected.length>50 ||
      selected.some(x=>typeof x!=="string") || new Set(selected).size!==selected.length) {
    fail("INVALID_UNIVERSAL_CP_SELECTION");
  }
  const allowed=new Set([...(pkg.cpIds??[]),...(pkg.dynamicCandidateCpIds??[])]);
  if (selected.some(cp=>!allowed.has(cp))) fail("INVALID_UNIVERSAL_CP_SELECTION");
  if (input.request.canonicalProblemId &&
      (selected.length!==1 || input.request.canonicalProblemId!==selected[0])) fail("INVALID_UNIVERSAL_CP_SELECTION");
  const difficulty=input.request.difficulty;
  if (pkg.difficultyFilterSupported===false) {
    if (difficulty!==undefined && difficulty!=="Mixed") fail("DIFFICULTY_FILTER_UNSUPPORTED");
  } else if (!["Easy","Medium","Hard","Mixed"].includes(String(difficulty))) {
    fail("INVALID_UNIVERSAL_DIFFICULTY");
  }
  if (pkg.supportedDifficulties?.length && difficulty!=="Mixed" &&
      pkg.difficultyFilterSupported!==false &&
      !pkg.supportedDifficulties.includes(String(difficulty))) fail("UNSUPPORTED_UNIVERSAL_DIFFICULTY");
  if (input.request.runtimeMode && pkg.supportedRuntimeModes?.length &&
      !pkg.supportedRuntimeModes.includes(input.request.runtimeMode)) fail("UNSUPPORTED_UNIVERSAL_RUNTIME_MODE");
  if (input.forwardLegacyExamProfile!==undefined &&
      typeof input.forwardLegacyExamProfile!=="boolean") fail("INVALID_UNIVERSAL_GENERATION_REQUEST");
  if (input.difficultyFilterSupported!==undefined &&
      typeof input.difficultyFilterSupported!=="boolean") fail("INVALID_UNIVERSAL_GENERATION_REQUEST");
  return pkg;
}
