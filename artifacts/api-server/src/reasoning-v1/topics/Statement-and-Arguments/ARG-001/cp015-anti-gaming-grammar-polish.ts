import { createHash } from "node:crypto";

import { ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY } from "./cp015-anti-gaming-cue-debias.ts";
import { finalizeArgCp015EditorialQuality } from "./cp015-final-editorial-quality.ts";
import { polishArgCp015HumanAuditSurface } from "./cp015-human-audit-polish.ts";
import { preRepairArgCp015HumanAuditSurface } from "./cp015-human-audit-pre-repair.ts";

export const ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY = "ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_V12" as const;

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
    .replace(/Some applicants prefer a form that can rarely be changed after the first submission/gi, "Some applicants may prefer a form to become final after the first submission")
    .replace(/should be treated as sufficient to solve the queue problem without other demand or capacity measures/gi, "is likely to solve the queue problem on its own, making other demand or capacity measures unnecessary")
    .replace(/are generally careless/gi, "are usually careless")
    .replace(/Once ([^.]+?) attend (.+?), misunderstanding of (.+?) will be largely eliminated\./gi, "After $1 attend $2, that one session will remove nearly all misunderstanding of $3.")
    .replace(/One user once failed (.+?), so requiring it for (.+?) will make legitimate changes too impractical even when (.+?)\./gi, "Because one user failed $1, requiring it for $2 should be rejected even when $3.")
    .replace(/Changing portal passwords at ten-day intervals apparently makes employees store credentials insecurely, so the policy makes the passwords less secure\./gi, "Changing portal passwords at ten-day intervals will encourage insecure credential storage and weaken password security.")
    .replace(/Social-engineering fraud has occurred even when alerts were sent through (.+?), so alerts about (.+?) can rarely help reduce (.+?)\./gi, "Because a social-engineering fraud case occurred despite alerts through $1, alerts about $2 will not materially reduce $3.")
    .replace(/One customer once failed verification, so genuine attempts to (.+?) will become impractical\./gi, "Because one customer failed verification, legitimate attempts to $1 will be too unreliable.")
    .replace(/Since one user could not pass verification, genuine requests to (.+?) must also become impractical\./gi, "Since one user could not pass verification, legitimate requests to $1 will be too unreliable.")
    .replace(/A second verification for (.+?) is treated as enough reason to assume that (.+?) will rarely face fraud involving that change again\./gi, "With a second verification for $1, $2 will face almost no further fraud involving that change.")
    .replace(/would require most citizen using (.+?) to own/gi, "would effectively require each citizen using $1 to own")
    .replace(/would require most visitor to own/gi, "would effectively require each visitor to own")
    .replace(/unless most visitor owns/gi, "unless each visitor owns")
    .replace(/rebuilding most part of (.+?) from the ground up/gi, "extensive rebuilding of $1")
    .replace(/Once the decision is announced, enough (.+?) will readily become available everywhere (.+?)\./gi, "Approving the switch will automatically make sufficient $1 available everywhere $2.")
    .replace(/(.+?) can rarely be conducted securely in practice, regardless of (.+?)\./gi, "$1 cannot be secure even when the stated safeguards are in place.")
    .replace(/The rule for (.+?) can start from (.+?) without any (.+?); (.+?) will work readily\./gi, "The rule for $1 can begin from $2 without $3 because $4 will work immediately without transition support.")
    .replace(/Any use of time slots makes (.+?) permanently impractical to deliver\./gi, "Using time slots would make $1 unworkable in the long term.")
    .replace(/Once time slots are introduced, (.+?) can rarely be delivered successfully again\./gi, "Once time slots are introduced, $1 are unlikely to function successfully again.")
    .replace(/A time-slot system generally makes public services inaccessible to most people\./gi, "A time-slot system would make public services inaccessible to a large share of users.")
    .replace(/most use of (.+?) apparently causes (.+?), so no exception such as (.+?) can ever be justified\./gi, "Use of $1 will lead to $2, so even an exception such as $3 should be rejected.")
    .replace(/Because (.+?) can be useful for (.+?), the institution should rarely regulate it even to address (.+?)\./gi, "Because $1 can be useful for $2, the institution should avoid regulating it even where the rule is aimed at $3.")
    .replace(/A single workshop on the subject will largely solve most related difficulty participants may face in the future\./gi, "A single workshop will solve nearly all related difficulties participants may face in the future.")
    .replace(/If a limited restriction on (.+?) helps even once, heavy vehicles should rarely be allowed there again\./gi, "If a limited restriction on $1 helps even once, heavy vehicles should remain barred there outside the restricted period as well.")
    .replace(/Any brief limit on heavy vehicles at (.+?) will permanently ruin most activity in the surrounding area\./gi, "Any brief limit on heavy vehicles at $1 will cause lasting damage to activity throughout the surrounding area.")
    .replace(/are simply trying to avoid dense queueing like most people else\./gi, "are only seeking convenience rather than responding to a genuine access difficulty.")
    .replace(/will guarantee perfect future attendance behaviour from most people in the future\./gi, "will eliminate nearly all future lateness.")
    .replace(/is generally unacceptable in most context, regardless of consent, purpose or safeguards\./gi, "should be rejected even where consent, purpose and safeguards have been considered.")
    .replace(/Any modern tool such as (.+?) must apparently be fair when (.+?) uses it on (.+?)\./gi, "Because $1 is a modern tool, its use by $2 on $3 must be fair even without a separate necessity test.")
    .replace(/A (.+?) is generally proof of fraud, so there is no need for (.+?) even if (.+?)\./gi, "$1 is sufficient evidence of fraud on its own, so $2 is unnecessary even if $3.")
    .replace(/Because (.+?) can reflect (.+?), the bank should rarely use temporary risk controls or investigate flagged transactions at all instead of terminate the customer relationship\./gi, "Even though $1 can reflect $2, the bank should skip temporary risk controls and further investigation and terminate the customer relationship immediately.")
    .replace(/A single misconduct allegation can occur mainly when guilt is certain/gi, "A single misconduct allegation is sufficient evidence of guilt on its own")
    .replace(/((?:An?|One) [^.]+? (?:complaint|report|flag|allegation)) can occur mainly when guilt is certain/gi, "$1 is sufficient evidence of guilt on its own")
    .replace(/will predictably create permanent gridlock across the entire city/gi, "will create lasting gridlock across the city")
    .replace(/A branch using (.+?) can rarely provide any useful service, even when (.+?)\./gi, "A branch using $1 will provide no useful service even when $2.")
    .replace(/A single (.+?) complaint proves that most candidate and centre in (.+?) was affected/gi, "A single $1 complaint is enough to conclude that the entire $2 was affected")
    .replace(/must either ignore most (.+?) complaint or/gi, "must either ignore later $1 complaints or")
    .replace(/only if most visitor has/gi, "only if each visitor has")
    .replace(/service needs should rarely affect the timings of ([^.]+)\./gi, "service needs should carry little weight when setting the timings of $1.")
    .replace(/will disappear largely\./gi, "will be largely eliminated.")
    .replace(/in most ([a-z-]+(?: [a-z-]+)*) programme\b/gi, "across $1 programmes")
    .replace(/A change most ten days apparently makes most employee store credentials insecurely, so all portal passwords become less secure\./gi, "Changing portal passwords at ten-day intervals will encourage insecure credential storage and weaken password security.")
    .replace(/Changing portal passwords most ten days is treated as enough reason to assume that phishing can rarely lead to misuse\./gi, "Changing portal passwords at ten-day intervals makes phishing no longer a material misuse risk.")
    .replace(/will generally make most legitimate change impractical/gi, "will make legitimate changes too impractical")
    .replace(/most genuine attempt to/gi, "genuine attempts to")
    .replace(/most genuine request to/gi, "genuine requests to")
    .replace(/most legitimate change\b/gi, "legitimate changes")
    .replace(/most employee\b/gi, "many employees")
    .replace(/most citizen\b/gi, "most citizens")
    .replace(/most visitor\b/gi, "most visitors")
    .replace(/most candidate\b/gi, "most candidates")
    .replace(/most people else\b/gi, "most other people")
    .replace(/most part of\b/gi, "most of")
    .replace(/in most context\b/gi, "in most contexts")
    .replace(/most use of\b/gi, "use of")
    .replace(/permanently impractical\b/gi, "unworkable in the long term")
    .replace(/(.+?) can rarely ([^.]+)\./gi, "$1 would fail to $2 in most cases.")
    .replace(/(.+?) should rarely ([^.]+)\./gi, "$1 should generally avoid $2.")
    .replace(/(.+?) must apparently be ([^.]+)\./gi, "$1 should be $2.")
    .replace(/most ([a-z-]+) programme\b/gi, "$1 programmes")
    .replace(/\b(Yes|No)\.\s+most instances?\b/gi, "$1. Most instances")
    .replace(/\bmost instances of ([^.!?]+?) is\b/gi, "most instances of $1 are");
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
    .replace(/अधिकांश वास्तविक बदलाव/g, "वास्तविक बदलावों")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) का वास्तविक बदलावों अव्यावहारिक हो जाएगा/g, "$1 में वास्तविक बदलाव अव्यावहारिक हो जाएँगे")
    .replace(/(पंजीकृत मोबाइल नंबर|रिकवरी ईमेल|भुगतान खाता|लेन-देन सीमा) के वैध बदलावों विफल होंगे/g, "$1 में वैध बदलाव विफल होंगे");
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
    .replace(/ਜ਼ਿਆਦਾਤਰ ਵਾਜਬ ਬਦਲਾਅ/g, "ਵਾਜਬ ਬਦਲਾਵਾਂ")
    .replace(/([^।.!?]{1,80}) ਦੀ ਸਮਰੱਥਾ ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "$1 ਦੀ ਸਮਰੱਥਾ ਦਾ ਵੱਡਾ ਹਿੱਸਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ")
    .replace(/ਨਾਲੋਂ ਚੰਗੇ ([^।.!?]{1,100}) ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ/g, "ਨਾਲੋਂ $1 ਲਈ ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਲੋਕਾਂ ਜੋ/g, "ਲੋਕ ਜੋ")
    .replace(/ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕ ਕੋਲ/g, "ਜ਼ਿਆਦਾਤਰ ਨਾਗਰਿਕਾਂ ਕੋਲ")
    .replace(/([^,।!?]+?) ਵਰਤਦੇ ਸਮੇਂ/g, "$1 ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਸਮੇਂ")
    .replace(/ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ([^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਸਲਾਟ$1ਘੱਟ ਕਰ ਸਕਦੇ ਹਨ")
    .replace(/ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ, ([^।.!?]{1,140}?) ਦੇ ਜੋਖਮ ਨੂੰ ਸੰਬੋਧ ਸਕਦੀ ਹੈ/g, "ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ $1 ਦੇ ਜੋਖਮ ਨੂੰ ਘਟਾ ਸਕਦਾ ਹੈ")
    .replace(/(ਸਟੈਪ-ਅੱਪ ਪਰਮਾਣਕਰਨ[^।.!?]*?)ਘੱਟ ਕਰ ਸਕਦੀ ਹੈ/g, "$1ਘੱਟ ਕਰ ਸਕਦਾ ਹੈ")
    .replace(/([^।.!?]{1,140}?) ਦੀ ਜ਼ਿਆਦਾਤਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ ਹੈ ਜਾਂ ਉਸਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ/g, "$1 ਦੇ ਜ਼ਿਆਦਾਤਰ ਮਾਮਲੇ ਧੋਖਾਧੜੀ ਦੇ ਹੁੰਦੇ ਹਨ");
}

function polishStatement(value: string, language: Language): string {
  if (language !== "pa") return value;
  return value.replace(
    /ਸਾਰੇ\s+(.+?ਸੈਸ਼ਨ(?:ਾਂ)?)\s+ਦੀ\s+ਥਾਂ\s+(.+?)\s+ਕਰ\s+ਦੇਣੇ\s+ਚਾਹੀਦੇ\s+ਹਨ/g,
    "ਸਾਰੇ $1 ਨੂੰ $2 ਨਾਲ ਬਦਲ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ",
  );
}

function polishArgument(value: string, language: Language): string {
  if (language === "hi") return polishHindi(value);
  if (language === "pa") return polishPunjabi(value);
  return polishEnglish(value);
}

function stemFor(statement: string, language: Language, argumentsList: readonly string[]): string {
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${statement}\nArguments:\n${rendered}`;
}

function finalizeAndHumanAudit(question: Question): Question {
  const finalized = finalizeArgCp015EditorialQuality(question);
  const preRepaired = preRepairArgCp015HumanAuditSurface(finalized);
  return polishArgCp015HumanAuditSurface(preRepaired);
}

export function polishArgCp015AntiGamingGrammar(question: Question): Question {
  if (question.antiGamingCueDebiasAuthority !== ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY) {
    return finalizeAndHumanAudit(question);
  }
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length < 2) return finalizeAndHumanAudit(question);
  const language = languageOf(question);
  const nextStatement = polishStatement(text(question.statement), language);
  const nextArguments = argumentsList.map((argument) => polishArgument(argument, language));
  if (nextStatement === text(question.statement) && nextArguments.every((argument, index) => argument === argumentsList[index])) {
    return finalizeAndHumanAudit(question);
  }

  const frozenArguments = Object.freeze(nextArguments);
  const stem = stemFor(nextStatement, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    nextStatement,
    frozenArguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");

  const polished = Object.freeze({
    ...question,
    statement: nextStatement,
    arguments: frozenArguments,
    stem,
    text: stem,
    antiGamingGrammarPolishAuthority: ARG_CP015_ANTI_GAMING_GRAMMAR_POLISH_AUTHORITY,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:GRAMMAR-POLISH`,
  });
  return finalizeAndHumanAudit(polished);
}
