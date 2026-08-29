import { generateNumCp008Permanent, type NumCp008PermanentPackage, type NumCp008PermanentQlId } from "../permanent-runtime.ts";
import type { NumCp008LocalizedLanguage, NumCp008LocalizedPackage, NumCp008LocalizedLocale } from "./types.ts";

type State = Readonly<Record<string, unknown>>;
type Constraint = Readonly<{ residue: number; modulus: number }>;

type MergeResult = Readonly<{
  residue: number;
  period: number;
  steps: readonly Readonly<{
    beforeResidue: number;
    beforePeriod: number;
    nextResidue: number;
    nextModulus: number;
    gcd: number;
    difference: number;
    k: number;
    residue: number;
    period: number;
  }>[];
}>;

const HI_ANSWERS: Readonly<Record<string, string>> = Object.freeze({
  "NO SOLUTION": "कोई हल नहीं",
  "ONE RESIDUE CLASS": "एक अवशेष वर्ग",
  "MULTIPLE RESIDUE CLASSES": "एक से अधिक अवशेष वर्ग",
  "ALL RESIDUES": "सभी अवशेष",
  "INCOMPATIBLE — NO INTEGER SOLUTION": "असंगत — कोई पूर्णांक हल नहीं",
  "COMPATIBLE — UNIQUE MODULO THE PRODUCT": "संगत — गुणनफल के मॉड्यूलो में एक ही वर्ग",
  "COMPATIBLE — UNIQUE MODULO THE LCM": "संगत — LCM के मॉड्यूलो में एक ही वर्ग",
  "INDETERMINATE FROM THE GIVEN DATA": "दी गई जानकारी से निर्धारित नहीं किया जा सकता",
  "COMPATIBLE — ONE CLASS MODULO THE LCM": "संगत — LCM के मॉड्यूलो में एक वर्ग",
  "COMPATIBLE — ONE CLASS MODULO THE PRODUCT": "संगत — गुणनफल के मॉड्यूलो में एक वर्ग",
  "Only I is correct": "केवल I सही है",
  "Only II is correct": "केवल II सही है",
  "I and II only are correct": "केवल I और II सही हैं",
  "I, II and III are correct": "I, II और III सभी सही हैं",
  "Statement I alone is sufficient": "केवल कथन I पर्याप्त है",
  "Statement II alone is sufficient": "केवल कथन II पर्याप्त है",
  "Both statements together are sufficient, but neither alone is sufficient": "दोनों कथन साथ में पर्याप्त हैं, लेकिन कोई भी अकेला पर्याप्त नहीं है",
  "Even both statements together are not sufficient": "दोनों कथन साथ में भी पर्याप्त नहीं हैं",
  "No solution": "कोई हल नहीं",
  "Exactly one solution": "ठीक एक हल",
  "More than one solution": "एक से अधिक हल",
  "Cannot be determined": "निर्धारित नहीं किया जा सकता",
});

const PA_ANSWERS: Readonly<Record<string, string>> = Object.freeze({
  "NO SOLUTION": "ਕੋਈ ਹੱਲ ਨਹੀਂ",
  "ONE RESIDUE CLASS": "ਇੱਕ ਅਵਸ਼ੇਸ਼ ਵਰਗ",
  "MULTIPLE RESIDUE CLASSES": "ਇੱਕ ਤੋਂ ਵੱਧ ਅਵਸ਼ੇਸ਼ ਵਰਗ",
  "ALL RESIDUES": "ਸਾਰੇ ਅਵਸ਼ੇਸ਼",
  "INCOMPATIBLE — NO INTEGER SOLUTION": "ਅਸੰਗਤ — ਕੋਈ ਪੂਰਨ ਅੰਕ ਹੱਲ ਨਹੀਂ",
  "COMPATIBLE — UNIQUE MODULO THE PRODUCT": "ਸੰਗਤ — ਗੁਣਨਫਲ ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਇੱਕੋ ਵਰਗ",
  "COMPATIBLE — UNIQUE MODULO THE LCM": "ਸੰਗਤ — LCM ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਇੱਕੋ ਵਰਗ",
  "INDETERMINATE FROM THE GIVEN DATA": "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  "COMPATIBLE — ONE CLASS MODULO THE LCM": "ਸੰਗਤ — LCM ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਇੱਕ ਵਰਗ",
  "COMPATIBLE — ONE CLASS MODULO THE PRODUCT": "ਸੰਗਤ — ਗੁਣਨਫਲ ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਇੱਕ ਵਰਗ",
  "Only I is correct": "ਕੇਵਲ I ਸਹੀ ਹੈ",
  "Only II is correct": "ਕੇਵਲ II ਸਹੀ ਹੈ",
  "I and II only are correct": "ਕੇਵਲ I ਅਤੇ II ਸਹੀ ਹਨ",
  "I, II and III are correct": "I, II ਅਤੇ III ਤਿੰਨੇ ਸਹੀ ਹਨ",
  "Statement I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
  "Statement II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
  "Both statements together are sufficient, but neither alone is sufficient": "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ",
  "Even both statements together are not sufficient": "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  "No solution": "ਕੋਈ ਹੱਲ ਨਹੀਂ",
  "Exactly one solution": "ਬਿਲਕੁਲ ਇੱਕ ਹੱਲ",
  "More than one solution": "ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ",
  "Cannot be determined": "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
});

function stateOf(q: NumCp008PermanentPackage): State {
  return q.hiddenState as State;
}

function numberValue(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${key}`);
  return value;
}

function stringValue(state: State, key: string): string {
  const value = state[key];
  if (typeof value !== "string") throw new Error(`Expected string ${key}`);
  return value;
}

function numberArray(state: State, key: string): number[] {
  const value = state[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${key}`);
  }
  return [...value] as number[];
}

function constraintsFrom(value: unknown): Constraint[] {
  if (!Array.isArray(value)) throw new Error("Expected constraints array");
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Malformed constraint");
    const row = item as Readonly<Record<string, unknown>>;
    if (typeof row.residue !== "number" || typeof row.modulus !== "number") throw new Error("Malformed constraint values");
    return { residue: row.residue, modulus: row.modulus };
  });
}

function constraints(state: State): Constraint[] {
  return constraintsFrom(state.constraints);
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function lcm(a: number, b: number): number {
  return Math.abs((a / gcd(a, b)) * b);
}

function inverse(a: number, modulus: number): number {
  if (modulus === 1) return 0;
  const target = mod(a, modulus);
  for (let candidate = 1; candidate < modulus; candidate += 1) {
    if (mod(target * candidate, modulus) === 1) return candidate;
  }
  throw new Error(`No inverse for ${a} modulo ${modulus}`);
}

function mergeConstraints(items: readonly Constraint[]): MergeResult | null {
  if (items.length === 0) throw new Error("Cannot merge empty constraint list");
  let residue = mod(items[0]!.residue, items[0]!.modulus);
  let period = items[0]!.modulus;
  const steps: MergeResult["steps"][number][] = [];
  for (const next of items.slice(1)) {
    const g = gcd(period, next.modulus);
    const difference = next.residue - residue;
    if (difference % g !== 0) return null;
    const reducedPeriod = period / g;
    const reducedModulus = next.modulus / g;
    const reducedDifference = difference / g;
    const k = reducedModulus === 1 ? 0 : mod(inverse(reducedPeriod, reducedModulus) * reducedDifference, reducedModulus);
    const nextPeriod = lcm(period, next.modulus);
    const nextResidue = mod(residue + period * k, nextPeriod);
    steps.push({
      beforeResidue: residue,
      beforePeriod: period,
      nextResidue: next.residue,
      nextModulus: next.modulus,
      gcd: g,
      difference,
      k,
      residue: nextResidue,
      period: nextPeriod,
    });
    residue = nextResidue;
    period = nextPeriod;
  }
  return { residue, period, steps };
}

function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function localeFor(language: NumCp008LocalizedLanguage): NumCp008LocalizedLocale {
  return language === "hi" ? "hi-IN" : "pa-IN";
}

export function localizeNumCp008Answer(value: string, language: NumCp008LocalizedLanguage): string {
  const map = language === "hi" ? HI_ANSWERS : PA_ANSWERS;
  return map[value] ?? value;
}

function systemText(items: readonly Constraint[]): string {
  return items.map((item) => `x ≡ ${item.residue} (mod ${item.modulus})`).join(", ");
}

function localizedStem(q: NumCp008PermanentPackage, language: NumCp008LocalizedLanguage): string {
  const s = stateOf(q);
  const hi = language === "hi";
  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-001": {
      const raw = numberValue(s, "raw");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `${raw} को ${modulus} के मॉड्यूलो में लिखने पर न्यूनतम गैर-ऋणात्मक अवशेष क्या होगा?`
        : `${raw} ਨੂੰ ${modulus} ਦੇ ਮਾਡਿਊਲੋ ਵਿੱਚ ਲਿਖਣ ਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਅਵਸ਼ੇਸ਼ ਕੀ ਹੋਵੇਗਾ?`;
    }
    case "NUM-CP008-PROT-002": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const operation = stringValue(s, "operation");
      const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
      return hi
        ? `यदि A ≡ ${a} (mod ${modulus}) और B ≡ ${b} (mod ${modulus}), तो A ${symbol} B का न्यूनतम गैर-ऋणात्मक अवशेष क्या है?`
        : `ਜੇ A ≡ ${a} (mod ${modulus}) ਅਤੇ B ≡ ${b} (mod ${modulus}), ਤਾਂ A ${symbol} B ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਅਵਸ਼ੇਸ਼ ਕੀ ਹੈ?`;
    }
    case "NUM-CP008-PROT-003": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `${base}^${exponent} को ${modulus} से भाग देने पर न्यूनतम गैर-ऋणात्मक शेषफल ज्ञात कीजिए।`
        : `${base}^${exponent} ਨੂੰ ${modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਬਾਕੀ ਲੱਭੋ।`;
    }
    case "NUM-CP008-PROT-004": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `${a}x ≡ ${b} (mod ${modulus}) को हल कीजिए। हल के अवशेष वर्ग को दर्शाने वाला न्यूनतम गैर-ऋणात्मक मान कौन-सा है?`
        : `${a}x ≡ ${b} (mod ${modulus}) ਨੂੰ ਹੱਲ ਕਰੋ। ਹੱਲ ਦੇ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਨੂੰ ਦਰਸਾਉਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਮੁੱਲ ਕਿਹੜਾ ਹੈ?`;
    }
    case "NUM-CP008-PROT-005": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `${a}x ≡ ${b} (mod ${modulus}) को संतुष्ट करने वाले अलग-अलग अवशेष वर्गों की संख्या कितनी है?`
        : `${a}x ≡ ${b} (mod ${modulus}) ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਵੱਖ-ਵੱਖ ਅਵਸ਼ੇਸ਼ ਵਰਗਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`;
    }
    case "NUM-CP008-PROT-006": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `${a}x ≡ ${b} (mod ${modulus}) के हल-समुच्चय का सही वर्गीकरण कीजिए।`
        : `${a}x ≡ ${b} (mod ${modulus}) ਦੇ ਹੱਲ-ਸਮੂਹ ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕਰੋ।`;
    }
    case "NUM-CP008-PROT-007": {
      const r1 = numberValue(s, "r1");
      const m1 = numberValue(s, "m1");
      const r2 = numberValue(s, "r2");
      const m2 = numberValue(s, "m2");
      return hi
        ? `सबसे छोटा धनात्मक पूर्णांक x ज्ञात कीजिए जिसके लिए x ≡ ${r1} (mod ${m1}) और x ≡ ${r2} (mod ${m2}) दोनों सत्य हों।`
        : `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ x ਲੱਭੋ ਜਿਸ ਲਈ x ≡ ${r1} (mod ${m1}) ਅਤੇ x ≡ ${r2} (mod ${m2}) ਦੋਵੇਂ ਸਹੀ ਹੋਣ।`;
    }
    case "NUM-CP008-PROT-008": {
      const r1 = numberValue(s, "r1");
      const m1 = numberValue(s, "m1");
      const r2 = numberValue(s, "r2");
      const m2 = numberValue(s, "m2");
      return hi
        ? `सिस्टम x ≡ ${r1} (mod ${m1}), x ≡ ${r2} (mod ${m2}) का सही वर्गीकरण कीजिए।`
        : `ਸਿਸਟਮ x ≡ ${r1} (mod ${m1}), x ≡ ${r2} (mod ${m2}) ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕਰੋ।`;
    }
    case "NUM-CP008-PROT-009": {
      const residue = numberValue(s, "residue");
      const modulus = numberValue(s, "modulus");
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const direction = stringValue(s, "direction");
      if (hi) return `${lower} से ${upper} तक के उन पूर्णांकों में, जो x ≡ ${residue} (mod ${modulus}) को संतुष्ट करते हैं, ${direction === "LEAST" ? "सबसे छोटा" : "सबसे बड़ा"} मान ज्ञात कीजिए।`;
      return `${lower} ਤੋਂ ${upper} ਤੱਕ ਦੇ ਉਹਨਾਂ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ, ਜੋ x ≡ ${residue} (mod ${modulus}) ਨੂੰ ਪੂਰਾ ਕਰਦੇ ਹਨ, ${direction === "LEAST" ? "ਸਭ ਤੋਂ ਛੋਟਾ" : "ਸਭ ਤੋਂ ਵੱਡਾ"} ਮੁੱਲ ਲੱਭੋ।`;
    }
    case "NUM-CP008-PROT-010": {
      const residue = numberValue(s, "residue");
      const modulus = numberValue(s, "modulus");
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      return hi
        ? `[${lower}, ${upper}] में कितने पूर्णांक x, x ≡ ${residue} (mod ${modulus}) को संतुष्ट करते हैं?`
        : `[${lower}, ${upper}] ਵਿੱਚ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ x, x ≡ ${residue} (mod ${modulus}) ਨੂੰ ਪੂਰਾ ਕਰਦੇ ਹਨ?`;
    }
    case "NUM-CP008-PROT-011": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      return hi
        ? `[${lower}, ${upper}] के वे सभी पूर्णांक x लिखिए जो ${systemText(items)} को एक साथ संतुष्ट करते हैं।`
        : `[${lower}, ${upper}] ਦੇ ਉਹ ਸਾਰੇ ਪੂਰਨ ਅੰਕ x ਲਿਖੋ ਜੋ ${systemText(items)} ਨੂੰ ਇਕੱਠੇ ਪੂਰਾ ਕਰਦੇ ਹਨ।`;
    }
    case "NUM-CP008-PROT-012": {
      const x = numberValue(s, "x");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const candidates = numberArray(s, "candidates");
      return hi
        ? `ax ≡ ${b} (mod ${modulus}) में x = ${x} है। {${candidates.join(", ")}} में से a का कौन-सा मान इस समीकरण को सत्य करता है?`
        : `ax ≡ ${b} (mod ${modulus}) ਵਿੱਚ x = ${x} ਹੈ। {${candidates.join(", ")}} ਵਿੱਚੋਂ a ਦਾ ਕਿਹੜਾ ਮੁੱਲ ਇਸ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਕਰਦਾ ਹੈ?`;
    }
    case "NUM-CP008-PROT-013": {
      const value = numberValue(s, "value");
      const residue = numberValue(s, "residue");
      const candidates = numberArray(s, "candidates");
      return hi
        ? `यदि ${value} ≡ ${residue} (mod m), तो {${candidates.join(", ")}} में से m का कौन-सा मान सही है?`
        : `ਜੇ ${value} ≡ ${residue} (mod m), ਤਾਂ {${candidates.join(", ")}} ਵਿੱਚੋਂ m ਦਾ ਕਿਹੜਾ ਮੁੱਲ ਸਹੀ ਹੈ?`;
    }
    case "NUM-CP008-PROT-014": {
      const base = numberValue(s, "base");
      const highestExponent = numberValue(s, "highestExponent");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `1 + ${base} + ${base}^2 + ... + ${base}^${highestExponent} को ${modulus} से भाग देने पर न्यूनतम गैर-ऋणात्मक शेषफल ज्ञात कीजिए।`
        : `1 + ${base} + ${base}^2 + ... + ${base}^${highestExponent} ਨੂੰ ${modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਬਾਕੀ ਲੱਭੋ।`;
    }
    case "NUM-CP008-PROT-015": {
      const items = constraints(s);
      return hi
        ? `सबसे छोटा धनात्मक x ज्ञात कीजिए जो ${systemText(items)} तीनों शर्तों को संतुष्ट करता है।`
        : `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ x ਲੱਭੋ ਜੋ ${systemText(items)} ਤਿੰਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ।`;
    }
    case "NUM-CP008-PROT-016": {
      const items = constraints(s);
      return hi
        ? `सिस्टम ${systemText(items)} का सही वर्गीकरण कीजिए।`
        : `ਸਿਸਟਮ ${systemText(items)} ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕਰੋ।`;
    }
    case "NUM-CP008-PROT-017": {
      const least = numberValue(s, "least");
      const r1 = numberValue(s, "r1");
      const m1 = numberValue(s, "m1");
      const m2 = numberValue(s, "m2");
      return hi
        ? `x ≡ ${r1} (mod ${m1}) और x ≡ r (mod ${m2}) का सबसे छोटा धनात्मक हल ${least} है। r का न्यूनतम गैर-ऋणात्मक मान ज्ञात कीजिए।`
        : `x ≡ ${r1} (mod ${m1}) ਅਤੇ x ≡ r (mod ${m2}) ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਹੱਲ ${least} ਹੈ। r ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਮੁੱਲ ਲੱਭੋ।`;
    }
    case "NUM-CP008-PROT-018": {
      const base = numberValue(s, "baseValue");
      const exponent = numberValue(s, "exponent");
      const add = numberValue(s, "add");
      const inner = numberValue(s, "innerModulus");
      const multiplier = numberValue(s, "multiplier");
      const shift = numberValue(s, "shift");
      const outer = numberValue(s, "outerModulus");
      return hi
        ? `पहले y को ${base}^${exponent} + ${add} का मॉड्यूलो ${inner} में न्यूनतम गैर-ऋणात्मक अवशेष मानिए। फिर ${multiplier}y + ${shift} का मॉड्यूलो ${outer} में न्यूनतम गैर-ऋणात्मक अवशेष ज्ञात कीजिए।`
        : `ਪਹਿਲਾਂ y ਨੂੰ ${base}^${exponent} + ${add} ਦਾ ਮਾਡਿਊਲੋ ${inner} ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਅਵਸ਼ੇਸ਼ ਮੰਨੋ। ਫਿਰ ${multiplier}y + ${shift} ਦਾ ਮਾਡਿਊਲੋ ${outer} ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ ਗੈਰ-ਰਿਣਾਤਮਕ ਅਵਸ਼ੇਸ਼ ਲੱਭੋ।`;
    }
    case "NUM-CP008-PROT-019": {
      const items = constraints(s);
      const candidates = numberArray(s, "candidates");
      return hi
        ? `{${candidates.join(", ")}} में से कौन-सा मान ${systemText(items)} सभी मॉड्यूलर शर्तों को संतुष्ट करता है?`
        : `{${candidates.join(", ")}} ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੁੱਲ ${systemText(items)} ਸਾਰੀਆਂ ਮਾਡਿਊਲਰ ਸ਼ਰਤਾਂ ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ?`;
    }
    case "NUM-CP008-PROT-020": {
      const common = numberValue(s, "commonRemainder");
      const different = numberValue(s, "differentRemainder");
      const m1 = numberValue(s, "m1");
      const m2 = numberValue(s, "m2");
      const m3 = numberValue(s, "m3");
      return hi
        ? `सबसे छोटा धनात्मक पूर्णांक x ज्ञात कीजिए जो ${m1} और ${m2} दोनों से भाग देने पर शेष ${common}, तथा ${m3} से भाग देने पर शेष ${different} देता है।`
        : `ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ x ਲੱਭੋ ਜੋ ${m1} ਅਤੇ ${m2} ਦੋਵਾਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${common}, ਅਤੇ ${m3} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${different} ਦਿੰਦਾ ਹੈ।`;
    }
    case "NUM-CP008-PROT-021": {
      const items = constraints(s);
      const least = numberValue(s, "least");
      const statements = s.statements as readonly Readonly<Record<string, number>>[];
      if (!Array.isArray(statements) || statements.length !== 3) throw new Error("Expected three statements");
      const lines = statements.map((row, index) => `${["I", "II", "III"][index]}. ${row.candidate} ≡ ${row.residue} (mod ${row.modulus})`).join("\n");
      return hi
        ? `संगत सिस्टम ${systemText(items)} का सबसे छोटा धनात्मक हल ${least} है।\n${lines}\nकौन-से कथन सही हैं?`
        : `ਸੰਗਤ ਸਿਸਟਮ ${systemText(items)} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਹੱਲ ${least} ਹੈ।\n${lines}\nਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?`;
    }
    case "NUM-CP008-PROT-022": {
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const one = s.statementI as Readonly<Record<string, number>>;
      const two = s.statementII as Readonly<Record<string, number>>;
      return hi
        ? `एक पूर्णांक x, [${lower}, ${upper}] में है। क्या x का मान एकमात्र रूप से तय होता है?\nI. x ≡ ${one.residue} (mod ${one.modulus})\nII. x ≡ ${two.residue} (mod ${two.modulus})`
        : `ਇੱਕ ਪੂਰਨ ਅੰਕ x, [${lower}, ${upper}] ਵਿੱਚ ਹੈ। ਕੀ x ਦਾ ਮੁੱਲ ਇਕੋ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ?\nI. x ≡ ${one.residue} (mod ${one.modulus})\nII. x ≡ ${two.residue} (mod ${two.modulus})`;
    }
    case "NUM-CP008-PROT-023": {
      const digit = numberValue(s, "digit");
      const length = numberValue(s, "length");
      const modulus = numberValue(s, "modulus");
      return hi
        ? `दशमलव पद्धति में अंक ${digit} को ठीक ${length} बार लगातार लिखकर एक पूर्णांक बनाया गया है। उसे ${modulus} से भाग देने पर शेषफल क्या होगा?`
        : `ਦਸ਼ਮਲਵ ਪੱਧਤੀ ਵਿੱਚ ਅੰਕ ${digit} ਨੂੰ ਠੀਕ ${length} ਵਾਰ ਲਗਾਤਾਰ ਲਿਖ ਕੇ ਇੱਕ ਪੂਰਨ ਅੰਕ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਉਸ ਨੂੰ ${modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗਾ?`;
    }
    case "NUM-CP008-PROT-024": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      return hi
        ? `[${lower}, ${upper}] में कितने पूर्णांक x, ${systemText(items)} तीनों शर्तों को एक साथ संतुष्ट करते हैं?`
        : `[${lower}, ${upper}] ਵਿੱਚ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ x, ${systemText(items)} ਤਿੰਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਇਕੱਠੇ ਪੂਰਾ ਕਰਦੇ ਹਨ?`;
    }
    case "NUM-CP008-PROT-025": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const system = systemText(items);
      if (hi) {
        if (q.seed % 3 === 0) return `${lower} ≤ x ≤ ${upper} में ${system} को संतुष्ट करने वाले पूर्णांक हलों की संख्या का सही वर्गीकरण कौन-सा है?`;
        if (q.seed % 3 === 1) return `${lower} ≤ x ≤ ${upper} के लिए एक साथ दी गई शर्तें ${system} हैं। पूर्णांक हलों की संख्या को कैसे वर्गीकृत करेंगे?`;
        return `${lower} ≤ x ≤ ${upper} में x को ${system} संतुष्ट करना है। हलों की संख्या के बारे में कौन-सा कथन सही है?`;
      }
      if (q.seed % 3 === 0) return `${lower} ≤ x ≤ ${upper} ਵਿੱਚ ${system} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਪੂਰਨ ਅੰਕ ਹੱਲਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਕਿਹੜਾ ਹੈ?`;
      if (q.seed % 3 === 1) return `${lower} ≤ x ≤ ${upper} ਲਈ ਇਕੱਠੀਆਂ ਸ਼ਰਤਾਂ ${system} ਹਨ। ਪੂਰਨ ਅੰਕ ਹੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰੋਗੇ?`;
      return `${lower} ≤ x ≤ ${upper} ਵਿੱਚ x ਨੂੰ ${system} ਪੂਰਾ ਕਰਨਾ ਹੈ। ਹੱਲਾਂ ਦੀ ਗਿਣਤੀ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`;
    }
    case "NUM-CP008-PROT-026": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const system = systemText(items);
      if (hi) {
        if (q.seed % 3 === 0) return `${lower} ≤ x ≤ ${upper} में ${system} को संतुष्ट करने वाले सभी पूर्णांक x का पूरा समुच्चय ज्ञात कीजिए।`;
        if (q.seed % 3 === 1) return `कौन-सा विकल्प [${lower}, ${upper}] में ${system} को संतुष्ट करने वाले सभी पूर्णांकों की सही सूची देता है?`;
        return `${lower} ≤ x ≤ ${upper} के सभी पूर्णांक x ज्ञात कीजिए जिनके लिए ${system} एक साथ सत्य हों।`;
      }
      if (q.seed % 3 === 0) return `${lower} ≤ x ≤ ${upper} ਵਿੱਚ ${system} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਾਰੇ ਪੂਰਨ ਅੰਕ x ਦਾ ਪੂਰਾ ਸਮੂਹ ਲੱਭੋ।`;
      if (q.seed % 3 === 1) return `ਕਿਹੜਾ ਵਿਕਲਪ [${lower}, ${upper}] ਵਿੱਚ ${system} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਾਰੇ ਪੂਰਨ ਅੰਕਾਂ ਦੀ ਸਹੀ ਸੂਚੀ ਦਿੰਦਾ ਹੈ?`;
      return `${lower} ≤ x ≤ ${upper} ਦੇ ਸਾਰੇ ਪੂਰਨ ਅੰਕ x ਲੱਭੋ ਜਿਨ੍ਹਾਂ ਲਈ ${system} ਇਕੱਠੇ ਸਹੀ ਹੋਣ।`;
    }
    default:
      throw new Error(`No localized stem for ${q.temporaryPrototypeId}`);
  }
}

function conceptAndStrategy(id: string, language: NumCp008LocalizedLanguage): readonly [string, string] {
  const hi = language === "hi";
  const map: Readonly<Record<string, readonly [string, string]>> = hi ? {
    "NUM-CP008-PROT-001": ["मानक अवशेष हमेशा 0 से m−1 के बीच लिया जाता है।", "दी गई संख्या में m के पूरे गुणज जोड़कर या घटाकर उसे मानक सीमा में लाइए।"],
    "NUM-CP008-PROT-002": ["समान मॉड्यूलो वाले अवशेषों पर जोड़, घटाव और गुणा सीधे किया जा सकता है।", "पहले दिए गए अवशेषों पर मांगी गई क्रिया कीजिए, फिर परिणाम को मॉड्यूलो m में घटाइए।"],
    "NUM-CP008-PROT-003": ["बड़ी घात का पूरा मान निकालना जरूरी नहीं; हर गुणा के बाद मॉड्यूलो लिया जा सकता है।", "आधार को पहले घटाइए और क्रमिक वर्गीकरण से घात का अवशेष निकालिए।"],
    "NUM-CP008-PROT-004": ["जब HCF(a,m)=1 हो, तब a का मॉड्यूलर व्युत्क्रम होता है और एक ही अवशेष वर्ग मिलता है।", "a के व्युत्क्रम से दोनों पक्षों को गुणा करके x को अलग कीजिए।"],
    "NUM-CP008-PROT-005": ["यदि d=HCF(a,m), d संख्या b को भाग देता है, तो ठीक d अवशेष वर्ग हल होते हैं।", "पहले HCF और विभाज्यता जाँचिए, फिर घटे हुए समीकरण से वर्गों की संख्या तय कीजिए।"],
    "NUM-CP008-PROT-006": ["ax≡b (mod m) तभी हलयोग्य है जब HCF(a,m), b को भाग दे।", "HCF निकालकर b की विभाज्यता जाँचिए; असफल होने पर कोई अवशेष वर्ग संभव नहीं है।"],
    "NUM-CP008-PROT-007": ["संगत दो मॉड्यूलर शर्तें एक अवशेष वर्ग में मिलती हैं जिसका आवर्त LCM होता है।", "पहले संगतता जाँचिए, फिर पहली शर्त से x=r+mk लिखकर दूसरी शर्त लगाइए।"],
    "NUM-CP008-PROT-008": ["दो शर्तें तभी संगत हैं जब अवशेषों का अंतर मॉड्यूलों के HCF से विभाज्य हो।", "CRT लगाने से पहले HCF वाली संगतता शर्त की जाँच कीजिए।"],
    "NUM-CP008-PROT-009": ["एक अवशेष वर्ग के क्रमिक हलों में अंतर ठीक मॉड्यूल के बराबर होता है।", "सीमा के अंदर पहला हल खोजिए और मॉड्यूल जोड़ते हुए मांगे गए छोर तक जाइए।"],
    "NUM-CP008-PROT-010": ["एक निश्चित अवशेष वर्ग सीमा के अंदर समान अंतर वाली अंकगणितीय श्रेणी बनाता है।", "पहला और अंतिम वैध हल खोजकर श्रेणी के पदों की संख्या गिनिए।"],
    "NUM-CP008-PROT-011": ["संगत दो-शर्तीय सिस्टम एक अवशेष वर्ग में बदलता है और वही वर्ग LCM के बाद दोहरता है।", "पहले दोनों शर्तें मिलाइए, फिर दी गई सीमा में उसी वर्ग के सभी सदस्य लिखिए।"],
    "NUM-CP008-PROT-012": ["यदि x का मॉड्यूलर व्युत्क्रम मौजूद है, तो अज्ञात गुणांक a को अलग किया जा सकता है।", "a≡b·x⁻¹ (mod m) निकालकर विकल्पों से मिलान कीजिए।"],
    "NUM-CP008-PROT-013": ["N≡r (mod m) का अर्थ है कि m, N−r को पूरा भाग देता है और r<m होता है।", "N−r निकालकर जाँचिए कि कौन-सा दिया गया m उसे पूरा भाग देता है।"],
    "NUM-CP008-PROT-014": ["संरचित योग को हर पद पर मॉड्यूलो लेकर छोटा रखा जा सकता है।", "घातों के अवशेष क्रम से बनाइए और चलते हुए योग का अवशेष रखिए।"],
    "NUM-CP008-PROT-015": ["तीन संगत मॉड्यूलर शर्तों को एक-एक करके मिलाया जा सकता है।", "पहली दो शर्तें मिलाइए, फिर बने हुए वर्ग को तीसरी शर्त के साथ मिलाइए।"],
    "NUM-CP008-PROT-016": ["दो शर्तें मिल जाने के बाद तीसरी शर्त को नए आवर्त के HCF के अनुसार संगत होना चाहिए।", "पहली दो शर्तें मिलाकर तीसरी शर्त के साथ HCF-संगतता जाँचिए।"],
    "NUM-CP008-PROT-017": ["दिया हुआ हल हर मॉड्यूल के अंतर्गत सही अवशेष देता है।", "दिए गए सबसे छोटे हल को सीधे उस मॉड्यूल से भाग दीजिए जिसमें अवशेष r अज्ञात है।"],
    "NUM-CP008-PROT-018": ["नेस्टेड मॉड्यूलर व्यंजक में पहले अंदर वाला अवशेष पूरी तरह निकालना होता है।", "पहले y निकालिए, फिर उसी y को बाहरी व्यंजक में रखकर दूसरा मॉड्यूलो लीजिए।"],
    "NUM-CP008-PROT-019": ["सही विकल्प को सिस्टम की हर शर्त संतुष्ट करनी चाहिए।", "हर उम्मीदवार को सभी मॉड्यूलों से जाँचिए और केवल पूर्णतः सही उम्मीदवार रखिए।"],
    "NUM-CP008-PROT-020": ["समान-शेष वाली शर्तें पहले एक LCM-आवर्त में मिल सकती हैं, लेकिन अलग शेष वाली शर्त भी अनिवार्य है।", "पहली दो शर्तों को मिलाकर बने वर्ग पर तीसरी शर्त लगाइए।"],
    "NUM-CP008-PROT-021": ["हर मॉड्यूलर कथन को उसके अपने उम्मीदवार और मॉड्यूल से अलग-अलग जाँचा जाता है।", "I, II और III का सत्य-मूल्य अलग निकालकर सही संयोजन चुनिए।"],
    "NUM-CP008-PROT-022": ["डेटा पर्याप्त तभी है जब दी गई सीमा में ठीक एक मान बचता हो।", "कथन I, कथन II और दोनों साथ लेने पर बचे उम्मीदवारों की संख्या अलग-अलग गिनिए।"],
    "NUM-CP008-PROT-023": ["एक अंक जोड़ने पर नया अवशेष (10r+d) mod m बनता है।", "पूरी बड़ी संख्या बनाने के बजाय हर नए अंक के साथ केवल वर्तमान अवशेष अपडेट कीजिए।"],
    "NUM-CP008-PROT-024": ["संगत तीन-शर्तीय सिस्टम अंत में एक ही आवर्ती अवशेष वर्ग बनाता है।", "तीनों शर्तें मिलाकर अंतिम आवर्त निकालिए और सीमा के अंदर उसी वर्ग के पद गिनिए।"],
    "NUM-CP008-PROT-025": ["पहले शर्तों को एक सामान्य अवशेष वर्ग में मिलाना है, फिर उस वर्ग को दी गई सीमा पर लागू करना है।", "संगतता जाँचिए, सामान्य आवर्त निकालिए और केवल सीमा के अंदर आने वाले हल गिनिए।"],
    "NUM-CP008-PROT-026": ["संगत तीन-शर्तीय सिस्टम एक निश्चित आवर्त वाला एक अवशेष वर्ग देता है।", "तीनों शर्तें मिलाकर उस वर्ग के हर सदस्य को दी गई सीमा के अंदर सूचीबद्ध कीजिए।"],
  } : {
    "NUM-CP008-PROT-001": ["ਮਿਆਰੀ ਅਵਸ਼ੇਸ਼ ਹਮੇਸ਼ਾ 0 ਤੋਂ m−1 ਦੇ ਵਿਚਕਾਰ ਲਿਆ ਜਾਂਦਾ ਹੈ।", "ਦਿੱਤੀ ਸੰਖਿਆ ਵਿੱਚ m ਦੇ ਪੂਰੇ ਗੁਣਜ ਜੋੜ ਕੇ ਜਾਂ ਘਟਾ ਕੇ ਉਸ ਨੂੰ ਮਿਆਰੀ ਹੱਦ ਵਿੱਚ ਲਿਆਓ।"],
    "NUM-CP008-PROT-002": ["ਇੱਕੋ ਮਾਡਿਊਲੋ ਵਾਲੇ ਅਵਸ਼ੇਸ਼ਾਂ ਤੇ ਜੋੜ, ਘਟਾਓ ਅਤੇ ਗੁਣਾ ਸਿੱਧਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।", "ਪਹਿਲਾਂ ਦਿੱਤੇ ਅਵਸ਼ੇਸ਼ਾਂ ਤੇ ਮੰਗੀ ਕਿਰਿਆ ਕਰੋ, ਫਿਰ ਨਤੀਜੇ ਨੂੰ ਮਾਡਿਊਲੋ m ਵਿੱਚ ਘਟਾਓ।"],
    "NUM-CP008-PROT-003": ["ਵੱਡੀ ਘਾਤ ਦਾ ਪੂਰਾ ਮੁੱਲ ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਹਰ ਗੁਣਾ ਤੋਂ ਬਾਅਦ ਮਾਡਿਊਲੋ ਲਿਆ ਜਾ ਸਕਦਾ ਹੈ।", "ਆਧਾਰ ਨੂੰ ਪਹਿਲਾਂ ਘਟਾਓ ਅਤੇ ਲਗਾਤਾਰ ਵਰਗ ਬਣਾਕੇ ਘਾਤ ਦਾ ਅਵਸ਼ੇਸ਼ ਕੱਢੋ।"],
    "NUM-CP008-PROT-004": ["ਜਦੋਂ HCF(a,m)=1 ਹੋਵੇ, ਤਾਂ a ਦਾ ਮਾਡਿਊਲਰ ਉਲਟ ਹੁੰਦਾ ਹੈ ਅਤੇ ਇੱਕੋ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਮਿਲਦਾ ਹੈ।", "a ਦੇ ਉਲਟ ਨਾਲ ਦੋਵੇਂ ਪਾਸਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ x ਨੂੰ ਅਲੱਗ ਕਰੋ।"],
    "NUM-CP008-PROT-005": ["ਜੇ d=HCF(a,m), d ਸੰਖਿਆ b ਨੂੰ ਭਾਗ ਦਿੰਦਾ ਹੈ, ਤਾਂ ਠੀਕ d ਅਵਸ਼ੇਸ਼ ਵਰਗ ਹੱਲ ਹੁੰਦੇ ਹਨ।", "ਪਹਿਲਾਂ HCF ਅਤੇ ਭਾਗਯੋਗਤਾ ਜਾਂਚੋ, ਫਿਰ ਘਟੇ ਸਮੀਕਰਨ ਤੋਂ ਵਰਗਾਂ ਦੀ ਗਿਣਤੀ ਨਿਰਧਾਰਤ ਕਰੋ।"],
    "NUM-CP008-PROT-006": ["ax≡b (mod m) ਤਦੋਂ ਹੀ ਹੱਲਯੋਗ ਹੈ ਜਦੋਂ HCF(a,m), b ਨੂੰ ਭਾਗ ਦੇਵੇ।", "HCF ਕੱਢ ਕੇ b ਦੀ ਭਾਗਯੋਗਤਾ ਜਾਂਚੋ; ਅਸਫਲ ਹੋਣ ਤੇ ਕੋਈ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਸੰਭਵ ਨਹੀਂ।"],
    "NUM-CP008-PROT-007": ["ਸੰਗਤ ਦੋ ਮਾਡਿਊਲਰ ਸ਼ਰਤਾਂ ਇੱਕ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਵਿੱਚ ਮਿਲਦੀਆਂ ਹਨ ਜਿਸ ਦਾ ਆਵਰਤ LCM ਹੁੰਦਾ ਹੈ।", "ਪਹਿਲਾਂ ਸੰਗਤਤਾ ਜਾਂਚੋ, ਫਿਰ ਪਹਿਲੀ ਸ਼ਰਤ ਤੋਂ x=r+mk ਲਿਖ ਕੇ ਦੂਜੀ ਸ਼ਰਤ ਲਗਾਓ।"],
    "NUM-CP008-PROT-008": ["ਦੋ ਸ਼ਰਤਾਂ ਤਦੋਂ ਹੀ ਸੰਗਤ ਹਨ ਜਦੋਂ ਅਵਸ਼ੇਸ਼ਾਂ ਦਾ ਅੰਤਰ ਮਾਡਿਊਲਾਂ ਦੇ HCF ਨਾਲ ਭਾਗਯੋਗ ਹੋਵੇ।", "CRT ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ HCF ਵਾਲੀ ਸੰਗਤਤਾ ਸ਼ਰਤ ਜਾਂਚੋ।"],
    "NUM-CP008-PROT-009": ["ਇੱਕ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਦੇ ਲਗਾਤਾਰ ਹੱਲਾਂ ਵਿੱਚ ਫਰਕ ਠੀਕ ਮਾਡਿਊਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।", "ਹੱਦ ਦੇ ਅੰਦਰ ਪਹਿਲਾ ਹੱਲ ਲੱਭੋ ਅਤੇ ਮਾਡਿਊਲ ਜੋੜਦੇ ਹੋਏ ਮੰਗੇ ਸਿਰੇ ਤੱਕ ਜਾਓ।"],
    "NUM-CP008-PROT-010": ["ਇੱਕ ਨਿਰਧਾਰਤ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਹੱਦ ਦੇ ਅੰਦਰ ਸਮਾਨ ਅੰਤਰ ਵਾਲੀ ਅੰਕਗਣਿਤਕ ਲੜੀ ਬਣਾਉਂਦਾ ਹੈ।", "ਪਹਿਲਾ ਅਤੇ ਆਖਰੀ ਠੀਕ ਹੱਲ ਲੱਭ ਕੇ ਲੜੀ ਦੇ ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।"],
    "NUM-CP008-PROT-011": ["ਸੰਗਤ ਦੋ-ਸ਼ਰਤੀ ਸਿਸਟਮ ਇੱਕ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਵਿੱਚ ਬਦਲਦਾ ਹੈ ਅਤੇ ਉਹੀ ਵਰਗ LCM ਤੋਂ ਬਾਅਦ ਦੁਹਰਾਉਂਦਾ ਹੈ।", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਮਿਲਾਓ, ਫਿਰ ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਉਸੇ ਵਰਗ ਦੇ ਸਾਰੇ ਮੈਂਬਰ ਲਿਖੋ।"],
    "NUM-CP008-PROT-012": ["ਜੇ x ਦਾ ਮਾਡਿਊਲਰ ਉਲਟ ਮੌਜੂਦ ਹੈ, ਤਾਂ ਅਣਜਾਣ ਗੁਣਾਂਕ a ਨੂੰ ਅਲੱਗ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।", "a≡b·x⁻¹ (mod m) ਕੱਢ ਕੇ ਵਿਕਲਪਾਂ ਨਾਲ ਮਿਲਾਓ।"],
    "NUM-CP008-PROT-013": ["N≡r (mod m) ਦਾ ਅਰਥ ਹੈ ਕਿ m, N−r ਨੂੰ ਪੂਰਾ ਭਾਗ ਦਿੰਦਾ ਹੈ ਅਤੇ r<m ਹੁੰਦਾ ਹੈ।", "N−r ਕੱਢ ਕੇ ਜਾਂਚੋ ਕਿ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ m ਉਸ ਨੂੰ ਪੂਰਾ ਭਾਗ ਦਿੰਦਾ ਹੈ।"],
    "NUM-CP008-PROT-014": ["ਬਣਤਰ ਵਾਲੇ ਜੋੜ ਨੂੰ ਹਰ ਪਦ ਤੇ ਮਾਡਿਊਲੋ ਲੈ ਕੇ ਛੋਟਾ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।", "ਘਾਤਾਂ ਦੇ ਅਵਸ਼ੇਸ਼ ਲੜੀਵਾਰ ਬਣਾਓ ਅਤੇ ਚੱਲਦੇ ਜੋੜ ਦਾ ਅਵਸ਼ੇਸ਼ ਰੱਖੋ।"],
    "NUM-CP008-PROT-015": ["ਤਿੰਨ ਸੰਗਤ ਮਾਡਿਊਲਰ ਸ਼ਰਤਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਮਿਲਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।", "ਪਹਿਲੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਮਿਲਾਓ, ਫਿਰ ਬਣੇ ਵਰਗ ਨੂੰ ਤੀਜੀ ਸ਼ਰਤ ਨਾਲ ਮਿਲਾਓ।"],
    "NUM-CP008-PROT-016": ["ਦੋ ਸ਼ਰਤਾਂ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਤੀਜੀ ਸ਼ਰਤ ਨਵੇਂ ਆਵਰਤ ਦੇ HCF ਅਨੁਸਾਰ ਸੰਗਤ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।", "ਪਹਿਲੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਮਿਲਾ ਕੇ ਤੀਜੀ ਸ਼ਰਤ ਨਾਲ HCF-ਸੰਗਤਤਾ ਜਾਂਚੋ।"],
    "NUM-CP008-PROT-017": ["ਦਿੱਤਾ ਹੱਲ ਹਰ ਮਾਡਿਊਲ ਹੇਠ ਸਹੀ ਅਵਸ਼ੇਸ਼ ਦਿੰਦਾ ਹੈ।", "ਦਿੱਤੇ ਸਭ ਤੋਂ ਛੋਟੇ ਹੱਲ ਨੂੰ ਸਿੱਧਾ ਉਸ ਮਾਡਿਊਲ ਨਾਲ ਭਾਗ ਦਿਓ ਜਿਸ ਵਿੱਚ ਅਵਸ਼ੇਸ਼ r ਅਣਜਾਣ ਹੈ।"],
    "NUM-CP008-PROT-018": ["ਨੇਸਟਡ ਮਾਡਿਊਲਰ ਵਿਅੰਜਕ ਵਿੱਚ ਪਹਿਲਾਂ ਅੰਦਰਲਾ ਅਵਸ਼ੇਸ਼ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੱਢਣਾ ਹੁੰਦਾ ਹੈ।", "ਪਹਿਲਾਂ y ਕੱਢੋ, ਫਿਰ ਉਸੇ y ਨੂੰ ਬਾਹਰੀ ਵਿਅੰਜਕ ਵਿੱਚ ਰੱਖ ਕੇ ਦੂਜਾ ਮਾਡਿਊਲੋ ਲਓ।"],
    "NUM-CP008-PROT-019": ["ਸਹੀ ਵਿਕਲਪ ਨੂੰ ਸਿਸਟਮ ਦੀ ਹਰ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।", "ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਸਾਰੇ ਮਾਡਿਊਲਾਂ ਨਾਲ ਜਾਂਚੋ ਅਤੇ ਕੇਵਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹੀ ਉਮੀਦਵਾਰ ਰੱਖੋ।"],
    "NUM-CP008-PROT-020": ["ਇੱਕੋ ਬਾਕੀ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਪਹਿਲਾਂ ਇੱਕ LCM-ਆਵਰਤ ਵਿੱਚ ਮਿਲ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਵੱਖਰੇ ਬਾਕੀ ਵਾਲੀ ਸ਼ਰਤ ਵੀ ਲਾਜ਼ਮੀ ਹੈ।", "ਪਹਿਲੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਬਣੇ ਵਰਗ ਤੇ ਤੀਜੀ ਸ਼ਰਤ ਲਗਾਓ।"],
    "NUM-CP008-PROT-021": ["ਹਰ ਮਾਡਿਊਲਰ ਕਥਨ ਨੂੰ ਉਸ ਦੇ ਆਪਣੇ ਉਮੀਦਵਾਰ ਅਤੇ ਮਾਡਿਊਲ ਨਾਲ ਅਲੱਗ ਜਾਂਚਿਆ ਜਾਂਦਾ ਹੈ।", "I, II ਅਤੇ III ਦਾ ਸੱਚ-ਮੁੱਲ ਅਲੱਗ ਕੱਢ ਕੇ ਸਹੀ ਜੋੜ ਚੁਣੋ।"],
    "NUM-CP008-PROT-022": ["ਜਾਣਕਾਰੀ ਤਦੋਂ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਠੀਕ ਇੱਕ ਮੁੱਲ ਬਚੇ।", "ਕਥਨ I, ਕਥਨ II ਅਤੇ ਦੋਵੇਂ ਇਕੱਠੇ ਲੈਣ ਤੇ ਬਚੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਅਲੱਗ-ਅਲੱਗ ਕਰੋ।"],
    "NUM-CP008-PROT-023": ["ਇੱਕ ਅੰਕ ਜੋੜਨ ਤੇ ਨਵਾਂ ਅਵਸ਼ੇਸ਼ (10r+d) mod m ਬਣਦਾ ਹੈ।", "ਪੂਰੀ ਵੱਡੀ ਸੰਖਿਆ ਬਣਾਉਣ ਦੀ ਥਾਂ ਹਰ ਨਵੇਂ ਅੰਕ ਨਾਲ ਕੇਵਲ ਮੌਜੂਦਾ ਅਵਸ਼ੇਸ਼ ਅਪਡੇਟ ਕਰੋ।"],
    "NUM-CP008-PROT-024": ["ਸੰਗਤ ਤਿੰਨ-ਸ਼ਰਤੀ ਸਿਸਟਮ ਅੰਤ ਵਿੱਚ ਇੱਕੋ ਆਵਰਤੀ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਬਣਾਉਂਦਾ ਹੈ।", "ਤਿੰਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਅੰਤਿਮ ਆਵਰਤ ਕੱਢੋ ਅਤੇ ਹੱਦ ਦੇ ਅੰਦਰ ਉਸੇ ਵਰਗ ਦੇ ਪਦ ਗਿਣੋ।"],
    "NUM-CP008-PROT-025": ["ਪਹਿਲਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਇੱਕ ਸਾਂਝੇ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਵਿੱਚ ਮਿਲਾਉਣਾ ਹੈ, ਫਿਰ ਉਸ ਵਰਗ ਨੂੰ ਦਿੱਤੀ ਹੱਦ ਤੇ ਲਾਗੂ ਕਰਨਾ ਹੈ।", "ਸੰਗਤਤਾ ਜਾਂਚੋ, ਸਾਂਝਾ ਆਵਰਤ ਕੱਢੋ ਅਤੇ ਕੇਵਲ ਹੱਦ ਦੇ ਅੰਦਰ ਆਉਣ ਵਾਲੇ ਹੱਲ ਗਿਣੋ।"],
    "NUM-CP008-PROT-026": ["ਸੰਗਤ ਤਿੰਨ-ਸ਼ਰਤੀ ਸਿਸਟਮ ਇੱਕ ਨਿਰਧਾਰਤ ਆਵਰਤ ਵਾਲਾ ਇੱਕ ਅਵਸ਼ੇਸ਼ ਵਰਗ ਦਿੰਦਾ ਹੈ।", "ਤਿੰਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਉਸ ਵਰਗ ਦੇ ਹਰ ਮੈਂਬਰ ਨੂੰ ਦਿੱਤੀ ਹੱਦ ਦੇ ਅੰਦਰ ਲਿਖੋ।"],
  };
  const value = map[id];
  if (!value) throw new Error(`No localized concept for ${id}`);
  return value;
}

function localizedMergeSteps(items: readonly Constraint[], language: NumCp008LocalizedLanguage): string[] {
  const merged = mergeConstraints(items);
  if (!merged) return [];
  const hi = language === "hi";
  return merged.steps.map((step) => hi
    ? `पहले x = ${step.beforeResidue} + ${step.beforePeriod}k लिखें। अगली शर्त से ${step.beforePeriod}k ≡ ${step.difference} (mod ${step.nextModulus}) मिलता है। HCF = ${step.gcd} से घटाने पर k = ${step.k} का न्यूनतम मान मिलता है, इसलिए x ≡ ${step.residue} (mod ${step.period})।`
    : `ਪਹਿਲਾਂ x = ${step.beforeResidue} + ${step.beforePeriod}k ਲਿਖੋ। ਅਗਲੀ ਸ਼ਰਤ ਤੋਂ ${step.beforePeriod}k ≡ ${step.difference} (mod ${step.nextModulus}) ਮਿਲਦਾ ਹੈ। HCF = ${step.gcd} ਨਾਲ ਘਟਾਉਣ ਤੇ k = ${step.k} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ x ≡ ${step.residue} (mod ${step.period})।`);
}

function localizedSteps(q: NumCp008PermanentPackage, language: NumCp008LocalizedLanguage): readonly string[] {
  const s = stateOf(q);
  const hi = language === "hi";
  const finalAnswer = localizeNumCp008Answer(q.canonicalAnswer, language);
  switch (q.temporaryPrototypeId) {
    case "NUM-CP008-PROT-001": {
      const raw = numberValue(s, "raw");
      const modulus = numberValue(s, "modulus");
      const residue = numberValue(s, "residue");
      const quotient = (raw - residue) / modulus;
      return hi
        ? [`${raw} = ${quotient} × ${modulus} + ${residue}; इसलिए ${raw} और ${residue} का अंतर ${modulus} का पूरा गुणज है।`, `${residue}, 0 से ${modulus - 1} के बीच है, इसलिए यही मानक अवशेष है।`]
        : [`${raw} = ${quotient} × ${modulus} + ${residue}; ਇਸ ਲਈ ${raw} ਅਤੇ ${residue} ਦਾ ਫਰਕ ${modulus} ਦਾ ਪੂਰਾ ਗੁਣਜ ਹੈ।`, `${residue}, 0 ਤੋਂ ${modulus - 1} ਦੇ ਵਿਚਕਾਰ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਮਿਆਰੀ ਅਵਸ਼ੇਸ਼ ਹੈ।`];
    }
    case "NUM-CP008-PROT-002": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const raw = numberValue(s, "raw");
      const residue = numberValue(s, "residue");
      const operation = stringValue(s, "operation");
      const symbol = operation === "SUM" ? "+" : operation === "DIFFERENCE" ? "−" : "×";
      return hi
        ? [`दिए हुए अवशेषों पर क्रिया करें: ${a} ${symbol} ${b} = ${raw}।`, `${raw} को ${modulus} से घटाने पर अवशेष ${residue} मिलता है।`]
        : [`ਦਿੱਤੇ ਅਵਸ਼ੇਸ਼ਾਂ ਤੇ ਕਿਰਿਆ ਕਰੋ: ${a} ${symbol} ${b} = ${raw}।`, `${raw} ਨੂੰ ${modulus} ਨਾਲ ਘਟਾਉਣ ਤੇ ਅਵਸ਼ੇਸ਼ ${residue} ਮਿਲਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-003": {
      const base = numberValue(s, "base");
      const exponent = numberValue(s, "exponent");
      const modulus = numberValue(s, "modulus");
      const residue = numberValue(s, "residue");
      const baseResidue = mod(base, modulus);
      if (exponent === 0) return hi
        ? [`घात 0 है, इसलिए ${base}^0 = 1।`, `1 को ${modulus} से भाग देने पर शेष 1 ही है।`]
        : [`ਘਾਤ 0 ਹੈ, ਇਸ ਲਈ ${base}^0 = 1।`, `1 ਨੂੰ ${modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ 1 ਹੀ ਹੈ।`];
      return hi
        ? [`पहले आधार घटाएँ: ${base} ≡ ${baseResidue} (mod ${modulus})।`, `क्रमिक वर्गीकरण में हर गुणा के बाद मॉड्यूलो ${modulus} लेने पर ${base}^${exponent} ≡ ${residue} (mod ${modulus}) मिलता है।`]
        : [`ਪਹਿਲਾਂ ਆਧਾਰ ਘਟਾਓ: ${base} ≡ ${baseResidue} (mod ${modulus})।`, `ਲਗਾਤਾਰ ਵਰਗ ਬਣਾਉਂਦੇ ਹੋਏ ਹਰ ਗੁਣਾ ਤੋਂ ਬਾਅਦ ਮਾਡਿਊਲੋ ${modulus} ਲੈਣ ਤੇ ${base}^${exponent} ≡ ${residue} (mod ${modulus}) ਮਿਲਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-004": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const solution = numberValue(s, "solution");
      const inv = inverse(a, modulus);
      return hi
        ? [`HCF(${a}, ${modulus}) = 1, इसलिए ${a} का व्युत्क्रम ${inv} है क्योंकि ${a}×${inv} ≡ 1 (mod ${modulus})।`, `दोनों पक्षों को ${inv} से गुणा करें: x ≡ ${inv}×${b} ≡ ${solution} (mod ${modulus})।`]
        : [`HCF(${a}, ${modulus}) = 1, ਇਸ ਲਈ ${a} ਦਾ ਉਲਟ ${inv} ਹੈ ਕਿਉਂਕਿ ${a}×${inv} ≡ 1 (mod ${modulus})।`, `ਦੋਵੇਂ ਪਾਸਿਆਂ ਨੂੰ ${inv} ਨਾਲ ਗੁਣਾ ਕਰੋ: x ≡ ${inv}×${b} ≡ ${solution} (mod ${modulus})।`];
    }
    case "NUM-CP008-PROT-005": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const d = numberValue(s, "gcd");
      const solutions = numberArray(s, "solutions");
      return hi
        ? [`HCF(${a}, ${modulus}) = ${d} और ${d}, ${b} को पूरा भाग देता है; इसलिए समीकरण हलयोग्य है।`, `ऐसी स्थिति में मॉड्यूलो ${modulus} में ठीक ${d} अवशेष वर्ग मिलते हैं: ${setText(solutions)}।`]
        : [`HCF(${a}, ${modulus}) = ${d} ਅਤੇ ${d}, ${b} ਨੂੰ ਪੂਰਾ ਭਾਗ ਦਿੰਦਾ ਹੈ; ਇਸ ਲਈ ਸਮੀਕਰਨ ਹੱਲਯੋਗ ਹੈ।`, `ਇਸ ਹਾਲਤ ਵਿੱਚ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਠੀਕ ${d} ਅਵਸ਼ੇਸ਼ ਵਰਗ ਮਿਲਦੇ ਹਨ: ${setText(solutions)}।`];
    }
    case "NUM-CP008-PROT-006": {
      const a = numberValue(s, "a");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const d = numberValue(s, "gcd");
      return hi
        ? [`HCF(${a}, ${modulus}) = ${d}।`, `${d}, ${b} को पूरा भाग नहीं देता, इसलिए कोई x इस मॉड्यूलर समीकरण को संतुष्ट नहीं कर सकता।`]
        : [`HCF(${a}, ${modulus}) = ${d}।`, `${d}, ${b} ਨੂੰ ਪੂਰਾ ਭਾਗ ਨਹੀਂ ਦਿੰਦਾ, ਇਸ ਲਈ ਕੋਈ x ਇਸ ਮਾਡਿਊਲਰ ਸਮੀਕਰਨ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਦਾ।`];
    }
    case "NUM-CP008-PROT-007": {
      const r1 = numberValue(s, "r1");
      const m1 = numberValue(s, "m1");
      const r2 = numberValue(s, "r2");
      const m2 = numberValue(s, "m2");
      const period = numberValue(s, "period");
      const residue = numberValue(s, "solutionResidue");
      const g = gcd(m1, m2);
      const merge = mergeConstraints([{ residue: r1, modulus: m1 }, { residue: r2, modulus: m2 }])!;
      const k = merge.steps[0]!.k;
      const least = residue === 0 ? period : residue;
      return hi
        ? [`HCF(${m1}, ${m2}) = ${g} और ${r2}−${r1} = ${r2 - r1}, ${g} से विभाज्य है; इसलिए दोनों शर्तें संगत हैं।`, `x = ${r1} + ${m1}k रखने पर k = ${k} का न्यूनतम उपयुक्त मान मिलता है, इसलिए x ≡ ${residue} (mod ${period})।`, `धनात्मक हल हर ${period} के बाद दोहरते हैं; सबसे छोटा धनात्मक हल ${least} है।`]
        : [`HCF(${m1}, ${m2}) = ${g} ਅਤੇ ${r2}−${r1} = ${r2 - r1}, ${g} ਨਾਲ ਭਾਗਯੋਗ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਸੰਗਤ ਹਨ।`, `x = ${r1} + ${m1}k ਰੱਖਣ ਤੇ k = ${k} ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਠੀਕ ਮੁੱਲ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ x ≡ ${residue} (mod ${period})।`, `ਧਨਾਤਮਕ ਹੱਲ ਹਰ ${period} ਤੋਂ ਬਾਅਦ ਦੁਹਰਾਉਂਦੇ ਹਨ; ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਹੱਲ ${least} ਹੈ।`];
    }
    case "NUM-CP008-PROT-008": {
      const r1 = numberValue(s, "r1");
      const m1 = numberValue(s, "m1");
      const r2 = numberValue(s, "r2");
      const m2 = numberValue(s, "m2");
      const g = numberValue(s, "gcd");
      return hi
        ? [`HCF(${m1}, ${m2}) = ${g}।`, `अवशेषों का अंतर ${r2}−${r1} = ${r2 - r1}, ${g} से विभाज्य नहीं है; इसलिए दोनों शर्तें एक ही पूर्णांक के लिए सत्य नहीं हो सकतीं।`]
        : [`HCF(${m1}, ${m2}) = ${g}।`, `ਅਵਸ਼ੇਸ਼ਾਂ ਦਾ ਫਰਕ ${r2}−${r1} = ${r2 - r1}, ${g} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਇੱਕੋ ਪੂਰਨ ਅੰਕ ਲਈ ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ।`];
    }
    case "NUM-CP008-PROT-009": {
      const first = numberValue(s, "first");
      const last = numberValue(s, "last");
      const modulus = numberValue(s, "modulus");
      const direction = stringValue(s, "direction");
      return hi
        ? [`सीमा के अंदर पहला वैध मान ${first} है। इसके बाद हर अगला हल ${modulus} जोड़ने पर मिलता है।`, `इस क्रम का अंतिम वैध मान ${last} है; इसलिए मांगा गया ${direction === "LEAST" ? "सबसे छोटा" : "सबसे बड़ा"} मान ${finalAnswer} है।`]
        : [`ਹੱਦ ਦੇ ਅੰਦਰ ਪਹਿਲਾ ਠੀਕ ਮੁੱਲ ${first} ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ਹਰ ਅਗਲਾ ਹੱਲ ${modulus} ਜੋੜਨ ਤੇ ਮਿਲਦਾ ਹੈ।`, `ਇਸ ਲੜੀ ਦਾ ਆਖਰੀ ਠੀਕ ਮੁੱਲ ${last} ਹੈ; ਇਸ ਲਈ ਮੰਗਿਆ ${direction === "LEAST" ? "ਸਭ ਤੋਂ ਛੋਟਾ" : "ਸਭ ਤੋਂ ਵੱਡਾ"} ਮੁੱਲ ${finalAnswer} ਹੈ।`];
    }
    case "NUM-CP008-PROT-010": {
      const first = numberValue(s, "first");
      const last = numberValue(s, "last");
      const modulus = numberValue(s, "modulus");
      const count = numberValue(s, "count");
      return hi
        ? [`पहला वैध मान ${first} और अंतिम वैध मान ${last} है; इनके बीच अंतर ${modulus} का है।`, `पदों की संख्या = (${last}−${first})/${modulus}+1 = ${count}।`]
        : [`ਪਹਿਲਾ ਠੀਕ ਮੁੱਲ ${first} ਅਤੇ ਆਖਰੀ ਠੀਕ ਮੁੱਲ ${last} ਹੈ; ਇਨ੍ਹਾਂ ਵਿਚਕਾਰ ਫਰਕ ${modulus} ਦਾ ਹੈ।`, `ਪਦਾਂ ਦੀ ਗਿਣਤੀ = (${last}−${first})/${modulus}+1 = ${count}।`];
    }
    case "NUM-CP008-PROT-011": {
      const items = constraints(s);
      const merged = mergeConstraints(items)!;
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const solutions = numberArray(s, "solutions");
      const mergeSteps = localizedMergeSteps(items, language);
      return [...mergeSteps, hi
        ? `अंतिम वर्ग x ≡ ${merged.residue} (mod ${merged.period}) है। [${lower}, ${upper}] में इसके सभी मान ${setText(solutions)} हैं।`
        : `ਅੰਤਿਮ ਵਰਗ x ≡ ${merged.residue} (mod ${merged.period}) ਹੈ। [${lower}, ${upper}] ਵਿੱਚ ਇਸ ਦੇ ਸਾਰੇ ਮੁੱਲ ${setText(solutions)} ਹਨ।`];
    }
    case "NUM-CP008-PROT-012": {
      const x = numberValue(s, "x");
      const b = numberValue(s, "b");
      const modulus = numberValue(s, "modulus");
      const coefficient = numberValue(s, "coefficient");
      const inv = inverse(x, modulus);
      return hi
        ? [`${x} का मॉड्यूलो ${modulus} में व्युत्क्रम ${inv} है क्योंकि ${x}×${inv} ≡ 1।`, `a ≡ ${b}×${inv} ≡ ${coefficient} (mod ${modulus}); दिए गए विकल्पों में केवल ${coefficient} यह शर्त पूरी करता है।`]
        : [`${x} ਦਾ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਉਲਟ ${inv} ਹੈ ਕਿਉਂਕਿ ${x}×${inv} ≡ 1।`, `a ≡ ${b}×${inv} ≡ ${coefficient} (mod ${modulus}); ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚ ਕੇਵਲ ${coefficient} ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-013": {
      const value = numberValue(s, "value");
      const residue = numberValue(s, "residue");
      const modulus = numberValue(s, "modulus");
      const difference = numberValue(s, "difference");
      return hi
        ? [`${value}−${residue} = ${difference}। सही मॉड्यूल को इस अंतर को पूरा भाग देना चाहिए।`, `${modulus}, ${difference} को पूरा भाग देता है और ${residue}<${modulus}; इसलिए m = ${modulus}।`]
        : [`${value}−${residue} = ${difference}। ਸਹੀ ਮਾਡਿਊਲ ਨੂੰ ਇਸ ਫਰਕ ਨੂੰ ਪੂਰਾ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।`, `${modulus}, ${difference} ਨੂੰ ਪੂਰਾ ਭਾਗ ਦਿੰਦਾ ਹੈ ਅਤੇ ${residue}<${modulus}; ਇਸ ਲਈ m = ${modulus}।`];
    }
    case "NUM-CP008-PROT-014": {
      const base = numberValue(s, "base");
      const highestExponent = numberValue(s, "highestExponent");
      const modulus = numberValue(s, "modulus");
      const residue = numberValue(s, "residue");
      return hi
        ? [`1 से शुरू करें और ${base}, ${base}^2, ..., ${base}^${highestExponent} के प्रत्येक पद को मॉड्यूलो ${modulus} में घटाकर जोड़ते जाएँ।`, `हर चरण में केवल वर्तमान अवशेष रखने पर अंतिम योग का अवशेष ${residue} मिलता है।`]
        : [`1 ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ${base}, ${base}^2, ..., ${base}^${highestExponent} ਦੇ ਹਰ ਪਦ ਨੂੰ ਮਾਡਿਊਲੋ ${modulus} ਵਿੱਚ ਘਟਾ ਕੇ ਜੋੜਦੇ ਜਾਓ।`, `ਹਰ ਪੜਾਅ ਤੇ ਕੇਵਲ ਮੌਜੂਦਾ ਅਵਸ਼ੇਸ਼ ਰੱਖਣ ਨਾਲ ਅੰਤਿਮ ਜੋੜ ਦਾ ਅਵਸ਼ੇਸ਼ ${residue} ਮਿਲਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-015": {
      const items = constraints(s);
      const merged = mergeConstraints(items)!;
      const answer = merged.residue === 0 ? merged.period : merged.residue;
      return [...localizedMergeSteps(items, language), hi
        ? `अंतिम वर्ग x ≡ ${merged.residue} (mod ${merged.period}) है; इसका सबसे छोटा धनात्मक प्रतिनिधि ${answer} है।`
        : `ਅੰਤਿਮ ਵਰਗ x ≡ ${merged.residue} (mod ${merged.period}) ਹੈ; ਇਸ ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਪ੍ਰਤੀਨਿਧੀ ${answer} ਹੈ।`];
    }
    case "NUM-CP008-PROT-016": {
      const items = constraints(s);
      const firstResidue = numberValue(s, "firstTwoResidue");
      const firstPeriod = numberValue(s, "firstTwoPeriod");
      const g = numberValue(s, "compatibilityGcd");
      const third = items[2]!;
      return hi
        ? [`पहली दो शर्तें मिलकर x ≡ ${firstResidue} (mod ${firstPeriod}) देती हैं।`, `अब HCF(${firstPeriod}, ${third.modulus}) = ${g}, लेकिन ${third.residue}−${firstResidue} = ${third.residue - firstResidue}, ${g} से विभाज्य नहीं है; इसलिए तीसरी शर्त के साथ कोई सामान्य पूर्णांक नहीं है।`]
        : [`ਪਹਿਲੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਮਿਲ ਕੇ x ≡ ${firstResidue} (mod ${firstPeriod}) ਦਿੰਦੀਆਂ ਹਨ।`, `ਹੁਣ HCF(${firstPeriod}, ${third.modulus}) = ${g}, ਪਰ ${third.residue}−${firstResidue} = ${third.residue - firstResidue}, ${g} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ; ਇਸ ਲਈ ਤੀਜੀ ਸ਼ਰਤ ਨਾਲ ਕੋਈ ਸਾਂਝਾ ਪੂਰਨ ਅੰਕ ਨਹੀਂ ਹੈ।`];
    }
    case "NUM-CP008-PROT-017": {
      const least = numberValue(s, "least");
      const m2 = numberValue(s, "m2");
      const missing = numberValue(s, "missingResidue");
      const quotient = Math.floor(least / m2);
      return hi
        ? [`अज्ञात r वाली शर्त में दिए हुए हल ${least} को सीधे मॉड्यूलो ${m2} में लें।`, `${least} = ${quotient}×${m2} + ${missing}; इसलिए r = ${missing}।`]
        : [`ਅਣਜਾਣ r ਵਾਲੀ ਸ਼ਰਤ ਵਿੱਚ ਦਿੱਤੇ ਹੱਲ ${least} ਨੂੰ ਸਿੱਧਾ ਮਾਡਿਊਲੋ ${m2} ਵਿੱਚ ਲਓ।`, `${least} = ${quotient}×${m2} + ${missing}; ਇਸ ਲਈ r = ${missing}।`];
    }
    case "NUM-CP008-PROT-018": {
      const base = numberValue(s, "baseValue");
      const exponent = numberValue(s, "exponent");
      const add = numberValue(s, "add");
      const innerModulus = numberValue(s, "innerModulus");
      const multiplier = numberValue(s, "multiplier");
      const shift = numberValue(s, "shift");
      const outerModulus = numberValue(s, "outerModulus");
      const powerResidue = numberValue(s, "powerResidue");
      const inner = numberValue(s, "inner");
      const answer = numberValue(s, "answer");
      return hi
        ? [`${base}^${exponent} ≡ ${powerResidue} (mod ${innerModulus}); इसलिए y ≡ ${powerResidue}+${add} ≡ ${inner} (mod ${innerModulus})।`, `अब ${multiplier}×${inner}+${shift} = ${multiplier * inner + shift}; इसे ${outerModulus} से घटाने पर अवशेष ${answer} मिलता है।`]
        : [`${base}^${exponent} ≡ ${powerResidue} (mod ${innerModulus}); ਇਸ ਲਈ y ≡ ${powerResidue}+${add} ≡ ${inner} (mod ${innerModulus})।`, `ਹੁਣ ${multiplier}×${inner}+${shift} = ${multiplier * inner + shift}; ਇਸ ਨੂੰ ${outerModulus} ਨਾਲ ਘਟਾਉਣ ਤੇ ਅਵਸ਼ੇਸ਼ ${answer} ਮਿਲਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-019": {
      const items = constraints(s);
      const answer = numberValue(s, "answer");
      return items.map((item) => hi
        ? `${answer} को ${item.modulus} से भाग देने पर शेष ${item.residue} आता है; इसलिए यह शर्त x ≡ ${item.residue} (mod ${item.modulus}) पूरी होती है।`
        : `${answer} ਨੂੰ ${item.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${item.residue} ਆਉਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਸ਼ਰਤ x ≡ ${item.residue} (mod ${item.modulus}) ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`);
    }
    case "NUM-CP008-PROT-020": {
      const common = numberValue(s, "commonRemainder");
      const different = numberValue(s, "differentRemainder");
      const m1 = numberValue(s, "m1");
      const m2 = numberValue(s, "m2");
      const m3 = numberValue(s, "m3");
      const basePeriod = lcm(m1, m2);
      const merged = mergeConstraints([{ residue: common, modulus: basePeriod }, { residue: different, modulus: m3 }])!;
      const answer = merged.residue === 0 ? merged.period : merged.residue;
      return hi
        ? [`पहली दो शर्तों का शेष समान है, इसलिए वे x ≡ ${common} (mod ${basePeriod}) में मिलती हैं।`, `अब इसे x ≡ ${different} (mod ${m3}) के साथ मिलाने पर x ≡ ${merged.residue} (mod ${merged.period}) मिलता है; सबसे छोटा धनात्मक हल ${answer} है।`]
        : [`ਪਹਿਲੀਆਂ ਦੋ ਸ਼ਰਤਾਂ ਦਾ ਬਾਕੀ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਉਹ x ≡ ${common} (mod ${basePeriod}) ਵਿੱਚ ਮਿਲਦੀਆਂ ਹਨ।`, `ਹੁਣ ਇਸ ਨੂੰ x ≡ ${different} (mod ${m3}) ਨਾਲ ਮਿਲਾਉਣ ਤੇ x ≡ ${merged.residue} (mod ${merged.period}) ਮਿਲਦਾ ਹੈ; ਸਭ ਤੋਂ ਛੋਟਾ ਧਨਾਤਮਕ ਹੱਲ ${answer} ਹੈ।`];
    }
    case "NUM-CP008-PROT-021": {
      const statements = s.statements as readonly Readonly<Record<string, number>>[];
      const truth = s.truth as readonly boolean[];
      if (!Array.isArray(statements) || !Array.isArray(truth)) throw new Error("Malformed statement state");
      return statements.map((row, index) => {
        const actual = mod(row.candidate, row.modulus);
        if (hi) return `कथन ${["I", "II", "III"][index]}: ${row.candidate} mod ${row.modulus} = ${actual}; इसलिए यह कथन ${truth[index] ? "सही" : "गलत"} है।`;
        return `ਕਥਨ ${["I", "II", "III"][index]}: ${row.candidate} mod ${row.modulus} = ${actual}; ਇਸ ਲਈ ਇਹ ਕਥਨ ${truth[index] ? "ਸਹੀ" : "ਗਲਤ"} ਹੈ।`;
      });
    }
    case "NUM-CP008-PROT-022": {
      const counts = s.counts as Readonly<Record<string, number>>;
      const c1 = counts.c1;
      const c2 = counts.c2;
      const both = counts.bothCount;
      return hi
        ? [`कथन I अकेला ${c1} संभव मान और कथन II अकेला ${c2} संभव मान छोड़ता है।`, `दोनों कथन साथ लेने पर ${both} संभव मान बचते हैं; इसी से पर्याप्तता का वर्ग ${finalAnswer} तय होता है।`]
        : [`ਕਥਨ I ਇਕੱਲਾ ${c1} ਸੰਭਵ ਮੁੱਲ ਅਤੇ ਕਥਨ II ਇਕੱਲਾ ${c2} ਸੰਭਵ ਮੁੱਲ ਛੱਡਦਾ ਹੈ।`, `ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ ਤੇ ${both} ਸੰਭਵ ਮੁੱਲ ਬਚਦੇ ਹਨ; ਇਸੇ ਤੋਂ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਦਾ ਵਰਗ ${finalAnswer} ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-023": {
      const digit = numberValue(s, "digit");
      const length = numberValue(s, "length");
      const modulus = numberValue(s, "modulus");
      const answer = numberValue(s, "answer");
      let residue = 0;
      const preview: number[] = [];
      for (let index = 0; index < length; index += 1) {
        residue = mod(10 * residue + digit, modulus);
        if (index < 4 || index === length - 1) preview.push(residue);
      }
      return hi
        ? [`हर नया ${digit} जोड़ते समय नया अवशेष r = (10r + ${digit}) mod ${modulus} लें। शुरुआती अवशेष क्रम ${preview.slice(0, 4).join(" → ")} है।`, `${length} अंक पूरे होने पर अंतिम अवशेष ${answer} मिलता है।`]
        : [`ਹਰ ਨਵਾਂ ${digit} ਜੋੜਦੇ ਸਮੇਂ ਨਵਾਂ ਅਵਸ਼ੇਸ਼ r = (10r + ${digit}) mod ${modulus} ਲਓ। ਸ਼ੁਰੂਆਤੀ ਅਵਸ਼ੇਸ਼ ਲੜੀ ${preview.slice(0, 4).join(" → ")} ਹੈ।`, `${length} ਅੰਕ ਪੂਰੇ ਹੋਣ ਤੇ ਅੰਤਿਮ ਅਵਸ਼ੇਸ਼ ${answer} ਮਿਲਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-024": {
      const items = constraints(s);
      const residue = numberValue(s, "residue");
      const period = numberValue(s, "period");
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const answer = numberValue(s, "answer");
      return [...localizedMergeSteps(items, language), hi
        ? `अंतिम वर्ग x ≡ ${residue} (mod ${period}) है। [${lower}, ${upper}] में यह वर्ग ${answer} बार आता है।`
        : `ਅੰਤਿਮ ਵਰਗ x ≡ ${residue} (mod ${period}) ਹੈ। [${lower}, ${upper}] ਵਿੱਚ ਇਹ ਵਰਗ ${answer} ਵਾਰ ਆਉਂਦਾ ਹੈ।`];
    }
    case "NUM-CP008-PROT-025": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const solutions = numberArray(s, "canonicalSolutions");
      const merged = mergeConstraints(items);
      if (!merged) {
        for (let i = 0; i < items.length; i += 1) {
          for (let j = i + 1; j < items.length; j += 1) {
            const g = gcd(items[i]!.modulus, items[j]!.modulus);
            if ((items[j]!.residue - items[i]!.residue) % g !== 0) {
              return hi
                ? [`HCF(${items[i]!.modulus}, ${items[j]!.modulus}) = ${g}, लेकिन अवशेषों का अंतर ${items[j]!.residue - items[i]!.residue}, ${g} से विभाज्य नहीं है; इसलिए सिस्टम असंगत है।`, `[${lower}, ${upper}] में कोई साझा हल नहीं है, इसलिए सही वर्ग ${finalAnswer} है।`]
                : [`HCF(${items[i]!.modulus}, ${items[j]!.modulus}) = ${g}, ਪਰ ਅਵਸ਼ੇਸ਼ਾਂ ਦਾ ਫਰਕ ${items[j]!.residue - items[i]!.residue}, ${g} ਨਾਲ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ; ਇਸ ਲਈ ਸਿਸਟਮ ਅਸੰਗਤ ਹੈ।`, `[${lower}, ${upper}] ਵਿੱਚ ਕੋਈ ਸਾਂਝਾ ਹੱਲ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਸਹੀ ਵਰਗ ${finalAnswer} ਹੈ।`];
            }
          }
        }
        throw new Error("Expected incompatible witness");
      }
      return [...localizedMergeSteps(items, language), hi
        ? `अंतिम वर्ग x ≡ ${merged.residue} (mod ${merged.period}) है। [${lower}, ${upper}] में इसके मान ${setText(solutions)} हैं; कुल ${solutions.length} हल हैं, इसलिए ${finalAnswer}।`
        : `ਅੰਤਿਮ ਵਰਗ x ≡ ${merged.residue} (mod ${merged.period}) ਹੈ। [${lower}, ${upper}] ਵਿੱਚ ਇਸ ਦੇ ਮੁੱਲ ${setText(solutions)} ਹਨ; ਕੁੱਲ ${solutions.length} ਹੱਲ ਹਨ, ਇਸ ਲਈ ${finalAnswer}।`];
    }
    case "NUM-CP008-PROT-026": {
      const items = constraints(s);
      const lower = numberValue(s, "lower");
      const upper = numberValue(s, "upper");
      const solutions = numberArray(s, "canonicalSolutions");
      const merged = mergeConstraints(items)!;
      return [...localizedMergeSteps(items, language), hi
        ? `सामान्य वर्ग x ≡ ${merged.residue} (mod ${merged.period}) है। [${lower}, ${upper}] में इसके सभी सदस्य ${setText(solutions)} हैं; यही पूरा उत्तर है।`
        : `ਸਾਂਝਾ ਵਰਗ x ≡ ${merged.residue} (mod ${merged.period}) ਹੈ। [${lower}, ${upper}] ਵਿੱਚ ਇਸ ਦੇ ਸਾਰੇ ਮੈਂਬਰ ${setText(solutions)} ਹਨ; ਇਹੀ ਪੂਰਾ ਉੱਤਰ ਹੈ।`];
    }
    default:
      throw new Error(`No localized steps for ${q.temporaryPrototypeId}`);
  }
}

function localizedExplanation(q: NumCp008PermanentPackage, language: NumCp008LocalizedLanguage) {
  const [coreConcept, strategy] = conceptAndStrategy(q.temporaryPrototypeId, language);
  const finalAnswer = localizeNumCp008Answer(q.canonicalAnswer, language);
  return Object.freeze({
    coreConcept,
    strategy,
    steps: Object.freeze([...localizedSteps(q, language)]),
    finalAnswer,
  });
}

export function generateNumCp008Localized(
  qlId: NumCp008PermanentQlId,
  seed: number,
  language: NumCp008LocalizedLanguage,
): NumCp008LocalizedPackage {
  const source = generateNumCp008Permanent(qlId, seed);
  const canonicalAnswer = localizeNumCp008Answer(source.canonicalAnswer, language);
  const verifierAnswer = localizeNumCp008Answer(source.verifierAnswer, language);
  const options = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    value: localizeNumCp008Answer(option.value, language),
  })));
  const explanation = localizedExplanation(source, language);

  return Object.freeze({
    ...source,
    locale: localeFor(language),
    language,
    stem: localizedStem(source, language),
    options,
    canonicalAnswer,
    verifierAnswer,
    explanation,
    localization: Object.freeze({
      version: "num-cp008-hi-pa-rule-first-v1" as const,
      canonicalLocale: "en-IN" as const,
      canonicalQuestionId: qlId,
      mathematicalStatePreserved: true as const,
      optionOrderPreserved: true as const,
      correctIndexPreserved: true as const,
      misconceptionMappingPreserved: true as const,
      englishAuthorityFrozen: true as const,
      lifecycleLocked: true as const,
    }),
    lifecycle: Object.freeze({
      permanentQlId: qlId,
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
      englishAuthorityStatus: "ENGLISH_FROZEN" as const,
      localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }) as NumCp008LocalizedPackage;
}
