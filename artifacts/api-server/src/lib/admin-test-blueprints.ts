import { randomUUID } from "node:crypto";

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

export type BlueprintStatus = "draft" | "active" | "deprecated" | "archived";

export interface BlueprintSectionInput {
  clientKey: string;
  name: string;
  questionCount: number;
  marks: number;
  durationMinutes: number | null;
  selectionRules: {
    taxonomyNodeIds: string[];
    languageCode: string;
    negativeMarks: number;
    difficulties: Record<string, number>;
  };
}

export interface BlueprintVersionInput {
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: {
    status: BlueprintStatus;
    stage: string;
    navigationRules: Record<string, unknown>;
  };
  changeReason: string;
  sections: BlueprintSectionInput[];
}

export interface BlueprintValidationIssue {
  code: string;
  message: string;
  sectionKey?: string;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, field: string, min = 1, max = 500): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length < min) throw new TestBlueprintError("BLUEPRINT_FIELD_REQUIRED", `${field} is required`);
  if (normalized.length > max) throw new TestBlueprintError("BLUEPRINT_FIELD_TOO_LONG", `${field} is too long`);
  return normalized;
}

function numberInRange(value: unknown, field: string, min: number, max: number): number {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < min || normalized > max) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_NUMBER", `${field} must be between ${min} and ${max}`);
  }
  return normalized;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function uuid(value: unknown, field: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!isUuid(normalized)) throw new TestBlueprintError("INVALID_BLUEPRINT_IDENTIFIER", `${field} is invalid`);
  return normalized;
}

function code(value: unknown): string {
  const normalized = text(value, "Blueprint code", 3, 80).toUpperCase().replace(/[^A-Z0-9_-]+/g, "-");
  if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(normalized)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_CODE", "Blueprint code is invalid");
  }
  return normalized;
}

function normalizeDifficultyMix(value: unknown, questionCount: number): Record<string, number> {
  const raw = asRecord(value);
  const result: Record<string, number> = {};
  for (const [key, countValue] of Object.entries(raw)) {
    const normalizedKey = key.trim().toLowerCase();
    if (!normalizedKey) continue;
    const count = Number(countValue);
    if (!Number.isInteger(count) || count < 0 || count > questionCount) {
      throw new TestBlueprintError("INVALID_DIFFICULTY_MIX", `Difficulty ${key} has an invalid count`);
    }
    if (count > 0) result[normalizedKey] = count;
  }
  const total = Object.values(result).reduce((sum, count) => sum + count, 0);
  if (total !== questionCount) {
    throw new TestBlueprintError("DIFFICULTY_TOTAL_MISMATCH", `Difficulty counts total ${total}, but the section requires ${questionCount}`);
  }
  return result;
}

export function normalizeBlueprintInput(value: unknown): BlueprintVersionInput {
  const input = asRecord(value);
  const rawSections = Array.isArray(input.sections) ? input.sections : [];
  if (rawSections.length === 0 || rawSections.length > 20) {
    throw new TestBlueprintError("BLUEPRINT_SECTIONS_REQUIRED", "A blueprint must contain between 1 and 20 sections");
  }

  const sectionKeys = new Set<string>();
  const sections = rawSections.map((rawSection, index): BlueprintSectionInput => {
    const section = asRecord(rawSection);
    const clientKey = text(section.clientKey ?? `section-${index + 1}`, `Section ${index + 1} key`, 1, 80)
      .toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    if (sectionKeys.has(clientKey)) throw new TestBlueprintError("DUPLICATE_BLUEPRINT_SECTION", `Section key ${clientKey} is duplicated`);
    sectionKeys.add(clientKey);

    const questionCount = numberInRange(section.questionCount, `Section ${index + 1} question count`, 1, 300);
    if (!Number.isInteger(questionCount)) throw new TestBlueprintError("INVALID_QUESTION_COUNT", "Section question counts must be whole numbers");
    const rules = asRecord(section.selectionRules);
    const taxonomyNodeIds = Array.from(new Set(
      (Array.isArray(rules.taxonomyNodeIds) ? rules.taxonomyNodeIds : []).map((entry) => uuid(entry, "Taxonomy node")),
    ));
    if (taxonomyNodeIds.length === 0) {
      throw new TestBlueprintError("BLUEPRINT_TAXONOMY_REQUIRED", `${text(section.name, `Section ${index + 1} name`, 1, 180)} needs at least one taxonomy target`);
    }
    const marks = numberInRange(section.marks, `Section ${index + 1} marks`, 0.01, 100000);
    const negativeMarks = numberInRange(rules.negativeMarks ?? 0, `Section ${index + 1} negative marks`, 0, 1000);
    const marksPerQuestion = marks / questionCount;
    if (negativeMarks > marksPerQuestion) {
      throw new TestBlueprintError("INVALID_BLUEPRINT_NEGATIVE_MARKS", "Negative marks cannot exceed marks per question");
    }
    return {
      clientKey,
      name: text(section.name, `Section ${index + 1} name`, 1, 180),
      questionCount,
      marks,
      durationMinutes: section.durationMinutes == null || section.durationMinutes === ""
        ? null
        : numberInRange(section.durationMinutes, `Section ${index + 1} duration`, 1, 600),
      selectionRules: {
        taxonomyNodeIds,
        languageCode: text(rules.languageCode ?? "en", "Language code", 2, 12).toLowerCase(),
        negativeMarks,
        difficulties: normalizeDifficultyMix(rules.difficulties, questionCount),
      },
    };
  });

  const configurationRaw = asRecord(input.configuration);
  const status = String(configurationRaw.status ?? "draft") as BlueprintStatus;
  if (!["draft", "active", "deprecated", "archived"].includes(status)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_STATUS", "Blueprint status is invalid");
  }

  const normalized: BlueprintVersionInput = {
    examVersionId: uuid(input.examVersionId, "Exam version"),
    code: code(input.code),
    name: text(input.name, "Blueprint name", 3, 240),
    durationMinutes: numberInRange(input.durationMinutes, "Blueprint duration", 1, 600),
    totalMarks: numberInRange(input.totalMarks, "Blueprint total marks", 0.01, 100000),
    instructions: asRecord(input.instructions),
    configuration: {
      status,
      stage: typeof configurationRaw.stage === "string" ? configurationRaw.stage.trim().slice(0, 120) : "",
      navigationRules: asRecord(configurationRaw.navigationRules),
    },
    changeReason: text(input.changeReason, "Change reason", 3, 1000),
    sections,
  };

  const issues = validateBlueprint(normalized);
  if (issues.length > 0) {
    throw new TestBlueprintError("BLUEPRINT_VALIDATION_FAILED", issues[0].message, 400, issues);
  }
  return normalized;
}

export function validateBlueprint(input: BlueprintVersionInput): BlueprintValidationIssue[] {
  const issues: BlueprintValidationIssue[] = [];
  const marks = input.sections.reduce((sum, section) => sum + section.marks, 0);
  if (Math.abs(marks - input.totalMarks) > 0.001) {
    issues.push({ code: "BLUEPRINT_MARKS_MISMATCH", message: `Section marks total ${marks}, but blueprint total is ${input.totalMarks}` });
  }
  const timed = input.sections.filter((section) => section.durationMinutes != null);
  if (timed.length > 0) {
    const duration = timed.reduce((sum, section) => sum + Number(section.durationMinutes), 0);
    if (duration !== input.durationMinutes) {
      issues.push({ code: "BLUEPRINT_DURATION_MISMATCH", message: `Section durations total ${duration} minutes, but blueprint duration is ${input.durationMinutes}` });
    }
  }
  for (const section of input.sections) {
    const difficultyTotal = Object.values(section.selectionRules.difficulties).reduce((sum, count) => sum + count, 0);
    if (difficultyTotal !== section.questionCount) {
      issues.push({ code: "BLUEPRINT_DIFFICULTY_MISMATCH", sectionKey: section.clientKey, message: `${section.name} difficulty counts do not match its question count` });
    }
  }
  return issues;
}

export function blueprintPublicCode(now = new Date(), id = randomUUID()): string {
  return `BP-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
