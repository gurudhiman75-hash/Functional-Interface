import { createHash } from "node:crypto";

export const ARG_CP015_HUMAN_AUDIT_POLISH_AUTHORITY = "ARG_CP015_HUMAN_AUDIT_POLISH_V2" as const;

type Question = Readonly<Record<string, any>>;
type Language = "en" | "hi" | "pa";
type Strength = "STRONG" | "WEAK";

type Alternate = Readonly<{ argument: string; reason: string }>;

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
    .replace(/\bthat machine-learning anomaly alert is sufficient evidence\b/gi, "that a machine-learning anomaly alert is sufficient evidence")
    .replace(/(^|[.!?;:]\s+)machine-learning anomaly alert is sufficient evidence/gi, "$1a machine-learning anomaly alert is sufficient evidence")
    .replace(/\btemporary risk controls is\b/gi, "temporary risk controls are")
    .replace(/\bservice-access burden that falls disproportionately on long periods\b/gi, "service-access burden that falls disproportionately on people who cannot stand for long periods")
    .replace(/\bfrom most people in the future\b/gi, "among most people");
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
    .replace(/(?:ਦਾ|ਦੇ) ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ");
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

function monitoringLabel(statement: string, language: Language): string {
  if (language === "hi") {
    if (statement.includes("कीस्ट्रोक")) return "कीस्ट्रोक लॉगिंग";
    if (statement.includes("स्क्रीन")) return "स्क्रीन रिकॉर्डिंग";
    if (statement.includes("स्थान")) return "स्थान ट्रैकिंग";
    if (statement.includes("वेबकैम")) return "वेबकैम निगरानी";
    return "यह निगरानी तरीका";
  }
  if (language === "pa") {
    if (statement.includes("ਕੀ-ਸਟ੍ਰੋਕ") || statement.includes("ਕੀਸਟ੍ਰੋਕ")) return "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ";
    if (statement.includes("ਸਕ੍ਰੀਨ")) return "ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ";
    if (statement.includes("ਸਥਾਨ") || statement.includes("ਲੋਕੇਸ਼ਨ")) return "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ";
    if (statement.includes("ਵੈਬਕੈਮ")) return "ਵੈਬਕੈਮ ਨਿਗਰਾਨੀ";
    return "ਇਹ ਨਿਗਰਾਨੀ ਤਰੀਕਾ";
  }
  if (/keystroke/i.test(statement)) return "keystroke logging";
  if (/screen recording/i.test(statement)) return "continuous screen recording";
  if (/location tracking/i.test(statement)) return "location tracking";
  if (/webcam/i.test(statement)) return "webcam monitoring";
  return "this monitoring method";
}

function contextualAlternate(question: Question, language: Language): Alternate {
  const qlId = text(question.qlId);
  const statement = text(question.statement);

  if (qlId === "ARG-QL-002") {
    if (language === "hi") return Object.freeze({
      argument: "हाँ। अन्य वित्तीय पोर्टल भी संवेदनशील खाता-बदलाव के लिए अतिरिक्त सत्यापन करते हैं, इसलिए केवल उस प्रथा के आधार पर यहाँ भी यही नियंत्रण सही मान लेना चाहिए।",
      reason: "अन्य वित्तीय पोर्टलों की प्रथा अपने-आप यह सिद्ध नहीं करती कि यही नियंत्रण इस खाते और इसकी रिकवरी जरूरतों के लिए उपयुक्त है।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਹਾਂ। ਹੋਰ ਵਿੱਤੀ ਪੋਰਟਲ ਵੀ ਸੰਵੇਦਨਸ਼ੀਲ ਖਾਤਾ-ਬਦਲਾਵਾਂ ਲਈ ਵਾਧੂ ਤਸਦੀਕ ਵਰਤਦੇ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਉਸ ਰਿਵਾਜ ਦੇ ਆਧਾਰ 'ਤੇ ਇੱਥੇ ਵੀ ਇਹੀ ਕੰਟਰੋਲ ਠੀਕ ਮੰਨਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।",
      reason: "ਹੋਰ ਵਿੱਤੀ ਪੋਰਟਲਾਂ ਦੀ ਪ੍ਰਥਾ ਆਪਣੇ ਆਪ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ ਕਿ ਇਹੀ ਕੰਟਰੋਲ ਇਸ ਖਾਤੇ ਅਤੇ ਇਸ ਦੀ ਰਿਕਵਰੀ ਲੋੜ ਲਈ ਢੁੱਕਵਾਂ ਹੈ।",
    });
    return Object.freeze({
      argument: "Yes. Other financial portals use extra verification for sensitive account changes, so that practice alone should be enough to justify the same control here.",
      reason: "Use by other financial portals does not by itself establish that the same control is appropriate for this account change and its recovery requirements.",
    });
  }

  if (qlId === "ARG-QL-005") {
    const label = monitoringLabel(statement, language);
    if (language === "hi") return Object.freeze({
      argument: `हाँ। दूसरे नियोक्ता भी ${label} का उपयोग करते हैं, इसलिए केवल उसका कहीं और उपयोग होना इस कार्यस्थल में इसे अपनाने के लिए पर्याप्त कारण माना जाना चाहिए।`,
      reason: `दूसरे नियोक्ताओं द्वारा ${label} का उपयोग यह सिद्ध नहीं करता कि इस कार्यस्थल में यह निगरानी आवश्यक, अनुपातिक या उचित है।`,
    });
    if (language === "pa") return Object.freeze({
      argument: `ਹਾਂ। ਹੋਰ ਨਿਯੋਗਤਾ ਵੀ ${label} ਵਰਤਦੇ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਹੋਰ ਥਾਵਾਂ ਉੱਤੇ ਇਸ ਦੀ ਵਰਤੋਂ ਹੀ ਇਸ ਕੰਮਕਾਜੀ ਥਾਂ 'ਤੇ ਇਸਨੂੰ ਅਪਣਾਉਣ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਮੰਨੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ।`,
      reason: `ਹੋਰ ਨਿਯੋਗਤਾਵਾਂ ਵੱਲੋਂ ${label} ਦੀ ਵਰਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ ਕਿ ਇਸ ਕੰਮਕਾਜੀ ਥਾਂ 'ਤੇ ਇਹ ਨਿਗਰਾਨੀ ਲੋੜੀਂਦੀ, ਅਨੁਪਾਤਿਕ ਜਾਂ ਨਿਆਂਯੋਗ ਹੈ।`,
    });
    return Object.freeze({
      argument: `Yes. Other employers use ${label}, so its use elsewhere should be treated as sufficient reason to adopt it in this workplace.`,
      reason: `Use of ${label} by other employers does not establish that the monitoring is necessary, proportionate or fair in this workplace.`,
    });
  }

  if (qlId === "ARG-QL-004" && /library|literacy|workshop|session/i.test(statement)) {
    if (language === "hi") return Object.freeze({
      argument: "हाँ। कई दूसरी सार्वजनिक पुस्तकालयें डिजिटल-साक्षरता सत्र चलाती हैं, इसलिए केवल यह प्रचलन ही इस पुस्तकालय में वही सत्र शुरू करने के लिए पर्याप्त कारण है।",
      reason: "दूसरी पुस्तकालयों का ऐसा सत्र चलाना इस पुस्तकालय की जरूरत, लक्ष्य-समूह या अपेक्षित लाभ को अपने-आप सिद्ध नहीं करता।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਹਾਂ। ਕਈ ਹੋਰ ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀਆਂ ਡਿਜ਼ਿਟਲ ਸਾਖਰਤਾ ਸੈਸ਼ਨ ਕਰਵਾਉਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਇਹ ਰਿਵਾਜ ਹੀ ਇਸ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਉਹੀ ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਹੈ।",
      reason: "ਹੋਰ ਲਾਇਬ੍ਰੇਰੀਆਂ ਵੱਲੋਂ ਅਜਿਹਾ ਸੈਸ਼ਨ ਕਰਵਾਉਣਾ ਇਸ ਲਾਇਬ੍ਰੇਰੀ ਦੀ ਲੋੜ, ਟਾਰਗੇਟ ਸਮੂਹ ਜਾਂ ਉਮੀਦਿਤ ਲਾਭ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
    });
    return Object.freeze({
      argument: "Yes. Several other public libraries run digital-literacy sessions, so that practice alone is enough reason for this library to introduce the same session.",
      reason: "Use of such sessions by other libraries does not establish this library's need, target group or likely benefit.",
    });
  }

  if (qlId === "ARG-QL-004") {
    if (language === "hi") return Object.freeze({
      argument: "हाँ। कुछ अन्य शहर व्यस्त समय में भारी वाहनों पर प्रतिबंध लगाते हैं, इसलिए केवल उनका ऐसा करना इस सड़क पर वही प्रतिबंध लगाने के लिए पर्याप्त कारण है।",
      reason: "दूसरे शहरों की नीति इस सड़क के यातायात, वैकल्पिक मार्गों और आवश्यक सेवाओं की स्थिति को अपने-आप सिद्ध नहीं करती।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਹਾਂ। ਕੁਝ ਹੋਰ ਸ਼ਹਿਰ ਭੀੜ ਵਾਲੇ ਸਮੇਂ ਭਾਰੀ ਵਾਹਨਾਂ 'ਤੇ ਪਾਬੰਦੀ ਲਗਾਉਂਦੇ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਉਹਨਾਂ ਦੀ ਇਹ ਨੀਤੀ ਹੀ ਇਸ ਸੜਕ 'ਤੇ ਉਹੀ ਪਾਬੰਦੀ ਲਗਾਉਣ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਹੈ।",
      reason: "ਹੋਰ ਸ਼ਹਿਰਾਂ ਦੀ ਨੀਤੀ ਇਸ ਸੜਕ ਦੇ ਟ੍ਰੈਫਿਕ, ਬਦਲਵੇਂ ਰਸਤੇ ਅਤੇ ਜ਼ਰੂਰੀ ਸੇਵਾਵਾਂ ਦੀ ਸਥਿਤੀ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
    });
    return Object.freeze({
      argument: "Yes. Some other cities restrict heavy vehicles during peak periods, so that practice alone is enough reason to impose the same restriction on this road.",
      reason: "Policy in other cities does not establish the traffic conditions, alternative routes or essential-access needs on this road.",
    });
  }

  if (qlId === "ARG-QL-003") {
    if (language === "hi") return Object.freeze({
      argument: "हाँ। दूसरे सार्वजनिक कार्यालय समय-स्लॉट व्यवस्था चलाते हैं, इसलिए केवल उनका ऐसा करना इस सेवा के लिए भी स्लॉट शुरू करने का पर्याप्त कारण है।",
      reason: "दूसरे कार्यालयों में स्लॉट का उपयोग इस सेवा की मांग, पहुँच और संचालन जरूरतों को अपने-आप सिद्ध नहीं करता।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਹਾਂ। ਹੋਰ ਸਰਕਾਰੀ ਦਫ਼ਤਰ ਸਮਾਂ-ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਵਰਤਦੇ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਉਹਨਾਂ ਦੀ ਇਹ ਪ੍ਰਥਾ ਹੀ ਇਸ ਸੇਵਾ ਲਈ ਵੀ ਸਲਾਟ ਸ਼ੁਰੂ ਕਰਨ ਦਾ ਕਾਫ਼ੀ ਕਾਰਨ ਹੈ।",
      reason: "ਹੋਰ ਦਫ਼ਤਰਾਂ ਵਿੱਚ ਸਲਾਟ ਦੀ ਵਰਤੋਂ ਇਸ ਸੇਵਾ ਦੀ ਮੰਗ, ਪਹੁੰਚ ਅਤੇ ਚਲਾਉਣ ਦੀ ਲੋੜ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
    });
    return Object.freeze({
      argument: "Yes. Other public-service offices use appointment slots, so their use elsewhere is enough reason to introduce slots for this service too.",
      reason: "Use of appointment slots elsewhere does not establish this service's demand pattern, access needs or operating constraints.",
    });
  }

  if (qlId === "ARG-QL-006") {
    if (language === "hi") return Object.freeze({
      argument: "हाँ। कुछ अन्य संस्थाएँ ऐसी शिकायतों पर तुरंत कठोर दंड देती हैं, इसलिए केवल उनकी प्रतिक्रिया ही यहाँ भी तत्काल स्थायी दंड का पर्याप्त आधार है।",
      reason: "दूसरी संस्थाओं की प्रतिक्रिया इस मामले के प्रमाण, प्रक्रिया और अनुपातिकता को अपने-आप सिद्ध नहीं करती।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਹਾਂ। ਕੁਝ ਹੋਰ ਸੰਸਥਾਵਾਂ ਅਜਿਹੀਆਂ ਸ਼ਿਕਾਇਤਾਂ 'ਤੇ ਤੁਰੰਤ ਕੜੀ ਸਜ਼ਾ ਦਿੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਉਹਨਾਂ ਦੀ ਪ੍ਰਤੀਕਿਰਿਆ ਹੀ ਇੱਥੇ ਵੀ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਲਈ ਕਾਫ਼ੀ ਆਧਾਰ ਹੈ।",
      reason: "ਹੋਰ ਸੰਸਥਾਵਾਂ ਦੀ ਪ੍ਰਤੀਕਿਰਿਆ ਇਸ ਮਾਮਲੇ ਦੇ ਸਬੂਤ, ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਅਨੁਪਾਤਿਕਤਾ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
    });
    return Object.freeze({
      argument: "Yes. Some other institutions impose severe penalties immediately after similar complaints, so that practice alone is enough to justify a permanent penalty here.",
      reason: "How other institutions respond does not establish the evidence, due-process position or proportionality of a permanent penalty in this case.",
    });
  }

  if (language === "hi") return Object.freeze({
    argument: "हाँ। दूसरी संस्थाएँ भी इसी तरह की जानकारी प्रकाशित करती हैं, इसलिए केवल उनका ऐसा करना यहाँ भी वही नीति अपनाने के लिए पर्याप्त कारण है।",
    reason: "दूसरी संस्थाओं की प्रथा वर्तमान प्रक्रिया में इस जानकारी की प्रासंगिकता या लाभ को अपने-आप सिद्ध नहीं करती।",
  });
  if (language === "pa") return Object.freeze({
    argument: "ਹਾਂ। ਹੋਰ ਸੰਸਥਾਵਾਂ ਵੀ ਇਸੇ ਤਰ੍ਹਾਂ ਦੀ ਜਾਣਕਾਰੀ ਜਾਰੀ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਸਿਰਫ਼ ਉਹਨਾਂ ਦੀ ਇਹ ਪ੍ਰਥਾ ਹੀ ਇੱਥੇ ਵੀ ਉਹੀ ਨੀਤੀ ਅਪਣਾਉਣ ਲਈ ਕਾਫ਼ੀ ਕਾਰਨ ਹੈ।",
    reason: "ਹੋਰ ਸੰਸਥਾਵਾਂ ਦੀ ਪ੍ਰਥਾ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਇਸ ਜਾਣਕਾਰੀ ਦੀ ਸੰਬੰਧਤਾ ਜਾਂ ਲਾਭ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
  });
  return Object.freeze({
    argument: "Yes. Other institutions publish comparable information, so that practice alone should be enough reason to adopt the same policy here.",
    reason: "Practice elsewhere does not by itself establish the relevance or benefit of the information in the present process.",
  });
}

function claimOf(argument: string, language: Language): string {
  if (language === "hi") return argument.replace(/^(?:हाँ|नहीं)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  if (language === "pa") return argument.replace(/^(?:ਹਾਂ|ਨਹੀਂ)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  return argument.replace(/^(?:Yes|No)\.\s*/i, "").replace(/[.!?]+$/, "");
}

function distinctWeakReason(argument: string, language: Language): string {
  if (language === "en") {
    if (/digital|recorded video|automated tutorial/i.test(argument) && /better|superior/i.test(argument)) return "Being digital or recorded does not by itself establish better learning outcomes than the guided alternative in the statement.";
    if (/lose|lost|all ability|entire ability/i.test(argument) && /learning|training|tutorial|workshop|session/i.test(argument)) return "Replacing guided support may create learning limitations, but that does not establish that participants will lose all ability to achieve the stated learning outcome.";
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
    const bad = /\bservices takes\b|\ban readily\b|\bAny contract workers who\b|\bAny member of contract workers\b|\btemporary risk controls is\b|\bservice-access burden that falls disproportionately on long periods\b|(?:^|[.!?]\s+)machine-learning anomaly alert is sufficient evidence|Similar organisations use comparable measures/i;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 English human-audit regression survived final polish.`);
  } else if (language === "hi") {
    const bad = /शायदी|शायदत|क्रेडेंशियल भूलना कराता|बेहतर सीखने के परिणाम बेहतर|अधिकांश (?:नागरिक|आगंतुक) के पास|अधिकांश व्यक्ति के लिए|प्रमाण-आधारित जाँच भी शायद ही|कुछ समान संस्थाएँ ऐसे उपाय अपनाती हैं/;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 Hindi human-audit regression survived final polish.`);
  } else {
    const bad = /ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲੇ ਕੋਲ|ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ|ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ|ਕੁਝ ਮਿਲਦੀਆਂ ਸੰਸਥਾਵਾਂ ਅਜਿਹੇ ਕਦਮ ਵਰਤਦੀਆਂ ਹਨ/;
    if (bad.test(surface)) throw new Error(`${questionId}: CP015 Punjabi human-audit regression survived final polish.`);
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
      const replacement = contextualAlternate({ ...question, statement: nextStatement }, language);
      if (!nextArguments.some((argument, candidateIndex) => candidateIndex !== index && normalized(argument) === normalized(replacement.argument))) {
        nextArguments[index] = replacement.argument;
        reasons[index] = replacement.reason;
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
