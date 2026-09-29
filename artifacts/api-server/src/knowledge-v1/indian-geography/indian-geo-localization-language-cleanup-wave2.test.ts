import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return { questionId:"QA-W2", qlId:"QA-QL", stem, options:[answer,...distractors], correctIndex:0, canonicalAnswer:answer, explanation } as const;
}

const soil=q(
  "Which statement best distinguishes soil erosion from soil formation?",
  "Erosion removes soil, while formation develops soil from parent material over time",
  ["Both are the same process","Formation always occurs faster than erosion","Erosion creates parent rock"],
  "Soil erosion removes topsoil, while soil formation is a much slower process.",
);
assert.equal(localizeIndianGeoQuestionV1(soil,"hi","GEO-SOI-001").stem,"मृदा अपरदन और मृदा निर्माण के बीच अंतर को कौन-सा कथन सबसे सही बताता है?");
assert.equal(localizeIndianGeoQuestionV1(soil,"pa","GEO-SOI-001").stem,"ਮਿੱਟੀ ਕਟਾਅ ਅਤੇ ਮਿੱਟੀ ਬਣਨ ਵਿਚਲਾ ਫਰਕ ਕਿਹੜਾ ਕਥਨ ਸਭ ਤੋਂ ਸਹੀ ਦੱਸਦਾ ਹੈ?");

const agr=q(
  "A crop is sown soon after monsoon rain arrives and harvested after the rainy season. Which crop season does this describe?",
  "Kharif",["Rabi","Zaid","Plantation"],
  "Kharif crops are generally sown with the onset of monsoon and harvested after the rainy season.",
);
assert.equal(localizeIndianGeoQuestionV1(agr,"hi","GEO-AGR-001").stem,"मानसूनी वर्षा शुरू होने के बाद बोई और वर्षा ऋतु के बाद काटी जाने वाली फसल किस मौसम की होती है?");
assert.equal(localizeIndianGeoQuestionV1(agr,"pa","GEO-AGR-001").stem,"ਮਾਨਸੂਨੀ ਵਰਖਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬੀਜੀ ਅਤੇ ਵਰਖਾ ਰੁੱਤ ਤੋਂ ਬਾਅਦ ਕੱਟੀ ਜਾਣ ਵਾਲੀ ਫਸਲ ਕਿਹੜੇ ਮੌਸਮ ਦੀ ਹੁੰਦੀ ਹੈ?");

const veg=q(
  "Acacia, babool and thorny shrubs are characteristic of which vegetation type?",
  "Tropical thorn forest and scrub",["Tropical evergreen forest","Mangrove forest","Montane forest"],
  "Thorn forests and scrub occur in dry regions.",
);
assert.equal(localizeIndianGeoQuestionV1(veg,"hi","GEO-VEG-001").stem,"कीकर, बबूल और कांटेदार झाड़ियाँ किस प्रकार की वनस्पति की विशेषता हैं?");
assert.equal(localizeIndianGeoQuestionV1(veg,"pa","GEO-VEG-001").stem,"ਕੀਕਰ, ਬਬੂਲ ਅਤੇ ਕਾਂਟੇਦਾਰ ਝਾੜੀਆਂ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਬਨਸਪਤੀ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹਨ?");
assert.equal(localizeIndianGeoQuestionV1(veg,"pa","GEO-VEG-001").canonicalAnswer.includes("ਕਾਂਟੇਦਾਰ"),true);


const cropNames=q(
  "Which crop should be removed from groundnut, mustard, soybean and jute to leave an oilseed-only set?",
  "Jute",["Groundnut","Mustard","Soybean"],
  "Groundnut, mustard and soybean are oilseed crops, while jute is a fibre crop.",
);
const cropNamesPa=localizeIndianGeoQuestionV1(cropNames,"pa","GEO-AGR-001");
assert.equal(cropNamesPa.stem.includes("ਮੂੰਗਫ਼ਲੀ"),true);
assert.equal(cropNamesPa.stem.includes("ਸਰ੍ਹੋਂ"),true);
assert.equal(cropNamesPa.stem.includes("ਸੋਇਆਬੀਨ"),true);

const cropTermChecks = [
  ["Rice","ਝੋਨਾ"],["Sugarcane","ਕਮਾਦ"],["Jowar","ਜੂਆਰ"],["Gram","ਛੋਲੇ"],
] as const;
for(const [english,punjabi] of cropTermChecks){
  const x=q("Which crop is "+english+"?",english,["Wheat","Maize","Cotton"],english+" is the correct crop.");
  assert.equal(localizeIndianGeoQuestionV1(x,"pa","GEO-AGR-001").canonicalAnswer,punjabi);
}
