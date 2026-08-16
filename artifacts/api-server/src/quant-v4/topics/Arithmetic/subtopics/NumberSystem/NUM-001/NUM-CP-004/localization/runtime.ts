import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004EditorialV2ReviewFinal } from "../permanent/editorial-v2-review-final";
import type { NumCp004EditorialV2Question } from "../permanent/editorial-v2";
import type {
  NumCp004LocalizedQuestion,
  NumCp004TranslatedLanguage,
  NumCp004TranslatedLocale,
} from "./types";

function localeFor(language: NumCp004TranslatedLanguage): NumCp004TranslatedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function normalizeMath(text: string): string {
  return text.replace(/\$([^$]+)\$/gu, (_match, body: string) => math(body));
}

function capture(text: string, pattern: RegExp, label: string): RegExpMatchArray {
  const match = text.match(pattern);
  if (!match) throw new Error(`NUM-CP-004 localization could not parse ${label}: ${text}`);
  return match;
}

function localizeStem(
  qlId: NumCp004PermanentQlId,
  sourceText: string,
  language: NumCp004TranslatedLanguage,
): string {
  const source = normalizeMath(sourceText);
  const hi = language === "hi";

  switch (qlId) {
    case "NUM-QL-018": {
      const [, value] = capture(source, /correctly classifies (.+)\?$/u, qlId);
      return hi ? `${value} का सही वर्गीकरण कौन-सा है?` : `${value} ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕਿਹੜਾ ਹੈ?`;
    }
    case "NUM-QL-019": {
      const [, lower, upper] = capture(source, /between (.+) and (.+), both inclusive\?$/u, qlId);
      return hi
        ? `${lower} से ${upper} तक, दोनों सिरों सहित, सभी अभाज्य संख्याएँ किस समुच्चय में हैं?`
        : `${lower} ਤੋਂ ${upper} ਤੱਕ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਸਾਰੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਕਿਹੜੇ ਸਮੂਹ ਵਿੱਚ ਹਨ?`;
    }
    case "NUM-QL-020": {
      const [, lower, upper] = capture(source, /between (.+) and (.+), both inclusive\?$/u, qlId);
      return hi
        ? `${lower} से ${upper} तक, दोनों सिरों सहित, कितनी अभाज्य संख्याएँ हैं?`
        : `${lower} ਤੋਂ ${upper} ਤੱਕ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਕਿੰਨੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਹਨ?`;
    }
    case "NUM-QL-021": {
      let match = source.match(/smallest prime strictly greater than (.+)\?$/u);
      if (match) return hi ? `${match[1]} से ठीक बड़ी सबसे छोटी अभाज्य संख्या क्या है?` : `${match[1]} ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਵੱਡੀ ਸਭ ਤੋਂ ਛੋਟੀ ਅਭਾਜ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`;
      match = source.match(/greatest prime strictly less than (.+)\?$/u);
      if (match) return hi ? `${match[1]} से ठीक छोटी सबसे बड़ी अभाज्य संख्या क्या है?` : `${match[1]} ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਛੋਟੀ ਸਭ ਤੋਂ ਵੱਡੀ ਅਭਾਜ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`;
      match = source.match(/least prime in the interval (.+)\?$/u);
      if (match) return hi ? `अंतराल ${match[1]} में सबसे छोटी अभाज्य संख्या कौन-सी है?` : `ਅੰਤਰਾਲ ${match[1]} ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟੀ ਅਭਾਜ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`;
      match = source.match(/greatest prime in the interval (.+)\?$/u);
      if (match) return hi ? `अंतराल ${match[1]} में सबसे बड़ी अभाज्य संख्या कौन-सी है?` : `ਅੰਤਰਾਲ ${match[1]} ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ਅਭਾਜ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`;
      throw new Error(`NUM-CP-004 localization could not parse ${qlId}: ${source}`);
    }
    case "NUM-QL-022": {
      const [, lower, upper, sum] = capture(source, /between (.+) and (.+), inclusive, and its digits add to (.+)\. Which prime is it\?$/u, qlId);
      return hi
        ? `${lower} से ${upper} के बीच, दोनों सिरों सहित, एक अभाज्य संख्या के अंकों का योग ${sum} है। वह अभाज्य संख्या कौन-सी है?`
        : `${lower} ਤੋਂ ${upper} ਦੇ ਵਿਚਕਾਰ, ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ, ਇੱਕ ਅਭਾਜ ਸੰਖਿਆ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ। ਉਹ ਅਭਾਜ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`;
    }
    case "NUM-QL-023": {
      const [, values] = capture(source, /statements about (.+) is correct\?$/u, qlId);
      return hi ? `${values} के बारे में निम्न में से कौन-सा कथन सही है?` : `${values} ਬਾਰੇ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`;
    }
    case "NUM-QL-024": {
      const [, value] = capture(source, /prime factorisation of (.+)\?$/u, qlId);
      return hi ? `${value} का पूर्ण अभाज्य गुणनखंड क्या है?` : `${value} ਦਾ ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੀ ਹੈ?`;
    }
    case "NUM-QL-025": {
      const [, direction, value] = capture(source, /What is the (largest|smallest) prime factor of (.+)\?$/u, qlId);
      if (hi) return `${value} का ${direction === "largest" ? "सबसे बड़ा" : "सबसे छोटा"} अभाज्य गुणनखंड क्या है?`;
      return `${value} ਦਾ ${direction === "largest" ? "ਸਭ ਤੋਂ ਵੱਡਾ" : "ਸਭ ਤੋਂ ਛੋਟਾ"} ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੀ ਹੈ?`;
    }
    case "NUM-QL-026": {
      const [, value] = capture(source, /does (.+) have\?$/u, qlId);
      return hi ? `${value} के कितने भिन्न अभाज्य गुणनखंड हैं?` : `${value} ਦੇ ਕਿੰਨੇ ਵੱਖਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ?`;
    }
    case "NUM-QL-027": {
      const [, value] = capture(source, /does (.+) have when repeated factors/u, qlId);
      return hi ? `दोहराए गए गुणनखंड अलग-अलग गिनने पर ${value} के कितने अभाज्य गुणनखंड हैं?` : `ਦੁਹਰਾਏ ਗੁਣਨਖੰਡ ਵੱਖ-ਵੱਖ ਗਿਣਨ ਤੇ ${value} ਦੇ ਕਿੰਨੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ?`;
    }
    case "NUM-QL-028": {
      const [, factors] = capture(source, /prime factorisation (\\\(.+\\\))\?$/u, qlId);
      return hi ? `किस पूर्णांक का अभाज्य गुणनखंड ${factors} है?` : `ਕਿਹੜੇ ਪੂਰਨ ਅੰਕ ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ${factors} ਹੈ?`;
    }
    case "NUM-QL-029": {
      const [, a, b, tail] = capture(source, /^Given (\\\(A = .+\\\)) and (\\\(B = .+\\\)), which (.+)\?$/u, qlId);
      let question: string;
      if (tail.includes("distinct prime factors")) question = hi ? "में किसके भिन्न अभाज्य गुणनखंड अधिक हैं" : "ਵਿੱਚੋਂ ਕਿਸਦੇ ਵੱਖਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਵੱਧ ਹਨ";
      else if (tail.includes("repeated factors")) question = hi ? "में किसके अभाज्य गुणनखंड, दोहराव सहित, अधिक हैं" : "ਵਿੱਚੋਂ ਕਿਸਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ, ਦੁਹਰਾਵੇ ਸਮੇਤ, ਵੱਧ ਹਨ";
      else question = hi ? "में किसका पूर्णांक मान बड़ा है" : "ਵਿੱਚੋਂ ਕਿਸਦਾ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਵੱਡਾ ਹੈ";
      return hi ? `${a} और ${b} दिए हैं। ${question}?` : `${a} ਅਤੇ ${b} ਦਿੱਤੇ ਹਨ। ${question}?`;
    }
    case "NUM-QL-030": {
      const [, equation] = capture(source, /^Given (\\\(.+\\\)), what is the prime \\(p\\\)\?$/u, qlId);
      return hi ? `${equation} दिया है। अभाज्य संख्या ${math("p")} क्या है?` : `${equation} ਦਿੱਤਾ ਹੈ। ਅਭਾਜ ਸੰਖਿਆ ${math("p")} ਕੀ ਹੈ?`;
    }
    case "NUM-QL-031": {
      const [, equation] = capture(source, /^Given (\\\(.+\\\)), what is the exponent \\(x\\\)\?$/u, qlId);
      return hi ? `${equation} दिया है। घातांक ${math("x")} क्या है?` : `${equation} ਦਿੱਤਾ ਹੈ। ਘਾਤ ${math("x")} ਕੀ ਹੈ?`;
    }
    case "NUM-QL-032":
      return hi ? "निम्न में से कौन-सा युग्म सह-अभाज्य है?" : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਸਹਿ-ਅਭਾਜ ਹੈ?";
    case "NUM-QL-033": {
      const [, values, fixed] = capture(source, /from (\{.+\}) that are co-prime to (.+)\?$/u, qlId);
      return hi ? `${values} में से ${fixed} के साथ सह-अभाज्य सभी संख्याएँ किस समुच्चय में हैं?` : `${values} ਵਿੱਚੋਂ ${fixed} ਨਾਲ ਸਹਿ-ਅਭਾਜ ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਕਿਹੜੇ ਸਮੂਹ ਵਿੱਚ ਹਨ?`;
    }
    case "NUM-QL-034": {
      const [, values, fixed] = capture(source, /values in (\{.+\}) are co-prime to (.+)\?$/u, qlId);
      return hi ? `${values} में कितनी संख्याएँ ${fixed} के साथ सह-अभाज्य हैं?` : `${values} ਵਿੱਚ ਕਿੰਨੀਆਂ ਸੰਖਿਆਵਾਂ ${fixed} ਨਾਲ ਸਹਿ-ਅਭਾਜ ਹਨ?`;
    }
    case "NUM-QL-035": {
      const [, values, fixed] = capture(source, /x in (\{.+\}) is co-prime to (.+)\?$/u, qlId);
      return hi ? `${values} में ${math("x")} का कौन-सा मान ${fixed} के साथ सह-अभाज्य है?` : `${values} ਵਿੱਚ ${math("x")} ਦਾ ਕਿਹੜਾ ਮੁੱਲ ${fixed} ਨਾਲ ਸਹਿ-ਅਭਾਜ ਹੈ?`;
    }
    case "NUM-QL-036": {
      const [, values] = capture(source, /co-primality of (.+)\?$/u, qlId);
      return hi ? `${values} की सह-अभाज्यता को कौन-सा कथन सही बताता है?` : `${values} ਦੀ ਸਹਿ-ਅਭਾਜਤਾ ਨੂੰ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਦੱਸਦਾ ਹੈ?`;
    }
    case "NUM-QL-037":
      return hi ? "निम्न सह-अभाज्यता कथनों में से कौन-सा सही है?" : "ਹੇਠਾਂ ਦਿੱਤੇ ਸਹਿ-ਅਭਾਜਤਾ ਕਥਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?";
    case "NUM-QL-038": {
      const [, lower, upper, relation, target] = capture(source, /between (.+) and (.+), and their (sum|difference|product) is (.+)\. Which pair/u, qlId);
      const word = hi
        ? relation === "sum" ? "योग" : relation === "difference" ? "अंतर" : "गुणनफल"
        : relation === "sum" ? "ਜੋੜ" : relation === "difference" ? "ਅੰਤਰ" : "ਗੁਣਨਫਲ";
      return hi
        ? `${lower} और ${upper} के बीच दो क्रमागत अभाज्य संख्याओं का ${word} ${target} है। वह युग्म कौन-सा है?`
        : `${lower} ਅਤੇ ${upper} ਦੇ ਵਿਚਕਾਰ ਦੋ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦਾ ${word} ${target} ਹੈ। ਉਹ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?`;
    }
    case "NUM-QL-039": {
      const [, sum, smallest] = capture(source, /have sum (.+); the smallest is (.+)\. Which triple/u, qlId);
      return hi ? `तीन क्रमागत बढ़ती अभाज्य संख्याओं का योग ${sum} है और सबसे छोटी ${smallest} है। सही त्रिक कौन-सा है?` : `ਤਿੰਨ ਲਗਾਤਾਰ ਵੱਧਦੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟੀ ${smallest} ਹੈ। ਸਹੀ ਤਿਕੜੀ ਕਿਹੜੀ ਹੈ?`;
    }
    case "NUM-QL-040": {
      const [, value] = capture(source, /least prime divisor of (.+)\?$/u, qlId);
      return hi ? `${value} का सबसे छोटा अभाज्य भाजक क्या है?` : `${value} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਅਭਾਜ ਭਾਜਕ ਕੀ ਹੈ?`;
    }
    case "NUM-QL-041": {
      const [, expression] = capture(source, /prime numbers divides (.+) exactly\?$/u, qlId);
      return hi ? `निम्न अभाज्य संख्याओं में से कौन ${expression} को पूर्णतः विभाजित करती है?` : `ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ${expression} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਦਿੰਦੀ ਹੈ?`;
    }
    case "NUM-QL-042": {
      const [, prime] = capture(source, /involving the prime (.+) is possible\?$/u, qlId);
      return hi ? `अभाज्य संख्या ${prime} से जुड़ा निम्न में से कौन-सा कथन संभव है?` : `ਅਭਾਜ ਸੰਖਿਆ ${prime} ਨਾਲ ਜੁੜਿਆ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸੰਭਵ ਹੈ?`;
    }
    case "NUM-QL-043": {
      const [, root, right, leftA, leftB] = capture(source, /shows \\?\((.+) \\to m \\times (.+)\\?\), and the missing node splits as \\?\((.+) \\times (.+)\\?\)\. What is \\?\(m\\?\)\?$/u, qlId);
      return hi ? `एक गुणनखंड वृक्ष में ${math(`${root} \\to m \\times ${right}`)} है और गायब नोड ${math(`${leftA} \\times ${leftB}`)} में बँटता है। ${math("m")} क्या है?` : `ਇੱਕ ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ${math(`${root} \\to m \\times ${right}`)} ਹੈ ਅਤੇ ਗੁੰਮ ਨੋਡ ${math(`${leftA} \\times ${leftB}`)} ਵਿੱਚ ਵੰਡਦਾ ਹੈ। ${math("m")} ਕੀ ਹੈ?`;
    }
    case "NUM-QL-044": {
      const [, values, s1, s2] = capture(source, /selected from (\{.+\})\. Can p be determined uniquely\?\n\nStatement I: (.+)\.\nStatement II: (.+)\.\n\nSelect/u, qlId);
      return hi
        ? `एक अभाज्य संख्या ${math("p")} ${values} में से चुनी गई है। क्या ${math("p")} का मान एकमात्र रूप से तय हो सकता है?\n\nकथन I: ${s1}।\nकथन II: ${s2}।\n\nसही डेटा-पर्याप्तता विकल्प चुनिए।`
        : `ਇੱਕ ਅਭਾਜ ਸੰਖਿਆ ${math("p")} ${values} ਵਿੱਚੋਂ ਚੁਣੀ ਗਈ ਹੈ। ਕੀ ${math("p")} ਦਾ ਮੁੱਲ ਇਕੋ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਹੋ ਸਕਦਾ ਹੈ?\n\nਕਥਨ I: ${s1}।\nਕਥਨ II: ${s2}।\n\nਸਹੀ ਡਾਟਾ-ਪਰਯਾਪਤਾ ਵਿਕਲਪ ਚੁਣੋ।`;
    }
    case "NUM-QL-045": {
      const [, value] = capture(source, /that turn (.+) into a prime number\?$/u, qlId);
      return hi ? `${value} को अभाज्य संख्या बनाने वाले सभी न्यूनतम धनात्मक या ऋणात्मक बदलाव किस विकल्प में हैं?` : `${value} ਨੂੰ ਅਭਾਜ ਸੰਖਿਆ ਬਣਾਉਣ ਵਾਲੇ ਸਾਰੇ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਜਾਂ ਰਿਣਾਤਮਕ ਬਦਲਾਅ ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਹਨ?`;
    }
  }
}

const HINDI_LABELS: Readonly<Record<string, string>> = Object.freeze({
  PRIME: "अभाज्य",
  COMPOSITE: "संयोज्य",
  UNIT: "इकाई",
  NEITHER: "न अभाज्य, न संयोज्य",
  EQUAL: "बराबर",
  CANNOT_BE_DETERMINED: "निर्धारित नहीं किया जा सकता",
  "Pairwise and collectively co-prime": "युग्मवार और सामूहिक रूप से सह-अभाज्य",
  "Collectively but not pairwise co-prime": "सामूहिक रूप से सह-अभाज्य, पर युग्मवार नहीं",
  "Not collectively co-prime": "सामूहिक रूप से सह-अभाज्य नहीं",
  "Pairwise but not collectively co-prime": "युग्मवार सह-अभाज्य, पर सामूहिक रूप से नहीं",
  "Statement I alone is sufficient": "केवल कथन I पर्याप्त है",
  "Statement II alone is sufficient": "केवल कथन II पर्याप्त है",
  "Both statements together are sufficient": "दोनों कथन साथ मिलकर पर्याप्त हैं",
  "Even both statements together are not sufficient": "दोनों कथन साथ मिलकर भी पर्याप्त नहीं हैं",
});

const PUNJABI_LABELS: Readonly<Record<string, string>> = Object.freeze({
  PRIME: "ਅਭਾਜ",
  COMPOSITE: "ਸੰਯੁਕਤ",
  UNIT: "ਇਕਾਈ",
  NEITHER: "ਨਾ ਅਭਾਜ, ਨਾ ਸੰਯੁਕਤ",
  EQUAL: "ਬਰਾਬਰ",
  CANNOT_BE_DETERMINED: "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  "Pairwise and collectively co-prime": "ਜੋੜੇ-ਜੋੜੇ ਅਤੇ ਸਮੂਹਕ ਤੌਰ ਤੇ ਸਹਿ-ਅਭਾਜ",
  "Collectively but not pairwise co-prime": "ਸਮੂਹਕ ਤੌਰ ਤੇ ਸਹਿ-ਅਭਾਜ, ਪਰ ਜੋੜੇ-ਜੋੜੇ ਨਹੀਂ",
  "Not collectively co-prime": "ਸਮੂਹਕ ਤੌਰ ਤੇ ਸਹਿ-ਅਭਾਜ ਨਹੀਂ",
  "Pairwise but not collectively co-prime": "ਜੋੜੇ-ਜੋੜੇ ਸਹਿ-ਅਭਾਜ, ਪਰ ਸਮੂਹਕ ਤੌਰ ਤੇ ਨਹੀਂ",
  "Statement I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
  "Statement II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
  "Both statements together are sufficient": "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ",
  "Even both statements together are not sufficient": "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
});

function localizeOptionValue(value: string, language: NumCp004TranslatedLanguage): string {
  const labels = language === "hi" ? HINDI_LABELS : PUNJABI_LABELS;
  if (labels[value]) return labels[value]!;

  let match = value.match(/^(\d+) is prime\.$/u);
  if (match) return language === "hi" ? `${match[1]} अभाज्य है।` : `${match[1]} ਅਭਾਜ ਹੈ।`;
  match = value.match(/^(\d+) and (\d+) are co-prime\.$/u);
  if (match) return language === "hi" ? `${match[1]} और ${match[2]} सह-अभाज्य हैं।` : `${match[1]} ਅਤੇ ${match[2]} ਸਹਿ-ਅਭਾਜ ਹਨ।`;
  match = value.match(/^\(([^)]+)\) is pairwise co-prime\.$/u);
  if (match) return language === "hi" ? `(${match[1]}) युग्मवार सह-अभाज्य है।` : `(${match[1]}) ਜੋੜੇ-ਜੋੜੇ ਸਹਿ-ਅਭਾਜ ਹੈ।`;
  if (value === "Every pair of odd integers is co-prime.") {
    return language === "hi" ? "विषम पूर्णांकों का हर युग्म सह-अभाज्य होता है।" : "ਵਿਸਮ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਹਰ ਜੋੜਾ ਸਹਿ-ਅਭਾਜ ਹੁੰਦਾ ਹੈ।";
  }

  match = value.match(/^A positive integer can have exactly one distinct prime factor, for example (.+)\.$/u);
  if (match) return language === "hi" ? `किसी धनात्मक पूर्णांक का केवल एक भिन्न अभाज्य गुणनखंड हो सकता है, जैसे ${match[1]}।` : `ਕਿਸੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਦਾ ਕੇਵਲ ਇੱਕ ਵੱਖਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹੋ ਸਕਦਾ ਹੈ, ਜਿਵੇਂ ${match[1]}।`;
  if (value === "An even prime can be greater than 2.") return language === "hi" ? "कोई सम अभाज्य 2 से बड़ा हो सकता है।" : "ਕੋਈ ਸਮ ਅਭਾਜ 2 ਤੋਂ ਵੱਡਾ ਹੋ ਸਕਦਾ ਹੈ।";
  if (value === "A composite positive integer can have no prime factor.") return language === "hi" ? "किसी संयोज्य धनात्मक पूर्णांक का कोई अभाज्य गुणनखंड नहीं हो सकता।" : "ਕਿਸੇ ਸੰਯੁਕਤ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਦਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਹੀਂ ਹੋ ਸਕਦਾ।";
  if (value === "The product of two primes can itself be prime.") return language === "hi" ? "दो अभाज्य संख्याओं का गुणनफल स्वयं अभाज्य हो सकता है।" : "ਦੋ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਨਫਲ ਆਪ ਅਭਾਜ ਹੋ ਸਕਦਾ ਹੈ।";

  return normalizeMath(value);
}

const HINDI_CONCEPT: Readonly<Record<NumCp004PermanentQlId, string>> = Object.freeze({
  "NUM-QL-018": "यह प्रश्न संख्या को अभाज्य, संयोज्य, इकाई या इनमें से किसी में नहीं वर्गीकृत करने की जाँच करता है।",
  "NUM-QL-019": "यह प्रश्न दिए गए बंद अंतराल की सभी अभाज्य संख्याएँ पहचानने की जाँच करता है।",
  "NUM-QL-020": "यह प्रश्न दिए गए अंतराल में अभाज्य संख्याओं की कुल संख्या गिनने की जाँच करता है।",
  "NUM-QL-021": "यह प्रश्न दी गई दिशा या अंतराल में निकटतम अथवा सीमा-अभाज्य संख्या खोजने की जाँच करता है।",
  "NUM-QL-022": "यह प्रश्न सीमा और अंक-योग, दोनों शर्तें पूरी करने वाली एकमात्र अभाज्य संख्या खोजने की जाँच करता है।",
  "NUM-QL-023": "यह प्रश्न अभाज्यता से जुड़े कथनों की सत्यता जाँचने की जाँच करता है।",
  "NUM-QL-024": "यह प्रश्न पूर्ण अभाज्य गुणनखंड लिखने की जाँच करता है।",
  "NUM-QL-025": "यह प्रश्न दिए पूर्णांक का आवश्यक सबसे छोटा या सबसे बड़ा अभाज्य गुणनखंड पहचानने की जाँच करता है।",
  "NUM-QL-026": "यह प्रश्न अलग-अलग अभाज्य गुणनखंडों की संख्या गिनने की जाँच करता है।",
  "NUM-QL-027": "यह प्रश्न दोहराव सहित अभाज्य गुणनखंडों की संख्या गिनने की जाँच करता है।",
  "NUM-QL-028": "यह प्रश्न अभाज्य घातों के गुणनफल से मूल पूर्णांक बनाने की जाँच करता है।",
  "NUM-QL-029": "यह प्रश्न दो अभाज्य-गुणनखंड संरचनाओं की माँगी गई विशेषता के अनुसार तुलना करने की जाँच करता है।",
  "NUM-QL-030": "यह प्रश्न पूर्ण अभाज्य गुणनखंड समीकरण से गायब अभाज्य संख्या निकालने की जाँच करता है।",
  "NUM-QL-031": "यह प्रश्न पूर्ण अभाज्य गुणनखंड समीकरण से गायब घातांक निकालने की जाँच करता है।",
  "NUM-QL-032": "यह प्रश्न वह युग्म चुनने की जाँच करता है जिसका HCF ठीक 1 हो।",
  "NUM-QL-033": "यह प्रश्न निश्चित संख्या के साथ सह-अभाज्य सभी उम्मीदवार खोजने की जाँच करता है।",
  "NUM-QL-034": "यह प्रश्न निश्चित संख्या के साथ सह-अभाज्य उम्मीदवारों की संख्या गिनने की जाँच करता है।",
  "NUM-QL-035": "यह प्रश्न वह मान चुनने की जाँच करता है जिससे HCF ठीक 1 हो।",
  "NUM-QL-036": "यह प्रश्न युग्मवार और सामूहिक सह-अभाज्यता के अंतर की जाँच करता है।",
  "NUM-QL-037": "यह प्रश्न HCF की मदद से सही सह-अभाज्यता कथन पहचानने की जाँच करता है।",
  "NUM-QL-038": "यह प्रश्न दी गई शर्त पूरी करने वाली दो क्रमागत अभाज्य संख्याएँ बनाने की जाँच करता है।",
  "NUM-QL-039": "यह प्रश्न तीन क्रमागत अभाज्य संख्याएँ बनाकर उनके योग की जाँच करता है।",
  "NUM-QL-040": "यह प्रश्न दिए पूर्णांक का सबसे छोटा अभाज्य भाजक खोजने की जाँच करता है।",
  "NUM-QL-041": "यह प्रश्न व्यंजक का मान निकालकर उसे पूर्णतः विभाजित करने वाली अभाज्य संख्या पहचानने की जाँच करता है।",
  "NUM-QL-042": "यह प्रश्न यह पहचानने की जाँच करता है कि दी गई अभाज्य-गुणनखंड संरचनाओं में कौन-सी संभव है।",
  "NUM-QL-043": "यह प्रश्न गुणनखंड वृक्ष में माता नोड = दोनों बच्चे नोडों का गुणनफल नियम लगाने की जाँच करता है।",
  "NUM-QL-044": "यह प्रश्न जाँचता है कि प्रत्येक कथन एकमात्र अभाज्य संख्या तय करने के लिए पर्याप्त जानकारी देता है या नहीं।",
  "NUM-QL-045": "यह प्रश्न किसी संख्या तक निकटतम अभाज्य पहुँचने के लिए सबसे छोटा चिह्नित बदलाव खोजने की जाँच करता है।",
});

const PUNJABI_CONCEPT: Readonly<Record<NumCp004PermanentQlId, string>> = Object.freeze({
  "NUM-QL-018": "ਇਹ ਪ੍ਰਸ਼ਨ ਸੰਖਿਆ ਨੂੰ ਅਭਾਜ, ਸੰਯੁਕਤ, ਇਕਾਈ ਜਾਂ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ ਵਜੋਂ ਵਰਗੀਕਰਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-019": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਬੰਦ ਅੰਤਰਾਲ ਦੀਆਂ ਸਾਰੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਪਛਾਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-020": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਅੰਤਰਾਲ ਵਿੱਚ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-021": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੀ ਦਿਸ਼ਾ ਜਾਂ ਅੰਤਰਾਲ ਵਿੱਚ ਨੇੜਲੀ ਜਾਂ ਸੀਮਾ ਵਾਲੀ ਅਭਾਜ ਸੰਖਿਆ ਲੱਭਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-022": "ਇਹ ਪ੍ਰਸ਼ਨ ਸੀਮਾ ਅਤੇ ਅੰਕ-ਜੋੜ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਾਲੀ ਇਕੋ ਅਭਾਜ ਸੰਖਿਆ ਲੱਭਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-023": "ਇਹ ਪ੍ਰਸ਼ਨ ਅਭਾਜਤਾ ਨਾਲ ਜੁੜੇ ਕਥਨਾਂ ਦੀ ਸੱਚਾਈ ਜਾਂਚਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-024": "ਇਹ ਪ੍ਰਸ਼ਨ ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਲਿਖਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-025": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਪੂਰਨ ਅੰਕ ਦਾ ਲੋੜੀਂਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਜਾਂ ਸਭ ਤੋਂ ਵੱਡਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਪਛਾਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-026": "ਇਹ ਪ੍ਰਸ਼ਨ ਵੱਖਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਦੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-027": "ਇਹ ਪ੍ਰਸ਼ਨ ਦੁਹਰਾਵੇ ਸਮੇਤ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਦੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-028": "ਇਹ ਪ੍ਰਸ਼ਨ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਗੁਣਨਫਲ ਤੋਂ ਮੂਲ ਪੂਰਨ ਅੰਕ ਬਣਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-029": "ਇਹ ਪ੍ਰਸ਼ਨ ਦੋ ਅਭਾਜ-ਗੁਣਨਖੰਡ ਬਣਤਰਾਂ ਦੀ ਮੰਗੀ ਵਿਸ਼ੇਸ਼ਤਾ ਅਨੁਸਾਰ ਤੁਲਨਾ ਕਰਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-030": "ਇਹ ਪ੍ਰਸ਼ਨ ਪੂਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਸਮੀਕਰਨ ਤੋਂ ਗੁੰਮ ਅਭਾਜ ਸੰਖਿਆ ਕੱਢਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-031": "ਇਹ ਪ੍ਰਸ਼ਨ ਪੂਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਸਮੀਕਰਨ ਤੋਂ ਗੁੰਮ ਘਾਤ ਕੱਢਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-032": "ਇਹ ਪ੍ਰਸ਼ਨ ਉਹ ਜੋੜਾ ਚੁਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ ਜਿਸਦਾ HCF ਠੀਕ 1 ਹੋਵੇ।",
  "NUM-QL-033": "ਇਹ ਪ੍ਰਸ਼ਨ ਨਿਰਧਾਰਤ ਸੰਖਿਆ ਨਾਲ ਸਹਿ-ਅਭਾਜ ਸਾਰੇ ਉਮੀਦਵਾਰ ਲੱਭਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-034": "ਇਹ ਪ੍ਰਸ਼ਨ ਨਿਰਧਾਰਤ ਸੰਖਿਆ ਨਾਲ ਸਹਿ-ਅਭਾਜ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-035": "ਇਹ ਪ੍ਰਸ਼ਨ ਉਹ ਮੁੱਲ ਚੁਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ ਜਿਸ ਨਾਲ HCF ਠੀਕ 1 ਹੋਵੇ।",
  "NUM-QL-036": "ਇਹ ਪ੍ਰਸ਼ਨ ਜੋੜੇ-ਜੋੜੇ ਅਤੇ ਸਮੂਹਕ ਸਹਿ-ਅਭਾਜਤਾ ਦੇ ਫ਼ਰਕ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-037": "ਇਹ ਪ੍ਰਸ਼ਨ HCF ਦੀ ਮਦਦ ਨਾਲ ਸਹੀ ਸਹਿ-ਅਭਾਜਤਾ ਕਥਨ ਪਛਾਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-038": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਦੋ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਬਣਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-039": "ਇਹ ਪ੍ਰਸ਼ਨ ਤਿੰਨ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਬਣਾਕੇ ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਜਾਂਚਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-040": "ਇਹ ਪ੍ਰਸ਼ਨ ਦਿੱਤੇ ਪੂਰਨ ਅੰਕ ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਅਭਾਜ ਭਾਜਕ ਲੱਭਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-041": "ਇਹ ਪ੍ਰਸ਼ਨ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢਕੇ ਉਸਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗ ਦੇਣ ਵਾਲੀ ਅਭਾਜ ਸੰਖਿਆ ਪਛਾਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-042": "ਇਹ ਪ੍ਰਸ਼ਨ ਇਹ ਪਛਾਣਨ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ ਕਿ ਦਿੱਤੀਆਂ ਅਭਾਜ-ਗੁਣਨਖੰਡ ਬਣਤਰਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਭਵ ਹੈ।",
  "NUM-QL-043": "ਇਹ ਪ੍ਰਸ਼ਨ ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ਮਾਪੇ ਨੋਡ = ਦੋਵੇਂ ਬੱਚੇ ਨੋਡਾਂ ਦਾ ਗੁਣਨਫਲ ਨਿਯਮ ਲਗਾਉਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
  "NUM-QL-044": "ਇਹ ਪ੍ਰਸ਼ਨ ਜਾਂਚਦਾ ਹੈ ਕਿ ਹਰ ਕਥਨ ਇਕੋ ਅਭਾਜ ਸੰਖਿਆ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।",
  "NUM-QL-045": "ਇਹ ਪ੍ਰਸ਼ਨ ਕਿਸੇ ਸੰਖਿਆ ਤੋਂ ਨੇੜਲੇ ਅਭਾਜ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਸਭ ਤੋਂ ਛੋਟਾ ਚਿੰਨ੍ਹਿਤ ਬਦਲਾਅ ਲੱਭਣ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।",
});

function ruleFor(qlId: NumCp004PermanentQlId, language: NumCp004TranslatedLanguage): string {
  const hi = language === "hi";
  if (["NUM-QL-018", "NUM-QL-019", "NUM-QL-020", "NUM-QL-021", "NUM-QL-022", "NUM-QL-023"].includes(qlId)) {
    return hi
      ? "नियम: 1 से बड़ी संख्या तभी अभाज्य है जब उसके धनात्मक भाजक केवल 1 और वही संख्या हों। अभाज्यता जाँचने के लिए उसके वर्गमूल तक के अभाज्य भाजक जाँचना पर्याप्त है।"
      : "ਨਿਯਮ: 1 ਤੋਂ ਵੱਡੀ ਸੰਖਿਆ ਤਦੋਂ ਹੀ ਅਭਾਜ ਹੈ ਜਦੋਂ ਉਸਦੇ ਧਨਾਤਮਕ ਭਾਜਕ ਕੇਵਲ 1 ਅਤੇ ਉਹ ਸੰਖਿਆ ਆਪ ਹੋਣ। ਅਭਾਜਤਾ ਜਾਂਚਣ ਲਈ ਉਸਦੇ ਵਰਗਮੂਲ ਤੱਕ ਦੇ ਅਭਾਜ ਭਾਜਕ ਜਾਂਚਣਾ ਕਾਫ਼ੀ ਹੈ।";
  }
  if (["NUM-QL-024", "NUM-QL-025", "NUM-QL-026", "NUM-QL-027", "NUM-QL-028", "NUM-QL-029", "NUM-QL-030", "NUM-QL-031", "NUM-QL-040"].includes(qlId)) {
    return hi
      ? "नियम: संख्या को अभाज्य घातों के गुणनफल के रूप में लिखकर अभाज्य आधारों और उनके घातांकों से माँगी गई जानकारी निकाली जाती है।"
      : "ਨਿਯਮ: ਸੰਖਿਆ ਨੂੰ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਗੁਣਨਫਲ ਵਜੋਂ ਲਿਖ ਕੇ ਅਭਾਜ ਆਧਾਰਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਘਾਤਾਂ ਤੋਂ ਮੰਗੀ ਜਾਣਕਾਰੀ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।";
  }
  if (["NUM-QL-032", "NUM-QL-033", "NUM-QL-034", "NUM-QL-035", "NUM-QL-036", "NUM-QL-037"].includes(qlId)) {
    return hi
      ? "नियम: दो संख्याएँ तभी सह-अभाज्य हैं जब उनका HCF ठीक 1 हो। युग्मवार सह-अभाज्यता में हर युग्म का HCF 1 होना चाहिए।"
      : "ਨਿਯਮ: ਦੋ ਸੰਖਿਆਵਾਂ ਤਦੋਂ ਹੀ ਸਹਿ-ਅਭਾਜ ਹਨ ਜਦੋਂ ਉਨ੍ਹਾਂ ਦਾ HCF ਠੀਕ 1 ਹੋਵੇ। ਜੋੜੇ-ਜੋੜੇ ਸਹਿ-ਅਭਾਜਤਾ ਵਿੱਚ ਹਰ ਜੋੜੇ ਦਾ HCF 1 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।";
  }
  if (["NUM-QL-038", "NUM-QL-039"].includes(qlId)) {
    return hi
      ? "नियम: क्रमागत अभाज्य संख्याएँ अभाज्य क्रम में एक-दूसरे के ठीक बाद आती हैं; चुनी संख्याओं को दी गई योग, अंतर या गुणनफल शर्त भी पूरी करनी चाहिए।"
      : "ਨਿਯਮ: ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਅਭਾਜ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ-ਦੂਜੇ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਆਉਂਦੀਆਂ ਹਨ; ਚੁਣੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਦਿੱਤੀ ਜੋੜ, ਅੰਤਰ ਜਾਂ ਗੁਣਨਫਲ ਦੀ ਸ਼ਰਤ ਵੀ ਪੂਰੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।";
  }
  if (qlId === "NUM-QL-041") return hi ? "नियम: पहले व्यंजक का मान निकालें। कोई अभाज्य संख्या तभी भाजक है जब भाग देने पर शेष 0 आए।" : "ਨਿਯਮ: ਪਹਿਲਾਂ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ। ਕੋਈ ਅਭਾਜ ਸੰਖਿਆ ਤਦੋਂ ਹੀ ਭਾਜਕ ਹੈ ਜਦੋਂ ਭਾਗ ਦੇਣ ਉੱਤੇ ਬਾਕੀ 0 ਆਵੇ।";
  if (qlId === "NUM-QL-042") return hi ? "नियम: 2 ही एकमात्र सम अभाज्य है, हर 1 से बड़े संयोज्य पूर्णांक का कोई अभाज्य गुणनखंड होता है, और दो 1 से बड़ी अभाज्य संख्याओं का गुणनफल संयोज्य होता है।" : "ਨਿਯਮ: 2 ਹੀ ਇਕੱਲੀ ਸਮ ਅਭਾਜ ਸੰਖਿਆ ਹੈ, ਹਰ 1 ਤੋਂ ਵੱਡੇ ਸੰਯੁਕਤ ਪੂਰਨ ਅੰਕ ਦਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹੁੰਦਾ ਹੈ, ਅਤੇ ਦੋ 1 ਤੋਂ ਵੱਡੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਨਫਲ ਸੰਯੁਕਤ ਹੁੰਦਾ ਹੈ।";
  if (qlId === "NUM-QL-043") return hi ? "नियम: गुणनखंड वृक्ष में हर माता नोड अपने दोनों बच्चे नोडों के गुणनफल के बराबर होता है।" : "ਨਿਯਮ: ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ਹਰ ਮਾਪੇ ਨੋਡ ਆਪਣੇ ਦੋਵੇਂ ਬੱਚੇ ਨੋਡਾਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।";
  if (qlId === "NUM-QL-044") return hi ? "नियम: कोई कथन तभी पर्याप्त है जब वह अकेले केवल एक संभव मान छोड़े। दोनों कथनों को तभी मिलाएँ जब कोई भी अकेले पर्याप्त न हो।" : "ਨਿਯਮ: ਕੋਈ ਕਥਨ ਤਦੋਂ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਉਹ ਇਕੱਲਾ ਕੇਵਲ ਇੱਕ ਸੰਭਵ ਮੁੱਲ ਛੱਡੇ। ਦੋਵੇਂ ਕਥਨ ਤਦੋਂ ਹੀ ਮਿਲਾਓ ਜਦੋਂ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਾ ਹੋਵੇ।";
  return hi ? "नियम: संख्या के ठीक नीचे और ऊपर की निकटतम अभाज्य संख्याएँ जाँचें। सबसे छोटी निरपेक्ष दूरी वाला चिह्नित बदलाव चुनें; बराबर दूरी पर दोनों बदलाव रखें।" : "ਨਿਯਮ: ਸੰਖਿਆ ਦੇ ਤੁਰੰਤ ਹੇਠਾਂ ਅਤੇ ਉੱਪਰ ਦੀਆਂ ਨੇੜਲੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਜਾਂਚੋ। ਸਭ ਤੋਂ ਛੋਟੀ ਪਰਮ ਦੂਰੀ ਵਾਲਾ ਚਿੰਨ੍ਹਿਤ ਬਦਲਾਅ ਚੁਣੋ; ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ ਦੋਵੇਂ ਬਦਲਾਅ ਰੱਖੋ।";
}

function mathTokens(lines: readonly string[]): string[] {
  return lines.flatMap((line) => [...line.matchAll(/\\\([^)]*\\\)/gu)].map((match) => match[0]!));
}

function evidenceFor(
  qlId: NumCp004PermanentQlId,
  source: NumCp004EditorialV2Question,
  language: NumCp004TranslatedLanguage,
): string {
  const tokens = mathTokens(source.explanation.solution.slice(1));
  const visible = tokens.length > 0 ? tokens.join(", ") : math(source.answer);
  const hi = language === "hi";
  if (["NUM-QL-018", "NUM-QL-019", "NUM-QL-020", "NUM-QL-021", "NUM-QL-022", "NUM-QL-023"].includes(qlId)) {
    return hi ? `अभाज्यता की जाँच में ये निर्णायक मान मिलते हैं: ${visible}।` : `ਅਭਾਜਤਾ ਦੀ ਜਾਂਚ ਵਿੱਚ ਇਹ ਨਿਰਣਾਇਕ ਮੁੱਲ ਮਿਲਦੇ ਹਨ: ${visible}।`;
  }
  if (["NUM-QL-024", "NUM-QL-025", "NUM-QL-026", "NUM-QL-027", "NUM-QL-028", "NUM-QL-029", "NUM-QL-030", "NUM-QL-031", "NUM-QL-040"].includes(qlId)) {
    return hi ? `अभाज्य-गुणनखंड गणना से ${visible} मिलता है।` : `ਅਭਾਜ-ਗੁਣਨਖੰਡ ਗਣਨਾ ਤੋਂ ${visible} ਮਿਲਦਾ ਹੈ।`;
  }
  if (["NUM-QL-032", "NUM-QL-033", "NUM-QL-034", "NUM-QL-035", "NUM-QL-036", "NUM-QL-037"].includes(qlId)) {
    return hi ? `HCF की जाँच में ${visible} मिलता है; इसी से सह-अभाज्यता तय होती है।` : `HCF ਦੀ ਜਾਂਚ ਵਿੱਚ ${visible} ਮਿਲਦਾ ਹੈ; ਇਸੇ ਨਾਲ ਸਹਿ-ਅਭਾਜਤਾ ਨਿਰਧਾਰਤ ਹੁੰਦੀ ਹੈ।`;
  }
  if (["NUM-QL-038", "NUM-QL-039"].includes(qlId)) return hi ? `क्रमागत अभाज्य जाँच और दी गई शर्त से ${visible} मिलता है।` : `ਲਗਾਤਾਰ ਅਭਾਜ ਜਾਂਚ ਅਤੇ ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ${visible} ਮਿਲਦਾ ਹੈ।`;
  if (qlId === "NUM-QL-041") return hi ? `व्यंजक और भाग की गणना से ${visible} मिलता है।` : `ਵਿਅੰਜਕ ਅਤੇ ਭਾਗ ਦੀ ਗਣਨਾ ਤੋਂ ${visible} ਮਿਲਦਾ ਹੈ।`;
  if (qlId === "NUM-QL-042") return hi ? `संभव संरचना की जाँच में ${visible} निर्णायक है; बाकी कथन अभाज्य संख्या के मूल नियमों को तोड़ते हैं।` : `ਸੰਭਵ ਬਣਤਰ ਦੀ ਜਾਂਚ ਵਿੱਚ ${visible} ਨਿਰਣਾਇਕ ਹੈ; ਬਾਕੀ ਕਥਨ ਅਭਾਜ ਸੰਖਿਆ ਦੇ ਮੂਲ ਨਿਯਮ ਤੋੜਦੇ ਹਨ।`;
  if (qlId === "NUM-QL-043") return hi ? `बच्चे नोडों और फिर माता नोड की जाँच से ${visible} मिलता है।` : `ਬੱਚੇ ਨੋਡਾਂ ਅਤੇ ਫਿਰ ਮਾਪੇ ਨੋਡ ਦੀ ਜਾਂਚ ਤੋਂ ${visible} ਮਿਲਦਾ ਹੈ।`;
  if (qlId === "NUM-QL-044") return hi ? "कथन I और कथन II को पहले अलग-अलग जाँचने पर ही पर्याप्तता का सही निष्कर्ष मिलता है।" : "ਕਥਨ I ਅਤੇ ਕਥਨ II ਨੂੰ ਪਹਿਲਾਂ ਵੱਖ-ਵੱਖ ਜਾਂਚਣ ਨਾਲ ਹੀ ਪਰਯਾਪਤਾ ਦਾ ਸਹੀ ਨਤੀਜਾ ਮਿਲਦਾ ਹੈ।";
  return hi ? `निकटतम अभाज्य संख्याओं की दूरी जाँचने पर ${visible} मिलता है।` : `ਨੇੜਲੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦੀ ਦੂਰੀ ਜਾਂਚਣ ਤੇ ${visible} ਮਿਲਦਾ ਹੈ।`;
}

function localizeQuestion(
  source: NumCp004EditorialV2Question,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const qlId = source.permanentQlId;
  const locale = localeFor(language);
  const options = source.options.map((option) => Object.freeze({
    ...option,
    value: localizeOptionValue(option.value, language),
  }));
  const answer = options[source.correctIndex]!.value;
  const concept = language === "hi" ? HINDI_CONCEPT[qlId] : PUNJABI_CONCEPT[qlId];
  const solution = Object.freeze([
    ruleFor(qlId, language),
    evidenceFor(qlId, source, language),
    language === "hi" ? `अतः सही उत्तर ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
  ]);

  return Object.freeze({
    ...source,
    locale,
    language,
    stem: localizeStem(qlId, source.stem, language),
    options: Object.freeze(options),
    answer,
    canonicalAnswer: answer,
    explanation: Object.freeze({ concept, solution, finalAnswer: answer }),
    reviewStatus: "MULTILINGUAL_CONTROLLED_REVIEW",
    maturity: "MULTILINGUAL_EDITORIAL_REVIEW",
    allocationStatus: "MULTILINGUAL_CONTROLLED_REVIEW",
    traceability: Object.freeze({ ...source.traceability, language }),
    localization: Object.freeze({
      localizationVersion: "num-cp004-hi-pa-rule-first-v1",
      canonicalLocale: "en-IN",
      canonicalLanguage: "en",
      canonicalQuestionId: source.questionId,
      canonicalAnswer: source.answer,
      locale,
      language,
      mathematicalStatePreserved: true,
      optionOrderPreserved: true,
      correctIndexPreserved: true,
      misconceptionMappingPreserved: true,
      ruleFirstTeachingPreserved: true,
      lifecycleLocked: true,
    }),
  });
}

export function runNumCp004LocalizedForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const source = runNumCp004EditorialV2ReviewFinal({ questionLanguageId, seed, language: "en" });
  return localizeQuestion(source, language);
}
