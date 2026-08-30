import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A1 } from "./geometry-localization-editorial-v2-a1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A2 } from "./geometry-localization-editorial-v2-a2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B1 } from "./geometry-localization-editorial-v2-b1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B2 } from "./geometry-localization-editorial-v2-b2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B3 } from "./geometry-localization-editorial-v2-b3";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C1 } from "./geometry-localization-editorial-v2-c1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C2 } from "./geometry-localization-editorial-v2-c2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C3 } from "./geometry-localization-editorial-v2-c3";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D1 } from "./geometry-localization-editorial-v2-d1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D2 } from "./geometry-localization-editorial-v2-d2";

export {
  type GeometryReviewLocaleV2,
  type GeometryEditorialTemplateV2,
  type GeometryPrototypeEditorialTemplateV2,
  type GeometryPrototypeEditorialVariantsV2,
} from "./geometry-localization-editorial-v2-types";
export { GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2 } from "./geometry-localization-options-v2";
export { GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2 } from "./geometry-localization-editorial-v2-variants";

const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE = Object.freeze({
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B3,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C3,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D2,
});

const sssSimilarity = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE["GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1"];
const perimeterToSide = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE["GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1"];
const sideToPerimeter = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE["GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1"];
const exteriorFromN = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE["GEO-TMP-CP009-EXTERIOR-FROM-N-V1"];
const secantSecant = GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE["GEO-TMP-CP013-SECANT-SECANT-V1"];

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2 = Object.freeze({
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_BASE,
  "GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1": Object.freeze({
    ...sssSimilarity,
    explanations: Object.freeze([
      Object.freeze({
        ...sssSimilarity.explanations[0]!,
        hi: "हर संगत भुजा-युग्म का अनुपात समान है।",
        pa: "ਹਰ ਸੰਗਤ ਭੁਜਾ-ਜੋੜੇ ਦਾ ਅਨੁਪਾਤ ਇੱਕੋ ਹੈ।",
      }),
      ...sssSimilarity.explanations.slice(1),
    ]),
  }),
  "GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1": Object.freeze({
    ...perimeterToSide,
    explanations: Object.freeze([
      Object.freeze({
        ...perimeterToSide.explanations[0]!,
        hi: "PQR छोटा समरूप त्रिभुज है; ABC की तुलना में उसके परिमाप का अनुपात {{0}}/{{1}} = {{2}}/{{3}} है।",
        pa: "PQR ਛੋਟਾ ਸਮਰੂਪ ਤਿਕੋਣ ਹੈ; ABC ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ ਇਸ ਦੇ ਪਰਿਮਾਪ ਦਾ ਅਨੁਪਾਤ {{0}}/{{1}} = {{2}}/{{3}} ਹੈ।",
      }),
      Object.freeze({
        ...perimeterToSide.explanations[1]!,
        hi: "इसलिए संगत भुजाओं PQ और AB का अनुपात भी {{0}}/{{1}} होगा।",
        pa: "ਇਸ ਲਈ ਸੰਗਤ ਭੁਜਾਵਾਂ PQ ਅਤੇ AB ਦਾ ਅਨੁਪਾਤ ਵੀ {{0}}/{{1}} ਹੋਵੇਗਾ।",
      }),
      ...perimeterToSide.explanations.slice(2),
    ]),
  }),
  "GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1": Object.freeze({
    ...sideToPerimeter,
    explanations: Object.freeze([
      sideToPerimeter.explanations[0]!,
      Object.freeze({
        ...sideToPerimeter.explanations[1]!,
        hi: "PQR से ABC की संगत भुजाओं का अनुपात {{0}}/{{1}} = {{2}}/{{3}} है।",
        pa: "PQR ਤੋਂ ABC ਦੀਆਂ ਸੰਗਤ ਭੁਜਾਵਾਂ ਦਾ ਅਨੁਪਾਤ {{0}}/{{1}} = {{2}}/{{3}} ਹੈ।",
      }),
      Object.freeze({
        ...sideToPerimeter.explanations[2]!,
        hi: "इसी अनुपात को पूरे परिमाप पर लागू करें: {{0}} × {{1}}/{{2}} = {{3}} cm।",
        pa: "ਇਹੀ ਅਨੁਪਾਤ ਪੂਰੇ ਪਰਿਮਾਪ ਉੱਤੇ ਲਗਾਓ: {{0}} × {{1}}/{{2}} = {{3}} cm।",
      }),
      ...sideToPerimeter.explanations.slice(3),
    ]),
  }),
  "GEO-TMP-CP009-EXTERIOR-FROM-N-V1": Object.freeze({
    ...exteriorFromN,
    explanations: Object.freeze([
      Object.freeze({
        ...exteriorFromN.explanations[0]!,
        hi: "प्रत्येक शीर्ष पर एक बाह्य कोण लेने पर उनका कुल योग {{0}}° होता है। नियमित बहुभुज में ये सभी बाह्य कोण बराबर होते हैं।",
        pa: "ਹਰ ਸਿਰੇ ਉੱਤੇ ਇੱਕ ਬਾਹਰੀ ਕੋਣ ਲੈਣ ਨਾਲ ਉਨ੍ਹਾਂ ਦਾ ਕੁੱਲ ਜੋੜ {{0}}° ਹੁੰਦਾ ਹੈ। ਨਿਯਮਿਤ ਬਹੁਭੁਜ ਵਿੱਚ ਇਹ ਸਾਰੇ ਬਾਹਰੀ ਕੋਣ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।",
      }),
      ...exteriorFromN.explanations.slice(1),
    ]),
  }),
  "GEO-TMP-CP013-SECANT-SECANT-V1": Object.freeze({
    ...secantSecant,
    question: Object.freeze({
      ...secantSecant.question,
      hi: "बाह्य बिंदु P से दो छेदक PAB और PCD एक ही वृत्त को काटते हैं; A और C, P के निकट स्थित प्रतिच्छेद बिंदु हैं। यदि PA = {{0}} cm, PB = {{1}} cm और PC = {{2}} cm है, तो पूर्ण छेदक PD ज्ञात कीजिए।",
      pa: "ਬਾਹਰੀ ਬਿੰਦੂ P ਤੋਂ ਦੋ ਛੇਦਕ PAB ਅਤੇ PCD ਇੱਕੋ ਵਰਤੁਲ ਨੂੰ ਕੱਟਦੇ ਹਨ; A ਅਤੇ C, P ਦੇ ਨੇੜੇ ਸਥਿਤ ਕੱਟ-ਬਿੰਦੂ ਹਨ। ਜੇ PA = {{0}} cm, PB = {{1}} cm ਅਤੇ PC = {{2}} cm ਹੈ, ਤਾਂ ਪੂਰਾ ਛੇਦਕ PD ਪਤਾ ਕਰੋ।",
    }),
  }),
});
