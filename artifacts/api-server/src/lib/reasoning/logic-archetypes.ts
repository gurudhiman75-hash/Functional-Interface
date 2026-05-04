import type {
  QuantArchetype,
} from "../core/generator-engine";
import { createReasoningStep } from "../shared";

// Logic-domain archetypes own reasoning structure for non-formula topics.
// They stay data-only so orchestration and topic execution remain in the engine/modules.
export const LOGIC_REASONING_ARCHETYPES: QuantArchetype[] =
  [
    {
      id: "easy-direct-inequalities",
      difficulty: "Easy",
      category:
        "direct-inequalities",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the direct inequality and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Read the direct comparison between the required symbols.",
        ),
      ],
    },
    {
      id: "easy-single-inference-chains",
      difficulty: "Easy",
      category:
        "single-inference-chains",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Answer carefully  : {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Read the linked inequality statements in order.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final relation through one transitive step.",
        ),
      ],
    },
    {
      id: "medium-multi-statement-comparison",
      difficulty: "Medium",
      category:
        "multi-statement-comparison",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "compare",
        "aggregate",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Read each comparison and note the common symbols.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the connected statements into one order chain.",
        ),
        createReasoningStep(
          "infer",
          "Infer the required final comparison.",
        ),
      ],
    },
    {
      id: "medium-compound-inequalities",
      difficulty: "Medium",
      category:
        "compound-inequalities",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "compare",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Separate the compound statement into simpler links.",
        ),
        createReasoningStep(
          "infer",
          "Use the linked comparisons to infer the hidden relation.",
        ),
        createReasoningStep(
          "compare",
          "Verify the final required conclusion.",
        ),
      ],
    },
    {
      id: "hard-conditional-inequality-logic",
      difficulty: "Hard",
      category:
        "conditional-inequality-logic",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "filter",
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "filter",
          "Identify which comparisons can and cannot be linked directly.",
        ),
        createReasoningStep(
          "compare",
          "Trace the available branches of the inequality network.",
        ),
        createReasoningStep(
          "infer",
          "Infer whether the conclusion is definite or uncertain.",
        ),
      ],
    },
    {
      id: "hard-nested-inference-chains",
      difficulty: "Hard",
      category:
        "nested-inference-chains",
      topicClusters: [
        "inequality",
      ],
      operationChain: [
        "aggregate",
        "infer",
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "aggregate",
          "Combine the multi-part symbolic statements into connected groups.",
        ),
        createReasoningStep(
          "infer",
          "Infer the relation inside each connected group.",
        ),
        createReasoningStep(
          "compare",
          "Compare the resulting groups against the asked symbols.",
        ),
        createReasoningStep(
          "infer",
          "State whether the final conclusion definitely follows.",
        ),
      ],
    },
    {
      id: "easy-straight-movement",
      difficulty: "Easy",
      category:
        "straight-movement",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Move along the stated direction and note the final point.",
        ),
      ],
    },
    {
      id: "easy-direct-distance",
      difficulty: "Easy",
      category:
        "direct-distance",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Track the distance directly and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Follow the direct movement sequence.",
        ),
        createReasoningStep(
          "compare",
          "Measure the final distance asked.",
        ),
      ],
    },
    {
      id: "medium-simple-left-right-turns",
      difficulty: "Medium",
      category:
        "simple-left-right-turns",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Move step by step in the stated directions.",
        ),
        createReasoningStep(
          "infer",
          "Update the facing direction after each turn.",
        ),
        createReasoningStep(
          "compare",
          "Read the final direction or position asked.",
        ),
      ],
    },
    {
      id: "medium-multiple-turns",
      difficulty: "Medium",
      category:
        "multiple-turns",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Record the path segment by segment.",
        ),
        createReasoningStep(
          "compare",
          "Compare each turn with the current orientation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final location or facing direction.",
        ),
      ],
    },
    {
      id: "medium-shortest-distance-inference",
      difficulty: "Medium",
      category:
        "shortest-distance-inference",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Use the path to infer the shortest distance: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Translate each movement into coordinate changes.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the horizontal and vertical shifts.",
        ),
        createReasoningStep(
          "infer",
          "Infer the shortest distance from the net displacement.",
        ),
      ],
    },
    {
      id: "hard-orientation-changes",
      difficulty: "Hard",
      category:
        "orientation-changes",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "infer",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Trace each movement in order.",
        ),
        createReasoningStep(
          "infer",
          "Update the hidden facing direction after each turn.",
        ),
        createReasoningStep(
          "transform",
          "Apply the next movements using the updated orientation.",
        ),
        createReasoningStep(
          "compare",
          "Read the final direction or position.",
        ),
      ],
    },
    {
      id: "hard-conditional-movement-reasoning",
      difficulty: "Hard",
      category:
        "conditional-movement-reasoning",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "filter",
        "transform",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "filter",
          "Identify where the conditional turn or movement applies.",
        ),
        createReasoningStep(
          "transform",
          "Track the path with the condition in place.",
        ),
        createReasoningStep(
          "infer",
          "Infer the asked direction or displacement after the full path.",
        ),
      ],
    },
    {
      id: "hard-coordinate-inference-chains",
      difficulty: "Hard",
      category:
        "coordinate-inference-chains",
      topicClusters: [
        "direction-sense",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Convert each movement into directional coordinates.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine all coordinate changes.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final location or shortest distance.",
        ),
        createReasoningStep(
          "compare",
          "Resolve the exact asked output from the final position.",
        ),
      ],
    },
    {
      id: "easy-direct-family-relation",
      difficulty: "Easy",
      category:
        "direct-family-relation",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Read the direct family statement and identify the exact relation.",
        ),
      ],
    },
    {
      id: "easy-single-chain-relation",
      difficulty: "Easy",
      category:
        "single-chain-relation",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Track the immediate relation from the first statement.",
        ),
        createReasoningStep(
          "infer",
          "Infer the asked relation from that single chain.",
        ),
      ],
    },
    {
      id: "medium-generation-gap-reasoning",
      difficulty: "Medium",
      category:
        "generation-gap-reasoning",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "compare",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Track the family generations carefully: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the generation of each named person.",
        ),
        createReasoningStep(
          "infer",
          "Bridge the generation gap through the chain.",
        ),
        createReasoningStep(
          "compare",
          "State the final relation from the completed chain.",
        ),
      ],
    },
    {
      id: "medium-gender-based-inference",
      difficulty: "Medium",
      category:
        "gender-based-inference",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "infer",
        "compare",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "infer",
          "Infer the relevant gender from the statements.",
        ),
        createReasoningStep(
          "compare",
          "Place the person correctly in the family chain.",
        ),
        createReasoningStep(
          "transform",
          "Convert the chain into the exact relation asked.",
        ),
      ],
    },
    {
      id: "hard-conditional-family-inference",
      difficulty: "Hard",
      category:
        "conditional-family-inference",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "filter",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Apply the family condition carefully and solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "filter",
          "Apply the conditional family clue before using the chain.",
        ),
        createReasoningStep(
          "infer",
          "Infer the hidden family position created by the condition.",
        ),
        createReasoningStep(
          "compare",
          "Resolve the exact asked relation.",
        ),
      ],
    },
    {
      id: "hard-circular-relation-chains",
      difficulty: "Hard",
      category:
        "circular-relation-chains",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "compare",
        "transform",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Trace each relation link in order.",
        ),
        createReasoningStep(
          "transform",
          "Reframe the circular chain into a linear family path.",
        ),
        createReasoningStep(
          "infer",
          "Infer the hidden connecting relation.",
        ),
        createReasoningStep(
          "compare",
          "State the final relationship precisely.",
        ),
      ],
    },
    {
      id: "hard-indirect-relation-deduction",
      difficulty: "Hard",
      category:
        "indirect-relation-deduction",
      topicClusters: [
        "blood-relations",
      ],
      operationChain: [
        "infer",
        "aggregate",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "infer",
          "Infer each hidden relation from the statements.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the inferred links into one family chain.",
        ),
        createReasoningStep(
          "compare",
          "Identify the final asked relation.",
        ),
      ],
    },
    {
      id: "easy-direct-alphabet-shift",
      difficulty: "Easy",
      category:
        "direct-alphabet-shift",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Apply the direct alphabet shift to each required letter.",
        ),
      ],
    },
    {
      id: "easy-reverse-alphabet",
      difficulty: "Easy",
      category:
        "reverse-alphabet",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "reverse",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "reverse",
          "Replace each letter with its opposite alphabet partner.",
        ),
      ],
    },
    {
      id: "easy-simple-substitution",
      difficulty: "Easy",
      category:
        "simple-substitution",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Substitute each letter according to the direct coding rule.",
        ),
      ],
    },
    {
      id: "medium-positional-coding",
      difficulty: "Medium",
      category:
        "positional-coding",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Translate each letter into its coded positional form.",
        ),
        createReasoningStep(
          "compare",
          "Match the transformed sequence to the required answer.",
        ),
      ],
    },
    {
      id: "medium-mixed-symbol-letter-coding",
      difficulty: "Medium",
      category:
        "mixed-symbol-letter-coding",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
        "compare",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Apply the symbol rule to the required letters.",
        ),
        createReasoningStep(
          "compare",
          "Separate the vowels and consonants under the coding condition.",
        ),
        createReasoningStep(
          "transform",
          "Reassemble the final coded pattern.",
        ),
      ],
    },
    {
      id: "medium-conditional-letter-mapping",
      difficulty: "Medium",
      category:
        "conditional-letter-mapping",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "filter",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "filter",
          "Identify which letters follow each condition.",
        ),
        createReasoningStep(
          "transform",
          "Apply the relevant coding rule to each group.",
        ),
        createReasoningStep(
          "compare",
          "Check the final coded pattern against the options.",
        ),
      ],
    },
    {
      id: "hard-multi-stage-coding",
      difficulty: "Hard",
      category:
        "multi-stage-coding",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
        "reverse",
        "transform",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Apply the first coding rule to the word.",
        ),
        createReasoningStep(
          "reverse",
          "Reverse or reorder the intermediate code as directed.",
        ),
        createReasoningStep(
          "transform",
          "Apply the second-stage transformation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final code after both stages.",
        ),
      ],
    },
    {
      id: "hard-word-transformation-chains",
      difficulty: "Hard",
      category:
        "word-transformation-chains",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "compare",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Transform each letter using the staged coding rule.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the staged results into one coded sequence.",
        ),
        createReasoningStep(
          "compare",
          "Compare the derived code against the pattern.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final answer from the full transformation chain.",
        ),
      ],
    },
    {
      id: "hard-inference-based-decoding",
      difficulty: "Hard",
      category:
        "inference-based-decoding",
      topicClusters: [
        "coding-decoding",
      ],
      operationChain: [
        "compare",
        "infer",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the statement carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Study the example pair to spot the coding pattern.",
        ),
        createReasoningStep(
          "infer",
          "Infer the hidden decoding rule.",
        ),
        createReasoningStep(
          "transform",
          "Apply that rule to the target word.",
        ),
      ],
    },
    {
      id: "easy-direct-placement",
      difficulty: "Easy",
      category:
        "direct-placement",
      topicClusters: [
        "seating-arrangement",
      ],
      operationChain: [
        "compare",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Read the seating clues and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Mark the limited anchor clue first without fixing the whole row immediately.",
        ),
        createReasoningStep(
          "transform",
          "Combine the remaining relative clues to complete the row before answering.",
        ),
      ],
    },
    {
      id: "medium-neighbor-inference",
      difficulty: "Medium",
      category:
        "neighbor-inference",
      topicClusters: [
        "seating-arrangement",
      ],
      operationChain: [
        "compare",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Track the seating clues carefully and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the strongest anchor clue before linking the neighboring seats.",
        ),
        createReasoningStep(
          "infer",
          "Use left-right and neighbor clues together to narrow the possible row.",
        ),
        createReasoningStep(
          "compare",
          "Read the final required seat from the completed arrangement.",
        ),
      ],
    },
    {
      id: "hard-chained-deduction",
      difficulty: "Hard",
      category:
        "chained-deduction",
      topicClusters: [
        "seating-arrangement",
      ],
      operationChain: [
        "compare",
        "infer",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Infer the full seating row and answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Start from the most restrictive indirect seating clues.",
        ),
        createReasoningStep(
          "infer",
          "Link the relative positions into one consistent row.",
        ),
        createReasoningStep(
          "transform",
          "Translate the partial placements into exact seat positions.",
        ),
        createReasoningStep(
          "compare",
          "Use the completed row to resolve the asked seat.",
        ),
      ],
    },
  ];
