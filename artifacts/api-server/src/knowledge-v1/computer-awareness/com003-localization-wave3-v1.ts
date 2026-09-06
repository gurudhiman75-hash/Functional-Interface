import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave2-freeze-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import type { Com003ReviewQuestion } from "./com003-review-types";
import type { Com003TargetLanguage, Com003TargetLocale } from "./com003-localization-packet-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

type Bilingual = { hi: string; pa: string };
type Wave3Fact = { entity: string; description: Bilingual };

const WAVE3_QL_IDS = [
  "COM-003-QL-010",
  "COM-003-QL-011",
  "COM-003-QL-012",
  "COM-003-QL-013",
  "COM-003-QL-014",
] as const;
const WAVE3_QL_SET = new Set<string>(WAVE3_QL_IDS);

const TERM_TRANSLATIONS: Record<string, Bilingual> = {
  "Relative cell reference": { hi: "Relative cell reference (सापेक्ष सेल संदर्भ)", pa: "Relative cell reference (ਸਾਪੇਖ ਸੈੱਲ ਹਵਾਲਾ)" },
  "Absolute cell reference": { hi: "Absolute cell reference (निरपेक्ष सेल संदर्भ)", pa: "Absolute cell reference (ਨਿਰਪੇਖ ਸੈੱਲ ਹਵਾਲਾ)" },
  "Mixed cell reference": { hi: "Mixed cell reference (मिश्रित सेल संदर्भ)", pa: "Mixed cell reference (ਮਿਸ਼ਰਤ ਸੈੱਲ ਹਵਾਲਾ)" },
  "Cell range": { hi: "Cell range (सेल रेंज)", pa: "Cell range (ਸੈੱਲ ਰੇਂਜ)" },
  "Ascending sort": { hi: "Ascending Sort (आरोही क्रम)", pa: "Ascending Sort (ਚੜ੍ਹਦਾ ਕ੍ਰਮ)" },
  "Descending sort": { hi: "Descending Sort (अवरोही क्रम)", pa: "Descending Sort (ਘਟਦਾ ਕ੍ਰਮ)" },
  "Filter": { hi: "Filter (फ़िल्टर)", pa: "Filter (ਫਿਲਟਰ)" },
  "Filtering data": { hi: "Filtering data (डेटा फ़िल्टर करना)", pa: "Filtering data (ਡਾਟਾ ਫਿਲਟਰ ਕਰਨਾ)" },
  "AutoFill": { hi: "AutoFill (ऑटोफिल)", pa: "AutoFill (ਆਟੋਫਿਲ)" },
  "Fill handle": { hi: "Fill Handle (फिल हैंडल)", pa: "Fill Handle (ਫਿਲ ਹੈਂਡਲ)" },
  "Insert row": { hi: "Insert Row (पंक्ति जोड़ना)", pa: "Insert Row (ਕਤਾਰ ਜੋੜਨਾ)" },
  "Delete row": { hi: "Delete Row (पंक्ति हटाना)", pa: "Delete Row (ਕਤਾਰ ਹਟਾਉਣਾ)" },
  "Column width": { hi: "Column Width (स्तंभ चौड़ाई)", pa: "Column Width (ਕਾਲਮ ਚੌੜਾਈ)" },
  "Row height": { hi: "Row Height (पंक्ति ऊँचाई)", pa: "Row Height (ਕਤਾਰ ਉਚਾਈ)" },
  "Line chart": { hi: "Line Chart (रेखा चार्ट)", pa: "Line Chart (ਲਾਈਨ ਚਾਰਟ)" },
  "Pie chart": { hi: "Pie Chart (पाई चार्ट)", pa: "Pie Chart (ਪਾਈ ਚਾਰਟ)" },
  "Bar chart": { hi: "Bar Chart (बार चार्ट)", pa: "Bar Chart (ਬਾਰ ਚਾਰਟ)" },
  "Column chart": { hi: "Column Chart (स्तंभ चार्ट)", pa: "Column Chart (ਕਾਲਮ ਚਾਰਟ)" },
};

const DESCRIPTION_TRANSLATIONS: Record<string, Bilingual> = {
  "adds values supplied as numbers, cell references or ranges": {
    hi: "दिए गए numbers, cell references या ranges के मानों को जोड़ता है",
    pa: "ਦਿੱਤੇ numbers, cell references ਜਾਂ ranges ਦੇ ਮੁੱਲਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ",
  },
  "returns the arithmetic mean of its numeric arguments": {
    hi: "numeric arguments का arithmetic mean लौटाता है",
    pa: "numeric arguments ਦਾ arithmetic mean ਵਾਪਸ ਕਰਦਾ ਹੈ",
  },
  "counts cells or arguments containing numbers in the basic numeric-count context": {
    hi: "basic numeric-count संदर्भ में numbers वाले cells या arguments की गिनती करता है",
    pa: "basic numeric-count ਸੰਦਰਭ ਵਿੱਚ numbers ਵਾਲੇ cells ਜਾਂ arguments ਦੀ ਗਿਣਤੀ ਕਰਦਾ ਹੈ",
  },
  "returns the largest numeric value in the supplied set or range": {
    hi: "दिए गए set या range में सबसे बड़ा numeric value लौटाता है",
    pa: "ਦਿੱਤੇ set ਜਾਂ range ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ numeric value ਵਾਪਸ ਕਰਦਾ ਹੈ",
  },
  "returns the smallest numeric value in the supplied set or range": {
    hi: "दिए गए set या range में सबसे छोटा numeric value लौटाता है",
    pa: "ਦਿੱਤੇ set ਜਾਂ range ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ numeric value ਵਾਪਸ ਕਰਦਾ ਹੈ",
  },
  "quickly inserts a SUM formula for a detected or selected range": {
    hi: "detected या selected range के लिए जल्दी से SUM formula डालता है",
    pa: "detected ਜਾਂ selected range ਲਈ ਤੇਜ਼ੀ ਨਾਲ SUM formula ਪਾਂਦਾ ਹੈ",
  },
  "adjusts relative to the new location when a formula is copied or filled": {
    hi: "formula को copy या fill करने पर नई location के अनुसार बदलता है",
    pa: "formula ਨੂੰ copy ਜਾਂ fill ਕਰਨ 'ਤੇ ਨਵੀਂ location ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ",
  },
  "remains fixed when a formula is copied or filled": {
    hi: "formula को copy या fill करने पर स्थिर रहता है",
    pa: "formula ਨੂੰ copy ਜਾਂ fill ਕਰਨ 'ਤੇ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ",
  },
  "absolute column and absolute row reference": {
    hi: "absolute column और absolute row reference",
    pa: "absolute column ਅਤੇ absolute row reference",
  },
  "orders values from lower to higher or A to Z depending on data type": {
    hi: "data type के अनुसार values को छोटे से बड़े या A से Z क्रम में लगाता है",
    pa: "data type ਅਨੁਸਾਰ values ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਜਾਂ A ਤੋਂ Z ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹੈ",
  },
  "orders values from higher to lower or Z to A depending on data type": {
    hi: "data type के अनुसार values को बड़े से छोटे या Z से A क्रम में लगाता है",
    pa: "data type ਅਨੁਸਾਰ values ਨੂੰ ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਜਾਂ Z ਤੋਂ A ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹੈ",
  },
  "shows rows that meet chosen criteria while hiding rows that do not meet them": {
    hi: "चुने गए criteria को पूरा करने वाली rows दिखाता है और अन्य rows छिपाता है",
    pa: "ਚੁਣੇ criteria ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੀਆਂ rows ਦਿਖਾਉਂਦਾ ਹੈ ਅਤੇ ਹੋਰ rows ਲੁਕਾਉਂਦਾ ਹੈ",
  },
  "controls which rows are visible rather than primarily reordering the data": {
    hi: "data को मुख्यतः दोबारा क्रमित करने के बजाय यह नियंत्रित करता है कि कौन-सी rows दिखाई दें",
    pa: "data ਨੂੰ ਮੁੱਖ ਤੌਰ 'ਤੇ ਮੁੜ ਕ੍ਰਮਬੱਧ ਕਰਨ ਦੀ ਬਜਾਇ ਇਹ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ ਕਿ ਕਿਹੜੀਆਂ rows ਦਿਖਾਈ ਦੇਣ",
  },
  "fills adjacent cells using a pattern or values based on selected source cells": {
    hi: "selected source cells के pattern या values के आधार पर adjacent cells भरता है",
    pa: "selected source cells ਦੇ pattern ਜਾਂ values ਦੇ ਆਧਾਰ 'ਤੇ adjacent cells ਭਰਦਾ ਹੈ",
  },
  "is dragged to extend AutoFill into adjacent worksheet cells": {
    hi: "AutoFill को adjacent worksheet cells तक बढ़ाने के लिए drag किया जाता है",
    pa: "AutoFill ਨੂੰ adjacent worksheet cells ਤੱਕ ਵਧਾਉਣ ਲਈ drag ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
  },
  "adds a worksheet row while shifting existing worksheet structure as applicable": {
    hi: "नई worksheet row जोड़ता है और आवश्यकता अनुसार मौजूदा worksheet structure को shift करता है",
    pa: "ਨਵੀਂ worksheet row ਜੋੜਦਾ ਹੈ ਅਤੇ ਲੋੜ ਅਨੁਸਾਰ ਮੌਜੂਦਾ worksheet structure ਨੂੰ shift ਕਰਦਾ ਹੈ",
  },
  "removes the selected worksheet row": {
    hi: "selected worksheet row को हटाता है",
    pa: "selected worksheet row ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ",
  },
  "controls the horizontal width of a worksheet column": {
    hi: "worksheet column की horizontal width नियंत्रित करता है",
    pa: "worksheet column ਦੀ horizontal width ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ",
  },
  "controls the vertical height of a worksheet row": {
    hi: "worksheet row की vertical height नियंत्रित करता है",
    pa: "worksheet row ਦੀ vertical height ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ",
  },
  "commonly shows trends over time or other evenly ordered intervals": {
    hi: "समय या अन्य समान क्रम वाले intervals में trends दिखाने के लिए सामान्यतः उपयोग होता है",
    pa: "ਸਮੇਂ ਜਾਂ ਹੋਰ ਸਮਾਨ ਕ੍ਰਮ ਵਾਲੇ intervals ਵਿੱਚ trends ਦਿਖਾਉਣ ਲਈ ਆਮ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ",
  },
  "shows how values in one data series contribute as parts of a whole": {
    hi: "एक data series के values पूरे के हिस्सों के रूप में कितना योगदान देते हैं, यह दिखाता है",
    pa: "ਇੱਕ data series ਦੇ values ਪੂਰੇ ਦੇ ਹਿੱਸਿਆਂ ਵਜੋਂ ਕਿੰਨਾ ਯੋਗਦਾਨ ਦਿੰਦੇ ਹਨ, ਇਹ ਦਿਖਾਉਂਦਾ ਹੈ",
  },
  "illustrates comparisons among individual items or categories": {
    hi: "अलग-अलग items या categories के बीच तुलना दिखाता है",
    pa: "ਵੱਖ-ਵੱਖ items ਜਾਂ categories ਵਿਚਕਾਰ ਤੁਲਨਾ ਦਿਖਾਉਂਦਾ ਹੈ",
  },
};

const FACTS: Record<string, Wave3Fact> = {
  "com003-excel-function-sum": { entity: "SUM", description: DESCRIPTION_TRANSLATIONS["adds values supplied as numbers, cell references or ranges"]! },
  "com003-excel-function-average": { entity: "AVERAGE", description: DESCRIPTION_TRANSLATIONS["returns the arithmetic mean of its numeric arguments"]! },
  "com003-excel-function-count": { entity: "COUNT", description: DESCRIPTION_TRANSLATIONS["counts cells or arguments containing numbers in the basic numeric-count context"]! },
  "com003-excel-function-max": { entity: "MAX", description: DESCRIPTION_TRANSLATIONS["returns the largest numeric value in the supplied set or range"]! },
  "com003-excel-function-min": { entity: "MIN", description: DESCRIPTION_TRANSLATIONS["returns the smallest numeric value in the supplied set or range"]! },
  "com003-excel-autosum-sum": { entity: "AutoSum", description: DESCRIPTION_TRANSLATIONS["quickly inserts a SUM formula for a detected or selected range"]! },
  "com003-excel-relative-reference": { entity: "Relative cell reference", description: DESCRIPTION_TRANSLATIONS["adjusts relative to the new location when a formula is copied or filled"]! },
  "com003-excel-absolute-reference": { entity: "Absolute cell reference", description: DESCRIPTION_TRANSLATIONS["remains fixed when a formula is copied or filled"]! },
  "com003-excel-absolute-reference-notation": { entity: "$A$1", description: DESCRIPTION_TRANSLATIONS["absolute column and absolute row reference"]! },
  "com003-excel-sort-ascending": { entity: "Ascending sort", description: DESCRIPTION_TRANSLATIONS["orders values from lower to higher or A to Z depending on data type"]! },
  "com003-excel-sort-descending": { entity: "Descending sort", description: DESCRIPTION_TRANSLATIONS["orders values from higher to lower or Z to A depending on data type"]! },
  "com003-excel-filter-purpose": { entity: "Filter", description: DESCRIPTION_TRANSLATIONS["shows rows that meet chosen criteria while hiding rows that do not meet them"]! },
  "com003-excel-filter-not-sort": { entity: "Filtering data", description: DESCRIPTION_TRANSLATIONS["controls which rows are visible rather than primarily reordering the data"]! },
  "com003-excel-autofill-pattern": { entity: "AutoFill", description: DESCRIPTION_TRANSLATIONS["fills adjacent cells using a pattern or values based on selected source cells"]! },
  "com003-excel-fill-handle": { entity: "Fill handle", description: DESCRIPTION_TRANSLATIONS["is dragged to extend AutoFill into adjacent worksheet cells"]! },
  "com003-excel-row-column-insert-row": { entity: "Insert row", description: DESCRIPTION_TRANSLATIONS["adds a worksheet row while shifting existing worksheet structure as applicable"]! },
  "com003-excel-row-column-delete-row": { entity: "Delete row", description: DESCRIPTION_TRANSLATIONS["removes the selected worksheet row"]! },
  "com003-excel-row-column-column-width": { entity: "Column width", description: DESCRIPTION_TRANSLATIONS["controls the horizontal width of a worksheet column"]! },
  "com003-excel-row-column-row-height": { entity: "Row height", description: DESCRIPTION_TRANSLATIONS["controls the vertical height of a worksheet row"]! },
  "com003-excel-line-chart": { entity: "Line chart", description: DESCRIPTION_TRANSLATIONS["commonly shows trends over time or other evenly ordered intervals"]! },
  "com003-excel-pie-chart": { entity: "Pie chart", description: DESCRIPTION_TRANSLATIONS["shows how values in one data series contribute as parts of a whole"]! },
  "com003-excel-bar-chart": { entity: "Bar chart", description: DESCRIPTION_TRANSLATIONS["illustrates comparisons among individual items or categories"]! },
};

const PROTECTED = /^(?:SUM|AVERAGE|COUNT|MAX|MIN|\$?[A-Z]\$?\d+(?::\$?[A-Z]\$?\d+)?)$/;

function locale(language: Com003TargetLanguage): Com003TargetLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}
function t(value: Bilingual, language: Com003TargetLanguage) {
  return value[language];
}
function translateOption(value: string, language: Com003TargetLanguage) {
  if (PROTECTED.test(value)) return value;
  const term = TERM_TRANSLATIONS[value];
  if (term) return t(term, language);
  const description = DESCRIPTION_TRANSLATIONS[value];
  if (description) return t(description, language);
  throw new Error(`COM-003 Wave-3 missing option translation: ${value}`);
}
function targetFact(question: Com003ReviewQuestion) {
  const fact = FACTS[question.targetFactId];
  if (!fact) throw new Error(`COM-003 Wave-3 missing target fact localization: ${question.targetFactId}`);
  return fact;
}

const HI_LEADS = ["दिए गए तथ्य के अनुसार", "मानक Excel व्यवहार में", "सही अवधारणा मिलाने पर", "इस प्रश्न के मुख्य संकेत से", "तकनीकी परिभाषा के अनुसार", "Excel के सामान्य उपयोग में", "विकल्पों की तुलना करने पर", "संबंधित नियम के आधार पर", "यहाँ निर्णायक तथ्य यह है कि", "प्रतियोगी परीक्षा के संदर्भ में", "सही function/feature mapping में", "मानक spreadsheet शब्दावली में"];
const PA_LEADS = ["ਦਿੱਤੇ ਤੱਥ ਅਨੁਸਾਰ", "ਮਿਆਰੀ Excel ਵਿਵਹਾਰ ਵਿੱਚ", "ਸਹੀ ਧਾਰਣਾ ਮਿਲਾਉਣ 'ਤੇ", "ਇਸ ਪ੍ਰਸ਼ਨ ਦੇ ਮੁੱਖ ਸੰਕੇਤ ਤੋਂ", "ਤਕਨੀਕੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ", "Excel ਦੀ ਆਮ ਵਰਤੋਂ ਵਿੱਚ", "ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ 'ਤੇ", "ਸੰਬੰਧਿਤ ਨਿਯਮ ਦੇ ਆਧਾਰ 'ਤੇ", "ਇੱਥੇ ਨਿਰਣਾਇਕ ਤੱਥ ਇਹ ਹੈ ਕਿ", "ਮੁਕਾਬਲਾ ਪਰੀਖਿਆ ਦੇ ਸੰਦਰਭ ਵਿੱਚ", "ਸਹੀ function/feature mapping ਵਿੱਚ", "ਮਿਆਰੀ spreadsheet ਸ਼ਬਦਾਵਲੀ ਵਿੱਚ"];
function lead(language: Com003TargetLanguage, index: number) {
  return (language === "hi" ? HI_LEADS : PA_LEADS)[index]!;
}

function ql010Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = targetFact(question);
  const d = t(fact.description, language);
  if (question.surfaceMode === "AUTOSUM_IDENTIFICATION") {
    const ordinal = [2, 5, 8, 11].indexOf(index);
    const hi = ["Excel में AutoSum मुख्यतः कौन-सा function जल्दी insert करता है?", "AutoSum command सबसे सीधे किस Excel function से जुड़ा है?", "Selected या detected range पर AutoSum सामान्यतः कौन-सा function लगाता है?", "AutoSum सुविधा का प्रमुख target function कौन-सा है?"];
    const pa = ["Excel ਵਿੱਚ AutoSum ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜਾ function ਜਲਦੀ insert ਕਰਦਾ ਹੈ?", "AutoSum command ਸਭ ਤੋਂ ਸਿੱਧੇ ਕਿਹੜੇ Excel function ਨਾਲ ਜੁੜਿਆ ਹੈ?", "Selected ਜਾਂ detected range 'ਤੇ AutoSum ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜਾ function ਲਗਾਉਂਦਾ ਹੈ?", "AutoSum ਸੁਵਿਧਾ ਦਾ ਮੁੱਖ target function ਕਿਹੜਾ ਹੈ?"];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [0, 1, 3, 4, 6, 7, 9, 10].indexOf(index);
  const hi = [
    `कौन-सा Excel function ${d}?`, `इस कार्य के लिए सही Excel function पहचानिए: ${d}।`, `${d}—यह किस basic Excel function का काम है?`, `दिए गए उद्देश्य से function चुनिए: ${d}।`, `कौन-सा spreadsheet function इस विवरण से मेल खाता है: ${d}?`, `Excel में ${d} वाला function कौन-सा है?`, `सही function-purpose pair चुनिए जहाँ function ${d}।`, `निम्न में से कौन-सा function ${d}?`,
  ];
  const pa = [
    `ਕਿਹੜਾ Excel function ${d}?`, `ਇਸ ਕੰਮ ਲਈ ਸਹੀ Excel function ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ basic Excel function ਦਾ ਕੰਮ ਹੈ?`, `ਦਿੱਤੇ ਉਦੇਸ਼ ਤੋਂ function ਚੁਣੋ: ${d}।`, `ਕਿਹੜਾ spreadsheet function ਇਸ ਵਰਣਨ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `Excel ਵਿੱਚ ${d} ਵਾਲਾ function ਕਿਹੜਾ ਹੈ?`, `ਸਹੀ function-purpose pair ਚੁਣੋ ਜਿੱਥੇ function ${d}।`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ function ${d}?`,
  ];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql011Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = targetFact(question);
  const d = t(fact.description, language);
  if (question.surfaceMode === "REFERENCE_NOTATION_CLASSIFICATION") {
    const ordinal = [2, 5, 8, 11].indexOf(index);
    const hi = ["कौन-सा A1-style Excel reference column और row दोनों को absolute रखता है?", "पूरी तरह absolute cell reference वाला notation चुनिए।", "किस notation में column और row दोनों को dollar signs से lock किया जाता है?", "Absolute column और absolute row वाला सही Excel reference कौन-सा है?"];
    const pa = ["ਕਿਹੜਾ A1-style Excel reference column ਅਤੇ row ਦੋਵਾਂ ਨੂੰ absolute ਰੱਖਦਾ ਹੈ?", "ਪੂਰੀ ਤਰ੍ਹਾਂ absolute cell reference ਵਾਲਾ notation ਚੁਣੋ।", "ਕਿਹੜੇ notation ਵਿੱਚ column ਅਤੇ row ਦੋਵਾਂ ਨੂੰ dollar signs ਨਾਲ lock ਕੀਤਾ ਜਾਂਦਾ ਹੈ?", "Absolute column ਅਤੇ absolute row ਵਾਲਾ ਸਹੀ Excel reference ਕਿਹੜਾ ਹੈ?"];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [0, 1, 3, 4, 6, 7, 9, 10].indexOf(index);
  const hi = [`कौन-सा Excel reference type ${d}?`, `Copied formula में यह व्यवहार किस reference type का है: ${d}?`, `${d}—यह किस cell-reference class को दर्शाता है?`, `Formula copy/fill करने पर ${d}; सही reference type चुनिए।`, `कौन-सा reference concept इस व्यवहार से मेल खाता है: ${d}?`, `Excel में ${d} वाला reference type कौन-सा है?`, `दिए गए copied-formula behavior से सही reference class पहचानिए: ${d}।`, `निम्न में से किस reference type की विशेषता है कि वह ${d}?`];
  const pa = [`ਕਿਹੜਾ Excel reference type ${d}?`, `Copied formula ਵਿੱਚ ਇਹ ਵਿਵਹਾਰ ਕਿਹੜੇ reference type ਦਾ ਹੈ: ${d}?`, `${d}—ਇਹ ਕਿਹੜੀ cell-reference class ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`, `Formula copy/fill ਕਰਨ 'ਤੇ ${d}; ਸਹੀ reference type ਚੁਣੋ।`, `ਕਿਹੜਾ reference concept ਇਸ ਵਿਵਹਾਰ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `Excel ਵਿੱਚ ${d} ਵਾਲਾ reference type ਕਿਹੜਾ ਹੈ?`, `ਦਿੱਤੇ copied-formula behavior ਤੋਂ ਸਹੀ reference class ਪਛਾਣੋ: ${d}।`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ reference type ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ ਕਿ ਉਹ ${d}?`];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql012Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = targetFact(question);
  const d = t(fact.description, language);
  const entity = translateOption(fact.entity, language);
  if (question.surfaceMode === "EFFECT_FROM_FEATURE") {
    const ordinal = [1, 3, 5, 7, 9, 11].indexOf(index);
    const hi = [`Excel में ${entity} का मुख्य प्रभाव क्या है?`, `${entity} worksheet data पर क्या करता है?`, `दिए गए feature ${entity} का सही व्यवहार चुनिए।`, `${entity} को लागू करने पर कौन-सा परिणाम अपेक्षित है?`, `Spreadsheet में ${entity} किस कार्य के लिए प्रयोग होता है?`, `${entity} के बारे में सही effect कौन-सा है?`];
    const pa = [`Excel ਵਿੱਚ ${entity} ਦਾ ਮੁੱਖ ਪ੍ਰਭਾਵ ਕੀ ਹੈ?`, `${entity} worksheet data 'ਤੇ ਕੀ ਕਰਦਾ ਹੈ?`, `ਦਿੱਤੇ feature ${entity} ਦਾ ਸਹੀ ਵਿਵਹਾਰ ਚੁਣੋ।`, `${entity} ਲਾਗੂ ਕਰਨ 'ਤੇ ਕਿਹੜਾ ਨਤੀਜਾ ਉਮੀਦ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`, `Spreadsheet ਵਿੱਚ ${entity} ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`, `${entity} ਬਾਰੇ ਸਹੀ effect ਕਿਹੜਾ ਹੈ?`];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [0, 2, 4, 6, 8, 10].indexOf(index);
  const hi = [`कौन-सा Excel feature ${d}?`, `इस worksheet behavior से सही feature पहचानिए: ${d}।`, `${d}—यह किस Excel data operation का प्रभाव है?`, `कौन-सा data-handling feature इस परिणाम से मेल खाता है: ${d}?`, `सही Excel feature चुनिए जो ${d}।`, `दिए गए spreadsheet कार्य ${d} के लिए feature कौन-सा है?`];
  const pa = [`ਕਿਹੜਾ Excel feature ${d}?`, `ਇਸ worksheet behavior ਤੋਂ ਸਹੀ feature ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ Excel data operation ਦਾ ਪ੍ਰਭਾਵ ਹੈ?`, `ਕਿਹੜਾ data-handling feature ਇਸ ਨਤੀਜੇ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ Excel feature ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ spreadsheet ਕੰਮ ${d} ਲਈ feature ਕਿਹੜਾ ਹੈ?`];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql013Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  const hi = [`कौन-सा Excel row/column operation ${d}?`, `इस worksheet effect से सही operation पहचानिए: ${d}।`, `${d}—यह किस row/column setting या action का काम है?`, `सही Excel operation चुनिए जो ${d}।`, `कौन-सा worksheet structure control इस विवरण से मेल खाता है: ${d}?`, `दिए गए प्रभाव ${d} के लिए सही row/column concept कौन-सा है?`, `Excel में ${d}; कौन-सा control उपयोग होगा?`, `इस कार्य को करने वाला worksheet operation चुनिए: ${d}।`, `कौन-सी row/column सुविधा ${d}?`, `दिए गए structure behavior से operation पहचानिए: ${d}।`, `${d} वाला Excel command/setting कौन-सा है?`, `निम्न में से कौन-सा row/column operation इस effect को पैदा करता है: ${d}?`];
  const pa = [`ਕਿਹੜਾ Excel row/column operation ${d}?`, `ਇਸ worksheet effect ਤੋਂ ਸਹੀ operation ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੀ row/column setting ਜਾਂ action ਦਾ ਕੰਮ ਹੈ?`, `ਸਹੀ Excel operation ਚੁਣੋ ਜੋ ${d}।`, `ਕਿਹੜਾ worksheet structure control ਇਸ ਵਰਣਨ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਦਿੱਤੇ ਪ੍ਰਭਾਵ ${d} ਲਈ ਸਹੀ row/column concept ਕਿਹੜਾ ਹੈ?`, `Excel ਵਿੱਚ ${d}; ਕਿਹੜਾ control ਵਰਤਿਆ ਜਾਵੇਗਾ?`, `ਇਹ ਕੰਮ ਕਰਨ ਵਾਲਾ worksheet operation ਚੁਣੋ: ${d}।`, `ਕਿਹੜੀ row/column ਸੁਵਿਧਾ ${d}?`, `ਦਿੱਤੇ structure behavior ਤੋਂ operation ਪਛਾਣੋ: ${d}।`, `${d} ਵਾਲਾ Excel command/setting ਕਿਹੜਾ ਹੈ?`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ row/column operation ਇਹ effect ਪੈਦਾ ਕਰਦਾ ਹੈ: ${d}?`];
  return (language === "hi" ? hi : pa)[index]!;
}

function ql014Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  const hi = [`कौन-सा chart type सामान्यतः ${d}?`, `इस basic visualization purpose के लिए उपयुक्त chart पहचानिए: ${d}।`, `${d}—यह किस chart का सामान्य उपयोग है?`, `Excel में कौन-सा chart type इस उद्देश्य के लिए प्रचलित है: ${d}?`, `सही chart चुनिए जो सामान्यतः ${d}।`, `इस chart-purpose pairing में सही chart कौन-सा है: ${d}?`, `दिए गए visualization goal ${d} के लिए कौन-सा chart उपयुक्त है?`, `कौन-सा Excel chart इस उपयोग से सबसे सीधे जुड़ा है: ${d}?`, `${d} वाला basic chart type चुनिए।`, `इस data-view उद्देश्य के लिए chart type पहचानिए: ${d}।`, `निम्न में से कौन-सा chart सामान्यतः ${d}?`, `मानक chart use-case ${d} के साथ कौन-सा chart मेल खाता है?`];
  const pa = [`ਕਿਹੜਾ chart type ਆਮ ਤੌਰ 'ਤੇ ${d}?`, `ਇਸ basic visualization purpose ਲਈ ਉਚਿਤ chart ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ chart ਦੀ ਆਮ ਵਰਤੋਂ ਹੈ?`, `Excel ਵਿੱਚ ਕਿਹੜਾ chart type ਇਸ ਉਦੇਸ਼ ਲਈ ਪ੍ਰਚਲਿਤ ਹੈ: ${d}?`, `ਸਹੀ chart ਚੁਣੋ ਜੋ ਆਮ ਤੌਰ 'ਤੇ ${d}।`, `ਇਸ chart-purpose pairing ਵਿੱਚ ਸਹੀ chart ਕਿਹੜਾ ਹੈ: ${d}?`, `ਦਿੱਤੇ visualization goal ${d} ਲਈ ਕਿਹੜਾ chart ਉਚਿਤ ਹੈ?`, `ਕਿਹੜਾ Excel chart ਇਸ ਵਰਤੋਂ ਨਾਲ ਸਭ ਤੋਂ ਸਿੱਧੇ ਜੁੜਿਆ ਹੈ: ${d}?`, `${d} ਵਾਲਾ basic chart type ਚੁਣੋ।`, `ਇਸ data-view ਉਦੇਸ਼ ਲਈ chart type ਪਛਾਣੋ: ${d}।`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ chart ਆਮ ਤੌਰ 'ਤੇ ${d}?`, `ਮਿਆਰੀ chart use-case ${d} ਨਾਲ ਕਿਹੜਾ chart ਮਿਲਦਾ ਹੈ?`];
  return (language === "hi" ? hi : pa)[index]!;
}

function localizedStem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  switch (question.qlId) {
    case "COM-003-QL-010": return ql010Stem(question, language, index);
    case "COM-003-QL-011": return ql011Stem(question, language, index);
    case "COM-003-QL-012": return ql012Stem(question, language, index);
    case "COM-003-QL-013": return ql013Stem(question, language, index);
    case "COM-003-QL-014": return ql014Stem(question, language, index);
    default: throw new Error(`Unsupported COM-003 Wave-3 QL ${question.qlId}`);
  }
}

function localizedExplanation(question: Com003ReviewQuestion, language: Com003TargetLanguage, answer: string, index: number) {
  const d = t(targetFact(question).description, language);
  const prefix = lead(language, index);
  if (language === "hi") {
    if (question.qlId === "COM-003-QL-010" && question.surfaceMode === "AUTOSUM_IDENTIFICATION") return `${prefix}, ${answer} सही उत्तर है; AutoSum detected या selected range पर जल्दी से SUM formula insert करता है।`;
    if (question.qlId === "COM-003-QL-011" && question.surfaceMode === "REFERENCE_NOTATION_CLASSIFICATION") return `${prefix}, ${answer} सही है; इसमें column और row दोनों absolute रहते हैं और दोनों के साथ dollar sign होता है।`;
    if (question.qlId === "COM-003-QL-012" && question.surfaceMode === "EFFECT_FROM_FEATURE") return `${prefix}, ${answer} सही है; यही संबंधित Excel feature का canonical data-handling effect है।`;
    return `${prefix}, ${answer} सही उत्तर है क्योंकि canonical fact के अनुसार यह ${d}।`;
  }
  if (question.qlId === "COM-003-QL-010" && question.surfaceMode === "AUTOSUM_IDENTIFICATION") return `${prefix}, ${answer} ਸਹੀ ਉੱਤਰ ਹੈ; AutoSum detected ਜਾਂ selected range 'ਤੇ ਤੇਜ਼ੀ ਨਾਲ SUM formula insert ਕਰਦਾ ਹੈ।`;
  if (question.qlId === "COM-003-QL-011" && question.surfaceMode === "REFERENCE_NOTATION_CLASSIFICATION") return `${prefix}, ${answer} ਸਹੀ ਹੈ; ਇਸ ਵਿੱਚ column ਅਤੇ row ਦੋਵੇਂ absolute ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਦੋਵਾਂ ਨਾਲ dollar sign ਹੁੰਦਾ ਹੈ।`;
  if (question.qlId === "COM-003-QL-012" && question.surfaceMode === "EFFECT_FROM_FEATURE") return `${prefix}, ${answer} ਸਹੀ ਹੈ; ਇਹੀ ਸੰਬੰਧਿਤ Excel feature ਦਾ canonical data-handling effect ਹੈ।`;
  return `${prefix}, ${answer} ਸਹੀ ਉੱਤਰ ਹੈ ਕਿਉਂਕਿ canonical fact ਅਨੁਸਾਰ ਇਹ ${d}।`;
}

function buildWave3(language: Com003TargetLanguage): readonly Com003LocalizedQuestionV1[] {
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) throw new Error("COM-003 English must be frozen before Wave-3 localization.");
  if (!COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1.governance.waveLocalizationFrozen) throw new Error("COM-003 Wave-2 must be frozen before Wave-3 authoring.");
  const sourceQuestions = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) => WAVE3_QL_SET.has(question.qlId));
  if (sourceQuestions.length !== 60) throw new Error(`COM-003 Wave-3 expected 60 English sources, found ${sourceQuestions.length}`);
  return sourceQuestions.map((source, globalIndex) => {
    const index = globalIndex % 12;
    targetFact(source);
    const options = source.options.map((option) => translateOption(option, language));
    const canonicalAnswer = options[source.correctIndex]!;
    return Object.freeze({
      localizationId: `${source.questionId}:${locale(language)}:AUTHORED-W3-V1`,
      sourceQuestionId: source.questionId,
      qlId: source.qlId,
      cpId: source.cpId,
      surfaceMode: source.surfaceMode,
      targetFactId: source.targetFactId,
      language,
      locale: locale(language),
      stem: localizedStem(source, language, index),
      options,
      correctIndex: source.correctIndex,
      canonicalAnswer,
      explanation: localizedExplanation(source, language, canonicalAnswer, index),
      sourceIds: [...source.sourceIds],
      sourceFactIds: [...source.sourceFactIds],
      versionScoped: source.versionScoped,
      solverAuthority: "CANONICAL_FACT_RELATION" as const,
      sourceEnglishFrozen: true as const,
      localizationReviewOnly: true as const,
      localizationFrozen: false as const,
      runtimeRegistered: false as const,
      productionReleased: false as const,
    });
  });
}

export const COM003_HINDI_LOCALIZATION_WAVE3_V1 = Object.freeze(buildWave3("hi"));
export const COM003_PUNJABI_LOCALIZATION_WAVE3_V1 = Object.freeze(buildWave3("pa"));

export const COM003_LOCALIZATION_WAVE3_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-WAVE3-AUTHORED-V1" as const,
  englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  previousWaveFreezeAuthorityId: COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1.authorityId,
  qlIds: Object.freeze([...WAVE3_QL_IDS]),
  englishSourceQuestionCount: 60,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE3_V1.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE3_V1.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE3_V1.length + COM003_PUNJABI_LOCALIZATION_WAVE3_V1.length,
  authoredFromCanonicalFactIds: true,
  protectedFormulaFunctionTokensPreserved: true,
  optionOrderPreserved: true,
  correctIndexPreserved: true,
  provenancePreserved: true,
  localizationFrozen: false,
  runtimeRegistered: false,
  questionStudioRegistrationAuthorized: false,
  automaticPublicationAuthorized: false,
  nextGate: "COM003_LOCALIZATION_WAVE3_SEMANTIC_EDITORIAL_AUDIT_V1" as const,
});
