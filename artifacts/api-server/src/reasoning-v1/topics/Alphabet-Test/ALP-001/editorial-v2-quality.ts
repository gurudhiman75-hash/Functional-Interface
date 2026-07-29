import { renderAlpExplanationV2 as renderBaseExplanation, renderAlpStemV2 } from "./editorial-v2-safe";
import type {
  AlpDistractorAnalysis,
  AlpExplanation,
  AlpInstanceData,
  AlpLocale,
  AlpOption,
  AlpQuestionLogic,
  AlpSolverResult,
} from "./types";

function text(locale: AlpLocale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

function rank(letter: string): number {
  return letter.charCodeAt(0) - 64;
}

function pairParts(value: string): readonly [string, string] | undefined {
  const parts = value.split(/\s*(?:,|:)\s*/);
  return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : undefined;
}

function repairGenericPedagogy(
  explanation: AlpExplanation,
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  locale: AlpLocale,
): AlpExplanation {
  let coreConcept: string | undefined;
  let steps: readonly string[] | undefined;
  let visualWorking: readonly string[] | undefined;
  let examShortcut: string | undefined;

  if (ql.solveMode === "IDENTIFY_PAIR_WITH_GAP" || ql.solveMode === "IDENTIFY_PAIR_WITH_DISTANCE") {
    const pair = pairParts(solved.answer);
    if (pair) {
      const [first, second] = pair;
      const difference = Math.abs(rank(second) - rank(first));
      const isGap = ql.solveMode === "IDENTIFY_PAIR_WITH_GAP";
      const measured = isGap ? difference - 1 : difference;
      const required = data.rank ?? measured;
      coreConcept = text(
        locale,
        isGap ? "For two letters, the number strictly between them is the absolute rank difference minus 1." : "The positional distance between two letters is the absolute difference of their forward ranks.",
        isGap ? "दो अक्षरों के बीच केवल अंदर वाले अक्षरों की संख्या उनके सीधे स्थानों के अंतर से 1 घटाकर मिलती है।" : "दो अक्षरों की स्थान-दूरी उनके सीधे स्थानों के अंतर का परिमाण है।",
        isGap ? "ਦੋ ਅੱਖਰਾਂ ਦੇ ਵਿਚਕਾਰ ਕੇਵਲ ਅੰਦਰਲੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਦੇ ਫਰਕ ਵਿਚੋਂ 1 ਘਟਾ ਕੇ ਮਿਲਦੀ ਹੈ।" : "ਦੋ ਅੱਖਰਾਂ ਦੀ ਥਾਂ-ਦੂਰੀ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਦੇ ਫਰਕ ਦਾ ਪੂਰਨ ਮੂਲ ਹੈ।",
      );
      steps = [
        text(locale, `${first} = ${rank(first)} and ${second} = ${rank(second)}.`, `${first} = ${rank(first)} और ${second} = ${rank(second)}।`, `${first} = ${rank(first)} ਅਤੇ ${second} = ${rank(second)}।`),
        text(locale, isGap ? `Letters between = |${rank(second)} − ${rank(first)}| − 1 = ${measured}.` : `Positional distance = |${rank(second)} − ${rank(first)}| = ${measured}.`, isGap ? `बीच के अक्षर = |${rank(second)} − ${rank(first)}| − 1 = ${measured}।` : `स्थान-दूरी = |${rank(second)} − ${rank(first)}| = ${measured}।`, isGap ? `ਵਿਚਕਾਰਲੇ ਅੱਖਰ = |${rank(second)} − ${rank(first)}| − 1 = ${measured}।` : `ਥਾਂ-ਦੂਰੀ = |${rank(second)} − ${rank(first)}| = ${measured}।`),
        text(locale, `${solved.answer} matches the required value ${required}; the other options do not.`, `${solved.answer} माँगे गए मान ${required} से मेल खाता है; अन्य विकल्प नहीं।`, `${solved.answer} ਮੰਗੇ ਗਏ ਮੁੱਲ ${required} ਨਾਲ ਮਿਲਦਾ ਹੈ; ਹੋਰ ਵਿਕਲਪ ਨਹੀਂ।`),
      ];
      visualWorking = [`${first}(${rank(first)}) ↔ ${second}(${rank(second)}) | ${isGap ? "gap" : "distance"} = ${measured}`];
      examShortcut = text(locale, isGap ? `For ${required} letters between, look for ranks differing by ${required + 1}.` : `Look for a rank difference of exactly ${required}.`, isGap ? `${required} बीच के अक्षरों के लिए ऐसे स्थान खोजें जिनका अंतर ${required + 1} हो।` : `ठीक ${required} का स्थान-अंतर खोजें।`, isGap ? `${required} ਵਿਚਕਾਰਲੇ ਅੱਖਰਾਂ ਲਈ ਉਹ ਥਾਵਾਂ ਲੱਭੋ ਜਿਨ੍ਹਾਂ ਦਾ ਫਰਕ ${required + 1} ਹੋਵੇ।` : `ਠੀਕ ${required} ਦਾ ਥਾਂ-ਫਰਕ ਲੱਭੋ।`);
    }
  } else if (ql.solveMode === "COMPARE_TWO_GAPS" && data.pairA && data.pairB) {
    const [a1, a2] = data.pairA;
    const [b1, b2] = data.pairB;
    const gapA = Math.abs(rank(a2) - rank(a1)) - 1;
    const gapB = Math.abs(rank(b2) - rank(b1)) - 1;
    coreConcept = text(locale, "Find each exclusive gap separately, then take the absolute difference of the two gap counts.", "पहले दोनों जोड़ियों के बीच के अक्षर अलग-अलग गिनें, फिर दोनों गिनतियों का परिमाणात्मक अंतर लें।", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਜੋੜੀਆਂ ਦੇ ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਵੱਖ-ਵੱਖ ਗਿਣੋ, ਫਿਰ ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਦਾ ਪੂਰਨ ਫਰਕ ਲਵੋ।");
    steps = [
      text(locale, `${a1}:${a2} has |${rank(a2)} − ${rank(a1)}| − 1 = ${gapA} intervening letters.`, `${a1}:${a2} में |${rank(a2)} − ${rank(a1)}| − 1 = ${gapA} बीच के अक्षर हैं।`, `${a1}:${a2} ਵਿੱਚ |${rank(a2)} − ${rank(a1)}| − 1 = ${gapA} ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਹਨ।`),
      text(locale, `${b1}:${b2} has |${rank(b2)} − ${rank(b1)}| − 1 = ${gapB} intervening letters.`, `${b1}:${b2} में |${rank(b2)} − ${rank(b1)}| − 1 = ${gapB} बीच के अक्षर हैं।`, `${b1}:${b2} ਵਿੱਚ |${rank(b2)} − ${rank(b1)}| − 1 = ${gapB} ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਹਨ।`),
      text(locale, `Required difference = |${gapA} − ${gapB}| = ${solved.answer}.`, `आवश्यक अंतर = |${gapA} − ${gapB}| = ${solved.answer}।`, `ਲੋੜੀਂਦਾ ਫਰਕ = |${gapA} − ${gapB}| = ${solved.answer}।`),
    ];
    visualWorking = [`${a1}:${a2} → ${gapA} | ${b1}:${b2} → ${gapB} | difference ${solved.answer}`];
    examShortcut = text(locale, "Because both calculations subtract 1, compare the two rank differences directly; their difference is unchanged.", "दोनों गणनाओं में 1 घटता है, इसलिए दोनों स्थान-अंतर सीधे तुलना करें; उनका अंतर वही रहता है।", "ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਵਿੱਚ 1 ਘਟਦਾ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਥਾਂ-ਫਰਕ ਸਿੱਧੇ ਤੁਲਨਾ ਕਰੋ; ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ਉਹੀ ਰਹਿੰਦਾ ਹੈ।");
  } else if (ql.solveMode === "COUNT_LETTERS_OUTSIDE_INTERVAL" && data.letter && data.secondLetter) {
    const firstRank = rank(data.letter);
    const secondRank = rank(data.secondLetter);
    const inside = Math.abs(secondRank - firstRank) + 1;
    coreConcept = text(locale, "When both endpoints belong to the interval, its size is rank difference + 1; subtract that size from 26 to count the letters outside.", "जब दोनों सिरे अंतराल में शामिल हों, तब अंतराल की संख्या = स्थान-अंतर + 1 होती है; बाहर के अक्षरों के लिए इसे 26 से घटाएँ।", "ਜਦੋਂ ਦੋਵੇਂ ਸਿਰੇ ਅੰਤਰਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ, ਤਾਂ ਅੰਤਰਾਲ ਦੀ ਗਿਣਤੀ = ਥਾਂ-ਫਰਕ + 1 ਹੁੰਦੀ ਹੈ; ਬਾਹਰਲੇ ਅੱਖਰਾਂ ਲਈ ਇਸ ਨੂੰ 26 ਵਿਚੋਂ ਘਟਾਓ।");
    steps = [
      text(locale, `${data.letter} = ${firstRank} and ${data.secondLetter} = ${secondRank}.`, `${data.letter} = ${firstRank} और ${data.secondLetter} = ${secondRank}।`, `${data.letter} = ${firstRank} ਅਤੇ ${data.secondLetter} = ${secondRank}।`),
      text(locale, `Letters inside the inclusive interval = |${secondRank} − ${firstRank}| + 1 = ${inside}.`, `दोनों सिरों सहित अंतराल के अक्षर = |${secondRank} − ${firstRank}| + 1 = ${inside}।`, `ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਅੰਤਰਾਲ ਦੇ ਅੱਖਰ = |${secondRank} − ${firstRank}| + 1 = ${inside}।`),
      text(locale, `Letters outside = 26 − ${inside} = ${solved.answer}.`, `बाहर के अक्षर = 26 − ${inside} = ${solved.answer}।`, `ਬਾਹਰਲੇ ਅੱਖਰ = 26 − ${inside} = ${solved.answer}।`),
    ];
    visualWorking = [`26 total − ${inside} inside = ${solved.answer} outside`];
    examShortcut = text(locale, "Outside count = 25 − positional distance between the endpoints.", "बाहर की संख्या = 25 − दोनों सिरों की स्थान-दूरी।", "ਬਾਹਰਲੀ ਗਿਣਤੀ = 25 − ਦੋਵੇਂ ਸਿਰਿਆਂ ਦੀ ਥਾਂ-ਦੂਰੀ।");
  } else if (ql.solveMode === "COUNT_LETTERS_BEFORE_AND_AFTER" && data.letter && data.secondLetter) {
    const earlier = rank(data.letter) <= rank(data.secondLetter) ? data.letter : data.secondLetter;
    const later = earlier === data.letter ? data.secondLetter : data.letter;
    const before = rank(earlier) - 1;
    const after = 26 - rank(later);
    coreConcept = text(locale, "Letters before the earlier endpoint equal its rank minus 1; letters after the later endpoint equal 26 minus its rank.", "पहले आने वाले अक्षर की संख्या उसके स्थान से 1 कम होती है; बाद वाले अक्षर के बाद की संख्या 26 में से उसका स्थान घटाकर मिलती है।", "ਪਹਿਲਾਂ ਆਉਣ ਵਾਲੇ ਅੱਖਰ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਗਿਣਤੀ ਉਸ ਦੀ ਥਾਂ ਤੋਂ 1 ਘੱਟ ਹੁੰਦੀ ਹੈ; ਬਾਅਦ ਵਾਲੇ ਅੱਖਰ ਤੋਂ ਬਾਅਦ ਦੀ ਗਿਣਤੀ 26 ਵਿਚੋਂ ਉਸ ਦੀ ਥਾਂ ਘਟਾ ਕੇ ਮਿਲਦੀ ਹੈ।");
    steps = [
      text(locale, `${earlier} is earlier at rank ${rank(earlier)}, so letters before it = ${rank(earlier)} − 1 = ${before}.`, `${earlier} पहले स्थान ${rank(earlier)} पर है, इसलिए उससे पहले अक्षर = ${rank(earlier)} − 1 = ${before}।`, `${earlier} ਪਹਿਲਾਂ ਥਾਂ ${rank(earlier)} ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਅੱਖਰ = ${rank(earlier)} − 1 = ${before}।`),
      text(locale, `${later} is later at rank ${rank(later)}, so letters after it = 26 − ${rank(later)} = ${after}.`, `${later} बाद में स्थान ${rank(later)} पर है, इसलिए उसके बाद अक्षर = 26 − ${rank(later)} = ${after}।`, `${later} ਬਾਅਦ ਵਿੱਚ ਥਾਂ ${rank(later)} ਉੱਤੇ ਹੈ, ਇਸ ਲਈ ਇਸ ਤੋਂ ਬਾਅਦ ਅੱਖਰ = 26 − ${rank(later)} = ${after}।`),
      text(locale, `In the requested order, the answer is ${before}, ${after}.`, `माँगे गए क्रम में उत्तर ${before}, ${after} है।`, `ਮੰਗੇ ਗਏ ਕ੍ਰਮ ਵਿੱਚ ਜਵਾਬ ${before}, ${after} ਹੈ।`),
    ];
    visualWorking = [`A … ${earlier}(${rank(earlier)}) | before ${before} || ${later}(${rank(later)}) … Z | after ${after}`];
    examShortcut = text(locale, "Use rank − 1 for 'before' and 26 − rank for 'after'; keep the requested order.", "‘पहले’ के लिए स्थान − 1 और ‘बाद’ के लिए 26 − स्थान लें; माँगा गया क्रम न बदलें।", "‘ਪਹਿਲਾਂ’ ਲਈ ਥਾਂ − 1 ਅਤੇ ‘ਬਾਅਦ’ ਲਈ 26 − ਥਾਂ ਲਵੋ; ਮੰਗਿਆ ਕ੍ਰਮ ਨਾ ਬਦਲੋ।");
  }

  if (!coreConcept || !steps || !visualWorking || !examShortcut) return explanation;
  return { ...explanation, coreConcept, ruleStatement: coreConcept, steps, visualWorking, examShortcut };
}

function relationReason(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  correct: string,
  value: string,
  locale: AlpLocale,
): string {
  const parts = pairParts(value);
  if (parts?.every((member) => /^[A-Z]$/.test(member))) {
    const [first, second] = parts;
    const distance = Math.abs(rank(second) - rank(first));
    if (ql.solveMode === "IDENTIFY_OPPOSITE_PAIR") {
      return text(locale, `has rank sum ${rank(first)} + ${rank(second)} = ${rank(first) + rank(second)}, not 27.`, `इसके स्थानों का योग ${rank(first)} + ${rank(second)} = ${rank(first) + rank(second)} है, 27 नहीं।`, `ਇਸ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਜੋੜ ${rank(first)} + ${rank(second)} = ${rank(first) + rank(second)} ਹੈ, 27 ਨਹੀਂ।`);
    }
    if (ql.solveMode === "IDENTIFY_PAIR_WITH_GAP") {
      return text(locale, `has ${distance - 1} letters between its members, not the required ${data.rank}.`, `इसके दोनों अक्षरों के बीच ${distance - 1} अक्षर हैं, आवश्यक ${data.rank} नहीं।`, `ਇਸ ਦੇ ਦੋਵੇਂ ਅੱਖਰਾਂ ਵਿਚਕਾਰ ${distance - 1} ਅੱਖਰ ਹਨ, ਲੋੜੀਂਦੇ ${data.rank} ਨਹੀਂ।`);
    }
    if (ql.solveMode === "IDENTIFY_PAIR_WITH_DISTANCE") {
      return text(locale, `has positional distance ${distance}, not the required ${data.rank}.`, `इसकी स्थान-दूरी ${distance} है, आवश्यक ${data.rank} नहीं।`, `ਇਸ ਦੀ ਥਾਂ-ਦੂਰੀ ${distance} ਹੈ, ਲੋੜੀਂਦੀ ${data.rank} ਨਹੀਂ।`);
    }
  }
  return text(locale, `does not satisfy the relation verified by ${correct}.`, `उस संबंध को पूरा नहीं करता जिसे ${correct} पूरा करता है।`, `ਉਹ ਸੰਬੰਧ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ ਜਿਸ ਨੂੰ ${correct} ਪੂਰਾ ਕਰਦਾ ਹੈ।`);
}

function labelledTrap(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  option: AlpOption,
  optionIndex: number,
  locale: AlpLocale,
): AlpDistractorAnalysis {
  const value = option.value;
  const correct = solved.answer;
  const label = option.errorLabel ?? "UNCLASSIFIED_DISTRACTOR";
  const prefix = text(locale, `Option ${optionIndex + 1} (${value})`, `विकल्प ${optionIndex + 1} (${value})`, `ਵਿਕਲਪ ${optionIndex + 1} (${value})`);
  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
  const numericCorrect = /^\d+$/.test(correct) ? Number(correct) : undefined;
  let reason: string;

  switch (label) {
    case "OFF_BY_ONE_ENDPOINT": {
      const tooHigh = numericValue !== undefined && numericCorrect !== undefined && numericValue > numericCorrect;
      reason = text(locale, tooHigh ? `counts one position too many; the correct count is ${correct}.` : `omits one required position; the correct count is ${correct}.`, tooHigh ? `एक स्थान अधिक गिनता है; सही गिनती ${correct} है।` : `एक आवश्यक स्थान छोड़ देता है; सही गिनती ${correct} है।`, tooHigh ? `ਇੱਕ ਥਾਂ ਵੱਧ ਗਿਣਦਾ ਹੈ; ਸਹੀ ਗਿਣਤੀ ${correct} ਹੈ।` : `ਇੱਕ ਲੋੜੀਂਦੀ ਥਾਂ ਛੱਡ ਦਿੰਦਾ ਹੈ; ਸਹੀ ਗਿਣਤੀ ${correct} ਹੈ।`);
      break;
    }
    case "TWO_STEP_MISCOUNT":
      reason = text(locale, `is two positions away from the verified count ${correct}.`, `सत्यापित गिनती ${correct} से दो स्थान दूर है।`, `ਪੱਕੀ ਗਿਣਤੀ ${correct} ਤੋਂ ਦੋ ਥਾਵਾਂ ਦੂਰ ਹੈ।`);
      break;
    case "WRONG_REFERENCE_END":
      reason = text(locale, `applies the complementary-rank operation 27 − ${correct} = ${value} where no reference-end conversion is needed.`, `जहाँ सिरा बदलना आवश्यक नहीं है, वहाँ 27 − ${correct} = ${value} लगा देता है।`, `ਜਿੱਥੇ ਸਿਰਾ ਬਦਲਣਾ ਲੋੜੀਂਦਾ ਨਹੀਂ, ਉੱਥੇ 27 − ${correct} = ${value} ਲਗਾ ਦਿੰਦਾ ਹੈ।`);
      break;
    case "USED_GIVEN_RANK_AS_ANSWER":
      reason = text(locale, `copies the given rank ${data.rank ?? value} instead of completing the requested operation to obtain ${correct}.`, `माँगी गई क्रिया पूरी करके ${correct} निकालने के बजाय दिया स्थान ${data.rank ?? value} ही लिख देता है।`, `ਮੰਗੀ ਕਿਰਿਆ ਪੂਰੀ ਕਰਕੇ ${correct} ਕੱਢਣ ਦੀ ਬਜਾਏ ਦਿੱਤੀ ਥਾਂ ${data.rank ?? value} ਹੀ ਲਿਖ ਦਿੰਦਾ ਹੈ।`);
      break;
    case "USED_SHIFT_AS_FINAL_POSITION":
      reason = text(locale, `treats the movement amount ${data.offset ?? value} as the final position instead of applying it to reach ${correct}.`, `चाल की संख्या ${data.offset ?? value} को अंतिम स्थान मान लेता है, जबकि उसे लागू करने से ${correct} मिलता है।`, `ਚਾਲ ਦੀ ਗਿਣਤੀ ${data.offset ?? value} ਨੂੰ ਅੰਤਿਮ ਥਾਂ ਮੰਨ ਲੈਂਦਾ ਹੈ, ਜਦਕਿ ਇਸ ਨੂੰ ਲਗਾਉਣ ਨਾਲ ${correct} ਮਿਲਦਾ ਹੈ।`);
      break;
    case "USED_SECOND_SHIFT_ONLY":
      reason = text(locale, `uses only the second movement ${data.secondOffset ?? value}; both stages together give ${correct}.`, `केवल दूसरी चाल ${data.secondOffset ?? value} लेता है; दोनों चरण मिलकर ${correct} देते हैं।`, `ਕੇਵਲ ਦੂਜੀ ਚਾਲ ${data.secondOffset ?? value} ਲੈਂਦਾ ਹੈ; ਦੋਵੇਂ ਪੜਾਅ ਮਿਲ ਕੇ ${correct} ਦਿੰਦੇ ਹਨ।`);
      break;
    case "USED_QUERIED_POSITION_AS_ANSWER":
      reason = text(locale, `repeats the queried position ${data.position ?? value} instead of reading the result ${correct} found there.`, `पूछी गई स्थान संख्या ${data.position ?? value} को ही उत्तर बना देता है, जबकि वहाँ से ${correct} मिलता है।`, `ਪੁੱਛੀ ਥਾਂ ਨੰਬਰ ${data.position ?? value} ਨੂੰ ਹੀ ਜਵਾਬ ਬਣਾ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਉੱਥੋਂ ${correct} ਮਿਲਦਾ ਹੈ।`);
      break;
    case "USED_ORIGINAL_LEFT_POSITION":
      reason = text(locale, `reports the original left position ${value}; after rearrangement the required position is ${correct}.`, `मूल बाईं स्थिति ${value} बताता है; पुनर्व्यवस्था के बाद सही स्थिति ${correct} है।`, `ਮੂਲ ਖੱਬੀ ਥਾਂ ${value} ਦੱਸਦਾ ਹੈ; ਮੁੜ-ਵਿਵਸਥਾ ਤੋਂ ਬਾਅਦ ਸਹੀ ਥਾਂ ${correct} ਹੈ।`);
      break;
    case "USED_ORIGINAL_RIGHT_POSITION":
      reason = text(locale, `reports the original right position ${value}; after rearrangement the required position is ${correct}.`, `मूल दाईं स्थिति ${value} बताता है; पुनर्व्यवस्था के बाद सही स्थिति ${correct} है।`, `ਮੂਲ ਸੱਜੀ ਥਾਂ ${value} ਦੱਸਦਾ ਹੈ; ਮੁੜ-ਵਿਵਸਥਾ ਤੋਂ ਬਾਅਦ ਸਹੀ ਥਾਂ ${correct} ਹੈ।`);
      break;
    case "STOPPED_ONE_STEP_LATE":
      reason = text(locale, `moves one alphabet step beyond ${correct} and lands on ${value}.`, `सही अक्षर ${correct} से एक स्थान आगे जाकर ${value} पर रुकता है।`, `ਸਹੀ ਅੱਖਰ ${correct} ਤੋਂ ਇੱਕ ਥਾਂ ਅੱਗੇ ਜਾ ਕੇ ${value} ਉੱਤੇ ਰੁਕਦਾ ਹੈ।`);
      break;
    case "STOPPED_ONE_STEP_EARLY":
      reason = text(locale, `stops one alphabet step before ${correct}, at ${value}.`, `सही अक्षर ${correct} से एक स्थान पहले ${value} पर रुकता है।`, `ਸਹੀ ਅੱਖਰ ${correct} ਤੋਂ ਇੱਕ ਥਾਂ ਪਹਿਲਾਂ ${value} ਉੱਤੇ ਰੁਕਦਾ ਹੈ।`);
      break;
    case "STOPPED_TWO_STEPS_LATE":
      reason = text(locale, `moves two alphabet steps beyond ${correct} and reaches ${value}.`, `सही अक्षर ${correct} से दो स्थान आगे जाकर ${value} पर पहुँचता है।`, `ਸਹੀ ਅੱਖਰ ${correct} ਤੋਂ ਦੋ ਥਾਵਾਂ ਅੱਗੇ ਜਾ ਕੇ ${value} ਉੱਤੇ ਪਹੁੰਚਦਾ ਹੈ।`);
      break;
    case "STOPPED_TWO_STEPS_EARLY":
      reason = text(locale, `stops two alphabet steps before ${correct}, at ${value}.`, `सही अक्षर ${correct} से दो स्थान पहले ${value} पर रुकता है।`, `ਸਹੀ ਅੱਖਰ ${correct} ਤੋਂ ਦੋ ਥਾਵਾਂ ਪਹਿਲਾਂ ${value} ਉੱਤੇ ਰੁਕਦਾ ਹੈ।`);
      break;
    case "USED_OPPOSITE_OR_REFERENCE_END":
      reason = text(locale, `switches to the opposite alphabet partner or reference end and obtains ${value}; the requested operation gives ${correct}.`, `विपरीत जोड़ी या उलटे सिरे पर जाकर ${value} लेता है; माँगी गई क्रिया ${correct} देती है।`, `ਉਲਟੀ ਜੋੜੀ ਜਾਂ ਉਲਟੇ ਸਿਰੇ ਉੱਤੇ ਜਾ ਕੇ ${value} ਲੈਂਦਾ ਹੈ; ਮੰਗੀ ਕਿਰਿਆ ${correct} ਦਿੰਦੀ ਹੈ।`);
      break;
    case "RETAINED_SOURCE_LETTER":
      reason = text(locale, `keeps the source letter ${value} unchanged and skips the operation that produces ${correct}.`, `मूल अक्षर ${value} को बिना बदले रखता है और ${correct} देने वाली क्रिया छोड़ देता है।`, `ਮੂਲ ਅੱਖਰ ${value} ਨੂੰ ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ ਅਤੇ ${correct} ਦੇਣ ਵਾਲੀ ਕਿਰਿਆ ਛੱਡ ਦਿੰਦਾ ਹੈ।`);
      break;
    case "USED_OTHER_ENDPOINT":
      reason = text(locale, `selects the other given endpoint ${value} instead of calculating ${correct}.`, `गणना से ${correct} निकालने के बजाय दूसरा दिया सिरा ${value} चुन लेता है।`, `ਗਿਣਤੀ ਨਾਲ ${correct} ਕੱਢਣ ਦੀ ਬਜਾਏ ਦੂਜਾ ਦਿੱਤਾ ਸਿਰਾ ${value} ਚੁਣ ਲੈਂਦਾ ਹੈ।`);
      break;
    case "RETAINED_TARGET_LETTER":
      reason = text(locale, `leaves the target letter ${value} at its old position instead of applying the transformation that gives ${correct}.`, `लक्ष्य अक्षर ${value} को पुराने स्थान पर रखता है, जबकि पुनर्व्यवस्था से ${correct} मिलता है।`, `ਨਿਸ਼ਾਨਾ ਅੱਖਰ ${value} ਨੂੰ ਪੁਰਾਣੀ ਥਾਂ ਉੱਤੇ ਰੱਖਦਾ ਹੈ, ਜਦਕਿ ਮੁੜ-ਵਿਵਸਥਾ ਨਾਲ ${correct} ਮਿਲਦਾ ਹੈ।`);
      break;
    case "REVERSED_PAIR_ORDER":
      reason = text(locale, `contains the right members but reverses the requested order; the correct order is ${correct}.`, `सही मान रखता है, पर माँगा क्रम उलट देता है; सही क्रम ${correct} है।`, `ਸਹੀ ਮੁੱਲ ਰੱਖਦਾ ਹੈ, ਪਰ ਮੰਗਿਆ ਕ੍ਰਮ ਉਲਟ ਦਿੰਦਾ ਹੈ; ਸਹੀ ਕ੍ਰਮ ${correct} ਹੈ।`);
      break;
    case "FIRST_MEMBER_OFF_BY_ONE":
    case "FIRST_COUNT_OFF_BY_ONE":
      reason = text(locale, `changes the first member of the verified pair by one; the correct pair is ${correct}.`, `सत्यापित जोड़ी के पहले मान में एक की त्रुटि करता है; सही जोड़ी ${correct} है।`, `ਪੱਕੀ ਜੋੜੀ ਦੇ ਪਹਿਲੇ ਮੁੱਲ ਵਿੱਚ ਇੱਕ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ; ਸਹੀ ਜੋੜੀ ${correct} ਹੈ।`);
      break;
    case "SECOND_MEMBER_OFF_BY_ONE":
    case "SECOND_COUNT_OFF_BY_ONE":
      reason = text(locale, `changes the second member of the verified pair by one; the correct pair is ${correct}.`, `सत्यापित जोड़ी के दूसरे मान में एक की त्रुटि करता है; सही जोड़ी ${correct} है।`, `ਪੱਕੀ ਜੋੜੀ ਦੇ ਦੂਜੇ ਮੁੱਲ ਵਿੱਚ ਇੱਕ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ; ਸਹੀ ਜੋੜੀ ${correct} ਹੈ।`);
      break;
    case "ASSUMED_NO_UNCHANGED_OCCURRENCE":
      reason = text(locale, `claims that no occurrence stays fixed, but the complete comparison gives ${correct}.`, `मानता है कि कोई अक्षर अपनी जगह पर नहीं रहा, जबकि पूरी तुलना ${correct} देती है।`, `ਮੰਨਦਾ ਹੈ ਕਿ ਕੋਈ ਅੱਖਰ ਆਪਣੀ ਥਾਂ ਉੱਤੇ ਨਹੀਂ ਰਿਹਾ, ਜਦਕਿ ਪੂਰੀ ਤੁਲਨਾ ${correct} ਦਿੰਦੀ ਹੈ।`);
      break;
    case "CHECKED_FIRST_POSITION_ONLY":
      reason = text(locale, `checks only the first position and gives the incomplete set ${value}; the complete result is ${correct}.`, `केवल पहली स्थिति जाँचकर अधूरा समूह ${value} देता है; पूरा परिणाम ${correct} है।`, `ਕੇਵਲ ਪਹਿਲੀ ਥਾਂ ਜਾਂਚ ਕੇ ਅਧੂਰਾ ਸਮੂਹ ${value} ਦਿੰਦਾ ਹੈ; ਪੂਰਾ ਨਤੀਜਾ ${correct} ਹੈ।`);
      break;
    case "CHECKED_LAST_POSITION_ONLY":
      reason = text(locale, `checks only the last position and gives the incomplete set ${value}; the complete result is ${correct}.`, `केवल अंतिम स्थिति जाँचकर अधूरा समूह ${value} देता है; पूरा परिणाम ${correct} है।`, `ਕੇਵਲ ਆਖਰੀ ਥਾਂ ਜਾਂਚ ਕੇ ਅਧੂਰਾ ਸਮੂਹ ${value} ਦਿੰਦਾ ਹੈ; ਪੂਰਾ ਨਤੀਜਾ ${correct} ਹੈ।`);
      break;
    case "PARTIAL_POSITION_COMPARISON":
      reason = text(locale, `stops the comparison early and lists only ${value}; completing every position gives ${correct}.`, `तुलना बीच में रोककर केवल ${value} लिखता है; सभी स्थान जाँचने पर ${correct} मिलता है।`, `ਤੁਲਨਾ ਵਿਚਕਾਰ ਰੋਕ ਕੇ ਕੇਵਲ ${value} ਲਿਖਦਾ ਹੈ; ਸਾਰੀਆਂ ਥਾਵਾਂ ਜਾਂਚਣ ਉੱਤੇ ${correct} ਮਿਲਦਾ ਹੈ।`);
      break;
    case "CHECKED_ALTERNATE_POSITIONS_ONLY":
      reason = text(locale, `checks alternate positions only and misses other unchanged occurrences; the complete set is ${correct}.`, `केवल एक छोड़कर एक स्थान जाँचता है और अन्य अपरिवर्तित अक्षर छोड़ देता है; पूरा समूह ${correct} है।`, `ਕੇਵਲ ਇੱਕ ਛੱਡ ਕੇ ਇੱਕ ਥਾਂ ਜਾਂਚਦਾ ਹੈ ਅਤੇ ਹੋਰ ਨਾ-ਬਦਲੇ ਅੱਖਰ ਛੱਡ ਦਿੰਦਾ ਹੈ; ਪੂਰਾ ਸਮੂਹ ${correct} ਹੈ।`);
      break;
    case "CORRECT_DISTANCE_WRONG_DIRECTION":
      reason = text(locale, `has the correct movement size but the opposite direction; the signed movement is ${correct}.`, `चाल की संख्या सही रखता है, पर दिशा उलट देता है; सही दिशात्मक चाल ${correct} है।`, `ਚਾਲ ਦੀ ਗਿਣਤੀ ਸਹੀ ਰੱਖਦਾ ਹੈ, ਪਰ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ; ਸਹੀ ਦਿਸ਼ਾਵਾਰ ਚਾਲ ${correct} ਹੈ।`);
      break;
    case "DISTANCE_OFF_BY_ONE":
      reason = text(locale, `keeps the direction but miscounts the movement by one; the verified movement is ${correct}.`, `दिशा सही रखता है, पर चाल में एक की त्रुटि करता है; सही चाल ${correct} है।`, `ਦਿਸ਼ਾ ਸਹੀ ਰੱਖਦਾ ਹੈ, ਪਰ ਚਾਲ ਵਿੱਚ ਇੱਕ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ; ਸਹੀ ਚਾਲ ${correct} ਹੈ।`);
      break;
    case "WRONG_DIRECTION_AND_DISTANCE":
      reason = text(locale, `gets both the direction and movement size wrong; the verified movement is ${correct}.`, `दिशा और चाल की संख्या दोनों गलत लेता है; सही चाल ${correct} है।`, `ਦਿਸ਼ਾ ਅਤੇ ਚਾਲ ਦੀ ਗਿਣਤੀ ਦੋਵੇਂ ਗਲਤ ਲੈਂਦਾ ਹੈ; ਸਹੀ ਚਾਲ ${correct} ਹੈ।`);
      break;
    case "PAIR_RELATION_MISMATCH":
      reason = relationReason(ql, data, correct, value, locale);
      break;
    case "POSITION_MISCOUNT":
    case "FALLBACK_RELATION_MISMATCH":
    case "UNCLASSIFIED_DISTRACTOR":
    default:
      reason = text(locale, `does not reproduce the complete worked condition that leads to ${correct}.`, `पूरी हल की गई शर्त को पूरा नहीं करता, जिससे ${correct} मिलता है।`, `ਪੂਰੀ ਹੱਲ ਕੀਤੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ, ਜਿਸ ਨਾਲ ${correct} ਮਿਲਦਾ ਹੈ।`);
      break;
  }

  return { optionIndex, optionValue: value, errorLabel: label, explanation: `${prefix} ${reason}` };
}

export function renderAlpExplanationV2(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  options: readonly AlpOption[],
  correctIndex: number,
  locale: AlpLocale,
): AlpExplanation {
  const base = renderBaseExplanation(ql, data, solved, options, correctIndex, locale);
  const repairedPedagogy = repairGenericPedagogy(base, ql, data, solved, locale);
  const distractorAnalyses = options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ optionIndex }) => optionIndex !== correctIndex)
    .map(({ option, optionIndex }) => labelledTrap(ql, data, solved, option, optionIndex, locale));
  return {
    ...repairedPedagogy,
    distractorAnalyses,
    closestTrapRejection: distractorAnalyses[0]?.explanation ?? repairedPedagogy.closestTrapRejection,
  };
}

export { renderAlpStemV2 };
