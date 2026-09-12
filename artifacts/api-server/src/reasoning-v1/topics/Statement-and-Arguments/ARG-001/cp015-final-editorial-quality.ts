import { createHash } from "node:crypto";

export const ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY = "ARG_CP015_FINAL_EDITORIAL_QUALITY_V8" as const;

type Question = Readonly<Record<string, any>>;
type Language = "en" | "hi" | "pa";
type Strength = "STRONG" | "WEAK";

const ROMAN = ["I", "II", "III", "IV"] as const;

const BOILERPLATE_EN = new Set([
  "It draws a broad conclusion without enough evidence and does not examine the relevant limits, alternatives or safeguards.",
  "It treats a risk signal or limited experience as sufficient proof and underweights evidence, recovery and proportionate safeguards.",
  "The technology or delivery format alone does not establish better outcomes, fairness or necessity in the stated context.",
  "It treats an implementation assumption as decisive without considering assisted access, fallback routes or actual capacity.",
  "It relies on an unsupported stereotype about people instead of a material service or policy reason.",
  "The stated conclusion goes beyond the mechanism or evidence given in this particular argument.",
]);

const BOILERPLATE_HI = new Set([
  "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।",
  "यह तर्क जोखिम-संकेत या सीमित अनुभव को पर्याप्त प्रमाण मानकर साक्ष्य और अनुपातिक सुरक्षा की जरूरत को कम आँकता है।",
  "केवल तकनीक या माध्यम का आधुनिक अथवा डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।",
  "यह सहायता, वैकल्पिक पहुँच या वास्तविक क्षमता पर विचार किए बिना एक कार्यान्वयन धारणा को निर्णायक मान लेता है।",
  "यह वास्तविक सेवा या नीति-कारण की जगह लोगों के बारे में असिद्ध रूढ़ धारणा पर निर्भर है।",
  "इस तर्क का निष्कर्ष दिए गए कारण या तंत्र से अधिक व्यापक है और उसी संदर्भ में पर्याप्त रूप से समर्थित नहीं है।",
]);

const BOILERPLATE_PA = new Set([
  "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।",
  "ਇਹ ਦਲੀਲ ਜੋਖਮ-ਸੰਕੇਤ ਜਾਂ ਸੀਮਿਤ ਤਜਰਬੇ ਨੂੰ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨ ਕੇ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਘੱਟ ਅੰਕਦੀ ਹੈ।",
  "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
  "ਇਹ ਸਹਾਇਤਾ, ਵਿਕਲਪੀ ਪਹੁੰਚ ਜਾਂ ਅਸਲ ਸਮਰੱਥਾ ਵੇਖੇ ਬਿਨਾਂ ਇੱਕ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਧਾਰਨਾ ਨੂੰ ਫੈਸਲਾਕੁੰਨ ਮੰਨ ਲੈਂਦੀ ਹੈ।",
  "ਇਹ ਅਸਲ ਸੇਵਾ ਜਾਂ ਨੀਤੀ-ਕਾਰਨ ਦੀ ਥਾਂ ਲੋਕਾਂ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਉੱਤੇ ਨਿਰਭਰ ਹੈ।",
  "ਇਹ ਦਲੀਲ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸੰਬੰਧਿਤ ਸ਼ਰਤਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਤੋਲਣ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।",
  "ਇਸ ਦਲੀਲ ਦਾ ਨਤੀਜਾ ਦਿੱਤੇ ਕਾਰਨ ਜਾਂ ਤਰੀਕੇ ਨਾਲੋਂ ਵੱਧ ਵਿਆਪਕ ਹੈ ਅਤੇ ਇਸੇ ਸੰਦਰਭ ਵਿੱਚ ਕਾਫ਼ੀ ਤੌਰ 'ਤੇ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।",
]);

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
    .replace(/\btrained invigilators is available\b/gi, "trained invigilators are available")
    .replace(/\bsecure devices and centres is available\b/gi, "secure devices and examination-centre capacity are available")
    .replace(/\bThe decision itself is assumed to make enough (.+?) available everywhere (.+?)\./gi, "Approving the switch will automatically make sufficient $1 available everywhere $2.")
    .replace(/\bDigital examination centres are treated as inherently insecure even where stable connectivity is available\./gi, "Digital examination centres cannot be secure even when stable connectivity is available.")
    .replace(/\bDigital examination centres are treated as inherently insecure even where secure devices and examination-centre capacity are available\./gi, "Digital examination centres cannot be secure even when secure devices and examination-centre capacity are available.")
    .replace(/\bTablet-based testing centres are treated as inherently insecure even where trained invigilators are available\./gi, "Tablet-based testing centres cannot be secure even when trained invigilators are available.")
    .replace(/\bAny use of time slots is treated as making (.+?) unworkable in the long term\./gi, "Using time slots would make $1 unworkable in the long term.")
    .replace(/\bA time-slot system is treated as making public services inaccessible to a large share of users\./gi, "A time-slot system would make public services inaccessible to a large share of users.")
    .replace(/\b(digital examination centres) is treated\b/gi, "$1 are treated")
    .replace(/\b(tablet-based testing centres) is treated\b/gi, "$1 are treated")
    .replace(/\b(An? [^.]+?) is generally proof of fraud, so there is no need for (.+?) even if (.+?)\./gi, "$1 is treated as sufficient evidence of fraud on its own, so $2 is considered unnecessary even if $3.")
    .replace(/\bmost form of\b/gi, "most forms of")
    .replace(/\bthe entire an entrance examination\b/gi, "the entire entrance examination")
    .replace(/\bthe entire a departmental test\b/gi, "the entire departmental test")
    .replace(/\bmost candidate and centre\b/gi, "most candidates and centres")
    .replace(/\ba automatically renewed plan\b/gi, "an automatically renewed plan");
}

function repairHindi(value: string): string {
  return value
    .replace(/अधिकांश प्रकार का ([^।,.]+?) संभालने संभाल/gi, "$1 के अधिकांश प्रकार संभाल")
    .replace(/अधिकांश उम्मीदवार और केंद्र प्रभावित था/g, "अधिकांश उम्मीदवार और केंद्र प्रभावित थे");
}

function repairPunjabi(value: string): string {
  return value
    .replace(/ਸਾਰੇ ਮਾਰਗਦਰਸ਼ਿਤ ਵਰਕਸ਼ਾਪਾਂ/g, "ਸਾਰੀਆਂ ਮਾਰਗਦਰਸ਼ਿਤ ਵਰਕਸ਼ਾਪਾਂ")
    .replace(/ਬੈਕਅੱਪ ਸੰਭਾਲ ਦੇ ਬਿਨਾਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦੇ? ([^।,.]+?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਬੈਕਅੱਪ ਸਹਾਇਤਾ ਤੋਂ ਬਿਨਾਂ ਵੀ $1 ਦੀਆਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮਾਂ ਨੂੰ ਸੰਭਾਲ ਸਕਦੇ ਹਨ")
    .replace(/ਖਾਸ ਕੇਸਾਂ ਦੀ ਸਹਾਇਤਾ ਦੇ ਬਿਨਾਂ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦਾ ਅਪਵਾਦ ਸੰਭਾਲਣ ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਖਾਸ ਕੇਸਾਂ ਲਈ ਸਹਾਇਤਾ ਤੋਂ ਬਿਨਾਂ ਵੀ ਜ਼ਿਆਦਾਤਰ ਕਿਸਮ ਦੇ ਅਪਵਾਦ ਸੰਭਾਲ ਸਕਦੇ ਹਨ")
    .replace(/ਕੋਈ ਲਾਭਦਾਇਕ ਸੇਵਾ ਬਹੁਤ ਘੱਟ ਦੇ ਸਕਦੀ/g, "ਲਗਭਗ ਕੋਈ ਲਾਭਦਾਇਕ ਸੇਵਾ ਨਹੀਂ ਦੇ ਸਕਦੀ")
    .replace(/ਵਿਭਾਗੀ ਟੈਸਟ ਦਾ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਵਿਭਾਗੀ ਟੈਸਟ ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ")
    .replace(/ਸੁਤੰਤਰ ਜਾਂਚ ਇਕੱਲੇ ਸਮਝੌਤੇ ਵਾਲੀ ਹਮਲਾ-ਕੜੀ ਤੋੜਦੀ ਹੈ/g, "ਸੁਤੰਤਰ ਜਾਂਚ ਨਾਲ ਕੇਵਲ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵੇ ਬਦਲਾਅ ਲਈ ਕਾਫ਼ੀ ਨਹੀਂ ਰਹਿੰਦੇ")
    .replace(/ਇਹ ਨਿਯੰਤਰਣ ਦੀ ਅਸਲੀ ਡਿਜ਼ਾਇਨ-ਸ਼ਰਤ ਹੈ/g, "ਇਹ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ ਦੀ ਅਸਲੀ ਲੋੜ ਹੈ")
    .replace(/ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "ਹਾਸਲ ਕਰਨ ਦੀ ਆਪਣੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਗੁਆ ਸਕਦੇ ਹਨ")
    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਵਿੱਚ ਫੇਲ ਹੋਇਆ ਸੀ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰੀ ਨਹੀਂ ਕਰ ਸਕਿਆ ਸੀ")
    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਇਹ ਰੋਕ ਸਕਦਾ ਹੈ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਇਹ ਰੋਕ ਸਕਦੀ ਹੈ")
    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰਾ ਕਰਨਾ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਦੇਣੀ")
    .replace(/ਲੋਕਾਂ ਅਕਸਰ/g, "ਲੋਕ ਅਕਸਰ")
    .replace(/ਅਰਜ਼ੀਕਾਰਾਂ ਅਕਸਰ/g, "ਅਰਜ਼ੀਕਾਰ ਅਕਸਰ")
    .replace(/ਨਾਗਰਿਕਾਂ ਅਕਸਰ/g, "ਨਾਗਰਿਕ ਅਕਸਰ")
    .replace(/ਵਰਤੋਂਕਾਰਾਂ ਅਕਸਰ/g, "ਵਰਤੋਂਕਾਰ ਅਕਸਰ")
    .replace(/ਅਕਸਰ ਲਈ ਖਤਮ/g, "ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ");
}

function repairSurface(value: string, language: Language): string {
  if (language === "hi") return repairHindi(value);
  if (language === "pa") return repairPunjabi(value);
  return repairEnglish(value);
}

function normalizedArgument(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function duplicateWeakRewrite(language: Language): string {
  if (language === "hi") {
    return "हाँ। कथन में बताया गया एक ही सुरक्षा उपाय अपने-आप पर्याप्त है, इसलिए प्रस्तावित बदलाव के लिए किसी अतिरिक्त सुरक्षा की आवश्यकता नहीं होगी।";
  }
  if (language === "pa") {
    return "ਹਾਂ। ਕਥਨ ਵਿੱਚ ਦੱਸਿਆ ਇਕੋ ਸੁਰੱਖਿਆ ਕਦਮ ਆਪਣੇ ਆਪ ਕਾਫ਼ੀ ਹੈ, ਇਸ ਲਈ ਪ੍ਰਸਤਾਵਿਤ ਬਦਲਾਅ ਲਈ ਕਿਸੇ ਹੋਰ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਨਹੀਂ ਰਹੇਗੀ।";
  }
  return "Yes. The single safeguard described in the statement should be treated as sufficient on its own, so no additional protection would be needed for the proposed change.";
}

function dedupeWeakArguments(
  language: Language,
  argumentsList: readonly string[],
  strengths: readonly Strength[] | undefined,
): { arguments: readonly string[]; rewritten: ReadonlySet<number> } {
  const next = [...argumentsList];
  const rewritten = new Set<number>();
  const seen = new Map<string, number>();

  for (let index = 0; index < next.length; index += 1) {
    const key = normalizedArgument(next[index]!);
    if (!seen.has(key)) {
      seen.set(key, index);
      continue;
    }
    if (strengths?.[index] !== "WEAK") continue;
    next[index] = duplicateWeakRewrite(language);
    rewritten.add(index);
  }

  return { arguments: Object.freeze(next), rewritten };
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

function englishFallback(argument: string): string {
  const claim = argument.replace(/^(?:Yes|No)\.\s*/i, "").replace(/[.!?]+$/, "");
  return `The argument assumes that ${claim.charAt(0).toLowerCase()}${claim.slice(1)}; it does not provide enough support for that conclusion in the stated context.`;
}

function hindiFallback(argument: string): string {
  const claim = argument.replace(/^(?:हाँ|नहीं)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  return `यह तर्क मान लेता है कि ${claim}; दिए गए संदर्भ में इस निष्कर्ष के लिए पर्याप्त आधार नहीं दिया गया है।`;
}

function punjabiFallback(argument: string): string {
  const claim = argument.replace(/^(?:ਹਾਂ|ਨਹੀਂ)[।.]?\s*/u, "").replace(/[।.!?]+$/, "");
  return `ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ ${claim}; ਦਿੱਤੇ ਸੰਦਰਭ ਵਿੱਚ ਇਸ ਨਤੀਜੇ ਲਈ ਕਾਫ਼ੀ ਆਧਾਰ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।`;
}

function specificEnglishReason(argument: string): string {
  if (/prefer a form|final after the first submission/i.test(argument)) return "A preference for an irreversible first submission does not address whether a limited correction window improves procedural fairness before the stated deadline.";
  if (/process is complete|little practical value/i.test(argument)) return "Completion of a process does not make relevant post-process information valueless to users seeking transparency, verification or clarification.";
  if (/workshop|orientation/i.test(argument) && /misunderstanding|misconduct rules|related difficulties/i.test(argument)) return "One workshop or orientation can help with the stated issue, but it cannot reasonably be expected to remove nearly every misunderstanding or future difficulty on its own.";
  if (/passwords? at ten-day intervals|portal passwords/i.test(argument) && /insecure credential storage|weakening password security|weaken password security/i.test(argument)) return "Frequent password rotation may affect user behaviour, but the argument does not establish that it will generally cause insecure storage or make the overall password policy less secure.";
  if (/passwords? at ten-day intervals|portal passwords/i.test(argument) && /phishing/i.test(argument)) return "Password rotation does not make phishing irrelevant; the argument dismisses a separate attack path without evidence that the rotation policy neutralises it.";
  if (/One user once failed|One customer once failed|Since one user could not pass|Because one user failed|Because one customer failed verification|single failed verification/i.test(argument)) return "A single failed verification attempt does not show that the control is generally unusable for legitimate changes.";
  if (/social-engineering fraud case occurred despite alerts|alerts? .*treated as ineffective|alerts? .*will not materially reduce/i.test(argument)) return "One fraud incident despite an alert does not show that alerts lack early-warning value in other unauthorised-change cases.";
  if (/dispense with further fraud safeguards|further fraud safeguards should be treated as unnecessary|further fraud .*negligible|almost no further fraud|no additional protection would be needed/i.test(argument)) return "A second verification step can reduce one attack path, but it does not remove the need for other fraud controls, recovery routes and monitoring.";
  if (/(?:complaint|report|flag|allegation).*(?:proof|guilt|certain|conclusive|misconduct|sufficient evidence)|(?:proof|guilt|certain|conclusive|sufficient evidence).*(?:complaint|report|flag|allegation)/i.test(argument)) return "A complaint, report, flag or allegation is a signal to investigate, not conclusive proof of guilt by itself.";
  if (/later complaints|future complaints|little basis for acting|disregard all later/i.test(argument)) return "Rejecting an immediate irreversible penalty does not require later complaints to be ignored; the argument creates a false choice between permanent punishment and inaction.";
  if (/modern (?:technology|monitoring tool)|modern tool|presumed fair without a separate necessity test/i.test(argument)) return "Calling a monitoring method modern does not establish that its use is necessary, proportionate or fair in this particular workplace context.";
  if (/digital|recorded video|automated tutorial/i.test(argument) && /better|superior|presumed/i.test(argument)) return "The delivery format alone does not show that the proposed digital method will produce better learning than the existing alternative.";
  if (/(?:self-service kiosk|automated service terminal|touch-screen banking kiosk)/i.test(argument) && /handle most|no implementation risk|full replacement/i.test(argument)) return "The argument assumes automated service can handle almost every case without fallback and that an immediate full replacement carries no rollout risk; neither claim is established.";
  if (/(?:self-service kiosk|automated service terminal|touch-screen banking kiosk)/i.test(argument) && /no useful service|provide no useful service|will provide no useful service|unlikely to function|almost no useful service/i.test(argument)) return "Limitations of automated service do not show that it becomes useless when fallback or assisted handling remains available.";
  if (/presumed to lead to unauthorised recording|will lead to unauthorised recording|even an exception such as approved learning/i.test(argument)) return "A risk of unauthorised recording can justify targeted restrictions, but it does not establish that every legitimate exception should be rejected.";
  if (/useful for approved learning|avoid regulating it even where (?:regulation|the rule) is aimed/i.test(argument)) return "Legitimate educational uses do not show that recording devices should escape proportionate rules aimed at unauthorised recording.";
  if (/must either ignore later .* complaints or permanently stop conducting/i.test(argument)) return "The argument creates a false dilemma: the authority can investigate later complaints without either ignoring them or abandoning the examination entirely.";
  if (/single .* complaint.*entire .* affected|complete re-examination without verifying evidence and scope/i.test(argument)) return "One complaint does not establish that the whole examination was affected; the scope should be verified before ordering a complete re-examination.";
  if (/desktop computer|own an expensive desktop/i.test(argument)) return "The proposal does not inherently require each user to own the assumed device, so the claimed access barrier is not established.";
  if (/rebuilding|extensive rebuilding/i.test(argument)) return "The argument assumes the proposed queue-management measure requires extensive rebuilding, but no such implementation dependency is established.";
  if (/cannot be secure even when/i.test(argument)) return "The argument declares the digital examination setup insecure despite the named safeguards or infrastructure, but gives no reason why those measures cannot materially reduce the risk.";
  if (/approving the switch will automatically make sufficient/i.test(argument)) return "Approving the switch cannot itself create the required staffing, connectivity, devices or centre capacity by the stated deadline; readiness requires separate planning and evidence.";
  if (/using time slots would make .* unworkable in the long term/i.test(argument)) return "A scheduling system can create access or rollout problems, but that does not show the underlying service becomes unworkable in the long term.";
  if (/once time slots are introduced, .* (?:is|are) unlikely to function successfully again/i.test(argument)) return "Introducing time slots may create access or implementation problems, but that does not show the underlying service will generally stop functioning successfully.";
  if (/time-slot system would make public services inaccessible to a large share of users/i.test(argument)) return "A time-slot system may need walk-in or assisted alternatives, but the argument gives no basis for claiming that the system itself would exclude a large share of users.";
  if (/without transition support|without resident or user communication/i.test(argument)) return "The argument assumes the new rule will work immediately without communication or transition support, which is an unproved implementation assumption.";
  if (/single result is treated as enough reason to keep heavy vehicles barred|limited restriction.*helps even once.*remain barred/i.test(argument)) return "A benefit during the targeted period does not justify extending the restriction beyond that period into a broader ban.";
  if (/lasting damage to activity throughout the surrounding area/i.test(argument)) return "A short peak-period restriction does not by itself establish lasting damage throughout the surrounding area; the claimed scale and duration of harm are unsupported.";
  if (/should be rejected even where consent, purpose and safeguards/i.test(argument)) return "Rejecting disclosure regardless of consent, purpose and safeguards ignores the conditions that determine whether the privacy intrusion is justified.";
  if (/perfect future rule compliance|eliminate nearly all future lateness/i.test(argument)) return "Publishing names may influence behaviour, but it does not establish perfect compliance or the disappearance of nearly all future lateness.";
  if (/lasting gridlock across the city/i.test(argument)) return "The argument predicts lasting city-wide gridlock from a limited corridor restriction despite the stated alternatives, without evidence for that network-wide effect.";
  if (/probably trying to avoid oversight|usually careless|only seeking convenience/i.test(argument)) return "The argument substitutes a stereotype about the people affected for evidence about whether the proposed policy is justified.";
  if (/solve the queue problem on its own/i.test(argument)) return "Longer opening hours may reduce queues, but they cannot solve the whole queue problem by themselves; demand and service capacity still matter.";
  if (/guided rules session/i.test(argument) && /largely eliminated/i.test(argument)) return "A guided rules session can reduce confusion, but attendance alone does not show that unauthorised collaboration will be largely eliminated.";
  if (/nobody will ever choose an? automatically renewed plan/i.test(argument)) return "A reminder may influence some users, but it does not show that nobody would choose to continue the plan; informed choice can still be a legitimate objective.";
  if (/(?:rules session|guided rules session|briefing)/i.test(argument) && /(?:misunderstanding|violations|misconduct rules)/i.test(argument)) return "One rules session may reduce confusion, but it cannot be assumed to remove nearly all misunderstanding or rule violations by itself.";
  if (/card transactions outside the home state/i.test(argument) && /(?:most instances|treated as fraudulent)/i.test(argument)) return "Transactions outside a customer's home state can be legitimate travel or emergency payments, so treating most of them as fraudulent does not justify mandatory pre-authorisation for every case.";
  if (/temporary restriction on heavy vehicles/i.test(argument) && /most nearby business(?:es)? permanently/i.test(argument)) return "A temporary traffic restriction may inconvenience some businesses, but it does not show that most nearby businesses will permanently close.";
  if (/existing traffic pattern has been in place for years/i.test(argument) && /changing it would readily be unfair/i.test(argument)) return "A long-standing traffic pattern is not automatically fair or untouchable; the argument gives no reason why a limited change would itself be unfair.";
  if (/first-time overseas card use/i.test(argument) && /(?:most instances|treated as fraudulent)/i.test(argument)) return "First-time overseas card use can be legitimate travel or emergency spending, so treating most such transactions as fraud does not justify automatic blocking in every case.";
  return englishFallback(argument);
}

function specificHindiReason(argument: string): string {
  if (/रिकॉर्ड|वेबिनार|डिजिटल|ट्यूटोरियल/.test(argument) && /सीखने|बेहतर|परिणाम/.test(argument)) return "डिजिटल या रिकॉर्डेड माध्यम होना अपने-आप बेहतर सीखने के परिणाम सिद्ध नहीं करता, और उससे मार्गदर्शित सहायता की पूरी उपयोगिता समाप्त भी नहीं हो जाती।";
  if (/एक ग्राहक|एक उपयोगकर्ता/.test(argument) && /सत्यापन|वेरिफिकेशन/.test(argument)) return "एक व्यक्ति का सत्यापन में विफल होना यह सिद्ध नहीं करता कि वैध उपयोगकर्ताओं के लिए यह नियंत्रण सामान्यतः अनुपयोगी है।";
  if (/कतार/.test(argument) && /(?:पर्याप्त|काफ़ी|इसी उपाय)/.test(argument)) return "अधिक देर तक काउंटर खुला रखने से कतार कम हो सकती है, लेकिन केवल इसी उपाय को पर्याप्त मान लेना उचित नहीं है; मांग और सेवा-क्षमता भी महत्वपूर्ण हैं।";
  if (/धोखाधड़ी|शिकायत|आरोप|संकेत|फ्लैग/.test(argument) && /प्रमाण|दोष|पर्याप्त/.test(argument)) return "शिकायत, संकेत या फ्लैग जाँच शुरू करने का आधार हो सकता है, लेकिन वह अपने-आप दोष का निर्णायक प्रमाण नहीं है।";
  if (/अतिरिक्त धोखाधड़ी सुरक्षा|अन्य सुरक्षा|सुरक्षा की जरूरत/.test(argument)) return "एक अतिरिक्त सत्यापन कदम जोखिम घटा सकता है, लेकिन उससे अन्य धोखाधड़ी नियंत्रण, रिकवरी और निगरानी अनावश्यक नहीं हो जाते।";
  if (/पासवर्ड|फ़िशिंग|फिशिंग/.test(argument)) return "यह तर्क पासवर्ड नीति के एक प्रभाव को बिना पर्याप्त आधार के निर्णायक मानता है और अलग सुरक्षा जोखिमों को उचित रूप से नहीं तौलता।";
  if (/(?:एक|एक ही) (?:कार्यशाला|सत्र|अभिमुखीकरण|ओरिएंटेशन)/.test(argument) && /भ्रम|गलतफहमी|कठिनाई|सहायता|अनावश्यक/.test(argument)) return "एक सत्र कुछ भ्रम कम कर सकता है, लेकिन उससे लगभग सारी गलतफहमी या भविष्य की सहायता की जरूरत समाप्त हो जाएगी, यह निष्कर्ष समर्थित नहीं है।";
  if (/टैबलेट|डिजिटल परीक्षा|परीक्षा केंद्र|प्रशिक्षित निरीक्षक|इनविजिलेटर/.test(argument)) return "परीक्षा का डिजिटल प्रारूप या केवल घोषणा अपने-आप सुरक्षा और पर्याप्त प्रशिक्षित स्टाफ की उपलब्धता सिद्ध नहीं करती; दोनों के लिए अलग व्यवस्था और साक्ष्य चाहिए।";
  if (/नाम|विभाग|नोटिस बोर्ड|गोपनीयता/.test(argument)) return "नाम सार्वजनिक करने के प्रभाव का आकलन सहमति, उद्देश्य, अनुपातिकता और सुरक्षा उपायों जैसी शर्तों के आधार पर होना चाहिए; इन्हें अनदेखा करके व्यापक निष्कर्ष उचित नहीं है।";
  if (/कियोस्क|स्वचालित सेवा टर्मिनल/.test(argument) && /बिना|कार्यान्वयन जोखिम|लाभदायक सेवा/.test(argument)) return "यह तर्क स्वचालित सेवा की क्षमता या सीमा को अतिरंजित करता है और उपलब्ध बैकअप तथा क्रमिक कार्यान्वयन की भूमिका को पर्याप्त रूप से नहीं तौलता।";
  if (/समय-स्लॉट|कतार|पुनर्निर्माण/.test(argument)) return "यह तर्क प्रस्तावित व्यवस्था के लिए एक बड़े कार्यान्वयन अवरोध को बिना प्रमाण मान लेता है और कम-कठोर विकल्पों पर विचार नहीं करता।";
  if (/आधुनिक|तकनीक/.test(argument)) return "किसी तकनीक का आधुनिक होना अपने-आप बेहतर परिणाम, आवश्यकता या निष्पक्षता सिद्ध नहीं करता।";
  if (/या .* शिकायत.*बंद|पूरी पुनः-परीक्षा|पूरी पुन:परीक्षा/.test(argument)) return "यह तर्क शिकायत के जवाब में उपलब्ध जाँच और सीमित कार्रवाई के विकल्पों को छोड़कर या तो झूठा द्वंद्व बनाता है या एक शिकायत से पूरे प्रभाव का निष्कर्ष निकालता है।";
  if (/लापरवाह/.test(argument)) return "सेवा माँगने वाले लोगों को लापरवाह मानना उनकी वास्तविक जरूरत का प्रमाण नहीं है; समय तय करते समय सेवा-आवश्यकता को ही देखना चाहिए।";
  if (/(?:हेल्पलाइन|मदद नंबर|संपर्क)/.test(argument) && /(?:पर्याप्त|इसी संपर्क)/.test(argument)) return "हेल्पलाइन उपयोगी हो सकती है, लेकिन केवल एक संपर्क हर सेवा-संबंधी समस्या हल कर देगा, यह मानना उचित नहीं है।";
  if (/(?:सत्र|ओरिएंटेशन|ब्रीफिंग)/.test(argument) && /(?:समाप्त|खत्म|काफी हद तक)/.test(argument)) return "एक सत्र कुछ भ्रम कम कर सकता है, लेकिन उससे लगभग सारी गलतफहमी या नियम-उल्लंघन समाप्त हो जाएँगे, यह निष्कर्ष उचित नहीं है।";
  if (/(?:वेबिनार|वीडियो मॉड्यूल)/.test(argument) && /(?:सारी क्षमता|खो देंगे|सारी उपयोगिता)/.test(argument)) return "रिकॉर्डेड सामग्री में कुछ सीमाएँ हो सकती हैं, लेकिन उससे सीखने या प्रक्रियाएँ समझने की सारी क्षमता समाप्त नहीं हो जाती।";
  if (/सत्यापन की एक असफल घटना|वेरिफिकेशन की एक असफल घटना/.test(argument)) return "सत्यापन की एक असफल घटना यह सिद्ध नहीं करती कि वैध उपयोगकर्ताओं के अधिकांश बदलाव भी विफल होंगे।";
  if (/डेस्कटॉप/.test(argument)) return "समय-स्लॉट या अपॉइंटमेंट के लिए हर आगंतुक का अपना महँगा कंप्यूटर होना जरूरी नहीं है; सहायता या अन्य बुकिंग विकल्प रखे जा सकते हैं।";
  if (/(?:कियोस्क|टर्मिनल)/.test(argument) && /(?:उपयोगी सेवा|कार्यान्वयन जोखिम|संभाल सकता|संभाल सकता है)/.test(argument)) return "स्वचालित सेवा की क्षमता सीमित हो सकती है, लेकिन बैकअप सहायता और चरणबद्ध बदलाव के साथ उसे पूरी तरह उपयोगहीन या जोखिम-मुक्त मानना दोनों गलत हैं।";
  if (/बिना किसी स्टाफ प्रशिक्षण|सीधे काम करेगा/.test(argument)) return "नई व्यवस्था के लिए प्रशिक्षण और संचालन की तैयारी जरूरी हो सकती है; केवल घोषणा से वह अपने-आप ठीक नहीं चलने लगती।";
  if (/एक ही कार्यशाला/.test(argument)) return "एक कार्यशाला कुछ मदद कर सकती है, लेकिन वह भविष्य की लगभग हर कठिनाई का अकेला समाधान नहीं बन जाती।";
  if (/भारी वाहन/.test(argument) && /(?:अधिकांश समय बंद|स्थायी रूप से खत्म|स्थायी रूप से बंद)/.test(argument)) return "सीमित समय का प्रतिबंध उपयोगी या हानिकारक हो सकता है, लेकिन उससे स्थायी प्रतिबंध या स्थायी स्थानीय नुकसान अपने-आप सिद्ध नहीं होता।";
  if (/कई वर्षों से चल रही/.test(argument) && /बदलाव/.test(argument)) return "किसी व्यवस्था का लंबे समय से चलना यह सिद्ध नहीं करता कि उसमें उचित बदलाव नहीं किया जा सकता।";
  if (/निगरानी से बचना/.test(argument)) return "निगरानी के बारे में सवाल पूछना यह सिद्ध नहीं करता कि कर्मचारी निगरानी से बचना चाहता है; यह बिना प्रमाण की धारणा है।";
  if (/अधिकांश मामले.*धोखाधड़ी|सर्वव्यापी अस्वीकार/.test(argument)) return "कुछ लेन-देन जोखिमपूर्ण हो सकते हैं, लेकिन अधिकांश मामलों को बिना जाँच धोखाधड़ी मानकर सबको रोक देना उचित नहीं है।";
  if (/स्थायी जाम|पूरे शहर/.test(argument)) return "एक सीमित मार्ग-प्रतिबंध से पूरे शहर में स्थायी जाम होगा, यह निष्कर्ष दिए गए कारणों से सिद्ध नहीं होता।";
  if (/बाद की.*शिकायत|बाद की अधिकांश शिकायत/.test(argument)) return "तुरंत स्थायी दंड न देना बाद की शिकायतों को अनदेखा करने के बराबर नहीं है; उनकी अलग से जाँच की जा सकती है।";
  if (/प्रक्रिया पूरी होते ही.*अधिकांश जानकारी.*(?:सीधे )?बेकार हो जाती है/.test(argument)) return "प्रक्रिया पूरी होने के बाद भी शिकायत, परिणाम या सुधार से जुड़ी जानकारी उपयोगी रह सकती है; केवल प्रक्रिया समाप्त हो जाने से वह जानकारी बेकार नहीं हो जाती।";
  if (/(?:स्व-गति स्लाइड मॉड्यूल|रिकॉर्ड किए वीडियो मॉड्यूल|स्वचालित ट्यूटोरियल|पूर्व-रिकॉर्ड वेबिनार)/.test(argument) && /(?:सारी क्षमता|क्षमता.*खो देंगे)/.test(argument)) return "स्व-गति या रिकॉर्डेड मॉड्यूल में लाइव मार्गदर्शन की कुछ कमी हो सकती है, लेकिन इससे कर्मचारियों की सीखने या प्रशिक्षण से लाभ लेने की सारी क्षमता खत्म नहीं हो जाती।";
  if (/कोई भी दूसरा सत्यापन कदम.*(?:भविष्य की )?(?:अधिकांश|ज्यादातर) धोखाधड़ी.*(?:अव्यावहारिक|रोक)/.test(argument)) return "अतिरिक्त सत्यापन धोखाधड़ी का जोखिम घटा सकता है, लेकिन केवल एक दूसरा सत्यापन कदम भविष्य की अधिकांश धोखाधड़ी रोक देगा, यह निष्कर्ष उचित नहीं है।";
  if (/(?:एक उपयोगकर्ता.*जाँच पूरी नहीं कर पाया|एक ग्राहक.*सत्यापन.*विफल).*(?:अधिकांश|ज्यादातर).*(?:वास्तविक|वैध).*(?:अव्यावहारिक|विफल)/.test(argument)) return "एक उपयोगकर्ता का सत्यापन पूरा न हो पाना केवल एक घटना है; इससे यह निष्कर्ष नहीं निकाला जा सकता कि अधिकांश वैध बदलाव या अनुरोध भी विफल होंगे।";
  if (/(?:अस्थायी प्रतिबंध|भारी वाहनों की थोड़ी-सी सीमा).*?(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से (?:समाप्त|खत्म|बर्बाद)|खत्म)/.test(argument)) return "अस्थायी या सीमित भारी-वाहन रोक से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधि स्थायी रूप से बर्बाद हो जाएगी, यह निष्कर्ष उचित नहीं है।";
  if (/पहली बार विदेश में कार्ड उपयोग.*(?:अधिकांश|ज्यादातर).*(?:घटना|लेन-देन|खरीद).*(?:धोखाधड़ी|फ्रॉड)/.test(argument)) return "पहली बार विदेश में कार्ड उपयोग असामान्य हो सकता है, लेकिन इससे अधिकांश ऐसी खरीद को धोखाधड़ी नहीं माना जा सकता; जोखिम-संकेत की जाँच और अनुपातिक पुष्टि अधिक उचित है।";
  if (/(?:तत्काल|तुरंत).*स्थायी दंड.*नहीं देता.*(?:भविष्य की )?(?:अधिकांश|ज्यादातर) शिकायत.*अनदेखी/.test(argument)) return "तुरंत स्थायी दंड न देना शिकायत को अनदेखा करना नहीं है; प्राधिकरण शिकायत की जाँच कर सकता है और प्रमाण के अनुसार अनुपातिक कार्रवाई कर सकता है।";
  if (/अस्थायी प्रतिबंध.*(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से समाप्त|स्थायी रूप से खत्म|खत्म)/.test(argument)) return "अस्थायी भारी-वाहन प्रतिबंध से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधियाँ स्थायी रूप से समाप्त हो जाएँगी, यह निष्कर्ष उचित नहीं है।";
  return hindiFallback(argument);
}

function specificPunjabiReason(argument: string): string {
  if (/ਰਿਕਾਰਡ|ਵੈਬਿਨਾਰ|ਡਿਜ਼ਿਟਲ|ਡਿਜਿਟਲ|ਟਿਊਟੋਰਿਅਲ/.test(argument) && /ਸਿੱਖਣ|ਬਿਹਤਰ|ਨਤੀਜੇ/.test(argument)) return "ਡਿਜ਼ਿਟਲ ਜਾਂ ਰਿਕਾਰਡ ਕੀਤਾ ਮਾਧਿਅਮ ਆਪਣੇ ਆਪ ਬਿਹਤਰ ਸਿੱਖਣ ਦੇ ਨਤੀਜੇ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ, ਅਤੇ ਇਸ ਨਾਲ ਮਾਰਗਦਰਸ਼ਿਤ ਸਹਾਇਤਾ ਦੀ ਸਾਰੀ ਉਪਯੋਗਤਾ ਵੀ ਖਤਮ ਨਹੀਂ ਹੁੰਦੀ।";
  if (/(?:ਇੱਕ|ਇਕ) (?:ਗਾਹਕ|ਵਰਤੋਂਕਾਰ)/.test(argument) && /ਤਸਦੀਕ/.test(argument)) return "ਇੱਕ ਵਿਅਕਤੀ ਦਾ ਤਸਦੀਕ ਵਿੱਚ ਅਸਫਲ ਹੋਣਾ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਵਾਜਬ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਇਹ ਨਿਯੰਤਰਣ ਆਮ ਤੌਰ 'ਤੇ ਅਣਵਰਤੋਂਯੋਗ ਹੈ।";
  if (/(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ ਨੰਬਰ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ|ਇਸੇ ਸੰਪਰਕ)/.test(argument)) return "ਸੰਪਰਕ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇਕੱਲੇ ਇਸੇ ਸੰਪਰਕ ਨੂੰ ਹਰ ਸੇਵਾ ਜਾਂ ਭੁਗਤਾਨ-ਸਬੰਧੀ ਸਮੱਸਿਆ ਦੇ ਹੱਲ ਲਈ ਕਾਫ਼ੀ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਧੋਖਾਧੜੀ|ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਦੋਸ਼|ਫਲੈਗ|ਸੰਕੇਤ/.test(argument) && /ਸਬੂਤ|ਦੋਸ਼|ਦੋਸ਼|ਕਾਫ਼ੀ/.test(argument)) return "ਸ਼ਿਕਾਇਤ, ਫਲੈਗ ਜਾਂ ਹੋਰ ਸੰਕੇਤ ਜਾਂਚ ਦਾ ਆਧਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਉਹ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਫੈਸਲਾਕੁੰਨ ਸਬੂਤ ਨਹੀਂ ਹੈ।";
  if (/ਹੋਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ|ਵਾਧੂ ਸੁਰੱਖਿਆ|ਹੋਰ ਸੁਰੱਖਿਆ/.test(argument)) return "ਇੱਕ ਵਾਧੂ ਤਸਦੀਕ ਕਦਮ ਜੋਖਮ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਹੋਰ ਧੋਖਾਧੜੀ ਨਿਯੰਤਰਣ, ਰਿਕਵਰੀ ਅਤੇ ਨਿਗਰਾਨੀ ਬੇਲੋੜੇ ਨਹੀਂ ਹੋ ਜਾਂਦੇ।";
  if (/ਪਾਸਵਰਡ|ਫਿਸ਼ਿੰਗ|ਫਿਸ਼ਿੰਗ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪਾਸਵਰਡ ਨੀਤੀ ਦੇ ਇੱਕ ਪ੍ਰਭਾਵ ਨੂੰ ਬਿਨਾਂ ਕਾਫ਼ੀ ਆਧਾਰ ਦੇ ਫੈਸਲਾਕੁੰਨ ਮੰਨਦੀ ਹੈ ਅਤੇ ਵੱਖਰੇ ਸੁਰੱਖਿਆ ਜੋਖਮਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਨਹੀਂ ਤੋਲਦੀ।";
  if (/(?:ਇੱਕੋ|ਇੱਕ|ਇਕ) (?:ਵਰਕਸ਼ਾਪ|ਵਰਕਸ਼ਾਪ|ਸੈਸ਼ਨ|ਸੈਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ)/.test(argument) && /ਗਲਤਫਹਮੀ|ਮੁਸ਼ਕਲ|ਮੁਸ਼ਕਲ|ਸਹਾਇਤਾ|ਬੇਲੋੜੀ/.test(argument)) return "ਇੱਕ ਸੈਸ਼ਨ ਕੁਝ ਭੁੱਲ-ਭੁਲੇਖਾ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਲਗਭਗ ਸਾਰੀ ਗਲਤਫਹਮੀ ਜਾਂ ਭਵਿੱਖ ਦੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।";
  if (/(?:ਟੈਬਲੈਟ|ਡਿਜ਼ਿਟਲ|ਡਿਜਿਟਲ).*(?:ਪ੍ਰੀਖਿਆ|ਟੈਸਟ)|(?:ਪ੍ਰੀਖਿਆ|ਟੈਸਟ).*(?:ਨਿਗਰਾਨ|ਤਰਬੀਅਤ)/.test(argument)) return "ਪ੍ਰੀਖਿਆ ਦਾ ਡਿਜ਼ਿਟਲ ਫਾਰਮੈਟ ਜਾਂ ਕੇਵਲ ਐਲਾਨ ਆਪਣੇ ਆਪ ਸੁਰੱਖਿਆ ਅਤੇ ਕਾਫ਼ੀ ਤਰਬੀਅਤਯਾਫ਼ਤਾ ਸਟਾਫ ਦੀ ਉਪਲਬਧਤਾ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ; ਦੋਵਾਂ ਲਈ ਵੱਖਰੀ ਯੋਜਨਾ ਅਤੇ ਸਬੂਤ ਚਾਹੀਦੇ ਹਨ।";
  if (/ਨਾਮ|ਨੋਟਿਸ ਬੋਰਡ|ਪਰਦੇਦਾਰੀ|ਵਿਭਾਗ ਦੀ ਸੂਚੀ/.test(argument)) return "ਨਾਂ ਜਨਤਕ ਕਰਨ ਦੇ ਪ੍ਰਭਾਵ ਨੂੰ ਸਹਿਮਤੀ, ਮਕਸਦ, ਅਨੁਪਾਤਿਕਤਾ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸ਼ਰਤਾਂ ਨਾਲ ਤੋਲਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਨ੍ਹਾਂ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਕੇ ਵਿਆਪਕ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਕਿਓਸਕ|ਟਰਮੀਨਲ)/.test(argument) && /ਸੰਭਾਲ ਸਕਦੇ|ਕਾਰਜਾਨਵੈਨ ਜੋਖਮ/.test(argument)) return "ਇਹ ਦਲੀਲ ਮੰਨਦੀ ਹੈ ਕਿ ਆਟੋਮੈਟਿਕ ਪ੍ਰਣਾਲੀ ਲਗਭਗ ਹਰ ਕੇਸ ਬਿਨਾਂ ਬੈਕਅੱਪ ਦੇ ਸੰਭਾਲ ਲਵੇਗੀ ਅਤੇ ਤੁਰੰਤ ਪੂਰਾ ਬਦਲਾਅ ਬਿਨਾਂ ਜੋਖਮ ਦੇ ਹੋਵੇਗਾ; ਦੋਵੇਂ ਦਾਅਵੇ ਅਸਮਰਥਿਤ ਹਨ।";
  if (/(?:ਕਿਓਸਕ|ਟਰਮੀਨਲ)/.test(argument) && /ਲਾਭਦਾਇਕ ਸੇਵਾ|ਨਹੀਂ ਦੇ ਸਕਦੀ/.test(argument)) return "ਆਟੋਮੈਟਿਕ ਸੇਵਾ ਦੀਆਂ ਸੀਮਾਵਾਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀਆਂ ਕਿ ਬੈਕਅੱਪ ਜਾਂ ਸਹਾਇਤਾ ਉਪਲਬਧ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਇਹ ਲਗਭਗ ਕੋਈ ਲਾਭਦਾਇਕ ਸੇਵਾ ਨਹੀਂ ਦੇ ਸਕਦੀ।";
  if (/ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣਾ|ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣ/.test(argument)) return "ਕਿਸੇ ਕਰਮਚਾਰੀ ਵੱਲੋਂ ਨਿਗਰਾਨੀ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛਣਾ ਆਪਣੇ ਆਪ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਉਹ ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹੈ; ਇਹ ਵਿਅਕਤੀ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਹੈ।";
  if (/ਸਮਾਂ-ਸਲਾਟ|ਕਤਾਰ|ਮੁੜ-ਨਿਰਮਾਣ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰਬੰਧ ਲਈ ਇੱਕ ਵੱਡੀ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਰੁਕਾਵਟ ਨੂੰ ਬਿਨਾਂ ਸਬੂਤ ਮੰਨਦੀ ਹੈ ਅਤੇ ਘੱਟ-ਕਠੋਰ ਵਿਕਲਪਾਂ ਨੂੰ ਨਹੀਂ ਵੇਖਦੀ।";
  if (/ਆਧੁਨਿਕ|ਤਕਨਾਲੋਜੀ/.test(argument)) return "ਕਿਸੇ ਤਕਨਾਲੋਜੀ ਦਾ ਆਧੁਨਿਕ ਹੋਣਾ ਆਪਣੇ ਆਪ ਬਿਹਤਰ ਨਤੀਜਾ, ਲੋੜ ਜਾਂ ਨਿਆਂਯੋਗਤਾ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।";
  if (/ਜਾਂ .*ਸ਼ਿਕਾਇਤ.*ਬੰਦ|ਜਾਂ .*ਸ਼ਿਕਾਇਤ.*ਬੰਦ|ਪੂਰੀ ਮੁੜ-ਪ੍ਰੀਖਿਆ|ਪੂਰੀ ਮੁੜ ਪ੍ਰੀਖਿਆ/.test(argument)) return "ਇਹ ਦਲੀਲ ਜਾਂਚ ਅਤੇ ਸੀਮਿਤ ਕਾਰਵਾਈ ਦੇ ਵਿਕਲਪਾਂ ਨੂੰ ਛੱਡ ਕੇ ਝੂਠਾ ਦੋ-ਵਿਕਲਪੀ ਨਤੀਜਾ ਬਣਾਉਂਦੀ ਹੈ ਜਾਂ ਇੱਕ ਸ਼ਿਕਾਇਤ ਤੋਂ ਪੂਰੇ ਪ੍ਰਭਾਵ ਦਾ ਅਸਮਰਥਿਤ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।";
  if (/(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ)/.test(argument)) return "ਮਦਦ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇੱਕੋ ਸੰਪਰਕ ਹਰ ਸੇਵਾ-ਸਬੰਧੀ ਸਮੱਸਿਆ ਹੱਲ ਕਰ ਦੇਵੇਗਾ, ਇਹ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਸੈਸ਼ਨ|ਸੈਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ|ਬ੍ਰੀਫਿੰਗ)/.test(argument) && /(?:ਖਤਮ|ਘਟ|ਕਾਫ਼ੀ ਹੱਦ)/.test(argument)) return "ਇੱਕ ਸੈਸ਼ਨ ਕੁਝ ਗਲਤਫਹਮੀ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਲਗਭਗ ਸਾਰੀ ਗਲਤਫਹਮੀ ਜਾਂ ਨਿਯਮ-ਉਲੰਘਣਾ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਕਾਲ-ਬੈਕ|ਤਸਦੀਕ)/.test(argument) && /(?:ਅਣਭਰੋਸੇਯੋਗ|ਨਾਕਾਮ|ਫੇਲ)/.test(argument)) return "ਇੱਕ ਅਸਫਲ ਤਸਦੀਕ ਜਾਂ ਕਾਲ-ਬੈਕ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਅਸਲੀ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਇਹ ਤਰੀਕਾ ਆਮ ਤੌਰ 'ਤੇ ਅਣਭਰੋਸੇਯੋਗ ਹੈ।";
  if (/ਡੈਸਕਟਾਪ/.test(argument)) return "ਸਮਾਂ-ਸਲਾਟ ਜਾਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਆਪਣਾ ਮਹਿੰਗਾ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਸਹਾਇਤਾ ਜਾਂ ਹੋਰ ਬੁਕਿੰਗ ਵਿਕਲਪ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ।";
  if (/(?:ਕਿਓਸਕ|ਟਰਮੀਨਲ)/.test(argument) && /(?:ਲਾਭਦਾਇਕ ਸੇਵਾ|ਜੋਖਮ|ਸੰਭਾਲ)/.test(argument)) return "ਆਟੋਮੈਟਿਕ ਸੇਵਾ ਦੀਆਂ ਹੱਦਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਬੈਕਅੱਪ ਸਹਾਇਤਾ ਅਤੇ ਕ੍ਰਮਵਾਰ ਬਦਲਾਅ ਨਾਲ ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੇਕਾਰ ਜਾਂ ਜੋਖਮ-ਰਹਿਤ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ/.test(argument) && /ਅਮਲ ਵਿੱਚ ਔਖਾ/.test(argument)) return "ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ ਕੁਝ ਮੁਸ਼ਕਲ ਪੈਦਾ ਕਰ ਸਕਦੇ ਹਨ, ਪਰ ਇਸ ਨਾਲ ਸੇਵਾ ਲੰਬੇ ਸਮੇਂ ਲਈ ਅਮਲ ਵਿੱਚ ਅਸੰਭਵ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।";
  if (/ਨਿੱਜੀ ਟੈਬਲੈਟ/.test(argument) && /ਗੈਰ-ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਿੰਗ/.test(argument)) return "ਗੈਰ-ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਿੰਗ ਦਾ ਜੋਖਮ ਨਿਯਮਾਂ ਨੂੰ ਜਾਇਜ਼ ਬਣਾ ਸਕਦਾ ਹੈ, ਪਰ ਹਰ ਵਾਜਬ ਅਪਵਾਦ ਨੂੰ ਰੱਦ ਕਰਨ ਦਾ ਆਧਾਰ ਨਹੀਂ ਬਣਦਾ।";
  if (/(?:ਸਦਾ ਲਈ ਖਤਮ|ਅਕਸਰ ਲਈ ਖਤਮ|ਸਦਾ ਲਈ ਬਰਬਾਦ|ਜ਼ਿਆਦਾਤਰ ਵੇਲੇ ਬੰਦ)/.test(argument)) return "ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਸਥਾਈ ਨੁਕਸਾਨ ਜਾਂ ਹਮੇਸ਼ਾਂ ਲਈ ਪਾਬੰਦੀ ਦੀ ਲੋੜ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੀ।";
  if (/ਜ਼ਿਆਦਾਤਰ ਮਾਮਲੇ ਧੋਖਾਧੜੀ|ਕੇਵਲ ਆਟੋਮੈਟਿਕ ਬਲਾਕ/.test(argument)) return "ਕੁਝ ਲੈਣ-ਦੇਣ ਜੋਖਮ ਵਾਲੇ ਹੋ ਸਕਦੇ ਹਨ, ਪਰ ਜ਼ਿਆਦਾਤਰ ਮਾਮਲਿਆਂ ਨੂੰ ਬਿਨਾਂ ਜਾਂਚ ਧੋਖਾਧੜੀ ਮੰਨ ਕੇ ਸਭ ਨੂੰ ਰੋਕਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਲੰਬੇ ਸਮੇਂ ਦਾ ਜਾਮ|ਪੂਰੇ ਸ਼ਹਿਰ/.test(argument)) return "ਇੱਕ ਸੀਮਿਤ ਰਸਤਾ-ਪਾਬੰਦੀ ਨਾਲ ਪੂਰੇ ਸ਼ਹਿਰ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਦਾ ਜਾਮ ਪੈ ਜਾਵੇਗਾ, ਇਹ ਨਤੀਜਾ ਦਿੱਤੇ ਕਾਰਨਾਂ ਨਾਲ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।";
  if (/ਬਾਅਦ ਦੀਆਂ [ਸ਼ਸ਼]ਿਕਾਇਤਾਂ/.test(argument)) return "ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਦੇਣਾ ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨ ਦੇ ਬਰਾਬਰ ਨਹੀਂ; ਹਰ ਸ਼ਿਕਾਇਤ ਦੀ ਵੱਖਰੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।";
  if (/ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ.*ਜ਼ਿਆਦਾਤਰ ਜਾਣਕਾਰੀ.*(?:ਸਿੱਧੇ )?ਬੇਕਾਰ ਹੋ ਜਾਂਦੀ ਹੈ/.test(argument)) return "ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵੀ ਸ਼ਿਕਾਇਤ, ਨਤੀਜੇ ਜਾਂ ਸੁਧਾਰ ਨਾਲ ਜੁੜੀ ਜਾਣਕਾਰੀ ਲਾਭਦਾਇਕ ਰਹਿ ਸਕਦੀ ਹੈ; ਕੇਵਲ ਪ੍ਰਕਿਰਿਆ ਖਤਮ ਹੋਣ ਨਾਲ ਉਹ ਜਾਣਕਾਰੀ ਬੇਕਾਰ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।";
  if (/(?:ਸਵੈ-ਗਤੀ ਸਲਾਈਡ ਮੋਡੀਊਲ|ਰਿਕਾਰਡ ਕੀਤੇ ਵੀਡੀਓ ਮੋਡੀਊਲ|ਆਟੋਮੈਟਿਕ ਟਿਊਟੋਰਿਅਲ|ਪਹਿਲਾਂ ਰਿਕਾਰਡ ਵੈਬਿਨਾਰ)/.test(argument) && /(?:ਸਾਰੀ ਸਮਰੱਥਾ|ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ|ਸਮਰੱਥਾ.*ਗੁਆ)/.test(argument)) return "ਸਵੈ-ਗਤੀ ਜਾਂ ਰਿਕਾਰਡ ਕੀਤੇ ਮੋਡੀਊਲਾਂ ਵਿੱਚ ਲਾਈਵ ਮਾਰਗਦਰਸ਼ਨ ਦੀ ਕੁਝ ਕਮੀ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਕਰਮਚਾਰੀਆਂ ਦੀ ਸਿੱਖਣ ਜਾਂ ਟ੍ਰੇਨਿੰਗ ਤੋਂ ਲਾਭ ਲੈਣ ਦੀ ਸਾਰੀ ਸਮਰੱਥਾ ਖਤਮ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।";
  if (/ਕੋਈ ਵੀ ਦੂਜਾ ਤਸਦੀਕੀ ਕਦਮ.*(?:ਭਵਿੱਖ ਦੀ )?ਜ਼ਿਆਦਾਤਰ ਧੋਖਾਧੜੀ.*(?:ਅਮਲ ਵਿੱਚ ਔਖਾ|ਰੁਕ)/.test(argument)) return "ਵਾਧੂ ਤਸਦੀਕ ਧੋਖਾਧੜੀ ਦਾ ਜੋਖਮ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਕੇਵਲ ਇੱਕ ਹੋਰ ਤਸਦੀਕੀ ਕਦਮ ਨਾਲ ਭਵਿੱਖ ਦੀ ਜ਼ਿਆਦਾਤਰ ਧੋਖਾਧੜੀ ਰੁਕ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਇੱਕ ਵਰਤੋਂਕਾਰ.*ਤਸਦੀਕ.*(?:ਪੂਰਾ.*ਨਾ|ਨਾਕਾਮ)|ਇੱਕ ਗਾਹਕ.*ਤਸਦੀਕ.*ਅਸਫਲ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਅਸਲੀ|ਵਾਜਬ).*(?:ਅਮਲ ਵਿੱਚ ਔਖਾ|ਨਾਕਾਮ|ਅਸਫਲ)/.test(argument)) return "ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਤਸਦੀਕ ਪੂਰਾ ਨਾ ਕਰ ਸਕਣਾ ਕੇਵਲ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਜਾਂ ਵਾਜਬ ਬਦਲਾਅ ਵੀ ਨਾਕਾਮ ਹੋਣਗੇ।";
  if (/(?:ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ|ਅਸਥਾਈ).*ਪਾਬੰਦੀ.*(?:ਆਲੇ-ਦੁਆਲੇ|ਇਲਾਕੇ|ਸਥਾਨਕ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਸਰਗਰਮੀ).*(?:ਸਦਾ ਲਈ ਖਤਮ|ਸਥਾਈ ਤੌਰ.*ਖਤਮ|ਖਤਮ)/.test(argument)) return "ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਭਾਰੀ-ਵਾਹਨ ਪਾਬੰਦੀ ਕੁਝ ਸਥਾਨਕ ਸਰਗਰਮੀ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਆਲੇ-ਦੁਆਲੇ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਪਹਿਲੀ ਵਾਰ.*ਵਿਦੇਸ਼.*ਕਾਰਡ.*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਘਟਨਾ|ਲੈਣ-ਦੇਣ|ਖਰੀਦ).*(?:ਧੋਖਾਧੜੀ|ਫਰਾਡ)/.test(argument)) return "ਪਹਿਲੀ ਵਾਰ ਵਿਦੇਸ਼ ਵਿੱਚ ਕਾਰਡ ਵਰਤੋਂ ਅਸਧਾਰਣ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਕਰਕੇ ਜ਼ਿਆਦਾਤਰ ਅਜਿਹੀਆਂ ਖਰੀਦਾਂ ਨੂੰ ਧੋਖਾਧੜੀ ਨਹੀਂ ਮੰਨਿਆ ਜਾ ਸਕਦਾ; ਜੋਖਮ-ਸੰਕੇਤ ਦੀ ਜਾਂਚ ਅਤੇ ਅਨੁਪਾਤਿਕ ਪੁਸ਼ਟੀ ਵਧੇਰੇ ਉਚਿਤ ਹੈ।";
  if (/(?:ਤੁਰੰਤ|ਫੌਰੀ).*ਸਥਾਈ (?:ਸਜ਼ਾ|ਦੰਡ).*ਨਾ.*(?:ਭਵਿੱਖ ਦੀਆਂ )?ਜ਼ਿਆਦਾਤਰ ਸ਼ਿਕਾਇਤ.*(?:ਅਣਡਿੱਠਾ|ਨਜ਼ਰਅੰਦਾਜ਼)/.test(argument)) return "ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਦੇਣਾ ਸ਼ਿਕਾਇਤ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨਾ ਨਹੀਂ ਹੈ; ਅਥਾਰਟੀ ਸ਼ਿਕਾਇਤ ਦੀ ਜਾਂਚ ਕਰ ਸਕਦੀ ਹੈ ਅਤੇ ਸਬੂਤ ਦੇ ਅਨੁਸਾਰ ਅਨੁਪਾਤਿਕ ਕਾਰਵਾਈ ਕਰ ਸਕਦੀ ਹੈ।";
  if (/(?:ਦੇਰ ਨਾਲ ਪਹੁੰਚਣ ਵਾਲੇ ਅਰਜ਼ੀਕਾਰ|ਬੰਦ ਹੋਣ ਦੇ ਸਮੇਂ ਨੇੜੇ ਪਹੁੰਚਣ ਵਾਲੇ ਨਾਗਰਿਕ|ਬਿਨਾਂ ਅਪਾਇੰਟਮੈਂਟ ਆਉਣ ਵਾਲੇ ਵਰਤੋਂਕਾਰ|ਉਸੇ ਦਿਨ ਮਦਦ ਚਾਹੁਣ ਵਾਲੇ ਲੋਕ).*(?:ਅਕਸਰ|ਆਮ ਤੌਰ).*ਲਾਪਰਵਾਹ.*ਸੇਵਾ ਲੋੜਾਂ.*(?:ਕਦੇ|ਨਹੀਂ).*ਪ੍ਰਭਾਵਿਤ/.test(argument)) return "ਸੇਵਾ ਲੈਣ ਵਾਲੇ ਲੋਕਾਂ ਨੂੰ ਸਿਰਫ਼ ਉਨ੍ਹਾਂ ਦੇ ਆਉਣ ਦੇ ਸਮੇਂ ਕਰਕੇ ਲਾਪਰਵਾਹ ਮੰਨਣਾ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਹੈ; ਕਾਊਂਟਰ ਦੇ ਸਮੇਂ ਬਾਰੇ ਫੈਸਲਾ ਅਸਲ ਮੰਗ ਅਤੇ ਸੇਵਾ-ਪਹੁੰਚ ਦੀ ਲੋੜ ਦੇ ਆਧਾਰ ਤੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।";
  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*(?:ਜਾਂਚ|ਤਸਦੀਕ).*(?:ਪੂਰੀ ਨਾ ਕਰ ਸਕਿਆ|ਪੂਰਾ.*ਨਾ|ਨਾਕਾਮ|ਅਸਫਲ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਅਸਲੀ|ਵਾਜਬ).*(?:ਬੇਨਤੀ|ਬਦਲਾਅ).*(?:ਅਮਲ ਵਿੱਚ ਔਖ|ਨਾਕਾਮ|ਅਸਫਲ)/.test(argument)) return "ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਜਾਂਚ ਜਾਂ ਤਸਦੀਕ ਪੂਰੀ ਨਾ ਕਰ ਸਕਣਾ ਕੇਵਲ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਜਾਂ ਵਾਜਬ ਬਦਲਾਅ ਦੀਆਂ ਬੇਨਤੀਆਂ ਵੀ ਅਮਲ ਵਿੱਚ ਔਖੀਆਂ ਹੋਣਗੀਆਂ।";
  if ((/(?:ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ|ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ).*(?:ਦੇ ਬਿਨਾਂ|ਬਿਨਾਂ ਕਿਸੇ)/.test(argument) || /(?:ਦੇ ਬਿਨਾਂ|ਬਿਨਾਂ ਕਿਸੇ).*(?:ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ|ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ)/.test(argument)) && /(?:ਸ਼ੁਰੂ ਹੋ ਸਕਦਾ|ਸ਼ੁਰੂ ਕੀਤਾ ਜਾ ਸਕਦਾ|ਲਾਗੂ).*(?:ਵੰਡ|ਕੂੜੇ).*(?:ਸਿੱਧੇ ਕੰਮ|ਆਪਣੇ ਆਪ.*ਕੰਮ)/.test(argument)) return "ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ ਅਤੇ ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ ਬਿਨਾਂ ਨਿਯਮ ਸ਼ੁਰੂ ਕਰ ਦੇਣਾ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਕੂੜੇ ਦੀ ਵੰਡ ਆਪਣੇ ਆਪ ਠੀਕ ਕੰਮ ਕਰੇਗੀ; ਇਹ ਦੋਵੇਂ ਲਾਗੂ ਕਰਨ ਦੀਆਂ ਅਸਲ ਲੋੜਾਂ ਹਨ।";
  if (/(?:ਕੋਈ ਵੀ )?ਅਸਥਾਈ ਪਾਬੰਦੀ.*(?:ਨੇੜਲੇ|ਆਲੇ-ਦੁਆਲੇ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਕਾਰੋਬਾਰ|ਵਪਾਰ).*(?:ਸਦਾ ਲਈ ਬੰਦ|ਹਮੇਸ਼ਾਂ ਲਈ ਬੰਦ)/.test(argument)) return "ਅਸਥਾਈ ਭਾਰੀ-ਵਾਹਨ ਪਾਬੰਦੀ ਨਾਲ ਕੁਝ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਔਖ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਨੇੜਲੇ ਜ਼ਿਆਦਾਤਰ ਕਾਰੋਬਾਰ ਸਦਾ ਲਈ ਬੰਦ ਹੋ ਜਾਣਗੇ।";
  if (/(?:ਭਾਰੀ ਵਾਹਨ ਰੋਕਣਾ|ਭਾਰੀ-ਵਾਹਨ.*ਰੋਕ|ਭਾਰੀ ਵਾਹਨਾਂ ਦੀ ਸੀਮਾ).*ਸਥਾਨਕ ਸਰਗਰਮੀ.*(?:ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ|ਸਦਾ ਲਈ ਖਤਮ)/.test(argument)) return "ਭੀੜ ਦੇ ਸਮੇਂ ਲਈ ਸੀਮਿਤ ਭਾਰੀ-ਵਾਹਨ ਰੋਕ ਕੁਝ ਸਥਾਨਕ ਸਰਗਰਮੀ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਤੋਂ ਸਥਾਨਕ ਸਰਗਰਮੀ ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ ਹੋ ਜਾਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।";
  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*(?:ਇਨ-ਐਪ )?ਮਨਜ਼ੂਰੀ.*(?:ਪੂਰੀ ਨਹੀਂ ਕਰ ਸਕਿਆ|ਫੇਲ|ਅਸਫਲ).*(?:ਵਾਜਬ|ਅਸਲੀ).*(?:ਬਦਲਾਵ|ਬਦਲਾਅ|ਬੇਨਤੀ)/.test(argument)) return "ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰੀ ਨਾ ਕਰ ਸਕਣਾ ਸਿਰਫ਼ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਇਹ ਤਰੀਕਾ ਜ਼ਿਆਦਾਤਰ ਵਾਜਬ ਬਦਲਾਵਾਂ ਲਈ ਅਣਭਰੋਸੇਯੋਗ ਹੈ।";
  return punjabiFallback(argument);
}

function specificReason(argument: string, language: Language): string {
  if (language === "hi") return specificHindiReason(argument);
  if (language === "pa") return specificPunjabiReason(argument);
  return specificEnglishReason(argument);
}

function boilerplateReason(reason: string, language: Language): boolean {
  if (language === "hi") return BOILERPLATE_HI.has(reason);
  if (language === "pa") return BOILERPLATE_PA.has(reason);
  return BOILERPLATE_EN.has(reason);
}

function genericFallbackReason(reason: string, language: Language): boolean {
  if (language === "hi") return /^यह तर्क मान लेता है कि/.test(reason);
  if (language === "pa") return /^ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ/.test(reason);
  return /^The argument assumes that .*does not provide enough support/i.test(reason);
}

function duplicateReason(language: Language): string {
  if (language === "hi") return "एक ही सुरक्षा उपाय को अपने-आप पर्याप्त मान लेना उसके वास्तविक जोखिम-घटाव को बढ़ा-चढ़ाकर बताता है और अतिरिक्त सुरक्षा की भूमिका को अनदेखा करता है।";
  if (language === "pa") return "ਇੱਕੋ ਸੁਰੱਖਿਆ ਕਦਮ ਨੂੰ ਆਪਣੇ ਆਪ ਕਾਫ਼ੀ ਮੰਨ ਲੈਣਾ ਉਸਦੇ ਅਸਲ ਜੋਖਮ-ਘਟਾਅ ਨੂੰ ਵਧਾ-ਚੜ੍ਹਾ ਕੇ ਦੱਸਦਾ ਹੈ ਅਤੇ ਹੋਰ ਸੁਰੱਖਿਆ ਦੀ ਭੂਮਿਕਾ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਦਾ ਹੈ।";
  return "Treating one verification safeguard as sufficient on its own overstates its risk reduction and ignores the role of additional protections.";
}

function formatExplanation(language: Language, strengths: readonly Strength[], reasons: readonly string[]): string {
  return reasons.map((reason, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} ${strengths[index] === "STRONG" ? "मजबूत" : "कमजोर"} है: ${reason}`;
    if (language === "pa") return `ਦਲੀਲ ${label} ${strengths[index] === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${reason}`;
    return `Argument ${label} is ${strengths[index]!.toLowerCase()}: ${reason}`;
  }).join(" ");
}

function stemFor(statement: string, language: Language, argumentsList: readonly string[]): string {
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${statement}\nArguments:\n${rendered}`;
}

export function finalizeArgCp015EditorialQuality(question: Question): Question {
  const language = languageOf(question);
  const originalArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (originalArguments.length < 2 || originalArguments.length > 4) return question;
  const strengths = strengthsOf(question, originalArguments.length);
  const nextStatement = repairSurface(text(question.statement), language);
  const grammarRepairedArguments = originalArguments.map((argument) => repairSurface(argument, language));
  const deduped = dedupeWeakArguments(language, grammarRepairedArguments, strengths);

  let explanation = repairSurface(text(question.explanation), language);
  const reasons = strengths ? extractReasons(explanation, language, originalArguments.length) : undefined;
  if (strengths && reasons) {
    const nextReasons = reasons.map((reason, index) => {
      if (deduped.rewritten.has(index)) return duplicateReason(language);
      if (strengths[index] === "WEAK" && (boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);
      return repairSurface(reason, language);
    });
    explanation = formatExplanation(language, strengths, nextReasons);
  }

  const changed = nextStatement !== text(question.statement)
    || deduped.arguments.some((argument, index) => argument !== originalArguments[index])
    || explanation !== text(question.explanation);
  if (!changed) return question;

  const stem = stemFor(nextStatement, language, deduped.arguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    nextStatement,
    deduped.arguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement: nextStatement,
    arguments: deduped.arguments,
    explanation,
    stem,
    text: stem,
    finalEditorialQualityAuthority: ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY,
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:FINAL-EDITORIAL-QUALITY`,
    diversitySourceMode: "CP015_FINAL_EDITORIAL_QUALITY" as const,
  });
}