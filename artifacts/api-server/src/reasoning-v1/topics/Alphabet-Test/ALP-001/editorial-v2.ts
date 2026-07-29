import {
  ALPHABET,
  boundedShift,
  cyclicShift,
  exclusiveGap,
  inclusiveSpan,
  leftRank,
  letterAtLeftRank,
  letterAtRightRank,
  midpointLetters,
  oppositeLetter,
  positionDistance,
  rightRank,
  VOWELS,
} from "./foundation/alphabet";
import { applyAlphabetTransform } from "./foundation/sequence";
import {
  applyWordTransformRefs,
  findOccurrencePosition,
  occurrenceRefs,
  refsToWord,
  unchangedRefs,
} from "./foundation/word";
import type {
  AlpDistractorAnalysis,
  AlpExplanation,
  AlpInstanceData,
  AlpLocale,
  AlpOption,
  AlpQuestionLogic,
  AlpSolverResult,
  AlpWordTransformId,
} from "./types";

function text(locale: AlpLocale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

function side(locale: AlpLocale, direction: "LEFT" | "RIGHT"): string {
  return text(
    locale,
    direction === "LEFT" ? "left" : "right",
    direction === "LEFT" ? "बाईं ओर" : "दाईं ओर",
    direction === "LEFT" ? "ਖੱਬੇ ਪਾਸੇ" : "ਸੱਜੇ ਪਾਸੇ",
  );
}

function enOrdinal(value: number): string {
  const suffix = value % 100 >= 11 && value % 100 <= 13
    ? "th"
    : value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th";
  return `${value}${suffix}`;
}

function letterOrdinal(locale: AlpLocale, value: number): string {
  return text(locale, enOrdinal(value), `${value}वाँ`, `${value}ਵਾਂ`);
}

function positionLabel(locale: AlpLocale, value: number): string {
  return text(locale, `position ${value}`, `स्थान संख्या ${value}`, `ਥਾਂ ਨੰਬਰ ${value}`);
}

function occurrenceWords(locale: AlpLocale, occurrence: number): string {
  const en = occurrence === 1 ? "first" : occurrence === 2 ? "second" : occurrence === 3 ? "third" : `${occurrence}th`;
  const hi = occurrence === 1 ? "पहली" : occurrence === 2 ? "दूसरी" : occurrence === 3 ? "तीसरी" : `${occurrence}वीं`;
  const pa = occurrence === 1 ? "ਪਹਿਲੀ" : occurrence === 2 ? "ਦੂਜੀ" : occurrence === 3 ? "ਤੀਜੀ" : `${occurrence}ਵੀਂ`;
  return text(locale, en, hi, pa);
}

function occurrencePhrase(locale: AlpLocale, data: AlpInstanceData): string {
  const ref = data.occurrenceRef!;
  return text(
    locale,
    `the ${occurrenceWords(locale, ref.occurrence)} occurrence of ${ref.letter}`,
    `अक्षर ${ref.letter} की ${occurrenceWords(locale, ref.occurrence)} उपस्थिति`,
    `ਅੱਖਰ ${ref.letter} ਦੀ ${occurrenceWords(locale, ref.occurrence)} ਵਾਰ ਆਮਦ`,
  );
}

function alphabetTransform(locale: AlpLocale, data: AlpInstanceData): string {
  const start = data.rotationStart;
  const en: Record<string, string> = {
    REVERSE_ALL: "write the complete English alphabet in reverse order",
    REVERSE_FIRST_HALF: "reverse A–M while keeping N–Z unchanged",
    REVERSE_SECOND_HALF: "keep A–M unchanged and reverse N–Z",
    REVERSE_BOTH_HALVES: "reverse A–M and N–Z separately",
    SWAP_HALVES: "write N–Z before A–M",
    ROTATE_TO_START: `begin with ${start} and continue cyclically through the alphabet`,
    ODD_THEN_EVEN: "write the letters from original odd positions first, followed by those from even positions",
    EVEN_THEN_ODD: "write the letters from original even positions first, followed by those from odd positions",
    ALTERNATE_LEFT_RIGHT: "take letters alternately from the left and right ends, beginning at the left end",
    ALTERNATE_RIGHT_LEFT: "take letters alternately from the right and left ends, beginning at the right end",
    REMOVE_VOWELS: "remove A, E, I, O and U",
    REMOVE_CONSONANTS: "retain only A, E, I, O and U",
    SWAP_ADJACENT_PAIRS: "interchange each adjacent pair of letters",
    REVERSE_BLOCKS_OF_THREE: "reverse every consecutive block of three letters",
  };
  const hi: Record<string, string> = {
    REVERSE_ALL: "पूरी अंग्रेज़ी वर्णमाला को उलटे क्रम में लिखें",
    REVERSE_FIRST_HALF: "A–M को उलटें और N–Z को उसी क्रम में रखें",
    REVERSE_SECOND_HALF: "A–M को उसी क्रम में रखें और N–Z को उलटें",
    REVERSE_BOTH_HALVES: "A–M और N–Z को अलग-अलग उलटें",
    SWAP_HALVES: "N–Z को A–M से पहले लिखें",
    ROTATE_TO_START: `${start} से शुरू करके वर्णमाला को चक्रीय क्रम में आगे बढ़ाएँ`,
    ODD_THEN_EVEN: "मूल विषम स्थानों के अक्षर पहले और सम स्थानों के अक्षर बाद में लिखें",
    EVEN_THEN_ODD: "मूल सम स्थानों के अक्षर पहले और विषम स्थानों के अक्षर बाद में लिखें",
    ALTERNATE_LEFT_RIGHT: "बाएँ और दाएँ सिरों से बारी-बारी अक्षर लें और शुरुआत बाएँ सिरे से करें",
    ALTERNATE_RIGHT_LEFT: "दाएँ और बाएँ सिरों से बारी-बारी अक्षर लें और शुरुआत दाएँ सिरे से करें",
    REMOVE_VOWELS: "A, E, I, O और U को हटा दें",
    REMOVE_CONSONANTS: "केवल A, E, I, O और U को रखें",
    SWAP_ADJACENT_PAIRS: "हर साथ-साथ वाले अक्षर-युग्म को आपस में बदलें",
    REVERSE_BLOCKS_OF_THREE: "हर लगातार तीन अक्षरों के समूह को उलटें",
  };
  const pa: Record<string, string> = {
    REVERSE_ALL: "ਪੂਰੀ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ",
    REVERSE_FIRST_HALF: "A–M ਨੂੰ ਉਲਟੋ ਅਤੇ N–Z ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ",
    REVERSE_SECOND_HALF: "A–M ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ ਅਤੇ N–Z ਨੂੰ ਉਲਟੋ",
    REVERSE_BOTH_HALVES: "A–M ਅਤੇ N–Z ਨੂੰ ਵੱਖ-ਵੱਖ ਉਲਟੋ",
    SWAP_HALVES: "N–Z ਨੂੰ A–M ਤੋਂ ਪਹਿਲਾਂ ਲਿਖੋ",
    ROTATE_TO_START: `${start} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਵਰਣਮਾਲਾ ਨੂੰ ਚੱਕਰੀ ਕ੍ਰਮ ਵਿੱਚ ਅੱਗੇ ਲੈ ਜਾਓ`,
    ODD_THEN_EVEN: "ਮੂਲ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਪਹਿਲਾਂ ਅਤੇ ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਬਾਅਦ ਵਿੱਚ ਲਿਖੋ",
    EVEN_THEN_ODD: "ਮੂਲ ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਪਹਿਲਾਂ ਅਤੇ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਬਾਅਦ ਵਿੱਚ ਲਿਖੋ",
    ALTERNATE_LEFT_RIGHT: "ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਸਿਰਿਆਂ ਤੋਂ ਵਾਰੀ-ਵਾਰੀ ਅੱਖਰ ਲਵੋ ਅਤੇ ਸ਼ੁਰੂਆਤ ਖੱਬੇ ਸਿਰੇ ਤੋਂ ਕਰੋ",
    ALTERNATE_RIGHT_LEFT: "ਸੱਜੇ ਅਤੇ ਖੱਬੇ ਸਿਰਿਆਂ ਤੋਂ ਵਾਰੀ-ਵਾਰੀ ਅੱਖਰ ਲਵੋ ਅਤੇ ਸ਼ੁਰੂਆਤ ਸੱਜੇ ਸਿਰੇ ਤੋਂ ਕਰੋ",
    REMOVE_VOWELS: "A, E, I, O ਅਤੇ U ਨੂੰ ਹਟਾ ਦਿਓ",
    REMOVE_CONSONANTS: "ਕੇਵਲ A, E, I, O ਅਤੇ U ਨੂੰ ਰੱਖੋ",
    SWAP_ADJACENT_PAIRS: "ਹਰ ਨਾਲ-ਨਾਲ ਦੇ ਅੱਖਰਾਂ ਦੀ ਜੋੜੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ",
    REVERSE_BLOCKS_OF_THREE: "ਹਰ ਲਗਾਤਾਰ ਤਿੰਨ ਅੱਖਰਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਉਲਟੋ",
  };
  const table = locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
  return table[data.transformId!]!;
}

function wordTransform(locale: AlpLocale, id: AlpWordTransformId, data: AlpInstanceData): string {
  const en: Record<AlpWordTransformId, string> = {
    REVERSE: "write the word in reverse order",
    ASC_SORT: "arrange its letters in alphabetical order",
    DESC_SORT: "arrange its letters in reverse alphabetical order",
    VOWELS_FIRST: "place the vowels first and the consonants afterwards, preserving the original order within both groups",
    CONSONANTS_FIRST: "place the consonants first and the vowels afterwards, preserving the original order within both groups",
    ODD_THEN_EVEN: "write the odd-position letters first and the even-position letters afterwards",
    EVEN_THEN_ODD: "write the even-position letters first and the odd-position letters afterwards",
    SWAP_ADJACENT: "interchange every adjacent pair of letters",
    REVERSE_RANGE: `reverse only the letters from ${enOrdinal(data.rangeStart!)} to ${enOrdinal(data.rangeEnd!)} positions`,
  };
  const hi: Record<AlpWordTransformId, string> = {
    REVERSE: "शब्द को उलटे क्रम में लिखें",
    ASC_SORT: "अक्षरों को वर्णक्रम में लगाएँ",
    DESC_SORT: "अक्षरों को उलटे वर्णक्रम में लगाएँ",
    VOWELS_FIRST: "स्वरों को पहले और व्यंजनों को बाद में रखें तथा दोनों समूहों का मूल क्रम बनाए रखें",
    CONSONANTS_FIRST: "व्यंजनों को पहले और स्वरों को बाद में रखें तथा दोनों समूहों का मूल क्रम बनाए रखें",
    ODD_THEN_EVEN: "विषम स्थानों के अक्षर पहले और सम स्थानों के अक्षर बाद में लिखें",
    EVEN_THEN_ODD: "सम स्थानों के अक्षर पहले और विषम स्थानों के अक्षर बाद में लिखें",
    SWAP_ADJACENT: "हर साथ-साथ वाले अक्षर-युग्म को आपस में बदलें",
    REVERSE_RANGE: `केवल स्थान संख्या ${data.rangeStart} से ${data.rangeEnd} तक के अक्षरों को उलटें`,
  };
  const pa: Record<AlpWordTransformId, string> = {
    REVERSE: "ਸ਼ਬਦ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ",
    ASC_SORT: "ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ",
    DESC_SORT: "ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ",
    VOWELS_FIRST: "ਸਵਰ ਪਹਿਲਾਂ ਅਤੇ ਵਿਅੰਜਨ ਬਾਅਦ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਮੂਲ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ",
    CONSONANTS_FIRST: "ਵਿਅੰਜਨ ਪਹਿਲਾਂ ਅਤੇ ਸਵਰ ਬਾਅਦ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਮੂਲ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖੋ",
    ODD_THEN_EVEN: "ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਪਹਿਲਾਂ ਅਤੇ ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਬਾਅਦ ਵਿੱਚ ਲਿਖੋ",
    EVEN_THEN_ODD: "ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਪਹਿਲਾਂ ਅਤੇ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਬਾਅਦ ਵਿੱਚ ਲਿਖੋ",
    SWAP_ADJACENT: "ਹਰ ਨਾਲ-ਨਾਲ ਦੇ ਅੱਖਰਾਂ ਦੀ ਜੋੜੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ",
    REVERSE_RANGE: `ਕੇਵਲ ਥਾਂ ਨੰਬਰ ${data.rangeStart} ਤੋਂ ${data.rangeEnd} ਤੱਕ ਦੇ ਅੱਖਰਾਂ ਨੂੰ ਉਲਟੋ`,
  };
  return locale === "en-IN" ? en[id] : locale === "hi-IN" ? hi[id] : pa[id];
}

export function renderAlpStemV2(ql: AlpQuestionLogic, d: AlpInstanceData, l: AlpLocale): string {
  const mode = ql.solveMode;
  if (ql.checkpointId === "ALP-CP-001") {
    switch (mode) {
      case "LETTER_AT_LEFT_RANK":
        return text(l, `Which letter occupies the ${letterOrdinal(l, d.rank!)} position from the left end in standard English alphabetical order?`, `मानक अंग्रेज़ी वर्णमाला में बाईं ओर से ${letterOrdinal(l, d.rank!)} अक्षर कौन-सा है?`, `ਮਿਆਰੀ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${letterOrdinal(l, d.rank!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
      case "LETTER_AT_RIGHT_RANK":
        return text(l, `Which letter occupies the ${letterOrdinal(l, d.rank!)} position from the right end in standard English alphabetical order?`, `मानक अंग्रेज़ी वर्णमाला में दाईं ओर से ${letterOrdinal(l, d.rank!)} अक्षर कौन-सा है?`, `ਮਿਆਰੀ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ${letterOrdinal(l, d.rank!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
      case "LEFT_RANK_OF_LETTER":
      case "RIGHT_RANK_OF_LETTER": {
        const direction = mode.startsWith("LEFT") ? "LEFT" : "RIGHT";
        return text(l, `What is the position of the letter ${d.letter} from the ${side(l, direction)} end of the English alphabet?`, `अंग्रेज़ी वर्णमाला में अक्षर ${d.letter} का स्थान ${side(l, direction)} से क्या है?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਅੱਖਰ ${d.letter} ਦੀ ਥਾਂ ${side(l, direction)} ਤੋਂ ਕਿਹੜੀ ਹੈ?`);
      }
      case "RIGHT_RANK_FROM_LEFT_RANK":
      case "LEFT_RANK_FROM_RIGHT_RANK": {
        const from: "LEFT" | "RIGHT" = mode.startsWith("RIGHT") ? "LEFT" : "RIGHT";
        const to: "LEFT" | "RIGHT" = from === "LEFT" ? "RIGHT" : "LEFT";
        return text(l, `A letter is ${letterOrdinal(l, d.rank!)} from the ${side(l, from)} end. What is its position from the ${side(l, to)} end?`, `कोई अक्षर ${side(l, from)} से ${letterOrdinal(l, d.rank!)} है। ${side(l, to)} से उसका स्थान क्या होगा?`, `ਕੋਈ ਅੱਖਰ ${side(l, from)} ਤੋਂ ${letterOrdinal(l, d.rank!)} ਹੈ। ${side(l, to)} ਤੋਂ ਉਸ ਦੀ ਥਾਂ ਕੀ ਹੋਵੇਗੀ?`);
      }
      case "OPPOSITE_OF_LETTER":
        return text(l, `Which letter forms an opposite alphabet pair with ${d.letter}?`, `अक्षर ${d.letter} के साथ विपरीत वर्णमाला-जोड़ी कौन-सा अक्षर बनाता है?`, `ਅੱਖਰ ${d.letter} ਨਾਲ ਉਲਟੀ ਵਰਣਮਾਲਾ-ਜੋੜੀ ਕਿਹੜਾ ਅੱਖਰ ਬਣਾਉਂਦਾ ਹੈ?`);
      case "OPPOSITE_OF_LEFT_RANK":
      case "OPPOSITE_OF_RIGHT_RANK": {
        const direction: "LEFT" | "RIGHT" = mode.includes("LEFT") ? "LEFT" : "RIGHT";
        return text(l, `Find the opposite-pair letter of the letter that is ${letterOrdinal(l, d.rank!)} from the ${side(l, direction)} end.`, `${side(l, direction)} से ${letterOrdinal(l, d.rank!)} अक्षर का विपरीत-जोड़ी वाला अक्षर ज्ञात कीजिए।`, `${side(l, direction)} ਤੋਂ ${letterOrdinal(l, d.rank!)} ਅੱਖਰ ਨਾਲ ਉਲਟੀ ਜੋੜੀ ਬਣਾਉਣ ਵਾਲਾ ਅੱਖਰ ਲੱਭੋ।`);
      }
      case "BOTH_RANKS_OF_LETTER":
        return text(l, `What are the positions of ${d.letter} from the left and right ends, respectively?`, `अक्षर ${d.letter} के बाईं और दाईं ओर से स्थान क्रमशः क्या हैं?`, `ਅੱਖਰ ${d.letter} ਦੀਆਂ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਥਾਵਾਂ ਕ੍ਰਮਵਾਰ ਕੀ ਹਨ?`);
      case "IDENTIFY_LETTER_FROM_RANK_PAIR":
        return text(l, `Which letter is ${letterOrdinal(l, d.rank!)} from the left and ${letterOrdinal(l, d.secondRank!)} from the right?`, `कौन-सा अक्षर बाईं ओर से ${letterOrdinal(l, d.rank!)} और दाईं ओर से ${letterOrdinal(l, d.secondRank!)} है?`, `ਕਿਹੜਾ ਅੱਖਰ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${letterOrdinal(l, d.rank!)} ਅਤੇ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ${letterOrdinal(l, d.secondRank!)} ਹੈ?`);
      case "IDENTIFY_OPPOSITE_PAIR":
        return text(l, "Which option contains a correct pair of opposite English-alphabet letters?", "किस विकल्प में अंग्रेज़ी वर्णमाला के विपरीत अक्षरों की सही जोड़ी है?", "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਅੱਖਰਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਹੈ?");
      default:
        break;
    }
  }

  if (ql.checkpointId === "ALP-CP-002") {
    if (mode.startsWith("SHIFT_") && mode.includes("FROM_") && d.rank !== undefined) {
      const reference: "LEFT" | "RIGHT" = mode.includes("FROM_LEFT") ? "LEFT" : "RIGHT";
      return text(l, `Begin at the letter ${letterOrdinal(l, d.rank)} from the ${side(l, reference)} end and move ${d.offset} places to the ${side(l, d.direction!)}. Which letter is reached?`, `${side(l, reference)} से ${letterOrdinal(l, d.rank)} अक्षर से शुरू करके ${side(l, d.direction!)} ${d.offset} स्थान चलें। कौन-सा अक्षर मिलेगा?`, `${side(l, reference)} ਤੋਂ ${letterOrdinal(l, d.rank)} ਅੱਖਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਓ। ਕਿਹੜਾ ਅੱਖਰ ਮਿਲੇਗਾ?`);
    }
    if (mode === "SHIFT_RIGHT_FROM_LETTER_BOUNDED" || mode === "SHIFT_LEFT_FROM_LETTER_BOUNDED") {
      return text(l, `Which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${d.letter} in the English alphabet?`, `अंग्रेज़ी वर्णमाला में ${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    }
    if (mode.startsWith("RECOVER_ANCHOR")) {
      const cyclic = mode.includes("CYCLIC");
      return text(l, `Moving ${d.offset} places to the ${side(l, d.direction!)} reaches ${d.targetLetter}. What was the starting letter${cyclic ? " if the alphabet is treated cyclically" : ""}?`, `${side(l, d.direction!)} ${d.offset} स्थान चलने पर ${d.targetLetter} मिलता है। प्रारंभिक अक्षर क्या था${cyclic ? " यदि वर्णमाला को चक्रीय माना जाए" : ""}?`, `${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਣ ਉੱਤੇ ${d.targetLetter} ਮਿਲਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ ਕਿਹੜਾ ਸੀ${cyclic ? " ਜੇ ਵਰਣਮਾਲਾ ਨੂੰ ਚੱਕਰੀ ਮੰਨਿਆ ਜਾਵੇ" : ""}?`);
    }
    if (mode === "FIND_FORWARD_OFFSET" || mode === "FIND_BACKWARD_OFFSET") {
      return text(l, `How many places must one move to the ${side(l, d.direction!)} from ${d.letter} to reach ${d.targetLetter}?`, `${d.letter} से ${d.targetLetter} तक पहुँचने के लिए ${side(l, d.direction!)} कितने स्थान चलना होगा?`, `${d.letter} ਤੋਂ ${d.targetLetter} ਤੱਕ ਪਹੁੰਚਣ ਲਈ ${side(l, d.direction!)} ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਜਾਣਾ ਪਵੇਗਾ?`);
    }
    if (mode === "FIND_SIGNED_DIRECTION_AND_OFFSET") {
      return text(l, `State both the direction and the number of places from ${d.letter} to ${d.targetLetter}.`, `${d.letter} से ${d.targetLetter} तक की दिशा और स्थानों की संख्या दोनों बताइए।`, `${d.letter} ਤੋਂ ${d.targetLetter} ਤੱਕ ਦੀ ਦਿਸ਼ਾ ਅਤੇ ਥਾਵਾਂ ਦੀ ਗਿਣਤੀ ਦੋਵੇਂ ਦੱਸੋ।`);
    }
    if (mode === "TWO_STAGE_RIGHT_THEN_LEFT" || mode === "TWO_STAGE_LEFT_THEN_RIGHT") {
      const first = d.direction!;
      const second: "LEFT" | "RIGHT" = first === "RIGHT" ? "LEFT" : "RIGHT";
      return text(l, `Starting from ${d.letter}, move ${d.offset} places to the ${side(l, first)} and then ${d.secondOffset} places to the ${side(l, second)}. Which letter is reached?`, `${d.letter} से शुरू करके पहले ${side(l, first)} ${d.offset} स्थान और फिर ${side(l, second)} ${d.secondOffset} स्थान चलें। कौन-सा अक्षर मिलेगा?`, `${d.letter} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਪਹਿਲਾਂ ${side(l, first)} ${d.offset} ਥਾਵਾਂ ਅਤੇ ਫਿਰ ${side(l, second)} ${d.secondOffset} ਥਾਵਾਂ ਜਾਓ। ਕਿਹੜਾ ਅੱਖਰ ਮਿਲੇਗਾ?`);
    }
    if (mode.startsWith("POSITION_AFTER_SHIFT")) {
      const reference: "LEFT" | "RIGHT" = mode.endsWith("LEFT") ? "LEFT" : "RIGHT";
      return text(l, `Move ${d.offset} places to the ${side(l, d.direction!)} from ${d.letter}. What is the reached letter's position from the ${side(l, reference)} end?`, `${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान चलें। प्राप्त अक्षर का स्थान ${side(l, reference)} से क्या है?`, `${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਓ। ਮਿਲੇ ਅੱਖਰ ਦੀ ਥਾਂ ${side(l, reference)} ਤੋਂ ਕੀ ਹੈ?`);
    }
    if (mode.startsWith("CYCLIC_SHIFT")) {
      return text(l, `Treating the alphabet cyclically, which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${d.letter}?`, `वर्णमाला को चक्रीय मानते हुए ${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `ਵਰਣਮਾਲਾ ਨੂੰ ਚੱਕਰੀ ਮੰਨਦੇ ਹੋਏ ${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    }
  }

  if (ql.checkpointId === "ALP-CP-003") {
    switch (mode) {
      case "EXCLUSIVE_GAP": return text(l, `How many letters lie strictly between ${d.letter} and ${d.secondLetter} in the English alphabet?`, `अंग्रेज़ी वर्णमाला में ${d.letter} और ${d.secondLetter} के बीच कितने अक्षर हैं?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?`);
      case "INCLUSIVE_SPAN": return text(l, `How many alphabet positions are covered from ${d.letter} to ${d.secondLetter}, including both letters?`, `${d.letter} से ${d.secondLetter} तक दोनों अक्षरों सहित कुल कितने वर्णमाला-स्थान हैं?`, `${d.letter} ਤੋਂ ${d.secondLetter} ਤੱਕ ਦੋਵੇਂ ਅੱਖਰਾਂ ਸਮੇਤ ਕੁੱਲ ਕਿੰਨੀਆਂ ਵਰਣਮਾਲਾ ਥਾਵਾਂ ਹਨ?`);
      case "ABSOLUTE_POSITION_DISTANCE": return text(l, `What is the positional distance between ${d.letter} and ${d.secondLetter} in the English alphabet?`, `अंग्रेज़ी वर्णमाला में ${d.letter} और ${d.secondLetter} के स्थानों का अंतर क्या है?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ${d.letter} ਅਤੇ ${d.secondLetter} ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਫਰਕ ਕਿੰਨਾ ਹੈ?`);
      case "MIDPOINT_SINGLE": return text(l, `Which letter lies exactly midway between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के ठीक मध्य में कौन-सा अक्षर आता है?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਬਿਲਕੁਲ ਵਿਚਕਾਰ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`);
      case "MIDPOINT_PAIR": return text(l, `Which two letters occupy the middle positions between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के बीच के दो मध्य अक्षर कौन-से हैं?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਵਿਚਕਾਰਲੇ ਦੋ ਮੱਧਲੇ ਅੱਖਰ ਕਿਹੜੇ ਹਨ?`);
      case "IDENTIFY_PAIR_WITH_GAP": return text(l, `Which option has exactly ${d.rank} letters between the two given letters?`, `किस विकल्प के दोनों अक्षरों के बीच ठीक ${d.rank} अक्षर हैं?`, `ਕਿਹੜੇ ਵਿਕਲਪ ਦੇ ਦੋਵੇਂ ਅੱਖਰਾਂ ਵਿਚਕਾਰ ਠੀਕ ${d.rank} ਅੱਖਰ ਹਨ?`);
      case "IDENTIFY_PAIR_WITH_DISTANCE": return text(l, `Which option has a positional distance of ${d.rank} between its two letters?`, `किस विकल्प के दोनों अक्षरों के स्थानों का अंतर ${d.rank} है?`, `ਕਿਹੜੇ ਵਿਕਲਪ ਦੇ ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਫਰਕ ${d.rank} ਹੈ?`);
      case "RECOVER_RIGHT_ENDPOINT_FROM_GAP":
      case "RECOVER_LEFT_ENDPOINT_FROM_GAP": return text(l, `Another letter lies to the ${side(l, d.direction!)} of ${d.letter}, with exactly ${d.rank} letters between them. Which letter is it?`, `${d.letter} के ${side(l, d.direction!)} एक अक्षर है और दोनों के बीच ठीक ${d.rank} अक्षर हैं। वह अक्षर कौन-सा है?`, `${d.letter} ਦੇ ${side(l, d.direction!)} ਇੱਕ ਅੱਖਰ ਹੈ ਅਤੇ ਦੋਵਾਂ ਵਿਚਕਾਰ ਠੀਕ ${d.rank} ਅੱਖਰ ਹਨ। ਉਹ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
      case "RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION": return text(l, `Which letter is ${d.rank} alphabet positions to the ${side(l, d.direction!)} of ${d.letter}?`, `${d.letter} से ${side(l, d.direction!)} ${d.rank} वर्णमाला-स्थान पर कौन-सा अक्षर है?`, `${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.rank} ਵਰਣਮਾਲਾ ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
      case "MIDPOINT_DISTANCE_FROM_ENDPOINTS": return text(l, `The middle letter of ${d.letter} and ${d.secondLetter} is how many positions away from either endpoint?`, `${d.letter} और ${d.secondLetter} का मध्य अक्षर किसी भी सिरे से कितने स्थान दूर है?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦਾ ਮੱਧਲਾ ਅੱਖਰ ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਦੂਰ ਹੈ?`);
      case "RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE": return text(l, `${d.midpoint} is the middle letter. Which letters lie ${d.rank} positions away on its two sides?`, `${d.midpoint} मध्य अक्षर है। उसके दोनों ओर ${d.rank} स्थान दूर कौन-से अक्षर हैं?`, `${d.midpoint} ਮੱਧਲਾ ਅੱਖਰ ਹੈ। ਇਸ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ${d.rank} ਥਾਵਾਂ ਦੂਰ ਕਿਹੜੇ ਅੱਖਰ ਹਨ?`);
      case "COMPARE_TWO_GAPS": return text(l, `By how many does the number of intervening letters in ${d.pairA![0]}:${d.pairA![1]} differ from that in ${d.pairB![0]}:${d.pairB![1]}?`, `${d.pairA![0]}:${d.pairA![1]} और ${d.pairB![0]}:${d.pairB![1]} के बीच आने वाले अक्षरों की संख्याओं में कितना अंतर है?`, `${d.pairA![0]}:${d.pairA![1]} ਅਤੇ ${d.pairB![0]}:${d.pairB![1]} ਵਿਚਕਾਰ ਆਉਣ ਵਾਲੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਕਿੰਨਾ ਫਰਕ ਹੈ?`);
      case "COUNT_LETTERS_OUTSIDE_INTERVAL": return text(l, `How many letters lie outside the interval from ${d.letter} to ${d.secondLetter}, when both endpoints are included in the interval?`, `${d.letter} से ${d.secondLetter} तक दोनों सिरों को शामिल करने पर इस भाग के बाहर कितने अक्षर बचते हैं?`, `${d.letter} ਤੋਂ ${d.secondLetter} ਤੱਕ ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ ਉੱਤੇ ਇਸ ਹਿੱਸੇ ਤੋਂ ਬਾਹਰ ਕਿੰਨੇ ਅੱਖਰ ਬਚਦੇ ਹਨ?`);
      case "COUNT_LETTERS_BEFORE_AND_AFTER": return text(l, `For ${d.letter} and ${d.secondLetter}, give the number of letters before the earlier letter and after the later letter, respectively.`, `${d.letter} और ${d.secondLetter} में पहले आने वाले अक्षर से पहले तथा बाद में आने वाले अक्षर के बाद के अक्षरों की संख्या क्रमशः बताइए।`, `${d.letter} ਅਤੇ ${d.secondLetter} ਵਿੱਚ ਪਹਿਲਾਂ ਆਉਣ ਵਾਲੇ ਅੱਖਰ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਆਉਣ ਵਾਲੇ ਅੱਖਰ ਤੋਂ ਬਾਅਦ ਦੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਕ੍ਰਮਵਾਰ ਦੱਸੋ।`);
      case "EQUAL_SIDE_GAP": return text(l, `How many letters lie strictly between the midpoint and either endpoint of ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के मध्य अक्षर तथा किसी भी सिरे के बीच कितने अक्षर हैं?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਮੱਧਲੇ ਅੱਖਰ ਅਤੇ ਕਿਸੇ ਵੀ ਸਿਰੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?`);
      default:
        break;
    }
  }

  if (ql.checkpointId === "ALP-CP-004") {
    if (mode === "LETTER_AT_TRANSFORMED_POSITION") {
      return text(l, `If the English alphabet is rearranged by the following rule—${alphabetTransform(l, d)}—which letter will occupy ${positionLabel(l, d.position!)} from the left?`, `यदि अंग्रेज़ी वर्णमाला को इस नियम से पुनर्व्यवस्थित किया जाए—${alphabetTransform(l, d)}—तो बाईं ओर से ${positionLabel(l, d.position!)} पर कौन-सा अक्षर होगा?`, `ਜੇ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਨੂੰ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ਮੁੜ ਲਗਾਇਆ ਜਾਵੇ—${alphabetTransform(l, d)}—ਤਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${positionLabel(l, d.position!)} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    }
    return text(l, `If the English alphabet is rearranged by the following rule—${alphabetTransform(l, d)}—what will be the new position of ${d.targetLetter} from the left?`, `यदि अंग्रेज़ी वर्णमाला को इस नियम से पुनर्व्यवस्थित किया जाए—${alphabetTransform(l, d)}—तो ${d.targetLetter} का नया स्थान बाईं ओर से क्या होगा?`, `ਜੇ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਨੂੰ ਇਸ ਨਿਯਮ ਅਨੁਸਾਰ ਮੁੜ ਲਗਾਇਆ ਜਾਵੇ—${alphabetTransform(l, d)}—ਤਾਂ ${d.targetLetter} ਦੀ ਨਵੀਂ ਥਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਕੀ ਹੋਵੇਗੀ?`);
  }

  if (ql.checkpointId === "ALP-CP-005") {
    if (mode === "WORD_LETTER_FROM_LEFT" || mode === "WORD_LETTER_FROM_RIGHT") {
      const direction: "LEFT" | "RIGHT" = mode.endsWith("LEFT") ? "LEFT" : "RIGHT";
      return text(l, `Which letter is ${letterOrdinal(l, d.position!)} from the ${side(l, direction)} end of the word ${d.word}?`, `शब्द ${d.word} में ${side(l, direction)} से ${letterOrdinal(l, d.position!)} अक्षर कौन-सा है?`, `ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${side(l, direction)} ਤੋਂ ${letterOrdinal(l, d.position!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
    }
    if (mode === "WORD_LEFT_POSITION_OF_LETTER" || mode === "WORD_RIGHT_POSITION_OF_LETTER") {
      const direction: "LEFT" | "RIGHT" = mode.includes("LEFT") ? "LEFT" : "RIGHT";
      return text(l, `In the word ${d.word}, what is the position of ${occurrencePhrase(l, d)} from the ${side(l, direction)} end?`, `शब्द ${d.word} में ${occurrencePhrase(l, d)} का स्थान ${side(l, direction)} से क्या है?`, `ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${occurrencePhrase(l, d)} ਦੀ ਥਾਂ ${side(l, direction)} ਤੋਂ ਕੀ ਹੈ?`);
    }
    if (mode === "WORD_RELATIVE_RIGHT" || mode === "WORD_RELATIVE_LEFT") {
      return text(l, `In the word ${d.word}, which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${occurrencePhrase(l, d)}?`, `शब्द ${d.word} में ${occurrencePhrase(l, d)} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${occurrencePhrase(l, d)} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    }
    if (mode === "WORD_MIDDLE_SINGLE") return text(l, `Which letter occupies the middle position in the word ${d.word}?`, `शब्द ${d.word} के मध्य स्थान पर कौन-सा अक्षर है?`, `ਸ਼ਬਦ ${d.word} ਦੀ ਮੱਧਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    if (mode === "WORD_MIDDLE_PAIR") return text(l, `Which two letters occupy the middle positions in the word ${d.word}?`, `शब्द ${d.word} के दो मध्य स्थानों पर कौन-से अक्षर हैं?`, `ਸ਼ਬਦ ${d.word} ਦੀਆਂ ਦੋ ਮੱਧਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜੇ ਅੱਖਰ ਹਨ?`);
    if (mode === "WORD_COUNT_UNCHANGED_ASC" || mode === "WORD_COUNT_UNCHANGED_DESC" || mode === "WORD_COUNT_UNCHANGED_SELECTED_TRANSFORM") {
      return text(l, `If you ${wordTransform(l, d.wordTransformId!, d)} in the word ${d.word}, how many letter occurrences will remain in their original positions?`, `यदि शब्द ${d.word} में ${wordTransform(l, d.wordTransformId!, d)}, तो कितने अक्षर अपनी मूल जगह पर बने रहेंगे?`, `ਜੇ ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${wordTransform(l, d.wordTransformId!, d)}, ਤਾਂ ਕਿੰਨੇ ਅੱਖਰ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`);
    }
    if (mode === "WORD_IDENTIFY_UNCHANGED_ASC") {
      return text(l, `After arranging the letters of ${d.word} in alphabetical order, which letter occurrences remain in their original positions?`, `${d.word} के अक्षरों को वर्णक्रम में लगाने के बाद कौन-से अक्षर अपनी मूल जगह पर रहते हैं?`, `${d.word} ਦੇ ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਕਿਹੜੇ ਅੱਖਰ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿੰਦੇ ਹਨ?`);
    }
    if (d.wordTransformId && mode.startsWith("WORD_POSITION_AFTER")) {
      return text(l, `In the word ${d.word}, ${wordTransform(l, d.wordTransformId, d)}. What will be the new position of ${occurrencePhrase(l, d)} from the left end?`, `शब्द ${d.word} में ${wordTransform(l, d.wordTransformId, d)}। इसके बाद ${occurrencePhrase(l, d)} का नया स्थान बाईं ओर से क्या होगा?`, `ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${wordTransform(l, d.wordTransformId, d)}। ਇਸ ਤੋਂ ਬਾਅਦ ${occurrencePhrase(l, d)} ਦੀ ਨਵੀਂ ਥਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਕੀ ਹੋਵੇਗੀ?`);
    }
    if (d.wordTransformId && d.position !== undefined) {
      return text(l, `In the word ${d.word}, ${wordTransform(l, d.wordTransformId, d)}. Which letter will then occupy ${positionLabel(l, d.position)} from the left?`, `शब्द ${d.word} में ${wordTransform(l, d.wordTransformId, d)}। इसके बाद बाईं ओर से ${positionLabel(l, d.position)} पर कौन-सा अक्षर होगा?`, `ਸ਼ਬਦ ${d.word} ਵਿੱਚ ${wordTransform(l, d.wordTransformId, d)}। ਇਸ ਤੋਂ ਬਾਅਦ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${positionLabel(l, d.position)} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    }
  }
  throw new Error(`No editorial-v2 stem for ${ql.qlId} (${ql.solveMode}).`);
}

function grid(locale: AlpLocale, original: readonly string[], changed?: readonly string[]): string[] {
  const positions = original.map((_, index) => String(index + 1));
  const labels = {
    position: text(locale, "Position", "स्थान", "ਥਾਂ"),
    original: text(locale, "Original", "मूल क्रम", "ਮੂਲ ਕ੍ਰਮ"),
    changed: text(locale, "Changed", "नया क्रम", "ਨਵਾਂ ਕ੍ਰਮ"),
  };
  const width = Math.max(...positions.map((value) => value.length), 1);
  const row = (label: string, values: readonly string[]) => `${label.padEnd(11)}: ${values.map((value) => value.padStart(width)).join("  ")}`;
  return [row(labels.position, positions), row(labels.original, original), ...(changed ? [row(labels.changed, changed)] : [])];
}

function rankAnchor(locale: AlpLocale, rank: number, answer: string): string {
  const nearest = [5, 10, 15, 20, 25].reduce((best, value) => Math.abs(value - rank) < Math.abs(best - rank) ? value : best, 5);
  const anchorLetter = letterAtLeftRank(nearest);
  const delta = rank - nearest;
  if (delta === 0) {
    return text(locale, `${anchorLetter} is an EJOTY anchor at position ${nearest}.`, `${anchorLetter}, EJOTY स्मृति-क्रम में स्थान ${nearest} का सीधा संकेत है।`, `${anchorLetter}, EJOTY ਯਾਦ-ਕ੍ਰਮ ਵਿੱਚ ਥਾਂ ${nearest} ਦਾ ਸਿੱਧਾ ਸੰਕੇਤ ਹੈ।`);
  }
  return text(
    locale,
    `Use EJOTY: ${anchorLetter} is at ${nearest}; move ${Math.abs(delta)} ${delta > 0 ? "forward" : "backward"} to reach ${answer}.`,
    `EJOTY का प्रयोग करें: ${anchorLetter} स्थान ${nearest} पर है; वहाँ से ${Math.abs(delta)} स्थान ${delta > 0 ? "आगे" : "पीछे"} जाने पर ${answer} मिलता है।`,
    `EJOTY ਵਰਤੋ: ${anchorLetter} ਥਾਂ ${nearest} ਉੱਤੇ ਹੈ; ਉੱਥੋਂ ${Math.abs(delta)} ਥਾਵਾਂ ${delta > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"} ਜਾਣ ਉੱਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`,
  );
}

interface PedagogyBlock {
  coreConcept: string;
  steps: string[];
  visualWorking: string[];
  shortcut: string;
}

function cp001Pedagogy(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, l: AlpLocale): PedagogyBlock {
  const mode = ql.solveMode;
  if (mode === "LETTER_AT_LEFT_RANK") {
    const rank = d.rank!;
    return {
      coreConcept: text(l, "In forward alphabetical order, A = 1, B = 2, …, Z = 26. A left-end rank therefore maps directly to the letter at that rank.", "सीधे वर्णमाला-क्रम में A = 1, B = 2, …, Z = 26 होता है। इसलिए बाईं ओर का स्थान सीधे उसी क्रमांक वाले अक्षर को दर्शाता है।", "ਸਿੱਧੇ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ A = 1, B = 2, …, Z = 26 ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੀ ਥਾਂ ਸਿੱਧੀ ਉਸੇ ਨੰਬਰ ਵਾਲੇ ਅੱਖਰ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।"),
      steps: [
        text(l, `Start counting from the left with A = 1.`, `बाईं ओर से A = 1 मानकर गिनती शुरू करें।`, `ਖੱਬੇ ਪਾਸੇ ਤੋਂ A = 1 ਮੰਨ ਕੇ ਗਿਣਤੀ ਸ਼ੁਰੂ ਕਰੋ।`),
        text(l, `The ${enOrdinal(rank)} position corresponds to ${solved.answer}.`, `${rank}वाँ स्थान ${solved.answer} का है।`, `${rank}ਵੀਂ ਥਾਂ ${solved.answer} ਦੀ ਹੈ।`),
        text(l, `Nearby check: ${rank > 1 ? `${letterAtLeftRank(rank - 1)} = ${rank - 1}, ` : ""}${solved.answer} = ${rank}${rank < 26 ? `, ${letterAtLeftRank(rank + 1)} = ${rank + 1}` : ""}.`, `निकट जाँच: ${rank > 1 ? `${letterAtLeftRank(rank - 1)} = ${rank - 1}, ` : ""}${solved.answer} = ${rank}${rank < 26 ? `, ${letterAtLeftRank(rank + 1)} = ${rank + 1}` : ""}।`, `ਨੇੜਲੀ ਜਾਂਚ: ${rank > 1 ? `${letterAtLeftRank(rank - 1)} = ${rank - 1}, ` : ""}${solved.answer} = ${rank}${rank < 26 ? `, ${letterAtLeftRank(rank + 1)} = ${rank + 1}` : ""}।`),
      ],
      visualWorking: [`A(1) … ${solved.answer}(${rank}) … Z(26)`],
      shortcut: rankAnchor(l, rank, solved.answer),
    };
  }
  if (mode === "LETTER_AT_RIGHT_RANK") {
    const left = 27 - d.rank!;
    return {
      coreConcept: text(l, "For the same letter, left rank + right rank = 27.", "एक ही अक्षर के लिए बाईं ओर का स्थान + दाईं ओर का स्थान = 27 होता है।", "ਇੱਕੋ ਅੱਖਰ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੀ ਥਾਂ + ਸੱਜੇ ਪਾਸੇ ਦੀ ਥਾਂ = 27 ਹੁੰਦੀ ਹੈ।"),
      steps: [
        text(l, `Convert the right rank to a left rank: 27 − ${d.rank} = ${left}.`, `दाईं ओर के स्थान को बाईं ओर के स्थान में बदलें: 27 − ${d.rank} = ${left}।`, `ਸੱਜੇ ਪਾਸੇ ਦੀ ਥਾਂ ਨੂੰ ਖੱਬੇ ਪਾਸੇ ਦੀ ਥਾਂ ਵਿੱਚ ਬਦਲੋ: 27 − ${d.rank} = ${left}।`),
        text(l, `The letter at left rank ${left} is ${solved.answer}.`, `बाईं ओर से स्थान ${left} पर ${solved.answer} है।`, `ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਥਾਂ ${left} ਉੱਤੇ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`Right rank ${d.rank} → Left rank 27 − ${d.rank} = ${left} → ${solved.answer}`],
      shortcut: text(l, "Use the fixed sum 27 instead of counting backwards from Z.", "Z से उलटी गिनती करने के बजाय स्थिर योग 27 का प्रयोग करें।", "Z ਤੋਂ ਉਲਟੀ ਗਿਣਤੀ ਕਰਨ ਦੀ ਬਜਾਏ ਪੱਕਾ ਜੋੜ 27 ਵਰਤੋ।"),
    };
  }
  if (mode === "LEFT_RANK_OF_LETTER" || mode === "RIGHT_RANK_OF_LETTER") {
    const left = leftRank(d.letter!);
    const right = rightRank(d.letter!);
    const fromRight = mode === "RIGHT_RANK_OF_LETTER";
    return {
      coreConcept: text(l, "First identify the forward rank. When a right-end rank is required, subtract the forward rank from 27.", "पहले अक्षर का सीधा स्थान ज्ञात करें। दाईं ओर का स्थान चाहिए तो सीधे स्थान को 27 में से घटाएँ।", "ਪਹਿਲਾਂ ਅੱਖਰ ਦੀ ਸਿੱਧੀ ਥਾਂ ਲੱਭੋ। ਸੱਜੇ ਪਾਸੇ ਦੀ ਥਾਂ ਚਾਹੀਦੀ ਹੋਵੇ ਤਾਂ ਸਿੱਧੀ ਥਾਂ ਨੂੰ 27 ਵਿੱਚੋਂ ਘਟਾਓ।"),
      steps: [
        text(l, `${d.letter} has left rank ${left}.`, `${d.letter} का बाईं ओर से स्थान ${left} है।`, `${d.letter} ਦੀ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਥਾਂ ${left} ਹੈ।`),
        ...(fromRight ? [text(l, `Right rank = 27 − ${left} = ${right}.`, `दाईं ओर का स्थान = 27 − ${left} = ${right}।`, `ਸੱਜੇ ਪਾਸੇ ਦੀ ਥਾਂ = 27 − ${left} = ${right}।`)] : []),
        text(l, `Therefore, the required position is ${solved.answer}.`, `अतः आवश्यक स्थान ${solved.answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਥਾਂ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`${d.letter}: left ${left} | right ${right} | sum ${left + right}`],
      shortcut: fromRight ? text(l, "Use right rank = 27 − left rank.", "दायाँ स्थान = 27 − बायाँ स्थान।", "ਸੱਜੀ ਥਾਂ = 27 − ਖੱਬੀ ਥਾਂ।") : rankAnchor(l, left, d.letter!),
    };
  }
  if (mode.includes("RANK_FROM")) {
    const answer = Number(solved.canonicalValue);
    return {
      coreConcept: text(l, "The left and right ranks of the same alphabet letter always add to 27.", "एक ही अक्षर के बाएँ और दाएँ स्थानों का योग हमेशा 27 होता है।", "ਇੱਕੋ ਅੱਖਰ ਦੀਆਂ ਖੱਬੀਆਂ ਅਤੇ ਸੱਜੀਆਂ ਥਾਵਾਂ ਦਾ ਜੋੜ ਹਮੇਸ਼ਾਂ 27 ਹੁੰਦਾ ਹੈ।"),
      steps: [
        text(l, `Known rank = ${d.rank}.`, `दिया गया स्थान = ${d.rank}।`, `ਦਿੱਤੀ ਥਾਂ = ${d.rank}।`),
        text(l, `Required rank = 27 − ${d.rank} = ${answer}.`, `आवश्यक स्थान = 27 − ${d.rank} = ${answer}।`, `ਲੋੜੀਂਦੀ ਥਾਂ = 27 − ${d.rank} = ${answer}।`),
      ],
      visualWorking: [`${d.rank} + ${answer} = 27`],
      shortcut: text(l, "Complement the given rank to 27.", "दिए गए स्थान का 27 तक पूरक ज्ञात करें।", "ਦਿੱਤੀ ਥਾਂ ਦਾ 27 ਤੱਕ ਪੂਰਕ ਲੱਭੋ।"),
    };
  }
  if (mode.startsWith("OPPOSITE") || mode === "IDENTIFY_OPPOSITE_PAIR") {
    const source = d.letter ?? (d.rank ? (mode.includes("RIGHT") ? letterAtRightRank(d.rank) : letterAtLeftRank(d.rank)) : undefined);
    return {
      coreConcept: text(l, "Opposite alphabet pairs have forward ranks whose sum is 27: A–Z, B–Y, C–X, and so on.", "विपरीत वर्णमाला-जोड़ी के दोनों सीधे स्थानों का योग 27 होता है: A–Z, B–Y, C–X आदि।", "ਉਲਟੀ ਵਰਣਮਾਲਾ-ਜੋੜੀ ਦੇ ਦੋਵੇਂ ਸਿੱਧੇ ਸਥਾਨਾਂ ਦਾ ਜੋੜ 27 ਹੁੰਦਾ ਹੈ: A–Z, B–Y, C–X ਆਦਿ।"),
      steps: source ? [
        text(l, `${source} has forward rank ${leftRank(source)}.`, `${source} का सीधा स्थान ${leftRank(source)} है।`, `${source} ਦੀ ਸਿੱਧੀ ਥਾਂ ${leftRank(source)} ਹੈ।`),
        text(l, `Opposite rank = 27 − ${leftRank(source)} = ${27 - leftRank(source)}.`, `विपरीत स्थान = 27 − ${leftRank(source)} = ${27 - leftRank(source)}।`, `ਉਲਟੀ ਥਾਂ = 27 − ${leftRank(source)} = ${27 - leftRank(source)}।`),
        text(l, `That letter is ${solved.answer}.`, `उस स्थान का अक्षर ${solved.answer} है।`, `ਉਸ ਥਾਂ ਦਾ ਅੱਖਰ ${solved.answer} ਹੈ।`),
      ] : [text(l, "Check each option by adding the two forward ranks; only the correct pair totals 27.", "हर विकल्प के दोनों सीधे स्थान जोड़ें; केवल सही जोड़ी का योग 27 होगा।", "ਹਰ ਵਿਕਲਪ ਦੇ ਦੋਵੇਂ ਸਿੱਧੇ ਸਥਾਨ ਜੋੜੋ; ਕੇਵਲ ਸਹੀ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਹੋਵੇਗਾ।")],
      visualWorking: source ? [`${source}(${leftRank(source)}) ↔ ${solved.answer}(${27 - leftRank(source)})`] : [`A–Z | B–Y | C–X | … | M–N`],
      shortcut: text(l, "Remember the opposite-pair sum 27.", "विपरीत-जोड़ी का योग 27 याद रखें।", "ਉਲਟੀ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਯਾਦ ਰੱਖੋ।"),
    };
  }
  const letter = d.letter ?? solved.answer;
  return {
    coreConcept: text(l, "A letter's left and right ranks are complementary and always total 27.", "किसी अक्षर के बाएँ और दाएँ स्थान परस्पर पूरक होते हैं और उनका योग 27 होता है।", "ਕਿਸੇ ਅੱਖਰ ਦੀਆਂ ਖੱਬੀਆਂ ਅਤੇ ਸੱਜੀਆਂ ਥਾਵਾਂ ਇਕ-ਦੂਜੇ ਦੀਆਂ ਪੂਰਕ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਜੋੜ 27 ਹੁੰਦਾ ਹੈ।"),
    steps: [text(l, `Use the known rank information to identify ${letter}, then verify that the two ranks add to 27.`, `दिए गए स्थानों से ${letter} पहचानें और जाँचें कि दोनों स्थानों का योग 27 है।`, `ਦਿੱਤੀਆਂ ਥਾਵਾਂ ਤੋਂ ${letter} ਪਛਾਣੋ ਅਤੇ ਜਾਂਚੋ ਕਿ ਦੋਵੇਂ ਥਾਵਾਂ ਦਾ ਜੋੜ 27 ਹੈ।`)],
    visualWorking: [`Answer: ${solved.answer}`],
    shortcut: text(l, "Use the 27-sum check to verify the answer instantly.", "उत्तर की तुरंत जाँच के लिए 27-योग नियम अपनाएँ।", "ਜਵਾਬ ਦੀ ਤੁਰੰਤ ਜਾਂਚ ਲਈ 27-ਜੋੜ ਨਿਯਮ ਵਰਤੋ।"),
  };
}

function cp002Pedagogy(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, l: AlpLocale): PedagogyBlock {
  const mode = ql.solveMode;
  const cyclic = mode.includes("CYCLIC");
  const source = d.letter ?? (d.rank !== undefined ? (mode.includes("FROM_RIGHT") ? letterAtRightRank(d.rank) : letterAtLeftRank(d.rank)) : undefined);
  if (mode === "FIND_FORWARD_OFFSET" || mode === "FIND_BACKWARD_OFFSET" || mode === "FIND_SIGNED_DIRECTION_AND_OFFSET") {
    const a = leftRank(d.letter!);
    const b = leftRank(d.targetLetter!);
    const difference = b - a;
    return {
      coreConcept: text(l, "Convert both letters to forward ranks. The absolute difference gives the number of moves, and the sign tells the direction.", "दोनों अक्षरों को सीधे स्थानों में बदलें। स्थानों का परिमाणात्मक अंतर चालों की संख्या देता है और अंतर का चिन्ह दिशा बताता है।", "ਦੋਵੇਂ ਅੱਖਰਾਂ ਨੂੰ ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਬਦਲੋ। ਥਾਵਾਂ ਦਾ ਪੂਰਨ ਫਰਕ ਚਾਲਾਂ ਦੀ ਗਿਣਤੀ ਦਿੰਦਾ ਹੈ ਅਤੇ ਫਰਕ ਦਾ ਨਿਸ਼ਾਨ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ।"),
      steps: [
        text(l, `${d.letter} = ${a} and ${d.targetLetter} = ${b}.`, `${d.letter} = ${a} और ${d.targetLetter} = ${b}।`, `${d.letter} = ${a} ਅਤੇ ${d.targetLetter} = ${b}।`),
        text(l, `Difference = ${b} − ${a} = ${difference}.`, `अंतर = ${b} − ${a} = ${difference}।`, `ਫਰਕ = ${b} − ${a} = ${difference}।`),
        text(l, `Hence the required result is ${solved.answer}.`, `अतः आवश्यक परिणाम ${solved.answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਨਤੀਜਾ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`${d.letter}(${a}) → ${d.targetLetter}(${b}) | change ${difference >= 0 ? "+" : ""}${difference}`],
      shortcut: text(l, "Subtract forward ranks; a positive result means right, and a negative result means left.", "सीधे स्थान घटाएँ; धनात्मक परिणाम दाईं दिशा और ऋणात्मक परिणाम बाईं दिशा बताता है।", "ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਘਟਾਓ; ਧਨਾਤਮਕ ਨਤੀਜਾ ਸੱਜੀ ਦਿਸ਼ਾ ਅਤੇ ਰਿਣਾਤਮਕ ਨਤੀਜਾ ਖੱਬੀ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ।"),
    };
  }
  if (mode.startsWith("RECOVER_ANCHOR")) {
    const target = d.targetLetter!;
    const inverseDirection: "LEFT" | "RIGHT" = d.direction === "RIGHT" ? "LEFT" : "RIGHT";
    return {
      coreConcept: text(l, "To recover a starting letter, undo the stated movement by moving the same number of places in the opposite direction.", "प्रारंभिक अक्षर ज्ञात करने के लिए दी गई चाल को उलटें और उतने ही स्थान विपरीत दिशा में चलें।", "ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ ਲੱਭਣ ਲਈ ਦਿੱਤੀ ਚਾਲ ਨੂੰ ਉਲਟੋ ਅਤੇ ਉਤਨੀਆਂ ਹੀ ਥਾਵਾਂ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਓ।"),
      steps: [
        text(l, `The final letter is ${target}.`, `अंतिम अक्षर ${target} है।`, `ਅੰਤਿਮ ਅੱਖਰ ${target} ਹੈ।`),
        text(l, `Undo the movement: go ${d.offset} places to the ${side(l, inverseDirection)}${cyclic ? ", wrapping around A/Z when necessary" : ""}.`, `चाल को उलटें: ${side(l, inverseDirection)} ${d.offset} स्थान जाएँ${cyclic ? " और आवश्यकता पर A/Z के पार चक्रीय रूप से बढ़ें" : ""}।`, `ਚਾਲ ਨੂੰ ਉਲਟੋ: ${side(l, inverseDirection)} ${d.offset} ਥਾਵਾਂ ਜਾਓ${cyclic ? " ਅਤੇ ਲੋੜ ਪੈਣ ਉੱਤੇ A/Z ਤੋਂ ਚੱਕਰੀ ਤਰੀਕੇ ਨਾਲ ਅੱਗੇ ਵਧੋ" : ""}।`),
        text(l, `The starting letter is ${solved.answer}.`, `प्रारंभिक अक्षर ${solved.answer} है।`, `ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`${solved.answer} --${d.offset} ${d.direction?.toLowerCase()}--> ${target}`],
      shortcut: text(l, "Inverse question = reverse the direction, not the answer order.", "प्रतिलोम प्रश्न में दिशा उलटें, उत्तर का क्रम नहीं।", "ਉਲਟ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿਸ਼ਾ ਉਲਟੋ, ਜਵਾਬ ਦਾ ਕ੍ਰਮ ਨਹੀਂ।"),
    };
  }
  if (mode.startsWith("TWO_STAGE")) {
    const firstSigned = mode === "TWO_STAGE_RIGHT_THEN_LEFT" ? d.offset! : -d.offset!;
    const secondSigned = mode === "TWO_STAGE_RIGHT_THEN_LEFT" ? -d.secondOffset! : d.secondOffset!;
    const net = firstSigned + secondSigned;
    return {
      coreConcept: text(l, "Two opposite movements can be combined into one signed net shift after checking that the path stays within the alphabet.", "दो विपरीत चालों को एक चिन्हित शुद्ध चाल में जोड़ा जा सकता है, बशर्ते मार्ग वर्णमाला की सीमा में रहे।", "ਦੋ ਉਲਟ ਚਾਲਾਂ ਨੂੰ ਇੱਕ ਨਿਸ਼ਾਨ ਵਾਲੀ ਕੁੱਲ ਚਾਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾ ਸਕਦਾ ਹੈ, ਜੇ ਰਸਤਾ ਵਰਣਮਾਲਾ ਦੀ ਹੱਦ ਵਿੱਚ ਰਹੇ।"),
      steps: [
        text(l, `Start at ${d.letter} (${leftRank(d.letter!)}).`, `${d.letter} (${leftRank(d.letter!)}) से शुरू करें।`, `${d.letter} (${leftRank(d.letter!)}) ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।`),
        text(l, `First movement = ${firstSigned >= 0 ? "+" : ""}${firstSigned}; second movement = ${secondSigned >= 0 ? "+" : ""}${secondSigned}.`, `पहली चाल = ${firstSigned >= 0 ? "+" : ""}${firstSigned}; दूसरी चाल = ${secondSigned >= 0 ? "+" : ""}${secondSigned}।`, `ਪਹਿਲੀ ਚਾਲ = ${firstSigned >= 0 ? "+" : ""}${firstSigned}; ਦੂਜੀ ਚਾਲ = ${secondSigned >= 0 ? "+" : ""}${secondSigned}।`),
        text(l, `Net movement = ${net >= 0 ? "+" : ""}${net}, giving ${solved.answer}.`, `शुद्ध चाल = ${net >= 0 ? "+" : ""}${net}, जिससे ${solved.answer} मिलता है।`, `ਕੁੱਲ ਚਾਲ = ${net >= 0 ? "+" : ""}${net}, ਜਿਸ ਨਾਲ ${solved.answer} ਮਿਲਦਾ ਹੈ।`),
      ],
      visualWorking: [`${d.letter} | ${firstSigned >= 0 ? "+" : ""}${firstSigned} | ${secondSigned >= 0 ? "+" : ""}${secondSigned} | net ${net >= 0 ? "+" : ""}${net} | ${solved.answer}`],
      shortcut: text(l, "Cancel the common part of the two opposite moves and apply only the remaining net shift.", "दोनों विपरीत चालों का समान भाग काटकर केवल बची हुई शुद्ध चाल लागू करें।", "ਦੋਵੇਂ ਉਲਟ ਚਾਲਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਕੱਟ ਕੇ ਕੇਵਲ ਬਚੀ ਕੁੱਲ ਚਾਲ ਲਗਾਓ।"),
    };
  }
  if (source) {
    const sourceRank = leftRank(source);
    const signed = d.direction === "RIGHT" ? d.offset! : -d.offset!;
    const targetRank = cyclic ? ((sourceRank - 1 + signed) % 26 + 26) % 26 + 1 : sourceRank + signed;
    return {
      coreConcept: text(l, cyclic ? "In cyclic alphabet movement, counting continues from Z to A and from A to Z." : "Represent the starting letter by its forward rank, add for a right shift and subtract for a left shift.", cyclic ? "चक्रीय वर्णमाला-चाल में Z के बाद A और A से पीछे Z आता है।" : "प्रारंभिक अक्षर को उसके सीधे स्थान से दर्शाएँ; दाईं चाल के लिए जोड़ें और बाईं चाल के लिए घटाएँ।", cyclic ? "ਚੱਕਰੀ ਵਰਣਮਾਲਾ ਚਾਲ ਵਿੱਚ Z ਤੋਂ ਬਾਅਦ A ਅਤੇ A ਤੋਂ ਪਿੱਛੇ Z ਆਉਂਦਾ ਹੈ।" : "ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ ਨੂੰ ਉਸ ਦੀ ਸਿੱਧੀ ਥਾਂ ਨਾਲ ਦਰਸਾਓ; ਸੱਜੀ ਚਾਲ ਲਈ ਜੋੜੋ ਅਤੇ ਖੱਬੀ ਚਾਲ ਲਈ ਘਟਾਓ।"),
      steps: [
        text(l, `Starting letter ${source} has forward rank ${sourceRank}.`, `प्रारंभिक अक्षर ${source} का सीधा स्थान ${sourceRank} है।`, `ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ ${source} ਦੀ ਸਿੱਧੀ ਥਾਂ ${sourceRank} ਹੈ।`),
        text(l, `Apply the shift: ${sourceRank} ${signed >= 0 ? "+" : "−"} ${Math.abs(signed)} = ${targetRank}${cyclic ? " after cyclic adjustment" : ""}.`, `चाल लागू करें: ${sourceRank} ${signed >= 0 ? "+" : "−"} ${Math.abs(signed)} = ${targetRank}${cyclic ? " (चक्रीय समायोजन के बाद)" : ""}।`, `ਚਾਲ ਲਗਾਓ: ${sourceRank} ${signed >= 0 ? "+" : "−"} ${Math.abs(signed)} = ${targetRank}${cyclic ? " (ਚੱਕਰੀ ਸੋਧ ਤੋਂ ਬਾਅਦ)" : ""}।`),
        text(l, `The result is ${solved.answer}.`, `परिणाम ${solved.answer} है।`, `ਨਤੀਜਾ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`${source}(${sourceRank}) ${signed >= 0 ? "+" : "−"} ${Math.abs(signed)} → rank ${targetRank} → ${solved.answer}`],
      shortcut: text(l, "Use signed ranks: right = plus, left = minus.", "चिन्हित स्थान अपनाएँ: दायाँ = जोड़, बायाँ = घटाव।", "ਨਿਸ਼ਾਨ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਰਤੋ: ਸੱਜਾ = ਜੋੜ, ਖੱਬਾ = ਘਟਾਓ।"),
    };
  }
  return {
    coreConcept: text(l, "Track every alphabet movement by position rather than by visual guessing.", "हर वर्णमाला-चाल को स्थानों से ट्रैक करें, केवल देखकर अनुमान न लगाएँ।", "ਹਰ ਵਰਣਮਾਲਾ ਚਾਲ ਨੂੰ ਥਾਵਾਂ ਨਾਲ ਟ੍ਰੈਕ ਕਰੋ, ਸਿਰਫ਼ ਵੇਖ ਕੇ ਅੰਦਾਜ਼ਾ ਨਾ ਲਗਾਓ।"),
    steps: [text(l, `Applying the stated movement gives ${solved.answer}.`, `दी गई चाल लागू करने पर ${solved.answer} मिलता है।`, `ਦਿੱਤੀ ਚਾਲ ਲਗਾਉਣ ਉੱਤੇ ${solved.answer} ਮਿਲਦਾ ਹੈ।`)],
    visualWorking: [`Answer: ${solved.answer}`],
    shortcut: text(l, "Convert letters to ranks before moving.", "चलने से पहले अक्षरों को स्थानों में बदलें।", "ਚਲਣ ਤੋਂ ਪਹਿਲਾਂ ਅੱਖਰਾਂ ਨੂੰ ਥਾਵਾਂ ਵਿੱਚ ਬਦਲੋ।"),
  };
}

function cp003Pedagogy(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, l: AlpLocale): PedagogyBlock {
  const first = d.letter;
  const second = d.secondLetter;
  const distance = first && second ? positionDistance(first, second) : undefined;
  const mode = ql.solveMode;
  if (mode === "EXCLUSIVE_GAP" || mode === "INCLUSIVE_SPAN" || mode === "ABSOLUTE_POSITION_DISTANCE") {
    const formula = mode === "EXCLUSIVE_GAP" ? "distance − 1" : mode === "INCLUSIVE_SPAN" ? "distance + 1" : "distance";
    return {
      coreConcept: text(l, "First take the absolute difference of the two forward ranks. Then adjust by −1 for letters strictly between or +1 for an inclusive span.", "पहले दोनों सीधे स्थानों का परिमाणात्मक अंतर लें। केवल बीच के अक्षरों के लिए 1 घटाएँ और दोनों सिरों सहित गिनती के लिए 1 जोड़ें।", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਦਾ ਪੂਰਨ ਫਰਕ ਲਵੋ। ਕੇਵਲ ਵਿਚਕਾਰਲੇ ਅੱਖਰਾਂ ਲਈ 1 ਘਟਾਓ ਅਤੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਗਿਣਤੀ ਲਈ 1 ਜੋੜੋ।"),
      steps: [
        text(l, `${first} = ${leftRank(first!)} and ${second} = ${leftRank(second!)}.`, `${first} = ${leftRank(first!)} और ${second} = ${leftRank(second!)}।`, `${first} = ${leftRank(first!)} ਅਤੇ ${second} = ${leftRank(second!)}।`),
        text(l, `Position-distance = |${leftRank(second!)} − ${leftRank(first!)}| = ${distance}.`, `स्थान-अंतर = |${leftRank(second!)} − ${leftRank(first!)}| = ${distance}।`, `ਥਾਂ-ਫਰਕ = |${leftRank(second!)} − ${leftRank(first!)}| = ${distance}।`),
        text(l, `Required count = ${formula} = ${solved.answer}.`, `आवश्यक गिनती = ${formula} = ${solved.answer}।`, `ਲੋੜੀਂਦੀ ਗਿਣਤੀ = ${formula} = ${solved.answer}।`),
      ],
      visualWorking: [`${first}(${leftRank(first!)}) — distance ${distance} — ${second}(${leftRank(second!)})`],
      shortcut: text(l, "Distance uses no endpoint adjustment; exclusive gap subtracts 1; inclusive span adds 1.", "स्थान-अंतर में कोई सिरा-समायोजन नहीं; केवल बीच के लिए 1 घटाएँ; दोनों सिरों सहित के लिए 1 जोड़ें।", "ਥਾਂ-ਫਰਕ ਵਿੱਚ ਕੋਈ ਸਿਰਾ ਸੋਧ ਨਹੀਂ; ਕੇਵਲ ਵਿਚਕਾਰ ਲਈ 1 ਘਟਾਓ; ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਲਈ 1 ਜੋੜੋ।"),
    };
  }
  if (mode.includes("MIDPOINT") || mode === "EQUAL_SIDE_GAP") {
    const endpoints = first && second ? [leftRank(first), leftRank(second)] : undefined;
    return {
      coreConcept: text(l, "A midpoint is found by averaging endpoint ranks. If the average is an integer there is one middle letter; otherwise the two neighbouring ranks form the middle pair.", "मध्य स्थान दोनों सिरों के स्थानों का औसत लेकर मिलता है। औसत पूर्णांक हो तो एक मध्य अक्षर और अन्यथा दो पड़ोसी मध्य अक्षर होते हैं।", "ਮੱਧਲੀ ਥਾਂ ਦੋਵੇਂ ਸਿਰਿਆਂ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਔਸਤ ਲੈ ਕੇ ਮਿਲਦੀ ਹੈ। ਔਸਤ ਪੂਰਨ ਅੰਕ ਹੋਵੇ ਤਾਂ ਇੱਕ ਮੱਧਲਾ ਅੱਖਰ ਅਤੇ ਨਹੀਂ ਤਾਂ ਦੋ ਨੇੜਲੇ ਮੱਧਲੇ ਅੱਖਰ ਹੁੰਦੇ ਹਨ।"),
      steps: endpoints ? [
        text(l, `Endpoint ranks are ${endpoints[0]} and ${endpoints[1]}.`, `सिरों के स्थान ${endpoints[0]} और ${endpoints[1]} हैं।`, `ਸਿਰਿਆਂ ਦੀਆਂ ਥਾਵਾਂ ${endpoints[0]} ਅਤੇ ${endpoints[1]} ਹਨ।`),
        text(l, `Centre calculation uses (${endpoints[0]} + ${endpoints[1]}) ÷ 2.`, `मध्य गणना (${endpoints[0]} + ${endpoints[1]}) ÷ 2 से करें।`, `ਮੱਧ ਗਿਣਤੀ (${endpoints[0]} + ${endpoints[1]}) ÷ 2 ਨਾਲ ਕਰੋ।`),
        text(l, `This gives ${solved.answer}.`, `इससे ${solved.answer} मिलता है।`, `ਇਸ ਨਾਲ ${solved.answer} ਮਿਲਦਾ ਹੈ।`),
      ] : [text(l, `Move equally on both sides of midpoint ${d.midpoint}; the result is ${solved.answer}.`, `मध्य अक्षर ${d.midpoint} के दोनों ओर बराबर चलें; परिणाम ${solved.answer} है।`, `ਮੱਧਲੇ ਅੱਖਰ ${d.midpoint} ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਬਰਾਬਰ ਜਾਓ; ਨਤੀਜਾ ${solved.answer} ਹੈ।`)],
      visualWorking: endpoints ? [`${first}(${endpoints[0]}) → midpoint ← ${second}(${endpoints[1]})`] : [`${solved.answer}`],
      shortcut: text(l, "Average the ranks instead of writing every intervening letter.", "हर बीच का अक्षर लिखने के बजाय स्थानों का औसत लें।", "ਹਰ ਵਿਚਕਾਰਲਾ ਅੱਖਰ ਲਿਖਣ ਦੀ ਬਜਾਏ ਥਾਵਾਂ ਦਾ ਔਸਤ ਲਵੋ।"),
    };
  }
  if (mode.startsWith("RECOVER") && d.direction) {
    const move = mode.includes("GAP") ? d.rank! + 1 : d.rank!;
    return {
      coreConcept: text(l, "A stated gap excludes the two endpoints, so endpoint distance equals gap + 1. A stated positional distance needs no such adjustment.", "दिया गया अंतराल दोनों सिरों को नहीं गिनता, इसलिए सिरों की दूरी = अंतराल + 1 होती है। सीधे दिए स्थान-अंतर में यह समायोजन नहीं होता।", "ਦਿੱਤਾ ਖਾਲੀ ਅੰਤਰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਨਹੀਂ ਗਿਣਦਾ, ਇਸ ਲਈ ਸਿਰਿਆਂ ਦੀ ਦੂਰੀ = ਖਾਲੀ ਅੰਤਰ + 1 ਹੁੰਦੀ ਹੈ। ਸਿੱਧੇ ਦਿੱਤੇ ਥਾਂ-ਫਰਕ ਵਿੱਚ ਇਹ ਸੋਧ ਨਹੀਂ ਹੁੰਦੀ।"),
      steps: [
        text(l, `Required movement = ${move} positions to the ${side(l, d.direction)}.`, `आवश्यक चाल = ${side(l, d.direction)} ${move} स्थान।`, `ਲੋੜੀਂਦੀ ਚਾਲ = ${side(l, d.direction)} ${move} ਥਾਵਾਂ।`),
        text(l, `Start from ${d.letter} at rank ${leftRank(d.letter!)}.`, `${d.letter} से शुरू करें, जिसका स्थान ${leftRank(d.letter!)} है।`, `${d.letter} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ, ਜਿਸ ਦੀ ਥਾਂ ${leftRank(d.letter!)} ਹੈ।`),
        text(l, `After moving ${move} positions, the endpoint is ${solved.answer}.`, `${move} स्थान चलने के बाद अंतिम अक्षर ${solved.answer} है।`, `${move} ਥਾਵਾਂ ਜਾਣ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਅੱਖਰ ${solved.answer} ਹੈ।`),
      ],
      visualWorking: [`${d.letter}(${leftRank(d.letter!)}) --${move} ${d.direction.toLowerCase()}--> ${solved.answer}`],
      shortcut: text(l, mode.includes("GAP") ? "For a gap question, move one more position than the stated gap." : "For positional distance, move exactly the stated number.", mode.includes("GAP") ? "अंतराल वाले प्रश्न में दिए अंतराल से एक स्थान अधिक चलें।" : "स्थान-अंतर वाले प्रश्न में ठीक दी गई संख्या जितना चलें।", mode.includes("GAP") ? "ਖਾਲੀ ਅੰਤਰ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਅੰਤਰ ਤੋਂ ਇੱਕ ਥਾਂ ਵੱਧ ਜਾਓ।" : "ਥਾਂ-ਫਰਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਠੀਕ ਦਿੱਤੀ ਗਿਣਤੀ ਜਿਤਨਾ ਜਾਓ।"),
    };
  }
  return {
    coreConcept: text(l, "Translate each letter pair into forward ranks and apply the exact requested count: distance, gap, outside count or before/after count.", "हर अक्षर-जोड़ी को सीधे स्थानों में बदलकर माँगी गई गिनती—दूरी, अंतराल, बाहर की गिनती या पहले/बाद की गिनती—ठीक उसी रूप में निकालें।", "ਹਰ ਅੱਖਰ-ਜੋੜੀ ਨੂੰ ਸਿੱਧੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਮੰਗੀ ਗਿਣਤੀ—ਦੂਰੀ, ਖਾਲੀ ਅੰਤਰ, ਬਾਹਰਲੀ ਗਿਣਤੀ ਜਾਂ ਪਹਿਲਾਂ/ਬਾਅਦ ਦੀ ਗਿਣਤੀ—ਠੀਕ ਉਸੇ ਰੂਪ ਵਿੱਚ ਕੱਢੋ।"),
    steps: [
      text(l, `Use the relevant ranks and endpoint convention.`, `संबंधित स्थान और सिरा-गणना नियम का प्रयोग करें।`, `ਸੰਬੰਧਿਤ ਥਾਵਾਂ ਅਤੇ ਸਿਰਾ-ਗਿਣਤੀ ਨਿਯਮ ਵਰਤੋ।`),
      text(l, `The required result is ${solved.answer}.`, `आवश्यक परिणाम ${solved.answer} है।`, `ਲੋੜੀਂਦਾ ਨਤੀਜਾ ${solved.answer} ਹੈ।`),
    ],
    visualWorking: [first && second ? `${first}(${leftRank(first)}) | ${second}(${leftRank(second)}) | answer ${solved.answer}` : `Answer: ${solved.answer}`],
    shortcut: text(l, "Write ranks first; this prevents endpoint-counting errors.", "पहले स्थान लिखें; इससे सिरा-गणना की गलती नहीं होगी।", "ਪਹਿਲਾਂ ਥਾਵਾਂ ਲਿਖੋ; ਇਸ ਨਾਲ ਸਿਰਾ-ਗਿਣਤੀ ਦੀ ਗਲਤੀ ਨਹੀਂ ਹੋਵੇਗੀ।"),
  };
}

function cp004Pedagogy(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, l: AlpLocale): PedagogyBlock {
  const transformed = d.transformedSequence ?? applyAlphabetTransform(d.transformId!, d.rotationStart);
  const original = ALPHABET;
  return {
    coreConcept: text(l, "Apply the stated rearrangement to the complete alphabet first. Only then read the requested letter or position from the new order.", "पहले दी गई पुनर्व्यवस्था को पूरी वर्णमाला पर लागू करें। इसके बाद ही नए क्रम से माँगा गया अक्षर या स्थान पढ़ें।", "ਪਹਿਲਾਂ ਦਿੱਤੀ ਮੁੜ-ਵਿਵਸਥਾ ਪੂਰੀ ਵਰਣਮਾਲਾ ਉੱਤੇ ਲਗਾਓ। ਇਸ ਤੋਂ ਬਾਅਦ ਹੀ ਨਵੇਂ ਕ੍ਰਮ ਤੋਂ ਮੰਗਿਆ ਅੱਖਰ ਜਾਂ ਥਾਂ ਪੜ੍ਹੋ।"),
    steps: [
      text(l, `Apply the rule: ${alphabetTransform(l, d)}.`, `नियम लागू करें: ${alphabetTransform(l, d)}।`, `ਨਿਯਮ ਲਗਾਓ: ${alphabetTransform(l, d)}।`),
      text(l, `The transformed order is ${transformed.join(" ")}.`, `बदला हुआ क्रम है: ${transformed.join(" ")}।`, `ਬਦਲਿਆ ਕ੍ਰਮ ਹੈ: ${transformed.join(" ")}।`),
      ql.solveMode === "LETTER_AT_TRANSFORMED_POSITION"
        ? text(l, `Reading ${positionLabel(l, d.position!)} gives ${solved.answer}.`, `${positionLabel(l, d.position!)} पढ़ने पर ${solved.answer} मिलता है।`, `${positionLabel(l, d.position!)} ਪੜ੍ਹਨ ਉੱਤੇ ${solved.answer} ਮਿਲਦਾ ਹੈ।`)
        : text(l, `${d.targetLetter} appears at new position ${solved.answer} from the left.`, `${d.targetLetter} नए क्रम में बाईं ओर से स्थान ${solved.answer} पर है।`, `${d.targetLetter} ਨਵੇਂ ਕ੍ਰਮ ਵਿੱਚ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਥਾਂ ${solved.answer} ਉੱਤੇ ਹੈ।`),
    ],
    visualWorking: grid(l, original, transformed),
    shortcut: text(l, "For half-reversals, pair swaps and block reversals, track only the affected block; for rotations, count cyclically from the new first letter.", "आधा उलटने, जोड़ी बदलने और खंड उलटने में केवल प्रभावित खंड को ट्रैक करें; चक्रीय शुरुआत में नए पहले अक्षर से गिनें।", "ਅੱਧਾ ਉਲਟਣ, ਜੋੜੀ ਬਦਲਣ ਅਤੇ ਖੰਡ ਉਲਟਣ ਵਿੱਚ ਕੇਵਲ ਪ੍ਰਭਾਵਿਤ ਖੰਡ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ; ਚੱਕਰੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਨਵੇਂ ਪਹਿਲੇ ਅੱਖਰ ਤੋਂ ਗਿਣੋ।"),
  };
}

function cp005Pedagogy(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, l: AlpLocale): PedagogyBlock {
  const word = d.word!;
  const original = [...word];
  const mode = ql.solveMode;
  if (!d.wordTransformId) {
    if (mode === "WORD_LETTER_FROM_LEFT" || mode === "WORD_LETTER_FROM_RIGHT") {
      const leftPosition = mode.endsWith("RIGHT") ? word.length - d.position! + 1 : d.position!;
      return {
        coreConcept: text(l, "Mark the word positions from left to right. For a right-end rank, convert it using left position = word length − right position + 1.", "शब्द के स्थान बाएँ से दाएँ अंकित करें। दाईं ओर के स्थान के लिए बायाँ स्थान = शब्द की लंबाई − दायाँ स्थान + 1 प्रयोग करें।", "ਸ਼ਬਦ ਦੀਆਂ ਥਾਵਾਂ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਲਿਖੋ। ਸੱਜੇ ਪਾਸੇ ਦੀ ਥਾਂ ਲਈ ਖੱਬੀ ਥਾਂ = ਸ਼ਬਦ ਦੀ ਲੰਬਾਈ − ਸੱਜੀ ਥਾਂ + 1 ਵਰਤੋ।"),
        steps: [
          text(l, `The word has ${word.length} letters.`, `शब्द में ${word.length} अक्षर हैं।`, `ਸ਼ਬਦ ਵਿੱਚ ${word.length} ਅੱਖਰ ਹਨ।`),
          ...(mode.endsWith("RIGHT") ? [text(l, `Left position = ${word.length} − ${d.position} + 1 = ${leftPosition}.`, `बायाँ स्थान = ${word.length} − ${d.position} + 1 = ${leftPosition}।`, `ਖੱਬੀ ਥਾਂ = ${word.length} − ${d.position} + 1 = ${leftPosition}।`)] : []),
          text(l, `The letter at position ${leftPosition} is ${solved.answer}.`, `स्थान ${leftPosition} पर अक्षर ${solved.answer} है।`, `ਥਾਂ ${leftPosition} ਉੱਤੇ ਅੱਖਰ ${solved.answer} ਹੈ।`),
        ],
        visualWorking: grid(l, original),
        shortcut: mode.endsWith("RIGHT") ? text(l, "Convert a right rank to a left rank before reading the word.", "शब्द पढ़ने से पहले दाएँ स्थान को बाएँ स्थान में बदलें।", "ਸ਼ਬਦ ਪੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਸੱਜੀ ਥਾਂ ਨੂੰ ਖੱਬੀ ਥਾਂ ਵਿੱਚ ਬਦਲੋ।") : text(l, "Write the position numbers once and read directly.", "स्थान-संख्याएँ एक बार लिखकर सीधे पढ़ें।", "ਥਾਂ ਨੰਬਰ ਇੱਕ ਵਾਰ ਲਿਖ ਕੇ ਸਿੱਧਾ ਪੜ੍ਹੋ।"),
      };
    }
    if (mode.includes("POSITION_OF_LETTER")) {
      const left = findOccurrencePosition(word, d.occurrenceRef!);
      const right = word.length - left + 1;
      return {
        coreConcept: text(l, "Repeated letters must be tracked by occurrence. Once the left position is known, the right position equals word length − left position + 1.", "दोहराए गए अक्षरों को उनकी उपस्थिति के क्रम से ट्रैक करें। बायाँ स्थान मिलने पर दायाँ स्थान = शब्द की लंबाई − बायाँ स्थान + 1 होता है।", "ਦੁਹਰਾਏ ਅੱਖਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਆਮਦ ਦੇ ਕ੍ਰਮ ਨਾਲ ਟ੍ਰੈਕ ਕਰੋ। ਖੱਬੀ ਥਾਂ ਮਿਲਣ ਉੱਤੇ ਸੱਜੀ ਥਾਂ = ਸ਼ਬਦ ਦੀ ਲੰਬਾਈ − ਖੱਬੀ ਥਾਂ + 1 ਹੁੰਦੀ ਹੈ।"),
        steps: [
          text(l, `Locate ${occurrencePhrase(l, d)} in ${word}.`, `${word} में ${occurrencePhrase(l, d)} को पहचानें।`, `${word} ਵਿੱਚ ${occurrencePhrase(l, d)} ਨੂੰ ਪਛਾਣੋ।`),
          text(l, `Its left position is ${left} and its right position is ${word.length} − ${left} + 1 = ${right}.`, `उसका बायाँ स्थान ${left} और दायाँ स्थान ${word.length} − ${left} + 1 = ${right} है।`, `ਉਸ ਦੀ ਖੱਬੀ ਥਾਂ ${left} ਅਤੇ ਸੱਜੀ ਥਾਂ ${word.length} − ${left} + 1 = ${right} ਹੈ।`),
          text(l, `The required answer is ${solved.answer}.`, `आवश्यक उत्तर ${solved.answer} है।`, `ਲੋੜੀਂਦਾ ਜਵਾਬ ${solved.answer} ਹੈ।`),
        ],
        visualWorking: grid(l, original),
        shortcut: text(l, "Label repeated letters as first, second, third before counting.", "गिनने से पहले दोहराए अक्षरों को पहली, दूसरी, तीसरी उपस्थिति के रूप में चिन्हित करें।", "ਗਿਣਣ ਤੋਂ ਪਹਿਲਾਂ ਦੁਹਰਾਏ ਅੱਖਰਾਂ ਨੂੰ ਪਹਿਲੀ, ਦੂਜੀ, ਤੀਜੀ ਆਮਦ ਵਜੋਂ ਨਿਸ਼ਾਨ ਲਗਾਓ।"),
      };
    }
    if (mode === "WORD_RELATIVE_RIGHT" || mode === "WORD_RELATIVE_LEFT") {
      const anchor = findOccurrencePosition(word, d.occurrenceRef!);
      const target = mode === "WORD_RELATIVE_RIGHT" ? anchor + d.offset! : anchor - d.offset!;
      return {
        coreConcept: text(l, "Find the exact occurrence first, then add for movement to the right or subtract for movement to the left.", "पहले अक्षर की सही उपस्थिति का स्थान ज्ञात करें; फिर दाईं चाल के लिए जोड़ें और बाईं चाल के लिए घटाएँ।", "ਪਹਿਲਾਂ ਅੱਖਰ ਦੀ ਸਹੀ ਆਮਦ ਦੀ ਥਾਂ ਲੱਭੋ; ਫਿਰ ਸੱਜੀ ਚਾਲ ਲਈ ਜੋੜੋ ਅਤੇ ਖੱਬੀ ਚਾਲ ਲਈ ਘਟਾਓ।"),
        steps: [
          text(l, `${occurrencePhrase(l, d)} is at position ${anchor}.`, `${occurrencePhrase(l, d)} स्थान ${anchor} पर है।`, `${occurrencePhrase(l, d)} ਥਾਂ ${anchor} ਉੱਤੇ ਹੈ।`),
          text(l, `Target position = ${anchor} ${mode.endsWith("RIGHT") ? "+" : "−"} ${d.offset} = ${target}.`, `लक्षित स्थान = ${anchor} ${mode.endsWith("RIGHT") ? "+" : "−"} ${d.offset} = ${target}।`, `ਨਿਸ਼ਾਨਾ ਥਾਂ = ${anchor} ${mode.endsWith("RIGHT") ? "+" : "−"} ${d.offset} = ${target}।`),
          text(l, `The letter at position ${target} is ${solved.answer}.`, `स्थान ${target} पर अक्षर ${solved.answer} है।`, `ਥਾਂ ${target} ਉੱਤੇ ਅੱਖਰ ${solved.answer} ਹੈ।`),
        ],
        visualWorking: grid(l, original),
        shortcut: text(l, "Anchor first, move second.", "पहले आधार-अक्षर का स्थान, फिर चाल।", "ਪਹਿਲਾਂ ਆਧਾਰ ਅੱਖਰ ਦੀ ਥਾਂ, ਫਿਰ ਚਾਲ।"),
      };
    }
    const middlePositions = word.length % 2 === 0 ? [word.length / 2, word.length / 2 + 1] : [(word.length + 1) / 2];
    return {
      coreConcept: text(l, "An odd-length word has one middle position; an even-length word has two middle positions.", "विषम लंबाई वाले शब्द में एक मध्य स्थान और सम लंबाई वाले शब्द में दो मध्य स्थान होते हैं।", "ਬੇ-ਜੋੜ ਲੰਬਾਈ ਵਾਲੇ ਸ਼ਬਦ ਵਿੱਚ ਇੱਕ ਮੱਧਲੀ ਥਾਂ ਅਤੇ ਜੋੜ ਲੰਬਾਈ ਵਾਲੇ ਸ਼ਬਦ ਵਿੱਚ ਦੋ ਮੱਧਲੀਆਂ ਥਾਵਾਂ ਹੁੰਦੀਆਂ ਹਨ।"),
      steps: [
        text(l, `Word length = ${word.length}.`, `शब्द की लंबाई = ${word.length}।`, `ਸ਼ਬਦ ਦੀ ਲੰਬਾਈ = ${word.length}।`),
        text(l, `Middle position${middlePositions.length === 2 ? "s are" : " is"} ${middlePositions.join(" and ")}.`, `मध्य स्थान ${middlePositions.join(" और ")} ${middlePositions.length === 2 ? "हैं" : "है"}।`, `ਮੱਧਲੀ${middlePositions.length === 2 ? "ਆਂ" : ""} ਥਾਂ${middlePositions.length === 2 ? "ਵਾਂ" : ""} ${middlePositions.join(" ਅਤੇ ")} ${middlePositions.length === 2 ? "ਹਨ" : "ਹੈ"}।`),
        text(l, `The required middle letter${middlePositions.length === 2 ? "s are" : " is"} ${solved.answer}.`, `आवश्यक मध्य अक्षर ${solved.answer} ${middlePositions.length === 2 ? "हैं" : "है"}।`, `ਲੋੜੀਂਦਾ ਮੱਧਲਾ ਅੱਖਰ ${solved.answer} ${middlePositions.length === 2 ? "ਹਨ" : "ਹੈ"}।`),
      ],
      visualWorking: grid(l, original),
      shortcut: text(l, "Odd length: (n + 1)/2. Even length: n/2 and n/2 + 1.", "विषम लंबाई: (n + 1)/2। सम लंबाई: n/2 और n/2 + 1।", "ਬੇ-ਜੋੜ ਲੰਬਾਈ: (n + 1)/2। ਜੋੜ ਲੰਬਾਈ: n/2 ਅਤੇ n/2 + 1।"),
    };
  }

  const refs = applyWordTransformRefs(word, d.wordTransformId, d.rangeStart, d.rangeEnd);
  const changed = refsToWord(refs);
  const unchanged = unchangedRefs(word, d.wordTransformId, d.rangeStart, d.rangeEnd);
  const steps = [
    text(l, `Write the original word with positions: ${word}.`, `मूल शब्द को स्थानों सहित लिखें: ${word}।`, `ਮੂਲ ਸ਼ਬਦ ਨੂੰ ਥਾਵਾਂ ਸਮੇਤ ਲਿਖੋ: ${word}।`),
    text(l, `Apply only the stated operation: ${wordTransform(l, d.wordTransformId, d)}.`, `केवल दी गई क्रिया लागू करें: ${wordTransform(l, d.wordTransformId, d)}।`, `ਕੇਵਲ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਓ: ${wordTransform(l, d.wordTransformId, d)}।`),
    text(l, `The new word is ${changed}.`, `नया शब्द ${changed} है।`, `ਨਵਾਂ ਸ਼ਬਦ ${changed} ਹੈ।`),
  ];
  if (mode.includes("COUNT_UNCHANGED")) {
    steps.push(text(l, `Compare position by position. ${unchanged.length} occurrence(s) remain unchanged, so the answer is ${solved.answer}.`, `स्थान-दर-स्थान तुलना करें। ${unchanged.length} अक्षर अपनी जगह पर रहते हैं, इसलिए उत्तर ${solved.answer} है।`, `ਥਾਂ-ਦਰ-ਥਾਂ ਤੁਲਨਾ ਕਰੋ। ${unchanged.length} ਅੱਖਰ ਆਪਣੀ ਥਾਂ ਉੱਤੇ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਜਵਾਬ ${solved.answer} ਹੈ।`));
  } else if (mode === "WORD_IDENTIFY_UNCHANGED_ASC") {
    steps.push(text(l, `The unchanged occurrence(s) are ${solved.answer}.`, `अपनी जगह पर रहने वाले अक्षर हैं: ${solved.answer}।`, `ਆਪਣੀ ਥਾਂ ਉੱਤੇ ਰਹਿਣ ਵਾਲੇ ਅੱਖਰ ਹਨ: ${solved.answer}।`));
  } else if (mode.startsWith("WORD_POSITION_AFTER")) {
    steps.push(text(l, `Locate ${occurrencePhrase(l, d)} in the new word; its position is ${solved.answer}.`, `नए शब्द में ${occurrencePhrase(l, d)} को खोजें; उसका स्थान ${solved.answer} है।`, `ਨਵੇਂ ਸ਼ਬਦ ਵਿੱਚ ${occurrencePhrase(l, d)} ਨੂੰ ਲੱਭੋ; ਉਸ ਦੀ ਥਾਂ ${solved.answer} ਹੈ।`));
  } else {
    steps.push(text(l, `Read ${positionLabel(l, d.position!)} in the new word; the letter is ${solved.answer}.`, `नए शब्द में ${positionLabel(l, d.position!)} पढ़ें; अक्षर ${solved.answer} है।`, `ਨਵੇਂ ਸ਼ਬਦ ਵਿੱਚ ${positionLabel(l, d.position!)} ਪੜ੍ਹੋ; ਅੱਖਰ ${solved.answer} ਹੈ।`));
  }

  let shortcut = text(l, "Build the new word once, then answer from the position row.", "नया शब्द एक बार बनाएँ और फिर स्थान-पंक्ति से उत्तर पढ़ें।", "ਨਵਾਂ ਸ਼ਬਦ ਇੱਕ ਵਾਰ ਬਣਾਓ ਅਤੇ ਫਿਰ ਥਾਂ ਵਾਲੀ ਕਤਾਰ ਤੋਂ ਜਵਾਬ ਪੜ੍ਹੋ।");
  if (d.wordTransformId === "REVERSE_RANGE" && d.occurrenceRef) {
    const old = findOccurrencePosition(word, d.occurrenceRef);
    if (old >= d.rangeStart! && old <= d.rangeEnd!) {
      const mapped = d.rangeStart! + d.rangeEnd! - old;
      shortcut = text(l, `Inside a reversed block, new position = start + end − old position = ${d.rangeStart} + ${d.rangeEnd} − ${old} = ${mapped}.`, `उलटे खंड के भीतर नया स्थान = आरंभ + अंत − पुराना स्थान = ${d.rangeStart} + ${d.rangeEnd} − ${old} = ${mapped}।`, `ਉਲਟੇ ਖੰਡ ਦੇ ਅੰਦਰ ਨਵੀਂ ਥਾਂ = ਸ਼ੁਰੂ + ਅੰਤ − ਪੁਰਾਣੀ ਥਾਂ = ${d.rangeStart} + ${d.rangeEnd} − ${old} = ${mapped}।`);
    }
  } else if (d.wordTransformId === "VOWELS_FIRST" || d.wordTransformId === "CONSONANTS_FIRST") {
    shortcut = text(l, "Make two stable groups; preserve the original left-to-right order inside each group.", "दो स्थिर समूह बनाएँ और हर समूह के भीतर मूल बाएँ-से-दाएँ क्रम को बनाए रखें।", "ਦੋ ਸਥਿਰ ਸਮੂਹ ਬਣਾਓ ਅਤੇ ਹਰ ਸਮੂਹ ਦੇ ਅੰਦਰ ਮੂਲ ਖੱਬੇ-ਤੋਂ-ਸੱਜੇ ਕ੍ਰਮ ਨੂੰ ਕਾਇਮ ਰੱਖੋ।");
  } else if (d.wordTransformId === "SWAP_ADJACENT") {
    shortcut = text(l, "Swap positions 1↔2, 3↔4, 5↔6, and so on.", "स्थान 1↔2, 3↔4, 5↔6 आदि बदलें।", "ਥਾਵਾਂ 1↔2, 3↔4, 5↔6 ਆਦਿ ਬਦਲੋ।");
  }
  return {
    coreConcept: text(l, "A word transformation changes positions, not letter identities. Preserve repeated-letter occurrences and apply only the explicitly stated operation.", "शब्द-पुनर्व्यवस्था अक्षरों की पहचान नहीं, केवल उनके स्थान बदलती है। दोहराए अक्षरों की उपस्थिति बनाए रखें और केवल स्पष्ट रूप से दी गई क्रिया लागू करें।", "ਸ਼ਬਦ ਮੁੜ-ਵਿਵਸਥਾ ਅੱਖਰਾਂ ਦੀ ਪਛਾਣ ਨਹੀਂ, ਕੇਵਲ ਉਨ੍ਹਾਂ ਦੀਆਂ ਥਾਵਾਂ ਬਦਲਦੀ ਹੈ। ਦੁਹਰਾਏ ਅੱਖਰਾਂ ਦੀ ਆਮਦ ਕਾਇਮ ਰੱਖੋ ਅਤੇ ਕੇਵਲ ਸਪਸ਼ਟ ਦਿੱਤੀ ਕਿਰਿਆ ਲਗਾਓ।"),
    steps,
    visualWorking: grid(l, original, [...changed]),
    shortcut,
  };
}

function pedagogyFor(ql: AlpQuestionLogic, d: AlpInstanceData, solved: AlpSolverResult, locale: AlpLocale): PedagogyBlock {
  switch (ql.checkpointId) {
    case "ALP-CP-001": return cp001Pedagogy(ql, d, solved, locale);
    case "ALP-CP-002": return cp002Pedagogy(ql, d, solved, locale);
    case "ALP-CP-003": return cp003Pedagogy(ql, d, solved, locale);
    case "ALP-CP-004": return cp004Pedagogy(ql, d, solved, locale);
    case "ALP-CP-005": return cp005Pedagogy(ql, d, solved, locale);
  }
}

function optionTrap(
  ql: AlpQuestionLogic,
  d: AlpInstanceData,
  solved: AlpSolverResult,
  option: AlpOption,
  optionIndex: number,
  locale: AlpLocale,
): AlpDistractorAnalysis {
  const value = option.value;
  const correct = solved.answer;
  let explanation: string;
  const numericValue = /^-?\d+$/.test(value) ? Number(value) : undefined;
  const numericCorrect = /^-?\d+$/.test(correct) ? Number(correct) : undefined;

  if (numericValue !== undefined && numericCorrect !== undefined && Math.abs(numericValue - numericCorrect) === 1) {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) is the typical one-position error caused by including or excluding an endpoint incorrectly.`, `विकल्प ${optionIndex + 1} (${value}) सामान्य एक-स्थान त्रुटि है, जो किसी सिरे को गलत ढंग से शामिल या बाहर करने से होती है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਆਮ ਇੱਕ-ਥਾਂ ਗਲਤੀ ਹੈ, ਜੋ ਕਿਸੇ ਸਿਰੇ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਸ਼ਾਮਲ ਜਾਂ ਬਾਹਰ ਕਰਨ ਨਾਲ ਹੁੰਦੀ ਹੈ।`);
  } else if (ql.checkpointId === "ALP-CP-005" && d.word && numericValue !== undefined) {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) comes from reading the wrong position or checking the original word instead of the fully rearranged word.`, `विकल्प ${optionIndex + 1} (${value}) गलत स्थान पढ़ने या पूरी पुनर्व्यवस्था के बजाय मूल शब्द देखने से मिलता है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਗਲਤ ਥਾਂ ਪੜ੍ਹਨ ਜਾਂ ਪੂਰੀ ਮੁੜ-ਵਿਵਸਥਾ ਦੀ ਬਜਾਏ ਮੂਲ ਸ਼ਬਦ ਵੇਖਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।`);
  } else if (ql.checkpointId === "ALP-CP-004") {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) reflects the original alphabet or a partially completed transformation rather than the final transformed order.`, `विकल्प ${optionIndex + 1} (${value}) अंतिम बदले क्रम के बजाय मूल वर्णमाला या अधूरी पुनर्व्यवस्था को दर्शाता है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਅੰਤਿਮ ਬਦਲੇ ਕ੍ਰਮ ਦੀ ਬਜਾਏ ਮੂਲ ਵਰਣਮਾਲਾ ਜਾਂ ਅਧੂਰੀ ਮੁੜ-ਵਿਵਸਥਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`);
  } else if (ql.solveMode.includes("RIGHT") || ql.solveMode.includes("LEFT")) {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) is obtained by using the opposite reference end or movement direction.`, `विकल्प ${optionIndex + 1} (${value}) विपरीत सिरे या विपरीत चाल-दिशा का प्रयोग करने से मिलता है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਉਲਟ ਸਿਰਾ ਜਾਂ ਉਲਟੀ ਚਾਲ-ਦਿਸ਼ਾ ਵਰਤਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।`);
  } else if (ql.solveMode.includes("GAP") || ql.solveMode.includes("SPAN") || ql.solveMode.includes("DISTANCE")) {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) mixes up positional distance, exclusive gap and inclusive span.`, `विकल्प ${optionIndex + 1} (${value}) स्थान-अंतर, केवल बीच के अक्षर और दोनों सिरों सहित गिनती को आपस में मिला देता है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਥਾਂ-ਫਰਕ, ਕੇਵਲ ਵਿਚਕਾਰਲੇ ਅੱਖਰ ਅਤੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਗਿਣਤੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਮਿਲਾ ਦਿੰਦਾ ਹੈ।`);
  } else if (/^[A-Z]$/.test(value) && /^[A-Z]$/.test(correct) && positionDistance(value, correct) <= 2) {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) results from stopping one or two alphabet steps before or after the correct letter ${correct}.`, `विकल्प ${optionIndex + 1} (${value}) सही अक्षर ${correct} से एक या दो स्थान पहले अथवा बाद में रुकने से मिलता है।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਸਹੀ ਅੱਖਰ ${correct} ਤੋਂ ਇੱਕ ਜਾਂ ਦੋ ਥਾਵਾਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਰੁਕਣ ਨਾਲ ਮਿਲਦਾ ਹੈ।`);
  } else {
    explanation = text(locale, `Option ${optionIndex + 1} (${value}) does not satisfy the complete position calculation shown above.`, `विकल्प ${optionIndex + 1} (${value}) ऊपर दिखाई गई पूरी स्थान-गणना को संतुष्ट नहीं करता।`, `ਵਿਕਲਪ ${optionIndex + 1} (${value}) ਉੱਪਰ ਦਿਖਾਈ ਪੂਰੀ ਥਾਂ-ਗਿਣਤੀ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।`);
  }
  return {
    optionIndex,
    optionValue: value,
    errorLabel: option.errorLabel ?? "UNCLASSIFIED_DISTRACTOR",
    explanation,
  };
}

export function renderAlpExplanationV2(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  options: readonly AlpOption[],
  correctIndex: number,
  locale: AlpLocale,
): AlpExplanation {
  const block = pedagogyFor(ql, data, solved, locale);
  const distractorAnalyses = options
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ optionIndex }) => optionIndex !== correctIndex)
    .map(({ option, optionIndex }) => optionTrap(ql, data, solved, option, optionIndex, locale));
  const conclusion = text(locale, `Therefore, the correct answer is ${solved.answer}.`, `अतः सही उत्तर ${solved.answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${solved.answer} ਹੈ।`);
  return {
    schemaVersion: "ALP-001-PEDAGOGY-V2",
    coreConcept: block.coreConcept,
    ruleStatement: block.coreConcept,
    steps: block.steps,
    visualWorking: block.visualWorking,
    examShortcut: block.shortcut,
    conclusion,
    distractorAnalyses,
    closestTrapRejection: distractorAnalyses[0]?.explanation ?? text(locale, "Use the complete position calculation.", "पूरी स्थान-गणना का प्रयोग करें।", "ਪੂਰੀ ਥਾਂ-ਗਿਣਤੀ ਵਰਤੋ।"),
  };
}
