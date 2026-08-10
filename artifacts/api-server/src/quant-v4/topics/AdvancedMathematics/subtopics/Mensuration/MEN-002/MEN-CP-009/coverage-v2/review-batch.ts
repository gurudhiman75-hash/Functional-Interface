import { MEN_CP_009_FROZEN_QLS_V2 } from "./registry";
import {
  generateMenCp009QuestionV2,
  type MenCp009QuestionV2,
} from "./runtime";

export interface MenCp009V2ReviewBatch {
  rows: MenCp009QuestionV2[];
  answerPositions: Record<"A" | "B" | "C" | "D", number>;
  uniqueStems: number;
  uniqueStemOptionPackages: number;
}

export function buildMenCp009V2ReviewBatch(): MenCp009V2ReviewBatch {
  const rows: MenCp009QuestionV2[] = [];

  for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
    const selected = new Map<number, MenCp009QuestionV2>();
    const stems = new Set<string>();
    const packages = new Set<string>();

    for (let candidate = 1; candidate <= 500 && selected.size < 4; candidate += 1) {
      const question = generateMenCp009QuestionV2(
        definition.qlId,
        `balanced-review-${candidate}`,
      );
      const packageKey = `${question.stem}|${question.options
        .map((option) => option.display)
        .join("|")}`;
      if (
        selected.has(question.correctIndex) ||
        stems.has(question.stem) ||
        packages.has(packageKey)
      ) {
        continue;
      }
      selected.set(question.correctIndex, question);
      stems.add(question.stem);
      packages.add(packageKey);
    }

    if (selected.size !== 4) {
      throw new Error(
        `Could not build balanced MEN-CP-009 V2 review set for ${definition.qlId}.`,
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
    uniqueStems: new Set(rows.map((question) => question.stem)).size,
    uniqueStemOptionPackages: new Set(
      rows.map(
        (question) =>
          `${question.stem}|${question.options
            .map((option) => option.display)
            .join("|")}`,
      ),
    ).size,
  };
}
