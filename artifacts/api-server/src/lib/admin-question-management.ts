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

export type QuestionLifecycleAction =
  | "submit-review"
  | "approve"
  | "needs-fix"
  | "restore-draft"
  | "archive";

export type QuestionLifecycleConfig = {
  status: "draft" | "under_review" | "needs_fix" | "approved" | "archived";
  permission: string;
  requiresReason: boolean;
  actionKey: string;
};

export class QuestionManagementError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
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
