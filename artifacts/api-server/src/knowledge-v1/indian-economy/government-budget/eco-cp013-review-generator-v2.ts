import type { EcoCp013ReviewQuestion } from "./eco-cp013-review-types";
import { ECO_CP013_REVIEW_V1 } from "./eco-cp013-review-generator-v1";

const STEM_REVISIONS_V2: Readonly<Record<string,string>> = Object.freeze({
  "How is expenditure other than charged expenditure generally authorised through Parliament?": "How is expenditure other than charged expenditure authorised through Parliament?",
  "Which statement best explains the difference between charged and voted expenditure?": "Which statement correctly distinguishes charged expenditure from voted expenditure?",
  "Which statement best separates Budget at a Glance from the Expenditure Profile?": "Which statement correctly distinguishes Budget at a Glance from the Expenditure Profile?",
});

export function generateEcoCp013ReviewV2(): EcoCp013ReviewQuestion[] {
  return ECO_CP013_REVIEW_V1.map((q)=>({...q,stem:STEM_REVISIONS_V2[q.stem]??q.stem}));
}
export const ECO_CP013_REVIEW_V2=Object.freeze(generateEcoCp013ReviewV2());
