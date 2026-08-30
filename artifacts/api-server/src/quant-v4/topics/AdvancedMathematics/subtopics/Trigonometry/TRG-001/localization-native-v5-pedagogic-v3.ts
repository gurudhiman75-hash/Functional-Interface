import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeV5PedagogicV2Final } from "./localization-native-v5-pedagogic-v2-final";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(value: unknown) {
  return String(value ?? "")
    .replace(/\s+([,;:!?।])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function hindi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/^यह निर्भर करता है पर न्यूनकोण कोण$/u, "यह चुने गए न्यूनकोण पर निर्भर करता है")
    .replace(/^तुलना निर्धारित नहीं किया जा सकता$/u, "तुलना निर्धारित नहीं की जा सकती")
    .replace(/^A के संदर्भ में, BC है सामने और AB कर्ण है।$/u, "∠A के संदर्भ में BC सामने वाली भुजा है और AB कर्ण है।")
    .replace(/^पहचानें भुजा भूमिकाएँ पहले चुनने से एक त्रिकोणमितीय अनुपात।$/u,
      "त्रिकोणमितीय अनुपात चुनने से पहले भुजाओं की भूमिकाएँ पहचानें।")
    .replace(/^अदला-बदली न करें सामने और सटी हुई भुजाएँ।$/u,
      "सामने वाली और सटी हुई भुजाओं की अदला-बदली न करें।")
    .replace(/^शामिल न करें कर्ण में टैन्जेंट।$/u, "tan θ के अनुपात में कर्ण शामिल नहीं होता।")
    .replace(/^ज्ञात कीजिए कर्ण, तब साइन का प्रयोग करें।$/u, "पहले कर्ण ज्ञात कीजिए, फिर sin θ का प्रयोग करें।")
    .replace(/^न रुकें बाद ज्ञात करने कर्ण।$/u, "कर्ण ज्ञात करने के बाद आवश्यक त्रिकोणमितीय अनुपात भी लगाएँ।")
    .replace(/^ज्ञात कीजिए कर्ण पहले बनाकर सेकेंट।$/u, "पहले कर्ण ज्ञात कीजिए, फिर sec θ बनाइए।")
    .replace(/^ज्ञात करें सटी हुई भुजा से पाइथागोरस, तब कोसाइन का प्रयोग करें।$/u,
      "पहले पाइथागोरस प्रमेय से सटी हुई भुजा ज्ञात करें, फिर cos θ का प्रयोग करें।")
    .replace(/^प्रयोग न करें दिए गए सामने वाली भुजा सीधे में कोसाइन।$/u,
      "cos θ में दी गई सामने वाली भुजा को सीधे न रखें; पहले सटी हुई भुजा ज्ञात करें।")
    .replace(/^ज्ञात करें सामने वाली भुजा से पाइथागोरस, तब टैन्जेंट का प्रयोग करें।$/u,
      "पहले पाइथागोरस प्रमेय से सामने वाली भुजा ज्ञात करें, फिर tan θ का प्रयोग करें।")
    .replace(/^स्केल साइन अनुपात त्रिभुज।$/u, "sin θ के अनुपात से बने त्रिभुज को समान अनुपात में स्केल करें।")
    .replace(/^स्केल कोसाइन अनुपात त्रिभुज।$/u, "cos θ के अनुपात से बने त्रिभुज को समान अनुपात में स्केल करें।")
    .replace(/^अनुपात न उलटें कोटैन्जेंट अनुपात।$/u, "cot θ का अनुपात उल्टा न लिखें।")
    .replace(/^पुनर्निर्मित करें न्यूनकोण समकोण त्रिभुज से साइन।$/u, "sin θ के अनुपात से न्यूनकोण वाला समकोण त्रिभुज पुनर्निर्मित करें।")
    .replace(/^न्यूनकोण θ चुनता है धनात्मक सटी हुई भुजा।$/u, "θ न्यूनकोण है, इसलिए सटी हुई भुजा धनात्मक लें।")
    .replace(/^पुनर्निर्मित करें समकोण त्रिभुज से कोसाइन।$/u, "cos θ के अनुपात से समकोण त्रिभुज पुनर्निर्मित करें।")
    .replace(/^सेकेंट निर्धारित करता है कर्ण:सटी हुई; ज्ञात करें सामने वाली भुजा।$/u,
      "sec θ से कर्ण:सटी हुई भुजा का अनुपात मिलता है; उससे सामने वाली भुजा ज्ञात करें।")
    .replace(/^उत्तर न दें सेकेंट जब टैन्जेंट है पूछा गया।$/u, "जब tan θ पूछा गया हो, तब sec θ को उत्तर न दें।")
    .replace(/^समझें कोटैन्जेंट के रूप में सटी हुई\/सामने।$/u, "cot θ को सटी हुई/सामने वाली भुजा के अनुपात के रूप में लें।")
    .replace(/^व्युत्क्रम पहले न लें कोटैन्जेंट पहले निर्धारित करते समय भुजा भूमिकाएँ।$/u,
      "cot θ का व्युत्क्रम लेने से पहले भुजाओं की भूमिकाएँ तय करें।")
    .replace(/^बनाएँ समकोण त्रिभुज से टैन्जेंट।$/u, "tan θ के अनुपात से समकोण त्रिभुज बनाएँ।")
    .replace(/^ज्ञात करें सामने वाली भुजा, तब कोसेकेंट का प्रयोग करें।$/u, "पहले सामने वाली भुजा ज्ञात करें, फिर cosec θ का प्रयोग करें।")
    .replace(/^मान न रखें सटी हुई भुजा जब केवल एक व्युत्क्रम है आवश्यक।$/u,
      "जब केवल व्युत्क्रम चाहिए, तब सटी हुई भुजा का अनावश्यक मान न निकालें।")
    .replace(/^रखें अंश और हर में दिए गए क्रम।$/u, "अंश और हर का दिया गया क्रम बनाए रखें।")
    .replace(/^रखें घटाव चिह्न।$/u, "घटाव का चिह्न बनाए रखें।")
    .replace(/^रखें वर्ग पर टैन्जेंट।$/u, "tan पद पर वर्ग बनाए रखें।")
    .replace(/^व्युत्क्रम पहले न लें सर्वसमिका।$/u, "सर्वसमिका सरल करने से पहले अनावश्यक व्युत्क्रम न लें।")
    .replace(/^पुनर्निर्मित करें कोसाइन से साइन अनुपात, तब मान रखें।$/u, "cos θ से समकोण त्रिभुज पुनर्निर्मित करें, फिर sin θ का मान रखें।")
    .replace(/^पुनर्निर्मित करें त्रिभुज, तब बनाएँ टैन्जेंट जोड़ कोटैन्जेंट।$/u, "पहले त्रिभुज पुनर्निर्मित करें, फिर tan θ+cot θ बनाइए।")
    .replace(/^मिलाएँ सेकेंट और कोसाइन के साथ एक समान हर।$/u, "sec θ और cos θ को समान हर पर लिखकर मिलाएँ।")
    .replace(/^पुनर्निर्मित करें साइन और कोसाइन से टैन्जेंट पहले घटाने पर उनका वर्ग।$/u,
      "पहले sin²θ और cos²θ का अंतर निकालें, फिर tan θ का अनुपात बनाएँ।")
    .replace(/^घटाएँ संयुग्मी समीकरण को अलग करें टैन्जेंट।$/u, "संयुग्मी समीकरणों को घटाकर tan θ को अलग करें।")
    .replace(/^ज्ञात करें संयुग्मी और घटाएँ।$/u, "संयुग्मी संबंध लिखें और दोनों समीकरण घटाएँ।")
    .replace(/^घटाएँ संयुग्मी समीकरण को अलग करें कोटैन्जेंट।$/u, "संयुग्मी समीकरणों को घटाकर cot θ को अलग करें।")
    .replace(/^अंतराल शर्त चुनता है धनात्मक मानक-कोण हल।$/u, "न्यूनकोण अंतराल की शर्त धनात्मक मानक-कोण वाला हल चुनती है।")
    .replace(/^मिलाएँ टैन्जेंट मान को न्यूनकोण मानक कोण।$/u, "tan θ के मान को संबंधित न्यूनकोण मानक कोण से मिलाएँ।")
    .replace(/^न चुनें व्युत्क्रम-मान कोण (\d+°)।$/u, "केवल व्युत्क्रम मान देखकर $1 न चुनें।")
    .replace(/^सरल करें व्युत्क्रम गुणनफल पहले।$/u, "पहले व्युत्क्रम गुणनफल को सरल करें।")
    .replace(/^रखें गुणक 1\/2।$/u, "1/2 का गुणक बनाए रखें।")
    .replace(/^cotθ देता है सटी हुई:सामने।$/u, "cot θ = सटी हुई भुजा/सामने वाली भुजा।")
    .replace(/^तुलना उलट जाता है जब टैन्जेंट पार कर करता है 1।$/u, "tan θ का मान 1 से बड़ा होने पर sin θ और cos θ की तुलना बदलती है।")
    .replace(/^तुलना उलट जाता है जब टैन्जेंट पार करता है 1।$/u, "tan θ का मान 1 से बड़ा होने पर sin θ और cos θ की तुलना बदलती है।");
  return finish(text);
}

function punjabi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/^ਇਹ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਤੇ ਨਿਊਨ ਕੋਣ ਕੋਣ$/u, "ਇਹ ਚੁਣੇ ਗਏ ਨਿਊਨ ਕੋਣ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ")
    .replace(/^ਤੁਲਨਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ$/u, "ਤੁਲਨਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ")
    .replace(/^A ਦੇ ਸਬੰਧ ਵਿੱਚ, BC ਹੈ ਸਾਹਮਣੇ ਅਤੇ AB ਕਰਣ ਹੈ।$/u, "∠A ਦੇ ਸਬੰਧ ਵਿੱਚ BC ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੈ ਅਤੇ AB ਕਰਣ ਹੈ।")
    .replace(/^ਪਛਾਣੋ ਭੁਜਾ ਭੂਮਿਕਾਵਾਂ ਪਹਿਲਾਂ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਤਿਕੋਣਮਿਤੀ ਅਨੁਪਾਤ।$/u,
      "ਤਿਕੋਣਮਿਤੀ ਅਨੁਪਾਤ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਭੁਜਾਵਾਂ ਦੀ ਭੂਮਿਕਾ ਪਛਾਣੋ।")
    .replace(/^ਅਦਲਾ-ਬਦਲੀ ਨਾ ਕਰੋ ਸਾਹਮਣੇ ਅਤੇ ਲੱਗਦੀ ਭੁਜਾਵਾਂ।$/u, "ਸਾਹਮਣੇ ਵਾਲੀ ਅਤੇ ਲੱਗਦੀ ਭੁਜਾਵਾਂ ਦੀ ਅਦਲਾ-ਬਦਲੀ ਨਾ ਕਰੋ।")
    .replace(/^ਸ਼ਾਮਲ ਨਾ ਕਰੋ ਕਰਣ ਵਿੱਚ ਟੈਂਜੈਂਟ।$/u, "tan θ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਕਰਣ ਸ਼ਾਮਲ ਨਹੀਂ ਹੁੰਦਾ।")
    .replace(/^ਕੱਢੋ ਕਰਣ, ਤਦ ਸਾਈਨ ਵਰਤੋ।$/u, "ਪਹਿਲਾਂ ਕਰਣ ਕੱਢੋ, ਫਿਰ sin θ ਵਰਤੋ।")
    .replace(/^ਨਾ ਰੁਕੋ ਬਾਅਦ ਕੱਢਣ ਕਰਣ।$/u, "ਕਰਣ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦਾ ਤਿਕੋਣਮਿਤੀ ਅਨੁਪਾਤ ਵੀ ਲਗਾਓ।")
    .replace(/^ਕੱਢੋ ਕਰਣ ਪਹਿਲਾਂ ਬਣਾ ਕੇ ਸੀਕੈਂਟ।$/u, "ਪਹਿਲਾਂ ਕਰਣ ਕੱਢੋ, ਫਿਰ sec θ ਬਣਾਓ।")
    .replace(/^ਕੱਢੋ ਲੱਗਦੀ ਭੁਜਾ ਨਾਲ ਪਾਇਥਾਗੋਰਸ, ਤਦ ਕੋਸਾਈਨ ਵਰਤੋ।$/u,
      "ਪਹਿਲਾਂ ਪਾਇਥਾਗੋਰਸ ਪ੍ਰਮੇਯ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਕੱਢੋ, ਫਿਰ cos θ ਵਰਤੋ।")
    .replace(/^ਨਾ ਦਿੱਤੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਸਿੱਧੇ ਵਿੱਚ ਕੋਸਾਈਨ ਵਰਤੋ।$/u,
      "cos θ ਵਿੱਚ ਦਿੱਤੀ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਸਿੱਧੀ ਨਾ ਵਰਤੋ; ਪਹਿਲਾਂ ਲੱਗਦੀ ਭੁਜਾ ਕੱਢੋ।")
    .replace(/^ਕੱਢੋ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਨਾਲ ਪਾਇਥਾਗੋਰਸ, ਤਦ ਟੈਂਜੈਂਟ ਵਰਤੋ।$/u,
      "ਪਹਿਲਾਂ ਪਾਇਥਾਗੋਰਸ ਪ੍ਰਮੇਯ ਨਾਲ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕੱਢੋ, ਫਿਰ tan θ ਵਰਤੋ।")
    .replace(/^ਸਕੇਲ ਸਾਈਨ ਅਨੁਪਾਤ ਤਿਕੋਣ।$/u, "sin θ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਬਣੇ ਤਿਕੋਣ ਨੂੰ ਇੱਕੋ ਅਨੁਪਾਤ ਵਿੱਚ ਸਕੇਲ ਕਰੋ।")
    .replace(/^ਸਕੇਲ ਕੋਸਾਈਨ ਅਨੁਪਾਤ ਤਿਕੋਣ।$/u, "cos θ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਬਣੇ ਤਿਕੋਣ ਨੂੰ ਇੱਕੋ ਅਨੁਪਾਤ ਵਿੱਚ ਸਕੇਲ ਕਰੋ।")
    .replace(/^ਅਨੁਪਾਤ ਨਾ ਉਲਟੋ ਕੋਟੈਂਜੈਂਟ ਅਨੁਪਾਤ।$/u, "cot θ ਦਾ ਅਨੁਪਾਤ ਉਲਟਾ ਨਾ ਲਿਖੋ।")
    .replace(/^ਮੁੜ ਬਣਾਓ ਨਿਊਨ ਕੋਣ ਸਮਕੋਣ ਤਿਕੋਣ ਤੋਂ ਸਾਈਨ।$/u, "sin θ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਨਿਊਨ ਕੋਣ ਵਾਲਾ ਸਮਕੋਣ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ।")
    .replace(/^ਨਿਊਨ ਕੋਣ θ ਚੁਣਦਾ ਹੈ ਧਨਾਤਮਕ ਲੱਗਦੀ ਭੁਜਾ।$/u, "θ ਨਿਊਨ ਕੋਣ ਹੈ, ਇਸ ਲਈ ਲੱਗਦੀ ਭੁਜਾ ਧਨਾਤਮਕ ਲਓ।")
    .replace(/^ਮੁੜ ਬਣਾਓ ਸਮਕੋਣ ਤਿਕੋਣ ਤੋਂ ਕੋਸਾਈਨ।$/u, "cos θ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਸਮਕੋਣ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ।")
    .replace(/^ਸੀਕੈਂਟ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ ਕਰਣ:ਲੱਗਦੀ; ਕੱਢੋ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ।$/u,
      "sec θ ਤੋਂ ਕਰਣ:ਲੱਗਦੀ ਭੁਜਾ ਦਾ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ; ਇਸ ਤੋਂ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕੱਢੋ।")
    .replace(/^ਉੱਤਰ ਨਾ ਦਿਓ ਸੀਕੈਂਟ ਜਦੋਂ ਟੈਂਜੈਂਟ ਹੈ ਪੁੱਛਿਆ ਗਿਆ।$/u, "ਜਦੋਂ tan θ ਪੁੱਛਿਆ ਹੋਵੇ, ਤਾਂ sec θ ਨੂੰ ਉੱਤਰ ਨਾ ਦਿਓ।")
    .replace(/^ਸਮਝੋ ਕੋਟੈਂਜੈਂਟ ਦੇ ਰੂਪ ਵਿੱਚ ਲੱਗਦੀ\/ਸਾਹਮਣੇ।$/u, "cot θ ਨੂੰ ਲੱਗਦੀ/ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਦੇ ਅਨੁਪਾਤ ਵਜੋਂ ਲਓ।")
    .replace(/^ਪਰਸਪਰ ਪਹਿਲਾਂ ਨਾ ਲਓ ਕੋਟੈਂਜੈਂਟ ਪਹਿਲਾਂ ਨਿਰਧਾਰਤ ਕਰਦੇ ਵੇਲੇ ਭੁਜਾ ਭੂਮਿਕਾਵਾਂ।$/u,
      "cot θ ਦਾ ਪਰਸਪਰ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਭੁਜਾਵਾਂ ਦੀ ਭੂਮਿਕਾ ਤੈਅ ਕਰੋ।")
    .replace(/^ਬਣਾਓ ਸਮਕੋਣ ਤਿਕੋਣ ਤੋਂ ਟੈਂਜੈਂਟ।$/u, "tan θ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਸਮਕੋਣ ਤਿਕੋਣ ਬਣਾਓ।")
    .replace(/^ਕੱਢੋ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ, ਤਦ ਕੋਸੀਕੈਂਟ ਵਰਤੋ।$/u, "ਪਹਿਲਾਂ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਕੱਢੋ, ਫਿਰ cosec θ ਵਰਤੋ।")
    .replace(/^ਮਾਨ ਨਾ ਰੱਖੋ ਲੱਗਦੀ ਭੁਜਾ ਜਦੋਂ ਕੇਵਲ ਇੱਕ ਪਰਸਪਰ ਹੈ ਲੋੜੀਂਦਾ।$/u,
      "ਜਦੋਂ ਕੇਵਲ ਪਰਸਪਰ ਚਾਹੀਦਾ ਹੋਵੇ, ਤਾਂ ਲੱਗਦੀ ਭੁਜਾ ਦਾ ਬੇਲੋੜਾ ਮਾਨ ਨਾ ਕੱਢੋ।")
    .replace(/^ਰੱਖੋ ਅੰਸ਼ ਅਤੇ ਹਰ ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਕ੍ਰਮ।$/u, "ਅੰਸ਼ ਅਤੇ ਹਰ ਦਾ ਦਿੱਤਾ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ।")
    .replace(/^ਰੱਖੋ ਘਟਾਓ ਚਿੰਨ੍ਹ।$/u, "ਘਟਾਓ ਦਾ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ।")
    .replace(/^ਰੱਖੋ ਵਰਗ ਤੇ ਟੈਂਜੈਂਟ।$/u, "tan ਪਦ ਉੱਤੇ ਵਰਗ ਕਾਇਮ ਰੱਖੋ।")
    .replace(/^ਪਰਸਪਰ ਪਹਿਲਾਂ ਨਾ ਲਓ ਸਰਬਸਮਿਕਾ।$/u, "ਸਰਬਸਮਿਕਾ ਸਰਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਬੇਲੋੜਾ ਪਰਸਪਰ ਨਾ ਲਓ।")
    .replace(/^ਮੁੜ ਬਣਾਓ ਕੋਸਾਈਨ ਤੋਂ ਸਾਈਨ ਅਨੁਪਾਤ, ਤਦ ਮਾਨ ਰੱਖੋ।$/u, "cos θ ਤੋਂ ਸਮਕੋਣ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ, ਫਿਰ sin θ ਦਾ ਮਾਨ ਲਗਾਓ।")
    .replace(/^ਮੁੜ ਬਣਾਓ ਤਿਕੋਣ, ਤਦ ਬਣਾਓ ਟੈਂਜੈਂਟ ਜੋੜ ਕੋਟੈਂਜੈਂਟ।$/u, "ਪਹਿਲਾਂ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ, ਫਿਰ tan θ+cot θ ਬਣਾਓ।")
    .replace(/^ਮਿਲਾਓ ਸੀਕੈਂਟ ਅਤੇ ਕੋਸਾਈਨ ਨਾਲ ਇੱਕ ਸਾਂਝਾ ਹਰ।$/u, "sec θ ਅਤੇ cos θ ਨੂੰ ਸਾਂਝੇ ਹਰ ਉੱਤੇ ਲਿਖ ਕੇ ਮਿਲਾਓ।")
    .replace(/^ਮੁੜ ਬਣਾਓ ਸਾਈਨ ਅਤੇ ਕੋਸਾਈਨ ਤੋਂ ਟੈਂਜੈਂਟ ਪਹਿਲਾਂ ਘਟਾਉਣ ਤੇ ਉਨ੍ਹਾਂ ਦਾ ਵਰਗ।$/u,
      "ਪਹਿਲਾਂ sin²θ ਅਤੇ cos²θ ਦਾ ਅੰਤਰ ਕੱਢੋ, ਫਿਰ tan θ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ।")
    .replace(/^ਘਟਾਓ ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਨੂੰ ਵੱਖ ਕਰੋ ਟੈਂਜੈਂਟ।$/u, "ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਘਟਾ ਕੇ tan θ ਨੂੰ ਵੱਖ ਕਰੋ।")
    .replace(/^ਕੱਢੋ ਸੰਯੁਗਮੀ ਅਤੇ ਘਟਾਓ।$/u, "ਸੰਯੁਗਮੀ ਸੰਬੰਧ ਲਿਖੋ ਅਤੇ ਦੋਵੇਂ ਸਮੀਕਰਨ ਘਟਾਓ।")
    .replace(/^ਘਟਾਓ ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਨੂੰ ਵੱਖ ਕਰੋ ਕੋਟੈਂਜੈਂਟ।$/u, "ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਘਟਾ ਕੇ cot θ ਨੂੰ ਵੱਖ ਕਰੋ।")
    .replace(/^ਅੰਤਰਾਲ ਸ਼ਰਤ ਚੁਣਦਾ ਹੈ ਧਨਾਤਮਕ ਮਿਆਰੀ-ਕੋਣ ਹੱਲ।$/u, "ਨਿਊਨ ਕੋਣ ਅੰਤਰਾਲ ਦੀ ਸ਼ਰਤ ਧਨਾਤਮਕ ਮਿਆਰੀ-ਕੋਣ ਵਾਲਾ ਹੱਲ ਚੁਣਦੀ ਹੈ।")
    .replace(/^ਮਿਲਾਓ ਟੈਂਜੈਂਟ ਮਾਨ ਨੂੰ ਨਿਊਨ ਕੋਣ ਮਿਆਰੀ ਕੋਣ।$/u, "tan θ ਦੇ ਮਾਨ ਨੂੰ ਸੰਬੰਧਿਤ ਨਿਊਨ ਮਿਆਰੀ ਕੋਣ ਨਾਲ ਮਿਲਾਓ।")
    .replace(/^ਨਾ ਚੁਣੋ ਪਰਸਪਰ-ਮਾਨ ਕੋਣ (\d+°)।$/u, "ਕੇਵਲ ਪਰਸਪਰ ਮਾਨ ਦੇ ਆਧਾਰ ਤੇ $1 ਨਾ ਚੁਣੋ।")
    .replace(/^ਸਰਲ ਕਰੋ ਪਰਸਪਰ ਗੁਣਨਫਲ ਪਹਿਲਾਂ।$/u, "ਪਹਿਲਾਂ ਪਰਸਪਰ ਗੁਣਨਫਲ ਨੂੰ ਸਰਲ ਕਰੋ।")
    .replace(/^A ਅਨੁਪਾਤ ਦਾ ਪਰਸਪਰ ਵਰਗ ਉਲਟ ਜਾਂਦਾ ਹੈ ਵਿੱਚ ਸੰਬੰਧਿਤ ਟੈਂਜੈਂਟ\/ਕੋਟੈਂਜੈਂਟ ਵਰਗ।$/u,
      "ਅਨੁਪਾਤ ਦਾ ਪਰਸਪਰ ਲੈ ਕੇ ਵਰਗ ਕਰਨ ਨਾਲ ਸੰਬੰਧਿਤ tan/cot ਵਰਗ ਉਲਟ ਜਾਂਦਾ ਹੈ।")
    .replace(/^ਰੱਖੋ ਗੁਣਕ 1\/2।$/u, "1/2 ਦਾ ਗੁਣਕ ਕਾਇਮ ਰੱਖੋ।")
    .replace(/^cotθ ਦਿੰਦਾ ਹੈ ਲੱਗਦੀ:ਸਾਹਮਣੇ।$/u, "cot θ = ਲੱਗਦੀ ਭੁਜਾ/ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ।")
    .replace(/^ਤੁਲਨਾ ਉਲਟ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਟੈਂਜੈਂਟ ਪਾਰ ਕਰਦਾ ਹੈ 1।$/u,
      "tan θ ਦਾ ਮਾਨ 1 ਤੋਂ ਵੱਧ ਹੋਣ ਤੇ sin θ ਅਤੇ cos θ ਦੀ ਤੁਲਨਾ ਬਦਲਦੀ ਹੈ।");
  return finish(text);
}

export function normalizeTrg001NativePedagogicV3(value: unknown, locale: Locale) {
  return locale === "hi-IN" ? hindi(value) : punjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: normalizeTrg001NativePedagogicV3(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: normalizeTrg001NativePedagogicV3(step.title, locale),
      body: normalizeTrg001NativePedagogicV3(step.body, locale),
    })),
    shortcut: normalizeTrg001NativePedagogicV3(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => normalizeTrg001NativePedagogicV3(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativePedagogicV3(localized: AnyQuestion, locale: Locale) {
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: normalizeTrg001NativePedagogicV3(option.display, locale),
  }));
  const explanation = mapExplanation(localized.explanation, locale);
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem: localized.stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
  });

  return {
    ...localized,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V3" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false as const,
    freezeEligible: false as const,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V3" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint,
      learnerSurfaceSource: "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_NATIVE_EDITORIAL_V3" as const,
      v5PedagogicV3Overlay: true as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativePedagogicV3(qlId: string, seed: string, locale: Locale) {
  return finalizeLocalizedTrg001QuestionNativePedagogicV3(
    generateLocalizedTrg001QuestionNativeV5PedagogicV2Final(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
