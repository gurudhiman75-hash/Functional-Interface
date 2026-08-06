const originalLog = console.log.bind(console);

function normalizeLearnerWording(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value
    .replace(/move the first 1 letters?/gi, "move the first letter")
    .replace(/first 1 letters?/gi, "first letter");
}

console.log = (...values: readonly unknown[]): void => {
  originalLog(...values.map(normalizeLearnerWording));
};

await import("./export-adaptive-review-v6-400-questions");
