import {
  ALG_MULTILINGUAL_V2_FREEZE_ID,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualV2Frozen,
  type AlgReviewLocale,
} from "./permanent";
import {
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraQuestionStudioPattern,
  type AlgebraQuestionStudioQuestion,
  type AlgebraStudioDifficulty,
  type AlgebraStudioExamProfile,
  type AlgebraStudioLanguage,
} from "./algebra-question-studio-runtime-v1";
import { ALGEBRA_QUESTION_STUDIO_PACKAGE_V2 } from "./algebra-question-studio-runtime-v2";

export const ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY =
  "ALGEBRA-FROZEN-QUESTION-STUDIO-DELIVERY-V4-SEED-DIVERSE" as const;

export type AlgebraQuestionStudioQuestionV4 = AlgebraQuestionStudioQuestion & {
  readonly deliveryAuthority: typeof ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY;
  readonly sourceStateSeed: number;
};

export const ALGEBRA_QUESTION_STUDIO_PACKAGE_V4 = Object.freeze({
  ...ALGEBRA_QUESTION_STUDIO_PACKAGE_V2,
  label: "Algebra · Frozen Full Chapter · Delivery V4 Seed-Diverse",
  deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED_FULL_ANSWER_MATRIX_SEED_DIVERSE" as const,
  sourceStateSeedPolicy: "FULL_REQUEST_NAMESPACE_HASH_V1" as const,
});

const LABELS = ["A", "B", "C", "D"] as const;

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d) >>> 0;
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b) >>> 0;
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function sourceStateSeed(pattern: AlgebraQuestionStudioPattern, requestSeed: string): number {
  return hashText(`${requestSeed}|${pattern.qlId}|${pattern.prototypeId}|v${pattern.variantIndex}|source-state-v4`);
}

function localeFor(language: AlgebraStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function phrase(language: AlgebraStudioLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function frozenSource(pattern: AlgebraQuestionStudioPattern, seed: number, language: AlgebraStudioLanguage): any {
  if (language === "en") return generateAlgPermanentEnglishV3Frozen(pattern.qlId, seed, pattern.variantIndex);
  return generateAlgPermanentMultilingualV2Frozen(
    pattern.qlId,
    seed,
    localeFor(language) as AlgReviewLocale,
    pattern.variantIndex,
  );
}

function jsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, jsonSafe(child)]),
    );
  }
  return value;
}

function rationalParts(value: any): [bigint, bigint] | null {
  if (!value || value.numerator === undefined || value.denominator === undefined) return null;
  try {
    return [BigInt(value.numerator), BigInt(value.denominator)];
  } catch {
    return null;
  }
}

function rationalText(value: any): string {
  const parts = rationalParts(value);
  if (!parts) return String(value ?? "");
  const [n, d] = parts;
  return d === 1n ? String(n) : `${n}/${d}`;
}

function rationalShift(value: any, delta: bigint): string {
  const parts = rationalParts(value);
  if (!parts) return String(delta);
  const [n, d] = parts;
  const shifted = n + delta * d;
  return d === 1n ? String(shifted) : `${shifted}/${d}`;
}

function rationalNegate(value: any): string {
  const parts = rationalParts(value);
  if (!parts) return String(value ?? "");
  const [n, d] = parts;
  return d === 1n ? String(-n) : `${-n}/${d}`;
}

function signedTerm(value: any, variable: string): string {
  const parts = rationalParts(value);
  if (!parts) return ` + ${rationalText(value)}${variable}`;
  const [n, d] = parts;
  if (n === 0n) return "";
  const abs = n < 0n ? -n : n;
  const coefficient = d === 1n && abs === 1n ? "" : d === 1n ? String(abs) : `${abs}/${d}`;
  return `${n < 0n ? " - " : " + "}${coefficient}${variable}`;
}

function quadraticText(a: any, b: any, c: any): string {
  const ap = rationalParts(a);
  const lead = ap && ap[0] === 1n && ap[1] === 1n
    ? "x²"
    : ap && ap[0] === -1n && ap[1] === 1n
      ? "-x²"
      : `${rationalText(a)}x²`;
  return `${lead}${signedTerm(b, "x")}${signedTerm(c, "")} = 0`;
}

function surdTermText(term: any): string {
  const pParts = rationalParts(term?.p) ?? [0n, 1n];
  const qParts = rationalParts(term?.q) ?? [0n, 1n];
  const [pn] = pParts;
  const [qn, qd] = qParts;
  const d = String(term?.d ?? "");
  const p = rationalText(term?.p);
  const qAbs = qn < 0n ? -qn : qn;
  const magnitude = qd === 1n && qAbs === 1n ? "" : qd === 1n ? String(qAbs) : `${qAbs}/${qd}`;
  const radical = `${magnitude}√${d}`;
  if (qn === 0n) return p;
  if (pn === 0n) return qn < 0n ? `-${radical}` : radical;
  return `${p} ${qn < 0n ? "-" : "+"} ${radical}`;
}

function surdSetText(answer: any): string {
  return (Array.isArray(answer?.values) ? answer.values : []).map(surdTermText).join(", ");
}

function quantityText(value: string, language: AlgebraStudioLanguage): string {
  const map: Record<string, readonly [string, string, string]> = {
    QUANTITY_I_GREATER: ["Quantity I > Quantity II", "राशि I > राशि II", "ਰਾਸ਼ੀ I > ਰਾਸ਼ੀ II"],
    QUANTITY_I_LESS: ["Quantity I < Quantity II", "राशि I < राशि II", "ਰਾਸ਼ੀ I < ਰਾਸ਼ੀ II"],
    QUANTITIES_EQUAL: ["Quantity I = Quantity II", "राशि I = राशि II", "ਰਾਸ਼ੀ I = ਰਾਸ਼ੀ II"],
    RELATION_CANNOT_BE_DETERMINED: ["The relationship cannot be determined", "संबंध निर्धारित नहीं किया जा सकता", "ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
  };
  const tuple = map[value] ?? map.RELATION_CANNOT_BE_DETERMINED!;
  return tuple[language === "en" ? 0 : language === "hi" ? 1 : 2];
}

function dataSufficiencyText(value: string, language: AlgebraStudioLanguage): string {
  const map: Record<string, readonly [string, string, string]> = {
    STATEMENT_I_ALONE: ["Statement I alone is sufficient", "केवल कथन I पर्याप्त है", "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ"],
    STATEMENT_II_ALONE: ["Statement II alone is sufficient", "केवल कथन II पर्याप्त है", "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ"],
    EITHER_ALONE: ["Either statement alone is sufficient", "कोई भी एक कथन अकेले पर्याप्त है", "ਕੋਈ ਵੀ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ"],
    BOTH_TOGETHER: ["Both statements together are sufficient, but neither alone is sufficient", "दोनों कथन मिलकर पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है", "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ"],
    NOT_SUFFICIENT: ["Even both statements together are not sufficient", "दोनों कथन मिलकर भी पर्याप्त नहीं हैं", "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ"],
  };
  const tuple = map[value] ?? map.NOT_SUFFICIENT!;
  return tuple[language === "en" ? 0 : language === "hi" ? 1 : 2];
}

function comparisonText(value: string, language: AlgebraStudioLanguage): string {
  const map: Record<string, string> = {
    X_GREATER_THAN_Y: "x > y",
    X_LESS_THAN_Y: "x < y",
    X_GREATER_THAN_OR_EQUAL_TO_Y: "x ≥ y",
    X_LESS_THAN_OR_EQUAL_TO_Y: "x ≤ y",
    X_EQUAL_TO_Y: "x = y",
    RELATION_CANNOT_BE_ESTABLISHED: phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
    CANNOT_BE_DETERMINED: phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  };
  return map[value] ?? value;
}

function finiteAbsoluteText(values: any[], language: AlgebraStudioLanguage): string {
  const rendered = values.map(rationalText);
  if (rendered.length <= 1) return `x = ${rendered[0] ?? ""}`;
  return `x = ${rendered.join(phrase(language, " or ", " या ", " ਜਾਂ "))}`;
}

function renderAnswer(answer: any, language: AlgebraStudioLanguage): string {
  if (typeof answer === "string") return comparisonText(answer, language);
  if (!answer || typeof answer !== "object") return String(answer ?? "");
  const kind = String(answer.kind ?? "");
  switch (kind) {
    case "RATIONAL":
    case "UNIQUE_VALUE":
    case "PARAMETER_VALUE":
    case "EXCLUDED_VALUE":
      return rationalText(answer.value);
    case "POLYNOMIAL":
    case "FACTORIZATION":
    case "INTEGER_COUNT":
    case "PARAMETER_RANGE":
      return String(answer.text ?? answer.value ?? "");
    case "BOOLEAN":
      return answer.value
        ? phrase(language, "Yes", "हाँ", "ਹਾਂ")
        : phrase(language, "No", "नहीं", "ਨਹੀਂ");
    case "COEFFICIENT_PAIR":
      return `k = ${rationalText(answer.k)}, m = ${rationalText(answer.m)}`;
    case "PARAMETER_REMAINDER":
      return `k = ${rationalText(answer.parameter)}, r = ${rationalText(answer.remainder)}`;
    case "ORDERED_PAIR":
      return `(${rationalText(answer.x)}, ${rationalText(answer.y)})`;
    case "ORDERED_TRIPLE":
      return `(${rationalText(answer.x)}, ${rationalText(answer.y)}, ${rationalText(answer.z)})`;
    case "NO_SOLUTION":
      return phrase(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ");
    case "INFINITE_SOLUTIONS":
      return phrase(language, "Infinitely many solutions", "अनंत हल", "ਅਨੰਤ ਹੱਲ");
    case "NO_REAL_ROOTS":
      return phrase(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ");
    case "INFINITE_ON_DOMAIN":
      return `${phrase(language, "All allowed real values except", "सभी मान्य वास्तविक मान, सिवाय", "ਸਾਰੇ ਮੰਨਯੋਗ ਵਾਸਤਵਿਕ ਮਾਨ, ਸਿਵਾਏ")} ${(answer.excludedValues ?? []).map(rationalText).join(", ")}`;
    case "ROOT_SET":
    case "RATIONAL_ROOT_SET":
      return (answer.values ?? []).map(rationalText).join(", ");
    case "SURD_ROOT_SET":
      return surdSetText(answer);
    case "QUADRATIC_EQUATION":
      return quadraticText(answer.value?.a, answer.value?.b, answer.value?.c);
    case "INTERVAL_SET":
      return String(answer.text ?? "").toLowerCase() === "all real numbers"
        ? phrase(language, "All real numbers", "सभी वास्तविक संख्याएँ", "ਸਾਰੀਆਂ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ")
        : String(answer.text ?? "");
    case "EXTREMUM": {
      const isMinimum = answer.value?.kind === "MINIMUM";
      return `${phrase(language, isMinimum ? "Minimum" : "Maximum", isMinimum ? "न्यूनतम" : "अधिकतम", isMinimum ? "ਘੱਟੋ-ਘੱਟ" : "ਵੱਧੋ-ਵੱਧ")} ${rationalText(answer.value?.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = ${rationalText(answer.value?.x)}`;
    }
    case "ABSOLUTE_SOLUTION":
      return answer.value?.kind === "NO_SOLUTION"
        ? phrase(language, "No real solution", "कोई वास्तविक हल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਹੱਲ ਨਹੀਂ")
        : finiteAbsoluteText(answer.value?.values ?? [], language);
    case "QUANTITY_RELATION":
      return quantityText(String(answer.value), language);
    case "DATA_SUFFICIENCY":
      return dataSufficiencyText(String(answer.value), language);
    case "SYMMETRIC_EXTREMUM":
      return `${phrase(language, "Minimum", "न्यूनतम", "ਘੱਟੋ-ਘੱਟ")} ${rationalText(answer.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = y = z = ${rationalText(answer.balancedVariable)}`;
    default:
      return String(answer.text ?? answer.value ?? kind);
  }
}

function numericCandidates(value: any): string[] {
  const parts = rationalParts(value);
  if (!parts) return [];
  const [n, d] = parts;
  const reciprocal = n === 0n ? "1" : `${d}/${n}`;
  return [
    rationalNegate(value),
    rationalShift(value, 1n),
    rationalShift(value, -1n),
    reciprocal,
    d === 1n ? String(n + 2n) : `${n + 2n * d}/${d}`,
  ];
}

function solutionStateOptions(language: AlgebraStudioLanguage): string[] {
  return [
    phrase(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"),
    phrase(language, "Exactly one solution", "ठीक एक हल", "ਠੀਕ ਇੱਕ ਹੱਲ"),
    phrase(language, "Two solutions", "दो हल", "ਦੋ ਹੱਲ"),
    phrase(language, "Infinitely many solutions", "अनंत हल", "ਅਨੰਤ ਹੱਲ"),
    phrase(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ"),
  ];
}

function textMathMutations(correct: string): string[] {
  const out = new Set<string>();
  const signFlip = correct.includes(" + ") ? correct.replace(" + ", " - ") : correct.includes(" - ") ? correct.replace(" - ", " + ") : correct;
  out.add(signFlip);
  out.add(correct.replace(/(-?\d+)(?!.*\d)/, (match) => String(Number(match) + 1)));
  out.add(correct.replace(/(-?\d+)(?!.*\d)/, (match) => String(Number(match) - 1)));
  out.add(correct.replace("≥", "≤").replace(">", "<"));
  out.add(correct.replace("≤", "≥").replace("<", ">"));
  out.add(correct.replace("[", "(").replace("]", ")"));
  out.add(correct.replace("(", "[").replace(")", "]"));
  out.delete(correct);
  out.delete("");
  return [...out];
}

function rootSetCandidates(answer: any, language: AlgebraStudioLanguage): string[] {
  const values = Array.isArray(answer.values) ? answer.values : [];
  const rendered = values.map(rationalText);
  const negated = values.map(rationalNegate).join(", ");
  return [
    rendered.length > 1 ? rendered.slice(0, -1).join(", ") : rationalNegate(values[0]),
    negated,
    rendered.length ? `${rendered.join(", ")}, 0` : "0",
    phrase(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"),
  ];
}

function surdCandidates(answer: any, language: AlgebraStudioLanguage): string[] {
  const values = Array.isArray(answer.values) ? answer.values : [];
  const radicand = values.map((term: any) => ({ ...term, d: String(BigInt(term?.d ?? 0) + 1n) }));
  const offset = values.map((term: any, index: number) => index === 0
    ? { ...term, p: { numerator: String((rationalParts(term?.p)?.[0] ?? 0n) + (rationalParts(term?.p)?.[1] ?? 1n)), denominator: String(rationalParts(term?.p)?.[1] ?? 1n) } }
    : term);
  const sameSign = values.map((term: any) => {
    const parts = rationalParts(term?.q);
    if (!parts) return term;
    const [n, d] = parts;
    return { ...term, q: { numerator: String(n < 0n ? -n : n), denominator: String(d) } };
  });
  return [
    radicand.map(surdTermText).join(", "),
    offset.map(surdTermText).join(", "),
    sameSign.map(surdTermText).join(", "),
    phrase(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ"),
  ];
}

function relationOptions(language: AlgebraStudioLanguage): string[] {
  return [
    "x > y", "x < y", "x = y",
    phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
    "x ≥ y", "x ≤ y",
  ];
}

function quantityOptions(language: AlgebraStudioLanguage): string[] {
  return ["QUANTITY_I_GREATER", "QUANTITY_I_LESS", "QUANTITIES_EQUAL", "RELATION_CANNOT_BE_DETERMINED"]
    .map((value) => quantityText(value, language));
}

function dsOptions(language: AlgebraStudioLanguage): string[] {
  return ["STATEMENT_I_ALONE", "STATEMENT_II_ALONE", "EITHER_ALONE", "BOTH_TOGETHER", "NOT_SUFFICIENT"]
    .map((value) => dataSufficiencyText(value, language));
}

function absoluteCandidates(answer: any, language: AlgebraStudioLanguage): string[] {
  if (answer.value?.kind === "NO_SOLUTION") return [
    phrase(language, "Exactly one real solution", "ठीक एक वास्तविक हल", "ਠੀਕ ਇੱਕ ਵਾਸਤਵਿਕ ਹੱਲ"),
    phrase(language, "Two real solutions", "दो वास्तविक हल", "ਦੋ ਵਾਸਤਵਿਕ ਹੱਲ"),
    phrase(language, "All real numbers", "सभी वास्तविक संख्याएँ", "ਸਾਰੀਆਂ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ"),
    phrase(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"),
  ];
  const values = Array.isArray(answer.value?.values) ? answer.value.values : [];
  const correct = finiteAbsoluteText(values, language);
  const shifted = values.map((value: any) => rationalShift(value, 1n));
  const negated = values.map(rationalNegate);
  return [
    values.length > 1 ? `x = ${rationalText(values[0])}` : `x = ${rationalShift(values[0], 1n)}`,
    `x = ${shifted.join(phrase(language, " or ", " या ", " ਜਾਂ "))}`,
    `x = ${negated.join(phrase(language, " or ", " या ", " ਜਾਂ "))}`,
    phrase(language, "No real solution", "कोई वास्तविक हल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਹੱਲ ਨਹੀਂ"),
    ...textMathMutations(correct),
  ];
}

function quadraticCandidates(answer: any): string[] {
  const value = answer.value ?? {};
  const b = rationalParts(value.b);
  const c = rationalParts(value.c);
  const bNeg = b ? { numerator: String(-b[0]), denominator: String(b[1]) } : value.b;
  const cNeg = c ? { numerator: String(-c[0]), denominator: String(c[1]) } : value.c;
  const cPlus = c ? { numerator: String(c[0] + c[1]), denominator: String(c[1]) } : value.c;
  return [
    quadraticText(value.a, bNeg, value.c),
    quadraticText(value.a, value.b, cNeg),
    quadraticText(value.a, value.b, cPlus),
  ];
}

function pairCandidates(answer: any, kind: string): string[] {
  if (kind === "ORDERED_PAIR") {
    const x = rationalText(answer.x); const y = rationalText(answer.y);
    return [`(${y}, ${x})`, `(${rationalNegate(answer.x)}, ${y})`, `(${x}, ${rationalNegate(answer.y)})`, `(${rationalShift(answer.x, 1n)}, ${y})`];
  }
  if (kind === "ORDERED_TRIPLE") {
    const x = rationalText(answer.x); const y = rationalText(answer.y); const z = rationalText(answer.z);
    return [`(${y}, ${x}, ${z})`, `(${x}, ${z}, ${y})`, `(${rationalNegate(answer.x)}, ${y}, ${z})`, `(${x}, ${y}, ${rationalShift(answer.z, 1n)})`];
  }
  if (kind === "COEFFICIENT_PAIR") {
    const k = rationalText(answer.k); const m = rationalText(answer.m);
    return [`k = ${m}, m = ${k}`, `k = ${rationalNegate(answer.k)}, m = ${m}`, `k = ${k}, m = ${rationalNegate(answer.m)}`, `k = ${rationalShift(answer.k, 1n)}, m = ${m}`];
  }
  const k = rationalText(answer.parameter); const r = rationalText(answer.remainder);
  return [`k = ${r}, r = ${k}`, `k = ${rationalNegate(answer.parameter)}, r = ${r}`, `k = ${k}, r = ${rationalNegate(answer.remainder)}`, `k = ${rationalShift(answer.parameter, 1n)}, r = ${r}`];
}

function extremaCandidates(answer: any, correct: string, language: AlgebraStudioLanguage): string[] {
  if (answer.kind === "EXTREMUM") {
    const isMinimum = answer.value?.kind === "MINIMUM";
    const opposite = phrase(language, isMinimum ? "Maximum" : "Minimum", isMinimum ? "अधिकतम" : "न्यूनतम", isMinimum ? "ਵੱਧੋ-ਵੱਧ" : "ਘੱਟੋ-ਘੱਟ");
    const current = phrase(language, isMinimum ? "Minimum" : "Maximum", isMinimum ? "न्यूनतम" : "अधिकतम", isMinimum ? "ਘੱਟੋ-ਘੱਟ" : "ਵੱਧੋ-ਵੱਧ");
    return [
      `${opposite} ${rationalText(answer.value?.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = ${rationalText(answer.value?.x)}`,
      `${current} ${rationalNegate(answer.value?.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = ${rationalText(answer.value?.x)}`,
      `${current} ${rationalText(answer.value?.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = ${rationalShift(answer.value?.x, 1n)}`,
      ...textMathMutations(correct),
    ];
  }
  return [
    `${phrase(language, "Maximum", "अधिकतम", "ਵੱਧੋ-ਵੱਧ")} ${rationalText(answer.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = y = z = ${rationalText(answer.balancedVariable)}`,
    `${phrase(language, "Minimum", "न्यूनतम", "ਘੱਟੋ-ਘੱਟ")} ${rationalNegate(answer.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = y = z = ${rationalText(answer.balancedVariable)}`,
    `${phrase(language, "Minimum", "न्यूनतम", "ਘੱਟੋ-ਘੱਟ")} ${rationalText(answer.value)}, ${phrase(language, "at", "जब", "ਜਦੋਂ")} x = y = z = ${rationalShift(answer.balancedVariable, 1n)}`,
    ...textMathMutations(correct),
  ];
}

function distractorCandidates(answer: any, correct: string, language: AlgebraStudioLanguage): string[] {
  if (typeof answer === "string") return relationOptions(language);
  const kind = String(answer?.kind ?? "");
  if (["RATIONAL", "UNIQUE_VALUE", "PARAMETER_VALUE", "EXCLUDED_VALUE"].includes(kind)) return numericCandidates(answer.value);
  if (["POLYNOMIAL", "FACTORIZATION", "INTERVAL_SET", "INTEGER_COUNT", "PARAMETER_RANGE"].includes(kind)) {
    const extra = kind === "INTERVAL_SET" ? [
      phrase(language, "All real numbers", "सभी वास्तविक संख्याएँ", "ਸਾਰੀਆਂ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ"),
      phrase(language, "Empty set", "रिक्त समुच्चय", "ਖਾਲੀ ਸਮੂਹ"),
    ] : [];
    return [...textMathMutations(correct), ...extra];
  }
  if (kind === "BOOLEAN") return [
    phrase(language, "Yes", "हाँ", "ਹਾਂ"),
    phrase(language, "No", "नहीं", "ਨਹੀਂ"),
    phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
    phrase(language, "Insufficient information", "जानकारी अपर्याप्त है", "ਜਾਣਕਾਰੀ ਅਧੂਰੀ ਹੈ"),
  ];
  if (["COEFFICIENT_PAIR", "PARAMETER_REMAINDER", "ORDERED_PAIR", "ORDERED_TRIPLE"].includes(kind)) return pairCandidates(answer, kind);
  if (["NO_SOLUTION", "INFINITE_SOLUTIONS", "NO_REAL_ROOTS", "INFINITE_ON_DOMAIN"].includes(kind)) return solutionStateOptions(language);
  if (["ROOT_SET", "RATIONAL_ROOT_SET"].includes(kind)) return rootSetCandidates(answer, language);
  if (kind === "SURD_ROOT_SET") return surdCandidates(answer, language);
  if (kind === "QUADRATIC_EQUATION") return quadraticCandidates(answer);
  if (kind === "EXTREMUM" || kind === "SYMMETRIC_EXTREMUM") return extremaCandidates(answer, correct, language);
  if (kind === "ABSOLUTE_SOLUTION") return absoluteCandidates(answer, language);
  if (kind === "QUANTITY_RELATION") return quantityOptions(language);
  if (kind === "DATA_SUFFICIENCY") return dsOptions(language);
  return textMathMutations(correct);
}

function buildOptions(answer: any, language: AlgebraStudioLanguage, seed: string) {
  const correct = renderAnswer(answer, language).trim();
  const pool = [
    ...distractorCandidates(answer, correct, language),
    ...textMathMutations(correct),
    phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
    phrase(language, "None of these", "इनमें से कोई नहीं", "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ"),
  ];
  const wrongs = [...new Set(pool.map((value) => String(value).trim()).filter((value) => value && value !== correct))].slice(0, 3);
  if (!correct || wrongs.length !== 3) {
    throw new Error(`Algebra Question Studio V4 option coverage failed for ${answer?.kind ?? typeof answer}: '${correct}'`);
  }
  const correctIndex = hashText(`${seed}:answer-position`) % 4;
  const options = [...wrongs];
  options.splice(correctIndex, 0, correct);
  let misconceptionIndex = 0;
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null : `ALG-DIST-V4-M${++misconceptionIndex}`,
  }));
  return { correct, correctIndex, options, optionDetails };
}

function difficultyFor(pattern: AlgebraQuestionStudioPattern): AlgebraStudioDifficulty {
  if (/ALG-CP-(001|004|006)/.test(pattern.cpId)) return "Easy";
  if (/ALG-CP-(011|014)/.test(pattern.cpId)) return "Hard";
  if (["ALG-QL-009", "ALG-QL-031", "ALG-QL-036", "ALG-QL-041", "ALG-QL-042", "ALG-QL-043"].includes(pattern.qlId)) return "Hard";
  if (["ALG-QL-001", "ALG-QL-002", "ALG-QL-003", "ALG-QL-004", "ALG-QL-016", "ALG-QL-020", "ALG-QL-021"].includes(pattern.qlId)) return "Easy";
  return "Medium";
}

function profileWeight(pattern: AlgebraQuestionStudioPattern, profile: AlgebraStudioExamProfile): number {
  const cp = Number(pattern.cpId.slice(-3));
  if (profile === "BANKING") {
    if ([7, 10, 11, 14].includes(cp)) return 4;
    if ([6, 8, 9, 12, 13].includes(cp)) return 2.5;
    return 1;
  }
  if (profile === "PUNJAB_STATE") {
    if ([1, 2, 4, 6, 7, 9, 12, 13].includes(cp)) return 3.5;
    return 2;
  }
  if (profile === "SSC_ADVANCED") {
    if ([2, 3, 5, 7, 8, 9, 10, 12, 13].includes(cp)) return 3;
    return 2;
  }
  if ([1, 2, 4, 5, 6, 7, 8, 9, 10, 12].includes(cp)) return 3.5;
  return 1.25;
}

export function generateAlgebraStudioQuestionV4(input: {
  pattern: AlgebraQuestionStudioPattern;
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  seed: string;
}): AlgebraQuestionStudioQuestionV4 {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  const locale = localeFor(language);
  const sourceSeed = sourceStateSeed(input.pattern, input.seed);
  const source = frozenSource(input.pattern, sourceSeed, language);
  const delivery = buildOptions(source.canonicalAnswer, language, `${input.seed}:${input.pattern.prototypeId}:${language}`);
  const steps = String(source.explanation ?? "").split(/\n+/).map((step) => step.trim()).filter(Boolean);
  const canonicalItemId = `${input.pattern.qlId}:${input.pattern.prototypeId}:${sourceSeed}`;
  const questionLanguageId = `${canonicalItemId}:${locale}`;
  const questionId = `ALG-QS4-${hashText(questionLanguageId).toString(16).padStart(8, "0")}`;
  const sourceLifecycleLocked =
    source.active === false
    && source.questionStudioDiscoverable === false
    && source.questionBankStatus === "NOT_STORED"
    && source.questionBankWritable === false
    && source.testEligibility === "INELIGIBLE"
    && source.testEligible === false
    && source.publiclyPublishable === false;
  const distinct = new Set(delivery.options).size === 4;
  const oneCorrect = delivery.optionDetails.filter((option) => option.isCorrect).length === 1;
  const parity = delivery.options[delivery.correctIndex] === delivery.correct;

  return Object.freeze({
    packageId: input.pattern.packageId,
    cpId: input.pattern.cpId,
    patternId: input.pattern.prototypeId,
    qlId: input.pattern.qlId,
    prototypeId: input.pattern.prototypeId,
    variantIndex: input.pattern.variantIndex,
    questionId,
    canonicalItemId,
    questionLanguageId,
    language,
    locale,
    examProfile,
    difficultyBand: difficultyFor(input.pattern),
    stem: String(source.question),
    options: delivery.options,
    optionDetails: delivery.optionDetails,
    correctIndex: delivery.correctIndex,
    answer: delivery.correct,
    canonicalAnswer: jsonSafe(source.canonicalAnswer),
    explanation: { steps, shortcut: "", traps: [] },
    solveMode: String(source.prototypeSolveMode),
    renderer: "TEXT_MATH",
    sourceAuthority: language === "en" ? "ALG-EN-v3-frozen" : ALG_MULTILINGUAL_V2_FREEZE_ID,
    sourceMaturity: String(source.maturity),
    sourceReviewStatus: String(source.reviewStatus),
    integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
    sourceStateSeed: sourceSeed,
    validation: {
      valid: distinct && oneCorrect && parity && steps.length > 0 && sourceLifecycleLocked,
      fourDistinctOptions: distinct,
      exactlyOneCorrect: oneCorrect,
      answerParity: parity,
      frozenSourcePreserved: sourceLifecycleLocked,
      questionBankLocked: source.questionBankWritable === false && source.questionBankStatus === "NOT_STORED",
      testMockLocked: source.testEligible === false && source.testEligibility === "INELIGIBLE",
      publicationLocked: source.publiclyPublishable === false,
    },
    seed: input.seed,
  });
}

export function generateAlgebraStudioBatchV4(input: {
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  difficulty?: AlgebraStudioDifficulty;
  cpId?: string;
  qlId?: AlgebraQuestionStudioPattern["qlId"];
  patternId?: string;
  seed: string;
  count: number;
}) {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  let patterns = ALGEBRA_QUESTION_STUDIO_PATTERNS.filter((pattern) => {
    if (input.cpId && pattern.cpId !== input.cpId) return false;
    if (input.qlId && pattern.qlId !== input.qlId) return false;
    if (input.patternId && pattern.prototypeId !== input.patternId) return false;
    if (input.difficulty && difficultyFor(pattern) !== input.difficulty) return false;
    return true;
  });
  if (!patterns.length) throw new Error("No frozen Algebra Question Studio patterns matched the request.");
  patterns = [...patterns].sort((left, right) => {
    const leftScore = hashText(`${input.seed}:${left.prototypeId}`) / profileWeight(left, examProfile);
    const rightScore = hashText(`${input.seed}:${right.prototypeId}`) / profileWeight(right, examProfile);
    return leftScore - rightScore;
  });
  const count = Math.max(1, Math.min(Math.floor(input.count), 50));
  const questions = Array.from({ length: count }, (_unused, index) => generateAlgebraStudioQuestionV4({
    pattern: patterns[index % patterns.length]!,
    language,
    examProfile,
    seed: `${input.seed}:${index}`,
  }));
  return {
    authority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V4_AUTHORITY,
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V4,
    filters: {
      language,
      examProfile,
      difficulty: input.difficulty ?? null,
      cpId: input.cpId ?? null,
      qlId: input.qlId ?? null,
      patternId: input.patternId ?? null,
    },
    questionCount: questions.length,
    questions,
    reviewOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  };
}
