import { deterministicShuffle } from "../../deterministic";
import {
  POL_CP005_CLASSIFICATION_ROWS_V1,
  POL_CP005_ORIGIN_ROWS_V1,
} from "./pol-cp005-exam-context";
import { generatePolCp005ReviewBatchV2 } from "./pol-cp005-review-generator-v2";
import type { PolCp005ReviewQuestion } from "./pol-cp005-review-types";

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

export function generatePolCp005ReviewBatchV3(): PolCp005ReviewQuestion[] {
  const output = [...generatePolCp005ReviewBatchV2()];

  const add = (
    ql: 21 | 22,
    qlName: string,
    stem: string,
    correct: string,
    optionsInput: string[],
    explanation: string,
    sourceIds: readonly string[],
    sourceFactIds: readonly string[],
    seed: string,
  ) => {
    const globalIndex = output.length;
    const target = globalIndex % 4;
    const options = moveCorrect(deterministicShuffle([...optionsInput], seed), correct, target);
    output.push({
      questionId: `POL-CP005-V3-${String(globalIndex + 1).padStart(3, "0")}`,
      chapterId: "POL-001",
      cpId: "POL-CP-005",
      qlId: `POL-005-QL-${String(ql).padStart(3, "0")}`,
      qlName,
      difficulty: "Medium",
      stem,
      options,
      correctIndex: target,
      canonicalAnswer: correct,
      explanation,
      sourceIds: [...sourceIds],
      sourceFactIds: [...sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    });
  };

  const classificationOptions = [
    "Social and economic principles",
    "Gandhian principles",
    "International peace and security",
    "Fundamental Rights",
  ];
  POL_CP005_CLASSIFICATION_ROWS_V1.forEach((row) => {
    add(
      21,
      "Conventional classification of Directive Principles",
      row.prompt,
      row.answer,
      classificationOptions,
      row.explanation,
      row.sourceIds,
      row.sourceFactIds,
      `POL-005-QL-021:${row.id}`,
    );
  });

  const originOptions: Record<string, string[]> = {
    "dpsp-irish-source": ["Ireland", "United States", "Canada", "Australia"],
    "duties-ussr-source": ["USSR", "United States", "Ireland", "France"],
    "swaran-singh": ["Swaran Singh", "Sarkaria", "Punchhi", "Balwant Rai Mehta"],
  };
  POL_CP005_ORIGIN_ROWS_V1.forEach((row) => {
    add(
      22,
      "Sources and committee behind DPSP and Fundamental Duties",
      row.prompt,
      row.answer,
      originOptions[row.id],
      row.explanation,
      row.sourceIds,
      row.sourceFactIds,
      `POL-005-QL-022:${row.id}`,
    );
  });

  return output;
}
