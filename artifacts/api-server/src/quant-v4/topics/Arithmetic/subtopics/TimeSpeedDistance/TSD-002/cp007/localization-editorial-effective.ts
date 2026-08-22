import { TSD_CP007_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP007_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp007LocalizedQlSpec } from "./localization-authoring";

interface FamilyOverride {
  readonly stem?: string;
  readonly explanationGuide?: string;
}

const HI_OVERRIDES: Readonly<Record<string, FamilyOverride>> = Object.freeze({
  "88-B": Object.freeze({ explanationGuide: "पूरी तरह पार करते समय तय कुल दूरी चाल × {crossingTime} है। इसमें से ट्रेन की लंबाई {trainLength} घटाने पर पुल की लंबाई मिलेगी।" }),
  "88-E": Object.freeze({ explanationGuide: "आवश्यक हो तो चाल को m/s में बदलें। चाल × {crossingTime} से कुल पार-दूरी निकालें और उसमें से {trainLength} घटाएं।" }),
  "90-C": Object.freeze({ explanationGuide: "पेड़ और सुरंग को पार करने के समयों का अंतर केवल सुरंग की लंबाई तय करने का समय है। {objectLength} को इस अतिरिक्त समय से भाग दें।" }),
  "90-D": Object.freeze({ explanationGuide: "स्थिर व्यक्ति को पार करने का समय बिंदु-पार समय का आधार है। प्लेटफॉर्म की अतिरिक्त दूरी {objectLength} m को अतिरिक्त समय {crossingTime} − {pointTime} से भाग दें।" }),
  "91-A": Object.freeze({ explanationGuide: "दोनों बार पूरी तरह पार करते समय ट्रेन की अपनी लंबाई समान रहती है और घटाने पर कट जाती है। लंबाई का अंतर = चाल × |{timeA} − {timeB}|।" }),
  "91-C": Object.freeze({ stem: "{speed} की चाल से चलती ट्रेन पहली सुरंग को {timeA} सेकंड में और दूसरी सुरंग को {timeB} सेकंड में पार करती है। दोनों सुरंगों की लंबाइयों का अंतर ज्ञात करें।" }),
  "91-D": Object.freeze({ explanationGuide: "दोनों पूर्ण-पार दूरियों को घटाने पर ट्रेन की लंबाई कट जाती है। इसलिए पुलों की लंबाई का अंतर = चाल × |{timeA} − {timeB}|।" }),
  "92-A": Object.freeze({ explanationGuide: "पूरी ट्रेन अंदर रहने की अवधि पीछे के सिरे के प्रवेश से आगे के सिरे के सुरंग के दूसरे छोर तक पहुंचने तक है। इस दौरान दूरी {objectLength} − {trainLength} है; इसे चाल से भाग दें।" }),
  "92-C": Object.freeze({
    stem: "{trainLength} m लंबी ट्रेन {speed} की चाल से {objectLength} m लंबे प्लेटफॉर्म के किनारे से गुजरती है। उसके पिछले सिरे के प्लेटफॉर्म में प्रवेश करने से लेकर अगले सिरे के प्लेटफॉर्म के दूसरे छोर तक पहुंचने का समय ज्ञात करें।",
    explanationGuide: "इस अवधि में पूरी ट्रेन प्लेटफॉर्म की लंबाई के भीतर होती है। तय दूरी {objectLength} − {trainLength} है; इसे चाल से भाग दें।",
  }),
  "93-A": Object.freeze({ explanationGuide: "आगे के सिरे के प्रवेश से पीछे के सिरे के निकास तक कुल दूरी {trainLength} + {objectLength} है। इसे चाल से भाग कर मिली अवधि {clockTime} में जोड़ें।" }),
  "93-B": Object.freeze({ explanationGuide: "पीछे के सिरे के निकास से आगे के सिरे के प्रवेश तक की अवधि ({trainLength} + {objectLength}) ÷ चाल है। इसे {clockTime} से घटाएं।" }),
  "93-C": Object.freeze({ explanationGuide: "एक ही स्थिर पोस्ट पर इंजन से पीछे के सिरे तक की अवधि {trainLength} ÷ चाल है। इस अवधि को {clockTime} में जोड़ें।" }),
  "93-E": Object.freeze({ explanationGuide: "पीछे के सिरे के प्रवेश से आगे के सिरे के निकास तक की अवधि ({objectLength} − {trainLength}) ÷ चाल है। इसे {clockTime} से घटाएं।" }),
  "94-C": Object.freeze({
    stem: "एक ट्रेन {distance} m चलती है और {pointCount} समान दूरी पर लगे लैंप पोस्ट गिने जाते हैं। {endpointConvention}। लगातार दो पोस्टों के बीच की दूरी ज्ञात करें।",
    explanationGuide: "{endpointConvention}। इस नियम के अनुसार गिने गए पोस्टों को सही अंतरालों की संख्या में बदलें और फिर {distance} को अंतरालों की संख्या से भाग दें।",
  }),
  "94-D": Object.freeze({
    stem: "सिग्नल पोस्ट {spacing} m की दूरी पर लगे हैं। {timeWindow} सेकंड में {pointCount} पोस्ट गिने जाते हैं। {endpointConvention}। ट्रेन की चाल ज्ञात करें।",
    explanationGuide: "{endpointConvention}। इस नियम से पोस्टों की संख्या को अंतरालों में बदलें। दूरी = अंतराल × {spacing}; फिर इसे {timeWindow} से भाग दें।",
  }),
  "94-E": Object.freeze({
    stem: "रेलवे लाइन के किनारे बिजली के खंभे {spacing} m की दूरी पर हैं। ट्रेन {distance} m चलती है और {endpointConvention}। कितने खंभे गिने जाएंगे?",
    explanationGuide: "{distance}/{spacing} से समान अंतरालों की संख्या मिलती है। {endpointConvention}। इसी के अनुसार शुरुआती खंभे को गिनती में जोड़ें या न जोड़ें।",
  }),
  "94-F": Object.freeze({
    stem: "पटरी किनारे के स्तंभ {spacing} m की दूरी पर हैं। {timeWindow} सेकंड में {pointCount} स्तंभ गिने जाते हैं। {endpointConvention}। ट्रेन की चाल ज्ञात करें।",
    explanationGuide: "{endpointConvention}। इस नियम के अनुसार स्तंभों की संख्या को अंतरालों में बदलें। दूरी = अंतराल × {spacing}; इसे {timeWindow} से भाग देने पर चाल मिलेगी।",
  }),
});

const PA_OVERRIDES: Readonly<Record<string, FamilyOverride>> = Object.freeze({
  "85-D": Object.freeze({ explanationGuide: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਦੀ ਦੂਰੀ {trainLength} + {objectLength} ਹੈ। ਲੋੜ ਪਏ ਤਾਂ ਗਤੀ m/s ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਗਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।" }),
  "88-B": Object.freeze({ explanationGuide: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੇ ਸਮੇਂ ਤੈਅ ਕੁੱਲ ਦੂਰੀ ਗਤੀ × {crossingTime} ਹੈ। ਇਸ ਵਿੱਚੋਂ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ {trainLength} ਘਟਾਉਣ ਨਾਲ ਪੁਲ ਦੀ ਲੰਬਾਈ ਮਿਲੇਗੀ।" }),
  "88-E": Object.freeze({ explanationGuide: "ਲੋੜ ਪਏ ਤਾਂ ਗਤੀ m/s ਵਿੱਚ ਬਦਲੋ। ਗਤੀ × {crossingTime} ਨਾਲ ਕੁੱਲ ਪਾਰ-ਦੂਰੀ ਕੱਢੋ ਅਤੇ {trainLength} ਘਟਾਓ।" }),
  "90-D": Object.freeze({ explanationGuide: "ਸਥਿਰ ਵਿਅਕਤੀ ਨੂੰ ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ ਬਿੰਦੂ-ਪਾਰ ਸਮੇਂ ਦਾ ਅਧਾਰ ਹੈ। {objectLength} ਨੂੰ ਵਾਧੂ ਸਮਾਂ {crossingTime} − {pointTime} ਨਾਲ ਭਾਗ ਦਿਓ।" }),
  "91-A": Object.freeze({ explanationGuide: "ਦੋਵੇਂ ਵਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੇ ਸਮੇਂ ਰੇਲਗੱਡੀ ਦੀ ਆਪਣੀ ਲੰਬਾਈ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਘਟਾਉਣ ਉੱਤੇ ਰੱਦ ਹੋ ਜਾਂਦੀ ਹੈ। ਫਰਕ = ਗਤੀ × |{timeA} − {timeB}|।" }),
  "91-C": Object.freeze({ stem: "{speed} ਦੀ ਗਤੀ ਨਾਲ ਰੇਲਗੱਡੀ ਪਹਿਲੀ ਸੁਰੰਗ ਨੂੰ {timeA} ਸਕਿੰਟ ਵਿੱਚ ਅਤੇ ਦੂਜੀ ਸੁਰੰਗ ਨੂੰ {timeB} ਸਕਿੰਟ ਵਿੱਚ ਪਾਰ ਕਰਦੀ ਹੈ। ਦੋਵੇਂ ਸੁਰੰਗਾਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਦਾ ਫਰਕ ਕੱਢੋ।" }),
  "91-D": Object.freeze({ explanationGuide: "ਦੋਵੇਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਨੂੰ ਘਟਾਉਣ ਉੱਤੇ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਰੱਦ ਹੋ ਜਾਂਦੀ ਹੈ। ਫਰਕ = ਗਤੀ × |{timeA} − {timeB}|।" }),
  "92-C": Object.freeze({
    stem: "{trainLength} m ਲੰਮੀ ਰੇਲਗੱਡੀ {speed} ਦੀ ਗਤੀ ਨਾਲ {objectLength} m ਲੰਮੇ ਪਲੇਟਫਾਰਮ ਦੇ ਨਾਲ-ਨਾਲ ਲੰਘਦੀ ਹੈ। ਇਸਦੇ ਪਿਛਲੇ ਸਿਰੇ ਦੇ ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਤੋਂ ਅੱਗੇਲੇ ਸਿਰੇ ਦੇ ਦੂਜੇ ਛੋਰ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
    explanationGuide: "ਇਸ ਸਮੇਂ ਦੌਰਾਨ ਪੂਰੀ ਰੇਲਗੱਡੀ ਪਲੇਟਫਾਰਮ ਦੀ ਲੰਬਾਈ ਦੇ ਅੰਦਰ ਹੁੰਦੀ ਹੈ। ਤੈਅ ਦੂਰੀ {objectLength} − {trainLength} ਹੈ; ਇਸਨੂੰ ਗਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
  }),
  "93-A": Object.freeze({ explanationGuide: "ਅੱਗੇਲੇ ਸਿਰੇ ਦੇ ਦਾਖਲੇ ਤੋਂ ਪਿਛਲੇ ਸਿਰੇ ਦੇ ਨਿਕਾਸ ਤੱਕ ਕੁੱਲ ਦੂਰੀ {trainLength} + {objectLength} ਹੈ। ਇਸਨੂੰ ਗਤੀ ਨਾਲ ਭਾਗ ਕਰਕੇ {clockTime} ਵਿੱਚ ਜੋੜੋ।" }),
  "93-B": Object.freeze({ explanationGuide: "ਪਿਛਲੇ ਸਿਰੇ ਦੇ ਨਿਕਾਸ ਤੋਂ ਅੱਗੇਲੇ ਸਿਰੇ ਦੇ ਦਾਖਲੇ ਤੱਕ ਦਾ ਸਮਾਂ ({trainLength} + {objectLength}) ÷ ਗਤੀ ਹੈ। ਇਸਨੂੰ {clockTime} ਤੋਂ ਘਟਾਓ।" }),
  "93-C": Object.freeze({ explanationGuide: "ਇੱਕੋ ਸਥਿਰ ਪੋਸਟ ਉੱਤੇ ਇੰਜਣ ਤੋਂ ਪਿਛਲੇ ਸਿਰੇ ਤੱਕ ਦਾ ਸਮਾਂ {trainLength} ÷ ਗਤੀ ਹੈ। ਇਸਨੂੰ {clockTime} ਵਿੱਚ ਜੋੜੋ।" }),
  "93-E": Object.freeze({ explanationGuide: "ਪਿਛਲੇ ਸਿਰੇ ਦੇ ਦਾਖਲੇ ਤੋਂ ਅੱਗੇਲੇ ਸਿਰੇ ਦੇ ਨਿਕਾਸ ਤੱਕ ਦਾ ਸਮਾਂ ({objectLength} − {trainLength}) ÷ ਗਤੀ ਹੈ। ਇਸਨੂੰ {clockTime} ਤੋਂ ਘਟਾਓ।" }),
  "94-C": Object.freeze({
    stem: "ਰੇਲਗੱਡੀ {distance} m ਤੈਅ ਕਰਦੀ ਹੈ ਅਤੇ {pointCount} ਬਰਾਬਰ ਫਾਸਲੇ ਵਾਲੇ ਲੈਂਪ ਪੋਸਟ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। {endpointConvention}। ਲਗਾਤਾਰ ਦੋ ਪੋਸਟਾਂ ਵਿਚਲਾ ਫਾਸਲਾ ਕੱਢੋ।",
    explanationGuide: "{endpointConvention}। ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ਗਿਣੇ ਪੋਸਟਾਂ ਨੂੰ ਸਹੀ ਫਾਸਲਿਆਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਫਿਰ {distance} ਨੂੰ ਉਸ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
  }),
  "94-D": Object.freeze({
    stem: "ਸਿਗਨਲ ਪੋਸਟ {spacing} m ਦੇ ਫਾਸਲੇ ਉੱਤੇ ਹਨ। {timeWindow} ਸਕਿੰਟ ਵਿੱਚ {pointCount} ਪੋਸਟ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। {endpointConvention}। ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ਕੱਢੋ।",
    explanationGuide: "{endpointConvention}। ਇਸ ਨਿਯਮ ਨਾਲ ਪੋਸਟਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਫਾਸਲਿਆਂ ਵਿੱਚ ਬਦਲੋ। ਦੂਰੀ = ਫਾਸਲੇ × {spacing}; ਫਿਰ {timeWindow} ਨਾਲ ਭਾਗ ਦਿਓ।",
  }),
  "94-E": Object.freeze({
    stem: "ਰੇਲਵੇ ਲਾਈਨ ਕੋਲ ਬਿਜਲੀ ਦੇ ਖੰਭੇ {spacing} m ਦੇ ਫਾਸਲੇ ਉੱਤੇ ਹਨ। ਰੇਲਗੱਡੀ {distance} m ਤੈਅ ਕਰਦੀ ਹੈ ਅਤੇ {endpointConvention}। ਕਿੰਨੇ ਖੰਭੇ ਗਿਣੇ ਜਾਣਗੇ?",
    explanationGuide: "{distance}/{spacing} ਨਾਲ ਬਰਾਬਰ ਫਾਸਲਿਆਂ ਦੀ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ। {endpointConvention}। ਇਸੇ ਨਿਯਮ ਅਨੁਸਾਰ ਸ਼ੁਰੂਆਤੀ ਖੰਭੇ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚ ਜੋੜੋ ਜਾਂ ਨਾ ਜੋੜੋ।",
  }),
  "94-F": Object.freeze({
    stem: "ਪਟੜੀ ਕਿਨਾਰੇ ਦੇ ਸਤੰਭ {spacing} m ਦੇ ਫਾਸਲੇ ਉੱਤੇ ਹਨ। {timeWindow} ਸਕਿੰਟ ਵਿੱਚ {pointCount} ਸਤੰਭ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। {endpointConvention}। ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ਕੱਢੋ।",
    explanationGuide: "{endpointConvention}। ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ਸਤੰਭਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਫਾਸਲਿਆਂ ਵਿੱਚ ਬਦਲੋ। ਦੂਰੀ = ਫਾਸਲੇ × {spacing}; ਇਸਨੂੰ {timeWindow} ਨਾਲ ਭਾਗ ਦਿਓ।",
  }),
});

function applyOverrides(
  registry: readonly TsdCp007LocalizedQlSpec[],
  overrides: Readonly<Record<string, FamilyOverride>>,
): readonly TsdCp007LocalizedQlSpec[] {
  return Object.freeze(registry.map((ql) => Object.freeze({
    ...ql,
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => {
      const override = overrides[family.familyId];
      return override ? Object.freeze({ ...family, ...override }) : family;
    })),
  })));
}

export const TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION = applyOverrides(TSD_CP007_HINDI_LOCALIZATION, HI_OVERRIDES);
export const TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION = applyOverrides(TSD_CP007_PUNJABI_LOCALIZATION, PA_OVERRIDES);
