import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  QuestionPackage,
  QuestionPackageAssetKind,
  QuestionPackageAssets,
  QuestionPackageMetadata,
} from "./types";

export const QUESTION_PACKAGE_ASSET_FILES = {
  stem: "stem.md",
  variables: "variables.ts",
  explanationPolicies: "explanation-policies.ts",
  hints: "hints.md",
  misconceptions: "misconceptions.md",
  realism: "realism.ts",
  validation: "validation.ts",
} as const satisfies Record<QuestionPackageAssetKind, string>;

async function readOptional(
  path: string,
): Promise<{ exists: boolean; source: string | null }> {
  try {
    const source = await readFile(path, "utf8");
    return {
      exists: true,
      source: source.trim().length === 0 ? null : source,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { exists: false, source: null };
    }
    throw error;
  }
}

export async function loadQuestionPackage(
  metadata: QuestionPackageMetadata,
  packageRoot: string,
): Promise<QuestionPackage> {
  const directory = join(packageRoot, metadata.questionId);
  const entries = await Promise.all(
    (
      Object.entries(QUESTION_PACKAGE_ASSET_FILES) as [
        QuestionPackageAssetKind,
        string,
      ][]
    ).map(
      async ([asset, filename]) => {
        const path = join(directory, filename);
        return [asset, path, await readOptional(path)] as const;
      },
    ),
  );
  const assetPaths = {} as QuestionPackage["assetPaths"];
  const assetPresence = {} as QuestionPackage["assetPresence"];
  const assets = {} as QuestionPackageAssets;
  for (const [asset, path, loaded] of entries) {
    assetPaths[asset] = path;
    assetPresence[asset] = loaded.exists;
    assets[asset] = loaded.source;
  }
  return {
    metadata: structuredClone(metadata),
    assetPaths,
    assetPresence,
    assets,
  };
}
