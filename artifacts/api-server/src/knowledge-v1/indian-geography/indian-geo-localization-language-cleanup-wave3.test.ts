import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return { questionId:"QA-W3", qlId:"QA-QL", stem, options:[answer,...distractors], correctIndex:0, canonicalAnswer:answer, explanation } as const;
}

const ind=q(
  "Which ore is the principal raw material for aluminium production?",
  "Bauxite",["Hematite","Chromite","Mica"],
  "Bauxite is refined to alumina and then smelted to produce aluminium metal.",
);
assert.equal(localizeIndianGeoQuestionV1(ind,"hi","GEO-IND-001").stem,"एल्यूमिनियम उत्पादन के लिए प्रमुख कच्चा माल कौन-सा अयस्क है?");
assert.equal(localizeIndianGeoQuestionV1(ind,"pa","GEO-IND-001").stem,"ਐਲੂਮੀਨੀਅਮ ਦੇ ਉਤਪਾਦਨ ਲਈ ਮੁੱਖ ਕੱਚਾ ਮਾਲ ਕਿਹੜੀ ਕੱਚੀ ਧਾਤ ਹੈ?");

const trn=q(
  "What is a port hinterland?",
  "The inland area served by a port",["Only the dockyard","A mountain pass","The sea area beyond territorial waters"],
  "A port's hinterland is the inland region served by the port.",
);
assert.equal(localizeIndianGeoQuestionV1(trn,"hi","GEO-TRN-001").stem,"बंदरगाह का पृष्ठप्रदेश क्या होता है?");
assert.equal(localizeIndianGeoQuestionV1(trn,"pa","GEO-TRN-001").stem,"ਬੰਦਰਗਾਹ ਦਾ ਪਛੋਕੜੀ ਖੇਤਰ ਕੀ ਹੁੰਦਾ ਹੈ?");

const pop=q(
  "Which term describes the place from which a migrant moves?",
  "Place of origin",["Place of destination","Population density","Settlement hierarchy"],
  "The origin is the place the migrant leaves.",
);
assert.equal(localizeIndianGeoQuestionV1(pop,"hi","GEO-POP-001").stem,"जिस स्थान से कोई प्रवासी जाता है, उसे क्या कहा जाता है?");
assert.equal(localizeIndianGeoQuestionV1(pop,"pa","GEO-POP-001").stem,"ਜਿਸ ਥਾਂ ਤੋਂ ਕੋਈ ਪਰਵਾਸੀ ਜਾਂਦਾ ਹੈ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?");
