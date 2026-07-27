import type { EditorialDifficulty, StructuredEditorialEntry } from "./editorial-content";

export type EditorialEntryOverride = Readonly<{
  difficulty?: EditorialDifficulty;
  difficultyRationale?: string;
}>;

export const PNL_EDITORIAL_ENTRY_OVERRIDES: Readonly<Record<string, EditorialEntryOverride>> = {
  "PNL-QL-171": {
    difficulty: "Medium",
    difficultyRationale: "Two-step reverse contribution calculation: recover unit contribution, then subtract it from selling price.",
  },
};

export function applyEditorialEntryOverride(
  qlId: string,
  entry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  const override = PNL_EDITORIAL_ENTRY_OVERRIDES[qlId];
  if (!override) return entry;
  return {
    ...entry,
    ...override,
  };
}
