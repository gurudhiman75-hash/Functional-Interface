import type {
  BlueprintAssemblyQuestion,
  BlueprintAssemblyShortage,
  BlueprintDifficulty,
  NormalizedBlueprintSection,
} from "./admin-test-blueprint";

export interface BlueprintAssemblyCandidate extends BlueprintAssemblyQuestion {
  readonly releasePoolId?: string | null;
  readonly releaseStatus?: string | null;
  readonly authorityId?: string | null;
  readonly taskKind?: string | null;
  readonly answerPosition?: number | null;
  readonly examSuitability?: readonly string[];
}

export function normalizeBlueprintStem(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\u0a00-\u0a7f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedReleaseStatus(candidate: BlueprintAssemblyCandidate): string {
  return String(candidate.releaseStatus ?? "").trim().toUpperCase();
}

function candidateIsReleaseEligible(
  candidate: BlueprintAssemblyCandidate,
  usedReleasePoolIds: ReadonlySet<string>,
): boolean {
  const releaseStatus = normalizedReleaseStatus(candidate);
  if (releaseStatus && releaseStatus !== "PRIMARY") return false;
  const pool = String(candidate.releasePoolId ?? "").trim();
  if (pool && usedReleasePoolIds.has(pool)) return false;
  return true;
}

function countFor(map: ReadonlyMap<string, number>, value: string | null | undefined): number {
  const key = String(value ?? "").trim();
  return key ? map.get(key) ?? 0 : 0;
}

function increment(map: Map<string, number>, value: string | null | undefined): void {
  const key = String(value ?? "").trim();
  if (key) map.set(key, (map.get(key) ?? 0) + 1);
}

export function selectBlueprintSectionCandidates(input: {
  section: NormalizedBlueprintSection;
  candidates: BlueprintAssemblyCandidate[];
  usedQuestionVersionIds: Set<string>;
  usedStems: Set<string>;
  usedReleasePoolIds?: Set<string>;
}): {
  selected: BlueprintAssemblyQuestion[];
  shortages: BlueprintAssemblyShortage[];
} {
  const {
    section,
    candidates,
    usedQuestionVersionIds,
    usedStems,
  } = input;
  const usedReleasePoolIds = input.usedReleasePoolIds ?? new Set<string>();
  const selected: BlueprintAssemblyCandidate[] = [];
  const shortages: BlueprintAssemblyShortage[] = [];
  const authorityCounts = new Map<string, number>();
  const taskCounts = new Map<string, number>();
  const answerPositionCounts = new Map<string, number>();

  for (const difficulty of ["easy", "medium", "hard"] as BlueprintDifficulty[]) {
    const requested = section.difficultyTargets[difficulty];
    let available = 0;

    while (selected.filter((question) => question.difficulty === difficulty).length < requested) {
      const eligible = candidates
        .map((candidate, sourceIndex) => ({ candidate, sourceIndex }))
        .filter(({ candidate }) => candidate.difficulty === difficulty)
        .filter(({ candidate }) => !usedQuestionVersionIds.has(candidate.questionVersionId))
        .filter(({ candidate }) => {
          const stemKey = normalizeBlueprintStem(candidate.stem);
          return Boolean(stemKey) && !usedStems.has(stemKey);
        })
        .filter(({ candidate }) => candidateIsReleaseEligible(candidate, usedReleasePoolIds))
        .sort((left, right) => {
          const leftKey = [
            countFor(authorityCounts, left.candidate.authorityId),
            countFor(taskCounts, left.candidate.taskKind),
            countFor(
              answerPositionCounts,
              left.candidate.answerPosition == null
                ? null
                : String(left.candidate.answerPosition),
            ),
            left.sourceIndex,
          ];
          const rightKey = [
            countFor(authorityCounts, right.candidate.authorityId),
            countFor(taskCounts, right.candidate.taskKind),
            countFor(
              answerPositionCounts,
              right.candidate.answerPosition == null
                ? null
                : String(right.candidate.answerPosition),
            ),
            right.sourceIndex,
          ];
          for (let index = 0; index < leftKey.length; index += 1) {
            const difference = Number(leftKey[index]) - Number(rightKey[index]);
            if (difference !== 0) return difference;
          }
          return 0;
        });

      available = eligible.length;
      const chosen = eligible[0]?.candidate;
      if (!chosen) break;
      const stemKey = normalizeBlueprintStem(chosen.stem);
      selected.push(chosen);
      usedQuestionVersionIds.add(chosen.questionVersionId);
      usedStems.add(stemKey);
      const pool = String(chosen.releasePoolId ?? "").trim();
      if (pool) usedReleasePoolIds.add(pool);
      increment(authorityCounts, chosen.authorityId);
      increment(taskCounts, chosen.taskKind);
      increment(
        answerPositionCounts,
        chosen.answerPosition == null ? null : String(chosen.answerPosition),
      );
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
