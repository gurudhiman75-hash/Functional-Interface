import { createHash } from "node:crypto";

export const ARG_CP015_HUMAN_AUDIT_POLISH_AUTHORITY = "ARG_CP015_HUMAN_AUDIT_POLISH_V1" as const;

type Question = Readonly<Record<string, any>>;
type Language = "en" | "hi" | "pa";
type Strength = "STRONG" | "WEAK";

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function languageOf(question: Question): Language {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa";
  return "en";
}

function strengthsOf(question: Question, count: number): readonly Strength[] | undefined {
  const values = Array.isArray(question.argumentStrengths) ? question.argumentStrengths : [];
  if (values.length !== count) return undefined;
  const normalized = values.map((value) => text(value).toUpperCase());
  if (normalized.some((value) => value !== "STRONG" && value !== "WEAK")) return undefined;
  return normalized as readonly Strength[];
}

function repairEnglish(value: string): string {
  return value
    .replace(/\bWhere ((?:standard certificate|routine document|registration|fee-payment) services) takes\b/gi, "Where $1 take")
    .replace(/\ban readily\b/gi, "a readily")
    .replace(/\bAny contract workers who\b/gi, "Any contract worker who")
    .replace(/\bAny member of contract workers who\b/gi, "Any contract worker who")
    .replace(/\bmachine-learning anomaly alert is sufficient evidence\b/gi, "a machine-learning anomaly alert is sufficient evidence")
    .replace(/\bthat machine-learning anomaly alert is sufficient evidence\b/gi, "that a machine-learning anomaly alert is sufficient evidence")
    .replace(/\btemporary risk controls is unnecessary\b/gi, "temporary risk controls are unnecessary")
    .replace(/\bservice-access burden that falls disproportionately on long periods\b/gi, "service-access burden that falls disproportionately on people who cannot stand for long periods")
    .replace(/\bfrom most people in the future\b/gi, "among most people");
}

function repairHindi(value: string): string {
  return value
    .replace(/सेवा-शायदतें/g, "सेवा-आवश्यकताएँ")
    .replace(/अतिरिक्त धोखाधड़ी सुरक्षा की शायदत/g, "अतिरिक्त धोखाधड़ी सुरक्षा की आवश्यकता")
    .replace(/की कोई शायदत नहीं/g, "की कोई आवश्यकता नहीं")
    .replace(/कोई शायदत नहीं/g, "कोई आवश्यकता नहीं")
    .replace(/होना शायदी होगा/g, "होना आवश्यक होगा")
    .replace(/अधिकांश नागरिक के पास/g, "अधिकांश नागरिकों के पास")
    .replace(/अधिकांश आगंतुक के पास/g, "अधिकांश आगंतुकों के पास")
    .replace(/अधिकांश व्यक्ति के लिए/g, "अधिकांश लोगों के लिए")
    .replace(/क्रेडेंशियल भूलना कराता है/g, "क्रेडेंशियल भूलने की समस्या बढ़ाता है")
    .replace(/बेहतर सीखने के परिणाम बेहतर मान लिए जाने चाहिए/g, "बेहतर सीखने के परिणाम देने वाले मान लिए जाने चाहिए")
    .replace(/प्रमाण-आधारित जाँच भी शायद ही करनी चाहिए/g, "प्रमाण-आधारित जाँच भी नहीं करनी चाहिए")
    .replace(/सभी ([^।,.!?]+?) सत्रों की जगह ([^।,.!?]+?) कर देना चाहिए/g, "सभी $1 सत्रों को $2 से बदल देना चाहिए")
    .replace(/(निर्धारित विज़िट स्लॉट[^।.!?]*?) कम कर सकता है/g, "$1 कम कर सकते हैं");
}

function repairPunjabi(value: string): string {
  return value
    .replace(/ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲੇ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲਿਆਂ ਕੋਲ")
    .replace(/ਬਿਨਾਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ ([^।,.!?]+?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਬਿਨਾਂ $1 ਦੀਆਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮਾਂ ਸੰਭਾਲ ਸਕਦੇ ਹਨ")
    .replace(/ਟ੍ਰੇਨੀਜ਼ ਦੀ ਪਛਾਣ ਕਰਨ ਵਾਲੀ ਨਾਮ ਅਤੇ/g, "ਟ੍ਰੇਨੀਜ਼ ਦੇ ਨਾਮ ਅਤੇ")
    .replace(/(ਪੇਪਰ ਲੀਕ ਦੋਸ਼) ਹੀ ਸਾਬਤ ਕਰਦੀ ਹੈ/g, "$1 ਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ")
    .replace(/ਦਾ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ")
    .replace(/ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ");
}

function repairSurface(value: string, language: Language): string {
  if (language === "hi") return repairHindi(value);
  if (language === "pa") return repairPunjabi(value);
  return repairEnglish(value);
}

function prefixes(language: Language, count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} `;
    if (language === "pa") return `ਦਲੀਲ ${label} `;
    return `Argument ${label} `;
  });
}

function extractReasons(explanation: string, language: Language, count: number): string[] | undefined {
  const markers = prefixes(language, count);
  const reasons: string[] = [];
  for (let index = 0; index < markers.length; index += 1) {
    const start = explanation.indexOf(markers[index]!);
    if (start < 0) return undefined;
    const colon = explanation.indexOf(": ", start);
    if (colon < 0) return undefined;
    const next = markers[index + 1];
    const end = next ? explanation.indexOf(next, colon + 2) : explanation.length;
    reasons.push(explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim());
  }
  return reasons;
}

function formatExplanation(language: Language, strengths: readonly Strength[], reasons: readonly string[]): string {
  return reasons.map((reason, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} ${strengths[index] === "STRONG" ? "मजबूत" : "कमजोर"} है: ${reason}`;
    if (language === "pa") return `ਦਲੀਲ ${label} ${strengths[index] === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${reason}`;
    return `Argument ${label} is ${strengths[index]!.toLowerCase()}: ${reason}`;
  }).join(" ");
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function weakFamily(argument: string, language: Language): string | undefined {
  if (language === "en") {
    if (/fraud/i.test(argument) && /(never|no fraudulent|every future|almost no further|guarantee|ensures)/i.test(argument)) return "SECURITY_ABSOLUTE";
    if (/cannot be trusted|something to conceal|something to hide|trying to avoid oversight/i.test(argument)) return "PRIVACY_STEREOTYPE";
    if (/workshop|orientation/i.test(argument) && /nearly all|all misunderstanding|no further|unnecessary|solve nearly|remove nearly/i.test(argument)) return "ONE_SESSION_OVERCLAIM";
    return undefined;
  }
  if (language === "hi") {
    if (/धोखाधड़ी/.test(argument) && /कभी|गारंटी|अनावश्यक|आवश्यकता नहीं/.test(argument)) return "SECURITY_ABSOLUTE";
    if (/भरोसा नहीं|कुछ छिप|निगरानी से बच/.test(argument)) return "PRIVACY_STEREOTYPE";
    if (/कार्यशाला|ओरिएंटेशन/.test(argument) && /सारी|लगभग|अनावश्यक|समाप्त|कठिनाई/.test(argument)) return "ONE_SESSION_OVERCLAIM";
    return undefined;
  }
  if (/ਧੋਖਾਧੜੀ/.test(argument) && /ਕਦੇ|ਗਾਰੰਟੀ|ਬੇਲੋੜੀ|ਲੋੜ ਨਹੀਂ/.test(argument)) return "SECURITY_ABSOLUTE";
  if (/ਭਰੋਸਾ ਨਹੀਂ|ਕੁਝ ਲੁਕ|ਨਿਗਰਾਨੀ ਤੋਂ ਬਚ/.test(argument)) return "PRIVACY_STEREOTYPE";
  if (/ਵਰਕਸ਼ਾਪ|ਓਰੀਐਂਟੇਸ਼ਨ/.test(argument) && /ਸਾਰੀ|ਲਗਭਗ|ਬੇਲੋੜੀ|ਖਤਮ|ਮੁਸ਼ਕਲ/.test(argument)) return "ONE_SESSION_OVERCLAIM";
  return undefined;
}

function alternateWeakArgument(language: Language): string {
  if (language === "hi") {
    return "हाँ। कुछ समान संस्थाएँ ऐसे उपाय अपनाती हैं, इसलिए केवल उनका उपयोग कहीं और होना इस प्रस्ताव को अपनाने के लिए पर्याप्त कारण माना जाना चाहिए।";
  }
  if (language === "pa") {
    return "ਹਾਂ। ਕੁਝ ਮਿਲਦੀਆਂ ਸੰਸਥਾਵਾਂ ਅਜਿਹੇ ਕਦਮ ਵਰਤਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਹੋਰ ਥਾਵਾਂ ਉੱਤੇ ਉਨ੍ਹਾਂ ਦੀ ਵਰਤੋਂ ਹੀ ਇਹ ਪ੍ਰਸਤਾਵ ਅਪਣਾਉਣ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਮੰਨੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ।";
  }
  return "Yes. Similar organisations use comparable measures, so their use elsewhere should be treated as sufficient reason to adopt this proposal.";
}

function alternateWeakReason(language: Language): string {
  if (language === "hi") return "अन्य संस्थाओं द्वारा अपनाया जाना यह सिद्ध नहीं करता कि वर्तमान संदर्भ में प्रस्ताव आवश्यक या लाभकारी है।";
  if (language === "pa") return "ਹੋਰ ਸੰਸਥਾਵਾਂ ਵੱਲੋਂ ਵਰਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ ਕਿ ਮੌਜੂਦਾ ਸੰਦਰਭ ਵਿੱਚ ਪ੍ਰਸਤਾਵ ਲੋੜੀਂਦਾ ਜਾਂ ਲਾਭਕਾਰੀ ਹੈ।";
  return "Use by other organisations does not establish that the proposal is necessary or beneficial in the present context.";
}

function claimOf(argument: string, language: Language): string {
  if (language === "hi") return argument.replace(/^(?:हाँ|नहीं)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  if (language === "pa") return argument.replace(/^(?:ਹਾਂ|ਨਹੀਂ)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  return argument.replace(/^(?:Yes|No)\.\s*/i, "").replace(/[.!?]+$/, "");
}

function distinctWeakReason(argument: string, language: Language): string {
  if (language === "en") {
    if (/digital|recorded video|automated tutorial/i.test(argument) && /better|superior/i.test(argument)) return "Being digital or recorded does not by itself establish better learning outcomes than the guided alternative in the statement.";
    if (/lose|lost|all ability|entire ability/i.test(argument) && /learning|training|tutorial|workshop|session/i.test(argument)) return "Replacing guided support may create learning limitations, but it does not establish that participants will lose all ability to achieve the stated learning outcome.";
    if (/desktop computer/i.test(argument)) return "A slot system does not inherently require every visitor to own an expensive desktop computer; that is an invented implementation condition.";
    if (/unworkable|impossible|cease to be deliverable|unlikely to function/i.test(argument)) return "A scheduling change can create access or rollout problems, but that does not show the underlying service becomes permanently unworkable.";
    if (/complaint|report|flag|allegation/i.test(argument) && /entire|whole|all .*affected/i.test(argument)) return "One complaint or signal does not establish that the whole process was affected; the scope should be verified before a system-wide response is ordered.";
    if (/ignore later|future complaints|stop conducting|false choice/i.test(argument)) return "Rejecting an immediate system-wide response does not require later complaints to be ignored; investigation and proportionate action remain available.";
    const claim = claimOf(argument, language);
    return `The separate claim that ${claim.charAt(0).toLowerCase()}${claim.slice(1)} does not follow from the proposal itself and needs independent support in this context.`;
  }

  if (language === "hi") {
    if (/डिजिटल|रिकॉर्ड किए गए वीडियो|स्वचालित ट्यूटोरियल/.test(argument) && /बेहतर/.test(argument)) return "केवल डिजिटल या रिकॉर्डेड माध्यम होना मार्गदर्शित विकल्प की तुलना में बेहतर सीखने के परिणाम सिद्ध नहीं करता।";
    if (/सारी क्षमता|पूरी क्षमता|क्षमता.*खो/.test(argument) && /सीखने|प्रशिक्षण|सत्र|ट्यूटोरियल/.test(argument)) return "मार्गदर्शित सहायता बदलने से कुछ कठिनाइयाँ हो सकती हैं, लेकिन इससे सीखने की पूरी क्षमता समाप्त होने का निष्कर्ष नहीं निकलता।";
    if (/पासवर्ड/.test(argument) && /पुनः उपयोग.*कभी/.test(argument)) return "बार-बार पासवर्ड बदलना पासवर्ड पुनः उपयोग के जोखिम को पूरी तरह समाप्त नहीं करता।";
    if (/क्रेडेंशियल भूल/.test(argument)) return "बार-बार बदलाव से उपयोगकर्ता कठिनाई हो सकती है, लेकिन यह अपने-आप पूरे पासवर्ड तंत्र को कम सुरक्षित सिद्ध नहीं करता।";
    if (/डेस्कटॉप कंप्यूटर/.test(argument)) return "समय-स्लॉट के लिए हर आगंतुक का महँगा डेस्कटॉप रखना आवश्यक नहीं है; यह एक काल्पनिक कार्यान्वयन शर्त है।";
    if (/स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|असंभव/.test(argument)) return "समय-स्लॉट कुछ पहुँच या कार्यान्वयन कठिनाइयाँ पैदा कर सकते हैं, लेकिन वे सेवा को स्थायी रूप से अव्यावहारिक नहीं बनाते।";
    if (/जोखिम स्कोर|फ्लैग/.test(argument) && /प्रमाण/.test(argument)) return "स्वचालित जोखिम संकेत जाँच का आधार हो सकता है, लेकिन अपने-आप धोखाधड़ी का निर्णायक प्रमाण नहीं है।";
    if (/जाँच.*नहीं करनी चाहिए|लेन-देन अनदेखे/.test(argument)) return "अधूरा संदर्भ होने की संभावना जाँच की आवश्यकता बढ़ाती है; उससे जाँच छोड़ने या फ्लैग किए लेन-देन अनदेखे करने का निष्कर्ष नहीं निकलता।";
    const claim = claimOf(argument, language);
    return `यह अलग दावा कि ${claim}, केवल कथन से अपने-आप सिद्ध नहीं होता और इसके लिए स्वतंत्र आधार चाहिए।`;
  }

  if (/ਡਿਜ਼ਿਟਲ|ਰਿਕਾਰਡ ਕੀਤਾ|ਆਟੋਮੈਟਿਕ ਟਿਊਟੋਰਿਅਲ/.test(argument) && /ਬਿਹਤਰ/.test(argument)) return "ਕੇਵਲ ਡਿਜ਼ਿਟਲ ਜਾਂ ਰਿਕਾਰਡ ਕੀਤਾ ਮਾਧਿਅਮ ਮਾਰਗਦਰਸ਼ਿਤ ਵਿਕਲਪ ਨਾਲੋਂ ਬਿਹਤਰ ਸਿੱਖਣ ਦੇ ਨਤੀਜੇ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।";
  if (/ਸਾਰੀ ਸਮਰੱਥਾ|ਸਮਰੱਥਾ.*ਗੁਆ/.test(argument) && /ਸਿੱਖਣ|ਟ੍ਰੇਨਿੰਗ|ਵਰਕਸ਼ਾਪ|ਸੈਸ਼ਨ/.test(argument)) return "ਮਾਰਗਦਰਸ਼ਿਤ ਸਹਾਇਤਾ ਬਦਲਣ ਨਾਲ ਕੁਝ ਮੁਸ਼ਕਲ ਆ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਸਿੱਖਣ ਦੀ ਸਾਰੀ ਸਮਰੱਥਾ ਖਤਮ ਹੋਣ ਦਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ।";
  if (/ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ/.test(argument)) return "ਸਮਾਂ-ਸਲਾਟ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ; ਇਹ ਬਣਾਈ ਹੋਈ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਸ਼ਰਤ ਹੈ।";
  if (/ਸਦਾ ਲਈ|ਅਮਲ ਵਿੱਚ ਔਖਾ|ਅਣਉਪਲਬਧ/.test(argument) && /ਸਮਾਂ-ਸਲਾਟ|ਸਲਾਟ/.test(argument)) return "ਸਮਾਂ-ਸਲਾਟ ਕੁਝ ਪਹੁੰਚ ਜਾਂ ਲਾਗੂ ਕਰਨ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਪੈਦਾ ਕਰ ਸਕਦੇ ਹਨ, ਪਰ ਸੇਵਾ ਨੂੰ ਸਦਾ ਲਈ ਅਮਲਯੋਗ ਨਹੀਂ ਬਣਾਉਂਦੇ।";
  if (/ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਫਲੈਗ/.test(argument) && /ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ|ਪੂਰੀ|ਸਾਰੇ.*ਪ੍ਰਭਾਵਿਤ/.test(argument)) return "ਇੱਕ ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਤੋਂ ਪੂਰੀ ਪ੍ਰੀਖਿਆ ਪ੍ਰਭਾਵਿਤ ਹੋਣ ਦਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ; ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਭਾਵ ਦਾ ਖੇਤਰ ਜਾਂਚਣਾ ਚਾਹੀਦਾ ਹੈ।";
  if (/ਕਾਰਵਾਈ ਨਹੀਂ ਕਰਨੀ|ਸਦਾ ਲਈ ਬੰਦ|ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ/.test(argument)) return "ਤੁਰੰਤ ਵਿਆਪਕ ਕਾਰਵਾਈ ਨਾ ਕਰਨ ਦਾ ਮਤਲਬ ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਅਣਡਿੱਠੀਆਂ ਕਰਨਾ ਨਹੀਂ ਹੈ; ਜਾਂਚ ਅਤੇ ਅਨੁਪਾਤਿਕ ਕਾਰਵਾਈ ਦੋਵੇਂ ਉਪਲਬਧ ਹਨ।";
  if (/ਨਾਂ|ਨਾਮ/.test(argument) && /ਵਿਹਾਰ|ਹਾਜ਼ਰੀ/.test(argument)) return "ਨਾਂ ਜਨਤਕ ਕਰਨ ਨਾਲ ਕੁਝ ਵਿਹਾਰ ਬਦਲ ਸਕਦਾ ਹੈ, ਪਰ ਇਹ ਭਵਿੱਖਲੇ ਵਿਹਾਰ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦਾ।";
  if (/ਸਹਿਮਤੀ|ਮਕਸਦ|ਸੁਰੱਖਿਆ ਉਪਾਅ/.test(argument)) return "ਪਰਦੇਦਾਰੀ ਦਾ ਮੁੱਦਾ ਸਹਿਮਤੀ, ਮਕਸਦ, ਅਨੁਪਾਤਿਕਤਾ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਤੋਲਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ; ਹਰ ਹਾਲਤ ਵਿੱਚ ਇਨਕਾਰ ਕਰਨਾ ਠੀਕ ਨਹੀਂ।";
  const claim = claimOf(argument, language);
  return `ਇਹ ਵੱਖਰਾ ਦਾਅਵਾ ਕਿ ${claim}, ਸਿਰਫ਼ ਕਥਨ ਤੋਂ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਅਤੇ ਇਸ ਲਈ ਵੱਖਰਾ ਆਧਾਰ ਚਾਹੀਦਾ ਹੈ।`;
}

function distinctStrongReason(argument: string, language: Language): string {
  const claim = claimOf(argument, language);
  if (language === "hi") return `यह तर्क सीधे कथन से जुड़ा व्यावहारिक कारण देता है: ${claim}।`;
  if (language === "pa") return `ਇਹ ਦਲੀਲ ਕਥਨ ਨਾਲ ਸਿੱਧਾ ਜੁੜਿਆ ਵਿਆਵਹਾਰਿਕ ਕਾਰਨ ਦਿੰਦੀ ਹੈ: ${claim}।`;
  return `This argument gives a distinct practical reason tied directly to the statement: ${claim}.`;
}

function stemFor(statement: string, language: Language, argumentsList: readonly string[]): string {
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${statement}\nArguments:\n${rendered}`;
}

function validateSurface(questionId: string, language: Language, surface: string, reasons: readonly string[] | undefined): void {
  if (language === "en") {
    const bad = /\bservices takes\b|\ban readily\b|\bAny contract workers who\b|\bAny member of contract workers\b|\btemporary risk controls is\b|\bservice-access burden that falls disproportionately on long periods\b|(?:^|[.!?]\s+)machine-learning anomaly alert is sufficient evidence/i;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 English human-audit grammar regression survived final polish.`);
  } else if (language === "hi") {
    const bad = /शायदी|शायदत|क्रेडेंशियल भूलना कराता|बेहतर सीखने के परिणाम बेहतर|अधिकांश (?:नागरिक|आगंतुक) के पास|अधिकांश व्यक्ति के लिए|प्रमाण-आधारित जाँच भी शायद ही/;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 Hindi human-audit grammar regression survived final polish.`);
  } else {
    const bad = /ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲੇ ਕੋਲ|ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ|ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ/;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 Punjabi human-audit grammar regression survived final polish.`);
  }

  if (reasons && new Set(reasons.map(normalized)).size !== reasons.length) {
    throw new Error(`${questionId}: CP015 final human-audit explanation contains duplicate argument reasons.`);
  }
}

export function polishArgCp015HumanAuditSurface(question: Question): Question {
  const language = languageOf(question);
  const originalArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (originalArguments.length < 2 || originalArguments.length > 4) return question;
  const strengths = strengthsOf(question, originalArguments.length);

  const nextStatement = repairSurface(text(question.statement), language);
  const nextArguments = originalArguments.map((argument) => repairSurface(argument, language));
  let explanation = repairSurface(text(question.explanation), language);
  let reasons = strengths ? extractReasons(explanation, language, nextArguments.length) : undefined;

  if (strengths && reasons) {
    const seenFamilies = new Map<string, number>();
    for (let index = 0; index < nextArguments.length; index += 1) {
      if (strengths[index] !== "WEAK") continue;
      const family = weakFamily(nextArguments[index]!, language);
      if (!family) continue;
      if (!seenFamilies.has(family)) {
        seenFamilies.set(family, index);
        continue;
      }
      const replacement = alternateWeakArgument(language);
      if (!nextArguments.some((argument, candidateIndex) => candidateIndex !== index && normalized(argument) === normalized(replacement))) {
        nextArguments[index] = replacement;
        reasons[index] = alternateWeakReason(language);
      }
    }

    const seenReasons = new Map<string, number>();
    for (let index = 0; index < reasons.length; index += 1) {
      const key = normalized(reasons[index]!);
      if (!seenReasons.has(key)) {
        seenReasons.set(key, index);
        continue;
      }
      reasons[index] = strengths[index] === "WEAK"
        ? distinctWeakReason(nextArguments[index]!, language)
        : distinctStrongReason(nextArguments[index]!, language);
    }
    explanation = formatExplanation(language, strengths, reasons);
  }

  const changed = nextStatement !== text(question.statement)
    || nextArguments.some((argument, index) => argument !== originalArguments[index])
    || explanation !== text(question.explanation);

  const questionId = text(question.questionId) || `${text(question.qlId)}:${text(question.templateId)}`;
  const surface = [nextStatement, ...nextArguments, explanation].join(" ");
  validateSurface(questionId, language, surface, reasons);
  if (!changed) return question;

  const frozenArguments = Object.freeze(nextArguments);
  const stem = stemFor(nextStatement, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_HUMAN_AUDIT_POLISH_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    nextStatement,
    frozenArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement: nextStatement,
    arguments: frozenArguments,
    explanation,
    stem,
    text: stem,
    humanAuditPolishAuthority: ARG_CP015_HUMAN_AUDIT_POLISH_AUTHORITY,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:HUMAN-AUDIT-POLISH`,
    diversitySourceMode: "CP015_HUMAN_AUDIT_POLISH" as const,
  });
}
