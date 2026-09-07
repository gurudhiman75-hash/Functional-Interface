import { createHash } from "node:crypto";

export const ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY = "ARG_CP015_FINAL_EDITORIAL_QUALITY_V3" as const;

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
]);

const BOILERPLATE_HI = new Set([
  "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।",
  "यह तर्क जोखिम-संकेत या सीमित अनुभव को पर्याप्त प्रमाण मानकर साक्ष्य और अनुपातिक सुरक्षा की जरूरत को कम आँकता है।",
  "केवल तकनीक या माध्यम का आधुनिक अथवा डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।",
  "यह सहायता, वैकल्पिक पहुँच या वास्तविक क्षमता पर विचार किए बिना एक कार्यान्वयन धारणा को निर्णायक मान लेता है।",
  "यह वास्तविक सेवा या नीति-कारण की जगह लोगों के बारे में असिद्ध रूढ़ धारणा पर निर्भर है।",
]);

const BOILERPLATE_PA = new Set([
  "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।",
  "ਇਹ ਦਲੀਲ ਜੋਖਮ-ਸੰਕੇਤ ਜਾਂ ਸੀਮਿਤ ਤਜਰਬੇ ਨੂੰ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨ ਕੇ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਘੱਟ ਅੰਕਦੀ ਹੈ।",
  "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
  "ਇਹ ਸਹਾਇਤਾ, ਵਿਕਲਪੀ ਪਹੁੰਚ ਜਾਂ ਅਸਲ ਸਮਰੱਥਾ ਵੇਖੇ ਬਿਨਾਂ ਇੱਕ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਧਾਰਨਾ ਨੂੰ ਫੈਸਲਾਕੁੰਨ ਮੰਨ ਲੈਂਦੀ ਹੈ।",
  "ਇਹ ਅਸਲ ਸੇਵਾ ਜਾਂ ਨੀਤੀ-ਕਾਰਨ ਦੀ ਥਾਂ ਲੋਕਾਂ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਉੱਤੇ ਨਿਰਭਰ ਹੈ।",
  "ਇਹ ਦਲੀਲ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸੰਬੰਧਿਤ ਸ਼ਰਤਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਤੋਲਣ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।",
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
    .replace(/\b(digital examination centres) is treated\b/gi, "$1 are treated")
    .replace(/\b(tablet-based testing centres) is treated\b/gi, "$1 are treated")
    .replace(/\b(An? [^.]+?) is generally proof of fraud, so there is no need for (.+?) even if (.+?)\./gi, "$1 is treated as sufficient evidence of fraud on its own, so $2 is considered unnecessary even if $3.");
}

function repairSurface(value: string, language: Language): string {
  return language === "en" ? repairEnglish(value) : value;
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
  if (/One user once failed|One customer once failed|single failure|one customer failed a verification/i.test(argument)) {
    return "A single failed verification attempt does not show that the control is generally unusable for legitimate changes.";
  }
  if (/social-engineering fraud case occurred despite alerts|alerts? .*treated as ineffective/i.test(argument)) {
    return "One fraud incident despite an alert does not show that alerts lack early-warning value in other unauthorised-change cases.";
  }
  if (/dispense with further fraud safeguards|further fraud safeguards should be treated as unnecessary|further fraud .*negligible|no additional protection would be needed/i.test(argument)) {
    return "A second verification step can reduce one attack path, but it does not remove the need for other fraud controls, recovery routes and monitoring.";
  }
  if (/(?:complaint|report|flag|allegation).*(?:proof|guilt|certain|conclusive|misconduct)|(?:proof|guilt|certain|conclusive).*(?:complaint|report|flag|allegation)/i.test(argument)) {
    return "A complaint, report, flag or allegation is a signal to investigate, not conclusive proof of guilt by itself.";
  }
  if (/later complaints|future complaints|little basis for acting|disregard all later/i.test(argument)) {
    return "Rejecting an immediate irreversible penalty does not require later complaints to be ignored; the argument creates a false choice between permanent punishment and inaction.";
  }
  if (/modern (?:technology|monitoring tool)|presumed fair without a separate necessity test/i.test(argument)) {
    return "Calling a monitoring method modern does not establish that its use is necessary, proportionate or fair in this particular workplace context.";
  }
  if (/digital|recorded video|automated tutorial/i.test(argument) && /better|superior|presumed/i.test(argument)) {
    return "The delivery format alone does not show that the proposed digital method will produce better learning than the existing alternative.";
  }
  if (/automated service terminal/i.test(argument) && /backup|implementation risk|useful service/i.test(argument)) {
    return "The claim overstates what automated terminals can handle and does not justify either a complete one-week replacement or the opposite claim that useful service would largely disappear despite backup support.";
  }
  if (/desktop computer|own an expensive desktop/i.test(argument)) {
    return "The proposal does not inherently require each user to own the assumed device, so the claimed access barrier is not established.";
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
  if (/perfect future rule compliance|eliminate nearly all future lateness/i.test(argument)) {
    return "Publishing names may influence behaviour, but it does not establish perfect compliance or the disappearance of nearly all future lateness.";
  }
  if (/lasting gridlock across the city/i.test(argument)) {
    return "The argument predicts lasting city-wide gridlock from a limited corridor restriction despite the stated alternatives, without evidence for that network-wide effect.";
  }
  if (/probably trying to avoid oversight|usually careless/i.test(argument)) {
    return "The argument substitutes a stereotype about the people affected for evidence about whether the proposed policy is justified.";
  }
  return "The stated conclusion goes beyond the mechanism or evidence given in this particular argument.";
}

function specificHindiReason(argument: string): string {
  if (/एक ग्राहक|एक उपयोगकर्ता/.test(argument) && /सत्यापन|वेरिफिकेशन/.test(argument)) return "एक व्यक्ति का सत्यापन में विफल होना यह सिद्ध नहीं करता कि वैध उपयोगकर्ताओं के लिए यह नियंत्रण सामान्यतः अनुपयोगी है।";
  if (/धोखाधड़ी|शिकायत|आरोप|संकेत|फ्लैग/.test(argument) && /प्रमाण|दोष|पर्याप्त/.test(argument)) return "शिकायत, संकेत या फ्लैग जाँच शुरू करने का आधार हो सकता है, लेकिन वह अपने-आप दोष का निर्णायक प्रमाण नहीं है।";
  if (/अतिरिक्त धोखाधड़ी सुरक्षा|अन्य सुरक्षा|सुरक्षा की जरूरत/.test(argument)) return "एक अतिरिक्त सत्यापन कदम जोखिम घटा सकता है, लेकिन उससे अन्य धोखाधड़ी नियंत्रण, रिकवरी और निगरानी अनावश्यक नहीं हो जाते।";
  if (/पासवर्ड|फ़िशिंग|फिशिंग/.test(argument)) return "यह तर्क पासवर्ड नीति के एक प्रभाव को बिना पर्याप्त आधार के निर्णायक मानता है और अलग सुरक्षा जोखिमों को उचित रूप से नहीं तौलता।";
  if (/कार्यशाला|अभिमुखीकरण|ओरिएंटेशन/.test(argument)) return "एक ही सत्र भ्रम कम कर सकता है, लेकिन उससे संबंधित नियमों की लगभग सारी गलतफहमी समाप्त हो जाएगी, यह निष्कर्ष समर्थित नहीं है।";
  if (/टैबलेट|डिजिटल परीक्षा|निरीक्षक|इनविजिलेटर/.test(argument)) return "प्रारूप या घोषणा अपने-आप सुरक्षा और पर्याप्त प्रशिक्षित स्टाफ की उपलब्धता सिद्ध नहीं करती; दोनों के लिए अलग व्यवस्था और साक्ष्य चाहिए।";
  if (/नाम|विभाग|नोटिस बोर्ड|गोपनीयता/.test(argument)) return "नाम सार्वजनिक करने के प्रभाव का आकलन सहमति, उद्देश्य, अनुपातिकता और सुरक्षा उपायों जैसी शर्तों के आधार पर होना चाहिए; इन्हें अनदेखा करके व्यापक निष्कर्ष उचित नहीं है।";
  if (/समय-स्लॉट|कतार|पुनर्निर्माण/.test(argument)) return "यह तर्क प्रस्तावित व्यवस्था के लिए एक बड़े कार्यान्वयन अवरोध को बिना प्रमाण मान लेता है और कम-कठोर विकल्पों पर विचार नहीं करता।";
  if (/आधुनिक|डिजिटल|तकनीक/.test(argument)) return "किसी तकनीक का आधुनिक या डिजिटल होना अपने-आप बेहतर परिणाम, आवश्यकता या निष्पक्षता सिद्ध नहीं करता।";
  return "इस तर्क का निष्कर्ष दिए गए कारण या तंत्र से अधिक व्यापक है और उसी संदर्भ में पर्याप्त रूप से समर्थित नहीं है।";
}

function specificPunjabiReason(argument: string): string {
  if (/(?:ਇੱਕ|ਇਕ) (?:ਗਾਹਕ|ਵਰਤੋਂਕਾਰ)/.test(argument) && /ਤਸਦੀਕ/.test(argument)) return "ਇੱਕ ਵਿਅਕਤੀ ਦਾ ਤਸਦੀਕ ਵਿੱਚ ਅਸਫਲ ਹੋਣਾ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਵਾਜਬ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਇਹ ਨਿਯੰਤਰਣ ਆਮ ਤੌਰ 'ਤੇ ਅਣਵਰਤੋਂਯੋਗ ਹੈ।";
  if (/ਧੋਖਾਧੜੀ|ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਫਲੈਗ|ਸੰਕੇਤ/.test(argument) && /ਸਬੂਤ|ਦੋਸ਼|ਦੋਸ਼|ਕਾਫ਼ੀ/.test(argument)) return "ਸ਼ਿਕਾਇਤ, ਫਲੈਗ ਜਾਂ ਹੋਰ ਸੰਕੇਤ ਜਾਂਚ ਦਾ ਆਧਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਉਹ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਫੈਸਲਾਕੁੰਨ ਸਬੂਤ ਨਹੀਂ ਹੈ।";
  if (/ਹੋਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ|ਵਾਧੂ ਸੁਰੱਖਿਆ|ਹੋਰ ਸੁਰੱਖਿਆ/.test(argument)) return "ਇੱਕ ਵਾਧੂ ਤਸਦੀਕ ਕਦਮ ਜੋਖਮ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਹੋਰ ਧੋਖਾਧੜੀ ਨਿਯੰਤਰਣ, ਰਿਕਵਰੀ ਅਤੇ ਨਿਗਰਾਨੀ ਬੇਲੋੜੇ ਨਹੀਂ ਹੋ ਜਾਂਦੇ।";
  if (/ਪਾਸਵਰਡ|ਫਿਸ਼ਿੰਗ|ਫਿਸ਼ਿੰਗ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪਾਸਵਰਡ ਨੀਤੀ ਦੇ ਇੱਕ ਪ੍ਰਭਾਵ ਨੂੰ ਬਿਨਾਂ ਕਾਫ਼ੀ ਆਧਾਰ ਦੇ ਫੈਸਲਾਕੁੰਨ ਮੰਨਦੀ ਹੈ ਅਤੇ ਵੱਖਰੇ ਸੁਰੱਖਿਆ ਜੋਖਮਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਨਹੀਂ ਤੋਲਦੀ।";
  if (/ਵਰਕਸ਼ਾਪ|ਵਰਕਸ਼ਾਪ|ਓਰੀਐਂਟੇਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ/.test(argument)) return "ਇੱਕੋ ਸੈਸ਼ਨ ਭੁੱਲ-ਭੁਲੇਖਾ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਸੰਬੰਧਿਤ ਨਿਯਮਾਂ ਬਾਰੇ ਲਗਭਗ ਸਾਰੀ ਗਲਤਫਹਮੀ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।";
  if (/ਟੈਬਲੈਟ|ਡਿਜ਼ਿਟਲ ਪ੍ਰੀਖਿਆ|ਡਿਜਿਟਲ ਪ੍ਰੀਖਿਆ|ਨਿਗਰਾਨ/.test(argument)) return "ਫਾਰਮੈਟ ਜਾਂ ਐਲਾਨ ਆਪਣੇ ਆਪ ਸੁਰੱਖਿਆ ਅਤੇ ਕਾਫ਼ੀ ਤਰਬੀਅਤਯਾਫ਼ਤਾ ਸਟਾਫ ਦੀ ਉਪਲਬਧਤਾ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ; ਦੋਵਾਂ ਲਈ ਵੱਖਰੀ ਯੋਜਨਾ ਅਤੇ ਸਬੂਤ ਚਾਹੀਦੇ ਹਨ।";
  if (/ਨਾਮ|ਨੋਟਿਸ ਬੋਰਡ|ਪਰਦੇਦਾਰੀ|ਵਿਭਾਗ ਦੀ ਸੂਚੀ/.test(argument)) return "ਨਾਂ ਜਨਤਕ ਕਰਨ ਦੇ ਪ੍ਰਭਾਵ ਨੂੰ ਸਹਿਮਤੀ, ਮਕਸਦ, ਅਨੁਪਾਤਿਕਤਾ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸ਼ਰਤਾਂ ਨਾਲ ਤੋਲਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਨ੍ਹਾਂ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਕੇ ਵਿਆਪਕ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਆਟੋਮੈਟਿਕ ਸੇਵਾ ਟਰਮੀਨਲ/.test(argument)) return "ਇਹ ਦਲੀਲ ਆਟੋਮੈਟਿਕ ਟਰਮੀਨਲਾਂ ਦੀ ਸਮਰੱਥਾ ਜਾਂ ਸੀਮਾ ਨੂੰ ਬਿਨਾਂ ਕਾਫ਼ੀ ਆਧਾਰ ਦੇ ਬਹੁਤ ਵੱਡਾ ਮੰਨਦੀ ਹੈ ਅਤੇ ਬੈਕਅੱਪ ਸਹਾਇਤਾ ਦੀ ਅਸਲ ਭੂਮਿਕਾ ਨੂੰ ਢੰਗ ਨਾਲ ਨਹੀਂ ਤੋਲਦੀ।";
  if (/ਸਮਾਂ-ਸਲਾਟ|ਕਤਾਰ|ਮੁੜ-ਨਿਰਮਾਣ/.test(argument)) return "ਇਹ ਦਲੀਲ ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰਬੰਧ ਲਈ ਇੱਕ ਵੱਡੀ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਰੁਕਾਵਟ ਨੂੰ ਬਿਨਾਂ ਸਬੂਤ ਮੰਨਦੀ ਹੈ ਅਤੇ ਘੱਟ-ਕਠੋਰ ਵਿਕਲਪਾਂ ਨੂੰ ਨਹੀਂ ਵੇਖਦੀ।";
  if (/ਆਧੁਨਿਕ|ਡਿਜ਼ਿਟਲ|ਡਿਜਿਟਲ|ਤਕਨਾਲੋਜੀ/.test(argument)) return "ਕਿਸੇ ਤਕਨਾਲੋਜੀ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਆਪਣੇ ਆਪ ਬਿਹਤਰ ਨਤੀਜਾ, ਲੋੜ ਜਾਂ ਨਿਆਂਯੋਗਤਾ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।";
  return "ਇਸ ਦਲੀਲ ਦਾ ਨਤੀਜਾ ਦਿੱਤੇ ਕਾਰਨ ਜਾਂ ਤਰੀਕੇ ਨਾਲੋਂ ਵੱਧ ਵਿਆਪਕ ਹੈ ਅਤੇ ਇਸੇ ਸੰਦਰਭ ਵਿੱਚ ਕਾਫ਼ੀ ਤੌਰ 'ਤੇ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।";
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
      if (strengths[index] === "WEAK" && boilerplateReason(reason, language)) {
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
