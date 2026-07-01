export const variables = {
  knownRate: { min: 15, max: 15 },
  targetRate: { min: 60, max: 60 },
  unitValue: { choices: [25, 40, 80] },
  difficulty: "Easy",
  context: "marks",
} as const;
