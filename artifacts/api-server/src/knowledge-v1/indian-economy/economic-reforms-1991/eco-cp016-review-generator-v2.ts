import type { EcoCp016ReviewQuestion } from "./eco-cp016-review-types";
import { ECO_CP016_REVIEW_V1 } from "./eco-cp016-review-generator-v1";

const STEM_REVISIONS_V2: Readonly<Record<string,string>> = Object.freeze({
  "Which sequence best describes the 1991 reform context?": "What is the correct sequence of events in the 1991 reform context?",
  "Which reform mainly reduces unnecessary government controls on economic activity?": "Which reform reduces unnecessary government controls on economic activity?",
  "Which reform is most directly linked with selling government shares in a public enterprise?": "Which reform involves selling government shares in a public enterprise?",
  "Which change is most closely linked with trade liberalisation?": "Which change is associated with trade liberalisation?",
  "Which sector was the Narasimham Committee mainly concerned with?": "Which sector did the Narasimham Committee examine?",
  "Which statement best reflects the post-1991 financial reform direction?": "Which statement correctly describes the direction of financial reforms after 1991?",
  "Which measure is mainly a stabilisation measure rather than a structural reform?": "Which measure is a stabilisation measure rather than a structural reform?",
  "What did current-account convertibility mainly allow?": "What did current-account convertibility allow?",
  "Which reform pair deals mainly with different areas of the economy?": "Which reform pair deals with different areas of the economy?",
  "Which statement best summarises the direction of the 1991 reforms?": "Which statement correctly summarises the direction of the 1991 reforms?",
});

export function generateEcoCp016ReviewV2(): EcoCp016ReviewQuestion[] {
  return ECO_CP016_REVIEW_V1.map((q)=>({...q,stem:STEM_REVISIONS_V2[q.stem]??q.stem}));
}
export const ECO_CP016_REVIEW_V2=Object.freeze(generateEcoCp016ReviewV2());
