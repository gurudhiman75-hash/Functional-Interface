import { SCI_CP019_REVIEW_V1, type SciCp019ReviewQuestion } from "../cell-biology/sci-cp019-review-v1";
import { SCI_CP020_REVIEW_V1, type SciCp020ReviewQuestion } from "../plant-biology/sci-cp020-review-v1";
import {
  SCI_BIOLOGY_LOCALIZATION_V1,
  type BiologyLocaleV1,
  type BiologyLocalizedQuestionV1,
  type BiologyNativeSpecV1,
} from "./sci-biology-localization-types-v1";
import { SCI_BIOLOGY_CP019_HI_V1 } from "./sci-biology-cp019-localization-data-hi-v1";
import { SCI_BIOLOGY_CP019_PA_V1 } from "./sci-biology-cp019-localization-data-pa-v1";
import { SCI_BIOLOGY_CP020_HI_V1 } from "./sci-biology-cp020-localization-data-hi-v1";
import { SCI_BIOLOGY_CP020_PA_V1 } from "./sci-biology-cp020-localization-data-pa-v1";

export type BiologyLocalizedCpV1 = "SCI-CP-019" | "SCI-CP-020";
type EnglishQuestion = SciCp019ReviewQuestion | SciCp020ReviewQuestion;

const QL_NAMES = {
  "SCI-CP-019": {
    hi: [
      "कोशिका की खोज, कोशिका सिद्धांत और जैविक संगठन",
      "प्रोकैरियोटिक और यूकैरियोटिक कोशिकाएँ",
      "प्लाज़्मा झिल्ली, कोशिका भित्ति, विसरण और परासरण",
      "केंद्रक, गुणसूत्र, DNA और जीन",
      "राइबोसोम, एंडोप्लाज़्मिक रेटिकुलम और गोल्जी तंत्र",
      "माइटोकॉन्ड्रिया, प्लास्टिड और क्लोरोप्लास्ट",
      "लाइसोसोम, रिक्तिकाएँ और पादप-पशु कोशिका विशेषताएँ",
      "कोशिका विभाजन: समसूत्री और अर्धसूत्री विभाजन",
      "कोशिकांग-कार्य और कोशिका-प्रकार तर्क",
      "सूक्ष्मदर्शी, एककोशिकीय जीवन और मिश्रित कोशिका जीवविज्ञान",
    ],
    pa: [
      "ਕੋਸ਼ਿਕਾ ਦੀ ਖੋਜ, ਕੋਸ਼ਿਕਾ ਸਿਧਾਂਤ ਅਤੇ ਜੈਵਿਕ ਸੰਗਠਨ",
      "ਪ੍ਰੋਕੈਰੀਓਟਿਕ ਅਤੇ ਯੂਕੈਰੀਓਟਿਕ ਕੋਸ਼ਿਕਾਵਾਂ",
      "ਪਲਾਜ਼ਮਾ ਝਿੱਲੀ, ਕੋਸ਼ਿਕਾ ਭਿੱਤ, ਵਿਸਰਨ ਅਤੇ ਪਰਾਸਰਨ",
      "ਕੇਂਦਰਕ, ਗੁਣਸੂਤਰ, DNA ਅਤੇ ਜੀਨ",
      "ਰਾਈਬੋਸੋਮ, ਐਂਡੋਪਲਾਜ਼ਮਿਕ ਰੈਟੀਕੁਲਮ ਅਤੇ ਗੋਲਜੀ ਤੰਤਰ",
      "ਮਾਈਟੋਕੌਂਡ੍ਰੀਆ, ਪਲਾਸਟਿਡ ਅਤੇ ਕਲੋਰੋਪਲਾਸਟ",
      "ਲਾਈਸੋਸੋਮ, ਰਿਕਤਿਕਾਵਾਂ ਅਤੇ ਪੌਧਾ-ਜਾਨਵਰ ਕੋਸ਼ਿਕਾ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      "ਕੋਸ਼ਿਕਾ ਵਿਭਾਜਨ: ਮਾਈਟੋਸਿਸ ਅਤੇ ਮੀਓਸਿਸ",
      "ਕੋਸ਼ਿਕਾਂਗ-ਕਾਰਜ ਅਤੇ ਕੋਸ਼ਿਕਾ-ਪ੍ਰਕਾਰ ਤਰਕ",
      "ਸੂਖਮਦਰਸ਼ੀ, ਇਕ-ਕੋਸ਼ਿਕੀ ਜੀਵਨ ਅਤੇ ਮਿਲੀ-ਜੁਲੀ ਕੋਸ਼ਿਕਾ ਜੀਵ ਵਿਗਿਆਨ",
    ],
  },
  "SCI-CP-020": {
    hi: [
      "पादप ऊतक और विभज्योतक",
      "जड़: कार्य और रूपांतरण",
      "तना और पत्ती: कार्य और रूपांतरण",
      "जाइलम, फ्लोएम और परिवहन",
      "रंध्र, वाष्पोत्सर्जन और जल संतुलन",
      "प्रकाश संश्लेषण और उसके कारक",
      "पादप श्वसन और खनिज पोषण",
      "अनुवर्तन और पादप हार्मोन",
      "फूल, परागण, निषेचन, बीज और फल",
      "वानस्पतिक प्रजनन, अंकुरण और मिश्रित पादप तर्क",
    ],
    pa: [
      "ਪੌਧਾ ਤੰਤੂ ਅਤੇ ਮੇਰਿਸਟਮ",
      "ਜੜ੍ਹ: ਕੰਮ ਅਤੇ ਬਦਲੀਆਂ ਬਣਤਰਾਂ",
      "ਤਣਾ ਅਤੇ ਪੱਤਾ: ਕੰਮ ਅਤੇ ਬਦਲੀਆਂ ਬਣਤਰਾਂ",
      "ਜ਼ਾਈਲਮ, ਫਲੋਐਮ ਅਤੇ ਆਵਾਜਾਈ",
      "ਸਟੋਮਾਟਾ, ਵਾਸ਼ਪ ਉਤਸਰਜਨ ਅਤੇ ਪਾਣੀ ਦਾ ਸੰਤੁਲਨ",
      "ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਅਤੇ ਇਸ ਦੇ ਕਾਰਕ",
      "ਪੌਧਾ ਸ਼ਵਾਸ ਅਤੇ ਖਣਿਜ ਪੋਸ਼ਣ",
      "ਟ੍ਰੋਪਿਜ਼ਮ ਅਤੇ ਪੌਧਾ ਹਾਰਮੋਨ",
      "ਫੁੱਲ, ਪਰਾਗਣ, ਨਿਸ਼ੇਚਨ, ਬੀਜ ਅਤੇ ਫਲ",
      "ਵਨਸਪਤੀ ਪ੍ਰਸਾਰ, ਅੰਕੁਰਣ ਅਤੇ ਮਿਲੀ-ਜੁਲੀ ਪੌਧਾ ਸਮਝ",
    ],
  },
} as const;

const qlNumber=(qlId:string)=>Number(qlId.slice(-3));

function metadata(englishQuestionId:string){
  return Object.freeze({
    version: SCI_BIOLOGY_LOCALIZATION_V1,
    englishQuestionId,
    semanticInvariant:true as const,
    cpInvariant:true as const,
    qlInvariant:true as const,
    difficultyInvariant:true as const,
    sourceInvariant:true as const,
    optionOrderInvariant:true as const,
    correctIndexInvariant:true as const,
    reviewOnly:true as const,
  });
}

function insertAnswer(answer:string,distractors:readonly [string,string,string],correctIndex:number){
  const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}

function localizeEnglish(q:EnglishQuestion):BiologyLocalizedQuestionV1{
  return Object.freeze({
    ...q,
    options:Object.freeze([...q.options]),
    sourceIds:Object.freeze([...q.sourceIds]),
    sourceFactIds:Object.freeze([...q.sourceFactIds]),
    locale:"en" as const,
    localizationV1:metadata(q.questionId),
  });
}

function localizeNative(q:EnglishQuestion,locale:Exclude<BiologyLocaleV1,"en">,spec:BiologyNativeSpecV1):BiologyLocalizedQuestionV1{
  const [stem,answer,distractors,explanation]=spec;
  const options=insertAnswer(answer,distractors,q.correctIndex);
  return Object.freeze({
    ...q,
    questionId:`${q.questionId}-${locale.toUpperCase()}`,
    qlName:QL_NAMES[q.cpId][locale][qlNumber(q.qlId)-1],
    stem,
    options,
    canonicalAnswer:options[q.correctIndex],
    explanation,
    sourceIds:Object.freeze([...q.sourceIds]),
    sourceFactIds:Object.freeze([...q.sourceFactIds]),
    locale,
    localizationV1:metadata(q.questionId),
  });
}

export function generateBiologyLocalizedCpV1(cpId:BiologyLocalizedCpV1,locale:BiologyLocaleV1):readonly BiologyLocalizedQuestionV1[]{
  const english:readonly EnglishQuestion[]=cpId==="SCI-CP-019"?SCI_CP019_REVIEW_V1:SCI_CP020_REVIEW_V1;
  if(locale==="en") return Object.freeze(english.map(localizeEnglish));
  const specs:readonly BiologyNativeSpecV1[]=cpId==="SCI-CP-019"
    ?(locale==="hi"?SCI_BIOLOGY_CP019_HI_V1:SCI_BIOLOGY_CP019_PA_V1)
    :(locale==="hi"?SCI_BIOLOGY_CP020_HI_V1:SCI_BIOLOGY_CP020_PA_V1);
  if(specs.length!==english.length) throw new Error(`${cpId}/${locale}: expected ${english.length} native surfaces, found ${specs.length}`);
  return Object.freeze(english.map((q,index)=>localizeNative(q,locale,specs[index])));
}

export const SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1=Object.freeze(["SCI-CP-019","SCI-CP-020"] as const);
export const SCI_BIOLOGY_WAVE1_SUPPORTED_LOCALES_V1=Object.freeze(["en","hi","pa"] as const);
