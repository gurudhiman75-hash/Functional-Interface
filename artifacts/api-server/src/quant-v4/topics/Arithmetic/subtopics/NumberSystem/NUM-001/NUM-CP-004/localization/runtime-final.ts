import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004LocalizedForQl } from "./runtime";
import type { NumCp004LocalizedQuestion, NumCp004TranslatedLanguage } from "./types";

const HINDI_RESIDUALS: Readonly<Record<string, string>> = Object.freeze({
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
  "Every pair of odd integers is co-prime.": "विषम पूर्णांकों का हर युग्म सह-अभाज्य होता है।",
  "An even prime can be greater than 2.": "कोई सम अभाज्य 2 से बड़ा हो सकता है।",
  "A composite positive integer can have no prime factor.": "किसी संयोज्य धनात्मक पूर्णांक का कोई अभाज्य गुणनखंड नहीं हो सकता।",
  "The product of two primes can itself be prime.": "दो अभाज्य संख्याओं का गुणनफल स्वयं अभाज्य हो सकता है।",
});

const PUNJABI_RESIDUALS: Readonly<Record<string, string>> = Object.freeze({
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
  "Every pair of odd integers is co-prime.": "ਵਿਸਮ ਪੂਰਨ ਅੰਕਾਂ ਦਾ ਹਰ ਜੋੜਾ ਸਹਿ-ਅਭਾਜ ਹੁੰਦਾ ਹੈ।",
  "An even prime can be greater than 2.": "ਕੋਈ ਸਮ ਅਭਾਜ 2 ਤੋਂ ਵੱਡਾ ਹੋ ਸਕਦਾ ਹੈ।",
  "A composite positive integer can have no prime factor.": "ਕਿਸੇ ਸੰਯੁਕਤ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਦਾ ਕੋਈ ਅਭਾਜ ਗੁਣਨਖੰਡ ਨਹੀਂ ਹੋ ਸਕਦਾ।",
  "The product of two primes can itself be prime.": "ਦੋ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਨਫਲ ਆਪ ਅਭਾਜ ਹੋ ਸਕਦਾ ਹੈ।",
});

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function integers(value: unknown): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) return [];
  return [...value] as number[];
}

function translateResidualAnswer(value: string, language: NumCp004TranslatedLanguage): string {
  let result = value;
  const fixed = language === "hi" ? HINDI_RESIDUALS : PUNJABI_RESIDUALS;
  for (const [english, localized] of Object.entries(fixed)) result = result.replaceAll(english, localized);

  result = result.replace(/(\d+) is prime\./gu, (_match, number: string) =>
    language === "hi" ? `${number} अभाज्य है।` : `${number} ਅਭਾਜ ਹੈ।`);
  result = result.replace(/(\d+) and (\d+) are co-prime\./gu, (_match, a: string, b: string) =>
    language === "hi" ? `${a} और ${b} सह-अभाज्य हैं।` : `${a} ਅਤੇ ${b} ਸਹਿ-ਅਭਾਜ ਹਨ।`);
  result = result.replace(/\(([^)]+)\) is pairwise co-prime\./gu, (_match, values: string) =>
    language === "hi" ? `(${values}) युग्मवार सह-अभाज्य है।` : `(${values}) ਜੋੜੇ-ਜੋੜੇ ਸਹਿ-ਅਭਾਜ ਹੈ।`);
  result = result.replace(/A positive integer can have exactly one distinct prime factor, for example ([^.]+)\./gu, (_match, example: string) =>
    language === "hi"
      ? `किसी धनात्मक पूर्णांक का केवल एक भिन्न अभाज्य गुणनखंड हो सकता है, जैसे ${example}।`
      : `ਕਿਸੇ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ ਦਾ ਕੇਵਲ ਇੱਕ ਵੱਖਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਹੋ ਸਕਦਾ ਹੈ, ਜਿਵੇਂ ${example}।`);

  return result.replace(/\\\(([^\\]*[\u0900-\u097F\u0A00-\u0A7F][^\\]*)\\\)/gu, "$1");
}

function polish(value: string, language: NumCp004TranslatedLanguage): string {
  const localized = translateResidualAnswer(value, language);
  if (language === "hi") {
    return localized
      .replaceAll("डेटा-पर्याप्तता", "पर्याप्त जानकारी")
      .replaceAll("माता नोड", "ऊपरी नोड");
  }
  return localized
    .replaceAll("ਡਾਟਾ-ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ")
    .replaceAll("ਮਾਪੇ ਨੋਡ", "ਉੱਪਰਲਾ ਨੋਡ")
    .replaceAll("ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ");
}

function exactEvidence(q: NumCp004LocalizedQuestion, language: NumCp004TranslatedLanguage): string | null {
  const state = q.hiddenState as Readonly<Record<string, unknown>>;
  const mode = typeof state.mode === "string" ? state.mode : "";
  const hi = language === "hi";

  if (mode === "COPRIME_CLASS") {
    const [a, b, c] = integers(state.values);
    if (a === undefined || b === undefined || c === undefined) return null;
    const all = gcd(gcd(a, b), c);
    return hi
      ? `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a, b)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a, c)}`)} और ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b, c)}`)}; तीनों का HCF ${math(all)} है।`
      : `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a, b)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a, c)}`)} ਅਤੇ ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b, c)}`)}; ਤਿੰਨਾਂ ਦਾ HCF ${math(all)} ਹੈ।`;
  }

  if (mode === "COPRIME_CLAIM" && Array.isArray(state.claims)) {
    const evidence: string[] = [];
    for (const row of state.claims) {
      if (!row || typeof row !== "object") continue;
      const claim = row as Readonly<Record<string, unknown>>;
      const kind = typeof claim.kind === "string" ? claim.kind : "";
      const values = integers(claim.values);
      if (kind === "PAIR" && values.length === 2) {
        evidence.push(math(`\\operatorname{HCF}(${values[0]},${values[1]})=${gcd(values[0]!, values[1]!)}`));
      } else if (kind === "PAIRWISE_TRIPLE" && values.length === 3) {
        const [a, b, c] = values;
        evidence.push(`${math(`\\operatorname{HCF}(${a},${b})=${gcd(a!, b!)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a!, c!)}`)}, ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b!, c!)}`)}`);
      } else if (kind === "UNIVERSAL_ODD") {
        evidence.push(hi
          ? `${math(9)} और ${math(15)} दोनों विषम हैं, पर ${math("\\operatorname{HCF}(9,15)=3")}`
          : `${math(9)} ਅਤੇ ${math(15)} ਦੋਵੇਂ ਵਿਸਮ ਹਨ, ਪਰ ${math("\\operatorname{HCF}(9,15)=3")}`);
      }
    }
    if (evidence.length > 0) return hi ? `दावों की HCF जाँच: ${evidence.join("; ")}।` : `ਕਥਨਾਂ ਦੀ HCF ਜਾਂਚ: ${evidence.join("; ")}।`;
  }

  if (mode === "DATA_SUFFICIENCY") {
    const statementI = integers(state.statementI);
    const statementII = integers(state.statementII);
    const intersection = statementI.filter((value) => statementII.includes(value));
    return hi
      ? `कथन I ${statementI.length} संभव मान छोड़ता है; कथन II ${statementII.length} संभव मान छोड़ता है; दोनों का साझा समुच्चय ${intersection.length} मान छोड़ता है।`
      : `ਕਥਨ I ${statementI.length} ਸੰਭਵ ਮੁੱਲ ਛੱਡਦਾ ਹੈ; ਕਥਨ II ${statementII.length} ਸੰਭਵ ਮੁੱਲ ਛੱਡਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲ ਕੇ ${intersection.length} ਮੁੱਲ ਛੱਡਦੇ ਹਨ।`;
  }

  return null;
}

export function runNumCp004LocalizedFinalForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const q = runNumCp004LocalizedForQl(questionLanguageId, seed, language);
  const solution = q.explanation.solution.map((line) => polish(line, language));
  const evidence = exactEvidence(q, language);
  if (evidence) solution[1] = evidence;

  return Object.freeze({
    ...q,
    stem: polish(q.stem, language),
    explanation: Object.freeze({
      concept: polish(q.explanation.concept, language),
      solution: Object.freeze(solution),
      finalAnswer: polish(q.explanation.finalAnswer, language),
    }),
  });
}
