export const SEATING_PATTERNS = [
  {
    id: "linear_easy",

    topic: "Seating Arrangement",

    arrangementType: "linear",

    participantCount: 5,

    orientation: "north",

    clueTypes: [
      "left-right",
      "neighbor",
      "direct-position",
    ],

    inferenceDepth: 2,

    difficulty: "Easy",
  },

  {
    id: "linear_medium",

    topic: "Seating Arrangement",

    arrangementType: "linear",

    participantCount: 6,

    orientation: "north",

    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
    ],

    inferenceDepth: 4,

    difficulty: "Medium",
  },
];