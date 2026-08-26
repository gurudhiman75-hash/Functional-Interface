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

function value(state: Readonly<Record<string, unknown>>, key: string) {
  if (!(key in state)) throw new Error(`NUM-CP-012 exam-depth explanation missing state field ${key}.`);
  return state[key];
}

function text(state: Readonly<Record<string, unknown>>, key: string) {
  const item = value(state, key);
  return typeof item === "bigint" ? item.toString() : String(item);
}

function numberValue(state: Readonly<Record<string, unknown>>, key: string) {
  const parsed = Number(value(state, key));
  if (!Number.isFinite(parsed)) throw new Error(`NUM-CP-012 exam-depth field ${key} is not numeric.`);
  return parsed;
}

function bigintValue(state: Readonly<Record<string, unknown>>, key: string) {
  return BigInt(text(state, key));
}

function numberList(state: Readonly<Record<string, unknown>>, key: string) {
  const item = value(state, key);
  if (!Array.isArray(item)) throw new Error(`NUM-CP-012 exam-depth field ${key} is not an array.`);
  return item.map((entry) => Number(entry));
}

function factorPairs(state: Readonly<Record<string, unknown>>, key = "factors"): FactorPair[] {
  const item = value(state, key);
  if (!Array.isArray(item)) throw new Error(`NUM-CP-012 exam-depth factor field ${key} is not an array.`);
  return item.map((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2) throw new Error(`NUM-CP-012 malformed factor pair in ${key}.`);
    return [BigInt(String(entry[0])), Number(entry[1])] as const;
  });
}

function powBig(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function factorText(factors: readonly FactorPair[]) {
  return factors.map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

function product(factors: readonly FactorPair[]) {
  return factors.reduce((acc, [prime, exponent]) => acc * powBig(prime, exponent), 1n);
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

function floorKthRoot(input: bigint, k: number) {
  const value = input < 0n ? -input : input;
  if (value <= 1n) return value;
  let low = 0n;
  let high = 1n;
  while (powBig(high, k) <= value) high *= 2n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (powBig(mid, k) <= value) low = mid;
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

function divisionTrail(
  start: bigint,
  factors: readonly FactorPair[],
  language: Language,
): string[] {
  const lines: string[] = [];
  let current = start < 0n ? -start : start;
  lines.push(L(
    language,
    `Derive the prime factorisation by repeated exact division, starting from ${current}.`,
    `अभाज्य गुणनखंडन निकालने के लिए ${current} से बार-बार सटीक भाग करते हैं।`,
    `ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੱਢਣ ਲਈ ${current} ਤੋਂ ਵਾਰ-ਵਾਰ ਪੂਰਾ ਭਾਗ ਕਰਦੇ ਹਾਂ।`,
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
    `The quotient has reached ${current}, so the factorisation is ${factorText(factors)}.`,
    `भागफल ${current} तक पहुँच गया, इसलिए गुणनखंडन ${factorText(factors)} है।`,
    `ਭਾਗਫਲ ${current} ਤੱਕ ਪਹੁੰਚ ਗਿਆ, ਇਸ ਲਈ ਗੁਣਨਖੰਡ ${factorText(factors)} ਹੈ।`,
  ));
  return lines;
}

function powerCalculation(base: bigint, k: number, language: Language): string[] {
  if (k === 2) {
    return [
      L(language, `Calculate ${base}^2 explicitly.`, `${base}^2 का मान निकालें।`, `${base}^2 ਦਾ ਮੁੱਲ ਕੱਢੋ।`),
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
      `${base}^4 = ${base}^2 × ${base}^2 = ${square} × ${square} = ${square * square}.`,
    ];
  }
  return [`${base}^${k} = ${powBig(base, k)}.`];
}

function sectionLabels(language: Language) {
  return {
    full: L(language, "Full derivation", "पूरा हल", "ਪੂਰਾ ਹੱਲ"),
    shortcut: L(language, "Exam shortcut / shorter route", "परीक्षा शॉर्टकट / छोटा तरीका", "ਪਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ / ਛੋਟਾ ਤਰੀਕਾ"),
  };
}

function derivePrototype(
  pkg: ExplanationPackage,
  language: Language,
): Readonly<{ full: readonly string[]; shortcut: readonly string[] }> {
  const s = pkg.hiddenState;
  const prototype = pkg.temporaryPrototypeId;

  if (prototype === "NUM-CP012-PROT-001") {
    const k = numberValue(s, "k");
    const perfect = bigintValue(s, "perfect");
    const factors = factorPairs(s);
    const rootFactors = factors.map(([prime, exponent]) => [prime, exponent / k] as const);
    const root = product(rootFactors);
    return {
      full: [
        L(language, `We must prove which option is an exact ${powerLabel(k, language)}, not merely a nearby number.`, `हमें सिद्ध करना है कि कौन-सा विकल्प ठीक ${powerLabel(k, language)} है, केवल पास की संख्या नहीं।`, `ਸਾਨੂੰ ਸਾਬਤ ਕਰਨਾ ਹੈ ਕਿ ਕਿਹੜਾ ਵਿਕਲਪ ਠੀਕ ${powerLabel(k, language)} ਹੈ, ਸਿਰਫ਼ ਨੇੜਲੀ ਗਿਣਤੀ ਨਹੀਂ।`),
        ...divisionTrail(perfect, factors, language),
        ...factors.map(([prime, exponent]) => L(
          language,
          `For prime ${prime}, exponent ${exponent} ÷ ${k} = ${exponent / k} with remainder 0.`,
          `अभाज्य ${prime} के लिए घात ${exponent} ÷ ${k} = ${exponent / k}, शेष 0 है।`,
          `ਅਭਾਜ ${prime} ਲਈ ਘਾਤ ${exponent} ÷ ${k} = ${exponent / k}, ਬਾਕੀ 0 ਹੈ।`,
        )),
        L(language, `Therefore every exponent is divisible by ${k}; the ${k}th root is ${factorText(rootFactors)} = ${root}.`, `इसलिए हर घात ${k} से विभाज्य है; ${k}वाँ मूल ${factorText(rootFactors)} = ${root} है।`, `ਇਸ ਲਈ ਹਰ ਘਾਤ ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੈ; ${k}ਵਾਂ ਮੂਲ ${factorText(rootFactors)} = ${root} ਹੈ।`),
        ...powerCalculation(root, k, language),
        L(language, `The calculation reproduces ${perfect}, so ${perfect} is the required ${powerLabel(k, language)}.`, `गणना से फिर ${perfect} मिलता है, इसलिए ${perfect} आवश्यक ${powerLabel(k, language)} है।`, `ਗਣਨਾ ਨਾਲ ਮੁੜ ${perfect} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ${perfect} ਲੋੜੀਂਦਾ ${powerLabel(k, language)} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Use the prime-exponent rule: all exponents in ${factorText(factors)} are multiples of ${k}.`, `अभाज्य-घात नियम लगाएँ: ${factorText(factors)} की सभी घातें ${k} के गुणज हैं।`, `ਅਭਾਜ-ਘਾਤ ਨਿਯਮ ਲਗਾਓ: ${factorText(factors)} ਦੀਆਂ ਸਾਰੀਆਂ ਘਾਤਾਂ ${k} ਦੇ ਗੁਣਜ ਹਨ।`),
        L(language, `Hence it is immediately a ${powerLabel(k, language)}.`, `इसलिए यह तुरंत ${powerLabel(k, language)} है।`, `ਇਸ ਲਈ ਇਹ ਤੁਰੰਤ ${powerLabel(k, language)} ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-002") {
    const k = numberValue(s, "k");
    const target = bigintValue(s, "value");
    const factors = factorize(target);
    const rootFactors = factors.map(([prime, exponent]) => [prime, exponent / k] as const);
    const root = bigintValue(s, "root");
    return {
      full: [
        L(language, `We need the exact integer ${rootLabel(k, language)} of ${target}.`, `हमें ${target} का सटीक पूर्णांक ${rootLabel(k, language)} चाहिए।`, `ਸਾਨੂੰ ${target} ਦਾ ਸਹੀ ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਚਾਹੀਦਾ ਹੈ।`),
        ...divisionTrail(target, factors, language),
        ...factors.map(([prime, exponent]) => `${exponent} ÷ ${k} = ${exponent / k}.`),
        L(language, `So the root is ${factorText(rootFactors)}.`, `इसलिए मूल ${factorText(rootFactors)} है।`, `ਇਸ ਲਈ ਮੂਲ ${factorText(rootFactors)} ਹੈ।`),
        ...rootFactors.map(([prime, exponent]) => `${prime}^${exponent} = ${powBig(prime, exponent)}.`),
        `${rootFactors.map(([prime, exponent]) => powBig(prime, exponent)).join(" × ")} = ${root}.`,
        ...powerCalculation(root, k, language),
        L(language, `Therefore the exact ${rootLabel(k, language)} is ${root}.`, `अतः सटीक ${rootLabel(k, language)} ${root} है।`, `ਇਸ ਲਈ ਸਹੀ ${rootLabel(k, language)} ${root} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Group every prime exponent in blocks of ${k}.`, `हर अभाज्य घात को ${k}-${k} के समूह में बाँटें।`, `ਹਰ ਅਭਾਜ ਘਾਤ ਨੂੰ ${k}-${k} ਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡੋ।`),
        `${factorText(factors)} = (${factorText(rootFactors)})^${k}.`,
        L(language, `Therefore the root is ${root}.`, `इसलिए मूल ${root} है।`, `ਇਸ ਲਈ ਮੂਲ ${root} ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-003" || prototype === "NUM-CP012-PROT-004") {
    const k = numberValue(s, "k");
    const n = bigintValue(s, "value");
    const factors = factorPairs(s);
    const isMultiplier = prototype.endsWith("003");
    const adjustmentFactors = factorPairs(s, isMultiplier ? "multiplierFactors" : "divisorFactors");
    const adjustment = BigInt(pkg.canonicalAnswer);
    const full: string[] = [
      L(language, isMultiplier ? `We need the least multiplier that makes ${n} a ${powerLabel(k, language)}.` : `We need the least divisor that leaves a ${powerLabel(k, language)} quotient.`, isMultiplier ? `हमें न्यूनतम गुणक चाहिए जिससे ${n} ${powerLabel(k, language)} बन जाए।` : `हमें न्यूनतम भाजक चाहिए जिससे भागफल ${powerLabel(k, language)} बने।`, isMultiplier ? `ਸਾਨੂੰ ਘੱਟੋ-ਘੱਟ ਗੁਣਕ ਚਾਹੀਦਾ ਹੈ ਜਿਸ ਨਾਲ ${n} ${powerLabel(k, language)} ਬਣੇ।` : `ਸਾਨੂੰ ਘੱਟੋ-ਘੱਟ ਭਾਜਕ ਚਾਹੀਦਾ ਹੈ ਜਿਸ ਨਾਲ ਭਾਗਫਲ ${powerLabel(k, language)} ਬਣੇ।`),
      ...divisionTrail(n, factors, language),
    ];
    for (const [prime, exponent] of factors) {
      const remainder = exponent % k;
      const required = isMultiplier ? (k - remainder) % k : remainder;
      full.push(`${exponent} = ${Math.floor(exponent / k)} × ${k} + ${remainder}.`);
      full.push(L(language, isMultiplier ? `So exponent ${exponent} needs ${required} more factor(s) of ${prime}.` : `So remove exactly ${required} factor(s) of ${prime}.`, isMultiplier ? `इसलिए घात ${exponent} को ${prime} के ${required} और गुणक चाहिए।` : `इसलिए ${prime} के ठीक ${required} गुणक हटाएँ।`, isMultiplier ? `ਇਸ ਲਈ ਘਾਤ ${exponent} ਨੂੰ ${prime} ਦੇ ${required} ਹੋਰ ਗੁਣਕ ਚਾਹੀਦੇ ਹਨ।` : `ਇਸ ਲਈ ${prime} ਦੇ ਠੀਕ ${required} ਗੁਣਕ ਹਟਾਓ।`));
    }
    full.push(L(language, `Combine the required factors: ${factorText(adjustmentFactors)}.`, `आवश्यक गुणकों को मिलाएँ: ${factorText(adjustmentFactors)}।`, `ਲੋੜੀਂਦੇ ਗੁਣਕ ਮਿਲਾਓ: ${factorText(adjustmentFactors)}।`));
    for (const [prime, exponent] of adjustmentFactors) full.push(`${prime}^${exponent} = ${powBig(prime, exponent)}.`);
    full.push(`${adjustmentFactors.map(([prime, exponent]) => powBig(prime, exponent)).join(" × ")} = ${adjustment}.`);
    if (!isMultiplier) {
      const quotient = bigintValue(s, "quotient");
      full.push(`${n} ÷ ${adjustment} = ${quotient}.`);
    }
    full.push(L(language, `Therefore the least ${isMultiplier ? "multiplier" : "divisor"} is ${adjustment}.`, `अतः न्यूनतम ${isMultiplier ? "गुणक" : "भाजक"} ${adjustment} है।`, `ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ${isMultiplier ? "ਗੁਣਕ" : "ਭਾਜਕ"} ${adjustment} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `Work only with exponent remainders modulo ${k}.`, `केवल घातों के ${k} से शेष पर काम करें।`, `ਸਿਰਫ਼ ਘਾਤਾਂ ਦੇ ${k} ਨਾਲ ਬਾਕੀ ਉੱਤੇ ਕੰਮ ਕਰੋ।`),
        L(language, isMultiplier ? `For multiplication use k − remainder; this gives ${factorText(adjustmentFactors)} = ${adjustment}.` : `For division remove the remainder itself; this gives ${factorText(adjustmentFactors)} = ${adjustment}.`, isMultiplier ? `गुणा के लिए k − शेष लें; इससे ${factorText(adjustmentFactors)} = ${adjustment} मिलता है।` : `भाग के लिए शेष को ही हटाएँ; इससे ${factorText(adjustmentFactors)} = ${adjustment} मिलता है।`, isMultiplier ? `ਗੁਣਾ ਲਈ k − ਬਾਕੀ ਲਵੋ; ਇਸ ਨਾਲ ${factorText(adjustmentFactors)} = ${adjustment} ਮਿਲਦਾ ਹੈ।` : `ਭਾਗ ਲਈ ਬਾਕੀ ਨੂੰ ਹੀ ਹਟਾਓ; ਇਸ ਨਾਲ ${factorText(adjustmentFactors)} = ${adjustment} ਮਿਲਦਾ ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-005" || prototype === "NUM-CP012-PROT-014") {
    const k = numberValue(s, "k");
    const low = numberValue(s, "low");
    const high = numberValue(s, "high");
    const fixedExponent = numberValue(s, "fixedExponent");
    const full: string[] = [
      L(language, `The fixed exponent ${fixedExponent} is divisible by ${k}: ${fixedExponent} ÷ ${k} = ${fixedExponent / k}.`, `स्थिर घात ${fixedExponent}, ${k} से विभाज्य है: ${fixedExponent} ÷ ${k} = ${fixedExponent / k}।`, `ਸਥਿਰ ਘਾਤ ${fixedExponent}, ${k} ਨਾਲ ਭਾਗਯੋਗ ਹੈ: ${fixedExponent} ÷ ${k} = ${fixedExponent / k}।`),
      L(language, `So only x must be tested through every integer from ${low} to ${high}.`, `इसलिए केवल x को ${low} से ${high} तक हर पूर्णांक पर जाँचें।`, `ਇਸ ਲਈ ਸਿਰਫ਼ x ਨੂੰ ${low} ਤੋਂ ${high} ਤੱਕ ਹਰ ਪੂਰਨ ਅੰਕ ਉੱਤੇ ਜਾਂਚੋ।`),
    ];
    const valid: number[] = [];
    for (let x = low; x <= high; x += 1) {
      const remainder = x % k;
      full.push(`${x} = ${Math.floor(x / k)} × ${k} + ${remainder}.`);
      if (remainder === 0) valid.push(x);
    }
    full.push(L(language, `Valid exponent values are ${valid.length ? valid.join(", ") : "none"}.`, `मान्य घात मान ${valid.length ? valid.join(", ") : "कोई नहीं"} हैं।`, `ਮਾਨਯ ਘਾਤ ਮੁੱਲ ${valid.length ? valid.join(", ") : "ਕੋਈ ਨਹੀਂ"} ਹਨ।`));
    full.push(L(language, `Therefore the required answer class/value is ${pkg.canonicalAnswer}.`, `अतः आवश्यक उत्तर ${pkg.canonicalAnswer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${pkg.canonicalAnswer} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `List only multiples of ${k} inside [${low}, ${high}].`, `[${low}, ${high}] में केवल ${k} के गुणज लिखें।`, `[${low}, ${high}] ਵਿੱਚ ਸਿਰਫ਼ ${k} ਦੇ ਗੁਣਜ ਲਿਖੋ।`),
        L(language, `That directly gives ${valid.length ? valid.join(", ") : "no valid value"} and hence ${pkg.canonicalAnswer}.`, `इससे सीधे ${valid.length ? valid.join(", ") : "कोई मान नहीं"} और इसलिए ${pkg.canonicalAnswer} मिलता है।`, `ਇਸ ਨਾਲ ਸਿੱਧਾ ${valid.length ? valid.join(", ") : "ਕੋਈ ਮੁੱਲ ਨਹੀਂ"} ਅਤੇ ਇਸ ਲਈ ${pkg.canonicalAnswer} ਮਿਲਦਾ ਹੈ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-006") {
    const k = numberValue(s, "k");
    const n = bigintValue(s, "value");
    const factors = factorPairs(s);
    const kept = factorPairs(s, "divisorFactors");
    const answer = BigInt(pkg.canonicalAnswer);
    const full = [
      ...divisionTrail(n, factors, language),
      L(language, `For the greatest ${powerLabel(k, language)} divisor, round each exponent down to the largest multiple of ${k}.`, `सबसे बड़े ${powerLabel(k, language)} भाजक के लिए हर घात को ${k} के निकटतम छोटे गुणज तक घटाएँ।`, `ਸਭ ਤੋਂ ਵੱਡੇ ${powerLabel(k, language)} ਭਾਜਕ ਲਈ ਹਰ ਘਾਤ ਨੂੰ ${k} ਦੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਛੋਟੇ ਗੁਣਜ ਤੱਕ ਘਟਾਓ।`),
      ...factors.map(([prime, exponent]) => `${exponent} ÷ ${k} = ${Math.floor(exponent / k)} remainder ${exponent % k}; keep exponent ${Math.floor(exponent / k) * k} for prime ${prime}.`),
      L(language, `Thus retain ${factorText(kept)}.`, `इसलिए ${factorText(kept)} रखें।`, `ਇਸ ਲਈ ${factorText(kept)} ਰੱਖੋ।`),
      ...kept.map(([prime, exponent]) => `${prime}^${exponent} = ${powBig(prime, exponent)}.`),
      `${kept.map(([prime, exponent]) => powBig(prime, exponent)).join(" × ")} = ${answer}.`,
      L(language, `Therefore the greatest qualifying divisor is ${answer}.`, `अतः सबसे बड़ा उपयुक्त भाजक ${answer} है।`, `ਇਸ ਲਈ ਸਭ ਤੋਂ ਵੱਡਾ ਯੋਗ ਭਾਜਕ ${answer} ਹੈ।`),
    ];
    return {
      full,
      shortcut: [
        L(language, `Floor every exponent to a multiple of ${k}: ${factorText(kept)}.`, `हर घात को ${k} के गुणज तक नीचे लाएँ: ${factorText(kept)}।`, `ਹਰ ਘਾਤ ਨੂੰ ${k} ਦੇ ਗੁਣਜ ਤੱਕ ਹੇਠਾਂ ਲਿਆਓ: ${factorText(kept)}।`),
        `${factorText(kept)} = ${answer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-007") {
    const k = numberValue(s, "k");
    const low = bigintValue(s, "low");
    const high = bigintValue(s, "high");
    const firstRoot = bigintValue(s, "firstRoot");
    const highRoot = bigintValue(s, "highRoot");
    const answer = bigintValue(s, "correct");
    return {
      full: [
        L(language, `We count integer roots r satisfying ${low} ≤ r^${k} ≤ ${high}.`, `हम उन पूर्णांक मूल r को गिनते हैं जिनके लिए ${low} ≤ r^${k} ≤ ${high}।`, `ਅਸੀਂ ਉਹ ਪੂਰਨ ਅੰਕ ਮੂਲ r ਗਿਣਦੇ ਹਾਂ ਜਿਨ੍ਹਾਂ ਲਈ ${low} ≤ r^${k} ≤ ${high}।`),
        ...powerCalculation(firstRoot - 1n, k, language),
        ...powerCalculation(firstRoot, k, language),
        L(language, `So the first admissible root is ${firstRoot}.`, `इसलिए पहला मान्य मूल ${firstRoot} है।`, `ਇਸ ਲਈ ਪਹਿਲਾ ਮਾਨਯ ਮੂਲ ${firstRoot} ਹੈ।`),
        ...powerCalculation(highRoot, k, language),
        ...powerCalculation(highRoot + 1n, k, language),
        L(language, `So the last admissible root is ${highRoot}.`, `इसलिए अंतिम मान्य मूल ${highRoot} है।`, `ਇਸ ਲਈ ਆਖਰੀ ਮਾਨਯ ਮੂਲ ${highRoot} ਹੈ।`),
        `${highRoot} − ${firstRoot} + 1 = ${answer}.`,
        L(language, `Therefore the interval contains ${answer} required powers.`, `अतः अंतराल में ${answer} आवश्यक घातें हैं।`, `ਇਸ ਲਈ ਅੰਤਰਾਲ ਵਿੱਚ ${answer} ਲੋੜੀਂਦੀਆਂ ਘਾਤਾਂ ਹਨ।`),
      ],
      shortcut: [
        L(language, `Count roots inclusively: last root − first root + 1.`, `मूलों को समावेशी रूप से गिनें: अंतिम मूल − पहला मूल + 1।`, `ਮੂਲਾਂ ਨੂੰ ਸਮੇਤ ਗਿਣੋ: ਆਖਰੀ ਮੂਲ − ਪਹਿਲਾ ਮੂਲ + 1।`),
        `${highRoot} − ${firstRoot} + 1 = ${answer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-008") {
    const k = numberValue(s, "k");
    const n = bigintValue(s, "n");
    const boundary = bigintValue(s, "boundary");
    const answer = bigintValue(s, "correct");
    const direction = text(s, "direction");
    const root = floorKthRoot(boundary, k);
    return {
      full: [
        L(language, `We first verify the exact ${powerLabel(k, language)} boundary.`, `पहले सटीक ${powerLabel(k, language)} सीमा की जाँच करें।`, `ਪਹਿਲਾਂ ਸਹੀ ${powerLabel(k, language)} ਹੱਦ ਦੀ ਜਾਂਚ ਕਰੋ।`),
        ...powerCalculation(root, k, language),
        L(language, direction === "ADD" ? `The required boundary is ${boundary}, so subtract the starting number from it.` : `The required boundary is ${boundary}, so subtract it from the starting number.`, direction === "ADD" ? `आवश्यक सीमा ${boundary} है, इसलिए उसमें से शुरुआती संख्या घटाएँ।` : `आवश्यक सीमा ${boundary} है, इसलिए उसे शुरुआती संख्या से घटाएँ।`, direction === "ADD" ? `ਲੋੜੀਂਦੀ ਹੱਦ ${boundary} ਹੈ, ਇਸ ਲਈ ਉਸ ਵਿੱਚੋਂ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਘਟਾਓ।` : `ਲੋੜੀਂਦੀ ਹੱਦ ${boundary} ਹੈ, ਇਸ ਲਈ ਉਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ।`),
        direction === "ADD" ? `${boundary} − ${n} = ${answer}.` : `${n} − ${boundary} = ${answer}.`,
        L(language, `Therefore the least adjustment is ${answer}.`, `अतः न्यूनतम परिवर्तन ${answer} है।`, `ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਤਬਦੀਲੀ ${answer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Locate the adjacent exact power in the required direction, then take one subtraction.`, `आवश्यक दिशा में निकटतम सटीक घात लें और एक घटाव करें।`, `ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਨੇੜਲੀ ਸਹੀ ਘਾਤ ਲਵੋ ਅਤੇ ਇੱਕ ਘਟਾਉ ਕਰੋ।`),
        direction === "ADD" ? `${boundary} − ${n} = ${answer}.` : `${n} − ${boundary} = ${answer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-009") {
    const k = numberValue(s, "k");
    const target = bigintValue(s, "value");
    const full = [
      L(language, `An integer ${rootLabel(k, language)} must reproduce ${target} exactly when raised to power ${k}.`, `पूर्णांक ${rootLabel(k, language)} की ${k}वीं घात ठीक ${target} होनी चाहिए।`, `ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਦੀ ${k}ਵੀਂ ਘਾਤ ਠੀਕ ${target} ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`),
    ];
    if (target < 0n && k % 2 === 0) {
      full.push(L(language, `Every even power is non-negative, because a negative sign is multiplied an even number of times.`, `हर सम घात गैर-ऋणात्मक होती है, क्योंकि ऋण चिह्न सम बार गुणा होता है।`, `ਹਰ ਸਮ ਘਾਤ ਗੈਰ-ਰਣਾਤਮਕ ਹੁੰਦੀ ਹੈ, ਕਿਉਂਕਿ ਰਣ ਚਿੰਨ੍ਹ ਸਮ ਵਾਰ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।`));
      full.push(L(language, `Therefore no integer can satisfy x^${k} = ${target}.`, `इसलिए कोई पूर्णांक x^${k} = ${target} को संतुष्ट नहीं कर सकता।`, `ਇਸ ਲਈ ਕੋਈ ਪੂਰਨ ਅੰਕ x^${k} = ${target} ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਦਾ।`));
    } else {
      const magnitudeRoot = floorKthRoot(target, k);
      const root = target < 0n ? -magnitudeRoot : magnitudeRoot;
      full.push(...powerCalculation(magnitudeRoot, k, language));
      if (target < 0n) full.push(L(language, `Because ${k} is odd, attach the negative sign: (${root})^${k} = ${target}.`, `क्योंकि ${k} विषम है, ऋण चिह्न रखें: (${root})^${k} = ${target}।`, `ਕਿਉਂਕਿ ${k} ਵਿਸਮ ਹੈ, ਰਣ ਚਿੰਨ੍ਹ ਰੱਖੋ: (${root})^${k} = ${target}।`));
      full.push(L(language, `Therefore the exact integer root is ${pkg.canonicalAnswer}.`, `अतः सटीक पूर्णांक मूल ${pkg.canonicalAnswer} है।`, `ਇਸ ਲਈ ਸਹੀ ਪੂਰਨ ਅੰਕ ਮੂਲ ${pkg.canonicalAnswer} ਹੈ।`));
    }
    return {
      full,
      shortcut: [
        L(language, `Domain rule: negative targets have integer roots only for odd powers; 0 and 1 are exact powers of themselves.`, `डोमेन नियम: ऋणात्मक लक्ष्य का पूर्णांक मूल केवल विषम घात में होता है; 0 और 1 स्वयं की सटीक घात हैं।`, `ਡੋਮੇਨ ਨਿਯਮ: ਰਣਾਤਮਕ ਟਾਰਗੇਟ ਦਾ ਪੂਰਨ ਅੰਕ ਮੂਲ ਸਿਰਫ਼ ਵਿਸਮ ਘਾਤ ਲਈ ਹੁੰਦਾ ਹੈ; 0 ਅਤੇ 1 ਆਪਣੇ ਆਪ ਦੀਆਂ ਸਹੀ ਘਾਤਾਂ ਹਨ।`),
        L(language, `Apply that rule before doing arithmetic.`, `गणना से पहले यही नियम लगाएँ।`, `ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਇਹੀ ਨਿਯਮ ਲਗਾਓ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-010") {
    const k = numberValue(s, "k");
    const lower = bigintValue(s, "lower");
    const upper = bigintValue(s, "upper");
    const bound = bigintValue(s, "bound");
    const root = bigintValue(s, "root");
    const direction = text(s, "direction");
    return {
      full: [
        L(language, `Find the two consecutive exact powers surrounding ${bound}.`, `${bound} के आसपास की दो लगातार सटीक घातें निकालें।`, `${bound} ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੀਆਂ ਦੋ ਲਗਾਤਾਰ ਸਹੀ ਘਾਤਾਂ ਕੱਢੋ।`),
        ...powerCalculation(root, k, language),
        ...powerCalculation(root + 1n, k, language),
        `${lower} ≤ ${bound} ≤ ${upper}.`,
        L(language, direction === "AT_MOST" ? `We need the greatest allowed value not exceeding the bound, so choose ${lower}.` : `We need the least allowed value at least the bound, so choose ${upper}.`, direction === "AT_MOST" ? `सीमा से अधिक न होने वाला सबसे बड़ा मान चाहिए, इसलिए ${lower} चुनें।` : `सीमा से कम न होने वाला सबसे छोटा मान चाहिए, इसलिए ${upper} चुनें।`, direction === "AT_MOST" ? `ਹੱਦ ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ${lower} ਚੁਣੋ।` : `ਹੱਦ ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ${upper} ਚੁਣੋ।`),
        L(language, `Therefore the answer is ${pkg.canonicalAnswer}.`, `अतः उत्तर ${pkg.canonicalAnswer} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${pkg.canonicalAnswer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Estimate the integer ${rootLabel(k, language)}, then check only the two adjacent powers.`, `पूर्णांक ${rootLabel(k, language)} का अनुमान लगाकर केवल दो आस-पास की घातें जाँचें।`, `ਪੂਰਨ ਅੰਕ ${rootLabel(k, language)} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾ ਕੇ ਸਿਰਫ਼ ਦੋ ਨੇੜਲੀਆਂ ਘਾਤਾਂ ਜਾਂਚੋ।`),
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-011") {
    const k = numberValue(s, "k");
    const lower = bigintValue(s, "lower");
    const upper = bigintValue(s, "upper");
    const query = bigintValue(s, "value");
    const lowerDistance = bigintValue(s, "lowerDistance");
    const upperDistance = bigintValue(s, "upperDistance");
    const root = bigintValue(s, "root");
    return {
      full: [
        ...powerCalculation(root, k, language),
        ...powerCalculation(root + 1n, k, language),
        L(language, `${query} lies between ${lower} and ${upper}.`, `${query}, ${lower} और ${upper} के बीच है।`, `${query}, ${lower} ਅਤੇ ${upper} ਦੇ ਵਿਚਕਾਰ ਹੈ।`),
        `${query} − ${lower} = ${lowerDistance}.`,
        `${upper} − ${query} = ${upperDistance}.`,
        L(language, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} is the smaller distance, so the nearer power is ${pkg.canonicalAnswer}.`, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} छोटा अंतर है, इसलिए निकटतम घात ${pkg.canonicalAnswer} है।`, `${lowerDistance < upperDistance ? lowerDistance : upperDistance} ਛੋਟਾ ਫਰਕ ਹੈ, ਇਸ ਲਈ ਨੇੜਲੀ ਘਾਤ ${pkg.canonicalAnswer} ਹੈ।`),
      ],
      shortcut: [
        L(language, `Compute only the two adjacent powers and compare their distances from ${query}.`, `केवल दो आस-पास की घातें निकालें और ${query} से उनके अंतर की तुलना करें।`, `ਸਿਰਫ਼ ਦੋ ਨੇੜਲੀਆਂ ਘਾਤਾਂ ਕੱਢੋ ਅਤੇ ${query} ਤੋਂ ਉਨ੍ਹਾਂ ਦੇ ਫਰਕ ਦੀ ਤੁਲਨਾ ਕਰੋ।`),
        `${lowerDistance} vs ${upperDistance} → ${pkg.canonicalAnswer}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-012") {
    const k = numberValue(s, "k");
    const n = bigintValue(s, "value");
    const factors = factorPairs(s);
    const multiplier = bigintValue(s, "multiplier");
    const completed = bigintValue(s, "canonicalValue");
    const missing = factors
      .map(([prime, exponent]) => [prime, (k - (exponent % k)) % k] as const)
      .filter(([, exponent]) => exponent > 0);
    const full = [
      L(language, `The question asks for the completed ${powerLabel(k, language)} multiple, not merely the multiplier.`, `प्रश्न में पूरा ${powerLabel(k, language)} गुणज चाहिए, केवल गुणक नहीं।`, `ਸਵਾਲ ਵਿੱਚ ਪੂਰਾ ${powerLabel(k, language)} ਗੁਣਜ ਚਾਹੀਦਾ ਹੈ, ਸਿਰਫ਼ ਗੁਣਕ ਨਹੀਂ।`),
      ...divisionTrail(n, factors, language),
    ];
    for (const [prime, exponent] of factors) {
      const remainder = exponent % k;
      const add = (k - remainder) % k;
      full.push(`${exponent} = ${Math.floor(exponent / k)} × ${k} + ${remainder}; add ${add} factor(s) of ${prime}.`);
    }
    full.push(`${factorText(missing)} = ${multiplier}.`);
    full.push(`${n} × ${multiplier} = ${completed}.`);
    const root = floorKthRoot(completed, k);
    full.push(...powerCalculation(root, k, language));
    full.push(L(language, `Therefore the least qualifying multiple is ${completed}.`, `अतः सबसे छोटा उपयुक्त गुणज ${completed} है।`, `ਇਸ ਲਈ ਸਭ ਤੋਂ ਛੋਟਾ ਯੋਗ ਗੁਣਜ ${completed} ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, `Complete the exponent remainders to get multiplier ${multiplier}, then multiply once.`, `घातों के शेष पूरे करके गुणक ${multiplier} लें, फिर एक बार गुणा करें।`, `ਘਾਤਾਂ ਦੇ ਬਾਕੀ ਪੂਰੇ ਕਰਕੇ ਗੁਣਕ ${multiplier} ਲਵੋ, ਫਿਰ ਇੱਕ ਵਾਰ ਗੁਣਾ ਕਰੋ।`),
        `${n} × ${multiplier} = ${completed}.`,
      ],
    };
  }

  if (prototype === "NUM-CP012-PROT-013") {
    const k = numberValue(s, "k");
    const modulus = numberValue(s, "modulus");
    const correctResidue = numberValue(s, "correctResidue");
    const reachable = new Set<number>();
    const witness = new Map<number, number>();
    for (let base = 0; base < modulus; base += 1) {
      const residue = Number(powBig(BigInt(base), k) % BigInt(modulus));
      reachable.add(residue);
      if (!witness.has(residue)) witness.set(residue, base);
    }
    const sortedReachable = [...reachable].sort((a, b) => a - b);
    const full: string[] = [
      L(language, `Terminal compatibility is checked modulo ${modulus}.`, `अंतिम अंकों की संगतता modulo ${modulus} से जाँची जाती है।`, `ਆਖਰੀ ਅੰਕਾਂ ਦੀ ਸੰਗਤਤਾ modulo ${modulus} ਨਾਲ ਜਾਂਚੀ ਜਾਂਦੀ ਹੈ।`),
      L(language, `Compute a^${k} mod ${modulus} for the complete residue cycle a = 0, 1, ..., ${modulus - 1}.`, `पूरा residue cycle a = 0, 1, ..., ${modulus - 1} लेकर a^${k} mod ${modulus} निकालें।`, `ਪੂਰਾ residue cycle a = 0, 1, ..., ${modulus - 1} ਲੈ ਕੇ a^${k} mod ${modulus} ਕੱਢੋ।`),
      L(language, `The reachable endings are: ${sortedReachable.join(", ")}.`, `प्राप्त हो सकने वाले अंत हैं: ${sortedReachable.join(", ")}।`, `ਮਿਲ ਸਕਣ ਵਾਲੇ ਅੰਤ ਹਨ: ${sortedReachable.join(", ")}।`),
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
    full.push(L(language, `Therefore ${correctResidue} is the impossible ending.`, `अतः ${correctResidue} असंभव अंत है।`, `ਇਸ ਲਈ ${correctResidue} ਅਸੰਭਵ ਅੰਤ ਹੈ।`));
    return {
      full,
      shortcut: [
        L(language, k === 2 ? `Memorise the possible square unit digits 0, 1, 4, 5, 6, 9; anything else is impossible.` : `Use the precomputed cube-ending residue set modulo 100 and reject the option outside it.`, k === 2 ? `पूर्ण वर्ग के संभव इकाई अंक 0, 1, 4, 5, 6, 9 याद रखें; बाकी असंभव हैं।` : `modulo 100 के घन-अंत residue set से बाहर वाले विकल्प को चुनें।`, k === 2 ? `ਪੂਰਨ ਵਰਗ ਦੇ ਸੰਭਵ ਇਕਾਈ ਅੰਕ 0, 1, 4, 5, 6, 9 ਯਾਦ ਰੱਖੋ; ਬਾਕੀ ਅਸੰਭਵ ਹਨ।` : `modulo 100 ਦੇ cube-ending residue set ਤੋਂ ਬਾਹਰ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`),
      ],
    };
  }

  throw new Error(`NUM-CP-012 exam-depth explanation does not support ${prototype}.`);
}

export function buildNumCp012ExamDepthExplanation(
  pkg: ExplanationPackage,
  language: Language,
): NumCp012ExamDepthExplanation {
  const labels = sectionLabels(language);
  const derived = derivePrototype(pkg, language);
  const answerLabel = L(language, "Answer", "उत्तर", "ਉੱਤਰ");
  const lines = Object.freeze([
    `${labels.full}:`,
    ...derived.full,
    `${labels.shortcut}:`,
    ...derived.shortcut,
    `${answerLabel}: ${pkg.canonicalAnswer}`,
  ]);
  return Object.freeze({
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
    fullDerivation: Object.freeze([...derived.full]),
    examShortcut: Object.freeze([...derived.shortcut]),
    lines,
  });
}
