/** Shared palette for student analytics; answer status UI keeps its own colours. */
export const chartColours = {
  score: "#6366f1",
  accuracy: "#ea8a23",
  attemptRate: "#3b82f6",
  correct: "#2563eb",
  incorrect: "#f07856",
  skipped: "#f2c94c",
} as const;

/** Categorical colours for activity bars; colour does not imply a performance rating. */
export const activityChartColours = ["#3b82f6", "#f2c94c", "#9b6de3", "#f07856", "#60a5fa", "#ea8a23", "#6366f1"] as const;
