import { ECO_CP022_REVIEW_V1 } from "./eco-cp022-review-generator-v1";
import type { EcoCp022ReviewQuestion } from "./eco-cp022-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "ECO-CP-022-Q03": "Who introduced the human-development approach through UNDP?",
  "ECO-CP-022-Q04": "Which idea represents the human-development approach?",
  "ECO-CP-022-Q17": "What does economic growth refer to?",
  "ECO-CP-022-Q27": "What does a lower Gini index indicate?",
  "ECO-CP-022-Q32": "A person's income rises, but it remains far below the typical income in the same society. Which concept applies?",
  "ECO-CP-022-Q35": "How does MPI differ from an income-only poverty measure?",
  "ECO-CP-022-Q38": "Which policy is consistent with the capability approach to development?",
  "ECO-CP-022-Q40": "Consider the statements. I. A lower Gini index indicates greater equality. II. A Lorenz curve shows cumulative income distribution. Which option is correct?",
  "ECO-CP-022-Q42": "Which indicator measures income inequality?",
});

export const ECO_CP022_REVIEW_V2: EcoCp022ReviewQuestion[] = ECO_CP022_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
