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
}

export function buildMenCp009V3StudentReviewBatch(): MenCp009V3StudentReviewBatch {
  const rows: MenCp009QuestionV2[] = [];
  const globalStems = new Set<string>();
  const globalPackages = new Set<string>();

  for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
    const selected = new Map<number, MenCp009QuestionV2>();

    for (let candidate = 1; candidate <= 5000 && selected.size < 4; candidate += 1) {
      const question = generateMenCp009QuestionV2(
        definition.qlId,
        `learner-review-${definition.qlId}-${candidate}`,
      );
      const view = buildMenCp009StudentView(question);
      const packageKey = `${view.stem}|${view.options
        .map((option) => option.display)
        .join("|")}`;

      if (
        selected.has(question.correctIndex) ||
        globalStems.has(view.stem) ||
        globalPackages.has(packageKey)
      ) {
        continue;
      }

      selected.set(question.correctIndex, question);
      globalStems.add(view.stem);
      globalPackages.add(packageKey);
    }

    if (selected.size !== 4) {
      throw new Error(
        `Could not build four distinct learner-facing MEN-CP-009 review questions for ${definition.qlId}.`,
      );
    }

    rows.push(...[0, 1, 2, 3].map((index) => selected.get(index)!));
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
  };
}
