import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  lookupCom003OptionTranslationV1,
  type Com003LocalizationLanguageV2,
} from "./com003-localization-translation-memory-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import type { Com003ReviewQuestionV162 } from "./com003-review-synthesis-v16-2";

export type Com003LocalizedQuestionV2 = {
  localizationId: string;
  sourceQuestionId: string;
  sourceEnglishAuthorityId: "COM-003-ENGLISH-FREEZE-V2";
  qlId: string;
  cpId: Com003ReviewQuestionV162["cpId"];
  examSurfaceFamily: Com003ReviewQuestionV162["examSurfaceFamily"];
  surfaceMode: string;
  targetFactId: string;
  language: Com003LocalizationLanguageV2;
  locale: "hi-IN" | "pa-IN";
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  versionScoped: boolean;
  solverAuthority: "CANONICAL_FACT_RELATION";
  sourceEnglishFrozen: true;
  localizationReviewOnly: true;
  localizationFrozen: false;
  runtimeRegistered: false;
  productionReleased: false;
};

type LanguageText = { hi: string; pa: string };
type FactText = {
  entity?: LanguageText;
  purpose?: LanguageText;
  fileType?: LanguageText;
  extension?: string;
  effect?: LanguageText;
  action?: LanguageText;
  explanation: LanguageText;
};

const FACT: Record<string, FactText> = {
  "com003-excel-purpose": {
    purpose: { hi: "स्प्रेडशीट कार्य—डेटा व्यवस्थित करना और गणनाएँ करना", pa: "ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਕੰਮ—ਡਾਟਾ ਵਿਵਸਥਿਤ ਕਰਨਾ ਅਤੇ ਗਣਨਾਵਾਂ ਕਰਨਾ" },
    explanation: { hi: "Microsoft Excel एक स्प्रेडशीट एप्लिकेशन है, जिसका उपयोग डेटा व्यवस्थित करने और गणनाएँ करने के लिए किया जाता है।", pa: "Microsoft Excel ਇੱਕ ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਐਪਲੀਕੇਸ਼ਨ ਹੈ, ਜਿਸਦੀ ਵਰਤੋਂ ਡਾਟਾ ਵਿਵਸਥਿਤ ਕਰਨ ਅਤੇ ਗਣਨਾਵਾਂ ਕਰਨ ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।" },
  },
  "com003-word-purpose": {
    purpose: { hi: "दस्तावेज़ बनाना, संपादित करना और फ़ॉर्मैट करना", pa: "ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣਾ, ਸੰਪਾਦਿਤ ਕਰਨਾ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨਾ" },
    explanation: { hi: "Microsoft Word एक वर्ड-प्रोसेसिंग एप्लिकेशन है, जिसका उपयोग टेक्स्ट दस्तावेज़ बनाने, संपादित करने और फ़ॉर्मैट करने के लिए किया जाता है।", pa: "Microsoft Word ਇੱਕ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਐਪਲੀਕੇਸ਼ਨ ਹੈ, ਜਿਸਦੀ ਵਰਤੋਂ ਟੈਕਸਟ ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ, ਸੰਪਾਦਿਤ ਕਰਨ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨ ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।" },
  },
  "com003-powerpoint-purpose": {
    purpose: { hi: "स्लाइड-आधारित प्रेज़ेंटेशन बनाना", pa: "ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣਾ" },
    explanation: { hi: "Microsoft PowerPoint का उपयोग स्लाइड-आधारित प्रेज़ेंटेशन बनाने के लिए किया जाता है।", pa: "Microsoft PowerPoint ਦੀ ਵਰਤੋਂ ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣ ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।" },
  },
  "com003-word-application-software": {
    entity: { hi: "Microsoft Word", pa: "Microsoft Word" },
    explanation: { hi: "Microsoft Word एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर है; यह सिस्टम सॉफ्टवेयर नहीं है।", pa: "Microsoft Word ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ ਹੈ; ਇਹ ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ਨਹੀਂ ਹੈ।" },
  },
  "com003-excel-application-software": {
    entity: { hi: "Microsoft Excel", pa: "Microsoft Excel" },
    explanation: { hi: "Microsoft Excel एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर है; यह सिस्टम सॉफ्टवेयर नहीं है।", pa: "Microsoft Excel ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ ਹੈ; ਇਹ ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ਨਹੀਂ ਹੈ।" },
  },
  "com003-powerpoint-application-software": {
    entity: { hi: "Microsoft PowerPoint", pa: "Microsoft PowerPoint" },
    explanation: { hi: "Microsoft PowerPoint एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर है; यह सिस्टम सॉफ्टवेयर नहीं है।", pa: "Microsoft PowerPoint ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ ਹੈ; ਇਹ ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ਨਹੀਂ ਹੈ।" },
  },

  "com003-format-docx": { fileType: { hi: "आधुनिक Word दस्तावेज़", pa: "ਆਧੁਨਿਕ Word ਦਸਤਾਵੇਜ਼" }, extension: ".docx", explanation: { hi: ".docx आधुनिक Word दस्तावेज़ का फ़ाइल एक्सटेंशन है।", pa: ".docx ਆਧੁਨਿਕ Word ਦਸਤਾਵੇਜ਼ ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਹੈ।" } },
  "com003-format-ppt": { fileType: { hi: "PowerPoint 97-2003 प्रेज़ेंटेशन", pa: "PowerPoint 97-2003 ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" }, extension: ".ppt", explanation: { hi: ".ppt PowerPoint 97-2003 प्रेज़ेंटेशन का फ़ाइल एक्सटेंशन है।", pa: ".ppt PowerPoint 97-2003 ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਹੈ।" } },
  "com003-format-pptx": { fileType: { hi: "आधुनिक PowerPoint प्रेज़ेंटेशन", pa: "ਆਧੁਨਿਕ PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" }, extension: ".pptx", explanation: { hi: ".pptx आधुनिक PowerPoint प्रेज़ेंटेशन की पहचान करता है।", pa: ".pptx ਆਧੁਨਿਕ PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।" } },
  "com003-format-ppsx": { fileType: { hi: "PowerPoint Show फ़ाइल, जो Slide Show के रूप में खुलती है", pa: "PowerPoint Show ਫਾਈਲ, ਜੋ Slide Show ਵਜੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ" }, extension: ".ppsx", explanation: { hi: ".ppsx ऐसी PowerPoint Show फ़ाइल की पहचान करता है जो Slide Show के रूप में खुलती है।", pa: ".ppsx ਅਜਿਹੀ PowerPoint Show ਫਾਈਲ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ ਜੋ Slide Show ਵਜੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ।" } },
  "com003-format-xls": { fileType: { hi: "Excel 97-2003 वर्कबुक", pa: "Excel 97-2003 ਵਰਕਬੁੱਕ" }, extension: ".xls", explanation: { hi: ".xls Excel 97-2003 वर्कबुक का फ़ाइल एक्सटेंशन है।", pa: ".xls Excel 97-2003 ਵਰਕਬੁੱਕ ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਹੈ।" } },
  "com003-format-doc": { fileType: { hi: "Word 97-2003 दस्तावेज़", pa: "Word 97-2003 ਦਸਤਾਵੇਜ਼" }, extension: ".doc", explanation: { hi: ".doc Word 97-2003 दस्तावेज़ का फ़ाइल एक्सटेंशन है।", pa: ".doc Word 97-2003 ਦਸਤਾਵੇਜ਼ ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਹੈ।" } },
  "com003-format-xlsx": { fileType: { hi: "आधुनिक Excel वर्कबुक", pa: "ਆਧੁਨਿਕ Excel ਵਰਕਬੁੱਕ" }, extension: ".xlsx", explanation: { hi: ".xlsx आधुनिक Excel वर्कबुक की पहचान करता है।", pa: ".xlsx ਆਧੁਨਿਕ Excel ਵਰਕਬੁੱਕ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।" } },

  "com003-command-copy": { effect: { hi: "चयनित सामग्री की प्रतिलिपि बनाता है और मूल सामग्री को वहीं रहने देता है", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਸਮੱਗਰੀ ਨੂੰ ਥਾਂ 'ਤੇ ਰਹਿਣ ਦਿੰਦਾ ਹੈ" }, explanation: { hi: "Copy चयनित सामग्री की प्रतिलिपि बनाता है और मूल सामग्री को उसी स्थान पर रहने देता है।", pa: "Copy ਚੁਣੀ ਸਮੱਗਰੀ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਸਮੱਗਰੀ ਨੂੰ ਉਸੇ ਥਾਂ ਰਹਿਣ ਦਿੰਦਾ ਹੈ।" } },
  "com003-command-undo": { effect: { hi: "सबसे हाल की समर्थित संपादन क्रिया को वापस करता है", pa: "ਸਭ ਤੋਂ ਹਾਲ ਦੀ ਸਮਰਥਿਤ ਸੰਪਾਦਨ ਕਿਰਿਆ ਨੂੰ ਵਾਪਸ ਕਰਦਾ ਹੈ" }, explanation: { hi: "Undo सबसे हाल की समर्थित संपादन क्रिया को वापस करता है।", pa: "Undo ਸਭ ਤੋਂ ਹਾਲ ਦੀ ਸਮਰਥਿਤ ਸੰਪਾਦਨ ਕਿਰਿਆ ਨੂੰ ਵਾਪਸ ਕਰਦਾ ਹੈ।" } },
  "com003-shortcut-ctrl-v": { action: { hi: "Clipboard सामग्री पेस्ट करना", pa: "Clipboard ਸਮੱਗਰੀ ਪੇਸਟ ਕਰਨਾ" }, explanation: { hi: "Clipboard सामग्री पेस्ट करने के लिए Ctrl+V शॉर्टकट उपयोग होता है।", pa: "Clipboard ਸਮੱਗਰੀ ਪੇਸਟ ਕਰਨ ਲਈ Ctrl+V ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" } },
  "com003-command-find": { effect: { hi: "वर्तमान फ़ाइल में निर्धारित टेक्स्ट या सामग्री खोजता है", pa: "ਮੌਜੂਦਾ ਫਾਈਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਖੋਜਦਾ ਹੈ" }, explanation: { hi: "Find वर्तमान फ़ाइल में निर्धारित सामग्री खोजता है; यह फ़ाइल की सामग्री को बदलता नहीं है।", pa: "Find ਮੌਜੂਦਾ ਫਾਈਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਸਮੱਗਰੀ ਖੋਜਦਾ ਹੈ; ਇਹ ਫਾਈਲ ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਬਦਲਦਾ ਨਹੀਂ ਹੈ।" } },
  "com003-command-paste": { effect: { hi: "Clipboard की सामग्री को वर्तमान स्थान पर डालता है", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੌਜੂਦਾ ਥਾਂ 'ਤੇ ਪਾਂਦਾ ਹੈ" }, explanation: { hi: "Paste Clipboard की सामग्री को वर्तमान स्थान पर डालता है।", pa: "Paste Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੌਜੂਦਾ ਥਾਂ 'ਤੇ ਪਾਂਦਾ ਹੈ।" } },
  "com003-command-print": { effect: { hi: "प्रिंटिंग विकल्प खोलता है", pa: "ਪ੍ਰਿੰਟਿੰਗ ਵਿਕਲਪ ਖੋਲ੍ਹਦਾ ਹੈ" }, explanation: { hi: "Print कमांड दस्तावेज़ की प्रिंट प्रक्रिया और प्रिंटिंग विकल्प खोलता है।", pa: "Print ਕਮਾਂਡ ਦਸਤਾਵੇਜ਼ ਦੀ ਪ੍ਰਿੰਟ ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਪ੍ਰਿੰਟਿੰਗ ਵਿਕਲਪ ਖੋਲ੍ਹਦਾ ਹੈ।" } },
  "com003-command-save": { effect: { hi: "फ़ाइल में वर्तमान बदलावों को सहेजता है", pa: "ਫਾਈਲ ਵਿੱਚ ਮੌਜੂਦਾ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ" }, explanation: { hi: "Save फ़ाइल में किए गए वर्तमान बदलावों को सहेजता है।", pa: "Save ਫਾਈਲ ਵਿੱਚ ਕੀਤੀਆਂ ਮੌਜੂਦਾ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ।" } },
  "com003-shortcut-ctrl-p": { action: { hi: "प्रिंट प्रक्रिया खोलना", pa: "ਪ੍ਰਿੰਟ ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਣਾ" }, explanation: { hi: "Windows desktop Office applications में Ctrl+P प्रिंट प्रक्रिया खोलता है।", pa: "Windows desktop Office applications ਵਿੱਚ Ctrl+P ਪ੍ਰਿੰਟ ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਦਾ ਹੈ।" } },
  "com003-shortcut-ctrl-s": { action: { hi: "वर्तमान दस्तावेज़ को सेव करना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਸੇਵ ਕਰਨਾ" }, explanation: { hi: "Windows desktop Office applications में Ctrl+S वर्तमान दस्तावेज़ को सेव करता है।", pa: "Windows desktop Office applications ਵਿੱਚ Ctrl+S ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਸੇਵ ਕਰਦਾ ਹੈ।" } },
  "com003-command-cut": { effect: { hi: "चयनित सामग्री को हटाकर Clipboard में रखता है, ताकि उसे दूसरी जगह ले जाया जा सके", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਹਟਾ ਕੇ Clipboard ਵਿੱਚ ਰੱਖਦਾ ਹੈ, ਤਾਂ ਜੋ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾ ਸਕੇ" }, explanation: { hi: "Cut चयनित सामग्री को हटाकर Clipboard में रखता है, ताकि उसे दूसरी जगह ले जाया या पेस्ट किया जा सके।", pa: "Cut ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਹਟਾ ਕੇ Clipboard ਵਿੱਚ ਰੱਖਦਾ ਹੈ, ਤਾਂ ਜੋ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾਂ ਪੇਸਟ ਕੀਤਾ ਜਾ ਸਕੇ।" } },
  "com003-shortcut-ctrl-c": { action: { hi: "चयनित सामग्री कॉपी करना", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਕਾਪੀ ਕਰਨਾ" }, explanation: { hi: "चयनित सामग्री कॉपी करने के लिए Ctrl+C शॉर्टकट उपयोग किया जाता है।", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਕਾਪੀ ਕਰਨ ਲਈ Ctrl+C ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" } },
  "com003-shortcut-ctrl-f": { action: { hi: "वर्तमान दस्तावेज़ में टेक्स्ट या सामग्री खोजना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਖੋਜਣਾ" }, explanation: { hi: "वर्तमान दस्तावेज़ में टेक्स्ट या सामग्री खोजने के लिए Ctrl+F शॉर्टकट उपयोग होता है।", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਖੋਜਣ ਲਈ Ctrl+F ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" } },

  "com003-word-document-artifact": { explanation: { hi: "Word दस्तावेज़ एक वर्ड-प्रोसेसिंग दस्तावेज़ होता है; यह वर्कशीट या स्लाइड प्रेज़ेंटेशन नहीं होता।", pa: "Word ਦਸਤਾਵੇਜ਼ ਇੱਕ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਦਸਤਾਵੇਜ਼ ਹੁੰਦਾ ਹੈ; ਇਹ ਵਰਕਸ਼ੀਟ ਜਾਂ ਸਲਾਈਡ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਨਹੀਂ ਹੁੰਦਾ।" } },
  "com003-word-edit-cut": { effect: { hi: "चयनित टेक्स्ट को हटाकर Clipboard पर रखता है, ताकि उसे दूसरी जगह ले जाया या पेस्ट किया जा सके", pa: "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ ਹਟਾ ਕੇ Clipboard 'ਤੇ ਰੱਖਦਾ ਹੈ, ਤਾਂ ਜੋ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾਂ ਪੇਸਟ ਕੀਤਾ ਜਾ ਸਕੇ" }, explanation: { hi: "Cut चयनित टेक्स्ट को Clipboard पर रखकर मूल स्थान से हटाता है, इसलिए उसे दूसरी जगह ले जाया या पेस्ट किया जा सकता है।", pa: "Cut ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ Clipboard 'ਤੇ ਰੱਖ ਕੇ ਮੂਲ ਥਾਂ ਤੋਂ ਹਟਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾਂ ਪੇਸਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।" } },
  "com003-word-edit-paste": { effect: { hi: "Clipboard की सामग्री को insertion point पर डालता है", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ insertion point 'ਤੇ ਪਾਂਦਾ ਹੈ" }, explanation: { hi: "Paste Clipboard की सामग्री को insertion point पर डालता है।", pa: "Paste Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ insertion point 'ਤੇ ਪਾਂਦਾ ਹੈ।" } },
  "com003-word-edit-copy": { effect: { hi: "चयनित टेक्स्ट की प्रतिलिपि बनाता है और मूल टेक्स्ट को नहीं हटाता", pa: "ਚੁਣੇ ਟੈਕਸਟ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਟੈਕਸਟ ਨੂੰ ਨਹੀਂ ਹਟਾਉਂਦਾ" }, explanation: { hi: "Copy चयनित टेक्स्ट की प्रतिलिपि बनाता है और मूल टेक्स्ट को उसी स्थान पर रहने देता है।", pa: "Copy ਚੁਣੇ ਟੈਕਸਟ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਟੈਕਸਟ ਨੂੰ ਉਸੇ ਥਾਂ ਰਹਿਣ ਦਿੰਦਾ ਹੈ।" } },
  "com003-word-alignment-center": { effect: { hi: "पैराग्राफ टेक्स्ट को दोनों side margins के बीच केंद्र में रखता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਦੋਵੇਂ side margins ਦੇ ਵਿਚਕਾਰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖਦਾ ਹੈ" }, explanation: { hi: "Center alignment पैराग्राफ टेक्स्ट को बाएँ और दाएँ margins के बीच केंद्र में रखता है।", pa: "Center alignment ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ margins ਦੇ ਵਿਚਕਾਰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।" } },
  "com003-word-alignment-left": { effect: { hi: "पैराग्राफ टेक्स्ट को बाएँ margin के साथ align करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ margin ਨਾਲ align ਕਰਦਾ ਹੈ" }, explanation: { hi: "Left alignment पैराग्राफ टेक्स्ट को बाएँ margin के साथ align करता है।", pa: "Left alignment ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ margin ਨਾਲ align ਕਰਦਾ ਹੈ।" } },
  "com003-word-alignment-justify": { effect: { hi: "पैराग्राफ टेक्स्ट को बाएँ और दाएँ दोनों margins के साथ समान रूप से align करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਦੋਵੇਂ margins ਨਾਲ ਸਮਾਨ ਤੌਰ 'ਤੇ align ਕਰਦਾ ਹੈ" }, explanation: { hi: "Justify पैराग्राफ टेक्स्ट को बाएँ और दाएँ दोनों margins के साथ समान रूप से align करता है।", pa: "Justify ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਦੋਵੇਂ margins ਨਾਲ ਸਮਾਨ ਤੌਰ 'ਤੇ align ਕਰਦਾ ਹੈ।" } },
  "com003-word-alignment-right": { effect: { hi: "पैराग्राफ टेक्स्ट को दाएँ margin के साथ align करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਸੱਜੇ margin ਨਾਲ align ਕਰਦਾ ਹੈ" }, explanation: { hi: "Right alignment पैराग्राफ टेक्स्ट को दाएँ margin के साथ align करता है।", pa: "Right alignment ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਸੱਜੇ margin ਨਾਲ align ਕਰਦਾ ਹੈ।" } },
  "com003-word-format-bold": { effect: { hi: "चयनित टेक्स्ट को bold दिखाता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ bold ਦਿਖਾਉਂਦਾ ਹੈ" }, explanation: { hi: "Bold फ़ॉर्मैटिंग चयनित टेक्स्ट को मोटा और अधिक प्रमुख दिखाती है।", pa: "Bold ਫਾਰਮੈਟਿੰਗ ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ ਮੋਟਾ ਅਤੇ ਹੋਰ ਪ੍ਰਮੁੱਖ ਦਿਖਾਉਂਦੀ ਹੈ।" } },
};

const OPTION_OVERRIDE: Record<Com003LocalizationLanguageV2, Record<string, string>> = {
  hi: {
    "removes selected content to the clipboard so it can be moved elsewhere": "चयनित सामग्री को हटाकर Clipboard में रखता है, ताकि उसे दूसरी जगह ले जाया जा सके",
    "stores current changes in the file": "फ़ाइल में वर्तमान बदलावों को सहेजता है",
    "Ctrl+Y": "Ctrl+Y",
    "Ctrl+C": "Ctrl+C",
    "Find": "Find",
    "Redo": "Redo",
    "Excel workbook": "Excel वर्कबुक",
    "Word document": "Word दस्तावेज़",
    "Excel worksheet": "Excel वर्कशीट",
    "PowerPoint presentation": "PowerPoint प्रेज़ेंटेशन",
    "Replace": "Replace",
  },
  pa: {
    "removes selected content to the clipboard so it can be moved elsewhere": "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਹਟਾ ਕੇ Clipboard ਵਿੱਚ ਰੱਖਦਾ ਹੈ, ਤਾਂ ਜੋ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾ ਸਕੇ",
    "stores current changes in the file": "ਫਾਈਲ ਵਿੱਚ ਮੌਜੂਦਾ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ",
    "Ctrl+Y": "Ctrl+Y",
    "Ctrl+C": "Ctrl+C",
    "Find": "Find",
    "Redo": "Redo",
    "Excel workbook": "Excel ਵਰਕਬੁੱਕ",
    "Word document": "Word ਦਸਤਾਵੇਜ਼",
    "Excel worksheet": "Excel ਵਰਕਸ਼ੀਟ",
    "PowerPoint presentation": "PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ",
    "Replace": "Replace",
  },
};

function t(value: LanguageText, language: Com003LocalizationLanguageV2) {
  return value[language];
}

function localizeOption(language: Com003LocalizationLanguageV2, english: string) {
  const override = OPTION_OVERRIDE[language][english];
  if (override) return override;
  const memory = lookupCom003OptionTranslationV1(language, english);
  if (memory.status === "UNIQUE" && memory.selected) return memory.selected;
  throw new Error(`COM-003 V2 Wave 1 option '${english}' requires an explicit ${language} translation; status=${memory.status}`);
}

function stemFor(q: Com003ReviewQuestionV162, language: Com003LocalizationLanguageV2, ordinal: number) {
  const fact = FACT[q.targetFactId];
  if (!fact) throw new Error(`COM-003 V2 Wave 1 has no fact text for ${q.targetFactId}`);
  const hi = language === "hi";

  switch (q.surfaceMode) {
    case "APPLICATION_FROM_PURPOSE": {
      const purpose = t(fact.purpose!, language);
      const variants = hi
        ? [
            `${purpose} के लिए मुख्य रूप से किस Microsoft Office एप्लिकेशन का उपयोग किया जाता है?`,
            `${purpose} के लिए कौन-सा Microsoft Office एप्लिकेशन प्रयोग किया जाता है?`,
            `किस Office एप्लिकेशन का मुख्य उपयोग ${purpose} है?`,
          ]
        : [
            `${purpose} ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
            `${purpose} ਲਈ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
            `ਕਿਹੜੀ Office ਐਪਲੀਕੇਸ਼ਨ ਦੀ ਮੁੱਖ ਵਰਤੋਂ ${purpose} ਹੈ?`,
          ];
      return variants[ordinal % variants.length]!;
    }
    case "SOFTWARE_CLASSIFICATION": {
      const entity = t(fact.entity!, language);
      const variants = hi
        ? [
            `${entity} किस श्रेणी का सॉफ्टवेयर है?`,
            `${entity} किस प्रकार का सॉफ्टवेयर है?`,
            `${entity} को किस सॉफ्टवेयर श्रेणी में रखा जाता है?`,
            `Microsoft Office में ${entity} किस प्रकार का सॉफ्टवेयर है?`,
          ]
        : [
            `${entity} ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?`,
            `${entity} ਕਿਹੜੇ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?`,
            `${entity} ਨੂੰ ਕਿਹੜੀ ਸਾਫਟਵੇਅਰ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?`,
            `Microsoft Office ਵਿੱਚ ${entity} ਕਿਹੜੇ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?`,
          ];
      return variants[ordinal % variants.length]!;
    }
    case "TYPE_TO_EXTENSION": {
      const fileType = t(fact.fileType!, language);
      const variants = hi
        ? [
            `${fileType} के लिए कौन-सा फ़ाइल एक्सटेंशन प्रयोग होता है?`,
            `${fileType} का फ़ाइल एक्सटेंशन क्या है?`,
            `${fileType} किस फ़ाइल एक्सटेंशन का उपयोग करता है?`,
          ]
        : [
            `${fileType} ਲਈ ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
            `${fileType} ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਕੀ ਹੈ?`,
            `${fileType} ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਦਾ ਹੈ?`,
          ];
      return variants[ordinal % variants.length]!;
    }
    case "EXTENSION_TO_TYPE": {
      const extension = fact.extension!;
      const variants = hi
        ? [
            `${extension} एक्सटेंशन किस प्रकार की Office फ़ाइल को दर्शाता है?`,
            `${extension} एक्सटेंशन वाली फ़ाइल किस प्रकार की Office फ़ाइल होती है?`,
            `Microsoft Office में ${extension} एक्सटेंशन किस फ़ाइल प्रकार की पहचान करता है?`,
          ]
        : [
            `${extension} ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
            `${extension} ਐਕਸਟੈਂਸ਼ਨ ਵਾਲੀ ਫਾਈਲ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਹੁੰਦੀ ਹੈ?`,
            `Microsoft Office ਵਿੱਚ ${extension} ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਫਾਈਲ ਕਿਸਮ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ?`,
          ];
      return variants[ordinal % variants.length]!;
    }
    case "COMMAND_TO_EFFECT": {
      const command = q.canonicalAnswer;
      return hi ? `${command} कमांड का कार्य क्या है?` : `${command} ਕਮਾਂਡ ਦਾ ਕੰਮ ਕੀ ਹੈ?`;
    }
    case "EFFECT_TO_COMMAND": {
      const effect = t(fact.effect!, language);
      return hi ? `कौन-सा Office कमांड ${effect}?` : `ਕਿਹੜਾ Office ਕਮਾਂਡ ${effect}?`;
    }
    case "ACTION_TO_SHORTCUT": {
      const action = t(fact.action!, language);
      const prefix = q.versionScoped ? "Microsoft Office (Windows desktop) में " : "";
      const paPrefix = q.versionScoped ? "Microsoft Office (Windows desktop) ਵਿੱਚ " : "";
      return hi ? `${prefix}${action} के लिए कौन-सा शॉर्टकट उपयोग किया जाता है?` : `${paPrefix}${action} ਲਈ ਕਿਹੜਾ ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
    }
    case "SHORTCUT_TO_ACTION": {
      const shortcut = q.canonicalAnswer.match(/Ctrl\+[A-Z]/)?.[0] ?? q.canonicalAnswer;
      return hi
        ? `Microsoft Office (Windows desktop) में ${shortcut} का उपयोग किस कार्य के लिए होता है?`
        : `Microsoft Office (Windows desktop) ਵਿੱਚ ${shortcut} ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
    }
    case "DOCUMENT_CONCEPT":
      return hi
        ? "Microsoft Word में बनाए गए वर्ड-प्रोसेसिंग दस्तावेज़ को क्या कहा जाता है?"
        : "Microsoft Word ਵਿੱਚ ਬਣਾਏ ਗਏ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";
    case "EDIT_ACTION_FROM_EFFECT": {
      const effect = t(fact.effect!, language);
      const variants = hi
        ? [
            `Word में कौन-सा कमांड ${effect}?`,
            `${effect} वाला Word कमांड कौन-सा है?`,
          ]
        : [
            `Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ ${effect}?`,
            `${effect} ਵਾਲਾ Word ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?`,
          ];
      return variants[ordinal % variants.length]!;
    }
    case "ALIGNMENT_FROM_PROPERTY": {
      const effect = t(fact.effect!, language);
      return hi ? `कौन-सा paragraph alignment ${effect}?` : `ਕਿਹੜਾ paragraph alignment ${effect}?`;
    }
    case "FORMAT_CONTROL_FROM_EFFECT": {
      const effect = t(fact.effect!, language);
      return hi ? `Word में कौन-सा फ़ॉर्मैटिंग विकल्प ${effect}?` : `Word ਵਿੱਚ ਕਿਹੜਾ ਫਾਰਮੈਟਿੰਗ ਵਿਕਲਪ ${effect}?`;
    }
    default:
      throw new Error(`COM-003 V2 Wave 1 has no stem rule for ${q.qlId}/${q.surfaceMode}`);
  }
}

function buildLanguage(language: Com003LocalizationLanguageV2) {
  const locale = language === "hi" ? "hi-IN" : "pa-IN";
  const wave = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => [
    "COM-003-QL-001",
    "COM-003-QL-002",
    "COM-003-QL-003",
    "COM-003-QL-004",
  ].includes(q.qlId));
  const ordinalBySurfaceFact = new Map<string, number>();

  return wave.map((q, index): Com003LocalizedQuestionV2 => {
    const key = `${q.qlId}|${q.surfaceMode}|${q.targetFactId}`;
    const ordinal = ordinalBySurfaceFact.get(key) ?? 0;
    ordinalBySurfaceFact.set(key, ordinal + 1);
    const fact = FACT[q.targetFactId];
    if (!fact) throw new Error(`COM-003 V2 Wave 1 missing fact ${q.targetFactId}`);
    const options = q.options.map((option) => localizeOption(language, option));
    const canonicalAnswer = options[q.correctIndex]!;
    return {
      localizationId: `COM003-LOC-V2-W1-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId: q.questionId,
      sourceEnglishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
      qlId: q.qlId,
      cpId: q.cpId,
      examSurfaceFamily: q.examSurfaceFamily,
      surfaceMode: q.surfaceMode,
      targetFactId: q.targetFactId,
      language,
      locale,
      stem: stemFor(q, language, ordinal),
      options,
      correctIndex: q.correctIndex,
      canonicalAnswer,
      explanation: t(fact.explanation, language),
      sourceIds: [...q.sourceIds],
      sourceFactIds: [...q.sourceFactIds],
      versionScoped: q.versionScoped,
      solverAuthority: q.solverAuthority,
      sourceEnglishFrozen: true,
      localizationReviewOnly: true,
      localizationFrozen: false,
      runtimeRegistered: false,
      productionReleased: false,
    };
  });
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE1 = Object.freeze(buildLanguage("hi"));
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE1 = Object.freeze(buildLanguage("pa"));

export const COM003_LOCALIZATION_V2_WAVE1_AUTHORITY = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-1" as const,
  sourceEnglishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  qlRange: "COM-003-QL-001..COM-003-QL-004" as const,
  qlCount: 4,
  englishQuestionCount: 48,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_WAVE1.length,
  localizedQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1.length + COM003_PUNJABI_LOCALIZATION_V2_WAVE1.length,
  translationMemoryAuthority: "COM-003-LOCALIZATION-TRANSLATION-MEMORY-V1" as const,
  optionPolicy: "REUSE_GOVERNED_TERM_WHEN_UNIQUE_ELSE_EXPLICIT_OVERRIDE" as const,
  stemExplanationPolicy: "V16_2_SEMANTIC_PARITY_AUTHORED_V2" as const,
  governance: Object.freeze({
    candidateOnly: true,
    localizationFrozen: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
  }),
  nextGate: "COM003_LOCALIZATION_V2_WAVE1_PARITY_EDITORIAL_AUDIT" as const,
});
