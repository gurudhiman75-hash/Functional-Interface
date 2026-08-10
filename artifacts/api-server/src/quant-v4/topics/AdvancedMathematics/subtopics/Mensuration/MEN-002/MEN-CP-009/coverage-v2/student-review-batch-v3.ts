import { MEN_CP_009_FROZEN_QLS_V2 } from "./registry";
import {
  generateMenCp009QuestionV2,
  type MenCp009QuestionV2,
} from "./runtime";
import { buildMenCp009StudentView } from "./student-view-v3";

export interface MenCp009V3StudentReviewBatch {
  rows: MenCp009QuestionV2[];
  answerPositions: Record<"A" | "B" | "C" | "D", number>;
  uniqueLearnerStems: number;
  uniqueLearnerPackages: number;
  semanticReviewCountByQl: Record<string, number>;
}

export function buildMenCp009V3StudentReviewBatch(): MenCp009V3StudentReviewBatch {
  const rows: MenCp009QuestionV2[] = [];
  const globalStems = new Set<string>();
  const globalPackages = new Set<string>();
  const semanticReviewCountByQl: Record<string, number> = {};

  for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
    // QL-119 has exactly two real prompts in the frozen family: volume ratio
    // and surface-area ratio. The old four-record review only appeared unique
    // because of generic suffixes and option-position changes.
    const targetCount = definition.qlId === "MEN-002-QL-119" ? 2 : 4;
    const selected: MenCp009QuestionV2[] = [];
    const selectedPositions = new Set<number>();

    for (let candidate = 1; candidate <= 5000 && selected.length < targetCount; candidate += 1) {
      const question = generateMenCp009QuestionV2(
        definition.qlId,
        `learner-review-${definition.qlId}-${candidate}`,
      );
      const view = buildMenCp009StudentView(question);
      const packageKey = `${view.stem}|${view.options
        .map((option) => option.display)
        .join("|")}`;

      if (
        (targetCount === 4 && selectedPositions.has(question.correctIndex)) ||
        globalStems.has(view.stem) ||
        globalPackages.has(packageKey)
      ) {
        continue;
      }

      selected.push(question);
      selectedPositions.add(question.correctIndex);
      globalStems.add(view.stem);
      globalPackages.add(packageKey);
    }

    if (selected.length !== targetCount) {
      throw new Error(
        `Could not build ${targetCount} distinct learner-facing MEN-CP-009 review questions for ${definition.qlId}.`,
      );
    }

    if (targetCount === 4) {
      selected.sort((left, right) => left.correctIndex - right.correctIndex);
    }

    semanticReviewCountByQl[definition.qlId] = selected.length;
    rows.push(...selected);
  }

  const answerPositions = rows.reduce(
    (counts, question) => {
      const label = question.options[question.correctIndex]!.label;
      counts[label] += 1;
      return counts;
    },
    { A: 0, B: 0, C: 0, D: 0 },
  );

  return {
    rows,
    answerPositions,
    uniqueLearnerStems: globalStems.size,
    uniqueLearnerPackages: globalPackages.size,
    semanticReviewCountByQl,
  };
}
