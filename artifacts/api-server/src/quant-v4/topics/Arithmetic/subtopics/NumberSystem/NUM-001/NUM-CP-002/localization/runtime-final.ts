import { runNumCp002LocalizedPipeline, type NumCp002LocalizedRuntimeInput } from "./runtime";
import type { NumCp002LocalizedQuestion, NumCp002TranslatedLocale } from "./types";

const tx = (locale: NumCp002TranslatedLocale, hi: string, pa: string): string => locale === "hi-IN" ? hi : pa;

const HARDENING_RULES: ReadonlyArray<readonly [string, string, string]> = [
  ["After reduction, the denominator may contain only", "सरल करने के बाद हर में केवल", "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["After reduction the denominator may contain only", "सरल करने के बाद हर में केवल", "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["a pure recurring block of length", "पूर्ण आवर्ती खंड की लंबाई", "ਪੂਰੇ ਆਵਰਤੀ ਖੰਡ ਦੀ ਲੰਬਾਈ"],
  ["subtraction produces a denominator of k nines.", "हो तो घटाने पर हर में उतने ही 9 आते हैं।", "ਹੋਵੇ ਤਾਂ ਘਟਾਉਣ ਤੇ ਹਰ ਵਿੱਚ ਉਤਨੇ ਹੀ 9 ਆਉਂਦੇ ਹਨ।"],
  ["subtraction produces a denominator of", "घटाने पर हर बनता है", "ਘਟਾਉਣ ਤੇ ਹਰ ਬਣਦਾ ਹੈ"],
  ["nines.", "जिसमें उतने ही 9 होते हैं।", "ਜਿਸ ਵਿੱਚ ਉਤਨੇ ਹੀ 9 ਹੁੰਦੇ ਹਨ।"],
  ["Shift past the recurring block and subtract a shift that ends just before it.", "आवर्ती खंड के बाद तक दशमलव खिसकाइए और उससे आवर्ती खंड से ठीक पहले तक खिसकाया गया मान घटाइए।", "ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਅੱਗੇ ਤੱਕ ਦਸ਼ਮਲਵ ਖਿਸਕਾਓ ਅਤੇ ਉਸ ਵਿਚੋਂ ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਤੱਕ ਖਿਸਕਾਇਆ ਮੁੱਲ ਘਟਾਓ।"],
  ["Shift past the recurring block", "आवर्ती खंड के बाद तक दशमलव खिसकाइए", "ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਅੱਗੇ ਤੱਕ ਦਸ਼ਮਲਵ ਖਿਸਕਾਓ"],
  ["subtract a shift that ends just before it", "और आवर्ती खंड से ठीक पहले तक खिसकाया गया मान घटाइए", "ਅਤੇ ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਤੱਕ ਖਿਸਕਾਇਆ ਮੁੱਲ ਘਟਾਓ"],
  ["The subtraction gives", "घटाने पर मिलता है", "ਘਟਾਉਣ ਤੇ ਮਿਲਦਾ ਹੈ"],
  ["Let", "मान लीजिए", "ਮੰਨ ਲਵੋ"],
  ["Therefore the fraction is", "इसलिए भिन्न है", "ਇਸ ਲਈ ਭਿੰਨ ਹੈ"],
  ["therefore the fraction is", "इसलिए भिन्न है", "ਇਸ ਲਈ ਭਿੰਨ ਹੈ"],
  ["the fraction is", "भिन्न है", "ਭਿੰਨ ਹੈ"],
  ["has denominator", "का हर है", "ਦਾ ਹਰ ਹੈ"],
  ["therefore the factor", "इसलिए गुणनखंड", "ਇਸ ਲਈ ਗੁਣਨਖੰਡ"],
  ["must be cancelled by the numerator.", "को अंश द्वारा पूरी तरह काटना होगा।", "ਨੂੰ ਅੰਸ਼ ਦੁਆਰਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ।"],
  ["must be cancelled by the numerator", "को अंश द्वारा पूरी तरह काटना होगा", "ਨੂੰ ਅੰਸ਼ ਦੁਆਰਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ"],
  ["a tail of recurring 9s reaches the next terminating decimal exactly.", "आवर्ती 9 की पूँछ ठीक अगले सांत दशमलव तक पहुँचती है।", "ਆਵਰਤੀ 9 ਦੀ ਲੜੀ ਬਿਲਕੁਲ ਅਗਲੇ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ।"],
  ["tail of recurring 9s", "आवर्ती 9 की पूँछ", "ਆਵਰਤੀ 9 ਦੀ ਲੜੀ"],
  ["reaches the next terminating decimal exactly", "ठीक अगले सांत दशमलव तक पहुँचती है", "ਬਿਲਕੁਲ ਅਗਲੇ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ"],
  ["The recurring", "आवर्ती", "ਆਵਰਤੀ"],
  ["tail fills the remaining gap to the next terminating value.", "की पूँछ अगले सांत मान तक बचा अंतर पूरा कर देती है।", "ਦੀ ਲੜੀ ਅਗਲੇ ਸਮਾਪਤ ਮੁੱਲ ਤੱਕ ਬਚਿਆ ਅੰਤਰ ਪੂਰਾ ਕਰ ਦਿੰਦੀ ਹੈ।"],
  ["tail fills the remaining gap to the next terminating value", "की पूँछ अगले सांत मान तक बचा अंतर पूरा कर देती है", "ਦੀ ਲੜੀ ਅਗਲੇ ਸਮਾਪਤ ਮੁੱਲ ਤੱਕ ਬਚਿਆ ਅੰਤਰ ਪੂਰਾ ਕਰ ਦਿੰਦੀ ਹੈ"],
  ["reduced denominator containing only", "सरल हर में केवल", "ਸਰਲ ਹਰ ਵਿੱਚ ਕੇਵਲ"],
  ["the reduced denominator contains primes other than", "सरल हर में इनके अलावा अभाज्य गुणनखंड हैं:", "ਸਰਲ ਹਰ ਵਿੱਚ ਇਨ੍ਹਾਂ ਤੋਂ ਇਲਾਵਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ:"],
  ["reduced denominator contains primes other than", "सरल हर में इनके अलावा अभाज्य गुणनखंड हैं:", "ਸਰਲ ਹਰ ਵਿੱਚ ਇਨ੍ਹਾਂ ਤੋਂ ਇਲਾਵਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ:"],
  ["the reduced denominator contains primes", "सरल हर में अभाज्य गुणनखंड हैं", "ਸਰਲ ਹਰ ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ"],
  ["reduced denominator contains primes", "सरल हर में अभाज्य गुणनखंड हैं", "ਸਰਲ ਹਰ ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ"],
  ["the factor", "गुणनखंड", "ਗੁਣਨਖੰਡ"],
  ["makes the decimal recurring.", "दशमलव को आवर्ती बनाता है।", "ਦਸ਼ਮਲਵ ਨੂੰ ਆਵਰਤੀ ਬਣਾਉਂਦਾ ਹੈ।"],
  ["makes the decimal recurring", "दशमलव को आवर्ती बनाता है", "ਦਸ਼ਮਲਵ ਨੂੰ ਆਵਰਤੀ ਬਣਾਉਂਦਾ ਹੈ"],
  ["is terminating after reduction?", "क्या सरल करने के बाद सांत है?", "ਕੀ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਹੈ?"],
  ["terminating after reduction?", "सरल करने के बाद सांत है?", "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਹੈ?"],
  ["is divisible by", "से विभाज्य है", "ਨਾਲ ਭਾਗਯੋਗ ਹੈ"],
  ["to be divisible by", "का इससे विभाज्य होना", "ਦਾ ਇਸ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ"],
  ["divisible by", "से विभाज्य", "ਨਾਲ ਭਾਗਯੋਗ"],
  ["The statement is true.", "कथन सत्य है।", "ਕਥਨ ਸਹੀ ਹੈ।"],
  ["The statement is false.", "कथन असत्य है।", "ਕਥਨ ਗਲਤ ਹੈ।"],
  ["statement is true", "कथन सत्य है", "ਕਥਨ ਸਹੀ ਹੈ"],
  ["statement is false", "कथन असत्य है", "ਕਥਨ ਗਲਤ ਹੈ"],
  ["cannot force", "सुनिश्चित नहीं कर सकता", "ਯਕੀਨੀ ਨਹੀਂ ਕਰ ਸਕਦਾ"],
  ["does not force", "सुनिश्चित नहीं करता", "ਯਕੀਨੀ ਨਹੀਂ ਕਰਦਾ"],
  ["is sufficient", "पर्याप्त है", "ਕਾਫ਼ੀ ਹੈ"],
  ["is insufficient", "अपर्याप्त है", "ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ"],
  ["digits.", "अंक हैं।", "ਅੰਕ ਹਨ।"],
  ["digit.", "अंक है।", "ਅੰਕ ਹੈ।"],
  ["digits", "अंक", "ਅੰਕ"],
  ["digit", "अंक", "ਅੰਕ"],
  [", so", ", अतः", ", ਇਸ ਲਈ"],
  [" so ", " अतः ", " ਇਸ ਲਈ "],
];

function hardenText(input: string, locale: NumCp002TranslatedLocale): string {
  let output = input;
  for (const [en, hi, pa] of HARDENING_RULES) output = output.split(en).join(tx(locale, hi, pa));
  output = output.replace(/\bor\b/gu, tx(locale, "या", "ਜਾਂ"));
  output = output.replace(/\bnot\b/gu, tx(locale, "न कि", "ਨਾ ਕਿ"));
  output = output.replace(/\bis\b/gu, tx(locale, "क्या", "ਕੀ"));
  return output;
}

function asState(q: NumCp002LocalizedQuestion): Record<string, unknown> {
  return q.hiddenState as unknown as Record<string, unknown>;
}

function num(state: Record<string, unknown>, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`NUM-CP-002 localization: missing numeric state ${key}`);
  return value;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function primeFactorizationTex(value: number): string {
  let n = Math.abs(Math.trunc(value));
  if (n <= 1) return String(n);
  const parts: string[] = [];
  for (let p = 2; p * p <= n; p += 1) {
    let exp = 0;
    while (n % p === 0) {
      n /= p;
      exp += 1;
    }
    if (exp > 0) parts.push(exp === 1 ? String(p) : `${p}^{${exp}}`);
  }
  if (n > 1) parts.push(String(n));
  return parts.join("\\times");
}

function factorOutTwoFive(value: number): number {
  let n = Math.abs(Math.trunc(value));
  while (n > 0 && n % 2 === 0) n /= 2;
  while (n > 0 && n % 5 === 0) n /= 5;
  return n;
}

function powerOf(value: number, prime: number): number {
  let n = Math.abs(Math.trunc(value));
  let exp = 0;
  while (n > 0 && n % prime === 0) {
    n /= prime;
    exp += 1;
  }
  return exp;
}

function innerMath(value: string): string {
  const match = value.match(/^\\\((.*)\\\)$/s);
  return match ? match[1]! : value;
}

function validTerminatingDenominators(numerator: number, maxD: number): readonly number[] {
  const values: number[] = [];
  for (let d = 2; d <= maxD; d += 1) {
    const g = gcd(numerator, d);
    const reducedD = d / g;
    if (factorOutTwoFive(reducedD) === 1) values.push(d);
  }
  return Object.freeze(values);
}

function setTex(values: readonly number[]): string {
  return `\\{${values.join(",")}\\}`;
}

type EditorialSurface = Readonly<{
  stem?: string;
  concept?: string;
  solution?: readonly string[];
}>;

function polishQl148(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  if (typeof state.block === "number" && typeof state.digits === "number") {
    return {
      concept: tx(locale,
        `यदि आवर्ती खंड में \\(k\\) अंक हों, तो दशमलव हटाने पर बनने वाले हर में \\(k\\) बार 9 आता है।`,
        `ਜੇ ਆਵਰਤੀ ਖੰਡ ਵਿੱਚ \\(k\\) ਅੰਕ ਹੋਣ, ਤਾਂ ਦਸ਼ਮਲਵ ਹਟਾਉਣ ਤੇ ਬਣੇ ਹਰ ਵਿੱਚ \\(k\\) ਵਾਰ 9 ਆਉਂਦਾ ਹੈ।`),
    };
  }
  if (typeof state.prefix === "number" && typeof state.block === "number") {
    return {
      concept: tx(locale,
        "दशमलव को आवर्ती खंड के बाद तक खिसकाइए और फिर आवर्ती खंड शुरू होने से ठीक पहले वाले खिसकाव को घटाइए।",
        "ਦਸ਼ਮਲਵ ਨੂੰ ਆਵਰਤੀ ਖੰਡ ਤੋਂ ਅੱਗੇ ਤੱਕ ਖਿਸਕਾਓ ਅਤੇ ਫਿਰ ਆਵਰਤੀ ਖੰਡ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਵਾਲਾ ਖਿਸਕਾਵ ਘਟਾਓ।"),
    };
  }
  return {};
}

function polishQl149(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const n = num(state, "n");
  const d = num(state, "d");
  const g = gcd(n, d);
  const rd = d / g;
  const factor = primeFactorizationTex(rd);
  return { solution: Object.freeze([
    tx(locale,
      `सरल हर \\(${rd}\\) का अभाज्य गुणनखंडन \\(${factor}\\) है; इसमें \\(2\\) और \\(5\\) के अलावा कोई अभाज्य गुणनखंड नहीं है।`,
      `ਸਰਲ ਹਰ \\(${rd}\\) ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ \\(${factor}\\) ਹੈ; ਇਸ ਵਿੱਚ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਇਲਾਵਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਹੀਂ ਹੈ।`),
    `\\(\\frac{${n}}{${d}}=${innerMath(q.canonicalAnswer)}\\).`,
  ]) };
}

function polishQl150(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const n = num(state, "n");
  const d = num(state, "d");
  return { solution: Object.freeze([
    tx(locale, "सटीक दीर्घ भाग में शेष दोहरते हैं, इसलिए दशमलव आवर्ती है।", "ਸਹੀ ਲੰਬੇ ਭਾਗ ਵਿੱਚ ਸ਼ੇਸ਼ ਦੁਹਰਾਉਂਦੇ ਹਨ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਆਵਰਤੀ ਹੈ।"),
    `\\(\\frac{${n}}{${d}}=${innerMath(q.canonicalAnswer)}\\).`,
  ]) };
}

function polishQl154(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const n = num(state, "n");
  const d = num(state, "d");
  const g = gcd(n, d);
  const rn = n / g;
  const rd = d / g;
  const bad = factorOutTwoFive(rd);
  return {
    concept: tx(locale,
      "पहले भिन्न को सरल कीजिए। सरल हर में \\(2\\) और \\(5\\) के अलावा कोई अभाज्य गुणनखंड न हो तो दशमलव सांत होता है।",
      "ਪਹਿਲਾਂ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰੋ। ਸਰਲ ਹਰ ਵਿੱਚ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਇਲਾਵਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਾ ਹੋਵੇ ਤਾਂ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੁੰਦਾ ਹੈ।"),
    solution: Object.freeze([
      `\\(\\frac{${n}}{${d}}=\\frac{${rn}}{${rd}}\\).`,
      bad === 1
        ? tx(locale,
            `सरल हर \\(${rd}\\) में \\(2\\) और \\(5\\) के अलावा कोई अभाज्य गुणनखंड नहीं है, इसलिए दशमलव सांत है।`,
            `ਸਰਲ ਹਰ \\(${rd}\\) ਵਿੱਚ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਇਲਾਵਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੈ।`)
        : tx(locale,
            `सरल हर \\(${rd}\\) में \\(2\\) और \\(5\\) के अलावा \\(${primeFactorizationTex(bad)}\\) का गुणनखंड है, इसलिए दशमलव असांत आवर्ती है।`,
            `ਸਰਲ ਹਰ \\(${rd}\\) ਵਿੱਚ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਇਲਾਵਾ \\(${primeFactorizationTex(bad)}\\) ਦਾ ਗੁਣਨਖੰਡ ਹੈ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਅਸਮਾਪਤ ਆਵਰਤੀ ਹੈ।`),
    ]),
  };
}

function polishQl155(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const n = num(state, "n");
  const d = num(state, "d");
  const g = gcd(n, d);
  const rd = d / g;
  const a = powerOf(rd, 2);
  const b = powerOf(rd, 5);
  const places = Math.max(a, b);
  return {
    concept: tx(locale,
      "यदि सरल हर \\(2^a5^b\\) है, तो सटीक सांत दशमलव में \\(\\max(a,b)\\) दशमलव स्थान होते हैं।",
      "ਜੇ ਸਰਲ ਹਰ \\(2^a5^b\\) ਹੈ, ਤਾਂ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਵਿੱਚ \\(\\max(a,b)\\) ਦਸ਼ਮਲਵ ਸਥਾਨ ਹੁੰਦੇ ਹਨ।"),
    solution: Object.freeze([
      tx(locale, `सरल हर \\(${rd}=${primeFactorizationTex(rd)}\\) है।`, `ਸਰਲ ਹਰ \\(${rd}=${primeFactorizationTex(rd)}\\) ਹੈ।`),
      tx(locale, `\\(\\max(${a},${b})=${places}\\), इसलिए आवश्यक दशमलव स्थान \\(${places}\\) हैं।`, `\\(\\max(${a},${b})=${places}\\), ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਦਸ਼ਮਲਵ ਸਥਾਨ \\(${places}\\) ਹਨ।`),
    ]),
  };
}

function polishQl156(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const unknown = String(state.unknown);
  const fixed = num(state, "fixed");
  const places = num(state, "places");
  const maxExpr = unknown === "a" ? `\\max(a,${fixed})=${places}` : `\\max(${fixed},b)=${places}`;
  return {
    concept: tx(locale,
      "हर \\(2^a5^b\\) के लिए सटीक सांत दशमलव के स्थानों की संख्या \\(\\max(a,b)\\) होती है।",
      "ਹਰ \\(2^a5^b\\) ਲਈ ਸਹੀ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦੇ ਸਥਾਨਾਂ ਦੀ ਗਿਣਤੀ \\(\\max(a,b)\\) ਹੁੰਦੀ ਹੈ।"),
    solution: Object.freeze([
      `\\(${maxExpr}\\).`,
      tx(locale,
        `क्योंकि स्थिर घात \\(${fixed}\\), \\(${places}\\) से छोटी है, इसलिए \\(${unknown}=${places}\\).`,
        `ਕਿਉਂਕਿ ਸਥਿਰ ਘਾਤ \\(${fixed}\\), \\(${places}\\) ਤੋਂ ਛੋਟੀ ਹੈ, ਇਸ ਲਈ \\(${unknown}=${places}\\).`),
    ]),
  };
}

function polishQl157(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const n = num(state, "n");
  const d = num(state, "d");
  const bad = factorOutTwoFive(d);
  const dividesDenominator = locale === "hi-IN" ? q.stem.includes("हर को") : q.stem.includes("ਹਰ ਨੂੰ");
  return {
    concept: tx(locale,
      "सरल करने के बाद सांत दशमलव के हर में केवल \\(2\\) और \\(5\\) के अभाज्य गुणनखंड रह सकते हैं।",
      "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦੇ ਹਰ ਵਿੱਚ ਕੇਵਲ \\(2\\) ਅਤੇ \\(5\\) ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਰਹਿ ਸਕਦੇ ਹਨ।"),
    solution: Object.freeze([
      tx(locale,
        `\\(\\frac{${n}}{${d}}\\) के हर का अभाज्य गुणनखंडन \\(${primeFactorizationTex(d)}\\) है; हटाने वाला भाग \\(${bad}\\) है।`,
        `\\(\\frac{${n}}{${d}}\\) ਦੇ ਹਰ ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ \\(${primeFactorizationTex(d)}\\) ਹੈ; ਹਟਾਉਣ ਵਾਲਾ ਭਾਗ \\(${bad}\\) ਹੈ।`),
      dividesDenominator
        ? tx(locale,
            `हर को \\(${bad}\\) से भाग देने पर यह भाग हट जाता है, इसलिए न्यूनतम पूर्णांक \\(${bad}\\) है।`,
            `ਹਰ ਨੂੰ \\(${bad}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇਹ ਭਾਗ ਹਟ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਪੂਰਨ ਅੰਕ \\(${bad}\\) ਹੈ।`)
        : tx(locale,
            `भिन्न को \\(${bad}\\) से गुणा करने पर यह भाग कट जाता है, इसलिए न्यूनतम पूर्णांक \\(${bad}\\) है।`,
            `ਭਿੰਨ ਨੂੰ \\(${bad}\\) ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਇਹ ਭਾਗ ਕੱਟ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਪੂਰਨ ਅੰਕ \\(${bad}\\) ਹੈ।`),
    ]),
  };
}

function polishQl158Or159(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const numerator = num(state, "numerator");
  const maxD = num(state, "maxD");
  const values = validTerminatingDenominators(numerator, maxD);
  const set = setTex(values);
  const commonConcept = tx(locale,
    "सरल करने के बाद हर में केवल \\(2\\) और \\(5\\) के अभाज्य गुणनखंड रहने चाहिए।",
    "ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹਰ ਵਿੱਚ ਕੇਵਲ \\(2\\) ਅਤੇ \\(5\\) ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ।");
  const rule = tx(locale,
    `इसलिए \\(d\\) का \\(2\\) और \\(5\\) से मुक्त भाग \\(${numerator}\\) को विभाजित करना चाहिए।`,
    `ਇਸ ਲਈ \\(d\\) ਦਾ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਮੁਕਤ ਭਾਗ \\(${numerator}\\) ਨੂੰ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।`);
  if (q.permanentQlId === "NUM-QL-158") {
    return { concept: commonConcept, solution: Object.freeze([
      rule,
      tx(locale,
        `\\(2\\le d\\le${maxD}\\) में मान्य हर हैं \\(${set}\\), इसलिए कुल \\(${values.length}\\) मान हैं।`,
        `\\(2\\le d\\le${maxD}\\) ਵਿੱਚ ਮਾਨਯ ਹਰ ਹਨ \\(${set}\\), ਇਸ ਲਈ ਕੁੱਲ \\(${values.length}\\) ਮੁੱਲ ਹਨ।`),
    ]) };
  }
  return { concept: commonConcept, solution: Object.freeze([
    rule,
    tx(locale, `\\(2\\le d\\le${maxD}\\) में पूरा समुच्चय \\(${set}\\) है।`, `\\(2\\le d\\le${maxD}\\) ਵਿੱਚ ਪੂਰਾ ਸਮੂਹ \\(${set}\\) ਹੈ।`),
  ]) };
}

function polishQl160(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  if (typeof state.d === "number") {
    const d = num(state, "d");
    const bad = factorOutTwoFive(d);
    return {
      concept: tx(locale,
        "अंश को हर के उन सभी अभाज्य गुणनखंडों को पूरी तरह काटना होगा जो \\(2\\) और \\(5\\) से अलग हैं।",
        "ਅੰਸ਼ ਨੂੰ ਹਰ ਦੇ ਉਹਨਾਂ ਸਾਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ ਜੋ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਵੱਖਰੇ ਹਨ।"),
      solution: Object.freeze([
        tx(locale,
          `\\(${d}=${primeFactorizationTex(d)}\\); इसलिए अंश को \\(${bad}\\) वाले भाग को पूरी तरह काटना होगा।`,
          `\\(${d}=${primeFactorizationTex(d)}\\); ਇਸ ਲਈ ਅੰਸ਼ ਨੂੰ \\(${bad}\\) ਵਾਲੇ ਭਾਗ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ।`),
        tx(locale, `विकल्पों में ${q.canonicalAnswer} यह कटाव पूरा करता है।`, `ਵਿਕਲਪਾਂ ਵਿੱਚ ${q.canonicalAnswer} ਇਹ ਕਟੌਤੀ ਪੂਰੀ ਕਰਦਾ ਹੈ।`),
      ]),
    };
  }
  const badPrime = num(state, "badPrime");
  const badExp = num(state, "badExp");
  return {
    concept: tx(locale,
      "हर का प्रत्येक अभाज्य गुणनखंड जो \\(2\\) और \\(5\\) से अलग है, अंश से पूरी तरह कटना चाहिए।",
      "ਹਰ ਦਾ ਹਰ ਅਭਾਜ ਗੁਣਨਖੰਡ ਜੋ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਵੱਖਰਾ ਹੈ, ਅੰਸ਼ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਚਾਹੀਦਾ ਹੈ।"),
    solution: Object.freeze([
      tx(locale, `हर में हटाने वाला भाग \\(${badPrime}^{${badExp}}\\) है।`, `ਹਰ ਵਿੱਚ ਹਟਾਉਣ ਵਾਲਾ ਭਾਗ \\(${badPrime}^{${badExp}}\\) ਹੈ।`),
      tx(locale, `इसे पूरा काटने के लिए न्यूनतम घात \\(x=${badExp}\\) है।`, `ਇਸ ਨੂੰ ਪੂਰਾ ਕੱਟਣ ਲਈ ਘੱਟੋ-ਘੱਟ ਘਾਤ \\(x=${badExp}\\) ਹੈ।`),
    ]),
  };
}

function polishQl164(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const solution = q.explanation.solution.map((raw) => {
    let line = hardenText(raw, locale);
    line = line.replace(/^I\. A /u, "I. ");
    line = line.replace(", अतः हैं, इसलिए दशमलव सांत है।", ", इसलिए दशमलव सांत है।");
    line = line.replace(", ਇਸ ਲਈ ਹਨ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੈ।", ", ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੈ।");
    line = line.replace("सरल हर में अभाज्य गुणनखंड हैं के अलावा है \\(2\\) और \\(5\\).", "सरल हर में \\(2\\) और \\(5\\) के अलावा अन्य अभाज्य गुणनखंड हैं।");
    line = line.replace("ਸਰਲ ਹਰ ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ ਤੋਂ ਇਲਾਵਾ ਹੈ \\(2\\) ਅਤੇ \\(5\\).", "ਸਰਲ ਹਰ ਵਿੱਚ \\(2\\) ਅਤੇ \\(5\\) ਤੋਂ ਇਲਾਵਾ ਹੋਰ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹਨ।");
    return line;
  });
  return { solution: Object.freeze(solution) };
}

function polishQl165(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  const state = asState(q);
  const d = num(state, "d");
  const k1 = num(state, "k1");
  const k2 = num(state, "k2");
  const bad = factorOutTwoFive(d);
  const both = (k1 * k2) / gcd(k1, k2);
  const iEnough = k1 % bad === 0;
  const iiEnough = k2 % bad === 0;
  const bothEnough = both % bad === 0;
  let solution: string;
  if (iEnough) {
    solution = tx(locale,
      `कथन I से \\(n\\), \\(${k1}\\) से विभाज्य है और इससे आवश्यक \\(${bad}\\) वाला भाग पूरा कट जाता है। इसलिए केवल कथन I पर्याप्त है।`,
      `ਕਥਨ I ਤੋਂ \\(n\\), \\(${k1}\\) ਨਾਲ ਭਾਗਯੋਗ ਹੈ ਅਤੇ ਇਸ ਨਾਲ ਲੋੜੀਂਦਾ \\(${bad}\\) ਵਾਲਾ ਭਾਗ ਪੂਰਾ ਕੱਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ।`);
  } else if (iiEnough) {
    solution = tx(locale,
      `कथन II से \\(n\\), \\(${k2}\\) से विभाज्य है और इससे आवश्यक \\(${bad}\\) वाला भाग पूरा कट जाता है। इसलिए केवल कथन II पर्याप्त है।`,
      `ਕਥਨ II ਤੋਂ \\(n\\), \\(${k2}\\) ਨਾਲ ਭਾਗਯੋਗ ਹੈ ਅਤੇ ਇਸ ਨਾਲ ਲੋੜੀਂਦਾ \\(${bad}\\) ਵਾਲਾ ਭਾਗ ਪੂਰਾ ਕੱਟ ਜਾਂਦਾ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ।`);
  } else if (bothEnough) {
    solution = tx(locale,
      `अलग-अलग कोई कथन पर्याप्त नहीं है, लेकिन दोनों मिलकर \\(n\\) को \\(${both}\\) से विभाज्य बनाते हैं। इससे आवश्यक \\(${bad}\\) वाला भाग कट जाता है।`,
      `ਅਲੱਗ-ਅਲੱਗ ਕੋਈ ਕਥਨ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ, ਪਰ ਦੋਵੇਂ ਮਿਲ ਕੇ \\(n\\) ਨੂੰ \\(${both}\\) ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਂਦੇ ਹਨ। ਇਸ ਨਾਲ ਲੋੜੀਂਦਾ \\(${bad}\\) ਵਾਲਾ ਭਾਗ ਕੱਟ ਜਾਂਦਾ ਹੈ।`);
  } else {
    solution = tx(locale,
      `दोनों कथन मिलकर भी केवल \\(${both}\\) की विभाज्यता सुनिश्चित करते हैं, जो आवश्यक \\(${bad}\\) वाले भाग को पूरा नहीं काटती। इसलिए दोनों साथ में भी अपर्याप्त हैं।`,
      `ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕੇਵਲ \\(${both}\\) ਨਾਲ ਭਾਗਯੋਗਤਾ ਯਕੀਨੀ ਕਰਦੇ ਹਨ, ਜੋ ਲੋੜੀਂਦੇ \\(${bad}\\) ਵਾਲੇ ਭਾਗ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕੱਟਦੀ। ਇਸ ਲਈ ਦੋਵੇਂ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।`);
  }
  return {
    stem: tx(locale,
      `एक धनात्मक पूर्णांक \\(n\\) के लिए बताइए: क्या \\(\\frac{n}{${d}}\\) सरल करने के बाद सांत दशमलव देगा?\nकथन I: \\(n\\), \\(${k1}\\) से विभाज्य है।\nकथन II: \\(n\\), \\(${k2}\\) से विभाज्य है।\nकौन-सा विकल्प कथनों की पर्याप्तता को सही बताता है?`,
      `ਇੱਕ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ \\(n\\) ਲਈ ਦੱਸੋ: ਕੀ \\(\\frac{n}{${d}}\\) ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਦੇਵੇਗਾ?\nਕਥਨ I: \\(n\\), \\(${k1}\\) ਨਾਲ ਭਾਗਯੋਗ ਹੈ।\nਕਥਨ II: \\(n\\), \\(${k2}\\) ਨਾਲ ਭਾਗਯੋਗ ਹੈ।\nਕਿਹੜਾ ਵਿਕਲਪ ਕਥਨਾਂ ਦੀ ਕਾਫ਼ੀ ਹੋਣ ਦੀ ਸਥਿਤੀ ਨੂੰ ਸਹੀ ਦੱਸਦਾ ਹੈ?`),
    concept: tx(locale,
      `दशमलव सांत होने के लिए \\(n\\) को हर के \\(${bad}\\) वाले भाग को पूरी तरह काटना होगा; \\(2\\) और \\(5\\) के गुणनखंड रहने से समस्या नहीं होती।`,
      `ਦਸ਼ਮਲਵ ਸਮਾਪਤ ਹੋਣ ਲਈ \\(n\\) ਨੂੰ ਹਰ ਦੇ \\(${bad}\\) ਵਾਲੇ ਭਾਗ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਟਣਾ ਹੋਵੇਗਾ; \\(2\\) ਅਤੇ \\(5\\) ਦੇ ਗੁਣਨਖੰਡ ਰਹਿਣ ਨਾਲ ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ ਹੁੰਦੀ।`),
    solution: Object.freeze([solution]),
  };
}

function editorialSurface(q: NumCp002LocalizedQuestion, locale: NumCp002TranslatedLocale): EditorialSurface {
  switch (q.permanentQlId) {
    case "NUM-QL-148": return polishQl148(q, locale);
    case "NUM-QL-149": return polishQl149(q, locale);
    case "NUM-QL-150": return polishQl150(q, locale);
    case "NUM-QL-154": return polishQl154(q, locale);
    case "NUM-QL-155": return polishQl155(q, locale);
    case "NUM-QL-156": return polishQl156(q, locale);
    case "NUM-QL-157": return polishQl157(q, locale);
    case "NUM-QL-158":
    case "NUM-QL-159": return polishQl158Or159(q, locale);
    case "NUM-QL-160": return polishQl160(q, locale);
    case "NUM-QL-164": return polishQl164(q, locale);
    case "NUM-QL-165": return polishQl165(q, locale);
    default: return {};
  }
}

export function runNumCp002LocalizedFinalPipeline(input: NumCp002LocalizedRuntimeInput): NumCp002LocalizedQuestion {
  const q = runNumCp002LocalizedPipeline(input);
  const patch = editorialSurface(q, input.locale);
  const fallbackConcept = q.explanation.concept ? hardenText(q.explanation.concept, input.locale) : undefined;
  const concept = patch.concept ?? fallbackConcept;
  const hardened: NumCp002LocalizedQuestion = {
    ...q,
    stem: patch.stem ?? hardenText(q.stem, input.locale),
    explanation: Object.freeze({
      ...(concept ? { concept } : {}),
      solution: Object.freeze(patch.solution ?? q.explanation.solution.map((line) => hardenText(line, input.locale))),
      finalAnswer: q.explanation.finalAnswer,
    }),
  };
  return Object.freeze(hardened);
}
