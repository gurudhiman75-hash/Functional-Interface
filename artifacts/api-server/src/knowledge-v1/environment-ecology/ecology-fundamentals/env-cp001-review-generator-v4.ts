import type { EnvCp001ReviewQuestion } from "./env-cp001-review-types";
import { generateEnvCp001ReviewBatchV3 } from "./env-cp001-review-generator-v3";

const SIMPLE_STEMS: Record<string, readonly string[]> = {
  "ENV-001-QL-001": [
    "Members of the same species living in one area form a:",
    "Populations of different species living together form a:",
    "A community interacting with its physical environment forms an:",
    "The global zone of life is called the:",
  ],
  "ENV-001-QL-002": [
    "Ecology is the study of:",
    "What is a habitat?",
    "What is an ecological niche?",
    "What is a biome?",
  ],
  "ENV-001-QL-003": [
    "A single tiger in a forest represents a:",
    "All chital deer in one grassland form a:",
    "Trees, birds, insects and mammals living together in a forest form a:",
    "Plants, animals, soil and water interacting in a pond form an:",
  ],
  "ENV-001-QL-004": [
    "The forest where a tiger lives is its:",
    "A bee's role as a pollinator is part of its:",
    "The pond where a freshwater fish lives is its:",
    "A vulture's feeding role in an ecosystem is part of its:",
  ],
  "ENV-001-QL-005": [
    "Which is the correct order from lower to higher ecological level?",
    "Which is the correct order from lower to higher ecological level?",
    "Which is the correct order from lower to higher ecological level?",
    "Which is the correct order from lower to higher ecological level?",
  ],
  "ENV-001-QL-006": [
    "Which statement correctly compares an organism and a population?",
    "Which statement correctly compares a population and a community?",
    "Which statement correctly compares a community and an ecosystem?",
    "Which statement correctly compares a biome and the biosphere?",
  ],
  "ENV-001-QL-007": [
    "The transition zone between two ecological communities is called:",
    "The boundary zone between a forest and grassland is an:",
    "Greater diversity near the boundary of two habitats is called:",
    "A change in community composition at a habitat boundary is called:",
  ],
  "ENV-001-QL-008": [
    "Which pair is correctly matched?",
    "Which pair is correctly matched?",
    "Which pair is correctly matched?",
    "Which pair is correctly matched?",
  ],
  "ENV-001-QL-009": [
    "Which pair is incorrectly matched?",
    "Which pair is incorrectly matched?",
    "Which pair is incorrectly matched?",
    "Which pair is incorrectly matched?",
  ],
  "ENV-001-QL-010": [
    "Consider the following statements:\nI. A population contains members of the same species living in one area.\nII. A community contains populations of different species.\nWhich is correct?",
    "Consider the following statements:\nI. A community contains populations of different species.\nII. An ecosystem excludes non-living factors.\nWhich is correct?",
    "Consider the following statements:\nI. Habitat means an organism's functional role.\nII. Niche includes an organism's role and resource use.\nWhich is correct?",
    "Consider the following statements:\nI. An ecotone is the ecological change seen at a boundary.\nII. Edge effect is the boundary zone itself.\nWhich is correct?",
  ],
  "ENV-001-QL-011": [
    "Consider the following statements:\n1. An organism is one living individual.\n2. A population contains different species.\n3. A community contains populations of different species.\nHow many are correct?",
    "Consider the following statements:\n1. A community contains different species.\n2. An ecosystem includes the physical environment.\n3. A biome is the global zone of life.\nHow many are correct?",
    "Consider the following statements:\n1. Habitat is where an organism lives.\n2. Niche describes its role and resource use.\n3. An ecotone is a transition zone between communities.\nHow many are correct?",
    "Consider the following statements:\n1. A biome is a large ecological region.\n2. The biosphere includes all ecosystems on Earth.\n3. Edge effect is an ecological change at a boundary.\nHow many are correct?",
  ],
  "ENV-001-QL-012": [
    "Which statement correctly compares a population and a community?",
    "Which statement correctly compares a community and an ecosystem?",
    "Which statement correctly compares habitat and niche?",
    "Which statement correctly compares an ecotone and edge effect?",
  ],
};

const SIMPLE_EXPLANATIONS: Record<string, readonly string[]> = {
  "ENV-001-QL-001": [
    "A population is made up of members of the same species living in one area.",
    "A community contains populations of different species living together.",
    "An ecosystem includes living organisms and the physical environment.",
    "The biosphere includes all ecosystems on Earth.",
  ],
  "ENV-001-QL-002": [
    "Ecology studies organisms and their relationship with the environment.",
    "A habitat is the place where an organism lives.",
    "A niche is an organism's role, resource use and interactions.",
    "A biome is a large region mainly defined by climate and vegetation.",
  ],
  "ENV-001-QL-003": [
    "One tiger is one organism.",
    "Members of the same species living in one area form a population.",
    "Different species living together form a community.",
    "An ecosystem includes living organisms and non-living surroundings.",
  ],
  "ENV-001-QL-004": [
    "Habitat is where an organism lives. Niche is its role there.",
    "A pollinator's role is part of its ecological niche.",
    "The place where an organism lives is its habitat.",
    "Feeding role and interactions are part of an organism's niche.",
  ],
  "ENV-001-QL-005": [
    "Ecological levels move from smaller units to broader ones in this order.",
    "Ecological levels move from smaller units to broader ones in this order.",
    "Ecological levels move from smaller units to broader ones in this order.",
    "Ecological levels move from smaller units to broader ones in this order.",
  ],
  "ENV-001-QL-006": [
    "An organism is one individual. A population is a group of the same species in one area.",
    "A population has one species. A community has populations of different species.",
    "A community includes living populations. An ecosystem also includes the physical environment.",
    "A biome is a large region. The biosphere includes all ecosystems on Earth.",
  ],
  "ENV-001-QL-007": [
    "An ecotone is the transition zone between two communities.",
    "The boundary zone itself is called an ecotone.",
    "The ecological change seen near a boundary is called edge effect.",
    "A boundary-related change in a community is called edge effect.",
  ],
  "ENV-001-QL-008": [
    "Species means an interbreeding group that can produce fertile offspring.",
    "A population is members of the same species living in one area.",
    "An ecosystem is a community interacting with its physical environment.",
    "A biome is a large region mainly defined by climate and vegetation.",
  ],
  "ENV-001-QL-009": [
    "Habitat is where an organism lives; its role is its niche.",
    "Niche is an organism's role; the transition zone is an ecotone.",
    "An ecotone is the boundary zone; edge effect is the change seen there.",
    "Edge effect is a boundary-related ecological change; habitat is the living place.",
  ],
  "ENV-001-QL-010": [
    "Both are correct: population means one species; community includes different species.",
    "Only I is correct. An ecosystem includes both living and non-living components.",
    "Only II is correct. Habitat is the living place; niche is the organism's role.",
    "Neither is correct. Ecotone is the boundary zone; edge effect is the change seen there.",
  ],
  "ENV-001-QL-011": [
    "Statements 1 and 3 are correct. A population contains members of the same species.",
    "Statements 1 and 2 are correct. The biosphere, not a biome, is the global zone of life.",
    "All three statements are correct.",
    "All three statements are correct.",
  ],
  "ENV-001-QL-012": [
    "A population has one species; a community has populations of different species.",
    "A community has living populations; an ecosystem also includes the physical environment.",
    "Habitat is where an organism lives; niche is its role and resource use.",
    "Ecotone is the boundary zone; edge effect is the ecological change seen there.",
  ],
};

export function generateEnvCp001ReviewBatchV4(): EnvCp001ReviewQuestion[] {
  const questions = generateEnvCp001ReviewBatchV3();
  const counters = new Map<string, number>();

  return questions.map((question, index) => {
    const localIndex = counters.get(question.qlId) ?? 0;
    counters.set(question.qlId, localIndex + 1);

    const stem = SIMPLE_STEMS[question.qlId]?.[localIndex] ?? question.stem;
    const explanation = SIMPLE_EXPLANATIONS[question.qlId]?.[localIndex] ?? question.explanation;

    if (question.qlId === "ENV-001-QL-011" && localIndex === 2) {
      const options = [...question.options];
      const correct = "All three";
      const sourceIndex = options.indexOf(correct);
      if (sourceIndex < 0) throw new Error("ENV-CP-001 V4 Q43 requires the All three option");
      [options[sourceIndex], options[question.correctIndex]] = [options[question.correctIndex], options[sourceIndex]];

      return {
        ...question,
        questionId: `ENV-CP001-V4-${String(index + 1).padStart(3, "0")}`,
        stem,
        options,
        canonicalAnswer: correct,
        explanation,
      };
    }

    return {
      ...question,
      questionId: `ENV-CP001-V4-${String(index + 1).padStart(3, "0")}`,
      stem,
      explanation,
    };
  });
}
