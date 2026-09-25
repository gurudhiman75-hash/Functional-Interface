import { SCI_CP036_REVIEW_V1, type SciCp036ReviewQuestion } from "../everyday-science/sci-cp036-review-v1";
import { SCI_CP037_REVIEW_V1, type SciCp037ReviewQuestion } from "../scientists-discoveries-inventions/sci-cp037-review-v1";
import {
  SCI_GENERAL_SCIENCE_LOCALIZATION_V1,
  type GeneralScienceLocaleV1,
  type GeneralScienceLocalizedQuestionV1,
  type GeneralScienceNativeSpecV1,
} from "./sci-general-localization-types-v1";
import { SCI_GENERAL_CP036_HI_V1 } from "./sci-general-cp036-localization-data-hi-v1";
import { SCI_GENERAL_CP036_PA_V1 } from "./sci-general-cp036-localization-data-pa-v1";
import { SCI_GENERAL_CP037_HI_V1 } from "./sci-general-cp037-localization-data-hi-v1";
import { SCI_GENERAL_CP037_PA_V1 } from "./sci-general-cp037-localization-data-pa-v1";

export type GeneralScienceLocalizedCpV1 = "SCI-CP-036" | "SCI-CP-037";
type EnglishQuestion = SciCp036ReviewQuestion | SciCp037ReviewQuestion;

const QL_NAMES = {
  "SCI-CP-036": {
    hi: [
      "खाना पकाना, दबाव और क्वथन",
      "ठंडक, रेफ्रिजरेशन और वाष्पीकरण",
      "ऊष्मा स्थानांतरण और ऊष्मारोधन",
      "घरेलू बिजली और विद्युत सुरक्षा",
      "दैनिक जीवन में प्रकाश, दर्पण और लेंस",
      "दैनिक जीवन में ध्वनि और श्रवण",
      "पानी, स्वच्छता और घरेलू शुद्धिकरण",
      "सफाई, पदार्थ और सामान्य घरेलू विज्ञान",
      "परिवहन, घर्षण और यांत्रिक उपयोग",
      "सामान्य उपकरण और मिश्रित दैनिक विज्ञान",
    ],
    pa: [
      "ਖਾਣਾ ਪਕਾਉਣਾ, ਦਬਾਅ ਅਤੇ ਉਬਾਲ",
      "ਠੰਢਕ, ਰੈਫ੍ਰਿਜਰੇਸ਼ਨ ਅਤੇ ਭਾਫ਼ ਬਣਨਾ",
      "ਗਰਮੀ ਦਾ ਟ੍ਰਾਂਸਫਰ ਅਤੇ ਇਨਸੂਲੇਸ਼ਨ",
      "ਘਰੇਲੂ ਬਿਜਲੀ ਅਤੇ ਬਿਜਲੀ ਸੁਰੱਖਿਆ",
      "ਰੋਜ਼ਾਨਾ ਜੀਵਨ ਵਿੱਚ ਰੌਸ਼ਨੀ, ਦਰਪਣ ਅਤੇ ਲੈਂਸ",
      "ਰੋਜ਼ਾਨਾ ਹਾਲਾਤਾਂ ਵਿੱਚ ਆਵਾਜ਼ ਅਤੇ ਸੁਣਨਾ",
      "ਪਾਣੀ, ਸਫ਼ਾਈ ਅਤੇ ਘਰੇਲੂ ਸ਼ੁੱਧੀਕਰਨ",
      "ਸਫ਼ਾਈ, ਸਮੱਗਰੀ ਅਤੇ ਆਮ ਘਰੇਲੂ ਵਿਗਿਆਨ",
      "ਆਵਾਜਾਈ, ਘਰਸ਼ਣ ਅਤੇ ਮਕੈਨਿਕਲ ਵਰਤੋਂ",
      "ਆਮ ਉਪਕਰਣ ਅਤੇ ਮਿਲੀ-ਜੁਲੀ ਰੋਜ਼ਾਨਾ ਵਿਗਿਆਨ ਸਮਝ",
    ],
  },
  "SCI-CP-037": {
    hi: [
      "यांत्रिकी, दबाव और शास्त्रीय भौतिकी",
      "विद्युत और चुंबकत्व",
      "प्रकाश, विकिरण और आधुनिक भौतिकी",
      "रसायन विज्ञान और परमाणु विचार",
      "कोशिकाएँ, सूक्ष्मजीव विज्ञान और जैविक खोजें",
      "विकास और आनुवंशिकी",
      "चिकित्सा, टीके और मानव शरीर क्रिया",
      "संचार और परिचित आविष्कार",
      "भारतीय वैज्ञानिक और प्रमुख योगदान",
      "मिश्रित वैज्ञानिक–खोज–आविष्कार तर्क",
    ],
    pa: [
      "ਮਕੈਨਿਕਸ, ਦਬਾਅ ਅਤੇ ਕਲਾਸੀਕਲ ਭੌਤਿਕ ਵਿਗਿਆਨ",
      "ਬਿਜਲੀ ਅਤੇ ਚੁੰਬਕਤਾ",
      "ਰੌਸ਼ਨੀ, ਵਿਕਿਰਣ ਅਤੇ ਆਧੁਨਿਕ ਭੌਤਿਕ ਵਿਗਿਆਨ",
      "ਰਸਾਇਣ ਵਿਗਿਆਨ ਅਤੇ ਪਰਮਾਣੂ ਵਿਚਾਰ",
      "ਕੋਸ਼ਿਕਾਵਾਂ, ਸੂਖਮਜੀਵ ਵਿਗਿਆਨ ਅਤੇ ਜੈਵਿਕ ਖੋਜਾਂ",
      "ਵਿਕਾਸ ਅਤੇ ਜੈਨੇਟਿਕਸ",
      "ਦਵਾਈ, ਟੀਕੇ ਅਤੇ ਮਨੁੱਖੀ ਸਰੀਰਕ ਕਿਰਿਆ",
      "ਸੰਚਾਰ ਅਤੇ ਜਾਣੇ-ਪਛਾਣੇ ਆਵਿਸ਼ਕਾਰ",
      "ਭਾਰਤੀ ਵਿਗਿਆਨੀ ਅਤੇ ਮੁੱਖ ਯੋਗਦਾਨ",
      "ਮਿਲੀ-ਜੁਲੀ ਵਿਗਿਆਨੀ–ਖੋਜ–ਆਵਿਸ਼ਕਾਰ ਸਮਝ",
    ],
  },
} as const;

const qlNumber=(qlId:string)=>{
  const n=Number(qlId.match(/(\d+)$/)?.[1]??"0");
  if(!n) throw new Error(`Invalid QL id: ${qlId}`);
  return n;
};
const insertAnswer=(answer:string,distractors:readonly [string,string,string],correctIndex:number)=>{
  const options=[...distractors];
  options.splice(correctIndex,0,answer);
  return Object.freeze(options);
};
const metadata=(englishQuestionId:string)=>Object.freeze({
  version:SCI_GENERAL_SCIENCE_LOCALIZATION_V1,
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
function localizeEnglish(q:EnglishQuestion):GeneralScienceLocalizedQuestionV1{
  return Object.freeze({
    ...q,
    options:Object.freeze([...q.options]),
    sourceIds:Object.freeze([...q.sourceIds]),
    sourceFactIds:Object.freeze([...q.sourceFactIds]),
    locale:"en" as const,
    localizationV1:metadata(q.questionId),
  });
}
function localizeNative(q:EnglishQuestion,locale:Exclude<GeneralScienceLocaleV1,"en">,spec:GeneralScienceNativeSpecV1):GeneralScienceLocalizedQuestionV1{
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
function englishFor(cpId:GeneralScienceLocalizedCpV1):readonly EnglishQuestion[]{
  if(cpId==="SCI-CP-036") return SCI_CP036_REVIEW_V1;
  return SCI_CP037_REVIEW_V1;
}
function nativeFor(cpId:GeneralScienceLocalizedCpV1,locale:Exclude<GeneralScienceLocaleV1,"en">):readonly GeneralScienceNativeSpecV1[]{
  if(cpId==="SCI-CP-036") return locale==="hi"?SCI_GENERAL_CP036_HI_V1:SCI_GENERAL_CP036_PA_V1;
  return locale==="hi"?SCI_GENERAL_CP037_HI_V1:SCI_GENERAL_CP037_PA_V1;
}
export function generateGeneralScienceLocalizedCpV1(cpId:GeneralScienceLocalizedCpV1,locale:GeneralScienceLocaleV1):readonly GeneralScienceLocalizedQuestionV1[]{
  const english=englishFor(cpId);
  if(locale==="en") return Object.freeze(english.map(localizeEnglish));
  const specs=nativeFor(cpId,locale);
  if(specs.length!==english.length) throw new Error(`${cpId}/${locale}: expected ${english.length} native surfaces, found ${specs.length}`);
  return Object.freeze(english.map((q,index)=>localizeNative(q,locale,specs[index])));
}
export const SCI_GENERAL_SCIENCE_SUPPORTED_CPS_V1=Object.freeze(["SCI-CP-036","SCI-CP-037"] as const);
export const SCI_GENERAL_SCIENCE_SUPPORTED_LOCALES_V1=Object.freeze(["en","hi","pa"] as const);
