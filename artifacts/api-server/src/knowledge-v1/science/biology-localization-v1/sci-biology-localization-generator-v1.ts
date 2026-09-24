import { SCI_CP019_REVIEW_V1, type SciCp019ReviewQuestion } from "../cell-biology/sci-cp019-review-v1";
import { SCI_CP020_REVIEW_V1, type SciCp020ReviewQuestion } from "../plant-biology/sci-cp020-review-v1";
import { SCI_CP021_REVIEW_V1, type SciCp021ReviewQuestion } from "../human-digestive-system/sci-cp021-review-v1";
import { SCI_CP022_REVIEW_V1, type SciCp022ReviewQuestion } from "../respiratory-system/sci-cp022-review-v1";
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
import { SCI_BIOLOGY_CP021_HI_V1 } from "./sci-biology-cp021-localization-data-hi-v1";
import { SCI_BIOLOGY_CP021_PA_V1 } from "./sci-biology-cp021-localization-data-pa-v1";
import { SCI_BIOLOGY_CP022_HI_V1 } from "./sci-biology-cp022-localization-data-hi-v1";
import { SCI_BIOLOGY_CP022_PA_V1 } from "./sci-biology-cp022-localization-data-pa-v1";

export type BiologyLocalizedCpV1 = "SCI-CP-019" | "SCI-CP-020" | "SCI-CP-021" | "SCI-CP-022";
type EnglishQuestion = SciCp019ReviewQuestion | SciCp020ReviewQuestion | SciCp021ReviewQuestion | SciCp022ReviewQuestion;

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
  "SCI-CP-021": {
    hi: [
      "पाचन तंत्र का परिचय और आहार नाल",
      "दाँत, जीभ और लार",
      "ग्रासनली और आमाशय",
      "यकृत, पित्त और पित्ताशय",
      "अग्न्याशय और पाचक एंजाइम",
      "छोटी आंत और पाचन की पूर्णता",
      "अवशोषण, विल्ली और आत्मसात",
      "बड़ी आंत, मलाशय और बहिर्ग्रहण",
      "पोषक पदार्थों का पाचन और अंतिम उत्पाद",
      "पाचन कार्य और मिश्रित तर्क",
    ],
    pa: [
      "ਪਚਨ ਤੰਤਰ ਅਤੇ ਪਚਨ ਨਲੀ",
      "ਦੰਦ, ਜੀਭ ਅਤੇ ਲਾਰ",
      "ਭੋਜਨ ਨਲੀ ਅਤੇ ਅੰਨਦਰ",
      "ਜਿਗਰ, ਪਿੱਤ ਅਤੇ ਪਿੱਤੇ ਦੀ ਥੈਲੀ",
      "ਅਗਨਾਸ਼ਾ ਅਤੇ ਪਚਨ ਐਂਜ਼ਾਈਮ",
      "ਛੋਟੀ ਆੰਤ ਅਤੇ ਪਚਨ ਦੀ ਪੂਰਨਤਾ",
      "ਸੋਖ, ਵਿਲੀ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਵਰਤੋਂ",
      "ਵੱਡੀ ਆੰਤ, ਮਲਾਸ਼ਯ ਅਤੇ ਮਲ ਤਿਆਗ",
      "ਪੋਸ਼ਕ ਤੱਤਾਂ ਦਾ ਪਚਨ ਅਤੇ ਅੰਤਿਮ ਉਤਪਾਦ",
      "ਪਚਨ ਕੰਮ ਅਤੇ ਮਿਲੀ-ਜੁਲੀ ਸਮਝ",
    ],
  },
  "SCI-CP-022": {
    hi: [
      "श्वसन तंत्र का परिचय और वायु मार्ग",
      "नाक, ग्रसनी, कंठ और श्वासनली",
      "श्वसनी, फेफड़े और वायुकोष",
      "श्वसन की क्रियाविधि",
      "वायुकोषों में गैस विनिमय",
      "श्वसन गैसों का परिवहन",
      "वायवीय और अवायवीय श्वसन",
      "श्वसन दर, व्यायाम और ऊँचाई",
      "श्वास में ली और छोड़ी वायु",
      "श्वसन स्वास्थ्य और मिश्रित तर्क",
    ],
    pa: [
      "ਸ਼ਵਾਸ ਤੰਤਰ ਅਤੇ ਹਵਾ ਦਾ ਰਸਤਾ",
      "ਨੱਕ, ਫੈਰਿੰਕਸ, ਲੈਰਿੰਕਸ ਅਤੇ ਸਾਹ ਨਲੀ",
      "ਬਰਾਂਕਾਈ, ਫੇਫੜੇ ਅਤੇ ਐਲਵੀਓਲਾਈ",
      "ਸਾਹ ਲੈਣ ਦੀ ਕਿਰਿਆ",
      "ਐਲਵੀਓਲਾਈ ਵਿੱਚ ਗੈਸਾਂ ਦਾ ਆਦਾਨ-ਪ੍ਰਦਾਨ",
      "ਸ਼ਵਾਸ ਗੈਸਾਂ ਦੀ ਆਵਾਜਾਈ",
      "ਵਾਯਵੀ ਅਤੇ ਅਵਾਯਵੀ ਸ਼ਵਾਸ",
      "ਸਾਹ ਦੀ ਗਤੀ, ਕਸਰਤ ਅਤੇ ਉੱਚਾਈ",
      "ਅੰਦਰ ਲਈ ਅਤੇ ਬਾਹਰ ਛੱਡੀ ਹਵਾ",
      "ਸ਼ਵਾਸ ਸਿਹਤ ਅਤੇ ਮਿਲੀ-ਜੁਲੀ ਸਮਝ",
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
  const options=[...distractors];
  options.splice(correctIndex,0,answer);
  return Object.freeze(options);
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

function englishFor(cpId:BiologyLocalizedCpV1):readonly EnglishQuestion[]{
  if(cpId==="SCI-CP-019") return SCI_CP019_REVIEW_V1;
  if(cpId==="SCI-CP-020") return SCI_CP020_REVIEW_V1;
  if(cpId==="SCI-CP-021") return SCI_CP021_REVIEW_V1;
  return SCI_CP022_REVIEW_V1;
}

function nativeFor(cpId:BiologyLocalizedCpV1,locale:Exclude<BiologyLocaleV1,"en">):readonly BiologyNativeSpecV1[]{
  if(cpId==="SCI-CP-019") return locale==="hi"?SCI_BIOLOGY_CP019_HI_V1:SCI_BIOLOGY_CP019_PA_V1;
  if(cpId==="SCI-CP-020") return locale==="hi"?SCI_BIOLOGY_CP020_HI_V1:SCI_BIOLOGY_CP020_PA_V1;
  if(cpId==="SCI-CP-021") return locale==="hi"?SCI_BIOLOGY_CP021_HI_V1:SCI_BIOLOGY_CP021_PA_V1;
  return locale==="hi"?SCI_BIOLOGY_CP022_HI_V1:SCI_BIOLOGY_CP022_PA_V1;
}

export function generateBiologyLocalizedCpV1(cpId:BiologyLocalizedCpV1,locale:BiologyLocaleV1):readonly BiologyLocalizedQuestionV1[]{
  const english=englishFor(cpId);
  if(locale==="en") return Object.freeze(english.map(localizeEnglish));
  const specs=nativeFor(cpId,locale);
  if(specs.length!==english.length) throw new Error(`${cpId}/${locale}: expected ${english.length} native surfaces, found ${specs.length}`);
  return Object.freeze(english.map((q,index)=>localizeNative(q,locale,specs[index])));
}

export const SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1=Object.freeze(["SCI-CP-019","SCI-CP-020","SCI-CP-021","SCI-CP-022"] as const);
export const SCI_BIOLOGY_WAVE1_SUPPORTED_LOCALES_V1=Object.freeze(["en","hi","pa"] as const);
