import type { EcoCp015ReviewQuestion } from "./eco-cp015-review-types";
import { ECO_CP015_REVIEW_V2 } from "./eco-cp015-review-generator-v2";

const STEM_REVISIONS_V3: Readonly<Record<string,string>> = Object.freeze({
  "What was the main role of the National Development Council?": "What role did the National Development Council perform in India's planning system?",
  "Which economist is most closely linked with the Second Five-Year Plan?": "Which economist is associated with the Second Five-Year Plan?",
  "Which phrase best describes the Seventh Five-Year Plan?": "Which phrase is associated with the Seventh Five-Year Plan?",
  "Which phrase is most closely linked with the Eleventh Five-Year Plan?": "Which phrase is associated with the Eleventh Five-Year Plan?",
  "Which description best fits NITI Aayog?": "Which statement correctly describes NITI Aayog?",
  "Which change best reflects the shift from the Planning Commission to NITI Aayog?": "Which change marked the shift from the Planning Commission to NITI Aayog?",
});

export function generateEcoCp015ReviewV3(): EcoCp015ReviewQuestion[] {
  return ECO_CP015_REVIEW_V2.map((q)=>({...q,stem:STEM_REVISIONS_V3[q.stem]??q.stem}));
}
export const ECO_CP015_REVIEW_V3=Object.freeze(generateEcoCp015ReviewV3());
