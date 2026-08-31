export const INT_001_DIRECT_CALCULATION_EXPLANATION_POLICY_VERSION =
  "INT-001-DIRECT-CALCULATION-EXPLANATION-POLICY-v1" as const;

const NUMERIC = /[0-9०-९੦-੯]/u;
const MATH = /[=×÷+−^/]|\\(?:frac|times|left|right)|₹|%/u;
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|multiplication\s+factor|growth\s+factor|depreciation\s+factor)\b|गुणक|ਗੁਣਕ/iu;
const STOP_SECTION = /(?:common mistakes?|option analysis|exam shortcut|quick method|सामान्य गलत|विकल्प विश्लेषण|परीक्षा में तेज|आम गलत|ਵਿਕਲਪ|ਪ੍ਰੀਖਿਆ ਵਾਲਾ ਤੇਜ਼)/iu;
const HEADING = /^\s*(?:#{1,6}\s*)?(?:[📌📝⚡⚠️]\s*)?(?:मुख्य अवधारणा|चरणबद्ध हल|ਮੁੱਖ ਧਾਰਨਾ|ਕਦਮ-ਦਰ-ਕਦਮ|key idea|worked solution|solution|formula)\s*[:：]?\s*$/iu;
const GENERIC_FORMULA = /^\s*(?:सूत्र|ਸੂਤਰ|formula)\s*:/iu;

export type InterestDirectCalculationLanguage = "en" | "hi" | "pa";

export type InterestDirectCalculationInput = Readonly<{
  qlId: string;
  language: InterestDirectCalculationLanguage;
  lines: readonly string[];
  answer?: string;
}>;

function flatten(lines: readonly string[]) {
  return lines.flatMap((line) => String(line ?? "").split(/\n+/u)).map((line) => line.trim()).filter(Boolean);
}

function cleanMarkdown(line: string) {
  return line
    .replace(/^\s*[-*]\s+/u, "")
    .replace(/^\s*\d+[.)]\s*/u, "")
    .replace(/^\s*#{1,6}\s*/u, "")
    .trim();
}

function deabstract(line: string, language: InterestDirectCalculationLanguage) {
  if (language === "en") {
    return line
      .replace(/complete compound multiplier/giu, "full year-by-year calculation")
      .replace(/complete depreciation multiplier/giu, "full year-by-year calculation")
      .replace(/combined multiplier/giu, "combined calculation")
      .replace(/return[-\s]difference factor/giu, "difference")
      .replace(/amount factor/giu, "amount")
      .replace(/growth factor/giu, "calculated value")
      .replace(/multiplication factor/giu, "calculated value")
      .replace(/\bmultiplier\b/giu, "calculated value")
      .replace(/\bfactor\b/giu, "value");
  }
  if (language === "hi") {
    return line
      .replace(/वार्षिक वृद्धि-गुणक/gu, "1 वर्ष बाद प्रति ₹1 की राशि")
      .replace(/राशि-मूलधन गुणक/gu, "राशि-मूलधन अनुपात")
      .replace(/राशि-गुणकों/gu, "राशि-मूलधन अनुपातों")
      .replace(/राशि के गुणक/gu, "राशि-मूलधन अनुपात")
      .replace(/समय-गुणकों/gu, "समय के राशि-मूलधन मानों")
      .replace(/वृद्धि गुणकों/gu, "प्रति ₹1 अंतिम राशियों")
      .replace(/वृद्धि गुणक/gu, "प्रति ₹1 अंतिम राशि")
      .replace(/ब्याज-गुणक/gu, "प्रति ₹1 ब्याज")
      .replace(/मूल्यह्रास गुणकों/gu, "वर्ष-दर-वर्ष घटाव")
      .replace(/गुणकों/gu, "मानों")
      .replace(/गुणक/gu, "मान");
  }
  return line
    .replace(/ਸਾਲਾਨਾ ਵਾਧਾ-ਗੁਣਕ/gu, "1 ਸਾਲ ਬਾਅਦ ਪ੍ਰਤੀ ₹1 ਰਕਮ")
    .replace(/ਰਕਮ-ਮੂਲਧਨ ਗੁਣਕ/gu, "ਰਕਮ-ਮੂਲਧਨ ਅਨੁਪਾਤ")
    .replace(/ਰਕਮ-ਗੁਣਕਾਂ/gu, "ਰਕਮ-ਮੂਲਧਨ ਅਨੁਪਾਤਾਂ")
    .replace(/ਰਕਮ ਦੇ ਗੁਣਕ/gu, "ਰਕਮ-ਮੂਲਧਨ ਅਨੁਪਾਤ")
    .replace(/ਸਮਾਂ-ਗੁਣਕਾਂ/gu, "ਸਮੇਂ ਦੇ ਰਕਮ-ਮੂਲਧਨ ਮਾਨਾਂ")
    .replace(/ਵਾਧਾ ਗੁਣਕਾਂ/gu, "ਪ੍ਰਤੀ ₹1 ਅੰਤਿਮ ਰਕਮਾਂ")
    .replace(/ਵਾਧਾ ਗੁਣਕ/gu, "ਪ੍ਰਤੀ ₹1 ਅੰਤਿਮ ਰਕਮ")
    .replace(/ਵਿਆਜ-ਗੁਣਕ/gu, "ਪ੍ਰਤੀ ₹1 ਵਿਆਜ")
    .replace(/ਘਟਾਓ ਗੁਣਕਾਂ/gu, "ਸਾਲ-ਦਰ-ਸਾਲ ਘਟਾਓ")
    .replace(/ਗੁਣਕਾਂ/gu, "ਮਾਨਾਂ")
    .replace(/ਗੁਣਕ/gu, "ਮਾਨ");
}

function looksGenericFormula(line: string) {
  if (!GENERIC_FORMULA.test(line)) return false;
  const digits = line.match(/[0-9]+/gu) ?? [];
  return digits.length === 0 || digits.every((token) => token === "100");
}

function isDirectCalculationLine(line: string) {
  return NUMERIC.test(line) && MATH.test(line);
}

function answerLine(answer: string | undefined, language: InterestDirectCalculationLanguage) {
  const value = String(answer ?? "").trim();
  if (!value) return "";
  if (language === "hi") return `उत्तर: ${value}`;
  if (language === "pa") return `ਉੱਤਰ: ${value}`;
  return `Answer: ${value}`;
}

export function retrofitInterestDirectCalculationLines(
  input: InterestDirectCalculationInput,
): readonly string[] {
  const flattened = flatten(input.lines);
  const candidates: string[] = [];
  let stopped = false;

  for (const raw of flattened) {
    if (STOP_SECTION.test(raw)) {
      stopped = true;
      continue;
    }
    if (stopped) continue;
    if (HEADING.test(raw)) continue;
    let line = cleanMarkdown(raw);
    if (!line || looksGenericFormula(line)) continue;

    if (FORBIDDEN.test(line)) {
      if (!NUMERIC.test(line)) continue;
      line = deabstract(line, input.language);
    }

    const direct = isDirectCalculationLine(line);
    const explicitResult = /(?:answer|final answer|उत्तर|अतः|इसलिए|ਉੱਤਰ|ਇਸ ਲਈ)/iu.test(line) && NUMERIC.test(line);
    if (!direct && !explicitResult) continue;
    if (FORBIDDEN.test(line)) continue;
    candidates.push(line);
  }

  const seen = new Set<string>();
  const unique = candidates.filter((line) => {
    const key = line.replace(/\s+/gu, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const compact = unique.length > 6 ? [...unique.slice(0, 5), unique[unique.length - 1]!] : unique;
  const final = answerLine(input.answer, input.language);
  if (final && !compact.some((line) => line.includes(String(input.answer)))) compact.push(final);

  if (compact.length === 0) {
    throw new Error(`${input.qlId}/${input.language}: direct-calculation retrofit produced an empty explanation.`);
  }
  if (compact.some((line) => FORBIDDEN.test(line))) {
    throw new Error(`${input.qlId}/${input.language}: abstract factor/multiplier narration survived retrofit.`);
  }
  return Object.freeze(compact);
}

function explanationSourceLines(explanation: any): readonly string[] {
  if (typeof explanation === "string") return Object.freeze([explanation]);
  if (!explanation || typeof explanation !== "object") return Object.freeze([]);
  return Object.freeze([
    explanation.whatAsked,
    explanation.keyIdea,
    explanation.mainRule,
    ...(explanation.steps ?? []),
    ...(explanation.workedSteps ?? []),
    explanation.examShortcut,
    explanation.verification,
    explanation.conclusion,
    explanation.finalAnswer,
  ].filter(Boolean).map(String));
}

export function retrofitInterestFrozenSourceExplanation(
  source: any,
  qlId: string,
  language: InterestDirectCalculationLanguage,
) {
  const answer = String(source?.correctAnswer ?? source?.answer ?? source?.options?.[source?.correctIndex]?.text ?? "").trim();
  const lines = retrofitInterestDirectCalculationLines({
    qlId,
    language,
    lines: explanationSourceLines(source?.explanation),
    answer,
  });
  const original = source?.explanation && typeof source.explanation === "object" ? source.explanation : {};
  return {
    ...source,
    explanation: Object.freeze({
      ...original,
      whatAsked: "",
      keyIdea: "",
      mainRule: "",
      steps: lines,
      workedSteps: lines,
      examShortcut: "",
      verification: "",
      conclusion: "",
      finalAnswer: "",
      commonMistake: "",
    }),
    explanationPresentationPolicy: INT_001_DIRECT_CALCULATION_EXPLANATION_POLICY_VERSION,
  };
}

export function retrofitInterestPreviewExplanation(
  question: any,
  qlId: string,
  language: InterestDirectCalculationLanguage,
) {
  const rawLines = Array.isArray(question?.packageExplanation?.lines)
    ? question.packageExplanation.lines
    : [String(question?.explanation ?? "")];
  const lines = retrofitInterestDirectCalculationLines({
    qlId,
    language,
    lines: rawLines,
    answer: String(question?.answer ?? question?.canonicalAnswer?.display ?? ""),
  });
  return Object.freeze({
    ...question,
    explanation: lines.join("\n\n"),
    packageExplanation: Object.freeze({ ...(question?.packageExplanation ?? {}), lines }),
    explanationPresentationPolicy: INT_001_DIRECT_CALCULATION_EXPLANATION_POLICY_VERSION,
  });
}

export function assertInterestDirectCalculationExplanation(
  qlId: string,
  language: InterestDirectCalculationLanguage,
  lines: readonly string[],
) {
  if (!lines.length) throw new Error(`${qlId}/${language}: empty direct-calculation explanation.`);
  if (lines.some((line) => FORBIDDEN.test(line))) {
    throw new Error(`${qlId}/${language}: forbidden abstract factor/multiplier narration detected.`);
  }
  const working = lines.filter((line) => !/^(?:Answer|उत्तर|ਉੱਤਰ)\s*:/iu.test(line));
  const direct = working.filter(isDirectCalculationLine);
  if (working.length && direct.length / working.length < 0.75) {
    throw new Error(`${qlId}/${language}: explanation is not calculation-dense enough.`);
  }
}
