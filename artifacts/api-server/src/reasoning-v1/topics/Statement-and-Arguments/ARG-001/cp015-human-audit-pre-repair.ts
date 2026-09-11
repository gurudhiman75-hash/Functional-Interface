import { createHash } from "node:crypto";

export const ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_AUTHORITY = "ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_V7" as const;

type Question = Readonly<Record<string, any>>;
type Language = "en" | "hi" | "pa";

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function languageOf(question: Question): Language {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa";
  return "en";
}

function repairEnglish(value: string): string {
  return value
    .replace(/\b((?:standard certificate|routine document|registration|fee-payment) services) takes\b/gi, "$1 take")
    .replace(/\ban readily\b/gi, "a readily")
    .replace(/\bAny contract workers who\b/gi, "Any contract worker who")
    .replace(/\bAny member of contract workers who\b/gi, "Any contract worker who")
    .replace(/\bAny remote employees who\b/gi, "Any remote employee who")
    .replace(/\bAny office employees who\b/gi, "Any office employee who")
    .replace(/(^|[.!?;:]\s+|\bthat\s+)machine-learning anomaly alert is sufficient evidence/gi, "$1a machine-learning anomaly alert is sufficient evidence")
    .replace(/\bYes\. a machine-learning anomaly alert\b/g, "Yes. A machine-learning anomaly alert")
    .replace(/\bNo\. a machine-learning anomaly alert\b/g, "No. A machine-learning anomaly alert")
    .replace(/\breadily renewed plan\b/gi, "automatically renewed plan")
    .replace(/\btemporary risk controls is\b/gi, "temporary risk controls are")
    .replace(/\bservice-access burden that falls disproportionately on long periods\b/gi, "service-access burden that falls disproportionately on people who cannot stand for long periods")
    .replace(/\bfrom most people in the future\b/gi, "among most people")
    .replace(/((?:An?|One) [^.]+? (?:complaint|report|flag|allegation)) can occur mainly when guilt is already certain/gi, "$1 is sufficient evidence of guilt on its own");
}

function repairHindi(value: string): string {
  return value
    .replace(/सेवा-शायदतें/g, "सेवा-आवश्यकताएँ")
    .replace(/शायदत/g, "आवश्यकता")
    .replace(/होना शायदी होगा/g, "होना आवश्यक होगा")
    .replace(/अधिकांश नागरिक के पास/g, "अधिकांश नागरिकों के पास")
    .replace(/अधिकांश आगंतुक के पास/g, "अधिकांश आगंतुकों के पास")
    .replace(/अधिकांश व्यक्ति के लिए/g, "अधिकांश लोगों के लिए")
    .replace(/क्रेडेंशियल भूलना कराता है/g, "क्रेडेंशियल भूलने की समस्या बढ़ाता है")
    .replace(/बेहतर सीखने के परिणाम बेहतर मान लिए जाने चाहिए/g, "बेहतर सीखने के परिणाम देने वाले मान लिए जाने चाहिए")
    .replace(/से बेहतर ([^।.!?]{1,100}?) बेहतर मान लिए जाने चाहिए/g, "की तुलना में $1 के लिए बेहतर मान लिए जाने चाहिए")
    .replace(/प्रमाण-आधारित जाँच भी शायद ही करनी चाहिए/g, "प्रमाण-आधारित जाँच भी नहीं करनी चाहिए")
    .replace(/सभी ([^।,.!?]+?) सत्रों की जगह ([^।,.!?]+?) कर देना चाहिए/g, "सभी $1 सत्रों को $2 से बदल देना चाहिए")
    .replace(/(निर्धारित विज़िट स्लॉट[^।.!?]*?) कम कर सकता है/g, "$1 कम कर सकते हैं")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) का वास्तविक बदलावों अव्यावहारिक हो जाएगा/g, "$1 में वास्तविक बदलाव अव्यावहारिक हो जाएँगे")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) के वैध बदलावों विफल होंगे/g, "$1 में वैध बदलाव विफल होंगे")
    .replace(/भुगतान खाते के वैध बदलावों विफल होंगे/g, "भुगतान खाते में वैध बदलाव विफल होंगे")
    .replace(/भुगतान खाता में/g, "भुगतान खाते में")
    .replace(/एक भुगतान वॉलेट में रिकवरी ईमेल में/g, "एक भुगतान वॉलेट की रिकवरी ईमेल में")
    .replace(/अक्सर के लिए/g, "स्थायी रूप से")
    .replace(/नगरपालिका सेवा केंद्रों उपयोग करते समय/g, "नगरपालिका सेवा केंद्रों का उपयोग करते समय")
    .replace(/सरकारी अस्पतालों उपयोग करते समय/g, "सरकारी अस्पतालों का उपयोग करते समय")
    .replace(/मोबिलिटी एड उपयोग करने/g, "मोबिलिटी एड का उपयोग करने")
    .replace(/आगंतुकों जो/g, "आगंतुक जो")
    .replace(/नागरिकों जो/g, "नागरिक जो")
    .replace(/(रिमोट|कॉन्ट्रैक्ट) कर्मचारियों में जो भी/g, "जो भी $1 कर्मचारी")
    .replace(/कार्यालय कर्मचारियों में जो भी/g, "जो भी कार्यालय कर्मचारी")
    .replace(/दूरस्थ कर्मचारियों में जो भी/g, "जो भी दूरस्थ कर्मचारी")
    .replace(/फील्ड स्टाफ में जो भी/g, "फील्ड स्टाफ का कोई सदस्य जो")
    .replace(/डेटा संग्रह का उद्देश्य क्या है के बारे में/g, "डेटा संग्रह के उद्देश्य के बारे में")
    .replace(/का अधिकांश अभ्यर्थी और केंद्र प्रभावित था/g, "के अधिकांश अभ्यर्थी और केंद्र प्रभावित थे")
    .replace(/अधिकांश केंद्र का परिणाम/g, "अधिकांश केंद्रों के परिणाम")
    .replace(/अधिकांश पेपर लीक का आरोप अनदेखी करनी होगी/g, "बाद के पेपर लीक आरोपों को अनदेखा करना होगा")
    .replace(/अधिकांश नकल की शिकायत अनदेखी करनी होगी/g, "बाद की नकल शिकायतों को अनदेखा करना होगा")
    .replace(/एक नकल की शिकायत ही सिद्ध करता है/g, "एक नकल की शिकायत ही सिद्ध करती है")
    .replace(/गृह-राज्य से बाहर कार्ड लेन-देन की अधिकांश घटना या तो धोखाधड़ी है या उसे धोखाधड़ी मानना चाहिए/g, "गृह-राज्य से बाहर कार्ड लेन-देन के अधिकांश मामले या तो धोखाधड़ी हैं या उन्हें धोखाधड़ी मानना चाहिए")
    .replace(/(अभ्यर्थी सहायता और बैकअप व्यवस्था[^।.!?]*?)उपलब्ध हो जाएगा/g, "$1उपलब्ध हो जाएँगी")
    .replace(/(संक्षिप्त आगमन विंडो[^।.!?]*?)कम कर सकता है/g, "$1कम कर सकती है")
    .replace(/लोगों अक्सर/g, "लोग अक्सर")
    .replace(/उस राशि के आधार पर जानकारी के आधार पर खरीद निर्णय/g, "उस राशि को ध्यान में रखकर जानकारीपूर्ण खरीद निर्णय")
    .replace(/आसपास के अधिकांश व्यवसाय को स्थायी रूप से बंद कर देता है/g, "आसपास के अधिकांश व्यवसायों को स्थायी रूप से बंद कर देता है");
}

function repairPunjabi(value: string): string {
  return value
    .replace(/ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲੇ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲਿਆਂ ਕੋਲ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕਾਂ ਕੋਲ")
    .replace(/ਬਿਨਾਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ ([^।,.!?]+?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਬਿਨਾਂ $1 ਦੀਆਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮਾਂ ਸੰਭਾਲ ਸਕਦੇ ਹਨ")
    .replace(/ਟ੍ਰੇਨੀਜ਼ ਦੀ ਪਛਾਣ ਕਰਨ ਵਾਲੀ ਨਾਮ ਅਤੇ/g, "ਟ੍ਰੇਨੀਜ਼ ਦੇ ਨਾਮ ਅਤੇ")
    .replace(/ਟ੍ਰੇਨੀਜ਼ ਦੀ ਨਾਮ ਅਤੇ/g, "ਟ੍ਰੇਨੀਜ਼ ਦੇ ਨਾਮ ਅਤੇ")
    .replace(/(ਪੇਪਰ ਲੀਕ ਦੋਸ਼) ਹੀ ਸਾਬਤ ਕਰਦੀ ਹੈ/g, "$1 ਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ")
    .replace(/(?:ਦਾ|ਦੇ) ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ")
    .replace(/ਲੋਕਾਂ ਜੋ/g, "ਲੋਕ ਜੋ")
    .replace(/ਰਿਮੋਟ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਜੋ ਵੀ ਰਿਮੋਟ ਕਰਮਚਾਰੀ")
    .replace(/ਕੌਨਟ੍ਰੈਕਟ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਜੋ ਵੀ ਕੌਨਟ੍ਰੈਕਟ ਕਰਮਚਾਰੀ")
    .replace(/ਡਾਟਾ ਇਕੱਠਾ ਕਰਨ ਦਾ ਮਕਸਦ ਕੀ ਹੈ ਬਾਰੇ/g, "ਡਾਟਾ ਇਕੱਠਾ ਕਰਨ ਦੇ ਮਕਸਦ ਬਾਰੇ")
    .replace(/(ਸਰਕਾਰੀ ਹਸਪਤਾਲਾਂ|ਜਨਤਕ ਸੇਵਾ ਦਫ਼ਤਰਾਂ) ਵਰਤਦੇ ਸਮੇਂ/g, "$1 ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਸਮੇਂ")
    .replace(/ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ([^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ$1ਘੱਟ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਨਿਰਧਾਰਤ ਮੁਲਾਕਾਤ ਸਲਾਟ([^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "ਨਿਰਧਾਰਤ ਮੁਲਾਕਾਤ ਸਲਾਟ$1ਘੱਟ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਇਹ ਕੰਮ ਨਹੀਂ ਕਰ ਸਕਦੀ/g, "ਇਹ ਪ੍ਰਣਾਲੀ ਕੰਮ ਨਹੀਂ ਕਰ ਸਕਦੀ")
    .replace(/ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ,? ([^।.!?]{1,160}?) ਦੇ ਜੋਖਮ ਨੂੰ ਸੰਬੋਧ ਸਕਦੀ ਹੈ/g, "ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ $1 ਦੇ ਜੋਖਮ ਨੂੰ ਘਟਾ ਸਕਦਾ ਹੈ")
    .replace(/(ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ[^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "$1ਘੱਟ ਕਰ ਸਕਦਾ ਹੈ")
    .replace(/([^।.!?]{1,160}?) ਦੀ ਜ਼ਿਆਦਾਤਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ ਹੈ ਜਾਂ ਉਸਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ/g, "$1 ਦੇ ਜ਼ਿਆਦਾਤਰ ਮਾਮਲੇ ਧੋਖਾਧੜੀ ਦੇ ਹੁੰਦੇ ਹਨ")
    .replace(/ਭੁਗਤਾਨ ਖਾਤਾ ਦੀ/g, "ਭੁਗਤਾਨ ਖਾਤੇ ਦੀ")
    .replace(/ਭੁਗਤਾਨ ਖਾਤਾ ਨਾਲ/g, "ਭੁਗਤਾਨ ਖਾਤੇ ਨਾਲ")
    .replace(/ਭੁਗਤਾਨ ਖਾਤਾ ਦਾ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬਦਲਾਅ/g, "ਭੁਗਤਾਨ ਖਾਤੇ ਵਿੱਚ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬਦਲਾਅ")
    .replace(/ਲੈਣ-ਦੇਣ ਸੀਮਾ ਦਾ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬਦਲਾਅ ਅਮਲ ਵਿੱਚ ਔਖਾ ਹੋ ਜਾਵੇਗਾ/g, "ਲੈਣ-ਦੇਣ ਸੀਮਾ ਵਿੱਚ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬਦਲਾਅ ਕਰਨਾ ਅਮਲ ਵਿੱਚ ਔਖਾ ਹੋ ਜਾਵੇਗਾ")
    .replace(/ਭੁਗਤਾਨ ਖਾਤਾ ਬਦਲਣ ਦੀ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬੇਨਤੀ ਵੀ ਅਮਲ ਵਿੱਚ ਔਖਾ ਹੋਵੇਗੀ/g, "ਭੁਗਤਾਨ ਖਾਤਾ ਬਦਲਣ ਲਈ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਬੇਨਤੀਆਂ ਵੀ ਅਮਲ ਵਿੱਚ ਔਖੀਆਂ ਹੋਣਗੀਆਂ")
    .replace(/AI ਚੈਟ ਟਰਮੀਨਲ, ([^।.!?]{1,160}?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "AI ਚੈਟ ਟਰਮੀਨਲ, $1 ਸੰਭਾਲ ਸਕਦਾ ਹੈ")
    .replace(/ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ ਦੀ ਸਮਰੱਥਾ ਦਾ ਵੱਡਾ ਹਿੱਸਾ ਗੁਆ ਦੇਣਗੇ")
    .replace(/ਭਵਿੱਖ ਵਿੱਚ ਜ਼ਿਆਦਾਤਰ ਕਿਸੇ ਦੀ ਭਵਿੱਖ ਦਾ ਡੈੱਡਲਾਈਨ ਅਨੁਸ਼ਾਸਨ ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ ਯਕੀਨੀ ਹੋ ਜਾਵੇਗੀ/g, "ਭਵਿੱਖ ਵਿੱਚ ਟ੍ਰੇਨੀਜ਼ ਦਾ ਡੈੱਡਲਾਈਨ ਅਨੁਸ਼ਾਸਨ ਲਗਭਗ ਯਕੀਨੀ ਹੋ ਜਾਵੇਗਾ")
    .replace(/(ਕਾਫ਼ੀ ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ[^।.!?]*?)ਉਪਲਬਧ ਹੋ ਜਾਣਗੇ/g, "$1ਉਪਲਬਧ ਹੋ ਜਾਵੇਗੀ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਕੇਂਦਰ ਦਾ ਨਤੀਜਾ/g, "ਜ਼ਿਆਦਾਤਰ ਕੇਂਦਰਾਂ ਦੇ ਨਤੀਜੇ")
    .replace(/ਸਥਾਈ ਜਾਮ ਸ਼ਾਇਦ ਹੋ ਜਾਵੇਗਾ/g, "ਲੰਬੇ ਸਮੇਂ ਦਾ ਜਾਮ ਪੈ ਜਾਵੇਗਾ")
    .replace(/ਪ੍ਰਕਿਰਿਆਵਾਂ ਦੀ ਬਿਹਤਰ ਯਾਦ ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ/g, "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ ਲਈ ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਸੂਚਨਾ ਤੁਰੰਤ ਬਾਅਦ/g, "ਸੂਚਨਾ ਦੇ ਤੁਰੰਤ ਬਾਅਦ")
    .replace(/ਬਿਨਾਂ ਕਿਸੇ ਵੱਖ ਕਲੈਕਸ਼ਨ ਵਾਹਨ ਦੇ/g, "ਵੱਖਰੇ ਇਕੱਠ ਵਾਹਨ ਤੋਂ ਬਿਨਾਂ")
    .replace(/ਵੱਖ ਕਲੈਕਸ਼ਨ ਵਾਹਨ ਦੇ ਬਿਨਾਂ/g, "ਵੱਖਰੇ ਇਕੱਠ ਵਾਹਨ ਤੋਂ ਬਿਨਾਂ")
    .replace(/ਭੋਜਨ ਕੂੜੇ ਅਤੇ ਹੋਰ ਕੂੜੇ ਦੀ ਵੰਡ ਸਿੱਧੇ ਕੰਮ ਕਰੇਗੀ/g, "ਭੋਜਨ ਕੂੜੇ ਅਤੇ ਹੋਰ ਕੂੜੇ ਨੂੰ ਵੱਖ ਰੱਖਣ ਦੀ ਪ੍ਰਣਾਲੀ ਆਪਣੇ ਆਪ ਠੀਕ ਚੱਲੇਗੀ")
    .replace(/ਵੱਖ ਕੀਤਾ ਭੋਜਨ ਕੂੜੇ ਅਤੇ ਹੋਰ ਕੂੜੇ ਮੁੜ ਮਿਲ ਸਕਦਾ ਹੈ/g, "ਵੱਖ ਕੀਤਾ ਭੋਜਨ ਕੂੜਾ ਅਤੇ ਹੋਰ ਕੂੜਾ ਮੁੜ ਮਿਲ ਸਕਦੇ ਹਨ")
    .replace(/ਪਾਲਣਾ ਅਤੇ ਭਰੋਸਾ ਘੱਟੇਗਾ/g, "ਪਾਲਣਾ ਅਤੇ ਭਰੋਸਾ ਘਟ ਸਕਦੇ ਹਨ")
    .replace(/ਉਸ ਰਸਤੇ ਦੀ ਘੱਟ ਸੜਕ ਜਗ੍ਹਾ ਦੀ ਮੰਗ/g, "ਉਸ ਰਸਤੇ ਦੀ ਸੀਮਿਤ ਸੜਕ-ਜਗ੍ਹਾ ਉੱਤੇ ਮੰਗ");
}

function repair(value: string, language: Language): string {
  if (language === "hi") return repairHindi(value);
  if (language === "pa") return repairPunjabi(value);
  return repairEnglish(value);
}

function repairLocalizedQl006T04Explanation(
  question: Question,
  language: Language,
  argumentsList: readonly string[],
  current: string,
): string {
  if (text(question.templateId) !== "ARG-CP003-QL006-T04" || language === "en" || argumentsList.length !== 2) return current;
  const strengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths.map((value: unknown) => text(value).toUpperCase()) : [];
  if (strengths.length !== 2 || strengths.some((strength: string) => strength !== "WEAK")) return current;

  const reasonFor = (argument: string): string | undefined => {
    if (language === "hi") {
      if (/(?:सिद्ध|साबित).*(?:अभ्यर्थी|उम्मीदवार).*केंद्र/.test(argument)) {
        return "एक शिकायत या आरोप से यह सिद्ध नहीं होता कि अधिकांश अभ्यर्थी और केंद्र प्रभावित हैं; व्यापक कार्रवाई से पहले प्रमाण और प्रभाव-क्षेत्र की जाँच जरूरी है।";
      }
      if (/(?:या तो|अनदेखा|बंद करना|बंद करना होगा)/.test(argument)) {
        return "प्राधिकरण के पास शिकायत को अनदेखा करने या परीक्षा बंद करने के अलावा भी विकल्प हैं; वह प्रमाण की जाँच करके अनुपातिक कार्रवाई कर सकता है।";
      }
      return undefined;
    }
    if (/(?:ਸਾਬਤ).*(?:ਉਮੀਦਵਾਰ).*ਕੇਂਦਰ/.test(argument)) {
      return "ਇੱਕ ਸ਼ਿਕਾਇਤ ਜਾਂ ਦੋਸ਼ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਹਨ; ਵਿਆਪਕ ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਸਬੂਤ ਅਤੇ ਪ੍ਰਭਾਵ ਦਾ ਦਾਇਰਾ ਜਾਂਚਣਾ ਲਾਜ਼ਮੀ ਹੈ।";
    }
    if (/(?:ਕਾਰਵਾਈ ਨਹੀਂ|ਅਣਡਿੱਠ|ਬੰਦ ਕਰਨਾ|ਬੰਦ ਕਰਨਾ ਪਵੇਗਾ)/.test(argument)) {
      return "ਅਥਾਰਟੀ ਕੋਲ ਸ਼ਿਕਾਇਤ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨ ਜਾਂ ਪ੍ਰੀਖਿਆ ਬੰਦ ਕਰਨ ਤੋਂ ਇਲਾਵਾ ਵੀ ਵਿਕਲਪ ਹਨ; ਉਹ ਸਬੂਤ ਜਾਂਚ ਕੇ ਅਨੁਪਾਤਿਕ ਕਾਰਵਾਈ ਕਰ ਸਕਦੀ ਹੈ।";
    }
    return undefined;
  };

  const reasons = argumentsList.map(reasonFor);
  if (!reasons[0] || !reasons[1]) return current;
  if (language === "hi") {
    return `तर्क I कमजोर है: ${reasons[0]} तर्क II कमजोर है: ${reasons[1]}`;
  }
  return `ਦਲੀਲ I ਕਮਜ਼ੋਰ ਹੈ: ${reasons[0]} ਦਲੀਲ II ਕਮਜ਼ੋਰ ਹੈ: ${reasons[1]}`;
}

function stemFor(statement: string, language: Language, argumentsList: readonly string[]): string {
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${statement}\nArguments:\n${rendered}`;
}

export function preRepairArgCp015HumanAuditSurface(question: Question): Question {
  const language = languageOf(question);
  const originalArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const originalStatement = text(question.statement);
  const originalExplanation = text(question.explanation);
  const statement = repair(originalStatement, language);
  const argumentsList = originalArguments.map((argument) => repair(argument, language));
  const repairedExplanation = repair(originalExplanation, language);
  const explanation = repairLocalizedQl006T04Explanation(question, language, argumentsList, repairedExplanation);

  const changed = statement !== originalStatement
    || argumentsList.some((argument, index) => argument !== originalArguments[index])
    || explanation !== originalExplanation;
  if (!changed) return question;

  const frozenArguments = Object.freeze(argumentsList);
  const stem = stemFor(statement, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    statement,
    frozenArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement,
    arguments: frozenArguments,
    explanation,
    stem,
    text: stem,
    humanAuditPreRepairAuthority: ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_AUTHORITY,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:HUMAN-AUDIT-PRE-REPAIR`,
  });
}
