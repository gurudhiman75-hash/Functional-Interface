import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV71,
  type SerCp007AdaptiveReviewV71,
} from "./adaptive-review-v7-1";
import {
  assertSerCp007ReleasePoolUniquenessV7,
  excludeRecentSerCp007ReleasePoolsV7,
  selectSerCp007PrimaryReleaseV7,
} from "./student-release-selection-v7";

export interface SerCp007ReleaseEntryV71 {
  readonly question: SerCp007EditorialQuestion;
  readonly review: SerCp007AdaptiveReviewV71;
}

export interface SerCp007PrimarySelectionV71<
  T extends SerCp007ReleaseEntryV71 = SerCp007ReleaseEntryV71,
> {
  readonly primary: readonly T[];
  readonly standardPrimary: readonly T[];
  readonly advancedPrimary: readonly T[];
  readonly primaryIds: ReadonlySet<string>;
  readonly taskCounts: Readonly<Record<string, number>>;
  readonly standardAnswerPositionCounts: readonly [number, number, number, number];
  readonly advancedAnswerPositionCounts: readonly [number, number, number, number];
}

function identity(entry: { readonly question: SerCp007EditorialQuestion }): string {
  return `${entry.question.temporaryTemplateId}:${entry.question.seed}`;
}

function moveCorrectOption(
  question: SerCp007EditorialQuestion,
  targetIndex: number,
): SerCp007EditorialQuestion {
  if (question.options.length !== 4) {
    throw new Error(
      `V7.1 answer balancing requires four options for ${question.temporaryTemplateId}:${question.seed}.`,
    );
  }
  const answer = question.options[question.correctIndex];
  if (answer !== question.correctAnswer) {
    throw new Error(
      `V7.1 answer balancing found an answer mismatch for ${question.temporaryTemplateId}:${question.seed}.`,
    );
  }
  const distractors = question.options.filter(
    (_, index) => index !== question.correctIndex,
  );
  const options = [...distractors];
  options.splice(targetIndex, 0, question.correctAnswer);
  return {
    ...question,
    options,
    correctIndex: targetIndex,
  };
}

function rebalanceEntries<T extends SerCp007ReleaseEntryV71>(
  entries: readonly T[],
): readonly T[] {
  return [...entries]
    .sort((left, right) =>
      [left.review.studentReleasePoolKey, identity(left)]
        .join("|")
        .localeCompare(
          [right.review.studentReleasePoolKey, identity(right)].join("|"),
        ),
    )
    .map((entry, index) => {
      const targetIndex = index % 4;
      const question = moveCorrectOption(entry.question, targetIndex);
      const review = buildAdaptiveSerCp007ReviewV71(question);
      return { ...entry, question, review } as T;
    });
}

function answerPositionCounts(
  entries: readonly SerCp007ReleaseEntryV71[],
): [number, number, number, number] {
  const counts: [number, number, number, number] = [0, 0, 0, 0];
  for (const entry of entries) {
    counts[entry.question.correctIndex] += 1;
  }
  return counts;
}

function taskCounts(
  entries: readonly SerCp007ReleaseEntryV71[],
): Readonly<Record<string, number>> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const task = entry.review.editorialTaskKind;
    counts.set(task, (counts.get(task) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort());
}

export function selectSerCp007PrimaryReleaseV71<
  T extends SerCp007ReleaseEntryV71,
>(entries: readonly T[]): SerCp007PrimarySelectionV71<T> {
  const eligible = entries.filter(
    (entry) => entry.review.releaseTier !== "INTERNAL_REVIEW_ONLY",
  );
  const base = selectSerCp007PrimaryReleaseV7(
    eligible as unknown as Parameters<typeof selectSerCp007PrimaryReleaseV7>[0],
  );
  const standardIdentity = new Set(base.standardPrimary.map(identity));
  const advancedIdentity = new Set(base.advancedPrimary.map(identity));
  const standard = rebalanceEntries(
    eligible.filter((entry) => standardIdentity.has(identity(entry))),
  );
  const advanced = rebalanceEntries(
    eligible.filter((entry) => advancedIdentity.has(identity(entry))),
  );
  const primary = [...standard, ...advanced];
  assertSerCp007ReleasePoolUniquenessV7(
    primary as unknown as Parameters<typeof assertSerCp007ReleasePoolUniquenessV7>[0],
  );

  const standardCounts = answerPositionCounts(standard);
  const advancedCounts = answerPositionCounts(advanced);
  if (standard.length === 96 && standardCounts.some((count) => count !== 24)) {
    throw new Error(
      `V7.1 standard PRIMARY answer positions are not 24/24/24/24: ${standardCounts.join("/")}`,
    );
  }
  if (
    advanced.length === 39 &&
    Math.max(...advancedCounts) - Math.min(...advancedCounts) > 1
  ) {
    throw new Error(
      `V7.1 advanced PRIMARY answer-position spread exceeds one: ${advancedCounts.join("/")}`,
    );
  }

  return {
    primary,
    standardPrimary: standard,
    advancedPrimary: advanced,
    primaryIds: new Set(primary.map(identity)),
    taskCounts: taskCounts(standard),
    standardAnswerPositionCounts: standardCounts,
    advancedAnswerPositionCounts: advancedCounts,
  };
}

export function excludeRecentSerCp007ReleasePoolsV71<
  T extends SerCp007ReleaseEntryV71,
>(entries: readonly T[], blockedPoolKeys: ReadonlySet<string>): readonly T[] {
  return excludeRecentSerCp007ReleasePoolsV7(
    entries as unknown as Parameters<typeof excludeRecentSerCp007ReleasePoolsV7>[0],
    blockedPoolKeys,
  ) as unknown as readonly T[];
}
