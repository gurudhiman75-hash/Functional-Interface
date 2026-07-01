import { loadQuestionPackage } from "./loader";
import { getQuestionPackageMetadata } from "./registry";
import { validateQuestionPackage } from "./package-validator";
import type { QuestionPackage, QuestionPackageId } from "./types";

export class QuestionPackageNotReadyError extends Error {
  readonly code = "QUESTION_PACKAGE_NOT_READY";

  constructor(
    readonly questionId: QuestionPackageId,
    readonly failureCodes: readonly string[],
  ) {
    super(
      `${questionId} is not generation-ready: ${failureCodes.join(", ")}`,
    );
    this.name = "QuestionPackageNotReadyError";
  }
}

export async function resolveQuestionPackage(
  questionId: QuestionPackageId,
  packageRoot: string,
): Promise<QuestionPackage> {
  const metadata = getQuestionPackageMetadata(questionId);
  const questionPackage = await loadQuestionPackage(metadata, packageRoot);
  const validation = validateQuestionPackage(questionPackage);
  if (!validation.generationReady) {
    throw new QuestionPackageNotReadyError(
      questionId,
      validation.failures.map((failure) =>
        failure.asset
          ? `${failure.code}:${failure.asset}`
          : failure.code,
      ),
    );
  }
  return questionPackage;
}

