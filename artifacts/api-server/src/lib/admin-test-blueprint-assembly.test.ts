import assert from "node:assert/strict";
import test from "node:test";

import { selectBlueprintSectionCandidates } from "./admin-test-blueprint-assembly";
import type { NormalizedBlueprintSection } from "./admin-test-blueprint";

const section: NormalizedBlueprintSection = {
  sectionKey: "quant",
  name: "Quantitative Aptitude",
  questionCount: 3,
  marks: 6,
  durationMinutes: 10,
  taxonomyNodeIds: ["11111111-1111-4111-8111-111111111111"],
  difficultyTargets: { easy: 1, medium: 2, hard: 0 },
  languageCode: "en",
  negativeMarks: 0.5,
};

test("selects unique question versions and exact stems across quotas", () => {
  const result = selectBlueprintSectionCandidates({
    section,
    usedQuestionVersionIds: new Set(),
    usedStems: new Set(),
    candidates: [
      { questionId: "q1", questionVersionId: "v1", publicCode: "Q1", difficulty: "easy", stem: "Find 20 percent of 500." },
      { questionId: "q2", questionVersionId: "v2", publicCode: "Q2", difficulty: "medium", stem: "A salary rises by 20 percent and then falls by 10 percent. Find the net change." },
      { questionId: "q3", questionVersionId: "v3", publicCode: "Q3", difficulty: "medium", stem: "A salary rises by 20 percent and then falls by 10 percent. Find the net change." },
      { questionId: "q4", questionVersionId: "v4", publicCode: "Q4", difficulty: "medium", stem: "The population increases from 4000 to 4600. Find the percentage increase." },
    ],
  });

  assert.deepEqual(result.selected.map((question) => question.questionVersionId), ["v1", "v2", "v4"]);
  assert.equal(result.shortages.length, 0);
});

test("reports a precise shortage after duplicate filtering", () => {
  const result = selectBlueprintSectionCandidates({
    section,
    usedQuestionVersionIds: new Set(["v1"]),
    usedStems: new Set(["a salary rises by 20 percent and then falls by 10 percent find the net change"]),
    candidates: [
      { questionId: "q1", questionVersionId: "v1", publicCode: "Q1", difficulty: "easy", stem: "Find 20 percent of 500." },
      { questionId: "q2", questionVersionId: "v2", publicCode: "Q2", difficulty: "medium", stem: "A salary rises by 20 percent and then falls by 10 percent. Find the net change." },
      { questionId: "q4", questionVersionId: "v4", publicCode: "Q4", difficulty: "medium", stem: "The population increases from 4000 to 4600. Find the percentage increase." },
    ],
  });

  assert.equal(result.selected.length, 1);
  assert.equal(result.shortages.reduce((sum, shortage) => sum + shortage.missing, 0), 2);
});
