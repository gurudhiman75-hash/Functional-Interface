export const variables = {
  knownRate: { min: 12.5, max: 12.5 },
  targetRate: { min: 37.5, max: 37.5 },
  unitValue: { choices: [2.5, 6.5, 12.5] },
  difficulty: "Hard",
  context: "workers",
} as const;
