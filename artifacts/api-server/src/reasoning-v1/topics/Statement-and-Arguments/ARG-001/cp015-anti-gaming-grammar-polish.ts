import { createHash } from "node:crypto";

import { ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY } from "./cp015-anti-gaming-cue-debias.ts";

export const ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY = "ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_V1" as const;

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

function polishEnglish(value: string): string {
  return value
    .replace(/service needs should rarely affect the timings of ([^.]+)\./gi, "service needs should carry little weight when setting the timings of $1.")
    .replace(/will disappear largely\./gi, "will be largely eliminated.")
    .replace(/in most ([a-z-]+(?: [a-z-]+)*) programme\b/gi, "across $1 programmes")
    .replace(/A change most ten days apparently makes most employee store credentials insecurely, so all portal passwords become less secure\./gi, "Changing portal passwords at ten-day intervals apparently makes employees store credentials insecurely, so the policy makes the passwords less secure.")
    .replace(/Changing portal passwords most ten days is treated as enough reason to assume that phishing can rarely lead to misuse\./gi, "Changing portal passwords at ten-day intervals is treated as enough reason to assume that phishing is no longer a material misuse risk.")
    .replace(/will generally make most legitimate change impractical/gi, "will make legitimate changes too impractical")
    .replace(/most genuine attempt to/gi, "genuine attempts to")
    .replace(/most genuine request to/gi, "genuine requests to")
    .replace(/most legitimate change\b/gi, "legitimate changes")
    .replace(/most employee\b/gi, "many employees")
    .replace(/most ([a-z-]+) programme\b/gi, "$1 programmes");
}

function polishHindi(value: string): string {
  return value
    .replace(/अनजाने उल्लंघनों काफी हद तक समाप्त हो जाएगा/g, "अनजाने उल्लंघन काफी हद तक समाप्त हो जाएँगे")
    .replace(/अधिकांश ([^।,.]+?) कार्यक्रम में/g, "$1 कार्यक्रमों में")
    .replace(/अवश्य देते हैं/g, "बेहतर मान लिए जाने चाहिए")
    .replace(/अधिकांश दस दिन में/g, "दस-दिन के अंतराल पर")
    .replace(/अधिकांश कर्मचारी को/g, "कई कर्मचारियों को")
    .replace(/अधिकांश नेटवर्क पासवर्ड/g, "नेटवर्क पासवर्ड")
    .replace(/भविष्य में इससे जुड़ी अधिकांश कठिनाई को काफी हद तक समाप्त कर देगी/g, "भविष्य की कठिनाइयों के समाधान के लिए इसी एक कार्यशाला को पर्याप्त मान लिया जाएगा")
    .replace(/अधिकांश वैध बदलाव/g, "वैध बदलावों")
    .replace(/अधिकांश वास्तविक बदलाव/g, "वास्तविक बदलावों");
}

function polishPunjabi(value: string): string {
  return value
    .replace(/ਜ਼ਿਆਦਾਤਰ ([^।,.]+?) ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ/g, "$1 ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ")
    .replace(/ਲਾਜ਼ਮੀ ਦਿੰਦੇ ਹਨ/g, "ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਅਕਸਰਂ/g, "ਅਕਸਰ")
    .replace(/ਵਿਚਾਰਨਾ ਸ਼ਾਇਦੀ ਨਹੀਂ/g, "ਵਿਚਾਰ ਨੂੰ ਘੱਟ ਮਹੱਤਵ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਭਵਿੱਖ ਵਿੱਚ ਜ਼ਿਆਦਾਤਰ ਕਿਸੇ ਦੇ ਭਵਿੱਖਲੇ ਹਾਜ਼ਰੀ ਵਿਹਾਰ ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ ਯਕੀਨੀ ਹੋ ਜਾਵੇਗੀ/g, "ਭਵਿੱਖਲੇ ਹਾਜ਼ਰੀ ਵਿਹਾਰ ਨੂੰ ਸੁਧਾਰਨ ਲਈ ਇਸ ਕਦਮ ਨੂੰ ਹੀ ਕਾਫ਼ੀ ਮੰਨਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਸੰਦਰਭ ਵਿੱਚ ਅਕਸਰ ਗਲਤ ਹੈ, ਭਾਵੇਂ ਸਹਿਮਤੀ, ਮਕਸਦ ਜਾਂ ਸੁਰੱਖਿਆ ਉਪਾਅ ਕੁਝ ਵੀ ਹੋਣ/g, "ਸਹਿਮਤੀ, ਮਕਸਦ ਜਾਂ ਸੁਰੱਖਿਆ ਉਪਾਅ ਦੀ ਜਾਂਚ ਕੀਤੇ ਬਿਨਾਂ ਹੀ ਗਲਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਅਸਧਾਰਣ ਉੱਚ-ਮੁੱਲ ਟ੍ਰਾਂਸਫਰ ਦੀ ਜ਼ਿਆਦਾਤਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ ਹੈ ਜਾਂ ਉਸਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ/g, "ਅਸਧਾਰਣ ਉੱਚ-ਮੁੱਲ ਟ੍ਰਾਂਸਫਰ ਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣ ਲਈ ਜੋਖਮ-ਸੰਕੇਤ ਹੀ ਕਾਫ਼ੀ ਹੈ")
    .replace(/ਜਾਂ ਜ਼ਿਆਦਾਤਰ ([^।;]+?) ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ/g, "ਜਾਂ $1 ਉੱਤੇ ਕਾਰਵਾਈ ਨਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ")
    .replace(/ਭਵਿੱਖ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ/g, "ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਉੱਤੇ ਵੀ ਕਾਰਵਾਈ ਦਾ ਆਧਾਰ ਕਮਜ਼ੋਰ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਵਾਜਬ ਬਦਲਾਅ/g, "ਵਾਜਬ ਬਦਲਾਵਾਂ");
}

function polishArgument(value: string, language: Language): string {
  if (language === "hi") return polishHindi(value);
  if (language === "pa") return polishPunjabi(value);
  return polishEnglish(value);
}

function stemFor(question: Question, language: Language, argumentsList: readonly string[]): string {
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${text(question.statement)}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${text(question.statement)}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${text(question.statement)}\nArguments:\n${rendered}`;
}

export function polishArgCp015AntiGamingGrammar(question: Question): Question {
  if (question.antiGamingCueDebiasAuthority !== ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY) return question;
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length < 2) return question;
  const language = languageOf(question);
  const nextArguments = argumentsList.map((argument) => polishArgument(argument, language));
  if (nextArguments.every((argument, index) => argument === argumentsList[index])) return question;

  const frozenArguments = Object.freeze(nextArguments);
  const stem = stemFor(question, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    question.statement,
    frozenArguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    arguments: frozenArguments,
    stem,
    text: stem,
    antiGamingGrammarPolishAuthority: ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:GRAMMAR-POLISH`,
  });
}
