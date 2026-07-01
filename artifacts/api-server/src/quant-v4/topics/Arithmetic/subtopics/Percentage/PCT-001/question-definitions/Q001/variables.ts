export const variables = {
  knownRate: { min: 20, max: 20 },
  targetRate: { min: 25, max: 25 },
  unitValue: { choices: [5, 10, 20] },
  difficulty: "Easy",
  context: "salary",
} as const;
