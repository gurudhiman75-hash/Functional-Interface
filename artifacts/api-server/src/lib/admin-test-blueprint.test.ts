import assert from "node:assert/strict";
import test from "node:test";

import {
  TestBlueprintError,
  normalizeBlueprintAssemblyInput,
  normalizeBlueprintInput,
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
