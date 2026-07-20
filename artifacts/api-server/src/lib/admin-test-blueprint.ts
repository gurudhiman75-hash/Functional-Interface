import { randomUUID } from "node:crypto";

import { isUuid } from "./admin-test-management";

export class TestBlueprintError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TestBlueprintError";
  }
}

export type BlueprintDifficulty = "easy" | "medium" | "hard";

export interface BlueprintDifficultyTargets {
  easy: number;
  medium: number;
  hard: number;
}

export interface NormalizedBlueprintSection {
  sectionKey: string;
  name: string;
  questionCount: number;
  marks: number;
  durationMinutes: number | null;
  taxonomyNodeIds: string[];
  difficultyTargets: BlueprintDifficultyTargets;
  languageCode: string;
  negativeMarks: number;
}

export interface NormalizedBlueprintInput {
  expectedCurrentVersionNumber: number | null;
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: Record<string, unknown>;
  changeReason: string;
  sections: NormalizedBlueprintSection[];
}

export interface BlueprintAssemblyQuestion {
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  difficulty: string;
  stem: string;
}

export interface BlueprintAssemblySection {
  sectionKey: string;
  name: string;
  durationMinutes: number | null;
  marks: number;
  negativeMarks: number;
  questions: BlueprintAssemblyQuestion[];
}

export interface BlueprintAssemblyShortage {
  sectionKey: string;
  sectionName: string;
  difficulty: BlueprintDifficulty;
  requested: number;
  available: number;
  missing: number;
}

export interface BlueprintAssemblyPlan {
  seed: string;
  sections: BlueprintAssemblySection[];
  shortages: BlueprintAssemblyShortage[];
  selectedCount: number;
  requiredCount: number;
  ready: boolean;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function requiredText(value: unknown, field: string, min: number, max: number): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length < min) {
    throw new TestBlueprintError("BLUEPRINT_FIELD_REQUIRED", `${field} is required`);
  }
  if (normalized.length > max) {
    throw new TestBlueprintError("BLUEPRINT_FIELD_TOO_LONG", `${field} is too long`);
  }
  return normalized;
}

function numberInRange(value: unknown, field: string, min: number, max: number): number {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < min || normalized > max) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_NUMBER", `${field} must be between ${min} and ${max}`);
  }
  return normalized;
}

function integerInRange(value: unknown, field: string, min: number, max: number): number {
  const normalized = numberInRange(value, field, min, max);
  if (!Number.isInteger(normalized)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_INTEGER", `${field} must be a whole number`);
  }
  return normalized;
}

function uuid(value: unknown, field: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!isUuid(normalized)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_IDENTIFIER", `${field} is invalid`);
  }
  return normalized;
}

function optionalVersionNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  return integerInRange(value, "Expected blueprint version", 1, 1000000);
}

function normalizeDifficultyTargets(value: unknown, questionCount: number): BlueprintDifficultyTargets {
  const input = asRecord(value);
  const result = {
    easy: integerInRange(input.easy ?? 0, "Easy question target", 0, questionCount),
    medium: integerInRange(input.medium ?? 0, "Medium question target", 0, questionCount),
    hard: integerInRange(input.hard ?? 0, "Hard question target", 0, questionCount),
  };
  const total = result.easy + result.medium + result.hard;
  if (total !== questionCount) {
    throw new TestBlueprintError(
      "BLUEPRINT_DIFFICULTY_TOTAL_MISMATCH",
      `Difficulty targets total ${total}, but the section requires ${questionCount} questions`,
      400,
      { questionCount, difficultyTargets: result },
    );
  }
  return result;
}

function normalizeTaxonomyNodeIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  const result = [...new Set(values.map((entry) => uuid(entry, "Taxonomy node")))];
  if (result.length === 0) {
    throw new TestBlueprintError("BLUEPRINT_TAXONOMY_REQUIRED", "Each blueprint section requires at least one taxonomy node");
  }
  if (result.length > 20) {
    throw new TestBlueprintError("BLUEPRINT_TAXONOMY_LIMIT", "A section cannot target more than 20 taxonomy nodes");
  }
  return result;
}

function sectionKey(value: unknown, index: number): string {
  const normalized = requiredText(value ?? `section-${index + 1}`, `Section ${index + 1} key`, 1, 80)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_SECTION_KEY", `Section ${index + 1} key is invalid`);
  }
  return normalized;
}

export function normalizeBlueprintInput(value: unknown): NormalizedBlueprintInput {
  const input = asRecord(value);
  const rawSections = Array.isArray(input.sections) ? input.sections : [];
  if (rawSections.length === 0 || rawSections.length > 20) {
    throw new TestBlueprintError("BLUEPRINT_SECTIONS_REQUIRED", "A blueprint must contain between 1 and 20 sections");
  }

  const keys = new Set<string>();
  const sections = rawSections.map((entry, index): NormalizedBlueprintSection => {
    const section = asRecord(entry);
    const key = sectionKey(section.sectionKey, index);
    if (keys.has(key)) {
      throw new TestBlueprintError("DUPLICATE_BLUEPRINT_SECTION", `Section key ${key} is duplicated`);
    }
    keys.add(key);

    const questionCount = integerInRange(section.questionCount, `Section ${index + 1} question count`, 1, 300);
    const marks = numberInRange(section.marks, `Section ${index + 1} marks`, 0.01, 100000);
    const marksPerQuestion = marks / questionCount;
    const negativeMarks = numberInRange(section.negativeMarks ?? 0, `Section ${index + 1} negative marks`, 0, 1000);
    if (negativeMarks > marksPerQuestion) {
      throw new TestBlueprintError(
        "BLUEPRINT_NEGATIVE_MARKS_INVALID",
        `Negative marks in ${requiredText(section.name, `Section ${index + 1} name`, 1, 180)} cannot exceed marks per question`,
      );
    }

    const durationValue = section.durationMinutes;
    return {
      sectionKey: key,
      name: requiredText(section.name, `Section ${index + 1} name`, 1, 180),
      questionCount,
      marks,
      durationMinutes: durationValue == null || durationValue === ""
        ? null
        : numberInRange(durationValue, `Section ${index + 1} duration`, 1, 600),
      taxonomyNodeIds: normalizeTaxonomyNodeIds(section.taxonomyNodeIds),
      difficultyTargets: normalizeDifficultyTargets(section.difficultyTargets, questionCount),
      languageCode: requiredText(section.languageCode ?? "en", `Section ${index + 1} language`, 2, 12).toLowerCase(),
      negativeMarks,
    };
  });

  const durationMinutes = numberInRange(input.durationMinutes, "Blueprint duration", 1, 600);
  const totalMarks = numberInRange(input.totalMarks, "Blueprint total marks", 0.01, 100000);
  const sectionMarks = sections.reduce((sum, section) => sum + section.marks, 0);
  if (Math.abs(sectionMarks - totalMarks) > 0.001) {
    throw new TestBlueprintError(
      "BLUEPRINT_MARKS_MISMATCH",
      `Section marks total ${sectionMarks}, but the blueprint total is ${totalMarks}`,
      400,
      { sectionMarks, totalMarks },
    );
  }
  const timedSections = sections.filter((section) => section.durationMinutes != null);
  if (timedSections.length === sections.length) {
    const sectionDuration = timedSections.reduce((sum, section) => sum + Number(section.durationMinutes), 0);
    if (Math.abs(sectionDuration - durationMinutes) > 0.001) {
      throw new TestBlueprintError(
        "BLUEPRINT_DURATION_MISMATCH",
        `Section durations total ${sectionDuration} minutes, but the blueprint duration is ${durationMinutes}`,
      );
    }
  }

  const code = requiredText(input.code, "Blueprint code", 3, 60)
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (code.length < 3) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_CODE", "Blueprint code is invalid");
  }

  return {
    expectedCurrentVersionNumber: optionalVersionNumber(input.expectedCurrentVersionNumber),
    examVersionId: uuid(input.examVersionId, "Exam version"),
    code,
    name: requiredText(input.name, "Blueprint name", 3, 180),
    durationMinutes,
    totalMarks,
    instructions: asRecord(input.instructions),
    configuration: asRecord(input.configuration),
    changeReason: requiredText(input.changeReason, "Change reason", 3, 1000),
    sections,
  };
}

export function normalizeBlueprintAssemblyInput(value: unknown): {
  title: string;
  seed: string;
  changeReason: string;
} {
  const input = asRecord(value);
  return {
    title: requiredText(input.title, "Test title", 3, 240),
    seed: (typeof input.seed === "string" && input.seed.trim()
      ? input.seed.trim().slice(0, 120)
      : randomUUID()),
    changeReason: requiredText(input.changeReason, "Assembly reason", 3, 1000),
  };
}

export function emptyAssemblyPlan(seed: string, sections: NormalizedBlueprintSection[]): BlueprintAssemblyPlan {
  return {
    seed,
    sections: sections.map((section) => ({
      sectionKey: section.sectionKey,
      name: section.name,
      durationMinutes: section.durationMinutes,
      marks: section.marks,
      negativeMarks: section.negativeMarks,
      questions: [],
    })),
    shortages: [],
    selectedCount: 0,
    requiredCount: sections.reduce((sum, section) => sum + section.questionCount, 0),
    ready: false,
  };
}

export function blueprintVersionId(): string {
  return randomUUID();
}
