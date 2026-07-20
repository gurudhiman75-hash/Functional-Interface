import assert from "node:assert/strict";
import test from "node:test";

import { selectBlueprintSectionCandidates } from "./admin-test-blueprint-assembly";
import {
  TestBlueprintError,
  normalizeBlueprintAssemblyInput,
  normalizeBlueprintInput,
  type NormalizedBlueprintSection,
} from "./admin-test-blueprint";

const examVersionId = "11111111-1111-4111-8111-111111111111";
const taxonomyNodeId = "22222222-2222-4222-8222-222222222222";

function validInput() {
  return {
    examVersionId,
    code: "ssc-cgl-tier-1",
    name: "SSC CGL Tier 1 Full Mock",
    durationMinutes: 60,
    totalMarks: 200,
    instructions: { default: "Attempt every section." },
    configuration: { negativeMarking: true },
    changeReason: "Create the canonical SSC blueprint",
    sections: [
      {
        sectionKey: "quant",
        name: "Quantitative Aptitude",
        questionCount: 25,
        marks: 50,
        durationMinutes: 15,
        taxonomyNodeIds: [taxonomyNodeId],
        difficultyTargets: { easy: 8, medium: 12, hard: 5 },
        languageCode: "en",
        negativeMarks: 0.5,
      },
      {
        sectionKey: "reasoning",
        name: "General Intelligence and Reasoning",
        questionCount: 25,
        marks: 50,
        durationMinutes: 15,
        taxonomyNodeIds: [taxonomyNodeId],
        difficultyTargets: { easy: 8, medium: 12, hard: 5 },
        languageCode: "en",
        negativeMarks: 0.5,
      },
      {
        sectionKey: "english",
        name: "English Comprehension",
        questionCount: 25,
        marks: 50,
        durationMinutes: 15,
        taxonomyNodeIds: [taxonomyNodeId],
        difficultyTargets: { easy: 8, medium: 12, hard: 5 },
        languageCode: "en",
        negativeMarks: 0.5,
      },
      {
        sectionKey: "ga",
        name: "General Awareness",
        questionCount: 25,
        marks: 50,
        durationMinutes: 15,
        taxonomyNodeIds: [taxonomyNodeId],
        difficultyTargets: { easy: 8, medium: 12, hard: 5 },
        languageCode: "en",
        negativeMarks: 0.5,
      },
    ],
  };
}

test("normalizes a complete blueprint and immutable section rules", () => {
  const result = normalizeBlueprintInput(validInput());
  assert.equal(result.code, "SSC-CGL-TIER-1");
  assert.equal(result.sections.length, 4);
  assert.deepEqual(result.sections[0]?.difficultyTargets, { easy: 8, medium: 12, hard: 5 });
  assert.equal(result.sections[0]?.negativeMarks, 0.5);
});

test("rejects a difficulty quota that does not match section size", () => {
  const input = validInput();
  input.sections[0]!.difficultyTargets = { easy: 5, medium: 5, hard: 5 };
  assert.throws(
    () => normalizeBlueprintInput(input),
    (error: unknown) => error instanceof TestBlueprintError
      && error.code === "BLUEPRINT_DIFFICULTY_TOTAL_MISMATCH",
  );
});

test("rejects section marks that do not match the blueprint total", () => {
  const input = validInput();
  input.sections[0]!.marks = 40;
  assert.throws(
    () => normalizeBlueprintInput(input),
    (error: unknown) => error instanceof TestBlueprintError
      && error.code === "BLUEPRINT_MARKS_MISMATCH",
  );
});

test("rejects negative marks above positive marks per question", () => {
  const input = validInput();
  input.sections[0]!.negativeMarks = 3;
  assert.throws(
    () => normalizeBlueprintInput(input),
    (error: unknown) => error instanceof TestBlueprintError
      && error.code === "BLUEPRINT_NEGATIVE_MARKS_INVALID",
  );
});

test("creates a deterministic assembly request when a seed is supplied", () => {
  const result = normalizeBlueprintAssemblyInput({
    title: "SSC CGL Mock Test 01",
    seed: "mock-01",
    changeReason: "Create the first blueprint-compliant draft",
  });
  assert.deepEqual(result, {
    title: "SSC CGL Mock Test 01",
    seed: "mock-01",
    changeReason: "Create the first blueprint-compliant draft",
  });
});

const assemblySection: NormalizedBlueprintSection = {
  sectionKey: "quant",
  name: "Quantitative Aptitude",
  questionCount: 3,
  marks: 6,
  durationMinutes: 10,
  taxonomyNodeIds: [taxonomyNodeId],
  difficultyTargets: { easy: 1, medium: 2, hard: 0 },
  languageCode: "en",
  negativeMarks: 0.5,
};

test("assembly selects unique question versions and exact stems", () => {
  const result = selectBlueprintSectionCandidates({
    section: assemblySection,
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

test("assembly reports shortages after reuse and duplicate filtering", () => {
  const result = selectBlueprintSectionCandidates({
    section: assemblySection,
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
