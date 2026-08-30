import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal2 } from "./localization-native-v5-pedagogic-review-final2";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL3" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(value: unknown) {
  return String(value ?? "")
    .replace(/([0-9A-Za-z√²θ]+)।\s+(मिलता है|मिलता|ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ|ਮਿਲਦਾ ਹੈ)/gu, "$1 $2")
    .replace(/\s+([,;:!?।])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function polishHindi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/^सटीक करनी के स्थान पर एक दशमलव न रखें[।.]?$/u, "सटीक करणी के स्थान पर दशमलव न रखें।")
    .replace(/^टैन्जेंट है sin\/cos, नहीं किसी भी मान अकेले[।.]?$/u, "tan θ = sin θ/cos θ; किसी एक मान को अकेले tan न मानें।")
    .replace(/^व्युत्क्रम-गुणनफल शॉर्टकट काम करता केवल यही क्योंकि कोण हैं समान[।.]?$/u, "व्युत्क्रम-गुणनफल का शॉर्टकट केवल समान कोण के लिए काम करता है।")
    .replace(/^सेकेंट और कोसेकेंट नहीं हैं व्युत्क्रम का एक-दूसरे[।.]?$/u, "sec और cosec एक-दूसरे के व्युत्क्रम नहीं हैं।")
    .replace(/^बनाए रखें अंतिम घटाव चिह्न[।.]?$/u, "अंतिम घटाव चिह्न बनाए रखें।")
    .replace(/^गुणा न करें से 360[।.]?$/u, "360 से गुणा न करें।")
    .replace(/^साइन और कोसाइन अदला-बदली करें के लिए पूरक कोणों के लिए[।.]?$/u, "पूरक कोणों में sin और cos की अदला-बदली करें।")
    .replace(/^रेडियन रूपांतरण और चतुर्थांश चिह्न हैं अलग चरण[।.]?$/u, "रेडियन रूपांतरण और चतुर्थांश का चिह्न अलग-अलग चरण हैं।")
    .replace(/^गैर-शून्य शर्त सुरक्षित रखती है हर[।.]?$/u, "गैर-शून्य शर्त सुनिश्चित करती है कि हर शून्य न हो।")
    .replace(/^सर्वसमिका पहले मान रखने पर दशमलव का प्रयोग करें[।.]?$/u, "मान रखने से पहले सर्वसमिका का प्रयोग करें; दशमलव से बचें।")
    .replace(/^लागू होता है को त्रिकोणमितीय मान का वर्ग लें[।.]?$/u, "सर्वसमिका त्रिकोणमितीय मानों के वर्गों पर लागू होती है।")
    .replace(/^यह है उलटें दिशा का 1\+tan²θ=sec²θ[।.]?$/u, "1+tan²θ=sec²θ को पुनर्व्यवस्थित करें।")
    .replace(/^सर्वसमिका में होता है cot²θ[।.]?$/u, "सर्वसमिका में cot²θ आता है।")
    .replace(/^व्युत्क्रम फलन गुणा करके 1, 0 नहीं[।.]?$/u, "किसी मान और उसके व्युत्क्रम का गुणनफल 1 होता है, 0 नहीं।")
    .replace(/^मान न रखें लगभग दशमलव[।.]?$/u, "लगभग दशमलव मान न रखें।")
    .replace(/^पुनर्लिखें secθ−cosθ प्रयोग करके एक समान हर[।.]?$/u, "secθ−cosθ को समान हर में लिखें।")
    .replace(/^सर्वसमिका पहले मान रखने से मानक मान का प्रयोग करें[।.]?$/u, "मान रखने से पहले सर्वसमिका लगाएँ और सटीक मान रखें।")
    .replace(/^o²\+a²=h² जब जोड़ने पर व्युत्क्रम अनुपात का प्रयोग करें[।.]?$/u, "व्युत्क्रम अनुपात जोड़ते समय o²+a²=h² का प्रयोग करें।")
    .replace(/^टैन्जेंट को पुनर्निर्मित करें सेकेंट और कोसाइन का प्रयोग करें[।.]?$/u, "sec θ और cos θ की सहायता से tan θ पुनर्निर्मित करें।")
    .replace(/^न जोड़ें 1 को दिया गया मान; संयुग्मी गुणनफल सर्वसमिका का प्रयोग करें[।.]?$/u, "दिए गए मान में 1 न जोड़ें; संयुग्मी गुणनफल सर्वसमिका लगाएँ।")
    .replace(/^कोसेकेंट-कोटैन्जेंट संयुग्मी युग्म गुणा करके 1[।.]?$/u, "(cosecθ−cotθ)(cosecθ+cotθ)=1 का प्रयोग करें।")
    .replace(/^कोसेकेंट-कोटैन्जेंट सर्वसमिका, नहीं सेकेंट-टैन्जेंट एक यांत्रिक रूप से का प्रयोग करें[।.]?$/u, "cosec–cot सर्वसमिका का प्रयोग करें; sec–tan वाली सर्वसमिका को यांत्रिक रूप से न लगाएँ।")
    .replace(/^क्रॉस पद है 2sinθcosθ, नहीं sinθcosθ[।.]?$/u, "क्रॉस पद 2sinθcosθ है, केवल sinθcosθ नहीं।")
    .replace(/^क्रॉस पद है 2sinθcosθ[।.]?$/u, "क्रॉस पद 2sinθcosθ है।")
    .replace(/^cos θ से भाग दें, फिर अलग करें tan θ[।.]?$/u, "cos θ से भाग देकर tan θ को अलग करें।")
    .replace(/^गुणांक अनुपात उलट जाता है जब बदलते समय से tan को cot[।.]?$/u, "tan से cot में बदलते समय गुणांक अनुपात उलट जाता है।")
    .replace(/^चक्कर प्रत्येक कोष्ठक में एक व्युत्क्रम युग्म, तब गुणा करें[।.]?$/u, "हर कोष्ठक में व्युत्क्रम युग्म पहचानें, फिर गुणा करें।")
    .replace(/^लागू न करें एक एक ही सर्वसमिका को दोनों कोष्ठक[।.]?$/u, "दोनों कोष्ठकों पर एक ही सर्वसमिका न लगाएँ।")
    .replace(/^रुकने पर पर tan²\/cot² छूट जाता है एक और व्युत्क्रम सरलीकरण[।.]?$/u, "tan²/cot² पर न रुकें; एक और व्युत्क्रम सरलीकरण आवश्यक है।")
    .replace(/^न छोड़ें गुणक 2[।.]?$/u, "गुणक 2 न छोड़ें।")
    .replace(/^गुणनफल अतः सरल हो जाता है को (.+?)[।.]?$/u, "अतः गुणनफल $1 रह जाता है।")
    .replace(/^30°\/60° टैन्जेंट या कोटैन्जेंट युग्म गुणा होकर को 1[।.]?$/u, "30° और 60° के tan/cot व्युत्क्रम युग्म का गुणनफल 1 होता है।")
    .replace(/^न भूलें को वर्ग 45° साइन\/कोसाइन मान[।.]?$/u, "45° के sin/cos मान का वर्ग लेना न भूलें।")
    .replace(/^तीन कोण हैं भिन्न, इसलिए मान ज्ञात कीजिए इनका अलग-अलग की बजाय प्रयोग करके एक समान-कोण सर्वसमिका[।.]?$/u, "तीनों कोण अलग हैं; प्रत्येक का मान अलग-अलग ज्ञात करें।")
    .replace(/^गणना करें (.+?)[।.]?$/u, "$1 की गणना करें।")
    .replace(/^यह है (√[^।.]+?)[।.]?$/u, "$1।")
    .replace(/^साइन और कोसाइन नहीं किया जा सकता स्वतंत्र रूप से प्राप्त कर सकते 1 पर एक ही कोण[।.]?$/u, "एक ही θ के लिए sinθ और cosθ दोनों स्वतंत्र रूप से 1 नहीं हो सकते।")
    .replace(/^ऋणात्मक आयाम के लिए न्यूनतम का प्रयोग करें[।.]?$/u, "न्यूनतम मान के लिए −R लें।")
    .replace(/^प्रतिस्थापित न करें (.+?) के साथ (.+?)[।.]?$/u, "$1 के स्थान पर $2 न रखें।")
    .replace(/^भ्रमित न हों (.+?) के साथ (.+?)[।.]?$/u, "$1 और $2 को आपस में न मिलाएँ।")
    .replace(/^व्युत्क्रम लें साइन, नहीं कोसाइन[।.]?$/u, "sin का व्युत्क्रम लें, cos का नहीं।")
    .replace(/^पहचानें पूरक बराबर मान पहले जोड़ने पर[।.]?$/u, "पहले पूरक कोणों के बराबर मान पहचानें, फिर जोड़ें।")
    .replace(/^90° का स्थानांतरण फलन के साथ चिह्न भी बदलता है[।.]?$/u, "90° के स्थानांतरण पर फलन के साथ चिह्न भी बदल सकता है।")
    .replace(/^न काटें के आर-पार जोड़; यहाँ प्रत्येक क्रिया है गुणात्मक[।.]?$/u, "जोड़ के आर-पार पदों को न काटें; यहाँ प्रत्येक क्रिया गुणात्मक है।")
    .replace(/^व्युत्क्रम लें दोनों भुजाएँ का सेकेंट सर्वसमिका[।.]?$/u, "sec की सर्वसमिका के दोनों पक्षों का व्युत्क्रम लें।")
    .replace(/^चिह्न निश्चित नहीं है; न्यूनकोण θ के 45° के आर-पार जाने पर यह बदलता है[।.]?$/u, "चिह्न निश्चित नहीं है; न्यूनकोण θ के 45° को पार करने पर यह बदलता है।")
    .replace(/^sin30° पहले जोड़ने पर का वर्ग लें[।.]?$/u, "sin30° का वर्ग उसी पद में लें; जोड़ करने से पहले मान ज्ञात करें।")
    .replace(/^न काटें (.+?) के साथ (.+?) क्योंकि कोण भिन्न हैं[।.]?$/u, "$1 और $2 को परस्पर न काटें; उनके कोण भिन्न हैं।")
    .replace(/([^।.]+?) से से भाग देने पर ([^।.]+?)[।.]? मिलता है[।.]?$/u, "$1 से भाग देने पर $2 मिलता है।")
    .replace(/([^।.]+?)। मिलता है[।.]?$/u, "$1 मिलता है।");
  return finish(text);
}

function polishPunjabi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/ਪਹਿਲਾ ਚਤੁਰਭਾਗ ਵਿੱਚ/gu, "ਪਹਿਲੇ ਚਤੁਰਭਾਗ ਵਿੱਚ")
    .replace(/ਦੂਜਾ ਚਤੁਰਭਾਗ ਵਿੱਚ/gu, "ਦੂਜੇ ਚਤੁਰਭਾਗ ਵਿੱਚ")
    .replace(/ਤੀਜਾ ਚਤੁਰਭਾਗ ਵਿੱਚ/gu, "ਤੀਜੇ ਚਤੁਰਭਾਗ ਵਿੱਚ")
    .replace(/ਚੌਥਾ ਚਤੁਰਭਾਗ ਵਿੱਚ/gu, "ਚੌਥੇ ਚਤੁਰਭਾਗ ਵਿੱਚ")
    .replace(/^ਗਲਤ ਨਾ ਮਿਲਾਓ (.+?) ਨਾਲ (.+?)[।.]?$/u, "$1 ਅਤੇ $2 ਨੂੰ ਆਪਸ ਵਿੱਚ ਨਾ ਮਿਲਾਓ।")
    .replace(/^ਪਰਸਪਰ-ਗੁਣਨਫਲ ਸ਼ਾਰਟਕੱਟ ਕੰਮ ਕਰਦਾ ਕੇਵਲ ਇਹੀ ਕਿਉਂਕਿ ਕੋਣ ਹਨ ਇੱਕੋ[।.]?$/u, "ਪਰਸਪਰ-ਗੁਣਨਫਲ ਸ਼ਾਰਟਕੱਟ ਕੇਵਲ ਇੱਕੋ ਕੋਣ ਲਈ ਕੰਮ ਕਰਦਾ ਹੈ।")
    .replace(/^ਸਾਈਨ ਅਤੇ ਕੋਸਾਈਨ ਅਦਲਾ-ਬਦਲੀ ਕਰੋ ਲਈ ਪੂਰਕ ਕੋਣਾਂ ਲਈ[।.]?$/u, "ਪੂਰਕ ਕੋਣਾਂ ਵਿੱਚ sin ਅਤੇ cos ਦੀ ਅਦਲਾ-ਬਦਲੀ ਕਰੋ।")
    .replace(/^ਗੈਰ-ਸਿਫ਼ਰ ਸ਼ਰਤ ਸੁਰੱਖਿਅਤ ਰੱਖਦੀ ਹੈ ਹਰ[।.]?$/u, "ਗੈਰ-ਸਿਫ਼ਰ ਸ਼ਰਤ ਯਕੀਨੀ ਬਣਾਉਂਦੀ ਹੈ ਕਿ ਹਰ ਸਿਫ਼ਰ ਨਾ ਹੋਵੇ।")
    .replace(/^ਸਰਬਸਮਿਕਾ ਪਹਿਲਾਂ ਮਾਨ ਰੱਖਣ ਤੇ ਦਸ਼ਮਲਵ ਵਰਤੋ[।.]?$/u, "ਮਾਨ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਸਰਬਸਮਿਕਾ ਵਰਤੋ; ਦਸ਼ਮਲਵ ਤੋਂ ਬਚੋ।")
    .replace(/^ਲਾਗੂ ਹੁੰਦਾ ਹੈ ਨੂੰ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਦਾ ਵਰਗ ਲਓ[।.]?$/u, "ਸਰਬਸਮਿਕਾ ਤਿਕੋਣਮਿਤੀ ਮਾਨਾਂ ਦੇ ਵਰਗਾਂ ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।")
    .replace(/^ਇਹ ਹੈ ਉਲਟੋ ਦਿਸ਼ਾ ਦਾ 1\+tan²θ=sec²θ[।.]?$/u, "1+tan²θ=sec²θ ਨੂੰ ਮੁੜ ਵਿਵਸਥਿਤ ਕਰੋ।")
    .replace(/^ਪਰਸਪਰ ਫੰਕਸ਼ਨ ਗੁਣਾ ਕਰਕੇ 1, 0 ਨਹੀਂ[।.]?$/u, "ਕਿਸੇ ਮਾਨ ਅਤੇ ਉਸਦੇ ਪਰਸਪਰ ਦਾ ਗੁਣਨਫਲ 1 ਹੁੰਦਾ ਹੈ, 0 ਨਹੀਂ।")
    .replace(/^ਮਾਨ ਨਾ ਰੱਖੋ ਲਗਭਗ ਦਸ਼ਮਲਵ[।.]?$/u, "ਲਗਭਗ ਦਸ਼ਮਲਵ ਮਾਨ ਨਾ ਰੱਖੋ।")
    .replace(/^ਮੁੜ ਲਿਖੋ secθ−cosθ ਵਰਤ ਕੇ ਇੱਕ ਸਾਂਝਾ ਹਰ[।.]?$/u, "secθ−cosθ ਨੂੰ ਸਾਂਝੇ ਹਰ ਵਿੱਚ ਲਿਖੋ।")
    .replace(/^ਸਰਬਸਮਿਕਾ ਪਹਿਲਾਂ ਮਾਨ ਰੱਖਣ ਨਾਲ ਮਿਆਰੀ ਮਾਨ ਵਰਤੋ[।.]?$/u, "ਮਾਨ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਸਰਬਸਮਿਕਾ ਲਗਾਓ ਅਤੇ ਸਹੀ ਮਾਨ ਵਰਤੋ।")
    .replace(/^o²\+a²=h² ਜਦੋਂ ਜੋੜਨ ਤੇ ਪਰਸਪਰ ਅਨੁਪਾਤ ਵਰਤੋ[।.]?$/u, "ਪਰਸਪਰ ਅਨੁਪਾਤ ਜੋੜਦੇ ਸਮੇਂ o²+a²=h² ਵਰਤੋ।")
    .replace(/^ਟੈਂਜੈਂਟ ਨੂੰ ਮੁੜ ਬਣਾਓ ਸੀਕੈਂਟ ਅਤੇ ਕੋਸਾਈਨ ਵਰਤੋ[।.]?$/u, "sec θ ਅਤੇ cos θ ਦੀ ਮਦਦ ਨਾਲ tan θ ਮੁੜ ਬਣਾਓ।")
    .replace(/^ਨਾ ਜੋੜੋ 1 ਨੂੰ ਦਿੱਤਾ ਮਾਨ; ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ਸਰਬਸਮਿਕਾ ਵਰਤੋ[।.]?$/u, "ਦਿੱਤੇ ਮਾਨ ਵਿੱਚ 1 ਨਾ ਜੋੜੋ; ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ਸਰਬਸਮਿਕਾ ਵਰਤੋ।")
    .replace(/^ਕੋਸੀਕੈਂਟ-ਕੋਟੈਂਜੈਂਟ ਸੰਯੁਗਮੀ ਜੋੜੇ ਗੁਣਾ ਕਰਕੇ 1[।.]?$/u, "(cosecθ−cotθ)(cosecθ+cotθ)=1 ਵਰਤੋ।")
    .replace(/^ਕੋਸੀਕੈਂਟ-ਕੋਟੈਂਜੈਂਟ ਸਰਬਸਮਿਕਾ, ਨਹੀਂ ਸੀਕੈਂਟ-ਟੈਂਜੈਂਟ ਇੱਕ ਯਾਂਤ੍ਰਿਕ ਤੌਰ ਤੇ ਵਰਤੋ[।.]?$/u, "cosec–cot ਸਰਬਸਮਿਕਾ ਵਰਤੋ; sec–tan ਵਾਲੀ ਸਰਬਸਮਿਕਾ ਨੂੰ ਯਾਂਤ੍ਰਿਕ ਤੌਰ ਤੇ ਨਾ ਲਗਾਓ।")
    .replace(/^ਕਰਾਸ ਪਦ ਹੈ 2sinθcosθ, ਨਹੀਂ sinθcosθ[।.]?$/u, "ਕਰਾਸ ਪਦ 2sinθcosθ ਹੈ, ਕੇਵਲ sinθcosθ ਨਹੀਂ।")
    .replace(/^ਕਰਾਸ ਪਦ ਹੈ 2sinθcosθ[।.]?$/u, "ਕਰਾਸ ਪਦ 2sinθcosθ ਹੈ।")
    .replace(/^cos θ ਨਾਲ ਭਾਗ ਦਿਓ, ਫਿਰ ਵੱਖ ਕਰੋ tan θ[।.]?$/u, "cos θ ਨਾਲ ਭਾਗ ਦੇ ਕੇ tan θ ਨੂੰ ਵੱਖ ਕਰੋ।")
    .replace(/^ਚੱਕਰ ਹਰੇਕ ਕੌਂਸ ਵਿੱਚ ਇੱਕ ਪਰਸਪਰ ਜੋੜਾ, ਤਦ ਗੁਣਾ ਕਰੋ[।.]?$/u, "ਹਰੇਕ ਕੌਂਸ ਵਿੱਚ ਪਰਸਪਰ ਜੋੜਾ ਪਛਾਣੋ, ਫਿਰ ਗੁਣਾ ਕਰੋ।")
    .replace(/^ਲਾਗੂ ਨਾ ਕਰੋ ਇੱਕ ਇੱਕੋ ਸਰਬਸਮਿਕਾ ਨੂੰ ਦੋਵੇਂ ਕੌਂਸਾਂ[।.]?$/u, "ਦੋਵੇਂ ਕੌਂਸਾਂ ਤੇ ਇੱਕੋ ਸਰਬਸਮਿਕਾ ਨਾ ਲਗਾਓ।")
    .replace(/^ਰੁਕਣ ਤੇ ਤੇ tan²\/cot² ਛੁੱਟ ਜਾਂਦਾ ਹੈ ਇੱਕ ਹੋਰ ਪਰਸਪਰ ਸਰਲੀਕਰਨ[।.]?$/u, "tan²/cot² ਤੇ ਨਾ ਰੁਕੋ; ਇੱਕ ਹੋਰ ਪਰਸਪਰ ਸਰਲੀਕਰਨ ਲੋੜੀਂਦਾ ਹੈ।")
    .replace(/^ਨਾ ਛੱਡੋ ਗੁਣਕ 2[।.]?$/u, "ਗੁਣਕ 2 ਨਾ ਛੱਡੋ।")
    .replace(/^ਗੁਣਨਫਲ ਇਸ ਲਈ ਸਰਲ ਹੋ ਜਾਂਦਾ ਹੈ ਨੂੰ (.+?)[।.]?$/u, "ਇਸ ਲਈ ਗੁਣਨਫਲ $1 ਰਹਿ ਜਾਂਦਾ ਹੈ।")
    .replace(/^30°\/60° ਟੈਂਜੈਂਟ ਜਾਂ ਕੋਟੈਂਜੈਂਟ ਜੋੜਾ ਗੁਣਾ ਹੋ ਕੇ ਨੂੰ 1[।.]?$/u, "30° ਅਤੇ 60° ਦੇ tan/cot ਪਰਸਪਰ ਜੋੜੇ ਦਾ ਗੁਣਨਫਲ 1 ਹੁੰਦਾ ਹੈ।")
    .replace(/^ਨਾ ਭੁੱਲੋ ਨੂੰ ਵਰਗ 45° ਸਾਈਨ\/ਕੋਸਾਈਨ ਮਾਨ[।.]?$/u, "45° ਦੇ sin/cos ਮਾਨ ਦਾ ਵਰਗ ਲੈਣਾ ਨਾ ਭੁੱਲੋ।")
    .replace(/^ਤਿੰਨ ਕੋਣ ਹਨ ਵੱਖਰਾ, ਇਸ ਲਈ ਮਾਨ ਕੱਢੋ ਇਨ੍ਹਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਦੀ ਬਜਾਏ ਵਰਤ ਕੇ ਇੱਕ ਇੱਕੋ-ਕੋਣ ਸਰਬਸਮਿਕਾ[।.]?$/u, "ਤਿੰਨੇ ਕੋਣ ਵੱਖ ਹਨ; ਹਰੇਕ ਦਾ ਮਾਨ ਵੱਖ-ਵੱਖ ਕੱਢੋ।")
    .replace(/^ਗਣਨਾ ਕਰੋ (.+?)[।.]?$/u, "$1 ਦੀ ਗਣਨਾ ਕਰੋ।")
    .replace(/^ਇਹ ਹੈ (√[^।.]+?)[।.]?$/u, "$1।")
    .replace(/^ਸਾਈਨ ਅਤੇ ਕੋਸਾਈਨ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਸੁਤੰਤਰ ਤੌਰ ਤੇ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ 1 ਤੇ ਇੱਕੋ ਕੋਣ[।.]?$/u, "ਇੱਕੋ θ ਲਈ sinθ ਅਤੇ cosθ ਦੋਵੇਂ ਸੁਤੰਤਰ ਤੌਰ ਤੇ 1 ਨਹੀਂ ਹੋ ਸਕਦੇ।")
    .replace(/^ਪਰਸਪਰ ਲਓ ਸਾਈਨ, ਨਹੀਂ ਕੋਸਾਈਨ[।.]?$/u, "sin ਦਾ ਪਰਸਪਰ ਲਓ, cos ਦਾ ਨਹੀਂ।")
    .replace(/^ਪਛਾਣੋ ਪੂਰਕ ਬਰਾਬਰ ਮਾਨ ਪਹਿਲਾਂ ਜੋੜਨ ਤੇ[।.]?$/u, "ਪਹਿਲਾਂ ਪੂਰਕ ਕੋਣਾਂ ਦੇ ਬਰਾਬਰ ਮਾਨ ਪਛਾਣੋ, ਫਿਰ ਜੋੜੋ।")
    .replace(/^90° ਦਾ ਸਥਾਨਾਂਤਰ ਫੰਕਸ਼ਨ ਦੇ ਨਾਲ ਚਿੰਨ੍ਹ ਵੀ ਬਦਲਦਾ ਹੈ[।.]?$/u, "90° ਦੇ ਸਥਾਨਾਂਤਰ ਨਾਲ ਫੰਕਸ਼ਨ ਅਤੇ ਚਿੰਨ੍ਹ ਦੋਵੇਂ ਬਦਲ ਸਕਦੇ ਹਨ।")
    .replace(/^ਨਾ ਕੱਟੋ ਦੇ ਪਾਰ ਜੋੜ; ਇੱਥੇ ਹਰੇਕ ਕ੍ਰਿਆ ਹੈ ਗੁਣਾਤਮਕ[।.]?$/u, "ਜੋੜ ਦੇ ਆਰ-ਪਾਰ ਪਦਾਂ ਨੂੰ ਨਾ ਕੱਟੋ; ਇੱਥੇ ਹਰੇਕ ਕ੍ਰਿਆ ਗੁਣਾਤਮਕ ਹੈ।")
    .replace(/^ਪਰਸਪਰ ਲਓ ਦੋਵੇਂ ਭੁਜਾਵਾਂ ਦਾ ਸੀਕੈਂਟ ਸਰਬਸਮਿਕਾ[।.]?$/u, "sec ਦੀ ਸਰਬਸਮਿਕਾ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦਾ ਪਰਸਪਰ ਲਓ।")
    .replace(/^sin30° ਪਹਿਲਾਂ ਜੋੜਨ ਤੇ ਦਾ ਵਰਗ ਲਓ[।.]?$/u, "sin30° ਦਾ ਵਰਗ ਉਸੇ ਪਦ ਵਿੱਚ ਲਓ; ਜੋੜ ਤੋਂ ਪਹਿਲਾਂ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਨਾ ਕੱਟੋ (.+?) ਨਾਲ (.+?) ਕਿਉਂਕਿ ਕੋਣ ਵੱਖ ਹਨ[।.]?$/u, "$1 ਅਤੇ $2 ਨੂੰ ਆਪਸ ਵਿੱਚ ਨਾ ਕੱਟੋ; ਉਨ੍ਹਾਂ ਦੇ ਕੋਣ ਵੱਖ ਹਨ।")
    .replace(/^ਪਹਿਲਾਂ ਵਰਗ ਦਾ ਵਿਸਤਾਰ ਕਰੋ, ਫਿਰ ਪਰਸਪਰ ਸਰਬਸਮਿਕਾਵਾਂ ਲਗਾਓ[।.]?$/u, "ਪਹਿਲਾਂ ਵਰਗ ਖੋਲ੍ਹੋ, ਫਿਰ ਪਰਸਪਰ ਸਰਬਸਮਿਕਾਵਾਂ ਲਗਾਓ।")
    .replace(/([^।.]+?) ਤੋਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ([^।.]+?)[।.]? ਮਿਲਦਾ ਹੈ[।.]?$/u, "$1 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ $2 ਮਿਲਦਾ ਹੈ।")
    .replace(/([^।.]+?)। ਮਿਲਦਾ ਹੈ[।.]?$/u, "$1 ਮਿਲਦਾ ਹੈ।");
  return finish(text);
}

export function polishTrg001NativeReviewFinal3(value: unknown, locale: Locale) {
  return locale === "hi-IN" ? polishHindi(value) : polishPunjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: polishTrg001NativeReviewFinal3(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: polishTrg001NativeReviewFinal3(step.title, locale),
      body: polishTrg001NativeReviewFinal3(step.body, locale),
    })),
    shortcut: polishTrg001NativeReviewFinal3(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => polishTrg001NativeReviewFinal3(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal3(localized: AnyQuestion, locale: Locale) {
  const stem = polishTrg001NativeReviewFinal3(localized.stem, locale);
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: polishTrg001NativeReviewFinal3(option.display, locale),
  }));
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const explanation = mapExplanation(localized.explanation, locale);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
  });

  return {
    ...localized,
    stem,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3" as const,
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
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3" as const,
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
      learnerSurfaceSource: "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_FINAL_HUMAN_STYLE_REVIEW_POLISH_V3" as const,
      finalNativeReviewOverlay3: true as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal3(qlId: string, seed: string, locale: Locale) {
  return finalizeLocalizedTrg001QuestionNativeReviewFinal3(
    generateLocalizedTrg001QuestionNativeReviewFinal2(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
