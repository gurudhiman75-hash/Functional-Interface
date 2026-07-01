export const variables = {
  knownRate: { min: 25, max: 25 },
  targetRate: { min: 40, max: 40 },
  unitValue: { choices: [4, 8, 16] },
  difficulty: "Easy",
  context: "profit",
} as const;
