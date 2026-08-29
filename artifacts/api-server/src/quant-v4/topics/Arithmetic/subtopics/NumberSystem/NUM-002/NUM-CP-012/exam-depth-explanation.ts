type Language = "en" | "hi" | "pa";

type FactorPair = readonly [bigint, number];

type ExplanationPackage = Readonly<{
  temporaryPrototypeId: string;
  hiddenState: Readonly<Record<string, unknown>>;
  canonicalAnswer: string;
  options: readonly { readonly value: string }[];
}>;

export type NumCp012ExamDepthExplanation = Readonly<{
  standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
  fullDerivation: readonly string[];
  examShortcut: readonly string[];
  lines: readonly string[];
}>;

function L(language: Language, en: string, hi: string, pa: string) {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function field(state: Readonly<Record<string, unknown>>, key: string) {
  if (!(key in state)) throw new Error(`NUM-CP-012 exam-depth explanation missing state field ${key}.`);
  return state[key];
}

function text(state: Readonly<Record<string, unknown>>, key: string) {
  const item = field(state, key);
  return typeof item === "bigint" ? item.toString() : String(item);
}

function num(state: Readonly<Record<string, unknown>>, key: string) {
  const parsed = Number(field(state, key));
  if (!Number.isFinite(parsed)) throw new Error(`NUM-CP-012 exam-depth field ${key} is not numeric.`);
  return parsed;
}

function big(state: Readonly<Record<string, unknown>>, key: string) {
  return BigInt(text(state, key));
}

function pairs(state: Readonly<Record<string, unknown>>, key = "factors"): FactorPair[] {
  const item = field(state, key);
  if (!Array.isArray(item)) throw new Error(`NUM-CP-012 exam-depth factor field ${key} is not an array.`);
  return item.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2) throw new Error(`NUM-CP-012 malformed factor pair in ${key}.`);
    return [BigInt(String(entry[0])), Number(entry[1])] as const;
  });
}

function pow(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function factorText(factors: readonly FactorPair[]) {
  if (factors.length === 0) return "1";
  return factors.map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

function factorValuesText(factors: readonly FactorPair[]) {
  if (factors.length === 0) return "1";
  return factors.map(([prime, exponent]) => `${pow(prime, exponent)}`).join(" × ");
}

function product(factors: readonly FactorPair[]) {
  return factors.reduce((acc, [prime, exponent]) => acc * pow(prime, exponent), 1n);
}

function factorize(input: bigint): FactorPair[] {
  let remaining = input < 0n ? -input : input;
  if (remaining <= 1n) return [];
  const out: FactorPair[] = [];
  let prime = 2n;
  while (prime * prime <= remaining) {
    if (remaining % prime !== 0n) {
      prime += 1n;
      continue;
    }
    let exponent = 0;
    while (remaining % prime === 0n) {
      exponent += 1;
      remaining /= prime;
    }
    out.push([prime, exponent] as const);
    prime += 1n;
  }
  if (remaining > 1n) out.push([remaining, 1] as const);
  return out;
}

function floorRoot(input: bigint, k: number) {
  const target = input < 0n ? -input : input;
  if (target <= 1n) return target;
  let low = 0n;
  let high = 1n;
  while (pow(high, k) <= target) high *= 2n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (pow(mid, k) <= target) low = mid;
    else high = mid;
  }
  return low;
}

function powerLabel(k: number, language: Language) {
  if (k === 2) return L(language, "perfect square", "पूर्ण वर्ग", "ਪੂਰਨ ਵਰਗ");
  if (k === 3) return L(language, "perfect cube", "पूर्ण घन", "ਪੂਰਨ ਘਨ");
  return L(language, `perfect ${k}th power`, `पूर्ण ${k}वीं घात`, `ਪੂਰਨ ${k}ਵੀਂ ਘਾਤ`);
}

function rootLabel(k: number, language: Language) {
  if (k === 2) return L(language, "square root", "वर्गमूल", "ਵਰਗਮੂਲ");
  if (k === 3) return L(language, "cube root", "घनमूल", "ਘਨਮੂਲ");
  return L(language, `${k}th root`, `${k}वाँ मूल`, `${k}ਵਾਂ ਮੂਲ`);
}

function divisionTrail(start: bigint, factors: readonly FactorPair[], language: Language) {
  const lines: string[] = [];
  let current = start < 0n ? -start : start;
  lines.push(L(
    language,
    `Derive the prime factorisation by repeated exact division from ${current}.`,
    `${current} से बार-बार सटीक भाग करके अभाज्य गुणनखंडन निकालें।`,
    `${current} ਤੋਂ ਵਾਰ-ਵਾਰ ਪੂਰਾ ਭਾਗ ਕਰਕੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੱਢੋ।`,
  ));
  for (const [prime, exponent] of factors) {
    for (let count = 1; count <= exponent; count += 1) {
      const next = current / prime;
      lines.push(`${current} ÷ ${prime} = ${next}.`);
      current = next;
    }
  }
  lines.push(L(
    language,
    `The quotient is now ${current}; hence the factorisation is ${factorText(factors)}.`,
    `अब भागफल ${current} है; इसलिए गुणनखंडन ${factorText(factors)} है।`,
    `ਹੁਣ ਭਾਗਫਲ ${current} ਹੈ; ਇਸ ਲਈ ਗੁਣਨਖੰਡ ${factorText(factors)} ਹੈ।`,
  ));
  return lines;
}

function powerCalculation(base: bigint, k: number, language: Language) {
  if (k === 2) {
    return [
      L(language, `Calculate ${base}^2 explicitly.`, `${base}^2 का मान स्पष्ट रूप से निकालें।`, `${base}^2 ਦਾ ਮੁੱਲ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਕੱਢੋ।`),
      `${base} × ${base} = ${base * base}.`,
    ];
  }
  if (k === 3) {
    const square = base * base;
    return [
      `${base}^2 = ${base} × ${base} = ${square}.`,
      `${base}^3 = ${square} × ${base} = ${square * base}.`,
    ];
  }
  if (k === 4) {
    const square = base * base;
    return [
      `${base}^2 = ${base} × ${base} = ${square}.`,
      `${base}^4 = ${square} × ${square} = ${square * square}.`,
    ];
  }
  return [`${base}^${k} = ${pow(base, k)}.`];
}

function derive(pkg: ExplanationPackage, language: Language) {
  const s = pkg.hiddenState;
  const prototype = pkg.temporaryPrototypeId;

  if (prototype === "NUM-CP012-PROT-001") {
    const k = num(s, "k");
    const perfect = big(s, "perfect");
    const factors = pairs(s);
    const rootFactors = factors.map(([prime, exponent]) => [prime, exponent / k] as const);
    const root = product(rootFactors);
    return {
      full: [
        L(language, `We must prove an option is an exact ${powerLabel(k, language)}, not merely close to one.`, `हमें सिद्ध करना है कि विकल्प ठीक ${powerLabel(k, language)} है, केवल पास की संख्या नहीं।`, `ਸਾਨੂੰ ਸਾਬਤ ਕਰਨਾ ਹੈ ਕਿ ਵਿਕਲਪ ਠੀਕ ${powerLabel(k, language)} ਹੈ, ਸਿਰਫ਼ ਨੇੜਲੀ ਗਿਣਤੀ ਨਹੀਂ।`),
        ...divisionTrail(perfect, factors, language),
        ...factors.map(([prime, exponent]) => `${exponent} ÷ ${k} = ${exponent / k}, remainder 0 for prime ${prime}.`),
        L(language, `So the ${k}th root is ${factorText(rootFactors)} = ${root}.`, `इसलिए ${k}वाँ मूल ${factorText(rootFactors)} = ${root} है।`, `ਇਸ ਲਈ ${k}ਵਾਂ ਮੂਲ ${factorText(rootFactors)} = ${root} ਹੈ।`),
        ...powerCalculation(root, k, language),
        L(language, `This reproduces ${perfect}, so ${perfect} is the required ${powerLabel(k, language)}.`, `इससे फिर ${perfect} मिलता है, इसलिए यही आवश्यक ${powerLabel(k, language)} है।`, `ਇਸ ਨਾਲ ਮੁੜ ${perfect} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਲੋੜੀਂਦਾ ${powerLabel(k, language)} ਹੈ।`),
      ],
      shortcut: [
        L(language, `All exponents in ${factorText(factors)} are multiples of ${k}; that is sufficient.`, `${factorText(factors)} की सभी घातें ${k} के गुणज हैं; यही पर्याप्त है।`, `${factorText(factors)} ਦੀਆਂ ਸਾਰੀਆਂ ਘਾਤਾਂ ${k} ਦੇ ਗੁਣਜ ਹਨ; ਇਹੀ ਕਾਫ਼ੀ ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-002") {
    const k = num(s, "k");
    const target = big(s, "value");
    const factors = factorize(target);
    const rootFactors = factors.map(([prime, exponent]) => [prime, exponent / k] as const);
    const root = big(s, "root");
    return {
      full: [
        L(language, `We need the exact integer ${rootLabel(k, language)} of ${target}.`, `हमें ${target} का सटीक पूर्णांक ${rootLabel(k, language)} चाहिए।`, `ਸਾਨੂੰ ${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਚਾਹੀਦਾ ਹੈ।`),
        ...divisionTrail(target, factors, language),
        ...factors.map(([, exponent]) => `${exponent} ÷ ${k} = ${exponent / k}.`),
        L(language, `Therefore the root factors are ${factorText(rootFactors)}.`, `इसलिए मूल के गुणनखंड ${factorText(rootFactors)} हैं।`, `ਇਸ ਲਈ ਮੂਲ ਦੇ ਗੁਣਨਖੰਡ ${factorText(rootFactors)} ਹਨ।`),
        ...rootFactors.map(([prime, exponent]) => `${prime}^${exponent} = ${pow(prime, exponent)}.`),
        `${factorValuesText(rootFactors)} = ${root}.`,
        ...powerCalculation(root, k, language),
        L(language, `Therefore the exact ${rootLabel(k, language)} is ${root}.`, `अतः सटीक ${rootLabel(k, language)} ${root} है।`, `ਇਸ ਲਈ ਸਹੀ ${rootLabel(k, language)} ${root} ਹੈ।`),
      ],
      shortcut: [
        `${factorText(factors)} = (${factorText(rootFactors)})^${k}.`,
        L(language, `Hence the root is ${root}.`, `अतः मूल ${root} है।`, `ਇਸ ਲਈ ਮੂਲ ${root} ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-003" || prototype === "NUM-CP012-PROT-004") {
    const k = num(s, "k");
    const n = big(s, "value");
    const factors = pairs(s);
    const multiplyMode = prototype.endsWith("003");
    const adjustmentFactors = pairs(s, multiplyMode ? "multiplierFactors" : "divisorFactors");
    const adjustment = BigInt(pkg.canonicalAnswer);
    const full: string[] = [
      L(language, multiplyMode ? `Find the least multiplier that makes ${n} a ${powerLabel(k, language)}.` : `Find the least divisor that leaves a ${powerLabel(k, language)} quotient.`, multiplyMode ? `न्यूनतम गुणक निकालें जिससे ${n} ${powerLabel(k, language)} बने।` : `न्यूनतम भाजक निकालें जिससे भागफल ${powerLabel(k, language)} बने।`, multiplyMode ? `ਘੱਟੋ-ਘੱਟ ਗੁਣਕ ਕੱਢੋ ਜਿਸ ਨਾਲ ${n} ${powerLabel(k, language)} ਬਣੇ।` : `ਘੱਟੋ-ਘੱਟ ਭਾਜਕ ਕੱਢੋ ਜਿਸ ਨਾਲ ਭਾਗਫਲ ${powerLabel(k, language)} ਬਣੇ।`),
      ...divisionTrail(n, factors, language),
    ];
    for (const [prime, exponent] of factors) {
      const remainder = exponent % k;
      const required = multiplyMode ? (k - remainder) % k : remainder;
      full.push(`${exponent} = ${Math.floor(exponent / k)} × ${k} + ${remainder}.`);
      full.push(L(language, multiplyMode ? `So add ${required} more factor(s) of ${prime}.` : `So remove ${required} factor(s) of ${prime}.`, multiplyMode ? `इसलिए ${prime} के ${required} और गुणक जोड़ें।` : `इसलिए ${prime} के ${required} गुणक हटाएँ।`, multiplyMode ? `ਇਸ ਲਈ ${prime} ਦੇ ${required} ਹੋਰ ਗੁਣਕ ਜੋੜੋ।` : `ਇਸ ਲਈ ${prime} ਦੇ ${required} ਗੁਣਕ ਹਟਾਓ।`));
    }
    full.push(L(language, `Required factor = ${factorText(adjustmentFactors)}.`, `आवश्यक गुणक = ${factorText(adjustmentFactors)}।`, `ਲੋੜੀਂਦਾ ਗੁਣਕ = ${factorText(adjustmentFactors)}।`));
    for (const [prime, exponent] of adjustmentFactors) full.push(`${prime}^${exponent} = ${pow(prime, exponent)}.`);
    full.push(`${factorValuesText(adjustmentFactors)} = ${adjustment}.`);
    if (!multiplyMode) full.push(`${n} ÷ ${adjustment} = ${big(s, "quotient")}.`);
    full.push(L(language, `Therefore the least ${multiplyMode ? "multiplier" : "divisor"} is ${adjustment}.`, `अतः न्यूनतम ${multiplyMode ? "गुणक" : "भाजक"} ${adjustment} है।`, `ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ${multiplyMode ? "ਗੁਣਕ" : "ਭਾਜਕ"} ${adjustment} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `Use only exponent remainders modulo ${k}.`, `केवल घातों के ${k} से शेष लें।`, `ਸਿਰਫ਼ ਘਾਤਾਂ ਦੇ ${k} ਨਾਲ ਬਾਕੀ ਲਵੋ।`),
        L(language, multiplyMode ? `Use k − remainder for multiplication: ${factorText(adjustmentFactors)} = ${adjustment}.` : `Remove the remainder for division: ${factorText(adjustmentFactors)} = ${adjustment}.`, multiplyMode ? `गुणा में k − शेष लें: ${factorText(adjustmentFactors)} = ${adjustment}।` : `भाग में शेष हटाएँ: ${factorText(adjustmentFactors)} = ${adjustment}।`, multiplyMode ? `ਗੁਣਾ ਵਿੱਚ k − ਬਾਕੀ ਲਵੋ: ${factorText(adjustmentFactors)} = ${adjustment}।` : `ਭਾਗ ਵਿੱਚ ਬਾਕੀ ਹਟਾਓ: ${factorText(adjustmentFactors)} = ${adjustment}।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-005" || prototype === "NUM-CP012-PROT-014") {
    const k = num(s, "k");
    const low = num(s, "low");
    const high = num(s, "high");
    const fixedExponent = num(s, "fixedExponent");
    const full: string[] = [
      `${fixedExponent} ÷ ${k} = ${fixedExponent / k}, remainder 0.`,
      L(language, `Now test every integer x from ${low} to ${high}.`, `अब ${low} से ${high} तक हर पूर्णांक x जाँचें।`, `ਹੁਣ ${low} ਤੋਂ ${high} ਤੱਕ ਹਰ ਪੂਰਨ ਅੰਕ x ਜਾਂਚੋ।`),
    ];
    const valid: number[] = [];
    for (let x = low; x <= high; x += 1) {
      const remainder = x % k;
      full.push(`${x} = ${Math.floor(x / k)} × ${k} + ${remainder}.`);
      if (remainder === 0) valid.push(x);
    }
    full.push(L(language, `Valid x values: ${valid.length ? valid.join(", ") : "none"}.`, `मान्य x: ${valid.length ? valid.join(", ") : "कोई नहीं"}।`, `ਮਾਨਯ x: ${valid.length ? valid.join(", ") : "ਕੋਈ ਨਹੀਂ"}।`));
    full.push(L(language, `Therefore the required answer is ${pkg.canonicalAnswer}.`, `अतः आवश्यक उत्तर ${pkg.canonicalAnswer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${pkg.canonicalAnswer} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `List only multiples of ${k} inside [${low}, ${high}].`, `[${low}, ${high}] में केवल ${k} के गुणज लिखें।`, `[${low}, ${high}] ਵਿੱਚ ਸਿਰਫ਼ ${k} ਦੇ ਗੁਣਜ ਲਿਖੋ।`),
        L(language, `This immediately gives ${valid.length ? valid.join(", ") : "no valid value"} and hence ${pkg.canonicalAnswer}.`, `इससे सीधे ${valid.length ? valid.join(", ") : "कोई मान नहीं"} और इसलिए ${pkg.canonicalAnswer} मिलता है।`, `ਇਸ ਨਾਲ ਸਿੱਧਾ ${valid.length ? valid.join(", ") : "ਕੋਈ ਮੁੱਲ ਨਹੀਂ"} ਅਤੇ ਇਸ ਲਈ ${pkg.canonicalAnswer} ਮਿਲਦਾ ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-006") {
    const k = num(s, "k");
    const n = big(s, "value");
    const factors = pairs(s);
    const kept = pairs(s, "divisorFactors");
    const answer = BigInt(pkg.canonicalAnswer);
    return {
      full: [
        ...divisionTrail(n, factors, language),
        L(language, `For the greatest ${powerLabel(k, language)} divisor, reduce each exponent to the largest multiple of ${k} not exceeding it.`, `सबसे बड़े ${powerLabel(k, language)} भाजक के लिए हर घात को ${k} के सबसे बड़े छोटे/बराबर गुणज तक घटाएँ।`, `ਸਭ ਤੋਂ ਵੱਡੇ ${powerLabel(k, language)} ਭਾਜਕ ਲਈ ਹਰ ਘਾਤ ਨੂੰ ${k} ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਛੋਟੇ/ਬਰਾਬਰ ਗੁਣਜ ਤੱਕ ਘਟਾਓ।`),
        ...factors.map(([prime, exponent]) => `${exponent} = ${Math.floor(exponent / k)} × ${k} + ${exponent % k}; keep exponent ${Math.floor(exponent / k) * k} for ${prime}.`),
        L(language, `Retained factorisation = ${factorText(kept)}.`, `रखा गया गुणनखंडन = ${factorText(kept)}।`, `ਰੱਖਿਆ ਗਿਆ ਗੁਣਨਖੰਡ = ${factorText(kept)}।`),
        ...kept.map(([prime, exponent]) => `${prime}^${exponent} = ${pow(prime, exponent)}.`),
        `${factorValuesText(kept)} = ${answer}.`,
        L(language, `Therefore the greatest qualifying divisor is ${answer}.`, `अतः सबसे बड़ा उपयुक्त भाजक ${answer} है।`, `ਇਸ ਲਈ ਸਭ ਤੋਂ ਵੱਡਾ ਯੋਗ ਭਾਜਕ ${answer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Round every exponent down to a multiple of ${k}: ${factorText(kept)} = ${answer}.`, `हर घात को ${k} के गुणज तक नीचे लें: ${factorText(kept)} = ${answer}।`, `ਹਰ ਘਾਤ ਨੂੰ ${k} ਦੇ ਗੁਣਜ ਤੱਕ ਹੇਠਾਂ ਲਵੋ: ${factorText(kept)} = ${answer}।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-007") {
    const k = num(s, "k");
    const low = big(s, "low");
    const high = big(s, "high");
    const first = big(s, "firstRoot");
    const last = big(s, "highRoot");
    const answer = big(s, "correct");
    return {
      full: [
        L(language, `Count integer roots r satisfying ${low} ≤ r^${k} ≤ ${high}.`, `उन पूर्णांक मूल r को गिनें जिनके लिए ${low} ≤ r^${k} ≤ ${high}।`, `ਉਹ ਪੂਰਨ ਅੰਕ ਮੂਲ r ਗਿਣੋ ਜਿਨ੍ਹਾਂ ਲਈ ${low} ≤ r^${k} ≤ ${high}।`),
        ...powerCalculation(first - 1n, k, language),
        ...powerCalculation(first, k, language),
        L(language, `So the first admissible root is ${first}.`, `इसलिए पहला मान्य मूल ${first} है।`, `ਇਸ ਲਈ ਪਹਿਲਾ ਮਾਨਯ ਮੂਲ ${first} ਹੈ।`),
        ...powerCalculation(last, k, language),
        ...powerCalculation(last + 1n, k, language),
        L(language, `So the last admissible root is ${last}.`, `इसलिए अंतिम मान्य मूल ${last} है।`, `ਇਸ ਲਈ ਆਖਰੀ ਮਾਨਯ ਮੂਲ ${last} ਹੈ।`),
        `${last} − ${first} + 1 = ${answer}.`,
        L(language, `Therefore the count is ${answer}.`, `अतः संख्या ${answer} है।`, `ਇਸ ਲਈ ਗਿਣਤੀ ${answer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Inclusive count = last root − first root + 1.`, `समावेशी गिनती = अंतिम मूल − पहला मूल + 1।`, `ਸਮੇਤ ਗਿਣਤੀ = ਆਖਰੀ ਮੂਲ − ਪਹਿਲਾ ਮੂਲ + 1।`),
        `${last} − ${first} + 1 = ${answer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-008") {
    const k = num(s, "k");
    const n = big(s, "n");
    const boundary = big(s, "boundary");
    const answer = big(s, "correct");
    const direction = text(s, "direction");
    const root = floorRoot(boundary, k);
    return {
      full: [
        L(language, `First verify the exact ${powerLabel(k, language)} boundary.`, `पहले सटीक ${powerLabel(k, language)} सीमा की जाँच करें।`, `ਪਹਿਲਾਂ ਸਹੀ ${powerLabel(k, language)} ਹੱਦ ਦੀ ਜਾਂਚ ਕਰੋ।`),
        ...powerCalculation(root, k, language),
        direction === "ADD" ? `${boundary} − ${n} = ${answer}.` : `${n} − ${boundary} = ${answer}.`,
        L(language, `Therefore the least adjustment is ${answer}.`, `अतः न्यूनतम परिवर्तन ${answer} है।`, `ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਤਬਦੀਲੀ ${answer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Locate the adjacent exact power in the required direction and subtract once.`, `आवश्यक दिशा में निकटतम सटीक घात लें और एक बार घटाएँ।`, `ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਨੇੜਲੀ ਸਹੀ ਘਾਤ ਲਵੋ ਅਤੇ ਇੱਕ ਵਾਰ ਘਟਾਓ।`),
        direction === "ADD" ? `${boundary} − ${n} = ${answer}.` : `${n} − ${boundary} = ${answer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-009") {
    const k = num(s, "k");
    const target = big(s, "value");
    const full: string[] = [
      L(language, `An integer ${rootLabel(k, language)} must reproduce ${target} exactly when raised to power ${k}.`, `पूर्णांक ${rootLabel(k, language)} की ${k}वीं घात ठीक ${target} होनी चाहिए।`, `ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਦੀ ${k}ਵੀਂ ਘਾਤ ਠੀਕ ${target} ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`),
    ];
    if (target < 0n && k % 2 === 0) {
      full.push(L(language, `An even power cannot be negative because the negative sign appears an even number of times.`, `सम घात ऋणात्मक नहीं हो सकती क्योंकि ऋण चिह्न सम बार आता है।`, `ਸਮ ਘਾਤ ਰਣਾਤਮਕ ਨਹੀਂ ਹੋ ਸਕਦੀ ਕਿਉਂਕਿ ਰਣ ਚਿੰਨ੍ਹ ਸਮ ਵਾਰ ਆਉਂਦਾ ਹੈ।`));
      full.push(L(language, `Hence no integer satisfies x^${k} = ${target}.`, `इसलिए कोई पूर्णांक x^${k} = ${target} को संतुष्ट नहीं करता।`, `ਇਸ ਲਈ ਕੋਈ ਪੂਰਨ ਅੰਕ x^${k} = ${target} ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।`));
    } else {
      const magnitude = floorRoot(target, k);
      const signedRoot = target < 0n ? -magnitude : magnitude;
      full.push(...powerCalculation(magnitude, k, language));
      if (target < 0n) full.push(`(${signedRoot})^${k} = ${target}.`);
      full.push(L(language, `Therefore the exact integer root is ${pkg.canonicalAnswer}.`, `अतः सटीक पूर्णांक मूल ${pkg.canonicalAnswer} है।`, `ਇਸ ਲਈ ਸਹੀ ਪੂਰਨ ਅੰਕ ਮੂਲ ${pkg.canonicalAnswer} ਹੈ।`));
    }
    return {
      full,
      shortcut: [
        L(language, `Apply the domain rule first: negative targets allow integer roots only for odd powers; 0 and 1 are exact powers.`, `पहले डोमेन नियम लगाएँ: ऋणात्मक लक्ष्य का पूर्णांक मूल केवल विषम घात में होता है; 0 और 1 सटीक घात हैं।`, `ਪਹਿਲਾਂ ਡੋਮੇਨ ਨਿਯਮ ਲਗਾਓ: ਰਣਾਤਮਕ ਟਾਰਗੇਟ ਦਾ ਪੂਰਨ ਅੰਕ ਮੂਲ ਸਿਰਫ਼ ਵਿਸਮ ਘਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ; 0 ਅਤੇ 1 ਸਹੀ ਘਾਤਾਂ ਹਨ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-010") {
    const k = num(s, "k");
    const lower = big(s, "lower");
    const upper = big(s, "upper");
    const bound = big(s, "bound");
    const root = big(s, "root");
    const answer = BigInt(pkg.canonicalAnswer);
    const direction = text(s, "direction");
    return {
      full: [
        L(language, `Find the two consecutive exact powers around ${bound}.`, `${bound} के आसपास की दो लगातार सटीक घातें निकालें।`, `${bound} ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੀਆਂ ਦੋ ਲਗਾਤਾਰ ਸਹੀ ਘਾਤਾਂ ਕੱਢੋ।`),
        ...powerCalculation(root, k, language),
        ...powerCalculation(root + 1n, k, language),
        `${lower} ≤ ${bound} ≤ ${upper}.`,
        L(language, direction === "AT_MOST" ? `For AT_MOST choose the greatest exact power not exceeding ${bound}: choose ${answer}.` : `For AT_LEAST choose the least exact power not below ${bound}: choose ${answer}.`, direction === "AT_MOST" ? `AT_MOST में ${bound} से अधिक न होने वाली सबसे बड़ी सटीक घात चुनें: ${answer}।` : `AT_LEAST में ${bound} से कम न होने वाली सबसे छोटी सटीक घात चुनें: ${answer}।`, direction === "AT_MOST" ? `AT_MOST ਵਿੱਚ ${bound} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲੀ ਸਭ ਤੋਂ ਵੱਡੀ ਸਹੀ ਘਾਤ ਚੁਣੋ: ${answer}।` : `AT_LEAST ਵਿੱਚ ${bound} ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲੀ ਸਭ ਤੋਂ ਛੋਟੀ ਸਹੀ ਘਾਤ ਚੁਣੋ: ${answer}।`),
        L(language, `Therefore the answer is ${answer}.`, `अतः उत्तर ${answer} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Estimate the integer ${rootLabel(k, language)} and check only the two adjacent powers; an exact boundary remains valid in either direction.`, `पूर्णांक ${rootLabel(k, language)} का अनुमान लगाकर केवल दो पास की घातें जाँचें; सटीक सीमा दोनों दिशाओं में मान्य रहती है।`, `ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾ ਕੇ ਸਿਰਫ਼ ਦੋ ਨੇੜਲੀਆਂ ਘਾਤਾਂ ਜਾਂਚੋ; ਸਹੀ ਹੱਦ ਦੋਵੇਂ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਮਾਨਯ ਰਹਿੰਦੀ ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-011") {
    const k = num(s, "k");
    const lower = big(s, "lower");
    const upper = big(s, "upper");
    const query = big(s, "value");
    const lowerDistance = big(s, "lowerDistance");
    const upperDistance = big(s, "upperDistance");
    const root = big(s, "root");
    return {
      full: [
        ...powerCalculation(root, k, language),
        ...powerCalculation(root + 1n, k, language),
        `${lower} < ${query} < ${upper}.`,
        `${query} − ${lower} = ${lowerDistance}.`,
        `${upper} − ${query} = ${upperDistance}.`,
        L(language, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} is smaller, so the nearer power is ${pkg.canonicalAnswer}.`, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} छोटा है, इसलिए निकटतम घात ${pkg.canonicalAnswer} है।`, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} ਛੋਟਾ ਹੈ, ਇਸ ਲਈ ਨੇੜਲੀ ਘਾਤ ${pkg.canonicalAnswer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Compute only the two adjacent powers and compare distances.`, `केवल दो पास की घातें निकालकर अंतर की तुलना करें।`, `ਸਿਰਫ਼ ਦੋ ਨੇੜਲੀਆਂ ਘਾਤਾਂ ਕੱਢ ਕੇ ਫਰਕ ਦੀ ਤੁਲਨਾ ਕਰੋ।`),
        `${lowerDistance} vs ${upperDistance} → ${pkg.canonicalAnswer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-012") {
    const k = num(s, "k");
    const n = big(s, "value");
    const factors = pairs(s);
    const multiplier = big(s, "multiplier");
    const completed = big(s, "canonicalValue");
    const missing = factors
      .map(([prime, exponent]) => [prime, (k - exponent % k) % k] as const)
      .filter(([, exponent]) => exponent > 0);
    const full: string[] = [
      L(language, `The requested answer is the completed ${powerLabel(k, language)} multiple, not only the multiplier.`, `उत्तर पूरा ${powerLabel(k, language)} गुणज है, केवल गुणक नहीं।`, `ਉੱਤਰ ਪੂਰਾ ${powerLabel(k, language)} ਗੁਣਜ ਹੈ, ਸਿਰਫ਼ ਗੁਣਕ ਨਹੀਂ।`),
      ...divisionTrail(n, factors, language),
    ];
    for (const [prime, exponent] of factors) {
      const remainder = exponent % k;
      const add = (k - remainder) % k;
      full.push(`${exponent} = ${Math.floor(exponent / k)} × ${k} + ${remainder}; add ${add} factor(s) of ${prime}.`);
    }
    full.push(`${factorText(missing)} = ${multiplier}.`);
    full.push(`${n} × ${multiplier} = ${completed}.`);
    full.push(...powerCalculation(floorRoot(completed, k), k, language));
    full.push(L(language, `Therefore the least qualifying multiple is ${completed}.`, `अतः सबसे छोटा उपयुक्त गुणज ${completed} है।`, `ਇਸ ਲਈ ਸਭ ਤੋਂ ਛੋਟਾ ਯੋਗ ਗੁਣਜ ${completed} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `Complete exponent remainders to get multiplier ${multiplier}, then multiply once.`, `घातों के शेष पूरे करके गुणक ${multiplier} लें, फिर एक बार गुणा करें।`, `ਘਾਤਾਂ ਦੇ ਬਾਕੀ ਪੂਰੇ ਕਰਕੇ ਗੁਣਕ ${multiplier} ਲਵੋ, ਫਿਰ ਇੱਕ ਵਾਰ ਗੁਣਾ ਕਰੋ।`),
        `${n} × ${multiplier} = ${completed}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-013") {
    const k = num(s, "k");
    const modulus = num(s, "modulus");
    const reachable = new Set<number>();
    const witness = new Map<number, number>();
    for (let base = 0; base < modulus; base += 1) {
      const residue = Number(pow(BigInt(base), k) % BigInt(modulus));
      reachable.add(residue);
      if (!witness.has(residue)) witness.set(residue, base);
    }
    const full: string[] = [
      L(language, `Check terminal compatibility modulo ${modulus}.`, `अंतिम अंकों की संगतता modulo ${modulus} से जाँचें।`, `ਆਖਰੀ ਅੰਕਾਂ ਦੀ ਸੰਗਤਤਾ modulo ${modulus} ਨਾਲ ਜਾਂਚੋ।`),
      L(language, `Compute a^${k} mod ${modulus} for the complete residue cycle a = 0, 1, ..., ${modulus - 1}.`, `पूरा residue cycle a = 0, 1, ..., ${modulus - 1} लेकर a^${k} mod ${modulus} निकालें।`, `ਪੂਰਾ residue cycle a = 0, 1, ..., ${modulus - 1} ਲੈ ਕੇ a^${k} mod ${modulus} ਕੱਢੋ।`),
      L(language, `Reachable endings are ${[...reachable].sort((a, b) => a - b).join(", ")}.`, `प्राप्त हो सकने वाले अंत हैं ${[...reachable].sort((a, b) => a - b).join(", ")}।`, `ਮਿਲ ਸਕਣ ਵਾਲੇ ਅੰਤ ਹਨ ${[...reachable].sort((a, b) => a - b).join(", ")}।`),
    ];
    for (const option of pkg.options) {
      const residue = Number(option.value);
      if (reachable.has(residue)) {
        const base = witness.get(residue)!;
        full.push(`${base}^${k} mod ${modulus} = ${residue}; ${option.value} is reachable.`);
      } else {
        full.push(`${option.value} is absent from the complete reachable set.`);
      }
    }
    full.push(L(language, `Therefore ${pkg.canonicalAnswer} is the impossible ending.`, `अतः ${pkg.canonicalAnswer} असंभव अंत है।`, `ਇਸ ਲਈ ${pkg.canonicalAnswer} ਅਸੰਭਵ ਅੰਤ ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, k === 2 ? `Possible square unit digits are 0, 1, 4, 5, 6, 9; reject any other digit.` : `Use the precomputed cube-ending residue set modulo 100 and reject the option outside it.`, k === 2 ? `पूर्ण वर्ग के संभव इकाई अंक 0, 1, 4, 5, 6, 9 हैं; बाकी को अस्वीकार करें।` : `modulo 100 के cube-ending residue set से बाहर वाला विकल्प चुनें।`, k === 2 ? `ਪੂਰਨ ਵਰਗ ਦੇ ਸੰਭਵ ਇਕਾਈ ਅੰਕ 0, 1, 4, 5, 6, 9 ਹਨ; ਬਾਕੀ ਰੱਦ ਕਰੋ।` : `modulo 100 ਦੇ cube-ending residue set ਤੋਂ ਬਾਹਰ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`),
      ],
    };
  }

  throw new Error(`NUM-CP-012 exam-depth explanation does not support ${prototype}.`);
}

export function buildNumCp012ExamDepthExplanation(
  pkg: ExplanationPackage,
  language: Language,
): NumCp012ExamDepthExplanation {
  const result = derive(pkg, language);
  const fullLabel = L(language, "Full derivation", "पूरा हल", "ਪੂਰਾ ਹੱਲ");
  const shortcutLabel = L(language, "Exam shortcut / shorter route", "परीक्षा शॉर्टकट / छोटा तरीका", "ਪਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ / ਛੋਟਾ ਤਰੀਕਾ");
  const answerLabel = L(language, "Answer", "उत्तर", "ਉੱਤਰ");
  const lines = Object.freeze([
    `${fullLabel}:`,
    ...result.full,
    `${shortcutLabel}:`,
    ...result.shortcut,
    `${answerLabel}: ${pkg.canonicalAnswer}`,
  ]);
  return Object.freeze({
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
    fullDerivation: Object.freeze([...result.full]),
    examShortcut: Object.freeze([...result.shortcut]),
    lines,
  });
}
