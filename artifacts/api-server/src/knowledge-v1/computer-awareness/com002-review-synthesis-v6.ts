import { assertKnowledgeQuestionValid } from "../question-validation";
import type { Com002ReviewQuestion } from "./com002-review-types";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  generateCom002ReviewQuestionV5,
} from "./com002-review-synthesis-v5";

export const COM002_ENGLISH_GENERATOR_VERSION_V6 =
  "COM-002-ENGLISH-GENERATOR-V6-ERRATA-REVIEW-CANDIDATE-2" as const;
export const COM002_ENGLISH_V6_SUPERSEDES = COM002_ENGLISH_GENERATOR_VERSION_V5;

function indefiniteArticleFor(text: string) {
  return /^[aeiou]/i.test(text.trim()) ? "an" : "a";
}

function repairEnglishTextV6(text: string) {
  let repaired = text
    .replace(/\bA executable program file\b/g, "An executable program file")
    .replace(/\ba executable program file\b/g, "an executable program file")
    .replace(/\bA Real-time operating system\b/g, "A real-time operating system");

  repaired = repaired.replace(
    /\bis classified as ((?!an?\s)[^.\n]+ operating system)\./gi,
    (_match, description: string) =>
      `is classified as ${indefiniteArticleFor(description)} ${description}.`,
  );
  repaired = repaired.replace(
    /\bis associated with ((?!an?\s)[^.\n]+ file)\./gi,
    (_match, description: string) =>
      `is associated with ${indefiniteArticleFor(description)} ${description}.`,
  );
  repaired = repaired.replace(
    /\bis commonly used for ((?!an?\s)[^.\n]+ file)\./gi,
    (_match, description: string) =>
      `is commonly used for ${indefiniteArticleFor(description)} ${description}.`,
  );

  repaired = repaired
    .replace(
      /Therefore, ((?:[IVX]+(?:, | and ))+[IVX]+) only is correct\./g,
      "Therefore, only $1 are correct.",
    )
    .replace(
      /Therefore, ([IVX]+) only is correct\./g,
      "Therefore, only $1 is correct.",
    );

  return repaired;
}

function applyLearnerSurfaceErrataV6(question: Com002ReviewQuestion): Com002ReviewQuestion {
  const options = question.options.map(repairEnglishTextV6);
  let stem = repairEnglishTextV6(question.stem);
  const explanation = repairEnglishTextV6(question.explanation);

  if (question.qlId === "COM-002-QL-003" && question.surfaceMode === "TYPE_TO_PROPERTY") {
    stem = stem
      .replace(
        /^What is a (.+ operating system)\?$/i,
        "Which statement describes a $1?",
      )
      .replace(/a Real-time operating system/i, "a real-time operating system");
  }

  if (question.qlId === "COM-002-QL-005") {
    stem = stem.replace(
      /^How does Command-line interface \(CLI\) work\?$/i,
      "How does a command-line interface (CLI) work?",
    );
  }

  if (question.qlId === "COM-002-QL-007") {
    stem = stem.replace(
      /^Which function best matches Windows taskbar\?$/i,
      "Which function best matches the Windows taskbar?",
    );
  }

  if (question.qlId === "COM-002-QL-008") {
    stem = stem.replace(
      /^Which file-management item matches this description: can display hidden items when the relevant view option is enabled\?$/i,
      "Which file-management item can display hidden items when the relevant view option is enabled?",
    );
  }

  const canonicalAnswer = options[question.correctIndex]!;
  return {
    ...question,
    stem,
    options,
    explanation,
    canonicalAnswer,
  };
}

function assertV5SemanticStatePreserved(
  v5: Com002ReviewQuestion,
  v6: Com002ReviewQuestion,
  input: { qlId: string; seed: string },
) {
  const prefix = `${input.qlId}/${input.seed}`;
  if (v6.qlId !== v5.qlId) throw new Error(`${prefix}: V6 QL drift`);
  if (v6.cpId !== v5.cpId) throw new Error(`${prefix}: V6 CP drift`);
  if (v6.surfaceMode !== v5.surfaceMode) throw new Error(`${prefix}: V6 surface-mode drift`);
  if (v6.targetFactId !== v5.targetFactId) throw new Error(`${prefix}: V6 target-fact drift`);
  if (v6.correctIndex !== v5.correctIndex) throw new Error(`${prefix}: V6 correct-index drift`);
  if (v6.solverAuthority !== v5.solverAuthority) throw new Error(`${prefix}: V6 solver-authority drift`);
  if (JSON.stringify(v6.sourceFactIds) !== JSON.stringify(v5.sourceFactIds)) {
    throw new Error(`${prefix}: V6 source-fact provenance drift`);
  }
  if (JSON.stringify(v6.sourceIds) !== JSON.stringify(v5.sourceIds)) {
    throw new Error(`${prefix}: V6 source-authority drift`);
  }
}

/**
 * Candidate-only errata layer over the frozen V5 English authority.
 *
 * V5 remains immutable. V6 corrects learner-facing editorial defects while
 * preserving the full semantic/provenance state and answer position. This
 * layer is deliberately not a new freeze authority; it must complete its own
 * human-review and fingerprint cycle before any promotion.
 */
export function generateCom002ReviewQuestionV6(input: {
  qlId: string;
  seed: string;
}): Com002ReviewQuestion {
  const v5 = generateCom002ReviewQuestionV5(input);
  const repaired = applyLearnerSurfaceErrataV6(v5);

  assertV5SemanticStatePreserved(v5, repaired, input);
  assertKnowledgeQuestionValid({
    stem: repaired.stem,
    explanation: repaired.explanation,
    options: repaired.options,
    correctIndex: repaired.correctIndex,
    canonicalAnswer: repaired.canonicalAnswer,
  });

  return {
    ...repaired,
    questionId: repaired.questionId.replace(/-V5$/, "-V6"),
  };
}

export function listCom002ReviewV6QlIds() {
  return Array.from(
    { length: 13 },
    (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
  );
}
