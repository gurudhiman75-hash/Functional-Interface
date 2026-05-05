export const SEATING_PATTERNS = [
  {
    id: "seating-linear-easy",
    type: "logic",
    generationDomain:
      "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Linear Seating",
    difficulty: "Easy",
    supportedQuestionTypes: [
      "logic",
    ],
    templateVariants: [
      "Read the seating arrangement carefully.",
    ],
    variables: {},
    arrangementType: "linear",
    orientationTypes: [
      "north",
      "south",
    ],
    participantCount: 5,
    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
      "direct-position",
    ],
    inferenceDepth: 2,
  },
  {
    id: "seating-linear-medium",
    type: "logic",
    generationDomain:
      "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Linear Seating",
    difficulty: "Medium",
    supportedQuestionTypes: [
      "logic",
    ],
    templateVariants: [
      "Solve the seating arrangement carefully.",
    ],
    variables: {},
    arrangementType: "linear",
    orientationTypes: [
      "north",
      "south",
      "alternate",
    ],
    participantCount: 6,
    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
      "not-adjacent",
      "between",
    ],
    inferenceDepth: 4,
  },
  {
    id: "seating-circular-medium",
    type: "logic",
    generationDomain:
      "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Circular Seating",
    difficulty: "Medium",
    supportedQuestionTypes: [
      "logic",
    ],
    templateVariants: [
      "Read the circular seating clues carefully.",
    ],
    variables: {},
    arrangementTypes: [
      "circular",
      "square",
      "rectangular",
    ],
    orientationTypes: [
      "center",
      "outward",
    ],
    participantCount: 6,
    clueTypes: [
      "neighbor",
      "left-right",
      "distance",
      "opposite",
      "not-opposite",
    ],
    inferenceDepth: 5,
  },
  {
    id: "seating-hard-mixed",
    type: "logic",
    generationDomain:
      "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic:
      "Mixed and Double Row Seating",
    difficulty: "Hard",
    supportedQuestionTypes: [
      "logic",
    ],
    templateVariants: [
      "Use the seating clues to infer the complete arrangement.",
    ],
    variables: {},
    arrangementTypes: [
      "circular",
      "double-row",
      "parallel-row",
    ],
    orientationTypes: [
      "alternate",
      "mixed",
      "center",
      "north",
    ],
    participantCount: 6,
    clueTypes: [
      "neighbor",
      "left-right",
      "distance",
      "between",
      "adjacent-both",
      "not-adjacent",
      "opposite",
      "facing",
    ],
    inferenceDepth: 6,
  },
];
