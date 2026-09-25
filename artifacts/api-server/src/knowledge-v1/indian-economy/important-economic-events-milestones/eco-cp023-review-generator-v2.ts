import { ECO_CP023_REVIEW_V1 } from "./eco-cp023-review-generator-v1";
import type { EcoCp023ReviewQuestion } from "./eco-cp023-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "ECO-CP-023-Q14": "NABARD was established for which sector?",
  "ECO-CP-023-Q20": "Which sequence shows India's early-1990s reform path correctly?",
});

export const ECO_CP023_REVIEW_V2: EcoCp023ReviewQuestion[] = ECO_CP023_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
