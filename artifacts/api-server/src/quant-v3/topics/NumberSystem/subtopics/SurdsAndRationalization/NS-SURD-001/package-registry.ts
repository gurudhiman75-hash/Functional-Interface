import { readFileSync } from "node:fs";
import type { PackageRegistryEntry } from "./types";

export const PACKAGE_REGISTRY = {
  packageId: "NS-SURD-001",
  topic: "Number System",
  subtopic: "Surds And Rationalization",
  ownership: "HUMAN_OWNED",
  usage: "Runtime Consumption Only",
  sourceAuthority: "ns-surd-001-language-draft.md",
  authorityMap: "library-authority-map.md",
} as const satisfies PackageRegistryEntry;

export const RUNTIME_VERIFICATION = {
  activeCpCount: 8,
  topologyCount: 8,
  reasoningPatternCount: 8,
  runtimeFileCount: 11,
  jsonLibrariesConsumed: [
    "question-language.library.json",
    "explanation.library.json",
    "variable-ranges.library.json",
    "coverage-targets.library.json",
    "distribution-targets.library.json",
  ],
  ownershipStatus: "HUMAN_OWNED",
  educationalLanguageCreated: false,
  forbiddenFilesCreated: false,
} as const;

export function readNsSurd001LibraryJson<T>(fileName: string): T {
  const raw = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return JSON.parse(raw) as T;
}
