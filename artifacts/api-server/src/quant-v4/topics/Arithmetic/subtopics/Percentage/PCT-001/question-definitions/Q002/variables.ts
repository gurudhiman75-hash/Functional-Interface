export const variables = {
  knownRate: { min: 40, max: 40 },
  targetRate: { min: 25, max: 25 },
  unitValue: { choices: [6, 12, 24] },
  difficulty: "Easy",
  context: "books",
} as const;
