import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return { questionId:"QA-W4", qlId:"QA-QL", stem, options:[answer,...distractors], correctIndex:0, canonicalAnswer:answer, explanation } as const;
}

const wat=q(
  "A district receives little rainfall and has no perennial river. What problem is most likely?",
  "Water scarcity",["Permanent flooding everywhere","No need for groundwater","Excess water throughout the year"],
  "Low rainfall and weak perennial drainage can create water scarcity.",
);
assert.equal(localizeIndianGeoQuestionV1(wat,"pa","GEO-WAT-001").stem,"ਕਿਸੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਘੱਟ ਵਰਖਾ ਹੁੰਦੀ ਹੈ ਅਤੇ ਕੋਈ ਸਦਾ ਵਗਣ ਵਾਲੀ ਨਦੀ ਨਹੀਂ ਹੈ। ਉੱਥੇ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਸਮੱਸਿਆ ਕੀ ਹੋਵੇਗੀ?");

const lnd=q(
  "A region faces rising demand for farms, housing and roads on the same finite area. What issue does this illustrate?",
  "Competing land uses",["Unlimited land supply","No land-use pressure","Only climate change"],
  "Finite land must be allocated among competing uses.",
);
assert.equal(localizeIndianGeoQuestionV1(lnd,"pa","GEO-LND-001").stem,"ਇੱਕ ਸੀਮਿਤ ਜ਼ਮੀਨੀ ਖੇਤਰ ਉੱਤੇ ਖੇਤੀ, ਰਿਹਾਇਸ਼ ਅਤੇ ਸੜਕਾਂ ਦੀ ਵੱਧਦੀ ਮੰਗ ਕਿਹੜੀ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦੀ ਹੈ?");

const loc=q(
  "Which state is crossed by the Tropic of Cancer?",
  "Jharkhand",["Punjab","Kerala","Goa"],
  "The Tropic of Cancer crosses Jharkhand.",
);
assert.equal(localizeIndianGeoQuestionV1(loc,"pa","GEO-LOC-001").stem,"ਕਰਕ ਰੇਖਾ ਕਿਹੜੇ ਰਾਜ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ?");

const pln=q(
  "What is target-area planning?",
  "Development planning focused on a specific problem region",["Planning only for individuals","Planning with no geographic focus","Only urban zoning"],
  "Target-area programmes address spatially concentrated development problems.",
);
assert.equal(localizeIndianGeoQuestionV1(pln,"pa","GEO-PLN-001").stem,"ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਕੀ ਹੈ?");

const haz=q(
  "A steep Himalayan slope fails after days of heavy monsoon rain. Which hazard occurred?",
  "Landslide",["Drought","Storm surge","Tsunami"],
  "Rainfall-triggered slope failure is a landslide.",
);
assert.equal(localizeIndianGeoQuestionV1(haz,"pa","GEO-HAZ-001").stem,"ਕਈ ਦਿਨਾਂ ਦੀ ਭਾਰੀ ਮਾਨਸੂਨੀ ਵਰਖਾ ਤੋਂ ਬਾਅਦ ਹਿਮਾਲਈ ਢਲਾਣ ਖਿਸਕ ਗਈ। ਇਹ ਕਿਹੜੀ ਆਫ਼ਤ ਹੈ?");
