import type { GeneratedWorQuestion, WorBankingSide, WorBankingTrace, WorBankingTransformation, WorLocale } from "./foundation/types";

function ordinalEn(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function ordinalHi(value: number): string {
  const values: Record<number, string> = {
    1: "पहला", 2: "दूसरा", 3: "तीसरा", 4: "चौथा", 5: "पाँचवाँ", 6: "छठा",
    7: "सातवाँ", 8: "आठवाँ", 9: "नौवाँ", 10: "दसवाँ", 11: "ग्यारहवाँ", 12: "बारहवाँ",
  };
  return values[value] ?? `${value}वाँ`;
}

function ordinalHiOblique(value: number): string {
  const values: Record<number, string> = {
    1: "पहले", 2: "दूसरे", 3: "तीसरे", 4: "चौथे", 5: "पाँचवें", 6: "छठे",
    7: "सातवें", 8: "आठवें", 9: "नौवें", 10: "दसवें", 11: "ग्यारहवें", 12: "बारहवें",
  };
  return values[value] ?? `${value}वें`;
}

function ordinalPa(value: number): string {
  const values: Record<number, string> = {
    1: "ਪਹਿਲਾ", 2: "ਦੂਜਾ", 3: "ਤੀਜਾ", 4: "ਚੌਥਾ", 5: "ਪੰਜਵਾਂ", 6: "ਛੇਵਾਂ",
    7: "ਸੱਤਵਾਂ", 8: "ਅੱਠਵਾਂ", 9: "ਨੌਵਾਂ", 10: "ਦਸਵਾਂ", 11: "ਗਿਆਰਵਾਂ", 12: "ਬਾਰ੍ਹਵਾਂ",
  };
  return values[value] ?? `${value}ਵਾਂ`;
}

function ordinalPaOblique(value: number): string {
  const values: Record<number, string> = {
    1: "ਪਹਿਲੇ", 2: "ਦੂਜੇ", 3: "ਤੀਜੇ", 4: "ਚੌਥੇ", 5: "ਪੰਜਵੇਂ", 6: "ਛੇਵੇਂ",
    7: "ਸੱਤਵੇਂ", 8: "ਅੱਠਵੇਂ", 9: "ਨੌਵੇਂ", 10: "ਦਸਵੇਂ", 11: "ਗਿਆਰਵੇਂ", 12: "ਬਾਰ੍ਹਵੇਂ",
  };
  return values[value] ?? `${value}ਵੇਂ`;
}

function indexFromSide(length: number, rank: number, side: WorBankingSide): number {
  return side === "LEFT" ? rank - 1 : length - rank;
}

function sideText(side: WorBankingSide, locale: WorLocale): string {
  if (locale === "hi-IN") return side === "LEFT" ? "बाएँ" : "दाएँ";
  if (locale === "pa-IN") return side === "LEFT" ? "ਖੱਬੇ" : "ਸੱਜੇ";
  return side.toLowerCase();
}

function directionText(trace: WorBankingTrace, locale: WorLocale): string {
  if (locale === "hi-IN") return trace.sortDirection === "ASCENDING" ? "सामान्य शब्दकोश क्रम" : "उल्टे शब्दकोश क्रम";
  if (locale === "pa-IN") return trace.sortDirection === "ASCENDING" ? "ਸਧਾਰਣ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ" : "ਉਲਟ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ";
  return trace.sortDirection === "ASCENDING" ? "normal dictionary order" : "reverse dictionary order";
}

function transformationText(transformation: WorBankingTransformation, locale: WorLocale): string {
  const english: Record<WorBankingTransformation, string> = {
    NONE: "Do not change the letter groups.",
    SWAP_FIRST_SECOND: "Interchange the first and second letters of every group.",
    SWAP_FIRST_LAST: "Interchange the first and last letters of every group.",
    SORT_LETTERS_ASC: "Arrange the letters within each group in alphabetical order.",
    SHIFT_FIRST_PREVIOUS: "Replace the first letter of every group with the immediately preceding letter of the alphabet.",
    SHIFT_FIRST_NEXT: "Replace the first letter of every group with the immediately following letter of the alphabet.",
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

function movementInstruction(offset: number, locale: WorLocale): string {
  const count = Math.abs(offset);
  if (locale === "hi-IN") return `फिर वर्णमाला में ${count} स्थान ${offset > 0 ? "आगे" : "पीछे"} जाएँ।`;
  if (locale === "pa-IN") return `ਫਿਰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${count} ਥਾਂ ${offset > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"} ਜਾਓ।`;
  return `Then move ${count} ${count === 1 ? "place" : "places"} ${offset > 0 ? "forward" : "backward"} in the alphabet.`;
}

function movementExplanation(base: string, answer: string, offset: number, locale: WorLocale): string {
  const count = Math.abs(offset);
  if (locale === "hi-IN") return `${base} से वर्णमाला में ${count} स्थान ${offset > 0 ? "आगे" : "पीछे"} जाने पर ${answer} मिलता है।`;
  if (locale === "pa-IN") return `${base} ਤੋਂ ਵਰਣਮਾਲਾ ਵਿੱਚ ${count} ਥਾਂ ${offset > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"} ਜਾਣ 'ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`;
  return `Moving ${count} ${count === 1 ? "place" : "places"} ${offset > 0 ? "forward" : "backward"} from ${base} in the alphabet gives ${answer}.`;
}

function renderEnglishStem(trace: WorBankingTrace): string {
  const direction = directionText(trace, "en-IN");
  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `Arrange the five three-letter groups in ${direction}. Which group is ${ordinalEn(trace.wordRank!)} from the ${sideText(trace.wordRankSide!, "en-IN")}?`;
    case "BANK_SORT_CONCAT_CHAR":
      return `Arrange the five groups in ${direction} and join them without spaces. Which letter is ${ordinalEn(trace.globalCharacterIndex!)} from the ${sideText(trace.globalCharacterSide!, "en-IN")} in the resulting string?`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const movement = offset === 0 ? "" : ` ${movementInstruction(offset, "en-IN")}`;
      return `Arrange the five groups in ${direction}. Take the ${ordinalEn(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!, "en-IN")} and the ${ordinalEn(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!, "en-IN")} within that group.${movement} What is the final letter?`;
    }
    case "BANK_TRANSFORM_SORT_POSITION": {
      const query = trace.answerMode === "ORIGINAL"
        ? `Which original group corresponds to the ${ordinalEn(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!, "en-IN")}?`
        : `Which transformed group is ${ordinalEn(trace.wordRank!)} from the ${sideText(trace.wordRankSide!, "en-IN")}?`;
      return `${transformationText(trace.transformation, "en-IN")} Arrange the resulting groups in ${direction}. ${query}`;
    }
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${transformationText(trace.transformation, "en-IN")} Arrange the resulting groups in ${direction}. In the ${ordinalEn(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!, "en-IN")}, which letter is ${ordinalEn(trace.characterIndex!)} from the ${sideText(trace.characterSide!, "en-IN")}?`;
  }
}

function renderHindiStem(trace: WorBankingTrace): string {
  const direction = directionText(trace, "hi-IN");
  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `पाँच तीन-अक्षरीय समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, "hi-IN")} से ${ordinalHi(trace.wordRank!)} समूह कौन-सा होगा?`;
    case "BANK_SORT_CONCAT_CHAR":
      return `पाँच समूहों को ${direction} में लगाकर बिना खाली स्थान के जोड़ें। बनी अक्षर-श्रृंखला में ${sideText(trace.globalCharacterSide!, "hi-IN")} से ${ordinalHi(trace.globalCharacterIndex!)} अक्षर कौन-सा है?`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const movement = offset === 0 ? "" : ` ${movementInstruction(offset, "hi-IN")}`;
      return `पाँच समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, "hi-IN")} से ${ordinalHi(trace.wordRank!)} समूह लें और उसमें ${sideText(trace.characterSide!, "hi-IN")} से ${ordinalHi(trace.characterIndex!)} अक्षर लें।${movement} अंतिम अक्षर क्या होगा?`;
    }
    case "BANK_TRANSFORM_SORT_POSITION": {
      const query = trace.answerMode === "ORIGINAL"
        ? `${sideText(trace.wordRankSide!, "hi-IN")} से ${ordinalHiOblique(trace.wordRank!)} स्थान पर आने वाले बदले हुए समूह से संबंधित मूल समूह कौन-सा है?`
        : `${sideText(trace.wordRankSide!, "hi-IN")} से ${ordinalHi(trace.wordRank!)} बदला हुआ समूह कौन-सा है?`;
      return `${transformationText(trace.transformation, "hi-IN")} बने समूहों को ${direction} में लगाएँ। ${query}`;
    }
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${transformationText(trace.transformation, "hi-IN")} बने समूहों को ${direction} में लगाएँ। ${sideText(trace.wordRankSide!, "hi-IN")} से ${ordinalHi(trace.wordRank!)} बदले हुए समूह में ${sideText(trace.characterSide!, "hi-IN")} से ${ordinalHi(trace.characterIndex!)} अक्षर कौन-सा है?`;
  }
}

function renderPunjabiStem(trace: WorBankingTrace): string {
  const direction = directionText(trace, "pa-IN");
  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `ਪੰਜ ਤਿੰਨ-ਅੱਖਰੀ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਸਮੂਹ ਕਿਹੜਾ ਹੋਵੇਗਾ?`;
    case "BANK_SORT_CONCAT_CHAR":
      return `ਪੰਜ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾ ਕੇ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਦੇ ਜੋੜੋ। ਬਣੀ ਅੱਖਰ-ਲੜੀ ਵਿੱਚ ${sideText(trace.globalCharacterSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.globalCharacterIndex!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const movement = offset === 0 ? "" : ` ${movementInstruction(offset, "pa-IN")}`;
      return `ਪੰਜ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਸਮੂਹ ਲਓ ਅਤੇ ਉਸ ਵਿੱਚ ${sideText(trace.characterSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.characterIndex!)} ਅੱਖਰ ਲਓ।${movement} ਆਖਰੀ ਅੱਖਰ ਕਿਹੜਾ ਹੋਵੇਗਾ?`;
    }
    case "BANK_TRANSFORM_SORT_POSITION": {
      const query = trace.answerMode === "ORIGINAL"
        ? `${sideText(trace.wordRankSide!, "pa-IN")} ਤੋਂ ${ordinalPaOblique(trace.wordRank!)} ਸਥਾਨ ਉੱਤੇ ਆਉਣ ਵਾਲੇ ਬਦਲੇ ਹੋਏ ਸਮੂਹ ਨਾਲ ਸੰਬੰਧਤ ਮੂਲ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`
        : `${sideText(trace.wordRankSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਬਦਲਿਆ ਹੋਇਆ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`;
      return `${transformationText(trace.transformation, "pa-IN")} ਬਣੇ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${query}`;
    }
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${transformationText(trace.transformation, "pa-IN")} ਬਣੇ ਸਮੂਹਾਂ ਨੂੰ ${direction} ਵਿੱਚ ਲਗਾਓ। ${sideText(trace.wordRankSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਬਦਲੇ ਹੋਏ ਸਮੂਹ ਵਿੱਚ ${sideText(trace.characterSide!, "pa-IN")} ਤੋਂ ${ordinalPa(trace.characterIndex!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`;
  }
}

function renderExplanation(trace: WorBankingTrace, answer: string, locale: WorLocale): string {
  const order = trace.orderedTokens.join(" → ");
  const mapping = trace.originalTokens.map((token, index) => `${token}→${trace.transformedTokens[index]}`).join(", ");
  const selectedWord = trace.wordRank && trace.wordRankSide
    ? trace.orderedTokens[indexFromSide(trace.orderedTokens.length, trace.wordRank, trace.wordRankSide)]
    : undefined;
  const selectedLetter = selectedWord && trace.characterIndex && trace.characterSide
    ? selectedWord[indexFromSide(selectedWord.length, trace.characterIndex, trace.characterSide)]
    : undefined;

  if (locale === "hi-IN") {
    const rule = "शब्दकोश क्रम के लिए समूहों की तुलना बाएँ से दाएँ करें; पहला अलग अक्षर क्रम तय करता है।";
    const transform = trace.transformation === "NONE" ? "" : ` दिए गए परिवर्तन के बाद: ${mapping}।`;
    switch (trace.taskKind) {
      case "BANK_PLAIN_CLUSTER_POSITION":
        return `${rule} सही क्रम ${order} है। ${sideText(trace.wordRankSide!, locale)} से ${ordinalHi(trace.wordRank!)} समूह ${answer} है।`;
      case "BANK_SORT_CONCAT_CHAR":
        return `${rule} क्रम ${order} है। समूहों को बिना खाली स्थान के जोड़ने पर ${trace.concatenated} मिलता है। ${sideText(trace.globalCharacterSide!, locale)} से ${ordinalHi(trace.globalCharacterIndex!)} अक्षर ${answer} है।`;
      case "BANK_SORT_LOCAL_CHAR": {
        const offset = trace.alphabetOffset ?? 0;
        const finalStep = offset === 0 ? `इसलिए उत्तर ${answer} है।` : movementExplanation(selectedLetter!, answer, offset, locale);
        return `${rule} क्रम ${order} है। ${sideText(trace.wordRankSide!, locale)} से ${ordinalHi(trace.wordRank!)} समूह ${selectedWord} है। उसमें ${sideText(trace.characterSide!, locale)} से ${ordinalHi(trace.characterIndex!)} अक्षर ${selectedLetter} है। ${finalStep}`;
      }
      case "BANK_TRANSFORM_SORT_POSITION":
        return trace.answerMode === "ORIGINAL"
          ? `${rule}${transform} बदले हुए समूहों का क्रम ${order} है। ${sideText(trace.wordRankSide!, locale)} से ${ordinalHiOblique(trace.wordRank!)} स्थान पर आने वाले बदले हुए समूह से संबंधित मूल समूह ${answer} है।`
          : `${rule}${transform} बदले हुए समूहों का क्रम ${order} है। ${sideText(trace.wordRankSide!, locale)} से ${ordinalHi(trace.wordRank!)} बदला हुआ समूह ${answer} है।`;
      case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
        return `${rule}${transform} बदले हुए समूहों का क्रम ${order} है। ${sideText(trace.wordRankSide!, locale)} से ${ordinalHi(trace.wordRank!)} समूह ${selectedWord} है और उसमें ${sideText(trace.characterSide!, locale)} से ${ordinalHi(trace.characterIndex!)} अक्षर ${selectedLetter} है। इसलिए उत्तर ${answer} है।`;
    }
  }

  if (locale === "pa-IN") {
    const rule = "ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਲਈ ਸਮੂਹਾਂ ਦੀ ਤੁਲਨਾ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕਰੋ; ਪਹਿਲਾ ਵੱਖਰਾ ਅੱਖਰ ਕ੍ਰਮ ਤੈਅ ਕਰਦਾ ਹੈ।";
    const transform = trace.transformation === "NONE" ? "" : ` ਦਿੱਤੀ ਤਬਦੀਲੀ ਤੋਂ ਬਾਅਦ: ${mapping}।`;
    switch (trace.taskKind) {
      case "BANK_PLAIN_CLUSTER_POSITION":
        return `${rule} ਸਹੀ ਕ੍ਰਮ ${order} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਸਮੂਹ ${answer} ਹੈ।`;
      case "BANK_SORT_CONCAT_CHAR":
        return `${rule} ਕ੍ਰਮ ${order} ਹੈ। ਸਮੂਹਾਂ ਨੂੰ ਬਿਨਾਂ ਖਾਲੀ ਥਾਂ ਦੇ ਜੋੜਨ ਉੱਤੇ ${trace.concatenated} ਮਿਲਦਾ ਹੈ। ${sideText(trace.globalCharacterSide!, locale)} ਤੋਂ ${ordinalPa(trace.globalCharacterIndex!)} ਅੱਖਰ ${answer} ਹੈ।`;
      case "BANK_SORT_LOCAL_CHAR": {
        const offset = trace.alphabetOffset ?? 0;
        const finalStep = offset === 0 ? `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।` : movementExplanation(selectedLetter!, answer, offset, locale);
        return `${rule} ਕ੍ਰਮ ${order} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਸਮੂਹ ${selectedWord} ਹੈ। ਉਸ ਵਿੱਚ ${sideText(trace.characterSide!, locale)} ਤੋਂ ${ordinalPa(trace.characterIndex!)} ਅੱਖਰ ${selectedLetter} ਹੈ। ${finalStep}`;
      }
      case "BANK_TRANSFORM_SORT_POSITION":
        return trace.answerMode === "ORIGINAL"
          ? `${rule}${transform} ਬਦਲੇ ਹੋਏ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ${order} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ${ordinalPaOblique(trace.wordRank!)} ਸਥਾਨ ਉੱਤੇ ਆਉਣ ਵਾਲੇ ਬਦਲੇ ਹੋਏ ਸਮੂਹ ਨਾਲ ਸੰਬੰਧਤ ਮੂਲ ਸਮੂਹ ${answer} ਹੈ।`
          : `${rule}${transform} ਬਦਲੇ ਹੋਏ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ${order} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਬਦਲਿਆ ਹੋਇਆ ਸਮੂਹ ${answer} ਹੈ।`;
      case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
        return `${rule}${transform} ਬਦਲੇ ਹੋਏ ਸਮੂਹਾਂ ਦਾ ਕ੍ਰਮ ${order} ਹੈ। ${sideText(trace.wordRankSide!, locale)} ਤੋਂ ${ordinalPa(trace.wordRank!)} ਸਮੂਹ ${selectedWord} ਹੈ ਅਤੇ ਉਸ ਵਿੱਚ ${sideText(trace.characterSide!, locale)} ਤੋਂ ${ordinalPa(trace.characterIndex!)} ਅੱਖਰ ${selectedLetter} ਹੈ। ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`;
    }
  }

  const rule = "For dictionary order, compare groups from left to right and use the first differing letter.";
  const transform = trace.transformation === "NONE" ? "" : ` After the stated transformation: ${mapping}.`;
  switch (trace.taskKind) {
    case "BANK_PLAIN_CLUSTER_POSITION":
      return `${rule} The correct order is ${order}. The ${ordinalEn(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!, locale)} is ${answer}.`;
    case "BANK_SORT_CONCAT_CHAR":
      return `${rule} The order is ${order}. Joining the groups without spaces gives ${trace.concatenated}. The ${ordinalEn(trace.globalCharacterIndex!)} letter from the ${sideText(trace.globalCharacterSide!, locale)} is ${answer}.`;
    case "BANK_SORT_LOCAL_CHAR": {
      const offset = trace.alphabetOffset ?? 0;
      const finalStep = offset === 0 ? `Therefore, the answer is ${answer}.` : movementExplanation(selectedLetter!, answer, offset, locale);
      return `${rule} The order is ${order}. The ${ordinalEn(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!, locale)} is ${selectedWord}. Its ${ordinalEn(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!, locale)} is ${selectedLetter}. ${finalStep}`;
    }
    case "BANK_TRANSFORM_SORT_POSITION":
      return trace.answerMode === "ORIGINAL"
        ? `${rule}${transform} The transformed order is ${order}. The ${ordinalEn(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!, locale)} corresponds to the original group ${answer}.`
        : `${rule}${transform} The transformed order is ${order}. The ${ordinalEn(trace.wordRank!)} transformed group from the ${sideText(trace.wordRankSide!, locale)} is ${answer}.`;
    case "BANK_TRANSFORM_SORT_LOCAL_CHAR":
      return `${rule}${transform} The transformed order is ${order}. The ${ordinalEn(trace.wordRank!)} group from the ${sideText(trace.wordRankSide!, locale)} is ${selectedWord}; its ${ordinalEn(trace.characterIndex!)} letter from the ${sideText(trace.characterSide!, locale)} is ${selectedLetter}. Therefore, the answer is ${answer}.`;
  }
}

function renderStem(trace: WorBankingTrace, locale: WorLocale): string {
  if (locale === "hi-IN") return renderHindiStem(trace);
  if (locale === "pa-IN") return renderPunjabiStem(trace);
  return renderEnglishStem(trace);
}

export function toWorStudentFacingQuestion(question: GeneratedWorQuestion): GeneratedWorQuestion {
  const structuredPrompt = { ...question.structuredPrompt };
  delete structuredPrompt.transformedWords;

  if (!question.metadata.bankingTrace) return { ...question, structuredPrompt };

  return {
    ...question,
    structuredPrompt,
    stem: renderStem(question.metadata.bankingTrace, question.locale),
    explanation: renderExplanation(question.metadata.bankingTrace, question.answer, question.locale),
  };
}
