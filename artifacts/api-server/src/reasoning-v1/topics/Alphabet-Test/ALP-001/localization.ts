import { describeTransformCore } from "./foundation/sequence";
import { occurrenceLabel } from "./foundation/word";
import type {
  AlpExplanation,
  AlpInstanceData,
  AlpLocale,
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

function ordinal(locale: AlpLocale, value: number): string {
  const suffix = value % 100 >= 11 && value % 100 <= 13
    ? "th"
    : value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th";
  return text(locale, `${value}${suffix}`, `${value}वें`, `${value}ਵੀਂ`);
}

function occurrence(locale: AlpLocale, data: AlpInstanceData): string {
  const ref = data.occurrenceRef!;
  return text(
    locale,
    `the ${occurrenceLabel(ref)}`,
    `${ref.letter} की ${ref.occurrence}वीं उपस्थिति`,
    `${ref.letter} ਦੇ ${ref.occurrence}ਵੀਂ ਵਾਰ ਆਉਣ ਵਾਲੇ ਅੱਖਰ`,
  );
}

function alphabetTransform(locale: AlpLocale, data: AlpInstanceData): string {
  if (locale === "en-IN") return describeTransformCore(data.transformId!, data.rotationStart);
  const hi: Record<string, string> = {
    REVERSE_ALL: "पूरी अंग्रेज़ी वर्णमाला को उलटे क्रम में लिखें",
    REVERSE_FIRST_HALF: "A–M को उलटें और N–Z को उसी क्रम में रखें",
    REVERSE_SECOND_HALF: "A–M को उसी क्रम में रखें और N–Z को उलटें",
    REVERSE_BOTH_HALVES: "A–M और N–Z को अलग-अलग उलटें",
    SWAP_HALVES: "N–Z को A–M से पहले लिखें",
    ROTATE_TO_START: `${data.rotationStart} से शुरू करके वर्णमाला को चक्रीय क्रम में लिखें`,
    ODD_THEN_EVEN: "पहले मूल विषम स्थानों और फिर सम स्थानों के अक्षर लिखें",
    EVEN_THEN_ODD: "पहले मूल सम स्थानों और फिर विषम स्थानों के अक्षर लिखें",
    ALTERNATE_LEFT_RIGHT: "बाएँ और दाएँ सिरों से बारी-बारी अक्षर लें, शुरुआत बाएँ से करें",
    ALTERNATE_RIGHT_LEFT: "दाएँ और बाएँ सिरों से बारी-बारी अक्षर लें, शुरुआत दाएँ से करें",
    REMOVE_VOWELS: "A, E, I, O और U हटा दें",
    REMOVE_CONSONANTS: "केवल A, E, I, O और U रखें",
    SWAP_ADJACENT_PAIRS: "हर साथ-साथ वाले अक्षर-युग्म को आपस में बदलें",
    REVERSE_BLOCKS_OF_THREE: "हर लगातार तीन अक्षरों के समूह को उलटें",
  };
  const pa: Record<string, string> = {
    REVERSE_ALL: "ਪੂਰੀ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ",
    REVERSE_FIRST_HALF: "A–M ਨੂੰ ਉਲਟੋ ਅਤੇ N–Z ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ",
    REVERSE_SECOND_HALF: "A–M ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ ਅਤੇ N–Z ਨੂੰ ਉਲਟੋ",
    REVERSE_BOTH_HALVES: "A–M ਅਤੇ N–Z ਨੂੰ ਵੱਖ-ਵੱਖ ਉਲਟੋ",
    SWAP_HALVES: "N–Z ਨੂੰ A–M ਤੋਂ ਪਹਿਲਾਂ ਲਿਖੋ",
    ROTATE_TO_START: `${data.rotationStart} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਵਰਣਮਾਲਾ ਨੂੰ ਚੱਕਰੀ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ`,
    ODD_THEN_EVEN: "ਪਹਿਲਾਂ ਮੂਲ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਅਤੇ ਫਿਰ ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ",
    EVEN_THEN_ODD: "ਪਹਿਲਾਂ ਮੂਲ ਜੋੜ ਥਾਵਾਂ ਅਤੇ ਫਿਰ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ",
    ALTERNATE_LEFT_RIGHT: "ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਸਿਰਿਆਂ ਤੋਂ ਵਾਰੀ-ਵਾਰੀ ਅੱਖਰ ਲਵੋ, ਸ਼ੁਰੂਆਤ ਖੱਬੇ ਤੋਂ ਕਰੋ",
    ALTERNATE_RIGHT_LEFT: "ਸੱਜੇ ਅਤੇ ਖੱਬੇ ਸਿਰਿਆਂ ਤੋਂ ਵਾਰੀ-ਵਾਰੀ ਅੱਖਰ ਲਵੋ, ਸ਼ੁਰੂਆਤ ਸੱਜੇ ਤੋਂ ਕਰੋ",
    REMOVE_VOWELS: "A, E, I, O ਅਤੇ U ਹਟਾ ਦਿਓ",
    REMOVE_CONSONANTS: "ਕੇਵਲ A, E, I, O ਅਤੇ U ਰੱਖੋ",
    SWAP_ADJACENT_PAIRS: "ਹਰ ਨਾਲ-ਨਾਲ ਦੇ ਅੱਖਰਾਂ ਦੀ ਜੋੜੀ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ",
    REVERSE_BLOCKS_OF_THREE: "ਹਰ ਲਗਾਤਾਰ ਤਿੰਨ ਅੱਖਰਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਉਲਟੋ",
  };
  return (locale === "hi-IN" ? hi : pa)[data.transformId!]!;
}

function wordTransform(locale: AlpLocale, id: AlpWordTransformId, data: AlpInstanceData): string {
  const en: Record<AlpWordTransformId, string> = {
    REVERSE: "reverse the word",
    ASC_SORT: "arrange its letters alphabetically",
    DESC_SORT: "arrange its letters in reverse alphabetical order",
    VOWELS_FIRST: "place vowels first while preserving the order within both groups",
    CONSONANTS_FIRST: "place consonants first while preserving the order within both groups",
    ODD_THEN_EVEN: "write odd-position letters first and even-position letters next",
    EVEN_THEN_ODD: "write even-position letters first and odd-position letters next",
    SWAP_ADJACENT: "interchange every adjacent pair",
    REVERSE_RANGE: `reverse positions ${data.rangeStart} to ${data.rangeEnd}`,
  };
  const hi: Record<AlpWordTransformId, string> = {
    REVERSE: "शब्द को उलटें",
    ASC_SORT: "अक्षरों को वर्णक्रम में लगाएँ",
    DESC_SORT: "अक्षरों को उलटे वर्णक्रम में लगाएँ",
    VOWELS_FIRST: "स्वरों को पहले रखते हुए दोनों समूहों का मूल क्रम बनाए रखें",
    CONSONANTS_FIRST: "व्यंजनों को पहले रखते हुए दोनों समूहों का मूल क्रम बनाए रखें",
    ODD_THEN_EVEN: "पहले विषम और फिर सम स्थानों के अक्षर लिखें",
    EVEN_THEN_ODD: "पहले सम और फिर विषम स्थानों के अक्षर लिखें",
    SWAP_ADJACENT: "हर साथ-साथ वाले अक्षर-युग्म को बदलें",
    REVERSE_RANGE: `${data.rangeStart}वें से ${data.rangeEnd}वें स्थान तक के अक्षर उलटें`,
  };
  const pa: Record<AlpWordTransformId, string> = {
    REVERSE: "ਸ਼ਬਦ ਨੂੰ ਉਲਟੋ",
    ASC_SORT: "ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ",
    DESC_SORT: "ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ",
    VOWELS_FIRST: "ਸਵਰ ਪਹਿਲਾਂ ਰੱਖਦੇ ਹੋਏ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਮੂਲ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ",
    CONSONANTS_FIRST: "ਵਿਅੰਜਨ ਪਹਿਲਾਂ ਰੱਖਦੇ ਹੋਏ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਮੂਲ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ",
    ODD_THEN_EVEN: "ਪਹਿਲਾਂ ਬੇ-ਜੋੜ ਅਤੇ ਫਿਰ ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ",
    EVEN_THEN_ODD: "ਪਹਿਲਾਂ ਜੋੜ ਅਤੇ ਫਿਰ ਬੇ-ਜੋੜ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ",
    SWAP_ADJACENT: "ਹਰ ਨਾਲ-ਨਾਲ ਦੇ ਅੱਖਰਾਂ ਦੀ ਜੋੜੀ ਬਦਲੋ",
    REVERSE_RANGE: `${data.rangeStart}ਵੀਂ ਤੋਂ ${data.rangeEnd}ਵੀਂ ਥਾਂ ਤੱਕ ਦੇ ਅੱਖਰ ਉਲਟੋ`,
  };
  return locale === "en-IN" ? en[id] : locale === "hi-IN" ? hi[id] : pa[id];
}

function renderCp001(ql: AlpQuestionLogic, d: AlpInstanceData, l: AlpLocale): string {
  switch (ql.solveMode) {
    case "LETTER_AT_LEFT_RANK":
      return text(l, `Which letter is ${ordinal(l, d.rank!)} from the left in the English alphabet?`, `अंग्रेज़ी वर्णमाला में बाईं ओर से ${ordinal(l, d.rank!)} अक्षर कौन-सा है?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${ordinal(l, d.rank!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
    case "LETTER_AT_RIGHT_RANK":
      return text(l, `Which letter is ${ordinal(l, d.rank!)} from the right in the English alphabet?`, `अंग्रेज़ी वर्णमाला में दाईं ओर से ${ordinal(l, d.rank!)} अक्षर कौन-सा है?`, `ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ${ordinal(l, d.rank!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
    case "LEFT_RANK_OF_LETTER":
    case "RIGHT_RANK_OF_LETTER": {
      const direction = ql.solveMode.startsWith("LEFT") ? "LEFT" : "RIGHT";
      return text(l, `What is the position of ${d.letter} from the ${side(l, direction)}?`, `${d.letter} का स्थान ${side(l, direction)} से कौन-सा है?`, `${d.letter} ਦੀ ਥਾਂ ${side(l, direction)} ਤੋਂ ਕਿਹੜੀ ਹੈ?`);
    }
    case "RIGHT_RANK_FROM_LEFT_RANK":
    case "LEFT_RANK_FROM_RIGHT_RANK": {
      const from = ql.solveMode.startsWith("RIGHT") ? "LEFT" : "RIGHT";
      const to = from === "LEFT" ? "RIGHT" : "LEFT";
      return text(l, `A letter is ${ordinal(l, d.rank!)} from the ${side(l, from)}. What is its position from the ${side(l, to)}?`, `कोई अक्षर ${side(l, from)} से ${ordinal(l, d.rank!)} है। ${side(l, to)} से उसका स्थान क्या होगा?`, `ਕੋਈ ਅੱਖਰ ${side(l, from)} ਤੋਂ ${ordinal(l, d.rank!)} ਹੈ। ${side(l, to)} ਤੋਂ ਉਸ ਦੀ ਥਾਂ ਕੀ ਹੋਵੇਗੀ?`);
    }
    case "OPPOSITE_OF_LETTER":
      return text(l, `Which letter is opposite to ${d.letter} in A–Z pairing?`, `A–Z की विपरीत जोड़ी में ${d.letter} के सामने कौन-सा अक्षर है?`, `A–Z ਦੀ ਵਿਰੋਧੀ ਜੋੜੀ ਵਿੱਚ ${d.letter} ਦੇ ਸਾਹਮਣੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    case "OPPOSITE_OF_LEFT_RANK":
    case "OPPOSITE_OF_RIGHT_RANK": {
      const direction = ql.solveMode.includes("LEFT") ? "LEFT" : "RIGHT";
      return text(l, `Find the opposite of the letter that is ${ordinal(l, d.rank!)} from the ${side(l, direction)}.`, `${side(l, direction)} से ${ordinal(l, d.rank!)} अक्षर का विपरीत अक्षर बताइए।`, `${side(l, direction)} ਤੋਂ ${ordinal(l, d.rank!)} ਅੱਖਰ ਦਾ ਵਿਰੋਧੀ ਅੱਖਰ ਦੱਸੋ।`);
    }
    case "BOTH_RANKS_OF_LETTER":
      return text(l, `Give the left and right positions of ${d.letter}, in that order.`, `${d.letter} के बाईं और दाईं ओर से स्थान इसी क्रम में बताइए।`, `${d.letter} ਦੀਆਂ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਥਾਵਾਂ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਦੱਸੋ।`);
    case "IDENTIFY_LETTER_FROM_RANK_PAIR":
      return text(l, `Which letter is ${ordinal(l, d.rank!)} from the left and ${ordinal(l, d.secondRank!)} from the right?`, `कौन-सा अक्षर बाईं ओर से ${ordinal(l, d.rank!)} और दाईं ओर से ${ordinal(l, d.secondRank!)} है?`, `ਕਿਹੜਾ ਅੱਖਰ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${ordinal(l, d.rank!)} ਅਤੇ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ${ordinal(l, d.secondRank!)} ਹੈ?`);
    case "IDENTIFY_OPPOSITE_PAIR":
      return text(l, "Select the pair of opposite English-alphabet letters.", "अंग्रेज़ी वर्णमाला के विपरीत अक्षरों की सही जोड़ी चुनिए।", "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਦੇ ਵਿਰੋਧੀ ਅੱਖਰਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਚੁਣੋ।");
    default:
      throw new Error(`No CP-001 stem for ${ql.solveMode}.`);
  }
}

function renderCp002(ql: AlpQuestionLogic, d: AlpInstanceData, l: AlpLocale): string {
  const mode = ql.solveMode;
  if (mode.startsWith("SHIFT_") && mode.includes("FROM_")) {
    const reference = mode.includes("FROM_LEFT") ? "LEFT" : "RIGHT";
    return text(l, `Starting from the letter ${ordinal(l, d.rank!)} from the ${side(l, reference)}, move ${d.offset} places to the ${side(l, d.direction!)}. Which letter is reached?`, `${side(l, reference)} से ${ordinal(l, d.rank!)} अक्षर से ${side(l, d.direction!)} ${d.offset} स्थान चलें। कौन-सा अक्षर मिलेगा?`, `${side(l, reference)} ਤੋਂ ${ordinal(l, d.rank!)} ਅੱਖਰ ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਓ। ਕਿਹੜਾ ਅੱਖਰ ਮਿਲੇਗਾ?`);
  }
  if (mode === "SHIFT_RIGHT_FROM_LETTER_BOUNDED" || mode === "SHIFT_LEFT_FROM_LETTER_BOUNDED") {
    return text(l, `Which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${d.letter}?`, `${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
  }
  if (mode.startsWith("RECOVER_ANCHOR")) {
    return text(l, `Moving ${d.offset} places to the ${side(l, d.direction!)} reaches ${d.targetLetter}. Find the starting letter${mode.includes("CYCLIC") ? " using cyclic order" : ""}.`, `${side(l, d.direction!)} ${d.offset} स्थान चलने पर ${d.targetLetter} मिलता है। प्रारंभिक अक्षर${mode.includes("CYCLIC") ? " चक्रीय क्रम से" : ""} ज्ञात कीजिए।`, `${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਣ ਉੱਤੇ ${d.targetLetter} ਮਿਲਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ${mode.includes("CYCLIC") ? " ਚੱਕਰੀ ਕ੍ਰਮ ਨਾਲ" : ""} ਲੱਭੋ।`);
  }
  if (mode === "FIND_FORWARD_OFFSET" || mode === "FIND_BACKWARD_OFFSET") {
    return text(l, `How many places must one move from ${d.letter} to the ${side(l, d.direction!)} to reach ${d.targetLetter}?`, `${d.letter} से ${d.targetLetter} तक ${side(l, d.direction!)} कितने स्थान चलना होगा?`, `${d.letter} ਤੋਂ ${d.targetLetter} ਤੱਕ ${side(l, d.direction!)} ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਜਾਣਾ ਪਵੇਗਾ?`);
  }
  if (mode === "FIND_SIGNED_DIRECTION_AND_OFFSET") {
    return text(l, `State the direction and number of places from ${d.letter} to ${d.targetLetter}.`, `${d.letter} से ${d.targetLetter} तक दिशा और स्थानों की संख्या बताइए।`, `${d.letter} ਤੋਂ ${d.targetLetter} ਤੱਕ ਦਿਸ਼ਾ ਅਤੇ ਥਾਵਾਂ ਦੀ ਗਿਣਤੀ ਦੱਸੋ।`);
  }
  if (mode === "TWO_STAGE_RIGHT_THEN_LEFT" || mode === "TWO_STAGE_LEFT_THEN_RIGHT") {
    const first = d.direction!;
    const second = first === "RIGHT" ? "LEFT" : "RIGHT";
    return text(l, `From ${d.letter}, move ${d.offset} places to the ${side(l, first)} and then ${d.secondOffset} places to the ${side(l, second)}. Which letter is reached?`, `${d.letter} से पहले ${side(l, first)} ${d.offset} और फिर ${side(l, second)} ${d.secondOffset} स्थान चलें। कौन-सा अक्षर मिलेगा?`, `${d.letter} ਤੋਂ ਪਹਿਲਾਂ ${side(l, first)} ${d.offset} ਅਤੇ ਫਿਰ ${side(l, second)} ${d.secondOffset} ਥਾਵਾਂ ਜਾਓ। ਕਿਹੜਾ ਅੱਖਰ ਮਿਲੇਗਾ?`);
  }
  if (mode.startsWith("POSITION_AFTER_SHIFT")) {
    const from = mode.endsWith("LEFT") ? "LEFT" : "RIGHT";
    return text(l, `Move ${d.offset} places to the ${side(l, d.direction!)} from ${d.letter}. What is the reached letter's position from the ${side(l, from)}?`, `${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान चलें। मिले अक्षर का स्थान ${side(l, from)} से क्या है?`, `${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਜਾਓ। ਮਿਲੇ ਅੱਖਰ ਦੀ ਥਾਂ ${side(l, from)} ਤੋਂ ਕੀ ਹੈ?`);
  }
  if (mode.startsWith("CYCLIC_SHIFT")) {
    return text(l, `Using cyclic alphabet order, which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${d.letter}?`, `चक्रीय वर्णमाला में ${d.letter} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `ਚੱਕਰੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
  }
  throw new Error(`No CP-002 stem for ${mode}.`);
}

function renderCp003(ql: AlpQuestionLogic, d: AlpInstanceData, l: AlpLocale): string {
  switch (ql.solveMode) {
    case "EXCLUSIVE_GAP": return text(l, `How many letters lie strictly between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के बीच कितने अक्षर हैं?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?`);
    case "INCLUSIVE_SPAN": return text(l, `How many positions run from ${d.letter} to ${d.secondLetter}, including both endpoints?`, `${d.letter} से ${d.secondLetter} तक दोनों सिरों सहित कितने स्थान हैं?`, `${d.letter} ਤੋਂ ${d.secondLetter} ਤੱਕ ਦੋਵੇਂ ਸਿਰਿਆਂ ਸਮੇਤ ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਹਨ?`);
    case "ABSOLUTE_POSITION_DISTANCE": return text(l, `What is the alphabetic position-distance between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के स्थानों का अंतर क्या है?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਫਰਕ ਕਿੰਨਾ ਹੈ?`);
    case "MIDPOINT_SINGLE": return text(l, `Which letter is exactly midway between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के ठीक बीच कौन-सा अक्षर है?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਬਿਲਕੁਲ ਵਿਚਕਾਰ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    case "MIDPOINT_PAIR": return text(l, `Which two letters occupy the middle positions between ${d.letter} and ${d.secondLetter}?`, `${d.letter} और ${d.secondLetter} के दो मध्य अक्षर कौन-से हैं?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦੇ ਦੋ ਮੱਧਲੇ ਅੱਖਰ ਕਿਹੜੇ ਹਨ?`);
    case "IDENTIFY_PAIR_WITH_GAP": return text(l, `Select the pair with exactly ${d.rank} letters between its letters.`, `वह जोड़ी चुनिए जिसके अक्षरों के बीच ठीक ${d.rank} अक्षर हैं।`, `ਉਹ ਜੋੜੀ ਚੁਣੋ ਜਿਸ ਦੇ ਅੱਖਰਾਂ ਵਿਚਕਾਰ ਠੀਕ ${d.rank} ਅੱਖਰ ਹਨ।`);
    case "IDENTIFY_PAIR_WITH_DISTANCE": return text(l, `Select the pair whose alphabetic position-distance is ${d.rank}.`, `वह जोड़ी चुनिए जिसके अक्षरों के स्थानों का अंतर ${d.rank} है।`, `ਉਹ ਜੋੜੀ ਚੁਣੋ ਜਿਸ ਦੇ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਫਰਕ ${d.rank} ਹੈ।`);
    case "RECOVER_RIGHT_ENDPOINT_FROM_GAP":
    case "RECOVER_LEFT_ENDPOINT_FROM_GAP": return text(l, `There are ${d.rank} letters between ${d.letter} and another letter to its ${side(l, d.direction!)}. Find that letter.`, `${d.letter} और उसके ${side(l, d.direction!)} स्थित अक्षर के बीच ${d.rank} अक्षर हैं। दूसरा अक्षर बताइए।`, `${d.letter} ਅਤੇ ਇਸ ਦੇ ${side(l, d.direction!)} ਪਏ ਅੱਖਰ ਵਿਚਕਾਰ ${d.rank} ਅੱਖਰ ਹਨ। ਦੂਜਾ ਅੱਖਰ ਦੱਸੋ।`);
    case "RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION": return text(l, `Which letter is ${d.rank} alphabet positions to the ${side(l, d.direction!)} of ${d.letter}?`, `${d.letter} से ${side(l, d.direction!)} ${d.rank} वर्णमाला स्थान पर कौन-सा अक्षर है?`, `${d.letter} ਤੋਂ ${side(l, d.direction!)} ${d.rank} ਵਰਣਮਾਲਾ ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
    case "MIDPOINT_DISTANCE_FROM_ENDPOINTS": return text(l, `How many positions is the middle letter of ${d.letter} and ${d.secondLetter} from either endpoint?`, `${d.letter} और ${d.secondLetter} का मध्य अक्षर किसी भी सिरे से कितने स्थान दूर है?`, `${d.letter} ਅਤੇ ${d.secondLetter} ਦਾ ਮੱਧਲਾ ਅੱਖਰ ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਦੂਰ ਹੈ?`);
    case "RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE": return text(l, `${d.midpoint} is the middle letter. Which letters are ${d.rank} positions away on its two sides?`, `${d.midpoint} मध्य अक्षर है। उसके दोनों ओर ${d.rank} स्थान दूर कौन-से अक्षर हैं?`, `${d.midpoint} ਮੱਧਲਾ ਅੱਖਰ ਹੈ। ਇਸ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ${d.rank} ਥਾਵਾਂ ਦੂਰ ਕਿਹੜੇ ਅੱਖਰ ਹਨ?`);
    case "COMPARE_TWO_GAPS": return text(l, `By how many do the gaps in ${d.pairA![0]}:${d.pairA![1]} and ${d.pairB![0]}:${d.pairB![1]} differ?`, `${d.pairA![0]}:${d.pairA![1]} और ${d.pairB![0]}:${d.pairB![1]} के बीच की अक्षर-संख्याओं में कितना अंतर है?`, `${d.pairA![0]}:${d.pairA![1]} ਅਤੇ ${d.pairB![0]}:${d.pairB![1]} ਵਿਚਕਾਰ ਅੱਖਰ-ਗਿਣਤੀਆਂ ਵਿੱਚ ਕਿੰਨਾ ਫਰਕ ਹੈ?`);
    case "COUNT_LETTERS_OUTSIDE_INTERVAL": return text(l, `How many letters lie outside the inclusive interval ${d.letter} to ${d.secondLetter}?`, `${d.letter} से ${d.secondLetter} तक के समावेशी भाग के बाहर कितने अक्षर हैं?`, `${d.letter} ਤੋਂ ${d.secondLetter} ਤੱਕ ਦੇ ਸਮੇਤ ਹਿੱਸੇ ਤੋਂ ਬਾਹਰ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?`);
    case "COUNT_LETTERS_BEFORE_AND_AFTER": return text(l, `Give the counts before the earlier of ${d.letter}/${d.secondLetter} and after the later one, in that order.`, `${d.letter}/${d.secondLetter} में पहले अक्षर से पहले और बाद वाले अक्षर के बाद की गिनती इसी क्रम में बताइए।`, `${d.letter}/${d.secondLetter} ਵਿੱਚ ਪਹਿਲੇ ਅੱਖਰ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਵਾਲੇ ਅੱਖਰ ਤੋਂ ਬਾਅਦ ਦੀ ਗਿਣਤੀ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਦੱਸੋ।`);
    case "EQUAL_SIDE_GAP": return text(l, `How many letters lie between the midpoint and either endpoint of ${d.letter} to ${d.secondLetter}?`, `${d.letter} से ${d.secondLetter} के मध्य अक्षर और किसी भी सिरे के बीच कितने अक्षर हैं?`, `${d.letter} ਤੋਂ ${d.secondLetter} ਦੇ ਮੱਧਲੇ ਅੱਖਰ ਅਤੇ ਕਿਸੇ ਵੀ ਸਿਰੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?`);
    default: throw new Error(`No CP-003 stem for ${ql.solveMode}.`);
  }
}

function renderCp005(ql: AlpQuestionLogic, d: AlpInstanceData, l: AlpLocale): string {
  const mode = ql.solveMode;
  if (mode === "WORD_LETTER_FROM_LEFT" || mode === "WORD_LETTER_FROM_RIGHT") {
    const direction = mode.endsWith("LEFT") ? "LEFT" : "RIGHT";
    return text(l, `In ${d.word}, which letter is ${ordinal(l, d.position!)} from the ${side(l, direction)}?`, `${d.word} में ${side(l, direction)} से ${ordinal(l, d.position!)} अक्षर कौन-सा है?`, `${d.word} ਵਿੱਚ ${side(l, direction)} ਤੋਂ ${ordinal(l, d.position!)} ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
  }
  if (mode === "WORD_LEFT_POSITION_OF_LETTER" || mode === "WORD_RIGHT_POSITION_OF_LETTER") {
    const direction = mode.includes("LEFT") ? "LEFT" : "RIGHT";
    return text(l, `In ${d.word}, what is the position of ${occurrence(l, d)} from the ${side(l, direction)}?`, `${d.word} में ${occurrence(l, d)} का स्थान ${side(l, direction)} से क्या है?`, `${d.word} ਵਿੱਚ ${occurrence(l, d)} ਦੀ ਥਾਂ ${side(l, direction)} ਤੋਂ ਕੀ ਹੈ?`);
  }
  if (mode === "WORD_RELATIVE_RIGHT" || mode === "WORD_RELATIVE_LEFT") {
    return text(l, `In ${d.word}, which letter is ${d.offset} places to the ${side(l, d.direction!)} of ${occurrence(l, d)}?`, `${d.word} में ${occurrence(l, d)} से ${side(l, d.direction!)} ${d.offset} स्थान पर कौन-सा अक्षर है?`, `${d.word} ਵਿੱਚ ${occurrence(l, d)} ਤੋਂ ${side(l, d.direction!)} ${d.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
  }
  if (mode === "WORD_MIDDLE_SINGLE") return text(l, `What is the middle letter of ${d.word}?`, `${d.word} का मध्य अक्षर कौन-सा है?`, `${d.word} ਦਾ ਮੱਧਲਾ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`);
  if (mode === "WORD_MIDDLE_PAIR") return text(l, `What are the two middle letters of ${d.word}?`, `${d.word} के दो मध्य अक्षर कौन-से हैं?`, `${d.word} ਦੇ ਦੋ ਮੱਧਲੇ ਅੱਖਰ ਕਿਹੜੇ ਹਨ?`);
  if (mode === "WORD_COUNT_UNCHANGED_ASC" || mode === "WORD_COUNT_UNCHANGED_DESC" || mode === "WORD_COUNT_UNCHANGED_SELECTED_TRANSFORM") {
    return text(l, `In ${d.word}, if you ${wordTransform(l, d.wordTransformId!, d)}, how many letter occurrences remain in the same positions?`, `${d.word} में यदि आप ${wordTransform(l, d.wordTransformId!, d)}, तो कितने अक्षर अपनी पुरानी जगह पर रहेंगे?`, `${d.word} ਵਿੱਚ ਜੇ ਤੁਸੀਂ ${wordTransform(l, d.wordTransformId!, d)}, ਤਾਂ ਕਿੰਨੇ ਅੱਖਰ ਆਪਣੀ ਪੁਰਾਣੀ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`);
  }
  if (mode === "WORD_IDENTIFY_UNCHANGED_ASC") {
    return text(l, `After arranging ${d.word} alphabetically, which letter occurrences remain in their original positions?`, `${d.word} को वर्णक्रम में लगाने पर कौन-से अक्षर अपनी मूल जगह पर रहते हैं?`, `${d.word} ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਉੱਤੇ ਕਿਹੜੇ ਅੱਖਰ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿੰਦੇ ਹਨ?`);
  }
  if (d.wordTransformId && mode.startsWith("WORD_POSITION_AFTER")) {
    return text(l, `In ${d.word}, ${wordTransform(l, d.wordTransformId, d)}. What is the new position of ${occurrence(l, d)} from the left?`, `${d.word} में ${wordTransform(l, d.wordTransformId, d)}। ${occurrence(l, d)} का नया स्थान बाईं ओर से क्या है?`, `${d.word} ਵਿੱਚ ${wordTransform(l, d.wordTransformId, d)}। ${occurrence(l, d)} ਦੀ ਨਵੀਂ ਥਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਕੀ ਹੈ?`);
  }
  if (d.wordTransformId && d.position) {
    return text(l, `In ${d.word}, ${wordTransform(l, d.wordTransformId, d)}. Which letter is at position ${d.position} from the left?`, `${d.word} में ${wordTransform(l, d.wordTransformId, d)}। बाईं ओर से ${d.position}वें स्थान पर कौन-सा अक्षर है?`, `${d.word} ਵਿੱਚ ${wordTransform(l, d.wordTransformId, d)}। ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${d.position}ਵੀਂ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`);
  }
  throw new Error(`No CP-005 stem for ${mode}.`);
}

export function renderAlpStem(ql: AlpQuestionLogic, data: AlpInstanceData, locale: AlpLocale): string {
  if (ql.checkpointId === "ALP-CP-001") return renderCp001(ql, data, locale);
  if (ql.checkpointId === "ALP-CP-002") return renderCp002(ql, data, locale);
  if (ql.checkpointId === "ALP-CP-003") return renderCp003(ql, data, locale);
  if (ql.checkpointId === "ALP-CP-004") {
    if (ql.solveMode === "LETTER_AT_TRANSFORMED_POSITION") {
      return text(locale, `If you ${alphabetTransform(locale, data)}, which letter is at left position ${data.position}?`, `यदि आप ${alphabetTransform(locale, data)}, तो बाईं ओर से ${data.position}वें स्थान पर कौन-सा अक्षर होगा?`, `ਜੇ ਤੁਸੀਂ ${alphabetTransform(locale, data)}, ਤਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ${data.position}ਵੀਂ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    }
    return text(locale, `If you ${alphabetTransform(locale, data)}, what is ${data.targetLetter}'s position from the left?`, `यदि आप ${alphabetTransform(locale, data)}, तो ${data.targetLetter} का स्थान बाईं ओर से क्या होगा?`, `ਜੇ ਤੁਸੀਂ ${alphabetTransform(locale, data)}, ਤਾਂ ${data.targetLetter} ਦੀ ਥਾਂ ਖੱਬੇ ਪਾਸੇ ਤੋਂ ਕੀ ਹੋਵੇਗੀ?`);
  }
  return renderCp005(ql, data, locale);
}

export function renderAlpExplanation(
  _ql: AlpQuestionLogic,
  _data: AlpInstanceData,
  solved: AlpSolverResult,
  locale: AlpLocale,
): AlpExplanation {
  return {
    ruleStatement: text(
      locale,
      "Use the stated alphabet or word-position operation exactly, keeping the reference end and counting convention unchanged.",
      "दिए गए वर्णमाला या शब्द-स्थान नियम को ठीक उसी क्रम में लागू करें और गिनती की दिशा न बदलें।",
      "ਦਿੱਤੇ ਵਰਣਮਾਲਾ ਜਾਂ ਸ਼ਬਦ-ਥਾਂ ਵਾਲੇ ਨਿਯਮ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਗੂ ਕਰੋ ਅਤੇ ਗਿਣਤੀ ਦੀ ਦਿਸ਼ਾ ਨਾ ਬਦਲੋ।",
    ),
    steps: solved.trace.length
      ? solved.trace
      : [text(locale, "Apply the stated operation.", "दिया गया नियम लागू करें।", "ਦਿੱਤਾ ਨਿਯਮ ਲਾਗੂ ਕਰੋ।")],
    conclusion: text(locale, `Therefore, the answer is ${solved.answer}.`, `अतः सही उत्तर ${solved.answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${solved.answer} ਹੈ।`),
    closestTrapRejection: text(
      locale,
      "Do not reverse the reference end, include an excluded endpoint, or stop before completing the rearrangement.",
      "दिशा न बदलें, बाहर रखे गए सिरे को न गिनें और पुनर्व्यवस्था अधूरी न छोड़ें।",
      "ਦਿਸ਼ਾ ਨਾ ਬਦਲੋ, ਬਾਹਰ ਰੱਖੇ ਸਿਰੇ ਨੂੰ ਨਾ ਗਿਣੋ ਅਤੇ ਮੁੜ-ਕ੍ਰਮ ਅਧੂਰਾ ਨਾ ਛੱਡੋ।",
    ),
  };
}
