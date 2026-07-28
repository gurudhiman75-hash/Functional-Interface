import { getEnglishSentenceCodeLexeme } from "../COD-CP-009/datasets/lexemes.en";
import type { CodTranslatedLocale } from "./translational-language-pack";

export interface Cp009LanguagePack {
  locale: CodTranslatedLocale;
  scriptPattern: RegExp;
  lexeme(value: string): string;
  englishFor(localized: string): string;
  renderSentence(words: readonly string[]): string;
  prefix: string;
  stem(prototypeId: string, prompt: Readonly<Record<string, unknown>>, style: number): string;
  referenceAid: readonly string[];
  quickMethod: string;
  ruleStatement: string;
  rowEvidence(sentence: string, code: string): string;
  targetResult(answer: string, style: number): string;
  conclusion(answer: string, style: number): string;
  trap(option: string): string;
}

const HI: Readonly<Record<string, string>> = {
  birds: "पक्षी", fly: "उड़ते हैं", sing: "गाते हैं", flowers: "फूल", bloom: "खिलते हैं", fade: "मुरझाते हैं",
  children: "बच्चे", learn: "सीखते हैं", play: "खेलते हैं", games: "खेल", stars: "तारे", shine: "चमकते हैं", twinkle: "टिमटिमाते हैं",
  rivers: "नदियाँ", flow: "बहती हैं", merge: "मिलती हैं", quickly: "तेज़ी से", daily: "रोज़", adults: "वयस्क", sweetly: "मधुर स्वर में",
  plants: "पौधे", grow: "बढ़ते हैं", well: "अच्छी तरह", workers: "कर्मचारी", act: "अभिनय करते हैं", carefully: "सावधानी से",
  leaders: "नेता", students: "विद्यार्थी", read: "पढ़ते हैं", quietly: "चुपचाप", teachers: "शिक्षक", solve: "हल करते हैं",
  problems: "समस्याएँ", difficult: "कठिन", build: "बनाते हैं", nests: "घोंसले", strong: "मजबूत", sparrows: "गौरैयाँ",
  complete: "पूरा करते हैं", tasks: "कार्य", urgent: "जरूरी", early: "जल्दी", safely: "सुरक्षित ढंग से", teams: "टीमें",
  skills: "कौशल", books: "किताबें", useful: "उपयोगी", drivers: "चालक", follow: "पालन करते हैं", rules: "नियम",
  important: "महत्वपूर्ण", strictly: "सख्ती से", citizens: "नागरिक", and: "और",
  apple: "एक सेब", mango: "एक आम", orange: "एक संतरा", banana: "एक केला", tea: "चाय", coffee: "कॉफी", milk: "दूध", juice: "रस",
  red: "लाल", blue: "नीला", green: "हरा", yellow: "पीला", cricket: "क्रिकेट", hockey: "हॉकी", tennis: "टेनिस", football: "फुटबॉल",
  buses: "बसें", trains: "रेलगाड़ियाँ", cars: "कारें", bicycles: "साइकिलें", pens: "कलमें", pencils: "पेंसिलें",
  apples: "कई सेब", mangoes: "कई आम", oranges: "कई संतरे", outside: "बाहर", together: "साथ में", study: "पढ़ाई करते हैं",
  high: "ऊँचाई पर", practise: "अभ्यास करते हैं", work: "काम करते हैं", dogs: "कुत्ते", run: "दौड़ते हैं", fast: "तेज़",
  players: "खिलाड़ी", train: "प्रशिक्षण लेते हैं", hard: "मेहनत से", friends: "मित्र", meet: "मिलते हैं", artists: "कलाकार",
  planes: "विमान", athletes: "एथलीट",
};

const PA: Readonly<Record<string, string>> = {
  birds: "ਪੰਛੀ", fly: "ਉੱਡਦੇ ਹਨ", sing: "ਗਾਉਂਦੇ ਹਨ", flowers: "ਫੁੱਲ", bloom: "ਖਿੜਦੇ ਹਨ", fade: "ਮੁਰਝਾਉਂਦੇ ਹਨ",
  children: "ਬੱਚੇ", learn: "ਸਿੱਖਦੇ ਹਨ", play: "ਖੇਡਦੇ ਹਨ", games: "ਖੇਡਾਂ", stars: "ਤਾਰੇ", shine: "ਚਮਕਦੇ ਹਨ", twinkle: "ਟਿਮਟਿਮਾਉਂਦੇ ਹਨ",
  rivers: "ਦਰਿਆ", flow: "ਵਗਦੇ ਹਨ", merge: "ਰਲਦੇ ਹਨ", quickly: "ਤੇਜ਼ੀ ਨਾਲ", daily: "ਹਰ ਰੋਜ਼", adults: "ਬਾਲਗ", sweetly: "ਮਿੱਠੇ ਸੁਰ ਵਿੱਚ",
  plants: "ਪੌਦੇ", grow: "ਵਧਦੇ ਹਨ", well: "ਚੰਗੀ ਤਰ੍ਹਾਂ", workers: "ਕਰਮਚਾਰੀ", act: "ਅਦਾਕਾਰੀ ਕਰਦੇ ਹਨ", carefully: "ਧਿਆਨ ਨਾਲ",
  leaders: "ਆਗੂ", students: "ਵਿਦਿਆਰਥੀ", read: "ਪੜ੍ਹਦੇ ਹਨ", quietly: "ਚੁੱਪਚਾਪ", teachers: "ਅਧਿਆਪਕ", solve: "ਹੱਲ ਕਰਦੇ ਹਨ",
  problems: "ਸਮੱਸਿਆਵਾਂ", difficult: "ਔਖੀਆਂ", build: "ਬਣਾਉਂਦੇ ਹਨ", nests: "ਘੋਸਲੇ", strong: "ਮਜ਼ਬੂਤ", sparrows: "ਚਿੜੀਆਂ",
  complete: "ਪੂਰੇ ਕਰਦੇ ਹਨ", tasks: "ਕੰਮ", urgent: "ਜ਼ਰੂਰੀ", early: "ਜਲਦੀ", safely: "ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ", teams: "ਟੀਮਾਂ",
  skills: "ਹੁਨਰ", books: "ਕਿਤਾਬਾਂ", useful: "ਲਾਭਦਾਇਕ", drivers: "ਡਰਾਈਵਰ", follow: "ਪਾਲਣਾ ਕਰਦੇ ਹਨ", rules: "ਨਿਯਮ",
  important: "ਮਹੱਤਵਪੂਰਨ", strictly: "ਸਖ਼ਤੀ ਨਾਲ", citizens: "ਨਾਗਰਿਕ", and: "ਅਤੇ",
  apple: "ਇੱਕ ਸੇਬ", mango: "ਇੱਕ ਅੰਬ", orange: "ਇੱਕ ਸੰਤਰਾ", banana: "ਇੱਕ ਕੇਲਾ", tea: "ਚਾਹ", coffee: "ਕੌਫੀ", milk: "ਦੁੱਧ", juice: "ਰਸ",
  red: "ਲਾਲ", blue: "ਨੀਲਾ", green: "ਹਰਾ", yellow: "ਪੀਲਾ", cricket: "ਕ੍ਰਿਕਟ", hockey: "ਹਾਕੀ", tennis: "ਟੈਨਿਸ", football: "ਫੁੱਟਬਾਲ",
  buses: "ਬੱਸਾਂ", trains: "ਰੇਲਗੱਡੀਆਂ", cars: "ਕਾਰਾਂ", bicycles: "ਸਾਈਕਲਾਂ", pens: "ਕਲਮਾਂ", pencils: "ਪੈਂਸਲਾਂ",
  apples: "ਕਈ ਸੇਬ", mangoes: "ਕਈ ਅੰਬ", oranges: "ਕਈ ਸੰਤਰੇ", outside: "ਬਾਹਰ", together: "ਇਕੱਠੇ", study: "ਪੜ੍ਹਾਈ ਕਰਦੇ ਹਨ",
  high: "ਉੱਚਾਈ ਉੱਤੇ", practise: "ਅਭਿਆਸ ਕਰਦੇ ਹਨ", work: "ਕੰਮ ਕਰਦੇ ਹਨ", dogs: "ਕੁੱਤੇ", run: "ਦੌੜਦੇ ਹਨ", fast: "ਤੇਜ਼",
  players: "ਖਿਡਾਰੀ", train: "ਸਿਖਲਾਈ ਲੈਂਦੇ ਹਨ", hard: "ਮਿਹਨਤ ਨਾਲ", friends: "ਦੋਸਤ", meet: "ਮਿਲਦੇ ਹਨ", artists: "ਕਲਾਕਾਰ",
  planes: "ਜਹਾਜ਼", athletes: "ਐਥਲੀਟ",
};

function listText(items: readonly string[], conjunction: string): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items.at(-1)}`;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function makePack(locale: CodTranslatedLocale, map: Readonly<Record<string, string>>): Cp009LanguagePack {
  const hi = locale === "hi-IN";
  const reverse = new Map(Object.entries(map).map(([english, localized]) => [localized, english]));
  if (reverse.size !== Object.keys(map).length) throw new Error(`CP-009 ${locale} lexicon is not injective`);
  const conjunction = hi ? "और" : "ਅਤੇ";
  const prefix = hi
    ? "एक विशेष कोड भाषा में नीचे दिए वाक्यों को दिखाए गए कोडों में लिखा गया है। कोड शब्दों का क्रम वाक्य के शब्दों के क्रम जैसा होना जरूरी नहीं है।"
    : "ਇੱਕ ਖਾਸ ਕੋਡ ਭਾਸ਼ਾ ਵਿੱਚ ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕਾਂ ਨੂੰ ਦਿਖਾਏ ਕੋਡਾਂ ਵਿੱਚ ਲਿਖਿਆ ਗਿਆ ਹੈ। ਕੋਡ ਸ਼ਬਦਾਂ ਦਾ ਕ੍ਰਮ ਵਾਕ ਦੇ ਸ਼ਬਦਾਂ ਵਾਲਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।";

  return {
    locale,
    scriptPattern: hi ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u,
    lexeme(value) {
      const translated = map[value];
      if (!translated) throw new Error(`Missing CP-009 ${locale} lexeme '${value}'`);
      return translated;
    },
    englishFor(localized) {
      const english = reverse.get(localized);
      if (!english) throw new Error(`Unknown CP-009 ${locale} lexeme '${localized}'`);
      return english;
    },
    renderSentence(words) {
      const entries = words.map((localized) => {
        const english = reverse.get(localized);
        if (!english) throw new Error(`Unknown CP-009 ${locale} sentence word '${localized}'`);
        return { localized, part: getEnglishSentenceCodeLexeme(english).partOfSpeech };
      });
      const verbs = entries.filter((entry) => entry.part === "VERB").map((entry) => entry.localized);
      const others = entries.filter((entry) => entry.part !== "VERB" && entry.part !== "CONJUNCTION").map((entry) => entry.localized);
      return verbs.length === 0 ? listText(others, conjunction) : [...others, ...verbs].join(" ");
    },
    prefix,
    stem(prototypeId, prompt, style) {
      const word = String(prompt.targetWord ?? "");
      const token = String(prompt.targetToken ?? "");
      const wordSet = listText(strings(prompt.targetWords).length ? strings(prompt.targetWords) : strings(prompt.phraseWords), conjunction);
      const tokenSet = (strings(prompt.targetTokens).length ? strings(prompt.targetTokens) : strings(prompt.phraseTokens)).join(", ");
      const bridge = hi
        ? ["साझा शब्दों और साझा कोडों की तुलना कीजिए।", "सभी वैध मिलानों को ध्यान में रखिए।", "प्रतिच्छेद और निष्कासन से उत्तर निकालिए।"][style % 3]!
        : ["ਸਾਂਝੇ ਸ਼ਬਦਾਂ ਅਤੇ ਸਾਂਝੇ ਕੋਡਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।", "ਸਾਰੀਆਂ ਠੀਕ ਮੈਪਿੰਗਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ।", "ਮਿਲਾਪ ਅਤੇ ਹਟਾਉਣ ਨਾਲ ਜਵਾਬ ਕੱਢੋ।"][style % 3]!;
      const query = hi
        ? prototypeId.includes("EXACT-WORD-TO-TOKEN") ? `‘${word}’ का कोड शब्द कौन-सा है?`
          : prototypeId.includes("EXACT-TOKEN-TO-WORD") ? `कोड ‘${token}’ किस शब्द को दर्शाता है?`
          : prototypeId.includes("EXACT-PHRASE-TO-TOKENS") ? `${wordSet} के लिए सही कोड-समूह कौन-सा है?`
          : prototypeId.includes("EXACT-TOKENS-TO-PHRASE") ? `${tokenSet} किन शब्दों को दर्शाता है?`
          : prototypeId.includes("MISSING-TOKEN") ? "अधूरे कोड में खाली स्थान पर कौन-सा कोड शब्द आएगा?"
          : prototypeId.includes("MISSING-WORD") ? "अधूरे वाक्य में खाली स्थान पर कौन-सा शब्द आएगा?"
          : prototypeId.includes("POSSIBLE-WORD-TO-TOKEN") ? `‘${word}’ का कौन-सा कोड संभव हो सकता है?`
          : prototypeId.includes("POSSIBLE-TOKEN-TO-WORD") ? `कोड ‘${token}’ किस शब्द के लिए संभव हो सकता है?`
          : prototypeId.includes("IMPOSSIBLE-WORD-TO-TOKEN") ? `‘${word}’ का कौन-सा कोड संभव नहीं हो सकता?`
          : prototypeId.includes("IMPOSSIBLE-TOKEN-TO-WORD") ? `कोड ‘${token}’ किस शब्द को दर्शा नहीं सकता?`
          : prototypeId.includes("POSSIBLE-WORD-SET-TO-TOKENS") ? `${wordSet} के लिए कौन-सा कोड-समूह संभव है?`
          : prototypeId.includes("POSSIBLE-TOKEN-SET-TO-WORDS") ? `${tokenSet} किस शब्द-समूह को दर्शा सकता है?`
          : prototypeId.includes("EXACT-RESOLVED-WORDS-TO-TOKENS") ? `${wordSet} के लिए निश्चित कोड-समूह चुनिए।`
          : prototypeId.includes("EXACT-RESOLVED-TOKENS-TO-WORDS") ? `${tokenSet} के लिए निश्चित शब्द-समूह चुनिए।`
          : prototypeId.includes("COMPLETE-CODE-CANDIDATE-SET") ? `‘${word}’ के सभी संभव कोडों का पूरा समूह कौन-सा है?`
          : prototypeId.includes("COMPLETE-WORD-CANDIDATE-SET") ? `कोड ‘${token}’ के सभी संभव शब्दों का पूरा समूह कौन-सा है?`
          : "सही उत्तर चुनिए।"
        : prototypeId.includes("EXACT-WORD-TO-TOKEN") ? `‘${word}’ ਦਾ ਕੋਡ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`
          : prototypeId.includes("EXACT-TOKEN-TO-WORD") ? `ਕੋਡ ‘${token}’ ਕਿਹੜੇ ਸ਼ਬਦ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`
          : prototypeId.includes("EXACT-PHRASE-TO-TOKENS") ? `${wordSet} ਲਈ ਸਹੀ ਕੋਡ-ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`
          : prototypeId.includes("EXACT-TOKENS-TO-PHRASE") ? `${tokenSet} ਕਿਹੜੇ ਸ਼ਬਦਾਂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`
          : prototypeId.includes("MISSING-TOKEN") ? "ਅਧੂਰੇ ਕੋਡ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਕੋਡ ਸ਼ਬਦ ਆਵੇਗਾ?"
          : prototypeId.includes("MISSING-WORD") ? "ਅਧੂਰੇ ਵਾਕ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?"
          : prototypeId.includes("POSSIBLE-WORD-TO-TOKEN") ? `‘${word}’ ਦਾ ਕਿਹੜਾ ਕੋਡ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?`
          : prototypeId.includes("POSSIBLE-TOKEN-TO-WORD") ? `ਕੋਡ ‘${token}’ ਕਿਸ ਸ਼ਬਦ ਲਈ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?`
          : prototypeId.includes("IMPOSSIBLE-WORD-TO-TOKEN") ? `‘${word}’ ਦਾ ਕਿਹੜਾ ਕੋਡ ਸੰਭਵ ਨਹੀਂ ਹੋ ਸਕਦਾ?`
          : prototypeId.includes("IMPOSSIBLE-TOKEN-TO-WORD") ? `ਕੋਡ ‘${token}’ ਕਿਹੜੇ ਸ਼ਬਦ ਨੂੰ ਦਰਸਾ ਨਹੀਂ ਸਕਦਾ?`
          : prototypeId.includes("POSSIBLE-WORD-SET-TO-TOKENS") ? `${wordSet} ਲਈ ਕਿਹੜਾ ਕੋਡ-ਸਮੂਹ ਸੰਭਵ ਹੈ?`
          : prototypeId.includes("POSSIBLE-TOKEN-SET-TO-WORDS") ? `${tokenSet} ਕਿਹੜੇ ਸ਼ਬਦ-ਸਮੂਹ ਨੂੰ ਦਰਸਾ ਸਕਦਾ ਹੈ?`
          : prototypeId.includes("EXACT-RESOLVED-WORDS-TO-TOKENS") ? `${wordSet} ਲਈ ਪੱਕਾ ਕੋਡ-ਸਮੂਹ ਚੁਣੋ।`
          : prototypeId.includes("EXACT-RESOLVED-TOKENS-TO-WORDS") ? `${tokenSet} ਲਈ ਪੱਕਾ ਸ਼ਬਦ-ਸਮੂਹ ਚੁਣੋ।`
          : prototypeId.includes("COMPLETE-CODE-CANDIDATE-SET") ? `‘${word}’ ਦੇ ਸਾਰੇ ਸੰਭਵ ਕੋਡਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`
          : prototypeId.includes("COMPLETE-WORD-CANDIDATE-SET") ? `ਕੋਡ ‘${token}’ ਦੇ ਸਾਰੇ ਸੰਭਵ ਸ਼ਬਦਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`
          : "ਸਹੀ ਜਵਾਬ ਚੁਣੋ।";
      return `${prefix} ${bridge} ${query}`;
    },
    referenceAid: hi
      ? ["हर वाक्य के शब्दों के समूह की तुलना उसके कोड शब्दों के समूह से करें।", "कोड शब्दों का क्रम महत्वपूर्ण नहीं; साझा और बाहर हुए सदस्य महत्वपूर्ण हैं।"]
      : ["ਹਰ ਵਾਕ ਦੇ ਸ਼ਬਦਾਂ ਦੇ ਸਮੂਹ ਦੀ ਤੁਲਨਾ ਉਸ ਦੇ ਕੋਡ ਸ਼ਬਦਾਂ ਦੇ ਸਮੂਹ ਨਾਲ ਕਰੋ।", "ਕੋਡ ਸ਼ਬਦਾਂ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ; ਸਾਂਝੇ ਅਤੇ ਬਾਹਰ ਹੋਏ ਮੈਂਬਰ ਮਹੱਤਵਪੂਰਨ ਹਨ।"],
    quickMethod: hi ? "साझा सदस्य पहचानें, अलग सदस्य हटाएँ और बची सभी एक-से-एक मैपिंगों से विकल्प जांचें।" : "ਸਾਂਝੇ ਮੈਂਬਰ ਪਛਾਣੋ, ਵੱਖ ਮੈਂਬਰ ਹਟਾਓ ਅਤੇ ਬਚੀਆਂ ਇੱਕ-ਤੋਂ-ਇੱਕ ਮੈਪਿੰਗਾਂ ਨਾਲ ਚੋਣਾਂ ਜਾਂਚੋ।",
    ruleStatement: hi ? "हर शब्द एक ही कोड शब्द से और हर कोड शब्द एक ही शब्द से जुड़ा है।" : "ਹਰ ਸ਼ਬਦ ਇੱਕੋ ਕੋਡ ਸ਼ਬਦ ਨਾਲ ਅਤੇ ਹਰ ਕੋਡ ਸ਼ਬਦ ਇੱਕੋ ਸ਼ਬਦ ਨਾਲ ਜੁੜਿਆ ਹੈ।",
    rowEvidence: hi ? (sentence, code) => `वाक्य ‘${sentence}’ के कोड सदस्य हैं: ${code}।` : (sentence, code) => `ਵਾਕ ‘${sentence}’ ਦੇ ਕੋਡ ਮੈਂਬਰ ਹਨ: ${code}।`,
    targetResult: hi ? (answer, style) => [`सभी वैध मिलानों से ‘${answer}’ मिलता है।`, `तुलना के बाद सही विकल्प ‘${answer}’ बचता है।`, `सभी कथनों से संगत परिणाम ‘${answer}’ है।`][style % 3]! : (answer, style) => [`ਸਾਰੀਆਂ ਠੀਕ ਮੈਪਿੰਗਾਂ ਨਾਲ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`, `ਤੁਲਨਾ ਤੋਂ ਬਾਅਦ ਸਹੀ ਚੋਣ ‘${answer}’ ਬਚਦੀ ਹੈ।`, `ਸਾਰੇ ਵਾਕਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਨਤੀਜਾ ‘${answer}’ ਹੈ।`][style % 3]!,
    conclusion: hi ? (answer, style) => [`अतः सही उत्तर ‘${answer}’ है।`, `इसलिए विकल्प ‘${answer}’ चुनना है।`, `अंतिम उत्तर ‘${answer}’ है।`][style % 3]! : (answer, style) => [`ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ‘${answer}’ ਹੈ।`, `ਚੋਣ ‘${answer}’ ਚੁਣਨੀ ਹੈ।`, `ਆਖਰੀ ਜਵਾਬ ‘${answer}’ ਹੈ।`][style % 3]!,
    trap: hi ? (option) => `विकल्प ‘${option}’ सदस्यता, निष्कासन या पूरी संभावित सूची को सही प्रकार नहीं मानता।` : (option) => `ਚੋਣ ‘${option}’ ਮੈਂਬਰਤਾ, ਹਟਾਉਣ ਜਾਂ ਪੂਰੀ ਸੰਭਵ ਸੂਚੀ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਮੰਨਦੀ।`,
  };
}

const HINDI = makePack("hi-IN", HI);
const PUNJABI = makePack("pa-IN", PA);

export function getCp009LanguagePack(locale: CodTranslatedLocale): Cp009LanguagePack {
  return locale === "hi-IN" ? HINDI : PUNJABI;
}

export const CP009_ENGLISH_LEXEMES = Object.keys(HI) as readonly string[];
