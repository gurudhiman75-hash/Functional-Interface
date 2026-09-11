import { createHash } from "node:crypto";

export const ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_AUTHORITY = "ARG_CP015_HUMAN_AUDIT_PRE_REPAIR_V4" as const;

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
    .replace(/(^|[.!?;:]\s+|\bthat\s+)machine-learning anomaly alert is sufficient evidence/gi, "$1a machine-learning anomaly alert is sufficient evidence")
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
    .replace(/(निर्धारित विज़िट स्लॉट[^।.!?]*?) कम कर सकता है/g, "$1 कम कर सकते हैं")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) का वास्तविक बदलावों अव्यावहारिक हो जाएगा/g, "$1 में वास्तविक बदलाव अव्यावहारिक हो जाएँगे")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) के वैध बदलावों विफल होंगे/g, "$1 में वैध बदलाव विफल होंगे")
    .replace(/भुगतान खाते के वैध बदलावों विफल होंगे/g, "भुगतान खाते में वैध बदलाव विफल होंगे")
    .replace(/भुगतान खाता में/g, "भुगतान खाते में");
}

function repairPunjabi(value: string): string {
  return value
    .replace(/ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲੇ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਆਉਣ ਵਾਲਿਆਂ ਕੋਲ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕਾਂ ਕੋਲ")
    .replace(/ਬਿਨਾਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ ([^।,.!?]+?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਬਿਨਾਂ $1 ਦੀਆਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮਾਂ ਸੰਭਾਲ ਸਕਦੇ ਹਨ")
    .replace(/ਟ੍ਰੇਨੀਜ਼ ਦੀ ਪਛਾਣ ਕਰਨ ਵਾਲੀ ਨਾਮ ਅਤੇ/g, "ਟ੍ਰੇਨੀਜ਼ ਦੇ ਨਾਮ ਅਤੇ")
    .replace(/(ਪੇਪਰ ਲੀਕ ਦੋਸ਼) ਹੀ ਸਾਬਤ ਕਰਦੀ ਹੈ/g, "$1 ਹੀ ਸਾਬਤ ਕਰਦਾ ਹੈ")
    .replace(/(?:ਦਾ|ਦੇ) ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ")
    .replace(/ਲੋਕਾਂ ਜੋ/g, "ਲੋਕ ਜੋ")
    .replace(/(ਸਰਕਾਰੀ ਹਸਪਤਾਲਾਂ|ਜਨਤਕ ਸੇਵਾ ਦਫ਼ਤਰਾਂ) ਵਰਤਦੇ ਸਮੇਂ/g, "$1 ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਸਮੇਂ")
    .replace(/ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ([^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ$1ਘੱਟ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ,? ([^।.!?]{1,160}?) ਦੇ ਜੋਖਮ ਨੂੰ ਸੰਬੋਧ ਸਕਦੀ ਹੈ/g, "ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ $1 ਦੇ ਜੋਖਮ ਨੂੰ ਘਟਾ ਸਕਦਾ ਹੈ")
    .replace(/(ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ[^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "$1ਘੱਟ ਕਰ ਸਕਦਾ ਹੈ")
    .replace(/([^।.!?]{1,160}?) ਦੀ ਜ਼ਿਆਦਾਤਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ ਹੈ ਜਾਂ ਉਸਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ/g, "$1 ਦੇ ਜ਼ਿਆਦਾਤਰ ਮਾਮਲੇ ਧੋਖਾਧੜੀ ਦੇ ਹੁੰਦੇ ਹਨ");
}

function repair(value: string, language: Language): string {
  if (language === "hi") return repairHindi(value);
  if (language === "pa") return repairPunjabi(value);
  return repairEnglish(value);
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
  const explanation = repair(originalExplanation, language);

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
