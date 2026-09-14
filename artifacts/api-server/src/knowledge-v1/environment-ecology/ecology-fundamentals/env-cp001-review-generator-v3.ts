import type { EnvCp001ReviewQuestion } from "./env-cp001-review-types";
import { generateEnvCp001ReviewBatchV2 } from "./env-cp001-review-generator-v2";

const levelComparisonOverlays = [
  {
    stem: "Which statement correctly distinguishes an organism from a population?",
    correct: "An organism is one individual; a population is members of the same species living in one area.",
    distractors: [
      "A population is one individual; an organism is members of the same species living in one area.",
      "Both organism and population mean populations of different species living together.",
      "Both organism and population must include the physical environment.",
    ],
    explanation: "An organism is one individual living entity. A population consists of members of the same species living in a particular area.",
  },
  {
    stem: "Which statement correctly distinguishes a population from a community?",
    correct: "A population contains members of one species; a community contains populations of different species.",
    distractors: [
      "A population contains different species; a community contains only one species.",
      "Both population and community contain only one species.",
      "Both population and community must include soil, water and other abiotic factors.",
    ],
    explanation: "Population requires members of the same species. A community contains populations of different species living and interacting in the same area.",
  },
  {
    stem: "Which statement correctly distinguishes a community from an ecosystem?",
    correct: "A community is the living populations; an ecosystem includes the community and its physical environment.",
    distractors: [
      "A community includes the physical environment, while an ecosystem includes only living populations.",
      "Both community and ecosystem refer only to members of one species.",
      "A community is the global zone of life, while an ecosystem is one individual organism.",
    ],
    explanation: "A community consists of living populations of different species. An ecosystem includes that community interacting with the physical environment.",
  },
  {
    stem: "Which statement correctly distinguishes a biome from the biosphere?",
    correct: "A biome is a large ecological region; the biosphere is the global zone containing all ecosystems.",
    distractors: [
      "A biome contains all ecosystems on Earth, while the biosphere is one regional ecosystem type.",
      "Both biome and biosphere mean the place where a single organism lives.",
      "A biome is a population of one species, while the biosphere is a community of different species.",
    ],
    explanation: "A biome is a large ecological region characterised mainly by climate and vegetation. The biosphere is the broadest level and includes all ecosystems on Earth.",
  },
] as const;

function placeCorrect(
  correct: string,
  distractors: readonly string[],
  correctIndex: number,
) {
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error("ENV-CP-001 V3 level-comparison overlay requires four unique options");
  }
  return options;
}

export function generateEnvCp001ReviewBatchV3(): EnvCp001ReviewQuestion[] {
  const questions = generateEnvCp001ReviewBatchV2();
  let levelIndex = 0;

  return questions.map((question, globalIndex) => {
    const nextId = `ENV-CP001-V3-${String(globalIndex + 1).padStart(3, "0")}`;
    if (question.qlId !== "ENV-001-QL-006") {
      return { ...question, questionId: nextId };
    }

    const overlay = levelComparisonOverlays[levelIndex];
    levelIndex += 1;
    return {
      ...question,
      questionId: nextId,
      stem: overlay.stem,
      options: placeCorrect(overlay.correct, overlay.distractors, question.correctIndex),
      canonicalAnswer: overlay.correct,
      explanation: overlay.explanation,
    };
  });
}
