import { ECO_CP018_REVIEW_V1 } from "./eco-cp018-review-generator-v1";
import type { EcoCp018ReviewQuestion } from "./eco-cp018-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "ECO-CP-018-Q004": "How does manufacturing differ from trade?",
  "ECO-CP-018-Q007": "Which statement reflects India's mixed-economy industrial model?",
  "ECO-CP-018-Q016": "Which statement about MSME classification is correct?",
  "ECO-CP-018-Q025": "What is the purpose of an industrial corridor?",
  "ECO-CP-018-Q027": "How does an industrial corridor differ from a single industrial estate?",
  "ECO-CP-018-Q033": "How does Make in India differ from the 1991 delicensing reform?",
  "ECO-CP-018-Q044": "Which statement describes the broad shift in India's industrial policy over time?",
});

export const ECO_CP018_REVIEW_V2: EcoCp018ReviewQuestion[] = ECO_CP018_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
