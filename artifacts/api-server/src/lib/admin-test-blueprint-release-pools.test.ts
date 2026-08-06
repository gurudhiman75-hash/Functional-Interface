import assert from "node:assert/strict";
import {
  selectBlueprintSectionCandidates,
  type BlueprintAssemblyCandidate,
} from "./admin-test-blueprint-assembly";
import type { NormalizedBlueprintSection } from "./admin-test-blueprint";

const section: NormalizedBlueprintSection = {
  sectionKey: "reasoning",
  name: "Reasoning",
  questionCount: 4,
  marks: 4,
  durationMinutes: 4,
  taxonomyNodeIds: ["00000000-0000-0000-0000-000000000001"],
  difficultyTargets: { easy: 0, medium: 4, hard: 0 },
  languageCode: "en",
  negativeMarks: 0.25,
};

function candidate(
  id: string,
  releasePoolId: string | null,
  releaseStatus: string | null,
  authorityId: string,
  taskKind: string,
  answerPosition: number,
): BlueprintAssemblyCandidate {
  return {
    questionId: `question-${id}`,
    questionVersionId: `version-${id}`,
    publicCode: `Q-${id}`,
    difficulty: "medium",
    stem: `Question stem ${id}`,
    releasePoolId,
    releaseStatus,
    authorityId,
    taskKind,
    answerPosition,
  };
}

const candidates = [
  candidate("1", "pool-a", "PRIMARY", "auth-a", "NEXT_TERM", 0),
  candidate("2", "pool-a", "PRIMARY", "auth-a", "MISSING_TERM", 1),
  candidate("3", "pool-b", "MUTUALLY_EXCLUSIVE_VARIANT", "auth-b", "NEXT_TERM", 2),
  candidate("4", "pool-b", "PRIMARY", "auth-b", "MISSING_TERM", 2),
  candidate("5", "pool-c", "PRIMARY", "auth-c", "NEXT_TWO_TERMS", 3),
  candidate("6", "pool-d", "PRIMARY", "auth-d", "WRONG_AND_REPLACEMENT", 1),
  candidate("7", null, null, "legacy", "NEXT_TERM", 0),
];

const usedReleasePoolIds = new Set<string>();
const result = selectBlueprintSectionCandidates({
  section,
  candidates,
  usedQuestionVersionIds: new Set<string>(),
  usedStems: new Set<string>(),
  usedReleasePoolIds,
});

assert.equal(result.shortages.length, 0);
assert.equal(result.selected.length, 4);
const selected = result.selected as BlueprintAssemblyCandidate[];
assert.equal(
  selected.filter((entry) => entry.releasePoolId === "pool-a").length,
  1,
);
assert.equal(
  selected.some((entry) => entry.releaseStatus === "MUTUALLY_EXCLUSIVE_VARIANT"),
  false,
);
const selectedPoolIds = selected
  .map((entry) => entry.releasePoolId)
  .filter((value): value is string => Boolean(value));
assert.equal(new Set(selectedPoolIds).size, selectedPoolIds.length);
assert.deepEqual(
  [...usedReleasePoolIds].sort(),
  [...new Set(selectedPoolIds)].sort(),
);

const legacyResult = selectBlueprintSectionCandidates({
  section: {
    ...section,
    questionCount: 1,
    difficultyTargets: { easy: 0, medium: 1, hard: 0 },
  },
  candidates: [candidate("legacy", null, null, "legacy", "NEXT_TERM", 0)],
  usedQuestionVersionIds: new Set<string>(),
  usedStems: new Set<string>(),
  usedReleasePoolIds: new Set<string>(),
});
assert.equal(legacyResult.shortages.length, 0);
assert.equal(legacyResult.selected.length, 1);
assert.equal(
  (legacyResult.selected[0] as BlueprintAssemblyCandidate).releasePoolId,
  null,
);

const blockedPool = selectedPoolIds[0] ?? "pool-a";
const secondSection = selectBlueprintSectionCandidates({
  section: {
    ...section,
    questionCount: 1,
    difficultyTargets: { easy: 0, medium: 1, hard: 0 },
  },
  candidates: [
    candidate("8", blockedPool, "PRIMARY", "auth-e", "NEXT_TERM", 0),
    candidate("9", "pool-e", "PRIMARY", "auth-e", "NEXT_TERM", 1),
  ],
  usedQuestionVersionIds: new Set<string>(),
  usedStems: new Set<string>(),
  usedReleasePoolIds,
});
assert.equal(secondSection.selected.length, 1);
assert.equal(
  (secondSection.selected[0] as BlueprintAssemblyCandidate).releasePoolId,
  "pool-e",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_TEST_ASSEMBLER_RELEASE_POOL_ENFORCEMENT",
      selected: result.selected.length,
      releasePoolCollisions: 0,
      nonPrimarySelections: 0,
      legacyQuestionCompatibility: true,
      crossSectionPoolEnforcement: true,
    },
    null,
    2,
  ),
);
