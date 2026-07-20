import assert from "node:assert/strict";
import test from "node:test";

import { TestBlueprintError, normalizeBlueprintInput, validateBlueprint } from "./admin-test-blueprints";

const EXAM_VERSION_ID = "11111111-1111-4111-8111-111111111111";
const TAXONOMY_ID = "22222222-2222-4222-8222-222222222222";

function validInput() {
  return {
    examVersionId: EXAM_VERSION_ID,
    code: "SSC-CGL-T1",
    name: "SSC CGL Tier 1",
    durationMinutes: 60,
    totalMarks: 100,
    instructions: { text: "Attempt every section." },
    configuration: { status: "draft", stage: "Tier 1", navigationRules: { switchSections: true } },
    changeReason: "Create canonical blueprint",
    sections: [
      {
        clientKey: "quant",
        name: "Quantitative Aptitude",
        questionCount: 25,
        marks: 50,
        durationMinutes: 30,
        selectionRules: {
          taxonomyNodeIds: [TAXONOMY_ID],
          languageCode: "en",
          negativeMarks: 0.5,
          difficulties: { easy: 8, medium: 12, hard: 5 },
        },
      },
      {
        clientKey: "reasoning",
        name: "General Intelligence",
        questionCount: 25,
        marks: 50,
        durationMinutes: 30,
        selectionRules: {
          taxonomyNodeIds: [TAXONOMY_ID],
          languageCode: "en",
          negativeMarks: 0.5,
          difficulties: { easy: 8, medium: 12, hard: 5 },
        },
      },
    ],
  };
}

test("normalizes a complete blueprint", () => {
  const input = normalizeBlueprintInput(validInput());
  assert.equal(input.code, "SSC-CGL-T1");
  assert.equal(input.sections.length, 2);
  assert.equal(validateBlueprint(input).length, 0);
});

test("rejects a difficulty mix that does not match the section count", () => {
  const value = validInput();
  value.sections[0].selectionRules.difficulties = { easy: 8, medium: 8, hard: 5 };
  assert.throws(
    () => normalizeBlueprintInput(value),
    (error: unknown) => error instanceof TestBlueprintError && error.code === "DIFFICULTY_TOTAL_MISMATCH",
  );
});

test("rejects blueprint total marks mismatch", () => {
  const value = validInput();
  value.totalMarks = 90;
  assert.throws(
    () => normalizeBlueprintInput(value),
    (error: unknown) => error instanceof TestBlueprintError && error.code === "BLUEPRINT_VALIDATION_FAILED",
  );
});

test("requires taxonomy targets for every section", () => {
  const value = validInput();
  value.sections[1].selectionRules.taxonomyNodeIds = [];
  assert.throws(
    () => normalizeBlueprintInput(value),
    (error: unknown) => error instanceof TestBlueprintError && error.code === "BLUEPRINT_TAXONOMY_REQUIRED",
  );
});
