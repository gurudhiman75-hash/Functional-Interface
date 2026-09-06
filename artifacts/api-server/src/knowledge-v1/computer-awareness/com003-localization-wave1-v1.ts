import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import type { Com003ReviewQuestion } from "./com003-review-types";
import type { Com003TargetLanguage, Com003TargetLocale } from "./com003-localization-packet-v1";

export type Com003LocalizedQuestionV1 = {
  localizationId: string;
  sourceQuestionId: string;
  qlId: string;
  cpId: Com003ReviewQuestion["cpId"];
  surfaceMode: string;
  targetFactId: string;
  language: Com003TargetLanguage;
  locale: Com003TargetLocale;
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

type Bilingual = { hi: string; pa: string };

const WAVE1_QLS = new Set(["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"]);

const FACT_ENTITY: Record<string, string> = {
  "com003-word-purpose": "Microsoft Word",
  "com003-excel-purpose": "Microsoft Excel",
  "com003-powerpoint-purpose": "Microsoft PowerPoint",
  "com003-word-application-software": "Microsoft Word",
  "com003-excel-application-software": "Microsoft Excel",
  "com003-powerpoint-application-software": "Microsoft PowerPoint",
  "com003-format-docx": ".docx",
  "com003-format-doc": ".doc",
  "com003-format-xlsx": ".xlsx",
  "com003-format-xls": ".xls",
  "com003-format-pptx": ".pptx",
  "com003-format-ppt": ".ppt",
  "com003-format-ppsx": ".ppsx",
  "com003-command-copy": "Copy",
  "com003-command-cut": "Cut",
  "com003-command-paste": "Paste",
  "com003-command-undo": "Undo",
  "com003-command-redo": "Redo",
  "com003-command-save": "Save",
  "com003-command-print": "Print",
  "com003-command-find": "Find",
  "com003-shortcut-ctrl-c": "Ctrl+C",
  "com003-shortcut-ctrl-x": "Ctrl+X",
  "com003-shortcut-ctrl-v": "Ctrl+V",
  "com003-shortcut-ctrl-z": "Ctrl+Z",
  "com003-shortcut-ctrl-y": "Ctrl+Y",
  "com003-shortcut-ctrl-s": "Ctrl+S",
  "com003-shortcut-ctrl-p": "Ctrl+P",
  "com003-shortcut-ctrl-f": "Ctrl+F",
  "com003-word-document-artifact": "Word document",
  "com003-word-word-processor": "Microsoft Word",
  "com003-word-edit-copy": "Copy",
  "com003-word-edit-cut": "Cut",
  "com003-word-edit-paste": "Paste",
  "com003-word-format-bold": "Bold",
  "com003-word-format-italic": "Italic",
  "com003-word-format-underline": "Underline",
  "com003-word-format-font-size": "Font size",
  "com003-word-format-font-color": "Font color",
  "com003-word-format-font": "Font",
  "com003-word-shortcut-ctrl-b": "Ctrl+B",
  "com003-word-shortcut-ctrl-i": "Ctrl+I",
  "com003-word-shortcut-ctrl-u": "Ctrl+U",
  "com003-word-alignment-left": "Left alignment",
  "com003-word-alignment-center": "Center alignment",
  "com003-word-alignment-right": "Right alignment",
  "com003-word-alignment-justify": "Justify",
};

const FACT_VALUE: Record<string, Bilingual> = {
  "com003-word-purpose": { hi: "वर्ड प्रोसेसिंग—दस्तावेज़ बनाना, संपादित करना और फ़ॉर्मैट करना", pa: "ਵਰਡ ਪ੍ਰੋਸੈਸਿੰਗ—ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣਾ, ਸੰਪਾਦਿਤ ਕਰਨਾ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨਾ" },
  "com003-excel-purpose": { hi: "स्प्रेडशीट कार्य—डेटा व्यवस्थित करना और गणनाएँ करना", pa: "ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਕੰਮ—ਡਾਟਾ ਵਿਵਸਥਿਤ ਕਰਨਾ ਅਤੇ ਗਣਨਾਵਾਂ ਕਰਨਾ" },
  "com003-powerpoint-purpose": { hi: "स्लाइड-आधारित प्रेज़ेंटेशन बनाना", pa: "ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣਾ" },
  "com003-word-application-software": { hi: "एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर", pa: "ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ" },
  "com003-excel-application-software": { hi: "एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर", pa: "ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ" },
  "com003-powerpoint-application-software": { hi: "एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर", pa: "ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ" },
  "com003-format-docx": { hi: "आधुनिक Word दस्तावेज़", pa: "ਆਧੁਨਿਕ Word ਦਸਤਾਵੇਜ਼" },
  "com003-format-doc": { hi: "Word 97-2003 दस्तावेज़", pa: "Word 97-2003 ਦਸਤਾਵੇਜ਼" },
  "com003-format-xlsx": { hi: "आधुनिक Excel वर्कबुक", pa: "ਆਧੁਨਿਕ Excel ਵਰਕਬੁੱਕ" },
  "com003-format-xls": { hi: "Excel 97-2003 वर्कबुक", pa: "Excel 97-2003 ਵਰਕਬੁੱਕ" },
  "com003-format-pptx": { hi: "आधुनिक PowerPoint प्रेज़ेंटेशन", pa: "ਆਧੁਨਿਕ PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" },
  "com003-format-ppt": { hi: "PowerPoint 97-2003 प्रेज़ेंटेशन", pa: "PowerPoint 97-2003 ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" },
  "com003-format-ppsx": { hi: "ऐसी PowerPoint शो फ़ाइल जो Slide Show के रूप में खुलती है", pa: "ਅਜਿਹੀ PowerPoint ਸ਼ੋ ਫਾਈਲ ਜੋ Slide Show ਵਜੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ" },
  "com003-command-copy": { hi: "चयनित सामग्री की प्रतिलिपि बनाता है और मूल सामग्री को वहीं रहने देता है", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਸਮੱਗਰੀ ਨੂੰ ਥਾਂ 'ਤੇ ਰਹਿਣ ਦਿੰਦਾ ਹੈ" },
  "com003-command-cut": { hi: "चयनित सामग्री को Clipboard में भेजते हुए हटाता है ताकि उसे दूसरी जगह ले जाया जा सके", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ Clipboard ਵਿੱਚ ਭੇਜਦਿਆਂ ਹਟਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਸਨੂੰ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾ ਸਕੇ" },
  "com003-command-paste": { hi: "Clipboard की सामग्री को वर्तमान स्थान पर डालता है", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੌਜੂਦਾ ਥਾਂ 'ਤੇ ਪਾਂਦਾ ਹੈ" },
  "com003-command-undo": { hi: "हाल की समर्थित संपादन क्रिया को उलटता है", pa: "ਹਾਲ ਦੀ ਸਮਰਥਿਤ ਸੰਪਾਦਨ ਕਿਰਿਆ ਨੂੰ ਵਾਪਸ ਕਰਦਾ ਹੈ" },
  "com003-command-redo": { hi: "Redo उपलब्ध होने पर Undo की गई क्रिया को फिर से लागू करता है", pa: "Redo ਉਪਲਬਧ ਹੋਣ 'ਤੇ Undo ਕੀਤੀ ਕਿਰਿਆ ਨੂੰ ਮੁੜ ਲਾਗੂ ਕਰਦਾ ਹੈ" },
  "com003-command-save": { hi: "फ़ाइल में वर्तमान बदलावों को सहेजता है", pa: "ਫਾਈਲ ਵਿੱਚ ਮੌਜੂਦਾ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ" },
  "com003-command-print": { hi: "दस्तावेज़ की प्रिंटिंग प्रक्रिया खोलता या चलाता है", pa: "ਦਸਤਾਵੇਜ਼ ਦੀ ਪ੍ਰਿੰਟਿੰਗ ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਦਾ ਜਾਂ ਚਲਾਉਂਦਾ ਹੈ" },
  "com003-command-find": { hi: "वर्तमान फ़ाइल में निर्दिष्ट सामग्री खोजता है", pa: "ਮੌਜੂਦਾ ਫਾਈਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਸਮੱਗਰੀ ਖੋਜਦਾ ਹੈ" },
  "com003-shortcut-ctrl-c": { hi: "चयनित सामग्री को कॉपी करना", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਕਾਪੀ ਕਰਨਾ" },
  "com003-shortcut-ctrl-x": { hi: "चयनित सामग्री को कट करना", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਕੱਟ ਕਰਨਾ" },
  "com003-shortcut-ctrl-v": { hi: "Clipboard की सामग्री पेस्ट करना", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਪੇਸਟ ਕਰਨਾ" },
  "com003-shortcut-ctrl-z": { hi: "पिछली क्रिया को Undo करना", pa: "ਪਿਛਲੀ ਕਿਰਿਆ ਨੂੰ Undo ਕਰਨਾ" },
  "com003-shortcut-ctrl-y": { hi: "समर्थित स्थिति में पिछली क्रिया को Redo या Repeat करना", pa: "ਸਮਰਥਿਤ ਹਾਲਤ ਵਿੱਚ ਪਿਛਲੀ ਕਿਰਿਆ ਨੂੰ Redo ਜਾਂ Repeat ਕਰਨਾ" },
  "com003-shortcut-ctrl-s": { hi: "वर्तमान दस्तावेज़ को Save करना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਨੂੰ Save ਕਰਨਾ" },
  "com003-shortcut-ctrl-p": { hi: "Print प्रक्रिया खोलना", pa: "Print ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਣਾ" },
  "com003-shortcut-ctrl-f": { hi: "वर्तमान दस्तावेज़ में टेक्स्ट या सामग्री ढूँढना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਲੱਭਣਾ" },
  "com003-word-document-artifact": { hi: "एक वर्ड-प्रोसेसिंग दस्तावेज़, न कि worksheet या slide presentation", pa: "ਇੱਕ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਦਸਤਾਵੇਜ਼, ਨਾ ਕਿ worksheet ਜਾਂ slide presentation" },
  "com003-word-word-processor": { hi: "एक वर्ड-प्रोसेसिंग एप्लिकेशन", pa: "ਇੱਕ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਐਪਲੀਕੇਸ਼ਨ" },
  "com003-word-edit-copy": { hi: "चयनित टेक्स्ट की प्रतिलिपि बनाता है, मूल टेक्स्ट को हटाए बिना", pa: "ਚੁਣੇ ਟੈਕਸਟ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ, ਮੂਲ ਟੈਕਸਟ ਨੂੰ ਹਟਾਏ ਬਿਨਾਂ" },
  "com003-word-edit-cut": { hi: "चयनित टेक्स्ट को Clipboard में भेजकर हटाता है ताकि उसे दूसरी जगह रखा जा सके", pa: "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ Clipboard ਵਿੱਚ ਭੇਜ ਕੇ ਹਟਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਸਨੂੰ ਹੋਰ ਥਾਂ ਰੱਖਿਆ ਜਾ ਸਕੇ" },
  "com003-word-edit-paste": { hi: "Clipboard की सामग्री को insertion point पर डालता है", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ insertion point 'ਤੇ ਪਾਂਦਾ ਹੈ" },
  "com003-word-format-bold": { hi: "चयनित टेक्स्ट को अधिक मोटा और गहरा दिखाता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ ਹੋਰ ਮੋਟਾ ਅਤੇ ਗੂੜ੍ਹਾ ਦਿਖਾਉਂਦਾ ਹੈ" },
  "com003-word-format-italic": { hi: "चयनित टेक्स्ट को तिरछा दिखाता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ ਤਿਰਛਾ ਦਿਖਾਉਂਦਾ ਹੈ" },
  "com003-word-format-underline": { hi: "चयनित टेक्स्ट के नीचे रेखा जोड़ता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਦੇ ਹੇਠਾਂ ਲਾਈਨ ਜੋੜਦਾ ਹੈ" },
  "com003-word-format-font-size": { hi: "चयनित टेक्स्ट का प्रदर्शित आकार बदलता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਦਾ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਆਕਾਰ ਬਦਲਦਾ ਹੈ" },
  "com003-word-format-font-color": { hi: "चयनित टेक्स्ट का रंग बदलता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਦਾ ਰੰਗ ਬਦਲਦਾ ਹੈ" },
  "com003-word-format-font": { hi: "चयनित टेक्स्ट में प्रयुक्त typeface बदलता है", pa: "ਚੁਣੇ ਟੈਕਸਟ ਲਈ ਵਰਤਿਆ typeface ਬਦਲਦਾ ਹੈ" },
  "com003-word-shortcut-ctrl-b": { hi: "Bold formatting लागू या हटाना", pa: "Bold formatting ਲਾਗੂ ਜਾਂ ਹਟਾਉਣਾ" },
  "com003-word-shortcut-ctrl-i": { hi: "Italic formatting लागू या हटाना", pa: "Italic formatting ਲਾਗੂ ਜਾਂ ਹਟਾਉਣਾ" },
  "com003-word-shortcut-ctrl-u": { hi: "Underline formatting लागू या हटाना", pa: "Underline formatting ਲਾਗੂ ਜਾਂ ਹਟਾਉਣਾ" },
  "com003-word-alignment-left": { hi: "पैराग्राफ टेक्स्ट को बाएँ margin के साथ संरेखित करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ margin ਨਾਲ ਇਕਸਾਰ ਕਰਦਾ ਹੈ" },
  "com003-word-alignment-center": { hi: "पैराग्राफ टेक्स्ट को दोनों किनारों के बीच केंद्र में रखता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੇ ਵਿਚਕਾਰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖਦਾ ਹੈ" },
  "com003-word-alignment-right": { hi: "पैराग्राफ टेक्स्ट को दाएँ margin के साथ संरेखित करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਸੱਜੇ margin ਨਾਲ ਇਕਸਾਰ ਕਰਦਾ ਹੈ" },
  "com003-word-alignment-justify": { hi: "पैराग्राफ टेक्स्ट को बाएँ और दाएँ दोनों margins के साथ समान रूप से संरेखित करता है", pa: "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਦੋਵੇਂ margins ਨਾਲ ਸਮਾਨ ਤੌਰ 'ਤੇ ਇਕਸਾਰ ਕਰਦਾ ਹੈ" },
};

const OPTION_TRANSLATIONS: Record<string, Bilingual> = {
  "Application/productivity software": { hi: "एप्लिकेशन/प्रोडक्टिविटी सॉफ्टवेयर", pa: "ਐਪਲੀਕੇਸ਼ਨ/ਪ੍ਰੋਡਕਟੀਵਿਟੀ ਸਾਫਟਵੇਅਰ" },
  "System software": { hi: "सिस्टम सॉफ्टवेयर", pa: "ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ" },
  "Utility software": { hi: "यूटिलिटी सॉफ्टवेयर", pa: "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ" },
  "Device driver": { hi: "डिवाइस ड्राइवर", pa: "ਡਿਵਾਈਸ ਡਰਾਈਵਰ" },
  "modern Word document": { hi: "आधुनिक Word दस्तावेज़", pa: "ਆਧੁਨਿਕ Word ਦਸਤਾਵੇਜ਼" },
  "Word 97-2003 document": { hi: "Word 97-2003 दस्तावेज़", pa: "Word 97-2003 ਦਸਤਾਵੇਜ਼" },
  "modern Excel workbook": { hi: "आधुनिक Excel वर्कबुक", pa: "ਆਧੁਨਿਕ Excel ਵਰਕਬੁੱਕ" },
  "Excel 97-2003 workbook": { hi: "Excel 97-2003 वर्कबुक", pa: "Excel 97-2003 ਵਰਕਬੁੱਕ" },
  "modern PowerPoint presentation": { hi: "आधुनिक PowerPoint प्रेज़ेंटेशन", pa: "ਆਧੁਨਿਕ PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" },
  "PowerPoint 97-2003 presentation": { hi: "PowerPoint 97-2003 प्रेज़ेंटेशन", pa: "PowerPoint 97-2003 ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" },
  "PowerPoint show file that opens as a slide show": { hi: "PowerPoint शो फ़ाइल जो Slide Show के रूप में खुलती है", pa: "PowerPoint ਸ਼ੋ ਫਾਈਲ ਜੋ Slide Show ਵਜੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ" },
  "duplicates selected content while leaving the original content in place": { hi: "चयनित सामग्री की प्रतिलिपि बनाता है और मूल सामग्री को वहीं रहने देता है", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਸਮੱਗਰੀ ਨੂੰ ਥਾਂ 'ਤੇ ਰਹਿਣ ਦਿੰਦਾ ਹੈ" },
  "removes selected content to the clipboard so it can be moved elsewhere": { hi: "चयनित सामग्री को Clipboard में भेजते हुए हटाता है ताकि उसे दूसरी जगह ले जाया जा सके", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ Clipboard ਵਿੱਚ ਭੇਜਦਿਆਂ ਹਟਾਉਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਸਨੂੰ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾ ਸਕੇ" },
  "inserts clipboard content at the current location": { hi: "Clipboard की सामग्री को वर्तमान स्थान पर डालता है", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੌਜੂਦਾ ਥਾਂ 'ਤੇ ਪਾਂਦਾ ਹੈ" },
  "reverses the most recent supported editing action": { hi: "हाल की समर्थित संपादन क्रिया को उलटता है", pa: "ਹਾਲ ਦੀ ਸਮਰਥਿਤ ਸੰਪਾਦਨ ਕਿਰਿਆ ਨੂੰ ਵਾਪਸ ਕਰਦਾ ਹੈ" },
  "reapplies an action that was undone when redo is available": { hi: "Redo उपलब्ध होने पर Undo की गई क्रिया को फिर से लागू करता है", pa: "Redo ਉਪਲਬਧ ਹੋਣ 'ਤੇ Undo ਕੀਤੀ ਕਿਰਿਆ ਨੂੰ ਮੁੜ ਲਾਗੂ ਕਰਦਾ ਹੈ" },
  "stores current changes in the file": { hi: "फ़ाइल में वर्तमान बदलावों को सहेजता है", pa: "ਫਾਈਲ ਵਿੱਚ ਮੌਜੂਦਾ ਤਬਦੀਲੀਆਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ" },
  "opens or performs the document printing workflow": { hi: "दस्तावेज़ की प्रिंटिंग प्रक्रिया खोलता या चलाता है", pa: "ਦਸਤਾਵੇਜ਼ ਦੀ ਪ੍ਰਿੰਟਿੰਗ ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਦਾ ਜਾਂ ਚਲਾਉਂਦਾ ਹੈ" },
  "searches for specified content in the current file": { hi: "वर्तमान फ़ाइल में निर्दिष्ट सामग्री खोजता है", pa: "ਮੌਜੂਦਾ ਫਾਈਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਸਮੱਗਰੀ ਖੋਜਦਾ ਹੈ" },
  "copy selected content": { hi: "चयनित सामग्री को कॉपी करना", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਕਾਪੀ ਕਰਨਾ" },
  "cut selected content": { hi: "चयनित सामग्री को कट करना", pa: "ਚੁਣੀ ਸਮੱਗਰੀ ਨੂੰ ਕੱਟ ਕਰਨਾ" },
  "paste clipboard content": { hi: "Clipboard की सामग्री पेस्ट करना", pa: "Clipboard ਦੀ ਸਮੱਗਰੀ ਪੇਸਟ ਕਰਨਾ" },
  "undo the previous action": { hi: "पिछली क्रिया को Undo करना", pa: "ਪਿਛਲੀ ਕਿਰਿਆ ਨੂੰ Undo ਕਰਨਾ" },
  "redo or repeat the previous action when supported": { hi: "समर्थित स्थिति में पिछली क्रिया को Redo या Repeat करना", pa: "ਸਮਰਥਿਤ ਹਾਲਤ ਵਿੱਚ ਪਿਛਲੀ ਕਿਰਿਆ ਨੂੰ Redo ਜਾਂ Repeat ਕਰਨਾ" },
  "save the current document": { hi: "वर्तमान दस्तावेज़ को Save करना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਨੂੰ Save ਕਰਨਾ" },
  "open the print workflow": { hi: "Print प्रक्रिया खोलना", pa: "Print ਪ੍ਰਕਿਰਿਆ ਖੋਲ੍ਹਣਾ" },
  "find text or content in the current document": { hi: "वर्तमान दस्तावेज़ में टेक्स्ट या सामग्री ढूँढना", pa: "ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਲੱਭਣਾ" },
  "Word document": { hi: "Word दस्तावेज़", pa: "Word ਦਸਤਾਵੇਜ਼" },
  "Excel workbook": { hi: "Excel वर्कबुक", pa: "Excel ਵਰਕਬੁੱਕ" },
  "Excel worksheet": { hi: "Excel वर्कशीट", pa: "Excel ਵਰਕਸ਼ੀਟ" },
  "PowerPoint presentation": { hi: "PowerPoint प्रेज़ेंटेशन", pa: "PowerPoint ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ" },
  "PowerPoint slide": { hi: "PowerPoint स्लाइड", pa: "PowerPoint ਸਲਾਈਡ" },
  "Left alignment": { hi: "Left alignment", pa: "Left alignment" },
  "Center alignment": { hi: "Center alignment", pa: "Center alignment" },
  "Right alignment": { hi: "Right alignment", pa: "Right alignment" },
  "Justify": { hi: "Justify", pa: "Justify" },
  "Font size": { hi: "Font size", pa: "Font size" },
  "Font color": { hi: "Font color", pa: "Font color" },
};

const TECHNICAL_TOKEN = /^(?:Microsoft (?:Word|Excel|PowerPoint)|Windows|File Explorer|Copy|Cut|Paste|Undo|Redo|Save|Print|Find|Replace|Bold|Italic|Underline|Font|Ctrl\+[A-Z]|\.[a-z0-9]+)$/i;

function locale(language: Com003TargetLanguage): Com003TargetLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function factEntity(question: Com003ReviewQuestion) {
  return FACT_ENTITY[question.targetFactId] ?? question.canonicalAnswer;
}

function factValue(question: Com003ReviewQuestion, language: Com003TargetLanguage) {
  const value = FACT_VALUE[question.targetFactId]?.[language];
  if (!value) throw new Error(`Missing ${language} COM-003 Wave-1 fact value for ${question.targetFactId}`);
  return value;
}

function localizeOption(value: string, language: Com003TargetLanguage) {
  const translated = OPTION_TRANSLATIONS[value]?.[language];
  if (translated) return translated;
  if (TECHNICAL_TOKEN.test(value) || /^Ctrl\+|^\.|^(?:Shift\+)?F\d+$/i.test(value)) return value;
  throw new Error(`Missing ${language} COM-003 Wave-1 option translation: ${value}`);
}

function pick<T>(values: readonly T[], index: number) {
  return values[index % values.length]!;
}

function stemHi(question: Com003ReviewQuestion, index: number) {
  const entity = factEntity(question);
  const value = factValue(question, "hi");
  switch (`${question.qlId}:${question.surfaceMode}`) {
    case "COM-003-QL-001:APPLICATION_FROM_PURPOSE": return pick([
      `${value} के लिए मुख्य रूप से किस एप्लिकेशन का उपयोग किया जाता है?`,
      `Microsoft Office में ${value} से संबंधित एप्लिकेशन कौन-सा है?`,
      `निम्न में से किस Office प्रोग्राम का प्रमुख कार्य ${value} है?`,
      `${value} मुख्य रूप से किस एप्लिकेशन से संबंधित है?`,
      `उस एप्लिकेशन का चयन कीजिए जिसका मुख्य productivity कार्य ${value} है।`,
      `निम्न में से कौन-सा एप्लिकेशन मुख्यतः ${value} के लिए बनाया गया है?`,
    ], index);
    case "COM-003-QL-001:SOFTWARE_CLASSIFICATION": return pick([
      `${entity} को किस प्रकार के सॉफ्टवेयर में वर्गीकृत किया जाता है?`,
      `${entity} किस software category में आता है?`,
      `${entity} की सही व्यापक software class कौन-सी है?`,
      `मूल Computer Awareness में ${entity} का वर्गीकरण क्या है?`,
      `${entity} के लिए सही software classification चुनिए।`,
      `कौन-सी category ${entity} का सबसे सही वर्णन करती है?`,
    ], index);
    case "COM-003-QL-002:TYPE_TO_EXTENSION": return pick([
      `${value} के लिए सही file extension कौन-सी है?`,
      `${value} से संबंधित extension चुनिए।`,
      `${value} सामान्यतः किस extension का उपयोग करता है?`,
      `वर्णित Office file type—${value}—की सही extension कौन-सी है?`,
      `${value} की file extension पहचानिए।`,
      `इस Office format (${value}) के लिए अपेक्षित extension कौन-सी है?`,
    ], index);
    case "COM-003-QL-002:EXTENSION_TO_TYPE": return pick([
      `${entity} सामान्यतः किस Office file type से संबंधित है?`,
      `Office extension ${entity} किस प्रकार की फ़ाइल को दर्शाती है?`,
      `${entity} से संबंधित file type पहचानिए।`,
      `${entity} के साथ कौन-सा वर्णन सही मेल खाता है?`,
      `Extension ${entity} किस Office format की है?`,
      `${entity} के लिए सही Office file description कौन-सा है?`,
    ], index);
    case "COM-003-QL-003:EFFECT_TO_COMMAND": return pick([
      `${value} के लिए किस Office command का उपयोग किया जाता है?`,
      `उस command को पहचानिए जो ${value}।`,
      `${value} वाली क्रिया किस command से होती है?`,
      `${value} किस command का कार्य है?`,
      `वह command चुनिए जो ${value}।`,
      `${value} करने वाला editing/document command कौन-सा है?`,
    ], index);
    case "COM-003-QL-003:COMMAND_TO_EFFECT": return pick([
      `${entity} command का प्रभाव क्या है?`,
      `${entity} से कौन-सी क्रिया होती है?`,
      `${entity} का उपयोग किस उद्देश्य के लिए किया जाता है?`,
      `${entity} command का सही वर्णन कौन-सा है?`,
      `${entity} क्या करता है?`,
      `${entity} command कौन-सा operation करता है?`,
    ], index);
    case "COM-003-QL-003:ACTION_TO_SHORTCUT": return pick([
      `Windows desktop Office में ${value} के लिए कौन-सा shortcut उपयोग किया जाता है?`,
      `समर्थित Windows desktop Office application में ${value} से संबंधित shortcut कौन-सा है?`,
      `${value} के लिए सही Windows desktop Office shortcut चुनिए।`,
      `Windows desktop संदर्भ में ${value} के लिए कौन-सा key combination है?`,
      `समर्थित Office desktop application में ${value} किस shortcut से किया जाता है?`,
      `${value} के लिए सही shortcut-action pair कौन-सा है?`,
    ], index);
    case "COM-003-QL-003:SHORTCUT_TO_ACTION": return pick([
      `समर्थित Windows desktop Office संदर्भ में ${entity} क्या करता है?`,
      `Windows desktop Office application में ${entity} किस action से संबंधित है?`,
      `${entity} shortcut का सामान्य Office action क्या है?`,
      `दिए गए Windows desktop Office संदर्भ में ${entity} किस क्रिया से मेल खाता है?`,
      `${entity} shortcut के लिए सही action चुनिए।`,
      `${entity} का कार्य बताने वाला सही विकल्प कौन-सा है?`,
    ], index);
    case "COM-003-QL-004:DOCUMENT_CONCEPT": return pick([
      `Microsoft Word से संबंधित कौन-सा विकल्प ${value} है?`,
      `इस वर्णन से सही Word concept पहचानिए: ${value}।`,
      `${value} के लिए सही word-processing item कौन-सा है?`,
      `Office terminology में ${value} किसे कहा जाएगा?`,
      `${value} से मेल खाने वाला artifact/application चुनिए।`,
      `कौन-सा Word concept इस वर्णन पर सही बैठता है: ${value}?`,
    ], index);
    case "COM-003-QL-004:EDIT_ACTION_FROM_EFFECT": return pick([
      `Word में कौन-सी editing action ${value}?`,
      `${value} वाली editing command पहचानिए।`,
      `Word में ${value} किस operation का प्रभाव है?`,
      `${value} किस editing action का परिणाम है?`,
      `वह Word command चुनिए जो ${value}।`,
      `${value} से सबसे सही मेल खाने वाला editing operation कौन-सा है?`,
    ], index);
    case "COM-003-QL-004:FORMAT_CONTROL_FROM_EFFECT": return pick([
      `Microsoft Word में कौन-सा formatting control ${value}?`,
      `${value} वाला formatting feature कौन-सा है?`,
      `चयनित टेक्स्ट पर यह प्रभाव देने वाला विकल्प कौन-सा है: ${value}?`,
      `${value} किस formatting control का प्रभाव है?`,
      `वह formatting command चुनिए जो ${value}।`,
      `${value} से मेल खाने वाला Word formatting control कौन-सा है?`,
    ], index);
    case "COM-003-QL-004:ALIGNMENT_FROM_PROPERTY": return pick([
      `कौन-सा paragraph alignment ${value}?`,
      `इस गुण से संबंधित alignment पहचानिए: ${value}।`,
      `Word में किस alignment की विशेषता है कि वह ${value}?`,
      `${value} किस paragraph alignment का वर्णन है?`,
      `वह alignment चुनिए जो ${value}।`,
      `${value} से मेल खाने वाला alignment option कौन-सा है?`,
    ], index);
    case "COM-003-QL-004:FORMATTING_SHORTCUT": return pick([
      `Windows desktop Word में ${value} के लिए कौन-सा shortcut है?`,
      `${value} वाली formatting action से संबंधित Word shortcut कौन-सा है?`,
      `${value} के लिए सही Windows desktop Word shortcut चुनिए।`,
      `${value} करने वाला Word key combination कौन-सा है?`,
      `${value} किस Word shortcut से संबंधित है?`,
      `${value} के लिए सही shortcut-action pair कौन-सा है?`,
    ], index);
    default: throw new Error(`Unsupported Hindi COM-003 Wave-1 surface ${question.qlId}/${question.surfaceMode}`);
  }
}

function stemPa(question: Com003ReviewQuestion, index: number) {
  const entity = factEntity(question);
  const value = factValue(question, "pa");
  switch (`${question.qlId}:${question.surfaceMode}`) {
    case "COM-003-QL-001:APPLICATION_FROM_PURPOSE": return pick([
      `${value} ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
      `Microsoft Office ਵਿੱਚ ${value} ਨਾਲ ਸੰਬੰਧਿਤ ਐਪਲੀਕੇਸ਼ਨ ਕਿਹੜੀ ਹੈ?`,
      `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ Office ਪ੍ਰੋਗਰਾਮ ਦਾ ਮੁੱਖ ਕੰਮ ${value} ਹੈ?`,
      `${value} ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਐਪਲੀਕੇਸ਼ਨ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
      `ਉਹ ਐਪਲੀਕੇਸ਼ਨ ਚੁਣੋ ਜਿਸਦਾ ਮੁੱਖ productivity ਕੰਮ ${value} ਹੈ।`,
      `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਐਪਲੀਕੇਸ਼ਨ ਮੁੱਖ ਤੌਰ 'ਤੇ ${value} ਲਈ ਬਣਾਈ ਗਈ ਹੈ?`,
    ], index);
    case "COM-003-QL-001:SOFTWARE_CLASSIFICATION": return pick([
      `${entity} ਨੂੰ ਕਿਹੜੀ ਕਿਸਮ ਦੇ ਸਾਫਟਵੇਅਰ ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`,
      `${entity} ਕਿਹੜੀ software category ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
      `${entity} ਦੀ ਸਹੀ ਵਿਆਪਕ software class ਕਿਹੜੀ ਹੈ?`,
      `ਮੁੱਢਲੀ Computer Awareness ਵਿੱਚ ${entity} ਦਾ ਵਰਗੀਕਰਨ ਕੀ ਹੈ?`,
      `${entity} ਲਈ ਸਹੀ software classification ਚੁਣੋ।`,
      `ਕਿਹੜੀ category ${entity} ਦਾ ਸਭ ਤੋਂ ਸਹੀ ਵਰਣਨ ਕਰਦੀ ਹੈ?`,
    ], index);
    case "COM-003-QL-002:TYPE_TO_EXTENSION": return pick([
      `${value} ਲਈ ਸਹੀ file extension ਕਿਹੜੀ ਹੈ?`,
      `${value} ਨਾਲ ਸੰਬੰਧਿਤ extension ਚੁਣੋ।`,
      `${value} ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੀ extension ਵਰਤਦਾ ਹੈ?`,
      `ਦੱਸੀ Office file type—${value}—ਦੀ ਸਹੀ extension ਕਿਹੜੀ ਹੈ?`,
      `${value} ਦੀ file extension ਪਛਾਣੋ।`,
      `ਇਸ Office format (${value}) ਲਈ ਉਮੀਦ ਕੀਤੀ extension ਕਿਹੜੀ ਹੈ?`,
    ], index);
    case "COM-003-QL-002:EXTENSION_TO_TYPE": return pick([
      `${entity} ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Office file type ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
      `Office extension ${entity} ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਫਾਈਲ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ?`,
      `${entity} ਨਾਲ ਸੰਬੰਧਿਤ file type ਪਛਾਣੋ।`,
      `${entity} ਨਾਲ ਕਿਹੜਾ ਵਰਣਨ ਸਹੀ ਮਿਲਦਾ ਹੈ?`,
      `Extension ${entity} ਕਿਹੜੇ Office format ਦੀ ਹੈ?`,
      `${entity} ਲਈ ਸਹੀ Office file description ਕਿਹੜਾ ਹੈ?`,
    ], index);
    case "COM-003-QL-003:EFFECT_TO_COMMAND": return pick([
      `${value} ਲਈ ਕਿਹੜੀ Office command ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
      `ਉਹ command ਪਛਾਣੋ ਜੋ ${value}।`,
      `${value} ਵਾਲੀ ਕਿਰਿਆ ਕਿਹੜੀ command ਨਾਲ ਹੁੰਦੀ ਹੈ?`,
      `${value} ਕਿਹੜੀ command ਦਾ ਕੰਮ ਹੈ?`,
      `ਉਹ command ਚੁਣੋ ਜੋ ${value}।`,
      `${value} ਕਰਨ ਵਾਲੀ editing/document command ਕਿਹੜੀ ਹੈ?`,
    ], index);
    case "COM-003-QL-003:COMMAND_TO_EFFECT": return pick([
      `${entity} command ਦਾ ਪ੍ਰਭਾਵ ਕੀ ਹੈ?`,
      `${entity} ਨਾਲ ਕਿਹੜੀ ਕਿਰਿਆ ਹੁੰਦੀ ਹੈ?`,
      `${entity} ਕਿਸ ਮਕਸਦ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
      `${entity} command ਦਾ ਸਹੀ ਵਰਣਨ ਕਿਹੜਾ ਹੈ?`,
      `${entity} ਕੀ ਕਰਦੀ ਹੈ?`,
      `${entity} command ਕਿਹੜਾ operation ਕਰਦੀ ਹੈ?`,
    ], index);
    case "COM-003-QL-003:ACTION_TO_SHORTCUT": return pick([
      `Windows desktop Office ਵਿੱਚ ${value} ਲਈ ਕਿਹੜਾ shortcut ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
      `ਸਮਰਥਿਤ Windows desktop Office application ਵਿੱਚ ${value} ਨਾਲ ਸੰਬੰਧਿਤ shortcut ਕਿਹੜਾ ਹੈ?`,
      `${value} ਲਈ ਸਹੀ Windows desktop Office shortcut ਚੁਣੋ।`,
      `Windows desktop ਸੰਦਰਭ ਵਿੱਚ ${value} ਲਈ ਕਿਹੜਾ key combination ਹੈ?`,
      `ਸਮਰਥਿਤ Office desktop application ਵਿੱਚ ${value} ਕਿਹੜੇ shortcut ਨਾਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`,
      `${value} ਲਈ ਸਹੀ shortcut-action pair ਕਿਹੜਾ ਹੈ?`,
    ], index);
    case "COM-003-QL-003:SHORTCUT_TO_ACTION": return pick([
      `ਸਮਰਥਿਤ Windows desktop Office ਸੰਦਰਭ ਵਿੱਚ ${entity} ਕੀ ਕਰਦਾ ਹੈ?`,
      `Windows desktop Office application ਵਿੱਚ ${entity} ਕਿਹੜੀ action ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
      `${entity} shortcut ਦਾ ਆਮ Office action ਕੀ ਹੈ?`,
      `ਦਿੱਤੇ Windows desktop Office ਸੰਦਰਭ ਵਿੱਚ ${entity} ਕਿਹੜੀ ਕਿਰਿਆ ਨਾਲ ਮਿਲਦਾ ਹੈ?`,
      `${entity} shortcut ਲਈ ਸਹੀ action ਚੁਣੋ।`,
      `${entity} ਦਾ ਕੰਮ ਦੱਸਣ ਵਾਲਾ ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?`,
    ], index);
    case "COM-003-QL-004:DOCUMENT_CONCEPT": return pick([
      `Microsoft Word ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਵਿਕਲਪ ${value} ਹੈ?`,
      `ਇਸ ਵਰਣਨ ਤੋਂ ਸਹੀ Word concept ਪਛਾਣੋ: ${value}।`,
      `${value} ਲਈ ਸਹੀ word-processing item ਕਿਹੜਾ ਹੈ?`,
      `Office terminology ਵਿੱਚ ${value} ਕਿਸਨੂੰ ਕਿਹਾ ਜਾਵੇਗਾ?`,
      `${value} ਨਾਲ ਮਿਲਦਾ artifact/application ਚੁਣੋ।`,
      `ਕਿਹੜਾ Word concept ਇਸ ਵਰਣਨ ਨਾਲ ਸਹੀ ਮਿਲਦਾ ਹੈ: ${value}?`,
    ], index);
    case "COM-003-QL-004:EDIT_ACTION_FROM_EFFECT": return pick([
      `Word ਵਿੱਚ ਕਿਹੜੀ editing action ${value}?`,
      `${value} ਵਾਲੀ editing command ਪਛਾਣੋ।`,
      `Word ਵਿੱਚ ${value} ਕਿਹੜੇ operation ਦਾ ਪ੍ਰਭਾਵ ਹੈ?`,
      `${value} ਕਿਹੜੀ editing action ਦਾ ਨਤੀਜਾ ਹੈ?`,
      `ਉਹ Word command ਚੁਣੋ ਜੋ ${value}।`,
      `${value} ਨਾਲ ਸਭ ਤੋਂ ਸਹੀ ਮਿਲਦੀ editing operation ਕਿਹੜੀ ਹੈ?`,
    ], index);
    case "COM-003-QL-004:FORMAT_CONTROL_FROM_EFFECT": return pick([
      `Microsoft Word ਵਿੱਚ ਕਿਹੜਾ formatting control ${value}?`,
      `${value} ਵਾਲਾ formatting feature ਕਿਹੜਾ ਹੈ?`,
      `ਚੁਣੇ ਟੈਕਸਟ 'ਤੇ ਇਹ ਪ੍ਰਭਾਵ ਦੇਣ ਵਾਲਾ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ: ${value}?`,
      `${value} ਕਿਹੜੇ formatting control ਦਾ ਪ੍ਰਭਾਵ ਹੈ?`,
      `ਉਹ formatting command ਚੁਣੋ ਜੋ ${value}।`,
      `${value} ਨਾਲ ਮਿਲਦਾ Word formatting control ਕਿਹੜਾ ਹੈ?`,
    ], index);
    case "COM-003-QL-004:ALIGNMENT_FROM_PROPERTY": return pick([
      `ਕਿਹੜਾ paragraph alignment ${value}?`,
      `ਇਸ ਗੁਣ ਨਾਲ ਸੰਬੰਧਿਤ alignment ਪਛਾਣੋ: ${value}।`,
      `Word ਵਿੱਚ ਕਿਹੜੇ alignment ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ ਕਿ ਉਹ ${value}?`,
      `${value} ਕਿਹੜੇ paragraph alignment ਦਾ ਵਰਣਨ ਹੈ?`,
      `ਉਹ alignment ਚੁਣੋ ਜੋ ${value}।`,
      `${value} ਨਾਲ ਮਿਲਦਾ alignment option ਕਿਹੜਾ ਹੈ?`,
    ], index);
    case "COM-003-QL-004:FORMATTING_SHORTCUT": return pick([
      `Windows desktop Word ਵਿੱਚ ${value} ਲਈ ਕਿਹੜਾ shortcut ਹੈ?`,
      `${value} ਵਾਲੀ formatting action ਨਾਲ ਸੰਬੰਧਿਤ Word shortcut ਕਿਹੜਾ ਹੈ?`,
      `${value} ਲਈ ਸਹੀ Windows desktop Word shortcut ਚੁਣੋ।`,
      `${value} ਕਰਨ ਵਾਲਾ Word key combination ਕਿਹੜਾ ਹੈ?`,
      `${value} ਕਿਹੜੇ Word shortcut ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
      `${value} ਲਈ ਸਹੀ shortcut-action pair ਕਿਹੜਾ ਹੈ?`,
    ], index);
    default: throw new Error(`Unsupported Punjabi COM-003 Wave-1 surface ${question.qlId}/${question.surfaceMode}`);
  }
}

function explanation(question: Com003ReviewQuestion, language: Com003TargetLanguage, localizedAnswer: string, index: number) {
  const entity = factEntity(question);
  const value = factValue(question, language);
  const hi = (() => {
    switch (`${question.qlId}:${question.surfaceMode}`) {
      case "COM-003-QL-001:APPLICATION_FROM_PURPOSE": return `${localizedAnswer} का मुख्य उपयोग ${value} है।`;
      case "COM-003-QL-001:SOFTWARE_CLASSIFICATION": return `${entity} को ${localizedAnswer} के रूप में वर्गीकृत किया जाता है।`;
      case "COM-003-QL-002:TYPE_TO_EXTENSION": return `${entity} ${value} की file extension है।`;
      case "COM-003-QL-002:EXTENSION_TO_TYPE": return `${entity} ${localizedAnswer} को दर्शाती है।`;
      case "COM-003-QL-003:EFFECT_TO_COMMAND": return `${localizedAnswer} command ${value}।`;
      case "COM-003-QL-003:COMMAND_TO_EFFECT": return `${entity} का कार्य है: ${localizedAnswer}।`;
      case "COM-003-QL-003:ACTION_TO_SHORTCUT": return `Windows desktop Office संदर्भ में ${localizedAnswer} shortcut का उपयोग ${value} के लिए किया जाता है।`;
      case "COM-003-QL-003:SHORTCUT_TO_ACTION": return `Windows desktop Office संदर्भ में ${entity} का कार्य है: ${localizedAnswer}।`;
      case "COM-003-QL-004:DOCUMENT_CONCEPT": return `${localizedAnswer} ${value} है।`;
      case "COM-003-QL-004:EDIT_ACTION_FROM_EFFECT": return `${localizedAnswer} वह Word editing action है जो ${value}।`;
      case "COM-003-QL-004:FORMAT_CONTROL_FROM_EFFECT": return `${localizedAnswer} वह Word formatting control है जो ${value}।`;
      case "COM-003-QL-004:ALIGNMENT_FROM_PROPERTY": return `${localizedAnswer} वह paragraph alignment है जो ${value}।`;
      case "COM-003-QL-004:FORMATTING_SHORTCUT": return `Windows desktop Word में ${localizedAnswer} का उपयोग ${value} के लिए किया जाता है।`;
      default: throw new Error(`Unsupported Hindi explanation surface ${question.qlId}/${question.surfaceMode}`);
    }
  })();
  const pa = (() => {
    switch (`${question.qlId}:${question.surfaceMode}`) {
      case "COM-003-QL-001:APPLICATION_FROM_PURPOSE": return `${localizedAnswer} ਦੀ ਮੁੱਖ ਵਰਤੋਂ ${value} ਲਈ ਹੁੰਦੀ ਹੈ।`;
      case "COM-003-QL-001:SOFTWARE_CLASSIFICATION": return `${entity} ਨੂੰ ${localizedAnswer} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
      case "COM-003-QL-002:TYPE_TO_EXTENSION": return `${entity} ${value} ਦੀ file extension ਹੈ।`;
      case "COM-003-QL-002:EXTENSION_TO_TYPE": return `${entity} ${localizedAnswer} ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।`;
      case "COM-003-QL-003:EFFECT_TO_COMMAND": return `${localizedAnswer} command ${value}।`;
      case "COM-003-QL-003:COMMAND_TO_EFFECT": return `${entity} ਦਾ ਕੰਮ ਹੈ: ${localizedAnswer}।`;
      case "COM-003-QL-003:ACTION_TO_SHORTCUT": return `Windows desktop Office ਸੰਦਰਭ ਵਿੱਚ ${localizedAnswer} shortcut ਦੀ ਵਰਤੋਂ ${value} ਲਈ ਹੁੰਦੀ ਹੈ।`;
      case "COM-003-QL-003:SHORTCUT_TO_ACTION": return `Windows desktop Office ਸੰਦਰਭ ਵਿੱਚ ${entity} ਦਾ ਕੰਮ ਹੈ: ${localizedAnswer}।`;
      case "COM-003-QL-004:DOCUMENT_CONCEPT": return `${localizedAnswer} ${value} ਹੈ।`;
      case "COM-003-QL-004:EDIT_ACTION_FROM_EFFECT": return `${localizedAnswer} ਉਹ Word editing action ਹੈ ਜੋ ${value}।`;
      case "COM-003-QL-004:FORMAT_CONTROL_FROM_EFFECT": return `${localizedAnswer} ਉਹ Word formatting control ਹੈ ਜੋ ${value}।`;
      case "COM-003-QL-004:ALIGNMENT_FROM_PROPERTY": return `${localizedAnswer} ਉਹ paragraph alignment ਹੈ ਜੋ ${value}।`;
      case "COM-003-QL-004:FORMATTING_SHORTCUT": return `Windows desktop Word ਵਿੱਚ ${localizedAnswer} ਦੀ ਵਰਤੋਂ ${value} ਲਈ ਹੁੰਦੀ ਹੈ।`;
      default: throw new Error(`Unsupported Punjabi explanation surface ${question.qlId}/${question.surfaceMode}`);
    }
  })();
  const base = language === "hi" ? hi : pa;
  const tails = language === "hi"
    ? ["इसलिए यही सही उत्तर है।", "अतः इसी विकल्प का चयन किया जाना चाहिए।", "इस कारण यह विकल्प दिए गए तथ्य से सही मेल खाता है।"]
    : ["ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।", "ਇਸ ਕਰਕੇ ਇਸੇ ਵਿਕਲਪ ਦੀ ਚੋਣ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।", "ਇਸ ਲਈ ਇਹ ਵਿਕਲਪ ਦਿੱਤੇ ਤੱਥ ਨਾਲ ਸਹੀ ਮਿਲਦਾ ਹੈ।"];
  return `${base} ${tails[index % tails.length]}`;
}

export function localizeCom003Wave1QuestionV1(question: Com003ReviewQuestion, language: Com003TargetLanguage, qlIndex: number): Com003LocalizedQuestionV1 {
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) throw new Error("COM-003 English must be frozen before localization.");
  if (!WAVE1_QLS.has(question.qlId)) throw new Error(`${question.qlId} is outside COM-003 localization Wave 1.`);
  const options = question.options.map((option) => localizeOption(option, language));
  const canonicalAnswer = options[question.correctIndex]!;
  return {
    localizationId: `${question.questionId}:${locale(language)}:AUTHORED-W1-V1`,
    sourceQuestionId: question.questionId,
    qlId: question.qlId,
    cpId: question.cpId,
    surfaceMode: question.surfaceMode,
    targetFactId: question.targetFactId,
    language,
    locale: locale(language),
    stem: language === "hi" ? stemHi(question, qlIndex) : stemPa(question, qlIndex),
    options,
    correctIndex: question.correctIndex,
    canonicalAnswer,
    explanation: explanation(question, language, canonicalAnswer, qlIndex),
    sourceIds: [...question.sourceIds],
    sourceFactIds: [...question.sourceFactIds],
    versionScoped: question.versionScoped,
    solverAuthority: question.solverAuthority,
    sourceEnglishFrozen: true,
    localizationReviewOnly: true,
    localizationFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
  };
}

function buildWave(language: Com003TargetLanguage) {
  return [...WAVE1_QLS].flatMap((qlId) =>
    COM003_ENGLISH_REVIEW_CORPUS_V4
      .filter((question) => question.qlId === qlId)
      .map((question, qlIndex) => localizeCom003Wave1QuestionV1(question, language, qlIndex)),
  );
}

export const COM003_HINDI_LOCALIZATION_WAVE1_V1 = Object.freeze(buildWave("hi"));
export const COM003_PUNJABI_LOCALIZATION_WAVE1_V1 = Object.freeze(buildWave("pa"));

export const COM003_LOCALIZATION_WAVE1_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-WAVE1-AUTHORED-V1" as const,
  englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  qlRange: "COM-003-QL-001..COM-003-QL-004" as const,
  qlCount: 4,
  englishSourceQuestionCount: 48,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V1.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE1_V1.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V1.length + COM003_PUNJABI_LOCALIZATION_WAVE1_V1.length,
  authoredTranslation: true,
  semanticParityReviewRequired: true,
  localizationFrozen: false,
  runtimeRegistered: false,
  questionStudioRegistrationAuthorized: false,
  productionReleased: false,
  nextGate: "COM003_LOCALIZATION_WAVE1_SEMANTIC_EDITORIAL_AUDIT_V1" as const,
});
