import { ECO_CP017_REVIEW_V1 } from "./eco-cp017-review-generator-v1";
import type { EcoCp017ReviewQuestion } from "./eco-cp017-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "ECO-CP-017-Q004": "Which change would strengthen agriculture's link with the rest of the economy?",
  "ECO-CP-017-Q006": "What was the purpose of land-ceiling laws?",
  "ECO-CP-017-Q012": "Which was an early limitation of the Green Revolution?",
  "ECO-CP-017-Q013": "Which crop season is linked with the monsoon?",
  "ECO-CP-017-Q014": "Which crop season is associated with winter cultivation?",
  "ECO-CP-017-Q015": "When does the Zaid season occur?",
  "ECO-CP-017-Q018": "What is the purpose of Minimum Support Price?",
  "ECO-CP-017-Q023": "What is the purpose of the Public Distribution System?",
  "ECO-CP-017-Q024": "Which sequence shows the public food-management chain correctly?",
  "ECO-CP-017-Q031": "Which risk-management tool is used for crop-loss protection?",
  "ECO-CP-017-Q038": "Which combination can improve agricultural productivity?",
  "ECO-CP-017-Q041": "Which strategy reduces dependence on income from a single crop?",
  "ECO-CP-017-Q043": "Consider the statements. I. FCI is linked with foodgrain procurement and storage. II. e-NAM is a crop-insurance scheme. Which option is correct?",
  "ECO-CP-017-Q044": "Which combination correctly matches each policy tool with the risk it addresses?",
});

export const ECO_CP017_REVIEW_V2: EcoCp017ReviewQuestion[] = ECO_CP017_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
