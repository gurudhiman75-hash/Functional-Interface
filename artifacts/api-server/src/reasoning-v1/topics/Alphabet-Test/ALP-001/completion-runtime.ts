import type { AlpLocale, AlpOption, AlpQuestionLogic, GeneratedAlpQuestion } from "./types";
import { buildCp006 } from "./completion/cp006";
import { buildCp007 } from "./completion/cp007";
import { buildCp008 } from "./completion/cp008";
import { buildCp009 } from "./completion/cp009";
import { buildCp010 } from "./completion/cp010";
import { renderCompletionEditorial } from "./completion/editorial";
import { completionDifficulty } from "./completion/difficulty-v2";
import { completionOptions } from "./completion/distractors-v2";
import { rank, track, type C } from "./completion/shared";

function build(ql: AlpQuestionLogic, seed: number): C {
  switch (ql.checkpointId) {
    case "ALP-CP-006": return buildCp006(ql, seed);
    case "ALP-CP-007": return buildCp007(ql, seed);
    case "ALP-CP-008": return buildCp008(ql, seed);
    case "ALP-CP-009": return buildCp009(ql, seed);
    case "ALP-CP-010": return buildCp010(ql, seed);
    default: throw new Error("Not an ALP-001 completion checkpoint.");
  }
}

function selectedDigitTransformStem(completion: C, locale: AlpLocale): string {
  const number = completion.source.join("");
  const kind = completion.query.en.match(/apply\s+(ASC|DESC|REV|SWAP)/)?.[1] ?? "ASC";
  const action = kind === "ASC"
    ? { en: "arranged from smallest to largest", hi: "छोटे से बड़े क्रम में सजाया जाए", pa: "ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ" }
    : kind === "DESC"
      ? { en: "arranged from largest to smallest", hi: "बड़े से छोटे क्रम में सजाया जाए", pa: "ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ" }
      : kind === "REV"
        ? { en: "written in reverse order", hi: "उलटे क्रम में लिखा जाए", pa: "ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਿਆ ਜਾਵੇ" }
        : { en: "interchanged in adjacent pairs", hi: "साथ वाले युग्मों में आपस में बदला जाए", pa: "ਨਾਲ ਵਾਲੇ ਜੋੜਿਆਂ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਿਆ ਜਾਵੇ" };
  if (locale === "hi-IN") return `यदि संख्या ${number} के अंकों को ${action.hi}, तो कितने अंक अपने मूल स्थान पर रहेंगे?`;
  if (locale === "pa-IN") return `ਜੇ ਸੰਖਿਆ ${number} ਦੇ ਅੰਕਾਂ ਨੂੰ ${action.pa}, ਤਾਂ ਕਿੰਨੇ ਅੰਕ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`;
  return `If the digits of ${number} are ${action.en}, how many digits will remain in their original positions?`;
}

function qualifyingWordPairs(items: readonly string[]) {
  const pairs: Array<{ first: string; second: string; firstPosition: number; secondPosition: number; gap: number }> = [];
  for (let firstIndex = 0; firstIndex < items.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < items.length; secondIndex += 1) {
      const first = items[firstIndex]!;
      const second = items[secondIndex]!;
      const wordDistance = secondIndex - firstIndex;
      const alphabetDistance = Math.abs(rank(first) - rank(second));
      if (wordDistance !== alphabetDistance) continue;
      pairs.push({ first, second, firstPosition: firstIndex + 1, secondPosition: secondIndex + 1, gap: wordDistance - 1 });
    }
  }
  return pairs;
}

function optionCountStem(completion: C, locale: AlpLocale): string {
  const count = qualifyingWordPairs(completion.source).length;
  if (locale === "hi-IN") return count === 1
    ? "किस विकल्प में अक्षरों का ठीक 1 ऐसा युग्म है जिसका शब्द-अंतर और वर्णमाला-अंतर समान है?"
    : `किस विकल्प में अक्षरों के ठीक ${count} ऐसे युग्म हैं जिनका शब्द-अंतर और वर्णमाला-अंतर समान है?`;
  if (locale === "pa-IN") return count === 1
    ? "ਕਿਹੜੀ ਚੋਣ ਵਿੱਚ ਅੱਖਰਾਂ ਦਾ ਠੀਕ 1 ਅਜਿਹਾ ਜੋੜਾ ਹੈ ਜਿਸਦਾ ਸ਼ਬਦ-ਫਰਕ ਅਤੇ ਵਰਣਮਾਲਾ-ਫਰਕ ਇੱਕੋ ਹੈ?"
    : `ਕਿਹੜੀ ਚੋਣ ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਠੀਕ ${count} ਅਜੇਹੇ ਜੋੜੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦਾ ਸ਼ਬਦ-ਫਰਕ ਅਤੇ ਵਰਣਮਾਲਾ-ਫਰਕ ਇੱਕੋ ਹੈ?`;
  return `Which option contains exactly ${count} qualifying letter ${count === 1 ? "pair" : "pairs"}, with the same gap in the word and in the English alphabet?`;
}

function optionCountWorking(completion: C, locale: AlpLocale) {
  const pairs = qualifyingWordPairs(completion.source);
  const count = pairs.length;
  const pairList = pairs.map((pair) => `${pair.first}(${pair.firstPosition})–${pair.second}(${pair.secondPosition}) [${pair.gap}]`).join(", ");
  if (locale === "hi-IN") return {
    steps: [
      "हर विकल्प के अक्षरों को बाईं ओर से क्रम संख्या दें।",
      `${completion.answer} में सही ${count === 1 ? "युग्म" : "युग्म हैं"}: ${pairList}। कोष्ठक में दोनों स्थानों के बीच के अक्षरों की संख्या दी गई है।`,
      `${completion.answer} में ठीक ${count} सही ${count === 1 ? "युग्म है" : "युग्म हैं"}, इसलिए यही विकल्प माँगी संख्या पूरी करता है।`,
    ],
    visualWorking: [`जाँचा विकल्प: ${completion.answer}`, `समान-अंतर युग्म: ${pairList}`, `सत्यापित संख्या: ${count}`, `उत्तर: ${completion.answer}`],
  };
  if (locale === "pa-IN") return {
    steps: [
      "ਹਰ ਚੋਣ ਦੇ ਅੱਖਰਾਂ ਨੂੰ ਖੱਬੇ ਪਾਸੋਂ ਕ੍ਰਮ ਅੰਕ ਦਿਓ।",
      `${completion.answer} ਵਿੱਚ ਸਹੀ ${count === 1 ? "ਜੋੜਾ ਹੈ" : "ਜੋੜੇ ਹਨ"}: ${pairList}। ਕੋਠੀਆਂ ਵਿੱਚ ਦੋਵੇਂ ਥਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਦਿੱਤੀ ਹੈ।`,
      `${completion.answer} ਵਿੱਚ ਠੀਕ ${count} ਸਹੀ ${count === 1 ? "ਜੋੜਾ ਹੈ" : "ਜੋੜੇ ਹਨ"}, ਇਸ ਲਈ ਇਹੀ ਚੋਣ ਮੰਗੀ ਗਿਣਤੀ ਪੂਰੀ ਕਰਦੀ ਹੈ।`,
    ],
    visualWorking: [`ਜਾਂਚੀ ਚੋਣ: ${completion.answer}`, `ਇੱਕੋ-ਫਰਕ ਜੋੜੇ: ${pairList}`, `ਜਾਂਚੀ ਗਿਣਤੀ: ${count}`, `ਉੱਤਰ: ${completion.answer}`],
  };
  return {
    steps: [
      "Number the letters of each option from left to right.",
      `In ${completion.answer}, the qualifying ${count === 1 ? "pair is" : "pairs are"}: ${pairList}. The bracket shows the number of letters between the two positions.`,
      `${completion.answer} has exactly ${count} qualifying ${count === 1 ? "pair" : "pairs"}, so it matches the required count.`,
    ],
    visualWorking: [`Option checked: ${completion.answer}`, `Equal-gap ${count === 1 ? "pair" : "pairs"}: ${pairList}`, `Verified count: ${count}`, `Answer: ${completion.answer}`],
  };
}

function ensureVerifiedAnswerInTraps(
  analyses: GeneratedAlpQuestion["explanation"]["distractorAnalyses"],
  answer: string,
  locale: AlpLocale,
): GeneratedAlpQuestion["explanation"]["distractorAnalyses"] {
  const verification = locale === "hi-IN" ? `सत्यापित उत्तर ${answer} है।` : locale === "pa-IN" ? `ਜਾਂਚਿਆ ਉੱਤਰ ${answer} ਹੈ।` : `The verified answer is ${answer}.`;
  return analyses.map((analysis) => analysis.explanation.includes(answer) ? analysis : { ...analysis, explanation: `${analysis.explanation} ${verification}` });
}

function naturalizeCompletionText(text: string): string {
  return text
    .replaceAll("माँगी श्रेणी", "प्रश्न में बताई गई किस्म")
    .replaceAll("ਮੰਗੀ ਸ਼੍ਰੇਣੀ", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦੱਸੀ ਕਿਸਮ")
    .replaceAll("digit pairs in", "digit pairs in")
    .replaceAll("between its members in the number", "between their members in the number");
}

function localText(locale: AlpLocale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function compoundWindowPresentation(
  ql: AlpQuestionLogic,
  completion: C,
  opts: readonly AlpOption[],
  correctIndex: number,
  locale: AlpLocale,
) {
  if (ql.qlId !== "ALP-QL-138" && ql.qlId !== "ALP-QL-140") return undefined;

  const sequence = completion.source.join(" ");
  const literalZab = ql.qlId === "ALP-QL-138" && completion.query.en.includes("Z-A-B");
  const symbolLetterDigit = ql.qlId === "ALP-QL-138" && !literalZab;
  const working = locale === "hi-IN" ? completion.working.hi : locale === "pa-IN" ? completion.working.pa : completion.working.en;

  const stem = literalZab
    ? localText(locale,
      `In the sequence ${sequence}, how many A's are immediately preceded by Z and immediately followed by B?`,
      `श्रृंखला ${sequence} में कितने A ऐसे हैं जिनके ठीक पहले Z और ठीक बाद B है?`,
      `ਲੜੀ ${sequence} ਵਿੱਚ ਕਿੰਨੇ A ਅਜੇਹੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ Z ਅਤੇ ਠੀਕ ਬਾਅਦ B ਹੈ?`)
    : symbolLetterDigit
      ? localText(locale,
        `In the sequence ${sequence}, how many letters are immediately preceded by a symbol and immediately followed by a digit?`,
        `श्रृंखला ${sequence} में कितने अक्षर ऐसे हैं जिनके ठीक पहले कोई चिन्ह और ठीक बाद कोई अंक है?`,
        `ਲੜੀ ${sequence} ਵਿੱਚ ਕਿੰਨੇ ਅੱਖਰ ਅਜੇਹੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ ਕੋਈ ਨਿਸ਼ਾਨ ਅਤੇ ਠੀਕ ਬਾਅਦ ਕੋਈ ਅੰਕ ਹੈ?`)
      : localText(locale,
        `In the sequence ${sequence}, how many symbols have a letter on one side and a digit on the other side, immediately adjacent?`,
        `श्रृंखला ${sequence} में कितने चिन्ह ऐसे हैं जिनके एक ओर अक्षर और दूसरी ओर अंक ठीक साथ में है?`,
        `ਲੜੀ ${sequence} ਵਿੱਚ ਕਿੰਨੇ ਨਿਸ਼ਾਨ ਅਜੇਹੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦੇ ਇੱਕ ਪਾਸੇ ਅੱਖਰ ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਅੰਕ ਬਿਲਕੁਲ ਨਾਲ ਹੈ?`);

  const coreConcept = localText(locale,
    "Check overlapping windows of three consecutive elements; all three conditions must be true in the same window.",
    "तीन लगातार तत्त्वों के हर समूह को जाँचें; एक ही समूह में तीनों शर्तें पूरी होनी चाहिए।",
    "ਤਿੰਨ ਲਗਾਤਾਰ ਤੱਤਾਂ ਦੇ ਹਰ ਸਮੂਹ ਨੂੰ ਜਾਂਚੋ; ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਤਿੰਨੇ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।");
  const ruleStatement = literalZab
    ? localText(locale,
      "Count only consecutive Z-A-B windows; A is valid only when Z is immediately before it and B is immediately after it.",
      "केवल लगातार Z-A-B समूह गिनें; A तभी सही है जब उसके ठीक पहले Z और ठीक बाद B हो।",
      "ਕੇਵਲ ਲਗਾਤਾਰ Z-A-B ਸਮੂਹ ਗਿਣੋ; A ਤਦੋਂ ਹੀ ਸਹੀ ਹੈ ਜਦੋਂ ਉਸਦੇ ਠੀਕ ਪਹਿਲਾਂ Z ਅਤੇ ਠੀਕ ਬਾਅਦ B ਹੋਵੇ।")
    : symbolLetterDigit
      ? localText(locale, "The centre element must be a letter, with a symbol immediately before it and a digit immediately after it.", "बीच का तत्त्व अक्षर हो; उसके ठीक पहले चिन्ह और ठीक बाद अंक हो।", "ਵਿਚਕਾਰਲਾ ਤੱਤ ਅੱਖਰ ਹੋਵੇ; ਉਸਦੇ ਠੀਕ ਪਹਿਲਾਂ ਨਿਸ਼ਾਨ ਅਤੇ ਠੀਕ ਬਾਅਦ ਅੰਕ ਹੋਵੇ।")
      : localText(locale, "The centre element must be a symbol and its two immediate neighbours must be one letter and one digit in either order.", "बीच का तत्त्व चिन्ह हो और उसके दोनों तुरंत पड़ोसी एक अक्षर तथा एक अंक हों, क्रम कोई भी हो।", "ਵਿਚਕਾਰਲਾ ਤੱਤ ਨਿਸ਼ਾਨ ਹੋਵੇ ਅਤੇ ਉਸਦੇ ਦੋਵੇਂ ਤੁਰੰਤ ਗੁਆਂਢੀ ਇੱਕ ਅੱਖਰ ਅਤੇ ਇੱਕ ਅੰਕ ਹੋਣ, ਕ੍ਰਮ ਕੋਈ ਵੀ ਹੋਵੇ।");

  const steps = [
    localText(locale, "Number the complete row without removing any element.", "पूरी पंक्ति को स्थान संख्या दें; कोई तत्त्व न हटाएँ।", "ਪੂਰੀ ਕਤਾਰ ਨੂੰ ਥਾਂ ਨੰਬਰ ਦਿਓ; ਕੋਈ ਤੱਤ ਨਾ ਹਟਾਓ।"),
    localText(locale, "Slide a three-element window one place at a time and keep only the windows satisfying every stated condition.", "तीन-तत्त्व की खिड़की को एक-एक स्थान आगे बढ़ाएँ और केवल वे समूह रखें जो सभी शर्तें पूरी करते हैं।", "ਤਿੰਨ-ਤੱਤ ਖਿੜਕੀ ਨੂੰ ਇੱਕ-ਇੱਕ ਥਾਂ ਅੱਗੇ ਵਧਾਓ ਅਤੇ ਕੇਵਲ ਉਹ ਸਮੂਹ ਰੱਖੋ ਜੋ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹਨ।"),
    working,
  ];
  const visualWorking = [localText(locale, `Row: ${sequence}`, `पंक्ति: ${sequence}`, `ਕਤਾਰ: ${sequence}`), working, localText(locale, `Answer: ${completion.answer}`, `उत्तर: ${completion.answer}`, `ਉੱਤਰ: ${completion.answer}`)];
  const distractorAnalyses: GeneratedAlpQuestion["explanation"]["distractorAnalyses"] = opts
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ optionIndex }) => optionIndex !== correctIndex)
    .map(({ option, optionIndex }) => ({
      optionIndex,
      optionValue: option.value,
      errorLabel: option.errorLabel ?? "WINDOW_MISCOUNT",
      explanation: localText(locale,
        `Option ${optionIndex + 1} (${option.value}) is incorrect. ${working} The verified total is ${completion.answer}, so ${option.value} misses or adds at least one three-token window.`,
        `विकल्प ${optionIndex + 1} (${option.value}) गलत है। ${working} सत्यापित कुल ${completion.answer} है, इसलिए ${option.value} में कम-से-कम एक तीन-तत्त्व समूह छूटा या अतिरिक्त गिना गया है।`,
        `ਚੋਣ ${optionIndex + 1} (${option.value}) ਗਲਤ ਹੈ। ${working} ਜਾਂਚੀ ਕੁੱਲ ਗਿਣਤੀ ${completion.answer} ਹੈ, ਇਸ ਲਈ ${option.value} ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਤਿੰਨ-ਤੱਤ ਸਮੂਹ ਛੁੱਟਿਆ ਜਾਂ ਵੱਧ ਗਿਣਿਆ ਗਿਆ ਹੈ।`),
    }));

  return {
    stem,
    coreConcept,
    ruleStatement,
    steps,
    visualWorking,
    examShortcut: localText(locale, "Mark only the middle element of each valid three-token window; this prevents double-counting overlapping windows.", "हर सही तीन-तत्त्व समूह के केवल बीच वाले तत्त्व को चिन्हित करें; इससे पास-पास के समूह दो बार नहीं गिने जाते।", "ਹਰ ਸਹੀ ਤਿੰਨ-ਤੱਤ ਸਮੂਹ ਦੇ ਕੇਵਲ ਵਿਚਕਾਰਲੇ ਤੱਤ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਓ; ਇਸ ਨਾਲ ਨੇੜਲੇ ਸਮੂਹ ਦੋ ਵਾਰ ਨਹੀਂ ਗਿਣੇ ਜਾਂਦੇ।"),
    conclusion: localText(locale, `Therefore, the correct count is ${completion.answer}.`, `इसलिए सही संख्या ${completion.answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਗਿਣਤੀ ${completion.answer} ਹੈ।`),
    distractorAnalyses,
    closestTrapRejection: localText(locale, `The nearest option still disagrees with the complete three-token scan; the verified count is ${completion.answer}.`, `निकटतम विकल्प भी पूरी तीन-तत्त्व जाँच से मेल नहीं खाता; सत्यापित संख्या ${completion.answer} है।`, `ਸਭ ਤੋਂ ਨੇੜਲੀ ਚੋਣ ਵੀ ਪੂਰੀ ਤਿੰਨ-ਤੱਤ ਜਾਂਚ ਨਾਲ ਨਹੀਂ ਮਿਲਦੀ; ਜਾਂਚੀ ਗਿਣਤੀ ${completion.answer} ਹੈ।`),
  };
}

export function generateAlpCompletionQuestion(ql: AlpQuestionLogic, seed: number, locale: AlpLocale): GeneratedAlpQuestion {
  if (!Number.isInteger(seed)) throw new Error("ALP-001 completion seed must be an integer.");
  const completion = build(ql, seed);
  const builtOptions = completionOptions(completion, ql, seed);
  const editorial = renderCompletionEditorial(ql, completion, builtOptions.out, builtOptions.correctIndex, locale);
  const distractorAnalyses = ensureVerifiedAnswerInTraps(editorial.distractorAnalyses, completion.answer, locale);
  const optionOnlyQuestion = ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT";
  const optionOnlyWorking = optionOnlyQuestion ? optionCountWorking(completion, locale) : undefined;
  const compoundPresentation = compoundWindowPresentation(ql, completion, builtOptions.out, builtOptions.correctIndex, locale);
  const renderedStem = ql.solveMode === "DIGIT_COUNT_UNCHANGED_SELECTED_TRANSFORM"
    ? selectedDigitTransformStem(completion, locale)
    : optionOnlyQuestion ? optionCountStem(completion, locale) : naturalizeCompletionText(editorial.stem);

  return {
    chapterId: "ALP-001",
    qlId: ql.qlId,
    checkpointId: ql.checkpointId,
    ruleId: ql.ruleId,
    solveMode: ql.solveMode,
    locale,
    seed,
    difficulty: completionDifficulty(ql, completion),
    renderer: ql.renderer,
    presentationMode: ql.presentationMode,
    stem: compoundPresentation?.stem ?? renderedStem,
    structuredPrompt: {
      ...(!optionOnlyQuestion ? { sequence: completion.source } : {}),
      ...(!optionOnlyQuestion && completion.changed ? { transformedSequence: completion.changed } : {}),
      ...(!optionOnlyQuestion && completion.word ? { word: completion.word } : {}),
      ...(!optionOnlyQuestion && completion.changedWord ? { transformedWord: completion.changedWord } : {}),
      ...(!optionOnlyQuestion ? { positionTrack: track(completion.source) } : {}),
    },
    options: builtOptions.out,
    correctIndex: builtOptions.correctIndex,
    answer: completion.answer,
    explanation: {
      schemaVersion: "ALP-001-PEDAGOGY-V2",
      coreConcept: compoundPresentation?.coreConcept ?? naturalizeCompletionText(editorial.coreConcept),
      ruleStatement: compoundPresentation?.ruleStatement ?? naturalizeCompletionText(editorial.ruleStatement),
      steps: compoundPresentation?.steps ?? optionOnlyWorking?.steps ?? editorial.steps.map(naturalizeCompletionText),
      visualWorking: compoundPresentation?.visualWorking ?? optionOnlyWorking?.visualWorking ?? editorial.visualWorking.map(naturalizeCompletionText),
      examShortcut: compoundPresentation?.examShortcut ?? naturalizeCompletionText(editorial.examShortcut),
      conclusion: compoundPresentation?.conclusion ?? naturalizeCompletionText(editorial.conclusion),
      distractorAnalyses: compoundPresentation?.distractorAnalyses ?? distractorAnalyses.map((analysis) => ({ ...analysis, explanation: naturalizeCompletionText(analysis.explanation) })),
      closestTrapRejection: compoundPresentation?.closestTrapRejection ?? naturalizeCompletionText(editorial.closestTrapRejection),
    },
    metadata: {
      runtimeVersion: "ALP-001-RUNTIME-V3",
      localeMode: "TRANSLATABLE",
      independentSolverVerified: true,
      ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE",
      occurrenceAware: new Set(completion.source).size !== completion.source.length,
    },
  };
}
