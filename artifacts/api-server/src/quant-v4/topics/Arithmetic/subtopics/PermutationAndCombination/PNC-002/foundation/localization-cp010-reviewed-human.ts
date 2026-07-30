import {
  buildPnc002Cp010LocalizedPresentation as buildPolishedPresentation,
  PNC_002_CP010_LOCALIZATION_CANDIDATE,
} from "./localization-cp010-reviewed-final";
import type { PncStudentSourcePackage } from "./student-presentation";
import type { PncLocalizedStudentPresentation, PncStudentLocale } from "./localization-types";

export { PNC_002_CP010_LOCALIZATION_CANDIDATE };

function mathTokens(value: string): string[] {
  return [...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g)].map((match) => match[0]!);
}
function formulaPhrase(values: readonly string[], locale: PncStudentLocale): string {
  if (!values.length) return "";
  return locale === "hi-IN" ? ` यहाँ ${values.join(" तथा ")} प्राप्त होता है।` : ` ਇੱਥੇ ${values.join(" ਅਤੇ ")} ਮਿਲਦਾ ਹੈ।`;
}
function stripStepPrefix(line: string): string { return line.replace(/^\d+\.\s+\*\*[^*]+:\*\*\s*/, ""); }
function label(locale: PncStudentLocale, index: number, total: number): string {
  if (locale === "hi-IN") {
    if (index === 0) return "शर्त समझें";
    if (index === 1) return "योजना बनाएँ";
    if (index === total - 1) return "उत्तर जाँचें";
    return `गणना चरण ${index - 1}`;
  }
  if (index === 0) return "ਸ਼ਰਤ ਸਮਝੋ";
  if (index === 1) return "ਯੋਜਨਾ ਬਣਾਓ";
  if (index === total - 1) return "ਉੱਤਰ ਜਾਂਚੋ";
  return `ਹਿਸਾਬ ਦਾ ਪੜਾਅ ${index - 1}`;
}
function optionIndex(line: string, fallback: number): number {
  const match = line.match(/(?:विकल्प|ਚੋਣ)\s+([A-D])/);
  return match ? match[1]!.charCodeAt(0) - 65 : fallback;
}
function naturalStem(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") return value
    .replace("एक बैठक-समूह में", "एक गोल-मेज़ बैठक में")
    .replace("अपने-अपने हिस्से में साथ बैठे", "अपने-अपने समूह में लगातार बैठें")
    .replace("एक बैठक-व्यवस्था में", "एक गोल-मेज़ बैठक में")
    .replace("एक बैठक-चक्र में", "एक गोल-मेज़ बैठक में")
    .replace("एक संयुक्त गोल बैठक में", "एक गोल-मेज़ बैठक में")
    .replace("एक गोल-मेज़ समूह में", "एक गोल-मेज़ बैठक में")
    .replace("एक उलटी-गणना वाले प्रश्न में", "एक प्रश्न में")
    .replace("एक उलटी गोल-बैठक समस्या में", "एक प्रश्न में")
    .replace("एक मनकों के छल्ले के लिए", "एक मनका-छल्ला बनाने के लिए");
  return value
    .replace("ਇੱਕ ਬੈਠਕ-ਗਰੁੱਪ ਵਿੱਚ", "ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਬੈਠਕ ਵਿੱਚ")
    .replace("ਆਪਣੇ-ਆਪਣੇ ਹਿੱਸੇ ਵਿੱਚ ਇਕੱਠੇ ਬੈਠਣ", "ਆਪਣੇ-ਆਪਣੇ ਗਰੁੱਪ ਵਜੋਂ ਲਗਾਤਾਰ ਬੈਠਣ")
    .replace("ਇੱਕ ਬੈਠਕ ਦੀ ਯੋਜਨਾ ਵਿੱਚ", "ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਬੈਠਕ ਵਿੱਚ")
    .replace("ਇੱਕ ਬੈਠਕ-ਚੱਕਰ ਵਿੱਚ", "ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਬੈਠਕ ਵਿੱਚ")
    .replace("ਇੱਕ ਸਾਂਝੀ ਗੋਲ ਬੈਠਕ ਵਿੱਚ", "ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਬੈਠਕ ਵਿੱਚ")
    .replace("ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਗਰੁੱਪ ਵਿੱਚ", "ਇੱਕ ਗੋਲ-ਮੇਜ਼ ਬੈਠਕ ਵਿੱਚ")
    .replace("ਇੱਕ ਉਲਟੀ ਗਿਣਤੀ ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ", "ਇੱਕ ਸਵਾਲ ਵਿੱਚ")
    .replace("ਇੱਕ ਉਲਟੀ ਗੋਲ-ਬੈਠਕ ਸਮੱਸਿਆ ਵਿੱਚ", "ਇੱਕ ਸਵਾਲ ਵਿੱਚ")
    .replace("ਇੱਕ ਮਣਕਿਆਂ ਦੇ ਛੱਲੇ ਲਈ", "ਇੱਕ ਮਣਕਿਆਂ ਦਾ ਛੱਲਾ ਬਣਾਉਣ ਲਈ");
}

const PLANS: Record<PncStudentLocale, readonly string[]> = {
  "hi-IN": `एक सीट स्थिर, बाकी का क्रम—गोल बैठक में सीधे यही नियम लगाइए।
संदर्भ व्यक्ति को दोबारा मत गिनिए; केवल बाकी सीटों का क्रम निकालिए।
जोड़ी को एक इकाई और उसके भीतर दो क्रम—दोनों गुणक साथ रखिए।
अलग बैठने की शर्त में कुल में से साथ बैठने वाली गिनती घटाना सबसे तेज़ है।
समूह को एक ब्लॉक बनाइए, फिर बाहर की गोल गिनती और भीतर की क्रम-गिनती गुणा कीजिए।
दो जोड़ी-ब्लॉक बनाकर बाहर की गोल गिनती को चार आंतरिक क्रमों से गुणा कीजिए।
दो ब्लॉक बनाइए; जोड़ी के दो और बड़े समूह के सभी आंतरिक क्रम भूलिए नहीं।
पहली जोड़ी साथ की गिनती में से दोनों जोड़ियाँ साथ वाली गिनती घटाइए।
दोनों ब्लॉक साथ की गिनती में से दोनों ब्लॉक पास-पास वाली गिनती घटाइए।
कम-से-कम एक के लिए जोड़िए, साझा भाग एक बार घटाइए।
किसी भी जोड़ी को साथ न रखने के लिए कुल − पहली − दूसरी + दोनों साथ कीजिए।
A स्थिर; B और C के दो पड़ोसी क्रम; बाकी का क्रम—तीन छोटे चरणों में हल कीजिए।
A स्थिर करते ही B की विपरीत सीट पक्की हो जाती है; बाकी का क्रम सीधे लें।
‘ठीक घड़ी की दिशा’ में केवल एक पड़ोसी सीट होती है, दोनों ओर का गुणक मत लगाइए।
ठीक अंतर में B की केवल एक मान्य सीट रहती है; बाकी व्यक्तियों का क्रम समान है।
मान्य B-सीटों की संख्या पहले गिनिए और उसे बाकी व्यक्तियों की क्रम-गिनती से गुणा कीजिए।
अधिकतम अंतर के भीतर आने वाली B-सीटें गिनिए; सीमा के बाहर की सीटें न लें।
A, B, C के दो गोल क्रमों में एक सही—कुल का आधा।
A, B, C, D के छह गोल क्रमों में एक सही—कुल को छह से भाग।
एक वर्ग को पहले गोल बैठाइए; दूसरे वर्ग को सभी खाली जगहों में बैठाइए।
बड़ा वर्ग पहले, फिर खाली जगहें चुनें, फिर छोटे वर्ग का क्रम—यही तीन गुणक हैं।
सामान्य व्यक्ति पहले; अलग खाली जगहें चुनें; चिन्हित व्यक्तियों का क्रम अंत में लगाएँ।
n के छोटे मानों पर गोल सूत्र लगाकर लक्ष्य से सीधा मिलान कीजिए।
हर n पर जोड़ी-ब्लॉक का सूत्र लगाइए; लक्ष्य से मेल खाने वाला एकमात्र n चुनिए।
एक तरफ़ वाले गोल प्रदर्शन में घुमाव हटता है, शीशे के कारण आधा नहीं करना।
माला में घुमाव हटाने के बाद उलटाव के कारण एक बार और आधा कीजिए।
जोड़ी-ब्लॉक का दो वाला गुणक और माला का आधा—दोनों एक-दूसरे को संतुलित कर सकते हैं।
‘पूरा समूह लगातार न बैठे’ का तेज़ तरीका: कुल में से पूरा ब्लॉक घटाइए।
ठीक एक के लिए दोनों ‘एक साथ, दूसरा अलग’ भाग जोड़िए।
पहले चयन, फिर चुने चिन्हों की गोल व्यवस्था—दोनों चरणों को गुणा कीजिए।
पहले चयन, फिर चुने मनकों की उलट सकने वाली गोल व्यवस्था—अंत में दो से भाग दीजिए।
समान पड़ोसी का अर्थ दिशा उलटने पर भी वही बैठक; साधारण गोल गिनती का आधा लें।`.split("\n"),
  "pa-IN": `ਇੱਕ ਸੀਟ ਪੱਕੀ, ਬਾਕੀਆਂ ਦਾ ਕ੍ਰਮ—ਗੋਲ ਬੈਠਕ ਵਿੱਚ ਸਿੱਧਾ ਇਹੀ ਨਿਯਮ ਲਗਾਓ।
ਹਵਾਲੇ ਵਾਲੇ ਵਿਅਕਤੀ ਨੂੰ ਮੁੜ ਨਾ ਗਿਣੋ; ਸਿਰਫ਼ ਬਾਕੀ ਸੀਟਾਂ ਦਾ ਕ੍ਰਮ ਕੱਢੋ।
ਜੋੜੇ ਨੂੰ ਇੱਕ ਇਕਾਈ ਅਤੇ ਅੰਦਰ ਦੋ ਕ੍ਰਮ—ਦੋਵੇਂ ਗੁਣਕ ਇਕੱਠੇ ਰੱਖੋ।
ਵੱਖ ਬੈਠਣ ਦੀ ਸ਼ਰਤ ਵਿੱਚ ਕੁੱਲ ਵਿੱਚੋਂ ਇਕੱਠੇ ਬੈਠਣ ਵਾਲੀ ਗਿਣਤੀ ਘਟਾਉਣਾ ਸਭ ਤੋਂ ਤੇਜ਼ ਹੈ।
ਗਰੁੱਪ ਨੂੰ ਇੱਕ ਬਲਾਕ ਬਣਾਓ, ਫਿਰ ਬਾਹਰਲੀ ਗੋਲ ਗਿਣਤੀ ਅਤੇ ਅੰਦਰਲਾ ਕ੍ਰਮ ਗੁਣਾ ਕਰੋ।
ਦੋ ਜੋੜਾ-ਬਲਾਕ ਬਣਾਕੇ ਬਾਹਰਲੀ ਗੋਲ ਗਿਣਤੀ ਨੂੰ ਚਾਰ ਅੰਦਰਲੇ ਕ੍ਰਮਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।
ਦੋ ਬਲਾਕ ਬਣਾਓ; ਜੋੜੇ ਦੇ ਦੋ ਅਤੇ ਵੱਡੇ ਗਰੁੱਪ ਦੇ ਸਾਰੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਨਾ ਭੁੱਲੋ।
ਪਹਿਲੇ ਜੋੜੇ ਦੇ ਇਕੱਠੇ ਬੈਠਣ ਦੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਦੋਵੇਂ ਜੋੜਿਆਂ ਦੇ ਇਕੱਠੇ ਬੈਠਣ ਦੀ ਗਿਣਤੀ ਘਟਾਓ।
ਦੋਵੇਂ ਬਲਾਕ ਬਣਨ ਵਾਲੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਦੋਵੇਂ ਬਲਾਕ ਨਾਲ-ਨਾਲ ਵਾਲੀ ਗਿਣਤੀ ਘਟਾਓ।
ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਈ ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਜੋੜੋ ਅਤੇ ਸਾਂਝਾ ਹਿੱਸਾ ਇੱਕ ਵਾਰ ਘਟਾਓ।
ਕੋਈ ਵੀ ਜੋੜਾ ਇਕੱਠੇ ਨਾ ਹੋਵੇ: ਕੁੱਲ − ਪਹਿਲਾ − ਦੂਜਾ + ਦੋਵੇਂ ਇਕੱਠੇ।
A ਪੱਕਾ; B ਅਤੇ C ਦੇ ਦੋ ਗੁਆਂਢੀ ਕ੍ਰਮ; ਬਾਕੀਆਂ ਦਾ ਕ੍ਰਮ—ਤਿੰਨ ਛੋਟੇ ਪੜਾਵਾਂ ਵਿੱਚ ਹੱਲ ਕਰੋ।
A ਪੱਕਾ ਕਰਦੇ ਹੀ B ਦੀ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ਤੈਅ ਹੋ ਜਾਂਦੀ ਹੈ; ਬਾਕੀਆਂ ਦਾ ਕ੍ਰਮ ਸਿੱਧਾ ਲਵੋ।
‘ਬਿਲਕੁਲ ਘੜੀਵਾਰ’ ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਗੁਆਂਢੀ ਸੀਟ ਹੁੰਦੀ ਹੈ; ਦੋ ਪਾਸਿਆਂ ਦਾ ਗੁਣਕ ਨਾ ਲਗਾਓ।
ਠੀਕ ਫ਼ਾਸਲੇ ਵਿੱਚ B ਦੀ ਸਿਰਫ਼ ਇੱਕ ਸਹੀ ਸੀਟ ਰਹਿੰਦੀ ਹੈ; ਬਾਕੀਆਂ ਦਾ ਕ੍ਰਮ ਇੱਕੋ ਹੈ।
ਪਹਿਲਾਂ B ਦੀਆਂ ਸਹੀ ਸੀਟਾਂ ਗਿਣੋ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਬਾਕੀਆਂ ਦੇ ਕ੍ਰਮ ਨਾਲ ਗੁਣਾ ਕਰੋ।
ਵੱਧ ਤੋਂ ਵੱਧ ਫ਼ਾਸਲੇ ਅੰਦਰ ਆਉਂਦੀਆਂ B ਦੀਆਂ ਸੀਟਾਂ ਗਿਣੋ; ਹੱਦ ਤੋਂ ਬਾਹਰ ਵਾਲੀਆਂ ਨਾ ਲਵੋ।
A, B, C ਦੇ ਦੋ ਗੋਲ ਕ੍ਰਮਾਂ ਵਿੱਚ ਇੱਕ ਸਹੀ—ਕੁੱਲ ਦਾ ਅੱਧਾ।
A, B, C, D ਦੇ ਛੇ ਗੋਲ ਕ੍ਰਮਾਂ ਵਿੱਚ ਇੱਕ ਸਹੀ—ਕੁੱਲ ਨੂੰ ਛੇ ਨਾਲ ਵੰਡੋ।
ਇੱਕ ਵਰਗ ਨੂੰ ਪਹਿਲਾਂ ਗੋਲ ਬਿਠਾਓ; ਦੂਜੇ ਵਰਗ ਨੂੰ ਸਾਰੀਆਂ ਖਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਬਿਠਾਓ।
ਵੱਡਾ ਵਰਗ ਪਹਿਲਾਂ, ਫਿਰ ਖਾਲੀਆਂ ਥਾਵਾਂ ਚੁਣੋ, ਫਿਰ ਛੋਟੇ ਵਰਗ ਦਾ ਕ੍ਰਮ—ਇਹ ਤਿੰਨ ਗੁਣਕ ਹਨ।
ਆਮ ਵਿਅਕਤੀ ਪਹਿਲਾਂ; ਵੱਖ ਖਾਲੀਆਂ ਥਾਵਾਂ ਚੁਣੋ; ਨਿਸ਼ਾਨ ਲੱਗਿਆਂ ਦਾ ਕ੍ਰਮ ਅਖੀਰ ਵਿੱਚ ਲਗਾਓ।
n ਦੇ ਛੋਟੇ ਮੁੱਲਾਂ ਉੱਤੇ ਗੋਲ ਨਿਯਮ ਲਗਾ ਕੇ ਟੀਚੇ ਨਾਲ ਸਿੱਧਾ ਮਿਲਾਓ।
ਹਰ n ਉੱਤੇ ਜੋੜਾ-ਬਲਾਕ ਦਾ ਨਿਯਮ ਲਗਾਓ; ਟੀਚੇ ਨਾਲ ਮਿਲਦਾ ਇਕੱਲਾ n ਚੁਣੋ।
ਇੱਕ ਪਾਸੇ ਵਾਲੇ ਗੋਲ ਡਿਜ਼ਾਇਨ ਵਿੱਚ ਘੁਮਾਵ ਹਟਦਾ ਹੈ, ਸ਼ੀਸ਼ੇ ਕਰਕੇ ਅੱਧਾ ਨਹੀਂ ਕਰਨਾ।
ਮਾਲਾ ਵਿੱਚ ਘੁਮਾਵ ਹਟਾਉਣ ਤੋਂ ਬਾਅਦ ਉਲਟਾਵ ਕਰਕੇ ਇੱਕ ਵਾਰ ਹੋਰ ਅੱਧਾ ਕਰੋ।
ਜੋੜਾ-ਬਲਾਕ ਦਾ ਦੋ ਵਾਲਾ ਗੁਣਕ ਅਤੇ ਮਾਲਾ ਦਾ ਅੱਧਾ—ਦੋਵੇਂ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰ ਸਕਦੇ ਹਨ।
‘ਪੂਰਾ ਗਰੁੱਪ ਲਗਾਤਾਰ ਨਾ ਬੈਠੇ’ ਦਾ ਤੇਜ਼ ਤਰੀਕਾ: ਕੁੱਲ ਵਿੱਚੋਂ ਪੂਰਾ ਬਲਾਕ ਘਟਾਓ।
ਠੀਕ ਇੱਕ ਲਈ ਦੋਵੇਂ ‘ਇੱਕ ਇਕੱਠੇ, ਦੂਜਾ ਵੱਖ’ ਹਿੱਸੇ ਜੋੜੋ।
ਪਹਿਲਾਂ ਚੋਣ, ਫਿਰ ਚੁਣੇ ਨਿਸ਼ਾਨਾਂ ਦੀ ਗੋਲ ਬੈਠਕ—ਦੋਵੇਂ ਪੜਾਅ ਗੁਣਾ ਕਰੋ।
ਪਹਿਲਾਂ ਚੋਣ, ਫਿਰ ਚੁਣੇ ਮਣਕਿਆਂ ਦੀ ਉਲਟ ਸਕਣ ਵਾਲੀ ਗੋਲ ਬੈਠਕ—ਅਖੀਰ ਵਿੱਚ ਦੋ ਨਾਲ ਵੰਡੋ।
ਇੱਕੋ ਗੁਆਂਢੀ ਦਾ ਮਤਲਬ ਦਿਸ਼ਾ ਉਲਟਣ ਉੱਤੇ ਵੀ ਉਹੀ ਬੈਠਕ; ਆਮ ਗੋਲ ਗਿਣਤੀ ਦਾ ਅੱਧਾ ਲਵੋ।`.split("\n"),
};

function calculationText(source: PncStudentSourcePackage, locale: PncStudentLocale, calculationIndex: number): string {
  const hi = locale === "hi-IN";
  const mode = source.solveMode;
  if (/Block|PairTogether|PairApart|ExactlyOnePair|NeitherPair|AtLeastOnePair/.test(mode)) return calculationIndex === 0
    ? hi ? "ब्लॉक बनने के बाद बाहर की गोल व्यवस्था निकालिए।" : "ਬਲਾਕ ਬਣਨ ਤੋਂ ਬਾਅਦ ਬਾਹਰਲੀ ਗੋਲ ਬੈਠਕ ਕੱਢੋ।"
    : hi ? "अब भीतर के क्रम या आवश्यक जोड़-घटाव का अगला भाग लगाइए।" : "ਹੁਣ ਅੰਦਰਲੇ ਕ੍ਰਮ ਜਾਂ ਲੋੜੀਂਦੇ ਜੋੜ-ਘਟਾਉ ਦਾ ਅਗਲਾ ਹਿੱਸਾ ਲਗਾਓ।";
  if (/Gap|Clockwise|Opposite|Neighbors|Order/.test(mode)) return calculationIndex === 0
    ? hi ? "निर्धारित सीटें तय होने के बाद बाकी व्यक्तियों का क्रम निकालिए।" : "ਤੈਅ ਸੀਟਾਂ ਪੱਕੀਆਂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬਾਕੀਆਂ ਦਾ ਕ੍ਰਮ ਕੱਢੋ।"
    : hi ? "मान्य स्थानों या क्रमों की संख्या से अगला गुणक लगाइए।" : "ਸਹੀ ਥਾਵਾਂ ਜਾਂ ਕ੍ਰਮਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਅਗਲਾ ਗੁਣਕ ਲਗਾਓ।";
  if (/Alternation|NoTwoCategoryAdjacent/.test(mode)) return calculationIndex === 0
    ? hi ? "आधार वर्ग की गोल व्यवस्था निकालिए।" : "ਅਧਾਰ ਵਰਗ ਦੀ ਗੋਲ ਬੈਠਕ ਕੱਢੋ।"
    : calculationIndex === 1
      ? hi ? "बनी खाली जगहों में से आवश्यक जगहें चुनिए।" : "ਬਣੀਆਂ ਖਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚੋਂ ਲੋੜੀਂਦੀਆਂ ਥਾਵਾਂ ਚੁਣੋ।"
      : hi ? "दूसरे वर्ग का क्रम लगाकर सभी चरण गुणा कीजिए।" : "ਦੂਜੇ ਵਰਗ ਦਾ ਕ੍ਰਮ ਲਗਾ ਕੇ ਸਾਰੇ ਪੜਾਅ ਗੁਣਾ ਕਰੋ।";
  if (/recoverCircularParameter/.test(mode)) return calculationIndex === 0
    ? hi ? "उम्मीदवार n पर संबंधित गोल सूत्र लगाइए।" : "ਉਮੀਦਵਾਰ n ਉੱਤੇ ਸੰਬੰਧਿਤ ਗੋਲ ਨਿਯਮ ਲਗਾਓ।"
    : hi ? "मिली संख्या को लक्ष्य से मिलाकर n की पुष्टि कीजिए।" : "ਮਿਲੀ ਗਿਣਤੀ ਨੂੰ ਟੀਚੇ ਨਾਲ ਮਿਲਾ ਕੇ n ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।";
  if (/Selection/.test(mode)) return calculationIndex === 0
    ? hi ? "पहले आवश्यक वस्तुओं का चयन निकालिए।" : "ਪਹਿਲਾਂ ਲੋੜੀਂਦੀਆਂ ਵਸਤੂਆਂ ਦੀ ਚੋਣ ਕੱਢੋ।"
    : calculationIndex === 1
      ? hi ? "चुनी वस्तुओं की गोल व्यवस्था निकालिए।" : "ਚੁਣੀਆਂ ਵਸਤੂਆਂ ਦੀ ਗੋਲ ਬੈਠਕ ਕੱਢੋ।"
      : hi ? "चयन, व्यवस्था और समान रूपों का अंतिम समायोजन कीजिए।" : "ਚੋਣ, ਬੈਠਕ ਅਤੇ ਇੱਕੋ ਰੂਪਾਂ ਦਾ ਅਖੀਰੀ ਹਿਸਾਬ ਕਰੋ।";
  if (/Dihedral|RotationOnly|Ornaments|NeighborSets/.test(mode)) return calculationIndex === 0
    ? hi ? "पहले घुमाव को एक मानकर गोल क्रम निकालिए।" : "ਪਹਿਲਾਂ ਘੁਮਾਵ ਨੂੰ ਇੱਕ ਮੰਨ ਕੇ ਗੋਲ ਕ੍ਰਮ ਕੱਢੋ।"
    : hi ? "अब उलटाव या समान-पड़ोसी रूपों का अंतिम समायोजन कीजिए।" : "ਹੁਣ ਉਲਟਾਵ ਜਾਂ ਇੱਕੋ ਗੁਆਂਢੀ ਰੂਪਾਂ ਦਾ ਅਖੀਰੀ ਹਿਸਾਬ ਕਰੋ।";
  return hi ? "प्रश्न की गोल-व्यवस्था वाली गणना पूरी कीजिए।" : "ਸਵਾਲ ਦੀ ਗੋਲ ਬੈਠਕ ਵਾਲੀ ਗਿਣਤੀ ਪੂਰੀ ਕਰੋ।";
}
function trapText(plan: string, locale: PncStudentLocale, trapIndex: number): string {
  if (locale === "hi-IN") {
    if (trapIndex === 0) return `इस विकल्प में योजना का जरूरी चरण या गुणक छूट गया है: ${plan}`;
    if (trapIndex === 1) return `यह विकल्प योजना को सीधी पंक्ति या गलत समानता के नियम से गिनता है: ${plan}`;
    return `यह विकल्प शर्त का उलटा या अतिरिक्त भाग जोड़ देता है; सही योजना है: ${plan}`;
  }
  if (trapIndex === 0) return `ਇਸ ਚੋਣ ਵਿੱਚ ਯੋਜਨਾ ਦਾ ਲੋੜੀਂਦਾ ਪੜਾਅ ਜਾਂ ਗੁਣਕ ਛੁੱਟ ਗਿਆ ਹੈ: ${plan}`;
  if (trapIndex === 1) return `ਇਹ ਚੋਣ ਯੋਜਨਾ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਜਾਂ ਗਲਤ ਇੱਕੋਤਾ ਨਾਲ ਗਿਣਦੀ ਹੈ: ${plan}`;
  return `ਇਹ ਚੋਣ ਸ਼ਰਤ ਦਾ ਉਲਟ ਜਾਂ ਵਾਧੂ ਹਿੱਸਾ ਜੋੜਦੀ ਹੈ; ਸਹੀ ਯੋਜਨਾ ਹੈ: ${plan}`;
}

export function buildPnc002Cp010LocalizedPresentation(source: PncStudentSourcePackage, locale: PncStudentLocale): PncLocalizedStudentPresentation {
  const polished = buildPolishedPresentation(source, locale);
  const plan = PLANS[locale][Number(source.questionLanguageId.slice(-3)) - 177];
  if (!plan) throw new Error(`${source.questionLanguageId}: incomplete human-reviewed ${locale} copy`);
  return {
    ...polished,
    stem: naturalStem(polished.stem, locale),
    explanationSections: polished.explanationSections.map((section) => {
      if (section.kind === "coreConcept") return { ...section, lines: [section.lines[0]!, plan] };
      if (section.kind === "stepByStep") {
        const total = section.lines.length;
        return { ...section, lines: section.lines.map((line, stepIndex) => {
          const stepLabel = label(locale, stepIndex, total);
          if (stepIndex === 0) return `${stepIndex + 1}. **${stepLabel}:** ${stripStepPrefix(line)}`;
          if (stepIndex === 1) return `${stepIndex + 1}. **${stepLabel}:** ${plan}${formulaPhrase(mathTokens(line), locale)}`;
          if (stepIndex === total - 1) {
            const answer = locale === "hi-IN" ? `सभी चरणों की गणना मिलाने पर सही उत्तर ${polished.answerLabel} है।` : `ਸਾਰੇ ਪੜਾਵਾਂ ਦਾ ਹਿਸਾਬ ਮਿਲਾਉਣ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${polished.answerLabel} ਹੈ।`;
            return `${stepIndex + 1}. **${stepLabel}:** ${answer}${formulaPhrase(mathTokens(line), locale)}`;
          }
          return `${stepIndex + 1}. **${stepLabel}:** ${calculationText(source, locale, stepIndex - 2)}${formulaPhrase(mathTokens(line), locale)}`;
        }) };
      }
      if (section.kind === "examSpeedShortcut") return { ...section, lines: [`${plan}${formulaPhrase(mathTokens(section.lines.join("\n")), locale)}`] };
      if (section.kind === "commonTrapWarning") {
        const wrongIndexes = [0, 1, 2, 3].filter((candidate) => candidate !== polished.correctIndex);
        return { ...section, lines: section.lines.map((line, trapIndex) => {
          const selected = optionIndex(line, wrongIndexes[trapIndex] ?? wrongIndexes[0] ?? 0);
          const prefix = locale === "hi-IN" ? `विकल्प ${String.fromCharCode(65 + selected)}` : `ਚੋਣ ${String.fromCharCode(65 + selected)}`;
          return `${prefix} (${polished.displayOptions[selected]}): ${trapText(plan, locale, trapIndex)}${formulaPhrase(mathTokens(line), locale)}`;
        }) };
      }
      return section;
    }),
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
