import { ECO_CP021_REVIEW_V2 } from "./eco-cp021-review-generator-v2";
import type { EcoCp021ReviewQuestion } from "./eco-cp021-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "ECO-CP-021-Q01": "Which two institutions were conceived at the Bretton Woods Conference in 1944?",
  "ECO-CP-021-Q10": "Which institution lends to middle-income and creditworthy lower-income countries?",
  "ECO-CP-021-Q12": "Which institution provides long-term development finance to middle-income and creditworthy countries?",
  "ECO-CP-021-Q16": "Which World Bank institution supports low-income countries with limited creditworthiness?",
  "ECO-CP-021-Q22": "Which region is the focus of the Asian Development Bank?",
  "ECO-CP-021-Q27": "Which description matches AIIB?",
  "ECO-CP-021-Q37": "Which institution finances infrastructure in Asia and beyond?",
  "ECO-CP-021-Q41": "Consider the statements. I. AIIB focuses on infrastructure. II. WTO issues SDRs. Which option is correct?",
});

export const ECO_CP021_REVIEW_V3: EcoCp021ReviewQuestion[] = ECO_CP021_REVIEW_V2.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
