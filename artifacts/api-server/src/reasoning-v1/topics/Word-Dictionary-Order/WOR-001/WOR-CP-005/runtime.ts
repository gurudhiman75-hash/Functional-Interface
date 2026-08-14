import { buildLetterOptions, buildWordOptions, correctOptionIndex } from "../foundation/distractors";
import { classifyWorDifficulty } from "../foundation/difficulty";
import { independentlySolveBankingTrace } from "../foundation/banking-independent-solver";
import { buildBankingClusters } from "../foundation/banking-cluster-builder";
import { BANKING_TRANSFORMATIONS, transformBankingTokens } from "../foundation/banking-transformations";
import { adjacentComparisonTrace, sortWorWords } from "../foundation/lexical-comparator";
import { createWorRng } from "../foundation/prng";
import type {
  GeneratedWorQuestion,
  WorBankingAnswerMode,
  WorBankingSide,
  WorBankingTaskKind,
  WorBankingTrace,
  WorBankingTransformation,
  WorDifficulty,
  WorDifficultyFeatures,
  WorLocale,
  WorPrototypeContract,
  WorSortDirection,
} from "../foundation/types";

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function indexFromSide(length: number, rank: number, side: WorBankingSide): number {
  return side === "LEFT" ? rank - 1 : length - rank;
}

function shiftAlphabet(letter: string, offset: number): string {
  const code = letter.charCodeAt(0) + offset;
  if (code < 65 || code > 90) throw new Error(`Alphabet offset ${offset} is invalid for ${letter}.`);
  return String.fromCharCode(code);
}

function selectSupportedDifficulty(contract: WorPrototypeContract, seed: number, requested?: WorDifficulty): WorDifficulty {
  const supported = contract.supportedDifficulties ?? (["EASY", "MEDIUM", "HARD"] as const);
  if (requested) {
    if (!supported.includes(requested)) throw new Error(`${contract.prototypeId} does not support ${requested} difficulty.`);
    return requested;
  }
  return createWorRng(seed, `${contract.prototypeId}:DIFFICULTY`).pick(supported);
}

function chooseSortDirection(rng: ReturnType<typeof createWorRng>): WorSortDirection {
  return rng.next() < 0.5 ? "ASCENDING" : "DESCENDING";
}

function chooseSide(rng: ReturnType<typeof createWorRng>): WorBankingSide {
  return rng.next() < 0.5 ? "LEFT" : "RIGHT";
}

function chooseValidOffset(letter: string, rng: ReturnType<typeof createWorRng>): number {
  const candidates = [-3, -2, -1, 0, 1, 2, 3].filter((offset) => {
    const code = letter.charCodeAt(0) + offset;
    return code >= 65 && code <= 90;
  });
  return rng.pick(candidates);
}

function calculateBankingDifficultyFeatures(
  ascendingTokens: readonly string[],
  taskKind: WorBankingTaskKind,
  transformation: WorBankingTransformation,
  direction: WorSortDirection,
  alphabetOffset = 0,
): WorDifficultyFeatures {
  const traces = adjacentComparisonTrace(ascendingTokens);
  const depths = traces.map((trace) => trace.commonPrefixLength);
  const max = depths.length ? Math.max(...depths) : 0;
  const mean = depths.length ? depths.reduce((sum, value) => sum + value, 0) / depths.length : 0;
  const sharedFirst = depths.filter((depth) => depth >= 1).length;
  const late = depths.filter((depth) => depth >= 2).length;
  const burden: Record<WorBankingTaskKind, number> = {
    BANK_PLAIN_CLUSTER_POSITION: 1,
    BANK_SORT_CONCAT_CHAR: 4,
    BANK_SORT_LOCAL_CHAR: 5,
    BANK_TRANSFORM_SORT_POSITION: 6,
    BANK_TRANSFORM_SORT_LOCAL_CHAR: 7,
  };
  const transformationBurden = transformation === "NONE" ? 0 : transformation === "SORT_LETTERS_ASC" ? 2 : 1;
  const score = Math.max(0, ascendingTokens.length - 4)
    + Math.round(mean)
    + max
    + sharedFirst * 2
    + late * 4
    + burden[taskKind]
    + transformationBurden
    + (direction === "DESCENDING" ? 1 : 0)
    + (alphabetOffset !== 0 ? 1 : 0);
  return {
    wordCount: ascendingTokens.length,
    commonPrefixDepthMax: max,
    commonPrefixDepthMean: Number(mean.toFixed(2)),
    lateDecisionCount: late,
    prefixContainmentCount: 0,
    reverseDirection: direction === "DESCENDING",
    taskInferenceBurden: burden[taskKind] + transformationBurden,
    score,
  };
}

function transformationText(transformation: WorBankingTransformation, locale: WorLocale): string {
  const english: Record<WorBankingTransformation, string> = {
    NONE: "Do not change the letter groups.",
    SWAP_FIRST_SECOND: "Interchange the first and second letters of every group.",
    SWAP_FIRST_LAST: "Interchange the first and last letters of every group.",
    SORT_LETTERS_ASC: "Arrange the letters inside every group in alphabetical order.",
    SHIFT_FIRST_PREVIOUS: "Replace the first letter of every group with the immediately preceding alphabet letter.",
    SHIFT_FIRST_NEXT: "Replace the first letter of every group with the immediately following alphabet letter.",
  };
  const hindi: Record<WorBankingTransformation, string> = {
    NONE: "अक्षर-समूहों में कोई परिवर्तन न करें।",
    SWAP_FIRST_SECOND: "हर समूह के पहले और दूसरे अक्षर की जगह आपस में बदलें।",
    SWAP_FIRST_LAST: "हर समूह के पहले और अंतिम अक्षर की जगह आपस में बदलें।",
    SORT_LETTERS_ASC: "हर समूह के अक्षरों को वर्णक्रम में लगाएँ।",
    SHIFT_FIRST_PREVIOUS: "हर समूह के पहले अक्षर को वर्णमाला के ठीक पिछले अक्षर से बदलें।",
    SHIFT_FIRST_NEXT: "हर समूह के पहले अक्षर को वर्णमाला के ठीक अगले अक्षर से बदलें।",
  };
  const punjabi: Record<WorBankingTransformation, string> = {
    NONE: "ਅੱਖਰ-ਸਮੂਹਾਂ ਵਿੱਚ ਕੋਈ ਤਬਦੀਲੀ ਨਾ ਕਰੋ।",
    SWAP_FIRST_SECOND: "ਹਰ ਸਮੂਹ ਦੇ ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਅੱਖਰ ਦੀ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।",
    SWAP_FIRST_LAST: "ਹਰ ਸਮੂਹ ਦੇ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਅੱਖਰ ਦੀ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।",
    SORT_LETTERS_ASC: "ਹਰ ਸਮੂਹ ਦੇ ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।",
    SHIFT_FIRST_PREVIOUS: "ਹਰ ਸਮੂਹ ਦੇ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਤੁਰੰਤ ਪਿਛਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ।",
    SHIFT_FIRST_NEXT: "ਹਰ ਸਮੂਹ ਦੇ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਤੁਰੰਤ ਅਗਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ।",
  };
  return locale === "hi-IN" ? hindi[transformation] : locale === "pa-IN" ? punjabi[transformation] : english[transformation];
}

function directionText(direction: WorSortDirection, locale: WorLocale): string {
  if (locale === "hi-IN") return direction === "ASCENDING" ? "सामान्य शब्दकोश क्रम" : "उल्टा शब्दकोश क्रम";
  if (locale === "pa-IN") return direction === "ASCENDING" ? "ਸਧਾਰਣ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ" : "ਉਲਟਾ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ";
  return direction === "ASCENDING" ? "normal dictionary order" : "reverse dictionary order";
}

function sideText(side: WorBankingSide, locale: WorLocale): string {
  if (locale === "hi-IN") return side === "LEFT" ? "बाएँ" : "दाएँ";
  if (locale === "pa-IN") return side === "LEFT" ? "ਖੱਬੇ" : "ਸੱਜੇ";
  return side.toLowerCase();
}

function renderBankingStem(trace: WorBankingTrace, locale: WorLocale): string {
  const direction = directionText(trace.sortDirection, locale);
  const transformation = transformationText(trace.transformation, locale);
  if (locale === "hi-IN") {
    switch (trace.taskKind) {
      case "BANK_PLAIN_CLUSTER_POSITION":
        return `पाँच तीन-अक्षरीय समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, locale)} से स्थान ${trace.wordRank} पर कौन-सा समूह होगा?`;
      case "BANK_SORT_CONCAT_CHAR":
        return `पाँच समूहों को ${direction} में लगाकर बिना खाली स्थान के जोड़ दें। बनी हुई अक्षर-श्रृंखला में ${sideText(trace.globalCharacterSide!, locale)} से अक्षर ${trace.globalCharacterIndex} कौन-सा है?`;
      case "BANK_SORT_LOCAL_CHAR": {
        const offset = trace.alphabetOffset ?? 0;
        const offsetText = offset === 0 ? "" : offset > 0 ? ` फिर वर्णमाला में ${offset} स्थान आगे जाएँ।` : ` फिर वर्णमाला में ${Math.abs(offset)} स्थान पीछे जाएँ।`;
        return `पाँच समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, locale)} से स्थान ${trace.wordRank} वाले समूह का ${sideText(trace.characterSide!, locale)} से अक्षर ${trace.characterIndex} लें।${offsetText} अंतिम अक्षर क्या होगा?`;
      }
      case "BANK_TRANSFORM_SORT_POSITION":
        return `${transformation} बने समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, locale)} से स्थान ${trace.wordRank} पर आने वाले ${trace.answerMode === "ORIGINAL" ? "मूल" : "बदले हुए"} समूह को चुनें।`;
      case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
        return `${transformation} बने समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, locale)} से स्थान ${trace.wordRank} वाले बदले हुए समूह का ${sideText(trace.characterSide!, locale)} से अक्षर ${trace.characterIndex} कौन-सा है?`;
    }
  }
  if (locale === "pa-IN") {
    switch (trace.taskKind) {
      case "BANK_PLAIN_CLUSTER_POSITION":
        return `ਪੰਜ ਤਿੰਨ-ਅੱਖਰੀ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.wordRank} ਉੱਤੇ ਕਿਹੜਾ ਸਮੂਹ ਹੋਵੇਗਾ?`;
      case "BANK_SORT_CONCAT_CHAR":
        return `ਪੰਜ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾ ਕੇ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਦੇ ਜੋੜੋ। ਬਣੀ ਅੱਖਰ-ਲੜੀ ਵਿੱਚ ${sideText(trace.globalCharacterSide!, locale)} ਤੋਂ ਅੱਖਰ ${trace.globalCharacterIndex} ਕਿਹੜਾ ਹੈ?`;
      case "BANK_SORT_LOCAL_CHAR": {
        const offset = trace.alphabetOffset ?? 0;
        const offsetText = offset === 0 ? "" : offset > 0 ? ` ਫਿਰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${offset} ਥਾਂ ਅੱਗੇ ਜਾਓ।` : ` ਫਿਰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${Math.abs(offset)} ਥਾਂ ਪਿੱਛੇ ਜਾਓ।`;
        return `ਪੰਜ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.wordRank} ਵਾਲੇ ਸਮੂਹ ਦਾ ${sideText(trace.characterSide!, locale)} ਤੋਂ ਅੱਖਰ ${trace.characterIndex} ਲਓ।${offsetText} ਆਖਰੀ ਅੱਖਰ ਕਿਹੜਾ ਹੋਵੇਗਾ?`;
      }
      case "BANK_TRANSFORM_SORT_POSITION":
        return `${transformation} ਬਣੇ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.wordRank} ਉੱਤੇ ਆਉਣ ਵਾਲਾ ${trace.answerMode === "ORIGINAL" ? "ਮੂਲ" : "ਬਦਲਿਆ ਹੋਇਆ"} ਸਮੂਹ ਚੁਣੋ।`;
      case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
        return `${transformation} ਬਣੇ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.wordRank} ਵਾਲੇ ਬਦਲੇ ਸਮੂਹ ਦਾ ${sideText(trace.characterSide!, locale)} ਤੋਂ ਅੱਖਰ ${trace.characterIndex} ਕਿਹੜਾ ਹੈ?`;
    }
  }

  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `Arrange the five three-letter groups in ${direction}. Which group is at position ${trace.wordRank} from the ${sideText(trace.wordRankSide!, locale)}?`;
    case "BANK_SORT_CONCAT_CHAR":
      return `Arrange the five groups in ${direction} and join them without spaces. Which is character ${trace.globalCharacterIndex} from the ${sideText(trace.globalCharacterSide!, locale)} of the resulting letter string?`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const offsetText = offset === 0 ? "" : offset > 0 ? ` Then move ${offset} places forward in the alphabet.` : ` Then move ${Math.abs(offset)} places backward in the alphabet.`;
      return `Arrange the five groups in ${direction}. Take group ${trace.wordRank} from the ${sideText(trace.wordRankSide!, locale)}, then character ${trace.characterIndex} from its ${sideText(trace.characterSide!, locale)}.${offsetText} What is the final letter?`;
    }
    case "BANK_TRANSFORM_SORT_POSITION":
      return `${transformation} Arrange the resulting groups in ${direction}. Select the ${trace.answerMode === "ORIGINAL" ? "original" : "transformed"} group corresponding to position ${trace.wordRank} from the ${sideText(trace.wordRankSide!, locale)}.`;
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${transformation} Arrange the resulting groups in ${direction}. From group ${trace.wordRank} from the ${sideText(trace.wordRankSide!, locale)}, which is character ${trace.characterIndex} from the ${sideText(trace.characterSide!, locale)}?`;
  }
}

function renderBankingExplanation(trace: WorBankingTrace, answer: string, locale: WorLocale): string {
  const mapping = trace.originalTokens.map((token, index) => `${token}→${trace.transformedTokens[index]}`).join(", ");
  const ordered = trace.orderedTokens.join(" → ");
  if (locale === "hi-IN") {
    const start = "शब्दकोश क्रम में तुलना बाएँ से दाएँ पहले अलग अक्षर पर की जाती है।";
    const transform = trace.transformation === "NONE" ? "" : ` परिवर्तन के बाद: ${mapping}।`;
    if (trace.taskKind === "BANK_SORT_CONCAT_CHAR") return `${start}${transform} क्रम है ${ordered}। बिना खाली स्थान जोड़ने पर ${trace.concatenated} मिलता है। ${sideText(trace.globalCharacterSide!, locale)} से स्थान ${trace.globalCharacterIndex} पर ${answer} है।`;
    if (trace.taskKind === "BANK_PLAIN_CLUSTER_POSITION") return `${start} सही क्रम है ${ordered}। ${sideText(trace.wordRankSide!, locale)} से स्थान ${trace.wordRank} पर ${answer} आता है।`;
    if (trace.taskKind === "BANK_SORT_LOCAL_CHAR") {
      const wordIndex = indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
      const selected = trace.orderedTokens[wordIndex]!;
      const charIndex = indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!);
      const base = selected[charIndex]!;
      return `${start} क्रम है ${ordered}। चुना गया समूह ${selected} है और मांगा गया अक्षर ${base} है। वर्णमाला परिवर्तन ${trace.alphabetOffset ?? 0} लगाने पर उत्तर ${answer} मिलता है।`;
    }
    if (trace.taskKind === "BANK_TRANSFORM_SORT_POSITION") return `${start}${transform} बदले समूहों का क्रम ${ordered} है। मांगे गए स्थान पर ${trace.answerMode === "ORIGINAL" ? "संबंधित मूल समूह" : "बदला समूह"} ${answer} है।`;
    return `${start}${transform} बदले समूहों का क्रम ${ordered} है। मांगे गए स्थान और अक्षर को पढ़ने पर ${answer} मिलता है।`;
  }
  if (locale === "pa-IN") {
    const start = "ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਤੁਲਨਾ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪਹਿਲੇ ਵੱਖਰੇ ਅੱਖਰ ਉੱਤੇ ਹੁੰਦੀ ਹੈ।";
    const transform = trace.transformation === "NONE" ? "" : ` ਤਬਦੀਲੀ ਤੋਂ ਬਾਅਦ: ${mapping}।`;
    if (trace.taskKind === "BANK_SORT_CONCAT_CHAR") return `${start}${transform} ਕ੍ਰਮ ${ordered} ਹੈ। ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਜੋੜਨ ਉੱਤੇ ${trace.concatenated} ਮਿਲਦਾ ਹੈ। ${sideText(trace.globalCharacterSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.globalCharacterIndex} ਉੱਤੇ ${answer} ਹੈ।`;
    if (trace.taskKind === "BANK_PLAIN_CLUSTER_POSITION") return `${start} ਸਹੀ ਕ੍ਰਮ ${ordered} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ਸਥਾਨ ${trace.wordRank} ਉੱਤੇ ${answer} ਆਉਂਦਾ ਹੈ।`;
    if (trace.taskKind === "BANK_SORT_LOCAL_CHAR") {
      const wordIndex = indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
      const selected = trace.orderedTokens[wordIndex]!;
      const charIndex = indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!);
      const base = selected[charIndex]!;
      return `${start} ਕ੍ਰਮ ${ordered} ਹੈ। ਚੁਣਿਆ ਸਮੂਹ ${selected} ਹੈ ਅਤੇ ਮੰਗਿਆ ਅੱਖਰ ${base} ਹੈ। ਵਰਣਮਾਲਾ ਤਬਦੀਲੀ ${trace.alphabetOffset ?? 0} ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`;
    }
    if (trace.taskKind === "BANK_TRANSFORM_SORT_POSITION") return `${start}${transform} ਬਦਲੇ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ${ordered} ਹੈ। ਮੰਗੇ ਸਥਾਨ ਉੱਤੇ ${trace.answerMode === "ORIGINAL" ? "ਸੰਬੰਧਤ ਮੂਲ ਸਮੂਹ" : "ਬਦਲਿਆ ਸਮੂਹ"} ${answer} ਹੈ।`;
    return `${start}${transform} ਬਦਲੇ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ${ordered} ਹੈ। ਮੰਗੇ ਸਥਾਨ ਅਤੇ ਅੱਖਰ ਨੂੰ ਪੜ੍ਹਨ ਉੱਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`;
  }

  const start = "For dictionary order, compare groups from left to right and use the first differing letter.";
  const transform = trace.transformation === "NONE" ? "" : ` After the stated transformation: ${mapping}.`;
  if (trace.taskKind === "BANK_SORT_CONCAT_CHAR") return `${start}${transform} The order is ${ordered}. Joining without spaces gives ${trace.concatenated}. Character ${trace.globalCharacterIndex} from the ${trace.globalCharacterSide!.toLowerCase()} is ${answer}.`;
  if (trace.taskKind === "BANK_PLAIN_CLUSTER_POSITION") return `${start} The correct order is ${ordered}. Position ${trace.wordRank} from the ${trace.wordRankSide!.toLowerCase()} is ${answer}.`;
  if (trace.taskKind === "BANK_SORT_LOCAL_CHAR") {
    const wordIndex = indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
    const selected = trace.orderedTokens[wordIndex]!;
    const charIndex = indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!);
    const base = selected[charIndex]!;
    return `${start} The order is ${ordered}. The selected group is ${selected}; the requested character is ${base}. Applying the alphabet offset ${trace.alphabetOffset ?? 0} gives ${answer}.`;
  }
  if (trace.taskKind === "BANK_TRANSFORM_SORT_POSITION") return `${start}${transform} The transformed order is ${ordered}. At the requested position, the ${trace.answerMode === "ORIGINAL" ? "corresponding original group" : "transformed group"} is ${answer}.`;
  return `${start}${transform} The transformed order is ${ordered}. Reading the requested group and character gives ${answer}.`;
}

function generatorAnswer(trace: WorBankingTrace): string {
  if (trace.taskKind === "BANK_PLAIN_CLUSTER_POSITION") {
    const index = indexFromSide(trace.orderedSourceTokens.length, trace.wordRank!, trace.wordRankSide!);
    return trace.orderedSourceTokens[index]!;
  }
  if (trace.taskKind === "BANK_SORT_CONCAT_CHAR") {
    const index = indexFromSide(trace.concatenated!.length, trace.globalCharacterIndex!, trace.globalCharacterSide!);
    return trace.concatenated![index]!;
  }
  if (trace.taskKind === "BANK_SORT_LOCAL_CHAR" || trace.taskKind === "BANK_TRANSFORM_SORT_LOCAL_CHAR") {
    const wordIndex = indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
    const selected = trace.orderedTokens[wordIndex]!;
    const charIndex = indexFromSide(selected.length, trace.characterIndex!, trace.characterSide!);
    return shiftAlphabet(selected[charIndex]!, trace.alphabetOffset ?? 0);
  }
  const index = indexFromSide(trace.orderedTokens.length, trace.wordRank!, trace.wordRankSide!);
  return trace.answerMode === "ORIGINAL" ? trace.orderedSourceTokens[index]! : trace.orderedTokens[index]!;
}

function validateBankingQuestion(question: GeneratedWorQuestion, trace: WorBankingTrace): void {
  if (question.options.length !== 5) throw new Error(`${question.prototypeId} must render five Banking options.`);
  if (new Set(question.options.map((option) => option.value)).size !== 5) throw new Error(`${question.prototypeId} rendered duplicate Banking options.`);
  if (question.options.filter((option) => option.misconceptionId === null).length !== 1) throw new Error(`${question.prototypeId} must contain one marked Banking answer.`);
  if (question.options[question.correctIndex]?.value !== question.answer) throw new Error(`${question.prototypeId} Banking answer/index mismatch.`);
  if (question.metadata.optionCount !== 5 || question.metadata.objectMode !== "LETTER_CLUSTER") throw new Error(`${question.prototypeId} lost Banking format metadata.`);
  if (trace.originalTokens.length !== 5 || new Set(trace.originalTokens).size !== 5 || trace.originalTokens.some((token) => !/^[A-Z]{3}$/.test(token))) throw new Error(`${question.prototypeId} has an invalid cluster set.`);
  if (new Set(trace.transformedTokens).size !== 5) throw new Error(`${question.prototypeId} produced duplicate transformed clusters.`);
  const independent = independentlySolveBankingTrace(trace);
  if (!sameOrder(independent.transformedTokens, trace.transformedTokens)) throw new Error(`${question.prototypeId} transformation verifier disagreement.`);
  if (!sameOrder(independent.orderedTokens, trace.orderedTokens)) throw new Error(`${question.prototypeId} ordering verifier disagreement.`);
  if (independent.answer !== question.answer) throw new Error(`${question.prototypeId} independent Banking answer disagreement.`);
  if (question.difficulty !== classifyWorDifficulty(question.metadata.difficultyFeatures)) throw new Error(`${question.prototypeId} Banking difficulty is not state-derived.`);
  if (/\{\{|\}\}|undefined|null|WOR-PROT|WOR-CP/.test(`${question.stem} ${question.explanation}`)) throw new Error(`${question.prototypeId} leaked unresolved/internal Banking text.`);
}

function buildTraceAttempt(contract: WorPrototypeContract, generationSeed: number, targetDifficulty: WorDifficulty): { trace: WorBankingTrace; difficultyFeatures: WorDifficultyFeatures } {
  const rng = createWorRng(generationSeed, `${contract.prototypeId}:BANKING`);
  const originalTokens = buildBankingClusters(targetDifficulty, rng);
  const taskKind = contract.taskKind as WorBankingTaskKind;
  const transformation: WorBankingTransformation = taskKind === "BANK_TRANSFORM_SORT_POSITION" || taskKind === "BANK_TRANSFORM_SORT_LOCAL_CHAR"
    ? rng.pick(BANKING_TRANSFORMATIONS)
    : "NONE";
  const transformedTokens = transformBankingTokens(originalTokens, transformation);
  if (new Set(transformedTokens).size !== transformedTokens.length) throw new Error("Retry duplicate transformed clusters.");
  const transformedToSource = new Map(transformedTokens.map((token, index) => [token, originalTokens[index]!]));
  const ascending = sortWorWords(transformedTokens);
  const sortDirection = chooseSortDirection(rng);
  const orderedTokens = sortDirection === "ASCENDING" ? ascending : [...ascending].reverse();
  const orderedSourceTokens = orderedTokens.map((token) => transformedToSource.get(token)!);
  const wordRank = rng.int(2, 4);
  const wordRankSide = chooseSide(rng);
  let characterIndex: number | undefined;
  let characterSide: WorBankingSide | undefined;
  let alphabetOffset = 0;
  let globalCharacterIndex: number | undefined;
  let globalCharacterSide: WorBankingSide | undefined;
  let concatenated: string | undefined;
  let answerMode: WorBankingAnswerMode | undefined;

  if (taskKind === "BANK_SORT_CONCAT_CHAR") {
    concatenated = orderedTokens.join("");
    globalCharacterIndex = rng.int(4, 12);
    globalCharacterSide = chooseSide(rng);
  } else if (taskKind === "BANK_SORT_LOCAL_CHAR" || taskKind === "BANK_TRANSFORM_SORT_LOCAL_CHAR") {
    characterIndex = rng.int(1, 3);
    characterSide = chooseSide(rng);
    if (taskKind === "BANK_SORT_LOCAL_CHAR") {
      const selected = orderedTokens[indexFromSide(orderedTokens.length, wordRank, wordRankSide)]!;
      const base = selected[indexFromSide(selected.length, characterIndex, characterSide)]!;
      alphabetOffset = chooseValidOffset(base, rng);
    }
  } else if (taskKind === "BANK_TRANSFORM_SORT_POSITION") {
    answerMode = rng.next() < 0.5 ? "ORIGINAL" : "TRANSFORMED";
  }

  const trace: WorBankingTrace = {
    taskKind,
    originalTokens,
    transformedTokens,
    orderedTokens,
    orderedSourceTokens,
    transformation,
    sortDirection,
    ...(taskKind !== "BANK_SORT_CONCAT_CHAR" ? { wordRank, wordRankSide } : {}),
    ...(characterIndex ? { characterIndex, characterSide, alphabetOffset } : {}),
    ...(globalCharacterIndex ? { globalCharacterIndex, globalCharacterSide, concatenated } : {}),
    ...(answerMode ? { answerMode } : {}),
  };
  const difficultyFeatures = calculateBankingDifficultyFeatures(ascending, taskKind, transformation, sortDirection, alphabetOffset);
  return { trace, difficultyFeatures };
}

export function generateWorCp005Question(
  contract: WorPrototypeContract,
  seed: number,
  locale: WorLocale,
  requestedDifficulty?: WorDifficulty,
): GeneratedWorQuestion {
  if (contract.checkpointId !== "WOR-CP-005") throw new Error(`${contract.prototypeId} is not a WOR-CP-005 contract.`);
  const targetDifficulty = selectSupportedDifficulty(contract, seed, requestedDifficulty);
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const generationSeed = seed + attempt * 6151;
    try {
      const { trace, difficultyFeatures } = buildTraceAttempt(contract, generationSeed, targetDifficulty);
      const difficulty = classifyWorDifficulty(difficultyFeatures);
      if (difficulty !== targetDifficulty) continue;
      const answer = generatorAnswer(trace);
      const optionCount = contract.optionCount ?? 5;
      const options = contract.answerType === "LETTER"
        ? buildLetterOptions(answer, generationSeed, optionCount)
        : buildWordOptions(
            answer,
            trace.taskKind === "BANK_TRANSFORM_SORT_POSITION" && trace.answerMode === "TRANSFORMED" ? trace.transformedTokens : trace.originalTokens,
            generationSeed,
            optionCount,
          );
      const correctIndex = correctOptionIndex(options);
      const comparisonTrace = adjacentComparisonTrace(sortWorWords(trace.transformedTokens));
      const question: GeneratedWorQuestion = {
        chapterId: "WOR-001",
        checkpointId: "WOR-CP-005",
        prototypeId: contract.prototypeId,
        permanentQlId: null,
        lifecycleStatus: "REVIEW_ONLY",
        questionStudioVisible: false,
        locale,
        seed,
        difficulty,
        renderer: "STRUCTURED_TEXT",
        taskKind: trace.taskKind,
        stem: renderBankingStem(trace, locale),
        structuredPrompt: {
          words: trace.originalTokens,
          ...(trace.transformation !== "NONE" ? { transformedWords: trace.transformedTokens } : {}),
        },
        options,
        correctIndex,
        answer,
        explanation: renderBankingExplanation(trace, answer, locale),
        metadata: {
          runtimeVersion: "WOR-001-RUNTIME-V2-BANKING",
          localeMode: "TRANSLATABLE",
          sortDirection: trace.sortDirection,
          wordCount: 5,
          sourceFamilyId: `BANK-CLUSTER-${targetDifficulty}`,
          independentSolverVerified: true,
          ambiguityAudit: "LEXICALLY_UNIQUE",
          difficultyFeatures,
          canonicalOrder: sortWorWords(trace.transformedTokens),
          comparisonTrace,
          allocationDecision: contract.allocationDecision,
          sourceEvidenceStatus: contract.sourceEvidenceStatus,
          optionCount: 5,
          objectMode: "LETTER_CLUSTER",
          bankingTrace: trace,
        },
      };
      validateBankingQuestion(question, trace);
      return question;
    } catch (error) {
      if (error instanceof Error && /Retry duplicate transformed clusters/.test(error.message)) continue;
      throw error;
    }
  }
  throw new Error(`${contract.prototypeId} could not construct a structurally ${targetDifficulty} Banking state for seed ${seed}.`);
}
