import type { EcoCp015ReviewQuestion } from "./eco-cp015-review-types";
import { ECO_CP015_REVIEW_V2 } from "./eco-cp015-review-generator-v2";

const STEM_REVISIONS_V3: Readonly<Record<string,string>> = Object.freeze({
  "What was the main role of the National Development Council?": "What role did the National Development Council play in India's planning system?",
  "Which phrase best describes the Seventh Five-Year Plan?": "Which phrase is linked with the Seventh Five-Year Plan?",
  "Which description best fits NITI Aayog?": "How is NITI Aayog described in India's policy framework?",
  "Which change best reflects the shift from the Planning Commission to NITI Aayog?": "Which change marked the shift from the Planning Commission to NITI Aayog?",
});

export function generateEcoCp015ReviewV3(): EcoCp015ReviewQuestion[] {
  return ECO_CP015_REVIEW_V2.map((q)=>({...q,stem:STEM_REVISIONS_V3[q.stem]??q.stem}));
}
export const ECO_CP015_REVIEW_V3=Object.freeze(generateEcoCp015ReviewV3());
