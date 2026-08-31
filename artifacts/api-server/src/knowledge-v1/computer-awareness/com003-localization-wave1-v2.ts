import {
  COM003_HINDI_LOCALIZATION_WAVE1_V1,
  COM003_LOCALIZATION_WAVE1_AUTHORITY_V1,
  COM003_PUNJABI_LOCALIZATION_WAVE1_V1,
  type Com003LocalizedQuestionV1,
} from "./com003-localization-wave1-v1";

const HI_WORD_PROCESSOR_STEMS = [
  "वर्ड प्रोसेसिंग के लिए मुख्य रूप से किस Microsoft Office एप्लिकेशन का उपयोग किया जाता है?",
  "टेक्स्ट दस्तावेज़ बनाने और संपादित करने के लिए कौन-सा Office एप्लिकेशन बनाया गया है?",
  "दस्तावेज़ लिखने, संपादित करने और फ़ॉर्मैट करने के लिए किस Microsoft एप्लिकेशन का प्रयोग किया जाता है?",
  "निम्न में से कौन-सा प्रोग्राम word-processing application है?",
  "पत्र और अन्य टेक्स्ट दस्तावेज़ तैयार करने के लिए सामान्यतः कौन-सा Office एप्लिकेशन उपयोग होता है?",
  "मानक word-processing tools प्रदान करने वाला Microsoft Office प्रोग्राम कौन-सा है?",
] as const;

const PA_WORD_PROCESSOR_STEMS = [
  "ਵਰਡ ਪ੍ਰੋਸੈਸਿੰਗ ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
  "ਟੈਕਸਟ ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ ਅਤੇ ਸੰਪਾਦਿਤ ਕਰਨ ਲਈ ਕਿਹੜੀ Office ਐਪਲੀਕੇਸ਼ਨ ਬਣਾਈ ਗਈ ਹੈ?",
  "ਦਸਤਾਵੇਜ਼ ਲਿਖਣ, ਸੰਪਾਦਿਤ ਕਰਨ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨ ਲਈ ਕਿਹੜੀ Microsoft ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
  "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਪ੍ਰੋਗਰਾਮ word-processing application ਹੈ?",
  "ਚਿੱਠੀਆਂ ਅਤੇ ਹੋਰ ਟੈਕਸਟ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰਨ ਲਈ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
  "ਮਿਆਰੀ word-processing tools ਦੇਣ ਵਾਲਾ Microsoft Office ਪ੍ਰੋਗਰਾਮ ਕਿਹੜਾ ਹੈ?",
] as const;

function remediate(items: readonly Com003LocalizedQuestionV1[]) {
  let wordProcessorIndex = 0;
  return items.map((item) => {
    if (item.qlId !== "COM-003-QL-004" || item.surfaceMode !== "DOCUMENT_CONCEPT" || item.targetFactId !== "com003-word-word-processor") {
      return item;
    }
    const stems = item.language === "hi" ? HI_WORD_PROCESSOR_STEMS : PA_WORD_PROCESSOR_STEMS;
    const stem = stems[wordProcessorIndex % stems.length]!;
    wordProcessorIndex += 1;
    return {
      ...item,
      localizationId: item.localizationId.replace("AUTHORED-W1-V1", "AUTHORED-W1-V2"),
      stem,
    };
  });
}

export const COM003_HINDI_LOCALIZATION_WAVE1_V2 = Object.freeze(remediate(COM003_HINDI_LOCALIZATION_WAVE1_V1));
export const COM003_PUNJABI_LOCALIZATION_WAVE1_V2 = Object.freeze(remediate(COM003_PUNJABI_LOCALIZATION_WAVE1_V1));

export const COM003_LOCALIZATION_WAVE1_AUTHORITY_V2 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE1_AUTHORITY_V1,
  authorityId: "COM-003-LOCALIZATION-WAVE1-AUTHORED-V2" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V2.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE1_V2.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE1_V2.length + COM003_PUNJABI_LOCALIZATION_WAVE1_V2.length,
  remediation: Object.freeze({
    ql004WordProcessorAnswerLeakRemoved: true,
  }),
  nextGate: "COM003_LOCALIZATION_WAVE1_SEMANTIC_EDITORIAL_AUDIT_V2" as const,
});
