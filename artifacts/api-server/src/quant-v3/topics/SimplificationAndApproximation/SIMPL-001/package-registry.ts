import { readFileSync } from "node:fs";
import type { PackageRegistryEntry } from "./types";

export const PACKAGE_REGISTRY = {
  packageId: "SIMPL-001",
  topic: "Simplification And Approximation",
  ownership: "HUMAN_OWNED",
  usage: "Runtime Consumption Only",
  sourceAuthority: "simpl-001-language-draft.md",
  authorityMap: "library-authority-map.md",
} as const satisfies PackageRegistryEntry;

export const RUNTIME_INFRASTRUCTURE_VERIFICATION = {
  activeCpCount: 7,
  topologyCount: 7,
  reasoningPatternCount: 7,
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
  executionLayerCreated: false,
  testsCreated: false,
  auditsCreated: false,
} as const;

export function readSimpl001LibraryJson<T>(fileName: string): T {
  const raw = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return JSON.parse(raw) as T;
}

export function readSimpl001AuthorityMap(): string {
  return readFileSync(new URL("./library-authority-map.md", import.meta.url), "utf8");
}
