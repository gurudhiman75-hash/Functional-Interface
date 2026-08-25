import { generateNumCp012Permanent, type NumCp012PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp012PermanentQlId } from "../permanent-allocation.ts";
import type {
  NumCp012LocalizedLanguage,
  NumCp012LocalizedLocale,
  NumCp012LocalizedPackage,
} from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type LocalizedContent = Readonly<{
  stem: string;
  coreConcept: string;
  strategy: string;
  steps: readonly string[];
}>;

function choose(language: NumCp012LocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function localeFor(language: NumCp012LocalizedLanguage): NumCp012LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function value(state: State, key: string): unknown {
  if (!(key in state)) throw new Error(`Missing CP012 state field ${key}`);
  return state[key];
}

function text(state: State, key: string): string {
  const item = value(state, key);
  return typeof item === "bigint" ? item.toString() : String(item);
}

function numberValue(state: State, key: string): number {
  const item = value(state, key);
  const parsed = typeof item === "number" ? item : Number(item);
  if (!Number.isFinite(parsed)) throw new Error(`Expected numeric CP012 state field ${key}`);
  return parsed;
}

function numberList(state: State, key: string): number[] {
  const item = value(state, key);
  if (!Array.isArray(item)) throw new Error(`Expected array CP012 state field ${key}`);
  return item.map((entry) => Number(entry));
}

function factorPairs(state: State, key = "factors"): Array<readonly [string, number]> {
  const item = value(state, key);
  if (!Array.isArray(item)) throw new Error(`Expected factor array ${key}`);
  return item.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2) throw new Error(`Malformed factor pair in ${key}`);
    return [String(entry[0]), Number(entry[1])] as const;
  });
}

function factorText(factors: readonly (readonly [string, number])[]): string {
  return factors.map(([prime, exponent]) => exponent === 1 ? prime : `${prime}^${exponent}`).join(" × ");
}

function powerLabel(k: number, language: NumCp012LocalizedLanguage): string {
  if (k === 2) return choose(language, "पूर्ण वर्ग", "ਪੂਰਨ ਵਰਗ");
  if (k === 3) return choose(language, "पूर्ण घन", "ਪੂਰਨ ਘਨ");
  return choose(language, `पूर्ण ${k}वीं घात`, `ਪੂਰਨ ${k}ਵੀਂ ਘਾਤ`);
}

function rootLabel(k: number, language: NumCp012LocalizedLanguage): string {
  if (k === 2) return choose(language, "वर्गमूल", "ਵਰਗਮੂਲ");
  if (k === 3) return choose(language, "घनमूल", "ਘਨਮੂਲ");
  return choose(language, `${k}वाँ पूर्णांक मूल`, `${k}ਵਾਂ ਪੂਰਨ ਅੰਕ ਮੂਲ`);
}

function localizedAnswer(answer: string, language: NumCp012LocalizedLanguage): string {
  switch (answer) {
    case "NO_INTEGER_ROOT":
      return choose(language, "कोई पूर्णांक मूल नहीं", "ਕੋਈ ਪੂਰਨ ਅੰਕ ਮੂਲ ਨਹੀਂ");
    case "NO_SOLUTION":
      return choose(language, "कोई समाधान नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ");
    case "ONE_SOLUTION":
      return choose(language, "एक समाधान", "ਇੱਕ ਹੱਲ");
    case "MULTIPLE_SOLUTIONS":
      return choose(language, "एक से अधिक समाधान", "ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ");
    case "ALL_VALUES":
      return choose(language, "सभी मान", "ਸਾਰੇ ਮੁੱਲ");
    default:
      return answer;
  }
}

function content(q: NumCp012PermanentPackage, language: NumCp012LocalizedLanguage): LocalizedContent {
  const s = q.hiddenState as State;
  const L = (hi: string, pa: string) => choose(language, hi, pa);

  switch (q.temporaryPrototypeId) {
    case "NUM-CP012-PROT-001": {
      const k = numberValue(s, "k");
      const perfect = text(s, "perfect");
      const factors = factorPairs(s);
      return {
        stem: L(`निम्न विकल्पों में कौन-सी संख्या ${powerLabel(k, language)} है?`, `ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਚੋਣਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਖਿਆ ${powerLabel(k, language)} ਹੈ?`),
        coreConcept: L(`${powerLabel(k, language)} में हर अभाज्य गुणनखंड की घात ${k} से विभाज्य होती है।`, `${powerLabel(k, language)} ਵਿੱਚ ਹਰ ਅਭਾਜ ਗੁਣਨਖੰਡ ਦੀ ਘਾਤ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੁੰਦੀ ਹੈ।`),
        strategy: L("हर विकल्प का अभाज्य गुणनखंडन जाँचें; केवल पास की संख्या होना पर्याप्त नहीं है।", "ਹਰ ਚੋਣ ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ਜਾਂਚੋ; ਸਿਰਫ਼ ਨੇੜਲੀ ਸੰਖਿਆ ਹੋਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।"),
        steps: [
          L(`${perfect} = ${factorText(factors)} और इसकी सभी घातें ${k} से विभाज्य हैं।`, `${perfect} = ${factorText(factors)} ਅਤੇ ਇਸ ਦੀਆਂ ਸਾਰੀਆਂ ਘਾਤਾਂ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹਨ।`),
          L(`इसलिए सही संख्या ${perfect} है।`, `ਇਸ ਲਈ ਸਹੀ ਸੰਖਿਆ ${perfect} ਹੈ।`),
        ],
      };
    }
    case "NUM-CP012-PROT-002": {
      const k = numberValue(s, "k");
      const root = text(s, "root");
      const target = text(s, "value");
      return {
        stem: L(`${target} का सटीक पूर्णांक ${rootLabel(k, language)} ज्ञात कीजिए।`, `${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਕੱਢੋ।`),
        coreConcept: L(`सटीक ${rootLabel(k, language)} वह पूर्णांक है जिसकी ${k}वीं घात दी गई संख्या के बराबर हो।`, `ਸਹੀ ${rootLabel(k, language)} ਉਹ ਪੂਰਨ ਅੰਕ ਹੈ ਜਿਸ ਦੀ ${k}ਵੀਂ ਘਾਤ ਦਿੱਤੀ ਸੰਖਿਆ ਦੇ ਬਰਾਬਰ ਹੋਵੇ।`),
        strategy: L("दशमलव अनुमान के बजाय पूर्णांक घात से जाँच करें।", "ਦਸ਼ਮਲਵ ਅੰਦਾਜ਼ੇ ਦੀ ਥਾਂ ਪੂਰਨ ਅੰਕ ਘਾਤ ਨਾਲ ਜਾਂਚ ਕਰੋ।"),
        steps: [L(`${root}^${k} = ${target}.`, `${root}^${k} = ${target}.`), L(`अतः उत्तर ${root} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${root} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-003": {
      const k = numberValue(s, "k");
      const n = text(s, "value");
      const factors = factorPairs(s);
      return {
        stem: L(`${n} को किस न्यूनतम धनात्मक पूर्णांक से गुणा करें ताकि गुणनफल ${powerLabel(k, language)} बन जाए?`, `${n} ਨੂੰ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਗੁਣਾ ਕਰੀਏ ਤਾਂ ਜੋ ਗੁਣਨਫਲ ${powerLabel(k, language)} ਬਣ ਜਾਵੇ?`),
        coreConcept: L(`हर अभाज्य घात को ${k} के अगले गुणज तक पूरा करना होता है।`, `ਹਰ ਅਭਾਜ ਘਾਤ ਨੂੰ ${k} ਦੇ ਅਗਲੇ ਗੁਣਜ ਤੱਕ ਪੂਰਾ ਕਰਨਾ ਹੁੰਦਾ ਹੈ।`),
        strategy: L(`हर घात का ${k} से शेष देखें और केवल आवश्यक पूरक अभाज्य गुणक जोड़ें।`, `ਹਰ ਘਾਤ ਦਾ ${k} ਨਾਲ ਬਾਕੀ ਵੇਖੋ ਅਤੇ ਸਿਰਫ਼ ਲੋੜੀਂਦੇ ਪੂਰਕ ਅਭਾਜ ਗੁਣਕ ਜੋੜੋ।`),
        steps: [L(`${n} = ${factorText(factors)}.`, `${n} = ${factorText(factors)}.`), L(`सभी अधूरी घातों को पूरा करने वाला न्यूनतम गुणक ${q.canonicalAnswer} है।`, `ਸਾਰੀਆਂ ਅਧੂਰੀਆਂ ਘਾਤਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਘੱਟੋ-ਘੱਟ ਗੁਣਕ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-004": {
      const k = numberValue(s, "k");
      const n = text(s, "value");
      const factors = factorPairs(s);
      const quotient = text(s, "quotient");
      return {
        stem: L(`${n} को किस न्यूनतम धनात्मक पूर्णांक से भाग दें ताकि भागफल ${powerLabel(k, language)} हो?`, `${n} ਨੂੰ ਕਿਹੜੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਨਾਲ ਭਾਗ ਦੇਈਏ ਤਾਂ ਜੋ ਭਾਗਫਲ ${powerLabel(k, language)} ਹੋਵੇ?`),
        coreConcept: L(`भाग देने पर हर अभाज्य घात का ${k} से बचा शेष हटाना होता है।`, `ਭਾਗ ਦੇਣ ਵੇਲੇ ਹਰ ਅਭਾਜ ਘਾਤ ਦਾ ${k} ਨਾਲ ਬਚਿਆ ਬਾਕੀ ਹਟਾਉਣਾ ਹੁੰਦਾ ਹੈ।`),
        strategy: L("गुणक वाला पूरक न लें; प्रत्येक घात में मौजूद अतिरिक्त शेष को ही हटाएँ।", "ਗੁਣਕ ਵਾਲਾ ਪੂਰਕ ਨਾ ਲਵੋ; ਹਰ ਘਾਤ ਵਿੱਚ ਮੌਜੂਦ ਵਾਧੂ ਬਾਕੀ ਨੂੰ ਹੀ ਹਟਾਓ।"),
        steps: [L(`${n} = ${factorText(factors)}.`, `${n} = ${factorText(factors)}.`), L(`न्यूनतम भाजक ${q.canonicalAnswer} है और भागफल ${quotient} सटीक ${powerLabel(k, language)} है।`, `ਘੱਟੋ-ਘੱਟ ਭਾਜਕ ${q.canonicalAnswer} ਹੈ ਅਤੇ ਭਾਗਫਲ ${quotient} ਸਹੀ ${powerLabel(k, language)} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-005": {
      const k = numberValue(s, "k");
      const fixedPrime = text(s, "fixedPrime");
      const fixedExponent = numberValue(s, "fixedExponent");
      const prime = text(s, "prime");
      const low = numberValue(s, "low");
      const high = numberValue(s, "high");
      return {
        stem: L(`${fixedPrime}^${fixedExponent} × ${prime}^x एक ${powerLabel(k, language)} है। यदि ${low} ≤ x ≤ ${high}, तो x ज्ञात कीजिए।`, `${fixedPrime}^${fixedExponent} × ${prime}^x ਇੱਕ ${powerLabel(k, language)} ਹੈ। ਜੇ ${low} ≤ x ≤ ${high}, ਤਾਂ x ਕੱਢੋ।`),
        coreConcept: L(`${powerLabel(k, language)} के लिए हर अभाज्य घात ${k} से विभाज्य होनी चाहिए।`, `${powerLabel(k, language)} ਲਈ ਹਰ ਅਭਾਜ ਘਾਤ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`),
        strategy: L(`दी गई सीमा में ${k} के गुणज घातों को जाँचें और पूर्ण गुणनखंडन सत्यापित करें।`, `ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ${k} ਦੇ ਗੁਣਜ ਘਾਤਾਂ ਨੂੰ ਜਾਂਚੋ ਅਤੇ ਪੂਰਾ ਗੁਣਨਖੰਡਨ ਤਸਦੀਕ ਕਰੋ।`),
        steps: [L(`स्थिर घात ${fixedExponent} पहले से ${k} से विभाज्य है।`, `ਸਥਿਰ ਘਾਤ ${fixedExponent} ਪਹਿਲਾਂ ਹੀ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੈ।`), L(`सीमा में उपयुक्त x = ${q.canonicalAnswer} है।`, `ਹੱਦ ਵਿੱਚ ਢੁੱਕਵਾਂ x = ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-006": {
      const k = numberValue(s, "k");
      const n = text(s, "value");
      const factors = factorPairs(s);
      return {
        stem: L(`${n} का सबसे बड़ा भाजक ज्ञात कीजिए जो ${powerLabel(k, language)} हो।`, `${n} ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਭਾਜਕ ਕੱਢੋ ਜੋ ${powerLabel(k, language)} ਹੋਵੇ।`),
        coreConcept: L(`सबसे बड़े ${powerLabel(k, language)} भाजक में हर अभाज्य घात ${k} का सबसे बड़ा ऐसा गुणज लिया जाता है जो मूल घात से अधिक न हो।`, `ਸਭ ਤੋਂ ਵੱਡੇ ${powerLabel(k, language)} ਭਾਜਕ ਵਿੱਚ ਹਰ ਅਭਾਜ ਘਾਤ ਲਈ ${k} ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਉਹ ਗੁਣਜ ਲਿਆ ਜਾਂਦਾ ਹੈ ਜੋ ਮੂਲ ਘਾਤ ਤੋਂ ਵੱਧ ਨਾ ਹੋਵੇ।`),
        strategy: L(`हर अभाज्य घात को ${k} के निकटतम छोटे या बराबर गुणज तक नीचे करें।`, `ਹਰ ਅਭਾਜ ਘਾਤ ਨੂੰ ${k} ਦੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਛੋਟੇ ਜਾਂ ਬਰਾਬਰ ਗੁਣਜ ਤੱਕ ਘਟਾਓ।`),
        steps: [L(`${n} = ${factorText(factors)}.`, `${n} = ${factorText(factors)}.`), L(`उचित घातें रखने पर सबसे बड़ा ऐसा भाजक ${q.canonicalAnswer} मिलता है।`, `ਢੁੱਕਵੀਆਂ ਘਾਤਾਂ ਰੱਖਣ ਨਾਲ ਸਭ ਤੋਂ ਵੱਡਾ ਐਸਾ ਭਾਜਕ ${q.canonicalAnswer} ਮਿਲਦਾ ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-007": {
      const k = numberValue(s, "k");
      const low = text(s, "low");
      const high = text(s, "high");
      const firstRoot = text(s, "firstRoot");
      const highRoot = text(s, "highRoot");
      return {
        stem: L(`${low} से ${high} तक, दोनों सिरों सहित, कितने ${k === 2 ? "पूर्ण वर्ग" : "पूर्ण घन"} हैं?`, `${low} ਤੋਂ ${high} ਤੱਕ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਕਿੰਨੇ ${k === 2 ? "ਪੂਰਨ ਵਰਗ" : "ਪੂਰਨ ਘਨ"} ਹਨ?`),
        coreConcept: L("सीमा में पूर्ण घातों की गिनती, उन पूर्णांक मूलों की गिनती है जिनकी घातें सीमा में आती हैं।", "ਹੱਦ ਵਿੱਚ ਪੂਰਨ ਘਾਤਾਂ ਦੀ ਗਿਣਤੀ ਉਹਨਾਂ ਪੂਰਨ ਅੰਕ ਮੂਲਾਂ ਦੀ ਗਿਣਤੀ ਹੈ ਜਿਨ੍ਹਾਂ ਦੀਆਂ ਘਾਤਾਂ ਹੱਦ ਵਿੱਚ ਆਉਂਦੀਆਂ ਹਨ।"),
        strategy: L("पहला स्वीकार्य मूल और अंतिम स्वीकार्य मूल निकालकर समावेशी गिनती करें।", "ਪਹਿਲਾ ਮਨਜ਼ੂਰ ਮੂਲ ਅਤੇ ਆਖਰੀ ਮਨਜ਼ੂਰ ਮੂਲ ਕੱਢ ਕੇ ਸਮੇਤ ਗਿਣਤੀ ਕਰੋ।"),
        steps: [L(`पहला मूल ${firstRoot} और अंतिम मूल ${highRoot} है।`, `ਪਹਿਲਾ ਮੂਲ ${firstRoot} ਅਤੇ ਆਖਰੀ ਮੂਲ ${highRoot} ਹੈ।`), L(`इसलिए कुल संख्या ${q.canonicalAnswer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਗਿਣਤੀ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-008": {
      const k = numberValue(s, "k");
      const direction = text(s, "direction");
      const n = text(s, "n");
      const boundary = text(s, "boundary");
      const add = direction === "ADD";
      return {
        stem: add
          ? L(`${n} में न्यूनतम कितनी गैर-ऋणात्मक संख्या जोड़ें ताकि परिणाम ${powerLabel(k, language)} हो?`, `${n} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀ ਗੈਰ-ਰਿਣਾਤਮਕ ਸੰਖਿਆ ਜੋੜੀਏ ਤਾਂ ਜੋ ਨਤੀਜਾ ${powerLabel(k, language)} ਹੋਵੇ?`)
          : L(`${n} में से न्यूनतम कितनी गैर-ऋणात्मक संख्या घटाएँ ताकि परिणाम ${powerLabel(k, language)} हो?`, `${n} ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀ ਗੈਰ-ਰਿਣਾਤਮਕ ਸੰਖਿਆ ਘਟਾਈਏ ਤਾਂ ਜੋ ਨਤੀਜਾ ${powerLabel(k, language)} ਹੋਵੇ?`),
        coreConcept: L("यह निकटवर्ती सटीक पूर्ण घात की सीमा तक पहुँचने का प्रश्न है।", "ਇਹ ਨੇੜਲੀ ਸਹੀ ਪੂਰਨ ਘਾਤ ਦੀ ਹੱਦ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਵਾਲ ਹੈ।"),
        strategy: add ? L("अगली कम-से-कम उतनी ही बड़ी पूर्ण घात लें और अंतर निकालें।", "ਅਗਲੀ ਘੱਟੋ-ਘੱਟ ਉਤਨੀ ਹੀ ਵੱਡੀ ਪੂਰਨ ਘਾਤ ਲਵੋ ਅਤੇ ਅੰਤਰ ਕੱਢੋ।") : L("पिछली अधिक-से-अधिक उतनी ही छोटी पूर्ण घात लें और अंतर निकालें।", "ਪਿਛਲੀ ਵੱਧ ਤੋਂ ਵੱਧ ਉਤਨੀ ਹੀ ਛੋਟੀ ਪੂਰਨ ਘਾਤ ਲਵੋ ਅਤੇ ਅੰਤਰ ਕੱਢੋ।"),
        steps: [L(`संबंधित पूर्ण घात की सीमा ${boundary} है।`, `ਸੰਬੰਧਿਤ ਪੂਰਨ ਘਾਤ ਦੀ ਹੱਦ ${boundary} ਹੈ।`), L(`आवश्यक अंतर ${q.canonicalAnswer} है।`, `ਲੋੜੀਂਦਾ ਅੰਤਰ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-009": {
      const k = numberValue(s, "k");
      const target = text(s, "value");
      const noRoot = q.canonicalAnswer === "NO_INTEGER_ROOT";
      return {
        stem: L(`${target} का सटीक पूर्णांक ${rootLabel(k, language)} ज्ञात कीजिए; यदि ऐसा पूर्णांक नहीं है तो वही बताइए।`, `${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਕੱਢੋ; ਜੇ ਐਸਾ ਪੂਰਨ ਅੰਕ ਨਹੀਂ ਹੈ ਤਾਂ ਇਹ ਦੱਸੋ।`),
        coreConcept: L(`पूर्णांक मूल को ${k}वीं घात करने पर लक्ष्य ठीक-ठीक मिलना चाहिए। ऋणात्मक संख्या की सम घात का पूर्णांक मूल नहीं होता।`, `ਪੂਰਨ ਅੰਕ ਮੂਲ ਨੂੰ ${k}ਵੀਂ ਘਾਤ ਕਰਨ ਤੇ ਨਿਸ਼ਾਨਾ ਬਿਲਕੁਲ ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ। ਰਿਣਾਤਮਕ ਸੰਖਿਆ ਦਾ ਸਮ ਘਾਤ ਵਾਲਾ ਪੂਰਨ ਅੰਕ ਮੂਲ ਨਹੀਂ ਹੁੰਦਾ।`),
        strategy: L("पहले चिन्ह और घात की सम/विषम प्रकृति जाँचें, फिर सटीक पूर्णांक घात से सत्यापन करें।", "ਪਹਿਲਾਂ ਚਿੰਨ੍ਹ ਅਤੇ ਘਾਤ ਦੀ ਸਮ/ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਜਾਂਚੋ, ਫਿਰ ਸਹੀ ਪੂਰਨ ਅੰਕ ਘਾਤ ਨਾਲ ਤਸਦੀਕ ਕਰੋ।"),
        steps: noRoot
          ? [L(`लक्ष्य ${target} ऋणात्मक है और घात ${k} सम है।`, `ਨਿਸ਼ਾਨਾ ${target} ਰਿਣਾਤਮਕ ਹੈ ਅਤੇ ਘਾਤ ${k} ਸਮ ਹੈ।`), L("इसलिए कोई पूर्णांक मूल नहीं है।", "ਇਸ ਲਈ ਕੋਈ ਪੂਰਨ ਅੰਕ ਮੂਲ ਨਹੀਂ ਹੈ।")]
          : [L(`लक्ष्य ${target} के लिए सटीक पूर्णांक मूल ${q.canonicalAnswer} है।`, `ਨਿਸ਼ਾਨਾ ${target} ਲਈ ਸਹੀ ਪੂਰਨ ਅੰਕ ਮੂਲ ${q.canonicalAnswer} ਹੈ।`), L(`${q.canonicalAnswer}^${k} = ${target}, इसलिए उत्तर सत्यापित है।`, `${q.canonicalAnswer}^${k} = ${target}, ਇਸ ਲਈ ਉੱਤਰ ਤਸਦੀਕ ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-010": {
      const k = numberValue(s, "k");
      const direction = text(s, "direction");
      const bound = text(s, "bound");
      const lower = text(s, "lower");
      const upper = text(s, "upper");
      const atMost = direction === "AT_MOST";
      return {
        stem: atMost
          ? L(`${bound} से अधिक न होने वाला सबसे बड़ा ${powerLabel(k, language)} कौन-सा है?`, `${bound} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ${powerLabel(k, language)} ਕਿਹੜਾ ਹੈ?`)
          : L(`${bound} से कम न होने वाला सबसे छोटा ${powerLabel(k, language)} कौन-सा है?`, `${bound} ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ${powerLabel(k, language)} ਕਿਹੜਾ ਹੈ?`),
        coreConcept: L("यह प्रश्न मूल नहीं, सीमा की सही पूर्ण-घात संख्या पूछता है।", "ਇਹ ਸਵਾਲ ਮੂਲ ਨਹੀਂ, ਹੱਦ ਵਾਲੀ ਸਹੀ ਪੂਰਨ-ਘਾਤ ਸੰਖਿਆ ਪੁੱਛਦਾ ਹੈ।"),
        strategy: L("दी गई सीमा के आसपास की लगातार दो पूर्ण घातें पहचानें और माँगी गई दिशा वाली संख्या चुनें।", "ਦਿੱਤੀ ਹੱਦ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੀਆਂ ਲਗਾਤਾਰ ਦੋ ਪੂਰਨ ਘਾਤਾਂ ਪਛਾਣੋ ਅਤੇ ਮੰਗੀ ਦਿਸ਼ਾ ਵਾਲੀ ਸੰਖਿਆ ਚੁਣੋ।"),
        steps: [L(`आसपास की पूर्ण घातें ${lower} और ${upper} हैं।`, `ਆਲੇ-ਦੁਆਲੇ ਦੀਆਂ ਪੂਰਨ ਘਾਤਾਂ ${lower} ਅਤੇ ${upper} ਹਨ।`), L(`माँगी गई दिशा में सही सीमा-मान ${q.canonicalAnswer} है।`, `ਮੰਗੀ ਦਿਸ਼ਾ ਵਿੱਚ ਸਹੀ ਹੱਦ-ਮੁੱਲ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-011": {
      const k = numberValue(s, "k");
      const n = text(s, "value");
      const lower = text(s, "lower");
      const upper = text(s, "upper");
      const ld = text(s, "lowerDistance");
      const ud = text(s, "upperDistance");
      return {
        stem: L(`${n} के सबसे निकट कौन-सा ${powerLabel(k, language)} है?`, `${n} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜਾ ${powerLabel(k, language)} ਹੈ?`),
        coreConcept: L("निकटतम पूर्ण घात के लिए नीचे और ऊपर की लगातार पूर्ण घातों से दूरी की तुलना करें।", "ਸਭ ਤੋਂ ਨੇੜਲੀ ਪੂਰਨ ਘਾਤ ਲਈ ਹੇਠਲੀ ਅਤੇ ਉੱਪਰਲੀ ਲਗਾਤਾਰ ਪੂਰਨ ਘਾਤਾਂ ਤੋਂ ਦੂਰੀ ਦੀ ਤੁਲਨਾ ਕਰੋ।"),
        strategy: L("दोनों सीमाओं तक अंतर निकालें; छोटा अंतर निकटतम पूर्ण घात तय करता है।", "ਦੋਵੇਂ ਹੱਦਾਂ ਤੱਕ ਅੰਤਰ ਕੱਢੋ; ਛੋਟਾ ਅੰਤਰ ਸਭ ਤੋਂ ਨੇੜਲੀ ਪੂਰਨ ਘਾਤ ਤੈਅ ਕਰਦਾ ਹੈ।"),
        steps: [L(`${lower} से दूरी ${ld} और ${upper} से दूरी ${ud} है।`, `${lower} ਤੋਂ ਦੂਰੀ ${ld} ਅਤੇ ${upper} ਤੋਂ ਦੂਰੀ ${ud} ਹੈ।`), L(`छोटी दूरी के कारण उत्तर ${q.canonicalAnswer} है।`, `ਛੋਟੀ ਦੂਰੀ ਕਰਕੇ ਉੱਤਰ ${q.canonicalAnswer} ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-012": {
      const k = numberValue(s, "k");
      const n = text(s, "value");
      const multiplier = text(s, "multiplier");
      return {
        stem: L(`${n} का सबसे छोटा ऐसा गुणज ज्ञात कीजिए जो ${powerLabel(k, language)} हो।`, `${n} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਐਸਾ ਗੁਣਜ ਕੱਢੋ ਜੋ ${powerLabel(k, language)} ਹੋਵੇ।`),
        coreConcept: L(`अभाज्य घातों को ${k} के गुणज तक पूरा किया जाता है, लेकिन यहाँ उत्तर गुणक नहीं बल्कि पूरा बना हुआ गुणज है।`, `ਅਭਾਜ ਘਾਤਾਂ ਨੂੰ ${k} ਦੇ ਗੁਣਜ ਤੱਕ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਪਰ ਇੱਥੇ ਉੱਤਰ ਗੁਣਕ ਨਹੀਂ ਸਗੋਂ ਪੂਰਾ ਬਣਿਆ ਗੁਣਜ ਹੈ।`),
        strategy: L("पहले न्यूनतम पूरक गुणक निकालें, फिर मूल संख्या से गुणा करके पूर्ण-घात गुणज लौटाएँ।", "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਪੂਰਕ ਗੁਣਕ ਕੱਢੋ, ਫਿਰ ਮੂਲ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਪੂਰਨ-ਘਾਤ ਗੁਣਜ ਦਿਓ।"),
        steps: [L(`न्यूनतम पूरक गुणक ${multiplier} है।`, `ਘੱਟੋ-ਘੱਟ ਪੂਰਕ ਗੁਣਕ ${multiplier} ਹੈ।`), L(`${n} × ${multiplier} = ${q.canonicalAnswer}, यही माँगा गया सबसे छोटा पूर्ण-घात गुणज है।`, `${n} × ${multiplier} = ${q.canonicalAnswer}, ਇਹੀ ਮੰਗਿਆ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ-ਘਾਤ ਗੁਣਜ ਹੈ।`)],
      };
    }
    case "NUM-CP012-PROT-013": {
      const square = q.representation === "SQUARE_UNIT_DIGIT_REJECTION";
      const modulus = numberValue(s, "modulus");
      return {
        stem: square
          ? L("निम्न में कौन-सा अंक किसी पूर्ण वर्ग का इकाई अंक नहीं हो सकता?", "ਹੇਠਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੰਕ ਕਿਸੇ ਪੂਰਨ ਵਰਗ ਦਾ ਇਕਾਈ ਅੰਕ ਨਹੀਂ ਹੋ ਸਕਦਾ?")
          : L("निम्न में कौन-सा दो-अंकीय अंत किसी पूर्ण घन के अंत में नहीं आ सकता?", "ਹੇਠਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਦੋ-ਅੰਕੀ ਅੰਤ ਕਿਸੇ ਪੂਰਨ ਘਨ ਦੇ ਅੰਤ ਵਿੱਚ ਨਹੀਂ ਆ ਸਕਦਾ?"),
        coreConcept: L(`पूर्ण घातों के शेष modulo ${modulus} सीमित होते हैं। ऐसा अंत किसी संख्या को अस्वीकार कर सकता है, पर अकेले सही अंत से पूर्ण घात सिद्ध नहीं होती।`, `ਪੂਰਨ ਘਾਤਾਂ ਦੇ ਬਾਕੀ modulo ${modulus} ਸੀਮਿਤ ਹੁੰਦੇ ਹਨ। ਐਸਾ ਅੰਤ ਕਿਸੇ ਸੰਖਿਆ ਨੂੰ ਰੱਦ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਸਿਰਫ਼ ਠੀਕ ਅੰਤ ਨਾਲ ਪੂਰਨ ਘਾਤ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੀ।`),
        strategy: L(`पूर्णांक ${square ? "वर्गों" : "घनों"} से modulo ${modulus} में मिलने वाले संभव शेषों से विकल्पों की तुलना करें।`, `ਪੂਰਨ ਅੰਕ ${square ? "ਵਰਗਾਂ" : "ਘਨਾਂ"} ਤੋਂ modulo ${modulus} ਵਿੱਚ ਮਿਲਦੇ ਸੰਭਵ ਬਾਕੀਆਂ ਨਾਲ ਚੋਣਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`),
        steps: [L(`सही विकल्प ${q.canonicalAnswer} संभव शेषों की सूची में नहीं आता।`, `ਸਹੀ ਚੋਣ ${q.canonicalAnswer} ਸੰਭਵ ਬਾਕੀਆਂ ਦੀ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੀ।`), L("बाकी विकल्प कम-से-कम किसी पूर्ण घात के अंत के रूप में संभव हैं।", "ਬਾਕੀ ਚੋਣਾਂ ਘੱਟੋ-ਘੱਟ ਕਿਸੇ ਪੂਰਨ ਘਾਤ ਦੇ ਅੰਤ ਵਜੋਂ ਸੰਭਵ ਹਨ।")],
      };
    }
    case "NUM-CP012-PROT-014": {
      const k = numberValue(s, "k");
      const fixedPrime = text(s, "fixedPrime");
      const fixedExponent = numberValue(s, "fixedExponent");
      const prime = text(s, "prime");
      const low = numberValue(s, "low");
      const high = numberValue(s, "high");
      const valid = numberList(s, "arithmeticValid");
      return {
        stem: L(`${low} ≤ x ≤ ${high} के लिए बताइए कि ${fixedPrime}^${fixedExponent} × ${prime}^x को ${powerLabel(k, language)} बनाने वाले x के मान कोई नहीं, एक हैं या एक से अधिक हैं।`, `${low} ≤ x ≤ ${high} ਲਈ ਦੱਸੋ ਕਿ ${fixedPrime}^${fixedExponent} × ${prime}^x ਨੂੰ ${powerLabel(k, language)} ਬਣਾਉਣ ਵਾਲੇ x ਦੇ ਮੁੱਲ ਕੋਈ ਨਹੀਂ, ਇੱਕ ਹਨ ਜਾਂ ਇੱਕ ਤੋਂ ਵੱਧ ਹਨ।`),
        coreConcept: L(`मान्य x वे हैं जिनसे हर अभाज्य घात ${k} से विभाज्य हो जाती है।`, `ਮਨਜ਼ੂਰ x ਉਹ ਹਨ ਜਿਨ੍ਹਾਂ ਨਾਲ ਹਰ ਅਭਾਜ ਘਾਤ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੋ ਜਾਂਦੀ ਹੈ।`),
        strategy: L("पूरी दी गई सीमा की जाँच करें और मान्य x की संख्या के आधार पर समाधान-वर्ग तय करें।", "ਪੂਰੀ ਦਿੱਤੀ ਹੱਦ ਜਾਂਚੋ ਅਤੇ ਮਨਜ਼ੂਰ x ਦੀ ਗਿਣਤੀ ਦੇ ਆਧਾਰ ਤੇ ਹੱਲ-ਵਰਗ ਤੈਅ ਕਰੋ।"),
        steps: [L(`मान्य x: ${valid.length === 0 ? "कोई नहीं" : valid.join(", ")}.`, `ਮਨਜ਼ੂਰ x: ${valid.length === 0 ? "ਕੋਈ ਨਹੀਂ" : valid.join(", ")}.`), L(`इसलिए उत्तर-वर्ग ${localizedAnswer(q.canonicalAnswer, language)} है।`, `ਇਸ ਲਈ ਉੱਤਰ-ਵਰਗ ${localizedAnswer(q.canonicalAnswer, language)} ਹੈ।`)],
      };
    }
    default:
      throw new Error(`Unsupported CP012 localized prototype ${q.temporaryPrototypeId}`);
  }
}

export function generateNumCp012Localized(
  qlId: NumCp012PermanentQlId,
  seed: number,
  language: NumCp012LocalizedLanguage,
): NumCp012LocalizedPackage {
  const source = generateNumCp012Permanent(qlId, seed);
  const localized = content(source, language);
  const canonicalAnswer = localizedAnswer(source.canonicalAnswer, language);
  const verifierAnswer = localizedAnswer(source.verifierAnswer, language);
  const options = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    value: localizedAnswer(option.value, language),
  })));

  const result = Object.freeze({
    ...source,
    language,
    locale: localeFor(language),
    stem: localized.stem,
    options,
    canonicalAnswer,
    verifierAnswer,
    explanation: Object.freeze({
      coreConcept: localized.coreConcept,
      strategy: localized.strategy,
      steps: Object.freeze([...localized.steps]),
      finalAnswer: canonicalAnswer,
    }),
    lifecycle: Object.freeze({
      ...source.lifecycle,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
    }),
  }) as NumCp012LocalizedPackage;

  if (result.canonicalAnswer !== result.verifierAnswer) {
    throw new Error(`${qlId}/${language}: localized canonical/verifier drift`);
  }
  if (result.options[result.correctIndex]?.value !== result.canonicalAnswer) {
    throw new Error(`${qlId}/${language}: localized correct option binding drift`);
  }
  return result;
}
