import type {
  BlueprintAssemblyQuestion,
  BlueprintAssemblyShortage,
  BlueprintDifficulty,
  NormalizedBlueprintSection,
} from "./admin-test-blueprint";

export interface BlueprintAssemblyCandidate extends BlueprintAssemblyQuestion {}

export function normalizeBlueprintStem(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\u0a00-\u0a7f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function selectBlueprintSectionCandidates(input: {
  section: NormalizedBlueprintSection;
  candidates: BlueprintAssemblyCandidate[];
  usedQuestionVersionIds: Set<string>;
  usedStems: Set<string>;
}): {
  selected: BlueprintAssemblyQuestion[];
  shortages: BlueprintAssemblyShortage[];
} {
  const { section, candidates, usedQuestionVersionIds, usedStems } = input;
  const selected: BlueprintAssemblyQuestion[] = [];
  const shortages: BlueprintAssemblyShortage[] = [];

  for (const difficulty of ["easy", "medium", "hard"] as BlueprintDifficulty[]) {
    const requested = section.difficultyTargets[difficulty];
    let available = 0;

    for (const candidate of candidates) {
      if (selected.filter((question) => question.difficulty === difficulty).length >= requested) break;
      if (candidate.difficulty !== difficulty) continue;
      if (usedQuestionVersionIds.has(candidate.questionVersionId)) continue;
      const stemKey = normalizeBlueprintStem(candidate.stem);
      if (!stemKey || usedStems.has(stemKey)) continue;

      available += 1;
      selected.push(candidate);
      usedQuestionVersionIds.add(candidate.questionVersionId);
      usedStems.add(stemKey);
    }

    const chosen = selected.filter((question) => question.difficulty === difficulty).length;
    if (chosen < requested) {
      shortages.push({
        sectionKey: section.sectionKey,
        sectionName: section.name,
        difficulty,
        requested,
        available,
        missing: requested - chosen,
      });
    }
  }

  return { selected, shortages };
}
