import { createHash } from "node:crypto";

export const ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY = "ARG_CP015_ANTI_GAMING_CUE_DEBIAS_V2" as const;

type Question = Readonly<Record<string, any>>;
type Strength = "STRONG" | "WEAK";
type Language = "en" | "hi" | "pa";

type Rewrite = Readonly<{ argument: string; reason: string }>;

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function languageOf(question: Question): Language {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa";
  return "en";
}

function strengthsOf(question: Question, count: number): readonly Strength[] | undefined {
  const values = Array.isArray(question.argumentStrengths) ? question.argumentStrengths : [];
  if (values.length !== count) return undefined;
  const strengths = values.map((value) => text(value).toUpperCase());
  if (strengths.some((value) => value !== "STRONG" && value !== "WEAK")) return undefined;
  return strengths as readonly Strength[];
}

function hasCue(value: string, language: Language): boolean {
  if (language === "hi") {
    return /हमेशा|कभी नहीं|(?:^|\s)हर(?=\s)|(?:^|\s)सभी(?=\s)|पूरी तरह|गारंटी|असंभव|अपने[- ]आप|केवल तभी|निश्चित रूप से|ज़रूर कुछ छिपाने|जरूर कुछ छिपाने/.test(value);
  }
  if (language === "pa") {
    return /ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ|ਕਦੇ ਨਹੀਂ|(?:^|\s)ਹਰ(?=\s)|(?:^|\s)ਸਾਰੇ(?=\s)|(?:^|\s)ਸਾਰੀ(?=\s)|ਪੂਰੀ ਤਰ੍ਹਾਂ|ਗਾਰੰਟੀ|ਅਸੰਭਵ|ਆਪਣੇ ਆਪ|ਸਿਰਫ਼ (?:ਉਸ ਵੇਲੇ|ਤਦ)|ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/.test(value);
  }
  return /\b(?:always|never|every|everyone|everything|completely|guarantee(?:s|d)?|impossible|automatically|inevitably|necessarily|only when)\b|under any circumstances|must have something to hide/i.test(value);
}

function compactEnglish(original: string): string {
  let next = original;

  if (/completely eliminate queues for all/i.test(next)) {
    next = next.replace(/will completely eliminate queues for all [^.]+/i, "should be treated as sufficient to solve the queue problem without other demand or capacity measures");
  }
  if (/\bverification\b/i.test(next) && /guarantee|future fraud attempt becomes impossible|fraud involving .* can never occur/i.test(next)) {
    next = next
      .replace(/(?:guarantees? that fraud involving [^.]+ can never occur|guarantees? that [^.]+ can never occur)/i, "should be treated as sufficient reason to dispense with further fraud safeguards")
      .replace(/every future fraud attempt becomes impossible/i, "further fraud safeguards should be treated as unnecessary");
  }
  if (/modern (?:technology|monitoring tool)/i.test(next) && /always|automatically/i.test(next)) {
    next = next
      .replace(/must always be fair to [^.]+/i, "should be presumed fair without a separate necessity test")
      .replace(/is automatically fair/i, "should be presumed fair without a separate necessity test");
  }
  if (/complaint can occur only when guilt is (?:already )?certain/i.test(next)) {
    next = next.replace(/(?:One|A single) (.+?) complaint can occur only when guilt is (?:already )?certain/i, "A single $1 complaint should be treated as sufficient proof of guilt");
  }
  if (/always proves the most serious misconduct/i.test(next)) {
    next = next.replace(/always proves the most serious misconduct/i, "should be treated as sufficient proof of the most serious misconduct");
  }
  if (/must ignore every future complaint|every future complaint must be ignored|can never act on another complaint/i.test(next)) {
    next = next
      .replace(/must ignore every future complaint as well/i, "would have little basis for acting on later complaints either")
      .replace(/every future complaint must be ignored/i, "later complaints would also have little basis for action")
      .replace(/can never act on another complaint/i, "would have little basis for acting on a later complaint");
  }
  if (/must have something to hide/i.test(next)) {
    next = next.replace(/must have something to hide/i, "is probably trying to avoid oversight");
  }
  if (/automatically useless/i.test(next)) {
    next = next.replace(/automatically useless/i, "of little practical value");
  }
  if (/\bdigital\b.*\bnecessarily\b/i.test(next)) {
    next = next.replace(/necessarily (produce|provide|give)/i, "should be assumed to $1");
  }
  if (/single .* allegation proves that every candidate and centre/i.test(next)) {
    next = next.replace(/A single (.+?) allegation proves that every candidate and centre in (.+?) was affected/i, "A single $1 allegation is enough to infer that $2 as a whole was compromised");
  }

  return next
    .replace(/\balways\b/gi, "generally")
    .replace(/\bnever\b/gi, "rarely")
    .replace(/\beveryone\b/gi, "most people")
    .replace(/\beverything\b/gi, "most things")
    .replace(/\bevery\b/gi, "most")
    .replace(/\bcompletely\b/gi, "largely")
    .replace(/\bautomatically\b/gi, "readily")
    .replace(/\binevitably\b/gi, "predictably")
    .replace(/\bnecessarily\b/gi, "apparently")
    .replace(/\bimpossible\b/gi, "impractical")
    .replace(/\bonly when\b/gi, "mainly when")
    .replace(/under any circumstances/gi, "in practice")
    .replace(/guarantees? that/gi, "is treated as enough reason to assume that");
}

function compactHindi(original: string): string {
  let next = original;

  next = next
    .replace(/कतारें पूरी तरह समाप्त हो जाएँगी/g, "कतार की समस्या के लिए इसी उपाय को पर्याप्त मान लिया जाएगा")
    .replace(/हर समस्या तुरंत हल होने की गारंटी मिल जाएगी/g, "समस्याओं के समाधान के लिए इसी संपर्क को पर्याप्त मान लिया जाएगा")
    .replace(/हर वैध बदलाव हमेशा असंभव हो जाएगा/g, "यह तरीका वैध बदलावों के लिए बहुत अविश्वसनीय मान लिया जाएगा")
    .replace(/यह गारंटी देता है कि उससे जुड़ी धोखाधड़ी कभी नहीं हो सकती/g, "को इतना प्रभावी मानना चाहिए कि अतिरिक्त धोखाधड़ी सुरक्षा की जरूरत न रहे")
    .replace(/भविष्य की हर धोखाधड़ी असंभव हो जाएगी/g, "अतिरिक्त धोखाधड़ी सुरक्षा की जरूरत नहीं मानी जाएगी")
    .replace(/उसके पास जरूर कुछ छिपाने को है/g, "वह शायद निगरानी से बचना चाहता है")
    .replace(/उसके पास ज़रूर कुछ छिपाने को है/g, "वह शायद निगरानी से बचना चाहता है")
    .replace(/इसका उपयोग हमेशा न्यायसंगत होगा/g, "इसके उपयोग को अलग आवश्यकता-जाँच के बिना न्यायसंगत मानना चाहिए")
    .replace(/केवल तभी हो सकती है जब दोष निश्चित हो/g, "को दोष का पर्याप्त प्रमाण मान लेना चाहिए")
    .replace(/भविष्य की हर शिकायत अनदेखी करनी चाहिए/g, "बाद की शिकायतों पर भी कार्रवाई का आधार कमजोर मानना चाहिए")
    .replace(/दोष बिना संदेह स्थापित माना जाना चाहिए/g, "संकेत को ही दोष का पर्याप्त प्रमाण मान लेना चाहिए");

  return next
    .replace(/हमेशा/g, "अक्सर")
    .replace(/कभी नहीं/g, "शायद ही")
    .replace(/(^|\s)हर(?=\s)/g, "$1अधिकांश")
    .replace(/(^|\s)सभी(?=\s)/g, "$1अधिकांश")
    .replace(/पूरी तरह/g, "काफी हद तक")
    .replace(/असंभव/g, "अव्यावहारिक")
    .replace(/अपने[- ]आप/g, "सीधे")
    .replace(/केवल तभी/g, "मुख्यतः तभी")
    .replace(/निश्चित रूप से/g, "संभवतः")
    .replace(/ज़रूर/g, "शायद")
    .replace(/जरूर/g, "शायद")
    .replace(/गारंटी देता है कि/g, "यह मानने के लिए पर्याप्त माना जाता है कि")
    .replace(/गारंटी मिल जाएगी/g, "इसे पर्याप्त मान लिया जाएगा");
}

function compactPunjabi(original: string): string {
  let next = original;

  next = next
    .replace(/ਹਰ ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੱਲ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ/g, "ਸਮੱਸਿਆਵਾਂ ਦੇ ਹੱਲ ਲਈ ਇਸ ਸੰਪਰਕ ਨੂੰ ਹੀ ਕਾਫ਼ੀ ਮੰਨ ਲਿਆ ਜਾਵੇਗਾ")
    .replace(/ਹਰ ਵਾਜਬ ਬਦਲਾਅ ਹਮੇਸ਼ਾਂ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ/g, "ਇਹ ਢੰਗ ਵਾਜਬ ਬਦਲਾਵਾਂ ਲਈ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਇਹ ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ ਇਸ ਨਾਲ ਜੁੜੀ ਧੋਖਾਧੜੀ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦੀ/g, "ਨੂੰ ਇੰਨਾ ਪ੍ਰਭਾਵੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਹੋਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਨਾ ਰਹੇ")
    .replace(/ਭਵਿੱਖ ਦੀ ਹਰ ਧੋਖਾਧੜੀ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗੀ/g, "ਹੋਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਨਹੀਂ ਮੰਨੀ ਜਾਵੇਗੀ")
    .replace(/ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ/g, "ਉਹ ਸ਼ਾਇਦ ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹੈ")
    .replace(/ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ/g, "ਉਹ ਸ਼ਾਇਦ ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹੈ")
    .replace(/ਇਸ ਦੀ ਵਰਤੋਂ ਹਮੇਸ਼ਾਂ ਨਿਆਂਯੋਗ ਹੋਵੇਗੀ/g, "ਇਸ ਦੀ ਵਰਤੋਂ ਨੂੰ ਵੱਖਰੀ ਲੋੜ-ਜਾਂਚ ਤੋਂ ਬਿਨਾਂ ਨਿਆਂਯੋਗ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਸਿਰਫ਼ ਉਸ ਵੇਲੇ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਯਕੀਨੀ ਹੋਵੇ/g, "ਨੂੰ ਦੋਸ਼ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਸਿਰਫ਼ ਤਦ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ/g, "ਨੂੰ ਦੋਸ਼ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ/g, "ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਉੱਤੇ ਵੀ ਕਾਰਵਾਈ ਦਾ ਆਧਾਰ ਕਮਜ਼ੋਰ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਹਮੇਸ਼ਾਂ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਵਿਹਾਰ ਨੂੰ ਸਾਬਤ ਕਰ ਦਿੰਦਾ ਹੈ/g, "ਨੂੰ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਵਿਹਾਰ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ");

  return next
    .replace(/ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ/g, "ਅਕਸਰ")
    .replace(/ਕਦੇ ਨਹੀਂ/g, "ਬਹੁਤ ਘੱਟ")
    .replace(/(^|\s)ਹਰ(?=\s)/g, "$1ਜ਼ਿਆਦਾਤਰ")
    .replace(/(^|\s)ਸਾਰੇ(?=\s)/g, "$1ਜ਼ਿਆਦਾਤਰ")
    .replace(/(^|\s)ਸਾਰੀ(?=\s)/g, "$1ਜ਼ਿਆਦਾਤਰ")
    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ/g, "ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ")
    .replace(/ਅਸੰਭਵ/g, "ਅਮਲ ਵਿੱਚ ਔਖਾ")
    .replace(/ਆਪਣੇ ਆਪ/g, "ਸਿੱਧੇ")
    .replace(/ਸਿਰਫ਼ ਉਸ ਵੇਲੇ|ਸਿਰਫ਼ ਤਦ/g, "ਮੁੱਖ ਤੌਰ 'ਤੇ ਤਦ")
    .replace(/ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/g, "ਸ਼ਾਇਦ")
    .replace(/ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ/g, "ਇਹ ਮੰਨਣ ਲਈ ਕਾਫ਼ੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ ਕਿ")
    .replace(/ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ/g, "ਇਸਨੂੰ ਕਾਫ਼ੀ ਮੰਨ ਲਿਆ ਜਾਵੇਗਾ");
}

function reasonFor(original: string, language: Language): string {
  const fraud = /fraud|verification|complaint|allegation|flag|धोखाधड़ी|सत्यापन|शिकायत|आरोप|संकेत|ਧੋਖਾਧੜੀ|ਤਸਦੀਕ|ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਸੰਕੇਤ/i.test(original);
  const digital = /digital|modern|technology|डिजिटल|आधुनिक|तकनीक|ਡਿਜ਼ਿਟਲ|ਆਧੁਨਿਕ|ਤਕਨਾਲੋਜੀ/i.test(original);
  const access = /desktop|time[- ]slot|slot|queue|डेस्कटॉप|समय-स्लॉट|स्लॉट|कतार|ਡੈਸਕਟਾਪ|ਸਮਾਂ-ਸਲਾਟ|ਸਲਾਟ|ਕਤਾਰ/i.test(original);
  const stereotype = /careless|something to hide|लापरवाह|छिपाने|ਲਾਪਰਵਾਹ|ਲੁਕਾਉਣ/i.test(original);

  if (language === "hi") {
    if (fraud) return "यह तर्क जोखिम-संकेत या सीमित अनुभव को पर्याप्त प्रमाण मानकर साक्ष्य और अनुपातिक सुरक्षा की जरूरत को कम आँकता है।";
    if (digital) return "केवल तकनीक या माध्यम का आधुनिक अथवा डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।";
    if (access) return "यह सहायता, वैकल्पिक पहुँच या वास्तविक क्षमता पर विचार किए बिना एक कार्यान्वयन धारणा को निर्णायक मान लेता है।";
    if (stereotype) return "यह वास्तविक सेवा या नीति-कारण की जगह लोगों के बारे में असिद्ध रूढ़ धारणा पर निर्भर है।";
    return "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।";
  }

  if (language === "pa") {
    if (fraud) return "ਇਹ ਦਲੀਲ ਜੋਖਮ-ਸੰਕੇਤ ਜਾਂ ਸੀਮਿਤ ਤਜਰਬੇ ਨੂੰ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨ ਕੇ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਘੱਟ ਅੰਕਦੀ ਹੈ।";
    if (digital) return "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।";
    if (access) return "ਇਹ ਸਹਾਇਤਾ, ਵਿਕਲਪੀ ਪਹੁੰਚ ਜਾਂ ਅਸਲ ਸਮਰੱਥਾ ਵੇਖੇ ਬਿਨਾਂ ਇੱਕ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਧਾਰਨਾ ਨੂੰ ਫੈਸਲਾਕੁੰਨ ਮੰਨ ਲੈਂਦੀ ਹੈ।";
    if (stereotype) return "ਇਹ ਅਸਲ ਸੇਵਾ ਜਾਂ ਨੀਤੀ-ਕਾਰਨ ਦੀ ਥਾਂ ਲੋਕਾਂ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਉੱਤੇ ਨਿਰਭਰ ਹੈ।";
    return "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।";
  }

  if (fraud) return "It treats a risk signal or limited experience as sufficient proof and underweights evidence, recovery and proportionate safeguards.";
  if (digital) return "The technology or delivery format alone does not establish better outcomes, fairness or necessity in the stated context.";
  if (access) return "It treats an implementation assumption as decisive without considering assisted access, fallback routes or actual capacity.";
  if (stereotype) return "It relies on an unsupported stereotype about people instead of a material service or policy reason.";
  return "It draws a broad conclusion without enough evidence and does not examine the relevant limits, alternatives or safeguards.";
}

function rewriteWeak(original: string, language: Language, ssc: boolean): Rewrite {
  let argument = language === "hi" ? compactHindi(original) : language === "pa" ? compactPunjabi(original) : compactEnglish(original);

  // SSC surfaces are intentionally concise. If a semantic rewrite grows beyond
  // the profile cap, keep the original proposition but neutralise only the lexical
  // giveaway so the logic remains weak without making the item inadmissibly long.
  if (ssc && words(argument) > 34) {
    argument = language === "hi"
      ? original
          .replace(/हमेशा/g, "अक्सर")
          .replace(/कभी नहीं/g, "शायद ही")
          .replace(/(^|\s)हर(?=\s)/g, "$1अधिकांश")
          .replace(/पूरी तरह/g, "काफी हद तक")
          .replace(/असंभव/g, "अव्यावहारिक")
          .replace(/ज़रूर|जरूर/g, "शायद")
      : language === "pa"
        ? original
            .replace(/ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ/g, "ਅਕਸਰ")
            .replace(/ਕਦੇ ਨਹੀਂ/g, "ਬਹੁਤ ਘੱਟ")
            .replace(/(^|\s)ਹਰ(?=\s)/g, "$1ਜ਼ਿਆਦਾਤਰ")
            .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ/g, "ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ")
            .replace(/ਅਸੰਭਵ/g, "ਅਮਲ ਵਿੱਚ ਔਖਾ")
            .replace(/ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/g, "ਸ਼ਾਇਦ")
        : original
            .replace(/\balways\b/gi, "generally")
            .replace(/\bnever\b/gi, "rarely")
            .replace(/\bevery\b/gi, "most")
            .replace(/\bcompletely\b/gi, "largely")
            .replace(/\bimpossible\b/gi, "impractical")
            .replace(/\bnecessarily\b/gi, "apparently");
  }

  return Object.freeze({ argument, reason: reasonFor(original, language) });
}

function prefixes(language: Language, count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} `;
    if (language === "pa") return `ਦਲੀਲ ${label} `;
    return `Argument ${label} `;
  });
}

function extractReasons(question: Question, language: Language, count: number): string[] | undefined {
  const explanation = text(question.explanation);
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

function stemFor(question: Question, language: Language, argumentsList: readonly string[]): string {
  const statement = text(question.statement);
  const rendered = argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n");
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${rendered}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${rendered}`;
  return `Statement: ${statement}\nArguments:\n${rendered}`;
}

export function debiasArgCp015AnswerCues(question: Question): Question {
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length < 2 || argumentsList.length > 4) return question;
  const strengths = strengthsOf(question, argumentsList.length);
  if (!strengths) return question;
  const language = languageOf(question);
  const reasons = extractReasons(question, language, argumentsList.length);
  if (!reasons) return question;
  const ssc = text(question.examProfile).toUpperCase() === "SSC_RECENT_2X4";

  const nextArguments = [...argumentsList];
  const nextReasons = [...reasons];
  const changedIndices: number[] = [];

  for (let index = 0; index < argumentsList.length; index += 1) {
    const original = text(argumentsList[index]);
    if (strengths[index] !== "WEAK" || !hasCue(original, language)) continue;
    const rewritten = rewriteWeak(original, language, ssc);
    if (rewritten.argument === original) continue;
    nextArguments[index] = rewritten.argument;
    nextReasons[index] = rewritten.reason;
    changedIndices.push(index);
  }

  if (changedIndices.length === 0) return question;

  const frozenArguments = Object.freeze(nextArguments);
  const explanation = formatExplanation(language, strengths, nextReasons);
  const stem = stemFor(question, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    question.statement,
    frozenArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    arguments: frozenArguments,
    explanation,
    stem,
    text: stem,
    antiGamingCueDebiasAuthority: ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
    cueDebiasedArgumentIndices: Object.freeze(changedIndices),
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:CUE-DEBIAS`,
    diversitySourceMode: "CP015_EDITORIAL_SURFACE_WITH_ANTI_GAMING_CUE_DEBIAS" as const,
  });
}
