import { randomUUID } from "node:crypto";

export class TestManagementError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TestManagementError";
  }
}

export interface NormalizedTestQuestionInput {
  questionVersionId: string;
  marks: number;
  negativeMarks: number;
  settings: Record<string, unknown>;
}

export interface NormalizedTestSectionInput {
  clientKey: string;
  name: string;
  durationMinutes: number | null;
  settings: Record<string, unknown>;
  questions: NormalizedTestQuestionInput[];
}

export interface NormalizedTestDraftInput {
  expectedCurrentDraftVersionId: string | null;
  examVersionId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  sections: NormalizedTestSectionInput[];
}

export interface TestValidationIssue {
  code: string;
  message: string;
}

export type TestLifecycleAction =
  | "submit-qa"
  | "needs-fix"
  | "approve"
  | "schedule"
  | "publish"
  | "archive"
  | "restore-draft";

export interface TestLifecycleConfig {
  status: "draft" | "under_qa" | "needs_fix" | "qa_approved" | "scheduled" | "live" | "archived";
  permission: "tests.update" | "tests.approve" | "tests.publish";
  requiresReason: boolean;
  actionKey: string;
}

const lifecycleConfigs: Record<TestLifecycleAction, TestLifecycleConfig> = {
  "submit-qa": {
    status: "under_qa",
    permission: "tests.update",
    requiresReason: false,
    actionKey: "assessment.test.submitted_qa",
  },
  "needs-fix": {
    status: "needs_fix",
    permission: "tests.approve",
    requiresReason: true,
    actionKey: "assessment.test.needs_fix",
  },
  approve: {
    status: "qa_approved",
    permission: "tests.approve",
    requiresReason: false,
    actionKey: "assessment.test.qa_approved",
  },
  schedule: {
    status: "scheduled",
    permission: "tests.publish",
    requiresReason: false,
    actionKey: "assessment.test.scheduled",
  },
  publish: {
    status: "live",
    permission: "tests.publish",
    requiresReason: false,
    actionKey: "assessment.test.published",
  },
  archive: {
    status: "archived",
    permission: "tests.update",
    requiresReason: true,
    actionKey: "assessment.test.archived",
  },
  "restore-draft": {
    status: "draft",
    permission: "tests.update",
    requiresReason: true,
    actionKey: "assessment.test.restored_draft",
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, field: string, min = 1, max = 5000): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length < min) {
    throw new TestManagementError("TEST_FIELD_REQUIRED", `${field} is required`);
  }
  if (normalized.length > max) {
    throw new TestManagementError("TEST_FIELD_TOO_LONG", `${field} is too long`);
  }
  return normalized;
}

function optionalText(value: unknown, max = 10000): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length > max) {
    throw new TestManagementError("TEST_FIELD_TOO_LONG", "A test text field is too long");
  }
  return normalized;
}

function numberInRange(value: unknown, field: string, min: number, max: number): number {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < min || normalized > max) {
    throw new TestManagementError("INVALID_TEST_NUMBER", `${field} must be between ${min} and ${max}`);
  }
  return normalized;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function uuid(value: unknown, field: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!isUuid(normalized)) {
    throw new TestManagementError("INVALID_TEST_IDENTIFIER", `${field} is invalid`);
  }
  return normalized;
}

function optionalUuid(value: unknown, field: string): string | null {
  if (value == null || value === "") return null;
  return uuid(value, field);
}

export function normalizeTestDraftInput(value: unknown): NormalizedTestDraftInput {
  const input = asRecord(value);
  const rawSections = Array.isArray(input.sections) ? input.sections : [];
  if (rawSections.length === 0 || rawSections.length > 20) {
    throw new TestManagementError("TEST_SECTIONS_REQUIRED", "A test must contain between 1 and 20 sections");
  }

  const sectionKeys = new Set<string>();
  const questionVersionIds = new Set<string>();
  const sections = rawSections.map((rawSection, sectionIndex): NormalizedTestSectionInput => {
    const section = asRecord(rawSection);
    const clientKey = text(section.clientKey ?? `section-${sectionIndex + 1}`, "Section key", 1, 80)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-");
    if (sectionKeys.has(clientKey)) {
      throw new TestManagementError("DUPLICATE_TEST_SECTION", `Section key ${clientKey} is duplicated`);
    }
    sectionKeys.add(clientKey);

    const rawQuestions = Array.isArray(section.questions) ? section.questions : [];
    if (rawQuestions.length > 300) {
      throw new TestManagementError("TOO_MANY_TEST_QUESTIONS", "A section cannot contain more than 300 questions");
    }

    const questions = rawQuestions.map((rawQuestion): NormalizedTestQuestionInput => {
      const question = asRecord(rawQuestion);
      const questionVersionId = uuid(question.questionVersionId, "Question version");
      if (questionVersionIds.has(questionVersionId)) {
        throw new TestManagementError("DUPLICATE_TEST_QUESTION", "A published question can appear only once in a test version");
      }
      questionVersionIds.add(questionVersionId);
      const marks = numberInRange(question.marks, "Question marks", 0.01, 1000);
      const negativeMarks = numberInRange(question.negativeMarks ?? 0, "Negative marks", 0, 1000);
      if (negativeMarks > marks) {
        throw new TestManagementError("INVALID_NEGATIVE_MARKS", "Negative marks cannot exceed positive marks");
      }
      return {
        questionVersionId,
        marks,
        negativeMarks,
        settings: asRecord(question.settings),
      };
    });

    const durationValue = section.durationMinutes;
    return {
      clientKey,
      name: text(section.name, `Section ${sectionIndex + 1} name`, 1, 180),
      durationMinutes: durationValue == null || durationValue === ""
        ? null
        : numberInRange(durationValue, "Section duration", 1, 600),
      settings: asRecord(section.settings),
      questions,
    };
  });

  const result: NormalizedTestDraftInput = {
    expectedCurrentDraftVersionId: optionalUuid(input.expectedCurrentDraftVersionId, "Expected draft version"),
    examVersionId: uuid(input.examVersionId, "Exam version"),
    title: text(input.title, "Test title", 3, 240),
    description: optionalText(input.description, 12000),
    durationMinutes: numberInRange(input.durationMinutes, "Test duration", 1, 600),
    totalMarks: numberInRange(input.totalMarks, "Total marks", 0.01, 100000),
    instructions: asRecord(input.instructions),
    settings: asRecord(input.settings),
    changeReason: text(input.changeReason, "Change reason", 3, 1000),
    sections,
  };

  const issues = validateTestDraftShape(result);
  const structuralIssues = issues.filter((issue) => issue.code.startsWith("STRUCTURE_"));
  if (structuralIssues.length > 0) {
    throw new TestManagementError(
      "INVALID_TEST_STRUCTURE",
      structuralIssues[0].message,
      400,
      structuralIssues,
    );
  }
  return result;
}

export function validateTestDraftShape(input: NormalizedTestDraftInput): TestValidationIssue[] {
  const issues: TestValidationIssue[] = [];
  const questionCount = input.sections.reduce((sum, section) => sum + section.questions.length, 0);
  if (questionCount === 0) {
    issues.push({ code: "STRUCTURE_NO_QUESTIONS", message: "Select at least one published question" });
  }
  input.sections.forEach((section) => {
    if (section.questions.length === 0) {
      issues.push({ code: "STRUCTURE_EMPTY_SECTION", message: `${section.name} has no questions` });
    }
  });

  const calculatedMarks = input.sections.reduce(
    (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
    0,
  );
  if (questionCount > 0 && Math.abs(calculatedMarks - input.totalMarks) > 0.001) {
    issues.push({
      code: "STRUCTURE_MARKS_MISMATCH",
      message: `Question marks total ${calculatedMarks}, but the test total is ${input.totalMarks}`,
    });
  }

  const timedSections = input.sections.filter((section) => section.durationMinutes != null);
  if (timedSections.length > 0) {
    const sectionDuration = timedSections.reduce((sum, section) => sum + Number(section.durationMinutes), 0);
    if (sectionDuration !== input.durationMinutes) {
      issues.push({
        code: "STRUCTURE_DURATION_MISMATCH",
        message: `Section durations total ${sectionDuration} minutes, but the test duration is ${input.durationMinutes}`,
      });
    }
  }
  return issues;
}

export function getTestLifecycleConfig(action: string): TestLifecycleConfig {
  const config = lifecycleConfigs[action as TestLifecycleAction];
  if (!config) {
    throw new TestManagementError("INVALID_TEST_ACTION", "Unsupported test lifecycle action", 404);
  }
  return config;
}

export function normalizeTestLifecycleInput(action: string, value: unknown) {
  const config = getTestLifecycleConfig(action);
  const input = asRecord(value);
  const expectedCurrentDraftVersionId = uuid(input.expectedCurrentDraftVersionId, "Expected draft version");
  const reason = optionalText(input.reason, 1000);
  if (config.requiresReason && reason.length < 3) {
    throw new TestManagementError("TEST_ACTION_REASON_REQUIRED", "A reason is required for this action");
  }

  const scheduledAt = input.scheduledAt == null || input.scheduledAt === ""
    ? null
    : new Date(String(input.scheduledAt));
  if (action === "schedule") {
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      throw new TestManagementError("INVALID_TEST_SCHEDULE", "Choose a future publication time");
    }
  }

  const closesAt = input.closesAt == null || input.closesAt === ""
    ? null
    : new Date(String(input.closesAt));
  if (closesAt && (Number.isNaN(closesAt.getTime()) || closesAt.getTime() <= Date.now())) {
    throw new TestManagementError("INVALID_TEST_CLOSE_TIME", "Closing time must be in the future");
  }

  return {
    config,
    expectedCurrentDraftVersionId,
    reason,
    scheduledAt: scheduledAt?.toISOString() ?? null,
    closesAt: closesAt?.toISOString() ?? null,
  };
}

export function testPublicCode(now = new Date(), id = randomUUID()): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `T-${date}-${id.replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}
