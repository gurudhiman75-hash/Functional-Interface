import { ECO_CP020_REVIEW_V1 } from "./eco-cp020-review-generator-v1";
import type { EcoCp020ReviewQuestion } from "./eco-cp020-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "Which investment is generally more easily traded in financial markets?": "Which investment is more easily traded in financial markets?",
  "Which statement best distinguishes FDI from FPI?": "How does FDI differ from FPI?",
  "All else equal, what is a likely effect of domestic-currency depreciation?": "A domestic currency depreciates. What is a likely effect?",
  "All else equal, which combination is most consistent with currency depreciation?": "Which combination is consistent with currency depreciation?",
  "Which statement best describes the relation between reserves and the BoP?": "How can foreign-exchange reserves affect the Balance of Payments?",
  "What does current-account convertibility mainly relate to?": "What does current-account convertibility relate to?",
  "A country has a merchandise deficit but strong service exports and remittance receipts. Which balance is most directly improved by those invisibles?": "A country has a merchandise deficit but strong service exports and remittance receipts. Which balance do these invisibles improve?",
  "Which statement best separates current-account convertibility from FDI liberalisation?": "How does current-account convertibility differ from FDI liberalisation?",
});

export const ECO_CP020_REVIEW_V2: EcoCp020ReviewQuestion[] = ECO_CP020_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.stem] ?? question.stem,
}));
