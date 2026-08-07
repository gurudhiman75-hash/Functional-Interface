import type { ProbabilityPackageLibraries, ProbabilityTaskRegistryEntry, ProbabilityQuestionLanguageEntry } from "./types";
export function validateProbabilityLibraries(libraries: ProbabilityPackageLibraries, expectedCount: number): ProbabilityPackageLibraries {
  if (libraries.registry.length !== expectedCount) throw new Error(`${libraries.packageId} registry expected ${expectedCount} entries, received ${libraries.registry.length}`);
  if (libraries.language.length !== expectedCount) throw new Error(`${libraries.packageId} English language expected ${expectedCount} entries, received ${libraries.language.length}`);
  const ids = libraries.registry.map((entry) => entry.qlId), languageIds = new Set(libraries.language.map((entry) => entry.qlId));
  if (new Set(ids).size !== ids.length) throw new Error(`${libraries.packageId} has duplicate registry QLs`);
  if (!ids.every((id) => languageIds.has(id))) throw new Error(`${libraries.packageId} has a registry/language mismatch`);
  for (const entry of libraries.registry) validateRegistryEntry(entry);
  for (const language of libraries.language) validateLanguageEntry(language);
  return libraries;
}
function validateRegistryEntry(entry: ProbabilityTaskRegistryEntry): void {
  if (!entry.qlId.startsWith("PRB-QL-")) throw new Error(`Invalid Probability QL id ${entry.qlId}`);
  if (!entry.experimentKinds.length || !entry.solveMode || !entry.eventStrategyId || !entry.explanationStrategyId) throw new Error(`Incomplete registry entry ${entry.qlId}`);
  if (entry.distractorStrategyIds.length < 2) throw new Error(`${entry.qlId} requires at least two misconception distractors`);
}
function validateLanguageEntry(entry: ProbabilityQuestionLanguageEntry): void {
  if (entry.locale !== "en" || !entry.stemTemplate || !entry.explanationLead) throw new Error(`Incomplete English language entry ${entry.qlId}`);
}
