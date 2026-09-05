import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import type { Com003ReviewQuestion } from "./com003-review-types";
import type { Com003TargetLanguage, Com003TargetLocale } from "./com003-localization-packet-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

type Bilingual = { hi: string; pa: string };
type Wave2Fact = { entity: string; description: Bilingual; cue?: Bilingual };

const WAVE2_QL_IDS = [
  "COM-003-QL-005",
  "COM-003-QL-006",
  "COM-003-QL-007",
  "COM-003-QL-008",
  "COM-003-QL-009",
] as const;
const WAVE2_QL_SET = new Set<string>(WAVE2_QL_IDS);

const TERM_TRANSLATIONS: Record<string, Bilingual> = {
  "Find": { hi: "Find (खोजें)", pa: "Find (ਖੋਜ)" },
  "Replace": { hi: "Replace (बदलें)", pa: "Replace (ਬਦਲੋ)" },
  "Spelling check": { hi: "Spelling Check (वर्तनी जाँच)", pa: "Spelling Check (ਸ਼ਬਦ-ਜੋੜ ਜਾਂਚ)" },
  "Grammar check": { hi: "Grammar Check (व्याकरण जाँच)", pa: "Grammar Check (ਵਿਆਕਰਨ ਜਾਂਚ)" },
  "AutoCorrect": { hi: "AutoCorrect (स्वतः सुधार)", pa: "AutoCorrect (ਆਟੋ-ਕਰੈਕਟ)" },
  "Header": { hi: "Header (हेडर)", pa: "Header (ਹੈਡਰ)" },
  "Footer": { hi: "Footer (फुटर)", pa: "Footer (ਫੁਟਰ)" },
  "Page number": { hi: "Page Number (पृष्ठ संख्या)", pa: "Page Number (ਪੰਨਾ ਨੰਬਰ)" },
  "Portrait orientation": { hi: "Portrait orientation (पोर्ट्रेट अभिविन्यास)", pa: "Portrait orientation (ਪੋਰਟ੍ਰੇਟ ਦਿਸ਼ਾ)" },
  "Landscape orientation": { hi: "Landscape orientation (लैंडस्केप अभिविन्यास)", pa: "Landscape orientation (ਲੈਂਡਸਕੇਪ ਦਿਸ਼ਾ)" },
  "Portrait": { hi: "Portrait (पोर्ट्रेट)", pa: "Portrait (ਪੋਰਟ੍ਰੇਟ)" },
  "Landscape": { hi: "Landscape (लैंडस्केप)", pa: "Landscape (ਲੈਂਡਸਕੇਪ)" },
  "Mail merge": { hi: "Mail Merge (मेल मर्ज)", pa: "Mail Merge (ਮੇਲ ਮਰਜ)" },
  "Main document": { hi: "Main Document (मुख्य दस्तावेज़)", pa: "Main Document (ਮੁੱਖ ਦਸਤਾਵੇਜ਼)" },
  "Data source": { hi: "Data Source (डेटा स्रोत)", pa: "Data Source (ਡਾਟਾ ਸਰੋਤ)" },
  "Merge field": { hi: "Merge Field (मर्ज फ़ील्ड)", pa: "Merge Field (ਮਰਜ ਫੀਲਡ)" },
  "Recipient record": { hi: "Recipient Record (प्राप्तकर्ता रिकॉर्ड)", pa: "Recipient Record (ਪ੍ਰਾਪਤਕਰਤਾ ਰਿਕਾਰਡ)" },
  "Workbook": { hi: "Workbook (वर्कबुक)", pa: "Workbook (ਵਰਕਬੁੱਕ)" },
  "Worksheet": { hi: "Worksheet (वर्कशीट)", pa: "Worksheet (ਵਰਕਸ਼ੀਟ)" },
  "Row": { hi: "Row (पंक्ति)", pa: "Row (ਕਤਾਰ)" },
  "Column": { hi: "Column (स्तंभ)", pa: "Column (ਕਾਲਮ)" },
  "Cell": { hi: "Cell (सेल)", pa: "Cell (ਸੈੱਲ)" },
};

const DESCRIPTION_TRANSLATIONS: Record<string, Bilingual> = {
  "locates specified text without requiring it to be changed": {
    hi: "निर्दिष्ट टेक्स्ट को खोजता है, लेकिन उसे बदलना आवश्यक नहीं होता",
    pa: "ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਨੂੰ ਲੱਭਦਾ ਹੈ, ਪਰ ਉਸਨੂੰ ਬਦਲਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੁੰਦਾ",
  },
  "locates specified text and substitutes replacement text": {
    hi: "निर्दिष्ट टेक्स्ट को खोजकर उसकी जगह नया टेक्स्ट रखता है",
    pa: "ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਨੂੰ ਲੱਭ ਕੇ ਉਸਦੀ ਥਾਂ ਨਵਾਂ ਟੈਕਸਟ ਰੱਖਦਾ ਹੈ",
  },
  "identifies potential spelling errors for review": {
    hi: "संभावित वर्तनी त्रुटियों को समीक्षा के लिए पहचानता है",
    pa: "ਸੰਭਾਵਿਤ ਸ਼ਬਦ-ਜੋੜ ਗਲਤੀਆਂ ਨੂੰ ਸਮੀਖਿਆ ਲਈ ਪਛਾਣਦਾ ਹੈ",
  },
  "identifies potential grammatical issues for review": {
    hi: "संभावित व्याकरण संबंधी समस्याओं को समीक्षा के लिए पहचानता है",
    pa: "ਸੰਭਾਵਿਤ ਵਿਆਕਰਨਕ ਸਮੱਸਿਆਵਾਂ ਨੂੰ ਸਮੀਖਿਆ ਲਈ ਪਛਾਣਦਾ ਹੈ",
  },
  "automatically corrects configured/common typing and capitalization patterns": {
    hi: "कॉन्फ़िगर किए गए या सामान्य टाइपिंग और capitalization पैटर्न को स्वतः ठीक करता है",
    pa: "ਕੰਫਿਗਰ ਕੀਤੇ ਜਾਂ ਆਮ ਟਾਈਪਿੰਗ ਅਤੇ capitalization ਪੈਟਰਨਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਠੀਕ ਕਰਦਾ ਹੈ",
  },
  "combines a column label with a row number, for example B7": {
    hi: "column label को row number के साथ जोड़ता है, जैसे B7",
    pa: "column label ਨੂੰ row number ਨਾਲ ਜੋੜਦਾ ਹੈ, ਜਿਵੇਂ B7",
  },
  "column label": { hi: "column label", pa: "column label" },
  "row number": { hi: "row number", pa: "row number" },
};

const FACTS: Record<string, Wave2Fact> = {
  "com003-word-find-purpose": {
    entity: "Find",
    description: DESCRIPTION_TRANSLATIONS["locates specified text without requiring it to be changed"]!,
  },
  "com003-word-replace-purpose": {
    entity: "Replace",
    description: DESCRIPTION_TRANSLATIONS["locates specified text and substitutes replacement text"]!,
  },
  "com003-word-spelling-check": {
    entity: "Spelling check",
    description: DESCRIPTION_TRANSLATIONS["identifies potential spelling errors for review"]!,
  },
  "com003-word-grammar-check": {
    entity: "Grammar check",
    description: DESCRIPTION_TRANSLATIONS["identifies potential grammatical issues for review"]!,
  },
  "com003-word-autocorrect-purpose": {
    entity: "AutoCorrect",
    description: DESCRIPTION_TRANSLATIONS["automatically corrects configured/common typing and capitalization patterns"]!,
  },
  "com003-word-header-role": {
    entity: "Header",
    description: {
      hi: "दस्तावेज़ के पृष्ठ के ऊपरी margin क्षेत्र से जुड़ी सामग्री होती है",
      pa: "ਦਸਤਾਵੇਜ਼ ਦੇ ਪੰਨੇ ਦੇ ਉੱਪਰੀ margin ਖੇਤਰ ਨਾਲ ਜੁੜੀ ਸਮੱਗਰੀ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-word-footer-role": {
    entity: "Footer",
    description: {
      hi: "दस्तावेज़ के पृष्ठ के निचले margin क्षेत्र से जुड़ी सामग्री होती है",
      pa: "ਦਸਤਾਵੇਜ਼ ਦੇ ਪੰਨੇ ਦੇ ਹੇਠਲੇ margin ਖੇਤਰ ਨਾਲ ਜੁੜੀ ਸਮੱਗਰੀ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-word-page-number-header-footer": {
    entity: "Page number",
    description: {
      hi: "Header या Footer के भाग के रूप में जोड़ी जा सकती है",
      pa: "Header ਜਾਂ Footer ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਜੋੜੀ ਜਾ ਸਕਦੀ ਹੈ",
    },
  },
  "com003-word-portrait-orientation": {
    entity: "Portrait orientation",
    description: {
      hi: "पृष्ठ की ऊँचाई उसकी चौड़ाई से अधिक होती है",
      pa: "ਪੰਨੇ ਦੀ ਉਚਾਈ ਉਸਦੀ ਚੌੜਾਈ ਨਾਲੋਂ ਵੱਧ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-word-landscape-orientation": {
    entity: "Landscape orientation",
    description: {
      hi: "पृष्ठ की चौड़ाई उसकी ऊँचाई से अधिक होती है",
      pa: "ਪੰਨੇ ਦੀ ਚੌੜਾਈ ਉਸਦੀ ਉਚਾਈ ਨਾਲੋਂ ਵੱਧ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-word-mail-merge-purpose": {
    entity: "Mail merge",
    description: {
      hi: "मुख्य दस्तावेज़ को recipient/data-source जानकारी के साथ जोड़कर व्यक्तिगत output बनाता है",
      pa: "ਮੁੱਖ ਦਸਤਾਵੇਜ਼ ਨੂੰ recipient/data-source ਜਾਣਕਾਰੀ ਨਾਲ ਜੋੜ ਕੇ ਵਿਅਕਤੀਗਤ output ਬਣਾਉਂਦਾ ਹੈ",
    },
  },
  "com003-word-mail-merge-main-document": {
    entity: "Main document",
    description: {
      hi: "merged outputs में साझा टेक्स्ट और layout रखता है",
      pa: "merged outputs ਵਿੱਚ ਸਾਂਝਾ ਟੈਕਸਟ ਅਤੇ layout ਰੱਖਦਾ ਹੈ",
    },
  },
  "com003-word-mail-merge-data-source": {
    entity: "Data source",
    description: {
      hi: "merge के दौरान recipient-specific records या values उपलब्ध कराता है",
      pa: "merge ਦੌਰਾਨ recipient-specific records ਜਾਂ values ਮੁਹੱਈਆ ਕਰਦਾ ਹੈ",
    },
  },
  "com003-word-mail-merge-merge-field": {
    entity: "Merge field",
    description: {
      hi: "Main Document में वह स्थान चिन्हित करता है जहाँ Data Source की values डाली जाती हैं",
      pa: "Main Document ਵਿੱਚ ਉਹ ਥਾਂ ਨਿਸ਼ਾਨਿਤ ਕਰਦਾ ਹੈ ਜਿੱਥੇ Data Source ਦੀਆਂ values ਪਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ",
    },
  },
  "com003-word-mail-merge-recipient-record": {
    entity: "Recipient record",
    description: {
      hi: "एक recipient या merged item के field values रखता है",
      pa: "ਇੱਕ recipient ਜਾਂ merged item ਦੇ field values ਰੱਖਦਾ ਹੈ",
    },
  },
  "com003-excel-structure-workbook": {
    entity: "Workbook",
    description: {
      hi: "एक Excel फ़ाइल होती है जिसमें एक या अधिक Worksheets हो सकती हैं",
      pa: "ਇੱਕ Excel ਫਾਈਲ ਹੁੰਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ",
    },
  },
  "com003-excel-structure-worksheet": {
    entity: "Worksheet",
    description: {
      hi: "Workbook के भीतर rows और columns से बनी spreadsheet sheet होती है",
      pa: "Workbook ਦੇ ਅੰਦਰ rows ਅਤੇ columns ਤੋਂ ਬਣੀ spreadsheet sheet ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-excel-structure-row": {
    entity: "Row",
    description: {
      hi: "Worksheet में cells की क्षैतिज पंक्ति होती है",
      pa: "Worksheet ਵਿੱਚ cells ਦੀ ਖਿਤਿਜੀ ਕਤਾਰ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-excel-structure-column": {
    entity: "Column",
    description: {
      hi: "Worksheet में cells की ऊर्ध्वाधर पंक्ति होती है",
      pa: "Worksheet ਵਿੱਚ cells ਦੀ ਲੰਬਕਾਰੀ ਕਤਾਰ ਹੁੰਦੀ ਹੈ",
    },
  },
  "com003-excel-structure-cell": {
    entity: "Cell",
    description: {
      hi: "Row और Column का प्रतिच्छेद होता है",
      pa: "Row ਅਤੇ Column ਦਾ ਕੱਟ-ਬਿੰਦੂ ਹੁੰਦਾ ਹੈ",
    },
  },
  "com003-excel-address-composition": {
    entity: "Excel cell address",
    description: DESCRIPTION_TRANSLATIONS["combines a column label with a row number, for example B7"]!,
    cue: { hi: "Excel cell address", pa: "Excel cell address" },
  },
  "com003-excel-address-column-part": {
    entity: "The B in cell reference B7",
    description: DESCRIPTION_TRANSLATIONS["column label"]!,
    cue: { hi: "cell reference B7 में B", pa: "cell reference B7 ਵਿੱਚ B" },
  },
  "com003-excel-address-row-part": {
    entity: "The 7 in cell reference B7",
    description: DESCRIPTION_TRANSLATIONS["row number"]!,
    cue: { hi: "cell reference B7 में 7", pa: "cell reference B7 ਵਿੱਚ 7" },
  },
  "com003-excel-range-notation": {
    entity: "A1:A5",
    description: {
      hi: "A1 से A5 तक का लगातार cell range",
      pa: "A1 ਤੋਂ A5 ਤੱਕ ਦਾ ਲਗਾਤਾਰ cell range",
    },
  },
  "com003-excel-formula-equals": {
    entity: "Excel formula",
    description: {
      hi: "सामान्यतः equal sign (=) से शुरू होता है",
      pa: "ਆਮ ਤੌਰ 'ਤੇ equal sign (=) ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ",
    },
  },
  "com003-excel-operator-addition": {
    entity: "+",
    description: { hi: "जोड़", pa: "ਜੋੜ" },
  },
  "com003-excel-operator-subtraction": {
    entity: "-",
    description: { hi: "घटाव", pa: "ਘਟਾਉ" },
  },
  "com003-excel-operator-multiplication": {
    entity: "*",
    description: { hi: "गुणा", pa: "ਗੁਣਾ" },
  },
  "com003-excel-operator-division": {
    entity: "/",
    description: { hi: "भाग", pa: "ਭਾਗ" },
  },
};

function locale(language: Com003TargetLanguage): Com003TargetLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function text(value: Bilingual, language: Com003TargetLanguage) {
  return value[language];
}

function localizedTerm(value: string, language: Com003TargetLanguage) {
  const translatedTerm = TERM_TRANSLATIONS[value];
  if (translatedTerm) return text(translatedTerm, language);
  const translatedDescription = DESCRIPTION_TRANSLATIONS[value];
  if (translatedDescription) return text(translatedDescription, language);
  if (/^(?:[=+\-*/]|\$?[A-Z]\$?\d+(?::\$?[A-Z]\$?\d+)?)$/i.test(value)) return value;
  throw new Error(`COM-003 Wave-2 missing option translation: ${value}`);
}

function factFor(question: Com003ReviewQuestion) {
  const fact = FACTS[question.targetFactId];
  if (!fact) throw new Error(`COM-003 Wave-2 missing target fact localization: ${question.targetFactId}`);
  return fact;
}

function localizedEntity(fact: Wave2Fact, language: Com003TargetLanguage) {
  return localizedTerm(fact.entity, language);
}

const HI_REASONING = [
  "इस तथ्य के आधार पर",
  "दी गई परिभाषा के अनुसार",
  "मुख्य कार्य को देखते हुए",
  "मानक Office अवधारणा में",
  "सही मिलान करने पर",
  "प्रश्न के संकेत से",
  "उपयोग की दृष्टि से",
  "तकनीकी परिभाषा के अनुसार",
  "विकल्पों की तुलना करने पर",
  "यहाँ निर्णायक संकेत यह है कि",
  "Computer Awareness संदर्भ में",
  "मानक शब्दावली के अनुसार",
];
const PA_REASONING = [
  "ਇਸ ਤੱਥ ਦੇ ਆਧਾਰ 'ਤੇ",
  "ਦਿੱਤੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ",
  "ਮੁੱਖ ਕੰਮ ਨੂੰ ਵੇਖਦਿਆਂ",
  "ਮਿਆਰੀ Office ਧਾਰਣਾ ਵਿੱਚ",
  "ਸਹੀ ਮਿਲਾਣ ਕਰਨ 'ਤੇ",
  "ਪ੍ਰਸ਼ਨ ਦੇ ਸੰਕੇਤ ਤੋਂ",
  "ਵਰਤੋਂ ਦੇ ਆਧਾਰ 'ਤੇ",
  "ਤਕਨੀਕੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ",
  "ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ 'ਤੇ",
  "ਇੱਥੇ ਨਿਰਣਾਇਕ ਸੰਕੇਤ ਇਹ ਹੈ ਕਿ",
  "Computer Awareness ਸੰਦਰਭ ਵਿੱਚ",
  "ਮਿਆਰੀ ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰ",
];

function reasoning(language: Com003TargetLanguage, index: number) {
  return (language === "hi" ? HI_REASONING : PA_REASONING)[index % 12]!;
}

function ql005Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = factFor(question);
  const desc = text(fact.description, language);
  const entity = localizedEntity(fact, language);
  const variant = Math.floor(index / 2) % 6;
  if (question.surfaceMode === "FEATURE_FROM_PURPOSE") {
    const hi = [
      `Microsoft Word में कौन-सा फीचर ${desc}?`,
      `उस Word फीचर की पहचान कीजिए जो ${desc}।`,
      `${desc}—इस कार्य के लिए सही Word फीचर कौन-सा है?`,
      `दिए गए कार्य के अनुसार कौन-सा Word टूल सही है: ${desc}?`,
      `Word में ${desc} वाला फीचर चुनिए।`,
      `कौन-सा proofing/search फीचर ${desc}?`,
    ];
    const pa = [
      `Microsoft Word ਵਿੱਚ ਕਿਹੜਾ ਫੀਚਰ ${desc}?`,
      `ਉਹ Word ਫੀਚਰ ਪਛਾਣੋ ਜੋ ${desc}।`,
      `${desc}—ਇਸ ਕੰਮ ਲਈ ਸਹੀ Word ਫੀਚਰ ਕਿਹੜਾ ਹੈ?`,
      `ਦਿੱਤੇ ਕੰਮ ਅਨੁਸਾਰ ਕਿਹੜਾ Word ਟੂਲ ਸਹੀ ਹੈ: ${desc}?`,
      `Word ਵਿੱਚ ${desc} ਵਾਲਾ ਫੀਚਰ ਚੁਣੋ।`,
      `ਕਿਹੜਾ proofing/search ਫੀਚਰ ${desc}?`,
    ];
    return (language === "hi" ? hi : pa)[variant]!;
  }
  const hi = [
    `Microsoft Word में ${entity} का मुख्य कार्य क्या है?`,
    `${entity} किस कार्य के लिए प्रयोग किया जाता है?`,
    `${entity} के बारे में सही कार्य-विवरण कौन-सा है?`,
    `Word में ${entity} क्या करता है?`,
    `निम्न में से कौन-सा विवरण ${entity} से सही मेल खाता है?`,
    `${entity} का सही उपयोग चुनिए।`,
  ];
  const pa = [
    `Microsoft Word ਵਿੱਚ ${entity} ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?`,
    `${entity} ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
    `${entity} ਬਾਰੇ ਸਹੀ ਕੰਮ-ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`,
    `Word ਵਿੱਚ ${entity} ਕੀ ਕਰਦਾ ਹੈ?`,
    `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਰਣਨ ${entity} ਨਾਲ ਸਹੀ ਮਿਲਦਾ ਹੈ?`,
    `${entity} ਦੀ ਸਹੀ ਵਰਤੋਂ ਚੁਣੋ।`,
  ];
  return (language === "hi" ? hi : pa)[variant]!;
}

function ql006Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = factFor(question);
  const desc = text(fact.description, language);
  const variant = Math.floor(index / 2) % 6;
  if (question.surfaceMode === "ORIENTATION_FROM_DIMENSIONS") {
    const hi = [
      `कौन-सा page orientation उस पृष्ठ को दर्शाता है जिसमें ${desc}?`,
      `${desc}—यह किस page orientation की पहचान है?`,
      `Word में उस orientation का नाम बताइए जिसमें ${desc}।`,
      `दिए गए page shape के लिए सही orientation चुनिए: ${desc}।`,
      `यदि ${desc}, तो page orientation कौन-सा होगा?`,
      `कौन-सा Word orientation इस dimension संबंध से मेल खाता है: ${desc}?`,
    ];
    const pa = [
      `ਕਿਹੜਾ page orientation ਉਸ ਪੰਨੇ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ${desc}?`,
      `${desc}—ਇਹ ਕਿਹੜੇ page orientation ਦੀ ਪਛਾਣ ਹੈ?`,
      `Word ਵਿੱਚ ਉਸ orientation ਦਾ ਨਾਮ ਦੱਸੋ ਜਿਸ ਵਿੱਚ ${desc}।`,
      `ਦਿੱਤੇ page shape ਲਈ ਸਹੀ orientation ਚੁਣੋ: ${desc}।`,
      `ਜੇ ${desc}, ਤਾਂ page orientation ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
      `ਕਿਹੜਾ Word orientation ਇਸ dimension ਸੰਬੰਧ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${desc}?`,
    ];
    return (language === "hi" ? hi : pa)[variant]!;
  }
  const hi = [
    `Microsoft Word में कौन-सा page element ${desc}?`,
    `${desc}—यह किस Word page element की भूमिका है?`,
    `दिए गए कार्य से सही page feature पहचानिए: ${desc}।`,
    `कौन-सा page-layout element इस विवरण से मेल खाता है: ${desc}?`,
    `Word में उस page feature का नाम चुनिए जो ${desc}।`,
    `निम्न में से कौन-सा page element ${desc}?`,
  ];
  const pa = [
    `Microsoft Word ਵਿੱਚ ਕਿਹੜਾ page element ${desc}?`,
    `${desc}—ਇਹ ਕਿਹੜੇ Word page element ਦੀ ਭੂਮਿਕਾ ਹੈ?`,
    `ਦਿੱਤੇ ਕੰਮ ਤੋਂ ਸਹੀ page feature ਪਛਾਣੋ: ${desc}।`,
    `ਕਿਹੜਾ page-layout element ਇਸ ਵਰਣਨ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${desc}?`,
    `Word ਵਿੱਚ ਉਸ page feature ਦਾ ਨਾਮ ਚੁਣੋ ਜੋ ${desc}।`,
    `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ page element ${desc}?`,
  ];
  return (language === "hi" ? hi : pa)[variant]!;
}

const QL007_HI = [
  (d: string, k: string) => `कौन-सा ${k} ${d}?`,
  (d: string, k: string) => `${d}—यह किस ${k} का सही वर्णन है?`,
  (d: string, k: string) => `दिए गए कार्य से ${k} पहचानिए: ${d}।`,
  (d: string, k: string) => `Mail Merge संदर्भ में कौन-सा ${k} इस भूमिका से मेल खाता है: ${d}?`,
  (d: string, k: string) => `सही ${k} चुनिए जो ${d}।`,
  (d: string, k: string) => `${d} वाला ${k} कौन-सा है?`,
  (d: string, k: string) => `इस भूमिका के लिए उपयुक्त ${k} चुनिए: ${d}।`,
  (d: string, k: string) => `Word Mail Merge में ${d}; यह किस ${k} को दर्शाता है?`,
  (d: string, k: string) => `निम्न में से कौन-सा ${k} दिए विवरण से सही मेल खाता है: ${d}?`,
  (d: string, k: string) => `इस कार्य-विवरण का सही ${k} कौन-सा है: ${d}?`,
  (d: string, k: string) => `${d}—सही Mail Merge ${k} बताइए।`,
  (d: string, k: string) => `किस ${k} की मानक भूमिका यह है: ${d}?`,
];
const QL007_PA = [
  (d: string, k: string) => `ਕਿਹੜਾ ${k} ${d}?`,
  (d: string, k: string) => `${d}—ਇਹ ਕਿਹੜੇ ${k} ਦਾ ਸਹੀ ਵਰਣਨ ਹੈ?`,
  (d: string, k: string) => `ਦਿੱਤੇ ਕੰਮ ਤੋਂ ${k} ਪਛਾਣੋ: ${d}।`,
  (d: string, k: string) => `Mail Merge ਸੰਦਰਭ ਵਿੱਚ ਕਿਹੜਾ ${k} ਇਸ ਭੂਮਿਕਾ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`,
  (d: string, k: string) => `ਸਹੀ ${k} ਚੁਣੋ ਜੋ ${d}।`,
  (d: string, k: string) => `${d} ਵਾਲਾ ${k} ਕਿਹੜਾ ਹੈ?`,
  (d: string, k: string) => `ਇਸ ਭੂਮਿਕਾ ਲਈ ਉਚਿਤ ${k} ਚੁਣੋ: ${d}।`,
  (d: string, k: string) => `Word Mail Merge ਵਿੱਚ ${d}; ਇਹ ਕਿਹੜੇ ${k} ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (d: string, k: string) => `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ${k} ਦਿੱਤੇ ਵਰਣਨ ਨਾਲ ਸਹੀ ਮਿਲਦਾ ਹੈ: ${d}?`,
  (d: string, k: string) => `ਇਸ ਕੰਮ-ਵਰਣਨ ਦਾ ਸਹੀ ${k} ਕਿਹੜਾ ਹੈ: ${d}?`,
  (d: string, k: string) => `${d}—ਸਹੀ Mail Merge ${k} ਦੱਸੋ।`,
  (d: string, k: string) => `ਕਿਸ ${k} ਦੀ ਮਿਆਰੀ ਭੂਮਿਕਾ ਇਹ ਹੈ: ${d}?`,
];

function ql007Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = factFor(question);
  const desc = text(fact.description, language);
  const kind = question.surfaceMode === "FEATURE_FROM_PURPOSE"
    ? (language === "hi" ? "Word फीचर" : "Word ਫੀਚਰ")
    : (language === "hi" ? "Mail Merge घटक" : "Mail Merge ਘਟਕ");
  return (language === "hi" ? QL007_HI : QL007_PA)[index]!(desc, kind);
}

function ql008Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = factFor(question);
  const desc = text(fact.description, language);
  const variant = Math.floor(index / 3) % 4;
  if (question.surfaceMode === "STRUCTURE_TERM_FROM_DEFINITION") {
    const hi = [
      `Excel का कौन-सा structure term इस परिभाषा से मेल खाता है: ${desc}?`,
      `${desc}—यह किस spreadsheet term की परिभाषा है?`,
      `दिए गए विवरण के लिए सही Excel structure item चुनिए: ${desc}।`,
      `कौन-सा Workbook/Worksheet term इस वर्णन से सही मेल खाता है: ${desc}?`,
    ];
    const pa = [
      `Excel ਦਾ ਕਿਹੜਾ structure term ਇਸ ਪਰਿਭਾਸ਼ਾ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${desc}?`,
      `${desc}—ਇਹ ਕਿਹੜੇ spreadsheet term ਦੀ ਪਰਿਭਾਸ਼ਾ ਹੈ?`,
      `ਦਿੱਤੇ ਵਰਣਨ ਲਈ ਸਹੀ Excel structure item ਚੁਣੋ: ${desc}।`,
      `ਕਿਹੜਾ Workbook/Worksheet term ਇਸ ਵਰਣਨ ਨਾਲ ਸਹੀ ਮਿਲਦਾ ਹੈ: ${desc}?`,
    ];
    return (language === "hi" ? hi : pa)[variant]!;
  }
  if (question.surfaceMode === "CELL_ADDRESS_INTERPRETATION") {
    const cue = fact.cue ? text(fact.cue, language) : fact.entity;
    const hi = [
      `Excel में ${cue} का सही अर्थ क्या है?`,
      `${cue} किस cell-reference अवधारणा को दर्शाता है?`,
      `${cue} की सही व्याख्या चुनिए।`,
      `A1-style reference में ${cue} का क्या अर्थ है?`,
    ];
    const pa = [
      `Excel ਵਿੱਚ ${cue} ਦਾ ਸਹੀ ਅਰਥ ਕੀ ਹੈ?`,
      `${cue} ਕਿਹੜੀ cell-reference ਧਾਰਣਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
      `${cue} ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਚੁਣੋ।`,
      `A1-style reference ਵਿੱਚ ${cue} ਦਾ ਕੀ ਅਰਥ ਹੈ?`,
    ];
    return (language === "hi" ? hi : pa)[variant]!;
  }
  const hi = [
    `कौन-सा Excel notation ${desc} को दर्शाता है?`,
    `${desc} के लिए सही range notation चुनिए।`,
    `दिए गए continuous cell range को किस reference से लिखा जाता है: ${desc}?`,
    `${desc} को सही रूप में व्यक्त करने वाला Excel reference कौन-सा है?`,
  ];
  const pa = [
    `ਕਿਹੜਾ Excel notation ${desc} ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
    `${desc} ਲਈ ਸਹੀ range notation ਚੁਣੋ।`,
    `ਦਿੱਤੇ continuous cell range ਨੂੰ ਕਿਹੜੇ reference ਨਾਲ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ: ${desc}?`,
    `${desc} ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਣ ਵਾਲਾ Excel reference ਕਿਹੜਾ ਹੈ?`,
  ];
  return (language === "hi" ? hi : pa)[variant]!;
}

const QL009_PREFIX_HI = [
  "Excel formula सामान्यतः किस symbol से शुरू होता है?",
  "किस character से Excel को पता चलता है कि entry एक formula है?",
  "सामान्य Excel formula दर्ज करते समय पहला symbol कौन-सा होता है?",
  "Excel में formula-prefix के रूप में सामान्यतः कौन-सा symbol प्रयोग होता है?",
];
const QL009_PREFIX_PA = [
  "Excel formula ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੇ symbol ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?",
  "ਕਿਹੜੇ character ਨਾਲ Excel ਨੂੰ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ entry ਇੱਕ formula ਹੈ?",
  "ਆਮ Excel formula ਦਰਜ ਕਰਦੇ ਸਮੇਂ ਪਹਿਲਾ symbol ਕਿਹੜਾ ਹੁੰਦਾ ਹੈ?",
  "Excel ਵਿੱਚ formula-prefix ਵਜੋਂ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜਾ symbol ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
];
const OPERATOR_INDEXES = [1, 2, 4, 5, 7, 8, 10, 11];
const QL009_OPERATOR_HI = [
  (d: string) => `Excel formula में ${d} के लिए कौन-सा arithmetic operator प्रयोग होता है?`,
  (d: string) => `${d} करने के लिए सही Excel symbol चुनिए।`,
  (d: string) => `Excel में ${d} को कौन-सा operator दर्शाता है?`,
  (d: string) => `कौन-सा symbol Excel formula में ${d} कराता है?`,
  (d: string) => `${d} के लिए प्रयुक्त arithmetic operator की पहचान कीजिए।`,
  (d: string) => `Excel formula में ${d} ऑपरेशन किस symbol से किया जाता है?`,
  (d: string) => `दिए गए कार्य ${d} से सही operator का मिलान कीजिए।`,
  (d: string) => `${d} दर्शाने वाला सही Excel arithmetic symbol कौन-सा है?`,
];
const QL009_OPERATOR_PA = [
  (d: string) => `Excel formula ਵਿੱਚ ${d} ਲਈ ਕਿਹੜਾ arithmetic operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  (d: string) => `${d} ਕਰਨ ਲਈ ਸਹੀ Excel symbol ਚੁਣੋ।`,
  (d: string) => `Excel ਵਿੱਚ ${d} ਨੂੰ ਕਿਹੜਾ operator ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (d: string) => `ਕਿਹੜਾ symbol Excel formula ਵਿੱਚ ${d} ਕਰਦਾ ਹੈ?`,
  (d: string) => `${d} ਲਈ ਵਰਤੇ arithmetic operator ਦੀ ਪਛਾਣ ਕਰੋ।`,
  (d: string) => `Excel formula ਵਿੱਚ ${d} operation ਕਿਹੜੇ symbol ਨਾਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`,
  (d: string) => `ਦਿੱਤੇ ਕੰਮ ${d} ਨਾਲ ਸਹੀ operator ਦਾ ਮਿਲਾਣ ਕਰੋ।`,
  (d: string) => `${d} ਦਰਸਾਉਣ ਵਾਲਾ ਸਹੀ Excel arithmetic symbol ਕਿਹੜਾ ਹੈ?`,
];

function ql009Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  if (question.surfaceMode === "FORMULA_PREFIX") {
    const ordinal = [0, 3, 6, 9].indexOf(index);
    if (ordinal < 0) throw new Error(`Unexpected COM-003 QL-009 prefix index ${index}`);
    return (language === "hi" ? QL009_PREFIX_HI : QL009_PREFIX_PA)[ordinal]!;
  }
  const ordinal = OPERATOR_INDEXES.indexOf(index);
  if (ordinal < 0) throw new Error(`Unexpected COM-003 QL-009 operator index ${index}`);
  const desc = text(factFor(question).description, language);
  return (language === "hi" ? QL009_OPERATOR_HI : QL009_OPERATOR_PA)[ordinal]!(desc);
}

function localizedStem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  switch (question.qlId) {
    case "COM-003-QL-005": return ql005Stem(question, language, index);
    case "COM-003-QL-006": return ql006Stem(question, language, index);
    case "COM-003-QL-007": return ql007Stem(question, language, index);
    case "COM-003-QL-008": return ql008Stem(question, language, index);
    case "COM-003-QL-009": return ql009Stem(question, language, index);
    default: throw new Error(`Unsupported COM-003 Wave-2 QL ${question.qlId}`);
  }
}

function localizedExplanation(
  question: Com003ReviewQuestion,
  language: Com003TargetLanguage,
  localizedAnswer: string,
  index: number,
) {
  const fact = factFor(question);
  const desc = text(fact.description, language);
  const lead = reasoning(language, index);
  if (language === "hi") {
    if (question.qlId === "COM-003-QL-009" && question.surfaceMode === "FORMULA_PREFIX") {
      return `${lead}, ${localizedAnswer} सही उत्तर है; सामान्य Excel formula equal sign (=) से शुरू होता है।`;
    }
    if (question.qlId === "COM-003-QL-009") {
      return `${lead}, ${localizedAnswer} सही है; Excel formula में यह symbol ${desc} ऑपरेशन को दर्शाता है।`;
    }
    if (question.qlId === "COM-003-QL-008" && question.surfaceMode === "RANGE_RECOGNITION") {
      return `${lead}, ${localizedAnswer} सही है; यह ${desc} को लिखने का standard range notation है।`;
    }
    return `${lead}, ${localizedAnswer} सही उत्तर है क्योंकि संबंधित अवधारणा ${desc}।`;
  }
  if (question.qlId === "COM-003-QL-009" && question.surfaceMode === "FORMULA_PREFIX") {
    return `${lead}, ${localizedAnswer} ਸਹੀ ਉੱਤਰ ਹੈ; ਆਮ Excel formula equal sign (=) ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।`;
  }
  if (question.qlId === "COM-003-QL-009") {
    return `${lead}, ${localizedAnswer} ਸਹੀ ਹੈ; Excel formula ਵਿੱਚ ਇਹ symbol ${desc} operation ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`;
  }
  if (question.qlId === "COM-003-QL-008" && question.surfaceMode === "RANGE_RECOGNITION") {
    return `${lead}, ${localizedAnswer} ਸਹੀ ਹੈ; ਇਹ ${desc} ਨੂੰ ਲਿਖਣ ਦਾ standard range notation ਹੈ।`;
  }
  return `${lead}, ${localizedAnswer} ਸਹੀ ਉੱਤਰ ਹੈ ਕਿਉਂਕਿ ਸੰਬੰਧਿਤ ਧਾਰਣਾ ${desc}।`;
}

function buildWave2(language: Com003TargetLanguage): readonly Com003LocalizedQuestionV1[] {
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) {
    throw new Error("COM-003 English must remain frozen before Wave-2 localization is built.");
  }
  const sourceQuestions = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) => WAVE2_QL_SET.has(question.qlId));
  if (sourceQuestions.length !== 60) throw new Error(`COM-003 Wave-2 expected 60 English sources, found ${sourceQuestions.length}`);

  return sourceQuestions.map((source, globalIndex) => {
    const index = globalIndex % 12;
    factFor(source);
    const options = source.options.map((option) => localizedTerm(option, language));
    const canonicalAnswer = options[source.correctIndex]!;
    return Object.freeze({
      localizationId: `${source.questionId}:${locale(language)}:AUTHORED-W2-V1`,
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

export const COM003_HINDI_LOCALIZATION_WAVE2_V1 = Object.freeze(buildWave2("hi"));
export const COM003_PUNJABI_LOCALIZATION_WAVE2_V1 = Object.freeze(buildWave2("pa"));

export const COM003_LOCALIZATION_WAVE2_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-WAVE2-AUTHORED-V1" as const,
  englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  qlIds: Object.freeze([...WAVE2_QL_IDS]),
  englishSourceQuestionCount: 60,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V1.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE2_V1.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V1.length + COM003_PUNJABI_LOCALIZATION_WAVE2_V1.length,
  authoredFromCanonicalFactIds: true,
  optionOrderPreserved: true,
  correctIndexPreserved: true,
  provenancePreserved: true,
  sourceEnglishFrozen: true,
  localizationFrozen: false,
  runtimeRegistered: false,
  questionStudioRegistrationAuthorized: false,
  automaticPublicationAuthorized: false,
  nextGate: "COM003_LOCALIZATION_WAVE2_SEMANTIC_EDITORIAL_AUDIT_V1" as const,
});
