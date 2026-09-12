import { letterAtOneBased, oneBasedPosition } from "./independent-solver";
import { serCp008AuthorityByQlId, type SerCp008MixedQlId } from "./question-language";
import type {
  GeneratedSerCp008Question,
  SerCp008Difficulty,
  SerCp008Locale,
  SerCp008Option,
} from "./runtime";

const MAX_ATTEMPTS = 80;

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x85ebca6b) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function pick<T>(next: () => number, values: readonly T[]): T {
  return values[Math.floor(next() * values.length)]!;
}

function text(locale: SerCp008Locale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function rotateLeft(value: string): string {
  return value.slice(1) + value[0];
}

function rotateRight(value: string): string {
  return value.at(-1)! + value.slice(0, -1);
}

function answerIndex(qlId: SerCp008MixedQlId, seed: number): number {
  return ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
}

function buildOptions(
  qlId: SerCp008MixedQlId,
  seed: number,
  correct: string,
  candidates: readonly SerCp008Option[],
): { readonly options: readonly SerCp008Option[]; readonly correctIndex: number } | null {
  const seen = new Set<string>([correct]);
  const wrong: SerCp008Option[] = [];
  for (const candidate of candidates) {
    if (!candidate.errorLabel || !candidate.value || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) return null;
  const index = answerIndex(qlId, seed);
  const options = [...wrong];
  options.splice(index, 0, { value: correct, errorLabel: null });
  return { options, correctIndex: index };
}

function difficulty(features: Readonly<Record<string, number | boolean | string>>): SerCp008Difficulty {
  let burden = 0;
  burden += Number(features.activeChannels ?? 1) - 1;
  if (features.progressiveJump === true) burden += 2;
  if (features.interleavedRows === 2) burden += 2;
  if (features.relationalBinding === true) burden += 1;
  if (features.squareCoupling === true) burden += 1;
  if (features.wrongTermDetection === true) burden += 1;
  if (features.internalMissingTerm === true) burden += 2;
  if (features.multiBlankCompletion === true) burden += 2;
  if (features.alphabetWrap === true) burden += 1;
  if (features.rotation === true) burden += 1;
  if (burden <= 1) return "EASY";
  if (burden <= 3) return "MEDIUM";
  return "HARD";
}

function generated(
  qlId: SerCp008MixedQlId,
  seed: number,
  locale: SerCp008Locale,
  stem: string,
  correctAnswer: string,
  optionResult: { readonly options: readonly SerCp008Option[]; readonly correctIndex: number },
  explanation: readonly string[],
  structuralFeatures: Readonly<Record<string, number | boolean | string>>,
): GeneratedSerCp008Question {
  return {
    qlId,
    authorityId: serCp008AuthorityByQlId(qlId).authorityId,
    seed,
    locale,
    difficulty: difficulty(structuralFeatures),
    stem,
    options: optionResult.options,
    correctIndex: optionResult.correctIndex,
    correctAnswer,
    explanation,
    structuralFeatures,
  };
}

function generate019(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-019" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 131 + attempt * 1009 + 19);
    const letters: string[] = [];
    while (letters.length < 6) {
      const letter = letterAtOneBased(integer(next, 1, 26));
      if (!letters.includes(letter)) letters.push(letter);
    }
    const shown = letters.slice(0, 5).map((letter) => `${letter}${oneBasedPosition(letter)}`);
    const target = letters[5]!;
    const correct = String(oneBasedPosition(target));
    const reverse = String(27 - oneBasedPosition(target));
    const previous = String(oneBasedPosition(letters[4]!));
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: reverse, errorLabel: "USED_REVERSE_ALPHABET_POSITION" },
      { value: previous, errorLabel: "REPEATED_PREVIOUS_NUMBER" },
      { value: String(Math.max(1, oneBasedPosition(target) - 1)), errorLabel: "COUNTED_ONE_SHORT" },
      { value: String(Math.min(26, oneBasedPosition(target) + 1)), errorLabel: "COUNTED_ONE_EXTRA" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Which number replaces the question mark?", "प्रश्नवाचक चिन्ह के स्थान पर कौन-सी संख्या आएगी?", "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?")}\n${shown.join(", ")}, ${target}?`,
      correct,
      optionResult,
      [
        text(locale, "Each number is the alphabet position of the letter beside it.", "हर संख्या उसके साथ दिए अक्षर का वर्णमाला स्थान है।", "ਹਰ ਸੰਖਿਆ ਉਸਦੇ ਨਾਲ ਦਿੱਤੇ ਅੱਖਰ ਦਾ ਵਰਣਮਾਲਾ ਸਥਾਨ ਹੈ।"),
        `${target} = ${oneBasedPosition(target)}.`,
        `${text(locale, "Therefore the missing number is", "अतः लुप्त संख्या है", "ਇਸ ਲਈ ਗੁੰਮ ਸੰਖਿਆ ਹੈ")} ${correct}.`,
      ],
      { activeChannels: 1, relationalBinding: true, targetAlphabetPosition: oneBasedPosition(target) },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate020(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-020" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 137 + attempt * 1009 + 20);
    const pairs = Array.from({ length: 4 }, () => {
      const left = letterAtOneBased(integer(next, 1, 26));
      let right = letterAtOneBased(integer(next, 1, 26));
      if (right === left) right = letterAtOneBased(oneBasedPosition(right) + 3);
      return { left, right };
    });
    const complete = pairs.slice(0, 3).map(({ left, right }) => `${left}${oneBasedPosition(left) + oneBasedPosition(right)}${right}`);
    const target = pairs[3]!;
    const leftPos = oneBasedPosition(target.left);
    const rightPos = oneBasedPosition(target.right);
    const correct = String(leftPos + rightPos);
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: String(Math.abs(leftPos - rightPos)), errorLabel: "SUBTRACTED_OUTER_POSITIONS" },
      { value: String(leftPos), errorLabel: "USED_LEFT_POSITION_ONLY" },
      { value: String(rightPos), errorLabel: "USED_RIGHT_POSITION_ONLY" },
      { value: String(leftPos + rightPos - 1), errorLabel: "SUMMED_ONE_SHORT" },
      { value: String(leftPos + rightPos + 1), errorLabel: "SUMMED_ONE_EXTRA" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Find the number that replaces the question mark.", "प्रश्नवाचक चिन्ह के स्थान की संख्या ज्ञात कीजिए।", "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਵਾਲੀ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।")}\n${complete.join(", ")}, ${target.left}?${target.right}`,
      correct,
      optionResult,
      [
        text(locale, "In every term, add the alphabet positions of the two outer letters.", "हर पद में दोनों बाहरी अक्षरों के वर्णमाला स्थान जोड़ें।", "ਹਰ ਪਦ ਵਿੱਚ ਦੋਵੇਂ ਬਾਹਰੀ ਅੱਖਰਾਂ ਦੇ ਵਰਣਮਾਲਾ ਸਥਾਨ ਜੋੜੋ।"),
        `${target.left} = ${leftPos}, ${target.right} = ${rightPos}; ${leftPos} + ${rightPos} = ${correct}.`,
        `${text(locale, "So the missing number is", "इसलिए लुप्त संख्या है", "ਇਸ ਲਈ ਗੁੰਮ ਸੰਖਿਆ ਹੈ")} ${correct}.`,
      ],
      { activeChannels: 3, relationalBinding: true },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate021(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-021" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 139 + attempt * 1009 + 21);
    const aStart = integer(next, 1, 26);
    const bStart = integer(next, 1, 26);
    const aJump = pick(next, [2, 3, 4] as const);
    const bJump = pick(next, [2, 3, 4] as const);
    const firstNumber = integer(next, 2, 15);
    const firstGap = integer(next, 3, 8);
    const gapIncrement = pick(next, [1, 2, 3] as const);
    const numbers = [firstNumber];
    for (let index = 1; index < 5; index += 1) {
      numbers.push(numbers[index - 1]! + firstGap + (index - 1) * gapIncrement);
    }
    const token = (index: number, n = numbers[index]!) => `${letterAtOneBased(aStart + aJump * index)}${letterAtOneBased(bStart + bJump * index)}${n}`;
    const terms = Array.from({ length: 5 }, (_, index) => token(index));
    const correct = terms[3]!;
    const correctNumber = numbers[3]!;
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: token(3, numbers[2]! + firstGap + gapIncrement), errorLabel: "REPEATED_PREVIOUS_NUMBER_GAP" },
      { value: `${letterAtOneBased(aStart + aJump * 2)}${letterAtOneBased(bStart + bJump * 3)}${correctNumber}`, errorLabel: "FAILED_FIRST_LETTER_STEP" },
      { value: `${letterAtOneBased(aStart + aJump * 3)}${letterAtOneBased(bStart + bJump * 2)}${correctNumber}`, errorLabel: "FAILED_SECOND_LETTER_STEP" },
      { value: token(3, correctNumber + gapIncrement), errorLabel: "ADVANCED_NUMBER_GAP_TOO_FAR" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Which term replaces the question mark?", "प्रश्नवाचक चिन्ह के स्थान पर कौन-सा पद आएगा?", "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜਾ ਪਦ ਆਵੇਗਾ?")}\n${terms[0]}, ${terms[1]}, ${terms[2]}, ?, ${terms[4]}`,
      correct,
      optionResult,
      [
        `${text(locale, "First-letter step", "पहले अक्षर की चाल", "ਪਹਿਲੇ ਅੱਖਰ ਦੀ ਚਾਲ")}: ${signed(aJump)}; ${text(locale, "second-letter step", "दूसरे अक्षर की चाल", "ਦੂਜੇ ਅੱਖਰ ਦੀ ਚਾਲ")}: ${signed(bJump)}.`,
        `${text(locale, "Number gaps", "संख्या-अंतर", "ਸੰਖਿਆ ਅੰਤਰ")}: ${firstGap}, ${firstGap + gapIncrement}, ${firstGap + 2 * gapIncrement}, ${firstGap + 3 * gapIncrement}.`,
        `${terms[2]} → ${correct} → ${terms[4]}.`,
      ],
      { activeChannels: 3, progressiveJump: true, internalMissingTerm: true, alphabetWrap: aStart + aJump * 4 > 26 || bStart + bJump * 4 > 26 },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate022(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-022" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 149 + attempt * 1009 + 22);
    const numberStart = integer(next, 2, 15);
    const numberFirstJump = integer(next, 1, 4);
    const numberJumpIncrement = pick(next, [1, 2, 3] as const);
    const letterStart = integer(next, 1, 26);
    const letterFirstJump = pick(next, [1, 2, 3] as const);
    const letterJumpIncrement = pick(next, [1, 2] as const);
    const states: { number: number; letter: string }[] = [{ number: numberStart, letter: letterAtOneBased(letterStart) }];
    for (let transition = 0; transition < 4; transition += 1) {
      const previous = states.at(-1)!;
      states.push({
        number: previous.number + numberFirstJump + transition * numberJumpIncrement,
        letter: letterAtOneBased(oneBasedPosition(previous.letter) + letterFirstJump + transition * letterJumpIncrement),
      });
    }
    const format = (state: { number: number; letter: string }) => `${state.number}${state.letter}`;
    const shown = states.slice(0, 4).map(format);
    const correct = format(states[4]!);
    const last = states[3]!;
    const nextNumberJump = numberFirstJump + 3 * numberJumpIncrement;
    const nextLetterJump = letterFirstJump + 3 * letterJumpIncrement;
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: `${last.number + numberFirstJump + 2 * numberJumpIncrement}${letterAtOneBased(oneBasedPosition(last.letter) + letterFirstJump + 2 * letterJumpIncrement)}`, errorLabel: "REPEATED_PREVIOUS_JUMPS" },
      { value: `${last.number + nextNumberJump}${letterAtOneBased(oneBasedPosition(last.letter) + letterFirstJump + 2 * letterJumpIncrement)}`, errorLabel: "NUMBER_PROGRESSIVE_LETTER_LAGGED" },
      { value: `${last.number + numberFirstJump + 2 * numberJumpIncrement}${letterAtOneBased(oneBasedPosition(last.letter) + nextLetterJump)}`, errorLabel: "LETTER_PROGRESSIVE_NUMBER_LAGGED" },
      { value: `${last.number + nextNumberJump + numberJumpIncrement}${letterAtOneBased(oneBasedPosition(last.letter) + nextLetterJump + letterJumpIncrement)}`, errorLabel: "ADVANCED_BOTH_JUMPS_TOO_FAR" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Select the next alphanumeric term.", "अगला अक्षर-संख्या पद चुनिए।", "ਅਗਲਾ ਅੱਖਰ-ਸੰਖਿਆ ਪਦ ਚੁਣੋ।")}\n${shown.join(", ")}, ?`,
      correct,
      optionResult,
      [
        `${text(locale, "Number jumps", "संख्या की छलांगें", "ਸੰਖਿਆ ਦੀਆਂ ਛਾਲਾਂ")}: ${shown.slice(0, 3).map((_, index) => numberFirstJump + index * numberJumpIncrement).join(", ")}; ${text(locale, "next", "अगली", "ਅਗਲੀ")}: ${nextNumberJump}.`,
        `${text(locale, "Letter jumps", "अक्षर की छलांगें", "ਅੱਖਰ ਦੀਆਂ ਛਾਲਾਂ")}: ${shown.slice(0, 3).map((_, index) => letterFirstJump + index * letterJumpIncrement).join(", ")}; ${text(locale, "next", "अगली", "ਅਗਲੀ")}: ${nextLetterJump}.`,
        `${shown.at(-1)} → ${correct}.`,
      ],
      { activeChannels: 2, progressiveJump: true, alphabetWrap: letterStart + letterFirstJump * 4 + letterJumpIncrement * 6 > 26 },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate023(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-023" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 151 + attempt * 1009 + 23);
    const startRoot = integer(next, 1, 16);
    const shownCount = integer(next, 4, 7);
    const direction = pick(next, [1, -1] as const);
    if (direction < 0 && startRoot - shownCount < 1) continue;
    const roots = Array.from({ length: shownCount + 1 }, (_, index) => startRoot + direction * index);
    const token = (root: number) => {
      const square = root * root;
      return `${letterAtOneBased(square)}${square}`;
    };
    const shown = roots.slice(0, -1).map(token);
    const correctRoot = roots.at(-1)!;
    const correctSquare = correctRoot * correctRoot;
    const correct = token(correctRoot);
    const previousRoot = roots.at(-2)!;
    const nextLinearLetter = letterAtOneBased(oneBasedPosition(letterAtOneBased(previousRoot * previousRoot)) + direction);
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: `${nextLinearLetter}${correctSquare}`, errorLabel: "MOVED_LETTER_LINEarly_NOT_BY_SQUARE" },
      { value: `${letterAtOneBased(correctRoot)}${correctSquare}`, errorLabel: "USED_ROOT_POSITION_FOR_LETTER" },
      { value: token(previousRoot), errorLabel: "REPEATED_PREVIOUS_SQUARE" },
      { value: `${letterAtOneBased(correctSquare + direction)}${correctSquare + direction}`, errorLabel: "USED_LINEAR_NUMBER_STEP" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Which term comes next?", "अगला पद कौन-सा होगा?", "ਅਗਲਾ ਪਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?")}\n${shown.join(", ")}, ?`,
      correct,
      optionResult,
      [
        text(locale, "The numbers are consecutive squares. The letter is the wrapped alphabet position of that square.", "संख्याएँ क्रमागत वर्ग हैं। अक्षर उसी वर्ग संख्या के चक्रीय वर्णमाला स्थान पर है।", "ਸੰਖਿਆਵਾਂ ਲਗਾਤਾਰ ਵਰਗ ਹਨ। ਅੱਖਰ ਉਸੇ ਵਰਗ ਸੰਖਿਆ ਦੇ ਚੱਕਰੀ ਵਰਣਮਾਲਾ ਸਥਾਨ ਤੇ ਹੈ।"),
        `${correctRoot}² = ${correctSquare}; ${correctSquare} → ${letterAtOneBased(correctSquare)}.`,
        `${text(locale, "Therefore the next term is", "अतः अगला पद है", "ਇਸ ਲਈ ਅਗਲਾ ਪਦ ਹੈ")} ${correct}.`,
      ],
      { activeChannels: 2, squareCoupling: true, alphabetWrap: correctSquare > 26, direction },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate024(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-024" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 157 + attempt * 1009 + 24);
    const jump = pick(next, [2, 3, 4, 5] as const);
    const shownCount = integer(next, 3, 5);
    const start = integer(next, 1, 26 - jump * shownCount);
    const positions = Array.from({ length: shownCount + 1 }, (_, index) => start + jump * index);
    const token = (position: number) => `${letterAtOneBased(position)}${position * position}`;
    const shown = positions.slice(0, -1).map(token);
    const targetPos = positions.at(-1)!;
    const correct = token(targetPos);
    const previousPos = positions.at(-2)!;
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: `${letterAtOneBased(targetPos)}${targetPos}`, errorLabel: "USED_LETTER_POSITION_NOT_SQUARE" },
      { value: `${letterAtOneBased(previousPos)}${targetPos * targetPos}`, errorLabel: "FAILED_LETTER_STEP" },
      { value: token(previousPos), errorLabel: "REPEATED_PREVIOUS_TERM" },
      { value: `${letterAtOneBased(targetPos + 1)}${(targetPos + 1) * (targetPos + 1)}`, errorLabel: "MOVED_ONE_EXTRA_LETTER" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Complete the series.", "श्रृंखला पूरी कीजिए।", "ਲੜੀ ਪੂਰੀ ਕਰੋ।")}\n${shown.join(", ")}, ?`,
      correct,
      optionResult,
      [
        `${text(locale, "Letters move by", "अक्षर आगे बढ़ते हैं", "ਅੱਖਰ ਅੱਗੇ ਵਧਦੇ ਹਨ")} ${jump} ${text(locale, "places each time", "स्थान हर बार", "ਥਾਂ ਹਰ ਵਾਰ")}.`,
        `${text(locale, "The number is the square of the displayed letter's alphabet position", "संख्या प्रदर्शित अक्षर के वर्णमाला स्थान का वर्ग है", "ਸੰਖਿਆ ਦਿੱਤੇ ਅੱਖਰ ਦੇ ਵਰਣਮਾਲਾ ਸਥਾਨ ਦਾ ਵਰਗ ਹੈ")}.`,
        `${letterAtOneBased(targetPos)} = ${targetPos}; ${targetPos}² = ${targetPos * targetPos}; ${text(locale, "answer", "उत्तर", "ਉੱਤਰ")}: ${correct}.`,
      ],
      { activeChannels: 2, squareCoupling: true, letterJump: jump },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate025(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-025" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 163 + attempt * 1009 + 25);
    const letterJump = pick(next, [1, 2, 3] as const);
    const startLetter = integer(next, 1, 26 - letterJump * 4);
    const startRoot = integer(next, 2, 8);
    const wrongIndex = integer(next, 1, 3);
    const delta = pick(next, [-3, -2, -1, 1, 2, 3] as const);
    const canonical = Array.from({ length: 5 }, (_, index) => {
      const root = startRoot + index;
      return `${letterAtOneBased(startLetter + letterJump * index)}${root * root}`;
    });
    const wrongRoot = startRoot + wrongIndex;
    const wrongNumber = wrongRoot * wrongRoot + delta;
    if (wrongNumber <= 0) continue;
    const shown = [...canonical];
    shown[wrongIndex] = `${letterAtOneBased(startLetter + letterJump * wrongIndex)}${wrongNumber}`;
    const correct = shown[wrongIndex]!;
    const validTerms = canonical.filter((_, index) => index !== wrongIndex).slice(0, 4);
    const optionResult = buildOptions(qlId, seed, correct, validTerms.map((value, index) => ({
      value,
      errorLabel: `VALID_TERM_${index + 1}`,
    })));
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Which term is wrong in the series?", "श्रृंखला में कौन-सा पद गलत है?", "ਲੜੀ ਵਿੱਚ ਕਿਹੜਾ ਪਦ ਗਲਤ ਹੈ?")}\n${shown.join(", ")}`,
      correct,
      optionResult,
      [
        `${text(locale, "Letters move by", "अक्षर आगे बढ़ते हैं", "ਅੱਖਰ ਅੱਗੇ ਵਧਦੇ ਹਨ")} ${letterJump} ${text(locale, "places each time", "स्थान हर बार", "ਥਾਂ ਹਰ ਵਾਰ")}.`,
        `${text(locale, "The numbers should be consecutive squares starting from", "संख्याएँ क्रमागत वर्ग होनी चाहिए, शुरुआत", "ਸੰਖਿਆਵਾਂ ਲਗਾਤਾਰ ਵਰਗ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ, ਸ਼ੁਰੂਆਤ")} ${startRoot}².`,
        `${correct}: ${text(locale, "the expected number is", "अपेक्षित संख्या है", "ਉਮੀਦ ਕੀਤੀ ਸੰਖਿਆ ਹੈ")} ${wrongRoot * wrongRoot}, ${text(locale, "not", "न कि", "ਨਾ ਕਿ")} ${wrongNumber}.`,
      ],
      { activeChannels: 2, squareCoupling: true, wrongTermDetection: true, wrongIndex },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate026(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-026" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 167 + attempt * 1009 + 26);
    const firstLetter = letterAtOneBased(integer(next, 1, 26));
    let secondLetter = letterAtOneBased(integer(next, 1, 26));
    if (secondLetter === firstLetter) secondLetter = letterAtOneBased(oneBasedPosition(secondLetter) + 5);
    const digit = String(integer(next, 1, 9));
    const base = `${firstLetter}${digit}${secondLetter}`;
    const direction = pick(next, ["LEFT", "RIGHT"] as const);
    const move = direction === "LEFT" ? rotateLeft : rotateRight;
    const second = move(base);
    const correct = move(second);
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: base, errorLabel: "REPEATED_STARTING_TOKEN" },
      { value: direction === "LEFT" ? rotateRight(second) : rotateLeft(second), errorLabel: "ROTATED_OPPOSITE_DIRECTION" },
      { value: second, errorLabel: "REPEATED_PREVIOUS_TOKEN" },
      { value: `${second[1]}${second[0]}${second[2]}`, errorLabel: "SWAPPED_FIRST_TWO_ONLY" },
      { value: `${second[0]}${second[2]}${second[1]}`, errorLabel: "SWAPPED_LAST_TWO_ONLY" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Select the next alphanumeric term.", "अगला अक्षर-संख्या पद चुनिए।", "ਅਗਲਾ ਅੱਖਰ-ਸੰਖਿਆ ਪਦ ਚੁਣੋ।")}\n${base}, ${second}, ?`,
      correct,
      optionResult,
      [
        `${text(locale, "The same three characters are rotated one place", "वही तीन चिह्न एक स्थान घुमते हैं", "ਉਹੀ ਤਿੰਨ ਚਿੰਨ੍ਹ ਇੱਕ ਥਾਂ ਘੁੰਮਦੇ ਹਨ")} ${direction === "LEFT" ? text(locale, "to the left", "बाईं ओर", "ਖੱਬੇ ਪਾਸੇ") : text(locale, "to the right", "दाईं ओर", "ਸੱਜੇ ਪਾਸੇ")}.`,
        `${base} → ${second} → ${correct}.`,
        `${text(locale, "No character changes; only its position changes.", "कोई चिह्न नहीं बदलता; केवल उसका स्थान बदलता है।", "ਕੋਈ ਚਿੰਨ੍ਹ ਨਹੀਂ ਬਦਲਦਾ; ਸਿਰਫ਼ ਉਸਦੀ ਥਾਂ ਬਦਲਦੀ ਹੈ।")}`,
      ],
      { activeChannels: 3, rotation: true, rotationDirection: direction },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

function generate027(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-027" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 173 + attempt * 1009 + 27);
    const jump = pick(next, [2, 3, 4] as const);
    const firstStart = integer(next, 1, 26);
    const secondStart = integer(next, 1, 26);
    const rootStart = integer(next, 2, 8);
    const token = (index: number) => {
      const root = rootStart + index;
      return `${letterAtOneBased(firstStart + jump * index)}${root * root}${letterAtOneBased(secondStart - jump * index)}`;
    };
    const shown = [token(0), token(1), token(2)];
    const correct = token(3);
    const targetRoot = rootStart + 3;
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: `${letterAtOneBased(firstStart + jump * 2)}${targetRoot * targetRoot}${letterAtOneBased(secondStart - jump * 3)}`, errorLabel: "FAILED_FIRST_LETTER_STEP" },
      { value: `${letterAtOneBased(firstStart + jump * 3)}${targetRoot * targetRoot}${letterAtOneBased(secondStart - jump * 2)}`, errorLabel: "FAILED_SECOND_LETTER_STEP" },
      { value: `${letterAtOneBased(firstStart + jump * 3)}${(targetRoot - 1) * (targetRoot - 1)}${letterAtOneBased(secondStart - jump * 3)}`, errorLabel: "REPEATED_PREVIOUS_SQUARE" },
      { value: `${letterAtOneBased(firstStart - jump * 3)}${targetRoot * targetRoot}${letterAtOneBased(secondStart + jump * 3)}`, errorLabel: "REVERSED_BOTH_LETTER_DIRECTIONS" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Which alphanumeric cluster comes next?", "अगला अक्षर-संख्या समूह कौन-सा होगा?", "ਅਗਲਾ ਅੱਖਰ-ਸੰਖਿਆ ਸਮੂਹ ਕਿਹੜਾ ਹੋਵੇਗਾ?")}\n${shown.join(", ")}, ?`,
      correct,
      optionResult,
      [
        `${text(locale, "The first letter moves", "पहला अक्षर चलता है", "ਪਹਿਲਾ ਅੱਖਰ ਚਲਦਾ ਹੈ")} ${signed(jump)}; ${text(locale, "the last letter moves", "अंतिम अक्षर चलता है", "ਆਖਰੀ ਅੱਖਰ ਚਲਦਾ ਹੈ")} ${signed(-jump)}.`,
        `${text(locale, "The numbers are consecutive squares", "संख्याएँ क्रमागत वर्ग हैं", "ਸੰਖਿਆਵਾਂ ਲਗਾਤਾਰ ਵਰਗ ਹਨ")}: ${rootStart}², ${rootStart + 1}², ${rootStart + 2}², ${targetRoot}².`,
        `${shown.at(-1)} → ${correct}.`,
      ],
      { activeChannels: 3, squareCoupling: true, alphabetWrap: firstStart + jump * 3 > 26 || secondStart - jump * 3 < 1 },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

const BLOCK_MASKS: readonly (readonly number[])[] = [
  [2, 3, 5, 10, 15],
  [3, 6, 9, 12, 14],
  [2, 7, 9, 13, 15],
  [5, 6, 11, 12, 14],
  [3, 7, 10, 13, 14],
  [2, 5, 9, 11, 15],
  [3, 6, 10, 12, 15],
  [2, 7, 9, 12, 14],
  [5, 6, 10, 13, 15],
  [3, 7, 11, 12, 14],
  [2, 6, 9, 13, 15],
  [3, 5, 10, 12, 14],
];

function generate028(seed: number, locale: SerCp008Locale): GeneratedSerCp008Question {
  const qlId = "SER-QL-028" as const;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const next = randomSource(seed * 179 + attempt * 1009 + 28);
    const start = integer(next, 1, 18);
    const full: string[] = [];
    for (let block = 0; block < 4; block += 1) {
      const first = start + block * 2;
      const second = first + 1;
      full.push(String(first), String(second), letterAtOneBased(first), letterAtOneBased(second));
    }
    const mask = pick(next, BLOCK_MASKS);
    const displayed = full.map((value, index) => mask.includes(index) ? "_" : value);
    const missing = mask.map((index) => full[index]!);
    const correct = missing.join(" ");
    const shiftedLetters = missing.map((value) => /^[A-Z]$/.test(value) ? letterAtOneBased(oneBasedPosition(value) + 1) : value).join(" ");
    const shiftedNumbers = missing.map((value) => /^\d+$/.test(value) ? String(Number(value) + 1) : value).join(" ");
    const optionResult = buildOptions(qlId, seed, correct, [
      { value: [...missing].reverse().join(" "), errorLabel: "REVERSED_BLANK_ORDER" },
      { value: shiftedLetters, errorLabel: "SHIFTED_LETTER_CORRESPONDENCE" },
      { value: shiftedNumbers, errorLabel: "SHIFTED_NUMBER_SEQUENCE" },
      { value: missing.map((value, index) => index % 2 === 0 ? value : missing[(index + 1) % missing.length]!).join(" "), errorLabel: "MISALIGNED_BLANKS" },
    ]);
    if (!optionResult) continue;
    return generated(
      qlId,
      seed,
      locale,
      `${text(locale, "Choose the entries that fill the blanks from left to right.", "रिक्त स्थानों को बाएँ से दाएँ भरने वाली प्रविष्टियाँ चुनिए।", "ਖਾਲੀ ਥਾਵਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਭਰਨ ਵਾਲੀਆਂ ਐਂਟਰੀਆਂ ਚੁਣੋ।")}\n${displayed.join(" ")}`,
      correct,
      optionResult,
      [
        text(locale, "Read the row in blocks: two consecutive numbers are followed by the letters having those alphabet positions.", "पंक्ति को खंडों में पढ़ें: दो क्रमागत संख्याओं के बाद उन्हीं वर्णमाला स्थानों वाले अक्षर आते हैं।", "ਕਤਾਰ ਨੂੰ ਖੰਡਾਂ ਵਿੱਚ ਪੜ੍ਹੋ: ਦੋ ਲਗਾਤਾਰ ਸੰਖਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਉਹਨਾਂ ਹੀ ਵਰਣਮਾਲਾ ਸਥਾਨਾਂ ਵਾਲੇ ਅੱਖਰ ਆਉਂਦੇ ਹਨ।"),
        `${text(locale, "Completed row", "पूर्ण पंक्ति", "ਪੂਰੀ ਕਤਾਰ")}: ${full.join(" ")}.`,
        `${text(locale, "The blanks from left to right are", "बाएँ से दाएँ रिक्त स्थान हैं", "ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਖਾਲੀ ਥਾਵਾਂ ਹਨ")}: ${correct}.`,
      ],
      { activeChannels: 2, relationalBinding: true, multiBlankCompletion: true, blankCount: mask.length },
    );
  }
  throw new Error(`${qlId} could not generate a valid instance for seed ${seed}.`);
}

export function generateSerCp008Mixed(
  qlId: SerCp008MixedQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("SER-CP-008 seed must be a non-negative integer.");
  switch (qlId) {
    case "SER-QL-019": return generate019(seed, locale);
    case "SER-QL-020": return generate020(seed, locale);
    case "SER-QL-021": return generate021(seed, locale);
    case "SER-QL-022": return generate022(seed, locale);
    case "SER-QL-023": return generate023(seed, locale);
    case "SER-QL-024": return generate024(seed, locale);
    case "SER-QL-025": return generate025(seed, locale);
    case "SER-QL-026": return generate026(seed, locale);
    case "SER-QL-027": return generate027(seed, locale);
    case "SER-QL-028": return generate028(seed, locale);
  }
}
