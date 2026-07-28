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
  rivers: "ਦਰਿਆ", flow: "ਵਗਦੇ ਹਨ", merge: "ਮਿਲਦੇ ਹਨ", quickly: "ਤੇਜ਼ੀ ਨਾਲ", daily: "ਹਰ ਰੋਜ਼", adults: "ਬਾਲਗ", sweetly: "ਮਿੱਠੇ ਸੁਰ ਵਿੱਚ",
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

function stringArray(value: unknown): string[] {
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
      const englishWords = words.map((word) => reverse.get(word) ?? word);
      const localizedWords = englishWords.map((word) => map[word] ?? word);
      const parts = englishWords.map((word, index) => ({
        localized: localizedWords[index]!,
        partOfSpeech: getEnglishSentenceCodeLexeme(word).partOfSpeech,
      }));
      const verbs = parts.filter((entry) => entry.partOfSpeech === "VERB").map((entry) => entry.localized);
      if (verbs.length === 0) {
        return listText(parts.filter((entry) => entry.partOfSpeech !== "CONJUNCTION").map((entry) => entry.localized), conjunction);
      }
      const nonVerbs = parts.filter((entry) => entry.partOfSpeech !== "VERB" && entry.partOfSpeech !== "CONJUNCTION").map((entry) => entry.localized);
      return [...nonVerbs, ...verbs].join(" ").replace(/\s+/gu, " ").trim();
    },
    prefix,
    stem(prototypeId, prompt, style) {
      const targetWord = String(prompt.targetWord ?? "");
      const targetToken = String(prompt.targetToken ?? "");
      const targetWords = stringArray(prompt.targetWords);
      const targetTokens = stringArray(prompt.targetTokens);
      const phraseWords = stringArray(prompt.phraseWords);
      const phraseTokens = stringArray(prompt.phraseTokens);
      const wordSet = listText(targetWords.length ? targetWords : phraseWords, conjunction);
      const tokenSet = (targetTokens.length ? targetTokens : phraseTokens).join(", ");
      const q = hi ? {
        wordToken: `‘${targetWord}’ का कोड शब्द कौन-सा है?`, tokenWord: `कोड ‘${targetToken}’ किस शब्द को दर्शाता है?`,
        phraseToken: `शब्द-समूह ${wordSet} के लिए सही कोड-समूह कौन-सा है?`, tokenPhrase: `कोड-समूह ${tokenSet} किन शब्दों को दर्शाता है?`,
        missingToken: `अधूरे कोड में खाली स्थान पर कौन-सा कोड शब्द आएगा?`, missingWord: `अधूरे वाक्य में खाली स्थान पर कौन-सा शब्द आएगा?`,
        possibleWT: `‘${targetWord}’ का कौन-सा कोड संभव हो सकता है?`, possibleTW: `कोड ‘${targetToken}’ किस शब्द के लिए संभव हो सकता है?`,
        impossibleWT: `‘${targetWord}’ का कौन-सा कोड संभव नहीं हो सकता?`, impossibleTW: `कोड ‘${targetToken}’ किस शब्द को दर्शा नहीं सकता?`,
        possibleSetWT: `${wordSet} के लिए कौन-सा कोड-समूह संभव हो सकता है?`, possibleSetTW: `${tokenSet} किस शब्द-समूह को दर्शा सकता है?`,
        resolvedWT: `${wordSet} के लिए निश्चित कोड-समूह चुनिए।`, resolvedTW: `${tokenSet} के लिए निश्चित शब्द-समूह चुनिए।`,
        completeWT: `‘${targetWord}’ के सभी संभव कोडों का पूरा समूह कौन-सा है?`, completeTW: `कोड ‘${targetToken}’ से दर्शाए जा सकने वाले सभी शब्दों का पूरा समूह कौन-सा है?`,
      } : {
        wordToken: `‘${targetWord}’ ਦਾ ਕੋਡ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`, tokenWord: `ਕੋਡ ‘${targetToken}’ ਕਿਹੜੇ ਸ਼ਬਦ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
        phraseToken: `ਸ਼ਬਦ-ਸਮੂਹ ${wordSet} ਲਈ ਸਹੀ ਕੋਡ-ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`, tokenPhrase: `ਕੋਡ-ਸਮੂਹ ${tokenSet} ਕਿਹੜੇ ਸ਼ਬਦਾਂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
        missingToken: `ਅਧੂਰੇ ਕੋਡ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਕੋਡ ਸ਼ਬਦ ਆਵੇਗਾ?`, missingWord: `ਅਧੂਰੇ ਵਾਕ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?`,
        possibleWT: `‘${targetWord}’ ਦਾ ਕਿਹੜਾ ਕੋਡ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?`, possibleTW: `ਕੋਡ ‘${targetToken}’ ਕਿਸ ਸ਼ਬਦ ਲਈ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?`,
        impossibleWT: `‘${targetWord}’ ਦਾ ਕਿਹੜਾ ਕੋਡ ਸੰਭਵ ਨਹੀਂ ਹੋ ਸਕਦਾ?`, impossibleTW: `ਕੋਡ ‘${targetToken}’ ਕਿਹੜੇ ਸ਼ਬਦ ਨੂੰ ਦਰਸਾ ਨਹੀਂ ਸਕਦਾ?`,
        possibleSetWT: `${wordSet} ਲਈ ਕਿਹੜਾ ਕੋਡ-ਸਮੂਹ ਸੰਭਵ ਹੋ ਸਕਦਾ ਹੈ?`, possibleSetTW: `${tokenSet} ਕਿਹੜੇ ਸ਼ਬਦ-ਸਮੂਹ ਨੂੰ ਦਰਸਾ ਸਕਦਾ ਹੈ?`,
        resolvedWT: `${wordSet} ਲਈ ਪੱਕਾ ਕੋਡ-ਸਮੂਹ ਚੁਣੋ।`, resolvedTW: `${tokenSet} ਲਈ ਪੱਕਾ ਸ਼ਬਦ-ਸਮੂਹ ਚੁਣੋ।`,
        completeWT: `‘${targetWord}’ ਦੇ ਸਾਰੇ ਸੰਭਵ ਕੋਡਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`, completeTW: `ਕੋਡ ‘${targetToken}’ ਨਾਲ ਦਰਸਾਏ ਜਾ ਸਕਣ ਵਾਲੇ ਸਾਰੇ ਸ਼ਬਦਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`,
      };
      let ending: string;
      if (prototypeId.includes("EXACT-WORD-TO-TOKEN")) ending = q.wordToken;
      else if (prototypeId.includes("EXACT-TOKEN-TO-WORD")) ending = q.tokenWord;
      else if (prototypeId.includes("EXACT-PHRASE-TO-TOKENS")) ending = q.phraseToken;
      else if (prototypeId.includes("EXACT-TOKENS-TO-PHRASE")) ending = q.tokenPhrase;
      else if (prototypeId.includes("MISSING-TOKEN")) ending = q.missingToken;
      else if (prototypeId.includes("MISSING-WORD")) ending = q.missingWord;
      else if (prototypeId.includes("POSSIBLE-WORD-TO-TOKEN")) ending = q.possibleWT;
      else if (prototypeId.includes("POSSIBLE-TOKEN-TO-WORD")) ending = q.possibleTW;
      else if (prototypeId.includes("IMPOSSIBLE-WORD-TO-TOKEN")) ending = q.impossibleWT;
      else if (prototypeId.includes("IMPOSSIBLE-TOKEN-TO-WORD")) ending = q.impossibleTW;
      else if (prototypeId.includes("POSSIBLE-WORD-SET-TO-TOKENS")) ending = q.possibleSetWT;
      else if (prototypeId.includes("POSSIBLE-TOKEN-SET-TO-WORDS")) ending = q.possibleSetTW;
      else if (prototypeId.includes("EXACT-RESOLVED-WORDS-TO-TOKENS")) ending = q.resolvedWT;
      else if (prototypeId.includes("EXACT-RESOLVED-TOKENS-TO-WORDS")) ending = q.resolvedTW;
      else if (prototypeId.includes("COMPLETE-CODE-CANDIDATE-SET")) ending = q.completeWT;
      else if (prototypeId.includes("COMPLETE-WORD-CANDIDATE-SET")) ending = q.completeTW;
      else throw new Error(`Unsupported CP-009 prototype '${prototypeId}'`);
      const bridge = hi
        ? ["इन कथनों से संबंध निकालकर उत्तर दीजिए।", "साझा शब्दों और साझा कोडों की तुलना कीजिए।", "सभी संभव मिलानों को ध्यान में रखिए।"][style % 3]!
        : ["ਇਨ੍ਹਾਂ ਕਥਨਾਂ ਤੋਂ ਸੰਬੰਧ ਕੱਢ ਕੇ ਜਵਾਬ ਦਿਓ।", "ਸਾਂਝੇ ਸ਼ਬਦਾਂ ਅਤੇ ਸਾਂਝੇ ਕੋਡਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।", "ਸਾਰੇ ਸੰਭਵ ਮਿਲਾਣਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ।"][style % 3]!;
      return `${prefix} ${bridge} ${ending}`;
    },
    referenceAid: hi
      ? ["हर वाक्य के शब्दों के समूह की तुलना उसके कोड शब्दों के समूह से करें।", "कोड शब्दों का क्रम महत्वपूर्ण नहीं है; साझा सदस्य और बाहर हुए सदस्य महत्वपूर्ण हैं।"]
      : ["ਹਰ ਵਾਕ ਦੇ ਸ਼ਬਦਾਂ ਦੇ ਸਮੂਹ ਦੀ ਤੁਲਨਾ ਉਸ ਦੇ ਕੋਡ ਸ਼ਬਦਾਂ ਦੇ ਸਮੂਹ ਨਾਲ ਕਰੋ।", "ਕੋਡ ਸ਼ਬਦਾਂ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ; ਸਾਂਝੇ ਅਤੇ ਬਾਹਰ ਹੋਏ ਮੈਂਬਰ ਮਹੱਤਵਪੂਰਨ ਹਨ।"],
    quickMethod: hi
      ? "साझा वाक्यों का प्रतिच्छेद लें, अलग सदस्यों को हटाएँ और बची सभी वैध एक-से-एक मैपिंगों से विकल्प जांचें।"
      : "ਸਾਂਝੇ ਵਾਕਾਂ ਦਾ ਮਿਲਾਪ ਵੇਖੋ, ਵੱਖ ਮੈਂਬਰ ਹਟਾਓ ਅਤੇ ਬਚੀਆਂ ਸਾਰੀਆਂ ਠੀਕ ਇੱਕ-ਤੋਂ-ਇੱਕ ਮੈਪਿੰਗਾਂ ਨਾਲ ਚੋਣਾਂ ਜਾਂਚੋ।",
    ruleStatement: hi
      ? "हर दिखाई देने वाला शब्द एक ही कोड शब्द से जुड़ा है और हर कोड शब्द एक ही शब्द को दर्शाता है।"
      : "ਹਰ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਸ਼ਬਦ ਇੱਕੋ ਕੋਡ ਸ਼ਬਦ ਨਾਲ ਜੁੜਿਆ ਹੈ ਅਤੇ ਹਰ ਕੋਡ ਸ਼ਬਦ ਇੱਕੋ ਸ਼ਬਦ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।",
    rowEvidence: hi
      ? (sentence, code) => `वाक्य ‘${sentence}’ के कोड सदस्य हैं: ${code}।`
      : (sentence, code) => `ਵਾਕ ‘${sentence}’ ਦੇ ਕੋਡ ਮੈਂਬਰ ਹਨ: ${code}।`,
    targetResult: hi
      ? (answer, style) => [`सभी वैध मिलानों की जांच से लक्ष्य का परिणाम ‘${answer}’ मिलता है।`, `प्रतिच्छेद और निष्कासन के बाद सही विकल्प ‘${answer}’ बचता है।`, `दिए गए सभी कथनों से संगत परिणाम ‘${answer}’ है।`][style % 3]!
      : (answer, style) => [`ਸਾਰੀਆਂ ਠੀਕ ਮੈਪਿੰਗਾਂ ਦੀ ਜਾਂਚ ਨਾਲ ਨਿਸ਼ਾਨੇ ਦਾ ਨਤੀਜਾ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`, `ਮਿਲਾਪ ਅਤੇ ਹਟਾਉਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਚੋਣ ‘${answer}’ ਬਚਦੀ ਹੈ।`, `ਦਿੱਤੇ ਸਾਰੇ ਕਥਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਨਤੀਜਾ ‘${answer}’ ਹੈ।`][style % 3]!,
    conclusion: hi
      ? (answer, style) => [`अतः सही उत्तर ‘${answer}’ है।`, `इसलिए चुना जाने वाला विकल्प ‘${answer}’ है।`, `अंतिम उत्तर ‘${answer}’ प्राप्त होता है।`][style % 3]!
      : (answer, style) => [`ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ‘${answer}’ ਹੈ।`, `ਚੁਣੀ ਜਾਣ ਵਾਲੀ ਚੋਣ ‘${answer}’ ਹੈ।`, `ਆਖਰੀ ਜਵਾਬ ‘${answer}’ ਮਿਲਦਾ ਹੈ।`][style % 3]!,
    trap: hi
      ? (option) => `विकल्प ‘${option}’ किसी कथन की सदस्यता, निष्कासन या पूरी संभावित सूची को सही प्रकार नहीं मानता।`
      : (option) => `ਚੋਣ ‘${option}’ ਕਿਸੇ ਵਾਕ ਦੀ ਮੈਂਬਰਤਾ, ਹਟਾਉਣ ਜਾਂ ਪੂਰੀ ਸੰਭਵ ਸੂਚੀ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਮੰਨਦੀ।`,
  };
}

const HINDI = makePack("hi-IN", HI);
const PUNJABI = makePack("pa-IN", PA);

export function getCp009LanguagePack(locale: CodTranslatedLocale): Cp009LanguagePack {
  return locale === "hi-IN" ? HINDI : PUNJABI;
}

export const CP009_ENGLISH_LEXEMES = Object.keys(HI) as readonly string[];
