import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return { questionId:"QA-MIN", qlId:"QA-QL", stem, options:[answer,...distractors], correctIndex:0, canonicalAnswer:answer, explanation } as const;
}

const ore=q(
  "An aluminium smelter depends on which mineral raw material before refining and electrolysis?",
  "Bauxite",["Chromite","Mica","Limestone"],
  "Bauxite is the principal aluminium ore.",
);
assert.equal(localizeIndianGeoQuestionV1(ore,"pa","GEO-MIN-001").stem,"ਐਲੂਮੀਨੀਅਮ ਗਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁੱਧੀਕਰਨ ਅਤੇ ਬਿਜਲੀ-ਅਪਘਟਨ ਲਈ ਕਿਹੜਾ ਖਣਿਜ ਕੱਚਾ ਮਾਲ ਲੋੜੀਂਦਾ ਹੈ?");
assert.equal(localizeIndianGeoQuestionV1(ore,"pa","GEO-MIN-001").canonicalAnswer,"ਬਾਕਸਾਈਟ");

const coal=q(
  "Which coal is commonly called brown coal because of its lower rank and higher moisture?",
  "Lignite",["Anthracite","Bituminous","Peat"],
  "Lignite is a low-rank brown coal with relatively high moisture content.",
);
assert.equal(localizeIndianGeoQuestionV1(coal,"pa","GEO-MIN-001").stem,"ਘੱਟ ਦਰਜੇ ਅਤੇ ਵੱਧ ਨਮੀ ਕਾਰਨ ਕਿਹੜੇ ਕੋਇਲੇ ਨੂੰ ਆਮ ਤੌਰ ਤੇ ਭੂਰਾ ਕੋਇਲਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?");

const petroleum=q(
  "An oilfield is discovered in porous sandstone beneath an impermeable shale layer. What is the shale doing?",
  "Acting as a seal",["Acting as the main metal ore","Producing electricity directly","Forming a placer deposit"],
  "Impermeable shale can cap a porous reservoir and prevent hydrocarbons from escaping.",
);
assert.equal(localizeIndianGeoQuestionV1(petroleum,"pa","GEO-MIN-001").stem,"ਅਭੇਦ ਸ਼ੇਲ ਪਰਤ ਹੇਠਾਂ ਛਿਦਰਦਾਰ ਰੇਤਲੀ ਚੱਟਾਨ ਵਿੱਚ ਤੇਲ ਮਿਲਿਆ ਹੈ। ਸ਼ੇਲ ਪਰਤ ਕੀ ਕੰਮ ਕਰ ਰਹੀ ਹੈ?");

const thermal=q(
  "Why are many large thermal stations located near coalfields?",
  "Coal is bulky and costly to transport in large quantities",["Coal can only burn underground","Electricity cannot be transmitted","Thermal plants require sea coasts only"],
  "Locating near mines reduces coal-haulage cost.",
);
assert.equal(localizeIndianGeoQuestionV1(thermal,"pa","GEO-MIN-001").stem,"ਕਈ ਵੱਡੇ ਤਾਪ ਬਿਜਲੀ ਘਰ ਕੋਇਲਾ ਖੇਤਰਾਂ ਦੇ ਨੇੜੇ ਕਿਉਂ ਲਗਾਏ ਜਾਂਦੇ ਹਨ?");

const solar=q(
  "Which part of India is especially favourable for large solar projects because of high sunshine and arid conditions?",
  "Western Rajasthan",["Upper Assam valley only","Sundarbans delta only","Kashmir Valley only"],
  "Western Rajasthan has strong solar radiation and large open arid areas.",
);
assert.equal(localizeIndianGeoQuestionV1(solar,"pa","GEO-MIN-001").stem,"ਵੱਧ ਧੁੱਪ ਅਤੇ ਸੁੱਕੀਆਂ ਹਾਲਤਾਂ ਕਾਰਨ ਭਾਰਤ ਦਾ ਕਿਹੜਾ ਭਾਗ ਵੱਡੇ ਸੂਰਜੀ ਊਰਜਾ ਪ੍ਰਾਜੈਕਟਾਂ ਲਈ ਖਾਸ ਤੌਰ ਤੇ ਅਨੁਕੂਲ ਹੈ?");
