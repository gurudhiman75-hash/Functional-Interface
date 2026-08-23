export type QuestionOptionInput = {
  text: string;
  isCorrect: boolean;
};

export type NormalizedQuestionVersionInput = {
  expectedLockVersion: number;
  stem: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  changeReason: string;
  options: QuestionOptionInput[];
  correctIndex: number;
};

export type NormalizedQuestionTaxonomyInput = {
  expectedLockVersion: number;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds: string[];
};

export type QuestionLifecycleAction =
  | "submit-review"
  | "approve"
  | "needs-fix"
  | "restore-draft"
  | "publish"
  | "unpublish"
  | "archive";

export type QuestionLifecycleConfig = {
  status: "draft" | "under_review" | "needs_fix" | "approved" | "published" | "archived";
  permission: string;
  requiresReason: boolean;
  actionKey: string;
};

export type PublishableQuestionSnapshot = {
  status: string;
  approvedVersionId: string | null;
  examVersionId: string | null;
  primaryTaxonomyNodeId: string | null;
  taxonomyNodeIds: string[];
  stem: string;
  explanation: string;
  optionCount: number;
  correctOptionCount: number;
  generationPubliclyPublishable: boolean | null;
  generationTestEligible: boolean | null;
};

export class QuestionManagementError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "QuestionManagementError";
  }
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asLockVersion(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new QuestionManagementError(
      "INVALID_LOCK_VERSION",
      "A valid question lock version is required",
      400,
    );
  }
  return parsed;
}

function asUuid(value: unknown, code: string, message: string): string {
  const text = asText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new QuestionManagementError(code, message, 400);
  }
  return text;
}

export function normalizeQuestionVersionInput(value: unknown): NormalizedQuestionVersionInput {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const stem = asText(input.stem);
  const explanation = asText(input.explanation);
  const difficulty = asText(input.difficulty) || "Medium";
  const questionType = asText(input.questionType) || "mcq_single";
  const changeReason = asText(input.changeReason);
  const rawOptions = Array.isArray(input.options) ? input.options : [];
  const options = rawOptions.map((entry) => {
    const option = entry && typeof entry === "object" && !Array.isArray(entry)
      ? entry as Record<string, unknown>
      : {};
    return {
      text: asText(option.text),
      isCorrect: option.isCorrect === true,
    };
  });

  if (!stem) {
    throw new QuestionManagementError("QUESTION_STEM_REQUIRED", "Question stem is required", 400);
  }
  if (!explanation) {
    throw new QuestionManagementError("QUESTION_EXPLANATION_REQUIRED", "Question explanation is required", 400);
  }
  if (!changeReason) {
    throw new QuestionManagementError("CHANGE_REASON_REQUIRED", "Describe why this question version is changing", 400);
  }
  if (options.length < 2 || options.length > 8 || options.some((option) => !option.text)) {
    throw new QuestionManagementError(
      "INVALID_QUESTION_OPTIONS",
      "Provide between 2 and 8 non-empty answer options",
      400,
    );
  }

  const correctIndexes = options
    .map((option, index) => option.isCorrect ? index : -1)
    .filter((index) => index >= 0);
  if (correctIndexes.length !== 1) {
    throw new QuestionManagementError(
      "SINGLE_CORRECT_OPTION_REQUIRED",
      "Exactly one answer option must be marked correct",
      400,
    );
  }

  return {
    expectedLockVersion: asLockVersion(input.expectedLockVersion),
    stem,
    explanation,
    difficulty,
    questionType,
    changeReason,
    options,
    correctIndex: correctIndexes[0],
  };
}

export function normalizeQuestionTaxonomyInput(value: unknown): NormalizedQuestionTaxonomyInput {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const examVersionId = asUuid(
    input.examVersionId,
    "EXAM_VERSION_REQUIRED",
    "Select an exam version before saving taxonomy",
  );
  const primaryTaxonomyNodeId = asUuid(
    input.primaryTaxonomyNodeId,
    "PRIMARY_TAXONOMY_REQUIRED",
    "Select a primary taxonomy topic",
  );
  const rawIds = Array.isArray(input.taxonomyNodeIds) ? input.taxonomyNodeIds : [];
  const taxonomyNodeIds = Array.from(new Set([
    ...rawIds.map((entry) => asUuid(entry, "INVALID_TAXONOMY_NODE", "Invalid taxonomy selection")),
    primaryTaxonomyNodeId,
  ]));

  return {
    expectedLockVersion: asLockVersion(input.expectedLockVersion),
    examVersionId,
    primaryTaxonomyNodeId,
    taxonomyNodeIds,
  };
}

const LIFECYCLE_CONFIG: Record<QuestionLifecycleAction, QuestionLifecycleConfig> = {
  "submit-review": {
    status: "under_review",
    permission: "content.questions.update",
    requiresReason: false,
    actionKey: "content.question.submitted_for_review",
  },
  approve: {
    status: "approved",
    permission: "content.questions.approve",
    requiresReason: false,
    actionKey: "content.question.approved",
  },
  "needs-fix": {
    status: "needs_fix",
    permission: "content.questions.approve",
    requiresReason: true,
    actionKey: "content.question.needs_fix",
  },
  "restore-draft": {
    status: "draft",
    permission: "content.questions.update",
    requiresReason: true,
    actionKey: "content.question.restored_to_draft",
  },
  publish: {
    status: "published",
    permission: "content.questions.approve",
    requiresReason: false,
    actionKey: "content.question.published",
  },
  unpublish: {
    status: "approved",
    permission: "content.questions.approve",
    requiresReason: true,
    actionKey: "content.question.unpublished",
  },
  archive: {
    status: "archived",
    permission: "content.questions.delete",
    requiresReason: true,
    actionKey: "content.question.archived",
  },
};

export function getQuestionLifecycleConfig(action: string): QuestionLifecycleConfig {
  const config = LIFECYCLE_CONFIG[action as QuestionLifecycleAction];
  if (!config) {
    throw new QuestionManagementError("INVALID_QUESTION_ACTION", "Unsupported question lifecycle action", 400);
  }
  return config;
}

export function normalizeLifecycleInput(
  action: string,
  value: unknown,
): { expectedLockVersion: number; reason: string; config: QuestionLifecycleConfig } {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const config = getQuestionLifecycleConfig(action);
  const reason = asText(input.reason);
  if (config.requiresReason && !reason) {
    throw new QuestionManagementError("ACTION_REASON_REQUIRED", "A reason is required for this action", 400);
  }
  return {
    expectedLockVersion: asLockVersion(input.expectedLockVersion),
    reason,
    config,
  };
}

export function getPublicationIssues(snapshot: PublishableQuestionSnapshot): string[] {
  const issues: string[] = [];
  if (snapshot.status !== "approved") issues.push("The question must be approved before publishing.");
  if (!snapshot.approvedVersionId) issues.push("An approved version is required.");
  if (!snapshot.examVersionId) issues.push("Assign an exam version.");
  if (!snapshot.primaryTaxonomyNodeId) issues.push("Assign a primary taxonomy topic.");
  if (snapshot.taxonomyNodeIds.length === 0) issues.push("Assign taxonomy to the approved version.");
  if (!snapshot.stem.trim()) issues.push("Question stem is missing.");
  if (!snapshot.explanation.trim()) issues.push("Explanation is missing.");
  if (snapshot.optionCount < 2) issues.push("At least two answer options are required.");
  if (snapshot.correctOptionCount !== 1) issues.push("Exactly one correct answer is required.");
  if (snapshot.generationTestEligible === false) {
    issues.push("Generation lifecycle has not enabled scored-test eligibility.");
  }
  if (snapshot.generationPubliclyPublishable === false) {
    issues.push("Generation lifecycle has not enabled public publication.");
  }
  return issues;
}

export function assertQuestionPublishable(snapshot: PublishableQuestionSnapshot): void {
  const issues = getPublicationIssues(snapshot);
  if (issues.length > 0) {
    throw new QuestionManagementError(
      "QUESTION_NOT_PUBLISHABLE",
      issues[0],
      409,
      { issues },
    );
  }
}
