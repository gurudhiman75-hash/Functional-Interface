import { createHash } from "node:crypto";

export const ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY = "ARG_CP015_FINAL_EDITORIAL_QUALITY_V1" as const;

type Question = Readonly<Record<string, any>>;
type Language = "en" | "hi" | "pa";
type Strength = "STRONG" | "WEAK";

const ROMAN = ["I", "II", "III", "IV"] as const;
const GENERIC_EN = "It draws a broad conclusion without enough evidence and does not examine the relevant limits, alternatives or safeguards.";
const GENERIC_HI = "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।";
const GENERIC_PA = "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।";

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
    .replace(/\b(digital examination centres) is treated\b/gi, "$1 are treated")
    .replace(/\b(tablet-based testing centres) is treated\b/gi, "$1 are treated");
}

function repairSurface(value: string, language: Language): string {
  return language === "en" ? repairEnglish(value) : value;
}

function normalizedArgument(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function duplicateWeakRewrite(language: Language, statement: string): string {
  if (language === "hi") {
    return `हाँ। कथन में बताए गए एक ही सुरक्षा उपाय को अपने-आप पर्याप्त मान लेना चाहिए; ${statement.replace(/[?।]+$/, "")} के लिए किसी अतिरिक्त सुरक्षा की आवश्यकता नहीं होगी।`;
  }
  if (language === "pa") {
    return `ਹਾਂ। ਕਥਨ ਵਿੱਚ ਦੱਸੇ ਇਕੋ ਸੁਰੱਖਿਆ ਕਦਮ ਨੂੰ ਆਪਣੇ ਆਪ ਕਾਫ਼ੀ ਮੰਨ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ; ${statement.replace(/[?।]+$/, "")} ਲਈ ਕਿਸੇ ਹੋਰ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਨਹੀਂ ਰਹੇਗੀ।`;
  }
  return `Yes. The single safeguard described in the statement should be treated as sufficient on its own, so no additional protection would be needed for the change under consideration.`;
}

function dedupeWeakArguments(
  question: Question,
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
    next[index] = duplicateWeakRewrite(language, text(question.statement));
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

function specificEnglishReason(argument: string): string {
  if (/prefer a form|final after the first submission/i.test(argument)) {
    return "A preference for an irreversible first submission does not address whether a limited correction window improves procedural fairness before the stated deadline.";
  }
  if (/process is complete|little practical value/i.test(argument)) {
    return "Completion of a process does not make relevant post-process information valueless to users seeking transparency, verification or clarification.";
  }
  if (/workshop|orientation/i.test(argument) && /misunderstanding|misconduct rules/i.test(argument)) {
    return "One orientation session can reduce confusion, but it cannot by itself remove nearly all misunderstanding of the relevant rules.";
  }
  if (/passwords? at ten-day intervals|portal passwords/i.test(argument) && /insecure credential storage|weakening password security/i.test(argument)) {
    return "The argument assumes frequent password rotation will cause insecure credential storage without showing that this effect follows from the policy or outweighs other security considerations.";
  }
  if (/passwords? at ten-day intervals|portal passwords/i.test(argument) && /phishing/i.test(argument)) {
    return "Password rotation does not make phishing irrelevant; the argument dismisses a separate attack path without evidence that the rotation policy neutralises it.";
  }
  if (/One user once failed|One customer once failed|single failure/i.test(argument)) {
    return "A single failed verification attempt does not show that the control is generally unusable for legitimate changes.";
  }
  if (/rebuilding|extensive rebuilding/i.test(argument)) {
    return "The argument assumes the proposed queue-management measure requires extensive rebuilding, but no such implementation dependency is established.";
  }
  if (/inherently insecure/i.test(argument) && /invigilators/i.test(argument)) {
    return "The testing format is labelled inherently insecure even when trained invigilators are available, but the argument gives no reason why those controls cannot materially reduce the stated risk.";
  }
  if (/decision itself is assumed to make enough trained invigilators/i.test(argument)) {
    return "Announcing a switch cannot itself create enough trained invigilators by the stated deadline; staffing readiness requires separate planning and evidence.";
  }
  if (/without transition support|without resident or user communication/i.test(argument)) {
    return "The argument assumes the new rule will work immediately without communication or transition support, which is an unproved implementation assumption.";
  }
  if (/single result is treated as enough reason to keep heavy vehicles barred/i.test(argument)) {
    return "A benefit during the targeted period does not justify extending the restriction beyond that period into a broader ban.";
  }
  if (/lasting damage to activity throughout the surrounding area/i.test(argument)) {
    return "A short peak-period restriction does not by itself establish lasting damage throughout the surrounding area; the claimed scale and duration of harm are unsupported.";
  }
  if (/should be rejected even where consent, purpose and safeguards/i.test(argument)) {
    return "Rejecting disclosure regardless of consent, purpose and safeguards ignores the conditions that determine whether the privacy intrusion is justified.";
  }
  if (/eliminate nearly all future lateness/i.test(argument)) {
    return "Publishing names may influence behaviour, but it does not establish that nearly all future lateness will disappear.";
  }
  if (/lasting gridlock across the city/i.test(argument)) {
    return "The argument predicts lasting city-wide gridlock from a limited corridor restriction despite the stated alternatives, without evidence for that network-wide effect.";
  }
  return GENERIC_EN;
}

function specificHindiReason(argument: string): string {
  if (/पासवर्ड|फ़िशिंग|फिशिंग/.test(argument)) return "यह तर्क पासवर्ड नीति के एक प्रभाव को बिना पर्याप्त आधार के निर्णायक मानता है और अलग सुरक्षा जोखिमों को उचित रूप से नहीं तौलता।";
  if (/कार्यशाला|अभिमुखीकरण|ओरिएंटेशन/.test(argument)) return "एक ही सत्र भ्रम कम कर सकता है, लेकिन उससे संबंधित नियमों की लगभग सारी गलतफहमी समाप्त हो जाएगी, यह निष्कर्ष समर्थित नहीं है।";
  if (/टैबलेट|डिजिटल परीक्षा|निरीक्षक|इनविजिलेटर/.test(argument)) return "प्रारूप या घोषणा अपने-आप सुरक्षा और पर्याप्त प्रशिक्षित स्टाफ की उपलब्धता सिद्ध नहीं करती; दोनों के लिए अलग व्यवस्था और साक्ष्य चाहिए।";
  if (/नाम|विभाग|नोटिस बोर्ड|गोपनीयता/.test(argument)) return "यह तर्क सहमति, उद्देश्य और सुरक्षा उपायों जैसी प्रासंगिक शर्तों को पर्याप्त रूप से तौले बिना व्यापक निष्कर्ष निकालता है।";
  if (/समय-स्लॉट|कतार|पुनर्निर्माण/.test(argument)) return "यह तर्क प्रस्तावित व्यवस्था के लिए एक बड़े कार्यान्वयन अवरोध को बिना प्रमाण मान लेता है और कम-कठोर विकल्पों पर विचार नहीं करता।";
  return GENERIC_HI;
}

function specificPunjabiReason(argument: string): string {
  if (/ਪਾਸਵਰਡ|ਫਿਸ਼ਿੰਗ|ਫਿਸ਼ਿੰਗ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪਾਸਵਰਡ ਨੀਤੀ ਦੇ ਇੱਕ ਪ੍ਰਭਾਵ ਨੂੰ ਬਿਨਾਂ ਕਾਫ਼ੀ ਆਧਾਰ ਦੇ ਫੈਸਲਾਕੁੰਨ ਮੰਨਦੀ ਹੈ ਅਤੇ ਵੱਖਰੇ ਸੁਰੱਖਿਆ ਜੋਖਮਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਨਹੀਂ ਤੋਲਦੀ।";
  if (/ਵਰਕਸ਼ਾਪ|ਵਰਕਸ਼ਾਪ|ਓਰੀਐਂਟੇਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ/.test(argument)) return "ਇੱਕੋ ਸੈਸ਼ਨ ਭੁੱਲ-ਭੁਲੇਖਾ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਸੰਬੰਧਿਤ ਨਿਯਮਾਂ ਬਾਰੇ ਲਗਭਗ ਸਾਰੀ ਗਲਤਫਹਮੀ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।";
  if (/ਟੈਬਲੈਟ|ਡਿਜ਼ਿਟਲ ਪ੍ਰੀਖਿਆ|ਡਿਜਿਟਲ ਪ੍ਰੀਖਿਆ|ਨਿਗਰਾਨ/.test(argument)) return "ਫਾਰਮੈਟ ਜਾਂ ਐਲਾਨ ਆਪਣੇ ਆਪ ਸੁਰੱਖਿਆ ਅਤੇ ਕਾਫ਼ੀ ਤਰਬੀਅਤਯਾਫ਼ਤਾ ਸਟਾਫ ਦੀ ਉਪਲਬਧਤਾ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ; ਦੋਵਾਂ ਲਈ ਵੱਖਰੀ ਯੋਜਨਾ ਅਤੇ ਸਬੂਤ ਚਾਹੀਦੇ ਹਨ।";
  if (/ਨਾਂ|ਵਿਭਾਗ|ਨੋਟਿਸ ਬੋਰਡ|ਪਰਦੇਦਾਰੀ/.test(argument)) return "ਇਹ ਦਲੀਲ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸੰਬੰਧਿਤ ਸ਼ਰਤਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਤੋਲਣ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।";
  if (/ਸਮਾਂ-ਸਲਾਟ|ਕਤਾਰ|ਮੁੜ-ਨਿਰਮਾਣ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰਬੰਧ ਲਈ ਇੱਕ ਵੱਡੀ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਰੁਕਾਵਟ ਨੂੰ ਬਿਨਾਂ ਸਬੂਤ ਮੰਨਦੀ ਹੈ ਅਤੇ ਘੱਟ-ਕਠੋਰ ਵਿਕਲਪਾਂ ਨੂੰ ਨਹੀਂ ਵੇਖਦੀ।";
  return GENERIC_PA;
}

function specificReason(argument: string, language: Language): string {
  if (language === "hi") return specificHindiReason(argument);
  if (language === "pa") return specificPunjabiReason(argument);
  return specificEnglishReason(argument);
}

function genericReason(reason: string, language: Language): boolean {
  if (language === "hi") return reason === GENERIC_HI;
  if (language === "pa") return reason === GENERIC_PA;
  return reason === GENERIC_EN;
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
  const deduped = dedupeWeakArguments(question, language, grammarRepairedArguments, strengths);

  let explanation = repairSurface(text(question.explanation), language);
  const reasons = strengths ? extractReasons(explanation, language, originalArguments.length) : undefined;
  if (strengths && reasons) {
    const nextReasons = reasons.map((reason, index) => {
      if (deduped.rewritten.has(index)) return duplicateReason(language);
      if (strengths[index] === "WEAK" && genericReason(reason, language)) {
        return specificReason(deduped.arguments[index]!, language);
      }
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
